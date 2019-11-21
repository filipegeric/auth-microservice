import { hash } from 'argon2';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { HttpError } from '../error/http.error';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  public async getUser(email: string) {
    return this.userRepository.findOne({ email });
  }

  public async createUser(email: string, password: string, fullName: string) {
    if (await this.userRepository.findOne({ email })) {
      throw new HttpError(403, 'There is already a user with that email.');
    }
    const hashedPassword = await hash(password);
    let user = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName
    });
    user = await this.userRepository.save(user);
    return user;
  }
}
