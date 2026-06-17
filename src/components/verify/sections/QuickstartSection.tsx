import { CodeBlock } from "@/components/docs/CodeBlock";
import { VERIFY_CONFIG } from "@/lib/verify-config";
import { Zap } from "lucide-react";

export const QuickstartSection = () => (
  <section id="quickstart" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <Zap className="h-6 w-6 text-primary" /> Quickstart
    </h2>
    <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
      <li>Sign in to the <a className="text-primary underline" href={VERIFY_CONFIG.CONSOLE_URL} target="_blank" rel="noreferrer">Developer Console</a> with Valyd SSO. A default App is created on first login.</li>
      <li>Copy the App API key (shown once at creation). Keep it server-side only.</li>
      <li>Create a Workflow (for Hosted) and copy its <code>workflow_id</code>.</li>
      <li>Set your webhook URL and signing secret under Webhooks.</li>
      <li>Use the snippet below to run your first call.</li>
    </ol>

    <CodeBlock
      title="curl — your first standalone call"
      language="bash"
      code={`curl -X POST ${VERIFY_CONFIG.API_BASE_URL}/api/v2/age-verification \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "dob": "1995-06-01", "bands": ["is_18_plus"] }'`}
    />

    <CodeBlock
      title="Node (fetch) — create a Hosted session"
      language="javascript"
      code={`const res = await fetch("${VERIFY_CONFIG.API_BASE_URL}/api/v2/session", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.VALYD_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    workflow_id: process.env.VALYD_WORKFLOW_ID,
    redirect_url: "https://your-app.com/verify/result",
    callback: "https://your-app.com/api/valyd-webhook",
    vendor_data: "user-123",
  }),
});
const { data } = await res.json();
// Redirect the user's browser to data.url`}
    />
  </section>
);
