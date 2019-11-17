import { authService, userService } from '../services';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';

const userController = new UserController(userService);

const authController = new AuthController(userService, authService);

export { userController, authController };
