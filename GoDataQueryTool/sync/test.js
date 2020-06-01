const Queue = require('bull');
this.queue = new Queue('go-data-issues');

(async () => {
    const Repository = require('../../NYCDataAgregator/sync/repository')
    const IssueRepository = Repository.Issue;
    const issues = await IssueRepository.findAll({ offset: 0, limit: 10 });
    console.log(issues);
})();