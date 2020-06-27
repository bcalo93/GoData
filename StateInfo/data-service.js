const config = require('config')
const redis = require('redis')
const client = redis.createClient()
const HttpClient = require('./http-client')
const axiosConfig = config.get('axios_config')
const httpClient = new HttpClient(axiosConfig)
const util = require("util")


client.on("error", function(error) {
    console.error(error);
});

const getAsync = util.promisify(client.hget).bind(client)
const existsAsync = util.promisify(client.hexists).bind(client)
const setAsync = util.promisify(client.hset).bind(client)

const PLATE_CONFIG = config.get('data_config.plates')
const STATE_CONFIG = config.get('data_config.states')

const getType = (plate) => {
    return get(PLATE_CONFIG, plate)
}

const getState = (code) => {
    return get(STATE_CONFIG, code)
}

const get = async(config, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(await existsAsync(config.key,id)){
                let result = JSON.parse(await getAsync(config.key,id))
                resolve(result.value)
            } else {
                try{
                    console.log(`consultando API ${config.uri} ${id}`)
                    let data = getAndSetFromApi(config, id)
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

const getAndSetFromApi = async(config, id) => {
    let result = await httpClient.getWithParam(config.uri, id)
    let data = result.data[config.field]
    await setAsync(config.key,id,
        JSON.stringify(
        {
            value:data,
            since:Date.now()
        }))
    return data
}

module.exports = {
    getType,
    getState
}