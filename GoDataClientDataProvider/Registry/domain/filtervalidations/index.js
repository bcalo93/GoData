const { FilterType } = require('./../../dependencies/Commons');

const filterValidations = {};
filterValidations[FilterType.DATE_BETWEEN] = require('./dateBetweenValidation');
filterValidations[FilterType.SELECT_FIELDS] = require('./selectFieldValidation');
filterValidations[FilterType.WHERE_FIELDS] = require('./whereFieldsValidation');
filterValidations[FilterType.DATE_FORMAT] = require('./dateFormatValidation');
filterValidations[FilterType.VIOLATION_CODE] = require('./violationCodeValidation');
filterValidations[FilterType.NOT_EMPTY_FIELD] = require('./notEmptyFieldValidation');
module.exports = filterValidations;