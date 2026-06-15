// Admin function: validates passcode, uses Lovable AI to parse a natural-language
// prompt into structured rate updates, then merges into calculator_config.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SERVICE_ROLE) {
      return json(500, { error: "Server not configured" });
    }

    const body = await req.json().catch(() => ({}));
    const { passcode, action, prompt, data, images, newPasscode } = body as {
      passcode?: string; action?: string; prompt?: string;
      data?: unknown; images?: string[]; newPasscode?: string;
    };

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Verify passcode against bcrypt hash via security-definer DB function
    if (!passcode || typeof passcode !== "string") {
      return json(401, { error: "Invalid passcode" });
    }
    const { data: ok, error: verErr } = await supabase.rpc("verify_admin_passcode", {
      _passcode: passcode,
    });
    if (verErr) return json(500, { error: verErr.message });
    if (!ok) return json(401, { error: "Invalid passcode" });

    // verify-only ping
    if (action === "verify") return json(200, { ok: true });

    // Change passcode --------------------------------------------------------
    if (action === "change_passcode") {
      if (!newPasscode || typeof newPasscode !== "string" || newPasscode.length < 4) {
        return json(400, { error: "New passcode must be at least 4 characters." });
      }
      const { error: pErr } = await supabase.rpc("set_admin_passcode", {
        _new_passcode: newPasscode,
      });
      if (pErr) return json(500, { error: pErr.message });
      return json(200, { ok: true, message: "Passcode updated." });
    }


    // Load current config
    const { data: row, error: readErr } = await supabase
      .from("calculator_config").select("data").eq("id", "current").maybeSingle();
    if (readErr) return json(500, { error: readErr.message });
    const current = (row?.data ?? {}) as Record<string, unknown>;

    // Direct overwrite (manual JSON edit) ----------------------------------
    if (action === "replace" && data && typeof data === "object") {
      const merged = { ...current, ...(data as Record<string, unknown>) };
      const { error: upErr } = await supabase
        .from("calculator_config")
        .upsert({ id: "current", data: merged, updated_at: new Date().toISOString() });
      if (upErr) return json(500, { error: upErr.message });
      return json(200, { ok: true, data: merged });
    }

    // AI-parsed prompt -----------------------------------------------------
    if (!prompt || typeof prompt !== "string") {
      return json(400, { error: "Missing prompt" });
    }

    const systemPrompt = `You extract insurance rate updates for LF Insurance Brokers Tanzania.
Return ONLY a JSON object via the tool that contains the FIELDS THAT CHANGED.
You may include any of: medicalPlans, ageBands, premiumRates, motorRates.
Schema:
- medicalPlans: array of { key, limit, region }
- ageBands: array of strings like "0-17"
- premiumRates: object keyed by age band, each containing plan->annual TZS (integer)
- motorRates: { comprehensive: { private|commercial|motorcycle: { rate (decimal, e.g. 0.04), minPremium (TZS int) } }, tpft: { private, commercial, motorcycle (flat TZS int) }, tpo: same as tpft }
If a value is unchanged, OMIT it. Never invent numbers. Convert percentages (4%) to decimals (0.04).
CURRENT CONFIG (for reference, do not echo):
${JSON.stringify(current)}`;

    const userContent: any[] = [{ type: "text", text: prompt }];
    if (Array.isArray(images)) {
      for (const url of images.slice(0, 5)) {
        if (typeof url === "string" && url.startsWith("data:image/")) {
          userContent.push({ type: "image_url", image_url: { url } });
        }
      }
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        tools: [{
          type: "function",
          function: {
            name: "apply_rate_updates",
            description: "Apply rate updates to the calculator config.",
            parameters: {
              type: "object",
              properties: {
                medicalPlans: { type: "array", items: { type: "object" } },
                ageBands: { type: "array", items: { type: "string" } },
                premiumRates: { type: "object" },
                motorRates: { type: "object" },
                summary: { type: "string", description: "1-2 sentence human summary of what changed." },
              },
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "apply_rate_updates" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) return json(429, { error: "AI rate limit, try again shortly." });
      if (aiResp.status === 402) return json(402, { error: "AI credits exhausted. Add credits in Workspace > Usage." });
      const t = await aiResp.text();
      return json(500, { error: `AI error: ${t.slice(0, 300)}` });
    }

    const aiJson = await aiResp.json();
    const call = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return json(422, { error: "AI did not return structured updates." });
    }
    let parsed: any;
    try { parsed = JSON.parse(call.function.arguments); }
    catch { return json(422, { error: "AI returned invalid JSON." }); }

    const { summary, ...updates } = parsed;
    const merged: any = { ...current };
    for (const k of ["medicalPlans", "ageBands", "premiumRates", "motorRates"]) {
      if (updates[k] !== undefined) {
        if (k === "premiumRates" && current.premiumRates && typeof updates.premiumRates === "object") {
          merged.premiumRates = { ...(current.premiumRates as object), ...updates.premiumRates };
        } else if (k === "motorRates" && current.motorRates && typeof updates.motorRates === "object") {
          merged.motorRates = {
            ...(current.motorRates as Record<string, unknown>),
            ...updates.motorRates,
          };
        } else {
          merged[k] = updates[k];
        }
      }
    }

    const { error: upErr } = await supabase
      .from("calculator_config")
      .upsert({ id: "current", data: merged, updated_at: new Date().toISOString() });
    if (upErr) return json(500, { error: upErr.message });

    return json(200, { ok: true, summary: summary ?? "Rates updated.", updates, data: merged });
  } catch (e) {
    console.error(e);
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
