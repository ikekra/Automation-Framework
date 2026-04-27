# Deployment Guide

This project has 3 deployable parts:

- `backend`: Node.js API + MongoDB
- `frontend`: Vite React app
- `landing`: Next.js marketing/auth site

Recommended hosting split:

- `backend` -> Render or Railway
- `frontend` -> Netlify or Vercel
- `landing` -> Vercel
- `database` -> MongoDB Atlas

## 1. Deploy the backend

Runtime:

- Node.js 20+

Start command:

```bash
npm start
```

Build command:

```bash
npm install
```

Required environment variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=<your_mongodb_atlas_uri>
JWT_ACCESS_SECRET=<long_random_secret>
JWT_REFRESH_SECRET=<long_random_secret>
CORS_ORIGIN=https://app.example.com,https://www.example.com
APP_BASE_URL=https://www.example.com
OPENAI_API_KEY=<optional_if_using_ai_features>
OPENAI_MODEL=gpt-4.1-mini
MOCK_AI=false
MOCK_EMAIL=false
SMTP_HOST=<your_smtp_host>
SMTP_PORT=587
SMTP_USER=<your_smtp_user>
SMTP_PASS=<your_smtp_password>
SMTP_SECURE=false
EMAIL_FROM=AutoForge <no-reply@example.com>
```

Notes:

- `APP_BASE_URL` should point to the deployed `landing` app because email verification links open the Next.js site at `/verify-email`.
- `CORS_ORIGIN` must include every browser origin that calls the API. In production that usually means both the Vite app URL and the landing site URL.
- If you do not want AI analysis yet, set `MOCK_AI=true` and leave `OPENAI_API_KEY` empty.
- If you do not want real emails yet, set `MOCK_EMAIL=true`.

Health check:

- `GET /api/v1/health`

## 2. Deploy the frontend

Platform:

- Static hosting is enough.

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Environment variables:

```env
VITE_API_BASE_URL=https://api.example.com
```

Notes:

- This app talks directly to the backend API.
- Make sure its deployed URL is included in backend `CORS_ORIGIN`.

## 3. Deploy the landing site

Platform:

- Vercel is the easiest fit for this Next.js app.

Build command:

```bash
npm run build
```

Environment variables:

```env
NEXTAUTH_URL=https://www.example.com
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_FRONTEND_APP_URL=https://app.example.com
AUTH_SECRET=<long_random_secret>
AUTH_GITHUB_ID=<github_oauth_client_id>
AUTH_GITHUB_SECRET=<github_oauth_client_secret>
AUTH_GOOGLE_ID=<google_oauth_client_id>
AUTH_GOOGLE_SECRET=<google_oauth_client_secret>
AUTH_ADMIN_EMAILS=you@example.com
```

Notes:

- `NEXTAUTH_URL` must be the public URL of the landing site.
- `NEXT_PUBLIC_FRONTEND_APP_URL` is where the main Vite app lives.
- If you use GitHub and Google sign-in, add their callback URLs using the landing domain.

Common callback URLs:

- GitHub: `https://www.example.com/api/auth/callback/github`
- Google: `https://www.example.com/api/auth/callback/google`

## 4. Suggested production URL layout

Example:

- `backend`: `https://api.example.com`
- `frontend`: `https://app.example.com`
- `landing`: `https://www.example.com`

With that layout, use:

- backend `CORS_ORIGIN=https://app.example.com,https://www.example.com`
- backend `APP_BASE_URL=https://www.example.com`
- frontend `VITE_API_BASE_URL=https://api.example.com`
- landing `NEXT_PUBLIC_API_BASE_URL=https://api.example.com`
- landing `NEXT_PUBLIC_FRONTEND_APP_URL=https://app.example.com`
- landing `NEXTAUTH_URL=https://www.example.com`

## 5. Pre-launch checklist

- Create a MongoDB Atlas database and whitelist your hosting provider.
- Generate new production secrets for JWT and NextAuth.
- Configure SMTP if email verification and OTP login should work live.
- Rotate any local secrets that were used during development.
- Confirm backend `CORS_ORIGIN` includes all production browser origins.
- Test register, email verification, login, refresh token flow, and logout.
- Test OAuth login from both GitHub and Google after adding callback URLs.

## 6. Verified locally

These checks passed from this workspace on April 28, 2026:

- `frontend`: `npm run build`
- `landing`: `npm run build`
- `backend`: `npm test`
