const { QueryRepository } = require('../../Repositories');
const { getCodesCriteria, getStateCriteria } = require('./criteriaUtils');
const log = require('../log');

module.exports = class QueryDataAccess {
    constructor(){
        this.issueYearRepository = QueryRepository.IssuesYear;
        this.issueCodesRepository = QueryRepository.IssuesCodes;
        this.issueStatesRepository = QueryRepository.IssuesStates;
    }

    async issuesYearReport(request) {
        const year = request.year;
        log.info(`Retrieving data for criteria: ${JSON.stringify(year)}`, { location: 'QueryDataAccess.issuesYearReport' });
        return await this.issueYearRepository.find({ year }).exec();
    }

    async issuesCodesReport(request) {
        const criteria = getCodesCriteria(request);
        log.info(`Retrieving data for criteria: ${JSON.stringify(criteria)}`, { location: 'QueryDataAccess.issuesCodesReport' });
        return await this.issueCodesRepository.find(criteria).exec();
    }

    async issuesStatesReport(request) {
        const criteria = getStateCriteria(request);
        log.info(`Retrieving data for criteria: ${JSON.stringify(criteria)}`, { location: 'QueryDataAccess.issuesStatesReport' });
        return await this.issueStatesRepository.find(criteria).exec();
    }
}