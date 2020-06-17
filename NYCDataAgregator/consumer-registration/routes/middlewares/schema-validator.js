const _ = require('lodash')
const Joi = require('joi')
const Schemas = require('../schemas')

module.exports = () => {
    const supportedMethods = ['post']

    const validationOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    }

    return (req, res, next) => {
        const route = req.route.path
        const method = req.method.toLowerCase()

        if (_.includes(supportedMethods, method) && _.has(Schemas, route)) {
            const schema = _.get(Schemas, route)

            if (schema) {
                return Joi.validate(req.body, schema, validationOptions, (err, data) => {
                    if (err) {
                        const JoiError = {
                            status: 'failed',
                            error: {
                                original: err._object,
                                details: _.map(err.details, ({message, type}) => ({
                                    message: message.replace(/['"]/g, ''),
                                    type
                                }))
                            }
                        }
                        res.status(422).json(JoiError)
                    } else {
                        req.body = data
                        next()
                    }
                })
            }
        }
        next()
    }
}