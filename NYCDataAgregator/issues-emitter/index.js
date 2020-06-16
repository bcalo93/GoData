const Sender = require('./sender')

const initialize = async () => {
    try {
        await Sender.initialize()
        await Sender.sendIssues()
    } catch (err) {
        console.log(`Error on Sender: ${err}`)
    }
}

module.exports = {
    initialize
}