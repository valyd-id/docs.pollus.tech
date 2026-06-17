// Centralized API Configuration
//
// All environment-specific URLs are read from Vite build-time env vars
// (import.meta.env.VITE_*). Each server keeps its own `.env` (see `.env.example`)
// and runs `npm run build` / `bun run build` there:
//   - dev      docs.pollus.tech   -> *.pollus.tech
//   - testing  docs.pollus.online -> *.pollus.online
//   - prod     docs.valyd.id      -> *.valyd.id
// The defaults below are the development (.pollus.tech) values, so a build with
// no `.env` present still produces a working dev site.

const env = import.meta.env;

const IDP_BASE_URL = env.VITE_IDP_BASE_URL ?? "https://idp.pollus.tech";
const DOCS_BASE_URL = env.VITE_DOCS_BASE_URL ?? "https://docs.pollus.tech";

export const API_CONFIG = {
  // Base URLs
  IDP_BASE_URL,
  API_BASE_URL: env.VITE_API_BASE_URL ?? `${IDP_BASE_URL}/api/auth/tpsso`,
  DEV_PORTAL_URL: env.VITE_DEV_PORTAL_URL ?? "https://dev.pollus.tech",
  DOCS_BASE_URL,

  // Brand name
  BRAND_NAME: env.VITE_BRAND_NAME ?? "Valyd",
  BRAND_LOGO: "Valyd ID",
} as const;

// Helper function to get authorization URL
export const getAuthorizationUrl = (clientId: string, redirectUrl: string, scopes: string[]) => {
  const scopeString = encodeURIComponent(scopes.join(" "));
  return `${API_CONFIG.IDP_BASE_URL}/auth?client_id=${clientId}&redirect_url=${redirectUrl}&scope=${scopeString}`;
};
