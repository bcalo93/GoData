const config = require('config')
const default_implementation = './implementations/state-info-redis.js'

const getStateInfo = () => {
    let type = config.get('stateInfo.implementation') || default_implementation
    let Implementation
    
    try{
        Implementation = require(type)
    } catch(err) {
        Implementation = require(default_implementation)
    }

    return new Implementation()
}

module.exports = getStateInfo()