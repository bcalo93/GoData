const Joi = require('joi')

const consumerSchema = Joi.object().keys({
    name: Joi.string().min(2).required(),
    method: Joi.string().valid(['POST']).uppercase().required(),
    endpoint: Joi.string().uri().required(),
    format: Joi.string().valid(['json','xml']).required()
})

module.exports = {
    '/registration': consumerSchema
}