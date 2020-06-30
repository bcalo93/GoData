const { FilterType } = require('./../../dependencies/Commons');

const VALID_FORMATS = ['MM/DD/YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'];

module.exports = filter => {
    const errors = [];
    const { options } = filter;
    if (!options) {
        errors.push(`${FilterType.DATE_FORMAT}: options field is missing`);

    } else if(!VALID_FORMATS.some(format => options === format)) {
        errors.push(`${FilterType.DATE_FORMAT}: options format is not valid`);
    }

    return errors;
}