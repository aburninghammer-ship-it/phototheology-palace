import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Sparkles, Play } from "lucide-react";

interface RoomGame {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  badge?: string;
  crossFloorRooms?: string[]; // For higher floors - rooms from other floors used
}

// Map room IDs to their specific games - 5 games per room
// Higher floors (4-7) include cross-floor room integrations
// Floor 8 uses all 37 rooms
const roomGamesMap: Record<string, RoomGame[]> = {
  // ===== FLOOR 1 - FURNISHING FLOOR (Memory & Visualization) =====
  sr: [
    { id: "sr-sequence", name: "Story Sequence", description: "Arrange Bible stories in correct chronological order", path: "/games/room-game/sr-sequence", icon: "📖", difficulty: "easy", xpReward: 25 },
    { id: "sr-genesis", name: "Genesis HighRise", description: "Build the Genesis tower chapter by chapter", path: "/games/room-game/sr-genesis", icon: "🏗️", difficulty: "medium", xpReward: 35 },
    { id: "sr-beat-builder", name: "Scene Builder", description: "Store vivid scenes from narrative passages", path: "/games/room-game/sr-beat-builder", icon: "🎬", difficulty: "medium", xpReward: 30 },
    { id: "sr-story-race", name: "Story Race", description: "Speed-match stories to their scene sequences", path: "/games/room-game/sr-story-race", icon: "🏃", difficulty: "hard", xpReward: 40 },
    { id: "sr-narrative-chain", name: "Narrative Chain", description: "Chain connected stories across books", path: "/games/room-game/sr-narrative-chain", icon: "🔗", difficulty: "hard", xpReward: 45 },
  ],
  ir: [
    { id: "ir-immersion", name: "Immersion Chamber", description: "Deep sensory experience in biblical scenes", path: "/games/room-game/ir-immersion", icon: "👁️", difficulty: "medium", xpReward: 35 },
    { id: "ir-frame-snapshot", name: "Frame Snapshot", description: "Visualize and describe biblical scenes vividly", path: "/games/room-game/ir-frame-snapshot", icon: "📸", difficulty: "medium", xpReward: 30 },
    { id: "ir-sense-finder", name: "Sense Finder", description: "Identify all 5 senses in a passage", path: "/games/room-game/ir-sense-finder", icon: "🎭", difficulty: "easy", xpReward: 25 },
    { id: "ir-scene-painter", name: "Scene Painter", description: "Describe what you see, hear, smell, taste, touch", path: "/games/room-game/ir-scene-painter", icon: "🎨", difficulty: "medium", xpReward: 35 },
    { id: "ir-empathy-walk", name: "Empathy Walk", description: "Step into a biblical character's shoes", path: "/games/room-game/ir-empathy-walk", icon: "👣", difficulty: "hard", xpReward: 45 },
  ],
  "24fps": [
    { id: "24fps-chapter", name: "24FPS Challenge", description: "Create memorable chapter image associations", path: "/games/room-game/24fps-chapter", icon: "🎬", difficulty: "medium", xpReward: 35 },
    { id: "24fps-genesis", name: "Genesis Frames", description: "Build frames for Genesis 1-50", path: "/games/room-game/24fps-genesis", icon: "🏗️", difficulty: "easy", xpReward: 25 },
    { id: "24fps-match", name: "Frame Match", description: "Match chapters to their visual frames", path: "/games/room-game/24fps-match", icon: "🖼️", difficulty: "medium", xpReward: 30 },
    { id: "24fps-sprint", name: "Frame Sprint", description: "Rapid-fire chapter identification", path: "/games/room-game/24fps-sprint", icon: "⚡", difficulty: "hard", xpReward: 40 },
    { id: "24fps-gallery", name: "Gallery Walk", description: "Navigate a visual Bible gallery", path: "/games/room-game/24fps-gallery", icon: "🏛️", difficulty: "medium", xpReward: 35 },
  ],
  br: [
    { id: "br-render", name: "Bible Rendered", description: "Create glyphs for 24-chapter blocks", path: "/games/room-game/br-render", icon: "🖼️", difficulty: "hard", xpReward: 45 },
    { id: "br-glyph-match", name: "Glyph Match", description: "Match 24-chapter blocks to symbols", path: "/games/room-game/br-glyph-match", icon: "🔣", difficulty: "medium", xpReward: 35 },
    { id: "br-panorama", name: "Bible Panorama", description: "Fly over the 51-frame Bible legend", path: "/games/room-game/br-panorama", icon: "🗺️", difficulty: "medium", xpReward: 30 },
    { id: "br-compression", name: "Compression Master", description: "Compress themes into single symbols", path: "/games/room-game/br-compression", icon: "📦", difficulty: "hard", xpReward: 40 },
    { id: "br-memory", name: "Memory Scan", description: "Test your 51-frame legend recall", path: "/games/room-game/br-memory", icon: "🧠", difficulty: "hard", xpReward: 50 },
  ],
  tr: [
    { id: "tr-verse-icon", name: "Verse to Icon", description: "Convert verses into memorable images", path: "/games/room-game/tr-verse-icon", icon: "🎨", difficulty: "easy", xpReward: 20 },
    { id: "tr-comic", name: "Comic Creator", description: "Turn passages into 3-panel comics", path: "/games/room-game/tr-comic", icon: "📰", difficulty: "medium", xpReward: 35 },
    { id: "tr-mural", name: "Mural Builder", description: "Create panoramic book visualizations", path: "/games/room-game/tr-mural", icon: "🖌️", difficulty: "hard", xpReward: 45 },
    { id: "tr-concentration", name: "Image Match", description: "Memory matching with verse images", path: "/games/room-game/tr-concentration", icon: "🧠", difficulty: "easy", xpReward: 25 },
    { id: "tr-translate", name: "Visual Translator", description: "Abstract to concrete image conversion", path: "/games/room-game/tr-translate", icon: "🔄", difficulty: "medium", xpReward: 30 },
  ],
  gr: [
    { id: "gr-treasure", name: "Treasure Hunt", description: "Mine Scripture for rare combined truths", path: "/games/room-game/gr-treasure", icon: "💎", difficulty: "medium", xpReward: 40 },
    { id: "gr-chef", name: "Gem Chef", description: "Cook up theological connections", path: "/games/room-game/gr-chef", icon: "👨‍🍳", difficulty: "hard", xpReward: 50 },
    { id: "gr-combiner", name: "Gem Combiner", description: "Place 2-4 texts to discover insights", path: "/games/room-game/gr-combiner", icon: "⚗️", difficulty: "hard", xpReward: 45 },
    { id: "gr-collector", name: "Gem Collector", description: "Build your personal gem treasury", path: "/games/room-game/gr-collector", icon: "👑", difficulty: "medium", xpReward: 35 },
    { id: "gr-polish", name: "Gem Polish", description: "Refine rough insights into clear gems", path: "/games/room-game/gr-polish", icon: "✨", difficulty: "medium", xpReward: 30 },
  ],
  
  // ===== FLOOR 2 - INVESTIGATION FLOOR (Detective Work) =====
  or: [
    { id: "or-detective", name: "Observation Detective", description: "Find details others miss in the text", path: "/games/room-game/or-detective", icon: "🔍", difficulty: "medium", xpReward: 35 },
    { id: "or-witness", name: "Witness Trial", description: "Cross-examine Scripture passages", path: "/games/room-game/or-witness", icon: "⚖️", difficulty: "hard", xpReward: 45 },
    { id: "or-fingerprint", name: "Fingerprint Logger", description: "Catalog observations without interpretation", path: "/games/room-game/or-fingerprint", icon: "🔎", difficulty: "easy", xpReward: 25 },
    { id: "or-scene", name: "Crime Scene", description: "Investigate a passage like a detective", path: "/games/room-game/or-scene", icon: "🕵️", difficulty: "medium", xpReward: 35 },
    { id: "or-30", name: "30 Observations", description: "Generate 30 observations from one text", path: "/games/room-game/or-30", icon: "📝", difficulty: "hard", xpReward: 50 },
  ],
  dc: [
    { id: "dc-equation", name: "Equation Builder", description: "Build theological equations from symbols", path: "/games/room-game/dc-equation", icon: "🧮", difficulty: "hard", xpReward: 50 },
    { id: "dc-challenge", name: "Equations Challenge", description: "Solve symbolic Bible puzzles", path: "/games/room-game/dc-challenge", icon: "🔢", difficulty: "hard", xpReward: 45 },
    { id: "dc-word-lab", name: "Word Lab", description: "Deep Greek/Hebrew word analysis", path: "/games/room-game/dc-word-lab", icon: "🔬", difficulty: "medium", xpReward: 35 },
    { id: "dc-culture", name: "Culture Context", description: "Historical and cultural background study", path: "/games/room-game/dc-culture", icon: "📚", difficulty: "medium", xpReward: 30 },
    { id: "dc-compare", name: "Version Compare", description: "Compare translations for insight", path: "/games/room-game/dc-compare", icon: "📖", difficulty: "easy", xpReward: 25 },
  ],
  st: [
    { id: "st-connection", name: "Symbol Connections", description: "Link symbols to their biblical meanings", path: "/games/room-game/st-connection", icon: "🔗", difficulty: "medium", xpReward: 35 },
    { id: "st-chain", name: "Chain Chess", description: "Build symbolic verse chains", path: "/games/room-game/st-chain", icon: "♟️", difficulty: "hard", xpReward: 50 },
    { id: "st-profile", name: "Symbol Profile", description: "Build profiles for major biblical symbols", path: "/games/room-game/st-profile", icon: "📋", difficulty: "medium", xpReward: 35 },
    { id: "st-type-finder", name: "Type Finder", description: "Identify OT types of Christ", path: "/games/room-game/st-type-finder", icon: "👤", difficulty: "hard", xpReward: 45 },
    { id: "st-decode", name: "Symbol Decode", description: "Decode symbolic language in prophecy", path: "/games/room-game/st-decode", icon: "🗝️", difficulty: "hard", xpReward: 50 },
  ],
  qr: [
    { id: "qr-blitz", name: "Question Blitz", description: "Generate questions rapidly from text", path: "/games/room-game/qr-blitz", icon: "❓", difficulty: "medium", xpReward: 30 },
    { id: "qr-escape", name: "Escape Room", description: "Solve puzzles through questions", path: "/games/room-game/qr-escape", icon: "🚪", difficulty: "hard", xpReward: 60 },
    { id: "qr-75", name: "75 Questions", description: "Generate 75 questions from one passage", path: "/games/room-game/qr-75", icon: "🤔", difficulty: "hard", xpReward: 55 },
    { id: "qr-intra", name: "Intratextual Quiz", description: "Questions within the text itself", path: "/games/room-game/qr-intra", icon: "📖", difficulty: "medium", xpReward: 35 },
    { id: "qr-inter", name: "Intertextual Quiz", description: "Cross-reference questions", path: "/games/room-game/qr-inter", icon: "🔀", difficulty: "hard", xpReward: 45 },
  ],
  qa: [
    { id: "qa-branch", name: "Branch Study", description: "Build question-answer branches", path: "/games/room-game/qa-branch", icon: "🌳", difficulty: "medium", xpReward: 40 },
    { id: "qa-chain", name: "Q&A Chains", description: "Chain verses that answer each other", path: "/games/room-game/qa-chain", icon: "💬", difficulty: "medium", xpReward: 35 },
    { id: "qa-courtroom", name: "Courtroom Cross", description: "Cross-examine with verse answers", path: "/games/room-game/qa-courtroom", icon: "⚖️", difficulty: "hard", xpReward: 50 },
    { id: "qa-alibi", name: "Alibi Check", description: "Verify Scripture interpretations", path: "/games/room-game/qa-alibi", icon: "🔍", difficulty: "medium", xpReward: 35 },
    { id: "qa-witness", name: "Witness Box", description: "Let Scripture answer Scripture", path: "/games/room-game/qa-witness", icon: "📜", difficulty: "hard", xpReward: 45 },
  ],
  
  // ===== FLOOR 3 - FREESTYLE FLOOR (Connections for Time) =====
  nf: [
    { id: "nf-nature", name: "Nature Connections", description: "Find Scripture lessons in nature", path: "/games/room-game/nf-nature", icon: "🌿", difficulty: "medium", xpReward: 35 },
    { id: "nf-freestyle", name: "Nature Freestyle", description: "Riff on natural world with Scripture", path: "/games/room-game/nf-freestyle", icon: "🌳", difficulty: "medium", xpReward: 40 },
    { id: "nf-romans", name: "Romans 1:20 Walk", description: "See God's attributes in creation", path: "/games/room-game/nf-romans", icon: "🌄", difficulty: "easy", xpReward: 25 },
    { id: "nf-parable", name: "Nature Parable", description: "Turn natural objects into lessons", path: "/games/room-game/nf-parable", icon: "🍃", difficulty: "medium", xpReward: 35 },
    { id: "nf-psalm", name: "Psalm 19 Sprint", description: "Rapid nature-to-truth connections", path: "/games/room-game/nf-psalm", icon: "☀️", difficulty: "hard", xpReward: 45 },
  ],
  pf: [
    { id: "pf-parable", name: "Personal Parable", description: "Create life-to-Scripture links", path: "/games/room-game/pf-parable", icon: "🪞", difficulty: "medium", xpReward: 35 },
    { id: "pf-story", name: "My Story Game", description: "Turn your story into Scripture truth", path: "/games/room-game/pf-story", icon: "📔", difficulty: "easy", xpReward: 30 },
    { id: "pf-testimony", name: "Testimony Builder", description: "Frame experiences with verses", path: "/games/room-game/pf-testimony", icon: "🎤", difficulty: "medium", xpReward: 35 },
    { id: "pf-journal", name: "Life Journal", description: "Daily experience-to-Scripture links", path: "/games/room-game/pf-journal", icon: "📓", difficulty: "easy", xpReward: 25 },
    { id: "pf-mirror", name: "Mirror Match", description: "Match your struggles to biblical characters", path: "/games/room-game/pf-mirror", icon: "🔮", difficulty: "medium", xpReward: 40 },
  ],
  bf: [
    { id: "bf-genetics", name: "Verse Genetics", description: "Find verse family connections", path: "/games/room-game/bf-genetics", icon: "🧬", difficulty: "hard", xpReward: 45 },
    { id: "bf-freestyle", name: "Bible Freestyle", description: "Speed-link verses spontaneously", path: "/games/room-game/bf-freestyle", icon: "⚡", difficulty: "medium", xpReward: 35 },
    { id: "bf-cypher", name: "Verse Cypher", description: "One verse sparks another in flow", path: "/games/room-game/bf-cypher", icon: "🎤", difficulty: "hard", xpReward: 50 },
    { id: "bf-family", name: "Family Tree", description: "Map verse genealogies", path: "/games/room-game/bf-family", icon: "🌲", difficulty: "medium", xpReward: 35 },
    { id: "bf-echo", name: "Echo Chamber", description: "Find echoing verses across books", path: "/games/room-game/bf-echo", icon: "🔊", difficulty: "hard", xpReward: 45 },
  ],
  hf: [
    { id: "hf-controversy", name: "Controversy Raid", description: "Navigate cultural debates biblically", path: "/games/room-game/hf-controversy", icon: "📜", difficulty: "hard", xpReward: 50 },
    { id: "hf-culture", name: "Culture Analysis", description: "Analyze culture with Scripture lens", path: "/games/room-game/hf-culture", icon: "🌍", difficulty: "medium", xpReward: 40 },
    { id: "hf-headlines", name: "Headlines Game", description: "Apply Scripture to current events", path: "/games/room-game/hf-headlines", icon: "📰", difficulty: "hard", xpReward: 45 },
    { id: "hf-history", name: "History Lens", description: "See redemptive history in world events", path: "/games/room-game/hf-history", icon: "🏛️", difficulty: "hard", xpReward: 50 },
    { id: "hf-social", name: "Social Issues", description: "Biblical response to modern issues", path: "/games/room-game/hf-social", icon: "🤝", difficulty: "medium", xpReward: 40 },
  ],
  lr: [
    { id: "lr-listen", name: "Listen & Respond", description: "Hear and connect what you learn", path: "/games/room-game/lr-listen", icon: "👂", difficulty: "medium", xpReward: 30 },
    { id: "lr-active", name: "Active Listening", description: "Observe what others share", path: "/games/room-game/lr-active", icon: "🎧", difficulty: "easy", xpReward: 25 },
    { id: "lr-sermon", name: "Sermon Notes", description: "Connect sermon points to verses", path: "/games/room-game/lr-sermon", icon: "📋", difficulty: "medium", xpReward: 35 },
    { id: "lr-conversation", name: "Conversation Catch", description: "Spot Scripture in daily talk", path: "/games/room-game/lr-conversation", icon: "💬", difficulty: "medium", xpReward: 30 },
    { id: "lr-testimony", name: "Testimony Links", description: "Connect testimonies to themes", path: "/games/room-game/lr-testimony", icon: "🎙️", difficulty: "easy", xpReward: 25 },
  ],
  
  // ===== FLOOR 4 - NEXT LEVEL FLOOR (Christ-Centered Depth) =====
  // These games integrate principles from Floors 1-3
  cr: [
    { id: "cr-focus", name: "Concentration Room", description: "Christ-centered focus training", path: "/games/room-game/cr-focus", icon: "✝️", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "OR"] },
    { id: "cr-lock", name: "Christ Lock", description: "Unlock Christ in every text", path: "/games/room-game/cr-lock", icon: "🔓", difficulty: "hard", xpReward: 50, badge: "Popular", crossFloorRooms: ["ST", "GR"] },
    { id: "cr-magnify", name: "Christ Magnifier", description: "Find Christ where He seems hidden", path: "/games/room-game/cr-magnify", icon: "🔍", difficulty: "hard", xpReward: 50, crossFloorRooms: ["OR", "QR"] },
    { id: "cr-thread", name: "Scarlet Thread", description: "Trace Christ through OT passages", path: "/games/room-game/cr-thread", icon: "🧵", difficulty: "hard", xpReward: 55, crossFloorRooms: ["SR", "ST"] },
    { id: "cr-emmaus", name: "Emmaus Walk", description: "All Scripture points to Him", path: "/games/room-game/cr-emmaus", icon: "🚶", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "IR"] },
  ],
  dr: [
    { id: "dr-dimensions", name: "Dimensions Room", description: "See all 5 dimensions of Scripture", path: "/games/room-game/dr-dimensions", icon: "💠", difficulty: "hard", xpReward: 50, crossFloorRooms: ["CR", "OR"] },
    { id: "dr-sprint", name: "Dimension Sprint", description: "Rapidly apply all 5 dimensions", path: "/games/room-game/dr-sprint", icon: "🎯", difficulty: "medium", xpReward: 35, crossFloorRooms: ["QR", "CR"] },
    { id: "dr-lens", name: "Five Lenses", description: "View text through literal, Christ, me, church, heaven", path: "/games/room-game/dr-lens", icon: "👓", difficulty: "hard", xpReward: 50, crossFloorRooms: ["OR", "IR"] },
    { id: "dr-ladder", name: "Dimension Ladder", description: "Climb from literal to heavenly", path: "/games/room-game/dr-ladder", icon: "🪜", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "CR"] },
    { id: "dr-prism", name: "Prism Study", description: "Refract one verse into 5 meanings", path: "/games/room-game/dr-prism", icon: "💎", difficulty: "hard", xpReward: 55, crossFloorRooms: ["GR", "QR"] },
  ],
  c6: [
    { id: "c6-draft", name: "Connect 6 Draft", description: "Match genres to texts strategically", path: "/games/room-game/c6-draft", icon: "📚", difficulty: "medium", xpReward: 35, crossFloorRooms: ["OR", "SR"] },
    { id: "c6-genre", name: "Genre Stories", description: "Identify and classify story genres", path: "/games/room-game/c6-genre", icon: "🎭", difficulty: "easy", xpReward: 25, crossFloorRooms: ["SR"] },
    { id: "c6-sort", name: "Genre Sorter", description: "Categorize passages by genre", path: "/games/room-game/c6-sort", icon: "📂", difficulty: "medium", xpReward: 35, crossFloorRooms: ["OR", "DC"] },
    { id: "c6-rules", name: "Genre Rules", description: "Apply genre-specific hermeneutics", path: "/games/room-game/c6-rules", icon: "📏", difficulty: "hard", xpReward: 45, crossFloorRooms: ["QR", "DC"] },
    { id: "c6-hybrid", name: "Hybrid Hunt", description: "Find texts with multiple genres", path: "/games/room-game/c6-hybrid", icon: "🔀", difficulty: "hard", xpReward: 50, crossFloorRooms: ["OR", "QR"] },
  ],
  trm: [
    { id: "trm-wall", name: "Theme Wall Run", description: "Navigate the sanctuary theme walls", path: "/games/room-game/trm-wall", icon: "🏛️", difficulty: "medium", xpReward: 40, crossFloorRooms: ["BL", "CR"] },
    { id: "trm-explorer", name: "Theme Explorer", description: "Explore major biblical themes", path: "/games/room-game/trm-explorer", icon: "🧱", difficulty: "medium", xpReward: 35, crossFloorRooms: ["ST", "CR"] },
    { id: "trm-gc", name: "Great Controversy", description: "Place texts on the GC wall", path: "/games/room-game/trm-gc", icon: "⚔️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["CR", "ST"] },
    { id: "trm-gospel", name: "Gospel Floor", description: "Find justification/sanctification/glorification", path: "/games/room-game/trm-gospel", icon: "✨", difficulty: "medium", xpReward: 40, crossFloorRooms: ["CR", "DR"] },
    { id: "trm-ceiling", name: "Heaven Ceiling", description: "See eternal hope in passages", path: "/games/room-game/trm-ceiling", icon: "☁️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["DR", "CR"] },
  ],
  tz: [
    { id: "tz-invasion", name: "Time Zone Invasion", description: "Defend the biblical timeline", path: "/games/room-game/tz-invasion", icon: "⏰", difficulty: "hard", xpReward: 50, badge: "New", crossFloorRooms: ["SR", "ST"] },
    { id: "tz-chain", name: "Timeline Chain", description: "Chain events chronologically", path: "/games/room-game/tz-chain", icon: "📅", difficulty: "hard", xpReward: 45, crossFloorRooms: ["SR", "QA"] },
    { id: "tz-6zones", name: "Six Zone Sort", description: "Place texts in past/present/future × heaven/earth", path: "/games/room-game/tz-6zones", icon: "🗺️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["DR", "123H"] },
    { id: "tz-radar", name: "Time Radar", description: "Track fulfillment status of texts", path: "/games/room-game/tz-radar", icon: "📡", difficulty: "medium", xpReward: 40, crossFloorRooms: ["OR", "PR"] },
    { id: "tz-flow", name: "Redemption Flow", description: "Map salvation history timeline", path: "/games/room-game/tz-flow", icon: "🌊", difficulty: "medium", xpReward: 35, crossFloorRooms: ["SR", "@"] },
  ],
  prm: [
    { id: "prm-match", name: "Pattern Match", description: "Find recurring biblical patterns", path: "/games/room-game/prm-match", icon: "🎵", difficulty: "medium", xpReward: 35, crossFloorRooms: ["OR", "ST"] },
    { id: "prm-chain", name: "Pattern Chains", description: "Build pattern connections", path: "/games/room-game/prm-chain", icon: "🔄", difficulty: "hard", xpReward: 45, crossFloorRooms: ["QA", "ST"] },
    { id: "prm-40", name: "40 Days Finder", description: "Track the 40-day pattern", path: "/games/room-game/prm-40", icon: "4️⃣", difficulty: "medium", xpReward: 35, crossFloorRooms: ["OR", "SR"] },
    { id: "prm-motif", name: "Motif Hunter", description: "Identify recurring motifs", path: "/games/room-game/prm-motif", icon: "🎼", difficulty: "hard", xpReward: 50, crossFloorRooms: ["BF", "ST"] },
    { id: "prm-symphony", name: "Symphony Read", description: "Hear motifs return across Scripture", path: "/games/room-game/prm-symphony", icon: "🎻", difficulty: "hard", xpReward: 55, crossFloorRooms: ["SR", "R66"] },
  ],
  "p||": [
    { id: "p-parallel", name: "Parallel Vision", description: "Match mirrored biblical events", path: "/games/room-game/p-parallel", icon: "🪞", difficulty: "hard", xpReward: 45, crossFloorRooms: ["SR", "ST"] },
    { id: "p-detective", name: "Parallel Detective", description: "Spot parallel structures in text", path: "/games/room-game/p-detective", icon: "👁️", difficulty: "medium", xpReward: 35, crossFloorRooms: ["OR", "QR"] },
    { id: "p-mirror", name: "Mirror Events", description: "Babel↔Pentecost, Exodus↔Return", path: "/games/room-game/p-mirror", icon: "🔲", difficulty: "hard", xpReward: 50, crossFloorRooms: ["SR", "@"] },
    { id: "p-echo", name: "Historical Echo", description: "Find actions that echo across time", path: "/games/room-game/p-echo", icon: "🔊", difficulty: "hard", xpReward: 50, crossFloorRooms: ["TZ", "SR"] },
    { id: "p-hall", name: "Hall of Mirrors", description: "Stand between reflecting histories", path: "/games/room-game/p-hall", icon: "🏛️", difficulty: "hard", xpReward: 55, crossFloorRooms: ["SR", "123H"] },
  ],
  frt: [
    { id: "frt-inspector", name: "Fruit Inspector", description: "Test interpretations for spiritual fruit", path: "/games/room-game/frt-inspector", icon: "🍇", difficulty: "medium", xpReward: 30, crossFloorRooms: ["CR", "DR"] },
    { id: "frt-finder", name: "Fruit Finder", description: "Identify fruit of the Spirit in texts", path: "/games/room-game/frt-finder", icon: "🌱", difficulty: "easy", xpReward: 25, crossFloorRooms: ["OR"] },
    { id: "frt-test", name: "Fruit Test", description: "Does this interpretation produce Christlikeness?", path: "/games/room-game/frt-test", icon: "⚖️", difficulty: "medium", xpReward: 35, crossFloorRooms: ["CR", "QR"] },
    { id: "frt-garden", name: "Garden Walk", description: "Cultivate Galatians 5:22-23 through texts", path: "/games/room-game/frt-garden", icon: "🌺", difficulty: "medium", xpReward: 35, crossFloorRooms: ["IR", "CR"] },
    { id: "frt-prune", name: "Pruning Session", description: "Cut interpretations that fail the test", path: "/games/room-game/frt-prune", icon: "✂️", difficulty: "hard", xpReward: 45, crossFloorRooms: ["CR", "DC"] },
  ],
  cec: [
    { id: "cec-chapter", name: "Christ Every Chapter", description: "Find Christ in each chapter of a book", path: "/games/room-game/cec-chapter", icon: "👑", difficulty: "hard", xpReward: 50, crossFloorRooms: ["CR", "24FPS"] },
    { id: "cec-focus", name: "Chapter Focus", description: "Deep Christ-dive into one chapter", path: "/games/room-game/cec-focus", icon: "📖", difficulty: "medium", xpReward: 40, crossFloorRooms: ["CR", "OR"] },
    { id: "cec-sprint", name: "CEC Sprint", description: "Rapid Christ-finding per chapter", path: "/games/room-game/cec-sprint", icon: "⚡", difficulty: "hard", xpReward: 55, crossFloorRooms: ["CR", "SR"] },
    { id: "cec-grid", name: "CEC Grid", description: "Build a Christ-per-chapter grid", path: "/games/room-game/cec-grid", icon: "📊", difficulty: "hard", xpReward: 50, crossFloorRooms: ["SR", "CR"] },
    { id: "cec-marathon", name: "CEC Marathon", description: "Christ in every chapter of a book", path: "/games/room-game/cec-marathon", icon: "🏃", difficulty: "hard", xpReward: 60, crossFloorRooms: ["CR", "R66"] },
  ],
  r66: [
    { id: "r66-trace", name: "66-Book Trace", description: "Trace themes through all 66 books", path: "/games/room-game/r66-trace", icon: "📿", difficulty: "hard", xpReward: 60, crossFloorRooms: ["SR", "CR"] },
    { id: "r66-story", name: "Book Stories", description: "Know each book's narrative summary", path: "/games/room-game/r66-story", icon: "📚", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "BR"] },
    { id: "r66-grid", name: "R66 Grid Builder", description: "One claim per book with proof-text", path: "/games/room-game/r66-grid", icon: "📋", difficulty: "hard", xpReward: 55, crossFloorRooms: ["QA", "CR"] },
    { id: "r66-constellation", name: "Constellation", description: "Synthesize OT→NT theme narrative", path: "/games/room-game/r66-constellation", icon: "⭐", difficulty: "hard", xpReward: 60, crossFloorRooms: ["BF", "CR"] },
    { id: "r66-panorama", name: "66-Book Panorama", description: "Fly over the entire Bible by theme", path: "/games/room-game/r66-panorama", icon: "🗺️", difficulty: "hard", xpReward: 55, crossFloorRooms: ["BR", "CR"] },
  ],
  
  // ===== FLOOR 5 - VISION FLOOR (Prophecy & Sanctuary) =====
  bl: [
    { id: "bl-challenge", name: "Blue Room Challenge", description: "Navigate the sanctuary blueprint", path: "/games/room-game/bl-challenge", icon: "⛪", difficulty: "hard", xpReward: 50, badge: "Popular", crossFloorRooms: ["ST", "CR"] },
    { id: "bl-run", name: "Sanctuary Run", description: "Race through the temple stations", path: "/games/room-game/bl-run", icon: "🏃", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "ST"] },
    { id: "bl-furniture", name: "Furniture Match", description: "Match sanctuary items to Christ", path: "/games/room-game/bl-furniture", icon: "🪑", difficulty: "medium", xpReward: 35, crossFloorRooms: ["ST", "CR"] },
    { id: "bl-pattern", name: "Pattern Study", description: "See the heavenly pattern in earthly shadow", path: "/games/room-game/bl-pattern", icon: "📐", difficulty: "hard", xpReward: 50, crossFloorRooms: ["DR", "123H"] },
    { id: "bl-journey", name: "Sanctuary Journey", description: "Walk from altar to ark", path: "/games/room-game/bl-journey", icon: "🚶", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "IR"] },
  ],
  pr: [
    { id: "pr-dragon", name: "Escape the Dragon", description: "Navigate prophecy puzzles", path: "/games/room-game/pr-dragon", icon: "🐉", difficulty: "hard", xpReward: 55, badge: "Popular", crossFloorRooms: ["ST", "TZ"] },
    { id: "pr-timeline", name: "Prophecy Timeline", description: "Track prophetic timelines", path: "/games/room-game/pr-timeline", icon: "🔮", difficulty: "hard", xpReward: 50, crossFloorRooms: ["TZ", "123H"] },
    { id: "pr-telescope", name: "Telescope View", description: "Align Daniel and Revelation stars", path: "/games/room-game/pr-telescope", icon: "🔭", difficulty: "hard", xpReward: 55, crossFloorRooms: ["ST", "@"] },
    { id: "pr-constellations", name: "Constellations", description: "See repeat-and-enlarge patterns", path: "/games/room-game/pr-constellations", icon: "⭐", difficulty: "hard", xpReward: 50, crossFloorRooms: ["PRm", "ST"] },
    { id: "pr-decode", name: "Prophecy Decode", description: "Interpret prophetic symbols", path: "/games/room-game/pr-decode", icon: "🗝️", difficulty: "hard", xpReward: 55, crossFloorRooms: ["ST", "DC"] },
  ],
  "3a": [
    { id: "3a-sprint", name: "Three Angels Sprint", description: "Master the three angels' messages", path: "/games/room-game/3a-sprint", icon: "👼", difficulty: "hard", xpReward: 45, crossFloorRooms: ["CR", "PR"] },
    { id: "3a-mission", name: "Angels' Mission", description: "Apply the messages to modern issues", path: "/games/room-game/3a-mission", icon: "📢", difficulty: "hard", xpReward: 50, crossFloorRooms: ["HF", "CR"] },
    { id: "3a-gospel", name: "Everlasting Gospel", description: "The first angel's core message", path: "/games/room-game/3a-gospel", icon: "📜", difficulty: "medium", xpReward: 40, crossFloorRooms: ["CR", "TRm"] },
    { id: "3a-babylon", name: "Babylon Fallen", description: "The second angel's warning", path: "/games/room-game/3a-babylon", icon: "🏚️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["ST", "PR"] },
    { id: "3a-endurance", name: "Saints' Endurance", description: "The third angel's call", path: "/games/room-game/3a-endurance", icon: "💪", difficulty: "hard", xpReward: 55, crossFloorRooms: ["CR", "FRt"] },
  ],
  fe: [
    { id: "fe-calendar", name: "Feast Calendar", description: "Match feasts to their meanings", path: "/games/room-game/fe-calendar", icon: "🎊", difficulty: "medium", xpReward: 35, crossFloorRooms: ["ST", "BL"] },
    { id: "fe-journey", name: "Feast Journey", description: "Walk through the feast cycle", path: "/games/room-game/fe-journey", icon: "🗓️", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "TZ"] },
    { id: "fe-christ", name: "Feast → Christ", description: "See each feast in Christ", path: "/games/room-game/fe-christ", icon: "✝️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["CR", "ST"] },
    { id: "fe-timeline", name: "Feast Timeline", description: "Place feasts on redemptive calendar", path: "/games/room-game/fe-timeline", icon: "📅", difficulty: "hard", xpReward: 50, crossFloorRooms: ["TZ", "123H"] },
    { id: "fe-harvest", name: "Harvest Cycle", description: "Spring and fall feast meanings", path: "/games/room-game/fe-harvest", icon: "🌾", difficulty: "medium", xpReward: 40, crossFloorRooms: ["SR", "BL"] },
  ],
  
  // ===== FLOOR 6 - THREE HEAVENS & CYCLES FLOOR =====
  "123h": [
    { id: "123h-sorter", name: "Heaven Sorter", description: "Place events in correct heaven era", path: "/games/room-game/123h-sorter", icon: "☁️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["TZ", "PR"] },
    { id: "123h-dimensions", name: "Heaven Dimensions", description: "See heavenly perspectives", path: "/games/room-game/123h-dimensions", icon: "🌌", difficulty: "hard", xpReward: 55, crossFloorRooms: ["DR", "PR"] },
    { id: "123h-horizon", name: "Horizon Finder", description: "Identify DoL¹, DoL², DoL³ horizons", path: "/games/room-game/123h-horizon", icon: "🌅", difficulty: "hard", xpReward: 55, crossFloorRooms: ["OR", "PR"] },
    { id: "123h-olivet", name: "Olivet Decoder", description: "Sort Matthew 24 by horizon", path: "/games/room-game/123h-olivet", icon: "⛰️", difficulty: "hard", xpReward: 60, crossFloorRooms: ["SR", "PR"] },
    { id: "123h-isaiah", name: "Isaiah Horizons", description: "Multiple fulfillment in Isaiah 65-66", path: "/games/room-game/123h-isaiah", icon: "📖", difficulty: "hard", xpReward: 55, crossFloorRooms: ["QA", "PR"] },
  ],
  cycles: [
    { id: "cycles-race", name: "Cycle Race", description: "Navigate the 8 redemptive cycles", path: "/games/room-game/cycles-race", icon: "🔄", difficulty: "hard", xpReward: 55, crossFloorRooms: ["SR", "@"] },
    { id: "cycles-timeline", name: "Cycle Timeline", description: "Map cycles chronologically", path: "/games/room-game/cycles-timeline", icon: "⚙️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["TZ", "SR"] },
    { id: "cycles-5beat", name: "5-Beat Arc", description: "Identify Fall→Covenant→Sanctuary→Enemy→Restoration", path: "/games/room-game/cycles-5beat", icon: "🎵", difficulty: "hard", xpReward: 55, crossFloorRooms: ["SR", "BL"] },
    { id: "cycles-compare", name: "Cycle Compare", description: "Compare same elements across cycles", path: "/games/room-game/cycles-compare", icon: "⚖️", difficulty: "hard", xpReward: 55, crossFloorRooms: ["PRm", "P||"] },
    { id: "cycles-place", name: "Cycle Placer", description: "Assign passages to @Ad through @Re", path: "/games/room-game/cycles-place", icon: "📍", difficulty: "hard", xpReward: 50, crossFloorRooms: ["OR", "SR"] },
  ],
  jr: [
    { id: "jr-extractor", name: "Juice Extractor", description: "Squeeze meaning from entire books", path: "/games/room-game/jr-extractor", icon: "🍊", difficulty: "hard", xpReward: 50, crossFloorRooms: ["SR", "CR", "DR"] },
    { id: "jr-observation", name: "Deep Observation", description: "Find every detail in a book", path: "/games/room-game/jr-observation", icon: "🔬", difficulty: "hard", xpReward: 55, crossFloorRooms: ["OR", "QR"] },
    { id: "jr-compress", name: "150-Word Summary", description: "Distill a book to 150 words", path: "/games/room-game/jr-compress", icon: "📦", difficulty: "hard", xpReward: 60, crossFloorRooms: ["SR", "BR"] },
    { id: "jr-stress", name: "Juice Stress Test", description: "Run a book through all palace rooms", path: "/games/room-game/jr-stress", icon: "💪", difficulty: "hard", xpReward: 65, crossFloorRooms: ["ALL"] },
    { id: "jr-mastery", name: "Book Mastery", description: "Own a book at panoramic level", path: "/games/room-game/jr-mastery", icon: "🏆", difficulty: "hard", xpReward: 70, crossFloorRooms: ["DR", "R66"] },
  ],
  math: [
    { id: "math-builder", name: "Math Room", description: "Build complex theological equations", path: "/games/room-game/math-builder", icon: "🔢", difficulty: "hard", xpReward: 55, crossFloorRooms: ["DC", "ST"] },
    { id: "math-master", name: "Equation Master", description: "Solve advanced equation puzzles", path: "/games/room-game/math-master", icon: "🧮", difficulty: "hard", xpReward: 50, crossFloorRooms: ["DC", "QR"] },
    { id: "math-create", name: "Equation Creator", description: "Design your own Bible equations", path: "/games/room-game/math-create", icon: "✏️", difficulty: "hard", xpReward: 55, crossFloorRooms: ["GR", "ST"] },
    { id: "math-solve", name: "Equation Solver", description: "Decode others' Bible equations", path: "/games/room-game/math-solve", icon: "🔍", difficulty: "hard", xpReward: 50, crossFloorRooms: ["OR", "DC"] },
    { id: "math-chain", name: "Equation Chains", description: "Link equations into sequences", path: "/games/room-game/math-chain", icon: "🔗", difficulty: "hard", xpReward: 60, crossFloorRooms: ["QA", "ST"] },
  ],
  
  // ===== FLOOR 7 - SPIRITUAL & EMOTIONAL FLOOR =====
  frm: [
    { id: "frm-challenge", name: "Fire Room Challenge", description: "Face the flames of conviction", path: "/games/room-game/frm-challenge", icon: "🔥", difficulty: "hard", xpReward: 45, crossFloorRooms: ["IR", "CR"] },
    { id: "frm-sprint", name: "Fire Sprint", description: "Rapid conviction applications", path: "/games/room-game/frm-sprint", icon: "⚡", difficulty: "hard", xpReward: 50, crossFloorRooms: ["CR", "FRt"] },
    { id: "frm-furnace", name: "Furnace Walk", description: "Emotional weight of Scripture", path: "/games/room-game/frm-furnace", icon: "🏚️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["IR", "SR"] },
    { id: "frm-gethsemane", name: "Gethsemane", description: "Enter Christ's anguish", path: "/games/room-game/frm-gethsemane", icon: "🌿", difficulty: "hard", xpReward: 55, crossFloorRooms: ["IR", "CR"] },
    { id: "frm-calvary", name: "Calvary Reflection", description: "Stand at the cross", path: "/games/room-game/frm-calvary", icon: "✝️", difficulty: "hard", xpReward: 55, crossFloorRooms: ["CR", "DR", "IR"] },
  ],
  mr: [
    { id: "mr-master", name: "Meditation Master", description: "Deep meditative Scripture practice", path: "/games/room-game/mr-master", icon: "🙏", difficulty: "medium", xpReward: 35, crossFloorRooms: ["IR", "CR"] },
    { id: "mr-slow", name: "Slow Observation", description: "Patient, detailed study", path: "/games/room-game/mr-slow", icon: "🕯️", difficulty: "medium", xpReward: 30, crossFloorRooms: ["OR", "IR"] },
    { id: "mr-breath", name: "Breath Prayer", description: "Inhale/exhale Scripture meditation", path: "/games/room-game/mr-breath", icon: "💨", difficulty: "easy", xpReward: 25, crossFloorRooms: ["IR"] },
    { id: "mr-repeat", name: "Repetition Room", description: "Say it 10-20 times until it sinks", path: "/games/room-game/mr-repeat", icon: "🔁", difficulty: "medium", xpReward: 35, crossFloorRooms: ["TR"] },
    { id: "mr-distill", name: "Truth Distiller", description: "One distilled truth to carry", path: "/games/room-game/mr-distill", icon: "💧", difficulty: "medium", xpReward: 40, crossFloorRooms: ["GR", "CR"] },
  ],
  srm: [
    { id: "srm-drill", name: "Speed Drill", description: "Rapid-fire Scripture applications", path: "/games/room-game/srm-drill", icon: "⚡", difficulty: "hard", xpReward: 50, crossFloorRooms: ["CR", "ST"] },
    { id: "srm-connections", name: "Speed Connections", description: "Fast verse linking under pressure", path: "/games/room-game/srm-connections", icon: "🏎️", difficulty: "hard", xpReward: 45, crossFloorRooms: ["BF", "QA"] },
    { id: "srm-recall", name: "Recall Reflex", description: "30-second retrieval challenges", path: "/games/witness-trial", icon: "⏱️", difficulty: "hard", xpReward: 50, crossFloorRooms: ["SR", "CR"] },
    { id: "srm-iam", name: "'I AM' Sprint", description: "Name all 7 'I AM' statements fast", path: "/games/principle-sprint", icon: "7️⃣", difficulty: "medium", xpReward: 40, crossFloorRooms: ["CR"] },
    { id: "srm-daniel", name: "Daniel Macro", description: "Recite Daniel 2-7 sequence in 60s", path: "/games/time-zone-invasion", icon: "📜", difficulty: "hard", xpReward: 55, crossFloorRooms: ["SR", "PR"] },
  ],
  
  // ===== FLOOR 8 - MASTER FLOOR (Reflexive Thought) =====
  // Uses ALL 37 rooms in integrated mastery games
  infinity: [
    { id: "inf-teach", name: "Natural Teaching", description: "Teach without naming rooms—audit later", path: "/games/story-room", icon: "∞", difficulty: "hard", xpReward: 100, crossFloorRooms: ["ALL"] },
    { id: "inf-audit", name: "Post-Hoc Audit", description: "Tag which rooms you used unconsciously", path: "/games/observation-room", icon: "📋", difficulty: "hard", xpReward: 75, crossFloorRooms: ["ALL"] },
    { id: "inf-gap", name: "Gap Analysis", description: "Find rooms you're skipping instinctively", path: "/games/principle-sprint", icon: "🔍", difficulty: "hard", xpReward: 80, crossFloorRooms: ["ALL"] },
    { id: "inf-seamless", name: "Seamless Flow", description: "All rooms at once, no conscious effort", path: "/games/concentration-room", icon: "🌊", difficulty: "hard", xpReward: 100, crossFloorRooms: ["ALL"] },
    { id: "inf-mentor", name: "Mentor Others", description: "Teach the Palace to newcomers", path: "/games/witness-trial", icon: "👨‍🏫", difficulty: "hard", xpReward: 100, crossFloorRooms: ["ALL"] },
  ],
};

const difficultyColors = {
  easy: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
  hard: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
};

interface RoomGamesProps {
  roomId: string;
  roomName: string;
}

export const RoomGames = ({ roomId, roomName }: RoomGamesProps) => {
  const games = roomGamesMap[roomId] || [];
  
  if (games.length === 0) return null;
  
  return (
    <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-xl">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              🎮 Room Games
              <Badge variant="secondary" className="text-xs">
                {games.length} {games.length === 1 ? "game" : "games"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Practice {roomName} principles through interactive challenges
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {games.map((game) => (
            <Link key={game.id} to={game.path}>
              <div className="group p-4 rounded-xl border bg-card hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{game.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold group-hover:text-accent transition-colors">
                        {game.name}
                      </h4>
                      {game.badge && (
                        <Badge variant="default" className="text-xs bg-primary">
                          {game.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {game.description}
                    </p>
                    {game.crossFloorRooms && game.crossFloorRooms.length > 0 && game.crossFloorRooms[0] !== "ALL" && (
                      <p className="text-xs text-primary/70 mt-1">
                        Integrates: {game.crossFloorRooms.join(", ")}
                      </p>
                    )}
                    {game.crossFloorRooms && game.crossFloorRooms[0] === "ALL" && (
                      <p className="text-xs text-primary/70 mt-1 font-semibold">
                        Uses all 37 Palace rooms
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={difficultyColors[game.difficulty]}>
                      {game.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      +{game.xpReward} XP
                    </span>
                  </div>
                  <Play className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link to="/games">
            <Button variant="outline" className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              View All Games
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
