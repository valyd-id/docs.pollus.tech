import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToElement, scrollToId } from "@/lib/scroll";
import { VerifySidebar } from "@/components/verify/VerifySidebar";
import { type VerifyMode } from "@/components/verify/ModeSwitch";
import { Layout } from "@/components/Layout";
import { IntroSection } from "@/components/verify/sections/IntroSection";
import { QuickstartSection } from "@/components/verify/sections/QuickstartSection";
import { ConsoleSection } from "@/components/verify/sections/ConsoleSection";
import { ModesSection } from "@/components/verify/sections/ModesSection";
import { HostedSection } from "@/components/verify/sections/HostedSection";
import { StandaloneSection } from "@/components/verify/sections/StandaloneSection";
import { ManagedSection } from "@/components/verify/sections/ManagedSection";
import { SdkSection } from "@/components/verify/sections/SdkSection";
import { ApiReferenceSection } from "@/components/verify/sections/ApiReferenceSection";

// Section ids per mode, used for scroll-spy. Shared ids appear in both.
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
const HOSTED_IDS = [
  "hosted",
  "hosted-overview",
  "hosted-products",
  "hosted-steps",
  "hosted-webhooks",
  "hosted-decision",
  "hosted-statuses",
  "hosted-api",
  ...SDK_IDS,
  "api-sessions",
  "api-workflows",
  "api-decision",
  "api-demo",
  "api-errors",
];
// One anchor per Core API check — keeps the sidebar highlight in sync while reading them.
const CORE_IDS = [
  "core-account-vs-fresh",
  "core-id-verification",
  "core-liveness",
  "core-face-match",
  "core-age-verification",
  "core-credential-verification",
  "core-kyc-credential",
  "core-location",
];
const STANDALONE_IDS = ["standalone", ...CORE_IDS, ...SDK_IDS, "api-standalone", "api-demo", "api-errors"];
const MANAGED_IDS = [
  "managed",
  "managed-overview",
  "managed-register",
  "managed-login",
  "managed-exchange",
  "managed-kyc",
  "managed-session",
  "managed-redirect",
  "managed-writeback",
  "managed-result",
  "managed-reuse",
  ...SDK_IDS,
  "api-errors",
];

const parseMode = (search: string): VerifyMode => {
  const m = new URLSearchParams(search).get("mode");
  return m === "standalone" || m === "managed" ? m : "hosted";
};

const readModeFromUrl = (): VerifyMode => parseMode(window.location.search);

const VerifyDocs = () => {
  const location = useLocation();
  const [active, setActive] = useState("intro");
  const [mode, setMode] = useState<VerifyMode>(readModeFromUrl);

  const sectionIds = [
    ...SHARED_IDS,
    ...(mode === "hosted" ? HOSTED_IDS : mode === "managed" ? MANAGED_IDS : STANDALONE_IDS),
  ];

  // Keep ?mode= in the URL so a chosen mode is shareable/bookmarkable.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    window.history.replaceState({}, "", url);
  }, [mode]);

  // Sync mode from URL when search navigates to /verify?mode=hosted#section.
  // replaceState (above) bypasses React Router so location.search is the
  // authoritative signal for externally-driven mode changes.
  useEffect(() => {
    setMode(parseMode(location.search));
  }, [location.search]);

  // Scroll to the section pointed at by the URL hash whenever it changes
  // (e.g. repeated ⌘K searches to the same or different Verify sections).
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        scrollToElement(el);
        setActive(hash);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [location.hash]);

  const handleClick = (id: string) => {
    setActive(id);
    scrollToId(id);
  };

  const handleModeChange = (m: VerifyMode) => {
    setMode(m);
    requestAnimationFrame(() => scrollToId("modes"));
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
  }, [mode]);

  return (
    <Layout
      product="verify"
      renderSidebar={({ onNavigate }) => (
        <VerifySidebar
          active={active}
          onClick={(id) => {
            handleClick(id);
            onNavigate?.();
          }}
          mode={mode}
          onModeChange={handleModeChange}
          onNavigate={onNavigate}
        />
      )}
    >
      <div className="max-w-4xl mx-auto px-6 py-10 lg:py-14 space-y-16 animate-fade-in">
        <IntroSection />
        <QuickstartSection />
        <ConsoleSection />
        <ModesSection mode={mode} onModeChange={handleModeChange} />

        {mode === "hosted" ? <HostedSection /> : mode === "managed" ? <ManagedSection /> : <StandaloneSection />}

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
    </Layout>
  );
};

export default VerifyDocs;
