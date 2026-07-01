import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll";

interface NavItem {
  id: string;
  label: string;
  indent?: boolean;
}

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Getting started",
    items: [
      { id: "mcp-overview",  label: "Overview" },
      { id: "mcp-base-url",  label: "Base URL & endpoint" },
      { id: "mcp-auth",      label: "Authentication" },
    ],
  },
  {
    group: "Tools",
    items: [
      { id: "mcp-tools",              label: "Tools overview" },
      { id: "mcp-verification-request", label: "verification_request", indent: true },
      { id: "mcp-verification-status",  label: "verification_status",  indent: true },
      { id: "mcp-do-task",              label: "do_task",               indent: true },
    ],
  },
  {
    group: "Integrations",
    items: [
      { id: "mcp-claude-code",    label: "Claude Code" },
      { id: "mcp-codex",          label: "Codex" },
      { id: "mcp-cursor",         label: "Cursor / Desktop" },
      { id: "mcp-langchain",      label: "LangChain" },
      { id: "mcp-openai-agents",  label: "OpenAI Agents SDK" },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "mcp-agent-flow", label: "Agent flow" },
      { id: "mcp-status",     label: "Status reference" },
      { id: "mcp-errors",     label: "Common errors" },
    ],
  },
];

interface Props {
  activeId: string;
  onNavigate?: () => void;
}

export const McpSidebar = ({ activeId, onNavigate }: Props) => {
  const handleClick = (id: string) => {
    scrollToId(id);
    onNavigate?.();
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar overflow-y-auto">
      <nav className="p-4 space-y-5">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="px-3 mb-1.5 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(item.id)}
                    className={cn(
                      "group flex w-full items-center rounded-lg text-left transition-smooth",
                      item.indent ? "py-1.5 pl-6 pr-3 text-xs" : "px-3 py-1.5 text-sm",
                      activeId === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-0.5"
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
