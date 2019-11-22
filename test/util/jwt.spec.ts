import { assert } from 'chai';
import { sign } from 'jsonwebtoken';

import { config } from '../../src/config';
import { HttpError } from '../../src/error/http.error';
import { verifyTokenAsync } from '../../src/util/jwt.util';

describe('JWT Util', () => {
  describe('verifyTokenAsync', () => {
    it('returns a promise that resolves if there is no error', () => {
      const token = sign({ foo: 'bar' }, config.JWT.ACCESS_TOKEN_SECRET, {
        expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE,
        algorithm: 'RS256'
      });
      verifyTokenAsync<{ foo: string }>(token, config.JWT.ACCESS_TOKEN_PUBLIC)
        .then(r => assert(r.foo === 'bar'))
        .catch(e => assert(false, e));
    });
    it('returns a promise that rejects with HttpError if there is error', () => {
      const token = sign({ foo: 'bar' }, config.JWT.ACCESS_TOKEN_SECRET, {
        expiresIn: config.JWT.ACCESS_TOKEN_EXPIRE,
        algorithm: 'RS256'
      });
      verifyTokenAsync<{ foo: string }>(token, 'random invalid public key')
        .then(() => assert(false, "It didn't reject"))
        .catch(e => assert(e instanceof HttpError));
    });
  });
});
