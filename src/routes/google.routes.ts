import { Application } from 'express';

import { GoogleController } from '../controllers/google.controller';
import { makeExpressCallback } from '../util/express.util';
import { generalValidator } from '../validators';
import { getGoogleLoginValidators } from '../validators/google.validators';

export function setupGoogleRoutes(
  app: Application,
  googleController: GoogleController
) {
  app.post(
    '/google/login',
    getGoogleLoginValidators(),
    generalValidator,
    makeExpressCallback(googleController, 'login')
  );
}
