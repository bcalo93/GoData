const axios = require('axios')

class HttpClient {

    constructor(config){
        this.instance = axios.create(config);
    }

    async getWithParam(uri, param){
        try {
            return await this.instance.get(`${uri}${param}`)
        } catch(error) {
            if(error.response && error.response.status){
                let status = error.response.status
                if(status === 404){
                    throw new NotFoundError()
                }
                if(status >= 500)
                    throw new ServerError()
            } else {
                throw new ConnectionError()
            }
        }
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class ServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServerError';
    }
}

class ConnectionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConnectionError';
    }
}

module.exports = {
    HttpClient,
    NotFoundError,
    ServerError,
    ConnectionError
}