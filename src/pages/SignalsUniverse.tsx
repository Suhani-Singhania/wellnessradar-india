// src/pages/SignalsUniverse.tsx

import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import {
  TrendingUp, TrendingDown, Search, X,
  Activity, Layers, Database, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar
} from "recharts";

interface Keyword {
  name: string;
  growth: string;
  growthNum: number;
  volume: "High" | "Medium" | "Low";
  category: string;
  sources: { google: number; reddit: number; youtube: number; amazon: number };
  sparkline: number[];
  signal: string;
  timelineStage: "Emerging" | "Growing" | "Peak" | "Mainstream";
}

const ALL_KEYWORDS: Keyword[] = [
  // ── Adaptogens ──────────────────────────────────────────────────────────────
  { name: "Ashwagandha gummies", growth: "+320%", growthNum: 320, volume: "High", category: "Adaptogens", sources: { google: 88, reddit: 72, youtube: 65, amazon: 80 }, sparkline: [20,28,35,42,55,60,68,75,80,85,88,92], signal: "Gummy format driving mainstream adoption beyond traditional powder users.", timelineStage: "Growing" },
  { name: "Ashwagandha KSM-66", growth: "+280%", growthNum: 280, volume: "High", category: "Adaptogens", sources: { google: 82, reddit: 68, youtube: 58, amazon: 75 }, sparkline: [15,22,30,38,48,55,62,68,74,78,82,85], signal: "Premium standardised extract gaining traction among health-conscious buyers.", timelineStage: "Growing" },
  { name: "Rhodiola supplement India", growth: "+180%", growthNum: 180, volume: "Medium", category: "Adaptogens", sources: { google: 55, reddit: 48, youtube: 35, amazon: 42 }, sparkline: [10,14,18,22,28,32,38,42,48,52,55,58], signal: "Stress and fatigue narrative resonating with urban professionals.", timelineStage: "Emerging" },
  { name: "Adaptogen latte", growth: "+145%", growthNum: 145, volume: "Low", category: "Adaptogens", sources: { google: 42, reddit: 38, youtube: 45, amazon: 28 }, sparkline: [8,11,14,18,22,26,30,34,38,40,42,44], signal: "Beverage format creating new entry point beyond supplements.", timelineStage: "Emerging" },
  { name: "Adaptogen supplement India", growth: "+210%", growthNum: 210, volume: "Medium", category: "Adaptogens", sources: { google: 65, reddit: 52, youtube: 48, amazon: 58 }, sparkline: [12,18,24,30,38,44,50,56,60,63,65,68], signal: "Category term growing as consumers research beyond ashwagandha.", timelineStage: "Growing" },
  { name: "Holy basil supplement", growth: "+120%", growthNum: 120, volume: "Medium", category: "Adaptogens", sources: { google: 48, reddit: 35, youtube: 28, amazon: 52 }, sparkline: [18,20,24,28,32,35,38,40,44,46,48,50], signal: "Tulsi repositioned as modern adaptogen driving premium pricing.", timelineStage: "Emerging" },
  { name: "Shatavari supplement", growth: "+190%", growthNum: 190, volume: "Medium", category: "Adaptogens", sources: { google: 60, reddit: 45, youtube: 38, amazon: 65 }, sparkline: [14,18,22,28,34,40,46,50,55,58,60,63], signal: "Women's hormonal health narrative gaining momentum in urban India.", timelineStage: "Growing" },
  { name: "Reishi mushroom India", growth: "+240%", growthNum: 240, volume: "Low", category: "Adaptogens", sources: { google: 52, reddit: 48, youtube: 42, amazon: 35 }, sparkline: [6,10,14,20,26,32,38,44,48,50,52,55], signal: "Immunity and sleep dual-benefit positioning resonating post-pandemic.", timelineStage: "Growing" },
  { name: "Cordyceps supplement India", growth: "+260%", growthNum: 260, volume: "Low", category: "Adaptogens", sources: { google: 58, reddit: 55, youtube: 62, amazon: 38 }, sparkline: [5,8,12,18,24,32,38,44,50,54,58,62], signal: "Athletic performance narrative driving gym-goer interest.", timelineStage: "Growing" },
  { name: "Stress relief supplement natural", growth: "+175%", growthNum: 175, volume: "High", category: "Adaptogens", sources: { google: 72, reddit: 65, youtube: 55, amazon: 78 }, sparkline: [22,26,30,36,42,48,54,58,62,66,70,74], signal: "Broad consumer intent — easiest category entry point.", timelineStage: "Growing" },
  { name: "Maca root supplement India", growth: "+155%", growthNum: 155, volume: "Medium", category: "Adaptogens", sources: { google: 50, reddit: 42, youtube: 38, amazon: 48 }, sparkline: [10,13,17,21,26,30,35,38,42,45,48,52], signal: "Hormonal balance and energy narrative resonating with urban women.", timelineStage: "Emerging" },
  { name: "Tongkat Ali India", growth: "+145%", growthNum: 145, volume: "Medium", category: "Adaptogens", sources: { google: 48, reddit: 55, youtube: 52, amazon: 32 }, sparkline: [6,9,13,18,23,28,32,36,40,43,46,50], signal: "Men's health and testosterone narrative gaining Reddit traction.", timelineStage: "Emerging" },
  { name: "Eleuthero supplement", growth: "+110%", growthNum: 110, volume: "Low", category: "Adaptogens", sources: { google: 35, reddit: 30, youtube: 25, amazon: 28 }, sparkline: [8,10,13,16,20,22,25,28,30,32,34,36], signal: "Siberian ginseng alternative gaining early adopter interest.", timelineStage: "Emerging" },

  // ── Nootropics ───────────────────────────────────────────────────────────────
  { name: "Lion's Mane mushroom supplement", growth: "+340%", growthNum: 340, volume: "Medium", category: "Nootropics", sources: { google: 78, reddit: 82, youtube: 88, amazon: 52 }, sparkline: [8,12,18,26,34,44,54,62,68,74,78,82], signal: "YouTube driving explosive awareness — zero Indian brand exists.", timelineStage: "Growing" },
  { name: "Nootropic supplement India", growth: "+280%", growthNum: 280, volume: "Medium", category: "Nootropics", sources: { google: 68, reddit: 72, youtube: 65, amazon: 48 }, sparkline: [10,15,22,30,38,46,52,58,62,66,68,72], signal: "Category search growing as biohacker culture enters India.", timelineStage: "Growing" },
  { name: "Brain supplement India", growth: "+220%", growthNum: 220, volume: "High", category: "Nootropics", sources: { google: 74, reddit: 62, youtube: 58, amazon: 72 }, sparkline: [18,24,30,36,44,50,56,60,64,68,72,76], signal: "Exam and work performance narrative has mass appeal.", timelineStage: "Growing" },
  { name: "Focus supplement natural", growth: "+190%", growthNum: 190, volume: "Medium", category: "Nootropics", sources: { google: 62, reddit: 55, youtube: 52, amazon: 65 }, sparkline: [14,18,24,30,36,42,48,52,56,58,62,65], signal: "Study and productivity positioning resonating with students.", timelineStage: "Growing" },
  { name: "Alpha GPC India", growth: "+310%", growthNum: 310, volume: "Low", category: "Nootropics", sources: { google: 52, reddit: 68, youtube: 58, amazon: 32 }, sparkline: [5,8,12,18,26,34,42,46,50,50,52,55], signal: "Early adopter demand — premium biohacker segment only.", timelineStage: "Emerging" },
  { name: "Bacopa monnieri supplement", growth: "+165%", growthNum: 165, volume: "Medium", category: "Nootropics", sources: { google: 55, reddit: 48, youtube: 42, amazon: 60 }, sparkline: [12,15,19,23,28,32,37,41,45,48,52,55], signal: "Ancient Ayurvedic herb being repositioned as modern nootropic.", timelineStage: "Emerging" },
  { name: "Phosphatidylserine India", growth: "+200%", growthNum: 200, volume: "Low", category: "Nootropics", sources: { google: 42, reddit: 52, youtube: 45, amazon: 30 }, sparkline: [5,7,10,14,19,24,29,33,37,39,41,44], signal: "Memory and cognitive decline prevention narrative gaining traction.", timelineStage: "Emerging" },
  { name: "Racetam supplement India", growth: "+140%", growthNum: 140, volume: "Low", category: "Nootropics", sources: { google: 35, reddit: 58, youtube: 35, amazon: 20 }, sparkline: [5,7,9,12,16,19,22,25,27,29,32,35], signal: "Reddit biohacker community driving awareness — niche but vocal.", timelineStage: "Emerging" },
  { name: "Cognitive enhancement India", growth: "+230%", growthNum: 230, volume: "High", category: "Nootropics", sources: { google: 70, reddit: 65, youtube: 62, amazon: 68 }, sparkline: [14,19,25,32,40,47,53,58,62,65,68,72], signal: "Broad category term — high student and professional demand.", timelineStage: "Growing" },
  { name: "Memory supplement India", growth: "+210%", growthNum: 210, volume: "High", category: "Nootropics", sources: { google: 75, reddit: 60, youtube: 55, amazon: 72 }, sparkline: [18,23,29,35,42,48,53,57,61,65,68,72], signal: "Older demographic also entering — huge addressable market.", timelineStage: "Growing" },

  // ── Gut Health ───────────────────────────────────────────────────────────────
  { name: "Postbiotic supplement", growth: "+380%", growthNum: 380, volume: "Medium", category: "Gut Health", sources: { google: 72, reddit: 65, youtube: 58, amazon: 48 }, sparkline: [5,8,13,20,30,40,50,58,64,68,72,76], signal: "Next evolution beyond probiotics — first mover advantage available.", timelineStage: "Emerging" },
  { name: "Gut health supplement India", growth: "+290%", growthNum: 290, volume: "High", category: "Gut Health", sources: { google: 82, reddit: 72, youtube: 65, amazon: 78 }, sparkline: [18,24,32,40,50,58,64,70,74,78,80,84], signal: "Mainstream category with high consumer intent.", timelineStage: "Growing" },
  { name: "Digestive enzyme India", growth: "+210%", growthNum: 210, volume: "High", category: "Gut Health", sources: { google: 78, reddit: 58, youtube: 48, amazon: 85 }, sparkline: [22,28,34,42,50,56,62,66,70,74,76,80], signal: "High repeat purchase — Amazon reviews showing strong demand.", timelineStage: "Growing" },
  { name: "Leaky gut supplement", growth: "+260%", growthNum: 260, volume: "Medium", category: "Gut Health", sources: { google: 58, reddit: 75, youtube: 62, amazon: 45 }, sparkline: [8,12,18,26,34,42,48,52,56,58,60,64], signal: "Reddit driving education — pain point is well-articulated.", timelineStage: "Growing" },
  { name: "Probiotic gummies India", growth: "+320%", growthNum: 320, volume: "High", category: "Gut Health", sources: { google: 85, reddit: 62, youtube: 55, amazon: 88 }, sparkline: [12,18,26,34,44,54,62,70,76,80,84,88], signal: "Format innovation — gummy probiotic underserved in India.", timelineStage: "Growing" },
  { name: "Gut microbiome supplement", growth: "+250%", growthNum: 250, volume: "Medium", category: "Gut Health", sources: { google: 60, reddit: 68, youtube: 55, amazon: 50 }, sparkline: [8,12,17,24,32,40,46,51,55,58,60,64], signal: "Science-backed narrative gaining traction among urban educated consumers.", timelineStage: "Growing" },
  { name: "Akkermansia supplement India", growth: "+340%", growthNum: 340, volume: "Low", category: "Gut Health", sources: { google: 45, reddit: 62, youtube: 52, amazon: 30 }, sparkline: [3,5,8,13,20,28,36,42,46,48,50,54], signal: "Next gen probiotic strain — early adopter segment showing strong interest.", timelineStage: "Emerging" },
  { name: "Fiber supplement India", growth: "+180%", growthNum: 180, volume: "High", category: "Gut Health", sources: { google: 72, reddit: 55, youtube: 45, amazon: 80 }, sparkline: [20,24,28,34,40,46,50,54,58,61,64,68], signal: "Urban diet deficiency narrative — high repeat purchase potential.", timelineStage: "Growing" },
  { name: "Butyrate supplement", growth: "+290%", growthNum: 290, volume: "Low", category: "Gut Health", sources: { google: 48, reddit: 65, youtube: 55, amazon: 35 }, sparkline: [4,6,10,16,23,31,38,43,47,49,51,55], signal: "Gut lining repair narrative — strong Reddit community interest.", timelineStage: "Emerging" },
  { name: "Psyllium husk supplement India", growth: "+140%", growthNum: 140, volume: "High", category: "Gut Health", sources: { google: 75, reddit: 50, youtube: 40, amazon: 82 }, sparkline: [28,32,36,40,44,48,52,55,58,61,63,66], signal: "Mainstream but growing premium segment — opportunity in gummy format.", timelineStage: "Mainstream" },

  // ── Women's Health ───────────────────────────────────────────────────────────
  { name: "PCOS natural supplement", growth: "+350%", growthNum: 350, volume: "High", category: "Women's Health", sources: { google: 88, reddit: 82, youtube: 78, amazon: 72 }, sparkline: [12,18,26,36,46,56,64,72,78,82,86,90], signal: "Massive underserved market — PCOS affects 1 in 5 Indian women.", timelineStage: "Growing" },
  { name: "Cycle syncing supplements", growth: "+280%", growthNum: 280, volume: "Medium", category: "Women's Health", sources: { google: 68, reddit: 78, youtube: 85, amazon: 45 }, sparkline: [6,10,16,24,32,42,50,58,64,68,70,74], signal: "YouTube education driving awareness — early market stage.", timelineStage: "Emerging" },
  { name: "Inositol India", growth: "+420%", growthNum: 420, volume: "Medium", category: "Women's Health", sources: { google: 72, reddit: 85, youtube: 68, amazon: 55 }, sparkline: [4,7,12,20,30,42,52,60,66,70,72,76], signal: "Reddit communities driving demand — clinical backing strong.", timelineStage: "Emerging" },
  { name: "Women's hormone supplement", growth: "+245%", growthNum: 245, volume: "High", category: "Women's Health", sources: { google: 78, reddit: 68, youtube: 62, amazon: 75 }, sparkline: [15,20,28,36,44,52,58,64,68,72,76,80], signal: "Broad category with high search intent across age groups.", timelineStage: "Growing" },
  { name: "Creatine for women India", growth: "+410%", growthNum: 410, volume: "High", category: "Women's Health", sources: { google: 92, reddit: 78, youtube: 88, amazon: 65 }, sparkline: [8,14,22,32,44,56,66,74,80,86,90,94], signal: "4.5M YouTube views — ZERO Indian women-specific brand exists.", timelineStage: "Emerging" },
  { name: "Menopause supplement India", growth: "+230%", growthNum: 230, volume: "Medium", category: "Women's Health", sources: { google: 62, reddit: 58, youtube: 52, amazon: 65 }, sparkline: [12,16,21,27,33,40,46,51,55,58,60,64], signal: "Underserved 40+ women segment — huge gap in Indian market.", timelineStage: "Growing" },
  { name: "Prenatal supplement India", growth: "+160%", growthNum: 160, volume: "High", category: "Women's Health", sources: { google: 80, reddit: 60, youtube: 55, amazon: 85 }, sparkline: [28,32,36,40,44,48,52,55,58,61,64,68], signal: "High-intent repeat purchase — premium segment growing.", timelineStage: "Growing" },
  { name: "Fertility supplement India", growth: "+290%", growthNum: 290, volume: "Medium", category: "Women's Health", sources: { google: 70, reddit: 75, youtube: 65, amazon: 60 }, sparkline: [10,14,19,26,33,42,49,54,59,62,65,70], signal: "IVF and natural conception narrative — taboo breaking online.", timelineStage: "Growing" },
  { name: "Breast health supplement", growth: "+170%", growthNum: 170, volume: "Low", category: "Women's Health", sources: { google: 45, reddit: 48, youtube: 40, amazon: 50 }, sparkline: [10,13,16,20,24,28,32,35,38,40,43,46], signal: "Awareness-driven category — early mover opportunity.", timelineStage: "Emerging" },
  { name: "Vitex supplement India", growth: "+200%", growthNum: 200, volume: "Low", category: "Women's Health", sources: { google: 42, reddit: 55, youtube: 45, amazon: 35 }, sparkline: [6,8,11,15,20,25,30,34,37,39,41,44], signal: "PMS and cycle regulation narrative gaining organic search traction.", timelineStage: "Emerging" },

  // ── Fitness ──────────────────────────────────────────────────────────────────
  { name: "Collagen supplement India", growth: "+310%", growthNum: 310, volume: "High", category: "Fitness", sources: { google: 88, reddit: 65, youtube: 72, amazon: 92 }, sparkline: [20,28,36,46,56,64,72,78,82,86,88,90], signal: "Skin and joints narrative has crossover appeal beyond fitness.", timelineStage: "Peak" },
  { name: "Electrolyte powder India", growth: "+280%", growthNum: 280, volume: "High", category: "Fitness", sources: { google: 85, reddit: 62, youtube: 68, amazon: 88 }, sparkline: [18,24,32,40,50,58,64,70,74,78,82,86], signal: "Heat and hydration narrative highly relevant for Indian climate.", timelineStage: "Growing" },
  { name: "Creatine monohydrate India", growth: "+380%", growthNum: 380, volume: "High", category: "Fitness", sources: { google: 90, reddit: 82, youtube: 88, amazon: 85 }, sparkline: [15,22,32,42,54,64,72,78,84,87,90,92], signal: "Most searched fitness supplement in India — market expanding fast.", timelineStage: "Growing" },
  { name: "Pre workout India natural", growth: "+220%", growthNum: 220, volume: "Medium", category: "Fitness", sources: { google: 72, reddit: 68, youtube: 75, amazon: 78 }, sparkline: [18,24,30,38,44,52,58,62,66,68,70,74], signal: "Clean label demand growing within performance nutrition.", timelineStage: "Growing" },
  { name: "Whey protein isolate India", growth: "+150%", growthNum: 150, volume: "High", category: "Fitness", sources: { google: 88, reddit: 75, youtube: 80, amazon: 92 }, sparkline: [35,40,44,48,52,56,60,64,68,72,76,80], signal: "Premium whey growing faster than concentrate — margin opportunity.", timelineStage: "Peak" },
  { name: "Plant protein India", growth: "+260%", growthNum: 260, volume: "High", category: "Fitness", sources: { google: 80, reddit: 68, youtube: 72, amazon: 82 }, sparkline: [18,24,30,38,46,54,60,65,69,72,76,80], signal: "Vegan and vegetarian fitness segment massively underserved.", timelineStage: "Growing" },
  { name: "BCAA supplement India", growth: "+140%", growthNum: 140, volume: "High", category: "Fitness", sources: { google: 82, reddit: 70, youtube: 75, amazon: 88 }, sparkline: [38,42,46,50,54,57,60,63,66,68,70,74], signal: "Maturing category — opportunity in clean, India-made formulation.", timelineStage: "Mainstream" },
  { name: "Beta alanine India", growth: "+180%", growthNum: 180, volume: "Medium", category: "Fitness", sources: { google: 55, reddit: 60, youtube: 58, amazon: 60 }, sparkline: [15,18,22,27,32,37,42,46,49,51,53,57], signal: "Endurance athlete segment growing in India — niche but growing.", timelineStage: "Emerging" },
  { name: "Citrulline supplement India", growth: "+200%", growthNum: 200, volume: "Medium", category: "Fitness", sources: { google: 58, reddit: 62, youtube: 60, amazon: 55 }, sparkline: [10,13,17,22,28,34,39,43,47,49,52,56], signal: "Pump and endurance narrative gaining traction in gym community.", timelineStage: "Emerging" },
  { name: "Recovery supplement India", growth: "+220%", growthNum: 220, volume: "High", category: "Fitness", sources: { google: 70, reddit: 62, youtube: 65, amazon: 75 }, sparkline: [16,20,25,32,38,44,50,55,58,61,64,68], signal: "Post-workout recovery narrative growing among serious athletes.", timelineStage: "Growing" },
  { name: "Turkesterone supplement India", growth: "+350%", growthNum: 350, volume: "Low", category: "Fitness", sources: { google: 55, reddit: 75, youtube: 70, amazon: 35 }, sparkline: [3,5,9,15,22,31,40,46,50,52,54,58], signal: "Natural anabolic narrative — Reddit buzz high, Amazon supply low.", timelineStage: "Emerging" },
  { name: "HMB supplement India", growth: "+160%", growthNum: 160, volume: "Low", category: "Fitness", sources: { google: 42, reddit: 50, youtube: 45, amazon: 40 }, sparkline: [8,10,13,17,21,25,29,32,35,37,40,43], signal: "Muscle preservation narrative gaining traction in 35+ demographic.", timelineStage: "Emerging" },

  // ── Longevity ────────────────────────────────────────────────────────────────
  { name: "NMN supplement India", growth: "+450%", growthNum: 450, volume: "Medium", category: "Longevity", sources: { google: 68, reddit: 72, youtube: 78, amazon: 42 }, sparkline: [3,6,10,16,24,34,44,54,60,64,68,72], signal: "David Sinclair effect — anti-aging narrative driving early adopter demand.", timelineStage: "Emerging" },
  { name: "Resveratrol supplement", growth: "+180%", growthNum: 180, volume: "Low", category: "Longevity", sources: { google: 48, reddit: 52, youtube: 45, amazon: 38 }, sparkline: [10,14,18,22,28,32,36,40,44,46,48,52], signal: "Longevity stack ingredient — premium buyer segment.", timelineStage: "Emerging" },
  { name: "Spermidine supplement", growth: "+290%", growthNum: 290, volume: "Low", category: "Longevity", sources: { google: 42, reddit: 58, youtube: 52, amazon: 28 }, sparkline: [3,5,8,13,20,28,34,38,40,42,44,46], signal: "Autophagy narrative gaining traction in biohacker community.", timelineStage: "Emerging" },
  { name: "Longevity supplement India", growth: "+220%", growthNum: 220, volume: "Medium", category: "Longevity", sources: { google: 58, reddit: 55, youtube: 62, amazon: 48 }, sparkline: [10,14,20,26,32,38,44,48,52,55,58,62], signal: "Category awareness building — no dominant Indian brand yet.", timelineStage: "Emerging" },
  { name: "Fisetin supplement India", growth: "+320%", growthNum: 320, volume: "Low", category: "Longevity", sources: { google: 45, reddit: 65, youtube: 55, amazon: 28 }, sparkline: [3,5,8,13,21,30,38,43,47,49,51,55], signal: "Senolytic narrative gaining momentum — zero Indian brand.", timelineStage: "Emerging" },
  { name: "Quercetin supplement India", growth: "+240%", growthNum: 240, volume: "Medium", category: "Longevity", sources: { google: 55, reddit: 62, youtube: 50, amazon: 45 }, sparkline: [6,9,13,19,26,33,39,43,47,50,53,57], signal: "Anti-inflammatory and anti-aging dual narrative growing strongly.", timelineStage: "Emerging" },
  { name: "NAD supplement India", growth: "+380%", growthNum: 380, volume: "Medium", category: "Longevity", sources: { google: 60, reddit: 68, youtube: 72, amazon: 40 }, sparkline: [4,7,11,17,26,36,46,54,58,61,64,68], signal: "Cellular energy and anti-aging — rising with NMN awareness.", timelineStage: "Emerging" },
  { name: "Berberine supplement India", growth: "+290%", growthNum: 290, volume: "Medium", category: "Longevity", sources: { google: 65, reddit: 75, youtube: 68, amazon: 52 }, sparkline: [5,8,13,20,28,38,47,53,58,61,63,67], signal: "Natural metformin alternative narrative — massive Reddit traction.", timelineStage: "Growing" },
  { name: "Urolithin A supplement", growth: "+260%", growthNum: 260, volume: "Low", category: "Longevity", sources: { google: 40, reddit: 58, youtube: 50, amazon: 28 }, sparkline: [3,5,8,13,19,27,34,39,43,45,47,51], signal: "Mitochondrial health narrative — Amazentis research driving awareness.", timelineStage: "Emerging" },

  // ── Skincare ─────────────────────────────────────────────────────────────────
  { name: "Skin cycling routine", growth: "+360%", growthNum: 360, volume: "High", category: "Skincare", sources: { google: 82, reddit: 68, youtube: 92, amazon: 72 }, sparkline: [6,10,16,24,34,44,56,64,72,76,80,84], signal: "YouTube routine trend — content drives product discovery.", timelineStage: "Growing" },
  { name: "Bakuchiol India", growth: "+290%", growthNum: 290, volume: "Medium", category: "Skincare", sources: { google: 65, reddit: 58, youtube: 72, amazon: 62 }, sparkline: [8,12,18,26,34,42,50,56,60,64,66,70], signal: "Retinol alternative — Ayurvedic origin resonates with Indian consumers.", timelineStage: "Growing" },
  { name: "Niacinamide serum India", growth: "+240%", growthNum: 240, volume: "High", category: "Skincare", sources: { google: 88, reddit: 72, youtube: 78, amazon: 92 }, sparkline: [22,30,38,48,56,62,68,74,78,82,86,90], signal: "Already mainstream — high competition, hard entry point now.", timelineStage: "Mainstream" },
  { name: "Tranexamic acid serum", growth: "+310%", growthNum: 310, volume: "Medium", category: "Skincare", sources: { google: 72, reddit: 65, youtube: 68, amazon: 58 }, sparkline: [5,9,15,22,30,40,50,58,64,68,72,76], signal: "Hyperpigmentation solution — highly relevant for Indian skin tones.", timelineStage: "Growing" },
  { name: "Azelaic acid India", growth: "+270%", growthNum: 270, volume: "Medium", category: "Skincare", sources: { google: 65, reddit: 62, youtube: 68, amazon: 55 }, sparkline: [6,9,14,21,28,36,43,49,53,57,60,64], signal: "Acne and pigmentation dual-benefit — growing with skincare education.", timelineStage: "Growing" },
  { name: "Peptide serum India", growth: "+320%", growthNum: 320, volume: "High", category: "Skincare", sources: { google: 78, reddit: 68, youtube: 82, amazon: 75 }, sparkline: [8,12,18,26,35,45,55,62,68,72,75,80], signal: "Anti-aging narrative with broad demographic appeal.", timelineStage: "Growing" },
  { name: "Ceramide moisturiser India", growth: "+250%", growthNum: 250, volume: "High", category: "Skincare", sources: { google: 75, reddit: 65, youtube: 70, amazon: 80 }, sparkline: [12,17,23,30,38,45,52,57,62,65,68,72], signal: "Skin barrier narrative mainstream in US — 12 months behind in India.", timelineStage: "Growing" },
  { name: "Snail mucin India", growth: "+280%", growthNum: 280, volume: "Medium", category: "Skincare", sources: { google: 65, reddit: 62, youtube: 75, amazon: 58 }, sparkline: [5,8,13,19,27,36,44,51,56,60,63,67], signal: "K-beauty ingredient crossing into Indian market via YouTube.", timelineStage: "Growing" },
  { name: "Kojic acid serum India", growth: "+220%", growthNum: 220, volume: "High", category: "Skincare", sources: { google: 78, reddit: 58, youtube: 65, amazon: 82 }, sparkline: [18,23,28,34,41,47,53,58,62,65,68,72], signal: "Skin brightening — massive demand given Indian skin tone concerns.", timelineStage: "Growing" },
  { name: "Retinol cream India", growth: "+190%", growthNum: 190, volume: "High", category: "Skincare", sources: { google: 85, reddit: 70, youtube: 78, amazon: 88 }, sparkline: [25,30,35,41,47,52,57,62,66,69,72,76], signal: "Anti-aging entry point — high repeat purchase category.", timelineStage: "Growing" },
  { name: "SPF supplement oral India", growth: "+340%", growthNum: 340, volume: "Low", category: "Skincare", sources: { google: 52, reddit: 65, youtube: 60, amazon: 35 }, sparkline: [3,5,9,15,22,31,40,46,50,52,54,58], signal: "Ingestible sun protection — completely unclaimed in India.", timelineStage: "Emerging" },

  // ── Mental Wellness ──────────────────────────────────────────────────────────
  { name: "Magnesium glycinate sleep", growth: "+380%", growthNum: 380, volume: "High", category: "Mental Wellness", sources: { google: 85, reddit: 88, youtube: 72, amazon: 78 }, sparkline: [10,16,24,34,44,54,64,72,78,82,85,88], signal: "Reddit wellness communities driving massive organic demand.", timelineStage: "Growing" },
  { name: "L-theanine supplement India", growth: "+260%", growthNum: 260, volume: "Medium", category: "Mental Wellness", sources: { google: 62, reddit: 72, youtube: 58, amazon: 55 }, sparkline: [8,12,18,26,34,42,48,54,58,60,62,66], signal: "Calm focus narrative — strong appeal for WFH professionals.", timelineStage: "Growing" },
  { name: "Anxiety supplement natural India", growth: "+320%", growthNum: 320, volume: "High", category: "Mental Wellness", sources: { google: 78, reddit: 82, youtube: 65, amazon: 72 }, sparkline: [12,18,26,34,44,54,62,68,72,76,78,82], signal: "Post-pandemic mental health awareness driving category growth.", timelineStage: "Growing" },
  { name: "Sleep supplement India", growth: "+290%", growthNum: 290, volume: "High", category: "Mental Wellness", sources: { google: 88, reddit: 78, youtube: 68, amazon: 85 }, sparkline: [20,26,34,42,50,58,64,70,74,78,82,86], signal: "High repeat purchase — insomnia affects 30%+ of urban Indians.", timelineStage: "Growing" },
  { name: "5-HTP supplement India", growth: "+240%", growthNum: 240, volume: "Medium", category: "Mental Wellness", sources: { google: 58, reddit: 70, youtube: 55, amazon: 48 }, sparkline: [7,10,15,21,28,36,43,48,52,54,56,60], signal: "Serotonin precursor — mood and sleep dual narrative gaining traction.", timelineStage: "Growing" },
  { name: "GABA supplement India", growth: "+210%", growthNum: 210, volume: "Medium", category: "Mental Wellness", sources: { google: 55, reddit: 65, youtube: 50, amazon: 50 }, sparkline: [8,11,15,20,26,32,38,43,47,50,53,57], signal: "Calm and sleep narrative — natural alternative to prescription sleep aids.", timelineStage: "Growing" },
  { name: "Melatonin supplement India", growth: "+170%", growthNum: 170, volume: "High", category: "Mental Wellness", sources: { google: 82, reddit: 70, youtube: 62, amazon: 85 }, sparkline: [28,32,37,42,47,52,56,60,64,67,70,74], signal: "Growing awareness though regulatory grey area in India — opportunity.", timelineStage: "Growing" },
  { name: "Mood supplement natural India", growth: "+250%", growthNum: 250, volume: "High", category: "Mental Wellness", sources: { google: 72, reddit: 75, youtube: 62, amazon: 68 }, sparkline: [12,16,22,29,36,43,50,55,59,62,65,69], signal: "Destigmatisation of mental health driving supplement search.", timelineStage: "Growing" },
  { name: "Ashwagandha for anxiety", growth: "+310%", growthNum: 310, volume: "High", category: "Mental Wellness", sources: { google: 85, reddit: 80, youtube: 75, amazon: 80 }, sparkline: [14,20,27,35,44,53,61,67,72,76,79,83], signal: "Most searched mental wellness query — huge first mover advantage.", timelineStage: "Growing" },
  { name: "Passionflower supplement India", growth: "+190%", growthNum: 190, volume: "Low", category: "Mental Wellness", sources: { google: 45, reddit: 52, youtube: 42, amazon: 38 }, sparkline: [7,9,12,16,21,26,31,35,39,41,43,47], signal: "Natural sedative gaining early adopter traction for anxiety.", timelineStage: "Emerging" },

  // ── Devices ──────────────────────────────────────────────────────────────────
  { name: "Red light therapy device India", growth: "+380%", growthNum: 380, volume: "Medium", category: "Devices", sources: { google: 75, reddit: 62, youtube: 88, amazon: 48 }, sparkline: [4,7,12,18,26,36,46,56,64,70,74,78], signal: "10M YouTube views — ZERO Indian brand — Rs.200Cr market open.", timelineStage: "Emerging" },
  { name: "Cold plunge India", growth: "+290%", growthNum: 290, volume: "Low", category: "Devices", sources: { google: 55, reddit: 65, youtube: 78, amazon: 32 }, sparkline: [3,5,9,14,20,28,36,42,48,52,55,58], signal: "Biohacker trend — early market with strong word-of-mouth.", timelineStage: "Emerging" },
  { name: "PEMF therapy India", growth: "+220%", growthNum: 220, volume: "Low", category: "Devices", sources: { google: 42, reddit: 48, youtube: 52, amazon: 25 }, sparkline: [4,6,9,13,18,24,30,34,38,40,42,45], signal: "Recovery device gaining traction in physio and sports medicine.", timelineStage: "Emerging" },
  { name: "Continuous glucose monitor India", growth: "+350%", growthNum: 350, volume: "Medium", category: "Devices", sources: { google: 68, reddit: 72, youtube: 65, amazon: 45 }, sparkline: [5,8,13,20,28,38,48,56,62,66,68,72], signal: "Preventive health narrative — non-diabetic market emerging.", timelineStage: "Emerging" },
  { name: "EMS body sculpting India", growth: "+260%", growthNum: 260, volume: "Medium", category: "Devices", sources: { google: 62, reddit: 55, youtube: 70, amazon: 52 }, sparkline: [5,8,12,18,25,33,41,47,52,55,58,62], signal: "At-home gym device wave — social media driving huge interest.", timelineStage: "Emerging" },
  { name: "Sauna blanket India", growth: "+300%", growthNum: 300, volume: "Low", category: "Devices", sources: { google: 52, reddit: 58, youtube: 72, amazon: 40 }, sparkline: [3,5,9,15,22,31,39,45,49,51,53,57], signal: "Detox and weight loss narrative — YouTube driving strong interest.", timelineStage: "Emerging" },
  { name: "Vibration plate India", growth: "+180%", growthNum: 180, volume: "Medium", category: "Devices", sources: { google: 58, reddit: 45, youtube: 62, amazon: 55 }, sparkline: [10,13,17,22,27,32,37,41,45,47,50,54], signal: "Home fitness wave continues — affordable recovery device segment.", timelineStage: "Emerging" },
  { name: "Hyperbaric oxygen India", growth: "+240%", growthNum: 240, volume: "Low", category: "Devices", sources: { google: 48, reddit: 52, youtube: 58, amazon: 20 }, sparkline: [3,5,8,13,19,27,34,39,43,45,47,51], signal: "Recovery and performance narrative — clinic market first, home next.", timelineStage: "Emerging" },

  // ── Nutrition ────────────────────────────────────────────────────────────────
  { name: "Vitamin D3 K2 India", growth: "+280%", growthNum: 280, volume: "High", category: "Nutrition", sources: { google: 82, reddit: 72, youtube: 65, amazon: 88 }, sparkline: [18,24,31,38,46,54,60,65,69,72,76,80], signal: "K2 co-factor narrative — premium over standalone D3.", timelineStage: "Growing" },
  { name: "Omega 3 supplement India", growth: "+160%", growthNum: 160, volume: "High", category: "Nutrition", sources: { google: 85, reddit: 68, youtube: 62, amazon: 90 }, sparkline: [35,40,44,48,52,56,60,64,68,72,76,80], signal: "Mature category — opportunity in vegan algae-based omega 3.", timelineStage: "Mainstream" },
  { name: "Zinc supplement India", growth: "+140%", growthNum: 140, volume: "High", category: "Nutrition", sources: { google: 80, reddit: 62, youtube: 55, amazon: 85 }, sparkline: [32,36,40,44,48,52,55,58,61,64,67,70], signal: "Post-COVID immunity narrative sustaining demand.", timelineStage: "Mainstream" },
  { name: "Vegan multivitamin India", growth: "+220%", growthNum: 220, volume: "High", category: "Nutrition", sources: { google: 72, reddit: 65, youtube: 58, amazon: 78 }, sparkline: [15,19,24,30,37,43,49,54,58,61,64,68], signal: "Plant-based diet boom driving vegan supplement demand.", timelineStage: "Growing" },
  { name: "Iron supplement women India", growth: "+180%", growthNum: 180, volume: "High", category: "Nutrition", sources: { google: 78, reddit: 60, youtube: 52, amazon: 82 }, sparkline: [25,29,33,38,43,48,52,56,59,62,65,68], signal: "Iron deficiency endemic in India — premium format opportunity.", timelineStage: "Growing" },
  { name: "B12 supplement India", growth: "+150%", growthNum: 150, volume: "High", category: "Nutrition", sources: { google: 82, reddit: 65, youtube: 58, amazon: 88 }, sparkline: [38,42,46,50,53,57,60,63,66,68,71,74], signal: "Vegetarian B12 deficiency narrative — huge market in India.", timelineStage: "Mainstream" },
  { name: "Iodine supplement India", growth: "+170%", growthNum: 170, volume: "Medium", category: "Nutrition", sources: { google: 55, reddit: 50, youtube: 42, amazon: 60 }, sparkline: [15,18,22,26,30,34,38,42,45,47,50,53], signal: "Thyroid health narrative driving awareness — underserved segment.", timelineStage: "Emerging" },
  { name: "Selenium supplement India", growth: "+160%", growthNum: 160, volume: "Medium", category: "Nutrition", sources: { google: 50, reddit: 48, youtube: 40, amazon: 55 }, sparkline: [12,15,18,22,26,30,34,37,40,42,44,47], signal: "Thyroid and antioxidant narrative — growing with thyroid awareness.", timelineStage: "Emerging" },
  { name: "Electrolyte tablet India", growth: "+240%", growthNum: 240, volume: "High", category: "Nutrition", sources: { google: 72, reddit: 58, youtube: 62, amazon: 78 }, sparkline: [15,19,24,30,37,44,50,55,59,62,65,69], signal: "Convenience format — strong potential for D2C subscription.", timelineStage: "Growing" },
  { name: "Colostrum supplement India", growth: "+310%", growthNum: 310, volume: "Medium", category: "Nutrition", sources: { google: 58, reddit: 68, youtube: 65, amazon: 45 }, sparkline: [4,7,11,17,25,34,43,50,54,57,59,63], signal: "Gut and immunity super-ingredient — completely unclaimed in India.", timelineStage: "Emerging" },

  // ── Hair & Scalp ─────────────────────────────────────────────────────────────
  { name: "Hair supplement India", growth: "+270%", growthNum: 270, volume: "High", category: "Hair & Scalp", sources: { google: 85, reddit: 70, youtube: 78, amazon: 88 }, sparkline: [18,23,29,36,44,51,57,62,66,69,72,76], signal: "Post-COVID hair loss driving explosive search volume.", timelineStage: "Growing" },
  { name: "Biotin supplement India", growth: "+180%", growthNum: 180, volume: "High", category: "Hair & Scalp", sources: { google: 85, reddit: 65, youtube: 70, amazon: 90 }, sparkline: [32,37,41,46,51,55,59,63,66,69,72,75], signal: "Mainstream but under-innovated — opportunity in high-dose formats.", timelineStage: "Mainstream" },
  { name: "Rosemary oil scalp India", growth: "+390%", growthNum: 390, volume: "High", category: "Hair & Scalp", sources: { google: 88, reddit: 78, youtube: 92, amazon: 80 }, sparkline: [8,13,19,27,37,48,58,66,72,77,81,85], signal: "Viral minoxidil comparison driving massive organic search.", timelineStage: "Growing" },
  { name: "DHT blocker supplement India", growth: "+300%", growthNum: 300, volume: "Medium", category: "Hair & Scalp", sources: { google: 68, reddit: 75, youtube: 68, amazon: 62 }, sparkline: [6,9,14,20,28,37,45,51,56,59,62,66], signal: "Male hair loss narrative — huge Indian market, few clean solutions.", timelineStage: "Growing" },
  { name: "Saw palmetto supplement India", growth: "+250%", growthNum: 250, volume: "Medium", category: "Hair & Scalp", sources: { google: 58, reddit: 65, youtube: 58, amazon: 52 }, sparkline: [6,9,13,19,26,33,40,45,49,52,55,59], signal: "Natural DHT blocker — demand rising with male hair loss awareness.", timelineStage: "Growing" },
  { name: "Scalp serum India", growth: "+280%", growthNum: 280, volume: "High", category: "Hair & Scalp", sources: { google: 75, reddit: 65, youtube: 78, amazon: 80 }, sparkline: [10,14,19,26,34,42,50,56,61,64,67,71], signal: "Scalp health as root cause narrative — product format innovation needed.", timelineStage: "Growing" },
  { name: "Keratin treatment at home", growth: "+200%", growthNum: 200, volume: "High", category: "Hair & Scalp", sources: { google: 78, reddit: 62, youtube: 80, amazon: 75 }, sparkline: [18,22,27,33,39,45,51,55,59,62,65,68], signal: "Salon alternative — large urban women segment seeking affordable options.", timelineStage: "Growing" },

  // ── Metabolic Health ─────────────────────────────────────────────────────────
  { name: "Blood sugar supplement India", growth: "+260%", growthNum: 260, volume: "High", category: "Metabolic Health", sources: { google: 80, reddit: 65, youtube: 62, amazon: 82 }, sparkline: [18,23,28,35,42,49,55,60,64,67,70,74], signal: "Diabetes prevention narrative — massive market in India.", timelineStage: "Growing" },
  { name: "Insulin resistance supplement", growth: "+300%", growthNum: 300, volume: "Medium", category: "Metabolic Health", sources: { google: 65, reddit: 75, youtube: 65, amazon: 58 }, sparkline: [7,10,15,21,29,38,46,52,56,59,62,66], signal: "Metabolic health category growing — PCOS crossover driving search.", timelineStage: "Growing" },
  { name: "Weight loss supplement natural India", growth: "+200%", growthNum: 200, volume: "High", category: "Metabolic Health", sources: { google: 85, reddit: 68, youtube: 72, amazon: 88 }, sparkline: [25,30,35,41,47,52,57,61,64,67,70,74], signal: "Evergreen high-volume category — clean label differentiation opportunity.", timelineStage: "Growing" },
  { name: "GLP-1 natural supplement India", growth: "+420%", growthNum: 420, volume: "Medium", category: "Metabolic Health", sources: { google: 58, reddit: 72, youtube: 68, amazon: 35 }, sparkline: [2,4,7,12,20,31,42,51,56,59,62,66], signal: "Ozempic halo effect — natural alternative narrative completely unclaimed.", timelineStage: "Emerging" },
  { name: "Metabolism booster natural India", growth: "+190%", growthNum: 190, volume: "High", category: "Metabolic Health", sources: { google: 80, reddit: 62, youtube: 65, amazon: 85 }, sparkline: [22,26,31,36,42,47,52,56,60,63,66,70], signal: "High consumer intent — opportunity in clean, science-backed formula.", timelineStage: "Growing" },
  { name: "Chromium supplement India", growth: "+160%", growthNum: 160, volume: "Medium", category: "Metabolic Health", sources: { google: 50, reddit: 48, youtube: 42, amazon: 58 }, sparkline: [12,15,18,22,27,31,35,38,41,43,46,49], signal: "Blood sugar regulation narrative growing with diabetes awareness.", timelineStage: "Emerging" },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_KEYWORDS.map(k => k.category))).sort()];
const TIMELINE_STAGES = ["Emerging", "Growing", "Peak", "Mainstream"] as const;

const STAGE_COLORS: Record<string, string> = {
  Emerging:   "text-blue-600 bg-blue-50 border-blue-200",
  Growing:    "text-green-600 bg-green-50 border-green-200",
  Peak:       "text-orange-600 bg-orange-50 border-orange-200",
  Mainstream: "text-slate-500 bg-slate-50 border-slate-200",
};

const VOLUME_COLORS: Record<string, string> = {
  High:   "text-green-700 bg-green-50",
  Medium: "text-amber-700 bg-amber-50",
  Low:    "text-slate-500 bg-slate-50",
};

function Sparkline({ data, color = "#F97316" }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          fill={`url(#sg-${color.replace("#","")})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function KeywordPopup({ kw, onClose }: { kw: Keyword; onClose: () => void }) {
  const chartData = kw.sparkline.map((v, i) => ({
    month: ["M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12"][i],
    value: v,
  }));
  const sourceData = [
    { name: "Google Trends", value: kw.sources.google, color: "#4285F4" },
    { name: "Reddit",        value: kw.sources.reddit, color: "#FF4500" },
    { name: "YouTube",       value: kw.sources.youtube, color: "#FF0000" },
    { name: "Amazon India",  value: kw.sources.amazon, color: "#FF9900" },
  ];
  const stageIndex = TIMELINE_STAGES.indexOf(kw.timelineStage as any);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STAGE_COLORS[kw.timelineStage]}`}>{kw.timelineStage}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${VOLUME_COLORS[kw.volume]}`}>{kw.volume} Volume</span>
            </div>
            <h2 className="text-lg font-black text-foreground">{kw.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{kw.category}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-2xl font-black text-primary">{kw.growth}</span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">12-Month Search Interest (India)</p>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Live Data
              </div>
            </div>
            <div className="h-36 bg-secondary/30 rounded-xl p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="popupGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(16,80%,44%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(16,80%,44%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [v + "/100", "Interest"]} />
                  <Area type="monotone" dataKey="value" stroke="hsl(16,80%,44%)" strokeWidth={2} fill="url(#popupGrad)" dot={false} activeDot={{ r: 3, fill: "hsl(16,80%,44%)", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Signal Strength by Data Source</p>
            <div className="space-y-2.5">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs text-foreground font-medium w-24 flex-shrink-0">{s.name}</span>
                  <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                  <span className="text-xs font-bold text-foreground w-8 text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Signal Timeline</p>
            <div className="relative">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-3 h-0.5 bg-border" />
                {TIMELINE_STAGES.map((stage, i) => {
                  const isActive = i === stageIndex;
                  const isPast = i < stageIndex;
                  return (
                    <div key={stage} className="flex flex-col items-center gap-2 relative z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? "border-primary bg-primary" : isPast ? "border-primary bg-primary/20" : "border-border bg-card"}`}>
                        {(isActive || isPast) && <div className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : "bg-primary"}`} />}
                      </div>
                      <span className={`text-xs font-semibold ${isActive ? "text-primary" : isPast ? "text-primary/60" : "text-muted-foreground"}`}>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Signal Insight</p>
            <p className="text-sm text-foreground leading-relaxed">{kw.signal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SignalsUniverse = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"growth" | "volume" | "name">("growth");
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [stageFilter, setStageFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    let list = ALL_KEYWORDS;
    if (activeCategory !== "All") list = list.filter(k => k.category === activeCategory);
    if (stageFilter !== "All") list = list.filter(k => k.timelineStage === stageFilter);
    if (search.trim()) list = list.filter(k =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.category.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "growth") list = [...list].sort((a, b) => b.growthNum - a.growthNum);
    else if (sortBy === "volume") list = [...list].sort((a, b) => {
      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.volume] - order[a.volume];
    });
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, search, sortBy, stageFilter]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; avgGrowth: number; hot: number }> = {};
    ALL_KEYWORDS.forEach(k => {
      if (!stats[k.category]) stats[k.category] = { count: 0, avgGrowth: 0, hot: 0 };
      stats[k.category].count++;
      stats[k.category].avgGrowth += k.growthNum;
      if (k.growthNum >= 300) stats[k.category].hot++;
    });
    Object.keys(stats).forEach(cat => {
      stats[cat].avgGrowth = Math.round(stats[cat].avgGrowth / stats[cat].count);
    });
    return stats;
  }, []);

  const topGrowth = useMemo(() =>
    [...ALL_KEYWORDS].sort((a, b) => b.growthNum - a.growthNum).slice(0, 5), []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* PAGE HEADER */}
        <div className="border-b border-border pb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-6 rounded-full bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Intelligence</span>
              </div>
              <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">Signals Universe</h1>
              <p className="text-muted-foreground text-sm max-w-xl">
                {ALL_KEYWORDS.length} keywords tracked across {CATEGORIES.length - 1} categories. Updated monthly from 5 independent data sources.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Google Trends", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "Reddit",        color: "bg-orange-50 text-orange-700 border-orange-200" },
                { label: "YouTube",       color: "bg-red-50 text-red-700 border-red-200" },
                { label: "Amazon India",  color: "bg-amber-50 text-amber-700 border-amber-200" },
                { label: "PubMed",        color: "bg-green-50 text-green-700 border-green-200" },
              ].map(s => (
                <span key={s.label} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color} flex items-center gap-1`}>
                  <Database className="h-2.5 w-2.5" />{s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex-shrink-0 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Top signals:
            </span>
            {topGrowth.map(k => (
              <button key={k.name} onClick={() => setSelectedKeyword(k)}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-border bg-card hover:border-primary/40 hover:text-primary transition-colors">
                <span className="text-primary font-bold">{k.growth}</span>
                <span className="text-foreground">{k.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY GRID */}
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" /> Browse by Category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {CATEGORIES.filter(c => c !== "All").map(cat => {
              const stats = categoryStats[cat];
              const isActive = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(isActive ? "All" : cat)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 group ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/30 hover:shadow-sm"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? "text-primary" : "text-muted-foreground"}`}>{cat}</span>
                    {stats?.hot > 0 && (
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">{stats.hot} hot</span>
                    )}
                  </div>
                  <p className="text-xl font-black text-foreground mb-0.5">{stats?.count}</p>
                  <p className="text-xs text-muted-foreground">keywords</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">avg +{stats?.avgGrowth}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search keywords..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...TIMELINE_STAGES].map(stage => (
              <button key={stage} onClick={() => setStageFilter(stage)}
                className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-colors ${stageFilter === stage ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>
                {stage}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
            <option value="growth">Sort: Growth</option>
            <option value="volume">Sort: Volume</option>
            <option value="name">Sort: A-Z</option>
          </select>
        </div>

        <div className="flex items-center justify-between -mt-6">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-bold text-foreground">{filtered.length}</span> keywords
            {activeCategory !== "All" && <> in <span className="font-bold text-primary">{activeCategory}</span></>}
            {stageFilter !== "All" && <> &middot; <span className="font-bold text-foreground">{stageFilter}</span></>}
          </p>
          {(activeCategory !== "All" || stageFilter !== "All" || search) && (
            <button onClick={() => { setActiveCategory("All"); setStageFilter("All"); setSearch(""); }}
              className="text-xs font-semibold text-primary hover:underline">Clear filters</button>
          )}
        </div>

        {/* KEYWORD TABLE */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-secondary/50 border-b border-border">
            <div className="col-span-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Keyword</div>
            <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Category</div>
            <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Growth</div>
            <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hidden md:block">Trend</div>
            <div className="col-span-1 text-xs font-bold text-muted-foreground uppercase tracking-widest hidden lg:block">Volume</div>
            <div className="col-span-1 text-xs font-bold text-muted-foreground uppercase tracking-widest hidden lg:block">Stage</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((kw, i) => {
              const trendColor = kw.growthNum >= 300 ? "#EF4444" : kw.growthNum >= 200 ? "#F97316" : "#10B981";
              return (
                <button key={kw.name} onClick={() => setSelectedKeyword(kw)}
                  className="w-full grid grid-cols-12 gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors text-left group items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5 flex-shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{kw.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden mt-0.5">{kw.category}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0" />
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <span className="text-xs text-muted-foreground">{kw.category}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" style={{ color: trendColor }} />
                    <span className="text-sm font-bold" style={{ color: trendColor }}>{kw.growth}</span>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <Sparkline data={kw.sparkline} color={trendColor} />
                  </div>
                  <div className="col-span-1 hidden lg:flex">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${VOLUME_COLORS[kw.volume]}`}>{kw.volume}</span>
                  </div>
                  <div className="col-span-1 hidden lg:flex">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STAGE_COLORS[kw.timelineStage]}`}>{kw.timelineStage}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-sm">No keywords match your filters.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); setStageFilter("All"); }}
                className="mt-3 text-sm font-semibold text-primary hover:underline">Clear all filters</button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Data updated March 2026 &middot; Next update April 2026</p>
          <p className="text-xs text-muted-foreground">Click any keyword to view detailed analysis</p>
        </div>
      </div>

      {selectedKeyword && <KeywordPopup kw={selectedKeyword} onClose={() => setSelectedKeyword(null)} />}
    </Layout>
  );
};

export default SignalsUniverse;
