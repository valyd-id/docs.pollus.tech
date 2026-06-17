import { LayoutDashboard, KeyRound, Workflow, Webhook } from "lucide-react";
import { VERIFY_CONFIG } from "@/lib/verify-config";

export const ConsoleSection = () => (
  <section id="console" className="scroll-mt-8 space-y-6">
    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
      <LayoutDashboard className="h-6 w-6 text-primary" /> The Developer Console
    </h2>
    <p className="text-muted-foreground">
      The console lives at{" "}
      <a href={VERIFY_CONFIG.CONSOLE_URL} target="_blank" rel="noreferrer" className="text-primary underline">
        verify.pollus.tech/dashboard
      </a>
      . Sign in with Valyd SSO — your first sign-in auto-creates an App.
    </p>

    <div className="grid md:grid-cols-2 gap-4">
      <Card icon={<KeyRound className="h-5 w-5 text-primary" />} title="Apps">
        Each App has a unique <code>App ID</code> and a secret API key (shown once at creation,
        rotatable). Create multiple apps such as Test and Production.
      </Card>
      <Card icon={<Workflow className="h-5 w-5 text-primary" />} title="Workflows">
        Bundle services (ID, liveness, face match…) into a reusable Workflow. Each Workflow has
        a <code>workflow_id</code> used when creating Hosted sessions.
      </Card>
      <Card icon={<Webhook className="h-5 w-5 text-primary" />} title="Webhooks">
        Configure a per-app endpoint URL and signing secret (rotatable). Valyd POSTs signed
        events to this URL when a session reaches a terminal state.
      </Card>
      <Card icon={<LayoutDashboard className="h-5 w-5 text-primary" />} title="SSO">
        The console uses Valyd SSO. Your developer account is separate from end-users you
        verify.
      </Card>
    </div>
  </section>
);

const Card = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="p-5 rounded-lg border border-border bg-card">
    <div className="flex items-center gap-2 mb-2">{icon}<h3 className="font-semibold text-foreground">{title}</h3></div>
    <p className="text-sm text-muted-foreground">{children}</p>
  </div>
);
