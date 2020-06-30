const { assert } = require('chai');
const dateBetween = require('./../filters/dateBetweenFilter').filter;
const { FilterType } = require('./../dependencies/Commons');

describe('#dateBetweenFilter()', () => {
    it('should not filter the single element passed as input', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-02' };
        const options = { fromDate: '2010-03-01', toDate: '2010-03-03' };
        dateBetween(testInput, (err, result) => {
            assert.isNull(err);
            assert.isDefined(result);
            assert.isObject(result);
            assert.equal(result, testInput);
            
            setImmediate(done);
        }, options);
    });

    it('should call callback with both undefined if single element not match range', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-04' };
        const options = { fromDate: '2010-03-01', toDate: '2010-03-03' };
        dateBetween(testInput, (err, result) => {
            assert.isUndefined(err);
            assert.isUndefined(result);
            setImmediate(done);
        }, options);
    });

    it('should filter no matching range for array input', (done) => {
        const testInput = [
            { ISSUE_DATE: '2010-03-01' },
            { ISSUE_DATE: '2010-03-04' },
            { ISSUE_DATE: '2010-03-02' }
        ];
        const options = { fromDate: '2010-03-02', toDate: '2010-03-03' };
        
        dateBetween(testInput, (err, result) => {
            assert.isNull(err);
            assert.isDefined(result);
            assert.isArray(result);
            assert.lengthOf(result, 1);
            assert.equal(result[0], testInput[2]);

            setImmediate(done);
        }, options);
    });

    it('should call callback with both undefined if no elements on array match the range', (done) => {
        const testInput = [
            { ISSUE_DATE: '2010-03-01' },
            { ISSUE_DATE: '2010-03-04' },
            { ISSUE_DATE: '2010-03-06' }
        ];
        const options = { fromDate: '2010-03-02', toDate: '2010-03-03' };
        
        dateBetween(testInput, (err, result) => {
            assert.isUndefined(err);
            assert.isUndefined(result);
            setImmediate(done);
        }, options);
    });

    it('should give an error if fromDate parameter is incorrect', (done) => {
        const testInput = [
            { ISSUE_DATE: '2010-03-01' },
            { ISSUE_DATE: '2010-03-04' },
            { ISSUE_DATE: '2010-03-06' }
        ];
        const options = { toDate: '2010-03-03' };
        
        dateBetween(testInput, (err, result) => {
            assert.isUndefined(result);
            assert.isNotNull(err);
            assert.isString(err);
            assert.equal(err, `${FilterType.DATE_BETWEEN}: options, fromDate or toDate are undefined.`);

            setImmediate(done);
        }, options);
    })
    
    it('should give an error if options parameter is incorrect', (done) => {
        const testInput = [
            { ISSUE_DATE: '2010-03-01' }
        ];
        const options = { fromDate: '2010-03-03' };
        
        dateBetween(testInput, (err, result) => {
            assert.isUndefined(result);
            assert.isNotNull(err);
            assert.isString(err);
            assert.equal(err, `${FilterType.DATE_BETWEEN}: options, fromDate or toDate are undefined.`);

            setImmediate(done);
        }, options);
    })

    it('should give an error if options is undefined', (done) => {
        const testInput = { ISSUE_DATE: '2010-03-01' };

        dateBetween(testInput, (err, result) => {
            assert.isUndefined(result);
            assert.isNotNull(err);
            assert.isString(err);
            assert.equal(err, `${FilterType.DATE_BETWEEN}: options, fromDate or toDate are undefined.`);

            setImmediate(done);
        });
    });

    it('should give an error if input is undefined', (done) => {
        const options = { fromDate: '2010-03-02', toDate: '2010-03-03' };

        dateBetween(undefined, (err, result) => {
            assert.isUndefined(result);
            assert.isNotNull(err);
            assert.isString(err);
            assert.equal(err, `${FilterType.DATE_BETWEEN}: input is undefined.`);

            setImmediate(done);
        }, options);

    });

    it('should filter element with ISSUE_DATE as undefined for single object input', (done) => {
        const testInput = { SUMMONS_NUMBER: 12345 };
        const options = { fromDate: '2010-03-02', toDate: '2010-03-03' };

        dateBetween(testInput, (err, result) => {
            assert.isUndefined(err);
            assert.isUndefined(result);
            setImmediate(done);
        }, options);

    });

    it('should filter element with ISSUE_DATE as undefined for array input', (done) => {
        const testInput = [
            { SUMMONS_NUMBER: 12345 },
            { SUMMONS_NUMBER: 67890 }
        ];
        const options = { fromDate: '2010-03-02', toDate: '2010-03-03' };

        dateBetween(testInput, (err, result) => {
            assert.isUndefined(err);
            assert.isUndefined(result);
            setImmediate(done);
        }, options);

    });
});