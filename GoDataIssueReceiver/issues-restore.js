const log = require('../Logger');
const location = { location: 'issues-restore' };


(async function(){
    try{
        const msgs = require('./services/contingency/messages-buffer')
        await msgs.restoreMessages()
        process.exit()
    } catch(err) {
        log.error(`Error restoring messages. ${err}`,location)
        process.exit()
    }  
})()