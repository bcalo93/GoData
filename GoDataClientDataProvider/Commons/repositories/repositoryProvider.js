const config = require('config');

module.exports = (type) => {
    const implementation = config.get(`repositories.${type}.implementation`);
    if (!implementation) {
        throw new Error('Implementation not found');
    }
    return require(implementation);
}