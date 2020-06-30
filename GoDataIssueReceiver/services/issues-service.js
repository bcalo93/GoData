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
    let length = issues.data.length
    while(length > 0) {
        if(length < chunkSize) chunkSize = length
        let chunk = {}
        chunk.timeStamp = issues.timeStamp
        chunk.data = issues.data.splice(0,chunkSize)
        console.log(`Queuing [${chunkSize}] issues`)
        try{
            await publisher.publish(chunk)
        } catch(err) {
            await contingency.addMessage(chunk)
        }
        length = issues.data.length
    }
}

module.exports = {
    processIssues
}