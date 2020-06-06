const IssueDataAccess = require('../dataAccess/issueDataAccess');
const { parseToDate, isValidDate } = require('../../utils/dateUtils');

module.exports = class IssueService {
    constructor() {
        this.issueDataAccess = new IssueDataAccess();
    }

    async insertIntoQueryRepository(issues) {
        try {
            for (let index = 0; index < issues.length; index++) {
                const issue = issues[index];
                if (this.validateIssue(issue)) {
                    console.log('IssueService.insertIntoQueryRepository','Inserting issue into documents...');
                    const formattedIssue = this.formatIssue(issue);
                    await this.issueDataAccess.persistIssueInDocuments(formattedIssue);
                }
            }
        } catch (err) {
            console.log('IssueService.insertIntoQueryRepository','Something went wrong ...\n'+err)
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
        const year = issue.issueDate.getFullYear() || 0;
        const month = issue.issueDate.getMonth() || 0;
        return { ...issue, year, month };
    }
}