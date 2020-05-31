const Queue = require('bull');
const queue = new Queue('data-csv');
queue.empty().then(function () {    
    resolve(queue);
}).catch(()=>{});