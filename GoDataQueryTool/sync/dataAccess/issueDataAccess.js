const WriteRepository = require('../../repositories/writeRepository');

module.exports = class WriteDataAccess {
    constructor() {
        this.issuesHistoryRepository = WriteRepository.Issue;
    }

    async save(issue) {
        try {
           return await this.issuesHistoryRepository.create(issue);
        } catch (err) {
            throw new Error('Database connection error\n'+ err)
        }
    }
}