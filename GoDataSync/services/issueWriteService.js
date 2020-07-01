const IssueWriteDataAccess = require('../dataAccess/issueWriteDataAccess');
const Queue = require('bull');
const Config = require('config');
const QUEUE_SYNC_DB = Config.get('queue_sync_db.name');
const QUEUE_TRANSFORMATION = Config.get('queue_transformation_go_data.name');
// const StateInfo = require('../../StateInfo');
const { parseToDate, isValidDate } = require('../../GoDataSyncUtils/dateUtils');
const log = require('../log');

module.exports = class IssueWriteService {
    constructor() {
        this.issueWriteDataAccess = new IssueWriteDataAccess();
        const location = { location: 'IssueWriteService.constructor()' };
        log.info(`Connected to queue: ${QUEUE_SYNC_DB}`, location);
        log.info(`Connected to queue: ${QUEUE_TRANSFORMATION}`, location);
        this.queueSyncDb = new Queue(QUEUE_SYNC_DB);
        this.queueTransformation = new Queue(QUEUE_TRANSFORMATION);
    }

    async syncIssues(issues) {
        const location = { location: 'IssueWriteService.syncIssues' };
        const issuesToTransformation = [];
        const issuesToSyncDb = [];
        try {
            for (let index = 0; index < issues.length; index++) {
                const issueInfo = issues[index];
                const { timeStamp, ...issue } = issueInfo;
                try {
                    log.debug(`Issue: ${issue}`, location);
                    if (this.validateIssue(issue)) {
                        log.info('Inserting issue ...', location);
                        const insertedIssue = await this.issueWriteDataAccess.save(issue);
                        log.info(`Issue id: ${insertedIssue.SUMMONS_NUMBER} inserted ...`, location);
                        const formattedIssue = this.formatIssue(issue);
                        issuesToSyncDb.push(formattedIssue);
                        issuesToTransformation.push(issue);
                    }
                } catch (err) {
                    log.error(`Something went wrong when inserting ISSUE.SUMMONS_NUMBER ${issue.SUMMONS_NUMBER} ...\n`+err, location);
                }
            }
            if (issuesToSyncDb.length !== 0 && issuesToTransformation.length !== 0) {
                log.info(`Enqueuing ${issuesToSyncDb .length} items into ...`, location);
                this.queueTransformation.add(issuesToTransformation);
                this.queueSyncDb.add(issuesToSyncDb);
            }
        } catch (err) {
            log.error('Something went wrong ...\n'+err, location);
        }
    }

    validateIssue(issue) {
        const location = { location: 'IssueWriteService.validateIssue' };
        log.info('Validating issue ...', location);
        const isValidRegistrationState = issue.REGISTRATION_STATE && issue.REGISTRATION_STATE !== '';
        const isValidValidViolationCode = issue.VIOLATION_CODE && issue.VIOLATION_CODE !== '';
        const issueDate = parseToDate(issue.ISSUE_DATE);
        const isValidIssueDate = issue.ISSUE_DATE && isValidDate(issueDate);
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
        } else {
            const error = new Error("Format error");
            log.error(error, { location: 'IssueWriteService.validateIssue' });
            throw error;
        }  
    }
}