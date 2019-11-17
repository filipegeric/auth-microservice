import { userRepository } from '../db';
import { UserService } from './user.service';

const userService = new UserService(userRepository);

export { userService };
