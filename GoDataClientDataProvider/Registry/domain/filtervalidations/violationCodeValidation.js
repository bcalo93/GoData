const { FilterType, ViolationOption } = require('./../../dependencies/Commons');

const VALID_OPTIONS = Object.values(ViolationOption);

module.exports = filter => {
    const errors = [];
    const { options } = filter;
    if (!options) {
        errors.push(`${FilterType.VIOLATION_CODE}: options field is missing`);

    } else if (!VALID_OPTIONS.some(validOption => validOption === options)) {
        errors.push(`${FilterType.VIOLATION_CODE}: options value is not valid`);
        
    }

    return errors;
}