const { FilterType } = require('./../dependencies/Commons');
const moment = require('moment');

const DATE_FORMAT = 'YYYY-MM-DD';

const filter = (input, next) => {
    if (!input) {
        next(`${FilterType.VALID_DATE}: input is undefined or null`);
        return;
    }

    let result;
    if (input instanceof Array) {
        result = input.filter(element => validDate(element));
        if (result.length === 0) {
            next();
            return;
        }
    } else {
        if(!validDate(input)) {
            next();
            return;
        }
        result = input;
    }

    next(null, result);
}

const validDate = singleElement => {
    const { ISSUE_DATE } = singleElement;
    return ISSUE_DATE && moment(ISSUE_DATE, DATE_FORMAT, true).isValid();
}

module.exports = {
    name: FilterType.VALID_DATE,
    filter
}