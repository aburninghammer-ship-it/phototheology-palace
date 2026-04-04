import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Seventh Day Press quarterly URL patterns
const SEVENTH_DAY_PRESS_BASE = "https://seventhdaypress.org/wp-content/uploads";

// Known quarterly URLs - updated quarterly
const QUARTERLY_URLS: Record<string, { url: string; title: string; topic: string }> = {
  "2026-Q2": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2026/03/SS-QUARTERLY_2ND-QTR-2026_GROWING_IN_A_RELATIONSHIP_WITH_GOD_FP.pdf`,
    title: "Growing in a Relationship With God",
    topic: "Christian Growth & Devotion"
  },
  "2026-Q1": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2025/12/SS-QUARTERLY_1ST-QTR-2026_UNITING_HEAVEN_AND_EARTH_FP.pdf`,
    title: "Uniting Heaven and Earth",
    topic: "Philippians & Colossians"
  },
  "2025-Q4": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2025/09/SS-QUARTERLY_4th-QTR-2025_CHRIST_OBJECT_LESSONS_FP.pdf`,
    title: "Christ's Object Lessons",
    topic: "Parables of Jesus"
  },
  "2025-Q3": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2025/07/SS-QUARTERLY_3RD-QTR-2025_CHRIST_OBJECT_LESSONS_FP.pdf`,
    title: "Christ's Object Lessons",
    topic: "Parables of Jesus"
  },
  "2025-Q2": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2025/03/SS-QUARTERLY_2ND-QTR-2025_LESSONS_ON_THE_SANCTUARY_FP.pdf`,
    title: "Lessons on the Sanctuary",
    topic: "The Sanctuary"
  },
  "2025-Q1": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2024/12/DIGITAL_SS-QUARTERLY_1ST-QTR-2025_LESSONS_ON_THE_SANCTUARY.pdf`,
    title: "Lessons on the Sanctuary",
    topic: "The Sanctuary"
  },
  "2024-Q4": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2024/09/SS-QUARTERLY_4TH-QTR-2024_GENESIS.pdf`,
    title: "Book of Genesis",
    topic: "Genesis"
  },
  "2024-Q3": {
    url: `${SEVENTH_DAY_PRESS_BASE}/2024/06/SS-QTRLY_3RD-QTR-2024_GENESIS_REV1.pdf`,
    title: "Book of Genesis",
    topic: "Genesis"
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year, quarter } = await req.json();
    
    const now = new Date();
    const currentYear = year || now.getFullYear();
    const currentQuarter = quarter || Math.ceil((now.getMonth() + 1) / 3);
    
    const quarterKey = `${currentYear}-Q${currentQuarter}`;
    console.log(`Fetching quarterly for: ${quarterKey}`);
    
    // Check if we have a known URL
    const quarterlyInfo = QUARTERLY_URLS[quarterKey];
    
    if (quarterlyInfo) {
      // Verify the PDF exists
      try {
        const checkResponse = await fetch(quarterlyInfo.url, { method: 'HEAD' });
        if (checkResponse.ok) {
          console.log(`Found quarterly PDF: ${quarterlyInfo.url}`);
          return new Response(
            JSON.stringify({
              success: true,
              quarterly: {
                id: quarterKey,
                title: quarterlyInfo.title,
                topic: quarterlyInfo.topic,
                pdfUrl: quarterlyInfo.url,
                quarter: `Q${currentQuarter} ${currentYear}`,
                source: "Seventh Day Press"
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        console.log(`PDF check failed for ${quarterlyInfo.url}:`, e);
      }
    }
    
    // Try to scrape the sabbath-school page for the latest PDF
    console.log("Attempting to scrape Seventh Day Press sabbath-school page...");
    try {
      const pageResponse = await fetch("https://seventhdaypress.org/sabbath-school/");
      if (pageResponse.ok) {
        const html = await pageResponse.text();
        
        // Find PDF links in the HTML
        const pdfRegex = /https:\/\/seventhdaypress\.org\/wp-content\/uploads\/[^"'\s]+\.pdf/gi;
        const matches = html.match(pdfRegex);
        
        if (matches && matches.length > 0) {
          // The first PDF is typically the current/latest quarterly
          const latestPdfUrl = matches[0];
          console.log(`Found latest PDF via scrape: ${latestPdfUrl}`);
          
          // Try to extract title from the URL or surrounding context
          let title = "Sabbath School Quarterly";
          if (latestPdfUrl.includes("OBJECT_LESSONS")) {
            title = "Christ's Object Lessons";
          } else if (latestPdfUrl.includes("SANCTUARY")) {
            title = "Lessons on the Sanctuary";
          } else if (latestPdfUrl.includes("GENESIS")) {
            title = "Book of Genesis";
          }
          
          return new Response(
            JSON.stringify({
              success: true,
              quarterly: {
                id: quarterKey,
                title: title,
                topic: title,
                pdfUrl: latestPdfUrl,
                quarter: `Q${currentQuarter} ${currentYear}`,
                source: "Seventh Day Press"
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch (scrapeError) {
      console.log("Scrape failed:", scrapeError);
    }
    
    // Fallback - return error with instruction
    return new Response(
      JSON.stringify({
        success: false,
        error: `No quarterly found for ${quarterKey}`,
        availableQuarters: Object.keys(QUARTERLY_URLS)
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching quarterly:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
