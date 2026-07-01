import { Link } from "react-router-dom";
import { ArrowRight, Server } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { LanguageTabs } from "@/components/docs/LanguageTabs";
import { VERIFY_CONFIG } from "@/lib/verify-config";

const BASE = VERIFY_CONFIG.API_BASE_URL;

const Endpoint = ({
  id,
  method,
  path,
  title,
  description,
  curl,
  sdk,
  responseTitle = "check.data",
  response,
  fields,
}: {
  id?: string;
  method: string;
  path: string;
  title: string;
  description: string;
  curl: string;
  sdk: string;
  responseTitle?: string;
  response: string;
  fields?: React.ReactNode;
}) => (
  <div id={id} className="scroll-mt-8 p-5 rounded-lg border border-border bg-card space-y-4">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">{method}</span>
        <code className="text-sm">{path}</code>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    {fields}
    <LanguageTabs
      examples={[
        { language: "bash", label: "cURL", code: curl },
        { language: "javascript", label: "SDK (Node)", code: sdk },
      ]}
    />
    <CodeBlock language="json" title={responseTitle} code={response} />
  </div>
);

const Field = ({ name, required, type, desc }: { name: string; required?: boolean; type: string; desc: string }) => (
  <li className="text-sm">
    <code className="text-foreground font-semibold">{name}</code>{" "}
    <span className="text-xs text-muted-foreground">{type}</span>{" "}
    {required && <span className="text-xs text-primary font-medium">required</span>}
    <span className="text-muted-foreground"> — {desc}</span>
  </li>
);

export const StandaloneSection = () => (
  <section id="standalone" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <Server className="h-6 w-6 text-primary" /> Standalone APIs
    </h2>
    <p className="text-muted-foreground">
      Direct, synchronous, server-to-server checks — the <strong>non-account ("verify fresh")</strong> surface:
      <strong> no Valyd login, nothing stored</strong>. You build your own UI and call our endpoints from your
      backend. Every request uses <code>X-API-Key: &lt;App API key&gt;</code> — keep this server-side, never ship
      it to the browser. The full non-account set: <code>id-verification</code>, <code>liveness</code>,
      <code>face-match</code>, <code>age-verification</code>, <code>credential-verification</code> (state + type,
      auto-resolved), <code>location</code> / <code>location-match</code>, <code>evv-presence</code>, and the combined
      <code>kyc-credential</code>. Every response uses the standard envelope with a <code>check</code> object:
    </p>
    <CodeBlock
      language="json"
      code={`{
  "success": true,
  "data": {
    "session_id": "ses_…",
    "status": "passed",   // passed | failed | review
    "check": {
      "type": "id_verification" | "liveness" | "face_match" | "age" | "credential",
      "status": "passed" | "failed" | "review",
      "score": 0.97,
      "data": { /* per-check details */ },
      "error": null
    }
  },
  "error": null
}`}
    />

    <div className="p-5 rounded-lg border border-border bg-card space-y-3">
      <h3 className="text-lg font-semibold text-foreground">SDK quick start</h3>
      <p className="text-sm text-muted-foreground">
        The official Node SDK is published as{" "}
        <a
          href="https://www.npmjs.com/package/valyd-verify-sdk"
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          <code>valyd-verify-sdk</code>
        </a>
        . Image fields accept a file path via <code>readImage("./x.jpg")</code>, a <code>Buffer</code>,
        or a base64 / data-URL string. Over plain HTTP, send images as a base64 string in the JSON
        field (or as a multipart file under the same field name).
      </p>
      <CodeBlock language="bash" code={`npm i valyd-verify-sdk`} />
      <CodeBlock
        language="javascript"
        code={`import { VerifyClient, readImage } from "valyd-verify-sdk";

const verify = new VerifyClient({ apiKey: process.env.VALYD_API_KEY! });
// keep VALYD_API_KEY on the server — never in browser code`}
      />
    </div>

    {/* 1. ID Verification */}
    <Endpoint
      method="POST"
      path="/api/v2/id-verification"
      title="ID Verification"
      description="OCR + authenticity from a government ID."
      fields={
        <ul className="space-y-1.5">
          <Field name="front_image" required type="image" desc="Front of the ID. File, Buffer, or base64/data-URL." />
          <Field name="back_image" type="image" desc="Back of the ID (when applicable)." />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/id-verification \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -F "front_image=@./id_front.jpg" \\
  -F "back_image=@./id_back.jpg"`}
      sdk={`import { VerifyClient, readImage } from "valyd-verify-sdk";
const verify = new VerifyClient({ apiKey: process.env.VALYD_API_KEY! });

const { check } = await verify.standalone.idVerification({
  frontImage: readImage("./id_front.jpg"),
  backImage:  readImage("./id_back.jpg"), // optional
});

console.log(check.data.fields.full_name, check.data.fields.document_number);`}
      response={`{
  "fields": {
    "full_name": "Jane Doe",
    "fathers_name": "John Doe",
    "document_number": "X1234567",
    "date_of_birth": "1990-01-15",
    "date_of_issue": "2020-03-10",
    "date_of_expiry": "2030-03-10",
    "sex": "F",
    "issuing_state": "CA",
    "country": "US",
    "document_type": "driver_license"
  },
  "portrait": "<base64>",
  "dob": "1990-01-15",
  "authenticity": { "score": 0.96 }
}`}
    />

    {/* 2. Liveness */}
    <Endpoint
      method="POST"
      path="/api/v2/liveness"
      title="Liveness"
      description="Passive liveness check. Passes when live_score === 1."
      fields={
        <ul className="space-y-1.5">
          <Field name="image" required type="image" desc="A selfie. File, Buffer, or base64/data-URL." />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/liveness \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -F "image=@./selfie.jpg"`}
      sdk={`const { check } = await verify.standalone.liveness({
  image: readImage("./selfie.jpg"),
});
// check.status === "passed" when check.data.live_score === 1`}
      response={`{
  "live_score": 1,   // 1 = live, 0 = spoof, < 0 = no face detected
  "result": "live"
}`}
    />

    {/* 3. Face match */}
    <Endpoint
      method="POST"
      path="/api/v2/face-match"
      title="Face Match"
      description="Compare two images. Passes when similarity ≥ threshold (default ~0.95)."
      fields={
        <ul className="space-y-1.5">
          <Field name="image1" required type="image" desc="Reference image (typically the ID portrait)." />
          <Field name="image2" required type="image" desc="Selfie to compare against the reference." />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/face-match \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -F "image1=@./id_portrait.jpg" \\
  -F "image2=@./selfie.jpg"`}
      sdk={`const { check } = await verify.standalone.faceMatch({
  idImage: readImage("./id_portrait.jpg"),
  selfie:  readImage("./selfie.jpg"),
});
// check.data.similarity, check.data.threshold`}
      response={`{ "similarity": 0.973, "threshold": 0.95 }`}
    />

    {/* 4. Age */}
    <Endpoint
      method="POST"
      path="/api/v2/age-verification"
      title="Age Verification"
      description="JSON body. Computes age from DOB and verifies the requested age bands (no ZKP)."
      fields={
        <ul className="space-y-1.5">
          <Field name="dob" required type="string (YYYY-MM-DD)" desc="Date of birth." />
          <Field name="bands" required type="string[]" desc='e.g. ["is_18_plus","is_21_plus"].' />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/age-verification \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "dob": "1995-06-01", "bands": ["is_18_plus","is_21_plus"] }'`}
      sdk={`const { check } = await verify.standalone.ageVerification({
  dob: "1995-06-01",
  bands: ["is_18_plus", "is_21_plus"],
});`}
      response={`{
  "age": 30,
  "dob": "1995-06-01",
  "bands": {
    "is_18_plus": { "verified": true, "min_age": 18 },
    "is_21_plus": { "verified": true, "min_age": 21 }
  }
}`}
    />

    {/* 5. Credential */}
    <Endpoint
      method="POST"
      path="/api/v2/credential-verification"
      title="Credential Verification"
      description="Look up a professional license in the state board — just state + license type + number. The provider is auto-resolved (no provider_code needed). Registry lookups can take 10–60s — use a generous timeout."
      fields={
        <ul className="space-y-1.5">
          <Field name="license_state" required type="string" desc="2-letter state code. Alias: state." />
          <Field name="license_type" type="string" desc="Friendly type — 'MD' (default), 'DO', 'RN', 'NP', 'PA'. The provider is auto-resolved from state + type." />
          <Field name="license_number" required type="string" desc="Alias: license_no." />
          <Field name="full_name" required type="string" desc="Or first_name + last_name. The board matches on name + number." />
          <Field name="provider_code" type="string" desc="Optional — only if you want to pin a specific board. Normally omit it." />
          <Field name="npi" type="string" desc="Optional NPI when applicable." />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/credential-verification \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "license_state":  "CA",
    "license_type":   "MD",
    "license_number": "A12345",
    "full_name":      "Jane Doe"
  }'`}
      sdk={`const { check } = await verify.standalone.credentialVerification({
  licenseState:  "CA",
  licenseType:   "MD",       // default MD; provider auto-resolved — no provider_code
  licenseNumber: "A12345",
  fullName:      "Jane Doe",
});
// check.status === "passed" · check.data.match · check.data.license`}
      response={`{
  "match": true,
  "license": {
    "license_number": "A12345",
    "status": "active",
    "issued_at": "2015-01-01",
    "expires_at": "2027-01-01",
    "specialty": "Internal Medicine"
  }
}`}
    />

    {/* 6. KYC + Credential */}
    <Endpoint
      method="POST"
      path="/api/v2/kyc-credential"
      title="KYC + Credential"
      description="Combined ID verification + liveness + face match + license lookup, in one call. The license is matched against the name OCR'd from the ID — never a client-supplied name — so the holder cannot impersonate someone else's license."
      fields={
        <ul className="space-y-1.5">
          <Field name="front_image" required type="image" desc="Front of the government ID." />
          <Field name="selfie" required type="image" desc="Live selfie for liveness + face match." />
          <Field name="back_image" type="image" desc="Back of the ID (when applicable)." />
          <Field name="license_type" required type="string" desc="Provider code. Alias: provider_code." />
          <Field name="license_state" required type="string" desc="State code. Alias: state." />
          <Field name="license_number" required type="string" desc="Alias: license_no." />
          <Field name="npi" type="string" desc="Optional NPI." />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/kyc-credential \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -F "front_image=@./id_front.jpg" \\
  -F "selfie=@./selfie.jpg" \\
  -F "license_type=MD" \\
  -F "license_state=CA" \\
  -F "license_number=A12345"`}
      sdk={`const result = await verify.standalone.kycCredential({
  frontImage: readImage("./id_front.jpg"),
  selfie:     readImage("./selfie.jpg"),
  providerCode:  "MD",
  licenseState:  "CA",
  licenseNumber: "A12345",
});

// result.status === "passed" only when every check passes
// result.checks: [id_verification, liveness, face_match, credential]
// result.identity: { name, dob }  ← name used for the license match`}
      responseTitle="data"
      response={`{
  "session_id": "ses_…",
  "status": "passed",
  "identity": { "name": "Jane Doe", "dob": "1990-01-15" },
  "checks": [
    { "type": "id_verification", "status": "passed", "data": { /* … */ } },
    { "type": "liveness",        "status": "passed", "data": { "live_score": 1 } },
    { "type": "face_match",      "status": "passed", "data": { "similarity": 0.97 } },
    { "type": "credential",      "status": "passed", "data": { "match": true, "license": { /* … */ } } }
  ]
}`}
    />

    {/* 7. Location Match */}
    <Endpoint
      method="POST"
      path="/api/v2/location-match"
      title="Location Match"
      description="Compare a captured GPS position against an expected point → { match, distance_m }. Coarse fixes (accuracy missing or >100m) return `review`, not pass. Capture with the SDK's captureLocation() to get a trustworthy high-accuracy fix. Anti-spoof note: Core-API coordinates are client-supplied (your trust boundary); the Hosted flow additionally cross-checks the user's real IP against the GPS and flags gross mismatches."
      fields={
        <ul className="space-y-1.5">
          <Field name="latitude" required type="number" desc="Captured latitude (where the person is)." />
          <Field name="longitude" required type="number" desc="Captured longitude." />
          <Field name="expected_latitude" required type="number" desc="Expected latitude (where they should be)." />
          <Field name="expected_longitude" required type="number" desc="Expected longitude." />
          <Field name="radius_m" type="number" desc="Allowed radius in metres. Default 200." />
          <Field name="accuracy" type="number" desc="Captured GPS accuracy radius (metres), optional." />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/location-match \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "latitude": 37.3382, "longitude": -121.8863,
    "expected_latitude": 37.3382, "expected_longitude": -121.8863,
    "radius_m": 200
  }'`}
      sdk={`const { check } = await verify.standalone.locationMatch({
  latitude: 37.3382, longitude: -121.8863,
  expectedLatitude: 37.3382, expectedLongitude: -121.8863,
  radiusM: 200,
});
// check.status === "passed" when within radius; check.data.distance_m`}
      responseTitle="data.check"
      response={`{
  "type": "location_match",
  "status": "passed",
  "score": 0,
  "data": {
    "captured": { "latitude": 37.3382, "longitude": -121.8863 },
    "expected": { "latitude": 37.3382, "longitude": -121.8863 },
    "distance_m": 0, "radius_m": 200, "match": true
  }
}`}
    />

    {/* 8. EVV Presence (bundle) */}
    <Endpoint
      method="POST"
      path="/api/v2/evv-presence"
      title="EVV Presence  ·  face + location bundle"
      description="Face match (reference vs selfie) + location match in one call — proves the right person is at the right place. Billed once as evv_presence (below the sum of the parts)."
      fields={
        <ul className="space-y-1.5">
          <Field name="image1" required type="image" desc="Reference face (ID portrait or account photo). Alias: id_image." />
          <Field name="image2" required type="image" desc="Live selfie. Alias: selfie." />
          <Field name="latitude" required type="number" desc="Captured latitude." />
          <Field name="longitude" required type="number" desc="Captured longitude." />
          <Field name="expected_latitude" required type="number" desc="Expected latitude." />
          <Field name="expected_longitude" required type="number" desc="Expected longitude." />
          <Field name="radius_m" type="number" desc="Allowed radius in metres. Default 200." />
        </ul>
      }
      curl={`curl -X POST ${BASE}/api/v2/evv-presence \\
  -H "X-API-Key: $VALYD_API_KEY" \\
  -F "image1=@./reference.jpg" \\
  -F "image2=@./selfie.jpg" \\
  -F "latitude=37.3382"  -F "longitude=-121.8863" \\
  -F "expected_latitude=37.3382" -F "expected_longitude=-121.8863" \\
  -F "radius_m=200"`}
      sdk={`const { check } = await verify.standalone.evvPresence({
  idImage: readImage("./reference.jpg"),
  selfie:  readImage("./selfie.jpg"),
  latitude: 37.3382, longitude: -121.8863,
  expectedLatitude: 37.3382, expectedLongitude: -121.8863,
  radiusM: 200,
});
// check.status === "passed" only when BOTH face + location pass
// check.data.face_match, check.data.location_match, check.data.verified`}
      responseTitle="data.check"
      response={`{
  "type": "evv_presence",
  "status": "passed",
  "data": {
    "face_match":     { "status": "passed", "data": { "similarity": 0.97 } },
    "location_match": { "status": "passed", "data": { "distance_m": 12, "match": true } },
    "verified": true
  }
}`}
    />

    {/* Credential discovery */}
    <div className="p-5 rounded-lg border border-border bg-card space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Credential discovery</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Use these endpoints to build state and license-type pickers in your UI before calling
          <code> credential-verification </code> or <code>kyc-credential</code>. A provider's{" "}
          <code>required_fields</code> tells you which license inputs to collect — but always collect
          first / last name even when it isn't listed, because the registry lookup needs it.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">GET</span>
          <code className="text-sm">/api/v2/credential/states</code>
        </div>
        <LanguageTabs
          examples={[
            {
              language: "bash",
              label: "cURL",
              code: `curl ${BASE}/api/v2/credential/states \\
  -H "X-API-Key: $VALYD_API_KEY"`,
            },
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `const { states } = await verify.credentials.states();
// states: [{ state_name: "California", state_code: "CA" }, …]`,
            },
          ]}
        />
        <CodeBlock
          language="json"
          title="data"
          code={`{ "states": [ { "state_name": "California", "state_code": "CA" } ] }`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">GET</span>
          <code className="text-sm">/api/v2/credential/states/{`{state}`}/providers</code>
        </div>
        <LanguageTabs
          examples={[
            {
              language: "bash",
              label: "cURL",
              code: `curl ${BASE}/api/v2/credential/states/CA/providers \\
  -H "X-API-Key: $VALYD_API_KEY"`,
            },
            {
              language: "javascript",
              label: "SDK (Node)",
              code: `const { providers } = await verify.credentials.providers("CA");
// providers: [{ provider_code, provider_display_name, credential_name, required_fields, … }]`,
            },
          ]}
        />
        <CodeBlock
          language="json"
          title="data"
          code={`{
  "providers": [
    {
      "provider_code": "MD",
      "provider_display_name": "Medical Board of California",
      "credential_name": "Physician & Surgeon",
      "required_fields": ["license_number"]
    }
  ]
}`}
        />
      </div>
    </div>

    {/* Errors */}
    <div className="p-5 rounded-lg border border-border bg-card space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Errors</h3>
      <p className="text-sm text-muted-foreground">
        Over HTTP, failures return the envelope <code>{`{ success: false, error: { code, message } }`}</code>{" "}
        with the matching HTTP status:
      </p>
      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
        <li><code>401</code> — invalid or missing API key.</li>
        <li><code>400</code> — validation error (missing field, bad image, unknown provider).</li>
        <li><code>404</code> — unknown state or provider.</li>
        <li><code>429</code> — rate limited.</li>
        <li><code>5xx</code> — upstream registry or internal error.</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        In the SDK, the same failures throw <code>ValydVerifyError</code> with{" "}
        <code>{`{ code, status, message }`}</code>. Credential registry lookups can take{" "}
        <strong>10–60 seconds</strong> — configure a generous client timeout.
      </p>
      <CodeBlock
        language="javascript"
        code={`import { VerifyClient, ValydVerifyError, readImage } from "valyd-verify-sdk";

const verify = new VerifyClient({
  apiKey: process.env.VALYD_API_KEY!,
  timeoutMs: 90_000, // registry lookups can be slow
});

try {
  const { check } = await verify.standalone.credentialVerification({
    firstName: "Jane", lastName: "Doe",
    providerCode: "MD", licenseState: "CA", licenseNumber: "A12345",
  });
} catch (err) {
  if (err instanceof ValydVerifyError) {
    console.error(err.status, err.code, err.message);
  } else {
    throw err;
  }
}`}
      />
    </div>

    {/* Recipe card */}
    <Link
      to="/verify/verify-license"
      className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 transition-colors hover:border-primary/60 hover:bg-primary/10"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Recipe</p>
        <p className="font-semibold text-foreground">Verify a professional license</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Step-by-step: discover providers, call the credential-verification endpoint, and handle every result status.
        </p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-primary opacity-60 transition-transform group-hover:translate-x-1" />
    </Link>
  </section>
);
