const RegistryRepository = require('./../dependencies/Commons').repositoryProvider('RegistryRepository');
const Registry = require('./../domain/registry');
const { RegistryServiceException } = require('./../exceptions');

module.exports = class RegistryServiceImp {
    constructor(repository) {
        this.repository = repository || new RegistryRepository();
    }

    async register(registry) {
        registry = new Registry(registry).validate().getAsObject();
        try {
            await this.repository.createOrUpdate(registry);
            return registry;
        } catch(err) {
            throw new RegistryServiceException(
                'An error occurred trying to save the registry', err
            );
        }
    }

    async findAll() {
        try {
            return await this.repository.findAll();
        } catch(err) {
            throw new RegistryServiceException(
                'An error occurred trying to find all registries', err
            );
        }
    }
}