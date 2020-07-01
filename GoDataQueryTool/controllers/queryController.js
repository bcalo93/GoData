const QueryService = require('../services/queryService');
const log = require('../log');

module.exports = class QueryController {
    constructor() {
        this.queryService = new QueryService();
    }

    async execute (ctx, next) {
        const location = { location: 'QueryController.execute' };
        let queryName = ctx.query.name || '';
        let request = ctx.request.body.criteria;
        let result = [];
        try {
            log.debug(`Query name: ${queryName}\nRequested criteria: ${JSON.stringify(request)}`, location);
            result = await this.queryService.execute(queryName, request);
            ctx.body = { request, result: result };
        } catch (e) {
            log.error(e, location);
            ctx.status = 400;
            ctx.body = { error: 'Report not found' }
        }
        await next();
    }
}