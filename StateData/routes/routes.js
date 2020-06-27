const express = require('express')
const controller = require('../controllers')
 
const router = express.Router()
 
router.get('/state/:code', controller.getState)
router.get('/plateType/:plate', controller.getType)

module.exports = router