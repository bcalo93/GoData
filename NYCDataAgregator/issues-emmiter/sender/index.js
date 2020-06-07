const config = require('config')
const Repository = require('../repository')
const Consumers = require('../../consumers-repository')
const HttpService = require('../services/http-service')
const timeStampFieldName = config.get('time_stamp_field_name')

module.exports = class Sender {
    static async initialize () {
        await Repository.initRepository();  
        
        let consumers = await this.getConsumers()
        consumers.forEach(consumer => 
            this.sendData(consumer))
    }

    static async sendData(consumer){
        let details = config.get('issues_emmiter')
        let from = details.offset
        let quantityPerQuery = details.issues_per_query
        let posts = details.posts_quantity
        let totalQuantity = quantityPerQuery * posts
        
        let maxRegs = config.get('db_query_max_regs')

        let remaining = totalQuantity
        let tmpFrom = from
        let issues = []
        while(remaining > 0) {
            let max = remaining
            if(max > maxRegs) max = maxRegs
            issues = issues.concat(await Repository.getIssues(tmpFrom, max))
            remaining = remaining - max
            tmpFrom = tmpFrom + max
            
            while(issues.length >= quantityPerQuery) {
                let chunk = issues.splice(0,quantityPerQuery)
                console.log(`Sending [${quantityPerQuery}]`)
                await this.trySendData(chunk, consumer.endpoint)
            }
        }
    }

    static async trySendData(issues, endpoint) {
        try {
            await HttpService.postIssues(endpoint, issues)
            console.log(`POST sent`)
        } catch(err) {
            console.log(`Error while trying to post data: ${err}`)
        }
    }

    static async getConsumers() {
        return await Consumers.getConsumers()
    }
}