const QueryRepository = require('../../repositories/queryRepository');
 module.exports = class IssueDataAccess {
     constructor() {
         this.issueYearRepository = QueryRepository.IssuesYear;
         this.issueCodesRepository = QueryRepository.IssuesCodes;
         this.issueStatesRepository = QueryRepository.IssuesStates;
    }

    async persistIssueInDocuments(issue) {
        try{
            await this.persistIssueYear(issue);
            await this.persistIssueCodes(issue);
            await this.persistIssueStates(issue);
        } catch (err) {
            throw new Error('Database connection error\n'+ err)
        }
    }

    async persistIssueYear(issue) {
        if (issue.year && issue.year !== 0 && issue.month && issue.month !== 0) {
            const document = {
                year: issue.year,
                "issues.month": issue.month
            }
        
            const update = { 
                $inc: { "months.$.count": 1 } 
            }
            await this.issueYearRepository.update(document, update).exec();
        }
    }
    
    async persistIssueCodes(issue) {
        const document = {
            violationCode: issue.violationCode,
            "issues.date": issue.issueDate
        }
    
        const update = { 
            $inc: { "issues.$.count": 1 } 
        }
        await this.issueCodesRepository.update(document, update).exec();
    }

    async persistIssueStates(issue) {
        const document = {
            registrationState: issue.registrationState,
            "issues.date": issue.issueDate
        }
    
        const update = { 
            $inc: { "issues.$.count": 1 } 
        }
        await this.issueStatesRepository.update(document, update).exec();
    }
 }