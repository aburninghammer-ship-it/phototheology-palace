import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gemName, gemContent } = await req.json();
    
    if (!gemName || !gemContent) {
      return new Response(
        JSON.stringify({ error: "Missing gemName or gemContent" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Categorizing gem:", gemName);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a biblical scholar assistant. Categorize biblical insights into ONE of these categories:
- Prophecy (prophetic fulfillment, timelines, Daniel, Revelation)
- Typology (types, antitypes, shadows, patterns)
- Gospel (salvation, grace, justification, Christ's work)
- Sanctuary (tabernacle, temple, priesthood, sacrificial system)
- Character Study (biblical figures, their faith, failures, lessons)
- Covenants (promises, agreements between God and people)
- Creation & Nature (natural theology, creation patterns)
- End Times (eschatology, second coming, judgment)
- Prayer & Worship (spiritual disciplines, relationship with God)
- Law & Grace (commandments, obedience, freedom)
- Other (if truly none of the above fit)

Respond with ONLY the category name, nothing else.`
          },
          {
            role: "user",
            content: `Gem Name: ${gemName}\n\nGem Content: ${gemContent}\n\nCategory:`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to categorize gem" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const category = data.choices?.[0]?.message?.content?.trim() || "Other";
    
    console.log("Categorized as:", category);

    return new Response(
      JSON.stringify({ category }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in categorize-gem function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
