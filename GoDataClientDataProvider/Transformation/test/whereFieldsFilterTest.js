const { should, expect } = require('chai');
should();
const whereFields = require('./../filters/whereFieldsFilter').filter;
const { FilterType } = require('./../dependencies/Commons');

describe('#selectFieldsFilter()', () => {

    it('should return the single element input in case it meets the condition', (done) => {
        const expectedResult = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS' };
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS' };
        const options = { VEHICLE_MAKE: ['VOLKS', 'AUDI'] };
        whereFields(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should not return anything if the input does not meet the condition', (done) => {
        const testInput = { 
            ISSUE_DATE: '2010-03-02', 
            SUMMONS_NUMBER: 1, 
            VEHICLE_MAKE: 'VOLKS',
            STREET_CODE1: 205
        };
        const options = { 
            VEHICLE_MAKE: ['VOLKS', 'AUDI'],
            STREET_CODE1: [201, 202]
        };
        whereFields(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should return only the elements that meet the conditions for an array input', (done) => {
        const expectedResult = [{ 
            ISSUE_DATE: '2010-03-04', 
            SUMMONS_NUMBER: 2,
            VEHICLE_MAKE: 'AUDI',
            STREET_CODE1: 202
        }];
        const testInput = [
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 1,
                VEHICLE_MAKE: 'VOLKS',
                STREET_CODE1: 205
            },
            { 
                ISSUE_DATE: '2010-03-04', 
                SUMMONS_NUMBER: 2,
                VEHICLE_MAKE: 'AUDI',
                STREET_CODE1: 202
            },
            { 
                ISSUE_DATE: '2010-03-04', 
                SUMMONS_NUMBER: 3,
                VEHICLE_MAKE: 'JEEP',
                STREET_CODE1: 202
            }
        ];
        const options = { 
            VEHICLE_MAKE: ['AUDI', 'VOLKS'],
            STREET_CODE1: [202]
        };

        whereFields(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(1).and.is
                .deep.equals(expectedResult);
            expect(err).to.be.null;
            setImmediate(done)
        }, options);
    });

    it('should not return anything if the conditions are not met for an array input', (done) => {
        const testInput = [
            { 
                ISSUE_DATE: '2010-03-02', 
                SUMMONS_NUMBER: 1,
                VEHICLE_MAKE: 'VOLKS',
                STREET_CODE1: 205
            },
            { 
                ISSUE_DATE: '2010-03-04', 
                SUMMONS_NUMBER: 2,
                VEHICLE_MAKE: 'AUDI',
                STREET_CODE1: 202
            },
            { 
                ISSUE_DATE: '2010-03-04', 
                SUMMONS_NUMBER: 3,
                VEHICLE_MAKE: 'AUDI',
                STREET_CODE1: 203
            }
        ];
        const options = { 
            VEHICLE_MAKE: ['JEEP', 'VOLKS'],
            STREET_CODE1: [202, 203, 204]
        };

        whereFields(testInput, (err, result) => {
            expect(result).to.be.undefined;
            expect(err).to.be.undefined;
            setImmediate(done)
        }, options);
    });

    it('should return an error in case options is not defined', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        whereFields(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.WHERE_FIELDS}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case options is null', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        whereFields(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.WHERE_FIELDS}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, null);
    });

    it('should return an error in case input is not defined', (done) => {
        const options = { VEHICLE_MAKE: ['VOLKS', 'AUDI'] };
        whereFields(undefined, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.WHERE_FIELDS}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should return an error in case input is null', (done) => {
        const options = { VEHICLE_MAKE: ['VOLKS', 'AUDI'] };
        whereFields(null, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.WHERE_FIELDS}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });
});