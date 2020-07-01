const Config = require('config')
const Sequelize = require('sequelize')
const log = require('../../../Logger');
const location = { location: 'issues-emitter.repository' }

module.exports = class Repository {
    static connect() {
        this.connection = new Sequelize(
            Config.get('issues_repository.name'), 
            Config.get('issues_repository.credentials.user'), 
            Config.get('issues_repository.credentials.pass'), 
            { 
                dialect: "mysql", 
                logging: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 120000,
                    idle: 10000
                }
            }
        )
    }

    static async loadCollections() {
        const sequelize = this.connection
        const Issue = require('./models/issues')(Sequelize, sequelize)
        module.exports.Issue = Issue
    }

    static async initRepository() {
        try {
            await this.connect()
            await this.loadCollections()
        } catch (err) {
            log.error(`Error trying to connect to database: ${err}`,location)
        }
    }

    static async getIssues(from, limit) {
        return new Promise((resolve, reject) => {
            const sequelize = this.connection
            sequelize
                .query(`SELECT t.*
                        FROM(
                            SELECT SUMMONS_NUMBER
                            FROM Issues 
                            ORDER BY ISSUE_DATE 
                            LIMIT ${from}, ${limit}
                        ) q 
                        JOIN Issues t 
                        ON t.SUMMONS_NUMBER = q.SUMMONS_NUMBER`,
                {
                    model: module.exports.Issue,
                    mapToModel: true // pass true here if you have any mapped fields
                })
                .then(res => {
                    let issues = []
                    res.forEach(issue => {
                        issues.push(issue.dataValues)
                    })
                    resolve(issues)
                }).catch((err) => reject(err))
        })
    }
}