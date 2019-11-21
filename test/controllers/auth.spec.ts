import { hash } from 'argon2';
import { assert } from 'chai';
import { internet, name, random } from 'faker';
import { Redis } from 'ioredis';
import { Transporter } from 'nodemailer';
import sinon from 'sinon';
import { Repository } from 'typeorm';

import { config } from '../../src/config';
import { AuthController } from '../../src/controllers/auth.controller';
import { User } from '../../src/entity/user.entity';
import { AuthService } from '../../src/services/auth.service';
import { CacheService } from '../../src/services/cache.service';
import { EmailService } from '../../src/services/email.service';
import { UserService } from '../../src/services/user.service';

describe('AuthController', () => {
  const userRepository = {} as Repository<User>;
  const userService = new UserService(userRepository);
  const cacheService = new CacheService({} as Redis);
  const emailService = new EmailService({} as Transporter);
  const authService = new AuthService(
    userRepository,
    cacheService,
    emailService
  );
  const controller = new AuthController(userService, authService);

  describe('register', () => {
    it('creates a new user', async () => {
      const stub = sinon.stub(userService, 'createUser');
      await controller.register({
        body: {
          email: internet.email(),
          password: internet.password(),
          fullName: name.findName()
        },
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });
      assert(stub.called);
      stub.restore();
    });
  });

  describe('login', () => {
    it('calls login on auth service', async () => {
      const stub = sinon
        .stub(authService, 'login')
        .returns(Promise.resolve({ accessToken: '', refreshToken: '' }));
      await controller.login({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });
      assert(stub.called);
      stub.restore();
    });
    it('returns http response with cookie for refresh token', async () => {
      const refreshToken = random.alphaNumeric();
      const stub = sinon
        .stub(authService, 'login')
        .returns(Promise.resolve({ accessToken: '', refreshToken }));
      const response = await controller.login({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });
      assert(
        response.cookies &&
          response.cookies.some(
            el =>
              el.key === config.JWT.REFRESH_TOKEN_COOKIE_KEY &&
              el.value === refreshToken
          )
      );
      stub.restore();
    });
    it('returns http response with access token in data', async () => {
      const accessToken = random.alphaNumeric();
      const stub = sinon
        .stub(authService, 'login')
        .returns(Promise.resolve({ accessToken, refreshToken: '' }));
      const response = await controller.login({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });
      assert(response.data && response.data.accessToken === accessToken);
      stub.restore();
    });
  });

  describe('refresh', () => {
    it("throws if cookie isn't present in request", async () => {
      const stub = sinon.stub(authService, 'refresh');
      try {
        await controller.refresh({
          body: {},
          cookies: {},
          ip: internet.ip(),
          params: {},
          query: {}
        });
        assert(false, "It didn't throw an exception");
      } catch (error) {
        assert(error);
      }
      stub.restore();
    });
    it('calls refresh on auth service', async () => {
      const stub = sinon
        .stub(authService, 'refresh')
        .returns(Promise.resolve({ accessToken: '', refreshToken: '' }));

      await controller.refresh({
        body: {},
        cookies: {
          [config.JWT.REFRESH_TOKEN_COOKIE_KEY]: random.alphaNumeric()
        },
        ip: internet.ip(),
        params: {},
        query: {}
      });

      assert(stub.called);

      stub.restore();
    });
    it('returns http response with cookie for refresh token', async () => {
      const refreshToken = random.alphaNumeric();
      const stub = sinon
        .stub(authService, 'refresh')
        .returns(Promise.resolve({ accessToken: '', refreshToken }));
      userRepository.findOne = sinon.stub().returns(
        Promise.resolve({
          id: random.uuid(),
          fullName: name.findName(),
          email: internet.email(),
          password: internet.password(),
          tokenVersion: 0,
          isGoogleUser: false
        })
      );
      const response = await controller.refresh({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {
          [config.JWT.REFRESH_TOKEN_COOKIE_KEY]: random.alphaNumeric()
        },
        ip: internet.ip(),
        params: {},
        query: {}
      });
      assert(
        response.cookies &&
          response.cookies.some(
            el =>
              el.key === config.JWT.REFRESH_TOKEN_COOKIE_KEY &&
              el.value === refreshToken
          )
      );
      stub.restore();
    });
    it('returns http response with access token in data', async () => {
      const accessToken = random.alphaNumeric();
      const stub = sinon
        .stub(authService, 'refresh')
        .returns(Promise.resolve({ accessToken, refreshToken: '' }));
      userRepository.findOne = sinon.stub().returns(
        Promise.resolve({
          id: random.uuid(),
          fullName: name.findName(),
          email: internet.email(),
          password: await hash(internet.password()),
          tokenVersion: 0,
          isGoogleUser: false
        })
      );
      const response = await controller.refresh({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {
          [config.JWT.REFRESH_TOKEN_COOKIE_KEY]: random.alphaNumeric()
        },
        ip: internet.ip(),
        params: {},
        query: {}
      });
      assert(response.data && response.data.accessToken === accessToken);
      stub.restore();
    });
  });

  describe('logout', () => {
    it('calls logout on auth service', async () => {
      const stub = sinon.stub(authService, 'logout');

      await controller.logout({
        body: {},
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });

      assert(stub.calledOnce);
    });
  });

  describe('changePassword', () => {
    it('calls changePassword on auth service', async () => {
      const stub = sinon.stub(authService, 'changePassword');

      await controller.changePassword({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });

      assert(stub.calledOnce);
    });
  });

  describe('forgotPassword', () => {
    it('calls forgotPassword on auth service', async () => {
      const stub = sinon.stub(authService, 'forgotPassword');

      await controller.forgotPassword({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });

      assert(stub.calledOnce);
    });
  });

  describe('forgotPasswordSubmit', () => {
    it('calls forgotPasswordSubmit on auth service', async () => {
      const stub = sinon.stub(authService, 'forgotPasswordSubmit');

      await controller.forgotPasswordSubmit({
        body: {
          email: internet.email(),
          password: internet.password()
        },
        cookies: {},
        ip: internet.ip(),
        params: {},
        query: {}
      });

      assert(stub.calledOnce);
    });
  });
});
