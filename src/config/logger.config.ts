import { format, transports, LoggerOptions } from 'winston';
// import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const LoggerConfig = (level: string): LoggerOptions => ({
  level,
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
        format.json(),
      ),
    }),
  ],
});
