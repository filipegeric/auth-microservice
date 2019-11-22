import { assert, expect } from 'chai';
import { Request } from 'express';
import { Response } from 'express-serve-static-core';
import { internet } from 'faker';
import { sign } from 'jsonwebtoken';
import sinon from 'sinon';
import uuid from 'uuid/v4';

import { config } from '../../src/config';
import { authMiddleware } from '../../src/middlewares/auth.middleware';

describe('authMiddleware', () => {
  it('calls next if url is in ignored routes', () => {
    const ignoredUrls = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/forgot-password',
      '/auth/forgot-password-submit',
      '/google/login'
    ];

    for (const url of ignoredUrls) {
      const nextStub = sinon.stub();
      authMiddleware(
        {
          url
        } as Request,
        {} as Response,
        nextStub
      );
      assert(nextStub.called);
    }
  });

  it('returns response with error if authorization header is missing', () => {
    const statusStub = sinon.stub();
    const sendStub = sinon.stub();
    const res: Response = ({
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
        sendStub();
        return this;
      }
    } as unknown) as Response;
    authMiddleware(
      {
        headers: {}
      } as Request,
      res,
      sinon.stub()
    );
    assert(statusStub.calledWith(401));
    assert(sendStub.called);
  });

  it('returns response with error if authorization header format is invalid', () => {
    const statusStub = sinon.stub();
    const sendStub = sinon.stub();
    const res: Response = ({
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
        sendStub();
        return this;
      }
    } as unknown) as Response;
    authMiddleware(
      {
        headers: {
          authorization: 'Bearertyuiop'
        }
      } as Request,
      res,
      sinon.stub()
    );
    assert(statusStub.calledWith(401));
    assert(sendStub.called);
  });

  it('returns response with error if token is invalid', async () => {
    const statusStub = sinon.stub();
    const sendStub = sinon.stub();
    const res: Response = ({
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
        sendStub();
        return this;
      }
    } as unknown) as Response;
    await authMiddleware(
      {
        headers: {
          authorization: 'Bearer qweqwe.asdasdasd.1312312'
        }
      } as Request,
      res,
      sinon.stub()
    );
    assert(statusStub.calledWith(401));
    assert(sendStub.called);
  });

  it('returns response with error if token payload is not an object', async () => {
    const statusStub = sinon.stub();
    const sendStub = sinon.stub();
    const res: Response = ({
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
        sendStub();
        return this;
      }
    } as unknown) as Response;
    const token = sign('string payload', config.JWT.ACCESS_TOKEN_SECRET, {
      algorithm: 'RS256'
    });
    await authMiddleware(
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as Request,
      res,
      sinon.stub()
    );
    assert(statusStub.calledWith(401));
    assert(sendStub.called);
  });

  it('returns response with error if there is no email in token payload', async () => {
    const statusStub = sinon.stub();
    const sendStub = sinon.stub();
    const res: Response = ({
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
        sendStub();
        return this;
      }
    } as unknown) as Response;
    const token = sign({ foo: 'bar' }, config.JWT.ACCESS_TOKEN_SECRET, {
      algorithm: 'RS256'
    });
    await authMiddleware(
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as Request,
      res,
      sinon.stub()
    );
    assert(statusStub.calledWith(401));
    assert(sendStub.called);
  });

  it('attaches email to request', async () => {
    const email = internet.email();
    const userId = uuid();
    const token = sign({ email, userId }, config.JWT.ACCESS_TOKEN_SECRET, {
      algorithm: 'RS256'
    });
    const req: any = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const res = {
      status() {
        return this;
      },
      send() {
        return this;
      }
    };
    await authMiddleware(
      req as Request,
      (res as unknown) as Response,
      sinon.stub()
    );
    expect(req.email).to.be.eql(email);
  });
});
