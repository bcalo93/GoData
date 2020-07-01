module.exports.initServer = async () => {
    const express = require('express');
    const morgan = require('morgan');
    const bodyParser = require('body-parser');
    const router = require('./controllers/router');
    const errorHandler = require('./middlewares/errorHandler');
    const log = require('./log');

    const app = express();
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(router);
    app.use(errorHandler);

    app.listen(8090);
    log.info('Registry started at http://localhost:8090', { location: 'server.initServer' });
}