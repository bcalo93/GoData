const { FilterType } = require('./../../dependencies/Commons');

module.exports = filter => {
    const errors = [];
    const { options } = filter;
    if (!options) {
        errors.push(`${FilterType.NOT_EMPTY_FIELD}: options field is missing`);
    
    } else if (!Array.isArray(options)) {
        errors.push(`${FilterType.NOT_EMPTY_FIELD}: options must be an array`);

    } else if (options.some(field => typeof field !== 'string')) {
        errors.push(`${FilterType.NOT_EMPTY_FIELD}: options have some elements that are not a string`);

    }
    return errors;
}