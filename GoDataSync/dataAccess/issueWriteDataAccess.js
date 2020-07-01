const { WriteRepository } = require('../../Repositories');
const log = require('../../Logger');

module.exports = class IssueWriteDataAccess {
    constructor() {
        this.issuesHistoryRepository = WriteRepository.Issue;
    }

    async save(issue) {
        const location = { location: 'IssueWriteDataAccess.save' };
        try {
            log.info('Inserting issue into write database ...', location);
            log.debug(`Issue: ${JSON.stringify(issue)}`, location);
            return await this.issuesHistoryRepository.create(issue);
        } catch (err) {
            const error = new Error(err)
            log.error(error, location);
            throw error;
        }
    }
}