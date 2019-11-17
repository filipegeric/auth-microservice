import { userRepository } from '../db';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);

export { userService, authService };
