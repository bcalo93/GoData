const express = require('express')
const controller = require('../controllers/issues-controller')
 
const router = express.Router()
 
router.post('/issues', controller.processIssues)

module.exports = router