import { CodeBlock } from "../CodeBlock";

export const ErrorsSection = () => {
  const errors = [
    {
      code: "invalid_client",
      status: "401 Unauthorized",
      description: "The client_id or client_secret is invalid or doesn't match.",
      solution: "Verify your credentials in the Developer Portal and ensure you're using the correct values.",
      example: `{
  "success": false,
  "error": {
    "code": "invalid_client",
    "message": "client_id/client_secret invalid"
  }
}`,
    },
    {
      code: "invalid_token",
      status: "401 Unauthorized",
      description: "The access token is invalid, malformed, or has expired.",
      solution: "Use the /refresh endpoint to get a new access token, or re-authenticate the user.",
      example: `{
  "success": false,
  "error": {
    "code": "invalid_token",
    "message": "token invalid/expired"
  }
}`,
    },
    {
      code: "insufficient_scope",
      status: "403 Forbidden",
      description: "The access token doesn't have the required scope for this endpoint.",
      solution: "Request the missing scope in your authorization URL and have the user re-authenticate.",
      example: `{
  "success": false,
  "error": {
    "code": "insufficient_scope",
    "message": "The request requires the profile scope"
  }
}`,
    },
    {
      code: "invalid_grant",
      status: "400 Bad Request",
      description: "The authorization code or refresh token is invalid, expired, already used, or the redirect URI doesn't match the one registered in the portal.",
      solution: "Authorization codes expire after 5 minutes and can only be used once. Verify your redirect URI matches exactly. For refresh tokens, have the user re-authenticate.",
      example: `{
  "success": false,
  "error": {
    "code": "invalid_grant",
    "message": "refresh_token is invalid or expired"
  }
}`,
    },
    {
      code: "Invalid login session",
      status: "SDK / app-level",
      description: "valyd.verifyLoginSession(marker) returned { valid: false }. Causes: the login session expired (10-minute TTL), the marker cookie is missing, the marker was tampered with, or you're verifying with a different clientSecret than the one that created the session.",
      solution: "Send the user back through /login to issue a fresh login session. Make sure the marker is stored server-side (httpOnly cookie or session) and survives the full redirect round-trip. Do NOT try to compare the callback state — that's Valyd's session id, not your CSRF token.",
      example: `// SDK call
const { valid } = await valyd.verifyLoginSession(marker);
// { valid: false } — never throws on invalid markers`,
    },
    {
      code: "invalid_request",
      status: "400 Bad Request",
      description: "The request is missing required parameters or has invalid parameter values.",
      solution: "Check the API documentation for required parameters and ensure all values are properly formatted.",
      example: `{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "Missing required parameter: code"
  }
}`,
    },
    {
      code: "access_denied",
      status: "403 Forbidden",
      description: "The user denied the authorization request on the consent screen.",
      solution: "The user chose not to grant access. You may prompt them to try again or explain why the permissions are needed.",
      example: `{
  "success": false,
  "error": {
    "code": "access_denied",
    "message": "User denied the authorization request"
  }
}`,
    },
  ];

  return (
    <section id="errors" className="scroll-mt-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Error Codes Reference</h2>
      
      <p className="text-muted-foreground mb-8">
        All error responses follow a consistent format with a <code className="bg-muted px-1 rounded">success: false</code> flag 
        and an <code className="bg-muted px-1 rounded">error</code> object containing a <code className="bg-muted px-1 rounded">code</code> and 
        human-readable <code className="bg-muted px-1 rounded">message</code>.
      </p>

      <div className="space-y-6">
        {errors.map((error) => (
          <div key={error.code} className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3 flex-wrap">
                <code className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-mono text-sm font-semibold">
                  {error.code}
                </code>
                <span className="text-sm text-muted-foreground">{error.status}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Description</h4>
                <p className="text-muted-foreground">{error.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Solution</h4>
                <p className="text-muted-foreground">{error.solution}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Example Response</h4>
                <CodeBlock code={error.example} language="json" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
