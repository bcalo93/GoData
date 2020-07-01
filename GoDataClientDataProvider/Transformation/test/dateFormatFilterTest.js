const { should, expect } = require('chai');
should();
const dateFormat = require('./../filters/dateFormatFilter').filter;
const { FilterType } = require('./../dependencies/Commons');

describe('#dateFormatFilter()', () => {
    it('should return the single element input with ISSUE_DATE converted to MM/DD/YYYY', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        const options = 'MM/DD/YYYY';
        dateFormat(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep
                .equals({ ISSUE_DATE: '03/02/2010', SUMMONS_NUMBER: 1 });
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return the single element input with ISSUE_DATE converted', (done) => {
        const testInput = { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 1 };
        const options = 'MM/DD/YYYY';
        dateFormat(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep
                .equals({ REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 1 });
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return the array input with ISSUE_DATE converted to DD/MM/YYYY', (done) => {
        const testInput = [
            { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 },
            { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 2 },
            { ISSUE_DATE: '2011-12-31', SUMMONS_NUMBER: 3 }
        ];
        const options = 'DD/MM/YYYY';
        dateFormat(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(3).that.has.deep.members([
                { ISSUE_DATE: '02/03/2010', SUMMONS_NUMBER: 1 },
                { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 2 },
                { ISSUE_DATE: '31/12/2011', SUMMONS_NUMBER: 3 }
            ]);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return the array input with ISSUE_DATE converted to YYYY/MM/DD', (done) => {
        const testInput = [
            { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 },
            { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 2 },
            { ISSUE_DATE: '2011-12-31', SUMMONS_NUMBER: 3 }
        ];
        const options = 'YYYY/MM/DD';
        dateFormat(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(3).that.has.deep.members([
                { ISSUE_DATE: '2010/03/02', SUMMONS_NUMBER: 1 },
                { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 2 },
                { ISSUE_DATE: '2011/12/31', SUMMONS_NUMBER: 3 }
            ]);
            expect(err).to.be.null;
            setImmediate(done);
        }, options);
    });

    it('should return an error in case options is not defined', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        dateFormat(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.DATE_FORMAT}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case options is null', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02', SUMMONS_NUMBER: 1 };
        dateFormat(testInput, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.DATE_FORMAT}: options is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, null);
    });

    it('should return an error in case input is not defined', (done) => {
        const options = 'MM/DD/YYYY';
        dateFormat(undefined, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.DATE_FORMAT}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });

    it('should return an error in case input is null', (done) => {
        const options = 'MM/DD/YYYY';
        dateFormat(null, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.DATE_FORMAT}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        }, options);
    });
});