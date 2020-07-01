const { should, expect } = require('chai');
should();
const validDate = require('./../filters/validDateFilter').filter;
const { FilterType } = require('./../dependencies/Commons');

describe('#validDateFilter()', () => {
    it('should return the same input if ISSUE_DATE is a valid date', (done) => {
        const expectedResult = { 
            ISSUE_DATE: '2010-03-02', 
            SUMMONS_NUMBER: 1, 
            VEHICLE_MAKE: 'VOLKS',
            STREET_CODE1: 205
        };
        const testInput = { 
            ISSUE_DATE: '2010-03-02', 
            SUMMONS_NUMBER: 1, 
            VEHICLE_MAKE: 'VOLKS',
            STREET_CODE1: 205
        };
        validDate(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        });
    });

    it('should return anything if single element input ISSUE_DATE is not a valid date', (done) => {
        const testInput = { 
            ISSUE_DATE: '02/02/2020',
            SUMMONS_NUMBER: 1,
            VEHICLE_MAKE: 'VOLKS',
            STREET_CODE1: 205
        };
        validDate(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return only elements with valid ISSUE_DATE for array input', (done) => {
        const expectedResult = { 
            ISSUE_DATE: '2010-03-02', 
            SUMMONS_NUMBER: 1, 
            VEHICLE_MAKE: 'VOLKS',
            STREET_CODE1: 205
        };
        const testInput = [
            { 
                ISSUE_DATE: 20201015, 
                SUMMONS_NUMBER: 2, 
                VEHICLE_MAKE: 'VOLKS',
                STREET_CODE1: 205
            },
            {
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 1, 
                VEHICLE_MAKE: 'VOLKS',
                STREET_CODE1: 205
            }
        ];

        validDate(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(1).and.deep.include(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        });
    });

    it('should return only elements with valid ISSUE_DATE for array input', (done) => {
        const testInput = [
            { 
                ISSUE_DATE: 20201015, 
                SUMMONS_NUMBER: 2, 
                VEHICLE_MAKE: 'VOLKS',
                STREET_CODE1: 205
            },
            {
                ISSUE_DATE: '2010/03/02', 
                SUMMONS_NUMBER: 1, 
                VEHICLE_MAKE: 'VOLKS',
                STREET_CODE1: 205
            }
        ];
        
        validDate(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case input is not defined', (done) => {
        validDate(undefined, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.VALID_DATE}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case input is null', (done) => {
        validDate(null, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.VALID_DATE}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });
});