const RegistryServiceException = require('./registryServiceException');

module.exports = class ValidationRegistryException extends RegistryServiceException {
    constructor(message, { errors, inner }) {
        super(message, inner);
        this.errors = errors;
    }
}