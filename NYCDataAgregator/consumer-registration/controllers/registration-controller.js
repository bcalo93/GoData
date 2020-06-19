const registration = require('../services/api-registration-service')

const registerConsumer = async (req, res, next) => {
  const consumerData = req.body
  try {
    let result = await registration.registerConsumer(consumerData)
    console.log('Consumer registered.')
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