const Server = require('./server/server');
const { QueryRepository, WriteRepository } = require('./repositories');
const GoDataSync = require('./sync/sync');

(async () => {
    try {
        await QueryRepository.initRepository();
        await WriteRepository.initRepository();
        await Server.initServer();
        await GoDataSync.start();
    } catch (err) {
        console.log(err)
    }
})();