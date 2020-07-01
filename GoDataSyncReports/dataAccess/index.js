const { persistIssueYear } = require('./issuesYearRepository');
const { persistIssueCodes } = require('./issuesCodesRepository');
const { persistIssueStates } = require('./issuesStatesRepository');

module.exports = { persistIssueYear, persistIssueCodes, persistIssueStates }