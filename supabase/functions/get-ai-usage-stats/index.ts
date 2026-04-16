import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No auth header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Not authenticated");

    const { scope } = await req.json().catch(() => ({ scope: "user" }));

    // Check if admin
    const { data: adminCheck } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);
    const isAdmin = adminCheck && adminCheck.length > 0;

    if (scope === "admin" && !isAdmin) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (scope === "admin") {
      // Admin: aggregate stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      // Total stats (last 30 days)
      const { data: monthlyStats } = await supabase
        .from("ai_usage_log")
        .select("function_name, model, prompt_tokens, completion_tokens, total_tokens, estimated_cost_cents, user_id, created_at")
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: false })
        .limit(1000);

      const stats = monthlyStats || [];

      // Aggregate by function
      const byFunction: Record<string, { calls: number; tokens: number; cost: number }> = {};
      const byModel: Record<string, { calls: number; tokens: number; cost: number }> = {};
      const byUser: Record<string, { calls: number; tokens: number; cost: number }> = {};
      const dailyCosts: Record<string, number> = {};
      let totalCost = 0;
      let totalTokens = 0;
      let totalCalls = 0;
      let todayCost = 0;
      let weekCost = 0;

      for (const row of stats) {
        const cost = Number(row.estimated_cost_cents) || 0;
        const tokens = row.total_tokens || 0;
        const fn = row.function_name || "unknown";
        const model = row.model || "unknown";
        const uid = row.user_id || "unknown";
        const day = (row.created_at || "").slice(0, 10);

        totalCost += cost;
        totalTokens += tokens;
        totalCalls++;

        if (row.created_at >= todayStart) todayCost += cost;
        if (row.created_at >= sevenDaysAgo) weekCost += cost;

        if (!byFunction[fn]) byFunction[fn] = { calls: 0, tokens: 0, cost: 0 };
        byFunction[fn].calls++;
        byFunction[fn].tokens += tokens;
        byFunction[fn].cost += cost;

        if (!byModel[model]) byModel[model] = { calls: 0, tokens: 0, cost: 0 };
        byModel[model].calls++;
        byModel[model].tokens += tokens;
        byModel[model].cost += cost;

        if (!byUser[uid]) byUser[uid] = { calls: 0, tokens: 0, cost: 0 };
        byUser[uid].calls++;
        byUser[uid].tokens += tokens;
        byUser[uid].cost += cost;

        if (!dailyCosts[day]) dailyCosts[day] = 0;
        dailyCosts[day] += cost;
      }

      // Sort by cost descending
      const topFunctions = Object.entries(byFunction)
        .map(([name, s]) => ({ name, ...s }))
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 20);

      const topModels = Object.entries(byModel)
        .map(([name, s]) => ({ name, ...s }))
        .sort((a, b) => b.cost - a.cost);

      const topUsers = Object.entries(byUser)
        .map(([userId, s]) => ({ userId, ...s }))
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 20);

      const dailyTrend = Object.entries(dailyCosts)
        .map(([date, cost]) => ({ date, cost }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return new Response(JSON.stringify({
        summary: {
          totalCalls,
          totalTokens,
          totalCostCents: Math.round(totalCost * 100) / 100,
          todayCostCents: Math.round(todayCost * 100) / 100,
          weekCostCents: Math.round(weekCost * 100) / 100,
          monthCostCents: Math.round(totalCost * 100) / 100,
          uniqueUsers: Object.keys(byUser).length,
        },
        topFunctions,
        topModels,
        topUsers,
        dailyTrend,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // User scope: personal usage
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: userStats } = await supabase
      .from("ai_usage_log")
      .select("function_name, model, total_tokens, estimated_cost_cents, created_at")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })
      .limit(500);

    const rows = userStats || [];
    let totalCalls = 0;
    let totalTokens = 0;
    let totalCost = 0;
    const byFeature: Record<string, { calls: number; tokens: number }> = {};

    for (const row of rows) {
      totalCalls++;
      totalTokens += row.total_tokens || 0;
      totalCost += Number(row.estimated_cost_cents) || 0;
      const fn = row.function_name || "unknown";
      if (!byFeature[fn]) byFeature[fn] = { calls: 0, tokens: 0 };
      byFeature[fn].calls++;
      byFeature[fn].tokens += row.total_tokens || 0;
    }

    const topFeatures = Object.entries(byFeature)
      .map(([name, s]) => ({ name, ...s }))
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 10);

    return new Response(JSON.stringify({
      totalCalls,
      totalTokens,
      totalCostCents: Math.round(totalCost * 100) / 100,
      topFeatures,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
