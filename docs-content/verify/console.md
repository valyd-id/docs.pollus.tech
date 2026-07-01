> Source: https://{{DOCS_BASE_URL}}/verify#console
> Part of: Valyd Verify API documentation — static copy generated for AI agents
> Generated from repo component: ConsoleSection.tsx

# The Developer Console

## Agent Quick-Start
- Source URL: https://{{DOCS_BASE_URL}}/verify#console
- Credentials / env vars needed: none to read this page; using the Console produces the App ID, App API key, `workflow_id`, and webhook signing secret your integration will need
- Files an integrator edits: none — reference only (the Console is a web UI)
- Estimated steps: 0 (reference; the actions described are human-only UI steps)
- Can complete without human input: NO — every action here is performed by a human in the web UI at https://{{VERIFY_BASE_URL}}/dashboard (Valyd SSO sign-in, creating Apps/Workflows, configuring webhooks, copying secrets)
- Prerequisites:
  - A Valyd SSO account
  - A browser to reach https://{{VERIFY_BASE_URL}}/dashboard

The console lives at https://{{VERIFY_BASE_URL}}/dashboard. Sign in with Valyd SSO — your first sign-in auto-creates an App.

The actions below are performed by a human in the Console web UI; they cannot be automated by an agent. The values they produce (App ID, API key, `workflow_id`, signing secret) are what your code then uses.

## Apps
Each App has a unique `App ID` and a secret API key (shown once at creation, rotatable). Create multiple apps such as Test and Production.

- The API key is shown **once** at creation. Copy it immediately and store it server-side.
- If lost, rotate the key in the Console to generate a new one.

## Workflows
Bundle services (ID, liveness, face match, and the other Verify services) into a reusable Workflow. Each Workflow has a `workflow_id` used when creating Hosted sessions.

- The `workflow_id` is required as the `workflow_id` field when creating a Hosted session (see https://{{DOCS_BASE_URL}}/verify#quickstart).

## Webhooks
Configure a per-app endpoint URL and signing secret (rotatable). Valyd POSTs signed events to this URL when a session reaches a terminal state.

- Set both the endpoint URL and the signing secret per App.
- Verify the signature on incoming events using the signing secret before trusting them.

## SSO
The console uses Valyd SSO. Your developer account is separate from end-users you verify.

## Human-only checklist (in the Console)

```text
IF you do not yet have an App API key:
  → Sign in at https://{{VERIFY_BASE_URL}}/dashboard with Valyd SSO (first sign-in auto-creates an App)
  → Open your App and copy the API key shown once at creation; store it server-side
IF you lost the API key:
  → In the Console, rotate the App API key to generate a new one
IF you will use Hosted mode:
  → Create a Workflow bundling the services you need and copy its workflow_id
  → Under Webhooks, set the endpoint URL and copy the signing secret
IF you will use Standalone mode only:
  → You only need the App API key; Workflows and Webhooks are not required
```
