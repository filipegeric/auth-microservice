import { body } from 'express-validator';

export function getRegisterValidators() {
  return [
    body(
      'username',
      'Username has to be at least 3 characters long.'
    ).isLength({ min: 3 }),
    body('email')
      .exists()
      .isEmail(),
    body('fullName', 'Name has to be at least 1 character long.').isLength({
      min: 1
    }),
    body(
      'password',
      'Password has to be at least 6 characters long.'
    ).isLength({ min: 6 })
  ];
}

export function getLoginValidators() {
  return [
    body('username', 'Username is required and has to be a string').isString(),
    body('password', 'Password is required and has to be a string').isString()
  ];
}

export function getChangePasswordValidators() {
  return [
    body(
      'oldPassword',
      'Old password is required and has to be a string'
    ).isString(),
    body('newPassword', 'New password is required and has to be a string')
      .isString()
      .isLength({ min: 6 })
      .withMessage('New password has to be at least 6 characters long')
  ];
}

export function getForgotPasswordValidators() {
  return [
    body('email')
      .exists()
      .isEmail()
  ];
}
