import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Environment } from '../enums';

@Injectable()
export class HttpRequestLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl, method, headers, params, body, query } = req;
    if (this.configService.get('env') !== Environment.TEST) {
      this.logger.info({
        headers,
        params,
        body,
        query,
        method,
        url: originalUrl,
        type: '[REQUEST]',
      });
    }
    next();
  }
}
