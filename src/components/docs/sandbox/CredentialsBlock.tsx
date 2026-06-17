import { useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  SANDBOX_BASE_URL,
  SANDBOX_CLIENT_ID,
  SANDBOX_CLIENT_SECRET,
} from "./constants";

const rows: { label: string; value: string }[] = [
  { label: "client_id", value: SANDBOX_CLIENT_ID },
  { label: "client_secret", value: SANDBOX_CLIENT_SECRET },
  { label: "base URL", value: SANDBOX_BASE_URL },
];

export const CredentialsBlock = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copy = async (val: string, idx: number) => {
    await navigator.clipboard.writeText(val);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm space-y-1.5">
      {rows.map((r, i) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="text-muted-foreground w-32 shrink-0">{r.label}:</span>
          <span className="text-foreground flex-1 break-all">{r.value}</span>
          <button
            onClick={() => copy(r.value, i)}
            className="p-1.5 rounded-md hover:bg-background border border-transparent hover:border-border transition-colors shrink-0"
            title={`Copy ${r.label}`}
            aria-label={`Copy ${r.label}`}
          >
            {copiedIdx === i ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};
