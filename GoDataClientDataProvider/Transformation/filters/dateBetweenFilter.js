const moment = require('moment');
const { FilterType } = require('./../dependencies/Commons');

const filter = (input, next, options) => {
    try {
        if (!options || !options.fromDate || !options.toDate) {
            next(`${FilterType.DATE_BETWEEN}: options, fromDate or toDate are undefined.`);
            return;
        }

        if (!input) {
            next(`${FilterType.DATE_BETWEEN}: input is undefined.`);
            return;
        }

        const fromDate = moment(options.fromDate);
        const toDate = moment(options.toDate);
        let result;
        
        if (input instanceof Array) {
            result = input.filter(
                element => isInRange(element.ISSUE_DATE, fromDate, toDate)
            );
            if (!result || result.length === 0) {
                next();
                return;
            }            
        } else {
            if (!isInRange(input.ISSUE_DATE, fromDate, toDate)) {
                next();
                return;            
            }
            result = input;
        }

        next(null, result);

    } catch(err) {
        next(`${FilterType.DATE_BETWEEN}: ${err.message}`);
    }
}

const isInRange = (date, fromDate, toDate) => {
    return date && moment(date).isBetween(fromDate, toDate, 'date', '[]');
}

module.exports = {
    name: FilterType.DATE_BETWEEN,
    filter
}