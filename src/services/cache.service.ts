import { Redis } from 'ioredis';

import { config } from '../config';

export class CacheService {
  constructor(private redisClient: Redis) {}

  public async storePasswordResetCode(email: string, code: number) {
    return this.redisClient.setex(
      `password-reset:${email}`,
      config.PASSWORD_RESET_CODE_EXPIRE_IN_SECONDS,
      code
    );
  }
}
