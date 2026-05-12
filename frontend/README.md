# Frontend

This is the main AutoForge product console built with Vite and React.

## What It Does

- JWT-based login against the Express backend
- framework builder UI
- backend-backed framework history and downloads
- web app testing dashboard
- profile and 2FA management
- admin-only internal self-test view

## Local Setup

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run:

```bash
npm install
npm run dev
```

The app expects the backend to be running on `http://localhost:5000` unless you override `VITE_API_BASE_URL`.

## Build

```bash
npm run build
```

See the root [README](../README.md) for the full multi-app setup.
