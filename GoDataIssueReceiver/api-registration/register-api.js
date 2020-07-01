const config = require('config')
const HttpService = require('./http-client')
const log = require('../../Logger');
const location = { location: 'register-api' };

const registerApi = async() => {
    let errors = []
    let providers = config.get('data_providers')
    let regData = config.get('registration_data')

    for(endpoint of providers){
        log.info(`Registering to ${endpoint}.`,location)
        try {
            await HttpService.postRegistry(endpoint, regData)
            log.info(`Registered to ${endpoint}`,location)
        } catch(err) {
            errors.push(`Registering to ${endpoint}. ${err}`)
        } 
    }

    if(errors.length > 0) {
        throw new Error(errors)
    }
}

module.exports = {
    registerApi
}