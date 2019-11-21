import { expect } from 'chai';
import { internet, name } from 'faker';
import { stub } from 'sinon';
import { Repository } from 'typeorm';

import { UserController } from '../../src/controllers/user.controller';
import { User } from '../../src/entity/user.entity';
import { UserService } from '../../src/services/user.service';

describe('User Controller', () => {
  let controller: UserController;
  const userRepository: Repository<User> = {} as Repository<User>;

  before(() => {
    const userService = new UserService(userRepository);
    controller = new UserController(userService);
  });

  describe('getMe', () => {
    it('returns a user and status code 200', async () => {
      const stubUser = new User(
        internet.email(),
        internet.password(),
        name.findName()
      );

      userRepository.findOne = stub().callsFake(() => {
        return stubUser;
      });

      const response = await controller.getMe({
        body: null,
        params: null,
        ip: internet.ip(),
        query: null,
        cookies: null,
        email: stubUser.email
      });

      expect(response.status).to.be.eql(200);
      expect(response.data).to.be.eql(stubUser);
    });

    it('fails when there is no user with provided email', done => {
      const email = internet.email();
      userRepository.findOne = stub().throws();

      controller
        .getMe({
          body: null,
          params: {
            email
          },
          ip: internet.ip(),
          query: null,
          cookies: null,
          email
        })
        .then(done)
        .catch(() => done());
    });
  });
});
