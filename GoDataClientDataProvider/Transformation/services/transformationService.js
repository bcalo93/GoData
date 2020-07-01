const config = require('config');
const FilterService = require('./serviceProvider')('FilterService');
const Queue = require('bull');
const RegistryRepository = require('./../dependencies/Commons').repositoryProvider('RegistryRepository');
const log = require('./../log');

const REDIS_CONNECTION = config.get('queues.redisConnection');
const UPCOMING_DATA = config.get('queues.upcomingData');
const LOCATION = { location: 'TransformationService.upcomingData.process' };

module.exports = class TransformationService {
    constructor() {
        this.registryRepository = new RegistryRepository();
        this.filterService = new FilterService();
        this.upcomingData = new Queue(UPCOMING_DATA, REDIS_CONNECTION);
    }

    start() {
        this.filterService.startListening();
        this.upcomingData.process(async (job, done) => {
            log.info(`Started processing job: ${job.id}`, LOCATION);
            try {
                const registries = await this.registryRepository.findAll();
                registries.forEach(registry => {
                    const { timeStamp, data } = job.data;
                    this.filterService.run({
                        input: data,
                        context: registry,
                        timeStamp
                    });
                });
                done();
            } catch(err) {
                log.error(err, LOCATION);
                done(err);
            }
        });
    }
}