import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { VerifySidebar } from "@/components/verify/VerifySidebar";
import { ModeSwitchCompact, type VerifyMode } from "@/components/verify/ModeSwitch";
import { type VerifyProduct } from "@/components/verify/ProductSwitch";
import valydWordmark from "@/assets/valyd-wordmark.png";
import { IntroSection } from "@/components/verify/sections/IntroSection";
import { QuickstartSection } from "@/components/verify/sections/QuickstartSection";
import { ConsoleSection } from "@/components/verify/sections/ConsoleSection";
import { ModesSection } from "@/components/verify/sections/ModesSection";
import { ManagedSection } from "@/components/verify/sections/ManagedSection";
import { VerifyFreshSection } from "@/components/verify/sections/VerifyFreshSection";
import { StandaloneSection } from "@/components/verify/sections/StandaloneSection";
import { SdkSection } from "@/components/verify/sections/SdkSection";
import { ApiReferenceSection } from "@/components/verify/sections/ApiReferenceSection";

// Section ids per path, used for scroll-spy. Shared ids appear everywhere.
const SHARED_IDS = ["intro", "quickstart", "console", "modes"];
const SDK_IDS = [
  "sdk",
  "sdk-install",
  "sdk-config",
  "sdk-resources",
  "sdk-types",
  "sdk-errors",
  "sdk-quickstarts",
  "sdk-webhook",
];
const HOSTED_API_IDS = ["api-sessions", "api-workflows", "api-decision", "api-errors"];
const MANAGED_IDS = [
  "hosted",
  "managed-register",
  "managed-login",
  "managed-callback",
  "managed-session",
  "managed-redirect",
  "managed-writeback",
  "managed-result",
  ...SDK_IDS,
  ...HOSTED_API_IDS,
];
const FRESH_IDS = [
  "hosted",
  "hosted-fresh-workflow",
  "hosted-fresh-session",
  "hosted-fresh-redirect",
  "hosted-fresh-result",
  ...SDK_IDS,
  ...HOSTED_API_IDS,
];
const STANDALONE_IDS = ["standalone", ...SDK_IDS, "api-standalone", "api-errors"];

const readModeFromUrl = (): VerifyMode =>
  new URLSearchParams(window.location.search).get("mode") === "standalone" ? "standalone" : "hosted";
const readProductFromUrl = (): VerifyProduct =>
  new URLSearchParams(window.location.search).get("product") === "fresh" ? "fresh" : "managed";

const VerifyDocs = () => {
  const [active, setActive] = useState("intro");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<VerifyMode>(readModeFromUrl);
  const [product, setProduct] = useState<VerifyProduct>(readProductFromUrl);

  const hostedIds = product === "managed" ? MANAGED_IDS : FRESH_IDS;
  const sectionIds = [...SHARED_IDS, ...(mode === "hosted" ? hostedIds : STANDALONE_IDS)];

  // Keep ?mode=&product= in the URL so a chosen path is shareable/bookmarkable.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    if (mode === "hosted") url.searchParams.set("product", product);
    else url.searchParams.delete("product");
    window.history.replaceState({}, "", url);
  }, [mode, product]);

  const handleClick = (id: string) => {
    setActive(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const jumpToChooser = () =>
    requestAnimationFrame(() =>
      document.getElementById("modes")?.scrollIntoView({ behavior: "smooth", block: "start" })
    );

  const handleModeChange = (m: VerifyMode) => {
    setMode(m);
    jumpToChooser();
  };
  const handleProductChange = (p: VerifyProduct) => {
    setProduct(p);
    jumpToChooser();
  };

  useEffect(() => {
    const onScroll = () => {
      for (const id of sectionIds) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, product]);

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src={valydWordmark} alt="Valyd" className="h-6 w-auto" />
          <span className="text-xs text-muted-foreground tracking-wide">VERIFY</span>
        </a>
        <div className="flex-1 max-w-[12rem]">
          <ModeSwitchCompact mode={mode} onModeChange={handleModeChange} />
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 hover:bg-muted rounded-lg shrink-0">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <VerifySidebar active={active} onClick={handleClick} mode={mode} onModeChange={handleModeChange} product={product} onProductChange={handleProductChange} />
          </div>
        </div>
      )}

      <div className="flex">
        <div className="hidden lg:block">
          <VerifySidebar active={active} onClick={handleClick} mode={mode} onModeChange={handleModeChange} />
        </div>

        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-10 lg:py-14 space-y-16 animate-fade-in">
            <IntroSection />
            <QuickstartSection />
            <ConsoleSection />
            <ModesSection mode={mode} onModeChange={handleModeChange} product={product} onProductChange={handleProductChange} />

            {mode === "standalone" ? (
              <StandaloneSection />
            ) : product === "managed" ? (
              <ManagedSection />
            ) : (
              <VerifyFreshSection />
            )}

            <SdkSection />

            <div className="border-t border-border pt-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">API Reference</h1>
              <p className="text-muted-foreground mb-6">
                Authoritative endpoint list. Every call uses <code>X-API-Key: &lt;App API key&gt;</code>{" "}
                (Bearer is also accepted) and returns the standard response envelope.
              </p>
            </div>
            <ApiReferenceSection mode={mode} />

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
