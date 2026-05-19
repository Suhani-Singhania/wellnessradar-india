import { Layout } from "@/components/Layout";
import { TrendingUp, Users, Clock, BarChart3, ArrowRight, Globe } from "lucide-react";

const dimensions = [
  {
    icon: TrendingUp,
    num: "①",
    title: "VELOCITY SCORE (/25)",
    subtitle: "Measures how fast interest is growing RIGHT NOW",
    items: [
      "Google Trends 12-month growth %",
      "YouTube view momentum",
      "Reddit discussion volume",
    ],
    scoring: "400%+ growth = 25pts | 250%+ = 20pts | 150%+ = 15pts",
  },
  {
    icon: BarChart3,
    num: "②",
    title: "MARKET SIZE POTENTIAL (/25)",
    subtitle: "Estimates total addressable market in India in ₹ Crores",
    items: [
      "Formula: Target Population × Annual Spend × Penetration Rate",
    ],
    scoring: "₹500Cr+ = 25pts | ₹200Cr+ = 20pts | ₹100Cr+ = 16pts | ₹50Cr+ = 12pts",
  },
  {
    icon: Users,
    num: "③",
    title: "COMPETITION INTENSITY (/25)",
    subtitle: "INVERSE score — less competition = higher opportunity",
    items: [
      "ZERO Indian brands = 25pts (full opportunity)",
      "1-2 weak players = 18-20pts",
      "3-4 moderate players = 10-15pts",
      "5+ entrenched brands = 2-5pts",
    ],
    scoring: "Starts at 25, deducts for each competitor and their strength",
  },
  {
    icon: Clock,
    num: "④",
    title: "TIME-TO-MAINSTREAM (/25)",
    subtitle: "Sweet spot is 6-9 months — enough time to build, urgent enough to act",
    items: [
      "6-9 months away = 25pts (SWEET SPOT ⚡)",
      "3-6 months away = 22pts",
      "9-12 months away = 20pts",
      "Already mainstream = 5pts",
    ],
    scoring: "Uses YouTube intent stage + US/UK status + India trajectory",
  },
];

const dataSources = [
  { name: "Google Trends India", purpose: "Search Velocity", detail: "Live data, 140+ keywords tracked" },
  { name: "Reddit India", purpose: "Social Proof", detail: "Live Reddit signals from Indian wellness communities" },
  { name: "YouTube India", purpose: "Consumer Intent", detail: "Creator count & view momentum" },
  { name: "Instagram India", purpose: "Influencer Signals", detail: "Hashtag & influencer tracking" },
  { name: "PubMed", purpose: "Research Backing", detail: "Clinical study count" },
  { name: "FSSAI Database", purpose: "Regulatory Status", detail: "India-specific compliance check" },
  { name: "FDA USA", purpose: "Global Regulatory", detail: "GRAS & approval status" },
];

const fadQuestions = [
  { q: "Does it have clinical/scientific backing?", desc: "PubMed papers found" },
  { q: "Is it already mainstream in US/UK for 2+ years?", desc: "India is typically 12-18 months behind" },
  { q: "Does it solve a real pain point?", desc: "vs aspirational trend" },
  { q: "Is there an India-specific consumer need?", desc: "Local relevance check" },
];

const trendFlow = [
  "US/UK Research",
  "Western Social Media",
  "Indian NRI Community",
  "Indian Urban Metro",
  "Indian Tier 2 Cities",
  "Mass Market",
];

const HowItWorks = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-3xl font-black text-foreground mb-2">How It Works</h1>
        <p className="text-muted-foreground mb-12">The complete methodology behind WellnessRadar's scoring system.</p>

        {/* Data Sources */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-2">The Scanning System</h2>
          <p className="text-sm text-muted-foreground mb-6">WellnessRadar scans live data across 7 sources to surface emerging wellness trends in India before they go mainstream.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dataSources.map((source) => (
              <div key={source.name} className="rounded-xl border border-border bg-card p-4 glow-card">
                <p className="font-bold text-sm text-foreground">{source.name}</p>
                <p className="text-xs text-primary mt-1">{source.purpose}</p>
                <p className="text-xs text-muted-foreground mt-1">{source.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scoring Framework */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6">The 4-Dimension Scoring Framework</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {dimensions.map((dim) => (
              <div key={dim.title} className="rounded-xl border border-border bg-card p-5 glow-card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg text-primary font-mono">{dim.num}</span>
                  <h3 className="font-bold text-foreground text-sm">{dim.title}</h3>
                </div>
                <p className="text-xs text-primary italic mb-3">{dim.subtitle}</p>
                <ul className="space-y-1.5 mb-3">
                  {dim.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-mono text-muted-foreground/70 border-t border-border pt-2">{dim.scoring}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fad Detector */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6">FAD vs REAL TREND Detector</h2>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-4">4 binary questions used to filter fads from real trends:</p>
            <div className="space-y-3">
              {fadQuestions.map((fq, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-background/50 border border-border p-3">
                  <span className="font-mono text-primary font-bold text-sm">{i + 1}.</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{fq.q}</p>
                    <p className="text-xs text-muted-foreground">{fq.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Trends Travel */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> How Trends Travel to India
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {trendFlow.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
                  {stage}
                </span>
                {i < trendFlow.length - 1 && <ArrowRight className="h-4 w-4 text-primary" />}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HowItWorks;
