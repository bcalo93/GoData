const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const issuesYearSummarySchema = Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    months: [{
        month: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        }
    }]
});

issuesYearSummarySchema.plugin(uniqueValidator);

module.exports = issuesYearSummarySchema;