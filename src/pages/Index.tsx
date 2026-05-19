import { SearchBar } from "@/components/SearchBar";

// Place <SearchBar /> between your hero section and the monitoring ticker
<SearchBar />
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Search, Shield, Zap } from "lucide-react";
import { Layout } from "@/components/Layout";
import { TrendCard } from "@/components/TrendCard";
import { LiveScanner } from "@/components/LiveScanner";
import { trends } from "@/data/trends";
const stats = [
  { label: "Keywords Monitored", value: "150+" },
  { label: "Categories", value: "14" },
  { label: "Data Sources", value: "5" },
  { label: "Trends Scored", value: "20" },
  { label: "Last Scan", value: "Mar 2026" },
];
const CATEGORIES = ["All", "Fitness", "Devices", "Women's Health", "Longevity", "Skincare", "Gut Health", "Nootropics"];
const WINDOWS = ["All", "3-6 months", "6-9 months", "9-12 months"];
const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeWindow, setActiveWindow] = useState("All");
  const filtered = trends.filter((t) => {
    const catMatch = activeCategory === "All" || t.category === activeCategory;
    const winMatch = activeWindow === "All" || t.timeWindow.includes(activeWindow.replace(" months", "").trim());
    return catMatch && winMatch;
  });
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              Trend Intelligence for Indian D2C Founders
            </div>
            <h1 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight text-foreground">
              Detect Wellness Trends{" "}
              <span className="gradient-text">Before They Go Mainstream</span>{" "}
              in India
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              WellnessRadar scans 150+ signals across Google Trends, Reddit, YouTube,
              research publications, and regulatory databases surfacing the next Rs.30Cr
              opportunity before anyone else sees it.
            </p>
            <SearchBar /> 
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#radar"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View This Month Radar <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                How It Works
              </Link>
            </div>
          </div>
          {/* Stats bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border bg-card/50 p-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center px-3">
                <p className="text-xl font-black font-mono text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Live Scanner */}
      <LiveScanner />
      {/* Trend Cards Grid */}
      <section id="radar" className="py-16">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Top 8 Opportunities - March 2026</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by Velocity + Market Size + Competition Gap + Time-to-Mainstream
              </p>
            </div>
            <span className="hidden text-xs text-muted-foreground font-mono md:block">
              Last updated: March 2026 | Next update: April 2026
            </span>
          </div>
          {/* Filter bar */}
          <div className="mb-8 p-4 rounded-xl border border-border bg-card/50 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground font-semibold w-20">Category</span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground font-semibold w-20">Window</span>
              <div className="flex flex-wrap gap-1.5">
                {WINDOWS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setActiveWindow(w)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      activeWindow === w
                        ? "bg-accent text-accent-foreground border-accent font-semibold"
                        : "bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
                    }`}
                  >
                    {w}
                    {w !== "All" && (w.includes("3-6") || w.includes("6-9")) && (
                      <span className="ml-1 text-yellow-400">*</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            {(activeCategory !== "All" || activeWindow !== "All") && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Showing {filtered.length} of {trends.length} trends
                </span>
                <button
                  onClick={() => { setActiveCategory("All"); setActiveWindow("All"); }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          {/* Cards grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((trend, i) => (
              <TrendCard key={trend.id} trend={trend} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-16 text-muted-foreground">
                No trends match the selected filters.
                <button
                  onClick={() => { setActiveCategory("All"); setActiveWindow("All"); }}
                  className="ml-2 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Quick Links */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              to="/signals"
              className="glow-card flex items-center gap-4 rounded-xl border border-border bg-card p-5"
            >
              <BarChart3 className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">Signals Universe</h3>
                <p className="text-xs text-muted-foreground">150+ keywords across 14 categories</p>
              </div>
            </Link>
            <Link
              to="/regulatory"
              className="glow-card flex items-center gap-4 rounded-xl border border-border bg-card p-5"
            >
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">Regulatory Checker</h3>
                <p className="text-xs text-muted-foreground">FSSAI, FDA and EFSA status lookup</p>
              </div>
            </Link>
            <Link
              to="/how-it-works"
              className="glow-card flex items-center gap-4 rounded-xl border border-border bg-card p-5"
            >
              <Zap className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">How It Works</h3>
                <p className="text-xs text-muted-foreground">Our 4-dimension scoring methodology</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Index;

