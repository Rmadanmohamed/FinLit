# FinLit — Financial Literacy Platform

> **Phase 2 security repair branch (not production-ready):** The API now hashes new passwords with salted scrypt, upgrades a legacy plaintext record only after a successful login, issues one-hour signed bearer tokens, restricts the user directory and enforces calculation ownership. The browser account demo still uses independent localStorage authentication and must not be used with real credentials. Existing tracked data and repository history are not remediated by this branch. Do not expose the application publicly.

For API development, set `FINLIT_DATA_DIR` to an empty private directory outside the repository. Set `FINLIT_AUTH_SECRET` to a securely generated value of at least 32 bytes in production (local runs generate an ephemeral key if unset). New storage starts empty; existing records are not bulk-migrated. Use the returned `token` as `Authorization: Bearer <token>` on calculation endpoints; the user directory denies access because no administrative role exists. Tokens expire after one hour; revocation, rate limiting, durable storage and frontend integration remain outstanding. Run the isolated integration suite with `node --test tests/security.test.js` after `npm ci` using a supported Node.js release with built-in fetch and node:test (e.g. Node 22). Tests have not yet been executed.

The original README below describes the pre-repair implementation; its warnings remain applicable to the browser demo and default branch.


## Overview and problem statement

FinLit is an educational web application designed to help users explore digital financial literacy, inclusion, budgeting, loans and savings. It combines educational resources, interactive calculators, assessments, account-related pages and a lightweight Express API.

> **Security status: local demonstration only.** The server stores passwords in plaintext JSON and provides user/calculation endpoints without authentication or authorization. Do not deploy publicly or enter real credentials, financial records or personal information. The source has not been changed as part of this documentation update.

## Features

- Budget, savings and loan calculator pages with interactive charts.
- Financial education and digital/financial/inclusion assessment workflows.
- Client-side demonstration account state using localStorage.
- Express API and file-backed storage for user and calculation records.

## Technology stack

| Dependency | Manifest range | Resolved npm lock version |
| --- | --- | --- |
| Express | ^4.18.2 | 4.22.2 |
| cors | ^2.8.5 | 2.8.6 |
| body-parser | ^1.20.2 | 1.20.5 |
| nodemon (development) | ^2.0.22 | 2.0.22 |

HTML, CSS and browser JavaScript implement the frontend. The home page uses Chart.js (both an unversioned CDN reference and 3.9.1), chartjs-plugin-datalabels 2.0.0, GSAP 3.11.4, Font Awesome 6.4.0 and Google Fonts. Other pages use differing CDN versions. See [package.json](package.json) and [package-lock.json](package-lock.json).

## Architecture and structure

```mermaid
flowchart LR
    A[HTML and JavaScript UI] --> B[Browser calculators and localStorage]
    A --> C[Express API]
    C --> D[Local JSON records]
```

- [FINLIT.html](FINLIT.html) — home page.
- [CALCULATORS/](CALCULATORS/) — budget, savings and loan tools.
- [information.html](information.html), [account.html](account.html) — educational and account pages.
- [css/](css/), [js/](js/), [images/](images/) — frontend assets.
- [server.js](server.js) — Express server and API.
- `data/` — JSON-backed storage (not a production database).
- [FinLit2025_Diagrams.md](FinLit2025_Diagrams.md) — design diagrams; planned entities do not necessarily correspond to implemented storage.
- [vercel.json](vercel.json) — deployment configuration (not a verified deployment).

## Prerequisites and setup

Install a supported Node.js LTS release and npm; no exact Node version is pinned. A modern browser and internet access for CDN resources are required. Run only in a private local environment with synthetic data.

```bash
git clone https://github.com/Rmadanmohamed/FinLit.git
cd FinLit
npm ci
npm start
```

Visit http://localhost:3000. The manifest also includes `npm run dev` (nodemon) and `npm run build` (a no-op message; there is no compilation step).

## Environment variables

| Variable | Required | Purpose / safe value |
| --- | --- | --- |
| PORT | No | Local HTTP port; defaults to `3000` |
| NODE_ENV | No | Use `development` or leave unset for local startup; `production` disables the listener |
| VERCEL | No | Platform flag; leave unset locally. If present, storage moves to `/tmp/data` and the standalone listener is skipped |

No secrets are necessary for local demonstration. The application stores JSON on disk and has no database initialization step. Avoid using or distributing personal data.

## Usage and API

Open the home page and choose [Budget](CALCULATORS/budget.html), [Savings](CALCULATORS/savings.html) or [Loan](CALCULATORS/loan.html). Enter fictional values to explore estimates; outputs are educational, not personalized financial advice. Assessment code generates scores and recommendations from form responses.

The server defines the following routes: registration/login (POST), user listing (GET), calculation save (POST), user calculation retrieval (GET), and calculation deletion (DELETE). These endpoints lack production-safe access controls and must not be exposed publicly. Frontend localStorage state and server records should not be assumed to be securely synchronized.

## Testing and validation

No automated test suite is included. For local testing, use synthetic inputs to check calculator boundary values, page navigation, and assessment output. Add authorization, input validation and calculation unit tests before deployment. No build, test or deployment was executed during this audit.

## Screenshots and demo

No verified public demo or standalone interface screenshot was identified. The committed financial charts are illustrative content; the [design diagrams](FinLit2025_Diagrams.md) are available as documentation.

## Limitations and next steps

1. Replace plaintext password storage with secure password hashing and an appropriate migration/reset strategy.
2. Require authenticated sessions and enforce ownership checks on all user and calculation operations.
3. Restrict CORS, validate inputs, rate-limit requests and prevent exposure of data files through static serving.
4. Replace local JSON persistence with a managed database; serverless temporary storage is not durable.
5. Verify calculator formulas and browser accessibility before release.

No trained ML model or dataset evaluation applies.

## Attribution and license

The manifest credits the **FinLit2025 Team**. Preserve original authorship and contributor history. The package manifest declares MIT, but a standalone license file was not found in this repository; verify licensing before redistribution.

Portfolio contact: [Ramadan Mohamed Hassan](https://ramadan-ai-portfolio.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/ramadan-mohamed-89085a366/) · [GitHub](https://github.com/Rmadanmohamed)
