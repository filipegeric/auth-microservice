import { assert } from 'chai';
import { Request } from 'express';
import { Response } from 'express-serve-static-core';
import sinon from 'sinon';

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
    const res: Response = ({
      status(status: number) {
        statusStub(status);
        return this;
      },
      send() {
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
  });

  it('returns response with error if authorization header format is invalid', () => {
    throw new Error('Not implemented yet');
  });

  it('returns response with error if token is invalid', () => {
    throw new Error('Not implemented yet');
  });

  it('returns response with error if token payload is not an object', () => {
    throw new Error('Not implemented yet');
  });

  it('returns response with error if there is no email in token payload', () => {
    throw new Error('Not implemented yet');
  });

  it('attaches email to request', () => {
    throw new Error('Not implemented yet');
  });
});
