const moment = require('moment');
const { FilterType } = require('./../dependencies/Commons');

const filter = (input, next, options) => {
    if (!options) {
        next(`${FilterType.DATE_FORMAT}: options is undefined or null`);
        return;
    }

    if (!input) {
        next(`${FilterType.DATE_FORMAT}: input is undefined or null`);
        return;
    }

    let result;
    if (input instanceof Array) {
        result = input.map(value => formatDate(value, options));

    } else {
        result = formatDate(input, options);
    }
    
    next(null, result);
}

const formatDate = (input, format) => {
    if (input.ISSUE_DATE) {
        input.ISSUE_DATE = moment(input.ISSUE_DATE).format(format);
    }
    return input;
}

module.exports = {
    name: FilterType.DATE_FORMAT,
    filter
}