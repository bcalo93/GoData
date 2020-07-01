const { assert } = require('chai');
const axios = require('axios');
const MessageType = require('./../utils/messageFormatEnum');
const sinon = require('sinon');
const SenderException = require('./../exceptions/senderException');

describe('#RestSenderService', () => {
    describe('#send()', () => {

        before(() => {
            this.stub = sinon.stub(axios, 'default');
            const RestSenderService = require('./../services/restSenderService');
            this.service = new RestSenderService();

        });

        afterEach(() => {
            this.stub.reset();
        });
        
        it('should make a single request with Content-Type as application/json', () => {
            const timeStamp = 1593557913055;
            const testContent = {
                message: 'A Message',
                format: MessageType.JSON_MESSAGE
            };

            const testContext = {
                id: 'testapp',
                endpoint: 'http://testurl.com',
                method: 'post'
            }
            this.service.send(testContent, { context: testContext, timeStamp });

            assert.isTrue(this.stub.calledOnce, 'Should be called once.');
            const params = this.stub.getCall(0).args[0];
            assert.equal(params.url, testContext.endpoint);
            assert.equal(params.method, testContext.method);
            assert.equal(params.data, testContent.message);
            assert.lengthOf(Object.keys(params.headers), 3);
            assert.propertyVal(params.headers, 'Content-Type', 'application/json');
            assert.property(params.headers, 'Authorization');
            assert.propertyVal(params.headers, 'Timestamp', timeStamp);
            
        });

        it('should make a single request with Content-Type as text/xml', () => {
            const timeStamp = 1593557913055;
            const testContent = {
                message: 'A Message',
                format: MessageType.XML_MESSAGE
            };

            const testContext = {
                id: 'testapp',
                endpoint: 'http://testurl.com',
                method: 'put'
            }
            this.service.send(testContent, { context: testContext, timeStamp });

            assert.isTrue(this.stub.calledOnce, 'Should be called once.');
            const params = this.stub.getCall(0).args[0];
            assert.equal(params.url, testContext.endpoint);
            assert.equal(params.method, testContext.method);
            assert.equal(params.data, testContent.message);
            assert.lengthOf(Object.keys(params.headers), 3);
            assert.propertyVal(params.headers, 'Content-Type', 'text/xml');
            assert.property(params.headers, 'Authorization');
            assert.propertyVal(params.headers, 'Timestamp', timeStamp);
        });

        it('should throw an exception if the format is not supported', (done) => {
            const timeStamp = 1593557913055;
            const testContent = {
                message: 'A Message',
                format: 'not_exist'
            };

            const testContext = {
                id: 'testapp',
                endpoint: 'http://testurl.com',
                method: 'patch'
            };

            this.service.send(testContent, { context: testContext, timeStamp})
                .catch(error => {
                    assert.isDefined(error);
                    assert.instanceOf(error, SenderException);
                    assert.equal(error.message, 'This format is not supported: not_exist');
                    assert.isTrue(this.stub.notCalled);
                    setImmediate(done);
                });
        });

        it('should throw an exception if the response status code is not 2xx', (done) => {
            const timeStamp = 1593557913055;
            this.stub.rejects({ 
                response: {
                    status: 404,
                    data: 'Error message'
                },
                request: {
                    currentUrl: 'http://testurl.com'
                }
            });

            const testContent = {
                message: 'A Message',
                format: MessageType.JSON_MESSAGE
            };

            const testContext = {
                id: 'testapp',
                endpoint: 'http://testurl.com',
                method: 'patch'
            };

            this.service.send(testContent, { context: testContext, timeStamp })
                .catch(error => {
                    assert.isDefined(error);
                    assert.instanceOf(error, SenderException);
                    assert.equal(
                        error.message, 
                        'Request failed - App: testapp - Status Code: 404 - Message: Error message'
                    );
                    assert.isTrue(this.stub.calledOnce);
                    setImmediate(done);
                });
        });

        it('should throw an exception if there\'s no response', (done) => {
            const timeStamp = 1593557913055;
            this.stub.rejects({
                request: {
                    currentUrl: 'http://testurl.com'
                }
            });

            const testContent = {
                message: 'A Message',
                format: MessageType.JSON_MESSAGE
            };

            const testContext = {
                id: 'testapp',
                endpoint: 'http://testurl.com',
                method: 'patch'
            };

            this.service.send(testContent, { context: testContext, timeStamp })
                .catch(error => {
                    assert.isDefined(error);
                    assert.instanceOf(error, SenderException);
                    assert.equal(
                        error.message, 
                        'Request failed - App: testapp - No Response from server'
                    );
                    assert.isTrue(this.stub.calledOnce);
                    setImmediate(done);
                });
        });

        it('should throw an exception if an unknown error just happened', (done) => {
            const timeStamp = 1593557913055;
            this.stub.rejects(new Error('Something went wrong'));

            const testContent = {
                message: 'A Message',
                format: MessageType.JSON_MESSAGE
            };

            const testContext = {
                id: 'testapp',
                endpoint: 'http://testurl.com',
                method: 'patch'
            };

            this.service.send(testContent, { context: testContext, timeStamp })
                .catch(error => {
                    assert.isDefined(error);
                    assert.instanceOf(error, SenderException);
                    assert.equal(
                        error.message, 
                        'Request failed - App: testapp - Something went wrong'
                    );
                    assert.isTrue(this.stub.calledOnce);
                    setImmediate(done);
                });
        });
    });
});