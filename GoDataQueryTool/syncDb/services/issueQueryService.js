const IssueQueryDataAccess = require('../dataAccess/issueQueryDataAccess');
const { parseToDate, isValidDate, getYearFromDate, getMonthFromDate } = require('../../utils/dateUtils');

module.exports = class IssueQueryService {
    constructor() {
        this.issueQueryDataAccess = new IssueQueryDataAccess();
    }

    async insertIntoQueryRepository(issues) {  
        for (let index = 0; index < issues.length; index++) {
            const issue = issues[index];
            try {
                if (this.validateIssue(issue)) {
                    console.log('IssueQueryService.insertIntoQueryRepository','Inserting issue into documents...');
                    const formattedIssue = this.formatIssue(issue);
                    await this.issueQueryDataAccess.persistIssueInDocuments(formattedIssue);
                }
            } catch (err) {
                console.log('IssueQueryService.insertIntoQueryRepository','Something went wrong ...\n'+err)
            }
        }
    }

    validateIssue(issue) {
        const isValidRegistrationState = issue.registrationState && issue.registrationState !== '';
        const isValidValidViolationCode = issue.violationCode && issue.violationCode !== '';
        const issueDate = parseToDate(issue.issueDate);
        const isValidIssueDate = issue.issueDate && isValidDate(issueDate);
        if ( isValidRegistrationState
            && isValidValidViolationCode
            && isValidIssueDate ) {
                return true;
        } else { 
            const message = `Invalid Issue object. \nIssue: ${issue}\n isValidRegistrationState: ${isValidRegistrationState} - isValidValidViolationCode: ${isValidValidViolationCode} - isValidIssueDate: ${isValidIssueDate}`;
            throw new Error(message);
        }
    }

    formatIssue(issue) {
        const dateStr = issue.issueDate;
        const year = getYearFromDate(dateStr);
        const month = getMonthFromDate(dateStr);
        return { ...issue, year, month };
    }
}