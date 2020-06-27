const dataService = require('../services/data-service')

const getState = (req, res, next) => {
    const code = req.params.code
    const result = dataService.getState(code)
    if(result !== undefined){
        res
            .status(200)
            .send(result)
        next()
    } else {
        res
            .status(404)
            .send()
        next()
    }
}

const getType = (req, res, next) => {
    const plate = req.params.plate
    const result = dataService.getType(plate)

    if(result !== undefined){
        res
            .status(200)
            .send(result)
        next()
    } else {
        res
            .status(404)
            .send()
        next()
    }
}

module.exports = {
  getState,
  getType
}