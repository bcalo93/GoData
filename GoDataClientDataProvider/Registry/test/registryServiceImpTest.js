const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.should();
const RegistryRepositoryImp = require('./../dependencies/Commons/repositories/registryRepositoryImp');
const RegistryServiceImp = require('./../services/registryServiceImp');
const { FilterType } = require('./../dependencies/Commons');
const { RegistryServiceException, ValidationRegistryException } = require('./../exceptions');

describe('#RegistryServiceImp', () => {
    before(() => {
        this.stub = sinon.createStubInstance(RegistryRepositoryImp);
        this.service = new RegistryServiceImp(this.stub);
    });

    afterEach(() => {
        sinon.reset();
    });

    describe('#register', () => {
        it('should create a valid registry with only valid fields', () => {
            const expectedResult = {
                id: 'BMW',
                endpoint: 'http://localhost:9000',
                method: 'post',
                filters: [
                    {
                        name: FilterType.DATE_BETWEEN,
                        options: {
                            fromDate: '2019-07-22',
                            toDate: '2019-07-29'
                        }
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://localhost:9000',
                method: 'post',
                filters: [
                    {
                        name: FilterType.DATE_BETWEEN,
                        options: {
                            fromDate: '2019-07-22',
                            toDate: '2019-07-29'
                        }
                    },
                    { name: FilterType.JSON_FORMAT }
                ],
                notValidField: 'this is not valid'
            };

            return this.service.register(testRegistry)
                .should.eventually.be.an('object').that
                .is.deep.equals(expectedResult)
                .then(() =>{
                    this.stub.createOrUpdate.should.be.calledOnceWith(expectedResult);
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if the repository rejects', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://localhost:9000',
                method: 'post',
                filters: [ { name: FilterType.XML_FORMAT } ]
            };

            const testError = new Error('Repository Error');
            this.stub.createOrUpdate.rejects(testError);

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(
                    RegistryServiceException, 
                    'An error occurred trying to save the registry'
                ).and.has.property('inner').which.is.deep.equal(testError)
                .then(() => {
                    this.stub.createOrUpdate.should.be.calledOnceWith(testRegistry);
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject including each missing required field', () => {
            return this.service.register({}).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.has.lengthOf(2).and.contain
                .members(['"id" is missing', '"endpoint" is missing'])
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });
    });
}); 