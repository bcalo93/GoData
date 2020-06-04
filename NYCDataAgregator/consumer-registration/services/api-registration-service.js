const repository = require('../../consumers-repository')

const registerConsumer = (consumer) => {
    return repository.saveConsumer(consumer)
}

module.exports = {
    registerConsumer
}