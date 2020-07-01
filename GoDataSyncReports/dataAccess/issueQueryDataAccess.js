const { QueryRepository } = require('../../Repositories');
const { persistIssueYear, persistIssueCodes, persistIssueStates } = require('../dataAccess');
const log = require('../log');

module.exports = class IssueQueryDataAccess {
     constructor() {
         this.issueYearRepository = QueryRepository.IssuesYear;
         this.issueCodesRepository = QueryRepository.IssuesCodes;
         this.issueStatesRepository = QueryRepository.IssuesStates;
    }

    async persistIssueInDocuments(issue) {
        try{
            console.log('IssueQueryDataAccess.persistIssueInDocuments', `Issue to persist: ${JSON.stringify(issue)}`);
            await persistIssueYear(issue, this.issueYearRepository);
            await persistIssueCodes(issue, this.issueCodesRepository);
            await persistIssueStates(issue, this.issueStatesRepository);
        } catch (err) {
            throw new Error(err)
        }
    }

 }