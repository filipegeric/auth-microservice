import 'reflect-metadata';

import { config as dotenvConfig } from 'dotenv';
import express from 'express';
import { configure, getLogger } from 'log4js';
import { createConnection } from 'typeorm';

import { config } from './config';
import { UserController } from './controllers/user.controller';
import { makeExpressCallback } from './util/express.util';

interface Controllers {
  userController: UserController;
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

    const { userController }: Controllers = require('./controllers');

    app.get('/users/:username', makeExpressCallback(userController, 'getUser'));

    app.listen(config.PORT, () => {
      logger.info(`Server working on port ${config.PORT}...`);
    });
  })
  .catch(err => {
    logger.error(err);
    process.exit(-1);
  });
