const port = 3001
const log = require('../Logger');

module.exports.initServer = async function () {
    const Koa = require('koa');
    const logger = require('koa-logger');
    const json = require('koa-json');
    const bodyParser = require('koa-bodyparser');
    const router = require('./controllers/router');

    const app = new Koa();
    app.use(async (ctx, next) => {
        try {
            const start = Date.now();
            await next()
            const end = Date.now();
            const ms = end - start;
            const body = JSON.parse(ctx.body);
            ctx.body = {
                ...body, 
                requestTimestamp: start,
                responseTimestamp: end,
                processTime: ms
            }
        } catch(err){
            if (err.status === 401) {
                ctx.status = 401;
                ctx.body = {
                    status: 401,
                    message: (err.originalError ? err.originalError.message : err.message)
                };
            }
            else {
                ctx.status = 400;
                ctx.body = {
                    status: 400,
                    message: err.message
                }
            }
            log.error(err);
        }
    });
    app.use(logger());
    app.use(bodyParser());
    app.use(json( { pretty: true } ));
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(port);

    log.info(`Server started, see http://localhost:${port}
            Endpoints:
                * POST  /queries?name=:name
                * Available Filters: issuesByYear, issuesByCode, issuesByState`, 
            { location: 'server.initServer'});
}