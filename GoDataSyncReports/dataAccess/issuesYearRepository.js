const log = require('../log');

const persistIssueYear = async (issue, issueYearRepository) => {
    const location = { location: 'issuesYearRepository.persistIssueYear' };
    log.info('Persist issue information into IssueYears Report', location);
    log.debug(`Issue: ${JSON.stringify(issue)}`, location);
    try {
        if (issue.year && issue.year !== 0 && issue.month && issue.month !== -1) {
            const year = await findYear(issue, issueYearRepository);
            if (!year) {
                await createYearDocument(issue, issueYearRepository);
            } 
            const monthAndYear = await findByMonthAndYear(issue, issueYearRepository);
            if (!monthAndYear) {
                await addMonthItem(issue, issueYearRepository);
            } else {
                await updateYear(issue, issueYearRepository);
            }
        }
    } catch (err) {
        const error = new Error(err);
        log.error(error, location);
        throw error;
    }
}

const findYear = async (issue, issueYearRepository) => {
    const query = { year: issue.year };
    const location = { location: 'issuesYearRepository.findYear' };
    log.debug(`query: ${JSON.stringify(query)}`, location);
    return await issueYearRepository.findOne(query).exec();
}

const findByMonthAndYear = async (issue, issueYearRepository) => {
    const query = {
        year: issue.year,
        "months.month": issue.month
    };
    const location = { location: 'issuesYearRepository.findByMonthAndYear' };
    log.debug(`query: ${JSON.stringify(query)}`, location);
    return await issueYearRepository.findOne(query).exec();
}

const createYearDocument = async (issue, issueYearRepository) => {
    const location = { location: 'issuesYearRepository.createYearDocument' };
    log.info('Creating new document...', location);
    const document = {
        year: issue.year,
        months: []
    };
    log.debug(`document: ${JSON.stringify(document)}`, location);
    await issueYearRepository.create(document);
}

const addMonthItem = async (issue, issueYearRepository) => {
    const location = { location: 'issueYearRepository.addMonthItem' };
    log.info('Adding new item...', location);
    const newMonth = {
        month: issue.month,
        count: 1
    };
    log.debug(`newMonth: ${JSON.stringify(newMonth)}`, location);
    const yearDocument = await findYear(issue, issueYearRepository);
    yearDocument.months.push(newMonth);
    return await yearDocument.save();
}

const updateYear = async (issue, issueYearRepository) => {
    const location = { location: 'issueYearRepository.updateYear' };
    log.info('Updating report...', location);
    const query = {
        year: issue.year,
        "months.month": issue.month
    };
    const update = { 
        $inc: { "months.$.count": 1 }
    }
    log.debug(`query: ${JSON.stringify(query)}\n update: ${JSON.stringify(update)} `, location);
    return await issueYearRepository.updateOne(query, update).exec();
}

module.exports = {
    persistIssueYear
};