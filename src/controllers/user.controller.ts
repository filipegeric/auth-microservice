import { HttpError } from '../error/http.error';
import { UserService } from '../services/user.service';
import { IHttpRequest, IHttpResponse } from '../types/http';

export class UserController {
  constructor(private userService: UserService) {}

  public async getMe(request: IHttpRequest): Promise<IHttpResponse<any>> {
    const username = request.username!;
    const user = await this.userService.getUser(username);
    if (!user) {
      throw new HttpError(404, 'No such user');
    }
    return {
      status: 200,
      data: user
    };
  }
}
