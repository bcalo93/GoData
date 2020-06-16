const config = require('config')
const express = require('express')
const bodyParser = require('body-parser');
const routes = require('./routes/routes')

const app = express()
const port = config.get('webapi.port')
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/nycda', routes)

const initialize = () => {
    app.listen(port, () => console.log(`Consumer registration listening on /nycda/registration port ${port}`))
}

module.exports = {
    initialize
}