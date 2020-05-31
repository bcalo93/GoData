const Queue = require('bull');
const fs = require('fs');
const es = require('event-stream');
const path = require("path");

this.queue = new Queue('data-csv');

let lineCount = 1;
let csvPath = path.join(__dirname, "./data-parking-issues.csv");

(async (csvPath) => {
return  await fs.createReadStream(csvPath)
        .pipe(es.split())
        .pipe(es.mapSync((line) => {
            const issue = { issue: line.toString() }
            console.log(`Line Count: ${lineCount}`, issue)
            this.queue.add(issue);
            lineCount++;
        }).on('error', (err) => {
            console.log('Error while reading file.', err);
        }).on('end', () => {
            console.log('Read entire file.')
        }));
})(csvPath);