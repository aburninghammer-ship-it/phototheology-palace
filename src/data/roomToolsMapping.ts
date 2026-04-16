/**
 * Maps each Palace room to linked platform tools, games, and navigation features.
 * These appear as a "Practice Tools" card grid in the room detail view.
 */

export interface RoomTool {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  category: "nav" | "game" | "tool" | "gpt";
}

export const roomToolsMap: Record<string, RoomTool[]> = {
  // ===== FLOOR 1 — FURNISHING =====
  sr: [
    { id: "sr-bible", name: "Bible Reader", description: "Read and explore Bible stories in context", path: "/bible", icon: "📖", category: "nav" },
    { id: "sr-daily", name: "Daily Reading", description: "Follow a daily Bible reading plan", path: "/daily-reading", icon: "📅", category: "nav" },
    { id: "sr-story-lib", name: "Story Library", description: "Browse curated Bible story collections", path: "/content-library", icon: "📚", category: "tool" },
    { id: "sr-memory", name: "Memory Games", description: "Memorize stories through interactive games", path: "/memory", icon: "🧠", category: "nav" },
    { id: "sr-escape", name: "Escape Room", description: "Story-based puzzle adventure", path: "/escape-room", icon: "🔐", category: "game" },
  ],
  ir: [
    { id: "ir-bible", name: "Bible Reader", description: "Immerse yourself in Scripture passages", path: "/bible", icon: "📖", category: "nav" },
    { id: "ir-image-bible", name: "Image Bible", description: "Visual Bible experience with imagery", path: "/phototheology-image-bible", icon: "🖼️", category: "tool" },
    { id: "ir-devotionals", name: "Devotionals", description: "Reflective devotional experiences", path: "/devotionals", icon: "🕯️", category: "nav" },
    { id: "ir-audio", name: "Audio Bible", description: "Listen and imagine the scenes", path: "/audio-bible", icon: "🎧", category: "tool" },
  ],
  "24fps": [
    { id: "24-image-bible", name: "Image Bible", description: "Visual frames for every chapter", path: "/phototheology-image-bible", icon: "🎬", category: "tool" },
    { id: "24-memory", name: "Memory Hall", description: "Test your chapter-image recall", path: "/memory", icon: "🧠", category: "nav" },
    { id: "24-flashcards", name: "Flashcards", description: "Study chapter frames with flashcards", path: "/flashcards", icon: "🃏", category: "tool" },
  ],
  br: [
    { id: "br-rendered", name: "Bible Rendered Room", description: "All 51 symbolic glyphs for the Bible", path: "/palace/floor/1/room/br", icon: "🔣", category: "tool" },
    { id: "br-image-bible", name: "Image Bible", description: "Visual Bible panorama", path: "/phototheology-image-bible", icon: "🖼️", category: "tool" },
    { id: "br-memory", name: "Memory Games", description: "Test your 51-glyph recall", path: "/memory", icon: "🧠", category: "nav" },
  ],
  tr: [
    { id: "tr-bible", name: "Bible Reader", description: "Read verses to translate into images", path: "/bible", icon: "📖", category: "nav" },
    { id: "tr-image-bible", name: "Image Bible", description: "See verses as visual translations", path: "/phototheology-image-bible", icon: "🎨", category: "tool" },
    { id: "tr-infographic", name: "Infographic Generator", description: "Turn passages into visual infographics", path: "/infographic-generator", icon: "📊", category: "tool" },
  ],
  gr: [
    { id: "gr-gem", name: "Give Me a Gem", description: "Discover and collect Bible gems", path: "/give-me-a-gem", icon: "💎", category: "tool" },
    { id: "gr-sparks", name: "Sparks Library", description: "Browse collected insights and sparks", path: "/sparks-library", icon: "✨", category: "tool" },
    { id: "gr-notes", name: "Notes", description: "Save and organize your gem discoveries", path: "/notes", icon: "📝", category: "nav" },
  ],

  // ===== FLOOR 2 — INVESTIGATION =====
  or: [
    { id: "or-research", name: "Research Mode", description: "Deep investigation tools for Scripture", path: "/research-mode", icon: "🔬", category: "tool" },
    { id: "or-bible", name: "Bible Reader", description: "Observe details in the text", path: "/bible", icon: "📖", category: "nav" },
    { id: "or-interlinear", name: "Interlinear Bible", description: "See original language word-by-word", path: "/interlinear-bible", icon: "📜", category: "tool" },
    { id: "or-treasure", name: "Treasure Hunt", description: "Find hidden gems in passages", path: "/treasure-hunt", icon: "🗺️", category: "game" },
  ],
  dc: [
    { id: "dc-lexicon", name: "Bible Lexicon", description: "Greek & Hebrew word definitions", path: "/bible-lexicon", icon: "📕", category: "tool" },
    { id: "dc-interlinear", name: "Interlinear Bible", description: "Word-by-word original language", path: "/interlinear-bible", icon: "📜", category: "tool" },
    { id: "dc-encyclopedia", name: "Bible Encyclopedia", description: "Cultural and historical context", path: "/bible-encyclopedia", icon: "📚", category: "tool" },
    { id: "dc-commentary", name: "Commentary", description: "Expert scholarly commentary", path: "/bible", icon: "💬", category: "nav" },
  ],
  st: [
    { id: "st-bible", name: "Bible Reader", description: "Find symbols and types in context", path: "/bible", icon: "📖", category: "nav" },
    { id: "st-search", name: "Thematic Search", description: "Search by symbol or type across Scripture", path: "/thematic-search", icon: "🔍", category: "tool" },
    { id: "st-encyclopedia", name: "Bible Encyclopedia", description: "Symbol and type definitions", path: "/bible-encyclopedia", icon: "📚", category: "tool" },
  ],
  qr: [
    { id: "qr-ptgpt", name: "PhototheologyGPT", description: "Ask deep questions with AI guidance", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
    { id: "qr-research", name: "Research Mode", description: "Structured question-based investigation", path: "/research-mode", icon: "🔬", category: "tool" },
    { id: "qr-branch", name: "Branch Study", description: "Follow question threads across Scripture", path: "/branch-study", icon: "🌿", category: "gpt" },
  ],
  qa: [
    { id: "qa-bible-search", name: "Bible Search", description: "Cross-reference verses as witnesses", path: "/bible-search", icon: "🔍", category: "tool" },
    { id: "qa-branch", name: "Branch Study", description: "Trace verse-to-verse connections", path: "/branch-study", icon: "🌿", category: "gpt" },
    { id: "qa-comparison", name: "Comparison Tool", description: "Compare parallel passages side by side", path: "/comparison", icon: "⚖️", category: "tool" },
  ],

  // ===== FLOOR 3 — FREESTYLE =====
  nf: [
    { id: "nf-freestyle", name: "Freestyle Arena", description: "Practice nature-to-Scripture connections", path: "/palace/freestyle", icon: "🌿", category: "tool" },
    { id: "nf-daily-verse", name: "Daily Verse", description: "Start with a verse and connect to nature", path: "/daily-verse", icon: "🌅", category: "nav" },
    { id: "nf-journal", name: "Growth Journal", description: "Journal your nature-Scripture connections", path: "/growth-journal", icon: "📓", category: "tool" },
  ],
  pf: [
    { id: "pf-freestyle", name: "Freestyle Arena", description: "Practice personal life connections", path: "/palace/freestyle", icon: "🏃", category: "tool" },
    { id: "pf-journal", name: "Growth Journal", description: "Journal personal reflections with Scripture", path: "/growth-journal", icon: "📓", category: "tool" },
    { id: "pf-devotionals", name: "Devotionals", description: "Personal devotional experiences", path: "/devotionals", icon: "🕯️", category: "nav" },
    { id: "pf-analyze", name: "Analyze My Thoughts", description: "AI-assisted personal reflection", path: "/analyze-thoughts", icon: "💭", category: "gpt" },
  ],
  bf: [
    { id: "bf-freestyle", name: "Freestyle Arena", description: "Verse Genetics — connect verse families", path: "/palace/freestyle", icon: "🧬", category: "tool" },
    { id: "bf-search", name: "Bible Search", description: "Find verse relatives across Scripture", path: "/bible-search", icon: "🔍", category: "tool" },
    { id: "bf-scrabble", name: "PT Scrabble", description: "Build verse connections competitively", path: "/games", icon: "🎯", category: "game" },
    { id: "bf-chef", name: "Chef Challenge", description: "Cook up connections from random verses", path: "/games/chef-challenge", icon: "👨‍🍳", category: "game" },
  ],
  hf: [
    { id: "hf-freestyle", name: "Freestyle Arena", description: "Connect history and culture to Scripture", path: "/palace/freestyle", icon: "🏛️", category: "tool" },
    { id: "hf-culture", name: "Christ & Culture", description: "Engage current issues through Scripture", path: "/culture-controversy", icon: "⚡", category: "nav" },
    { id: "hf-prophecy-watch", name: "Prophecy Watch", description: "Track how prophecy unfolds in history", path: "/prophecy-watch", icon: "👁️", category: "nav" },
    { id: "hf-timeline", name: "Bible Timeline", description: "See Scripture across historical eras", path: "/bible-timeline", icon: "📅", category: "tool" },
  ],
  lr: [
    { id: "lr-sermons", name: "Sermon Archive", description: "Listen to sermons and make connections", path: "/sermon-archive", icon: "🎙️", category: "tool" },
    { id: "lr-simmer", name: "Sermon Simmer", description: "Process and distill sermon insights", path: "/sermon-simmer", icon: "🫕", category: "tool" },
    { id: "lr-live", name: "Live Study", description: "Join live study sessions and listen", path: "/live-study", icon: "📡", category: "nav" },
    { id: "lr-audio", name: "Audio Bible", description: "Listen to Scripture being read aloud", path: "/audio-bible", icon: "🎧", category: "tool" },
  ],

  // ===== FLOOR 4 — NEXT LEVEL =====
  cr: [
    { id: "cr-cec", name: "Christ in Every Chapter", description: "Find Christ in each chapter", path: "/palace/floor/4/room/cec", icon: "✝️", category: "tool" },
    { id: "cr-ptgpt", name: "PhototheologyGPT", description: "AI-guided Christ-centered study", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
    { id: "cr-concentration", name: "Concentration Game", description: "Focus on finding Christ in texts", path: "/concentration-game", icon: "🎯", category: "game" },
    { id: "cr-bible", name: "Bible Reader", description: "Read with a Christ-centered lens", path: "/bible", icon: "📖", category: "nav" },
  ],
  dr: [
    { id: "dr-ptgpt", name: "PhototheologyGPT", description: "Explore 5 dimensions of any verse", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
    { id: "dr-bible", name: "Bible Reader", description: "Read and apply dimensional analysis", path: "/bible", icon: "📖", category: "nav" },
    { id: "dr-research", name: "Research Mode", description: "Deep dimensional investigation", path: "/research-mode", icon: "🔬", category: "tool" },
  ],
  c6: [
    { id: "c6-bible", name: "Bible Reader", description: "Study genres in their context", path: "/bible", icon: "📖", category: "nav" },
    { id: "c6-encyclopedia", name: "Bible Encyclopedia", description: "Learn about biblical genres", path: "/bible-encyclopedia", icon: "📚", category: "tool" },
    { id: "c6-ptgpt", name: "PhototheologyGPT", description: "AI genre analysis", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
  ],
  trm: [
    { id: "trm-thematic", name: "Thematic Search", description: "Search by theme across Scripture", path: "/thematic-search", icon: "🔍", category: "tool" },
    { id: "trm-bible", name: "Bible Reader", description: "Read with thematic awareness", path: "/bible", icon: "📖", category: "nav" },
    { id: "trm-search", name: "Bible Search", description: "Find verses by theme keywords", path: "/bible-search", icon: "📋", category: "tool" },
  ],
  tz: [
    { id: "tz-timeline", name: "Bible Timeline", description: "Locate texts across past, present, future", path: "/bible-timeline", icon: "⏳", category: "tool" },
    { id: "tz-prophecy", name: "Prophecy Guide", description: "See prophecy across time zones", path: "/bible-prophecy-guide", icon: "🔭", category: "tool" },
    { id: "tz-bible", name: "Bible Reader", description: "Read with temporal awareness", path: "/bible", icon: "📖", category: "nav" },
  ],
  prm: [
    { id: "prm-thematic", name: "Thematic Search", description: "Find repeating patterns across books", path: "/thematic-search", icon: "🔍", category: "tool" },
    { id: "prm-comparison", name: "Comparison Tool", description: "Compare pattern instances side by side", path: "/comparison", icon: "⚖️", category: "tool" },
    { id: "prm-ptgpt", name: "PhototheologyGPT", description: "AI pattern recognition", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
  ],
  "p||": [
    { id: "p-comparison", name: "Comparison Tool", description: "View parallel passages side by side", path: "/comparison", icon: "⚖️", category: "tool" },
    { id: "p-search", name: "Bible Search", description: "Find mirrored actions across time", path: "/bible-search", icon: "🔍", category: "tool" },
    { id: "p-timeline", name: "Bible Timeline", description: "See parallels across historical eras", path: "/bible-timeline", icon: "📅", category: "tool" },
  ],
  frt: [
    { id: "frt-devotionals", name: "Devotionals", description: "Test your study's fruit through devotion", path: "/devotionals", icon: "🕯️", category: "nav" },
    { id: "frt-journal", name: "Growth Journal", description: "Track spiritual fruit from your studies", path: "/growth-journal", icon: "📓", category: "tool" },
    { id: "frt-analyze", name: "Analyze My Thoughts", description: "Reflect on how study shapes your character", path: "/analyze-thoughts", icon: "💭", category: "gpt" },
  ],
  cec: [
    { id: "cec-bible", name: "Bible Reader", description: "Find Christ in every chapter", path: "/bible", icon: "📖", category: "nav" },
    { id: "cec-ptgpt", name: "PhototheologyGPT", description: "AI-guided Christ discovery", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
    { id: "cec-search", name: "Bible Search", description: "Search for Christological references", path: "/bible-search", icon: "🔍", category: "tool" },
  ],
  r66: [
    { id: "r66-bible", name: "Bible Reader", description: "Trace a theme through all 66 books", path: "/bible", icon: "📖", category: "nav" },
    { id: "r66-thematic", name: "Thematic Search", description: "Follow one thread across the canon", path: "/thematic-search", icon: "🔍", category: "tool" },
    { id: "r66-ptgpt", name: "PhototheologyGPT", description: "AI-guided book-by-book tracing", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
  ],

  // ===== FLOOR 5 — VISION =====
  bl: [
    { id: "bl-prophecy", name: "Prophecy Guide", description: "Sanctuary-connected prophecy study", path: "/bible-prophecy-guide", icon: "🔭", category: "tool" },
    { id: "bl-daniel", name: "Daniel & Revelation GPT", description: "AI sanctuary and prophecy guide", path: "/daniel-revelation-gpt", icon: "🤖", category: "gpt" },
    { id: "bl-bible", name: "Bible Reader", description: "Study sanctuary passages in context", path: "/bible", icon: "📖", category: "nav" },
    { id: "bl-encyclopedia", name: "Bible Encyclopedia", description: "Learn about sanctuary furniture and services", path: "/bible-encyclopedia", icon: "📚", category: "tool" },
  ],
  pr: [
    { id: "pr-prophecy", name: "Prophecy Guide", description: "Interactive prophecy timeline explorer", path: "/bible-prophecy-guide", icon: "🔭", category: "tool" },
    { id: "pr-timeline", name: "Bible Timeline", description: "Map prophecy across history", path: "/bible-timeline", icon: "📅", category: "tool" },
    { id: "pr-daniel", name: "Daniel & Revelation GPT", description: "AI prophecy interpretation", path: "/daniel-revelation-gpt", icon: "🤖", category: "gpt" },
    { id: "pr-prophecy-watch", name: "Prophecy Watch", description: "Track prophecy fulfillment today", path: "/prophecy-watch", icon: "👁️", category: "nav" },
  ],
  "3a": [
    { id: "3a-daniel", name: "Daniel & Revelation GPT", description: "Three Angels' Messages AI study", path: "/daniel-revelation-gpt", icon: "🤖", category: "gpt" },
    { id: "3a-prophecy", name: "Prophecy Guide", description: "Study Revelation 14 in depth", path: "/bible-prophecy-guide", icon: "🔭", category: "tool" },
    { id: "3a-bible", name: "Bible Reader", description: "Read Revelation 14:6-12", path: "/bible", icon: "📖", category: "nav" },
  ],
  fe: [
    { id: "fe-bible", name: "Bible Reader", description: "Study feast passages in Leviticus 23", path: "/bible", icon: "📖", category: "nav" },
    { id: "fe-timeline", name: "Bible Timeline", description: "See feasts across redemptive history", path: "/bible-timeline", icon: "📅", category: "tool" },
    { id: "fe-encyclopedia", name: "Bible Encyclopedia", description: "Learn about Israel's feasts", path: "/bible-encyclopedia", icon: "📚", category: "tool" },
  ],

  // ===== FLOOR 6 — THREE HEAVENS =====
  "123h": [
    { id: "123h-prophecy", name: "Prophecy Guide", description: "Explore the three Day-of-the-Lord horizons", path: "/bible-prophecy-guide", icon: "🔭", category: "tool" },
    { id: "123h-timeline", name: "Bible Timeline", description: "See heavens across cosmic history", path: "/bible-timeline", icon: "📅", category: "tool" },
    { id: "123h-daniel", name: "Daniel & Revelation GPT", description: "AI-guided heavens framework", path: "/daniel-revelation-gpt", icon: "🤖", category: "gpt" },
  ],
  cycles: [
    { id: "cy-timeline", name: "Bible Timeline", description: "Map the eight covenant cycles", path: "/bible-timeline", icon: "📅", category: "tool" },
    { id: "cy-bible", name: "Bible Reader", description: "Read cycle-defining passages", path: "/bible", icon: "📖", category: "nav" },
    { id: "cy-ptgpt", name: "PhototheologyGPT", description: "AI cycle placement", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
  ],
  jr: [
    { id: "jr-research", name: "Research Mode", description: "Squeeze a book with all principles", path: "/research-mode", icon: "🔬", category: "tool" },
    { id: "jr-bible", name: "Bible Reader", description: "Select a book to juice", path: "/bible", icon: "📖", category: "nav" },
    { id: "jr-ptgpt", name: "PhototheologyGPT", description: "AI-guided book juicing", path: "/phototheologygpt", icon: "🤖", category: "gpt" },
    { id: "jr-chef", name: "Chef Challenge", description: "Juice verses like a master chef", path: "/games/chef-challenge", icon: "👨‍🍳", category: "game" },
  ],
  math: [
    { id: "math-bible", name: "Bible Reader", description: "Find numerical patterns in Scripture", path: "/bible", icon: "📖", category: "nav" },
    { id: "math-search", name: "Bible Search", description: "Search for number-related passages", path: "/bible-search", icon: "🔍", category: "tool" },
    { id: "math-equations", name: "Equations Challenge", description: "Solve biblical number puzzles", path: "/equations-challenge", icon: "🧮", category: "game" },
  ],

  // ===== FLOOR 7 — SPIRITUAL =====
  frm: [
    { id: "frm-devotionals", name: "Devotionals", description: "Deep emotional devotional experiences", path: "/devotionals", icon: "🕯️", category: "nav" },
    { id: "frm-manna", name: "Living Manna", description: "Daily spiritual nourishment", path: "/living-manna", icon: "🍞", category: "nav" },
    { id: "frm-audio", name: "Audio Bible", description: "Listen and let the Word burn", path: "/audio-bible", icon: "🎧", category: "tool" },
    { id: "frm-journal", name: "Growth Journal", description: "Journal your fire room encounters", path: "/growth-journal", icon: "📓", category: "tool" },
  ],
  mr: [
    { id: "mr-daily-verse", name: "Daily Verse", description: "Meditate on one verse deeply", path: "/daily-verse", icon: "🌅", category: "nav" },
    { id: "mr-devotionals", name: "Devotionals", description: "Slow, meditative devotional reading", path: "/devotionals", icon: "🕯️", category: "nav" },
    { id: "mr-audio", name: "Audio Bible", description: "Slow listening for marination", path: "/audio-bible", icon: "🎧", category: "tool" },
  ],
  srm: [
    { id: "srm-memory", name: "Memory Games", description: "Speed recall training", path: "/memory", icon: "🧠", category: "nav" },
    { id: "srm-flashcards", name: "Flashcards", description: "Rapid-fire verse flashcards", path: "/flashcards", icon: "🃏", category: "tool" },
    { id: "srm-scrabble", name: "PT Scrabble", description: "Fast-paced verse word game", path: "/games", icon: "🎯", category: "game" },
    { id: "srm-drills", name: "Training Drills", description: "Timed recall challenges", path: "/training-drills", icon: "⚡", category: "tool" },
  ],
};

/**
 * Get linked tools for a specific room
 */
export function getToolsForRoom(roomId: string): RoomTool[] {
  return roomToolsMap[roomId] || [];
}

/**
 * Check if a room has any linked tools
 */
export function hasLinkedTools(roomId: string): boolean {
  return (roomToolsMap[roomId]?.length || 0) > 0;
}
