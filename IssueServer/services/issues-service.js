const fs = require('fs').promises;

const processIssues = (issues) => {
    return new Promise(async function(resolve, reject) {
        try{
            await fs.appendFile('./data',JSON.stringify(issues)+'\n')
            resolve();
        }
        catch(err){
            reject(err)
        }
    })
}

module.exports = {
    processIssues
}