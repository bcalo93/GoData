process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const log = require('../Logger');
const location = { location: 'NYCDataAgregator.index' };
const ConsumerRegistration = require('./consumer-registration/registration');
const IssuesEmmiter = require('./issues-emitter');

(async() => {
    log.info('NYCDataAgregator starting...', location)
    ConsumerRegistration.initialize()
    await IssuesEmmiter.initialize()
})()
.catch(err => {
    log.error(`An error occurred on initialization: ${err}`, location)
    process.exit(1)
})