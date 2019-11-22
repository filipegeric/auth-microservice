import { assert } from 'chai';
import { internet, random } from 'faker';
import { Transporter } from 'nodemailer';
import { stub } from 'sinon';

import { config } from '../../src/config';
import { EmailService } from '../../src/services/email.service';

describe('EmailService', () => {
  let service: EmailService;
  const emailClientMock: Transporter = {} as Transporter;

  before(() => {
    service = new EmailService(emailClientMock);
  });

  describe('sendPasswordResetMail', () => {
    it('sends mail to provided email with text and html that includes provided code', async () => {
      const email = internet.email();
      const code = random.number(999999);

      emailClientMock.sendMail = () => Promise.resolve();
      const sendMailStub = stub(emailClientMock, 'sendMail');

      await service.sendPasswordResetMail(email, code);

      assert(sendMailStub.calledOnce);

      const [mailOptions] = sendMailStub.getCall(0).args;

      assert(mailOptions.to === email);
      assert(mailOptions.from === config.SMTP.USER);
      assert(mailOptions.subject === 'Password Reset');
      assert(
        mailOptions.text &&
          mailOptions.text.toString().indexOf(code.toString()) > -1
      );
      assert(
        mailOptions.html &&
          mailOptions.html.toString().indexOf(code.toString()) > -1
      );
    });
  });
});
