import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll";

export interface RecipeStep {
  id: string;
  label: string;
  /** Optional step number to display (1, 2, …). Omit for non-numbered items like Prerequisites. */
  step?: number;
}

interface Props {
  steps: RecipeStep[];
  activeId?: string;
  backHref: string;
  backLabel: string;
  onNavigate?: () => void;
}

export const RecipeSidebar = ({ steps, activeId, backHref, backLabel, onNavigate }: Props) => {
  const handleClick = (id: string) => {
    scrollToId(id);
    onNavigate?.();
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar overflow-y-auto">
      <nav className="p-4 space-y-5">
        <Link
          to={backHref}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => onNavigate?.()}
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          {backLabel}
        </Link>

        <ul className="space-y-0.5">
          {steps.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => handleClick(s.id)}
                className={cn(
                  "group flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-left transition-smooth text-sm",
                  activeId === s.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {s.step !== undefined ? (
                  <span
                    className={cn(
                      "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                      activeId === s.id
                        ? "bg-primary text-background border-primary"
                        : "border-border text-muted-foreground group-hover:border-foreground/40"
                    )}
                  >
                    {s.step}
                  </span>
                ) : (
                  <span className="shrink-0 w-5" />
                )}
                <span className="leading-tight">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
