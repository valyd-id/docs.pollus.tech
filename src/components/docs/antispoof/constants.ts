// Cisive anti-spoof / liveness demo credentials.
//
// These are PUBLIC demo credentials on a dedicated, balance-capped Valyd account
// (owner: Cisive demo). They exist so anyone can run the /antispoof demo end to end.
// The `client_secret` is shown in the server-side snippet only — never used by the
// in-browser demo (which authenticates with the public `app_key` alone).
//
// The demo always targets the PRODUCTION IdP (idp.valyd.id), because that is the
// single environment the Cisive demo account lives in. Override via VITE_* if you
// mirror the account into another environment.

const env = import.meta.env;

// The in-browser liveness demo talks to prod, where the Cisive project exists.
export const ANTISPOOF_IDP_BASE_URL =
  env.VITE_ANTISPOOF_IDP_BASE_URL ?? "https://idp.valyd.id";

// Public app key (Verify project) — safe in the browser, drives the liveness demo.
export const ANTISPOOF_APP_KEY =
  env.VITE_ANTISPOOF_APP_KEY ?? "pvi34NsFwzlb7u7NDWNcIxpCxy3eCBrd5D-Pyzud3TU";

// Liveness-only hosted workflow on the Cisive project.
export const ANTISPOOF_WORKFLOW_ID =
  env.VITE_ANTISPOOF_WORKFLOW_ID ?? "cd2e8501-28d0-45cb-aa4a-c11c998a1cf8";

// OAuth client for the "Login with Valyd" step (server-side code exchange).
export const ANTISPOOF_CLIENT_ID =
  env.VITE_ANTISPOOF_CLIENT_ID ?? "d771fc3c206346c4b07c04997882cb53";

// Shown ONLY in the server snippet. Public demo secret on a capped account.
export const ANTISPOOF_CLIENT_SECRET =
  env.VITE_ANTISPOOF_CLIENT_SECRET ?? "0b3ac7e9f3c146709603f25f8f310c30";

export const ANTISPOOF_SCOPES = ["profile", "verifications"] as const;
