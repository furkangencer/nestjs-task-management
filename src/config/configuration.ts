import { Environment } from './environment.enum';

export const config = () => ({
  env: process.env.NODE_ENV || Environment.DEVELOPMENT,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    sync: process.env.NODE_ENV === Environment.DEVELOPMENT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: +process.env.JWT_EXPIRES_IN,
  },
});
