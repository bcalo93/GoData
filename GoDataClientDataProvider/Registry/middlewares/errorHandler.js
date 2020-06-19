const { RegistryServiceException, ValidationRegistryException } = require('../exceptions');

module.exports = (err, req, res, next) => {
    if (err instanceof ValidationRegistryException) {
        res.status(404);
        res.json({
            status: 404,
            message: err.message,
            errors: err.errors
        });

    } else if (err instanceof RegistryServiceException) {
        // Log Should goes here. Redis might be down.
        res.status(503);
        res.json({
            status: 503,
            message: err.message
        });

    } else {
        // It breaks somewhere log error here.
        next(err);
    }
}