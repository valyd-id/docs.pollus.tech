import { CheckCircle2 } from "lucide-react";

export const StatusesSection = () => (
  <section id="statuses" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <CheckCircle2 className="h-6 w-6 text-primary" /> Statuses & decisioning
    </h2>

    <h3 className="text-xl font-semibold text-foreground">Session status</h3>
    <pre className="p-4 rounded-lg bg-muted text-sm overflow-x-auto">
{`NOT_STARTED ──► IN_PROGRESS ──► (IN_REVIEW) ──► APPROVED | DECLINED
                                              └─► ABANDONED | EXPIRED`}
    </pre>

    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="text-left px-4 py-3 font-medium">Meaning</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["NOT_STARTED", "Session created, user not yet on the hosted page"],
            ["IN_PROGRESS", "User is interacting with the flow"],
            ["IN_REVIEW", "Awaiting human / async review"],
            ["APPROVED", "All checks passed (or manually approved)"],
            ["DECLINED", "Checks failed (or manually declined)"],
            ["ABANDONED", "User left before completing"],
            ["EXPIRED", "TTL elapsed before completion"],
          ].map(([s, m]) => (
            <tr key={s} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-primary">{s}</td>
              <td className="px-4 py-3 text-muted-foreground">{m}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 className="text-xl font-semibold text-foreground">Check status</h3>
    <ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
      <li><code>passed</code> — check succeeded</li>
      <li><code>failed</code> — check failed</li>
      <li><code>review</code> — inconclusive; needs human or async review</li>
    </ul>
  </section>
);
