import { Link, useLocation } from "react-router-dom";
import { Radar, Activity } from "lucide-react";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/signals", label: "Signals Universe" },
  { to: "/regulatory", label: "Regulatory Checker" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Radar className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">
              Wellness<span className="text-primary">Radar</span> India
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 text-xs font-mono md:flex">
            <span className="inline-block h-2 w-2 rounded-full bg-success pulse-live" />
            <span className="text-success">LIVE</span>
            <span className="text-muted-foreground">— Last scan: March 2026</span>
          </div>

          {/* Mobile nav toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="inline-block h-2 w-2 rounded-full bg-success pulse-live" />
            <span className="text-xs text-success font-mono">LIVE</span>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Radar className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">
              Wellness<span className="text-primary">Radar</span> India
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Built for the Mosaic Wellness Fellowship 2026
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Data Sources: Google Trends • Reddit • Amazon India • YouTube • Answer The Public • PubMed • FSSAI
          </p>
          <p className="text-xs text-muted-foreground/60">
            Disclaimer: All market size estimates are based on publicly available data. Regulatory information should be verified with FSSAI before product launch.
          </p>
        </div>
      </footer>
    </div>
  );
};
