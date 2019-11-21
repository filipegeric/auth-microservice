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
      const email = internet.email();
      const mockUser = new User(email, internet.password(), name.firstName());

      userRepository.findOne = stub().callsFake(() => {
        return mockUser;
      });

      const user = await service.getUser(email);

      expect(user).to.be.instanceOf(User);
      expect(user).to.be.eql(mockUser);
    });

    it('fails if there is no user', done => {
      const email = internet.email();

      userRepository.findOne = stub().throws();

      service
        .getUser(email)
        .then(done)
        .catch(() => done());
    });
  });

  describe('createUser', () => {
    it('throws if there is already a user with provided email', () => {
      throw new Error('Not implemented yet');
    });
    it('throws if there is already a user with provided email', () => {
      throw new Error('Not implemented yet');
    });
    it('creates user with hashed password', () => {
      throw new Error('Not implemented yet');
    });
    it('saves user in database', () => {
      throw new Error('Not implemented yet');
    });
  });
});
