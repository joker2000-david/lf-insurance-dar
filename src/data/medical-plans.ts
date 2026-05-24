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

// ---------- Motor category logic (TIRA-aligned indicative rates) ----------
// Annual premium rate as a percentage of the sum insured for comprehensive cover.
export const motorRates = {
  comprehensive: {
    private: { rate: 0.04, minPremium: 350_000 },           // 4% of value
    commercial: { rate: 0.05, minPremium: 600_000 },        // 5% of value
    motorcycle: { rate: 0.06, minPremium: 200_000 },        // 6% of value
  },
  tpft: { private: 250_000, commercial: 450_000, motorcycle: 150_000 },
  tpo:  { private: 150_000, commercial: 300_000, motorcycle: 80_000 },
} as const;

export type VehicleUse = "private" | "commercial" | "motorcycle";
export type CoverLevel = "comprehensive" | "tpft" | "tpo";

export function recommendMotorCategory(
  use: VehicleUse,
  cover: CoverLevel,
  sumInsured: number,
  yearOfManufacture?: number
): { category: string; annualPremium: number; notes: string[] } {
  const notes: string[] = [];
  const currentYear = new Date().getFullYear();
  const age = yearOfManufacture ? currentYear - yearOfManufacture : 0;
  let category = "";
  let premium = 0;

  if (cover === "comprehensive") {
    const cfg = motorRates.comprehensive[use];
    premium = Math.max(Math.round(sumInsured * cfg.rate), cfg.minPremium);
    if (age >= 10) {
      premium = Math.round(premium * 1.1);
      notes.push("10% loading applied for vehicles older than 10 years.");
    }
    category =
      use === "motorcycle"
        ? "Comprehensive — Motorcycle / Bodaboda"
        : use === "commercial"
        ? "Comprehensive — Commercial Vehicle"
        : sumInsured >= 80_000_000
        ? "Comprehensive Premium — Private Car"
        : sumInsured >= 35_000_000
        ? "Comprehensive Standard — Private Car"
        : "Comprehensive Essential — Private Car";
  } else if (cover === "tpft") {
    premium = motorRates.tpft[use];
    category = `Third Party Fire & Theft — ${labelForUse(use)}`;
  } else {
    premium = motorRates.tpo[use];
    category = `Third Party Only — ${labelForUse(use)}`;
  }

  notes.push("Indicative only. Final premium confirmed by underwriter.");
  return { category, annualPremium: premium, notes };
}

function labelForUse(u: VehicleUse) {
  return u === "private" ? "Private Car" : u === "commercial" ? "Commercial Vehicle" : "Motorcycle / Bodaboda";
}

// ---------- Family category logic ----------
export function ageToBand(age: number): typeof ageBands[number] {
  if (age <= 17) return "0-17";
  if (age <= 24) return "18-24";
  if (age <= 39) return "25-39";
  if (age <= 49) return "40-49";
  if (age <= 54) return "50-54";
  return "55-59";
}

export interface FamilyMember { role: string; age: number }

export function computeFamilyPremiums(members: FamilyMember[]) {
  const result: Record<string, number> = {};
  for (const plan of medicalPlans) {
    result[plan.key] = members.reduce((sum, m) => {
      const band = ageToBand(m.age);
      return sum + (premiumRates[band]?.[plan.key] ?? 0);
    }, 0);
  }
  return result;
}

export function recommendFamilyCategory(
  members: FamilyMember[],
  budgetTzs?: number
): { plan: string; annualPremium: number; reasoning: string } {
  const totals = computeFamilyPremiums(members);
  const size = members.length;

  // If a budget is provided, pick the richest plan that fits it.
  if (budgetTzs && budgetTzs > 0) {
    const ordered = [...medicalPlans].reverse(); // EXTREME → BASIC
    for (const p of ordered) {
      if (totals[p.key] <= budgetTzs) {
        return {
          plan: p.key,
          annualPremium: totals[p.key],
          reasoning: `Best plan that fits your annual budget of TZS ${budgetTzs.toLocaleString()}.`,
        };
      }
    }
    return {
      plan: "AFYA BASIC",
      annualPremium: totals["AFYA BASIC"],
      reasoning: `Your budget is below the smallest family premium. AFYA BASIC is the most affordable starting point.`,
    };
  }

  // No budget: recommend by family size
  let plan: string;
  let reasoning: string;
  if (size <= 2) {
    plan = "AFYA PLUS";
    reasoning = "Couple-sized cover — AFYA PLUS balances cost with India referral access.";
  } else if (size <= 4) {
    plan = "AFYA SUPA";
    reasoning = "For families up to 4, AFYA SUPA offers a higher TZS 50M limit with broader benefits.";
  } else {
    plan = "AFYA EXTREME";
    reasoning = "For larger families, AFYA EXTREME provides the highest TZS 100M annual limit.";
  }
  return { plan, annualPremium: totals[plan], reasoning };
}
