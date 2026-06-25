import { CodeBlock } from "@/components/docs/CodeBlock";
import { LanguageTabs } from "@/components/docs/LanguageTabs";
import { VERIFY_CONFIG } from "@/lib/verify-config";
import { ShieldCheck, AlertTriangle, KeyRound, LogIn, ArrowLeftRight } from "lucide-react";

const BASE = VERIFY_CONFIG.API_BASE_URL;
const IDP = VERIFY_CONFIG.IDP_URL;
const DEV = VERIFY_CONFIG.DEV_PORTAL_URL;
const CONSOLE = VERIFY_CONFIG.CONSOLE_URL;

const Step = ({ id, n, title, blurb, children }: { id?: string; n: number; title: string; blurb: string; children?: React.ReactNode }) => (
  <div id={id} className="scroll-mt-8 relative pl-12">
    <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
      {n}
    </div>
    <h4 className="text-lg font-semibold text-foreground mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground mb-3">{blurb}</p>
    <div className="space-y-3">{children}</div>
  </div>
);

/** Hosted → Managed by Valyd. Login with Valyd + verify-on-demand; result is reusable. */
export const ManagedSection = () => (
  <section id="hosted" className="scroll-mt-8 space-y-10">
    <div className="space-y-3">
      <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
        <ShieldCheck className="h-7 w-7 text-primary" /> Hosted · Managed by Valyd
      </h2>
      <p className="text-muted-foreground">
        The user logs in with Valyd; you read who they are and run any check on demand. The verified
        result joins their Valyd identity, so it's reusable everywhere and returning users re-verify
        with just a selfie.
      </p>
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">How the pieces fit</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Login</strong> is a direct TPSSO integration between <em>your app</em> and the IdP ({IDP.replace("https://", "")}).</li>
          <li><strong>Verification</strong> runs on verify.pollus.tech — you hand it the user's Valyd token.</li>
          <li>The IdP is the <strong>system of record</strong>; verify writes the result back and keeps a copy.</li>
        </ul>
      </div>
      <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-foreground">
          Your <code>client_secret</code>, the verify <code>X-API-Key</code>, and the user's{" "}
          <code>valyd_access_token</code> all stay <strong>server-side only</strong> — never in the browser.
        </p>
      </div>
    </div>

    <div className="space-y-8">
      <Step
        id="managed-register"
        n={1}
        title="Register your login app"
        blurb="Register an OAuth client on the developer portal to get a client_id + client_secret. Also create a Managed workflow in the verify console for the check step."
      >
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>
            Login app →{" "}
            <a href={DEV} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              {DEV.replace("https://", "")}
            </a>{" "}
            → register → copy <code>client_id</code> + <code>client_secret</code>, set redirect URI(s),
            pick scopes: <code>profile</code>, <code>verifications</code>, <code>doctor_license</code>, <code>zkp</code>.
          </li>
          <li>
            Verification →{" "}
            <a href={CONSOLE} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              verify console
            </a>{" "}
            → create App (copy API key + top up balance) → create a Managed workflow (copy <code>workflow_id</code>).
          </li>
        </ul>
        <CodeBlock language="bash" code={`npm i valyd-verify-sdk   # one SDK for both login (valyd.auth) and checks (valyd.verify)`} />
      </Step>

      <Step
        id="managed-login"
        n={2}
        title='Add a "Login with Valyd" button'
        blurb="Send the user to the IdP authorize URL with your scopes. The IdP authenticates them (face login, or silent if they already have a Valyd session)."
      >
        <LanguageTabs
          examples={[
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `import { Valyd } from "valyd-verify-sdk";

const valyd = new Valyd({
  clientId:      process.env.VALYD_CLIENT_ID,      // from dev.pollus.tech
  clientSecret:  process.env.VALYD_CLIENT_SECRET,  // server-side only
  apiKey:        process.env.VALYD_API_KEY,        // verify checks
  webhookSecret: process.env.VALYD_WEBHOOK_SECRET,
});

app.get("/login", (req, res) => {
  const url = valyd.auth.getAuthorizationUrl({
    scope: ["profile", "verifications"],
    redirectUri: \`\${process.env.APP_URL}/auth/valyd/callback\`,
  });
  res.redirect(url);
});`,
            },
            {
              language: "bash",
              label: "Authorize URL",
              code: `${IDP}/api/auth/tpsso/authorize
  ?client_id=$VALYD_CLIENT_ID
  &redirect_uri=https://app.example.com/auth/valyd/callback
  &response_type=code
  &scope=profile%20verifications`,
            },
          ]}
        />
      </Step>

      <Step
        id="managed-callback"
        n={3}
        title="Exchange the code on your callback"
        blurb="The IdP redirects back with a code. Your backend exchanges it for the user's access token + identity, then sets your own session."
      >
        <CodeBlock
          language="javascript"
          code={`app.get("/auth/valyd/callback", async (req, res) => {
  const { accessToken, user } = await valyd.auth.exchangeCode(req.query.code);
  // user.pollus_id is the stable Valyd user id
  req.session.valydToken = accessToken;   // keep server-side
  req.session.pollusId   = user.pollus_id;
  res.redirect("/dashboard");
});`}
        />
      </Step>

      <Step
        id="managed-session"
        n={4}
        title="Create a verify session with the Valyd token"
        blurb="When the user needs a check, your backend creates a session and passes their valyd_access_token. verify validates it with the IdP and binds the identity — that token is the proof of login."
      >
        <LanguageTabs
          examples={[
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `app.post("/verify/start", async (req, res) => {
  const session = await valyd.verify.sessions.create({
    workflowId:       process.env.VALYD_WORKFLOW_ID,
    valydAccessToken: req.session.valydToken,   // ← the key field
    vendorData:       req.session.pollusId,
    redirectUrl:      \`\${process.env.APP_URL}/verify/done\`,
    callback:         \`\${process.env.APP_URL}/webhooks/valyd\`,
  });
  res.json({ url: session.url });
});`,
            },
            {
              language: "bash",
              label: "cURL",
              code: `curl -X POST ${BASE}/api/v2/session \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_id":        "wf_…",
    "valyd_access_token": "<user Valyd token>",
    "vendor_data":        "<pollus_id>",
    "redirect_url":       "https://app.example.com/verify/done"
  }'`,
            },
          ]}
        />
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
          <KeyRound className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-foreground">
            If the token is missing/expired, verify replies <code>HTTP 401</code>{" "}
            <code>valyd_login_required</code> — send the user back through step 2 to log in again.
          </p>
        </div>
      </Step>

      <Step
        id="managed-redirect"
        n={5}
        title="Redirect the user to the url"
        blurb="Send the browser to session.url. Returning users (already verified in your app) re-verify with a selfie only; first-timers do the full workflow. No second login."
      >
        <CodeBlock
          language="javascript"
          code={`const { url } = await fetch("/verify/start", { method: "POST" }).then(r => r.json());
window.location.href = url;   // full-page redirect (popup also works)`}
        />
      </Step>

      <Step
        id="managed-writeback"
        n={6}
        title="verify writes the result back"
        blurb="On approval, verify records the result on the user's Valyd identity (id_verified + verified license) and keeps its own copy. You don't do anything here — it's automatic."
      >
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          <ArrowLeftRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p>
            Because the result lives on the Valyd identity, any other Valyd app sees it and the user
            won't re-verify next time — that's the "verify once, reuse" payoff.
          </p>
        </div>
      </Step>

      <Step
        id="managed-result"
        n={7}
        title="Read the result (and reuse it later)"
        blurb="Get the outcome from the signed webhook and/or the decision API. The decision includes the verified identity. Later, read a returning user without a new session."
      >
        <LanguageTabs
          examples={[
            {
              language: "bash",
              label: "Decision (cURL)",
              code: `curl ${BASE}/api/v2/session/ses_…/decision \\
  -H "X-API-Key: $VALYD_API_KEY"
# → { status, checks: [...], pollus_id, identity: { full_name, dob, licenses, … } }`,
            },
            {
              language: "javascript",
              label: "Decision (SDK)",
              code: `const d = await valyd.verify.sessions.decision(sessionId);
// d.status, d.checks[], d.identity (profile + licenses)`,
            },
            {
              language: "bash",
              label: "On-demand reuse",
              code: `# Read a previously-verified user — no new session
curl "${BASE}/api/v2/identity?vendor_data=<pollus_id>" \\
  -H "X-API-Key: $VALYD_API_KEY"

# Revoke the stored verification
curl -X DELETE ${BASE}/api/v2/identity/<pollus_id> \\
  -H "X-API-Key: $VALYD_API_KEY"`,
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Webhook signature: <code>HMAC-SHA256(timestamp + "." + rawBody, secret)</code> ={" "}
          <code>X-Valyd-Signature</code>. Verify with{" "}
          <code>valyd.verify.webhooks.constructEvent(rawBody, headers)</code>.
        </p>
      </Step>
    </div>

    <div className="rounded-lg border border-border bg-card p-5 text-sm">
      <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
        <LogIn className="h-4 w-4 text-primary" /> Why no "Login with Valyd" inside the verify page?
      </p>
      <p className="text-muted-foreground">
        Login happens on <em>your</em> site (step 2–3), so verify never has to detect a session across
        domains. You hand it the token; verify validates it with the IdP and already knows who the user
        is. If you ever send an unauthenticated user, verify shows "Sign in with Valyd first."
      </p>
    </div>
  </section>
);
