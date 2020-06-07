const AbstractPublisher = require('../publisher'),
    config = require('config'),
    Queue = require('bull')

module.exports = class Publisher extends AbstractPublisher {
    constructor(channel) {
        super(channel);
        const redisOpts = config.get('redis_opts')
        this.queue = new Queue(channel, redisOpts);
    }
    publish(message) {
        console.log('Sending message to channel '+this.channel)
        this.queue.add(message);
    }
}