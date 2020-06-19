const Arena = require('bull-arena');
const router = require('express').Router();

const queueList = process.argv.slice(2).map(element => {
    return { name: element, hostId: 'local' };
});

console.log(queueList);
const arena = new Arena({ queues: queueList });

router.use('/', arena);