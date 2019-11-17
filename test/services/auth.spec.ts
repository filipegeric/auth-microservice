import { hash } from 'argon2';
import { expect } from 'chai';
import { internet } from 'faker';
import { stub } from 'sinon';
import { Repository } from 'typeorm';

import { User } from '../../src/entity/user.entity';
import { AuthService } from '../../src/services/auth.service';
import { CacheService } from '../../src/services/cache.service';
import { EmailService } from '../../src/services/email.service';

describe('AuthService', () => {
  let service: AuthService;
  const userRepository: Repository<User> = {} as Repository<User>;
  const cacheService: CacheService = {} as CacheService;
  const emailService: EmailService = {} as EmailService;

  before(() => {
    service = new AuthService(userRepository, cacheService, emailService);
  });

  describe('login', () => {
    it('returns access token and refresh token', async () => {
      const username = internet.userName();
      const password = internet.password();

      userRepository.findOne = stub().callsFake(async () => {
        return {
          username,
          password: await hash(password),
          tokenVersion: 0
        };
      });

      const { accessToken, refreshToken } = await service.login(
        username,
        password
      );

      expect(typeof accessToken).to.be.eql('string');
      expect(typeof refreshToken).to.be.eql('string');
    });

    it('throws if there is no user with provided username', () => {
      throw new Error('Not implemented yet');
    });

    it('throws if password is wrong', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('refresh', () => {
    it('returns access token and refresh token', () => {
      throw new Error('Not implemented yet');
    });
    it('throws if there is no user with username from token', () => {
      throw new Error('Not implemented yet');
    });
    it("throws if token version from database doesn't match token version from token", () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('logout', () => {
    it('increments token version in database', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('changePassword', () => {
    it('throws if old password is invalid', () => {
      throw new Error('Not implemented yet');
    });
    it("updates user's password in database with hash of provided new password", () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('forgotPassword', () => {
    it('throws if there is no user with provided email', () => {
      throw new Error('Not implemented yet');
    });
    it('stores generated code in cache', () => {
      throw new Error('Not implemented yet');
    });
    it('sends an email to provided email address', () => {
      throw new Error('Not implemented yet');
    });
  });

  describe('forgotPasswordSubmit', () => {
    it('throws if there is no code in cache for provided email', () => {
      throw new Error('Not implemented yet');
    });
    it('deletes code from cache', () => {
      throw new Error('Not implemented yet');
    });
    it("throws if provided code doesn't match code from cache", () => {
      throw new Error('Not implemented yet');
    });
    it("updates user's password in database with hash of provided password", () => {
      throw new Error('Not implemented yet');
    });
  });
});
