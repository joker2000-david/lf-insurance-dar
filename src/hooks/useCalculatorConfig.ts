import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  medicalPlans as defaultMedicalPlans,
  ageBands as defaultAgeBands,
  premiumRates as defaultPremiumRates,
  motorRates as defaultMotorRates,
} from "@/data/medical-plans";

export interface CalculatorConfig {
  medicalPlans: { key: string; limit: string; region: string }[];
  ageBands: string[];
  premiumRates: Record<string, Record<string, number>>;
  motorRates: {
    comprehensive: Record<string, { rate: number; minPremium: number }>;
    tpft: Record<string, number>;
    tpo: Record<string, number>;
  };
}

const DEFAULTS: CalculatorConfig = {
  medicalPlans: defaultMedicalPlans as any,
  ageBands: defaultAgeBands as any,
  premiumRates: defaultPremiumRates,
  motorRates: defaultMotorRates as any,
};

export function useCalculatorConfig() {
  const [config, setConfig] = useState<CalculatorConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("calculator_config")
      .select("data")
      .eq("id", "current")
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        // Only merge motorRates from DB; medical plan structure is always sourced
        // from code to avoid stale/legacy keys (e.g. "Option 1..4") leaking in.
        const remote = (data?.data as any) ?? {};
        setConfig({
          ...DEFAULTS,
          motorRates: remote.motorRates ?? DEFAULTS.motorRates,
        });
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { config, loading };
}
