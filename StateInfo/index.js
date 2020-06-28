const config = require('config')
const default_implementation = './implementations/state-info-redis.js'

const getStateInfo = () => {
    let type = config.get('state_info.implementation') || default_implementation
    
    try{
        return require(type)
    } catch(err) {
        return require(default_implementation)
    }
}

module.exports = getStateInfo()