import { hash, verify } from 'argon2';
import { assert, expect } from 'chai';
import { internet } from 'faker';
import { sign } from 'jsonwebtoken';
import { stub } from 'sinon';
import { Repository, UpdateResult } from 'typeorm';

import { config } from '../../src/config';
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
      const email = internet.email();
      const password = internet.password();

      userRepository.findOne = stub().callsFake(async () => {
        return {
          email,
          password: await hash(password),
          tokenVersion: 0
        };
      });

      const { accessToken, refreshToken } = await service.login(
        email,
        password
      );

      expect(typeof accessToken).to.be.eql('string');
      expect(typeof refreshToken).to.be.eql('string');
    });

    it('throws if there is no user with provided email', async () => {
      const email = internet.email();
      const password = internet.password();

      userRepository.findOne = stub().callsFake(async () => {
        return undefined;
      });

      try {
        await service.login(email, password);
        assert(false, "It didn't throw an error");
      } catch (error) {
        assert(error);
      }
    });

    it('throws if password is wrong', async () => {
      const email = internet.email();
      const password = internet.password();

      userRepository.findOne = stub().callsFake(async () => {
        return {
          email,
          password: await hash(password),
          tokenVersion: 0
        };
      });

      try {
        await service.login(email, internet.password());
        assert(false, "It didn't throw an error");
      } catch (error) {
        assert(error);
      }
    });
  });

  describe('refresh', () => {
    it('returns access token and refresh token', async () => {
      const email = internet.email();
      const password = internet.password();
      const token = sign(
        { email, tokenVersion: 0 },
        config.JWT.REFRESH_TOKEN_SECRET,
        { algorithm: 'RS256', expiresIn: config.JWT.REFRESH_TOKEN_EXPIRE }
      );

      userRepository.findOne = stub().callsFake(async () => {
        return {
          email,
          password: await hash(password),
          tokenVersion: 0
        };
      });

      const { accessToken, refreshToken } = await service.refresh(token);

      expect(typeof accessToken).to.be.eql('string');
      expect(typeof refreshToken).to.be.eql('string');
    });
    it('throws if there is no user with email from token', async () => {
      const token = sign(
        { email: internet.email(), tokenVersion: 0 },
        config.JWT.REFRESH_TOKEN_SECRET,
        { algorithm: 'RS256', expiresIn: config.JWT.REFRESH_TOKEN_EXPIRE }
      );
      userRepository.findOne = stub().callsFake(async () => {
        return undefined;
      });

      try {
        await service.refresh(token);
        assert(false, "It didn't throw an error");
      } catch (error) {
        assert(error);
      }
    });
    it("throws if token version from database doesn't match token version from token", async () => {
      const email = internet.email();
      const password = internet.password();
      const token = sign(
        { email, tokenVersion: 0 },
        config.JWT.REFRESH_TOKEN_SECRET,
        { algorithm: 'RS256', expiresIn: config.JWT.REFRESH_TOKEN_EXPIRE }
      );

      userRepository.findOne = stub().callsFake(async () => {
        return {
          email,
          password: await hash(password),
          tokenVersion: 1
        };
      });
      try {
        await service.refresh(token);
        assert(false, "It didn't throw an error");
      } catch (error) {
        assert(error);
      }
    });
  });

  describe('logout', () => {
    it('increments token version in database', async () => {
      const email = internet.email();
      userRepository.increment = () => Promise.resolve({} as UpdateResult);
      const incrementStub = stub(userRepository, 'increment');
      await service.logout(email);
      assert(incrementStub.calledWith({ email }, 'tokenVersion', 1));
    });
  });

  describe('changePassword', () => {
    it('throws if old password is invalid', async () => {
      const email = internet.email();
      const oldPassword = internet.password();
      const newPassword = internet.password();
      userRepository.findOneOrFail = () =>
        Promise.resolve({
          password: internet.password()
        } as User);
      try {
        await service.changePassword(email, oldPassword, newPassword);
        assert(false, "It didn't throw an exception");
      } catch (error) {
        assert(error);
      }
    });
    it("updates user's password in database with hash of provided new password", async () => {
      const email = internet.email();
      const oldPassword = internet.password();
      const newPassword = internet.password();
      userRepository.findOneOrFail = async () =>
        ({
          password: await hash(oldPassword)
        } as User);
      userRepository.update = () => Promise.resolve({} as UpdateResult);
      const updateStub = stub(userRepository, 'update');
      await service.changePassword(email, oldPassword, newPassword);

      const args = updateStub.getCall(0).args;
      expect((args[0] as any).email).to.be.eql(email);
      assert(await verify((args[1] as any).password, newPassword));
    });
  });

  describe('forgotPassword', () => {
    it('throws if there is no user with provided email', async () => {
      userRepository.findOne = stub().returns(undefined);
      try {
        await service.forgotPassword(internet.email());
        assert(false, "It didn't throw an error");
      } catch (error) {
        assert(error);
      }
    });
    it('stores generated code in cache', async () => {
      userRepository.findOne = stub().returns(Promise.resolve({}));
      cacheService.storePasswordResetCode = () => Promise.resolve();
      const storeCodeStub = stub(cacheService, 'storePasswordResetCode');
      emailService.sendPasswordResetMail = stub();
      await service.forgotPassword(internet.email());
      assert(storeCodeStub.calledOnce);
    });
    it('sends an email to provided email address', async () => {
      userRepository.findOne = stub().returns(Promise.resolve({}));
      cacheService.storePasswordResetCode = () => Promise.resolve();
      emailService.sendPasswordResetMail = () => Promise.resolve();
      const sendMailStub = stub(emailService, 'sendPasswordResetMail');
      await service.forgotPassword(internet.email());
      assert(sendMailStub.calledOnce);
    });
  });

  describe('forgotPasswordSubmit', () => {
    it('throws if there is no code in cache for provided email', async () => {
      cacheService.getPasswordResetCode = () => Promise.resolve(null);
      try {
        await service.forgotPasswordSubmit(
          internet.email(),
          123456,
          internet.password()
        );
      } catch (error) {
        assert(error);
      }
    });
    it('deletes code from cache', async () => {
      cacheService.getPasswordResetCode = () => Promise.resolve('123456');
      cacheService.deletePasswordResetCode = () => Promise.resolve(1);
      const email = internet.email();
      const deleteStub = stub(cacheService, 'deletePasswordResetCode');

      await service.forgotPasswordSubmit(email, 123456, internet.password());

      assert(deleteStub.calledOnceWith(email));
    });
    it("throws if provided code doesn't match code from cache", async () => {
      cacheService.getPasswordResetCode = () => Promise.resolve('789456');
      cacheService.deletePasswordResetCode = () => Promise.resolve(1);
      const email = internet.email();

      try {
        await service.forgotPasswordSubmit(email, 123456, internet.password());
        assert(false, "It didn't throw an error");
      } catch (error) {
        assert(error);
      }
    });
    it("updates user's password in database with hash of provided password", async () => {
      cacheService.getPasswordResetCode = () => Promise.resolve('123456');
      cacheService.deletePasswordResetCode = () => Promise.resolve(1);
      userRepository.update = () => Promise.resolve({} as UpdateResult);
      const email = internet.email();
      const newPassword = internet.password();
      const updateStub = stub(userRepository, 'update');

      await service.forgotPasswordSubmit(email, 123456, newPassword);

      assert(updateStub.calledOnce);
      const args = updateStub.getCall(0).args;
      expect((args[0] as any).email).to.be.eql(email);
      assert(await verify((args[1] as any).password, newPassword));
    });
  });
});
