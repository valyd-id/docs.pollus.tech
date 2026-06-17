import { API_CONFIG } from "@/lib/api-config";
import { CodeBlock } from "../CodeBlock";
import { CheckCircle2, AlertTriangle, Copy, ExternalLink, Info, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ScopeField {
  name: string;
  description: string;
  required?: boolean;
}

interface FieldGroup {
  groupName: string;
  required?: boolean;
  fields: ScopeField[];
}

interface ScopeDropdownProps {
  name: string;
  description: string;
  required?: boolean;
  fields?: ScopeField[];
  fieldGroups?: FieldGroup[];
}

const ScopeDropdown = ({ name, description, required = false, fields, fieldGroups }: ScopeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(required);
  
  const allFields = fields || fieldGroups?.flatMap(g => g.fields) || [];
  const [fieldStates, setFieldStates] = useState<Record<string, boolean>>(
    Object.fromEntries(allFields.map(f => [f.name, f.required ?? false]))
  );

  const toggleField = (fieldName: string) => {
    setFieldStates(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const renderField = (field: ScopeField, groupRequired?: boolean) => {
    const isFieldRequired = field.required || groupRequired;
    return (
      <div key={field.name} className="flex items-center justify-between py-1.5 px-2 rounded bg-background">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{field.name}</span>
            {isFieldRequired && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Core</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{field.description}</p>
        </div>
        <Switch 
          checked={isFieldRequired ? true : fieldStates[field.name]} 
          onCheckedChange={() => !isFieldRequired && toggleField(field.name)}
          disabled={!enabled || isFieldRequired}
          className="data-[state=checked]:bg-primary scale-90" 
        />
      </div>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-background rounded border border-border">
        <div className="flex items-center justify-between p-3">
          <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80">
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            <span className="font-mono text-sm text-primary">{name}</span>
            {required && (
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Required</span>
            )}
          </CollapsibleTrigger>
          <Switch 
            checked={enabled} 
            onCheckedChange={required ? undefined : setEnabled}
            disabled={required}
            className="data-[state=checked]:bg-primary" 
          />
        </div>
        <p className="text-sm text-muted-foreground px-3 pb-3 -mt-1">
          {description}
        </p>
        <CollapsibleContent>
          <div className="border-t border-border bg-muted/30 p-3 space-y-4">
            {fieldGroups ? (
              fieldGroups.map((group) => (
                <div key={group.groupName}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-semibold text-foreground">{group.groupName}</p>
                    {group.required && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Always enabled</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {group.fields.map((field) => renderField(field, group.required))}
                  </div>
                </div>
              ))
            ) : fields ? (
              <div className="space-y-2">
                {fields.map((field) => renderField(field))}
              </div>
            ) : null}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export const GettingStartedSection = () => {
  return (
    <div className="space-y-12">
      {/* Create Project */}
      <section id="create-project" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Create a Project</h2>
        
        <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50 border border-blue-200 mb-6">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <p className="text-sm text-blue-700">
            Access to the Developer Portal requires a basic Valyd account.{' '}
            <strong>No KYC verification needed</strong> — just sign up at{' '}
            <a 
              href={API_CONFIG.DEV_PORTAL_URL} 
              className="underline font-medium hover:text-blue-800" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              dev.valyd.id
            </a>{' '}
            to get your API credentials.
          </p>
        </div>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Before integrating with {API_CONFIG.BRAND_NAME} SSO, you need to register your application 
            in our Developer Portal to obtain your client credentials.
          </p>

          {/* Step 1: Go to Portal */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground">Visit the Developer Portal</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Navigate to the Developer Portal and log in with your account.
            </p>
            <a
              href={API_CONFIG.DEV_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Open Developer Portal
            </a>
          </div>

          {/* Step 2: Create Project Form */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground">Fill in Project Details</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Click "Create Project" and fill in the following information:
            </p>

            <div className="space-y-4">
              {/* Project Name */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Project Name</h4>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Required</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your application's name that users will see on the consent screen when logging in.
                </p>
                <div className="mt-3 p-3 bg-background rounded border border-border">
                  <span className="text-sm text-muted-foreground">Example: </span>
                  <code className="text-sm text-primary">My Awesome App</code>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Description</h4>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Optional</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  A brief description of your application. Helps users understand what they're authorizing.
                </p>
              </div>

              {/* Allowed Web Origins */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Allowed Web Origins</h4>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Required</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  The domains from which your application will send requests. This is a security feature 
                  to prevent unauthorized domains from using your credentials.
                </p>
                <div className="mt-3 p-3 bg-background rounded border border-border">
                  <span className="text-sm text-muted-foreground">Example: </span>
                  <code className="text-sm text-primary">https://myapp.com, https://staging.myapp.com</code>
                </div>
              </div>

              {/* Redirect URL */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Redirect URL</h4>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Required</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  The URL where users will be redirected after authentication. This is where you'll 
                  receive the authorization code.
                </p>
                <div className="mt-3 p-3 bg-background rounded border border-border">
                  <span className="text-sm text-muted-foreground">Example: </span>
                  <code className="text-sm text-primary">https://myapp.com/callback</code>
                </div>
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                  <div className="flex items-start gap-2 text-sm text-orange-700">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Important:</strong> The redirect URL must NOT end with a trailing slash (<code>/</code>)</span>
                  </div>
                </div>
              </div>

              {/* Allowed Scopes */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Allowed Scopes</h4>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Required</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Select the data permissions your application needs. Users will see these scopes 
                  on the consent screen.
                </p>
                
                <div className="space-y-3">
                  {/* Profile Scope - Required with grouped fields */}
                  <ScopeDropdown 
                    name="profile"
                    description="Core biometric identity. Face vector is required for most Valyd features. KYC fields are optional."
                    required={true}
                    fieldGroups={[
                      {
                        groupName: "Core Biometrics",
                        required: true,
                        fields: [
                          { name: "Face Vector", description: "Biometric face data — foundational to Valyd" },
                          { name: "Face Match", description: "Facial recognition matching" },
                        ]
                      },
                      {
                        groupName: "KYC Data - Select Verification Method Below",
                        required: false,
                        fields: [
                          { name: "Name", description: "User's self reported name" },
                          { name: "Age", description: "User's Age Estimate" },
                          { name: "Portrait", description: "User's profile photo" },
                        ]
                      }
                    ]}
                  />
                  
                  {/* Verifications Scope - Expandable */}
                  <ScopeDropdown 
                    name="verifications"
                    description="Document-based identity verification"
                    fields={[
                      { name: "ID Verification", description: "Government ID document verification" },
                      { name: "Licenses", description: "Professional or driver's licenses" },
                    ]}
                  />
                  
                  {/* ZKP Scope - Expandable */}
                  <ScopeDropdown 
                    name="zkp"
                    description="Zero-Knowledge Proof verification — prove facts without revealing data"
                    fields={[
                      { name: "Age Verification", description: "Prove age without revealing birthdate" },
                      { name: "Country Verification", description: "Prove residency without revealing address" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Credentials */}
      <section id="get-credentials" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Get Your Credentials</h2>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            After creating your project, you'll immediately see a modal with your credentials.
          </p>

          {/* Credentials Modal */}
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground">Save Your Credentials</h3>
            </div>

            <div className="space-y-4">
              {/* Client ID */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-foreground">Client ID</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Your unique application identifier. You can view this anytime in your project settings.
                </p>
                <div className="flex items-center gap-2 p-3 bg-background rounded border border-border font-mono text-sm">
                  <span className="flex-1 text-muted-foreground">9357c59bc1794b4c9efe8823e5878147</span>
                  <button className="p-1 hover:bg-muted rounded">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Client Secret */}
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Client Secret</h4>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  <strong>⚠️ This is shown only once!</strong> Copy and store it securely immediately. 
                  If you lose it, you'll need to regenerate it.
                </p>
                <div className="flex items-center gap-2 p-3 bg-white rounded border border-red-200 font-mono text-sm">
                  <span className="flex-1 text-muted-foreground">sk_live_a1b2c3d4e5f6g7h8i9j0...</span>
                  <button className="p-1 hover:bg-red-100 rounded">
                    <Copy className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="p-6 rounded-lg border border-green-200 bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 mb-4">✅ You're Ready!</h3>
            <p className="text-green-700 mb-4">
              With your Client ID and Client Secret, you can now integrate {API_CONFIG.BRAND_NAME} SSO 
              into your application. Next steps:
            </p>
            <ul className="space-y-2">
              {[
                "Store your client_secret securely in your backend environment variables",
                "Implement the 'Login with Valyd' button that redirects to the authorization URL",
                "Handle the callback and exchange the code for tokens",
                "Use the access_token to fetch user data",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
