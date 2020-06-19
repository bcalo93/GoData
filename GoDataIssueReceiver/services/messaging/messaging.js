const config = require('config')

module.exports = function bind() {
    let type = config.get('messaging') || 'bull-redis'
    
    try{
        return require(`./${type}/publisher`)
    } catch(err) {
        return require(`./${type}/publisher`)
    }
}