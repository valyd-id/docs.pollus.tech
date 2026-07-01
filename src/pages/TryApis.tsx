import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";
import valydLogo from "@/assets/valyd-wordmark.png";
import { TryApisContent } from "@/components/docs/sandbox/TryApisContent";
import { API_CONFIG } from "@/lib/api-config";

const TryApis = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Standalone page nav — only shown at /sandbox, not when embedded on the landing */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-[1500px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={valydLogo} alt="Valyd" className="h-6 w-auto" />
              <span className="hidden sm:inline-flex text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70 font-semibold border border-border">
                Docs
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/docs"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Full Documentation
            </Link>
            <a
              href={API_CONFIG.DEV_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Get credentials
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <TryApisContent />
    </div>
  );
};

export default TryApis;
