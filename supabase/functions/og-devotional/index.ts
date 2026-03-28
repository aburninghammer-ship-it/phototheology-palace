import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shareToken = url.searchParams.get('token');

    if (!shareToken) {
      return new Response(JSON.stringify({ error: 'Missing share token' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the devotional plan
    const { data: plan, error: planError } = await supabase
      .from('devotional_plans')
      .select('*')
      .eq('share_token', shareToken)
      .eq('is_public', true)
      .single();

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: 'Devotional not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the first day for preview content
    const { data: days } = await supabase
      .from('devotional_days')
      .select('*')
      .eq('plan_id', plan.id)
      .order('day_number', { ascending: true })
      .limit(1);

    const firstDay = days?.[0];

    // Build the OG data
    const title = plan.title || 'Shared Devotional';
    const description = firstDay?.devotional_text
      ? firstDay.devotional_text.substring(0, 200) + '...'
      : firstDay?.christ_connection
        ? firstDay.christ_connection.substring(0, 200) + '...'
        : `A ${plan.duration}-day devotional journey on: ${plan.theme}`;
    
    const ogImage = 'https://phototheologybible.com/phototheology-hero.png';
    const shareUrl = `https://phototheologybible.com/shared-devotional/${shareToken}`;

    // Return OG meta data as JSON (for API use) or as HTML for crawlers
    const userAgent = req.headers.get('user-agent') || '';
    const isCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot/i.test(userAgent);

    if (isCrawler) {
      // Serve HTML with meta tags for crawlers
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} | Phototheology</title>
  <meta name="description" content="${escapeHtml(description)}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${shareUrl}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="PhototheologyOS" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  
  <!-- Redirect to actual page for users -->
  <meta http-equiv="refresh" content="0;url=${shareUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${shareUrl}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

      return new Response(html, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // For regular API requests, return JSON
    return new Response(JSON.stringify({
      title,
      description,
      image: ogImage,
      url: shareUrl,
      plan: {
        id: plan.id,
        title: plan.title,
        theme: plan.theme,
        duration: plan.duration,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OG Devotional error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
