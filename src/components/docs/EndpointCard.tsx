import { API_CONFIG } from "@/lib/api-config";
import { MethodBadge } from "./MethodBadge";
import { ScopeBadge } from "./ScopeBadge";
import { LanguageTabs } from "./LanguageTabs";
import { CodeBlock } from "./CodeBlock";
// import { ApiTester } from "./ApiTester";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointCardProps {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  title: string;
  description: string;
  requiredScope?: string;
  parameters?: Parameter[];
  requestBody?: string;
  responseExample: string;
  errorExample?: string;
  codeExamples: {
    curl: string;
    javascript: string;
    python: string;
    php: string;
    java: string;
  };
}

export const EndpointCard = ({
  id,
  method,
  path,
  title,
  description,
  requiredScope,
  parameters,
  requestBody,
  responseExample,
  errorExample,
  codeExamples,
}: EndpointCardProps) => {
  const examples = [
    { language: "bash", label: "cURL", code: codeExamples.curl },
    { language: "javascript", label: "JavaScript", code: codeExamples.javascript },
    { language: "python", label: "Python", code: codeExamples.python },
    { language: "php", label: "PHP", code: codeExamples.php },
    { language: "java", label: "Java", code: codeExamples.java },
  ];

  return (
    <section id={id} className="scroll-mt-8">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3 flex-wrap">
            <MethodBadge method={method} />
            <code className="text-lg font-mono font-semibold text-foreground">
              {API_CONFIG.API_BASE_URL}{path}
            </code>
            {requiredScope && <ScopeBadge scope={requiredScope} size="md" />}
          </div>
          <h3 className="text-xl font-bold mt-3 text-foreground">{title}</h3>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Parameters */}
          {parameters && parameters.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Parameters</h4>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-foreground">Name</th>
                      <th className="text-left px-4 py-2 font-medium text-foreground">Type</th>
                      <th className="text-left px-4 py-2 font-medium text-foreground">Required</th>
                      <th className="text-left px-4 py-2 font-medium text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((param) => (
                      <tr key={param.name} className="border-t border-border">
                        <td className="px-4 py-2 font-mono text-primary">{param.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{param.type}</td>
                        <td className="px-4 py-2">
                          {param.required ? (
                            <span className="text-orange-600 font-medium">Yes</span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body */}
          {requestBody && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Request Body</h4>
              <CodeBlock code={requestBody} language="json" title="application/json" />
            </div>
          )}

          {/* Code Examples */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Code Examples</h4>
            <LanguageTabs examples={examples} />
          </div>

          {/* Try It Out - Hidden for now
          <ApiTester 
            method={method} 
            path={path} 
            parameters={parameters}
            requiresAuth={method !== "POST" || path !== "/token"}
          />
          */}

          {/* Response Examples */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Response — 200 OK</h4>
              <CodeBlock code={responseExample} language="json" title="Success Response" />
            </div>
            {errorExample && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Response — Error</h4>
                <CodeBlock code={errorExample} language="json" title="Error Response" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
