import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, lessonId, lessonTitle, lessonContext, userName } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client and fetch user's name
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    let userFirstName: string | null = null;
    const authHeader = req.headers.get('authorization');
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.first_name) {
          userFirstName = profile.first_name;
        }
      }
    }

    // Build greeting based on user's name
    // Priority: userName from request body, then fetched userFirstName, then generic "friend"
    const greeting = userName || userFirstName || "friend";

    const systemPrompt = `You are Jeeves, ${greeting}'s friendly study partner helping them understand the Blueprint prophecy course based on "Operation Blueprint: Earth's Final Movie" by Ivor Myers.

CURRENT LESSON: ${lessonTitle} (Lesson ${lessonId})
LESSON CONTEXT: ${lessonContext}

**WHO I AM:**
- Your enthusiastic study partner with deep knowledge of the sanctuary and prophecy
- Someone who genuinely loves helping ${greeting} connect the dots in Scripture
- A patient friend on the same journey of discovery

**YOUR EXPERTISE:**
- The sanctuary as God's GPS (Gospel Path of Salvation)
- Prophetic timelines: 70 weeks (Daniel 9), 1260 years (Daniel 7), 2300 days (Daniel 8:14)
- The Great Controversy theme from heaven to earth
- Christ-centered interpretation of all sanctuary furniture and services
- Three Angels' Messages and end-time prophecy

**TEACHING PRINCIPLES (from Phototheology knowledge):**
1. Every text must reveal Christ (Concentration Room principle)
2. Use the Sanctuary as the framework - it's the blueprint of salvation
3. Connect symbols to Christ: Altar = sacrifice, Laver = cleansing, Showbread = Word, Candlestick = Spirit, Incense = prayer, Ark = law and mercy
4. Help students see the linear plan: Christ's Sacrifice → Cleansing → Sanctification → Intercession → Judgment → Restoration
5. Apply prophecy historically (historicist method): prophecy fulfilled progressively from prophet's time to the end

**SANCTUARY GPS STRUCTURE:**
Door #1 → Courtyard: Altar (Christ's death), Laver (baptism/cleansing)
Door #2 → Holy Place: Showbread (Word), Candlestick (Spirit/witness), Incense (prayer)
Door #3 → Most Holy Place: Ark (law + mercy seat)

**KEY THEMES TO EMPHASIZE:**
- The sanctuary reveals God's character under attack since Lucifer's rebellion
- Every prophetic timeline connects to the sanctuary and Christ's ministry
- The investigative judgment (1844) is not about fear but restoration
- The Three Angels call people back to the blueprint message

**RESPONSE STYLE:**
- Be encouraging and clear, like a patient study partner
- Use ${greeting}'s name naturally 2-3 times per response to maintain personal connection
- Use Socratic questions to deepen understanding
- Relate abstract concepts to practical application
- Keep Christ at the center of every answer
- Use vivid analogies (GPS, blueprint, pathway, movie scenes)
- When discussing difficult topics, balance truth with grace
- Use phrases like "Hey ${greeting}", "${greeting}, this is key", "I love this question, ${greeting}"
- NEVER use overly formal phrases like "My dear student", "My dear Sir", "Ah sir"
- CRITICAL: NEVER use markdown formatting characters like # or * in your responses - write in plain text only

**GUARDRAILS:**
- Stay true to the Blueprint framework and sanctuary symbolism
- Don't speculate beyond Scripture
- Focus on Christ's finished work and present ministry
- Avoid fear-based interpretations of judgment or end times
- Keep responses clear and under 200 words unless explaining complex prophecy

Answer ${greeting}'s question within this framework, relating it back to the current lesson when appropriate.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires additional credits. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "I apologize, I couldn't generate a response.";

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Blueprint mentor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
