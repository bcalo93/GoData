
const QueryDataAccess = require('../dataAccess/queryDataAccess');

module.exports = class QueryService {
    constructor(){
        this.queryDataAccess = new QueryDataAccess();
    }

    async execute(queryName, request) {
        if (queryName === 'issuesByYear') { return await this.executeIssuesYearReport(request); }
        if (queryName === 'issuesByCode') { return await this.executeIssuesCodesReport(request); }
        if (queryName === 'issuesByState') { return await this.executeIssuesStatesReport(request); }
        throw new Error(`Report ${queryName} does not exists`);
    }

    async executeIssuesYearReport(request) {
        console.log('executeIssuesYearReport', request);
        let year  = request.year;
        if(year) return await this.queryDataAccess.issuesYearReport({ year });
    }

    async executeIssuesCodesReport(request) {
        console.log('executeIssuesCodesReport', request);
        if (request.from && request.to) {
            const from = this.parseToDate(request.from);
            const to = this.parseToDate(request.to);
            const codes = request.codes || [];
            return await this.queryDataAccess.issuesCodesReport({ from, to, codes });
        }
    }

    async executeIssuesStatesReport(request) {
        console.log('executeIssuesStatesReport', request);
        if (request.from && request.to) {
            const from = this.parseToDate(request.from);
            const to = this.parseToDate(request.to);
            const states = request.states || [];
            return await this.queryDataAccess.issuesStatesReport({ from, to, states });
        }
    }

    parseToDate(date) {
        return new Date(date).toISOString();
    }
}