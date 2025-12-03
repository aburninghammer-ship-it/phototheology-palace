import { PathType } from "@/hooks/usePath";
import { 
  visualPathMonth2, 
  analyticalPathMonth2, 
  devotionalPathMonth2, 
  warriorPathMonth2 
} from "./pathCurriculumMonth2";
import {
  visualMonth3,
  analyticalMonth3,
  devotionalMonth3,
  warriorMonth3
} from "./pathCurriculumMonth3";
import {
  visualMonth4,
  analyticalMonth4,
  devotionalMonth4,
  warriorMonth4
} from "./pathCurriculumMonth4";
import {
  visualMonth5,
  analyticalMonth5,
  devotionalMonth5,
  warriorMonth5
} from "./pathCurriculumMonth5";
import {
  visualMonth6,
  analyticalMonth6,
  devotionalMonth6,
  warriorMonth6
} from "./pathCurriculumMonth6";
import {
  explorerPathMonth7,
  disciplePathMonth7,
  warriorPathMonth7,
  explorerPathMonth8,
  disciplePathMonth8,
  warriorPathMonth8
} from "./pathCurriculumMonths7to12";
import {
  explorerPathMonth13,
  disciplePathMonth13,
  warriorPathMonth13
} from "./pathCurriculumMonths13to24";

// Activity interface for month curriculum files
export interface MonthActivity {
  id: string;
  title: string;
  type: string;
  duration: number;
  description: string;
  icon: string;
  instructions: string;
}

// Week content interface for month curriculum files
export interface WeekContent {
  week: number;
  title: string;
  focus: string;
  activities: MonthActivity[];
}

export interface WeekActivity {
  id: string;
  title: string;
  description: string;
  detailedInstructions?: string;
  type: "reading" | "drill" | "exercise" | "reflection" | "challenge";
  duration: string;
  roomCode?: string;
  link?: string;
  icon: string;
  specificVerse?: string;
  lookFor?: string[];
}

export interface WeekOutline {
  weekNumber: number;
  title: string;
  focus: string;
  scripture: string;
  activities: WeekActivity[];
  milestone?: string;
}

export interface MonthCurriculum {
  month: number;
  title: string;
  theme: string;
  weeks: WeekOutline[];
  gateAssessment: string;
}

// ============================================
// PATH DNA - UNIQUE METHODOLOGY FOR EACH PATH
// ============================================
// Visual: Memory palace, image-first, scene construction
// Analytical: Detective work, evidence gathering, structural analysis
// Devotional: Heart transformation, contemplative practice, emotional engagement
// Warrior: Combat training, speed precision, teaching deployment

// ============================================
// VISUAL PATH - Complete 24-Month Curriculum
// ============================================
const visualPathCurriculum: MonthCurriculum[] = [
  // MONTH 1: Story Room Foundations
  {
    month: 1,
    title: "Visual Foundations",
    theme: "Building Your Memory Palace",
    weeks: [
      {
        weekNumber: 1,
        title: "Story Room - Paint the Scene",
        focus: "Learn to capture Bible narratives as vivid mental movies",
        scripture: "Genesis 1-3",
        activities: [
          { 
            id: "v1-w1-a1", 
            title: "Story Room Introduction", 
            description: "Learn the Story Room method for capturing Bible narratives visually",
            detailedInstructions: "1. Go to the Palace tab and select Floor 1\n2. Enter the Story Room\n3. Read the complete room description and method\n4. Key principle: Stories are remembered best as vivid mental movies\n5. Note the 5-7 beat story structure",
            type: "reading", 
            duration: "15 min", 
            roomCode: "SR", 
            link: "/palace/floor/1/room/sr", 
            icon: "🎬",
            lookFor: ["The 5-7 beat story structure", "How to identify key scenes", "The role of sensory details"]
          },
          { 
            id: "v1-w1-a2", 
            title: "Read Genesis 1 - Paint Each Day", 
            description: "Read Genesis 1 creating one vivid painting for each day of creation",
            detailedInstructions: "1. Go to the Bible tab\n2. Navigate to Genesis Chapter 1\n3. Day 1 (v1-5): Paint LIGHT bursting from darkness - feel the explosive power\n4. Day 2 (v6-8): Paint waters parting, sky forming like a dome above\n5. Day 3 (v9-13): Paint land rising from waters, green sprouts pushing through soil\n6. Day 4-7: Continue painting, one image per day\n7. Write down your 7 paintings in Growth Journal",
            type: "reading", 
            duration: "25 min", 
            link: "/bible/Genesis/1", 
            icon: "🖼️",
            specificVerse: "Genesis 1:1-31",
            lookFor: ["The repeated phrase 'And God said'", "The pattern of evening and morning", "What God called 'good' vs 'very good'"]
          },
          { 
            id: "v1-w1-a3", 
            title: "Read Genesis 2 - Map the Garden", 
            description: "Create a visual map of Eden with every detail in place",
            detailedInstructions: "1. Read Genesis 2:4-25\n2. DRAW a map (paper or mental): Where is the Tree of Life? Tree of Knowledge?\n3. Trace the four rivers flowing outward\n4. Picture the parade of animals coming to Adam for naming\n5. Visualize Eve emerging from Adam's side\n6. This 'set' will be the stage for Genesis 3",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/2", 
            icon: "🗺️",
            specificVerse: "Genesis 2:4-25",
            lookFor: ["The location of the two special trees", "Adam's task of naming", "The phrase 'not good' - the only thing not good in creation"]
          },
          { 
            id: "v1-w1-a4", 
            title: "Read Genesis 3 - Direct the Movie", 
            description: "Stage Genesis 3 as a 5-act tragedy you're directing",
            detailedInstructions: "1. Read Genesis 3\n2. ACT 1 (v1-5): The serpent's temptation - where is he positioned? Eye level?\n3. ACT 2 (v6-7): The moment of eating - slow motion: saw, desired, took, ate, gave\n4. ACT 3 (v8-13): Hiding - feel the shame, hear the rustling\n5. ACT 4 (v14-19): The curses - watch faces change\n6. ACT 5 (v20-24): Exile - see the flaming sword behind them",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/3", 
            icon: "🎭",
            specificVerse: "Genesis 3:1-24",
            lookFor: ["The serpent's three lies", "The first gospel promise in verse 15", "Who made the clothes in verse 21"]
          },
          { 
            id: "v1-w1-a5", 
            title: "Encyclopedia: Creation Visual Hooks", 
            description: "Find pre-made visual anchors in the Creation article",
            detailedInstructions: "1. Go to the Encyclopedia tab\n2. Search for 'Creation'\n3. Look specifically for the 'Visual Hooks' section\n4. These are images designed for memory\n5. Adopt 3 hooks that work for you\n6. Note which PT rooms they connect to",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📚",
            lookFor: ["How creation points to Christ (Colossians 1:16)", "The Sabbath as creation memorial", "PT room connections"]
          },
          { 
            id: "v1-w1-a6", 
            title: "Video Training: Story Room Method", 
            description: "Watch visual learners demonstrate the Story Room",
            detailedInstructions: "1. Go to Video Training tab\n2. Find the 'Floor 1' or 'Story Room' category\n3. Watch how the instructor SHOWS the method\n4. Pause and sketch along when demonstrations happen\n5. Visual learning requires visual models",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "v1-w1-a7", 
            title: "Daily Verse: Paint Today's Word", 
            description: "Transform today's Daily Verse into one striking image",
            detailedInstructions: "1. Go to the Daily Verse section\n2. Read the verse three times slowly\n3. Ask: What ONE image captures this verse?\n4. Create that image in your mind - make it vivid, strange, memorable\n5. Write your image in Growth Journal\n6. This is translation practice",
            type: "reading", 
            duration: "10 min", 
            link: "/daily-verse", 
            icon: "✨"
          },
          { 
            id: "v1-w1-a8", 
            title: "Sketch Creation Week", 
            description: "Draw simple sketches of all 7 days of creation",
            detailedInstructions: "1. Get paper (or use digital drawing)\n2. Draw 7 simple boxes or circles\n3. In each, sketch ONE image for each day:\n   - Day 1: Light burst\n   - Day 2: Waters divided\n   - Day 3: Land and plants\n   - Day 4: Sun, moon, stars\n   - Day 5: Birds and fish\n   - Day 6: Animals and humans\n   - Day 7: Rest (how do you visualize rest?)\n4. Take a photo for your study",
            type: "drill", 
            duration: "20 min", 
            icon: "✏️"
          },
          { 
            id: "v1-w1-a9", 
            title: "Story Room Training Drill", 
            description: "Complete the official Story Room drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Story Room' drill\n3. Answer using your visual memory\n4. If you miss a question, strengthen that image\n5. Score 80%+ to pass",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w1-a10", 
            title: "Daily Challenge: Creation Theme", 
            description: "Complete today's challenge using visual language",
            detailedInstructions: "1. Go to Daily Challenges\n2. When answering, use visual phrases:\n   - 'I see...'\n   - 'Picture this...'\n   - 'Imagine...'\n3. Connect your answers to Genesis 1-3 visuals\n4. Review the AI feedback for visual thinking tips",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🌟"
          },
          { 
            id: "v1-w1-a11", 
            title: "Card Deck: Visual Card Draw", 
            description: "Use the Card Deck to explore Genesis with visual focus",
            detailedInstructions: "1. Go to the Card Deck tab\n2. Enter Genesis 1:1 as your starting verse\n3. For EACH card you draw, ask: 'What image does this create?'\n4. Don't just think the answer - SEE the answer\n5. Save your study with image notes",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "v1-w1-a12", 
            title: "Verse Match Game: Genesis", 
            description: "Play Verse Match to reinforce visual Genesis recognition",
            detailedInstructions: "1. Go to Games tab\n2. Select 'Verse Match' game\n3. Choose Genesis as your book focus\n4. When matching, visualize the scene first\n5. Complete 3 rounds\n6. The visual memory will make matching easier",
            type: "drill", 
            duration: "15 min", 
            link: "/games", 
            icon: "🎮"
          },
          { 
            id: "v1-w1-a13", 
            title: "Flashcards: 7 Days Visual", 
            description: "Create visual flashcards for Creation Week",
            detailedInstructions: "1. Go to Flashcards tab\n2. Create a new deck: 'Creation Week Visual'\n3. Create 7 cards:\n   - Front: Simple image/emoji representing the day\n   - Back: Day number + what was created + verse\n4. Test both directions: image → day AND day → image\n5. Master until instant recall",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "v1-w1-a14", 
            title: "Story Beat Practice: Genesis 3", 
            description: "Divide Genesis 3 into visual beats and practice recall",
            detailedInstructions: "1. Open Genesis 3\n2. Identify 5-7 'beats' (key moments)\n3. Give each beat a visual title:\n   - Beat 1: 'Serpent in Tree'\n   - Beat 2: 'Hand Reaching for Fruit'\n   - etc.\n4. Practice 'flipping' through the beats visually\n5. Can you recall all beats in under 30 seconds?",
            type: "drill", 
            duration: "20 min", 
            link: "/bible/Genesis/3", 
            icon: "🎬"
          },
          { 
            id: "v1-w1-a15", 
            title: "Create Study: Genesis 1-3 Visual Map", 
            description: "Build a comprehensive visual map in My Studies",
            detailedInstructions: "1. Go to My Studies\n2. Click 'New Study'\n3. Title: 'Genesis 1-3: Creation to Fall Visual Map'\n4. Structure:\n   - Section 1: My 7 Creation paintings\n   - Section 2: My Eden map\n   - Section 3: My 5-act Fall movie\n5. Include actual images if possible\n6. This becomes your visual reference",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-studies",
            icon: "📝"
          },
          { 
            id: "v1-w1-a16", 
            title: "Gems Room: Visual Gems Collection", 
            description: "Start collecting visual gems from Genesis 1-3",
            detailedInstructions: "1. Go to Palace > Floor 1 > Gems Room\n2. A 'visual gem' is an image that unlocks meaning\n3. Find 3 visual gems from Genesis 1-3:\n   - Gem 1: God SPEAKING light into existence (power of His word)\n   - Gem 2: The serpent's position (why is he in the tree?)\n   - Gem 3: God CLOTHING Adam and Eve (first death, first covering)\n4. Record with the image that captures the insight",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w1-a17", 
            title: "Draw/Paint Your Favorite Scene", 
            description: "Create one larger, more detailed visual of your favorite Genesis 1-3 moment",
            detailedInstructions: "1. Choose ONE scene from Genesis 1-3 that moved you\n2. Spend time creating a more detailed visual:\n   - Could be a sketch, painting, digital art, or collage\n   - Include details you noticed in your study\n3. The act of creating deepens memory\n4. Take a photo and add to your study\n5. Consider sharing in Community",
            type: "exercise", 
            duration: "25 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w1-a18", 
            title: "Community Share: Your Creation Image", 
            description: "Share your favorite visual from this week's study",
            detailedInstructions: "1. Go to Community tab\n2. Create a new post\n3. Title: 'My Genesis Visual - Week 1'\n4. Share ONE image you created and explain:\n   - What scene does it capture?\n   - What details did you include?\n   - Why is this image memorable for you?\n5. Comment on 2 other visual learners' posts",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w1-a19", 
            title: "Concentration Room Preview: Christ in Creation", 
            description: "Preview how your visuals connect to Christ",
            detailedInstructions: "1. Go to Palace > Floor 4 > Concentration Room\n2. Read about finding Christ in every passage\n3. Apply to your Genesis 1-3 visuals:\n   - Creation: Christ as Creator (John 1:3)\n   - Fall: Christ as the promised 'Seed' (Gen 3:15)\n   - Clothing: Christ as the Lamb whose skin covers us\n4. Add these Christ connections to your visual study",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "CR", 
            link: "/palace/floor/4/room/cr", 
            icon: "✝️"
          },
          { 
            id: "v1-w1-a20", 
            title: "Growth Journal: Week 1 Visual Reflection", 
            description: "Reflect on your visual learning journey this week",
            detailedInstructions: "1. Go to Growth Journal\n2. Create entry: 'Week 1 - Story Room Visual Reflection'\n3. Answer:\n   - What are my 7 Creation paintings?\n   - Which image is STRONGEST in my memory? Why?\n   - Which image is WEAKEST? How can I strengthen it?\n   - How does visual thinking change my Bible reading?\n4. Set one visual goal for Week 2",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w1-a21", 
            title: "Milestone Check: 7 Days Recall", 
            description: "Test if you can visually recall all 7 days of creation",
            detailedInstructions: "1. Close your eyes\n2. 'Walk through' your 7 creation paintings in order\n3. Can you see each one clearly?\n4. Can you describe what you see in each?\n5. If any are weak, strengthen them before Week 2\n6. Check Achievements for progress\n7. Celebrate your first week as a visual learner!",
            type: "reflection", 
            duration: "10 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can visually recall all 7 days of Creation with vivid imagery",
      },
      {
        weekNumber: 2,
        title: "Imagination Room - Step Inside",
        focus: "Immerse yourself inside Bible stories using all 5 senses",
        scripture: "Genesis 22 (Abraham and Isaac)",
        activities: [
          { 
            id: "v1-w2-a1", 
            title: "Imagination Room Introduction", 
            description: "Learn to step INSIDE Scripture scenes, not just watch them",
            detailedInstructions: "1. Go to Palace > Floor 1 > Imagination Room\n2. Read the complete room guide\n3. KEY DIFFERENCE from Story Room:\n   - Story Room: You WATCH the movie\n   - Imagination Room: You STAR in the movie\n4. Engage all 5 senses: sight, sound, smell, touch, taste\n5. This is sanctified imagination - empathy with the text",
            type: "reading", 
            duration: "15 min", 
            roomCode: "IR", 
            link: "/palace/floor/1/room/ir", 
            icon: "🎭",
            lookFor: ["The 5 senses method", "Ethical boundaries for imagination", "How to stay true to the text"]
          },
          { 
            id: "v1-w2-a2", 
            title: "Read Genesis 22:1-8 - Walk with Abraham", 
            description: "Place yourself on the 3-day journey to Moriah",
            detailedInstructions: "1. Read Genesis 22:1-8 slowly\n2. YOU ARE WALKING beside Abraham:\n   - FEEL the dust on your feet\n   - HEAR the donkey's hooves on stone\n   - SEE Isaac's innocent face\n   - FEEL Abraham's internal agony (3 days of this!)\n3. When Isaac asks 'Where is the lamb?' - FEEL the weight of the answer\n4. Note every sensory detail you experience",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/22", 
            icon: "🚶",
            specificVerse: "Genesis 22:1-8",
            lookFor: ["Abraham's early morning departure (urgency? reluctance?)", "The 3-day journey (time for doubt)", "Isaac's trust in his father"]
          },
          { 
            id: "v1-w2-a3", 
            title: "Read Genesis 22:9-14 - On the Mountain", 
            description: "Experience the climax on Mount Moriah with all senses",
            detailedInstructions: "1. Read Genesis 22:9-14\n2. YOU ARE THERE:\n   - FEEL the rough wood of the altar\n   - HEAR the silence before the knife raises\n   - SEE the angel appearing\n   - HEAR 'Abraham! Abraham!' - the urgency\n   - TURN YOUR HEAD and see the ram caught\n   - FEEL the tears, the relief, the worship\n3. HEAR Abraham name the place: 'Jehovah-Jireh'\n4. What does that name mean to you NOW?",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/22", 
            icon: "⛰️",
            specificVerse: "Genesis 22:9-14",
            lookFor: ["The moment the angel speaks", "The ram 'caught' - not just present, but trapped", "The prophetic statement about 'this mountain'"]
          },
          { 
            id: "v1-w2-a4", 
            title: "Encyclopedia: Abraham Article", 
            description: "Study Abraham's faith journey for context",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Abraham' or 'Sacrifice of Isaac'\n3. Read for VISUAL context:\n   - What did Mount Moriah look like?\n   - What was the cultural significance of firstborn?\n   - How did Isaac's size/age affect the scene?\n4. Add visual details to strengthen your immersion",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📚",
            lookFor: ["Isaac's age (likely teenager)", "Mount Moriah's later significance (Temple!)", "How this parallels God's sacrifice"]
          },
          { 
            id: "v1-w2-a5", 
            title: "Cross-Reference: Hebrews 11:17-19", 
            description: "See what Abraham was thinking during this test",
            detailedInstructions: "1. Read Hebrews 11:17-19\n2. Abraham believed God could raise Isaac from the dead!\n3. Add this to your imagination:\n   - Abraham's face shows faith, not just grief\n   - He 'figuratively' received Isaac back\n4. How does this change your sensory experience of the scene?",
            type: "reading", 
            duration: "10 min", 
            link: "/bible/Hebrews/11", 
            icon: "📖",
            specificVerse: "Hebrews 11:17-19"
          },
          { 
            id: "v1-w2-a6", 
            title: "Video Training: Imagination Room Technique", 
            description: "Watch demonstration of the 5-senses immersion method",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Imagination Room' or 'Immersion' videos\n3. Watch how instructors demonstrate sensory engagement\n4. Practice along with their examples\n5. Note techniques for avoiding eisegesis (reading into the text)",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "v1-w2-a7", 
            title: "Daily Verse: Step Inside", 
            description: "Practice Imagination Room on today's Daily Verse",
            detailedInstructions: "1. Go to Daily Verse\n2. Read the verse\n3. Ask: Where am I in this scene?\n4. Engage all 5 senses:\n   - What do I SEE?\n   - What do I HEAR?\n   - What do I SMELL?\n   - What do I TOUCH?\n   - What do I TASTE (if applicable)?\n5. Write your immersion experience in Growth Journal",
            type: "reading", 
            duration: "10 min", 
            link: "/daily-verse", 
            icon: "✨"
          },
          { 
            id: "v1-w2-a8", 
            title: "5-Senses Genesis 22 Worksheet", 
            description: "Complete a 5-senses worksheet for key Genesis 22 moments",
            detailedInstructions: "1. Create a 5-column table:\n   Sight | Sound | Smell | Touch | Taste\n2. Fill in for 3 key moments:\n   - The departure (v3)\n   - The question (v7)\n   - The ram (v13)\n3. This structured approach trains sensory imagination\n4. Keep this worksheet for reference",
            type: "drill", 
            duration: "20 min", 
            icon: "📋"
          },
          { 
            id: "v1-w2-a9", 
            title: "Imagination Room Training Drill", 
            description: "Complete the official Imagination Room drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Imagination Room' drill\n3. Answer questions about sensory engagement\n4. For each question, VISUALIZE before answering\n5. Score 80%+ to pass",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w2-a10", 
            title: "Daily Challenge: Immersion Focus", 
            description: "Complete today's challenge using immersive language",
            detailedInstructions: "1. Go to Daily Challenges\n2. When answering, write from INSIDE the scene:\n   - 'Standing here, I see...'\n   - 'The ground beneath my feet feels...'\n   - 'I can hear...'\n3. This trains immersive thinking\n4. Review AI feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🌟"
          },
          { 
            id: "v1-w2-a11", 
            title: "Card Deck: Immersive Study", 
            description: "Use Card Deck with Genesis 22, answering from inside the scene",
            detailedInstructions: "1. Go to Card Deck\n2. Enter Genesis 22:9 as your verse\n3. For each card, answer AS IF you're standing on Moriah\n4. What does this principle mean when you're THERE?\n5. Save your immersive study",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "v1-w2-a12", 
            title: "Flashcards: Genesis 22 Sensory Anchors", 
            description: "Create flashcards for key sensory moments",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Genesis 22 Immersion'\n3. Create cards:\n   - Front: 'Genesis 22:3 - What do you hear?'\n   - Back: 'Donkey hooves, wood being loaded, silence of Abraham'\n4. Create 6 sensory cards for different verses\n5. Test your immersive recall",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "v1-w2-a13", 
            title: "Emotional Journey Map", 
            description: "Chart the emotional journey through Genesis 22",
            detailedInstructions: "1. Create a timeline from v1 to v14\n2. At each key verse, mark the EMOTION:\n   - v1: Shock? Confusion?\n   - v3: Determination? Grief?\n   - v7: Heartbreak?\n   - v10: Faith? Agony?\n   - v12: Relief? Joy? Tears?\n3. Your imagination engages EMOTION, not just scenes",
            type: "drill", 
            duration: "15 min", 
            icon: "📈"
          },
          { 
            id: "v1-w2-a14", 
            title: "Multiple Perspective Practice", 
            description: "Experience Genesis 22 from Isaac's perspective",
            detailedInstructions: "1. Re-read Genesis 22:6-14\n2. This time, YOU ARE ISAAC:\n   - What do you see in your father's face?\n   - When you ask about the lamb, what do you feel?\n   - When you're bound, what goes through your mind?\n   - When the angel speaks, what do you feel?\n3. Different perspectives deepen understanding",
            type: "drill", 
            duration: "20 min", 
            link: "/bible/Genesis/22", 
            icon: "👁️"
          },
          { 
            id: "v1-w2-a15", 
            title: "Create Study: Genesis 22 Immersion Guide", 
            description: "Build a complete sensory immersion guide for Genesis 22",
            detailedInstructions: "1. Go to My Studies\n2. Create: 'Genesis 22: Immersion Guide'\n3. Structure:\n   - Section 1: The Journey (v1-8) - all 5 senses\n   - Section 2: The Mountain (v9-10) - all 5 senses\n   - Section 3: The Ram (v11-14) - all 5 senses\n   - Section 4: Emotional journey map\n   - Section 5: Christ connections (preview of cross)\n4. This becomes a model for future immersion studies",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-studies",
            icon: "📝"
          },
          { 
            id: "v1-w2-a16", 
            title: "Gems: Visual Insights from Genesis 22", 
            description: "Collect gems that emerged from your immersion",
            detailedInstructions: "1. Go to Gems Room\n2. Record gems that came from BEING THERE:\n   - Gem: The 3-day walk gave Abraham time to change his mind\n   - Gem: Isaac carrying wood up a hill = Christ carrying cross\n   - Gem: 'God will provide HIMSELF a lamb' - prophetic!\n3. Immersion reveals what reading misses",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w2-a17", 
            title: "Write a First-Person Account", 
            description: "Write Genesis 22 from Abraham or Isaac's perspective",
            detailedInstructions: "1. Choose Abraham or Isaac\n2. Write a 1-2 paragraph first-person account:\n   - 'When God spoke to me that night...'\n   - Include sensory details\n   - Include emotional journey\n3. This exercise cements immersive understanding\n4. Add to your study or share in Community",
            type: "exercise", 
            duration: "25 min", 
            icon: "✍️"
          },
          { 
            id: "v1-w2-a18", 
            title: "Community Share: Your Immersion Experience", 
            description: "Share what you discovered through imagination",
            detailedInstructions: "1. Go to Community\n2. Create post: 'Genesis 22 Immersion - What I Felt'\n3. Share:\n   - One moment that struck you most\n   - What you SAW, HEARD, FELT\n   - How it changed your understanding\n4. Comment on 2 others' immersion experiences\n5. Visual learners learn from each other's images",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w2-a19", 
            title: "Cross-Reference: John 3:16 Connection", 
            description: "Connect your Abraham experience to God's sacrifice",
            detailedInstructions: "1. Read John 3:16\n2. Now IMAGINE: You are God, watching YOUR Son on the cross\n3. Abraham's 3-day journey of grief - God's eternal plan of grief\n4. Abraham got Isaac back - God's Son died\n5. 'God so loved the world' - now you've FELT what that cost\n6. This is the power of immersive reading",
            type: "exercise", 
            duration: "15 min", 
            link: "/bible/John/3", 
            icon: "✝️"
          },
          { 
            id: "v1-w2-a20", 
            title: "Growth Journal: Week 2 Immersion Reflection", 
            description: "Reflect on your immersive learning experience",
            detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 2 - Imagination Room Reflection'\n3. Answer:\n   - Which sense was easiest to engage? Hardest?\n   - What moment in Genesis 22 affected you most?\n   - How is immersion different from just reading?\n   - How did this change your view of God's sacrifice?\n4. Set goals for Week 3",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w2-a21", 
            title: "Milestone: Full Immersion Recall", 
            description: "Test your ability to 'walk through' Genesis 22 sensorily",
            detailedInstructions: "1. Close your eyes\n2. 'Walk through' Genesis 22 using all 5 senses\n3. Can you FEEL the journey?\n4. Can you HEAR the angel's voice?\n5. Can you SEE the ram?\n6. If you can experience the story, not just remember it, you've mastered Week 2\n7. Check Achievements",
            type: "reflection", 
            duration: "10 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can immersively experience Genesis 22 using all 5 senses",
      },
      {
        weekNumber: 3,
        title: "24FPS Room - Frame by Frame",
        focus: "Create chapter anchor images for rapid Bible navigation",
        scripture: "Genesis 1-24 (Full coverage)",
        activities: [
          { 
            id: "v1-w3-a1", 
            title: "24FPS Room Introduction", 
            description: "Learn to create one symbolic image per chapter",
            detailedInstructions: "1. Go to Palace > Floor 1 > 24FPS Room\n2. Read the complete method guide\n3. KEY CONCEPT: Like a film at 24 frames per second, the Bible can be 'rendered' as chapter images\n4. One strange, memorable image per chapter\n5. The weirder the image, the better it sticks",
            type: "reading", 
            duration: "15 min", 
            roomCode: "24F", 
            link: "/palace/floor/1/room/24fps", 
            icon: "🎞️",
            lookFor: ["Why strange images work better", "The number association method", "How to build on previous frames"]
          },
          { 
            id: "v1-w3-a2", 
            title: "Genesis 1-6: First Frames", 
            description: "Create anchor images for chapters 1-6",
            detailedInstructions: "Read and create ONE image per chapter:\n1. Gen 1: Birthday cake earth (creation 'party')\n2. Gen 2: Garden with 'DO NOT TOUCH' sign (forbidden tree)\n3. Gen 3: Snake wrapped around a clock (fall into time/death)\n4. Gen 4: Bloody rock (Cain's murder)\n5. Gen 5: Long scroll with tombstones (genealogy of death)\n6. Gen 6: Giant feet walking (Nephilim, corruption)\n\nThese are suggestions - create YOUR OWN if these don't stick",
            type: "reading", 
            duration: "25 min", 
            link: "/bible/Genesis/1", 
            icon: "🖼️"
          },
          { 
            id: "v1-w3-a3", 
            title: "Genesis 7-12: Flood to Call", 
            description: "Create anchor images for chapters 7-12",
            detailedInstructions: "Create ONE image per chapter:\n7. Gen 7: Rainbow umbrella boat (ark in rain)\n8. Gen 8: Dove with olive branch GPS (finding land)\n9. Gen 9: Rainbow contract signing (covenant)\n10. Gen 10: Family tree explosion (Table of Nations)\n11. Gen 11: Broken tower with confused faces (Babel)\n12. Gen 12: Abraham with suitcase (leaving home, call)\n\nMake each image BIZARRE and PERSONAL",
            type: "reading", 
            duration: "25 min", 
            link: "/bible/Genesis/7", 
            icon: "🖼️"
          },
          { 
            id: "v1-w3-a4", 
            title: "Genesis 13-18: Abram's Journey", 
            description: "Create anchor images for chapters 13-18",
            detailedInstructions: "Create ONE image per chapter:\n13. Gen 13: Two tents separating (Abram/Lot divide)\n14. Gen 14: Melchizedek with bread & wine (mysterious priest)\n15. Gen 15: Stars being counted (covenant)\n16. Gen 16: Pregnant servant running (Hagar, Ishmael)\n17. Gen 17: Scissors/knife (circumcision covenant!)\n18. Gen 18: Three visitors at lunch (divine visitors)",
            type: "reading", 
            duration: "25 min", 
            link: "/bible/Genesis/13", 
            icon: "🖼️"
          },
          { 
            id: "v1-w3-a5", 
            title: "Genesis 19-24: Sodom to Isaac", 
            description: "Create anchor images for chapters 19-24",
            detailedInstructions: "Create ONE image per chapter:\n19. Gen 19: Pillar of salt (Lot's wife, Sodom destruction)\n20. Gen 20: King with Sarah (Abimelech deception)\n21. Gen 21: Baby laughing + running boy (Isaac born, Ishmael sent)\n22. Gen 22: Ram in thorns (Abraham's test - you know this one!)\n23. Gen 23: Cave purchase (Sarah's burial)\n24. Gen 24: Camel at well + ring (Isaac's bride found)\n\nYou now have 24 images!",
            type: "reading", 
            duration: "25 min", 
            link: "/bible/Genesis/19", 
            icon: "🖼️"
          },
          { 
            id: "v1-w3-a6", 
            title: "Encyclopedia: Genesis Overview", 
            description: "Review Genesis themes to strengthen your 24 frames",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Genesis' for the book overview\n3. Note the major divisions:\n   - Creation (1-2)\n   - Fall & Spread of Sin (3-11)\n   - Patriarchs (12-50)\n4. Does your image for each chapter fit these themes?\n5. Adjust any images that need strengthening",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📚"
          },
          { 
            id: "v1-w3-a7", 
            title: "Daily Verse: Find Its Frame", 
            description: "Identify which chapter frame today's verse belongs to",
            detailedInstructions: "1. Go to Daily Verse\n2. Read the verse reference\n3. Which chapter is it from?\n4. Can you recall your image for that chapter?\n5. How does the verse fit your frame?\n6. This connects daily study to your memory system",
            type: "reading", 
            duration: "10 min", 
            link: "/daily-verse", 
            icon: "✨"
          },
          { 
            id: "v1-w3-a8", 
            title: "Rapid Recall: Chapters 1-8", 
            description: "Practice flipping through your first 8 frames",
            detailedInstructions: "1. Set a timer for 2 minutes\n2. Close your eyes\n3. 'Flip' through frames 1-8 as fast as possible\n4. For each frame:\n   - See the image\n   - Name the chapter content\n5. Can you do all 8 in under 2 minutes?\n6. Repeat until smooth",
            type: "drill", 
            duration: "15 min", 
            icon: "⏱️"
          },
          { 
            id: "v1-w3-a9", 
            title: "24FPS Training Drill", 
            description: "Complete the official 24FPS drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select '24FPS Room' drill\n3. Match chapters to images\n4. Test your recall in both directions:\n   - Chapter number → image\n   - Image → chapter content\n5. Score 80%+",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w3-a10", 
            title: "Rapid Recall: Chapters 9-16", 
            description: "Practice flipping through frames 9-16",
            detailedInstructions: "1. Same method as before\n2. 2-minute timer\n3. Flip through frames 9-16\n4. Each frame: image → content\n5. Repeat until smooth\n6. The speed trains automatic recall",
            type: "drill", 
            duration: "15 min", 
            icon: "⏱️"
          },
          { 
            id: "v1-w3-a11", 
            title: "Daily Challenge: Genesis Reference", 
            description: "Complete challenge using your 24 frames as reference",
            detailedInstructions: "1. Go to Daily Challenges\n2. If any Genesis reference appears, use your frame\n3. The challenge tests if your frames help you LOCATE content\n4. Quick access to content = effective memory palace\n5. Review AI feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🌟"
          },
          { 
            id: "v1-w3-a12", 
            title: "Rapid Recall: Chapters 17-24", 
            description: "Practice flipping through frames 17-24",
            detailedInstructions: "1. Same 2-minute drill\n2. Flip through frames 17-24\n3. By now the method should be familiar\n4. These patriarchal stories are key for later study\n5. Repeat until smooth",
            type: "drill", 
            duration: "15 min", 
            icon: "⏱️"
          },
          { 
            id: "v1-w3-a13", 
            title: "Full Genesis Flip (1-24)", 
            description: "Test complete Genesis 1-24 recall in one session",
            detailedInstructions: "1. Set timer for 5 minutes\n2. Close eyes\n3. Flip through ALL 24 frames in order\n4. Goal: Complete, smooth recall of all 24\n5. Note any frames that slow you down\n6. Those need strengthening\n7. You're building a visual index of Genesis!",
            type: "drill", 
            duration: "20 min", 
            icon: "🎬"
          },
          { 
            id: "v1-w3-a14", 
            title: "Reverse Recall Test", 
            description: "Practice recalling frames in reverse order (24 to 1)",
            detailedInstructions: "1. Start from chapter 24 image (camel at well)\n2. Work backward to chapter 1 (birthday cake earth)\n3. This tests if your memory is truly accessible\n4. Not just forward sequence, but random access\n5. Struggling? Strengthen those connections",
            type: "drill", 
            duration: "15 min", 
            icon: "🔄"
          },
          { 
            id: "v1-w3-a15", 
            title: "Create Study: Genesis 24-Frame Gallery", 
            description: "Document all 24 frames in My Studies",
            detailedInstructions: "1. Go to My Studies\n2. Create: 'Genesis 1-24: My 24 Frames'\n3. List all 24 images with:\n   - Chapter number\n   - Image description\n   - Brief content summary\n4. This is your visual index of Genesis\n5. You can share or reference it anytime",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-studies",
            icon: "📝"
          },
          { 
            id: "v1-w3-a16", 
            title: "Bible Rendered Room Preview", 
            description: "See how 24FPS expands to the whole Bible",
            detailedInstructions: "1. Go to Palace > Floor 1 > Bible Rendered Room\n2. See how the Bible can be 'rendered' in 51 images (24 chapters each)\n3. Genesis 1-24 is just ONE 'frame' in the bigger picture\n4. Preview the method for mapping all 1189 chapters\n5. Get excited for future months!",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "BR", 
            link: "/palace/floor/1/room/br", 
            icon: "🎞️"
          },
          { 
            id: "v1-w3-a17", 
            title: "Sketch Your 24 Frames", 
            description: "Create a visual reference sheet of your 24 frames",
            detailedInstructions: "1. Get a large paper or digital canvas\n2. Draw a 4x6 grid (24 boxes)\n3. In each box, sketch your image for that chapter\n4. Number each box\n5. This becomes a physical reference\n6. The act of drawing reinforces memory",
            type: "exercise", 
            duration: "30 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w3-a18", 
            title: "Community Share: Your Unique Frames", 
            description: "Share 3-5 of your most creative chapter images",
            detailedInstructions: "1. Go to Community\n2. Post: 'My Genesis 24FPS Favorites'\n3. Share your most creative/memorable images:\n   - The image\n   - Why it works for you\n   - What chapter content it captures\n4. See what images others use\n5. You might adopt their better ideas!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w3-a19", 
            title: "Gems: 24FPS Insights", 
            description: "Collect gems from your 24-frame creation process",
            detailedInstructions: "1. Go to Gems Room\n2. What insights came from creating 24 frames?\n3. Examples:\n   - Gem: Genesis 1-11 is mostly about sin spreading, 12-50 about God's solution through one family\n   - Gem: Chapters 22-24 form a unit (sacrifice → death → bride for Isaac)\n4. The structure reveals meaning",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w3-a20", 
            title: "Growth Journal: Week 3 Reflection", 
            description: "Reflect on building your visual memory palace",
            detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 3 - 24FPS Reflection'\n3. Answer:\n   - Which frames are strongest? Weakest?\n   - Can I flip through all 24 smoothly?\n   - How does this change how I think about the Bible?\n   - What patterns did I notice in Genesis?\n4. Set goals for Week 4",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w3-a21", 
            title: "Milestone: 3-Minute Genesis Flip", 
            description: "Test if you can flip through Genesis 1-24 in under 3 minutes",
            detailedInstructions: "1. Set a 3-minute timer\n2. Close your eyes\n3. Mentally flip through all 24 frames\n4. For each: see image → recall content\n5. If you finish under 3 minutes with smooth recall, you've mastered Week 3!\n6. Check Achievements\n7. You now have a visual index of Genesis!",
            type: "reflection", 
            duration: "15 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can mentally 'flip through' Genesis 1-24 using 24 anchor images in under 3 minutes",
      },
      {
        weekNumber: 4,
        title: "Translation & Gems - Abstract to Image",
        focus: "Convert theological concepts into concrete images and collect insights",
        scripture: "Psalm 23",
        activities: [
          { 
            id: "v1-w4-a1", 
            title: "Translation Room Introduction", 
            description: "Learn to convert abstract words into concrete images",
            detailedInstructions: "1. Go to Palace > Floor 1 > Translation Room\n2. Read the complete method guide\n3. KEY CONCEPT: Every abstract word can become a concrete image\n4. Examples:\n   - 'Grace' → Rain falling on undeserving ground\n   - 'Faith' → Bridge over a chasm you can't see the bottom of\n   - 'Hope' → Anchor in a storm\n5. This 'translates' theology into pictures",
            type: "reading", 
            duration: "15 min", 
            roomCode: "TR", 
            link: "/palace/floor/1/room/tr", 
            icon: "🔄",
            lookFor: ["Abstract to concrete conversion", "Personal vs universal images", "How to test if an image 'works'"]
          },
          { 
            id: "v1-w4-a2", 
            title: "Read Psalm 23 - Visual Masterclass", 
            description: "Read Psalm 23 as a translation masterpiece",
            detailedInstructions: "1. Read Psalm 23 three times\n2. First read: Just absorb\n3. Second read: Underline every IMAGE David uses:\n   - Shepherd, green pastures, still waters, valley, rod, staff, table, oil, cup, house\n4. Third read: Notice David ALREADY translated abstract concepts (God's care) into concrete images!\n5. Psalm 23 is a VISUAL POEM. David was a master translator.",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Psalms/23", 
            icon: "📖",
            specificVerse: "Psalm 23:1-6",
            lookFor: ["The 6 verses = 6 scenes", "Movement from pasture to valley to table", "The shift from 'He' to 'You' in verse 4"]
          },
          { 
            id: "v1-w4-a3", 
            title: "Gems Room Mastery", 
            description: "Deep dive into gem collection principles",
            detailedInstructions: "1. Go to Palace > Floor 1 > Gems Room\n2. Review gem identification:\n   - A gem SPARKLES - it's not just information\n   - A gem CONNECTS - it bridges concepts\n   - A gem SURPRISES - it reveals something hidden\n3. Types of gems:\n   - Word gems (Greek/Hebrew insights)\n   - Number gems (patterns in numbers)\n   - Type gems (OT shadows of Christ)\n4. You're building a treasure chest",
            type: "reading", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w4-a4", 
            title: "Encyclopedia: Shepherd Imagery", 
            description: "Study shepherd symbolism in Scripture",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Shepherd' or 'Good Shepherd'\n3. Note:\n   - OT shepherd images (God, David, leaders)\n   - NT fulfillment (John 10: 'I am the Good Shepherd')\n   - Christ as THE Shepherd\n4. This gives context for Psalm 23 translation",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📚"
          },
          { 
            id: "v1-w4-a5", 
            title: "Read John 10:1-18 - Translation Complete", 
            description: "See how Jesus completes Psalm 23's visual language",
            detailedInstructions: "1. Read John 10:1-18\n2. Jesus claims to BE Psalm 23's Shepherd!\n3. Map His images:\n   - 'I am the door' → Psalm 23's path\n   - 'I am the good shepherd' → 'The LORD is my shepherd'\n   - 'I lay down my life' → rod and staff protection taken to death\n4. The translation from OT to NT is VISUAL",
            type: "reading", 
            duration: "15 min", 
            link: "/bible/John/10", 
            icon: "📖",
            specificVerse: "John 10:1-18"
          },
          { 
            id: "v1-w4-a6", 
            title: "Video Training: Translation Technique", 
            description: "Watch translation method demonstrations",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Translation Room' videos\n3. Watch instructors convert abstract to concrete\n4. Practice along with their examples\n5. Note techniques for finding the right image",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "v1-w4-a7", 
            title: "Month 1 Review: All Floor 1 Rooms", 
            description: "Quick review of all visual techniques before assessment",
            detailedInstructions: "1. Review each Floor 1 room:\n   - Story Room: Capture narratives as movies\n   - Imagination Room: Step inside with 5 senses\n   - 24FPS Room: One image per chapter\n   - Translation Room: Abstract to concrete\n   - Gems Room: Collect sparkling insights\n2. Note any concepts needing review\n3. This prepares you for Gate Assessment",
            type: "reading", 
            duration: "20 min", 
            link: "/palace/floor/1", 
            icon: "📚"
          },
          { 
            id: "v1-w4-a8", 
            title: "Translate Psalm 23 Verse by Verse", 
            description: "Create one vivid image for each verse",
            detailedInstructions: "Create 6 detailed images:\n1. V1: 'The LORD is my shepherd' → Jesus literally leading YOU as a sheep\n2. V2: 'Green pastures, still waters' → Lush meadow, crystal stream, YOU drinking\n3. V3: 'Restores my soul, paths of righteousness' → Being picked up when fallen, lit path\n4. V4: 'Valley of shadow' → Dark canyon, Shepherd's rod as weapon, staff as support\n5. V5: 'Table, enemies, oil, cup' → Royal banquet, defeated foes watching, oil dripping on your head\n6. V6: 'Goodness, mercy, house' → Two guardians following you, heaven's door open",
            type: "drill", 
            duration: "25 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w4-a9", 
            title: "Translation Room Drill", 
            description: "Complete the official Translation Room training drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Translation Room' drill\n3. Test your abstract-to-concrete skills\n4. For each item, visualize BEFORE answering\n5. Score 80%+",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w4-a10", 
            title: "Daily Challenge: Translation Focus", 
            description: "Complete today's challenge using translation language",
            detailedInstructions: "1. Go to Daily Challenges\n2. For any abstract concept in the challenge, translate to image\n3. Show your work: 'I see [concept] as [image] because...'\n4. This trains natural translation thinking\n5. Review AI feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🌟"
          },
          { 
            id: "v1-w4-a11", 
            title: "Gems Room Drill", 
            description: "Complete the Gems Room training drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Gems Room' drill\n3. Test gem identification skills\n4. Distinguish gems from ordinary observations\n5. Score 80%+",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w4-a12", 
            title: "Flashcards: Psalm 23 Images", 
            description: "Create flashcards linking verses to your images",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Psalm 23 Visual Translation'\n3. Create 6 cards:\n   - Front: 'Psalm 23:1' / Back: Your image + explanation\n   - Continue for all 6 verses\n4. Test both directions\n5. Master until instant recall",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "v1-w4-a13", 
            title: "Card Deck: Psalm 23 Deep Study", 
            description: "Use Card Deck to explore Psalm 23 with PT principles",
            detailedInstructions: "1. Go to Card Deck\n2. Enter Psalm 23:1 as your verse\n3. Draw 5 cards\n4. For each card, answer VISUALLY\n5. What images does this principle create?\n6. Save your visual study",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "v1-w4-a14", 
            title: "Month 1 Comprehensive Drill", 
            description: "Test all Floor 1 concepts together",
            detailedInstructions: "1. Go to Training Drills\n2. Select any 'Floor 1' comprehensive drill\n3. This covers all rooms: Story, Imagination, 24FPS, Translation, Gems\n4. Complete all questions\n5. Score at least 75% to be ready for Gate Assessment\n6. Review missed concepts",
            type: "drill", 
            duration: "25 min", 
            link: "/training-drills", 
            icon: "🏋️"
          },
          { 
            id: "v1-w4-a15", 
            title: "Create Study: Psalm 23 Visual Commentary", 
            description: "Build a complete visual study of Psalm 23",
            detailedInstructions: "1. Go to My Studies\n2. Create: 'Psalm 23: Visual Commentary'\n3. Structure:\n   - 6 sections (one per verse)\n   - Each section: verse text, your image, John 10 cross-reference, Christ connection\n   - Final section: How the journey from pasture to heaven maps to the Christian life\n4. This is your model for future psalm studies",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-studies",
            icon: "📝"
          },
          { 
            id: "v1-w4-a16", 
            title: "Month 1 Gem Collection Review", 
            description: "Organize and review all gems from Month 1",
            detailedInstructions: "1. Go to Gems Room\n2. Review ALL gems collected this month\n3. Organize by source:\n   - Genesis gems\n   - Psalm 23 gems\n   - Technique gems (insights about visual learning)\n4. You should have 15-20 gems minimum\n5. Add any final gems from this week\n6. This is your Month 1 treasure",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w4-a17", 
            title: "Illustrate Psalm 23 Journey", 
            description: "Create a visual map of the Psalm 23 journey",
            detailedInstructions: "1. Create a single panoramic image or comic strip of Psalm 23\n2. Show the journey:\n   - Start: Green pastures (safety)\n   - Through: Dark valley (trial)\n   - To: Table of victory (triumph)\n   - End: House of the LORD (eternal home)\n3. The visual captures the MOVEMENT of the psalm\n4. Add to your study, share in Community",
            type: "exercise", 
            duration: "25 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w4-a18", 
            title: "Community Share: Month 1 Visual Gallery", 
            description: "Share your best visual creations from Month 1",
            detailedInstructions: "1. Go to Community\n2. Post: 'Month 1 Visual Gallery - [Your Name]'\n3. Share:\n   - Your favorite Genesis image\n   - Your favorite Psalm 23 translation\n   - One gem that sparkled for you\n4. Comment on 3 other Month 1 posts\n5. Celebrate the visual community!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w4-a19", 
            title: "Gate Assessment Preparation", 
            description: "Prepare your 5 visual anchors and Christ connection",
            detailedInstructions: "Gate Assessment requires: 5 visual anchors + 1 Christ connection\n\nPrepare:\n1. Anchor 1: Creation week image (pick best)\n2. Anchor 2: Genesis 22 immersion moment\n3. Anchor 3: One of your 24 frames (pick strongest)\n4. Anchor 4: Psalm 23 verse translation\n5. Anchor 5: Your choice from Month 1\n6. Christ connection: Pick one anchor and explain how it points to Jesus\n\nPractice presenting these aloud",
            type: "exercise", 
            duration: "25 min", 
            icon: "📋"
          },
          { 
            id: "v1-w4-a20", 
            title: "Growth Journal: Month 1 Reflection", 
            description: "Comprehensive month-end visual reflection",
            detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Month 1 Complete - Visual Path Reflection'\n3. Answer:\n   - What Floor 1 techniques have I mastered?\n   - Which room resonates most with how I learn?\n   - What's my strongest visual anchor?\n   - What gems am I most excited about?\n   - How has visual study changed my Bible reading?\n4. Write goals for Month 2\n5. Thank God for visual learning",
            type: "reflection", 
            duration: "20 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w4-a21", 
            title: "Gate Assessment: Visual Month 1", 
            description: "Complete the Month 1 Gate Assessment",
            detailedInstructions: "1. Go to Path progress\n2. Complete Month 1 Gate Assessment:\n   - Present your 5 visual anchors\n   - Explain each image briefly\n   - Show how ONE anchor connects to Christ\n3. This is VISUAL assessment - focus on SHOWING, not just telling\n4. Passing unlocks Month 2!\n5. Celebrate completing Month 1 of your visual journey!",
            type: "reflection", 
            duration: "20 min", 
            link: "/path-week", 
            icon: "🏆"
          },
        ],
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Present 5 visual anchors from Month 1 study. Explain how one connects to Christ.",
  },
  // Generate remaining months with unique visual content
  ...generateVisualPathMonths(2, 24),
];

// ============================================
// ANALYTICAL PATH - Complete 24-Month Curriculum  
// ============================================
const analyticalPathCurriculum: MonthCurriculum[] = [
  {
    month: 1,
    title: "Detective Foundations",
    theme: "Building Your Investigation Skills",
    weeks: [
      {
        weekNumber: 1,
        title: "Observation Basics - The Detective's Notebook",
        focus: "Learning to see what casual readers miss through systematic observation",
        scripture: "Luke 15:11-32 (Prodigal Son)",
        activities: [
          { 
            id: "a1-w1-a1", 
            title: "Observation Room Introduction", 
            description: "Learn the detective's first rule: OBSERVE before you INTERPRET",
            detailedInstructions: "1. Go to Palace > Floor 2 > Observation Room\n2. Read the complete method guide\n3. KEY PRINCIPLE: A good detective gathers ALL evidence before drawing conclusions\n4. The goal: Train yourself to see 50+ details in any passage\n5. Observation is NOT interpretation - it's just noting what's there",
            type: "reading", 
            duration: "15 min", 
            roomCode: "OR", 
            link: "/palace/floor/2/room/or", 
            icon: "🔍",
            lookFor: ["The '50 observations before interpretation' rule", "Types of observations: Who, What, When, Where, How", "Distinguishing observation from interpretation"]
          },
          { 
            id: "a1-w1-a2", 
            title: "Read Luke 15:11-32 - First Pass", 
            description: "Read the Prodigal Son WITHOUT analyzing - just absorb",
            detailedInstructions: "1. Read Luke 15:11-32 in the Bible tab\n2. First reading rules:\n   - Do NOT try to find meaning yet\n   - Do NOT apply yet\n   - Just READ and absorb\n3. Note your initial emotional response\n4. Which character do you identify with?\n5. This clean first read prepares you for detective work",
            type: "reading", 
            duration: "15 min", 
            link: "/bible/Luke/15", 
            icon: "📖",
            specificVerse: "Luke 15:11-32"
          },
          { 
            id: "a1-w1-a3", 
            title: "Read Luke 15:11-32 - Second Pass with Observations", 
            description: "Re-read noting every detail you can find",
            detailedInstructions: "1. Re-read Luke 15:11-32\n2. This time, STOP at every verse and note:\n   - WHO is mentioned?\n   - WHAT do they do/say?\n   - WHERE does this happen?\n   - WHEN does action shift?\n   - HOW are things described?\n3. Write observations in a list\n4. Goal: 30+ observations minimum\n5. Don't interpret - just observe",
            type: "reading", 
            duration: "25 min", 
            link: "/bible/Luke/15", 
            icon: "🔎",
            specificVerse: "Luke 15:11-32",
            lookFor: ["Repeated words", "Contrasts", "Questions asked", "Commands given", "Emotions mentioned"]
          },
          { 
            id: "a1-w1-a4", 
            title: "Encyclopedia: Parable Article", 
            description: "Study parable interpretation principles",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Parables' or 'Parable Interpretation'\n3. Note:\n   - What makes parables unique?\n   - How many points does a parable typically make?\n   - What's the danger of over-allegorizing?\n4. This gives you detective rules for parables",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📚",
            lookFor: ["One main point principle", "Context determines meaning", "Don't press every detail"]
          },
          { 
            id: "a1-w1-a5", 
            title: "Read Luke 15:1-10 - The Context", 
            description: "Investigate what prompted this parable",
            detailedInstructions: "1. Read Luke 15:1-10 (the verses BEFORE the Prodigal Son)\n2. Note:\n   - v1-2: WHO is Jesus talking to? Why?\n   - v3-7: Lost SHEEP parable\n   - v8-10: Lost COIN parable\n3. Three parables, one theme\n4. Context is a CLUE. The detective asks: Why did Jesus tell this story HERE?",
            type: "reading", 
            duration: "15 min", 
            link: "/bible/Luke/15", 
            icon: "📖",
            specificVerse: "Luke 15:1-10"
          },
          { 
            id: "a1-w1-a6", 
            title: "Video Training: Observation Method", 
            description: "Watch analytical observation techniques demonstrated",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Observation Room' or 'Inductive Study' videos\n3. Watch how instructors systematically observe\n4. Note their method for catching details\n5. Analytical learning requires systematic approach",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "a1-w1-a7", 
            title: "Daily Verse: Observe It", 
            description: "Apply observation method to today's Daily Verse",
            detailedInstructions: "1. Go to Daily Verse\n2. Before reading ANY commentary:\n   - List 5 observations about the verse\n   - Note every word, phrase, and structure\n3. THEN read the breakdown\n4. Did the commentary catch things you missed?\n5. Did YOU catch things the commentary missed?",
            type: "reading", 
            duration: "10 min", 
            link: "/daily-verse", 
            icon: "✨"
          },
          { 
            id: "a1-w1-a8", 
            title: "50 Observations Challenge", 
            description: "Push yourself to find 50 observations in Luke 15:11-32",
            detailedInstructions: "1. Open Luke 15:11-32\n2. CHALLENGE: Write 50 observations\n3. Categories to explore:\n   - Characters and their actions (10+)\n   - Settings and movements (5+)\n   - Dialogue and speakers (10+)\n   - Contrasts and comparisons (5+)\n   - Repeated words or phrases (5+)\n   - Unusual or surprising details (5+)\n   - Questions and statements (5+)\n   - Emotions explicit or implied (5+)\n4. This is the detective's evidence file",
            type: "drill", 
            duration: "30 min", 
            link: "/bible/Luke/15", 
            icon: "📝"
          },
          { 
            id: "a1-w1-a9", 
            title: "Observation Room Training Drill", 
            description: "Complete the official Observation Room drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Observation Room' drill\n3. Test your observation skills\n4. For each question, note the EVIDENCE, not interpretation\n5. Score 80%+",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "a1-w1-a10", 
            title: "Daily Challenge: Analytical Approach", 
            description: "Complete today's challenge using systematic observation",
            detailedInstructions: "1. Go to Daily Challenges\n2. Before answering, LIST observations from the passage\n3. Let your answer flow from the evidence\n4. Show your work: 'I observe X, therefore Y'\n5. Review AI feedback for analytical thinking tips",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🌟"
          },
          { 
            id: "a1-w1-a11", 
            title: "Card Deck: Analytical Study", 
            description: "Use Card Deck to analyze Luke 15 systematically",
            detailedInstructions: "1. Go to Card Deck\n2. Enter Luke 15:20 as your verse\n3. For EACH card drawn:\n   - What observations does this prompt?\n   - What evidence supports your answer?\n4. Analytical thinking requires evidence-based answers\n5. Save your study",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "a1-w1-a12", 
            title: "Character Analysis Drill", 
            description: "Systematically analyze each character in the parable",
            detailedInstructions: "1. Create a character file for each person:\n\n   FATHER:\n   - Actions: (list all)\n   - Words: (quote all)\n   - Emotions: (note evidence)\n\n   YOUNGER SON:\n   - Actions: (list all)\n   - Words: (quote all)  \n   - Emotions: (note evidence)\n\n   OLDER SON:\n   - Actions: (list all)\n   - Words: (quote all)\n   - Emotions: (note evidence)\n\n2. This is systematic detective work",
            type: "drill", 
            duration: "25 min", 
            icon: "👤"
          },
          { 
            id: "a1-w1-a13", 
            title: "Flashcards: Observation Types", 
            description: "Create flashcards for different observation categories",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Observation Categories'\n3. Create cards for each type:\n   - Front: 'WHO observations' / Back: 'Note all characters, their relationships, titles, roles'\n   - Front: 'WHAT observations' / Back: 'Note all actions, events, objects mentioned'\n   - Continue for WHERE, WHEN, WHY, HOW\n4. Master the categories",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "a1-w1-a14", 
            title: "Structural Outline Drill", 
            description: "Create a structural outline of Luke 15:11-32",
            detailedInstructions: "1. Divide the passage into major sections\n2. Create an outline:\n   I. Introduction (v11-12) - The request\n   II. The Departure (v13-16) - Life away\n   III. The Turning (v17-19) - Coming to senses\n   IV. The Return (v20-24) - Father's response\n   V. The Older Son (v25-32) - Second response\n3. Structure reveals meaning\n4. Where is the climax? The turning point?",
            type: "drill", 
            duration: "20 min", 
            icon: "📊"
          },
          { 
            id: "a1-w1-a15", 
            title: "Create Study: Luke 15 Detective File", 
            description: "Build a comprehensive observation study",
            detailedInstructions: "1. Go to My Studies\n2. Create: 'Luke 15:11-32 Detective File'\n3. Sections:\n   - Evidence Log (50 observations)\n   - Character Profiles\n   - Structural Outline\n   - Context File (Luke 15:1-10)\n   - Questions for Further Investigation\n4. This is your model analytical study",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-studies",
            icon: "📝"
          },
          { 
            id: "a1-w1-a16", 
            title: "Questions Room Preview", 
            description: "Learn to generate questions from observations",
            detailedInstructions: "1. Go to Palace > Floor 2 > Questions Room\n2. Preview the 75 Questions method\n3. Key insight: Every observation raises questions\n4. From your Luke 15 observations, generate 10 questions:\n   - Why did the father divide the property?\n   - Why a 'distant country'?\n   - Why pigs specifically?\n5. Questions drive deeper study",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "QR", 
            link: "/palace/floor/2/room/qr", 
            icon: "❓"
          },
          { 
            id: "a1-w1-a17", 
            title: "Compare & Contrast Drill", 
            description: "Create a comparison chart for the two sons",
            detailedInstructions: "1. Create a two-column comparison:\n\n   YOUNGER SON | OLDER SON\n   -----------|----------\n   Left home  | Stayed home\n   Squandered | Served\n   ...        | ...\n\n2. Note EVERY contrast and similarity\n3. What does this reveal about the father's love?\n4. What does it reveal about the Pharisees (Luke 15:1-2)?",
            type: "exercise", 
            duration: "20 min", 
            icon: "⚖️"
          },
          { 
            id: "a1-w1-a18", 
            title: "Community Share: Your Best Observations", 
            description: "Share 5 observations others might have missed",
            detailedInstructions: "1. Go to Community\n2. Post: 'Luke 15 Detective Work - 5 Observations'\n3. Share your 5 BEST observations:\n   - Not obvious ones\n   - Details others might miss\n4. Ask: What did I miss?\n5. Comment on 2 other analytical posts\n6. Detectives collaborate!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "a1-w1-a19", 
            title: "Gems: Analytical Insights", 
            description: "Collect gems from your analytical investigation",
            detailedInstructions: "1. Go to Gems Room\n2. What GEMS emerged from your observation work?\n3. Examples:\n   - Gem: The father was WATCHING for the son (v20 'while he was still a long way off')\n   - Gem: The father RAN - culturally undignified for a patriarch\n   - Gem: The older son's complaint reveals his heart (v29-30)\n4. Gems come from careful observation",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "a1-w1-a20", 
            title: "Growth Journal: Week 1 Analytical Reflection", 
            description: "Reflect on your detective training",
            detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 1 - Observation Room Reflection'\n3. Answer:\n   - How is observation different from interpretation?\n   - What did I notice that I would have missed before?\n   - How will this change my Bible reading?\n   - What's still difficult about systematic observation?\n4. Set goals for Week 2",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "a1-w1-a21", 
            title: "Milestone: 50 Observations Complete", 
            description: "Verify you have 50 quality observations logged",
            detailedInstructions: "1. Review your observation list\n2. Do you have 50+ unique observations?\n3. Are they OBSERVATIONS (facts) or INTERPRETATIONS (meanings)?\n4. If any are interpretations, replace with true observations\n5. When you have 50 pure observations, you've mastered Week 1\n6. Check Achievements\n7. You're becoming a Scripture detective!",
            type: "reflection", 
            duration: "10 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can generate 50+ pure observations from a single passage",
      },
      {
        weekNumber: 2,
        title: "Definitions & Context - The Forensic Lab",
        focus: "Using Greek/Hebrew definitions and historical context to unlock meaning",
        scripture: "John 3:1-21 (Nicodemus)",
        activities: [
          { 
            id: "a1-w2-a1", 
            title: "Def-Com Room Introduction", 
            description: "Learn to use the forensic lab of definitions and context",
            detailedInstructions: "1. Go to Palace > Floor 2 > Def-Com Room\n2. Read the complete method guide\n3. TWO TOOLS:\n   - DEFINITIONS: Greek/Hebrew word meanings\n   - CONTEXT: Historical, cultural, literary setting\n4. These are your forensic lab tools\n5. They reveal what's hidden in translation",
            type: "reading", 
            duration: "15 min", 
            roomCode: "DC", 
            link: "/palace/floor/2/room/dc", 
            icon: "🔬",
            lookFor: ["How to use Strong's numbers", "Historical context sources", "The danger of word-study fallacies"]
          },
          { 
            id: "a1-w2-a2", 
            title: "Read John 3:1-21 - First Observation Pass", 
            description: "Observe John 3 using your Week 1 skills",
            detailedInstructions: "1. Read John 3:1-21\n2. Apply Week 1 observation method:\n   - WHO: Nicodemus - note everything about him\n   - WHAT: The dialogue - every statement and question\n   - WHEN: 'By night' - why mention this?\n   - HOW: The flow of conversation\n3. List 25+ observations before proceeding",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/John/3", 
            icon: "📖",
            specificVerse: "John 3:1-21"
          },
          { 
            id: "a1-w2-a3", 
            title: "Word Study: 'Born Again' (Greek: gennao anothen)", 
            description: "Investigate the key phrase in John 3:3",
            detailedInstructions: "1. John 3:3 - 'born again' - Greek: gennao anothen\n2. Research 'anothen':\n   - Can mean 'again' (repeat)\n   - Can mean 'from above' (source)\n3. This AMBIGUITY is the whole conversation!\n4. Nicodemus heard 'again' - Jesus meant 'from above'\n5. How does this change your understanding?",
            type: "reading", 
            duration: "20 min", 
            link: "/encyclopedia", 
            icon: "📚"
          },
          { 
            id: "a1-w2-a4", 
            title: "Context Study: Who Was Nicodemus?", 
            description: "Investigate the historical context of this Pharisee",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Nicodemus' or 'Pharisees' or 'Sanhedrin'\n3. Note:\n   - What was a 'ruler of the Jews'? (v1)\n   - What did Pharisees believe about righteousness?\n   - Why come 'by night'?\n4. Cultural context: Nicodemus had everything religion offered\n5. Jesus says: Not enough. Start over.",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📚"
          },
          { 
            id: "a1-w2-a5", 
            title: "Cross-Reference: Numbers 21 in John 3:14", 
            description: "Investigate Jesus's Old Testament reference",
            detailedInstructions: "1. Read John 3:14-15\n2. Jesus references Numbers 21 - the bronze serpent\n3. Read Numbers 21:4-9\n4. Note the PARALLEL:\n   - Israel bitten by serpents → We're bitten by sin\n   - Look at bronze serpent → Look at Christ lifted up\n   - Live → Live eternally\n5. Jesus interprets His own death through OT type",
            type: "reading", 
            duration: "15 min", 
            link: "/bible/Numbers/21", 
            icon: "📖"
          },
          { 
            id: "a1-w2-a6", 
            title: "Video Training: Word Study Methods", 
            description: "Watch word study techniques demonstrated",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Def-Com' or 'Word Study' videos\n3. Watch how to use Greek/Hebrew tools\n4. Note methods for avoiding word study fallacies\n5. Tools are powerful but need proper use",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "a1-w2-a7", 
            title: "Daily Verse: Definition Check", 
            description: "Apply definition study to today's Daily Verse",
            detailedInstructions: "1. Go to Daily Verse\n2. Pick ONE key word from the verse\n3. Research its Greek/Hebrew meaning\n4. How does the original language add depth?\n5. Note this in Growth Journal",
            type: "reading", 
            duration: "10 min", 
            link: "/daily-verse", 
            icon: "✨"
          },
          { 
            id: "a1-w2-a8", 
            title: "Greek Word Study: Key John 3 Terms", 
            description: "Research 5 key Greek words in John 3",
            detailedInstructions: "Study these 5 words:\n1. 'gennao' (born) - used how many times? v3, 4, 5, 6, 7, 8\n2. 'pneuma' (Spirit/wind) - v5, 6, 8 - note the wordplay\n3. 'pisteuō' (believe) - v12, 15, 16, 18 - what kind of belief?\n4. 'krisis' (judgment/condemnation) - v17, 18, 19\n5. 'zoē aiōnios' (eternal life) - v15, 16 - what does 'eternal' mean?\n\nRecord definitions in your study",
            type: "drill", 
            duration: "25 min", 
            icon: "📝"
          },
          { 
            id: "a1-w2-a9", 
            title: "Def-Com Room Training Drill", 
            description: "Complete the official Def-Com drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Def-Com Room' drill\n3. Test definition and context skills\n4. Use evidence from your word studies\n5. Score 80%+",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "a1-w2-a10", 
            title: "Daily Challenge: Definition Evidence", 
            description: "Complete challenge showing definition work",
            detailedInstructions: "1. Go to Daily Challenges\n2. For your answer, include definition evidence:\n   - 'The Greek word X means...'\n   - 'In context, this indicates...'\n3. Analytical answers show their work\n4. Review AI feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🌟"
          },
          { 
            id: "a1-w2-a11", 
            title: "Card Deck: John 3 Deep Analysis", 
            description: "Use Card Deck for analytical exploration",
            detailedInstructions: "1. Go to Card Deck\n2. Enter John 3:16 as your verse\n3. For each card, use DEFINITIONS and CONTEXT\n4. Support every answer with evidence\n5. Save your analytical study",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "a1-w2-a12", 
            title: "Context Reconstruction", 
            description: "Reconstruct the full context of John 3",
            detailedInstructions: "Answer these context questions:\n1. WHEN did this conversation happen? (In Jesus's ministry timeline)\n2. WHERE in Jerusalem might they have met?\n3. WHY 'by night'? (Fear? Privacy? Schedule?)\n4. WHAT had Jesus just done? (Read John 2:13-25)\n5. HOW does John 2:25 ('he knew what was in man') connect to John 3?\n6. Context shapes meaning",
            type: "drill", 
            duration: "20 min", 
            icon: "📊"
          },
          { 
            id: "a1-w2-a13", 
            title: "Flashcards: Greek Terms", 
            description: "Create flashcards for key Greek words",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'John 3 Greek Terms'\n3. Create cards:\n   - Front: 'gennao anothen' / Back: 'born from above, born again - dual meaning'\n   - Front: 'pneuma' / Back: 'Spirit, wind, breath - used for wordplay in 3:8'\n4. Include 8-10 Greek terms\n5. Master the vocabulary",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "a1-w2-a14", 
            title: "Dialogue Flow Analysis", 
            description: "Map the flow of the Nicodemus conversation",
            detailedInstructions: "Create a dialogue map:\n1. v2: Nicodemus opens (compliment? probe?)\n2. v3: Jesus responds (redirects conversation)\n3. v4: Nicodemus questions (literal misunderstanding)\n4. v5-8: Jesus explains (water and Spirit)\n5. v9: Nicodemus questions again ('How?')\n6. v10-15: Jesus explains (earthly/heavenly, Moses serpent)\n7. v16-21: Jesus's climax (God's love, light/darkness)\n\nNote: Who's speaking in v16-21? Jesus or John?",
            type: "drill", 
            duration: "20 min", 
            icon: "💬"
          },
          { 
            id: "a1-w2-a15", 
            title: "Create Study: John 3 Analytical File", 
            description: "Build a comprehensive definition/context study",
            detailedInstructions: "1. Go to My Studies\n2. Create: 'John 3 Analytical Deep Dive'\n3. Sections:\n   - Observation Log (25+ observations)\n   - Key Word Definitions (Greek terms)\n   - Historical Context (Nicodemus, Pharisees)\n   - Cross-Reference: Numbers 21\n   - Dialogue Flow Chart\n4. This is your analytical model",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-studies",
            icon: "📝"
          },
          { 
            id: "a1-w2-a16", 
            title: "Symbols/Types Room Preview", 
            description: "Preview Week 3's type/antitype methodology",
            detailedInstructions: "1. Go to Palace > Floor 2 > Symbols/Types Room\n2. Preview the methodology\n3. Note: John 3:14 IS a type-antitype connection!\n4. Bronze serpent (type) → Christ crucified (antitype)\n5. This method will deepen in Week 3",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "ST", 
            link: "/palace/floor/2/room/st", 
            icon: "🔗"
          },
          { 
            id: "a1-w2-a17", 
            title: "Write an Exegetical Summary", 
            description: "Write a 2-paragraph exegetical summary of John 3:1-21",
            detailedInstructions: "1. Write a summary that includes:\n   - Context (who, when, where, why)\n   - Key word definitions\n   - Main theological points\n   - OT background (Numbers 21)\n2. This is EXEGESIS (drawing meaning out)\n3. Not eisegesis (reading meaning in)\n4. Show your evidence",
            type: "exercise", 
            duration: "25 min", 
            icon: "✍️"
          },
          { 
            id: "a1-w2-a18", 
            title: "Community Share: Definition Discovery", 
            description: "Share a word study insight from John 3",
            detailedInstructions: "1. Go to Community\n2. Post: 'John 3 Word Study Discovery'\n3. Share ONE word study finding:\n   - The Greek word\n   - What you discovered\n   - How it changed your understanding\n4. Comment on 2 other analytical posts\n5. Detectives share findings!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "a1-w2-a19", 
            title: "Gems: Definition Gems", 
            description: "Collect gems from your definition work",
            detailedInstructions: "1. Go to Gems Room\n2. What GEMS came from definitions?\n3. Examples:\n   - Gem: 'anothen' ambiguity explains Nicodemus's confusion\n   - Gem: 'pneuma' means both Spirit and wind - Jesus is punning!\n   - Gem: 'eternal life' in Greek emphasizes QUALITY, not just duration\n4. Word studies yield gems",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "a1-w2-a20", 
            title: "Growth Journal: Week 2 Reflection", 
            description: "Reflect on definition and context skills",
            detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 2 - Def-Com Reflection'\n3. Answer:\n   - How do definitions change interpretation?\n   - What context clue surprised me most?\n   - How will I use word studies going forward?\n   - What tools do I need to master?\n4. Set goals for Week 3",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "a1-w2-a21", 
            title: "Milestone: Exegetical Skills Check", 
            description: "Verify you can do basic exegesis with definitions and context",
            detailedInstructions: "1. Review your John 3 study\n2. Can you:\n   - Define 5+ Greek terms?\n   - Explain the historical context?\n   - Map the dialogue flow?\n   - Connect Numbers 21 to John 3:14?\n3. If yes, you've mastered Week 2\n4. Check Achievements\n5. Your forensic lab skills are developing!",
            type: "reflection", 
            duration: "10 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can use definitions and context to unlock meaning",
      },
      {
        weekNumber: 3,
        title: "Symbols & Types - Pattern Recognition",
        focus: "Recognizing biblical patterns and type/antitype connections",
        scripture: "Numbers 21:4-9 → John 3:14-15",
        activities: generateAnalyticalWeek3Activities(),
        milestone: "Can identify types and their NT fulfillment",
      },
      {
        weekNumber: 4,
        title: "Integration - Full Detective Method",
        focus: "Combining all analytical tools for comprehensive study",
        scripture: "Romans 3:21-26",
        activities: generateAnalyticalWeek4Activities(),
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Present analytical findings from a passage demonstrating observation, definition, context, and type analysis.",
  },
  // Generate remaining months
  ...generateAnalyticalPathMonths(2, 24),
];

// ============================================
// DEVOTIONAL PATH - Complete 24-Month Curriculum
// ============================================
const devotionalPathCurriculum: MonthCurriculum[] = [
  {
    month: 1,
    title: "Heart Foundations",
    theme: "Encountering God Through His Word",
    weeks: [
      {
        weekNumber: 1,
        title: "Fire Room - Emotional Engagement",
        focus: "Learning to let Scripture touch your heart, not just your head",
        scripture: "John 15:1-17 (The Vine)",
        activities: generateDevotionalWeek1Activities(),
        milestone: "Experience Scripture emotionally, not just intellectually",
      },
      {
        weekNumber: 2,
        title: "Meditation Room - Slow Absorption",
        focus: "Learning to marinate in Scripture through meditation",
        scripture: "Psalm 1",
        activities: generateDevotionalWeek2Activities(),
        milestone: "Establish daily meditation habit",
      },
      {
        weekNumber: 3,
        title: "Prayer Integration - Praying Scripture",
        focus: "Turning Scripture into conversation with God",
        scripture: "Matthew 6:9-13 (Lord's Prayer)",
        activities: generateDevotionalWeek3Activities(),
        milestone: "Pray Scripture naturally",
      },
      {
        weekNumber: 4,
        title: "Heart Check - Spiritual Inventory",
        focus: "Using Scripture for self-examination and growth",
        scripture: "Psalm 139",
        activities: generateDevotionalWeek4Activities(),
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Share a transformation testimony from Month 1 study. Lead a 5-minute devotional exercise.",
  },
  // Generate remaining months
  ...generateDevotionalPathMonths(2, 24),
];

// ============================================
// WARRIOR PATH - Complete 24-Month Curriculum
// ============================================
const warriorPathCurriculum: MonthCurriculum[] = [
  {
    month: 1,
    title: "Combat Foundations",
    theme: "Building Your Scripture Arsenal",
    weeks: [
      {
        weekNumber: 1,
        title: "Speed Room - Armor On",
        focus: "Learn rapid Scripture recall through combat training methodology",
        scripture: "Ephesians 6:10-17 (Armor of God)",
        activities: generateWarriorWeek1Activities(),
        milestone: "Memorize Ephesians 6:10-17 with combat precision",
      },
      {
        weekNumber: 2,
        title: "Gospel Arsenal - Salvation Ammunition",
        focus: "Memorize the core salvation verses for instant deployment",
        scripture: "Romans 3:23, 6:23, 5:8, 10:9-10",
        activities: generateWarriorWeek2Activities(),
        milestone: "Can share the Gospel from memory in 2 minutes",
      },
      {
        weekNumber: 3,
        title: "Defense Verses - Combat Fear",
        focus: "Memorize verses to counter fear, anxiety, and doubt",
        scripture: "Psalm 91, Isaiah 54:17",
        activities: generateWarriorWeek3Activities(),
        milestone: "Can counter fear and anxiety with instant Scripture recall",
      },
      {
        weekNumber: 4,
        title: "Battle Test - Full Arsenal Assessment",
        focus: "Test all memorized verses under timed conditions",
        scripture: "Review all Month 1 verses",
        activities: generateWarriorWeek4Activities(),
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Pass timed recall test (90% accuracy in 60 seconds). Demonstrate Gospel presentation from memory.",
  },
  // Generate remaining months
  ...generateWarriorPathMonths(2, 24),
];

// ============================================
// HELPER FUNCTIONS FOR DETAILED ACTIVITIES
// ============================================

function generateAnalyticalWeek3Activities(): WeekActivity[] {
  return [
    { id: "a1-w3-a1", title: "Symbols/Types Room Introduction", description: "Learn to recognize biblical patterns and types", detailedInstructions: "1. Go to Palace > Floor 2 > Symbols/Types Room\n2. Read the complete guide\n3. KEY CONCEPTS:\n   - TYPE: OT shadow pointing forward\n   - ANTITYPE: NT fulfillment\n4. This is the detective's pattern file\n5. Once you see types, you see them everywhere", type: "reading", duration: "15 min", roomCode: "ST", link: "/palace/floor/2/room/st", icon: "🔗" },
    { id: "a1-w3-a2", title: "Read Numbers 21:4-9 - The Bronze Serpent", description: "Study the original type that Jesus referenced", detailedInstructions: "1. Read Numbers 21:4-9\n2. OBSERVE:\n   - Why serpents? (v6)\n   - What was the remedy? (v8-9)\n   - What was required of the people? (Look)\n3. This is YOUR detective file on the type\n4. Note every detail - Jesus will reference this", type: "reading", duration: "15 min", link: "/bible/Numbers/21", icon: "📖" },
    { id: "a1-w3-a3", title: "Cross-Reference: John 3:14-15 Again", description: "See how Jesus interprets the type", detailedInstructions: "1. Re-read John 3:14-15\n2. Note the PARALLEL Jesus draws:\n   - 'As Moses lifted up' → 'So must the Son of Man be lifted up'\n   - Looking → Believing\n   - Living → Eternal life\n3. Jesus IS the antitype\n4. The cross IS the pole", type: "reading", duration: "15 min", link: "/bible/John/3", icon: "✝️" },
    { id: "a1-w3-a4", title: "Encyclopedia: Types and Shadows", description: "Study the principles of typology", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Types' or 'Typology'\n3. Note:\n   - What makes a legitimate type?\n   - How do you know when something is a type?\n   - What's the danger of seeing types everywhere?\n4. This gives you analytical guardrails", type: "reading", duration: "15 min", link: "/encyclopedia", icon: "📚" },
    { id: "a1-w3-a5", title: "Study Other Serpent References", description: "Trace the serpent motif through Scripture", detailedInstructions: "1. The serpent appears multiple times:\n   - Genesis 3: The deceiver\n   - Numbers 21: The bronze remedy\n   - John 3:14: Christ on the cross\n   - Revelation 12:9: The ancient serpent identified\n2. Note how the image TRANSFORMS\n3. Satan's weapon becomes Christ's victory symbol", type: "reading", duration: "20 min", link: "/bible/Genesis/3", icon: "🐍" },
    { id: "a1-w3-a6", title: "Video Training: Typology Method", description: "Watch type/antitype analysis demonstrated", detailedInstructions: "1. Go to Video Training\n2. Find 'Symbols/Types' or 'Typology' videos\n3. Watch how instructors identify and analyze types\n4. Note the method for confirming types\n5. Avoid over-allegorizing", type: "reading", duration: "15 min", link: "/video-training", icon: "📺" },
    { id: "a1-w3-a7", title: "Daily Verse: Type Check", description: "Look for type connections in today's verse", detailedInstructions: "1. Go to Daily Verse\n2. Ask: Does this verse have OT background?\n3. Could there be a type/antitype connection?\n4. Not every verse does - but train your eye\n5. Note any connections in Growth Journal", type: "reading", duration: "10 min", link: "/daily-verse", icon: "✨" },
    { id: "a1-w3-a8", title: "Type/Antitype Comparison Chart", description: "Create a detailed comparison of Numbers 21 and John 3", detailedInstructions: "Create a comparison chart:\n\nNUMBERS 21 (TYPE) | JOHN 3 (ANTITYPE)\n-----------------|------------------\nSerpents bite Israel | Sin 'bites' humanity\nDeath sentence | Death sentence\nBronze serpent lifted | Christ lifted on cross\nLook and live | Believe and live\nPhysical healing | Spiritual healing\n\nNote: Christ took the FORM of the curse (2 Cor 5:21)", type: "drill", duration: "25 min", icon: "📊" },
    { id: "a1-w3-a9", title: "Symbols/Types Room Drill", description: "Complete the official Symbols/Types drill", detailedInstructions: "1. Go to Training Drills\n2. Select 'Symbols/Types Room' drill\n3. Test your pattern recognition\n4. Connect OT types to NT antitypes\n5. Score 80%+", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
    { id: "a1-w3-a10", title: "Daily Challenge: Type Evidence", description: "Complete challenge with type/antitype analysis", detailedInstructions: "1. Go to Daily Challenges\n2. Look for type connections in the passage\n3. In your answer, show the parallel:\n   - 'In the OT, we see X...'\n   - 'This is fulfilled in Christ through Y...'\n4. Analytical answers trace patterns", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
    { id: "a1-w3-a11", title: "Card Deck: Type Discovery", description: "Use Card Deck to find type connections", detailedInstructions: "1. Go to Card Deck\n2. Enter Numbers 21:8 as your verse\n3. For each card, consider: Does this reveal a type connection?\n4. The Cards often unlock OT-NT links\n5. Save your study", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
    { id: "a1-w3-a12", title: "Trace Additional Types", description: "Identify 3 other OT types and their NT fulfillment", detailedInstructions: "Research 3 types:\n1. Passover Lamb (Exodus 12) → Christ our Passover (1 Cor 5:7)\n2. Manna (Exodus 16) → Bread of Life (John 6:35)\n3. High Priest (Leviticus) → Christ our High Priest (Hebrews 4:14)\n\nFor each, note:\n- OT context\n- NT fulfillment\n- How Christ is greater than the type", type: "drill", duration: "25 min", icon: "🔍" },
    { id: "a1-w3-a13", title: "Flashcards: Type/Antitype Pairs", description: "Create flashcards for major biblical types", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Biblical Types'\n3. Create cards:\n   - Front: 'Bronze Serpent' / Back: 'Type of Christ on the cross (John 3:14)'\n   - Front: 'Passover Lamb' / Back: 'Type of Christ's sacrifice (1 Cor 5:7)'\n4. Include 10+ types\n5. Master the pattern library", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
    { id: "a1-w3-a14", title: "Prophetic Foreshadowing Analysis", description: "Analyze how the serpent type contains prophetic detail", detailedInstructions: "Deep analysis of Numbers 21:\n1. WHY a serpent? (Sin's symbol becomes salvation's symbol - mystery of cross)\n2. WHY bronze? (Judgment metal - Christ bore our judgment)\n3. WHY lifted up? (Visible, public, substitutionary)\n4. WHY just look? (Faith alone, not works)\n\nThe details prophesy the cross!", type: "drill", duration: "20 min", icon: "🔮" },
    { id: "a1-w3-a15", title: "Create Study: Numbers 21 - John 3 Analysis", description: "Build a comprehensive type study", detailedInstructions: "1. Go to My Studies\n2. Create: 'Bronze Serpent Type Analysis'\n3. Sections:\n   - Numbers 21 Observations\n   - John 3:14-15 Analysis\n   - Type/Antitype Comparison Chart\n   - Theological Implications\n   - Additional Cross-References (2 Cor 5:21, Gal 3:13)\n4. This is your model type study", type: "exercise", duration: "30 min", link: "/my-studies", icon: "📝" },
    { id: "a1-w3-a16", title: "Questions Room Application", description: "Generate questions from your type analysis", detailedInstructions: "1. Go to Palace > Floor 2 > Questions Room\n2. Generate 10 questions from your study:\n   - Why did God choose a serpent, not another animal?\n   - How does looking at bronze serpent parallel believing in Christ?\n   - What does 'lifted up' prophesy about the cross?\n   - How is Jesus 'made sin' like the serpent?\n3. Questions drive deeper understanding", type: "exercise", duration: "20 min", roomCode: "QR", link: "/palace/floor/2/room/qr", icon: "❓" },
    { id: "a1-w3-a17", title: "Write a Type Analysis Summary", description: "Write a summary explaining the bronze serpent type", detailedInstructions: "1. Write a 2-3 paragraph explanation:\n   - Paragraph 1: The OT context and problem\n   - Paragraph 2: The type-antitype parallel\n   - Paragraph 3: The theological significance\n2. This is analytical communication\n3. Could you teach this to someone else?", type: "exercise", duration: "25 min", icon: "✍️" },
    { id: "a1-w3-a18", title: "Community Share: Type Discovery", description: "Share your type analysis with the community", detailedInstructions: "1. Go to Community\n2. Post: 'Bronze Serpent Type Analysis'\n3. Share:\n   - Your comparison chart\n   - One insight that surprised you\n   - How this changes your view of John 3:14\n4. Comment on 2 other posts\n5. Analytical thinkers sharpen each other", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
    { id: "a1-w3-a19", title: "Gems: Type Gems", description: "Collect gems from your type analysis", detailedInstructions: "1. Go to Gems Room\n2. What GEMS came from type analysis?\n3. Examples:\n   - Gem: The serpent (curse symbol) became salvation symbol - just as Christ 'became sin' (2 Cor 5:21)\n   - Gem: 'Lifted up' in John is used 3 times (3:14, 8:28, 12:32) - each about the cross\n   - Gem: Looking required no effort - just like faith\n4. Types yield powerful gems", type: "exercise", duration: "15 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
    { id: "a1-w3-a20", title: "Growth Journal: Week 3 Reflection", description: "Reflect on pattern recognition development", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 3 - Symbols/Types Reflection'\n3. Answer:\n   - How does type analysis reveal Christ in the OT?\n   - What surprised me about the bronze serpent connection?\n   - What other types do I want to study?\n   - How has my view of OT changed?\n4. Set goals for Week 4", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
    { id: "a1-w3-a21", title: "Milestone: Type Recognition Test", description: "Verify you can identify and analyze biblical types", detailedInstructions: "1. Review your type study\n2. Can you:\n   - Explain what a 'type' is?\n   - Identify the Numbers 21 → John 3:14 connection?\n   - Name 3+ other biblical types?\n   - Explain why this matters theologically?\n3. If yes, you've mastered Week 3\n4. Check Achievements\n5. Your pattern library is growing!", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" }
  ];
}

function generateAnalyticalWeek4Activities(): WeekActivity[] {
  return [
    { id: "a1-w4-a1", title: "Integration Method Review", description: "Review all analytical tools before combining them", detailedInstructions: "1. Review your 3 weeks of training:\n   - Week 1: Observation (50 observations method)\n   - Week 2: Definition & Context (Greek/Hebrew, historical)\n   - Week 3: Symbols/Types (pattern recognition)\n2. These tools combine for comprehensive analysis\n3. Now you'll use ALL of them on one passage", type: "reading", duration: "15 min", link: "/palace/floor/2", icon: "📚" },
    { id: "a1-w4-a2", title: "Read Romans 3:21-26 - Fresh Eyes", description: "First pass observation of this dense passage", detailedInstructions: "1. Read Romans 3:21-26\n2. This is one of the most theologically rich passages in Scripture\n3. First pass: Just observe\n   - Note every term, phrase, connector\n   - Count how many concepts are packed in\n4. Warning: This is dense. Take it slow.", type: "reading", duration: "20 min", link: "/bible/Romans/3", icon: "📖", specificVerse: "Romans 3:21-26" },
    { id: "a1-w4-a3", title: "Observation Deep Dive: Romans 3:21-26", description: "Generate 30+ observations from these 6 verses", detailedInstructions: "Generate observations:\n- 'But now' (v21) - time shift\n- 'apart from law' - new principle\n- 'righteousness of God' - key concept\n- 'witnessed by Law and Prophets' - OT connection\n- Continue for all 6 verses\n- Goal: 30+ observations\n- This passage rewards deep observation", type: "reading", duration: "25 min", link: "/bible/Romans/3", icon: "🔎" },
    { id: "a1-w4-a4", title: "Key Terms: Greek Definitions", description: "Study the Greek terms in Romans 3:21-26", detailedInstructions: "Study these Greek terms:\n1. 'dikaiosyne' (righteousness) - v21, 22, 25, 26\n2. 'pistis' (faith) - v22, 25, 26\n3. 'hilasterion' (propitiation) - v25 (mercy seat!)\n4. 'paresis' (passing over) - v25\n5. 'endeixis' (demonstration) - v25, 26\n\nThese words unlock the passage", type: "reading", duration: "20 min", link: "/encyclopedia", icon: "📚" },
    { id: "a1-w4-a5", title: "Context: Romans Flow", description: "Understand where 3:21-26 fits in Romans", detailedInstructions: "1. Romans 1:18-3:20: ALL are under sin (the bad news)\n2. Romans 3:21: 'BUT NOW' - the turn!\n3. Romans 3:21-26: The gospel solution (the good news)\n4. Romans 3:27-31: Implications\n\nContext: Paul has proven EVERYONE guilty. Now he reveals the solution. This is THE turning point of Romans.", type: "reading", duration: "15 min", link: "/bible/Romans/1", icon: "📊" },
    { id: "a1-w4-a6", title: "Type Connection: Hilasterion", description: "Connect 'propitiation' to the OT mercy seat", detailedInstructions: "1. Greek 'hilasterion' (v25) = 'mercy seat' in Hebrews 9:5!\n2. This is the same word for the Ark's cover\n3. Study the Day of Atonement (Leviticus 16):\n   - High priest sprinkled blood on mercy seat\n   - God's wrath satisfied\n   - People's sin covered\n4. Christ IS our mercy seat - type fulfilled!", type: "reading", duration: "20 min", link: "/bible/Leviticus/16", icon: "🔗" },
    { id: "a1-w4-a7", title: "Daily Verse: Full Analysis", description: "Apply all analytical tools to today's verse", detailedInstructions: "1. Go to Daily Verse\n2. Apply ALL tools:\n   - Observations (5+)\n   - Key word definitions\n   - Context consideration\n   - Type connections (if any)\n3. This tests integration\n4. Note your full analysis in Growth Journal", type: "reading", duration: "15 min", link: "/daily-verse", icon: "✨" },
    { id: "a1-w4-a8", title: "Verse-by-Verse Analysis", description: "Analyze each verse of Romans 3:21-26 systematically", detailedInstructions: "Analyze verse by verse:\n\nV21: 'But now' - contrast; 'apart from law' - new basis; 'righteousness of God' - divine gift; 'witnessed' - OT prepared this\n\nV22: 'through faith' - instrument; 'for all' - scope; 'no distinction' - universality\n\nV23: 'all sinned' - universal problem; 'fall short' - present tense; 'glory' - what we lost\n\nContinue for v24-26...", type: "drill", duration: "30 min", icon: "📝" },
    { id: "a1-w4-a9", title: "Comprehensive Drill: Floor 2", description: "Test all Floor 2 skills together", detailedInstructions: "1. Go to Training Drills\n2. Select a 'Floor 2 Comprehensive' drill\n3. Questions will cover:\n   - Observation\n   - Definition\n   - Context\n   - Types\n4. Score at least 75%\n5. Review missed concepts", type: "drill", duration: "20 min", link: "/training-drills", icon: "🎯" },
    { id: "a1-w4-a10", title: "Daily Challenge: Full Method", description: "Complete challenge using complete analytical method", detailedInstructions: "1. Go to Daily Challenges\n2. Use ALL your tools:\n   - Start with observations\n   - Define key terms\n   - Consider context\n   - Look for types\n3. Show your analytical work\n4. This is integrated analysis", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
    { id: "a1-w4-a11", title: "Card Deck: Romans 3 Integration", description: "Use Card Deck for comprehensive analysis", detailedInstructions: "1. Go to Card Deck\n2. Enter Romans 3:24 as your verse\n3. For each card, use ALL tools:\n   - What observations apply?\n   - What definitions help?\n   - What context matters?\n   - What types connect?\n4. Save your comprehensive study", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
    { id: "a1-w4-a12", title: "Flashcards: Romans 3:21-26 Terms", description: "Create flashcards for all key terms", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Romans 3:21-26 Analysis'\n3. Cards:\n   - 'dikaiosyne' / 'righteousness - God's gift through faith'\n   - 'hilasterion' / 'propitiation - mercy seat - Christ satisfies God's wrath'\n   - Continue for all key terms\n4. Master the vocabulary", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
    { id: "a1-w4-a13", title: "Theological Summary Drill", description: "Summarize the theology of Romans 3:21-26", detailedInstructions: "Answer these theological questions:\n1. What is the 'righteousness of God'? (His gift vs. our achievement)\n2. How is it received? (Faith, not works)\n3. What did Christ do? (Propitiation/hilasterion)\n4. Why did God do this? (Demonstrate justice while justifying)\n5. What's the result? (Justified freely by grace)\n\nThis is the GOSPEL in concentrated form", type: "drill", duration: "20 min", icon: "📊" },
    { id: "a1-w4-a14", title: "Cross-Reference Study", description: "Trace key themes to other passages", detailedInstructions: "Cross-reference study:\n1. 'Justified freely' → Romans 5:1, 8:30\n2. 'By his blood' → Hebrews 9:22, 1 Peter 1:19\n3. 'Through faith' → Galatians 2:16, Ephesians 2:8-9\n4. 'Righteousness' → 2 Corinthians 5:21, Philippians 3:9\n\nThese connections build theological understanding", type: "drill", duration: "20 min", icon: "🔗" },
    { id: "a1-w4-a15", title: "Create Study: Romans 3:21-26 Complete", description: "Build comprehensive analytical study", detailedInstructions: "1. Go to My Study Room\n2. Create: 'Romans 3:21-26 Complete Analysis'\n3. Sections:\n   - Observations (30+)\n   - Key Greek Terms\n   - Context in Romans\n   - Type: Hilasterion/Mercy Seat\n   - Verse-by-verse analysis\n   - Theological summary\n   - Cross-references\n4. This is your Month 1 capstone", type: "exercise", duration: "35 min", link: "/my-study-room", icon: "📝" },
    { id: "a1-w4-a16", title: "Gate Assessment Preparation", description: "Prepare your analytical presentation", detailedInstructions: "Gate Assessment requires demonstrating:\n1. Observation skills (show your list)\n2. Definition work (key Greek terms)\n3. Context analysis (where it fits in Romans)\n4. Type connection (hilasterion = mercy seat)\n\nPrepare to PRESENT these findings as if teaching someone else", type: "exercise", duration: "25 min", icon: "📋" },
    { id: "a1-w4-a17", title: "Write Exegetical Paper", description: "Write a 1-page exegetical summary of Romans 3:21-26", detailedInstructions: "Write a 1-page summary including:\n1. Introduction: Context and significance\n2. Body: Key observations, definitions, and theology\n3. Type connection: Hilasterion and OT background\n4. Conclusion: Why this matters\n\nThis is analytical communication at its best", type: "exercise", duration: "30 min", icon: "✍️" },
    { id: "a1-w4-a18", title: "Community Share: Month 1 Analysis", description: "Share your analytical journey with the community", detailedInstructions: "1. Go to Community\n2. Post: 'Month 1 Analytical Journey'\n3. Share:\n   - Your best observation\n   - Your best definition discovery\n   - Your best type connection\n4. Comment on 3 other posts\n5. Celebrate the analytical community!", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
    { id: "a1-w4-a19", title: "Final Gem Collection", description: "Collect all gems from Month 1 analytical work", detailedInstructions: "1. Go to Gems Room\n2. Review ALL gems from Month 1\n3. Organize by type:\n   - Observation gems\n   - Definition gems\n   - Type gems\n4. You should have 15-20 gems\n5. Add any final gems from Romans 3\n6. This is your analytical treasure", type: "exercise", duration: "15 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
    { id: "a1-w4-a20", title: "Growth Journal: Month 1 Reflection", description: "Comprehensive analytical reflection", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Month 1 Complete - Analytical Path Reflection'\n3. Answer:\n   - What analytical skills have I developed?\n   - How has systematic study changed my Bible reading?\n   - What tools will I continue using?\n   - What area needs more development?\n4. Set goals for Month 2\n5. Thank God for analytical gifts", type: "reflection", duration: "20 min", link: "/growth-journal", icon: "📓" },
    { id: "a1-w4-a21", title: "Gate Assessment: Analytical Month 1", description: "Complete the Month 1 Gate Assessment", detailedInstructions: "1. Go to Path progress\n2. Complete Month 1 Gate Assessment:\n   - Present your analytical findings\n   - Demonstrate observation method\n   - Show definition work\n   - Explain type connection\n3. This is ANALYTICAL assessment - show your evidence\n4. Passing unlocks Month 2!\n5. Celebrate completing Month 1!", type: "reflection", duration: "20 min", link: "/path-week", icon: "🏆" }
  ];
}

// Devotional path week generators
function generateDevotionalWeek1Activities(): WeekActivity[] {
  return [
    { id: "d1-w1-a1", title: "Fire Room Introduction", description: "Learn to engage Scripture with your heart, not just your head", detailedInstructions: "1. Go to Palace > Floor 7 > Fire Room\n2. Read the complete room guide\n3. KEY CONCEPT: The Bible is not just information - it's transformation\n4. The Fire Room trains EMOTIONAL engagement\n5. Let Scripture burn, convict, comfort, and change you", type: "reading", duration: "15 min", roomCode: "FRm", link: "/palace/floor/7/room/frm", icon: "🔥", lookFor: ["The difference between studying and experiencing", "How emotions connect to truth", "Avoiding sentimentalism vs genuine response"] },
    { id: "d1-w1-a2", title: "Read John 15:1-8 - The Vine Connection", description: "Read slowly, feeling your connection to Christ", detailedInstructions: "1. Read John 15:1-8 slowly\n2. Read it THREE times:\n   - First: Just read\n   - Second: Read as if Jesus is speaking directly to YOU\n   - Third: Read and pause after each verse to FEEL the truth\n3. 'I am the vine, YOU are the branches'\n4. Let the intimacy sink in", type: "reading", duration: "20 min", link: "/bible/John/15", icon: "📖", specificVerse: "John 15:1-8" },
    { id: "d1-w1-a3", title: "Read John 15:9-17 - The Love Command", description: "Let the depth of Jesus's love penetrate your heart", detailedInstructions: "1. Read John 15:9-17\n2. Pause at v9: 'As the Father has loved me, so have I loved you'\n3. Let that sink in. Jesus loves you AS MUCH as the Father loves Him.\n4. Pause at v13: 'Greater love has no one than this'\n5. Feel the weight of sacrificial love\n6. Let v15 hit you: You are His FRIEND", type: "reading", duration: "20 min", link: "/bible/John/15", icon: "❤️", specificVerse: "John 15:9-17" },
    { id: "d1-w1-a4", title: "Encyclopedia: Abiding in Christ", description: "Study the concept of abiding for heart understanding", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Abiding' or 'Remain in Christ'\n3. Note:\n   - What does 'abide' (meno) mean?\n   - How is it more than just believing?\n   - What's the fruit of abiding?\n4. Let the concept deepen your desire for connection", type: "reading", duration: "15 min", link: "/encyclopedia", icon: "📚" },
    { id: "d1-w1-a5", title: "Cross-Reference: John 14:23", description: "See the promise of intimate dwelling", detailedInstructions: "1. Read John 14:23\n2. 'We will come and make our home with him'\n3. Let this promise fill you:\n   - Father and Son dwelling IN you\n   - You are a home for the Trinity\n4. This is the devotional heart of Christianity\n5. Spend time just receiving this truth", type: "reading", duration: "10 min", link: "/bible/John/14", icon: "📖" },
    { id: "d1-w1-a6", title: "Video Training: Heart Engagement", description: "Watch devotional reading demonstrated", detailedInstructions: "1. Go to Video Training\n2. Find 'Fire Room' or 'Devotional Reading' videos\n3. Watch how instructors engage emotionally\n4. Note the pace - SLOW\n5. Note the pauses - INTENTIONAL\n6. This is a different rhythm than analytical study", type: "reading", duration: "15 min", link: "/video-training", icon: "📺" },
    { id: "d1-w1-a7", title: "Daily Verse: Heart Reception", description: "Receive today's verse into your heart", detailedInstructions: "1. Go to Daily Verse\n2. Before reading the breakdown:\n   - Read the verse slowly\n   - Close your eyes and repeat it\n   - Ask: What is God saying to MY heart today?\n3. Receive before analyzing\n4. Note your heart response in Growth Journal", type: "reading", duration: "10 min", link: "/daily-verse", icon: "✨" },
    { id: "d1-w1-a8", title: "Slow Reading: John 15:1-17 Again", description: "Re-read at devotional pace, pausing for prayer", detailedInstructions: "1. Set timer for 15 minutes\n2. Read John 15:1-17 as slowly as possible\n3. After EVERY verse:\n   - Close your eyes\n   - Let the words sink in\n   - Pray a response to God\n4. You may not finish all 17 verses - that's okay\n5. Depth over speed", type: "drill", duration: "20 min", link: "/bible/John/15", icon: "🕯️" },
    { id: "d1-w1-a9", title: "Fire Room Training Drill", description: "Complete the Fire Room drill", detailedInstructions: "1. Go to Training Drills\n2. Select 'Fire Room' drill\n3. This drill tests heart engagement, not just knowledge\n4. Answer from your experience, not just information\n5. Let the drill prompt genuine reflection", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
    { id: "d1-w1-a10", title: "Daily Challenge: Heart Response", description: "Complete challenge with heart-focused answers", detailedInstructions: "1. Go to Daily Challenges\n2. For your answer, include:\n   - How this truth FEELS, not just what it means\n   - Your PERSONAL response\n   - A prayer that rises from the truth\n3. Devotional answers are experiential", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
    { id: "d1-w1-a11", title: "Card Deck: Devotional Exploration", description: "Use Card Deck with heart-focused reflection", detailedInstructions: "1. Go to Card Deck\n2. Enter John 15:5 as your verse\n3. For each card:\n   - Don't just think the answer\n   - FEEL the answer\n   - Let it prompt prayer\n4. This is devotional use of the tools\n5. Save your reflections", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
    { id: "d1-w1-a12", title: "Emotional Mapping: John 15", description: "Map your emotional response to each verse", detailedInstructions: "Create an emotional map:\n1. For each verse in John 15:1-17, note:\n   - What emotion does this evoke?\n   - Comfort? Challenge? Joy? Conviction?\n2. Examples:\n   - v2 'cuts off every branch' - fear? conviction?\n   - v9 'As the Father loved me' - wonder? gratitude?\n3. Your emotional response reveals your heart condition", type: "drill", duration: "20 min", icon: "💭" },
    { id: "d1-w1-a13", title: "Flashcards: Promises to Claim", description: "Create flashcards for promises to pray", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'John 15 Promises'\n3. Create cards:\n   - Front: 'John 15:5' / Back: 'Apart from Christ, I can do nothing. With Him, I bear much fruit.'\n   - Front: 'John 15:11' / Back: 'Jesus shares His joy with me so my joy may be FULL'\n4. These aren't just facts - they're promises to claim\n5. Pray through them", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
    { id: "d1-w1-a14", title: "Confession Exercise", description: "Let John 15 reveal areas needing surrender", detailedInstructions: "Read John 15 looking for:\n1. V2: Are there areas God is 'pruning' in my life?\n2. V4: Am I truly abiding, or just visiting?\n3. V5: Where am I trying to bear fruit apart from Him?\n4. V10: Am I keeping His commands to stay in His love?\n5. Write confessions in your journal\n6. Receive His grace", type: "drill", duration: "20 min", icon: "🙏" },
    { id: "d1-w1-a15", title: "Create Study: John 15 Devotional", description: "Build a devotional study for repeated use", detailedInstructions: "1. Go to My Study Room\n2. Create: 'John 15: Abiding in the Vine'\n3. Sections:\n   - The Passage (full text)\n   - Heart Observations (what strikes you)\n   - Promises to Claim\n   - Areas of Surrender\n   - Prayers from Each Section\n4. This becomes a resource for ongoing devotion", type: "exercise", duration: "30 min", link: "/my-study-room", icon: "📝" },
    { id: "d1-w1-a16", title: "Meditation Room Preview", description: "Preview Week 2's meditation methods", detailedInstructions: "1. Go to Palace > Floor 7 > Meditation Room\n2. Preview meditation techniques:\n   - Repetition meditation\n   - Lectio Divina preview\n   - Breath prayer\n3. Note: Fire Room is about initial IMPACT\n4. Meditation Room is about sustained ABSORPTION\n5. Both train the heart", type: "exercise", duration: "15 min", roomCode: "MR", link: "/palace/floor/7/room/mr", icon: "🧘" },
    { id: "d1-w1-a17", title: "Write a Personal Psalm", description: "Write a prayer/psalm based on John 15", detailedInstructions: "1. Using John 15 as inspiration, write your own psalm:\n   - Thank God for being the Vine\n   - Express your desire to abide\n   - Ask for help bearing fruit\n   - Rejoice in His friendship\n2. This is YOUR heart's response\n3. This is not literary - it's devotional\n4. Save in your journal", type: "exercise", duration: "25 min", icon: "✍️" },
    { id: "d1-w1-a18", title: "Community Share: Heart Response", description: "Share what John 15 meant to your heart", detailedInstructions: "1. Go to Community\n2. Post: 'John 15 Heart Response'\n3. Share:\n   - ONE verse that struck you most\n   - What emotion it evoked\n   - How you're responding\n4. Comment encouragingly on 2 others' posts\n5. The devotional path shares heart to heart", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
    { id: "d1-w1-a19", title: "Gems: Heart Gems", description: "Collect gems that touched your heart", detailedInstructions: "1. Go to Gems Room\n2. What GEMS touched your heart from John 15?\n3. Examples:\n   - Gem: The vinedresser (Father) tends me with care - I'm not just tolerated, I'm cultivated\n   - Gem: 'I have called you friends' - friendship with Jesus is offered\n   - Gem: His joy is meant to be IN ME and be FULL\n4. Heart gems carry emotional weight", type: "exercise", duration: "15 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
    { id: "d1-w1-a20", title: "Growth Journal: Week 1 Heart Reflection", description: "Reflect on your emotional engagement with Scripture", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 1 - Fire Room Reflection'\n3. Answer:\n   - How did reading slowly change my experience?\n   - What emotion did John 15 evoke most?\n   - How is devotional reading different from study?\n   - What's God saying to my heart this week?\n4. Set goals for Week 2", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
    { id: "d1-w1-a21", title: "Milestone: Heart Engagement Check", description: "Verify you've engaged John 15 with your heart, not just head", detailedInstructions: "Self-assessment:\n1. Can you recite John 15:5 from heart? (Not just memory - from HEART)\n2. Did you have a genuine emotional response to this passage?\n3. Has it changed how you pray or live this week?\n4. If yes, you've mastered Week 1\n5. Check Achievements\n6. The devotional journey begins in the heart", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" }
  ];
}

function generateDevotionalWeek2Activities(): WeekActivity[] {
  // Meditation Room - Psalm 1
  const activities: WeekActivity[] = [];
  const baseActivities = [
    { id: "d1-w2-a1", title: "Meditation Room Introduction", description: "Learn to marinate in Scripture through meditation", type: "reading" as const, duration: "15 min", icon: "🧘" },
    { id: "d1-w2-a2", title: "Read Psalm 1 - The Blessed Life", description: "Read the gateway psalm about meditation", type: "reading" as const, duration: "15 min", icon: "📖" },
    { id: "d1-w2-a3", title: "Word Study: 'Meditate' (Hebrew: hagah)", description: "Understand what biblical meditation truly means", type: "reading" as const, duration: "15 min", icon: "📚" },
  ];
  
  // Generate remaining activities with devotional focus
  for (let i = 0; i < 21; i++) {
    if (i < baseActivities.length) {
      activities.push(baseActivities[i]);
    } else {
      const type: "reading" | "drill" | "exercise" | "reflection" = 
        i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
      activities.push({
        id: `d1-w2-a${i + 1}`,
        title: `Psalm 1 Meditation Practice ${i - 2}`,
        description: `Meditation practice focusing on Psalm 1`,
        detailedInstructions: `1. Read Psalm 1 slowly\n2. Focus on verse ${(i % 6) + 1}\n3. Repeat it slowly\n4. Let it sink into your heart\n5. Pray your response`,
        type,
        duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
        icon: "🧘",
      });
    }
  }
  return activities;
}

function generateDevotionalWeek3Activities(): WeekActivity[] {
  // Prayer Integration - Lord's Prayer
  const activities: WeekActivity[] = [];
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    activities.push({
      id: `d1-w3-a${i + 1}`,
      title: `Prayer Practice ${i + 1}`,
      description: `Learning to pray Scripture using the Lord's Prayer`,
      detailedInstructions: `1. Read Matthew 6:9-13\n2. Use each phrase as a prayer prompt\n3. 'Our Father' - address God as Father\n4. 'Hallowed be your name' - worship\n5. Continue through each phrase`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: "🙏",
    });
  }
  return activities;
}

function generateDevotionalWeek4Activities(): WeekActivity[] {
  // Heart Check - Psalm 139
  const activities: WeekActivity[] = [];
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    activities.push({
      id: `d1-w4-a${i + 1}`,
      title: `Heart Check ${i + 1}`,
      description: `Spiritual inventory using Psalm 139`,
      detailedInstructions: `1. Read Psalm 139\n2. Let God search your heart\n3. Note areas of conviction or comfort\n4. Respond in prayer\n5. Write your reflections`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: "❤️",
    });
  }
  return activities;
}

// Warrior path week generators
function generateWarriorWeek1Activities(): WeekActivity[] {
  return [
    { id: "w1-w1-a1", title: "Speed Room Introduction", description: "Learn the combat training methodology for Scripture memory", detailedInstructions: "1. Go to Palace > Floor 7 > Speed Room\n2. Read the complete guide\n3. KEY CONCEPT: Warriors don't fumble for their weapons in battle\n4. Scripture memory must be INSTANT\n5. Speed comes from repetition under pressure", type: "reading", duration: "15 min", roomCode: "SRm", link: "/palace/floor/7/room/srm", icon: "⚡", lookFor: ["Why speed matters in spiritual battle", "The 'combat ready' standard", "How to build muscle memory for verses"] },
    { id: "w1-w1-a2", title: "Read Ephesians 6:10-17 - The Armor", description: "Read the warrior's equipment list", detailedInstructions: "1. Read Ephesians 6:10-17\n2. Note each piece of armor:\n   - Belt of truth\n   - Breastplate of righteousness\n   - Feet with gospel of peace\n   - Shield of faith\n   - Helmet of salvation\n   - Sword of the Spirit (the Word!)\n3. The SWORD is the only offensive weapon\n4. Scripture IS your weapon", type: "reading", duration: "15 min", link: "/bible/Ephesians/6", icon: "📖", specificVerse: "Ephesians 6:10-17" },
    { id: "w1-w1-a3", title: "Memorize Ephesians 6:10-11", description: "First combat memorization drill", detailedInstructions: "1. Read v10-11 ten times\n2. Cover and recite from memory\n3. Check and correct\n4. Repeat until perfect\n5. Time yourself: Can you recite in under 15 seconds?\n6. This is your FIRST combat verse\n7. A warrior knows: 'Be strong in the Lord and in his mighty power'", type: "reading", duration: "20 min", link: "/bible/Ephesians/6", icon: "⚔️" },
    { id: "w1-w1-a4", title: "Encyclopedia: Spiritual Warfare", description: "Study the enemy and the battle", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Spiritual Warfare' or 'Ephesians 6'\n3. Note:\n   - Who is the enemy? (v12)\n   - What's the battle about?\n   - Why is armor necessary?\n4. Understanding the war makes the training urgent", type: "reading", duration: "15 min", link: "/encyclopedia", icon: "📚" },
    { id: "w1-w1-a5", title: "Memorize Ephesians 6:12", description: "Know your enemy", detailedInstructions: "1. Read v12 ten times\n2. 'For we wrestle not against flesh and blood...'\n3. Memorize the full list of enemies:\n   - Principalities\n   - Powers\n   - Rulers of darkness\n   - Spiritual wickedness in high places\n4. Time yourself: 20 seconds or less\n5. Know who you're fighting", type: "reading", duration: "20 min", link: "/bible/Ephesians/6", icon: "⚔️" },
    { id: "w1-w1-a6", title: "Video Training: Memory Techniques", description: "Watch rapid memorization methods", detailedInstructions: "1. Go to Video Training\n2. Find 'Speed Room' or 'Scripture Memory' videos\n3. Watch rapid memorization techniques\n4. Note: Association, visualization, chunking\n5. Warriors train with proven methods", type: "reading", duration: "15 min", link: "/video-training", icon: "📺" },
    { id: "w1-w1-a7", title: "Daily Verse: Rapid Memorization", description: "Memorize today's verse in under 5 minutes", detailedInstructions: "1. Go to Daily Verse\n2. CHALLENGE: Memorize it in 5 minutes\n3. Read 5x, cover, recite\n4. Speed is the goal\n5. Warriors add to their arsenal daily\n6. Note your time in Growth Journal", type: "reading", duration: "10 min", link: "/daily-verse", icon: "✨" },
    { id: "w1-w1-a8", title: "Memorize Ephesians 6:13-14", description: "The stand and the belt", detailedInstructions: "1. Memorize v13: 'Therefore put on the full armor...'\n2. Memorize v14: 'Stand firm then, with the belt of truth...'\n3. Combine with v10-12\n4. Can you recite v10-14 without stopping?\n5. Time yourself: Under 45 seconds", type: "drill", duration: "20 min", icon: "⚔️" },
    { id: "w1-w1-a9", title: "Speed Room Training Drill", description: "Complete the Speed Room drill", detailedInstructions: "1. Go to Training Drills\n2. Select 'Speed Room' drill\n3. This is TIMED - accuracy under pressure\n4. Score at least 80%\n5. Speed + accuracy = combat ready", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
    { id: "w1-w1-a10", title: "Daily Challenge: Armor Up", description: "Complete challenge using Ephesians 6 verses", detailedInstructions: "1. Go to Daily Challenges\n2. Answer using your memorized verses\n3. Quote from memory, not from looking\n4. Warriors fight from the arsenal they've built\n5. Review feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
    { id: "w1-w1-a11", title: "Memorize Ephesians 6:15-16", description: "Feet and shield", detailedInstructions: "1. Memorize v15: 'feet fitted with readiness from the gospel of peace'\n2. Memorize v16: 'shield of faith to extinguish flaming arrows'\n3. Link to v10-14\n4. Full chain: Can you recite v10-16?\n5. Time: Under 1 minute", type: "drill", duration: "20 min", icon: "⚔️" },
    { id: "w1-w1-a12", title: "Card Deck: Combat Application", description: "Use Card Deck to find combat applications", detailedInstructions: "1. Go to Card Deck\n2. Enter Ephesians 6:11 as your verse\n3. For each card, answer:\n   - How does this help me FIGHT?\n   - What enemy does this defeat?\n4. The cards become tactical training\n5. Save your combat study", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
    { id: "w1-w1-a13", title: "Flashcards: Armor Pieces", description: "Create flashcards for each armor piece", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Armor of God'\n3. Create cards:\n   - 'Belt' / 'Truth (v14)'\n   - 'Breastplate' / 'Righteousness (v14)'\n   - 'Feet' / 'Gospel of peace (v15)'\n   - 'Shield' / 'Faith (v16)'\n   - 'Helmet' / 'Salvation (v17)'\n   - 'Sword' / 'Word of God (v17)'\n4. Instant recall = combat ready", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
    { id: "w1-w1-a14", title: "Memorize Ephesians 6:17 - The Sword", description: "The warrior's primary weapon", detailedInstructions: "1. Memorize v17: 'Take the helmet of salvation and the sword of the Spirit, which is the word of God'\n2. This is THE verse about Scripture as weapon\n3. FULL PASSAGE: Can you recite v10-17?\n4. Time yourself: Under 90 seconds\n5. If you can, you've armed yourself", type: "drill", duration: "20 min", icon: "⚔️" },
    { id: "w1-w1-a15", title: "Create Study: Armor Analysis", description: "Build a combat-ready armor study", detailedInstructions: "1. Go to My Study Room\n2. Create: 'Ephesians 6:10-17 Combat Guide'\n3. Sections:\n   - Full text (your memory reference)\n   - Each armor piece explained\n   - Enemy identification (v12)\n   - Combat application\n4. This is your tactical manual", type: "exercise", duration: "30 min", link: "/my-study-room", icon: "📝" },
    { id: "w1-w1-a16", title: "Battle Scenario: Fear Attack", description: "Practice using your verse against fear", detailedInstructions: "SCENARIO: You feel overwhelming fear about the future\n\nYour response:\n1. Quote Ephesians 6:10 - 'Be strong in the Lord...'\n2. Quote Ephesians 6:16 - 'Shield of faith...extinguish flaming arrows'\n3. Add: 'This fear is a flaming arrow. My faith-shield stops it.'\n\nPractice this response OUT LOUD", type: "exercise", duration: "15 min", icon: "🛡️" },
    { id: "w1-w1-a17", title: "Timed Recall Test", description: "Test your full Ephesians 6:10-17 recall under pressure", detailedInstructions: "1. Set a timer\n2. Recite Ephesians 6:10-17 from memory\n3. Record your time\n4. Goal: Under 90 seconds with no errors\n5. If you miss, note what you missed\n6. Practice the weak spots\n7. Repeat until you hit the goal", type: "exercise", duration: "20 min", icon: "⏱️" },
    { id: "w1-w1-a18", title: "Community Share: Armor Report", description: "Share your memorization progress", detailedInstructions: "1. Go to Community\n2. Post: 'Armor Up - Week 1 Report'\n3. Share:\n   - Your fastest time for Eph 6:10-17\n   - Which verse was hardest to memorize\n   - A battle scenario where you used a verse\n4. Comment on 2 other warrior posts\n5. Warriors train together", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
    { id: "w1-w1-a19", title: "Gems: Combat Insights", description: "Collect tactical gems from Ephesians 6", detailedInstructions: "1. Go to Gems Room\n2. What GEMS help you fight?\n3. Examples:\n   - Gem: 'Stand' appears 4 times - the goal is to remain standing, not to advance\n   - Gem: The sword is the ONLY offensive weapon - everything else is defensive\n   - Gem: 'Pray in the Spirit' (v18) is how armor is activated\n4. Combat gems are tactical", type: "exercise", duration: "15 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
    { id: "w1-w1-a20", title: "Growth Journal: Week 1 Combat Reflection", description: "Reflect on your warrior training", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 1 - Speed Room Reflection'\n3. Answer:\n   - Can I recite Ephesians 6:10-17 from memory?\n   - How fast can I do it?\n   - Where am I still slow?\n   - How did memorization change my confidence?\n4. Set goals for Week 2", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
    { id: "w1-w1-a21", title: "Milestone: Combat Ready Check", description: "Verify Ephesians 6:10-17 is combat ready", detailedInstructions: "FINAL TEST:\n1. Without looking, recite Ephesians 6:10-17\n2. Time yourself\n3. Check for accuracy\n4. PASS: Under 90 seconds, 100% accurate\n5. If you pass, you've completed Week 1!\n6. Check Achievements\n7. Your arsenal is building!", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" }
  ];
}

function generateWarriorWeek2Activities(): WeekActivity[] {
  // Gospel Arsenal - Romans Road
  const activities: WeekActivity[] = [];
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    activities.push({
      id: `w1-w2-a${i + 1}`,
      title: `Gospel Arsenal ${i + 1}`,
      description: `Memorizing the Romans Road for instant Gospel deployment`,
      detailedInstructions: `1. Romans 3:23 - 'For all have sinned...'\n2. Romans 6:23 - 'The wages of sin is death...'\n3. Romans 5:8 - 'God demonstrates his love...'\n4. Romans 10:9-10 - 'If you confess...'\n5. Practice the full chain until instant`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: "📜",
    });
  }
  return activities;
}

function generateWarriorWeek3Activities(): WeekActivity[] {
  // Defense Verses - Psalm 91, Isaiah 54:17
  const activities: WeekActivity[] = [];
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    activities.push({
      id: `w1-w3-a${i + 1}`,
      title: `Defense Training ${i + 1}`,
      description: `Memorizing verses to combat fear and anxiety`,
      detailedInstructions: `1. Psalm 91:1-2 - 'He who dwells in the shelter...'\n2. Psalm 91:11 - 'He will command his angels...'\n3. Isaiah 54:17 - 'No weapon formed against you...'\n4. Practice deploying these against fear attacks`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: "🛡️",
    });
  }
  return activities;
}

function generateWarriorWeek4Activities(): WeekActivity[] {
  // Battle Test - Full Assessment
  const activities: WeekActivity[] = [];
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    activities.push({
      id: `w1-w4-a${i + 1}`,
      title: `Battle Test ${i + 1}`,
      description: `Full arsenal assessment under combat conditions`,
      detailedInstructions: `1. Review ALL memorized verses\n2. Time yourself on each passage\n3. Practice battle scenarios\n4. Test Gospel presentation\n5. Prepare for Gate Assessment`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: "⚔️",
    });
  }
  return activities;
}

// ============================================
// MONTH 2-24 GENERATORS (Unique per path)
// ============================================

function generateVisualPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const visualThemes = [
    { title: "Floor 2: Visual Investigation", theme: "Seeing the Evidence", focus: ["Observation Sketching", "Visual Symbol Library", "Scene Mapping", "Evidence Boards"] },
    { title: "Floor 3: Visual Freestyle", theme: "Seeing Scripture Everywhere", focus: ["Nature Visual Parallels", "Life Scene Connections", "Visual Bible Links", "Historical Imagery"] },
    { title: "Floor 4: Christ Canvas", theme: "Painting Christ in Every Page", focus: ["Christ Portraits", "Dimensional Murals", "Pattern Galleries", "Parallel Frames"] },
    { title: "Floor 5: Prophetic Panoramas", theme: "Visualizing Prophecy", focus: ["Sanctuary Blueprint Art", "Timeline Murals", "Three Angels Gallery", "Vision Integration"] },
    { title: "Floor 6: Cosmic Canvases", theme: "Cycles and Heavens Visualized", focus: ["Cycle Panoramas", "Heaven Horizons", "Book Renderings", "Bible Overview Art"] },
    { title: "Visual Mastery Quarter", theme: "Advanced Visual Techniques", focus: ["Genesis Visual Commentary", "Exodus Illustrated", "Gospels Scenes", "Revelation Art"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % visualThemes.length;
    const theme = visualThemes[themeIndex];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Visual mastery through ${f.toLowerCase()}`,
        scripture: getVisualScripture(m, i + 1),
        activities: generateVisualMonthActivities(m, i + 1, f),
        milestone: `Create ${f} visual portfolio piece`,
      })),
      gateAssessment: `Present Month ${m} visual portfolio demonstrating ${theme.theme.toLowerCase()}.`,
    });
  }
  return months;
}

function generateAnalyticalPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const analyticalThemes = [
    { title: "Questions Mastery", theme: "75 Questions Deep Dive", focus: ["Intratextual Questions", "Intertextual Questions", "Phototheological Questions", "Question Integration"] },
    { title: "Hermeneutics", theme: "Interpretation Principles", focus: ["Context Rules", "Genre Analysis", "Author Intent Study", "Application Bridges"] },
    { title: "Word Studies Intensive", theme: "Original Language Tools", focus: ["Greek Fundamentals", "Hebrew Fundamentals", "Lexicon Mastery", "Etymology Tracking"] },
    { title: "Structural Analysis", theme: "Literary Architecture", focus: ["Chiastic Structures", "Inclusios & Brackets", "Parallelism Patterns", "Discourse Flow"] },
    { title: "Synthesis Methods", theme: "Big Picture Theology", focus: ["Book Theme Analysis", "Testament Connections", "Doctrinal Formation", "Systematic Integration"] },
    { title: "Research Excellence", theme: "Scholarly Tools", focus: ["Commentary Integration", "Cross-Reference Mastery", "Timeline Construction", "Research Capstone"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % analyticalThemes.length;
    const theme = analyticalThemes[themeIndex];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Analytical mastery through ${f.toLowerCase()}`,
        scripture: getAnalyticalScripture(m, i + 1),
        activities: generateAnalyticalMonthActivities(m, i + 1, f),
        milestone: `Complete ${f} analysis portfolio`,
      })),
      gateAssessment: `Present Month ${m} research demonstrating ${theme.theme.toLowerCase()}.`,
    });
  }
  return months;
}

function generateDevotionalPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const devotionalThemes = [
    { title: "Prayer Deepening", theme: "Intimate Communion", focus: ["ACTS Prayer Method", "Listening Prayer", "Intercessory Depth", "Prayer Journaling"] },
    { title: "Spiritual Disciplines", theme: "Habits of Grace", focus: ["Fasting Foundations", "Solitude Practice", "Silence & Stillness", "Sabbath Keeping"] },
    { title: "Character Formation", theme: "Fruit of the Spirit", focus: ["Love & Joy Cultivation", "Peace & Patience Growth", "Kindness & Goodness Practice", "Faithfulness & Gentleness"] },
    { title: "Psalms Journey", theme: "Emotional Honesty with God", focus: ["Praise Psalms", "Lament Psalms", "Wisdom Psalms", "Messianic Psalms"] },
    { title: "Life Integration", theme: "Whole-Life Devotion", focus: ["Work as Worship", "Family Devotion", "Community Spirituality", "Kingdom Living"] },
    { title: "Contemplative Depth", theme: "Ancient-Future Practices", focus: ["Lectio Divina Mastery", "Daily Examen", "Centering Prayer", "Spiritual Direction Basics"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % devotionalThemes.length;
    const theme = devotionalThemes[themeIndex];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Heart transformation through ${f.toLowerCase()}`,
        scripture: getDevotionalScripture(m, i + 1),
        activities: generateDevotionalMonthActivities(m, i + 1, f),
        milestone: `Experience ${f} breakthrough`,
      })),
      gateAssessment: `Share Month ${m} transformation testimony demonstrating ${theme.theme.toLowerCase()}.`,
    });
  }
  return months;
}

function generateWarriorPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const warriorThemes = [
    { title: "Advanced Arsenal", theme: "Expanding Memory Weapons", focus: ["OT Promise Verses", "NT Command Verses", "Prophecy Memory", "Speed Drill Mastery"] },
    { title: "Battle Tactics", theme: "Combat Strategies", focus: ["Defense Patterns", "Offensive Maneuvers", "Team Combat", "Recovery Protocols"] },
    { title: "Gospel Deployment", theme: "Evangelism Training", focus: ["Personal Evangelism", "Testimony Crafting", "Objection Handling", "Follow-Up Methods"] },
    { title: "Leadership Combat", theme: "Training Others", focus: ["Teaching Memory Methods", "Mentorship Training", "Group Combat Leadership", "Legacy Building"] },
    { title: "Scripture Survey", theme: "Complete Bible Arsenal", focus: ["OT Survey Memory", "NT Survey Memory", "Theme Chains", "Quick Draw Mastery"] },
    { title: "Full Deployment", theme: "Active Ministry Service", focus: ["Ministry Combat Application", "Community Defense", "Global Engagement", "Warrior Legacy"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % warriorThemes.length;
    const theme = warriorThemes[themeIndex];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Combat readiness through ${f.toLowerCase()}`,
        scripture: getWarriorScripture(m, i + 1),
        activities: generateWarriorMonthActivities(m, i + 1, f),
        milestone: `Achieve ${f} combat certification`,
      })),
      gateAssessment: `Pass Month ${m} battle assessment demonstrating ${theme.theme.toLowerCase()}.`,
    });
  }
  return months;
}

// Scripture getters for each path
function getVisualScripture(month: number, week: number): string {
  const scriptures = [
    "Genesis 37-50", "Exodus 1-15", "Exodus 16-40", "Joshua 1-12", 
    "Judges highlights", "Ruth 1-4", "1 Samuel 1-20", "1 Samuel 21-31",
    "Daniel 1-6", "Daniel 7-12", "Jonah 1-4", "Matthew 1-7",
    "Matthew 8-15", "Mark 1-8", "Mark 9-16", "Luke 1-9",
    "Luke 10-18", "John 1-12", "John 13-21", "Acts 1-12",
    "Revelation 1-5", "Revelation 6-11", "Revelation 12-18", "Revelation 19-22"
  ];
  return scriptures[(month * 4 + week - 5) % scriptures.length];
}

function getAnalyticalScripture(month: number, week: number): string {
  const scriptures = [
    "Romans 1-4", "Romans 5-8", "Romans 9-11", "Romans 12-16",
    "Galatians 1-3", "Galatians 4-6", "Ephesians 1-3", "Ephesians 4-6",
    "Philippians 1-4", "Colossians 1-4", "Hebrews 1-4", "Hebrews 5-8",
    "Hebrews 9-13", "James 1-5", "1 Peter 1-5", "2 Peter 1-3",
    "1 John 1-5", "Jude", "Genesis 1-11 (analysis)", "Exodus 19-24 (covenant)",
    "Leviticus 16 (atonement)", "Isaiah 52-53", "Daniel 9", "Zechariah 9-14"
  ];
  return scriptures[(month * 4 + week - 5) % scriptures.length];
}

function getDevotionalScripture(month: number, week: number): string {
  const scriptures = [
    "Psalms 1-15", "Psalms 16-30", "Psalms 31-45", "Psalms 46-60",
    "Psalms 61-75", "Psalms 76-90", "Psalms 91-105", "Psalms 106-120",
    "Psalms 121-135", "Psalms 136-150", "Proverbs 1-9", "Proverbs 10-19",
    "Proverbs 20-31", "Ecclesiastes 1-6", "Ecclesiastes 7-12", "Song of Solomon",
    "Isaiah 40-48", "Isaiah 49-55", "Isaiah 56-66", "John 13-17",
    "1 John 1-5", "Philippians 1-4", "Colossians 1-4", "Sermon on the Mount"
  ];
  return scriptures[(month * 4 + week - 5) % scriptures.length];
}

function getWarriorScripture(month: number, week: number): string {
  const scriptures = [
    "Joshua 1-6", "Joshua 7-12", "Judges 4-7", "1 Samuel 17",
    "Daniel 1-3", "Daniel 6", "Acts 1-7", "Acts 8-12",
    "Acts 13-20", "Acts 21-28", "Ephesians 6 + 2 Cor 10", "2 Timothy 1-4",
    "Revelation 12", "Revelation 13-14", "Revelation 19-20", "Revelation 21-22",
    "Isaiah 40-45", "Isaiah 54-55", "Psalms 18, 27, 46", "Psalms 91, 121, 144",
    "Romans 8", "1 Corinthians 15", "Hebrews 11", "Jude"
  ];
  return scriptures[(month * 4 + week - 5) % scriptures.length];
}

// Activity generators for each path's months 2-24
function generateVisualMonthActivities(month: number, week: number, focus: string): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const visualIcons = ["🎨", "👁️", "🖼️", "🎬", "💭", "📖", "🔍", "🎭", "🌅", "📸"];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    
    const visualVerbs = ["Paint", "Sketch", "Visualize", "Frame", "Map", "Illustrate", "Render"];
    const verb = visualVerbs[i % visualVerbs.length];
    
    activities.push({
      id: `v${month}-w${week}-a${i + 1}`,
      title: `${verb} ${focus} ${i + 1}`,
      description: `Visual ${focus.toLowerCase()} practice using image-based learning`,
      detailedInstructions: `1. Read the assigned Scripture passage\n2. ${verb} the key scenes or concepts\n3. Create a visual anchor for memory\n4. Practice recalling the image\n5. Add to your visual portfolio\n6. Connect to Christ visually`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: visualIcons[i % visualIcons.length],
    });
  }
  return activities;
}

function generateAnalyticalMonthActivities(month: number, week: number, focus: string): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const analyticalIcons = ["🔍", "📊", "🔬", "📝", "🧩", "📖", "❓", "📋", "🔗", "📈"];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    
    const analyticalVerbs = ["Analyze", "Investigate", "Research", "Document", "Compare", "Synthesize", "Evaluate"];
    const verb = analyticalVerbs[i % analyticalVerbs.length];
    
    activities.push({
      id: `a${month}-w${week}-a${i + 1}`,
      title: `${verb} ${focus} ${i + 1}`,
      description: `Analytical ${focus.toLowerCase()} practice using detective methodology`,
      detailedInstructions: `1. Read the assigned Scripture passage\n2. ${verb} using systematic observation\n3. Apply definitions and context\n4. Look for types and patterns\n5. Document findings in your research file\n6. Generate questions for further study`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: analyticalIcons[i % analyticalIcons.length],
    });
  }
  return activities;
}

function generateDevotionalMonthActivities(month: number, week: number, focus: string): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const devotionalIcons = ["🙏", "📖", "✍️", "❤️", "🕊️", "🔥", "🤫", "💭", "🌅", "✨"];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    
    const devotionalVerbs = ["Meditate on", "Pray through", "Reflect on", "Absorb", "Surrender to", "Rest in", "Receive"];
    const verb = devotionalVerbs[i % devotionalVerbs.length];
    
    activities.push({
      id: `d${month}-w${week}-a${i + 1}`,
      title: `${verb} ${focus} ${i + 1}`,
      description: `Devotional ${focus.toLowerCase()} practice for heart transformation`,
      detailedInstructions: `1. Read the assigned Scripture slowly\n2. ${verb} the passage with your heart\n3. Let God speak through the text\n4. Respond in prayer\n5. Journal your heart response\n6. Apply to your daily walk`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: devotionalIcons[i % devotionalIcons.length],
    });
  }
  return activities;
}

function generateWarriorMonthActivities(month: number, week: number, focus: string): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const warriorIcons = ["⚔️", "🛡️", "🎯", "💪", "🏆", "📜", "⚡", "🔥", "⚙️", "🎖️"];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 7 ? "reading" : i < 14 ? "drill" : i < 19 ? "exercise" : "reflection";
    
    const warriorVerbs = ["Memorize", "Drill", "Deploy", "Train", "Master", "Combat", "Defend"];
    const verb = warriorVerbs[i % warriorVerbs.length];
    
    activities.push({
      id: `w${month}-w${week}-a${i + 1}`,
      title: `${verb} ${focus} ${i + 1}`,
      description: `Warrior ${focus.toLowerCase()} training for combat readiness`,
      detailedInstructions: `1. Read and memorize the assigned verses\n2. ${verb} under timed conditions\n3. Practice rapid recall\n4. Apply to battle scenarios\n5. Test accuracy under pressure\n6. Add to your Scripture arsenal`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: warriorIcons[i % warriorIcons.length],
    });
  }
  return activities;
}

// ============================================
// EXPORTS
// ============================================
const pathCurricula: Record<PathType, MonthCurriculum[]> = {
  visual: visualPathCurriculum,
  analytical: analyticalPathCurriculum,
  devotional: devotionalPathCurriculum,
  warrior: warriorPathCurriculum,
};

export const getCurrentWeekInMonth = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysSinceStart / 7) % 4 + 1;
  return Math.min(weekNumber, 4);
};

export const getPathCurriculum = (pathType: PathType, month: number): MonthCurriculum | null => {
  const curriculum = pathCurricula[pathType];
  return curriculum.find((m) => m.month === month) || null;
};

export const getCurrentWeekOutline = (
  pathType: PathType,
  month: number,
  weekNumber: number
): WeekOutline | null => {
  const monthCurriculum = getPathCurriculum(pathType, month);
  if (!monthCurriculum) return null;
  return monthCurriculum.weeks.find((w) => w.weekNumber === weekNumber) || null;
};

export const getAllWeeksForPath = (pathType: PathType): { month: number; week: WeekOutline }[] => {
  const curriculum = pathCurricula[pathType];
  const allWeeks: { month: number; week: WeekOutline }[] = [];
  
  curriculum.forEach((monthCurr) => {
    monthCurr.weeks.forEach((week) => {
      allWeeks.push({ month: monthCurr.month, week });
    });
  });
  
  return allWeeks;
};

export { pathCurricula };
