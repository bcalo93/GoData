const Server = require('./server/server');
const { QueryRepository, WriteRepository } = require('./repositories');
const GoDataSync = require('./sync/sync');
const GoDataSyncDb = require('./syncDb/syncDb');

(async () => {
    try {
        await QueryRepository.initRepository();
        await WriteRepository.initRepository();
        await Server.initServer();
        await GoDataSync.start();
        await GoDataSyncDb.start();
    } catch (err) {
        console.log(err)
    }
})();