import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeSwitch, type VerifyMode } from "../ModeSwitch";

export const ModesSection = ({
  mode,
  onModeChange,
}: {
  mode: VerifyMode;
  onModeChange: (m: VerifyMode) => void;
}) => (
  <section id="modes" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <Shuffle className="h-6 w-6 text-primary" /> Choose your integration
    </h2>
    <p className="text-muted-foreground">
      Pick how you want to integrate — the rest of these docs update to match your choice.
      You can switch any time.
    </p>

    <ModeSwitch mode={mode} onModeChange={onModeChange} />

    {/* The model, in one 2×2: two API types (rows) × two delivery modes (cols). */}
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">The model in one grid</h3>
      <p className="text-muted-foreground text-sm">
        Two axes. <strong>Account (Managed by Valyd)</strong> vs <strong>Non-account (Fresh)</strong> —
        whether a verified identity is stored on a Valyd account and reused. And <strong>Hosted</strong> vs{" "}
        <strong>Core APIs</strong> — whether Valyd renders the capture page or you call REST directly.
      </p>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium"></th>
              <th className="text-left px-4 py-3 font-medium">Hosted</th>
              <th className="text-left px-4 py-3 font-medium">Core APIs</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-4 py-3 font-medium text-foreground">Account<br/><span className="text-xs text-muted-foreground">Managed by Valyd</span></td>
              <td className="px-4 py-3 text-muted-foreground">Login with Valyd → workflow on the hosted page; steps stored on the account; reuse skips done steps. <em>Returns proofs only.</em></td>
              <td className="px-4 py-3 text-muted-foreground">Call REST with the user's token — license (badge on account), face (vs stored vector), reuse read. KYC redirects to Valyd. <em>Proofs only.</em></td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-3 font-medium text-foreground">Non-account<br/><span className="text-xs text-muted-foreground">Fresh</span></td>
              <td className="px-4 py-3 text-muted-foreground">One-shot hosted capture, nothing retained. <em>Returns raw data.</em></td>
              <td className="px-4 py-3 text-muted-foreground">Per-endpoint REST capture in your own UI. <em>Returns raw data.</em></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-muted-foreground">
        <strong className="text-foreground">Data-sharing rule.</strong> Account APIs return{" "}
        <strong>proofs only</strong> — a pseudonym, <code>id_verified</code>, license badges, age bands —
        and <strong>never</strong> raw KYC. Raw account attributes are released solely through the{" "}
        <strong>consent Core API</strong> (the user approves in-app). Non-account (Fresh) APIs return the
        captured <strong>raw data as-is</strong>, since you performed the capture and nothing is retained.
      </div>
    </div>

    <h3 className="text-lg font-semibold text-foreground pt-2">Hosted vs Core, side by side</h3>
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Aspect</th>
            <th
              className={cn(
                "text-left px-4 py-3 font-medium",
                mode === "hosted" && "bg-primary/10 text-primary"
              )}
            >
              Hosted
            </th>
            <th
              className={cn(
                "text-left px-4 py-3 font-medium",
                mode === "standalone" && "bg-primary/10 text-primary"
              )}
            >
              Core APIs
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ["UI", "Valyd-hosted capture page", "You build it"],
            ["Trigger", "Redirect user to session URL", "Server-to-server REST call"],
            ["Result delivery", "Webhook + decision API", "Synchronous response"],
            ["Best for", "End-user KYC flows with camera", "Backoffice, batch, custom UX"],
            ["Identifier", "workflow_id (bundle of services)", "Per-endpoint call"],
          ].map(([a, h, s]) => (
            <tr key={a} className="border-t border-border">
              <td className="px-4 py-3 font-medium text-foreground">{a}</td>
              <td className={cn("px-4 py-3 text-muted-foreground", mode === "hosted" && "bg-primary/5")}>{h}</td>
              <td className={cn("px-4 py-3 text-muted-foreground", mode === "standalone" && "bg-primary/5")}>{s}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
