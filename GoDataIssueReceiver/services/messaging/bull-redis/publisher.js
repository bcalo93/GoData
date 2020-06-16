const AbstractPublisher = require('../publisher'),
    config = require('config'),
    Queue = require('bull')

module.exports = class Publisher extends AbstractPublisher {
    constructor(channel) {
        super(channel);
        this.redisOpts = config.get('redis_opts')
        this.queue = new Queue(channel, this.redisOpts);
    }
    async publish(message) {
        this.queue = new Queue(this.channel, this.redisOpts);
        await this.queue.add(message);
    }
}