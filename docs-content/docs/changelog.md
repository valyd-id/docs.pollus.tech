> Source: https://{{DOCS_BASE_URL}}/docs/changelog
> Part of: Valyd ID API documentation — static copy generated for AI agents
> Generated from repo component: ChangelogSection.tsx

# Changelog

## Agent Quick-Start
- Source URL: https://{{DOCS_BASE_URL}}/docs/changelog
- Credentials / env vars needed: none
- Files an integrator edits: none — reference only
- Estimated steps: 0 (read to confirm which SDK version introduces the helper you need)
- Can complete without human input: YES — this is a read-only version history.
- Prerequisites: none

This page tracks releases of the Valyd SDK. Tags: **Added** (new functionality), **Docs** (documentation-only changes), **Breaking (docs)** (a documented pattern was removed or changed).

---

## v0.2.0 — Login sessions for TPSSO

- **Added:** `createLoginSession()` and `verifyLoginSession()` helpers.
- **Docs:** Clarified that the callback `state` is Valyd's session id, not your authorize state.
- **Breaking (docs):** Removed the state-equality CSRF pattern — use `verifyLoginSession` instead.

---

## v0.1.0 — Initial release

- **Added:** `ValydClient` with `getAuthorizationUrl`, `parseCallback`, `exchangeCode`, `refreshToken`.
- **Added:** Resource helpers: `getUserInfo`, `getLicenses`, `getCprLicense`, `getDoctorLicense`, `getVerifications`.
