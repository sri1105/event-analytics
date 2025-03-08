// Required modules
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

/* 
  TODO: Currently logs will be stored in the server itself
  this will slow the server upon scaling. So consider using
  a SIEM tool like Elk-stack, Splunk in the future
*/

// Log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger with daily rotation
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.colorize() }),
    new DailyRotateFile({
      filename: path.join('./logs/', '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      level: 'info',
      zippedArchive: true
    }),
  ],
});

// Export
export default logger;