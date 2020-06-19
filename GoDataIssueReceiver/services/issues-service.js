const config = require('config')
const Publisher = require('./messaging/messaging')()
const publisher = new Publisher(config.get('queue_name'))
const contingency = require('./contingency/messages-buffer')

const processIssues = (issues) => {
    return new Promise(async function(resolve, reject) {
        try{
            await splitAndPublish(issues)
            resolve()
        }
        catch(err){
            console.error(err)
            reject()
        }
    })
}

const splitAndPublish = async (issues) => {
    let chunkSize = config.get('issues_per_message')
    while(issues.length > 0) {
        if(issues.length < chunkSize) chunkSize = issues.length
        let chunk = issues.splice(0,chunkSize)
        console.log(`Queuing [${chunkSize}] issues`)
        try{
            await publisher.publish(chunk)
        } catch(err) {
            await contingency.addMessage(chunk)
        }
    }
}

module.exports = {
    processIssues
}