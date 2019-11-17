import { config } from '../config';
import { HttpError } from '../error/http.error';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { IHttpRequest, IHttpResponse } from '../types/http';

export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  public async register(request: IHttpRequest): Promise<IHttpResponse> {
    const { username, password, email, fullName } = request.body;
    const user = await this.userService.createUser(
      username,
      password,
      email,
      fullName
    );

    return {
      status: 200,
      data: {
        user
      }
    };
  }

  public async login(request: IHttpRequest): Promise<IHttpResponse> {
    const { username, password } = request.body;
    const { accessToken, refreshToken } = await this.authService.login(
      username,
      password
    );

    return {
      status: 200,
      data: {
        accessToken
      },
      cookies: [
        {
          key: config.JWT_REFRESH_TOKEN_COOKIE_KEY,
          value: refreshToken,
          options: {
            httpOnly: true
          }
        }
      ]
    };
  }

  public async refresh(request: IHttpRequest): Promise<IHttpResponse> {
    const token: string = request.cookies[config.JWT_REFRESH_TOKEN_COOKIE_KEY];
    if (!token) {
      throw new HttpError(400, 'Missing refresh token in cookie');
    }

    const { accessToken, refreshToken } = await this.authService.refresh(token);

    return {
      status: 200,
      data: {
        accessToken
      },
      cookies: [
        {
          key: config.JWT_REFRESH_TOKEN_COOKIE_KEY,
          value: refreshToken,
          options: {
            httpOnly: true
          }
        }
      ]
    };
  }

  public async logout(request: IHttpRequest): Promise<IHttpResponse> {
    const ok = await this.authService.logout(request.username!);

    return {
      status: 200,
      data: {
        ok
      }
    };
  }

  public async changePassword(request: IHttpRequest): Promise<IHttpResponse> {
    const username = request.username;
    const oldPassword: string = request.body.oldPassword;
    const newPassword: string = request.body.newPassword;

    if (!username) {
      throw new HttpError(401, 'Unauthorized');
    }

    const ok = await this.authService.changePassword(
      username,
      oldPassword,
      newPassword
    );

    return {
      status: 200,
      data: {
        ok
      }
    };
  }

  public async forgotPassword(request: IHttpRequest): Promise<IHttpResponse> {
    const email: string = request.body.email;

    const ok = await this.authService.forgotPassword(email);

    return {
      status: 200,
      data: {
        ok
      }
    };
  }

  public async forgotPasswordSubmit(
    request: IHttpRequest
  ): Promise<IHttpResponse> {
    const { email, code, password } = request.body;

    const ok = await this.authService.forgotPasswordSubmit(
      email,
      parseInt(code, 10),
      password
    );

    return {
      status: 200,
      data: {
        ok,
        message: 'Password succesfully changed'
      }
    };
  }
}
