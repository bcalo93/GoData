
(async() => {
    const dataService = require('.')

    //Redis up
    setTimeout(async () => {
        try {
            await console.log(await dataService.getType("DLR"))
            await console.log(await dataService.getType("FAR"))
            await console.log(await dataService.getState("YT"))
            await console.log(await dataService.getState("NJ"))
        } catch(err) {
            console.error(err)
        }
    }, 1000)

    //Redis down
    setTimeout(async () => {
        try {
            await console.log(await dataService.getType("DLR"))
            await console.log(await dataService.getType("FAR"))
            await console.log(await dataService.getState("YT"))
            await console.log(await dataService.getState("NJ"))
        } catch(err) {
            console.error(err)
        }
    }, 10000)

    //Redis up
    setTimeout(async () => {
        try {
            await console.log(await dataService.getType("DLR"))
            await console.log(await dataService.getType("FAR"))
            await console.log(await dataService.getState("YT"))
            await console.log(await dataService.getState("NJ"))
        } catch(err) {
            console.error(err)
        }
    }, 20000)
})
()