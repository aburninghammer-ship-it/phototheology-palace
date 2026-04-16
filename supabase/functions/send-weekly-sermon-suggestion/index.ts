import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const weekNumber = Math.ceil(
      (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    const year = now.getFullYear();

    // Check if suggestion already sent this week
    const { data: existing } = await supabase
      .from("weekly_sermon_suggestions")
      .select("id")
      .eq("week_number", weekNumber)
      .eq("year", year)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ message: "Suggestion already sent this week" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get a featured sermon topic or random one
    const { data: topic, error: topicError } = await supabase
      .from("sermon_topics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (topicError || !topic || topic.length === 0) {
      // Generate suggestion without topic reference
      const suggestion = {
        week_number: weekNumber,
        year,
        title: "The Everlasting Gospel",
        preview: "This week, consider preaching on the unchanging good news that spans from Genesis to Revelation - the sanctuary reveals Christ's complete work of salvation.",
        anchor_passage: "Revelation 14:6-7",
      };

      await supabase.from("weekly_sermon_suggestions").insert(suggestion);
    } else {
      // Pick a random featured topic
      const randomTopic = topic[Math.floor(Math.random() * topic.length)];

      const suggestion = {
        week_number: weekNumber,
        year,
        topic_id: randomTopic.id,
        title: randomTopic.title,
        preview: randomTopic.summary?.substring(0, 200) || `Explore the depths of "${randomTopic.title}" this week with PT principles.`,
        anchor_passage: randomTopic.anchor_scriptures?.[0] || "",
        sent_at: now.toISOString(),
      };

      await supabase.from("weekly_sermon_suggestions").insert(suggestion);

      // Create notifications for all users who want sermon suggestions
      const { data: users } = await supabase
        .from("profiles")
        .select("id")
        .limit(1000); // Batch limit

      if (users && users.length > 0) {
        const notifications = users.map((user) => ({
          user_id: user.id,
          type: "weekly_sermon_suggestion",
          title: `Sermon Idea: ${randomTopic.title}`,
          message: suggestion.preview,
          link: `/sermon-topics/${randomTopic.slug || randomTopic.id}`,
          metadata: {
            topic_id: randomTopic.id,
            anchor_passage: suggestion.anchor_passage,
          },
        }));

        // Insert in batches
        for (let i = 0; i < notifications.length; i += 100) {
          const batch = notifications.slice(i, i + 100);
          await supabase.from("notifications").insert(batch);
        }
      }

      // Broadcast live notification
      const channel = supabase.channel("sermon-suggestion");
      await channel.send({
        type: "broadcast",
        event: "weekly-sermon-suggestion",
        payload: {
          title: randomTopic.title,
          preview: suggestion.preview,
          anchor_passage: suggestion.anchor_passage,
        },
      });
    }

    return new Response(
      JSON.stringify({ success: true, week: weekNumber, year }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Weekly sermon suggestion error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
