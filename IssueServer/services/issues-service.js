const config = require('config')
const Publisher = require('./messaging/messaging')()
const publisher = new Publisher(config.get('queue_name'))

const processIssues = (issues) => {
    return new Promise(async function(resolve, reject) {
        try{
            splitAndPublish(issues)
            resolve();
        }
        catch(err){
            reject(err)
        }
    })
}

const splitAndPublish = (issues) => {
    let chunkSize = config.get('issues_per_message')
    while(issues.length > 0) {
        if(issues.length < chunkSize) chunkSize = issues.length
        let chunk = issues.splice(0,chunkSize)
        console.log(`Queuing [${chunkSize}] issues`)
        publisher.publish(chunk)
    }
}

module.exports = {
    processIssues
}