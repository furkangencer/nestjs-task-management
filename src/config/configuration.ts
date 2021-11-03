import { Environment } from './environment.enum';
import { format, transports } from 'winston';

export const config = () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    sync: process.env.NODE_ENV === Environment.DEVELOPMENT,
    ssl: process.env.NODE_ENV === Environment.PRODUCTION,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: +process.env.JWT_EXPIRES_IN,
  },
  logger: {
    level: process.env.LOG_LEVEL,
    defaultMeta: {
      service: 'task-management-service', // TODO: import from package.json
      env: process.env.NODE_ENV,
    },
    transports: [
      // new transports.Console({
      //   format: format.combine(
      //     format.timestamp(),
      //     format.ms(),
      //     format.timestamp({
      //       format: 'YYYY-MM-DD HH:mm:ss',
      //     }),
      //     nestWinstonModuleUtilities.format.nestLike('Nest', {
      //       prettyPrint: true,
      //     }),
      //   ),
      // }),
      new transports.Console({
        format: format.combine(
          format.ms(),
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.json({
            space: 2,
          }),
        ),
      }),
    ],
  },
});
