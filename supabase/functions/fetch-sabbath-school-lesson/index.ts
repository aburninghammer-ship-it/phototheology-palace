import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Multiple API sources for redundancy
const ADVENTECH_API = "https://sabbath-school.adventech.io/api/v2";
const DURESA_API = "https://sabbathschool.duresa.com.et/api/v1";

interface DayContent {
  id: string;
  title: string;
  date: string;
  content: string;
  read: string;
}

interface LessonResult {
  lesson: {
    id: string;
    title: string;
    bible_reading: string;
  };
  days: DayContent[];
}

/**
 * Try Adventech API first (most reliable, has full content)
 * Format: /api/v2/{lang}/quarterlies/{quarterId}/lessons/{lessonId}/days/{dayId}/read/
 */
async function fetchFromAdventech(lang: string, quarterId: string, lessonId: string): Promise<LessonResult | null> {
  try {
    // Fetch lesson info
    const lessonUrl = `${ADVENTECH_API}/${lang}/quarterlies/${quarterId}/lessons/${lessonId}/index.json`;
    console.log(`[Adventech] Fetching lesson: ${lessonUrl}`);
    
    const lessonRes = await fetch(lessonUrl);
    if (!lessonRes.ok) {
      console.log(`[Adventech] Lesson fetch failed: ${lessonRes.status}`);
      return null;
    }
    
    const lessonData = await lessonRes.json();
    console.log(`[Adventech] Got lesson: ${lessonData.title}`);
    
    // Fetch each day's content (typically 7 days: 01-07)
    const days: DayContent[] = [];
    const dayLabels = ["Sabbath", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    for (let i = 1; i <= 7; i++) {
      const dayId = String(i).padStart(2, "0");
      const dayUrl = `${ADVENTECH_API}/${lang}/quarterlies/${quarterId}/lessons/${lessonId}/days/${dayId}/read/index.json`;
      
      try {
        const dayRes = await fetch(dayUrl);
        if (dayRes.ok) {
          const dayData = await dayRes.json();
          days.push({
            id: dayId,
            title: dayData.title || `${dayLabels[i - 1]}`,
            date: dayData.date || "",
            content: dayData.content || "",
            read: dayData.content || dayData.read || "",
          });
        }
      } catch (e) {
        console.log(`[Adventech] Day ${dayId} fetch failed:`, e);
      }
    }
    
    if (days.length === 0) {
      console.log("[Adventech] No days found");
      return null;
    }
    
    console.log(`[Adventech] Got ${days.length} days`);
    return {
      lesson: {
        id: lessonId,
        title: lessonData.title || "",
        bible_reading: lessonData.bible_reading || lessonData.memory_verse || "",
      },
      days,
    };
  } catch (e) {
    console.error("[Adventech] Error:", e);
    return null;
  }
}

/**
 * Try Duresa API as fallback
 */
async function fetchFromDuresa(lang: string, quarterId: string, lessonId: string): Promise<LessonResult | null> {
  try {
    const lessonUrl = `${DURESA_API}/${lang}/quarters/${quarterId}/lessons/${lessonId}`;
    console.log(`[Duresa] Fetching lesson: ${lessonUrl}`);
    
    const lessonRes = await fetch(lessonUrl);
    if (!lessonRes.ok) {
      console.log(`[Duresa] Lesson fetch failed: ${lessonRes.status}`);
      return null;
    }
    
    const lessonData = await lessonRes.json();
    
    // Fetch days
    const daysUrl = `${DURESA_API}/${lang}/quarters/${quarterId}/lessons/${lessonId}/days`;
    const daysRes = await fetch(daysUrl);
    
    if (!daysRes.ok) {
      console.log(`[Duresa] Days fetch failed: ${daysRes.status}`);
      return null;
    }
    
    const daysData = await daysRes.json();
    console.log(`[Duresa] Got ${daysData.length} days`);
    
    return {
      lesson: {
        id: lessonId,
        title: lessonData.title || "",
        bible_reading: lessonData.bible_reading || "",
      },
      days: daysData.map((day: any) => ({
        id: day.id || "",
        title: day.title || "",
        date: day.date || "",
        content: day.content || day.read || "",
        read: day.read || day.content || "",
      })),
    };
  } catch (e) {
    console.error("[Duresa] Error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language = "en", quarterId, lessonId } = await req.json();
    
    if (!quarterId || !lessonId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing quarterId or lessonId" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching lesson: lang=${language}, quarter=${quarterId}, lesson=${lessonId}`);

    // Try Adventech first (most complete content)
    let result = await fetchFromAdventech(language, quarterId, lessonId);
    
    // Fallback to Duresa
    if (!result) {
      result = await fetchFromDuresa(language, quarterId, lessonId);
    }

    if (result) {
      return new Response(
        JSON.stringify({ success: true, ...result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: `No content found for ${quarterId}/${lessonId}` }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
