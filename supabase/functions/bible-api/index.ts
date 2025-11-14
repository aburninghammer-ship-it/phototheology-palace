import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Using Bible API
    const url = `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${version}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Bible API returned ${response.status}`);
    }

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
