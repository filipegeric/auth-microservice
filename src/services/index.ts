import { OAuth2Client } from 'google-auth-library';
import Redis from 'ioredis';
import { createTransport } from 'nodemailer';

import { config } from '../config';
import { userRepository } from '../db';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { EmailService } from './email.service';
import { GoogleService } from './google.service';
import { UserService } from './user.service';

const cacheService = new CacheService(
  new Redis({
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
    password: config.REDIS.PASSWORD
  })
);
const emailService = new EmailService(
  createTransport({
    host: config.SMTP.HOST,
    port: config.SMTP.PORT,
    auth: {
      user: config.SMTP.USER,
      pass: config.SMTP.PASSWORD
    }
  })
);
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository, cacheService, emailService);
const googleService = new GoogleService(
  new OAuth2Client({ clientId: config.GOOGLE.CLIENT_ID })
);

export { userService, authService, cacheService, emailService, googleService };
