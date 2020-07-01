const Queue = require('bull');
const Config = require('config');
const QUEUE_NAME = Config.get('queue_sync_db.name');
const queue = new Queue(QUEUE_NAME);
const IssueQueryService = require('./services/issueQueryService');
const log = require('./log');

module.exports.start = async function () {

    log.info(`Starting Dequeue item process from queue: \"${QUEUE_NAME}\"....`, { location: 'syncDb.start'});

    queue.process(async (job, done) => {
        const location = { location: 'syncDb.queue#process'}
        try {        
            log.info(`processing job id: ${job.id}`, location);
            const issues = job.data;
            const issueQueryService = new IssueQueryService();
            await issueQueryService.insertIntoQueryRepository(issues);
            done();
        } catch(err) {
            const error = new Error(err);
            log.error(error, location);
            done(error);
        }
    });
}