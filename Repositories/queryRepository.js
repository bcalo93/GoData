const Config = require("config");
const mongoose = require("mongoose");
const issuesYearSchema = require("./readModels/issuesYear");
const issuesCodesSchema = require("./readModels/issuesCodes");
const issuesStatesSchema = require("./readModels/issuesStates");
const log = require('./log');

module.exports = class QueryRepository {
    static async connect() {
        this.connection = await mongoose.connect(
            Config.get("query_repository.url"), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        );
        mongoose.set('useCreateIndex', true)
    }

    static async loadCollections() {
        module.exports.IssuesYear = this.connection.model("issuesYear", issuesYearSchema);
        module.exports.IssuesCodes = this.connection.model("issuesCodes", issuesCodesSchema);
        module.exports.IssuesStates = this.connection.model("issuesStates", issuesStatesSchema);
    }

    static async initRepository() {
        try {
            await this.connect();
            await this.loadCollections();
        } catch (err) {
            log.error(`Error trying to connect to reading database: ${err}`, { location: 'QueryRepository.initRepository' });
        }
    }
};