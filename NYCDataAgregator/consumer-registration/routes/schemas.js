const Joi = require('joi')

const consumerSchema = Joi.object().keys({
    name: Joi.string().min(2).required(),
    method: Joi.string().valid(['POST']).uppercase().required(),
    endpoint: Joi.string().uri().required(),
    format: Joi.string().valid(['json','xml']).required(),
    token: Joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).min(10)
})

module.exports = {
    '/registration': consumerSchema
}