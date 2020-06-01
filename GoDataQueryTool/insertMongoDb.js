const QueryRepository = require('./repositories/queryRepository');

(async () => {
    await QueryRepository.initRepository();
    
    const issueYearRepository = QueryRepository.IssuesYear;

    const document = {
        year: "2020",
        "months.month": "1"
    }

    const update = { 
        $inc: { "months.$.count": 1 } 
    }

    for(let i = 0; i<100; i++){
        const issueYearReport = await issueYearRepository.update(document, update).exec();
        console.log(issueYearReport);
    }
    process.send(process.pid);
})();