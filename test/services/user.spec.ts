import { expect } from 'chai';
import { internet, name } from 'faker';
import { stub } from 'sinon';
import { Repository } from 'typeorm';

import { User } from '../../src/entity/user.entity';
import { UserService } from '../../src/services/user.service';

describe('UserService', () => {
  let service: UserService;
  const userRepository: Repository<User> = {} as Repository<User>;

  before(() => {
    service = new UserService(userRepository);
  });
  describe('getUser', () => {
    it('returns a user', async () => {
      const username = internet.userName();
      const mockUser = new User(
        username,
        internet.password(),
        name.firstName()
      );

      userRepository.findOne = stub().callsFake(() => {
        return mockUser;
      });

      const user = await service.getUser(username);

      expect(user).to.be.instanceOf(User);
      expect(user).to.be.eql(mockUser);
    });

    it('fails if there is no user', done => {
      const username = internet.userName();

      userRepository.findOne = stub().throws();

      service
        .getUser(username)
        .then(done)
        .catch(() => done());
    });
  });
});
