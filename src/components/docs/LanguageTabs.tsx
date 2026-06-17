import { useState } from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

interface CodeExample {
  language: string;
  label: string;
  code: string;
}

interface LanguageTabsProps {
  examples: CodeExample[];
  title?: string;
}

export const LanguageTabs = ({ examples, title }: LanguageTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {title && (
        <div className="px-4 py-2 border-b border-border bg-muted">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
        </div>
      )}
      <div className="flex border-b border-border bg-muted/50">
        {examples.map((example, index) => (
          <button
            key={example.language}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === index
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {example.label}
          </button>
        ))}
      </div>
      <CodeBlock
        code={examples[activeTab].code}
        language={examples[activeTab].language}
      />
    </div>
  );
};
