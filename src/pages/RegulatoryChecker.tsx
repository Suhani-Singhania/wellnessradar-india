import { useState } from "react";
import { Layout } from "@/components/Layout";
import { regulatoryDatabase, getRiskColor } from "@/data/regulatory";
import { Search, AlertTriangle, Shield, Loader2, Sparkles } from "lucide-react";

interface AIRegulatoryResult {
  ingredient: string;
  riskLevel: "Low" | "Medium" | "High";
  fssai: string;
  fssaiNote: string;
  fda: string;
  efsa: string;
  maxDosage: string;
  labellingRequirement: string;
  warningsRequired: string;
  notes: string;
  clinicalStudies: string;
  safetyRating: string;
}

const RegulatoryChecker = () => {
  const [search, setSearch] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState<AIRegulatoryResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [mode, setMode] = useState<"static" | "ai">("static");

  const filtered = regulatoryDatabase.filter((item) =>
    item.ingredient.toLowerCase().includes(search.toLowerCase())
  );

  const handleAiSearch = async () => {
    const q = aiQuery.trim();
    if (!q) return;
    setAiLoading(true);
    setAiResult(null);
    setAiError("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_API_KEY"
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it:free",
          messages: [{
            role: "user",
            content: `You are a regulatory expert specializing in India's FSSAI, US FDA, and European EFSA food supplement regulations.

Provide the regulatory status for the wellness ingredient: "${q}"

Respond ONLY with a valid JSON object, no markdown, no backticks, no extra text:
{
  "ingredient": "${q}",
  "riskLevel": "Low or Medium or High",
  "fssai": "one line FSSAI India status",
  "fssaiNote": "one line additional FSSAI detail",
  "fda": "one line FDA USA status",
  "efsa": "one line EFSA Europe status",
  "maxDosage": "recommended max dosage",
  "labellingRequirement": "what must be on the label in India",
  "warningsRequired": "any warnings required on label",
  "clinicalStudies": "approximate number of PubMed studies",
  "safetyRating": "Safe or Use with Caution or Consult Doctor",
  "notes": "2-3 sentences about key regulatory considerations for Indian D2C brands selling this ingredient"
}`
          }]
        })
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      const cleanText = text.replace(/```json|```/g, "").trim();
      const jsonStart = cleanText.indexOf("{");
      const jsonEnd = cleanText.lastIndexOf("}");
      const parsed = JSON.parse(cleanText.slice(jsonStart, jsonEnd + 1));
      setAiResult(parsed);
    } catch (err) {
      setAiError("Could not fetch regulatory data. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    if (level === "High") return "bg-red-50 border-red-200 text-red-700";
    if (level === "Medium") return "bg-amber-50 border-amber-200 text-amber-700";
    return "bg-green-50 border-green-200 text-green-700";
  };

  const getRiskEmoji = (level: string) => {
    if (level === "High") return "🔴";
    if (level === "Medium") return "🟡";
    return "🟢";
  };

  const getSafetyColor = (rating: string) => {
    if (rating === "Safe") return "text-green-600 bg-green-50 border-green-200";
    if (rating === "Consult Doctor") return "text-red-600 bg-red-50 border-red-200";
    return "text-amber-600 bg-amber-50 border-amber-200";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-3xl font-black text-foreground mb-2">
          <Shield className="inline h-8 w-8 text-primary mr-2" />
          Ingredient & Regulatory Safety Checker
        </h1>
        <p className="text-muted-foreground mb-6">
          Before you build — know if your ingredient is legal, approved, and safe to sell in India.
        </p>

        {/* Red Alert Banner */}
        <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            <strong>⚠️ Always verify with FSSAI directly before launching.</strong> This tool is for research purposes only.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("static")}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${mode === "static" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}
          >
            📋 Common Ingredients
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-1.5 ${mode === "ai" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Check Any Ingredient
          </button>
        </div>

        {/* AI Mode */}
        {mode === "ai" && (
          <div className="mb-8">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-4">
              <p className="text-sm text-primary font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI-powered — check FSSAI, FDA & EFSA status for any wellness ingredient instantly
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Type any ingredient e.g. Tongkat Ali, Berberine, NMN, Sea Moss..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                  className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={handleAiSearch}
                disabled={!aiQuery.trim() || aiLoading}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity whitespace-nowrap flex items-center gap-2"
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {aiLoading ? "Checking..." : "Check Now"}
              </button>
            </div>

            {/* AI Loading */}
            {aiLoading && (
              <div className="mt-4 rounded-xl border border-border bg-card p-6 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Checking FSSAI, FDA and EFSA databases for <strong className="text-foreground">"{aiQuery}"</strong>...</span>
              </div>
            )}

            {/* AI Error */}
            {aiError && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{aiError}</span>
              </div>
            )}

            {/* AI Result */}
            {aiResult && !aiLoading && (
              <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{aiResult.ingredient}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getSafetyColor(aiResult.safetyRating)}`}>
                        {aiResult.safetyRating}
                      </span>
                      <span className="text-xs text-muted-foreground">{aiResult.clinicalStudies} PubMed studies</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getRiskBadge(aiResult.riskLevel)}`}>
                      {getRiskEmoji(aiResult.riskLevel)} {aiResult.riskLevel} Risk
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> AI
                    </span>
                  </div>
                </div>

                {/* High risk alert */}
                {aiResult.riskLevel === "High" && (
                  <div className="border-b border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-destructive">
                      🚨 REGULATORY ALERT: This ingredient has restrictions in India — verify FSSAI compliance before launching
                    </p>
                  </div>
                )}

                {/* Status Grid */}
                <div className="grid gap-px sm:grid-cols-3 bg-border">
                  <div className="bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">FSSAI (India)</p>
                    <p className="text-sm text-foreground font-medium">{aiResult.fssai}</p>
                    {aiResult.fssaiNote && <p className="text-xs text-muted-foreground mt-1">{aiResult.fssaiNote}</p>}
                  </div>
                  <div className="bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">FDA (USA)</p>
                    <p className="text-sm text-foreground">{aiResult.fda}</p>
                  </div>
                  <div className="bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">EFSA (Europe)</p>
                    <p className="text-sm text-foreground">{aiResult.efsa}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Max Dosage</p>
                    <p className="text-sm text-foreground">{aiResult.maxDosage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Labelling Requirement</p>
                    <p className="text-sm text-foreground">{aiResult.labellingRequirement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Warnings Required</p>
                    <p className="text-sm text-foreground">{aiResult.warningsRequired}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Notes for Indian D2C Brands</p>
                    <p className="text-sm text-muted-foreground">{aiResult.notes}</p>
                  </div>
                </div>

                <div className="px-5 pb-4">
                  <p className="text-xs text-muted-foreground italic">AI-generated based on known regulatory data. Always verify with FSSAI directly before product launch.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Static Mode */}
        {mode === "static" && (
          <>
            <div className="relative max-w-md mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ingredients (e.g., Ashwagandha, NMN, Creatine)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-6">
              {filtered.map((item) => (
                <div key={item.ingredient} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground">{item.ingredient}</h3>
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getRiskColor(item.riskLevel)}`}>
                      {getRiskEmoji(item.riskLevel)} {item.riskLevel} Risk
                    </span>
                  </div>

                  {item.riskLevel === "High" && (
                    <div className="border-b border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-destructive">🚨 REGULATORY ALERT: This ingredient has restrictions in India — verify FSSAI compliance before launching</p>
                        <p className="text-xs text-destructive/80 mt-1">{item.warningsRequired}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-px sm:grid-cols-3 bg-border">
                    <div className="bg-card p-4">
                      <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">FSSAI (India)</p>
                      <p className="text-sm text-foreground">{item.fssai}</p>
                    </div>
                    <div className="bg-card p-4">
                      <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">FDA (USA)</p>
                      <p className="text-sm text-foreground">{item.fda}</p>
                    </div>
                    <div className="bg-card p-4">
                      <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">EFSA (Europe)</p>
                      <p className="text-sm text-foreground">{item.efsa}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Max Dosage</p>
                      <p className="text-sm text-foreground">{item.maxDosage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Labelling Requirement</p>
                      <p className="text-sm text-foreground">{item.labellingRequirement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Warnings Required</p>
                      <p className="text-sm text-foreground">{item.warningsRequired}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Notes</p>
                      <p className="text-sm text-muted-foreground">{item.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No ingredients found matching "{search}".</p>
                  <button
                    onClick={() => { setMode("ai"); setAiQuery(search); }}
                    className="mt-3 text-sm text-primary font-semibold hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Try Check for "{search}" instead →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default RegulatoryChecker;
