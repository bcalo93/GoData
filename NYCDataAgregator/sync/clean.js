const Queue = require('bull');
const queue = new Queue('data-csv');

queue.clean(0, 'delayed');
queue.clean(0, 'wait');
queue.clean(0, 'active');
queue.clean(0, 'completed');
queue.clean(0, 'failed');

let multi = queue.multi();
multi.del(queue.toKey('repeat'));
multi.exec();