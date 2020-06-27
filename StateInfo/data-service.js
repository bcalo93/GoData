const config = require('config')
const redis = require('redis')
const HttpClient = require('./http-client')
const util = require("util")
const { EventEmitter } = require('events')

const axiosConfig = config.get('axios_config')

const PLATE_CONFIG = config.get('data_config.plates')
const STATE_CONFIG = config.get('data_config.states')

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
        return emitter
    }

    static getType = (plate) => {
        return this.get(PLATE_CONFIG, plate)
    }
    
    static getState = (code) => {
        return this.get(STATE_CONFIG, code)
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
}