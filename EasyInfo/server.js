module.exports.initServer = async () => {
    const config = require('config');
    const Koa = require('koa');
    const logger = require('koa-logger');
    const xmlParser = require('koa-xml-body');
    const https = require('https');
    const fs = require('fs')
    const publicKey = fs.readFileSync('./security/public.key', 'utf8');
    const jwt = require('koa-jwt');

    const app = new Koa();
    app.use(logger());
    app.use(jwt({ secret: publicKey, algorithms: ['RS256']}));
    app.use(xmlParser());
    
    app.use((ctx, next) => {
        const incomingTimestamp = parseInt(ctx.get('Timestamp'));
        const currentTimestamp = Date.now();
        console.log('Incoming Timestamp', incomingTimestamp);
        console.log('Current Timestamp', currentTimestamp);
        console.log('Difference', currentTimestamp - incomingTimestamp);
        
        ctx.body = 'OK';
        logBody(ctx.request.body);
        next();
    });

    const logBody = body => {
        if (body && body.root) {
            const { root } = body;
            if (root.item) {
                console.log(root.item);
            } else {
                console.log(root);
            }
        }
    }

    const PORT = config.get('port');
    const USE_HTTPS = config.get('useHttps');

    if (USE_HTTPS) {
        https.createServer(
            {
                key: fs.readFileSync('./security/server.key'),
                cert: fs.readFileSync('./security/server.cert')
            }
            ,app.callback()).listen(PORT);
    } else {
        app.listen(PORT);
    }

    console.log(`Server listening in port ${PORT}`);

}