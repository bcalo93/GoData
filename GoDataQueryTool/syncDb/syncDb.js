const Queue = require('bull');
const Config = require('config');
const QUEUE_NAME = Config.get('queue_sync_db.name');
const queue = new Queue(QUEUE_NAME);
const IssueQueryService = require('./services/issueQueryService');

module.exports.start = async function () {

    console.log('syncDb.start', `Starting Dequeue item process from queue: \"${QUEUE_NAME}\"....`)     

    queue.process(async (job, done) => {
        try {        
            console.log('syncDb.queue#process',`processing job id: ${job.id}`);
            const issues = job.data;
            const issueQueryService = new IssueQueryService();
            await issueQueryService.insertIntoQueryRepository(issues);
            done();
        } catch(err) {
            console.log(err);
            done(new Error(err));
        }
    });
}