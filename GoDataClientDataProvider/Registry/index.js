const Server = require('./server');

(async () => {
    try {
        await Server.initServer();

    } catch(error) {
        // TODO: add log here.
        console.log(error);
    }
})();