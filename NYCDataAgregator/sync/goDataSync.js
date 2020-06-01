const Queue = require('bull');
const goDataQueue = new Queue('go-data-issues');

module.exports.goDataSync = async function () {
    const Repository = require('./repository')
    const IssueRepository = Repository.Issue;

    const issues = await IssueRepository.findAll({ offset: 0, limit: 10 });
    
    goDataQueue.add(issues);
    
    return;
}