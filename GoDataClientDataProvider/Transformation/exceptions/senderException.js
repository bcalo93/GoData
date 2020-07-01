module.exports = class SenderException extends Error {
    constructor(message) {
        super(message);
        this.name = 'SenderException';
    }
}