import * as Joi from 'joi';
import { Environment, LogLevel } from '../common/enums';

export const configValidationSchema = Joi.object().keys({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.DEVELOPMENT),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().required(),
  LOG_LEVEL: Joi.string()
    .valid(...Object.values(LogLevel))
    .default(LogLevel.INFO),
});
