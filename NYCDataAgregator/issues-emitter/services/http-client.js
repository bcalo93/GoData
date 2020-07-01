const axios = require('axios')

module.exports = class HttService {
    
    static postIssues(url, data, token){
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
    }
}