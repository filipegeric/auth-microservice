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

  describe('getUser', () => {
    it('returns a user and status code 200', async () => {
      const username = internet.userName();
      const stubUser = new User(username, internet.password(), name.findName());

      userRepository.findOne = stub().callsFake(() => {
        return stubUser;
      });

      const response = await controller.getUser({
        body: null,
        params: {
          username
        },
        ip: internet.ip(),
        query: null
      });

      expect(response.status).to.be.eql(200);
      expect(response.data).to.be.eql(stubUser);
    });

    it('fails when there is no user with provided username', done => {
      const username = internet.userName();
      userRepository.findOne = stub().throws();

      controller
        .getUser({
          body: null,
          params: {
            username
          },
          ip: internet.ip(),
          query: null
        })
        .then(done)
        .catch(() => done());
    });
  });
});
