import { hash } from 'argon2';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { HttpError } from '../error/http.error';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  public async getUser(username: string) {
    return this.userRepository.findOne({ username });
  }

  public async createUser(
    username: string,
    password: string,
    email: string,
    fullName: string
  ) {
    if (await this.userRepository.findOne({ username })) {
      throw new HttpError(403, 'There is already a user with that username.');
    }
    if (await this.userRepository.findOne({ email })) {
      throw new HttpError(403, 'There is already a user with that email');
    }
    const hashedPassword = await hash(password);
    let user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      fullName
    });
    user = await this.userRepository.save(user);
    return user;
  }
}
