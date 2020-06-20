process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

(async() => {
    const config = require('config')
    const ConsumerRegistration = require('./consumer-registration/registration')
    const IssuesEmmiter = require('./issues-emitter')

    ConsumerRegistration.initialize()
    await IssuesEmmiter.initialize()
})()
.catch(err => {
    console.log(`An error occurred on initialization: ${err}`)
    process.exit(1)
})