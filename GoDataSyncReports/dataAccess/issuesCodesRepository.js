const log = require('../log');

const persistIssueCodes = async (issue, issueCodesRepository) => {
    const location = { location: 'issuesCodesRepository.persistIssueCodes' };
    log.info('Persist issue information into IssueCodes Report', location);
    log.debug(`Issue: ${issue}`, location);
    try {
        const code = await findCode(issue, issueCodesRepository);
        if (!code) {
            await createCodeDocument(issue, issueCodesRepository);
        } 
        const codeByDate = await findCodeByDate(issue, issueCodesRepository);
        if (!codeByDate) {
            await addDateItem(issue, issueCodesRepository);
        } else {
            await updateCodeDate(issue, issueCodesRepository);
        }
    } catch (err) {
        throw new Error(err)
    }
}

const findCode = async (issue, issueCodesRepository) => {
    const query = { violationCode: issue.violationCode };
    const location = { location: 'issuesCodesRepository.findCode' };
    log.debug(`query: ${query}`, location);
    return await issueCodesRepository.findOne(query).exec();
}

const findCodeByDate = async (issue, issueCodesRepository) => {
    const query = {
        violationCode: issue.violationCode,
        "issues.date": issue.issueDate
    };
    const location = { location: 'issuesCodesRepository.findCodeByDate' };
    log.debug(`query: ${query}`, location);
    return await issueCodesRepository.findOne(query).exec();
}

const createCodeDocument = async (issue, issueCodesRepository) => {
    const location = { location: 'issuesCodesRepository.createCodeDocument' };
    log.info('Creating new document...', location);
    const document = {
        violationCode: issue.violationCode,
        issues: []
    };
    log.debug(`document: ${document}`, location);
    await issueCodesRepository.create(document);
}

const addDateItem = async (issue, issueCodesRepository) => {
    const location = { location: 'issuesCodesRepository.addDateItem' };
    log.info('Adding new item...', location);
    const newDate = {
        date: issue.issueDate,
        count: 1
    };
    log.debug(`newDate: ${newDate}`, location);
    const codeDocument = await findCode(issue, issueCodesRepository);
    codeDocument.issues.push(newDate);
    return await codeDocument.save();
}

const updateCodeDate = async (issue, issueCodesRepository) => {
    const location = { location: 'issuesCodesRepository.updateCodeDate' };
    log.info('Updating report...', location);
    const query = {
        violationCode: issue.violationCode,
        "issues.date": issue.issueDate
    }

    const update = { 
        $inc: { "issues.$.count": 1 }
    }
    log.debug(`query: ${query}\n update: ${update} `, location);
    return await issueCodesRepository.updateOne(query, update).exec();
}

module.exports = {
    persistIssueCodes
};