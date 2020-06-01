const QueryService = require('../services/queryService');

module.exports = class QueryController {
    constructor() {
        this.queryService = new QueryService();
    }

    async execute (ctx, next) {
        let queryName = ctx.query.name || '';
        let request = ctx.request.body.criteria;
        let result = [];
        try {
            result = await this.queryService.execute(queryName, request);
            ctx.body = { request, result: result };
        } catch (e) {
            ctx.status = 400;
            ctx.body = { error: 'Report not found' }
        }
        await next();
    }
}