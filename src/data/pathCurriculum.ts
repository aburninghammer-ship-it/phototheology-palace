import { PathType } from "@/hooks/usePath";

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
// VISUAL PATH - Complete 24-Month Curriculum
// ============================================
const visualPathCurriculum: MonthCurriculum[] = [
  // MONTH 1: Story Room Foundations
  {
    month: 1,
    title: "Story Room Foundations",
    theme: "Foundation of Visual Bible Study",
    weeks: [
      {
        weekNumber: 1,
        title: "Introduction to the Story Room",
        focus: "Learn Story Room (SR) techniques for capturing Bible narratives",
        scripture: "Genesis 1-3",
        activities: [
          // READING & LEARNING (7 activities)
          { 
            id: "v1-w1-a1", 
            title: "Story Room Introduction", 
            description: "Learn the Story Room method for capturing Bible narratives visually",
            detailedInstructions: "1. Go to the Palace tab and select Floor 1\n2. Enter the Story Room\n3. Read the complete room description and method\n4. Watch any training videos in the room\n5. Note the key principle: Stories are remembered best as vivid mental movies",
            type: "reading", 
            duration: "15 min", 
            roomCode: "SR", 
            link: "/palace/floor/1/room/sr", 
            icon: "📚",
            lookFor: ["The 5-7 beat story structure", "How to identify key scenes", "The role of sensory details"]
          },
          { 
            id: "v1-w1-a2", 
            title: "Read Genesis 1 - Creation Day by Day", 
            description: "Read Genesis 1 slowly, creating a mental image for each day of creation",
            detailedInstructions: "1. Go to the Bible tab\n2. Navigate to Genesis Chapter 1\n3. Read verses 1-5 (Day 1): Picture darkness, then LIGHT bursting forth\n4. Read verses 6-8 (Day 2): See waters dividing, sky forming above\n5. Read verses 9-13 (Day 3): Watch land rise from waters, plants sprouting\n6. Continue through Day 7, creating one vivid image per day\n7. Write down your 7 images in the Growth Journal",
            type: "reading", 
            duration: "25 min", 
            link: "/bible/Genesis/1", 
            icon: "📖",
            specificVerse: "Genesis 1:1-31",
            lookFor: ["The repeated phrase 'And God said'", "The pattern of evening and morning", "What God called 'good' vs 'very good'"]
          },
          { 
            id: "v1-w1-a3", 
            title: "Read Genesis 2 - The Garden Scene", 
            description: "Visualize the Garden of Eden in complete detail",
            detailedInstructions: "1. Read Genesis 2:4-25 in the Bible tab\n2. Map the garden layout: Where is the Tree of Life? The Tree of Knowledge?\n3. Picture the four rivers flowing out\n4. Visualize Adam naming animals - imagine the parade of creatures\n5. See the creation of Eve from Adam's side\n6. Note: This is your mental 'set' for the Fall story",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/2", 
            icon: "📖",
            specificVerse: "Genesis 2:4-25",
            lookFor: ["The location of the two special trees", "Adam's task of naming", "The phrase 'not good' - the only thing not good in creation"]
          },
          { 
            id: "v1-w1-a4", 
            title: "Read Genesis 3 - The Fall", 
            description: "Capture the tragedy of the Fall in vivid scenes",
            detailedInstructions: "1. Read Genesis 3 in the Bible tab\n2. Scene 1 (v1-5): The serpent's conversation with Eve - note his tactics\n3. Scene 2 (v6-7): The moment of eating - watch the progression: saw, desired, took, ate, gave\n4. Scene 3 (v8-13): Hiding from God - feel the shame\n5. Scene 4 (v14-19): The curses pronounced\n6. Scene 5 (v20-24): Clothing and exile - note God's mercy even in judgment",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/3", 
            icon: "📖",
            specificVerse: "Genesis 3:1-24",
            lookFor: ["The serpent's three lies", "The first gospel promise in verse 15", "Who made the clothes in verse 21"]
          },
          { 
            id: "v1-w1-a5", 
            title: "Encyclopedia: Creation Article", 
            description: "Study the 'Creation' article for deeper theological context",
            detailedInstructions: "1. Go to the Encyclopedia tab\n2. Search for 'Creation'\n3. Read the full article, noting:\n   - The PT codes mentioned (which rooms apply)\n   - The Christ connections\n   - The cross-references to other passages\n4. Look for the 'Visual Hooks' section - these are pre-made images to remember\n5. Note 3 new insights in your Growth Journal",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📖",
            lookFor: ["How creation points to Christ (Colossians 1:16)", "The Sabbath as creation memorial", "PT room connections"]
          },
          { 
            id: "v1-w1-a6", 
            title: "Video Training: Story Room Method", 
            description: "Watch the Story Room training video for visual learners",
            detailedInstructions: "1. Go to Video Training tab\n2. Find the 'Floor 1' or 'Story Room' category\n3. Watch the introductory video completely\n4. Pause and practice when the instructor demonstrates\n5. Take notes on any techniques you want to remember",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "v1-w1-a7", 
            title: "Daily Verse Meditation", 
            description: "Check today's Daily Verse and apply Story Room principles",
            detailedInstructions: "1. Go to the Daily Verse section\n2. Read today's verse slowly three times\n3. Ask: What story does this verse come from?\n4. Visualize the context - who said it, to whom, where?\n5. Create one memorable image for the verse\n6. Write your image in the Growth Journal",
            type: "reading", 
            duration: "10 min", 
            link: "/daily-verse", 
            icon: "✨"
          },

          // DRILLS & PRACTICE (7 activities)
          { 
            id: "v1-w1-a8", 
            title: "Story Room Training Drill", 
            description: "Complete the official Story Room drill in the Training section",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Story Room' drill\n3. Complete all questions in the drill\n4. Aim for at least 80% accuracy\n5. Review any questions you missed\n6. Repeat the drill if needed until you score 80%+",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w1-a9", 
            title: "Daily Challenge: Creation Theme", 
            description: "Complete today's Daily Challenge focusing on creation connections",
            detailedInstructions: "1. Go to Daily Challenges\n2. Complete all parts of today's challenge\n3. When answering, use visual language ('I see...', 'Picture...')\n4. Connect your answers to Genesis 1-3 when possible\n5. Submit and review the AI feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🎯"
          },
          { 
            id: "v1-w1-a10", 
            title: "Card Deck Study: Genesis Stories", 
            description: "Use the PT Card Deck to explore Genesis story connections",
            detailedInstructions: "1. Go to the Card Deck tab\n2. Enter Genesis 1:1 as your starting verse\n3. Draw 3-4 cards from the deck\n4. For each card, ask: How does this principle apply to Creation?\n5. Write down one insight per card\n6. Save your study session",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "v1-w1-a11", 
            title: "Verse Match Game: Genesis", 
            description: "Play Verse Match to reinforce Genesis chapter recognition",
            detailedInstructions: "1. Go to Games tab\n2. Select 'Verse Match' game\n3. Choose Genesis as your book focus\n4. Complete at least 3 rounds\n5. Try to beat your previous score\n6. Note which verses were hardest to match",
            type: "drill", 
            duration: "15 min", 
            link: "/games", 
            icon: "🎮"
          },
          { 
            id: "v1-w1-a12", 
            title: "Flashcard Practice: Creation Days", 
            description: "Create and study flashcards for the 7 days of creation",
            detailedInstructions: "1. Go to Flashcards tab\n2. Create a new deck called 'Creation Week'\n3. Create 7 cards - one for each day:\n   - Front: 'Day 1 of Creation'\n   - Back: 'Light created, divided from darkness (Gen 1:3-5)'\n4. Study your deck until you can recall all 7 days instantly\n5. Test yourself by going through the deck 3 times",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "v1-w1-a13", 
            title: "Palace Quiz: Floor 1 Basics", 
            description: "Test your understanding of Floor 1 room purposes",
            detailedInstructions: "1. Go to Games tab\n2. Select 'Palace Quiz'\n3. Choose 'Floor 1' as your focus\n4. Answer questions about each room's purpose\n5. Review explanations for any wrong answers\n6. Score at least 70% to pass",
            type: "drill", 
            duration: "15 min", 
            link: "/games", 
            icon: "❓"
          },
          { 
            id: "v1-w1-a14", 
            title: "Story Beat Identification", 
            description: "Practice identifying story beats in Genesis 3",
            detailedInstructions: "1. Open Genesis 3 in the Bible tab\n2. Divide the chapter into 5-7 'beats' (key moments)\n3. Give each beat a short title (e.g., 'The Temptation', 'The Fall', 'The Hiding')\n4. For each beat, create one vivid mental image\n5. Practice recalling all beats in order\n6. Write your beat structure in Growth Journal",
            type: "drill", 
            duration: "20 min", 
            link: "/bible/Genesis/3", 
            icon: "🎬"
          },

          // EXERCISES & APPLICATION (7 activities)
          { 
            id: "v1-w1-a15", 
            title: "Create a Study: Genesis 1-3 Visual Map", 
            description: "Use My Study Room to create a visual story map of Creation to Fall",
            detailedInstructions: "1. Go to My Study Room\n2. Click 'New Study'\n3. Title: 'Genesis 1-3: Creation to Fall'\n4. Add 3 sections: Creation (Ch 1), Garden (Ch 2), Fall (Ch 3)\n5. In each section, write:\n   - Key verses (copy/paste from Bible tab)\n   - Your visual descriptions\n   - One Christ connection\n6. Save your study",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-study-room", 
            icon: "📝"
          },
          { 
            id: "v1-w1-a16", 
            title: "Gems Room: First Gem Collection", 
            description: "Start your gem collection with insights from Genesis 1-3",
            detailedInstructions: "1. Go to Palace > Floor 1 > Gems Room\n2. Read how to identify a 'gem' (a striking insight)\n3. From Genesis 1-3, find 3 gems. Examples:\n   - Gem 1: God spoke creation into existence (power of His word)\n   - Gem 2: 'Very good' only after humans created (our special value)\n   - Gem 3: God clothed Adam & Eve (first sacrifice pointing to Christ)\n4. Record each gem with its verse reference\n5. Explain why it's meaningful to you",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w1-a17", 
            title: "Draw/Sketch Creation Scene", 
            description: "Create a simple sketch or diagram of one creation day",
            detailedInstructions: "1. Choose your favorite day of creation\n2. On paper (or digital), sketch the scene:\n   - Day 1: Light bursting from darkness\n   - Day 3: Land rising, plants sprouting\n   - Day 6: Animals and humans together\n3. Label key elements\n4. Take a photo and add to your study in My Study Room\n5. This visual anchor will help you remember",
            type: "exercise", 
            duration: "20 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w1-a18", 
            title: "Community Share: Your Best Image", 
            description: "Share your favorite visual from Genesis 1-3 with the community",
            detailedInstructions: "1. Go to Community tab\n2. Create a new post\n3. Title: 'My Genesis Visual: [Your Title]'\n4. Share one visual image you created this week\n5. Explain: What makes this image memorable for you?\n6. Ask: What images do others use for this passage?\n7. Respond to at least one comment on your post",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w1-a19", 
            title: "Concentration Room Preview", 
            description: "Preview how Genesis 1-3 points to Christ",
            detailedInstructions: "1. Go to Palace > Floor 4 > Concentration Room\n2. Read about finding Christ in every passage\n3. Apply to Genesis 1-3:\n   - Christ as Creator (John 1:3, Colossians 1:16)\n   - Christ as the 'Seed' promised in Genesis 3:15\n   - Christ as the Lamb whose skin covered Adam & Eve\n4. Note these connections in your Genesis study",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "CR", 
            link: "/palace/floor/4/room/cr", 
            icon: "✝️"
          },
          { 
            id: "v1-w1-a20", 
            title: "Growth Journal Reflection", 
            description: "Write a reflection on your week 1 learning",
            detailedInstructions: "1. Go to Growth Journal\n2. Create a new entry: 'Week 1 Reflection - Story Room'\n3. Answer these questions:\n   - What is the Story Room method?\n   - What are my 7 images for Creation Week?\n   - What's my strongest visual from Genesis 1-3?\n   - What do I need to practice more?\n4. Set one goal for Week 2",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w1-a21", 
            title: "Achievements Check & Milestone", 
            description: "Review your achievements and confirm Week 1 milestone",
            detailedInstructions: "1. Go to Achievements tab\n2. Check which achievements you've earned this week\n3. Self-assess your milestone: Can you recall the 7 days of Creation with vivid imagery?\n4. If yes, celebrate! You've completed Week 1.\n5. If no, review your images and practice until you can.\n6. Plan your Week 2 schedule",
            type: "reflection", 
            duration: "10 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can recall the 7 days of Creation with vivid imagery",
      },
      {
        weekNumber: 2,
        title: "The Imagination Room",
        focus: "Step inside Bible stories through sanctified imagination",
        scripture: "Genesis 22 (Abraham and Isaac)",
        activities: [
          // READING & LEARNING
          { 
            id: "v1-w2-a1", 
            title: "Imagination Room Introduction", 
            description: "Learn how to immerse yourself in Scripture scenes",
            detailedInstructions: "1. Go to Palace > Floor 1 > Imagination Room\n2. Read the complete room guide\n3. Key concept: Don't just watch the story - BE THERE\n4. Engage all 5 senses: sight, sound, smell, touch, taste\n5. Note the difference from Story Room: Story Room = watch the movie, Imagination Room = star in the movie",
            type: "reading", 
            duration: "15 min", 
            roomCode: "IR", 
            link: "/palace/floor/1/room/ir", 
            icon: "📚",
            lookFor: ["The 5 senses method", "Ethical boundaries for imagination", "How to stay true to the text"]
          },
          { 
            id: "v1-w2-a2", 
            title: "Read Genesis 22:1-8 - The Journey", 
            description: "Read the first half, placing yourself alongside Abraham",
            detailedInstructions: "1. Read Genesis 22:1-8 slowly in the Bible tab\n2. Imagine: You are walking beside Abraham\n3. Feel: The weight of the wood Isaac carries\n4. Hear: Isaac's innocent question in verse 7\n5. See: Abraham's face as he answers 'God will provide'\n6. Note every sensory detail you can imagine",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/22", 
            icon: "📖",
            specificVerse: "Genesis 22:1-8",
            lookFor: ["Abraham's early morning departure (urgency? reluctance?)", "The 3-day journey (time for doubt)", "Isaac's trust in his father"]
          },
          { 
            id: "v1-w2-a3", 
            title: "Read Genesis 22:9-14 - The Climax", 
            description: "Experience the dramatic climax with all your senses",
            detailedInstructions: "1. Read Genesis 22:9-14\n2. Slow down at verse 10: Feel Abraham's hand raising the knife\n3. Hear the angel's voice breaking through: 'Abraham! Abraham!'\n4. Turn your head and see the ram caught in the thicket\n5. Feel the relief, the tears, the worship\n6. Understand the name 'Jehovah-Jireh' (The LORD Will Provide)",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Genesis/22", 
            icon: "📖",
            specificVerse: "Genesis 22:9-14",
            lookFor: ["Isaac's submission (he could have run)", "The exact moment of intervention", "The ram as a substitute"]
          },
          { 
            id: "v1-w2-a4", 
            title: "Encyclopedia: Sacrifice Article", 
            description: "Study the concept of sacrifice in Scripture",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search for 'Sacrifice' or 'Offering'\n3. Read about the purpose of sacrifice in the OT\n4. Find connections to:\n   - Abraham and Isaac\n   - Passover lamb\n   - Christ as final sacrifice\n5. Note 3 insights for your Genesis 22 study",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📖",
            lookFor: ["Substitution theme", "Blood requirement", "Voluntary sacrifice"]
          },
          { 
            id: "v1-w2-a5", 
            title: "Video Training: Imagination Techniques", 
            description: "Watch training on sanctified imagination",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Imagination Room' or 'Floor 1' videos\n3. Watch the demonstration of entering a Bible scene\n4. Practice along with the video\n5. Note any new techniques to try",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "v1-w2-a6", 
            title: "Hebrews 11:17-19 - Faith Connection", 
            description: "Read the New Testament commentary on Abraham's faith",
            detailedInstructions: "1. Read Hebrews 11:17-19 in the Bible tab\n2. Notice: Abraham believed God could raise Isaac from the dead\n3. This adds depth to Genesis 22 - Abraham expected resurrection!\n4. Add this insight to your Genesis 22 study\n5. See how the NT illuminates the OT",
            type: "reading", 
            duration: "10 min", 
            link: "/bible/Hebrews/11", 
            icon: "📖",
            specificVerse: "Hebrews 11:17-19"
          },
          { 
            id: "v1-w2-a7", 
            title: "Daily Verse Connection", 
            description: "Apply Imagination Room techniques to today's Daily Verse",
            detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. Ask: What scene does this verse come from?\n4. Step INTO that scene using imagination\n5. What do you see, hear, feel?\n6. Record your experience in Growth Journal",
            type: "reading", 
            duration: "10 min", 
            link: "/daily-verse", 
            icon: "✨"
          },

          // DRILLS & PRACTICE
          { 
            id: "v1-w2-a8", 
            title: "Imagination Room Training Drill", 
            description: "Complete the Imagination Room drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Imagination Room' drill\n3. Answer all questions about the method\n4. Pay attention to questions about sensory details\n5. Score at least 80% before moving on",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w2-a9", 
            title: "Daily Challenge: Abraham Theme", 
            description: "Complete today's challenge with Abraham focus",
            detailedInstructions: "1. Go to Daily Challenges\n2. Complete today's challenge\n3. In your answers, reference Genesis 22\n4. Use vivid, sensory language\n5. Review AI feedback for insights",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🎯"
          },
          { 
            id: "v1-w2-a10", 
            title: "Card Deck: Genesis 22 Deep Dive", 
            description: "Use Card Deck to explore Genesis 22 connections",
            detailedInstructions: "1. Go to Card Deck\n2. Enter Genesis 22:8 as your verse\n3. Draw 4 cards\n4. For each card, write how it applies to Abraham's faith test\n5. Save your study with notes",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "v1-w2-a11", 
            title: "Verse Match: Genesis Chapters", 
            description: "Practice matching Genesis verses to their chapters",
            detailedInstructions: "1. Go to Games > Verse Match\n2. Select Genesis\n3. Play 3 rounds\n4. Focus on Chapters 1-3, 12, 15, 22\n5. Try to improve your speed and accuracy",
            type: "drill", 
            duration: "15 min", 
            link: "/games", 
            icon: "🎮"
          },
          { 
            id: "v1-w2-a12", 
            title: "Flashcards: Abraham's Journey", 
            description: "Create flashcards for key Genesis 22 moments",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Genesis 22 - The Test'\n3. Create 6 cards:\n   - 'God's command' / 'Take your son, your only son Isaac, whom you love (22:2)'\n   - 'Abraham's response' / 'Rose early in the morning (22:3)'\n   - 'Isaac's question' / 'Where is the lamb? (22:7)'\n   - 'Abraham's answer' / 'God will provide Himself a lamb (22:8)'\n   - 'The substitute' / 'A ram caught in the thicket (22:13)'\n   - 'The memorial name' / 'Jehovah-Jireh - The LORD Will Provide (22:14)'\n4. Study until you can recall all 6",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "v1-w2-a13", 
            title: "5 Senses Exercise", 
            description: "Practice engaging all 5 senses in Genesis 22",
            detailedInstructions: "1. Choose one scene: The moment Abraham raises the knife (v10)\n2. Write what you:\n   - SEE: The knife glinting, Isaac bound, altar stones\n   - HEAR: Wind, breathing, Abraham's heartbeat\n   - SMELL: Wood, smoke from fire, dust\n   - TOUCH: Rough rope, cold knife handle, dry throat\n   - TASTE: Fear, salt of tears\n3. This sensory richness locks the scene in memory",
            type: "drill", 
            duration: "15 min", 
            icon: "👁️"
          },
          { 
            id: "v1-w2-a14", 
            title: "Story Sequence Drill", 
            description: "Practice recalling Genesis 22 in order",
            detailedInstructions: "1. Close your Bible\n2. Write the story beats of Genesis 22 from memory:\n   - Beat 1: The call\n   - Beat 2: The journey\n   - Beat 3: The ascent\n   - Beat 4: The question\n   - Beat 5: The altar\n   - Beat 6: The intervention\n   - Beat 7: The provision\n3. Check your accuracy\n4. Repeat until you can do it without error",
            type: "drill", 
            duration: "15 min", 
            icon: "🔢"
          },

          // EXERCISES & APPLICATION
          { 
            id: "v1-w2-a15", 
            title: "Create Study: Genesis 22 Immersion", 
            description: "Build a comprehensive study in My Study Room",
            detailedInstructions: "1. Go to My Study Room\n2. Create new study: 'Genesis 22: Walking with Abraham'\n3. Add sections:\n   - Section 1: The Command (v1-2) - What did Abraham feel?\n   - Section 2: The Journey (v3-6) - Three days of trust\n   - Section 3: The Question (v7-8) - Isaac's faith, Abraham's answer\n   - Section 4: The Climax (v9-14) - God provides\n4. In each section, include your sensory experiences\n5. Add the Christ connection: God DID sacrifice His only Son",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-study-room", 
            icon: "📝"
          },
          { 
            id: "v1-w2-a16", 
            title: "Gems: Genesis 22 Treasures", 
            description: "Add 3 gems from Genesis 22 to your collection",
            detailedInstructions: "1. Go to Gems Room\n2. Add 3 gems from Genesis 22:\n   - Gem: 'God will provide HIMSELF a lamb' (22:8) - Christ is both provider and provision\n   - Gem: Isaac carried the wood like Christ carried the cross\n   - Gem: The ram 'caught' (not wandering) - God prepared it beforehand\n3. Explain why each is precious to you",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w2-a17", 
            title: "Write First-Person Account", 
            description: "Write Genesis 22 from Isaac's perspective",
            detailedInstructions: "1. In Growth Journal or My Study Room\n2. Write a short first-person account (200-300 words)\n3. Begin: 'My father woke me before dawn...'\n4. Include Isaac's thoughts during:\n   - The journey\n   - His question about the lamb\n   - Being bound on the altar\n   - Seeing the ram\n5. This exercise deepens your connection to the story",
            type: "exercise", 
            duration: "25 min", 
            icon: "✍️"
          },
          { 
            id: "v1-w2-a18", 
            title: "Community Share: Imagination Experience", 
            description: "Share your Genesis 22 imagination exercise",
            detailedInstructions: "1. Go to Community\n2. Create post: 'Stepping Into Genesis 22'\n3. Share:\n   - Which moment was most powerful to imagine?\n   - What did you 'see' or 'feel' that you never noticed before?\n   - How did imagination deepen your understanding?\n4. Invite others to share their experiences\n5. Respond to at least 2 comments",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w2-a19", 
            title: "Christ Connection: Father Offering Son", 
            description: "Connect Genesis 22 to John 3:16",
            detailedInstructions: "1. Read John 3:16 and Romans 8:32\n2. Create a comparison chart:\n   - Abraham offered Isaac / God offered Jesus\n   - Isaac was spared / Jesus was not spared\n   - A ram died instead of Isaac / Jesus died instead of us\n   - Moriah became the site of the temple / Golgotha (near Moriah)\n3. Add this chart to your Genesis 22 study\n4. This is the Concentration Room in action!",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "CR", 
            icon: "✝️"
          },
          { 
            id: "v1-w2-a20", 
            title: "Growth Journal: Week 2 Reflection", 
            description: "Reflect on your imagination journey",
            detailedInstructions: "1. Go to Growth Journal\n2. New entry: 'Week 2 - Imagination Room Reflection'\n3. Answer:\n   - How is the Imagination Room different from Story Room?\n   - What scene from Genesis 22 is most vivid in my memory?\n   - How does stepping INTO the story change my understanding?\n   - What challenged me this week?\n4. Set goal for Week 3",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w2-a21", 
            title: "Milestone Check: Walk Through Genesis 22", 
            description: "Demonstrate you can mentally walk through the story",
            detailedInstructions: "1. Close all apps/Bibles\n2. Mentally walk through Genesis 22 start to finish\n3. Engage all senses at each point\n4. Can you 'feel' the weight of the wood?\n5. Can you 'hear' Isaac's question?\n6. Can you 'see' the ram in the thicket?\n7. If yes, you've mastered Week 2!\n8. Check Achievements for any new unlocks",
            type: "reflection", 
            duration: "15 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can mentally 'walk through' Genesis 22 with full sensory detail",
      },
      {
        weekNumber: 3,
        title: "24 Frames Per Second",
        focus: "Creating symbolic image anchors for each chapter",
        scripture: "Genesis 1-24 (overview)",
        activities: [
          // READING & LEARNING
          { 
            id: "v1-w3-a1", 
            title: "24FPS Room Introduction", 
            description: "Learn the 24 Frames Per Second method",
            detailedInstructions: "1. Go to Palace > Floor 1 > 24FPS Room\n2. Read the complete method guide\n3. Key concept: ONE memorable image per chapter\n4. The image should be strange/vivid enough to trigger recall\n5. Example: Genesis 1 = birthday cake with 7 candles (7 days)\n6. These become your 'chapter hooks'",
            type: "reading", 
            duration: "15 min", 
            roomCode: "24F", 
            link: "/palace/floor/1/room/24fps", 
            icon: "🎬",
            lookFor: ["The 'strange is memorable' principle", "How to create symbolic images", "The linking technique"]
          },
          { 
            id: "v1-w3-a2", 
            title: "Read Genesis 1-6 Summaries", 
            description: "Quick read to identify key chapter themes",
            detailedInstructions: "1. Read Genesis 1 - Theme: Creation in 7 days\n2. Read Genesis 2 - Theme: Garden of Eden details\n3. Read Genesis 3 - Theme: The Fall\n4. Read Genesis 4 - Theme: Cain and Abel\n5. Read Genesis 5 - Theme: Genealogy to Noah\n6. Read Genesis 6 - Theme: Wickedness, Noah called\n7. For each, write a one-word summary",
            type: "reading", 
            duration: "30 min", 
            link: "/bible/Genesis/1", 
            icon: "📖"
          },
          { 
            id: "v1-w3-a3", 
            title: "Read Genesis 7-12 Summaries", 
            description: "Continue identifying chapter themes",
            detailedInstructions: "1. Genesis 7: Flood comes\n2. Genesis 8: Flood recedes, rainbow\n3. Genesis 9: Noah's covenant, Canaan cursed\n4. Genesis 10: Table of nations\n5. Genesis 11: Tower of Babel, Abraham's lineage\n6. Genesis 12: Abraham's call\n7. Write your one-word summary for each",
            type: "reading", 
            duration: "30 min", 
            link: "/bible/Genesis/7", 
            icon: "📖"
          },
          { 
            id: "v1-w3-a4", 
            title: "Read Genesis 13-18 Summaries", 
            description: "Abraham's journey chapters",
            detailedInstructions: "1. Genesis 13: Lot separates\n2. Genesis 14: Lot rescued, Melchizedek\n3. Genesis 15: Covenant of stars\n4. Genesis 16: Hagar and Ishmael\n5. Genesis 17: Circumcision covenant\n6. Genesis 18: Three visitors, Sodom announced\n7. Create one-word summaries",
            type: "reading", 
            duration: "30 min", 
            link: "/bible/Genesis/13", 
            icon: "📖"
          },
          { 
            id: "v1-w3-a5", 
            title: "Read Genesis 19-24 Summaries", 
            description: "Complete the first 24 chapters",
            detailedInstructions: "1. Genesis 19: Sodom destroyed\n2. Genesis 20: Abraham lies again\n3. Genesis 21: Isaac born, Hagar sent away\n4. Genesis 22: Abraham's test (you know this one!)\n5. Genesis 23: Sarah dies, burial cave\n6. Genesis 24: Rebekah found for Isaac\n7. Complete your 24 one-word summaries",
            type: "reading", 
            duration: "30 min", 
            link: "/bible/Genesis/19", 
            icon: "📖"
          },
          { 
            id: "v1-w3-a6", 
            title: "Encyclopedia: Patriarchs Article", 
            description: "Study the Patriarchs for context",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Patriarchs' or 'Abraham'\n3. Read about the patriarchal period\n4. Note the timeline: Abraham → Isaac → Jacob\n5. Find visual hooks mentioned in the article\n6. Add insights to your study",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📖"
          },
          { 
            id: "v1-w3-a7", 
            title: "Video Training: 24FPS Method", 
            description: "Watch demonstration of chapter-image creation",
            detailedInstructions: "1. Go to Video Training\n2. Find '24FPS' or 'Bible Rendered' videos\n3. Watch how the instructor creates chapter images\n4. Note their technique for making images memorable\n5. Practice along with one example",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },

          // DRILLS & PRACTICE
          { 
            id: "v1-w3-a8", 
            title: "Create 24 Frame Images", 
            description: "Build your Genesis 1-24 image set",
            detailedInstructions: "Here are 24 suggested images (adapt as needed):\n1. Birthday cake (7 candles) - Creation\n2. Garden gate - Eden\n3. Snake wrapped around apple - Fall\n4. Bloody rock - Cain/Abel\n5. Family tree chart - Genealogy\n6. Evil smiley face - Wickedness\n7. Boat in storm - Flood comes\n8. Rainbow dove - Flood ends\n9. Wine glass - Noah drunk\n10. World map - Nations spread\n11. Crumbling tower - Babel\n12. Suitcase - Abraham leaves\n13. Fork in road - Lot separates\n14. Sword and bread/wine - War/Melchizedek\n15. Star field - Covenant\n16. Baby bottle (rejected) - Hagar\n17. Circumcision knife - Covenant sign\n18. 3 men dining - Visitors\n19. Fire and brimstone - Sodom\n20. King's crown - Abimelech\n21. Laughing baby - Isaac born\n22. Knife over altar - The Test\n23. Tombstone - Sarah dies\n24. Camel caravan - Bride found",
            type: "drill", 
            duration: "40 min", 
            icon: "🖼️"
          },
          { 
            id: "v1-w3-a9", 
            title: "Daily Challenge: Genesis Theme", 
            description: "Apply your 24FPS knowledge to today's challenge",
            detailedInstructions: "1. Go to Daily Challenges\n2. Complete today's challenge\n3. Use your chapter images in your answers\n4. Reference specific chapters by their image\n5. Review feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🎯"
          },
          { 
            id: "v1-w3-a10", 
            title: "Flashcards: 24 Chapter Images", 
            description: "Create flashcards for your 24 images",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Genesis 1-24 Frames'\n3. Create 24 cards:\n   - Front: 'Genesis 1' → Back: '[Your image] - Creation'\n   - Front: 'Genesis 2' → Back: '[Your image] - Garden'\n   - Continue for all 24\n4. Shuffle and practice\n5. Can you recall all 24?",
            type: "drill", 
            duration: "30 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "v1-w3-a11", 
            title: "Speed Recall Drill", 
            description: "Practice rapid-fire chapter recall",
            detailedInstructions: "1. Set a timer for 2 minutes\n2. Go through Genesis 1-24 as fast as possible\n3. Say: 'Genesis 1 - [image] - Creation' for each\n4. How far can you get in 2 minutes?\n5. Practice until you can do all 24 in under 3 minutes\n6. This builds automatic recall",
            type: "drill", 
            duration: "15 min", 
            icon: "⚡"
          },
          { 
            id: "v1-w3-a12", 
            title: "Verse Match: Chapter Recognition", 
            description: "Test if you can identify which chapter verses come from",
            detailedInstructions: "1. Go to Games > Verse Match\n2. Select Genesis\n3. Play focusing on chapters 1-24\n4. For each verse, recall your chapter image first\n5. Play until you score 90%+ in recognition",
            type: "drill", 
            duration: "15 min", 
            link: "/games", 
            icon: "🎮"
          },
          { 
            id: "v1-w3-a13", 
            title: "Training Drill: 24FPS Method", 
            description: "Complete the official 24FPS drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select '24FPS' or 'Bible Rendered' drill\n3. Complete all questions\n4. Focus on understanding WHY images work\n5. Score at least 80%",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w3-a14", 
            title: "Link Chain Exercise", 
            description: "Practice linking images in sequence",
            detailedInstructions: "1. Take your 24 images\n2. Create a mental 'story' that links them:\n   - 'The birthday cake fell into the garden gate, which was guarded by a snake...'\n3. This linking makes the sequence memorable\n4. Practice walking through your chain\n5. Can you go forward AND backward?",
            type: "drill", 
            duration: "20 min", 
            icon: "🔗"
          },

          // EXERCISES & APPLICATION
          { 
            id: "v1-w3-a15", 
            title: "Create Study: Genesis 1-24 Map", 
            description: "Build a comprehensive study of your 24 frames",
            detailedInstructions: "1. Go to My Study Room\n2. Create: 'Genesis 1-24: My Visual Map'\n3. Add 24 sections (one per chapter)\n4. In each section, include:\n   - Your image\n   - Chapter theme\n   - Key verse\n   - One Christ connection (if applicable)\n5. This becomes your reference guide",
            type: "exercise", 
            duration: "35 min", 
            link: "/my-study-room", 
            icon: "📝"
          },
          { 
            id: "v1-w3-a16", 
            title: "Gems: Chapter Insights", 
            description: "Add gems discovered while creating frames",
            detailedInstructions: "1. Go to Gems Room\n2. As you worked on 24 chapters, you probably discovered insights\n3. Add 3-5 new gems\n4. Example gems:\n   - Genesis 14: Melchizedek = priest before Levites = Christ's priesthood\n   - Genesis 15: Stars = countless descendants = fulfilled in Christ\n   - Genesis 18: 'Shall anything be too hard for the LORD?' - faith anchor",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w3-a17", 
            title: "Draw Your Frame Chart", 
            description: "Create a visual chart of your 24 images",
            detailedInstructions: "1. On paper or digitally, create a 6x4 grid\n2. In each cell, draw or write your image for each chapter\n3. Number them 1-24\n4. Use this as a study aid\n5. Take a photo and add to your study\n6. Post on your wall for daily review",
            type: "exercise", 
            duration: "25 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w3-a18", 
            title: "Community Share: Your Best Frames", 
            description: "Share your most creative chapter images",
            detailedInstructions: "1. Go to Community\n2. Create post: 'My Genesis 24 Frames - Share Yours!'\n3. Share your 3 most creative/memorable images\n4. Explain why they work for you\n5. Ask others to share their images\n6. Comment on at least 3 others' posts\n7. You might adopt a better image!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w3-a19", 
            title: "Bible Rendered Room Preview", 
            description: "See how 24FPS expands to whole books",
            detailedInstructions: "1. Go to Palace > Floor 1 > Bible Rendered Room\n2. See how the Bible can be 'rendered' in 51 images (24 chapters each)\n3. Genesis 1-24 is just one 'frame' in the bigger picture\n4. Preview how the whole Bible can be mapped\n5. Get excited for future months!",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "BR", 
            link: "/palace/floor/1/room/br", 
            icon: "🎞️"
          },
          { 
            id: "v1-w3-a20", 
            title: "Growth Journal: 24FPS Reflection", 
            description: "Reflect on learning the 24FPS method",
            detailedInstructions: "1. Go to Growth Journal\n2. New entry: 'Week 3 - 24 Frames Reflection'\n3. Answer:\n   - What is the 24FPS method?\n   - Which images came easiest? Hardest?\n   - Can I flip through Genesis 1-24 mentally?\n   - How will I use this for other books?\n4. List your 24 images for reference\n5. Set Week 4 goals",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w3-a21", 
            title: "Milestone Test: Flip Through Genesis", 
            description: "Demonstrate you can mentally flip through Genesis 1-24",
            detailedInstructions: "1. Set a timer for 3 minutes\n2. Close your eyes\n3. Mentally 'flip' through your 24 images\n4. For each, recall: Image → Chapter content → Key event\n5. Can you do all 24 in under 3 minutes?\n6. If yes, you've mastered Week 3!\n7. Check Achievements for new unlocks",
            type: "reflection", 
            duration: "15 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can mentally 'flip through' Genesis 1-24 using your 24 frames",
      },
      {
        weekNumber: 4,
        title: "Translation & Gems",
        focus: "Converting verses into images and collecting insights",
        scripture: "Psalm 23",
        activities: [
          // READING & LEARNING
          { 
            id: "v1-w4-a1", 
            title: "Translation Room Introduction", 
            description: "Learn to convert abstract words into concrete images",
            detailedInstructions: "1. Go to Palace > Floor 1 > Translation Room\n2. Read the complete method guide\n3. Key concept: Every abstract word has a concrete image equivalent\n4. Example: 'Grace' → Rain falling on undeserving ground\n5. Example: 'Faith' → Bridge over a chasm you can't see the bottom of\n6. This 'translates' theology into pictures",
            type: "reading", 
            duration: "15 min", 
            roomCode: "TR", 
            link: "/palace/floor/1/room/tr", 
            icon: "📚",
            lookFor: ["Abstract to concrete conversion", "Personal vs universal images", "How to test if an image 'works'"]
          },
          { 
            id: "v1-w4-a2", 
            title: "Read Psalm 23 Deeply", 
            description: "Read the Shepherd Psalm with translation lens",
            detailedInstructions: "1. Read Psalm 23 in the Bible tab\n2. Read it 3 times:\n   - First time: just read\n   - Second time: underline abstract words (shepherd, want, righteousness, evil)\n   - Third time: for each abstract word, write a concrete image\n3. Note: This psalm is already highly visual - David was a master translator!",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Psalms/23", 
            icon: "📖",
            specificVerse: "Psalm 23:1-6",
            lookFor: ["The 6 verses = 6 scenes", "Movement from pasture to table to future", "The shift from 'He' to 'You' in verse 4"]
          },
          { 
            id: "v1-w4-a3", 
            title: "Gems Room Deep Dive", 
            description: "Master the art of gem collection",
            detailedInstructions: "1. Go to Palace > Floor 1 > Gems Room\n2. Read the complete guide on identifying gems\n3. A gem is: A striking insight that sparkles with meaning\n4. Gems can be:\n   - Word connections (same Greek word in two passages)\n   - Number patterns (40 days appears many times)\n   - Type/antitype matches (Bronze serpent = Christ lifted up)\n5. You're building a treasure chest of insights",
            type: "reading", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w4-a4", 
            title: "Encyclopedia: Shepherd Article", 
            description: "Study the Shepherd motif in Scripture",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Shepherd' or 'Good Shepherd'\n3. Read the full article\n4. Note:\n   - OT shepherd references (David, God as shepherd)\n   - NT fulfillment (John 10: 'I am the Good Shepherd')\n   - Christ connections\n5. Add insights to your Psalm 23 study",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📖",
            lookFor: ["Psalm 23 as messianic", "The shepherd's tools (rod and staff)", "Shepherd's responsibility"]
          },
          { 
            id: "v1-w4-a5", 
            title: "Read John 10:1-18", 
            description: "Connect Psalm 23 to Jesus's teaching",
            detailedInstructions: "1. Read John 10:1-18 in the Bible tab\n2. Note Jesus's claims:\n   - 'I am the door' (v7, 9)\n   - 'I am the good shepherd' (v11, 14)\n   - 'I lay down my life' (v11)\n3. Map back to Psalm 23:\n   - 'The LORD is my shepherd' = Jesus is claiming this role\n4. This is powerful Christological connection",
            type: "reading", 
            duration: "15 min", 
            link: "/bible/John/10", 
            icon: "📖",
            specificVerse: "John 10:1-18"
          },
          { 
            id: "v1-w4-a6", 
            title: "Video Training: Translation Technique", 
            description: "Watch demonstration of word-to-image translation",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Translation Room' videos\n3. Watch how instructors convert abstract concepts\n4. Practice along with examples\n5. Note techniques you'll use",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "v1-w4-a7", 
            title: "Month 1 Review Reading", 
            description: "Review all Floor 1 rooms before assessment",
            detailedInstructions: "1. Quick review of each Floor 1 room:\n   - Story Room: capturing narratives\n   - Imagination Room: stepping inside stories\n   - 24FPS: chapter image anchors\n   - Translation Room: abstract to concrete\n   - Gems Room: collecting insights\n2. Note any concepts you need to review\n3. This prepares you for the Gate Assessment",
            type: "reading", 
            duration: "20 min", 
            link: "/palace/floor/1", 
            icon: "📚"
          },

          // DRILLS & PRACTICE
          { 
            id: "v1-w4-a8", 
            title: "Translate Psalm 23 Verse by Verse", 
            description: "Create one image per verse",
            detailedInstructions: "Create 6 images:\n1. V1: 'The LORD is my shepherd' → Picture Jesus literally leading you as a sheep\n2. V2: 'Green pastures, still waters' → Lush meadow, crystal clear stream\n3. V3: 'Restores my soul, paths of righteousness' → Being picked up when fallen, walking a lit path\n4. V4: 'Valley of shadow' → Dark canyon, but with Shepherd's rod as weapon, staff as support\n5. V5: 'Table, enemies, oil, cup' → Banquet with defeated foes watching, oil dripping, cup overflowing\n6. V6: 'Goodness, mercy, house' → Two guardian angels following, heaven's door open",
            type: "drill", 
            duration: "25 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w4-a9", 
            title: "Daily Challenge: Psalm 23 Theme", 
            description: "Complete today's challenge using Psalm 23 connections",
            detailedInstructions: "1. Go to Daily Challenges\n2. Complete today's challenge\n3. Reference Psalm 23 where applicable\n4. Use your translated images in answers\n5. Review feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🎯"
          },
          { 
            id: "v1-w4-a10", 
            title: "Card Deck: Psalm 23 Study", 
            description: "Explore Psalm 23 with the Card Deck",
            detailedInstructions: "1. Go to Card Deck\n2. Enter Psalm 23:1 as your verse\n3. Draw 5 cards\n4. Apply each principle to the psalm\n5. Write insights for each card\n6. Save your study",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "v1-w4-a11", 
            title: "Flashcards: Psalm 23 Images", 
            description: "Create flashcards for your 6 verse images",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Psalm 23 Translated'\n3. Create 6 cards:\n   - Front: 'Psalm 23:1' → Back: '[Your image] - The LORD is my shepherd'\n   - Continue for all 6 verses\n4. Study until you can recall all 6 instantly\n5. Test both directions (verse → image AND image → verse)",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "v1-w4-a12", 
            title: "Training Drill: Translation Room", 
            description: "Complete the official Translation Room drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Translation Room' drill\n3. Complete all questions\n4. Focus on understanding the abstract-to-concrete principle\n5. Score at least 80%",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w4-a13", 
            title: "Gems Room Drill", 
            description: "Complete the Gems Room training drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Gems Room' drill\n3. Answer questions about identifying gems\n4. Practice distinguishing gems from ordinary observations\n5. Score at least 80%",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "v1-w4-a14", 
            title: "Month 1 Comprehensive Drill", 
            description: "Review all Floor 1 concepts",
            detailedInstructions: "1. Go to Training Drills\n2. Select any 'Floor 1' comprehensive drill\n3. This covers: Story, Imagination, 24FPS, Translation, Gems\n4. Complete all questions\n5. Review any missed concepts\n6. Score at least 75% to be ready for Gate Assessment",
            type: "drill", 
            duration: "20 min", 
            link: "/training-drills", 
            icon: "🏋️"
          },

          // EXERCISES & APPLICATION
          { 
            id: "v1-w4-a15", 
            title: "Create Study: Psalm 23 Complete", 
            description: "Build a comprehensive Psalm 23 study",
            detailedInstructions: "1. Go to My Study Room\n2. Create: 'Psalm 23: The Shepherd's Psalm'\n3. Add 6 sections (one per verse)\n4. In each section:\n   - The verse text\n   - Your translated image\n   - Cross-reference (especially to John 10)\n   - Personal application\n5. Add a final section: 'Christ Connections'\n6. This is your model for future psalm studies",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-study-room", 
            icon: "📝"
          },
          { 
            id: "v1-w4-a16", 
            title: "Month 1 Gem Collection", 
            description: "Review and organize all gems from Month 1",
            detailedInstructions: "1. Go to Gems Room\n2. Review all gems you've collected this month\n3. You should have at least 10-15 gems\n4. Organize them by source:\n   - Genesis gems\n   - Psalm 23 gems\n   - Other discoveries\n5. Add any final gems from this week\n6. This collection is your treasure",
            type: "exercise", 
            duration: "20 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "v1-w4-a17", 
            title: "Illustrate Psalm 23", 
            description: "Create a visual representation of Psalm 23",
            detailedInstructions: "1. Create a single image or comic strip of Psalm 23\n2. Show the journey: pasture → valley → table → house\n3. This can be simple stick figures or elaborate\n4. The act of drawing reinforces memory\n5. Take a photo and add to your study\n6. Consider sharing in Community",
            type: "exercise", 
            duration: "25 min", 
            icon: "🎨"
          },
          { 
            id: "v1-w4-a18", 
            title: "Community Share: Month 1 Highlights", 
            description: "Share your favorite discoveries from Month 1",
            detailedInstructions: "1. Go to Community\n2. Create post: 'Month 1 Highlights - Visual Path'\n3. Share:\n   - Your favorite room/technique\n   - Your best gem\n   - One thing that surprised you\n4. Include one image you created\n5. Comment on 3 other Month 1 posts\n6. Celebrate with your fellow visual learners!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "v1-w4-a19", 
            title: "Gate Assessment Preparation", 
            description: "Prepare your 5 visual anchors and Christ connection",
            detailedInstructions: "Gate Assessment requires: 5 visual anchors + 1 Christ connection\n\nPrepare:\n1. Visual anchor 1: Creation week image\n2. Visual anchor 2: Genesis 22 scene\n3. Visual anchor 3: One of your 24 frames\n4. Visual anchor 4: Psalm 23 verse image\n5. Visual anchor 5: Your choice from Month 1\n6. Christ connection: Pick one anchor and explain how it points to Jesus\n\nPractice presenting these aloud",
            type: "exercise", 
            duration: "25 min", 
            icon: "📋"
          },
          { 
            id: "v1-w4-a20", 
            title: "Growth Journal: Month 1 Reflection", 
            description: "Comprehensive month-end reflection",
            detailedInstructions: "1. Go to Growth Journal\n2. New entry: 'Month 1 Complete - Visual Path Reflection'\n3. Answer:\n   - What Floor 1 techniques have I mastered?\n   - Which rooms need more practice?\n   - What's my strongest visual anchor?\n   - What gems am I most excited about?\n   - How has visual study changed my Bible reading?\n4. Write your goals for Month 2\n5. Thank God for this month of growth",
            type: "reflection", 
            duration: "20 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "v1-w4-a21", 
            title: "Achievements & Gate Assessment", 
            description: "Review achievements and complete Gate Assessment",
            detailedInstructions: "1. Go to Achievements\n2. Review all achievements earned this month\n3. Check your Path progress\n4. When ready, complete the Month 1 Gate Assessment:\n   - Present your 5 visual anchors\n   - Explain how one connects to Christ\n5. Passing unlocks Month 2!\n6. Celebrate your completion of Month 1!",
            type: "reflection", 
            duration: "20 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Ready for Month 1 Gate Assessment",
      },
    ],
    gateAssessment: "Demonstrate your Floor 1 understanding with at least 5 visual anchors. Explain how one image connects to Christ.",
  },
  // Generate remaining months
  ...generateVisualPathMonths(2, 24),
];

// ============================================
// ANALYTICAL PATH - Complete 24-Month Curriculum
// ============================================
const analyticalPathCurriculum: MonthCurriculum[] = [
  {
    month: 1,
    title: "Detective Foundation",
    theme: "Building Your Investigation Skills",
    weeks: [
      {
        weekNumber: 1,
        title: "Observation Basics",
        focus: "Learning to see what others miss",
        scripture: "Luke 15:11-32 (Prodigal Son)",
        activities: [
          // READING & LEARNING (7 activities)
          { 
            id: "a1-w1-a1", 
            title: "Observation Room Introduction", 
            description: "Learn the detective's notebook method",
            detailedInstructions: "1. Go to Palace > Floor 2 > Observation Room\n2. Read the complete method guide\n3. Key principle: OBSERVE before you INTERPRET\n4. A good detective gathers all evidence before drawing conclusions\n5. Goal: Train yourself to see 50+ details in any passage",
            type: "reading", 
            duration: "15 min", 
            roomCode: "OR", 
            link: "/palace/floor/2/room/or", 
            icon: "🔍",
            lookFor: ["The '50 observations before interpretation' rule", "Types of observations: Who, What, When, Where, How", "Distinguishing observation from interpretation"]
          },
          { 
            id: "a1-w1-a2", 
            title: "Read Luke 15:11-32 First Time", 
            description: "Read the Prodigal Son without analysis",
            detailedInstructions: "1. Read Luke 15:11-32 in the Bible tab\n2. First reading: just absorb the story\n3. Don't analyze yet - just read\n4. Note your initial emotional response\n5. What character do you identify with?",
            type: "reading", 
            duration: "15 min", 
            link: "/bible/Luke/15", 
            icon: "📖",
            specificVerse: "Luke 15:11-32"
          },
          { 
            id: "a1-w1-a3", 
            title: "Read Luke 15:11-32 Second Time", 
            description: "Read with observation lens",
            detailedInstructions: "1. Read Luke 15:11-32 again\n2. This time, mark/note every detail\n3. Characters: Who is mentioned?\n4. Actions: What do they do?\n5. Settings: Where does it happen?\n6. Emotions: What feelings are shown?\n7. Don't interpret yet - just log observations",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Luke/15", 
            icon: "📖"
          },
          { 
            id: "a1-w1-a4", 
            title: "Read Luke 15:11-32 Third Time", 
            description: "Read focusing on dialogue",
            detailedInstructions: "1. Read Luke 15:11-32 a third time\n2. Focus only on dialogue:\n   - What does the younger son say? (v12, 18-19, 21)\n   - What does the father say? (v22-24, 31-32)\n   - What does the older son say? (v29-30)\n3. Log each statement as an observation\n4. Note: who speaks most? who speaks least?",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Luke/15", 
            icon: "📖"
          },
          { 
            id: "a1-w1-a5", 
            title: "Encyclopedia: Parables Article", 
            description: "Study how parables work",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Parables'\n3. Read about:\n   - What is a parable?\n   - How did Jesus use parables?\n   - Common parable patterns\n4. Note how the Prodigal Son fits the parable structure\n5. This context enriches your observations",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📖",
            lookFor: ["One main point vs allegory", "Cultural context importance", "Kingdom teaching through story"]
          },
          { 
            id: "a1-w1-a6", 
            title: "Video Training: Observation Skills", 
            description: "Watch demonstration of observation method",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Observation Room' or 'Floor 2' videos\n3. Watch the instructor demonstrate observations\n4. Note their technique for systematic observation\n5. Practice along with an example",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "a1-w1-a7", 
            title: "Daily Verse with Observation", 
            description: "Apply observation to today's Daily Verse",
            detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. List 10 observations from just this one verse\n4. Categories: words used, grammar, context clues\n5. Record in Growth Journal",
            type: "reading", 
            duration: "15 min", 
            link: "/daily-verse", 
            icon: "✨"
          },

          // DRILLS & PRACTICE (7 activities)
          { 
            id: "a1-w1-a8", 
            title: "50 Observations Exercise", 
            description: "Generate 50 observations from Luke 15:11-32",
            detailedInstructions: "1. Open Luke 15:11-32\n2. Write 50 observations (no interpretation!)\n3. Examples to get started:\n   - 'There are 3 characters' (observation)\n   - 'The younger son asks for inheritance' (observation)\n   - NOT: 'The younger son was greedy' (interpretation)\n4. Push past 30 - the best insights come 30-50\n5. This is THE core analytical skill",
            type: "drill", 
            duration: "35 min", 
            icon: "📝"
          },
          { 
            id: "a1-w1-a9", 
            title: "Observation Room Training Drill", 
            description: "Complete the official Observation Room drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select 'Observation Room' drill\n3. Answer all questions about the method\n4. Focus on: What is observation vs interpretation?\n5. Score at least 80%",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "a1-w1-a10", 
            title: "Daily Challenge: Analytical Focus", 
            description: "Complete today's challenge with observation emphasis",
            detailedInstructions: "1. Go to Daily Challenges\n2. Complete today's challenge\n3. In your answers, distinguish between observation and interpretation\n4. Use phrases like: 'I observe that...' vs 'This means...'\n5. Review AI feedback",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🎯"
          },
          { 
            id: "a1-w1-a11", 
            title: "Card Deck: Luke 15 Study", 
            description: "Use Card Deck to explore the parable systematically",
            detailedInstructions: "1. Go to Card Deck\n2. Enter Luke 15:20 as your verse\n3. Draw 4 cards\n4. For each card, generate 5 observations related to that principle\n5. This combines observation with PT methodology\n6. Save your study",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "a1-w1-a12", 
            title: "Pattern Hunt Drill", 
            description: "Find patterns in Luke 15:11-32",
            detailedInstructions: "Find and record these patterns:\n1. Repeated words (what words appear multiple times?)\n2. Contrasts (younger vs older, far vs near, lost vs found)\n3. Progression (what sequence of events?)\n4. Chiasm (is there a parallel structure?)\n5. Record at least 5 patterns",
            type: "drill", 
            duration: "20 min", 
            icon: "🧩"
          },
          { 
            id: "a1-w1-a13", 
            title: "Flashcards: Observation vs Interpretation", 
            description: "Create flashcards to reinforce the distinction",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Observation vs Interpretation'\n3. Create 10 cards with statements, sorting them:\n   - 'The father ran' → Observation\n   - 'The father was excited' → Interpretation\n   - 'The son was in a far country' → Observation\n   - 'The son rebelled' → Interpretation\n4. Quiz yourself on the distinction",
            type: "drill", 
            duration: "20 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "a1-w1-a14", 
            title: "Question Generation Drill", 
            description: "Generate 20 questions from your observations",
            detailedInstructions: "From your 50 observations, generate 20 questions:\n1. Why questions: 'Why did the father run?'\n2. What questions: 'What does the ring symbolize?'\n3. How questions: 'How did the son end up with pigs?'\n4. Comparison questions: 'How are the two sons different?'\n5. These questions lead to interpretation - the next step",
            type: "drill", 
            duration: "20 min", 
            icon: "❓"
          },

          // EXERCISES & APPLICATION (7 activities)
          { 
            id: "a1-w1-a15", 
            title: "Create Study: Luke 15 Observation File", 
            description: "Build a comprehensive observation study",
            detailedInstructions: "1. Go to My Study Room\n2. Create: 'Luke 15:11-32 - Observation File'\n3. Add sections:\n   - Character Observations\n   - Action Observations\n   - Setting Observations\n   - Dialogue Observations\n   - Pattern Observations\n4. Include your 50+ observations\n5. Add your 20 questions for future study",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-study-room", 
            icon: "📝"
          },
          { 
            id: "a1-w1-a16", 
            title: "Gems: Observation Discoveries", 
            description: "Record gems you discovered through careful observation",
            detailedInstructions: "1. Go to Gems Room\n2. Through careful observation, you likely found striking details\n3. Add 3 gems. Examples:\n   - Gem: The father saw him 'while he was still far off' - he was watching!\n   - Gem: The son prepared a speech but the father interrupted\n   - Gem: The older son was 'in the field' - working, not relating\n4. These are insights from observation, not imposed interpretation",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "a1-w1-a17", 
            title: "Create Observation Chart", 
            description: "Organize observations visually",
            detailedInstructions: "1. Create a chart/spreadsheet with columns:\n   - Verse #\n   - Who (characters)\n   - What (actions)\n   - Where (locations)\n   - Quote (dialogue)\n2. Fill in for each verse of Luke 15:11-32\n3. This systematic approach catches everything\n4. Add to your study in My Study Room",
            type: "exercise", 
            duration: "25 min", 
            icon: "📊"
          },
          { 
            id: "a1-w1-a18", 
            title: "Community Share: Observation Exercise", 
            description: "Share your best observation from Luke 15",
            detailedInstructions: "1. Go to Community\n2. Create post: 'Observation Challenge - Luke 15'\n3. Share your most surprising observation\n4. Ask: 'What did you observe that I might have missed?'\n5. Comment on 3 other analytical path posts\n6. Iron sharpens iron!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "a1-w1-a19", 
            title: "Context Research", 
            description: "Research historical context for Luke 15",
            detailedInstructions: "1. Use Encyclopedia to research:\n   - Jewish inheritance customs\n   - What pig-herding meant to Jews\n   - The significance of a robe, ring, and sandals\n   - The older brother's role in Jewish culture\n2. Add historical context to your observation file\n3. Context turns observations into deeper understanding",
            type: "exercise", 
            duration: "20 min", 
            link: "/encyclopedia", 
            icon: "📜"
          },
          { 
            id: "a1-w1-a20", 
            title: "Growth Journal: Week 1 Reflection", 
            description: "Reflect on learning observation skills",
            detailedInstructions: "1. Go to Growth Journal\n2. New entry: 'Week 1 - Observation Room Reflection'\n3. Answer:\n   - What is the difference between observation and interpretation?\n   - Why observe before interpreting?\n   - What did I discover in Luke 15 through careful observation?\n   - How will I apply this to future study?\n4. Set goals for Week 2",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "a1-w1-a21", 
            title: "Milestone Check: 50 Observations", 
            description: "Verify you can generate 50+ observations from any passage",
            detailedInstructions: "1. Pick a NEW short passage (suggestion: Mark 4:35-41)\n2. Set a timer for 20 minutes\n3. Generate 50 observations\n4. If you can do this, you've mastered Week 1!\n5. Check Achievements for any new unlocks\n6. Prepare for Week 2: Definitions & Context",
            type: "reflection", 
            duration: "25 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can generate 50+ observations from any passage",
      },
      // Weeks 2-4 with 21 activities each...
      ...generateAnalyticalWeeks2to4(),
    ],
    gateAssessment: "Present 50 observations from a passage, categorized by type, and demonstrate the observation-to-interpretation bridge.",
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
    theme: "Building Your Devotional Life",
    weeks: [
      {
        weekNumber: 1,
        title: "The Fire Room",
        focus: "Encountering God's presence in Scripture",
        scripture: "Psalm 63",
        activities: [
          // READING & LEARNING (7 activities)
          { 
            id: "d1-w1-a1", 
            title: "Fire Room Introduction", 
            description: "Learn to encounter God emotionally in Scripture",
            detailedInstructions: "1. Go to Palace > Floor 7 > Fire Room\n2. Read the complete room guide\n3. Key concept: Scripture is meant to burn in your heart, not just inform your mind\n4. The Fire Room is where truth becomes personal encounter\n5. Ask: When did Scripture last move you to tears, joy, or action?",
            type: "reading", 
            duration: "15 min", 
            roomCode: "FRm", 
            link: "/palace/floor/7/room/frm", 
            icon: "🔥",
            lookFor: ["Emotional engagement with Scripture", "The difference between study and encounter", "How to create space for the Spirit"]
          },
          { 
            id: "d1-w1-a2", 
            title: "Read Psalm 63 Slowly", 
            description: "Read David's longing for God",
            detailedInstructions: "1. Read Psalm 63 in the Bible tab\n2. Read it VERY slowly - one verse per minute\n3. After each verse, pause and pray: 'Lord, what are you saying to me?'\n4. Don't rush - devotional reading is slow reading\n5. Note which verses stir your heart most",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Psalms/63", 
            icon: "📖",
            specificVerse: "Psalm 63:1-11",
            lookFor: ["David's thirst for God (v1)", "Satisfaction language (v5)", "Meditation practice (v6)", "God as protection (v7-8)"]
          },
          { 
            id: "d1-w1-a3", 
            title: "Context: David in the Wilderness", 
            description: "Understand when David wrote this psalm",
            detailedInstructions: "1. Read the title: 'A Psalm of David, when he was in the wilderness of Judah'\n2. This was written during David's flight from Absalom (2 Samuel 15-18)\n3. David was betrayed by his own son\n4. Yet in this pain, he thirsted for GOD, not revenge\n5. How does this context deepen the psalm's meaning?",
            type: "reading", 
            duration: "15 min", 
            link: "/bible/2%20Samuel/15", 
            icon: "📖"
          },
          { 
            id: "d1-w1-a4", 
            title: "Devotionals Feature Exploration", 
            description: "Explore the Devotionals tab for devotional resources",
            detailedInstructions: "1. Go to the Devotionals tab\n2. Browse available devotional plans\n3. See how PT devotionals combine Scripture with reflection\n4. Note the structure: Scripture → Reflection → Application → Prayer\n5. Consider enrolling in a devotional plan",
            type: "reading", 
            duration: "15 min", 
            link: "/devotionals", 
            icon: "🙏"
          },
          { 
            id: "d1-w1-a5", 
            title: "Encyclopedia: Worship Article", 
            description: "Study the concept of worship in Scripture",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Worship' or 'Praise'\n3. Read about:\n   - Hebrew words for worship\n   - Heart posture vs external ritual\n   - Worship in the Psalms\n4. Connect to Psalm 63's passionate worship\n5. Note insights for your devotional journey",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📖",
            lookFor: ["'Shachah' = to bow down", "Worship as lifestyle", "Sacrifice and worship connection"]
          },
          { 
            id: "d1-w1-a6", 
            title: "Video Training: Devotional Reading", 
            description: "Watch training on devotional Scripture engagement",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Fire Room' or 'Devotional' videos\n3. Watch demonstration of devotional reading\n4. Note how it differs from analytical study\n5. The goal is encounter, not just information",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "d1-w1-a7", 
            title: "Daily Verse Devotional Practice", 
            description: "Apply devotional reading to today's Daily Verse",
            detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse slowly 5 times\n3. After each reading, sit in silence for 30 seconds\n4. Ask: 'What word or phrase stands out?'\n5. Pray that word/phrase back to God\n6. Journal what you experienced",
            type: "reading", 
            duration: "15 min", 
            link: "/daily-verse", 
            icon: "✨"
          },

          // DRILLS & PRACTICE (7 activities)
          { 
            id: "d1-w1-a8", 
            title: "Lectio Divina with Psalm 63:1", 
            description: "Practice ancient devotional reading method",
            detailedInstructions: "Lectio Divina (Divine Reading) with Psalm 63:1:\n'O God, You are my God; early will I seek You; my soul thirsts for You; my flesh longs for You in a dry and thirsty land where there is no water.'\n\n1. Lectio (Read): Read slowly 4 times\n2. Meditatio (Meditate): What word stands out?\n3. Oratio (Pray): Speak to God about that word\n4. Contemplatio (Contemplate): Sit in silence, receive\n5. Take 15 minutes for all 4 movements",
            type: "drill", 
            duration: "20 min", 
            icon: "🙏"
          },
          { 
            id: "d1-w1-a9", 
            title: "Daily Challenge: Devotional Response", 
            description: "Complete today's challenge with heart focus",
            detailedInstructions: "1. Go to Daily Challenges\n2. Complete today's challenge\n3. In your answers, share personal application\n4. Use 'I' statements: 'I feel...', 'God showed me...'\n5. Review feedback with openness",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🎯"
          },
          { 
            id: "d1-w1-a10", 
            title: "Card Deck: Psalm 63 Heart Study", 
            description: "Use Card Deck for devotional exploration",
            detailedInstructions: "1. Go to Card Deck\n2. Enter Psalm 63:3 as your verse: 'Your lovingkindness is better than life'\n3. Draw 3 cards\n4. For each card, write a prayer response\n5. This combines PT method with devotion\n6. Save your study with prayers included",
            type: "drill", 
            duration: "20 min", 
            link: "/card-deck", 
            icon: "🃏"
          },
          { 
            id: "d1-w1-a11", 
            title: "Scripture Memory: Psalm 63:1", 
            description: "Memorize the opening verse",
            detailedInstructions: "Memorize Psalm 63:1:\n'O God, You are my God; early will I seek You; my soul thirsts for You; my flesh longs for You in a dry and thirsty land where there is no water.'\n\n1. Read it 10 times aloud\n2. Write it out 3 times\n3. Say it with eyes closed\n4. Pray it as your own prayer\n5. Memorized Scripture feeds devotion",
            type: "drill", 
            duration: "15 min", 
            icon: "📜"
          },
          { 
            id: "d1-w1-a12", 
            title: "Flashcards: Psalm 63 Key Verses", 
            description: "Create devotional flashcards",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Psalm 63 Devotional'\n3. Create cards not for knowledge but for meditation:\n   - Front: 'What satisfies the soul?' → Back: 'Psalm 63:5 - God's presence'\n   - Front: 'When to meditate?' → Back: 'Psalm 63:6 - Night watches'\n   - Front: 'What is better than life?' → Back: 'Psalm 63:3 - God's lovingkindness'\n4. Use these for prayer prompts",
            type: "drill", 
            duration: "15 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "d1-w1-a13", 
            title: "Silent Meditation Practice", 
            description: "Practice sitting in silence with Psalm 63",
            detailedInstructions: "1. Find a quiet place\n2. Read Psalm 63:1-3\n3. Set a timer for 5 minutes\n4. Sit in complete silence\n5. When thoughts wander, gently return to 'You are my God'\n6. Don't expect fireworks - faithfulness matters\n7. Journal what you experienced after",
            type: "drill", 
            duration: "10 min", 
            icon: "🤫"
          },
          { 
            id: "d1-w1-a14", 
            title: "Written Prayer Exercise", 
            description: "Write a prayer based on Psalm 63",
            detailedInstructions: "1. In Growth Journal, write a prayer\n2. Use Psalm 63 as your template\n3. Personalize each verse:\n   - 'O God, You are MY God...'\n   - 'My soul thirsts for YOU...'\n   - 'YOUR lovingkindness is better than MY life...'\n4. This is praying Scripture - powerful practice!\n5. You can pray this prayer daily",
            type: "drill", 
            duration: "20 min", 
            icon: "✍️"
          },

          // EXERCISES & APPLICATION (7 activities)
          { 
            id: "d1-w1-a15", 
            title: "Create Study: Psalm 63 Devotional Journey", 
            description: "Build a devotional study in My Study Room",
            detailedInstructions: "1. Go to My Study Room\n2. Create: 'Psalm 63: My Thirst for God'\n3. Add sections:\n   - Context: David in the wilderness\n   - Verse-by-verse meditation notes\n   - My prayer response\n   - Personal application\n4. This is a devotional study, not analytical\n5. Focus on what God is saying to YOU",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-study-room", 
            icon: "📝"
          },
          { 
            id: "d1-w1-a16", 
            title: "Gems: Heart Treasures", 
            description: "Record gems that stirred your heart",
            detailedInstructions: "1. Go to Gems Room\n2. Add 'heart gems' - not just intellectual insights but things that moved you:\n   - Gem: 'Early will I seek You' - making God the FIRST priority\n   - Gem: 'My soul follows hard after You' - active pursuit, not passive waiting\n   - Gem: 'Your right hand upholds me' - He's holding ME\n3. These gems are personal treasures",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "d1-w1-a17", 
            title: "Morning Devotional Routine", 
            description: "Establish a morning devotional habit",
            detailedInstructions: "Create your morning routine:\n1. Wake up 15 minutes earlier\n2. Before phone/email, open Bible to Psalm 63\n3. Read one verse slowly\n4. Pray that verse\n5. Sit in silence for 2 minutes\n6. Journal one sentence\n7. Practice this for the next 7 days\n8. Track in Growth Journal",
            type: "exercise", 
            duration: "15 min daily", 
            icon: "🌅"
          },
          { 
            id: "d1-w1-a18", 
            title: "Community Share: Devotional Experience", 
            description: "Share your encounter with Psalm 63",
            detailedInstructions: "1. Go to Community\n2. Create post: 'Psalm 63 Devotional Journey'\n3. Share:\n   - Which verse spoke most to you?\n   - What did you experience in prayer/silence?\n   - How is this different from analytical study?\n4. Comment on 3 other devotional path posts\n5. Encourage one another!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "d1-w1-a19", 
            title: "Meditation Room Preview", 
            description: "Explore the Meditation Room for deeper practice",
            detailedInstructions: "1. Go to Palace > Floor 7 > Meditation Room\n2. Read about meditation methods\n3. Meditation Room differs from Fire Room:\n   - Fire Room = emotional encounter\n   - Meditation Room = slow, deep absorption\n4. Note techniques you'll use in Week 2\n5. Both are devotional, but different emphases",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "MR", 
            link: "/palace/floor/7/room/mr", 
            icon: "🧘"
          },
          { 
            id: "d1-w1-a20", 
            title: "Growth Journal: Week 1 Heart Reflection", 
            description: "Reflect on your devotional journey",
            detailedInstructions: "1. Go to Growth Journal\n2. New entry: 'Week 1 - Fire Room Reflection'\n3. Answer:\n   - What does it mean to 'thirst' for God?\n   - When did I most feel God's presence this week?\n   - How is devotional reading different from study?\n   - What habit do I want to build?\n4. Be honest about struggles too\n5. Set heart goals for Week 2",
            type: "reflection", 
            duration: "20 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "d1-w1-a21", 
            title: "Milestone Check: Heart Encounter", 
            description: "Confirm you've experienced devotional encounter",
            detailedInstructions: "Milestone: Did Scripture touch your heart this week?\n\n1. Review your week:\n   - Did you have a moment where a verse 'came alive'?\n   - Did you feel moved emotionally by Scripture?\n   - Did you pray Scripture as your own prayer?\n2. If yes, you've begun the devotional journey!\n3. Check Achievements\n4. Prepare for Week 2: Meditation Room",
            type: "reflection", 
            duration: "10 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Experience heart encounter with Scripture through Psalm 63",
      },
      // Weeks 2-4 with 21 activities each...
      ...generateDevotionalWeeks2to4(),
    ],
    gateAssessment: "Share your devotional journey through Psalm 63, including personal application and growth in prayer life.",
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
    title: "Basic Training",
    theme: "Memorizing Your Arsenal",
    weeks: [
      {
        weekNumber: 1,
        title: "The Memory Arsenal",
        focus: "Memorizing your first 10 combat verses",
        scripture: "Ephesians 6:10-17",
        activities: [
          // READING & LEARNING (7 activities)
          { 
            id: "w1-w1-a1", 
            title: "Warrior Introduction: The Armor", 
            description: "Learn the spiritual warfare framework",
            detailedInstructions: "1. Read Ephesians 6:10-17 in the Bible tab\n2. This is your combat manual\n3. List the 6 pieces of armor:\n   - Belt of Truth\n   - Breastplate of Righteousness\n   - Shoes of Gospel Preparation\n   - Shield of Faith\n   - Helmet of Salvation\n   - Sword of the Spirit (the Word of God)\n4. The sword is the only OFFENSIVE weapon - it's Scripture!",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Ephesians/6", 
            icon: "⚔️",
            specificVerse: "Ephesians 6:10-17",
            lookFor: ["Why we need armor (v12 - not flesh and blood)", "The sword = Word of God (v17)", "Each piece serves a purpose"]
          },
          { 
            id: "w1-w1-a2", 
            title: "Jesus's Sword in Action", 
            description: "Study Matthew 4:1-11 - Jesus fighting with Scripture",
            detailedInstructions: "1. Read Matthew 4:1-11\n2. Observe: Jesus was tempted 3 times\n3. Each time, He responded with 'It is written...'\n4. Note His 3 verses:\n   - 'Man shall not live by bread alone' (Deut 8:3)\n   - 'You shall not tempt the LORD your God' (Deut 6:16)\n   - 'You shall worship the LORD your God only' (Deut 6:13)\n5. Jesus MEMORIZED Scripture - He quoted from memory in battle!",
            type: "reading", 
            duration: "20 min", 
            link: "/bible/Matthew/4", 
            icon: "📖",
            specificVerse: "Matthew 4:1-11"
          },
          { 
            id: "w1-w1-a3", 
            title: "Your First Combat Verses List", 
            description: "Identify your 10 starter memory verses",
            detailedInstructions: "Your first 10 combat verses:\n1. Ephesians 6:10-11 (stand strong in armor)\n2. Romans 8:37 (more than conquerors)\n3. 2 Corinthians 10:4-5 (weapons not carnal)\n4. James 4:7 (resist the devil)\n5. 1 John 4:4 (greater is He)\n6. Philippians 4:13 (I can do all things)\n7. Joshua 1:9 (be strong and courageous)\n8. Isaiah 41:10 (fear not, I am with you)\n9. Psalm 91:1-2 (shelter of the Most High)\n10. Romans 8:28 (all things work together)\n\nWrite these in your Growth Journal",
            type: "reading", 
            duration: "15 min", 
            icon: "📜"
          },
          { 
            id: "w1-w1-a4", 
            title: "Encyclopedia: Spiritual Warfare", 
            description: "Study the biblical teaching on spiritual combat",
            detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Spiritual Warfare' or 'Satan'\n3. Read about:\n   - The reality of spiritual battle\n   - Our enemy's tactics\n   - Our weapons and authority in Christ\n4. This grounds your warrior training in theology\n5. Note key insights",
            type: "reading", 
            duration: "15 min", 
            link: "/encyclopedia", 
            icon: "📖",
            lookFor: ["Satan's names and tactics", "Christ's victory at the cross", "Believer's authority"]
          },
          { 
            id: "w1-w1-a5", 
            title: "Video Training: Memory Techniques", 
            description: "Watch training on Scripture memorization",
            detailedInstructions: "1. Go to Video Training\n2. Find 'Memory' or 'Warrior' videos\n3. Watch techniques for fast memorization\n4. Note methods like:\n   - First letter method\n   - Visualization\n   - Rhythm and music\n   - Repetition schedules\n5. You'll use these this week",
            type: "reading", 
            duration: "15 min", 
            link: "/video-training", 
            icon: "📺"
          },
          { 
            id: "w1-w1-a6", 
            title: "Daily Verse: Combat Application", 
            description: "Apply today's Daily Verse as a weapon",
            detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. Ask: 'What enemy does this verse defeat?'\n   - Fear? Doubt? Temptation? Discouragement?\n4. Practice saying: 'When [enemy] attacks, I declare [verse]'\n5. This is combat training!\n6. Journal your application",
            type: "reading", 
            duration: "15 min", 
            link: "/daily-verse", 
            icon: "✨"
          },
          { 
            id: "w1-w1-a7", 
            title: "Great Controversy Overview", 
            description: "Understand the cosmic battle context",
            detailedInstructions: "1. Go to Palace > Floor 4 > Theme Room\n2. Find the 'Great Controversy Wall'\n3. Understand the big picture:\n   - Satan rebelled in heaven\n   - Earth is the battlefield\n   - Christ won at the cross\n   - We fight a defeated enemy!\n4. This perspective changes everything\n5. Note how your verses fit this narrative",
            type: "reading", 
            duration: "15 min", 
            link: "/palace/floor/4/room/trm", 
            icon: "🌍"
          },

          // DRILLS & PRACTICE (7 activities)
          { 
            id: "w1-w1-a8", 
            title: "Memorize Verses 1-3", 
            description: "Intensive memorization of first three verses",
            detailedInstructions: "Today, memorize these 3 verses:\n\n1. Ephesians 6:10-11: 'Be strong in the Lord and in the power of His might. Put on the whole armor of God, that you may be able to stand against the wiles of the devil.'\n\n2. Romans 8:37: 'Yet in all these things we are more than conquerors through Him who loved us.'\n\n3. 2 Corinthians 10:4-5: 'For the weapons of our warfare are not carnal but mighty in God for pulling down strongholds.'\n\nMethod: Read 10x, write 3x, recite until perfect",
            type: "drill", 
            duration: "30 min", 
            icon: "📜"
          },
          { 
            id: "w1-w1-a9", 
            title: "Daily Challenge: Warrior Mode", 
            description: "Complete today's challenge with battle focus",
            detailedInstructions: "1. Go to Daily Challenges\n2. Complete today's challenge\n3. In your answers, quote Scripture from memory\n4. Use combat language: 'The Word says...', 'I stand on...'\n5. Review feedback\n6. Practice integrating memorized verses in responses",
            type: "drill", 
            duration: "15 min", 
            link: "/daily-challenges", 
            icon: "🎯"
          },
          { 
            id: "w1-w1-a10", 
            title: "Flashcards: Combat Verses", 
            description: "Create and drill memory flashcards",
            detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Combat Arsenal Week 1'\n3. Create 10 cards:\n   - Front: Reference (e.g., 'Ephesians 6:10-11')\n   - Back: Full verse text\n4. Drill until you can quote all 10 by reference\n5. This is your basic training!",
            type: "drill", 
            duration: "25 min", 
            link: "/flashcards", 
            icon: "📇"
          },
          { 
            id: "w1-w1-a11", 
            title: "Speed Recall Drill", 
            description: "Practice rapid-fire verse recall",
            detailedInstructions: "1. Set a timer for 5 minutes\n2. Write out as many of your 10 verses as you can from memory\n3. Check accuracy\n4. Note which verses need more work\n5. In real spiritual combat, speed matters!\n6. Repeat this drill daily",
            type: "drill", 
            duration: "15 min", 
            icon: "⚡"
          },
          { 
            id: "w1-w1-a12", 
            title: "Training Drill: Memory Methods", 
            description: "Complete the official memory drill",
            detailedInstructions: "1. Go to Training Drills\n2. Select any 'Memory' or 'Warrior' drill\n3. Complete all questions\n4. Focus on memory technique questions\n5. Score at least 80%",
            type: "drill", 
            duration: "15 min", 
            link: "/training-drills", 
            icon: "🎯"
          },
          { 
            id: "w1-w1-a13", 
            title: "Verse Match: Combat Edition", 
            description: "Play Verse Match with your combat verses",
            detailedInstructions: "1. Go to Games > Verse Match\n2. Select your combat verse categories\n3. Play focusing on Ephesians, Romans, 2 Corinthians\n4. This gamifies your memorization\n5. Beat your previous high score!",
            type: "drill", 
            duration: "15 min", 
            link: "/games", 
            icon: "🎮"
          },
          { 
            id: "w1-w1-a14", 
            title: "Battle Scenario Practice", 
            description: "Practice applying verses to attack scenarios",
            detailedInstructions: "Match verses to battles:\n\n1. Attack: 'You'll never be good enough' → Response: Romans 8:37 'More than conquerors'\n\n2. Attack: 'God has abandoned you' → Response: Isaiah 41:10 'Fear not, I am with you'\n\n3. Attack: 'This situation is hopeless' → Response: Philippians 4:13 'I can do all things'\n\n4. Attack: 'You should give up' → Response: James 4:7 'Resist the devil'\n\nPractice these responses out loud!",
            type: "drill", 
            duration: "20 min", 
            icon: "⚔️"
          },

          // EXERCISES & APPLICATION (7 activities)
          { 
            id: "w1-w1-a15", 
            title: "Create Study: Combat Arsenal", 
            description: "Build your arsenal study in My Study Room",
            detailedInstructions: "1. Go to My Study Room\n2. Create: 'My Combat Arsenal - Month 1'\n3. Add 10 sections (one per verse)\n4. In each section:\n   - Full verse text\n   - When to use (what attack it defeats)\n   - Personal experience using it\n5. This becomes your battle reference",
            type: "exercise", 
            duration: "30 min", 
            link: "/my-study-room", 
            icon: "📝"
          },
          { 
            id: "w1-w1-a16", 
            title: "Gems: Battle Insights", 
            description: "Record combat insights as gems",
            detailedInstructions: "1. Go to Gems Room\n2. Add 3 combat gems:\n   - Gem: Jesus only used Scripture against Satan - no other weapon needed!\n   - Gem: 'More than conquerors' = not just surviving, but winning\n   - Gem: The sword is the ONLY offensive weapon in the armor\n3. These gems strengthen your warrior identity",
            type: "exercise", 
            duration: "15 min", 
            roomCode: "GR", 
            link: "/palace/floor/1/room/gr", 
            icon: "💎"
          },
          { 
            id: "w1-w1-a17", 
            title: "Create Verse Cards", 
            description: "Write verses on physical cards to carry",
            detailedInstructions: "1. Get 10 index cards or cut paper\n2. Write one verse per card:\n   - Reference on one side\n   - Full text on the other\n3. Carry these cards with you\n4. Review during waiting times, lunch, etc.\n5. Physical cards = constant combat readiness",
            type: "exercise", 
            duration: "20 min", 
            icon: "📋"
          },
          { 
            id: "w1-w1-a18", 
            title: "Community Share: Favorite Combat Verse", 
            description: "Share which verse resonates most for you",
            detailedInstructions: "1. Go to Community\n2. Create post: 'My Strongest Combat Verse'\n3. Share:\n   - Which of the 10 verses is your favorite?\n   - Why does it resonate with you?\n   - Have you used it in real spiritual battle?\n4. Comment on 3 other warrior posts\n5. Build your warrior community!",
            type: "exercise", 
            duration: "15 min", 
            link: "/community", 
            icon: "👥"
          },
          { 
            id: "w1-w1-a19", 
            title: "Daily Declaration Routine", 
            description: "Establish morning declaration habit",
            detailedInstructions: "Create your morning routine:\n1. Wake up and before anything else\n2. Declare OUT LOUD your combat verses\n3. Start with: 'I am strong in the Lord! (Eph 6:10)'\n4. Add 2-3 more verses as declarations\n5. End with: 'I am more than a conqueror! (Rom 8:37)'\n6. Do this for 7 days straight\n7. Track in Growth Journal",
            type: "exercise", 
            duration: "10 min daily", 
            icon: "🌅"
          },
          { 
            id: "w1-w1-a20", 
            title: "Growth Journal: Week 1 Battle Report", 
            description: "Write your first week's battle report",
            detailedInstructions: "1. Go to Growth Journal\n2. New entry: 'Week 1 Battle Report'\n3. Report:\n   - How many verses can I quote from memory? (Target: 10)\n   - Which verse is strongest for me?\n   - Which verse needs more drilling?\n   - Did I use Scripture in real battle this week?\n   - What enemy am I facing that needs a verse?\n4. Set Week 2 goals",
            type: "reflection", 
            duration: "15 min", 
            link: "/growth-journal", 
            icon: "📓"
          },
          { 
            id: "w1-w1-a21", 
            title: "Milestone Test: Quote 10 Verses", 
            description: "Demonstrate mastery of your first 10 verses",
            detailedInstructions: "Milestone Test:\n1. Close all notes/apps\n2. Write out all 10 verses with references from memory\n3. Check accuracy\n4. Acceptable: 8/10 perfect or better\n5. If you pass: You're combat ready!\n6. If not: Keep drilling until you can\n7. Check Achievements\n8. Prepare for Week 2: Gospel Ammunition",
            type: "reflection", 
            duration: "20 min", 
            link: "/achievements", 
            icon: "🏆"
          },
        ],
        milestone: "Can quote all 10 combat verses from memory",
      },
      // Weeks 2-4 with 21 activities each...
      ...generateWarriorWeeks2to4(),
    ],
    gateAssessment: "Quote all memorized verses from memory and demonstrate their application in spiritual battle scenarios.",
  },
  // Generate remaining months
  ...generateWarriorPathMonths(2, 24),
];

// ============================================
// HELPER FUNCTIONS - Generate remaining content
// ============================================

function generateAnalyticalWeeks2to4(): WeekOutline[] {
  return [
    {
      weekNumber: 2,
      title: "Definitions & Context",
      focus: "Using the Def-Com Room for deeper study",
      scripture: "John 3:1-21",
      activities: generateDetailedActivities("a1-w2", "John 3:1-21", "analytical", "Def-Com Room", [
        "Nicodemus encounter",
        "Born again meaning",
        "Greek word study",
        "Context analysis"
      ]),
      milestone: "Can use definitions and context to unlock meaning",
    },
    {
      weekNumber: 3,
      title: "Symbols & Types",
      focus: "Recognizing biblical patterns",
      scripture: "Numbers 21:4-9 → John 3:14-15",
      activities: generateDetailedActivities("a1-w3", "Numbers 21:4-9", "analytical", "Symbols/Types Room", [
        "Bronze serpent",
        "Type and antitype",
        "Cross-reference study",
        "Pattern recognition"
      ]),
      milestone: "Can identify types and their NT fulfillment",
    },
    {
      weekNumber: 4,
      title: "Month 1 Integration",
      focus: "Combining all analytical tools",
      scripture: "Romans 3:21-26",
      activities: generateDetailedActivities("a1-w4", "Romans 3:21-26", "analytical", "Integration", [
        "Observation + Definition",
        "Context + Symbols",
        "Full analysis method",
        "Gate Assessment prep"
      ]),
      milestone: "Ready for Month 1 Gate Assessment",
    },
  ];
}

function generateDevotionalWeeks2to4(): WeekOutline[] {
  return [
    {
      weekNumber: 2,
      title: "The Meditation Room",
      focus: "Deep absorption of Scripture",
      scripture: "Psalm 1",
      activities: generateDetailedActivities("d1-w2", "Psalm 1", "devotional", "Meditation Room", [
        "Meditation methods",
        "Day and night practice",
        "Tree imagery",
        "Blessed life"
      ]),
      milestone: "Establish daily meditation habit",
    },
    {
      weekNumber: 3,
      title: "Prayer & Scripture",
      focus: "Praying the Word",
      scripture: "Matthew 6:9-13 (Lord's Prayer)",
      activities: generateDetailedActivities("d1-w3", "Matthew 6:9-13", "devotional", "Prayer Integration", [
        "Lord's Prayer pattern",
        "Praying Scripture",
        "Petition and praise",
        "Daily prayer rhythm"
      ]),
      milestone: "Pray Scripture as natural habit",
    },
    {
      weekNumber: 4,
      title: "Month 1 Heart Check",
      focus: "Reviewing spiritual growth",
      scripture: "Psalm 139",
      activities: generateDetailedActivities("d1-w4", "Psalm 139", "devotional", "Heart Check", [
        "God knows me",
        "Search my heart",
        "Spiritual inventory",
        "Gate Assessment prep"
      ]),
      milestone: "Ready for Month 1 Gate Assessment",
    },
  ];
}

function generateWarriorWeeks2to4(): WeekOutline[] {
  return [
    {
      weekNumber: 2,
      title: "Gospel Ammunition",
      focus: "Memorizing salvation verses",
      scripture: "Romans 3:23, 6:23, 5:8, 10:9-10",
      activities: generateDetailedActivities("w1-w2", "Romans 3:23", "warrior", "Gospel Verses", [
        "Romans Road",
        "Salvation chain",
        "Gospel presentation",
        "Rapid recall"
      ]),
      milestone: "Can share the Gospel from memory",
    },
    {
      weekNumber: 3,
      title: "Defensive Verses",
      focus: "Memorizing verses against common attacks",
      scripture: "Psalm 91, Isaiah 54:17",
      activities: generateDetailedActivities("w1-w3", "Psalm 91", "warrior", "Defense Verses", [
        "Protection promises",
        "Fear vs faith",
        "Anxiety combat",
        "Speed defense"
      ]),
      milestone: "Can counter fear and anxiety with Scripture",
    },
    {
      weekNumber: 4,
      title: "Month 1 Battle Test",
      focus: "Full combat assessment",
      scripture: "Review all verses",
      activities: generateDetailedActivities("w1-w4", "Ephesians 6:10-17", "warrior", "Battle Test", [
        "Full arsenal review",
        "Speed tests",
        "Battle simulation",
        "Gate Assessment prep"
      ]),
      milestone: "Ready for Month 1 Gate Assessment",
    },
  ];
}

function generateDetailedActivities(
  prefix: string, 
  scripture: string, 
  path: string, 
  focus: string,
  themes: string[]
): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const icons = path === "visual" ? ["🎨", "👁️", "🖼️", "🎬", "💭", "📖", "🔍"] :
                path === "analytical" ? ["🔍", "📊", "🔬", "📝", "🧩", "📖", "❓"] :
                path === "devotional" ? ["🙏", "📖", "✍️", "❤️", "🕊️", "🔥", "🤫"] :
                ["⚔️", "🛡️", "🎯", "💪", "🏆", "📜", "⚡"];

  // Generate 21 activities for each week
  for (let i = 1; i <= 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" | "challenge" = 
      i <= 7 ? "reading" : i <= 14 ? "drill" : i <= 19 ? "exercise" : "reflection";
    
    const theme = themes[Math.floor((i - 1) / 5) % themes.length];
    
    activities.push({
      id: `${prefix}-a${i}`,
      title: `${theme} Activity ${i}`,
      description: `${focus} - ${theme} (${scripture})`,
      detailedInstructions: `1. Go to the appropriate room/feature\n2. Focus on ${theme}\n3. Apply to ${scripture}\n4. Record insights in Growth Journal\n5. Complete all steps before marking done`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: icons[i % icons.length],
      link: type === "reading" ? "/bible" : type === "drill" ? "/training-drills" : "/my-study-room",
    });
  }
  
  return activities;
}

function generateVisualPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Floor 2: Investigation Skills", theme: "Building Detective Skills", focus: ["Observation Room", "Symbols/Types", "Def-Com", "Integration"] },
    { title: "Floor 3: Freestyle Connections", theme: "Seeing Scripture Everywhere", focus: ["Nature Freestyle", "Personal Freestyle", "Bible Freestyle", "History Freestyle"] },
    { title: "Floor 4: Christ-Centered Study", theme: "Finding Christ in Every Page", focus: ["Concentration Room", "Dimensions", "Patterns", "Parallels"] },
    { title: "Floor 5: Prophetic Vision", theme: "Understanding Prophecy", focus: ["Blue Room", "Prophecy Room", "Three Angels", "Integration"] },
    { title: "Floor 6: Cycles & Heavens", theme: "Cosmic Context", focus: ["Eight Cycles", "Three Heavens", "Juice Room", "Integration"] },
    { title: "Integration Quarter", theme: "Full Visual Mastery", focus: ["Genesis Visual", "Exodus Visual", "Gospels Visual", "Revelation Visual"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1}: ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "visual"),
        activities: generateDetailedActivities(`v${m}-w${i + 1}`, getScriptureForMonth(m, i + 1, "visual"), "visual", f, [f, "Application", "Practice", "Review"]),
        milestone: `Complete ${f} with 21 activities`,
      })),
      gateAssessment: `Demonstrate Month ${m} visual mastery with comprehensive project.`,
    });
  }
  return months;
}

function generateAnalyticalPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Questions Mastery", theme: "Deep Questioning", focus: ["75 Questions Method", "Intratextual", "Intertextual", "Phototheological"] },
    { title: "Hermeneutics", theme: "Interpretation Principles", focus: ["Context Rules", "Genre Study", "Author Intent", "Application Bridge"] },
    { title: "Word Studies", theme: "Original Language Tools", focus: ["Greek Basics", "Hebrew Basics", "Lexicon Use", "Word History"] },
    { title: "Structural Analysis", theme: "Literary Patterns", focus: ["Chiasms", "Inclusios", "Parallelism", "Discourse Analysis"] },
    { title: "Synthesis", theme: "Big Picture Thinking", focus: ["Book Themes", "Testament Unity", "Doctrinal Formation", "Research Methods"] },
    { title: "Advanced Research", theme: "Scholarly Tools", focus: ["Commentary Use", "Cross-Reference", "Timeline Study", "Capstone Project"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1}: ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "analytical"),
        activities: generateDetailedActivities(`a${m}-w${i + 1}`, getScriptureForMonth(m, i + 1, "analytical"), "analytical", f, [f, "Analysis", "Practice", "Review"]),
        milestone: `Complete ${f} analysis with 21 activities`,
      })),
      gateAssessment: `Present Month ${m} analytical research demonstrating mastery.`,
    });
  }
  return months;
}

function generateDevotionalPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Prayer Deepening", theme: "Intimate Communion", focus: ["ACTS Prayer", "Listening Prayer", "Intercessory", "Prayer Journal"] },
    { title: "Spiritual Disciplines", theme: "Habits of Grace", focus: ["Fasting", "Solitude", "Silence", "Sabbath"] },
    { title: "Character Formation", theme: "Fruit of the Spirit", focus: ["Love & Joy", "Peace & Patience", "Kindness & Goodness", "Faithfulness"] },
    { title: "Psalms Journey", theme: "Emotional Honesty", focus: ["Praise Psalms", "Lament Psalms", "Wisdom Psalms", "Messianic Psalms"] },
    { title: "Life Integration", theme: "Whole-Life Devotion", focus: ["Work & Worship", "Family Devotion", "Community", "Kingdom Living"] },
    { title: "Contemplative Depth", theme: "Ancient Practices", focus: ["Lectio Divina", "Examen", "Centering Prayer", "Spiritual Direction"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1}: ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "devotional"),
        activities: generateDetailedActivities(`d${m}-w${i + 1}`, getScriptureForMonth(m, i + 1, "devotional"), "devotional", f, [f, "Heart Work", "Practice", "Review"]),
        milestone: `Experience ${f} breakthrough`,
      })),
      gateAssessment: `Share Month ${m} devotional journey demonstrating heart growth.`,
    });
  }
  return months;
}

function generateWarriorPathMonths(startMonth: number, endMonth: number): MonthCurriculum[] {
  const themes = [
    { title: "Advanced Arsenal", theme: "Expanding Memory", focus: ["OT Promises", "NT Commands", "Prophecy Verses", "Speed Drills"] },
    { title: "Battle Tactics", theme: "Combat Strategies", focus: ["Defense Patterns", "Offensive Moves", "Team Combat", "Recovery"] },
    { title: "Gospel Deployment", theme: "Evangelism Training", focus: ["Personal Evangelism", "Testimony Power", "Question Handling", "Follow-Up"] },
    { title: "Leadership Combat", theme: "Leading Others", focus: ["Teaching Memory", "Training Others", "Group Combat", "Mentorship"] },
    { title: "Scripture Mastery", theme: "Complete Arsenal", focus: ["OT Survey Memory", "NT Survey Memory", "Theme Chains", "Quick Draw"] },
    { title: "Full Deployment", theme: "Active Service", focus: ["Ministry Combat", "Community Defense", "Global Warfare", "Legacy Building"] },
  ];

  const months: MonthCurriculum[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const themeIndex = (m - 2) % themes.length;
    const theme = themes[themeIndex] || themes[0];
    
    months.push({
      month: m,
      title: theme.title,
      theme: theme.theme,
      weeks: theme.focus.map((f, i) => ({
        weekNumber: i + 1,
        title: f,
        focus: `Month ${m}, Week ${i + 1}: ${f}`,
        scripture: getScriptureForMonth(m, i + 1, "warrior"),
        activities: generateDetailedActivities(`w${m}-w${i + 1}`, getScriptureForMonth(m, i + 1, "warrior"), "warrior", f, [f, "Combat Drill", "Practice", "Review"]),
        milestone: `Achieve ${f} combat readiness`,
      })),
      gateAssessment: `Complete Month ${m} battle assessment demonstrating mastery.`,
    });
  }
  return months;
}

function getScriptureForMonth(month: number, week: number, path: string): string {
  const scriptures: Record<string, string[]> = {
    visual: ["Genesis 37-50", "Exodus 1-15", "Joshua 1-12", "Judges highlights", "Ruth", "1 Samuel 1-20", "Daniel 1-6", "Jonah", "Matthew 1-7", "Mark 1-8", "Luke 1-9", "John 1-12"],
    analytical: ["Romans 1-8", "Romans 9-16", "Galatians", "Ephesians", "Philippians", "Colossians", "Hebrews 1-6", "Hebrews 7-13", "James", "1 Peter", "2 Peter", "1 John"],
    devotional: ["Psalms 1-30", "Psalms 31-60", "Psalms 61-90", "Psalms 91-120", "Psalms 121-150", "Proverbs 1-15", "Proverbs 16-31", "Ecclesiastes", "Song of Solomon", "Isaiah 40-55", "John 13-17", "1 John"],
    warrior: ["Joshua", "Judges", "1 Samuel", "2 Samuel", "Daniel 1-6", "Acts 1-12", "Acts 13-28", "Ephesians 6", "2 Timothy", "Revelation 1-3", "Revelation 12-14", "Revelation 19-22"],
  };
  const list = scriptures[path] || scriptures.visual;
  return list[(month + week) % list.length];
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
