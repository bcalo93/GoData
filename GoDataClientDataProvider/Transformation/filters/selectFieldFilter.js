const { FilterType } = require('./../dependencies/Commons');

const filter = (input, next, options) => {
    if (!options) {
        next(`${FilterType.SELECT_FIELDS}: options is undefined or null`);
        return;
    }

    if (!input) {
        next(`${FilterType.SELECT_FIELDS}: input is undefined or null`);
        return;
    }

    let result;
    if (input instanceof Array) {
        result = input.map(element => selectFields(element, options));

    } else {
        result = selectFields(input, options);
    }

    next(null, result);
}

const selectFields = (singleElement, fields) => {
    const result = {};
    fields.forEach(current => {
        const currentValue = singleElement[current];
        if(currentValue) {
            result[current] = currentValue;
        }
    });
    
    return result;
}

module.exports = {
    name: FilterType.SELECT_FIELDS,
    filter
};