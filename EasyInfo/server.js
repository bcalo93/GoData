module.exports.initServer = async () => {
    const Koa = require('koa');
    const xmlParser = require('koa-xml-body');
    const https = require('https');
    const fs = require('fs')
    const publicKey = fs.readFileSync('./security/public.key', 'utf8');
    const jwt = require('koa-jwt');

    const app = new Koa();
    app.use(jwt({ secret: publicKey, algorithms: ['RS256']}));
    app.use(xmlParser());

    app.use((ctx, next) => {
        ctx.body = 'OK';
        console.log(ctx.request.body.root);
        next();
    });

    https.createServer(
        {
            key: fs.readFileSync('./security/server.key'),
            cert: fs.readFileSync('./security/server.cert')
        }
        ,app.callback()).listen(8091);
    console.log('Server listening in port 8091');
}