const log = require('./log');
const location = { location: 'index' };

(async() => {
    const receiver = require('./issues-receiver.js')
    const register = require('./api-registration/register-api')
    await register.registerApi()
    receiver.initialize()   
})()
    .catch(err => {
        log.error(`${err}`,location)
        process.exit(1)
    })
