export interface CourseAssignment {
  tool: string;
  route: string;
  task: string;
  icon: string;
}

/**
 * Each day maps to 2-3 specific assignments using different parts of the app.
 * Students must complete these to mark the day as done.
 */
export const courseAssignments: Record<number, CourseAssignment[]> = {
  // ═══ FLOOR 1: FURNISHING (Days 1-14) ═══
  1: [
    { icon: "🏰", tool: "Palace Explorer", route: "/palace", task: "Tour all 8 floors of the Palace and read the description of each floor" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Genesis/1", task: "Read Genesis 1–3 and highlight every verse where you see Christ foreshadowed" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a one-paragraph vision statement: 'Why I am committing to 90 days of Phototheology'" },
  ],
  2: [
    { icon: "🎬", tool: "Story Room", route: "/palace/room/story", task: "Retell Genesis 3 using the Story Room's guided prompts — record your mental movie" },
    { icon: "👤", tool: "Character Profiles", route: "/character-profiles", task: "Look up Adam and Eve's profiles — note 3 Christ-connections you discover" },
    { icon: "💎", tool: "Give Me A Gem", route: "/give-me-a-gem", task: "Generate a gem from Genesis 3:21 and save it to your collection" },
  ],
  3: [
    { icon: "🎭", tool: "Imagination Room", route: "/palace/room/imagination", task: "Complete the guided immersion exercise for Noah's Ark (Genesis 7)" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Genesis/7", task: "Read Genesis 7 and write 5 sensory details from your immersive experience" },
    { icon: "🙏", tool: "Devotional Mode", route: "/devotionals", task: "Spend 5 minutes in devotional meditation on Hebrews 11:7 — Noah's faith" },
  ],
  4: [
    { icon: "🖼️", tool: "Image Bible", route: "/image-bible", task: "View the 24FPS frames for Genesis 1–10 and create your own mental frames for 5 chapters" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Genesis/1", task: "Scan Genesis 1–10 and assign one symbolic image to each chapter" },
    { icon: "🎮", tool: "Memory Game", route: "/memory-game", task: "Play a memory game to test your recall of Genesis 1–10 chapter images" },
  ],
  5: [
    { icon: "🖼️", tool: "Image Bible", route: "/image-bible", task: "Study the 51-Symbol Panorama — learn the first 3 rendered symbols for Genesis" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Sketch or describe 3 Bible Rendered symbols: '/' for Gen 1–24, '×' for Gen 25–50, '⛓️→🔓' for Exodus 1–24" },
    { icon: "⚡", tool: "Speed Drill", route: "/test-me", task: "Test yourself: can you recall 3 rendered symbols in under 15 seconds?" },
  ],
  6: [
    { icon: "🔤", tool: "Translation Room", route: "/palace/room/translation", task: "Translate 3 verses into vivid images using the Translation Room's guided process" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'light' and 'lamp' — collect 5 verses that use visual metaphors" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Draw or describe your best translation image and explain why it's memorable" },
  ],
  7: [
    { icon: "💎", tool: "Give Me A Gem", route: "/give-me-a-gem", task: "Generate 3 gems from today's focus passages and save them to your collection" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Psalms/119", task: "Read Psalm 119:97-104 and mine 2 personal gems about loving God's Word" },
    { icon: "🏰", tool: "Floor 1 Review", route: "/palace/floor/1", task: "Walk through Floor 1 and rate your confidence in each room (1-10)" },
  ],
  8: [
    { icon: "🎬", tool: "Story Room", route: "/palace/room/story", task: "Create mental movies for Abraham's call, Isaac's binding, Jacob's ladder, and Joseph's journey" },
    { icon: "👤", tool: "Character Profiles", route: "/character-profiles", task: "Study Abraham, Isaac, Jacob, and Joseph — identify one Christ-connection per patriarch" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Genesis/22", task: "Read Genesis 22 and journal: how does 'God will provide Himself a lamb' point to Calvary?" },
  ],
  9: [
    { icon: "🎭", tool: "Imagination Room", route: "/palace/room/imagination", task: "Complete a 10-minute immersive walk through the Exodus — bondage to Red Sea" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Exodus/14", task: "Read Exodus 14 and highlight every detail that reveals God's character" },
    { icon: "🙏", tool: "Devotional Mode", route: "/devotionals", task: "Meditate on 'Stand still and see the salvation of the Lord' for 5 minutes" },
  ],
  10: [
    { icon: "🖼️", tool: "Image Bible", route: "/image-bible", task: "Create 24FPS frames for 10 key Gospel chapters across Matthew" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Matthew/1", task: "Scan Matthew 1–28 and identify the 5 most visually memorable scenes" },
    { icon: "🎮", tool: "Flashcards", route: "/flashcards", task: "Create flashcards for your 10 Gospel frames and practice rapid recall" },
  ],
  11: [
    { icon: "🔤", tool: "Translation Room", route: "/palace/room/translation", task: "Translate Isaiah 53 verse-by-verse into a visual 'graphic novel' sequence" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Isaiah/53", task: "Read Isaiah 53 slowly — each verse becomes one vivid image" },
    { icon: "💎", tool: "Give Me A Gem", route: "/give-me-a-gem", task: "Generate a gem linking Isaiah 53 to a Gospel passage about Christ's suffering" },
  ],
  12: [
    { icon: "💎", tool: "Give Me A Gem", route: "/give-me-a-gem", task: "Mine 3 gems from Psalm 23 — focus on surprising insights in familiar words" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Psalms/23", task: "Read Psalm 23 and write out each verse with a one-sentence 'gem insight'" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Which Psalm 23 gem changes your perspective most? Write a reflection paragraph" },
  ],
  13: [
    { icon: "🖼️", tool: "Image Bible", route: "/image-bible", task: "Learn 4 more Bible Rendered symbols for Isaiah, Daniel, Romans, and Revelation" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Romans/1", task: "Read Romans 1:1-17 and assign one master image to the book's opening" },
    { icon: "⚡", tool: "Speed Drill", route: "/test-me", task: "Can you scan 7 rendered symbol blocks in under 30 seconds? Test yourself!" },
  ],
  14: [
    { icon: "🏰", tool: "Floor 1 Overview", route: "/palace/floor/1", task: "Walk through every room of Floor 1 — rate your confidence in each" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Genesis/22", task: "Apply all 6 Floor 1 rooms to Genesis 22 as your integration exercise" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Save your Floor 1 integration study as your first archived study" },
  ],

  // ═══ FLOOR 2: INVESTIGATION (Days 15-28) ═══
  15: [
    { icon: "🔍", tool: "Observation Room", route: "/palace/room/observation", task: "Write 20 observations on John 1:1-14 — just facts, no interpretation" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/John/1", task: "Read John 1:1-14 three times, noticing new details each time" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Log your 20 observations — which 3 surprised you most?" },
  ],
  16: [
    { icon: "🔍", tool: "Observation Room", route: "/palace/room/observation", task: "Push to 50 observations on Luke 15:11-32 (Prodigal Son)" },
    { icon: "🎯", tool: "Daily Challenge", route: "/daily-challenges", task: "Complete today's detective challenge focused on observation skills" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "What gold did you find in observations #30-50 that casual reading misses?" },
  ],
  17: [
    { icon: "📚", tool: "Bible Lexicon", route: "/bible-lexicon", task: "Look up agapao and phileo in Greek — study the nuance in John 21:15-17" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/John/21", task: "Read John 21:15-17 with your new Greek insight — how does it change the exchange?" },
    { icon: "💬", tool: "Commentary Suite", route: "/bible-lexicon", task: "Read 2 commentaries on the Peter-Jesus exchange in John 21" },
  ],
  18: [
    { icon: "📚", tool: "Bible Lexicon", route: "/bible-lexicon", task: "Research the historical background of Laodicea — banking, wool, eye-salve" },
    { icon: "🔬", tool: "Research Mode", route: "/research-mode", task: "Use Research Mode to explore the cultural context of Revelation 3:14-22" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Revelation/3", task: "Re-read Revelation 3:17-18 with cultural knowledge — write how context transforms the passage" },
  ],
  19: [
    { icon: "🔮", tool: "Symbols Room", route: "/palace/room/symbols-types", task: "Build symbol profiles for Lamb, Rock, Light, and Water with verse references" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/John/1", task: "Read John 1:29, 1 Cor 10:4, John 8:12, John 7:38 — trace God's symbolic fingerprints" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'lamb' across Scripture — how many references point to Christ?" },
  ],
  20: [
    { icon: "🔮", tool: "Symbols Room", route: "/palace/room/symbols-types", task: "Build a comprehensive Joseph-Christ typology with 10+ parallels" },
    { icon: "👤", tool: "Character Profiles", route: "/character-profiles", task: "Study Joseph's full profile and mark every Christ-type element" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write your Joseph-Christ parallel list with Scripture references for each" },
  ],
  21: [
    { icon: "❓", tool: "Questions Room", route: "/palace/room/questions", task: "Generate 30 questions on John 11:35 — 10 intratextual, 10 intertextual, 10 Phototheological" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/John/11", task: "Read John 11:1-44 to understand the full context of 'Jesus wept'" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'weep' and 'tears' — where else does God show emotion?" },
  ],
  22: [
    { icon: "❓", tool: "Questions Room", route: "/palace/room/questions", task: "Practice Five Ascensions questioning on Exodus 12:13 — 5 questions per level" },
    { icon: "📐", tool: "Ascensions & Expansions", route: "/ascensions-expansions", task: "Study the Five Ascensions framework and practice ascending from text to heaven" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Exodus/12", task: "Read Exodus 12 and trace how 'blood' ascends from text to cosmic significance" },
  ],
  23: [
    { icon: "🔗", tool: "Q&A Room", route: "/palace/room/questions", task: "Build 5 full Q&A chains on Luke 15 — each question answered by another Scripture" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'robe' and 'ring' — find cross-references that answer the prodigal's gifts" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Document your Q&A chains as a reference tool for future study" },
  ],
  24: [
    { icon: "🔗", tool: "Q&A Room", route: "/palace/room/questions", task: "Cross-examine Daniel 2 with 15 questions, each answered by another Scripture" },
    { icon: "🔭", tool: "Prophecy Watch", route: "/prophecy-watch", task: "Explore the Daniel 2 prophecy timeline and verify your cross-references" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Daniel/2", task: "Read Daniel 2 and build the full investigation file" },
  ],
  25: [
    { icon: "📚", tool: "Bible Lexicon", route: "/bible-lexicon", task: "Define 'quick' (zao), 'powerful' (energes), and 'twoedged sword' (machaira) from Hebrews 4:12" },
    { icon: "📖", tool: "Interlinear Bible", route: "/interlinear", task: "Use the Interlinear Bible to study the Greek of Hebrews 4:12 word by word" },
    { icon: "🔍", tool: "Observation Room", route: "/palace/room/observation", task: "Write 15 observations on Hebrews 4:12 before looking at definitions" },
  ],
  26: [
    { icon: "🔮", tool: "Symbols Room", route: "/palace/room/symbols-types", task: "Build symbol profiles for Lion (power/kingship) and Lamb (sacrifice/meekness)" },
    { icon: "❓", tool: "Questions Room", route: "/palace/room/questions", task: "Ask 10 questions about why John heard 'Lion' but saw 'Lamb' in Rev 5:5-6" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Revelation/5", task: "Read Revelation 5 and trace the Lion-Lamb paradox with cross-references" },
  ],
  27: [
    { icon: "👤", tool: "Character Profiles", route: "/character-profiles", task: "Study Ruth and Boaz — build the kinsman-redeemer profile" },
    { icon: "📚", tool: "Bible Lexicon", route: "/bible-lexicon", task: "Define 'kinsman-redeemer' (goel) and find 3 cross-references" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a one-page investigation summary of Ruth pointing to Christ" },
  ],
  28: [
    { icon: "🏰", tool: "Floor 2 Overview", route: "/palace/floor/2", task: "Review all 5 Investigation rooms and rate your detective skills (1-10)" },
    { icon: "⚡", tool: "Test Your Knowledge", route: "/test-me", task: "Take the Floor 2 assessment quiz to test your investigation skills" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Create your Detective Toolkit Summary — one page covering all 5 rooms" },
  ],

  // ═══ FLOOR 3: FREESTYLE (Days 29-42) ═══
  29: [
    { icon: "🌿", tool: "Nature Freestyle", route: "/palace/room/nature-freestyle", task: "Find 5 natural objects and freestyle a Scripture connection for each" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Romans/1", task: "Read Romans 1:20 — how does nature reveal God's invisible qualities?" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write 5 mini-lessons: one for each nature-Scripture connection you made" },
  ],
  30: [
    { icon: "🌿", tool: "Nature Freestyle", route: "/palace/room/nature-freestyle", task: "Choose one natural object (a tree) and build 5 layers of meaning from it" },
    { icon: "🙏", tool: "Devotional Mode", route: "/devotionals", task: "Spend 10 minutes in devotional meditation connecting a tree to Psalm 1" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Revelation/22", task: "Read about the Tree of Life in Revelation 22 — how does it complete the tree theme?" },
  ],
  31: [
    { icon: "🧑", tool: "Personal Freestyle", route: "/palace/room/personal-freestyle", task: "Identify 5 recent life experiences and freestyle Scripture connections" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Journal your 5 personal-Scripture connections as a study entry" },
    { icon: "💭", tool: "Analyze Thoughts", route: "/analyze-thoughts", task: "Use the thought analyzer to explore how your experiences connect to Scripture themes" },
  ],
  32: [
    { icon: "🧑", tool: "Personal Freestyle", route: "/palace/room/personal-freestyle", task: "Think of your hardest trial this year — freestyle 3 Scripture connections" },
    { icon: "💭", tool: "Analyze Thoughts", route: "/analyze-thoughts", task: "Process your trial through the thought analyzer — find God's purpose in it" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a 5-sentence testimony connecting your trial to a biblical character" },
  ],
  33: [
    { icon: "🧬", tool: "Verse Genetics", route: "/palace/room/bible-freestyle", task: "Build a family tree for 'light' — trace at least 8 related verses" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'light' across Scripture to discover the full 'light family'" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Draw connecting lines between your 'light' verse family members" },
  ],
  34: [
    { icon: "🧬", tool: "Verse Genetics", route: "/palace/room/bible-freestyle", task: "Build the 'shepherd' verse genetics tree from Genesis to Revelation (12+ verses)" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'shepherd' and map the progression across Testament periods" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/John/10", task: "Read John 10:1-18 as the climax of the shepherd motif" },
  ],
  35: [
    { icon: "🌍", tool: "Christ & Culture", route: "/culture-controversy", task: "Connect 3 historical events to Scripture using the Christ & Culture tool" },
    { icon: "📅", tool: "Bible Timeline", route: "/bible-timeline", task: "Explore the timeline to see how Bible history connects with world history" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write 3 paragraphs showing God's hand in historical events" },
  ],
  36: [
    { icon: "🌍", tool: "Christ & Culture", route: "/culture-controversy", task: "Find 3 current news stories and connect them to biblical principles" },
    { icon: "🔭", tool: "Prophecy Watch", route: "/prophecy-watch", task: "Check the prophecy dashboard — do any current events connect to prophetic patterns?" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a discernment journal entry — what do current events reveal through Scripture?" },
  ],
  37: [
    { icon: "👂", tool: "Listening Room", route: "/palace/room/listening", task: "Practice the Listening Room discipline: respond to 5 real conversations with Scripture" },
    { icon: "🎧", tool: "Audio Library", route: "/audio-library", task: "Listen to a teaching and identify which Palace rooms the speaker naturally uses" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Journal 5 conversations and the verses they sparked in your mind" },
  ],
  38: [
    { icon: "👂", tool: "Listening Room", route: "/palace/room/listening", task: "Listen to a sermon and identify 3 key Scripture references the speaker uses" },
    { icon: "🎧", tool: "Audio Library", route: "/audio-library", task: "Find a sermon in the Audio Library and write a 'Response Gem' to it" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "For each reference the speaker used, think of 2 additional supporting verses" },
  ],
  39: [
    { icon: "🎤", tool: "Palace Freestyle", route: "/palace/freestyle", task: "Combine Nature + Personal + Bible freestyle on Isaiah 40:31 in one flowing session" },
    { icon: "🙏", tool: "Devotional Mode", route: "/devotionals", task: "End with 5 minutes of devotional meditation on 'mount up with wings as eagles'" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a combined freestyle meditation on Isaiah 40:31 using all 3 modes" },
  ],
  40: [
    { icon: "🎤", tool: "Palace Freestyle", route: "/palace/freestyle", task: "Prepare and deliver a 10-minute freestyle lesson on Psalm 23 to someone" },
    { icon: "📢", tool: "Sermon Builder", route: "/sermon-builder", task: "Use the Sermon Builder to outline a teaching on Psalm 23 using freestyle principles" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Journal how teaching through freestyle felt different from a prepared study" },
  ],
  41: [
    { icon: "🏰", tool: "Floor 3 Overview", route: "/palace/floor/3", task: "Walk through all 5 Freestyle rooms and compile your 'Greatest Hits' summary" },
    { icon: "🏋️", tool: "Training Drills", route: "/training-drills", task: "Complete 3 freestyle training drills to sharpen your weakest mode" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Rate each freestyle mode 1-10 and identify your strongest and weakest" },
  ],
  42: [
    { icon: "🏰", tool: "Floors 1-3 Review", route: "/palace/floor/3", task: "Apply Floors 1-3 to Revelation 3:20 — story, investigation, and freestyle" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a comprehensive 2-page study of Revelation 3:20 using all 3 floors" },
    { icon: "⚡", tool: "Speed Drill", route: "/test-me", task: "Test your Floors 1-3 speed: can you apply all three to a random verse in 5 minutes?" },
  ],

  // ═══ FLOOR 4: NEXT LEVEL (Days 43-56) ═══
  43: [
    { icon: "🎯", tool: "Concentration Room", route: "/palace/room/concentration", task: "Find Christ in 5 'unlikely' texts — Leviticus 13, Numbers 19, Judges 14, 2 Kings 4, Ecclesiastes 1" },
    { icon: "🎮", tool: "Christ Lock Game", route: "/games/christ-lock", task: "Play Christ Lock to test your ability to find Christ in any chapter" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write one paragraph per 'unlikely' text showing its Christ-connection" },
  ],
  44: [
    { icon: "📐", tool: "Dimensions Room", route: "/palace/room/dimensions", task: "Apply all 5 dimensions to Exodus 25:8 — Literal, Christ, Me, Church, Heaven" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Exodus/25", task: "Read Exodus 25 and identify how each sanctuary item maps to a dimension" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a full paragraph for each of the 5 dimensions on Exodus 25:8" },
  ],
  45: [
    { icon: "📐", tool: "Dimensions Room", route: "/palace/room/dimensions", task: "Apply 5 dimensions to 'It is finished' (John 19:30) with supporting verses" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/John/19", task: "Read John 19:17-37 and trace tetelestai's meaning through context" },
    { icon: "📚", tool: "Bible Lexicon", route: "/bible-lexicon", task: "Look up tetelestai in Greek — understand why 'paid in full' changes everything" },
  ],
  46: [
    { icon: "🔗", tool: "Connect 6 Room", route: "/palace/room/connect6", task: "Connect 'sowing' across all 6 genres: Prophecy, Poetry, History, Gospels, Epistles, Parables" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'sow' and 'seed' across Scripture to find genre-spanning connections" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write how each genre treats 'sowing' differently — what unified truth emerges?" },
  ],
  47: [
    { icon: "🧱", tool: "Theme Room", route: "/palace/room/theme", task: "Build the Sanctuary Wall — place 6 key verses on their correct sanctuary furniture" },
    { icon: "⛪", tool: "Sanctuary Run", route: "/games/sanctuary-run", task: "Play Sanctuary Run to test your knowledge of sanctuary symbolism" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Hebrews/9", task: "Read Hebrews 9:1-14 and trace each sanctuary item to its Christ-fulfillment" },
  ],
  48: [
    { icon: "🧱", tool: "Theme Room", route: "/palace/room/theme", task: "Build the Great Controversy Wall — place 7 verses in sequence from origin to final defeat" },
    { icon: "🎮", tool: "Controversy Raid", route: "/games/controversy-raid", task: "Play Controversy Raid to explore the cosmic conflict through Scripture" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Revelation/12", task: "Read Revelation 12 and identify every Great Controversy element" },
  ],
  49: [
    { icon: "⏰", tool: "Time Zone Room", route: "/palace/room/timezone", task: "Map Revelation 12 onto the 6-zone grid (Earth/Heaven × Past/Present/Future)" },
    { icon: "🎮", tool: "Time Zone Invasion", route: "/games/time-zone-invasion", task: "Play Time Zone Invasion to practice placing events in their correct zones" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write out each section of Revelation 12 placed in its correct time zone" },
  ],
  50: [
    { icon: "🔄", tool: "Patterns Room", route: "/palace/room/patterns", task: "Trace 3 master patterns: '40' pattern, '3 days' pattern, and 'Deliverer' pattern" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'forty days' and 'three days' to map God's recurring motifs" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "List at least 5 examples per pattern with full Scripture references" },
  ],
  51: [
    { icon: "🪞", tool: "Parallels Room", route: "/palace/room/parallels", task: "Study 4 major parallels: Babel↔Pentecost, Exodus↔Return, 40 days↔40 years, Garden↔Garden" },
    { icon: "📅", tool: "Bible Timeline", route: "/bible-timeline", task: "Use the timeline to visually see how mirrored events align across history" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "For each parallel, identify the mirror point and what God reverses" },
  ],
  52: [
    { icon: "🍎", tool: "Fruit Room", route: "/palace/room/fruit", task: "Test 3 common interpretations through the Fruit Room — do they produce Christlike character?" },
    { icon: "💭", tool: "Analyze Thoughts", route: "/analyze-thoughts", task: "Analyze your interpretation of a controversial text — does it pass the fruit test?" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Apply all 9 fruits as a checklist to one interpretation and document results" },
  ],
  53: [
    { icon: "✝️", tool: "Concentration Room", route: "/palace/room/concentration", task: "Find Christ in 10 random chapters using the Christ in Every Chapter method" },
    { icon: "🎮", tool: "Christ Lock", route: "/games/christ-lock", task: "Play Christ Lock at an advanced level — every chapter must reveal Christ" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Genesis/1", task: "Begin tracing one theme ('salvation') through all 66 books — start with 10 books" },
  ],
  54: [
    { icon: "🏰", tool: "Floor 4 Overview", route: "/palace/floor/4", task: "Full Floor 4 walkthrough on Philippians 2:5-11 — use all 8 rooms" },
    { icon: "🔀", tool: "Study Remix", route: "/remix", task: "Remix Philippians 2:5-11 using the Study Remix tool for fresh perspectives" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Save your Floor 4 integration study on Philippians 2 as an archived study" },
  ],
  55: [
    { icon: "📐", tool: "Ascensions & Expansions", route: "/ascensions-expansions", task: "Review Width, Time, and beginning Depth — rate yourself 1-10 on each floor" },
    { icon: "🏋️", tool: "Training Drills", route: "/training-drills", task: "Complete training drills for your weakest expansion area" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Create a 5-day strengthening plan for your weakest area" },
  ],
  56: [
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a comprehensive 3-page mid-course study of Isaiah 55:1-3 using all 4 floors" },
    { icon: "🔊", tool: "Study Amplify", route: "/amplify", task: "Use Amplify to deepen your Isaiah 55 study with AI-enhanced insights" },
    { icon: "⚡", tool: "Speed Drill", route: "/test-me", task: "Mid-course speed test: apply Floors 1-4 to a random verse in 10 minutes" },
  ],

  // ═══ FLOOR 5: VISION (Days 57-63) ═══
  57: [
    { icon: "⛪", tool: "Sanctuary Explorer", route: "/palace/room/sanctuary", task: "Walk the complete sanctuary path — Gate to Ark — with Christ-fulfillment at each stop" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Hebrews/8", task: "Read Hebrews 8 and trace the sanctuary pattern into heaven" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Draw the full sanctuary layout and label each piece with its Christ-fulfillment verse" },
  ],
  58: [
    { icon: "⛪", tool: "Sanctuary Explorer", route: "/palace/room/sanctuary", task: "Map Christ's two-phase ministry — Holy Place (daily) vs. Most Holy Place (yearly)" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Hebrews/9", task: "Read Hebrews 9:1-28 and identify the transition from earthly to heavenly sanctuary" },
    { icon: "📅", tool: "Bible Timeline", route: "/bible-timeline", task: "Locate 1844 on the timeline and understand its sanctuary significance" },
  ],
  59: [
    { icon: "🔭", tool: "Prophecy Watch", route: "/prophecy-watch", task: "Map the prophetic telescope: Daniel 2 → Daniel 7 → Daniel 8-9 side by side" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Daniel/2", task: "Read Daniel 2, 7, and 8 — note how each 'enlarges' the previous" },
    { icon: "🤖", tool: "Daniel-Revelation AI", route: "/daniel-revelation-gpt", task: "Ask the Daniel-Revelation AI to help you connect the three prophecy chapters" },
  ],
  60: [
    { icon: "🔭", tool: "Prophecy Watch", route: "/prophecy-watch", task: "Map 3 Revelation sequences: Seven Churches, Seven Seals, Three Angels" },
    { icon: "🤖", tool: "Daniel-Revelation AI", route: "/daniel-revelation-gpt", task: "Explore the historicist interpretation of the Seven Churches with the AI assistant" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Revelation/14", task: "Read Revelation 14:6-12 as the capstone of Phototheology's prophetic message" },
  ],
  61: [
    { icon: "🔭", tool: "Prophecy Watch", route: "/prophecy-watch", task: "Deep study of the Three Angels' Messages — break down each phrase of Revelation 14:6-12" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Revelation/14", task: "Read Revelation 14:6-12 and connect each angel to its root doctrines" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a one-page synthesis showing how gospel, prophecy, sanctuary, and Sabbath converge" },
  ],
  62: [
    { icon: "⛪", tool: "Sanctuary Explorer", route: "/palace/room/sanctuary", task: "Map the 7 feasts of Israel to their Christ-fulfillment: spring feasts → first coming, fall feasts → second coming" },
    { icon: "📅", tool: "Bible Timeline", route: "/bible-timeline", task: "Locate each feast on the biblical timeline and see the prophetic calendar" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Leviticus/23", task: "Read Leviticus 23 and mark each feast with its New Testament fulfillment" },
  ],
  63: [
    { icon: "🏰", tool: "Floor 5 Overview", route: "/palace/floor/5", task: "Connect all Vision rooms on Daniel 8:14 — Sanctuary + Prophecy + Three Angels + Feasts" },
    { icon: "🔭", tool: "Prophecy Watch", route: "/prophecy-watch", task: "Write a synthesis showing how sanctuary, prophecy, and mission are one unified system" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Save your Floor 5 integration study on Daniel 8:14" },
  ],

  // ═══ FLOOR 6: THREE HEAVENS (Days 64-70) ═══
  64: [
    { icon: "🌌", tool: "Three Heavens", route: "/ascensions-expansions", task: "Map the Three Heavens framework: 1H (Babylon/Restoration), 2H (70 AD/New Covenant), 3H (Final New Creation)" },
    { icon: "📅", tool: "Bible Timeline", route: "/bible-timeline", task: "Locate all three Day-of-the-LORD events on the biblical timeline" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Create a chart placing key texts in their correct heaven (1H, 2H, or 3H)" },
  ],
  65: [
    { icon: "🔄", tool: "Cycles Framework", route: "/ascensions-expansions", task: "Map all 8 cycles (@Ad → @Re) with their 5-part structure" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Genesis/6", task: "Read Genesis 6-9 and identify the full Noahic cycle: Fall → Covenant → Sanctuary → Enemy → Restoration" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write each cycle's 5-part structure in shorthand — which cycle resonates most?" },
  ],
  66: [
    { icon: "🌌", tool: "Cycles & Heavens", route: "/ascensions-expansions", task: "Place 8 texts in their correct cycle and heaven — practice precision placement" },
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Search for 'new heavens' and 'new earth' — which heaven does each reference point to?" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "For each of the 8 texts, explain WHY you placed it in that cycle and heaven" },
  ],
  67: [
    { icon: "🍊", tool: "Juice Room", route: "/palace/room/juice", task: "Juice the book of Jonah through all 6 floors — squeeze every drop of meaning" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Jonah/1", task: "Read all 4 chapters of Jonah as preparation for your Juice Room exercise" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a 2-page Juice Summary of Jonah covering all floors" },
  ],
  68: [
    { icon: "🍊", tool: "Juice Room", route: "/palace/room/juice", task: "Juice the book of Romans (16 chapters) — create a condensed juice summary" },
    { icon: "🔊", tool: "Study Amplify", route: "/amplify", task: "Use Amplify on Romans to discover connections you might have missed" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a one-page juice extract of Romans — what truly matters in this book?" },
  ],
  69: [
    { icon: "📐", tool: "Ascensions & Expansions", route: "/ascensions-expansions", task: "Practice Static AND Dynamic ascensions on Psalm 23:1 — both anchored and creative" },
    { icon: "🎤", tool: "Palace Freestyle", route: "/palace/freestyle", task: "Dynamic freestyle: let Psalm 23:1 travel to John 10, Ezekiel 34, and Revelation 7:17" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write both your static and dynamic ascension paths — how do they complement each other?" },
  ],
  70: [
    { icon: "🏰", tool: "Floor 6 Overview", route: "/palace/floor/6", task: "Full Floor 6 exercise on Daniel 7:13-14 — Cycles + Heavens + Juice + Ascensions" },
    { icon: "🔭", tool: "Prophecy Watch", route: "/prophecy-watch", task: "Trace Daniel 7:13-14 through all 3 heavens and verify your placement" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a comprehensive 2-page placement study on Daniel 7:13-14" },
  ],

  // ═══ FLOOR 7: SPIRITUAL & EMOTIONAL (Days 71-77) ═══
  71: [
    { icon: "🔥", tool: "Devotional Mode", route: "/devotionals", task: "Read Isaiah 53 in Devotional Mode — stop after each verse and feel before analyzing" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Isaiah/53", task: "Re-read Isaiah 53 slowly — journal one emotion per verse" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Which verse made you pause longest? Write what you felt, not what you thought" },
  ],
  72: [
    { icon: "🔥", tool: "Devotional Mode", route: "/devotionals", task: "Gethsemane immersion: read Luke 22:39-46 three times — facts, emotion, presence" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Luke/22", task: "Stay in Luke 22:39-46 for 15 minutes — don't rush, don't analyze, just be there" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Journal what happened in your spirit during 15 minutes in Gethsemane" },
  ],
  73: [
    { icon: "🧘", tool: "Devotional Mode", route: "/devotionals", task: "Slow meditation: take only Psalm 23:1 and spend 10 minutes emphasizing each word differently" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/Psalms/23", task: "Read Psalm 23:1 emphasizing: 'THE Lord,' 'the LORD,' 'the Lord IS,' 'MY shepherd'" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "What did 10 minutes on ONE verse reveal that casual reading misses?" },
  ],
  74: [
    { icon: "🧘", tool: "Devotional Mode", route: "/devotionals", task: "Extended meditation: spend 20 minutes on John 15:4-5 in four 5-minute phases" },
    { icon: "📖", tool: "Bible Reader", route: "/bible/John/15", task: "Read John 15:1-10 as context before your 20-minute meditation session" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "What did 20 minutes produce that 5 minutes could not?" },
  ],
  75: [
    { icon: "⚡", tool: "Speed Drill", route: "/test-me", task: "Complete 3 speed drills: 60-second scan, 2-minute room sprint, 3-minute connection race" },
    { icon: "🎮", tool: "Memory Game", route: "/memory-game", task: "Play a speed round memory game to test rapid Scripture recall" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Score your speed drills: 5+ connections = good, 10+ = excellent, 15+ = master" },
  ],
  76: [
    { icon: "⚡", tool: "Speed Drill", route: "/test-me", task: "Rapid-fire 5 verses in 5 minutes: speed connect + fire identify + then meditate on the hottest one" },
    { icon: "🙏", tool: "Devotional Mode", route: "/devotionals", task: "After your speed round, spend 5 minutes in Meditation Room depth on the verse that burned hottest" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Describe the warrior-poet experience: how do speed and fire work together?" },
  ],
  77: [
    { icon: "🏰", tool: "Floor 7 Overview", route: "/palace/floor/7", task: "Full Floor 7 walkthrough on Psalm 51: Fire → Meditation → Speed" },
    { icon: "🙏", tool: "Devotional Mode", route: "/devotionals", task: "Marinate on Psalm 51:10 ('Create in me a clean heart') for 10 minutes" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a one-page devotional journal combining all three Floor 7 experiences" },
  ],

  // ═══ FLOOR 8: MASTER FLOOR (Days 78-90) ═══
  78: [
    { icon: "♾️", tool: "Full Palace", route: "/palace", task: "Open your Bible randomly — study whatever appears for 10 minutes WITHOUT thinking about room names" },
    { icon: "⚡", tool: "Test Mastery", route: "/test-me", task: "After studying, identify which rooms you naturally used — did you hit 5+ without trying?" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Record which rooms flowed naturally and which you had to consciously activate" },
  ],
  79: [
    { icon: "📢", tool: "Sermon Builder", route: "/sermon-builder", task: "Prepare a 15-minute teaching on Genesis 22 using 6+ Palace principles — never naming any rooms" },
    { icon: "🏰", tool: "Palace Tour", route: "/palace/tour", task: "Review the Palace Tour to refresh your understanding before teaching" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Practice delivering your teaching — does it flow like conversation or like a lecture?" },
  ],
  80: [
    { icon: "⚡", tool: "Speed Test", route: "/test-me", task: "Full palace sprint: apply all 8 floors to Revelation 14:12 in 30 minutes" },
    { icon: "🏋️", tool: "Training Drills", route: "/training-drills", task: "Complete a timed training drill testing each floor's core competency" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a 1-page sprint summary — where did you slow down?" },
  ],
  81: [
    { icon: "♾️", tool: "Full Palace", route: "/palace", task: "Apply full palace mastery to Ezekiel 1 — one of the hardest chapters in the Bible" },
    { icon: "🔬", tool: "Research Mode", route: "/research-mode", task: "Use Research Mode to explore historical interpretations of Ezekiel's throne vision" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a palace study of Ezekiel 1 — if you can study this confidently, the palace works" },
  ],
  82: [
    { icon: "🔍", tool: "Thematic Search", route: "/bible/thematic-search", task: "Create 5 cross-testament bridge studies connecting OT passages to NT fulfillments" },
    { icon: "🔀", tool: "Study Remix", route: "/remix", task: "Remix one of your bridge pairs for fresh insight and connections" },
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Write a synthesis showing the Bible's unity across testaments" },
  ],
  83: [
    { icon: "🏰", tool: "Palace Self-Audit", route: "/palace", task: "Rate yourself 1-10 on every floor — honest assessment of strengths and weaknesses" },
    { icon: "🏋️", tool: "Training Drills", route: "/training-drills", task: "Design a 2-week strengthening plan for your 3 weakest areas" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Identify your unique 'palace signature' — which floors define your study style?" },
  ],
  84: [
    { icon: "📐", tool: "Expansions Review", route: "/ascensions-expansions", task: "Self-assess all 4 expansions: Width, Time, Depth, Height — score 1-10" },
    { icon: "🗺️", tool: "Mind Map Palace", route: "/mind-map", task: "Create a visual mind map of your palace growth across all 4 expansions" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Create a visual 'radar chart' of your growth across all expansions" },
  ],
  85: [
    { icon: "🏰", tool: "Palace Tour", route: "/palace/tour", task: "Review all 10 guardrails — check yourself against each one honestly" },
    { icon: "⚡", tool: "Guardrails Quiz", route: "/test-me", task: "Take a guardrails quiz to test your understanding of each safety rail" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Which guardrail have you most needed? Which most protects your study?" },
  ],
  86: [
    { icon: "📝", tool: "My Studies", route: "/my-studies", task: "Choose your favorite passage — write a 3-5 page masterpiece study using every floor" },
    { icon: "🔊", tool: "Study Amplify", route: "/amplify", task: "Amplify your masterpiece with AI-enhanced insights and connections" },
    { icon: "♾️", tool: "Full Palace", route: "/palace", task: "Let the study flow reflexively (8th Floor) — the method should be invisible" },
  ],
  87: [
    { icon: "📢", tool: "Sermon Builder", route: "/sermon-builder", task: "Prepare a 20-minute teaching from your Day 86 masterpiece — no Palace terminology" },
    { icon: "🍳", tool: "Sermon Simmer", route: "/sermon-simmer", task: "Let your teaching 'simmer' using the Sermon Simmer tool for depth" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Deliver your teaching to someone — journal how they responded" },
  ],
  88: [
    { icon: "🙏", tool: "Devotional Mode", route: "/devotionals", task: "Design your personalized ongoing daily study rhythm using Devotional Mode" },
    { icon: "📅", tool: "Reading Plans", route: "/reading-plans", task: "Create or join a reading plan that sustains your palace practice" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write a one-page 'Palace Lifestyle Covenant' committing to ongoing study" },
  ],
  89: [
    { icon: "🏰", tool: "Review Palace", route: "/palace", task: "Walk through the entire Palace one more time — visit every floor, every room" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write and sign your personal '10 Guardrails Covenant' with an accountability partner" },
    { icon: "⚡", tool: "Final Assessment", route: "/test-me", task: "Take the final palace assessment to see how far you've come" },
  ],
  90: [
    { icon: "🏰", tool: "Your Palace", route: "/palace", task: "Final walkthrough — visit every floor and your favorite room on each" },
    { icon: "🏆", tool: "Achievements", route: "/achievements", task: "View your achievements and celebrate your 90-day completion" },
    { icon: "📝", tool: "My Notes", route: "/notes", task: "Write your testimony: 'How Phototheology changed my Bible study' — share it with someone" },
  ],
};
