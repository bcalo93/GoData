const AbstractPublisher = require('../publisher'),
    config = require('config'),
    Queue = require('bull')

module.exports = class Publisher extends AbstractPublisher {
    constructor(channel) {
        super(channel)
        this.redisOpts = config.get('redis_opts')
        this.queue = new Queue(channel, this.redisOpts)
        this.queue.on('error', (error) => this.emit('connection-error', error))
        this.queue.on('ready', (error) => this.emit('connection-ready', error))
    }
    async publish(message) {
        await this.queue.add(message)
    }

}