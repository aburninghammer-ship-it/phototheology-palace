import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Gather platform intelligence from multiple sources
    const [
      { data: announcements },
      { data: recentChallenges },
      { data: recentSeries },
      { data: existingKnowledge },
      { count: totalUsers },
      { data: recentAchievements },
    ] = await Promise.all([
      // Recent announcements (last 7 days)
      supabase.from("announcements").select("title, message, type").eq("is_active", true).order("created_at", { ascending: false }).limit(10),
      // Recent challenges
      supabase.from("challenges").select("title, challenge_type, difficulty").order("created_at", { ascending: false }).limit(5),
      // Recent study series
      supabase.from("bible_study_series").select("title, theme_subject, audience_type").eq("is_public", true).order("created_at", { ascending: false }).limit(5),
      // Current knowledge entries
      supabase.from("reginald_knowledge_updates").select("id, title, category, created_at").eq("is_active", true).order("created_at", { ascending: false }),
      // User count for context
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      // Recent achievements
      supabase.from("achievements").select("name, description, category").order("created_at", { ascending: false }).limit(5),
    ]);

    // Build context for AI to generate knowledge entries
    const platformContext = {
      announcements: announcements || [],
      recentChallenges: recentChallenges || [],
      recentSeries: recentSeries || [],
      existingEntries: (existingKnowledge || []).length,
      totalUsers: totalUsers || 0,
      recentAchievements: recentAchievements || [],
      timestamp: new Date().toISOString(),
    };

    // Use AI to generate a concise knowledge summary
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are a system that generates concise knowledge base entries for Reginald, the PhototheologyOS Palace concierge. Given platform data, generate 3-5 brief, actionable knowledge entries that help Reginald stay current.

Each entry should be a JSON object with:
- "category": one of "changelog", "feature", "content", "community", "tip"
- "title": concise title (max 50 chars)
- "content": brief description (max 200 chars) of what's new or noteworthy
- "priority": 0-10 (higher = more important)

Return ONLY a JSON array of entries. No markdown, no explanation.

Focus on:
- New content available (series, challenges, achievements)
- Active announcements users should know about
- Platform activity highlights
- Tips Reginald can share proactively`
          },
          {
            role: "user",
            content: `Generate knowledge entries from this platform snapshot:\n${JSON.stringify(platformContext, null, 2)}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI response failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "[]";
    
    // Parse AI response - extract JSON from potential markdown wrapper
    let entries: any[];
    try {
      const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
      entries = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch {
      console.error("[REGINALD-REFRESH] Failed to parse AI response:", rawContent);
      entries = [];
    }

    if (entries.length === 0) {
      return new Response(
        JSON.stringify({ status: "no_updates", message: "AI generated no new entries" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deactivate old auto-generated entries (keep manual ones)
    await supabase
      .from("reginald_knowledge_updates")
      .update({ is_active: false })
      .like("category", "%")
      .lt("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Insert new entries
    const newEntries = entries.map((e: any) => ({
      category: e.category || "general",
      title: String(e.title || "").slice(0, 100),
      content: String(e.content || "").slice(0, 500),
      priority: Math.min(Math.max(Number(e.priority) || 0, 0), 10),
      is_active: true,
    }));

    const { error: insertError } = await supabase
      .from("reginald_knowledge_updates")
      .insert(newEntries);

    if (insertError) {
      console.error("[REGINALD-REFRESH] Insert error:", insertError);
      throw insertError;
    }

    console.log(`[REGINALD-REFRESH] Generated ${newEntries.length} knowledge entries`);

    return new Response(
      JSON.stringify({ 
        status: "success", 
        entries_generated: newEntries.length,
        entries: newEntries.map(e => e.title),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[REGINALD-REFRESH] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
