module.exports = class Logger {

    constructor(implementation) {
        this.logger = chooseImplementation(implementation);
    }

    error(message) {
        this.logger.error(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    info(message) {
        this.logger.info(message);
    }

    debug(message) {
        this.logger.debug(message);
    }

    verbose(message) {
        this.logger.verbose(message);
    }
}

const NODE_CONFIG_DIR = 'NODE_CONFIG_DIR';

const chooseImplementation = (implementation) => {
    const impl = implementation || 'winston';
    process.env[NODE_CONFIG_DIR] = __dirname + "/config/";
    const config = require('config');
    const IMPL_PATH = config.get(`${impl}.path`);
    return require(`${__dirname}${IMPL_PATH}`);
}

