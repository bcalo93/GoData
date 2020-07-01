const { should, expect } = require('chai');
should();
const selectFields = require('./../filters/selectFieldFilter').filter;
const { FilterType } = require('./../dependencies/Commons');

describe('#selectFieldsFilter()', () => {
    it('should return the fields specified on options for a single element input', (done) => {
        const expectedResult = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        const testInput = { 
            ISSUE_DATE: '2010-03-02', 
            SUMMONS_NUMBER: 1,
            REGISTRATION_STATE: 'NY',
            VIOLATION_CODE: '20'
        };
        const options = ['ISSUE_DATE', 'SUMMONS_NUMBER'];
        selectFields(testInput, (err, result) => {
            expect(err).to.be.null;
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            setImmediate(done);
        }, options);
    });

    it('should skip not defined values on single element input', (done) => {
        const expectedResult = { ISSUE_DATE: '2010-05-02', SUMMONS_NUMBER: 10 };
        const testInput = { 
            ISSUE_DATE: '2010-05-02', 
            SUMMONS_NUMBER: 10,
            REGISTRATION_STATE: 'NY',
            VIOLATION_CODE: '20'
        };
        const options = ['ISSUE_DATE', 'SUMMONS_NUMBER', 'VEHICLE_BODY_TYPE'];
        selectFields(testInput, (err, result) => {
            expect(err).to.be.null;
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            setImmediate(done);
        }, options);
    });

    it('should return the fields specified on options for a list of element input', (done) => {
        const expectedResult = [
            { VIOLATION_CODE: '20', SUMMONS_NUMBER: 1 },
            { VIOLATION_CODE: '25', SUMMONS_NUMBER: 2 }
        ];
        const testInput = [
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 1,
                REGISTRATION_STATE: 'NY',
                VIOLATION_CODE: '20'
            },
            { 
                ISSUE_DATE: '2010-04-02', 
                SUMMONS_NUMBER: 2,
                VIOLATION_CODE: '25'
            }
        ];
        const options = ['VIOLATION_CODE', 'SUMMONS_NUMBER'];
        selectFields(testInput, (err, result) => {
            expect(err).to.be.null;
            result.should.be.an('array').with.lengthOf(2).that.is.deep
                .members(expectedResult);
            setImmediate(done);
        }, options);
    });

    it('should skip not defined values on list of element input', (done) => {
        const expectedResult = [
            { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 1 },
            { VIOLATION_CODE: '25', SUMMONS_NUMBER: 2 }
        ];
        const testInput = [
            { 
                ISSUE_DATE: '2010-03-02',
                SUMMONS_NUMBER: 1,
                REGISTRATION_STATE: 'NY'
            },
            { 
                ISSUE_DATE: '2010-04-02', 
                SUMMONS_NUMBER: 2,
                VIOLATION_CODE: '25'
            }
        ];
        const options = ['VIOLATION_CODE', 'SUMMONS_NUMBER', 'REGISTRATION_STATE'];
        selectFields(testInput, (err, result) => {
            expect(err).to.be.null;
            result.should.be.an('array').with.lengthOf(2).that.is.deep
                .members(expectedResult);
            setImmediate(done);
        }, options);
    });

    it('should return an error in case options is not defined', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        selectFields(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.SELECT_FIELDS}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case options is null', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        selectFields(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.SELECT_FIELDS}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, null);
    });

    it('should return an error in case input is not defined', (done) => {
        const options = ['VIOLATION_CODE', 'SUMMONS_NUMBER', 'REGISTRATION_STATE'];
        selectFields(undefined, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.SELECT_FIELDS}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should return an error in case input is null', (done) => {
        const options = ['VIOLATION_CODE', 'SUMMONS_NUMBER', 'REGISTRATION_STATE'];
        selectFields(null, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.SELECT_FIELDS}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });
});