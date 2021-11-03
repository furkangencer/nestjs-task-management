import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class HttpRequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { protocol, originalUrl, method, headers, params, body, query } = req;
    if (this.configService.get('env') !== 'test') {
      const url = `${protocol}://${req.get('host')}${originalUrl}`;
      this.logger.verbose(
        {
          headers,
          params,
          body,
          query,
        },
        {
          method,
          url,
          type: '[Request]',
        },
      );
    }
    next();
  }
}
