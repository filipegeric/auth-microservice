import 'reflect-metadata';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import { configure, getLogger } from 'log4js';
import { createConnection } from 'typeorm';

import { config } from './config';
import { authMiddleware } from './middlewares/auth.middleware';
import { makeRateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { makeExpressCallback } from './util/express.util';
import { generalValidator } from './validators';
import {
  getChangePasswordValidators,
  getForgotPasswordSubmitValidators,
  getForgotPasswordValidators,
  getLoginValidators,
  getRegisterValidators
} from './validators/auth.validator';

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

    app.use(authMiddleware);

    const { authController, userController } = await import('./controllers');
    const { cacheService } = await import('./services');

    const rateLimitMiddleware = makeRateLimitMiddleware(
      cacheService,
      config.RATE_LIMIT_COUNT,
      config.RATE_LIMIT_WINDOW_IN_SECONDS
    );

    app.get('/users/me', makeExpressCallback(userController, 'getMe'));

    app.post(
      '/auth/register',
      getRegisterValidators(),
      generalValidator,
      makeExpressCallback(authController, 'register')
    );

    app.post(
      '/auth/login',
      rateLimitMiddleware,
      getLoginValidators(),
      generalValidator,
      makeExpressCallback(authController, 'login')
    );

    app.post('/auth/refresh', makeExpressCallback(authController, 'refresh'));

    app.post('/auth/logout', makeExpressCallback(authController, 'logout'));

    app.post(
      '/auth/change-password',
      getChangePasswordValidators(),
      generalValidator,
      makeExpressCallback(authController, 'changePassword')
    );

    app.post(
      '/auth/forgot-password',
      getForgotPasswordValidators(),
      generalValidator,
      makeExpressCallback(authController, 'forgotPassword')
    );

    app.post(
      '/auth/forgot-password-submit',
      getForgotPasswordSubmitValidators(),
      generalValidator,
      makeExpressCallback(authController, 'forgotPasswordSubmit')
    );

    app.listen(config.PORT, () => {
      logger.info(`Server working on port ${config.PORT}...`);
    });
  })
  .catch(err => {
    logger.error(err);
    process.exit(-1);
  });
