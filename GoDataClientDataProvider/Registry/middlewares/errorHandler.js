const { RegistryServiceException, ValidationRegistryException } = require('../exceptions');
const log = require('./../dependencies/Logger');

module.exports = (err, req, res, next) => {
    if (err instanceof ValidationRegistryException) {
        res.status(400);
        res.json({
            status: 400,
            message: err.message,
            errors: err.errors
        });

    } else if (err instanceof RegistryServiceException) {
        log.error(err, { location: 'errorHandler.RegistryServiceException'});
        res.status(503);
        res.json({
            status: 503,
            message: err.message
        });

    } else {
        log.error(err, { location: 'errorHandler'});
        next(err);
    }
}