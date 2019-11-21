import { hash } from 'argon2';
import { Repository } from 'typeorm';
import uuid from 'uuid/v4';

import { User } from '../entity/user.entity';
import { HttpError } from '../error/http.error';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  public async getUser(email: string) {
    return this.userRepository.findOne({ email });
  }

  public async createUser(
    email: string,
    password: string,
    fullName: string,
    isGoogleUser = false
  ) {
    if (await this.userRepository.findOne({ email })) {
      throw new HttpError(403, 'There is already a user with that email.');
    }
    const hashedPassword = await hash(password);
    let user = this.userRepository.create({
      id: uuid(),
      email,
      password: hashedPassword,
      fullName,
      isGoogleUser
    });
    user = await this.userRepository.save(user);
    return user;
  }
}
