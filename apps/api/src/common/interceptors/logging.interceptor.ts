import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip;

    const now = Date.now();
    
    // Log request
    this.logger.log(
      `📨 ${method} ${url} - ${ip} - ${userAgent}`,
    );

    if (process.env.NODE_ENV === 'development' && Object.keys(body).length) {
      this.logger.debug(`Request body: ${JSON.stringify(body, null, 2)}`);
    }

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - now;
        this.logger.log(
          `📩 ${method} ${url} - ${duration}ms`,
        );

        if (process.env.NODE_ENV === 'development' && response) {
          this.logger.debug(`Response: ${JSON.stringify(response, null, 2)}`);
        }
      }),
    );
  }
}