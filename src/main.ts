import 'reflect-metadata';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import { configure, getLogger } from 'log4js';
import { createConnection } from 'typeorm';

import { config } from './config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { makeExpressCallback } from './util/express.util';

interface Controllers {
  userController: UserController;
  authController: AuthController;
}

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
  .then(() => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use(authMiddleware);

    const {
      userController,
      authController
    }: Controllers = require('./controllers');

    app.get('/users/:username', makeExpressCallback(userController, 'getUser'));

    app.post('/auth/register', makeExpressCallback(authController, 'register'));

    app.post('/auth/login', makeExpressCallback(authController, 'login'));

    app.post('/auth/refresh', makeExpressCallback(authController, 'refresh'));

    app.post('/auth/logout', makeExpressCallback(authController, 'logout'));

    app.post(
      '/auth/change-password',
      makeExpressCallback(authController, 'changePassword')
    );

    app.listen(config.PORT, () => {
      logger.info(`Server working on port ${config.PORT}...`);
    });
  })
  .catch(err => {
    logger.error(err);
    process.exit(-1);
  });
