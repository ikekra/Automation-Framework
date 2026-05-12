# Landing

This is the Next.js marketing and social-auth surface for AutoForge.

## What It Does

- public marketing pages
- contact and demo pages
- NextAuth sign-in with GitHub and Google
- protected dashboard for signed-in social users
- links into the Vite product app

## Local Setup

Create `landing/.env`:

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

Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

See the root [README](../README.md) for the full project setup and architecture notes.
