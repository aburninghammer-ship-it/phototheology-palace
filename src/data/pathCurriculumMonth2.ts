import { MonthCurriculum, WeekActivity } from "./pathCurriculum";

// ============================================
// MONTH 2: VISUAL PATH - Floor 2 Visual Investigation
// ============================================
export const visualPathMonth2: MonthCurriculum = {
  month: 2,
  title: "Visual Investigation",
  theme: "Seeing the Evidence Like a Detective Artist",
  weeks: [
    {
      weekNumber: 1,
      title: "Observation Sketching",
      focus: "Learn to SEE and DRAW what the text actually says",
      scripture: "Luke 15:11-32 (Prodigal Son)",
      activities: [
        { 
          id: "v2-w1-a1", 
          title: "Floor 2 Introduction: Detective Artist", 
          description: "Learn how observation serves visual memory",
          detailedInstructions: "1. Go to Palace > Floor 2 Overview\n2. Read about the Investigation Floor\n3. KEY INSIGHT: Visual learners investigate by DRAWING observations\n4. You don't just list what you see - you SKETCH it\n5. This combines Floor 1 (visual) with Floor 2 (detective) methods",
          type: "reading", 
          duration: "15 min", 
          link: "/palace/floor/2", 
          icon: "🎨",
          lookFor: ["The 5 observation categories", "How drawing enhances memory", "The visual evidence board concept"]
        },
        { 
          id: "v2-w1-a2", 
          title: "Read Luke 15:11-24 - Sketch Key Moments", 
          description: "Read the first half of the parable, sketching 5 key visual moments",
          detailedInstructions: "1. Read Luke 15:11-24 slowly\n2. SKETCH 5 key visual moments:\n   - Sketch 1: Father dividing property (v12)\n   - Sketch 2: Son in 'far country' (v13)\n   - Sketch 3: Pig pen scene (v15-16)\n   - Sketch 4: 'Coming to himself' moment (v17)\n   - Sketch 5: Father running (v20)\n3. Simple sketches - stick figures are fine!\n4. The goal is VISUAL OBSERVATION",
          type: "reading", 
          duration: "25 min", 
          link: "/bible/Luke/15", 
          icon: "✏️",
          specificVerse: "Luke 15:11-24",
          lookFor: ["Specific details: 'riotous living', 'mighty famine', 'husks that the swine did eat'", "Father's response BEFORE son speaks", "The phrase 'fell on his neck'"]
        },
        { 
          id: "v2-w1-a3", 
          title: "Read Luke 15:25-32 - Elder Brother Scene", 
          description: "Complete the parable with visual observation of the elder brother",
          detailedInstructions: "1. Read Luke 15:25-32\n2. SKETCH 3 more moments:\n   - Sketch 6: Elder brother in field hearing music (v25)\n   - Sketch 7: His angry stance outside (v28)\n   - Sketch 8: Father entreating (v28b)\n3. Note: The story ends with a question, not a resolution!\n4. What does the elder brother's face look like?",
          type: "reading", 
          duration: "20 min", 
          link: "/bible/Luke/15", 
          icon: "✏️",
          specificVerse: "Luke 15:25-32",
          lookFor: ["Where is the elder brother when the feast starts?", "What doesn't he call his brother?", "The father's response to both sons"]
        },
        { 
          id: "v2-w1-a4", 
          title: "Observation Room: Visual Evidence Board", 
          description: "Create a visual 'evidence board' of observations",
          detailedInstructions: "1. Go to Palace > Floor 2 > Observation Room\n2. Learn the observation method\n3. Now CREATE a visual evidence board for Luke 15:\n   - Draw a large rectangle (your 'board')\n   - Pin your 8 sketches around it\n   - Draw connecting lines between related images\n   - Add word labels for key observations\n4. This is a VISUAL observation log",
          type: "reading", 
          duration: "25 min", 
          roomCode: "OR", 
          link: "/palace/floor/2/room/or", 
          icon: "📋"
        },
        { 
          id: "v2-w1-a5", 
          title: "Encyclopedia: Prodigal Son Visual Context", 
          description: "Research cultural context that enriches your sketches",
          detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Prodigal Son' or 'Luke 15'\n3. Visual context to add to sketches:\n   - Jewish father running = undignified (robes hiked up)\n   - Ring = authority/family seal\n   - Shoes = only free men wore shoes\n   - Fatted calf = rare feast (special occasion)\n4. Update your sketches with these details",
          type: "reading", 
          duration: "15 min", 
          link: "/encyclopedia", 
          icon: "📚"
        },
        { 
          id: "v2-w1-a6", 
          title: "Daily Verse: Sketch Today's Word", 
          description: "Create a simple sketch of today's Daily Verse",
          detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse 3 times\n3. Create ONE simple sketch that captures the verse\n4. Add to your Growth Journal\n5. This daily practice trains visual observation",
          type: "reading", 
          duration: "10 min", 
          link: "/daily-verse", 
          icon: "✨"
        },
        { 
          id: "v2-w1-a7", 
          title: "Color Coding: Three Characters", 
          description: "Create a color-coded character study using visual cues",
          detailedInstructions: "1. Assign colors to each character:\n   - Father = BLUE (calm, loving, faithful)\n   - Younger son = RED (passion, sin, repentance)\n   - Elder son = GREEN (envy? or growth needed?)\n2. Re-read Luke 15:11-32\n3. Mark/highlight mentions of each character\n4. Create a color map showing when each appears\n5. Visual pattern: Who gets the most 'screen time'?",
          type: "drill", 
          duration: "20 min", 
          link: "/bible/Luke/15", 
          icon: "🎨"
        },
        { 
          id: "v2-w1-a8", 
          title: "Training Drill: Observation Room", 
          description: "Complete the official Observation Room drill visually",
          detailedInstructions: "1. Go to Training Drills\n2. Select 'Observation Room' drill\n3. For each question, think visually:\n   - What do I SEE in the text?\n   - Can I sketch this observation?\n4. Score 80%+\n5. Review wrong answers - what did you miss SEEING?",
          type: "drill", 
          duration: "15 min", 
          link: "/training-drills", 
          icon: "🎯"
        },
        { 
          id: "v2-w1-a9", 
          title: "Daily Challenge: Parable Response", 
          description: "Complete today's challenge using your visual observations",
          detailedInstructions: "1. Go to Daily Challenges\n2. Approach the challenge with your visual evidence board in mind\n3. Reference your sketches when answering\n4. Use phrases like 'Notice the image of...', 'Visualize the scene where...'\n5. Review AI feedback",
          type: "drill", 
          duration: "15 min", 
          link: "/daily-challenges", 
          icon: "🌟"
        },
        { 
          id: "v2-w1-a10", 
          title: "Card Deck: Visual Study of Luke 15", 
          description: "Use Card Deck with visual focus on Luke 15",
          detailedInstructions: "1. Go to Card Deck\n2. Enter Luke 15:20 as starting verse\n3. For each card, create a MENTAL SKETCH\n4. Ask: What does this look like? What colors? What movement?\n5. Save your study with visual notes",
          type: "drill", 
          duration: "20 min", 
          link: "/card-deck", 
          icon: "🃏"
        },
        { 
          id: "v2-w1-a11", 
          title: "Flashcards: 8 Visual Moments", 
          description: "Create flashcards from your 8 sketches",
          detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Prodigal Son Visual Moments'\n3. 8 cards:\n   - Front: Description of scene\n   - Back: Verse reference + your sketch description\n4. Test: Description → Verse AND Verse → Description\n5. Master for instant recall",
          type: "drill", 
          duration: "20 min", 
          link: "/flashcards", 
          icon: "📇"
        },
        { 
          id: "v2-w1-a12", 
          title: "Bible-Wide Connection: Other Father Images", 
          description: "Sketch father images across Scripture",
          detailedInstructions: "1. Read these 'father' passages:\n   - Genesis 22:1-8 (Abraham/Isaac)\n   - 2 Samuel 18:33 (David/Absalom)\n   - Matthew 7:9-11 (Good Father)\n2. Create a SKETCH for each father scene\n3. Compare to Prodigal Father\n4. What visual patterns emerge?",
          type: "drill", 
          duration: "25 min", 
          icon: "🔗"
        },
        { 
          id: "v2-w1-a13", 
          title: "Christ Connection: Draw the Father as God", 
          description: "Create a visual showing how the father represents God",
          detailedInstructions: "1. Go to Concentration Room preview (Floor 4)\n2. The father IS God in this parable\n3. Create a DUAL IMAGE:\n   - Left side: Human father in story\n   - Right side: Heavenly Father's love\n4. Visual elements to include:\n   - Running (God seeking us)\n   - Embrace (grace)\n   - Ring/robe (restoration to family)\n5. This is VISUAL Christ-centered study",
          type: "exercise", 
          duration: "25 min", 
          roomCode: "CR", 
          link: "/palace/floor/4/room/cr", 
          icon: "✝️"
        },
        { 
          id: "v2-w1-a14", 
          title: "Create Study: Visual Evidence Board", 
          description: "Document your complete visual evidence board",
          detailedInstructions: "1. Go to My Studies\n2. Create: 'Luke 15: Visual Evidence Board'\n3. Include:\n   - All 8 sketches (describe or photograph)\n   - Color coding analysis\n   - Visual connections you discovered\n   - Christ-centered dual image\n4. This is your first visual investigation complete",
          type: "exercise", 
          duration: "30 min", 
          link: "/my-studies",
          icon: "📝"
        },
        { 
          id: "v2-w1-a15", 
          title: "Symbols & Types Preview: Son as Sinner", 
          description: "Explore the younger son as TYPE of every sinner",
          detailedInstructions: "1. Go to Floor 2 > Symbols/Types Room\n2. The younger son is a TYPE - he represents something larger\n3. Draw a COMPARISON chart:\n   - Younger son's journey → Every sinner's journey\n   - Far country → Life away from God\n   - Pig pen → Rock bottom\n   - 'Coming to himself' → Conviction\n   - Return → Repentance\n4. Visual typology connects images across stories",
          type: "exercise", 
          duration: "20 min", 
          roomCode: "ST", 
          link: "/palace/floor/2/room/st", 
          icon: "🔣"
        },
        { 
          id: "v2-w1-a16", 
          title: "Gems Room: Visual Gems from Luke 15", 
          description: "Collect visual gems that sparkle with insight",
          detailedInstructions: "1. Go to Gems Room\n2. Collect VISUAL gems from Luke 15:\n   - Gem 1: Father SAW him from far off (was watching daily!)\n   - Gem 2: Father RAN (undignified = love over honor)\n   - Gem 3: Best ROBE (not new robe - THE best one, maybe father's?)\n   - Gem 4: RING = authority (fully restored, not probation)\n3. Each gem should have a visual anchor",
          type: "exercise", 
          duration: "20 min", 
          roomCode: "GR", 
          link: "/palace/floor/1/room/gr", 
          icon: "💎"
        },
        { 
          id: "v2-w1-a17", 
          title: "Community Share: Your Evidence Board", 
          description: "Share your visual investigation with the community",
          detailedInstructions: "1. Go to Community\n2. Post: 'My Luke 15 Visual Evidence Board'\n3. Share:\n   - Your best sketch\n   - One visual gem you discovered\n   - How visual observation changed your reading\n4. Comment on 2 others' visual investigations",
          type: "exercise", 
          duration: "15 min", 
          link: "/community", 
          icon: "👥"
        },
        { 
          id: "v2-w1-a18", 
          title: "Alternative Scene: Draw What's NOT Shown", 
          description: "Imagine and sketch scenes the text doesn't show",
          detailedInstructions: "1. The text has GAPS - moments not described\n2. Sketch these 'missing scenes':\n   - The moment younger son first leaves (what's on father's face?)\n   - A day in the far country BEFORE poverty\n   - Elder brother's normal day working (what's his expression?)\n3. These are SANCTIFIED imagination exercises\n4. They help you inhabit the story",
          type: "exercise", 
          duration: "20 min", 
          icon: "🖼️"
        },
        { 
          id: "v2-w1-a19", 
          title: "Growth Journal: Week 1 Visual Investigation", 
          description: "Reflect on visual observation as a study method",
          detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 1 - Visual Investigation Reflection'\n3. Answer:\n   - How did sketching change my reading?\n   - Which sketch revealed the most?\n   - What do I SEE now that I missed before?\n   - How can I apply this to other passages?\n4. Set visual goals for Week 2",
          type: "reflection", 
          duration: "15 min", 
          link: "/growth-journal", 
          icon: "📓"
        },
        { 
          id: "v2-w1-a20", 
          title: "Retell Test: Story from Sketches Only", 
          description: "Test if your sketches contain the story",
          detailedInstructions: "1. Close your Bible\n2. Look ONLY at your 8 sketches\n3. Retell Luke 15:11-32 from memory using sketches as prompts\n4. Can you get all the key details?\n5. If sketches are weak prompts, strengthen them\n6. Visual observation = visual memory",
          type: "reflection", 
          duration: "15 min", 
          icon: "🔄"
        },
        { 
          id: "v2-w1-a21", 
          title: "Milestone: Complete Visual Evidence Board", 
          description: "Final check on your visual investigation skills",
          detailedInstructions: "1. Review your complete evidence board\n2. Check you have:\n   - 8+ sketches\n   - Color coding\n   - Christ connection\n   - 3+ visual gems\n   - Typology connections\n3. This is visual investigation - observation through ART\n4. Check Achievements\n5. Week 2 builds on this foundation!",
          type: "reflection", 
          duration: "10 min", 
          link: "/achievements", 
          icon: "🏆"
        },
      ],
      milestone: "Complete visual evidence board of Luke 15 with 8+ sketches and Christ connection",
    },
    {
      weekNumber: 2,
      title: "Visual Symbol Library",
      focus: "Build a personal library of biblical symbol drawings",
      scripture: "John 10:1-21 (Good Shepherd)",
      activities: [
        { id: "v2-w2-a1", title: "Symbols/Types Room Deep Dive", description: "Master the visual symbol system", detailedInstructions: "1. Go to Palace > Floor 2 > Symbols/Types Room\n2. Read the complete guide\n3. KEY: Symbols are God's visual language\n4. Every symbol has an IMAGE\n5. Visual learners BUILD a symbol picture library", type: "reading", duration: "15 min", roomCode: "ST", link: "/palace/floor/2/room/st", icon: "🔣" },
        { id: "v2-w2-a2", title: "Read John 10:1-10 - Shepherd Symbols", description: "Identify and sketch shepherd imagery", detailedInstructions: "1. Read John 10:1-10\n2. SKETCH each symbol:\n   - The sheepfold (pen)\n   - The door\n   - The porter (gatekeeper)\n   - The shepherd's voice\n   - The stranger\n3. Create a SYMBOL SHEET for 'Shepherd' imagery", type: "reading", duration: "20 min", link: "/bible/John/10", icon: "🐑", specificVerse: "John 10:1-10" },
        { id: "v2-w2-a3", title: "Read John 10:11-21 - Good Shepherd Claims", description: "Sketch Jesus' 'I AM' shepherd claims", detailedInstructions: "1. Read John 10:11-21\n2. Jesus says 'I AM' twice - sketch each:\n   - 'I am the door' (v7,9) - What does this door look like?\n   - 'I am the good shepherd' (v11,14) - How is He different from hired hands?\n3. Add to your Shepherd symbol sheet", type: "reading", duration: "20 min", link: "/bible/John/10", icon: "✝️", specificVerse: "John 10:11-21" },
        { id: "v2-w2-a4", title: "Cross-Reference: Psalm 23 Visual Link", description: "Connect John 10 to Psalm 23 visually", detailedInstructions: "1. Open Psalm 23 alongside John 10\n2. Create a SPLIT-SCREEN drawing:\n   - Left: Psalm 23 shepherd images\n   - Right: John 10 shepherd images\n3. Draw lines connecting related images\n4. OT shadow → NT fulfillment VISIBLE", type: "reading", duration: "25 min", icon: "🔗" },
        { id: "v2-w2-a5", title: "Encyclopedia: Shepherd in Scripture", description: "Research shepherd symbolism comprehensively", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Shepherd'\n3. Create a TIMELINE of shepherd imagery:\n   - Abel (first shepherd)\n   - Abraham, Isaac, Jacob (patriarchs as shepherds)\n   - Moses (shepherd of Israel)\n   - David (shepherd king)\n   - Jesus (THE Good Shepherd)\n4. Draw shepherd symbol evolution", type: "reading", duration: "20 min", link: "/encyclopedia", icon: "📚" },
        { id: "v2-w2-a6", title: "Daily Verse: Symbol Hunt", description: "Identify symbols in today's verse and sketch them", detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. What SYMBOLS appear? (light, water, rock, seed, etc.)\n4. Sketch any symbols you find\n5. Add to your growing symbol library", type: "reading", duration: "10 min", link: "/daily-verse", icon: "✨" },
        { id: "v2-w2-a7", title: "Symbol Library Page: Animals", description: "Create symbol library page for biblical animals", detailedInstructions: "1. Create a 'Biblical Animals' symbol page\n2. Draw and label:\n   - Lamb (sacrifice, Christ)\n   - Lion (strength, Judah, Christ)\n   - Dove (Spirit, peace)\n   - Serpent (Satan, sin, also bronze serpent healing)\n   - Eagle (renewal, God's care)\n3. Add verse references for each", type: "drill", duration: "25 min", icon: "🦁" },
        { id: "v2-w2-a8", title: "Training Drill: Symbols/Types", description: "Complete official drill on symbols", detailedInstructions: "1. Go to Training Drills\n2. Select 'Symbols/Types Room'\n3. Answer with visual memory\n4. If you miss any, add to your symbol library\n5. Score 80%+", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
        { id: "v2-w2-a9", title: "Symbol Library Page: Elements", description: "Create symbol library page for elements", detailedInstructions: "1. Create 'Biblical Elements' symbol page\n2. Draw and label:\n   - Light (truth, Christ, glory)\n   - Water (Spirit, life, cleansing)\n   - Fire (judgment, purification, presence)\n   - Rock (Christ, stability, foundation)\n   - Wind/Breath (Spirit, life)\n3. Add verse references", type: "drill", duration: "25 min", icon: "💧" },
        { id: "v2-w2-a10", title: "Daily Challenge: Symbol Identification", description: "Complete challenge identifying symbols", detailedInstructions: "1. Go to Daily Challenges\n2. Look for SYMBOLS in the challenge content\n3. Reference your symbol library\n4. Use visual language in answers\n5. Review AI feedback on symbol identification", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "v2-w2-a11", title: "Symbol Library Page: Objects", description: "Create symbol library page for sacred objects", detailedInstructions: "1. Create 'Sacred Objects' symbol page\n2. Draw and label:\n   - Bread (Word, provision, Christ's body)\n   - Wine/Blood (covenant, Christ's sacrifice)\n   - Oil (Spirit, anointing)\n   - Altar (sacrifice, worship)\n   - Lamp (Word, witness)\n3. Add verse references", type: "drill", duration: "25 min", icon: "🍞" },
        { id: "v2-w2-a12", title: "Flashcards: Symbol Quick Reference", description: "Create flashcards for rapid symbol recall", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Biblical Symbols'\n3. 15 cards minimum:\n   - Front: Symbol image/name\n   - Back: Meaning + key verse\n4. Test until instant recall\n5. Add more as you discover", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
        { id: "v2-w2-a13", title: "Card Deck: Symbol Study", description: "Use Card Deck to explore symbol connections", detailedInstructions: "1. Go to Card Deck\n2. Enter John 10:11 as verse\n3. Use cards to explore 'shepherd' connections\n4. Note every symbol that appears\n5. Add new ones to library", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
        { id: "v2-w2-a14", title: "Create Study: Symbol Library v1", description: "Compile your symbol library in My Studies", detailedInstructions: "1. Go to My Studies\n2. Create: 'My Biblical Symbol Library - Volume 1'\n3. Include:\n   - Animals page\n   - Elements page\n   - Objects page\n   - Shepherd special page\n4. This is a LIVING document - keep adding!", type: "exercise", duration: "30 min", link: "/my-studies", icon: "📝" },
        { id: "v2-w2-a15", title: "Symbol Chain: Door → Gate → Way", description: "Trace a symbol across Scripture visually", detailedInstructions: "1. Jesus says 'I am the door' (John 10:9)\n2. Trace 'door/gate/way' across Scripture:\n   - Noah's ark door (Gen 7:16)\n   - Passover door (Exodus 12)\n   - Gate of heaven (Gen 28:17)\n   - Narrow gate (Matt 7:13-14)\n   - 'I am the way' (John 14:6)\n3. Create a VISUAL CHAIN linking these", type: "exercise", duration: "25 min", icon: "🚪" },
        { id: "v2-w2-a16", title: "Gems: Symbol Gems Collection", description: "Collect insights from symbol study", detailedInstructions: "1. Go to Gems Room\n2. Collect SYMBOL GEMS:\n   - Gem: 'I am the door' - the ONLY entrance to salvation\n   - Gem: Shepherd DIES for sheep (hired hand won't)\n   - Gem: 'Other sheep' (v16) = Gentiles - one flock!\n3. Each gem should have symbol connection", type: "exercise", duration: "20 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "v2-w2-a17", title: "Community: Share Your Symbol Library", description: "Share a symbol page with community", detailedInstructions: "1. Go to Community\n2. Post: 'My Symbol Library - Animals' (or your best page)\n3. Share:\n   - Your drawings\n   - Why these symbols matter\n   - How they connect to Christ\n4. Learn from others' libraries", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "v2-w2-a18", title: "Symbol Comparison: Hired Hand vs Good Shepherd", description: "Create visual comparison chart", detailedInstructions: "1. Create a T-CHART:\n   - Left: Hired Hand (characteristics)\n   - Right: Good Shepherd (characteristics)\n2. Draw symbols for each characteristic\n3. Use John 10:11-13 as source\n4. Visual contrast aids memory", type: "exercise", duration: "20 min", icon: "⚖️" },
        { id: "v2-w2-a19", title: "Growth Journal: Symbol Learning Reflection", description: "Reflect on visual symbol mastery", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 2 - Symbol Library Reflection'\n3. Answer:\n   - How many symbols can I instantly recognize?\n   - Which symbols are richest in meaning?\n   - How do symbols connect OT and NT?\n   - What symbols do I want to study more?\n4. Set Week 3 goals", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "v2-w2-a20", title: "Symbol Speed Test", description: "Test rapid symbol recognition", detailedInstructions: "1. Use your flashcards\n2. Set timer for 3 minutes\n3. How many symbols can you identify AND explain?\n4. Goal: 15+ in 3 minutes\n5. Weak areas = review needed", type: "reflection", duration: "15 min", icon: "⏱️" },
        { id: "v2-w2-a21", title: "Milestone: Symbol Library Complete", description: "Verify your symbol library is functional", detailedInstructions: "1. Review your symbol library\n2. Check you have:\n   - 3+ category pages\n   - 15+ symbols documented\n   - Verse references for each\n   - Visual connections drawn\n3. This is a resource you'll use forever!\n4. Check Achievements", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Complete visual symbol library with 15+ symbols across 3+ categories",
    },
    {
      weekNumber: 3,
      title: "Scene Mapping",
      focus: "Create visual maps of complex Bible narratives",
      scripture: "Acts 27 (Paul's Shipwreck)",
      activities: [
        { id: "v2-w3-a1", title: "Scene Mapping Introduction", description: "Learn to map stories geographically and dramatically", detailedInstructions: "1. Scene mapping = creating visual MAPS of narratives\n2. Two types:\n   - Geographic maps (where events happen)\n   - Dramatic maps (how events flow emotionally)\n3. Acts 27 is PERFECT for this - a sea voyage with drama!\n4. This week you'll create both map types", type: "reading", duration: "15 min", icon: "🗺️" },
        { id: "v2-w3-a2", title: "Read Acts 27:1-12 - Plot the Voyage", description: "Read first section, mapping the route", detailedInstructions: "1. Read Acts 27:1-12\n2. DRAW a map with:\n   - Starting point: Caesarea (v1)\n   - Sidon (v3)\n   - Cyprus (v4)\n   - Myra (v5)\n   - Fair Havens, Crete (v8)\n3. Draw ship icons at each stop\n4. Note Paul's warning (v10)", type: "reading", duration: "25 min", link: "/bible/Acts/27", icon: "⛵", specificVerse: "Acts 27:1-12" },
        { id: "v2-w3-a3", title: "Read Acts 27:13-26 - The Storm", description: "Map the storm and Paul's vision", detailedInstructions: "1. Read Acts 27:13-26\n2. Add to your map:\n   - Storm begins (v14)\n   - Undergirding the ship (v17)\n   - Throwing cargo overboard (v18-19)\n   - 'Neither sun nor stars' for many days (v20)\n   - Paul's angel vision (v23-24)\n3. Use weather symbols: waves, clouds, lightning", type: "reading", duration: "25 min", link: "/bible/Acts/27", icon: "⛈️", specificVerse: "Acts 27:13-26" },
        { id: "v2-w3-a4", title: "Read Acts 27:27-44 - Shipwreck & Salvation", description: "Complete the story with shipwreck scene", detailedInstructions: "1. Read Acts 27:27-44\n2. Complete your map:\n   - 14th night at sea (v27)\n   - Sounding the depth (v28)\n   - Dropping anchors (v29)\n   - Sailors trying to escape (v30)\n   - Breaking bread (v35)\n   - Running aground (v41)\n   - Everyone swimming to Malta (v44)\n3. Draw the final scene: all 276 safe!", type: "reading", duration: "25 min", link: "/bible/Acts/27", icon: "🏝️", specificVerse: "Acts 27:27-44" },
        { id: "v2-w3-a5", title: "Encyclopedia: Paul's Journeys Visual", description: "See Acts 27 in context of Paul's missions", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Paul's Journeys' or 'Paul's Missionary Journeys'\n3. Find visual maps of his travels\n4. Locate this voyage (4th journey, to Rome)\n5. Add context to your map: Rome is the GOAL", type: "reading", duration: "15 min", link: "/encyclopedia", icon: "📚" },
        { id: "v2-w3-a6", title: "Daily Verse: Map Integration", description: "Connect today's verse to a visual map", detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. Ask: Where could this verse BE on a map?\n4. What narrative does it belong to?\n5. Visual mapping = spatial memory", type: "reading", duration: "10 min", link: "/daily-verse", icon: "✨" },
        { id: "v2-w3-a7", title: "Dramatic Arc Map", description: "Create emotional drama map of Acts 27", detailedInstructions: "1. Draw a LINE GRAPH of emotional intensity:\n   - X-axis: Verses (1-44)\n   - Y-axis: Tension level (1-10)\n2. Plot key moments:\n   - v10: Paul's warning (tension rises)\n   - v20: Hope abandoned (peak despair)\n   - v24: Angel vision (hope returns)\n   - v41: Ship destroyed (tension peak)\n   - v44: All safe (resolution)\n3. This is DRAMATIC MAPPING", type: "drill", duration: "25 min", icon: "📈" },
        { id: "v2-w3-a8", title: "Character Position Map", description: "Track where characters are in the scene", detailedInstructions: "1. Create a SHIP DECK diagram\n2. Track Paul's position throughout:\n   - v10: Speaking to centurion\n   - v21: Standing among them\n   - v35: Taking bread, breaking it (leadership moment)\n3. Also track: Julius the centurion, sailors, prisoners\n4. Visual staging clarifies narrative", type: "drill", duration: "20 min", icon: "🚢" },
        { id: "v2-w3-a9", title: "Training Drill: Scene Recall", description: "Test your mapped memory of Acts 27", detailedInstructions: "1. Close your Bible\n2. Using ONLY your maps, retell Acts 27\n3. Test yourself:\n   - Can you name all stops?\n   - Can you trace the storm?\n   - Can you recall key verse numbers?\n4. Maps should enable total recall", type: "drill", duration: "15 min", icon: "🎯" },
        { id: "v2-w3-a10", title: "Daily Challenge: Navigation Theme", description: "Complete challenge with mapping perspective", detailedInstructions: "1. Go to Daily Challenges\n2. Think geographically - where is this happening?\n3. Think dramatically - what's the tension level?\n4. Use visual mapping language in answers\n5. Review feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "v2-w3-a11", title: "Symbol Integration: Storm = Trials", description: "Connect storm imagery to symbol library", detailedInstructions: "1. Add 'Storm/Sea' to your symbol library\n2. Storm symbolism:\n   - Trials, opposition, chaos\n   - But also: God's power to calm (Mark 4:39)\n3. Draw the symbol\n4. Cross-reference:\n   - Jonah's storm (Jonah 1)\n   - Jesus calming storm (Mark 4)\n   - Sea of glass (Rev 4:6)", type: "drill", duration: "20 min", icon: "🌊" },
        { id: "v2-w3-a12", title: "Parallel Map: Jonah's Voyage", description: "Create comparison map with Jonah", detailedInstructions: "1. Read Jonah 1-2 quickly\n2. Create PARALLEL MAPS:\n   - Left: Jonah's voyage\n   - Right: Paul's voyage\n3. Note similarities:\n   - Storm at sea\n   - Sailors' fear\n   - Divine intervention\n4. Note differences:\n   - Jonah fleeing God, Paul serving God", type: "drill", duration: "25 min", icon: "🐋" },
        { id: "v2-w3-a13", title: "Card Deck: Voyage Study", description: "Use cards to explore Acts 27 deeply", detailedInstructions: "1. Go to Card Deck\n2. Enter Acts 27:25 ('I believe God')\n3. Use cards to explore:\n   - Paul's faith amidst chaos\n   - The outcome of trusting God's word\n4. Add insights to your map", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
        { id: "v2-w3-a14", title: "Create Study: Complete Acts 27 Map Set", description: "Compile all maps into one study", detailedInstructions: "1. Go to My Studies\n2. Create: 'Acts 27 Complete Map Set'\n3. Include:\n   - Geographic voyage map\n   - Dramatic arc graph\n   - Character position diagram\n   - Symbol connections\n   - Jonah parallel\n4. This is comprehensive visual study!", type: "exercise", duration: "30 min", link: "/my-studies", icon: "📝" },
        { id: "v2-w3-a15", title: "Christ Connection: Shelter in Storm", description: "Map how Christ appears in Acts 27", detailedInstructions: "1. Paul receives vision from Christ's angel (v23-24)\n2. Create a visual showing:\n   - The storm (human chaos)\n   - The angel (divine intervention)\n   - Paul's peace (result of Christ's presence)\n3. Christ is our shelter in EVERY storm\n4. Add Christ-centered layer to your map", type: "exercise", duration: "20 min", icon: "✝️" },
        { id: "v2-w3-a16", title: "Gems: Voyage Gems", description: "Collect gems from Acts 27 mapping", detailedInstructions: "1. Go to Gems Room\n2. Voyage gems:\n   - Gem: 276 people saved because of ONE faithful man\n   - Gem: Breaking bread in crisis (v35) - worship first\n   - Gem: 'Not a hair from your head will be lost' (v34) - total care\n3. Each gem gets a visual anchor", type: "exercise", duration: "20 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "v2-w3-a17", title: "Community: Share Your Best Map", description: "Post your voyage map", detailedInstructions: "1. Go to Community\n2. Post: 'Acts 27 Visual Map'\n3. Share:\n   - Your geographic map OR dramatic arc\n   - Key insight from mapping\n   - How mapping enhanced understanding\n4. Comment on others' maps", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "v2-w3-a18", title: "Alternative Route Meditation", description: "Imagine if Paul had listened at Fair Havens", detailedInstructions: "1. Acts 27:10 - Paul warned them\n2. Draw an ALTERNATE MAP:\n   - What if they stayed at Fair Havens?\n   - Different route, different story\n3. Sanctified imagination: What could have been vs. what was\n4. God still saved them despite poor choice!", type: "exercise", duration: "15 min", icon: "🤔" },
        { id: "v2-w3-a19", title: "Growth Journal: Mapping Reflection", description: "Reflect on scene mapping method", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 3 - Scene Mapping Reflection'\n3. Answer:\n   - How did mapping change my reading?\n   - What narrative details did I catch?\n   - How can I apply this to other stories?\n   - What's my next mapping project?", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "v2-w3-a20", title: "Map Quiz: Test Your Acts 27 Knowledge", description: "Quiz yourself using only maps", detailedInstructions: "1. Close Bible and notes\n2. Using ONLY maps, answer:\n   - How many people on board?\n   - What island did they land on?\n   - What did Paul do before shipwreck?\n   - How long was the storm?\n3. Maps should give you all answers!", type: "reflection", duration: "15 min", icon: "❓" },
        { id: "v2-w3-a21", title: "Milestone: Complete Map Set", description: "Verify your mapping toolkit", detailedInstructions: "1. Check your Acts 27 study includes:\n   - Complete geographic map\n   - Dramatic arc graph\n   - Character positions\n   - Symbol connections\n   - Christ connection\n2. You now have a VISUAL MAPPING method!\n3. Check Achievements\n4. Week 4 synthesizes all skills!", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Create comprehensive map set for Acts 27 with geographic, dramatic, and thematic layers",
    },
    {
      weekNumber: 4,
      title: "Visual Evidence Boards",
      focus: "Synthesize all visual investigation methods into detective-style boards",
      scripture: "Daniel 2 (Nebuchadnezzar's Dream)",
      activities: [
        { id: "v2-w4-a1", title: "Evidence Board Method Review", description: "Understand how evidence boards synthesize investigation", detailedInstructions: "1. An EVIDENCE BOARD is a detective's wall\n2. It combines:\n   - Sketches (Week 1)\n   - Symbols (Week 2)\n   - Maps (Week 3)\n   - Plus: Timeline, connections, conclusions\n3. This week: Build a complete board for Daniel 2\n4. This is visual investigation at its fullest", type: "reading", duration: "15 min", icon: "📋" },
        { id: "v2-w4-a2", title: "Read Daniel 2:1-23 - The Setup", description: "Read and sketch the crisis and prayer", detailedInstructions: "1. Read Daniel 2:1-23\n2. SKETCH:\n   - Nebuchadnezzar's troubled sleep (v1)\n   - Wise men's terror (v10-11)\n   - Daniel and friends praying (v17-18)\n   - Daniel praising God (v19-23)\n3. Note: Dream not yet revealed!\n4. This is DRAMA before revelation", type: "reading", duration: "25 min", link: "/bible/Daniel/2", icon: "😰", specificVerse: "Daniel 2:1-23" },
        { id: "v2-w4-a3", title: "Read Daniel 2:24-35 - The Dream", description: "Sketch the great statue in detail", detailedInstructions: "1. Read Daniel 2:24-35\n2. DRAW THE STATUE:\n   - Head: Gold (draw bright)\n   - Chest/Arms: Silver\n   - Belly/Thighs: Bronze\n   - Legs: Iron\n   - Feet: Iron + Clay (draw cracks!)\n3. Add the STONE:\n   - Cut without hands\n   - Strikes feet\n   - Becomes mountain\n4. This is the MAIN VISUAL of Daniel 2", type: "reading", duration: "30 min", link: "/bible/Daniel/2", icon: "🗿", specificVerse: "Daniel 2:24-35" },
        { id: "v2-w4-a4", title: "Read Daniel 2:36-45 - The Interpretation", description: "Label your statue with kingdom names", detailedInstructions: "1. Read Daniel 2:36-45\n2. LABEL YOUR STATUE:\n   - Head: BABYLON (v38) 'You are this head'\n   - Chest: MEDO-PERSIA (v39a) 'inferior'\n   - Belly: GREECE (v39b)\n   - Legs: ROME (v40)\n   - Feet: DIVIDED EUROPE (v41-43)\n   - Stone: GOD'S ETERNAL KINGDOM (v44)\n3. Your statue is now a PROPHECY CHART", type: "reading", duration: "25 min", link: "/bible/Daniel/2", icon: "📜", specificVerse: "Daniel 2:36-45" },
        { id: "v2-w4-a5", title: "Encyclopedia: Daniel 2 Fulfillment", description: "Research historical fulfillment", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Daniel 2' or 'Nebuchadnezzar statue'\n3. Add HISTORICAL DATES to your statue:\n   - Babylon: 605-539 BC\n   - Medo-Persia: 539-331 BC\n   - Greece: 331-168 BC\n   - Rome: 168 BC - 476 AD\n   - Divided nations: 476 AD - present\n4. Prophecy fulfilled EXACTLY as drawn!", type: "reading", duration: "20 min", link: "/encyclopedia", icon: "📚" },
        { id: "v2-w4-a6", title: "Daily Verse: Evidence Connection", description: "Connect today's verse to your evidence board", detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. Could this verse connect to Daniel 2?\n4. If not, what evidence board would it fit?\n5. Train yourself to see connections", type: "reading", duration: "10 min", link: "/daily-verse", icon: "✨" },
        { id: "v2-w4-a7", title: "Symbol Analysis: Statue Materials", description: "Study the symbolism of each material", detailedInstructions: "1. Add to your symbol library: METALS\n2. Draw and note:\n   - Gold = most valuable, first\n   - Silver = less value, second\n   - Bronze = warfare (Greek warfare famous)\n   - Iron = strength (Rome's iron legions)\n   - Clay = weakness, instability\n3. Metals DECREASE in value but INCREASE in strength until feet", type: "drill", duration: "25 min", icon: "🥇" },
        { id: "v2-w4-a8", title: "Parallel: Daniel 7 Quick Comparison", description: "Sketch Daniel 7 alongside Daniel 2", detailedInstructions: "1. Read Daniel 7:1-14 quickly\n2. Create PARALLEL SKETCH:\n   - Daniel 2: Statue (human view)\n   - Daniel 7: Beasts (God's view)\n3. Same kingdoms, different images!\n   - Lion = Babylon = Gold\n   - Bear = Medo-Persia = Silver\n   - Leopard = Greece = Bronze\n   - Terrible beast = Rome = Iron\n4. Draw both side by side", type: "drill", duration: "30 min", icon: "🦁" },
        { id: "v2-w4-a9", title: "Training Drill: Prophecy Basics", description: "Test your Daniel 2 visual knowledge", detailedInstructions: "1. Go to Training Drills\n2. Find prophecy or Daniel related drill\n3. Answer using your evidence board\n4. Visual prophecy charts = clear answers\n5. Score 80%+", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
        { id: "v2-w4-a10", title: "Daily Challenge: Prophecy Theme", description: "Complete challenge with prophecy perspective", detailedInstructions: "1. Go to Daily Challenges\n2. Apply Daniel 2 themes:\n   - God reveals secrets\n   - History follows God's plan\n   - Christ's kingdom destroys all others\n3. Use visual evidence in answers\n4. Review feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "v2-w4-a11", title: "Timeline Creation", description: "Create visual timeline of Daniel 2 kingdoms", detailedInstructions: "1. Draw a HORIZONTAL TIMELINE\n2. Mark key dates:\n   - 605 BC: Dream given\n   - 539 BC: Babylon falls\n   - 331 BC: Persia falls to Greece\n   - 168 BC: Greece falls to Rome\n   - 476 AD: Rome fragments\n   - FUTURE: Stone = Christ's return\n3. Timeline + statue = complete prophecy visual", type: "drill", duration: "25 min", icon: "📅" },
        { id: "v2-w4-a12", title: "Flashcards: Kingdom Sequence", description: "Create flashcards for instant recall", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Daniel 2 Kingdoms'\n3. Cards:\n   - Metal → Kingdom\n   - Kingdom → Dates\n   - Body part → Metal\n   - Daniel 7 beast → Daniel 2 equivalent\n4. Master for instant prophecy recall", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
        { id: "v2-w4-a13", title: "Card Deck: Stone Kingdom Study", description: "Deep dive on the stone/mountain", detailedInstructions: "1. Go to Card Deck\n2. Enter Daniel 2:44 as verse\n3. Explore the STONE:\n   - Cut without hands = supernatural\n   - Breaks statue = destroys worldly powers\n   - Becomes mountain = fills earth\n4. This is CHRIST'S KINGDOM visualized", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
        { id: "v2-w4-a14", title: "Create Evidence Board: Daniel 2 Complete", description: "Build your full evidence board", detailedInstructions: "1. Go to My Studies\n2. Create: 'Daniel 2 Evidence Board'\n3. Include:\n   - Main statue drawing (labeled)\n   - Timeline underneath\n   - Daniel 7 parallel sketch\n   - Symbol analysis notes\n   - Historical dates\n   - Christ connection (stone = Christ)\n4. This is DETECTIVE-STYLE Bible study!", type: "exercise", duration: "30 min", link: "/my-studies", icon: "📝" },
        { id: "v2-w4-a15", title: "Christ Connection: The Stone", description: "Create visual showing Christ as the stone", detailedInstructions: "1. The STONE is CHRIST:\n   - Isaiah 28:16 - 'cornerstone'\n   - Matthew 21:44 - stone that crushes\n   - 1 Peter 2:4-8 - living stone\n2. Create a visual:\n   - Stone with Jesus' face/cross\n   - Breaking the statue\n   - Growing into mountain = His kingdom\n3. Christ is the answer to history!", type: "exercise", duration: "25 min", icon: "✝️" },
        { id: "v2-w4-a16", title: "Gems: Prophecy Gems", description: "Collect gems from Daniel 2", detailedInstructions: "1. Go to Gems Room\n2. Daniel 2 gems:\n   - Gem: God REVEALS secrets (v28) - prophecy proves His sovereignty\n   - Gem: Metals decrease in value = moral decline of kingdoms\n   - Gem: Feet = Europe never reunited (v43) - still true today!\n   - Gem: 'In the days of these kings' (v44) = Christ comes during divided phase\n3. Visual gems = prophecy gems!", type: "exercise", duration: "20 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "v2-w4-a17", title: "Community: Share Your Evidence Board", description: "Post your Daniel 2 evidence board", detailedInstructions: "1. Go to Community\n2. Post: 'Daniel 2 Visual Evidence Board'\n3. Share:\n   - Your statue drawing\n   - One key insight\n   - How visual study made prophecy clearer\n4. This is evangelistic material!", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "v2-w4-a18", title: "Month 2 Integration: All Methods", description: "Review how all 4 weeks connect", detailedInstructions: "1. Your visual investigation toolkit now includes:\n   - Week 1: Observation sketching (Luke 15)\n   - Week 2: Symbol library (John 10)\n   - Week 3: Scene mapping (Acts 27)\n   - Week 4: Evidence boards (Daniel 2)\n2. Create a ONE-PAGE summary of your methods\n3. You're a visual detective of Scripture!", type: "exercise", duration: "20 min", icon: "🔄" },
        { id: "v2-w4-a19", title: "Growth Journal: Month 2 Reflection", description: "Reflect on your visual investigation journey", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Month 2 - Visual Investigation Complete'\n3. Answer:\n   - What's my strongest visual method?\n   - How has visual investigation changed my study?\n   - What passage do I want to investigate next?\n   - What's my biggest insight from Month 2?\n4. Prepare for Month 2 Gate Assessment", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "v2-w4-a20", title: "Gate Prep: Portfolio Review", description: "Prepare your visual portfolio for assessment", detailedInstructions: "1. Review your Month 2 creations:\n   - Luke 15 evidence board\n   - Symbol library pages\n   - Acts 27 map set\n   - Daniel 2 evidence board\n2. Choose your BEST work to present\n3. Gate Assessment will test visual investigation skills", type: "reflection", duration: "15 min", icon: "📁" },
        { id: "v2-w4-a21", title: "Milestone: Visual Investigator Certified", description: "Final check before Gate Assessment", detailedInstructions: "1. Can you:\n   - Create observation sketches from any passage?\n   - Identify and draw biblical symbols?\n   - Map any Bible story geographically and dramatically?\n   - Build an evidence board with all elements?\n2. You're a VISUAL INVESTIGATOR!\n3. Check Achievements\n4. Gate Assessment awaits!", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Create comprehensive Daniel 2 evidence board with statue, timeline, parallels, and Christ connection",
    },
  ],
  gateAssessment: "Present your Month 2 visual investigation portfolio showing mastery of observation sketching, symbol identification, scene mapping, and evidence board creation. Demonstrate how visual methods reveal Christ in Scripture.",
};

// ============================================
// MONTH 2: ANALYTICAL PATH - 75 Questions Mastery
// ============================================
export const analyticalPathMonth2: MonthCurriculum = {
  month: 2,
  title: "Questions Mastery",
  theme: "The 75 Questions Deep Dive Method",
  weeks: [
    {
      weekNumber: 1,
      title: "Intratextual Questions",
      focus: "Master questions INSIDE the text itself",
      scripture: "Romans 3:21-26",
      activities: [
        { id: "a2-w1-a1", title: "Questions Room Introduction", description: "Learn the 75 questions method", detailedInstructions: "1. Go to Palace > Floor 2 > Questions Room\n2. Read the complete method guide\n3. KEY: 75 questions per passage (25 each category)\n4. Categories:\n   - Intratextual (inside this text)\n   - Intertextual (across Scripture)\n   - Phototheological (PT system)\n5. This week: INTRATEXTUAL mastery", type: "reading", duration: "15 min", roomCode: "QR", link: "/palace/floor/2/room/qr", icon: "❓", lookFor: ["The 25 question types", "How questions reveal hidden meaning", "Why quantity matters for quality"] },
        { id: "a2-w1-a2", title: "Read Romans 3:21-26 - First Pass", description: "Read the passage without questions first", detailedInstructions: "1. Read Romans 3:21-26 three times\n2. First read: Just absorb\n3. Second read: Note difficult words\n4. Third read: Note structure\n5. This is 'the heart of the gospel'\n6. It's dense - that's why we need questions!", type: "reading", duration: "20 min", link: "/bible/Romans/3", icon: "📖", specificVerse: "Romans 3:21-26", lookFor: ["'But now' - transition signal", "'Apart from law' - key phrase", "The repeated word 'righteousness'"] },
        { id: "a2-w1-a3", title: "Intratextual Questions: WHO", description: "Ask all WHO questions about this passage", detailedInstructions: "1. Write WHO questions:\n   - Who is 'all' in v23?\n   - Who is justified (v24)?\n   - Who set forth Christ (v25)?\n   - Who believes (v26)?\n   - Who is the 'just' and 'justifier' (v26)?\n2. Goal: 5+ WHO questions minimum\n3. Each question MUST come from the text itself", type: "reading", duration: "20 min", icon: "👤" },
        { id: "a2-w1-a4", title: "Intratextual Questions: WHAT", description: "Ask all WHAT questions about this passage", detailedInstructions: "1. Write WHAT questions:\n   - What is 'the righteousness of God' (v21)?\n   - What do 'law and prophets' witness (v21)?\n   - What does 'justified freely' mean (v24)?\n   - What is 'propitiation' (v25)?\n   - What is the 'remission of sins that are past' (v25)?\n2. Goal: 5+ WHAT questions\n3. Don't answer yet - just QUESTION!", type: "reading", duration: "20 min", icon: "📝" },
        { id: "a2-w1-a5", title: "Intratextual Questions: WHY/HOW", description: "Ask WHY and HOW questions", detailedInstructions: "1. Write WHY/HOW questions:\n   - Why 'apart from law' (v21)?\n   - How is justification 'freely' (v24)?\n   - Why was propitiation 'through faith in his blood' (v25)?\n   - How does this 'declare his righteousness' (v25)?\n   - Why mention 'forbearance of God' (v25)?\n2. Goal: 5+ WHY/HOW questions\n3. These reveal logic and purpose", type: "reading", duration: "20 min", icon: "🤔" },
        { id: "a2-w1-a6", title: "Def-Com Room: Key Terms", description: "Define technical terms in the passage", detailedInstructions: "1. Go to Palace > Floor 2 > Def-Com Room\n2. Define (use concordance/lexicon):\n   - Righteousness (dikaiosyne)\n   - Justified (dikaioo)\n   - Freely (dorean)\n   - Grace (charis)\n   - Redemption (apolutrosis)\n   - Propitiation (hilasterion)\n3. Greek definitions deepen questions!", type: "reading", duration: "25 min", roomCode: "DC", link: "/palace/floor/2/room/dc", icon: "📚" },
        { id: "a2-w1-a7", title: "Daily Verse: Question Generation", description: "Practice intratextual questions on daily verse", detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. Write 5 intratextual questions:\n   - WHO, WHAT, WHEN, WHERE, WHY, HOW?\n4. This builds question-asking as reflex\n5. Daily practice = mastery", type: "drill", duration: "15 min", link: "/daily-verse", icon: "✨" },
        { id: "a2-w1-a8", title: "Training Drill: Questions Room", description: "Complete official Questions Room drill", detailedInstructions: "1. Go to Training Drills\n2. Select 'Questions Room' drill\n3. Test your question-generating ability\n4. Score 80%+\n5. Review weak areas", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
        { id: "a2-w1-a9", title: "Question Quality Check", description: "Evaluate your questions against criteria", detailedInstructions: "1. Review your Romans 3:21-26 questions\n2. Quality criteria:\n   - Does it come FROM the text?\n   - Does it require thought to answer?\n   - Does it reveal something not obvious?\n   - Does it have an answer in Scripture?\n3. Mark A/B/C quality\n4. Improve C-level questions", type: "drill", duration: "20 min", icon: "📊" },
        { id: "a2-w1-a10", title: "Daily Challenge: Analytical Response", description: "Complete challenge using question method", detailedInstructions: "1. Go to Daily Challenges\n2. Before answering, list 3 questions\n3. Answer using your analytical method\n4. Show your detective work\n5. Review AI feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "a2-w1-a11", title: "Card Deck: Question Exploration", description: "Use Card Deck to answer your questions", detailedInstructions: "1. Go to Card Deck\n2. Enter Romans 3:25 as verse\n3. Use cards to explore answers:\n   - Each card may answer a question\n   - Or generate new ones\n4. Document question → answer chains", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
        { id: "a2-w1-a12", title: "Structure Questions", description: "Ask questions about text structure", detailedInstructions: "1. Structural questions:\n   - Why does Paul start with 'But now'?\n   - How many times is 'righteousness' used?\n   - What's the climax of the passage?\n   - How does v21 connect to v26?\n   - What's the 'purpose clause' (v26)?\n2. Structure reveals author intent", type: "drill", duration: "20 min", icon: "🏗️" },
        { id: "a2-w1-a13", title: "Encyclopedia: Romans 3 Context", description: "Research background to answer questions", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Romans' or 'Justification'\n3. Find answers to your toughest questions\n4. Note which questions required research\n5. Document: Question + Source + Answer", type: "drill", duration: "20 min", link: "/encyclopedia", icon: "📚" },
        { id: "a2-w1-a14", title: "Create Study: Intratextual Question Bank", description: "Document your 25+ intratextual questions", detailedInstructions: "1. Go to My Study Room\n2. Create: 'Romans 3:21-26 - Intratextual Questions'\n3. List ALL questions (25 minimum):\n   - Categorize by type (WHO, WHAT, WHY, etc.)\n   - Note quality rating\n   - Add any answers found\n4. This is your question BANK", type: "exercise", duration: "30 min", link: "/my-study-room", icon: "📝" },
        { id: "a2-w1-a15", title: "Question → Observation Connection", description: "Show how questions become observations", detailedInstructions: "1. Take your TOP 10 questions\n2. For each, write the OBSERVATION it reveals:\n   - Question: Why 'apart from law'?\n   - Observation: Righteousness comes differently than law!\n3. Questions DRIVE observation\n4. Document the transformation", type: "exercise", duration: "25 min", icon: "🔄" },
        { id: "a2-w1-a16", title: "Gems: Question-Generated Gems", description: "Collect gems that emerged from questions", detailedInstructions: "1. Go to Gems Room\n2. Which questions revealed GEMS?\n   - Gem from 'propitiation': Jesus is the mercy seat!\n   - Gem from 'redemption': We were slaves bought free\n   - Gem from 'freely': Grace costs us nothing\n3. Questions mine gems from text", type: "exercise", duration: "20 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "a2-w1-a17", title: "Community: Share Your Questions", description: "Post your best intratextual questions", detailedInstructions: "1. Go to Community\n2. Post: 'Romans 3:21-26 - Questions That Opened the Text'\n3. Share 5 of your best questions\n4. Explain what each revealed\n5. Learn from others' questions", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "a2-w1-a18", title: "Unanswered Questions Log", description: "Track questions needing more study", detailedInstructions: "1. Review all your questions\n2. Which remain UNANSWERED?\n3. Create an 'Unanswered' log:\n   - Question\n   - Why it's hard\n   - Possible resources to check\n4. Unanswered questions = future study goals", type: "exercise", duration: "15 min", icon: "📋" },
        { id: "a2-w1-a19", title: "Growth Journal: Question Method Reflection", description: "Reflect on intratextual questioning", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 1 - Intratextual Questions Reflection'\n3. Answer:\n   - How many questions did I generate?\n   - Which question types were hardest?\n   - What did questions reveal that reading missed?\n   - How will I use this method going forward?", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "a2-w1-a20", title: "Question Speed Drill", description: "Practice rapid question generation", detailedInstructions: "1. Pick a NEW passage (e.g., John 1:1-5)\n2. Set timer for 5 minutes\n3. Generate as many intratextual questions as possible\n4. Goal: 15+ questions in 5 minutes\n5. Speed builds questioning reflex", type: "reflection", duration: "15 min", icon: "⏱️" },
        { id: "a2-w1-a21", title: "Milestone: 25 Intratextual Questions", description: "Verify your question bank is complete", detailedInstructions: "1. Count your Romans 3:21-26 questions\n2. Must have 25+ intratextual questions\n3. Categories should include:\n   - WHO, WHAT, WHEN, WHERE, WHY, HOW\n   - Definition questions\n   - Structure questions\n4. Week 2 adds INTERTEXTUAL questions\n5. Check Achievements", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Generate 25+ quality intratextual questions for Romans 3:21-26",
    },
    {
      weekNumber: 2,
      title: "Intertextual Questions",
      focus: "Master questions ACROSS Scripture",
      scripture: "Romans 3:21-26 (with cross-references)",
      activities: [
        { id: "a2-w2-a1", title: "Intertextual Questions Introduction", description: "Learn to question across the whole Bible", detailedInstructions: "1. Intertextual = BETWEEN texts\n2. These questions connect passages to other passages\n3. Types:\n   - Where else does this appear?\n   - What other passage explains this?\n   - What OT text is this quoting/echoing?\n   - What parallel passage exists?\n4. Scripture interprets Scripture!", type: "reading", duration: "15 min", icon: "🔗" },
        { id: "a2-w2-a2", title: "Romans 3:21 - OT Witness Hunt", description: "Find 'law and prophets' witnesses", detailedInstructions: "1. Romans 3:21: 'witnessed by the law and the prophets'\n2. QUESTION: Which OT texts witness to this?\n3. Research:\n   - Genesis 15:6 (Abraham believed → righteousness)\n   - Habakkuk 2:4 (the just shall live by faith)\n   - Isaiah 53 (suffering servant)\n   - Psalm 32:1-2 (blessed is the forgiven)\n4. Document each connection", type: "reading", duration: "25 min", icon: "📜" },
        { id: "a2-w2-a3", title: "Romans 3:25 - Propitiation Study", description: "Cross-reference propitiation/mercy seat", detailedInstructions: "1. QUESTION: Where else is propitiation/hilasterion used?\n2. Cross-references:\n   - Leviticus 16 (Day of Atonement mercy seat)\n   - Hebrews 9:5 (mercy seat in tabernacle)\n   - 1 John 2:2 (Christ IS the propitiation)\n   - 1 John 4:10 (God sent Him as propitiation)\n3. The mercy seat = where God meets sinners!", type: "reading", duration: "25 min", icon: "✝️" },
        { id: "a2-w2-a4", title: "Romans 3:23 - 'All Sinned' Connection", description: "Trace 'all have sinned' across Scripture", detailedInstructions: "1. QUESTION: How does Scripture prove 'all have sinned'?\n2. Cross-references:\n   - Romans 5:12 (sin entered through Adam)\n   - Psalm 51:5 (born in iniquity)\n   - Ecclesiastes 7:20 (not a just man who sins not)\n   - Isaiah 53:6 (ALL we like sheep)\n   - Romans 3:10-18 (quotation chain from Psalms)\n3. The 'all' is comprehensive!", type: "reading", duration: "20 min", icon: "👥" },
        { id: "a2-w2-a5", title: "Romans 3:24 - Redemption Trace", description: "Follow 'redemption' through Scripture", detailedInstructions: "1. QUESTION: How is redemption pictured in Scripture?\n2. Cross-references:\n   - Exodus 6:6 (redeemed from Egypt)\n   - Ruth 4 (kinsman redeemer)\n   - Psalm 130:7-8 (plenteous redemption)\n   - Ephesians 1:7 (redemption through blood)\n   - Colossians 1:14 (redemption = forgiveness)\n3. Redemption = bought from slavery", type: "reading", duration: "20 min", icon: "💰" },
        { id: "a2-w2-a6", title: "Q&A Internship Room: Chain Building", description: "Learn to build verse chains for answers", detailedInstructions: "1. Go to Palace > Floor 2 > Q&A Internship Room\n2. Learn the chain method:\n   - Question → Scripture A → Scripture B → Answer\n3. Build a chain for 'justification':\n   - Romans 3:24 → Romans 5:1 → Galatians 2:16\n4. Chains = scriptural proof", type: "reading", duration: "20 min", roomCode: "QA", link: "/palace/floor/2/room/qa", icon: "⛓️" },
        { id: "a2-w2-a7", title: "Daily Verse: Intertextual Practice", description: "Generate intertextual questions for daily verse", detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. Ask 3 intertextual questions:\n   - Where else does this word appear?\n   - What parallel exists?\n   - What OT background?\n4. Daily intertextual practice builds Bible-wide thinking", type: "drill", duration: "15 min", link: "/daily-verse", icon: "✨" },
        { id: "a2-w2-a8", title: "Training Drill: Cross-Reference Skills", description: "Test your cross-referencing ability", detailedInstructions: "1. Go to Training Drills\n2. Select any cross-reference drill\n3. Your intertextual skills are being tested\n4. Score 80%+\n5. Note areas for improvement", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
        { id: "a2-w2-a9", title: "Romans 4:1-8 Connection", description: "See how Romans 4 answers Romans 3 questions", detailedInstructions: "1. Read Romans 4:1-8\n2. QUESTION: How does Paul prove his Romans 3 argument?\n3. He uses ABRAHAM (Gen 15:6) and DAVID (Psalm 32)\n4. Document how Romans 4 answers Romans 3 questions\n5. Context chapters answer context questions!", type: "drill", duration: "20 min", link: "/bible/Romans/4", icon: "📖" },
        { id: "a2-w2-a10", title: "Daily Challenge: Connected Response", description: "Complete challenge showing cross-references", detailedInstructions: "1. Go to Daily Challenges\n2. Answer by citing MULTIPLE passages\n3. Show how Scripture interprets Scripture\n4. Demonstrate intertextual method\n5. Review AI feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "a2-w2-a11", title: "Galatians Parallel Study", description: "Compare Romans 3 with Galatians 2-3", detailedInstructions: "1. Read Galatians 2:16-21 and 3:6-14\n2. QUESTIONS:\n   - What phrases match Romans 3:21-26?\n   - What does Galatians add?\n   - How do they complement?\n3. Paul taught the same truth multiple ways!", type: "drill", duration: "25 min", icon: "📊" },
        { id: "a2-w2-a12", title: "Encyclopedia: Justification Doctrine", description: "Research intertextual connections systematically", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Justification by Faith'\n3. Note all Scripture references given\n4. Add any new cross-references to your study\n5. Encyclopedia = systematic intertextual resource", type: "drill", duration: "20 min", link: "/encyclopedia", icon: "📚" },
        { id: "a2-w2-a13", title: "Card Deck: Cross-Reference Exploration", description: "Use cards to find connections", detailedInstructions: "1. Go to Card Deck\n2. Enter Romans 3:24\n3. Each card = potential intertextual connection\n4. Document new cross-references discovered\n5. Cards help systematic exploration", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
        { id: "a2-w2-a14", title: "Create Study: Intertextual Question Bank", description: "Document your 25+ intertextual questions", detailedInstructions: "1. Go to My Study Room\n2. Add to your Romans 3 study:\n3. 'Intertextual Questions' section:\n   - 25+ questions linking to other passages\n   - For each: the cross-reference found\n   - Brief answer summary\n4. Now you have 50+ total questions!", type: "exercise", duration: "30 min", link: "/my-study-room", icon: "📝" },
        { id: "a2-w2-a15", title: "Verse Chain: Faith → Righteousness", description: "Build a complete verse chain", detailedInstructions: "1. Build a chain on FAITH → RIGHTEOUSNESS:\n   - Genesis 15:6 (believed → righteousness)\n   - Habakkuk 2:4 (just live by faith)\n   - Romans 1:17 (righteous by faith)\n   - Romans 3:22 (righteousness through faith)\n   - Romans 4:5 (faith counted as righteousness)\n   - Galatians 3:6 (Abraham's faith)\n2. Draw the chain visually", type: "exercise", duration: "25 min", icon: "⛓️" },
        { id: "a2-w2-a16", title: "Gems: Intertextual Gems", description: "Collect gems from cross-reference study", detailedInstructions: "1. Go to Gems Room\n2. Intertextual gems:\n   - Gem: Romans 3:25 'hilasterion' = Leviticus 16 mercy seat (Jesus IS the mercy seat!)\n   - Gem: 'Law and prophets witness' = entire OT pointed here\n   - Gem: Romans 4 uses Abraham as PROOF of Romans 3\n3. Cross-references reveal depth", type: "exercise", duration: "20 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "a2-w2-a17", title: "Community: Share Cross-Reference Chain", description: "Post your best verse chain", detailedInstructions: "1. Go to Community\n2. Post: 'Faith → Righteousness Chain'\n3. Share:\n   - Your complete chain\n   - What it proves\n   - How you found it\n4. Learn from others' chains", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "a2-w2-a18", title: "Flashcards: Cross-Reference Pairs", description: "Create flashcards for key cross-references", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Romans 3 Cross-References'\n3. Cards:\n   - Front: Romans verse\n   - Back: Key cross-reference(s)\n4. Master for instant cross-reference recall", type: "exercise", duration: "20 min", link: "/flashcards", icon: "📇" },
        { id: "a2-w2-a19", title: "Growth Journal: Intertextual Reflection", description: "Reflect on cross-reference questioning", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 2 - Intertextual Questions Reflection'\n3. Answer:\n   - How many cross-references did I find?\n   - Which connection surprised me most?\n   - How does Scripture interpret Scripture?\n   - What's my richest verse chain?", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "a2-w2-a20", title: "Intertextual Speed Test", description: "Practice rapid cross-referencing", detailedInstructions: "1. Pick a NEW passage (e.g., Ephesians 2:8-9)\n2. Set timer for 5 minutes\n3. Generate as many cross-references as possible\n4. Goal: 10+ cross-references in 5 minutes\n5. Speed builds Bible-wide thinking", type: "reflection", duration: "15 min", icon: "⏱️" },
        { id: "a2-w2-a21", title: "Milestone: 25 Intertextual Questions", description: "Verify your intertextual bank is complete", detailedInstructions: "1. Count your intertextual questions\n2. Must have 25+\n3. Each should include:\n   - The question\n   - Cross-reference(s)\n   - Brief answer\n4. Combined with Week 1: 50+ questions!\n5. Week 3 adds PT questions\n6. Check Achievements", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Generate 25+ quality intertextual questions with cross-references for Romans 3:21-26",
    },
    {
      weekNumber: 3,
      title: "Phototheological Questions",
      focus: "Master questions from the PT system perspective",
      scripture: "Romans 3:21-26 (PT Analysis)",
      activities: [
        { id: "a2-w3-a1", title: "Phototheological Questions Introduction", description: "Learn to question through the PT lens", detailedInstructions: "1. Phototheological questions ask:\n   - Which PT ROOM applies here?\n   - Which PT FLOOR does this connect to?\n   - Which CYCLE does this belong to?\n   - Which EXPANSION does this train?\n   - Which ASCENSION level is this?\n2. PT questions organize all other questions!\n3. They ensure Christ-centered, systematic study", type: "reading", duration: "15 min", icon: "🏛️" },
        { id: "a2-w3-a2", title: "Floor Questions: Romans 3:21-26", description: "Ask which floors apply to this passage", detailedInstructions: "1. Ask FLOOR questions:\n   - Floor 1 (Furnishing): What story/image captures this?\n   - Floor 2 (Investigation): What definitions needed?\n   - Floor 3 (Freestyle): What modern parallel?\n   - Floor 4 (Next Level): Where's Christ? What's the dimension?\n   - Floor 5 (Vision): Sanctuary connection?\n2. Document floor by floor analysis", type: "reading", duration: "25 min", icon: "🏢" },
        { id: "a2-w3-a3", title: "Room Questions: Specific Applications", description: "Ask which specific rooms apply", detailedInstructions: "1. Ask ROOM questions for Romans 3:21-26:\n   - Story Room: What narrative does this explain?\n   - Translation Room: What's the key image (propitiation = mercy seat!)?\n   - Def-Com Room: Which Greek terms need study?\n   - Concentration Room: How is Christ central?\n   - Theme Room: Which wall? (Gospel Floor!)\n2. Document room codes for the passage", type: "reading", duration: "25 min", icon: "🚪" },
        { id: "a2-w3-a4", title: "Cycle Questions: Historical Placement", description: "Ask where this fits in salvation history", detailedInstructions: "1. Ask CYCLE questions:\n   - Which covenant cycle is Paul explaining? (@CyC - Cyrus-Christ!)\n   - How does this connect to @Mo (Mosaic - law given)?\n   - How does this fulfill @Ab (Abraham - faith righteousness)?\n   - How does this apply to @Sp (Spirit - church age)?\n2. Romans 3 explains how cycles CONNECT", type: "reading", duration: "25 min", icon: "🔄" },
        { id: "a2-w3-a5", title: "Heaven Questions: Horizon Placement", description: "Ask about the three heavens framework", detailedInstructions: "1. Ask HEAVEN questions:\n   - Is this DoL¹ (Babylon), DoL² (70 AD), or DoL³ (final)?\n   - Romans 3 operates in 2H - the church age\n   - But it EXPLAINS how 1H pointed forward\n   - And promises 3H fulfillment\n2. Where does justification FIT in the heavens?", type: "reading", duration: "20 min", icon: "☁️" },
        { id: "a2-w3-a6", title: "Expansion Questions: Study Dimensions", description: "Ask how this passage trains each expansion", detailedInstructions: "1. Ask EXPANSION questions:\n   - Width: What memory/content does this add?\n   - Time: How do I apply this today?\n   - Depth: What deeper theology is here?\n   - Height: How does this transform my heart?\n2. Romans 3:21-26 is DEPTH-heavy (theology)\n3. But how can you make it HEIGHT (experiential)?", type: "reading", duration: "20 min", icon: "📐" },
        { id: "a2-w3-a7", title: "Daily Verse: PT Framework Questions", description: "Apply PT questions to daily verse", detailedInstructions: "1. Go to Daily Verse\n2. Ask PT questions:\n   - What floor/room?\n   - What cycle?\n   - What expansion?\n3. This builds PT-thinking reflex", type: "drill", duration: "15 min", link: "/daily-verse", icon: "✨" },
        { id: "a2-w3-a8", title: "Concentration Room Application", description: "Deep dive on Christ-centeredness", detailedInstructions: "1. Go to Palace > Floor 4 > Concentration Room\n2. Review the method\n3. Apply to Romans 3:21-26:\n   - Christ is the propitiation (v25)\n   - Christ's blood is the basis (v25)\n   - Christ makes God both just AND justifier (v26)\n4. The passage IS about Christ!", type: "drill", duration: "20 min", roomCode: "CR", link: "/palace/floor/4/room/cr", icon: "✝️" },
        { id: "a2-w3-a9", title: "Dimensions Room Application", description: "Apply 5 dimensions to the passage", detailedInstructions: "1. Go to Palace > Floor 4 > Dimensions Room\n2. Apply 5 dimensions:\n   - Literal: Paul's theological argument\n   - Christ: Jesus as propitiation, justifier\n   - Me: I am justified freely by grace!\n   - Church: The basis of our fellowship\n   - Heaven: Future glorification assured\n3. Document all 5 dimensions", type: "drill", duration: "20 min", roomCode: "DR", link: "/palace/floor/4/room/dr", icon: "🌐" },
        { id: "a2-w3-a10", title: "Daily Challenge: PT Framework Response", description: "Use PT language in challenge response", detailedInstructions: "1. Go to Daily Challenges\n2. Reference PT codes in your answer:\n   - 'This connects to CR (Concentration Room)...'\n   - 'Applying the @CyC cycle...'\n3. Show systematic analytical thinking\n4. Review AI feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "a2-w3-a11", title: "Theme Room: Gospel Floor Mapping", description: "Place Romans 3 on the PT walls", detailedInstructions: "1. Go to Palace > Floor 4 > Theme Room\n2. Romans 3:21-26 belongs to GOSPEL FLOOR:\n   - Justification\n   - Sanctification (implied)\n   - Glorification (promised)\n3. Also touches SANCTUARY WALL:\n   - Propitiation = mercy seat\n   - Blood = atonement\n4. Map the placement", type: "drill", duration: "20 min", roomCode: "TRm", link: "/palace/floor/4/room/trm", icon: "🧱" },
        { id: "a2-w3-a12", title: "Blue Room: Sanctuary Connection", description: "Connect to sanctuary typology", detailedInstructions: "1. Go to Palace > Floor 5 > Blue Room\n2. QUESTION: How does Romans 3:25 connect to sanctuary?\n   - Propitiation = hilasterion = MERCY SEAT\n   - Blood = Day of Atonement blood\n   - God's presence = above mercy seat\n3. Christ is the sanctuary FULFILLED", type: "drill", duration: "20 min", roomCode: "BL", link: "/palace/floor/5/room/bl", icon: "⛺" },
        { id: "a2-w3-a13", title: "Training Drill: PT Integration", description: "Test your PT framework application", detailedInstructions: "1. Go to Training Drills\n2. Select any PT-related drill\n3. Apply your analytical method\n4. Score 80%+\n5. Review and improve", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
        { id: "a2-w3-a14", title: "Create Study: PT Questions Bank", description: "Document your 25+ PT questions", detailedInstructions: "1. Go to My Study Room\n2. Add to your Romans 3 study:\n3. 'Phototheological Questions' section:\n   - Floor questions\n   - Room questions\n   - Cycle questions\n   - Heaven questions\n   - Expansion questions\n   - Dimension applications\n4. Now you have 75+ total questions!", type: "exercise", duration: "30 min", link: "/my-study-room", icon: "📝" },
        { id: "a2-w3-a15", title: "PT Codes Summary", description: "Create a PT code sheet for Romans 3:21-26", detailedInstructions: "1. Create a summary using PT codes:\n   - Romans 3:21-26\n   - Primary: CR (Christ), DR (Dimensions), BL (Sanctuary)\n   - Cycles: @Ab, @Mo, @CyC\n   - Heaven: 2H (DoL²/NE²)\n   - Theme: Gospel Floor, Sanctuary Wall\n2. This is analytical shorthand!", type: "exercise", duration: "20 min", icon: "📋" },
        { id: "a2-w3-a16", title: "Gems: PT Framework Gems", description: "Collect gems from PT analysis", detailedInstructions: "1. Go to Gems Room\n2. PT-generated gems:\n   - Gem: Romans 3:25 uses sanctuary language (hilasterion) = Christ IS the mercy seat\n   - Gem: 'Law and prophets' = @Ab and @Mo pointed to @CyC\n   - Gem: 'Just and justifier' solves Exodus 34:7 tension\n3. PT questions reveal systematic treasures", type: "exercise", duration: "20 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "a2-w3-a17", title: "Community: Share PT Analysis", description: "Post your PT framework for Romans 3", detailedInstructions: "1. Go to Community\n2. Post: 'Romans 3:21-26 through PT Lens'\n3. Share:\n   - Your PT codes\n   - Best PT-generated insight\n   - How PT organized your study\n4. Help others learn PT method", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "a2-w3-a18", title: "Ascension Practice", description: "Walk Romans 3:25 through 5 ascensions", detailedInstructions: "1. Take Romans 3:25 through ASCENSIONS:\n   - Asc-1 (Text): 'propitiation' definition\n   - Asc-2 (Chapter): Context in Romans 3 argument\n   - Asc-3 (Book): Role in Romans' gospel thesis\n   - Asc-4 (Cycle): @CyC fulfillment\n   - Asc-5 (Heaven): 2H application\n2. Document each level", type: "exercise", duration: "25 min", icon: "⬆️" },
        { id: "a2-w3-a19", title: "Growth Journal: PT Method Reflection", description: "Reflect on Phototheological questioning", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 3 - Phototheological Questions Reflection'\n3. Answer:\n   - How did PT questions organize my study?\n   - Which PT connections surprised me?\n   - How does PT ensure Christ-centrality?\n   - How will I use PT framework going forward?", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "a2-w3-a20", title: "PT Quick Code Test", description: "Test your ability to rapidly PT-code a passage", detailedInstructions: "1. Pick a NEW passage (e.g., John 3:16)\n2. Set timer for 3 minutes\n3. Assign:\n   - Primary rooms\n   - Cycle placement\n   - Heaven horizon\n   - Theme location\n4. Goal: Complete PT coding in 3 minutes", type: "reflection", duration: "15 min", icon: "⏱️" },
        { id: "a2-w3-a21", title: "Milestone: 75 Questions Complete", description: "Verify your complete question bank", detailedInstructions: "1. Count your total questions:\n   - 25+ Intratextual\n   - 25+ Intertextual\n   - 25+ Phototheological\n   - = 75+ TOTAL\n2. This is the 75 QUESTIONS METHOD!\n3. Week 4 integrates everything\n4. Check Achievements", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Generate 25+ quality Phototheological questions applying PT framework to Romans 3:21-26",
    },
    {
      weekNumber: 4,
      title: "Question Integration",
      focus: "Synthesize all 75 questions into comprehensive analysis",
      scripture: "Romans 3:21-26 (Complete Analysis)",
      activities: [
        { id: "a2-w4-a1", title: "Question Integration Method", description: "Learn to synthesize all 75 questions", detailedInstructions: "1. You now have 75+ questions on one passage\n2. Integration asks:\n   - Which questions connect?\n   - What themes emerge?\n   - What's the THESIS?\n   - What's still unanswered?\n3. Integration = turning questions into conclusions", type: "reading", duration: "15 min", icon: "🔄" },
        { id: "a2-w4-a2", title: "Question Categorization", description: "Organize your 75 questions by theme", detailedInstructions: "1. Review ALL 75+ questions\n2. Categorize by THEME:\n   - Righteousness questions\n   - Faith questions\n   - Justification questions\n   - Propitiation questions\n   - Grace questions\n3. How many questions per theme?\n4. Themes reveal passage emphasis", type: "reading", duration: "25 min", icon: "📊" },
        { id: "a2-w4-a3", title: "Question → Answer Matrix", description: "Create answer summary for each question", detailedInstructions: "1. For your TOP 20 questions, write:\n   - Brief answer (1-2 sentences)\n   - Key evidence (verse or cross-reference)\n2. Not all 75 - just the BEST 20\n3. This creates a Q&A study guide", type: "reading", duration: "30 min", icon: "📝" },
        { id: "a2-w4-a4", title: "Thesis Statement Creation", description: "Write a thesis from your questions", detailedInstructions: "1. Based on all your questions and answers:\n2. Write a THESIS for Romans 3:21-26:\n   - Example: 'Romans 3:21-26 declares that God's righteousness is revealed apart from law, through faith in Christ's propitiatory sacrifice, making God both just and the justifier of all who believe.'\n3. Your questions LED to this thesis!", type: "reading", duration: "20 min", icon: "📜" },
        { id: "a2-w4-a5", title: "Unanswered Questions Analysis", description: "What questions remain unanswered?", detailedInstructions: "1. Review your 75 questions\n2. Which remain UNANSWERED or UNCLEAR?\n3. For each:\n   - Why is it hard?\n   - What resource might help?\n   - Is it answerable or mystery?\n4. Unanswered questions = future study", type: "reading", duration: "20 min", icon: "❓" },
        { id: "a2-w4-a6", title: "Encyclopedia: Final Research", description: "Use encyclopedia to fill remaining gaps", detailedInstructions: "1. Go to Encyclopedia\n2. Research your remaining unanswered questions\n3. Search specific terms:\n   - 'Propitiation'\n   - 'Justification'\n   - 'Imputed righteousness'\n4. Document final answers", type: "reading", duration: "20 min", link: "/encyclopedia", icon: "📚" },
        { id: "a2-w4-a7", title: "Daily Verse: Full 75-Question Method", description: "Apply abbreviated 75-question method to daily verse", detailedInstructions: "1. Go to Daily Verse\n2. Generate:\n   - 3 intratextual questions\n   - 3 intertextual questions\n   - 3 PT questions\n3. Write mini-thesis\n4. This is ABBREVIATED 75-question practice", type: "drill", duration: "20 min", link: "/daily-verse", icon: "✨" },
        { id: "a2-w4-a8", title: "Training Drill: Comprehensive Analysis", description: "Test your integrated analytical skills", detailedInstructions: "1. Go to Training Drills\n2. Select comprehensive or synthesis drill\n3. Apply all analytical methods\n4. Score 80%+\n5. Review for improvement", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
        { id: "a2-w4-a9", title: "Card Deck: Thesis Exploration", description: "Use cards to test your thesis", detailedInstructions: "1. Go to Card Deck\n2. Enter your THESIS as prompt\n3. Do the cards confirm or challenge?\n4. Refine thesis if needed\n5. Cards test conclusions", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
        { id: "a2-w4-a10", title: "Daily Challenge: Thesis Defense", description: "Defend your thesis in today's challenge", detailedInstructions: "1. Go to Daily Challenges\n2. Whatever the topic, connect to your thesis\n3. Demonstrate integrated analytical thinking\n4. Show how 75 questions build arguments\n5. Review AI feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "a2-w4-a11", title: "Outline Creation", description: "Create teaching outline from your analysis", detailedInstructions: "1. Transform your thesis into OUTLINE:\n   - I. Introduction (the problem: sin)\n   - II. The Solution (righteousness apart from law)\n   - III. The Means (faith in Christ)\n   - IV. The Mechanism (propitiation)\n   - V. The Result (justified freely)\n   - VI. The Purpose (God just and justifier)\n2. Questions → Thesis → Outline!", type: "drill", duration: "25 min", icon: "📋" },
        { id: "a2-w4-a12", title: "Peer Review Simulation", description: "Critique your own analysis", detailedInstructions: "1. Pretend you're reviewing someone else's work\n2. Ask:\n   - Is the thesis supported?\n   - Are questions answered well?\n   - Are cross-references accurate?\n   - Is PT framework applied correctly?\n3. Strengthen weak points", type: "drill", duration: "20 min", icon: "🔍" },
        { id: "a2-w4-a13", title: "Flashcards: Key Conclusions", description: "Create flashcards for main conclusions", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'Romans 3:21-26 Conclusions'\n3. Cards:\n   - Front: Question\n   - Back: Answer + evidence\n4. Master for teaching readiness", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
        { id: "a2-w4-a14", title: "Create Study: Complete 75-Question Analysis", description: "Compile your masterwork study", detailedInstructions: "1. Go to My Study Room\n2. Finalize: 'Romans 3:21-26 - 75 Question Analysis'\n3. Include:\n   - All 75+ questions (categorized)\n   - Top 20 Q&A pairs\n   - Thesis statement\n   - Teaching outline\n   - PT codes\n   - Unanswered questions for future\n4. This is ANALYTICAL MASTERY!", type: "exercise", duration: "30 min", link: "/my-study-room", icon: "📝" },
        { id: "a2-w4-a15", title: "Gems: Integration Gems", description: "Final gem collection from synthesis", detailedInstructions: "1. Go to Gems Room\n2. Integration gems:\n   - Gem: The 75 questions revealed that 'propitiation' is the CENTER of Romans 3:21-26\n   - Gem: All questions CONVERGE on Christ's blood as the basis of righteousness\n   - Gem: Questions led to thesis: God can be both just AND merciful!\n3. Synthesis produces finest gems", type: "exercise", duration: "20 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "a2-w4-a16", title: "Community: Share Your Thesis", description: "Post your analytical conclusion", detailedInstructions: "1. Go to Community\n2. Post: 'Romans 3:21-26 - My 75-Question Thesis'\n3. Share:\n   - Your thesis\n   - Your best questions\n   - Your key insight\n4. Invite discussion", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "a2-w4-a17", title: "Teaching Prep: 5-Minute Presentation", description: "Prepare to teach your findings", detailedInstructions: "1. Using your outline, prepare a 5-minute presentation\n2. Key elements:\n   - Opening hook (question)\n   - Thesis statement\n   - 3 main points\n   - Christ connection\n   - Application\n3. Questions METHOD → Teaching CONTENT", type: "exercise", duration: "25 min", icon: "🎤" },
        { id: "a2-w4-a18", title: "Month 2 Method Summary", description: "Document your 75-question workflow", detailedInstructions: "1. Write your PERSONAL workflow:\n   - How I generate intratextual questions\n   - How I find cross-references\n   - How I apply PT framework\n   - How I integrate to thesis\n2. This is YOUR analytical method\n3. You'll use it on every passage", type: "exercise", duration: "20 min", icon: "📖" },
        { id: "a2-w4-a19", title: "Growth Journal: Month 2 Analytical Reflection", description: "Reflect on your analytical journey", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Month 2 - 75 Questions Complete'\n3. Answer:\n   - How has questioning changed my study?\n   - What's my thesis for Romans 3:21-26?\n   - What's my most powerful question?\n   - How will I use this method going forward?\n4. Prepare for Gate Assessment", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "a2-w4-a20", title: "Gate Prep: Method Demonstration", description: "Prepare to demonstrate your method", detailedInstructions: "1. Gate Assessment will test:\n   - Can you generate quality questions?\n   - Can you find cross-references?\n   - Can you apply PT framework?\n   - Can you synthesize to thesis?\n2. Review your complete study\n3. Be ready to DEMONSTRATE the method", type: "reflection", duration: "15 min", icon: "📁" },
        { id: "a2-w4-a21", title: "Milestone: Analytical Investigator Certified", description: "Final verification of 75-question mastery", detailedInstructions: "1. Verify you can:\n   - Generate 75+ questions on ANY passage\n   - Find cross-references systematically\n   - Apply PT framework accurately\n   - Synthesize to defensible thesis\n2. You are an ANALYTICAL INVESTIGATOR!\n3. Check Achievements\n4. Gate Assessment awaits!", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Complete integrated 75-question analysis with thesis, outline, and teaching preparation for Romans 3:21-26",
    },
  ],
  gateAssessment: "Demonstrate the 75-question method by presenting your complete Romans 3:21-26 analysis including intratextual, intertextual, and Phototheological questions, a thesis statement, and a teaching outline. Show how analytical questioning leads to Christ-centered conclusions.",
};

// ============================================
// MONTH 2: DEVOTIONAL PATH - Prayer Deepening
// ============================================
export const devotionalPathMonth2: MonthCurriculum = {
  month: 2,
  title: "Prayer Deepening",
  theme: "Intimate Communion with God",
  weeks: [
    {
      weekNumber: 1,
      title: "ACTS Prayer Method",
      focus: "Structure your prayers with Adoration, Confession, Thanksgiving, Supplication",
      scripture: "Matthew 6:9-13 (Lord's Prayer)",
      activities: [
        { id: "d2-w1-a1", title: "Prayer Room Introduction", description: "Discover the Meditation Room for devotional depth", detailedInstructions: "1. Go to Palace > Floor 7 > Meditation Room\n2. Read about meditative prayer\n3. KEY: Devotional path uses Scripture as PRAYER\n4. This month deepens HOW you pray\n5. Week 1: ACTS structure gives prayer shape", type: "reading", duration: "15 min", roomCode: "MR", link: "/palace/floor/7/room/mr", icon: "🙏", lookFor: ["The role of structure in prayer", "How meditation differs from study", "The heart as the goal"] },
        { id: "d2-w1-a2", title: "Read Matthew 6:5-8 - Prayer Preparation", description: "Jesus' teaching on HOW to pray", detailedInstructions: "1. Read Matthew 6:5-8 slowly\n2. Let these words examine you:\n   - v5: Do you pray to be seen?\n   - v6: Have you found your 'closet'?\n   - v7: Do you use empty repetitions?\n   - v8: Do you believe God knows your needs?\n3. Sit quietly. Confess where you fall short.\n4. Ask God to teach you to pray.", type: "reading", duration: "15 min", link: "/bible/Matthew/6", icon: "🙇", specificVerse: "Matthew 6:5-8" },
        { id: "d2-w1-a3", title: "Read Matthew 6:9-13 - The Model Prayer", description: "Study Jesus' prayer as your template", detailedInstructions: "1. Read Matthew 6:9-13 three times\n2. Notice the STRUCTURE:\n   - 'Our Father' - RELATIONSHIP\n   - 'Hallowed be thy name' - ADORATION\n   - 'Thy kingdom come' - SUBMISSION\n   - 'Give us...bread' - SUPPLICATION\n   - 'Forgive us' - CONFESSION\n   - 'Lead us not' - PROTECTION\n3. This is the ACTS pattern in seed form", type: "reading", duration: "20 min", link: "/bible/Matthew/6", icon: "📖", specificVerse: "Matthew 6:9-13" },
        { id: "d2-w1-a4", title: "ACTS Method Explained", description: "Learn the four movements of ACTS prayer", detailedInstructions: "1. ACTS = Adoration, Confession, Thanksgiving, Supplication\n2. A - ADORATION: Praise who God IS (His character)\n3. C - CONFESSION: Acknowledge your sin, receive forgiveness\n4. T - THANKSGIVING: Thank God for what He's DONE\n5. S - SUPPLICATION: Bring your needs and others' needs\n6. Write this structure in your journal", type: "reading", duration: "15 min", icon: "📝" },
        { id: "d2-w1-a5", title: "Encyclopedia: Prayer in Scripture", description: "Study biblical examples of prayer", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Prayer' or 'Lord's Prayer'\n3. Find examples of ACTS elements:\n   - Adoration: Psalm 145\n   - Confession: Psalm 51\n   - Thanksgiving: Psalm 100\n   - Supplication: Philippians 4:6\n4. Note how biblical prayers follow this pattern", type: "reading", duration: "20 min", link: "/encyclopedia", icon: "📚" },
        { id: "d2-w1-a6", title: "Daily Verse: Pray the Verse", description: "Transform today's verse into ACTS prayer", detailedInstructions: "1. Go to Daily Verse\n2. Read today's verse\n3. Use it to pray ACTS:\n   - A: Adore God for what the verse reveals about Him\n   - C: Confess where you fall short of the verse\n   - T: Thank God for the truth in the verse\n   - S: Ask God to apply the verse in your life\n4. Write your prayer", type: "reading", duration: "15 min", link: "/daily-verse", icon: "✨" },
        { id: "d2-w1-a7", title: "Adoration Practice: 10 Names of God", description: "Spend focused time on adoration only", detailedInstructions: "1. Set timer for 10 minutes\n2. Pray ONLY adoration (praise)\n3. Go through 10 names of God:\n   - Yahweh, Elohim, El Shaddai, Adonai...\n   - 'You are holy... You are faithful... You are love...'\n4. Don't ask for anything - ONLY praise\n5. How does this feel different?", type: "drill", duration: "15 min", icon: "👑" },
        { id: "d2-w1-a8", title: "Confession Practice: Psalm 139:23-24", description: "Deep confession prayer using Scripture", detailedInstructions: "1. Read Psalm 139:23-24\n2. Pray it slowly:\n   - 'Search me, O God...'\n   - Wait. What does He reveal?\n   - '...and know my heart...'\n   - What is your heart really holding?\n   - 'See if there be any wicked way in me...'\n   - Be honest. Name what He shows.\n3. Receive forgiveness (1 John 1:9)", type: "drill", duration: "15 min", icon: "🪞" },
        { id: "d2-w1-a9", title: "Thanksgiving Practice: Count Blessings", description: "Focused thanksgiving prayer", detailedInstructions: "1. Set timer for 10 minutes\n2. ONLY thanksgiving - no requests\n3. Be specific:\n   - Not 'thank you for everything'\n   - But 'thank you for [specific blessing]'\n4. Write 20+ specific things\n5. Gratitude transforms perspective", type: "drill", duration: "15 min", icon: "🙌" },
        { id: "d2-w1-a10", title: "Supplication Practice: Prayer List", description: "Organized intercession and petition", detailedInstructions: "1. Create a prayer list:\n   - Personal needs (3-5 items)\n   - Family needs (3-5 people)\n   - Church/community needs\n   - World needs\n2. Pray through the list\n3. Note: Supplication comes AFTER A-C-T\n4. This order changes supplication's tone", type: "drill", duration: "20 min", icon: "📋" },
        { id: "d2-w1-a11", title: "Full ACTS Prayer: Matthew 6:9-13", description: "Complete ACTS prayer using the Lord's Prayer", detailedInstructions: "1. Use Lord's Prayer as ACTS template:\n   - A: 'Our Father in heaven, hallowed be Your name...'\n   - C: 'Forgive us our debts...'\n   - T: (Add thanksgiving for God's provision)\n   - S: 'Give us this day our daily bread...'\n2. Spend 15+ minutes in full ACTS cycle", type: "drill", duration: "20 min", icon: "🙏" },
        { id: "d2-w1-a12", title: "Daily Challenge: Devotional Response", description: "Complete challenge with prayer focus", detailedInstructions: "1. Go to Daily Challenges\n2. Respond with ACTS structure:\n   - Begin with adoration\n   - Include confession element\n   - Express thanksgiving\n   - End with application prayer\n3. Review AI feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "d2-w1-a13", title: "Card Deck: Prayer Exploration", description: "Use cards to deepen prayer on Matthew 6", detailedInstructions: "1. Go to Card Deck\n2. Enter Matthew 6:9 as verse\n3. Let each card become a prayer prompt\n4. Don't analyze - PRAY through the cards\n5. Save as prayer study", type: "drill", duration: "20 min", link: "/card-deck", icon: "🃏" },
        { id: "d2-w1-a14", title: "Create Prayer Journal Entry", description: "Document your ACTS prayer in study room", detailedInstructions: "1. Go to My Study Room\n2. Create: 'ACTS Prayer Journal - Week 1'\n3. Include:\n   - Your ACTS prayers from this week\n   - What you learned about each movement\n   - How this changed your prayer life\n   - Specific answered prayers", type: "exercise", duration: "25 min", link: "/my-study-room", icon: "📝" },
        { id: "d2-w1-a15", title: "Extended ACTS: 30-Minute Session", description: "Practice extended ACTS prayer", detailedInstructions: "1. Set aside 30 uninterrupted minutes\n2. ACTS with extended time:\n   - Adoration: 8 minutes\n   - Confession: 7 minutes\n   - Thanksgiving: 7 minutes\n   - Supplication: 8 minutes\n3. Use a timer\n4. Journal what you experience", type: "exercise", duration: "35 min", icon: "⏰" },
        { id: "d2-w1-a16", title: "Gems: Prayer Gems from Matthew 6", description: "Collect devotional gems about prayer", detailedInstructions: "1. Go to Gems Room\n2. Prayer gems:\n   - Gem: 'Your Father knows what you need BEFORE you ask' (v8) - prayer is not informing God\n   - Gem: 'Our Father' - prayer begins with relationship, not request\n   - Gem: 'Hallowed' first - God's honor before our needs\n3. These gems transform prayer", type: "exercise", duration: "15 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "d2-w1-a17", title: "Community: Share Prayer Testimony", description: "Share how ACTS changed your prayer", detailedInstructions: "1. Go to Community\n2. Post: 'ACTS Prayer Journey - Week 1'\n3. Share:\n   - Which ACTS element was hardest?\n   - Which was most meaningful?\n   - One answered prayer this week\n4. Encourage others in prayer", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "d2-w1-a18", title: "Morning ACTS Habit", description: "Establish morning ACTS routine", detailedInstructions: "1. Plan your morning ACTS practice:\n   - When will you pray?\n   - Where is your 'closet'?\n   - How long initially?\n2. Commit to 5-10 minutes of ACTS each morning\n3. Write your commitment in journal\n4. Start tomorrow!", type: "exercise", duration: "15 min", icon: "🌅" },
        { id: "d2-w1-a19", title: "Growth Journal: ACTS Reflection", description: "Reflect on your prayer deepening", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 1 - ACTS Prayer Reflection'\n3. Answer:\n   - How did structure help my prayer?\n   - Which element transformed most?\n   - What prayers has God answered?\n   - How is my relationship with God changing?\n4. Set Week 2 goals", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "d2-w1-a20", title: "Family/Friend Prayer", description: "Use ACTS to pray for someone", detailedInstructions: "1. Choose one person to pray for\n2. Pray ACTS for THEM:\n   - A: Praise God for who He is to this person\n   - C: Intercede for their spiritual growth\n   - T: Thank God for this person\n   - S: Specific requests for their needs\n3. Consider telling them you prayed", type: "reflection", duration: "15 min", icon: "👨‍👩‍👧‍👦" },
        { id: "d2-w1-a21", title: "Milestone: ACTS Prayer Established", description: "Verify ACTS method is working", detailedInstructions: "1. Can you:\n   - Pray through all four ACTS movements?\n   - Spend focused time on each?\n   - Use Scripture in each movement?\n   - Feel the difference in your prayer life?\n2. ACTS is your prayer foundation!\n3. Week 2 adds LISTENING\n4. Check Achievements", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Establish ACTS prayer structure and commit to daily morning prayer practice",
    },
    {
      weekNumber: 2,
      title: "Listening Prayer",
      focus: "Learn to hear God's voice in Scripture and silence",
      scripture: "1 Samuel 3:1-10 (Samuel Hears God)",
      activities: generateDevotionalWeek2Activities(),
    },
    {
      weekNumber: 3,
      title: "Intercessory Depth",
      focus: "Develop deep burden for others in prayer",
      scripture: "Exodus 32:30-34 (Moses Intercedes)",
      activities: generateDevotionalWeek3Activities(),
    },
    {
      weekNumber: 4,
      title: "Prayer Journaling",
      focus: "Document your prayer journey and track God's faithfulness",
      scripture: "Psalm 77 (Asaph's Prayer Journey)",
      activities: generateDevotionalWeek4Activities(),
    },
  ],
  gateAssessment: "Share your Month 2 prayer journey including ACTS structure mastery, listening prayer experiences, intercessory burden, and prayer journal insights. Demonstrate how Scripture has transformed your prayer life.",
};

// ============================================
// MONTH 2: WARRIOR PATH - Advanced Arsenal
// ============================================
export const warriorPathMonth2: MonthCurriculum = {
  month: 2,
  title: "Advanced Arsenal",
  theme: "Expanding Your Scripture Memory Weapons",
  weeks: [
    {
      weekNumber: 1,
      title: "OT Promise Verses",
      focus: "Memorize Old Testament promises for strength",
      scripture: "Isaiah 40, 41, 43 (God's Promises)",
      activities: [
        { id: "w2-w1-a1", title: "Speed Room Review", description: "Review Month 1 speed memorization techniques", detailedInstructions: "1. Go to Palace > Floor 7 > Speed Room\n2. Review speed memorization principles:\n   - First letter method\n   - Chunking\n   - Rhythmic repetition\n   - Speed drills\n3. Month 2 EXPANDS your arsenal\n4. This week: OT Promises for STRENGTH", type: "reading", duration: "15 min", roomCode: "SRm", link: "/palace/floor/7/room/sr", icon: "⚡" },
        { id: "w2-w1-a2", title: "Isaiah 40:28-31 - Memorize", description: "Learn the 'soaring on wings' promise", detailedInstructions: "1. Read Isaiah 40:28-31 five times\n2. MEMORIZE verse by verse:\n   - v28: 'Hast thou not known?...'\n   - v29: 'He giveth power to the faint...'\n   - v30: 'Even the youths shall faint...'\n   - v31: 'But they that wait upon the LORD...'\n3. Use first-letter method for each verse\n4. Test: Can you recite without looking?", type: "reading", duration: "25 min", link: "/bible/Isaiah/40", icon: "🦅", specificVerse: "Isaiah 40:28-31" },
        { id: "w2-w1-a3", title: "Isaiah 41:10 - Memorize", description: "Learn the 'fear not' promise", detailedInstructions: "1. Read Isaiah 41:10 ten times\n2. MEMORIZE:\n   - 'Fear thou not; for I am with thee:'\n   - 'be not dismayed; for I am thy God:'\n   - 'I will strengthen thee;'\n   - 'yea, I will help thee;'\n   - 'yea, I will uphold thee with the right hand of my righteousness.'\n3. This is a COMBAT verse against fear!", type: "reading", duration: "20 min", link: "/bible/Isaiah/41", icon: "💪", specificVerse: "Isaiah 41:10" },
        { id: "w2-w1-a4", title: "Isaiah 43:1-3a - Memorize", description: "Learn the 'called by name' promise", detailedInstructions: "1. Read Isaiah 43:1-3a\n2. MEMORIZE:\n   - 'Fear not: for I have redeemed thee,'\n   - 'I have called thee by thy name; thou art mine.'\n   - 'When thou passest through the waters, I will be with thee;'\n   - 'and through the rivers, they shall not overflow thee:'\n3. This verse defeats IDENTITY attacks", type: "reading", duration: "20 min", link: "/bible/Isaiah/43", icon: "🔥", specificVerse: "Isaiah 43:1-3" },
        { id: "w2-w1-a5", title: "Encyclopedia: Isaiah Context", description: "Understand the context for these promises", detailedInstructions: "1. Go to Encyclopedia\n2. Search 'Isaiah' or 'Book of Comfort'\n3. Isaiah 40-66 = comfort to exiles\n4. These promises were for HARD times\n5. Context strengthens deployment", type: "reading", duration: "15 min", link: "/encyclopedia", icon: "📚" },
        { id: "w2-w1-a6", title: "Daily Verse: Add to Arsenal", description: "Evaluate daily verse for arsenal potential", detailedInstructions: "1. Go to Daily Verse\n2. Ask: Is this verse ARSENAL-worthy?\n3. Criteria:\n   - Addresses a specific attack?\n   - Contains a promise or command?\n   - Deployable in battle?\n4. If yes, begin memorizing!", type: "reading", duration: "10 min", link: "/daily-verse", icon: "✨" },
        { id: "w2-w1-a7", title: "Speed Drill: Isaiah 40:31", description: "Speed test on wings promise", detailedInstructions: "1. Set timer\n2. Recite Isaiah 40:31 from memory\n3. Target: Under 15 seconds\n4. Repeat 10 times\n5. Speed = combat readiness", type: "drill", duration: "15 min", icon: "⏱️" },
        { id: "w2-w1-a8", title: "Training Drill: Memory Check", description: "Test your new verses", detailedInstructions: "1. Go to Training Drills\n2. Select memory-related drill\n3. Include your new Isaiah verses\n4. Score 90%+ (warriors need precision!)\n5. Review weak areas", type: "drill", duration: "15 min", link: "/training-drills", icon: "🎯" },
        { id: "w2-w1-a9", title: "Speed Drill: Isaiah 41:10", description: "Speed test on fear not promise", detailedInstructions: "1. Set timer\n2. Recite Isaiah 41:10 from memory\n3. Target: Under 20 seconds\n4. Repeat 10 times\n5. This verse MUST be instant for fear attacks", type: "drill", duration: "15 min", icon: "⚡" },
        { id: "w2-w1-a10", title: "Daily Challenge: Warrior Response", description: "Complete challenge citing your arsenal", detailedInstructions: "1. Go to Daily Challenges\n2. Use your NEW verses in response\n3. Cite Isaiah 40:31, 41:10, or 43:1-3\n4. Show how Scripture addresses the topic\n5. Review AI feedback", type: "drill", duration: "15 min", link: "/daily-challenges", icon: "🌟" },
        { id: "w2-w1-a11", title: "Speed Drill: Isaiah 43:1-2", description: "Speed test on identity promise", detailedInstructions: "1. Set timer\n2. Recite Isaiah 43:1-2 from memory\n3. Target: Under 25 seconds\n4. Repeat 10 times\n5. Identity attacks require instant response", type: "drill", duration: "15 min", icon: "⏱️" },
        { id: "w2-w1-a12", title: "Flashcards: OT Promises", description: "Create flashcards for rapid review", detailedInstructions: "1. Go to Flashcards\n2. Create deck: 'OT Promise Arsenal'\n3. Cards for each verse:\n   - Front: First few words\n   - Back: Complete verse + reference\n4. Test both directions\n5. Add as you memorize more", type: "drill", duration: "20 min", link: "/flashcards", icon: "📇" },
        { id: "w2-w1-a13", title: "Battle Scenario: Fear Attack", description: "Practice deploying verses against fear", detailedInstructions: "1. Imagine scenario: You receive bad news. Fear grips you.\n2. DEPLOY:\n   - Isaiah 41:10 'Fear not, for I am with thee...'\n   - Isaiah 43:1 'Fear not, for I have redeemed thee...'\n3. SAY THEM OUT LOUD\n4. Feel the fear lose power\n5. This is COMBAT TRAINING", type: "drill", duration: "15 min", icon: "⚔️" },
        { id: "w2-w1-a14", title: "Create Arsenal Card: OT Promises", description: "Document your OT arsenal", detailedInstructions: "1. Go to My Study Room\n2. Create: 'Arsenal Card - OT Promises'\n3. List:\n   - Isaiah 40:28-31 (full text)\n   - Isaiah 41:10 (full text)\n   - Isaiah 43:1-3 (full text)\n4. Add: Battle deployment notes\n5. Print or save for quick reference", type: "exercise", duration: "20 min", link: "/my-study-room", icon: "📝" },
        { id: "w2-w1-a15", title: "Additional OT: Psalm 46:1-3", description: "Add Psalm 46 to your arsenal", detailedInstructions: "1. Read Psalm 46:1-3\n2. MEMORIZE:\n   - 'God is our refuge and strength,'\n   - 'a very present help in trouble.'\n   - 'Therefore will not we fear, though the earth be removed...'\n3. This is DISASTER defense\n4. Add to your flashcards", type: "exercise", duration: "20 min", link: "/bible/Psalms/46", icon: "🏔️", specificVerse: "Psalm 46:1-3" },
        { id: "w2-w1-a16", title: "Gems: OT Promise Insights", description: "Collect gems from your new verses", detailedInstructions: "1. Go to Gems Room\n2. Promise gems:\n   - Gem: 'Wait upon the LORD' (40:31) = active trust, not passive waiting\n   - Gem: 'I AM with thee' (41:10) = God's name (Yahweh) is present\n   - Gem: 'Called by name' (43:1) = personal relationship, not mass salvation\n3. Gems deepen deployment", type: "exercise", duration: "15 min", roomCode: "GR", link: "/palace/floor/1/room/gr", icon: "💎" },
        { id: "w2-w1-a17", title: "Community: Share Your Arsenal", description: "Post your OT promise arsenal", detailedInstructions: "1. Go to Community\n2. Post: 'OT Promise Arsenal - Week 1'\n3. Share:\n   - Which verse is most powerful for you?\n   - A battle scenario where you deployed it\n   - Encouragement for others' memorization\n4. Warriors encourage warriors!", type: "exercise", duration: "15 min", link: "/community", icon: "👥" },
        { id: "w2-w1-a18", title: "Teach-Back: Isaiah 41:10", description: "Practice teaching this verse", detailedInstructions: "1. Imagine teaching Isaiah 41:10 to someone\n2. Cover:\n   - The verse itself (recite)\n   - The context (Isaiah to exiles)\n   - The application (today's fears)\n   - The deployment (how to use in battle)\n3. Speak it out loud\n4. Teaching solidifies memory", type: "exercise", duration: "15 min", icon: "🎤" },
        { id: "w2-w1-a19", title: "Growth Journal: Arsenal Expansion", description: "Reflect on your growing arsenal", detailedInstructions: "1. Go to Growth Journal\n2. Entry: 'Week 1 - OT Promise Arsenal'\n3. Answer:\n   - Which new verse is strongest in memory?\n   - Which is weakest? (More drill needed)\n   - Have I deployed any verse this week?\n   - How does memorization change me?\n4. Set Week 2 goals", type: "reflection", duration: "15 min", link: "/growth-journal", icon: "📓" },
        { id: "w2-w1-a20", title: "Arsenal Review: All Week 1 Verses", description: "Full speed test of all new verses", detailedInstructions: "1. Set timer for 5 minutes\n2. Recite ALL new verses:\n   - Isaiah 40:28-31\n   - Isaiah 41:10\n   - Isaiah 43:1-3\n   - Psalm 46:1-3\n3. No pausing, no peeking\n4. Target: All verses in 5 minutes", type: "reflection", duration: "15 min", icon: "🔄" },
        { id: "w2-w1-a21", title: "Milestone: 4 New OT Verses", description: "Verify OT arsenal is memorized", detailedInstructions: "1. Can you recite:\n   - Isaiah 40:28-31?\n   - Isaiah 41:10?\n   - Isaiah 43:1-3?\n   - Psalm 46:1-3?\n2. 4 new verses = significant arsenal growth!\n3. Week 2 adds NT Commands\n4. Check Achievements", type: "reflection", duration: "10 min", link: "/achievements", icon: "🏆" },
      ],
      milestone: "Memorize 4 OT promise passages and be able to deploy them in under 5 minutes total",
    },
    {
      weekNumber: 2,
      title: "NT Command Verses",
      focus: "Memorize New Testament commands for obedience",
      scripture: "Philippians 4, Colossians 3 (Commands for Living)",
      activities: generateWarriorWeek2Activities(),
    },
    {
      weekNumber: 3,
      title: "Prophecy Memory",
      focus: "Memorize key prophetic passages",
      scripture: "Daniel 2, Revelation 14 (Prophetic Keys)",
      activities: generateWarriorWeek3Activities(),
    },
    {
      weekNumber: 4,
      title: "Speed Drill Mastery",
      focus: "Achieve rapid deployment of all memorized verses",
      scripture: "Complete Arsenal Review",
      activities: generateWarriorWeek4Activities(),
    },
  ],
  gateAssessment: "Pass timed memory test: Recite all Month 2 arsenal verses (12+ verses) with 95% accuracy in under 3 minutes. Demonstrate rapid deployment in simulated battle scenarios.",
};

// Helper functions for remaining weeks (placeholder with better content)
function generateDevotionalWeek2Activities(): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const titles = [
    "Listening Prayer Introduction", "1 Samuel 3:1-10 - Samuel's Story",
    "Practice Silence", "Hearing Through Scripture", "Recognizing God's Voice",
    "Daily Verse: Listen Mode", "Extended Silence (10 min)", "Training Drill: Meditation",
    "God's Voice vs Other Voices", "Daily Challenge: Heart Response",
    "Journaling What You Hear", "Card Deck: Listening Study", "Encyclopedia: Hearing God",
    "Create Study: Listening Journal", "Samuel's Response Practice",
    "Gems: Listening Gems", "Community: Share What You Heard",
    "Nighttime Listening", "Growth Journal: Listening Reflection",
    "Morning Listening Practice", "Milestone: Hearing Practice Established"
  ];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 6 ? "reading" : i < 13 ? "drill" : i < 18 ? "exercise" : "reflection";
    activities.push({
      id: `d2-w2-a${i + 1}`,
      title: titles[i],
      description: `Listening prayer practice: ${titles[i].toLowerCase()}`,
      detailedInstructions: `1. Focus on hearing God's voice\n2. Use 1 Samuel 3 as your model\n3. Create space for silence\n4. Journal what you sense God saying\n5. Test impressions against Scripture`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: ["🙏", "👂", "🤫", "📖", "💭", "✨", "⏰", "🎯", "🔊", "🌟", "✍️", "🃏", "📚", "📝", "🙇", "💎", "👥", "🌙", "📓", "🌅", "🏆"][i],
    });
  }
  return activities;
}

function generateDevotionalWeek3Activities(): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const titles = [
    "Intercession Introduction", "Exodus 32:30-34 - Moses' Intercession",
    "Burden for Others", "Persistent Prayer", "Praying for Enemies",
    "Daily Verse: Intercede", "Family Prayer Time", "Training Drill: Intercession",
    "Church Prayer List", "Daily Challenge: Others-Focused",
    "World Needs Prayer", "Card Deck: Intercession Study", "Encyclopedia: Biblical Intercessors",
    "Create Study: Intercession Journal", "Standing in the Gap Practice",
    "Gems: Intercession Gems", "Community: Prayer Requests",
    "Fasting with Prayer", "Growth Journal: Intercession Reflection",
    "24-Hour Prayer Focus", "Milestone: Intercessor Heart Developed"
  ];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 6 ? "reading" : i < 13 ? "drill" : i < 18 ? "exercise" : "reflection";
    activities.push({
      id: `d2-w3-a${i + 1}`,
      title: titles[i],
      description: `Intercession practice: ${titles[i].toLowerCase()}`,
      detailedInstructions: `1. Develop burden for others\n2. Use Moses' example as model\n3. Pray with persistence\n4. Include enemies in prayer\n5. Record prayers and answers`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: ["🙏", "📖", "❤️", "🔄", "😇", "✨", "👨‍👩‍👧", "🎯", "⛪", "🌟", "🌍", "🃏", "📚", "📝", "🛡️", "💎", "👥", "🍽️", "📓", "⏰", "🏆"][i],
    });
  }
  return activities;
}

function generateDevotionalWeek4Activities(): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const titles = [
    "Prayer Journal Introduction", "Psalm 77 - Asaph's Journey",
    "Recording Prayers", "Tracking Answers", "Reviewing God's Faithfulness",
    "Daily Verse: Document", "Prayer Timeline Creation", "Training Drill: Review",
    "Unanswered Prayers", "Daily Challenge: Journal Response",
    "Gratitude Log", "Card Deck: Psalm 77 Study", "Encyclopedia: Journaling in Scripture",
    "Create Study: Complete Prayer Journal", "Month 2 Prayer Review",
    "Gems: Journey Gems", "Community: Share Prayer Testimony",
    "Month Integration", "Growth Journal: Prayer Journey Complete",
    "Gate Assessment Prep", "Milestone: Prayer Life Transformed"
  ];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 6 ? "reading" : i < 13 ? "drill" : i < 18 ? "exercise" : "reflection";
    activities.push({
      id: `d2-w4-a${i + 1}`,
      title: titles[i],
      description: `Prayer journaling: ${titles[i].toLowerCase()}`,
      detailedInstructions: `1. Document your prayer journey\n2. Use Psalm 77 as model\n3. Track prayers and answers\n4. Review God's faithfulness\n5. Prepare for Gate Assessment`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: ["📓", "📖", "✍️", "✅", "🔍", "✨", "📅", "🎯", "❓", "🌟", "🙌", "🃏", "📚", "📝", "🔄", "💎", "👥", "🔗", "📓", "📁", "🏆"][i],
    });
  }
  return activities;
}

function generateWarriorWeek2Activities(): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const titles = [
    "NT Commands Introduction", "Philippians 4:4-7 Memorize",
    "Philippians 4:8 Memorize", "Philippians 4:13 Memorize", "Colossians 3:1-4 Memorize",
    "Daily Verse: Command Check", "Speed Drill: Phil 4:4-7", "Training Drill: Memory",
    "Speed Drill: Phil 4:8", "Daily Challenge: Command Application",
    "Speed Drill: Phil 4:13", "Flashcards: NT Commands", "Encyclopedia: Pauline Commands",
    "Create Arsenal: NT Commands", "Battle Scenario: Anxiety Attack",
    "Gems: Command Gems", "Community: Share Commands",
    "Teach-Back: Philippians 4:8", "Growth Journal: NT Commands",
    "Full NT Review", "Milestone: NT Command Arsenal"
  ];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 6 ? "reading" : i < 13 ? "drill" : i < 18 ? "exercise" : "reflection";
    activities.push({
      id: `w2-w2-a${i + 1}`,
      title: titles[i],
      description: `NT command memorization: ${titles[i].toLowerCase()}`,
      detailedInstructions: `1. Memorize NT command verses\n2. Use speed drill technique\n3. Deploy in battle scenarios\n4. Teach to solidify memory\n5. Add to flashcard deck`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: ["📖", "📜", "💭", "💪", "⬆️", "✨", "⏱️", "🎯", "⚡", "🌟", "⏱️", "📇", "📚", "📝", "⚔️", "💎", "👥", "🎤", "📓", "🔄", "🏆"][i],
    });
  }
  return activities;
}

function generateWarriorWeek3Activities(): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const titles = [
    "Prophecy Memory Introduction", "Daniel 2:44 Memorize",
    "Revelation 14:6-7 Memorize", "Revelation 14:12 Memorize", "Daniel 9:24-27 Key Verses",
    "Daily Verse: Prophetic Check", "Speed Drill: Daniel 2:44", "Training Drill: Prophecy",
    "Speed Drill: Rev 14:6-7", "Daily Challenge: Prophetic Response",
    "Speed Drill: Rev 14:12", "Flashcards: Prophecy Verses", "Encyclopedia: Prophecy Keys",
    "Create Arsenal: Prophecy Section", "Battle Scenario: Doubt Attack",
    "Gems: Prophecy Gems", "Community: Share Prophecy Arsenal",
    "Teach-Back: Three Angels", "Growth Journal: Prophecy Memory",
    "Full Prophecy Review", "Milestone: Prophecy Arsenal Complete"
  ];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 6 ? "reading" : i < 13 ? "drill" : i < 18 ? "exercise" : "reflection";
    activities.push({
      id: `w2-w3-a${i + 1}`,
      title: titles[i],
      description: `Prophecy memorization: ${titles[i].toLowerCase()}`,
      detailedInstructions: `1. Memorize key prophetic verses\n2. Understand prophetic context\n3. Deploy for witness and defense\n4. Connect to PT prophecy framework\n5. Speed drill for instant recall`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: ["🔮", "🗿", "📯", "⭐", "📅", "✨", "⏱️", "🎯", "⚡", "🌟", "⏱️", "📇", "📚", "📝", "⚔️", "💎", "👥", "🎤", "📓", "🔄", "🏆"][i],
    });
  }
  return activities;
}

function generateWarriorWeek4Activities(): WeekActivity[] {
  const activities: WeekActivity[] = [];
  const titles = [
    "Speed Mastery Introduction", "Full Month 1 Review",
    "Full OT Promise Review", "Full NT Command Review", "Full Prophecy Review",
    "Daily Verse: Speed Add", "Complete Arsenal Test (5 min)", "Training Drill: Comprehensive",
    "Battle Simulation: Multi-Attack", "Daily Challenge: Full Arsenal Response",
    "Random Verse Recall Drill", "Flashcard Sprint", "Encyclopedia: Memory Champions",
    "Create Arsenal: Complete Documentation", "Scenario Training: Real Life",
    "Gems: Month 2 Best Gems", "Community: Arsenal Demonstration",
    "Teach-Back: Full Gospel Presentation", "Growth Journal: Month 2 Complete",
    "Gate Assessment Preparation", "Milestone: Speed Warrior Certified"
  ];
  
  for (let i = 0; i < 21; i++) {
    const type: "reading" | "drill" | "exercise" | "reflection" = 
      i < 6 ? "reading" : i < 13 ? "drill" : i < 18 ? "exercise" : "reflection";
    activities.push({
      id: `w2-w4-a${i + 1}`,
      title: titles[i],
      description: `Speed mastery: ${titles[i].toLowerCase()}`,
      detailedInstructions: `1. Master rapid recall of ALL verses\n2. Test under time pressure\n3. Simulate battle scenarios\n4. Document complete arsenal\n5. Prepare for Gate Assessment`,
      type,
      duration: type === "reading" ? "15 min" : type === "drill" ? "20 min" : "25 min",
      icon: ["⚡", "📖", "📜", "💭", "🔮", "✨", "⏱️", "🎯", "⚔️", "🌟", "🎲", "📇", "📚", "📝", "🌍", "💎", "👥", "🎤", "📓", "📁", "🏆"][i],
    });
  }
  return activities;
}
