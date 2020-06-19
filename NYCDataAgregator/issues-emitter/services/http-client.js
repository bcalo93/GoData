const axios = require('axios')

module.exports = class HttService {
    
    static postIssues(url, data){
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
    }
}