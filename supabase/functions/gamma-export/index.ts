import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GammaGenerateRequest {
  inputText: string;
  format: 'presentation' | 'document' | 'social' | 'webpage';
  themeId?: string;
  numCards?: number;
  textOptions?: {
    amount?: 'brief' | 'medium' | 'detailed' | 'extensive';
    tone?: string;
    audience?: string;
    language?: string;
  };
  cardOptions?: {
    dimensions?: 'fluid' | '16x9' | '4x3' | 'pageless' | 'letter' | 'a4' | '1x1' | '4x5' | '9x16';
  };
  imageOptions?: {
    source?: 'aiGenerated' | 'none';
    model?: 'imagen-4-pro' | 'flux-fast-1.1';
    style?: 'photorealistic' | 'illustration' | 'abstract';
  };
  additionalInstructions?: string;
  exportAs?: 'pdf' | 'pptx';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GAMMA_API_KEY = Deno.env.get('GAMMA_API_KEY');
    if (!GAMMA_API_KEY) {
      throw new Error('GAMMA_API_KEY is not configured');
    }

    const { 
      title,
      content,
      format = 'presentation',
      numCards = 10,
      tone = 'reverent, inspiring',
      audience = 'church congregation',
      imageStyle = 'photorealistic',
      dimensions = '16x9',
      textAmount = 'medium',
      additionalInstructions,
      exportAs
    } = await req.json();

    if (!content) {
      throw new Error('Content is required');
    }

    // Build the input text for Gamma
    let inputText = '';
    if (title) {
      inputText += `# ${title}\n\n`;
    }
    inputText += content;

    const gammaRequest: GammaGenerateRequest = {
      inputText,
      format,
      numCards: Math.min(numCards, 60), // Gamma Pro limit
      textOptions: {
        amount: textAmount,
        tone,
        audience,
        language: 'English',
      },
      cardOptions: {
        dimensions,
      },
      imageOptions: {
        source: 'aiGenerated',
        model: 'imagen-4-pro',
        style: imageStyle,
      },
    };

    if (additionalInstructions) {
      gammaRequest.additionalInstructions = additionalInstructions.substring(0, 2000);
    }

    if (exportAs) {
      gammaRequest.exportAs = exportAs;
    }

    console.log('Sending request to Gamma API:', JSON.stringify(gammaRequest, null, 2));

    // Call Gamma API
    const response = await fetch('https://api.gamma.app/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GAMMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gammaRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gamma API error:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid Gamma API key. Please check your API key in settings.');
      }
      if (response.status === 429) {
        throw new Error('Gamma API rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('Gamma API credits exhausted. Please check your Gamma subscription.');
      }
      
      throw new Error(`Gamma API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gamma API response:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gamma-export function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
