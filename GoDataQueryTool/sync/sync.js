const Queue = require('bull');
const Config = require('config');
const QUEUE_NAME = Config.get('queue_sync_go_data.name');
const queue = new Queue(QUEUE_NAME);
const IssueService = require('./services/issueService');


module.exports.start = async function () {

    console.log('sync.start',`Starting Dequeue item process from queue: \"${QUEUE_NAME}\"....`)     

    queue.process(async (job, done) => {
        try {        
            console.log('sync.queue#process',`processing job id: ${job.id}`);
            const issues = job.data;
            const issueService = new IssueService();
            await issueService.syncReadDatabase(issues);
            done();
        } catch(err) {
            console.log(err);
            done(new Error(err));
        }
    });
}