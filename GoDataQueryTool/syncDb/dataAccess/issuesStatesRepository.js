const persistIssueStates = async (issue, issueStatesRepository) => {
    try {
        const code = await findState(issue, issueStatesRepository);
        if (!code) {
            await createStateDocument(issue, issueStatesRepository);
        } 
        const codeByDate = await findStateByDate(issue, issueStatesRepository);
        if (!codeByDate) {
            await addDateItem(issue, issueStatesRepository);
        } else {
            await updateStateDate(issue, issueStatesRepository);
        }
    } catch (err) {
        throw new Error(err)
    }
}

const findState = async (issue, issueStatesRepository) => {
    const query = { registrationState: issue.registrationState };
    return await issueStatesRepository.findOne(query).exec();
}

const findStateByDate = async (issue, issueStatesRepository) => {
    const query = {
        registrationState: issue.registrationState,
        "issues.date": issue.issueDate
    };
    return await issueStatesRepository.findOne(query).exec();
}

const createStateDocument = async (issue, issueStatesRepository) => {
    const document = {
        registrationState: issue.registrationState,
        issues: []
    };
    await issueStatesRepository.create(document);
}

const addDateItem = async (issue, issueStatesRepository) => {
    console.log('issueStatesRepository.addDateItem excecuting...');
    const newDate = {
        date: issue.issueDate,
        count: 1
    };
    const codeDocument = await findState(issue, issueStatesRepository);
    codeDocument.issues.push(newDate);
    return await codeDocument.save();
}

const updateStateDate = async (issue, issueStatesRepository) => {
    console.log('issueStatesRepository.updateYear excecuting...');
    const query = {
        registrationState: issue.registrationState,
        "issues.date": issue.issueDate
    }

    const update = { 
        $inc: { "issues.$.count": 1 }
    }
    return await issueStatesRepository.updateOne(query, update).exec();
}

module.exports = {
    persistIssueStates
};