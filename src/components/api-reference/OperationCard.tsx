import { useState } from "react";
import { Lock, LockOpen, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MethodBadge } from "@/components/docs/MethodBadge";
import { CodeBlock } from "@/components/docs/CodeBlock";
import type { ResolvedOperation, OApiRequestBody } from "@/lib/openapi";

const STATUS_CLASS: Record<string, string> = {
  "2": "bg-green-100 text-green-700 border-green-200",
  "3": "bg-blue-100 text-blue-700 border-blue-200",
  "4": "bg-orange-100 text-orange-700 border-orange-200",
  "5": "bg-red-100 text-red-700 border-red-200",
};
const statusClass = (code: string) =>
  STATUS_CLASS[code[0]] ?? "bg-muted text-muted-foreground border-border";

// Returns the best available request body content entry + its content-type label.
const getRequestBody = (requestBody: OApiRequestBody | undefined) => {
  if (!requestBody?.content) return null;
  const c = requestBody.content;

  if (c["application/json"]) {
    return { contentType: "application/json", ...c["application/json"] };
  }
  if (c["multipart/form-data"]) {
    return { contentType: "multipart/form-data", ...c["multipart/form-data"] };
  }
  if (c["application/x-www-form-urlencoded"]) {
    return {
      contentType: "application/x-www-form-urlencoded",
      ...c["application/x-www-form-urlencoded"],
    };
  }
  return null;
};

interface Props {
  op: ResolvedOperation;
  defaultOpen?: boolean;
}

export const OperationCard = ({ op, defaultOpen = false }: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  const bodyContent = getRequestBody(op.requestBody);
  const hasJsonBody = bodyContent?.contentType === "application/json" && bodyContent.example;

  return (
    <div id={op.operationId} className="scroll-mt-8 border border-border rounded-xl overflow-hidden bg-background">
      {/* ── Header ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <MethodBadge method={op.method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH"} />
        <code className="font-mono text-sm text-foreground flex-1 min-w-0 break-all">
          {op.path}
        </code>
        {op.summary && (
          <span className="hidden sm:block text-sm text-muted-foreground shrink-0 max-w-xs truncate">
            {op.summary}
          </span>
        )}
        <span className="shrink-0 flex items-center gap-1.5 ml-2">
          {op.hasAuth ? (
            <Lock className="h-3.5 w-3.5 text-muted-foreground/60" title="Requires auth" />
          ) : (
            <LockOpen className="h-3.5 w-3.5 text-muted-foreground/30" title="Public" />
          )}
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </button>

      {/* ── Body ── */}
      {open && (
        <div className="border-t border-border divide-y divide-border">
          {/* Description */}
          {(op.description || op.summary) && (
            <div className="px-5 py-4 space-y-1">
              {op.summary && (
                <p className="text-sm font-medium text-foreground sm:hidden">{op.summary}</p>
              )}
              {op.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{op.description}</p>
              )}
            </div>
          )}

          {/* Parameters */}
          {op.parameters.length > 0 && (
            <div className="px-5 py-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Parameters
              </p>
              <div className="rounded-lg border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-1/4">
                        Name
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-16">
                        In
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-20">
                        Type
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {op.parameters.map((param) => (
                      <tr key={`${param.in}-${param.name}`} className="border-t border-border">
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono">{param.name}</code>
                          {param.required && (
                            <span className="ml-1.5 text-[10px] text-destructive font-semibold">
                              required
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground font-mono">
                          {param.in}
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground font-mono">
                          {param.schema?.type ?? "—"}
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {param.description ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request body */}
          {bodyContent && (
            <div className="px-5 py-4 space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Request body
                </p>
                <span className="font-mono text-[10px] bg-muted border border-border rounded px-1.5 py-0.5 text-muted-foreground">
                  {bodyContent.contentType}
                </span>
              </div>

              {hasJsonBody ? (
                <CodeBlock
                  language="json"
                  code={JSON.stringify(bodyContent.example, null, 2)}
                />
              ) : bodyContent.schema && (
                /* For multipart/form-data and form-urlencoded: show a properties table */
                <div className="rounded-lg border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-1/4">Field</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-20">Type</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        (bodyContent.schema as { properties?: Record<string, { type?: string; format?: string; description?: string }> }).properties ?? {}
                      ).map(([field, def]) => {
                        const required: string[] = (bodyContent.schema as { required?: string[] }).required ?? [];
                        return (
                          <tr key={field} className="border-t border-border">
                            <td className="px-4 py-2">
                              <code className="text-xs font-mono">{field}</code>
                              {required.includes(field) && (
                                <span className="ml-1.5 text-[10px] text-destructive font-semibold">required</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-xs text-muted-foreground font-mono">
                              {def.format ?? def.type ?? "—"}
                            </td>
                            <td className="px-4 py-2 text-xs text-muted-foreground">
                              {def.description ?? "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Responses */}
          {op.responses.length > 0 && (
            <div className="px-5 py-4 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Responses
              </p>
              <div className="space-y-4">
                {op.responses.map(({ status, response }) => {
                  const json = response.content?.["application/json"];
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold",
                            statusClass(status)
                          )}
                        >
                          {status}
                        </span>
                        {response.description && (
                          <span className="text-sm text-muted-foreground">
                            {response.description}
                          </span>
                        )}
                      </div>
                      {json?.example && (
                        <CodeBlock
                          language="json"
                          code={JSON.stringify(json.example, null, 2)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
