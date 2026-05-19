export interface RegulatoryData {
  ingredient: string;
  fssai: string;
  fda: string;
  efsa: string;
  maxDosage: string;
  labellingRequirement: string;
  warningsRequired: string;
  riskLevel: "Low" | "Medium" | "High";
  notes: string;
}

export const regulatoryDatabase: RegulatoryData[] = [
  {
    ingredient: "Ashwagandha",
    fssai: "✅ Approved (Ayurvedic)",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "300-600mg/day (root extract)",
    labellingRequirement: "Must declare as Ayurvedic ingredient. Withanolide content recommended.",
    warningsRequired: "Not recommended during pregnancy. Consult physician if on thyroid medication.",
    riskLevel: "Low",
    notes: "Well-established Ayurvedic ingredient with strong regulatory history in India."
  },
  {
    ingredient: "Shilajit",
    fssai: "✅ Approved (Ayurvedic)",
    fda: "⚠️ Not specifically evaluated",
    efsa: "⚠️ Novel Food (under review)",
    maxDosage: "300-500mg/day (purified extract)",
    labellingRequirement: "Must declare Ayurvedic origin. Heavy metal testing certificate required.",
    warningsRequired: "⚠️ Heavy metal testing required. Must be purified grade. Not for children.",
    riskLevel: "Medium",
    notes: "Heavy metal contamination is a real risk. Only use purified, lab-tested Shilajit."
  },
  {
    ingredient: "NMN",
    fssai: "⚠️ No specific regulation yet",
    fda: "❌ Not approved as supplement",
    efsa: "⚠️ Novel Food (under review)",
    maxDosage: "250-500mg/day (no FSSAI guideline)",
    labellingRequirement: "Cannot make anti-aging claims. Must label as dietary supplement.",
    warningsRequired: "⚠️ Regulatory status uncertain. Not evaluated by FSSAI specifically. Consult physician.",
    riskLevel: "High",
    notes: "FDA removed NMN from supplement category in 2022. FSSAI has no specific stance yet. Regulatory risk is real."
  },
  {
    ingredient: "NAC (N-Acetyl Cysteine)",
    fssai: "⚠️ Limited regulation",
    fda: "⚠️ Contested (FDA challenged supplement status)",
    efsa: "✅ Approved",
    maxDosage: "600-1800mg/day",
    labellingRequirement: "Must label as dietary supplement with appropriate disclaimers.",
    warningsRequired: "FDA contested supplement status in 2020. Consult physician if on medication.",
    riskLevel: "Medium",
    notes: "FDA sent warning letters to NAC supplement brands. Status is contested but products remain on market."
  },
  {
    ingredient: "Berberine",
    fssai: "✅ Approved as herbal",
    fda: "❌ Not approved as supplement",
    efsa: "⚠️ Under safety review",
    maxDosage: "500-1500mg/day (divided doses)",
    labellingRequirement: "Must declare as herbal extract. Cannot make drug claims.",
    warningsRequired: "May interact with diabetes and blood pressure medications. Not for pregnant women.",
    riskLevel: "Medium",
    notes: "EFSA flagged safety concerns for berberine in 2024. Monitor regulatory changes."
  },
  {
    ingredient: "Lion's Mane",
    fssai: "✅ Approved as food",
    fda: "✅ GRAS",
    efsa: "✅ Approved as food",
    maxDosage: "500-3000mg/day (fruiting body extract)",
    labellingRequirement: "Must specify fruiting body vs mycelium. Declare extraction method.",
    warningsRequired: "Discontinue if allergic reaction occurs. Mushroom allergy warning required.",
    riskLevel: "Low",
    notes: "Well-established as food ingredient globally. Low regulatory risk."
  },
  {
    ingredient: "Colostrum",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "1-5g/day",
    labellingRequirement: "Must declare bovine source. Allergen warning for dairy.",
    warningsRequired: "Contains dairy allergens. Not suitable for lactose intolerant individuals.",
    riskLevel: "Low",
    notes: "Established dairy product with clear regulatory pathway."
  },
  {
    ingredient: "Creatine",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "3-5g/day (monohydrate)",
    labellingRequirement: "Must declare creatine monohydrate form. Serving size required.",
    warningsRequired: "Drink adequate water. Not evaluated for children. Consult physician if kidney issues.",
    riskLevel: "Low",
    notes: "One of the most researched supplements. Clear regulatory status globally."
  },
  {
    ingredient: "Collagen",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "2.5-15g/day (hydrolyzed peptides)",
    labellingRequirement: "Must declare source (bovine/marine/porcine). Allergen warnings.",
    warningsRequired: "Declare animal source. Fish/shellfish allergen warning for marine collagen.",
    riskLevel: "Low",
    notes: "Well-established ingredient with clear regulatory pathway in all markets."
  },
  {
    ingredient: "Magnesium Glycinate",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "200-400mg/day (elemental magnesium)",
    labellingRequirement: "Must declare elemental magnesium content. RDA percentage required.",
    warningsRequired: "May cause digestive effects at high doses. Consult physician if on medication.",
    riskLevel: "Low",
    notes: "Standard mineral supplement with clear global regulatory status."
  },
  {
    ingredient: "Rosemary Oil",
    fssai: "✅ Approved (topical/food grade)",
    fda: "✅ GRAS (food use)",
    efsa: "✅ Approved",
    maxDosage: "Topical: 2-5% dilution. Not for ingestion in concentrated form.",
    labellingRequirement: "Must declare 'for external use only' if topical. Essential oil grade specification.",
    warningsRequired: "Not for ingestion. Patch test recommended. Not for pregnant women (topical).",
    riskLevel: "Low",
    notes: "Widely used essential oil. Clear regulatory status for topical and food use."
  },
  {
    ingredient: "Inositol (Myo-Inositol)",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "2-4g/day (myo-inositol)",
    labellingRequirement: "Must specify form (myo-inositol vs D-chiro-inositol). Dosage per serving.",
    warningsRequired: "Consult physician if diabetic or on blood sugar medication.",
    riskLevel: "Low",
    notes: "Clinically proven for PCOS. Strong regulatory status globally."
  },
  {
    ingredient: "Tongkat Ali",
    fssai: "⚠️ Limited regulation (herbal)",
    fda: "⚠️ Not specifically evaluated",
    efsa: "⚠️ Novel Food",
    maxDosage: "200-400mg/day (standardized extract)",
    labellingRequirement: "Must declare as herbal supplement. Eurycomanone content recommended.",
    warningsRequired: "Not for pregnant/nursing women. May interact with hormone medications.",
    riskLevel: "Medium",
    notes: "Popular in Southeast Asia but limited regulatory history in India and West."
  },
  {
    ingredient: "Postbiotics",
    fssai: "⚠️ Emerging category, limited regulation",
    fda: "⚠️ Category still being defined",
    efsa: "⚠️ Under evaluation",
    maxDosage: "Varies by specific postbiotic strain",
    labellingRequirement: "Must specify postbiotic type and source organism.",
    warningsRequired: "Emerging category. Limited long-term safety data available.",
    riskLevel: "Medium",
    notes: "New category — regulatory frameworks are still catching up globally."
  },
  {
    ingredient: "Red Light Therapy Device",
    fssai: "N/A (device)",
    fda: "✅ Class II Medical Device (US)",
    efsa: "N/A (device)",
    maxDosage: "N/A — usage time based (10-20 min/session)",
    labellingRequirement: "⚠️ BIS certification required in India. Electrical safety standards mandatory.",
    warningsRequired: "⚠️ BIS certification required. Eye protection recommended. Not for use on open wounds.",
    riskLevel: "Medium",
    notes: "Requires BIS certification for sale in India. Import duties apply. Electrical safety testing mandatory."
  },
  {
    ingredient: "Vitamin D3",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "1000-4000 IU/day",
    labellingRequirement: "RDA percentage required. Source (cholecalciferol) must be declared.",
    warningsRequired: "Do not exceed recommended dose. Consult physician if on calcium supplements.",
    riskLevel: "Low",
    notes: "Essential vitamin with clear regulatory status worldwide."
  },
  {
    ingredient: "Zinc",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "15-30mg/day (elemental zinc)",
    labellingRequirement: "Must declare zinc form and elemental zinc content. RDA percentage.",
    warningsRequired: "Do not exceed 40mg/day. May cause nausea on empty stomach.",
    riskLevel: "Low",
    notes: "Essential mineral with well-established regulatory status."
  },
  {
    ingredient: "Omega-3",
    fssai: "✅ Approved",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "1-3g/day (EPA+DHA combined)",
    labellingRequirement: "Must declare EPA and DHA content separately. Source (fish/algae).",
    warningsRequired: "Fish allergen warning. May interact with blood thinning medication.",
    riskLevel: "Low",
    notes: "One of the most established supplement categories globally."
  },
  {
    ingredient: "Melatonin",
    fssai: "⚠️ Restricted — classified as drug in India",
    fda: "✅ Available as supplement (US)",
    efsa: "✅ Approved (limited dose)",
    maxDosage: "❌ Not available as supplement in India — prescription only",
    labellingRequirement: "❌ Cannot be sold as dietary supplement in India. Requires drug license.",
    warningsRequired: "🚨 REGULATORY ALERT: Melatonin is classified as a Schedule H drug in India. Cannot be sold OTC as a supplement.",
    riskLevel: "High",
    notes: "🚨 BANNED as OTC supplement in India. Requires prescription. Do NOT launch as a supplement product."
  },
  {
    ingredient: "Curcumin",
    fssai: "✅ Approved (Ayurvedic)",
    fda: "✅ GRAS",
    efsa: "✅ Approved",
    maxDosage: "500-2000mg/day (with piperine for absorption)",
    labellingRequirement: "Must declare curcuminoid percentage. Piperine addition must be disclosed.",
    warningsRequired: "May interact with blood thinning medication. Not recommended before surgery.",
    riskLevel: "Low",
    notes: "India's heritage ingredient. Strong regulatory status and consumer familiarity."
  },
];

export const getRiskColor = (risk: string): string => {
  switch (risk) {
    case "Low": return "text-green-400 bg-green-500/20 border-green-500/30";
    case "Medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    case "High": return "text-red-400 bg-red-500/20 border-red-500/30";
    default: return "text-muted-foreground bg-muted border-border";
  }
};
