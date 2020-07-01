const fs = require('fs');
const winston = require('winston');
const { format, transports } = winston;
const { combine, label, json, timestamp, printf, prettyPrint, colorize } = format;

const Config = require('config');
const APP_NAME = Config.has('winston.meta.app_name') ? Config.get('winston.meta.app_name') : '';
const LOG_LEVEL = Config.has('winston.meta.log_level') ? Config.get('winston.meta.log_level') : 'debug';

const consoleFormat = printf(({ level, message, label, timestamp, meta }) => {
  const location = (!!meta && !!meta.location) ? `[${meta.location}] ` : '';
  return `${timestamp} [${label}] [${level.toUpperCase()}]: ${location}${message}`;
});

const LOGS_DIR = './logs';
if (!fs.existsSync(LOGS_DIR)){
    fs.mkdirSync(LOGS_DIR);
}

module.exports = {
    level: LOG_LEVEL,
    format: combine(
      label({ label: APP_NAME ? APP_NAME : '' }),
      json(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    ),
    transports: [
      new transports.Console({
        level: LOG_LEVEL,
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
      }),
      new transports.File({ 
        level: 'info',
        filename: `${LOGS_DIR}/info.log`, 
        name: 'info-file',
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
