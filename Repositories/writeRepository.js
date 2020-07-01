const Config = require('config');
const Sequelize = require('sequelize');
const log = require('../Logger');

module.exports = class Repository {

    static connect() {   
        const log = require('../Logger');
     
        this.connection = new Sequelize(
            Config.get('write_repository.name'), 
            Config.get('write_repository.credentials.user'), 
            Config.get('write_repository.credentials.pass'), 
            { 
                dialect: "mysql",
                logging: msg => log.debug(msg, { location: 'Repository.connect' })
            }
        );
    }
    static loadCollections() {
        const sequelize = this.connection;
        // set up models
        const Issue = require('./writeModels/issues')(Sequelize, sequelize);

        module.exports.Issue = Issue;
        
        return sequelize.sync();
    }


    static async initRepository() {
        try {
            await this.connect();
            await this.loadCollections();
        } catch (err) {
            log.error(`Error trying to connect to writing database: ${err}`, { location: 'Repository.initRepository' });
        }
    }
}