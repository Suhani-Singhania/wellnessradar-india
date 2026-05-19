import { TrendData } from "@/data/trends";
import { ShieldAlert, TrendingDown, IndianRupee, Star } from "lucide-react";

interface CompetitorAnalysisProps {
  trend: TrendData;
}

export const CompetitorAnalysis = ({ trend }: CompetitorAnalysisProps) => {
  const { competitors, competitorBlindSpot } = trend;

  return (
    <div className="space-y-5">
      {/* Blind Spot */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex gap-3">
        <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-destructive mb-1">Market Blind Spot</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{competitorBlindSpot}</p>
        </div>
      </div>

      {/* Competitor cards */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-accent" />
          Current Players in Market
        </h4>
        <div className="space-y-3">
          {competitors.map((comp, i) => (
            <div key={i} className="rounded-xl border border-border bg-background overflow-hidden">
              <div className="flex">
                {/* Brand initials avatar instead of broken image */}
                <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 border-r border-border flex flex-col items-center justify-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-black text-primary">
                      {comp.brand.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${
                    comp.isIndian
                      ? "bg-green-500/10 text-green-600 border-green-500/30"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                  }`}>
                    {comp.isIndian ? "Indian" : "Import"}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-foreground">{comp.brand}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{comp.product}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-primary font-bold text-sm flex-shrink-0">
                      <IndianRupee className="h-3 w-3" />
                      <span>{comp.price.replace("₹", "").replace("Rs.", "").trim()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-muted-foreground">{comp.reviews} reviews</span>
                  </div>
                </div>
              </div>

              {/* Gap bar */}
              <div className="px-3 pb-3">
                <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/15 rounded-lg px-3 py-2">
                  <span className="text-destructive text-xs font-bold mt-0.5 flex-shrink-0">GAP</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">{comp.weakness}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YOUR EDGE */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Your Edge</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{trend.keyInsight}</p>
      </div>
    </div>
  );
};

