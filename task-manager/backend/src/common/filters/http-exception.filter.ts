import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const raw = isHttpException ? exception.getResponse() : null;
    const message =
      typeof raw === 'string'
        ? raw
        : (raw as any)?.message ?? (exception as any)?.message ?? 'Internal server error';

    response.status(status).json({
      success: false,
      message,
      data: {
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

