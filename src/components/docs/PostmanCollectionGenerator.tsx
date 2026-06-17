import { useState, useMemo } from "react";
import { Shield, Zap, Lock, Download, Copy, Check, ExternalLink, ChevronDown, Wrench } from "lucide-react";
import { postmanTemplate } from "@/data/valyd-postman-template";
import { API_CONFIG } from "@/lib/api-config";
import { CodeBlock } from "./CodeBlock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

const SCOPES = [
  { id: "profile", label: "profile", description: "Basic user profile information" },
  { id: "verifications", label: "verifications", description: "Identity verification data" },
  { id: "zkp", label: "zkp", description: "Zero-knowledge proof credentials" },
] as const;

export const PostmanCollectionGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copiedCollection, setCopiedCollection] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["profile", "verifications", "zkp"]);

  // Generate customized Postman collection
  const generatedCollection = useMemo(() => {
    const collection = JSON.parse(JSON.stringify(postmanTemplate));
    
    // Update variables with user input
    collection.variable = collection.variable.map((v: { key: string; value: string }) => {
      if (v.key === "client_id") return { ...v, value: clientId };
      if (v.key === "client_secret") return { ...v, value: clientSecret };
      if (v.key === "redirect_uri" && redirectUri) return { ...v, value: redirectUri };
      return v;
    });
    
    return collection;
  }, [clientId, clientSecret, redirectUri]);

  const collectionJson = useMemo(() => {
    return JSON.stringify(generatedCollection, null, 2);
  }, [generatedCollection]);

  // Generate OAuth authorization URL
  const authorizationUrl = useMemo(() => {
    if (!clientId) return "";
    const scopeString = selectedScopes.join(" ");
    const encodedRedirect = encodeURIComponent(redirectUri || "");
    return `${API_CONFIG.IDP_BASE_URL}/auth?client_id=${clientId}&redirect_url=${encodedRedirect}&scope=${encodeURIComponent(scopeString)}`;
  }, [clientId, redirectUri, selectedScopes]);

  const handleDownload = () => {
    if (!clientId || !clientSecret) {
      toast.error("Please enter both Client ID and Client Secret");
      return;
    }

    const blob = new Blob([collectionJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `valyd-tpsso-collection-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Collection downloaded successfully!");
  };

  const handleCopyCollection = async () => {
    if (!clientId || !clientSecret) {
      toast.error("Please enter both Client ID and Client Secret");
      return;
    }

    try {
      await navigator.clipboard.writeText(collectionJson);
      setCopiedCollection(true);
      toast.success("Collection copied to clipboard!");
      setTimeout(() => setCopiedCollection(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleLaunchAuth = () => {
    if (!clientId) {
      toast.error("Client ID is required");
      return;
    }
    if (!redirectUri) {
      toast.error("Redirect URI is required for OAuth flow");
      return;
    }
    if (selectedScopes.length === 0) {
      toast.error("Select at least one scope");
      return;
    }
    window.open(authorizationUrl, "_blank");
  };

  const toggleScope = (scopeId: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeId) 
        ? prev.filter(s => s !== scopeId)
        : [...prev, scopeId]
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-8">
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Valyd API Developer Tools</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4 space-y-6">
        {/* Postman Collection Generator Card */}
        <div className="p-6 rounded-lg border-2 border-blue-200 bg-blue-50/50">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Postman Collection Generator</h3>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-blue-800">
                  Client ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientId"
                  placeholder="Enter your client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="bg-white border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret" className="text-blue-800">
                  Client Secret <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Enter your client secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="bg-white border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectUri" className="text-blue-800">
                Redirect URI <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="redirectUri"
                placeholder="https://yourapp.com/callback"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                className="bg-white border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download Collection
              </Button>
              <Button onClick={handleCopyCollection} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                {copiedCollection ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copiedCollection ? "Copied!" : "Copy JSON"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="showPreview"
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
              <Label htmlFor="showPreview" className="text-blue-800 cursor-pointer">
                Show Preview
              </Label>
            </div>

            {showPreview && (
              <div className="mt-4 max-h-96 overflow-auto rounded-lg border border-blue-200">
                <CodeBlock code={collectionJson} language="json" />
              </div>
            )}

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
              <Lock className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
              <p className="text-sm text-green-700">
                <strong>100% Client-Side:</strong> Your credentials are processed entirely in your browser and used only to generate the JSON file. Nothing is transmitted or stored.
              </p>
            </div>
          </div>
        </div>

        {/* OAuth Authorization Test Card */}
        <div className="p-6 rounded-lg border-2 border-amber-200 bg-amber-50/50">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">OAuth Authorization Test</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-amber-800 mb-3 block">Select Scopes</Label>
              <div className="flex flex-wrap gap-4">
                {SCOPES.map((scope) => (
                  <div key={scope.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`scope-${scope.id}`}
                      checked={selectedScopes.includes(scope.id)}
                      onCheckedChange={() => toggleScope(scope.id)}
                      className="border-amber-400 data-[state=checked]:bg-amber-600"
                    />
                    <Label
                      htmlFor={`scope-${scope.id}`}
                      className="text-amber-800 cursor-pointer"
                    >
                      <span className="font-mono">{scope.label}</span>
                      <span className="text-amber-600 text-xs ml-1">({scope.description})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {authorizationUrl && (
              <div className="space-y-2">
                <Label className="text-amber-800">Authorization URL Preview</Label>
                <div className="p-3 rounded-lg bg-white border border-amber-200 font-mono text-xs break-all text-amber-900">
                  {authorizationUrl}
                </div>
              </div>
            )}

            {!clientId && (
              <p className="text-amber-600 text-sm">Enter a Client ID above to generate the authorization URL.</p>
            )}

            <Button
              onClick={handleLaunchAuth}
              className="bg-amber-600 hover:bg-amber-700"
              disabled={!clientId}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Launch Authorization Flow
            </Button>

            {(!clientId || !redirectUri || selectedScopes.length === 0) && (
              <div className="text-sm text-amber-700 space-y-1">
                {!clientId && <p>• Client ID is required</p>}
                {!redirectUri && <p>• Redirect URI is required for OAuth flow</p>}
                {selectedScopes.length === 0 && <p>• Select at least one scope</p>}
              </div>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-border">
          <a
            href={API_CONFIG.DOCS_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            View full API documentation
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
