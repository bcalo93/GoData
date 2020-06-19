module.exports.initServer = async () => {
    const Koa = require('koa');
    const xmlParser = require('koa-xml-body');

    const app = new Koa();
    app.use(xmlParser());

    app.use((ctx, next) => {
        ctx.body = 'OK';
        console.log(ctx.request.body);
        next();
    });

    app.listen(8091);
    console.log('Server listening in port 8091');
}