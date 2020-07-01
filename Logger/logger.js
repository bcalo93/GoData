module.exports = class Logger {

    constructor(implementation) {
        this.logger = chooseImplementation(implementation); 
    }

    /**
     * Method used for error level logging
     * @param {string} message Message to log
     * @param options Optional parameters to send metadata to log
     */
    error(message, options) {
        const meta = (!!options) ? { meta: options } : {};
        this.logger.error(message, meta);
    }

    /**
     * Method used for info level logging
     * @param {string} message Message to log
     * @param options Optional parameters to send metadata to log
     */
    warn(message, options) {
        const meta = (!!options) ? { meta: options } : {};
        this.logger.warn(message, meta);
    }

    /**
     * Method used for info level logging
     * @param {string} message Message to log
     * @param options Optional parameters to send metadata to log
     */
    info(message, options) {
        const meta = (!!options) ? { meta: options } : {};
        this.logger.info(message, meta);
    }

    /**
     * Method used for debug level logging
     * @param {string} message Message to log
     * @param options Optional parameters to send metadata to log
     */
    debug(message, options) {
        const meta = (!!options) ? { meta: options } : {};
        this.logger.debug(message, meta);
    }
}

const chooseImplementation = (implementation) => {
    const impl = implementation || 'winston';
    const config = require('config');
    const IMPL_PATH = config.get(`${impl}.path`);
    return require(IMPL_PATH);
}

