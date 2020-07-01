const config = require('config')

const bind = () => {
    let type = config.get('messaging') || 'bull-redis'
    
    try{
        return require(`./${type}/publisher`)
    } catch(err) {
        return require(`./${type}/publisher`)
    }
}

module.exports = bind()