import { Layout } from "@/components/Layout";
import { Database, RefreshCw } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-black text-foreground mb-2">Why This Radar Exists</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed mb-12">
          <p>
            Most trend detection today is reactive, manual, and relies on gut feel. Founders see what's already popular and chase it — arriving too late to build meaningful market share.
          </p>
          <p>
            <strong className="text-foreground">WellnessRadar India was built to solve this.</strong> We scan 150+ wellness signals every month across 7 live data sources, filter using a 4-dimension scoring framework, and surface only the opportunities where consumer demand is rising faster than Indian market supply.
          </p>
          <p>
            The output isn't a data dump. It's an opportunity brief a founder can act on immediately — with live Google Trends data, real-time social signals from Reddit, YouTube and Instagram, competitor analysis, and regulatory status all in one place.
          </p>
        </div>

        {/* Data Sources */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Data Sources Used
          </h2>
          <div className="space-y-3">
            {[
              { name: "Google Trends India", detail: "Live search velocity data — 140+ keywords tracked in real time", live: true },
              { name: "Reddit India", detail: "Live posts from r/IndiaFitness, r/Ayurveda, r/bangalore and more — real consumer conversations", live: true },
              { name: "YouTube India", detail: "Indian creator count, view momentum and content type analysis", live: true },
              { name: "Instagram India", detail: "Hashtag tracking and Indian influencer signal detection", live: true },
              { name: "PubMed", detail: "Clinical study count and research backing verification", live: true },
              { name: "FSSAI Database", detail: "India regulatory compliance and permitted ingredient status", live: true },
              { name: "FDA USA", detail: "Global regulatory status — GRAS and supplement classification", live: true },
            ].map((src) => (
              <div key={src.name} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{src.name}</p>
                    {src.live && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{src.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scoring Accuracy */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" /> Scoring Accuracy
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Search trend scores are recalculated live on every query using real Google Trends India data. Social signals are AI-estimated based on trend velocity and market context. A trend's score can go up (if competition remains low and searches keep rising) or down (if major brands enter or trend approaches mainstream). This is a <strong className="text-foreground">dynamic system, not a static report.</strong>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default About;