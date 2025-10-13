import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      if (typeof errorResponse === 'object' && errorResponse !== null) {
        const errorObj = errorResponse as any;
        message = errorObj.message || exception.message;
        error = errorObj.error || exception.name;
      } else {
        message = errorResponse as string;
        error = exception.name;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma errors
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';

      switch (exception.code) {
        case 'P2002':
          message = `Unique constraint failed: ${exception.meta?.target}`;
          status = HttpStatus.CONFLICT;
          break;
        case 'P2014':
          message = `Invalid ID: ${exception.meta?.target}`;
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'P2003':
          message = `Foreign key constraint failed: ${exception.meta?.field_name}`;
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'P2025':
          message = 'Record not found';
          status = HttpStatus.NOT_FOUND;
          break;
        default:
          message = 'Database operation failed';
          this.logger.error(`Unhandled Prisma error: ${exception.code}`, exception.message);
      }
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Database Error';
      message = 'Unknown database error occurred';
      this.logger.error('Prisma unknown error:', exception.message);
    } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Database Error';
      message = 'Database engine error';
      this.logger.error('Prisma engine panic:', exception.message);
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal Server Error';
      message = process.env.NODE_ENV === 'production' ? 'Internal server error' : exception.message;
      this.logger.error('Unhandled error:', exception.stack);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal Server Error';
      message = 'Something went wrong';
      this.logger.error('Unknown exception:', exception);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    // Log error details
    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse, null, 2),
    );

    response.status(status).json(errorResponse);
  }
}