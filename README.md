# Critter

## Summary

Social Media platform hosted by Heroku where users can communicate via CLI in the browser. Users can create an account and post, edit, and delete "Creets" on a public live timeline.

[Our Planning Docs](https://github.com/BJR-Cubed/project-docs)

## [Deployed API](https://bjr-critter.herokuapp.com/)

## Problem Domain

We will add an edit function allowing users to edit "creets" so they can correct "creets" they did not think about before "creeting". It is a lightweight version of Twitter and is a great way to connect with others.

MVP

- Tweet Database
- Sign up sign in feature
- Create a live timeline
- Ability to view timeline and post, edit, and delete Tweets in terminal.
- Testing for each functional module

STRETCH

- Hashtag system
- Xterm

## Authors and Contributors

Brady Camp, Jeffrey Jenkins, Rey Mercado

## Installation

1. Clone the repo from `https://github.com/BJR-Cubed/Critter.git`
2. `cd` into `Critter`
3. Run `npm i`

### Envs

Optionally, create an env file with `PORT` and `SECRET` to set your own port number and JWT secret respectively:

- `PORT=<my favorite port>` Defaults to PORT 3000.
- `SECRET=<my favorite secret alphanumeric>`

## Usage

- Run `npm start` to start the server application
- Use an HTTP client to send requests to the API.
<!-- - Run `node client` to start the client application -->
### Testing

- Run `npm test` to run the Jest test suites.

## Routes

### Auth Routes

- POST `/signup`
  - Requires a JSON body with properties `handle`, `displayName`, `password`.
  - On success, returns `201` with user record just created in the database
    - Returns an error `500` if credentials are incomplete or invalid.
- POST `/signin`
  - Requires a Basic auth header with base-64-encoded auth string (`handle:password`)
  - On success, returns `200` with the user record which matches the provided credentials
    - Returns an error `403` if credentials are invalid.

### Content Routes

**All routes require Bearer auth header with a valid token from a user record.**

- GET `/messages[/:id]`
  - Payload:
    - Optional: an `id` param on the route to specify a record to find.
  - On success, returns `200` and an array of all the messages in the database, or the message specified in the `id` param.
- POST `/messages`
  - Payload:
    - JSON body with a `body` property.
  - On success, returns `201` and the created message in the database.
- PUT `/messages/:id`
  - Payload:
    - JSON body with a `body` property.
    - An `id` param on the route to specify a record to update.
  - On success, returns `200` and the updated message in the database.
- DELETE `/messages/:id`
  - Payload:
    - An `id` param on the route to specify a record to delete.
  - On success, returns `204` status.

## Schemas

These are the "general-purpose" SQL schemas for our databases.

### `message` schema

```js
{
    author: STRING, // Required
    timestamp: INTEGER, // Required 
    body: STRING, // Required
    length: INTEGER, // Required and auto populated
}
```

### `user` schema

```js
{
    displayName: STRING, // Required
    handle: STRING, // Required and must be unique
    password: STRING, // Required
    role: ENUMERATED, // Required, roles include 'user' and 'admin'. Default role is 'user'
    token: VIRTUAL, // Token generated upon signup allows for authentication upon HTTP requests
}
```
