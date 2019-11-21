<a id="top"></a>

## API Documentation

Available routes:

1. [POST /auth/register](#Register)
2. [POST /auth/login](#Login)
3. [POST /auth/refresh](#Refresh)
4. [POST /auth/logout](#Logout)
5. [POST /auth/change-password](#Change-Password)
6. [POST /auth/forgot-password](#Forgot-Password)
7. [POST /auth/forgot-password-submit](#Forgot-Password-Submit)
8. [GET /users/me](#Me)
9. [POST /google/login](#Google-Login)

---

## Register

[Back to top](#top)

Registers new user

    POST /auth/register

### Request body Parameters

| Name     | Type   | Description    |
| :------- | :----- | :------------- |
| email    | string | User email     |
| password | string | User password  |
| fullName | string | User full name |

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "user": {
    "fullName": "Filip Egeric",
    "email": "fica@mail.com",
    "id": "0c36d812-b296-4e79-913f-5b7691171f92",
  }
}
```

### Error Response

Validation Error Response:

```json
HTTP/1.1 422 Unporcessable entity
{
  "errors": [
    {
      "msg": "Password has to be at least 6 characters long.",
      "param": "password",
      "location": "body"
    }
  ]
}
```

User already exists

```json
HTTP/1.1 403 Forbidden
{
  "message": "There is already a user with that email.",
  "error": {
    "status": 403
  }
}
```

---

## Login

[Back to top](#top)

Logs user in with email and password

    POST /auth/login

### Request body Parameters

| Name     | Type   | Description   |
| :------- | :----- | :------------ |
| email    | string | User email    |
| password | string | User password |

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpY2FAbWFpbC5jb20iLCJpYXQiOjE1NzQzNDAxNzIsImV4cCI6MTU3NDM0Mzc3Mn0.4KqCQG_EncJtdWN3vHtQr1kSg1CG3vEd_3XZVUPiypA"
}
```

### Error Response

Validation Error Response:

```json
HTTP/1.1 422 Unporcessable entity
{
  "errors": [
    {
      "msg": "Password is required and has to be a string",
      "param": "password",
      "location": "body"
    }
  ]
}
```

No user with that email

```json
HTTP/1.1 404 Not Found
{
  "message": "No user with that email",
  "error": {
    "status": 404
  }
}
```

Wrong password

```json
HTTP/1.1 403 Forbidden
{
  "message": "Wrong password",
  "error": {
    "status": 403
  }
}
```

---

## Refresh

[Back to top](#top)

Refreshes token

    POST /auth/refresh

### Cookies

| Name  | Type   | Description   |
| :---- | :----- | :------------ |
| jid\* | string | Refresh token |

\*cookie name is configurable

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpY2FAbWFpbC5jb20iLCJpYXQiOjE1NzQzNDAxNzIsImV4cCI6MTU3NDM0Mzc3Mn0.4KqCQG_EncJtdWN3vHtQr1kSg1CG3vEd_3XZVUPiypA"
}
```

Sets new refresh token as cookie

### Error Response

Missing refresh token in cookie

```json
HTTP/1.1 400 Bad Request
{
  "message": "Missing refresh token in cookie",
  "error": {
    "status": 400
  }
}
```

Token expired

```json
HTTP/1.1 401 Unauthorized
{
  "message": "Token expired",
  "error": {
    "status": 401
  }
}
```

Token invalid

```json
HTTP/1.1 401 Unauthorized
{
  "message": "Token invalid",
  "error": {
    "status": 401
  }
}
```

---

## Logout

[Back to top](#top)

Logs user out by invalidating refresh token

    POST /auth/logout

### Headers

| Name          | Type   | Description  |
| :------------ | :----- | :----------- |
| Authorization | string | Access token |

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "ok": true
}
```

---

## Change-Password

[Back to top](#top)

Changes password

    POST /auth/register

### Request body Parameters

| Name        | Type   | Description       |
| :---------- | :----- | :---------------- |
| email       | string | User email        |
| oldPassword | string | User old password |
| newPassword | string | User new password |

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "ok": true
}
```

### Error Response

Validation Error Response:

```json
HTTP/1.1 422 Unporcessable entity
{
  "errors": [
    {
      "msg": "New password has to be at least 6 characters long.",
      "param": "newPassword",
      "location": "body"
    }
  ]
}
```

---

## Forgot-Password

[Back to top](#top)

Sends an email for forgotten password

    POST /auth/forgot-password

### Request body Parameters

| Name  | Type   | Description |
| :---- | :----- | :---------- |
| email | string | User email  |

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "ok": true
}
```

### Error Response

Validation Error Response:

```json
HTTP/1.1 422 Unporcessable entity
{
  "errors": [
    {
      "msg": "Email is required.",
      "param": "email",
      "location": "body"
    }
  ]
}
```

No user with that email

```json
HTTP/1.1 404 Not Found
{
  "message": "No user with that email",
  "error": {
    "status": 404
  }
}
```

---

## Forgot-Password-Submit

[Back to top](#top)

Sends an email for forgotten password

    POST /auth/forgot-password-submit

### Request body Parameters

| Name     | Type   | Description     |
| :------- | :----- | :-------------- |
| email    | string | User email      |
| code     | number | Code from email |
| password | string | New password    |

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "ok": true,
  "message": "Password succesfully changed"
}
```

### Error Response

Validation Error Response:

```json
HTTP/1.1 422 Unporcessable entity
{
  "errors": [
    {
      "msg": "Email is required.",
      "param": "email",
      "location": "body"
    }
  ]
}
```

No user with that email

```json
HTTP/1.1 404 Not Found
{
  "message": "No user with that email",
  "error": {
    "status": 404
  }
}
```

No password reset requested

```json
HTTP/1.1 404 Not Found
{
  "message": "You haven't requested a password reset or it expired",
  "error": {
    "status": 404
  }
}
```

Code invalid

```json
HTTP/1.1 400 Bad request
{
  "message": "Code invalid. You have to request password reset again",
  "error": {
    "status": 400
  }
}
```

---

## Google-Login

[Back to top](#top)

Logs user in with email and password

    POST /google/login

### Request body Parameters

| Name    | Type   | Description     |
| :------ | :----- | :-------------- |
| idToken | string | Google id token |

### Success Response

Success response:

```json
HTTP/1.1 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpY2FAbWFpbC5jb20iLCJpYXQiOjE1NzQzNDAxNzIsImV4cCI6MTU3NDM0Mzc3Mn0.4KqCQG_EncJtdWN3vHtQr1kSg1CG3vEd_3XZVUPiypA"
}
```

### Error Response

Token payload invalid

```json
HTTP/1.1 400 Bad request
{
  "message": "Google token payload invalid",
  "error": {
    "status": 400
  }
}
```

Email not verified

```json
HTTP/1.1 403 Forbidden
{
  "message": "Email is not verified",
  "error": {
    "status": 403
  }
}
```

---

## Me

[Back to top](#top)

Returns user from access token

    GET /users/me

### Headers

| Name          | Type   | Description  |
| :------------ | :----- | :----------- |
| Authorization | string | Access token |

### Success Response

```json
HTTP/1.1 200 OK
{
  "fullName": "Filip Egeric",
  "email": "filip.egeric@gmail.com",
  "id": "bdf2529c-6315-4274-9e1e-443314e460b7"
}
```

### Error Response

Token expired

```json
HTTP/1.1 401 Unauthorized
{
  "message": "Token expired",
  "error": {
    "status": 401
  }
}
```

Token invalid

```json
HTTP/1.1 401 Unauthorized
{
  "message": "Token invalid",
  "error": {
    "status": 401
  }
}
```

---
