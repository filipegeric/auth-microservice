import { readFile } from 'fs';
import { Transporter } from 'nodemailer';
import { join } from 'path';

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

  private getPasswordResetHtml(code: number) {
    return new Promise<string>((resolve, reject) => {
      readFile(
        join(__dirname + './../templates/password-reset-email.html'),
        (err, data) => {
          if (err) {
            return reject(err);
          }
          let template = data.toString();
          template = template.replace('[CODE]', code.toString());
          return resolve(template);
        }
      );
    });
  }

  private getPasswordResetText(code: number) {
    return `reset code: ${code}`;
  }
}
