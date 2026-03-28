import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tour metadata (mirrors client-side tour definitions)
const TOUR_META: Record<string, { title: string; subtitle: string; verse: string; verseText: string; emoji: string; duration: string }> = {
  "hook": {
    title: "The 3-Minute Taste",
    subtitle: "One passage. One method. Mind blown.",
    verse: "Psalm 23",
    verseText: "The LORD is my shepherd; I shall not want.",
    emoji: "⚡",
    duration: "3 min",
  },
  "psalm23-guided": {
    title: "Psalm 23 — Guided Tour",
    subtitle: "Five rooms, one shepherd, infinite depth.",
    verse: "Psalm 23",
    verseText: "The LORD is my shepherd; I shall not want.",
    emoji: "🌿",
    duration: "10 min",
  },
  "phil2-guided": {
    title: "Philippians 2:5 — Guided Tour",
    subtitle: "Five rooms reveal the mind of Christ.",
    verse: "Philippians 2:5-11",
    verseText: "Let this mind be in you, which was also in Christ Jesus.",
    emoji: "👑",
    duration: "10 min",
  },
  "psalm23": {
    title: "Psalm 23 — Deep Immersion",
    subtitle: "Every room, every floor, every principle.",
    verse: "Psalm 23",
    verseText: "The LORD is my shepherd; I shall not want.",
    emoji: "🏰",
    duration: "18 min",
  },
  "phil2-5": {
    title: "Philippians 2:5 — Deep Immersion",
    subtitle: "The full Palace experience on Christ's humility.",
    verse: "Philippians 2:5-11",
    verseText: "Let this mind be in you, which was also in Christ Jesus.",
    emoji: "🏰",
    duration: "18 min",
  },
  "suite-tour": {
    title: "The Complete PhototheologyOS Tour",
    subtitle: "Every tool in the Phototheology platform.",
    verse: "Psalm 119:18",
    verseText: "Open thou mine eyes, that I may behold wondrous things out of thy law.",
    emoji: "🎙️",
    duration: "15 min",
  },
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const tourId = url.searchParams.get('tour');

    if (!tourId) {
      return new Response(JSON.stringify({ error: 'Missing tour parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tour = TOUR_META[tourId];
    if (!tour) {
      return new Response(JSON.stringify({ error: 'Tour not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const title = `🎧 ${tour.title} — Phototheology Palace`;
    const description = `${tour.subtitle} "${tour.verseText}" — A ${tour.duration} guided audio tour through the Phototheology Palace.`;
    const ogImage = 'https://phototheologybible.com/phototheology-hero.png';
    const shareUrl = `https://phototheologybible.com/palace/tour?tour=${tourId}`;

    const userAgent = req.headers.get('user-agent') || '';
    const isCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|Googlebot|bingbot/i.test(userAgent);

    if (isCrawler) {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="music.song" />
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
  
  <!-- Redirect real users to the app -->
  <meta http-equiv="refresh" content="0;url=${shareUrl}" />
</head>
<body>
  <h1>${escapeHtml(tour.title)}</h1>
  <p>${escapeHtml(description)}</p>
  <p>Listen now at <a href="${shareUrl}">Phototheology Palace</a></p>
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

    // Regular API request — return JSON
    return new Response(JSON.stringify({
      title: tour.title,
      description,
      image: ogImage,
      url: shareUrl,
      tour: { id: tourId, ...tour },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('OG Palace Tour error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
