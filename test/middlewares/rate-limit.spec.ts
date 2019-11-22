import { assert } from 'chai';
import { Request, Response } from 'express';
import { internet } from 'faker';
import { Redis } from 'ioredis';
import sinon from 'sinon';

import { config } from '../../src/config';
import { makeRateLimitMiddleware } from '../../src/middlewares/rate-limit.middleware';
import { CacheService } from '../../src/services/cache.service';

describe('rateLimitMiddleware', () => {
  let mockCache: { [key: string]: any };
  const timeouts: NodeJS.Timer[] = [];
  const cacheService: CacheService = new CacheService({
    incr(key: string) {
      if (!mockCache[key]) {
        mockCache[key] = 0;
      }
      mockCache[key]++;
      return mockCache[key];
    },
    expire(key: string, seconds: number) {
      if (!mockCache[key]) {
        return;
      }
      timeouts.push(
        setTimeout(() => {
          delete mockCache[key];
        }, seconds * 1000)
      );
    }
  } as Redis);
  const middleware = makeRateLimitMiddleware(
    cacheService,
    config.RATE_LIMIT.COUNT,
    config.RATE_LIMIT.WINDOW_IN_SECONDS
  );

  beforeEach(() => {
    mockCache = {};
  });

  afterEach(() => {
    for (const timeout of timeouts) {
      clearTimeout(timeout);
    }
  });

  it('increments request count on every request', async () => {
    const ip = internet.ip();
    const req = {
      ip
    };
    const res = {
      status() {
        return this;
      },
      send() {
        return this;
      }
    };
    for (let i = 0; i < 10; i++) {
      await middleware(
        req as Request,
        (res as unknown) as Response,
        sinon.stub()
      );
      assert(mockCache[`rate-limit:${ip}`] === i + 1);
    }
  });

  it('returns 429 if limit is exceeded', async () => {
    const ip = internet.ip();
    const req = {
      ip
    };
    const statusStub = sinon.stub();
    const res = {
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
        return this;
      }
    };

    while (!statusStub.calledWith(429)) {
      await middleware(
        req as Request,
        (res as unknown) as Response,
        sinon.stub()
      );
    }

    assert(statusStub.calledOnceWith(429));
  });

  it('calls next if request count is not greater than limit', async () => {
    const ip = internet.ip();
    const req = {
      ip
    };
    const statusStub = sinon.stub();
    const res = {
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
        return this;
      }
    };

    while (true) {
      const nextStub = sinon.stub();
      await middleware(req as Request, (res as unknown) as Response, nextStub);
      if (statusStub.calledWith(429)) {
        break;
      }
      assert(nextStub.called);
    }

    assert(statusStub.calledOnceWith(429));
  });
});
