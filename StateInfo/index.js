const config = require('config')

const stateInfo = require(config.get('state_info.implementation'))

module.exports = stateInfo