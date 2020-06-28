const fs = require('fs');

const winston = require('winston');
const { format, transports } = winston;
const { combine, label, json, timestamp, printf, prettyPrint, colorize } = format;

const consoleFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const LOGS_DIR = './logs';
if (!fs.existsSync(LOGS_DIR)){
    fs.mkdirSync(LOGS_DIR);
}
module.exports = {
    level: 'debug',
    format: combine(
      label({ label: 'DEFAULT' }),
      json(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.Console({
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
