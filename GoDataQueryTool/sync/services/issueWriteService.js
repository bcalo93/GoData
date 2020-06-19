const IssueWriteDataAccess = require('../dataAccess/issueWriteDataAccess');
const Queue = require('bull');
const Config = require('config');
const QUEUE_SYNC_DB = Config.get('queue_sync_db.name');
const QUEUE_TRANSFORMATION = Config.get('queue_transformation_go_data.name');

const { parseToDate, isValidDate } = require('../../utils/dateUtils');

module.exports = class IssueWriteService {
    constructor() {
        this.issueWriteDataAccess = new IssueWriteDataAccess();
        console.log('sync.IssueWriteService', `Connected to queue: ${QUEUE_SYNC_DB}`);
        console.log('sync.IssueWriteService', `Connected to queue: ${QUEUE_TRANSFORMATION}`);
        this.queueSyncDb = new Queue(QUEUE_SYNC_DB);
        this.queueTransformation = new Queue(QUEUE_TRANSFORMATION);
    }

    async syncReadDatabase(issues) {
        const issuesToSync = [];
        try {
            for (let index = 0; index < issues.length; index++) {
                const issue = issues[index];
                try {
                    if (this.validateIssue(issue)) {
                        console.log('IssueWriteService.syncReadDatabase','Inserting issue ...');
                        const insertedIssue = await this.issueWriteDataAccess.save(issue);
                        console.log('IssueWriteService.syncReadDatabase', `Issue id: ${insertedIssue.SUMMONS_NUMBER} inserted ...`);
                        const formattedIssue = this.formatIssue(issue);
                        issuesToSync.push(formattedIssue);
                    }
                } catch (err) {
                    console.log('IssueWriteService.syncReadDatabase',`Something went wrong when inserting ISSUE.SUMMONS_NUMBER ${issue.SUMMONS_NUMBER} ...\n`+err);
                }
            }
            if (issuesToSync.length !== 0) {
                console.log('IssueWriteService.syncReadDatabase',`Enqueuing ${issuesToSync.length} items into ...`);
                this.queueTransformation.add(issuesToSync);
                this.queueSyncDb.add(issuesToSync);
            }
        } catch (err) {
            console.log('IssueWriteService.syncReadDatabase','Something went wrong ...\n'+err);
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