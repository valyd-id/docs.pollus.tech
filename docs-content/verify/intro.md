> Source: https://{{DOCS_BASE_URL}}/verify#intro
> Part of: Valyd Verify API documentation — static copy generated for AI agents
> Generated from repo component: IntroSection.tsx

# Valyd Verify

## Agent Quick-Start
- Source URL: https://{{DOCS_BASE_URL}}/verify#intro
- Credentials / env vars needed: none (this is an overview; you need an App API key from the Developer Console before making calls — get it at https://{{VERIFY_BASE_URL}}/dashboard)
- Files an integrator edits: none — reference only
- Estimated steps: 0 (conceptual overview)
- Can complete without human input: YES — reading/reference only, no actions required
- Prerequisites: none

Valyd Verify is an identity-verification platform with two integration modes. Pick Hosted if you want Valyd to handle the camera capture and UI, or Standalone if you want to call REST endpoints server-to-server with your own UI and data.

## Integration modes

### Hosted
Redirect your user to Valyd's hosted page for ID + selfie capture. Receive the result via a signed webhook and a decision API call. No UI to build.

### Standalone
Call per-capability REST endpoints server-to-server with your own UI and data. Synchronous JSON result returned on the same request.

To choose between them, see https://{{DOCS_BASE_URL}}/verify#modes (modes.md).

## Services

| Service | Description |
| --- | --- |
| `id_verification` | KYC / OCR from a government ID |
| `liveness` | Passive liveness check |
| `face_match` | Selfie vs ID portrait |
| `age` | Age band checks from DOB |
| `credential` | Professional license lookup |

## Base URL

```text
https://{{VERIFY_BASE_URL}}
```

## Response envelope

Every API response uses this envelope. `success` is always present; `error` is only present when `success` is `false`.

```json
{
  "success": true,
  "data": {},
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Note: the `error` object is only included in the response when `success` is `false`. On success, only `success` and `data` are present.
