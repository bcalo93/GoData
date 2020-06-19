const router = require('express').Router();
const RegistryController = require('./registryController');

const registryController = new RegistryController();

router.post('/registries', (req, res, next) => registryController.registerApp(req, res, next));
router.get('/registries', (req, res, next) => registryController.getAll(req, res, next));

module.exports = router;