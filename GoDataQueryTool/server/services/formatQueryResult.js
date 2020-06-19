const formatResultYears = (dbResult) => {
    const aux = dbResult.map(x => {
        const { year, months } = x;
        const auxMonths = months.map(m => {
            const { month, count } = m;
            return { month, count };
        })
        return { year, auxMonths };
    });
    return aux;
}

const formatResultCodes = (dbResult) => {
    const aux = dbResult.map(x => {
        const { violationCode, issues } = x;
        const auxIssues = issues.map(m => {
            const { date, count } = m;
            return { date, count };
        })
        return { violationCode, auxIssues };
    });
    return aux;
}

const formatResultStates = (dbResult) => {
    const aux = dbResult.map(x => {
        const { registrationState, issues } = x;
        const auxIssues = issues.map(m => {
            const { date, count } = m;
            return { date, count };
        })
        return { registrationState, auxIssues };
    });
    return aux;
}

module.exports = {
    formatResultYears,
    formatResultCodes,
    formatResultStates
}