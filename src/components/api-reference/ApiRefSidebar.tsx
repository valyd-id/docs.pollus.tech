import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MethodBadge } from "@/components/docs/MethodBadge";
import { getOperationsByTag } from "@/lib/openapi";
import { scrollToId } from "@/lib/scroll";
import type { OApiSpec } from "@/lib/openapi";

interface Props {
  spec: OApiSpec;
  backHref: string;
  backLabel: string;
  activeId?: string;
  onNavigate?: () => void;
}

export const ApiRefSidebar = ({ spec, backHref, backLabel, activeId, onNavigate }: Props) => {
  const byTag = getOperationsByTag(spec);

  const handleClick = (id: string) => {
    scrollToId(id);
    onNavigate?.();
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar overflow-y-auto">
      <nav className="p-4 space-y-5">
        {/* Back link */}
        <Link
          to={backHref}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => onNavigate?.()}
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          {backLabel}
        </Link>

        {/* Tag + operations */}
        {Array.from(byTag.entries()).map(([tagName, ops]) => {
          if (ops.length === 0) return null;
          return (
            <div key={tagName}>
              <p className="px-3 mb-1.5 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                {tagName}
              </p>
              <ul className="space-y-0.5">
                {ops.map((op) => (
                  <li key={op.operationId}>
                    <button
                      type="button"
                      onClick={() => handleClick(op.operationId)}
                      className={cn(
                        "group flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-left transition-smooth",
                        activeId === op.operationId
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <span className="shrink-0">
                        <MethodBadge
                          method={op.method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH"}
                        />
                      </span>
                      <span className="font-mono text-[11px] truncate leading-tight">
                        {op.path.split("/").slice(-1)[0] || op.path}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
