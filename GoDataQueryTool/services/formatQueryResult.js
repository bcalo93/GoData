const formatResultYears = (dbResult) => {
    const aux = dbResult.map(x => {
        const { year, months } = x;
        const monthsCount = sumCountItems(months);
        return { year, monthsCount };
    });
    return aux;
}

const formatResultCodes = (dbResult) => {
    const aux = dbResult.map(x => {
        const { violationCode, issues } = x;
        const issuesCount = sumCountItems(issues);
        return { violationCode, issuesCount };
    });
    return aux;
}

const formatResultStates = (dbResult) => {
    const aux = dbResult.map(x => {
        const { registrationState, issues } = x;
        const issuesCount = sumCountItems(issues);
        return { registrationState, issuesCount };
    });
    return aux;
}

const sumCountItems = (issues) => {
    const array = issues.map( i=> i.count );
    return array.reduce((a, b) => a + b, 0);
}

module.exports = {
    formatResultYears,
    formatResultCodes,
    formatResultStates
}