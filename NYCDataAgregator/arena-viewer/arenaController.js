const Arena = require('bull-arena');

const arena = Arena({
    queues: [
        {
            name: 'data-csv',
            hostId: 'local'
        },
        {
            name: 'go-data-issues',
            hostId: 'local'
        }
    ]
});

module.exports = {
    arena
}