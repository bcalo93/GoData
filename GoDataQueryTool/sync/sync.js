const Queue = require('bull');
const queue = new Queue('go-data-issues');

module.exports.start = async function () {

    const Repository = require('./repository')
    const IssueRepository = Repository.Issue;

    console.log('Starting Dequeue item process....')     

    // queue.process(4, async (job, done) => {
    queue.process((job, done) => {
        try {        
            console.log(job.data);
            done();
        } catch(err) {
            console.log(err);
            done(new Error(err));
        }
    });
}