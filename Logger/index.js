const config = require('config');
const LOG_IMPLEMENTATION = config.has('logger.implementation') ? config.get('logger.implementation') : '';
const Logger = require('./logger');
const log = new Logger(LOG_IMPLEMENTATION);
module.exports = log;