const Queue = require('bull');
const queue = new Queue('data-csv');
const issueMapper = require('./issueMapper')

module.exports.sync = async function () {

    const Repository = require('./repository')
    const IssueRepository = Repository.Issue;

    queue.process(3, async (job, done) => {

        try {        
            console.log(job.data);
            const issueArray = job.data.issue.split(',')
            const issue = issueMapper(issueArray)
            await IssueRepository.create(issue)
            done();
        } catch(err) {
            done(new Error(err));
        }
    });
}