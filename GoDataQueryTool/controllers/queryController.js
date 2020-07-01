const QueryService = require('../services/queryService');
const log = require('../log');

module.exports = class QueryController {
    constructor() {
        this.queryService = new QueryService();
    }

    async execute (ctx, next) {
        let queryName = ctx.query.name || '';
        let request = ctx.request.body.criteria;
        let result = [];
        try {
            log.debug(`Query name: ${queryName}\nRequested criteria: ${request}`, { location: 'QueryController.execute'});
            result = await this.queryService.execute(queryName, request);
            ctx.body = { request, result: result };
        } catch (e) {
            log.error(e, { location: 'QueryController.execute'});
            ctx.status = 400;
            ctx.body = { error: 'Report not found' }
        }
        await next();
    }
}