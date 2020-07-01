const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const issuesRegistrationStatesDateSchemma = Schema({
    registrationState: {
        type: String,
        required: true,
        unique: true,
    },
    issues: [{
        date: {
            type: Date,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        }
    }]
});

issuesRegistrationStatesDateSchemma.plugin(uniqueValidator);

module.exports = issuesRegistrationStatesDateSchemma;