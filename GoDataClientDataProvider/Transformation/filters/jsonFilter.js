const { FilterType } = require('./../dependencies/Commons');
const { JSON_MESSAGE } = require('./../utils/messageFormatEnum');

const filter = (input, next) => {
    if (!input) {
        next(`${FilterType.JSON_FORMAT}: input is undefined or null.`);
        return;
    }
    const result = {
        format: JSON_MESSAGE,
        message: JSON.stringify(input)
    };

    next(null, result);
}

module.exports = {
    name: FilterType.JSON_FORMAT,
    filter
}