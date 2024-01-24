import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import { SharedService } from '../shared/shared.service';
import * as chalk from 'chalk';

const date = SharedService.getDate();

const logFormat = winston.format.printf(({ level, message }) => {
  let emoji = '';
  let colorMessage = message;

  switch (level) {
    case 'info':
      emoji = '📝';
      colorMessage = chalk.blue(message);
      break;
    case 'warn':
      emoji = '⚠️';
      colorMessage = chalk.yellow(message);
      break;
    case 'error':
      emoji = '❌';
      colorMessage = chalk.red(message);
      break;

    default:
      break;
  }

  return `${emoji} [${date}] [${level.toUpperCase()}]: ${colorMessage}`;
});

export class LoggerService extends Logger {
  private static winstonLogger: winston.Logger;
  private static instance: LoggerService;

  constructor() {
    super();

    // const logDir = 'logs';

    if (!LoggerService.winstonLogger) {
      LoggerService.winstonLogger = winston.createLogger({
        format: winston.format.combine(winston.format.timestamp(), logFormat),
        transports: [
          new winston.transports.Console(),
          // TODO :: logger 저장 로직
          // new winston.transports.File({
          //   dirname: logDir,
          //   filename: `${date}.log`,
          //   level: 'info',
          //   maxFiles: 30,
          // }),
        ],
      });
    }
  }

  static getInstance() {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  log(message: string, logData?: object | string) {
    super.log(message, logData ? logData : null);
    LoggerService.winstonLogger.info(message, logData ? logData : null);
  }

  error(message: string) {
    super.error(message);
    LoggerService.winstonLogger.error(message);
  }

  warn(message: string) {
    super.warn(message);
    LoggerService.winstonLogger.warn(message);
  }
}

export const logger = LoggerService.getInstance();
