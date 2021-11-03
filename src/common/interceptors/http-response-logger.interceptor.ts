import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class HttpResponseLoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { protocol, originalUrl, method } = req;

    const url = `${protocol}://${req.get('host')}${originalUrl}`;
    const canShowLog = this.configService.get('env') !== 'test';

    return next.handle().pipe(
      tap({
        next: (val) => {
          if (canShowLog) {
            this.logger.verbose(val, {
              statusCode,
              method,
              url,
              type: '[Response]',
            });
          }
        },
        error: (error) => {
          if (canShowLog) {
            const { response, status } = error;
            this.logger.error(response, {
              statusCode: status,
              method,
              url,
              type: '[Response]',
            });
          }
        },
      }),
    );
  }
}
