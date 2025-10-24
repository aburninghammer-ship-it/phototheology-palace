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
        purpose: "The Story Room transforms abstract Bible events into memorable, sequential scenes that stick in your mind like movie clips. Instead of vague summaries, you'll crystallize each narrative into 3-7 punchy 'beats' that capture the action. This is where chronology becomes your foundation—before you can interpret Scripture, you must first know what actually happened and in what order. By naming each beat with vivid nouns and verbs, you're building a mental library of biblical narratives that you can instantly recall and teach.",
        coreQuestion: "What exactly happened—and in what order?",
        method: "Break each story into 3–7 'beats' (film shots). Name each beat with a punchy noun/verb.",
        examples: [
          "Joseph: Coat → Pit → Caravan → Prison → Palace",
          "Make 5-beat sketches for Gen 37, Ex 14, 1 Sam 17, Dan 3, Mark 5"
        ],
        pitfalls: ["Commentary before chronology", "Too many beats"],
        deliverable: "Beat list + one-line plot"
      },
      {
        id: "ir",
        name: "Imagination Room",
        tag: "IR",
        purpose: "The Imagination Room invites you to step into the biblical narrative with all five senses, transforming intellectual knowledge into lived experience. Through 2-5 minute immersive exercises, you'll feel the wet sand beneath your feet at the Red Sea, smell the night air in Gethsemane, and sense the weight on your chest as Jesus prayed. This sanctified empathy burns stories into your emotional memory far deeper than mere facts ever could. When you preach or teach these passages later, you won't just recite events—you'll transport your listeners into the story because you've been there yourself.",
        coreQuestion: "What does it feel like to stand there?",
        method: "2–5 minute immersive 'step-in': engage all five senses (sights, sounds, touch, smell, taste); then write 1 sentence of personal resonance.",
        examples: [
          "Red Sea: feet in wet sand, wind in face",
          "Gethsemane: weight on chest, night air"
        ],
        pitfalls: ["Speculation beyond text", "Melodrama"],
        deliverable: "Short paragraph + one feeling word"
      },
      {
        id: "24fps",
        name: "24FPS Room",
        tag: "24",
        purpose: "Index every chapter with a single sticky image.",
        coreQuestion: "What image will make this chapter unforgettably findable?",
        method: "Choose a striking, even quirky icon per chapter (not artful—memorable).",
        examples: [
          "Genesis: 1=Birthday Cake Earth; 3=Snake+Apple-Clock; 22=Knife over Altar",
          "Psalm 23 = Shepherd's Staff casting a long path-shadow"
        ],
        pitfalls: ["Descriptive titles instead of images"],
        deliverable: "Chapter → Image table"
      },
      {
        id: "br",
        name: "Bible Rendered",
        tag: "BR",
        purpose: "Compress the Bible into ~51 macro-frames (one per 24-chapter block).",
        coreQuestion: "What block image captures this 24-chapter arc?",
        method: "Assign a symbolic glyph to each block (/, ×, crown, tear, etc.).",
        examples: [
          "Gen 1–24 = '/' (divisions emerge)",
          "Acts 1–24 = '↑→' (gospel up & out)"
        ],
        pitfalls: ["Over-explaining the glyph", "Using more than 1 per block"],
        deliverable: "51-frame legend"
      },
      {
        id: "tr",
        name: "Translation Room",
        tag: "TR",
        purpose: "Turn abstractions into concrete visuals.",
        coreQuestion: "What does this verse look like?",
        method: "Verse → icon; pericope → 3-panel comic; book → mural.",
        examples: [
          "Ps 119:105: glowing scroll lighting trail",
          "Jn 15: Vine with sockets/branches"
        ],
        pitfalls: ["Keeping text abstract", "Mixing metaphors mid-scene"],
        deliverable: "Sketches or descriptions"
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
        purpose: "Gather raw data without interpretation.",
        coreQuestion: "What is there—exactly?",
        method: "20–50 bullet observations (grammar, repetition, setting, contrasts).",
        examples: ["Luke 15: note verbs of the father ('saw, ran, kissed')"],
        pitfalls: ["Slipping into meaning", "Too few observations"],
        deliverable: "Observation sheet",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "dc",
        name: "Def-Com Room",
        tag: "DC",
        purpose: "Nail lexical/cultural meaning; consult witnesses (commentaries).",
        coreQuestion: "What did the words mean then, and what did the world look like there?",
        method: "3–5 terms to define; 1–2 cultural notes; 2–3 commentary excerpts (label source).",
        examples: [
          "John 21: ἀγαπάω (agapaō, Strong's G25 - divine, selfless love) vs φιλέω (phileō, Strong's G5368 - affectionate friendship) — Jesus asks Peter using agapaō twice, Peter responds with phileō; third time Jesus uses phileō",
          "Rev 3:18: 'eye-salve' (κολλούριον, kollourion) — Laodicea was famous for Phrygian powder eye medicine. Matthew Henry: 'Christ offers them spiritual eye-salve that they might see their own wretchedness and his grace.' Cultural note: Laodicea's lukewarm water supply came from hot springs 6 miles away, arriving neither hot nor cold"
        ],
        pitfalls: ["Letting commentary overrule Scripture"],
        deliverable: "Wordlist + notes + brief synthesis",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "st",
        name: "Symbols/Types Room",
        tag: "ST",
        purpose: "Build God's symbol dictionary and Christ-types.",
        coreQuestion: "What is this symbol's consistent meaning and Christ-fulfillment?",
        method: "Symbol card: sign → scope → Christ locus → texts.",
        examples: ["Lamb, Rock, Light, Water, Bread, Temple"],
        pitfalls: ["Free-associating symbols", "Ignoring canonical usage"],
        deliverable: "Symbol cards (reusable)",
        prerequisites: [{ floor: 1, room: "sr" }, { floor: 1, room: "tr" }]
      },
      {
        id: "qr",
        name: "Questions Room",
        tag: "QR",
        purpose: "Interrogate the text until the shape of truth appears.",
        coreQuestion: "What must be asked inside the text, across texts, and in PT-framework?",
        method: "25 intra + 25 inter + 25 PT (75x3 when fully trained).",
        examples: ["Why 'Jesus wept' if resurrection minutes away?"],
        pitfalls: ["Leading questions", "Stopping too early"],
        deliverable: "Question map",
        prerequisites: [{ floor: 1, room: "sr" }]
      },
      {
        id: "qa",
        name: "Q&A Chains Room",
        tag: "QA",
        purpose: "Let Scripture answer Scripture.",
        coreQuestion: "Where does the Bible itself supply the answer?",
        method: "For each key question, cite 2–4 cross-texts that resolve it.",
        examples: ["Why did the father run? (Ps 103:13; Lk 15)"],
        pitfalls: ["Proof-texting without context"],
        deliverable: "Answer chains (Q → refs → synthesis)",
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
        purpose: "Mine creation for parables.",
        coreQuestion: "What does this natural object teach about God's Word?",
        method: "One natural object → verse link → 1-line lesson.",
        examples: ["Oak tree's deep roots → Psalm 1 → steadfastness in trials"],
        pitfalls: ["Forcing analogies", "Ignoring context"],
        deliverable: "Daily NF log"
      },
      {
        id: "pf",
        name: "Personal Freestyle",
        tag: "PF",
        purpose: "Turn life into testimony-teaching.",
        coreQuestion: "Where is God writing lessons in my story?",
        method: "Event → parallel text → application.",
        examples: ["Job loss → Joseph's prison → trusting God's hidden plan"],
        pitfalls: ["Moralizing others' pain", "Self-centeredness"],
        deliverable: "PF journal bite"
      },
      {
        id: "bf",
        name: "Bible Freestyle",
        tag: "BF",
        purpose: "Train spontaneous cross-linking (Verse Genetics).",
        coreQuestion: "What verses are this verse's 'relatives'?",
        method: "Pick a verse; name 3–5 'relatives' (brothers/cousins).",
        examples: ["John 3:16 → Rom 5:8, 1 John 4:9-10, Eph 2:4-5"],
        pitfalls: ["Links with no shared concept/word/theme"],
        deliverable: "Genetic cluster"
      },
      {
        id: "hf",
        name: "History/Social Freestyle",
        tag: "HF",
        purpose: "Draw lessons from secular history, social studies, and current events—applying them to the gospel or text under consideration.",
        coreQuestion: "How does this secular historical event or social phenomenon illuminate the Bible passage I'm studying?",
        method: "Identify a secular event (past or present) → connect to gospel truth or specific text → extract the spiritual lesson.",
        examples: ["Fall of Rome → Rev 13-18 Babylon's fall → pride precedes collapse", "Modern refugee crisis → Ruth's immigration story → God's care for displaced", "Industrial Revolution → Tower of Babel → human ambition vs divine sovereignty"],
        pitfalls: ["Using biblical history instead of secular", "Culture reading Scripture instead of vice versa", "Political agenda over gospel truth"],
        deliverable: "HF note"
      },
      {
        id: "lr",
        name: "Listening Room",
        tag: "LR",
        purpose: "Convert what you hear into Scripture links.",
        coreQuestion: "What verse does this quote/sermon/conversation echo?",
        method: "Quote → verse → action step.",
        examples: ["'Love covers a multitude of sins' → 1 Peter 4:8 → forgive neighbor"],
        pitfalls: ["Passive listening without application"],
        deliverable: "LR capture list"
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
        purpose: "Keep Christ in the center, always.",
        coreQuestion: "Where is Jesus here?",
        method: "Name: Office/Title; Act: what He does; Benefit: to me/Church; Horizon: now/future.",
        examples: ["Ex 12: Christ=Lamb; Act=Substitutes; Benefit=Deliverance; Horizon=Final Passover"],
        pitfalls: ["Moralism without Messiah"],
        deliverable: "4-line CR note"
      },
      {
        id: "dr",
        name: "Dimensions Room",
        tag: "DR",
        purpose: "See five cuts of the same diamond.",
        coreQuestion: "How does this text speak to each dimension?",
        method: "LITERAL • CHRIST • ME • CHURCH • HEAVEN → 1–2 lines each.",
        examples: ["Ps 23: Literal=David's sheep; Christ=Good Shepherd; Me=Daily provision; Church=Pastoral care; Heaven=Eternal feast"],
        pitfalls: ["Repeating the same point across all five"],
        deliverable: "DR sheet (5 dimensions)"
      },
      {
        id: "c6",
        name: "Connect-6",
        tag: "C6",
        purpose: "Read by genre rules.",
        coreQuestion: "What genre is this, and how should I read it?",
        method: "Label: Prophecy/Parable/Epistle/History/Gospel/Poetry; apply that genre's hermeneutic.",
        examples: ["Parable: look for one central truth, not allegory for every detail"],
        pitfalls: ["Treating parables like law codes", "Flattening poetry"],
        deliverable: "Genre tag + genre-specific note"
      },
      {
        id: "trm",
        name: "Theme Room",
        tag: "TRm",
        purpose: "Place text on the Palace's structural spans.",
        coreQuestion: "Which theological span does this text primarily occupy?",
        method: "Spans: Sanctuary Wall • Life of Christ Wall • Great Controversy Wall • Time-Prophecy Wall • Gospel Floor • Heaven Ceiling. Pick primary (+ optional secondary).",
        examples: ["Ex 25-40 → Sanctuary Wall; Rev 12 → Great Controversy Wall"],
        pitfalls: ["Everything on every wall"],
        deliverable: "Span tag + rationale"
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
