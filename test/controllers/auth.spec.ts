import { Redis } from 'ioredis';
import { Transporter } from 'nodemailer';
import { Repository } from 'typeorm';

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
  // ! Preventing compiler from crashing because of unused variable
  // tslint:disable-next-line: no-unused-expression
  controller;

  describe('register', () => {
    it('creates a new user', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('login', () => {
    it('calls login on user service', () => {
      throw new Error('Not implemented yet');
    });
    it('returns http response with cookie for refresh token', () => {
      throw new Error('Not implemented yet');
    });
    it('returns http response with access token in data', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('refresh', () => {
    it("throws if cookie isn't present in request", () => {
      throw new Error('Not implemented yet');
    });
    it('calls refresh on auth service', () => {
      throw new Error('Not implemented yet');
    });
    it('returns http response with cookie for refresh token', () => {
      throw new Error('Not implemented yet');
    });
    it('returns http response with access token in data', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('logout', () => {
    it('calls logout on auth service', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('changePassword', () => {
    it('calls changePassword on auth service', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('forgotPassword', () => {
    it('calls forgotPassword on auth service', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('forgotPasswordSubmit', () => {
    it('calls forgotPasswordSubmit on auth service', () => {
      throw new Error('Not implemented yet');
    });
  });
});
