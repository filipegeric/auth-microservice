import { authService, googleService, userService } from '../services';
import { AuthController } from './auth.controller';
import { GoogleController } from './google.controller';
import { UserController } from './user.controller';

const userController = new UserController(userService);

const authController = new AuthController(userService, authService);

const googleController = new GoogleController(
  googleService,
  userService,
  authService
);

export { userController, authController, googleController };
