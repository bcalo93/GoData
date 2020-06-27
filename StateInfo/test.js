
(async() => {
    const DataService = require('./data-service')
    DataService.initialize().on('redis_error', (error) => {
        console.error(`Error de redis. ${error.message}`)
    })

    try {
        await console.log(await DataService.getType("AGR"))
        await console.log(await DataService.getType("DLR"))
        await console.log(await DataService.getType("FAR"))

        await console.log(await DataService.getState("YT"))
        await console.log(await DataService.getState("NY"))
        await console.log(await DataService.getState("NJ"))
        await DataService.initDataUpdater()

        setTimeout(() => DataService.stopDataUpdater(),1000*60*4)
    } catch(err) {
        console.error('Error')
    }
})
()