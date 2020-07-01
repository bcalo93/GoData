
class AbstractStateInfo {

    getType(plate) {
        throw new Error('Not implemented');
    }
    
    getState(code) {
        throw new Error('Not implemented');
    }

    existsType(plate) {
        throw new Error('Not implemented');
    }
    existsState(code) {
        throw new Error('Not implemented');
    }
}

module.exports = AbstractStateInfo