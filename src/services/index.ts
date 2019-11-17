import Redis from 'ioredis';
import { createTransport } from 'nodemailer';

import { config } from '../config';
import { userRepository } from '../db';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { EmailService } from './email.service';
import { UserService } from './user.service';

const cacheService = new CacheService(
  new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD
  })
);
const emailService = new EmailService(
  createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASSWORD
    }
  })
);
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, cacheService, emailService);

export { userService, authService, cacheService, emailService };
