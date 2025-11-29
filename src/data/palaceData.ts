export interface Room {
  id: string;
  name: string;
  tag: string;
  icon?: string; // Lucide icon name
  purpose: string;
  action?: string; // What the user must do when they enter
  output?: string; // What the user produces/leaves with
  coreQuestion: string;
  method: string;
  examples: string[];
  pitfalls: string[];
  deliverable: string;
  estimatedTime?: "quick" | "standard" | "deep"; // 5min / 15min / 30+min
  quickMode?: string[]; // Optional quick steps for fast learners
  prerequisites?: { floor: number; room: string }[];
}

export interface Floor {
  number: number;
  name: string;
  subtitle: string;
  description: string;
  rooms: Room[];
}

export const palaceFloors: Floor[] = [
  {
    number: 1,
    name: "Furnishing",
    subtitle: "Memory & Visualization",
    description: "Load the canon's storyline into long-term memory as vivid scenes. Build your foundational library of stories, images, and gems.",
    rooms: [
      {
        id: "sr",
        name: "Story Room",
        tag: "SR",
        icon: "Book",
        purpose: "Transform biblical events into memorable, sequential scenes. Build your foundational library of stories you can instantly recall.",
        action: "Break down a narrative into 3-7 memorable 'beats' (major plot movements) and arrange them chronologically.",
        output: "A beat list with arrows (→) showing sequence, plus a one-line plot summary.",
        coreQuestion: "What exactly happened—and in what order?",
        estimatedTime: "standard",
        quickMode: [
          "Read the passage completely",
          "Identify 3-7 major moments",
          "Name each with a punchy noun/verb (Coat, Pit, Palace)",
          "Test: Can you teach this story using only these beats?"
        ],
        method: "📋 STEP-BY-STEP METHODOLOGY:\n\n1️⃣ Read the narrative passage completely (a chapter, a story arc, or a complete episode)\n\n2️⃣ Identify 3-7 distinct 'beats' (major plot movements)—not too many (loses focus) or too few (loses detail)\n\n3️⃣ Name each beat with a punchy NOUN or VERB (not full sentences)\n   ✅ Good: 'Coat' → 'Pit' → 'Caravan' → 'Prison' → 'Palace'\n   ❌ Bad: 'Joseph receives a colorful coat from his father' (too wordy)\n\n4️⃣ Arrange beats chronologically using arrows (→) to show sequence\n\n5️⃣ Test your beat list: Can you teach this story to a child using only these beats?\n\n6️⃣ Write a one-line plot summary that captures the movement from first beat to last\n\n🎯 KEY PRINCIPLES:\n• 🎬 Beats are like film shots—each one freezes a distinct moment\n• 🏔️ Use CONCRETE nouns (Altar, River, Mountain) over abstractions (Crisis, Decision)\n• 👑 Chronology is king—if you mix up the order, you've failed the room\n• 🎯 The goal is MEMORABLE, not comprehensive\n• ⚠️ If you need more than 7 beats, you're probably covering too much ground",
        examples: [
          "Genesis 37 (Joseph): Dream → Coat → Pit → Caravan → Egypt → Potiphar (6 beats capture the descent arc)",
          "Exodus 14 (Red Sea): Trapped → Fear → 'Stand Still' → Staff Raised → Waters Part → Crossing → Egypt Drowns (7 beats show the deliverance sequence)",
          "1 Samuel 17 (David & Goliath): Giant Mocks → Boy Arrives → 5 Stones → Sling → Head Severed (5 beats emphasize the underdog victory)",
          "Daniel 3 (Fiery Furnace): Idol Built → Bow or Burn → Three Refuse → Furnace Heated → Fourth Man → Untouched (6 beats highlight supernatural deliverance)",
          "Mark 5:1-20 (Demoniac): Tombs → Legion → Pigs → Cliff → Clothed → 'Go Tell' (6 beats show radical transformation)"
        ],
        pitfalls: [
          "Commentary before chronology—don't interpret until you've mapped the sequence",
          "Too many beats (10+)—you're making an outline, not a story beat list",
          "Using full sentences instead of punchy nouns/verbs",
          "Mixing up chronological order",
          "Including interpretation in the beat names ('Joseph's prideful dream' vs. just 'Dream')"
        ],
        deliverable: "Beat list (3-7 beats with arrows) + one-line plot summary capturing the arc from start to finish"
      },
      {
        id: "ir",
        name: "Imagination Room",
        tag: "IR",
        icon: "Eye",
        purpose: "Experience Scripture with all five senses. Step inside the story to create emotional memory that lasts.",
        action: "Immerse yourself in a biblical scene using sight, sound, touch, smell, and taste.",
        output: "A sensory paragraph describing your experience + one sentence of personal resonance.",
        coreQuestion: "What do you see, hear, feel, smell, and taste in this passage?",
        estimatedTime: "quick",
        quickMode: [
          "Choose a vivid biblical scene",
          "Close your eyes and enter the moment",
          "Engage all 5 senses (sight, sound, touch, smell, taste)",
          "Write one paragraph capturing the experience"
        ],
        method: "🎨 IMMERSIVE EXPERIENCE METHOD:\n\n👁️ STEP INTO THE SCENE - Use your imagination to fully enter the biblical moment\n\n👂 ENGAGE ALL FIVE SENSES:\n• 👀 What do you SEE?\n• 👂 What do you HEAR?\n• 🤲 What do you TOUCH?\n• 👃 What do you SMELL?\n• 👅 What do you TASTE?\n\n💭 Let the passage become a LIVED EXPERIENCE, not just information\n\n✍️ Capture in one sentence how this sensory encounter resonates with your own story",
        examples: [
          "Red Sea crossing: Wind whipping your face, the roar of water held back by invisible hands, salt spray on your lips, towering walls on both sides, the smell of fear and faith mingled in the crowd",
          "Gethsemane: Sense the crushing weight on your chest as you pray, the cool night air, the taste of copper fear in your mouth, the rough bark of the olive tree against your back, the distant sound of soldiers' footsteps"
        ],
        pitfalls: ["Speculation beyond text", "Melodrama", "Adding details Scripture doesn't give", "Making it about your creativity instead of the text's reality"],
        deliverable: "Short paragraph describing your sensory experience + one sentence of personal resonance"
      },
      {
        id: "24fps",
        name: "24FPS Room",
        tag: "24",
        icon: "Film",
        purpose: "Create a visual GPS for the Bible—one memorable image per chapter for instant retrieval. Not theological depth, but instant recall.",
        action: "For each chapter, identify the MOST MEMORABLE element and convert it into a single, quirky visual image.",
        output: "A chapter-to-image index (e.g., 'Gen 1 = Birthday Cake Earth, Gen 3 = Snake+Apple+Clock').",
        coreQuestion: "What image will make this chapter unforgettably findable?",
        estimatedTime: "quick",
        quickMode: [
          "Read the chapter",
          "Identify the single most memorable element",
          "Convert to a concrete visual (prefer quirky over dignified)",
          "Test: Does it trigger instant recall?"
        ],
        method: "🎬 STEP-BY-STEP METHODOLOGY:\n\n1️⃣ Read the chapter you want to index\n\n2️⃣ Identify the MOST MEMORABLE element (event, object, phrase, turning point)\n\n3️⃣ Convert that element into a SINGLE VISUAL IMAGE—preferably something concrete and striking\n\n4️⃣ Test the image: Does it instantly trigger the chapter content?\n\n5️⃣ Make it QUIRKY if needed—weird images stick better than dignified ones\n\n6️⃣ Record: Chapter Number → Image Description\n\n7️⃣ Repeat for every chapter in the book you're studying\n\n🔑 KEY PRINCIPLES:\n• 🎯 Prioritize MEMORABLE over accurate\n• 🔪 Use concrete objects over abstract concepts (Knife > Faith)\n• 🤪 Quirky beats theological (Snake+Apple+Clock for Gen 3 is better than 'Disobedience')\n• 🖼️ The image should be VISUAL—you should be able to draw it (even badly)\n• 1️⃣ One image per chapter—don't try to capture everything\n• ⚡ The image is a TRIGGER, not a summary\n\n💡 PRO TIP: Go through an entire book in one sitting to build momentum. Your 24FPS index becomes more valuable the more chapters you complete.",
        examples: [
          "📸 VIEW COMPLETE GENESIS 1-24 VISUAL GALLERY: A full set of 24 illustrated frames is available in the Visual Gallery section below, showing one memorable image for each of the first 24 chapters of Genesis",
          "Genesis 1 = Birthday Cake with 'Earth' written on it (Creation is Earth's birthday)",
          "Genesis 3 = Snake coiled around an apple with a ticking clock (Fall, time begins running out)",
          "Genesis 22 = Knife suspended over an altar (Abraham's test with Isaac)",
          "Exodus 14 = Towering walls of water with a dry path between them (Red Sea parting)",
          "Psalm 23 = Shepherd's staff casting a long shadow on a path (The LORD is my shepherd)",
          "Daniel 3 = Three men standing in orange flames (Fiery furnace)",
          "John 3 = Wind swirling around a question mark (Nicodemus at night, born again mystery)",
          "Revelation 1 = Seven golden lampstands with eyes in them (Christ among the churches)"
        ],
        pitfalls: [
          "Using descriptive titles instead of IMAGES ('The Creation Story' vs. Birthday Cake Earth)",
          "Making images too complex—keep it to ONE striking element",
          "Trying to be theologically comprehensive—this is about memory, not meaning",
          "Using the same image for multiple chapters",
          "Abstract images that you can't visualize (avoid 'grace,' 'redemption'—use objects)"
        ],
        deliverable: "Chapter → Image table (e.g., 'Gen 1 = Birthday Cake Earth, Gen 2 = Garden with Rivers, Gen 3 = Snake+Apple+Clock')"
      },
      {
        id: "br",
        name: "Bible Rendered",
        tag: "BR",
        icon: "Layers",
        purpose: "See the entire Bible at a glance—compress all 1,189 chapters into ~51 symbolic glyphs (one per 24-chapter block).",
        action: "Read a 24-chapter block, identify its central movement, and assign ONE simple symbolic glyph.",
        output: "A 51-frame legend mapping each 24-chapter block to its glyph with brief explanation.",
        coreQuestion: "What single symbol captures this 24-chapter block's essence?",
        estimatedTime: "deep",
        quickMode: [
          "Divide Bible into 24-chapter blocks",
          "Read/review entire block for central theme",
          "Choose simple glyph: /, ×, ↑, →, or word",
          "Build your 51-frame legend"
        ],
        method: "🗺️ STEP-BY-STEP METHODOLOGY:\n\n1️⃣ Divide the Bible into 24-chapter blocks (approximately 51 blocks total)\n\n2️⃣ Read/review the entire 24-chapter block to identify its CENTRAL MOVEMENT or THEME\n\n3️⃣ Choose a SIMPLE SYMBOLIC GLYPH that captures that essence:\n   • Use symbols: /, ×, +, ↑, →, ○, △, 👑 crown, 💧 tear, ⚔️ sword, etc.\n   • Use single words: SEED, EXILE, KING, LAMB\n   • Use letter-combos: @Mo, 1H, 3H\n\n4️⃣ Assign ONE glyph per block—resist the urge to add more\n\n5️⃣ Write a 1-2 sentence explanation of WHY this glyph fits\n\n6️⃣ Build your complete 51-frame legend\n\n7️⃣ Memorize the sequence so you can mentally 'fly over' the Bible\n\n🎯 KEY PRINCIPLES:\n• ⚡ Simplicity is power—complex glyphs defeat the purpose\n• 📦 The glyph is a COMPRESSION tool, not a comprehensive summary\n• 🎨 Different people may choose different glyphs—what matters is that YOURS works for YOU\n• 🔒 Once you've chosen a glyph, stick with it—consistency builds memory\n• ✅ Test yourself: Can you recite all 51 glyphs in order?",
        examples: [
          "Genesis 1-24 = '/' (divisions emerge: light/dark, land/sea, male/female, nation/nation)",
          "Genesis 25-50 = 'SEED' (Patriarchs—promise carried through Abraham's line)",
          "Exodus 1-24 = '↑' (Ascent from slavery to Sinai covenant)",
          "Acts 1-24 = '↑→' (Gospel UP to Father via ascension, then OUT to nations via mission)",
          "Revelation 1-22 = '○+' (Completed circle—Eden restored and escalated, full consummation)"
        ],
        pitfalls: [
          "Over-explaining the glyph—keep it to 1-2 sentences",
          "Using more than 1 glyph per block—defeats the compression purpose",
          "Choosing glyphs that are too obscure to remember",
          "Changing your glyph system midstream—commit to your symbols",
          "Trying to capture EVERYTHING in the glyph—it's a trigger, not an encyclopedia"
        ],
        deliverable: "51-frame legend (Block range → Glyph → Brief explanation). Example: 'Gen 1-24 = / → Divisions emerge throughout creation and early history'"
      },
      {
        id: "tr",
        name: "Translation Room",
        tag: "TR",
        icon: "Image",
        purpose: "Convert words into pictures. Turn abstract concepts into concrete visual representations that stick in memory 6x better.",
        action: "Translate verses into icons, passages into 3-panel comics, or books into murals using concrete imagery.",
        output: "Sketches or detailed descriptions of visual translations, labeled with verse references.",
        coreQuestion: "Translate this text into a visual storyline.",
        estimatedTime: "standard",
        quickMode: [
          "Identify the central visual element in the text",
          "Choose level: Verse→Icon, Passage→Comic, or Book→Mural",
          "Sketch or describe using concrete objects",
          "Test: Does it capture the essence memorably?"
        ],
        method: "🎨 STEP-BY-STEP METHODOLOGY (Three Levels):\n\n📖 LEVEL 1: VERSE → ICON (Single verse becomes one memorable image)\n1️⃣ Read the verse slowly, looking for the central visual element\n2️⃣ Identify the MAIN OBJECT or ACTION the verse describes\n3️⃣ Sketch (or describe) that element as a simple icon\n4️⃣ Add ONE detail that captures the verse's uniqueness\n5️⃣ Test: Does the icon trigger the verse in your memory?\n\n📚 LEVEL 2: PERICOPE → 3-PANEL COMIC (Passage becomes sequential visual story)\n1️⃣ Break the passage into 3 movements (beginning, middle, end)\n2️⃣ Choose the KEY IMAGE for each movement\n3️⃣ Arrange the 3 images in comic-strip panels\n4️⃣ Use arrows or simple text to show progression\n5️⃣ The comic should tell the story without words if possible\n\n🖼️ LEVEL 3: BOOK → MURAL (Entire book becomes one panoramic visual)\n1️⃣ Identify the book's CENTRAL THEME or MOVEMENT\n2️⃣ Choose a single visual metaphor that spans the whole book\n3️⃣ Sketch the metaphor as a mural with clear progression left-to-right\n4️⃣ Include key moments/chapters as visual 'stations' along the mural\n5️⃣ The mural should capture the book's arc at a glance\n\n🎯 KEY PRINCIPLES:\n• 🏔️ Concrete beats abstract (Lamp > Truth, Vine > Relationship)\n• ✂️ Simplicity beats complexity (Don't try to illustrate every detail)\n• 📖 Respect biblical metaphors—translate WHAT'S THERE, don't invent new imagery\n• 🎨 Bad art is fine—memorability matters more than beauty",
        examples: [
          "Psalm 119:105 (Verse→Icon): A glowing scroll unrolled on a dark path, casting golden light 5 feet ahead—showing 'lamp to my feet, light to my path'",
          "John 15:1-8 (Verse→Icon): A vine trunk with branch-sockets; some branches green with grape clusters, others broken and lying on ground, one being thrown into fire—showing abiding vs. not abiding",
          "Prodigal Son Luke 15 (Pericope→3-Panel Comic): Panel 1 = Son walking away with money bag, Panel 2 = Son in pig pen eating pods, Panel 3 = Father running with robe flowing toward son",
          "Exodus (Book→Mural): Left side shows brick slavery under whip, center shows Red Sea parting with people crossing, right side shows tabernacle glowing with glory cloud—showing Liberation → Covenant → Presence",
          "Revelation (Book→Mural): A scroll unrolling left-to-right showing 7 seals breaking → 7 trumpets sounding → 7 bowls pouring → New Jerusalem descending"
        ],
        pitfalls: [
          "Keeping text abstract instead of pushing toward concrete visuals",
          "Mixing metaphors mid-scene (don't combine John's vine with Paul's body imagery)",
          "Over-complicating the image—simpler is stronger",
          "Ignoring the biblical metaphor and inventing your own",
          "Creating images that are theologically accurate but visually unmemorable"
        ],
        deliverable: "Sketches (even crude stick figures) OR detailed written descriptions of your visual translations. Label each with verse/passage reference."
      },
      {
        id: "gr",
        name: "Gems Room",
        tag: "GR",
        icon: "Gem",
        purpose: "Mine Scripture for rare truths by combining 2-4 unrelated texts until they illuminate each other with stunning clarity.",
        action: "Place 2-4 verses from different contexts side by side and identify the profound truth that emerges.",
        output: "Gem card with combined texts, the rare truth discovered, and practical use-case.",
        coreQuestion: "What beautiful truth emerges when I combine these seemingly unrelated texts?",
        estimatedTime: "standard",
        quickMode: [
          "Select 2-4 verses from different books",
          "Place them side by side",
          "Ask: What insight emerges from their combination?",
          "Crystallize into one powerful truth"
        ],
        method: "💎 GEM-MINING METHOD:\n\n1️⃣ Take 2-4 verses from different books/contexts\n\n2️⃣ Place them side by side\n\n3️⃣ Identify the rare truth that emerges from their combination\n\n4️⃣ Ask: \"What beautiful insight appears when these texts illuminate each other?\"\n\n✨ The result should be a crystallized truth that:\n• 📖 Is anchored in multiple clear texts\n• 💡 Reveals something profound most readers miss\n• 🎯 Has practical application for preaching/teaching",
        examples: [
          "Ex 12 (Passover at twilight) + Jn 19:14 (crucifixion at 6th hour) → Jesus died at exact moment Passover lambs were slain",
          "Gen 3:15 (seed of woman) + Gal 4:4 (born of woman) + Rev 12:5 (male child) → Virgin birth thread across redemptive history"
        ],
        pitfalls: ["Forced connections", "Trivia instead of theology", "Gem without clear text anchors"],
        deliverable: "Gem card: Combined texts + rare truth + use-case"
      }
    ]
  },
  {
    number: 2,
    name: "Investigation",
    subtitle: "Detective Work",
    description: "Become a detective of the Word. Gather raw data, define terms, decode symbols, and interrogate the text with precision.",
    rooms: [
      {
        id: "or",
        name: "Observation Room",
        tag: "OR",
        icon: "Search",
        purpose: "Become a biblical detective. Gather raw data before interpretation—see what's actually on the page. Start with WHAT IS HAPPENING: count people, objects, actions, and details.",
        action: "Make 20-50 bullet-point observations: first list factual details (numbers, who/what/where/when), then grammar, repetition, contrasts, verbs, and structure.",
        output: "Observation sheet with 20-50 numbered bullet points: factual details first, then deeper observations.",
        coreQuestion: "As a detective, observe as much as you can about the text. Start with WHAT IS HAPPENING (numbers, people, actions, objects), then notice patterns and details. Aim for at least 8 observations.",
        estimatedTime: "standard",
        quickMode: [
          "Read passage 2-3 times without writing",
          "First: List WHAT IS HAPPENING (how many people, what objects, what actions, where, when)",
          "Then: List observations using categories: grammar, repetition, contrasts, setting, verbs",
          "Write ONLY what you see—no interpretation yet",
          "Aim for 20+ observations minimum"
        ],
        method: "🔍 STEP-BY-STEP METHODOLOGY:\n\n1️⃣ Read the passage 2-3 times WITHOUT writing anything—just look\n\n2️⃣ BEGIN WITH 'WHAT IS HAPPENING' (Factual Details):\n   • 🔢 NUMBERS: How many people? Objects? Days? Times mentioned?\n   • 👥 WHO: List every person/group mentioned\n   • 📦 WHAT: List every object, item, or thing mentioned\n   • 📍 WHERE: Location details\n   • ⏰ WHEN: Time references\n   • ⚡ ACTIONS: What does each person DO? (list each verb)\n   • 📊 SEQUENCE: In what order do things happen?\n\n3️⃣ THEN add deeper observation categories:\n   • 📝 GRAMMAR: verb tenses, pronouns, conjunctions ('but,' 'therefore')\n   • 🔁 REPETITION: words, phrases, or patterns that appear multiple times\n   • ⚖️ CONTRASTS: opposites, conflicts, before/after comparisons\n   • 🏗️ STRUCTURE: chiasms, parallel lines, turning points\n   • ❓ OMISSIONS: what's surprisingly NOT mentioned\n   • ⭐ EMPHASIS: words in unusual positions, lengthy descriptions\n\n4️⃣ Write ONLY what you see—no 'what it means' allowed yet\n\n5️⃣ Number your observations (helps you hit 20+ quota)\n\n6️⃣ When you think you're done, read once more and find 5 more observations\n\n🎯 KEY PRINCIPLES:\n• 🔢 Start with counting and listing—'10 virgins, 5 foolish, 5 wise' IS an observation\n• 🚫 If you interpret before observing, you'll miss crucial data\n• ✅ Obvious observations count—don't skip them because they seem trivial\n• 📊 Quantity reveals quality—the 23rd observation often unlocks the passage\n• ❓ Ask: 'What's on the page?' not 'What does it mean?'\n• 💪 Observation is a skill—you get better with practice",
        examples: [
          "Matthew 25:1-4 observations: WHAT IS HAPPENING: 1) 10 virgins total, 2) 5 foolish + 5 wise = 50/50 split, 3) All 10 have lamps, 4) 1 bridegroom, 5) Foolish: lamps only, 0 extra oil, 6) Wise: lamps + oil in jars (2 things). DEEPER: 7) Difference is preparation not appearance, 8) 'Went out' = active movement, 9) Setting: nighttime (need lamps), 10) Event: wedding procession",
          "Luke 15:20 observations: WHAT IS HAPPENING: 1) 1 father, 1 son = 2 people, 2) 5 actions by father: saw, filled, ran, threw arms, kissed, 3) 0 actions by son (passive). DEEPER: 4) Father 'ran' = unusual for patriarch, 5) Physical embrace BEFORE words spoken, 6) Sequence: seeing → emotion → running → embracing → kissing"
        ],
        pitfalls: [
          "Skipping factual details—always start with 'what is happening': numbers, people, objects, actions",
          "Slipping into interpretation ('this means God is gracious') instead of observation ('father ran before son confessed')",
          "Stopping too early—fewer than 20 observations means you're not done",
          "Only observing 'theological' details—notice everything (grammar, setting, numbers, etc.)",
          "Skipping 'obvious' observations—they're often the foundation for insight"
        ],
        deliverable: "Observation sheet with 20-50 numbered bullet points: start with WHAT IS HAPPENING (numbers, people, actions), then add deeper observations",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "dc",
        name: "Def-Com Room",
        tag: "DC",
        icon: "BookOpen",
        purpose: "Define key terms in original language and consult trusted commentaries. Stand on giants' shoulders while keeping feet in the text.",
        action: "Define 3-5 key terms using lexicons, note 1-2 cultural details, then excerpt 2-3 trusted commentaries.",
        output: "Wordlist with definitions + cultural notes + commentary excerpts with sources + synthesis paragraph.",
        coreQuestion: "What definitions do you find relevant to the text? [Access Greek/Hebrew & Commentary tools]",
        estimatedTime: "standard",
        quickMode: [
          "Identify 3-5 crucial words with theological weight",
          "Look up in Strong's/lexicon for original meaning",
          "Note 1-2 cultural details from Bible dictionary",
          "Excerpt 2-3 commentaries and synthesize"
        ],
        method: "📚 STEP-BY-STEP METHODOLOGY:\n\n📖 PART 1: DEFINITIONS (3-5 key terms)\n1️⃣ Identify 3-5 crucial words in your passage that carry theological or cultural weight\n2️⃣ Look up each word in:\n   • Strong's Concordance (with Greek/Hebrew numbers)\n   • Lexicon (Thayer's, BDAG, BDB)\n   • Bible dictionary for cultural background\n3️⃣ Record: Original word + transliteration + Strong's number + definition + usage note\n4️⃣ Note any significant translation differences (e.g., 'love' in English covers both agapē and phileō)\n\n🌍 PART 2: CULTURAL NOTES (1-2 details)\n1️⃣ Research the historical/cultural setting of your passage\n2️⃣ Identify 1-2 details that would be obvious to original hearers but obscure to modern readers\n3️⃣ Note the source of your cultural information\n\n💭 PART 3: COMMENTARY (2-3 excerpts)\n1️⃣ Consult 2-3 trusted commentaries (Matthew Henry, Calvin, Spurgeon, Keil & Delitzsch, modern scholars)\n2️⃣ Choose excerpts that illuminate the text—not just repeat it\n3️⃣ LABEL each excerpt with author and source\n4️⃣ Write a brief synthesis: Where do commentators agree? Where do they differ? What insights strike you?\n\n🎯 KEY PRINCIPLES:\n• 🔤 Original language > English translation when meanings diverge\n• 📖 Commentaries inform but don't replace Scripture as final authority\n• 🌍 Cultural background illuminates but doesn't determine meaning\n• 🤝 Compare multiple commentaries—single sources can be biased\n• ✂️ Brevity in excerpts—long quotes mean you're not synthesizing",
        examples: [
          "John 21:15-17 DEFINITIONS: 1) ἀγαπάω (agapaō, G25) = divine, selfless, sacrificial love; 2) φιλέω (phileō, G5368) = affectionate friendship love, brotherly love. PATTERN: Jesus asks Peter 'Do you agapē me?' twice, Peter responds 'I phileō you' both times; third time Jesus switches to 'Do you phileō me?' matching Peter's weaker term. COMMENTARY: Spurgeon notes this may show Jesus meeting Peter where he is; Carson argues both terms overlapped in Koine Greek and the triple question mirrors Peter's triple denial.",
          "Revelation 3:18 DEFINITION: κολλούριον (kollourion, G2854) = eye-salve, medicinal ointment. CULTURAL NOTE: Laodicea was famous throughout the Roman world for manufacturing Phrygian powder eye medicine—a major export. Christ's offer of 'eye-salve' is surgical irony: the city proud of healing others' eyes is spiritually blind. COMMENTARY: Matthew Henry: 'Christ offers them spiritual eye-salve that they might see their own wretchedness and his grace.' William Barclay: 'Laodicea's lukewarm water came from hot springs 6 miles away, arriving neither hot (healing) nor cold (refreshing)'—explains Rev 3:15-16."
        ],
        pitfalls: [
          "Letting commentary overrule clear Scripture",
          "Ignoring original language because 'I don't know Greek/Hebrew'—Strong's and lexicons are accessible",
          "Reading modern English meaning into ancient words",
          "Using only one commentary (creates echo chamber)",
          "Copying long commentary quotes without synthesis—show you've digested it"
        ],
        deliverable: "Wordlist (3-5 terms with definitions) + Cultural notes (1-2 details) + Commentary excerpts (2-3 quotes with sources) + Brief synthesis paragraph",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "st",
        name: "Symbols/Types Room",
        tag: "ST",
        icon: "Shapes",
        purpose: "Build God's symbol dictionary. Track consistent imagery (Lamb, Rock, Light) through Scripture and see how it points to Christ.",
        action: "Trace a symbol's SCOPE (5-10 texts), define its SIGN (meaning), and show Christ-LOCUS (fulfillment).",
        output: "Reusable symbol cards showing: Symbol → Scope → Sign → Christ-locus.",
        coreQuestion: "What is this symbol's consistent biblical meaning and how does it find fulfillment in Christ?",
        estimatedTime: "standard",
        quickMode: [
          "Choose a symbol (Lamb, Rock, Water, etc.)",
          "Track 5-10 key texts where it appears",
          "Define what it consistently represents",
          "Show how Christ fulfills it"
        ],
        method: "🔍 STEP-BY-STEP METHODOLOGY (Building a Symbol Card):\n\n1️⃣ IDENTIFY the symbol (Lamb, Rock, Light, Water, Bread, etc.)\n\n2️⃣ SCOPE: Track the symbol through Scripture—where does it appear?\n   • 📚 List 5-10 key texts where the symbol shows up\n   • 🔄 Note if usage is consistent or if there are variations\n\n3️⃣ SIGN: What does the symbol consistently represent?\n   • 🎯 Sacrifice? Provision? Judgment? Presence?\n   • ✍️ Write a 1-sentence definition\n\n4️⃣ CHRIST-LOCUS: How does Jesus fulfill this symbol?\n   • ✝️ Find NT passages where Christ is explicitly connected to the symbol\n   • 📝 Write 1-2 sentences on fulfillment\n\n5️⃣ Build your card:\n   Symbol → Scope (texts) → Sign (meaning) → Christ-locus (fulfillment)\n\n6️⃣ Store the card for reuse—you'll reference it in future study\n\n🔑 COMMON BIBLICAL SYMBOLS TO MAP:\n• 🐑 LAMB: Sacrifice, substitution, innocence\n• 🗿 ROCK: Stability, refuge, foundation, judgment\n• 💡 LIGHT: Truth, revelation, presence, holiness\n• 💧 WATER: Life, cleansing, Spirit, Word\n• 🍞 BREAD: Provision, sustenance, Word\n• ⛪ TEMPLE: God's dwelling, holiness, access\n• 🍇 VINE: Life source, fruitfulness, covenant relationship\n• 🚪 DOOR: Access, salvation, exclusive entry\n• 🐑 SHEPHERD: Care, guidance, protection, ownership\n\n🎯 KEY PRINCIPLES:\n• 📖 Let Scripture define symbols—not your imagination\n• 🔄 Symbols are CONSISTENT across the canon (God is the Author)\n• 📚 Multiple texts create biblical vocabulary—single texts create speculation\n• ✝️ Christ is the ultimate reality behind every type and symbol\n• 🏗️ Build your library over time—each card is permanent infrastructure",
        examples: [
          "LAMB Symbol Card:\n→ SCOPE: Gen 22:8 (God will provide), Ex 12:3-13 (Passover), Isa 53:7 (led to slaughter), John 1:29 (Behold the Lamb), 1 Cor 5:7 (Christ our Passover), 1 Pet 1:19 (without blemish), Rev 5:6-12 (Lamb on throne)\n→ SIGN: Substitutionary sacrifice—innocent dies in place of guilty\n→ CHRIST-LOCUS: Jesus is the Lamb of God who takes away sin (John 1:29); slain from foundation of world (Rev 13:8); Passover fulfilled at crucifixion (1 Cor 5:7)",
          "ROCK Symbol Card:\n→ SCOPE: Ex 17:6 (water from rock), Deut 32:4 (Rock of salvation), Ps 18:2 (my Rock), Isa 28:16 (cornerstone), Matt 16:18 (build on this rock), 1 Cor 10:4 (Rock was Christ), 1 Pet 2:6-8 (living stone)\n→ SIGN: Immovable foundation, refuge in storm, source of life-giving water\n→ CHRIST-LOCUS: Christ is the Rock struck for us (1 Cor 10:4); foundation stone (Isa 28:16, 1 Pet 2:6); living water flows from Him (John 7:38)",
          "TEMPLE Symbol Card:\n→ SCOPE: Ex 25-40 (tabernacle), 1 Kings 6-8 (Solomon's temple), Ezek 40-48 (vision), John 2:19-21 (destroy this temple), 1 Cor 3:16 (you are temple), Eph 2:21 (growing into holy temple), Rev 21:22 (no temple—Lamb is temple)\n→ SIGN: God's dwelling place among humanity, holiness, mediated access\n→ CHRIST-LOCUS: Jesus' body is the temple (John 2:21); we are living stones in Him (1 Pet 2:5); in new creation, Christ Himself is the temple (Rev 21:22)"
        ],
        pitfalls: [
          "Free-associating symbols without biblical warrant ('dove = peace' may work in culture, but what does Scripture say?)",
          "Ignoring canonical usage—assuming one-time symbols are universal",
          "Missing Christ connections—types exist to point to Him",
          "Allegorizing everything—not every detail is symbolic (sometimes a door is just a door)",
          "Creating symbols that contradict Scripture's own interpretation"
        ],
        deliverable: "Symbol cards (reusable)—each card shows: Symbol → Scope (5-10 texts) → Sign (1-sentence meaning) → Christ-locus (fulfillment note)",
        prerequisites: [{ floor: 1, room: "sr" }, { floor: 1, room: "tr" }]
      },
      {
        id: "qr",
        name: "Questions Room",
        tag: "QR",
        icon: "HelpCircle",
        purpose: "Generate 50-100 precision questions about any text. Quality of understanding equals quality of questions. Train yourself to interrogate the text relentlessly using three question types: INTRA (inside the passage), INTER (across Scripture), and PALACE (Phototheology framework).",
        action: "Generate 50-100 questions in 3 categories: INTRA-textual (within passage), INTER-textual (across Scripture), and PALACE questions (cycles/rooms/sanctuary).",
        output: "Three lists totaling 50-100 questions that expose hidden meaning and create a study roadmap.",
        coreQuestion: "What must be asked inside the text (INTRA), across texts (INTER), and through the Palace framework (PALACE)?",
        estimatedTime: "standard",
        quickMode: [
          "Ask INTRA questions: Why this word? Why here? Why now? (inside the passage)",
          "Ask INTER questions: What other texts connect? How do they compare? (across Scripture)",
          "Ask PALACE questions: Which cycle? Which room? What sanctuary element? (PT framework)",
          "Target: 50-100 total questions across all three categories"
        ],
        method: "STEP-BY-STEP METHODOLOGY (Three Question Types—Aim for 50-100 total):\n\n🎯 THE GOAL: Generate 50-100 questions about any text you study. This forces deep engagement and reveals hidden treasure.\n\nLEVEL 1: INTRA-TEXTUAL QUESTIONS (Within the passage—Target: 15-35 questions)\nThese questions interrogate INSIDE the passage itself:\n1. Read the passage carefully 2-3 times\n2. Ask about STRUCTURE: Why is this arranged this way? Why does this come before that?\n3. Ask about WORD CHOICE: Why this verb instead of another? Why repeat this word?\n4. Ask about GRAMMAR: What does 'therefore' point back to? Why past tense here, present tense there?\n5. Ask about OMISSIONS: What's surprisingly NOT mentioned? What's implied but unstated?\n6. Ask about CHARACTERS: Why does this person act this way? What motivates them?\n7. Ask about SETTING: Why this location? Why this time of day/year?\n\nLEVEL 2: INTER-TEXTUAL QUESTIONS (Across Scripture—Target: 15-35 questions)\nThese questions connect your text to OTHER parts of the Bible:\n1. Ask about QUOTATIONS: Where is the OT text being quoted from? How is it used in original context?\n2. Ask about PARALLELS: What other passages describe this same event? How do they differ?\n3. Ask about ALLUSIONS: What earlier biblical story is being echoed here?\n4. Ask about TYPOLOGY: What OT type is being fulfilled? How does it escalate?\n5. Ask about THEMES: Where else does this theme appear in Scripture? How does it develop?\n6. Ask about CONTRAST: What opposite example exists elsewhere in the Bible?\n\nLEVEL 3: PALACE QUESTIONS (Phototheology lens—Target: 15-35 questions)\nThese questions apply the Palace framework to unlock deeper meaning:\n1. Ask about CYCLES: Which of the 8 cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re) does this fit?\n2. Ask about SANCTUARY: Does this text map to any sanctuary article or service?\n3. Ask about CHRIST: Where is Jesus here explicitly or typologically?\n4. Ask about DIMENSIONS: How does this read literally, Christologically, personally, ecclesially, eschatologically?\n5. Ask about TIME ZONES: Is this Earth-Past, Earth-Now, Earth-Future, Heaven-Past, Heaven-Now, or Heaven-Future?\n6. Ask about GENRES: What hermeneutic does this genre demand?\n7. Ask about ROOMS: Which Palace room would best unlock this text?\n8. Ask about HEAVENS: Which heaven (1H, 2H, 3H) does this belong to?\n\n🔑 KEY PRINCIPLES:\n• Quantity drives quality—push yourself to 50-100 questions per text\n• Write questions in your own words—this forces engagement\n• Good questions expose what you DON'T know, not what you do\n• Some questions won't have immediate answers—that's the point\n• Questions should be SPECIFIC, not vague ('Why did Jesus weep?' > 'What is this about?')\n• The 50-100 target sounds extreme but it transforms your understanding",
        examples: [
          "John 11:35 ('Jesus wept') INTRA questions: 1) Why does John use shortest verb form? 2) Why record this emotion at all? 3) Why weep if He knows resurrection coming? 4) Does the Greek tense indicate ongoing or punctiliar weeping? 5) What physical gesture accompanies weeping? 6) Why here in the narrative sequence?",
          "John 11:35 INTER questions: 1) How does Jesus' weeping compare to His weeping over Jerusalem (Luke 19)? 2) What other prophets wept over people? 3) How does this fit with 'Man of sorrows' (Isa 53)? 4) Does Hebrews 5:7 ('prayers and tears') connect? 5) What does Genesis teach about weeping? 6) Where else does Jesus show emotion?",
          "John 11:35 PALACE questions: 1) Does this fit @CyC cycle's 'Fall' element (sharing human suffering)? 2) Which Dimension Room line: Christ's humanity (Literal/Christ dimension)? 3) Is this Earth-Now moment revealing Heaven-Now compassion? 4) How does Concentration Room read this (Christ's Office=High Priest who sympathizes)? 5) Which sanctuary article connects to intercession/compassion? 6) How does the Fire Room engage this verse?"
        ],
        pitfalls: [
          "Stopping at surface-level questions ('What does this mean?')—go deeper",
          "Asking leading questions that assume the answer ('Doesn't this prove...')",
          "Generating fewer than 50 questions—you haven't pushed hard enough",
          "Writing questions that are really just statements in disguise",
          "Ignoring questions that challenge your theological assumptions",
          "Treating questions as assignments instead of genuine inquiry",
          "Only asking INTRA questions—make sure to include INTER and PALACE questions too"
        ],
        deliverable: "Question map with three columns: INTRA (inside passage) | INTER (across Scripture) | PALACE (PT framework). Target 50-100 total questions. Beginners: start with 15-20 total and work up.",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "qa",
        name: "Q&A Chains Room",
        tag: "QA",
        icon: "Link",
        purpose: "Let Scripture interpret Scripture. Answer Questions Room inquiries by finding 2-4 biblical cross-references, then synthesizing.",
        action: "Select 5-10 questions from QR, find 2-4 Scripture references per question, then synthesize the collective teaching.",
        output: "Answer chains: Question → 2-4 References (with quotes) → Synthesis (1-3 sentences).",
        coreQuestion: "Where does the Bible itself supply the answer?",
        estimatedTime: "deep",
        quickMode: [
          "Import strongest questions from Questions Room",
          "For each question, find 2-4 clear biblical references",
          "Quote or summarize each reference",
          "Synthesize: What do these texts collectively teach?"
        ],
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IMPORT your questions from Questions Room (QR)\n2. SELECT 5-10 of your strongest/most important questions to answer (you won't answer all 75)\n3. For EACH selected question:\n   a) SEARCH Scripture for 2-4 cross-references that directly speak to the question\n      • Use concordances, cross-reference Bibles, memory, or study tools\n      • Prioritize texts that are CLEAR and ON-POINT\n   b) LIST the references with brief quotes or summaries\n   c) SYNTHESIZE: Write 1-3 sentences showing what these texts collectively teach\n4. FORMAT each answer chain:\n   Question → Ref 1 (quote/summary) → Ref 2 (quote/summary) → Ref 3 (quote/summary) → Synthesis\n5. VERIFY: Does my synthesis flow logically from the cited texts? Or am I adding my opinion?\n\nKEY PRINCIPLES:\n• Scripture interprets Scripture—this is a Reformation principle\n• Quality of references matters: Clear texts > obscure texts; Didactic texts > narrative inferences\n• Synthesis must be GROUNDED in the cited texts—no importing outside ideas\n• If you can't find 2-4 strong texts, either refine the question or admit 'Scripture is less explicit here'\n• Use NT to clarify OT, but don't flatten OT into NT\n• Context matters—don't rip verses from their surrounding argument",
        examples: [
          "QUESTION: Why did the father run to the prodigal son? (Luke 15:20)\nREF 1: Psalm 103:13 → 'As a father has compassion on his children, so the LORD has compassion on those who fear him.'\nREF 2: Isaiah 49:15 → 'Can a mother forget her nursing child? Yet even if she forgets, I will not forget you.'\nREF 3: Ezekiel 33:11 → 'I take no pleasure in the death of the wicked, but rather that they turn from their ways and live.'\nREF 4: Luke 15:20b → 'Filled with compassion, he ran...'\nSYNTHESIS: The father ran because divine compassion cannot passively wait—it actively pursues the repentant. God's covenant love moves toward the sinner before full repentance is articulated, demonstrating that restoration is His eager desire, not His reluctant concession.",
          "QUESTION: Why does John call Jesus 'the Word' (Logos)? (John 1:1)\nREF 1: Psalm 33:6 → 'By the word of the LORD the heavens were made.'\nREF 2: Genesis 1:3, 6, 9... → 'And God said...' (creation by divine speech)\nREF 3: Proverbs 8:22-31 → Wisdom personified as present at creation\nREF 4: Hebrews 1:2 → 'In these last days he has spoken to us by his Son... through whom he made the universe.'\nSYNTHESIS: Calling Jesus 'the Word' identifies Him as the eternal agent of God's creative and revelatory speech. He is not merely God's messenger but God's self-expression—the visible, audible, tangible manifestation of the invisible God. What God speaks, Christ IS.",
          "QUESTION: What does 'the kingdoms of this world have become the kingdoms of our Lord' mean? (Rev 11:15)\nREF 1: Daniel 2:44 → 'The God of heaven will set up a kingdom that will never be destroyed... it will crush all those kingdoms.'\nREF 2: Daniel 7:13-14 → 'One like a son of man... was given authority, glory and sovereign power; all nations worshiped him.'\nREF 3: Philippians 2:9-11 → 'God exalted him... every knee should bow... every tongue acknowledge that Jesus Christ is Lord.'\nREF 4: 1 Corinthians 15:24-25 → 'Then the end will come, when he hands over the kingdom to God the Father after destroying all dominion, authority and power.'\nSYNTHESIS: Revelation 11:15 announces the moment when Christ's already-secured victory becomes universally manifest. The kingdoms did not evolve into God's kingdom—they were conquered and transferred. This is Daniel's stone crushing the statue, the Son of Man receiving His kingdom, and every knee forced to acknowledge what the redeemed already confess: Jesus is Lord."
        ],
        pitfalls: [
          "PROOF-TEXTING: Citing verses out of context to force them to say what you want",
          "WEAK SYNTHESIS: Just restating the verses without showing how they answer the question",
          "SOLO REFERENCE: Using only 1 text instead of 2-4 (multiple witnesses principle)",
          "EISEGESIS IN SYNTHESIS: Sneaking in your opinion instead of letting the texts speak",
          "IGNORING CONTEXT: Pulling a verse that seems relevant but means something different in its passage",
          "SKIPPING HARD QUESTIONS: Only answering easy questions—tackle the difficult ones too"
        ],
        deliverable: "Answer chains document: For each selected question, provide: Question → Ref 1 (+ brief quote/note) → Ref 2 → Ref 3 → Ref 4 (if needed) → Synthesis (1-3 sentences). Aim for 5-10 fully developed answer chains per study session.",
        prerequisites: [{ floor: 1, room: "sr" }, { floor: 2, room: "qr" }]
      }
    ]
  },
  {
    number: 3,
    name: "Freestyle",
    subtitle: "Time & Daily Integration",
    description: "Master the art of drawing object lessons from everything around you—nature, seasons, the animal kingdom, science, driving, walking, washing dishes, cooking, and all everyday activities. Train your mind to spontaneously connect the physical world with spiritual truth, turning ordinary moments into gospel insights and Scripture connections.",
    rooms: [
      {
        id: "nf",
        name: "Nature Freestyle",
        tag: "NF",
        icon: "Leaf",
        purpose: "See God's invisible attributes in visible creation. Transform trees, storms, animals into living sermons—just like Jesus did.",
        action: "Observe a natural object closely, identify 1-2 key characteristics, find the biblical parallel, link to specific verse.",
        output: "Natural Object → Verse → One-sentence lesson. Record for reusable teaching.",
        coreQuestion: "What does this natural object or phenomenon teach about God's Word?",
        estimatedTime: "quick",
        quickMode: [
          "Choose natural object (tree, river, bird, storm)",
          "Note 1-2 distinctive characteristics",
          "Ask: What biblical truth parallels this?",
          "Link to specific verse and distill one lesson"
        ],
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. OBSERVE a natural object or phenomenon closely\n   • Trees, mountains, rivers, animals, weather, seasons, plants, rocks, stars, etc.\n   • Notice specific details: roots, growth patterns, behaviors, cycles\n2. IDENTIFY 1-2 notable characteristics or functions\n   • What does this thing DO? How does it work? What makes it unique?\n3. ASK: What biblical truth parallels this natural characteristic?\n   • Does Scripture use this object metaphorically?\n   • Does this function mirror a spiritual principle?\n4. LINK to a specific verse or passage\n   • Find the text that explicitly or implicitly connects\n   • Verify the connection is biblically sound, not forced\n5. DISTILL to one punchy lesson (1 sentence)\n   • Make it memorable and transferable\n6. RECORD: Natural Object → Verse → Lesson\n7. APPLY: When will you USE this insight? (Teaching, personal encouragement, evangelism)\n\nKEY PRINCIPLES:\n• Jesus constantly used nature to teach (birds, lilies, seeds, sheep, vines)\n• Don't INVENT meanings—find what SCRIPTURE says about that object\n• The best NF lessons are simple enough for a child to grasp\n• Nature lessons should illuminate Scripture, not replace it\n• Build a library of NF lessons—they're reusable teaching tools\n• Physical observation trains spiritual observation",
        examples: [
          "Oak tree's deep root system → Psalm 1:3 / Jeremiah 17:8 → Lesson: 'Visible strength (trunk/branches) depends on invisible depth (roots); biblical stability requires hidden communion with God'",
          "Eagle teaching eaglets to fly by removing nest comfort → Deuteronomy 32:11 / Exodus 19:4 → Lesson: 'God's disruptions are often His way of teaching us to fly—He stirs the nest to force us into faith'",
          "Caterpillar→chrysalis→butterfly transformation → 2 Corinthians 5:17 / Romans 12:2 → Lesson: 'True transformation requires a death (chrysalis darkness) before the new creation emerges—metamorphosis mirrors regeneration'",
          "River always flowing to lowest point → Philippians 2:5-8 / James 4:6 → Lesson: 'Water seeks the low place, and so did Christ; humility is the natural law of grace—it flows downward'",
          "Seed must be buried to sprout → John 12:24 / 1 Corinthians 15:36 → Lesson: 'What looks like death (seed in dark soil) is actually the prerequisite for life; dying to self precedes fruitfulness'",
          "Stars invisible in daylight but present → Psalm 139:12 / Isaiah 45:3 → Lesson: 'God's promises don't disappear in the darkness—they become visible; trials reveal truths that prosperity obscures'"
        ],
        pitfalls: [
          "FORCED ANALOGIES: Creating connections Scripture doesn't support (be wary of inventing nature lessons)",
          "IGNORING CONTEXT: Using a verse about X to illustrate Y just because it sounds good",
          "OVERLY COMPLEX: If your NF lesson needs a 10-minute explanation, it's not working",
          "REPLACING SCRIPTURE: Nature illuminates the Bible but never replaces it—nature is general revelation, not saving truth",
          "NEGLECTING APPLICATION: Don't just observe and link—USE the lesson for ministry/growth"
        ],
        deliverable: "Daily or weekly NF log: Natural Object → Verse → One-Line Lesson → Potential Use-Case. Build a growing library of nature-based teaching illustrations."
      },
      {
        id: "pf",
        name: "Personal Freestyle",
        tag: "PF",
        icon: "User",
        purpose: "Turn your biography into theology. See God's authorship in your story by placing your experiences alongside biblical narratives.",
        action: "Identify a significant life event, find a biblical parallel, and extract the spiritual lesson.",
        output: "Event (brief) → Parallel Biblical Text → Lesson Learned → Potential testimony use.",
        coreQuestion: "Where is God writing biblical lessons in the events of my life?",
        estimatedTime: "standard",
        quickMode: [
          "Select significant life event (crisis, provision, etc.)",
          "Find biblical character/story with similar experience",
          "Connect: What did God do in THAT story?",
          "Extract lesson for your story"
        ],
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IDENTIFY a significant life event (recent or past)\n   • Crisis, loss, provision, betrayal, success, failure, transition, waiting, breakthrough\n2. DESCRIBE the event briefly (2-3 sentences max)\n   • Stick to facts—what happened, when, who was involved\n3. SEARCH for a biblical parallel\n   • Ask: 'Who in Scripture experienced something similar?'\n   • Look for structural parallels, not just topical similarity\n   • Examples: Betrayal → Joseph/David; Barrenness → Hannah/Sarah; Exile → Daniel; Persecution → Early church\n4. CONNECT the pattern\n   • How does the biblical narrative illuminate your experience?\n   • What did God do in THAT story? What might He be doing in YOURS?\n5. EXTRACT the lesson (1-2 sentences)\n   • What is God teaching you through this parallel?\n   • What response is He calling for?\n6. RECORD: Event → Parallel Text → Lesson\n7. STORE for testimony—your PF entries become your testimony bank\n\nKEY PRINCIPLES:\n• Your story is not the main story—Scripture is; your life illustrates what God has already revealed\n• PF is NOT navel-gazing—it's seeing your life as part of the larger redemptive narrative\n• Avoid MORALISM: Don't turn every event into 'I should have been better'; look for GRACE patterns\n• Balance suffering and joy—PF works for breakthroughs, not just breakdowns\n• Humility is key: Your experience confirms Scripture; it doesn't add to Scripture\n• PF entries often become your most powerful teaching material",
        examples: [
          "EVENT: Lost job unexpectedly; spent 6 months unemployed and praying. → PARALLEL: Joseph in prison (Gen 39-40)—unjustly sidelined, waiting on God's timing. → LESSON: What felt like derailment was actually divine positioning; God's delays are not denials, and faithfulness in the 'prison' prepares you for the 'palace.'",
          "EVENT: Betrayed by close friend who spread false accusations. → PARALLEL: David betrayed by Ahithophel (2 Sam 15-17); Jesus betrayed by Judas (Matt 26). → LESSON: Betrayal by intimates is part of the pattern of suffering that leads to enthronement; Christ's experience redeems ours and teaches us to forgive without excusing.",
          "EVENT: Child born after years of infertility treatments and prayer. → PARALLEL: Hannah's barrenness→Samuel (1 Sam 1-2); Sarah's barrenness→Isaac (Gen 18, 21). → LESSON: God-given children after long waiting become living testimonies to prayer and promise; they're born not just into families but into mission.",
          "EVENT: Experienced unexpected financial provision at moment of crisis. → PARALLEL: Elijah fed by ravens (1 Kings 17); Widow's oil multiplied (2 Kings 4); Five loaves feeding 5,000 (Matt 14). → LESSON: God's provision often comes through unlikely means at the last possible moment—training us to trust His timing, not our reserves."
        ],
        pitfalls: [
          "SELF-CENTEREDNESS: Making YOUR story bigger than THE story (Scripture)",
          "MORALIZING OTHERS: Using PF to judge or teach others 'you should have done X like I did'—PF is personal testimony, not universal law",
          "FORCING PARALLELS: Not every event has a clear biblical parallel—sometimes God's work is mysterious",
          "BITTERNESS DISGUISED AS THEOLOGY: Using PF to justify ongoing anger or victimhood",
          "PROSPERITY GOSPEL: Assuming every positive outcome means you did something right",
          "NEGLECTING GRACE: Seeing only your faithfulness and missing God's grace in your story"
        ],
        deliverable: "Personal Freestyle journal entries: Event (2-3 sentences) → Parallel Biblical Text → Lesson Learned (1-2 sentences) → Potential Testimony Use. Build a library of God's faithfulness documented in your own story."
      },
      {
        id: "bf",
        name: "Bible Freestyle",
        tag: "BF",
        icon: "Network",
        purpose: "Build a mental concordance. Train instant recall of a verse's 'genetic relatives'—verses sharing theological DNA.",
        action: "Select a verse, identify core concept, find 3-5 'relatives' (Brothers=near identical, Cousins=shared theme different angle).",
        output: "Original Verse → 3-5 Relatives (labeled Brother/Cousin) with connection notes.",
        coreQuestion: "What verses are this verse's theological 'relatives' (brothers/cousins)?",
        estimatedTime: "quick",
        quickMode: [
          "Choose a verse",
          "Identify its core theological concept",
          "Find 3-5 relatives using concordance or memory",
          "Classify: Brother (nearly identical) or Cousin (shared theme)"
        ],
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. SELECT a verse (any verse—start with familiar ones, then expand)\n2. IDENTIFY the verse's CORE CONCEPT\n   • What is the main idea? Faith? Love? Judgment? Provision? Suffering?\n   • Ignore peripheral details—focus on the theological heart\n3. SEARCH your mental/physical concordance for 3-5 'relatives'\n   • BROTHERS: Verses that say nearly the same thing (parallel passages, quotations, restatements)\n   • COUSINS: Verses that share the theme but approach from different angles\n   • Use these search methods:\n     a) Word search (concordance for key terms)\n     b) Theme search (other passages teaching this doctrine)\n     c) Parallel passages (Gospel parallels, OT quotes in NT)\n     d) Memory recall (train your brain to make connections)\n4. CLASSIFY each relative: Brother or Cousin?\n5. VERIFY the link—does the relative actually share theological DNA, or are you forcing it?\n6. RECORD: Original Verse → Relative 1 (Brother/Cousin) → Relative 2 → Relative 3 → Relative 4 → Relative 5\n7. PRACTICE SPEED: Time yourself—can you name 3 relatives in 30 seconds?\n\nKEY PRINCIPLES:\n• Shared WORDS alone don't make relatives—there must be shared MEANING\n• Relatives confirm and clarify—they give you a stereo view of truth\n• Brothers are closer than cousins—prioritize near-parallel texts first\n• NT often quotes or fulfills OT—those are always close relatives\n• The more BF reps you do, the faster your mind builds these links automatically\n• BF is cumulative—each verse you map makes the next easier",
        examples: [
          "John 3:16 (God's love in giving Son) RELATIVES:\n→ Romans 5:8 (BROTHER: 'God demonstrates his love in that while we were still sinners, Christ died for us')\n→ 1 John 4:9-10 (BROTHER: 'This is love: not that we loved God, but that he loved us and sent his Son as an atoning sacrifice')\n→ Ephesians 2:4-5 (COUSIN: 'But because of his great love for us, God... made us alive with Christ')\n→ Titus 3:4-5 (COUSIN: 'When the kindness and love of God appeared, he saved us, not by works...')\n→ Romans 8:32 (COUSIN: 'He who did not spare his own Son... how will he not also graciously give us all things?')",
          "Philippians 4:13 ('I can do all things through Christ who strengthens me') RELATIVES:\n→ 2 Corinthians 12:9-10 (BROTHER: 'My grace is sufficient... my power is made perfect in weakness')\n→ Ephesians 3:20 (COUSIN: 'Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us')\n→ Isaiah 40:29-31 (COUSIN: 'He gives strength to the weary... those who hope in the LORD will renew their strength')\n→ Psalm 18:32-34 (COUSIN: 'It is God who arms me with strength... He makes my feet like the feet of a deer')",
          "Jeremiah 29:11 ('Plans to prosper you, not to harm you, plans to give you hope and a future') RELATIVES:\n→ Romans 8:28 (BROTHER: 'God works all things together for good for those who love him')\n→ Genesis 50:20 (COUSIN: 'You intended to harm me, but God intended it for good')\n→ Proverbs 19:21 (COUSIN: 'Many are the plans in a person's heart, but it is the LORD's purpose that prevails')\n→ Ephesians 1:11 (COUSIN: 'In him we were chosen, having been predestined according to the plan of him who works out everything')"
        ],
        pitfalls: [
          "WORD-ONLY LINKS: Connecting verses that share a word but not a concept (e.g., 'love' appears in 'love of money' and 'God is love'—not relatives)",
          "TOO DISTANT: Calling every verse about 'God' a relative—be more specific",
          "IGNORING CONTEXT: Linking verses that seem similar but mean different things in context",
          "FORCED FITS: Trying to make 5 relatives when you can only find 2 solid ones—quality over quantity",
          "NOT TESTING SPEED: BF should become reflexive—if it takes 5 minutes to think of relatives, you need more reps"
        ],
        deliverable: "Genetic cluster map: Original Verse → 3-5 Relatives (labeled Brother or Cousin) with brief notes explaining the connection. Build a growing library of verse families. Time yourself: aim to identify 3 relatives in 30 seconds or less."
      },
      {
        id: "hf",
        name: "History/Social Freestyle",
        tag: "HF",
        icon: "Globe",
        purpose: "Mine secular history, culture, and current events for gospel illustrations. Let Scripture interpret civilization—not vice versa.",
        action: "Identify a historical event or social trend, find the biblical parallel/principle, extract spiritual lesson.",
        output: "Secular Event/Trend → Biblical Parallel → Lesson → Use-case for teaching.",
        coreQuestion: "How does this secular historical event, social trend, or current phenomenon illuminate the Bible passage I'm studying?",
        estimatedTime: "standard",
        quickMode: [
          "Choose historical event or current trend",
          "Understand it on its own terms first",
          "Find biblical pattern/warning/principle",
          "Extract timeless spiritual lesson"
        ],
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IDENTIFY a secular historical event, social movement, or current trend\n   • Examples: Fall of Roman Empire, Industrial Revolution, Cold War, social media rise, refugee crises, totalitarian regimes, economic collapses, civil rights movements\n2. OBSERVE the key dynamics: What happened? What were the causes and effects?\n   • Don't import Scripture yet—understand the secular event on its own terms first\n3. ASK: 'Where in Scripture do I see a similar pattern, warning, or principle?'\n   • Look for structural parallels, not just surface similarities\n   • Search biblical history (Israel's kings, empires in Daniel/Revelation) AND biblical principles (Proverbs, Prophets, Epistles)\n4. CONNECT the event to a specific biblical text or principle\n   • Be precise—don't just say 'it's about sin'; show WHICH biblical truth it illustrates\n5. EXTRACT the spiritual lesson (1-2 sentences)\n   • What does this secular event teach us about God, humanity, or the gospel?\n6. RECORD: Secular Event → Biblical Parallel/Principle → Lesson\n7. GUARD AGAINST: Don't let culture interpret Scripture; let Scripture interpret culture\n\nKEY PRINCIPLES:\n• Scripture is the lens, not culture—history illustrates the Bible, not vice versa\n• Avoid partisanship: HF should illuminate gospel truth, not push political agendas\n• Use SECULAR history, not biblical history (that's already Scripture)\n• Current events are fair game—but interpret them biblically, not sensationally\n• The best HF lessons show timeless patterns: what happened in Rome echoes in America because human nature is constant\n• HF makes apologetics powerful: 'You see this happening today? The Bible predicted this 2,000 years ago'",
        examples: [
          "FALL OF ROME (476 AD) → Revelation 13-18 (Babylon's fall) + Proverbs 16:18 ('Pride before destruction') → LESSON: Empires that worship power and wealth inevitably collapse under the weight of their own corruption; no human kingdom is permanent because only God's kingdom is eternal.",
          "MODERN REFUGEE CRISIS → Ruth's immigration story (Ruth 1-4) + Leviticus 19:34 ('Love the foreigner') → LESSON: God commands hospitality to displaced people not as political policy but as covenant identity; Israel was to remember they were once refugees in Egypt, and the Church must remember we're all exiles awaiting our true homeland.",
          "INDUSTRIAL REVOLUTION → Tower of Babel (Genesis 11) + Psalm 127:1 ('Unless the LORD builds the house') → LESSON: Technological advancement without theological wisdom leads to human pride and societal fragmentation; progress is not inherently good—it amplifies whatever drives it (greed or grace).",
          "COLD WAR (nuclear threat) → Matthew 24:6 ('Wars and rumors of wars') + Revelation 6 (riders of the apocalypse) → LESSON: Global anxiety over annihilation is not new; Christ warned that world peace is not the gospel's promise until His return—our hope is not in geopolitical stability but in the coming King.",
          "SOCIAL MEDIA RISE → James 3:5-6 ('The tongue is a fire') + Proverbs 18:21 ('Death and life in the power of the tongue') → LESSON: Digital platforms exponentially amplify humanity's ancient struggle with speech—what was gossip in the village square is now global slander; the speed of communication has changed, but the need for controlled speech has not."
        ],
        pitfalls: [
          "USING BIBLICAL HISTORY INSTEAD OF SECULAR: HF is about connecting secular events to Scripture, not retelling Bible stories",
          "CULTURE READING SCRIPTURE: Letting modern values twist biblical meaning to fit contemporary agendas",
          "POLITICAL AGENDA OVER GOSPEL: Using HF to push left/right politics instead of transcendent biblical truth",
          "NEWSPAPER EXEGESIS: Obsessing over current events as if they're prophetic fulfillment without biblical warrant",
          "IGNORING CONTEXT: Ripping historical events or Bible verses from their settings to force a connection",
          "VAGUE LESSONS: 'It's all about sin' is too general—be specific about WHICH sin, WHICH biblical principle"
        ],
        deliverable: "History/Social Freestyle notes: Secular Event/Trend → Biblical Parallel or Principle → Spiritual Lesson (1-2 sentences) → Potential Use-Case (sermon, discussion, apologetics). Build a library of cultural-biblical bridges."
      },
      {
        id: "lr",
        name: "Listening Room",
        tag: "LR",
        icon: "Ear",
        purpose: "Transform passive hearing into active Scripture-linking. Catch theological echoes in sermons, conversations, and catch truth-fragments.",
        action: "Listen attentively to sermon/conversation, note verse/principle quoted, verify accuracy, extract action step.",
        output: "Quote/Point → Verified Verse → Lesson → Action Step (what I'll do about it).",
        coreQuestion: "What verse or biblical principle does this quote, sermon point, or conversation echo—and what should I do about it?",
        estimatedTime: "quick",
        quickMode: [
          "Listen attentively (sermon, conversation, song)",
          "Note any Scripture reference or principle mentioned",
          "Verify the verse and context",
          "Extract one action step"
        ],
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. LISTEN actively during sermons, conversations, podcasts, music, etc.\n   • Don't multitask—pay attention to what's being said\n2. CATCH the biblical reference, principle, or echo\n   • Someone quotes a verse (even loosely): Capture it\n   • Someone states a principle: Ask 'What Scripture says that?'\n   • Song lyric echoes theology: Trace it back to its biblical root\n3. RECORD immediately (don't trust memory)\n   • Format: Quote/Paraphrase → Verse/Principle → Source (who said it, when)\n4. VERIFY the reference\n   • If they cited a verse, check if they quoted it accurately\n   • If they stated a principle, find the biblical text that supports it\n5. EXTRACT an action step\n   • How does this apply TODAY?\n   • What specific obedience is God calling for?\n6. STORE: Quote → Verse → Action → Date\n7. REVIEW weekly: What did God say to me through others this week?\n\nKEY PRINCIPLES:\n• You're listening FOR God, not just TO people\n• Even secular sources can accidentally quote biblical truth—capture it\n• Accuracy matters—misquoted verses can distort meaning; verify what you hear\n• Action without reflection is noise; reflection without action is disobedience\n• LR captures are personal—God may highlight something for YOU that others miss\n• Humility: God speaks through unlikely people; stay teachable\n• This room prevents 'hearer amnesia' (James 1:23-24—looking in the mirror and forgetting)",
        examples: [
          "QUOTE (in sermon): 'Love covers a multitude of sins' → VERSE: 1 Peter 4:8 (verified: accurate) → ACTION: Forgive neighbor for yesterday's sharp comment; let it go instead of rehearsing it → DATE: 3/15",
          "QUOTE (friend in conversation): 'God won't give you more than you can handle' → VERSE: ??? (This is a misquote! Often confused with 1 Cor 10:13 about temptation, but that's different.) → ACTION: Gently correct friend; point them to 2 Cor 1:8-9 (Paul was beyond his ability to endure, so he'd rely on God, not himself) → DATE: 4/2",
          "SONG LYRIC: 'When I am weak, then I am strong' → VERSE: 2 Corinthians 12:10 ('When I am weak, then I am strong'—Paul in context of thorn in flesh and God's sufficient grace) → ACTION: Stop despising my limitations; see them as platforms for Christ's power → DATE: 5/10",
          "PODCAST POINT (secular interview): 'Forgiveness is not forgetting—it's releasing the right to revenge' → VERSE: Romans 12:19 ('Do not take revenge, my dear friends, but leave room for God's wrath') + Hebrews 8:12 ('Their sins I will remember no more'—God's forgiveness) → ACTION: Release bitterness toward family member; stop rehearsing their offense → DATE: 6/22"
        ],
        pitfalls: [
          "PASSIVE LISTENING: Hearing without capturing—you lose the moment",
          "TRUSTING MEMORY: Thinking 'I'll remember that' and then forgetting within hours",
          "NO VERIFICATION: Assuming every quote is accurate without checking—misquotes spread easily",
          "NO ACTION: Collecting quotes like a hobby instead of obeying them",
          "ONLY LISTENING TO 'SPIRITUAL' SOURCES: God can speak through anyone, even unbelievers who accidentally state truth",
          "PRIDE: Dismissing someone's insight because they're not a scholar or because you've 'heard it before'"
        ],
        deliverable: "Listening Room capture log: Quote/Paraphrase → Verified Verse/Principle → Action Step → Source & Date. Review weekly to see how God has been speaking through others. Build a personalized devotional record."
      }
    ]
  },
  {
    number: 4,
    name: "Next Level",
    subtitle: "Christ-Centered Structure",
    description: "Expand depth through dimensional, Christ-centered study. See the diamond from five cuts, identify patterns, and test by fruit.",
    rooms: [
      {
        id: "cr",
        name: "Concentration Room",
        tag: "CR",
        purpose: "The Concentration Room trains you to see Christ through the lens of His threefold office—Prophet, Priest, and King—the framework that unlocks His entire ministry and your identity in Him. This ancient theological structure (drawn from Deuteronomy 17-18 and systematized by Calvin) organizes Christ's work into three interlocking roles: As PROPHET, He reveals God's will through teaching and prophecy; as PRIEST, He mediates between God and humanity through sacrifice and intercession; as KING, He rules with authority over creation, church, and cosmos. Every passage where Christ appears can be tagged with one (or sometimes multiple) of these offices, and recognizing WHICH office is in view radically sharpens your interpretation. The Concentration Room prevents vague 'Jesus-is-nice' Christianity and replaces it with precise, functional Christology that shows what Christ DOES, not just who He is.",
        coreQuestion: "Which of Christ's three offices (Prophet, Priest, King) is active in this passage, and how does that shape both interpretation and application?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. READ the passage and identify Christ's PRIMARY activity\n   • What is Jesus DOING in this text? Teaching? Sacrificing? Commanding?\n2. TAG the office:\n   • PROPHET = Revealing, teaching, proclaiming, foretelling, exposing sin, declaring truth\n   • PRIEST = Sacrificing, interceding, atoning, mediating, blessing, cleansing\n   • KING = Ruling, judging, conquering, commanding, enthroning, subduing enemies\n3. NAME the specific title or role\n   • Examples: Lamb of God (Priest), Teacher (Prophet), Lord of Lords (King)\n4. STATE what Christ ACCOMPLISHES in that office\n   • What does He do? What changes because of His action?\n5. IDENTIFY the BENEFIT to believers and the church\n   • How does His office-work help us?\n6. NOTE the HORIZON: Already fulfilled or awaiting final fulfillment?\n7. RECORD: Passage → Office → Title → Act → Benefit → Horizon\n\nKEY PRINCIPLES:\n• The offices are DISTINCT but not SEPARATE—they overlap and reinforce each other\n• Christ fulfills what OT prophets, priests, and kings only foreshadowed\n• Tagging the office prevents generic readings—it makes Christology FUNCTIONAL\n• Some passages emphasize ONE office; others blend all three\n• Your identity in Christ means you participate in these offices (but derivatively)",
        examples: [
          "Exodus 12 (Passover Lamb): OFFICE=Priest • TITLE=Lamb of God • ACT=Substitutes His blood to avert judgment • BENEFIT=Deliverance from death and slavery • HORIZON=Already fulfilled at cross; final Passover at His return",
          "Matthew 5-7 (Sermon on the Mount): OFFICE=Prophet • TITLE=Greater Moses/Teacher • ACT=Reveals God's will with authority ('You have heard... but I say') • BENEFIT=Shows kingdom ethics and righteousness • HORIZON=Already taught; being obeyed now; perfected in new creation",
          "Revelation 19 (Return): OFFICE=King • TITLE=King of Kings, Faithful and True • ACT=Conquers enemies, judges nations, establishes reign • BENEFIT=Vindicates saints, establishes justice • HORIZON=Awaiting final fulfillment at Second Coming"
        ],
        pitfalls: [
          "Moralism without Messiah—focusing on 'what you should do' instead of 'what Christ has done'",
          "Vague 'Jesus is here somewhere' without identifying specific office and action",
          "Ignoring the horizon—failing to note if this is already accomplished or awaiting fulfillment",
          "Mixing offices carelessly without recognizing which is primary in the passage"
        ],
        deliverable: "4-line CR note: Office → Title → Act → Benefit (with optional Horizon note)"
      },
      {
        id: "dr",
        name: "Dimensions Room",
        tag: "DR",
        purpose: "The Dimensions Room shatters the myth of 'one right interpretation' by revealing that Scripture is a multifaceted diamond—every passage refracts light through five distinct but complementary dimensions. Like a prism splitting white light into a spectrum, this room trains you to see how a single text simultaneously speaks on LITERAL (historical-grammatical), CHRISTOLOGICAL (how it reveals Christ), PERSONAL (application to individual life), ECCLESIOLOGICAL (application to the church body), and ESCHATOLOGICAL/HEAVENLY (ultimate fulfillment) levels. The genius of DR is that it prevents reductionism: liberals often collapse everything into the literal-historical; pietists jump straight to personal application; theologians fixate on Christology while ignoring lived experience. DR forces you to honor ALL five dimensions, creating a rich, layered reading that satisfies both the scholar and the saint. Think of it like 3D glasses—without multiple dimensions, the image is flat; with them, it becomes vivid and immersive.",
        coreQuestion: "How does this text speak simultaneously to literal history, Christ, my life, the church, and heaven/eternity?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. Read the passage thoroughly\n2. Work through ALL FIVE DIMENSIONS (don't skip any):\n\nDIMENSION 1: LITERAL-HISTORICAL\n• What actually happened in the original context?\n• Who wrote it, to whom, when, and why?\n• What did it mean to the original audience?\n• Historical-grammatical exegesis goes here\n\nDIMENSION 2: CHRISTOLOGICAL\n• How does this text reveal, foreshadow, or fulfill Christ?\n• Is He present explicitly, typologically, or thematically?\n• How does this text fit into the gospel storyline?\n\nDIMENSION 3: PERSONAL (Individual Application)\n• What does this mean for MY walk with God today?\n• What sin does it expose? What promise does it offer?\n• How should I change my thinking, praying, or acting?\n\nDIMENSION 4: ECCLESIOLOGICAL (Church Application)\n• What does this teach the church corporately?\n• How does this shape our worship, mission, discipline, or unity?\n• What does this reveal about the body of Christ?\n\nDIMENSION 5: ESCHATOLOGICAL/HEAVENLY (Ultimate Fulfillment)\n• How will this be perfected in the new creation?\n• What does this reveal about our eternal hope?\n• How does this point to the consummation of all things?\n\n3. WRITE 1-2 SENTENCES per dimension\n4. CHECK: Did you avoid repeating the same idea across all five? Each should offer DISTINCT insight.\n\nKEY PRINCIPLES:\n• All five dimensions are TRUE simultaneously—they don't compete\n• Dimension 1 (Literal) grounds the others—never skip it\n• Dimension 2 (Christ) is the interpretive center—all roads lead through Him\n• Dimensions 3-5 are applications flowing from 1-2\n• DR prevents hobby-horse theology—you can't just pick your favorite dimension",
        examples: [
          "Psalm 23 through Five Dimensions:\n→ LITERAL: David, as a former shepherd, praises Yahweh using shepherd imagery; reflects his life experience of God's provision and protection during exile and kingship.\n→ CHRIST: Jesus is the Good Shepherd (John 10:11) who lays down His life for the sheep; He fulfills David's trust in the divine Shepherd.\n→ PERSONAL: In my daily anxieties, I can trust God to provide (green pastures), restore (still waters), guide (paths of righteousness), and protect (valley of shadow).\n→ CHURCH: Corporately, the church is God's flock; pastors are under-shepherds; we experience God's care through the body, and our unity reflects the Shepherd's voice (John 10:16).\n→ HEAVEN: The 'table in the presence of enemies' and 'dwelling in the house of the LORD forever' point to the marriage supper of the Lamb (Rev 19:9) and eternal communion in the New Jerusalem (Rev 21-22).",
          
          "Exodus 14 (Red Sea Crossing) through Five Dimensions:\n→ LITERAL: Historical event ca. 1446 BC—Israel trapped between Pharaoh's army and the sea; God parts the waters through Moses' staff; Israel crosses on dry ground; Egyptians drown.\n→ CHRIST: Typological baptism (1 Cor 10:2)—passage through water represents death to old life and resurrection to new life, fulfilled in Christ's death and resurrection.\n→ PERSONAL: When I face impossible situations, God can make a way where there is none; faith means obeying when circumstances scream 'impossible.'\n→ CHURCH: The church is delivered from the 'Egypt' of sin and the world-system; baptism marks our corporate exodus from slavery to freedom in Christ.\n→ HEAVEN: Points to final judgment—enemies destroyed (Rev 19-20) and saints safely brought into the promised new creation where there is no more sea (Rev 21:1)."
        ],
        pitfalls: [
          "REPEATING THE SAME IDEA across all five dimensions (e.g., 'God loves me' in every line)",
          "SKIPPING THE LITERAL dimension and jumping straight to application",
          "FORCING A DIMENSION when it doesn't naturally fit—some texts emphasize certain dimensions more than others",
          "IGNORING DIMENSION 2 (Christ)—every text must connect to the gospel somehow",
          "MAKING DIMENSION 3 (personal) into moralism ('try harder') instead of grace-based response"
        ],
        deliverable: "DR sheet with 5 dimensions: LITERAL (1-2 sentences) • CHRIST (1-2 sentences) • PERSONAL (1-2 sentences) • CHURCH (1-2 sentences) • HEAVEN (1-2 sentences)"
      },
      {
        id: "c6",
        name: "Connect-6",
        tag: "C6",
        purpose: "The Connect-6 Room is the master synthesis chamber where biblical genres converge and illuminate each other. This room trains you to build bridges across the six major genres—PROPHECY, PARABLE, EPISTLE, HISTORY, GOSPEL, and POETRY—revealing how Scripture is a unified testimony that speaks in multiple voices yet tells one story. C6 operates in two powerful modes: (1) SINGLE-TEXT MODE: Take one passage and connect it with one or all six genres, showing how that truth echoes across different types of biblical literature. (2) MULTI-TEXT MODE: Gather apparently unrelated verses from all six genres and weave them into a unified study, demonstrating Scripture's symphonic harmony. This is where the Bible's diversity becomes its greatest strength—prophecy validates history, epistles explain gospels, poetry expresses what narrative shows, and parables crystallize what wisdom teaches. The Connect-6 Room transforms you from a genre-specialist into a genre-synthesizer, someone who can take a truth from any biblical book and trace its echo through the entire canon. This is the room where Phototheology becomes apologetics: you learn to build unshakable biblical chains by linking texts across genres into arguments that skeptics cannot break and believers cannot forget.",
        coreQuestion: "How does this truth appear across multiple biblical genres, OR how can I unify verses from all six genres into a single coherent study?",
        method: "STEP-BY-STEP METHODOLOGY (Two Modes):\n\n🔗 MODE 1: SINGLE-TEXT CROSS-GENRE CONNECTION\nStart with ONE verse or passage and connect it to one or ALL six genres:\n\n1️⃣ IDENTIFY your anchor text and its primary genre\n2️⃣ CONNECT to each of the six genres by finding parallel or supporting texts:\n   • PROPHECY: Where is this truth predicted, foreshadowed, or fulfilled?\n   • PARABLE: Which of Jesus' stories illustrates this principle?\n   • EPISTLE: Where do the apostles explain or apply this doctrine?\n   • HISTORY/NARRATIVE: Which biblical event demonstrates this truth in action?\n   • GOSPEL: How does Jesus' life/teaching embody this reality?\n   • POETRY/WISDOM: Which psalm, proverb, or song expresses this truth emotionally or artistically?\n3️⃣ WRITE one connection per genre (verse reference + brief explanation)\n4️⃣ SYNTHESIZE: How do all six perspectives deepen your understanding of the original text?\n\n🔗 MODE 2: MULTI-TEXT GENRE SYNTHESIS\nGather one verse from EACH of the six genres and unite them around a single doctrine or theme:\n\n1️⃣ CHOOSE your unifying theme (e.g., 'God's sovereignty,' 'faith's obedience,' 'Christ's sacrifice')\n2️⃣ SELECT one representative verse from each genre:\n   • PROPHECY: (Isaiah 53:5)\n   • PARABLE: (Luke 15:20)\n   • EPISTLE: (Romans 5:8)\n   • HISTORY: (Genesis 22:13)\n   • GOSPEL: (John 19:30)\n   • POETRY: (Psalm 103:12)\n3️⃣ EXPLAIN how each genre contributes a unique angle to the theme\n4️⃣ WEAVE them into a mini-sermon or study outline showing their convergence\n5️⃣ CLIMAX: Show how all six voices testify to Christ\n\n🎯 THE SIX GENRES:\n• 📜 PROPHECY (Pr): Predictive/forth-telling speech—Isaiah, Ezekiel, Daniel, Revelation\n• 🎭 PARABLE (Pa): Jesus' illustrative stories with one main point\n• ✉️ EPISTLE (Ep): Apostolic letters explaining doctrine and ethics—Romans, Ephesians, Hebrews\n• 📖 HISTORY (Hi): Narrative accounts of what happened—Genesis, Exodus, Acts, Gospel narratives\n• ✝️ GOSPEL (Go): Jesus' life, death, resurrection—Matthew, Mark, Luke, John\n• 🎵 POETRY (Po): Artistic/metaphorical language—Psalms, Proverbs, Job, Song of Songs\n\n🔑 KEY PRINCIPLES:\n• Scripture interprets Scripture—let one genre illuminate another\n• Different genres emphasize different aspects of the same truth\n• A doctrine supported by all six genres is unassailable\n• Genre-synthesis prevents hobby-horse theology and forced interpretations\n• This room trains both breadth (covering all genres) and depth (synthesizing them)",
        examples: [
          "MODE 1 EXAMPLE: John 3:16 ('God so loved the world') Cross-Genre Connection:\n• PROPHECY: Isaiah 53:5 ('He was pierced for our transgressions')—predicted the love-driven sacrifice\n• PARABLE: Luke 15:20 (Father running to prodigal)—illustrates God's pursuing love\n• EPISTLE: Romans 5:8 ('While we were still sinners, Christ died')—explains the doctrine\n• HISTORY: Genesis 22:8 ('God will provide the lamb')—Abraham-Isaac foreshadows the ultimate provision\n• GOSPEL: John 19:30 ('It is finished')—the love-act consummated at the cross\n• POETRY: Psalm 103:12 ('As far as east from west')—sings the result of that love\nSYNTHESIS: God's love isn't just stated (John 3:16)—it's predicted (Isaiah), illustrated (Luke 15), explained (Romans), foreshadowed (Genesis 22), accomplished (John 19), and celebrated (Psalm 103). All six genres testify to this one truth.",
          
          "MODE 2 EXAMPLE: Theme = 'Christ's Substitutionary Sacrifice' (One verse per genre):\n• PROPHECY (Pr): Isaiah 53:6 'The LORD has laid on Him the iniquity of us all'\n• PARABLE (Pa): Matthew 20:28 'The Son of Man came to give His life a ransom for many'\n• EPISTLE (Ep): 2 Corinthians 5:21 'God made Him who knew no sin to be sin for us'\n• HISTORY (Hi): Exodus 12:13 'When I see the blood, I will pass over you'—Passover lamb as substitute\n• GOSPEL (Go): John 1:29 'Behold the Lamb of God who takes away the sin of the world'\n• POETRY (Po): Psalm 22:1 'My God, My God, why have You forsaken Me?'—the Messiah's cry of forsakenness\nWEAVE: Prophecy foretold it, parable clarified the purpose, epistle explained the mechanics, history foreshadowed it, gospel executed it, poetry expressed its agony. Together they form an unbreakable chain proving substitutionary atonement.",
          
          "MODE 1 EXAMPLE: Psalm 23 ('The LORD is my shepherd') Cross-Genre Connection:\n• PROPHECY: Ezekiel 34:11-16 (God promises to be Israel's shepherd after failed human shepherds)\n• PARABLE: Luke 15:4-7 (Shepherd leaving 99 for 1 lost sheep)—Christ's personal pursuit\n• EPISTLE: 1 Peter 2:25 ('You were like sheep going astray, but now returned to the Shepherd')—application to believers\n• HISTORY: Genesis 48:15 ('God who has been my shepherd all my life')—Jacob's testimony of provision\n• GOSPEL: John 10:11 ('I am the good shepherd; the good shepherd lays down His life')—Christ's self-identification\n• POETRY: Psalm 80:1 ('Give ear, O Shepherd of Israel')—worship response to God as shepherd\nSYNTHESIS: The shepherd imagery spans the entire Bible—promised prophetically, illustrated parabolically, applied epistle-ly, testified historically, embodied in Christ, and worshiped poetically."
        ],
        pitfalls: [
          "FORCING CONNECTIONS: Not every truth appears in every genre—don't fabricate links that aren't there",
          "IGNORING GENRE RULES: Even when synthesizing, you must still respect how each genre communicates (don't allegorize parables, don't literalize apocalyptic prophecy)",
          "CHERRY-PICKING: Choosing only the genres that fit your preconception instead of letting all six speak",
          "MISSING THE SYNTHESIS: Listing six verses without showing how they converge or illuminate each other",
          "NEGLECTING CHRIST: The ultimate point of Connect-6 is showing how all genres testify to Jesus—don't make it just a trivia exercise",
          "SHALLOW CONNECTIONS: Saying 'both mention love' isn't enough—explain HOW the genres complement each other"
        ],
        deliverable: "MODE 1: Anchor text + six cross-genre connections (one per genre) + synthesis paragraph. MODE 2: Theme statement + six verses (one per genre) + woven explanation showing convergence + Christ-centered climax"
      },
      {
        id: "trm",
        name: "Theme Room",
        tag: "TRm",
        purpose: "The Theme Room provides architectural scaffolding for the entire Palace by identifying which of six major theological SPANS (structural walls/floors/ceiling) your passage occupies. Think of the Palace as a building with massive load-bearing walls and a foundation—these spans are the organizing systems that hold everything together. The SIX SPANS are: (1) Sanctuary Wall—passages about God's dwelling, sacrifice, priesthood, mediation; (2) Life of Christ Wall—passages about Jesus' birth, ministry, death, resurrection, ascension; (3) Great Controversy Wall—passages about the cosmic conflict between Christ and Satan, good and evil, truth and error; (4) Time-Prophecy Wall—passages about prophetic timelines, Daniel-Revelation sequences, eschatological events; (5) Gospel Floor—foundational passages about salvation by grace through faith; (6) Heaven Ceiling—passages about eternal realities, the new creation, the consummation. Every text doesn't fit neatly on ONE span, but most have a PRIMARY span. Identifying the span helps you organize your study and see how individual passages fit into the Palace's grand structure.",
        coreQuestion: "Which theological span does this passage primarily occupy? (Sanctuary / Life of Christ / Great Controversy / Time-Prophecy / Gospel Floor / Heaven Ceiling)",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. READ the passage and identify its MAJOR theological focus\n2. MATCH to one of the six spans:\n\nSPAN 1: SANCTUARY WALL\n• Focus: God's dwelling place, sacrificial system, priesthood, mediation, temple/tabernacle typology\n• Key texts: Exodus 25-40, Leviticus, Hebrews 8-10, Revelation 4-5\n• Ask: Does this passage deal with how humans approach God through sacred space, sacrifice, or priestly mediation?\n\nSPAN 2: LIFE OF CHRIST WALL\n• Focus: Jesus' incarnation, ministry, teachings, miracles, passion, resurrection, ascension, intercession\n• Key texts: Gospels, Acts 1, Philippians 2:5-11, Hebrews 2, 7\n• Ask: Does this passage narrate or theologize Christ's earthly/heavenly life and work?\n\nSPAN 3: GREAT CONTROVERSY WALL\n• Focus: Cosmic conflict, Satan's rebellion, spiritual warfare, deception vs. truth, persecution, vindication\n• Key texts: Genesis 3, Job, Daniel, Revelation 12, Ephesians 6, 2 Thessalonians 2\n• Ask: Does this passage expose the cosmic battle between Christ and Satan, or between God's truth and the enemy's lies?\n\nSPAN 4: TIME-PROPHECY WALL\n• Focus: Prophetic timelines, Daniel's visions, Revelation's sequences, day-year principle, historicist interpretation\n• Key texts: Daniel 2, 7, 8, 9; Revelation 11-13; Matthew 24\n• Ask: Does this passage provide prophetic chronology or apocalyptic vision with historical fulfillment?\n\nSPAN 5: GOSPEL FLOOR\n• Focus: Justification, righteousness by faith, grace alone, atonement, salvation as gift\n• Key texts: Romans 3-5, Galatians, Ephesians 2:8-9, Titus 3:5\n• Ask: Does this passage articulate the FOUNDATION of how sinners are saved by grace through faith?\n\nSPAN 6: HEAVEN CEILING\n• Focus: Eternal realities, new heavens/earth, resurrection, glorification, consummation, 'no more curse'\n• Key texts: Isaiah 65-66, 1 Corinthians 15, Revelation 21-22\n• Ask: Does this passage describe the ultimate eschatological hope and final restoration?\n\n3. SELECT the PRIMARY span (and optionally note a secondary span if the text bridges two)\n4. WRITE a 1-2 sentence rationale explaining why this span fits\n5. NOTE connections: How does this passage on THIS span relate to others on the SAME span?",
        examples: [
          "Exodus 25-40 (Tabernacle Instructions): PRIMARY=Sanctuary Wall. This passage exhaustively details the construction of God's dwelling place among Israel—articles, services, priesthood—establishing the blueprint for understanding Christ as our High Priest and ultimate sacrifice (Hebrews connection). SECONDARY=Life of Christ Wall (typological).",
          
          "Revelation 12 (Woman, Dragon, War in Heaven): PRIMARY=Great Controversy Wall. The cosmic battle between Christ (represented by the male child) and Satan (the dragon) is explicitly portrayed—Satan's expulsion from heaven, persecution of the church (woman), and ongoing warfare. This is quintessential Great Controversy theology. SECONDARY=Time-Prophecy Wall (1260 days/years).",
          
          "Romans 3:21-26 (Righteousness Apart from Law): PRIMARY=Gospel Floor. Paul articulates the core gospel: righteousness from God comes through faith in Jesus apart from works of law—foundational justification theology. This is bedrock, floor-level truth on which everything else stands.",
          
          "Daniel 7 (Four Beasts and Son of Man): PRIMARY=Time-Prophecy Wall. Sequential vision of four kingdoms (Babylon, Medo-Persia, Greece, Rome) followed by judgment scene and Son of Man receiving eternal kingdom—classic historicist prophetic timeline. SECONDARY=Great Controversy Wall (horn making war with saints).",
          
          "1 Corinthians 15 (Resurrection Chapter): PRIMARY=Heaven Ceiling. Paul defends the doctrine of bodily resurrection and describes the transformation of mortal to immortal, perishable to imperishable—ultimate eschatological hope. SECONDARY=Gospel Floor (Christ's resurrection as firstfruits of our salvation)."
        ],
        pitfalls: [
          "PUTTING EVERYTHING ON EVERY WALL: Resist the urge to tag a passage with all six spans—find the PRIMARY focus",
          "IGNORING THE GOSPEL FLOOR: Every passage should ultimately connect to the gospel, but not every passage is PRIMARILY about justification by faith",
          "CONFUSING SPANS: Mixing up Sanctuary Wall (about approach to God through mediator) with Life of Christ Wall (about Christ's earthly/heavenly work)",
          "FORCING TIME-PROPHECY: Not every prophetic text is about TIMELINES—some prophecy is thematic, not chronological",
          "NEGLECTING CONNECTIONS: Once you've placed a text on a span, compare it with OTHER texts on that same span to build integrated theology"
        ],
        deliverable: "Span tag (Sanctuary Wall / Life of Christ Wall / Great Controversy Wall / Time-Prophecy Wall / Gospel Floor / Heaven Ceiling) + 1-2 sentence rationale + optional secondary span"
      },
      {
        id: "tz",
        name: "Time Zone",
        tag: "TZ",
        purpose: "The Time Zone Room trains you to view ANY biblical text through the lens of the six time zones—Heaven-Past, Heaven-Present, Heaven-Future, Earth-Past, Earth-Present, Earth-Future. This is not about locating WHERE a text is positioned in history, but about understanding a text WITHIN THE CONTEXT of any or all of the six zones. For example, Phil 2:5 ('Let this mind be in you which was also in Christ Jesus') can be understood through Heaven-Past (Lucifer rejected the mind of Christ, leading to his fall), or through Earth-Future (those sealed at the end of time must have the mind of Christ). The power of TZ is that it allows you to see how a single verse resonates across multiple temporal-spatial dimensions. In Principles Mode, you must choose a SPECIFIC time zone and explain how the text speaks within that particular context.",
        coreQuestion: "How does this text speak when viewed through the lens of a specific time zone?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1️⃣ READ the passage you're studying\n\n2️⃣ SELECT one specific time zone to explore:\n   • Heaven-Past: Events before earth's creation (Lucifer's rebellion, war in heaven, divine counsel)\n   • Heaven-Present: Current heavenly realities (Christ's intercession, sanctuary ministry, angelic activity)\n   • Heaven-Future: Final heavenly realities (new heaven, eternal throne, no more temple)\n   • Earth-Past: Historical biblical events already fulfilled\n   • Earth-Present: Current application to believers living now\n   • Earth-Future: End-time events, Second Coming, millennial reign, new earth\n\n3️⃣ EXPLAIN how the text speaks within that chosen time zone context\n   • What does this passage reveal about that time zone?\n   • How does viewing it through this lens deepen understanding?\n\n4️⃣ OPTIONALLY explore the same text through additional time zones for richer insight\n\n🔑 KEY PRINCIPLES:\n• TZ is a LENS, not a LOCATION—you're not determining when the text was written, but HOW it speaks across time zones\n• The same text can legitimately speak to multiple time zones\n• In Principles Mode, you MUST name which specific zone you're using\n• Don't confuse this with historicist timeline placement—that's Prophecy Room (PR) territory\n• TZ reveals how biblical truths resonate across past, present, and future in both earthly and heavenly realms",
        examples: [
          "Philippians 2:5-8 ('Let this mind be in you...') viewed through multiple zones:\n→ HEAVEN-PAST: Shows Christ's pre-incarnate humility—He didn't grasp equality with God as robbery\n→ EARTH-PAST: Historical incarnation—Christ took servant form, became obedient to death\n→ EARTH-PRESENT: Current application—believers must cultivate this same humble mindset today\n→ EARTH-FUTURE: Those sealed in the final crisis will have fully developed this mind of Christ\n→ HEAVEN-PAST (contrast): Lucifer REJECTED this mindset, grasping for equality through rebellion",
          
          "Exodus 12 (Passover) through time zones:\n→ EARTH-PAST: Historical deliverance from Egypt via lamb's blood\n→ EARTH-PRESENT: Christ our Passover has been sacrificed for us (1 Cor 5:7)—we apply His blood by faith now\n→ EARTH-FUTURE: Final Passover fulfillment at Second Coming—deliverance from this world\n→ HEAVEN-PRESENT: Christ's blood pleads in heavenly sanctuary on our behalf\n→ HEAVEN-FUTURE: Lamb on the throne in New Jerusalem (Rev 22)",
          
          "Revelation 12:7-9 (War in Heaven):\n→ HEAVEN-PAST: Lucifer's original rebellion and expulsion from heaven before earth's creation\n→ EARTH-PAST: Satan's defeat at Calvary—'now is the prince of this world cast out' (John 12:31)\n→ EARTH-PRESENT: Ongoing spiritual warfare—'the accuser of our brethren' still active\n→ EARTH-FUTURE: Satan's final defeat and confinement (Rev 20)\n→ HEAVEN-FUTURE: No more Satan—perfect peace in new creation"
        ],
        pitfalls: [
          "CONFUSING TZ WITH HISTORICAL PLACEMENT: This isn't about dating when something happened, but viewing it through temporal-spatial contexts",
          "FORCING ZONES: Not every text naturally speaks to all six zones—some fit better in certain zones than others",
          "FAILING TO NAME THE ZONE: In Principles Mode, you must explicitly state WHICH zone you're using",
          "MIXING UP WITH PROPHECY ROOM: PR is about prophetic timelines; TZ is about interpretive lenses across time-space",
          "VAGUE APPLICATION: 'This applies to us today' isn't enough—explain HOW the text speaks within that specific zone"
        ],
        deliverable: "TZ note: [Specific zone chosen] + 2-3 sentences explaining how the text speaks within that zone's context. Optional: Additional zones explored with brief explanations."
      },
      {
        id: "prm",
        name: "Patterns Room",
        tag: "PRm",
        purpose: "The Patterns Room trains you to hear Scripture's recurring motifs—the theological melodies that God plays throughout the canon in different keys and tempos. Patterns are LARGER than individual types (which focus on Christ-fulfillment) and broader than parallels (which compare two specific events). A pattern is a REPEATING STRUCTURAL MOTIF that appears 3+ times across Scripture, revealing God's consistent ways of working. For example, the 'Wilderness Testing' pattern appears with Israel (40 years), Elijah (40 days), and Jesus (40 days)—each instance teaching that the wilderness is where faith is refined and proven. Or the 'Younger Over Older' pattern: Abel over Cain, Isaac over Ishmael, Jacob over Esau, Joseph over his brothers, David over his brothers, Solomon over Adonijah—revealing God's sovereign election and His delight in overturning human expectations. Recognizing patterns helps you predict interpretive trajectories: when you see a 'remnant' appear, you know God is about to preserve a faithful few amid judgment. When 'third day' language shows up, resurrection echoes are near. Patterns Room makes you a better Bible reader because you begin to anticipate God's narrative moves.",
        coreQuestion: "What recurring motif appears 3+ times across Scripture, and what does the pattern reveal about God's ways?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IDENTIFY a potential pattern in your study\n   • Notice a repeated action, theme, structure, or sequence\n   • Ask: Have I seen this before elsewhere in Scripture?\n2. SEARCH for at least 3 CLEAR INSTANCES of the pattern\n   • Use concordances, memory, and cross-references\n   • Don't settle for 2 examples—patterns need multiple witnesses\n3. NAME the pattern with a memorable label\n   • Good: 'Wilderness Testing,' 'Younger Over Older,' 'Third Day Resurrection'\n   • Bad: 'God does stuff,' 'Things happen'—be specific\n4. DESCRIBE the pattern's structure in 1-2 sentences\n   • What is the CONSISTENT element across all instances?\n5. LIST 3-5 EXAMPLES with references\n   • Show the pattern in action across different books and eras\n6. EXTRACT the theological lesson\n   • What does this pattern teach about God's character, ways, or plan?\n7. RECORD: Pattern Name → Structure → 3+ Examples → Theological Insight\n\nCOMMON BIBLICAL PATTERNS TO WATCH FOR:\n• WILDERNESS TESTING: Israel 40 years, Elijah 40 days, Jesus 40 days (faith refined in deprivation)\n• YOUNGER OVER OLDER: Abel, Isaac, Jacob, Joseph, David, Solomon (divine election overturns human primogeniture)\n• THIRD DAY RESURRECTION: Jonah 3 days, Jesus 3 days, Hosea 6:2 (resurrection pattern)\n• BARREN WOMAN BEARS: Sarah, Rebekah, Rachel, Hannah, Elizabeth (impossibility meets divine power)\n• BETRAYAL-ENTHRONEMENT: Joseph, David, Jesus (suffering path leads to exaltation)\n• REMNANT PRESERVED: Noah, Lot, Elijah's 7000, Paul's 'remnant according to grace' (God always preserves faithful few)\n• WATER-CRISIS-PROVISION: Red Sea, rock water, Jordan crossing, Jesus walking on water (faith demonstrated at water)\n• MOUNTAIN ENCOUNTERS: Sinai, Carmel, Transfiguration, Olivet, Zion (revelatory moments happen on mountains)\n\nKEY PRINCIPLES:\n• Patterns reveal God's CONSISTENT methods—He doesn't contradict Himself\n• Patterns must appear 3+ times—two instances might be coincidence\n• Patterns are not LAWS but TENDENCIES—God is free, not mechanical\n• Patterns help you interpret new passages by recognizing familiar structures\n• Patterns should be TEXTUAL, not speculative—Scripture must support them",
        examples: [
          "WILDERNESS TESTING PATTERN:\n→ Structure: God's people enter barren place → face deprivation/temptation → faith tested → outcome reveals heart\n→ Israel 40 years (Num 14, Deut 8:2): Tested with hunger, lack—failed repeatedly, murmured\n→ Elijah 40 days (1 Kings 19): Fled to wilderness, sustained by God, heard 'still small voice'\n→ Jesus 40 days (Matt 4:1-11): Tempted by Satan, remained faithful, quoted Scripture\n→ INSIGHT: Wilderness is God's classroom for testing and refining faith; Jesus succeeded where Israel failed, becoming our faithful representative.",
          
          "YOUNGER OVER OLDER PATTERN:\n→ Structure: Older son expected to inherit → God chooses younger → reversal of human expectations\n→ Abel over Cain (Gen 4): Younger's sacrifice accepted\n→ Isaac over Ishmael (Gen 21): Younger is child of promise\n→ Jacob over Esau (Gen 25, 27): Younger receives blessing\n→ Joseph over his 10 older brothers (Gen 37-50): Youngest becomes savior\n→ David over his 7 older brothers (1 Sam 16): Youngest anointed king\n→ INSIGHT: God's sovereign election overturns human primogeniture and merit—grace chooses, not nature.",
          
          "THIRD DAY RESURRECTION PATTERN:\n→ Structure: Death or crisis → three-day period → deliverance/resurrection on third day\n→ Abraham and Isaac (Gen 22:4): 'On third day' saw place of sacrifice—Isaac 'raised' from death\n→ Jonah (Jonah 1:17, Matt 12:40): Three days in fish, then 'resurrected' onto land\n→ Jesus (Matt 16:21, 1 Cor 15:4): Crucified, raised third day according to Scriptures\n→ Hosea 6:2: 'After two days... on third day he will raise us up'\n→ INSIGHT: Third day is God's resurrection signature—death is never permanent when God intervenes."
        ],
        pitfalls: [
          "INVENTING PATTERNS WITH THIN EVIDENCE: Finding 2 examples and calling it a pattern—need 3+ clear instances",
          "FORCING PATTERNS: Making superficial connections that don't share true structural DNA",
          "IGNORING EXCEPTIONS: If your 'pattern' has as many exceptions as examples, it's not a pattern",
          "CALLING TYPES PATTERNS: A type points to Christ specifically; a pattern is a broader motif (they can overlap)",
          "MAKING PATTERNS MECHANICAL: God is free to break His patterns—they reveal tendencies, not laws",
          "VAGUE LABELING: 'God works' is too broad—patterns need specific, memorable names"
        ],
        deliverable: "Pattern Card: Pattern Name → Structure (1-2 sentences) → 3+ Examples with references → Theological Insight (what this reveals about God)"
      },
      {
        id: "p||",
        name: "Parallels Room",
        tag: "P‖",
        purpose: "The Parallels Room trains you to place two biblical events side-by-side and ask: 'What echoes, and what escalates?' Unlike types (which point to Christ) or patterns (which repeat 3+ times), a PARALLEL is a specific MIRRORED ACTION between two events—usually one in the Old Testament and one in the New Testament—that share structural DNA but differ in scope or intensity. For example, David vs. Goliath parallels Jesus vs. Death: both are underdog victories over a seemingly unbeatable giant enemy, but Jesus' victory is COSMIC where David's was national. Or Moses striking the rock (Exodus 17) parallels Christ struck on the cross (1 Cor 10:4)—both bring life-giving water through a violent blow. Parallels help you see the CONTINUITY of God's methods across eras while also highlighting ESCALATION: NT events don't merely repeat OT events; they fulfill and surpass them. This room sharpens your apologetic edge—when you can show skeptics that Jesus didn't invent new patterns but FULFILLED ancient ones, you demonstrate Scripture's internal coherence.",
        coreQuestion: "What two events mirror each other structurally, and how does the second escalate or fulfill the first?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IDENTIFY two events that seem structurally similar\n   • Usually (but not always) one from OT, one from NT\n   • Look for shared ACTIONS, not just shared themes\n2. DESCRIBE both events briefly (1 sentence each)\n3. MAP the parallel structure using A ↔ B format:\n   • What ECHOES (what's the same or similar)?\n   • What ESCALATES (what's greater, wider, or more complete in the second event)?\n4. VERIFY the parallel is biblically warranted\n   • Does the NT text explicitly reference the OT event?\n   • Or is the structural mirroring so strong that it's clearly intentional?\n5. EXTRACT the theological lesson\n   • Why did God mirror this action? What does the escalation reveal?\n6. RECORD: Event A (OT) ↔ Event B (NT) → What Echoes → What Escalates → Lesson\n\nKEY PRINCIPLES:\n• Parallels are PAIRWISE (two events), not serial (3+ events like patterns)\n• Look for STRUCTURAL similarity, not just topical similarity\n• The NT event usually ESCALATES the OT event in scope, intensity, or permanence\n• Parallels can be explicit (NT quotes OT) or implicit (structural mirroring)\n• Not every OT event has a NT parallel—don't force them",
        examples: [
          "Moses striking rock (Ex 17:6) ↔ Christ struck on cross (1 Cor 10:4, John 19:34):\n→ ECHOES: Both involve a violent blow that releases life-giving water\n→ ESCALATES: Moses' rock gave physical water for Israel; Christ gives living water (Holy Spirit) for all nations\n→ LESSON: Christ is the true Rock; the blow He received provides eternal life, not just temporal relief",
          
          "David vs. Goliath (1 Sam 17) ↔ Jesus vs. Death (1 Cor 15:54-57):\n→ ECHOES: Both involve an underdog facing an unbeatable giant enemy; both achieve victory through unexpected means (stone/cross); both victories deliver God's people\n→ ESCALATES: David's victory freed Israel from one enemy; Jesus' victory frees humanity from THE ultimate enemy (death) forever\n→ LESSON: God specializes in giant-killing through unlikely means; Christ's resurrection is the ultimate Goliath defeat",
          
          "Jonah 3 days in fish (Jonah 1:17) ↔ Jesus 3 days in tomb (Matt 12:40):\n→ ECHOES: Both experience 'death' for three days; both are 'resurrected' on the third day; both come out to proclaim God's message\n→ ESCALATES: Jonah's deliverance was personal and temporary; Jesus' resurrection is cosmic and permanent—He conquers death itself\n→ LESSON: Jesus explicitly claims Jonah as a 'sign'—resurrection on the third day is God's signature move",
          
          "Israel's Red Sea baptism (Ex 14, 1 Cor 10:2) ↔ Christian water baptism (Rom 6:3-4):\n→ ECHOES: Both involve passing through water; both mark transition from old identity (slavery) to new identity (freedom); both require faith\n→ ESCALATES: Israel's baptism freed them from Pharaoh; Christian baptism buries us with Christ and raises us to new life, freeing us from sin and death\n→ LESSON: Baptism isn't just ritual—it's an exodus event where we pass from slavery to freedom through Christ"
        ],
        pitfalls: [
          "CONFUSING PARALLELS WITH TYPES: Types point specifically to CHRIST; parallels are STRUCTURAL MIRRORS (they can overlap, but they're distinct tools)",
          "FORCING PARALLELS: Not every OT event has a NT mirror—don't manufacture connections",
          "MISSING THE ESCALATION: Simply noting similarity without showing how the NT event SURPASSES the OT event",
          "VAGUE MIRRORING: Saying 'both involve water' isn't enough—show precise structural DNA",
          "IGNORING CONTEXT: Ripping events from their narratives to force a parallel",
          "CALLING EVERY SIMILARITY A PARALLEL: Coincidental similarities aren't parallels—there must be interpretive intent"
        ],
        deliverable: "Parallel note: Event A (OT ref) ↔ Event B (NT ref) → What Echoes (structural similarities) → What Escalates (how NT surpasses) → Lesson (1-2 sentences)"
      },
      {
        id: "frt",
        name: "Fruit Room",
        tag: "FRt",
        purpose: "The Fruit Room is your interpretive conscience—the final quality-control check that asks, 'What kind of life does this interpretation produce?' Jesus Himself gave us the test: 'By their fruits you will know them' (Matthew 7:16). This room recognizes that BAD THEOLOGY produces BAD FRUIT (pride, fear, despair, judgmentalism, license), while GOOD THEOLOGY produces GOOD FRUIT (humility, faith, hope, love, holiness). If your reading of a passage breeds arrogance ('I've figured it out; everyone else is wrong'), that's rotten fruit—revise your interpretation. If it produces paralyzing fear rather than reverent awe, check your exegesis. If it makes you feel superior to other Christians, you've likely twisted the text. The Fruit Room is brutally honest: it doesn't matter how clever your interpretation is or how many commentaries support it—if the fruit is toxic, something is wrong. Conversely, interpretations that produce Christlikeness, humility, evangelistic zeal, and sacrificial love are likely on track. This room protects you from cold orthodoxy (technically correct but spiritually dead) and from heresy (feels good but contradicts Scripture). It's also a group-check: have others test your interpretation's fruit, not just your logic.",
        coreQuestion: "What fruit does this interpretation produce in my heart, attitudes, and actions? Is it Christlike fruit or toxic fruit?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. STATE your interpretation of the passage clearly (1-2 sentences)\n2. ASK THE FRUIT QUESTION: What does this interpretation produce in me?\n   • Examine your internal response:\n     - Does it produce HUMILITY or PRIDE?\n     - Does it produce FAITH or FEAR (ungodly fear, not reverent fear)?\n     - Does it produce HOPE or DESPAIR?\n     - Does it produce LOVE or JUDGMENTALISM?\n     - Does it produce HOLINESS or LICENSE?\n     - Does it produce PEACE or ANXIETY?\n3. NAME the fruit you observe (good or bad)\n4. If BAD FRUIT is detected:\n   • PAUSE and reconsider your interpretation\n   • Ask: Did I emphasize one truth while ignoring a balancing truth?\n   • REVISE your reading until it produces Christlike fruit\n   • Example: If 'God's sovereignty' produces fatalism, add 'human responsibility'; if 'human free will' produces pride, add 'divine grace'\n5. If GOOD FRUIT is present:\n   • RECORD the interpretation as sound (pending other room checks)\n   • Note how this truth should shape your living\n6. TEST with others: Ask mature believers, 'What fruit would this interpretation produce in struggling Christians?'\n\nFRUIT CHECKLIST (Galatians 5:22-23 + broader NT):\nGOOD FRUIT:\n• Love (1 Cor 13:4-7): Patient, kind, not envious/boastful, not rude/self-seeking\n• Joy (Neh 8:10): Strength-giving gladness rooted in God's character\n• Peace (Phil 4:7): Guarding heart/mind, surpassing understanding\n• Patience (James 1:3-4): Endurance through trials without bitterness\n• Kindness (Eph 4:32): Tenderhearted, forgiving\n• Goodness (Rom 12:21): Overcoming evil with good\n• Faithfulness (Heb 11): Trust-driven obedience\n• Gentleness (Gal 6:1): Restoring others with humility\n• Self-control (Titus 2:11-12): Grace teaching us to say 'no' to ungodliness\n• Humility (Phil 2:3): Considering others above yourself\n• Hope (Rom 15:13): Joyful, overflow anticipation rooted in promises\n• Evangelistic zeal (Acts 1:8): Compulsion to share good news\n\nBAD FRUIT:\n• Pride/Arrogance: 'I'm right, everyone else is deceived'\n• Fear/Anxiety: Paralyzing dread, loss of peace\n• Despair: Hopelessness, 'God has abandoned me'\n• Judgmentalism: Harsh criticism, lack of mercy\n• License: 'Grace means sin doesn't matter'\n• Legalism: 'My obedience earns God's favor'\n• Division: Sectarianism, party spirit, schism\n• Passivity: 'God will do it all; I do nothing'\n\nKEY PRINCIPLES:\n• FRUIT TEST IS NOT ENOUGH ALONE—it works alongside observation, cross-references, and context\n• Bad fruit doesn't mean the truth is false; it might mean you're emphasizing one aspect while neglecting another\n• Good fruit confirms sound interpretation but doesn't prove it—heresies can feel good temporarily\n• The fruit test protects you from technically-correct-but-spiritually-dead readings\n• Community fruit matters: How does this interpretation affect others, especially the weak in faith?",
        examples: [
          "INTERPRETATION: 'God's sovereignty means every event is predetermined; nothing I do matters.'\nFRUIT CHECK: Produces FATALISM, PASSIVITY, loss of moral responsibility.\nVERDICT: Bad fruit—revision needed.\nREVISED INTERPRETATION: 'God's sovereignty ensures His purposes will prevail, AND He accomplishes them through human agency—my prayers and actions matter within His sovereign plan (Phil 2:12-13).'\nREVISED FRUIT: Produces CONFIDENCE in God's control + RESPONSIBILITY to act faithfully. Good fruit.",
          
          "INTERPRETATION: 'Once saved, always saved means I can sin freely—grace covers everything.'\nFRUIT CHECK: Produces LICENSE, presumption, ongoing sin without repentance.\nVERDICT: Bad fruit—revision needed.\nREVISED INTERPRETATION: 'Eternal security is real (John 10:28-29), BUT grace trains us to say no to ungodliness (Titus 2:11-12)—if I'm using grace as license, I should examine whether I've truly been saved.'\nREVISED FRUIT: Produces ASSURANCE + HOLINESS. Good fruit.",
          
          "INTERPRETATION: 'God hates sin so much that He's mostly angry and disappointed with me.'\nFRUIT CHECK: Produces FEAR, ANXIETY, avoidance of God, no joy in relationship.\nVERDICT: Bad fruit—revision needed.\nREVISED INTERPRETATION: 'God does hate sin, AND He loves me so much that He sent His Son to deal with sin's penalty (Rom 5:8)—His discipline is fatherly, not vindictive (Heb 12:5-11).'\nREVISED FRUIT: Produces REVERENT FEAR + CONFIDENCE + LOVE. Good fruit."
        ],
        pitfalls: [
          "DEFENDING BAD-FRUIT INTERPRETATIONS: Refusing to revise when fruit is clearly toxic ('But technically I'm right!')",
          "IGNORING THE FRUIT TEST: Caring only about exegetical correctness while producing arrogance or harshness",
          "EMOTION-ONLY VALIDATION: Assuming good feelings always mean good interpretation (heresy can feel pleasant)",
          "JUDGING OTHERS' FRUIT HARSHLY: Using Fruit Room to condemn others' interpretations without examining your own",
          "FRUIT WITHOUT EXEGESIS: Letting desired fruit dictate interpretation instead of letting text produce fruit",
          "SOLO FRUIT CHECKS: Not inviting others to assess the fruit your interpretation produces"
        ],
        deliverable: "Fruit Check: State interpretation → Name fruit produced (good/bad) → If bad, revise interpretation and recheck fruit → Final fruit verification (1-2 sentences)"
      }
    ]
  },
  {
    number: 5,
    name: "Vision",
    subtitle: "Sanctuary, Prophecy & Feasts",
    description: "Open the prophetic telescope. Use God's blueprint—sanctuary, feasts, and Daniel-Revelation—to see the master plan.",
    rooms: [
      {
        id: "bl",
        name: "Blue Room — Sanctuary",
        tag: "BL",
        purpose: "The Blue Room reveals that the Sanctuary isn't religious decoration—it's God's architectural blueprint for understanding all of Scripture. Every piece of furniture, every ritual, every spatial arrangement in the earthly sanctuary is a physical sermon about Christ's ministry in heaven. The Sanctuary System organizes biblical truth into a coherent visual structure: from Gate (entrance through Christ) to Ark (dwelling with God), each article traces the believer's journey from justification to glorification. This room trains you to see passages not just as isolated verses but as pieces fitting into God's master blueprint. When you encounter a text about sacrifice, blood, priesthood, or judgment, the Blue Room asks: Which sanctuary article does this map to? By tagging texts with their sanctuary location, you create an integrated system where doctrine, prophecy, and narrative all lock into place. The Sanctuary is God's visual theology—learn to read it, and Scripture becomes a unified whole.",
        coreQuestion: "Which sanctuary article, service, or spatial location does this passage map to, and how does it reveal Christ's heavenly ministry?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IDENTIFY THE SANCTUARY ELEMENT in your passage:\n\nFURNITURE ARTICLES:\n• GATE/DOOR: Entrance, access to God (John 10:9 - 'I am the door')\n• BRONZE ALTAR: Sacrifice, substitutionary atonement, blood (Heb 13:10-12)\n• LAVER: Cleansing, washing, sanctification (Eph 5:26 - word and water)\n• LAMPSTAND: Light, testimony, Spirit's illumination (Rev 1:20 - churches as lampstands)\n• TABLE OF SHOWBREAD: Provision, Word as bread, communion (John 6:35 - bread of life)\n• ALTAR OF INCENSE: Prayer, intercession, mediation (Rev 8:3-4 - prayers as incense)\n• VEIL: Separation between Holy and Most Holy, Christ's flesh torn (Heb 10:19-20)\n• ARK OF COVENANT: God's presence, throne, law fulfilled in mercy seat (Rom 3:25 - propitiation)\n\nSERVICES:\n• DAILY SERVICE: Continual ministry, morning/evening sacrifice, ongoing intercession (Heb 7:25)\n• DAY OF ATONEMENT: Annual cleansing, judgment, final purging (Heb 9:7-14, Rev 14:6-7). CRITICAL: Two goats—LORD'S goat (slain) = Christ's sacrifice; scapegoat (Azazel, sent away) = Satan bearing guilt AFTER atonement complete. Scapegoat is NEVER Christ.\n\nSPATIAL LOCATIONS:\n• COURTYARD: Public access, visible to all Israel, initial stages (justification zone)\n• HOLY PLACE: Priestly ministry, daily service, mediation (sanctification zone)\n• MOST HOLY PLACE: God's throne, once-yearly access, final judgment (glorification/judgment zone)\n\n2. MAP your passage to the specific article/service/location\n3. STATE Christ's fulfillment: What does Christ DO in this sanctuary role?\n4. IDENTIFY the doctrinal theme (justification, sanctification, intercession, judgment, etc.)\n5. CROSSLINK: Find 1-2 NT texts that explicitly connect this sanctuary element to Christ\n\nKEY PRINCIPLES:\n• The sanctuary is TYPOLOGICAL—every element prefigures Christ or His work\n• Movement is PROGRESSIVE: Gate → Ark = Conversion → Consummation\n• The TWO APARTMENTS matter: Holy Place = Christ's ongoing ministry; Most Holy = Judgment hour (1844 onward in Adventist theology)\n• Services reveal TIMING: Daily = continuous atonement; Atonement = final cleansing/judgment\n• BLOOD FLOW: Trace where blood goes—altar blood vs. Most Holy blood reveals different phases of atonement\n• Don't treat furniture as 'just symbols'—they're God-ordained blueprints (Heb 8:5)",
        examples: [
          "Exodus 12 (Passover Lamb): ARTICLE=Bronze Altar • Blood applied to doorposts (foreshadows altar sacrifice) • CHRIST=Lamb of God sacrificed for sin (1 Cor 5:7) • DOCTRINE=Substitutionary atonement/justification • CROSSLINK=Heb 13:10-12 (altar outside the camp)",
          "Hebrews 9:1-14 (Christ Enters Most Holy): LOCATION=Most Holy Place • Once-for-all entrance with His own blood • CHRIST=High Priest entering heavenly sanctuary • DOCTRINE=Final atonement/judgment hour • CROSSLINK=Rev 14:6-7 (judgment hour has come)",
          "John 1:29 ('Behold the Lamb'): ARTICLE=Bronze Altar • John identifies Jesus as the sacrifice • CHRIST=Lamb whose blood atones for sin • DOCTRINE=Substitution, propitiation • CROSSLINK=Lev 4 (sin offering), Isa 53:7 (led as lamb to slaughter)",
          "1 Kings 8 (Temple Dedication): LOCATION=Most Holy Place • Ark brought in, glory fills temple • CHRIST=God dwelling with His people, ultimate tabernacling (John 1:14) • DOCTRINE=Immanuel, divine presence • CROSSLINK=Rev 21:3 (God dwells with humanity forever)"
        ],
        pitfalls: [
          "Treating sanctuary furniture as 'just metaphors' instead of God-ordained blueprints",
          "Ignoring the TWO APARTMENTS distinction (Holy vs. Most Holy = different ministries)",
          "Forcing every passage into sanctuary language when it doesn't naturally fit",
          "Skipping the Old Testament sanctuary context and jumping straight to 'Jesus fulfilled it'",
          "Missing the TIMING element: Daily service vs. Day of Atonement reveals different phases"
        ],
        deliverable: "BL tag: Article/Service/Location → Christ's Fulfillment (1 sentence) → Doctrinal Theme → NT Crosslink (1-2 refs)"
      },
      {
        id: "pr",
        name: "Prophecy Room",
        tag: "PR",
        purpose: "The Prophecy Room is where you learn to read Daniel and Revelation not as cryptic puzzles but as God's cohesive timeline of redemptive history from Babylon to the New Jerusalem. This room operates on the HISTORICIST principle: prophecy unfolds sequentially through actual history, with visions REPEATING and ENLARGING the same historical span (Babylon → Rome → End Times). Daniel 2 (statue), Daniel 7 (beasts), Daniel 8 (ram/goat), and Revelation 12-13 all cover the SAME historical ground but with increasing detail and focus. The Prophecy Room prevents two fatal errors: (1) PRETERISM, which traps all prophecy in the first century, and (2) FUTURISM, which shoves everything into a brief end-time period, ignoring 2,000+ years of church history. Instead, PR trains you to trace symbols through actual history: Babylon → Medo-Persia → Greece → Rome (pagan) → Rome (papal) → End-Time Judgment → New Creation. By aligning parallel visions, you build a prophetic map that organizes Daniel-Revelation into a unified, historically verified timeline.",
        coreQuestion: "What does this prophetic symbol represent on the historicist timeline, and how does it align with parallel visions in Daniel-Revelation?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IDENTIFY THE SYMBOL in your passage:\n   • Beasts = kingdoms/political powers (Dan 7:17, 23)\n   • Horns = kings or kingdoms (Dan 7:24, Rev 17:12)\n   • Woman = people of God (pure woman) or apostate system (corrupt woman) (Rev 12 vs. Rev 17)\n   • Time periods = prophetic days = literal years (day-year principle: Num 14:34, Ezek 4:6)\n   • Dragons/serpents = Satan and his agents\n   • Heads = successive forms of government or mountains/hills (Rev 17:9-10)\n\n2. APPLY THE HISTORICIST TIMELINE:\n   BABYLON (Dan 2: gold head; Dan 7: lion) = 605-539 BC\n   MEDO-PERSIA (Dan 2: silver; Dan 7: bear; Dan 8: ram) = 539-331 BC\n   GREECE (Dan 2: bronze; Dan 7: leopard; Dan 8: goat) = 331-168 BC\n   ROME—PAGAN (Dan 2: iron legs; Dan 7: terrible beast) = 168 BC-AD 476\n   ROME—PAPAL (Dan 7: little horn; Rev 13: beast from sea) = AD 538-1798 (1260 years)\n   END-TIME JUDGMENT (Dan 7:9-10; Rev 14:6-7) = 1844 onward (investigative judgment)\n   FINAL CONFLICT (Rev 13: mark of beast; Rev 17: Babylon falls) = near future\n   NEW CREATION (Dan 2: stone; Rev 21-22: New Jerusalem) = Christ's eternal kingdom\n\n3. ALIGN WITH PARALLEL VISIONS:\n   Compare your passage with other Daniel-Revelation texts covering the same era:\n   • Dan 2 (statue) || Dan 7 (beasts) || Dan 8 (ram/goat/horn) = same kingdoms, increasing detail\n   • Dan 7:25 (little horn persecutes for 'time, times, half time' = 1260 years) || Rev 12:6, 14 (woman in wilderness 1260 days) || Rev 13:5 (beast's authority 42 months) = SAME PERIOD\n\n4. CALCULATE TIME PERIODS (if present):\n   • 1260 days/years = 3.5 times = 42 months (Rev 11:2-3, 12:6, 13:5) = AD 538-1798\n   • 2300 days/years (Dan 8:14) = 457 BC - AD 1844 (judgment begins)\n\n5. STATE the historical fulfillment and any future application\n6. AVOID: Newspaper exegesis (forcing prophecy onto current headlines); ignoring historical fulfillment; isolating symbols from their Daniel-Revelation context\n\nKEY PRINCIPLES:\n• REPEAT & ENLARGE: Later visions re-cover earlier ground with more detail\n• DAY-YEAR PRINCIPLE: Prophetic days = literal years in apocalyptic contexts\n• SYMBOLS STAY CONSISTENT: Beasts = kingdoms; horns = kings/powers; woman = covenant community or apostate system\n• HISTORICAL ANCHOR: Prophecies have verifiable historical fulfillments (not just future guesses)\n• FOCUS ON MAJOR PLAYERS: Babylon, Medo-Persia, Greece, Rome (pagan + papal), end-time coalition, Christ's kingdom",
        examples: [
          "Daniel 2 (Statue): HEAD=Babylon (gold) → CHEST=Medo-Persia (silver) → BELLY=Greece (bronze) → LEGS=Rome (iron) → FEET=Divided Europe (iron + clay) → STONE=Christ's kingdom smashes all earthly kingdoms. TIMELINE: 605 BC - Second Coming. PARALLEL: Dan 7 beasts cover same ground.",
          "Daniel 7:25 (Little Horn): Symbol=Little horn from 4th beast (Rome) • Historical ID=Papal Rome (speaks against Most High, persecutes saints, changes times/laws) • TIME: 1260 years (538-1798) • PARALLEL: Rev 13:5-7 (beast's 42-month authority, makes war on saints).",
          "Revelation 13 (Beast from Sea): Symbol=7-headed, 10-horned beast • Historical ID=Papal Rome (receives dragon's power, blasphemous names, persecutes 42 months) • PARALLEL: Dan 7 little horn • TIME: 1260 years (538-1798) • FUTURE: Deadly wound healed, end-time authority restored.",
          "Daniel 8:14 (2300 Days): Symbol=2300 evenings/mornings until sanctuary cleansed • CALCULATION: 457 BC (decree to restore Jerusalem, Ezra 7) + 2300 years = AD 1844 • EVENT: Investigative judgment begins (Dan 7:9-10, Rev 14:6-7) • PARALLEL: Day of Atonement typology."
        ],
        pitfalls: [
          "NEWSPAPER EXEGESIS: Constantly reinterpreting prophecy based on current headlines",
          "IGNORING HISTORICAL FULFILLMENT: Claiming 'it's all still future' when history already validates the timeline",
          "VIOLATING REPEAT & ENLARGE: Reading Dan 7 as completely different from Dan 2 instead of parallel",
          "LITERALIZING SYMBOLS: Making beasts into actual animals instead of kingdoms",
          "SKIPPING TIME CALCULATIONS: Ignoring the day-year principle in apocalyptic literature"
        ],
        deliverable: "PR Map: Symbol → Historical ID (with dates) → Parallel Vision(s) → Time Period (if applicable) → Future Horizon (if any)"
      },
      {
        id: "3a",
        name: "Three Angels Room",
        tag: "3A",
        purpose: "The Three Angels Room (Revelation 14:6-12) is the mission control center of the Palace—it shows how DOCTRINE fuels MISSION and how the everlasting gospel connects to end-time realities. These three angels don't just deliver random messages; they present a cohesive, urgent proclamation that ties together Creation, Judgment, Babylon's Fall, and Faithful Endurance. This room prevents gospel reductionism ('Jesus loves you' with no content) and doctrinal abstraction (truth divorced from proclamation). The 3A framework forces you to ask: How does this passage I'm studying relate to the urgent, global message God wants proclaimed before Christ returns? The First Angel anchors everything in the EVERLASTING GOSPEL (justification by faith), calls for WORSHIP OF THE CREATOR (Sabbath as sign), and announces JUDGMENT HOUR (Daniel 8:14 fulfillment). The Second Angel warns of BABYLON'S FALL (apostate religious systems). The Third Angel exposes the BEAST/IMAGE/MARK system and calls for PATIENT ENDURANCE of the saints. Every biblical passage—whether about Sabbath, sanctuary, salvation, or suffering—connects to this three-angel grid. This room makes your theology MISSIONAL.",
        coreQuestion: "How does this passage proclaim or connect to the Three Angels' Messages—the everlasting gospel in the context of creation worship, judgment, Babylon's fall, and end-time faithfulness?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. REVIEW THE THREE ANGELS' MESSAGES:\n\nFIRST ANGEL (Rev 14:6-7):\n• EVERLASTING GOSPEL: Salvation by grace through faith in Christ's blood (Rom 3:24-25)\n• FEAR GOD & GIVE GLORY: Reverence, obedience, reflecting God's character\n• JUDGMENT HOUR HAS COME: Investigative judgment began 1844 (Dan 7:9-10, 8:14)\n• WORSHIP THE CREATOR: Sabbath as memorial of creation (Ex 20:8-11, Rev 14:7 echoes Ex 20:11)\n\nSECOND ANGEL (Rev 14:8):\n• BABYLON IS FALLEN: Apostate religious systems (Roman Catholicism + fallen Protestantism + spiritualism)\n• WINE OF HER FORNICATION: False doctrines, union of church and state\n• CALL: 'Come out of her, my people' (Rev 18:4)\n\nTHIRD ANGEL (Rev 14:9-12):\n• BEAST, IMAGE, MARK WARNING: Worship enforced by political-religious coalition\n• WORSHIP THE BEAST = Eternal consequences (wrath of God, no rest)\n• PATIENT ENDURANCE OF SAINTS: Keep commandments of God (including Sabbath) + faith of Jesus\n• CONTRAST: Mark of beast vs. Seal of God (forehead = mind/conviction; hand = action/compliance)\n\n2. IDENTIFY which angel(s) your passage connects to:\n   • Does it teach the GOSPEL? → 1st Angel\n   • Does it emphasize CREATION/SABBATH/WORSHIP? → 1st Angel\n   • Does it address JUDGMENT? → 1st Angel\n   • Does it expose FALSE WORSHIP/APOSTASY? → 2nd Angel\n   • Does it call for SEPARATION from corrupt systems? → 2nd Angel\n   • Does it warn about END-TIME COERCION? → 3rd Angel\n   • Does it call for FAITHFULNESS under pressure? → 3rd Angel\n\n3. STATE the connection explicitly (1-2 sentences)\n4. AVOID: Abstracting 3A from Jesus; making it legalistic; ignoring gospel foundation; turning it into mere prophecy chart without mission urgency\n\nKEY PRINCIPLES:\n• The 3A start with GOSPEL, not law—justification grounds everything\n• Sabbath isn't arbitrary legalism—it's the SIGN of creation worship vs. beast worship\n• Judgment isn't terror—it's GOOD NEWS (vindication of God's character and His people)\n• Babylon isn't just Catholic Church—it includes ALL systems mixing truth with error\n• The 3A are PRESENT TRUTH—urgent, global, final warning before Second Coming",
        examples: [
          "Exodus 20:8-11 (Sabbath Command): Connects to 1ST ANGEL—'Worship Him who made heaven, earth, sea' echoes Sabbath's creation memorial. Sabbath = weekly reminder that God is Creator, not evolution or false gods. In end times, Sabbath becomes the visible test of loyalty: Creator-worship vs. beast-worship.",
          "Daniel 7:9-10 (Judgment Scene): Connects to 1ST ANGEL—'Hour of His judgment has come' fulfilled when Christ entered Most Holy Place (1844). Books opened, cases reviewed, vindication of saints. Judgment isn't fear-based for believers—it's when God publicly clears His people and exposes rebellion.",
          "Revelation 17 (Babylon the Harlot): Connects to 2ND ANGEL—Woman (church) drunk with blood of saints, sits on beast (political power), commits fornication (church-state union). Babylon = religious system that mixes truth with paganism, persecutes dissenters. Call: Separate from her (Rev 18:4).",
          "Revelation 13:16-17 (Mark of Beast): Connects to 3RD ANGEL—End-time enforcement of false worship through economic coercion (can't buy/sell without mark). CONTRAST: Those who refuse mark keep commandments of God and faith of Jesus (Rev 14:12). Sabbath vs. Sunday becomes visible line."
        ],
        pitfalls: [
          "ABSTRACTING 3A FROM JESUS: Making it about prophecy charts instead of gospel proclamation",
          "LEGALISM: Emphasizing Sabbath-keeping as salvation-by-works instead of sign of grace-filled obedience",
          "IGNORING GOSPEL FOUNDATION: Starting with judgment/Babylon/mark without anchoring in everlasting gospel",
          "SECTARIANISM: Using 3A to breed superiority ('We're the remnant; everyone else is Babylon') instead of humble, urgent mission",
          "PROPHECY ONLY: Treating 3A as intellectual puzzle instead of MARCHING ORDERS for proclamation"
        ],
        deliverable: "3A Connection: Angel # (1st/2nd/3rd) → How passage connects (1-2 sentences) → Mission application (How does this truth need to be proclaimed today?)"
      },
      {
        id: "fe",
        name: "Feasts Room",
        tag: "FE",
        purpose: "The Feasts Room reveals that Israel's annual festival calendar (Leviticus 23) is God's prophetic roadmap of redemption—each feast foreshadows a specific phase of Christ's work and the gospel timeline. These aren't arbitrary rituals; they're enacted prophecy. The SPRING FEASTS (Passover, Unleavened Bread, Firstfruits, Pentecost) were fulfilled in Christ's FIRST COMING: Passover = crucifixion, Unleavened Bread = burial, Firstfruits = resurrection, Pentecost = Spirit outpouring. The FALL FEASTS (Trumpets, Day of Atonement, Tabernacles) await fulfillment in Christ's SECOND COMING: Trumpets = final warning/gathering, Atonement = investigative judgment/cleansing, Tabernacles = eternal dwelling with God in new creation. This room trains you to see texts through the lens of redemptive calendar: When you read about atonement, judgment, or harvest, ask which feast is in view. The Feasts Room prevents flat Bible reading—it adds a TEMPORAL dimension that shows how God's plan unfolds across history in a deliberate, feast-structured sequence.",
        coreQuestion: "Which feast does this passage fulfill, foreshadow, or connect to, and how does it reveal Christ's redemptive timeline?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. REVIEW THE SEVEN FEASTS (Leviticus 23):\n\nSPRING FEASTS (1st Coming Fulfillments):\n• PASSOVER (Nisan 14): Lamb slain, blood applied, deliverance from death\n  → FULFILLED: Christ crucified as Passover Lamb (1 Cor 5:7) on Passover day\n• UNLEAVENED BREAD (Nisan 15-21): Leaven (sin) removed, holy living\n  → FULFILLED: Christ's sinless body in tomb, believers walk in holiness\n• FIRSTFRUITS (day after Sabbath during Unleavened Bread): First sheaf waved, harvest begins\n  → FULFILLED: Christ resurrected as firstfruits (1 Cor 15:20, 23) on Firstfruits day\n• PENTECOST/WEEKS (50 days after Firstfruits): Wheat harvest, two loaves with leaven\n  → FULFILLED: Holy Spirit poured out (Acts 2) on Pentecost; church (Jews + Gentiles = two loaves) empowered for mission\n\nFALL FEASTS (2nd Coming Fulfillments—Awaiting/In Progress):\n• TRUMPETS/ROSH HASHANAH (Tishri 1): Trumpet blast,召 gathering, awakening\n  → AWAITING: Final trumpet (1 Cor 15:52, Rev 11:15), gathering saints, last warning\n• DAY OF ATONEMENT/YOM KIPPUR (Tishri 10): High priest enters Most Holy, judgment, cleansing sanctuary, scapegoat sent away\n  → IN PROGRESS: Christ entered heavenly Most Holy (1844), investigative judgment (Dan 7:9-10, Rev 14:6-7), final sin removal\n• TABERNACLES/SUKKOT (Tishri 15-21): Dwelling in temporary shelters, harvest completed, rejoicing\n  → AWAITING: God tabernacles with humanity forever (Rev 21:3), eternal harvest home, new creation\n\n2. IDENTIFY which feast your passage connects to:\n   • Mentions lamb, blood, deliverance? → PASSOVER\n   • Emphasizes sinlessness, purity, removal of leaven? → UNLEAVENED BREAD\n   • Discusses resurrection, firstfruits, harvest beginning? → FIRSTFRUITS\n   • Holy Spirit outpouring, mission, wheat harvest? → PENTECOST\n   • Trumpet sounds, final warning, gathering? → TRUMPETS\n   • Judgment, sanctuary cleansing, Most Holy Place, scapegoat? → DAY OF ATONEMENT\n   • Eternal dwelling, new creation, final rest? → TABERNACLES\n\n3. STATE the feast connection: What is the OT feast ritual? How does Christ fulfill it?\n4. IDENTIFY whether it's already fulfilled (1st Coming) or awaiting fulfillment (2nd Coming)\n5. LINK to Christ explicitly: What did/will He accomplish?\n\nKEY PRINCIPLES:\n• Feasts are CHRISTOLOGICAL—they're not about Israel's agriculture but Christ's redemption\n• Feasts reveal TIMING—God works on His calendar, not ours\n• Spring Feasts = FINISHED WORK (crucifixion, resurrection, Spirit); Fall Feasts = FINISHING WORK (judgment, return, eternity)\n• Day of Atonement is CENTRAL to Adventist theology—it's happening NOW (investigative judgment phase)\n• Don't force every text into feast language—some passages are timeless wisdom, not feast-related",
        examples: [
          "Exodus 12 (Passover Institution): FEAST=Passover • Lamb slain at twilight, blood on doorposts, firstborn spared, eat in haste • CHRIST=Crucified as Passover Lamb (1 Cor 5:7, John 19:14) on Passover day • TIMELINE=Fulfilled at 1st Coming • APPLICATION=Deliverance from sin's death penalty through Christ's blood.",
          "Acts 2 (Pentecost Outpouring): FEAST=Pentecost/Weeks • 50 days after Firstfruits (Christ's resurrection), wheat harvest, two loaves • CHRIST=Sends Holy Spirit to empower church for mission • TIMELINE=Fulfilled at 1st Coming, 10 days after ascension • APPLICATION=Spirit-empowered witness to all nations (Jews + Gentiles = two loaves).",
          "Leviticus 16 (Day of Atonement): FEAST=Day of Atonement • High priest enters Most Holy once/year, blood applied, scapegoat sent away, sanctuary cleansed • CHRIST=Entered heavenly Most Holy (1844), investigative judgment in progress, final cleansing of universe from sin • TIMELINE=In Progress since 1844, culminates at 2nd Coming • APPLICATION=Live in light of judgment hour (Rev 14:6-7), Christ as our High Priest-Advocate.",
          "Revelation 21:3 (God Dwells with Humanity): FEAST=Tabernacles • God's permanent dwelling with redeemed humanity, no more separation • CHRIST=Tabernacles forever in new creation (John 1:14 escalated) • TIMELINE=Awaiting final fulfillment • APPLICATION=Our eternal home is WITH God, face-to-face communion restored."
        ],
        pitfalls: [
          "FORCING EVERY TEXT INTO DAY OF ATONEMENT: Not everything is about investigative judgment",
          "IGNORING PENTECOST'S MISSION ARC: Pentecost isn't just 'Spirit came'—it's about global harvest/witness",
          "FLATTENING FEASTS INTO ALLEGORY: Treating them as 'nice symbols' instead of prophetic timeline",
          "SKIPPING THE OT RITUAL: You can't understand fulfillment without knowing the original feast practice",
          "LITERALIZING FUTURE FEASTS: Fall feasts are fulfilled SPIRITUALLY/COSMICALLY, not by literal animal sacrifices in millennium"
        ],
        deliverable: "FE tag: Feast Name → OT Ritual (brief) → Christ's Fulfillment (1 sentence) → Timeline (Fulfilled/In Progress/Awaiting) → Application"
      },
      {
        id: "cec",
        name: "Christ in Every Chapter",
        tag: "CEC",
        purpose: "The Christ in Every Chapter Room enforces the non-negotiable interpretive principle: ALL Scripture is about Jesus. Think of the Bible as the ultimate 'Where's Waldo?' book—Jesus is on every page, even when He's not wearing obvious 'red stripes.' Luke 24:27 and John 5:39 make this explicit: 'beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself' and 'these are they which testify of me.' This room prevents the fatal error of treating large portions of Scripture as merely historical, moral, or theological—without explicitly connecting them to Christ. Every chapter of every book must yield a Christ-line: His title/role, His action, and confirming cross-references. This isn't allegorizing (finding Jesus in random details); it's recognizing that the entire canon is Christocentric revelation. The CEC discipline equips you with 5 reliable methods—your 'magnifying glass'—to find Christ in ANY chapter. By the time you've done CEC work through an entire book, you'll have a comprehensive Christ-map that transforms Bible study from history lessons into gospel encounters.",
        coreQuestion: "Where is Jesus in this chapter, and how do I find Him using the 5 'Finding Waldo' methods?",
        method: "🔍 THE 5 'FINDING WALDO' METHODS - Your Magnifying Glass for Discovering Christ\n\nJesus is always present in Scripture, even when not obvious. Use these 5 reliable, Scripture-based methods to find Him in ANY chapter:\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎯 METHOD 1: SPOT THE RED-STRIPED PROMISE (The Promised Redeemer)\n\nWaldo Clue: Look for promises of rescue, blessing, or a coming King\n\nWhat to look for:\n• Prophecies of a coming Deliverer, Messiah, or King\n• Promises of blessing, salvation, or restoration\n• Hints of a future Hero who will solve humanity's problem\n\nExamples:\n• Genesis 3:15 → The 'seed of the woman' crushing serpent = Christ the Savior\n• Numbers 24:17 → Star rising from Jacob = Christ the King\n• 2 Samuel 7:12-13 → David's eternal throne = Christ's kingdom\n\nAsk yourself: 'Where's the hint of a coming Hero?' → That's Jesus.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n👥 METHOD 2: FIND WALDO IN TYPES & SHADOWS (Look-Alike Characters)\n\nWaldo Clue: Search for people, objects, or events that LOOK LIKE Jesus\n\nWhat to look for:\n• PERSONS who foreshadow Christ: Joseph (betrayed→exalted), Moses (deliverer), David (shepherd-king), Melchizedek (priest-king)\n• OBJECTS that point to Christ: Passover lamb, bronze serpent, manna, rock in wilderness\n• EVENTS that preview Christ: Red Sea crossing (baptism/resurrection), Day of Atonement (substitutionary sacrifice)\n\nExamples:\n• Exodus 12: Passover lamb → Christ our Passover (1 Cor 5:7)\n• Genesis 37-50: Joseph sold→exalted → Christ betrayed→raised\n• Exodus 17: Rock struck for water → Christ the Rock (1 Cor 10:4)\n• 1 Kings 17: Widow's son raised → Christ's resurrection power\n\nAsk yourself: 'Who or what in this chapter LOOKS LIKE Jesus?' → That's a type.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🛤️ METHOD 3: FOLLOW THE GOSPEL TRAIL (Sin → Cry → Rescue)\n\nWaldo Clue: Trace the pattern of human failure and divine rescue\n\nWhat to look for:\n• People in crisis, sin, or impossible situations\n• Cries for help, prayers of desperation\n• God's intervention, deliverance, or rescue\n• The pattern: MESS → CRY → SAVIOR ARRIVES\n\nExamples:\n• Judges 10 → Israel sins, cries out, God raises deliverer → Ultimate Deliverer is Christ\n• Esther 4 → Mordecai's plea, Esther's risk → Christ interceding for His people\n• Jonah 2 → Jonah in fish, cries out, God rescues → Christ's death/resurrection (Matt 12:40)\n\nAsk yourself: 'Where's the mess only a Savior can fix?' → Waldo's hiding in the rescue.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💖 METHOD 4: ZOOM IN ON GOD'S HEART (The Father's Self-Portrait)\n\nWaldo Clue: Every revelation of God IS Jesus—'If you've seen Me, you've seen the Father' (John 14:9)\n\nWhat to look for:\n• God's character displayed: mercy, justice, love, holiness\n• God's actions: creating, judging, saving, providing\n• God's presence: burning bush, glory cloud, tabernacle\n• Remember: Jesus perfectly reveals the Father, so every glimpse of God is a glimpse of Christ\n\nExamples:\n• Jonah 3: God's mercy to Nineveh → Christ loving sinners\n• Exodus 3: God in burning bush → Christ as 'I AM' (John 8:58)\n• Exodus 12: God's wrath on Egypt's gods → Christ judging sin on the cross\n• Psalm 23: The Shepherd → Christ the Good Shepherd (John 10)\n\nAsk yourself: 'What does this passage reveal about God's heart?' → That's Jesus revealed.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📖 METHOD 5: LOOK FOR THE UNFINISHED STORY (The 'To Be Continued...' Sign)\n\nWaldo Clue: Every good thing in the Bible is temporary—it screams 'This isn't the final picture!'\n\nWhat to look for:\n• Incomplete victories (Davidic kingdom falls → Christ's eternal kingdom coming)\n• Temporary solutions (Solomon's temple destroyed → Christ's body, the true temple)\n• Partial returns (Israel from exile → Christ's greater exodus from sin)\n• Broken covenants (Mosaic covenant fails → Christ's New Covenant succeeds)\n• Imperfect heroes (all fall short → Christ the perfect Hero)\n\nExamples:\n• 2 Samuel 7: David's throne temporary → Christ's eternal throne\n• 1 Kings 8: Solomon's temple temporary → Christ's body, the true temple (John 2:19)\n• Ezra 1: Israel's return from exile → Christ's final homecoming (Rev 21)\n• Nehemiah 7: Census of returning remnant → Christ gathering His final people\n\nAsk yourself: 'What good thing here is unfinished or breaks down?' → Jesus is the final answer.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📋 'FINDING WALDO' CHEAT SHEET (Works in ANY Chapter)\n\n┌─────────┬──────────────────────────────┬────────────────────────────────┐\n│ METHOD  │ WALDO CLUE                   │ CHRIST CONNECTION              │\n├─────────┼──────────────────────────────┼────────────────────────────────┤\n│ 1       │ Red-striped promise          │ Jesus fulfills it              │\n│ 2       │ Look-alike person/event      │ Jesus is the reality           │\n│ 3       │ Gospel trail (sin→rescue)    │ Jesus is the Hero              │\n│ 4       │ God's heart revealed         │ Jesus is God with us           │\n│ 5       │ Unfinished good thing        │ Jesus is the final answer      │\n└─────────┴──────────────────────────────┴────────────────────────────────┘\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎯 PRACTICAL APPLICATION STEPS:\n\n1. READ the chapter thoroughly\n\n2. APPLY ALL 5 METHODS systematically:\n   ☐ Method 1: Any promises of a coming Redeemer?\n   ☐ Method 2: Any types/shadows (persons, objects, events)?\n   ☐ Method 3: Any rescue pattern (sin→cry→deliverance)?\n   ☐ Method 4: What does God's character/action reveal?\n   ☐ Method 5: What's unfinished or temporary here?\n\n3. NAME Christ's title/role in this chapter:\n   • What is He called or what role does He fill?\n   • Examples: Lamb, King, Prophet, Priest, Judge, Deliverer, Mediator, Rock, Shepherd\n\n4. STATE Christ's action/accomplishment:\n   • What does He DO in/through this chapter?\n   • Examples: Atones, rules, reveals, intercedes, conquers, fulfills, delivers, provides\n\n5. CROSSLINK with 1-2 NT texts that confirm the Christ-connection:\n   • Where do NT writers quote or reference this passage about Jesus?\n   • If no direct quote, find thematic parallel in NT\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ KEY PRINCIPLES:\n\n✅ EVERY CHAPTER without exception has Jesus—use the 5 methods to find Him\n✅ MULTIPLE METHODS often apply to the same chapter—use as many as fit\n✅ Don't FORCE Christ into the text; FIND Christ by seeing the whole canon's Christ-trajectory\n✅ When stuck, ask: 'How does the NT read this passage?' (Luke 24:27, John 5:39)\n✅ CEC prevents MORALISM ('be like David') by pointing to CHRIST ('see David's greater Son')\n✅ The goal is CHRIST-DISCOVERY, not creative allegorizing",
        examples: [
          "📖 EXAMPLE 1: Genesis 3 (Finding Waldo in the Fall Chapter)\n• Method 1 (Promise): 'Seed of woman will crush serpent's head' (v.15) → Red-striped promise of Redeemer\n• Method 3 (Gospel Trail): Sin enters → God seeks them → God provides clothing (rescue)\n• Method 5 (Unfinished): Animal dies for covering → temporary solution pointing to final sacrifice\n• NAME=Seed of Woman/Last Adam • ACT=Promises to crush serpent, inaugurates redemption plan • CROSSLINK=Romans 5:17-19 (as by one man sin entered, by one man righteousness), Romans 16:20 (crush Satan), Rev 12:9",
          
          "📖 EXAMPLE 2: Exodus 12 (Finding Waldo in Passover)\n• Method 2 (Type): Passover lamb slain, blood on doorposts → Waldo in lamb costume = Christ our Passover\n• Method 3 (Gospel Trail): Israel enslaved → cries out → God delivers through blood sacrifice\n• Method 4 (God's Heart): God's judgment on sin + provision of substitute → Christ bearing wrath for us\n• NAME=Passover Lamb • ACT=Blood substitutes for firstborn, delivers from death and slavery • CROSSLINK=1 Cor 5:7 (Christ our Passover), John 1:29 (Lamb of God), 1 Pet 1:18-19",
          
          "📖 EXAMPLE 3: Obadiah (Finding Waldo in a 'Hard' Chapter)\n• Method 1 (Promise): 'On Mount Zion will be deliverance' (v.17) → Waldo's red stripe pointing to Savior\n• Method 3 (Gospel Trail): Edom's pride judged → Israel restored → pattern of judgment/salvation\n• Method 5 (Unfinished): 'The kingdom will be the LORD's' (v.21) → temporary judgment points to Christ's eternal reign\n• NAME=Deliverer-King • ACT=Judges pride, establishes kingdom on Zion • CROSSLINK=Luke 1:33 (reign forever), Heb 12:22 (come to Mount Zion)",
          
          "📖 EXAMPLE 4: 1 Kings 17 (Finding Waldo in Elijah's Story)\n• Method 2 (Type): Widow's son dies and is raised → Waldo in resurrection preview = Christ's power over death\n• Method 3 (Gospel Trail): Famine/death crisis → desperate widow → prophet brings life\n• Method 4 (God's Heart): God provides for widow, raises her son → Christ as Resurrection and Life\n• NAME=Resurrection and Life • ACT=Provides in scarcity, conquers death • CROSSLINK=John 11:25 (I am resurrection and life), Luke 7:14-15 (Jesus raises widow's son)",
          
          "📖 EXAMPLE 5: Jonah 2 (Finding Waldo in the Fish)\n• Method 2 (Type): Three days in fish → Waldo in the belly = Christ's three days in tomb (Matt 12:40)\n• Method 3 (Gospel Trail): Jonah's rebellion → drowning/death → God rescues from Sheol\n• Method 4 (God's Heart): God pursues runaway prophet with discipline + mercy → Christ pursues lost sheep\n• NAME=Sign Prophet/Greater Jonah • ACT=Dies, buried, rises on third day • CROSSLINK=Matt 12:39-40 (sign of Jonah), Luke 11:29-30",
          
          "📖 EXAMPLE 6: Nehemiah 7 (Finding Waldo in a 'Boring' Census)\n• Method 1 (Promise): People returning home to Jerusalem → points to Christ gathering His people\n• Method 5 (Unfinished): Physical return to earthly city incomplete → Christ's final homecoming (Rev 21)\n• NAME=True Restorer/Gatherer • ACT=Brings exiles home, rebuilds walls, establishes secure dwelling • CROSSLINK=John 14:2-3 (I go to prepare a place), Rev 21:2-3 (New Jerusalem descends, God dwells with His people)"
        ],
        pitfalls: [
          "GIVING UP TOO SOON: If you don't immediately see Jesus, keep applying all 5 methods—He's always there",
          "USING ONLY ONE METHOD: Different chapters highlight different methods—apply all 5 systematically",
          "MORALISM: Making passage about 'be like this hero' instead of 'see this hero point to Christ' (Method 2 corrects this)",
          "VAGUE 'GOD IN GENERAL': Saying 'God loves us' without naming Christ specifically (Method 4 fixes this)",
          "ALLEGORIZING RANDOMLY: Finding Jesus in details Scripture doesn't authorize—stick to the 5 biblical methods",
          "SKIPPING 'BORING' CHAPTERS: Genealogies, laws, and censuses ALL contain Christ via Method 5 (unfinished story) or Method 1 (promise line)",
          "NO NT CROSSLINK: Failing to confirm your Christ-reading with New Testament validation—always crosslink",
          "FORCING ONE METHOD: If Method 2 (types) doesn't fit, try Method 1 (promises) or Method 4 (God's character)—let the text guide which method(s) to use"
        ],
        deliverable: "CEC Note using 'Finding Waldo' Framework:\n\n1️⃣ METHODS APPLIED: List which of the 5 methods you used (1-Promise, 2-Type, 3-Trail, 4-Heart, 5-Unfinished)\n\n2️⃣ NAME: Christ's title/role in this chapter (e.g., Lamb, King, Shepherd, Deliverer, Prophet, Priest)\n\n3️⃣ ACT: What Christ does/accomplishes in or through this chapter (e.g., atones, delivers, fulfills, reveals, judges, restores)\n\n4️⃣ CROSSLINK: 1-2 NT texts confirming the Christ-connection\n\nExample Format:\n'Genesis 3 | METHODS: 1,3,5 | NAME: Seed of Woman/Last Adam | ACT: Promises to crush serpent, inaugurates redemption | CROSSLINK: Rom 5:17-19, Rom 16:20, Rev 12:9'"
      },
      {
        id: "r66",
        name: "Room 66",
        tag: "R66",
        purpose: "Room 66 is the ultimate integrative discipline—it trains you to trace a SINGLE THEME through every book of the Bible, from Genesis to Revelation, revealing how God's redemptive plan unfolds progressively across the entire canon. This room prevents fragmented Bible study by forcing you to see the BIG PICTURE: How does this theme START in Genesis? How does it DEVELOP through the OT narrative, prophecy, and wisdom literature? How does it CLIMAX in Christ? How does it CONSUMMATE in Revelation? By building a 66-row grid (one row per book), you create a 'Constellation'—a connected map showing how one truth thread weaves through Scripture's tapestry. This is panoramic theology at its finest. Themes like 'The Lamb,' 'The Seed,' 'The Kingdom,' 'The Temple,' or 'The Covenant' become living storylines rather than isolated doctrines. R66 transforms you from a verse-by-verse student into a whole-Bible theologian who sees the forest AND the trees.",
        coreQuestion: "How does this single theme develop, escalate, and find fulfillment across all 66 books of the Bible?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. CHOOSE A THEME that spans the entire Bible:\n• Must appear or be implied in multiple books (not just a few)\n• Should have clear OT roots and NT fulfillment\n• Examples: The Lamb, The Seed, The Kingdom, The Temple, The Covenant, The Shepherd, The Rock, Blood Atonement, Remnant, Exodus\n\n2. CREATE A 66-ROW GRID with these columns:\n• BOOK NAME (Genesis, Exodus, Leviticus... Revelation)\n• CLAIM (≤14 words): How does this theme appear in THIS book? Be specific, not generic.\n• PROOF-TEXT: 1-2 key verses from that book showing the theme\n• PT-TAGS: Brief tags/notes about the proof-text's significance\n\n3. WORK THROUGH EACH BOOK:\n• Some books will have MAJOR theme development (e.g., Lamb in Exodus, Isaiah, John, Revelation)\n• Some will have MINOR mentions (e.g., Lamb in Esther = none explicitly, but God's hidden providence preserves the line)\n• If a book doesn't explicitly mention the theme, ask: How does this book FIT INTO the theme's storyline?\n• Example: Esther doesn't mention God or Lamb explicitly, but preserving the Jewish remnant preserves the line through which the Lamb comes\n\n4. MAINTAIN PROGRESSIVE REVELATION:\n• Show how the theme STARTS (often shadowy, implicit)\n• Watch it DEVELOP (gaining clarity, detail)\n• See it CLIMAX in Christ (explicit fulfillment)\n• Trace it to CONSUMMATION in Revelation (ultimate realization)\n\n5. WRITE A CONSTELLATION (100-120 words):\n• Synthesize the ENTIRE 66-book journey in narrative form\n• Show OT→NT movement\n• Highlight key turning points (e.g., 'The Lamb moves from substitute ram in Genesis 22 to Passover sacrifice in Exodus 12 to suffering servant in Isaiah 53 to Christ crucified in the Gospels to victorious Lion-Lamb in Revelation 5')\n\nKEY PRINCIPLES:\n• CLAIMS must be ≤14 words—brevity forces precision\n• PROOF-TEXTS must actually support the claim—don't force it\n• NOT EVERY BOOK will emphasize your theme equally—that's okay; show the storyline's flow\n• The CONSTELLATION is your interpretive summary—make it compelling\n• R66 prevents PROOF-TEXTING by forcing you to see themes in context of the whole canon",
        examples: [
          "THEME: The Lamb\n\n• Genesis 3: Seed of woman promises future Lamb who crushes serpent → Gen 3:15\n• Genesis 22: God provides ram as substitute for Isaac on Moriah → Gen 22:8, 13\n• Exodus 12: Passover Lamb's blood saves firstborn from death → Ex 12:3-13\n• Leviticus 16: Scapegoat bears sins away on Day of Atonement → Lev 16:21-22\n• Numbers 28: Daily lamb sacrifices morning and evening continually → Num 28:3-4\n• Isaiah 53: Suffering Servant led as lamb to slaughter, bears our sins → Isa 53:7, 10-12\n• John 1: John Baptist: 'Behold the Lamb of God who takes away sin!' → John 1:29\n• Acts 8: Ethiopian eunuch reads Isaiah 53, Philip explains it's Jesus → Acts 8:32-35\n• 1 Peter 1: Redeemed by precious blood of Christ, Lamb without blemish → 1 Pet 1:18-19\n• Revelation 5: Lamb slain yet standing, worthy to open scroll, receives worship → Rev 5:6-14\n• Revelation 21: Marriage supper of the Lamb, city has no temple—Lamb is temple → Rev 21:9, 22\n\nCONSTELLATION (120 words): The Lamb theme begins in Genesis with God's promise that a Seed would come to crush the serpent, and God provides a ram to replace Isaac—foreshadowing substitutionary sacrifice. In Exodus, the Passover Lamb's blood marks deliverance from death, a pattern repeated throughout Leviticus and the sacrificial system. Isaiah 53 unveils the Suffering Servant-Lamb who bears humanity's sins in silent submission. The Gospels reveal Jesus as 'the Lamb of God' who fulfills every OT type, dying at Passover as the ultimate sacrifice. Acts and the Epistles proclaim redemption by the Lamb's blood. Revelation escalates the Lamb to cosmic proportions: the Lamb who was slain is now the Lion-Lamb reigning on the throne, the Bridegroom at the marriage supper, and the Temple-Light of the New Jerusalem. From substitute to Savior to sovereign LORD—the Lamb's journey is complete.",
          
          "THEME: The Seed\n\n• Genesis 3: Woman's Seed will crush serpent's head → Gen 3:15\n• Genesis 12: Abraham's seed will bless all nations → Gen 12:3\n• Genesis 22: Through your offspring all nations blessed → Gen 22:18\n• 2 Samuel 7: David's seed will establish eternal throne → 2 Sam 7:12-13\n• Psalm 89: Covenant with David's seed endures forever → Ps 89:3-4\n• Isaiah 6: Holy seed is stump that remains after judgment → Isa 6:13\n• Matthew 1: Genealogy traces seed from Abraham through David to Jesus → Matt 1:1\n• Galatians 3: The Seed is Christ; promises made to Abraham's Seed → Gal 3:16\n• Revelation 12: Woman's offspring (seed) pursued by dragon, ultimately victorious → Rev 12:17\n\nCONSTELLATION: The Seed promise threads through the entire canon, beginning with the proto-gospel in Genesis 3:15—a coming Seed who will crush evil. God narrows the line through Abraham ('your seed will bless nations'), Isaac (the seed of promise, not Ishmael), Jacob (not Esau), Judah ('scepter will not depart'), and finally David ('your seed's throne forever'). The prophets sustain hope during exile: a holy Seed-remnant will survive. The Gospels unveil Jesus as THE Seed—Abraham's promised offspring, David's greater Son. Paul clarifies in Galatians: the Seed is singular—Christ Himself. Revelation 12 shows the final showdown: the dragon wars against the woman's Seed, but the Seed conquers. From promise to person to victory—the Seed has triumphed."
        ],
        pitfalls: [
          "OVERLONG CLAIMS: Keeping claims to ≤14 words forces clarity—don't cheat with run-on sentences",
          "SOFT PROOF-TEXTS: Using verses that don't actually mention or clearly imply your theme",
          "SKIPPING HARD BOOKS: Every book contributes—don't skip Leviticus, Chronicles, or Philemon just because they're 'hard'",
          "GENERIC CLAIMS: 'God is good in this book' is useless; be specific about HOW your theme develops",
          "NO CONSTELLATION: The grid is data; the Constellation is interpretation—don't skip the synthesis"
        ],
        deliverable: "R66 Grid (66 rows: Book → Claim [≤14 words] → Proof-Text → PT-Tags) + Constellation (100-120 word OT→NT narrative synthesis showing theme's development)"
      }
    ]
  },
  {
    number: 6,
    name: "Three Heavens & Cycles",
    subtitle: "Horizons & History",
    description: "Situate texts in redemptive-historical cycles and cosmic dimensions. Compress entire books through the palace method.",
    rooms: [
      {
        id: "123h",
        name: "Three Heavens",
        tag: "1H/2H/3H",
        purpose: "The Three Heavens Room prevents interpretive chaos by recognizing that many biblical prophecies have MULTIPLE HORIZONS of fulfillment—near, intermediate, and ultimate. This room is essential for reading prophetic literature (especially Isaiah, Jeremiah, Ezekiel, Zechariah, and Jesus' Olivet Discourse) without collapsing everything into one time period. The three horizons are: FIRST HEAVEN (1H) = Near fulfillment in Israel's return from Babylonian exile under Cyrus (539 BC and post-exilic era); SECOND HEAVEN (2H) = Intermediate fulfillment in the destruction of Jerusalem (AD 70), the 'this generation' events Jesus predicted, and the church age where the church becomes the new temple; THIRD HEAVEN (3H) = Ultimate fulfillment in Christ's Second Coming, final judgment, and the new creation. Many prophecies telescope through all three horizons—they had a HISTORICAL fulfillment that foreshadowed a GREATER fulfillment, which ultimately awaits the FINAL fulfillment. This room trains you to ask: Which horizon(s) is this passage addressing? Have any been fulfilled? Is one still future?",
        coreQuestion: "Which redemptive-historical horizon does this prophecy or promise address: First Heaven (Babylon/return), Second Heaven (AD 70/church age), or Third Heaven (final judgment/new creation)?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. UNDERSTAND THE THREE HORIZONS:\n\nFIRST HEAVEN (1H) — Babylon & Return (539 BC - 400 BC):\n• Context: Judah exiled to Babylon (586 BC), prophets promise restoration\n• Fulfillment: Cyrus the Persian conquers Babylon (539 BC), allows Jews to return\n• Key figures: Cyrus, Zerubbabel, Ezra, Nehemiah\n• Events: Temple rebuilt (516 BC), walls rebuilt (445 BC), post-exilic community restored\n• Texts heavily 1H: Isaiah 40-55, Jeremiah 29-33, Ezekiel 36-37, Haggai, Zechariah\n• Examples: 'Comfort my people' (Isa 40:1), 'Build the temple' (Hag 1:8), '70 years' (Jer 25:11-12)\n\nSECOND HEAVEN (2H) — AD 70 & Church Age:\n• Context: Jesus predicts Jerusalem's destruction, temple's end, gospel goes to nations\n• Fulfillment: Romans destroy Jerusalem and temple (AD 70), 'this generation' fulfilled\n• Key figures: Jesus, apostles, early church, Roman armies\n• Events: Temple destroyed, church becomes God's temple (1 Cor 3:16), gospel to Gentiles\n• Texts heavily 2H: Matthew 24 (Olivet Discourse), Luke 21, parts of Daniel, Revelation (preterist elements)\n• Examples: 'Not one stone left upon another' (Matt 24:2), 'This generation will not pass' (Matt 24:34)\n\nTHIRD HEAVEN (3H) — Final Judgment & New Creation:\n• Context: Ultimate consummation of all things, Second Coming, resurrection, new heavens/earth\n• Fulfillment: FUTURE—awaits Christ's return and final restoration\n• Key figures: Christ returning in glory, resurrected saints, final judgment\n• Events: Resurrection of dead, final judgment, Satan defeated, new heavens and new earth created\n• Texts heavily 3H: Revelation 19-22, Isaiah 65-66 (ultimate sense), 2 Peter 3, 1 Thess 4:13-18\n• Examples: 'New heavens and new earth where righteousness dwells' (2 Pet 3:13), 'No more death' (Rev 21:4)\n\n2. READ THE PASSAGE and identify clues:\n• AUDIENCE: Who is being addressed? (Exiles in Babylon = 1H; 'this generation' = 2H; 'day of the Lord' = 3H)\n• TIMEFRAME: Any explicit time markers? ('70 years' = 1H; 'before this generation passes' = 2H; 'last day' = 3H)\n• LANGUAGE SCALE: Local (Jerusalem/Judah = 1H-2H) or cosmic (sun darkened, stars fall = often 3H, but sometimes apocalyptic metaphor for 1H-2H events)\n• FULFILLMENT INDICATORS: Has this already happened historically? (Check history)\n\n3. ASSIGN HORIZON TAG(S):\n• Some passages are SINGLE HORIZON (only 1H, only 2H, or only 3H)\n• Many are DUAL HORIZON (1H + 3H, or 2H + 3H)—near fulfillment foreshadows ultimate\n• A few telescope through ALL THREE (1H → 2H → 3H)\n\n4. DEFEND YOUR ASSIGNMENT:\n• Cite historical evidence for fulfilled horizons (1H: Cyrus decree in 539 BC; 2H: Josephus on AD 70)\n• Cite biblical evidence (NT writers often quote OT 1H texts and apply them to 2H-3H)\n• Explain WHY you see single vs. multiple horizons\n\nKEY PRINCIPLES:\n• MULTIPLE HORIZONS ARE NORMAL—don't force everything into one\n• 1H doesn't cancel 3H—near fulfillment often foreshadows far fulfillment\n• APOCALYPTIC LANGUAGE can describe both earthly catastrophes (1H-2H) and cosmic consummation (3H)\n• NT writers often see OT 1H prophecies having 2H-3H fulfillment in Christ and the church\n• 'NEW HEAVENS/EARTH' language can apply to 1H (restoration after exile) AND 3H (final new creation)",
        examples: [
          "Isaiah 65:17-25 (New Heavens/Earth): HORIZON=1H+3H (Dual) • 1H: Restoration after Babylonian exile—'build houses and inhabit them' (65:21) describes post-exilic return. • 3H: Ultimate new creation—'no more death' (65:20, but note it's not absolute in this text—still death, just long life), 'wolf and lamb feed together' (65:25) = ultimate restoration. DEFENSE: Language oscillates between historical (building houses) and cosmic (wolf/lamb peace). Near fulfillment in return from exile; far fulfillment in new creation.",
          
          "Matthew 24:1-35 (Olivet Discourse - Temple Destruction): HORIZON=2H • Jesus predicts 'not one stone left on another' (24:2), warns disciples to flee when they see 'abomination of desolation' (24:15), says 'this generation will not pass away' (24:34). FULFILLMENT: AD 70, Roman armies (the 'abomination') surround Jerusalem, destroy temple, Christians flee to Pella. DEFENSE: 'This generation' = the people Jesus is addressing; historically fulfilled within 40 years.",
          
          "Matthew 24:36-51 (Second Coming): HORIZON=3H • 'No one knows day or hour' (24:36), 'Son of Man comes on clouds' (24:30), 'one taken, one left' (24:40-41). FULFILLMENT: FUTURE—awaits Christ's return. DEFENSE: Shifts from 2H (temple destruction) to 3H (unknown day, cosmic Coming) at verse 36.",
          
          "Jeremiah 31:31-34 (New Covenant): HORIZON=1H+2H+3H (Triple Telescope) • 1H: Post-exilic restoration hope for Israel returning. • 2H: Jesus enacts new covenant at Last Supper (Luke 22:20), inaugurated in church age. • 3H: Fully realized when 'all will know the Lord' and 'no more sin' in new creation. DEFENSE: NT writers apply this to the church (Heb 8:8-12), but full 'no more sin' awaits 3H.",
          
          "Zechariah 14:1-21 (Day of the LORD): HORIZON=1H+3H (Dual) • 1H: Near horizon—deliverance for post-exilic Jerusalem under threat. • 3H: Ultimate horizon—cosmic language (mountains split, no more night, living waters flow from Jerusalem) points to final restoration. DEFENSE: Some imagery fits historical deliverance; other imagery (no more night, Zech 14:7) echoes Revelation 21-22 (3H)."
        ],
        pitfalls: [
          "FLATTENING ALL PROPHECY INTO 3H: Ignoring historical fulfillments (1H-2H) and making everything 'still future'",
          "FLATTENING ALL PROPHECY INTO 1H-2H: Claiming everything was fulfilled by AD 70, leaving no future hope (hyper-preterism)",
          "IGNORING CONTEXT: Not checking if the prophecy addresses exiles in Babylon (1H clue) or 'this generation' (2H clue)",
          "LITERALIZING APOCALYPTIC LANGUAGE: Assuming 'stars fall from sky' always means 3H cosmic events when it can be metaphor for 1H-2H political collapse",
          "FORCING SINGLE HORIZON: Refusing to see dual/triple horizons when the text warrants multiple fulfillments"
        ],
        deliverable: "Horizon Tag (1H, 2H, 3H, or combinations like 1H+3H) + Defense (2-3 sentences explaining why you assigned this horizon, with historical/textual evidence)"
      },
      {
        id: "cycles",
        name: "Eight Cycles",
        tag: "@",
        purpose: "The Eight Cycles Room reveals God's repeating covenant pattern throughout redemptive history. Each cycle represents a major covenant era where God establishes relationship with humanity following a similar 5-beat arc: Fall → Covenant → Sanctuary → Enemy → Restoration. This room trains you to see that biblical history isn't random—it's a divine spiral where each cycle echoes and enlarges the previous one. By identifying which cycle your passage belongs to, you gain powerful insight into its theological context and can compare/contrast how God works across different eras. For instance, comparing the sanctuary in the Moses cycle (Tabernacle) with the sanctuary in the Christ cycle (His body/the Church) reveals escalating glory and intimacy.",
        coreQuestion: "Which covenant cycle does this narrative fit, and how does it compare with parallel elements in other cycles?",
        method: "EIGHT CYCLES DEFINED:\n\n@Ad (ADAM CYCLE) — The Creation Covenant:\n• Fall: Sin enters through disobedience (Gen 3)\n• Covenant: Proto-gospel promise—seed of woman crushes serpent (Gen 3:15)\n• Sanctuary: Eden/Garden as dwelling place with God\n• Enemy: Serpent/Satan; death introduced\n• Restoration: Exile from garden but promise of future seed\nWHY IT'S A CYCLE: Establishes the pattern of fall-promise-enmity-hope that repeats through Scripture\n\n@No (NOAH CYCLE) — The Preservation Covenant:\n• Fall: Corruption fills earth; violence multiplies (Gen 6)\n• Covenant: Rainbow covenant—never destroy earth by flood (Gen 9)\n• Sanctuary: Ark as place of salvation and separation\n• Enemy: Flood waters; corrupt humanity\n• Restoration: New beginning; promise of seasons and stability\nWHY IT'S A CYCLE: Demonstrates God's pattern of judgment + mercy through preserved remnant\n\n@Ab (ABRAHAM CYCLE) — The Faith Covenant:\n• Fall: Babel's pride; nations scattered (Gen 11)\n• Covenant: Blessing promise—all nations blessed through Abraham's seed (Gen 12, 15, 17)\n• Sanctuary: Altars erected wherever Abraham camps; Moriah foreshadows temple\n• Enemy: Competing nations; barrenness; Ishmael conflict\n• Restoration: Isaac born; land promised; seed multiplies\nWHY IT'S A CYCLE: Establishes faith as the mechanism of covenant relationship\n\n@Mo (MOSES CYCLE) — The Law Covenant:\n• Fall: Egyptian oppression and slavery (Ex 1-2)\n• Covenant: Sinai covenant—'You will be my people' (Ex 19-24)\n• Sanctuary: Tabernacle with priesthood and sacrificial system (Ex 25-40)\n• Enemy: Pharaoh, Egypt, Amalek, wilderness rebellion\n• Restoration: Journey toward Canaan; law given as guide\nWHY IT'S A CYCLE: Formalizes worship structure and reveals humanity's need for mediator\n\n@Cy (CYRUS CYCLE) — The Restoration Covenant:\n• Fall: Exile in Babylon after repeated idolatry (2 Kings 24-25)\n• Covenant: New covenant promise through prophets (Jer 31, Ezek 36)\n• Sanctuary: Temple rebuilt under Zerubbabel and Joshua (Ezra, Haggai)\n• Enemy: Babylon, Persia, opposition to rebuilding\n• Restoration: Return from exile; temple and walls rebuilt; await Messiah\nWHY IT'S A CYCLE: Demonstrates God's faithfulness to restore despite failure; points to greater restoration\n\n@CyC (CHRIST CYCLE) — The Messiah Covenant:\n• Fall: Universal sin; Roman occupation; religious corruption\n• Covenant: New covenant in Christ's blood (Luke 22:20; Heb 8-10)\n• Sanctuary: Christ's body as temple (John 2:19-21); church as living stones (1 Pet 2:5)\n• Enemy: Satan, death, sin, religious/political powers\n• Restoration: Resurrection, ascension, atonement completed; kingdom inaugurated\nWHY IT'S A CYCLE: The central cycle—fulfills all previous cycles and launches the final era\n\n@Sp (SPIRIT/CHURCH CYCLE) — The Mission Covenant:\n• Fall: Ongoing sin in believers; persecution of church; apostasy threats\n• Covenant: Great Commission covenant—'I am with you always' (Matt 28:18-20)\n• Sanctuary: Believers as God's temple (1 Cor 3:16); Spirit indwells corporately\n• Enemy: Satan's attacks on church; false teachers; cultural opposition\n• Restoration: Gospel spreads to nations; church purified through trials; await consummation\nWHY IT'S A CYCLE: The 'already/not yet' era where Christ's victory is applied globally through the Spirit\n\n@Re (RETURN CYCLE) — The Consummation Covenant:\n• Fall: Final rebellion; Beast/Babylon system; great apostasy (Rev 13, 2 Thess 2)\n• Covenant: 'Behold, I make all things new' (Rev 21:5); marriage supper of Lamb\n• Sanctuary: New Jerusalem descends—God dwells with humanity forever (Rev 21-22)\n• Enemy: Dragon, Beast, False Prophet cast into lake of fire (Rev 19-20)\n• Restoration: New heavens and new earth; Eden restored and escalated; no more curse\nWHY IT'S A CYCLE: The final, eternal cycle that completes and perfects all previous patterns\n\nCOMPARING AND CONTRASTING CYCLES:\nEach cycle can be compared with any other to reveal theological development. For example:\n• Sanctuary comparison: Eden (garden) → Ark (vessel) → Altars (outdoor) → Tabernacle (portable) → Temple (fixed) → Christ (embodied) → Church (distributed) → New Jerusalem (cosmic)\n• Enemy comparison: Serpent → Flood → Barrenness → Pharaoh → Babylon → Death → Persecution → Dragon\n• Restoration comparison: Promise → Remnant → Seed → Exodus → Return → Resurrection → Mission → New Creation\n\nUSAGE: Identify the primary cycle for your passage, then note the 5-beat arc within that cycle. Compare parallel elements (sanctuary, enemy, covenant) with the same elements in other cycles to see escalation and fulfillment.",
        examples: [
          "Exodus 1-40 → @Mo cycle: Egyptian oppression (Fall) → Sinai covenant (Covenant) → Tabernacle built (Sanctuary) → Egypt destroyed, Amalek fought (Enemy) → March toward Canaan (Restoration). COMPARISON: Moses cycle's Passover Lamb escalates in Christ cycle as the Lamb of God (John 1:29)",
          "Acts 2 → @Sp cycle: Post-ascension waiting (Fall=incomplete) → Pentecost outpouring (Covenant renewed in Spirit) → Believers as living temple (Sanctuary) → Religious persecution begins (Enemy) → Gospel spreads (Restoration in progress). COMPARISON: Spirit cycle's distributed sanctuary (every believer) fulfills Moses cycle's centralized tabernacle",
          "Isaiah 65 → Can apply to @Cy (return from Babylon—1st horizon) AND @Re (new heavens/earth—3rd horizon). Shows how prophecy can have multiple cycle fulfillments"
        ],
        pitfalls: [
          "Assigning modern events to ancient cycles without biblical warrant",
          "Failing to identify which of the 5 beats you're examining",
          "Ignoring how cycles escalate (later cycles don't merely repeat—they enlarge and fulfill)",
          "Forcing every text into a cycle when some passages are timeless wisdom literature",
          "Comparing cycles superficially without showing theological development"
        ],
        deliverable: "Cycle tag (@Ad, @No, etc.) + 5-beat arc identified + one comparison with parallel element from a different cycle"
      },
      {
        id: "jr",
        name: "Juice Room",
        tag: "JR",
        purpose: "The Juice Room is the ultimate stress test—it forces you to compress an ENTIRE BIBLICAL BOOK through multiple Palace rooms, extracting the concentrated 'juice' (essence) in 150 words or less. This isn't casual reading; it's high-pressure synthesis where you apply layered lenses (story, symbols, Christ, prophecy, dimensions, genre, etc.) and then distill everything into a razor-sharp summary. Think of it like squeezing an orange: you're extracting the purest concentrate, leaving behind the pulp. The Juice Room prevents shallow skimming (reading a book without truly digesting it) and forces you to THINK THROUGH THE ENTIRE PALACE METHOD in one integrated flow. By the time you produce the 'juice,' you've not only studied the book—you've MASTERED it at a panoramic level. This room is for books you want to OWN deeply, not just visit casually.",
        coreQuestion: "What is the concentrated essence of this book when filtered through multiple Palace rooms—story, symbols, Christ, prophecy, and more?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. CHOOSE A BOOK to juice (start with shorter books like Jonah, Philemon, or Haggai; graduate to longer books like Exodus or Isaiah)\n\n2. RUN THE BOOK THROUGH THE PALACE FLOORS IN ORDER:\n(You don't need to write exhaustive notes for every room—just key observations)\n\nFLOOR 1 — FURNISHING:\n• SR (Story Room): What are the 3-7 main beats of this book's storyline?\n• IR (Imagination Room): What does one key scene FEEL like?\n• 24FPS: What image represents each chapter?\n• Optional: TR, GR if relevant\n\nFLOOR 2 — INVESTIGATION:\n• OR (Observation): What repeated words, themes, or structures?\n• DC (Def-Com): Any key words to define? Cultural/historical context?\n• ST (Symbols/Types): What types or symbols appear?\n• QR/QA: What major questions does the book answer?\n\nFLOOR 3 — FREESTYLE (Optional for Juice, but helpful):\n• BF: What verses connect to other books?\n\nFLOOR 4 — NEXT LEVEL:\n• CR (Concentration): Where is Christ in this book? (Use CEC if needed)\n• DR (Dimensions): How does this book speak on all five dimensions?\n• C6 (Connect-6): What genre is this book, and how does that shape reading?\n• TRm (Theme Room): Which theological span does this book occupy?\n• TZ (Time Zone): When does this book sit on redemptive timeline?\n\nFLOOR 5 — VISION:\n• BL (Blue Room): Any sanctuary connections?\n• PR (Prophecy Room): If prophetic, where on the historicist timeline?\n• 3A: How does this book connect to the Three Angels' Messages?\n• FE (Feasts): Any feast connections?\n\nFLOOR 6 — THREE HEAVENS & CYCLES:\n• @ (Eight Cycles): Which covenant cycle(s) does this book belong to?\n• 1H/2H/3H: What redemptive-historical horizon(s)?\n\n3. WRITE THE JUICE (150 words MAX):\n• Synthesize all the above into a flowing narrative summary\n• Show the book's MOVEMENT (beginning → middle → end)\n• Highlight the CHRIST-LINE explicitly\n• Connect to the GOSPEL and God's redemptive plan\n• Make it MEMORABLE and COMPELLING—someone should be able to teach this book after reading your juice\n\n4. ADD A FINAL TAG LINE (one punchy sentence summarizing the book)\n\nKEY PRINCIPLES:\n• LAYERED LENSES: Don't just tell the story—show Christ, the covenant cycle, the genre, the timeline\n• BREVITY IS POWER: 150 words forces you to eliminate fluff\n• INTEGRATION: The juice should feel like a unified whole, not a checklist\n• CHRIST-CENTERED: Every juice should make Christ explicit\n• The juice is your ELEVATOR PITCH for the book—teach it in 60-90 seconds",
        examples: [
          "JONAH JUICE (147 words):\n\nJonah, a reluctant prophet during Israel's prosperity (@Sp cycle, ~760 BC), flees God's call to preach to Nineveh, Israel's brutal enemy. His storm-tossed flight ends in the belly of a great fish—a three-day 'tomb' foreshadowing Christ's burial and resurrection (Matt 12:40). Vomited onto dry land, Jonah obeys reluctantly, preaching judgment. Shockingly, pagan Nineveh repents in sackcloth, and God relents. Jonah, furious at God's mercy to Gentiles, sulks under a withered plant. God rebukes Jonah's tribalism: 'Should I not pity Nineveh?' (Jonah 4:11). GENRE: Narrative with parabolic elements. CHRIST: Jonah's resurrection from fish = Christ's resurrection; Nineveh's inclusion = gospel to Gentiles (Luke 11:30, Rom 11:11-15). HORIZON: 2H (gospel going to nations). Jonah exposes Israel's (and our) resistance to God's scandalous mercy toward enemies.\n\nFINAL TAG: God's mercy defies borders, and the gospel swallows tribalism whole.",
          
          "EXODUS JUICE (150 words):\n\nExodus chronicles Israel's liberation from Egyptian slavery (@Mo cycle begins), revealing God as Deliverer, Lawgiver, and Dwelling Presence. Moses, the reluctant prophet-deliverer, confronts Pharaoh with ten plagues that systematically dismantle Egypt's gods, climaxing in the Passover Lamb whose blood spares the firstborn. The Red Sea crossing baptizes Israel into new identity, but wilderness rebellion reveals their need for a Mediator. At Sinai, God gives the Law—not to earn salvation but to shape covenant life. The Tabernacle's construction (Exodus 25-40) establishes God's mobile throne among His people, pointing to Christ ('the Word tabernacled among us,' John 1:14). CHRIST: Moses typifies Christ (prophet-deliverer), Passover Lamb = Christ crucified (1 Cor 5:7), Manna = Bread of Life (John 6:35). GENRE: Historical narrative with legal/ritual sections. HORIZON: 1H (historical exodus), 2H (baptism into Christ, Rom 6), 3H (final deliverance).\n\nFINAL TAG: Exodus reveals the God who liberates, legislates, and dwells with His delivered people."
        ],
        pitfalls: [
          "SKIPPING EARLY FLOORS: Jumping straight to Christ without doing the groundwork (story, observation, context)",
          "BLOATED SUMMARY: Writing 300+ words because you can't distill—discipline yourself to 150 max",
          "CHRIST-LESS JUICE: Producing a summary that could apply to any religious book instead of showing how this book reveals Jesus",
          "CHECKLIST FEEL: Writing 'Story: X. Christ: Y. Genre: Z.' instead of a flowing narrative synthesis",
          "IGNORING GENRE: Treating apocalyptic prophecy like historical narrative, or poetry like epistle"
        ],
        deliverable: "Juice Summary (≤150 words synthesizing book through Palace lenses: story, Christ, genre, cycle, horizon) + Final Tag Line (one punchy sentence capturing the book's essence)"
      },
      {
        id: "math",
        name: "Mathematics Room",
        tag: "MATH",
        purpose: "The Mathematics Room reveals that God doesn't just work through events—He works through TIME itself, marking pivotal moments with precise prophetic timelines. This room trains you to read Scripture through the lens of six major time prophecies that structure salvation history from Noah to the investigative judgment. These aren't random numbers; they're divine timestamps that reveal God's sovereignty over history and His faithfulness to keep promises within exact timeframes. By identifying which time prophecy a passage connects to, you situate the text within God's prophetic calendar, showing how He orchestrates redemption on schedule. The six time prophecies are: @120 (Noah's warning period), @400 (Israel's Egyptian captivity), @70y (Babylonian exile), @490 (Messiah's first coming timeline), @1260 (papal persecution period), and @2300 (sanctuary cleansing/investigative judgment). This room prevents interpretive drift by anchoring texts to verifiable historical timelines and revealing that God's 'fullness of time' isn't arbitrary—it's mathematically precise.",
        coreQuestion: "How does the text or story connect with one or more of these time prophecies?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. REVIEW THE SIX TIME PROPHECIES:\n\n@120 — Noah's 120-Year Warning (Genesis 6:3)\n• Timeframe: 120 years before the Flood\n• Fulfillment: God gives humanity 120 years of warning while Noah builds the ark\n• Principle: Divine patience with clear deadline; grace period before judgment\n• Application: Extended warnings before major divine intervention\n\n@400 — Israel's Egyptian Captivity (Genesis 15:13)\n• Timeframe: 400 years (rounded from 430, Exodus 12:40-41)\n• Fulfillment: Israel enslaved in Egypt from Joseph's death to Exodus (approx. 1876-1446 BC)\n• Principle: God predicts suffering period with exact duration; promise of deliverance kept precisely\n• Application: God's timing for deliverance is exact, even through long oppression\n\n@70y — Babylonian Captivity (Jeremiah 25:11-12, 29:10)\n• Timeframe: 70 years of exile\n• Fulfillment: Judah exiled to Babylon (605 BC) to Cyrus's decree (539 BC) to temple completion (516 BC)\n• Principle: Judgment has limits; restoration comes on schedule; Sabbath-rest for land (2 Chronicles 36:21)\n• Application: Even in exile, God's promise of return is time-stamped and certain\n\n@490 — The 70-Weeks Prophecy (Daniel 9:24-27)\n• Timeframe: 70 weeks = 490 years (using day-year principle)\n• Calculation: 457 BC (Artaxerxes' decree, Ezra 7) + 483 years = AD 27 (Messiah's baptism/anointing)\n• Fulfillment: Messiah comes, is 'cut off' (crucified AD 31), covenant confirmed, 70 weeks end AD 34\n• Principle: Messiah's first coming precisely dated centuries in advance\n• Application: God's prophetic clock is mathematically accurate; Jesus arrived exactly on time\n\n@1260 — Papal Persecution Period (Daniel 7:25, Revelation 11-13)\n• Timeframe: 1260 prophetic days = 1260 literal years (day-year principle)\n• Calculation: AD 538 (Justinian's decree establishing papal supremacy) to 1798 (papal captivity)\n• Also expressed as: 'time, times, half a time' (3.5 years = 42 months = 1260 days)\n• Fulfillment: Medieval period of papal dominance and persecution of dissenters\n• Principle: Persecution has God-ordained limits; 'little horn' doesn't reign forever\n• Application: God protects His people through dark ages; oppression ends on heaven's schedule\n\n@2300 — Sanctuary Cleansing/Investigative Judgment (Daniel 8:14)\n• Timeframe: 2300 prophetic days = 2300 literal years\n• Calculation: 457 BC (decree to restore Jerusalem) + 2300 years = AD 1844\n• Fulfillment: Christ begins investigative judgment phase in heavenly Most Holy Place (Day of Atonement parallel)\n• Principle: Judgment begins with God's house; pre-Advent judgment determines who is sealed\n• Application: We live in judgment hour (Revelation 14:6-7); time is short\n\n2. IDENTIFY which time prophecy your passage connects to:\n• Does it mention specific year-counts? (120, 400, 70, etc.)\n• Does it describe events during one of these periods? (Flood era, Egyptian bondage, Babylonian exile, Messiah's ministry, medieval persecution, investigative judgment)\n• Does it use time-related language? ('appointed time,' 'fullness of time,' 'when the time had come')\n\n3. STATE the connection: Which prophecy? What's the timeframe? How is it fulfilled or applied?\n4. CALCULATE if necessary: Show the math for @490 and @2300 especially\n5. EXTRACT the theological lesson: What does this timeline reveal about God's character and sovereignty?\n\nKEY PRINCIPLES:\n• TIME PROPHECIES use the DAY-YEAR PRINCIPLE in apocalyptic contexts (Numbers 14:34, Ezekiel 4:6)\n• These aren't symbolic—they're LITERAL TIMELINES fulfilled in history\n• MULTIPLE PROPHECIES can overlap (e.g., @490 is first part of @2300)\n• Time prophecies reveal God's PRECISION—He doesn't work haphazardly\n• Recognizing which timeline a text fits into prevents prophetic confusion",
        examples: [
          "Genesis 6:3 (120 Years Before Flood): PROPHECY=@120 • God says 'My Spirit shall not strive with man forever, for he is indeed flesh; yet his days shall be 120 years.' • FULFILLMENT: Noah preaches righteousness (2 Peter 2:5) for 120 years while building ark—humanity's final grace period before judgment. • LESSON: God gives ample warning before judgment; divine patience has limits.",
          
          "Genesis 15:13 (400 Years in Egypt): PROPHECY=@400 • God tells Abraham 'your descendants will be strangers in a land not theirs, and will serve them, and they will afflict them 400 years.' • FULFILLMENT: Israel enslaved in Egypt from Joseph's era to Moses' Exodus (Exodus 12:40-41 gives 430 years—400 is rounded). • LESSON: God foreknows suffering periods but promises exact deliverance timeline.",
          
          "Jeremiah 29:10 (70 Years of Exile): PROPHECY=@70y • 'After 70 years are completed at Babylon, I will visit you and perform My good word toward you, and cause you to return to this place.' • FULFILLMENT: Judah exiled 605 BC (Daniel taken), temple destroyed 586 BC, Cyrus decrees return 539 BC, temple rebuilt 516 BC—roughly 70-year span. • LESSON: Judgment is temporary; God's restoration promise is date-stamped.",
          
          "Daniel 9:25 (Messiah Comes After 69 Weeks): PROPHECY=@490 • 'From the going forth of the command to restore Jerusalem until Messiah the Prince, there shall be 7 weeks and 62 weeks' = 69 weeks = 483 years. • CALCULATION: 457 BC (Artaxerxes' decree, Ezra 7) + 483 years = AD 27. • FULFILLMENT: Jesus baptized/anointed AD 27 (Luke 3:1, 21-22)—'Messiah' means 'Anointed One.' • LESSON: Jesus arrived EXACTLY on prophetic schedule; first coming was mathematically predicted.",
          
          "Revelation 13:5 (Beast's 42-Month Authority): PROPHECY=@1260 • Beast given 'authority to continue for 42 months' (42 months × 30 days/month = 1260 days = 1260 years). • PARALLEL: Daniel 7:25 ('time, times, half a time' = 3.5 prophetic years = 1260 days). • FULFILLMENT: AD 538 (papal supremacy established) to 1798 (papal captivity/deadly wound). • LESSON: Persecuting powers have God-imposed time limits; the 'little horn' doesn't reign forever.",
          
          "Daniel 8:14 (2300 Days/Years): PROPHECY=@2300 • 'Unto 2300 days; then the sanctuary shall be cleansed.' • CALCULATION: Starts with @490 decree (457 BC) + 2300 years = AD 1844. • FULFILLMENT: Christ moves from Holy Place to Most Holy Place in heavenly sanctuary, beginning investigative judgment (Revelation 14:6-7 'judgment hour'). • LESSON: We live in judgment hour; pre-Advent judgment in progress; time is short."
        ],
        pitfalls: [
          "IGNORING DAY-YEAR PRINCIPLE: Reading 1260 days as literal days instead of 1260 years in apocalyptic prophecy",
          "FORCING PROPHECIES INTO MODERN HEADLINES: Making @1260 or @2300 about events happening right now when they're already fulfilled",
          "FORGETTING HISTORICAL ANCHOR: Time prophecies have VERIFIABLE historical fulfillments—don't speculate beyond what history confirms",
          "MIXING SYMBOLIC WITH LITERAL TIME: Some time references are symbolic (e.g., 'third day' resurrection pattern); these six are LITERAL TIMELINES",
          "SKIPPING THE MATH: @490 and @2300 require calculation—show your work, starting from 457 BC decree"
        ],
        deliverable: "MATH tag: Prophecy Code (@120/@400/@70y/@490/@1260/@2300) → Timeframe (years/dates) → Fulfillment (historical event) → Calculation (if applicable) → Theological Lesson (1-2 sentences)"
      }
    ]
  },
  {
    number: 7,
    name: "Spiritual & Emotional",
    subtitle: "Heart & Soul",
    description: "Bring heart and soul into the fire of experience. Let the text ignite devotion, meditation, and quick recall for live ministry.",
    rooms: [
      {
        id: "frm",
        name: "Fire Room",
        tag: "FRm",
        purpose: "The Fire Room is where Scripture stops being academic and becomes PERSONAL—this is where the text moves from your head to your heart, igniting conviction, comfort, or worship. Up to this point, the Palace has been heavily analytical (observation, exegesis, cross-references, typology). But God's Word isn't merely information to master; it's FIRE that burns (Jer 20:9, 23:29). The Fire Room asks: What WOUND does this text expose in me? (Conviction of sin, awareness of brokenness, recognition of idolatry?) Or what HOPE does this text offer me? (Promise, comfort, assurance, joy?) This room is deeply devotional—it's where you stop studying ABOUT God and start encountering God HIMSELF through His Word. You slow down, read meditatively, name the emotion or spiritual reality the text stirs, and then PRAY IT BACK to God. The Fire Room prevents cold orthodoxy (theologically correct but spiritually dead) and trains you to let Scripture search your heart.",
        coreQuestion: "What wound (conviction) or hope (comfort) does this text expose or kindle in my soul, and how do I respond in prayer?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. CHOOSE A TEXT that resonates emotionally or spiritually:\n• Can be a verse, a paragraph, or a chapter\n• Don't force it—some texts are more cognitive (genealogies, laws); others are more affective (Psalms, Lamentations, prophetic rebukes, gospel promises)\n\n2. READ SLOWLY and MEDITATIVELY:\n• Not speed-reading for information—savor each phrase\n• Read aloud if possible (engages more of your being)\n• Pause after each sentence and ASK: What is this stirring in me?\n\n3. NAME THE WOUND (if conviction):\n• What sin does this text expose?\n• What idolatry, fear, pride, unbelief, or hardness of heart does it reveal?\n• Be SPECIFIC, not vague ('I'm generally sinful' vs. 'I've been trusting my performance instead of Christ's')\n• Examples: 'This exposes my bitterness toward that person,' 'This convicts me of prayerlessness,' 'This reveals I've made comfort an idol'\n\nOR NAME THE HOPE (if comfort):\n• What promise does this text offer?\n• What fear does it dismantle? What sorrow does it console?\n• What joy, assurance, or worship does it ignite?\n• Examples: 'This assures me God won't abandon me,' 'This gives hope that suffering has purpose,' 'This makes me grateful for Christ's finished work'\n\n4. PRAY IT BACK:\n• Turn your observation into a prayer to God\n• If WOUND: Confess, repent, ask for grace to change\n• If HOPE: Thank, worship, ask for faith to believe the promise\n• Make it personal and specific\n• Example (Wound): 'Father, Psalm 139 shows me I can't hide from You. I confess I've been avoiding You because of shame over [specific sin]. Forgive me. Help me run TO You, not from You.'\n• Example (Hope): 'Lord, Romans 8:1 says there's no condemnation for those in Christ. I've been living under guilt even though You've forgiven me. Help me believe what You've said. Thank You that I'm free.'\n\n5. RECORD IT (2-3 sentences):\n• Write a brief 'heart record' capturing the wound/hope and your prayer\n• This isn't journaling your entire life—just the specific encounter with this text\n\nKEY PRINCIPLES:\n• FIRE ROOM comes AFTER exegesis, not instead of it—don't twist the text to fit your feelings\n• Emotion is GOOD and BIBLICAL—God gave you a heart, not just a brain\n• Don't MANUFACTURE emotion if it's not there—not every text will 'feel' powerful in the moment\n• This room is PRIVATE—between you and God (though you can share insights later)\n• REPETITION: The same text can speak differently at different life stages",
        examples: [
          "Psalm 22:1 ('My God, my God, why have you forsaken me?'):\nWOUND: This exposes my seasons of feeling abandoned by God, when prayers seem to bounce off the ceiling. I realize I've been angry at God's silence, doubting His goodness.\nHOPE: But this is CHRIST'S cry on the cross—He experienced ultimate forsakenness so I would never be truly abandoned. Even in my darkest valleys, I'm not alone because He bore that abandonment for me.\nPRAYER: 'Jesus, You cried these words on the cross so I wouldn't have to cry them in hell. Forgive my anger at Your timing. Help me trust that even Your silences are loving. Thank You for bearing forsakenness so I could be adopted.'\nRECORD: Psalm 22 convicted me of doubting God's presence during hard times, but reminded me Jesus bore forsakenness so I'd never be abandoned. I prayed for faith to trust in silence.",
          
          "Romans 8:38-39 ('Nothing can separate us from the love of God'):\nHOPE: This text kindles deep assurance—no failure, no sin, no circumstance can rip me from God's grip. I've been living as if my standing with God depends on my performance, but Paul says NOTHING can separate me.\nPRAYER: 'Father, I've been enslaved to fear that I'll lose Your love if I fail. Romans 8 says that's impossible—Your love is anchored in Christ's work, not mine. Help me REST in this. Thank You that my security is in Your grip, not my grasp.'\nRECORD: Romans 8:38-39 shattered my fear-based relationship with God. I prayed for the Spirit to make this assurance real in my daily walk, not just theological knowledge.",
          
          "Lamentations 3:22-23 ('His mercies are new every morning'):\nHOPE: This speaks to my exhaustion and sense of failure. Yesterday's failures don't define today—God's mercies RESET every morning. I don't have to carry yesterday's shame into today.\nPRAYER: 'Lord, I wake up burdened by yesterday's failures. Lamentations 3 reminds me Your mercies are fresh TODAY—You're not holding grudges. Help me receive today's grace instead of wallowing in yesterday's guilt. Thank You for a fresh start.'\nRECORD: Lamentations 3:22-23 gave me hope that God's grace resets daily. I prayed for the discipline to receive new mercy each morning instead of recycling old guilt."
        ],
        pitfalls: [
          "EMOTIONALISM WITHOUT EXEGESIS: Letting feelings drive interpretation instead of letting text drive feelings",
          "SKIPPING THE FIRE ROOM: Treating Bible study as purely intellectual exercise, never letting it touch your heart",
          "MANUFACTURING EMOTION: Forcing yourself to 'feel something' when the text doesn't naturally stir you that day",
          "VAGUE CONFESSIONS: 'I'm a sinner' without naming specific sins or idols the text exposes",
          "IGNORING CHRIST: Wallowing in guilt without running to the gospel remedy"
        ],
        deliverable: "Fire Record (2-3 sentences): Name the Wound OR Hope the text stirs → Brief prayer response (confession/thanksgiving) → One sentence capturing the encounter"
      },
      {
        id: "mr",
        name: "Meditation Room",
        tag: "MR",
        purpose: "The Meditation Room is the antithesis of information-binge culture—it trains you to MARINATE in a single verse or phrase until it ABSORBS into your being, becoming part of your spiritual DNA. While the Fire Room focuses on emotional encounter, the Meditation Room emphasizes SUSTAINED ATTENTION and REPETITION. This isn't speed-reading 5 chapters; it's dwelling on 5 WORDS for 20 minutes. The goal is internalization: you chew on the text until it becomes instinctive, reflexive, part of your inner dialogue. Meditation (Hebrew: hagah) originally meant to 'mutter' or 'murmur'—ancient Jews would repeat Scripture aloud, over and over, embedding it in memory and heart. This room combats our culture's addiction to novelty ('What's the next insight?') and teaches the spiritual discipline of LINGERING. By the end of a Meditation Room session, that verse should feel like it's written on your bones—you can recite it, visualize it, pray it, and return to it throughout the day.",
        coreQuestion: "What ONE truth from this verse/phrase will I carry, internalize, and return to throughout today?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. SELECT A SMALL PORTION:\n• 1 verse, or even a single phrase (5-15 words max)\n• Choose something rich, not generic\n• Examples: 'The LORD is my shepherd' (Ps 23:1), 'Behold the Lamb of God' (John 1:29), 'It is finished' (John 19:30)\n\n2. READ IT SLOWLY—PHRASE BY PHRASE:\n• Break the verse into bite-sized pieces\n• Example: Psalm 23:1 → 'The LORD' (pause) → 'is MY shepherd' (pause)\n• Linger on each word/phrase for 30-60 seconds\n• Ask: What does THIS word mean? Why THIS word here?\n\n3. BREATHE & PRAY WITH IT:\n• INHALE while reading the first half; EXHALE while reading the second half\n• Example: [INHALE] 'The LORD is my shepherd' [EXHALE] 'I shall not want'\n• Let the rhythm of breathing slow you down and focus your attention\n• Pray each phrase: 'Lord, YOU are my shepherd—not my job, not my success. Help me believe this.'\n\n4. VISUALIZE IT:\n• Picture the scene if it's narrative (Jesus on the cross, shepherd with sheep)\n• If it's abstract, imagine what it MEANS (e.g., 'grace' = undeserved gift from God's hand)\n• Engage imagination to make it vivid and memorable\n\n5. REPEAT IT 10-20 TIMES:\n• Say it aloud (or whisper) repeatedly\n• Don't rush—each repetition is a chance to notice something new\n• Ancient practice: Repeat until it becomes 'sweet in your mouth' (Ps 119:103)\n\n6. JOURNAL ONE DISTILLED TRUTH:\n• After marinating, write 1-2 sentences capturing the ONE truth you'll carry today\n• Make it personal and actionable\n• Example: 'I will remember today that the LORD—not my circumstances—is my shepherd. When anxiety rises, I'll repeat: 'The LORD is my shepherd.''\n\nKEY PRINCIPLES:\n• LESS IS MORE: Better to meditate deeply on one verse than skim ten chapters\n• REPETITION EMBEDS: Neurons that fire together wire together—repetition creates spiritual muscle memory\n• SLOW DOWN: The Meditation Room is the opposite of hurried Bible reading\n• RETURN THROUGHOUT THE DAY: Set phone reminders to repeat your verse at lunch, evening, bedtime\n• NO PRESSURE TO 'FEEL': Meditation is about DISCIPLINE, not emotion—some days it feels rich, other days it's just obedience",
        examples: [
          "Psalm 23:1 ('The LORD is my shepherd, I shall not want'):\nPHRASE-BY-PHRASE: 'The LORD' (not a concept, but Yahweh—covenant-keeping God) → 'is MY shepherd' (personal relationship, not distant deity) → 'I shall not' (future certainty) → 'want' (lack, need—He supplies)\nBREATHE: [INHALE] 'The LORD is my shepherd' [EXHALE] 'I shall not want' (repeat 10 times)\nVISUALIZE: Shepherd's staff in strong hand, sheep calm and provided for, no panic\nDISTILLED TRUTH: When anxiety about provision strikes today, I'll whisper 'The LORD is my shepherd'—reminding myself He supplies what I truly need.",
          
          "John 19:30 ('It is finished'):\nPHRASE-BY-PHRASE: 'It' (what? The work of atonement) → 'is finished' (past tense, completed, not ongoing)\nBREATHE: [INHALE] 'It is' [EXHALE] 'finished' (repeat 15 times, letting the finality sink in)\nVISUALIZE: Jesus' head bowing, final breath, debt paid in full, no more required\nDISTILLED TRUTH: I will remember today that salvation is FINISHED—I don't add to it by performance. When guilt rises, I'll hear Jesus' voice: 'It is finished.'",
          
          "Lamentations 3:22-23 ('His mercies are new every morning'):\nPHRASE-BY-PHRASE: 'His mercies' (plural, abundant) → 'are new' (fresh, not recycled) → 'every morning' (daily reset, not just once)\nBREATHE: [INHALE] 'His mercies are new' [EXHALE] 'every morning' (repeat 12 times)\nVISUALIZE: Sunrise, fresh bread on the table, yesterday's failures left in yesterday\nDISTILLED TRUTH: Each morning this week, I'll speak this verse aloud before checking my phone—reminding myself that God's grace resets daily, and I don't carry yesterday's guilt into today."
        ],
        pitfalls: [
          "RUSHING: Treating this like a checklist ('OK, repeated it 5 times, done!')—slow down",
          "MULTI-TASKING: Meditating while scrolling social media, watching TV, etc.—this requires focused attention",
          "NOVELTY ADDICTION: Constantly switching to 'new' verses instead of dwelling on one until it sinks deep",
          "SKIPPING REPETITION: Reading once and moving on—repetition is the POINT",
          "NO FOLLOW-THROUGH: Meditating in the morning, then never returning to the verse throughout the day"
        ],
        deliverable: "Meditation Line (1-2 sentences): The verse/phrase meditated on → The ONE distilled truth you'll carry today → Plan for returning to it throughout the day"
      },
      {
        id: "srm",
        name: "Speed Room",
        tag: "SRm",
        purpose: "The Speed Room is the pressure-cooker—it trains you to RETRIEVE biblical knowledge INSTANTLY under time constraints, simulating the real-world demands of teaching, evangelism, counseling, and debate. You might have spent hours in the Story Room, Observation Room, and Christ Room carefully studying a passage. But can you ACCESS that knowledge in 30 seconds when someone asks a question? The Speed Room builds RECALL REFLEXES: rapid-fire recall of Christ-links, verse locations, typologies, timelines, and theological connections. This isn't about frantic stress; it's about FLUENCY. A jazz musician practices scales slowly, then plays them at speed until they're instinctive. Similarly, the Speed Room takes your careful Palace work and trains you to deploy it rapidly. Without this room, your knowledge stays THEORETICAL; with it, your knowledge becomes USABLE.",
        coreQuestion: "Can I produce this biblical knowledge accurately and rapidly under time pressure?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. CHOOSE A SPRINT TYPE:\n• CHRIST-LINK SPRINT: Name X Christ-connections in Y seconds (e.g., '10 Christ-links in Genesis in 3 minutes')\n• VERSE LOCATION SPRINT: Rapid-fire book/chapter recall (e.g., 'Where is the Armor of God?' → 'Ephesians 6' in 5 seconds)\n• TYPOLOGY SPRINT: List OT types and NT fulfillments (e.g., '5 Passover → Christ parallels in 2 minutes')\n• TIMELINE SPRINT: Arrange events chronologically (e.g., 'Order these 10 OT events' in 90 seconds)\n• DANIEL MACRO SPRINT: Recite Daniel 2-7 kingdom sequence in 60 seconds\n• 'I AM' SPRINT: Name all 7 'I AM' statements in John in 30 seconds\n\n2. SET THE TIMER:\n• Use a stopwatch or timer app\n• Start with generous time limits (e.g., 5 minutes), then reduce as you improve (down to 30-60 seconds)\n• The goal is SPEED + ACCURACY, not just speed\n\n3. EXECUTE THE SPRINT:\n• Write or speak your answers as fast as you can\n• No looking up verses—this tests RECALL, not research\n• If you blank, move on—don't waste time stuck\n\n4. SCORE YOURSELF:\n• ACCURACY: Did you get it right? (1 point per correct answer)\n• COMPLETENESS: Did you hit the target number? (e.g., asked for 10, gave 10)\n• SPEED: Did you finish within the time limit?\n\n5. IDENTIFY WEAK SPOTS:\n• Where did you blank? → Go back to the Observation/Story/Christ rooms and reinforce\n• What took too long? → Drill that area specifically\n• What did you get wrong? → Correct it immediately\n\n6. REPEAT WITH TIGHTER TIME LIMITS:\n• Once you can do it in 3 minutes, try 2 minutes\n• Once you can do it in 2 minutes, try 1 minute\n• Goal: FLUENCY, not just completion\n\nKEY PRINCIPLES:\n• SPEED WITHOUT ACCURACY IS USELESS—prioritize correctness first, then speed\n• REPETITION BUILDS FLUENCY—do the same sprint multiple times until it's automatic\n• SIMULATE REAL SCENARIOS: Imagine someone just asked you this question in a Bible study—could you answer?\n• SPRINTS EXPOSE GAPS: Use them diagnostically to find what you DON'T know\n• DON'T BURN OUT: Speed Room is intense—do 5-10 minute sessions, not hour-long marathons",
        examples: [
          "SPRINT: Name 5 'I AM' statements in John's Gospel in 30 seconds.\nATTEMPT: 'I am the bread of life' (John 6:35), 'I am the light of the world' (John 8:12), 'I am the door' (John 10:9), 'I am the good shepherd' (John 10:11), 'I am the resurrection and the life' (John 11:25).\nSCORE: 5/7 correct (missed 'I am the way, truth, life' and 'I am the true vine'). TIME: 28 seconds. PASS.\nWEAK SPOT: Need to drill John 14-15 'I AM' statements.",
          
          "SPRINT: Recite Daniel's four kingdom sequence (Daniel 2 & 7) in 60 seconds.\nATTEMPT: 'Babylon = gold head / lion; Medo-Persia = silver chest / bear; Greece = bronze belly / leopard; Rome = iron legs / terrible beast with 10 horns; then Christ's kingdom = stone / Son of Man receives dominion.'\nSCORE: 100% accurate. TIME: 52 seconds. PASS.\nREFLECTION: Solid recall—ready to teach this anytime.",
          
          "SPRINT: List 10 Christ-links in Genesis in 3 minutes.\nATTEMPT: 1) Gen 3:15 Seed crushes serpent. 2) Gen 22 Isaac bound, ram provided. 3) Gen 49:10 Shiloh from Judah. 4) Gen 5 genealogy traces Messiah's line. 5) Gen 14 Melchizedek priest-king. 6) Gen 37 Joseph betrayed, becomes savior. 7) Gen 1:26 Image of God (Christ is true image). 8) Gen 2:24 One flesh (Christ+church). 9) Gen 9 Noah's ark (Christ's salvation). 10) Gen 12 Abraham's seed blesses nations.\nSCORE: 10/10. TIME: 2:45. PASS.\nREFLECTION: Could go faster—aim for 2 minutes next time."
        ],
        pitfalls: [
          "SPEED WITHOUT ACCURACY: Blurting out wrong answers just to finish fast—accuracy first, then speed",
          "NO TIME LIMIT: Practicing without a timer defeats the purpose—the constraint forces recall fluency",
          "GIVING UP: Blanking on one answer and quitting—keep going, note the gap, drill it later",
          "NEVER REVIEWING MISTAKES: Finishing the sprint and moving on without correcting errors",
          "OVERLOADING: Trying to sprint through topics you haven't studied yet—Speed Room comes AFTER foundational work"
        ],
        deliverable: "Sprint Sheet: Sprint type → Target (e.g., '10 answers in 2 min') → Your attempt → Score (accuracy + time) → Weak spots identified"
      }
    ]
  },
  {
    number: 8,
    name: "Master",
    subtitle: "Reflexive Thought",
    description: "The palace becomes invisible—it's now inside you. Teach naturally; let others identify the rooms you're using.",
    rooms: [
      {
        id: "infinity",
        name: "Reflexive Mastery",
        tag: "∞",
        purpose: "Reflexive Mastery is the Palace's ultimate goal—the moment when the structure becomes INVISIBLE because it's now wired into your instincts. You're no longer consciously thinking, 'Now I'll do Story Room, then Observation Room, then Christ Room.' Instead, you NATURALLY read Scripture through layered lenses: seeing story beats, spotting types, asking questions, finding Christ, checking genre, identifying horizons—all simultaneously and unconsciously. It's like a musician who no longer thinks about finger positions while playing; the technique has become second nature. At this level, the Palace isn't a method you USE—it's a way you THINK. Others will recognize your Phototheological approach even when you never mention the room names. The infinity symbol (∞) represents this: an endless loop where deep study becomes instinctive reflex. This is INTERNALIZATION, not mere memorization. You've moved from CONSCIOUS COMPETENCE (using the Palace deliberately) to UNCONSCIOUS COMPETENCE (the Palace IS how you see Scripture now).",
        coreQuestion: "Am I thinking Phototheologically—using the Palace's tools—without consciously naming or thinking about the rooms?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. TEST YOUR REFLEXES:\n• Choose a passage you've never formally studied\n• Teach it or preach it WITHOUT consulting your Palace notes\n• Record yourself (audio or video) OR write out your teaching outline\n• DON'T deliberately try to 'use the Palace'—just teach naturally\n\n2. POST-HOC AUDIT:\n• After teaching, go back through your recording/outline\n• TAG which rooms you used, even unconsciously\n• Ask: Did I naturally...\n  - Tell the STORY with beats? (SR)\n  - Use sensory imagination? (IR)\n  - Observe carefully? (OR)\n  - Define key words? (DC)\n  - Identify symbols/types? (ST)\n  - Ask and answer questions? (QR/QA)\n  - Show Christ? (CR/CEC)\n  - Apply multiple dimensions? (DR)\n  - Note the genre? (C6)\n  - Identify the covenant cycle? (@)\n  - Connect to the gospel? (FRt)\n\n3. IDENTIFY GAPS:\n• Which rooms did you SKIP unconsciously?\n• Example: You told the story (SR) and showed Christ (CR), but never asked genre-appropriate questions (C6)\n• Those gaps reveal where your instincts aren't yet formed—go back and drill those rooms deliberately\n\n4. REPEAT UNTIL SEAMLESS:\n• The goal is to use ALL the key rooms reflexively\n• Over time, the Palace becomes your default lens\n• You'll notice yourself thinking, 'Wait, what's the genre here?' or 'Where is Christ in this?' without trying\n\n5. TEACH NATURALLY, LET OTHERS AUDIT:\n• Have a mature student or peer listen to your teaching\n• Ask them: 'What rooms/methods do you see me using?'\n• They should be able to identify your approach without you announcing it\n• If they say, 'You naturally showed story structure, found Christ, and applied it with gospel clarity,' you're at Reflexive Mastery\n\nKEY PRINCIPLES:\n• MASTERY = INVISIBILITY: The best technique disappears into instinct\n• YOU CAN'T SHORTCUT TO ∞: Reflexive Mastery requires years of DELIBERATE practice through Floors 1-7\n• PRIDELESSNESS: Mastery is dangerous if it breeds pride—stay humble, keep learning\n• THE PALACE SERVES SCRIPTURE: The method exists to exalt the text, not to showcase your skill\n• TEACH OTHERS: One sign of mastery is that you can TEACH the Palace to newcomers clearly",
        examples: [
          "SCENARIO: You're asked to give a 10-minute devotional on Genesis 22 (Abraham and Isaac) with no prep time.\n\nYOUR NATURAL TEACHING (no conscious Palace reference):\n'Genesis 22 opens with God testing Abraham—He commands him to sacrifice Isaac, the son of promise. The story beats are stark: Command → Journey → Altar Built → Knife Raised → Angel Stops → Ram Provided. Feel the weight of that three-day journey to Moriah—every step, Abraham wrestling with obedience. But this isn't just Abraham's story; it's a preview of the Father offering His Son. Isaac carries the wood (like Christ carrying the cross), is bound on the altar (like Christ crucified), but a substitute is provided (like Christ as our substitute). The text says, 'God will provide the lamb' (Gen 22:8)—and He did, at Calvary. This tests our trust: Will we obey even when it seems God is contradicting Himself? Abraham believed God could raise the dead (Heb 11:19)—resurrection faith. We live on the other side of the resurrection, so we know the substitute HAS been provided. Therefore, hold nothing back from God—He's already held nothing back from you.'\n\nPOST-HOC AUDIT:\n✓ SR (Story Room): Told beats clearly (Command → Journey → Altar → Knife → Angel → Ram)\n✓ IR (Imagination Room): Invited listeners to 'feel the weight of the three-day journey'\n✓ ST (Symbols/Types): Identified Isaac/wood = Christ/cross typology\n✓ CR (Concentration Room): Showed Christ as the ultimate Lamb provided\n✓ QR (Questions Room): Asked the text's question: 'Will we obey?'\n✓ DR (Dimensions Room): Applied personally (trust), ecclesiologically (hold nothing back), eschatologically (resurrection faith)\n✓ C6 (Connect-6): Treated it as historical narrative with typological significance\n✓ FRt (Fruit Room): Application produced faith-response (obedience) not guilt\n\nGAPS:\n✗ Didn't explicitly mention covenant cycle (@Ab)\n✗ Didn't cite crosslinks (Heb 11:19 was mentioned but not explored)\n\nREFLECTION: Strong reflexive use of core rooms (SR, CR, DR, FRt). Need to build stronger instinct for covenant-cycle framing and cross-referencing.",
          
          "SCENARIO: A friend asks, 'What's Isaiah 53 about?'\n\nYOUR NATURAL ANSWER (2 minutes, no prep):\n'Isaiah 53 is the Suffering Servant song—written 700 years before Christ, it describes someone who is despised, rejected, wounded for our transgressions, and crushed for our iniquities. The servant is silent before his accusers, led like a lamb to slaughter, and assigned a grave with the wicked but buried with the rich. Yet after suffering, he sees the light of life—resurrection. The New Testament explicitly applies this to Jesus (Acts 8:32-35, 1 Peter 2:24). So Isaiah 53 is prophecy (PR room), pointing forward to Christ's atoning death. It's also a theodicy—it answers why the righteous suffer: the Servant bears OUR sins, not His own. This produces hope (FRt): because He bore my punishment, I go free. It's substitutionary atonement in vivid Old Testament language.'\n\nPOST-HOC AUDIT:\n✓ ST: Identified 'Suffering Servant' as a type of Christ\n✓ CR: Showed Christ fulfillment explicitly\n✓ PR: Recognized it as prophecy\n✓ QA: Answered the theodicy question ('Why does the righteous suffer?')\n✓ FRt: Applied the gospel (He bore my punishment → I'm free)\n✓ Used NT crosslinks instinctively (Acts 8, 1 Peter 2)\n\nGAPS:\n✗ Didn't note the GENRE explicitly (prophecy/poetry)\n✗ Didn't mention the HORIZON (1H exile context, 3H ultimate fulfillment)\n\nREFLECTION: Solid Christ-centered instinct. Could strengthen by habitually noting genre and horizon."
        ],
        pitfalls: [
          "FORGETTING THE FOUNDATION: Assuming you've 'arrived' and no longer need to practice Floors 1-7—mastery requires maintenance",
          "PRIDE IN MASTERY: Using your skill to show off rather than serve others and exalt Christ",
          "RIGIDITY: Forcing every teaching to fit all rooms mechanically instead of letting the text guide which lenses are needed",
          "NEVER AUDITING: Teaching naturally but never checking if you're actually using the Palace comprehensively",
          "STOP LEARNING: Mastery isn't the END—it's a new BEGINNING of deeper exploration"
        ],
        deliverable: "Recording/Outline of natural teaching + Post-Hoc Tag Audit (list which rooms you used unconsciously) + Gap Analysis (which rooms did you skip, and why?)"
      }
    ]
  }
];
