const Sender = require('./sender');
const log = require('../../Logger');

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