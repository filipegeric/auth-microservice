import { hash, verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { config } from '../config';
import { User } from '../entity/user.entity';
import { HttpError } from '../error/http.error';
import { verifyTokenAsync } from '../util/jwt.util';
import { CacheService } from './cache.service';
import { EmailService } from './email.service';

export class AuthService {
  constructor(
    private userRepository: Repository<User>,
    private cacheService: CacheService,
    private emailService: EmailService
  ) {}

  public async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['email', 'username', 'password', 'fullName', 'tokenVersion']
    });

    if (!user) {
      throw new HttpError(404, 'No user with that username');
    }

    if (!(await verify(user.password, password))) {
      throw new HttpError(403, 'Wrong password');
    }

    return {
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user)
    };
  }

  public async refresh(refreshToken: string) {
    const { username, tokenVersion } = await verifyTokenAsync<{
      username: string;
      tokenVersion: number;
    }>(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);

    const user = await this.userRepository.findOne({
      where: {
        username
      },
      select: ['email', 'username', 'password', 'fullName', 'tokenVersion']
    });

    if (!user) {
      throw new HttpError(404, 'No such user');
    }

    if (user.tokenVersion !== tokenVersion) {
      throw new HttpError(401, 'Token version invalid');
    }

    return {
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user)
    };
  }

  public async logout(username: string) {
    await this.userRepository.increment({ username }, 'tokenVersion', 1);
    return true;
  }

  public async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { username },
      select: ['password']
    });
    if (!(await verify(user.password, oldPassword))) {
      throw new HttpError(403, 'Old password invalid');
    }
    const hashedPassword = await hash(newPassword);
    await this.userRepository.update(
      { username },
      { password: hashedPassword }
    );

    return true;
  }

  public async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new HttpError(404, 'No user with that email');
    }
    const code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    await this.cacheService.storePasswordResetCode(email, code);
    await this.emailService.sendPasswordResetMail(email, code);
    return true;
  }

  private createAccessToken(user: User) {
    return sign({ username: user.username }, config.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRE
    });
  }

  private createRefreshToken(user: User) {
    return sign(
      { username: user.username, tokenVersion: user.tokenVersion },
      config.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: config.JWT_REFRESH_TOKEN_EXPIRE
      }
    );
  }
}
