// Search index for the docs command palette (#5).
// Each entry maps to a section page (slug) and optional in-page anchor.
// `keywords` add synonyms / body terms so jargon is findable even when it
// isn't in the visible title (e.g. "age verification" -> zkp).

export interface DocsSearchEntry {
  title: string;
  group: string;
  slug: string;
  anchor?: string;
  keywords?: string[];
}

export const DOCS_SEARCH_INDEX: DocsSearchEntry[] = [
  // Introduction
  {
    title: "Introduction",
    group: "Getting started",
    slug: "overview",
    keywords: ["overview", "intro", "valyd api", "identity", "getting started", "oauth", "access_token", "refresh_token", "client_id", "client_secret"],
  },

  // Quick start
  { title: "Quick start", group: "Quick start", slug: "quick-start", keywords: ["sdk", "begin", "setup"] },
  { title: "Installation", group: "Quick start", slug: "quick-start", anchor: "quick-install", keywords: ["npm", "install", "valyd-idp-sdk", "package"] },
  { title: "Login with Valyd", group: "Quick start", slug: "quick-start", anchor: "quick-start", keywords: ["sign in", "login button", "authorize"] },
  { title: "Flow at a glance", group: "Quick start", slug: "quick-start", anchor: "quick-flow", keywords: ["overview", "diagram", "steps"] },
  { title: "Environment setup", group: "Quick start", slug: "quick-start", anchor: "quick-env", keywords: ["env", "variables", ".env", "config"] },

  // Login sessions
  {
    title: "Login sessions (CSRF)",
    group: "Login sessions",
    slug: "login-sessions",
    keywords: ["csrf", "createLoginSession", "verifyLoginSession", "marker", "state", "security", "valyd_login", "cookie", "samesite", "lax", "httponly"],
  },

  // OAuth / TPSSO
  { title: "OAuth / TPSSO flow", group: "OAuth / TPSSO flow", slug: "authentication", keywords: ["oauth2", "tpsso", "authorization code", "sso"] },
  { title: "Authorization URL", group: "OAuth / TPSSO flow", slug: "authentication", anchor: "auth-url", keywords: ["authorize", "redirect_url", "client_id", "scope param", "authorization url"] },
  { title: "Flow steps", group: "OAuth / TPSSO flow", slug: "authentication", anchor: "oauth-flow", keywords: ["authorization_code", "exchange", "steps", "grant_type", "code"] },
  { title: "Callback handling", group: "OAuth / TPSSO flow", slug: "authentication", anchor: "callback-handling", keywords: ["callback", "redirect", "code", "token exchange", "exchangeCode", "access_token"] },

  // Scopes
  { title: "Scopes", group: "Scopes", slug: "scopes", keywords: ["permissions", "consent", "oauth scopes"] },
  { title: "profile", group: "Scopes", slug: "scopes", anchor: "scope-profile", keywords: ["userinfo", "name", "email", "id_verified", "sub", "anon_id", "full_name", "created_at"] },
  { title: "verifications", group: "Scopes", slug: "scopes", anchor: "scope-verifications", keywords: ["id_verified", "face_match", "verification", "last_checked"] },
  { title: "zkp", group: "Scopes", slug: "scopes", anchor: "scope-zkp", keywords: ["zero knowledge proof", "age verification", "is_18", "is_21", "is_25"] },
  { title: "mcp", group: "Scopes", slug: "scopes", anchor: "scope-mcp", keywords: ["model context protocol", "ai agent", "tools"] },

  // API reference
  { title: "API reference", group: "API reference", slug: "endpoints", keywords: ["endpoints", "api", "rest"] },
  { title: "POST /token", group: "API reference", slug: "endpoints", anchor: "endpoint-token", keywords: ["access_token", "exchange code", "grant", "grant_type", "authorization_code", "expires_in", "refresh_token"] },
  { title: "GET /userinfo", group: "API reference", slug: "endpoints", anchor: "endpoint-userinfo", keywords: ["profile", "claims", "user info", "bearer", "sub", "email", "anon_id", "created_at", "id_verified", "avatar_url"] },
  { title: "GET /licenses", group: "API reference", slug: "endpoints", anchor: "endpoint-licenses", keywords: ["doctor license", "nurse", "practitioner", "cpr_certification"] },
  { title: "GET /verifications", group: "API reference", slug: "endpoints", anchor: "endpoint-verifications", keywords: ["face_match", "id_verified", "verification status", "last_checked"] },
  { title: "POST /refresh", group: "API reference", slug: "endpoints", anchor: "endpoint-refresh", keywords: ["refresh_token", "renew", "access_token", "expires_in"] },

  // Errors
  {
    title: "Errors & troubleshooting",
    group: "Errors",
    slug: "errors",
    keywords: ["error codes", "400 bad request", "401", "401 unauthorized", "403", "403 forbidden", "insufficient_scope", "invalid_client", "invalid_grant", "invalid_request", "invalid_token", "access_denied", "unauthorized", "forbidden", "troubleshooting"],
  },

  // Changelog
  { title: "Changelog", group: "Changelog", slug: "changelog", keywords: ["releases", "versions", "updates", "sdk v0.2"] },

  // Dev portal setup
  { title: "Dev portal setup", group: "Dev portal setup", slug: "create-project", keywords: ["developer portal", "project", "console"] },
  { title: "Create a project", group: "Dev portal setup", slug: "create-project", anchor: "create-project", keywords: ["new project", "portal"] },
  { title: "Get credentials", group: "Dev portal setup", slug: "create-project", anchor: "get-credentials", keywords: ["client_id", "client_secret", "api keys", "credentials", "sk_live", "secret"] },

  // OIDC
  { title: "OIDC Integration", group: "OIDC Integration", slug: "oidc", keywords: ["openid connect", "oidc", "identity provider"] },
  { title: "Introduction", group: "OIDC Integration", slug: "oidc", anchor: "oidc-intro", keywords: ["openid connect", "overview"] },
  { title: "Prerequisites", group: "OIDC Integration", slug: "oidc", anchor: "oidc-prerequisites", keywords: ["requirements", "before you start"] },
  { title: "Client Registration", group: "OIDC Integration", slug: "oidc", anchor: "oidc-registration", keywords: ["register client", "client_id", "redirect uri"] },
  { title: "Discovery Endpoint", group: "OIDC Integration", slug: "oidc", anchor: "oidc-discovery", keywords: [".well-known", "openid-configuration", "discovery"] },
  { title: "Manual Configuration", group: "OIDC Integration", slug: "oidc", anchor: "oidc-manual-config", keywords: ["manual setup", "endpoints", "config"] },
  { title: "Mendix Integration", group: "OIDC Integration", slug: "oidc", anchor: "oidc-mendix", keywords: ["mendix", "low code"] },
  { title: "User Mapping", group: "OIDC Integration", slug: "oidc", anchor: "oidc-user-mapping", keywords: ["claims", "attribute mapping", "user attributes"] },
  { title: "Testing Flow", group: "OIDC Integration", slug: "oidc", anchor: "oidc-testing", keywords: ["test", "verify", "debug"] },
  { title: "Troubleshooting", group: "OIDC Integration", slug: "oidc", anchor: "oidc-troubleshooting", keywords: ["errors", "issues", "fixes"] },
  { title: "Security Best Practices", group: "OIDC Integration", slug: "oidc", anchor: "oidc-security", keywords: ["security", "pkce", "best practices"] },
  { title: "Example Config", group: "OIDC Integration", slug: "oidc", anchor: "oidc-example-config", keywords: ["sample", "example", "configuration"] },
];
