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

  public async getPasswordResetCode(email: string) {
    return this.redisClient.get(`password-reset:${email}`);
  }

  public async deletePasswordResetCode(email: string) {
    return this.redisClient.del(`password-reset:${email}`);
  }

  public async incrementRequestCount(ip: string, windowInSeconds: number) {
    const value = await this.redisClient.incr(`rate-limit:${ip}`);
    if (value === 1) {
      await this.redisClient.expire(`rate-limit:${ip}`, windowInSeconds);
    }
    return value;
  }
}
