import { TokenExpiredError, verify } from 'jsonwebtoken';

import { HttpError } from '../error/http.error';

export function verifyTokenAsync<T = any>(
  token: string,
  key: string | Buffer
): Promise<T> {
  return new Promise((resolve, reject) => {
    verify(token, key, (err, payload) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return reject(new HttpError(401, 'Token expired'));
        }
        return reject(new HttpError(401, 'Token invalid'));
      }
      return resolve(payload as any);
    });
  });
}
