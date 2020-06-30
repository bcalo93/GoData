const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
chai.should();
const { FilterType } = require('./../dependencies/Commons');


describe('#stateInfo()', () => {
    before(() => {
        const DataService = require('./../dependencies/StateInfo/implementations/state-info-redis');
        this.stub = sinon.createStubInstance(DataService);
        require.cache[require.resolve('./../dependencies/StateInfo')] = {
            exports: this.stub
        };
        this.stateInfo = require('./../filters/stateInfoFilter').filter;
    });

    afterEach(() => {
        sinon.reset();
    });

    it('should return the single element input with plateType', (done) => {
        const expectedResult = { PLATE_TYPE: 'PAS', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS', PLATE_DESCRIPTION: 'Passenger' };
        const testInput = { PLATE_TYPE: 'PAS', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS' };
        this.stub.getType.resolves('Passenger');
        this.stateInfo(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            this.stub.getType.should.be.calledOnceWith('PAS');
            this.stub.getState.should.not.be.called;
            setImmediate(done);
        });
    });

    it('should return the single element input with registrationState', (done) => {
        const expectedResult = { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS', STATE_DESCRIPTION: 'NEW YORK' };
        const testInput = { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS' };
        this.stub.getState.resolves('NEW YORK');
        this.stateInfo(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            this.stub.getState.should.be.calledOnceWith('NY');
            this.stub.getType.should.not.be.called;
            setImmediate(done);
        });
    });

    it('should return the single element input with registrationState and plateState', (done) => {
        const expectedResult = { REGISTRATION_STATE: 'NY', PLATE_TYPE: 'PAS', SUMMONS_NUMBER: 1, STATE_DESCRIPTION: 'NEW YORK', PLATE_DESCRIPTION: 'Passenger' };
        const testInput = { REGISTRATION_STATE: 'NY', PLATE_TYPE: 'PAS', SUMMONS_NUMBER: 1 };
        this.stub.getState.resolves('NEW YORK');
        this.stub.getType.resolves('Passenger');
        this.stateInfo(testInput, (err, result) => {
            result.should.be.an('object').that.is.deep.equals(expectedResult);
            expect(err).to.be.null;
            this.stub.getState.should.be.calledOnceWith('NY');
            this.stub.getType.should.be.calledOnceWith('PAS');
            setImmediate(done);
        });
    });

    it('should return the input array with registrationState and plateState populated', (done) => {
        const expectedResult = [
            { 
                REGISTRATION_STATE: 'NY', 
                PLATE_TYPE: 'PAS', 
                SUMMONS_NUMBER: 1, 
                STATE_DESCRIPTION: 'NEW YORK', 
                PLATE_DESCRIPTION: 'Passenger' 
            },
            { 
                REGISTRATION_STATE: 'FL', 
                PLATE_TYPE: 'BOT', 
                SUMMONS_NUMBER: 2, 
                STATE_DESCRIPTION: 'FLORIDA', 
                PLATE_DESCRIPTION: 'Boat' 
            },
            { 
                REGISTRATION_STATE: 'NY', 
                PLATE_TYPE: 'PAS', 
                SUMMONS_NUMBER: 3, 
                STATE_DESCRIPTION: 'NEW YORK', 
                PLATE_DESCRIPTION: 'Passenger' 
            }
        ];
        const testInput = [
            { 
                REGISTRATION_STATE: 'NY', 
                PLATE_TYPE: 'PAS', 
                SUMMONS_NUMBER: 1 
            },
            { 
                REGISTRATION_STATE: 'FL', 
                PLATE_TYPE: 'BOT', 
                SUMMONS_NUMBER: 2
            },
            { 
                REGISTRATION_STATE: 'NY', 
                PLATE_TYPE: 'PAS', 
                SUMMONS_NUMBER: 3
            }
        ];
        this.stub.getState.onFirstCall().resolves('NEW YORK');
        this.stub.getState.onSecondCall().resolves('FLORIDA');
        this.stub.getType.onFirstCall().resolves('Passenger');
        this.stub.getType.onSecondCall().resolves('Boat');

        this.stateInfo(testInput, (err, result) => {
            result.should.be.an('array').that.has.lengthOf(3).and.has.deep
                .members(expectedResult);
            expect(err).to.be.null;
            this.stub.getState.should.be.calledTwice;
            this.stub.getType.should.be.calledTwice;
            setImmediate(done);
        });
    });

    it('should return an error for a single element if getType is rejected', (done) => {
        const testInput = { PLATE_TYPE: 'PAS', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS' };
        this.stub.getType.rejects(new Error('getType rejected'));
        this.stateInfo(testInput, (err, result) => {
            err.should.be.instanceOf(Error).with.property('message', 'getType rejected');
            expect(result).to.be.undefined;
            this.stub.getType.should.be.calledOnceWith('PAS');
            this.stub.getState.should.not.be.called;
            setImmediate(done);
        });
    });

    it('should return an error for a single element if getState is rejected', (done) => {
        const testInput = { REGISTRATION_STATE: 'NY', SUMMONS_NUMBER: 1, VEHICLE_MAKE: 'VOLKS' };
        this.stub.getState.rejects(new Error('getState rejected'));
        this.stateInfo(testInput, (err, result) => {
            err.should.be.instanceOf(Error).with.property('message', 'getState rejected');
            expect(result).to.be.undefined;
            this.stub.getState.should.be.calledOnceWith('NY');
            this.stub.getType.should.not.be.called;
            setImmediate(done);
        });
    });

    it('should return an error in case input is not defined', (done) => {
        this.stateInfo(undefined, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.STATE_INFO}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });

    it('should return an error in case input is null', (done) => {
        this.stateInfo(null, (err, result) => {
            err.should.be.an('string').that.is
                .equals(`${FilterType.STATE_INFO}: input is undefined or null`);
            expect(result).to.be.undefined;
            setImmediate(done);
        });
    });
});