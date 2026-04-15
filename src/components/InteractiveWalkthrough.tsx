import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Building2, 
  Link2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Target,
  Brain,
  RefreshCw,
  MessageSquare,
  Layers,
  Clock,
  Flame,
  Crown,
  Compass,
  Search,
  Lightbulb,
  Heart,
  Film,
  Languages,
  Gem,
  HelpCircle,
  TreePine,
  User,
  History,
  Headphones,
  Grid3X3,
  Map,
  GitCompare,
  Scale,
  Telescope,
  AlertTriangle,
  CalendarDays,
  Zap,
  Gauge,
  Infinity
} from "lucide-react";

interface PalacePrinciple {
  id: string;
  name: string;
  code: string;
  floor: number;
  icon: React.ReactNode;
  color: string;
  verse: string;
  verseText: string;
  principleExplanation: string; // What the principle IS
  applicationToText: string; // How it applies to Psalm 23
  christConnection: string;
  jeevesInsight: string;
  memoryHook: string;
}

const ALL_PRINCIPLES: PalacePrinciple[] = [
  // FLOOR 1 - FURNISHING
  {
    id: "story-sequence",
    name: "Story Room",
    code: "SR",
    floor: 1,
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-500/20 text-blue-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd; I shall not want... I will dwell in the house of the LORD for ever.",
    principleExplanation: "The Story Room principle: Storage through visualization. Store each biblical story as a vivid mental movie — collect scenes before you interpret. Stories are the furniture of the Palace. The more you store, the more capacity you gain.",
    applicationToText: "Store Psalm 23 as five scenes: (1) Shepherd with staff → (2) Green meadow, still water → (3) Dark valley with shadow → (4) Banquet table with enemies watching → (5) Temple doors opening. Five scenes stored — raw material for every room above.",
    christConnection: "Jesus declares 'I am the Good Shepherd' (John 10:11). When you replay this movie, Christ is the figure with the staff in every scene.",
    jeevesInsight: "Notice the psalm moves from outdoor pasture to indoor temple — a journey from earth to heaven. Your mental movie should feel like you're walking FROM somewhere TO somewhere. That movement is the story.",
    memoryHook: "Close your eyes and walk through: meadow → stream → valley → banquet hall → temple. Five rooms in your mind."
  },
  {
    id: "imagination-immersion",
    name: "Imagination Room",
    code: "IR",
    floor: 1,
    icon: <Eye className="h-5 w-5" />,
    color: "bg-purple-500/20 text-purple-600",
    verse: "Psalm 23:2",
    verseText: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    principleExplanation: "The Imagination Room principle: Step INSIDE the text as if you were there. Engage all five senses — what do you see, hear, smell, feel, taste? This isn't fantasy; it's sanctified empathy that anchors memory in emotional experience.",
    applicationToText: "Immerse yourself in verse 2: Feel the soft grass beneath your back. Hear the quiet trickle of still water. Smell the fresh meadow air. Feel the sun warming your face. Sense the Shepherd sitting nearby, staff in hand, watching over you.",
    christConnection: "Christ offers living water (John 4:14) and calls the weary to rest in Him (Matt 11:28-29). When you lie down in this mental pasture, you're resting in Christ.",
    jeevesInsight: "The Hebrew 'still waters' literally means 'waters of rest.' Sheep won't drink from rushing streams — they fear drowning. Picture the Shepherd specifically finding a quiet pool for anxious souls. That's the image to carry.",
    memoryHook: "Spend 60 seconds actually lying down mentally in this meadow. Feel the grass. Hear the water. That memory will last longer than reading the verse 100 times."
  },
  {
    id: "24fps-frames",
    name: "24FPS Room",
    code: "24",
    floor: 1,
    icon: <Film className="h-5 w-5" />,
    color: "bg-orange-500/20 text-orange-600",
    verse: "Psalm 23",
    verseText: "The LORD is my shepherd... I will dwell in the house of the LORD for ever.",
    principleExplanation: "The 24FPS principle: Create ONE symbolic image per chapter — like a movie is made of 24 frames per second, Scripture becomes a mental film strip. Each Psalm gets one strange, memorable anchor image that encodes its content.",
    applicationToText: "Psalm 23's frame: A shepherd's crook wrapped in a golden crown, dripping with oil, resting on a banquet table. This single bizarre image encodes: shepherd (crook), kingship (crown), anointing (oil), provision (table). One image = one psalm.",
    christConnection: "The shepherd-crook wrapped in a crown IS Christ — the humble Shepherd who is also the King of Kings.",
    jeevesInsight: "The stranger the image, the better it sticks. A normal shepherd holding a staff? Forgettable. A crook wrapped in a crown dripping oil on a table in a dark valley? That's Psalm 23 encoded forever.",
    memoryHook: "When someone says 'Psalm 23,' your brain should instantly flash: crook + crown + oil + table. That's your 24FPS frame."
  },
  {
    id: "translation-pictures",
    name: "Translation Room",
    code: "TR",
    floor: 1,
    icon: <Languages className="h-5 w-5" />,
    color: "bg-teal-500/20 text-teal-600",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death.",
    principleExplanation: "The Translation Room principle: Convert abstract words into concrete, visible images. When you read 'shadow of death,' don't leave it as words — translate it into a picture you can see. Words become scenes; phrases become paintings.",
    applicationToText: "Translate 'valley of the shadow of death': Picture a deep ravine with steep walls. The sun is blocked, casting everything in grey shadow. The shadow has a shape — it looks like a hooded figure, but it's only a shadow, not death itself. And ahead, a glowing figure walks, dispelling the shadow with each step.",
    christConnection: "Christ absorbed death's reality at Calvary so we only pass through its shadow. He walked through death itself; we walk through its mere silhouette.",
    jeevesInsight: "Notice: it's the SHADOW of death, not death itself. Shadows cannot harm — they only frighten. Your translation should show a scary shape that, when you look closely, has no substance. That's the point.",
    memoryHook: "See the shadow on the valley wall. It looks terrifying — until the Shepherd's light reveals it's just a shadow of something already defeated."
  },
  {
    id: "gems-collection",
    name: "Gems Room",
    code: "GR",
    floor: 1,
    icon: <Gem className="h-5 w-5" />,
    color: "bg-pink-500/20 text-pink-600",
    verse: "Psalm 23:3a",
    verseText: "He restoreth my soul.",
    principleExplanation: "The Gems Room principle: Store powerful insights that shine with unusual clarity. A gem is not just any fact — it's a striking discovery that changes how you see the text. Collect and preserve these 'aha!' moments for future teaching and meditation.",
    applicationToText: "Gem discovered: The Hebrew word for 'restoreth' is SHUB — the same word used for 'repentance' (turning back). When God restores your soul, He's doing FOR you what repentance asks you to do yourself — He's turning you back to Him.",
    christConnection: "Christ doesn't just heal — He returns us to Eden's original design. Restoration isn't repair; it's re-creation.",
    jeevesInsight: "This is a gem worth collecting: Repentance (SHUB) is something we do; restoration (SHUB) is what God does. Same Hebrew word, different direction. We turn to Him; He turns us back to ourselves as He made us.",
    memoryHook: "Picture a gemstone emerging from rough rock. This SHUB insight is a gem — polish it and it will shine in every sermon about restoration."
  },

  // FLOOR 2 - INVESTIGATION
  {
    id: "observation-detective",
    name: "Observation Room",
    code: "OR",
    floor: 2,
    icon: <Search className="h-5 w-5" />,
    color: "bg-amber-500/20 text-amber-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... I will dwell in the house of the LORD for ever.",
    principleExplanation: "The Observation Room principle: Write 30-50 observations about a passage BEFORE interpretation. Like a detective gathering evidence before theories, log every detail — names, numbers, actions, repetitions, sequences, contrasts — without rushing to meaning.",
    applicationToText: "Observations on Psalm 23: (1) Six verses. (2) 'LORD' appears twice. (3) Moves from 'He' statements to 'Thou' statements at verse 4 — from talking ABOUT God to talking TO God. (4) Settings shift: pasture → water → valley → table → temple. (5) Enemies appear only once, silently watching.",
    christConnection: "Observe: The psalm moves from third person ('He maketh me') to second person ('Thou art with me') exactly when danger arrives. In the valley, intimacy intensifies.",
    jeevesInsight: "Count the 'He' statements (what God does) versus 'I' statements (David's response). The psalm is 80% about God's action, 20% human response. Biblical faith is primarily receptive — that's an observation that shapes theology.",
    memoryHook: "Put on detective glasses. Bag every clue before building theories. The shift from 'He' to 'Thou' at verse 4 is a fingerprint most readers miss."
  },
  {
    id: "defcom-definitions",
    name: "Def-Com Room",
    code: "DC",
    floor: 2,
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-indigo-500/20 text-indigo-600",
    verse: "Psalm 23:5",
    verseText: "Thou anointest my head with oil; my cup runneth over.",
    principleExplanation: "The Def-Com Room principle: Run words through the forensic lab — check Greek/Hebrew definitions and historical/cultural context. Commentaries are expert witnesses, not judges. The goal is precision: what did this word mean to the original audience?",
    applicationToText: "Lab results: 'Anointest' (Hebrew: dishanta) literally means 'to make fat, to enrich, to saturate.' It's not a light touch — it's being drenched in abundance. 'Runneth over' (Hebrew: revayah) means 'saturation, overflow.' The image is embarrassing excess.",
    christConnection: "Anointing (mashach) is the root of 'Messiah' — the Anointed One. David receives what Christ IS. The oil points to the Holy Spirit poured out without measure on Christ (John 3:34).",
    jeevesInsight: "Cultural context: In the ancient Near East, a host anointed guests as honor. An overflowing cup meant 'I cannot contain my generosity toward you.' God isn't being careful with His blessing — He's being extravagant.",
    memoryHook: "Picture oil being poured so generously it runs down your face. That's dishanta. Picture a cup being filled past the brim. That's revayah. Embarrassing excess."
  },
  {
    id: "symbols-types",
    name: "Symbols/Types Room",
    code: "@T",
    floor: 2,
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-violet-500/20 text-violet-600",
    verse: "Psalm 23:5b",
    verseText: "My cup runneth over.",
    principleExplanation: "The Symbols/Types Room principle: Identify God's recurring imagery as prophetic pictures. Symbols (lamb, rock, water) carry consistent meaning across Scripture. Types are shadows of Christ — Old Testament persons, objects, or events that foreshadow the Messiah.",
    applicationToText: "Symbol identified: The 'cup' appears throughout Scripture — cup of blessing (Ps 116:13), cup of salvation, cup of wrath (Jer 25), cup of the New Covenant (Luke 22:20). David's overflowing cup points forward to Christ's cup at the Last Supper.",
    christConnection: "Jesus took the cup and said 'This cup is the new covenant in my blood.' David's cup of blessing anticipates the cup of redemption that would overflow to all nations.",
    jeevesInsight: "Track the 'cup' symbol across Scripture: blessing (Ps 23), salvation (Ps 116), wrath (Jer 25), and covenant (Luke 22). Same symbol, layers of meaning. Christ drank the cup of wrath so ours could overflow with blessing.",
    memoryHook: "See the cup in David's hand transform into the cup in Christ's hand at the Last Supper. Same symbol, ultimate fulfillment."
  },
  {
    id: "questions-75",
    name: "Questions Room",
    code: "QR",
    floor: 2,
    icon: <HelpCircle className="h-5 w-5" />,
    color: "bg-rose-500/20 text-rose-600",
    verse: "Psalm 23:4",
    verseText: "I will fear no evil: for thou art with me.",
    principleExplanation: "The Questions Room principle: Ask 75 questions per passage across three levels — Intratextual (inside the text), Intertextual (across Scripture), and Phototheological (within the Palace framework). Interrogate until the story emerges.",
    applicationToText: "Sample questions: INTRATEXTUAL — Why 'fear NO evil' rather than 'face no evil'? Why does David switch from 'He' to 'Thou' exactly here? INTERTEXTUAL — Where else does God's presence remove fear? (Exodus 33, Isaiah 41:10) PHOTOTHEOLOGICAL — Which Palace rooms does 'Thou art with me' activate?",
    christConnection: "The answer to 'Why no fear?' is 'FOR thou art with me.' The presence of Christ is the antidote to fear — not the absence of evil, but the presence of the Shepherd.",
    jeevesInsight: "Key question: Does David say evil won't exist in the valley, or that he won't FEAR it? The text admits evil is real but strips its power through relationship. Presence conquers fear; presence doesn't eliminate danger.",
    memoryHook: "Picture a room full of floating question marks. Each one you answer unlocks another layer of the text."
  },
  {
    id: "qa-crossref",
    name: "Q&A Room",
    code: "QA",
    floor: 2,
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-emerald-500/20 text-emerald-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    principleExplanation: "The Q&A Room principle: Let Scripture interpret Scripture. Cross-reference verses to answer questions — like witnesses corroborating testimony in court. If one verse asks a question, another verse answers it. Scripture is its own best commentary.",
    applicationToText: "Question: Who is the Shepherd? Answer from John 10:11 — 'I am the good shepherd: the good shepherd giveth his life for the sheep.' Question: What does the Shepherd do? Answer from John 10:11 — He dies for His sheep. Psalm 23's Shepherd is identified in John 10.",
    christConnection: "Psalm 23 asks; John 10 answers. The entire Gospel of John chapter 10 is the New Testament commentary on Psalm 23. Cross-reference them and Christ emerges.",
    jeevesInsight: "The Q&A Room protects against private interpretation. When you ask 'Who is my shepherd?' and let John 10:11 answer, you're not inventing meaning — you're discovering it. Witnesses corroborate; truth emerges.",
    memoryHook: "Picture a courtroom: Psalm 23 is on the witness stand. John 10 is called as a corroborating witness. Their testimony matches — the Shepherd is Christ."
  },

  // FLOOR 3 - FREESTYLE
  {
    id: "nature-freestyle",
    name: "Nature Freestyle Room",
    code: "NF",
    floor: 3,
    icon: <TreePine className="h-5 w-5" />,
    color: "bg-green-500/20 text-green-600",
    verse: "Psalm 23:2",
    verseText: "He maketh me to lie down in green pastures.",
    principleExplanation: "The Nature Freestyle principle: Nature is God's second book (Romans 1:20). Every element of creation — trees, water, animals, weather — can become a sermon illustration. Train yourself to see Scripture in the world around you spontaneously.",
    applicationToText: "Next time you see a meadow, a stream, or actual sheep, let it preach Psalm 23. The grass is real; the water is real; shepherds are real. Nature testifies to the Creator's care — and Psalm 23 is nature's vocabulary for describing divine providence.",
    christConnection: "Real sheep in real pastures → Real Shepherd caring for real souls. When you see creation, you're seeing the stage where God's shepherding drama unfolds.",
    jeevesInsight: "Walk outside right now. Every tree says 'Psalm 1.' Every stream says 'Psalm 23.' Every storm says 'Psalm 29.' Nature is a Bible with different letters. Learn to read it.",
    memoryHook: "The next meadow you see is a Psalm 23 flashcard. The next stream is a memory trigger. Let the world preach."
  },
  {
    id: "personal-freestyle",
    name: "Personal Freestyle Room",
    code: "PF",
    floor: 3,
    icon: <User className="h-5 w-5" />,
    color: "bg-blue-400/20 text-blue-500",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death.",
    principleExplanation: "The Personal Freestyle principle: Your own life experiences become object lessons. Every joy, mistake, delay, grief, and victory is teaching material. Like a hip-hop artist rapping about his struggles, you use your story as Scripture's illustration.",
    applicationToText: "What valley are you walking through right now? That's where Psalm 23 becomes personal. David didn't write theory from a comfortable desk — he wrote testimony from actual valleys. Your valleys qualify you to teach this psalm.",
    christConnection: "Your valleys — grief, failure, fear, loss — become classrooms where Christ's presence is proven real. Personal experience validates ancient text.",
    jeevesInsight: "When you teach Psalm 23, your stories aren't distractions — they're demonstrations. 'I walked through a valley last year, and here's how the Shepherd showed up...' That's the Personal Freestyle principle in action.",
    memoryHook: "Your life story overlaid with Psalm 23 — each chapter of your journey matching a verse. You're living the psalm."
  },
  {
    id: "bible-freestyle-genetics",
    name: "Bible Freestyle Room",
    code: "BF",
    floor: 3,
    icon: <Compass className="h-5 w-5" />,
    color: "bg-purple-400/20 text-purple-500",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    principleExplanation: "The Bible Freestyle principle (Verse Genetics): Every verse in the Bible is related to every other verse — some are siblings, others cousins, others distant relatives. Trace the 'family tree' of any verse by finding its connections across Scripture.",
    applicationToText: "Psalm 23:1's family tree: Genesis 48:15 (God who shepherded me) → Genesis 49:24 (Shepherd, Stone of Israel) → Psalm 80:1 (Shepherd of Israel) → Isaiah 40:11 (He shall feed his flock) → Ezekiel 34:23 (I will set up one shepherd) → John 10:11 (I am the good shepherd) → Hebrews 13:20 (Great Shepherd) → 1 Peter 5:4 (Chief Shepherd) → Revelation 7:17 (Lamb shall shepherd them).",
    christConnection: "Psalm 23 sits at the center of Scripture's shepherd genealogy. Behind it: patriarchal promises. Ahead of it: Messianic fulfillment. Christ is the genetic center of every shepherd verse.",
    jeevesInsight: "In verse genetics, no verse is an only child. 'The LORD is my shepherd' has ancestors (Genesis, Isaiah) and descendants (John, Revelation). Trace the DNA and you'll find Christ in every generation.",
    memoryHook: "Picture a family tree with Psalm 23:1 at the center — branches reaching back to Genesis, branches reaching forward to Revelation."
  },
  {
    id: "history-freestyle",
    name: "History Freestyle Room",
    code: "HF",
    floor: 3,
    icon: <History className="h-5 w-5" />,
    color: "bg-amber-400/20 text-amber-500",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me in the presence of mine enemies.",
    principleExplanation: "The History Freestyle principle: Find lessons in culture, politics, and secular history. The goal is to let the Bible interpret current events and historical moments — seeing God's patterns repeating across human story.",
    applicationToText: "Historical echoes of Psalm 23:5: Esther feasting while Haman watched. Daniel dining in Babylon while enemies plotted. The early church breaking bread while Rome persecuted. Martin Luther at Worms, standing firm while enemies surrounded. God's people feast while enemies observe.",
    christConnection: "Throughout history, God's people have dined at tables of provision while enemies watched powerlessly. The pattern repeats because Christ is the same yesterday, today, and forever.",
    jeevesInsight: "Think of historical moments when the righteous feasted under siege: Daniel in Babylon, Esther before Haman, the persecuted church in catacombs. Psalm 23:5 is a pattern, not just a poem.",
    memoryHook: "A timeline of history with banquet tables appearing at key moments — each one an echo of Psalm 23:5."
  },

  // FLOOR 4 - NEXT LEVEL
  {
    id: "concentration-christ",
    name: "Concentration Room",
    code: "CR",
    floor: 4,
    icon: <Target className="h-5 w-5" />,
    color: "bg-red-500/20 text-red-600",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me.",
    principleExplanation: "The Concentration Room principle: Every text must reveal Christ. If you can't find Jesus, you haven't finished studying. Use this room like a magnifying glass — bend every verse until the light focuses on Christ. No passage is Christless.",
    applicationToText: "Focus the lens: 'Valley of the shadow of death' — Christ walked through death itself at Calvary. 'I will fear no evil' — Christ said 'Fear not' more than any other command. 'Thou art with me' — Christ is Emmanuel, God WITH us. Every phrase, every image, bends toward Jesus.",
    christConnection: "The 'shadow of death' points to Calvary — where Christ walked through death's reality so we only pass through its shadow. He absorbed the substance; we traverse the silhouette.",
    jeevesInsight: "Notice: it's the SHADOW of death, not death itself. Shadows cannot harm — they only frighten. Christ absorbed death's reality at Golgotha. What remains for us is only shadow — and shadows flee at the Shepherd's light.",
    memoryHook: "A magnifying glass held over verse 4, bending all light until it forms the shape of Christ on the cross."
  },
  {
    id: "dimensions-five",
    name: "Dimensions Room",
    code: "DR",
    floor: 4,
    icon: <Layers className="h-5 w-5" />,
    color: "bg-orange-400/20 text-orange-500",
    verse: "Psalm 23:3",
    verseText: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
    principleExplanation: "The Dimensions Room principle: Stretch every text across five levels — 1D (Literal: what it plainly says), 2D (Christ: how it points to Jesus), 3D (Me: personal application), 4D (Church: corporate meaning), 5D (Heaven: eternal/celestial scope). Same verse, five dimensions.",
    applicationToText: "Psalm 23:3 in five dimensions: 1D-Literal: David experienced soul-restoration and moral guidance. 2D-Christ: Jesus restores all things and is the Way. 3D-Me: I receive personal renewal and direction. 4D-Church: The body of Christ experiences corporate revival. 5D-Heaven: Ultimate restoration when all things are made new.",
    christConnection: "'For HIS name's sake' — not for my worthiness. God leads us rightly to protect His reputation, not reward our merit. This removes performance anxiety from the Christian life.",
    jeevesInsight: "Hold the verse up to five different lights. Each dimension reveals a new facet. You haven't fully studied a verse until you've walked it through all five dimensions — from literal meaning to heavenly consummation.",
    memoryHook: "Five transparent layers stacked like glass, each revealing a deeper dimension of 'He restoreth my soul.'"
  },
  {
    id: "connect6-genre",
    name: "Connect 6 Room",
    code: "C6",
    floor: 4,
    icon: <Grid3X3 className="h-5 w-5" />,
    color: "bg-indigo-400/20 text-indigo-500",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd...",
    principleExplanation: "The Connect 6 Room principle: Classify texts by genre — Prophecy, Poetry, History, Gospels, Epistles, Parables. Each genre has its own 'rules of language.' You don't critique a rap lyric like a symphony; you don't read poetry like history.",
    applicationToText: "Psalm 23 is poetry — which means it uses metaphor, parallelism, and rhythm. God is not literally a shepherd; David was not literally a sheep. But the metaphor carries truth that plain language cannot. Reading poetry literally is a category error.",
    christConnection: "Psalm 23's poetry points to the historical Christ who is metaphorically (and more than metaphorically) the Good Shepherd. Poetry and history meet in Jesus.",
    jeevesInsight: "Knowing Psalm 23 is poetry liberates interpretation. 'Green pastures' doesn't require actual grass — it's poetic shorthand for provision. Genre-awareness prevents wooden literalism and licenses metaphorical richness.",
    memoryHook: "Six genre doors — each with different reading rules. Step through the Poetry door to enter Psalm 23 correctly."
  },
  {
    id: "theme-walls",
    name: "Theme Room",
    code: "TRm",
    floor: 4,
    icon: <Map className="h-5 w-5" />,
    color: "bg-teal-400/20 text-teal-500",
    verse: "Psalm 23:5-6",
    verseText: "Thou preparest a table... I will dwell in the house of the LORD.",
    principleExplanation: "The Theme Room principle: Organize Scripture along four great structural walls — Sanctuary Wall (temple/worship themes), Life of Christ Wall (Jesus' story), Great Controversy Wall (cosmic battle), Time Prophecy Wall (prophetic timelines). Every verse hangs on one or more walls.",
    applicationToText: "Psalm 23 touches multiple walls: SANCTUARY WALL — 'table,' 'house of the LORD,' 'oil' (anointing). LIFE OF CHRIST WALL — Shepherd imagery fulfilled in John 10. GREAT CONTROVERSY WALL — 'enemies' watching powerlessly as God vindicates His own.",
    christConnection: "The 'table' and 'house of the LORD' connect to sanctuary themes. The 'enemies' connect to Great Controversy. One psalm spans multiple theological walls — showing how themes interweave.",
    jeevesInsight: "When you can place a verse on its proper wall(s), you've located it in the palace of theology. Psalm 23 hangs on at least three walls — Sanctuary, Christ, and Controversy. That's depth.",
    memoryHook: "A palace with thematic walls — each verse of Psalm 23 finds its place, some verses spanning multiple walls."
  },
  {
    id: "timezone-sixfold",
    name: "Time Zone Room",
    code: "TZ",
    floor: 4,
    icon: <Clock className="h-5 w-5" />,
    color: "bg-sky-500/20 text-sky-600",
    verse: "Psalm 23:6",
    verseText: "Surely goodness and mercy shall follow me all the days of my life.",
    principleExplanation: "The Time Zone Room principle: Place texts across six zones — Earth-Past, Earth-Present, Earth-Future, Heaven-Past, Heaven-Present, Heaven-Future. Every verse has temporal and spatial location. 'When' and 'where' matter for interpretation.",
    applicationToText: "Psalm 23:6 across time zones: EARTH-PAST — God's faithfulness to David. EARTH-PRESENT — Christ's ongoing mercy to us now. EARTH-FUTURE — Goodness pursuing us until death. HEAVEN-FUTURE — 'Dwell in the house of the LORD forever' extends into eternity.",
    christConnection: "The Hebrew for 'follow' is RADAPH — to pursue, chase, hunt. God's goodness isn't passive; it actively hunts you down through all time zones, from David's past to your eternal future.",
    jeevesInsight: "'All the days of my life' is Earth-time. 'Forever' crosses into Heaven-time. David glimpses what the New Testament reveals fully — temporal mercy extending into eternal dwelling.",
    memoryHook: "A six-section grid: three zones on earth, three in heaven. Psalm 23:6 spans from earth-past to heaven-future."
  },
  {
    id: "patterns-recurring",
    name: "Patterns Room",
    code: "PRm",
    floor: 4,
    icon: <Link2 className="h-5 w-5" />,
    color: "bg-green-500/20 text-green-600",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil.",
    principleExplanation: "The Patterns Room principle: Trace recurring motifs across Scripture — like riffs in a symphony. Numbers (40, 3, 7, 12), events (deliverance, exodus, restoration), and images (table, water, mountain) repeat with variation. Recognize the motif; anticipate its return.",
    applicationToText: "Pattern identified: 'Table in presence of enemies' recurs — Joseph's brothers bow before his table. Esther feasts while Haman watches. Daniel dines in Babylon. The Last Supper occurs with Judas at the table. Wedding Supper of the Lamb while nations rage. Same pattern, escalating fulfillment.",
    christConnection: "The table pattern culminates in Revelation 19 — the Marriage Supper of the Lamb. Enemies watch the feast they cannot attend. Psalm 23:5 is a preview of eschatological vindication.",
    jeevesInsight: "The enemies aren't destroyed — they're forced to WATCH. This is the ultimate vindication pattern: dining with God while those who opposed you observe His favor upon you. The pattern repeats because God's vindication method is consistent.",
    memoryHook: "A musical staff with the 'table before enemies' motif recurring through Joseph, Esther, Daniel, the Last Supper, and the Marriage Supper."
  },
  {
    id: "parallels-mirrored",
    name: "Parallels Room",
    code: "P‖",
    floor: 4,
    icon: <GitCompare className="h-5 w-5" />,
    color: "bg-violet-400/20 text-violet-500",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    principleExplanation: "The Parallels Room principle: Unlike types (objects pointing forward), parallels are mirrored ACTIONS across time. Events reflect events; actions echo actions. Stand between two mirrors and watch reflections multiply through history.",
    applicationToText: "Parallel actions: David shepherded literal sheep → David shepherded Israel as king → Christ shepherds the Church. Moses led sheep in Midian → Moses led Israel through wilderness → Christ leads His people through the world. Shepherd actions parallel across generations.",
    christConnection: "David was a shepherd who became king. Jesus is the King who became a shepherd. The parallel inverts — God's pattern of exaltation through humiliation.",
    jeevesInsight: "Types focus on objects (lamb = Christ). Parallels focus on actions (David shepherding = Christ shepherding). Both are valid; both are distinct. The Parallels Room tracks what people DO, not what things REPRESENT.",
    memoryHook: "Two mirrors facing each other — David's shepherding reflected forward into Christ's shepherding, multiplying into church history."
  },
  {
    id: "fruit-test",
    name: "Fruit Room",
    code: "FRt",
    floor: 4,
    icon: <Heart className="h-5 w-5" />,
    color: "bg-rose-400/20 text-rose-500",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... surely goodness and mercy shall follow me.",
    principleExplanation: "The Fruit Room principle: Every interpretation must pass the fruit test (Galatians 5:22-23). Does this reading produce love, joy, peace, patience, kindness, goodness, faith, meekness, temperance? If it produces arrogance, fear, or despair, it has failed the test.",
    applicationToText: "Fruit test for Psalm 23: Does your reading produce trust (not fear)? Rest (not anxiety)? Confidence (not despair)? Humility (not arrogance)? If studying Psalm 23 makes you stressed about whether you're 'good enough' for the Shepherd, you've misread it.",
    christConnection: "Psalm 23 produces the fruits of walking with Christ — peace in the valley, rest in the pasture, confidence at the table, joy in the house of the LORD. Any reading that produces the opposite is poison, not fruit.",
    jeevesInsight: "The fruit test is the final guardrail. You might have excellent observations, perfect definitions, and creative connections — but if the result is spiritual anxiety rather than rest, you've failed. Psalm 23 should produce peace.",
    memoryHook: "A tree bearing nine fruits of the Spirit — each one growing from correct interpretation of Psalm 23."
  },
  {
    id: "cec-every-chapter",
    name: "Christ in Every Chapter",
    code: "CEC",
    floor: 4,
    icon: <Crown className="h-5 w-5" />,
    color: "bg-yellow-500/20 text-yellow-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd...",
    principleExplanation: "The CEC principle: Every chapter must name and trace the line to Christ explicitly. You don't move on until the chapter's Christ-thread is anchored and confessed. No verse left without its Christological connection.",
    applicationToText: "Psalm 23's Christ-line, verse by verse: V.1 — Christ is the Good Shepherd (John 10:11). V.2-3 — Christ gives rest and leads in righteousness (Matt 11:28-29). V.4 — Christ conquers death (Heb 2:14-15). V.5 — Christ is the anointed Host (Luke 22:20). V.6 — Christ prepares eternal dwelling (John 14:2-3).",
    christConnection: "Can you name Christ in every verse? That's the CEC standard. V.1: Good Shepherd. V.2-3: Rest-giver. V.4: Death-conqueror. V.5: Anointed Host. V.6: Home-preparer. The whole psalm is Christological.",
    jeevesInsight: "The CEC room demands specificity. Vague claims like 'This chapter is about Jesus somehow' fail. You must trace the exact line: verse → Christ-connection → cross-reference. Precision matters.",
    memoryHook: "A chapter with Christ's name written beside every single verse — no text left orphaned from its Savior."
  },

  // FLOOR 5 - VISION
  {
    id: "blue-sanctuary",
    name: "Blue Room (Sanctuary)",
    code: "BL",
    floor: 5,
    icon: <Building2 className="h-5 w-5" />,
    color: "bg-blue-600/20 text-blue-700",
    verse: "Psalm 23:6b",
    verseText: "And I will dwell in the house of the LORD for ever.",
    principleExplanation: "The Blue Room principle: Map texts to sanctuary furniture and services. The tabernacle/temple is heaven's blueprint — Altar (sacrifice), Laver (cleansing), Lampstand (light), Bread (Word), Incense (prayer), Veil (access), Ark (God's presence). Every doctrine finds its sanctuary anchor.",
    applicationToText: "Psalm 23 through the sanctuary: Green pastures = Court (provision). Still waters = Laver (cleansing). Valley = approach to Holy Place. Table = Table of Showbread. Oil = Anointing at Altar of Incense. House of the LORD = Most Holy Place, God's presence forever.",
    christConnection: "The 'house of the LORD' points to the Temple, Christ's body (John 2:19-21), and ultimately the New Jerusalem (Rev 21:22) where God dwells with humanity. The sanctuary journey ends in eternal presence.",
    jeevesInsight: "'Forever' in Hebrew is 'length of days' — but David extends it beyond life. He glimpses eternity, anticipating what the New Testament reveals: the ultimate Holy of Holies is God's eternal presence with His people.",
    memoryHook: "Walk through the tabernacle as you read Psalm 23 — from the courtyard pastures to the Most Holy Place forever."
  },
  {
    id: "prophecy-telescope",
    name: "Prophecy Room",
    code: "PR",
    floor: 5,
    icon: <Telescope className="h-5 w-5" />,
    color: "bg-purple-600/20 text-purple-700",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me in the presence of mine enemies.",
    principleExplanation: "The Prophecy Room principle: Align texts with prophetic timelines — Daniel's beasts, Revelation's seals, the 2300 days, the three angels. The historicist method sees prophecy fulfilled progressively from the prophet's time to the end. Locate each text in the prophetic panorama.",
    applicationToText: "Psalm 23:5's prophetic reach: The ultimate 'table in the presence of enemies' is the Marriage Supper of the Lamb (Rev 19:7-9) while Babylon watches (Rev 19:17-21). David's psalm anticipates eschatological vindication.",
    christConnection: "Revelation 19's marriage supper fulfills Psalm 23:5 on a cosmic scale. The enemies? They become the 'supper of the great God' (Rev 19:17). The contrast is stark — God's people feast; enemies are the feast.",
    jeevesInsight: "The Prophecy Room connects Psalm 23 to Revelation's climax. When you read 'table in the presence of enemies,' you should see all the way to the Marriage Supper. That's prophetic range.",
    memoryHook: "A telescope extending Psalm 23:5 forward in time until the Marriage Supper of the Lamb comes into focus."
  },
  {
    id: "feasts-calendar",
    name: "Feasts Room",
    code: "FR",
    floor: 5,
    icon: <CalendarDays className="h-5 w-5" />,
    color: "bg-orange-600/20 text-orange-700",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me.",
    principleExplanation: "The Feasts Room principle: Connect texts to Israel's seven feasts — Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles. Each feast prophetically shadows Christ's work. Find the feast echoes in every text.",
    applicationToText: "Psalm 23's feast connections: 'Table' → Passover meal (lamb on the table). 'Anointing' → Day of Atonement (high priest anointed). 'Dwelling in God's house forever' → Feast of Tabernacles (dwelling with God). The psalm is a feast calendar in miniature.",
    christConnection: "Passover: Christ our Lamb. Atonement: Christ our High Priest. Tabernacles: Christ dwelling with us forever. Psalm 23 touches three major feasts, all fulfilled in Jesus.",
    jeevesInsight: "The feasts aren't just history — they're prophecy. Spring feasts (Passover, Firstfruits, Pentecost) were fulfilled at Christ's first coming. Fall feasts (Trumpets, Atonement, Tabernacles) await fulfillment. Psalm 23:6's 'dwell forever' is Tabernacles — still future.",
    memoryHook: "A Jewish calendar with Psalm 23 verses placed on their corresponding feast days — visual connection between text and time."
  },

  // FLOOR 6 - THREE HEAVENS
  {
    id: "cycles-eight",
    name: "Cycles Room",
    code: "@",
    floor: 6,
    icon: <RefreshCw className="h-5 w-5" />,
    color: "bg-yellow-500/20 text-yellow-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    principleExplanation: "The Cycles Room principle: Place texts within the eight great epochs — @Ad (Adam), @No (Noah), @Ab (Abraham), @Mo (Moses), @Cy (Cyrus), @CyC (Christ), @Sp (Spirit/Church), @Re (Remnant). Each cycle follows: Fall → Covenant → Sanctuary → Enemy → Restoration. History repeats with variation.",
    applicationToText: "Psalm 23's cycle placement: Written in @Mo (Mosaic era) by David. Points forward to @CyC (Cyrus-Christ) where the true Shepherd appears. Echoes back to @Ab (Abraham's 'God will provide'). Extends to @Re (Remnant) where final shepherding occurs.",
    christConnection: "David was a shepherd who became king (@Mo). Christ is the King who became a shepherd (@CyC). The cycles invert — God's pattern of exaltation through humiliation finds its climax in Jesus.",
    jeevesInsight: "Every cycle has a shepherd figure: Abel (keeper of sheep), Abraham (herdsman), Moses (Midian shepherd), David (Bethlehem shepherd), Christ (Good Shepherd). The motif recurs across all eight epochs.",
    memoryHook: "A wheel with eight spokes — each spoke a cycle, each cycle featuring a shepherd, all pointing to Christ at the hub."
  },
  {
    id: "threeheavens-dol",
    name: "Three Heavens",
    code: "1H/2H/3H",
    floor: 6,
    icon: <Layers className="h-5 w-5" />,
    color: "bg-sky-600/20 text-sky-700",
    verse: "Psalm 23:6",
    verseText: "I will dwell in the house of the LORD for ever.",
    principleExplanation: "The Three Heavens principle: Three Day-of-the-LORD cycles, each with its 'new heavens and earth' — 1H (Babylon's destruction → post-exilic restoration), 2H (70 AD destruction → New Covenant/church), 3H (Final judgment → literal New Creation). Locate each text in its proper horizon.",
    applicationToText: "Psalm 23:6 across horizons: David writes in 1H context (earthly temple). 'Dwell forever' finds partial fulfillment in 2H (church as God's temple). Ultimate fulfillment awaits 3H — the New Jerusalem where 'the Lord God Almighty and the Lamb are the temple' (Rev 21:22).",
    christConnection: "David glimpsed 3H reality from 1H context. 'Forever' transcends the earthly temple — it requires the eternal one. Christ bridges all three heavens.",
    jeevesInsight: "Don't flatten all 'new heavens and new earth' into 3H only. There are typological renewals in 1H (post-exile) and 2H (church age). Each horizon has its 'dwelling with God' — but 3H is ultimate.",
    memoryHook: "Three ascending platforms — 1H (temple rebuilt), 2H (church as temple), 3H (New Jerusalem). Psalm 23:6 climbs to the top."
  },
  {
    id: "juice-squeeze",
    name: "Juice Room",
    code: "JR",
    floor: 6,
    icon: <Zap className="h-5 w-5" />,
    color: "bg-lime-500/20 text-lime-600",
    verse: "Psalm 23:1-6",
    verseText: "The complete psalm squeezed through all principles.",
    principleExplanation: "The Juice Room principle: Run one entire book through every Phototheology principle — Story, Observation, Translation, Freestyle, Concentration, Prophecy, Cycles, Heavens. Squeeze it completely, extracting every drop of meaning. Nothing left unexamined.",
    applicationToText: "Juicing Psalm 23: Story Room (movie sequence) + Observation (30 details) + Translation (visual images) + Freestyle (nature/personal connections) + Concentration (Christ in every verse) + Prophecy (Marriage Supper) + Cycles (@Mo → @CyC) + Heavens (1H → 3H). Total extraction.",
    christConnection: "When you juice an entire book, Christ appears in concentrated form. Every principle adds another drop; together they form the full cup of Christological meaning.",
    jeevesInsight: "The Juice Room prevents superficial study. You don't just read Psalm 23 — you press it through every room until nothing is left unexamined. Most Bible reading is sipping; juicing is pressing.",
    memoryHook: "An orange being squeezed — each drop representing a different insight from a different Palace room. Don't stop until the pulp is dry."
  },

  // FLOOR 7 - SPIRITUAL/EMOTIONAL
  {
    id: "fire-emotion",
    name: "Fire Room",
    code: "FRm",
    floor: 7,
    icon: <Flame className="h-5 w-5" />,
    color: "bg-orange-600/20 text-orange-700",
    verse: "Psalm 23:4b",
    verseText: "Thy rod and thy staff they comfort me.",
    principleExplanation: "The Fire Room principle: Engage emotions — conviction, awe, comfort, courage. Don't just analyze; feel the weight of truth. Study that doesn't stir the heart has missed the point. The Fire Room plunges you into the emotional reality of the text.",
    applicationToText: "Feel verse 4: The rod is raised against wolves — feel the relief of protection. The staff's crook wraps around your waist, pulling you from the pit — feel the rescue. Comfort doesn't come from absence of danger but from presence of the equipped Protector.",
    christConnection: "The rod protects; the staff rescues. Christ both defends us from wolves (John 10:12) and pulls us from pits (Luke 15:4-5). The Shepherd is armed for your sake.",
    jeevesInsight: "The rod was for fighting wolves; the staff had a crook for rescuing stuck sheep. Don't sentimentalize 'comfort' — it's the relief of knowing your Shepherd carries weapons and rescue equipment. That's real comfort.",
    memoryHook: "Feel the warmth of being defended — the rod raised against enemies, the staff's crook around your waist pulling you to safety. That's the fire of comfort."
  },
  {
    id: "meditation-slow",
    name: "Meditation Room",
    code: "MR",
    floor: 7,
    icon: <Lightbulb className="h-5 w-5" />,
    color: "bg-amber-600/20 text-amber-700",
    verse: "Psalm 23:2b",
    verseText: "He leadeth me beside the still waters.",
    principleExplanation: "The Meditation Room principle: Slow down. Marinate in truth until it saturates the soul. Biblical meditation isn't Eastern emptying — it's filling, chewing, ruminating (like a cow with cud). Repeat the verse until it seeps into your being.",
    applicationToText: "Meditate on 'still waters': Say it slowly. 'He... leadeth... me... beside... the still... waters.' Pause. Picture the quiet pool. Hear the silence. Feel the peace. Don't rush to the next verse. Stay here until the stillness enters you.",
    christConnection: "Meditation imitates the 'still waters' it describes. The method matches the content — quiet, unhurried, restful. Christ leads you to rest by teaching you to rest in His Word.",
    jeevesInsight: "The 'still waters' are the perfect meditation image. Not rushing to the next verse. Not analyzing. Just resting beside quiet truth until it seeps into your being. Let the water's stillness teach you how to study.",
    memoryHook: "Sit beside still water in your mind. Let each word ripple outward slowly. Watch the reflections deepen. Don't leave until you're still."
  },
  {
    id: "speed-reflex",
    name: "Speed Room",
    code: "SRm",
    floor: 7,
    icon: <Gauge className="h-5 w-5" />,
    color: "bg-red-400/20 text-red-500",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... for ever.",
    principleExplanation: "The Speed Room principle: Train rapid application — flipping through chapters, making connections in seconds. Sprint-study builds reflexes. When ministry moments demand instant answers, the Speed Room prepares you to recall connections quickly.",
    applicationToText: "Speed drill: In 30 seconds, connect Psalm 23 to five other passages. GO: Psalm 23 → John 10 (Good Shepherd) → Ezekiel 34 (I myself will shepherd) → Isaiah 40:11 (carries lambs) → Hebrews 13:20 (great Shepherd) → 1 Peter 5:4 (chief Shepherd). Done.",
    christConnection: "Speed training serves ministry. When someone asks 'Where does the Bible talk about God as Shepherd?' you need instant recall, not hours of study. The Speed Room builds that reflex.",
    jeevesInsight: "Can you connect Psalm 23 to five other passages in 30 seconds? That's the Speed Room standard. Meditation is slow; Speed is fast. Both are needed — depth for devotion, speed for ministry.",
    memoryHook: "A stopwatch running as you race through shepherd passages — building theological reflexes for real-time ministry."
  },

  // FLOOR 8 - MASTER
  {
    id: "master-reflexive",
    name: "Reflexive Mastery",
    code: "∞",
    floor: 8,
    icon: <Infinity className="h-5 w-5" />,
    color: "bg-gradient-to-r from-primary/20 to-accent/20 text-primary",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd; I shall not want...",
    principleExplanation: "The 8th Floor principle: No rooms needed. You've internalized the Palace so completely that Phototheology is reflexive thought, not method. You don't 'use' the rooms — you think in them automatically. The scaffolding disappears because the building is complete.",
    applicationToText: "When you read Psalm 23 and automatically see Christ, trace cycles, feel the fire, connect to Revelation, locate it in the feasts, and test the fruit — without consciously naming rooms — you've reached Floor 8. The Palace is inside you.",
    christConnection: "The goal is not 'knowing Phototheology' but knowing Christ. The Palace is scaffolding; Christ is the building. When the scaffolding is internalized, only Christ remains visible.",
    jeevesInsight: "Floor 8 has no rooms because YOU are the room. Just as driving becomes unconscious after years of practice, Phototheology becomes reflexive after sufficient training. You don't think 'now I'll use the Concentration Room' — you just see Christ.",
    memoryHook: "The Palace dissolves into you — rooms become instincts, codes become reflexes, method becomes nature. You are the Palace now."
  }
];

// Shuffle and pick 7 random principles
const shuffleAndPick = (array: PalacePrinciple[], count: number): PalacePrinciple[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const InteractiveWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const selectedPrinciples = useMemo(() => {
    return shuffleAndPick(ALL_PRINCIPLES, 7);
  }, [refreshKey]);

  const step = selectedPrinciples[currentStep];

  const nextStep = () => {
    if (currentStep < selectedPrinciples.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentStep(0);
  };

  return (
    <section id="interactive-demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Interactive Demo — 38 Palace Rooms
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How the Palace Method Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Walk through Psalm 23 as Jeeves explains each principle first, then demonstrates its application.
          </p>
          
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Apply 7 New Principles
          </Button>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {selectedPrinciples.map((p, idx) => (
            <button
              key={`${p.id}-${refreshKey}`}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? "w-8 bg-primary" 
                  : idx < currentStep 
                    ? "w-2 bg-primary/50" 
                    : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${refreshKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${step.color} w-fit`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{step.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {step.code} • Floor {step.floor}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Principle {currentStep + 1} of 7</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6 space-y-5">
                {/* The Principle Explained First */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/20 text-primary mt-0.5 flex-shrink-0">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-2">📖 The Principle</p>
                      <p className="text-foreground text-sm sm:text-base">{step.principleExplanation}</p>
                    </div>
                  </div>
                </div>

                {/* Scripture Reference */}
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">{step.verse}</p>
                  <p className="text-base sm:text-lg italic">&ldquo;{step.verseText}&rdquo;</p>
                </div>

                {/* Application to Text */}
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-accent/10 text-accent mt-0.5 flex-shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-accent mb-1">🔍 Applied to Psalm 23</p>
                    <p className="text-muted-foreground text-sm sm:text-base">{step.applicationToText}</p>
                  </div>
                </div>

                {/* Christ Connection */}
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-yellow-500/10 text-yellow-600 mt-0.5 flex-shrink-0">
                    <Crown className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-yellow-600 mb-1">✝️ Christ Connection</p>
                    <p className="text-muted-foreground text-sm sm:text-base">{step.christConnection}</p>
                  </div>
                </div>

                {/* Jeeves Insight */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">🎩 Jeeves Says...</p>
                      <p className="text-foreground text-sm sm:text-base italic">{step.jeevesInsight}</p>
                    </div>
                  </div>
                </div>

                {/* Memory Hook */}
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-primary mb-1">🧠 Memory Hook</p>
                    <p className="text-muted-foreground italic text-sm sm:text-base">{step.memoryHook}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {currentStep + 1} / {selectedPrinciples.length}
                  </span>

                  <Button
                    onClick={nextStep}
                    disabled={currentStep === selectedPrinciples.length - 1}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Final CTA if on last step */}
        {currentStep === selectedPrinciples.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 space-y-4"
          >
            <p className="text-lg font-medium">
              Ready to build your own palace with every book of the Bible?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRefresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try 7 More Principles
              </Button>
              <Button size="lg" className="gradient-palace">
                Start Your Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
