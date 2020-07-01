const axios = require('axios').default;
const config = require('config');

const PORT = config.get('port');
const USE_HTTPS = config.get('useHttps');
const buildUrl = () => {
    const protocol = USE_HTTPS ? 'https' : 'http';
    return `${protocol}://localhost:${PORT}`;
}

const REGISTER_BODY = {
    id: 'easyInfo',
    endpoint: buildUrl(),
    method: "post",
    filters: [
        {
            name: 'select_fields',
            options: [
                'ISSUE_DATE', 
                'VIOLATION_CODE',
                'REGISTRATION_STATE',
                'PLATE_TYPE'
            ]
        },
        {
            name: 'state_info'
        },
        {
            name: 'violation_code',
            options: 'BOTH'
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