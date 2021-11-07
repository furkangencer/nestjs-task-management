import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';
import { TasksController } from './tasks/tasks.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { configValidationSchema, config, validationPipeConfig } from './config';
import { HttpExceptionFilter } from './common/filters';
import { HttpRequestLoggerMiddleware } from './common/middlewares';
import {
  HttpResponseLoggerInterceptor,
  TransformInterceptor,
} from './common/interceptors';
import { LoggerModule } from 'nestjs-pino';

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
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const loggerConfig = await configService.get('logger');
        return {
          pinoHttp: loggerConfig,
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
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
