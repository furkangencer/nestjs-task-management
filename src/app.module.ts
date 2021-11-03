import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema, config, validationPipeConfig } from './config';
import { HttpExceptionFilter } from './common/filters';
import { HttpRequestLoggerMiddleware } from './common/middlewares';
import { TasksController } from './tasks/tasks.controller';
import {
  HttpResponseLoggerInterceptor,
  TransformInterceptor,
} from './common/interceptors';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
      load: [config],
      cache: true,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        ssl: configService.get('database.ssl'),
        extra: {
          ssl: configService.get('database.ssl')
            ? { rejectUnauthorized: false }
            : false,
        },
        synchronize: configService.get('database.sync'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
      }),
    }),
    AuthModule,
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) =>
        configService.get('logger'),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseLoggerInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe(validationPipeConfig),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRequestLoggerMiddleware).forRoutes(TasksController);
  }
}
