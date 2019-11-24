import { HttpError } from '../error/http.error';
import { UserService } from '../services/user.service';
import { IHttpRequest, IHttpResponse } from '../types/http';

export class UserController {
  constructor(private userService: UserService) {}

  public async getMe(request: IHttpRequest): Promise<IHttpResponse<any>> {
    const email = request.email!;
    const user = await this.userService.getUser(email);
    if (!user) {
      throw new HttpError(404, 'No such user');
    }
    delete user.isGoogleUser;
    delete user.password;
    delete user.tokenVersion;
    return {
      status: 200,
      data: user
    };
  }
}
