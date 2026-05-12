# AutoForge Automation Framework

AutoForge is a multi-app project with:

- `backend`: Express + MongoDB API for auth, framework generation, web app analysis, queued jobs, and internal diagnostics
- `frontend`: Vite + React product console using JWT auth against the backend
- `landing`: Next.js marketing site with separate social sign-in flow via NextAuth

## Current Architecture

### Backend

The backend exposes:

- JWT auth with refresh rotation, email verification, OTP login, and optional 2FA
- Framework generation with downloadable ZIP bundles
- Account-backed framework history with list, delete, and authenticated download access
- Web app analysis using Playwright with SSRF-safe URL validation
- Internal self-test diagnostics for database, auth, routes, OpenAI, and framework simulation

### Frontend

The Vite app is the main product workspace. It uses:

- `VITE_API_BASE_URL` to talk to the backend
- Bearer access tokens plus cookie-based refresh tokens
- Real backend framework history, not local-only browser persistence

### Landing

The Next.js app is a separate portfolio/marketing surface. It uses:

- NextAuth with GitHub and Google
- protected `/dashboard`
- links into the Vite app via `NEXT_PUBLIC_FRONTEND_APP_URL`

## Run Locally

Open three terminals.

### 1. Backend

Create `backend/.env` with at least:

```env
MONGO_URI=mongodb://127.0.0.1:27017/autoforge
JWT_ACCESS_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me
PORT=5000
CORS_ORIGIN=http://localhost:5173
APP_BASE_URL=http://localhost:5000
MOCK_AI=true
MOCK_EMAIL=true
```

Optional backend env vars already supported in code include:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE`
- `EMAIL_FROM`
- `FRAMEWORK_DOWNLOAD_TTL_MINUTES`
- `TEST_ANALYZE_TIMEOUT_MS`
- `TEST_ANALYZE_QUEUE_CONCURRENCY`

Start it:

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start it:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### 3. Landing

Create `landing/.env` with the values you need:

```env
NEXT_PUBLIC_FRONTEND_APP_URL=http://localhost:5173
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

AUTH_SECRET=replace-me
AUTH_GITHUB_ID=replace-me
AUTH_GITHUB_SECRET=replace-me
AUTH_GOOGLE_ID=replace-me
AUTH_GOOGLE_SECRET=replace-me

AUTH_ADMIN_EMAILS=you@example.com
```

Start it:

```bash
cd landing
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

### Backend

```bash
npm test
npm run dev
```

### Frontend

```bash
npm run dev
npm run build
```

### Landing

```bash
npm run dev
npm run build
```

## What Changed Recently

The framework generation flow now:

- stores generated frameworks per authenticated user
- exposes backend history and delete endpoints
- issues authenticated download access on demand
- drives dashboard/history UI from backend state instead of local-only history

## Recommended Next Step

The next bigger concept is auth/product consolidation:

- decide whether `landing` should stay marketing-only
- or merge the product experience into a single auth model

That is the main remaining architecture split in the project.
