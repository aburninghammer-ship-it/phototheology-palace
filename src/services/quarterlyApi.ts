import { supabase } from "@/integrations/supabase/client";
import { Q1_2026_LESSONS, Q1_2026_TITLE, Q1_2026_DESCRIPTION, Q1_2026_QUARTER } from "@/data/quarterlyQ1_2026";
import { Q2_2026_LESSONS, Q2_2026_TITLE, Q2_2026_DESCRIPTION, Q2_2026_QUARTER } from "@/data/quarterlyQ2_2026";
import { q4_2025_lessons } from "@/data/q4-2025-lesson-content";

export interface QuarterlyLesson {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  index: number;
  full_read: string;
  bible_verses: string[];
}

export interface Quarterly {
  id: string;
  title: string;
  description: string;
  introduction: string;
  lessons: QuarterlyLesson[];
  quarter: string;
  cover_image?: string;
}

/**
 * Fetches the current quarterly from Seventh Day Press via edge function
 */
async function fetchSeventhDayPressQuarterly(): Promise<{ pdfUrl: string; title: string; topic: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-quarterly', {
      body: {}
    });
    
    if (error || !data?.success) {
      console.warn('Failed to fetch from Seventh Day Press:', error || data?.error);
      return null;
    }
    
    return {
      pdfUrl: data.quarterly.pdfUrl,
      title: data.quarterly.title,
      topic: data.quarterly.topic
    };
  } catch (e) {
    console.warn('Error calling fetch-quarterly:', e);
    return null;
  }
}

/**
 * Fetches the current lesson quarterly using alternative API
 */
export async function getCurrentQuarterly(language: string = "en"): Promise<Quarterly | null> {
  try {
    // Get current date to determine which quarterly to fetch
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    
    // First, try to get from Seventh Day Press
    const sdpQuarterly = await fetchSeventhDayPressQuarterly();
    
    // Try the working API endpoint for lesson details
    try {
      const response = await fetch(
        `https://sabbathschool.duresa.com.et/api/v1/languages/${language}/quarters`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (response.ok) {
        const quarters = await response.json();
        
        // Find the current quarter
        const currentQuarter = quarters.find((q: any) => {
          const qYear = parseInt(q.id.substring(0, 4));
          const qQuarter = parseInt(q.id.substring(5, 7));
          return qYear === year && qQuarter === quarter;
        }) || quarters[quarters.length - 1]; // Fallback to latest quarter
        
        if (currentQuarter) {
          // Fetch lessons for this quarter
          const lessonsResponse = await fetch(
            `https://sabbathschool.duresa.com.et/api/v1/${language}/quarters/${currentQuarter.id}/lessons`
          );
          
          const lessons = lessonsResponse.ok ? await lessonsResponse.json() : [];
          
          return {
            id: currentQuarter.id,
            title: sdpQuarterly?.title || currentQuarter.title || 'Current Quarterly',
            description: currentQuarter.description || '',
            introduction: currentQuarter.introduction || '',
            lessons: lessons.map((lesson: any, index: number) => ({
              id: lesson.id,
              title: lesson.title,
              start_date: lesson.start_date,
              end_date: lesson.end_date,
              index: index + 1,
              full_read: sdpQuarterly?.pdfUrl || lesson.full_read || '',
              bible_verses: lesson.bible_reading?.split(',').map((v: string) => v.trim()) || [],
            })),
            quarter: `Q${quarter} ${year}`,
            cover_image: currentQuarter.cover || undefined,
          };
        }
      }
    } catch (apiError) {
      console.warn('API fetch failed:', apiError);
    }
    
    // Q1 2026 - Uniting Heaven and Earth (Philippians & Colossians)
    const pdfUrl = sdpQuarterly?.pdfUrl || 'https://www.sabbath.school/LessonBook';

    return {
      id: `2026-01-${language}`,
      title: sdpQuarterly?.title || Q1_2026_TITLE,
      description: Q1_2026_DESCRIPTION,
      introduction: Q1_2026_DESCRIPTION,
      lessons: Q1_2026_LESSONS.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        start_date: lesson.startDate,
        end_date: lesson.endDate,
        index: lesson.num,
        full_read: pdfUrl,
        bible_verses: lesson.scriptures,
      })),
      quarter: Q1_2026_QUARTER,
    };
  } catch (error) {
    console.error('Error fetching quarterly:', error);
    return null;
  }
}

/**
 * Fetches a specific lesson from the quarterly
 */
export async function getQuarterlyLesson(
  quarterlyId: string,
  lessonId: string,
  language: string = "en"
): Promise<any | null> {
  try {
    const response = await fetch(
      `https://sabbathschool.duresa.com.et/api/v1/${language}/quarters/${quarterlyId}/lessons/${lessonId}`
    );
    
    if (response.ok) {
      const lesson = await response.json();
      
      // Fetch days for this lesson
      const daysResponse = await fetch(
        `https://sabbathschool.duresa.com.et/api/v1/${language}/quarters/${quarterlyId}/lessons/${lessonId}/days`
      );
      
      const days = daysResponse.ok ? await daysResponse.json() : [];
      
      return {
        lesson,
        days: days.map((day: any) => ({
          id: day.id,
          title: day.title,
          date: day.date,
          read: day.read || day.content,
          content: day.content,
        })),
      };
    }
    
    // Fallback: Use Q1 2026 local data
    const localLesson = Q1_2026_LESSONS.find((l) => l.id === lessonId);
    if (localLesson) {
      return {
        lesson: {
          id: localLesson.id,
          title: localLesson.title,
          bible_reading: localLesson.scriptures.join(", "),
        },
        days: localLesson.days.map((day, idx) => ({
          id: String(idx + 1).padStart(2, "0"),
          title: `${day.day} - ${day.title}`,
          date: day.date,
          read: `<p><strong>${day.title}</strong></p><p>Scriptures: ${day.scriptures.join(", ")}</p><p>${day.content}</p>`,
          content: `<p><strong>${day.title}</strong></p><p>Scriptures: ${day.scriptures.join(", ")}</p><p>${day.content}</p>`,
        })),
      };
    }

    // Fallback: Use PDF-derived Q4 2025 lesson content
    const lessonData = q4_2025_lessons[lessonId];
    if (lessonData) {
      return {
        lesson: {
          id: lessonId,
          title: lessonData.lessonTitle,
          bible_reading: lessonData.lessonScripture,
          aid: lessonData.aid,
          description: lessonData.description,
        },
        days: lessonData.days.map((day) => ({
          id: day.id,
          title: day.title,
          date: "",
          read: day.content,
          content: day.content,
        })),
      };
    }

    return {
      lesson: { id: lessonId, title: "Weekly Study Guide", bible_reading: "" },
      days: [],
    };
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
}

/**
 * Analyzes quarterly content using phototheology principles via edge function
 */
export async function analyzeQuarterlyWithPhototheology(
  lessonTitle: string,
  lessonContent: string,
  bibleVerses: string[]
): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-quarterly-lesson', {
      body: {
        lessonTitle,
        lessonContent,
        bibleVerses,
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error analyzing quarterly:', error);
    throw error;
  }
}
