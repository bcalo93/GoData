const Config = require('config');
const Sequelize = require('sequelize');

module.exports = class Repository {
    static connect() {
        this.connection = new Sequelize(
            Config.get('repository.name'), 
            Config.get('repository.credentials.user'), 
            Config.get('repository.credentials.pass'), 
            { dialect: "mysql",}
        );
    }
    static async loadCollections() {
        const sequelize = this.connection;
        // set up models
        const Issue = require('./models/issues')(Sequelize, sequelize);

        module.exports.Issue = Issue;
        
        sequelize.sync();
    }


    static async initRepository() {
        try {
            await this.connect();
            await this.loadCollections();
        } catch (err) {
            console.log(`Error trying to connect to database: ${err}`);
        }
    }
}