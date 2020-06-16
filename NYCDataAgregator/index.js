const config = require('config')
const ConsumerRegistration = require('./consumer-registration/registration')
const IssuesEmmiter = require('./issues-emitter')

try {
    ConsumerRegistration.initialize()
    IssuesEmmiter.initialize()
} catch(err) {
    console.log(`An error occurred on initialization: ${err}`)
}