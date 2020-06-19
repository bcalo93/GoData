const Config = require('config')
const Arena = require('bull-arena')

function init() {
    const host = Config.get('redis.host')
    const queueConfig = Config.get('redis.queue')
    const queue = {
        name: queueConfig.name,
        hostId: queueConfig.host,
        redis: { host: host }
    }
    Arena({ queues: [queue] })
}

init()