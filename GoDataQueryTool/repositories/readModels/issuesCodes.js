const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

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

issuesViolationCodesDateSchemma.plugin(uniqueValidator);

module.exports = issuesViolationCodesDateSchemma;