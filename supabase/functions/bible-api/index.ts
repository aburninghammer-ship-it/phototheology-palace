import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with retry logic for rate limiting
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 1s, 2s, 4s
      const waitTime = Math.pow(2, attempt) * 500;
      console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
      await delay(waitTime);
    }

    const response = await fetch(url);

    if (response.ok) {
      return response;
    }

    // Check if it's a rate limit error (429)
    if (response.status === 429) {
      console.error(`Bible API rate limited: ${response.status}`);
      lastError = new Error(`Rate limited: ${response.status}`);
      continue; // Retry
    }

    // For other errors, don't retry
    throw new Error(`Bible API returned ${response.status}`);
  }

  throw lastError || new Error('Max retries exceeded for Bible API');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { book, chapter, version = 'kjv' } = await req.json();
    
    if (!book || !chapter) {
      throw new Error('Book and chapter are required');
    }

    console.log(`Fetching ${book} ${chapter} (${version})`);

    // Using Bible API with retry logic
    const url = `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${version}`;
    
    const response = await fetchWithRetry(url);

    const data = await response.json();
    
    if (!data.verses || data.verses.length === 0) {
      throw new Error('No verses found');
    }

    // Format verses consistently
    const verses = data.verses.map((v: any) => ({
      book: data.reference.split(' ')[0],
      chapter: data.reference.split(' ')[1]?.split(':')[0] || chapter,
      verse: v.verse,
      text: v.text
    }));

    return new Response(
      JSON.stringify({ verses }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bible-api function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Bible text';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
