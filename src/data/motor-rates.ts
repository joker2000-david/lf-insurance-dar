// TIRA Minimum Premium Rates (GN. No. 251 of 2018) — Motor Insurance
// Source: The Insurance (Minimum Premium Rates) Order, 2018
// All premiums are subject to 18% VAT.

export const MOTOR_VAT_RATE = 0.18;

export type CoverLevel = "comprehensive" | "tpft" | "tpo";

export type VehicleClassKey =
  | "private_car"
  | "motorcycle"
  | "three_wheeler"
  | "commercial_own_goods"
  | "commercial_general_cartage"
  | "tanker_steel"
  | "tanker_aluminium"
  | "tanker_old"
  | "taxi"
  | "bus_daladala"
  | "bus_upcountry"
  | "bus_private"
  | "bus_school"
  | "special_type";

export interface VehicleClass {
  key: VehicleClassKey;
  label: string;
  group: "Private" | "Motorcycle / 3-Wheeler" | "Commercial Goods" | "Oil Tankers" | "Passenger Carrying" | "Special Type";
  covers: CoverLevel[];
  needsSumInsured: boolean;
  needsSeats?: boolean;
  needsTonnage?: boolean;
  allowsBodaboda?: boolean;
  allowsPassengerThreeWheeler?: boolean;
}

export const vehicleClasses: VehicleClass[] = [
  { key: "private_car", label: "Private Car", group: "Private", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true },
  { key: "motorcycle", label: "Motorcycle (2 wheels)", group: "Motorcycle / 3-Wheeler", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true, allowsBodaboda: true },
  { key: "three_wheeler", label: "Three Wheeler (Bajaji)", group: "Motorcycle / 3-Wheeler", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true, allowsPassengerThreeWheeler: true },
  { key: "commercial_own_goods", label: "Commercial — Own Goods", group: "Commercial Goods", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true, needsTonnage: true },
  { key: "commercial_general_cartage", label: "Commercial — General Cartage", group: "Commercial Goods", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true, needsTonnage: true },
  { key: "tanker_steel", label: "Oil Tanker — Steel (<10 yrs)", group: "Oil Tankers", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true },
  { key: "tanker_aluminium", label: "Oil Tanker — Aluminium (<10 yrs)", group: "Oil Tankers", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true },
  { key: "tanker_old", label: "Oil Tanker — Over 10 yrs", group: "Oil Tankers", covers: ["comprehensive", "tpft", "tpo"], needsSumInsured: true },
  { key: "taxi", label: "Public Taxi / Private Hire / Tour Operator", group: "Passenger Carrying", covers: ["comprehensive", "tpo"], needsSumInsured: true, needsSeats: true },
  { key: "bus_daladala", label: "Bus — Daladala (within city)", group: "Passenger Carrying", covers: ["comprehensive", "tpo"], needsSumInsured: true, needsSeats: true },
  { key: "bus_upcountry", label: "Bus — Up Country", group: "Passenger Carrying", covers: ["comprehensive", "tpo"], needsSumInsured: true, needsSeats: true },
  { key: "bus_private", label: "Bus — Private", group: "Passenger Carrying", covers: ["comprehensive", "tpo"], needsSumInsured: true, needsSeats: true },
  { key: "bus_school", label: "Bus — School", group: "Passenger Carrying", covers: ["comprehensive", "tpo"], needsSumInsured: true, needsSeats: true },
  { key: "special_type", label: "Special Type (Tractor, Forklift, Grader, Crane, Excavator)", group: "Special Type", covers: ["comprehensive", "tpo"], needsSumInsured: true },
];

export interface MotorQuoteInput {
  vehicleClass: VehicleClassKey;
  cover: CoverLevel;
  sumInsured?: number;
  hasClaimRecord?: boolean;
  seats?: number;
  tonnage?: number; // for commercial goods TPO
  carriesPassengerMotorcycle?: boolean; // bodaboda
  carriesPassengerThreeWheeler?: boolean;
  yearOfManufacture?: number;
}

export interface MotorQuoteResult {
  category: string;
  basePremium: number;
  vatAmount: number;
  annualPremium: number;
  notes: string[];
}

function tonnageTpo(tonnage: number) {
  if (tonnage <= 2) return 150_000;
  if (tonnage <= 5) return 200_000;
  if (tonnage <= 10) return 250_000;
  return 300_000;
}

export function computeMotorPremium(input: MotorQuoteInput): MotorQuoteResult {
  const notes: string[] = [];
  const cls = vehicleClasses.find((c) => c.key === input.vehicleClass)!;
  const sum = input.sumInsured ?? 0;
  const seats = input.seats ?? 0;
  const cr = !!input.hasClaimRecord;
  let base = 0;
  let label = `${cls.label} — ${coverLabel(input.cover)}`;

  switch (input.vehicleClass) {
    case "private_car": {
      if (input.cover === "comprehensive") {
        const rate = cr ? 0.04 : 0.035;
        base = Math.max(Math.round(sum * rate), 250_000);
        notes.push(`Rate: ${(rate * 100).toFixed(2)}% of sum insured (TIRA min TZS 250,000).`);
      } else if (input.cover === "tpft") {
        base = Math.max(Math.round(sum * 0.02), 250_000);
        notes.push("Rate: 2% of sum insured + TPP (TIRA min TZS 250,000).");
      } else {
        base = 100_000;
        notes.push("Flat TPO premium per TIRA: TZS 100,000.");
      }
      break;
    }
    case "motorcycle": {
      if (input.cover === "comprehensive") {
        const rate = cr ? 0.06 : 0.05;
        base = Math.max(Math.round(sum * rate), 125_000);
        if (input.carriesPassengerMotorcycle) { base += 15_000; notes.push("Bodaboda surcharge: +TZS 15,000."); }
        notes.push(`Rate: ${(rate * 100).toFixed(0)}% of sum insured (TIRA min TZS 125,000).`);
      } else if (input.cover === "tpft") {
        base = Math.max(Math.round(sum * 0.035), 100_000);
        notes.push("Rate: 3.5% of sum insured + TPP (TIRA min TZS 100,000).");
      } else {
        base = 50_000;
        if (input.carriesPassengerMotorcycle) { base += 15_000; notes.push("Bodaboda surcharge: +TZS 15,000."); }
        notes.push("Flat TPO premium per TIRA: TZS 50,000.");
      }
      break;
    }
    case "three_wheeler": {
      if (input.cover === "comprehensive") {
        const rate = cr ? 0.07 : 0.06;
        base = Math.max(Math.round(sum * rate), 125_000);
        if (input.carriesPassengerThreeWheeler) { base += 45_000; notes.push("Passenger 3-wheeler surcharge: +TZS 45,000."); }
        notes.push(`Rate: ${(rate * 100).toFixed(0)}% of sum insured (TIRA min TZS 125,000).`);
      } else if (input.cover === "tpft") {
        base = Math.max(Math.round(sum * 0.035), 100_000);
        notes.push("Rate: 3.5% of sum insured + TPP (TIRA min TZS 100,000).");
      } else {
        base = 75_000;
        if (input.carriesPassengerThreeWheeler) { base += 45_000; notes.push("Passenger 3-wheeler surcharge: +TZS 45,000."); }
        notes.push("Flat TPO premium per TIRA: TZS 75,000.");
      }
      break;
    }
    case "commercial_own_goods": {
      if (input.cover === "comprehensive") {
        const rate = cr ? 0.0475 : 0.0425;
        base = Math.max(Math.round(sum * rate), 500_000);
        notes.push(`Rate: ${(rate * 100).toFixed(2)}% of sum insured (TIRA min TZS 500,000).`);
      } else if (input.cover === "tpft") {
        base = Math.max(Math.round(sum * 0.025), 350_000);
        notes.push("Rate: 2.5% of sum insured + TPP (TIRA min TZS 350,000).");
      } else {
        base = tonnageTpo(input.tonnage ?? 0);
        notes.push(`Flat TPO by tonnage (${input.tonnage ?? 0}t): TZS ${base.toLocaleString()}.`);
      }
      break;
    }
    case "commercial_general_cartage": {
      if (input.cover === "comprehensive") {
        const rate = cr ? 0.0575 : 0.05;
        base = Math.max(Math.round(sum * rate), 500_000);
        notes.push(`Rate: ${(rate * 100).toFixed(2)}% of sum insured (TIRA min TZS 500,000).`);
      } else if (input.cover === "tpft") {
        base = Math.max(Math.round(sum * 0.03), 350_000);
        notes.push("Rate: 3% of sum insured + TPP (TIRA min TZS 350,000).");
      } else {
        base = tonnageTpo(input.tonnage ?? 0);
        notes.push(`Flat TPO by tonnage (${input.tonnage ?? 0}t): TZS ${base.toLocaleString()}.`);
      }
      break;
    }
    case "tanker_steel":
    case "tanker_aluminium":
    case "tanker_old": {
      const rate = input.vehicleClass === "tanker_steel" ? 0.06 : input.vehicleClass === "tanker_aluminium" ? 0.07 : 0.08;
      if (input.cover === "comprehensive") {
        base = Math.max(Math.round(sum * rate), 2_000_000);
        notes.push(`Rate: ${(rate * 100).toFixed(0)}% of sum insured (TIRA min TZS 2,000,000).`);
      } else if (input.cover === "tpft") {
        base = Math.max(Math.round(sum * 0.04), 1_500_000);
        notes.push("Rate: 4% of sum insured + TPP (TIRA min TZS 1,500,000).");
      } else {
        base = 750_000;
        notes.push("Flat TPO premium per TIRA: TZS 750,000.");
      }
      break;
    }
    case "taxi": {
      if (input.cover === "comprehensive") {
        const rate = cr ? 0.06 : 0.055;
        base = Math.max(Math.round(sum * rate) + 15_000 * seats, 500_000);
        notes.push(`Rate: ${(rate * 100).toFixed(2)}% of sum insured + TZS 15,000/seat (min TZS 500,000).`);
      } else {
        base = Math.max(15_000 * seats, 150_000);
        notes.push("TP: TZS 15,000/seat (TIRA min TZS 150,000).");
      }
      break;
    }
    case "bus_daladala": {
      if (input.cover === "comprehensive") {
        base = Math.round(sum * 0.08) + 15_000 * seats;
        notes.push("Rate: 8% of sum insured + TZS 15,000/seat.");
      } else {
        base = Math.max(15_000 * seats, 150_000);
        notes.push("TP: TZS 15,000/seat (TIRA min TZS 150,000).");
      }
      break;
    }
    case "bus_upcountry": {
      if (input.cover === "comprehensive") {
        base = Math.round(sum * 0.08) + 30_000 * seats;
        notes.push("Rate: 8% of sum insured + TZS 30,000/seat.");
      } else {
        base = Math.max(30_000 * seats, 150_000);
        notes.push("TP: TZS 30,000/seat (TIRA min TZS 150,000).");
      }
      break;
    }
    case "bus_private": {
      if (input.cover === "comprehensive") {
        base = Math.round(sum * 0.05) + 10_000 * seats;
        notes.push("Rate: 5% of sum insured + TZS 10,000/seat.");
      } else {
        base = Math.max(10_000 * seats, 150_000);
        notes.push("TP: TZS 10,000/seat (TIRA min TZS 150,000).");
      }
      break;
    }
    case "bus_school": {
      if (input.cover === "comprehensive") {
        base = Math.round(sum * 0.05) + 7_500 * seats;
        notes.push("Rate: 5% of sum insured + TZS 7,500/seat.");
      } else {
        base = Math.max(7_500 * seats, 150_000);
        notes.push("TP: TZS 7,500/seat (TIRA min TZS 150,000).");
      }
      break;
    }
    case "special_type": {
      if (input.cover === "comprehensive") {
        base = Math.max(Math.round(sum * 0.02), 250_000);
        notes.push("Rate: 2% of sum insured (TIRA min TZS 250,000).");
      } else {
        base = 100_000;
        notes.push("Flat TP premium per TIRA: TZS 100,000.");
      }
      break;
    }
  }

  // Age loading: 10% on Own Damage premium for vehicles older than 10 years (motorcycles and three-wheelers only — private cars exempt).
  if (input.yearOfManufacture && input.cover === "comprehensive") {
    const age = new Date().getFullYear() - input.yearOfManufacture;
    if (age >= 10 && (input.vehicleClass === "motorcycle" || input.vehicleClass === "three_wheeler")) {
      base = Math.round(base * 1.1);
      notes.push("10% loading applied (vehicle older than 10 years).");
    }
  }

  const vatAmount = Math.round(base * MOTOR_VAT_RATE);
  const annualPremium = base + vatAmount;
  notes.push("Includes 18% VAT.");
  notes.push("Indicative only. Final premium confirmed by underwriter.");

  return { category: label, basePremium: base, vatAmount, annualPremium, notes };
}

function coverLabel(c: CoverLevel) {
  return c === "comprehensive" ? "Comprehensive" : c === "tpft" ? "Third Party, Fire & Theft" : "Third Party Only";
}
