import { config } from '../config';
import { AuthService } from '../services/auth.service';
import { GoogleService } from '../services/google.service';
import { UserService } from '../services/user.service';
import { IHttpRequest, IHttpResponse } from '../types/http';

export class GoogleController {
  constructor(
    private googleService: GoogleService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  public async login(request: IHttpRequest): Promise<IHttpResponse> {
    const idToken: string = request.body.idToken;
    const { email, name } = await this.googleService.verifyIdToken(idToken);
    let user = await this.userService.getUser(email);
    if (!user) {
      user = await this.userService.createUser(email, '', name, true);
    }

    return {
      status: 200,
      data: {
        accessToken: this.authService.createAccessToken(user)
      },
      cookies: [
        {
          key: config.JWT.REFRESH_TOKEN_COOKIE_KEY,
          value: this.authService.createRefreshToken(user),
          options: {
            httpOnly: true
          }
        }
      ]
    };
  }
}
