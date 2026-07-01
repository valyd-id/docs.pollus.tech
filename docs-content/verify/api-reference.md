> Source: https://{{DOCS_BASE_URL}}/verify#api-sessions
> Part of: Valyd Verify API documentation — static copy generated for AI agents
> Generated from repo component: ApiReferenceSection.tsx

# API Reference

## Agent Quick-Start
- Source URL: https://{{DOCS_BASE_URL}}/verify#api-sessions
- Credentials / env vars needed: VALYD_API_KEY (your App API key, sent as the `X-API-Key` header)
- Files an integrator edits: none — reference only (server code uses these endpoints)
- Estimated steps: 0
- Can complete without human input: YES — this is a reference page; no actions required.
- Prerequisites:
  - An App API key from the Valyd Verify Developer Console (https://{{VERIFY_BASE_URL}}/dashboard)
  - For workflow-based sessions, a `workflow_id` configured in the Developer Console

Base URL for all endpoints: `https://{{VERIFY_BASE_URL}}`

### Authentication (applies to every call)
Every call uses the header:

```http
X-API-Key: <App API key>
```

A Bearer token is also accepted:

```http
Authorization: Bearer <App API key>
```

Get your App API key from the Valyd Verify Developer Console (https://{{VERIFY_BASE_URL}}/dashboard). Authenticated endpoints are billed per call against your App.

## Sessions

| Method | Path                              | Description                                          |
|--------|-----------------------------------|------------------------------------------------------|
| POST   | `/api/v2/session`                 | Create a hosted verification session                 |
| GET    | `/api/v2/session`                 | List sessions                                        |
| GET    | `/api/v2/session/{id}`            | Retrieve a session                                   |
| PATCH  | `/api/v2/session/{id}/status`     | Manual override: `{ status: APPROVED | DECLINED }`   |

### POST /api/v2/session — create a hosted verification session

Full URL: `https://{{VERIFY_BASE_URL}}/api/v2/session`

```bash
curl -X POST https://{{VERIFY_BASE_URL}}/api/v2/session \
  -H "X-API-Key: $VALYD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "workflow_id": "WORKFLOW_ID", "vendor_data": "user-123" }'
```

`workflow_id` (get it from the Developer Console: https://{{VERIFY_BASE_URL}}/dashboard) selects the bundle of services to run. `vendor_data` is your own correlation string, echoed back on webhooks and the decision.

**Expected output:** HTTP 200/201 with a created session object including its session id and a hosted verification URL to send the user to.

### GET /api/v2/session — list sessions

Full URL: `https://{{VERIFY_BASE_URL}}/api/v2/session`

```bash
curl https://{{VERIFY_BASE_URL}}/api/v2/session \
  -H "X-API-Key: $VALYD_API_KEY"
```

**Expected output:** HTTP 200 with a list of session objects.

### GET /api/v2/session/{id} — retrieve a session

Full URL: `https://{{VERIFY_BASE_URL}}/api/v2/session/{id}`

```bash
curl https://{{VERIFY_BASE_URL}}/api/v2/session/SES_ID \
  -H "X-API-Key: $VALYD_API_KEY"
```

**Expected output:** HTTP 200 with the session object, including its current `status` (see statuses.md for all values).

### PATCH /api/v2/session/{id}/status — manual override

Full URL: `https://{{VERIFY_BASE_URL}}/api/v2/session/{id}/status`

Manually force a terminal decision. Body must set `status` to `APPROVED` or `DECLINED`.

```bash
curl -X PATCH https://{{VERIFY_BASE_URL}}/api/v2/session/SES_ID/status \
  -H "X-API-Key: $VALYD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "status": "APPROVED" }'
```

**Expected output:** HTTP 200 with the updated session reflecting the overridden status.

## Workflows

Workflows are configured in the Developer Console (https://{{VERIFY_BASE_URL}}/dashboard). A workflow bundles services and exposes a stable `workflow_id` that you pass when creating a session.

Available services that a workflow can bundle:
- `id_verification`
- `liveness`
- `face_match`
- `age`
- `credential`

There is no REST endpoint to create a workflow from this reference — workflows are defined in the Developer Console, and you reference the resulting `workflow_id` in `POST /api/v2/session`.

## Standalone checks

Run a single check directly without a hosted session.

| Method | Path                                      | Description                              |
|--------|-------------------------------------------|------------------------------------------|
| POST   | `/api/v2/id-verification`                 | OCR + authenticity from a government ID  |
| POST   | `/api/v2/liveness`                        | Passive liveness from a selfie           |
| POST   | `/api/v2/face-match`                      | Selfie vs reference portrait             |
| POST   | `/api/v2/age-verification`                | Age bands from a DOB                     |
| POST   | `/api/v2/credential-verification`         | Professional license lookup              |

Each is called with the `X-API-Key` header. Example:

```bash
curl -X POST https://{{VERIFY_BASE_URL}}/api/v2/id-verification \
  -H "X-API-Key: $VALYD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "...": "service-specific input" }'
```

**Expected output:** HTTP 200 with the check result, including a per-check status of `passed`, `failed`, or `review` (see statuses.md).

Full URLs:
- `https://{{VERIFY_BASE_URL}}/api/v2/id-verification`
- `https://{{VERIFY_BASE_URL}}/api/v2/liveness`
- `https://{{VERIFY_BASE_URL}}/api/v2/face-match`
- `https://{{VERIFY_BASE_URL}}/api/v2/age-verification`
- `https://{{VERIFY_BASE_URL}}/api/v2/credential-verification`

## Decision

| Method | Path                                | Description                       |
|--------|-------------------------------------|-----------------------------------|
| GET    | `/api/v2/session/{id}/decision`     | Full decision and per-check data  |

Full URL: `https://{{VERIFY_BASE_URL}}/api/v2/session/{id}/decision`

```bash
curl https://{{VERIFY_BASE_URL}}/api/v2/session/SES_ID/decision -H "X-API-Key: $VALYD_API_KEY"
```

**Expected output:** HTTP 200 with the full decision and per-check data for the session. Call this after a terminal webhook to retrieve all extracted data (the webhook is only a notification).

## Errors & rate limits

Errors use the same response envelope with `success: false` and an HTTP status that reflects the error class.

```json
{
  "success": false,
  "error": { "code": "invalid_api_key", "message": "API key is missing or invalid" }
}
```

| HTTP | Code               | When                                                 |
|------|--------------------|------------------------------------------------------|
| 400  | `validation_error` | Malformed body or missing required field             |
| 401  | `invalid_api_key`  | Missing/invalid `X-API-Key` header                   |
| 404  | `not_found`        | Session or resource does not exist                   |
| 422  | `unprocessable`    | Could not process the input (e.g. unreadable image)  |
| 429  | `rate_limited`     | Public/demo endpoints rate limit exceeded            |
| 500  | `internal_error`   | Unexpected server error — safe to retry              |

Rate limits and billing:
- Authenticated endpoints are billed per call against your App.
- Public/demo endpoints return HTTP 429 with `code: "rate_limited"` when limits are exceeded.

### Decision tree — handling an error response

```text
IF HTTP 400 (validation_error):  → fix the request body / add the missing required field, then retry.
IF HTTP 401 (invalid_api_key):   → set the X-API-Key header to a valid App API key (from https://{{VERIFY_BASE_URL}}/dashboard); do not retry until fixed.
IF HTTP 404 (not_found):         → verify the session/resource id; do not retry the same id.
IF HTTP 422 (unprocessable):     → the input could not be processed (e.g. unreadable image); collect new/clearer input and retry.
IF HTTP 429 (rate_limited):      → back off and retry later; you have exceeded public/demo limits.
IF HTTP 500 (internal_error):    → safe to retry (with backoff).
```
