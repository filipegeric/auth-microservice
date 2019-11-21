import { OAuth2Client } from 'google-auth-library';

import { config } from '../config';
import { HttpError } from '../error/http.error';

export class GoogleService {
  constructor(private oAuthClient: OAuth2Client) {}

  public async verifyIdToken(idToken: string) {
    const loginTicket = await this.oAuthClient.verifyIdToken({
      idToken,
      audience: config.GOOGLE_CLIENT_ID
    });

    const tokenPayload = loginTicket.getPayload();
    if (!tokenPayload) {
      throw new HttpError(400, 'Google token payload invalid');
    }

    if (!tokenPayload.email_verified) {
      throw new HttpError(403, 'Email is not verified');
    }

    if (!tokenPayload.email) {
      throw new HttpError(400, 'Email is missing from token payload');
    }

    if (!tokenPayload.name) {
      throw new HttpError(400, 'Name is missing from token payload');
    }

    return { email: tokenPayload.email, name: tokenPayload.name };
  }
}
