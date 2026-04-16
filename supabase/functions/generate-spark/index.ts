import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash for content deduplication
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Generate a discovery spark based on user content
async function fetchKjvTextFromBibleApi(reference: string): Promise<string | null> {
  try {
    const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`;
    const resp = await fetch(url);

    if (!resp.ok) {
      console.warn('Bible API error:', resp.status, reference);
      return null;
    }

    const data = await resp.json();

    if (Array.isArray(data?.verses) && data.verses.length > 0) {
      return data.verses
        .map((v: any) => (typeof v?.text === 'string' ? v.text.trim() : ''))
        .filter(Boolean)
        .join(' ');
    }

    if (typeof data?.text === 'string' && data.text.trim()) {
      return data.text.trim();
    }

    return null;
  } catch (err) {
    console.warn('Bible API fetch failed for', reference, err);
    return null;
  }
}

// Generate a discovery spark based on user content
async function generateSpark(
  content: string,
  verseReference: string | undefined,
  surface: string,
  contextType: string,
  mode: 'beginner' | 'standard' | 'master',
  apiKey: string,
  triggerType?: 'dwell' | 'output',
  outputTitle?: string,
  userName?: string,
  recentTitles?: string[],
  recentInsights?: string[]
): Promise<{
  spark_type: 'connection' | 'pattern' | 'application';
  title: string;
  recognition: string;
  insight: string;
  explore: {
    label: string;
    targets: string[];
    mode: string;
  };
  confidence: number;
  novelty_score: number;
  content_hash: string;
} | null> {
  
  const modeInstructions = {
    beginner: 'Focus on clear, foundational connections that are highly relevant and easy to understand. Prioritize practical applications.',
    standard: 'Balance relevance and novelty. Include typological or thematic connections that deepen understanding.',
    master: 'Prioritize novel, unexpected connections. Surface deep patterns, prophetic links, or sanctuary parallels that even advanced students might miss.'
  };

  // Adjust recognition for output-triggered sparks
  const outputContext = triggerType === 'output' 
    ? `This spark is triggered AFTER the user saved their work${outputTitle ? ` titled "${outputTitle}"` : ''}. Acknowledge their completion and build upon it.`
    : '';

  // Personal greeting with user's name
  const personalGreeting = userName
    ? `Address the user warmly by name as "Hey ${userName}" or similar in the recognition line.`
    : '';

  // Deduplication instruction based on recent sparks — include titles AND insight summaries
  const insights = recentInsights || [];
  const deduplicationInstruction = recentTitles && recentTitles.length > 0
    ? `\n⚠️ CRITICAL — DO NOT REPEAT. The user has already seen these sparks:
${recentTitles.slice(0, 15).map((t: string, i: number) => {
  const insight = insights[i];
  return insight ? `- "${t}" → ${insight.slice(0, 80)}…` : `- "${t}"`;
}).join('\n')}

HARD RULES FOR UNIQUENESS:
1. Do NOT restate the same theological point in different words.
2. Do NOT cover the same Scripture passage from a slightly different angle.
3. Do NOT generate a spark whose core idea overlaps with ANY spark above.
4. Each spark must introduce a GENUINELY NEW concept, connection, or application.
5. If you cannot produce something truly novel, return an empty JSON object: {}
6. Better to generate nothing than to repeat.`
    : '';

  let systemPrompt = `You are Jeeves, a Phototheology discovery engine. Your task is to generate ONE high-quality "Discovery Spark" based on the user's study content.

⚠️ THEOLOGICAL GUARDRAILS (NON-NEGOTIABLE):
- AZAZEL = SATAN, NOT CHRIST (Leviticus 16 scapegoat = Satan)
- LITTLE HORN = ROME/PAPACY, NOT ANTIOCHUS (Daniel 7 & 8)
- TWO-PHASE SANCTUARY: Holy Place at ascension (31 AD); Most Holy Place in 1844
- DAY OF ATONEMENT = 1844, NOT THE CROSS (Christ's death = Passover)
- SPRING FEASTS = First Advent; FALL FEASTS = Second Advent ministry

A Discovery Spark surfaces hidden connections, patterns, or applications that the student may not have noticed.

${modeInstructions[mode]}
${outputContext}
${personalGreeting}
${deduplicationInstruction}

RULES:
- Generate exactly ONE spark
- Choose the most appropriate type: "connection" (links passages/themes), "pattern" (structure/typology/sequence), or "application" (practice/discipleship)
- Title should be evocative and memorable (3-6 words)
- Recognition should ${userName ? `start with a warm greeting using "${userName}" and then ` : ''}acknowledge what the user ${triggerType === 'output' ? 'just completed' : 'is studying'} (1 line)
- Insight should be substantive but focused (3-6 sentences)
- ALWAYS include 3-5 related Scripture references in the explore.targets array - this is REQUIRED
- Be Christ-centered when natural
- IMPORTANT: If you mention Scripture wording, it MUST be KJV and exact. If you are not 100% sure of the exact KJV wording, do NOT quote it—only cite the reference.
- No markdown formatting
- Use warm, scholarly tone

OUTPUT FORMAT (JSON only, no markdown):
{
  "spark_type": "connection" | "pattern" | "application",
  "title": "Short Evocative Title",
  "recognition": "${userName ? `Hey ${userName}, ` : ''}What you're noticing in their study...",
  "insight": "The substantive insight here...",
  "explore": {
    "label": "Explore this idea",
    "targets": ["Genesis 22:8", "Isaiah 53:7", "John 1:29"],
    "mode": "trace"
  },
  "confidence": 0.85,
  "novelty_score": 0.75
}`;

  const userPrompt = `User${userName ? ` (${userName})` : ''} ${triggerType === 'output' ? 'just saved/completed' : 'is studying'}${verseReference ? ` (${verseReference})` : ''} on ${surface}:

${content}

Generate ONE discovery spark that would genuinely deepen their understanding${triggerType === 'output' ? ' and celebrate their work' : ''}.`;

  // RAG corpus injection
  const ragResult = await getCorpusContext({
    query: content.slice(0, 4000),
    matchCount: 2,
  });
  if (ragResult.chunkCount > 0) {
    systemPrompt += ragResult.corpusContext;
  }

  console.log('Generating spark for', surface, 'context...');

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return null;
    }

    const aiData = await response.json();
    const rawContent = aiData.choices[0]?.message?.content;

    if (!rawContent) {
      console.error('No content in AI response');
      return null;
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = rawContent.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);

    // If AI returned empty object (nothing novel to say), skip
    if (!parsed.title || !parsed.insight) {
      console.log('⏭️ AI declined to generate — no novel spark available');
      return null;
    }

    return {
      ...parsed,
      content_hash: hashContent(content)
    };
  } catch (err) {
    console.error('Error generating spark:', err);
    return null;
  }
}

// Generate explore flow content
async function generateExploreContent(
  exploreMode: 'trace' | 'apply' | 'build',
  spark: { title: string; insight: string; spark_type: string; targets: string[] },
  apiKey: string
): Promise<string> {

  const targets = Array.isArray(spark.targets) ? spark.targets.slice(0, 6) : [];
  const kjvPackets = await Promise.all(
    targets.map(async (ref) => ({ ref, text: await fetchKjvTextFromBibleApi(ref) }))
  );

  const kjvQuotesBlock = kjvPackets
    .filter((p) => p.text)
    .map((p) => `- ${p.ref}: "${(p.text as string).replace(/\s+/g, ' ').trim()}"`)
    .join('\n');

  const kjvRules = `CRITICAL KJV RULES:\n- Every Scripture quotation MUST be KJV and MUST match EXACTLY.\n- Use ONLY the KJV quotes provided below verbatim (copy/paste).\n- If a reference is not listed below, DO NOT quote it—only cite the reference.\n\nKJV QUOTES (verbatim):\n${kjvQuotesBlock || '(none available; cite references only)'}`;

  const modePrompts = {
    trace: `Based on this spark insight:\n"${spark.insight}"\n\nProvide a brief guided trace through these related passages: ${targets.join(', ')}\n\n${kjvRules}\n\nFor each passage:\n1. Give the reference\n2. Include the exact KJV quote (if provided above)\n3. Show how it connects to the original insight\n4. Build toward a unified understanding\n\nKeep it concise (200-300 words). Use warm, scholarly tone. No markdown.`,

    apply: `Based on this spark insight:\n"${spark.insight}"\n\n${kjvRules}\n\nGenerate a personal application reflection prompt that helps the reader:\n1. Consider how this truth applies to their life\n2. Identify a specific area for growth\n3. Propose one concrete action step\n\nKeep it conversational and encouraging (150-200 words). No markdown.`,

    build: `Based on this spark insight:\n"${spark.insight}"\n\n${kjvRules}\n\nCreate a brief structured mini-study outline:\n1. Central Truth (1-2 sentences)\n2. Key Passages (list 3-4 with brief notes; cite references; only quote if provided above)\n3. Christ Connection (how this points to Jesus)\n4. Personal Challenge (one action item)\n\nKeep it concise and actionable (200-250 words). No markdown.`
  };

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'user', content: modePrompts[exploreMode] }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const aiData = await response.json();
  return aiData.choices[0]?.message?.content || 'Unable to generate content.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { content, verseReference, surface, contextType, contextId, mode, exploreMode, spark, recentHashes, triggerType, outputTitle, contextData } = body;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Initialize Supabase client to fetch user info
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get user name from auth header or context
    let userName: string | undefined;
    
    // For guesthouse guests, use the provided guest name
    if (contextData?.guestName) {
      userName = contextData.guestName;
      console.log('Using guest name:', userName);
    } else {
      // For authenticated users, try to get from auth token
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        try {
          const token = authHeader.replace('Bearer ', '');
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user?.id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, username')
              .eq('id', user.id)
              .single();
            
            userName = profile?.display_name || profile?.username || undefined;
            console.log('Using authenticated user name:', userName);
          }
        } catch (err) {
          console.log('Could not fetch user profile:', err);
        }
      }
    }

    // Handle explore mode
    if (mode === 'explore' && exploreMode && spark) {
      console.log('Generating explore content for mode:', exploreMode);
      const result = await generateExploreContent(exploreMode, spark, LOVABLE_API_KEY);
      return new Response(
        JSON.stringify({ result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle spark generation
    if (!content || !surface) {
      throw new Error('Missing required fields: content and surface');
    }

    // NOVELTY SUPPRESSION: Check if content hash is too similar to recent sparks
    const contentHash = hashContent(content);
    if (recentHashes && Array.isArray(recentHashes)) {
      const isTooSimilar = recentHashes.some((hash: string) => {
        // Check exact match or very similar (same content)
        return hash === contentHash;
      });
      
      if (isTooSimilar) {
        console.log('⏭️ Skipping spark - content too similar to recent spark');
        return new Response(
          JSON.stringify({ spark: null, message: 'Content too similar to recent spark', suppressed: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const generatedSpark = await generateSpark(
      content,
      verseReference,
      surface,
      contextType || 'note_block',
      mode || 'standard',
      LOVABLE_API_KEY,
      triggerType,
      outputTitle,
      userName,
      body.recentTitles,
      body.recentInsights
    );

    if (!generatedSpark) {
      return new Response(
        JSON.stringify({ spark: null, message: 'No spark generated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Generated spark:', generatedSpark.title);

    return new Response(
      JSON.stringify({ spark: generatedSpark }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-spark:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
