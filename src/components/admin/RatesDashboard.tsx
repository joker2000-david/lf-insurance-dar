import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  medicalPlans as defaultPlans,
  ageBands as defaultBands,
  premiumRates as defaultPremiums,
  motorRates as defaultMotor,
} from "@/data/medical-plans";

type Plan = { key: string; limit: string; region: string };
type MotorRates = {
  comprehensive: Record<string, { rate: number; minPremium: number }>;
  tpft: Record<string, number>;
  tpo: Record<string, number>;
};

interface Props {
  passcode: string;
  onSaved?: () => void;
}

export default function RatesDashboard({ passcode, onSaved }: Props) {
  const [plans, setPlans] = useState<Plan[]>(defaultPlans as any);
  const [bands, setBands] = useState<string[]>(defaultBands as any);
  const [premiums, setPremiums] = useState<Record<string, Record<string, number>>>(defaultPremiums);
  const [motor, setMotor] = useState<MotorRates>(defaultMotor as any);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("calculator_config").select("data").eq("id", "current").maybeSingle()
      .then(({ data }) => {
        const cfg: any = data?.data ?? {};
        if (cfg.medicalPlans) setPlans(cfg.medicalPlans);
        if (cfg.ageBands) setBands(cfg.ageBands);
        if (cfg.premiumRates) setPremiums(cfg.premiumRates);
        if (cfg.motorRates) setMotor(cfg.motorRates);
        setLoading(false);
      });
  }, []);

  function updatePremium(band: string, planKey: string, val: string) {
    const n = Number(val.replace(/[^\d.]/g, ""));
    setPremiums((p) => ({ ...p, [band]: { ...(p[band] ?? {}), [planKey]: Number.isFinite(n) ? n : 0 } }));
  }

  function addPlan() {
    const key = `NEW PLAN ${plans.length + 1}`;
    setPlans((p) => [...p, { key, limit: "TZS 0", region: "Tanzania" }]);
  }
  function removePlan(idx: number) {
    const removed = plans[idx].key;
    setPlans((p) => p.filter((_, i) => i !== idx));
    setPremiums((pr) => {
      const copy: typeof pr = {};
      for (const b of Object.keys(pr)) {
        const { [removed]: _, ...rest } = pr[b];
        copy[b] = rest;
      }
      return copy;
    });
  }

  function addBand() {
    const b = `NEW-${bands.length + 1}`;
    setBands((arr) => [...arr, b]);
    setPremiums((p) => ({ ...p, [b]: {} }));
  }
  function removeBand(band: string) {
    setBands((arr) => arr.filter((b) => b !== band));
    setPremiums((p) => { const { [band]: _, ...rest } = p; return rest; });
  }

  async function save() {
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-update-rates", {
      body: {
        passcode,
        action: "replace",
        data: { medicalPlans: plans, ageBands: bands, premiumRates: premiums, motorRates: motor },
      },
    });
    setSaving(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error ?? error?.message ?? "Save failed");
      return;
    }
    toast.success("Rates saved — live on the calculator");
    onSaved?.();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading current rates…</p>;

  return (
    <div className="space-y-6">
      {/* Medical plans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medical plans</CardTitle>
          <Button size="sm" variant="outline" onClick={addPlan}><Plus className="h-4 w-4" /> Add plan</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {plans.map((p, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
              <div><Label className="text-xs">Plan key</Label>
                <Input value={p.key} onChange={(e) => setPlans((arr) => arr.map((x, j) => j === i ? { ...x, key: e.target.value } : x))} /></div>
              <div><Label className="text-xs">Annual limit</Label>
                <Input value={p.limit} onChange={(e) => setPlans((arr) => arr.map((x, j) => j === i ? { ...x, limit: e.target.value } : x))} /></div>
              <div><Label className="text-xs">Region</Label>
                <Input value={p.region} onChange={(e) => setPlans((arr) => arr.map((x, j) => j === i ? { ...x, region: e.target.value } : x))} /></div>
              <Button size="icon" variant="ghost" onClick={() => removePlan(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Premium grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Annual premiums (TZS)</CardTitle>
          <Button size="sm" variant="outline" onClick={addBand}><Plus className="h-4 w-4" /> Add age band</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Age band</th>
                {plans.map((p) => <th key={p.key} className="text-left p-2">{p.key}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b) => (
                <tr key={b} className="border-b">
                  <td className="p-2 font-medium">
                    <Input value={b} onChange={(e) => {
                      const nv = e.target.value;
                      setBands((arr) => arr.map((x) => x === b ? nv : x));
                      setPremiums((p) => { const { [b]: row, ...rest } = p; return { ...rest, [nv]: row ?? {} }; });
                    }} className="h-8 w-24" />
                  </td>
                  {plans.map((p) => (
                    <td key={p.key} className="p-2">
                      <Input
                        type="number"
                        value={premiums[b]?.[p.key] ?? 0}
                        onChange={(e) => updatePremium(b, p.key, e.target.value)}
                        className="h-8 w-32"
                      />
                    </td>
                  ))}
                  <td><Button size="icon" variant="ghost" onClick={() => removeBand(b)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Motor rates */}
      <Card>
        <CardHeader><CardTitle>Motor rates</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Comprehensive (rate = % of vehicle value)</h4>
            <div className="grid md:grid-cols-3 gap-3">
              {(["private", "commercial", "motorcycle"] as const).map((use) => (
                <div key={use} className="rounded-md border p-3 space-y-2">
                  <p className="text-sm font-medium capitalize">{use}</p>
                  <div>
                    <Label className="text-xs">Rate (%)</Label>
                    <Input type="number" step="0.1"
                      value={((motor.comprehensive?.[use]?.rate ?? 0) * 100).toFixed(2)}
                      onChange={(e) => setMotor((m) => ({ ...m, comprehensive: { ...m.comprehensive, [use]: { ...(m.comprehensive?.[use] ?? { minPremium: 0 }), rate: Number(e.target.value) / 100 } } }))} />
                  </div>
                  <div>
                    <Label className="text-xs">Minimum premium (TZS)</Label>
                    <Input type="number"
                      value={motor.comprehensive?.[use]?.minPremium ?? 0}
                      onChange={(e) => setMotor((m) => ({ ...m, comprehensive: { ...m.comprehensive, [use]: { ...(m.comprehensive?.[use] ?? { rate: 0 }), minPremium: Number(e.target.value) } } }))} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(["tpft", "tpo"] as const).map((cover) => (
            <div key={cover}>
              <h4 className="font-semibold mb-2 uppercase">{cover} (flat annual premium TZS)</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {(["private", "commercial", "motorcycle"] as const).map((use) => (
                  <div key={use}>
                    <Label className="text-xs capitalize">{use}</Label>
                    <Input type="number" value={motor[cover]?.[use] ?? 0}
                      onChange={(e) => setMotor((m) => ({ ...m, [cover]: { ...m[cover], [use]: Number(e.target.value) } }))} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" disabled={saving} onClick={save}
          className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save all changes"}
        </Button>
      </div>
    </div>
  );
}
