const Sync = require('./sync');
const { WriteRepository } = require('../Repositories');
const log = require('./log');

(async () => {
    try {
        await WriteRepository.initRepository();
        await Sync.start();
    } catch (error) {
        log.error(error, { location: 'index'});
    }
})()
