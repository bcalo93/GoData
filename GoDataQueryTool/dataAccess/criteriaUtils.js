const getCodesCriteria = (request) => {
    const from = request.from;
    const to = request.to;
    const codes = request.codes;
    if(codes && codes.length !== 0) {
        return {
            violationCode: { $in: codes }, 
            "issues.date": {
                    $gte: from,
                    $lte: to
                }
        };
    } else {
        return {
            "issues.date": {
                    $gte: from,
                    $lte: to
                }
        };
    }
}

const getStateCriteria = (request) => { 
    const from = request.from;
    const to = request.to;
    const states = request.states;
    if(states && states.length !== 0) {
        return {
            registrationState: { $in: states }, 
            "issues.date": {
                    $gte: from,
                    $lte: to
                }
        };
    } else {
        return {
            "issues.date": {
                    $gte: from,
                    $lte: to
                }
        };
    }
}

module.exports = { 
    getCodesCriteria,
    getStateCriteria
}