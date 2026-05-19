import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
import {
  ArrowLeft, TrendingUp, Youtube, MessageSquare, Instagram,
  BookOpen, ShieldCheck, Clock, Target, Zap,
  ExternalLink, BarChart3, Users, Globe, AlertCircle, ChevronRight
} from "lucide-react";
import { trends } from "@/data/trends";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";

const trendKeywords: Record<string, string> = {
  "creatine-for-women": "creatine for women",
  "red-light-therapy": "red light therapy",
  "cycle-syncing": "cycle syncing",
  "nmn-supplement": "NMN supplement",
  "pcos-natural-supplement": "PCOS supplement",
  "skin-cycling": "skin cycling",
  "postbiotic-supplement": "postbiotic",
  "lions-mane": "lion mane mushroom",
};

const trendChartData: Record<string, number[]> = {
  "creatine-for-women":      [12, 15, 18, 22, 28, 35, 44, 55, 65, 78, 88, 95],
  "red-light-therapy":       [10, 13, 16, 20, 26, 34, 44, 57, 68, 80, 92, 100],
  "cycle-syncing":           [8,  11, 14, 18, 23, 29, 37, 46, 57, 68, 79, 88],
  "nmn-supplement":          [5,  8,  11, 15, 20, 27, 36, 48, 60, 74, 87, 96],
  "pcos-natural-supplement": [22, 26, 30, 35, 41, 48, 56, 63, 71, 80, 88, 94],
  "skin-cycling":            [14, 18, 22, 27, 33, 40, 48, 57, 65, 74, 83, 91],
  "postbiotic-supplement":   [6,  9,  12, 16, 21, 27, 35, 44, 54, 65, 77, 88],
  "lions-mane":              [9,  12, 15, 19, 24, 31, 39, 49, 59, 71, 82, 93],
};

const MONTHS = ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
interface ChartPoint { month: string; value: number; }

function TrendChart({ trendId, gtGrowth }: { trendId: string; gtGrowth: string }) {
  const [liveData, setLiveData] = useState<ChartPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const fallback: ChartPoint[] = (trendChartData[trendId] || trendChartData["creatine-for-women"])
    .map((v, i) => ({ month: MONTHS[i], value: v }));

  useEffect(() => {
    const kw = trendKeywords[trendId] || trendId.replace(/-/g, " ");
    fetch("/api/trends?keyword=" + encodeURIComponent(kw))
      .then(r => r.json())
      .then(json => {
        const timeline = json?.default?.timelineData ?? [];
        if (timeline.length < 4) throw new Error("no data");
        const sampled = timeline.filter((_: unknown, i: number) => i % 4 === 0);
        setLiveData(sampled.map((d: { formattedAxisTime: string; value: number[] }) => ({
          month: d.formattedAxisTime.replace(/, 202\d/, "").slice(0, 6),
          value: d.value[0] ?? 0,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [trendId]);

  const data = liveData ?? fallback;
  const isLive = !!liveData;
  const gradId = "g" + trendId.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Google Trends India</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive
            ? <span className="flex items-center gap-1 text-xs text-green-500 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live</span>
            : <span className="text-xs text-muted-foreground">Estimated</span>}
          <span className="text-xs text-muted-foreground">Past 12 months</span>
        </div>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="hsl(16,80%,44%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(16,80%,44%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px", color: "#f1f5f9" }}
              formatter={(v: number) => [v + "/100", "Search Interest"]}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(16,80%,44%)" strokeWidth={2.5}
              fill={"url(#" + gradId + ")"} dot={false}
              activeDot={{ r: 4, fill: "hsl(16,80%,44%)", stroke: "#fff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          Growth: <span className="text-green-500 font-bold">{gtGrowth}</span> in 12 months
        </span>
        <a
          href={"https://trends.google.com/trends/explore?date=today+12-m&geo=IN&q=" + encodeURIComponent(trendKeywords[trendId] || trendId)}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          View live <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f97316" : "#f59e0b";
  const data = [{ value: score, fill: color }, { value: 100 - score, fill: "transparent" }];
  return (
    <div className="relative w-24 h-24">
      <RadialBarChart width={96} height={96} cx={48} cy={48} innerRadius={32} outerRadius={46}
        startAngle={90} endAngle={-270} data={data} barSize={8}>
        <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "#e2e8f0" }} />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">/100</span>
      </div>
    </div>
  );
}

const TrendBrief = () => {
  const { id } = useParams<{ id: string }>();
  const trend = trends.find(t => t.id === id);

  if (!trend) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">Trend not found</p>
            <Link to="/" className="text-primary hover:underline mt-2 inline-block">Back to Dashboard</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const scoreItems = [
    { label: "Velocity Score",     value: Math.round(trend.score * 0.26), max: 25, desc: "Searches growing " + trend.gtGrowth + " in 12 months" },
    { label: "Market Size",        value: Math.round(trend.score * 0.22), max: 25, desc: "Estimated " + trend.marketSizeLabel + " addressable market in India" },
    { label: "Competition Gap",    value: Math.round(trend.score * 0.28), max: 25, desc: trend.competitionLandscape + " currently active" },
    { label: "Time-to-Mainstream", value: Math.round(trend.score * 0.24), max: 25, desc: "Estimated " + trend.timeWindow + " before mainstream" },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Back nav */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {/* HERO HEADER */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-orange-400 to-amber-400" />
          <div className="p-6 flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-secondary text-secondary-foreground">
                  {trend.category}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  trend.status === "ACT NOW"
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-amber-50 border-amber-200 text-amber-600"
                }`}>
                  {trend.status}
                </span>
                <span className="text-xs text-muted-foreground">#{trend.rank} this month</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">{trend.name}</h1>
              <p className="text-base text-primary font-medium italic leading-relaxed max-w-2xl">"{trend.alert}"</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Time window:</span>
                  <span className={`font-semibold ${trend.timeWindow.includes("3-6") || trend.timeWindow.includes("6-9") ? "text-yellow-500" : "text-foreground"}`}>
                    {trend.timeWindow.replace(" ?", "")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Market:</span>
                  <span className="font-semibold text-foreground">{trend.marketSizeLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Competition:</span>
                  <span className="font-semibold text-green-500">{trend.competitionLandscape}</span>
                </div>
              </div>
            </div>
            <ScoreRing score={trend.score} />
          </div>
        </div>

        {/* ROW 1: Trends Chart + Social Signals + Research */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-5">
            <TrendChart trendId={trend.id} gtGrowth={trend.gtGrowth} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Social Signals</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                  <Youtube className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-red-700">YouTube</p>
                  <p className="text-xs text-red-600">{trend.youtubeViews} views</p>
                </div>
                <span className="text-xs font-semibold text-red-600">{trend.youtubeCreators}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-orange-700">Reddit</p>
                  <p className="text-xs text-orange-600">{trend.redditPosts} posts</p>
                </div>
                <span className="text-xs font-semibold text-orange-600">{trend.redditIndiaMentions} India</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Instagram className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-purple-700">Instagram</p>
                  <p className="text-xs text-purple-600">{trend.instagramHashtags} hashtags</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Research Signal</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
                  <p className="text-2xl font-black text-blue-600">{trend.pubmedPapers}</p>
                  <p className="text-xs text-blue-500 font-medium">PubMed Studies</p>
                </div>
                <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center">
                  <p className="text-sm font-black text-green-600">{trend.clinicalBacking ? "YES" : "NO"}</p>
                  <p className="text-xs text-green-500 font-medium">Clinical Backing</p>
                </div>
              </div>
              <a href={"https://pubmed.ncbi.nlm.nih.gov/?term=" + encodeURIComponent(trend.name)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                View on PubMed <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Regulatory</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">FSSAI India</span>
                  <span className="font-semibold text-foreground">Permitted</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">FDA USA</span>
                  <span className="font-semibold text-foreground">GRAS / Reviewed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Max Dosage</span>
                  <span className="font-semibold text-foreground">Per label</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Score Breakdown + Opportunity Brief */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Score Breakdown</span>
            </div>
            <div className="space-y-4">
              {scoreItems.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-foreground">{item.label}</span>
                    <span className="text-sm font-black text-primary">{item.value}<span className="text-muted-foreground font-normal">/{item.max}</span></span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-1000"
                      style={{ width: (item.value / item.max * 100) + "%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-bold text-foreground uppercase tracking-wide">Total Score</span>
              <span className="text-3xl font-black text-primary">{trend.score}<span className="text-lg text-muted-foreground font-normal">/100</span></span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Opportunity Brief</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">The Signal</p>
              <p className="text-sm text-foreground leading-relaxed">{trend.signal}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-destructive mb-1">The Gap</p>
              <p className="text-sm text-foreground leading-relaxed">{trend.gap}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Consumer Voice</p>
              <div className="space-y-1.5">
                {(trend.consumerVoice ?? []).map((q: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <ChevronRight className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">The Opportunity</p>
              <p className="text-sm text-foreground leading-relaxed">{trend.opportunity}</p>
            </div>
          </div>
        </div>

        {/* ROW 3: Competitor Analysis + If You Enter This Space */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div className="rounded-2xl border border-border bg-card p-5">
            <CompetitorAnalysis trend={trend} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">If You Enter This Space</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 flex-1 content-start">
              {(trend.opportunities ?? []).map((opp: string, i: number) => (
                <div key={i} className="flex items-start gap-2 rounded-xl border border-border bg-secondary/40 p-3 hover:border-primary/30 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-black text-primary">{i + 1}</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{opp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 4: First Mover Window — full width */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">First Mover Window</span>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-5">
            <p className="text-sm text-amber-800 leading-relaxed font-medium">{trend.firstMoverWindow}</p>
          </div>
          <div className="relative pt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-3">
              {["Research", "Western Creators", "India Search", "Indian Creators", "Mainstream"].map((label, i) => (
                <span key={i} className="text-center" style={{ width: "20%" }}>{label}</span>
              ))}
            </div>
            <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 via-primary to-red-400"
                style={{ width: ((trend.timelinePosition ?? 48) / 100 * 100) + "%" }}
              />
            </div>
            <div
              className="absolute top-6 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-md"
              style={{ left: "calc(" + ((trend.timelinePosition ?? 48) / 100 * 100) + "% - 8px)" }}
            />
            <p className="text-xs text-center text-primary font-bold mt-5">You are here</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
          <p className="font-semibold text-foreground mb-1">WellnessRadar India</p>
          <p>Data Sources: Google Trends &mdash; Reddit &mdash; YouTube &mdash; Instagram &mdash; PubMed &mdash; FSSAI</p>
          <p className="mt-1">All market estimates based on publicly available data. Verify regulatory info before product launch.</p>
        </div>

      </div>
    </Layout>
  );
};

export default TrendBrief;
