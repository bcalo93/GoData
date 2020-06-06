const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const issuesYearSummarySchema = Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    year: {
        type: String,
        required: true,
    },
    months: [{
        month: {
            type: String,
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