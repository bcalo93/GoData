const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
var https = require('https')
const jwt = require('express-jwt');
const fs = require('fs');
const publicKey = fs.readFileSync('./security/public.key', 'utf8');

const app = express()
const port = config.get('webapi.port')
const dataLimit = config.get('webapi.data_limit')
const useHttps = config.get('webapi.use_https')
 
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

const listenCallback = () => {
    console.log(`GoData IssueReceiver listening on port ${port}`)
}

const initialize = () => {
    if(useHttps){
        const serverConfig = {
            key: fs.readFileSync('./security/server.key'),
            cert: fs.readFileSync('./security/server.cert')
        }
        const server = https.createServer(serverConfig, app)
        server.listen(port, listenCallback)
    } else {
        app.listen(port, listenCallback)
    }
}

module.exports = {
    initialize
}
