const axios = require('axios').default;
const config = require('config');

const REGISTER_BODY = {
    id: 'easyInfo',
    endpoint: 'https://localhost:8091',
    method: "post",
    filters: [
        { 
            name: "date_between", 
            options: {
                fromDate: "1900-06-22",
                toDate: "2050-07-29"
            }
        },
        {
            name: "xml_format"
        }
    ]
};

module.exports = async () => {
    await axios.post(config.get('goDataEndpoint'), REGISTER_BODY, 
        { headers: {'Content-Type': 'application/json'} });
}