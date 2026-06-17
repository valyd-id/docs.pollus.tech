import { useState } from "react";
import { API_CONFIG } from "@/lib/api-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeBlock } from "./CodeBlock";
import { Play, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface ApiTesterProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requiresAuth?: boolean;
}

export const ApiTester = ({ method, path, parameters, requiresAuth = true }: ApiTesterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResponse(null);
    setResponseStatus(null);

    try {
      const url = `${API_CONFIG.API_BASE_URL}${path}`;
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      if (requiresAuth && accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (method === "POST" || method === "PUT" || method === "PATCH") {
        // Build request body from form data
        const body: Record<string, any> = {};
        parameters?.forEach(param => {
          if (formData[param.name]) {
            // Handle boolean values
            if (param.type === "boolean") {
              body[param.name] = formData[param.name] === "true";
            } else {
              body[param.name] = formData[param.name];
            }
          }
        });
        options.body = JSON.stringify(body);
      }

      const res = await fetch(url, options);
      setResponseStatus(res.status);
      
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ 
        error: "Request failed", 
        message: error instanceof Error ? error.message : "Unknown error",
        note: "This may be due to CORS restrictions. In production, API calls should be made from your backend server."
      }, null, 2));
      setResponseStatus(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-primary/30 rounded-lg overflow-hidden bg-primary/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          <span className="font-semibold text-primary">Try It Out</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-primary/20 space-y-4">
          {/* Access Token Input */}
          {requiresAuth && (
            <div className="space-y-2">
              <Label htmlFor="access-token" className="text-sm font-medium">
                Access Token <span className="text-destructive">*</span>
              </Label>
              <Input
                id="access-token"
                type="password"
                placeholder="Enter your access token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Get your access token by completing the OAuth flow first.
              </p>
            </div>
          )}

          {/* Parameter Inputs */}
          {parameters && parameters.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-foreground">Request Parameters</h5>
              {parameters.map((param) => (
                <div key={param.name} className="space-y-1">
                  <Label htmlFor={param.name} className="text-sm">
                    {param.name}
                    {param.required && <span className="text-destructive ml-1">*</span>}
                    <span className="text-muted-foreground ml-2 font-normal">({param.type})</span>
                  </Label>
                  {param.type === "boolean" ? (
                    <select
                      id={param.name}
                      value={formData[param.name] || ""}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <Input
                      id={param.name}
                      placeholder={param.description}
                      value={formData[param.name] || ""}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                      className="font-mono text-sm"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (requiresAuth && !accessToken)}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Send {method} Request
              </>
            )}
          </Button>

          {/* Response */}
          {response && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-semibold text-foreground">Response</h5>
                {responseStatus !== null && (
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    responseStatus >= 200 && responseStatus < 300
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : responseStatus === 0
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {responseStatus === 0 ? "Network Error" : `Status: ${responseStatus}`}
                  </span>
                )}
              </div>
              <CodeBlock 
                code={response} 
                language="json" 
                title="API Response" 
              />
            </div>
          )}

          {/* CORS Warning */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
            <strong>Note:</strong> Browser-based API testing may fail due to CORS restrictions. 
            For production use, make API calls from your backend server. 
            This tester is for demonstration purposes.
          </div>
        </div>
      )}
    </div>
  );
};
