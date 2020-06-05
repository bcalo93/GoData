const IssueDataAccess = require('../dataAccess/issueDataAccess');
const Queue = require('bull');
const queueName = Config.get('queue_sync_db.name');

module.exports = class IssueService {
    constructor() {
        this.issueDataAccess = new IssueDataAccess();
        this.queue = new Queue(queueName);
    }

    async syncReadDatabase(issues) {
        const issuesToSync = [];
        try {
            for (let index = 0; index < issues.length; index++) {
                const issue = issues[index];
                if (this.validateIssue(issue)) {
                    console.log('IssueService.syncReadDatabase','Inserting issue ...');
                    const insertedIssue = await this.issueDataAccess.save(issue);
                    console.log('IssueService.syncReadDatabase', `Issue id: ${insertedIssue.id} inserted ...`);
                    const formattedIssue = this.formatIssue(insertedIssue);
                    issuesToSync.push(formattedIssue);
                }
            }
            if (issuesToSync.length !== 0) {
                console.log('IssueService.syncReadDatabase',`Enqueuing ${issuesToSync.length} items into ...`)
                this.queue.add(issuesToSync);
            }
        } catch (err) {
            console.log('IssueService.syncReadDatabase','Something went wrong ...')
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
                    issueDate
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