const { FilterType, ViolationOption } = require('./../dependencies/Commons');
const CODE_MAP = require('./../resources/violation-code.json');

const filter = (input, next, options) => {
    if (!options) {
        next(`${FilterType.VIOLATION_CODE}: options is undefined or null`);
        return;
    }

    if (!input) {
        next(`${FilterType.VIOLATION_CODE}: input is undefined or null`);
        return;
    }

    let result;
    if (input instanceof Array) {
        result = input.map(value => convertElement(value, options));
    } else {
        result = convertElement(input, options);
    }

    next(null, result);
}

const convertElement = (sinleElement, options) => {
    if (options === ViolationOption.VIOLATION_CODE) {
        delete sinleElement.VIOLATION_DESCRIPTION;
    
    } else if (sinleElement.VIOLATION_CODE) {
        const description = CODE_MAP[sinleElement.VIOLATION_CODE];
        if (description) {
            sinleElement.VIOLATION_DESCRIPTION = description;
        }

        if (options === ViolationOption.VIOLATION_DESCRIPTION) {
            delete sinleElement.VIOLATION_CODE;
        }
    }

    return sinleElement;
}

module.exports = {
    name: FilterType.VIOLATION_CODE,
    filter
}