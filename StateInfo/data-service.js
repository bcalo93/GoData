const config = require('config')
const redis = require('redis')
const HttpClient = require('./http-client')
const util = require("util")
const { EventEmitter } = require('events')
const axiosConfig = config.get('axios_config')

const dataConfig = config.get('data_config')

module.exports = class DataService {

    static initialize() {
        const emitter = new EventEmitter()
        this.httpClient = new HttpClient(axiosConfig)
        this.redisClient = redis.createClient()
        this.redisClient.on("error", function(error) {
            emitter.emit('redis_error',error)
        });
        this.cacheGetAsync = util.promisify(this.redisClient.hget).bind(this.redisClient)
        this.cacheExistsAsync = util.promisify(this.redisClient.hexists).bind(this.redisClient)
        this.cacheSetAsync = util.promisify(this.redisClient.hset).bind(this.redisClient)
        this.cacheGetAllAsync = util.promisify(this.redisClient.hgetall).bind(this.redisClient)
        return emitter
    }

    static getType = (plate) => {
        return this.get(dataConfig.plates, plate)
    }
    
    static getState = (code) => {
        return this.get(dataConfig.states, code)
    }

    static get = async(config, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                if(await this.cacheExistsAsync(config.key,id)){
                    let result = JSON.parse(await this.cacheGetAsync(config.key,id))
                    resolve(result.value)
                } else {
                    try{
                        console.log(`consultando API ${config.uri} ${id}`)
                        let data = this.getAndSetFromApi(config, id)
                        resolve(data)
                    } catch(error) {
                        reject('Error getting info from StateData')
                    }
                }
            } catch(error) {
                reject(error)
            }
        })
    }

    static getAndSetFromApi = async(config, id) => {
        let result = await this.httpClient.getWithParam(config.uri, id)
        let data = result.data[config.field]
        await this.cacheSetAsync(config.key,id,
            JSON.stringify(
            {
                value:data,
                since:Date.now()
            }))
        return data
    }

    static initDataUpdater = async () => {
        const interval = dataConfig.update_interval * 1000 * 60
        this.interval = setInterval(async () => {
            await this.update(dataConfig.plates)
            await this.update(dataConfig.states)
        }, interval)
    }

    static stopDataUpdater = () => {
        clearInterval(this.interval);
    }

    static update = async (config) => {
        let data = await this.cacheGetAllAsync(config.key)
        for(const key in data){
            const info = JSON.parse(data[key])
            const staleTime = dataConfig.stale_since_m * 1000 * 60
            
            if((Date.now() - info.since) > staleTime){
                console.log(`[${key}] Old data detected. Updating`)
                try {
                    await this.getAndSetFromApi(config,key)
                } catch(err) {
                    console.log(err)
                }
            }
            console.log(info)
        }
    }
}