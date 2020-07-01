const persistIssueYear = async (issue, issueYearRepository) => {
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
        throw new Error(err)
    }
}

const findYear = async (issue, issueYearRepository) => {
    const query = { year: issue.year };
    return await issueYearRepository.findOne(query).exec();
}

const findByMonthAndYear = async (issue, issueYearRepository) => {
    const query = {
        year: issue.year,
        "months.month": issue.month
    };
    return await issueYearRepository.findOne(query).exec();
}

const createYearDocument = async (issue, issueYearRepository) => {
    const document = {
        year: issue.year,
        months: []
    };
    await issueYearRepository.create(document);
}

const addMonthItem = async (issue, issueYearRepository) => {
    console.log('issueYearRepository.addMonthItem excecuting...');
    const newMonth = {
        month: issue.month,
        count: 1
    };
    const yearDocument = await findYear(issue, issueYearRepository);
    yearDocument.months.push(newMonth);
    return await yearDocument.save();
}

const updateYear = async (issue, issueYearRepository) => {
    console.log('issueYearRepository.updateYear excecuting...');
    const query = {
        year: issue.year,
        "months.month": issue.month
    };
    const update = { 
        $inc: { "months.$.count": 1 }
    }
    return await issueYearRepository.updateOne(query, update).exec();
}

module.exports = {
    persistIssueYear
};