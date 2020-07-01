const log = require('../../Logger');

const persistIssueStates = async (issue, issueStatesRepository) => {
    const location = { location: 'issueStatesRepository.persistIssueStates' };
    log.info('Persist issue information into IssueStates Report', location);
    log.debug(`Issue: ${JSON.stringify(issue)}`, location);
    try {
        const state = await findState(issue, issueStatesRepository);
        if (!state) {
            await createStateDocument(issue, issueStatesRepository);
        } 
        const stateByDate = await findStateByDate(issue, issueStatesRepository);
        if (!stateByDate) {
            await addDateItem(issue, issueStatesRepository);
        } else {
            await updateStateDate(issue, issueStatesRepository);
        }
    } catch (err) {
        const error = new Error(err);
        log.error(error, location);
        throw error;
    }
}

const findState = async (issue, issueStatesRepository) => {
    const query = { registrationState: issue.registrationState };
    const location = { location: 'issueStatesRepository.findState' };
    log.debug(`query: ${JSON.stringify(query)}`, location);
    return await issueStatesRepository.findOne(query).exec();
}

const findStateByDate = async (issue, issueStatesRepository) => {
    const query = {
        registrationState: issue.registrationState,
        "issues.date": issue.issueDate
    };
    const location = { location: 'issueStatesRepository.findStateByDate' };
    log.debug(`query: ${JSON.stringify(query)}`, location);
    return await issueStatesRepository.findOne(query).exec();
}

const createStateDocument = async (issue, issueStatesRepository) => {
    const location = { location: 'issueStatesRepository.createStateDocument' };
    log.info('Creating new document...', location);
    const document = {
        registrationState: issue.registrationState,
        issues: []
    };
    log.debug(`document: ${JSON.stringify(document)}`, location);
    await issueStatesRepository.create(document);
}

const addDateItem = async (issue, issueStatesRepository) => {
    const location = { location: 'issueStatesRepository.addDateItem' };
    log.info('Adding new item...', location);
    const newDate = {
        date: issue.issueDate,
        count: 1
    };
    log.debug(`newDate: ${JSON.stringify(newDate)}`, location);
    const codeDocument = await findState(issue, issueStatesRepository);
    codeDocument.issues.push(newDate);
    return await codeDocument.save();
}

const updateStateDate = async (issue, issueStatesRepository) => {
    const location = { location: 'issueStatesRepository.updateStateDate' };
    log.info('Updating report...', location);
    const query = {
        registrationState: issue.registrationState,
        "issues.date": issue.issueDate
    }

    const update = { 
        $inc: { "issues.$.count": 1 }
    }
    log.debug(`query: ${JSON.stringify(query)}\n update: ${JSON.stringify(update)} `, location);
    return await issueStatesRepository.updateOne(query, update).exec();
}

module.exports = {
    persistIssueStates
};