import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from './config';

async function bootstrap() {
  const loggerConfig = LoggerConfig('verbose'); // TODO: get from env
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors();

  await app.listen(port);
}
bootstrap();
