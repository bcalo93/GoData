const axios = require('axios')

module.exports = class HttService {
    
    static postIssues(url, data, token){
        return axios({
            method: 'post',
            url: url,
            data: data,
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json', 
                'Content-Type': 'application/json' },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        })
    }
}