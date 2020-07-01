const { EventEmitter } = require('events')

module.exports = class AbstractPublisher extends EventEmitter {
    constructor(channel) {
        super()
        this.channel = channel
    }
    async publish(message) {
        throw new Error('Not implemented')
    }
}