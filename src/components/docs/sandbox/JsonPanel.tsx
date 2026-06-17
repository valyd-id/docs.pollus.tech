import { cn } from "@/lib/utils";

interface JsonPanelProps {
  data: unknown;
  ok?: boolean;
  status?: number;
  label?: string;
  placeholder?: string;
}

export const JsonPanel = ({ data, ok, status, label, placeholder }: JsonPanelProps) => {
  if (data === null || data === undefined) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        {placeholder ?? "Response will appear here."}
      </div>
    );
  }

  const borderClass = ok
    ? "border-green-300 bg-green-50/40"
    : "border-red-300 bg-red-50/40";

  return (
    <div className={cn("rounded-lg border overflow-hidden", borderClass)}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-inherit bg-background/60">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label ?? "Response"}
        </span>
        {typeof status === "number" && (
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded",
              ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}
          >
            {status === 0 ? "ERR" : status}
          </span>
        )}
      </div>
      <pre className="p-3 text-xs overflow-x-auto max-h-96 text-foreground">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
};
