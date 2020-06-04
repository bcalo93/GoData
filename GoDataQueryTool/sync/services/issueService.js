const IssueDataAccess = require('../dataAccess/issueDataAccess');

module.exports = class IssueService {
    constructor() {
        this.issueDataAccess = new IssueDataAccess();
    }

    async syncReadDatabase(issues) {
        const issuesToSync = [];
        try{
            for (let index = 0; index < issues.length; index++) {
                const issue = issues[index];
                if(this.validateIssue(issue)) {
                    const formattedIssue = this.formatIssue(issue);
                    //call data access
                    //enqueue into syncDb queue
                }
            }
        } catch (err) {

        }
    }

    validateIssue(issue) {
        const isValidRegistrationState = issue.REGISTRATION_STATE && issue.REGISTRATION_STATE !== '';
        const isValidValidViolationCode = issue.VIOLATION_CODE && issue.VIOLATION_CODE !== '';
        const isValidDate = issue.ISSUE_DATE && this.parseToDate(issue.ISSUE_DATE) instanceof Date;
        return ( 
            isValidRegistrationState
            && isValidValidViolationCode
            && isValidDate );
    }

    formatIssue(issue) {
        const formattedIssue = (
            ({ REGISTRATION_STATE, VIOLATION_CODE, ISSUE_DATE }) => {
                const issueDate = this.parseToDate(ISSUE_DATE);
                return { 
                    registrationState: REGISTRATION_STATE, 
                    violationCode: VIOLATION_CODE, 
                    issueDate: issueDate
                };
            })(issue);
        if (!!formattedIssue) {
            return formattedIssue;
        } else throw new Error("Format error");
    }

    parseToDate(date) {
        return new Date(date).toISOString();
    }
}