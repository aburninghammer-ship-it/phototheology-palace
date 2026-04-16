/**
 * Shared AI Usage Logger
 * 
 * Logs token usage to ai_usage_log table after every AI gateway call.
 * Import in any edge function that calls the Lovable AI gateway.
 * 
 * Usage:
 *   import { logAiUsage, callAiWithTracking } from '../_shared/ai-usage-logger.ts';
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Cost per 1M tokens (cents) — updated for current Lovable AI pricing
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "google/gemini-2.5-pro":          { input: 125,  output: 500 },
  "google/gemini-2.5-flash":        { input: 15,   output: 60 },
  "google/gemini-2.5-flash-lite":   { input: 7.5,  output: 30 },
  "google/gemini-3-flash-preview":  { input: 15,   output: 60 },
  "google/gemini-3-pro-preview":    { input: 125,  output: 500 },
  "openai/gpt-5":                   { input: 500,  output: 1500 },
  "openai/gpt-5-mini":              { input: 30,   output: 120 },
  "openai/gpt-5-nano":              { input: 10,   output: 40 },
  "openai/gpt-5.2":                 { input: 500,  output: 1500 },
};

function estimateCostCents(model: string, promptTokens: number, completionTokens: number): number {
  const costs = MODEL_COSTS[model] || { input: 15, output: 60 }; // default to flash pricing
  return (promptTokens * costs.input + completionTokens * costs.output) / 1_000_000;
}

interface AiUsageParams {
  userId: string;
  functionName: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  metadata?: Record<string, unknown>;
}

/**
 * Log AI usage to the database. Fire-and-forget — errors are swallowed.
 */
export async function logAiUsage(params: AiUsageParams): Promise<void> {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const costCents = estimateCostCents(params.model, params.promptTokens, params.completionTokens);

    await supabase.from("ai_usage_log").insert({
      user_id: params.userId,
      function_name: params.functionName,
      model: params.model,
      prompt_tokens: params.promptTokens,
      completion_tokens: params.completionTokens,
      total_tokens: params.totalTokens,
      estimated_cost_cents: costCents,
      metadata: params.metadata || {},
    });
  } catch (err) {
    console.warn("[ai-usage-logger] Failed to log usage (non-blocking):", err);
  }
}

/**
 * Wrapper: call the Lovable AI gateway and automatically log usage.
 * Returns the full JSON response from the gateway.
 */
export async function callAiWithTracking(opts: {
  userId: string;
  functionName: string;
  model?: string;
  messages: Array<{ role: string; content: string }>;
  tools?: unknown[];
  tool_choice?: unknown;
  temperature?: number;
  max_tokens?: number;
}): Promise<{ response: any; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const model = opts.model || "google/gemini-2.5-flash";

  const body: Record<string, unknown> = {
    model,
    messages: opts.messages,
    stream: false,
  };
  if (opts.tools) body.tools = opts.tools;
  if (opts.tool_choice) body.tool_choice = opts.tool_choice;
  if (opts.temperature !== undefined) body.temperature = opts.temperature;
  if (opts.max_tokens !== undefined) body.max_tokens = opts.max_tokens;

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`AI gateway error ${resp.status}: ${errorText}`);
  }

  const data = await resp.json();

  const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

  // Fire-and-forget logging
  logAiUsage({
    userId: opts.userId,
    functionName: opts.functionName,
    model,
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    metadata: { has_tools: !!opts.tools },
  });

  return { response: data, usage };
}
