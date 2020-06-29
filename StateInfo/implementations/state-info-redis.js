const config = require('config')
const redis = require('redis')
const { HttpClient, NotFoundError, ConnectionError} = require('./http-client')
const util = require("util")
const axiosConfig = config.get('axiosConfig')
const AbstractStateInfo = require('./state-info')

const dataConfig = config.get('dataConfig')
const redisConnection = config.get('redisConnection')
const NON_EXISTENT = 'non_existent'

class DataService extends AbstractStateInfo {

    constructor() {
        super()        
        this.httpClient = new HttpClient(axiosConfig)
        this.initializeRedis()
    }

    initializeRedis() {
        this.redisReady = false
        this.redisClient = redis.createClient(redisConnection)
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

    existsType(plate) {
        return this.exists(dataConfig.plates, plate)
    }

    existsState(code){
        return this.exists(dataConfig.states, code)
    }

    get(config, id) {
        return new Promise(async (resolve, reject) => {
            try {
                if(this.redisReady && await this.isUpToDate(config.key,id)){
                    let result = JSON.parse(await this.cacheGetAsync(config.key,id))
                    let value = result.value
                    if(value === NON_EXISTENT){
                        reject(`${id} not found.`)
                    }
                    resolve(value)
                } else {
                    try{
                        let data = await this.getFromApi(config, id)
                        if(this.redisReady){
                            await this.setCacheValue(config, id, data)
                        }
                        resolve(data)
                    } catch(error) {
                        if(this.isNotFoundError(error) && this.redisReady){
                            await this.setCacheValue(config, id, NON_EXISTENT)
                        }
                        reject(`${error}. Getting ${id} from StateData.`)
                    }
                }
            } catch(error) {
                reject(error)
            }
        })
    }

    isNotFoundError(error) {
        return (error instanceof NotFoundError)
    }

    exists(config, id){
        return new Promise(async (resolve, reject) => {
            try{
                await this.get(config, id)
                resolve(true)
            } catch(err) {
                resolve(false)
            }
            reject()
        })
    }

    async isUpToDate(key, id){
        return await this.cacheExistsAsync(key, id)
            && await this.valueIsUpToDate(key, id)
    }

    async valueIsUpToDate(key, id) {
        let value = await this.cacheGetAsync(key, id)
        const info = JSON.parse(value)
        const staleTime = dataConfig.StaleSinceMinutes * 1000 * 60
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

module.exports = DataService