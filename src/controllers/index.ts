import { userService } from '../services';
import { UserController } from './user.controller';

const userController = new UserController(userService);

export { userController };
