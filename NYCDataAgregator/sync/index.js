const { sync } = require('./sync');
const Repository = require('./repository');

(async () => {
    try {
        await Repository.initRepository();   
        console.log('Starting Dequeue item process....')     
        await sync();
    } catch (err) {
        console.log(err)
    }
})();