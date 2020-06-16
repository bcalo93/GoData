
(async() => {
    const receiver = require('./issues-receiver.js')
    const register = require('./api-registration/register-api')
    await register.registerApi()
    receiver.initialize()   
})()
    .catch(err => {
        console.error(`${err}`)
        process.exit(1)
    })
