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
- Notification
  - Get all the user notifications
  - Create new Notification
  - Update Notification
  - Delete Notification

## Badges

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/DZyNAYPAhzZPw9XNQdFp44/3hxMiJybFGndEJMA2bt8Lh/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/DZyNAYPAhzZPw9XNQdFp44/3hxMiJybFGndEJMA2bt8Lh/tree/main)

## Pre-Requisites

- Docker installed without SUDO Permission
- Docker compose installed without SUDO
- Ports free: 3000 and 5432

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
- Node: Node20.18.2
- TypeORM
- Postgres

## Decisions made

- Clean Architecture: To be able to handle further changes in the future in a proper way.
- TypeORM: Because it is the already integrated ORM in the Nest Framework and it is the most popular ORM so it is easy to find fixes and people that know how to use it
- Docker: To make the project portable
- Jest/Testing/E2E: Jest is the most used testing framework of JS. Same argument as above. E2E testing was done because it is useless to always test every single part. That's why if the controller provide the proper answer the test has passed.

- The notification channels were implemeted using an Strategy pattern, to avoid changing the existing code when adding a new channel. A channel implements four methods:
  - getName: returns the channels identifier.
  - validate: to validate the notification data before sending it.
  - send: formats and send the notification through the appropiated external service, and returns the operation result.
  - register: register the operation result in the DB.
- Every channel is an injectable, meaning that they can inject external dependencies as it needs, like external services for email, sms, push notification, etc.
- Every channel is injected in the mapper, which determines which service should be called for every NotificationChannel.

## Route

- Local: [API Swagger](http://localhost:3000/api) (once api is up and running)

## Env vars that should be defined

To find an example of the values you can use [.env.example](.env.example)
