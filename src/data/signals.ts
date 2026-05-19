export interface SignalCategory {
  name: string;
  keywords: number;
  hottest: string;
  temperature: "🔥 Hot" | "🌡️ Warming" | "❄️ Cool";
  tempColor: string;
}

export const signalCategories: SignalCategory[] = [
  { name: "Adaptogens", keywords: 15, hottest: "Ashwagandha gummies", temperature: "🔥 Hot", tempColor: "text-red-400" },
  { name: "Nootropics", keywords: 15, hottest: "Lion's Mane mushroom", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
  { name: "Gut Health", keywords: 15, hottest: "Postbiotic supplement", temperature: "🔥 Hot", tempColor: "text-red-400" },
  { name: "Minerals & Vitamins", keywords: 12, hottest: "Magnesium Glycinate", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
  { name: "Ingestible Beauty", keywords: 12, hottest: "Marine Collagen", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
  { name: "Hair Health", keywords: 12, hottest: "Rosemary Oil", temperature: "🔥 Hot", tempColor: "text-red-400" },
  { name: "Women's Health", keywords: 15, hottest: "PCOS Inositol", temperature: "🔥 Hot", tempColor: "text-red-400" },
  { name: "Men's Health", keywords: 10, hottest: "Tongkat Ali", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
  { name: "Recovery & Performance", keywords: 12, hottest: "Creatine for Women", temperature: "🔥 Hot", tempColor: "text-red-400" },
  { name: "Functional Beverages", keywords: 12, hottest: "Mushroom Coffee", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
  { name: "Mental Wellness", keywords: 10, hottest: "Magnesium for Sleep", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
  { name: "Longevity", keywords: 10, hottest: "NMN Supplement", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
  { name: "Problem Keywords", keywords: 13, hottest: "Brain Fog India", temperature: "🔥 Hot", tempColor: "text-red-400" },
  { name: "Ayurveda Modernized", keywords: 10, hottest: "Shilajit Resin", temperature: "🌡️ Warming", tempColor: "text-amber-400" },
];

export interface KeywordSignal {
  keyword: string;
  category: string;
  growth: string;
  volume: string;
}

export const allKeywords: KeywordSignal[] = [
  // Adaptogens
  { keyword: "Ashwagandha gummies", category: "Adaptogens", growth: "+320%", volume: "High" },
  { keyword: "Ashwagandha KSM-66", category: "Adaptogens", growth: "+280%", volume: "High" },
  { keyword: "Rhodiola supplement India", category: "Adaptogens", growth: "+180%", volume: "Medium" },
  { keyword: "Adaptogen latte", category: "Adaptogens", growth: "+145%", volume: "Low" },
  { keyword: "Adaptogen supplement India", category: "Adaptogens", growth: "+210%", volume: "Medium" },
  { keyword: "Holy basil supplement", category: "Adaptogens", growth: "+120%", volume: "Medium" },
  { keyword: "Shatavari supplement", category: "Adaptogens", growth: "+190%", volume: "Medium" },
  { keyword: "Reishi mushroom India", category: "Adaptogens", growth: "+240%", volume: "Low" },
  { keyword: "Cordyceps supplement India", category: "Adaptogens", growth: "+260%", volume: "Low" },
  { keyword: "Stress relief supplement natural", category: "Adaptogens", growth: "+175%", volume: "High" },
  // Nootropics
  { keyword: "Lion's Mane mushroom supplement", category: "Nootropics", growth: "+340%", volume: "Medium" },
  { keyword: "Nootropic supplement India", category: "Nootropics", growth: "+280%", volume: "Medium" },
  { keyword: "Brain supplement India", category: "Nootropics", growth: "+220%", volume: "High" },
  { keyword: "Focus supplement natural", category: "Nootropics", growth: "+190%", volume: "Medium" },
  { keyword: "Alpha GPC India", category: "Nootropics", growth: "+310%", volume: "Low" },
  { keyword: "L-theanine supplement", category: "Nootropics", growth: "+200%", volume: "Medium" },
  // Gut Health
  { keyword: "Postbiotic supplement", category: "Gut Health", growth: "+310%", volume: "Low" },
  { keyword: "Gut health supplement India", category: "Gut Health", growth: "+220%", volume: "High" },
  { keyword: "Probiotic supplement best India", category: "Gut Health", growth: "+180%", volume: "High" },
  { keyword: "Leaky gut supplement India", category: "Gut Health", growth: "+250%", volume: "Medium" },
  { keyword: "Digestive enzyme supplement", category: "Gut Health", growth: "+160%", volume: "High" },
  { keyword: "Colostrum supplement India", category: "Gut Health", growth: "+155%", volume: "Low" },
  // Women's Health
  { keyword: "PCOS supplement natural India", category: "Women's Health", growth: "+290%", volume: "High" },
  { keyword: "Inositol PCOS India", category: "Women's Health", growth: "+350%", volume: "Medium" },
  { keyword: "Cycle syncing supplement", category: "Women's Health", growth: "+280%", volume: "Low" },
  { keyword: "Period pain supplement natural", category: "Women's Health", growth: "+200%", volume: "High" },
  { keyword: "Iron supplement for women India", category: "Women's Health", growth: "+150%", volume: "High" },
  { keyword: "Fertility supplement India", category: "Women's Health", growth: "+210%", volume: "Medium" },
  { keyword: "Hormonal balance supplement", category: "Women's Health", growth: "+240%", volume: "Medium" },
  // Men's Health
  { keyword: "Tongkat Ali supplement India", category: "Men's Health", growth: "+260%", volume: "Low" },
  { keyword: "Testosterone booster natural", category: "Men's Health", growth: "+190%", volume: "High" },
  { keyword: "Shilajit for men", category: "Men's Health", growth: "+150%", volume: "High" },
  // Longevity
  { keyword: "NMN supplement India", category: "Longevity", growth: "+520%", volume: "Medium" },
  { keyword: "NAD supplement India", category: "Longevity", growth: "+380%", volume: "Low" },
  { keyword: "Anti aging supplement India", category: "Longevity", growth: "+240%", volume: "Medium" },
  { keyword: "Resveratrol supplement India", category: "Longevity", growth: "+200%", volume: "Low" },
  // Recovery
  { keyword: "Creatine for women", category: "Recovery & Performance", growth: "+410%", volume: "Medium" },
  { keyword: "Creatine monohydrate India", category: "Recovery & Performance", growth: "+180%", volume: "High" },
  { keyword: "Electrolyte supplement India", category: "Recovery & Performance", growth: "+160%", volume: "High" },
  { keyword: "Recovery drink post workout", category: "Recovery & Performance", growth: "+140%", volume: "High" },
  // Functional Beverages
  { keyword: "Mushroom coffee India", category: "Functional Beverages", growth: "+190%", volume: "Low" },
  { keyword: "Protein coffee India", category: "Functional Beverages", growth: "+220%", volume: "Medium" },
  { keyword: "Turmeric latte mix", category: "Functional Beverages", growth: "+130%", volume: "Medium" },
  // Skincare
  { keyword: "Skin cycling kit India", category: "Skincare", growth: "+320%", volume: "Medium" },
  { keyword: "Retinol serum India", category: "Skincare", growth: "+200%", volume: "High" },
  // Metabolic Health
  { keyword: "Berberine supplement India", category: "Metabolic Health", growth: "+160%", volume: "Medium" },
  { keyword: "Blood sugar supplement natural", category: "Metabolic Health", growth: "+180%", volume: "Medium" },
  // Problem Keywords
  { keyword: "Brain fog India", category: "Problem Keywords", growth: "+380%", volume: "Medium" },
  { keyword: "Gut issues India", category: "Problem Keywords", growth: "+250%", volume: "High" },
  { keyword: "Hair fall supplement India", category: "Problem Keywords", growth: "+190%", volume: "High" },
  { keyword: "Stress supplement India", category: "Problem Keywords", growth: "+220%", volume: "High" },
  { keyword: "Fatigue supplement India", category: "Problem Keywords", growth: "+280%", volume: "Medium" },
  { keyword: "Bloating remedy India", category: "Problem Keywords", growth: "+200%", volume: "Medium" },
  // Beauty
  { keyword: "Marine collagen India", category: "Ingestible Beauty", growth: "+280%", volume: "Medium" },
  { keyword: "Biotin supplement India", category: "Ingestible Beauty", growth: "+160%", volume: "High" },
  { keyword: "Glutathione supplement India", category: "Ingestible Beauty", growth: "+300%", volume: "Medium" },
  // Hair
  { keyword: "Rosemary oil hair growth", category: "Hair Health", growth: "+180%", volume: "Very High" },
  { keyword: "Biotin for hair India", category: "Hair Health", growth: "+150%", volume: "High" },
  { keyword: "Saw palmetto hair loss", category: "Hair Health", growth: "+210%", volume: "Medium" },
  // Sleep
  { keyword: "Magnesium for sleep India", category: "Mental Wellness", growth: "+220%", volume: "Medium" },
  { keyword: "Sleep supplement natural India", category: "Mental Wellness", growth: "+190%", volume: "High" },
  { keyword: "Anxiety supplement natural", category: "Mental Wellness", growth: "+260%", volume: "Medium" },
  // Ayurveda
  { keyword: "Shilajit resin India", category: "Ayurveda Modernized", growth: "+150%", volume: "High" },
  { keyword: "Triphala supplement modern", category: "Ayurveda Modernized", growth: "+120%", volume: "Medium" },
  { keyword: "Ayurvedic protein India", category: "Ayurveda Modernized", growth: "+180%", volume: "Low" },
  // Devices
  { keyword: "Red light therapy device India", category: "Devices", growth: "+380%", volume: "Medium" },
  { keyword: "Massage gun India", category: "Devices", growth: "+140%", volume: "High" },
  { keyword: "Blue light glasses India", category: "Devices", growth: "+160%", volume: "High" },
  // Minerals
  { keyword: "Magnesium glycinate India", category: "Minerals & Vitamins", growth: "+200%", volume: "Medium" },
  { keyword: "Vitamin D3 supplement India", category: "Minerals & Vitamins", growth: "+150%", volume: "High" },
  { keyword: "Zinc supplement India", category: "Minerals & Vitamins", growth: "+130%", volume: "High" },
  { keyword: "Omega 3 supplement India", category: "Minerals & Vitamins", growth: "+140%", volume: "High" },
];
