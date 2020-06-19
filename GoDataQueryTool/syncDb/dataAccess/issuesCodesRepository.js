const persistIssueCodes = async (issue, issueCodesRepository) => {
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
    return await issueCodesRepository.findOne(query).exec();
}

const findCodeByDate = async (issue, issueCodesRepository) => {
    const query = {
        violationCode: issue.violationCode,
        "issues.date": issue.issueDate
    };
    return await issueCodesRepository.findOne(query).exec();
}

const createCodeDocument = async (issue, issueCodesRepository) => {
    const document = {
        violationCode: issue.violationCode,
        issues: []
    };
    await issueCodesRepository.create(document);
}

const addDateItem = async (issue, issueCodesRepository) => {
    console.log('issueCodesRepository.addDateItem excecuting...');
    const newDate = {
        date: issue.issueDate,
        count: 1
    };
    const codeDocument = await findCode(issue, issueCodesRepository);
    codeDocument.issues.push(newDate);
    return await codeDocument.save();
}

const updateCodeDate = async (issue, issueCodesRepository) => {
    console.log('issueCodesRepository.updateYear excecuting...');
    const query = {
        violationCode: issue.violationCode,
        "issues.date": issue.issueDate
    }

    const update = { 
        $inc: { "issues.$.count": 1 }
    }
    return await issueCodesRepository.updateOne(query, update).exec();
}

module.exports = {
    persistIssueCodes
};