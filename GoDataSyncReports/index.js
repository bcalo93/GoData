const SyncReports = require('./syncDb');
const { QueryRepository } = require('../Repositories');
const log = require('./log');

(async () => {
    try {
        await QueryRepository.initRepository();
        await SyncReports.start();
    } catch (error) {
        log.error(error, { location: 'index'});
    }
})()