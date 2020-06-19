const config = require('config');

module.exports = (type) => {
    return require(config.get(`services.${type}.implementation`));
}