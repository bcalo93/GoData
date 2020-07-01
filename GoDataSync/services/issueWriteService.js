const IssueWriteDataAccess = require('../dataAccess/issueWriteDataAccess');
const Queue = require('bull');
const Config = require('config');
const QUEUE_SYNC_DB = Config.get('queue_sync_db.name');
const QUEUE_TRANSFORMATION = Config.get('queue_transformation_go_data.name');
const StateInfo = require('../../StateInfo');
const { parseToDate, isValidDate } = require('../../GoDataSyncUtils/dateUtils');
const log = require('../../Logger');

module.exports = class IssueWriteService {
    constructor() {
        this.issueWriteDataAccess = new IssueWriteDataAccess();
        const location = { location: 'IssueWriteService.constructor()' };
        log.info(`Connected to queue: ${QUEUE_SYNC_DB}`, location);
        log.info(`Connected to queue: ${QUEUE_TRANSFORMATION}`, location);
        this.queueSyncDb = new Queue(QUEUE_SYNC_DB);
        this.queueTransformation = new Queue(QUEUE_TRANSFORMATION);
    }

    async syncIssues(issuesInfo) {
        const location = { location: 'IssueWriteService.syncIssues' };
        const issuesToTransformation = [];
        const issuesToSyncDb = [];
        try {
            const { timeStamp, data }  = issuesInfo;
            for (let index = 0; index < data.length; index++) {
                const issue = data[index];
                try {
                    log.debug(`Issue: ${JSON.stringify(issue)}`, location);
                    if (this.validateIssue(issue)) {
                        log.info('Inserting issue ...', location);
                        const insertedIssue = await this.issueWriteDataAccess.save(issue);
                        log.info(`Issue id: ${insertedIssue.SUMMONS_NUMBER} inserted ...`, location);
                        const formattedIssue = this.formatIssue(issue);
                        issuesToSyncDb.push(formattedIssue);
                        issuesToTransformation.push(issue);
                    }
                } catch (err) {
                    log.error(`Issue: ${JSON.stringify(issue)}`, location);
                    log.error(`Something went wrong when inserting ISSUE.SUMMONS_NUMBER ${issue.SUMMONS_NUMBER} ...\n`+err, location);
                }
            }
            if (issuesToSyncDb.length !== 0 && issuesToTransformation.length !== 0) {
                log.info(`Enqueuing ${issuesToSyncDb.length} items into ...`, location);
                this.queueTransformation.add({ timeStamp, data: issuesToTransformation });
                this.queueSyncDb.add(issuesToSyncDb);
            }
        } catch (err) {
            log.error('Something went wrong ...\n'+err, location);
        }
    }

    validateIssue(issue) {
        const location = { location: 'IssueWriteService.validateIssue' };
        log.info('Validating issue ...', location);
        const state = issue.REGISTRATION_STATE;
        const code = issue.VIOLATION_CODE;
        const isValidRegistrationState =  state && state !== '';
        const isValidValidViolationCode = code && code !== '';
        const issueDate = parseToDate(issue.ISSUE_DATE);
        const isValidIssueDate = issue.ISSUE_DATE && isValidDate(issueDate);
        if ( isValidRegistrationState
            && isValidValidViolationCode
            && isValidIssueDate ) {
                const isValidState = StateInfo.existsState(state);
                const isValidCode = this.isValidCode(code);
                if(isValidState && isValidCode) {
                    log.info('Validation Ok ...', location);
                    return true;
                } else {
                    const message = `Invalid Issue object. \nIssue: ${JSON.stringify(issue)}\n isValidState: ${isValidState} - isValidCode: ${isValidCode}`;
                    const error = new Error(message);
                    log.error(error, location);
                    throw error;
                }
        } else { 
            const message = `Invalid Issue object. \nIssue: ${JSON.stringify(issue)}\n isValidRegistrationState: ${isValidRegistrationState} - isValidValidViolationCode: ${isValidValidViolationCode} - isValidIssueDate: ${isValidIssueDate}`;
            const error = new Error(message);
            log.error(error, location);
            throw error;
        }
    }
    
    isValidCode(code) {
        return code > 0 && code < 100 && code != 93 && code != 94;
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
            const error = new Error(`Format error. \nIssue: ${JSON.stringify(issue)}`);
            log.error(error, { location: 'IssueWriteService.formatIssue' });
            throw error;
        }  
    }
}