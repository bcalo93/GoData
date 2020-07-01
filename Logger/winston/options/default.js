const fs = require('fs');
const winston = require('winston');
const { format, transports } = winston;
const { combine, label, json, timestamp, printf, prettyPrint, colorize } = format;

const Config = require('config');
const APP_NAME = Config.has('winston.meta.appName') ? Config.get('winston.meta.appName') : '';

const consoleFormat = printf(({ level, message, label, timestamp, meta }) => {
  const location = (!!meta && !!meta.location) ? `[${meta.location}] ` : '';
  return `${timestamp} [${label}] [${level.toUpperCase()}]: ${location}${message}`;
});

const LOGS_DIR = './logs';
if (!fs.existsSync(LOGS_DIR)){
    fs.mkdirSync(LOGS_DIR);
}

module.exports = {
    level: 'debug',
    format: combine(
      label({ label: APP_NAME ? APP_NAME : '' }),
      json(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.Console({
        level: 'debug',
        format: combine(
          colorize({ all: true }),
        )
      }),
      new transports.File({ 
        level: 'error',
        filename: `${LOGS_DIR}/error.log`, 
        name: 'error-file',
        format: combine(
          prettyPrint()
        ),    
      })
    ],
    exceptionHandlers: [
      new transports.File({ filename: 'logs/exceptions.log' })
    ],      
    handleExceptions: true,
    exitOnError: false
}
