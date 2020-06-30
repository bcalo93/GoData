const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.should();
const RegistryRepositoryImp = require('./../dependencies/Commons/repositories/registryRepositoryImp');
const RegistryServiceImp = require('./../services/registryServiceImp');
const { FilterType, ViolationOption } = require('./../dependencies/Commons');
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
                endpoint: 'http://localhost:9000/api',
                method: 'put',
                filters: [
                    {
                        name: FilterType.VALID_DATE
                    },
                    {
                        name: FilterType.DATE_BETWEEN,
                        options: {
                            fromDate: '2019-07-22',
                            toDate: '2019-07-29'
                        }
                    },
                    {
                        name: FilterType.DATE_FORMAT,
                        options: 'MM/DD/YYYY'
                    },
                    {
                        name: FilterType.WHERE_FIELDS,
                        options: {
                            VEHICLE_MAKE: ['VOLKS', 'AUDI']
                        }
                    },
                    {
                        name: FilterType.VIOLATION_CODE,
                        options: ViolationOption.VIOLATION_CODE
                    },
                    {
                        name: FilterType.NOT_EMPTY_FIELD,
                        options: ['PLATE_ID']
                    },
                    {
                        name: FilterType.STATE_INFO
                    },
                    {
                        name: FilterType.SELECT_FIELDS,
                        options: ['SUMMONS_NUMBER', 'PLATE_ID']
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://localhost:9000/api',
                method: 'PUT',
                filters: [
                    {
                        name: FilterType.VALID_DATE
                    },
                    {
                        name: FilterType.DATE_BETWEEN,
                        options: {
                            fromDate: '2019-07-22',
                            toDate: '2019-07-29'
                        }
                    },
                    {
                        name: FilterType.DATE_FORMAT,
                        options: 'MM/DD/YYYY'
                    },
                    {
                        name: FilterType.WHERE_FIELDS,
                        options: {
                            VEHICLE_MAKE: ['VOLKS', 'AUDI']
                        }
                    },
                    {
                        name: FilterType.VIOLATION_CODE,
                        options: ViolationOption.VIOLATION_CODE
                    },
                    {
                        name: FilterType.NOT_EMPTY_FIELD,
                        options: ['PLATE_ID']
                    },
                    {
                        name: FilterType.STATE_INFO
                    },
                    {
                        name: FilterType.SELECT_FIELDS,
                        options: ['SUMMONS_NUMBER', 'PLATE_ID']
                    },
                    { name: FilterType.JSON_FORMAT }
                ],
                notValidField: 'this is not valid'
            };

            return this.service.register(testRegistry).should.eventually.be
                .an('object').that.is.deep.equals(expectedResult)
                .then(() =>{
                    this.stub.createOrUpdate.should.be.calledOnceWith(expectedResult);
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if the repository rejects', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://localhost:9000',
                method: 'patch',
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
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(2)
                .and.contain.members(['id is missing', 'endpoint is missing'])
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if the endpoint value is not a valid URL', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://localhost:9000invalid',
                method: 'post',
                filters: [ { name: FilterType.XML_FORMAT } ]
            };
            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include('endpoint is not a valid url')
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if the method is not valid', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://localhost:9000/api?param=2',
                method: 'inv',
                filters: [ { name: FilterType.XML_FORMAT } ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include('method "inv" is not valid')
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if there is repeated filters on the list', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://localhost:9000/api?param=2',
                method: 'POST',
                filters: [
                    { name: FilterType.XML_FORMAT }, 
                    { name: FilterType.XML_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.XML_FORMAT} is duplicated`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if last filter is not a format filter', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.DATE_BETWEEN,
                        options: {
                            fromDate: '2010-09-10',
                            toDate: '2010-10-10'
                        }
                    }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include('Last filter must be a format filter')
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if any filter has name property as undefined', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    {
                        options: {
                            dateFrom: '2010-09-10',
                            dateTo: '2010-10-10'
                        }
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include('All filters should have a name property')
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject if the filter name is not valid', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { name: 'not_exist' },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include('"not_exist" is not a valid filter')
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter DATE_BETWEEN if options is undefined', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { name: FilterType.DATE_BETWEEN },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.DATE_BETWEEN}: options field is missing`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter DATE_BETWEEN if fromDate or toDate are undefined', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { name: FilterType.DATE_BETWEEN, options: {} },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(2)
                .and.contain.members([
                    `${FilterType.DATE_BETWEEN}: fromDate is missing`,
                    `${FilterType.DATE_BETWEEN}: toDate is missing`
                ]).then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter DATE_BETWEEN if fromDate or toDate are not valid dates', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.DATE_BETWEEN, 
                        options: {
                            fromDate: '20-30-2019',
                            toDate: '20-40-123'
                        }
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(2)
                .and.contain.members([
                    `${FilterType.DATE_BETWEEN}: fromDate is not a valid date`,
                    `${FilterType.DATE_BETWEEN}: toDate is not a valid date`
                ]).then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter DATE_BETWEEN if fromDate is after toDate', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.DATE_BETWEEN, 
                        options: {
                            fromDate: '2019-10-10',
                            toDate: '2019-10-09'
                        }
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.DATE_BETWEEN}: fromDate is not before toDate`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter SELECT_FIELDS if options is not defined', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.SELECT_FIELDS
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.SELECT_FIELDS}: options field is missing`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter SELECT_FIELDS if fields in options is not an array', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.SELECT_FIELDS,
                        options: 'this is an string'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.SELECT_FIELDS}: options must be an array`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter SELECT_FIELDS if fields in options is not an array', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.SELECT_FIELDS,
                        options: [{val: 2}, 'SUMMONS_NUMBER']
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.SELECT_FIELDS}: options have some elements that are not a string`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter WHERE_FIELDS if options is not defined', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { name: FilterType.WHERE_FIELDS },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.WHERE_FIELDS}: options field is missing`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter WHERE_FIELDS if options is not typeof object', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.WHERE_FIELDS,
                        options: 'not an object' 
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.WHERE_FIELDS}: options field is not valid`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter WHERE_FIELDS if options is an empty object', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.WHERE_FIELDS,
                        options: {}
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.WHERE_FIELDS}: options does not have filter conditions`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter WHERE_FIELDS if an options property is not an array ', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.WHERE_FIELDS,
                        options: {
                            VEHICLE_MAKE: ['VOLKS', 'AUDI'],
                            REGISTRATION_STATE: {}
                        }
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.WHERE_FIELDS}: some options properties are not arrays`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should resolves for filter DATE_FORMAT if options is YYYY/MM/DD', () => {
            const expectedResult = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.DATE_FORMAT,
                        options: 'YYYY/MM/DD'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.DATE_FORMAT,
                        options: 'YYYY/MM/DD'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
            .an('object').that.is.deep.equals(expectedResult)
            .then(() =>{
                this.stub.createOrUpdate.should.be.calledOnceWith(expectedResult);
                this.stub.findAll.should.not.be.called;
            });
        });

        it('should resolves for filter DATE_FORMAT if options is DD/MM/YYYY', () => {
            const expectedResult = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.DATE_FORMAT,
                        options: 'DD/MM/YYYY'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.DATE_FORMAT,
                        options: 'DD/MM/YYYY'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
            .an('object').that.is.deep.equals(expectedResult)
            .then(() =>{
                this.stub.createOrUpdate.should.be.calledOnceWith(expectedResult);
                this.stub.findAll.should.not.be.called;
            });
        });

        it('should reject for filter DATE_FORMAT if options is missing', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { name: FilterType.DATE_FORMAT },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.DATE_FORMAT}: options field is missing`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter DATE_FORMAT if options is not valid format', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.DATE_FORMAT,
                        options: 'not_valid'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.DATE_FORMAT}: options format is not valid`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should resolves for filter VIOLATION_CODE if options is VIOLATION_DESCRIPTION', () => {
            const expectedResult = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.VIOLATION_CODE,
                        options: ViolationOption.VIOLATION_DESCRIPTION
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.VIOLATION_CODE,
                        options: ViolationOption.VIOLATION_DESCRIPTION
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
            .an('object').that.is.deep.equals(expectedResult)
            .then(() =>{
                this.stub.createOrUpdate.should.be.calledOnceWith(expectedResult);
                this.stub.findAll.should.not.be.called;
            });
        });

        it('should resolves for filter VIOLATION_CODE if options is BOTH', () => {
            const expectedResult = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.VIOLATION_CODE,
                        options: ViolationOption.BOTH
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'patch',
                filters: [
                    { 
                        name: FilterType.VIOLATION_CODE,
                        options: ViolationOption.BOTH
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
            .an('object').that.is.deep.equals(expectedResult)
            .then(() =>{
                this.stub.createOrUpdate.should.be.calledOnceWith(expectedResult);
                this.stub.findAll.should.not.be.called;
            });
        });

        it('should reject for filter VIOLATION_CODE if options is missing', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { name: FilterType.VIOLATION_CODE },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.VIOLATION_CODE}: options field is missing`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter VIOLATION_CODE if options is not valid', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.VIOLATION_CODE,
                        options: 'not_valid'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.VIOLATION_CODE}: options value is not valid`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter NOT_EMPTY_FIELD if options is not defined', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.NOT_EMPTY_FIELD
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.NOT_EMPTY_FIELD}: options field is missing`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter NOT_EMPTY_FIELD if fields in options is not an array', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.NOT_EMPTY_FIELD,
                        options: 'this is an string'
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.NOT_EMPTY_FIELD}: options must be an array`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

        it('should reject for filter NOT_EMPTY_FIELD if fields in options is not an array', () => {
            const testRegistry = {
                id: 'BMW',
                endpoint: 'http://testurl.com',
                method: 'POST',
                filters: [
                    { 
                        name: FilterType.NOT_EMPTY_FIELD,
                        options: [{val: 2}, 'SUMMONS_NUMBER']
                    },
                    { name: FilterType.JSON_FORMAT }
                ]
            };

            return this.service.register(testRegistry).should.eventually.be
                .rejectedWith(ValidationRegistryException, 'Registry is not valid')
                .and.has.property('errors').which.is.an('array').that.has.lengthOf(1)
                .and.include(`${FilterType.NOT_EMPTY_FIELD}: options have some elements that are not a string`)
                .then(() => {
                    this.stub.createOrUpdate.should.not.be.called;
                    this.stub.findAll.should.not.be.called;
                });
        });

    });
}); 