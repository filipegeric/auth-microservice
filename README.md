# Auth Microservice

Since features like login and register are often used in web apps this microservice abstracts basic authentication and authorization features.

## Installation

1. Clone the project

```
git clone https://github.com/filipegeric/auth-microservice
```

```
cd auth-microservice
```

2. Make `.env` file and edit environment variables

```
cp .env.example .env
```

3. Create private and public keys for JWT

```
cd certs
touch access-token-private-key.pem access-token-public-key.pem refresh-token-private-key.pem refresh-token-public-key.pem
```

4. Install dependencies

```
npm i
```

5. Build and run docker image

```
docker-compose build
docker-compose up
```

## TODO

1. admin routes accesible with API key
2. client library
3. Email template
