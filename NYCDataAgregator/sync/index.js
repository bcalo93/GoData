const { sync } = require('./sync');
const Repository = require('./repository');
const { goDataSync } = require('./goDataSync');

(async () => {
    try {
        await Repository.initRepository();   
        // console.log('Starting Dequeue item process....')     
        //await sync();
        await goDataSync();
    } catch (err) {
        console.log(err)
    }
})();