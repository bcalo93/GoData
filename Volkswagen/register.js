const axios = require('axios').default;
const config = require('config');

const PORT = config.get('port');
const USE_HTTPS = config.get('useHttps');
const buildUrl = () => {
    const protocol = USE_HTTPS ? 'https' : 'http';
    return `${protocol}://localhost:${PORT}`;
}

const REGISTER_BODY = {
    id: 'volkswagen',
    endpoint: buildUrl(),
    method: "post",
    filters: [
        {
            name: 'valid_date'
        },
        {
            name: 'where_fields',
            options: {
                VEHICLE_MAKE: ['VOLKS', 'AUDI', 'BUGAT', 'PORSC']
            }
        },
        {
            name: 'select_fields',
            options: [
                'ISSUE_DATE', 
                'VEHICLE_MAKE', 
                'VEHICLE_BODY_TYPE', 
                'VEHICLE_YEAR',
                'VIOLATION_CODE',
                'VIOLATION_PRECINCT',
                'REGISTRATION_STATE',
                'PLATE_TYPE'
            ]
        },
        {
            name: "date_between", 
            options: {
                fromDate: "2019-01-14",
                toDate: "2019-12-31"
            }
        },
        {
            name: 'date_format',
            options: 'DD/MM/YYYY'
        },
        {
            name: 'state_info'
        },
        {
            name: 'violation_code',
            options: 'BOTH'
        },
        {
            name: 'not_empty_field',
            options: ['VEHICLE_BODY_TYPE']
        },
        {
            name: "json_format"
        }
    ]
};

module.exports = async () => {
    await axios.post(config.get('goDataEndpoint'), REGISTER_BODY, 
        { headers: {'Content-Type': 'application/json'} });
}