// Valyd Verify API config (environment-driven; see api-config.ts + .env.example)
const env = import.meta.env;

const VERIFY_BASE_URL = env.VITE_VERIFY_BASE_URL ?? "https://verify.pollus.tech";

export const VERIFY_CONFIG = {
  API_BASE_URL: VERIFY_BASE_URL,
  CONSOLE_URL: env.VITE_VERIFY_CONSOLE_URL ?? `${VERIFY_BASE_URL}/dashboard`,
  BRAND_NAME: "Valyd Verify",
} as const;
