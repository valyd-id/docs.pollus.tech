import { API_CONFIG } from "@/lib/api-config";
import { CodeBlock } from "../CodeBlock";
import { LanguageTabs } from "../LanguageTabs";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Key, 
  Server, 
  Users, 
  TestTube, 
  Wrench,
  Lock,
  FileJson,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export const OIDCSection = () => {
  const discoveryJson = `{
  "issuer": "${API_CONFIG.IDP_BASE_URL}",
  "authorization_endpoint": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/authorize",
  "token_endpoint": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/token",
  "userinfo_endpoint": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/userinfo",
  "jwks_uri": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/jwks.json",
  "response_types_supported": ["code", "id_token", "token id_token"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported": ["openid", "profile", "email", "verifications", "zkp"],
  "token_endpoint_auth_methods_supported": ["client_secret_post", "client_secret_basic"],
  "claims_supported": [
    "sub", "iss", "aud", "exp", "iat", "name", "email",
    "preferred_username", "first_name", "last_name"
  ]
}`;

  const userinfoResponse = `{
  "sub": "user_12345",
  "preferred_username": "john.doe",
  "email": "john.doe@example.com",
  "email_verified": true,
  "name": "John Doe",
  "first_name": "John",
  "last_name": "Doe",
  "picture": "https://example.com/avatar.jpg"
}`;

  const mendixConfigJson = `{
  "sso": {
    "enabled": true,
    "provider": "openid_connect",
    "config": {
      "issuer": "${API_CONFIG.IDP_BASE_URL}",
      "client_id": "mendix-app-123",
      "client_secret": "your-secret-here",
      "authorization_endpoint": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/authorize",
      "token_endpoint": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/token",
      "userinfo_endpoint": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/userinfo",
      "jwks_uri": "${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/jwks.json",
      "scopes": ["openid", "email", "profile"],
      "redirect_uri": "https://your-app.mendixcloud.com/oidc/callback",
      "token_endpoint_auth_method": "client_secret_post",
      "id_token_signing_alg": "RS256",
      "user_mapping": {
        "username": "preferred_username",
        "email": "email",
        "name": "name",
        "first_name": "first_name",
        "last_name": "last_name"
      }
    }
  }
}`;

  const constantsBlock = `// OIDC Configuration Constants
const OIDC_ISSUER = "${API_CONFIG.IDP_BASE_URL}";
const OIDC_CLIENT_ID = "your-client-id";
const OIDC_CLIENT_SECRET = "your-client-secret";
const OIDC_REDIRECT_URI = "https://your-app.mendixcloud.com/oidc/callback";
const OIDC_SCOPES = "openid profile email";`;

  return (
    <div className="space-y-12">
      {/* OIDC Introduction */}
      <section id="oidc-intro" className="scroll-mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">OpenID Connect (OIDC) Integration Guide</h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-4">What is OpenID Connect?</h3>
            <p className="text-muted-foreground mb-4">
              OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0. It allows applications to verify 
              user identity and obtain basic profile information in a standardized, secure way.
            </p>
            <p className="text-muted-foreground">
              {API_CONFIG.BRAND_NAME} implements OIDC to provide a secure, standards-compliant authentication mechanism 
              that works seamlessly with enterprise platforms like Mendix, and any OIDC-compatible application.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-4">When to Use OIDC vs Regular OAuth</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Use OIDC When:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Integrating with enterprise platforms (Mendix, Salesforce, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Your framework requires OIDC discovery endpoints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>You need ID tokens with signed claims (JWT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>You need automatic discovery of endpoints</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground mb-2">Use Regular OAuth When:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Building a custom web/mobile application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>You only need access tokens for API calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>Simpler integration requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-4">OIDC Authentication Flow</h3>
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between min-w-[600px] py-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-sm font-medium">User</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Server className="h-8 w-8 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Your App</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Authorization</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                    <Key className="h-8 w-8 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Token</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <FileJson className="h-8 w-8 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Userinfo/JWKS</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-muted-foreground text-center">
              <p>1. Click Login</p>
              <p>2. Redirect to {API_CONFIG.BRAND_NAME}</p>
              <p>3. User authenticates</p>
              <p>4. Exchange code for tokens</p>
              <p>5. Fetch user info</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section id="oidc-prerequisites" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Prerequisites</h2>
        
        <div className="p-6 rounded-lg border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            Before integrating OIDC, ensure you have the following:
          </p>
          <div className="space-y-3">
            {[
              { label: "Mendix account", desc: "Or access to your target platform's admin console" },
              { label: "Access to Developer Portal", desc: `Visit ${API_CONFIG.DEV_PORTAL_URL} to register` },
              { label: "Registered OIDC client", desc: "Create a project in the Developer Portal" },
              { label: "Correct redirect URL", desc: "Must match exactly what you configure in your platform" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <span className="font-medium text-foreground">{item.label}</span>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Registration */}
      <section id="oidc-registration" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Step-by-Step Client Registration</h2>
        
        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground">Log into Developer Portal</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Navigate to the Developer Portal and sign in with your account.
            </p>
            <a
              href={API_CONFIG.DEV_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open Developer Portal
            </a>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground">Register a New OIDC Client</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Click "Create Project" and fill in the required fields:
            </p>

            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-4 font-semibold text-foreground">Field</th>
                      <th className="text-left py-2 px-4 font-semibold text-foreground">Description</th>
                      <th className="text-left py-2 px-4 font-semibold text-foreground">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-mono text-primary">client_id</td>
                      <td className="py-3 px-4 text-muted-foreground">Auto-generated unique identifier</td>
                      <td className="py-3 px-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Auto</span></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-mono text-primary">client_secret</td>
                      <td className="py-3 px-4 text-muted-foreground">Auto-generated secret (shown only once!)</td>
                      <td className="py-3 px-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Auto</span></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-mono text-primary">redirect_uri</td>
                      <td className="py-3 px-4 text-muted-foreground">Must match EXACTLY - no trailing slashes</td>
                      <td className="py-3 px-4"><span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Required</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground mb-2">Example Redirect URI</h4>
                <code className="text-sm text-primary bg-background px-2 py-1 rounded">
                  https://your-app.mendixcloud.com/oidc/callback
                </code>
              </div>

              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">⚠️ Critical: Save Your Client Secret</h4>
                    <p className="text-sm text-red-700 mt-1">
                      The <code className="bg-red-100 px-1 rounded">client_secret</code> is displayed only once during registration. 
                      Copy it immediately and store it securely. If lost, you must regenerate it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Endpoint */}
      <section id="oidc-discovery" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">OIDC Discovery Endpoint</h2>
        
        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">GET</span>
              <code className="text-sm text-foreground font-mono">{API_CONFIG.IDP_BASE_URL}/api/.well-known/openid-configuration</code>
            </div>
            <p className="text-muted-foreground mb-4">
              The discovery endpoint provides all the information needed to configure your OIDC client automatically. 
              Most platforms can use this URL to auto-configure all endpoints.
            </p>

            <h4 className="font-semibold text-foreground mb-3">Response Example:</h4>
            <CodeBlock code={discoveryJson} language="json" />
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Discovery Response Fields</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 font-semibold text-foreground">Field</th>
                    <th className="text-left py-2 px-4 font-semibold text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">issuer</td>
                    <td className="py-3 px-4 text-muted-foreground">The base URL of the identity provider</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">authorization_endpoint</td>
                    <td className="py-3 px-4 text-muted-foreground">URL to redirect users for authentication</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">token_endpoint</td>
                    <td className="py-3 px-4 text-muted-foreground">URL to exchange authorization code for tokens</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">userinfo_endpoint</td>
                    <td className="py-3 px-4 text-muted-foreground">URL to fetch user profile information</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">jwks_uri</td>
                    <td className="py-3 px-4 text-muted-foreground">URL to fetch public keys for JWT validation</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">response_types_supported</td>
                    <td className="py-3 px-4 text-muted-foreground">Supported OAuth response types (code, id_token, etc.)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">grant_types_supported</td>
                    <td className="py-3 px-4 text-muted-foreground">Supported grant types (authorization_code, refresh_token)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 font-mono text-primary">scopes_supported</td>
                    <td className="py-3 px-4 text-muted-foreground">Available scopes: openid, profile, email, verifications, zkp</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Manual Configuration */}
      <section id="oidc-manual-config" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Manual OIDC Configuration</h2>
        
        <div className="p-6 rounded-lg border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            If your platform doesn't support auto-discovery, use these values to configure manually:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Setting</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">Issuer</td>
                  <td className="py-3 px-4 font-mono text-sm text-primary">{API_CONFIG.IDP_BASE_URL}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">Authorization Endpoint</td>
                  <td className="py-3 px-4 font-mono text-sm text-primary">{API_CONFIG.IDP_BASE_URL}/api/auth/oidc/authorize</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">Token Endpoint</td>
                  <td className="py-3 px-4 font-mono text-sm text-primary">{API_CONFIG.IDP_BASE_URL}/api/auth/oidc/token</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">Userinfo Endpoint</td>
                  <td className="py-3 px-4 font-mono text-sm text-primary">{API_CONFIG.IDP_BASE_URL}/api/auth/oidc/userinfo</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">JWKS URI</td>
                  <td className="py-3 px-4 font-mono text-sm text-primary">{API_CONFIG.IDP_BASE_URL}/api/auth/oidc/jwks.json</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">Auth Method</td>
                  <td className="py-3 px-4 font-mono text-sm text-muted-foreground">client_secret_post / client_secret_basic</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 font-medium text-foreground">ID Token Algorithm</td>
                  <td className="py-3 px-4 font-mono text-sm text-muted-foreground">RS256</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mendix Integration */}
      <section id="oidc-mendix" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Mendix Integration Steps</h2>
        
        <div className="space-y-6">
          {/* Method 1: Studio Pro */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded">Method 1</span>
              <h3 className="text-lg font-semibold text-foreground">Mendix Studio Pro</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Configure OIDC directly in Mendix Studio Pro:
              </p>
              
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">1. Add Issuer URL</h4>
                  <p className="text-sm text-muted-foreground mb-2">In your SSO configuration, set:</p>
                  <code className="text-sm text-primary bg-background px-2 py-1 rounded">{API_CONFIG.IDP_BASE_URL}</code>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">2. Configure Endpoints</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Authorization: <code className="text-primary">/api/auth/oidc/authorize</code></li>
                    <li>• Token: <code className="text-primary">/api/auth/oidc/token</code></li>
                    <li>• Userinfo: <code className="text-primary">/api/auth/oidc/userinfo</code></li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">3. Set Scopes</h4>
                  <code className="text-sm text-primary bg-background px-2 py-1 rounded">openid profile email</code>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">4. Enter Credentials</h4>
                  <p className="text-sm text-muted-foreground">
                    Add your <code className="text-primary">client_id</code> and <code className="text-primary">client_secret</code> from the Developer Portal.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">5. Set Redirect URI</h4>
                  <p className="text-sm text-muted-foreground mb-2">Format:</p>
                  <code className="text-sm text-primary bg-background px-2 py-1 rounded">https://your-app.mendixcloud.com/oidc/callback</code>
                </div>
              </div>
            </div>
          </div>

          {/* Method 2: Cloud Portal */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">Method 2</span>
              <h3 className="text-lg font-semibold text-foreground">Mendix Cloud Portal</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                For apps deployed to Mendix Cloud, configure via the Cloud Portal:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Go to your app in the Mendix Cloud Portal</li>
                <li>Navigate to Environment → Security</li>
                <li>Enable SSO and select "OpenID Connect"</li>
                <li>Enter the issuer URL: <code className="text-primary">{API_CONFIG.IDP_BASE_URL}</code></li>
                <li>Add your client credentials</li>
                <li>Save and restart your application</li>
              </ol>
            </div>
          </div>

          {/* Method 3: Custom Module */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded">Method 3</span>
              <h3 className="text-lg font-semibold text-foreground">Custom Module Configuration</h3>
            </div>
            
            <p className="text-muted-foreground mb-4">
              For custom OIDC module implementations, use these constants:
            </p>
            
            <CodeBlock code={constantsBlock} language="javascript" />
          </div>
        </div>
      </section>

      {/* User Mapping */}
      <section id="oidc-user-mapping" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">User Mapping Guide</h2>
        
        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-border bg-card">
            <p className="text-muted-foreground mb-4">
              Map OIDC claims to your platform's user fields:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 font-semibold text-foreground">Mendix Field</th>
                    <th className="text-left py-2 px-4 font-semibold text-foreground">OIDC Claim</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Username</td>
                    <td className="py-3 px-4 font-mono text-primary">preferred_username or sub</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Email</td>
                    <td className="py-3 px-4 font-mono text-primary">email</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Name</td>
                    <td className="py-3 px-4 font-mono text-primary">name</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">First Name</td>
                    <td className="py-3 px-4 font-mono text-primary">first_name</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Last Name</td>
                    <td className="py-3 px-4 font-mono text-primary">last_name</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Sample Userinfo Response</h3>
            <CodeBlock code={userinfoResponse} language="json" />
          </div>
        </div>
      </section>

      {/* Testing Flow */}
      <section id="oidc-testing" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Testing Flow</h2>
        
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <TestTube className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Testing</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { step: 1, title: "Open Your Application", desc: "Navigate to your deployed app's login page" },
              { step: 2, title: "Click Login", desc: "Click the SSO or 'Login with Valyd' button" },
              { step: 3, title: "Redirect to Authorization", desc: `You should be redirected to ${API_CONFIG.IDP_BASE_URL}/api/auth/oidc/authorize` },
              { step: 4, title: "Authenticate", desc: `Log in with your ${API_CONFIG.BRAND_NAME} credentials` },
              { step: 5, title: "Consent Screen", desc: "Approve the requested scopes if prompted" },
              { step: 6, title: "Callback Redirect", desc: "You're redirected back to your app with an authorization code" },
              { step: 7, title: "Token Exchange", desc: "Your app exchanges the code for access_token, id_token, and refresh_token" },
              { step: 8, title: "User Logged In", desc: "User session is created with mapped profile data" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="oidc-troubleshooting" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Troubleshooting</h2>
        
        <div className="space-y-4">
          {[
            {
              error: "Invalid redirect_uri",
              cause: "The redirect URI in your request doesn't match what's registered",
              solution: "Ensure the redirect_uri matches EXACTLY (no trailing slashes, correct protocol)"
            },
            {
              error: "Invalid client credentials",
              cause: "Wrong client_id or client_secret",
              solution: "Verify credentials in Developer Portal. If secret is lost, regenerate it"
            },
            {
              error: "User mapping failed",
              cause: "Expected claims are missing from the ID token or userinfo",
              solution: "Check your scope configuration includes 'profile' and 'email'"
            },
            {
              error: "ID token validation failed",
              cause: "Token signature verification failed or token is expired",
              solution: "Ensure your server time is synchronized. Verify JWKS endpoint is accessible"
            },
            {
              error: "Discovery endpoint failed",
              cause: "Cannot reach the .well-known/openid-configuration URL",
              solution: `Check network connectivity to ${API_CONFIG.IDP_BASE_URL}. Ensure no firewall blocks`
            },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{item.error}</h4>
                  <p className="text-sm text-muted-foreground"><strong>Cause:</strong> {item.cause}</p>
                  <p className="text-sm text-muted-foreground"><strong>Solution:</strong> {item.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Best Practices */}
      <section id="oidc-security" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Security Best Practices</h2>
        
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Security Guidelines</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, title: "Never expose client_secret", desc: "Keep it server-side only. Never include in frontend code or version control" },
              { icon: <Lock className="h-4 w-4 text-green-500" />, title: "Always use HTTPS", desc: "All OAuth/OIDC traffic must be encrypted. Never use HTTP" },
              { icon: <Shield className="h-4 w-4 text-blue-500" />, title: "Validate redirect URIs strictly", desc: "Register exact URIs. Don't use wildcards in production" },
              { icon: <Key className="h-4 w-4 text-purple-500" />, title: "Rotate secrets regularly", desc: "Implement a secret rotation schedule (every 90 days recommended)" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                {item.icon}
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Token Expiry Information</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-2 bg-white rounded">
                <div className="font-bold text-blue-700">ID Token</div>
                <div className="text-blue-600">15 minutes</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="font-bold text-blue-700">Access Token</div>
                <div className="text-blue-600">1 hour</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="font-bold text-blue-700">Refresh Token</div>
                <div className="text-blue-600">30 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Configuration */}
      <section id="oidc-example-config" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Example Mendix JSON Configuration</h2>
        
        <div className="p-6 rounded-lg border border-border bg-card">
          <p className="text-muted-foreground mb-4">
            Complete configuration example for Mendix SSO:
          </p>
          <CodeBlock code={mendixConfigJson} language="json" />
        </div>
      </section>
    </div>
  );
};
