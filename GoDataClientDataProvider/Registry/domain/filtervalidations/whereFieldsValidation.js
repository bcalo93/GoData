const { FilterType } = require('./../../dependencies/Commons');

module.exports = filter => {
    const errors = [];
    const { options } = filter;
    if (!options) {
        errors.push(`${FilterType.WHERE_FIELDS}: options field is missing`);
    } else if (typeof options !== 'object') {
        errors.push(`${FilterType.WHERE_FIELDS}: options field is not valid`);
    } else {
        checkConditions(options, errors);
    }

    return errors;
}

const checkConditions = (options, errors) => {
    const values = Object.values(options);
    if (values.length === 0) {
        errors.push(`${FilterType.WHERE_FIELDS}: options does not have filter conditions`);
    } else if(values.some(value => !Array.isArray(value))) {
        errors.push(`${FilterType.WHERE_FIELDS}: some options properties are not arrays`);
    }
}