const { FilterType } = require('./../dependencies/Commons');
const stateinfo = require('./../dependencies/StateInfo');

const filter = (input, next) => {
    if (!input) {
        next(`${FilterType.STATE_INFO}: input is undefined or null`);
        return;
    }
    
    const typeMap = {};
    const stateMap = {};

    if (input instanceof Array) {
        setTypeAndStateArray(input, typeMap, stateMap)
            .then(value => next(null, value))
            .catch(err => next(err));
    } else {
        setTypeAndState(input, typeMap, stateMap).then(value => {
            next(null, value);
        }).catch(err => {
            next(err);
        });
    }
}

const setTypeAndStateArray = async (array, typeMap, stateMap) => {
    for (let i = 0; i < array.length; i++) {
        array[i] = await setTypeAndState(array[i], typeMap, stateMap);
    }
    return array;
}

const setTypeAndState = async (singleElement, typeMap, stateMap) => {
    if (singleElement.PLATE_TYPE) {
        singleElement.PLATE_DESCRIPTION = typeMap[singleElement.PLATE_TYPE] || 
            await stateinfo.getType(singleElement.PLATE_TYPE);
        
        typeMap[singleElement.PLATE_TYPE] = singleElement.PLATE_DESCRIPTION;
    }

    if (singleElement.REGISTRATION_STATE) {
        singleElement.STATE_DESCRIPTION = stateMap[singleElement.REGISTRATION_STATE] || 
            await stateinfo.getState(singleElement.REGISTRATION_STATE);
        
        stateMap[singleElement.REGISTRATION_STATE] = singleElement.STATE_DESCRIPTION;
    }

    return singleElement;
}

module.exports = {
    name: FilterType.STATE_INFO,
    filter
}