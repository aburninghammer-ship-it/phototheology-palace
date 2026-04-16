import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorpusContext } from '../_shared/corpus-rag.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 7-day rotation: Sunday=0 through Saturday=6
const ROTATION_CATEGORIES = [
  "Sanctuary",        // Sunday
  "Typology",         // Monday
  "Prophecy",         // Tuesday
  "Character of God", // Wednesday
  "Law & Gospel",     // Thursday
  "Hidden Patterns",  // Friday
  "Great Controversy", // Saturday
] as const;

function getTodayCategory(): string {
  const dayOfWeek = new Date().getDay(); // 0=Sun, 6=Sat
  return ROTATION_CATEGORIES[dayOfWeek];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('Missing LOVABLE_API_KEY');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Auth: extract user
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Admin check
    const { data: adminCheck } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!adminCheck) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const body = await req.json().catch(() => ({}));
    const category = body.category || getTodayCategory();

    // RAG corpus context
    const ragResult = await getCorpusContext({
      query: `${category} Bible teaching viral insight hidden connection`,
      matchCount: 3,
      supabaseClient: supabase,
    });

    let corpusSection = '';
    if (ragResult.chunkCount > 0) {
      corpusSection = ragResult.corpusContext;
    }

    const systemPrompt = `You are a viral theological content specialist for Pastor Ivor Myers' social media ministry. Your job is to mine HIGH-IMPACT THEOLOGICAL MICRO-REVELATIONS — the kind of insight that makes someone stop scrolling, share immediately, and think about for days.

TODAY'S CATEGORY: ${category}

CATEGORY GUIDELINES:
- Sanctuary: Connections between the earthly/heavenly sanctuary and daily life, the gospel, or prophecy
- Typology: Old Testament types pointing to Christ with precision that proves divine authorship
- Prophecy: Daniel/Revelation insights, prophetic timelines, or fulfilled predictions that build faith
- Character of God: Attributes of God revealed through unexpected Bible stories or patterns
- Law & Gospel: How God's law and grace work together (not against each other), practical applications
- Hidden Patterns: Chiastic structures, number patterns, Hebrew/Greek wordplay, literary devices
- Great Controversy: The cosmic conflict between Christ and Satan as seen in Scripture and history

GEM SELECTION CRITERIA:
1. Must be genuinely surprising — not a "well-known" insight
2. Must be provable from Scripture (KJV)
3. Must connect to the PhotoTheology Palace method when possible
4. Must be emotionally compelling — awe, wonder, or conviction
5. Must be expressible in 60 seconds or less when spoken aloud
6. Should feel like a "secret" being revealed for the first time

VIRAL DELIVERY RULES:
1. Open with a HOOK that creates an information gap (question, paradox, or bold claim)
2. The transcript must be TELEPROMPTER-READY — written exactly as it should be spoken
3. Use short sentences. Dramatic pauses (marked with "..."). Build to a climax.
4. End with a mic-drop moment or rhetorical question
5. NO academic language. Speak like you're telling a friend the coolest thing you just discovered
6. Target length: 130-160 words for the transcript (fits ~60 seconds spoken)

CRITICAL THEOLOGICAL GUARDRAILS:
- AZAZEL = SATAN, NOT CHRIST: The scapegoat (Azazel) in Leviticus 16 represents SATAN. The LORD's goat (slain) = Christ. NEVER identify the scapegoat as Jesus in any way.
- Christ entered the HOLY PLACE at His ASCENSION in 31 AD; MOST HOLY PLACE in 1844
- Spring feasts = First Advent (Passover = Cross, NOT Day of Atonement)
- Fall feasts = Second Advent ministry (Day of Atonement = 1844 judgment)

PHOTOTHEOLOGY INTEGRATION:
- Reference Palace rooms where the insight comes from (Story Room, Observation Room, Symbols Room, etc.)
- Connect to sanctuary typology when relevant
- Use the historicist prophetic framework
- Apply Christ-centered hermeneutics

${corpusSection}

OUTPUT FORMAT — Use EXACTLY these section headers:

GEM TITLE: [A punchy, clickbait-worthy but truthful title, 5-10 words]

THE GEM: [The core insight in 1-2 sentences — what makes this remarkable]

60-SECOND VIDEO TRANSCRIPT:
[The full teleprompter-ready script. Written EXACTLY as it should be spoken aloud. 130-160 words. Include natural pauses marked with "..." and emphasis with CAPS for key words.]

KEY SCRIPTURE: [One primary KJV verse, fully quoted with reference]

CTA: [A compelling call-to-action for viewers, 1-2 sentences, directing them to dig deeper or share]`;

    const userPrompt = `Mine a ${category} gem for today's viral clip. Make it something no one has heard before — the kind of insight that gets shared 10,000 times. Remember: teleprompter-ready, 60 seconds, mic-drop ending.`;

    // Call AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.95,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'No error body');
      console.error(`AI service error: ${response.status}, body: ${errorBody}`);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limited. Please wait a minute and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI service error: ${response.status}`);
    }

    const aiData = await response.json();
    const fullContent = aiData.choices?.[0]?.message?.content || '';

    if (!fullContent) {
      throw new Error('Empty AI response');
    }

    // Parse sections from the response
    const titleMatch = fullContent.match(/GEM TITLE:\s*(.+?)(?:\n|$)/i);
    const gemMatch = fullContent.match(/THE GEM:\s*([\s\S]+?)(?=\n\s*60-SECOND|$)/i);
    const transcriptMatch = fullContent.match(/60-SECOND VIDEO TRANSCRIPT:\s*([\s\S]+?)(?=\n\s*KEY SCRIPTURE:|$)/i);
    const scriptureMatch = fullContent.match(/KEY SCRIPTURE:\s*([\s\S]+?)(?=\n\s*CTA:|$)/i);
    const ctaMatch = fullContent.match(/CTA:\s*([\s\S]+?)$/i);

    const title = titleMatch?.[1]?.trim() || 'Untitled Gem';
    const gemInsight = gemMatch?.[1]?.trim() || '';
    const transcript = transcriptMatch?.[1]?.trim() || '';
    const scripture = scriptureMatch?.[1]?.trim() || '';
    const cta = ctaMatch?.[1]?.trim() || '';

    // Store in database
    const { data: inserted, error: insertError } = await supabase
      .from('daily_gem_clips')
      .insert({
        category,
        title,
        gem_insight: gemInsight,
        transcript,
        scripture,
        cta,
        full_content: fullContent,
        generated_by: userId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      // Still return the content even if storage fails
      return new Response(
        JSON.stringify({
          id: null,
          category,
          title,
          gem_insight: gemInsight,
          transcript,
          scripture,
          cta,
          full_content: fullContent,
          warning: 'Generated but failed to save to database',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(inserted),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('generate-daily-gem-clip error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
