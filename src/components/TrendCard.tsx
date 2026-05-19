import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { TrendData, getCategoryColor, getStatusColor } from "@/data/trends";
interface TrendCardProps {
  trend: TrendData;
  index: number;
}
const trendImages: Record<string, string> = {
  "creatine-for-women": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
  "red-light-therapy": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&auto=format&fit=crop&q=80",
  "cycle-syncing": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
  "nmn-supplement": "https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop&q=80",
  "pcos-natural-supplement": "https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&auto=format&fit=crop&q=80",
  "skin-cycling": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
  "postbiotic-supplement": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80",
  "lions-mane": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80",
};
const fallback = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&auto=format&fit=crop&q=80";
function getScoreColor(score: number) {
  if (score >= 80) return "#EF4444";
  if (score >= 60) return "#F97316";
  return "#F59E0B";
}
function ScoreRing({ score }: { score: number }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-white">
        {score}
      </div>
    </div>
  );
}
export const TrendCard = ({ trend, index }: TrendCardProps) => {
  const imgSrc = trendImages[trend.id] || fallback;
  const isSweet = trend.timeWindow.includes("6-9") || trend.timeWindow.includes("3-6");
  return (
    <div
      className="rounded-2xl overflow-hidden border border-border bg-card flex flex-col opacity-0 animate-fade-in group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40"
      style={{ animationDelay: index * 80 + "ms", animationFillMode: "forwards" }}
    >
      {/* IMAGE SECTION - takes up most of card */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imgSrc}
          alt={trend.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
        />
        {/* Strong dark gradient so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        {/* Rank - top left */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white/70 text-xs font-bold px-2 py-0.5 rounded-full border border-white/10">
          #{trend.rank}
        </div>
        {/* Status - top right */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${getStatusColor(trend.status)}`}>
          {trend.status}
        </span>
        {/* Name + category - bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-black text-base leading-tight mb-2 drop-shadow-lg">
            {trend.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(trend.category)}`}>
              {trend.category}
            </span>
            <ScoreRing score={trend.score} />
          </div>
        </div>
      </div>
      {/* MINIMAL BODY - only 2 data points + button */}
      <div className="p-4 flex flex-col gap-3">
        {/* Time to mainstream */}
        <div className="flex items-center justify-between gap-2">
          <div className={`flex items-center gap-1.5 text-sm ${isSweet ? "text-amber-500" : "text-muted-foreground"}`}>
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-medium">{trend.timeWindow.replace(" ?", "")} to mainstream</span>
          </div>
          {isSweet && (
            <span className="text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full px-2 py-0.5 whitespace-nowrap">
              Sweet spot
            </span>
          )}
        </div>
        {/* Market size - single clean line */}
        <div className="text-xs text-muted-foreground">
          Market opportunity: <span className="text-foreground font-semibold">{trend.marketSizeLabel}</span>
          <span className="ml-2 text-green-400 font-medium">{trend.competitionLandscape}</span>
        </div>
        {/* CTA */}
        <Link
          to={"/trend/" + trend.id}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/40 group/btn"
        >
          View Full Brief
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
} 