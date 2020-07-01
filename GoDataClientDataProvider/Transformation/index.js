process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const TransformationService = require('./services/serviceProvider')('TransformationService');
const log = require('./dependencies/Logger');

(async () => {
    try {
        new TransformationService().start();
        log.info('Process started...', { location: 'index' });
    } catch(error) {
        log.error(error);
    }
})();