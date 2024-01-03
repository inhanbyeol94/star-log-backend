import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import { SharedService } from '../shared/shared.service';
import * as chalk from 'chalk';

const logFormat = winston.format.printf(({ level, message }) => {
  const date = SharedService.getDate();

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

    if (!LoggerService.winstonLogger) {
      LoggerService.winstonLogger = winston.createLogger({
        format: winston.format.combine(winston.format.timestamp(), logFormat),
        transports: [new winston.transports.Console()],
      });
    }
  }

  static getInstance() {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  log(message: string) {
    super.log(message);
    LoggerService.winstonLogger.info(message);
  }

  error(message: string, trace: string) {
    super.error(message, trace);
    LoggerService.winstonLogger.error(message, { trace });
  }

  warn(message: string) {
    super.warn(message);
    LoggerService.winstonLogger.warn(message);
  }
}

export const logger = LoggerService.getInstance();
