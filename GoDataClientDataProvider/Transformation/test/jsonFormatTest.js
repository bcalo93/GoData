const { assert } = require('chai');
const jsonFilter = require('./../filters/jsonFilter').filter;
const { FilterType } = require('./../dependencies/Commons');
const { JSON_MESSAGE } = require('./../utils/messageFormatEnum');

describe('#jsonFilter()', () => {
    it('should convert input parameter into a JSON string', (done) => {
        const testInput = { 
            SUMMONS_NUMBER: 1084527017, 
            ISSUE_DATE: '2010-03-02', 
            REGISTRATION_STATE: 'NY' 
        };

        jsonFilter(testInput, (error, result) => {
            assert.isNull(error);
            assert.isObject(result);
            assert.isString(result.message);
            assert.isString(result.format);
            assert.equal(result.format, JSON_MESSAGE);
            assert.equal(result.message, JSON.stringify(testInput));
            
            setImmediate(done);
        });
    });

    it('should gives an error if input is undefined', (done) => {
        jsonFilter(undefined, (error, result) => {
            assert.isString(error);
            assert.isUndefined(result);
            assert.equal(error, `${FilterType.JSON_FORMAT}: input is undefined or null.`);

            setImmediate(done);
        });
    });

    it('should gives an error if input is null', (done) => {
        jsonFilter(null, (error, result) => {
            assert.isString(error);
            assert.isUndefined(result);
            assert.equal(error, `${FilterType.JSON_FORMAT}: input is undefined or null.`);

            setImmediate(done);
        });
    });
});