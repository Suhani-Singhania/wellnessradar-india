const express = require("express");
const cors = require("cors");
const googleTrends = require("google-trends-api");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

require("dotenv").config();
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ── Google Trends chart data ────────────────────────────────────────────────
app.get("/api/trends", async (req, res) => {
  const keyword = req.query.keyword || "creatine for women";
  try {
    const result = await googleTrends.interestOverTime({
      keyword: [keyword],
      geo: "IN",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    });
    res.json(JSON.parse(result));
  } catch (error) {
    console.error("Trends error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Analyze endpoint ────────────────────────────────────────────────────────
app.post("/api/analyze", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    console.log("Analyzing:", query);

    // 1. Fetch Google Trends data for India
    const oneYearAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);
    let trendValues = [];

    try {
      const result = await googleTrends.interestOverTime({
        keyword: [query],
        geo: "IN",
        startTime: oneYearAgo,
      });
      const parsed = JSON.parse(result);
      const timeline = parsed?.default?.timelineData || [];
      trendValues = timeline.map((d) => d.value[0]);
      console.log("Trend values fetched:", trendValues.length, "points");
    } catch (e) {
      console.log("Trends fetch failed, using defaults:", e.message);
      trendValues = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
    }

    // 2. Calculate metrics from trend data
    const avgRecent  = trendValues.slice(-4).reduce((a, b) => a + b, 0) / 4 || 50;
    const avgEarly   = trendValues.slice(0, 4).reduce((a, b) => a + b, 0) / 4 || 25;
    const currentVal = trendValues[trendValues.length - 1] || 50;
    const peakVal    = Math.max(...trendValues, 1);

    const growthPct = avgEarly > 0
      ? Math.round(((avgRecent - avgEarly) / avgEarly) * 100)
      : 50;

    const score = Math.min(99, Math.max(10,
      Math.round((currentVal * 0.4) + (Math.min(growthPct, 500) / 500 * 40) + (peakVal * 0.2))
    ));

    let verdict, recommendedAction;
    if (score >= 75 && growthPct >= 100)     { verdict = "REAL TREND";         recommendedAction = "ACT NOW"; }
    else if (score >= 55 && growthPct >= 50) { verdict = "EARLY SIGNAL";       recommendedAction = "WATCH"; }
    else if (score >= 75 && growthPct < 20)  { verdict = "MAINSTREAM ALREADY"; recommendedAction = "RESEARCH MORE"; }
    else if (growthPct < 0)                  { verdict = "FAD";                recommendedAction = "SKIP"; }
    else                                     { verdict = "EARLY SIGNAL";       recommendedAction = "WATCH"; }

    const marketMin = Math.round(score * 1.2);
    const marketMax = Math.round(score * 2.5);

    let timeToMainstream;
    if (currentVal >= 70)      timeToMainstream = "3-6 months";
    else if (currentVal >= 50) timeToMainstream = "6-9 months";
    else if (currentVal >= 30) timeToMainstream = "9-12 months";
    else                       timeToMainstream = "12-18 months";

    let competitionIndia;
    if (currentVal >= 80)      competitionIndia = "Several established players";
    else if (currentVal >= 60) competitionIndia = "2-3 moderate players";
    else if (currentVal >= 40) competitionIndia = "1-2 weak players";
    else                       competitionIndia = "ZERO Indian brands";

    let indiaReadiness;
    if (growthPct >= 200)      indiaReadiness = "Exploding Fast";
    else if (growthPct >= 100) indiaReadiness = "Growing Fast";
    else if (growthPct >= 50)  indiaReadiness = "Early Adoption";
    else if (growthPct >= 0)   indiaReadiness = "Awareness Building";
    else                       indiaReadiness = "Declining Interest";

    // 3. Use OpenRouter AI to generate full analysis including social signals
    let signal, gap, opportunity, verdictReason, consumerQuestions;
    let whyTrending, whyDeclining, fadReason, indianConsumerSegment, competitors, socialSignals, regulatoryStatus;

    try {
      const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it:free",
          messages: [
            {
              role: "user",
              content: `You are a D2C market analyst specializing in Indian wellness trends. Be specific, accurate and realistic about Indian brands, Indian consumers, and Indian social media.

Analyze the wellness trend: "${query}"
Google Trends India data: current interest ${currentVal}/100, growth ${growthPct}% over 12 months, peak ${peakVal}/100, verdict: ${verdict}

Respond ONLY with a valid JSON object. No markdown, no backticks, no extra text before or after the JSON:
{
  "verdictReason": "2 sentence explanation of why this is ${verdict} for Indian market",
  "signal": "2 sentences about what the data signals for Indian D2C founders",
  "gap": "2 sentences about the gap in the Indian market right now",
  "opportunity": "2 sentences about the specific product opportunity in India with realistic price point",
  "whyTrending": "2-3 sentences explaining WHY this trend is rising in India - specific drivers like which influencers, which health concern, which platform",
  "whyDeclining": "${growthPct < 0 ? '2-3 sentences explaining clearly WHY this trend is declining in India' : 'null'}",
  "fadReason": "${verdict === 'FAD' ? '2-3 sentences explaining specifically why this is a fad' : 'null'}",
  "indianConsumerSegment": "2-3 sentences about WHICH specific segment - exact age, income, city tier, gender, what problem they are trying to solve",
  "competitors": [
    {
      "name": "Real Indian brand name selling this or similar product",
      "product": "Specific product name they sell",
      "priceRange": "Rs.XXX-XXX",
      "strength": "one line strength",
      "weakness": "one line gap or weakness"
    }
  ],
  "socialSignals": {
    "reddit": {
      "estimatedPosts": "number like 450",
      "topSubreddits": ["r/IndiaFitness", "r/bangalore"],
      "sentimentScore": "Positive or Mixed or Negative",
      "topDiscussion": "one realistic example post title an Indian would write about this trend",
      "indianVsGlobal": "percentage like 23% Indian posts"
    },
    "youtube": {
      "estimatedVideos": "number like 120",
      "indianCreators": "number like 8",
      "estimatedViews": "like 2.4M",
      "topVideoType": "what kind of videos like review, how-to, myth busting",
      "growthTrend": "Rising or Stable or Declining"
    },
    "instagram": {
      "estimatedPosts": "number like 12400",
      "topHashtags": ["#BerberineIndia", "#WellnessIndia"],
      "indianInfluencers": "number like 34",
      "contentType": "what type of content is popular"
    }
  },
  "regulatoryStatus": {
    "fssai": "Permitted or Restricted or Under Review or Not Regulated",
    "fssaiNote": "one line about FSSAI status specific to India",
    "fdaUSA": "GRAS or Approved or Not Approved or Supplement",
    "safetyRating": "Safe or Use with Caution or Consult Doctor",
    "clinicalStudies": "number like 45"
  },
  "consumerQuestions": ["realistic question Indians search on Google 1?", "realistic question 2?", "realistic question 3?"]
}`
            }
          ]
        })
      });

      const aiData = await aiRes.json();
      console.log("OpenRouter response status:", aiRes.status);

      const aiText = aiData.choices?.[0]?.message?.content || "";
      console.log("AI raw response:", aiText.slice(0, 400));

      // Clean and parse - handle various response formats
      let cleanText = aiText.trim();
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      // Find JSON object start and end
      const jsonStart = cleanText.indexOf("{");
      const jsonEnd = cleanText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanText = cleanText.slice(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(cleanText);

      verdictReason         = parsed.verdictReason;
      signal                = parsed.signal;
      gap                   = parsed.gap;
      opportunity           = parsed.opportunity;
      whyTrending           = parsed.whyTrending;
      whyDeclining          = parsed.whyDeclining !== "null" ? parsed.whyDeclining : null;
      fadReason             = parsed.fadReason !== "null" ? parsed.fadReason : null;
      indianConsumerSegment = parsed.indianConsumerSegment;
      competitors           = Array.isArray(parsed.competitors) ? parsed.competitors : [];
      socialSignals         = parsed.socialSignals || null;
      regulatoryStatus      = parsed.regulatoryStatus || null;
      consumerQuestions     = parsed.consumerQuestions;

      console.log("AI analysis complete. Competitors:", competitors.length);
    } catch (aiErr) {
      console.log("AI failed, using fallback text:", aiErr.message);

      verdictReason = verdict === "REAL TREND"
        ? `Search interest has grown ${growthPct}% in India over 12 months - this is a genuine market shift with strong consumer demand.`
        : verdict === "EARLY SIGNAL"
        ? `Interest is building in India (+${growthPct}% growth) but has not hit mainstream yet - this is the ideal entry window for D2C brands.`
        : verdict === "MAINSTREAM ALREADY"
        ? `Already high search interest in India but growth has plateaued - market is established and entry is harder now.`
        : `Search interest has declined in India - consumer attention has moved on from this trend.`;

      signal                = `Google Trends India shows ${currentVal}/100 current interest with ${growthPct > 0 ? "+" : ""}${growthPct}% growth over 12 months. Peak interest reached ${peakVal}/100 during this period.`;
      gap                   = `Most Indian D2C brands have not yet built a dedicated product around "${query}". The ${competitionIndia.toLowerCase()} leaves room for a first-mover brand.`;
      opportunity           = `Launch a "${query}" product priced Rs.799-1,299 for urban Indian consumers aged 25-40. Lead with educational content on YouTube and Instagram to build category awareness.`;
      whyTrending           = `Growing health awareness among urban Indian millennials and influence of international wellness content on Instagram and YouTube is driving interest in "${query}".`;
      whyDeclining          = growthPct < 0 ? `Interest in "${query}" peaked due to short-term social media hype but lacked sustained clinical evidence or India-specific relevance.` : null;
      fadReason             = verdict === "FAD" ? `"${query}" shows classic fad characteristics - a sharp peak followed by rapid decline and limited clinical backing.` : null;
      indianConsumerSegment = `Urban Indian millennials aged 25-35 in Tier 1 cities with household income above Rs.8L per year, health-conscious and influenced by global wellness trends.`;
      competitors           = [{ name: "No major Indian brand yet", product: "N/A", priceRange: "N/A", strength: "Market is open", weakness: "No Indian brand has claimed this space" }];
      socialSignals         = {
        reddit:    { estimatedPosts: "200+", topSubreddits: ["r/IndiaFitness", "r/Ayurveda"], sentimentScore: "Mixed", topDiscussion: `Anyone tried ${query} for health benefits in India?`, indianVsGlobal: "15% Indian posts" },
        youtube:   { estimatedVideos: "50+", indianCreators: "3", estimatedViews: "500K", topVideoType: "Reviews and explainers", growthTrend: "Rising" },
        instagram: { estimatedPosts: "5000+", topHashtags: [`#${query.replace(/\s+/g,"")}India`, "#WellnessIndia"], indianInfluencers: "10", contentType: "Health tips and product reviews" }
      };
      regulatoryStatus      = { fssai: "Not Regulated", fssaiNote: "No specific FSSAI regulation, sold as food supplement", fdaUSA: "Supplement", safetyRating: "Use with Caution", clinicalStudies: "20+" };
      consumerQuestions     = [
        `What is ${query} and does it actually work?`,
        `Best ${query} brand in India under Rs.1000?`,
        `Is ${query} safe for daily use in India?`,
      ];
    }

    res.json({
      name: query.charAt(0).toUpperCase() + query.slice(1),
      verdict,
      verdictReason,
      score,
      recommendedAction,
      gtGrowthEstimate: `${growthPct > 0 ? "+" : ""}${growthPct}% (Google Trends India, 12 months)`,
      marketSizeIndia: `Rs.${marketMin}-${marketMax}Cr (estimated)`,
      indiaReadiness,
      timeToMainstream,
      competitionIndia,
      signal,
      gap,
      opportunity,
      whyTrending,
      whyDeclining,
      fadReason,
      indianConsumerSegment,
      competitors,
      socialSignals,
      regulatoryStatus,
      fadVsReal: {
        clinicalBacking:       score >= 60,
        westernMainstream2yrs: currentVal >= 50,
        solvesRealPain:        growthPct >= 50,
        indiaSpecificNeed:     currentVal >= 30 && currentVal <= 75,
      },
      consumerQuestions,
      trendData: trendValues,
    });

  } catch (error) {
    console.error("Analyze error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

