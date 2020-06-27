
(async() => {
    const DataService = require('./data-service')
    DataService.initialize().on('redis_error', (error) => {
        console.error(`Error de redis. ${error.message}`)
    })

    try {
        await console.log(await DataService.getType("AGR"))
        await console.log(await DataService.getState("YT"))
    } catch(err) {
        console.error('Error')
    }

    setTimeout(async () => {await console.log(await DataService.getState("YT"))},10000)
})
()