import { CodeBlock } from "@/components/docs/CodeBlock";
import { Webhook, AlertTriangle } from "lucide-react";

export const WebhooksSection = () => (
  <section id="webhooks" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <Webhook className="h-6 w-6 text-primary" /> Webhooks
    </h2>
    <p className="text-muted-foreground">
      When a session reaches a terminal state Valyd POSTs to the app or session callback URL.
      The webhook is a <strong>notification</strong>; always call{" "}
      <code>GET /api/v2/session/{`{id}`}/decision</code> for the full extracted data.
    </p>

    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
      <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-900">
        Read the <strong>raw</strong> request body before parsing — you need the exact bytes to
        verify the signature.
      </div>
    </div>

    <h3 className="text-xl font-semibold text-foreground">Headers</h3>
    <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
      <li><code>X-Valyd-Timestamp</code> — unix seconds when the event was sent</li>
      <li><code>X-Valyd-Event-Id</code> — unique event id (idempotency)</li>
      <li><code>X-Valyd-Signature</code> — lowercase hex HMAC-SHA256</li>
    </ul>

    <h3 className="text-xl font-semibold text-foreground">Verification</h3>
    <p className="text-sm text-muted-foreground">
      Compute <code>HMAC_SHA256(`${"${timestamp}"}.${"${rawBody}"}`, webhookSigningSecret)</code> and
      compare in constant time against <code>X-Valyd-Signature</code>. Reject on mismatch.
    </p>

    <CodeBlock
      language="javascript"
      title="Node (Express) — verify signature"
      code={`import crypto from "crypto";
import express from "express";

const app = express();

// IMPORTANT: capture the RAW body for HMAC verification
app.post(
  "/api/valyd-webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const ts  = req.header("X-Valyd-Timestamp");
    const sig = req.header("X-Valyd-Signature") || "";
    const raw = req.body; // Buffer

    const expected = crypto
      .createHmac("sha256", process.env.VALYD_WEBHOOK_SECRET)
      .update(\`\${ts}.\${raw.toString("utf8")}\`)
      .digest("hex");

    const ok =
      sig.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));

    if (!ok) return res.status(400).send("bad signature");

    const event = JSON.parse(raw.toString("utf8"));
    // event = { event_id, type: "verification.approved" | ..., session_id, status, vendor_data, decision, occurred_at }

    // Respond fast; then fetch the full decision asynchronously.
    res.status(200).json({ ok: true });
  }
);`}
    />

    <h3 className="text-xl font-semibold text-foreground">Event body</h3>
    <CodeBlock
      language="json"
      code={`{
  "event_id": "evt_...",
  "type": "verification.approved",
  "session_id": "ses_...",
  "status": "APPROVED",
  "vendor_data": "user-123",
  "decision": "approved",
  "occurred_at": "2025-06-05T11:42:13Z"
}`}
    />

    <h3 className="text-xl font-semibold text-foreground">Delivery</h3>
    <p className="text-sm text-muted-foreground">
      Non-2xx responses are retried with exponential backoff. Your endpoint must return 2xx and
      respond fast — defer heavy work to a queue.
    </p>
  </section>
);
