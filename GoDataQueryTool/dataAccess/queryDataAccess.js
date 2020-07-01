const { QueryRepository } = require('../../Repositories');
const log = require('../log');

module.exports = class QueryDataAccess {
    constructor(){
        this.issueYearRepository = QueryRepository.IssuesYear;
        this.issueCodesRepository = QueryRepository.IssuesCodes;
        this.issueStatesRepository = QueryRepository.IssuesStates;
    }

    async issuesYearReport(request) {
        const year = request.year;
        log.info(`Retrieving data for criteria: ${year}`, { location: 'QueryDataAccess.issuesYearReport' });
        return await this.issueYearRepository.find({ year }).exec();
    }

    async issuesCodesReport(request) {
        const from = request.from;
        const to = request.to;
        const codes = request.codes;
        const criteria =  {
            violationCode: { $in: codes }, 
            "issues.date": {
                    $gte: from,
                    $lte: to
                }
        };
        log.info(`Retrieving data for criteria: ${criteria}`, { location: 'QueryDataAccess.issuesCodesReport' });
        return await this.issueCodesRepository.find(criteria).exec();
    }

    async issuesStatesReport(request) {
        const from = request.from;
        const to = request.to;
        const states = request.states;
        const criteria =  {
            registrationState: { $in: states }, 
            "issues.date": {
                    $gte: from,
                    $lte: to
                }
        };
        log.info(`Retrieving data for criteria: ${criteria}`, { location: 'QueryDataAccess.issuesStatesReport' });
        return await this.issueStatesRepository.find(criteria).exec();
    }

    
}