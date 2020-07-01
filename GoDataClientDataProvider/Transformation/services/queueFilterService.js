const filters = require('./../filters');
const Queue = require('bull');
const config = require('config');
const SenderService = require('./serviceProvider')('SenderService');
const log = require('./../log');

const REDIS_CONNECTION = config.get('queues.redisConnection');
const COMPLETED_NAME = config.get('queues.completed');

module.exports = class QueueFilterService {
    constructor() {
        this.queueFilterList = filters.map(element => {
            return {
                name: element.name,
                filter: element.filter,
                queue: new Queue(element.name, REDIS_CONNECTION)
            }
        });
        this.doneQueue = new Queue(COMPLETED_NAME, REDIS_CONNECTION);
        this.senderService = new SenderService();
    }

    startListening() {
        this.startFilterQueues();
        this.startDoneQueue();
    }

    startFilterQueues() {
        this.queueFilterList.forEach(element => {
            element.queue.process((job, done) => {
                const { context, input, timeStamp } = job.data;
                const currentIndex = context.filters.findIndex(filter => filter.name === element.name);
                element.filter(input, (error, result) => {
                    if (error) {
                        log.error(error, { location: 'QueueFilterService.startFilterQueues.process' });
                        done(new Error(error));
                        return;
                    }

                    if (!result) {
                        done();
                        return;
                    }
                    
                    this.nextQueue(context, currentIndex).add({ input: result, context, timeStamp })
                        .then(() => done())
                        .catch(err => {
                            log.error(
                                `Could not add to next queue ${JSON.stringify(context.filters[currentIndex])}`,
                                { location: 'QueueFilterService.startFilterQueues.process.nextQueue.catch' });
                            done(err);
                        });
                }, context.filters[currentIndex].options);
            });
        });
    }

    startDoneQueue() {
        this.doneQueue.process(async (job, done) => {
            try {
                const { input, context, timeStamp } = job.data;
                await this.senderService.send(input, { context, timeStamp });
                done();
            } catch(error) {
                log.error(error, { location: 'QueueFilterService.startDoneQueue.process' });
                done(error);
            }
        });
    }

    nextQueue(context, currentIndex) {
        if (context.filters.length === currentIndex + 1) {
            return this.doneQueue;
        } else {
            const nextTaskName = context.filters[currentIndex + 1].name;
            return this.queueFilterList.find(element => element.name === nextTaskName).queue;
        }
    }

    async run(data) {
        const { context } = data;
        const firstFilter = this.queueFilterList
            .find(element => element.name === context.filters[0].name);
        if (!firstFilter) {
            log.error(`First item of pipeline not found: ${context.filters[0].name}`,{
                location: 'QueueFilterService.run' 
            });
            return;
        }
        try {
            await firstFilter.queue.add(data);
        } catch(err) {
            log.error(`Could not start pipeline - Error: ${JSON.stringify(err)}`, {
                location: 'QueueFilterService.run'
            });
        }
    }
}