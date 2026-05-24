import { useMemo, useState } from "react";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import {
  medicalPlans, ageBands, premiumRates, motorCoverTypes, otherInsuranceTypes,
} from "@/data/medical-plans";

const buyerSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(120),
  phone: z.string().trim().min(7, "Active phone number is required").max(30),
  tin_number: z.string().trim().min(5, "TIN Number is required").max(30),
  email: z.string().trim().email("Valid email recommended for response").max(160).optional().or(z.literal("")),
});

type InsuranceTab = "motor" | "medical" | "other";

const Quote = () => {
  const [tab, setTab] = useState<InsuranceTab>("motor");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Buyer
  const [buyer, setBuyer] = useState({ full_name: "", phone: "", tin_number: "", email: "" });

  // Motor
  const [motor, setMotor] = useState({
    registration_number: "",
    cover_type: motorCoverTypes[0] as string,
    vehicle_make_model: "",
    year_of_manufacture: "",
    sum_insured: "",
    has_claim_history: "No",
    notes: "",
  });

  // Medical
  const [plan, setPlan] = useState<string>(medicalPlans[0].key);
  const [lives, setLives] = useState<Record<string, string>>(
    Object.fromEntries(ageBands.map((b) => [b, "0"]))
  );
  const [medicalNotes, setMedicalNotes] = useState("");

  // Other
  const [other, setOther] = useState({
    insurance_type: otherInsuranceTypes[0] as string,
    sum_insured: "",
    description: "",
  });

  const estimatedPremium = useMemo(() => {
    return ageBands.reduce((acc, band) => {
      const n = parseInt(lives[band] || "0", 10) || 0;
      const rate = premiumRates[band]?.[plan] ?? 0;
      return acc + n * rate;
    }, 0);
  }, [lives, plan]);

  const fmt = (n: number) => "TZS " + n.toLocaleString("en-US");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = buyerSchema.safeParse(buyer);
    if (!parsed.success) {
      toast({ title: "Please check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    let details: Record<string, unknown> = {};
    let insurance_type = "";

    if (tab === "motor") {
      if (!motor.registration_number.trim()) {
        toast({ title: "Registration number required", description: "Please provide the vehicle registration number.", variant: "destructive" });
        return;
      }
      insurance_type = "Motor";
      details = { ...motor };
    } else if (tab === "medical") {
      const totalLives = ageBands.reduce((a, b) => a + (parseInt(lives[b] || "0", 10) || 0), 0);
      if (totalLives === 0) {
        toast({ title: "Add at least one member", description: "Specify the number of lives per age band.", variant: "destructive" });
        return;
      }
      insurance_type = "Medical / Health";
      details = {
        plan,
        lives,
        total_lives: totalLives,
        estimated_annual_premium_tzs: estimatedPremium,
        notes: medicalNotes,
      };
    } else {
      insurance_type = `Other — ${other.insurance_type}`;
      details = { ...other };
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("quote_submissions").insert({
        insurance_type,
        full_name: buyer.full_name.trim(),
        phone: buyer.phone.trim(),
        tin_number: buyer.tin_number.trim(),
        email: buyer.email?.trim() || null,
        details,
      });
      if (error) throw error;

      // Fire-and-forget email notification (works once email domain is configured)
      supabase.functions.invoke("send-quote-email", {
        body: {
          insurance_type,
          buyer: { ...buyer, email: buyer.email?.trim() || null },
          details,
        },
      }).catch(() => { /* silently ignored — submission is saved */ });

      setDone(true);
      toast({ title: "Request received", description: "Our team will contact you shortly on the number provided." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again";
      toast({ title: "Could not submit", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <PageHero eyebrow="Quote Request" title="Thank you!" subtitle="Your insurance request has been received." />
        <main className="flex-1 container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto shadow-medium border-0">
            <CardContent className="p-10 text-center">
              <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">We've got your request</h2>
              <p className="text-muted-foreground mb-6">
                One of our brokers will reach out on <strong>{buyer.phone}</strong> within 24 hours
                with a tailored quotation.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => { setDone(false); setBuyer({ full_name: "", phone: "", tin_number: "", email: "" }); }} variant="outline">
                  Submit another request
                </Button>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <a href="/">Back to home</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <PageHero
        eyebrow="Get a Quote"
        title="Request Your Insurance Quote"
        subtitle="Fill in your details and our broker will respond within 24 hours with the best cover for you."
      />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                  Quotation Form
                </CardTitle>
                <p className="text-sm text-muted-foreground">All fields marked * are required.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Buyer details */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold text-primary border-b pb-2">Buyer Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input id="full_name" required maxLength={120}
                          value={buyer.full_name}
                          onChange={(e) => setBuyer({ ...buyer, full_name: e.target.value })}
                          placeholder="e.g. John Mwakasege" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Active Phone Number *</Label>
                        <Input id="phone" required maxLength={30}
                          value={buyer.phone}
                          onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                          placeholder="+255 7xx xxx xxx" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tin">TIN Number *</Label>
                        <Input id="tin" required maxLength={30}
                          value={buyer.tin_number}
                          onChange={(e) => setBuyer({ ...buyer, tin_number: e.target.value })}
                          placeholder="123-456-789" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email (optional)</Label>
                        <Input id="email" type="email" maxLength={160}
                          value={buyer.email}
                          onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                          placeholder="you@example.com" />
                      </div>
                    </div>
                  </section>

                  {/* Type tabs */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold text-primary border-b pb-2">Insurance Type</h3>
                    <Tabs value={tab} onValueChange={(v) => setTab(v as InsuranceTab)}>
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="motor">Motor</TabsTrigger>
                        <TabsTrigger value="medical">Medical</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                      </TabsList>

                      {/* MOTOR */}
                      <TabsContent value="motor" className="space-y-4 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="reg">Registration Number *</Label>
                            <Input id="reg" required value={motor.registration_number}
                              onChange={(e) => setMotor({ ...motor, registration_number: e.target.value.toUpperCase() })}
                              placeholder="T123 ABC" />
                          </div>
                          <div className="space-y-2">
                            <Label>Type of Cover *</Label>
                            <Select value={motor.cover_type} onValueChange={(v) => setMotor({ ...motor, cover_type: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {motorCoverTypes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mm">Make & Model</Label>
                            <Input id="mm" value={motor.vehicle_make_model}
                              onChange={(e) => setMotor({ ...motor, vehicle_make_model: e.target.value })}
                              placeholder="Toyota Hilux" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="yr">Year of Manufacture</Label>
                            <Input id="yr" inputMode="numeric" maxLength={4} value={motor.year_of_manufacture}
                              onChange={(e) => setMotor({ ...motor, year_of_manufacture: e.target.value.replace(/\D/g, "") })}
                              placeholder="2020" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sum">Vehicle Value / Sum Insured (TZS)</Label>
                            <Input id="sum" inputMode="numeric" value={motor.sum_insured}
                              onChange={(e) => setMotor({ ...motor, sum_insured: e.target.value })}
                              placeholder="35,000,000" />
                          </div>
                          <div className="space-y-2">
                            <Label>Previous Claim History</Label>
                            <Select value={motor.has_claim_history} onValueChange={(v) => setMotor({ ...motor, has_claim_history: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="No">No — claims free</SelectItem>
                                <SelectItem value="Yes">Yes — with claim record</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mn">Additional Notes</Label>
                          <Textarea id="mn" value={motor.notes}
                            onChange={(e) => setMotor({ ...motor, notes: e.target.value })}
                            placeholder="Anything else we should know..." />
                        </div>
                      </TabsContent>

                      {/* MEDICAL */}
                      <TabsContent value="medical" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Choose a Plan *</Label>
                          <Select value={plan} onValueChange={setPlan}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {medicalPlans.map((p) => (
                                <SelectItem key={p.key} value={p.key}>
                                  {p.key} — annual limit {p.limit} ({p.region})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="mb-2 block">Number of Lives per Age Band *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {ageBands.map((b) => (
                              <div key={b} className="space-y-1">
                                <Label htmlFor={`band-${b}`} className="text-xs text-muted-foreground">
                                  Age {b} · {fmt(premiumRates[b][plan])}/yr
                                </Label>
                                <Input
                                  id={`band-${b}`}
                                  inputMode="numeric"
                                  value={lives[b]}
                                  onChange={(e) => setLives({ ...lives, [b]: e.target.value.replace(/\D/g, "") })}
                                  placeholder="0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-lg border bg-secondary/40 p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Estimated annual premium</p>
                            <p className="text-2xl font-bold text-primary">{fmt(estimatedPremium)}</p>
                          </div>
                          <Badge variant="secondary" className="text-primary font-semibold">{plan}</Badge>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mednotes">Additional Notes</Label>
                          <Textarea id="mednotes" value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)}
                            placeholder="Pre-existing conditions, preferred hospitals, etc." />
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Waiting periods apply: 12 months for pre-existing / chronic conditions, maternity and foreign treatment; 3 months for non-emergency hospitalisation.
                        </p>
                      </TabsContent>

                      {/* OTHER */}
                      <TabsContent value="other" className="space-y-4 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Insurance Type *</Label>
                            <Select value={other.insurance_type} onValueChange={(v) => setOther({ ...other, insurance_type: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {otherInsuranceTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="osum">Sum Insured (TZS)</Label>
                            <Input id="osum" value={other.sum_insured}
                              onChange={(e) => setOther({ ...other, sum_insured: e.target.value })}
                              placeholder="e.g. 100,000,000" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="odesc">Describe what you'd like to insure *</Label>
                          <Textarea id="odesc" required value={other.description}
                            onChange={(e) => setOther({ ...other, description: e.target.value })}
                            placeholder="Type of asset, location, value, duration of cover, etc." />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </section>

                  <Button type="submit" size="lg" disabled={submitting}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                    {submitting ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</> : <><Send className="h-5 w-5 mr-2" /> Submit Request</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <Card className="border-0 shadow-soft bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <h4 className="font-bold text-primary mb-2">Why choose LF Insurance Brokers?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5" /> Licensed TIRA broker in Tanzania</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5" /> Access to all major insurers</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5" /> Hands-on claims support</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5" /> Response within 24 hours</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 text-sm">
                <p className="font-bold text-foreground mb-1">Need help filling this in?</p>
                <p className="text-muted-foreground mb-3">Call our team directly — we'll guide you through it.</p>
                <Button asChild variant="outline" className="w-full">
                  <a href="tel:+255713464894">+255 713 464 894</a>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Quote;
