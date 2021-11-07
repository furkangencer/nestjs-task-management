import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Environment } from '../enums';

@Injectable()
export class HttpResponseLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { originalUrl, method } = req;

    const canShowLog = this.configService.get('env') !== Environment.TEST;

    return next.handle().pipe(
      tap({
        next: (val) => {
          if (canShowLog) {
            this.logger.info({
              body: val,
              statusCode,
              method,
              url: originalUrl,
              type: '[RESPONSE]',
            });
          }
        },
        error: (error) => {
          if (canShowLog) {
            const { response, status } = error;
            this.logger.error({
              body: response,
              statusCode: status,
              method,
              url: originalUrl,
              type: '[ERROR]',
            });
          }
        },
      }),
    );
  }
}
