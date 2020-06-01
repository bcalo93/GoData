const QueryRepository = require('../../repositories/queryRepository');

module.exports = class QueryDataAccess {
    constructor(){
        this.issueYearRepository = QueryRepository.IssuesYear;
        this.issueCodesRepository = QueryRepository.IssuesCodes;
        this.issueStatesRepository = QueryRepository.IssuesStates;
    }

    async issuesYearReport(request) {
        return await 
            this.issueYearRepository
                .find({ 
                    year: request.year 
                }).exec();
    }

    async issuesCodesReport(request) {
        return await 
            this.issueCodesRepository
            .find({ 
                from: request.from, 
                to: request.to, 
                codes: request.codes 
            }).exec();
    }

    async issuesStatesReport(request) {
        return await 
            this.issueStatesRepository
            .find({ 
                from: request.from, 
                to: request.to,  
                states: request.states 
            }).exec();
    }
}