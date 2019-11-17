import { Redis } from 'ioredis';

import { CacheService } from '../../src/services/cache.service';

describe('CacheService', () => {
  let service: CacheService;
  const redisClientMock: Redis = {} as Redis;

  before(() => {
    service = new CacheService(redisClientMock);
    // ! preventing compiler from crashing from unused variable service
    // tslint:disable-next-line: no-unused-expression
    service;
  });

  describe('storePasswordResetCode', () => {
    it('stores code in cache with a key in format "password-reset:${email}"', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('getPasswordResetCode', () => {
    it('reads password reset code from cache', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('deletePaswordResetCode', () => {
    it('deletes password reset code from cache', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('incrementRequestCount', () => {
    it('increments request count of ip with key in format "rate-limit:${ip}"', () => {
      throw new Error('Not implemented yet');
    });
    it('expires key by provided number of seconds if value of increment is one', () => {
      throw new Error('Not implemented yet');
    });
    it('returns incremented value', () => {
      throw new Error('Not implemented yet');
    });
  });
});
