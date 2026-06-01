import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, Send, Paperclip, X, Sparkles, RefreshCw, LogOut, LayoutDashboard, KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import RatesDashboard from "@/components/admin/RatesDashboard";

const STORAGE_KEY = "lf_admin_passcode";

type ChatMsg = { role: "user" | "assistant"; content: string };

const AdminPage = () => {
  const [passcode, setPasscode] = useState<string>(() => sessionStorage.getItem(STORAGE_KEY) ?? "");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-unlock if passcode stored
  useEffect(() => {
    if (passcode && !unlocked) void verify(passcode, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (unlocked) void loadConfig(); }, [unlocked]);

  async function loadConfig() {
    const { data } = await supabase
      .from("calculator_config").select("data, updated_at").eq("id", "current").maybeSingle();
    setConfig(data);
  }

  async function verify(code: string, silent = false) {
    setChecking(true);
    const { data, error } = await supabase.functions.invoke("admin-update-rates", {
      body: { passcode: code, action: "verify" },
    });
    setChecking(false);
    if (error || !(data as any)?.ok) {
      if (!silent) toast.error("Invalid passcode");
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, code);
    setUnlocked(true);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
    setPasscode("");
    setMessages([]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (f.size > 4 * 1024 * 1024) { toast.error(`${f.name} is too large (max 4MB)`); continue; }
      if (f.type.startsWith("image/")) {
        const url = await new Promise<string>((res) => {
          const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f);
        });
        setImages((arr) => [...arr, { name: f.name, url }]);
      } else if (f.type.startsWith("text/") || /\.(csv|txt|md|tsv)$/i.test(f.name)) {
        const text = await f.text();
        setPrompt((p) => (p ? p + "\n\n" : "") + `From file ${f.name}:\n${text}`);
      } else {
        toast.error(`${f.name}: unsupported. Use images, CSV or text. For PDFs/Excel, copy the rates into the prompt.`);
      }
    }
  }

  async function send() {
    if (!prompt.trim() && images.length === 0) return;
    const userText = prompt + (images.length ? `\n[${images.length} image(s) attached]` : "");
    setMessages((m) => [...m, { role: "user", content: userText }]);
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("admin-update-rates", {
      body: {
        passcode,
        prompt: prompt || "Extract any insurance rates from the attached image(s).",
        images: images.map((i) => i.url),
      },
    });
    setBusy(false);
    if (error || (data as any)?.error) {
      const msg = (data as any)?.error ?? error?.message ?? "Update failed";
      setMessages((m) => [...m, { role: "assistant", content: `❌ ${msg}` }]);
      toast.error(msg);
      return;
    }
    const summary = (data as any).summary ?? "Updated.";
    setMessages((m) => [...m, { role: "assistant", content: `✅ ${summary}` }]);
    setPrompt(""); setImages([]);
    toast.success("Rates updated");
    await loadConfig();
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-muted/30 px-4 py-16">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-accent" /> Admin Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter the admin passcode to edit calculator rates.</p>
              <Input
                type="password"
                placeholder="Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verify(passcode)}
              />
              <Button className="w-full" disabled={!passcode || checking} onClick={() => verify(passcode)}>
                {checking ? "Checking..." : "Unlock"}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-muted/30 py-10">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Calculator Admin</h1>
              <p className="text-sm text-muted-foreground">Update rates by chatting with the AI assistant. Changes go live instantly.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadConfig}><RefreshCw className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4" /> Log out</Button>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList>
              <TabsTrigger value="dashboard"><LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard</TabsTrigger>
              <TabsTrigger value="chat"><Sparkles className="h-4 w-4 mr-1" /> AI Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4">
              <RatesDashboard passcode={passcode} onSaved={loadConfig} />
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Chat to update rates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-80 overflow-y-auto rounded-md border bg-background p-3 space-y-3">
                      {messages.length === 0 && (
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p>Examples:</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>"Set AFYA SUPA rate for 25-39 to 1,500,000"</li>
                            <li>"Change comprehensive private car rate to 4.5% with minimum 400,000"</li>
                            <li>"Set TPO motorcycle to 90,000"</li>
                            <li>Attach a rate sheet image — the AI will read it.</li>
                          </ul>
                        </div>
                      )}
                      {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                            m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>{m.content}</div>
                        </div>
                      ))}
                      {busy && <div className="text-sm text-muted-foreground">AI is parsing & updating…</div>}
                    </div>

                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {images.map((img, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {img.name}
                            <button onClick={() => setImages((a) => a.filter((_, j) => j !== i))}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Textarea
                      rows={3}
                      placeholder="Describe the rate change, or paste a rate table…"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={busy}
                    />
                    <div className="flex gap-2">
                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        accept="image/*,text/*,.csv,.txt,.md,.tsv"
                        className="hidden"
                        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
                      />
                      <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={busy}>
                        <Paperclip className="h-4 w-4" /> Attach
                      </Button>
                      <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" disabled={busy} onClick={send}>
                        <Send className="h-4 w-4" /> Send
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports: typed prompts, images, CSV/text. For PDF/Excel rate sheets, open them and paste the contents into the prompt.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader><CardTitle>Current config</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Updated: {config?.updated_at ? new Date(config.updated_at).toLocaleString() : "—"}
                    </p>
                    <pre className="text-[10px] leading-tight bg-muted p-2 rounded max-h-[28rem] overflow-auto">
{config ? JSON.stringify(config.data, null, 2) : "Loading…"}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

    </div>
  );
};

export default AdminPage;
