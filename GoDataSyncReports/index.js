const SyncReports = require('./syncDb');
const { QueryRepository } = require('../Repositories');
const log = require('./log');

const location = { location: 'index'};

(async () => {
    try {
        await QueryRepository.initRepository();
        await SyncReports.start();
    } catch (error) {
        log.error(error, location);
    }
})().catch(err => {
    log.error(err, location);
    process.exit(1)
})