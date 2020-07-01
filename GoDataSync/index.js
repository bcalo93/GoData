const Sync = require('./sync');
const { WriteRepository } = require('../Repositories');
const log = require('./log');

const location = { location: 'index'};
(async () => {
    try {
        await WriteRepository.initRepository();
        await Sync.start();
    } catch (error) {
        log.error(error, location);
    }
})().catch(err => {
    log.error(err, location);
    process.exit(1)
})
