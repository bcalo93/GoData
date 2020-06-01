const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const issuesRegistrationStatesDateSchemma = Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    registrationState: {
        type: String,
        required: true,
        unique: true,
    },
    issues: [{
        id: {
            type: SchemaTypes.Long,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }]
});

issuesRegistrationStatesDateSchemma.plugin(uniqueValidator);

module.exports = issuesRegistrationStatesDateSchemma;