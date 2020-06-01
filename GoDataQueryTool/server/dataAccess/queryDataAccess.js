const QueryRepository = require('../../repositories/queryRepository');

module.exports = class QueryDataAccess {
    constructor(){
        this.issueYearRepository = QueryRepository.IssuesYear;
        this.issueCodesRepository = QueryRepository.IssuesCodes;
        this.issueStatesRepository = QueryRepository.IssuesStates;
    }

    async issuesYearReport(request) {
        const year = request.year;
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
        return await this.issueStatesRepository.find(criteria).exec();
    }

    
}