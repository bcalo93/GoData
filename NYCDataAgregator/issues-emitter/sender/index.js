const config = require('config')
const Repository = require('../repository')
const Consumers = require('../../consumers-repository')
const HttpService = require('../services/http-client')
const timeStampFieldName = config.get('time_stamp_field_name')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const secretKey = fs.readFileSync('./config/security/private.key', 'utf8')
const log = require('../../../Logger');
const location = { location: 'issues-emitter.sender' }

module.exports = class Sender {

    static async initialize () {
        await Repository.initRepository()
        this.consumers = await this.getConsumers()
        this.consumersObserver = Consumers.getConsumersObserver()
    }

    static async getConsumers() {
        return await Consumers.getConsumers()
    }

    static async sendIssues() {
        for(let i=0; i<this.consumers.length; i++) {
            try{
                await this.sendData(this.consumers[i])
            } catch(err) {
                log.error(`Error sending issues to ${this.consumers[i].endpoint}. ${err}`,location)
            }
        }
        this.watchNewConsumers()
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
                log.info(`Sending [${quantityPerQuery}] issues to ${consumer.endpoint}`,location)
                await this.trySendData(chunk, consumer)
            }
        }
    }

    static watchNewConsumers() {
        this.consumersObserver.on('new-consumer', async (consumer) => {
            try {
                await this.sendData(consumer)
            } catch(error) {
                log.error(`Error sending issues to ${consumer.endpoint}. ${error}`,location)
            }
        })
    }

    static async trySendData(issues, consumer) {
        try {
            let signOptions = config.get('jwt')
            let payload = { data: Date.now() }
            let token = jwt.sign(payload, secretKey, signOptions)
            let body = {}
            body[timeStampFieldName] = Date.now()
            body.data = issues
            await HttpService.postIssues(consumer.endpoint, body, token)
            log.info(`POST sent`,location)
        } catch(err) {
            log.error(`Error while trying to post issues to ${consumer.endpoint}: ${err}`,location)
        }
    }
}