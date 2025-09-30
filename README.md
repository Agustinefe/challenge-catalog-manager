# Cursor Backend Challenge

### Features

- Users
  - Create new Users
  - Get Users list
  - Get User by Id
  - Update User
  - Delete User
- Auth
  - Sign in
  - Sign out

## Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/DZyNAYPAhzZPw9XNQdFp44/3hxMiJybFGndEJMA2bt8Lh/tree/main.svg?style=svg&circle-token=CCIPRJ_QhF361qCjAa2zHbdTrwcXi_85762fea7027d97602b43d37fb8e1bd7d4d0f2f8)](https://dl.circleci.com/status-badge/redirect/circleci/DZyNAYPAhzZPw9XNQdFp44/3hxMiJybFGndEJMA2bt8Lh/tree/main)

[![codecov](https://codecov.io/gh/Agustinefe/challenge-catalog-manager/graph/badge.svg?token=RvPB8sIcZA)](https://codecov.io/gh/Agustinefe/challenge-catalog-manager)

## Pre-Requisites

- Docker installed without SUDO Permission
- Docker compose installed without SUDO
- Ports free: 3000 and 3306

## How to run the APP

```
chmod 711 ./up_dev.sh
./up_dev.sh
```

## How to run the tests

```
chmod 711 ./up_test.sh
./up_test.sh
```

## How to run the seed (DB must be up and running, node modules installed)

```
npm run seed
```

## Areas to improve

- Data should be moved from tests to an external file
- Generic method should be used to mock endpoints
- Error handling could be improved (I.E handle already existing user error)
- The ORM is being used with Synchronize instead of migrations. Migrations would be the best option
- Deployment with Heroku could be done

## Techs

- Nest: 11
- Node: 20.18.2
- MySQL: 8.0 (with mysql2)

## Decisions made

- Clean Architecture: To be able to handle further changes in the future in a proper way.
- Docker: To make the project portable
- Jest/Testing/E2E: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed.

## Route

- Local: [API Swagger](http://localhost:3000/api) (once api is up and running)

## Env vars that should be defined

To find an example of the values you can use [.env.example](.env.example)

## TODO list:

- Explain why the slug is generated and stored in the db
- Explain how I calculate the related products.
