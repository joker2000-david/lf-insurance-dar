import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator as CalcIcon, Car, Heart, Plus, Trash2, MessageCircle, Sparkles } from "lucide-react";
import {
  recommendMotorCategory, computeFamilyPremiums, recommendFamilyCategory,
  medicalPlans, ageBands, premiumRates,
  type VehicleUse, type CoverLevel, type FamilyMember,
} from "@/data/medical-plans";
import { WHATSAPP_URL } from "@/lib/whatsapp";

const fmtTZS = (n: number) => "TZS " + Math.round(n).toLocaleString("en-US");

const MotorCalculator = () => {
  const [use, setUse] = useState<VehicleUse>("private");
  const [cover, setCover] = useState<CoverLevel>("comprehensive");
  const [sumInsured, setSumInsured] = useState<number>(25_000_000);
  const [year, setYear] = useState<number>(new Date().getFullYear() - 3);

  const result = useMemo(
    () => recommendMotorCategory(use, cover, sumInsured, year),
    [use, cover, sumInsured, year]
  );

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3 shadow-lg border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Car className="h-5 w-5 text-accent" /> Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Vehicle Use</Label>
              <Select value={use} onValueChange={(v) => setUse(v as VehicleUse)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private Car</SelectItem>
                  <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle / Bodaboda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cover Level</Label>
              <Select value={cover} onValueChange={(v) => setCover(v as CoverLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="tpft">Third Party, Fire & Theft</SelectItem>
                  <SelectItem value="tpo">Third Party Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vehicle Value (TZS)</Label>
              <Input type="number" min={0} step={500000} value={sumInsured}
                onChange={(e) => setSumInsured(Number(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Year of Manufacture</Label>
              <Input type="number" min={1980} max={new Date().getFullYear()} value={year}
                onChange={(e) => setYear(Number(e.target.value) || new Date().getFullYear())} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-xl border-accent bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Your Estimate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge className="bg-accent text-accent-foreground">{result.category}</Badge>
          <div>
            <p className="text-sm opacity-80">Estimated Annual Premium</p>
            <p className="text-3xl font-bold text-accent">{fmtTZS(result.annualPremium)}</p>
          </div>
          <ul className="text-xs space-y-1 opacity-85">
            {result.notes.map((n, i) => <li key={i}>• {n}</li>)}
          </ul>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <MessageCircle className="h-4 w-4" /> Confirm via WhatsApp
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

const FamilyCalculator = () => {
  const [members, setMembers] = useState<FamilyMember[]>([
    { role: "Self", age: 35 },
    { role: "Spouse", age: 32 },
  ]);
  const [budget, setBudget] = useState<number>(0);

  const totals = useMemo(() => computeFamilyPremiums(members), [members]);
  const recommended = useMemo(() => recommendFamilyCategory(members, budget || undefined), [members, budget]);

  const update = (i: number, patch: Partial<FamilyMember>) =>
    setMembers((arr) => arr.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const remove = (i: number) => setMembers((arr) => arr.filter((_, idx) => idx !== i));
  const add = () => setMembers((arr) => [...arr, { role: "Child", age: 5 }]);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3 shadow-lg border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-accent" /> Family Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {members.map((m, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Label className="text-xs">Role</Label>
                <Input value={m.role} onChange={(e) => update(i, { role: e.target.value })} />
              </div>
              <div className="col-span-5">
                <Label className="text-xs">Age</Label>
                <Input type="number" min={0} max={59} value={m.age}
                  onChange={(e) => update(i, { age: Number(e.target.value) || 0 })} />
              </div>
              <div className="col-span-2">
                <Button variant="outline" size="icon" onClick={() => remove(i)} disabled={members.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={add} className="w-full">
            <Plus className="h-4 w-4" /> Add Family Member
          </Button>

          <div className="pt-4 border-t">
            <Label>Annual Budget (TZS) — optional</Label>
            <Input type="number" min={0} step={100000} value={budget}
              onChange={(e) => setBudget(Number(e.target.value) || 0)}
              placeholder="e.g. 5,000,000" />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-semibold mb-2">All Plan Totals (annual)</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {medicalPlans.map((p) => (
                <div key={p.key} className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="font-medium">{p.key}</span>
                  <span className="text-accent font-semibold">{fmtTZS(totals[p.key])}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-xl border-accent bg-gradient-to-br from-primary to-primary-light text-primary-foreground h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Recommended Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge className="bg-accent text-accent-foreground">{recommended.plan}</Badge>
          <div>
            <p className="text-sm opacity-80">Total Annual Premium</p>
            <p className="text-3xl font-bold text-accent">{fmtTZS(recommended.annualPremium)}</p>
          </div>
          <p className="text-sm opacity-90">{recommended.reasoning}</p>
          <div className="text-xs opacity-80 space-y-1">
            <p>Coverage limit: {medicalPlans.find((p) => p.key === recommended.plan)?.limit}</p>
            <p>Region: {medicalPlans.find((p) => p.key === recommended.plan)?.region}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <MessageCircle className="h-4 w-4" /> Confirm via WhatsApp
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

const RateTable = () => (
  <Card className="mt-10 shadow-md">
    <CardHeader>
      <CardTitle>Strategis Medical Plans — Annual Rates per Member (TZS)</CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left">Age Band</th>
            {medicalPlans.map((p) => <th key={p.key} className="p-2 text-right">{p.key}</th>)}
          </tr>
        </thead>
        <tbody>
          {ageBands.map((band) => (
            <tr key={band} className="border-b hover:bg-muted/30">
              <td className="p-2 font-medium">{band}</td>
              {medicalPlans.map((p) => (
                <td key={p.key} className="p-2 text-right">{premiumRates[band][p.key].toLocaleString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

const CalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <PageHero
        eyebrow="Instant Estimate"
        title="Insurance Calculator"
        subtitle="Get an instant indicative premium for motor or family medical cover — based on Strategis 2025/2026 rates and TIRA-aligned motor tariffs."
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Tabs defaultValue="motor" className="w-full">
            <TabsList className="grid w-full md:w-96 mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="motor"><Car className="h-4 w-4 mr-2" /> Motor</TabsTrigger>
              <TabsTrigger value="family"><Heart className="h-4 w-4 mr-2" /> Family Medical</TabsTrigger>
            </TabsList>
            <TabsContent value="motor"><MotorCalculator /></TabsContent>
            <TabsContent value="family">
              <FamilyCalculator />
              <RateTable />
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            <CalcIcon className="h-5 w-5 mx-auto mb-2 text-accent" />
            Estimates are indicative. Final premiums are confirmed by the underwriter after document review.
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default CalculatorPage;
