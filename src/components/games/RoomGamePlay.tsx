import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Star, Lightbulb, CheckCircle, XCircle, Loader2, Sparkles, RotateCcw, Flame, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMastery } from "@/hooks/useMastery";
import { Navigation } from "@/components/Navigation";

// Story sequence data for multiple choice games
interface StoryQuiz {
  story: string;
  sequence: string[];
  correct: string[];
  book: string;
  characters?: string[];
  category?: string;
}

const storySequenceQuizzes: StoryQuiz[] = [
  { story: "Joseph's Journey", sequence: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"], correct: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"], book: "Genesis 37-50", category: "Patriarchs" },
  { story: "David and Goliath", sequence: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"], correct: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"], book: "1 Samuel 17", category: "Kings" },
  { story: "Daniel's Trial", sequence: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"], correct: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"], book: "Daniel 1-7", category: "Prophets" },
  { story: "Exodus Journey", sequence: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"], correct: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"], book: "Exodus 3-40", category: "Exodus" },
  { story: "Christ's Passion", sequence: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"], correct: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"], book: "Matthew 26-28", category: "Gospels" },
  { story: "Creation Week", sequence: ["Light Created", "Firmament Divides Waters", "Dry Land and Plants", "Sun Moon and Stars", "Fish and Birds", "Animals and Man", "God Rested"], correct: ["Light Created", "Firmament Divides Waters", "Dry Land and Plants", "Sun Moon and Stars", "Fish and Birds", "Animals and Man", "God Rested"], book: "Genesis 1-2", category: "Primeval" },
  { story: "The Fall of Man", sequence: ["Serpent Questions Eve", "Fruit Eaten", "Eyes Opened", "Hiding from God", "Curses Pronounced", "Expelled from Garden"], correct: ["Serpent Questions Eve", "Fruit Eaten", "Eyes Opened", "Hiding from God", "Curses Pronounced", "Expelled from Garden"], book: "Genesis 3", category: "Primeval" },
  { story: "Noah's Flood", sequence: ["Ark Construction", "Animals Enter", "Rain Begins", "Flood Covers Earth", "Raven Sent Out", "Dove Returns with Olive", "Rainbow Covenant"], correct: ["Ark Construction", "Animals Enter", "Rain Begins", "Flood Covers Earth", "Raven Sent Out", "Dove Returns with Olive", "Rainbow Covenant"], book: "Genesis 6-9", category: "Primeval" },
  { story: "Abraham's Call", sequence: ["Called to Leave Ur", "Arrives in Canaan", "Famine Drives to Egypt", "Returns Wealthy", "Separates from Lot", "Promised Countless Descendants"], correct: ["Called to Leave Ur", "Arrives in Canaan", "Famine Drives to Egypt", "Returns Wealthy", "Separates from Lot", "Promised Countless Descendants"], book: "Genesis 12-13", category: "Patriarchs" },
  { story: "The Binding of Isaac", sequence: ["God Tests Abraham", "Three Day Journey", "Isaac Carries Wood", "Asks About the Lamb", "Bound on Altar", "Ram Caught in Thicket"], correct: ["God Tests Abraham", "Three Day Journey", "Isaac Carries Wood", "Asks About the Lamb", "Bound on Altar", "Ram Caught in Thicket"], book: "Genesis 22", category: "Patriarchs" },
  { story: "Elijah on Mount Carmel", sequence: ["Challenge Issued to Baal Prophets", "Baal Prophets Dance and Cut", "Elijah Mocks Baal", "Altar Drenched with Water", "Fire Falls from Heaven", "Prophets of Baal Slain"], correct: ["Challenge Issued to Baal Prophets", "Baal Prophets Dance and Cut", "Elijah Mocks Baal", "Altar Drenched with Water", "Fire Falls from Heaven", "Prophets of Baal Slain"], book: "1 Kings 18", category: "Prophets" },
  { story: "Ruth's Loyalty", sequence: ["Naomi Loses Husband and Sons", "Ruth Refuses to Leave", "Gleans in Boaz's Field", "Lies at Boaz's Feet", "Boaz Redeems at Gate", "Ruth Bears Obed"], correct: ["Naomi Loses Husband and Sons", "Ruth Refuses to Leave", "Gleans in Boaz's Field", "Lies at Boaz's Feet", "Boaz Redeems at Gate", "Ruth Bears Obed"], book: "Ruth 1-4", category: "Historical" },
  { story: "Jonah and the Great Fish", sequence: ["Called to Go to Nineveh", "Flees on Ship to Tarshish", "Storm Threatens to Sink Ship", "Thrown Overboard", "Swallowed by Great Fish", "Vomited onto Dry Land"], correct: ["Called to Go to Nineveh", "Flees on Ship to Tarshish", "Storm Threatens to Sink Ship", "Thrown Overboard", "Swallowed by Great Fish", "Vomited onto Dry Land"], book: "Jonah 1-2", category: "Prophets" },
  { story: "The Good Samaritan", sequence: ["Man Travels to Jericho", "Robbers Beat and Leave Half Dead", "Priest Passes By", "Levite Passes By", "Samaritan Binds Wounds", "Pays Innkeeper to Care"], correct: ["Man Travels to Jericho", "Robbers Beat and Leave Half Dead", "Priest Passes By", "Levite Passes By", "Samaritan Binds Wounds", "Pays Innkeeper to Care"], book: "Luke 10:25-37", category: "Gospels" },
  { story: "Prodigal Son", sequence: ["Younger Son Asks for Inheritance", "Squanders Wealth in Far Country", "Famine Comes", "Feeds Pigs and Envies Pods", "Returns Home Repentant", "Father Throws Great Feast"], correct: ["Younger Son Asks for Inheritance", "Squanders Wealth in Far Country", "Famine Comes", "Feeds Pigs and Envies Pods", "Returns Home Repentant", "Father Throws Great Feast"], book: "Luke 15:11-32", category: "Gospels" },
  { story: "Paul's Conversion", sequence: ["Saul Persecutes Church", "Bright Light on Damascus Road", "Voice Asks Why Persecuting", "Blinded for Three Days", "Ananias Restores Sight", "Baptized and Preaches Christ"], correct: ["Saul Persecutes Church", "Bright Light on Damascus Road", "Voice Asks Why Persecuting", "Blinded for Three Days", "Ananias Restores Sight", "Baptized and Preaches Christ"], book: "Acts 9:1-19", category: "Acts" },
  { story: "Pentecost", sequence: ["Disciples Gathered in Upper Room", "Sound Like Rushing Wind", "Tongues of Fire Appear", "Speak in Other Languages", "Crowd Amazed and Perplexed", "Peter Preaches 3000 Saved"], correct: ["Disciples Gathered in Upper Room", "Sound Like Rushing Wind", "Tongues of Fire Appear", "Speak in Other Languages", "Crowd Amazed and Perplexed", "Peter Preaches 3000 Saved"], book: "Acts 2:1-41", category: "Acts" },
  { story: "Walls of Jericho", sequence: ["Spies Hidden by Rahab", "March Around City Once Daily", "Seven Times on Seventh Day", "Priests Blow Trumpets", "People Shout", "Walls Fall Flat"], correct: ["Spies Hidden by Rahab", "March Around City Once Daily", "Seven Times on Seventh Day", "Priests Blow Trumpets", "People Shout", "Walls Fall Flat"], book: "Joshua 6", category: "Conquest" },
  { story: "Jesus Feeds 5000", sequence: ["Crowds Follow Jesus", "Disciples Want to Send Away", "Boy Has Five Loaves Two Fish", "Jesus Blesses and Breaks", "All Eat and Are Satisfied", "Twelve Baskets Left Over"], correct: ["Crowds Follow Jesus", "Disciples Want to Send Away", "Boy Has Five Loaves Two Fish", "Jesus Blesses and Breaks", "All Eat and Are Satisfied", "Twelve Baskets Left Over"], book: "John 6:1-14", category: "Gospels" },
  { story: "Raising of Lazarus", sequence: ["Lazarus Falls Sick", "Jesus Delays Two Days", "Lazarus Dies and Is Buried", "Jesus Weeps at Tomb", "Stone Rolled Away", "Lazarus Comes Out Bound"], correct: ["Lazarus Falls Sick", "Jesus Delays Two Days", "Lazarus Dies and Is Buried", "Jesus Weeps at Tomb", "Stone Rolled Away", "Lazarus Comes Out Bound"], book: "John 11:1-44", category: "Gospels" },
];

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Games that should use interactive multiple choice mode
const interactiveGameTypes = ["story_sequence", "genesis_chapters", "story_beats", "story_match", "narrative_chain"];

// Genesis chapter data for HighRise game
const genesisChapters: { chapter: number; event: string; options: string[] }[] = [
  { chapter: 1, event: "Creation of the world in 6 days", options: ["Creation of the world in 6 days", "Noah builds the ark", "Abraham's call", "Jacob's ladder"] },
  { chapter: 3, event: "The Fall of Man - serpent deceives Eve", options: ["The Fall of Man - serpent deceives Eve", "Cain kills Abel", "Tower of Babel", "Flood begins"] },
  { chapter: 6, event: "God instructs Noah to build the ark", options: ["God instructs Noah to build the ark", "Abraham sacrifices Isaac", "Joseph sold into slavery", "Jacob wrestles angel"] },
  { chapter: 11, event: "Tower of Babel - languages confused", options: ["Tower of Babel - languages confused", "Call of Abraham", "Birth of Isaac", "Jacob's deception"] },
  { chapter: 12, event: "Call of Abram to leave Ur", options: ["Call of Abram to leave Ur", "Destruction of Sodom", "Birth of Jacob and Esau", "Joseph's dreams"] },
  { chapter: 15, event: "Covenant of the pieces with Abram", options: ["Covenant of the pieces with Abram", "Hagar and Ishmael", "Destruction of Sodom", "Sacrifice of Isaac"] },
  { chapter: 19, event: "Destruction of Sodom and Gomorrah", options: ["Destruction of Sodom and Gomorrah", "Binding of Isaac", "Jacob steals blessing", "Joseph interprets dreams"] },
  { chapter: 22, event: "Abraham offers Isaac on Mount Moriah", options: ["Abraham offers Isaac on Mount Moriah", "Jacob's ladder", "Joseph sold to Egypt", "Creation week"] },
  { chapter: 27, event: "Jacob steals Esau's blessing", options: ["Jacob steals Esau's blessing", "Joseph's coat of colors", "Abraham's death", "Tower of Babel"] },
  { chapter: 28, event: "Jacob's ladder at Bethel", options: ["Jacob's ladder at Bethel", "Joseph in prison", "Binding of Isaac", "Noah's ark"] },
  { chapter: 32, event: "Jacob wrestles with the angel", options: ["Jacob wrestles with the angel", "Joseph interprets Pharaoh's dreams", "Abraham buys burial cave", "Flood waters recede"] },
  { chapter: 37, event: "Joseph's dreams and coat of colors", options: ["Joseph's dreams and coat of colors", "Jacob's ladder", "Abraham's covenant", "Tower of Babel"] },
  { chapter: 39, event: "Joseph resists Potiphar's wife", options: ["Joseph resists Potiphar's wife", "Joseph interprets butler's dream", "Jacob blessed by Isaac", "Noah plants vineyard"] },
  { chapter: 41, event: "Joseph interprets Pharaoh's dreams", options: ["Joseph interprets Pharaoh's dreams", "Joseph reveals himself to brothers", "Jacob wrestles angel", "Abraham tested"] },
  { chapter: 45, event: "Joseph reveals himself to brothers", options: ["Joseph reveals himself to brothers", "Jacob blesses 12 sons", "Joseph in prison", "Abraham's death"] },
  { chapter: 50, event: "Death of Joseph in Egypt", options: ["Death of Joseph in Egypt", "Jacob enters Egypt", "Joseph sold by brothers", "Abraham buried"] },
];

// Story beats data
const storyBeatQuizzes: { story: string; beats: { type: string; description: string }[]; book: string }[] = [
  {
    story: "David and Goliath",
    beats: [
      { type: "Setup", description: "Israel faces Philistines; Goliath challenges daily" },
      { type: "Catalyst", description: "Young David arrives with supplies for brothers" },
      { type: "Rising Action", description: "David volunteers despite skepticism" },
      { type: "Midpoint", description: "David refuses armor, chooses 5 smooth stones" },
      { type: "Crisis", description: "Goliath mocks the young shepherd" },
      { type: "Climax", description: "Stone from sling strikes Goliath's forehead" },
      { type: "Resolution", description: "Philistines flee; Israel victorious" }
    ],
    book: "1 Samuel 17"
  },
  {
    story: "Jonah",
    beats: [
      { type: "Setup", description: "God calls Jonah to preach to Nineveh" },
      { type: "Catalyst", description: "Jonah flees on ship to Tarshish" },
      { type: "Rising Action", description: "Violent storm endangers all aboard" },
      { type: "Midpoint", description: "Jonah thrown overboard, swallowed by fish" },
      { type: "Crisis", description: "Three days in fish's belly" },
      { type: "Climax", description: "Vomited onto dry land, obeys God" },
      { type: "Resolution", description: "Nineveh repents; city spared" }
    ],
    book: "Jonah 1-4"
  },
  {
    story: "The Prodigal Son",
    beats: [
      { type: "Setup", description: "Younger son demands inheritance early" },
      { type: "Catalyst", description: "Leaves home for distant country" },
      { type: "Rising Action", description: "Squanders wealth in wild living" },
      { type: "Midpoint", description: "Famine hits; feeds pigs, starving" },
      { type: "Crisis", description: "Realizes servants live better than him" },
      { type: "Climax", description: "Returns home; father runs to embrace" },
      { type: "Resolution", description: "Feast thrown; son restored" }
    ],
    book: "Luke 15:11-32"
  },
];

// Story identification data
const storyIdentification: { scenes: string[]; story: string; book: string; options: string[] }[] = [
  { scenes: ["A young man thrown into a pit", "Sold to merchants for silver", "False accusation by master's wife"], story: "Joseph in Egypt", book: "Genesis 37-39", options: ["Joseph in Egypt", "Daniel in Babylon", "Moses in Egypt", "David on the run"] },
  { scenes: ["Water turned to blood", "Darkness covers the land", "Firstborn struck down"], story: "The Ten Plagues", book: "Exodus 7-12", options: ["The Ten Plagues", "Elijah's drought", "Joshua's conquest", "The Flood"] },
  { scenes: ["Walking on dry ground through the sea", "Pillar of fire by night", "Manna from heaven"], story: "The Exodus", book: "Exodus 14-16", options: ["The Exodus", "Elijah's journey", "Joshua at Jordan", "Noah's voyage"] },
  { scenes: ["A burning bush that doesn't consume", "Staff becomes serpent", "Hand turns leprous then healed"], story: "Moses' Calling", book: "Exodus 3-4", options: ["Moses' Calling", "Elijah at Horeb", "Isaiah's vision", "Ezekiel's calling"] },
  { scenes: ["Trumpets sounding", "Marching around walls seven times", "Walls fall flat"], story: "Battle of Jericho", book: "Joshua 6", options: ["Battle of Jericho", "Gideon's battle", "David vs Goliath", "Jehoshaphat's victory"] },
  { scenes: ["Hair cut while sleeping", "Eyes gouged out", "Pillars pushed apart"], story: "Samson's End", book: "Judges 16", options: ["Samson's End", "David's shame", "Solomon's folly", "Absalom's death"] },
  { scenes: ["Ravens bring food", "Widow's oil multiplied", "Fire falls from heaven"], story: "Elijah's Ministry", book: "1 Kings 17-18", options: ["Elijah's Ministry", "Elisha's miracles", "Moses at Sinai", "Samuel's calling"] },
  { scenes: ["Water from rock", "Bronze serpent on pole", "Ground opens up"], story: "Wilderness Wanderings", book: "Numbers 20-21", options: ["Wilderness Wanderings", "Exodus journey", "Joshua's conquest", "Judges cycle"] },
];

interface GameConfig {
  id: string;
  name: string;
  roomId: string;
  roomName: string;
  description: string;
  icon: string;
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  gameType: string;
  instructions: string;
}

// Complete game configurations - EVERY game has unique content
const gameConfigs: Record<string, GameConfig> = {
  // ===== FLOOR 1 - STORY ROOM =====
  "sr-sequence": {
    id: "sr-sequence", name: "Story Sequence", roomId: "sr", roomName: "Story Room",
    description: "Arrange Bible stories in chronological order", icon: "📖", xpReward: 25, difficulty: "easy",
    gameType: "story_sequence",
    instructions: "List 5 Bible stories from Genesis to Revelation in their correct chronological order. Explain the timeline connection between each."
  },
  "sr-genesis": {
    id: "sr-genesis", name: "Genesis HighRise", roomId: "sr", roomName: "Story Room",
    description: "Build the Genesis tower chapter by chapter", icon: "🏗️", xpReward: 35, difficulty: "medium",
    gameType: "genesis_chapters",
    instructions: "Summarize any 5 consecutive chapters of Genesis. Each summary should be 2-3 sentences capturing the key narrative beats."
  },
  "sr-beat-builder": {
    id: "sr-beat-builder", name: "Beat Builder", roomId: "sr", roomName: "Story Room",
    description: "Create story beats from narrative passages", icon: "🎬", xpReward: 30, difficulty: "medium",
    gameType: "story_beats",
    instructions: "Choose ONE Bible story and break it into exactly 7 story beats (setup, catalyst, rising action, midpoint, crisis, climax, resolution)."
  },
  "sr-story-race": {
    id: "sr-story-race", name: "Story Race", roomId: "sr", roomName: "Story Room",
    description: "Speed-match stories to their beat lists", icon: "🏃", xpReward: 40, difficulty: "hard",
    gameType: "story_match",
    instructions: "I'll describe a sequence of events. Identify the Bible story, the main characters, and the book where it's found. Be specific!"
  },
  "sr-narrative-chain": {
    id: "sr-narrative-chain", name: "Narrative Chain", roomId: "sr", roomName: "Story Room",
    description: "Chain connected stories across books", icon: "🔗", xpReward: 45, difficulty: "hard",
    gameType: "narrative_chain",
    instructions: "Choose a theme (covenant, promise, deliverance, etc.) and trace it through 5 connected stories from different books. Show how each story builds on the previous."
  },

  // ===== FLOOR 1 - IMAGINATION ROOM =====
  "ir-immersion": {
    id: "ir-immersion", name: "Immersion Chamber", roomId: "ir", roomName: "Imagination Room",
    description: "Deep sensory experience in biblical scenes", icon: "👁️", xpReward: 35, difficulty: "medium",
    gameType: "scene_immersion",
    instructions: "Choose a biblical scene and describe it as if you were INSIDE it. Include: what the ground feels like under your feet, the temperature, sounds, smells, and your emotional state."
  },
  "ir-frame-snapshot": {
    id: "ir-frame-snapshot", name: "Frame Snapshot", roomId: "ir", roomName: "Imagination Room",
    description: "Visualize and describe biblical scenes vividly", icon: "📸", xpReward: 30, difficulty: "medium",
    gameType: "frame_snapshot",
    instructions: "Freeze ONE moment in a Bible story. Describe this frozen frame in vivid detail: positions of people, expressions, lighting, setting, tension in the air."
  },
  "ir-sense-finder": {
    id: "ir-sense-finder", name: "Sense Finder", roomId: "ir", roomName: "Imagination Room",
    description: "Identify all 5 senses in a passage", icon: "🎭", xpReward: 25, difficulty: "easy",
    gameType: "five_senses",
    instructions: "Choose a Bible scene. List what you would SEE, HEAR, SMELL, TASTE, and TOUCH. Each sense needs at least 2 specific details."
  },
  "ir-scene-painter": {
    id: "ir-scene-painter", name: "Scene Painter", roomId: "ir", roomName: "Imagination Room",
    description: "Paint a scene with words", icon: "🎨", xpReward: 35, difficulty: "medium",
    gameType: "scene_painting",
    instructions: "Write a 150-word 'painting' of a Bible scene using only descriptive language. No dialogue, no action - just the setting and atmosphere."
  },
  "ir-empathy-walk": {
    id: "ir-empathy-walk", name: "Empathy Walk", roomId: "ir", roomName: "Imagination Room",
    description: "Step into a biblical character's shoes", icon: "👣", xpReward: 45, difficulty: "hard",
    gameType: "character_empathy",
    instructions: "Choose a biblical character at a pivotal moment. Write a first-person internal monologue: their fears, hopes, doubts, and faith."
  },

  // ===== FLOOR 1 - 24FPS ROOM =====
  "24fps-chapter": {
    id: "24fps-chapter", name: "24FPS Challenge", roomId: "24fps", roomName: "24FPS Room",
    description: "Create memorable chapter image associations", icon: "🎬", xpReward: 35, difficulty: "medium",
    gameType: "chapter_frames",
    instructions: "Create ONE memorable visual symbol for each chapter in a sequence of 5 chapters. Each symbol should be strange/memorable enough to stick in memory."
  },
  "24fps-genesis": {
    id: "24fps-genesis", name: "Genesis Frames", roomId: "24fps", roomName: "24FPS Room",
    description: "Build frames for Genesis 1-50", icon: "🏗️", xpReward: 25, difficulty: "easy",
    gameType: "genesis_frames",
    instructions: "Create memorable image symbols for Genesis chapters. Each should be a single vivid image that captures the chapter's main event."
  },
  "24fps-match": {
    id: "24fps-match", name: "Frame Match", roomId: "24fps", roomName: "24FPS Room",
    description: "Match chapters to their visual frames", icon: "🖼️", xpReward: 30, difficulty: "medium",
    gameType: "frame_match",
    instructions: "I'll give you 5 chapter symbols. Identify which chapter of which book each represents and explain why the symbol fits."
  },
  "24fps-sprint": {
    id: "24fps-sprint", name: "Frame Sprint", roomId: "24fps", roomName: "24FPS Room",
    description: "Rapid-fire chapter identification", icon: "⚡", xpReward: 40, difficulty: "hard",
    gameType: "frame_sprint",
    instructions: "Given a book of the Bible, create memorable frames for 10 consecutive chapters as fast as possible. Quality + speed = higher score."
  },
  "24fps-gallery": {
    id: "24fps-gallery", name: "Gallery Walk", roomId: "24fps", roomName: "24FPS Room",
    description: "Navigate a visual Bible gallery", icon: "🏛️", xpReward: 35, difficulty: "medium",
    gameType: "gallery_walk",
    instructions: "Design a 'gallery room' for one book of the Bible. Describe 7 'paintings' that would hang on the walls representing key chapters."
  },

  // ===== FLOOR 1 - BIBLE RENDERED =====
  "br-render": {
    id: "br-render", name: "Bible Rendered", roomId: "br", roomName: "Bible Rendered Room",
    description: "Create glyphs for 24-chapter blocks", icon: "🖼️", xpReward: 45, difficulty: "hard",
    gameType: "render_glyph",
    instructions: "Create ONE master symbol/glyph that represents an entire 24-chapter block (e.g., Genesis 1-24). Explain how it captures the major themes."
  },
  "br-glyph-match": {
    id: "br-glyph-match", name: "Glyph Match", roomId: "br", roomName: "Bible Rendered Room",
    description: "Match 24-chapter blocks to symbols", icon: "🔣", xpReward: 35, difficulty: "medium",
    gameType: "glyph_match",
    instructions: "Match these symbols to their 24-chapter blocks. Explain the connection between symbol and content."
  },
  "br-panorama": {
    id: "br-panorama", name: "Bible Panorama", roomId: "br", roomName: "Bible Rendered Room",
    description: "Fly over the 51-frame Bible legend", icon: "🗺️", xpReward: 30, difficulty: "medium",
    gameType: "bible_panorama",
    instructions: "Describe the 'flight path' over 5 consecutive 24-chapter blocks. What major landmarks would you see? What's the terrain like?"
  },
  "br-compression": {
    id: "br-compression", name: "Compression Master", roomId: "br", roomName: "Bible Rendered Room",
    description: "Compress themes into single symbols", icon: "📦", xpReward: 40, difficulty: "hard",
    gameType: "theme_compression",
    instructions: "Take a major biblical theme (covenant, redemption, judgment) and compress it into ONE symbol that appears across multiple 24-chapter blocks."
  },
  "br-memory": {
    id: "br-memory", name: "Memory Scan", roomId: "br", roomName: "Bible Rendered Room",
    description: "Test your 51-frame legend recall", icon: "🧠", xpReward: 50, difficulty: "hard",
    gameType: "memory_scan",
    instructions: "List the 10 most important 24-chapter blocks and their symbols. Explain why these blocks are pivotal to the Bible's story."
  },

  // ===== FLOOR 1 - TRANSLATION ROOM =====
  "tr-verse-icon": {
    id: "tr-verse-icon", name: "Verse to Icon", roomId: "tr", roomName: "Translation Room",
    description: "Convert verses into memorable images", icon: "🎨", xpReward: 20, difficulty: "easy",
    gameType: "verse_to_icon",
    instructions: "Take 3 verses and create a single memorable image for each. The image should capture the verse's core truth in visual form."
  },
  "tr-comic": {
    id: "tr-comic", name: "Comic Creator", roomId: "tr", roomName: "Translation Room",
    description: "Turn passages into 3-panel comics", icon: "📰", xpReward: 35, difficulty: "medium",
    gameType: "passage_comic",
    instructions: "Turn a short passage into a 3-panel comic. Describe each panel: the setting, characters, speech bubbles, and visual elements."
  },
  "tr-mural": {
    id: "tr-mural", name: "Mural Builder", roomId: "tr", roomName: "Translation Room",
    description: "Create panoramic book visualizations", icon: "🖌️", xpReward: 45, difficulty: "hard",
    gameType: "book_mural",
    instructions: "Design a mural for one book of the Bible. Describe the overall composition, key scenes, color symbolism, and central focal point."
  },
  "tr-concentration": {
    id: "tr-concentration", name: "Image Match", roomId: "tr", roomName: "Translation Room",
    description: "Memory matching with verse images", icon: "🧠", xpReward: 25, difficulty: "easy",
    gameType: "image_match",
    instructions: "Create pairs of images that match to verses. Each image pair should share a thematic connection that reveals a deeper truth."
  },
  "tr-translate": {
    id: "tr-translate", name: "Visual Translator", roomId: "tr", roomName: "Translation Room",
    description: "Abstract to concrete image conversion", icon: "🔄", xpReward: 30, difficulty: "medium",
    gameType: "abstract_visual",
    instructions: "Take an abstract theological concept (grace, faith, justification) and create 3 concrete visual images that explain it to a child."
  },

  // ===== FLOOR 1 - GEMS ROOM =====
  "gr-treasure": {
    id: "gr-treasure", name: "Treasure Hunt", roomId: "gr", roomName: "Gems Room",
    description: "Mine Scripture for rare combined truths", icon: "💎", xpReward: 40, difficulty: "medium",
    gameType: "gem_mining",
    instructions: "Combine 2-3 seemingly unrelated verses to discover a hidden gem truth that none of them reveal alone. Explain the discovery."
  },
  "gr-chef": {
    id: "gr-chef", name: "Gem Chef", roomId: "gr", roomName: "Gems Room",
    description: "Cook up theological connections", icon: "👨‍🍳", xpReward: 50, difficulty: "hard",
    gameType: "gem_cooking",
    instructions: "Take 4 'ingredients' (verses from different books) and 'cook' them into one cohesive theological insight. Show your recipe!"
  },
  "gr-combiner": {
    id: "gr-combiner", name: "Gem Combiner", roomId: "gr", roomName: "Gems Room",
    description: "Place 2-4 texts to discover insights", icon: "⚗️", xpReward: 45, difficulty: "hard",
    gameType: "gem_combining",
    instructions: "Combine exactly 3 OT and 2 NT texts to forge ONE brilliant insight about Christ. Show how each text contributes to the gem."
  },
  "gr-collector": {
    id: "gr-collector", name: "Gem Collector", roomId: "gr", roomName: "Gems Room",
    description: "Build your personal gem treasury", icon: "👑", xpReward: 35, difficulty: "medium",
    gameType: "gem_collection",
    instructions: "Share 3 personal gems you've discovered in Scripture. Each should be: (1) surprising, (2) Christ-centered, (3) practically applicable."
  },
  "gr-polish": {
    id: "gr-polish", name: "Gem Polish", roomId: "gr", roomName: "Gems Room",
    description: "Refine rough insights into clear gems", icon: "✨", xpReward: 30, difficulty: "medium",
    gameType: "gem_polishing",
    instructions: "Take a rough theological observation and polish it into a crystal-clear, memorable gem statement. Show the before and after."
  },

  // ===== FLOOR 2 - OBSERVATION ROOM =====
  "or-detective": {
    id: "or-detective", name: "Observation Detective", roomId: "or", roomName: "Observation Room",
    description: "Find details others miss in the text", icon: "🔍", xpReward: 35, difficulty: "medium",
    gameType: "text_detective",
    instructions: "Read a passage and find 10 details that most readers miss: unusual words, repeated phrases, structural patterns, surprising omissions."
  },
  "or-witness": {
    id: "or-witness", name: "Witness Trial", roomId: "or", roomName: "Observation Room",
    description: "Cross-examine Scripture passages", icon: "⚖️", xpReward: 45, difficulty: "hard",
    gameType: "witness_trial",
    instructions: "Cross-examine a passage like a lawyer. Ask 10 probing questions that reveal inconsistencies, tensions, or hidden meanings."
  },
  "or-fingerprint": {
    id: "or-fingerprint", name: "Fingerprint Logger", roomId: "or", roomName: "Observation Room",
    description: "Catalog observations without interpretation", icon: "🔎", xpReward: 25, difficulty: "easy",
    gameType: "observation_log",
    instructions: "Read a passage and list 15 pure observations (what you SEE in the text). No interpretations allowed - just facts!"
  },
  "or-scene": {
    id: "or-scene", name: "Crime Scene", roomId: "or", roomName: "Observation Room",
    description: "Investigate a passage like a detective", icon: "🕵️", xpReward: 35, difficulty: "medium",
    gameType: "crime_scene",
    instructions: "Treat a passage as a crime scene. Log all 'evidence': who's present, what happened, the sequence, witnesses, motive, and outcome."
  },
  "or-30": {
    id: "or-30", name: "30 Observations", roomId: "or", roomName: "Observation Room",
    description: "Generate 30 observations from one text", icon: "📝", xpReward: 50, difficulty: "hard",
    gameType: "observations_30",
    instructions: "Choose a short passage (5-10 verses) and generate exactly 30 distinct observations. Categories: setting, characters, actions, speech, structure."
  },

  // ===== FLOOR 2 - DEF-COM ROOM =====
  "dc-equation": {
    id: "dc-equation", name: "Equation Builder", roomId: "dc", roomName: "Def-Com Room",
    description: "Build theological equations from symbols", icon: "🧮", xpReward: 50, difficulty: "hard",
    gameType: "theological_equation",
    instructions: "Create a theological equation using symbols (Lamb + Altar = Atonement). Define each symbol and prove the equation from Scripture."
  },
  "dc-challenge": {
    id: "dc-challenge", name: "Equations Challenge", roomId: "dc", roomName: "Def-Com Room",
    description: "Solve symbolic Bible puzzles", icon: "🔢", xpReward: 45, difficulty: "hard",
    gameType: "equation_solve",
    instructions: "Solve this equation: [Symbol] + [Symbol] = [Result]. Identify what each symbol represents and the Scripture proof."
  },
  "dc-word-lab": {
    id: "dc-word-lab", name: "Word Lab", roomId: "dc", roomName: "Def-Com Room",
    description: "Deep Greek/Hebrew word analysis", icon: "🔬", xpReward: 35, difficulty: "medium",
    gameType: "word_study",
    instructions: "Take one Greek or Hebrew word. Explain its root meaning, semantic range, and how understanding it changes our reading of 3 passages."
  },
  "dc-culture": {
    id: "dc-culture", name: "Culture Context", roomId: "dc", roomName: "Def-Com Room",
    description: "Historical and cultural background study", icon: "📚", xpReward: 30, difficulty: "medium",
    gameType: "cultural_context",
    instructions: "Choose a passage and explain 5 cultural/historical details that modern readers miss. How does this context change interpretation?"
  },
  "dc-compare": {
    id: "dc-compare", name: "Version Compare", roomId: "dc", roomName: "Def-Com Room",
    description: "Compare translations for insight", icon: "📖", xpReward: 25, difficulty: "easy",
    gameType: "translation_compare",
    instructions: "Compare 3 translations of one verse. What differences do you notice? Which translation best captures the original meaning and why?"
  },

  // ===== FLOOR 2 - SYMBOLS/TYPES ROOM =====
  "st-connection": {
    id: "st-connection", name: "Symbol Connections", roomId: "st", roomName: "Symbols/Types Room",
    description: "Link symbols to their biblical meanings", icon: "🔗", xpReward: 35, difficulty: "medium",
    gameType: "symbol_links",
    instructions: "Take 5 biblical symbols (lamb, rock, vine, etc.) and trace each through 3 passages showing consistent meaning. Map the connections."
  },
  "st-chain": {
    id: "st-chain", name: "Chain Chess", roomId: "st", roomName: "Symbols/Types Room",
    description: "Build symbolic verse chains", icon: "♟️", xpReward: 50, difficulty: "hard",
    gameType: "symbol_chain",
    instructions: "Build a chain of 7 verses connected by ONE symbol. Each verse must develop the symbol's meaning further. Show the progression."
  },
  "st-profile": {
    id: "st-profile", name: "Symbol Profile", roomId: "st", roomName: "Symbols/Types Room",
    description: "Build profiles for major biblical symbols", icon: "📋", xpReward: 35, difficulty: "medium",
    gameType: "symbol_profile",
    instructions: "Create a complete profile for one biblical symbol: definition, key verses, what it represents, misuses, and Christ-connection."
  },
  "st-type-finder": {
    id: "st-type-finder", name: "Type Finder", roomId: "st", roomName: "Symbols/Types Room",
    description: "Identify OT types of Christ", icon: "👤", xpReward: 45, difficulty: "hard",
    gameType: "type_finder",
    instructions: "Identify 5 OT types of Christ. For each: the OT event/person, the NT fulfillment, and 3 parallel details between type and antitype."
  },
  "st-decode": {
    id: "st-decode", name: "Symbol Decode", roomId: "st", roomName: "Symbols/Types Room",
    description: "Decode symbolic language in prophecy", icon: "🗝️", xpReward: 50, difficulty: "hard",
    gameType: "prophecy_decode",
    instructions: "Take a prophetic passage with symbols (Daniel or Revelation). Decode each symbol using Scripture-interprets-Scripture method."
  },

  // ===== FLOOR 2 - QUESTIONS ROOM =====
  "qr-blitz": {
    id: "qr-blitz", name: "Question Blitz", roomId: "qr", roomName: "Questions Room",
    description: "Generate questions rapidly from text", icon: "❓", xpReward: 30, difficulty: "medium",
    gameType: "question_blitz",
    instructions: "Generate 20 questions from one passage in 5 minutes. Include who, what, when, where, why, and how questions."
  },
  "qr-escape": {
    id: "qr-escape", name: "Escape Room", roomId: "qr", roomName: "Questions Room",
    description: "Solve puzzles through questions", icon: "🚪", xpReward: 60, difficulty: "hard",
    gameType: "question_escape",
    instructions: "Answer these 5 questions correctly to 'escape.' Each answer unlocks the next question. Wrong answers add time!"
  },
  "qr-75": {
    id: "qr-75", name: "75 Questions", roomId: "qr", roomName: "Questions Room",
    description: "Generate 75 questions from one passage", icon: "🤔", xpReward: 55, difficulty: "hard",
    gameType: "questions_75",
    instructions: "Generate 75 questions: 25 intratextual (within text), 25 intertextual (cross-reference), 25 Phototheological (PT framework)."
  },
  "qr-intra": {
    id: "qr-intra", name: "Intratextual Quiz", roomId: "qr", roomName: "Questions Room",
    description: "Questions within the text itself", icon: "📖", xpReward: 35, difficulty: "medium",
    gameType: "intratextual",
    instructions: "Generate 15 intratextual questions - questions answerable ONLY from the passage itself. No outside knowledge needed."
  },
  "qr-inter": {
    id: "qr-inter", name: "Intertextual Quiz", roomId: "qr", roomName: "Questions Room",
    description: "Cross-reference questions", icon: "🔀", xpReward: 45, difficulty: "hard",
    gameType: "intertextual",
    instructions: "Generate 15 intertextual questions - questions that require other Scripture passages to answer. Provide the cross-references."
  },

  // ===== FLOOR 2 - Q&A ROOM =====
  "qa-branch": {
    id: "qa-branch", name: "Branch Study", roomId: "qa", roomName: "Q&A Room",
    description: "Build question-answer branches", icon: "🌳", xpReward: 40, difficulty: "medium",
    gameType: "branch_study",
    instructions: "Start with one question. Branch into 3 sub-questions. Answer each with Scripture. Show the Q&A tree structure."
  },
  "qa-chain": {
    id: "qa-chain", name: "Q&A Chains", roomId: "qa", roomName: "Q&A Room",
    description: "Chain verses that answer each other", icon: "💬", xpReward: 35, difficulty: "medium",
    gameType: "qa_chain",
    instructions: "Create a chain where each verse answers a question raised by the previous verse. Build a chain of 7 question-answer pairs."
  },
  "qa-courtroom": {
    id: "qa-courtroom", name: "Courtroom Cross", roomId: "qa", roomName: "Q&A Room",
    description: "Cross-examine with verse answers", icon: "⚖️", xpReward: 50, difficulty: "hard",
    gameType: "courtroom_cross",
    instructions: "Play prosecutor and defense. Ask 5 challenging questions about a doctrine. Answer each with Scripture as your witness."
  },
  "qa-alibi": {
    id: "qa-alibi", name: "Alibi Check", roomId: "qa", roomName: "Q&A Room",
    description: "Verify Scripture interpretations", icon: "🔍", xpReward: 35, difficulty: "medium",
    gameType: "alibi_check",
    instructions: "Take a common interpretation. Find 3 verses that support it and 2 that seem to challenge it. How do you reconcile them?"
  },
  "qa-witness": {
    id: "qa-witness", name: "Witness Box", roomId: "qa", roomName: "Q&A Room",
    description: "Let Scripture answer Scripture", icon: "📜", xpReward: 45, difficulty: "hard",
    gameType: "witness_box",
    instructions: "Put a verse 'in the witness box.' Ask it 10 questions. Let OTHER Scriptures provide the answers. Document the testimony."
  },

  // Continue with Floor 3-8 games...
  // ===== FLOOR 3 - NATURE FREESTYLE =====
  "nf-nature": {
    id: "nf-nature", name: "Nature Connections", roomId: "nf", roomName: "Nature Freestyle",
    description: "Find Scripture lessons in nature", icon: "🌿", xpReward: 35, difficulty: "medium",
    gameType: "nature_connections",
    instructions: "Choose 3 elements from nature. For each, find a Scripture parallel and explain the spiritual lesson. Be creative and specific."
  },
  "nf-freestyle": {
    id: "nf-freestyle", name: "Nature Freestyle", roomId: "nf", roomName: "Nature Freestyle",
    description: "Riff on natural world with Scripture", icon: "🌳", xpReward: 40, difficulty: "medium",
    gameType: "nature_freestyle",
    instructions: "Take one natural phenomenon (sunrise, storm, seed growth) and write a 5-minute devotional connecting it to 3 Scripture passages."
  },
  "nf-romans": {
    id: "nf-romans", name: "Romans 1:20 Walk", roomId: "nf", roomName: "Nature Freestyle",
    description: "See God's attributes in creation", icon: "🌄", xpReward: 25, difficulty: "easy",
    gameType: "romans_walk",
    instructions: "List 5 things in nature that reveal God's attributes (power, wisdom, love, order). Cite Romans 1:20 and expand on each."
  },
  "nf-parable": {
    id: "nf-parable", name: "Nature Parable", roomId: "nf", roomName: "Nature Freestyle",
    description: "Turn natural objects into lessons", icon: "🍃", xpReward: 35, difficulty: "medium",
    gameType: "nature_parable",
    instructions: "Create a parable like Jesus did. Start with something in nature and craft a teaching that reveals a Kingdom truth."
  },
  "nf-psalm": {
    id: "nf-psalm", name: "Psalm 19 Sprint", roomId: "nf", roomName: "Nature Freestyle",
    description: "Rapid nature-to-truth connections", icon: "☀️", xpReward: 45, difficulty: "hard",
    gameType: "psalm19_sprint",
    instructions: "In the style of Psalm 19, write how 10 different aspects of creation declare God's glory. Be poetic and theological."
  },

  // ===== FLOOR 3 - PERSONAL FREESTYLE =====
  "pf-parable": {
    id: "pf-parable", name: "Personal Parable", roomId: "pf", roomName: "Personal Freestyle",
    description: "Create life-to-Scripture links", icon: "🪞", xpReward: 35, difficulty: "medium",
    gameType: "personal_parable",
    instructions: "Take a recent personal experience and find 3 Scripture passages that illuminate its spiritual significance."
  },
  "pf-story": {
    id: "pf-story", name: "My Story Game", roomId: "pf", roomName: "Personal Freestyle",
    description: "Turn your story into Scripture truth", icon: "📔", xpReward: 30, difficulty: "easy",
    gameType: "my_story",
    instructions: "Share a personal testimony moment. Connect it to at least 2 Scripture passages that echo your experience."
  },
  "pf-testimony": {
    id: "pf-testimony", name: "Testimony Builder", roomId: "pf", roomName: "Personal Freestyle",
    description: "Frame experiences with verses", icon: "🎤", xpReward: 35, difficulty: "medium",
    gameType: "testimony_builder",
    instructions: "Build a 3-minute testimony framework. Include: before Christ, encounter, after. Frame each section with Scripture."
  },
  "pf-journal": {
    id: "pf-journal", name: "Life Journal", roomId: "pf", roomName: "Personal Freestyle",
    description: "Daily experience-to-Scripture links", icon: "📓", xpReward: 25, difficulty: "easy",
    gameType: "life_journal",
    instructions: "Journal about today. Find Scripture connections in: (1) a struggle you faced, (2) a joy you experienced, (3) a lesson you learned."
  },
  "pf-mirror": {
    id: "pf-mirror", name: "Mirror Match", roomId: "pf", roomName: "Personal Freestyle",
    description: "Match your struggles to biblical characters", icon: "🔮", xpReward: 40, difficulty: "medium",
    gameType: "mirror_match",
    instructions: "Identify 3 biblical characters whose struggles mirror your own. How did they overcome? What can you learn?"
  },

  // ===== FLOOR 3 - BIBLE FREESTYLE =====
  "bf-genetics": {
    id: "bf-genetics", name: "Verse Genetics", roomId: "bf", roomName: "Bible Freestyle",
    description: "Find verse family connections", icon: "🧬", xpReward: 45, difficulty: "hard",
    gameType: "verse_genetics",
    instructions: "Take one verse and find its 'genetic relatives': parent verses (sources), siblings (parallels), and children (developments)."
  },
  "bf-freestyle": {
    id: "bf-freestyle", name: "Bible Freestyle", roomId: "bf", roomName: "Bible Freestyle",
    description: "Speed-link verses spontaneously", icon: "⚡", xpReward: 35, difficulty: "medium",
    gameType: "bible_freestyle",
    instructions: "Starting from any verse, free-associate to 7 other verses. Explain each connection as you go. No planning - just flow!"
  },
  "bf-cypher": {
    id: "bf-cypher", name: "Verse Cypher", roomId: "bf", roomName: "Bible Freestyle",
    description: "One verse sparks another in flow", icon: "🎤", xpReward: 50, difficulty: "hard",
    gameType: "verse_cypher",
    instructions: "Like a rap cypher, but with verses. Start with one verse, respond with another that builds on it. Create a 10-verse chain."
  },
  "bf-family": {
    id: "bf-family", name: "Family Tree", roomId: "bf", roomName: "Bible Freestyle",
    description: "Map verse genealogies", icon: "🌲", xpReward: 35, difficulty: "medium",
    gameType: "family_tree",
    instructions: "Create a 'family tree' for a key verse: what OT verses are its ancestors? What NT verses are its descendants?"
  },
  "bf-echo": {
    id: "bf-echo", name: "Echo Chamber", roomId: "bf", roomName: "Bible Freestyle",
    description: "Find echoing verses across books", icon: "🔊", xpReward: 45, difficulty: "hard",
    gameType: "echo_chamber",
    instructions: "Find 5 'echo pairs' - verses from different books that echo the same truth in different words. Explain each echo."
  },

  // ===== FLOOR 3 - HISTORY FREESTYLE =====
  "hf-controversy": {
    id: "hf-controversy", name: "Controversy Raid", roomId: "hf", roomName: "History Freestyle",
    description: "Navigate cultural debates biblically", icon: "📜", xpReward: 50, difficulty: "hard",
    gameType: "controversy_raid",
    instructions: "Take a modern controversy. Present the biblical perspective using: (1) direct Scripture, (2) biblical principles, (3) Christ's example."
  },
  "hf-culture": {
    id: "hf-culture", name: "Culture Analysis", roomId: "hf", roomName: "History Freestyle",
    description: "Analyze culture with Scripture lens", icon: "🌍", xpReward: 40, difficulty: "medium",
    gameType: "culture_analysis",
    instructions: "Choose a cultural trend. Analyze it biblically: What's good? What's dangerous? What Scripture applies?"
  },
  "hf-headlines": {
    id: "hf-headlines", name: "Headlines Game", roomId: "hf", roomName: "History Freestyle",
    description: "Apply Scripture to current events", icon: "📰", xpReward: 45, difficulty: "hard",
    gameType: "headlines_game",
    instructions: "Take 3 recent headlines. For each, provide: (1) the biblical lens to understand it, (2) relevant Scripture, (3) Christian response."
  },
  "hf-history": {
    id: "hf-history", name: "History Lens", roomId: "hf", roomName: "History Freestyle",
    description: "See redemptive history in world events", icon: "🏛️", xpReward: 50, difficulty: "hard",
    gameType: "history_lens",
    instructions: "Choose a historical event. Explain how it fits into God's redemptive plan and the Great Controversy narrative."
  },
  "hf-social": {
    id: "hf-social", name: "Social Issues", roomId: "hf", roomName: "History Freestyle",
    description: "Biblical response to modern issues", icon: "🤝", xpReward: 40, difficulty: "medium",
    gameType: "social_issues",
    instructions: "Take a social justice issue. Present the balanced biblical response using: OT principles, Jesus' example, apostolic teaching."
  },

  // ===== FLOOR 3 - LISTENING ROOM =====
  "lr-listen": {
    id: "lr-listen", name: "Listen & Respond", roomId: "lr", roomName: "Listening Room",
    description: "Hear and connect what you learn", icon: "👂", xpReward: 30, difficulty: "medium",
    gameType: "listen_respond",
    instructions: "Reflect on a recent sermon or teaching you heard. Extract 3 key points and find Scripture support for each."
  },
  "lr-active": {
    id: "lr-active", name: "Active Listening", roomId: "lr", roomName: "Listening Room",
    description: "Observe what others share", icon: "🎧", xpReward: 25, difficulty: "easy",
    gameType: "active_listening",
    instructions: "Listen to someone's testimony or story. Identify: (1) their core struggle, (2) God's intervention, (3) Scripture that applies."
  },
  "lr-sermon": {
    id: "lr-sermon", name: "Sermon Notes", roomId: "lr", roomName: "Listening Room",
    description: "Connect sermon points to verses", icon: "📋", xpReward: 35, difficulty: "medium",
    gameType: "sermon_notes",
    instructions: "Take notes on a sermon. For each main point, add: (1) additional Scripture support, (2) personal application, (3) questions raised."
  },
  "lr-conversation": {
    id: "lr-conversation", name: "Conversation Catch", roomId: "lr", roomName: "Listening Room",
    description: "Spot Scripture in daily talk", icon: "💬", xpReward: 30, difficulty: "medium",
    gameType: "conversation_catch",
    instructions: "Reflect on recent conversations. Identify 3 moments where Scripture could have enriched the discussion. What would you have shared?"
  },
  "lr-testimony": {
    id: "lr-testimony", name: "Testimony Links", roomId: "lr", roomName: "Listening Room",
    description: "Connect testimonies to themes", icon: "🎙️", xpReward: 25, difficulty: "easy",
    gameType: "testimony_links",
    instructions: "Listen to or read 3 testimonies. Identify the common biblical themes that run through them. What patterns do you see?"
  },

  // ===== FLOOR 4 - CONCENTRATION ROOM =====
  "cr-focus": {
    id: "cr-focus", name: "Concentration Room", roomId: "cr", roomName: "Concentration Room",
    description: "Christ-centered focus training", icon: "✝️", xpReward: 40, difficulty: "medium",
    gameType: "christ_focus",
    instructions: "Take any OT narrative. Identify: (1) where Christ is hidden, (2) what role He plays, (3) how this passage points forward to the cross."
  },
  "cr-lock": {
    id: "cr-lock", name: "Christ Lock", roomId: "cr", roomName: "Concentration Room",
    description: "Unlock Christ in every text", icon: "🔓", xpReward: 50, difficulty: "hard",
    gameType: "christ_lock",
    instructions: "Take a passage that seems to have nothing to do with Christ. 'Unlock' it by showing how it points to Him. Use typology, prophecy, or theme."
  },
  "cr-magnify": {
    id: "cr-magnify", name: "Christ Magnifier", roomId: "cr", roomName: "Concentration Room",
    description: "Find Christ where He seems hidden", icon: "🔍", xpReward: 50, difficulty: "hard",
    gameType: "christ_magnify",
    instructions: "Choose a Levitical law or genealogy - something that seems dry. Magnify Christ within it. Show the beauty hidden in the details."
  },
  "cr-thread": {
    id: "cr-thread", name: "Scarlet Thread", roomId: "cr", roomName: "Concentration Room",
    description: "Trace Christ through OT passages", icon: "🧵", xpReward: 55, difficulty: "hard",
    gameType: "scarlet_thread",
    instructions: "Trace the 'scarlet thread' of redemption through 5 OT passages. Show how each connects to Christ's blood and our salvation."
  },
  "cr-emmaus": {
    id: "cr-emmaus", name: "Emmaus Walk", roomId: "cr", roomName: "Concentration Room",
    description: "All Scripture points to Him", icon: "🚶", xpReward: 40, difficulty: "medium",
    gameType: "emmaus_walk",
    instructions: "Like Jesus on the Emmaus road, take a section of the OT and explain how it's all about Him. 'Beginning at Moses and all the prophets...'"
  },

  // ===== FLOOR 4 - DIMENSIONS ROOM =====
  "dr-dimensions": {
    id: "dr-dimensions", name: "Dimensions Room", roomId: "dr", roomName: "Dimensions Room",
    description: "See all 5 dimensions of Scripture", icon: "💠", xpReward: 50, difficulty: "hard",
    gameType: "five_dimensions",
    instructions: "Apply all 5 dimensions to one verse: (1) Literal meaning, (2) Christ connection, (3) Application to me, (4) Church application, (5) Heavenly fulfillment."
  },
  "dr-sprint": {
    id: "dr-sprint", name: "Dimension Sprint", roomId: "dr", roomName: "Dimensions Room",
    description: "Rapidly apply all 5 dimensions", icon: "🎯", xpReward: 35, difficulty: "medium",
    gameType: "dimension_sprint",
    instructions: "Take 3 verses. For each, give a one-sentence statement for all 5 dimensions. Speed and accuracy both matter."
  },
  "dr-lens": {
    id: "dr-lens", name: "Five Lenses", roomId: "dr", roomName: "Dimensions Room",
    description: "View text through literal, Christ, me, church, heaven", icon: "👓", xpReward: 50, difficulty: "hard",
    gameType: "five_lenses",
    instructions: "Put on each 'lens' and describe what you see in the passage. Write a full paragraph for each perspective."
  },
  "dr-ladder": {
    id: "dr-ladder", name: "Dimension Ladder", roomId: "dr", roomName: "Dimensions Room",
    description: "Climb from literal to heavenly", icon: "🪜", xpReward: 40, difficulty: "medium",
    gameType: "dimension_ladder",
    instructions: "Start at the 'ground floor' (literal) and climb the ladder through each dimension. Show the ascent of meaning."
  },
  "dr-prism": {
    id: "dr-prism", name: "Prism Study", roomId: "dr", roomName: "Dimensions Room",
    description: "Refract one verse into 5 meanings", icon: "💎", xpReward: 55, difficulty: "hard",
    gameType: "prism_study",
    instructions: "Like light through a prism, refract one verse into its 5 dimensional colors. Each color should be distinct and beautiful."
  },

  // Additional key games from higher floors...
  "bl-journey": {
    id: "bl-journey", name: "Sanctuary Journey", roomId: "bl", roomName: "Blue Room (Sanctuary)",
    description: "Walk through the sanctuary stations", icon: "⛪", xpReward: 50, difficulty: "hard",
    gameType: "sanctuary_journey",
    instructions: "Trace the gospel through all sanctuary stations: Altar, Laver, Lampstand, Showbread, Incense, Ark. Explain each step and its Christ-connection."
  },
  "frm-burn": {
    id: "frm-burn", name: "Heart Fire", roomId: "frm", roomName: "Fire Room",
    description: "Let Scripture burn in your heart", icon: "🔥", xpReward: 40, difficulty: "medium",
    gameType: "heart_fire",
    instructions: "Choose a passage that convicts you deeply. Write what it stirs: conviction, comfort, challenge, or call to change."
  },
};

export function RoomGamePlay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; feedback: string; score: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  // Interactive game state
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<StoryQuiz | null>(null);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [availableScenes, setAvailableScenes] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [completedQuizIds, setCompletedQuizIds] = useState<Set<number>>(new Set());

  // Genesis game state
  const [genesisQuestionIndex, setGenesisQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  // Story identification state
  const [identificationQuizIndex, setIdentificationQuizIndex] = useState(0);

  const game = gameId ? gameConfigs[gameId] : null;
  const { awardXp } = useMastery(game?.roomId || "", 1);

  // Check if this game should use interactive mode
  const isInteractive = game && interactiveGameTypes.includes(game.gameType);

  // Initialize interactive game
  const startInteractiveGame = useCallback(() => {
    if (!game) return;
    setInteractiveMode(true);
    setTotalScore(0);
    setRoundsPlayed(0);
    setStreak(0);
    setHintsUsed(0);
    setShowHint(false);
    setResult(null);

    if (game.gameType === "story_sequence") {
      // Pick a random story quiz
      const availableQuizzes = storySequenceQuizzes.filter((_, idx) => !completedQuizIds.has(idx));
      if (availableQuizzes.length === 0) {
        setCompletedQuizIds(new Set());
        setCurrentQuiz(storySequenceQuizzes[0]);
        setAvailableScenes(shuffleArray([...storySequenceQuizzes[0].sequence]));
      } else {
        const randomQuiz = availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
        setCurrentQuiz(randomQuiz);
        setAvailableScenes(shuffleArray([...randomQuiz.sequence]));
      }
      setUserSequence([]);
    } else if (game.gameType === "genesis_chapters") {
      setGenesisQuestionIndex(0);
      setSelectedAnswer("");
    } else if (game.gameType === "story_match") {
      setIdentificationQuizIndex(0);
      setSelectedAnswer("");
    } else if (game.gameType === "story_beats") {
      const randomBeatQuiz = storyBeatQuizzes[Math.floor(Math.random() * storyBeatQuizzes.length)];
      setCurrentQuiz({
        story: randomBeatQuiz.story,
        sequence: randomBeatQuiz.beats.map(b => b.description),
        correct: randomBeatQuiz.beats.map(b => b.description),
        book: randomBeatQuiz.book
      });
      setAvailableScenes(shuffleArray(randomBeatQuiz.beats.map(b => `${b.type}: ${b.description}`)));
      setUserSequence([]);
    }
  }, [game, completedQuizIds]);

  // Handle scene click for sequence games
  const handleSceneClick = (scene: string) => {
    setUserSequence([...userSequence, scene]);
    setAvailableScenes(availableScenes.filter(s => s !== scene));
  };

  const handleRemoveScene = (index: number) => {
    const scene = userSequence[index];
    setAvailableScenes([...availableScenes, scene]);
    setUserSequence(userSequence.filter((_, i) => i !== index));
  };

  // Check sequence answer
  const checkSequenceAnswer = () => {
    if (!currentQuiz) return;

    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(currentQuiz.correct);
    const basePoints = game?.xpReward || 25;
    const streakBonus = streak * 5;
    const hintPenalty = hintsUsed * 10;
    const pointsEarned = Math.max(10, isCorrect ? basePoints + streakBonus - hintPenalty : Math.floor(basePoints / 4));

    if (isCorrect) {
      setStreak(prev => prev + 1);
      setTotalScore(prev => prev + pointsEarned);
      setResult({ valid: true, feedback: `Perfect! You got the sequence right! The story is from ${currentQuiz.book}.`, score: pointsEarned });
      toast.success(`Correct! +${pointsEarned} XP • Streak: ${streak + 1}`);

      // Mark as completed
      const quizIdx = storySequenceQuizzes.findIndex(q => q.story === currentQuiz.story);
      if (quizIdx >= 0) setCompletedQuizIds(prev => new Set([...prev, quizIdx]));
    } else {
      setStreak(0);
      setTotalScore(prev => prev + pointsEarned);
      setResult({
        valid: false,
        feedback: `Not quite! The correct order was: ${currentQuiz.correct.join(" → ")}`,
        score: pointsEarned
      });
      toast.error("Not quite right. Keep practicing!");
    }

    setRoundsPlayed(prev => prev + 1);
    awardXp({ xpAmount: pointsEarned, exerciseCompleted: isCorrect });
  };

  // Check multiple choice answer
  const checkMCAnswer = (correctAnswer: string) => {
    const isCorrect = selectedAnswer === correctAnswer;
    const basePoints = game?.xpReward || 25;
    const pointsEarned = isCorrect ? basePoints + (streak * 5) : Math.floor(basePoints / 4);

    if (isCorrect) {
      setStreak(prev => prev + 1);
      setTotalScore(prev => prev + pointsEarned);
      toast.success(`Correct! +${pointsEarned} XP`);
    } else {
      setStreak(0);
      setTotalScore(prev => prev + Math.floor(basePoints / 4));
      toast.error(`Incorrect. The answer was: ${correctAnswer}`);
    }

    setRoundsPlayed(prev => prev + 1);
    awardXp({ xpAmount: pointsEarned, exerciseCompleted: isCorrect });
    return isCorrect;
  };

  // Next question for Genesis game
  const nextGenesisQuestion = () => {
    if (genesisQuestionIndex < genesisChapters.length - 1) {
      setGenesisQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      setResult({ valid: true, feedback: `Game complete! You scored ${totalScore} XP across ${roundsPlayed} questions.`, score: totalScore });
    }
  };

  // Next question for identification game
  const nextIdentificationQuestion = () => {
    if (identificationQuizIndex < storyIdentification.length - 1) {
      setIdentificationQuizIndex(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      setResult({ valid: true, feedback: `Game complete! You scored ${totalScore} XP across ${roundsPlayed} questions.`, score: totalScore });
    }
  };

  // Use hint
  const useHint = () => {
    if (!currentQuiz) return;
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
    toast.info(`Hint: The story starts with "${currentQuiz.correct[0]}"`);
  };

  // Reset for next round
  const nextRound = () => {
    setResult(null);
    setShowHint(false);

    if (game?.gameType === "story_sequence" || game?.gameType === "story_beats") {
      const availableQuizzes = storySequenceQuizzes.filter((_, idx) => !completedQuizIds.has(idx));
      if (availableQuizzes.length === 0) {
        setCompletedQuizIds(new Set());
      }
      const quizList = availableQuizzes.length > 0 ? availableQuizzes : storySequenceQuizzes;
      const randomQuiz = quizList[Math.floor(Math.random() * quizList.length)];
      setCurrentQuiz(randomQuiz);
      setAvailableScenes(shuffleArray([...randomQuiz.sequence]));
      setUserSequence([]);
    } else if (game?.gameType === "genesis_chapters") {
      nextGenesisQuestion();
    } else if (game?.gameType === "story_match") {
      nextIdentificationQuestion();
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-muted-foreground mb-6">This game type is coming soon!</p>
          <Link to="/games">
            <Button><ArrowLeft className="mr-2 h-4 w-4" />Back to Games</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter your response");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "validate_room_game",
          gameType: game.gameType,
          roomId: game.roomId,
          roomName: game.roomName,
          userInput,
          verseReference,
          difficulty: game.difficulty,
          instructions: game.instructions,
        }
      });

      if (error) throw error;

      const isValid = data.valid ?? (data.quality === "excellent" || data.quality === "good");
      const gameResult = {
        valid: isValid,
        feedback: data.feedback || "Good attempt!",
        score: data.score ?? (isValid ? game.xpReward : Math.floor(game.xpReward / 3))
      };

      setResult(gameResult);
      setTotalScore(prev => prev + gameResult.score);
      setRoundsPlayed(prev => prev + 1);

      if (gameResult.valid) {
        toast.success(`Excellent! +${gameResult.score} XP`);
        awardXp({ xpAmount: gameResult.score, exerciseCompleted: true });
      } else {
        toast.info("Keep practicing!");
      }
    } catch (error) {
      console.error("Game validation error:", error);
      toast.error("Failed to validate. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextRound = () => {
    setUserInput("");
    setVerseReference("");
    setResult(null);
  };

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-700 dark:text-green-300",
    medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    hard: "bg-red-500/20 text-red-700 dark:text-red-300"
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Game Header */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{game.icon}</span>
                  <div>
                    <CardTitle className="text-2xl">{game.name}</CardTitle>
                    <CardDescription>{game.roomName}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={difficultyColors[game.difficulty]}>{game.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    +{game.xpReward} XP
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Score Display */}
          {roundsPlayed > 0 && (
            <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20">
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Session Progress</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Rounds: {roundsPlayed}</span>
                    <span className="font-bold text-lg flex items-center gap-1">
                      <Star className="h-5 w-5 text-amber-500" />
                      {totalScore} XP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interactive Score/Streak Display */}
          {isInteractive && interactiveMode && (
            <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      <span className="font-bold text-lg">{totalScore} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className={`h-5 w-5 ${streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
                      <span className="text-sm">Streak: {streak}</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Round {roundsPlayed + 1}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interactive Game UI */}
          {isInteractive && !interactiveMode && !result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Ready to Play?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{game.instructions}</p>
                <Button onClick={startInteractiveGame} size="lg" className="w-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Story Sequence Game */}
          {isInteractive && interactiveMode && game.gameType === "story_sequence" && currentQuiz && !result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentQuiz.story}</CardTitle>
                <CardDescription>Arrange the scenes in the correct order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User's sequence */}
                <div>
                  <h3 className="font-semibold mb-3">Your Story Sequence:</h3>
                  <div className="min-h-[100px] p-4 border-2 border-dashed rounded-lg bg-muted/50">
                    {userSequence.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">
                        Click scenes below to build your story sequence
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {userSequence.map((scene, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                            <span className="flex items-center gap-3">
                              <Badge variant="outline" className="bg-primary/10">{index + 1}</Badge>
                              {scene}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveScene(index)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Available scenes */}
                <div>
                  <h3 className="font-semibold mb-3">Available Scenes (click to add):</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {availableScenes.map((scene) => (
                      <Button
                        key={scene}
                        variant="outline"
                        className="h-auto py-3 justify-start text-left hover:bg-primary/10 hover:border-primary"
                        onClick={() => handleSceneClick(scene)}
                      >
                        {scene}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300">
                    <p className="text-amber-800 dark:text-amber-200">
                      <strong>Hint:</strong> The story starts with "{currentQuiz.correct[0]}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={checkSequenceAnswer}
                    disabled={userSequence.length !== currentQuiz.sequence.length}
                    className="flex-1"
                    size="lg"
                  >
                    Check Answer
                  </Button>
                  {!showHint && (
                    <Button onClick={useHint} variant="outline" size="lg">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Hint
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Genesis Chapters Game */}
          {isInteractive && interactiveMode && game.gameType === "genesis_chapters" && !result && (
            <Card>
              <CardHeader>
                <CardTitle>Genesis Chapter {genesisChapters[genesisQuestionIndex].chapter}</CardTitle>
                <CardDescription>What happens in this chapter?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {genesisChapters[genesisQuestionIndex].options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="h-auto py-4 justify-start text-left"
                      onClick={() => setSelectedAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    const correct = checkMCAnswer(genesisChapters[genesisQuestionIndex].event);
                    setTimeout(() => {
                      setSelectedAnswer("");
                      nextGenesisQuestion();
                    }, 1000);
                  }}
                  disabled={!selectedAnswer}
                  className="w-full"
                  size="lg"
                >
                  Submit Answer
                </Button>
                <div className="text-sm text-muted-foreground text-center">
                  Question {genesisQuestionIndex + 1} of {genesisChapters.length}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Story Identification Game */}
          {isInteractive && interactiveMode && game.gameType === "story_match" && !result && (
            <Card>
              <CardHeader>
                <CardTitle>Identify the Story</CardTitle>
                <CardDescription>Which Bible story do these scenes describe?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show scenes */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  {storyIdentification[identificationQuizIndex].scenes.map((scene, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Badge variant="outline">{idx + 1}</Badge>
                      <span>{scene}</span>
                    </div>
                  ))}
                </div>

                {/* Answer options */}
                <div className="grid grid-cols-1 gap-3">
                  {storyIdentification[identificationQuizIndex].options.map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="h-auto py-4 justify-start text-left"
                      onClick={() => setSelectedAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    const correct = checkMCAnswer(storyIdentification[identificationQuizIndex].story);
                    setTimeout(() => {
                      setSelectedAnswer("");
                      nextIdentificationQuestion();
                    }, 1000);
                  }}
                  disabled={!selectedAnswer}
                  className="w-full"
                  size="lg"
                >
                  Submit Answer
                </Button>
                <div className="text-sm text-muted-foreground text-center">
                  Question {identificationQuizIndex + 1} of {storyIdentification.length}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Non-interactive games: Instructions & Text Input */}
          {!isInteractive && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{game.instructions}</p>
                </CardContent>
              </Card>

              {!result && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Response</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Verse/Passage Reference (optional)
                      </label>
                      <Input
                        value={verseReference}
                        onChange={(e) => setVerseReference(e.target.value)}
                        placeholder="e.g., Genesis 1:1-5 or John 3:16"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Answer
                      </label>
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your response here..."
                        className="min-h-[200px]"
                      />
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !userInput.trim()}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Submit Answer
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Result Display */}
          {result && (
            <Card className={result.valid ? "border-green-500/50" : "border-yellow-500/50"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.valid ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-yellow-500" />
                  )}
                  {result.valid ? "Excellent Work!" : "Keep Growing!"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Jeeves says:</p>
                  <p className="text-muted-foreground">{result.feedback}</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                  <span className="font-medium">XP Earned:</span>
                  <span className="text-xl font-bold text-primary">+{result.score}</span>
                </div>
                <div className="flex gap-3">
                  <Button onClick={isInteractive ? nextRound : handleNextRound} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {isInteractive ? "Next Round" : "Play Again"}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setInteractiveMode(false);
                    setResult(null);
                    navigate(-1);
                  }}>
                    Back to Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomGamePlay;
