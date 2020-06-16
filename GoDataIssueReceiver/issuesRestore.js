
(async function(){
    try{
        const msgs = require('./services/contingency/messages-buffer')
        await msgs.restoreMessages()
        process.exit()
    } catch(err) {
        console.error(`Error restoring messages. ${err}`)
        process.exit()
    }  
})()