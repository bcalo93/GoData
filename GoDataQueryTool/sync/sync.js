const Queue = require('bull');
const queueName = 'go-data-issues';
const queue = new Queue(queueName);

module.exports.start = async function () {



    console.log(`Starting Dequeue item process from ${queueName}....`)     

    queue.process((job, done) => {
        try {        
            console.log(job.data);
            const issues = job.data;
            issues.forEach(issue => {
                 //call to service
            });
            
           
            done();
        } catch(err) {
            console.log(err);
            done(new Error(err));
        }
    });
}