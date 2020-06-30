const { should, expect } = require('chai');
should();
const violationCode = require('./../filters/violationCodeFilter').filter;
const { FilterType, ViolationOption } = require('./../dependencies/Commons');

describe('#violationCodeFilter()', () => {

    it('should return an object without description in case options is specified as VIOLATION_CODE', (done) => {
        const expectedResult = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1, VIOLATION_CODE: 20 };
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1, VIOLATION_CODE: 20, VIOLATION_DESCRIPTION: '' };
        const options = ViolationOption.VIOLATION_CODE;
        violationCode(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return an object with description but not violation code for VIOLATION_DESCRIPTION', (done) => {
        const expectedResult = { 
            ISSUE_DATE: '2010-03-02', 
            SUMMONS_NUMBER: 1, 
            VIOLATION_DESCRIPTION: 'NO PARKING-DAY/TIME LIMITS' 
        };
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1, VIOLATION_CODE: 20 };
        const options = ViolationOption.VIOLATION_DESCRIPTION;
        violationCode(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return an object with description and violation code for BOTH', (done) => {
        const expectedResult = { 
            ISSUE_DATE: '2010-03-02',
            SUMMONS_NUMBER: 1,
            VIOLATION_CODE: 20,
            VIOLATION_DESCRIPTION: 'NO PARKING-DAY/TIME LIMITS'
        };
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1, VIOLATION_CODE: 20 };
        const options = ViolationOption.BOTH;
        violationCode(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return the same object in case VIOLATION_CODE is missing', (done) => {
        const expectedResult = { 
            ISSUE_DATE: '2010-03-02',
            SUMMONS_NUMBER: 1
        };
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        const options = ViolationOption.BOTH;
        violationCode(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return an array without description in case options is specified as VIOLATION_CODE', (done) => {
        const expectedResult = [
            { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1, VIOLATION_CODE: 20 },
            { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 2 },
            { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 3, VIOLATION_CODE: 21 }
        ];
        const testInput = [
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 1, 
                VIOLATION_CODE: 20, 
                VIOLATION_DESCRIPTION: '' 
            },
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 2, 
                VIOLATION_DESCRIPTION: 'description2' 
            },
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 3, 
                VIOLATION_CODE: 21, 
                VIOLATION_DESCRIPTION: '' 
            }
        ];
        const options = ViolationOption.VIOLATION_CODE;
        violationCode(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(3).with.deep
                .members(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return an array with description but not violation code for VIOLATION_DESCRIPTION', (done) => {
        const expectedResult = [
            {
                ISSUE_DATE: '2010-03-02',
                SUMMONS_NUMBER: 1,
                VIOLATION_DESCRIPTION: 'NO PARKING-DAY/TIME LIMITS' 
            },
            {
                ISSUE_DATE: '2010-03-02',
                SUMMONS_NUMBER: 2,
                VIOLATION_DESCRIPTION: 'description2' 
            },
            {
                ISSUE_DATE: '2010-03-02',
                SUMMONS_NUMBER: 3,
                VIOLATION_DESCRIPTION: 'FAILURE TO DISPLAY BUS PERMIT' 
            }
        ];
        const testInput = [
            {
                ISSUE_DATE: '2010-03-02',
                SUMMONS_NUMBER: 1,
                VIOLATION_CODE: 20,
                VIOLATION_DESCRIPTION: '' 
            },
            {
                ISSUE_DATE: '2010-03-02',
                SUMMONS_NUMBER: 2,
                VIOLATION_DESCRIPTION: 'description2' },
            {
                ISSUE_DATE: '2010-03-02',
                SUMMONS_NUMBER: 3,
                VIOLATION_CODE: 1 
            }
        ];
        const options = ViolationOption.VIOLATION_DESCRIPTION;
        violationCode(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(3).with.deep
                .members(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return an array with description and violation code for BOTH', (done) => {
        const expectedResult = [
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 1, 
                VIOLATION_CODE: 20, 
                VIOLATION_DESCRIPTION: 'NO PARKING-DAY/TIME LIMITS' 
            },
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 2, 
                VIOLATION_DESCRIPTION: 'description2' },
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 3, 
                VIOLATION_CODE: 1, 
                VIOLATION_DESCRIPTION: 'FAILURE TO DISPLAY BUS PERMIT'
            }
        ];
        const testInput = [
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 1, 
                VIOLATION_CODE: 20, 
                VIOLATION_DESCRIPTION: '' 
            },
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 2, 
                VIOLATION_DESCRIPTION: 'description2' 
            },
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 3, 
                VIOLATION_CODE: 1 
            }
        ];
        const options = ViolationOption.BOTH;
        violationCode(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(3).with.deep
                .members(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return an error in case options is not defined', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        violationCode(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.VIOLATION_CODE}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case options is null', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        violationCode(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.VIOLATION_CODE}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, null);
    });

    it('should return an error in case input is not defined', (done) => {
        const options = { VEHICLE_MAKE: ['VOLKS', 'AUDI'] };
        violationCode(undefined, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.VIOLATION_CODE}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should return an error in case input is null', (done) => {
        const options = { VEHICLE_MAKE: ['VOLKS', 'AUDI'] };
        violationCode(null, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.VIOLATION_CODE}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });
});