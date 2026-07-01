import { CodeBlock } from "@/components/docs/CodeBlock";
import { LanguageTabs } from "@/components/docs/LanguageTabs";
import { VERIFY_CONFIG } from "@/lib/verify-config";
import {
  KeyRound,
  AlertTriangle,
  Code,
  UserPlus,
  LogIn,
  KeySquare,
  PlayCircle,
  ArrowRightLeft,
  Webhook,
  RefreshCw,
} from "lucide-react";

const BASE = VERIFY_CONFIG.API_BASE_URL;
// Environment-driven (VITE_*). Falls back to the dev/tech domains.
const IDP = (import.meta.env.VITE_VALYD_IDP_URL as string) ?? "https://idp.valyd.id";
const DEV_PORTAL = (import.meta.env.VITE_DEV_PORTAL_URL as string) ?? "https://dev.valyd.id";

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div className="relative pl-12">
    <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
      {n}
    </div>
    <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const SubHeading = ({ id, icon, children }: { id: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <h3 id={id} className="scroll-mt-8 text-xl font-semibold text-foreground flex items-center gap-2 pt-2">
    {icon}
    {children}
  </h3>
);

export const ManagedSection = () => (
  <section id="managed" className="scroll-mt-8 space-y-10">
    {/* Title + persistent callout */}
    <div className="space-y-3">
      <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
        <KeyRound className="h-7 w-7 text-primary" /> Managed by Valyd
      </h2>
      <p className="text-muted-foreground">
        Your users sign in with <strong>Login with Valyd</strong> (OAuth2 / TPSSO). They verify
        once, and the result joins their Valyd identity — so they reuse it across your app and
        every other Valyd integration. Returning users re-verify with a <strong>selfie only</strong>,
        no second ID scan.
      </p>
      <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-foreground">
          Login is a server-to-server OAuth flow between <strong>your app</strong> and the Valyd
          IdP. Keep your <code>client_secret</code> and <code>X-API-Key</code>{" "}
          <strong>server-side only</strong>, and pass the user's access token to the session
          server-to-server — never expose any of them to the browser.
        </p>
      </div>
    </div>

    {/* Overview & SDK init */}
    <div id="managed-overview" className="scroll-mt-8 space-y-3">
      <SubHeading id="managed-overview-h" icon={<Code className="h-5 w-5 text-primary" />}>
        Overview & SDK init
      </SubHeading>
      <p className="text-sm text-muted-foreground">
        Use the unified{" "}
        <a
          href="https://www.npmjs.com/package/valyd-verify-sdk"
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          <code>valyd-verify-sdk</code>
        </a>
        {" "}— one client exposes <code>valyd.auth</code> (Login with Valyd) and{" "}
        <code>valyd.verify</code> (the checks).
      </p>
      <CodeBlock language="bash" code={`npm i valyd-verify-sdk`} />
      <CodeBlock
        language="javascript"
        code={`import { Valyd } from "valyd-verify-sdk";

const valyd = new Valyd({
  // Login with Valyd (OAuth2 / TPSSO)
  clientId:     process.env.VALYD_CLIENT_ID!,
  clientSecret: process.env.VALYD_CLIENT_SECRET!,   // server-side only
  // Verify (the checks)
  apiKey:        process.env.VALYD_API_KEY!,         // server-side only
  webhookSecret: process.env.VALYD_WEBHOOK_SECRET!,
});`}
      />
      <p className="text-sm text-muted-foreground">Managed flow at a glance:</p>
      <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
        <li>User clicks <strong>Login with Valyd</strong> → redirect to the IdP consent page.</li>
        <li>On callback, exchange the <code>code</code> for an access token + <code>pollus_id</code>.</li>
        <li>Create a verify session, passing that <code>valyd_access_token</code>.</li>
        <li>Redirect to the hosted <code>url</code> — first time = full KYC, returning = selfie only.</li>
        <li>Read the result; it's also written back to the user's Valyd identity for reuse.</li>
      </ol>
    </div>

    {/* Steps */}
    <div className="space-y-8">
      <Step n={1} title="Register your login app & a Managed workflow">
        <p id="managed-register" className="scroll-mt-8 text-sm text-muted-foreground">
          Register an OAuth client at{" "}
          <a href={DEV_PORTAL} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            dev.pollus.tech
          </a>{" "}
          to get a <code>client_id</code> + <code>client_secret</code>, register your redirect
          URI(s), and pick scopes (<code>profile</code>, <code>verifications</code>,{" "}
          <code>doctor_license</code>, <code>zkp</code>). Then create a <strong>Managed</strong>{" "}
          workflow in the{" "}
          <a href={VERIFY_CONFIG.CONSOLE_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Developer Console
          </a>{" "}
          and copy its <code>workflow_id</code> (you'll also need your App API key + balance).
        </p>
      </Step>

      <Step n={2} title="Add a “Login with Valyd” button">
        <p id="managed-login" className="scroll-mt-8 text-sm text-muted-foreground">
          Redirect the user to the IdP authorize URL. The SDK builds it for you — it points at the
          hosted login/consent page (<code>{IDP}/oauth/consent?…&idp_type=tpsso</code>).
        </p>
        <CodeBlock
          language="javascript"
          code={`// GET /auth/valyd/login
app.get("/auth/valyd/login", (req, res) => {
  const url = valyd.auth.getAuthorizationUrl({
    scope: ["profile", "verifications"],
    redirectUri: \`\${process.env.APP_URL}/auth/valyd/callback\`,
  });
  res.redirect(url); // → ${IDP}/oauth/consent?client_id=…&redirect_url=…&idp_type=tpsso&scope=…
});`}
        />
      </Step>

      <Step n={3} title="Exchange the code on your callback">
        <p id="managed-exchange" className="scroll-mt-8 text-sm text-muted-foreground">
          The IdP redirects back to your <code>redirect_uri</code> with a <code>code</code>. Exchange
          it for the user's access token and identity, then set your own app session.
        </p>
        <LanguageTabs
          examples={[
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `// GET /auth/valyd/callback?code=…
app.get("/auth/valyd/callback", async (req, res) => {
  const { accessToken, user } = await valyd.auth.exchangeCode(req.query.code);
  // user.pollus_id → the stable Valyd user id
  req.session.valyd = { accessToken, pollusId: user.pollus_id };
  res.redirect("/verify/start");
});`,
            },
            {
              language: "bash",
              label: "cURL",
              code: `curl -X POST ${IDP}/api/auth/tpsso/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type":    "authorization_code",
    "code":          "AUTH_CODE",
    "client_id":     "$VALYD_CLIENT_ID",
    "client_secret": "$VALYD_CLIENT_SECRET"
  }'
# → { data: { access_token, user: { pollus_id, … } } }`,
            },
          ]}
        />
      </Step>

      <Step n={4} title="Check KYC — redirect to Valyd if the user isn't verified">
        <p id="managed-kyc" className="scroll-mt-8 text-sm text-muted-foreground">
          In the Managed (account) model <strong>KYC is never an API call</strong> — the user
          completes it once on their Valyd account. Read <code>human_verified</code> from the user's
          verifications; if it's missing, <strong>redirect them to Valyd</strong> to finish KYC and
          bring them back with <code>return_to</code>. When they return, re-check and continue. There
          is no document to collect and nothing to store on your side.
        </p>
        <LanguageTabs
          examples={[
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `// Gate the flow on KYC before verifying anything.
const verifications = await valyd.auth.getVerifications(accessToken);

if (valyd.verify.kyc.isRequired(verifications)) {
  // Not KYC'd yet → send the user to Valyd to complete it, then come back.
  return res.redirect(
    valyd.verify.kyc.redirectUrl({
      returnTo: \`\${process.env.APP_URL}/verify/start\`, // where Valyd returns them
      state:    req.session.id,                          // optional, echoed back
    })
  );
}
// human_verified === true → proceed to start the verification (next step).`,
            },
            {
              language: "bash",
              label: "cURL",
              code: `# 1) Read KYC status from the IdP (account model)
curl ${IDP}/api/auth/tpsso/verifications \\
  -H "Authorization: Bearer $VALYD_USER_ACCESS_TOKEN"
# → { verifications: { human_verified: false, … } }

# 2) If human_verified is false, redirect the browser to Valyd for KYC:
#    ${IDP}/kyc?return_to=https://app.example.com/verify/start
#    After KYC, Valyd returns the user to return_to and human_verified flips true.`,
            },
          ]}
        />
      </Step>

      <Step n={5} title="Start a verification with the access token">
        <p id="managed-session" className="scroll-mt-8 text-sm text-muted-foreground">
          Your backend creates a session and passes the user's <code>valyd_access_token</code>.
          Verify validates that token against the IdP and binds the user. If it's missing, invalid
          or expired you get <code>401 valyd_login_required</code> — send the user back through
          Login with Valyd.
        </p>
        <LanguageTabs
          examples={[
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `app.get("/verify/start", async (req, res) => {
  const { accessToken, pollusId } = req.session.valyd;
  const session = await valyd.verify.sessions.create({
    workflowId:       process.env.VALYD_WORKFLOW_ID!, // a Managed workflow
    vendorData:       pollusId,                       // your internal ref
    valydAccessToken: accessToken,                    // ← the Managed hand-off
    redirectUrl:      \`\${process.env.APP_URL}/verify/callback\`,
    callback:         \`\${process.env.APP_URL}/webhooks/valyd\`,
  });
  res.redirect(session.url);
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
    "vendor_data":        "pollus_…",
    "valyd_access_token": "$VALYD_USER_ACCESS_TOKEN",
    "redirect_url":       "https://app.example.com/verify/callback",
    "callback":           "https://api.example.com/webhooks/valyd"
  }'
# → { data: { url, session_id, … } }   (401 valyd_login_required if the token is bad)`,
            },
          ]}
        />
      </Step>

      <Step n={6} title="Redirect to the hosted page">
        <p id="managed-redirect" className="scroll-mt-8 text-sm text-muted-foreground">
          Send the user to <code>session.url</code>. <strong>First-timers</strong> complete the full
          workflow (ID + selfie + any credential). <strong>Returning users</strong> — already
          verified in this app — re-verify with a <strong>selfie only</strong>, matched against their
          stored face. No second ID scan.
        </p>
      </Step>

      <Step n={7} title="The result joins the Valyd identity">
        <p id="managed-writeback" className="scroll-mt-8 text-sm text-muted-foreground">
          On approval, Verify writes the verified result back to the IdP (the system of record) and
          keeps its own copy — so the next login in your app, or any other Valyd integration, can
          reuse it.
        </p>
      </Step>

      <Step n={8} title="Read the result">
        <p id="managed-result" className="scroll-mt-8 text-sm text-muted-foreground">
          Use the signed webhook (push) and/or the decision API (pull). Both return the verified{" "}
          <code>identity</code> alongside the checks.
        </p>
        <LanguageTabs
          examples={[
            {
              language: "javascript",
              label: "Webhook (Node)",
              code: `import express from "express";

app.post(
  "/webhooks/valyd",
  express.raw({ type: "application/json" }),
  (req, res) => {
    // Verifies HMAC-SHA256(timestamp + "." + rawBody, webhookSecret) == X-Valyd-Signature
    const event = valyd.verify.webhooks.constructEvent(req.body, req.headers);
    // event.type, event.session_id, event.status, event.decision, event.vendor_data
    res.json({ ok: true });
  }
);`,
            },
            {
              language: "bash",
              label: "Decision (cURL)",
              code: `curl ${BASE}/api/v2/session/ses_…/decision \\
  -H "X-API-Key: $VALYD_API_KEY"
# → { data: { status, checks: [...], identity: { full_name, dob, licenses, … } } }`,
            },
          ]}
        />
      </Step>
    </div>

    {/* Reuse APIs */}
    <div id="managed-reuse" className="scroll-mt-8 space-y-4">
      <SubHeading id="managed-reuse-h" icon={<RefreshCw className="h-5 w-5 text-primary" />}>
        Reuse a verified identity (no new session)
      </SubHeading>
      <p className="text-sm text-muted-foreground">
        For back-office use you can read a previously-verified user's profile + licenses by your own
        reference, and revoke the stored identity, without starting a session.
      </p>
      <LanguageTabs
        examples={[
          {
            language: "bash",
            label: "Read (cURL)",
            code: `# by your internal ref…
curl "${BASE}/api/v2/identity?vendor_data=pollus_…" \\
  -H "X-API-Key: $VALYD_API_KEY"
# …or by Valyd user id
curl "${BASE}/api/v2/identity?pollus_id=pollus_…" \\
  -H "X-API-Key: $VALYD_API_KEY"
# → { data: { identity: { full_name, dob, age_bands, licenses, verified_at } } }`,
          },
          {
            language: "bash",
            label: "Revoke (cURL)",
            code: `curl -X DELETE "${BASE}/api/v2/identity/pollus_…" \\
  -H "X-API-Key: $VALYD_API_KEY"`,
          },
        ]}
      />
    </div>

    {/* Mini icon legend row (visual parity with other sections) */}
    <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-2"><UserPlus className="h-4 w-4 text-primary" /> Register at dev.pollus.tech</span>
      <span className="flex items-center gap-2"><LogIn className="h-4 w-4 text-primary" /> Login with Valyd</span>
      <span className="flex items-center gap-2"><KeySquare className="h-4 w-4 text-primary" /> Exchange code → token</span>
      <span className="flex items-center gap-2"><PlayCircle className="h-4 w-4 text-primary" /> Session + valyd_access_token</span>
      <span className="flex items-center gap-2"><ArrowRightLeft className="h-4 w-4 text-primary" /> Write-back + reuse</span>
      <span className="flex items-center gap-2"><Webhook className="h-4 w-4 text-primary" /> Webhook + decision</span>
    </div>
  </section>
);
