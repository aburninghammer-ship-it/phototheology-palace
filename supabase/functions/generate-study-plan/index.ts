import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    // Gather user data for personalization
    const [
      { data: profile },
      { data: globalTitle },
      { data: recentActivity },
      { data: streaks },
    ] = await Promise.all([
      supabase.from("profiles").select("display_name, study_style, preferred_bible_version").eq("id", user.id).single(),
      supabase.from("global_master_titles").select("current_floor, rooms_completed, master_title, total_xp").eq("user_id", user.id).single(),
      supabase.from("reading_streaks").select("book, chapter, last_read_at").eq("user_id", user.id).order("last_read_at", { ascending: false }).limit(10),
      supabase.from("reading_streaks").select("current_streak, longest_streak").eq("user_id", user.id).limit(1),
    ]);

    const context = {
      name: profile?.display_name || "Student",
      currentFloor: globalTitle?.current_floor || 1,
      roomsCompleted: globalTitle?.rooms_completed || 0,
      masterTitle: globalTitle?.master_title || "none",
      totalXP: globalTitle?.total_xp || 0,
      recentBooks: recentActivity?.map((r: any) => `${r.book} ${r.chapter}`).join(", ") || "None yet",
      currentStreak: streaks?.[0]?.current_streak || 0,
    };

    const systemPrompt = `You are a Phototheology study plan architect. You create personalized weekly study plans based on the 8-floor Palace method. 

The student's current status:
- Name: ${context.name}
- Current Palace Floor: ${context.currentFloor}
- Rooms Completed: ${context.roomsCompleted}
- Master Title: ${context.masterTitle}
- Total XP: ${context.totalXP}
- Recent Study: ${context.recentBooks}
- Current Streak: ${context.currentStreak} days

Create a 7-day study plan that:
1. Focuses on rooms appropriate for their current floor
2. Builds on what they've recently studied
3. Includes specific Bible passages to study
4. Assigns specific Palace rooms and exercises for each day
5. Progressively challenges them toward the next floor
6. Uses PT room codes (SR, IR, 24, BR, TR, GR, OR, DC, ST, QR, QA, NF, PF, BF, HF, LR, CR, DR, C6, TRm, TZ, PRm, P‖, FRt, BL, PR, 3A, FRm, MR, SRm)

Format each day as:
Day X: [Theme]
- Bible Reading: [specific chapter/passage]
- Palace Room: [room code + name]
- Exercise: [specific activity]
- Time: [estimated minutes]
- Challenge: [stretch goal]

Keep it practical, achievable, and Christ-centered.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Create my personalized study plan for this week." },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("study-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
