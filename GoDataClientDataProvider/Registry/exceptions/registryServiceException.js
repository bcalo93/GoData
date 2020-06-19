module.exports = class RegistryServiceException extends Error {
    constructor(message, inner) {
        super(message);
        this.name = 'RegistryServiceException';
        this.inner = inner;
    }
}