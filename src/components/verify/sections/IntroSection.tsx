import { ShieldCheck, Globe, Server } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { VERIFY_CONFIG } from "@/lib/verify-config";

export const IntroSection = () => (
  <section id="intro" className="scroll-mt-8 space-y-6">
    <div>
      <h1 className="text-4xl font-bold text-foreground">Valyd Verify</h1>
      <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
        Valyd Verify is an identity-verification platform with two integration modes. Pick
        Hosted if you want Valyd to handle the camera capture and UI, or Standalone if you
        want to call REST endpoints server-to-server with your own UI and data.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-5 rounded-lg border border-border bg-card">
        <Globe className="h-6 w-6 text-primary mb-2" />
        <h3 className="font-semibold text-foreground">Hosted</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Redirect your user to Valyd's hosted page for ID + selfie capture. Receive the
          result via a signed webhook and a decision API call. No UI to build.
        </p>
      </div>
      <div className="p-5 rounded-lg border border-border bg-card">
        <Server className="h-6 w-6 text-primary mb-2" />
        <h3 className="font-semibold text-foreground">Standalone</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Call per-capability REST endpoints server-to-server with your own UI and data.
          Synchronous JSON result returned on the same request.
        </p>
      </div>
    </div>

    <div className="p-6 rounded-lg border border-border bg-card">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" /> Services
      </h3>
      <ul className="text-sm text-muted-foreground grid sm:grid-cols-2 gap-2">
        <li><code className="bg-muted px-1.5 py-0.5 rounded">id_verification</code> — KYC / OCR from a government ID</li>
        <li><code className="bg-muted px-1.5 py-0.5 rounded">liveness</code> — passive liveness check</li>
        <li><code className="bg-muted px-1.5 py-0.5 rounded">face_match</code> — selfie vs ID portrait</li>
        <li><code className="bg-muted px-1.5 py-0.5 rounded">age</code> — age band checks from DOB</li>
        <li><code className="bg-muted px-1.5 py-0.5 rounded">credential</code> — professional license lookup</li>
      </ul>
    </div>

    <div className="p-6 rounded-lg border border-border bg-card">
      <h3 className="font-semibold text-foreground mb-3">Base URL</h3>
      <CodeBlock code={VERIFY_CONFIG.API_BASE_URL} language="text" />
      <h3 className="font-semibold text-foreground mt-6 mb-3">Response envelope</h3>
      <CodeBlock
        code={`{
  "success": true,
  "data": { /* ... */ },
  "error": { "code": "string", "message": "string" } // only when success=false
}`}
        language="json"
      />
    </div>
  </section>
);
