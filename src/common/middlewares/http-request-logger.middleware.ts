import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpRequestLoggerMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { protocol, originalUrl, method, headers, params, body, query } = req;
    const logger = new Logger();
    if (this.configService.get('env') !== 'test') {
      logger.verbose(
        `[Request] ${protocol}://${req.get('host')}${originalUrl} [${method}]
        ${JSON.stringify({ headers, params, body, query }, null, '\t')}`,
      );
    }
    next();
  }
}
