const { assert } = require('chai');
const { Parser } = require('xml2js');
const xmlFilter = require('./../filters/xmlFilter').filter;
const { FilterType } = require('./../dependencies/Commons');
const { XML_MESSAGE } = require('./../utils/messageFormatEnum');

const parser = new Parser();

describe('#xmlFilter()', () => {
    it('should convert a list into valid xml', (done) => {
        const testInput = [
            {
                SUMMONS_NUMBER: 1084527017, 
                ISSUE_DATE: '2010-03-02', 
                REGISTRATION_STATE: 'NY' 
            },
            {
                SUMMONS_NUMBER: 1084527018, 
                ISSUE_DATE: '2010-07-02', 
                REGISTRATION_STATE: 'NY' 
            }
        ];
        xmlFilter(testInput, (error, result) => {
            assert.isNull(error);
            assert.isObject(result);
            assert.equal(result.format, XML_MESSAGE);
            parser.parseString(result.message, (error, xmlObject) => {
                assert.isNull(error);

                const { item } = xmlObject.root;
                assert.isArray(item);
                assert.lengthOf(item, 2);
                
                const first = item[0];
                assert.lengthOf(first.SUMMONS_NUMBER, 1);
                assert.equal(first.SUMMONS_NUMBER[0], '1084527017');
                assert.lengthOf(first.ISSUE_DATE, 1);
                assert.equal(first.ISSUE_DATE[0], '2010-03-02');
                assert.lengthOf(first.REGISTRATION_STATE, 1);
                assert.equal(first.REGISTRATION_STATE[0], 'NY');

                const second = item[1];
                assert.lengthOf(second.SUMMONS_NUMBER, 1);
                assert.equal(second.SUMMONS_NUMBER[0], '1084527018');
                assert.lengthOf(second.ISSUE_DATE, 1);
                assert.equal(second.ISSUE_DATE[0], '2010-07-02');
                assert.lengthOf(second.REGISTRATION_STATE, 1);
                assert.equal(second.REGISTRATION_STATE[0], 'NY');

                setImmediate(done);
            });
        });
    });

    it('should convert a single object into valid xml', (done) => {
        const testInput = {
            SUMMONS_NUMBER: 1084527018, 
            ISSUE_DATE: '2010-07-02', 
            REGISTRATION_STATE: 'NY' 
        };

        xmlFilter(testInput, (error, result) => {
            assert.isNull(error);
            assert.isObject(result);
            assert.equal(result.format, XML_MESSAGE);
            parser.parseString(result.message, (error, xmlObject) => {
                assert.isNull(error);

                const item = xmlObject.root;
                assert.lengthOf(item.SUMMONS_NUMBER, 1);
                assert.equal(item.SUMMONS_NUMBER[0], '1084527018');
                assert.lengthOf(item.ISSUE_DATE, 1);
                assert.equal(item.ISSUE_DATE[0], '2010-07-02');
                assert.lengthOf(item.REGISTRATION_STATE, 1);
                assert.equal(item.REGISTRATION_STATE[0], 'NY');
                
                setImmediate(done);
            });
        });
    });

    it('should gives an error if input is undefined', (done) => {
        xmlFilter(undefined, (error, result) => {
            assert.isString(error);
            assert.isUndefined(result);
            assert.equal(error, `${FilterType.XML_FORMAT}: input is undefined or null.`);
            
            setImmediate(done);
        });
    });

    it('should gives an error if input is null', (done) => {
        xmlFilter(null, (error, result) => {
            assert.isString(error);
            assert.isUndefined(result);
            assert.equal(error, `${FilterType.XML_FORMAT}: input is undefined or null.`);
            
            setImmediate(done);
        });
    });
});