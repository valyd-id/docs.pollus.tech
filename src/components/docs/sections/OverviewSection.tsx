import { API_CONFIG } from "@/lib/api-config";
import { CodeBlock } from "../CodeBlock";
import { PostmanCollectionGenerator } from "../PostmanCollectionGenerator";
import { CheckCircle2, ArrowRight, Info, Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const OverviewSection = () => {
  return <section id="overview" className="scroll-mt-8">
      <div className="space-y-8">
        {/* Hero */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            {API_CONFIG.BRAND_NAME} Third-Party SSO API
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
            Integrate secure identity verification and authentication into your application 
            using {API_CONFIG.BRAND_NAME}'s OAuth2-based Single Sign-On system. Get access to 
            verified user profiles, professional licenses, and identity verification data.
          </p>
        </div>

        {/* Quick Info Cards */}
        

        {/* Base URL */}
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="font-semibold text-foreground mb-3">Base URL</h3>
          <CodeBlock code={API_CONFIG.API_BASE_URL} language="text" />
        </div>

        {/* Integration Flow */}
        <div className="p-6 rounded-lg border border-border bg-card">
          <h3 className="text-xl font-semibold text-foreground mb-4">Integration Flow</h3>
          
          <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50 border border-blue-200 mb-6">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
            <p className="text-sm text-blue-700">
              Access to the Developer Portal requires a basic Valyd account.{' '}
              <strong>No KYC verification needed</strong> — just sign up at{' '}
              <a href={API_CONFIG.DEV_PORTAL_URL} className="underline font-medium hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                dev.valyd.id
              </a>{' '}
              to get your API credentials.
            </p>
          </div>
          
          <div className="space-y-4">
            {[{
            step: 1,
            title: "Create Project",
            description: `Register your application at ${API_CONFIG.DEV_PORTAL_URL} to get your client credentials.`
          }, {
            step: 2,
            title: "Redirect to Authorization",
            description: "When user clicks 'Login with Valyd', redirect them to the authorization URL with your client_id and scopes."
          }, {
            step: 3,
            title: "User Consent",
            description: "User sees the consent screen with requested permissions and approves access."
          }, {
            step: 4,
            title: "Receive Authorization Code",
            description: "After approval, user is redirected to your callback URL with a one-time code (valid for 5 minutes)."
          }, {
            step: 5,
            title: "Exchange Code for Tokens",
            description: "Your backend exchanges the code for access_token and refresh_token using your client_secret."
          }, {
            step: 6,
            title: "Access Protected Resources",
            description: "Use the access_token to call /userinfo, /licenses, and /verifications endpoints."
          }].map((item, index, arr) => <div key={item.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pb-4 border-b border-border last:border-0">
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>)}
          </div>
        </div>

        {/* Security Notes */}
        <div className="p-6 rounded-lg border border-orange-200 bg-orange-50">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">⚠️ Security Notes</h3>
          <ul className="space-y-2">
            {["Keep your client_secret server-side only — never expose it in frontend code", "access_token is short-lived (15 minutes); refresh_token is longer-lived", "Always use HTTPS for all API calls", "Store tokens securely and never log them in production"].map((note, index) => <li key={index} className="flex items-start gap-2 text-orange-700">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>)}
          </ul>
        </div>

        {/* Developer Tools Widget */}
        <PostmanCollectionGenerator />
      </div>
    </section>;
};