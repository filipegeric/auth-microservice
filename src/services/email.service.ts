import { Transporter } from 'nodemailer';

import { config } from '../config';

export class EmailService {
  constructor(private emailClient: Transporter) {}

  public async sendPasswordResetMail(email: string, code: number) {
    const html = await this.getPasswordResetHtml(code);
    const text = this.getPasswordResetText(code);
    await this.emailClient.sendMail({
      from: config.SMTP.USER,
      to: email,
      subject: 'Password Reset',
      text,
      html
    });
  }

  private async getPasswordResetHtml(code: number) {
    return `reset code: <b>${code}</b>`;
  }

  private getPasswordResetText(code: number) {
    return `reset code: ${code}`;
  }
}
