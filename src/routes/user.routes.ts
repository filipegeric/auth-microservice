import { Application } from 'express';

import { UserController } from '../controllers/user.controller';
import { makeExpressCallback } from '../util/express.util';

export function setupUserRoutes(
  app: Application,
  userController: UserController
) {
  app.get('/users/me', makeExpressCallback(userController, 'getMe'));
}
