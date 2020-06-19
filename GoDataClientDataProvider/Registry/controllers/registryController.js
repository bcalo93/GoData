const RegistryService = require('./../services/serviceProvider')('RegistryService');

module.exports = class RegistryController {
    constructor() {
        this.service = new RegistryService();
    }

    async registerApp(req, res, next) {
        try {
            const result = await this.service.register(req.body);
            res.status(201);
            res.json(result);
            next();
        } catch(err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const result = await this.service.findAll();
            res.status(200);
            res.json(result);
            next();
        } catch(err) {
            next(err);
        }
    }
}