import { useState } from "react";
import { API_CONFIG } from "@/lib/api-config";
import { CodeBlock } from "./CodeBlock";
import { Play, ExternalLink, Copy, Check } from "lucide-react";

export const TryItSandbox = () => {
  const [clientId, setClientId] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("https://yourapp.com/callback");
  const [scopes, setScopes] = useState({
    profile: true,
    verifications: false,
    zkp: false,
  });
  const [copied, setCopied] = useState(false);

  const selectedScopes = Object.entries(scopes)
    .filter(([_, selected]) => selected)
    .map(([scope]) => scope)
    .join(" ");

  const generatedUrl = `${API_CONFIG.IDP_BASE_URL}/auth?client_id=${clientId || "YOUR_CLIENT_ID"}&redirect_url=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(selectedScopes)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryIt = () => {
    if (!clientId) {
      alert("Please enter your Client ID");
      return;
    }
    window.open(generatedUrl, "_blank");
  };

  return (
    <section id="try-it" className="scroll-mt-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Try It</h2>
      
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Build and test your authorization URL in real-time. Enter your credentials below and 
          click "Try It" to test the OAuth flow.
        </p>

        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">Authorization URL Builder</h3>
          
          <div className="space-y-6">
            {/* Client ID Input */}
            <div>
              <label htmlFor="client-id" className="block text-sm font-medium text-foreground mb-2">
                Client ID <span className="text-orange-600">*</span>
              </label>
              <input
                id="client-id"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Client ID from Developer Portal"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Redirect URL Input */}
            <div>
              <label htmlFor="redirect-url" className="block text-sm font-medium text-foreground mb-2">
                Redirect URL <span className="text-orange-600">*</span>
              </label>
              <input
                id="redirect-url"
                type="url"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://yourapp.com/callback"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Scopes Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Scopes
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-muted cursor-not-allowed">
                  <input
                    type="checkbox"
                    checked={scopes.profile}
                    disabled
                    className="rounded"
                  />
                  <span className="text-sm font-mono">profile</span>
                  <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Required</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={scopes.verifications}
                    onChange={(e) => setScopes({ ...scopes, verifications: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-mono">verifications</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={scopes.zkp}
                    onChange={(e) => setScopes({ ...scopes, zkp: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-mono">zkp</span>
                </label>
              </div>
            </div>

            {/* Generated URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Generated Authorization URL
              </label>
              <div className="relative">
                <CodeBlock code={generatedUrl} language="text" />
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTryIt}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Play className="h-4 w-4" />
                Try It
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
          <p className="text-blue-700 text-sm">
            <strong>💡 Note:</strong> When testing, make sure your redirect URL is registered in your 
            project settings at the <a href={API_CONFIG.DEV_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Developer Portal</a>. 
            The redirect URL must match exactly (including protocol and path).
          </p>
        </div>
      </div>
    </section>
  );
};
