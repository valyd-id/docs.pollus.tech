import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Zap,
  LayoutDashboard,
  Shuffle,
  Globe,
  Server,
  Code,
  AlertTriangle,
  ArrowLeft,
  Package,
} from "lucide-react";
import valydWordmark from "@/assets/valyd-wordmark.png";
import { ModeSwitchCompact, type VerifyMode } from "./ModeSwitch";
import { ProductSwitchCompact, type VerifyProduct } from "./ProductSwitch";

interface Item {
  id: string;
  label: string;
  icon?: React.ReactNode;
  indent?: boolean;
  /** Modes this item belongs to. Omit = shown in all modes. */
  modes?: VerifyMode[];
  /** Hosted products this item belongs to. Omit = shown for both products. */
  products?: VerifyProduct[];
}

const guides: Item[] = [
  { id: "intro", label: "Introduction", icon: <BookOpen className="h-4 w-4" /> },
  { id: "quickstart", label: "Quickstart", icon: <Zap className="h-4 w-4" /> },
  { id: "console", label: "Developer Console", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "modes", label: "Choose your integration", icon: <Shuffle className="h-4 w-4" /> },

  // Hosted · Managed by Valyd
  { id: "hosted", label: "Managed by Valyd", icon: <Globe className="h-4 w-4" />, modes: ["hosted"], products: ["managed"] },
  { id: "managed-register", label: "1 · Register your app", indent: true, modes: ["hosted"], products: ["managed"] },
  { id: "managed-login", label: "2 · Login with Valyd", indent: true, modes: ["hosted"], products: ["managed"] },
  { id: "managed-callback", label: "3 · Exchange the code", indent: true, modes: ["hosted"], products: ["managed"] },
  { id: "managed-session", label: "4 · Create a session", indent: true, modes: ["hosted"], products: ["managed"] },
  { id: "managed-redirect", label: "5 · Redirect the user", indent: true, modes: ["hosted"], products: ["managed"] },
  { id: "managed-writeback", label: "6 · Write-back", indent: true, modes: ["hosted"], products: ["managed"] },
  { id: "managed-result", label: "7 · Read the result", indent: true, modes: ["hosted"], products: ["managed"] },

  // Hosted · Verify fresh every time
  { id: "hosted", label: "Verify fresh every time", icon: <Globe className="h-4 w-4" />, modes: ["hosted"], products: ["fresh"] },
  { id: "hosted-fresh-workflow", label: "1 · Create a workflow", indent: true, modes: ["hosted"], products: ["fresh"] },
  { id: "hosted-fresh-session", label: "2 · Create a session", indent: true, modes: ["hosted"], products: ["fresh"] },
  { id: "hosted-fresh-redirect", label: "3 · Redirect the user", indent: true, modes: ["hosted"], products: ["fresh"] },
  { id: "hosted-fresh-result", label: "4 · Read the result", indent: true, modes: ["hosted"], products: ["fresh"] },

  // Standalone
  { id: "standalone", label: "Standalone APIs", icon: <Server className="h-4 w-4" />, modes: ["standalone"] },

  // Shared
  { id: "sdk", label: "Node SDK", icon: <Package className="h-4 w-4" /> },
  { id: "sdk-install", label: "Install & init", indent: true },
  { id: "sdk-config", label: "Constructor options", indent: true },
  { id: "sdk-resources", label: "Resources", indent: true },
  { id: "sdk-types", label: "Helpers & types", indent: true },
  { id: "sdk-errors", label: "Error handling", indent: true },
  { id: "sdk-quickstarts", label: "Quickstarts", indent: true },
  { id: "sdk-webhook", label: "Express webhook", indent: true },
];

const apiRef: Item[] = [
  { id: "api-sessions", label: "Sessions", icon: <Code className="h-4 w-4" />, modes: ["hosted"] },
  { id: "api-workflows", label: "Workflows", icon: <Code className="h-4 w-4" />, modes: ["hosted"] },
  { id: "api-standalone", label: "Standalone checks", icon: <Code className="h-4 w-4" />, modes: ["standalone"] },
  { id: "api-decision", label: "Decision", icon: <Code className="h-4 w-4" />, modes: ["hosted"] },
  { id: "api-errors", label: "Errors & rate limits", icon: <AlertTriangle className="h-4 w-4" /> },
];

interface Props {
  active: string;
  onClick: (id: string) => void;
  mode: VerifyMode;
  onModeChange: (m: VerifyMode) => void;
  product: VerifyProduct;
  onProductChange: (p: VerifyProduct) => void;
}

const visible = (item: Item, mode: VerifyMode, product: VerifyProduct) => {
  if (item.modes && !item.modes.includes(mode)) return false;
  // product filter only applies inside hosted
  if (mode === "hosted" && item.products && !item.products.includes(product)) return false;
  return true;
};

export const VerifySidebar = ({ active, onClick, mode, onModeChange, product, onProductChange }: Props) => {
  const renderItem = (item: Item) => (
    <li key={item.id}>
      <button
        onClick={() => onClick(item.id)}
        className={cn(
          "group flex items-center gap-2.5 w-full rounded-lg transition-smooth text-left",
          item.indent ? "pl-9 pr-3 py-1.5 text-xs" : "px-3 py-2 text-sm",
          active === item.id
            ? "bg-primary/10 text-primary font-medium shadow-soft"
            : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-0.5"
        )}
      >
        {item.icon && (
          <span className={cn("transition-smooth", active === item.id ? "text-primary" : "group-hover:text-primary")}>
            {item.icon}
          </span>
        )}
        {item.label}
      </button>
    </li>
  );

  const visibleGuides = guides.filter((i) => visible(i, mode, product));
  const visibleApiRef = apiRef.filter((i) => visible(i, mode, product));

  return (
    <aside className="w-64 border-r border-border bg-sidebar h-screen sticky top-0 overflow-y-auto">
      <div className="px-6 pt-7 pb-5 border-b border-border">
        <Link to="/" className="block group">
          <img src={valydWordmark} alt="Valyd" className="h-7 w-auto transition-smooth group-hover:opacity-80" />
          <p className="mt-2 text-xs text-muted-foreground tracking-wide">VERIFY · Documentation</p>
        </Link>
      </div>

      <nav className="p-4 space-y-6">
        <div>
          <Link
            to="/docs"
            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Valyd ID docs
          </Link>
        </div>

        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            Integration
          </p>
          <ModeSwitchCompact mode={mode} onModeChange={onModeChange} />
          {mode === "hosted" && (
            <div className="mt-2">
              <ProductSwitchCompact product={product} onProductChange={onProductChange} />
            </div>
          )}
        </div>

        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            Guides
          </p>
          <ul className="space-y-1">{visibleGuides.map(renderItem)}</ul>
        </div>

        <div>
          <p className="px-3 mb-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            API Reference
          </p>
          <ul className="space-y-1">{visibleApiRef.map(renderItem)}</ul>
        </div>
      </nav>
    </aside>
  );
};
