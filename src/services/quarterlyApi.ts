import { supabase } from "@/integrations/supabase/client";

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
 * Fetches the current Sabbath School quarterly using alternative API
 */
export async function getCurrentQuarterly(language: string = "en"): Promise<Quarterly | null> {
  try {
    // Get current date to determine which quarterly to fetch
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    
    // Try the working API endpoint
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
            title: currentQuarter.title || 'Current Quarterly',
            description: currentQuarter.description || '',
            introduction: currentQuarter.introduction || '',
            lessons: lessons.map((lesson: any, index: number) => ({
              id: lesson.id,
              title: lesson.title,
              start_date: lesson.start_date,
              end_date: lesson.end_date,
              index: index + 1,
              full_read: lesson.full_read || '',
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
    
    // Fallback: Return the current quarterly structure from sabbath.school
    // This is a static fallback for Q4 2025 - "Lessons of Faith from Joshua"
    return {
      id: `${year}-${quarter.toString().padStart(2, '0')}-${language}`,
      title: "Lessons of Faith from Joshua",
      description: "An in-depth study of the book of Joshua, exploring themes of faith, courage, and God's faithfulness.",
      introduction: "This quarter we will journey through the book of Joshua, examining the conquest of Canaan and the distribution of the Promised Land. We'll discover lessons about faith, obedience, and God's unwavering promises.",
      lessons: [
        { id: "01", title: "From Egypt to Canaan", start_date: `${year}-${quarter === 4 ? '10' : '01'}-01`, end_date: `${year}-${quarter === 4 ? '10' : '01'}-07`, index: 1, full_read: "", bible_verses: ["Joshua 1:1-9"] },
        { id: "02", title: "Rahab and the Spies", start_date: `${year}-${quarter === 4 ? '10' : '01'}-08`, end_date: `${year}-${quarter === 4 ? '10' : '01'}-14`, index: 2, full_read: "", bible_verses: ["Joshua 2:1-24"] },
        { id: "03", title: "Crossing the Jordan", start_date: `${year}-${quarter === 4 ? '10' : '01'}-15`, end_date: `${year}-${quarter === 4 ? '10' : '01'}-21`, index: 3, full_read: "", bible_verses: ["Joshua 3:1-17"] },
        { id: "04", title: "The Fall of Jericho", start_date: `${year}-${quarter === 4 ? '10' : '01'}-22`, end_date: `${year}-${quarter === 4 ? '10' : '01'}-28`, index: 4, full_read: "", bible_verses: ["Joshua 6:1-27"] },
        { id: "05", title: "Achan's Sin", start_date: `${year}-${quarter === 4 ? '10' : '02'}-01`, end_date: `${year}-${quarter === 4 ? '10' : '02'}-07`, index: 5, full_read: "", bible_verses: ["Joshua 7:1-26"] },
        { id: "06", title: "The Conquest Continues", start_date: `${year}-${quarter === 4 ? '11' : '02'}-08`, end_date: `${year}-${quarter === 4 ? '11' : '02'}-14`, index: 6, full_read: "", bible_verses: ["Joshua 8-12"] },
        { id: "07", title: "Dividing the Land", start_date: `${year}-${quarter === 4 ? '11' : '02'}-15`, end_date: `${year}-${quarter === 4 ? '11' : '02'}-21`, index: 7, full_read: "", bible_verses: ["Joshua 13-21"] },
        { id: "08", title: "Cities of Refuge", start_date: `${year}-${quarter === 4 ? '11' : '02'}-22`, end_date: `${year}-${quarter === 4 ? '11' : '02'}-28`, index: 8, full_read: "", bible_verses: ["Joshua 20:1-9"] },
        { id: "09", title: "Choose This Day", start_date: `${year}-${quarter === 4 ? '12' : '03'}-01`, end_date: `${year}-${quarter === 4 ? '12' : '03'}-07`, index: 9, full_read: "", bible_verses: ["Joshua 24:1-33"] },
      ],
      quarter: `Q${quarter} ${year}`,
      cover_image: "https://www.sabbath.school/assets/img/lessons/2025/4/cover.jpg",
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
    
    // Fallback: Return basic structure
    return {
      lesson: {
        id: lessonId,
        title: "Lesson Study",
        bible_reading: "Joshua 1-24",
      },
      days: [
        { id: "01", title: "Sunday - Introduction", date: "", read: "Study Joshua and discover God's faithfulness. Use the palace rooms and principle lenses to dig deeper into the text.", content: "Study Joshua and discover God's faithfulness." },
        { id: "02", title: "Monday - Deeper Study", date: "", read: "Continue your study with Jeeves' help. Apply different palace rooms to see new insights.", content: "Continue your study with Jeeves' help." },
        { id: "03", title: "Tuesday - Application", date: "", read: "Apply what you've learned to your life today.", content: "Apply what you've learned to your life today." },
        { id: "04", title: "Wednesday - Connection", date: "", read: "Connect this lesson to Christ and His ministry.", content: "Connect this lesson to Christ and His ministry." },
        { id: "05", title: "Thursday - Reflection", date: "", read: "Reflect on the key principles from this week.", content: "Reflect on the key principles from this week." },
        { id: "06", title: "Friday - Further Study", date: "", read: "Explore additional resources and Spirit of Prophecy insights.", content: "Explore additional resources and insights." },
      ],
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
