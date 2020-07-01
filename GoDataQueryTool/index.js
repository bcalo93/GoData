const Server = require('./server');
const { QueryRepository } = require('../Repositories');

const log = require('./log');

(async () => {
    try {
        await QueryRepository.initRepository();
        await Server.initServer();
    } catch (error) {
        log.error(error, { location: 'index'});
    }
})()