const express = require('express')
const registrationController = require('../controllers/registration-controller')

const Validator = require('./middlewares/schema-validator')
const validateRequest = Validator()
 
const router = express.Router()
 
router.post('/registration', validateRequest, registrationController.registerConsumer)

module.exports = router