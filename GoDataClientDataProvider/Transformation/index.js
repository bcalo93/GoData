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