import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  public async getUser(username: string) {
    return this.userRepository.findOne({ username });
  }
}
