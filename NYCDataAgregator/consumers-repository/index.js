process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const config = require('config')

const getRepository = () => {
    let type = config.get('consumer_repository.type') || 'file-repository'
    
    try{
        return require(`./${type}`)
    } catch(err) {
        return require(`./file-repository`)
    }
}

module.exports = {
    saveConsumer: getRepository().saveConsumer,
    getConsumers: getRepository().getConsumers,
    getConsumersObserver: getRepository().getConsumersObserver
}