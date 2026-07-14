import { LayoutDashboard, KeyRound, Workflow, Webhook, Wallet } from "lucide-react";
import { VERIFY_CONFIG, CONSOLE_HOST } from "@/lib/verify-config";

/**
 * CONSOLE UNIFICATION — there is exactly ONE console: the Valyd Developer Portal.
 * It issues the OAuth client_id/client_secret, the Verify API key (vrf_…), the webhook
 * signing secret and the workflows. The old standalone Verify dashboard is retired.
 */
export const ConsoleSection = () => (
  <section id="console" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <LayoutDashboard className="h-6 w-6 text-primary" /> The Developer Portal
    </h2>
    <p className="text-muted-foreground">
      One console for everything. Sign in at{" "}
      <a href={VERIFY_CONFIG.CONSOLE_URL} target="_blank" rel="noreferrer" className="text-primary underline">
        {CONSOLE_HOST}
      </a>{" "}
      with your Valyd account — the <strong>same portal</strong> issues your OAuth credentials{" "}
      <em>and</em> your Verify API key <em>and</em> your workflows. There is no separate Verify dashboard.
    </p>

    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-semibold text-foreground mb-3">Everything you need comes from {CONSOLE_HOST}:</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {[
              ["client_id", "Login with Valyd (OAuth2). Your app’s public identifier."],
              ["client_secret", "OAuth2 secret. Server-side only."],
              ["API key", "Verify APIs (X-API-Key: vrf_…). Shown once at creation — copy it then."],
              ["webhook secret", "Signs every webhook (whsec_…). Verify it before trusting an event."],
              ["workflow_id", "The bundle of checks a hosted session runs. Create and edit workflows in the portal."],
            ].map(([k, v]) => (
              <tr key={k}>
                <td className="py-2 pr-4 whitespace-nowrap"><code className="font-semibold text-foreground">{k}</code></td>
                <td className="py-2 text-muted-foreground">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <Card icon={<KeyRound className="h-5 w-5 text-primary" />} title="Apps & keys">
        One app carries both identities: the OAuth <code>client_id</code>/<code>client_secret</code> for Login with
        Valyd, and a Verify <code>API key</code> for the verification APIs. The key is shown <strong>once</strong> at
        creation. Create separate Test and Production apps.
      </Card>
      <Card icon={<Workflow className="h-5 w-5 text-primary" />} title="Workflows">
        Bundle checks (ID, liveness, face match, credential, location…) into a reusable Workflow with a stable{" "}
        <code>workflow_id</code> you pass when creating a Hosted session. Full create / edit / delete in the portal.
      </Card>
      <Card icon={<Webhook className="h-5 w-5 text-primary" />} title="Webhooks">
        Set a per-app callback URL and copy the signing secret. Valyd POSTs a signed event when a session reaches a
        terminal state. (You can also pass a per-session <code>callback</code>.)
      </Card>
      <Card icon={<Wallet className="h-5 w-5 text-primary" />} title="Balance">
        Verify is prepaid. Top up in the portal and watch each check draw the balance down; the portal also lists your
        sessions and transactions.
      </Card>
    </div>

    {/* Workflow wizard: available checks + pricing */}
    <div id="console-features" className="scroll-mt-8 space-y-3 pt-2">
      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <Workflow className="h-5 w-5 text-primary" /> Workflow wizard — the checks you can add
      </h3>
      <p className="text-sm text-muted-foreground">
        When you build a Workflow you toggle the checks below. A session's cost is the{" "}
        <strong>sum of its enabled checks</strong>, charged against your prepaid balance.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">Check</th>
              <th className="px-4 py-2 font-semibold">What it does</th>
              <th className="px-4 py-2 font-semibold text-right">Price (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              ["id_verification", "ID document capture + data extraction (KYC)", "$0.13"],
              ["liveness", "Anti-spoof / real-person selfie check", "$0.08"],
              ["face_match", "1:1 selfie vs ID portrait (or the stored account face vector)", "$0.10"],
              ["age", "Age bands (is_18_plus, is_21_plus…) from DOB", "$0.05"],
              ["credential", "Professional license lookup against the state board", "$0.32"],
              ["location", "Mandatory GPS fix — plus the geofence verdict when you give an expected point + radius", "$0.02"],
            ].map(([k, d, p]) => (
              <tr key={k}>
                <td className="px-4 py-2"><code>{k}</code></td>
                <td className="px-4 py-2 text-muted-foreground">{d}</td>
                <td className="px-4 py-2 text-right tabular-nums">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-1.5">
        <p>
          <strong className="text-foreground">location:</strong> a real GPS fix is <strong>always mandatory</strong> —
          the step cannot be skipped, and a blocked permission is a hard <code>failed</code>. Supply an{" "}
          <strong>expected point + <code>radius_m</code></strong> and the <strong>status is the verdict</strong>:{" "}
          <code>passed</code> inside the radius, <code>failed</code> outside it.
        </p>
        <p>
          In Hosted flows the device GPS is captured for you; you supply the <em>expected</em> point at session-create via{" "}
          <code>metadata.expected_lat</code>/<code>expected_lng</code> (plus <code>radius_m</code>). With the Core APIs you
          send both the captured and the expected coordinates.
        </p>
      </div>
    </div>
  </section>
);

const Card = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="p-5 rounded-lg border border-border bg-card">
    <div className="flex items-center gap-2 mb-2">{icon}<h3 className="font-semibold text-foreground">{title}</h3></div>
    <p className="text-sm text-muted-foreground">{children}</p>
  </div>
);
