const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

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

// {
//     id: 1,
//     year: "2020",
//     months: [
//         {
//             month: "1",
//             count: 1 
//         }
//     ]
// }


issuesYearSummarySchema.plugin(uniqueValidator);

module.exports = issuesYearSummarySchema;