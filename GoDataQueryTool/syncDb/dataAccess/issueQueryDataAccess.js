const QueryRepository = require('../../repositories/queryRepository');
const { persistIssueYear, persistIssueCodes, persistIssueStates } = require('../dataAccess');

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