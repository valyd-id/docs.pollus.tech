import { ArrowDown, Building2, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Actor = "you" | "valyd" | "user";

const ACTOR: Record<Actor, { label: string; icon: React.ReactNode; cls: string }> = {
  you: {
    label: "Your app",
    icon: <Building2 className="h-3.5 w-3.5" />,
    cls: "bg-primary/10 text-primary border-primary/20",
  },
  valyd: {
    label: "Valyd",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    cls: "bg-accent/10 text-accent border-accent/20",
  },
  user: {
    label: "User",
    icon: <User className="h-3.5 w-3.5" />,
    cls: "bg-muted text-muted-foreground border-border",
  },
};

type Step = { actor: Actor; title: string; detail?: string; code?: string; highlight?: boolean };

const ACCOUNT_STEPS: Step[] = [
  {
    actor: "you",
    title: "Send the user to Login with Valyd",
    detail:
      "The Account model starts with the user signing in to Valyd (OAuth2 / TPSSO). This is what binds everything that follows to their account.",
  },
  {
    actor: "user",
    title: "Signs in to Valyd (or creates an account)",
  },
  {
    actor: "you",
    title: "Exchange the code for the user's access token",
    code: `const tokens = await valyd.auth.exchangeCode(code);
// tokens.accessToken  → the user's valyd_access_token`,
  },
  {
    actor: "you",
    title: "Create the session — pass the user's token",
    detail:
      "Passing valyd_access_token is what makes this an Account session. Omit it and you get the Non-account (Fresh) flow instead.",
    code: `const session = await valyd.verify.sessions.create({
  workflowId:       "wf_…",              // your workflow (e.g. EVV)
  valydAccessToken: tokens.accessToken,  // ← binds it to their Valyd account
  redirectUrl:      "https://yourapp.com/return",
  callback:         "https://yourapp.com/webhooks/valyd",
  metadata:         { /* e.g. expected_location */ },
});
// → session.url`,
    highlight: true,
  },
  {
    actor: "you",
    title: "Redirect the browser to session.url",
    detail: "Valyd's hosted page takes over. You build no capture UI and no images touch your servers.",
  },
  {
    actor: "user",
    title: "Completes the workflow on Valyd",
    detail:
      "Reuse: any step already proven on their account is SKIPPED. A first-time user does full KYC + licence; a returning user just takes a selfie, which is matched against the face vector stored on their account.",
    highlight: true,
  },
  {
    actor: "valyd",
    title: "Each step is stored on the user's Valyd account",
    detail:
      "KYC and verified licences are written to the account — the system of record — so they are reusable by any Valyd integration next time.",
  },
  {
    actor: "valyd",
    title: "Redirects back + fires the signed webhook",
    detail:
      "The user lands back on your redirect_url with session_id and status appended; the webhook hits your callback independently.",
    code: `https://yourapp.com/return?session_id=ses_…&status=APPROVED`,
  },
  {
    actor: "you",
    title: "Read the decision and act on it",
    detail:
      "Account sessions return PROOFS ONLY — never raw KYC. Use them to make your decision (e.g. location within radius → mark the visit complete).",
    code: `const d = await valyd.verify.sessions.decision(sessionId);
// d.origin === "managed"
// d.checks.id_verification → { status, id_verified }        ← proof, not raw KYC
// d.checks.face_match      → { status, score }
// d.checks.credential      → { status, licenses: [ … ] }    ← licence badge
// d.checks.location        → { status, distance_m, match }
// d.identity               → { valyd_id, pseudonym, id_verified, age_bands, licenses }`,
    highlight: true,
  },
];

const FRESH_STEPS: Step[] = [
  {
    actor: "you",
    title: "Create the session — no user token",
    detail: "No Valyd login, no account. This is a one-shot check.",
    code: `const session = await valyd.verify.sessions.create({
  workflowId:  "wf_…",
  redirectUrl: "https://yourapp.com/return",
  callback:    "https://yourapp.com/webhooks/valyd",
});
// → session.url`,
    highlight: true,
  },
  {
    actor: "you",
    title: "Redirect the browser to session.url",
  },
  {
    actor: "user",
    title: "Captures their ID + selfie on Valyd's hosted page",
    detail: "Every step runs fresh — there is no account to reuse anything from.",
  },
  {
    actor: "valyd",
    title: "Redirects back + fires the signed webhook",
    code: `https://yourapp.com/return?session_id=ses_…&status=APPROVED`,
  },
  {
    actor: "you",
    title: "Read the decision — you get the RAW captured data",
    detail:
      "You performed the capture, so the full extracted result is returned to you. Valyd retains nothing afterwards.",
    code: `const d = await valyd.verify.sessions.decision(sessionId);
// d.origin === "fresh"
// d.checks.id_verification → { status, fields: { full_name, date_of_birth,
//                              document_number }, dob, portrait, ocr_data }  ← raw
// d.checks.face_match      → { status, score }`,
    highlight: true,
  },
];

export const HostedFlowDiagram = ({ variant }: { variant: "account" | "fresh" }) => {
  const steps = variant === "account" ? ACCOUNT_STEPS : FRESH_STEPS;

  return (
    <div className="space-y-0">
      {steps.map((s, i) => {
        const a = ACTOR[s.actor];
        return (
          <div key={i}>
            <div
              className={cn(
                "rounded-lg border p-4",
                s.highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-foreground/10 text-xs font-bold text-foreground">
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
                    a.cls
                  )}
                >
                  {a.icon}
                  {a.label}
                </span>
                <span className="font-semibold text-foreground">{s.title}</span>
              </div>
              {s.detail && <p className="mt-2 text-sm text-muted-foreground">{s.detail}</p>}
              {s.code && (
                <pre className="mt-3 overflow-x-auto rounded-md bg-muted/60 p-3 text-xs leading-relaxed text-foreground">
                  <code>{s.code}</code>
                </pre>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1.5">
                <ArrowDown className="h-4 w-4 text-muted-foreground/60" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
