import { cn } from "@/lib/utils";
import { ShieldCheck, RefreshCw } from "lucide-react";

export type VerifyProduct = "managed" | "fresh";

const OPTIONS: {
  id: VerifyProduct;
  label: string;
  tagline: string;
  blurb: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "managed",
    label: "Managed by Valyd",
    tagline: "Login required",
    blurb:
      "Users log in with Valyd. They verify a check once and the result joins their Valyd identity — reusable across apps. Returning users re-verify with just a selfie.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: "fresh",
    label: "Verify fresh every time",
    tagline: "No login",
    blurb:
      "No account, nothing retained. Run a verification at the moment it matters and get the result back. Simplest hosted flow.",
    icon: <RefreshCw className="h-5 w-5" />,
  },
];

/** Big two-card selector shown under the Hosted choice. */
export const ProductSwitch = ({
  product,
  onProductChange,
}: {
  product: VerifyProduct;
  onProductChange: (p: VerifyProduct) => void;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {OPTIONS.map((opt) => {
      const selected = product === opt.id;
      return (
        <button
          key={opt.id}
          type="button"
          aria-pressed={selected}
          onClick={() => onProductChange(opt.id)}
          className={cn(
            "text-left rounded-xl border p-5 transition-smooth",
            selected
              ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/30"
              : "border-border hover:border-primary/40 hover:bg-accent"
          )}
        >
          <div className="flex items-center gap-2">
            <span className={cn(selected ? "text-primary" : "text-muted-foreground")}>{opt.icon}</span>
            <span className="text-lg font-semibold text-foreground">{opt.label}</span>
            <span
              className={cn(
                "ml-auto text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full",
                selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {selected ? "Selected" : opt.tagline}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{opt.blurb}</p>
        </button>
      );
    })}
  </div>
);

/** Compact segmented control for the sidebar. */
export const ProductSwitchCompact = ({
  product,
  onProductChange,
}: {
  product: VerifyProduct;
  onProductChange: (p: VerifyProduct) => void;
}) => (
  <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
    {OPTIONS.map((opt) => (
      <button
        key={opt.id}
        type="button"
        aria-pressed={product === opt.id}
        onClick={() => onProductChange(opt.id)}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium transition-smooth",
          product === opt.id
            ? "bg-background text-primary shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {opt.icon}
        {opt.id === "managed" ? "Managed" : "Fresh"}
      </button>
    ))}
  </div>
);
