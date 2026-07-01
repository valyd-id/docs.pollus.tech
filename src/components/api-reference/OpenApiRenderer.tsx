import { getOperationsByTag } from "@/lib/openapi";
import { OperationCard } from "./OperationCard";
import type { OApiSpec } from "@/lib/openapi";

interface Props {
  spec: OApiSpec;
}

export const OpenApiRenderer = ({ spec }: Props) => {
  const byTag = getOperationsByTag(spec);
  const serverUrl = spec.servers?.[0]?.url ?? "";

  return (
    <div className="space-y-14">
      {/* ── Info header ── */}
      <div className="space-y-3 pb-6 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground">{spec.info.title}</h1>
        {spec.info.summary && (
          <p className="text-base text-muted-foreground max-w-2xl">{spec.info.summary}</p>
        )}
        {serverUrl && (
          <div className="flex flex-wrap items-center gap-2 text-sm pt-1">
            <span className="text-muted-foreground font-medium">Base URL</span>
            <code className="font-mono text-foreground bg-muted border border-border rounded px-2.5 py-1">
              {serverUrl}
            </code>
          </div>
        )}
      </div>

      {/* ── Tag sections ── */}
      {Array.from(byTag.entries()).map(([tagName, ops]) => {
        if (ops.length === 0) return null;
        const tagDef = spec.tags?.find((t) => t.name === tagName);
        return (
          <section key={tagName} id={`tag-${tagName.toLowerCase()}`} className="space-y-4 scroll-mt-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">{tagName}</h2>
              {tagDef?.description && (
                <p className="text-sm text-muted-foreground">{tagDef.description}</p>
              )}
            </div>
            <div className="space-y-2">
              {ops.map((op) => (
                <OperationCard key={op.operationId} op={op} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
