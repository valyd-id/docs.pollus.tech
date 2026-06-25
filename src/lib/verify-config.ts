// Valyd Verify API config (environment-driven; see api-config.ts + .env.example)
const env = import.meta.env;

const VERIFY_BASE_URL = env.VITE_VERIFY_BASE_URL ?? "https://verify.pollus.tech";

export const VERIFY_CONFIG = {
  API_BASE_URL: VERIFY_BASE_URL,
  CONSOLE_URL: env.VITE_VERIFY_CONSOLE_URL ?? `${VERIFY_BASE_URL}/dashboard`,
  // Login with Valyd (TPSSO) lives on the IdP; OAuth clients are registered on
  // the developer portal. Used by the "Managed by Valyd" path.
  IDP_URL: env.VITE_IDP_BASE_URL ?? "https://idp.valyd.id",
  DEV_PORTAL_URL: env.VITE_DEV_PORTAL_URL ?? "https://dev.pollus.tech",
  BRAND_NAME: "Valyd Verify",
} as const;
