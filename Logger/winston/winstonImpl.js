const WINSTON_OPTION = 'winston.configuration'

const { createLogger } = require('winston');

const option = () => {
    const config = require('config');
    const CONFIG_PATH = config.get(WINSTON_OPTION);
    return require(CONFIG_PATH);
}

const log = createLogger(option());
module.exports = log;

        