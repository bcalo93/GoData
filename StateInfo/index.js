
(async() => {
    const service = require('./data-service')

    try {
        await console.log(await service.getType("AGR"))
        await console.log(await service.getState("YT"))
    } catch(err) {
        console.error(err)
    }
})
()