import { body } from 'express-validator';

export function getGoogleLoginValidators() {
  return [
    body('idToken')
      .isString()
      .not()
      .isEmpty()
  ];
}
