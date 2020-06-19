const redis = require('redis');
const config = require('config');

const IDENTIFIER_KEY = 'id';

module.exports = class RegistryRepositoryImp {
    constructor(callback) {
        this.redisClient = redis.createClient(config.get('redisConnection'));        
        this.collectionName = config.get('repositories.RegistryRepository.collectionName');

        if (callback) {
            this.redisClient.on('error', callback);
        }
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.redisClient.get(this.collectionName, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(JSON.parse(result));
            });
        });
    }

    createOrUpdate(registry) {
        return new Promise((resolve, reject) => {
            this.findAll().then(collection => {
                collection = getUpdatedCollection(collection, registry);
                this.redisClient.set(this.collectionName, JSON.stringify(collection), (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            }).catch(error => reject(error));
        });
    }
}

const getUpdatedCollection = (collection, registry) => {
    if (!collection) {
        collection = [registry];
    } else {
        const index = collection.findIndex(reg => reg[IDENTIFIER_KEY] === registry[IDENTIFIER_KEY]);
        if (index < 0) {
            collection.push(registry);
        } else {
            collection[index] = registry;
        }
    }
    return collection;
}