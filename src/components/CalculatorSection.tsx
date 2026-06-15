import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calculator as CalcIcon, Car, Heart, MessageCircle, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { useCalculatorConfig, type CalculatorConfig } from "@/hooks/useCalculatorConfig";
import { vehicleClasses, computeMotorPremium, type CoverLevel, type VehicleClassKey } from "@/data/motor-rates";


const fmtTZS = (n: number) => "TZS " + Math.round(n).toLocaleString("en-US");

function computeBandTotals(cfg: CalculatorConfig, lives: Record<string, number>) {
  const result: Record<string, number> = {};
  for (const plan of cfg.medicalPlans) {
    result[plan.key] = cfg.ageBands.reduce(
      (sum, band) => sum + (lives[band] || 0) * (cfg.premiumRates[band]?.[plan.key] ?? 0),
      0,
    );
  }
  return result;
}


const groupedClasses = vehicleClasses.reduce((acc, c) => {
  (acc[c.group] ||= []).push(c);
  return acc;
}, {} as Record<string, typeof vehicleClasses>);

const MotorCalculator = () => {
  const [classKey, setClassKey] = useState<VehicleClassKey>("private_car");
  const cls = vehicleClasses.find((c) => c.key === classKey)!;
  const [cover, setCover] = useState<CoverLevel>("comprehensive");
  const effectiveCover: CoverLevel = cls.covers.includes(cover) ? cover : cls.covers[0];
  const [sumInsured, setSumInsured] = useState<number>(25_000_000);
  const [year, setYear] = useState<number>(new Date().getFullYear() - 3);
  const [hasClaimRecord, setHasClaimRecord] = useState(false);
  const [seats, setSeats] = useState<number>(14);
  const [tonnage, setTonnage] = useState<number>(3);
  const [bodaboda, setBodaboda] = useState(false);
  const [passenger3w, setPassenger3w] = useState(false);

  const result = useMemo(
    () => computeMotorPremium({
      vehicleClass: classKey,
      cover: effectiveCover,
      sumInsured,
      hasClaimRecord,
      seats,
      tonnage,
      carriesPassengerMotorcycle: bodaboda,
      carriesPassengerThreeWheeler: passenger3w,
      yearOfManufacture: year,
    }),
    [classKey, effectiveCover, sumInsured, hasClaimRecord, seats, tonnage, bodaboda, passenger3w, year]
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3 shadow-lg border-accent/20">
        <CardHeader><CardTitle className="flex items-center gap-2"><Car className="h-5 w-5 text-accent" /> Vehicle Details</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Vehicle Class</Label>
              <Select value={classKey} onValueChange={(v) => setClassKey(v as VehicleClassKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedClasses).map(([group, items]) => (
                    <SelectGroup key={group}>
                      <SelectLabel>{group}</SelectLabel>
                      {items.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cover Level</Label>
              <Select value={effectiveCover} onValueChange={(v) => setCover(v as CoverLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cls.covers.includes("comprehensive") && <SelectItem value="comprehensive">Comprehensive</SelectItem>}
                  {cls.covers.includes("tpft") && <SelectItem value="tpft">Third Party, Fire & Theft</SelectItem>}
                  {cls.covers.includes("tpo") && <SelectItem value="tpo">Third Party Only</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {cls.needsSumInsured && effectiveCover !== "tpo" && (
              <div>
                <Label>Vehicle Value / Sum Insured (TZS)</Label>
                <Input type="number" min={0} step={500000} value={sumInsured} onChange={(e) => setSumInsured(Number(e.target.value) || 0)} />
              </div>
            )}

            {cls.needsSeats && (
              <div>
                <Label>Number of Seats</Label>
                <Input type="number" min={1} max={80} value={seats} onChange={(e) => setSeats(Number(e.target.value) || 0)} />
              </div>
            )}

            {cls.needsTonnage && effectiveCover === "tpo" && (
              <div>
                <Label>Tonnage</Label>
                <Input type="number" min={0} step={0.5} value={tonnage} onChange={(e) => setTonnage(Number(e.target.value) || 0)} />
              </div>
            )}

            <div>
              <Label>Year of Manufacture</Label>
              <Input type="number" min={1980} max={new Date().getFullYear()} value={year} onChange={(e) => setYear(Number(e.target.value) || new Date().getFullYear())} />
            </div>

            {effectiveCover === "comprehensive" && (
              <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
                <div>
                  <Label className="text-sm">Has prior claim record</Label>
                  <p className="text-xs text-muted-foreground">Applies a higher TIRA rate band.</p>
                </div>
                <Switch checked={hasClaimRecord} onCheckedChange={setHasClaimRecord} />
              </div>
            )}

            {cls.allowsBodaboda && (
              <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
                <div>
                  <Label className="text-sm">Carries passengers (Bodaboda)</Label>
                  <p className="text-xs text-muted-foreground">Adds TZS 15,000 surcharge.</p>
                </div>
                <Switch checked={bodaboda} onCheckedChange={setBodaboda} />
              </div>
            )}

            {cls.allowsPassengerThreeWheeler && (
              <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
                <div>
                  <Label className="text-sm">Carries passengers</Label>
                  <p className="text-xs text-muted-foreground">Adds TZS 45,000 surcharge.</p>
                </div>
                <Switch checked={passenger3w} onCheckedChange={setPassenger3w} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-xl border-accent bg-gradient-to-br from-primary to-primary-light text-primary-foreground h-fit">
        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Your Estimate</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Badge className="bg-accent text-accent-foreground">{result.category}</Badge>
          <div>
            <p className="text-sm opacity-80">Estimated Annual Premium</p>
            <p className="text-3xl font-bold text-accent">{fmtTZS(result.annualPremium)}</p>
            <p className="text-xs opacity-80 mt-1">Base: {fmtTZS(result.basePremium)} + VAT {fmtTZS(result.vatAmount)}</p>
          </div>
          <ul className="text-xs space-y-1 opacity-85">{result.notes.map((n, i) => <li key={i}>• {n}</li>)}</ul>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90"><MessageCircle className="h-4 w-4" /> Confirm via WhatsApp</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

const PLAN_LABELS: Record<string, string> = {
  BRONZE: "Afya Basic",
  SILVER: "Afya Plus",
  GOLD: "Afya Supa",
  PLATINUM: "Afya Extreme",
};

const FamilyCalculator = ({ cfg }: { cfg: CalculatorConfig }) => {
  const [lives, setLives] = useState<Record<string, number>>(() =>
    Object.fromEntries(cfg.ageBands.map((b) => [b, 0])),
  );
  const totals = useMemo(() => computeBandTotals(cfg, lives), [cfg, lives]);
  const totalLives = Object.values(lives).reduce((a, b) => a + b, 0);

  const setBand = (band: string, v: number) =>
    setLives((prev) => ({ ...prev, [band]: Math.max(0, Math.floor(v) || 0) }));

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3 shadow-lg border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-accent" /> Number of Lives per Age Band</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cfg.ageBands.map((band) => (
            <div key={band} className="grid grid-cols-12 gap-3 items-center">
              <Label className="col-span-4 text-sm">Age {band}</Label>
              <Input
                className="col-span-4"
                type="number"
                min={0}
                value={lives[band] ?? 0}
                onChange={(e) => setBand(band, Number(e.target.value))}
              />
              <p className="col-span-4 text-xs text-muted-foreground">
                {(cfg.premiumRates[band]?.[cfg.medicalPlans[0].key] ?? 0).toLocaleString()} – {(cfg.premiumRates[band]?.[cfg.medicalPlans[cfg.medicalPlans.length - 1].key] ?? 0).toLocaleString()} TZS / member
              </p>
            </div>
          ))}
          <div className="pt-2 text-sm text-muted-foreground">Total lives: <span className="font-semibold text-foreground">{totalLives}</span></div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-xl border-accent bg-gradient-to-br from-primary to-primary-light text-primary-foreground h-fit">
        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Annual Premium by Plan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {cfg.medicalPlans.map((p) => (
            <div key={p.key} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0">
              <div>
                <p className="text-sm font-semibold">{p.key}</p>
                <p className="text-[11px] opacity-75">{PLAN_LABELS[p.key] ?? p.key} · {p.limit}</p>
              </div>
              <p className="text-lg font-bold text-accent">{fmtTZS(totals[p.key] || 0)}</p>
            </div>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2"><MessageCircle className="h-4 w-4" /> Confirm via WhatsApp</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};


const RateTable = ({ cfg }: { cfg: CalculatorConfig }) => (
  <Card className="mt-10 shadow-md">
    <CardHeader><CardTitle>Medical Plans — Annual Rates per Member (TZS)</CardTitle></CardHeader>
    <CardContent className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left">Age Band</th>
            {cfg.medicalPlans.map((p) => <th key={p.key} className="p-2 text-right">{p.key}</th>)}
          </tr>
        </thead>
        <tbody>
          {cfg.ageBands.map((band) => (
            <tr key={band} className="border-b hover:bg-muted/30">
              <td className="p-2 font-medium">{band}</td>
              {cfg.medicalPlans.map((p) => (
                <td key={p.key} className="p-2 text-right">{(cfg.premiumRates[band]?.[p.key] ?? 0).toLocaleString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

const CalculatorSection = () => {
  const { config } = useCalculatorConfig();
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Insurance Calculator</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get an instant indicative premium based on TIRA Minimum Premium Rates (GN. No. 251 of 2018).
          </p>
        </div>
        <Tabs defaultValue="motor" className="w-full">
          <TabsList className="grid w-full md:w-96 mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="motor"><Car className="h-4 w-4 mr-2" /> Motor</TabsTrigger>
            <TabsTrigger value="family"><Heart className="h-4 w-4 mr-2" /> Medical</TabsTrigger>
          </TabsList>
          <TabsContent value="motor"><MotorCalculator /></TabsContent>
          <TabsContent value="family">
            <FamilyCalculator cfg={config} />
            <RateTable cfg={config} />
          </TabsContent>
        </Tabs>
        <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <CalcIcon className="h-5 w-5 mx-auto mb-2 text-accent" />
          Estimates are indicative per TIRA minimum rates. Final premiums confirmed by the underwriter.
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
