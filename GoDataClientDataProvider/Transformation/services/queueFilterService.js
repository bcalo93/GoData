const filters = require('./../filters');
const Queue = require('bull');
const config = require('config');
const SenderService = require('./serviceProvider')('SenderService');

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
                const { context, input } = job.data;
                const currentIndex = context.filters.findIndex(filter => filter.name === element.name);
                element.filter(input, (error, result) => {
                    if (error) {
                        console.log(`ERROR: ${error}`);
                        done(new Error(error));
                        return;
                    }

                    if (!result) {
                        done();
                        return;
                    }
                    
                    this.nextQueue(context, currentIndex).add({ input: result, context })
                        .then(() => done())
                        .catch(err => done(err));
                }, context.filters[currentIndex].options);
            });
        });
    }

    startDoneQueue() {
        this.doneQueue.process(async (job, done) => {
            try {
                const { input, context } = job.data;
                await this.senderService.send(input, context);
                done();
            } catch(error) {
                // TODO: Log Goes here
                console.log(error);
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

    async run({ input, context }) {
        const firstFilter = this.queueFilterList
            .find(element => element.name === context.filters[0].name);
        if (!firstFilter) {
            // TODO Logging should goes here or just throw Custom exception.
            console.log('First filter was not found.');
            return;
        }
        try {
            await firstFilter.queue.add({ input, context });
        } catch(err) {
            // TODO Logging should goes here or just throw Custom exception.
            console.log(err);
        }
    }
}