import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DOCS_SEARCH_INDEX, type DocsSearchEntry } from "./docsSearchIndex";

interface DocsSearchProps {
  /** called after navigating, e.g. to close the mobile menu */
  onNavigate?: () => void;
}

export const DocsSearch = ({ onNavigate }: DocsSearchProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Open/close with ⌘K or Ctrl+K.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Group entries by their group label, preserving index order.
  const grouped = useMemo(() => {
    const map = new Map<string, DocsSearchEntry[]>();
    for (const entry of DOCS_SEARCH_INDEX) {
      const list = map.get(entry.group) ?? [];
      list.push(entry);
      map.set(entry.group, list);
    }
    return Array.from(map.entries());
  }, []);

  const go = (entry: DocsSearchEntry) => {
    navigate(`/docs/${entry.slug}${entry.anchor ? `#${entry.anchor}` : ""}`);
    setOpen(false);
    onNavigate?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search docs..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {grouped.map(([group, entries]) => (
            <CommandGroup key={group} heading={group}>
              {entries.map((entry) => (
                <CommandItem
                  key={`${entry.slug}-${entry.anchor ?? "root"}`}
                  value={`${entry.title} ${entry.slug} ${entry.anchor ?? ""}`}
                  keywords={entry.keywords}
                  onSelect={() => go(entry)}
                >
                  <span className="flex-1">{entry.title}</span>
                  <span className="text-xs text-muted-foreground">{entry.group}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
