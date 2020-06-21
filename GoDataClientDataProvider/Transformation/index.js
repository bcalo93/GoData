process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const TransformationService = require('./services/serviceProvider')('TransformationService');

(async () => {
    try {
        new TransformationService().start();
        console.log('Process started...');
    } catch(error) {
        //TODO log goes here.
        console.log(error);
    }
})();