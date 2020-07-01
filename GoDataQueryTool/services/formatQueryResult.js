const formatResultYears = (dbResult) => {
    const aux = dbResult.map(x => {
        const { year, auxMonths } = x;
        const months = auxMonths.map(m => {
            const { month, count } = m;
            return { month, count };
        })
        return { year, months };
    });
    return aux;
}

const formatResultCodes = (dbResult) => {
    const aux = dbResult.map(x => {
        const { violationCode, auxIssues } = x;
        const issues = auxIssues.map(m => {
            const { date, count } = m;
            return { date, count };
        })
        return { violationCode, issues };
    });
    return aux;
}

const formatResultStates = (dbResult) => {
    const aux = dbResult.map(x => {
        const { registrationState, auxIssues } = x;
        const issues = auxIssues.map(m => {
            const { date, count } = m;
            return { date, count };
        })
        return { registrationState, issues };
    });
    return aux;
}

module.exports = {
    formatResultYears,
    formatResultCodes,
    formatResultStates
}