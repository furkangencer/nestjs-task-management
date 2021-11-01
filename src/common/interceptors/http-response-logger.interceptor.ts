import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpResponseLoggerInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { protocol, originalUrl, method } = req;
    const logger = new Logger();

    const url = `${protocol}://${req.get('host')}${originalUrl}]`;
    const canShowLog = this.configService.get('env') !== 'test';

    return next.handle().pipe(
      tap({
        next: (val) => {
          if (canShowLog) {
            logger.verbose('[Response]', { ...val, statusCode, method, url });
          }
        },
        error: (error) => {
          if (canShowLog) {
            const { response, status } = error;
            logger.error('[Response]', {
              ...response,
              statusCode: status,
              method,
              url,
            });
          }
        },
      }),
    );
  }
}
