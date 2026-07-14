import { CodeBlock } from "@/components/docs/CodeBlock";
import { LanguageTabs } from "@/components/docs/LanguageTabs";
import { VERIFY_CONFIG, CONSOLE_HOST } from "@/lib/verify-config";
import { Zap } from "lucide-react";

const BASE = VERIFY_CONFIG.API_BASE_URL;

const SDK_SESSION = `import { Valyd } from "valyd-verify-sdk";

const valyd = new Valyd({
  apiKey: process.env.VALYD_API_KEY,          // vrf_… from ${CONSOLE_HOST} (server-side only)
  webhookSecret: process.env.VALYD_WEBHOOK_SECRET,
});

// Create a hosted session and send the user to session.url
const session = await valyd.verify.sessions.create({
  workflowId:  process.env.VALYD_WORKFLOW_ID, // from the same portal
  vendorData:  "user-123",                     // your own reference, echoed back
  redirectUrl: "https://your-app.com/verify/result",
  callback:    "https://your-app.com/api/valyd-webhook", // optional
});

// Later — the authoritative result (works with or without webhooks):
const decision = await valyd.verify.sessions.decision(session.sessionId);`;

const CURL_SESSION = `curl -X POST ${BASE}/api/v2/session \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_id":  "'"$VALYD_WORKFLOW_ID"'",
    "vendor_data":  "user-123",
    "redirect_url": "https://your-app.com/verify/result",
    "callback":     "https://your-app.com/api/valyd-webhook"
  }'
# → { success: true, data: { session_id, url, … } }   Redirect the user to data.url`;

const SDK_CHECK = `import { Valyd } from "valyd-verify-sdk";
const valyd = new Valyd({ apiKey: process.env.VALYD_API_KEY });

// A Core API check — synchronous, no session, no UI.
const { check } = await valyd.verify.standalone.ageVerification({
  dob: "1995-06-01",
  bands: ["is_18_plus"],
});
console.log(check.status);   // "passed"`;

const CURL_CHECK = `curl -X POST ${BASE}/api/v2/age-verification \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "dob": "1995-06-01", "bands": ["is_18_plus"] }'`;

export const QuickstartSection = () => (
  <section id="quickstart" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <Zap className="h-6 w-6 text-primary" /> Quickstart
    </h2>

    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
      <strong>One console.</strong> Everything — the OAuth <code>client_id</code>/<code>client_secret</code>, the Verify{" "}
      <code>API key</code>, and your <code>workflow_id</code> — comes from the Developer Portal at{" "}
      <a href={VERIFY_CONFIG.CONSOLE_URL} target="_blank" rel="noreferrer" className="text-primary underline">
        {CONSOLE_HOST}
      </a>
      . There is no second dashboard to sign in to.
    </div>

    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
      <li>
        Sign in at{" "}
        <a className="text-primary underline" href={VERIFY_CONFIG.CONSOLE_URL} target="_blank" rel="noreferrer">
          {CONSOLE_HOST}
        </a>{" "}
        and create an app → <code>client_id</code> + <code>client_secret</code>.
      </li>
      <li>
        In the same portal, create a Verify project → copy the <code>API key</code> (<code>vrf_…</code>, shown{" "}
        <strong>once</strong>) and the webhook signing secret. Keep both server-side.
      </li>
      <li>Still in the portal: build a Workflow (pick your checks) → copy its <code>workflow_id</code>.</li>
      <li>Install the SDK and make your first call.</li>
    </ol>

    <CodeBlock language="bash" code={`npm i valyd-verify-sdk   # server (Node 18+)
npm i valyd-verify-js    # browser: hosted modal + camera/GPS capture`} />

    <div className="space-y-2">
      <h3 className="font-semibold text-foreground">Hosted — create a session, send the user to it</h3>
      <LanguageTabs
        examples={[
          { language: "javascript", label: "SDK (Node)", code: SDK_SESSION },
          { language: "bash", label: "cURL", code: CURL_SESSION },
        ]}
      />
    </div>

    <div className="space-y-2">
      <h3 className="font-semibold text-foreground">Core APIs — a single check, server-to-server</h3>
      <LanguageTabs
        examples={[
          { language: "javascript", label: "SDK (Node)", code: SDK_CHECK },
          { language: "bash", label: "cURL", code: CURL_CHECK },
        ]}
      />
    </div>
  </section>
);
