const Sender = require('./sender')

const initialize = async () => {
    await Sender.initialize()
    await Sender.sendIssues()
}

module.exports = {
    initialize
}