const config = require('config');
const axios = require('axios').default;
const MessageType = require('./../utils/messageFormatEnum');
const SenderException = require('./../exceptions/senderException');

const fs = require('fs')
const jwt = require('jsonwebtoken')
const secretKey = fs.readFileSync('./config/security/private.key', 'utf8')
const signOptions = config.get('jwt')

const CONTENT_JSON = 'application/json';
const CONTENT_XML = 'text/xml';

module.exports = class RestSenderService {
    async send(content, context) {
        const contentType = this.getContentType(content);
        const token = this.getToken()

        try {
            await axios({
                url: context.endpoint,
                method: context.method,
                data: content.message,
                headers: { 
                    'Content-Type': contentType,
                    'Authorization': `Bearer ${token}`
                }
            });
        
        } catch (error) {
            throw new SenderException(
                `Request failed - Status Code: ${error}.`
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

    getToken(){
        let payload = { data: Date.now() }
        return jwt.sign(payload, secretKey, signOptions)
    }
}