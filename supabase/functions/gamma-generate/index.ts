import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GAMMA_API_BASE = "https://public-api.gamma.app/v1.0";

interface GammaGenerateRequest {
  inputText: string;
  format: 'presentation' | 'document' | 'social' | 'webpage';
  themeId?: string;
  numCards?: number;
  cardSplit?: 'auto' | 'inputTextBreaks';
  textOptions?: {
    amount?: 'brief' | 'medium' | 'detailed' | 'extensive';
    tone?: string;
    audience?: string;
    language?: string;
  };
  cardOptions?: {
    dimensions?: string;
  };
  imageOptions?: {
    source?: 'aiGenerated' | 'none';
    model?: string;
    style?: string;
  };
  additionalInstructions?: string;
  exportAs?: 'pdf' | 'pptx';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      apiKey: userApiKey,
      mode,
      sermonData,
      verses,
      settings
    } = body;

    console.log("[gamma-generate] Processing request:", { mode, settings });

    // Use user-provided key (per-user model)
    const apiKey = userApiKey;

    // Validate API key
    if (!apiKey || !apiKey.startsWith('sk-gamma-')) {
      return new Response(
        JSON.stringify({ error: "Gamma API key required. Please add your key in your profile settings." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build input text based on mode
    let inputText = "";
    let title = "Sermon Presentation";

    if (mode === "full-sermon" && sermonData) {
      title = sermonData.title || "Sermon Presentation";
      inputText = buildSermonInputText(sermonData, settings.bibleVersion);
    } else if (mode === "verses-only" && verses && verses.length > 0) {
      title = "Scripture Presentation";
      inputText = buildVersesInputText(verses, settings.bibleVersion);
    } else {
      throw new Error("Invalid mode or missing data");
    }

    // Calculate number of cards based on slideCount setting
    const numCards = settings.slideCount === 'minimal' ? 10
      : settings.slideCount === 'standard' ? 18
      : 30;

    // Build Gamma API request
    const gammaRequest: GammaGenerateRequest = {
      inputText,
      format: 'presentation',
      numCards,
      cardSplit: 'inputTextBreaks',
      textOptions: {
        amount: settings.textAmount || 'medium',
        tone: settings.tone || 'reverent, inspiring, professional',
        audience: settings.audienceType === 'seeker'
          ? 'newcomers to faith, seeking spiritual answers'
          : settings.audienceType === 'believer'
          ? 'mature Christians seeking deeper understanding'
          : 'mixed church congregation',
        language: 'English',
      },
      cardOptions: {
        dimensions: settings.dimensions || '16x9',
      },
      imageOptions: {
        source: settings.imageStyle === 'none' ? 'none' : 'aiGenerated',
        model: 'imagen-4-pro',
        style: settings.imageStyle || 'photorealistic',
      },
      additionalInstructions: `This is a sermon presentation for church worship.
Key requirements:
- Scripture passages should be prominent and readable
- Use professional, reverent design suitable for worship
- Theme passage: ${sermonData?.themePassage || verses?.[0] || 'Not specified'}
- Bible version: ${settings.bibleVersion || 'KJV'}
- Create visual continuity throughout the presentation
- End with a compelling call to action`,
    };

    // Add export option if requested
    if (settings.exportAs) {
      gammaRequest.exportAs = settings.exportAs;
    }

    console.log("[gamma-generate] Calling Gamma API with", numCards, "cards");

    // Call Gamma API
    const gammaResponse = await fetch(`${GAMMA_API_BASE}/generations`, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gammaRequest),
    });

    if (!gammaResponse.ok) {
      const errorText = await gammaResponse.text();
      console.error("[gamma-generate] Gamma API error:", gammaResponse.status, errorText);

      if (gammaResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: "Invalid Gamma API key. Please check your API key in Settings." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (gammaResponse.status === 403) {
        return new Response(
          JSON.stringify({ error: "Gamma API access denied. Check your credit balance or subscription." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (gammaResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Gamma rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Gamma API error: ${gammaResponse.status} - ${errorText}`);
    }

    const gammaData = await gammaResponse.json();
    console.log("[gamma-generate] Gamma response:", gammaData);

    // If generation is async, poll for completion
    if (gammaData.status === 'pending' || gammaData.status === 'processing') {
      const generationId = gammaData.id;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max (5 second intervals)

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        const statusResponse = await fetch(`${GAMMA_API_BASE}/generations/${generationId}`, {
          headers: { "X-API-KEY": apiKey },
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to check generation status: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        console.log("[gamma-generate] Poll attempt", attempts + 1, "status:", statusData.status);

        if (statusData.status === 'completed') {
          return new Response(JSON.stringify({
            success: true,
            title: statusData.title || title,
            gammaUrl: statusData.gammaUrl,
            exportUrl: statusData.exportUrl,
            numCards: statusData.numCards,
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Gamma generation failed');
        }

        attempts++;
      }

      throw new Error('Generation timed out. Please try again.');
    }

    // Immediate completion
    return new Response(JSON.stringify({
      success: true,
      title: gammaData.title || title,
      gammaUrl: gammaData.gammaUrl,
      exportUrl: gammaData.exportUrl,
      numCards: gammaData.numCards,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[gamma-generate] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper to build sermon content for Gamma
function buildSermonInputText(sermonData: any, bibleVersion: string): string {
  const sections: string[] = [];

  // Title slide content
  sections.push(`# ${sermonData.title}`);
  if (sermonData.themePassage) {
    sections.push(`Theme Passage: ${sermonData.themePassage}`);
  }

  sections.push('\n---\n');

  // Opening/Hook
  if (sermonData.movieStructure?.opening) {
    sections.push(`## Opening`);
    sections.push(cleanHtml(sermonData.movieStructure.opening));
    sections.push('\n---\n');
  }

  // Main Points (Smooth Stones)
  if (sermonData.smoothStones && sermonData.smoothStones.length > 0) {
    sermonData.smoothStones.forEach((stone: string, idx: number) => {
      sections.push(`## Point ${idx + 1} of ${sermonData.smoothStones.length}`);
      sections.push(cleanHtml(stone));

      // Add bridge if available
      if (sermonData.bridges && sermonData.bridges[idx]) {
        sections.push(`\nTransition: ${cleanHtml(sermonData.bridges[idx])}`);
      }
      sections.push('\n---\n');
    });
  }

  // Climax
  if (sermonData.movieStructure?.climax) {
    sections.push(`## Climax`);
    sections.push(cleanHtml(sermonData.movieStructure.climax));
    sections.push('\n---\n');
  }

  // Resolution
  if (sermonData.movieStructure?.resolution) {
    sections.push(`## Resolution`);
    sections.push(cleanHtml(sermonData.movieStructure.resolution));
    sections.push('\n---\n');
  }

  // Call to Action / Application
  if (sermonData.movieStructure?.call_to_action) {
    sections.push(`## Call to Action`);
    sections.push(cleanHtml(sermonData.movieStructure.call_to_action));
  }

  // If full sermon is available, append key excerpts
  if (sermonData.fullSermon && sermonData.fullSermon.length > 0) {
    const maxLength = 30000;
    const sermonExcerpt = sermonData.fullSermon.length > maxLength
      ? cleanHtml(sermonData.fullSermon.substring(0, maxLength)) + '...'
      : cleanHtml(sermonData.fullSermon);

    sections.push('\n---\n');
    sections.push(`## Sermon Content`);
    sections.push(sermonExcerpt);
  }

  return sections.join('\n');
}

// Helper to build verses-only content
function buildVersesInputText(verses: string[], bibleVersion: string): string {
  const sections: string[] = [];

  sections.push(`# Scripture Presentation`);
  sections.push(`Bible Version: ${bibleVersion}`);
  sections.push('\n---\n');

  verses.forEach((verse, idx) => {
    sections.push(`## ${verse}`);
    sections.push(`Display this Scripture passage (${bibleVersion}) prominently and beautifully.`);
    if (idx < verses.length - 1) {
      sections.push('\n---\n');
    }
  });

  sections.push('\n---\n');
  sections.push('## Application');
  sections.push('What do these scriptures teach us? How should we respond?');

  return sections.join('\n');
}

// Clean HTML tags from content
function cleanHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}
