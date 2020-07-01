const Queue = require('bull');
const Config = require('config');
const QUEUE_NAME = Config.get('queue_sync_go_data.name');
const queue = new Queue(QUEUE_NAME);
const IssueWriteService = require('./services/issueWriteService');
const log = require('../Logger');

module.exports.start = async function () {

    log.info(`Starting Dequeue item process from queue: \"${QUEUE_NAME}\"....`, { location: 'sync.start'});

    queue.process(async (job, done) => {
        const location = { location: 'sync.queue#process'}
        try {        
            log.info(`processing job id: ${job.id}`, location);
            const issues = job.data;
            const issueWriteService = new IssueWriteService();
            await issueWriteService.syncIssues(issues);
            done();
        } catch(err) {
            const error = new Error(err);
            log.error(error, location);
            done(error);
        }
    }).catch((err) => log.error(err, { location: 'sync.queue#process'}) );
}