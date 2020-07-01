const { FilterType } = require('./../../dependencies/Commons');
const moment = require('moment');

module.exports = filter => {
    const errors = [];
    if (!filter.options) {
        errors.push(`${FilterType.DATE_BETWEEN}: options field is missing`);
    } else {
        const { fromDate, toDate } = filter.options;
        validateDate(fromDate, 'fromDate', errors);
        validateDate(toDate, 'toDate', errors);

        if (fromDate && toDate && moment(fromDate, true).isAfter(moment(toDate, true))) {
            errors.push(`${FilterType.DATE_BETWEEN}: fromDate is not before toDate`);
        }
    }
    return errors;
}

const validateDate = (date, fieldName, errors) => {
    if (!date) {
        errors.push(`${FilterType.DATE_BETWEEN}: ${fieldName} is missing`);
    } else if(!moment(date, true).isValid()) {
        errors.push(`${FilterType.DATE_BETWEEN}: ${fieldName} is not a valid date`);
    }
}