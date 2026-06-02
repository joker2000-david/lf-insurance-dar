export const medicalPlans = [
  { key: "BRONZE", limit: "TZS 20,000,000", region: "Tanzania" },
  { key: "SILVER", limit: "TZS 50,000,000", region: "Tanzania + India referral" },
  { key: "GOLD", limit: "TZS 100,000,000", region: "Tanzania + India referral" },
] as const;

export const ageBands = ["0-17", "18-24", "25-39", "40-49", "50-54", "55-59"] as const;

// Annual premium rates per member (TZS)
export const premiumRates: Record<string, Record<string, number>> = {
  "0-17":  { BRONZE: 800415,  SILVER: 1081561, GOLD: 1243795 },
  "18-24": { BRONZE: 920588,  SILVER: 1258766, GOLD: 1447581 },
  "25-39": { BRONZE: 1058400, SILVER: 1485994, GOLD: 1708893 },
  "40-49": { BRONZE: 1216609, SILVER: 1781116, GOLD: 2048283 },
  "50-54": { BRONZE: 1460813, SILVER: 2092811, GOLD: 2406733 },
  "55-59": { BRONZE: 1752975, SILVER: 2459424, GOLD: 2828338 },
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

// VAT applied to motor premiums
export const MOTOR_VAT_RATE = 0.18;

// ---------- Motor category logic (TIRA-aligned indicative rates) ----------
export const motorRates = {
  comprehensive: {
    private: { rate: 0.04, minPremium: 350_000 },
    commercial: { rate: 0.05, minPremium: 600_000 },
    motorcycle: { rate: 0.06, minPremium: 200_000 },
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
        : "Comprehensive — Private Car";
  } else if (cover === "tpft") {
    premium = motorRates.tpft[use];
    category = `Third Party Fire & Theft — ${labelForUse(use)}`;
  } else {
    premium = motorRates.tpo[use];
    category = `Third Party Only — ${labelForUse(use)}`;
  }

  premium = Math.round(premium * (1 + MOTOR_VAT_RATE));
  notes.push("Includes 18% VAT.");
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
  members: FamilyMember[]
): { plan: string; annualPremium: number; reasoning: string } {
  const totals = computeFamilyPremiums(members);
  const size = members.length;
  let plan: string;
  let reasoning: string;
  if (size <= 2) {
    plan = "SILVER";
    reasoning = "Couple-sized cover — SILVER balances cost with India referral access.";
  } else if (size <= 4) {
    plan = "SILVER";
    reasoning = "For families up to 4, SILVER offers a TZS 50M limit with broader benefits.";
  } else {
    plan = "GOLD";
    reasoning = "For larger families, GOLD provides the highest TZS 100M annual limit.";
  }
  return { plan, annualPremium: totals[plan], reasoning };
}
