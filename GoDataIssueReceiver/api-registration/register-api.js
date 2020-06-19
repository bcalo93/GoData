const config = require('config')
const HttpService = require('./http-client')

const registerApi = async() => {
    let errors = []
    let providers = config.get('data_providers')
    let regData = config.get('registration_data')

    for(endpoint of providers){
        console.log(`Registering to ${endpoint}.`)
        try {
            await HttpService.postRegistry(endpoint, regData)
            console.log(`Registered to ${endpoint}`)
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