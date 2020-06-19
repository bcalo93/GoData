const config = require('config');
const FilterService = require('./serviceProvider')('FilterService');
const Queue = require('bull');
const RegistryRepository = require('./../dependencies/Commons').repositoryProvider('RegistryRepository');

const REDIS_CONNECTION = config.get('queues.redisConnection');
const UPCOMING_DATA = config.get('queues.upcomingData');

module.exports = class TransformationService {
    constructor() {
        this.registryRepository = new RegistryRepository();
        this.filterService = new FilterService();
        this.upcomingData = new Queue(UPCOMING_DATA, REDIS_CONNECTION);
    }

    start() {
        this.filterService.startListening();
        this.upcomingData.process(async (job, done) => {
            try {
                const registries = await this.registryRepository.findAll();
                registries.forEach(registry => {
                    this.filterService.run({
                        input: job.data,
                        context: registry
                    });
                });
                done();
            } catch(err) {
                // TODO: Log logic goes here.
                console.log('ErrorTransformationService');
                console.log(err);
                done(err);
            }
        });
    }
}