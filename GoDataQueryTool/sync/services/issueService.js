const IssueDataAccess = require('../dataAccess/issueDataAccess');
const Queue = require('bull');
const Config = require('config');
const QUEUE_NAME = Config.get('queue_sync_db.name');
const { parseToDate, isValidDate } = require('../../utils/dateUtils');

module.exports = class IssueService {
    constructor() {
        this.issueDataAccess = new IssueDataAccess();
        console.log('sync.issueService', `Listening to queue: ${QUEUE_NAME}`);
        this.queue = new Queue(QUEUE_NAME);
    }

    async syncReadDatabase(issues) {
        const issuesToSync = [];
        try {
            for (let index = 0; index < issues.length; index++) {
                const issue = issues[index];
                try {
                    if (this.validateIssue(issue)) {
                        console.log('IssueService.syncReadDatabase','Inserting issue ...');
                        const insertedIssue = await this.issueDataAccess.save(issue);
                        console.log('insertedIssue', insertedIssue);
                        console.log('IssueService.syncReadDatabase', `Issue id: ${insertedIssue.id} inserted ...`);
                        const formattedIssue = this.formatIssue(insertedIssue);
                        issuesToSync.push(formattedIssue);
                    }
                } catch (err) {
                    console.log('IssueService.syncReadDatabase',`Something went wrong when inserting ISSUE.SUMMONS_NUMBER ${issue.SUMMONS_NUMBER} ...\n`+err);
                }
            }
            if (issuesToSync.length !== 0) {
                console.log('IssueService.syncReadDatabase',`Enqueuing ${issuesToSync.length} items into ...`)
                this.queue.add(issuesToSync);
            }
        } catch (err) {
            console.log('IssueService.syncReadDatabase','Something went wrong ...\n'+err);
        }
    }

    validateIssue(issue) {
        const isValidRegistrationState = issue.REGISTRATION_STATE && issue.REGISTRATION_STATE !== '';
        const isValidValidViolationCode = issue.VIOLATION_CODE && issue.VIOLATION_CODE !== '';
        const issueDate = parseToDate(issue.ISSUE_DATE);
        const isValidIssueDate = issue.ISSUE_DATE && isValidDate(issueDate);
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
        const formattedIssue = (
            ({ REGISTRATION_STATE, VIOLATION_CODE, ISSUE_DATE }) => {
                const issueDate = parseToDate(ISSUE_DATE);
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
}