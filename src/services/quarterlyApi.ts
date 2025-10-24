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
    
    // Fallback: Return Q4 2025 quarterly structure with official PDF links
    const lessonData = [
      { id: "01", title: "From Egypt to Canaan", dates: "Sep 27–Oct 3", bible_verses: ["Joshua 1:1-9", "Hebrews 11:24-26", "Joshua 1:10-18"], memory_verse: "Joshua 1:9" },
      { id: "02", title: "Rahab and the Spies", dates: "Oct 4–10", bible_verses: ["Joshua 2:1-24", "Hebrews 11:31", "James 2:25"], memory_verse: "Joshua 2:11" },
      { id: "03", title: "Memorials of Grace", dates: "Oct 11–17", bible_verses: ["Joshua 3:1-17", "Joshua 4:1-24", "Deuteronomy 6:20-25"], memory_verse: "Joshua 4:7" },
      { id: "04", title: "The Conflict Behind All Conflicts", dates: "Oct 18–24", bible_verses: ["Joshua 10:1-15", "Joshua 10:12-14", "Revelation 12:7-9"], memory_verse: "Joshua 10:14" },
      { id: "05", title: "When God Fights for You", dates: "Oct 25–31", bible_verses: ["Joshua 6:1-27", "Joshua 7:1-26", "Hebrews 11:30"], memory_verse: "Joshua 6:2" },
      { id: "06", title: "Living as God's People", dates: "Nov 1–7", bible_verses: ["Joshua 23:1-16", "Joshua 24:1-33", "Deuteronomy 30:15-20"], memory_verse: "Joshua 24:15" },
      { id: "07", title: "The Land of Rest", dates: "Nov 8–14", bible_verses: ["Joshua 21:43-45", "Hebrews 3:7-4:11", "Psalm 95:7-11"], memory_verse: "Joshua 21:45" },
      { id: "08", title: "Justice and Mercy", dates: "Nov 15–21", bible_verses: ["Joshua 20:1-9", "Numbers 35:9-34", "Deuteronomy 19:1-13"], memory_verse: "Joshua 20:3" },
      { id: "09", title: "Choose This Day", dates: "Nov 22–28", bible_verses: ["Joshua 24:1-33", "Deuteronomy 30:19-20", "1 Kings 18:21"], memory_verse: "Joshua 24:15" },
      { id: "10", title: "Lessons from Failure", dates: "Nov 29–Dec 5", bible_verses: ["Judges 2:6-23", "Judges 3:7-31", "Hebrews 10:35-39"], memory_verse: "Judges 2:18" },
      { id: "11", title: "God's Unlikely Heroes", dates: "Dec 6–12", bible_verses: ["Judges 4:1-24", "Judges 6:1-40", "1 Corinthians 1:26-29"], memory_verse: "Judges 6:16" },
      { id: "12", title: "The Cost of Compromise", dates: "Dec 13–19", bible_verses: ["Judges 16:1-31", "Proverbs 4:23-27", "James 4:7-10"], memory_verse: "Judges 16:20" },
      { id: "13", title: "A Better Hope", dates: "Dec 20–26", bible_verses: ["Hebrews 4:1-16", "Hebrews 11:39-40", "Revelation 21:1-7"], memory_verse: "Hebrews 4:9" },
    ];

    return {
      id: `${year}-0${quarter}-${language}`,
      title: "Lessons of Faith from Joshua",
      description: "An in-depth study of the book of Joshua and Judges, exploring themes of faith, courage, and God's faithfulness.",
      introduction: "This quarter we journey through the books of Joshua and Judges, examining faith lessons from Israel's conquest and settlement of Canaan. We'll discover timeless truths about faith, obedience, and God's unwavering promises.",
      lessons: lessonData.map((lesson, index) => ({
        id: lesson.id,
        title: lesson.title,
        start_date: lesson.dates.split('–')[0] + `, ${year}`,
        end_date: lesson.dates.split('–')[1] + `, ${year}`,
        index: index + 1,
        full_read: `https://www.sabbath.school/SSchool/${year}/${quarter}/EAQ${quarter}${String(year).slice(2)}_${lesson.id}.pdf`,
        bible_verses: lesson.bible_verses,
      })),
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
    const studyContent = `
      <div class="lesson-intro">
        <h3>📖 Official Sabbath School Lesson</h3>
        <p>This lesson is part of the official Adult Sabbath School Quarterly. For the complete lesson with all daily readings, discussion questions, and EGW notes, please access the official PDF.</p>
        
        <div class="study-approach">
          <h4>🎯 How to Use This Platform</h4>
          <ol>
            <li><strong>Read the Official Lesson:</strong> Click the "View Official PDF" button above to access the complete lesson content</li>
            <li><strong>Select a Day:</strong> Choose which day's study you want to analyze</li>
            <li><strong>Apply Palace Tools:</strong> Use the Palace Rooms or Principles to dig deeper into the Scripture passages</li>
            <li><strong>Get AI Insights:</strong> Jeeves will help you apply the selected framework to enhance your study</li>
          </ol>
        </div>

        <div class="study-prompt">
          <h4>📝 Study Prompt</h4>
          <p>As you read through this week's lesson, consider:</p>
          <ul>
            <li>What is the main biblical narrative or teaching?</li>
            <li>Which Palace Room would help you see this story/passage in a new way?</li>
            <li>What principles or dimensions apply to your life today?</li>
            <li>How can you use the Jeeves assistant to explore connections you might have missed?</li>
          </ul>
        </div>

        <div class="palace-example">
          <h4>💡 Quick Example</h4>
          <p><strong>Try This:</strong> After reading about Joshua's courage (Lesson 1), select "Story Room (SR)" to break the narrative into memorable beats, or choose "Christ Dimension" to see how Joshua points to Jesus.</p>
        </div>
      </div>
    `;
    
    return {
      lesson: {
        id: lessonId,
        title: "Weekly Study Guide",
        bible_reading: "See official PDF for complete Bible readings",
      },
      days: [
        { id: "01", title: "Sunday - First Day Study", date: "", read: studyContent, content: studyContent },
        { id: "02", title: "Monday - Second Day Study", date: "", read: studyContent, content: studyContent },
        { id: "03", title: "Tuesday - Third Day Study", date: "", read: studyContent, content: studyContent },
        { id: "04", title: "Wednesday - Fourth Day Study", date: "", read: studyContent, content: studyContent },
        { id: "05", title: "Thursday - Fifth Day Study", date: "", read: studyContent, content: studyContent },
        { id: "06", title: "Friday - Sixth Day Study", date: "", read: studyContent, content: studyContent },
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
