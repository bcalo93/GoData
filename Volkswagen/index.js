const Server = require('./server');
const register = require('./register');

(async () => {
    await Server.initServer();
    await register();
})();