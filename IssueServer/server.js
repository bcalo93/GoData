const config = require('config')
const express = require('express')
const bodyParser = require('body-parser');
const routes = require('./routes/routes')

const app = express()
const port = config.get('webapi.port')
const dataLimit = config.get('webapi.data_limit')
 
app.use(bodyParser.json({limit: dataLimit}));
app.use(bodyParser.urlencoded({limit: dataLimit, extended: true}));
app.use('/', routes)

const initialize = () => {
    app.listen(port, () => console.log(`Issues Api listening on port ${port}`))
}

initialize()

module.exports = {
    initialize
}
