import { LayoutDashboard, KeyRound, Workflow, Webhook } from "lucide-react";
import { VERIFY_CONFIG } from "@/lib/verify-config";

export const ConsoleSection = () => (
  <section id="console" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <LayoutDashboard className="h-6 w-6 text-primary" /> The Developer Console
    </h2>
    <p className="text-muted-foreground">
      The console lives at{" "}
      <a href={VERIFY_CONFIG.CONSOLE_URL} target="_blank" rel="noreferrer" className="text-primary underline">
        verify.pollus.tech/dashboard
      </a>
      . Sign in with Valyd SSO — your first sign-in auto-creates an App.
    </p>

    <div className="grid md:grid-cols-2 gap-4">
      <Card icon={<KeyRound className="h-5 w-5 text-primary" />} title="Apps">
        Each App has a unique <code>App ID</code> and a secret API key (shown once at creation,
        rotatable). Create multiple apps such as Test and Production.
      </Card>
      <Card icon={<Workflow className="h-5 w-5 text-primary" />} title="Workflows">
        Bundle services (ID, liveness, face match…) into a reusable Workflow. Each Workflow has
        a <code>workflow_id</code> used when creating Hosted sessions.
      </Card>
      <Card icon={<Webhook className="h-5 w-5 text-primary" />} title="Webhooks">
        Configure a per-app endpoint URL and signing secret (rotatable). Valyd POSTs signed
        events to this URL when a session reaches a terminal state.
      </Card>
      <Card icon={<LayoutDashboard className="h-5 w-5 text-primary" />} title="SSO">
        The console uses Valyd SSO. Your developer account is separate from end-users you
        verify.
      </Card>
    </div>

    {/* Workflow wizard: available checks + pricing */}
    <div id="console-features" className="scroll-mt-8 space-y-3 pt-2">
      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <Workflow className="h-5 w-5 text-primary" /> Workflow wizard — the checks you can add
      </h3>
      <p className="text-sm text-muted-foreground">
        When you build a Workflow you toggle the checks below. A session's cost is the{" "}
        <strong>sum of its enabled checks</strong>, charged against your prepaid balance. Bundles are
        priced <strong>below the sum of their parts</strong>.
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
              ["face_match", "1:1 selfie vs ID portrait (or stored account vector)", "$0.10"],
              ["age", "Age bands (is_18_plus, is_21_plus…) from DOB", "$0.05"],
              ["credential", "Professional license lookup against the state board", "$0.32"],
              ["location", "Geocode a captured GPS point → country / state / city", "$0.02"],
              ["location_match", "Captured GPS vs expected coords → { match, distance_m }", "$0.05"],
            ].map(([k, d, p]) => (
              <tr key={k}>
                <td className="px-4 py-2"><code>{k}</code></td>
                <td className="px-4 py-2 text-muted-foreground">{d}</td>
                <td className="px-4 py-2 text-right tabular-nums">{p}</td>
              </tr>
            ))}
            <tr className="bg-primary/5">
              <td className="px-4 py-2"><code>evv_presence</code> <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.5 text-xs font-semibold text-primary">bundle</span></td>
              <td className="px-4 py-2 text-muted-foreground">
                <strong>Face match + location match</strong> — proves the right person is at the right place.
              </td>
              <td className="px-4 py-2 text-right tabular-nums font-semibold">
                $0.12 <span className="block text-xs font-normal text-muted-foreground">save $0.03 vs $0.15</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        <strong>location_match / evv_presence:</strong> in Hosted flows the device GPS (and selfie) are
        captured automatically; you supply the <em>expected</em> location at session-create via{" "}
        <code>metadata.expected_lat</code>/<code>expected_lng</code> (or <code>expected_address</code>).
        With the Core APIs you send both the captured and expected coordinates and we match them.
      </p>
    </div>
  </section>
);

const Card = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="p-5 rounded-lg border border-border bg-card">
    <div className="flex items-center gap-2 mb-2">{icon}<h3 className="font-semibold text-foreground">{title}</h3></div>
    <p className="text-sm text-muted-foreground">{children}</p>
  </div>
);
