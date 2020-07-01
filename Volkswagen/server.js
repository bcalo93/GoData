module.exports.initServer = async () => {
    const config = require('config');
    const express = require('express');
    const morgan = require('morgan');
    const bodyParser = require('body-parser');
    const https = require('https');
    const jwt = require('express-jwt');
    const fs = require('fs');
    const publicKey = fs.readFileSync('./security/public.key', 'utf8');

    const app = express();
    app.use(jwt({ secret: publicKey, algorithms: ['RS256']}));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use((req, res, next) => {
        const incomingTimestamp = parseInt(req.header('Timestamp'));
        const currentTimestamp = Date.now();
        console.log('Incoming Timestamp', incomingTimestamp);
        console.log('Current Timestamp', currentTimestamp);
        console.log('Difference', currentTimestamp - incomingTimestamp);
        
        console.log(req.body);
        res.json('OK');
        res.status(200);
        next();
    });

    app.use((err, req, res, next) => {
        if(err.status) {
            res.status(err.status);
            res.json(err.message);
        } else {
            next(err);
        }
    });
    
    const PORT = config.get('port');
    const USE_HTTPS = config.get('useHttps');

    if (USE_HTTPS) {
        https.createServer({
            key: fs.readFileSync('./security/server.key'),
            cert: fs.readFileSync('./security/server.cert')
        }, app).listen(PORT);
    } else {
        app.listen(PORT);
    }
    
    console.log(`Server listening in port ${PORT}`);
}