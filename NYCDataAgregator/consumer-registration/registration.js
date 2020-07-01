const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const log = require('../../Logger');
const location = { location: 'consumers-registration.registration' }

const app = express()
const port = config.get('webapi.port')
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/nycda', routes)

const initialize = () => {
    app.listen(port, () => log.info(`Consumer registration listening on /nycda/registration port ${port}`,location))
}

module.exports = {
    initialize
}