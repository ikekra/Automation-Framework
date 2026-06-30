# Landing

This is the Next.js marketing surface for AutoForge.

## What It Does

- public marketing pages
- contact and demo pages
- redirect and handoff routes into the Vite product app
- branded entry pages for sign in and account creation

## Local Setup

Create `landing/.env`:

```env
NEXT_PUBLIC_FRONTEND_APP_URL=http://localhost:5173
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
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
