const config = require('config')
const redis = require('redis')
const HttpClient = require('./http-client')
const util = require("util")
const axiosConfig = config.get('axios_config')
const AbstractStateInfo = require('./state-info')

const dataConfig = config.get('data_config')

class DataService extends AbstractStateInfo {

    constructor() {
        super()        
        this.httpClient = new HttpClient(axiosConfig)
        this.initializeRedis()
    }

    initializeRedis() {
        this.redisReady = false
        this.redisClient = redis.createClient()
        this.redisClient.on('error', (error) => {
            this.redisReady = false
        })
        this.redisClient.on('ready', () => {
            this.redisReady = true
        })
        this.cacheGetAsync = util.promisify(this.redisClient.hget).bind(this.redisClient)
        this.cacheExistsAsync = util.promisify(this.redisClient.hexists).bind(this.redisClient)
        this.cacheSetAsync = util.promisify(this.redisClient.hset).bind(this.redisClient)
    }

    getType(plate) {
        return this.get(dataConfig.plates, plate)
    }
    
    getState(code) {
        return this.get(dataConfig.states, code)
    }

    get(config, id) {
        return new Promise(async (resolve, reject) => {
            try {
                if(this.redisReady && await this.isUpToDate(config.key,id)){
                    let result = JSON.parse(await this.cacheGetAsync(config.key,id))
                    resolve(result.value)
                } else {
                    try{
                        let data = await this.getFromApi(config, id)
                        if(this.redisReady){
                            await this.setCacheValue(config, id, data)
                        }
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

    async isUpToDate(key, id){
        return await this.cacheExistsAsync(key, id)
            && await this.valueIsUpToDate(key, id)
    }

    async valueIsUpToDate(key, id) {
        let value = await this.cacheGetAsync(key, id)
        const info = JSON.parse(value)
        const staleTime = dataConfig.stale_since_m * 1000 * 60
        return ((Date.now() - info.since) < staleTime)
    }

    async getFromApi(config, id) {
        let result = await this.httpClient.getWithParam(config.uri, id)
        return result.data[config.field]
    }

    async setCacheValue(config, id, data) {
        await this.cacheSetAsync(config.key,id,
            JSON.stringify(
            {
                value:data,
                since:Date.now()
            }))
    }
}

module.exports = new DataService()