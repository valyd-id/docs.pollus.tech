import { Shuffle } from "lucide-react";

export const ModesSection = () => (
  <section id="modes" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <Shuffle className="h-6 w-6 text-primary" /> Hosted vs Standalone
    </h2>
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Aspect</th>
            <th className="text-left px-4 py-3 font-medium">Hosted</th>
            <th className="text-left px-4 py-3 font-medium">Standalone</th>
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
              <td className="px-4 py-3 text-muted-foreground">{h}</td>
              <td className="px-4 py-3 text-muted-foreground">{s}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
