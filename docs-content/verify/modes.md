> Source: https://{{DOCS_BASE_URL}}/verify#modes
> Part of: Valyd Verify API documentation — static copy generated for AI agents
> Generated from repo component: ModesSection.tsx

# Hosted vs Standalone

## Agent Quick-Start
- Source URL: https://{{DOCS_BASE_URL}}/verify#modes
- Credentials / env vars needed: none to choose a mode (each mode later needs an App API key from https://{{VERIFY_BASE_URL}}/dashboard; Hosted also needs a `workflow_id`)
- Files an integrator edits: none — reference only (decision aid for picking a mode)
- Estimated steps: 0 (decision aid)
- Can complete without human input: YES — choosing a mode is a decision based on your requirements; no actions required
- Prerequisites: none

Valyd Verify offers two integration modes. Use the decision tree to pick one, then follow the matching path.

## Decision tree

```text
IF you need an end-user KYC flow with live camera/ID + selfie capture, and you do NOT want to build the capture UI:
  → Use Hosted. Redirect the user to a Valyd-hosted session URL; receive the result via webhook + decision API.
  → Next: create a Workflow (get workflow_id) and configure a webhook in the Console (https://{{DOCS_BASE_URL}}/verify#console), then create a session (https://{{DOCS_BASE_URL}}/verify#quickstart).

IF you want to call individual capabilities server-to-server from your backend with your own UI and data, and want a synchronous result:
  → Use Standalone. Call the per-endpoint REST API (e.g. POST /api/v2/age-verification) with your App API key.
  → Next: get an App API key from the Console (https://{{DOCS_BASE_URL}}/verify#console), then call the endpoint (https://{{DOCS_BASE_URL}}/verify#quickstart).

IF your use case is backoffice, batch processing, or a fully custom UX (no camera redirect):
  → Use Standalone.

IF unsure:
  → If a human end-user must take a live selfie/photo of their ID in a browser, choose Hosted.
  → Otherwise choose Standalone.
```

## Comparison

| Aspect | Hosted | Standalone |
| --- | --- | --- |
| UI | Valyd-hosted capture page | You build it |
| Trigger | Redirect user to session URL | Server-to-server REST call |
| Result delivery | Webhook + decision API | Synchronous response |
| Best for | End-user KYC flows with camera | Backoffice, batch, custom UX |
| Identifier | `workflow_id` (bundle of services) | Per-endpoint call |
