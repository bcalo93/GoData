const registration = require('../services/api-registration-service')
const log = require('../../../Logger');
const location = { location: 'consumers-registration.controller' }

const registerConsumer = async (req, res, next) => {
  const consumerData = req.body
  try {
    let result = await registration.registerConsumer(consumerData)
    log.info('Consumer registered.',location)
    res
      .status(201)
      .send(result)
    next()
  } catch(error) {
    res
      .status(500)
      .send(error)
    next(error)
  }
}

module.exports = {
  registerConsumer
}