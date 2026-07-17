import { AlertTriangle, Info } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";

const MCP_BASE     = import.meta.env.VITE_MCP_BASE_URL ?? "https://mcp.pollus.tech";
const MCP_ENDPOINT = `${MCP_BASE}/verification/mcp`;
const IDP_BASE     = import.meta.env.VITE_IDP_BASE_URL ?? "https://idp.pollus.tech";

const Callout = ({
  type,
  children,
}: {
  type: "info" | "warning";
  children: React.ReactNode;
}) => {
  const styles = {
    info:    "bg-primary/5 border-primary/20 text-foreground",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
  };
  const Icon = { info: Info, warning: AlertTriangle }[type];
  return (
    <div className={`flex gap-3 rounded-lg border p-4 text-sm leading-relaxed ${styles[type]}`}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5 opacity-70" />
      <div>{children}</div>
    </div>
  );
};

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-8 space-y-4 pt-8 border-t border-border first:border-t-0 first:pt-0">
    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const SubSection = ({
  id,
  title,
  mono,
  children,
}: {
  id: string;
  title: string;
  mono?: boolean;
  children: React.ReactNode;
}) => (
  <div id={id} className="scroll-mt-8 space-y-3 pt-4">
    <h3 className="text-lg font-semibold text-foreground">
      {mono ? <code className="font-mono text-base bg-primary/8 border border-primary/20 text-primary px-2 py-0.5 rounded">{title}</code> : title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const PropsTable = ({
  rows,
  cols,
}: {
  cols: string[];
  rows: (string | React.ReactNode)[][];
}) => (
  <div className="rounded-lg border border-border overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-muted/50 border-b border-border">
          {cols.map((c) => (
            <th key={c} className="text-left px-4 py-2 font-medium text-muted-foreground">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-border align-top">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 text-sm text-muted-foreground">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const mono = (s: string) => <code className="font-mono text-xs">{s}</code>;

export const McpContent = () => (
  <div className="space-y-0">
    {/* ── Header ── */}
    <div className="space-y-3 pb-8 mb-8 border-b border-border">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">Valyd MCP</div>
      <h1 className="text-3xl font-bold text-foreground">Integration Guide</h1>
      <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
        Connect any AI agent to Valyd verification and the Valyd web agent over the Model Context
        Protocol — Streamable HTTP, OAuth 2.1.
      </p>
    </div>

    {/* ── Overview ── */}
    <Section id="mcp-overview" title="Overview">
      <p className="text-sm text-muted-foreground leading-relaxed">
        One hosted server gives your agent two capabilities:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
        <li>
          <strong className="text-foreground">Human-in-the-loop verification</strong> — ask the
          signed-in user to approve an action with a face scan on their Pollus app (
          {mono("verification_request")} → {mono("verification_status")}).
        </li>
        <li>
          <strong className="text-foreground">The Valyd web agent</strong> — run a browser/web
          task on the user's behalf, reusing their secure browser profile ({mono("do_task")}).
        </li>
      </ul>
      <PropsTable
        cols={["", ""]}
        rows={[
          ["Endpoint",                  <code className="font-mono text-xs">{MCP_ENDPOINT}</code>],
          ["Transport",                 "Streamable HTTP"],
          ["Auth",                      "OAuth 2.1 Bearer token (RFC 9728 discovery)"],
          ["Authorization server",      <code className="font-mono text-xs">{IDP_BASE}</code>],
          ["Required scopes",           <><code className="font-mono text-xs">openid</code> <code className="font-mono text-xs">mcp</code></>],
          ["Token audience (aud)",      <code className="font-mono text-xs">{MCP_BASE}</code>],
          ["The user",                  <>The access-token <code className="font-mono text-xs">sub</code>. Tools act on their behalf.</>],
          ["Tools",                     <><code className="font-mono text-xs">verification_request</code>, <code className="font-mono text-xs">verification_status</code>, <code className="font-mono text-xs">do_task</code></>],
        ]}
      />
      <p className="text-sm text-muted-foreground leading-relaxed">
        There is nothing to register per request and no shared secret to paste. A modern MCP
        client performs the OAuth login once; after that, every tool call carries the user's token
        automatically.
      </p>
    </Section>

    {/* ── Base URL ── */}
    <Section id="mcp-base-url" title="Base URL & endpoint">
      <p className="text-sm text-muted-foreground">
        Configure your MCP client with this endpoint. Use <strong className="text-foreground">no trailing slash</strong>.
      </p>
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm text-foreground">
        {MCP_ENDPOINT}
      </div>
      <p className="text-sm text-muted-foreground">
        Production base URL: {mono(MCP_BASE)}. The OAuth authorization server (IDP) is{" "}
        {mono(IDP_BASE)}.
      </p>
    </Section>

    {/* ── Auth ── */}
    <Section id="mcp-auth" title="Authentication (OAuth 2.1)">
      <p className="text-sm text-muted-foreground leading-relaxed">
        This server does <strong className="text-foreground">not</strong> issue tokens — it only
        validates them. The flow is standards-based (OAuth 2.1 + PKCE, RFC 9728 Protected Resource
        Metadata, RFC 8707 resource indicators), so any OAuth-capable MCP client connects with
        zero custom code.
      </p>
      <p className="text-sm font-semibold text-foreground">
        How a client connects (automatic in Claude Code, Cursor, etc.):
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
        <li>
          The client calls the MCP endpoint with no token and gets{" "}
          <strong className="text-foreground">401</strong> with a{" "}
          {mono("WWW-Authenticate")} header pointing at{" "}
          {mono(`${MCP_BASE}/.well-known/oauth-protected-resource`)}.
        </li>
        <li>
          That metadata names the authorization server and scopes:
          <div className="mt-2">
            <CodeBlock language="json" code={`{
  "resource": "${MCP_BASE}",
  "authorization_servers": ["${IDP_BASE}"],
  "scopes_supported": ["openid", "mcp"],
  "bearer_methods_supported": ["header"]
}`} />
          </div>
        </li>
        <li>
          The client discovers the IDP, registers (Dynamic Client Registration), and opens a
          browser. The user logs into Pollus and consents.
        </li>
        <li>
          The client gets an access token bound to{" "}
          {mono(`resource = ${MCP_BASE}`)} with scope {mono("mcp")} and sends it on
          every call: {mono("Authorization: Bearer <access_token>")}.
        </li>
      </ol>

      <p className="text-sm font-semibold text-foreground mt-2">
        Token validation requirements (all must hold)
      </p>
      <PropsTable
        cols={["Claim", "Requirement"]}
        rows={[
          ["signature",             <>RS256, verifiable against {mono(`${IDP_BASE}/api/auth/oidc/jwks.json`)}</>],
          [mono("iss"),             mono(IDP_BASE)],
          [mono("aud"),             mono(MCP_BASE)],
          [mono("scope"),           <>must include {mono("mcp")}</>],
          [<>{mono("exp")} / {mono("iat")} / {mono("sub")}</>, "present and not expired"],
        ]}
      />

      <Callout type="info">
        <strong>Code-first clients</strong> (LangChain, OpenAI SDK, scripts): obtain a user access
        token by running the OAuth 2.1 <strong>authorization-code + PKCE</strong> flow against{" "}
        {mono(IDP_BASE)} with {mono("scope=openid mcp")} and the resource indicator{" "}
        {mono(`resource=${MCP_BASE}`)}, then pass it as the{" "}
        {mono("Authorization: Bearer")} header. The token is user-bound, so it must come from a
        user login (not client-credentials).
      </Callout>
    </Section>

    {/* ── Tools ── */}
    <Section id="mcp-tools" title="Tools">
      <p className="text-sm text-muted-foreground">
        The user is the OAuth token {mono("sub")} — no user id is passed. On failure every tool
        returns {mono(`{"status": "error", "message": "..."}`)}.
      </p>

      <SubSection id="mcp-verification-request" title="verification_request" mono>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ask the signed-in user to approve a sensitive action with a face scan on their Pollus
          app. Call before anything risky (delete, payment, sharing data).
        </p>
        <PropsTable
          cols={["Name", "Type", "Required", "Description"]}
          rows={[
            [mono("action_type"),  "string", "Yes", <>Kind of action, e.g. {mono('"delete"')}, {mono('"payment"')}, {mono('"update"')}</>],
            [mono("title"),        "string", "Yes", "Short title shown on the approval prompt"],
            [mono("description"),  "string", "Yes", "Context the user reads before deciding"],
          ]}
        />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Returns — status is PENDING until the user responds, then poll verification_status
        </p>
        <CodeBlock language="json" code={`{
  "valyd_session_id": "uuid-string",
  "status": "PENDING",
  "expires_at": "2026-06-24T09:10:46+00:00"
}`} />
      </SubSection>

      <SubSection id="mcp-verification-status" title="verification_status" mono>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Check the result of a verification started by {mono("verification_request")}. Poll
          until {mono("status")} is no longer {mono("PENDING")}.
        </p>
        <PropsTable
          cols={["Name", "Type", "Required", "Description"]}
          rows={[
            [mono("valyd_session_id"), "string", "Yes", <>The id returned by {mono("verification_request")}</>],
          ]}
        />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Returns — status is one of PENDING / APPROVED / DENIED / DECLINED / EXPIRED
        </p>
        <CodeBlock language="json" code={`{
  "valyd_session_id": "uuid-string",
  "status": "APPROVED",
  "result": "...",
  "assurance_level": "high",
  "expires_at": "2026-06-24T09:10:46+00:00"
}`} />
      </SubSection>

      <SubSection id="mcp-do-task" title="do_task" mono>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Run a web/browser task for the signed-in user via the Valyd agent — open sites, fill
          forms, complete actions. The browser profile persists per user across calls. May take
          several minutes.
        </p>
        <PropsTable
          cols={["Name", "Type", "Required", "Description"]}
          rows={[
            [mono("task"),       "string", "Yes", "What the agent should do, in plain language"],
            [mono("start_url"),  "string", "No",  "Page to open before starting"],
            [mono("user_uuid"),  "string", "No",  "Profile override; defaults to the signed-in user"],
          ]}
        />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Returns</p>
        <CodeBlock language="json" code={`{
  "uuid": "user-or-profile-uuid",
  "response": "what the agent did / found",
  "success": true
}`} />
        <p className="text-sm text-muted-foreground">
          If the agent needs a login, card, or personal detail, it fetches it securely from Valyd
          (the user approves on their phone) — secrets are never returned to the calling agent in
          plain text.
        </p>
      </SubSection>
    </Section>

    {/* ── Integrations ── */}
    <Section id="mcp-integrations" title="Integrations">
      <p className="text-sm text-muted-foreground leading-relaxed">
        The endpoint and auth are identical for every client. Interactive clients (Claude Code,
        Cursor, Claude Desktop) handle the OAuth login for you. Code-first clients (LangChain,
        OpenAI SDK) take a Bearer token you obtained from the IDP.
      </p>

      <SubSection id="mcp-claude-code" title="Claude Code">
        <p className="text-sm text-muted-foreground">
          Add the server (HTTP transport), then authenticate from inside Claude Code:
        </p>
        <CodeBlock language="bash" code={`claude mcp add --transport http valyd ${MCP_ENDPOINT}`} />
        <p className="text-sm text-muted-foreground">
          Then run {mono("/mcp")} in Claude Code and choose{" "}
          <strong className="text-foreground">Authenticate</strong> for {mono("valyd")} — a
          browser opens for the Pollus login. After that, the tools are available.
        </p>
        <CodeBlock language="json" title=".mcp.json (project-scoped)" code={`{
  "mcpServers": {
    "valyd": {
      "type": "http",
      "url": "${MCP_ENDPOINT}"
    }
  }
}`} />
        <Callout type="info">
          <strong>No secrets go in this file.</strong> Claude Code performs the OAuth flow and
          stores the token. Re-run {mono("/mcp")} → Authenticate if the token expires.
        </Callout>
      </SubSection>

      <SubSection id="mcp-codex" title="Codex (OpenAI Codex CLI)">
        <p className="text-sm text-muted-foreground">
          Add the server to {mono("~/.codex/config.toml")} as a remote MCP server:
        </p>
        <CodeBlock language="toml" code={`[mcp_servers.valyd]
url = "${MCP_ENDPOINT}"`} />
        <p className="text-sm text-muted-foreground">Sign in so Codex runs the OAuth flow and caches the token:</p>
        <CodeBlock language="bash" code="codex mcp login valyd" />
        <p className="text-sm text-muted-foreground">
          If your Codex build does not yet support interactive OAuth login, supply a token via an
          environment variable:
        </p>
        <CodeBlock language="toml" code={`[mcp_servers.valyd]
url = "${MCP_ENDPOINT}"
bearer_token_env_var = "VALYD_MCP_TOKEN"`} />
        <CodeBlock language="bash" code={`export VALYD_MCP_TOKEN="<access_token from ${IDP_BASE}>"`} />
      </SubSection>

      <SubSection id="mcp-cursor" title="Cursor / Claude Desktop">
        <p className="text-sm text-muted-foreground">
          Add a remote MCP server in the client's MCP config (Cursor:{" "}
          {mono(".cursor/mcp.json")} or <strong className="text-foreground">Settings → Tools & MCP</strong>;
          Claude Desktop: its {mono("mcpServers")} config):
        </p>
        <CodeBlock language="json" code={`{
  "mcpServers": {
    "valyd": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`} />
        <p className="text-sm text-muted-foreground">
          Restart the client; it will prompt you to authorize with Pollus on first use. Use{" "}
          <strong className="text-foreground">no trailing slash</strong> on the URL.
        </p>
      </SubSection>

      <SubSection id="mcp-langchain" title="LangChain">
        <p className="text-sm text-muted-foreground">
          Use{" "}
          <a
            href="https://github.com/langchain-ai/langchain-mcp-adapters"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            langchain-mcp-adapters
          </a>
          . Obtain a user token from the IDP and pass it as a header.
        </p>
        <CodeBlock language="bash" code="pip install langchain-mcp-adapters langgraph langchain-openai" />
        <CodeBlock language="python" code={`import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent

TOKEN = "<access_token from ${IDP_BASE}, scope: openid mcp>"

async def main():
    client = MultiServerMCPClient(
        {
            "valyd": {
                "transport": "streamable_http",
                "url": "${MCP_ENDPOINT}",
                "headers": {"Authorization": f"Bearer {TOKEN}"},
            }
        }
    )
    tools = await client.get_tools()  # verification_request, verification_status, do_task

    agent = create_react_agent("openai:gpt-4o", tools)
    result = await agent.ainvoke(
        {"messages": "Ask the user to approve deleting the prod database, then tell me the outcome."}
    )
    print(result["messages"][-1].content)

asyncio.run(main())`} />
      </SubSection>

      <SubSection id="mcp-openai-agents" title="OpenAI Agents SDK">
        <p className="text-sm text-muted-foreground">
          Use the{" "}
          <a
            href="https://openai.github.io/openai-agents-python/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OpenAI Agents SDK
          </a>{" "}
          with a streamable-HTTP MCP server.
        </p>
        <CodeBlock language="bash" code="pip install openai-agents" />
        <CodeBlock language="python" code={`import asyncio
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

TOKEN = "<access_token from ${IDP_BASE}, scope: openid mcp>"

async def main():
    async with MCPServerStreamableHttp(
        name="valyd",
        params={
            "url": "${MCP_ENDPOINT}",
            "headers": {"Authorization": f"Bearer {TOKEN}"},
        },
    ) as valyd:
        agent = Agent(
            name="Assistant",
            instructions="Use Valyd tools for approvals and web tasks.",
            mcp_servers=[valyd],
        )
        result = await Runner.run(agent, "Book a table for two on the user's behalf at example.com.")
        print(result.final_output)

asyncio.run(main())`} />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4">
          Alternative — OpenAI Responses API (hosted MCP tool)
        </p>
        <CodeBlock language="python" code={`from openai import OpenAI

client = OpenAI()
resp = client.responses.create(
    model="gpt-4o",
    tools=[
        {
            "type": "mcp",
            "server_label": "valyd",
            "server_url": "${MCP_ENDPOINT}",
            "headers": {"Authorization": "Bearer <access_token>"},
            "require_approval": "never",
        }
    ],
    input="Ask the user to approve the payment, then proceed if approved.",
)
print(resp.output_text)`} />
      </SubSection>
    </Section>

    {/* ── Agent flow ── */}
    <Section id="mcp-agent-flow" title="Agent flow">
      <p className="text-sm font-semibold text-foreground">Verification (human-in-the-loop)</p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
        <li>Call {mono("verification_request")} with {mono("action_type")}, {mono("title")}, {mono("description")}.</li>
        <li>Poll {mono("verification_status(valyd_session_id)")} until {mono("status")} is no longer {mono("PENDING")}.</li>
        <li>
          If <span className="text-emerald-600 font-semibold">APPROVED</span>, perform the action.
          If <span className="text-red-600 font-semibold">DENIED</span> / <span className="text-red-600 font-semibold">DECLINED</span> / <span className="text-red-600 font-semibold">EXPIRED</span>, abort and tell the user.
        </li>
      </ol>
      <p className="text-sm font-semibold text-foreground mt-2">Web task</p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
        <li>
          Call {mono("do_task")} with {mono("task")} (and optional {mono("start_url")}). The agent
          reuses the user's browser profile.
        </li>
        <li>
          Read {mono("response")} and {mono("success")}. If the agent needed a sensitive
          credential, it was fetched securely from Valyd with the user's phone approval — not
          returned to you in plain text.
        </li>
      </ol>
      <p className="text-sm text-muted-foreground">
        You can combine them: gate a {mono("do_task")} behind a {mono("verification_request")}{" "}
        approval for sensitive actions.
      </p>
    </Section>

    {/* ── Status reference ── */}
    <Section id="mcp-status" title="Status reference">
      <PropsTable
        cols={["Status", "Meaning"]}
        rows={[
          [<span className="font-semibold text-amber-600">PENDING</span>,  "Waiting for the user to respond on their Pollus app. Keep polling."],
          [<span className="font-semibold text-emerald-600">APPROVED</span>, "The user approved (face-verified). Proceed with the action."],
          [<span className="font-semibold text-red-600">DENIED</span>,     "The system/policy denied the request."],
          [<span className="font-semibold text-red-600">DECLINED</span>,   "The user explicitly declined. Do not proceed."],
          [<span className="font-semibold text-red-600">EXPIRED</span>,    <>{mono("expires_at")} passed without a decision.</>],
        ]}
      />
      <p className="text-sm text-muted-foreground">
        When present, {mono("assurance_level")} (e.g. {mono("high")}) describes how strongly the
        user was verified.
      </p>
    </Section>

    {/* ── Common errors ── */}
    <Section id="mcp-errors" title="Common errors">
      <p className="text-sm text-muted-foreground">
        Every tool returns errors as {mono(`{"status": "error", "message": "..."}`)}.
      </p>
      <div className="space-y-3">
        {[
          {
            symptom: "401 with WWW-Authenticate on connect",
            cause:   "No / expired token",
            fix:     "Let the client run the OAuth login (Claude Code/Cursor: /mcp → Authenticate). For code clients, fetch a fresh token.",
          },
          {
            symptom: "invalid_token",
            cause:   `Wrong aud, iss, scope, or signature`,
            fix:     `Token must have aud=${MCP_BASE}, iss=${IDP_BASE}, scope including mcp.`,
          },
          {
            symptom: "invalid_scope",
            cause:   "A requested scope is not allowed by the IDP",
            fix:     "Request only openid mcp. Don't ask for scopes the IDP doesn't grant.",
          },
          {
            symptom: "missing_token",
            cause:   "No Authorization: Bearer header",
            fix:     "Send the Bearer token on every request.",
          },
          {
            symptom: "do_task returns success: false",
            cause:   "The web agent could not complete the task",
            fix:     "Read response for the reason; refine the task or start_url and retry.",
          },
        ].map(({ symptom, cause, fix }) => (
          <div key={symptom} className="rounded-lg border border-border p-4 space-y-1">
            <p className="font-medium text-foreground text-sm font-mono">{symptom}</p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/80">Cause:</span> {cause}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/80">Fix:</span> {fix}
            </p>
          </div>
        ))}
      </div>
      <Callout type="warning">
        The legacy <code className="font-mono text-xs">X-MCP-Client-Id</code> /{" "}
        <code className="font-mono text-xs">X-MCP-Client-Secret</code> /{" "}
        <code className="font-mono text-xs">X-MCP-Webhook-Url</code> header scheme and the{" "}
        <code className="font-mono text-xs">user_id</code> tool parameter are{" "}
        <strong>removed</strong>. Authentication is OAuth 2.1 Bearer only, and the user comes from
        the token.
      </Callout>
    </Section>
  </div>
);
