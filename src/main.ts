import 'reflect-metadata';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import { configure, getLogger } from 'log4js';
import { createConnection } from 'typeorm';

import { config } from './config';
import { authMiddleware } from './middlewares/auth.middleware';
import { setupAuthRoutes } from './routes/auth.routes';
import { setupGoogleRoutes } from './routes/google.routes';
import { setupUserRoutes } from './routes/user.routes';

dotenvConfig();

configure({
  appenders: {
    out: { type: 'stdout' }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: process.env.NODE_ENV === 'test' ? 'off' : 'all'
    }
  }
});

const logger = getLogger('main.ts');

createConnection()
  .then(async () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

    app.use(authMiddleware);

    const { authController, userController, googleController } = await import(
      './controllers'
    );
    const { cacheService } = await import('./services');

    setupUserRoutes(app, userController);

    setupAuthRoutes(app, authController, cacheService);

    setupGoogleRoutes(app, googleController);

    app.listen(config.PORT, () => {
      logger.info(`Server working on port ${config.PORT}...`);
    });
  })
  .catch(err => {
    logger.error(err);
    process.exit(-1);
  });
