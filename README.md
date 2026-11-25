# FinLit — Financial Literacy Platform

FinLit is a financial-literacy website with educational pages, interactive calculators, account-related pages, and an Express API for storing user profiles and calculation records. The repository contains static HTML/CSS/JavaScript assets and a Node.js server.

> **Security status: demonstration only.** The current server stores passwords in plaintext JSON and exposes user and calculation endpoints without authentication or authorization. Do **not** deploy it publicly, enter real credentials, or store personal information until these issues are fixed.

## Repository layout

- `FINLIT.html` — main web entry point.
- `CALCULATORS/` — financial calculator pages and assets.
- `css/`, `js/`, `images/` — frontend resources.
- `server.js` — Express application and JSON-backed API.
- `data/` — local JSON storage (not a suitable production database).
- `vercel.json` — deployment configuration; deployment is not verified here.

## Run locally

Requires Node.js and npm.

```bash
npm ci
npm start
```

The server defaults to `http://localhost:3000` (override with `PORT`). The `dev` script uses nodemon, although `server.js` currently starts listening only when `NODE_ENV` is not `production` and `VERCEL` is unset.

## API overview

The server defines:
- `POST /api/users/register` and `POST /api/users/login`
- `GET /api/users`
- `POST /api/calculations/save`
- `GET /api/calculations/:userId`
- `DELETE /api/calculations/:id`

These endpoints are **not production-safe**. Their presence does not imply secure account management.

## Known limitations and security priorities

1. Replace plaintext password storage with a modern password hash, migration strategy, and appropriate reset flows.
2. Introduce session or token authentication and enforce ownership checks on every user/calculation operation; remove public user listing.
3. Validate and constrain incoming data, add rate limiting, and restrict CORS to intended origins.
4. Move persisted records to a managed database and remove any real user data from tracked files.
5. Add tests for authorization and invalid requests before deployment.

No build, test, or deployment was executed as part of this documentation update.

## Attribution

The package manifest attributes the project to the **FinLit2025 Team**. Contributions should preserve the original authorship and history.
