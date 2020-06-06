const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const issuesViolationCodesDateSchemma = Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    violationCode: {
        type: String,
        required: true,
        unique: true,
    },
    issues: [{
        date: {
            type: Date,
            required: true
        },
        count: {
            type: Number,
            required: true,
        }
    }]
});

issuesViolationCodesDateSchemma.plugin(uniqueValidator);

module.exports = issuesViolationCodesDateSchemma;