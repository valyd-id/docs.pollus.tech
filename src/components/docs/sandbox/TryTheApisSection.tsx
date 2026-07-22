import { useMemo, useState } from "react";
import { Loader2, Play, Info } from "lucide-react";
import { CredentialsBlock } from "./CredentialsBlock";
import { PasteInput } from "./PasteInput";
import { DemoUserPicker } from "./DemoUserPicker";
import { ScopePicker } from "./ScopePicker";
import { StepCard } from "./StepCard";
import { SnippetTabs } from "./SnippetTabs";
import { JsonPanel } from "./JsonPanel";
import { DEFAULT_SCOPES, SANDBOX_REDIRECT_URI, type DemoUser } from "./constants";
import { API_CONFIG } from "@/lib/api-config";
import {
  issueCode,
  exchangeToken,
  getUserinfo,
  getLicenses,
  getVerifications,
  refreshAccessToken,
  type ApiResult,
} from "./sandboxClient";
import {
  step1Snippet,
  step2Snippet,
  bearerSnippet,
  refreshSnippet,
} from "./snippets";
import { decodeJwtPayload } from "./jwt";

type Tokens = {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
};

type Loading = Partial<Record<
  "step1" | "step2" | "userinfo" | "licenses" | "verifications" | "refresh",
  boolean
>>;

export const TryTheApisSection = () => {
  const [demoUser, setDemoUser] = useState<DemoUser>("nurse");
  const [scopes, setScopes] = useState<Set<string>>(new Set(DEFAULT_SCOPES));

  const [code, setCode] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);

  // Editable inputs the dev can paste into. Auto-filled from upstream results.
  const [codeInput, setCodeInput] = useState("");
  const [accessTokenInput, setAccessTokenInput] = useState("");
  const [refreshTokenInput, setRefreshTokenInput] = useState("");

  const [step1Res, setStep1Res] = useState<ApiResult | null>(null);
  const [step2Res, setStep2Res] = useState<ApiResult | null>(null);
  const [userinfoRes, setUserinfoRes] = useState<ApiResult | null>(null);
  const [licensesRes, setLicensesRes] = useState<ApiResult | null>(null);
  const [verificationsRes, setVerificationsRes] = useState<ApiResult | null>(null);
  const [refreshRes, setRefreshRes] = useState<ApiResult | null>(null);

  const [loading, setLoading] = useState<Loading>({});
  const [selectionDirty, setSelectionDirty] = useState(false);

  const scopeList = useMemo(() => Array.from(scopes), [scopes]);

  const resetDownstream = () => {
    setCode(null);
    setTokens(null);
    setCodeInput("");
    setAccessTokenInput("");
    setRefreshTokenInput("");
    setStep1Res(null);
    setStep2Res(null);
    setUserinfoRes(null);
    setLicensesRes(null);
    setVerificationsRes(null);
    setRefreshRes(null);
  };

  const handleUserChange = (u: DemoUser) => {
    setDemoUser(u);
    resetDownstream();
    setSelectionDirty(true);
  };

  const handleScopesChange = (s: Set<string>) => {
    setScopes(s);
    resetDownstream();
    setSelectionDirty(true);
  };

  const runStep1 = async () => {
    setLoading((l) => ({ ...l, step1: true }));
    setSelectionDirty(false);
    const res = await issueCode(demoUser, scopeList);
    setStep1Res(res);
    if (res.ok && res.body?.code) {
      setCode(res.body.code);
      setCodeInput(res.body.code);
    } else {
      setCode(null);
      setTokens(null);
    }
    setLoading((l) => ({ ...l, step1: false }));
  };

  const runStep2 = async () => {
    const c = codeInput.trim();
    if (!c) return;
    setLoading((l) => ({ ...l, step2: true }));
    const res = await exchangeToken(c);
    setStep2Res(res);
    if (res.ok && res.body?.access_token) {
      const t = res.body as Tokens;
      setTokens(t);
      setAccessTokenInput(t.access_token);
      setRefreshTokenInput(t.refresh_token ?? "");
    } else {
      setTokens(null);
    }
    setLoading((l) => ({ ...l, step2: false }));
  };

  const runProtected = async (
    key: "userinfo" | "licenses" | "verifications",
    fn: (t: string) => Promise<ApiResult>,
    setter: (r: ApiResult) => void
  ) => {
    const t = accessTokenInput.trim();
    if (!t) return;
    setLoading((l) => ({ ...l, [key]: true }));
    const res = await fn(t);
    setter(res);
    setLoading((l) => ({ ...l, [key]: false }));
  };

  const runRefresh = async () => {
    const rt = refreshTokenInput.trim();
    if (!rt) return;
    setLoading((l) => ({ ...l, refresh: true }));
    const res = await refreshAccessToken(rt);
    setRefreshRes(res);
    if (res.ok && res.body?.access_token) {
      setTokens((t) => ({
        ...(t as Tokens),
        access_token: res.body.access_token,
        refresh_token: res.body.refresh_token ?? t?.refresh_token,
        expires_in: res.body.expires_in ?? t?.expires_in,
      }));
      setAccessTokenInput(res.body.access_token);
      if (res.body.refresh_token) setRefreshTokenInput(res.body.refresh_token);
    }
    setLoading((l) => ({ ...l, refresh: false }));
  };

  const decodedIdToken = useMemo(
    () => (tokens?.id_token ? decodeJwtPayload(tokens.id_token) : null),
    [tokens?.id_token]
  );

  const step2Disabled = !codeInput.trim();
  const step3Disabled = !accessTokenInput.trim();
  const step4Disabled = !refreshTokenInput.trim();

  const btn =
    "inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors";
  const btnPrimary = `${btn} bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed`;
  const btnSecondary = `${btn} border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <section id="try-the-apis" className="scroll-mt-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Try the APIs (no signup)
      </h2>
      <p className="text-muted-foreground mb-6">
        Call the live Pollus IDP APIs from your browser using shared sandbox credentials.
        No account, no proxy — every request goes straight to{" "}
        <code className="text-foreground">idp.valyd.work</code>.
      </p>

      <div className="space-y-6">
        <CredentialsBlock />

        <div className="grid md:grid-cols-2 gap-4">
          <DemoUserPicker value={demoUser} onChange={handleUserChange} />
          <ScopePicker selected={scopes} onChange={handleScopesChange} />
        </div>

        <p className="text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-3">
          Try changing the demo user or scopes and re-run — watch how{" "}
          <code>/userinfo</code> and <code>/licenses</code> change.
        </p>

        {selectionDirty && (step1Res || tokens) && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Selection changed — re-run Step 1.
          </div>
        )}

        {/* Step 1 */}
        <StepCard
          step="Step 1"
          title="Get authorization code"
          description={
            <span className="inline-flex items-center gap-1">
              Issues a short-lived OAuth code for the selected demo user.
              <span
                title={`redirect_uri is required by /sandbox/issue-code to mirror the real OAuth flow. The playground always sends ${SANDBOX_REDIRECT_URI} — you are never actually redirected.`}
                className="inline-flex items-center text-muted-foreground cursor-help"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </span>
          }
          buttons={
            <button
              onClick={runStep1}
              disabled={loading.step1}
              className={btnPrimary}
            >
              {loading.step1 ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Get authorization code
            </button>
          }
          result={step1Res}
          snippet={step1Snippet(demoUser, scopeList)}
        />

        {/* Step 2 */}
        <StepCard
          step="Step 2"
          title="Exchange code for tokens"
          description="Paste the code from Step 1 (auto-filled when you run Step 1 above) and exchange it for access, ID, and refresh tokens."
          buttons={
            <button
              onClick={runStep2}
              disabled={step2Disabled || loading.step2}
              title={step2Disabled ? "Run Step 1 or paste a code first" : undefined}
              className={btnPrimary}
            >
              {loading.step2 ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Exchange code for tokens
            </button>
          }
          result={step2Res}
          snippet={step2Snippet(codeInput || null)}
          inputs={
            <PasteInput
              label="Authorization code"
              value={codeInput}
              onChange={setCodeInput}
              placeholder="Paste the code from Step 1 here"
              hint="auto-filled from Step 1"
            />
          }
          extra={
            decodedIdToken ? (
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Decoded id_token payload
                </div>
                <JsonPanel data={decodedIdToken} ok status={200} label="id_token" />
              </div>
            ) : undefined
          }
        />

        {/* Step 3 */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step 3
              </span>
              <h3 className="text-lg font-semibold text-foreground">
                Call protected endpoints
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Paste the <code>access_token</code> from Step 2 (auto-filled when you exchange a code). Each request sends it as <code>Authorization: Bearer …</code>.
            </p>
          </div>

          <PasteInput
            label="Access token"
            value={accessTokenInput}
            onChange={setAccessTokenInput}
            placeholder="Paste the access_token from Step 2 here"
            hint="auto-filled from Step 2 / Step 4"
          />

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                key: "userinfo" as const,
                label: "GET /userinfo",
                path: "/api/auth/tpsso/userinfo",
                fn: getUserinfo,
                res: userinfoRes,
                setter: setUserinfoRes,
              },
              {
                key: "licenses" as const,
                label: "GET /licenses",
                path: "/api/auth/tpsso/licenses",
                fn: getLicenses,
                res: licensesRes,
                setter: setLicensesRes,
              },
              {
                key: "verifications" as const,
                label: "GET /verifications",
                path: "/api/auth/tpsso/verifications",
                fn: getVerifications,
                res: verificationsRes,
                setter: setVerificationsRes,
              },
            ].map((ep) => (
              <div key={ep.key} className="space-y-3">
                <button
                  onClick={() => runProtected(ep.key, ep.fn, ep.setter)}
                  disabled={step3Disabled || loading[ep.key]}
                  title={step3Disabled ? "Paste an access_token first" : undefined}
                  className={`${btnPrimary} w-full justify-center`}
                >
                  {loading[ep.key] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {ep.label}
                </button>
                <JsonPanel
                  data={ep.res?.body ?? null}
                  ok={ep.res?.ok}
                  status={ep.res?.status}
                />
                <SnippetTabs
                  snippet={bearerSnippet(ep.path, accessTokenInput || null)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Step 4 */}
        <StepCard
          step="Step 4"
          title="Refresh access token"
          description="Paste the refresh_token from Step 2 (auto-filled) to mint a fresh access_token. Step 3 picks it up automatically."
          buttons={
            <button
              onClick={runRefresh}
              disabled={step4Disabled || loading.refresh}
              title={step4Disabled ? "Paste a refresh_token first" : undefined}
              className={btnPrimary}
            >
              {loading.refresh ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Refresh access token
            </button>
          }
          result={refreshRes}
          snippet={refreshSnippet(refreshTokenInput || null)}
          inputs={
            <PasteInput
              label="Refresh token"
              value={refreshTokenInput}
              onChange={setRefreshTokenInput}
              placeholder="Paste the refresh_token from Step 2 here"
              hint="auto-filled from Step 2"
            />
          }
        />

        <div className="rounded-md border-l-4 border-primary bg-muted/40 px-4 py-3 text-sm text-muted-foreground italic">
          When you're ready for production, sign up at{" "}
          <a
            href={API_CONFIG.DEV_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary not-italic font-medium hover:underline"
          >
            {API_CONFIG.DEV_PORTAL_URL.replace(/^https?:\/\//, "")}
          </a>{" "}
          and create a real project. Swap these credentials with your production
          ones — no code changes.
        </div>
      </div>
    </section>
  );
};

