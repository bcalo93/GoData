const config = require('config')
const fs = require('fs');
const _ = require('lodash');

const fsPromises = fs.promises

const filePath = config.get('file_repository.path')

const saveConsumer = (consumer) => {
    return new Promise(async function(resolve, reject) {
        try{
            let actualData = await getConsumers()
            if(nameNotExists(consumer.name, actualData)){
                actualData.push(consumer)
                let processed = JSON.stringify(actualData)
                await fsPromises.writeFile(filePath, processed)
            }
            resolve();
        }
        catch(err){
            reject(err)
        }
    })
    
}

const nameNotExists = (name, collection) => {
    return !_.some(collection, {"name":name})
}

const getConsumers = () => {
    return new Promise(async function(resolve, reject) {
        try{
            let result = []
            if(await fileExists()){
                let rawData = await fsPromises.readFile(filePath);
                if(rawData.length > 0){
                    result = JSON.parse(rawData);
                }
            }
            resolve(result);
        }
        catch(err){
            reject(err)
        }
    })
}

const fileExists = async () => {
    try{
        await fsPromises.access(filePath, fs.constants.fsF_OK)
        return true
    }
    catch(err){
        return false
    }
}

module.exports = {
    saveConsumer,
    getConsumers
}