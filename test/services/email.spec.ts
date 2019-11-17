import { Transporter } from 'nodemailer';

import { EmailService } from '../../src/services/email.service';

describe('EmailService', () => {
  let service: EmailService;
  const emailClientMock: Transporter = {} as Transporter;

  before(() => {
    service = new EmailService(emailClientMock);
    // ! preventing compiler crash because of unused variable service
    // tslint:disable-next-line: no-unused-expression
    service;
  });

  describe('sendPasswordResetMail', () => {
    it('sends mail to provided email with text and html that includes provided code', () => {
      throw new Error('Not implemented yet');
    });
  });
});
