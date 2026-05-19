// src/components/SearchBar.tsx
// Drop this between your hero section and the "System Currently Monitoring" section in your dashboard page.
// Usage: <SearchBar />

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SUGGESTIONS = [
  "Magnesium glycinate",
  "Berberine",
  "Colostrum supplement",
  "Mushroom coffee",
  "Tongkat Ali",
  "NAC supplement",
  "Shilajit resin",
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="px-6 py-8 max-w-7xl mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Search Any Wellness Trend
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter any ingredient or health trend — get AI-powered opportunity analysis for the Indian market in seconds.
          </p>
        </div>

        {/* Input row */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder='e.g. "Magnesium glycinate", "Colostrum", "Berberine"...'
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!query.trim()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
          >
            Analyze →
          </button>
        </div>

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground font-medium">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary text-secondary-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
