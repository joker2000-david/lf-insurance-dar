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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, ArrowRight, Car, CheckCircle2, Loader2, Send, ShieldCheck, Trash2, Users,
} from "lucide-react";
import {
  recommendMotorCategory, recommendFamilyCategory, computeFamilyPremiums,
  medicalPlans, type VehicleUse, type CoverLevel, type FamilyMember,
} from "@/data/medical-plans";

const RECIPIENT_EMAIL = "Fredy.msangi@lfinsurance.co.tz";

const buyerSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(120),
  phone: z.string().trim().min(7, "Active phone number is required").max(30),
  tin_number: z.string().trim().min(5, "TIN Number is required").max(30),
  email: z.string().trim().email("Valid email recommended").max(160).optional().or(z.literal("")),
});

type Choice = "motor" | "family" | null;
type Step = "choose" | "details" | "result";

const fmtTZS = (n: number) => "TZS " + Math.round(n).toLocaleString("en-US");

const Quote = () => {
  const [choice, setChoice] = useState<Choice>(null);
  const [step, setStep] = useState<Step>("choose");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [buyer, setBuyer] = useState({ full_name: "", phone: "", tin_number: "", email: "" });

  // Motor state
  const [motor, setMotor] = useState({
    registration_number: "",
    use: "private" as VehicleUse,
    cover: "comprehensive" as CoverLevel,
    make_model: "",
    year: "",
    sum_insured: "",
    claim_history: "No",
    notes: "",
  });

  // Family state
  const [family, setFamily] = useState<{ members: FamilyMember[]; budget: string; notes: string }>({
    members: [
      { role: "Principal (You)", age: 35 },
      { role: "Spouse", age: 32 },
    ],
    budget: "",
    notes: "",
  });

  const motorResult = useMemo(() => {
    const sum = parseInt(motor.sum_insured.replace(/\D/g, "") || "0", 10);
    const yr = parseInt(motor.year || "0", 10);
    if (motor.cover === "comprehensive" && !sum) return null;
    return recommendMotorCategory(motor.use, motor.cover, sum, yr || undefined);
  }, [motor]);

  const familyResult = useMemo(() => {
    const valid = family.members.filter((m) => m.age >= 0 && m.age <= 59);
    if (valid.length === 0) return null;
    const rec = recommendFamilyCategory(valid);
    const all = computeFamilyPremiums(valid);
    return { rec, all };
  }, [family]);

  const addKid = () =>
    setFamily((f) => ({ ...f, members: [...f.members, { role: `Child ${f.members.filter((m) => m.role.startsWith("Child")).length + 1}`, age: 5 }] }));
  const removeMember = (i: number) =>
    setFamily((f) => ({ ...f, members: f.members.filter((_, idx) => idx !== i) }));
  const updateMember = (i: number, patch: Partial<FamilyMember>) =>
    setFamily((f) => ({ ...f, members: f.members.map((m, idx) => (idx === i ? { ...m, ...patch } : m)) }));

  const handleSubmit = async () => {
    const parsed = buyerSchema.safeParse(buyer);
    if (!parsed.success) {
      toast({ title: "Please check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    let insurance_type = "";
    let details: Record<string, unknown> = {};

    if (choice === "motor") {
      insurance_type = "Motor";
      details = {
        ...motor,
        recommended_category: motorResult?.category,
        indicative_annual_premium_tzs: motorResult?.annualPremium,
      };
    } else if (choice === "family") {
      insurance_type = "Family / Medical";
      details = {
        members: family.members,
        annual_budget_tzs: family.budget,
        notes: family.notes,
        recommended_plan: familyResult?.rec.plan,
        recommended_annual_premium_tzs: familyResult?.rec.annualPremium,
        all_plan_premiums_tzs: familyResult?.all,
      };
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("quote_submissions").insert({
        insurance_type,
        full_name: buyer.full_name.trim(),
        phone: buyer.phone.trim(),
        tin_number: buyer.tin_number.trim(),
        email: buyer.email?.trim() || null,
        details: details as never,
      });
      if (error) throw error;

      supabase.functions.invoke("send-quote-email", {
        body: { recipient: RECIPIENT_EMAIL, insurance_type, buyer, details },
      }).catch(() => { /* saved regardless */ });

      setDone(true);
      toast({ title: "Request received", description: "Our team will contact you within 24 hours." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again";
      toast({ title: "Could not submit", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setChoice(null); setStep("choose"); setDone(false);
    setBuyer({ full_name: "", phone: "", tin_number: "", email: "" });
  };

  // ---------- DONE ----------
  if (done) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <PageHero eyebrow="Quote Request" title="Thank you!" subtitle="We've received your insurance request." />
        <main className="flex-1 container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto shadow-medium border-0">
            <CardContent className="p-10 text-center">
              <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">We've got your request</h2>
              <p className="text-muted-foreground mb-6">
                A broker from LF Insurance will reach out on <strong>{buyer.phone}</strong> within 24 hours
                with your tailored quotation.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={resetAll} variant="outline">Submit another request</Button>
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
        subtitle="Choose your cover, fill in the details and instantly see your recommended category."
      />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-8 text-sm">
            {["Choose", "Details", "Your Category"].map((label, i) => {
              const active =
                (step === "choose" && i === 0) ||
                (step === "details" && i === 1) ||
                (step === "result" && i === 2);
              const done = (step === "details" && i === 0) || (step === "result" && i <= 1);
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full grid place-items-center font-bold
                    ${active ? "bg-accent text-accent-foreground" : done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={active ? "font-semibold text-primary" : "text-muted-foreground"}>{label}</span>
                  {i < 2 && <span className="w-8 h-px bg-border mx-1" />}
                </div>
              );
            })}
          </div>

          {/* STEP 1: CHOOSE */}
          {step === "choose" && (
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { key: "motor", icon: Car, title: "Motor Insurance", desc: "Insure your car, motorcycle or commercial vehicle." },
                { key: "family", icon: Users, title: "Family Insurance", desc: "Medical cover for you, your spouse and your children." },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => { setChoice(opt.key as Choice); setStep("details"); }}
                  className={`group text-left rounded-2xl border-2 p-8 transition-all hover:shadow-strong hover:-translate-y-1
                    ${choice === opt.key ? "border-accent bg-accent/5" : "border-border bg-card"}`}
                >
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                    <opt.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-1">{opt.title}</h3>
                  <p className="text-muted-foreground">{opt.desc}</p>
                  <div className="flex items-center gap-2 text-accent font-semibold mt-4">
                    Start <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === "details" && choice === "motor" && (
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Car className="h-6 w-6 text-accent" /> Vehicle Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">Tell us about your vehicle to see your category.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Registration Number *</Label>
                    <Input required value={motor.registration_number}
                      onChange={(e) => setMotor({ ...motor, registration_number: e.target.value.toUpperCase() })}
                      placeholder="T123 ABC" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Use *</Label>
                    <Select value={motor.use} onValueChange={(v) => setMotor({ ...motor, use: v as VehicleUse })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private Car</SelectItem>
                        <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle / Bodaboda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cover Type *</Label>
                    <Select value={motor.cover} onValueChange={(v) => setMotor({ ...motor, cover: v as CoverLevel })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive (full cover)</SelectItem>
                        <SelectItem value="tpft">Third Party Fire & Theft</SelectItem>
                        <SelectItem value="tpo">Third Party Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Make & Model</Label>
                    <Input value={motor.make_model}
                      onChange={(e) => setMotor({ ...motor, make_model: e.target.value })}
                      placeholder="Toyota Hilux" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year of Manufacture</Label>
                    <Input inputMode="numeric" maxLength={4} value={motor.year}
                      onChange={(e) => setMotor({ ...motor, year: e.target.value.replace(/\D/g, "") })}
                      placeholder="2020" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Value (TZS) {motor.cover === "comprehensive" && "*"}</Label>
                    <Input inputMode="numeric" value={motor.sum_insured}
                      onChange={(e) => setMotor({ ...motor, sum_insured: e.target.value.replace(/\D/g, "") })}
                      placeholder="35000000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Previous Claim History</Label>
                    <Select value={motor.claim_history} onValueChange={(v) => setMotor({ ...motor, claim_history: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No — claims free</SelectItem>
                        <SelectItem value="Yes">Yes — with claim record</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea value={motor.notes} onChange={(e) => setMotor({ ...motor, notes: e.target.value })} />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep("choose")}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={!motor.registration_number || (motor.cover === "comprehensive" && !motor.sum_insured)}
                    onClick={() => setStep("result")}
                  >
                    See my category <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "details" && choice === "family" && (
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-accent" /> Family Composition
                </CardTitle>
                <p className="text-sm text-muted-foreground">Tell us about each family member to see the best plan.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {family.members.map((m, i) => (
                  <div key={i} className="grid md:grid-cols-[1fr,140px,40px] gap-3 items-end">
                    <div className="space-y-2">
                      <Label>Member</Label>
                      <Input value={m.role} onChange={(e) => updateMember(i, { role: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input inputMode="numeric" value={String(m.age)}
                        onChange={(e) => updateMember(i, { age: parseInt(e.target.value.replace(/\D/g, "") || "0", 10) })} />
                    </div>
                    <Button type="button" variant="ghost" size="icon"
                      onClick={() => removeMember(i)} disabled={family.members.length <= 1}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addKid}>
                  + Add a child / dependant
                </Button>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>Annual Budget (optional, TZS)</Label>
                    <Input inputMode="numeric" value={family.budget}
                      onChange={(e) => setFamily({ ...family, budget: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g. 5,000,000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pre-existing conditions / preferences</Label>
                    <Input value={family.notes} onChange={(e) => setFamily({ ...family, notes: e.target.value })}
                      placeholder="Optional" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Waiting periods apply: 12 months for pre-existing / chronic conditions and maternity; 3 months for non-emergency hospitalisation.
                </p>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep("choose")}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={family.members.length === 0}
                    onClick={() => setStep("result")}
                  >
                    See my category <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: RESULT */}
          {step === "result" && (
            <div className="space-y-6">
              <Card className="shadow-strong border-0 overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8">
                  <Badge className="bg-accent text-accent-foreground mb-3">Your Recommended Category</Badge>
                  {choice === "motor" && motorResult && (
                    <>
                      <h2 className="text-3xl font-bold mb-2">{motorResult.category}</h2>
                      <p className="text-primary-foreground/90">Indicative annual premium</p>
                      <p className="text-4xl font-extrabold mt-1">{fmtTZS(motorResult.annualPremium)}</p>
                    </>
                  )}
                  {choice === "family" && familyResult && (
                    <>
                      <h2 className="text-3xl font-bold mb-2">{familyResult.rec.plan}</h2>
                      <p className="text-primary-foreground/90">{familyResult.rec.reasoning}</p>
                      <p className="text-4xl font-extrabold mt-3">{fmtTZS(familyResult.rec.annualPremium)} <span className="text-base font-normal opacity-80">/ year</span></p>
                    </>
                  )}
                </div>
                <CardContent className="p-6">
                  {choice === "motor" && motorResult && (
                    <ul className="space-y-2 text-sm">
                      {motorResult.notes.map((n, i) => (
                        <li key={i} className="flex gap-2 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {n}
                        </li>
                      ))}
                    </ul>
                  )}
                  {choice === "family" && familyResult && (
                    <div>
                      <p className="text-sm font-semibold mb-3 text-primary">Compare all plans for your family:</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {medicalPlans.map((p) => (
                          <div key={p.key}
                            className={`p-4 rounded-lg border-2 ${p.key === familyResult.rec.plan ? "border-accent bg-accent/5" : "border-border"}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary">{p.key}</span>
                              {p.key === familyResult.rec.plan && <Badge className="bg-accent text-accent-foreground">Recommended</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Limit {p.limit} · {p.region}</p>
                            <p className="text-lg font-bold mt-2">{fmtTZS(familyResult.all[p.key])} <span className="text-xs font-normal text-muted-foreground">/ year</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Buyer details */}
              <Card className="shadow-medium border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ShieldCheck className="h-5 w-5 text-accent" /> Confirm Your Details
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Our broker will reach out within 24 hours to confirm and finalise.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input required value={buyer.full_name}
                          onChange={(e) => setBuyer({ ...buyer, full_name: e.target.value })} placeholder="e.g. John Mwakasege" />
                      </div>
                      <div className="space-y-2">
                        <Label>Active Phone Number *</Label>
                        <Input required value={buyer.phone}
                          onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} placeholder="+255 7xx xxx xxx" />
                      </div>
                      <div className="space-y-2">
                        <Label>TIN Number *</Label>
                        <Input required value={buyer.tin_number}
                          onChange={(e) => setBuyer({ ...buyer, tin_number: e.target.value })} placeholder="123-456-789" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email (optional)</Label>
                        <Input type="email" value={buyer.email}
                          onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} placeholder="you@example.com" />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep("details")}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Edit details
                      </Button>
                      <Button type="submit" size="lg" disabled={submitting}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                        {submitting ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</> : <><Send className="h-5 w-5 mr-2" /> Submit Request</>}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Quote;
