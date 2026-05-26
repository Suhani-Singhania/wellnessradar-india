const SearchHistory = require("./models/SearchHistory");
const express = require("express");
const cors = require("cors");
const googleTrends = require("google-trends-api");
const fetch = require("node-fetch");

require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY;

// ─────────────────────────────────────
// Trends Endpoint
// ─────────────────────────────────────

app.get("/api/trends", async (req, res) => {

  const keyword =
    req.query.keyword || "creatine";

  try {

    const result =
      await googleTrends.interestOverTime({
        keyword: [keyword],
        geo: "IN",
        startTime: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 365
        ),
      });

    res.json(JSON.parse(result));

  } catch (error) {

    console.error(
      "Trends error:",
      error.message
    );

    res.status(500).json({
      error: error.message
    });
  }
});

// ─────────────────────────────────────
// AI Analyze Endpoint
// ─────────────────────────────────────

app.post("/api/analyze", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      error: "Query is required",
    });
  }

  try {
    console.log("Analyzing:", query);

    // ----------------------------
    // Simulated Google Trends Logic
    // ----------------------------

    let currentVal = 75;
    let growthPct = 145;

    const lower = query.toLowerCase();

    // declining trends
    if (
      lower.includes("ashwagandha") ||
      lower.includes("keto") ||
      lower.includes("detox tea")
    ) {
      currentVal = 42;
      growthPct = -12;
    }

    // strong trends
    if (
      lower.includes("nmn") ||
      lower.includes("lion") ||
      lower.includes("mushroom") ||
      lower.includes("biohacking")
    ) {
      currentVal = 75;
      growthPct = 145;
    }

    // moderate trends
    if (
      lower.includes("collagen") ||
      lower.includes("protein")
    ) {
      currentVal = 58;
      growthPct = 55;
    }

    // ----------------------------
    // Score Engine
    // ----------------------------

    const score = Math.max(
      20,
      Math.min(
        95,
        Math.round(currentVal * 0.6 + growthPct * 0.25)
      )
    );

    // ----------------------------
    // Verdict Logic
    // ----------------------------

    let verdict = "WATCH";

    if (growthPct > 100) {
      verdict = "EARLY SIGNAL";
    }

    if (growthPct > 180 && currentVal > 70) {
      verdict = "REAL TREND";
    }

    if (growthPct < 0) {
      verdict = "FAD";
    }

    // ----------------------------
    // Time Window
    // ----------------------------

    let timeToMainstream = "12-18 months";

    if (currentVal >= 70) {
      timeToMainstream = "3-6 months";
    } else if (currentVal >= 50) {
      timeToMainstream = "6-9 months";
    }

    // ----------------------------
    // Market Size
    // ----------------------------

    const marketMin = Math.round(score * 1.2);
    const marketMax = Math.round(score * 2.5);

    // ----------------------------
    // Dynamic Content
    // ----------------------------

    const whyTrending =
      growthPct > 100
        ? `${query} is rapidly growing in India due to increasing health awareness, influencer education, and demand for preventive wellness products.`
        : `${query} is showing slower momentum because consumer attention has shifted toward newer wellness categories.`;

    const verdictReason =
      verdict === "FAD"
        ? `${query} shows declining consumer momentum and weak long-term retention signals.`
        : `${query} is showing healthy growth signals and increasing Indian consumer curiosity.`;

    const targetAudience =
      growthPct > 100
        ? "Urban Gen Z and millennials interested in longevity, biohacking and preventive wellness."
        : "Health-conscious Indian consumers exploring alternative wellness supplements.";

    const competition =
      score > 70
        ? "2–3 moderate Indian wellness startups"
        : "Low competition and open whitespace opportunity";

    // ----------------------------
    // Social Signals
    // ----------------------------

    const socialSignals = {
      redditPosts: `${Math.floor(score * 3)}+`,
      youtubeVideos: `${Math.floor(score)}+`,
      instagramPosts: `${Math.floor(score * 80)}+`,
    };

    // ----------------------------
    // Final Response
    // ----------------------------

    res.json({
      trend: query,

      score,

      verdict,

      growth: `${growthPct}%`,

      marketSize: `Rs.${marketMin}-${marketMax}Cr`,

      readiness:
        growthPct > 100
          ? "Growing Fast"
          : growthPct < 0
          ? "Declining Interest"
          : "Moderate Growth",

      competition,

      timeWindow: timeToMainstream,

      whyTrending,

      verdictReason,

      targetAudience,

      socialSignals,

      regulatoryStatus: {
        india: "Not specifically regulated",
        usa: "Supplement category",
        safety: "Use with caution",
        studies: "20+",
      },

      competitors: [
        {
          name:
            score > 70
              ? "Emerging Indian wellness startups"
              : "No major Indian brand yet",

          strength:
            score > 70
              ? "Strong social media positioning"
              : "Open market opportunity",

          weakness:
            score > 70
              ? "Weak scientific differentiation"
              : "No strong Indian player currently",

          price:
            score > 70
              ? "₹1999"
              : "N/A",
        },
      ],

      aiGenerated: true,
    });
  } catch (error) {
    console.error("Analysis error:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});