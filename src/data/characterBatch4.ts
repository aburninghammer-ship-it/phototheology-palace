import type { CharacterProfile } from "./biblicalCharacterProfiles";

export const characterBatch4: CharacterProfile[] = [
  // ============================================
  // 1. HABAKKUK
  // ============================================
  {
    id: "habakkuk",
    name: "Habakkuk",
    meaning: "Embrace",
    emoji: "🔭",
    role: "Prophet who questioned God's justice",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Habakkuk 1-3"],
    archetypes: ["Prophet", "Seeker"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 4, compassion: 4, fear: 2, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Honest questioning before God",
      weakness: "Impatience with divine timing",
      mindset: "Wrestling faith that ends in worship",
      keyLesson: "Faith means trusting God even when His plan seems unjust.",
      keyVerse: "The just shall live by his faith.",
      keyVerseRef: "Habakkuk 2:4"
    },
    storyArc: "A prophet who boldly questioned God about why evil prospers and why He would use wicked Babylon to judge Judah, yet ultimately arrived at a place of radical trust and joyful worship regardless of circumstances.",
    therapyView: {
      drivingFears: ["Injustice going unpunished", "God being indifferent to suffering"],
      coreMotivations: ["Understanding God's ways", "Justice for the oppressed"],
      relationalStyle: "Honest and confrontational yet ultimately submissive",
      blindSpots: ["Demanding answers on his timeline", "Assuming God's silence means inaction"],
      healingMoments: ["God's response from the watchtower", "The final psalm of trust in chapter 3"]
    },
    strengths: ["Honest prayer", "Willingness to wait for God's answer", "Profound worship"],
    weaknesses: ["Impatience", "Questioning God's methods"],
    journey: [
      { phase: "Calling", description: "Called to prophesy during Judah's moral decline" },
      { phase: "Resistance", description: "Questioned God about why evil went unpunished" },
      { phase: "Testing", description: "Told that Babylon would be God's instrument of judgment" },
      { phase: "Refinement", description: "Waited on the watchtower for God's full answer" },
      { phase: "Legacy", description: "Declared radical faith regardless of circumstances" }
    ],
    relationships: [
      { name: "God", role: "The One he questioned and ultimately worshipped" }
    ],
    lessonsAndReflection: [
      "It is okay to bring hard questions to God.",
      "God's timing and methods are beyond human understanding.",
      "True faith rejoices even when blessings are absent."
    ],
    relatedCharacters: ["jeremiah", "zephaniah", "joel"],
    situations: [
      {
        id: "habakkuk-questioning-god",
        title: "Questioning God's Justice",
        category: "Faith Testing",
        reference: "Habakkuk 1:2-4",
        keyVerse: "O LORD, how long shall I cry, and thou wilt not hear!",
        situation: "Habakkuk saw violence, injustice, and wickedness flourishing in Judah with seemingly no divine intervention.",
        pressure: "The temptation to lose faith in a God who appeared silent and inactive.",
        innerBattle: "How can a just God tolerate evil? Why does He not answer?",
        response: "He brought his complaint honestly to God and then stationed himself on the watchtower to wait for an answer.",
        outcome: "God revealed His sovereign plan and Habakkuk responded with one of Scripture's greatest declarations of faith.",
        lesson: "Honest wrestling with God leads to deeper faith, not less.",
        traitRevealed: "Persistent faith through doubt",
        spiritualPrinciple: "God honors honest seekers who wait for His answer.",
        reflectionQuestions: [
          "Do you bring your honest doubts to God or suppress them?",
          "Can you trust God's plan even when it does not match your expectations?",
          "What does it look like to rejoice in God when circumstances are bleak?"
        ],
        dnaSnapshot: { faith: 5, courage: 4, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 2. ZEPHANIAH
  // ============================================
  {
    id: "zephaniah",
    name: "Zephaniah",
    meaning: "The LORD has hidden",
    emoji: "🌑",
    role: "Prophet of judgment and the Day of the Lord",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Zephaniah 1-3"],
    archetypes: ["Prophet"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Fearless proclamation of coming judgment",
      weakness: "Severity that could overshadow hope",
      mindset: "The Day of the Lord is near—repent",
      keyLesson: "God's judgment is real, but so is His restoring love.",
      keyVerse: "The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy.",
      keyVerseRef: "Zephaniah 3:17"
    },
    storyArc: "A royal-descended prophet who proclaimed the sweeping judgment of the Day of the Lord against Judah and the nations, yet ended with one of the most tender portraits of God rejoicing over His restored people.",
    therapyView: {
      drivingFears: ["Complacency in the face of sin", "People ignoring God's warnings"],
      coreMotivations: ["Awakening Judah to repentance", "Vindicating God's holiness"],
      relationalStyle: "Urgent and intense but ultimately tender",
      blindSpots: ["Could emphasize doom over hope", "Severity without sufficient pastoral warmth"],
      healingMoments: ["The vision of God singing over His people in 3:17"]
    },
    strengths: ["Boldness", "Theological depth", "Ability to balance judgment with hope"],
    weaknesses: ["Intensity that could alienate listeners", "Heavy focus on wrath"],
    journey: [
      { phase: "Calling", description: "Called to prophesy during King Josiah's reign" },
      { phase: "Testing", description: "Proclaimed total judgment on a complacent nation" },
      { phase: "Refinement", description: "Learned to speak of restoration alongside judgment" },
      { phase: "Legacy", description: "Left a portrait of God's fierce love that disciplines and restores" }
    ],
    relationships: [
      { name: "Josiah", role: "King during whose reign Zephaniah prophesied" },
      { name: "Hezekiah", role: "Ancestor (great-great-grandfather)" }
    ],
    lessonsAndReflection: [
      "Complacency toward sin invites judgment.",
      "God's wrath and God's love are not contradictions.",
      "Repentance opens the door to restoration."
    ],
    relatedCharacters: ["habakkuk", "jeremiah", "josiah"],
    situations: [
      {
        id: "zephaniah-day-of-lord",
        title: "Proclaiming the Day of the Lord",
        category: "Calling",
        reference: "Zephaniah 1:14-18",
        keyVerse: "The great day of the LORD is near, it is near, and hasteth greatly.",
        situation: "Judah had grown spiritually complacent, mixing idol worship with half-hearted devotion to God.",
        pressure: "Delivering a message of total judgment to people who felt secure and untouchable.",
        innerBattle: "Will anyone listen, or will they dismiss me as an alarmist?",
        response: "Zephaniah proclaimed the Day of the Lord with vivid urgency while also pointing to a remnant of hope.",
        outcome: "His message contributed to the spiritual climate that enabled Josiah's reforms.",
        lesson: "Faithful warning is an act of love, not cruelty.",
        traitRevealed: "Prophetic courage",
        spiritualPrinciple: "God warns before He judges because He desires repentance.",
        reflectionQuestions: [
          "Are there areas of spiritual complacency in your life?",
          "How do you respond to warnings—with defensiveness or openness?",
          "Can you see God's discipline as an expression of His love?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // ============================================
  // 3. HAGGAI
  // ============================================
  {
    id: "haggai",
    name: "Haggai",
    meaning: "Festive",
    emoji: "🏗️",
    role: "Prophet who urged temple rebuilding",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Haggai 1-2"],
    archetypes: ["Prophet", "Builder"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Builder",
      strength: "Practical motivation and spiritual clarity",
      weakness: "Bluntness that could feel harsh",
      mindset: "Put God's house first and He will bless you",
      keyLesson: "When we prioritize God's work, He provides for ours.",
      keyVerse: "Is it time for you, O ye, to dwell in your cieled houses, and this house lie waste?",
      keyVerseRef: "Haggai 1:4"
    },
    storyArc: "A post-exilic prophet who confronted the returned exiles for prioritizing their own homes while the temple lay in ruins, sparking a revival of building and worship.",
    therapyView: {
      drivingFears: ["God's people settling for less than His best", "Spiritual apathy"],
      coreMotivations: ["Restoring proper worship", "Honoring God with action"],
      relationalStyle: "Direct, practical, and motivating",
      blindSpots: ["Could come across as unsympathetic to real hardships", "Over-focus on external building"],
      healingMoments: ["The people's obedient response to his message", "God's promise of future glory"]
    },
    strengths: ["Practical leadership", "Clarity of message", "Ability to motivate action"],
    weaknesses: ["Bluntness", "Potential insensitivity to legitimate struggles"],
    journey: [
      { phase: "Calling", description: "Called to stir the returned exiles to rebuild the temple" },
      { phase: "Testing", description: "Confronted a discouraged people who had given up on God's house" },
      { phase: "Refinement", description: "Delivered promises of future glory to encourage the workers" },
      { phase: "Legacy", description: "The temple was completed and worship was restored" }
    ],
    relationships: [
      { name: "Zerubbabel", role: "Governor whom Haggai encouraged" },
      { name: "Joshua the High Priest", role: "Priestly leader partnering in the rebuilding" },
      { name: "Zechariah", role: "Contemporary prophet with complementary messages" }
    ],
    lessonsAndReflection: [
      "Misplaced priorities lead to spiritual emptiness.",
      "God honors obedience with His presence.",
      "Small beginnings do not disqualify future glory."
    ],
    relatedCharacters: ["zechariah-prophet", "zerubbabel", "joshua-high-priest"],
    situations: [
      {
        id: "haggai-temple-rebuilding",
        title: "Confronting Misplaced Priorities",
        category: "Calling",
        reference: "Haggai 1:2-11",
        keyVerse: "Consider your ways.",
        situation: "The returned exiles had stopped rebuilding the temple and focused on their own paneled houses while God's house lay in ruins.",
        pressure: "Confronting an entire community about their selfishness when they had legitimate economic hardships.",
        innerBattle: "Will they listen, or will they resent being called out during hard times?",
        response: "Haggai delivered God's direct challenge: consider your ways. He connected their economic struggles to their neglect of God's house.",
        outcome: "The people obeyed, resumed building, and God promised His presence and future glory.",
        lesson: "God blesses those who put His priorities first.",
        traitRevealed: "Practical prophetic boldness",
        spiritualPrinciple: "Seek first the kingdom of God and all these things shall be added unto you.",
        reflectionQuestions: [
          "What are you building that has displaced God's priorities?",
          "Have you considered whether your struggles are connected to neglecting God?",
          "What would it look like to put God's house first in your life?"
        ],
        dnaSnapshot: { faith: 5, courage: 4, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 4. ZECHARIAH (PROPHET)
  // ============================================
  {
    id: "zechariah-prophet",
    name: "Zechariah",
    meaning: "The LORD remembers",
    emoji: "🐴",
    role: "Prophet of apocalyptic visions and messianic hope",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Zechariah 1-14"],
    archetypes: ["Prophet", "Seeker"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 5, compassion: 4, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Visionary depth and messianic insight",
      weakness: "Complexity that could confuse hearers",
      mindset: "God remembers His people and will restore them through His Messiah",
      keyLesson: "God's plans span generations and always point to His Anointed One.",
      keyVerse: "Not by might, nor by power, but by my spirit, saith the LORD of hosts.",
      keyVerseRef: "Zechariah 4:6"
    },
    storyArc: "A post-exilic prophet who received eight night visions and delivered oracles that spanned from the immediate rebuilding of the temple to the coming of the Messiah and the end of the age.",
    therapyView: {
      drivingFears: ["God's people losing hope", "The future being uncertain"],
      coreMotivations: ["Revealing God's grand plan", "Encouraging the remnant"],
      relationalStyle: "Visionary and mystical yet pastorally encouraging",
      blindSpots: ["Messages so complex they could overwhelm", "Focus on the far future at expense of the present"],
      healingMoments: ["The vision of Joshua cleansed", "The promise of the Branch"]
    },
    strengths: ["Prophetic vision", "Theological depth", "Messianic clarity"],
    weaknesses: ["Complexity of message", "Abstract imagery hard to apply immediately"],
    journey: [
      { phase: "Calling", description: "Called to prophesy alongside Haggai during temple rebuilding" },
      { phase: "Testing", description: "Received complex visions requiring faith to proclaim" },
      { phase: "Refinement", description: "Learned to deliver both immediate encouragement and far-future prophecy" },
      { phase: "Legacy", description: "Provided some of the most detailed messianic prophecies in the Old Testament" }
    ],
    relationships: [
      { name: "Haggai", role: "Contemporary prophet and partner in ministry" },
      { name: "Zerubbabel", role: "Governor he encouraged" },
      { name: "Joshua the High Priest", role: "Subject of his cleansing vision" }
    ],
    lessonsAndReflection: [
      "God's Spirit accomplishes what human strength cannot.",
      "Even in small beginnings, God is working toward a grand conclusion.",
      "The Messiah was foretold with stunning precision centuries before His coming."
    ],
    relatedCharacters: ["haggai", "zerubbabel", "joshua-high-priest"],
    situations: [
      {
        id: "zechariah-night-visions",
        title: "Receiving the Eight Night Visions",
        category: "Calling",
        reference: "Zechariah 1:7-6:8",
        keyVerse: "Not by might, nor by power, but by my spirit, saith the LORD of hosts.",
        situation: "The returned exiles were discouraged, the temple was half-built, and the future seemed bleak.",
        pressure: "Communicating overwhelming supernatural visions to a weary, doubting people.",
        innerBattle: "Will they understand these visions? Will they find hope in what seems so far off?",
        response: "Zechariah faithfully recorded and proclaimed each vision, trusting God to use them.",
        outcome: "The visions provided theological backbone for the restoration and pointed to Messiah.",
        lesson: "God reveals His plans to those who listen and wait.",
        traitRevealed: "Visionary faithfulness",
        spiritualPrinciple: "God's work is accomplished by His Spirit, not human effort.",
        reflectionQuestions: [
          "Do you rely on God's Spirit or your own strength for spiritual work?",
          "How do you respond when God's plan seems too big to understand?",
          "Can you trust God's long-term promises while living in a difficult present?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 5, humility: 4 }
      }
    ]
  },
  // ============================================
  // 5. MALACHI
  // ============================================
  {
    id: "malachi",
    name: "Malachi",
    meaning: "My messenger",
    emoji: "✉️",
    role: "Last Old Testament prophet",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Malachi 1-4"],
    archetypes: ["Prophet"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Confrontational honesty about spiritual decline",
      weakness: "Harsh tone that could alienate",
      mindset: "God deserves your best, not your leftovers",
      keyLesson: "Half-hearted devotion insults God more than open rebellion.",
      keyVerse: "Bring ye all the tithes into the storehouse... and prove me now herewith, saith the LORD.",
      keyVerseRef: "Malachi 3:10"
    },
    storyArc: "The final Old Testament prophet who confronted a spiritually apathetic post-exilic community about corrupt worship, faithless marriages, and withheld tithes, then closed with the promise of Elijah's return before the great Day of the Lord.",
    therapyView: {
      drivingFears: ["Spiritual apathy becoming permanent", "God's people drifting beyond recovery"],
      coreMotivations: ["Restoring wholehearted worship", "Preparing the way for God's coming"],
      relationalStyle: "Confrontational and dialogical—uses questions to expose hypocrisy",
      blindSpots: ["Could seem more accusatory than pastoral", "Risk of driving people away rather than drawing them in"],
      healingMoments: ["The promise of the Sun of Righteousness rising with healing", "God's invitation to test Him in giving"]
    },
    strengths: ["Fearless confrontation", "Theological precision", "Dialogical preaching style"],
    weaknesses: ["Harshness", "Limited pastoral comfort"],
    journey: [
      { phase: "Calling", description: "Called to confront post-exilic spiritual decline" },
      { phase: "Testing", description: "Faced a community that argued back against God's charges" },
      { phase: "Refinement", description: "Balanced rebuke with promises of restoration and blessing" },
      { phase: "Legacy", description: "Closed the Old Testament canon and pointed forward to John the Baptist and the Messiah" }
    ],
    relationships: [
      { name: "The priests", role: "Primary targets of his rebukes" },
      { name: "Nehemiah", role: "Contemporary leader dealing with similar issues" }
    ],
    lessonsAndReflection: [
      "God sees and cares about the quality of our worship.",
      "Faithfulness in marriage reflects faithfulness to God.",
      "Generosity unlocks divine blessing."
    ],
    relatedCharacters: ["nehemiah", "haggai", "zechariah-prophet"],
    situations: [
      {
        id: "malachi-corrupt-offerings",
        title: "Confronting Corrupt Offerings",
        category: "Correction",
        reference: "Malachi 1:6-14",
        keyVerse: "Ye offer polluted bread upon mine altar.",
        situation: "The priests were offering blind, lame, and sick animals as sacrifices—the worst of their flocks instead of the best.",
        pressure: "Challenging the religious establishment about their contempt for God's altar.",
        innerBattle: "Will confronting the priests bring reform or just retaliation?",
        response: "Malachi delivered God's stinging rebuke using pointed questions to expose their hypocrisy.",
        outcome: "The prophecy stood as God's final Old Testament word, a warning and a promise.",
        lesson: "God desires excellence in worship, not leftovers.",
        traitRevealed: "Holy indignation",
        spiritualPrinciple: "What we offer God reveals what we think of Him.",
        reflectionQuestions: [
          "Are you giving God your best or your leftovers?",
          "In what ways has your worship become routine or half-hearted?",
          "How would you respond if God said He had no pleasure in your offerings?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // ============================================
  // 6. AMOS
  // ============================================
  {
    id: "amos",
    name: "Amos",
    meaning: "Burden-bearer",
    emoji: "🐂",
    role: "Shepherd turned prophet of social justice",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Amos 1-9"],
    archetypes: ["Prophet", "Shepherd"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 5, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Unflinching defense of the poor and oppressed",
      weakness: "Unpolished delivery that offended the elite",
      mindset: "God demands justice, not empty rituals",
      keyLesson: "Worship without justice is an offense to God.",
      keyVerse: "But let judgment run down as waters, and righteousness as a mighty stream.",
      keyVerseRef: "Amos 5:24"
    },
    storyArc: "A simple shepherd and fig farmer from Tekoa whom God called to prophesy against the wealthy, corrupt northern kingdom of Israel, denouncing injustice, exploitation, and hollow religion.",
    therapyView: {
      drivingFears: ["The powerful crushing the weak without consequence", "Religion being used as a cover for injustice"],
      coreMotivations: ["Justice for the oppressed", "Authentic worship of God"],
      relationalStyle: "Blunt, confrontational, and unapologetically direct",
      blindSpots: ["Could alienate those who needed his message most", "Lack of diplomatic nuance"],
      healingMoments: ["The vision of God's plumb line revealing truth", "The promise of restoration in chapter 9"]
    },
    strengths: ["Moral courage", "Compassion for the poor", "Uncompromising integrity"],
    weaknesses: ["Abrasiveness", "Lack of political tact"],
    journey: [
      { phase: "Calling", description: "Called from shepherding to prophesy to Israel" },
      { phase: "Resistance", description: "Told by Amaziah the priest to go home" },
      { phase: "Testing", description: "Continued prophesying despite opposition from the establishment" },
      { phase: "Legacy", description: "His words became a timeless standard for social justice" }
    ],
    relationships: [
      { name: "Amaziah", role: "Priest of Bethel who opposed him" },
      { name: "Jeroboam II", role: "King of Israel during his ministry" }
    ],
    lessonsAndReflection: [
      "God raises up unlikely messengers.",
      "Religious activity without justice is meaningless to God.",
      "Wealth gained through exploitation invites divine judgment."
    ],
    relatedCharacters: ["hosea", "micah", "habakkuk"],
    situations: [
      {
        id: "amos-confronting-amaziah",
        title: "Confronted by Amaziah at Bethel",
        category: "Persecution",
        reference: "Amos 7:10-17",
        keyVerse: "I was no prophet, neither was I a prophet's son; but I was an herdman.",
        situation: "Amaziah the priest ordered Amos to stop prophesying and go back to Judah.",
        pressure: "Being told to shut up by the religious establishment and accused of conspiracy.",
        innerBattle: "Do I retreat to safety or stand my ground on God's word?",
        response: "Amos declared his divine calling and delivered an even more severe prophecy against Amaziah personally.",
        outcome: "Amos's words were preserved as Scripture; Amaziah's name is remembered only in shame.",
        lesson: "God's messengers answer to God, not to human institutions.",
        traitRevealed: "Unshakeable conviction",
        spiritualPrinciple: "Obedience to God takes priority over human approval.",
        reflectionQuestions: [
          "Have you ever been silenced for speaking truth?",
          "Do you derive your authority from human institutions or from God?",
          "How do you respond when people in power try to shut you down?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // ============================================
  // 7. MICAH
  // ============================================
  {
    id: "micah",
    name: "Micah",
    meaning: "Who is like the LORD?",
    emoji: "📢",
    role: "Prophet of justice, mercy, and humility",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Micah 1-7"],
    archetypes: ["Prophet"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 4, compassion: 5, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Balanced message of justice and mercy",
      weakness: "Grief over sin could become overwhelming",
      mindset: "What does God require? Justice, mercy, humility.",
      keyLesson: "God's requirements are relational, not merely ritualistic.",
      keyVerse: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
      keyVerseRef: "Micah 6:8"
    },
    storyArc: "A rural prophet from Moresheth who denounced the exploitation of the poor by Jerusalem's elite, prophesied the fall of Samaria and Jerusalem, yet pointed to the birth of a ruler in Bethlehem and a future of peace.",
    therapyView: {
      drivingFears: ["Injustice destroying the vulnerable", "Leaders abusing their power"],
      coreMotivations: ["Defending the defenseless", "Calling people to authentic relationship with God"],
      relationalStyle: "Passionate advocate with a tender heart",
      blindSpots: ["Grief that could become despair", "Intensity that could overwhelm listeners"],
      healingMoments: ["The Bethlehem prophecy pointing to the Messiah", "The closing declaration of God's pardoning grace"]
    },
    strengths: ["Compassion for the poor", "Theological balance", "Prophetic boldness"],
    weaknesses: ["Deep grief", "Blunt confrontation"],
    journey: [
      { phase: "Calling", description: "Called from a small town to confront urban corruption" },
      { phase: "Testing", description: "Denounced powerful leaders who exploited the weak" },
      { phase: "Refinement", description: "Balanced judgment with messianic hope" },
      { phase: "Legacy", description: "Gave the world Micah 6:8 and the Bethlehem prophecy" }
    ],
    relationships: [
      { name: "Isaiah", role: "Contemporary prophet with overlapping ministry" },
      { name: "Hezekiah", role: "King during part of his ministry" }
    ],
    lessonsAndReflection: [
      "God cares deeply about how the powerful treat the powerless.",
      "True religion is justice, mercy, and humble walking with God.",
      "Even in judgment, God has a plan for redemption."
    ],
    relatedCharacters: ["amos", "isaiah", "habakkuk"],
    situations: [
      {
        id: "micah-what-god-requires",
        title: "Declaring What God Truly Requires",
        category: "Correction",
        reference: "Micah 6:6-8",
        keyVerse: "What doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
        situation: "The people thought they could appease God with elaborate sacrifices while ignoring justice and mercy.",
        pressure: "Stripping away religious pretense from people who thought they were righteous.",
        innerBattle: "Will they hear that God wants their hearts, not just their offerings?",
        response: "Micah delivered God's summary of true religion in one of the Bible's most memorable verses.",
        outcome: "The verse became a timeless standard for authentic faith and ethical living.",
        lesson: "God values character over ceremony.",
        traitRevealed: "Prophetic clarity",
        spiritualPrinciple: "Authentic worship flows from a just, merciful, and humble heart.",
        reflectionQuestions: [
          "Are you substituting religious activity for genuine justice and mercy?",
          "What does walking humbly with God look like in your daily life?",
          "Who in your sphere needs you to do justly on their behalf?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, compassion: 5 }
      }
    ]
  },
  // ============================================
  // 8. NAHUM
  // ============================================
  {
    id: "nahum",
    name: "Nahum",
    meaning: "Comfort",
    emoji: "⚡",
    role: "Prophet of God's judgment against Nineveh",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Nahum 1-3"],
    archetypes: ["Prophet"],
    dna: { faith: 5, humility: 3, courage: 5, wisdom: 4, compassion: 2, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Vivid portrayal of divine justice",
      weakness: "Little emphasis on mercy",
      mindset: "God is slow to anger but He will not acquit the wicked",
      keyLesson: "God's patience has limits; unrepentant evil will be judged.",
      keyVerse: "The LORD is slow to anger, and great in power, and will not at all acquit the wicked.",
      keyVerseRef: "Nahum 1:3"
    },
    storyArc: "A prophet from Elkosh who delivered a vivid oracle of doom against Nineveh, the Assyrian capital that had once repented under Jonah but had returned to extreme cruelty and wickedness.",
    therapyView: {
      drivingFears: ["Oppressors escaping justice", "God's people being crushed without vindication"],
      coreMotivations: ["Vindicating God's justice", "Comforting the oppressed by promising their oppressors' downfall"],
      relationalStyle: "Fierce, poetic, and uncompromising",
      blindSpots: ["Could appear to celebrate destruction", "Limited pastoral nuance"],
      healingMoments: ["The comfort that comes from knowing God will deal with oppressors"]
    },
    strengths: ["Poetic power", "Theological conviction about justice", "Courage to condemn a superpower"],
    weaknesses: ["Limited mercy emphasis", "Single-focus message"],
    journey: [
      { phase: "Calling", description: "Called to prophesy against the Assyrian empire" },
      { phase: "Testing", description: "Proclaimed doom against the most powerful nation on earth" },
      { phase: "Legacy", description: "Nineveh fell in 612 BC exactly as prophesied" }
    ],
    relationships: [
      { name: "Jonah", role: "Earlier prophet whose Nineveh ministry preceded Nahum's" }
    ],
    lessonsAndReflection: [
      "God's patience should not be mistaken for permissiveness.",
      "Oppressive empires will fall under God's judgment.",
      "Comfort comes from knowing God is just."
    ],
    relatedCharacters: ["jonah", "zephaniah", "habakkuk"],
    situations: [
      {
        id: "nahum-nineveh-doom",
        title: "Pronouncing Doom on Nineveh",
        category: "Calling",
        reference: "Nahum 1:1-8",
        keyVerse: "The LORD is slow to anger, and great in power, and will not at all acquit the wicked.",
        situation: "Nineveh, once repentant under Jonah, had returned to extreme cruelty, idolatry, and oppression.",
        pressure: "Declaring the fall of the world's most feared empire.",
        innerBattle: "Can I trust that God will really bring down this seemingly invincible power?",
        response: "Nahum delivered a vivid, poetic oracle detailing Nineveh's complete destruction.",
        outcome: "Nineveh was destroyed in 612 BC, confirming Nahum's prophecy.",
        lesson: "No power is too great for God to bring down.",
        traitRevealed: "Faith in divine justice",
        spiritualPrinciple: "God is a refuge for those who trust Him and a consuming fire for those who oppose Him.",
        reflectionQuestions: [
          "Do you trust that God will ultimately deal with injustice?",
          "How do you balance patience with a desire for justice?",
          "What oppressive situations in your life need to be entrusted to God?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 9. JOEL
  // ============================================
  {
    id: "joel",
    name: "Joel",
    meaning: "The LORD is God",
    emoji: "🦗",
    role: "Prophet of the locust plague and Spirit outpouring",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Joel 1-3"],
    archetypes: ["Prophet"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 5, compassion: 4, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Turning disaster into a call for repentance",
      weakness: "Apocalyptic urgency that could produce fear over faith",
      mindset: "Rend your hearts, not your garments",
      keyLesson: "Disaster can become a doorway to revival.",
      keyVerse: "And it shall come to pass afterward, that I will pour out my spirit upon all flesh.",
      keyVerseRef: "Joel 2:28"
    },
    storyArc: "A prophet who used a devastating locust plague as a lens to call Judah to repentance, promising both agricultural restoration and a future outpouring of God's Spirit on all flesh.",
    therapyView: {
      drivingFears: ["Missing the spiritual lesson in disaster", "People failing to repent while there is still time"],
      coreMotivations: ["National repentance", "Revealing God's heart to restore"],
      relationalStyle: "Urgent and pastoral, moving people from grief to hope",
      blindSpots: ["Urgency could breed anxiety", "Apocalyptic imagery could overwhelm"],
      healingMoments: ["The promise of the Spirit outpouring", "God's promise to restore the years the locusts have eaten"]
    },
    strengths: ["Ability to find spiritual meaning in natural disaster", "Balance of judgment and restoration", "Prophetic vision"],
    weaknesses: ["Urgency could alarm rather than comfort", "Heavy apocalyptic imagery"],
    journey: [
      { phase: "Calling", description: "Called to interpret a devastating locust plague" },
      { phase: "Testing", description: "Turned physical disaster into a spiritual wake-up call" },
      { phase: "Refinement", description: "Moved from judgment to breathtaking promises of the Spirit" },
      { phase: "Legacy", description: "His Spirit prophecy was fulfilled at Pentecost" }
    ],
    relationships: [
      { name: "Pethuel", role: "Father" }
    ],
    lessonsAndReflection: [
      "God can use disaster to awaken repentance.",
      "True repentance is of the heart, not mere outward display.",
      "God promises to restore what has been lost."
    ],
    relatedCharacters: ["amos", "habakkuk", "zephaniah"],
    situations: [
      {
        id: "joel-locust-plague",
        title: "Interpreting the Locust Plague",
        category: "Calling",
        reference: "Joel 1:1-2:17",
        keyVerse: "Rend your heart, and not your garments, and turn unto the LORD your God.",
        situation: "A catastrophic locust plague had devastated the land, destroying crops and livelihoods.",
        pressure: "Helping a traumatized nation see beyond physical loss to spiritual meaning.",
        innerBattle: "How do I help people see God's hand in this disaster without seeming callous?",
        response: "Joel called for corporate fasting, mourning, and heart-level repentance, then promised restoration.",
        outcome: "His message pointed beyond the immediate crisis to Pentecost and the outpouring of the Spirit.",
        lesson: "Every crisis is an invitation to return to God.",
        traitRevealed: "Prophetic discernment",
        spiritualPrinciple: "God restores the years the locusts have eaten when His people repent.",
        reflectionQuestions: [
          "What disasters in your life has God used to get your attention?",
          "Is your repentance of the heart or merely outward?",
          "Do you believe God can restore what has been lost?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 5, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 10. BELSHAZZAR
  // ============================================
  {
    id: "belshazzar",
    name: "Belshazzar",
    meaning: "Bel protect the king",
    emoji: "🍷",
    role: "Babylonian king who saw the writing on the wall",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["Daniel 5"],
    archetypes: ["Oppressor", "Tragic Hero"],
    dna: { faith: 0, humility: 0, courage: 1, wisdom: 1, compassion: 0, fear: 4, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "None notable—a cautionary tale",
      weakness: "Arrogance and sacrilege",
      mindset: "I am untouchable and can mock even the God of Israel",
      keyLesson: "Pride before a holy God leads to sudden destruction.",
      keyVerse: "Thou art weighed in the balances, and art found wanting.",
      keyVerseRef: "Daniel 5:27"
    },
    storyArc: "The last ruler of Babylon who threw a blasphemous feast using the sacred vessels from Jerusalem's temple, saw a divine hand write his doom on the wall, and was slain that very night when Persia conquered Babylon.",
    therapyView: {
      drivingFears: ["Losing power", "Being exposed as inadequate"],
      coreMotivations: ["Self-glorification", "Maintaining control through spectacle"],
      relationalStyle: "Grandiose and performative, needing constant affirmation",
      blindSpots: ["Total blindness to spiritual reality", "Assumed his grandfather's mistakes would not catch up to him"],
      healingMoments: ["None recorded—he was weighed and found wanting"]
    },
    strengths: ["Political position (inherited, not earned)"],
    weaknesses: ["Extreme pride", "Sacrilege", "Failure to learn from Nebuchadnezzar's humbling"],
    journey: [
      { phase: "Calling", description: "Inherited a position of power in Babylon" },
      { phase: "Failure", description: "Desecrated holy vessels in a drunken feast" },
      { phase: "Legacy", description: "Became the Bible's ultimate example of being weighed and found wanting" }
    ],
    relationships: [
      { name: "Nebuchadnezzar", role: "Grandfather whose lessons he ignored" },
      { name: "Daniel", role: "Prophet who interpreted the writing on the wall" },
      { name: "The queen mother", role: "Suggested consulting Daniel" }
    ],
    lessonsAndReflection: [
      "Failing to learn from others' mistakes invites your own downfall.",
      "Desecrating what belongs to God is the height of folly.",
      "Power without humility leads to ruin."
    ],
    relatedCharacters: ["nebuchadnezzar", "daniel", "darius-the-mede"],
    situations: [
      {
        id: "belshazzar-writing-on-wall",
        title: "The Writing on the Wall",
        category: "Power and Success",
        reference: "Daniel 5:1-30",
        keyVerse: "MENE, MENE, TEKEL, UPHARSIN.",
        situation: "Belshazzar held a great feast and deliberately used the gold and silver vessels taken from the Jerusalem temple to toast pagan gods.",
        pressure: "A mysterious hand appeared writing on the wall, and the king's knees knocked together in terror.",
        innerBattle: "Sheer terror—the sudden realization that there is a power greater than Babylon.",
        response: "He panicked, summoned wise men, then finally called Daniel who read his doom.",
        outcome: "Belshazzar was slain that very night as Persia conquered Babylon.",
        lesson: "There is a moment when God says 'enough' and the scales of justice tip.",
        traitRevealed: "Fatal pride",
        spiritualPrinciple: "God will not be mocked; what a man sows, he reaps.",
        reflectionQuestions: [
          "Are there warnings in your life you have been ignoring?",
          "Have you learned from the mistakes of those who came before you?",
          "What would it mean for you to be weighed in God's balances today?"
        ],
        dnaSnapshot: { pride: 5, greed: 5, fear: 4 }
      }
    ]
  },
  // ============================================
  // 11. DARIUS THE MEDE
  // ============================================
  {
    id: "darius-the-mede",
    name: "Darius the Mede",
    meaning: "He who upholds the good",
    emoji: "📜",
    role: "King who reluctantly threw Daniel into the lions' den",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["Daniel 6"],
    archetypes: ["King"],
    dna: { faith: 2, humility: 3, courage: 2, wisdom: 3, compassion: 3, fear: 3, pride: 3, greed: 1 },
    quickCard: {
      archetype: "King",
      strength: "Recognized Daniel's integrity and God's power",
      weakness: "Trapped by his own decree and political vanity",
      mindset: "I admire Daniel but I cannot break my own law",
      keyLesson: "Even well-meaning leaders can be manipulated when ego is involved.",
      keyVerse: "Thy God whom thou servest continually, he will deliver thee.",
      keyVerseRef: "Daniel 6:16"
    },
    storyArc: "A king who valued Daniel highly but was tricked by jealous officials into signing a decree that forced him to throw Daniel into the lions' den, then spent a sleepless night hoping Daniel's God would deliver him.",
    therapyView: {
      drivingFears: ["Being seen as weak", "Losing political authority"],
      coreMotivations: ["Maintaining order", "Preserving his reputation", "Genuine affection for Daniel"],
      relationalStyle: "Well-meaning but susceptible to flattery and manipulation",
      blindSpots: ["Vanity that made him easy to manipulate", "Inability to admit a mistake once committed"],
      healingMoments: ["Witnessing God's deliverance of Daniel", "Issuing a decree honoring Daniel's God"]
    },
    strengths: ["Recognized integrity", "Openness to God after witnessing the miracle"],
    weaknesses: ["Susceptibility to flattery", "Inability to reverse a bad decision"],
    journey: [
      { phase: "Calling", description: "Became ruler over Babylon and recognized Daniel's excellence" },
      { phase: "Failure", description: "Signed a decree out of flattery that trapped Daniel" },
      { phase: "Refinement", description: "Spent a sleepless night hoping for Daniel's God to act" },
      { phase: "Legacy", description: "Decreed that all should fear Daniel's God" }
    ],
    relationships: [
      { name: "Daniel", role: "Most trusted official whom he was forced to condemn" },
      { name: "The satraps", role: "Jealous officials who manipulated him" }
    ],
    lessonsAndReflection: [
      "Flattery is a trap that clouds judgment.",
      "Even kings are not above the consequences of foolish decisions.",
      "Witnessing God's power can change even a pagan ruler's heart."
    ],
    relatedCharacters: ["daniel", "belshazzar", "cyrus"],
    situations: [
      {
        id: "darius-lions-den",
        title: "Forced to Condemn Daniel",
        category: "Leadership Pressure",
        reference: "Daniel 6:6-23",
        keyVerse: "Thy God whom thou servest continually, he will deliver thee.",
        situation: "Jealous officials tricked Darius into signing an irrevocable decree that made prayer to anyone but the king a capital crime.",
        pressure: "Realizing he had been manipulated but unable to reverse the law of the Medes and Persians.",
        innerBattle: "I want to save Daniel but I am trapped by my own ego and legal system.",
        response: "He reluctantly threw Daniel in but expressed hope in Daniel's God, then fasted and went sleepless.",
        outcome: "God shut the lions' mouths, Daniel was vindicated, and the accusers were destroyed.",
        lesson: "Leaders must guard against flattery and think carefully before making irreversible decisions.",
        traitRevealed: "Well-meaning weakness",
        spiritualPrinciple: "God can deliver His servants even when human systems fail them.",
        reflectionQuestions: [
          "Have you ever been trapped by a hasty decision made out of pride?",
          "How susceptible are you to flattery?",
          "When you cannot fix a situation, can you trust God to intervene?"
        ],
        dnaSnapshot: { fear: 3, compassion: 3, pride: 3 }
      }
    ]
  },
  // ============================================
  // 12. CYRUS
  // ============================================
  {
    id: "cyrus",
    name: "Cyrus",
    meaning: "Sun or throne",
    emoji: "🌅",
    role: "Persian king, God's anointed deliverer",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["Isaiah 44:28-45:7", "Ezra 1:1-4", "2 Chronicles 36:22-23"],
    archetypes: ["King"],
    dna: { faith: 2, humility: 3, courage: 4, wisdom: 4, compassion: 3, fear: 1, pride: 2, greed: 2 },
    quickCard: {
      archetype: "King",
      strength: "Willing instrument of God even without full understanding",
      weakness: "Pagan ruler who did not fully know the God who called him",
      mindset: "The God of Israel has given me all kingdoms and charged me to build His house",
      keyLesson: "God can use anyone—even a pagan king—to fulfill His purposes.",
      keyVerse: "Thus saith the LORD to his anointed, to Cyrus, whose right hand I have holden.",
      keyVerseRef: "Isaiah 45:1"
    },
    storyArc: "The Persian king whom Isaiah prophesied by name 150 years before his birth, who conquered Babylon and issued a decree allowing the Jewish exiles to return and rebuild the temple.",
    therapyView: {
      drivingFears: ["Political instability", "Opposition from within the empire"],
      coreMotivations: ["Empire building", "Religious tolerance as political strategy", "Responding to something greater than himself"],
      relationalStyle: "Magnanimous and strategic",
      blindSpots: ["May not have fully understood the God who called him", "Political motives mixed with divine purpose"],
      healingMoments: ["The decree to release the exiles", "Being named God's anointed"]
    },
    strengths: ["Willingness to be used by God", "Political wisdom", "Religious tolerance"],
    weaknesses: ["Incomplete faith", "Mixed motives"],
    journey: [
      { phase: "Calling", description: "Prophesied by name in Isaiah as God's anointed shepherd" },
      { phase: "Testing", description: "Conquered Babylon and faced the choice of what to do with the exiles" },
      { phase: "Legacy", description: "Issued the decree that ended the exile and began the restoration" }
    ],
    relationships: [
      { name: "Daniel", role: "Jewish prophet serving in his court" },
      { name: "Isaiah", role: "Prophet who named him 150 years before" },
      { name: "Zerubbabel", role: "Jewish leader he sent to rebuild" }
    ],
    lessonsAndReflection: [
      "God's sovereignty extends over all nations and rulers.",
      "God can use unwitting instruments to accomplish His will.",
      "Political decisions can have profound spiritual consequences."
    ],
    relatedCharacters: ["daniel", "zerubbabel", "darius-the-mede", "artaxerxes"],
    situations: [
      {
        id: "cyrus-decree",
        title: "Issuing the Decree to Rebuild",
        category: "Leadership Pressure",
        reference: "Ezra 1:1-4",
        keyVerse: "The LORD God of heaven hath given me all the kingdoms of the earth; and he hath charged me to build him an house at Jerusalem.",
        situation: "After conquering Babylon, Cyrus faced the question of what to do with the displaced Jewish population.",
        pressure: "Balancing political strategy with an inner stirring from a God he did not fully know.",
        innerBattle: "Is this political wisdom or something deeper moving me?",
        response: "He issued a decree allowing the Jews to return, funded the temple rebuilding, and returned the sacred vessels.",
        outcome: "The exile ended, fulfilling Jeremiah's 70-year prophecy and Isaiah's naming prophecy.",
        lesson: "God moves the hearts of kings to accomplish His eternal purposes.",
        traitRevealed: "Willing instrument of providence",
        spiritualPrinciple: "The king's heart is in the hand of the LORD; He turns it wherever He wishes.",
        reflectionQuestions: [
          "Can you see God's hand in decisions made by people who do not know Him?",
          "How does God's sovereignty over nations affect your trust in Him?",
          "Are you willing to be God's instrument even if you do not fully understand His plan?"
        ],
        dnaSnapshot: { wisdom: 4, courage: 4, humility: 3 }
      }
    ]
  },
  // ============================================
  // 13. ARTAXERXES
  // ============================================
  {
    id: "artaxerxes",
    name: "Artaxerxes",
    meaning: "Possessing a kingdom of justice",
    emoji: "📋",
    role: "Persian king who sent Nehemiah to rebuild Jerusalem",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Nehemiah 2:1-8", "Ezra 7:11-26"],
    archetypes: ["King"],
    dna: { faith: 1, humility: 3, courage: 3, wisdom: 4, compassion: 3, fear: 2, pride: 3, greed: 2 },
    quickCard: {
      archetype: "King",
      strength: "Generosity and trust toward capable servants",
      weakness: "Could be swayed by political pressure",
      mindset: "I will support what I see is good and just",
      keyLesson: "God places His people in positions of influence with powerful leaders.",
      keyVerse: "The king granted me, according to the good hand of my God upon me.",
      keyVerseRef: "Nehemiah 2:8"
    },
    storyArc: "The Persian king who noticed his cupbearer Nehemiah's sadness, granted him leave to rebuild Jerusalem's walls, provided letters of safe passage, and later supported Ezra's reforms.",
    therapyView: {
      drivingFears: ["Rebellion in his provinces", "Making decisions that destabilize the empire"],
      coreMotivations: ["Stable governance", "Loyalty to trusted servants", "Order in the empire"],
      relationalStyle: "Attentive to trusted advisors, generous when persuaded",
      blindSpots: ["Dependence on courtiers' honesty", "Limited understanding of Israel's God"],
      healingMoments: ["Granting Nehemiah's bold request", "Supporting Ezra's mission"]
    },
    strengths: ["Generosity", "Attentiveness", "Willingness to empower others"],
    weaknesses: ["Political pragmatism over principle", "Susceptibility to opposing voices"],
    journey: [
      { phase: "Calling", description: "Became king of the Persian empire" },
      { phase: "Testing", description: "Faced Nehemiah's bold request to rebuild Jerusalem" },
      { phase: "Legacy", description: "His grants enabled Jerusalem's walls and worship to be restored" }
    ],
    relationships: [
      { name: "Nehemiah", role: "Trusted cupbearer he sent to rebuild Jerusalem" },
      { name: "Ezra", role: "Priest-scribe he authorized and supported" }
    ],
    lessonsAndReflection: [
      "God can give His servants favor with powerful people.",
      "Bold requests backed by prayer can move kings.",
      "Secular authority can be a tool in God's redemptive plan."
    ],
    relatedCharacters: ["nehemiah", "ezra", "cyrus"],
    situations: [
      {
        id: "artaxerxes-grants-nehemiah",
        title: "Granting Nehemiah's Request",
        category: "Leadership Pressure",
        reference: "Nehemiah 2:1-8",
        keyVerse: "The king granted me, according to the good hand of my God upon me.",
        situation: "Nehemiah, the king's cupbearer, appeared sad before the king—a potentially dangerous breach of court protocol.",
        pressure: "Deciding whether to trust a servant's emotional appeal about a distant, war-torn city.",
        innerBattle: "Is this request genuine, or could rebuilding Jerusalem threaten my empire?",
        response: "Artaxerxes asked what Nehemiah wanted, then generously granted timber, letters, and military escort.",
        outcome: "Jerusalem's walls were rebuilt in 52 days, and the city was restored.",
        lesson: "Leaders who listen to godly counsel become instruments of restoration.",
        traitRevealed: "Generous trust",
        spiritualPrinciple: "God moves through relationships and positions of influence.",
        reflectionQuestions: [
          "Do you pay attention to the burdens of those who serve you?",
          "How willing are you to use your resources to support God's work?",
          "Can you see God's hand working through unlikely people and positions?"
        ],
        dnaSnapshot: { compassion: 3, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 14. QUEEN OF SHEBA
  // ============================================
  {
    id: "queen-of-sheba",
    name: "Queen of Sheba",
    meaning: "Queen from the land of Sheba (modern Yemen/Ethiopia)",
    emoji: "💎",
    role: "Foreign queen who visited Solomon seeking wisdom",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 10:1-13", "2 Chronicles 9:1-12"],
    archetypes: ["Seeker"],
    dna: { faith: 2, humility: 3, courage: 4, wisdom: 4, compassion: 2, fear: 1, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "Intellectual curiosity and willingness to seek truth",
      weakness: "Evaluated truth primarily through material splendor",
      mindset: "I will test this king's wisdom with hard questions",
      keyLesson: "True wisdom is worth any journey to find.",
      keyVerse: "The half was not told me: thy wisdom and prosperity exceedeth the fame which I heard.",
      keyVerseRef: "1 Kings 10:7"
    },
    storyArc: "A wealthy, powerful queen who traveled a great distance to test Solomon's legendary wisdom with hard questions, found it exceeded all reports, praised the God of Israel, and exchanged lavish gifts.",
    therapyView: {
      drivingFears: ["Being deceived by false reports", "Missing something greater than her own kingdom"],
      coreMotivations: ["Pursuit of wisdom and truth", "Intellectual validation", "Strategic alliance"],
      relationalStyle: "Inquisitive, generous, and dignified",
      blindSpots: ["Equating material wealth with divine blessing", "Possible failure to fully embrace Israel's God"],
      healingMoments: ["Recognizing that Solomon's wisdom came from God", "Being overwhelmed by what she found"]
    },
    strengths: ["Intellectual courage", "Willingness to humble herself before greater wisdom", "Generosity"],
    weaknesses: ["May have evaluated truth by outward signs", "No record of lasting spiritual commitment"],
    journey: [
      { phase: "Calling", description: "Heard reports of Solomon's wisdom and felt compelled to investigate" },
      { phase: "Testing", description: "Tested Solomon with hard questions and found every answer satisfying" },
      { phase: "Legacy", description: "Jesus cited her as an example of earnest seeking" }
    ],
    relationships: [
      { name: "Solomon", role: "King whose wisdom she tested and admired" }
    ],
    lessonsAndReflection: [
      "Seeking wisdom is worth any cost or journey.",
      "True wisdom points beyond itself to God.",
      "Even outsiders can recognize divine truth when they encounter it."
    ],
    relatedCharacters: ["solomon"],
    situations: [
      {
        id: "sheba-tests-solomon",
        title: "Testing Solomon's Wisdom",
        category: "Faith Testing",
        reference: "1 Kings 10:1-9",
        keyVerse: "The half was not told me.",
        situation: "The Queen heard extraordinary reports about Solomon's wisdom and wealth and traveled a long, dangerous journey to verify them.",
        pressure: "Risking her reputation and resources on a journey that might prove the reports to be exaggerated.",
        innerBattle: "Is this real, or is it all propaganda? Is it worth the journey?",
        response: "She came, tested Solomon with her hardest questions, and honestly admitted that reality surpassed the reports.",
        outcome: "She praised the God of Israel, exchanged gifts, and returned home. Jesus later cited her as a model of earnest seeking.",
        lesson: "Those who sincerely seek truth will find more than they expected.",
        traitRevealed: "Honest seeking",
        spiritualPrinciple: "God honors those who seek Him with their whole heart.",
        reflectionQuestions: [
          "Are you willing to go to great lengths to find truth?",
          "When you encounter God's wisdom, do you acknowledge it or resist it?",
          "What hard questions do you need to bring before God?"
        ],
        dnaSnapshot: { wisdom: 4, courage: 4, humility: 3 }
      }
    ]
  },
  // ============================================
  // 15. HIRAM OF TYRE
  // ============================================
  {
    id: "hiram-of-tyre",
    name: "Hiram of Tyre",
    meaning: "Exalted brother",
    emoji: "🌲",
    role: "Phoenician king and Solomon's building partner",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 5:1-12", "2 Chronicles 2:3-16"],
    archetypes: ["Builder", "Strategist"],
    dna: { faith: 1, humility: 3, courage: 3, wisdom: 4, compassion: 2, fear: 1, pride: 2, greed: 2 },
    quickCard: {
      archetype: "Builder",
      strength: "Skilled diplomacy and resource management",
      weakness: "Motivated by trade advantage rather than faith",
      mindset: "A strong alliance benefits both kingdoms",
      keyLesson: "God uses even pagan partnerships to build His kingdom.",
      keyVerse: "Blessed be the LORD this day, which hath given unto David a wise son over this great people.",
      keyVerseRef: "1 Kings 5:7"
    },
    storyArc: "The king of Tyre who was friends with both David and Solomon, provided cedar, cypress, and skilled workers for the temple, and profited from a mutually beneficial alliance.",
    therapyView: {
      drivingFears: ["Losing trade relationships", "Being marginalized by a rising Israel"],
      coreMotivations: ["Commercial prosperity", "Strategic alliance", "Genuine friendship with Israel's kings"],
      relationalStyle: "Diplomatic, business-minded, and generous within strategic interest",
      blindSpots: ["Faith as a means to an end", "Profit motive mixed with genuine respect"],
      healingMoments: ["Acknowledging Israel's God when he praised Solomon's appointment"]
    },
    strengths: ["Diplomatic skill", "Resource management", "Reliability as an ally"],
    weaknesses: ["Commercial motivation", "No evidence of personal faith conversion"],
    journey: [
      { phase: "Calling", description: "Established a friendship and alliance with David" },
      { phase: "Testing", description: "Partnered with Solomon in the massive temple project" },
      { phase: "Legacy", description: "Contributed essential materials for the house of God" }
    ],
    relationships: [
      { name: "David", role: "Friend and earlier ally" },
      { name: "Solomon", role: "Building partner and trade ally" }
    ],
    lessonsAndReflection: [
      "God can use non-believers to accomplish His purposes.",
      "Strategic partnerships can serve divine ends.",
      "Excellence in work is a form of service, even for those outside the faith."
    ],
    relatedCharacters: ["solomon", "david"],
    situations: [
      {
        id: "hiram-temple-partnership",
        title: "Partnering in the Temple Project",
        category: "Obedience",
        reference: "1 Kings 5:1-12",
        keyVerse: "Blessed be the LORD this day, which hath given unto David a wise son.",
        situation: "Solomon requested Hiram's help in providing materials and craftsmen for building the temple.",
        pressure: "Committing massive resources to a foreign king's religious project.",
        innerBattle: "Is this alliance worth the investment, and is Israel's God real?",
        response: "Hiram rejoiced, praised God, and entered a generous partnership providing cedar and skilled labor.",
        outcome: "The temple was built with the finest materials, and both kingdoms prospered from the alliance.",
        lesson: "God orchestrates partnerships across boundaries to accomplish His work.",
        traitRevealed: "Strategic generosity",
        spiritualPrinciple: "God's building projects often require unlikely partners.",
        reflectionQuestions: [
          "Are you open to partnering with people outside your circle for God's purposes?",
          "Can you see God working through business and diplomatic relationships?",
          "What resources has God given you that could serve His kingdom?"
        ],
        dnaSnapshot: { wisdom: 4, courage: 3 }
      }
    ]
  },
  // ============================================
  // 16. BENAIAH
  // ============================================
  {
    id: "benaiah",
    name: "Benaiah",
    meaning: "The LORD has built",
    emoji: "🐻",
    role: "David's mighty warrior and Solomon's army commander",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 23:20-23", "1 Kings 1:36-38", "1 Kings 2:35"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 4, humility: 4, courage: 5, wisdom: 3, compassion: 2, fear: 0, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Warrior",
      strength: "Extraordinary courage and fierce loyalty",
      weakness: "Defined by violence and obedience rather than independent wisdom",
      mindset: "I will face any enemy, any odds, for my king",
      keyLesson: "Courage means going into the pit when others run away.",
      keyVerse: "He went down also and slew a lion in the midst of a pit in time of snow.",
      keyVerseRef: "2 Samuel 23:20"
    },
    storyArc: "One of David's most formidable warriors who killed two lion-like heroes of Moab, slew a lion in a snowy pit, struck down a giant Egyptian with his own spear, led David's bodyguard, and later served Solomon as commander of the army.",
    therapyView: {
      drivingFears: ["Failing his king", "Dishonor in battle"],
      coreMotivations: ["Loyalty to the throne", "Courage under fire", "Proving himself in impossible situations"],
      relationalStyle: "Fiercely loyal, action-oriented, and devoted",
      blindSpots: ["Could follow orders without questioning morality", "Violence as default solution"],
      healingMoments: ["Faithfully supporting Solomon's legitimate succession"]
    },
    strengths: ["Extraordinary courage", "Unwavering loyalty", "Physical prowess"],
    weaknesses: ["Obedience that could be morally blind", "Identity tied to combat"],
    journey: [
      { phase: "Calling", description: "Rose to prominence through extraordinary feats of valor" },
      { phase: "Testing", description: "Faced impossible odds—lion in a pit, giant Egyptian warrior" },
      { phase: "Refinement", description: "Faithfully served through political transitions from David to Solomon" },
      { phase: "Legacy", description: "Became commander of Solomon's army and enforced the kingdom's justice" }
    ],
    relationships: [
      { name: "David", role: "King he served as bodyguard" },
      { name: "Solomon", role: "King who promoted him to army commander" },
      { name: "Joab", role: "Predecessor as army commander whom he replaced" }
    ],
    lessonsAndReflection: [
      "True courage means confronting danger rather than fleeing from it.",
      "Faithfulness in small assignments leads to greater responsibility.",
      "Loyalty to God-appointed authority has eternal value."
    ],
    relatedCharacters: ["david", "solomon", "joab"],
    situations: [
      {
        id: "benaiah-lion-in-pit",
        title: "Killing a Lion in a Snowy Pit",
        category: "Faith Testing",
        reference: "2 Samuel 23:20",
        keyVerse: "He went down also and slew a lion in the midst of a pit in time of snow.",
        situation: "Benaiah encountered a lion in a pit during a snowfall—the most disadvantageous circumstances possible.",
        pressure: "Every natural instinct said to avoid a lion in a confined, slippery space.",
        innerBattle: "The odds are completely against me. Do I engage or retreat?",
        response: "He went down into the pit and killed the lion.",
        outcome: "This feat became legendary and contributed to his rise as David's chief bodyguard.",
        lesson: "The greatest victories come from chasing what others run from.",
        traitRevealed: "Extraordinary courage",
        spiritualPrinciple: "God honors those who face their fears rather than flee from them.",
        reflectionQuestions: [
          "What lions in your life are you avoiding instead of confronting?",
          "Are you willing to go into the pit when God calls you to fight?",
          "How has courage in small battles prepared you for larger ones?"
        ],
        dnaSnapshot: { courage: 5, faith: 4 }
      }
    ]
  },
  // ============================================
  // 17. ASAPH
  // ============================================
  {
    id: "asaph",
    name: "Asaph",
    meaning: "Gatherer",
    emoji: "🎵",
    role: "Psalmist and worship leader under David",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Chronicles 16:4-7", "Psalm 73", "Psalm 50", "Psalms 74-83"],
    archetypes: ["Priest", "Servant"],
    dna: { faith: 5, humility: 4, courage: 3, wisdom: 5, compassion: 4, fear: 2, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Priest",
      strength: "Deep worship and theological reflection",
      weakness: "Struggled with envy of the wicked",
      mindset: "Worship is where confusion meets clarity",
      keyLesson: "Entering God's presence resolves the turmoil that logic cannot.",
      keyVerse: "Until I went into the sanctuary of God; then understood I their end.",
      keyVerseRef: "Psalm 73:17"
    },
    storyArc: "A Levite worship leader appointed by David who wrote at least twelve psalms exploring themes of divine justice, corporate lament, and the resolution of doubt through worship.",
    therapyView: {
      drivingFears: ["The wicked prospering while the righteous suffer", "God seeming absent in crisis"],
      coreMotivations: ["Authentic worship", "Understanding God's justice", "Leading others into God's presence"],
      relationalStyle: "Reflective, honest, and communally oriented",
      blindSpots: ["Envy of the wicked", "Despair when circumstances contradicted theology"],
      healingMoments: ["Entering the sanctuary and gaining eternal perspective in Psalm 73"]
    },
    strengths: ["Musical and poetic gift", "Theological depth", "Honest worship"],
    weaknesses: ["Envy", "Discouragement when the wicked prospered"],
    journey: [
      { phase: "Calling", description: "Appointed by David as chief musician and worship leader" },
      { phase: "Testing", description: "Struggled with the prosperity of the wicked (Psalm 73)" },
      { phase: "Refinement", description: "Found resolution in the sanctuary of God" },
      { phase: "Legacy", description: "His psalms became permanent fixtures in Israel's worship" }
    ],
    relationships: [
      { name: "David", role: "King who appointed him as worship leader" },
      { name: "Heman", role: "Fellow musician and Levite" },
      { name: "Jeduthun", role: "Fellow musician and Levite" }
    ],
    lessonsAndReflection: [
      "Worship is the place where confusion finds clarity.",
      "It is okay to bring envy and doubt into God's presence.",
      "Eternal perspective changes how we see present injustice."
    ],
    relatedCharacters: ["david", "solomon"],
    situations: [
      {
        id: "asaph-envying-wicked",
        title: "Envying the Prosperity of the Wicked",
        category: "Temptation",
        reference: "Psalm 73",
        keyVerse: "Until I went into the sanctuary of God; then understood I their end.",
        situation: "Asaph observed that the wicked prospered while the righteous suffered, and it nearly destroyed his faith.",
        pressure: "The temptation to conclude that faithfulness to God is pointless.",
        innerBattle: "I have cleansed my heart in vain—the wicked have it better than I do.",
        response: "He entered the sanctuary and gained eternal perspective, seeing the ultimate end of the wicked.",
        outcome: "His crisis became one of Scripture's greatest testimonies to faith resolved through worship.",
        lesson: "Present appearances are deceptive; only eternity reveals the full picture.",
        traitRevealed: "Honest faith that perseveres through doubt",
        spiritualPrinciple: "The sanctuary of God is where confusion gives way to clarity.",
        reflectionQuestions: [
          "Have you ever envied the prosperity of ungodly people?",
          "Where do you go when your faith is shaken?",
          "How does eternal perspective change the way you view current injustice?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 5, humility: 4 }
      }
    ]
  },
  // ============================================
  // 18. ZADOK
  // ============================================
  {
    id: "zadok",
    name: "Zadok",
    meaning: "Righteous",
    emoji: "🏛️",
    role: "Faithful priest under David and Solomon",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 15:24-29", "1 Kings 1:38-39", "1 Chronicles 16:39"],
    archetypes: ["Priest", "Servant"],
    dna: { faith: 5, humility: 5, courage: 3, wisdom: 4, compassion: 3, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Priest",
      strength: "Unwavering faithfulness and loyalty to God's anointed",
      weakness: "Operates in the background, easily overlooked",
      mindset: "My duty is to serve God and His chosen king faithfully",
      keyLesson: "Quiet faithfulness is rewarded with lasting legacy.",
      keyVerse: "Zadok the priest took an horn of oil out of the tabernacle, and anointed Solomon.",
      keyVerseRef: "1 Kings 1:39"
    },
    storyArc: "A priest who remained loyal to David during Absalom's rebellion, faithfully carried the ark, supported Solomon's legitimate succession, and established a priestly line that served through the exile and beyond.",
    therapyView: {
      drivingFears: ["Illegitimate authority displacing God's order", "The priesthood being corrupted"],
      coreMotivations: ["Faithfulness to God's anointed", "Preserving proper worship", "Quiet obedience"],
      relationalStyle: "Steady, loyal, and unassuming",
      blindSpots: ["Could be too passive in confrontation", "Quiet loyalty might not challenge enough"],
      healingMoments: ["Anointing Solomon as king", "Being entrusted with the ark during David's flight"]
    },
    strengths: ["Rock-solid loyalty", "Priestly devotion", "Steady faithfulness"],
    weaknesses: ["Low profile could mean missed opportunities to speak up", "Passivity"],
    journey: [
      { phase: "Calling", description: "Appointed priest alongside Abiathar under David" },
      { phase: "Testing", description: "Remained loyal during Absalom's rebellion" },
      { phase: "Refinement", description: "Chose Solomon over Adonijah at the critical moment" },
      { phase: "Legacy", description: "His priestly line endured for generations, fulfilling Ezekiel's prophecy" }
    ],
    relationships: [
      { name: "David", role: "King he served faithfully" },
      { name: "Solomon", role: "King he anointed" },
      { name: "Abiathar", role: "Fellow priest who chose Adonijah and was deposed" }
    ],
    lessonsAndReflection: [
      "Quiet faithfulness often outlasts dramatic but fickle loyalty.",
      "Choosing the right side matters more than choosing the popular side.",
      "Priestly service is about faithfulness, not fame."
    ],
    relatedCharacters: ["david", "solomon", "abiathar", "adonijah"],
    situations: [
      {
        id: "zadok-absalom-rebellion",
        title: "Remaining Faithful During Absalom's Rebellion",
        category: "Betrayal",
        reference: "2 Samuel 15:24-29",
        keyVerse: "Carry back the ark of God into the city: if I shall find favour in the eyes of the LORD, he will bring me again.",
        situation: "When Absalom seized the throne and David fled Jerusalem, Zadok brought the ark to follow David.",
        pressure: "Choosing between the apparently winning side (Absalom) and the fleeing, weakened king.",
        innerBattle: "Do I flee with David or stay and protect my position under the new regime?",
        response: "Zadok followed David, then obeyed David's instruction to return the ark to Jerusalem and serve as an informant.",
        outcome: "His loyalty was vindicated when David was restored and Zadok's line continued in prominence.",
        lesson: "Loyalty to God's anointed in times of crisis reveals true character.",
        traitRevealed: "Steadfast loyalty",
        spiritualPrinciple: "God rewards those who remain faithful when it would be easier to defect.",
        reflectionQuestions: [
          "When the tide turns against what is right, do you hold firm or drift?",
          "Are you willing to serve in obscurity if that is what faithfulness requires?",
          "How do you decide whom to follow when loyalties are divided?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, courage: 3 }
      }
    ]
  },
  // ============================================
  // 19. SHIMEI
  // ============================================
  {
    id: "shimei",
    name: "Shimei",
    meaning: "Famous",
    emoji: "🪨",
    role: "Benjamite who cursed David during Absalom's rebellion",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 16:5-13", "2 Samuel 19:18-23", "1 Kings 2:36-46"],
    archetypes: ["Manipulator", "Tragic Hero"],
    dna: { faith: 1, humility: 1, courage: 2, wisdom: 1, compassion: 0, fear: 4, pride: 4, greed: 3 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Boldness when the powerful are weak",
      weakness: "Cowardice and opportunism",
      mindset: "I will curse the fallen and grovel before the restored",
      keyLesson: "Opportunistic cruelty eventually catches up with you.",
      keyVerse: "Come out, come out, thou bloody man, and thou man of Belial.",
      keyVerseRef: "2 Samuel 16:7"
    },
    storyArc: "A relative of Saul who cursed and threw stones at David while he fled from Absalom, then groveled for forgiveness when David returned victorious, and was eventually executed under Solomon for violating his parole.",
    therapyView: {
      drivingFears: ["Being on the losing side", "Retribution from those in power"],
      coreMotivations: ["Resentment over Saul's dynasty being displaced", "Self-preservation", "Opportunistic revenge"],
      relationalStyle: "Cowardly aggressor who bullies the weak and flatters the strong",
      blindSpots: ["Confusing boldness with courage", "Thinking repentance is the same as regret for getting caught"],
      healingMoments: ["None recorded—his repentance appeared to be purely self-serving"]
    },
    strengths: ["Boldness in the moment (though misdirected)"],
    weaknesses: ["Cowardice", "Opportunism", "False repentance", "Resentment"],
    journey: [
      { phase: "Calling", description: "A Benjamite with deep resentment over Saul's lost kingdom" },
      { phase: "Failure", description: "Cursed and stoned David at his lowest point" },
      { phase: "Refinement", description: "Begged for mercy when David returned—but did not truly change" },
      { phase: "Legacy", description: "Executed by Solomon after violating the terms of his pardon" }
    ],
    relationships: [
      { name: "David", role: "King he cursed and later begged for mercy" },
      { name: "Solomon", role: "King who gave him a conditional pardon then executed him" },
      { name: "Saul", role: "Kinsman whose dynasty he mourned" }
    ],
    lessonsAndReflection: [
      "Kicking someone when they are down reveals your true character.",
      "False repentance is eventually exposed.",
      "Grace given is not a license to continue in sin."
    ],
    relatedCharacters: ["david", "solomon", "absalom"],
    situations: [
      {
        id: "shimei-cursing-david",
        title: "Cursing David During His Flight",
        category: "Betrayal",
        reference: "2 Samuel 16:5-13",
        keyVerse: "Come out, come out, thou bloody man, and thou man of Belial.",
        situation: "David was fleeing Jerusalem during Absalom's rebellion—the lowest point of his reign.",
        pressure: "Years of resentment over Saul's fall found an outlet when the king was vulnerable.",
        innerBattle: "The king is weak, and I can finally say what I have always felt.",
        response: "Shimei cursed David, threw stones, and accused him of being a murderer who deserved this fate.",
        outcome: "David refused to retaliate, seeing it as possibly from the Lord, but Solomon later executed Shimei.",
        lesson: "Attacking the vulnerable reveals cowardice, not courage.",
        traitRevealed: "Opportunistic cruelty",
        spiritualPrinciple: "How you treat people at their lowest reveals who you really are.",
        reflectionQuestions: [
          "Have you ever attacked someone when they were already down?",
          "Is your repentance genuine or motivated by fear of consequences?",
          "How do you respond when someone you resent is in a position of weakness?"
        ],
        dnaSnapshot: { pride: 4, fear: 4, courage: 2 }
      }
    ]
  },
  // ============================================
  // 20. AMNON
  // ============================================
  {
    id: "amnon",
    name: "Amnon",
    meaning: "Faithful (ironic)",
    emoji: "😠",
    role: "David's firstborn son who violated his half-sister Tamar",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 13:1-29"],
    archetypes: ["Oppressor", "Tragic Hero"],
    dna: { faith: 0, humility: 0, courage: 0, wisdom: 0, compassion: 0, fear: 2, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "None recorded—a purely cautionary figure",
      weakness: "Uncontrolled lust and entitlement",
      mindset: "I want what I want and I will take it",
      keyLesson: "Unchecked desire destroys everyone it touches.",
      keyVerse: "Then Amnon hated her exceedingly; so that the hatred wherewith he hated her was greater than the love wherewith he had loved her.",
      keyVerseRef: "2 Samuel 13:15"
    },
    storyArc: "David's firstborn son who became obsessed with his half-sister Tamar, conspired to assault her, then discarded her with even greater contempt, and was murdered by Absalom in revenge two years later.",
    therapyView: {
      drivingFears: ["Not getting what he desired", "Exposure"],
      coreMotivations: ["Self-gratification", "Entitlement", "Obsessive desire"],
      relationalStyle: "Predatory—confusing obsession with love, using and discarding people",
      blindSpots: ["Total inability to see Tamar as a person rather than an object", "Confusing lust with love"],
      healingMoments: ["None recorded"]
    },
    strengths: ["None that served a godly purpose"],
    weaknesses: ["Lust", "Entitlement", "Cruelty", "Manipulation"],
    journey: [
      { phase: "Failure", description: "Obsessed over Tamar and conspired with Jonadab to trap her" },
      { phase: "Legacy", description: "His crime set off a chain of violence—Absalom's revenge, rebellion, and David's family unraveling" }
    ],
    relationships: [
      { name: "David", role: "Father who failed to punish him" },
      { name: "Tamar", role: "Half-sister he violated" },
      { name: "Absalom", role: "Half-brother who murdered him in revenge" },
      { name: "Jonadab", role: "Cousin who devised the wicked scheme" }
    ],
    lessonsAndReflection: [
      "What masquerades as love can be the worst form of selfishness.",
      "Unchecked desire in one generation produces violence in the next.",
      "A father's failure to discipline has devastating consequences."
    ],
    relatedCharacters: ["david", "tamar-davids-daughter", "absalom"],
    situations: [
      {
        id: "amnon-assault-tamar",
        title: "The Assault on Tamar",
        category: "Temptation",
        reference: "2 Samuel 13:1-19",
        keyVerse: "Then Amnon hated her exceedingly.",
        situation: "Amnon was consumed with desire for his half-sister Tamar and conspired with his cousin Jonadab to get her alone.",
        pressure: "Obsessive lust that he refused to control, enabled by a scheming friend.",
        innerBattle: "There was no battle—he had already surrendered to his desires completely.",
        response: "He deceived Tamar, overpowered her despite her pleas, then threw her out with contempt.",
        outcome: "Tamar was left desolate, Absalom burned with rage, and two years later Amnon was murdered.",
        lesson: "Lust masquerading as love destroys everything it touches.",
        traitRevealed: "Predatory entitlement",
        spiritualPrinciple: "When desire is allowed to conceive, it brings forth sin, and sin brings forth death.",
        reflectionQuestions: [
          "Are there desires in your life you are refusing to surrender to God?",
          "Do you have friends who encourage your worst impulses?",
          "How do you distinguish between genuine love and selfish desire?"
        ],
        dnaSnapshot: { pride: 5, greed: 5, compassion: 0 }
      }
    ]
  },
  // ============================================
  // 21. TAMAR (DAVID'S DAUGHTER)
  // ============================================
  {
    id: "tamar-davids-daughter",
    name: "Tamar",
    meaning: "Palm tree",
    emoji: "😢",
    role: "David's daughter, victim of Amnon's assault",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 13:1-22"],
    archetypes: ["Survivor"],
    dna: { faith: 3, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 4, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Survivor",
      strength: "Moral clarity and courage to speak truth even in violation",
      weakness: "Powerless in a system that failed to protect her",
      mindset: "This ought not to be done in Israel",
      keyLesson: "Injustice done to the vulnerable demands a response from those in authority.",
      keyVerse: "And Tamar put ashes on her head, and rent her garment of divers colours that was on her, and laid her hand on her head, and went on crying.",
      keyVerseRef: "2 Samuel 13:19"
    },
    storyArc: "A royal virgin who was lured by her half-brother Amnon's deception, pleaded with him not to commit wickedness, was violated and discarded, and lived out her days desolate in Absalom's house while David failed to act.",
    therapyView: {
      drivingFears: ["Being powerless against injustice", "Being forgotten and discarded"],
      coreMotivations: ["Living with dignity", "Moral righteousness"],
      relationalStyle: "Trusting and obedient, which was exploited by those who should have protected her",
      blindSpots: ["None that were her fault—she was the victim of systemic failure"],
      healingMoments: ["Absalom taking her into his household, though incomplete justice"]
    },
    strengths: ["Moral clarity", "Courage to plead and argue against wickedness", "Dignity in suffering"],
    weaknesses: ["Powerlessness in a patriarchal system", "Isolation after the trauma"],
    journey: [
      { phase: "Calling", description: "A princess of Israel living in dignity and purity" },
      { phase: "Testing", description: "Sent by her father to care for Amnon, not knowing it was a trap" },
      { phase: "Failure", description: "Violated despite her eloquent protests—the system failed her" },
      { phase: "Legacy", description: "Her story stands as a permanent indictment against those who abuse power and those who fail to protect the vulnerable" }
    ],
    relationships: [
      { name: "David", role: "Father who was angry but did not punish Amnon" },
      { name: "Amnon", role: "Half-brother who assaulted her" },
      { name: "Absalom", role: "Full brother who took her in and avenged her" }
    ],
    lessonsAndReflection: [
      "The Bible does not hide the suffering of the innocent.",
      "Silence and inaction from authority figures compound the trauma of victims.",
      "God sees and cares about those the system fails."
    ],
    relatedCharacters: ["amnon", "david", "absalom"],
    situations: [
      {
        id: "tamar-assault",
        title: "Violated by Her Brother",
        category: "Persecution",
        reference: "2 Samuel 13:10-19",
        keyVerse: "Nay, my brother, do not force me; for no such thing ought to be done in Israel.",
        situation: "Tamar was sent by David to care for Amnon, who pretended to be sick, and was trapped alone with him.",
        pressure: "Confronted by a physically stronger assailant with no one to intervene.",
        innerBattle: "She argued, pleaded, and reasoned—doing everything in her power to prevent the crime.",
        response: "She spoke with moral clarity, offering alternatives and warning of consequences, but was overpowered.",
        outcome: "She was violated, discarded, and left desolate. David was angry but did nothing.",
        lesson: "The silence of those in authority amplifies the suffering of victims.",
        traitRevealed: "Moral courage in the face of brutality",
        spiritualPrinciple: "God hears the cry of the oppressed even when human authorities fail to act.",
        reflectionQuestions: [
          "How do you respond when you witness injustice against the vulnerable?",
          "Are there people in your life whose pain you have ignored or minimized?",
          "What does it mean to be a voice for those who have been silenced?"
        ],
        dnaSnapshot: { courage: 3, fear: 4, compassion: 3 }
      }
    ]
  },
  // ============================================
  // 22. RIZPAH
  // ============================================
  {
    id: "rizpah",
    name: "Rizpah",
    meaning: "Hot stone",
    emoji: "🪶",
    role: "Saul's concubine who protected her dead sons' bodies",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 21:1-14", "2 Samuel 3:7"],
    archetypes: ["Matriarch", "Survivor"],
    dna: { faith: 4, humility: 4, courage: 5, wisdom: 2, compassion: 5, fear: 2, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Survivor",
      strength: "Fierce maternal devotion and dignity in grief",
      weakness: "Powerless to change the political forces that destroyed her family",
      mindset: "I cannot save them, but I will honor them",
      keyLesson: "Persistent love can shame the powerful into doing what is right.",
      keyVerse: "And Rizpah the daughter of Aiah took sackcloth, and spread it for her upon the rock.",
      keyVerseRef: "2 Samuel 21:10"
    },
    storyArc: "A concubine of Saul whose two sons were executed to end a famine, and who then kept a solitary vigil over their exposed bodies for months—day and night—driving away birds and beasts, until David was shamed into giving them a proper burial.",
    therapyView: {
      drivingFears: ["Her sons being dishonored even in death", "Being forgotten and powerless"],
      coreMotivations: ["Protecting her sons' dignity", "Maternal love beyond death"],
      relationalStyle: "Fierce, protective, and enduring through grief",
      blindSpots: ["Grief so consuming it left no room for self-care"],
      healingMoments: ["David finally giving the bodies a proper burial after being moved by her vigil"]
    },
    strengths: ["Extraordinary maternal courage", "Endurance", "Dignity in suffering"],
    weaknesses: ["Powerlessness within the political system", "Consumed by grief"],
    journey: [
      { phase: "Calling", description: "A concubine of Saul, mother of two sons" },
      { phase: "Testing", description: "Her sons were killed as atonement for Saul's sin against the Gibeonites" },
      { phase: "Refinement", description: "Kept a months-long vigil over their bodies" },
      { phase: "Legacy", description: "Her devotion moved David to act and give all of Saul's family proper burial" }
    ],
    relationships: [
      { name: "Saul", role: "King and the father of her sons" },
      { name: "David", role: "King who ordered the execution and was later shamed into proper burial" },
      { name: "Her two sons", role: "Armoni and Mephibosheth, executed for Saul's sin" }
    ],
    lessonsAndReflection: [
      "A mother's love can endure beyond all reason.",
      "Persistent witness can shame the powerful into doing right.",
      "The innocent often bear the cost of others' sins."
    ],
    relatedCharacters: ["david", "saul"],
    situations: [
      {
        id: "rizpah-vigil",
        title: "The Vigil Over Her Sons' Bodies",
        category: "Loss",
        reference: "2 Samuel 21:10-14",
        keyVerse: "And Rizpah took sackcloth, and spread it for her upon the rock, from the beginning of harvest until water dropped upon them out of heaven.",
        situation: "Rizpah's two sons were executed and their bodies left exposed as a public statement, with no burial.",
        pressure: "Grief, exhaustion, weather, scavenging animals—all while being completely alone and powerless.",
        innerBattle: "I cannot bring them back, but will I let their bodies be dishonored?",
        response: "She spread sackcloth on a rock and guarded the bodies day and night for months.",
        outcome: "David heard of her vigil and was moved to give proper burial to all of Saul's family.",
        lesson: "Faithful, persistent love can move even kings to act justly.",
        traitRevealed: "Unbreakable maternal devotion",
        spiritualPrinciple: "God sees the faithfulness of the powerless and uses it to convict the powerful.",
        reflectionQuestions: [
          "How do you honor those you have lost?",
          "Have you ever witnessed persistent love move someone to action?",
          "What does it look like to maintain dignity when you have no power?"
        ],
        dnaSnapshot: { courage: 5, compassion: 5, faith: 4 }
      }
    ]
  },
  // ============================================
  // 23. ABISHAG
  // ============================================
  {
    id: "abishag",
    name: "Abishag",
    meaning: "My father wanders",
    emoji: "🏵️",
    role: "Young Shunammite woman who served elderly King David",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 1:1-4", "1 Kings 2:17-22"],
    archetypes: ["Servant"],
    dna: { faith: 2, humility: 5, courage: 2, wisdom: 2, compassion: 4, fear: 3, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Servant",
      strength: "Faithful service without complaint",
      weakness: "No voice or agency in the political games around her",
      mindset: "I serve the king as I have been asked",
      keyLesson: "Even silent figures become pawns in political power plays.",
      keyVerse: "And the damsel was very fair, and cherished the king, and ministered to him.",
      keyVerseRef: "1 Kings 1:4"
    },
    storyArc: "A beautiful young woman chosen to care for the aging David, who faithfully served him, then unwittingly became the center of a deadly political dispute when Adonijah asked Solomon for her hand—a request that cost him his life.",
    therapyView: {
      drivingFears: ["Being used as a political tool", "Having no control over her own fate"],
      coreMotivations: ["Dutiful service", "Survival in a dangerous court"],
      relationalStyle: "Submissive and dutiful, with no recorded voice of her own",
      blindSpots: ["None attributable to her—she was acted upon rather than acting"],
      healingMoments: ["None recorded—her story illustrates the vulnerability of the powerless"]
    },
    strengths: ["Faithful service", "Beauty and grace", "Loyalty"],
    weaknesses: ["No recorded voice or agency", "Vulnerability to political manipulation"],
    journey: [
      { phase: "Calling", description: "Chosen from all Israel to serve the aging king" },
      { phase: "Testing", description: "Served David faithfully in his final days" },
      { phase: "Legacy", description: "Her name became the trigger for Adonijah's execution when he requested her" }
    ],
    relationships: [
      { name: "David", role: "King she served in his old age" },
      { name: "Adonijah", role: "Prince whose request for her hand cost him his life" },
      { name: "Solomon", role: "King who saw the request for Abishag as a power grab" }
    ],
    lessonsAndReflection: [
      "The powerless are often caught in the crossfire of the powerful.",
      "Faithful service in obscurity still has dignity before God.",
      "Every person has inherent worth regardless of their role in the political narrative."
    ],
    relatedCharacters: ["david", "solomon", "adonijah"],
    situations: [
      {
        id: "abishag-political-pawn",
        title: "Becoming a Political Pawn",
        category: "Conflict",
        reference: "1 Kings 2:17-22",
        keyVerse: "Ask for him the kingdom also; for he is mine elder brother.",
        situation: "After David's death, Adonijah asked Bathsheba to request Abishag as his wife from Solomon.",
        pressure: "Abishag had no say in a request that Solomon interpreted as a veiled grab for the throne.",
        innerBattle: "She had no recorded voice—others decided her fate.",
        response: "She was silent; Solomon responded by executing Adonijah for the treasonous request.",
        outcome: "Adonijah was killed, and Abishag's fate is unrecorded.",
        lesson: "People without power are often used as tools in others' ambitions.",
        traitRevealed: "Vulnerability of the voiceless",
        spiritualPrinciple: "God sees those whom the powerful overlook and use.",
        reflectionQuestions: [
          "Are there people around you being used as pawns in others' agendas?",
          "How do you advocate for those who have no voice?",
          "Do you see the dignity in those who serve in obscurity?"
        ],
        dnaSnapshot: { humility: 5, fear: 3, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 24. ADONIJAH
  // ============================================
  {
    id: "adonijah",
    name: "Adonijah",
    meaning: "My Lord is Yahweh",
    emoji: "👑",
    role: "David's son who tried to seize the throne",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 1:5-53", "1 Kings 2:13-25"],
    archetypes: ["Tragic Hero", "Manipulator"],
    dna: { faith: 1, humility: 0, courage: 3, wisdom: 1, compassion: 1, fear: 3, pride: 5, greed: 4 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Ambition and initiative",
      weakness: "Entitlement and refusal to accept God's choice",
      mindset: "The kingdom is mine by right of birth",
      keyLesson: "Self-appointed authority is not the same as God-appointed authority.",
      keyVerse: "I will be king: and he prepared him chariots and horsemen.",
      keyVerseRef: "1 Kings 1:5"
    },
    storyArc: "David's fourth son who assumed the throne was his by right as eldest surviving son, threw a coronation feast, was thwarted by Nathan and Bathsheba's intervention for Solomon, was spared, but then fatally overreached by requesting Abishag.",
    therapyView: {
      drivingFears: ["Being passed over", "Losing status and relevance"],
      coreMotivations: ["Entitlement to power", "Validation of his birth order", "Refusal to accept rejection"],
      relationalStyle: "Self-promoting and manipulative, unable to accept no",
      blindSpots: ["Could not see that God had chosen Solomon", "Mistook birthright for divine appointment"],
      healingMoments: ["None—each moment of mercy was met with further scheming"]
    },
    strengths: ["Charisma", "Political initiative", "Ability to gather supporters"],
    weaknesses: ["Entitlement", "Pride", "Inability to accept God's will", "Fatal overreach"],
    journey: [
      { phase: "Calling", description: "Born as David's fourth son with potential for the throne" },
      { phase: "Failure", description: "Attempted to seize the throne without God's or David's approval" },
      { phase: "Refinement", description: "Spared by Solomon after initial submission" },
      { phase: "Legacy", description: "Executed after requesting Abishag—a final act of overreach" }
    ],
    relationships: [
      { name: "David", role: "Father who never disciplined him" },
      { name: "Solomon", role: "Half-brother chosen by God as king" },
      { name: "Joab", role: "Army commander who supported his bid" },
      { name: "Abiathar", role: "Priest who supported his bid" },
      { name: "Bathsheba", role: "Stepmother who advocated for Solomon" }
    ],
    lessonsAndReflection: [
      "Human ambition cannot override divine appointment.",
      "A father's failure to discipline breeds entitlement.",
      "Grace spurned leads to destruction."
    ],
    relatedCharacters: ["david", "solomon", "bathsheba", "joab", "abishag"],
    situations: [
      {
        id: "adonijah-seizes-throne",
        title: "Attempting to Seize the Throne",
        category: "Power and Success",
        reference: "1 Kings 1:5-10",
        keyVerse: "I will be king.",
        situation: "With David aging and no public succession announced, Adonijah declared himself king and threw a coronation feast.",
        pressure: "The vacuum of power and the assumption that birth order guaranteed the throne.",
        innerBattle: "I deserve this—why should I wait for permission?",
        response: "He gathered chariots, horsemen, and supporters, hosting a coronation feast without consulting David or God.",
        outcome: "Nathan and Bathsheba intervened, David declared Solomon king, and Adonijah's feast ended in panic.",
        lesson: "Self-coronation without divine appointment is doomed to fail.",
        traitRevealed: "Presumptuous entitlement",
        spiritualPrinciple: "God resists the proud but gives grace to the humble.",
        reflectionQuestions: [
          "Are you trying to claim a position God has not given you?",
          "How do you respond when someone else receives what you thought was yours?",
          "Can you distinguish between ambition and divine calling?"
        ],
        dnaSnapshot: { pride: 5, greed: 4, humility: 0 }
      }
    ]
  },
  // ============================================
  // 25. THE WITCH OF ENDOR
  // ============================================
  {
    id: "witch-of-endor",
    name: "The Medium of Endor",
    meaning: "Unnamed woman of Endor",
    emoji: "🔮",
    role: "Medium whom Saul consulted to summon Samuel",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 28:3-25"],
    archetypes: ["Survivor"],
    dna: { faith: 1, humility: 3, courage: 2, wisdom: 1, compassion: 3, fear: 4, pride: 1, greed: 2 },
    quickCard: {
      archetype: "Survivor",
      strength: "Showed unexpected compassion to a broken king",
      weakness: "Practiced forbidden spiritual arts",
      mindset: "Survival through forbidden means",
      keyLesson: "Desperation drives people to forbidden sources when they have abandoned God.",
      keyVerse: "And the woman said unto him, Behold, thou knowest what Saul hath done, how he hath cut off those that have familiar spirits.",
      keyVerseRef: "1 Samuel 28:9"
    },
    storyArc: "An unnamed medium at Endor who was sought out by a desperate King Saul in disguise to summon the spirit of the dead Samuel, was terrified when it actually worked, and then showed unexpected compassion by feeding the shattered king.",
    therapyView: {
      drivingFears: ["Being discovered and executed", "Supernatural forces beyond her control"],
      coreMotivations: ["Survival", "Income through her forbidden practice"],
      relationalStyle: "Cautious and fearful, but surprisingly compassionate",
      blindSpots: ["Practicing what God had forbidden", "Enabling Saul's disobedience"],
      healingMoments: ["Showing kindness to a devastated Saul by preparing him a meal"]
    },
    strengths: ["Compassion even toward those who persecuted her kind", "Practical care-giving"],
    weaknesses: ["Practicing divination forbidden by God", "Living outside God's design"],
    journey: [
      { phase: "Calling", description: "Practiced as a medium in Israel despite the ban" },
      { phase: "Testing", description: "Confronted by a disguised king requesting a seance" },
      { phase: "Legacy", description: "Her story stands as a warning about seeking forbidden spiritual counsel" }
    ],
    relationships: [
      { name: "Saul", role: "Desperate king who sought her services" },
      { name: "Samuel", role: "Dead prophet whose spirit appeared" }
    ],
    lessonsAndReflection: [
      "When people abandon God, they turn to dangerous substitutes.",
      "Desperation does not justify disobedience.",
      "Even those outside the faith can show surprising compassion."
    ],
    relatedCharacters: ["saul", "samuel"],
    situations: [
      {
        id: "witch-endor-seance",
        title: "The Seance at Endor",
        category: "Fear",
        reference: "1 Samuel 28:7-20",
        keyVerse: "Bring me up Samuel.",
        situation: "King Saul, cut off from God, came in disguise to the medium and asked her to summon Samuel's spirit.",
        pressure: "She risked execution by practicing her craft for the very king who had outlawed it.",
        innerBattle: "Is this a trap? Will I be killed? But this desperate man is the king himself.",
        response: "She performed the ritual, was terrified when Samuel actually appeared, then recognized Saul and cared for him.",
        outcome: "Samuel pronounced Saul's doom, and the medium compassionately fed the broken king before he left.",
        lesson: "Seeking God through forbidden means only confirms the judgment already pronounced.",
        traitRevealed: "Unexpected compassion amid forbidden practice",
        spiritualPrinciple: "There are no shortcuts to hearing from God; disobedience only deepens the crisis.",
        reflectionQuestions: [
          "When God seems silent, where do you turn?",
          "Are there forbidden substitutes you reach for in desperation?",
          "Can you show compassion to someone even when they are reaping consequences?"
        ],
        dnaSnapshot: { fear: 4, compassion: 3 }
      }
    ]
  },
  // ============================================
  // 26. DOEG THE EDOMITE
  // ============================================
  {
    id: "doeg-the-edomite",
    name: "Doeg the Edomite",
    meaning: "Fearful",
    emoji: "🗡️",
    role: "Saul's chief herdsman who massacred 85 priests",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 21:7", "1 Samuel 22:9-19", "Psalm 52"],
    archetypes: ["Oppressor"],
    dna: { faith: 0, humility: 0, courage: 1, wisdom: 0, compassion: 0, fear: 3, pride: 4, greed: 4 },
    quickCard: {
      archetype: "Oppressor",
      strength: "None godly—efficient in violence",
      weakness: "Total moral bankruptcy and sycophantic cruelty",
      mindset: "I will do whatever my master requires to advance myself",
      keyLesson: "Those who curry favor through cruelty will be uprooted by God.",
      keyVerse: "Why boastest thou thyself in mischief, O mighty man?",
      keyVerseRef: "Psalm 52:1"
    },
    storyArc: "An Edomite servant of Saul who informed on Ahimelech the priest for helping David, then when Saul's own soldiers refused to kill the priests, Doeg willingly slaughtered 85 priests and destroyed the entire city of Nob.",
    therapyView: {
      drivingFears: ["Losing favor with power", "Being expendable"],
      coreMotivations: ["Advancement through obedience to power", "Proving his value through violence"],
      relationalStyle: "Sycophantic, treacherous, and brutal",
      blindSpots: ["Total absence of moral conscience", "Believing that serving power justified any action"],
      healingMoments: ["None recorded"]
    },
    strengths: ["Efficiency (used for evil)"],
    weaknesses: ["Complete moral depravity", "Sycophancy", "Willingness to commit atrocities"],
    journey: [
      { phase: "Calling", description: "Served as Saul's chief herdsman" },
      { phase: "Failure", description: "Informed on Ahimelech and then personally slaughtered the priests of Nob" },
      { phase: "Legacy", description: "Became the subject of Psalm 52—David's indictment of the wicked informant" }
    ],
    relationships: [
      { name: "Saul", role: "King he served with murderous loyalty" },
      { name: "Ahimelech", role: "High priest he informed on and killed" },
      { name: "David", role: "Fugitive he betrayed, who later wrote Psalm 52 about him" }
    ],
    lessonsAndReflection: [
      "Blind obedience to corrupt authority makes you complicit in evil.",
      "When even soldiers refuse to commit an atrocity, those who step forward are the worst of men.",
      "God takes note of those who destroy His servants."
    ],
    relatedCharacters: ["saul", "david", "ahimelech"],
    situations: [
      {
        id: "doeg-massacre-priests",
        title: "The Massacre of the Priests of Nob",
        category: "Betrayal",
        reference: "1 Samuel 22:18-19",
        keyVerse: "And Doeg the Edomite turned, and he fell upon the priests, and slew on that day fourscore and five persons that did wear a linen ephod.",
        situation: "Saul ordered his soldiers to kill the priests of Nob for helping David, but they refused.",
        pressure: "The opportunity to prove his value to the king by doing what no Israelite soldier would do.",
        innerBattle: "None recorded—he stepped forward eagerly.",
        response: "Doeg killed 85 priests, then destroyed the entire city of Nob—men, women, children, and animals.",
        outcome: "Only Abiathar escaped. David wrote Psalm 52 condemning Doeg. The atrocity haunted Saul's legacy.",
        lesson: "The willingness to do evil that others refuse makes you the worst kind of servant.",
        traitRevealed: "Sycophantic brutality",
        spiritualPrinciple: "God will uproot those who trust in violence and wickedness rather than in Him.",
        reflectionQuestions: [
          "Have you ever compromised morally to win favor with someone in authority?",
          "When others refuse to do wrong, do you step in to please those in power?",
          "How does your desire for approval influence your moral choices?"
        ],
        dnaSnapshot: { pride: 4, greed: 4, compassion: 0 }
      }
    ]
  },
  // ============================================
  // 27. ZIBA
  // ============================================
  {
    id: "ziba",
    name: "Ziba",
    meaning: "Plantation",
    emoji: "🎭",
    role: "Mephibosheth's deceptive servant",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 9:2-12", "2 Samuel 16:1-4", "2 Samuel 19:24-30"],
    archetypes: ["Manipulator"],
    dna: { faith: 0, humility: 1, courage: 2, wisdom: 3, compassion: 0, fear: 3, pride: 3, greed: 5 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Shrewdness and opportunism",
      weakness: "Greed-driven deception",
      mindset: "I will exploit every crisis for personal gain",
      keyLesson: "Exploiting the vulnerable for personal gain is detestable to God.",
      keyVerse: "Thy servant Mephibosheth said, Today shall the house of Israel restore me the kingdom of my father.",
      keyVerseRef: "2 Samuel 16:3"
    },
    storyArc: "A former servant of Saul assigned to serve Mephibosheth, who exploited Absalom's rebellion to slander his disabled master to David, seize half his property, and profit from another man's tragedy.",
    therapyView: {
      drivingFears: ["Being a servant forever", "Missing an opportunity to advance"],
      coreMotivations: ["Material gain", "Social advancement", "Exploiting crises"],
      relationalStyle: "Obsequious to the powerful, treacherous to those he serves",
      blindSpots: ["Saw people only as means to personal advancement", "Underestimated that truth would eventually surface"],
      healingMoments: ["None recorded"]
    },
    strengths: ["Shrewdness", "Timing", "Political instinct"],
    weaknesses: ["Greed", "Deception", "Betrayal of a disabled master"],
    journey: [
      { phase: "Calling", description: "Assigned as servant to Mephibosheth by David" },
      { phase: "Failure", description: "Slandered Mephibosheth during Absalom's rebellion to steal his property" },
      { phase: "Legacy", description: "Though he kept half the land, his name stands for treachery against the vulnerable" }
    ],
    relationships: [
      { name: "Mephibosheth", role: "Disabled master he betrayed" },
      { name: "David", role: "King he manipulated with lies" }
    ],
    lessonsAndReflection: [
      "Exploiting someone's disability or absence is particularly loathsome.",
      "Smooth words can deceive even wise leaders.",
      "God sees the truth even when human judges get it wrong."
    ],
    relatedCharacters: ["mephibosheth", "david", "absalom"],
    situations: [
      {
        id: "ziba-slanders-mephibosheth",
        title: "Slandering Mephibosheth",
        category: "Betrayal",
        reference: "2 Samuel 16:1-4",
        keyVerse: "Behold, thine are all that pertained unto Mephibosheth.",
        situation: "When David fled from Absalom, Ziba met him with supplies and claimed Mephibosheth had stayed behind hoping to reclaim Saul's throne.",
        pressure: "David was vulnerable, desperate, and in no position to verify the story.",
        innerBattle: "This is my chance to take everything my master has.",
        response: "Ziba lied convincingly, and David impulsively gave him all of Mephibosheth's property.",
        outcome: "When the truth emerged later, David divided the land—but the damage was done.",
        lesson: "Crises reveal who will exploit the vulnerable and who will protect them.",
        traitRevealed: "Opportunistic greed",
        spiritualPrinciple: "God sees through smooth lies even when human judges are deceived.",
        reflectionQuestions: [
          "Have you ever taken advantage of someone's absence or weakness?",
          "Do you verify accusations before acting on them?",
          "How do crises reveal your true character?"
        ],
        dnaSnapshot: { greed: 5, pride: 3, compassion: 0 }
      }
    ]
  },
  // ============================================
  // 28. ABNER
  // ============================================
  {
    id: "abner",
    name: "Abner",
    meaning: "Father of light",
    emoji: "⚔️",
    role: "Saul's army commander and power broker",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 14:50", "2 Samuel 2-3"],
    archetypes: ["Warrior", "Strategist"],
    dna: { faith: 2, humility: 2, courage: 4, wisdom: 3, compassion: 2, fear: 2, pride: 4, greed: 3 },
    quickCard: {
      archetype: "Strategist",
      strength: "Military skill and political influence",
      weakness: "Self-interest disguised as loyalty",
      mindset: "I will be the power behind whichever throne serves me best",
      keyLesson: "Loyalty based on self-interest shifts with the political winds.",
      keyVerse: "Am I a dog's head, which against Judah do shew kindness?",
      keyVerseRef: "2 Samuel 3:8"
    },
    storyArc: "Saul's cousin and commander who propped up Ish-bosheth as king after Saul's death, defected to David when insulted, was negotiating Israel's unification under David, but was murdered by Joab in revenge for killing Joab's brother.",
    therapyView: {
      drivingFears: ["Losing power and relevance", "Being disrespected"],
      coreMotivations: ["Maintaining influence", "Being the kingmaker", "Self-preservation"],
      relationalStyle: "Powerful, pragmatic, and easily offended",
      blindSpots: ["Loyalty was to himself, not to any king or God", "Underestimated Joab's desire for revenge"],
      healingMoments: ["His move toward David showed capacity for recognizing God's will, even if self-motivated"]
    },
    strengths: ["Military prowess", "Political skill", "Ability to unite factions"],
    weaknesses: ["Self-serving loyalty", "Pride that changed allegiances when insulted", "Arrogance"],
    journey: [
      { phase: "Calling", description: "Commander of Saul's army and protector of the dynasty" },
      { phase: "Testing", description: "Propped up Ish-bosheth but held the real power himself" },
      { phase: "Failure", description: "Switched allegiance to David after a personal insult" },
      { phase: "Legacy", description: "Murdered by Joab before he could complete the unification" }
    ],
    relationships: [
      { name: "Saul", role: "King and cousin he served" },
      { name: "Ish-bosheth", role: "Puppet king he installed and controlled" },
      { name: "David", role: "King he eventually defected to" },
      { name: "Joab", role: "David's commander who murdered him" }
    ],
    lessonsAndReflection: [
      "Loyalty built on self-interest is fragile.",
      "Being a kingmaker without serving the true King is ultimately empty.",
      "Unresolved conflicts can end in sudden destruction."
    ],
    relatedCharacters: ["saul", "david", "joab", "ish-bosheth"],
    situations: [
      {
        id: "abner-defects-to-david",
        title: "Defecting from Ish-bosheth to David",
        category: "Conflict",
        reference: "2 Samuel 3:6-21",
        keyVerse: "Am I a dog's head?",
        situation: "Ish-bosheth accused Abner of sleeping with Saul's concubine Rizpah, and Abner was furious at the insult.",
        pressure: "His pride was wounded, and he decided to switch his allegiance to David.",
        innerBattle: "I made this king, and now he dares accuse me? I will give the kingdom to David.",
        response: "Abner contacted David and began negotiating the transfer of all Israel's tribes to David's rule.",
        outcome: "Before the deal was complete, Joab murdered Abner in revenge for his brother Asahel's death.",
        lesson: "Self-serving loyalty collapses when personal pride is wounded.",
        traitRevealed: "Pride-driven pragmatism",
        spiritualPrinciple: "Those who serve themselves rather than God will ultimately be brought low.",
        reflectionQuestions: [
          "Is your loyalty to leaders based on principle or personal benefit?",
          "How do you handle insults from those you have helped?",
          "Are there unresolved conflicts that could have dangerous consequences?"
        ],
        dnaSnapshot: { pride: 4, courage: 4, greed: 3 }
      }
    ]
  },
  // ============================================
  // 29. ISH-BOSHETH
  // ============================================
  {
    id: "ish-bosheth",
    name: "Ish-bosheth",
    meaning: "Man of shame",
    emoji: "👤",
    role: "Saul's son installed as puppet king",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 2:8-10", "2 Samuel 3-4"],
    archetypes: ["Tragic Hero", "King"],
    dna: { faith: 1, humility: 3, courage: 1, wisdom: 1, compassion: 2, fear: 5, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Willingness to accept responsibility (however weak)",
      weakness: "Total inability to lead, controlled by stronger men",
      mindset: "I am king in name, but Abner holds the power",
      keyLesson: "A title without character and conviction makes you a puppet, not a leader.",
      keyVerse: "And Ish-bosheth could not answer Abner a word again, because he feared him.",
      keyVerseRef: "2 Samuel 3:11"
    },
    storyArc: "Saul's surviving son installed as king over Israel by Abner, who was the real power behind the throne. Ish-bosheth was too weak to confront Abner, too fearful to lead, and was assassinated in his bed by his own captains.",
    therapyView: {
      drivingFears: ["Abner", "David", "His own inadequacy", "Being overthrown"],
      coreMotivations: ["Holding onto his father's legacy", "Survival"],
      relationalStyle: "Passive and fearful, dominated by stronger personalities",
      blindSpots: ["Could not see that his position was untenable", "Believed a title made him a king"],
      healingMoments: ["None recorded—he never found his own strength"]
    },
    strengths: ["Nominal willingness to serve"],
    weaknesses: ["Extreme passivity", "Fear of confrontation", "Complete dependence on Abner"],
    journey: [
      { phase: "Calling", description: "Installed as king by Abner after Saul's death" },
      { phase: "Failure", description: "Could not govern, confront Abner, or inspire loyalty" },
      { phase: "Legacy", description: "Assassinated in his bed—a tragic figure who held a title without substance" }
    ],
    relationships: [
      { name: "Saul", role: "Father whose legacy he tried to maintain" },
      { name: "Abner", role: "Commander who controlled him completely" },
      { name: "David", role: "Rival king anointed by God" },
      { name: "Rechab and Baanah", role: "Captains who assassinated him" }
    ],
    lessonsAndReflection: [
      "A title without conviction makes you a puppet.",
      "Leadership requires inner strength, not just a crown.",
      "Depending entirely on one powerful person is a fatal vulnerability."
    ],
    relatedCharacters: ["saul", "david", "abner"],
    situations: [
      {
        id: "ish-bosheth-afraid-of-abner",
        title: "Unable to Confront Abner",
        category: "Fear",
        reference: "2 Samuel 3:6-11",
        keyVerse: "He could not answer Abner a word again, because he feared him.",
        situation: "Ish-bosheth accused Abner of misconduct with Rizpah but was too afraid to press the matter.",
        pressure: "The one person propping up his throne was the very person he needed to confront.",
        innerBattle: "I know this is wrong, but if I push Abner, I lose everything.",
        response: "He raised the issue but then fell silent when Abner raged at him, unable to say another word.",
        outcome: "Abner defected to David, and without his protector, Ish-bosheth was assassinated.",
        lesson: "Leaders who cannot confront are leaders in name only.",
        traitRevealed: "Paralyzing fear",
        spiritualPrinciple: "The fear of man brings a snare, but whoever trusts in the LORD shall be safe.",
        reflectionQuestions: [
          "Are there confrontations you are avoiding because of fear?",
          "Do you depend on one person to the point of paralysis?",
          "What does it mean to lead with conviction rather than fear?"
        ],
        dnaSnapshot: { fear: 5, courage: 1, wisdom: 1 }
      }
    ]
  },
  // ============================================
  // 30. MICHAL
  // ============================================
  {
    id: "michal",
    name: "Michal",
    meaning: "Who is like God?",
    emoji: "👸",
    role: "Saul's daughter, David's first wife",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 18:20-28", "1 Samuel 19:11-17", "2 Samuel 6:16-23"],
    archetypes: ["Tragic Hero"],
    dna: { faith: 2, humility: 2, courage: 3, wisdom: 2, compassion: 2, fear: 3, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Courage to save David early in their marriage",
      weakness: "Bitterness that hardened into contempt for worship",
      mindset: "I loved him once, but he has become undignified",
      keyLesson: "Bitterness over legitimate wounds can harden a heart against God Himself.",
      keyVerse: "And Michal the daughter of Saul came out to meet David, and said, How glorious was the king of Israel to day.",
      keyVerseRef: "2 Samuel 6:20"
    },
    storyArc: "A woman who genuinely loved David and saved his life, was given away to another man by her father Saul, was reclaimed by David as a political move, and ended her story despising David's uninhibited worship and dying childless.",
    therapyView: {
      drivingFears: ["Abandonment", "Loss of dignity and status", "Being a political pawn"],
      coreMotivations: ["Love (initially)", "Dignity and status", "Control"],
      relationalStyle: "Passionate initially, then bitter and contemptuous",
      blindSpots: ["Allowed legitimate pain to curdle into bitterness", "Could not separate David's failures toward her from his worship of God"],
      healingMoments: ["Saving David through the window—her love was real before bitterness took root"]
    },
    strengths: ["Courage", "Genuine love (early)", "Royal dignity"],
    weaknesses: ["Bitterness", "Contempt", "Inability to worship freely"],
    journey: [
      { phase: "Calling", description: "Loved David and became his first wife" },
      { phase: "Testing", description: "Saved David from Saul by lowering him through a window" },
      { phase: "Failure", description: "Given to Paltiel by Saul, then forcibly returned to David" },
      { phase: "Legacy", description: "Despised David's worship and died childless" }
    ],
    relationships: [
      { name: "David", role: "Husband she saved, lost, was returned to, and despised" },
      { name: "Saul", role: "Father who used her as a pawn" },
      { name: "Paltiel", role: "Second husband who wept when she was taken back" }
    ],
    lessonsAndReflection: [
      "Legitimate pain can become illegitimate bitterness if not surrendered to God.",
      "Being treated as a pawn does not excuse hardening your heart.",
      "Contempt for worship is a symptom of a deeper spiritual sickness."
    ],
    relatedCharacters: ["david", "saul", "absalom"],
    situations: [
      {
        id: "michal-despises-david-worship",
        title: "Despising David's Worship",
        category: "Conflict",
        reference: "2 Samuel 6:16-23",
        keyVerse: "How glorious was the king of Israel to day.",
        situation: "David danced before the Lord with all his might as the ark was brought to Jerusalem, and Michal watched from a window with contempt.",
        pressure: "Years of being used as a political pawn had hardened her heart.",
        innerBattle: "He abandoned me, used me, and now he dances like a fool while I suffer in silence.",
        response: "She mocked David with biting sarcasm when he returned home.",
        outcome: "David rebuked her, and Michal had no children to the day of her death.",
        lesson: "Bitterness toward people can become bitterness toward God's presence.",
        traitRevealed: "Hardened contempt",
        spiritualPrinciple: "A bitter root defiles many—including one's relationship with God.",
        reflectionQuestions: [
          "Is there legitimate pain in your life that has turned into bitterness?",
          "Have you ever despised someone else's genuine worship?",
          "How do you prevent past wounds from poisoning your relationship with God?"
        ],
        dnaSnapshot: { pride: 4, fear: 3, faith: 2 }
      }
    ]
  },
  // ============================================
  // 31. JABEZ
  // ============================================
  {
    id: "jabez",
    name: "Jabez",
    meaning: "Pain",
    emoji: "🙌",
    role: "Man who prayed for God's blessing",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["1 Chronicles 4:9-10"],
    archetypes: ["Seeker"],
    dna: { faith: 5, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 2, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Seeker",
      strength: "Bold faith to ask God for more",
      weakness: "Known only for one prayer—little else is recorded",
      mindset: "I refuse to be defined by my painful name or limited circumstances",
      keyLesson: "God honors bold, faith-filled prayers that seek His blessing and protection.",
      keyVerse: "Oh that thou wouldest bless me indeed, and enlarge my coast, and that thine hand might be with me.",
      keyVerseRef: "1 Chronicles 4:10"
    },
    storyArc: "A man born in pain and named for pain who refused to let his name define his destiny, prayed one of Scripture's most memorable prayers for blessing and enlargement, and God granted his request.",
    therapyView: {
      drivingFears: ["Being defined by pain and limitation", "Living a small, cursed life"],
      coreMotivations: ["Breaking free from a painful identity", "Seeking God's hand on his life"],
      relationalStyle: "Humble, bold, and direct with God",
      blindSpots: ["Risk of reducing faith to a formula for getting blessings"],
      healingMoments: ["God granting his prayer—proving that painful beginnings do not determine endings"]
    },
    strengths: ["Bold faith", "Refusal to accept a painful identity", "Dependence on God"],
    weaknesses: ["Very little known about his life beyond this prayer"],
    journey: [
      { phase: "Calling", description: "Born in pain and given a name meaning sorrow" },
      { phase: "Testing", description: "Faced the choice of accepting his painful identity or crying out to God" },
      { phase: "Legacy", description: "His prayer became one of the Bible's most famous—God granted his request" }
    ],
    relationships: [
      { name: "His mother", role: "Named him Jabez because she bore him in sorrow" }
    ],
    lessonsAndReflection: [
      "Your name and origin do not have to determine your destiny.",
      "God honors bold, specific, faith-filled prayer.",
      "Asking God for blessing is not selfish when it includes asking for His hand and protection."
    ],
    relatedCharacters: ["hannah"],
    situations: [
      {
        id: "jabez-prayer",
        title: "The Prayer of Jabez",
        category: "Faith Testing",
        reference: "1 Chronicles 4:10",
        keyVerse: "Oh that thou wouldest bless me indeed, and enlarge my coast.",
        situation: "Jabez, marked from birth by a name meaning pain, faced the choice of accepting his limited identity or asking God for more.",
        pressure: "Cultural expectations that your name defined your destiny.",
        innerBattle: "Am I defined by my painful beginning, or can God write a different story?",
        response: "He prayed boldly for blessing, enlargement, God's hand, and protection from evil.",
        outcome: "God granted his request, and he was more honorable than his brothers.",
        lesson: "God responds to faith that refuses to be limited by circumstances.",
        traitRevealed: "Bold, expectant faith",
        spiritualPrinciple: "You have not because you ask not—God invites bold requests.",
        reflectionQuestions: [
          "What painful label have you accepted as your identity?",
          "Are you willing to ask God boldly for a larger life?",
          "Do you believe God can rewrite the story your circumstances have written?"
        ],
        dnaSnapshot: { faith: 5, humility: 4, courage: 3 }
      }
    ]
  },
  // ============================================
  // 32. HILKIAH
  // ============================================
  {
    id: "hilkiah",
    name: "Hilkiah",
    meaning: "God is my portion",
    emoji: "📖",
    role: "High priest who found the Book of the Law",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 22:3-20", "2 Chronicles 34:14-28"],
    archetypes: ["Priest", "Servant"],
    dna: { faith: 5, humility: 4, courage: 3, wisdom: 4, compassion: 3, fear: 2, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Priest",
      strength: "Faithfulness to preserve and proclaim God's word",
      weakness: "Operated in an era of such decline that the Scriptures had been lost",
      mindset: "I have found the book of the law in the house of the LORD",
      keyLesson: "One faithful discovery of God's word can spark national transformation.",
      keyVerse: "I have found the book of the law in the house of the LORD.",
      keyVerseRef: "2 Kings 22:8"
    },
    storyArc: "The high priest during Josiah's reign who, during temple repairs, discovered the lost Book of the Law, reported it to the king, and set in motion the greatest spiritual revival in Judah's history.",
    therapyView: {
      drivingFears: ["God's word being permanently lost", "The priesthood failing its calling"],
      coreMotivations: ["Faithful stewardship", "Preserving God's truth", "Serving the king and God"],
      relationalStyle: "Diligent, responsible, and quick to act on what is right",
      blindSpots: ["The Book had been lost under the priesthood's watch—systemic failure"],
      healingMoments: ["The moment of discovery and the revival that followed"]
    },
    strengths: ["Faithfulness in duty", "Immediate action on discovery", "Proper chain of communication"],
    weaknesses: ["The loss happened on the priesthood's watch"],
    journey: [
      { phase: "Calling", description: "Served as high priest during Josiah's temple renovation" },
      { phase: "Testing", description: "Discovered the lost Book of the Law during repairs" },
      { phase: "Legacy", description: "His discovery sparked Josiah's revival—the greatest reform in Judah's history" }
    ],
    relationships: [
      { name: "Josiah", role: "King who commissioned the temple repairs" },
      { name: "Shaphan", role: "Scribe to whom he gave the Book" },
      { name: "Huldah", role: "Prophetess who confirmed the Book's authenticity" }
    ],
    lessonsAndReflection: [
      "God's word can be lost even in the house of God.",
      "One faithful person's discovery can change a nation.",
      "Revival begins with rediscovering Scripture."
    ],
    relatedCharacters: ["josiah", "huldah"],
    situations: [
      {
        id: "hilkiah-finds-book",
        title: "Finding the Lost Book of the Law",
        category: "Restoration",
        reference: "2 Kings 22:8-13",
        keyVerse: "I have found the book of the law in the house of the LORD.",
        situation: "During temple renovations under Josiah, Hilkiah discovered the long-lost Book of the Law.",
        pressure: "Realizing that God's word had been lost and neglected for decades under the priesthood's care.",
        innerBattle: "How could we have let this happen? What will the king do when he hears God's words?",
        response: "He immediately reported the discovery to Shaphan the scribe, who brought it to the king.",
        outcome: "Josiah tore his robes in grief and launched the most comprehensive spiritual revival in Judah's history.",
        lesson: "When God's word is rediscovered and taken seriously, transformation follows.",
        traitRevealed: "Faithful diligence",
        spiritualPrinciple: "Revival begins when God's people rediscover and obey His word.",
        reflectionQuestions: [
          "Have you neglected parts of God's word that need to be rediscovered?",
          "When was the last time Scripture genuinely convicted and changed you?",
          "What areas of your life need the kind of reform that comes from encountering God's word fresh?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 33. BARUCH
  // ============================================
  {
    id: "baruch",
    name: "Baruch",
    meaning: "Blessed",
    emoji: "📝",
    role: "Jeremiah's faithful scribe",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Jeremiah 36", "Jeremiah 43:1-7", "Jeremiah 45"],
    archetypes: ["Servant", "Survivor"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 3, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Faithful commitment to recording and preserving God's word",
      weakness: "Moments of self-pity and seeking great things for himself",
      mindset: "I will write what Jeremiah dictates, no matter the cost",
      keyLesson: "Faithful service behind the scenes preserves what matters most.",
      keyVerse: "Seekest thou great things for thyself? seek them not.",
      keyVerseRef: "Jeremiah 45:5"
    },
    storyArc: "A scribe of noble birth who gave up a promising career to serve the unpopular prophet Jeremiah, wrote and re-wrote scrolls of prophecy that the king burned, endured persecution, and was rebuked by God for seeking great things for himself.",
    therapyView: {
      drivingFears: ["His life being wasted in obscurity", "Persecution for his association with Jeremiah"],
      coreMotivations: ["Faithfulness to God's word", "Loyalty to Jeremiah", "Desire for personal significance"],
      relationalStyle: "Loyal and devoted but prone to discouragement",
      blindSpots: ["Self-pity about his sacrificed career", "Wanting recognition for his service"],
      healingMoments: ["God's personal word to him in Jeremiah 45—a rebuke and a promise of preservation"]
    },
    strengths: ["Faithful service", "Literary skill", "Loyalty under pressure"],
    weaknesses: ["Self-pity", "Desire for personal greatness", "Discouragement"],
    journey: [
      { phase: "Calling", description: "Chose to serve Jeremiah as his scribe" },
      { phase: "Testing", description: "Wrote the scroll, read it publicly, and then had to rewrite it after the king burned it" },
      { phase: "Refinement", description: "Rebuked by God for seeking great things but promised preservation" },
      { phase: "Legacy", description: "His faithful writing preserved Jeremiah's prophecies for all generations" }
    ],
    relationships: [
      { name: "Jeremiah", role: "Prophet he served as scribe" },
      { name: "King Jehoiakim", role: "King who burned the scroll Baruch wrote" }
    ],
    lessonsAndReflection: [
      "Behind-the-scenes faithfulness preserves what the spotlight never could.",
      "Seeking great things for yourself is a trap during times of judgment.",
      "God values your faithfulness more than your ambition."
    ],
    relatedCharacters: ["jeremiah"],
    situations: [
      {
        id: "baruch-rewriting-scroll",
        title: "Rewriting the Burned Scroll",
        category: "Persecution",
        reference: "Jeremiah 36:27-32",
        keyVerse: "Then took Jeremiah another roll, and gave it to Baruch the scribe... who wrote therein all the words of the book which Jehoiakim king of Judah had burned.",
        situation: "King Jehoiakim cut up and burned the scroll of prophecy that Baruch had painstakingly written at Jeremiah's dictation.",
        pressure: "All that work destroyed—and now he had to do it again, with even more words added.",
        innerBattle: "Why am I doing this? The king burned it, my career is gone, and my life is in danger.",
        response: "Baruch wrote the entire scroll again, with additional words—faithful to the task despite the setback.",
        outcome: "The second scroll survived and became part of the biblical canon.",
        lesson: "When your work for God is destroyed, do it again—and do it better.",
        traitRevealed: "Persevering faithfulness",
        spiritualPrinciple: "God's word cannot be permanently destroyed; it will accomplish what He purposes.",
        reflectionQuestions: [
          "How do you respond when your work for God is undone or destroyed?",
          "Are you willing to start over when God asks?",
          "Is your service motivated by results or by faithfulness?"
        ],
        dnaSnapshot: { faith: 4, humility: 4, courage: 3 }
      }
    ]
  },
  // ============================================
  // 34. EBED-MELECH
  // ============================================
  {
    id: "ebed-melech",
    name: "Ebed-Melech",
    meaning: "Servant of the king",
    emoji: "🪢",
    role: "Ethiopian official who rescued Jeremiah from the cistern",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Jeremiah 38:7-13", "Jeremiah 39:15-18"],
    archetypes: ["Servant", "Warrior"],
    dna: { faith: 4, humility: 4, courage: 5, wisdom: 3, compassion: 5, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Servant",
      strength: "Extraordinary moral courage and compassion",
      weakness: "A foreigner with limited political power",
      mindset: "I cannot stand by while an innocent man dies",
      keyLesson: "One person's courage can save a life and earn God's personal protection.",
      keyVerse: "For I will surely deliver thee, and thou shalt not fall by the sword... because thou hast put thy trust in me, saith the LORD.",
      keyVerseRef: "Jeremiah 39:18"
    },
    storyArc: "An Ethiopian eunuch serving in the royal court who risked his life to rescue the prophet Jeremiah from a muddy cistern where he had been left to die, and was personally promised by God that he would be spared during Jerusalem's fall.",
    therapyView: {
      drivingFears: ["An innocent man dying on his watch", "Retribution from the officials who imprisoned Jeremiah"],
      coreMotivations: ["Justice", "Compassion for the suffering", "Doing what is right regardless of cost"],
      relationalStyle: "Courageous, compassionate, and action-oriented",
      blindSpots: ["Could have been paralyzed by his outsider status but chose not to be"],
      healingMoments: ["God's personal promise of protection—recognizing his trust and courage"]
    },
    strengths: ["Moral courage", "Compassion", "Willingness to act when others stood by"],
    weaknesses: ["Limited political power as a foreigner", "Risked everything on a single act"],
    journey: [
      { phase: "Calling", description: "An Ethiopian serving in King Zedekiah's court" },
      { phase: "Testing", description: "Learned that Jeremiah had been thrown into a cistern to die" },
      { phase: "Refinement", description: "Went to the king, obtained permission, and carefully rescued Jeremiah" },
      { phase: "Legacy", description: "God personally promised him protection during Jerusalem's destruction" }
    ],
    relationships: [
      { name: "Jeremiah", role: "Prophet he rescued" },
      { name: "Zedekiah", role: "King he petitioned for Jeremiah's life" }
    ],
    lessonsAndReflection: [
      "Outsiders can be more righteous than God's own people.",
      "One act of courage can change the course of history.",
      "God rewards those who protect His servants."
    ],
    relatedCharacters: ["jeremiah", "zedekiah"],
    situations: [
      {
        id: "ebed-melech-rescues-jeremiah",
        title: "Rescuing Jeremiah from the Cistern",
        category: "Sacrifice",
        reference: "Jeremiah 38:7-13",
        keyVerse: "They have done evil in all that they have done to Jeremiah the prophet, whom they have cast into the dungeon.",
        situation: "Officials had thrown Jeremiah into a muddy cistern to die, and no one was willing to intervene.",
        pressure: "As a foreigner, speaking up against powerful officials could mean his own death.",
        innerBattle: "I am an outsider with no power—but I cannot let this man die.",
        response: "He boldly petitioned the king, gathered old rags to pad the ropes, and carefully pulled Jeremiah out.",
        outcome: "Jeremiah was saved, and God promised Ebed-Melech personal protection during the coming destruction.",
        lesson: "God sees and rewards those who risk everything to protect the innocent.",
        traitRevealed: "Selfless courage",
        spiritualPrinciple: "Those who trust God enough to act on behalf of the vulnerable will not be abandoned.",
        reflectionQuestions: [
          "Is there someone in your sphere who needs you to speak up for them?",
          "Does your outsider status stop you from doing what is right?",
          "Have you ever risked your comfort to rescue someone in need?"
        ],
        dnaSnapshot: { courage: 5, compassion: 5, faith: 4 }
      }
    ]
  },
  // ============================================
  // 35. GEDALIAH
  // ============================================
  {
    id: "gedaliah",
    name: "Gedaliah",
    meaning: "God is great",
    emoji: "🏘️",
    role: "Governor of Judah assassinated after the exile began",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["2 Kings 25:22-26", "Jeremiah 40-41"],
    archetypes: ["Servant", "Tragic Hero"],
    dna: { faith: 3, humility: 4, courage: 3, wisdom: 2, compassion: 4, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Servant",
      strength: "Willingness to govern the remnant in impossible circumstances",
      weakness: "Naivety that ignored clear warnings of assassination",
      mindset: "I will serve the people who remain and trust that things will work out",
      keyLesson: "Trusting people is noble, but ignoring warnings is foolish.",
      keyVerse: "Thou shalt not do this thing: for thou speakest falsely of Ishmael.",
      keyVerseRef: "Jeremiah 40:16"
    },
    storyArc: "A nobleman appointed by Babylon to govern the remnant in Judah after Jerusalem's fall, who tried to rebuild normalcy, refused to believe warnings of a plot against his life, and was assassinated by Ishmael son of Nethaniah.",
    therapyView: {
      drivingFears: ["The remnant being destroyed", "Losing what little stability remained"],
      coreMotivations: ["Serving the remaining people", "Restoring order", "Trusting in human goodness"],
      relationalStyle: "Trusting and open—to a fatal degree",
      blindSpots: ["Refused to believe evil of Ishmael despite credible warnings", "Confused trust with discernment"],
      healingMoments: ["His willingness to serve in a broken situation"]
    },
    strengths: ["Willingness to serve", "Compassion", "Desire for peace"],
    weaknesses: ["Fatal naivety", "Refusal to heed warnings", "Poor discernment"],
    journey: [
      { phase: "Calling", description: "Appointed governor over the Judean remnant by Nebuchadnezzar" },
      { phase: "Testing", description: "Tried to stabilize the remnant and was warned of a conspiracy" },
      { phase: "Failure", description: "Refused to believe the warnings and was assassinated" },
      { phase: "Legacy", description: "His death is commemorated in the Jewish Fast of Gedaliah" }
    ],
    relationships: [
      { name: "Jeremiah", role: "Prophet who chose to stay with his remnant" },
      { name: "Ishmael", role: "Royal descendant who assassinated him" },
      { name: "Johanan", role: "Military leader who warned him of the plot" }
    ],
    lessonsAndReflection: [
      "Trust is a virtue, but discernment is a necessity.",
      "Ignoring credible warnings is not faith—it is foolishness.",
      "Serving God's people sometimes requires wisdom to protect yourself."
    ],
    relatedCharacters: ["jeremiah", "nebuchadnezzar"],
    situations: [
      {
        id: "gedaliah-ignores-warning",
        title: "Ignoring the Assassination Warning",
        category: "Leadership Pressure",
        reference: "Jeremiah 40:13-41:3",
        keyVerse: "Thou speakest falsely of Ishmael.",
        situation: "Johanan warned Gedaliah that Ishmael was plotting to kill him and even offered to secretly eliminate the threat.",
        pressure: "Believing the best about people while leading a fragile remnant.",
        innerBattle: "Ishmael would not do such a thing—I will not stoop to suspicion.",
        response: "Gedaliah dismissed the warning and accused Johanan of lying about Ishmael.",
        outcome: "Ishmael assassinated Gedaliah and many others at a feast, plunging the remnant into further chaos.",
        lesson: "Trusting everyone without discernment is not kindness—it is recklessness.",
        traitRevealed: "Fatal naivety",
        spiritualPrinciple: "Be wise as serpents and harmless as doves—both are needed.",
        reflectionQuestions: [
          "Do you ignore warnings because you want to believe the best about people?",
          "How do you balance trust with discernment?",
          "Have you ever suffered because you refused to see the truth about someone?"
        ],
        dnaSnapshot: { compassion: 4, wisdom: 2, fear: 1 }
      }
    ]
  },
  // ============================================
  // 36. ZERUBBABEL
  // ============================================
  {
    id: "zerubbabel",
    name: "Zerubbabel",
    meaning: "Born in Babylon",
    emoji: "🏗️",
    role: "Led the return from exile and temple rebuilding",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Ezra 1-6", "Haggai 1-2", "Zechariah 4"],
    archetypes: ["Builder", "Servant"],
    dna: { faith: 4, humility: 4, courage: 4, wisdom: 3, compassion: 3, fear: 2, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Builder",
      strength: "Perseverance in rebuilding despite opposition and discouragement",
      weakness: "Periods of discouragement when the work stalled",
      mindset: "We must rebuild God's house even if it is smaller than what was lost",
      keyLesson: "Finishing what God started matters more than the size of the result.",
      keyVerse: "Not by might, nor by power, but by my spirit, saith the LORD of hosts.",
      keyVerseRef: "Zechariah 4:6"
    },
    storyArc: "A descendant of David born in Babylon who led the first wave of exiles back to Jerusalem, laid the foundation of the second temple amid opposition and discouragement, and was encouraged by Haggai and Zechariah to finish the work.",
    therapyView: {
      drivingFears: ["The temple never being completed", "The work being too small to matter"],
      coreMotivations: ["Restoring worship in Jerusalem", "Honoring God's command", "Continuing the Davidic line's purpose"],
      relationalStyle: "Steady, persistent, and responsive to prophetic encouragement",
      blindSpots: ["Periods of paralysis when opposition intensified", "Comparing the new temple to Solomon's"],
      healingMoments: ["Haggai and Zechariah's encouraging words", "God's promise that the glory of the latter house would exceed the former"]
    },
    strengths: ["Perseverance", "Obedience", "Leadership under adversity"],
    weaknesses: ["Discouragement", "Periods of stalled progress"],
    journey: [
      { phase: "Calling", description: "Led the first wave of exiles back from Babylon" },
      { phase: "Testing", description: "Faced opposition from surrounding peoples and discouragement from within" },
      { phase: "Refinement", description: "Encouraged by Haggai and Zechariah to resume building" },
      { phase: "Legacy", description: "Completed the second temple and appears in the genealogy of Jesus" }
    ],
    relationships: [
      { name: "Haggai", role: "Prophet who urged him to resume building" },
      { name: "Zechariah", role: "Prophet who encouraged him with visions" },
      { name: "Joshua the High Priest", role: "Priestly partner in the restoration" },
      { name: "Cyrus", role: "Persian king who authorized the return" }
    ],
    lessonsAndReflection: [
      "God finishes what He starts—through imperfect people.",
      "Do not despise the day of small things.",
      "Opposition is not a sign of being outside God's will."
    ],
    relatedCharacters: ["haggai", "zechariah-prophet", "joshua-high-priest", "cyrus"],
    situations: [
      {
        id: "zerubbabel-temple-rebuilding",
        title: "Resuming the Temple Rebuilding",
        category: "Restoration",
        reference: "Ezra 5:1-2; Haggai 2:1-9",
        keyVerse: "Who hath despised the day of small things?",
        situation: "The temple rebuilding had stalled for years due to opposition and discouragement, and the people had given up.",
        pressure: "The new foundation looked pathetic compared to Solomon's temple, and opposition was fierce.",
        innerBattle: "Is this effort even worth it? This temple is nothing compared to what was lost.",
        response: "Zerubbabel responded to the prophets' encouragement and resumed building despite the obstacles.",
        outcome: "The temple was completed in 516 BC, and God promised its future glory would exceed the former.",
        lesson: "Faithfulness in small beginnings leads to God-sized outcomes.",
        traitRevealed: "Persistent obedience",
        spiritualPrinciple: "God does not measure success by human standards—He honors faithfulness.",
        reflectionQuestions: [
          "Have you given up on something God called you to build?",
          "Do you despise small beginnings?",
          "How do you respond to discouragement in the middle of God's work?"
        ],
        dnaSnapshot: { faith: 4, courage: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 37. JOSHUA (HIGH PRIEST)
  // ============================================
  {
    id: "joshua-high-priest",
    name: "Joshua the High Priest",
    meaning: "The LORD saves",
    emoji: "👗",
    role: "High priest whose filthy garments were replaced with clean ones",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Zechariah 3:1-10", "Ezra 2:2", "Haggai 1:1"],
    archetypes: ["Priest", "Redeemed"],
    dna: { faith: 4, humility: 5, courage: 3, wisdom: 3, compassion: 3, fear: 2, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Priest",
      strength: "Willingness to stand before God even in his unworthiness",
      weakness: "Bore the filthy garments of Israel's collective sin",
      mindset: "I am unworthy, but God has chosen to cleanse me",
      keyLesson: "God removes our shame and clothes us in His righteousness.",
      keyVerse: "Take away the filthy garments from him... I have caused thine iniquity to pass from thee.",
      keyVerseRef: "Zechariah 3:4"
    },
    storyArc: "The high priest who led the returned exiles alongside Zerubbabel, stood before the angel of the Lord in filthy garments while Satan accused him, and was divinely cleansed and reclothed as a picture of God's grace.",
    therapyView: {
      drivingFears: ["Unworthiness before God", "Satan's accusations being true"],
      coreMotivations: ["Serving God despite personal inadequacy", "Restoring proper worship"],
      relationalStyle: "Humble, dependent on God's grace, and willing to serve",
      blindSpots: ["The weight of national guilt could have been paralyzing"],
      healingMoments: ["God silencing Satan and replacing his filthy garments with clean robes"]
    },
    strengths: ["Humility", "Willingness to serve despite unworthiness", "Responsiveness to God's cleansing"],
    weaknesses: ["Bore the corporate guilt of a sinful nation", "Vulnerable to accusation"],
    journey: [
      { phase: "Calling", description: "Appointed high priest of the returned exiles" },
      { phase: "Testing", description: "Stood before the angel of the Lord in filthy garments with Satan accusing him" },
      { phase: "Refinement", description: "God rebuked Satan, removed the filthy garments, and clothed him in clean robes" },
      { phase: "Legacy", description: "Became a living picture of God's grace and a type of the Messiah" }
    ],
    relationships: [
      { name: "Zerubbabel", role: "Partner in leadership of the restoration" },
      { name: "Zechariah", role: "Prophet who received the vision of his cleansing" },
      { name: "Satan", role: "Accuser who was rebuked by the Lord" }
    ],
    lessonsAndReflection: [
      "God's grace answers Satan's accusations.",
      "Our filthy garments are replaced by God's righteousness, not our own.",
      "Unworthiness is not a disqualification when God chooses to cleanse."
    ],
    relatedCharacters: ["zerubbabel", "zechariah-prophet", "haggai"],
    situations: [
      {
        id: "joshua-filthy-garments",
        title: "Filthy Garments Replaced with Clean Robes",
        category: "Restoration",
        reference: "Zechariah 3:1-7",
        keyVerse: "I have caused thine iniquity to pass from thee, and I will clothe thee with change of raiment.",
        situation: "Joshua stood before the angel of the Lord in filthy garments, representing the sin of Israel, while Satan stood to accuse him.",
        pressure: "The accusations were technically true—Israel's sin was real and the garments were genuinely filthy.",
        innerBattle: "I stand here guilty. The accuser is not wrong about my unworthiness.",
        response: "Joshua stood still and let God defend him, cleanse him, and re-clothe him.",
        outcome: "God rebuked Satan, removed the filthy garments, and gave Joshua rich robes and a clean turban.",
        lesson: "Salvation is God's work—we stand, He cleanses.",
        traitRevealed: "Humble receptivity to grace",
        spiritualPrinciple: "There is therefore now no condemnation to them which are in Christ Jesus.",
        reflectionQuestions: [
          "Do you stand paralyzed by your unworthiness, or do you let God cleanse you?",
          "How do you respond to the accuser's voice in your head?",
          "Can you accept God's grace even when the accusations feel true?"
        ],
        dnaSnapshot: { humility: 5, faith: 4 }
      }
    ]
  },
  // ============================================
  // 38. VASHTI
  // ============================================
  {
    id: "vashti",
    name: "Vashti",
    meaning: "Beautiful",
    emoji: "👑",
    role: "Persian queen who refused to display herself before the king",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Esther 1:1-22"],
    archetypes: ["Survivor"],
    dna: { faith: 2, humility: 3, courage: 5, wisdom: 3, compassion: 2, fear: 1, pride: 3, greed: 0 },
    quickCard: {
      archetype: "Survivor",
      strength: "Courage to refuse degradation even at the cost of her position",
      weakness: "Her refusal, while dignified, cost her everything",
      mindset: "I will not be paraded before drunken men, even if the king commands it",
      keyLesson: "Dignity sometimes costs everything, but compromise costs more.",
      keyVerse: "But the queen Vashti refused to come at the king's commandment.",
      keyVerseRef: "Esther 1:12"
    },
    storyArc: "The queen of Persia who, during a lavish seven-day feast, refused King Ahasuerus's command to display her beauty before his drunken guests, was deposed, and unknowingly opened the door for Esther to become queen.",
    therapyView: {
      drivingFears: ["Being reduced to an object", "Loss of dignity"],
      coreMotivations: ["Personal dignity", "Self-respect", "Refusal to be dehumanized"],
      relationalStyle: "Dignified and independent, willing to stand alone",
      blindSpots: ["May not have considered the political consequences fully"],
      healingMoments: ["Her refusal itself—choosing dignity over security"]
    },
    strengths: ["Remarkable courage", "Self-respect", "Moral backbone"],
    weaknesses: ["Her stand cost her the throne", "No recorded appeal or negotiation"],
    journey: [
      { phase: "Calling", description: "Queen of the Persian empire" },
      { phase: "Testing", description: "Commanded to display herself before drunken nobles" },
      { phase: "Legacy", description: "Deposed, but her courage opened the door for Esther and God's plan" }
    ],
    relationships: [
      { name: "Ahasuerus", role: "King and husband who deposed her" },
      { name: "Esther", role: "Successor whose rise was made possible by Vashti's removal" }
    ],
    lessonsAndReflection: [
      "Saying no to degradation is always the right choice, even when it costs everything.",
      "God can use even unjust removals to position the right person for His purposes.",
      "Dignity before God matters more than position before men."
    ],
    relatedCharacters: ["esther", "ahasuerus"],
    situations: [
      {
        id: "vashti-refuses-king",
        title: "Refusing the King's Command",
        category: "Obedience",
        reference: "Esther 1:10-12",
        keyVerse: "But the queen Vashti refused to come at the king's commandment.",
        situation: "King Ahasuerus, on the seventh day of a drunken feast, commanded Vashti to appear before his guests wearing her royal crown to display her beauty.",
        pressure: "Refusing the king meant certain deposition and possible death; compliance meant degradation.",
        innerBattle: "I can keep my crown or I can keep my dignity—I cannot keep both.",
        response: "Vashti refused to come, choosing personal dignity over royal compliance.",
        outcome: "She was deposed, and the search for a new queen eventually brought Esther to the throne.",
        lesson: "Some commands are not worth obeying, and some positions are not worth keeping.",
        traitRevealed: "Courageous dignity",
        spiritualPrinciple: "There are moments when obedience to conscience must override obedience to authority.",
        reflectionQuestions: [
          "What would you risk to maintain your dignity?",
          "Have you ever been asked to compromise yourself for someone else's entertainment?",
          "Can you trust God with the consequences of doing what is right?"
        ],
        dnaSnapshot: { courage: 5, pride: 3, humility: 3 }
      }
    ]
  },
  // ============================================
  // 39. SENNACHERIB
  // ============================================
  {
    id: "sennacherib",
    name: "Sennacherib",
    meaning: "Sin (moon god) has replaced the brothers",
    emoji: "🏰",
    role: "Assyrian king whose army was destroyed by an angel",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 18:13-19:37", "2 Chronicles 32", "Isaiah 36-37"],
    archetypes: ["Oppressor"],
    dna: { faith: 0, humility: 0, courage: 3, wisdom: 2, compassion: 0, fear: 2, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Military might and psychological warfare",
      weakness: "Blasphemous arrogance against the living God",
      mindset: "No god has stopped Assyria—your God will be no different",
      keyLesson: "Blaspheming the living God invites catastrophic judgment.",
      keyVerse: "Then the angel of the LORD went forth, and smote in the camp of the Assyrians a hundred and fourscore and five thousand.",
      keyVerseRef: "Isaiah 37:36"
    },
    storyArc: "The Assyrian emperor who besieged Jerusalem, mocked the God of Israel through his field commander Rabshakeh, sent a blasphemous letter to Hezekiah, and woke to find 185,000 of his soldiers dead—slain by the angel of the Lord.",
    therapyView: {
      drivingFears: ["Losing military supremacy", "Any power challenging Assyria"],
      coreMotivations: ["World domination", "Proving no god could resist Assyria"],
      relationalStyle: "Intimidating, mocking, and psychologically manipulative",
      blindSpots: ["Could not distinguish the living God from dead idols", "Assumed past military success guaranteed future victory"],
      healingMoments: ["None—he was later assassinated by his own sons"]
    },
    strengths: ["Military strategy", "Psychological warfare"],
    weaknesses: ["Blasphemous pride", "Fatal underestimation of God"],
    journey: [
      { phase: "Calling", description: "King of the Assyrian empire at its height" },
      { phase: "Failure", description: "Blasphemed the God of Israel and besieged Jerusalem" },
      { phase: "Legacy", description: "185,000 troops destroyed in one night; later murdered by his own sons" }
    ],
    relationships: [
      { name: "Hezekiah", role: "King of Judah he tried to intimidate" },
      { name: "Isaiah", role: "Prophet who predicted his defeat" },
      { name: "Rabshakeh", role: "Field commander who delivered his threats" }
    ],
    lessonsAndReflection: [
      "No earthly power can stand against the living God.",
      "Psychological warfare fails against those who pray.",
      "Those who mock God write their own obituary."
    ],
    relatedCharacters: ["hezekiah", "isaiah"],
    situations: [
      {
        id: "sennacherib-defeated",
        title: "Army Destroyed by the Angel of the Lord",
        category: "Power and Success",
        reference: "2 Kings 19:35-37",
        keyVerse: "Then the angel of the LORD went forth, and smote in the camp of the Assyrians.",
        situation: "Sennacherib had besieged Jerusalem and sent a letter mocking God, saying He was no different from the gods of nations Assyria had already conquered.",
        pressure: "Hezekiah prayed and spread the letter before the Lord.",
        innerBattle: "Sennacherib had none—he was supremely confident in his own power.",
        response: "He maintained his siege, expecting surrender, while God prepared judgment.",
        outcome: "185,000 Assyrian soldiers were killed in one night by the angel of the Lord. Sennacherib retreated and was later murdered by his own sons.",
        lesson: "The God of Israel is not like other gods—He fights for His people.",
        traitRevealed: "Blasphemous overreach",
        spiritualPrinciple: "God will not share His glory with another, and those who blaspheme Him will be humbled.",
        reflectionQuestions: [
          "Have you ever underestimated what God could do?",
          "How do you respond when powerful forces seem unstoppable?",
          "Do you bring your impossible situations to God in prayer like Hezekiah?"
        ],
        dnaSnapshot: { pride: 5, greed: 5, fear: 2 }
      }
    ]
  },
  // ============================================
  // 40. BALAK
  // ============================================
  {
    id: "balak",
    name: "Balak",
    meaning: "Devastator",
    emoji: "🏔️",
    role: "Moabite king who hired Balaam to curse Israel",
    era: "Conquest",
    testament: "OT",
    keyScriptures: ["Numbers 22-24"],
    archetypes: ["Oppressor", "Strategist"],
    dna: { faith: 0, humility: 1, courage: 2, wisdom: 2, compassion: 0, fear: 5, pride: 4, greed: 3 },
    quickCard: {
      archetype: "Strategist",
      strength: "Recognized the spiritual threat Israel posed",
      weakness: "Tried to use spiritual power as a weapon against God's people",
      mindset: "If I cannot defeat them militarily, I will curse them spiritually",
      keyLesson: "No weapon—physical or spiritual—formed against God's people can prosper.",
      keyVerse: "How shall I curse, whom God hath not cursed?",
      keyVerseRef: "Numbers 23:8"
    },
    storyArc: "The king of Moab who feared Israel after their victories, hired the prophet Balaam to curse them, watched in frustration as Balaam blessed Israel three times instead, and eventually succeeded in corrupting Israel through Balaam's advice to use Moabite women.",
    therapyView: {
      drivingFears: ["Israel destroying Moab", "Being powerless against a divinely protected people"],
      coreMotivations: ["National survival", "Defeating Israel by any means necessary"],
      relationalStyle: "Manipulative, persistent, and willing to pay any price for results",
      blindSpots: ["Could not accept that God's blessing on Israel was irrevocable", "Kept trying the same failed approach"],
      healingMoments: ["None—he eventually found a more sinister strategy through corruption"]
    },
    strengths: ["Strategic thinking", "Persistence", "Recognition of spiritual power"],
    weaknesses: ["Fighting against God", "Manipulative use of religion", "Inability to accept God's will"],
    journey: [
      { phase: "Calling", description: "King of Moab during Israel's approach to Canaan" },
      { phase: "Testing", description: "Desperately sought to curse Israel through Balaam" },
      { phase: "Failure", description: "Every curse turned to blessing" },
      { phase: "Legacy", description: "His name became synonymous with opposing God's people" }
    ],
    relationships: [
      { name: "Balaam", role: "Prophet he hired to curse Israel" },
      { name: "Moses", role: "Leader of the people he feared" }
    ],
    lessonsAndReflection: [
      "You cannot curse what God has blessed.",
      "Fear of God's people drives some to desperate and wicked strategies.",
      "When direct opposition fails, the enemy often turns to corruption."
    ],
    relatedCharacters: ["balaam", "moses"],
    situations: [
      {
        id: "balak-hires-balaam",
        title: "Hiring Balaam to Curse Israel",
        category: "Fear",
        reference: "Numbers 22:1-6",
        keyVerse: "Come now therefore, I pray thee, curse me this people; for they are too mighty for me.",
        situation: "Balak saw Israel's vast numbers and their victories over the Amorites and was terrified.",
        pressure: "Military defeat seemed certain, so he turned to spiritual warfare to destroy Israel.",
        innerBattle: "I cannot fight them with swords—perhaps a prophet's curse will work.",
        response: "He sent elders with divination fees to hire Balaam to curse Israel.",
        outcome: "Balaam blessed Israel three times, frustrating Balak completely, though corruption later succeeded where curses failed.",
        lesson: "No spiritual weapon can override God's sovereign blessing on His people.",
        traitRevealed: "Fear-driven manipulation",
        spiritualPrinciple: "If God be for us, who can be against us?",
        reflectionQuestions: [
          "Have you ever tried to manipulate spiritual forces to get what you want?",
          "How do you respond when God says no to your plans?",
          "Can you accept that God's will may override your desires?"
        ],
        dnaSnapshot: { fear: 5, pride: 4, greed: 3 }
      }
    ]
  },
  // ============================================
  // 41. OG OF BASHAN
  // ============================================
  {
    id: "og-of-bashan",
    name: "Og of Bashan",
    meaning: "Giant (long-necked)",
    emoji: "🛏️",
    role: "Giant king of Bashan defeated by Israel",
    era: "Conquest",
    testament: "OT",
    keyScriptures: ["Numbers 21:33-35", "Deuteronomy 3:1-11"],
    archetypes: ["Oppressor", "Warrior"],
    dna: { faith: 0, humility: 0, courage: 3, wisdom: 1, compassion: 0, fear: 1, pride: 5, greed: 4 },
    quickCard: {
      archetype: "Warrior",
      strength: "Physical intimidation and military might",
      weakness: "Total reliance on size and strength rather than God",
      mindset: "No one can defeat me—I am a giant king",
      keyLesson: "No giant is too big for God to bring down.",
      keyVerse: "Fear him not: for I have delivered him into thy hand.",
      keyVerseRef: "Numbers 21:34"
    },
    storyArc: "One of the last of the giant Rephaim, king of Bashan, famous for his enormous iron bed, who came out to fight Israel at Edrei and was utterly destroyed by Moses and the Israelites as God had commanded.",
    therapyView: {
      drivingFears: ["None recorded—he was fearless to a fault"],
      coreMotivations: ["Territorial defense", "Dominance through physical might"],
      relationalStyle: "Intimidating and domineering",
      blindSpots: ["Believed his size made him invincible", "Could not conceive of a power greater than himself"],
      healingMoments: ["None—he is a portrait of what happens when human strength meets divine power"]
    },
    strengths: ["Physical might", "Military prowess"],
    weaknesses: ["Pride in physical size", "Ignorance of God's power"],
    journey: [
      { phase: "Calling", description: "King of Bashan, one of the last Rephaim giants" },
      { phase: "Failure", description: "Went out to fight Israel and was utterly destroyed" },
      { phase: "Legacy", description: "His iron bed became a monument to fallen giants, and his land was given to Israel" }
    ],
    relationships: [
      { name: "Moses", role: "Leader of the army that defeated him" },
      { name: "Sihon", role: "Fellow king defeated alongside him" }
    ],
    lessonsAndReflection: [
      "Physical intimidation is nothing before God.",
      "The giants in your life are already defeated when God says 'Fear not.'",
      "History remembers Og only for how big he was and how completely he fell."
    ],
    relatedCharacters: ["moses", "balak"],
    situations: [
      {
        id: "og-defeated",
        title: "Defeated at Edrei",
        category: "Conflict",
        reference: "Numbers 21:33-35",
        keyVerse: "Fear him not: for I have delivered him into thy hand.",
        situation: "Og king of Bashan, a terrifying giant, came out with all his people to fight Israel at Edrei.",
        pressure: "Israel faced a physically overwhelming enemy—a giant king with a massive army.",
        innerBattle: "For Israel: this king is enormous. For Og: no battle—he assumed he would win.",
        response: "God told Moses not to fear, and Israel struck Og down along with his sons and all his people.",
        outcome: "Og was completely destroyed, and Israel took possession of Bashan.",
        lesson: "When God says 'Fear not,' no giant can stand.",
        traitRevealed: "False confidence in human strength",
        spiritualPrinciple: "The battle is the Lord's, and He delivers regardless of the enemy's size.",
        reflectionQuestions: [
          "What giants in your life seem too big to overcome?",
          "Do you trust in God's promise more than the enemy's appearance?",
          "How does God's 'Fear not' change the way you face intimidating situations?"
        ],
        dnaSnapshot: { pride: 5, courage: 3, fear: 1 }
      }
    ]
  },
  // ============================================
  // 42. SISERA
  // ============================================
  {
    id: "sisera",
    name: "Sisera",
    meaning: "Unknown (possibly battle array)",
    emoji: "🏕️",
    role: "Canaanite general killed by Jael",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 4:1-22", "Judges 5"],
    archetypes: ["Oppressor", "Warrior"],
    dna: { faith: 0, humility: 0, courage: 3, wisdom: 2, compassion: 0, fear: 3, pride: 5, greed: 3 },
    quickCard: {
      archetype: "Oppressor",
      strength: "900 iron chariots and military dominance",
      weakness: "Overconfidence that led to humiliation",
      mindset: "My chariots make me invincible",
      keyLesson: "God can turn the mightiest weapons into instruments of defeat.",
      keyVerse: "The stars in their courses fought against Sisera.",
      keyVerseRef: "Judges 5:20"
    },
    storyArc: "The commander of Jabin's Canaanite army who oppressed Israel for 20 years with 900 iron chariots, was routed by Deborah and Barak when God sent a rainstorm that bogged down his chariots, and was killed by Jael with a tent peg while he slept.",
    therapyView: {
      drivingFears: ["Losing military control", "The humiliation of defeat"],
      coreMotivations: ["Military dominance", "Crushing Israel's rebellion"],
      relationalStyle: "Commanding, ruthless, and dependent on superior technology",
      blindSpots: ["Relied on chariots that God could neutralize", "Trusted a woman's hospitality at the wrong moment"],
      healingMoments: ["None—his story is one of divine judgment through unexpected means"]
    },
    strengths: ["Military expertise", "Technological advantage (iron chariots)"],
    weaknesses: ["Overconfidence in technology", "Underestimated God and unlikely opponents"],
    journey: [
      { phase: "Calling", description: "Commander of the mightiest Canaanite army" },
      { phase: "Failure", description: "Routed by a divinely sent rainstorm and killed by Jael" },
      { phase: "Legacy", description: "His defeat is celebrated in the Song of Deborah as proof of God's power over human might" }
    ],
    relationships: [
      { name: "Jabin", role: "Canaanite king he served" },
      { name: "Deborah", role: "Prophetess who orchestrated his defeat" },
      { name: "Barak", role: "Israelite general who routed his army" },
      { name: "Jael", role: "Woman who killed him with a tent peg" }
    ],
    lessonsAndReflection: [
      "No technology or weapon can withstand God's intervention.",
      "Pride in human resources invites divine humiliation.",
      "God often uses the unexpected to bring down the mighty."
    ],
    relatedCharacters: ["deborah", "barak", "jael", "jabin"],
    situations: [
      {
        id: "sisera-defeat-jael",
        title: "Defeated by Storm and Killed by Jael",
        category: "Conflict",
        reference: "Judges 4:14-22",
        keyVerse: "The LORD shall sell Sisera into the hand of a woman.",
        situation: "Sisera led 900 iron chariots against Israel on the plain, expecting easy victory.",
        pressure: "God sent a rainstorm that turned the plain to mud, rendering his chariots useless.",
        innerBattle: "Everything I trusted in has turned against me—I must flee.",
        response: "He abandoned his chariot and fled on foot to Jael's tent, trusting her offer of refuge.",
        outcome: "Jael gave him milk, covered him, and drove a tent peg through his temple while he slept.",
        lesson: "God turns the weapons of the arrogant against them and uses unexpected agents of justice.",
        traitRevealed: "Overconfidence brought low",
        spiritualPrinciple: "The mighty will be humbled, and God will use the least likely agents to accomplish it.",
        reflectionQuestions: [
          "What are you trusting in instead of God?",
          "Have you underestimated how God might work through unlikely people?",
          "When your strategies fail, do you turn to God or keep running?"
        ],
        dnaSnapshot: { pride: 5, fear: 3, courage: 3 }
      }
    ]
  },
  // ============================================
  // 43. EGLON
  // ============================================
  {
    id: "eglon",
    name: "Eglon",
    meaning: "Like a calf",
    emoji: "🪑",
    role: "Moabite king killed by Ehud",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 3:12-30"],
    archetypes: ["Oppressor"],
    dna: { faith: 0, humility: 0, courage: 2, wisdom: 1, compassion: 0, fear: 1, pride: 4, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Political control over Israel for 18 years",
      weakness: "Self-indulgence and gullibility",
      mindset: "Israel serves me, and I will grow fat on their tribute",
      keyLesson: "Self-indulgent oppressors are brought down in surprising ways.",
      keyVerse: "And Ehud came unto him... I have a message from God unto thee.",
      keyVerseRef: "Judges 3:20"
    },
    storyArc: "A very fat Moabite king who oppressed Israel for 18 years, received tribute in his private chamber, and was assassinated by the left-handed judge Ehud who concealed a sword on his right side.",
    therapyView: {
      drivingFears: ["Losing control over Israel", "Threats to his comfortable reign"],
      coreMotivations: ["Self-indulgence", "Power over Israel", "Comfortable domination"],
      relationalStyle: "Indulgent, gullible, and overconfident in his security",
      blindSpots: ["Never suspected a left-handed man's concealed weapon", "Comfort bred carelessness"],
      healingMoments: ["None—a cautionary tale of indulgent oppression"]
    },
    strengths: ["Political power (for a season)"],
    weaknesses: ["Self-indulgence", "Gullibility", "Carelessness"],
    journey: [
      { phase: "Calling", description: "King of Moab who conquered Israel" },
      { phase: "Failure", description: "Grew complacent and was assassinated by Ehud" },
      { phase: "Legacy", description: "His death triggered Israel's deliverance and 80 years of peace" }
    ],
    relationships: [
      { name: "Ehud", role: "Left-handed judge who assassinated him" }
    ],
    lessonsAndReflection: [
      "Comfort and self-indulgence breed fatal vulnerability.",
      "God uses the unexpected—even a left-handed man's hidden sword—to deliver His people.",
      "Oppressive regimes have expiration dates."
    ],
    relatedCharacters: ["ehud"],
    situations: [
      {
        id: "eglon-assassinated",
        title: "Assassinated by Ehud",
        category: "Power and Success",
        reference: "Judges 3:15-25",
        keyVerse: "I have a message from God unto thee.",
        situation: "Eglon was receiving tribute from Israel in his private upper chamber, comfortable and unsuspecting.",
        pressure: "None felt by Eglon—he was secure in his power and luxury.",
        innerBattle: "Eglon had no inner battle—his guard was completely down.",
        response: "When Ehud said he had a message from God, Eglon rose from his seat—and Ehud plunged the sword into him.",
        outcome: "Eglon died, Ehud escaped, rallied Israel, and 10,000 Moabites were killed. Israel had peace for 80 years.",
        lesson: "The comfortable oppressor never sees the deliverer coming.",
        traitRevealed: "Complacent arrogance",
        spiritualPrinciple: "God sends deliverers when His people cry out, and oppressors fall when they least expect it.",
        reflectionQuestions: [
          "Has comfort made you careless about spiritual threats?",
          "Do you believe God still sends unexpected deliverers?",
          "What areas of self-indulgence have left you vulnerable?"
        ],
        dnaSnapshot: { pride: 4, greed: 5, fear: 1 }
      }
    ]
  },
  // ============================================
  // 44. JABIN
  // ============================================
  {
    id: "jabin",
    name: "Jabin",
    meaning: "He who discerns",
    emoji: "🏰",
    role: "Canaanite king defeated by Deborah and Barak",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 4:1-24", "Judges 5", "Psalm 83:9"],
    archetypes: ["Oppressor", "King"],
    dna: { faith: 0, humility: 0, courage: 2, wisdom: 2, compassion: 0, fear: 2, pride: 5, greed: 4 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Military infrastructure and alliance with Sisera",
      weakness: "Depended on military might rather than recognizing God's sovereignty",
      mindset: "My iron chariots will keep Israel under my heel forever",
      keyLesson: "Political oppression sustained by military might will fall when God intervenes.",
      keyVerse: "And the LORD discomfited Sisera, and all his chariots, and all his host, with the edge of the sword.",
      keyVerseRef: "Judges 4:15"
    },
    storyArc: "The king of Hazor who oppressed Israel for 20 years through his commander Sisera and 900 iron chariots, until God raised up Deborah and Barak to defeat his forces, leading to his complete destruction.",
    therapyView: {
      drivingFears: ["Israelite rebellion", "Loss of regional dominance"],
      coreMotivations: ["Territorial control", "Military superiority", "Crushing resistance"],
      relationalStyle: "Domineering and dependent on military proxies",
      blindSpots: ["Underestimated a God he did not know", "Relied entirely on Sisera and iron chariots"],
      healingMoments: ["None—a portrait of oppressive power brought to ruin"]
    },
    strengths: ["Political organization", "Military alliances"],
    weaknesses: ["Overreliance on military technology", "Opposition to God's people"],
    journey: [
      { phase: "Calling", description: "King of Hazor with regional dominance" },
      { phase: "Failure", description: "His army was routed by Deborah and Barak" },
      { phase: "Legacy", description: "His defeat became a byword for God's deliverance in Israel's psalms" }
    ],
    relationships: [
      { name: "Sisera", role: "Army commander who led his forces" },
      { name: "Deborah", role: "Prophetess who orchestrated his defeat" },
      { name: "Barak", role: "Israelite general who routed his army" }
    ],
    lessonsAndReflection: [
      "Oppressive systems have expiration dates set by God.",
      "Military technology cannot overcome divine intervention.",
      "God raises up deliverers when His people cry out."
    ],
    relatedCharacters: ["sisera", "deborah", "barak"],
    situations: [
      {
        id: "jabin-defeated",
        title: "Defeated by Deborah and Barak",
        category: "Conflict",
        reference: "Judges 4:23-24",
        keyVerse: "So God subdued on that day Jabin the king of Canaan before the children of Israel.",
        situation: "Jabin had oppressed Israel for 20 years with 900 iron chariots under Sisera's command.",
        pressure: "Israel had been crying out to God for deliverance from this crushing oppression.",
        innerBattle: "Jabin felt secure—20 years of dominance seemed unshakeable.",
        response: "He relied on Sisera and his chariots, but God turned the battle against them through weather and unlikely warriors.",
        outcome: "Jabin's power was broken, his general killed by a woman, and Israel was freed.",
        lesson: "Twenty years of oppression can be ended in a single day by God.",
        traitRevealed: "Overconfident oppression",
        spiritualPrinciple: "No system of oppression can outlast God's commitment to deliver His people.",
        reflectionQuestions: [
          "Are you enduring a situation that feels permanent? God can end it in a day.",
          "Do you cry out to God in prolonged suffering?",
          "How has God used unlikely people to bring deliverance in your life?"
        ],
        dnaSnapshot: { pride: 5, greed: 4, fear: 2 }
      }
    ]
  },
  // ============================================
  // 45. THE LEVITE'S CONCUBINE
  // ============================================
  {
    id: "levites-concubine",
    name: "The Levite's Concubine",
    meaning: "Unnamed victim of Judges 19",
    emoji: "😢",
    role: "Unnamed woman whose death exposed Israel's moral collapse",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 19"],
    archetypes: ["Survivor"],
    dna: { faith: 1, humility: 4, courage: 1, wisdom: 1, compassion: 2, fear: 5, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Survivor",
      strength: "None afforded to her—she is a portrait of total victimhood",
      weakness: "Powerless in a lawless society",
      mindset: "Voiceless—she is acted upon throughout the narrative",
      keyLesson: "When a society abandons God, the most vulnerable suffer the most.",
      keyVerse: "In those days there was no king in Israel: every man did that which was right in his own eyes.",
      keyVerseRef: "Judges 21:25"
    },
    storyArc: "An unnamed woman who left her Levite husband, was retrieved by him, was handed over to violent men in Gibeah, was brutally abused all night, died on the doorstep, and was dismembered by her husband to provoke a civil war in Israel.",
    therapyView: {
      drivingFears: ["Violence", "Abandonment", "Being treated as property"],
      coreMotivations: ["Survival"],
      relationalStyle: "No relational agency—she was treated as an object throughout",
      blindSpots: ["None attributable to her—she is the victim of systemic evil"],
      healingMoments: ["None in her story—her tragedy exposed Israel's need for godly leadership"]
    },
    strengths: ["Her story stands as a permanent indictment of moral anarchy"],
    weaknesses: ["She was given no chance to demonstrate strengths—the system crushed her"],
    journey: [
      { phase: "Calling", description: "An unnamed woman in the period of the Judges" },
      { phase: "Failure", description: "Not her failure—society failed her completely" },
      { phase: "Legacy", description: "Her death triggered a civil war and became the darkest illustration of moral decay in Scripture" }
    ],
    relationships: [
      { name: "The Levite", role: "Husband who sacrificed her to save himself" },
      { name: "Her father", role: "Father-in-law who showed hospitality" },
      { name: "The old man of Gibeah", role: "Host who offered her to the mob" }
    ],
    lessonsAndReflection: [
      "A society without God becomes savage toward its most vulnerable members.",
      "The Bible refuses to sanitize the horrors of human depravity.",
      "Injustice against the voiceless demands a reckoning."
    ],
    relatedCharacters: ["tamar-davids-daughter"],
    situations: [
      {
        id: "levites-concubine-tragedy",
        title: "The Gibeah Atrocity",
        category: "Persecution",
        reference: "Judges 19:22-30",
        keyVerse: "In those days there was no king in Israel.",
        situation: "The men of Gibeah surrounded a house demanding the Levite guest, and the concubine was pushed out to them.",
        pressure: "An entire mob of violent men with no law enforcement and no moral restraint.",
        innerBattle: "She had no choice—she was given to the mob by those who should have protected her.",
        response: "She endured abuse all night and collapsed at the doorstep at dawn.",
        outcome: "She died, her body was dismembered, and the resulting outrage led to civil war against Benjamin.",
        lesson: "When there is no moral authority, the innocent pay the ultimate price.",
        traitRevealed: "The cost of moral anarchy",
        spiritualPrinciple: "Without God's authority, humanity descends to its worst, and the powerless suffer most.",
        reflectionQuestions: [
          "How do you respond to stories of injustice that seem too dark to face?",
          "What responsibility do you have to protect the vulnerable in your community?",
          "Does this story reveal areas where society today still fails its most vulnerable?"
        ],
        dnaSnapshot: { fear: 5, courage: 1 }
      }
    ]
  },
  // ============================================
  // 46. ELIMELECH
  // ============================================
  {
    id: "elimelech",
    name: "Elimelech",
    meaning: "My God is king",
    emoji: "⚰️",
    role: "Naomi's husband who left Bethlehem for Moab",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Ruth 1:1-5"],
    archetypes: ["Patriarch", "Tragic Hero"],
    dna: { faith: 2, humility: 3, courage: 2, wisdom: 2, compassion: 3, fear: 4, pride: 2, greed: 2 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Desire to provide for his family",
      weakness: "Left the Promised Land and God's community during hardship",
      mindset: "Moab will save us from this famine",
      keyLesson: "Running from hardship in God's land can lead to worse outcomes.",
      keyVerse: "A certain man of Bethlehem-judah went to sojourn in the country of Moab, he, and his wife, and his two sons.",
      keyVerseRef: "Ruth 1:1"
    },
    storyArc: "A man from Bethlehem ('House of Bread') whose name meant 'My God is King' but who left God's land during a famine for pagan Moab, where he and both his sons died, leaving Naomi destitute.",
    therapyView: {
      drivingFears: ["Starvation", "Inability to provide for his family"],
      coreMotivations: ["Family provision", "Survival", "Escape from hardship"],
      relationalStyle: "Protective but fear-driven decision maker",
      blindSpots: ["Sought provision outside God's land rather than trusting God in the difficulty", "The irony of his name—'My God is King'—versus his choice to leave"],
      healingMoments: ["None for him—but his departure set the stage for Ruth's redemption story"]
    },
    strengths: ["Desire to provide for his family"],
    weaknesses: ["Fear-driven decisions", "Leaving God's land for pagan territory", "Short-term thinking"],
    journey: [
      { phase: "Calling", description: "A man of Bethlehem with a family to provide for" },
      { phase: "Failure", description: "Left the Promised Land for Moab during a famine" },
      { phase: "Legacy", description: "Died in Moab, but his departure set in motion Ruth's story of redemption" }
    ],
    relationships: [
      { name: "Naomi", role: "Wife he left behind through death" },
      { name: "Mahlon", role: "Son who married Ruth" },
      { name: "Chilion", role: "Son who married Orpah" }
    ],
    lessonsAndReflection: [
      "Running from God's plan does not escape suffering—it often multiplies it.",
      "The place of God's provision may look empty before it looks full.",
      "Even failed decisions can be redeemed by God's sovereign grace."
    ],
    relatedCharacters: ["naomi", "ruth", "boaz", "orpah"],
    situations: [
      {
        id: "elimelech-leaves-bethlehem",
        title: "Leaving Bethlehem for Moab",
        category: "Fear",
        reference: "Ruth 1:1-2",
        keyVerse: "A certain man of Bethlehem-judah went to sojourn in the country of Moab.",
        situation: "A severe famine struck Bethlehem, and Elimelech had to decide whether to stay in God's land or seek provision in Moab.",
        pressure: "His family was hungry, and the famine showed no signs of ending.",
        innerBattle: "Stay and trust God in the House of Bread, or go where the food is?",
        response: "He took his family to Moab—a land of pagan worship and Israel's historic enemy.",
        outcome: "He and both sons died in Moab, leaving Naomi a destitute widow in a foreign land.",
        lesson: "Seeking provision outside of God's plan often leads to greater loss.",
        traitRevealed: "Fear-driven pragmatism",
        spiritualPrinciple: "God's provision may come through the famine, not around it.",
        reflectionQuestions: [
          "Have you ever left God's plan because it looked like it was not providing?",
          "What Moab are you tempted to run to when life in Bethlehem gets hard?",
          "Can you trust that the House of Bread will live up to its name?"
        ],
        dnaSnapshot: { fear: 4, faith: 2, wisdom: 2 }
      }
    ]
  },
  // ============================================
  // 47. ORPAH
  // ============================================
  {
    id: "orpah",
    name: "Orpah",
    meaning: "Back of the neck (one who turns away)",
    emoji: "👋",
    role: "Ruth's sister-in-law who turned back to Moab",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Ruth 1:4-14"],
    archetypes: ["Tragic Hero"],
    dna: { faith: 1, humility: 3, courage: 1, wisdom: 2, compassion: 3, fear: 4, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Initial loyalty and genuine affection for Naomi",
      weakness: "Chose the familiar and safe over the unknown and faithful",
      mindset: "I love Naomi, but I cannot leave everything I know",
      keyLesson: "Following God often means leaving what is comfortable, and not everyone is willing.",
      keyVerse: "And Orpah kissed her mother in law; but Ruth clave unto her.",
      keyVerseRef: "Ruth 1:14"
    },
    storyArc: "A Moabite woman who married Naomi's son Chilion, wept at the prospect of parting from Naomi, kissed her goodbye, but ultimately turned back to her people and her gods—choosing comfort over covenant.",
    therapyView: {
      drivingFears: ["The unknown", "Poverty and rejection in a foreign land", "Leaving her identity behind"],
      coreMotivations: ["Security", "Familiarity", "Belonging to her own people"],
      relationalStyle: "Affectionate but ultimately self-preserving",
      blindSpots: ["Could not see that the unknown path with God was better than the familiar path without Him"],
      healingMoments: ["Her genuine tears for Naomi—her affection was real even if her commitment was not"]
    },
    strengths: ["Genuine affection", "Emotional honesty", "Initial willingness to follow"],
    weaknesses: ["Fear of the unknown", "Choosing comfort over faith", "Returning to her gods"],
    journey: [
      { phase: "Calling", description: "Married into Naomi's family and encountered Israel's God" },
      { phase: "Testing", description: "Naomi urged her to return to Moab for security" },
      { phase: "Failure", description: "Chose to return to Moab and her gods" },
      { phase: "Legacy", description: "She vanished from the biblical narrative—a cautionary contrast to Ruth" }
    ],
    relationships: [
      { name: "Naomi", role: "Mother-in-law she loved but left" },
      { name: "Ruth", role: "Sister-in-law whose opposite choice changed history" },
      { name: "Chilion", role: "Husband who died in Moab" }
    ],
    lessonsAndReflection: [
      "Affection is not the same as commitment.",
      "The kiss goodbye can be the most tragic moment in a life.",
      "Choosing the familiar over the faithful can cost you a destiny."
    ],
    relatedCharacters: ["ruth", "naomi", "elimelech"],
    situations: [
      {
        id: "orpah-turns-back",
        title: "Turning Back to Moab",
        category: "Faith Testing",
        reference: "Ruth 1:8-14",
        keyVerse: "And Orpah kissed her mother in law; but Ruth clave unto her.",
        situation: "Naomi urged both daughters-in-law to return to their Moabite families for security, since she had nothing to offer them.",
        pressure: "Following Naomi meant poverty, foreignness, and an uncertain future in Israel.",
        innerBattle: "I love Naomi, but I cannot face a life of poverty and rejection in a foreign land.",
        response: "Orpah wept, kissed Naomi, and turned back to Moab and her gods.",
        outcome: "She disappeared from the biblical story while Ruth went on to become an ancestor of David and Jesus.",
        lesson: "The difference between a good start and a great finish is the willingness to keep going.",
        traitRevealed: "Choosing comfort over covenant",
        spiritualPrinciple: "Many are called, but few choose the costly path of faithfulness.",
        reflectionQuestions: [
          "Is there a moment where you kissed goodbye something you should have held onto?",
          "What familiar comfort is holding you back from God's best?",
          "How do you respond when following God looks like it leads to loss?"
        ],
        dnaSnapshot: { fear: 4, compassion: 3, faith: 1 }
      }
    ]
  },
  // ============================================
  // 48. JESSE
  // ============================================
  {
    id: "jesse",
    name: "Jesse",
    meaning: "Gift or wealthy",
    emoji: "🌳",
    role: "Father of King David",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 16:1-13", "1 Samuel 17:12-20", "Isaiah 11:1"],
    archetypes: ["Patriarch"],
    dna: { faith: 3, humility: 3, courage: 2, wisdom: 3, compassion: 3, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Raised a family that included the greatest king of Israel",
      weakness: "Overlooked his youngest son's potential",
      mindset: "My older sons are the impressive ones",
      keyLesson: "The one you overlook may be the one God has chosen.",
      keyVerse: "There remaineth yet the youngest, and, behold, he keepeth the sheep.",
      keyVerseRef: "1 Samuel 16:11"
    },
    storyArc: "A Bethlehemite father of eight sons who presented seven to Samuel for anointing but forgot his youngest, David—the very one God had chosen—revealing that human judgment of worth and divine calling are often completely different.",
    therapyView: {
      drivingFears: ["Saul's wrath reaching his family", "Not living up to expectations"],
      coreMotivations: ["Family provision", "Social standing", "Obedience to tradition"],
      relationalStyle: "Traditional patriarch who valued the expected over the exceptional",
      blindSpots: ["Overlooked David entirely", "Judged potential by appearance and birth order"],
      healingMoments: ["Witnessing his youngest son anointed as king of Israel"]
    },
    strengths: ["Raised eight sons", "Respected in Bethlehem", "Obedient to Samuel"],
    weaknesses: ["Overlooked David", "Judged by external appearances", "Conventional thinking"],
    journey: [
      { phase: "Calling", description: "A prosperous Bethlehemite and father of eight" },
      { phase: "Testing", description: "Samuel came looking for a king among his sons" },
      { phase: "Legacy", description: "His family line produced David and ultimately Jesus—the Root of Jesse" }
    ],
    relationships: [
      { name: "David", role: "Youngest son, chosen by God as king" },
      { name: "Samuel", role: "Prophet who came to anoint one of his sons" },
      { name: "Eliab", role: "Eldest son whom both Jesse and Samuel initially expected God to choose" }
    ],
    lessonsAndReflection: [
      "God sees what we overlook.",
      "The least likely candidate may be God's first choice.",
      "Never judge potential by birth order, appearance, or current role."
    ],
    relatedCharacters: ["david", "samuel"],
    situations: [
      {
        id: "jesse-overlooks-david",
        title: "Overlooking David at the Anointing",
        category: "Calling",
        reference: "1 Samuel 16:10-13",
        keyVerse: "There remaineth yet the youngest, and, behold, he keepeth the sheep.",
        situation: "Samuel came to anoint one of Jesse's sons as the next king, and Jesse paraded seven sons before the prophet.",
        pressure: "The prophet of God was at his house, and Jesse wanted to present his best.",
        innerBattle: "Surely one of my older, more impressive sons is the one God wants.",
        response: "Jesse did not even think to bring David from the fields until Samuel asked if there were more sons.",
        outcome: "David, the overlooked shepherd boy, was the one God had chosen all along.",
        lesson: "The one you leave in the field may be the one God puts on the throne.",
        traitRevealed: "Human blindness to divine choice",
        spiritualPrinciple: "Man looks on the outward appearance, but the LORD looks on the heart.",
        reflectionQuestions: [
          "Who in your life have you overlooked or undervalued?",
          "Do you judge people by external appearances or by their heart?",
          "Could God be preparing someone you have dismissed?"
        ],
        dnaSnapshot: { wisdom: 3, humility: 3, faith: 3 }
      }
    ]
  },
  // ============================================
  // 49. PENINNAH
  // ============================================
  {
    id: "peninnah",
    name: "Peninnah",
    meaning: "Pearl or coral",
    emoji: "😤",
    role: "Hannah's rival wife who provoked her",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["1 Samuel 1:1-7"],
    archetypes: ["Manipulator"],
    dna: { faith: 1, humility: 1, courage: 2, wisdom: 1, compassion: 0, fear: 3, pride: 4, greed: 2 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Fertility in a culture that valued children above all",
      weakness: "Cruelty born from insecurity",
      mindset: "I have children and you do not—I am more blessed",
      keyLesson: "Using your blessings to wound others reveals deep insecurity, not superiority.",
      keyVerse: "And her adversary also provoked her sore, for to make her fret, because the LORD had shut up her womb.",
      keyVerseRef: "1 Samuel 1:6"
    },
    storyArc: "Elkanah's other wife who had children while Hannah was barren, and who relentlessly provoked Hannah about her childlessness year after year, driving Hannah to the desperate prayer that produced Samuel.",
    therapyView: {
      drivingFears: ["Being second to Hannah in Elkanah's affections", "Losing her only source of status"],
      coreMotivations: ["Proving her worth through children", "Compensating for Elkanah's preference for Hannah"],
      relationalStyle: "Competitive, cruel, and insecure beneath the surface",
      blindSpots: ["Could not see that her cruelty revealed her own insecurity", "Failed to recognize that her provocation served God's purposes"],
      healingMoments: ["None recorded—she fades from the narrative once Hannah is blessed"]
    },
    strengths: ["Fertility (in cultural context)"],
    weaknesses: ["Cruelty", "Insecurity", "Using blessings as weapons"],
    journey: [
      { phase: "Calling", description: "Wife of Elkanah and mother of children" },
      { phase: "Failure", description: "Relentlessly provoked Hannah about her barrenness" },
      { phase: "Legacy", description: "Her cruelty unwittingly drove Hannah to the prayer that changed Israel's history" }
    ],
    relationships: [
      { name: "Hannah", role: "Rival wife she provoked mercilessly" },
      { name: "Elkanah", role: "Husband who loved Hannah more" }
    ],
    lessonsAndReflection: [
      "Using your blessings to wound others is a sign of insecurity, not superiority.",
      "God can use even cruel provocation to drive His people to prayer.",
      "The one who mocks another's barrenness may end up forgotten while the barren one's child changes history."
    ],
    relatedCharacters: ["hannah", "elkanah", "samuel"],
    situations: [
      {
        id: "peninnah-provokes-hannah",
        title: "Provoking Hannah Year After Year",
        category: "Conflict",
        reference: "1 Samuel 1:6-7",
        keyVerse: "Her adversary also provoked her sore, for to make her fret.",
        situation: "Every year when the family went to Shiloh to worship, Peninnah relentlessly mocked Hannah's barrenness.",
        pressure: "Peninnah felt insecure because Elkanah loved Hannah more, and her children were her only advantage.",
        innerBattle: "He loves her more, but I have what she cannot have—and I will make sure she knows it.",
        response: "She provoked Hannah year after year, making her weep and refuse to eat.",
        outcome: "Her cruelty drove Hannah to the anguished prayer that produced Samuel, Israel's greatest judge.",
        lesson: "What the enemy means for harm, God uses for His purposes.",
        traitRevealed: "Insecurity masked as cruelty",
        spiritualPrinciple: "God turns the weapons of the cruel into catalysts for His greatest works.",
        reflectionQuestions: [
          "Have you ever used your blessings to make someone else feel inferior?",
          "Is there an area where insecurity drives you to cruelty?",
          "Can you see how God has used painful provocations to draw you closer to Him?"
        ],
        dnaSnapshot: { pride: 4, fear: 3, compassion: 0 }
      }
    ]
  },
  // ============================================
  // 50. ELKANAH
  // ============================================
  {
    id: "elkanah",
    name: "Elkanah",
    meaning: "God has created",
    emoji: "🤷",
    role: "Hannah's loving but limited husband",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["1 Samuel 1:1-28", "1 Samuel 2:20"],
    archetypes: ["Patriarch"],
    dna: { faith: 3, humility: 3, courage: 2, wisdom: 2, compassion: 4, fear: 2, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Genuine love and compassion for Hannah",
      weakness: "Could not fix her pain and did not fully understand it",
      mindset: "Am I not worth more to you than ten sons?",
      keyLesson: "Love alone cannot fix spiritual longing—only God can fill the deepest voids.",
      keyVerse: "Am not I better to thee than ten sons?",
      keyVerseRef: "1 Samuel 1:8"
    },
    storyArc: "A devout Levite who loved his barren wife Hannah deeply, gave her a double portion at worship, tried to comfort her with his love, but could not understand that her anguish required a divine answer, not just a human one.",
    therapyView: {
      drivingFears: ["Being unable to heal Hannah's pain", "His family being torn apart by rivalry"],
      coreMotivations: ["Loving Hannah", "Faithful worship", "Family harmony"],
      relationalStyle: "Loving, devoted, but emotionally limited in understanding deep pain",
      blindSpots: ["Thought his love should be enough to fill Hannah's void", "Did not confront Peninnah's cruelty"],
      healingMoments: ["Supporting Hannah's vow to dedicate Samuel to the Lord"]
    },
    strengths: ["Genuine love", "Faithful worship", "Devotion to Hannah"],
    weaknesses: ["Limited understanding of deep spiritual longing", "Failure to confront Peninnah", "Inability to fix what only God could"],
    journey: [
      { phase: "Calling", description: "A Levite devoted to worship and family" },
      { phase: "Testing", description: "Watched helplessly as Hannah suffered and Peninnah provoked" },
      { phase: "Refinement", description: "Supported Hannah's vow to dedicate Samuel to the Lord" },
      { phase: "Legacy", description: "Father of Samuel and a model of imperfect but genuine love" }
    ],
    relationships: [
      { name: "Hannah", role: "Beloved wife whose pain he could not fully understand" },
      { name: "Peninnah", role: "Other wife whose cruelty he failed to stop" },
      { name: "Samuel", role: "Son born of Hannah's prayer whom they dedicated to God" }
    ],
    lessonsAndReflection: [
      "Human love, however genuine, cannot fill a void that only God can fill.",
      "Failing to confront cruelty enables it.",
      "Supporting your spouse's calling sometimes means letting go of what you love most."
    ],
    relatedCharacters: ["hannah", "samuel", "peninnah"],
    situations: [
      {
        id: "elkanah-comforts-hannah",
        title: "Trying to Comfort Hannah",
        category: "Loss",
        reference: "1 Samuel 1:8",
        keyVerse: "Am not I better to thee than ten sons?",
        situation: "Hannah was weeping and refusing to eat because of her barrenness and Peninnah's cruel provocation.",
        pressure: "Elkanah loved Hannah deeply and could not bear to see her suffering but had no solution to offer.",
        innerBattle: "Why is my love not enough for her? What more can I do?",
        response: "He offered his love as a substitute for her deepest longing, asking if he was not worth more than ten sons.",
        outcome: "His words, while loving, could not touch her pain. Only her desperate prayer to God brought the answer.",
        lesson: "Some longings can only be answered by God, and the loving response is to support the person's pursuit of Him.",
        traitRevealed: "Well-meaning inadequacy",
        spiritualPrinciple: "Human love points toward but cannot replace divine provision.",
        reflectionQuestions: [
          "Have you ever tried to be enough for someone whose need only God could meet?",
          "How do you support loved ones whose pain you cannot fix?",
          "Are there deep longings in your life that no human relationship can satisfy?"
        ],
        dnaSnapshot: { compassion: 4, faith: 3, wisdom: 2 }
      }
    ]
  },
];
