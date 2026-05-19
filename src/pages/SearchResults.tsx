// src/pages/SearchResults.tsx

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  ArrowLeft, Search, TrendingUp, TrendingDown,
  ShieldCheck, AlertCircle, CheckCircle2, XCircle, Zap, Users, Building2, Shield,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

interface Competitor {
  name: string;
  product?: string;
  priceRange: string;
  strength: string;
  weakness: string;
}

interface SocialSignals {
  reddit: {
    estimatedPosts: string;
    topSubreddits: string[];
    sentimentScore: string;
    topDiscussion: string;
    indianVsGlobal: string;
  };
  youtube: {
    estimatedVideos: string;
    indianCreators: string;
    estimatedViews: string;
    topVideoType: string;
    growthTrend: string;
  };
  instagram: {
    estimatedPosts: string;
    topHashtags: string[];
    indianInfluencers: string;
    contentType: string;
  };
}

interface RegulatoryStatus {
  fssai: string;
  fssaiNote: string;
  fdaUSA: string;
  safetyRating: string;
  clinicalStudies: string;
}

interface AIResult {
  name: string;
  verdict: string;
  verdictReason: string;
  score: number;
  recommendedAction: string;
  gtGrowthEstimate: string;
  marketSizeIndia: string;
  indiaReadiness: string;
  timeToMainstream: string;
  competitionIndia: string;
  signal: string;
  gap: string;
  opportunity: string;
  whyTrending?: string;
  whyDeclining?: string | null;
  fadReason?: string | null;
  indianConsumerSegment?: string;
  competitors?: Competitor[];
  socialSignals?: SocialSignals;
  regulatoryStatus?: RegulatoryStatus;
  fadVsReal: {
    clinicalBacking: boolean;
    westernMainstream2yrs: boolean;
    solvesRealPain: boolean;
    indiaSpecificNeed: boolean;
  };
  consumerQuestions: string[];
  trendData?: number[];
}

const LOADING_STEPS = [
  "Fetching Google Trends India data",
  "Scanning social signals — Reddit, YouTube, Instagram",
  "Analysing Indian market & competitors",
  "Generating AI opportunity brief",
];

const MONTHS = ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

function ScoreRing({ score }: { score: number }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#EF4444" : score >= 60 ? "#F97316" : "#F59E0B";
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3.5" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-black text-sm" style={{ color }}>
        {score}
      </div>
    </div>
  );
}

function getVerdictStyles(verdict: string) {
  switch (verdict) {
    case "REAL TREND":         return { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  badge: "bg-green-100 text-green-700 border-green-200" };
    case "EARLY SIGNAL":       return { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700 border-amber-200" };
    case "FAD":                return { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    badge: "bg-red-100 text-red-700 border-red-200" };
    case "MAINSTREAM ALREADY": return { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700 border-blue-200" };
    default:                   return { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700 border-amber-200" };
  }
}

function getActionStyles(action: string) {
  switch (action) {
    case "ACT NOW":       return "bg-destructive/10 text-destructive border-destructive/30";
    case "WATCH":         return "bg-accent/10 text-accent border-accent/30";
    case "RESEARCH MORE": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "SKIP":          return "bg-red-100 text-red-600 border-red-300";
    default:              return "bg-muted text-muted-foreground border-border";
  }
}

function getSentimentColor(s: string) {
  if (s === "Positive") return "text-green-600 bg-green-50 border-green-200";
  if (s === "Negative") return "text-red-600 bg-red-50 border-red-200";
  return "text-amber-600 bg-amber-50 border-amber-200";
}

function getRegulatoryColor(s: string) {
  if (s === "Permitted" || s === "GRAS" || s === "Approved" || s === "Safe") return "text-green-700 bg-green-50 border-green-200";
  if (s === "Restricted" || s === "Not Approved") return "text-red-700 bg-red-50 border-red-200";
  return "text-amber-700 bg-amber-50 border-amber-200";
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [state, setState] = useState<"loading" | "result" | "error">("loading");
  const [dotStep, setDotStep] = useState(0);
  const [result, setResult] = useState<AIResult | null>(null);
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    if (!query.trim()) return;
    setInputValue(query);
    runAnalysis(query);
  }, [query]);

  const runAnalysis = async (q: string) => {
    setState("loading");
    setDotStep(0);
    setResult(null);
    setErrorDetail("");

    const iv = setInterval(
      () => setDotStep((d) => Math.min(d + 1, LOADING_STEPS.length - 1)),
      900
    );

    try {
      const res = await fetch("https://wellnessradar-india.onrender.com/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      if (!data.name || !data.verdict) throw new Error("Bad response: " + JSON.stringify(data).slice(0, 100));

      clearInterval(iv);
      setResult(data as AIResult);
      setState("result");
    } catch (err: any) {
      clearInterval(iv);
      setErrorDetail(err.message || "Unknown error");
      setState("error");
    }
  };

  const handleNewSearch = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed === query) return;
    setSearchParams({ q: trimmed });
  };

  const vs = result ? getVerdictStyles(result.verdict) : null;
  const isFad = result?.verdict === "FAD";

  const chartData = result?.trendData
    ? result.trendData
        .filter((_, i) => i % Math.max(1, Math.floor(result.trendData!.length / 12)) === 0)
        .slice(0, 12)
        .map((v, i) => ({ month: MONTHS[i] || `W${i}`, value: v }))
    : [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Back + search bar */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewSearch()}
                placeholder="Search another trend..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <button
              onClick={handleNewSearch}
              disabled={!inputValue.trim() || inputValue.trim() === query}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
            >
              Analyze →
            </button>
          </div>
        </div>

        {/* Loading */}
        {state === "loading" && (
          <div className="rounded-2xl border border-border bg-card p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin flex-shrink-0" />
              <span className="text-sm text-foreground">
                Analysing <span className="font-bold text-primary">"{query}"</span> across Google Trends, Reddit, YouTube & Instagram...
              </span>
            </div>
            <div className="space-y-3 pl-2">
              {LOADING_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3 transition-opacity duration-500" style={{ opacity: i <= dotStep ? 1 : 0.2 }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: i < dotStep ? "hsl(var(--primary))" : i === dotStep ? "hsl(var(--accent))" : "hsl(var(--muted))",
                  }} />
                  <span className={`text-sm ${i < dotStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {step}{i < dotStep ? " ✓" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive mb-1">Analysis Failed</p>
              <p className="text-sm text-muted-foreground mb-2">
                Make sure <code className="bg-muted px-1 rounded text-xs">node server.js</code> is running inside the <code className="bg-muted px-1 rounded text-xs">server</code> folder.
              </p>
              {errorDetail && (
                <p className="text-xs text-muted-foreground bg-muted rounded p-2 font-mono break-all">{errorDetail}</p>
              )}
              <button onClick={() => runAnalysis(query)} className="mt-3 text-sm font-semibold text-primary hover:underline">
                Try again →
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {state === "result" && result && vs && (
          <div className="space-y-4 animate-fade-in">

            {/* Verdict hero */}
            <div className={`rounded-2xl border ${vs.border} ${vs.bg} p-6 flex items-start justify-between gap-4`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${vs.badge}`}>{result.verdict}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getActionStyles(result.recommendedAction)}`}>{result.recommendedAction}</span>
                </div>
                <h1 className="text-2xl font-black text-foreground mb-2">{result.name}</h1>
                <p className={`text-sm font-medium ${vs.text} leading-relaxed`}>{result.verdictReason}</p>
              </div>
              <ScoreRing score={result.score} />
            </div>

            {/* FAD WARNING */}
            {isFad && (result.fadReason || result.whyDeclining) && (
              <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-bold text-red-700 uppercase tracking-widest">Why You Should NOT Pursue This</span>
                </div>
                {result.fadReason && <p className="text-sm text-red-700 leading-relaxed mb-3">{result.fadReason}</p>}
                {result.whyDeclining && (
                  <>
                    <div className="flex items-center gap-2 mb-2 mt-4">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Why It Is Declining</span>
                    </div>
                    <p className="text-sm text-red-600 leading-relaxed">{result.whyDeclining}</p>
                  </>
                )}
              </div>
            )}

            {/* Live trend chart */}
            {chartData.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Google Trends India — Live 12 Month Data</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Live
                  </span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={isFad ? "#EF4444" : "hsl(16,80%,44%)"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={isFad ? "#EF4444" : "hsl(16,80%,44%)"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: number) => [v + "/100", "Search Interest"]}
                      />
                      <Area type="monotone" dataKey="value"
                        stroke={isFad ? "#EF4444" : "hsl(16,80%,44%)"} strokeWidth={2.5}
                        fill="url(#trendGrad)" dot={false}
                        activeDot={{ r: 4, fill: isFad ? "#EF4444" : "hsl(16,80%,44%)", stroke: "#fff", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 5 metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {([
                ["Est. Growth",  result.gtGrowthEstimate, "text-primary"],
                ["Market Size",  result.marketSizeIndia,  "text-foreground"],
                ["Readiness",    result.indiaReadiness,   "text-green-600"],
                ["Competition",  result.competitionIndia, "text-foreground"],
                ["Time Window",  result.timeToMainstream, "text-green-600"],
              ] as [string, string, string][]).map(([label, value, color]) => (
                <div key={label} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-muted-foreground font-medium mb-1 uppercase tracking-wide" style={{ fontSize: 10 }}>{label}</p>
                  <p className={`text-sm font-bold ${color} leading-tight`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Social Signals */}
            {result.socialSignals && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">📡</span>
                  <span className="text-sm font-bold text-foreground">Social Signals — India</span>
                  <span className="ml-auto text-xs text-muted-foreground">AI-estimated based on trend data</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Reddit */}
                  <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🔴</span>
                      <span className="font-bold text-sm text-foreground">Reddit India</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Est. Posts</span>
                        <span className="text-xs font-bold text-foreground">{result.socialSignals.reddit.estimatedPosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Indian %</span>
                        <span className="text-xs font-bold text-foreground">{result.socialSignals.reddit.indianVsGlobal}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Sentiment</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getSentimentColor(result.socialSignals.reddit.sentimentScore)}`}>
                          {result.socialSignals.reddit.sentimentScore}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-orange-200">
                        <p className="text-xs text-muted-foreground mb-1">Top discussion:</p>
                        <p className="text-xs text-foreground italic">"{result.socialSignals.reddit.topDiscussion}"</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.socialSignals.reddit.topSubreddits.map(s => (
                          <span key={s} className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">▶️</span>
                      <span className="font-bold text-sm text-foreground">YouTube India</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Est. Videos</span>
                        <span className="text-xs font-bold text-foreground">{result.socialSignals.youtube.estimatedVideos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Indian Creators</span>
                        <span className="text-xs font-bold text-primary">{result.socialSignals.youtube.indianCreators}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Est. Views</span>
                        <span className="text-xs font-bold text-foreground">{result.socialSignals.youtube.estimatedViews}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Trend</span>
                        <span className={`text-xs font-bold ${result.socialSignals.youtube.growthTrend === "Rising" ? "text-green-600" : result.socialSignals.youtube.growthTrend === "Declining" ? "text-red-600" : "text-amber-600"}`}>
                          {result.socialSignals.youtube.growthTrend === "Rising" ? "↑" : result.socialSignals.youtube.growthTrend === "Declining" ? "↓" : "→"} {result.socialSignals.youtube.growthTrend}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-red-200">
                        <p className="text-xs text-muted-foreground mb-1">Top content type:</p>
                        <p className="text-xs text-foreground">{result.socialSignals.youtube.topVideoType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="rounded-xl border border-pink-200 bg-pink-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">📸</span>
                      <span className="font-bold text-sm text-foreground">Instagram India</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Est. Posts</span>
                        <span className="text-xs font-bold text-foreground">{result.socialSignals.instagram.estimatedPosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Indian Influencers</span>
                        <span className="text-xs font-bold text-primary">{result.socialSignals.instagram.indianInfluencers}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-pink-200">
                        <p className="text-xs text-muted-foreground mb-1">Content type:</p>
                        <p className="text-xs text-foreground">{result.socialSignals.instagram.contentType}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.socialSignals.instagram.topHashtags.map(h => (
                          <span key={h} className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">{h}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Why Trending */}
            {result.whyTrending && !isFad && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Why This Is Trending in India</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.whyTrending}</p>
              </div>
            )}

            {/* Indian Consumer Segment */}
            {result.indianConsumerSegment && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Target Indian Consumer Segment</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.indianConsumerSegment}</p>
              </div>
            )}

            {/* Fad filter */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Fad vs Real Trend Filter</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  ["Clinical Backing",          result.fadVsReal.clinicalBacking],
                  ["Western Mainstream 2+ yrs", result.fadVsReal.westernMainstream2yrs],
                  ["Solves Real Pain",          result.fadVsReal.solvesRealPain],
                  ["India-Specific Need",       result.fadVsReal.indiaSpecificNeed],
                ] as [string, boolean][]).map(([label, val]) => (
                  <div key={label} className={`flex items-center gap-2.5 p-3 rounded-xl border ${val ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    {val ? <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> : <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                    <span className={`text-xs font-semibold ${val ? "text-green-700" : "text-red-600"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Status */}
            {result.regulatoryStatus && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Regulatory Status</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">FSSAI India</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getRegulatoryColor(result.regulatoryStatus.fssai)}`}>
                      {result.regulatoryStatus.fssai}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2">{result.regulatoryStatus.fssaiNote}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">FDA USA</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getRegulatoryColor(result.regulatoryStatus.fdaUSA)}`}>
                      {result.regulatoryStatus.fdaUSA}
                    </span>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Safety Rating</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getRegulatoryColor(result.regulatoryStatus.safetyRating)}`}>
                      {result.regulatoryStatus.safetyRating}
                    </span>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Clinical Studies</p>
                    <p className="text-sm font-bold text-foreground">{result.regulatoryStatus.clinicalStudies}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Competitors */}
            {result.competitors && result.competitors.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Indian Market Competitors</span>
                </div>
                <div className="space-y-3">
                  {result.competitors.map((c, i) => (
                    <div key={i} className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div>
                          <span className="font-bold text-sm text-foreground">{c.name}</span>
                          {c.product && <p className="text-xs text-muted-foreground mt-0.5">{c.product}</p>}
                        </div>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">{c.priceRange}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-green-600 font-semibold mb-0.5">✓ Strength</p>
                          <p className="text-xs text-muted-foreground">{c.strength}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-500 font-semibold mb-0.5">✗ Gap / Weakness</p>
                          <p className="text-xs text-muted-foreground">{c.weakness}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signal + Gap */}
            {!isFad && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">The Signal</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.signal}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-xs font-bold text-destructive uppercase tracking-widest">The Gap</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.gap}</p>
                </div>
              </div>
            )}

            {/* Opportunity */}
            {!isFad && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">The Opportunity</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.opportunity}</p>
              </div>
            )}

            {/* Consumer questions */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">What Indian Consumers Are Searching</p>
              <div className="space-y-2.5">
                {result.consumerQuestions.map((q) => (
                  <div key={q} className="text-sm text-foreground border-l-2 border-primary/30 pl-3 py-0.5">{q}</div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center pb-4">
              Google Trends data is live. Social signals are AI-estimated based on trend velocity and market data. Market estimates are indicative.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;




