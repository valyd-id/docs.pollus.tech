import { CodeBlock } from "@/components/docs/CodeBlock";
import { LanguageTabs } from "@/components/docs/LanguageTabs";
import { VERIFY_CONFIG } from "@/lib/verify-config";
import { RefreshCw, AlertTriangle, Webhook } from "lucide-react";

const BASE = VERIFY_CONFIG.API_BASE_URL;
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

/** Hosted → Verify fresh every time. No login, nothing retained. */
export const VerifyFreshSection = () => (
  <section id="hosted" className="scroll-mt-8 space-y-10">
    <div className="space-y-3">
      <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
        <RefreshCw className="h-7 w-7 text-primary" /> Hosted · Verify fresh every time
      </h2>
      <p className="text-muted-foreground">
        No login, nothing stored. Create a session, redirect the user to a Valyd-hosted page that
        captures everything, and read the result via a signed webhook + the decision API. Four steps.
      </p>
      <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-foreground">
          All calls are server-to-server with <code>X-API-Key: &lt;App API key&gt;</code> — keep it{" "}
          <strong>server-side only</strong>. Every response uses{" "}
          <code>{`{ success, data, error }`}</code>.
        </p>
      </div>
    </div>

    <div className="space-y-8">
      <Step
        id="hosted-fresh-workflow"
        n={1}
        title="Create a workflow"
        blurb="In the Developer Console, create a workflow (product = Verify Fresh), pick the checks, and copy its workflow_id. Also copy your App API key and top up balance; add a webhook destination."
      >
        <p className="text-sm text-muted-foreground">
          Console:{" "}
          <a href={CONSOLE} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            {CONSOLE}
          </a>{" "}
          → Workflows → New workflow.
        </p>
        <CodeBlock
          language="bash"
          code={`# install the SDK (optional — cURL works too)
npm i valyd-verify-sdk`}
        />
      </Step>

      <Step
        id="hosted-fresh-session"
        n={2}
        title="Create a session (server-side)"
        blurb="POST /api/v2/session with your workflow_id. No Valyd token — there is no login in this product. The response includes the hosted url."
      >
        <LanguageTabs
          examples={[
            {
              language: "bash",
              label: "cURL",
              code: `curl -X POST ${BASE}/api/v2/session \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_id":  "wf_…",
    "redirect_url": "https://app.example.com/verify/done",
    "callback":     "https://api.example.com/webhooks/valyd",
    "vendor_data":  "user_123"
  }'`,
            },
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `import { Valyd } from "valyd-verify-sdk";

const valyd = new Valyd({
  apiKey:        process.env.VALYD_API_KEY,      // server-side only
  webhookSecret: process.env.VALYD_WEBHOOK_SECRET,
});

const session = await valyd.verify.sessions.create({
  workflowId:  process.env.VALYD_WORKFLOW_ID,
  redirectUrl: "https://app.example.com/verify/done",
  callback:    "https://api.example.com/webhooks/valyd",
  vendorData:  "user_123",            // your ref — echoed back on the webhook
});
// session.url → redirect the user here`,
            },
          ]}
        />
        <CodeBlock
          language="json"
          title="Response (data)"
          code={`{ "session_id": "ses_…", "status": "NOT_STARTED", "url": "${BASE}/verify?session=…", "expires_at": "2026-06-24T12:00:00Z" }`}
        />
      </Step>

      <Step
        id="hosted-fresh-redirect"
        n={3}
        title="Redirect the user to the url"
        blurb="Send the browser to session.url. Valyd hosts the full capture UI (ID scan, selfie, license…), then redirects back to your redirect_url with ?session_id=…&status=…."
      >
        <CodeBlock
          language="javascript"
          code={`// Express
app.post("/start-verification", async (req, res) => {
  const session = await valyd.verify.sessions.create({
    workflowId:  process.env.VALYD_WORKFLOW_ID,
    redirectUrl: \`\${process.env.APP_URL}/verify/done\`,
    callback:    \`\${process.env.APP_URL}/webhooks/valyd\`,
    vendorData:  req.user.id,
  });
  res.redirect(session.url);
});`}
        />
      </Step>

      <Step
        id="hosted-fresh-result"
        n={4}
        title="Read the result"
        blurb="Treat the redirect's ?status= as a hint. Get the authoritative result from the signed webhook and/or the decision API."
      >
        <LanguageTabs
          examples={[
            {
              language: "javascript",
              label: "Webhook (SDK)",
              code: `import express from "express";
import { Valyd, ValydVerifyError } from "valyd-verify-sdk";

const valyd = new Valyd({ apiKey: process.env.VALYD_API_KEY, webhookSecret: process.env.VALYD_WEBHOOK_SECRET });

// MUST verify against the raw body
app.post("/webhooks/valyd", express.raw({ type: "application/json" }), (req, res) => {
  try {
    const event = valyd.verify.webhooks.constructEvent(req.body, req.headers);
    // event.type: verification.approved | .declined | .in_review | .expired | .abandoned
    // event.session_id, event.status, event.vendor_data, event.decision
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof ValydVerifyError && err.code === "invalid_signature") return res.status(400).end();
    throw err;
  }
});`,
            },
            {
              language: "bash",
              label: "Decision API (cURL)",
              code: `curl ${BASE}/api/v2/session/ses_…/decision \\
  -H "X-API-Key: $VALYD_API_KEY"
# → { status, checks: [{ type, status, score, data }], decided_at }`,
            },
          ]}
        />
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          <Webhook className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p>
            Signature: <code>HMAC-SHA256(timestamp + "." + rawBody, secret)</code> ={" "}
            <code>X-Valyd-Signature</code> (also <code>X-Valyd-Timestamp</code> /{" "}
            <code>X-Valyd-Event-Id</code>). Nothing is stored — each verification starts fresh.
          </p>
        </div>
      </Step>
    </div>
  </section>
);
