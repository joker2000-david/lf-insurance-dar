export const medicalPlans = [
  { key: "AFYA BASIC", limit: "TZS 20,000,000", region: "Tanzania" },
  { key: "AFYA PLUS", limit: "TZS 30,000,000", region: "Tanzania + India referral" },
  { key: "AFYA SUPA", limit: "TZS 50,000,000", region: "Tanzania + India referral" },
  { key: "AFYA EXTREME", limit: "TZS 100,000,000", region: "Tanzania + India referral" },
] as const;

export const ageBands = ["0-17", "18-24", "25-39", "40-49", "50-54", "55-59"] as const;

// Annual premium rates per member (TZS) — Strategis Health Insurance 2025/2026
export const premiumRates: Record<string, Record<string, number>> = {
  "0-17":  { "AFYA BASIC": 800415,  "AFYA PLUS": 920477,  "AFYA SUPA": 1081561, "AFYA EXTREME": 1243795 },
  "18-24": { "AFYA BASIC": 920588,  "AFYA PLUS": 1058676, "AFYA SUPA": 1258766, "AFYA EXTREME": 1447581 },
  "25-39": { "AFYA BASIC": 1058400, "AFYA PLUS": 1270080, "AFYA SUPA": 1485994, "AFYA EXTREME": 1708893 },
  "40-49": { "AFYA BASIC": 1216609, "AFYA PLUS": 1484263, "AFYA SUPA": 1781116, "AFYA EXTREME": 2048283 },
  "50-54": { "AFYA BASIC": 1460813, "AFYA PLUS": 1781116, "AFYA SUPA": 2092811, "AFYA EXTREME": 2406733 },
  "55-59": { "AFYA BASIC": 1752975, "AFYA PLUS": 2138630, "AFYA SUPA": 2459424, "AFYA EXTREME": 2828338 },
};

export const motorCoverTypes = [
  "Comprehensive — Private Car",
  "TPFT — Private Car",
  "TPO — Private Car",
  "Comprehensive — Motorcycle / Bodaboda",
  "Comprehensive — Commercial Vehicle",
  "TPO — Commercial Vehicle",
] as const;

export const otherInsuranceTypes = [
  "Fire & Perils",
  "Marine / Cargo",
  "Travel",
  "Liability",
  "Engineering / Contractors All Risk",
  "Personal Accident",
  "Personal Life",
  "Family / Education",
  "Other",
] as const;
