import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { logger } from '../../../logger/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof BadRequestException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : '서버 내부 오류로 처리할 수 없습니다.';

    if (exception.message !== 'Cannot GET /favicon.ico') logger.error(`error: ${exception.message}, stack: ${exception.stack}`);

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
