const Server = require('./server/server');
const QueryRepository = require('./repositories/queryRepository');

(async () => {
    await QueryRepository.initRepository();
    await Server.initServer();
})();