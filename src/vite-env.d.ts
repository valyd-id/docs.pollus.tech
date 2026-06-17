/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** IdP origin, e.g. https://idp.pollus.tech */
  readonly VITE_IDP_BASE_URL?: string;
  /** TPSSO API base; defaults to `${VITE_IDP_BASE_URL}/api/auth/tpsso` */
  readonly VITE_API_BASE_URL?: string;
  /** Developer portal URL, e.g. https://dev.pollus.tech */
  readonly VITE_DEV_PORTAL_URL?: string;
  /** This docs site's own origin, e.g. https://docs.pollus.tech */
  readonly VITE_DOCS_BASE_URL?: string;
  /** Valyd Verify origin, e.g. https://verify.pollus.tech */
  readonly VITE_VERIFY_BASE_URL?: string;
  /** Verify console URL; defaults to `${VITE_VERIFY_BASE_URL}/dashboard` */
  readonly VITE_VERIFY_CONSOLE_URL?: string;
  /** Sandbox IdP origin; defaults to VITE_IDP_BASE_URL */
  readonly VITE_SANDBOX_BASE_URL?: string;
  readonly VITE_SANDBOX_CLIENT_ID?: string;
  readonly VITE_SANDBOX_CLIENT_SECRET?: string;
  readonly VITE_BRAND_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
