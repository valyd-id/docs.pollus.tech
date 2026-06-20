import { cn } from "@/lib/utils";
import { Globe, Server } from "lucide-react";

export type VerifyMode = "hosted" | "standalone";

const OPTIONS: {
  id: VerifyMode;
  label: string;
  tagline: string;
  blurb: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "hosted",
    label: "Hosted",
    tagline: "We host the UI",
    blurb:
      "Create a session, redirect the user to a Valyd-hosted page, get the result by webhook + decision API. Fastest to ship.",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "standalone",
    label: "Standalone",
    tagline: "You build the UI",
    blurb:
      "Call each capability directly (ID, liveness, face match, age, credential) and get a synchronous JSON result. Full control.",
    icon: <Server className="h-5 w-5" />,
  },
];

/** Big two-card selector for the top of the page. */
export const ModeSwitch = ({
  mode,
  onModeChange,
}: {
  mode: VerifyMode;
  onModeChange: (m: VerifyMode) => void;
}) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {OPTIONS.map((opt) => {
      const selected = mode === opt.id;
      return (
        <button
          key={opt.id}
          type="button"
          aria-pressed={selected}
          onClick={() => onModeChange(opt.id)}
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

/** Compact segmented control for the sidebar / sticky bars. */
export const ModeSwitchCompact = ({
  mode,
  onModeChange,
}: {
  mode: VerifyMode;
  onModeChange: (m: VerifyMode) => void;
}) => (
  <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
    {OPTIONS.map((opt) => (
      <button
        key={opt.id}
        type="button"
        aria-pressed={mode === opt.id}
        onClick={() => onModeChange(opt.id)}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-smooth",
          mode === opt.id
            ? "bg-background text-primary shadow-soft"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {opt.icon}
        {opt.label}
      </button>
    ))}
  </div>
);
