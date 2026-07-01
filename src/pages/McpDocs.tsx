import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { McpSidebar } from "@/components/mcp/McpSidebar";
import { McpContent } from "@/components/mcp/McpContent";

const SECTION_IDS = [
  "mcp-overview",
  "mcp-base-url",
  "mcp-auth",
  "mcp-tools",
  "mcp-verification-request",
  "mcp-verification-status",
  "mcp-do-task",
  "mcp-claude-code",
  "mcp-codex",
  "mcp-cursor",
  "mcp-langchain",
  "mcp-openai-agents",
  "mcp-agent-flow",
  "mcp-status",
  "mcp-errors",
];

const McpDocs = () => {
  const [activeId, setActiveId] = useState("mcp-overview");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <Layout
      product="mcp"
      renderSidebar={({ onNavigate }) => (
        <McpSidebar activeId={activeId} onNavigate={onNavigate} />
      )}
    >
      <div className="max-w-3xl mx-auto px-6 py-10 lg:py-14 animate-fade-in">
        <McpContent />
        <footer className="border-t border-border pt-8 mt-16 text-center text-muted-foreground text-sm">
          <p>© 2025 Valyd. All rights reserved.</p>
          <p className="mt-2">
            Need help?{" "}
            <a href="mailto:support@valyd.id" className="text-primary hover:underline">
              support@valyd.id
            </a>
          </p>
        </footer>
      </div>
    </Layout>
  );
};

export default McpDocs;
