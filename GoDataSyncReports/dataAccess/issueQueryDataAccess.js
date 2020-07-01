const { QueryRepository } = require('../../Repositories');
const { persistIssueYear, persistIssueCodes, persistIssueStates } = require('../dataAccess');
const log = require('../../Logger');

module.exports = class IssueQueryDataAccess {
     constructor() {
         this.issueYearRepository = QueryRepository.IssuesYear;
         this.issueCodesRepository = QueryRepository.IssuesCodes;
         this.issueStatesRepository = QueryRepository.IssuesStates;
    }

    async persistIssueInDocuments(issue) {
        const location = { location: 'IssueQueryDataAccess.persistIssueInDocuments'};
        try{
            log.info('Persist Issue information into reports ...', location);
            log.debug(`Issue to persist: ${JSON.stringify(issue)}`, location);
            await persistIssueYear(issue, this.issueYearRepository);
            await persistIssueCodes(issue, this.issueCodesRepository);
            await persistIssueStates(issue, this.issueStatesRepository);
        } catch (err) {
            log.error(`Issue to persist: ${JSON.stringify(issue)}`, location);
            const error = new Error(err)
            log.error(error, location);
            throw error;
        }
    }

 }