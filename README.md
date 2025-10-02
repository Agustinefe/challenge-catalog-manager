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
- Product
  - List active products
  - Get Product by slug and related products
- Search
  - Search products by sku and/or description
- Order
  - Search orders by id, client cuit or creation date
  - Create a new order

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

> Warning: since the tests are designed to works with its own database, this process could be slow, dependind on the computer. You can check the badges if you want to know if the tests passed quickly.

## How to run the seed (DB must be up and running, node modules installed)

```
npm run seed
```

## Areas to improve

- Generic method should be used to mock endpoints
- Error handling could be improved (I.E handle already existing user error)
- Some changes has been made to the original structure of the tables (I.E include createdAt fields). This changes should have been made with migrations to generate an history of the changes.
- Deployment with Heroku or another cloud provider could be done.
- Initially, the seeders had the unique responsibility of populating each table. Throughout the development, those seeders evolve to be more like a table manager, with a main orchestrator called DatabaseSetup. Probably it would be better to change the name of these classes to reflect their new responsibilities.

## Techs

- Nest: 11
- Node: 20.18.2
- MySQL: 8.0 (with mysql2)

## Decisions made

- Clean Architecture: To be able to handle further changes in the future in a proper way.
- Docker: To make the project portable
- Jest/Testing/E2E: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed. Also the E2E tests interact with its own tabase, independently from the production database. This is to ensure the tests are closer to real-world use cases.
- Mysql2: Despite the increasing popularity of the ORM libraries like TypeORM o Sequelize, one of the main goals of this project is to see how the queries are being managed directly to the DB.

## Route

- Local: [API Swagger](http://localhost:3000/api) (once api is up and running)

## Env vars that should be defined

To find an example of the values you can use [.env.example](.env.example)
