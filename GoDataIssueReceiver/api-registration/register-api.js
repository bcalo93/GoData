const config = require('config')
const HttpService = require('./http-client')
const fs = require('fs')

const jwt = require('jsonwebtoken')
const secretKey = fs.readFileSync('./api-registration/security/private.key', 'utf8')

const signOptions = {
 expiresIn: "24h",
 algorithm: "RS256"
}

const registerApi = async() => {
    let errors = []
    let providers = config.get('data_providers')

    for(provider of providers){
        let endpoint = provider.endpoint
        let registrationData = generateRegistrationObject(provider)
        console.log(`Registering to ${endpoint}.`)
        try {
            await HttpService.postRegistry(endpoint, registrationData)
            console.log(`Registered to ${endpoint}`)
        } catch(err) {
            errors.push(`Registering to ${endpoint}. ${err}`)
        } 
    }

    if(errors.length > 0) {
        throw new Error(errors)
    }
}

const generateRegistrationObject = (provider) => {
    let regData = config.get('registration_data')
    let token  = generateToken(provider)
    let registration = {
        "name":     regData.name,
        "method":   regData.method,
        "endpoint": regData.endpoint,
        "format":   regData.format,
        "token":    token
    }
    return registration
}

const generateToken = (provider) => {
    return jwt.sign(provider, secretKey, signOptions)
}

module.exports = {
    registerApi
}