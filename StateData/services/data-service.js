const plateType = require('../data/plate-type.json');
const stateCodes = require('../data/state-codes.json');

const getType = (plate) => {
    let type = plateType[plate]
    if(type !== undefined){
        type = {
            plate_name:type
        }
    }
    return type
}

const getState = (code) => {
    let state = stateCodes[code]
    if(state !== undefined){
        state = {
            state_name:state
        }
    }
    return state
}

module.exports = {
    getState,
    getType
}