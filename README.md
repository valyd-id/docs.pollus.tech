# Valyd Docs (docs.valyd.work)

The Valyd developer documentation site — API reference and integration guides for
**Login with Valyd** (OAuth2 / TPSSO) and **Valyd Verify** (hosted sessions, the
Managed-by-Valyd login flow, standalone checks, and webhooks).

## Tech stack
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Local development
Requires Node.js & npm.

```sh
# install dependencies
npm i

# start the dev server (auto-reload)
npm run dev

# production build
npm run build

# preview the production build
npm run preview
```

## Configuration
Runtime URLs are env-driven (`VITE_*`) so the same build works across environments.
Copy `.env.example` to `.env` and adjust as needed, e.g.:

- `VITE_VERIFY_BASE_URL` — Verify API base (default `https://idp.valyd.work`)
- `VITE_VERIFY_CONSOLE_URL` — Verify console (default `{verify}/dashboard`)

## Structure
- `src/pages/` — top-level pages, incl. `VerifyDocs.tsx` (the Verify docs).
- `src/components/docs/` — the IdP / SSO / OIDC API reference sections.
- `src/components/verify/` — the Verify docs (mode switch + step-by-step sections).
- `src/lib/` — shared config (`verify-config.ts`) and helpers.

## Deployment
Build with `npm run build` and serve the static `dist/` output behind your web server
(nginx/CDN).
