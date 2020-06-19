const axios = require('axios').default;
const MessageType = require('./../utils/messageFormatEnum');
const SenderException = require('./../exceptions/senderException');

const CONTENT_JSON = 'application/json';
const CONTENT_XML = 'text/xml';

module.exports = class RestSenderService {
    async send(content, context) {
        const contentType = this.getContentType(content);
        try {
            await axios({
                url: context.endpoint,
                method: context.method,
                data: content.message,
                headers: { 'Content-Type': contentType }
            });
        
        } catch (error) {
            throw new SenderException(
                `Request failed - Status Code: ${error.response.status} - Message: ${error.response.data}.`
            );
        }
    }

    getContentType(content) {
        if (content.format === MessageType.JSON_MESSAGE) {
            return CONTENT_JSON;
        
        } else if (content.format === MessageType.XML_MESSAGE) {
            return CONTENT_XML;
        
        } else {
            throw new SenderException(`This format is not supported: ${content.format}`);
        }
    }
}