export interface Room {
  id: string;
  name: string;
  tag: string;
  purpose: string;
  coreQuestion: string;
  method: string;
  examples: string[];
  pitfalls: string[];
  deliverable: string;
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
        purpose: "The Story Room is the foundation of all biblical understanding—you cannot interpret what you cannot remember, and you cannot remember what you haven't structured. This room transforms abstract Bible events into memorable, sequential scenes that stick in your mind like movie clips. Instead of vague summaries ('David fought Goliath'), you'll crystallize each narrative into 3-7 punchy 'beats' that capture the precise action and sequence. This is where chronology becomes your non-negotiable foundation—before you can interpret Scripture, you must first know what actually happened and in what order. Think of it like this: a film director doesn't say 'some stuff happened'—they know shot 1, shot 2, shot 3. Similarly, you're training to see biblical narratives as distinct, sequential moments. By naming each beat with vivid nouns and verbs (Coat, Pit, Caravan, Prison, Palace), you're building a mental library of biblical narratives that you can instantly recall, teach, and cross-reference. Without this room, all other Palace work collapses—you can't identify types if you don't know the story; you can't answer questions if the chronology is fuzzy; you can't find Christ if you don't know the plot. The Story Room turns biblical narratives from blurry impressions into sharp, teachable sequences.",
        coreQuestion: "What exactly happened—and in what order?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. Read the narrative passage completely (a chapter, a story arc, or a complete episode)\n2. Identify 3-7 distinct 'beats' (major plot movements)—not too many (loses focus) or too few (loses detail)\n3. Name each beat with a punchy NOUN or VERB (not full sentences)\n   • Good: 'Coat' → 'Pit' → 'Caravan' → 'Prison' → 'Palace'\n   • Bad: 'Joseph receives a colorful coat from his father' (too wordy)\n4. Arrange beats chronologically using arrows (→) to show sequence\n5. Test your beat list: Can you teach this story to a child using only these beats?\n6. Write a one-line plot summary that captures the movement from first beat to last\n\nKEY PRINCIPLES:\n• Beats are like film shots—each one freezes a distinct moment\n• Use CONCRETE nouns (Altar, River, Mountain) over abstractions (Crisis, Decision)\n• Chronology is king—if you mix up the order, you've failed the room\n• The goal is MEMORABLE, not comprehensive\n• If you need more than 7 beats, you're probably covering too much ground",
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
        purpose: "The Imagination Room is where you learn to experience Scripture with your whole being, not just your intellect. God gave you an imagination as a sacred gift for encountering His Word—use it to step inside the biblical narrative with all five senses fully engaged. Feel the texture of the dusty road under Jesus' feet. Hear the crack of the whip against His back. Smell the myrrh and aloes at His burial. Taste the salt of Peter's tears. See the crimson spreading across Pilate's basin. This isn't escapism or emotionalism—it's the difference between knowing about the Red Sea crossing and feeling the cold spray on your face as walls of water tower above you. When imagination sanctifies your study, Scripture stops being a history book and becomes a living encounter. The stories burn into your emotional memory with such intensity that years later, you won't just teach the facts—you'll transport others into the experience because you've truly been there. This room trains you to ask: What does this passage feel like in my body, in my senses, in my gut? Because truth that touches only the mind will never transform the heart, but truth experienced with sanctified imagination becomes unforgettable and life-changing.",
        coreQuestion: "What does it feel like to stand there?",
        method: "Use your imagination to step fully into the biblical scene. Engage all five senses: What do you see, hear, touch, smell, and taste? Let the passage become a lived experience, not just information. Then capture in one sentence how this sensory encounter resonates with your own story.",
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
        purpose: "The 24FPS Room is your biblical GPS system—it makes every chapter of the Bible instantly findable through a single, unforgettable image. Just like a movie plays at 24 frames per second, you're creating a 'frame' (mental image) for every chapter of Scripture. The goal isn't artistic beauty or theological depth—it's INSTANT RETRIEVAL. When someone says 'Genesis 22,' you should immediately see a knife hovering over an altar. When you hear 'Psalm 23,' a shepherd's staff casting a long shadow should flash in your mind. This room solves the universal problem of biblical amnesia: you've read it, but where was it? By indexing each chapter with a quirky, sticky visual icon, you build a mental filing cabinet that lets you navigate 1,189 chapters with confidence. The image can be silly, even irreverent—what matters is that it WORKS. A birthday cake with 'Earth' written on it for Genesis 1 (creation's 'birthday') is more effective than a vague 'light and darkness.' This is memory engineering, not artistry. Once you've built your 24FPS index, you'll never again stare blankly when someone references a chapter—you'll see the image, recall the content, and engage immediately.",
        coreQuestion: "What image will make this chapter unforgettably findable?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. Read the chapter you want to index\n2. Identify the MOST MEMORABLE element (event, object, phrase, turning point)\n3. Convert that element into a SINGLE VISUAL IMAGE—preferably something concrete and striking\n4. Test the image: Does it instantly trigger the chapter content?\n5. Make it QUIRKY if needed—weird images stick better than dignified ones\n6. Record: Chapter Number → Image Description\n7. Repeat for every chapter in the book you're studying\n\nKEY PRINCIPLES:\n• Prioritize MEMORABLE over accurate\n• Use concrete objects over abstract concepts (Knife > Faith)\n• Quirky beats theological (Snake+Apple+Clock for Gen 3 is better than 'Disobedience')\n• The image should be VISUAL—you should be able to draw it (even badly)\n• One image per chapter—don't try to capture everything\n• The image is a TRIGGER, not a summary\n\nPRO TIP: Go through an entire book in one sitting to build momentum. Your 24FPS index becomes more valuable the more chapters you complete.",
        examples: [
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
        purpose: "The Bible Rendered Room gives you the ultimate macro-view—compressing all 1,189 chapters of Scripture into approximately 51 ultra-high-level frames (one symbolic glyph per 24-chapter block). If 24FPS lets you navigate individual chapters, Bible Rendered lets you see the ENTIRE biblical landscape at a glance, like viewing Earth from orbit. Each block gets a single symbolic glyph that captures the essence of that 24-chapter arc: '/' for Genesis 1-24 (divisions emerge—light/dark, waters/land, man/woman); '↑→' for Acts 1-24 (gospel goes UP to heaven, then OUT to nations). This isn't verse-by-verse study—it's aerial reconnaissance. You're training your mind to hold the WHOLE counsel of God in view, so you can see how individual passages fit into the grand narrative. Bible Rendered keeps you from getting lost in the trees by showing you the forest's shape. When you have all 51 frames memorized, you possess a mental map of redemptive history that lets you orient any passage within the larger story. This is particularly powerful for apologetics and teaching: you can sketch the entire Bible arc on a napkin using your glyphs, then zoom into specific sections as needed.",
        coreQuestion: "What single symbol captures this 24-chapter block's essence?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. Divide the Bible into 24-chapter blocks (approximately 51 blocks total)\n2. Read/review the entire 24-chapter block to identify its CENTRAL MOVEMENT or THEME\n3. Choose a SIMPLE SYMBOLIC GLYPH that captures that essence:\n   • Use symbols: /, ×, +, ↑, →, ○, △, crown, tear, sword, etc.\n   • Use single words: SEED, EXILE, KING, LAMB\n   • Use letter-combos: @Mo, 1H, 3H\n4. Assign ONE glyph per block—resist the urge to add more\n5. Write a 1-2 sentence explanation of WHY this glyph fits\n6. Build your complete 51-frame legend\n7. Memorize the sequence so you can mentally 'fly over' the Bible\n\nKEY PRINCIPLES:\n• Simplicity is power—complex glyphs defeat the purpose\n• The glyph is a COMPRESSION tool, not a comprehensive summary\n• Different people may choose different glyphs—what matters is that YOURS works for YOU\n• Once you've chosen a glyph, stick with it—consistency builds memory\n• Test yourself: Can you recite all 51 glyphs in order?",
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
        purpose: "The Translation Room is where words become pictures—where abstract biblical concepts get converted into concrete, memorable visual representations. Human brains are wired to remember images 6x better than words, yet most Bible study stays trapped in abstract language: 'God's Word is a lamp'—but what does that LOOK like? Translation Room forces you to answer that question by converting verses into icons, passages into 3-panel comics, and entire books into murals. This isn't just artistic fun—it's cognitive science applied to Scripture. When you visualize Psalm 119:105 as a glowing scroll casting light on a dark trail, you've created a mental image that will last decades. When you draw John 15's vine with branch-sockets showing broken branches and fruitful ones, you've turned theology into something you can SEE. This room is essential for teachers and preachers: your listeners will forget your three-point outline, but they'll never forget the striking visual you showed them. Translation Room trains you to think visually about every passage, asking: If this truth were a painting, a diagram, or a symbol, what would it be?",
        coreQuestion: "What does this verse/passage/book look like?",
        method: "STEP-BY-STEP METHODOLOGY (Three Levels):\n\nLEVEL 1: VERSE → ICON (Single verse becomes one memorable image)\n1. Read the verse slowly, looking for the central visual element\n2. Identify the MAIN OBJECT or ACTION the verse describes\n3. Sketch (or describe) that element as a simple icon\n4. Add ONE detail that captures the verse's uniqueness\n5. Test: Does the icon trigger the verse in your memory?\n\nLEVEL 2: PERICOPE → 3-PANEL COMIC (Passage becomes sequential visual story)\n1. Break the passage into 3 movements (beginning, middle, end)\n2. Choose the KEY IMAGE for each movement\n3. Arrange the 3 images in comic-strip panels\n4. Use arrows or simple text to show progression\n5. The comic should tell the story without words if possible\n\nLEVEL 3: BOOK → MURAL (Entire book becomes one panoramic visual)\n1. Identify the book's CENTRAL THEME or MOVEMENT\n2. Choose a single visual metaphor that spans the whole book\n3. Sketch the metaphor as a mural with clear progression left-to-right\n4. Include key moments/chapters as visual 'stations' along the mural\n5. The mural should capture the book's arc at a glance\n\nKEY PRINCIPLES:\n• Concrete beats abstract (Lamp > Truth, Vine > Relationship)\n• Simplicity beats complexity (Don't try to illustrate every detail)\n• Respect biblical metaphors—translate WHAT'S THERE, don't invent new imagery\n• Bad art is fine—memorability matters more than beauty",
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
        purpose: "The Gems Room is where you mine Scripture for rare and beautiful truths by placing 2-4 seemingly unrelated texts side by side until they suddenly illuminate each other with breathtaking clarity. Like a master jeweler combining different stones to create something more valuable than the sum of its parts, you'll discover profound connections that most readers never see. These aren't random parallels or surface similarities—they're high-leverage insights that emerge only when you dare to ask, 'What happens when I read this verse through the lens of that one?' The result is a gem: a single, crystallized truth so powerful it will preach, teach, and defend the faith for years to come.",
        coreQuestion: "What beautiful truth emerges when I combine these seemingly unrelated texts?",
        method: "Take 2-4 verses from different books/contexts; place them side by side; identify the rare truth that emerges from their combination.",
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
        purpose: "The Observation Room is where you become a biblical detective, training your eye to see what's actually on the page before rushing to interpretation. Most Bible readers commit the cardinal sin of reading INTO the text before reading OUT of it—they bring their assumptions, their theology, their sermon outline, and miss what's staring them in the face. This room forces you to SLOW DOWN and gather raw data without commentary. You're cataloging grammatical patterns, repetitions, contrasts, settings, verbs, time markers—anything observable. Why? Because interpretation built on sloppy observation is a house built on sand. By making 20-50 bullet-point observations (yes, that many), you create a massive dataset that reveals patterns you'd never see in casual reading. You'll notice that Luke 15's father 'saw...ran...kissed' (three rapid verbs showing urgency), or that Genesis 1 repeats 'And God said' ten times (oral formula pattern), or that John's Gospel uses 'believe' 98 times but 'repent' zero times. These observations become the raw material for solid interpretation. The Observation Room keeps you honest—it won't let you skip over details that don't fit your theology. If you can't list 20+ observations, you haven't looked hard enough.",
        coreQuestion: "What is there—exactly?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. Read the passage 2-3 times WITHOUT writing anything—just look\n2. Begin listing observations in bullet form (goal: 20-50 observations minimum)\n3. Use these observation categories:\n   • GRAMMAR: verb tenses, pronouns, conjunctions ('but,' 'therefore')\n   • REPETITION: words, phrases, or patterns that appear multiple times\n   • CONTRASTS: opposites, conflicts, before/after comparisons\n   • SETTING: time, place, cultural details, who's present\n   • VERBS: actions, especially unusual or forceful ones\n   • STRUCTURE: chiasms, parallel lines, turning points\n   • OMISSIONS: what's surprisingly NOT mentioned\n   • EMPHASIS: words in unusual positions, lengthy descriptions\n4. Write ONLY what you see—no 'what it means' allowed yet\n5. Number your observations (helps you hit 20+ quota)\n6. When you think you're done, read once more and find 5 more observations\n\nKEY PRINCIPLES:\n• If you interpret before observing, you'll miss crucial data\n• Obvious observations count—don't skip them because they seem trivial\n• Quantity reveals quality—the 23rd observation often unlocks the passage\n• Ask: 'What's on the page?' not 'What does it mean?'\n• Observation is a skill—you get better with practice",
        examples: [
          "Luke 15:20 observations: 1) Father SAW son while 'still a long way off' (watching), 2) Father RAN (unusual for elderly Middle Eastern patriarch), 3) Father KISSED son BEFORE son finishes confession, 4) No mention of anger or lecture, 5) Verbs are rapid-fire (saw-ran-threw-kissed), suggesting urgency, 6) Son's prepared speech gets interrupted",
          "Genesis 1 observations: 1) 'And God said' appears 10 times, 2) 'Let there be' formula repeated, 3) Each day ends with 'evening and morning,' 4) Day 7 is different—no 'evening and morning,' 5) Only humans get 'image and likeness' language, 6) Repetition of 'good' (7x), 7) Command to 'be fruitful' appears with fish, birds, and humans but not land animals"
        ],
        pitfalls: [
          "Slipping into interpretation ('this means God is gracious') instead of observation ('father ran before son confessed')",
          "Stopping too early—fewer than 20 observations means you're not done",
          "Only observing 'theological' details—notice everything (grammar, setting, etc.)",
          "Skipping 'obvious' observations—they're often the foundation for insight"
        ],
        deliverable: "Observation sheet with 20-50 numbered bullet points listing only what you directly see in the text",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "dc",
        name: "Def-Com Room",
        tag: "DC",
        purpose: "The Def-Com Room stands for Definition-Commentary—the twin pillars of responsible Bible study. This is where you nail down what words ACTUALLY meant in the original language and cultural context, then consult the wisdom of faithful interpreters who've gone before you. Too many Bible students either ignore word meanings entirely (reading English as if it were Greek/Hebrew) or treat commentaries like infallible authorities that can't be questioned. Def-Com trains you to do both tasks properly: define 3-5 key terms using lexicons and study tools (What did ἀγαπάω vs. φιλέω mean to a first-century Greek speaker?), then engage 2-3 trusted commentaries to see how scholars have understood the passage—without letting them overrule Scripture itself. Cultural notes are crucial here: when Jesus offers 'eye-salve' to Laodicea, you need to know that city was FAMOUS for Phrygian eye medicine—suddenly the rebuke has teeth. The goal is informed interpretation: you're standing on the shoulders of giants (commentators) while keeping your feet planted in the text itself. Def-Com keeps you from reinventing the wheel or falling into interpretive novelty while also preventing you from slavishly accepting commentary without verification.",
        coreQuestion: "What did the words mean THEN in THAT world, and what have faithful scholars observed?",
        method: "STEP-BY-STEP METHODOLOGY:\n\nPART 1: DEFINITIONS (3-5 key terms)\n1. Identify 3-5 crucial words in your passage that carry theological or cultural weight\n2. Look up each word in:\n   • Strong's Concordance (with Greek/Hebrew numbers)\n   • Lexicon (Thayer's, BDAG, BDB)\n   • Bible dictionary for cultural background\n3. Record: Original word + transliteration + Strong's number + definition + usage note\n4. Note any significant translation differences (e.g., 'love' in English covers both agapē and phileō)\n\nPART 2: CULTURAL NOTES (1-2 details)\n1. Research the historical/cultural setting of your passage\n2. Identify 1-2 details that would be obvious to original hearers but obscure to modern readers\n3. Note the source of your cultural information\n\nPART 3: COMMENTARY (2-3 excerpts)\n1. Consult 2-3 trusted commentaries (Matthew Henry, Calvin, Spurgeon, Keil & Delitzsch, modern scholars)\n2. Choose excerpts that illuminate the text—not just repeat it\n3. LABEL each excerpt with author and source\n4. Write a brief synthesis: Where do commentators agree? Where do they differ? What insights strike you?\n\nKEY PRINCIPLES:\n• Original language > English translation when meanings diverge\n• Commentaries inform but don't replace Scripture as final authority\n• Cultural background illuminates but doesn't determine meaning\n• Compare multiple commentaries—single sources can be biased\n• Brevity in excerpts—long quotes mean you're not synthesizing",
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
        purpose: "The Symbols/Types Room is where you build God's own symbol dictionary by tracking how He uses specific images throughout Scripture—and how they all point to Christ. Unlike secular symbols that can mean anything (a heart can mean love, courage, or just the organ), biblical symbols have CONSISTENT meaning because God is their Author. When you see 'lamb' in Scripture, it carries the same sacrificial freight from Genesis 22 (ram caught in thicket) to Exodus 12 (Passover) to Isaiah 53 (led to slaughter) to John 1:29 (Behold the Lamb) to Revelation 5 (Lamb who was slain). This room trains you to trace each symbol through the canon, noting its SCOPE (where it appears), its SIGN (what it represents), and its Christ-LOCUS (how Jesus fulfills it). You're not free-associating ('water makes me think of beaches')—you're letting Scripture interpret Scripture. When you've built symbol cards for Lamb, Rock, Light, Water, Bread, Temple, Vine, Door, Shepherd, and others, you possess a theology-packed vocabulary that unlocks hundreds of passages. The Symbols/Types Room keeps you from eisegesis (reading in) by anchoring your interpretation in God's own repeated imagery. Every symbol card you create becomes a reusable interpretive tool.",
        coreQuestion: "What is this symbol's consistent biblical meaning and how does it find fulfillment in Christ?",
        method: "STEP-BY-STEP METHODOLOGY (Building a Symbol Card):\n\n1. IDENTIFY the symbol (Lamb, Rock, Light, Water, Bread, etc.)\n2. SCOPE: Track the symbol through Scripture—where does it appear?\n   • List 5-10 key texts where the symbol shows up\n   • Note if usage is consistent or if there are variations\n3. SIGN: What does the symbol consistently represent?\n   • Sacrifice? Provision? Judgment? Presence?\n   • Write a 1-sentence definition\n4. CHRIST-LOCUS: How does Jesus fulfill this symbol?\n   • Find NT passages where Christ is explicitly connected to the symbol\n   • Write 1-2 sentences on fulfillment\n5. Build your card:\n   Symbol → Scope (texts) → Sign (meaning) → Christ-locus (fulfillment)\n6. Store the card for reuse—you'll reference it in future study\n\nCOMMON BIBLICAL SYMBOLS TO MAP:\n• LAMB: Sacrifice, substitution, innocence\n• ROCK: Stability, refuge, foundation, judgment\n• LIGHT: Truth, revelation, presence, holiness\n• WATER: Life, cleansing, Spirit, Word\n• BREAD: Provision, sustenance, Word\n• TEMPLE: God's dwelling, holiness, access\n• VINE: Life source, fruitfulness, covenant relationship\n• DOOR: Access, salvation, exclusive entry\n• SHEPHERD: Care, guidance, protection, ownership\n\nKEY PRINCIPLES:\n• Let Scripture define symbols—not your imagination\n• Symbols are CONSISTENT across the canon (God is the Author)\n• Multiple texts create biblical vocabulary—single texts create speculation\n• Christ is the ultimate reality behind every type and symbol\n• Build your library over time—each card is permanent infrastructure",
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
        purpose: "The Questions Room is where you become a relentless interrogator of Scripture—because the quality of your understanding is directly proportional to the quality of your questions. Most Bible readers barely scratch the surface with weak questions like 'What does this mean to me?' This room demands three types of precision questioning that unlock exponentially deeper insight. First, INTRA-textual questions probe WITHIN the passage itself: Why does the author use 'therefore' here? Why is this genealogy placed NOW? Why does Jesus say 'woman' instead of 'mother'? Second, INTER-textual questions connect ACROSS Scripture: How does this passage relate to its Old Testament quotation? What other texts describe this same event differently? Third, PT-framework questions leverage Phototheology's infrastructure: Which cycle is this? What sanctuary element is in view? What room methodology best fits this text? By training yourself to generate 25 questions in each category (75 total when fully trained), you're creating a diagnostic tool that exposes hidden meaning. The Questions Room doesn't give answers—it mines the text for the right questions, which then become your roadmap for the Q&A Chains Room.",
        coreQuestion: "What must be asked inside the text, across texts, and in PT-framework?",
        method: "STEP-BY-STEP METHODOLOGY (Three Question Types):\n\nLEVEL 1: INTRA-TEXTUAL QUESTIONS (Within the passage—Target: 25 questions)\n1. Read the passage carefully 2-3 times\n2. Ask about STRUCTURE: Why is this arranged this way? Why does this come before that?\n3. Ask about WORD CHOICE: Why this verb instead of another? Why repeat this word?\n4. Ask about GRAMMAR: What does 'therefore' point back to? Why past tense here, present tense there?\n5. Ask about OMISSIONS: What's surprisingly NOT mentioned? What's implied but unstated?\n6. Ask about CHARACTERS: Why does this person act this way? What motivates them?\n7. Ask about SETTING: Why this location? Why this time of day/year?\n\nLEVEL 2: INTER-TEXTUAL QUESTIONS (Across Scripture—Target: 25 questions)\n1. Ask about QUOTATIONS: Where is the OT text being quoted from? How is it used in original context?\n2. Ask about PARALLELS: What other passages describe this same event? How do they differ?\n3. Ask about ALLUSIONS: What earlier biblical story is being echoed here?\n4. Ask about TYPOLOGY: What OT type is being fulfilled? How does it escalate?\n5. Ask about THEMES: Where else does this theme appear in Scripture? How does it develop?\n6. Ask about CONTRAST: What opposite example exists elsewhere in the Bible?\n\nLEVEL 3: PT-FRAMEWORK QUESTIONS (Phototheology lens—Target: 25 questions)\n1. Ask about CYCLES: Which of the 8 cycles (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re) does this fit?\n2. Ask about SANCTUARY: Does this text map to any sanctuary article or service?\n3. Ask about CHRIST: Where is Jesus here explicitly or typologically?\n4. Ask about DIMENSIONS: How does this read literally, Christologically, personally, ecclesially, eschatologically?\n5. Ask about TIME ZONES: Is this Earth-Past, Earth-Now, Earth-Future, Heaven-Past, Heaven-Now, or Heaven-Future?\n6. Ask about GENRES: What hermeneutic does this genre demand?\n7. Ask about ROOMS: Which Palace room would best unlock this text?\n\nKEY PRINCIPLES:\n• Quantity drives quality—don't stop at 5 questions; push to 25+ per category\n• Write questions in your own words—this forces engagement\n• Good questions expose what you DON'T know, not what you do\n• Some questions won't have immediate answers—that's the point\n• Questions should be SPECIFIC, not vague ('Why Jesus wept?' > 'What is this about?')",
        examples: [
          "John 11:35 ('Jesus wept') INTRA-textual: 1) Why does John use shortest verb form? 2) Why record this emotion at all? 3) Why weep if He knows resurrection coming? 4) Does the Greek tense indicate ongoing or punctiliar weeping? 5) What physical gesture accompanies weeping?",
          "John 11:35 INTER-textual: 1) How does Jesus' weeping compare to His weeping over Jerusalem (Luke 19)? 2) What other prophets wept over people? 3) How does this fit with 'Man of sorrows' (Isa 53)? 4) Does Hebrews 5:7 ('prayers and tears') connect? 5) What does Genesis teach about weeping?",
          "John 11:35 PT-framework: 1) Does this fit @CyC cycle's 'Fall' element (sharing human suffering)? 2) Which Dimension Room line: Christ's humanity (Literal/Christ dimension)? 3) Is this Earth-Now moment revealing Heaven-Now compassion? 4) How does Concentration Room read this (Christ's Office=High Priest who sympathizes)?"
        ],
        pitfalls: [
          "Stopping at surface-level questions ('What does this mean?')—go deeper",
          "Asking leading questions that assume the answer ('Doesn't this prove...')",
          "Generating fewer than 20 questions per category—you haven't pushed hard enough",
          "Writing questions that are really just statements in disguise",
          "Ignoring questions that challenge your theological assumptions",
          "Treating questions as assignments instead of genuine inquiry"
        ],
        deliverable: "Question map with three columns: INTRA-textual (25 questions) | INTER-textual (25 questions) | PT-framework (25 questions). Beginners start with 5-10 per category and work up to 25.",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "qa",
        name: "Q&A Chains Room",
        tag: "QA",
        purpose: "The Q&A Chains Room is where you let Scripture interpret Scripture by systematically answering the questions you generated in the Questions Room. This is the payoff—but you must resist the temptation to insert your opinions or commentary. Instead, you become a curator, finding 2-4 biblical cross-references that DIRECTLY address each question, then synthesizing what those texts say. The genius of Q&A Chains is that it keeps you tethered to the text: when you ask 'Why did the father run?' you don't speculate—you go to Psalm 103:13 ('As a father has compassion'), Isaiah 49:15 ('Can a mother forget?'), and Luke 15:20 itself (compassion moved him), then synthesize: 'The father ran because divine compassion cannot wait for the wanderer to finish the journey home—it sprints to close the gap.' This room builds interpretive authority because your conclusions aren't based on clever ideas but on chains of biblical evidence. It's also a powerful apologetic tool: when someone challenges your reading, you can show them the chain. Q&A Chains forces intellectual honesty—if you can't find 2-4 texts to support an answer, maybe the question needs refining or your answer is speculation.",
        coreQuestion: "Where does the Bible itself supply the answer?",
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
        purpose: "The Nature Freestyle Room trains you to see God's invisible attributes displayed in the visible creation (Romans 1:20), turning every tree, storm, river, and sparrow into a living sermon. Jesus Himself was the master of this method—He taught about faith from mustard seeds, persistence from widow's importunity, and judgment from fig trees. This room rewires your brain to walk through creation with gospel eyes, constantly asking: 'What does THIS reveal about Scripture?' The genius of NF is that it makes theology CONCRETE and MEMORABLE. When you link oak trees to Psalm 1 (deep roots in God's Word), you'll never walk past an oak again without remembering that lesson. You're essentially creating visual memory triggers scattered throughout the natural world. Every sunset becomes a prompt to recall God's faithfulness (Lamentations 3:22-23); every storm a reminder of Christ calming chaos (Mark 4:39). This room is indispensable for teachers and parents—nature lessons stick because they're experiential, not academic. You're training to do what the Psalmist did: 'The heavens declare the glory of God' (Psalm 19:1). NF makes you bilingual: fluent in both natural revelation and special revelation, constantly translating between them.",
        coreQuestion: "What does this natural object or phenomenon teach about God's Word?",
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
        purpose: "The Personal Freestyle Room turns your biography into theology by training you to see God's authorship in your own story. Every job loss, betrayal, unexpected blessing, or season of waiting is a text God is writing—and this room teaches you to read it through the lens of Scripture. PF is NOT journaling for therapy (though it may be therapeutic); it's the discipline of placing your experiences alongside biblical narratives to discern patterns, warnings, and encouragements. When you lose a job, PF immediately asks: 'Where in Scripture do I see displacement leading to divine positioning?' (Joseph's prison→palace; David's exile→throne; Jesus' rejection→resurrection). The power of PF is twofold: First, it sanctifies your memory—instead of rehearsing grievances or boasting in victories, you're reinterpreting your past as part of God's covenant storyline. Second, it creates authentic testimony—when you can say 'I know God is faithful because I've seen Him write Psalm 23 in my medical crisis,' you're speaking from verified experience, not borrowed theology. PF trains you to preach from your scars and your joys, turning personal history into portable sermons. This is how Paul wrote: 'We were under great pressure, far beyond our ability to endure, so that we despaired of life itself... but this happened that we might not rely on ourselves but on God' (2 Cor 1:8-9). He interpreted his suffering through Scripture's lens.",
        coreQuestion: "Where is God writing biblical lessons in the events of my life?",
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
        purpose: "The Bible Freestyle Room trains your brain to instantly identify a verse's 'genetic relatives'—the verses that share its theological DNA through common words, themes, or structures. Think of it as building a mental concordance on steroids: when you hear Romans 8:28, your mind should immediately flash to Genesis 50:20, Jeremiah 29:11, and Philippians 1:6 (all about God working through chaos for good). This skill transforms you into a human cross-reference system, essential for preaching, teaching, and apologetics. BF is called 'Verse Genetics' because you're mapping family trees: some verses are BROTHERS (nearly identical twins, like 'love your neighbor' in Lev 19:18 and Matt 22:39), others are COUSINS (same theme, different angle, like John 3:16 and 1 John 4:10—both on God's love, but John 3:16 emphasizes giving the Son, 1 John 4:10 emphasizes atoning sacrifice). The more BF reps you do, the faster your recall becomes—eventually, it's reflexive. This room makes you dangerous in Bible discussions because you're never stranded on a single verse; you can always call in reinforcements. It's also a fact-checking mechanism: if you can't find ANY relatives for your interpretation, you might be misreading the verse.",
        coreQuestion: "What verses are this verse's theological 'relatives' (brothers/cousins)?",
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
        purpose: "The History/Social Freestyle Room equips you to ransack secular history, sociology, politics, and current events for gospel illustrations and biblical warnings. While Nature Freestyle mines CREATION for lessons and Personal Freestyle mines YOUR STORY, History Freestyle mines CIVILIZATION—the rise and fall of empires, cultural movements, technological shifts, and social phenomena. The goal is to become bilingual: fluent in both 'secular' history and sacred Scripture, constantly translating between them. When you study the fall of Rome, you're simultaneously studying Babylon's fall (Revelation 18) and learning that pride precedes collapse (Proverbs 16:18). When you observe the modern refugee crisis, you're seeing Ruth's story and God's care for the displaced. History Freestyle makes you a relevant preacher and teacher because you can speak to contemporary issues through a biblical lens without being merely political or cultural. It also protects you from chronological snobbery—the arrogance of thinking modern problems are unprecedented. HF trains you to say, 'This is not new; Ecclesiastes 1:9 was right—there's nothing new under the sun. Here's how Scripture addresses it.'",
        coreQuestion: "How does this secular historical event, social trend, or current phenomenon illuminate the Bible passage I'm studying?",
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
        purpose: "The Listening Room transforms passive hearing into active Scripture-linking—training you to catch theological echoes in sermons, conversations, podcasts, songs, and even secular speeches. Most people listen and forget; LR practitioners listen and CAPTURE. When someone quotes '1 Peter 4:8' loosely as 'love covers a multitude of sins,' you don't just nod—you note the verse, verify the accuracy, and extract an action step ('forgive my neighbor for yesterday's offense'). The Listening Room is your spiritual dragnet, constantly trawling for truth-fragments that float by in daily discourse. It's also a humility discipline: you're training to learn from ANYONE—not just famous preachers but coworkers, children, strangers. God can use a half-remembered hymn lyric, a pastor's throwaway comment, or a friend's offhand remark to deliver a timely word. LR makes you attentive and obedient: you don't just hear the Word; you DO it (James 1:22-25). Over time, your LR captures become a personalized devotional—a record of how God has spoken to you through others. This room also sharpens discernment: if you can't find the verse someone quoted, you learn to fact-check and protect against false teaching.",
        coreQuestion: "What verse or biblical principle does this quote, sermon point, or conversation echo—and what should I do about it?",
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
        purpose: "The Connect-6 Room prevents interpretive chaos by teaching you to read each biblical genre according to its own rules. Just as you don't read a recipe like a legal contract or a poem like a phone book, you can't read a parable like a historical narrative or prophecy like an epistle. This room identifies six major biblical genres—PROPHECY, PARABLE, EPISTLE, HISTORY, GOSPEL, and POETRY—and trains you to apply genre-appropriate hermeneutics to each. The cost of genre-blindness is massive: people allegorize parables (making every detail symbolic when Jesus intended one main point), literalize apocalyptic imagery (turning symbolic beasts into NATO countries), or moralize narratives (making every Bible story a 'do this' command). C6 teaches you to ask FIRST: 'What kind of literature am I reading?' and THEN: 'How does this genre communicate truth?' Once you master genre sensitivity, you'll stop making rookie mistakes like proof-texting from Job's friends (who were WRONG) or turning the Song of Songs into an allegory about Christ and the church (it's primarily wisdom about human love, secondarily typological).",
        coreQuestion: "What genre is this text, and what are the interpretive rules for reading that genre correctly?",
        method: "STEP-BY-STEP METHODOLOGY:\n\n1. IDENTIFY the genre of your passage:\n   • PROPHECY: Predictive or forth-telling speech from God through prophets (Isaiah, Ezekiel, Daniel, Revelation)\n   • PARABLE: Short illustrative story with one main point (Jesus' parables in Gospels)\n   • EPISTLE: Letters written to churches or individuals with doctrinal/ethical teaching (Romans, Ephesians, etc.)\n   • HISTORY/NARRATIVE: Accounts of what happened (Genesis, Exodus, Acts, Gospel narratives)\n   • GOSPEL: Unique blend of history + theology focused on Jesus' life, death, resurrection (Matthew, Mark, Luke, John)\n   • POETRY/WISDOM: Artistic, metaphorical language expressing worship, lament, or proverbial truth (Psalms, Proverbs, Job, Song of Songs)\n\n2. APPLY the genre-specific hermeneutic:\n\nPROPHECY RULES:\n   • Look for multiple horizons: near fulfillment (original audience) + far fulfillment (eschatological)\n   • Interpret symbols consistently across Scripture (don't invent meanings)\n   • Distinguish between conditional prophecies (Jonah 3) and unconditional decrees (Isaiah 53)\n   • Apocalyptic prophecy uses highly symbolic language—don't literalize everything\n\nPARABLE RULES:\n   • Identify the ONE main point—don't allegorize every detail\n   • Note the context: Why did Jesus tell THIS parable HERE?\n   • Parables often have a surprise twist that upends expectations\n   • Don't extract doctrine from parables alone—confirm with didactic texts\n\nEPISTLE RULES:\n   • Follow the argument—epistles are logical, sequential reasoning\n   • Pay attention to 'therefore'—it connects ideas\n   • Distinguish universal commands from culturally specific applications\n   • Context is king—don't rip verses from their surrounding argument\n\nHISTORY/NARRATIVE RULES:\n   • Narratives SHOW but don't always TELL—you extract principles, not commands\n   • Just because it's recorded doesn't mean it's endorsed (Abraham's lies, David's adultery)\n   • Ask: What is the AUTHOR's point in including this story?\n   • Look for patterns across multiple narratives to establish principles\n\nGOSPEL RULES:\n   • Recognize the evangelists have THEOLOGICAL agendas—they're not just reporters\n   • Compare parallel accounts to see emphasis (synoptic Gospels)\n   • Watch for fulfillment language ('that it might be fulfilled')\n   • John's Gospel is explicitly theological (John 20:31)\n\nPOETRY/WISDOM RULES:\n   • Don't literalize metaphors ('God is my rock' ≠ God is sedimentary)\n   • Parallelism is key—second line often restates, contrasts, or completes the first\n   • Wisdom is general principle, not absolute promise (Proverbs describes what's USUALLY true, not ALWAYS)\n   • Lament psalms express raw emotion—they don't always state 'correct theology' (Ps 88 ends in darkness)\n\n3. WRITE one sentence stating the genre and how it shapes your reading\n4. APPLY the interpretation using genre-appropriate methods",
        examples: [
          "Matthew 13:44 (Parable of Hidden Treasure): GENRE=Parable. RULE: Look for one main point, don't allegorize details. INTERPRETATION: The kingdom of heaven is worth sacrificing everything to obtain—the man's joy in finding the treasure shows the kingdom isn't a burden but a prize. DON'T allegorize: 'the field = the world, the man = Jesus buying the church'—that's not the point; the point is the kingdom's surpassing value.",
          
          "Genesis 22 (Abraham and Isaac): GENRE=Historical Narrative. RULE: Narratives show, don't tell; extract principles from the author's emphasis. INTERPRETATION: God tests Abraham's faith to reveal (not create) his willingness to obey even in the unthinkable; God provides a substitute (ram), foreshadowing the ultimate substitute (Christ). DON'T moralize: 'You should sacrifice your kids if God asks'—that misses the UNIQUE nature of this test and its typological purpose.",
          
          "Revelation 13 (Beast from the Sea): GENRE=Apocalyptic Prophecy. RULE: Interpret symbols using Scripture's own imagery; look for historical and eschatological horizons. INTERPRETATION: The beast represents persecuting political power (historically Rome, eschatologically Antichrist); seven heads = empires; ten horns = kings; blasphemous names = self-deification. DON'T force: 'The seven heads are the G7 nations'—that's newspaper exegesis, not biblical hermeneutics.",
          
          "Proverbs 22:6 ('Train up a child...'): GENRE=Wisdom Literature. RULE: Proverbs state general patterns, not absolute guarantees. INTERPRETATION: Godly parenting usually (not always) results in godly children—this is wisdom, not a mechanical promise. DON'T weaponize: 'If your adult child is wayward, you failed'—that misreads genre and ignores human agency."
        ],
        pitfalls: [
          "TREATING PARABLES LIKE ALLEGORIES: Allegorizing every detail instead of finding the one main point",
          "LITERALIZING APOCALYPTIC PROPHECY: Turning symbolic beasts and numbers into literal geopolitical entities",
          "MORALIZING NARRATIVES: Making every story a 'do/don't do this' command",
          "FLATTENING POETRY: Treating metaphor as literal description",
          "IGNORING ARGUMENT FLOW IN EPISTLES: Proof-texting single verses without context",
          "EXTRACTING DOCTRINE FROM WISDOM without checking didactic texts: Wisdom describes patterns, not promises"
        ],
        deliverable: "Genre tag (Prophecy/Parable/Epistle/History/Gospel/Poetry) + 1-2 sentences on how the genre shapes interpretation + specific application of genre rules to the passage"
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
        purpose: "Locate the text in Heaven/Earth × Past/Now/Future (6 zones).",
        coreQuestion: "Where does this event sit in God's timeline?",
        method: "Choose 1–2 zones and justify: Earth-Past, Earth-Now, Earth-Future, Heaven-Past, Heaven-Now, Heaven-Future.",
        examples: ["Ex 12 → Earth-Past; Heb 9 → Heaven-Now; Rev 21 → Heaven-Future"],
        pitfalls: ["Confusing near/far fulfillments"],
        deliverable: "TZ tag + one sentence"
      },
      {
        id: "prm",
        name: "Patterns Room",
        tag: "PRm",
        purpose: "Hear recurring motifs.",
        coreQuestion: "What pattern repeats across Scripture?",
        method: "Name the motif; show 2–3 appearances.",
        examples: ["Wilderness testing: Israel, Elijah, Jesus"],
        pitfalls: ["Invented patterns with thin evidence"],
        deliverable: "Pattern card"
      },
      {
        id: "p||",
        name: "Parallels Room",
        tag: "P‖",
        purpose: "Compare mirrored actions across eras.",
        coreQuestion: "What event echoes this one?",
        method: "Event A ↔ Event B → what echoes, what escalates.",
        examples: ["David vs Goliath ↔ Jesus vs Death (victory over giant enemy)"],
        pitfalls: ["Calling a type a parallel or vice versa"],
        deliverable: "Parallel note"
      },
      {
        id: "frt",
        name: "Fruit Room",
        tag: "FRt",
        purpose: "Character test of interpretation.",
        coreQuestion: "What fruit does this reading produce?",
        method: "Name fruit produced; revise if it breeds pride/fear/despair.",
        examples: ["Does it produce humility, faith, hope, love?"],
        pitfalls: ["Defending an interpretation that wounds the hearer"],
        deliverable: "Fruit check line"
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
        purpose: "Use God's blueprint to organize doctrine and story.",
        coreQuestion: "Which sanctuary article/service does this map to?",
        method: "Articles: Gate, Altar, Laver, Lampstand, Table, Incense, Veil, Ark. Services: Daily, Atonement. Map passage to article; state Christ's fulfillment.",
        examples: ["Ex 12 → Altar (sacrifice); Heb 9 → Most Holy (judgment hour)"],
        pitfalls: ["Treating furniture as mere metaphor"],
        deliverable: "Article tag + proof texts"
      },
      {
        id: "pr",
        name: "Prophecy Room",
        tag: "PR",
        purpose: "Read Daniel–Revelation historically (repeat & enlarge).",
        coreQuestion: "What does this prophetic symbol represent?",
        method: "Identify symbol → check time-line → align with parallel vision.",
        examples: ["Daniel 2 statue || Daniel 7 beasts || Revelation 13"],
        pitfalls: ["Newspaper exegesis", "Ignoring earlier horizons"],
        deliverable: "Prophetic map line"
      },
      {
        id: "3a",
        name: "Three Angels Room",
        tag: "3A",
        purpose: "Integrate doctrine with mission (Rev 14:6–12).",
        coreQuestion: "How does this text proclaim the everlasting gospel?",
        method: "1st Angel: Gospel, Worship/Creation, Judgment. 2nd Angel: Babylon's fall. 3rd Angel: Beast/Image/Mark warning; Saints' endurance.",
        examples: ["Ex 20 (Sabbath) → 1st Angel: worship the Creator"],
        pitfalls: ["Abstracting 3A from Jesus and the gospel"],
        deliverable: "3A alignment lines"
      },
      {
        id: "fe",
        name: "Feasts Room",
        tag: "FE",
        purpose: "Place texts in Israel's redemptive calendar.",
        coreQuestion: "Which feast does this fulfill or foreshadow?",
        method: "Feasts: Passover, Unleavened Bread, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles. Choose feast; explain fit; link to Christ.",
        examples: ["Ex 12 → Passover; Acts 2 → Pentecost; Lev 16 → Day of Atonement"],
        pitfalls: ["Forcing every text into DOA", "Ignoring Pentecost's mission arc"],
        deliverable: "Feast tag + rationale"
      },
      {
        id: "cec",
        name: "Christ in Every Chapter",
        tag: "CEC",
        purpose: "Make Christ explicit in every chapter of a book.",
        coreQuestion: "How is Jesus present in this chapter?",
        method: "CEC-Name: Christ title/role. CEC-Act: What He does. CEC-Crosslink: 1–2 confirming texts.",
        examples: ["Gen 3: Name=Seed of woman; Act=Crushes serpent; Crosslink=Rom 16:20, Rev 12:9"],
        pitfalls: ["Vague 'God in general' instead of concrete Christ-line"],
        deliverable: "Three-line CEC note per chapter"
      },
      {
        id: "r66",
        name: "Room 66",
        tag: "R66",
        purpose: "Drive one theme across all 66 books.",
        coreQuestion: "How does this theme develop from Genesis to Revelation?",
        method: "66-row grid → Book • Claim (≤14 words) • Proof-Text • PT-Tags. Then: 100–120 word OT→NT synthesis.",
        examples: ["Theme: The Lamb. Gen 3=Promise; Ex 12=Substitute; John 1=Behold; Rev 5=Worthy"],
        pitfalls: ["Overlong claims", "Soft proof-texts"],
        deliverable: "R66 grid + Constellation"
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
        purpose: "Assign redemptive-historical horizon.",
        coreQuestion: "Which horizon does this prophecy/promise address?",
        method: "1H: Babylon/return (Cyrus, post-exilic). 2H: 70 AD, 'this generation,' church as temple. 3H: Global, final judgment/new creation.",
        examples: ["Isa 65 new heavens → 1H (return from exile), 3H (new creation)"],
        pitfalls: ["Flattening all 'new heavens/earth' into 3H"],
        deliverable: "Horizon tag + defense"
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
        purpose: "Squeeze an entire book through multiple rooms for high-pressure synthesis.",
        coreQuestion: "What is the essence of this book through the palace lens?",
        method: "SR → IR → 24 → TR → OR/DC → ST/QR/QA → CR/DR/C6/TRm/TZ/PRm/P‖/FRt → BL/PR/3A/FE → @cycle + horizon → 150-word 'juice.'",
        examples: ["Exodus juice: Liberation → Covenant → Sanctuary → Mission"],
        pitfalls: ["Skipping early floors", "Bloated summary"],
        deliverable: "Juice summary + final tag line"
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
        purpose: "Let the text ignite conviction/comfort.",
        coreQuestion: "What wound or hope does this text speak to?",
        method: "Read slow; name the wound/hope; pray it back.",
        examples: ["Ps 22: Feel the abandonment; then recognize Christ's cry"],
        pitfalls: ["Emotionalism without exegesis"],
        deliverable: "2–3 sentence heart record"
      },
      {
        id: "mr",
        name: "Meditation Room",
        tag: "MR",
        purpose: "Marinate in a small portion until absorbed.",
        coreQuestion: "What one truth will I carry today?",
        method: "Phrase-by-phrase, breathe/pray/visualize; journal one distilled truth.",
        examples: ["Ps 23:1 'The LORD is my shepherd' → breathe each word 10x"],
        pitfalls: ["Rushing", "Multi-tasking during meditation"],
        deliverable: "Meditation line"
      },
      {
        id: "srm",
        name: "Speed Room",
        tag: "SRm",
        purpose: "Build recall reflexes for live ministry.",
        coreQuestion: "Can I produce this knowledge under pressure?",
        method: "Timed sprints: 3 minutes → 10 Christ-links in a Gospel; 60 seconds → Daniel macro.",
        examples: ["Sprint: Name 5 'I AM' statements in John in 30 seconds"],
        pitfalls: ["Accuracy sacrificed for speed"],
        deliverable: "Sprint sheet"
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
        purpose: "Internalize the palace; stop naming rooms, keep using them.",
        coreQuestion: "Am I thinking Phototheologically without thinking about it?",
        method: "Teach a text naturally; let listeners identify the rooms used.",
        examples: ["Preach Exodus without mentioning 'SR' or 'BL,' but use all the tools"],
        pitfalls: ["Forgetting the foundation", "Pride in mastery"],
        deliverable: "Recording/outline with post-hoc tag audit"
      }
    ]
  }
];
