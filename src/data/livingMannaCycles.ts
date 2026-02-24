// Living Manna 12 Six-Week Study Cycles
// Sanctuary-centered, Christ-exalting discipleship engine
// A complete journey through the sanctuary from the Gate to the Full Sanctuary

export interface CycleWeek {
  weekNumber: number; // 1-6
  title: string;
  theme: string;
  scriptureFocus: string; // Primary scripture reference
  outcome: string; // What the student should gain
  discussionQuestions: string[]; // 3-4 questions
  ptRooms: string[]; // Which Palace rooms connect (e.g., "Blue Room", "Red Room", "Gold Room", "Purple Room", "Green Room", "White Room")
}

export interface StudyCycle {
  id: string;
  title: string;
  description: string;
  sequenceNumber: number; // 1-12
  sanctuaryFocus: string; // e.g., "Outer Court", "Laver", "Candlestick", "Table of Showbread", "Altar of Incense", "Ark of the Covenant", "Most Holy Place", "Full Sanctuary"
  goal: string;
  weeks: CycleWeek[];
}

// ---------------------------------------------------------------------------
// CYCLE 1 — THE GATE: ENTERING GOD'S PRESENCE
// ---------------------------------------------------------------------------
const cycle1: StudyCycle = {
  id: "cycle-1-the-gate",
  title: "The Gate \u2013 Entering God\u2019s Presence",
  description:
    "Coming to Christ, accepting salvation, and understanding the cross. The gate of the sanctuary was the only way in \u2013 and Jesus is the only way to the Father.",
  sequenceNumber: 1,
  sanctuaryFocus: "Outer Court",
  goal: "Lead the student into a genuine experience of salvation through faith in Christ, understanding why the gate is the starting point of all true worship.",
  weeks: [
    {
      weekNumber: 1,
      title: "One Door, One Way",
      theme: "Christ as the only entrance to salvation",
      scriptureFocus: "John 10:9; John 14:6; Acts 4:12",
      outcome:
        "The student will understand that Jesus is the exclusive way of salvation and will be able to articulate why one door does not make God narrow but makes Him clear.",
      discussionQuestions: [
        "Why did God design a single gate for the sanctuary courtyard, and what does that tell us about how He deals with humanity?",
        "How does Jesus\u2019 statement \u2018I am the door\u2019 (John 10:9) challenge the modern idea that all spiritual paths lead to God?",
        "In what ways have you tried to enter God\u2019s presence through a door of your own making?",
        "How should the exclusivity of Christ as the Way shape the way we share the gospel with others?"
      ],
      ptRooms: ["Blue Room", "White Room"]
    },
    {
      weekNumber: 2,
      title: "The Call to Come",
      theme: "God\u2019s invitation and our response",
      scriptureFocus: "Isaiah 1:18; Matthew 11:28\u201330; Revelation 22:17",
      outcome:
        "The student will grasp that salvation begins with God\u2019s initiative and our willing response, and will personally accept or reaffirm the invitation.",
      discussionQuestions: [
        "What does it reveal about God\u2019s character that He says \u2018Come now, and let us reason together\u2019 (Isaiah 1:18) rather than simply condemning?",
        "Why does Jesus describe His yoke as \u2018easy\u2019 and His burden as \u2018light\u2019 when discipleship is clearly costly?",
        "What barriers in your life have kept you from fully responding to God\u2019s invitation?",
        "How can we extend God\u2019s \u2018Come\u2019 to people who believe they are too far gone?"
      ],
      ptRooms: ["Blue Room", "Gold Room"]
    },
    {
      weekNumber: 3,
      title: "Saved by Grace Through Faith",
      theme: "The mechanics of justification",
      scriptureFocus: "Ephesians 2:8\u201310; Romans 3:23\u201326; Titus 3:4\u20137",
      outcome:
        "The student will articulate the difference between earning salvation and receiving it, and will rest in the assurance that comes from grace alone through faith alone.",
      discussionQuestions: [
        "How does Paul\u2019s phrase \u2018not of yourselves; it is the gift of God\u2019 (Ephesians 2:8) dismantle both legalism and cheap grace?",
        "What does it mean that we are \u2018justified freely by His grace through the redemption that is in Christ Jesus\u2019 (Romans 3:24)?",
        "If salvation is a gift, why do many Christians still live as though they must earn God\u2019s approval?",
        "How do you explain to someone that grace is free but not cheap?"
      ],
      ptRooms: ["Gold Room", "White Room"]
    },
    {
      weekNumber: 4,
      title: "The Cross \u2013 God\u2019s Eternal Plan",
      theme: "Understanding the atonement",
      scriptureFocus: "Isaiah 53:4\u20136; 1 Peter 2:24; Hebrews 9:22",
      outcome:
        "The student will have a deeper appreciation for the cost of the cross and will understand substitutionary atonement as the heartbeat of the gospel.",
      discussionQuestions: [
        "Why does Isaiah 53:5 say He was wounded \u2018for our transgressions\u2019 rather than His own \u2013 and what does that demand of us?",
        "How does the sanctuary truth that \u2018without shedding of blood is no remission\u2019 (Hebrews 9:22) protect us from trivialising sin?",
        "In what practical ways can meditating on the cross change the way you handle temptation this week?",
        "How do you respond to those who say a loving God would never require a sacrifice?"
      ],
      ptRooms: ["Red Room", "Gold Room"]
    },
    {
      weekNumber: 5,
      title: "Repentance \u2013 The Turning Point",
      theme: "Godly sorrow that produces change",
      scriptureFocus: "Acts 2:37\u201338; 2 Corinthians 7:10; Psalm 51:10\u201312",
      outcome:
        "The student will distinguish true repentance from mere remorse and will experience the freedom that comes from a genuinely broken and contrite heart.",
      discussionQuestions: [
        "What is the difference between the \u2018godly sorrow\u2019 Paul describes and the worldly sorrow that leads to death (2 Corinthians 7:10)?",
        "When Peter\u2019s hearers were \u2018pricked in their heart\u2019 (Acts 2:37), what moved them from conviction to action?",
        "David prayed \u2018Create in me a clean heart\u2019 (Psalm 51:10). Why did he say \u2018create\u2019 rather than \u2018repair\u2019?",
        "How can our small groups be a safe space for genuine repentance without becoming places of shame?"
      ],
      ptRooms: ["Red Room", "Blue Room"]
    },
    {
      weekNumber: 6,
      title: "Assurance \u2013 Standing in the Gate",
      theme: "Confidence in salvation",
      scriptureFocus: "Romans 8:1, 31\u201339; 1 John 5:11\u201313; John 5:24",
      outcome:
        "The student will have settled assurance of salvation rooted in Christ\u2019s finished work, not in personal performance, and will be ready to move deeper into the sanctuary.",
      discussionQuestions: [
        "Paul declares \u2018no condemnation\u2019 for those in Christ (Romans 8:1). Why do many believers still live under a cloud of guilt?",
        "What does John mean by saying \u2018these things have I written unto you\u2026 that ye may know\u2019 (1 John 5:13)? Is assurance possible?",
        "How does Romans 8:38\u201339 address the fear that something could separate us from God\u2019s love?",
        "As you complete this first cycle, what has changed in your understanding of entering God\u2019s presence?"
      ],
      ptRooms: ["Gold Room", "White Room", "Blue Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 2 — THE ALTAR OF BURNT OFFERING: SURRENDER
// ---------------------------------------------------------------------------
const cycle2: StudyCycle = {
  id: "cycle-2-altar-of-burnt-offering",
  title: "The Altar of Burnt Offering \u2013 Surrender",
  description:
    "Complete surrender, dying to self, and consecration. At the brazen altar the sacrifice was laid down entirely \u2013 nothing was held back.",
  sequenceNumber: 2,
  sanctuaryFocus: "Outer Court",
  goal: "Guide the student into a life of full surrender where self is placed on the altar and Christ becomes Lord of every area.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Whole Burnt Offering",
      theme: "Total consecration pictured in the Levitical sacrifice",
      scriptureFocus: "Leviticus 1:1\u20139; Romans 12:1\u20132",
      outcome:
        "The student will understand that the burnt offering represented complete devotion and will identify areas of life not yet surrendered.",
      discussionQuestions: [
        "Why was the burnt offering consumed entirely on the altar, and what does that teach about the kind of surrender God desires?",
        "What does Paul mean by presenting our bodies as \u2018a living sacrifice\u2019 (Romans 12:1), and why does he call it \u2018reasonable service\u2019?",
        "What areas of your life are you tempted to keep off the altar?",
        "How does the fact that God provided the fire (Leviticus 9:24) encourage us that He empowers what He commands?"
      ],
      ptRooms: ["Red Room", "Gold Room"]
    },
    {
      weekNumber: 2,
      title: "Dying to Self Daily",
      theme: "The crucified life",
      scriptureFocus: "Luke 9:23\u201325; Galatians 2:20; 1 Corinthians 15:31",
      outcome:
        "The student will embrace the daily discipline of self-denial and understand that resurrection life is on the other side of the cross.",
      discussionQuestions: [
        "Jesus said \u2018If any man will come after me, let him deny himself, and take up his cross daily\u2019 (Luke 9:23). Why the word \u2018daily\u2019?",
        "Paul wrote \u2018I die daily\u2019 (1 Corinthians 15:31). What does daily death to self look like in a modern context?",
        "How is Galatians 2:20 both the hardest and the most liberating verse in the New Testament?",
        "What is the difference between self-denial and self-hatred?"
      ],
      ptRooms: ["Red Room", "Purple Room"]
    },
    {
      weekNumber: 3,
      title: "Abraham\u2019s Altar \u2013 Surrendering the Precious",
      theme: "Offering what we love most",
      scriptureFocus: "Genesis 22:1\u201314; Hebrews 11:17\u201319",
      outcome:
        "The student will identify his or her own \u2018Isaac\u2019 and take steps toward placing it on the altar of trust.",
      discussionQuestions: [
        "Why did God ask Abraham to sacrifice the very son through whom the promise was to be fulfilled?",
        "What does it reveal about Abraham\u2019s faith that he believed God \u2018was able to raise him up, even from the dead\u2019 (Hebrews 11:19)?",
        "What is your \u2018Isaac\u2019 \u2013 the blessing you hold so tightly that it has become an obstacle to full surrender?",
        "How does God\u2019s provision of the ram (Genesis 22:13) assure us that He always supplies what He demands?"
      ],
      ptRooms: ["Gold Room", "Blue Room"]
    },
    {
      weekNumber: 4,
      title: "The Cost of Discipleship",
      theme: "Counting the cost before building",
      scriptureFocus: "Luke 14:25\u201333; Philippians 3:7\u201310",
      outcome:
        "The student will have honestly counted the cost of following Christ and will affirm that knowing Him surpasses every loss.",
      discussionQuestions: [
        "Why does Jesus say we must \u2018hate\u2019 our own family and even our own life to be His disciple (Luke 14:26)? Is this literal?",
        "Paul counted everything as \u2018dung\u2019 compared to knowing Christ (Philippians 3:8, KJV). What have you found hardest to release?",
        "What is the danger of starting to follow Christ without counting the cost (Luke 14:28\u201330)?",
        "How do we help new believers count the cost without scaring them away?"
      ],
      ptRooms: ["Red Room", "Purple Room", "Gold Room"]
    },
    {
      weekNumber: 5,
      title: "Surrender of the Will",
      theme: "Gethsemane \u2013 \u2018Not my will, but Thine\u2019",
      scriptureFocus: "Matthew 26:36\u201342; James 4:7\u201310; Proverbs 3:5\u20136",
      outcome:
        "The student will make a conscious decision to yield personal will to God\u2019s will in specific areas and will practise submissive prayer.",
      discussionQuestions: [
        "What was at stake in Gethsemane when Jesus prayed \u2018not my will, but thine, be done\u2019 (Luke 22:42)?",
        "James says \u2018Submit yourselves therefore to God\u2019 (James 4:7). Why is submission listed before \u2018resist the devil\u2019?",
        "How does trusting God with \u2018all thine heart\u2019 (Proverbs 3:5) differ from understanding things with our own logic?",
        "In what specific decision right now do you need to pray \u2018Not my will, but Thine\u2019?"
      ],
      ptRooms: ["Purple Room", "Blue Room"]
    },
    {
      weekNumber: 6,
      title: "Fire on the Altar \u2013 God Accepts the Sacrifice",
      theme: "The response of heaven when we fully surrender",
      scriptureFocus: "1 Kings 18:36\u201339; 2 Chronicles 7:1\u20133; Malachi 3:2\u20133",
      outcome:
        "The student will understand that God responds to full surrender with His presence and power, and will testify of breakthrough areas resulting from this cycle.",
      discussionQuestions: [
        "When Elijah\u2019s sacrifice was complete, fire fell (1 Kings 18:38). What does this teach about the sequence of surrender and divine response?",
        "At Solomon\u2019s temple dedication the fire came down and the glory filled the house (2 Chronicles 7:1). What had Solomon done first?",
        "How is God like a \u2018refiner\u2019s fire\u2019 (Malachi 3:2), and why is that good news for the surrendered soul?",
        "As this cycle closes, where have you seen God\u2019s fire fall in your life because you put something on the altar?"
      ],
      ptRooms: ["Red Room", "Gold Room", "White Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 3 — THE LAVER: CLEANSING & RENEWAL
// ---------------------------------------------------------------------------
const cycle3: StudyCycle = {
  id: "cycle-3-the-laver",
  title: "The Laver \u2013 Cleansing & Renewal",
  description:
    "Baptism, sanctification, and the Word as a mirror. The priests washed at the laver before entering the Holy Place \u2013 purity is the prerequisite for service.",
  sequenceNumber: 3,
  sanctuaryFocus: "Laver",
  goal: "Establish the student in the ongoing work of sanctification through the cleansing power of the Word and the Spirit.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Laver of Brass \u2013 Washing Before Serving",
      theme: "Holiness required for ministry",
      scriptureFocus: "Exodus 30:17\u201321; John 13:8\u201310; Hebrews 10:22",
      outcome:
        "The student will understand that cleansing is not optional but essential for those who would serve God.",
      discussionQuestions: [
        "Why did God command the priests to wash their hands and feet at the laver on pain of death (Exodus 30:20\u201321)?",
        "When Jesus washed the disciples\u2019 feet He said \u2018If I wash thee not, thou hast no part with me\u2019 (John 13:8). What deeper truth was He teaching?",
        "What does it mean to draw near with \u2018our hearts sprinkled from an evil conscience, and our bodies washed with pure water\u2019 (Hebrews 10:22)?",
        "In what area of your life do you need to come to the laver before moving forward in ministry?"
      ],
      ptRooms: ["Blue Room", "White Room"]
    },
    {
      weekNumber: 2,
      title: "Baptism \u2013 Buried and Raised",
      theme: "The meaning of baptism by immersion",
      scriptureFocus: "Romans 6:3\u20136; Acts 2:38; Colossians 2:12",
      outcome:
        "The student will understand baptism as a public declaration of death to the old life and resurrection to the new, and unbaptised students will be led toward decision.",
      discussionQuestions: [
        "Paul says we are \u2018buried with Him by baptism into death\u2019 (Romans 6:4). Why is burial imagery essential to understand baptism?",
        "Peter commanded \u2018Repent, and be baptized\u2019 (Acts 2:38). Why does repentance precede baptism?",
        "How does Colossians 2:12 connect baptism with faith in the operation of God?",
        "If you have been baptised, what does your baptism mean to you today? If not, what is holding you back?"
      ],
      ptRooms: ["Blue Room", "Green Room"]
    },
    {
      weekNumber: 3,
      title: "The Word as Mirror",
      theme: "Scripture reveals who we truly are",
      scriptureFocus: "James 1:22\u201325; Psalm 119:9\u201311; Hebrews 4:12",
      outcome:
        "The student will develop the habit of approaching Scripture as a mirror that reveals and transforms, not just a textbook that informs.",
      discussionQuestions: [
        "James compares the man who hears but does not do to someone who looks in a mirror and forgets his appearance (James 1:23\u201324). How does this happen spiritually?",
        "The psalmist asks \u2018Wherewithal shall a young man cleanse his way?\u2019 and answers \u2018by taking heed thereto according to thy word\u2019 (Psalm 119:9). How do we \u2018take heed\u2019?",
        "How is the Word \u2018sharper than any twoedged sword\u2019 (Hebrews 4:12) both comforting and confronting?",
        "What has the Word revealed to you about yourself recently that you needed to see?"
      ],
      ptRooms: ["Blue Room", "Gold Room"]
    },
    {
      weekNumber: 4,
      title: "Sanctification \u2013 Being Set Apart",
      theme: "The ongoing process of holiness",
      scriptureFocus: "1 Thessalonians 4:3\u20137; John 17:17; 2 Corinthians 7:1",
      outcome:
        "The student will embrace sanctification as both a position in Christ and a daily process empowered by the Spirit.",
      discussionQuestions: [
        "Paul says \u2018This is the will of God, even your sanctification\u2019 (1 Thessalonians 4:3). How does knowing it is God\u2019s will motivate and empower us?",
        "Jesus prayed \u2018Sanctify them through thy truth: thy word is truth\u2019 (John 17:17). What role does truth play in our holiness?",
        "What does it mean to \u2018cleanse ourselves from all filthiness of the flesh and spirit, perfecting holiness in the fear of God\u2019 (2 Corinthians 7:1)?",
        "Where in your life is sanctification most needed right now, and what step will you take this week?"
      ],
      ptRooms: ["White Room", "Purple Room"]
    },
    {
      weekNumber: 5,
      title: "Victory Over Habitual Sin",
      theme: "Breaking chains through the laver\u2019s power",
      scriptureFocus: "Romans 6:11\u201314; 1 Corinthians 10:13; 1 John 1:9",
      outcome:
        "The student will apply specific biblical strategies for overcoming recurring sin and will claim God\u2019s promise of a way of escape.",
      discussionQuestions: [
        "Paul commands us to \u2018reckon ye also yourselves to be dead indeed unto sin\u2019 (Romans 6:11). How is reckoning different from feeling?",
        "God is faithful and \u2018will not suffer you to be tempted above that ye are able\u2019 (1 Corinthians 10:13). Do you believe that? Why or why not?",
        "How does immediate confession (1 John 1:9) break the cycle of guilt and defeat?",
        "What practical accountability structures can help you walk in victory this week?"
      ],
      ptRooms: ["Blue Room", "Red Room"]
    },
    {
      weekNumber: 6,
      title: "Clean Hands and a Pure Heart",
      theme: "Integrity as the fruit of cleansing",
      scriptureFocus: "Psalm 24:3\u20135; Matthew 5:8; Titus 2:11\u201314",
      outcome:
        "The student will commit to a life of integrity and purity, understanding that cleansing at the laver qualifies us to ascend into God\u2019s holy hill.",
      discussionQuestions: [
        "Who shall ascend into the hill of the Lord? \u2018He that hath clean hands, and a pure heart\u2019 (Psalm 24:4). What is the difference between clean hands and a pure heart?",
        "Jesus said \u2018Blessed are the pure in heart: for they shall see God\u2019 (Matthew 5:8). How does purity of heart affect our ability to perceive God?",
        "How does grace \u2018teach us\u2019 to live \u2018soberly, righteously, and godly, in this present world\u2019 (Titus 2:12)?",
        "As you complete this cycle, how has your understanding of cleansing changed the way you approach God?"
      ],
      ptRooms: ["White Room", "Blue Room", "Gold Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 4 — THE CANDLESTICK: LIGHT OF THE WORLD
// ---------------------------------------------------------------------------
const cycle4: StudyCycle = {
  id: "cycle-4-the-candlestick",
  title: "The Candlestick \u2013 Light of the World",
  description:
    "The Holy Spirit\u2019s work, spiritual gifts, and being a witness. The seven-branched golden candlestick burned continually, fuelled by olive oil \u2013 a symbol of the Spirit.",
  sequenceNumber: 4,
  sanctuaryFocus: "Candlestick",
  goal: "Equip the student to walk in the power of the Holy Spirit, discover spiritual gifts, and shine as a faithful witness in a dark world.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Oil and the Flame",
      theme: "The Holy Spirit as the source of spiritual light",
      scriptureFocus: "Zechariah 4:1\u20136; John 16:13\u201314; Acts 1:8",
      outcome:
        "The student will understand that spiritual power and illumination come exclusively from the Holy Spirit, not human effort.",
      discussionQuestions: [
        "God told Zerubbabel \u2018Not by might, nor by power, but by my spirit\u2019 (Zechariah 4:6). Why is this the foundational truth for all ministry?",
        "Jesus promised the Spirit would \u2018guide you into all truth\u2019 (John 16:13). How do we position ourselves to receive that guidance?",
        "What does it mean to receive \u2018power, after that the Holy Ghost is come upon you\u2019 (Acts 1:8)?",
        "Where in your life have you been relying on might and power rather than the Spirit?"
      ],
      ptRooms: ["Gold Room", "Green Room"]
    },
    {
      weekNumber: 2,
      title: "Gifts of the Spirit",
      theme: "Discovering and deploying spiritual gifts",
      scriptureFocus: "1 Corinthians 12:4\u201311; Romans 12:6\u20138; Ephesians 4:11\u201313",
      outcome:
        "The student will identify at least one spiritual gift and develop a plan to use it for the building up of the body.",
      discussionQuestions: [
        "Paul says there are \u2018diversities of gifts, but the same Spirit\u2019 (1 Corinthians 12:4). Why does God distribute different gifts to different people?",
        "Romans 12:6\u20138 commands us to use our gifts with diligence. What gift do you believe God has given you?",
        "How does Ephesians 4:12 connect spiritual gifts to the \u2018perfecting of the saints\u2019?",
        "What hinders believers from discovering and exercising their spiritual gifts?"
      ],
      ptRooms: ["Green Room", "Gold Room"]
    },
    {
      weekNumber: 3,
      title: "The Fruit of the Spirit",
      theme: "Character as the evidence of the Spirit\u2019s presence",
      scriptureFocus: "Galatians 5:22\u201325; John 15:1\u20138; 2 Peter 1:5\u20138",
      outcome:
        "The student will evaluate his or her life against the fruit of the Spirit and pursue growth in the weakest area.",
      discussionQuestions: [
        "Why does Paul list the fruit of the Spirit (Galatians 5:22\u201323) as singular \u2018fruit\u2019 rather than \u2018fruits\u2019?",
        "Jesus said \u2018Every branch in me that beareth not fruit he taketh away\u2019 (John 15:2). How do we bear fruit and avoid barrenness?",
        "Peter outlines a ladder of growth (2 Peter 1:5\u20138). Which rung are you currently climbing?",
        "Which single fruit of the Spirit is most lacking in your life, and what will you do about it?"
      ],
      ptRooms: ["Green Room", "Purple Room"]
    },
    {
      weekNumber: 4,
      title: "You Are the Light",
      theme: "The believer\u2019s identity as a light-bearer",
      scriptureFocus: "Matthew 5:14\u201316; Philippians 2:14\u201316; Ephesians 5:8\u201311",
      outcome:
        "The student will accept the identity of a light-bearer and identify specific dark places where he or she is called to shine.",
      discussionQuestions: [
        "Jesus said \u2018Ye are the light of the world\u2019 (Matthew 5:14). He did not say \u2018try to be.\u2019 What does that identity statement mean?",
        "Paul says to shine \u2018as lights in the world\u2019 while doing \u2018all things without murmurings and disputings\u2019 (Philippians 2:14\u201315). Why is attitude connected to witness?",
        "What are the \u2018unfruitful works of darkness\u2019 we are to \u2018reprove\u2019 (Ephesians 5:11)?",
        "Where is the darkest place in your sphere of influence, and how can you bring light there?"
      ],
      ptRooms: ["Gold Room", "White Room"]
    },
    {
      weekNumber: 5,
      title: "Witnessing With Power",
      theme: "Spirit-empowered evangelism",
      scriptureFocus: "Acts 4:31\u201333; 1 Peter 3:15; Colossians 4:5\u20136",
      outcome:
        "The student will develop confidence in personal witnessing and will share a testimony or Bible truth with someone this week.",
      discussionQuestions: [
        "After the early church prayed, they \u2018spake the word of God with boldness\u2019 (Acts 4:31). What is the connection between prayer and bold witness?",
        "Peter says to \u2018be ready always to give an answer\u2019 with \u2018meekness and fear\u2019 (1 Peter 3:15). How do we balance readiness with humility?",
        "Paul instructs us to \u2018walk in wisdom toward them that are without\u2019 (Colossians 4:5). What does wise witnessing look like?",
        "Who in your life needs your witness this week, and what will you say?"
      ],
      ptRooms: ["Green Room", "Blue Room"]
    },
    {
      weekNumber: 6,
      title: "Keeping the Flame Burning",
      theme: "Sustaining spiritual fervour",
      scriptureFocus: "Leviticus 24:1\u20134; 2 Timothy 1:6\u20137; Revelation 2:4\u20135",
      outcome:
        "The student will develop practices to keep the fire of the Spirit burning and will guard against spiritual cooling.",
      discussionQuestions: [
        "The lamps were to burn \u2018continually\u2019 (Leviticus 24:2). What spiritual disciplines keep our flame alive?",
        "Paul told Timothy to \u2018stir up the gift of God\u2019 (2 Timothy 1:6). How do we stir up what the Spirit has given?",
        "Jesus told Ephesus \u2018thou hast left thy first love\u2019 (Revelation 2:4). How does a believer lose first love, and how is it recovered?",
        "What one commitment will you make to sustain the flame as you move into the next cycle?"
      ],
      ptRooms: ["Gold Room", "Red Room", "Green Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 5 — THE TABLE OF SHOWBREAD: FEEDING ON THE WORD
// ---------------------------------------------------------------------------
const cycle5: StudyCycle = {
  id: "cycle-5-table-of-showbread",
  title: "The Table of Showbread \u2013 Feeding on the Word",
  description:
    "Bible study methods, spiritual nutrition, and the devotional life. Twelve loaves were placed fresh every Sabbath \u2013 God\u2019s people need fresh bread daily.",
  sequenceNumber: 5,
  sanctuaryFocus: "Table of Showbread",
  goal: "Develop the student into a disciplined, effective Bible student who feeds daily on the Word and is able to feed others.",
  weeks: [
    {
      weekNumber: 1,
      title: "Man Shall Not Live by Bread Alone",
      theme: "The necessity of the Word for spiritual life",
      scriptureFocus: "Matthew 4:4; Deuteronomy 8:3; Jeremiah 15:16",
      outcome:
        "The student will recognise the Word of God as essential nourishment and will commit to daily intake.",
      discussionQuestions: [
        "Jesus quoted \u2018Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God\u2019 (Matthew 4:4) in the wilderness. Why did He use Scripture rather than miracles to defeat Satan?",
        "God allowed Israel to hunger so they would learn to depend on His word (Deuteronomy 8:3). Has God allowed spiritual hunger in your life for the same reason?",
        "Jeremiah said \u2018Thy words were found, and I did eat them; and thy word was unto me the joy and rejoicing of mine heart\u2019 (Jeremiah 15:16). How do you \u2018eat\u2019 the Word?",
        "What would happen to your spiritual health if you treated Bible study the way you treat physical meals?"
      ],
      ptRooms: ["Blue Room", "Gold Room"]
    },
    {
      weekNumber: 2,
      title: "How to Study the Bible",
      theme: "SDA hermeneutical principles",
      scriptureFocus: "Isaiah 28:9\u201310; 2 Timothy 2:15; Acts 17:11",
      outcome:
        "The student will learn and practise the \u2018line upon line, precept upon precept\u2019 method of Bible study and will handle the Word accurately.",
      discussionQuestions: [
        "God teaches \u2018precept upon precept; line upon line\u2019 (Isaiah 28:10). How does this method protect us from error?",
        "Paul tells Timothy to \u2018rightly divide the word of truth\u2019 (2 Timothy 2:15, KJV). What does rightly dividing look like practically?",
        "The Bereans \u2018searched the scriptures daily\u2019 (Acts 17:11). What habits made them noble, and how can we imitate them?",
        "What Bible study method have you used, and what new approach will you try this week?"
      ],
      ptRooms: ["Blue Room", "White Room"]
    },
    {
      weekNumber: 3,
      title: "Christ in All the Scriptures",
      theme: "Seeing Jesus from Genesis to Revelation",
      scriptureFocus: "Luke 24:27, 44; John 5:39; Hebrews 1:1\u20132",
      outcome:
        "The student will develop the habit of looking for Christ in every passage and will see the Bible as one unified story pointing to Jesus.",
      discussionQuestions: [
        "On the Emmaus road Jesus expounded \u2018in all the scriptures the things concerning himself\u2019 (Luke 24:27). Why did He start with Moses?",
        "Jesus said \u2018Search the scriptures; for\u2026they are they which testify of me\u2019 (John 5:39). How can we study the Bible and still miss Jesus?",
        "Hebrews says God \u2018hath in these last days spoken unto us by his Son\u2019 (Hebrews 1:2). How is Jesus the final Word of God?",
        "Pick one Old Testament passage. Where do you see Christ in it?"
      ],
      ptRooms: ["Gold Room", "Red Room"]
    },
    {
      weekNumber: 4,
      title: "Devotional Life \u2013 Morning Manna",
      theme: "Building a sustainable devotional rhythm",
      scriptureFocus: "Exodus 16:14\u201321; Psalm 5:3; Mark 1:35",
      outcome:
        "The student will establish or strengthen a consistent morning devotional habit modelled on Christ\u2019s own practice.",
      discussionQuestions: [
        "Israel gathered manna \u2018every man according to his eating\u2019 and it could not be stored overnight (Exodus 16:16, 20). What does this teach about daily dependence?",
        "David said \u2018My voice shalt thou hear in the morning\u2019 (Psalm 5:3). Why is morning the ideal time for devotion?",
        "Jesus \u2018rising up a great while before day\u2019 went out to pray (Mark 1:35). If the Son of God needed this, how much more do we?",
        "What specific plan will you implement for your morning devotional time this week?"
      ],
      ptRooms: ["Blue Room", "Purple Room"]
    },
    {
      weekNumber: 5,
      title: "Memorising and Meditating",
      theme: "Hiding the Word in the heart",
      scriptureFocus: "Psalm 119:11, 97; Joshua 1:8; Colossians 3:16",
      outcome:
        "The student will begin memorising Scripture and practising biblical meditation as weapons against sin and tools for growth.",
      discussionQuestions: [
        "The psalmist said \u2018Thy word have I hid in mine heart, that I might not sin against thee\u2019 (Psalm 119:11). How does memorised Scripture function as armour?",
        "God told Joshua to \u2018meditate therein day and night\u2019 (Joshua 1:8). What does biblical meditation look like, and how is it different from Eastern meditation?",
        "Paul says \u2018Let the word of Christ dwell in you richly\u2019 (Colossians 3:16). What does a richly indwelt life look like?",
        "What verse will you commit to memory this week, and how will you meditate on it?"
      ],
      ptRooms: ["Blue Room", "Green Room"]
    },
    {
      weekNumber: 6,
      title: "Teaching Others to Feed",
      theme: "Becoming a feeder of others",
      scriptureFocus: "Hebrews 5:12\u201314; 2 Timothy 2:2; John 21:15\u201317",
      outcome:
        "The student will move from consumer to contributor, taking responsibility to teach and feed others from the Word.",
      discussionQuestions: [
        "The Hebrews writer rebuked believers who \u2018have need that one teach you again\u2019 (Hebrews 5:12). How do we avoid perpetual spiritual infancy?",
        "Paul told Timothy to commit truth to \u2018faithful men, who shall be able to teach others also\u2019 (2 Timothy 2:2). Who are your \u2018faithful men\u2019?",
        "Three times Jesus said \u2018Feed my sheep\u2019 (John 21:15\u201317). What does spiritual feeding look like in practice?",
        "Who can you begin feeding spiritually this week, and what will you share with them?"
      ],
      ptRooms: ["Gold Room", "Green Room", "Blue Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 6 — THE ALTAR OF INCENSE: THE LIFE OF PRAYER
// ---------------------------------------------------------------------------
const cycle6: StudyCycle = {
  id: "cycle-6-altar-of-incense",
  title: "The Altar of Incense \u2013 The Life of Prayer",
  description:
    "Prayer types, intercession, and communion with God. The golden altar stood just before the veil, closest to God\u2019s presence \u2013 prayer is our nearest approach.",
  sequenceNumber: 6,
  sanctuaryFocus: "Altar of Incense",
  goal: "Transform the student from someone who says prayers into someone who lives a life of prayer, including intercession and spiritual warfare.",
  weeks: [
    {
      weekNumber: 1,
      title: "Incense Before the Lord",
      theme: "Prayer as sweet fragrance ascending to God",
      scriptureFocus: "Revelation 8:3\u20134; Psalm 141:2; Exodus 30:1\u20138",
      outcome:
        "The student will understand that prayer ascends to God\u2019s throne mingled with Christ\u2019s merits and will approach prayer with new reverence.",
      discussionQuestions: [
        "In Revelation 8:3\u20134 an angel offers incense with the prayers of the saints. What does it mean that our prayers are mixed with heavenly incense?",
        "David prayed \u2018Let my prayer be set forth before thee as incense\u2019 (Psalm 141:2). How does this picture change the way we view our daily prayers?",
        "The altar of incense burned perpetually (Exodus 30:8). What does continual prayer look like?",
        "How does knowing Christ adds His merits to our prayers affect your confidence before God?"
      ],
      ptRooms: ["Purple Room", "Gold Room"]
    },
    {
      weekNumber: 2,
      title: "Types of Prayer",
      theme: "Adoration, confession, thanksgiving, and supplication",
      scriptureFocus: "Philippians 4:6; 1 Timothy 2:1; Matthew 6:9\u201313",
      outcome:
        "The student will practise balanced prayer using adoration, confession, thanksgiving, and supplication rather than only petition.",
      discussionQuestions: [
        "Paul tells us to bring \u2018every thing by prayer and supplication with thanksgiving\u2019 (Philippians 4:6). Why is thanksgiving essential to prayer?",
        "Paul urges \u2018supplications, prayers, intercessions, and giving of thanks, be made for all men\u2019 (1 Timothy 2:1). How do these four differ?",
        "In the Lord\u2019s Prayer (Matthew 6:9\u201313), Jesus begins with worship before moving to requests. Why is that order important?",
        "Which type of prayer is most absent from your prayer life, and how will you grow in it?"
      ],
      ptRooms: ["Purple Room", "Blue Room"]
    },
    {
      weekNumber: 3,
      title: "Intercession \u2013 Standing in the Gap",
      theme: "Praying on behalf of others",
      scriptureFocus: "Ezekiel 22:30; James 5:16; 1 Samuel 12:23",
      outcome:
        "The student will develop an intercessory prayer list and commit to regular intercession for specific people and causes.",
      discussionQuestions: [
        "God said \u2018I sought for a man among them, that should\u2026stand in the gap\u2019 (Ezekiel 22:30). What does it mean to stand in the gap?",
        "James says \u2018The effectual fervent prayer of a righteous man availeth much\u2019 (James 5:16). What makes prayer \u2018effectual and fervent\u2019?",
        "Samuel said \u2018God forbid that I should sin against the LORD in ceasing to pray for you\u2019 (1 Samuel 12:23). Is failure to intercede actually sin?",
        "Who has God placed on your heart to intercede for, and what specifically will you pray?"
      ],
      ptRooms: ["Purple Room", "Red Room"]
    },
    {
      weekNumber: 4,
      title: "Praying in the Spirit",
      theme: "Spirit-directed, Word-saturated prayer",
      scriptureFocus: "Romans 8:26\u201327; Ephesians 6:18; Jude 1:20",
      outcome:
        "The student will learn to depend on the Holy Spirit in prayer, especially when words fail.",
      discussionQuestions: [
        "Paul says the Spirit \u2018maketh intercession for us with groanings which cannot be uttered\u2019 (Romans 8:26). How does the Spirit help our weakness in prayer?",
        "What does it mean to pray \u2018always with all prayer and supplication in the Spirit\u2019 (Ephesians 6:18)?",
        "Jude says \u2018building up yourselves\u2026praying in the Holy Ghost\u2019 (Jude 1:20). How does Spirit-led prayer build us up?",
        "How do you discern between praying from your own desires and praying in the Spirit?"
      ],
      ptRooms: ["Purple Room", "Green Room"]
    },
    {
      weekNumber: 5,
      title: "Hindrances to Prayer",
      theme: "Removing obstacles to answered prayer",
      scriptureFocus: "Isaiah 59:1\u20132; James 4:3; 1 Peter 3:7",
      outcome:
        "The student will identify and address specific hindrances to effective prayer in his or her own life.",
      discussionQuestions: [
        "Isaiah declares that \u2018your iniquities have separated between you and your God\u2019 (Isaiah 59:2). How does unconfessed sin block prayer?",
        "James says \u2018Ye ask, and receive not, because ye ask amiss\u2019 (James 4:3). What are wrong motives in prayer?",
        "Peter warns that poor treatment of a spouse can hinder prayers (1 Peter 3:7). Why do relationships affect our prayer life?",
        "What hindrance to prayer do you need to address this week?"
      ],
      ptRooms: ["Purple Room", "Red Room", "Blue Room"]
    },
    {
      weekNumber: 6,
      title: "A Life of Communion",
      theme: "Prayer as constant fellowship with God",
      scriptureFocus: "1 Thessalonians 5:17; Psalm 16:8\u201311; John 15:4\u20137",
      outcome:
        "The student will move beyond scheduled prayer times to a life of continual communion with God, abiding in Christ throughout the day.",
      discussionQuestions: [
        "Paul says \u2018Pray without ceasing\u2019 (1 Thessalonians 5:17). How is unceasing prayer possible in a busy life?",
        "David said \u2018I have set the LORD always before me\u2019 (Psalm 16:8). What practices help us maintain constant awareness of God?",
        "Jesus said \u2018Abide in me, and I in you\u2019 (John 15:4). How does abiding relate to the life of prayer?",
        "As you complete this cycle, what has changed in your prayer life, and what commitment will you carry forward?"
      ],
      ptRooms: ["Purple Room", "Gold Room", "White Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 7 — THE VEIL: ACCESS TO GOD
// ---------------------------------------------------------------------------
const cycle7: StudyCycle = {
  id: "cycle-7-the-veil",
  title: "The Veil \u2013 Access to God",
  description:
    "Christ as mediator, His High Priestly ministry, and the torn veil. The veil separated the Holy from the Most Holy \u2013 and Christ tore it open for us.",
  sequenceNumber: 7,
  sanctuaryFocus: "Ark of the Covenant",
  goal: "Help the student understand and experience bold access to God through Christ\u2019s mediatorial ministry in the heavenly sanctuary.",
  weeks: [
    {
      weekNumber: 1,
      title: "Behind the Veil",
      theme: "What the veil concealed and revealed",
      scriptureFocus: "Exodus 26:31\u201334; Hebrews 6:19\u201320; Hebrews 10:19\u201322",
      outcome:
        "The student will understand the veil as both a barrier and an invitation, pointing to Christ who opens the way into God\u2019s immediate presence.",
      discussionQuestions: [
        "The veil was made of \u2018blue, and purple, and scarlet, and fine twined linen\u2019 (Exodus 26:31). What do these colours represent about Christ?",
        "Our hope enters \u2018within the veil; whither the forerunner is for us entered\u2019 (Hebrews 6:19\u201320). What does it mean that Jesus is our forerunner?",
        "We are invited to enter \u2018the holiest by the blood of Jesus, by a new and living way\u2019 (Hebrews 10:19\u201320). How is this \u2018way\u2019 both new and living?",
        "How does the torn veil change the way you approach God in prayer?"
      ],
      ptRooms: ["Gold Room", "Purple Room"]
    },
    {
      weekNumber: 2,
      title: "Christ Our High Priest",
      theme: "Jesus\u2019 ongoing priestly ministry in heaven",
      scriptureFocus: "Hebrews 4:14\u201316; Hebrews 7:25; Hebrews 8:1\u20132",
      outcome:
        "The student will appreciate that Christ is not a retired Saviour but an active High Priest ministering on our behalf right now.",
      discussionQuestions: [
        "We have \u2018a great high priest, that is passed into the heavens, Jesus the Son of God\u2019 (Hebrews 4:14). Why is His heavenly location significant?",
        "He is \u2018able also to save them to the uttermost\u2019 because He \u2018ever liveth to make intercession\u2019 (Hebrews 7:25). What comfort does this give you?",
        "Christ is \u2018a minister of the sanctuary, and of the true tabernacle, which the Lord pitched, and not man\u2019 (Hebrews 8:2). How does the heavenly sanctuary relate to the earthly?",
        "How does Christ\u2019s current High Priestly ministry affect your daily Christian experience?"
      ],
      ptRooms: ["Gold Room", "Red Room"]
    },
    {
      weekNumber: 3,
      title: "The Torn Veil",
      theme: "Access through Christ\u2019s sacrifice",
      scriptureFocus: "Matthew 27:50\u201351; Mark 15:37\u201338; Hebrews 9:8\u201312",
      outcome:
        "The student will understand the cosmic significance of the veil tearing and will live in the boldness that Christ\u2019s death has purchased.",
      discussionQuestions: [
        "When Jesus died \u2018the veil of the temple was rent in twain from the top to the bottom\u2019 (Matthew 27:51). Why from top to bottom?",
        "The rending of the veil showed that \u2018the way into the holiest of all was not yet made manifest, while as the first tabernacle was yet standing\u2019 (Hebrews 9:8). What changed at the cross?",
        "Christ entered \u2018by his own blood\u2019 into the holy place, \u2018having obtained eternal redemption for us\u2019 (Hebrews 9:12). What does this eternal redemption include?",
        "In what ways do we sometimes act as though the veil is still intact?"
      ],
      ptRooms: ["Red Room", "Gold Room", "White Room"]
    },
    {
      weekNumber: 4,
      title: "One Mediator",
      theme: "Christ alone stands between God and humanity",
      scriptureFocus: "1 Timothy 2:5; Hebrews 9:15; Hebrews 12:24",
      outcome:
        "The student will have a clear understanding that no human priest, saint, or institution can mediate between God and humanity \u2013 only Christ.",
      discussionQuestions: [
        "Paul declares \u2018there is one God, and one mediator between God and men, the man Christ Jesus\u2019 (1 Timothy 2:5). Why is \u2018one\u2019 so emphatic?",
        "Christ is \u2018the mediator of the new testament\u2019 (Hebrews 9:15). How does the new covenant improve upon the old?",
        "We come to \u2018Jesus the mediator of the new covenant, and to the blood of sprinkling, that speaketh better things than that of Abel\u2019 (Hebrews 12:24). How does Christ\u2019s blood speak better things?",
        "How does the truth of one mediator protect us from misplaced trust in human religious systems?"
      ],
      ptRooms: ["Gold Room", "White Room"]
    },
    {
      weekNumber: 5,
      title: "Boldness at the Throne",
      theme: "Living in the confidence of access",
      scriptureFocus: "Hebrews 4:16; Ephesians 3:12; Romans 5:1\u20132",
      outcome:
        "The student will approach God with holy boldness, neither timid nor presumptuous, and will help others discover the same access.",
      discussionQuestions: [
        "We are invited to \u2018come boldly unto the throne of grace\u2019 (Hebrews 4:16). What is the difference between boldness and presumption?",
        "In Christ \u2018we have boldness and access with confidence by the faith of him\u2019 (Ephesians 3:12). How does faith create confidence?",
        "Through Christ \u2018we have access by faith into this grace wherein we stand\u2019 (Romans 5:2). What does it mean to stand in grace?",
        "Is there anything holding you back from approaching God boldly right now?"
      ],
      ptRooms: ["Gold Room", "Purple Room", "Blue Room"]
    },
    {
      weekNumber: 6,
      title: "Living in the Most Holy Place",
      theme: "Dwelling in God\u2019s immediate presence",
      scriptureFocus: "Psalm 91:1; Psalm 27:4; Exodus 25:22",
      outcome:
        "The student will understand that life in Christ means constant access to the Most Holy Place and will live with an awareness of God\u2019s manifest presence.",
      discussionQuestions: [
        "He that dwelleth in \u2018the secret place of the most High shall abide under the shadow of the Almighty\u2019 (Psalm 91:1). What does dwelling in the secret place look like daily?",
        "David\u2019s one desire was \u2018to dwell in the house of the LORD all the days of my life\u2019 (Psalm 27:4). How can we share that single-minded focus?",
        "God said \u2018there I will meet with thee, and I will commune with thee from above the mercy seat\u2019 (Exodus 25:22). Where is your mercy seat?",
        "How has this cycle on the veil changed your experience of access to God?"
      ],
      ptRooms: ["Gold Room", "White Room", "Purple Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 8 — THE ARK OF THE COVENANT: GOD'S LAW OF LOVE
// ---------------------------------------------------------------------------
const cycle8: StudyCycle = {
  id: "cycle-8-ark-of-the-covenant",
  title: "The Ark of the Covenant \u2013 God\u2019s Law of Love",
  description:
    "The ten commandments, the Sabbath, and covenant relationship. Inside the ark were the tables of stone \u2013 God\u2019s character written in precepts of love.",
  sequenceNumber: 8,
  sanctuaryFocus: "Ark of the Covenant",
  goal: "Ground the student in the perpetuity and beauty of God\u2019s moral law, the Sabbath as its seal, and obedience as a love response rather than legalism.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Ark \u2013 Throne of God on Earth",
      theme: "The law at the centre of God\u2019s government",
      scriptureFocus: "Exodus 25:10\u201322; Psalm 89:14; Revelation 11:19",
      outcome:
        "The student will understand that the law inside the ark represents the foundation of God\u2019s throne and government of love.",
      discussionQuestions: [
        "Why did God place the Ten Commandments inside the ark, directly under the mercy seat (Exodus 25:21)?",
        "\u2018Justice and judgment are the habitation of thy throne: mercy and truth shall go before thy face\u2019 (Psalm 89:14). How do law and mercy coexist at the ark?",
        "John saw \u2018the ark of his testament\u2019 in the heavenly temple (Revelation 11:19). What does its presence in heaven tell us about the law\u2019s ongoing relevance?",
        "How does understanding the ark change the way you view the Ten Commandments?"
      ],
      ptRooms: ["Gold Room", "White Room"]
    },
    {
      weekNumber: 2,
      title: "Written in Stone, Written on Hearts",
      theme: "The two-covenant experience of the law",
      scriptureFocus: "Exodus 20:1\u201317; Jeremiah 31:31\u201334; Hebrews 8:10",
      outcome:
        "The student will understand the new covenant as God writing His law on the heart rather than abolishing it.",
      discussionQuestions: [
        "God spoke the commandments audibly (Exodus 20:1) and then wrote them Himself (Exodus 31:18). Why both speaking and writing?",
        "The new covenant promise is \u2018I will put my law in their inward parts, and write it in their hearts\u2019 (Jeremiah 31:33). How is heart-writing different from stone-writing?",
        "Hebrews 8:10 confirms this promise is for the church today. If the law is written on our hearts, is external law still needed?",
        "In which commandment do you most sense God still writing on your heart?"
      ],
      ptRooms: ["Gold Room", "Blue Room"]
    },
    {
      weekNumber: 3,
      title: "The Sabbath \u2013 Seal of the Living God",
      theme: "The fourth commandment as sign and seal",
      scriptureFocus: "Genesis 2:1\u20133; Exodus 20:8\u201311; Ezekiel 20:12, 20",
      outcome:
        "The student will understand the Sabbath as creation memorial, covenant sign, and seal of God\u2019s authority, and will delight in keeping it.",
      discussionQuestions: [
        "God \u2018blessed the seventh day, and sanctified it\u2019 at creation (Genesis 2:3). Why did He establish the Sabbath before sin entered?",
        "The commandment says \u2018Remember\u2019 (Exodus 20:8). Why is this the only commandment that begins with \u2018remember\u2019?",
        "God gave His Sabbaths as \u2018a sign between me and them, that they might know that I am the LORD that sanctify them\u2019 (Ezekiel 20:12). How is the Sabbath a sign of sanctification?",
        "How can you make the Sabbath a delight rather than a duty this week?"
      ],
      ptRooms: ["Gold Room", "Green Room"]
    },
    {
      weekNumber: 4,
      title: "Love Fulfils the Law",
      theme: "Obedience motivated by love",
      scriptureFocus: "Matthew 22:36\u201340; Romans 13:8\u201310; 1 John 5:2\u20133",
      outcome:
        "The student will experience the commandments as expressions of love rather than burdensome restrictions.",
      discussionQuestions: [
        "Jesus said all the law hangs on two commandments of love (Matthew 22:40). How does love to God and neighbour fulfil every precept?",
        "Paul says \u2018love is the fulfilling of the law\u2019 (Romans 13:10). Does love replace the law or complete it?",
        "John writes \u2018his commandments are not grievous\u2019 (1 John 5:3). Why do many Christians experience the law as burdensome?",
        "Which commandment have you been keeping from duty that you now want to keep from love?"
      ],
      ptRooms: ["Gold Room", "Red Room"]
    },
    {
      weekNumber: 5,
      title: "The Sabbath in the New Testament",
      theme: "Christ, the apostles, and the seventh day",
      scriptureFocus: "Luke 4:16; Acts 13:42\u201344; Hebrews 4:9\u201311",
      outcome:
        "The student will see that the New Testament upholds the seventh-day Sabbath and will be prepared to share this truth with others.",
      discussionQuestions: [
        "Jesus entered the synagogue on the Sabbath \u2018as his custom was\u2019 (Luke 4:16). What does Christ\u2019s personal example teach us?",
        "Gentiles asked Paul to preach \u2018the next sabbath day\u2019 and \u2018almost the whole city came\u2019 (Acts 13:42, 44). Why would Gentiles gather on Sabbath if it was only Jewish?",
        "\u2018There remaineth therefore a rest [sabbatismos] to the people of God\u2019 (Hebrews 4:9). What is this remaining Sabbath rest?",
        "How do you explain the Sabbath to a sincere Sunday-keeper?"
      ],
      ptRooms: ["Gold Room", "Blue Room", "Green Room"]
    },
    {
      weekNumber: 6,
      title: "Covenant People \u2013 Keepers of the Ark",
      theme: "Our identity as a commandment-keeping people",
      scriptureFocus: "Revelation 12:17; Revelation 14:12; Deuteronomy 7:6\u20139",
      outcome:
        "The student will embrace the identity of a covenant-keeping people who honour God\u2019s law from love, standing ready for the final conflict.",
      discussionQuestions: [
        "The dragon makes war with those who \u2018keep the commandments of God, and have the testimony of Jesus Christ\u2019 (Revelation 12:17). Why does Sabbath-keeping provoke opposition?",
        "\u2018Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus\u2019 (Revelation 14:12). How do faith and commandments work together?",
        "God chose Israel because He \u2018loved you, and\u2026would keep the oath\u2019 (Deuteronomy 7:8). How does covenant love motivate obedience today?",
        "As you finish this cycle, how has your relationship with God\u2019s law changed?"
      ],
      ptRooms: ["Gold Room", "White Room", "Red Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 9 — THE MERCY SEAT: GRACE & JUDGMENT
// ---------------------------------------------------------------------------
const cycle9: StudyCycle = {
  id: "cycle-9-the-mercy-seat",
  title: "The Mercy Seat \u2013 Grace & Judgment",
  description:
    "The investigative judgment, assurance in the judgment, and the significance of 1844. Above the law sat the mercy seat \u2013 where justice and mercy meet.",
  sequenceNumber: 9,
  sanctuaryFocus: "Ark of the Covenant",
  goal: "Give the student a clear, Christ-centred understanding of the pre-advent judgment, the 2,300-day prophecy, and unshakeable assurance through Christ\u2019s advocacy.",
  weeks: [
    {
      weekNumber: 1,
      title: "Where Justice and Mercy Meet",
      theme: "The mercy seat as the heart of the gospel",
      scriptureFocus: "Exodus 25:17\u201322; Romans 3:25; Leviticus 16:14\u201316",
      outcome:
        "The student will see the mercy seat as the place where God\u2019s righteous law and His merciful grace are perfectly reconciled in Christ.",
      discussionQuestions: [
        "God said \u2018There I will meet with thee\u2019 from above the mercy seat (Exodus 25:22). Why did God choose to meet man at the place where blood was sprinkled over the law?",
        "Paul says God set forth Christ as a \u2018propitiation\u2019 \u2013 the same Greek word for mercy seat (Romans 3:25). How is Jesus our mercy seat?",
        "On the Day of Atonement the high priest sprinkled blood on the mercy seat (Leviticus 16:14). What did this accomplish?",
        "How does the mercy seat answer the question: \u2018Can God be just and still forgive sinners?\u2019"
      ],
      ptRooms: ["Gold Room", "Red Room"]
    },
    {
      weekNumber: 2,
      title: "The Day of Atonement",
      theme: "Leviticus 16 and its end-time meaning",
      scriptureFocus: "Leviticus 16:29\u201334; Leviticus 23:27\u201332; Hebrews 9:23\u201326",
      outcome:
        "The student will understand the Day of Atonement as a type of the final cleansing of the heavenly sanctuary and will know what it means to \u2018afflict the soul.\u2019",
      discussionQuestions: [
        "On the Day of Atonement Israel was commanded to \u2018afflict your souls\u2019 (Leviticus 16:29). What did this involve, and what is our modern equivalent?",
        "The sanctuary was cleansed once a year (Leviticus 16:34). If God forgave throughout the year, why was an annual cleansing needed?",
        "Hebrews 9:23 says \u2018the heavenly things themselves\u2019 needed purifying with \u2018better sacrifices.\u2019 Why does heaven need cleansing?",
        "How should living in the antitypical Day of Atonement affect our daily lives?"
      ],
      ptRooms: ["Gold Room", "White Room"]
    },
    {
      weekNumber: 3,
      title: "2,300 Days \u2013 The Longest Time Prophecy",
      theme: "Daniel 8:14 and the cleansing of the sanctuary",
      scriptureFocus: "Daniel 8:13\u201314; Daniel 9:24\u201327; Hebrews 9:11\u201312",
      outcome:
        "The student will be able to explain the 2,300-day prophecy, its connection to 1844, and its fulfilment in Christ\u2019s heavenly ministry.",
      discussionQuestions: [
        "\u2018Unto two thousand and three hundred days; then shall the sanctuary be cleansed\u2019 (Daniel 8:14). Why does this prophecy matter for Seventh-day Adventists?",
        "How does Daniel 9:24\u201327 provide the starting date for the 2,300-day prophecy, and where does the calculation lead?",
        "How does Hebrews 9:11\u201312 confirm that Christ entered a heavenly sanctuary with His own blood?",
        "How would you explain 1844 to a friend in simple, Christ-centred terms?"
      ],
      ptRooms: ["Gold Room", "Blue Room"]
    },
    {
      weekNumber: 4,
      title: "The Investigative Judgment",
      theme: "God\u2019s pre-advent review of every case",
      scriptureFocus: "Daniel 7:9\u201310; Ecclesiastes 12:14; Revelation 14:6\u20137",
      outcome:
        "The student will understand the investigative judgment as God vindicating His character and His people, not as a reason for fear.",
      discussionQuestions: [
        "Daniel saw thrones set and \u2018the books were opened\u2019 (Daniel 7:10). What are these books, and whose cases are reviewed?",
        "\u2018God shall bring every work into judgment, with every secret thing\u2019 (Ecclesiastes 12:14). Is this terrifying or reassuring for the believer? Why?",
        "The first angel proclaims \u2018the hour of his judgment is come\u2019 (Revelation 14:7). Why is judgment part of the \u2018everlasting gospel\u2019?",
        "How does the investigative judgment vindicate God\u2019s justice before the universe?"
      ],
      ptRooms: ["Gold Room", "Purple Room"]
    },
    {
      weekNumber: 5,
      title: "Assurance in the Judgment",
      theme: "Christ as Advocate and Judge",
      scriptureFocus: "1 John 2:1; Romans 8:33\u201334; Zechariah 3:1\u20135",
      outcome:
        "The student will have unshakeable confidence in the judgment because Christ is both Judge and Advocate, and no one can successfully accuse those He defends.",
      discussionQuestions: [
        "John writes \u2018If any man sin, we have an advocate with the Father, Jesus Christ the righteous\u2019 (1 John 2:1). How does having a divine Advocate change judgment?",
        "Paul asks \u2018Who shall lay any thing to the charge of God\u2019s elect? It is God that justifieth\u2019 (Romans 8:33). Why is this the ultimate answer to accusation?",
        "Satan accused Joshua the high priest, but the LORD said \u2018I have chosen Jerusalem\u2019 and clothed Joshua in clean garments (Zechariah 3:2\u20134). What does this scene teach us?",
        "After studying grace and judgment together, where does your assurance now rest?"
      ],
      ptRooms: ["Gold Room", "White Room", "Blue Room"]
    },
    {
      weekNumber: 6,
      title: "Preparing for the Close of Probation",
      theme: "Living as if judgment matters",
      scriptureFocus: "Revelation 22:11\u201312; 2 Peter 3:11\u201314; Amos 4:12",
      outcome:
        "The student will live with holy urgency, understanding that probation will close and that character development is the work of a lifetime done now.",
      discussionQuestions: [
        "\u2018He that is unjust, let him be unjust still\u2026he that is holy, let him be holy still\u2019 (Revelation 22:11). What does this irrevocable decree imply about character fixation?",
        "Peter asks \u2018What manner of persons ought ye to be in all holy conversation and godliness?\u2019 (2 Peter 3:11). How does the certainty of the end shape the present?",
        "Amos declares \u2018Prepare to meet thy God, O Israel\u2019 (Amos 4:12). What does preparation look like?",
        "What is the one area of your character that you sense God is working on most urgently?"
      ],
      ptRooms: ["Gold Room", "Red Room", "Purple Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 10 — PROPHETIC IDENTITY: WHO WE ARE
// ---------------------------------------------------------------------------
const cycle10: StudyCycle = {
  id: "cycle-10-prophetic-identity",
  title: "Prophetic Identity \u2013 Who We Are",
  description:
    "SDA identity, the remnant, and the three angels\u2019 messages. In the Most Holy Place we discover not only what God has done but who He has called us to be.",
  sequenceNumber: 10,
  sanctuaryFocus: "Most Holy Place",
  goal: "Establish the student in a clear, humble, and mission-driven understanding of Seventh-day Adventist prophetic identity.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Remnant in Prophecy",
      theme: "God\u2019s faithful end-time people",
      scriptureFocus: "Revelation 12:17; Revelation 19:10; Isaiah 11:11\u201312",
      outcome:
        "The student will understand the biblical concept of the remnant and will embrace this identity with humility, not pride.",
      discussionQuestions: [
        "The dragon is wroth with the woman and makes war with \u2018the remnant of her seed, which keep the commandments of God, and have the testimony of Jesus Christ\u2019 (Revelation 12:17). What identifies the remnant?",
        "\u2018The testimony of Jesus is the spirit of prophecy\u2019 (Revelation 19:10). What does this mean for the Seventh-day Adventist Church?",
        "Isaiah prophesied a second gathering of God\u2019s remnant (Isaiah 11:11). How has this been fulfilled?",
        "How do we hold remnant identity without arrogance or exclusivism?"
      ],
      ptRooms: ["Gold Room", "White Room"]
    },
    {
      weekNumber: 2,
      title: "The First Angel \u2013 Everlasting Gospel",
      theme: "The gospel proclaimed in end-time context",
      scriptureFocus: "Revelation 14:6\u20137; Romans 1:16\u201317; Ecclesiastes 12:13\u201314",
      outcome:
        "The student will articulate the first angel\u2019s message as the everlasting gospel calling all people to worship the Creator.",
      discussionQuestions: [
        "The first angel has \u2018the everlasting gospel to preach unto them that dwell on the earth\u2019 (Revelation 14:6). Why is the gospel called everlasting?",
        "The command to \u2018fear God, and give glory to him; for the hour of his judgment is come\u2019 (Revelation 14:7) includes worship of the Creator. How does this relate to the Sabbath?",
        "Paul says the gospel is \u2018the power of God unto salvation\u2019 (Romans 1:16). How do we keep the three angels\u2019 messages gospel-centred?",
        "How do you share the first angel\u2019s message without coming across as judgmental?"
      ],
      ptRooms: ["Gold Room", "Green Room"]
    },
    {
      weekNumber: 3,
      title: "The Second Angel \u2013 Babylon Is Fallen",
      theme: "The call out of false religion",
      scriptureFocus: "Revelation 14:8; Revelation 18:1\u20134; Isaiah 21:9",
      outcome:
        "The student will understand Babylon as a system of false worship and will be equipped to lovingly call sincere people out of error.",
      discussionQuestions: [
        "\u2018Babylon is fallen, is fallen, that great city\u2019 (Revelation 14:8). What characterises spiritual Babylon?",
        "God commands \u2018Come out of her, my people\u2019 (Revelation 18:4). If God\u2019s people are in Babylon, how do we reach them?",
        "Isaiah\u2019s watchman cry (Isaiah 21:9) anticipates Revelation\u2019s message. What can we learn from the prophets\u2019 burden for God\u2019s people in Babylon?",
        "How do we share the second angel\u2019s message with compassion rather than condemnation?"
      ],
      ptRooms: ["Gold Room", "Red Room"]
    },
    {
      weekNumber: 4,
      title: "The Third Angel \u2013 The Final Warning",
      theme: "The mark of the beast and the seal of God",
      scriptureFocus: "Revelation 14:9\u201312; Revelation 13:15\u201317; Revelation 7:1\u20134",
      outcome:
        "The student will clearly understand the issues in the final conflict between the mark of the beast and the seal of God.",
      discussionQuestions: [
        "The third angel warns against receiving the mark of the beast (Revelation 14:9\u201311). What is the mark, and why is the warning so severe?",
        "No one can \u2018buy or sell\u2019 without the mark (Revelation 13:17). How should we prepare for economic pressure?",
        "The sealing of God\u2019s servants (Revelation 7:3) precedes the final crisis. What is God\u2019s seal, and how do we receive it?",
        "How does understanding the third angel\u2019s message bring urgency without sensationalism?"
      ],
      ptRooms: ["Gold Room", "Purple Room"]
    },
    {
      weekNumber: 5,
      title: "The Spirit of Prophecy",
      theme: "The prophetic gift in the remnant church",
      scriptureFocus: "Revelation 19:10; Joel 2:28\u201329; 1 Thessalonians 5:19\u201321",
      outcome:
        "The student will understand the role of the Spirit of Prophecy in the SDA Church and will value the writings of Ellen G. White as a lesser light leading to the greater light of Scripture.",
      discussionQuestions: [
        "Revelation identifies the remnant as having \u2018the testimony of Jesus\u2019 which is \u2018the spirit of prophecy\u2019 (Revelation 19:10). How has this gift been manifested?",
        "Joel prophesied that in the last days God would pour out His Spirit and His people would prophesy (Joel 2:28). How has this been fulfilled?",
        "Paul says \u2018Despise not prophesyings. Prove all things; hold fast that which is good\u2019 (1 Thessalonians 5:20\u201321). How do we test prophetic claims?",
        "How has the prophetic gift through Ellen G. White strengthened your faith?"
      ],
      ptRooms: ["Gold Room", "Blue Room"]
    },
    {
      weekNumber: 6,
      title: "Mission-Driven Identity",
      theme: "Who we are determines what we do",
      scriptureFocus: "Matthew 28:19\u201320; Revelation 14:12; 1 Peter 2:9",
      outcome:
        "The student will connect prophetic identity to missionary purpose and will articulate a personal mission statement rooted in the three angels\u2019 messages.",
      discussionQuestions: [
        "Jesus commanded \u2018Go ye therefore, and teach all nations\u2019 (Matthew 28:19). How does our prophetic identity shape our mission method?",
        "The patience of the saints is seen in those who \u2018keep the commandments of God, and the faith of Jesus\u2019 (Revelation 14:12). How does patience relate to mission?",
        "Peter calls us \u2018a chosen generation, a royal priesthood\u2019 to \u2018shew forth the praises of him\u2019 (1 Peter 2:9). How does this apply to our church today?",
        "Write a personal mission statement based on what you have learned in this cycle."
      ],
      ptRooms: ["Gold Room", "Green Room", "White Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 11 — THE LATTER RAIN: PREPARATION
// ---------------------------------------------------------------------------
const cycle11: StudyCycle = {
  id: "cycle-11-the-latter-rain",
  title: "The Latter Rain \u2013 Preparation",
  description:
    "Character perfection, the latter rain, and the loud cry. The Most Holy Place experience prepares a people for the final outpouring of the Spirit.",
  sequenceNumber: 11,
  sanctuaryFocus: "Most Holy Place",
  goal: "Prepare the student for the latter rain by addressing character defects, deepening surrender, and igniting urgency for the loud cry.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Early and Latter Rain",
      theme: "Understanding the two-phase outpouring of the Spirit",
      scriptureFocus: "Joel 2:23, 28\u201329; James 5:7\u20138; Hosea 6:3",
      outcome:
        "The student will understand the agricultural metaphor of early and latter rain and will recognise the church\u2019s need for the final outpouring.",
      discussionQuestions: [
        "Joel promised God would give \u2018the former rain, and the latter rain\u2019 (Joel 2:23). What was the early rain (Pentecost) and what will the latter rain accomplish?",
        "James tells us to \u2018be patient\u2026unto the coming of the Lord\u2019 as the farmer waits for \u2018the early and latter rain\u2019 (James 5:7). What does patient preparation look like?",
        "Hosea says \u2018He shall come unto us as the rain\u2019 (Hosea 6:3). What conditions precede His coming?",
        "Are you personally preparing for the latter rain? What does preparation involve?"
      ],
      ptRooms: ["Green Room", "Gold Room"]
    },
    {
      weekNumber: 2,
      title: "Character Perfection in Christ",
      theme: "What it means to reflect Christ\u2019s image fully",
      scriptureFocus: "Matthew 5:48; Philippians 1:6; Ephesians 4:13\u201315",
      outcome:
        "The student will understand character perfection as maturity in Christ \u2013 not sinless perfection by human effort but the fullness of Christ\u2019s character reproduced by the Spirit.",
      discussionQuestions: [
        "Jesus said \u2018Be ye therefore perfect, even as your Father which is in heaven is perfect\u2019 (Matthew 5:48). Is this possible? What does it mean?",
        "Paul was \u2018confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ\u2019 (Philippians 1:6). Whose work is character perfection?",
        "The goal is \u2018the measure of the stature of the fulness of Christ\u2019 (Ephesians 4:13). How does maturity differ from sinless self-effort?",
        "What character trait is God currently perfecting in you?"
      ],
      ptRooms: ["Purple Room", "Gold Room"]
    },
    {
      weekNumber: 3,
      title: "Removing Every Hindrance",
      theme: "Dealing with besetting sins",
      scriptureFocus: "Hebrews 12:1\u20132; Isaiah 1:16\u201318; Psalm 139:23\u201324",
      outcome:
        "The student will identify and begin to lay aside specific weights and sins that hinder spiritual progress.",
      discussionQuestions: [
        "We are told to \u2018lay aside every weight, and the sin which doth so easily beset us\u2019 (Hebrews 12:1). What is the difference between a weight and a sin?",
        "God says \u2018Wash you, make you clean; put away the evil of your doings\u2019 (Isaiah 1:16). What active role do we play in cleansing?",
        "David prayed \u2018Search me, O God, and know my heart\u2019 (Psalm 139:23). Are you willing to pray this prayer honestly?",
        "What specific weight or sin is the Holy Spirit asking you to lay aside right now?"
      ],
      ptRooms: ["Red Room", "Purple Room"]
    },
    {
      weekNumber: 4,
      title: "Unity Before Outpouring",
      theme: "One accord as a prerequisite for power",
      scriptureFocus: "Acts 2:1\u20134; John 17:20\u201323; Psalm 133:1\u20133",
      outcome:
        "The student will understand that the Spirit was poured out when believers were in \u2018one accord\u2019 and will pursue unity in the church.",
      discussionQuestions: [
        "On Pentecost they were \u2018all with one accord in one place\u2019 (Acts 2:1). What did unity look like before the Spirit fell?",
        "Jesus prayed \u2018that they all may be one\u2026that the world may believe\u2019 (John 17:21). How does disunity hinder mission and the Spirit\u2019s outpouring?",
        "\u2018Behold, how good and how pleasant it is for brethren to dwell together in unity!\u2019 (Psalm 133:1). What makes unity pleasant, and what destroys it?",
        "What relationship in your life needs reconciliation before you can receive the latter rain?"
      ],
      ptRooms: ["Green Room", "Blue Room"]
    },
    {
      weekNumber: 5,
      title: "The Loud Cry",
      theme: "The final message that lightens the earth",
      scriptureFocus: "Revelation 18:1\u20134; Isaiah 60:1\u20133; Habakkuk 2:14",
      outcome:
        "The student will understand the loud cry as the culmination of the three angels\u2019 messages empowered by the latter rain.",
      discussionQuestions: [
        "An angel comes down with \u2018great power; and the earth was lightened with his glory\u2019 (Revelation 18:1). What is this glory?",
        "Isaiah commands \u2018Arise, shine; for thy light is come\u2019 (Isaiah 60:1). How do we participate in the loud cry?",
        "\u2018The earth shall be filled with the knowledge of the glory of the LORD\u2019 (Habakkuk 2:14). How will this happen through God\u2019s people?",
        "What is your role in the loud cry, and what gift or platform has God given you to fulfil it?"
      ],
      ptRooms: ["Gold Room", "Green Room"]
    },
    {
      weekNumber: 6,
      title: "Ready for the Outpouring",
      theme: "Final preparation for latter rain power",
      scriptureFocus: "Zechariah 10:1; Acts 3:19\u201321; Malachi 3:10",
      outcome:
        "The student will make specific commitments to prepare for the latter rain and will pray daily for its outpouring.",
      discussionQuestions: [
        "Zechariah says \u2018Ask ye of the LORD rain in the time of the latter rain\u2019 (Zechariah 10:1). Why must we ask if God has already promised?",
        "Peter urged \u2018Repent ye therefore\u2026that the times of refreshing shall come from the presence of the Lord\u2019 (Acts 3:19). What is the connection between repentance and refreshing?",
        "God says \u2018prove me now herewith\u2026if I will not open you the windows of heaven\u2019 (Malachi 3:10). How does faithfulness in stewardship prepare for the outpouring?",
        "What three commitments will you make as you await the latter rain?"
      ],
      ptRooms: ["Green Room", "Gold Room", "Purple Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// CYCLE 12 — THE FULL SANCTUARY: LIVING THE MESSAGE
// ---------------------------------------------------------------------------
const cycle12: StudyCycle = {
  id: "cycle-12-full-sanctuary",
  title: "The Full Sanctuary \u2013 Living the Message",
  description:
    "Integration of all truths, mission, and second coming hope. The entire sanctuary journey is now lived out as one seamless experience of Christ.",
  sequenceNumber: 12,
  sanctuaryFocus: "Full Sanctuary",
  goal: "Integrate every sanctuary truth into a unified, mission-driven life and send the student out as a living embodiment of the everlasting gospel with second coming hope.",
  weeks: [
    {
      weekNumber: 1,
      title: "The Sanctuary \u2013 One Complete Gospel",
      theme: "Seeing the whole journey as one story of Christ",
      scriptureFocus: "Hebrews 8:1\u20135; Psalm 77:13; John 14:1\u20136",
      outcome:
        "The student will see all twelve cycles as one continuous revelation of Christ and will articulate the sanctuary message as the framework for the everlasting gospel.",
      discussionQuestions: [
        "The writer of Hebrews says Christ is \u2018a minister of the sanctuary, and of the true tabernacle\u2019 (Hebrews 8:2). How does the full sanctuary reveal the full gospel?",
        "\u2018Thy way, O God, is in the sanctuary\u2019 (Psalm 77:13). How has this journey through the sanctuary revealed God\u2019s way to you?",
        "Jesus said \u2018I am the way, the truth, and the life\u2019 (John 14:6). How does every article of furniture point to Him?",
        "If you had to explain the sanctuary gospel in five minutes, what would you say?"
      ],
      ptRooms: ["Gold Room", "White Room"]
    },
    {
      weekNumber: 2,
      title: "Whole-Life Discipleship",
      theme: "Every area of life under sanctuary light",
      scriptureFocus: "1 Corinthians 10:31; Colossians 3:17, 23; Romans 14:7\u20138",
      outcome:
        "The student will apply sanctuary principles to health, finances, relationships, work, and worship \u2013 integrating faith into every sphere.",
      discussionQuestions: [
        "Paul says \u2018Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God\u2019 (1 Corinthians 10:31). How does the sanctuary inform health reform, Sabbath-keeping, and stewardship?",
        "\u2018Whatsoever ye do in word or deed, do all in the name of the Lord Jesus\u2019 (Colossians 3:17). What area of your life is not yet fully surrendered?",
        "\u2018None of us liveth to himself\u2019 (Romans 14:7). How does our personal holiness affect the community?",
        "Choose one life area \u2013 health, finances, or relationships \u2013 and describe how the sanctuary speaks to it."
      ],
      ptRooms: ["Blue Room", "Gold Room", "Green Room"]
    },
    {
      weekNumber: 3,
      title: "The Health Message \u2013 The Right Arm",
      theme: "Physical stewardship as sanctuary service",
      scriptureFocus: "1 Corinthians 6:19\u201320; 3 John 1:2; Daniel 1:8\u201320",
      outcome:
        "The student will embrace the health message as an integral part of the sanctuary gospel and will take practical steps toward health reform.",
      discussionQuestions: [
        "Paul asks \u2018Know ye not that your body is the temple of the Holy Ghost?\u2019 (1 Corinthians 6:19). How does the sanctuary metaphor apply to our bodies?",
        "John prayed for physical prosperity alongside soul prosperity (3 John 1:2). Why does God care about our bodies?",
        "Daniel \u2018purposed in his heart that he would not defile himself\u2019 (Daniel 1:8). What does purposeful health look like for us?",
        "What one health change will you make this week as an act of worship?"
      ],
      ptRooms: ["Green Room", "Blue Room"]
    },
    {
      weekNumber: 4,
      title: "Mission \u2013 Carrying the Sanctuary to the World",
      theme: "Every believer a missionary",
      scriptureFocus: "Matthew 28:18\u201320; Acts 1:8; 2 Corinthians 5:18\u201320",
      outcome:
        "The student will develop a personal mission plan and will see himself or herself as an ambassador of the sanctuary gospel in daily life.",
      discussionQuestions: [
        "Jesus said \u2018All power is given unto me\u2026Go ye therefore\u2019 (Matthew 28:18\u201319). How does His authority empower our mission?",
        "\u2018Ye shall be witnesses unto me\u2019 in expanding circles (Acts 1:8). What is your Jerusalem, Judea, Samaria, and uttermost part?",
        "We are \u2018ambassadors for Christ\u2019 (2 Corinthians 5:20). What does an ambassador do that a mere citizen does not?",
        "Write out a simple plan for reaching one person with the sanctuary gospel this month."
      ],
      ptRooms: ["Green Room", "Gold Room"]
    },
    {
      weekNumber: 5,
      title: "The Blessed Hope \u2013 He Is Coming Again",
      theme: "The second coming as the climax of the sanctuary",
      scriptureFocus: "Titus 2:13; Acts 1:9\u201311; Revelation 22:12, 20",
      outcome:
        "The student will be filled with living hope for the second coming and will understand it as the final act of the sanctuary drama.",
      discussionQuestions: [
        "Paul calls the second coming \u2018that blessed hope\u2019 (Titus 2:13). How does hope for Christ\u2019s return affect the way we live today?",
        "The angels promised \u2018this same Jesus\u2026shall so come in like manner as ye have seen him go\u2019 (Acts 1:11). Why is the manner of His coming important?",
        "Jesus says \u2018Behold, I come quickly; and my reward is with me\u2019 (Revelation 22:12). What is the reward, and are we ready?",
        "How does the sanctuary journey from the gate to the Most Holy Place end at the second coming?"
      ],
      ptRooms: ["Gold Room", "White Room", "Red Room"]
    },
    {
      weekNumber: 6,
      title: "Go \u2013 Live the Full Message",
      theme: "Sent out as sanctuary people",
      scriptureFocus: "Micah 6:8; Revelation 14:12; Isaiah 6:8",
      outcome:
        "The student will make a formal commitment to live as a sanctuary-conscious disciple and will be commissioned to begin leading others through the same journey.",
      discussionQuestions: [
        "God requires that we \u2018do justly, and to love mercy, and to walk humbly with thy God\u2019 (Micah 6:8). How does the sanctuary teach justice, mercy, and humility together?",
        "\u2018Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus\u2019 (Revelation 14:12). How will you live this verse daily?",
        "Isaiah responded \u2018Here am I; send me\u2019 (Isaiah 6:8). After twelve cycles, what is your response to God\u2019s call?",
        "Who will you invite to begin the sanctuary journey from Cycle 1?"
      ],
      ptRooms: ["Gold Room", "White Room", "Green Room", "Red Room", "Blue Room", "Purple Room"]
    }
  ]
};

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------
export const LIVING_MANNA_CYCLES: StudyCycle[] = [
  cycle1,
  cycle2,
  cycle3,
  cycle4,
  cycle5,
  cycle6,
  cycle7,
  cycle8,
  cycle9,
  cycle10,
  cycle11,
  cycle12
];
