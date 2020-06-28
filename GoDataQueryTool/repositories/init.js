const { QueryRepository, WriteRepository } = require('./index');

Promise.all([
    QueryRepository.initRepository(),
    WriteRepository.initRepository()
])