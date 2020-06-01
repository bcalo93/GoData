const Server = require('./server/server');
const QueryRepository = require('./repositories/queryRepository');
const GoDataSync = require('./sync/sync')
const Repository = require('../NYCDataAgregator/sync/repository')

(async () => {
    try {
        await Repository.initRepository();
        await QueryRepository.initRepository();
        await Server.initServer();
        await GoDataSync.start();
    } catch (err) {
        console.log(err)
    }
})();