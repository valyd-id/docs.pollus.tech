import { CodeBlock } from "../CodeBlock";
import { ShieldAlert, ShieldCheck, ExternalLink } from "lucide-react";

export const LoginSessionsSection = () => {
  const example = `// 1. Before redirecting the user to Valyd
const session = await valyd.createLoginSession();
// → { authorizeState: "...", marker: "v1.<sig>.<payload>" }

res.cookie("valyd_login", session.marker, {
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  maxAge: 10 * 60 * 1000, // 10 minutes (matches marker TTL)
});

res.redirect(valyd.getAuthorizationUrl({
  state: session.authorizeState,
  scope: ["profile", "verifications"],
}));

// 2. On the callback
const marker = req.cookies.valyd_login;
const { valid } = await valyd.verifyLoginSession(marker);
if (!valid) {
  // Expired login, missing cookie, or tampered marker.
  return res.status(400).send("Invalid login session");
}`;

  return (
    <section id="login-sessions" className="scroll-mt-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> Login sessions (CSRF protection)
        </h2>
        <p className="text-muted-foreground">
          The classic OAuth CSRF check — generate a random <code>state</code>, then compare what the
          IdP echoes — does not work for Valyd TPSSO, because Valyd returns its own session id on the
          callback. The SDK ships with a purpose-built mechanism: <strong>login sessions</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">The problem</h3>
          </div>
          <p className="text-sm text-red-700">
            Comparing the callback <code>state</code> against the value you sent will always fail —
            Valyd substitutes its own opaque session id on the redirect back.
          </p>
        </div>
        <div className="p-5 rounded-lg border border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800">The solution</h3>
          </div>
          <p className="text-sm text-emerald-700">
            Call <code>createLoginSession()</code> before the redirect and store the
            {" "}<code>marker</code> server-side. On the callback, call{" "}
            <code>verifyLoginSession(marker)</code>.
          </p>
        </div>
      </div>

      <CodeBlock code={example} language="typescript" title="Express example" />

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Property</th>
              <th className="text-left px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Marker format", "HMAC-signed string. Signed with your client secret on Valyd's side."],
              ["TTL", "10 minutes. After that, verifyLoginSession returns { valid: false }."],
              ["Storage", "Server only — httpOnly cookie, encrypted session, or KV. Never expose to JS."],
              ["Return value", "verifyLoginSession returns { valid: boolean }. It never throws on an invalid marker."],
              ["When to verify", "On the callback, before exchangeCode()."],
            ].map(([k, v]) => (
              <tr key={k} className="border-t border-border">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{k}</td>
                <td className="px-4 py-3 text-muted-foreground">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <a
        href="https://github.com/valyd/idp-sdk/blob/HEAD/examples/express-login.ts"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
      >
        <ExternalLink className="h-4 w-4" /> Full Express example in the SDK repo
      </a>
    </section>
  );
};
