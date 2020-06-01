const Queue = require('bull');
const goDataQueue = new Queue('go-data-issues');

module.exports.goDataSync = async function () {
    const Repository = require('./repository')
    const IssueRepository = Repository.Issue;
    for (let offset = 0; offset < 100; offset = offset + 10 ) {
        const issues = await IssueRepository.findAll({ offset , limit: 10 });
        console.log(`Enquque 10 items with offset ${offset}`);
        goDataQueue.add(issues);
    }
    return;
}