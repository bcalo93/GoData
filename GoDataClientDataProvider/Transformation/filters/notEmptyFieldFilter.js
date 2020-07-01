const { FilterType } = require('./../dependencies/Commons');

const filter = (input, next, options) => {
    if (!options) {
        next(`${FilterType.NOT_EMPTY_FIELD}: options is undefined or null`);
        return;
    }

    if (!input) {
        next(`${FilterType.NOT_EMPTY_FIELD}: input is undefined or null`);
        return;
    }

    let result;
    if (input instanceof Array) {
        result = input.filter(element => checkEmptyFields(element, options));
        if (result.length === 0) {
            next();
            return;
        }
    } else {
        if(!checkEmptyFields(input, options)) {
            next();
            return;
        }
        result = input;
    }
    
    next(null, result);
}

const checkEmptyFields = (singleElement, options) => {
    return options.every(field => singleElement[field] && singleElement[field] !== '');
}

module.exports = {
    name: FilterType.NOT_EMPTY_FIELD,
    filter
}