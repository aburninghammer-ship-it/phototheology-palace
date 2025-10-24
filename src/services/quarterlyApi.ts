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
    
    // Fallback: Return basic structure with actual content
    const fallbackContent = `
      <h3>Lesson Overview</h3>
      <p>This is a fallback lesson view. The Sabbath School API is currently unavailable, but you can still practice using the Palace Rooms and Principles to analyze this sample content.</p>
      
      <h4>Key Bible Text: Joshua 1:8-9</h4>
      <p>"This Book of the Law shall not depart from your mouth, but you shall meditate in it day and night, that you may observe to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success. Have I not commanded you? Be strong and of good courage; do not be afraid, nor be dismayed, for the Lord your God is with you wherever you go."</p>
      
      <h4>Introduction</h4>
      <p>Joshua stands at the threshold of a new era. Moses, the great deliverer and lawgiver, has died, and now Joshua must lead Israel into the Promised Land. God's call to Joshua is clear: "Be strong and of good courage." This is not a call based on human strength but on trust in God's promises and presence.</p>
      
      <h4>The Promise of God's Presence</h4>
      <p>Three times in the opening chapter, God commands Joshua to be strong and courageous. This repetition emphasizes both the difficulty of the task ahead and the sufficiency of God's enabling power. The source of Joshua's courage was not self-confidence but God-confidence. The Lord promised, "I will not leave you nor forsake you" (Joshua 1:5).</p>
      
      <h4>The Importance of God's Word</h4>
      <p>Success in Joshua's mission depended on his faithfulness to God's Word. He was instructed to meditate on it day and night and to be careful to obey everything written in it. This was not merely intellectual study but transformative engagement with divine revelation that would shape his decisions and actions.</p>
      
      <h4>Application for Today</h4>
      <p>Like Joshua, we face challenges that seem overwhelming. Whether it's spiritual battles, difficult relationships, or uncertain futures, God's call to us is the same: "Be strong and courageous." Our strength comes not from ourselves but from God's presence and His Word. As we meditate on Scripture and trust in His promises, we too can face our "Promised Land" moments with faith and courage.</p>
      
      <h4>Discussion Questions</h4>
      <ul>
        <li>What "Promised Land" challenges are you facing in your life right now?</li>
        <li>How does meditating on God's Word day and night help you navigate difficulties?</li>
        <li>In what ways can you practice God's presence in your daily life?</li>
        <li>What does it mean to be "strong and courageous" in a Christian context?</li>
      </ul>
    `;
    
    return {
      lesson: {
        id: lessonId,
        title: "Faith and Courage: Lessons from Joshua",
        bible_reading: "Joshua 1:1-9",
      },
      days: [
        { id: "01", title: "Sunday - God's Call to Joshua", date: "", read: fallbackContent, content: fallbackContent },
        { id: "02", title: "Monday - The Promise of Presence", date: "", read: fallbackContent.replace("Introduction", "God's Presence"), content: fallbackContent },
        { id: "03", title: "Tuesday - Meditating on God's Word", date: "", read: fallbackContent.replace("Introduction", "The Power of Scripture"), content: fallbackContent },
        { id: "04", title: "Wednesday - Courage in Action", date: "", read: fallbackContent.replace("Introduction", "Putting Faith to Work"), content: fallbackContent },
        { id: "05", title: "Thursday - Trusting God's Promises", date: "", read: fallbackContent.replace("Introduction", "The Faithfulness of God"), content: fallbackContent },
        { id: "06", title: "Friday - Living with Courage", date: "", read: fallbackContent.replace("Introduction", "Practical Application"), content: fallbackContent },
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
