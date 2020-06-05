const IssueDataAccess = require('../dataAccess/issueDataAccess');

module.exports = class IssueService {
    constructor() {
        this.issueDataAccess = new IssueDataAccess();
    }

    async insertIntoQueryRepository(issues) {
        try {
            for (let index = 0; index < issues.length; index++) {
                const issue = issues[index];
                if (this.validateIssue(issue)) {
                    console.log('IssueService.insertIntoQueryRepository','Inserting issue ...');
                    const insertedIssue = await this.issueDataAccess.save(issue);
                    console.log('IssueService.insertIntoQueryRepository', `Issue id: ${insertedIssue.id} inserted ...`);
                }
            }
        } catch (err) {
            console.log('IssueService.insertIntoQueryRepository','Something went wrong ...')
        }
    }

    validateIssue(issue) {
        const isValidRegistrationState = issue.registrationState && issue.registrationState !== '';
        const isValidValidViolationCode = issue.violationCode && issue.violationCode !== '';
        const isValidDate = issue.issueDate && this.parseToDate(issue.issueDate) instanceof Date;
        return ( 
            isValidRegistrationState
            && isValidValidViolationCode
            && isValidDate );
    }

    parseToDate(date) {
        return new Date(date).toISOString();
    }
}