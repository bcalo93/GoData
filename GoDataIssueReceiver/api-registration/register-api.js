const config = require('config')
const HttpService = require('./http-service')

 
const registerApi = async() => {
    let providers = config.get('data_providers')
    let regData = config.get('registration_data')
    let errors = []

    for(provider of providers){
        console.log(`Registering to ${provider}`)
        try {
            await HttpService.postRegistry(provider, regData)
            console.log(`Registered to ${provider}`)
        } catch(err) {
            errors.push(`Registering to ${provider}. ${err}`)
        } 
    }

    if(errors.length > 0) {
        throw Error(errors)
    }
}

module.exports = {
    registerApi
}