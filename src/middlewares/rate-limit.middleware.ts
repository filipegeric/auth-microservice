import { NextFunction, Request, Response } from 'express';

import { CacheService } from '../services/cache.service';

export function makeRateLimitMiddleware(
  cache: CacheService,
  limit: number,
  windowInSeconds: number
) {
  return async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const ip = req.ip;
    const value = await cache.incrementRequestCount(ip, windowInSeconds);
    if (value > limit) {
      return res.status(429).send({ message: 'Too many requests' });
    }
    return next();
  };
}
