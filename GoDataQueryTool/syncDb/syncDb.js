const IssueService = require('./services/issueService');
const Queue = require('bull');
const Config = require('config');
const queueName = Config.get('queue_sync_db.name');
const queue = new Queue(queueName);

module.exports.start = async function () {

    console.log('syncDb', `Starting Dequeue item process from ${queueName}....`)     

    queue.process((job, done) => {
        try {        
            console.log(job.data);
            const issues = job.data;
            await IssueService.insertIntoQueryRepository(issues);
            done();
        } catch(err) {
            console.log(err);
            done(new Error(err));
        }
    });
}