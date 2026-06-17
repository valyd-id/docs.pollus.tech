import { AVAILABLE_SCOPES, SCOPE_DESCRIPTIONS } from "./constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}

export const ScopePicker = ({ selected, onChange }: Props) => {
  const toggle = (scope: string) => {
    const next = new Set(selected);
    if (next.has(scope)) next.delete(scope);
    else next.add(scope);
    onChange(next);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Scopes</h3>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_SCOPES.map((scope) => {
          const checked = selected.has(scope);
          return (
            <Tooltip key={scope} delayDuration={150}>
              <TooltipTrigger asChild>
                <label
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-mono cursor-pointer transition-colors ${
                    checked
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(scope)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  {scope}
                </label>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[240px]">
                {SCOPE_DESCRIPTIONS[scope]}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
