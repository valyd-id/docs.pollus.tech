import { ReactNode } from "react";
import { JsonPanel } from "./JsonPanel";
import { SnippetTabs } from "./SnippetTabs";
import type { Snippet } from "./snippets";
import type { ApiResult } from "./sandboxClient";

interface Props {
  step: string;
  title: string;
  description?: ReactNode;
  buttons: ReactNode;
  result: ApiResult | null;
  snippet: Snippet;
  resultLabel?: string;
  inputs?: ReactNode;
  extra?: ReactNode;
}

export const StepCard = ({
  step,
  title,
  description,
  buttons,
  result,
  snippet,
  resultLabel,
  inputs,
  extra,
}: Props) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {step}
          </span>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {inputs}

      <div className="flex flex-wrap gap-2">{buttons}</div>

      <JsonPanel
        data={result?.body ?? null}
        ok={result?.ok}
        status={result?.status}
        label={resultLabel}
      />

      {extra}

      <SnippetTabs snippet={snippet} />
    </div>
  );
};
