const { FilterType } = require('./../dependencies/Commons');

const filter = (input, next, options) => {
    if (!options) {
        next(`${FilterType.WHERE_FIELDS}: options is undefined or null`);
        return;
    }

    if (!input) {
        next(`${FilterType.WHERE_FIELDS}: input is undefined or null`);
        return;
    }

    let result;
    if (input instanceof Array) {
        result = input.filter(element => matchConditions(element, options));
        if (result.length === 0) {
            next();
            return;
        }
    } else {
        if (!matchConditions(input, options)) {
            next();
            return;
        }
        result = input;
    }

    next(null, result);
}

const matchConditions = (singleElement, options) => {
    return Object.keys(options).every(field => 
        options[field].some(matchValue => singleElement[field] === matchValue)
    );
}

module.exports = {
    name: FilterType.WHERE_FIELDS,
    filter
}