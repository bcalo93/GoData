const axios = require('axios')

module.exports = class HttService {

    constructor(config){
        this.instance = axios.create(config);
    }

    getWithParam(uri, param){
        return this.instance.get(`${uri}${param}`)
    }
}