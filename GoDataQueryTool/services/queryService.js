
const QueryDataAccess = require('../dataAccess/queryDataAccess');
const { formatResultYears, formatResultCodes, formatResultStates } = require('./formatQueryResult');
const log = require('../log');

module.exports = class QueryService {
    constructor(){
        this.queryDataAccess = new QueryDataAccess();
    }

    async execute(queryName, request) {
        if (queryName === 'issuesByYear') { return await this.executeIssuesYearReport(request); }
        if (queryName === 'issuesByCode') { return await this.executeIssuesCodesReport(request); }
        if (queryName === 'issuesByState') { return await this.executeIssuesStatesReport(request); }
        else {
            const error = new Error(`Report ${queryName} does not exists`);
            log.error(error, { location: 'QueryService.execute'});
            throw error;
        }
         
    }

    async executeIssuesYearReport(request) {
        log.info('excecuting issues by year report ...', { location: 'QueryService.executeIssuesYearReport'});
        const year  = request.year;
        if(year) {
            const result = await this.queryDataAccess.issuesYearReport({ year });
            return formatResultYears(result);
        }
    }

    async executeIssuesCodesReport(request) {
        log.info('excecuting issues by code report ...', { location: 'QueryService.executeIssuesCodesReport'});
        if (request.from && request.to) {
            const from = this.parseToDate(request.from);
            const to = this.parseToDate(request.to);
            const codes = request.codes || [];
            const result = await this.queryDataAccess.issuesCodesReport({ from, to, codes });
            return formatResultCodes(result);
        }
    }

    async executeIssuesStatesReport(request) {
        log.info('excecuting issues by state report ...', { location: 'QueryService.executeIssuesStatesReport'});
        if (request.from && request.to) {
            const from = this.parseToDate(request.from);
            const to = this.parseToDate(request.to);
            const states = request.states || [];
            const result = await this.queryDataAccess.issuesStatesReport({ from, to, states });
            return formatResultStates(result);
        }
    }

    parseToDate(date) {
        return new Date(date).toISOString();
    }
}