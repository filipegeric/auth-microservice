import { NextFunction, Request, Response } from 'express';
import { getLogger } from 'log4js';

import { config } from '../config';
import { HttpError } from '../error/http.error';
import { verifyTokenAsync } from '../util/jwt.util';

const logger = getLogger('auth.middleware.ts');

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ignoredRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/forgot-password',
      '/auth/forgot-password-submit'
    ];
    if (ignoredRoutes.indexOf(req.url) > -1) {
      return next();
    }
    if (!req.headers.authorization) {
      throw new HttpError(401, 'Missing authorization header');
    }
    if (req.headers.authorization.split(' ').length < 2) {
      throw new HttpError(401, 'Token invalid');
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await verifyTokenAsync<{ username: string }>(
      token,
      config.JWT_ACCESS_TOKEN_SECRET
    );

    if (typeof decoded !== 'object') {
      return res.status(401).send({ message: 'Token payload invalid' });
    }
    if (!('username' in decoded)) {
      return res.status(401).send({ message: 'Token payload invalid' });
    }
    (req as any).username = decoded.username;
    return next();
  } catch (error) {
    logger.error(error);
    return res
      .status(error.status || 500)
      .send({ message: error.message || 'Internal server error' });
  }
}
