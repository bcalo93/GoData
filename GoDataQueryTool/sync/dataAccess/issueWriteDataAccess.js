const WriteRepository = require('../../repositories/writeRepository');

module.exports = class IssueWriteDataAccess {
    constructor() {
        this.issuesHistoryRepository = WriteRepository.Issue;
    }

    async save(issue) {
        try {
           return await this.issuesHistoryRepository.create(issue);
        } catch (err) {
            throw new Error(err)
        }
    }
}