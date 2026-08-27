# Edusphere Backend

NestJS + TypeScript + MongoDB (Mongoose). Two modules: `user` (open CRUD) and
`admin` (bcrypt password, JWT login, token-guarded routes).

## Setup

```bash
npm install
cp .env.example .env   # set MONGODB_URI, ADMIN_API_KEY, JWT_SECRET
npm run start:dev
```

The app refuses to boot if `MONGODB_URI`, `ADMIN_API_KEY`, or `JWT_SECRET` is missing.

## API

Global prefix `/api`. Validation is global (`whitelist`, `forbidNonWhitelisted`).

Routes carry the action in the path (`create`, `list`, `get/:id`, `update/:id`,
`delete/:id`) under a singular module prefix.

### User — no auth

| Method | Path                   | Notes                    |
| ------ | ---------------------- | ------------------------ |
| POST   | `/api/user/create`     | create                   |
| GET    | `/api/user/list`       | list, `?page=1&limit=10` |
| GET    | `/api/user/get/:id`    | get one                  |
| PATCH  | `/api/user/update/:id` | partial update           |

### Admin

| Method | Path                    | Auth             |
| ------ | ----------------------- | ---------------- |
| POST   | `/api/admin/create`     | `x-api-key`      |
| POST   | `/api/admin/login`      | none             |
| GET    | `/api/admin/list`       | `Bearer <token>` |
| GET    | `/api/admin/get/:id`    | `Bearer <token>` |
| PATCH  | `/api/admin/update/:id` | `Bearer <token>` |
| DELETE | `/api/admin/delete/:id` | `Bearer <token>` |

Create takes a plain `password` (min 8 chars); it is bcrypt-hashed (10 rounds) before
it is stored, and re-hashed if `password` is sent to PATCH. The hash is `select: false`
and stripped in `toJSON`, so it never appears in a response.

```bash
# 1. create an admin
curl -X POST localhost:3000/api/admin/create -H 'Content-Type: application/json' \
  -H 'x-api-key: change-me' \
  -d '{"name":"Root","email":"root@example.com","password":"secret1234"}'

# 2. log in -> { token, admin }
TOKEN=$(curl -s -X POST localhost:3000/api/admin/login -H 'Content-Type: application/json' \
  -d '{"email":"root@example.com","password":"secret1234"}' | jq -r .token)

# 3. use it
curl localhost:3000/api/admin/list -H "Authorization: Bearer $TOKEN"
```

List response: `{ items, total, page, limit }`. Delete response: `{ deleted: true, id }`.

Errors: `400` validation / bad ObjectId, `401` bad api key, bad credentials, missing or
expired token, `404` unknown id, `409` duplicate email.

Every service method wraps its work in try/catch and funnels the error through
`toHttpError` (`src/common/http-error.ts`): deliberate 4xx pass through unchanged,
duplicate keys become `409`, and anything unexpected is logged with its stack and
returned as a bare `500` so internals never reach the client.

## Middleware

- `LoggerMiddleware` (`src/common/middlewares/`) — all routes, logs `METHOD URL STATUS DURATION`.
- `ApiKeyMiddleware` (`src/common/middlewares/`) — `POST /api/admin/create` only. Constant-time
  compare of `x-api-key` against `ADMIN_API_KEY`, so signup is not open to the world.
- `AuthJwtMiddleware` (`src/controller/admin/`) — list / get / update / delete on
  `/api/admin`. Verifies the `Bearer` JWT, reloads the admin, rejects if deleted or
  `isActive: false`, then attaches it as `req.admin`. Tokens expire after 1 day.

Logger is wired in `src/app.module.ts`; the two admin middlewares in
`src/controller/admin/admin.module.ts`.

## Smoke test

```bash
npm run start:dev   # in one terminal
./smoke.sh          # in another
```

Covers user CRUD, admin signup, login, wrong password, missing/invalid token, password
re-hash on update, and that a deleted admin's token stops working.

## Layout

Modules live under `src/controller/<module>/` and are layered
**controller → service → dao → entity**: the controller only routes, the service holds
the business logic and the try/catch, and every model call goes through the DAO.

```
src/
  common/
    common.dao.ts                 abstract DAO<T>: create/find/update/delete/paginate
    dto/common-list.dto.ts        base for every <module>-list.dto.ts
    http-error.ts                 4xx passthrough, 11000 -> 409, everything else -> 500
    middlewares/                  logger.middleware.ts, api-key.middleware.ts
    utils/mongodb.util.ts
  controller/
    admin/
      admin.controller.ts
      admin.service.ts
      admin.dao.ts                extends DAO<AdminDocument>
      admin.module.ts
      authJwt.middleware.ts
      dto/                        create-admin, update-admin, login-admin, admin-list
      entities/admin.entity.ts
    users/
      users.controller.ts
      users.service.ts
      users.dao.ts
      users.module.ts
      dto/                        create-user, update-user, user-list
      entities/user.entity.ts
  app.module.ts
  main.ts
```
