import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { logger } from '../../logger/logger.service';

@Catch(HttpException, Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof BadRequestException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : '서버 내부 오류로 처리할 수 없습니다.';

    logger.error(`error: ${exception.message}, stack: ${exception.stack}`, 'GlobalExceptionFilter');

    response.status(status).json({
      status: false,
      statusCode: status,
      message: message,
    });
  }
}
