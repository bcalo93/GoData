const config = require('config')
const AsyncLock = require('async-lock');
const lock = new AsyncLock({maxPending: 1000, timeout: 5000});
const fs = require('fs')
const lockKey = 'lock'
const readline = require('readline')
const stream = require('stream')
const issuesService = require('../issues-service')
const pendingFile = './services/contingency/pending'

module.exports = class Buffer {
    
    static async addMessage(message) {
        try {
            await lock.acquire(lockKey, function() {
                return fs.promises.appendFile(pendingFile, JSON.stringify(message)+'\n')
            }).then(function() {
            });
        } catch(err) {
            console.error(err)
        }   
    }

    static async restoreMessages() {
        const instream = fs.createReadStream(pendingFile)
        const outstream = new stream()
        const rl = readline.createInterface(instream, outstream)
        const chunkSize = config.get('recovery_chunk_size')

        await lock.acquire(lockKey, function() {
            return new Promise((resolve, reject) => {
                let issues = []

                instream.on('error', function(err){
                    reject(err)
                })

                rl.on('line', async function(issue) {
                    try {
                        issues.push(issue)
                        if(issues.length >= chunkSize){
                            let chunk = issues.splice(0, chunkSize)
                            await issuesService.processIssues(chunk)
                        }
                    } catch(err) {
                        reject(err)
                    }
                })

                rl.on('close', async function() {
                    try {
                        if(issues.length > 0) await issuesService.processIssues(issues)
                        console.log(`Finished restoring issues`)
                        await fs.promises.truncate(pendingFile)
                        resolve()
                    } catch(err) {
                        reject(err)
                    }
                })

                rl.on('error', function(err) {
                    reject(err)
                })
            })
        }).then(function() {
        });
    }
}