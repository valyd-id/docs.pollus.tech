import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { VerifySidebar } from "@/components/verify/VerifySidebar";
import valydWordmark from "@/assets/valyd-wordmark.png";
import { IntroSection } from "@/components/verify/sections/IntroSection";
import { QuickstartSection } from "@/components/verify/sections/QuickstartSection";
import { ConsoleSection } from "@/components/verify/sections/ConsoleSection";
import { ModesSection } from "@/components/verify/sections/ModesSection";
import { HostedSection } from "@/components/verify/sections/HostedSection";
import { StandaloneSection } from "@/components/verify/sections/StandaloneSection";
import { SdkSection } from "@/components/verify/sections/SdkSection";
import { WebhooksSection } from "@/components/verify/sections/WebhooksSection";
import { StatusesSection } from "@/components/verify/sections/StatusesSection";
import { ApiReferenceSection } from "@/components/verify/sections/ApiReferenceSection";

const SECTION_IDS = [
  "intro",
  "quickstart",
  "console",
  "modes",
  "hosted",
  "hosted-overview",
  "hosted-products",
  "hosted-steps",
  "hosted-webhooks",
  "hosted-decision",
  "hosted-statuses",
  "hosted-api",
  "standalone",
  "sdk",
  "sdk-install",
  "sdk-config",
  "sdk-resources",
  "sdk-types",
  "sdk-errors",
  "sdk-quickstarts",
  "sdk-webhook",
  "webhooks",
  "statuses",
  "api-sessions",
  "api-workflows",
  "api-standalone",
  "api-decision",
  "api-errors",
];

const VerifyDocs = () => {
  const [active, setActive] = useState("intro");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (id: string) => {
    setActive(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 120 && r.bottom > 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src={valydWordmark} alt="Valyd" className="h-6 w-auto" />
          <span className="text-xs text-muted-foreground tracking-wide">VERIFY</span>
        </a>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 hover:bg-muted rounded-lg">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <VerifySidebar active={active} onClick={handleClick} />
          </div>
        </div>
      )}

      <div className="flex">
        <div className="hidden lg:block">
          <VerifySidebar active={active} onClick={handleClick} />
        </div>

        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-10 lg:py-14 space-y-16 animate-fade-in">
            <IntroSection />
            <QuickstartSection />
            <ConsoleSection />
            <ModesSection />
            <HostedSection />
            <StandaloneSection />
            <SdkSection />
            <WebhooksSection />
            <StatusesSection />
            <div className="border-t border-border pt-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">API Reference</h1>
              <p className="text-muted-foreground mb-6">
                Authoritative endpoint list. Every call uses <code>X-API-Key: &lt;App API key&gt;</code>{" "}
                (Bearer is also accepted) and returns the standard response envelope.
              </p>
            </div>
            <ApiReferenceSection />

            <footer className="border-t border-border pt-8 mt-16 text-center text-muted-foreground text-sm">
              <p>© 2025 Valyd. All rights reserved.</p>
              <p className="mt-2">
                Need help? <a href="mailto:support@valyd.id" className="text-primary hover:underline">support@valyd.id</a>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifyDocs;
