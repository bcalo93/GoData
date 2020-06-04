const Sender = require('./sender')

const initialize = () => {
    try {
        Sender.initialize()
    } catch (err) {
        console.log(`Error initializing Sender: ${err}`)
    }
}

module.exports = {
    initialize
}