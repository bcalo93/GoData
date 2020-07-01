const Server = require('./server');
const log = require('./dependencies/Logger');

(async () => {
    try {
        await Server.initServer();

    } catch(error) {
        log.error(error, { location: 'index' });
    }
})();