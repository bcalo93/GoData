const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const jwt = require('express-jwt');
const fs = require('fs');
const publicKey = fs.readFileSync('./security/public.key', 'utf8');

const app = express()
const port = config.get('webapi.port')
const dataLimit = config.get('webapi.data_limit')
 
app.use(jwt({ secret: publicKey, algorithms: ['RS256']}));
app.use(bodyParser.json({limit: dataLimit}))
app.use(bodyParser.urlencoded({limit: dataLimit, extended: true}))
app.use('/', routes)

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    })
})

const initialize = () => {
    app.listen(port, () => console.log(`GoData IssueReceiver listening on port ${port}`))
}

module.exports = {
    initialize
}
