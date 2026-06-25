import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeSwitch, type VerifyMode } from "../ModeSwitch";
import { ProductSwitch, type VerifyProduct } from "../ProductSwitch";

export const ModesSection = ({
  mode,
  onModeChange,
  product,
  onProductChange,
}: {
  mode: VerifyMode;
  onModeChange: (m: VerifyMode) => void;
  product: VerifyProduct;
  onProductChange: (p: VerifyProduct) => void;
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

    {mode === "hosted" && (
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">
          Hosted has two products — pick one:
        </p>
        <ProductSwitch product={product} onProductChange={onProductChange} />
      </div>
    )}

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
              Standalone
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
