module.exports = class AbstractPublisher {
    constructor(channel) {
        this.channel = channel
    }
    async publish(message) {
        throw new Error('Not implemented')
    }
}