import { Activity } from "lucide-react";

const categories = [
  "Adaptogens", "Nootropics", "Gut Health", "Beauty Supplements",
  "Hair Health", "Women's Health", "Men's Health", "Recovery",
  "Functional Beverages", "Mental Wellness", "Longevity", "Ayurveda",
  "Problem Keywords", "Devices", "Metabolic Health", "Minerals & Vitamins",
  "Skincare", "Sleep & Stress",
];

export const LiveScanner = () => {
  return (
    <section className="py-12 border-y border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">System Currently Monitoring...</h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-success pulse-live" />
            <span className="text-success">LIVE</span>
          </span>
        </div>

        <div className="relative h-24 overflow-hidden rounded-lg border border-border bg-background/50">
          {/* Scan line */}
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan z-10" />

          {/* Scrolling categories */}
          <div className="animate-scroll-up py-2">
            {[...categories, ...categories].map((cat, i) => (
              <div
                key={`${cat}-${i}`}
                className="flex items-center gap-2 px-4 py-1.5 text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span className="font-mono text-xs text-muted-foreground">
                  SCANNING: <span className="text-foreground">{cat}</span>
                </span>
                <span className="ml-auto font-mono text-xs text-primary/60">
                  {Math.floor(Math.random() * 20 + 5)} signals found
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
