import { config as dotenvConfig } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenvConfig();

const accessTokenPrivateKey = readFileSync(
  join(__dirname, '../certs/access-token-private-key.pem')
).toString();
const accessTokenPublicKey = readFileSync(
  join(__dirname, '../certs/access-token-public-key.pem')
).toString();

const refreshTokenPrivateKey = readFileSync(
  join(__dirname, '../certs/refresh-token-private-key.pem')
).toString();

const refreshTokenPublicKey = readFileSync(
  join(__dirname, '../certs/refresh-token-public-key.pem')
).toString();

export const config = {
  PORT: +process.env.PORT! || 3000,
  JWT: {
    ACCESS_TOKEN_SECRET: accessTokenPrivateKey,
    ACCESS_TOKEN_PUBLIC: accessTokenPublicKey,
    REFRESH_TOKEN_SECRET: refreshTokenPrivateKey,
    REFRESH_TOKEN_PUBLIC: refreshTokenPublicKey,
    ACCESS_TOKEN_EXPIRE: process.env.JWT_ACCESS_TOKEN_EXPIRE!,
    REFRESH_TOKEN_EXPIRE: process.env.JWT_REFRESH_TOKEN_EXPIRE!,
    REFRESH_TOKEN_COOKIE_KEY: process.env.JWT_REFRESH_TOKEN_COOKIE_KEY!
  },
  REDIS: {
    HOST: process.env.REDIS_HOST!,
    PORT: +process.env.REDIS_PORT!,
    PASSWORD: process.env.REDIS_PASSWORD!
  },
  SMTP: {
    HOST: process.env.SMTP_HOST!,
    PORT: +process.env.SMTP_PORT!,
    USER: process.env.SMTP_USER!,
    PASSWORD: process.env.SMTP_PASSWORD!
  },
  RATE_LIMIT: {
    COUNT: +process.env.RATE_LIMIT_COUNT!,
    WINDOW_IN_SECONDS: +process.env.RATE_LIMIT_WINDOW_IN_SECONDS!
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID!
  },
  PASSWORD_RESET_CODE_EXPIRE_IN_SECONDS: +process.env
    .PASSWORD_RESET_CODE_EXPIRE_IN_SECONDS!,
  CORS_ORIGIN: process.env.CORS_ORIGIN!
};
