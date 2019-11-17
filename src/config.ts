import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  PORT: +process.env.PORT! || 3000,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_ACCESS_TOKEN_EXPIRE: process.env.JWT_ACCESS_TOKEN_EXPIRE!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_EXPIRE: process.env.JWT_REFRESH_TOKEN_EXPIRE!,
  JWT_REFRESH_TOKEN_COOKIE_KEY: process.env.JWT_REFRESH_TOKEN_COOKIE_KEY!
};
