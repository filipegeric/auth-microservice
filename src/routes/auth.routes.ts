import { Application } from 'express';

import { config } from '../config';
import { AuthController } from '../controllers/auth.controller';
import { makeRateLimitMiddleware } from '../middlewares/rate-limit.middleware';
import { CacheService } from '../services/cache.service';
import { makeExpressCallback } from '../util/express.util';
import { generalValidator } from '../validators';
import {
  getChangePasswordValidators,
  getForgotPasswordSubmitValidators,
  getForgotPasswordValidators,
  getLoginValidators,
  getRegisterValidators
} from '../validators/auth.validator';

export function setupAuthRoutes(
  app: Application,
  authController: AuthController,
  cache: CacheService
) {
  app.post(
    '/auth/register',
    getRegisterValidators(),
    generalValidator,
    makeExpressCallback(authController, 'register')
  );

  app.post(
    '/auth/login',
    makeRateLimitMiddleware(
      cache,
      config.RATE_LIMIT.COUNT,
      config.RATE_LIMIT.WINDOW_IN_SECONDS
    ),
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
}
