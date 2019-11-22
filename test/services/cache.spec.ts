import { assert } from 'chai';
import { internet, random } from 'faker';
import { Redis } from 'ioredis';
import { stub } from 'sinon';

import { config } from '../../src/config';
import { CacheService } from '../../src/services/cache.service';

describe('CacheService', () => {
  let service: CacheService;
  const redisClientMock: Redis = {} as Redis;

  before(() => {
    service = new CacheService(redisClientMock);
  });

  describe('storePasswordResetCode', () => {
    it('stores code in cache with a key in format "password-reset:${email}"', async () => {
      redisClientMock.setex = () => Promise.resolve();
      const setexStub = stub(redisClientMock, 'setex');
      const email = internet.email();
      const code = random.number(999999);

      await service.storePasswordResetCode(email, code);

      assert(
        setexStub.calledOnceWith(
          `password-reset:${email}`,
          config.PASSWORD_RESET_CODE_EXPIRE_IN_SECONDS,
          code
        )
      );
    });
  });

  describe('getPasswordResetCode', () => {
    it('reads password reset code from cache', async () => {
      redisClientMock.get = () => Promise.resolve('');
      const getStub = stub(redisClientMock, 'get');
      const email = internet.email();

      await service.getPasswordResetCode(email);

      assert(getStub.calledOnceWith(`password-reset:${email}`));
    });
  });

  describe('deletePaswordResetCode', () => {
    it('deletes password reset code from cache', async () => {
      redisClientMock.del = () => Promise.resolve(1);
      const delStub = stub(redisClientMock, 'del');
      const email = internet.email();

      await service.deletePasswordResetCode(email);

      assert(delStub.calledOnceWith(`password-reset:${email}`));
    });
  });

  describe('incrementRequestCount', () => {
    it('increments request count of ip with key in format "rate-limit:${ip}"', async () => {
      redisClientMock.incr = () => Promise.resolve(2);
      const incrStub = stub(redisClientMock, 'incr');
      const ip = internet.ip();

      await service.incrementRequestCount(
        ip,
        config.RATE_LIMIT.WINDOW_IN_SECONDS
      );
      assert(incrStub.calledOnceWith(`rate-limit:${ip}`));
    });
    it('expires key by provided number of seconds if value of increment is one', async () => {
      redisClientMock.incr = () => Promise.resolve(1);
      redisClientMock.expire = () => Promise.resolve(1) as Promise<0 | 1>;
      const expireStub = stub(redisClientMock, 'expire');
      const ip = internet.ip();

      await service.incrementRequestCount(
        ip,
        config.RATE_LIMIT.WINDOW_IN_SECONDS
      );
      assert(
        expireStub.calledOnceWith(
          `rate-limit:${ip}`,
          config.RATE_LIMIT.WINDOW_IN_SECONDS
        )
      );
    });
    it('returns incremented value', async () => {
      const randomNumber = random.number();
      redisClientMock.incr = () => Promise.resolve(randomNumber);
      redisClientMock.expire = () => Promise.resolve(1) as Promise<0 | 1>;
      const ip = internet.ip();

      const value = await service.incrementRequestCount(
        ip,
        config.RATE_LIMIT.WINDOW_IN_SECONDS
      );
      assert(value === randomNumber);
    });
  });
});
