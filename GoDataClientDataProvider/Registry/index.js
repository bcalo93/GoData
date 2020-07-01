const Server = require('./server');
const log = require('./log');

(async () => {
    try {
        await Server.initServer();

    } catch(error) {
        log.error(error, { location: 'index' });
    }
})();