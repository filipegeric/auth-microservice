import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  PORT: +process.env.PORT! || 3000,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: +process.env.DB_PORT! || 3306,
  DB_DATABASE: process.env.DB_DATABASE!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!
};
