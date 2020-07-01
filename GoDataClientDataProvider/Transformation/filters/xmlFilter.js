const { FilterType } = require('./../dependencies/Commons');
const { XML_MESSAGE } = require('./../utils/messageFormatEnum');
const { Builder } = require('xml2js');

const builder = new Builder();
const filter = (input, next) => {
    if (!input) {
        next(`${FilterType.XML_FORMAT}: input is undefined or null.`);
        return;
    }

    let convertedInput = input;
    if (input instanceof Array) {
        convertedInput = { item: convertedInput };
    }

    convertedInput = { root: convertedInput };
    const result = {
        format: XML_MESSAGE,
        message: builder.buildObject(convertedInput)
    };
    next(null, result);
}

module.exports = {
    name: FilterType.XML_FORMAT,
    filter
}