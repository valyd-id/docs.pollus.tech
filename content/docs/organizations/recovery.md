---
product: valyd-id
api_version: oidc
auth: client-credentials
billable: true
pii_mode: proofs
human_setup_required: true
source_of_truth: manual
---

# Account Recovery

Let a locked-out member of your organization regain access by **re-verifying their identity with
Valyd** — **without Valyd ever storing or resetting your passwords**. Valyd verifies the person
(liveness + a face match against the face they enrolled, optionally a document/KYC check) and returns
a **pass/fail** decision on your Verify webhook. On a pass, you permit the reset in **your own**
system.

This is the right tool when your app uses **email/password** (or any credential you own) and a user
forgets it: instead of a knowledge-based reset, you get a **biometric identity proof** that the
person asking is the same Valyd account.

> This is **not** the Valyd end-user "recovery phrase" (E2E vault) flow. It is a server-to-server API
> for organization apps that manage their own credentials, under the same `/api/sdk` surface as the
> [Organization API](/docs/organizations/api).

## Prerequisites

- The member must be a **claimed, active member** of your org with a **`valyd_id` and an enrolled
  face** on file. Members onboarded through [Workforce onboarding](/docs/organizations/onboarding)
  qualify; so does anyone you register with [`bindMember`](#bindmember) after they connect Valyd.
  Never-claimed or faceless members are **not** recoverable (fail-closed).
- You have your app's `clientId` / `clientSecret` and a Verify **project + webhook** configured.

## Flow

```
1. User can't sign in → your "Forgot password" (or an admin action) collects their email.
2. Your server calls  startAccountRecovery({ email })  → Valyd starts a hosted session and
   (with deliverEmail) emails the member a verification link.
3. The member opens the link → completes liveness + face match (and document/KYC if you use
   the with_id variant) against their on-file Valyd identity.
4. Valyd sends a signed webhook to your callback → verify.approved  or  verify.declined.
5. On approved, YOUR app lets the user set a new password. Valyd sets nothing.
```

## Registering members who connect after sign-in

If your users sign in with email/password first and **connect Valyd afterwards** (OIDC), register
that binding once so they become recoverable. Call `bindMember` when the OIDC callback returns the
member's `valyd_id`:

### `bindMember`

```ts
// After the member completes "Connect with Valyd" and you have their valyd_id:
const member = await client.bindMember({
  valydId: "valyd_…",          // from the OIDC id_token / userinfo
  email: "jane@acme.com",       // the email they sign in to YOUR app with
  firstName: "Jane",
  lastName: "Doe",
});
// member.status === "active"  → they are now a recoverable org member.
```

`POST /api/sdk/members/bind` — idempotent upsert. It marks the member **active** and bound to that
`valyd_id`. Members added through Workforce onboarding are already bound and do not need this.

## Start a recovery

### `startAccountRecovery`

```ts
import { ValydClient } from "@valyd/sdk";

// Server-side only — the same client you use for the Organization API.
const client = new ValydClient({
  clientId: process.env.VALYD_CLIENT_ID!,
  clientSecret: process.env.VALYD_CLIENT_SECRET!,
});

const rec = await client.startAccountRecovery({
  email: "jane@acme.com",          // or: valydId, or memberUid
  variant: "with_id",              // "without_id" = liveness + face; "with_id" also runs document/KYC
  deliverEmail: true,              // Valyd emails the link to the member's on-file address
  appName: "Acme",                 // shown in the email subject/body
  callback: "https://acme.com/valyd/webhook",   // your Verify webhook
  redirectUrl: "https://acme.com/reset",        // where the user lands after verifying
  vendorData: "reset-req-123",     // echoed back on the webhook
});

if (!rec.eligible) {
  // Fail-closed: unknown / inactive / unclaimed member. Show a GENERIC
  // "if an account exists, we've emailed you" message (avoid enumeration).
  return;
}

// With deliverEmail:true the member already has the link. Otherwise deliver rec.recoveryUrl yourself.
```

`POST /api/sdk/recovery/session` accepts one identifier (`valydId`, `email`, or `memberUid`) and
returns `{ eligible, recoveryUrl, emailed, sessionId, status, expiresAt }`.

| Field | Meaning |
|---|---|
| `eligible` | `false` when no claimed, active, face-enrolled member matched — no session was started. |
| `recoveryUrl` | URL of the verification page where the member completes recovery (null when not eligible). |
| `emailed` | `true` when `deliverEmail` was set and Valyd emailed the member the link. |
| `sessionId` | The Verify session id — correlate it to the webhook. |
| `status` | Initial session status (`NOT_STARTED`). |
| `expiresAt` | When the session/link expires. |

### Verification depth — `variant`

| Variant | Steps the member completes |
|---|---|
| `without_id` | **Liveness** + **face match** against their on-file Valyd face. |
| `with_id` | **Liveness** + **document verification (KYC)** + **face match**. **Managed by Valyd**: if the account is **already KYC-verified**, the document step is **reused and skipped** — the member only does liveness + face. |

Use `with_id` when you want a government-ID-backed recovery; the managed reuse means verified members
aren't asked to re-scan an ID they've already verified.

## Handle the outcome

Same webhook you already use for verifications — verify the signature with your Verify client:

```ts
import { VerifyClient } from "@valyd/sdk";

const verify = new VerifyClient({
  apiKey: process.env.VERIFY_API_KEY!,
  webhookSecret: process.env.VERIFY_WEBHOOK_SECRET!,
});

const event = verify.webhooks.constructEvent(rawBody, req.headers);

// event.vendorData === "reset-req-123"
if (event.status === "APPROVED") {
  // Identity re-verified → permit the user to set a new password in YOUR system.
} else {
  // Declined → do not allow the reset.
}
```

To make the flow robust to webhook timing, you can also **poll** the session decision on the page
the user returns to (`redirectUrl`) and treat `APPROVED` as the go-ahead — the webhook and the poll
agree on the same decision.

## Security

- **Fail closed** everywhere: no claimed/face-enrolled match → no session; no face match → `DECLINED`.
- Valyd stores/sets **no** passwords — it only returns the pass/fail decision.
- **Delivering the link to the right person** is safest via `deliverEmail: true`: Valyd emails the
  link to the address already **on file**, never to the caller, which closes the enumeration gap.
- The start endpoint is **rate-limited**. Return a **generic** response whether or not an account
  exists, so this can't be used to probe which emails are registered.
- `bindMember` and `startAccountRecovery` are **server-to-server** — the client secret must never
  reach a browser.
