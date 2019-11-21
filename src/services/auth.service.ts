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

  public async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password', 'fullName', 'tokenVersion', 'isGoogleUser']
    });

    if (!user) {
      throw new HttpError(404, 'No user with that email');
    }

    if (user.isGoogleUser) {
      throw new HttpError(403, 'You must use google to sign in');
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
    const { email, tokenVersion } = await verifyTokenAsync<{
      email: string;
      tokenVersion: number;
    }>(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);

    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: ['email', 'password', 'fullName', 'tokenVersion']
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

  public async logout(email: string) {
    await this.userRepository.increment({ email }, 'tokenVersion', 1);
    return true;
  }

  public async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepository.findOneOrFail({
      where: { email },
      select: ['password']
    });
    if (!(await verify(user.password, oldPassword))) {
      throw new HttpError(403, 'Old password invalid');
    }
    const hashedPassword = await hash(newPassword);
    await this.userRepository.update({ email }, { password: hashedPassword });

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

  public async forgotPasswordSubmit(
    email: string,
    code: number,
    password: string
  ) {
    const codeFromCache = await this.cacheService.getPasswordResetCode(email);
    if (!codeFromCache) {
      throw new HttpError(
        404,
        "You haven't requested a password reset or it expired"
      );
    }
    const parsedCode = parseInt(codeFromCache, 10);
    await this.cacheService.deletePasswordResetCode(email);
    if (parsedCode !== code) {
      throw new HttpError(
        400,
        'Code invalid. You have to request password reset again'
      );
    }
    const hashedPassword = await hash(password);
    await this.userRepository.update({ email }, { password: hashedPassword });
    return true;
  }

  public createAccessToken(user: User) {
    return sign({ email: user.email }, config.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: config.JWT_ACCESS_TOKEN_EXPIRE
    });
  }

  public createRefreshToken(user: User) {
    return sign(
      { email: user.email, tokenVersion: user.tokenVersion },
      config.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: config.JWT_REFRESH_TOKEN_EXPIRE
      }
    );
  }
}
