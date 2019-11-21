import { GoogleService } from '../services/google.service';
import { UserService } from '../services/user.service';
import { IHttpRequest, IHttpResponse } from '../types/http';

export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private userService: UserService
  ) {}

  public async login(request: IHttpRequest): Promise<IHttpResponse> {
    const idToken: string = request.body.idToken;
    const tokenPayload = await this.googleService.verifyIdToken(idToken);
    const user = await this.userService.getUser(tokenPayload.email!);
    if (!user) {
      // user = await this.userService.createUser(tokenPayload.)
    }

    return {
      status: 200,
      data: {}
    };
  }
}
