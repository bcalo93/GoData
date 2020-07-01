const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const log = require('../Logger');
const location = { location: 'index' };

const app = express()
const port = config.get('port')
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/statedata', routes)

app.listen(port, () => log.info(`StateData listening on port ${port}`,location))