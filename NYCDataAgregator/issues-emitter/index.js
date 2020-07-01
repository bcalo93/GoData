const Sender = require('./sender');
const log = require('../log');

const initialize = async () => {
    try {
        await Sender.initialize()
        await Sender.sendIssues()
    } catch(error) {
        log.error(error, { location: 'issues-emitter.index' })
    }
}

module.exports = {
    initialize
}