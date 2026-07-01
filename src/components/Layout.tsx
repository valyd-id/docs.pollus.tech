import { useState, type ReactNode } from "react";
import { GlobalNav, type DocsProduct } from "@/components/GlobalNav";

interface LayoutProps {
  /** Active product for the nav switch. */
  product: DocsProduct;
  /**
   * Renders the product's sidebar. `onNavigate` closes the mobile drawer after
   * a click; it's undefined for the desktop sidebar where there's nothing to close.
   */
  renderSidebar: (opts: { onNavigate?: () => void }) => ReactNode;
  children: ReactNode;
}

const NAV_H = "3.5rem"; // h-14, kept in one place so the sidebar offset can't drift.

/**
 * Shared docs shell: the persistent GlobalNav on top, a sticky sidebar on the
 * left (desktop) or a drawer (mobile), and the page content. Both product pages
 * render through this, so the nav and mobile behaviour live in one place.
 */
export const Layout = ({ product, renderSidebar, children }: LayoutProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav product={product} onMenuToggle={() => setDrawerOpen((o) => !o)} />

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          style={{ top: NAV_H }}
          onClick={closeDrawer}
        >
          <div
            className="h-full w-64 max-w-[80%] overflow-y-auto bg-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            {renderSidebar({ onNavigate: closeDrawer })}
          </div>
        </div>
      )}

      <div className="flex">
        <div
          className="sticky hidden shrink-0 overflow-y-auto lg:block"
          style={{ top: NAV_H, height: `calc(100vh - ${NAV_H})` }}
        >
          {renderSidebar({})}
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};
