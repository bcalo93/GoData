const IssueQueryDataAccess = require('../dataAccess/issueQueryDataAccess');
const { parseToDate, isValidDate, getYearFromDate, getMonthFromDate } = require('../../GoDataSyncUtils/dateUtils');
const log = require('../log');

module.exports = class IssueQueryService {
    constructor() {
        this.issueQueryDataAccess = new IssueQueryDataAccess();
    }

    async insertIntoQueryRepository(issues) {  
        const location = { location: 'IssueQueryService.insertIntoQueryRepository' };
        for (let index = 0; index < issues.length; index++) {
            const issue = issues[index];
            try {
                log.debug(`Issue: ${JSON.stringify(issue)}`, location);
                if (this.validateIssue(issue)) {
                    log.info('Inserting issue into documents...', location);
                    const formattedIssue = this.formatIssue(issue);
                    await this.issueQueryDataAccess.persistIssueInDocuments(formattedIssue);
                }
            } catch (err) {
                log.error(`Issue: ${JSON.stringify(issue)}`, location);
                log.error('Something went wrong ...\n'+err, location);
            }
        }
    }

    validateIssue(issue) {
        const location = { location: 'IssueQueryService.validateIssue' };
        log.info('Validating issue ...', location);
        const isValidRegistrationState = issue.registrationState && issue.registrationState !== '';
        const isValidValidViolationCode = issue.violationCode && issue.violationCode !== '';
        const issueDate = parseToDate(issue.issueDate);
        const isValidIssueDate = issue.issueDate && isValidDate(issueDate);
        if ( isValidRegistrationState
            && isValidValidViolationCode
            && isValidIssueDate ) {
                log.info('Validation Ok ...', location);
                return true;
        } else { 
            const message = `Invalid Issue object. \nIssue: ${issue}\n isValidRegistrationState: ${isValidRegistrationState} - isValidValidViolationCode: ${isValidValidViolationCode} - isValidIssueDate: ${isValidIssueDate}`;
            const error = new Error(message);
            log.error(error, location);
            throw error;
        }
    }

    formatIssue(issue) {
        const dateStr = issue.issueDate;
        const year = getYearFromDate(dateStr);
        const month = getMonthFromDate(dateStr);
        return { ...issue, year, month };
    }
}