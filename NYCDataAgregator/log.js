const config = require('config');
const LOG_IMPLEMENTATION = config.get('logger.implementation') || 'winston';
const Logger = require('../Logger/logger');
const log = new Logger(LOG_IMPLEMENTATION);
module.exports = log;