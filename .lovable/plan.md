# Plan: Hosted Verification docs (License-only + KYC+License)

Update `docs.valyd.id/verify` so the Hosted flow is the centerpiece, with both hosted products (License Verification and KYC + License) documented as parallel offerings that share one integration.

## Scope

Rewrite of the Hosted section + supporting nav entries. No backend changes, no logic changes outside the `/verify` docs route. Other Verify sections (Intro, Quickstart, Console, Modes, Standalone, Statuses, API Reference) stay; only the Hosted page is expanded, and Webhooks / Statuses / API Reference get small targeted edits so they stay consistent.

## New page structure (Hosted Verification)

The single Hosted page becomes a guide with these sub-sections (each an `<h2>`/`<h3>` block with anchor IDs so the sidebar can jump to them):

1. **Overview** — what hosted verification is: create session → redirect → Valyd-hosted capture → signed webhook + decision API. "No UI to build, no PII handled by you."
2. **The two hosted products**
   - **License Verification (license only)** — workflow services `[credential]`. Hosted UI: State → License type → first/last name + license number → submit. Returns verified / not-found against the official state registry. Use when you only need to confirm a professional license.
   - **KYC + License** — workflow services `[id_verification, liveness, face_match, credential]`. Hosted UI: scan ID (front/back) → selfie (OCR + passive liveness + 1:1 face match) → State + License type + license number. Name is auto-filled from the verified ID — user does NOT type it. A license belonging to a different person is rejected. Use when you need to prove the license belongs to the real, present person.
   - Callout: "Integration code is identical for both products — only `workflow_id` differs." Workflow setup is in console (`idp.valyd.work/dashboard → Workflows`), either via "License Verification" / "KYC + License" presets or via API.
3. **Step-by-step integration** (shared)
   - Step 1 — Create a session (server-side): `POST /api/v2/session` with `X-API-Key`, body `{ workflow_id, redirect_url, callback, vendor_data }`. Response `{ session_id, session_token, url, features, expires_at, redirect_url }`. Copy-paste curl + Node (fetch) examples.
   - Step 2 — Redirect the user's browser to `data.url`. Valyd hosts the full capture UI; the steps differ automatically based on workflow services.
   - Step 3 — Redirect-back to `redirect_url?session_id=…&status=…`. Treat the `status` querystring as a hint only.
   - Step 4 — Fetch the authoritative result via the decision API (link to next section).
4. **Webhooks**
   - Headers: `X-Valyd-Timestamp`, `X-Valyd-Event-Id`, `X-Valyd-Signature`.
   - Verify: `expected = HMAC_SHA256(`${ts}.${rawBody}`, <webhook signing secret>)`, lowercase hex, constant-time compare; reject on mismatch. Must read raw body before parsing.
   - Body: `{ event_id, type:"verification.<status>", session_id, status, vendor_data, decision, occurred_at }`.
   - Webhook is a notification — always call the decision endpoint for full data.
   - Endpoint must return 2xx fast; non-2xx is retried with backoff.
   - Signing secret comes from the console (Webhooks).
   - Node/Express example reading the raw body and verifying the signature.
5. **Reading the decision**
   - `GET /api/v2/session/{session_id}/decision` with `X-API-Key`.
   - Response shape including `checks[]` with types `id_verification | liveness | face_match | credential`.
   - Credential check: `data.match` + `data.license` (registry record); `error` on failure (e.g. license belongs to a different name).
   - KYC checks: `id_verification.data.fields` (name, dob, document number, …) and `data.portrait`.
   - APPROVED definition: every required check passed; for KYC+License that's ID verified AND live AND selfie matches the ID AND the license belongs to that verified person.
   - Example response JSON for both products (license-only and KYC+License) so the difference in `checks[]` is obvious.
6. **Statuses reference**
   - Session: `NOT_STARTED → IN_PROGRESS → (IN_REVIEW) → APPROVED | DECLINED`, plus `ABANDONED`, `EXPIRED`.
   - Check: `passed | failed | review`.
   - Cross-link to the existing dedicated Statuses page.
7. **API reference (hosted)** — compact table of endpoints used here:
   - `POST /api/v2/session`, `GET /api/v2/session/{id}`, `GET /api/v2/session/{id}/decision`, `GET /api/v2/session`.
   - Note that Workflows are managed in the console; mention optional `POST/GET /api/v2/workflows`.
   - Link to the full API Reference section for everything else.

A persistent callout at the top of the page: `X-API-Key` must stay server-side, never in the browser. All responses use the `{ success, data, error: { code, message } }` envelope.

## Files to change

- **`src/components/verify/sections/HostedSection.tsx`** — full rewrite to the structure above. Use existing `CodeBlock` component for all curl/JSON/Node samples. Use `VERIFY_CONFIG.API_BASE_URL` for the base URL.
- **`src/components/verify/VerifySidebar.tsx`** — under "Hosted Verification", add nested sub-links so users can jump to: Overview, Products, Integration steps, Webhooks, Decision, Statuses, API. Implemented as additional entries in the `guides` array (IDs: `hosted`, `hosted-products`, `hosted-steps`, `hosted-webhooks`, `hosted-decision`, `hosted-statuses`, `hosted-api`).
- **`src/pages/VerifyDocs.tsx`** — extend `SECTION_IDS` with the new anchor IDs so scroll-spy highlights the right sub-section.
- **`src/components/verify/sections/WebhooksSection.tsx`** — minor: add a one-line cross-link from the top of the existing Webhooks page back to the Hosted guide (since hosted is the primary consumer). No behavior change.
- **`src/components/verify/sections/ApiReferenceSection.tsx`** — minor: ensure the Sessions / Decision rows match the endpoint list referenced from the Hosted page (no removals; just confirm wording).

No new files required; no changes to `src/lib/verify-config.ts`, routing, or the Valyd ID docs.

## Code samples to include

- `curl` and Node `fetch` for `POST /api/v2/session`, shown once with `workflow_id` set from an env var, with a note: "set `VALYD_WORKFLOW_ID` to your License-only OR KYC+License workflow."
- `curl` for `GET /api/v2/session/{id}/decision`.
- Two example decision JSON payloads (License-only — one `credential` check; KYC+License — four checks).
- Node/Express webhook handler using `express.raw({ type: "application/json" })` and `crypto.timingSafeEqual` (matches the snippet already shown in `WebhooksSection.tsx` so style stays consistent).

## Out of scope

- No changes to the Standalone APIs section, the Console section, or the Valyd ID docs.
- No new routes, no backend/edge function work, no auth changes.
- No visual redesign — reuse current typography, `CodeBlock`, callout patterns, and color tokens.
