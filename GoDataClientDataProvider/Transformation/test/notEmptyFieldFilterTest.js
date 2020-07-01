const { should, expect } = require('chai');
should();
const notEmptyFields = require('./../filters/notEmptyFieldFilter').filter;
const { FilterType } = require('./../dependencies/Commons');

describe('#notEmptyFieldsFilter()', () => {
    it('should return the single element input if the specified fields are not empty', (done) => {
        const expectedResult = { 
            ISSUE_DATE: '2011-04-05', 
            SUMMONS_NUMBER: 2, 
            VIOLATION_CODE: 20,
            VIOLATION_LEGAL_CODE: '' 
        };
        const testInput = { 
            ISSUE_DATE: '2011-04-05', 
            SUMMONS_NUMBER: 2, 
            VIOLATION_CODE: 20,
            VIOLATION_LEGAL_CODE: '' 
        };
        const options = ['SUMMONS_NUMBER', 'VIOLATION_CODE'];
        notEmptyFields(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should not return the single element input if any specified fields is empty string', (done) => {
        const testInput = { 
            ISSUE_DATE: '2011-04-05', 
            SUMMONS_NUMBER: 2, 
            VIOLATION_CODE: 20,
            VIOLATION_LEGAL_CODE: ''
        };
        const options = ['VIOLATION_LEGAL_CODE', 'VIOLATION_CODE'];
        notEmptyFields(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should not return the single element input if any specified fields is undefined', (done) => {
        const testInput = { 
            ISSUE_DATE: '2011-04-05', 
            SUMMONS_NUMBER: 2, 
            VIOLATION_CODE: 20,
            VIOLATION_LEGAL_CODE: ''
        };
        const options = ['DAYS_IN_EFFECT', 'VIOLATION_CODE'];
        notEmptyFields(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should not return the single element input if any specified fields is null', (done) => {
        const testInput = { 
            ISSUE_DATE: '2011-04-05', 
            SUMMONS_NUMBER: 2, 
            VIOLATION_CODE: 20,
            VIOLATION_LEGAL_CODE: null
        };
        const options = ['VIOLATION_CODE', 'SUMMONS_NUMBER', 'VIOLATION_LEGAL_CODE'];
        notEmptyFields(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should return the array element input that the specified fields are not blank', (done) => {
        const expectedResult = {
            ISSUE_DATE: '2011-04-05', 
            SUMMONS_NUMBER: 4, 
            VIOLATION_CODE: '34',
            VIOLATION_LEGAL_CODE: '2'
        };
        const testInput = [
            { 
                ISSUE_DATE: '2011-04-05', 
                SUMMONS_NUMBER: 2, 
                VIOLATION_CODE: 20,
                VIOLATION_LEGAL_CODE: ''
            },
            { 
                ISSUE_DATE: '2011-04-05', 
                SUMMONS_NUMBER: 3, 
                VIOLATION_CODE: null,
                VIOLATION_LEGAL_CODE: '2'
            },
            { 
                ISSUE_DATE: '2011-04-05', 
                VIOLATION_CODE: null,
                VIOLATION_LEGAL_CODE: ''
            },
            { 
                ISSUE_DATE: '2011-04-05', 
                SUMMONS_NUMBER: 4, 
                VIOLATION_CODE: '34',
                VIOLATION_LEGAL_CODE: '2'
            }
        ];
        const options = ['VIOLATION_CODE', 'SUMMONS_NUMBER', 'VIOLATION_LEGAL_CODE'];
        notEmptyFields(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(1).and.deep
                .include(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return the array element input that the specified fields are not blank', (done) => {
        const testInput = [
            { 
                ISSUE_DATE: '2011-04-05', 
                SUMMONS_NUMBER: 2, 
                VIOLATION_CODE: 20,
                VIOLATION_LEGAL_CODE: ''
            },
            { 
                ISSUE_DATE: '2011-04-05', 
                SUMMONS_NUMBER: 3, 
                VIOLATION_CODE: null,
                VIOLATION_LEGAL_CODE: '2'
            },
            { 
                ISSUE_DATE: '2011-04-05', 
                VIOLATION_CODE: null,
                VIOLATION_LEGAL_CODE: ''
            }
        ];
        const options = ['VIOLATION_CODE', 'SUMMONS_NUMBER', 'VIOLATION_LEGAL_CODE'];
        notEmptyFields(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done);
        }, options);
    });
    
    it('should return an error in case options is not defined', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        notEmptyFields(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.NOT_EMPTY_FIELD}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case options is null', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        notEmptyFields(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.NOT_EMPTY_FIELD}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, null);
    });

    it('should return an error in case input is not defined', (done) => {
        const options = ['VEHICLE_MAKE'];
        notEmptyFields(undefined, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.NOT_EMPTY_FIELD}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should return an error in case input is null', (done) => {
        const options = ['VEHICLE_MAKE'];
        notEmptyFields(null, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.NOT_EMPTY_FIELD}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });
});