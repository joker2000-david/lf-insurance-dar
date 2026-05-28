
CREATE TABLE public.calculator_config (
  id text PRIMARY KEY DEFAULT 'current',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.calculator_config TO anon, authenticated;
GRANT ALL ON public.calculator_config TO service_role;

ALTER TABLE public.calculator_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read calculator config"
ON public.calculator_config FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.calculator_config (id, data) VALUES (
  'current',
  '{
    "medicalPlans": [
      {"key":"AFYA BASIC","limit":"TZS 20,000,000","region":"Tanzania"},
      {"key":"AFYA PLUS","limit":"TZS 30,000,000","region":"Tanzania + India referral"},
      {"key":"AFYA SUPA","limit":"TZS 50,000,000","region":"Tanzania + India referral"},
      {"key":"AFYA EXTREME","limit":"TZS 100,000,000","region":"Tanzania + India referral"}
    ],
    "ageBands": ["0-17","18-24","25-39","40-49","50-54","55-59"],
    "premiumRates": {
      "0-17":  {"AFYA BASIC":800415,"AFYA PLUS":920477,"AFYA SUPA":1081561,"AFYA EXTREME":1243795},
      "18-24": {"AFYA BASIC":920588,"AFYA PLUS":1058676,"AFYA SUPA":1258766,"AFYA EXTREME":1447581},
      "25-39": {"AFYA BASIC":1058400,"AFYA PLUS":1270080,"AFYA SUPA":1485994,"AFYA EXTREME":1708893},
      "40-49": {"AFYA BASIC":1216609,"AFYA PLUS":1484263,"AFYA SUPA":1781116,"AFYA EXTREME":2048283},
      "50-54": {"AFYA BASIC":1460813,"AFYA PLUS":1781116,"AFYA SUPA":2092811,"AFYA EXTREME":2406733},
      "55-59": {"AFYA BASIC":1752975,"AFYA PLUS":2138630,"AFYA SUPA":2459424,"AFYA EXTREME":2828338}
    },
    "motorRates": {
      "comprehensive": {
        "private":    {"rate":0.04,"minPremium":350000},
        "commercial": {"rate":0.05,"minPremium":600000},
        "motorcycle": {"rate":0.06,"minPremium":200000}
      },
      "tpft": {"private":250000,"commercial":450000,"motorcycle":150000},
      "tpo":  {"private":150000,"commercial":300000,"motorcycle":80000}
    }
  }'::jsonb
);
