const config = require('config')
const Repository = require('../repository')
const Consumers = require('../../consumers-repository')
const HttpService = require('../services/http-service')

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
        let quantity = details.issues_per_query
        let posts = details.posts_quantity

        let endpoint = consumer.endpoint

        for(let i=0; i<posts; i++){
            console.log(`Sending POST ${i}`)
            this.trySendData(from, quantity, endpoint)
            from = from + quantity
        }
    }

    static async trySendData(from, quantity, endpoint) {
        try {
            let issues = await Repository.getIssues(from, quantity)
            await HttpService.postIssues(endpoint, issues)
            console.log(`POST sent. from ${from}`)
        } catch(err) {
            console.log(`Error while trying to post data: ${err}`)
        }
    }

    static async getConsumers() {
        return await Consumers.getConsumers()
    }
}