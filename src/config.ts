import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  PORT: +process.env.PORT! || 3000,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_ACCESS_TOKEN_EXPIRE: process.env.JWT_ACCESS_TOKEN_EXPIRE!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_EXPIRE: process.env.JWT_REFRESH_TOKEN_EXPIRE!,
  JWT_REFRESH_TOKEN_COOKIE_KEY: process.env.JWT_REFRESH_TOKEN_COOKIE_KEY!,
  PASSWORD_RESET_CODE_EXPIRE_IN_SECONDS: +process.env
    .PASSWORD_RESET_CODE_EXPIRE_IN_SECONDS!,
  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: +process.env.REDIS_PORT!,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: +process.env.SMTP_PORT!,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD!
};
