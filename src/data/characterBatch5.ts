import type { CharacterProfile } from "./biblicalCharacterProfiles";

export const characterBatch5: CharacterProfile[] = [
  // ============================================
  // 1. JESUS
  // ============================================
  {
    id: "jesus",
    name: "Jesus",
    meaning: "The LORD saves",
    emoji: "✝️",
    role: "Son of God, Savior of the world",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 1-28", "Mark 1-16", "Luke 1-24", "John 1-21"],
    archetypes: ["Shepherd", "Priest", "Prophet", "King", "Servant", "Martyr"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 5, compassion: 5, fear: 0, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Shepherd",
      strength: "Perfect love and obedience to the Father",
      weakness: "Bore the weight of humanity's sin (not a personal flaw)",
      mindset: "Not my will, but Yours be done",
      keyLesson: "Sacrificial love is the highest expression of divine power.",
      keyVerse: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      keyVerseRef: "John 3:16"
    },
    storyArc: "The eternal Son of God incarnate who lived a sinless life, taught with unmatched authority, performed miracles, was rejected by His own people, died a substitutionary death on the cross, rose from the dead on the third day, and ascended to the right hand of the Father as Lord of all.",
    therapyView: {
      drivingFears: ["None—He entrusted all to the Father"],
      coreMotivations: ["Glorifying the Father", "Redeeming humanity", "Destroying the works of the devil"],
      relationalStyle: "Perfectly attuned—gentle with the broken, fierce with the hypocritical",
      blindSpots: ["None—fully God and fully man without sin"],
      healingMoments: ["Weeping at Lazarus's tomb", "Restoring Peter after his denial", "Forgiving from the cross"]
    },
    strengths: ["Sinless perfection", "Absolute authority", "Boundless compassion", "Unshakeable resolve", "Perfect wisdom"],
    weaknesses: ["Experienced genuine human suffering and grief", "Voluntarily limited Himself in incarnation"],
    journey: [
      { phase: "Calling", description: "Baptism by John and the Father's declaration: This is my beloved Son" },
      { phase: "Testing", description: "Forty days of temptation in the wilderness" },
      { phase: "Refinement", description: "Growing opposition from religious leaders, rejection by many followers" },
      { phase: "Legacy", description: "Death, resurrection, ascension, and the sending of the Holy Spirit" }
    ],
    relationships: [
      { name: "God the Father", role: "Eternal Father" },
      { name: "Peter", role: "Lead apostle" },
      { name: "John", role: "Beloved disciple" },
      { name: "Mary (mother)", role: "Mother" },
      { name: "Judas Iscariot", role: "Betrayer" },
      { name: "Lazarus", role: "Beloved friend" }
    ],
    lessonsAndReflection: [
      "How does Jesus's response to temptation instruct your own battles?",
      "What does it mean that the King of kings came as a servant?",
      "How does the cross redefine your understanding of power?"
    ],
    relatedCharacters: ["peter", "paul", "mary-mother-of-jesus", "judas", "john-the-baptist", "lazarus"],
    situations: [
      {
        id: "jesus-temptation-wilderness",
        title: "Temptation in the Wilderness",
        category: "Temptation",
        reference: "Matthew 4:1-11",
        situation: "After forty days of fasting, Satan tempted Jesus with bread, spectacle, and world dominion.",
        pressure: "Physical exhaustion and the lure of bypassing the cross through shortcuts to glory.",
        innerBattle: "Will I trust the Father's plan or seize what is rightfully mine by an easier path?",
        response: "Jesus countered every temptation with Scripture, refusing to act independently of the Father's will.",
        outcome: "Satan departed, angels ministered to Jesus, and His mission remained intact.",
        lesson: "The Word of God is the definitive weapon against temptation.",
        traitRevealed: "Perfect obedience under pressure",
        spiritualPrinciple: "Victory over temptation comes through submission to God's Word, not human willpower.",
        reflectionQuestions: [
          "Which of the three temptations—appetite, spectacle, or power—is your greatest vulnerability?",
          "Do you know Scripture well enough to wield it in moments of testing?",
          "Are you tempted to take shortcuts around God's ordained path?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, wisdom: 5, humility: 5 }
      },
      {
        id: "jesus-gethsemane",
        title: "Agony in Gethsemane",
        category: "Sacrifice",
        reference: "Luke 22:39-46",
        situation: "Facing imminent arrest, torture, and bearing the sin of the world, Jesus prayed in anguish in the garden.",
        pressure: "The full weight of divine wrath against sin about to be placed on Him.",
        innerBattle: "Father, if it be possible, let this cup pass—yet not my will but Yours.",
        response: "He surrendered fully to the Father's will, sweating drops of blood, and rose to face His betrayer.",
        outcome: "He was arrested, tried, and crucified—accomplishing redemption for all who believe.",
        lesson: "True surrender is not the absence of struggle but the choice to obey through it.",
        traitRevealed: "Absolute surrender to God's will",
        spiritualPrinciple: "The deepest obedience is forged in the furnace of honest anguish before God.",
        reflectionQuestions: [
          "Have you ever wrestled honestly with God's will for your life?",
          "What cup is God asking you to drink that you would rather avoid?",
          "How does Gethsemane redefine strength for you?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, courage: 5, compassion: 5 }
      },
      {
        id: "jesus-cleansing-temple",
        title: "Cleansing the Temple",
        category: "Conflict",
        reference: "John 2:13-22",
        situation: "Jesus entered the temple and found merchants and money changers exploiting worshippers.",
        pressure: "Confronting the religious establishment's corruption risked immediate backlash and accelerated opposition.",
        innerBattle: "Righteous anger versus the cost of open confrontation with powerful leaders.",
        response: "He made a whip, drove out the merchants, overturned tables, and declared His Father's house was not a marketplace.",
        outcome: "The religious leaders began plotting against Him, but the prophetic statement was made—true worship cannot coexist with exploitation.",
        lesson: "Holy anger directed at injustice is not sin—it is love in action.",
        traitRevealed: "Righteous zeal for God's honor",
        spiritualPrinciple: "God's house and God's people must not be exploited for personal gain.",
        reflectionQuestions: [
          "Is there anything in your life that has turned worship into transaction?",
          "When is anger righteous, and when does it become self-serving?",
          "What would Jesus overturn in your church or life today?"
        ],
        dnaSnapshot: { courage: 5, faith: 5, wisdom: 5 }
      },
      {
        id: "jesus-forgiving-on-cross",
        title: "Forgiving on the Cross",
        category: "Sacrifice",
        reference: "Luke 23:34",
        situation: "While being crucified, Jesus looked at His tormentors—soldiers, mockers, and betrayers—and prayed for their forgiveness.",
        pressure: "Unimaginable physical agony combined with spiritual abandonment as He bore the world's sin.",
        innerBattle: "The human cry of suffering versus the divine mission of redemption.",
        response: "Father, forgive them; for they know not what they do.",
        outcome: "His forgiveness opened the door of salvation for all humanity, including the thief beside Him.",
        lesson: "Forgiveness is most powerful when it costs the most.",
        traitRevealed: "Boundless compassion and grace",
        spiritualPrinciple: "If Christ forgave from the cross, no grudge you hold is justified.",
        reflectionQuestions: [
          "Is there someone you have refused to forgive?",
          "How does the cross challenge your limits of grace?",
          "What would it look like to pray for those who have wronged you?"
        ],
        dnaSnapshot: { compassion: 5, humility: 5, faith: 5, courage: 5 }
      }
    ]
  },
  // ============================================
  // 2. ENOSH
  // ============================================
  {
    id: "enosh",
    name: "Enosh",
    meaning: "Mortal man",
    emoji: "🙏",
    role: "Grandson of Adam; in his time people began calling on the LORD's name",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 4:26", "Genesis 5:6-11"],
    archetypes: ["Seeker", "Patriarch"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "Initiating corporate worship of God",
      weakness: "Little is recorded—fragility of being merely mortal",
      mindset: "Humanity needs God and must call on His name",
      keyLesson: "Spiritual renewal begins when people start calling on God's name.",
      keyVerse: "Then began men to call upon the name of the LORD.",
      keyVerseRef: "Genesis 4:26"
    },
    storyArc: "Born to Seth in the line of promise, Enosh's generation marked a turning point when humanity began formal worship of the LORD, establishing a pattern of seeking God that would define the godly line through Noah.",
    therapyView: {
      drivingFears: ["The spread of Cain's godless legacy", "Humanity forgetting God"],
      coreMotivations: ["Connecting humanity to God", "Establishing worship"],
      relationalStyle: "Community-oriented, spiritually anchoring",
      blindSpots: ["Unknown—Scripture is silent on his failures"],
      healingMoments: ["The generation-wide turn toward calling on God's name"]
    },
    strengths: ["Spiritual initiative", "Humility before God", "Legacy of worship"],
    weaknesses: ["Obscurity—little personal detail recorded", "Living in a world increasingly corrupted by sin"],
    journey: [
      { phase: "Calling", description: "Born into the godly line of Seth after Abel's murder" },
      { phase: "Legacy", description: "His generation began calling upon the name of the LORD" }
    ],
    relationships: [
      { name: "Seth", role: "Father" },
      { name: "Adam", role: "Grandfather" }
    ],
    lessonsAndReflection: [
      "Are you actively calling on God's name or drifting in spiritual passivity?",
      "What does it look like to initiate spiritual renewal in your generation?"
    ],
    relatedCharacters: ["seth", "adam", "enoch", "noah"],
    situations: [
      {
        id: "enosh-calling-on-god",
        title: "Calling on the Name of the LORD",
        category: "Calling",
        reference: "Genesis 4:26",
        situation: "In a world spiraling after Cain's rebellion and Lamech's violence, Enosh's generation turned to God in worship.",
        pressure: "Living in an era of increasing godlessness and violence descending from Cain's line.",
        innerBattle: "Will we follow Cain's path of independence from God or return to seeking Him?",
        response: "They began to call upon the name of the LORD, establishing corporate worship.",
        outcome: "A godly line was preserved that would eventually produce Noah, Abraham, and the Messiah.",
        lesson: "Every spiritual revival begins with someone who dares to call on God's name.",
        traitRevealed: "Spiritual initiative",
        spiritualPrinciple: "Worship is the antidote to a culture that has forgotten God.",
        reflectionQuestions: [
          "Are you a spiritual initiator in your family or community?",
          "What does it mean to call on the name of the LORD in your daily life?"
        ],
        dnaSnapshot: { faith: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 3. KETURAH
  // ============================================
  {
    id: "keturah",
    name: "Keturah",
    meaning: "Incense, fragrance",
    emoji: "🌸",
    role: "Abraham's second wife after Sarah's death",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 25:1-6", "1 Chronicles 1:32-33"],
    archetypes: ["Matriarch"],
    dna: { faith: 3, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Quietly building a legacy within God's larger story",
      weakness: "Overshadowed by the covenant narrative of Sarah and Isaac",
      mindset: "Faithful presence even without the spotlight",
      keyLesson: "God uses people beyond the main storyline to accomplish His purposes.",
      keyVerse: "Then again Abraham took a wife, and her name was Keturah.",
      keyVerseRef: "Genesis 25:1"
    },
    storyArc: "After Sarah's death, Abraham married Keturah, who bore him six sons. Though her children were sent away with gifts to protect Isaac's inheritance, her descendants became nations, showing God's blessing extended beyond the covenant line.",
    therapyView: {
      drivingFears: ["Being insignificant", "Her children's displacement"],
      coreMotivations: ["Providing Abraham companionship", "Mothering a legacy"],
      relationalStyle: "Supportive and accepting of her secondary role",
      blindSpots: ["Potential resentment at her children being sent away"],
      healingMoments: ["Knowing her descendants became great nations"]
    },
    strengths: ["Faithfulness", "Quiet strength", "Acceptance of God's larger plan"],
    weaknesses: ["Overshadowed status", "Her children's inheritance was limited"],
    journey: [
      { phase: "Calling", description: "Married Abraham after Sarah's death" },
      { phase: "Testing", description: "Bore six sons who were sent away to the east with gifts" },
      { phase: "Legacy", description: "Mother of nations including Midian" }
    ],
    relationships: [
      { name: "Abraham", role: "Husband" },
      { name: "Isaac", role: "Stepson and covenant heir" }
    ],
    lessonsAndReflection: [
      "Can you be faithful even when your role feels secondary?",
      "How does God use people outside the spotlight for His purposes?"
    ],
    relatedCharacters: ["isaac", "sarah", "hagar"],
    situations: [
      {
        id: "keturah-secondary-wife",
        title: "Living in Sarah's Shadow",
        category: "Waiting",
        reference: "Genesis 25:1-6",
        situation: "Keturah married Abraham and bore him children, but her sons were sent east with gifts while Isaac received the inheritance.",
        pressure: "Accepting a role where her children would not receive the primary covenant blessing.",
        innerBattle: "Is my family less valuable to God because we are not the covenant line?",
        response: "She faithfully raised her sons and accepted God's arrangement without recorded complaint.",
        outcome: "Her descendants, including Midian, became significant peoples in biblical history.",
        lesson: "Faithfulness in a supporting role is still faithfulness that God honors.",
        traitRevealed: "Quiet faithfulness",
        spiritualPrinciple: "God's plan is bigger than any single family line—He blesses beyond the spotlight.",
        reflectionQuestions: [
          "Can you accept a supporting role without bitterness?",
          "How do you handle being overlooked while others receive the promise?"
        ],
        dnaSnapshot: { humility: 4, faith: 3 }
      }
    ]
  },
  // ============================================
  // 4. LOIS & EUNICE
  // ============================================
  {
    id: "lois-eunice",
    name: "Lois & Eunice",
    meaning: "Lois: More desirable; Eunice: Good victory",
    emoji: "👵",
    role: "Timothy's grandmother and mother who passed down sincere faith",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["2 Timothy 1:5", "2 Timothy 3:14-15", "Acts 16:1"],
    archetypes: ["Matriarch", "Servant"],
    dna: { faith: 5, humility: 4, courage: 3, wisdom: 4, compassion: 4, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Generational faith transmission",
      weakness: "Operating in a mixed-faith household",
      mindset: "Teach the Scriptures to the next generation faithfully",
      keyLesson: "The most powerful ministry may be raising the next generation in faith.",
      keyVerse: "When I call to remembrance the unfeigned faith that is in thee, which dwelt first in thy grandmother Lois, and thy mother Eunice.",
      keyVerseRef: "2 Timothy 1:5"
    },
    storyArc: "A Jewish grandmother and mother in Lystra who raised Timothy on the Scriptures from childhood, creating a foundation of sincere faith that Paul recognized and built upon, making Timothy one of the early church's most important leaders.",
    therapyView: {
      drivingFears: ["Timothy abandoning the faith", "Failing to pass on truth in a pagan culture"],
      coreMotivations: ["Raising a godly child", "Preserving the faith across generations"],
      relationalStyle: "Nurturing, instructive, deeply invested in family spirituality",
      blindSpots: ["Potential overprotectiveness", "Navigating the tension of a Greek father who may not have shared their faith"],
      healingMoments: ["Seeing Timothy called by Paul into ministry", "Paul's commendation of their faith"]
    },
    strengths: ["Generational faithfulness", "Scripture teaching", "Sincere faith", "Perseverance in a mixed-faith home"],
    weaknesses: ["Relative obscurity", "Navigating cultural and religious tensions"],
    journey: [
      { phase: "Calling", description: "Embraced faith in God and taught Timothy the Scriptures from infancy" },
      { phase: "Testing", description: "Raised Timothy in a mixed-faith household in pagan Lystra" },
      { phase: "Legacy", description: "Their investment produced one of the early church's greatest leaders" }
    ],
    relationships: [
      { name: "Timothy", role: "Son/grandson and ministry leader" },
      { name: "Paul", role: "Timothy's spiritual father and mentor" }
    ],
    lessonsAndReflection: [
      "What spiritual legacy are you building for the next generation?",
      "How do you maintain sincere faith in a culture hostile to it?",
      "Is your home a place where Scripture is taught and lived?"
    ],
    relatedCharacters: ["paul", "hannah"],
    situations: [
      {
        id: "lois-eunice-teaching-timothy",
        title: "Raising Timothy in the Scriptures",
        category: "Obedience",
        reference: "2 Timothy 3:14-15",
        situation: "Lois and Eunice taught Timothy the Holy Scriptures from childhood in a pagan city with a Greek father.",
        pressure: "Cultural opposition and a mixed-faith household made faithful instruction difficult.",
        innerBattle: "Will our teaching be enough in a world that pulls our child away from God?",
        response: "They persisted in daily Scripture instruction, building a foundation of sincere and unfeigned faith.",
        outcome: "Timothy became Paul's most trusted co-worker and a pillar of the early church.",
        lesson: "Faithful, persistent spiritual investment in children bears fruit beyond what we can imagine.",
        traitRevealed: "Generational faithfulness",
        spiritualPrinciple: "The Scriptures known from childhood are a fortress that holds in adulthood.",
        reflectionQuestions: [
          "Who taught you the faith, and how are you passing it on?",
          "Are you investing in someone's spiritual foundation right now?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 4, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 5. PHOEBE
  // ============================================
  {
    id: "phoebe",
    name: "Phoebe",
    meaning: "Bright, radiant",
    emoji: "📜",
    role: "Deaconess of the church at Cenchreae, commended by Paul",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Romans 16:1-2"],
    archetypes: ["Servant", "Missionary"],
    dna: { faith: 4, humility: 4, courage: 4, wisdom: 4, compassion: 5, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Generous service and trustworthiness",
      weakness: "Relatively unknown despite great contribution",
      mindset: "Serve the church with everything I have",
      keyLesson: "Faithful service behind the scenes carries the gospel forward.",
      keyVerse: "I commend unto you Phebe our sister, which is a servant of the church which is at Cenchrea.",
      keyVerseRef: "Romans 16:1"
    },
    storyArc: "A deaconess in Cenchreae whom Paul personally commended and entrusted with delivering the letter to the Romans—arguably the most important theological document ever written—showing the critical role of faithful servants in God's mission.",
    therapyView: {
      drivingFears: ["Failing the trust placed in her", "The gospel being hindered"],
      coreMotivations: ["Serving the church", "Supporting apostolic ministry", "Caring for others"],
      relationalStyle: "Generous patron and reliable servant",
      blindSpots: ["Potential for overextension in service"],
      healingMoments: ["Paul's public commendation to the Roman church"]
    },
    strengths: ["Trustworthiness", "Generosity", "Servant leadership", "Courage to travel for the gospel"],
    weaknesses: ["Obscurity—easily overlooked by history"],
    journey: [
      { phase: "Calling", description: "Became a deaconess in Cenchreae and a patron of many believers" },
      { phase: "Testing", description: "Entrusted with carrying Paul's letter to Rome" },
      { phase: "Legacy", description: "Delivered the epistle to the Romans, serving the entire church for millennia" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who commended her" }
    ],
    lessonsAndReflection: [
      "Are you trustworthy with the tasks God has given you?",
      "How does faithful service in small things lead to greater Kingdom impact?"
    ],
    relatedCharacters: ["paul", "priscilla-aquila", "lydia"],
    situations: [
      {
        id: "phoebe-delivers-romans",
        title: "Delivering the Letter to the Romans",
        category: "Obedience",
        reference: "Romans 16:1-2",
        situation: "Paul entrusted Phoebe with carrying the epistle to the Romans from Corinth to Rome.",
        pressure: "Traveling as a woman across the ancient world carrying a document of immense theological importance.",
        innerBattle: "Am I worthy of this trust? Can I complete this mission safely?",
        response: "She accepted the commission and delivered the letter faithfully.",
        outcome: "The Roman church received Paul's greatest theological work, shaping Christianity for all time.",
        lesson: "God entrusts critical missions to faithful servants, not just prominent leaders.",
        traitRevealed: "Trustworthy service",
        spiritualPrinciple: "The most significant contributions to God's kingdom are often made by those the world overlooks.",
        reflectionQuestions: [
          "What has God entrusted to you that you must deliver faithfully?",
          "Do you serve with the reliability that earns apostolic commendation?"
        ],
        dnaSnapshot: { faith: 4, courage: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 6. RHODA
  // ============================================
  {
    id: "rhoda",
    name: "Rhoda",
    meaning: "Rose",
    emoji: "🌹",
    role: "Servant girl who answered the door during a prayer meeting for Peter",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 12:12-17"],
    archetypes: ["Servant", "Seeker"],
    dna: { faith: 3, humility: 4, courage: 2, wisdom: 2, compassion: 3, fear: 3, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Joy and excitement at answered prayer",
      weakness: "So excited she forgot to open the door",
      mindset: "It really is Peter—God answered!",
      keyLesson: "Sometimes we pray for miracles but are shocked when God actually answers.",
      keyVerse: "And when she knew Peter's voice, she opened not the gate for gladness, but ran in, and told how Peter stood before the gate.",
      keyVerseRef: "Acts 12:14"
    },
    storyArc: "A humble servant girl in Mary's household who recognized Peter's voice at the gate after his miraculous prison escape, but was so overjoyed she forgot to let him in—exposing the church's struggle to believe their own prayers had been answered.",
    therapyView: {
      drivingFears: ["Not being believed", "Being dismissed as a lowly servant"],
      coreMotivations: ["Faithfulness in her role", "Joy at God's work"],
      relationalStyle: "Enthusiastic but easily flustered",
      blindSpots: ["Letting excitement override practical action"],
      healingMoments: ["Being proven right when Peter was finally let in"]
    },
    strengths: ["Genuine joy", "Faithfulness at her post", "Recognizing God's answer"],
    weaknesses: ["Flustered by excitement", "Dismissed by others"],
    journey: [
      { phase: "Calling", description: "Served faithfully in Mary's household" },
      { phase: "Testing", description: "Answered the door and recognized Peter but was too excited to open it" },
      { phase: "Legacy", description: "Her story reveals the gap between praying and actually believing" }
    ],
    relationships: [
      { name: "Peter", role: "Apostle whose voice she recognized" },
      { name: "Mary (mother of Mark)", role: "Mistress of the household" }
    ],
    lessonsAndReflection: [
      "Do you actually expect God to answer your prayers?",
      "How do you respond when God does something you asked for but did not truly expect?"
    ],
    relatedCharacters: ["peter", "mark-john-mark"],
    situations: [
      {
        id: "rhoda-answers-door",
        title: "Too Joyful to Open the Door",
        category: "Faith Testing",
        reference: "Acts 12:12-17",
        situation: "The church was praying for Peter's release from prison. When he showed up at the door, Rhoda answered.",
        pressure: "Peter was knocking urgently while being a fugitive from Herod's soldiers.",
        innerBattle: "She was overwhelmed with joy and forgot the practical step of actually opening the gate.",
        response: "She ran inside to tell everyone, leaving Peter standing outside knocking.",
        outcome: "The believers said she was mad, but Peter kept knocking until they opened and were astonished.",
        lesson: "We often pray fervently but are shocked when God actually answers.",
        traitRevealed: "Genuine but overwhelming joy",
        spiritualPrinciple: "Faith means expecting God to do what you asked Him to do.",
        reflectionQuestions: [
          "Have you ever been surprised by an answered prayer?",
          "Does your faith match your prayer life?"
        ],
        dnaSnapshot: { faith: 3, humility: 4 }
      }
    ]
  },
  // ============================================
  // 7. CLAUDIA
  // ============================================
  {
    id: "claudia",
    name: "Claudia",
    meaning: "Lame (Roman family name)",
    emoji: "🏛️",
    role: "Christian woman mentioned in Paul's final greetings",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["2 Timothy 4:21"],
    archetypes: ["Servant"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Faithfulness in the Roman Christian community",
      weakness: "Almost nothing is known about her",
      mindset: "Stand with the believers even in Rome",
      keyLesson: "Being named by Paul in Scripture is an eternal commendation for quiet faithfulness.",
      keyVerse: "Eubulus greeteth thee, and Pudens, and Linus, and Claudia, and all the brethren.",
      keyVerseRef: "2 Timothy 4:21"
    },
    storyArc: "A Christian woman in Rome mentioned by Paul in his final letter, written from prison before his execution. Her inclusion in his greetings suggests she was a trusted and faithful member of the Roman church during one of Christianity's most dangerous periods.",
    therapyView: {
      drivingFears: ["Persecution under Nero", "Losing fellow believers"],
      coreMotivations: ["Supporting the church in Rome", "Remaining faithful under persecution"],
      relationalStyle: "Committed community member",
      blindSpots: ["Unknown"],
      healingMoments: ["Being remembered by Paul in his final letter"]
    },
    strengths: ["Faithfulness under persecution", "Community commitment"],
    weaknesses: ["Obscurity—we know almost nothing about her"],
    journey: [
      { phase: "Calling", description: "Became part of the Christian community in Rome" },
      { phase: "Testing", description: "Remained faithful during Nero's persecution" },
      { phase: "Legacy", description: "Named by Paul in his final inspired letter" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who named her in 2 Timothy" },
      { name: "Linus", role: "Fellow Roman believer" }
    ],
    lessonsAndReflection: [
      "Would your faithfulness be noteworthy enough for an apostle to mention?",
      "How do you remain committed to the church during difficult seasons?"
    ],
    relatedCharacters: ["paul"],
    situations: [
      {
        id: "claudia-faithful-in-rome",
        title: "Faithful in Nero's Rome",
        category: "Persecution",
        reference: "2 Timothy 4:21",
        situation: "Claudia was part of the Roman church during the reign of Nero, when Christians faced severe persecution.",
        pressure: "Associating with Paul and the church could mean arrest, torture, or death.",
        innerBattle: "Is it worth the risk to remain visibly Christian in Rome?",
        response: "She remained faithful and connected to the community, earning Paul's mention in his final letter.",
        outcome: "Her name is preserved in Scripture as a testament to quiet perseverance.",
        lesson: "Faithfulness during persecution is its own eternal legacy.",
        traitRevealed: "Steadfast commitment",
        spiritualPrinciple: "God remembers those who stand firm when it costs the most.",
        reflectionQuestions: [
          "Would you remain faithful if your faith could cost your life?",
          "How do you support fellow believers in difficult times?"
        ],
        dnaSnapshot: { faith: 4, courage: 3, humility: 4 }
      }
    ]
  },
  // ============================================
  // 8. TABEEL
  // ============================================
  {
    id: "tabeel",
    name: "Tabeel",
    meaning: "God is good (ironic—used for a puppet)",
    emoji: "🎭",
    role: "Man Syria and Israel tried to install as puppet king of Judah",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Isaiah 7:1-9"],
    archetypes: ["Manipulator"],
    dna: { faith: 1, humility: 2, courage: 2, wisdom: 2, compassion: 1, fear: 3, pride: 4, greed: 4 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Political connections with foreign powers",
      weakness: "A tool of foreign ambition with no divine mandate",
      mindset: "Power through alliance rather than divine appointment",
      keyLesson: "Human schemes to replace God's anointed always fail.",
      keyVerse: "Let us go up against Judah, and vex it, and let us make a breach therein for us, and set a king in the midst of it, even the son of Tabeal.",
      keyVerseRef: "Isaiah 7:6"
    },
    storyArc: "During the Syro-Ephraimite crisis, Syria and northern Israel conspired to overthrow Judah's Davidic king and replace him with the son of Tabeel—a puppet who would serve their interests. God declared through Isaiah that this plan would not stand, preserving the Davidic line that pointed to the Messiah.",
    therapyView: {
      drivingFears: ["Irrelevance without powerful patrons"],
      coreMotivations: ["Political power", "Advancement through foreign alliance"],
      relationalStyle: "Dependent on powerful sponsors",
      blindSpots: ["Fighting against God's sovereign plan"],
      healingMoments: ["None recorded"]
    },
    strengths: ["Political connections"],
    weaknesses: ["No divine mandate", "Pawn of foreign powers", "Opposing God's plan"],
    journey: [
      { phase: "Calling", description: "Selected by Syria and Israel as their puppet candidate for Judah's throne" },
      { phase: "Failure", description: "God declared through Isaiah that the scheme would not stand" }
    ],
    relationships: [
      { name: "Rezin", role: "King of Syria, sponsor" },
      { name: "Pekah", role: "King of Israel, co-conspirator" },
      { name: "Ahaz", role: "King of Judah, target of the plot" }
    ],
    lessonsAndReflection: [
      "Are you trying to position yourself through human schemes rather than God's calling?",
      "What happens when we fight against God's established plan?"
    ],
    relatedCharacters: ["ahab"],
    situations: [
      {
        id: "tabeel-puppet-king",
        title: "The Failed Puppet King Plot",
        category: "Power and Success",
        reference: "Isaiah 7:1-9",
        situation: "Syria and Israel conspired to depose Ahaz and install the son of Tabeel as a puppet king over Judah.",
        pressure: "The Davidic line and Messianic promise were under direct political threat.",
        innerBattle: "Human ambition versus God's sovereign covenant.",
        response: "God sent Isaiah to Ahaz declaring the plot would fail: It shall not stand, neither shall it come to pass.",
        outcome: "The conspiracy collapsed. The Davidic line was preserved, and through it, the Messiah would come.",
        lesson: "No human conspiracy can overthrow what God has established.",
        traitRevealed: "The futility of opposing God's plan",
        spiritualPrinciple: "God's covenant promises are unbreakable by human or political schemes.",
        reflectionQuestions: [
          "Have you ever tried to force an outcome that was not God's will?",
          "How does God's sovereignty comfort you when powerful forces oppose His plan?"
        ],
        dnaSnapshot: { pride: 4, greed: 4, faith: 1 }
      }
    ]
  },
  // ============================================
  // 9. AGABUS
  // ============================================
  {
    id: "agabus",
    name: "Agabus",
    meaning: "Locust",
    emoji: "⛓️",
    role: "Early church prophet who predicted famine and Paul's arrest",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 11:27-30", "Acts 21:10-14"],
    archetypes: ["Prophet"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Accurate prophetic insight confirmed by events",
      weakness: "Delivering hard truths people did not want to hear",
      mindset: "Speak what the Spirit reveals, regardless of the response",
      keyLesson: "True prophets deliver God's message faithfully, even when it brings unwelcome news.",
      keyVerse: "Thus saith the Holy Ghost, So shall the Jews at Jerusalem bind the man that owneth this girdle.",
      keyVerseRef: "Acts 21:11"
    },
    storyArc: "A New Testament prophet from Jerusalem who accurately predicted the great famine under Claudius Caesar and later dramatically prophesied Paul's arrest in Jerusalem by binding his own hands and feet with Paul's belt—a message that was true even though Paul chose to go anyway.",
    therapyView: {
      drivingFears: ["Being a false prophet", "The church ignoring God's warnings"],
      coreMotivations: ["Faithful transmission of God's word", "Preparing the church for coming trials"],
      relationalStyle: "Bold, dramatic communicator who cared deeply about the church",
      blindSpots: ["Could be perceived as discouraging"],
      healingMoments: ["His famine prophecy led to a relief offering that strengthened church unity"]
    },
    strengths: ["Prophetic accuracy", "Boldness", "Obedience to the Spirit", "Dramatic communication"],
    weaknesses: ["His warnings could be misinterpreted as discouragement"],
    journey: [
      { phase: "Calling", description: "Recognized as a prophet in the early Jerusalem church" },
      { phase: "Testing", description: "Predicted the great famine—and it came to pass" },
      { phase: "Legacy", description: "Prophesied Paul's arrest in Jerusalem with dramatic symbolic action" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle whose arrest he predicted" }
    ],
    lessonsAndReflection: [
      "Do you speak God's truth even when it is unwelcome?",
      "How do you respond when a warning from God does not change the outcome?"
    ],
    relatedCharacters: ["paul"],
    situations: [
      {
        id: "agabus-predicts-famine",
        title: "Predicting the Great Famine",
        category: "Calling",
        reference: "Acts 11:27-30",
        situation: "Agabus stood up in the Antioch church and predicted by the Spirit that a great famine would come over the entire Roman world.",
        pressure: "Making a specific, verifiable prediction that would either confirm or discredit his prophetic gift.",
        innerBattle: "Will they believe me? What if I am wrong?",
        response: "He spoke boldly what the Spirit revealed, and the church acted on it by sending relief to Judea.",
        outcome: "The famine came under Claudius exactly as predicted, and the relief effort strengthened ties between Gentile and Jewish believers.",
        lesson: "Prophetic warnings given in faith can mobilize the church to act with compassion.",
        traitRevealed: "Prophetic accuracy and boldness",
        spiritualPrinciple: "God reveals the future so His people can prepare and serve, not merely predict.",
        reflectionQuestions: [
          "Do you act on warnings God gives, or wait passively?",
          "How does prophecy serve the practical needs of the church?"
        ],
        dnaSnapshot: { faith: 5, courage: 4, wisdom: 4 }
      },
      {
        id: "agabus-pauls-belt",
        title: "Binding Paul's Belt",
        category: "Obedience",
        reference: "Acts 21:10-14",
        situation: "Agabus took Paul's belt, bound his own hands and feet, and prophesied that Paul would be arrested in Jerusalem.",
        pressure: "Delivering a devastating prophecy to a beloved leader surrounded by friends begging him not to go.",
        innerBattle: "Should I soften the message, or deliver it exactly as the Spirit gave it?",
        response: "He performed the symbolic act and spoke plainly, then accepted Paul's decision to go regardless.",
        outcome: "Paul was arrested in Jerusalem exactly as Agabus said. The prophecy was warning, not prohibition.",
        lesson: "A prophet's job is to deliver the message, not to control the response.",
        traitRevealed: "Faithful obedience to the Spirit",
        spiritualPrinciple: "God's warnings are acts of love, even when they do not change the outcome.",
        reflectionQuestions: [
          "Can you speak hard truth to someone you love and then release the outcome?",
          "How do you distinguish between a warning and a prohibition from God?"
        ],
        dnaSnapshot: { faith: 5, courage: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 10. EPAPHRAS
  // ============================================
  {
    id: "epaphras",
    name: "Epaphras",
    meaning: "Lovely, charming",
    emoji: "🙇",
    role: "Founder of the Colossian church and fervent prayer warrior",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Colossians 1:7-8", "Colossians 4:12-13", "Philemon 1:23"],
    archetypes: ["Missionary", "Servant"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 4, compassion: 5, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Missionary",
      strength: "Agonizing prayer on behalf of others",
      weakness: "Burdened by concern for churches he could not physically visit",
      mindset: "I will wrestle in prayer until they stand mature in Christ",
      keyLesson: "Intercessory prayer is the most powerful ministry a believer can exercise.",
      keyVerse: "Always labouring fervently for you in prayers, that ye may stand perfect and complete in all the will of God.",
      keyVerseRef: "Colossians 4:12"
    },
    storyArc: "The man who brought the gospel to Colossae and then, while imprisoned with Paul in Rome, agonized in prayer for the church he had planted—demonstrating that pastoral care does not require physical presence when powered by fervent intercession.",
    therapyView: {
      drivingFears: ["The Colossians falling into heresy", "Being unable to shepherd from prison"],
      coreMotivations: ["Spiritual maturity of his converts", "Faithfulness to his calling"],
      relationalStyle: "Deeply invested, willing to suffer for those he loved",
      blindSpots: ["Potential for anxiety disguised as concern"],
      healingMoments: ["Paul's affirmation of his faithful ministry"]
    },
    strengths: ["Fervent intercession", "Church planting", "Faithfulness", "Sacrificial love"],
    weaknesses: ["Possible anxiety about distant churches", "Burden of responsibility"],
    journey: [
      { phase: "Calling", description: "Evangelized Colossae, Laodicea, and Hierapolis" },
      { phase: "Testing", description: "Imprisoned with Paul in Rome, unable to be with his churches" },
      { phase: "Legacy", description: "His prayer life became a model for all intercessors" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle and fellow prisoner" },
      { name: "Colossian church", role: "Church he planted and prayed for" }
    ],
    lessonsAndReflection: [
      "Do you agonize in prayer for others or merely mention them?",
      "How do you care for people you cannot physically be with?"
    ],
    relatedCharacters: ["paul", "philemon", "onesimus"],
    situations: [
      {
        id: "epaphras-prayer-warrior",
        title: "Wrestling in Prayer from Prison",
        category: "Sacrifice",
        reference: "Colossians 4:12-13",
        situation: "Imprisoned in Rome with Paul, Epaphras could not visit the churches he had planted in the Lycus Valley.",
        pressure: "False teachers were threatening the Colossian church and he was powerless to intervene physically.",
        innerBattle: "How can I protect my people when I am chained in Rome?",
        response: "He labored fervently—agonized—in prayer for them, wrestling before God for their maturity and completeness.",
        outcome: "Paul wrote Colossians partly because of Epaphras's report and prayers, and the church was strengthened.",
        lesson: "When you cannot be physically present, prayer is not a lesser ministry—it is the greatest one.",
        traitRevealed: "Fervent intercession",
        spiritualPrinciple: "Prayer is the most powerful work a Christian can do, especially when all other options are removed.",
        reflectionQuestions: [
          "Do you labor in prayer or merely recite requests?",
          "Who are you agonizing in prayer for right now?"
        ],
        dnaSnapshot: { faith: 5, compassion: 5, humility: 5 }
      }
    ]
  },
  // ============================================
  // 11. EPAPHRODITUS
  // ============================================
  {
    id: "epaphroditus",
    name: "Epaphroditus",
    meaning: "Charming, handsome",
    emoji: "💪",
    role: "Philippian messenger who nearly died serving Paul",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Philippians 2:25-30", "Philippians 4:18"],
    archetypes: ["Servant", "Martyr"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 3, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Willingness to risk his life for the gospel",
      weakness: "Distressed that others worried about him",
      mindset: "I will serve Paul and the church even if it kills me",
      keyLesson: "True service means risking everything without seeking recognition.",
      keyVerse: "For the work of Christ he was nigh unto death, not regarding his life, to supply your lack of service toward me.",
      keyVerseRef: "Philippians 2:30"
    },
    storyArc: "Sent by the Philippian church to deliver their gift to Paul in prison, Epaphroditus fell gravely ill in Rome—nearly dying in his service. Paul sent him back with a commendation, urging the church to honor such men who risk their lives for the gospel.",
    therapyView: {
      drivingFears: ["Failing the Philippians' mission", "Being seen as a burden to Paul"],
      coreMotivations: ["Serving Paul and the church", "Completing his mission at any cost"],
      relationalStyle: "Self-sacrificing, others-focused, distressed at causing worry",
      blindSpots: ["Neglecting his own health in service", "Difficulty accepting help"],
      healingMoments: ["God's mercy in restoring his health", "Paul's public commendation"]
    },
    strengths: ["Sacrificial courage", "Faithfulness", "Humility", "Mission completion"],
    weaknesses: ["Overextended himself physically", "Anxious about others' concern for him"],
    journey: [
      { phase: "Calling", description: "Chosen by the Philippian church to serve Paul in prison" },
      { phase: "Testing", description: "Fell gravely ill while serving, nearly dying" },
      { phase: "Refinement", description: "God had mercy and restored him" },
      { phase: "Legacy", description: "Paul held him up as an example of sacrificial service" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle he served" },
      { name: "Philippian church", role: "Sending church" }
    ],
    lessonsAndReflection: [
      "Are you willing to risk your health and comfort for the gospel?",
      "How do you handle being a burden to others when you have given everything?"
    ],
    relatedCharacters: ["paul"],
    situations: [
      {
        id: "epaphroditus-nearly-dies",
        title: "Nearly Dying in Service",
        category: "Sacrifice",
        reference: "Philippians 2:25-30",
        situation: "Epaphroditus traveled to Rome to serve Paul in prison and deliver the Philippians' gift, but fell gravely ill.",
        pressure: "He was near death and distressed that the Philippians had heard about his illness.",
        innerBattle: "I came to serve, not to become a burden. Have I failed my mission?",
        response: "He served faithfully despite his illness, and God had mercy and restored him.",
        outcome: "Paul sent him back with the highest commendation, urging the church to honor such sacrificial servants.",
        lesson: "God honors those who risk everything in service, even when the cost is nearly fatal.",
        traitRevealed: "Sacrificial dedication",
        spiritualPrinciple: "Hold such people in high regard—those who nearly die for the work of Christ.",
        reflectionQuestions: [
          "Have you ever served to the point of personal cost?",
          "How do you respond when your sacrifice goes unnoticed or causes worry?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 5 }
      }
    ]
  },
  // ============================================
  // 12. SILVANUS
  // ============================================
  {
    id: "silvanus",
    name: "Silvanus (Silas)",
    meaning: "Of the forest",
    emoji: "✍️",
    role: "Paul's missionary companion and Peter's amanuensis",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 15:22-40", "Acts 16:19-34", "1 Peter 5:12", "1 Thessalonians 1:1"],
    archetypes: ["Missionary", "Servant"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Missionary",
      strength: "Faithfulness under persecution and versatile ministry",
      weakness: "Often overshadowed by Paul and Peter",
      mindset: "I will serve wherever the gospel needs me",
      keyLesson: "The most impactful servants are those willing to play supporting roles for multiple leaders.",
      keyVerse: "By Silvanus, a faithful brother unto you, as I suppose, I have written briefly.",
      keyVerseRef: "1 Peter 5:12"
    },
    storyArc: "A Roman citizen and leader in the Jerusalem church who became Paul's missionary partner after the split with Barnabas, was beaten and imprisoned in Philippi where he sang hymns at midnight, co-authored letters to the Thessalonians, and later served as Peter's faithful secretary for 1 Peter.",
    therapyView: {
      drivingFears: ["The gospel being hindered", "Division in the church"],
      coreMotivations: ["Advancing the gospel", "Supporting apostolic leaders", "Church unity"],
      relationalStyle: "Adaptable team player who served multiple leaders effectively",
      blindSpots: ["Potential frustration at always being second"],
      healingMoments: ["Singing hymns in the Philippian jail", "Peter's commendation as a faithful brother"]
    },
    strengths: ["Versatility", "Courage under persecution", "Worship in suffering", "Literary skill"],
    weaknesses: ["Overshadowed by the leaders he served"],
    journey: [
      { phase: "Calling", description: "Chosen as a leader in the Jerusalem church and sent with the Acts 15 decree" },
      { phase: "Testing", description: "Beaten and imprisoned in Philippi with Paul" },
      { phase: "Refinement", description: "Served as co-worker in Thessalonica, Corinth, and beyond" },
      { phase: "Legacy", description: "Penned 1 Peter as Peter's faithful amanuensis" }
    ],
    relationships: [
      { name: "Paul", role: "Missionary partner" },
      { name: "Peter", role: "Apostle he served as secretary" },
      { name: "Timothy", role: "Fellow co-worker" }
    ],
    lessonsAndReflection: [
      "Can you serve different leaders with equal faithfulness?",
      "How do you worship God in your darkest circumstances?"
    ],
    relatedCharacters: ["paul", "peter", "mark-john-mark"],
    situations: [
      {
        id: "silvanus-philippian-jail",
        title: "Singing in the Philippian Jail",
        category: "Persecution",
        reference: "Acts 16:19-34",
        situation: "After being beaten with rods and thrown into the inner prison with their feet in stocks, Silvanus and Paul sang hymns at midnight.",
        pressure: "Unjust imprisonment, physical agony, and an uncertain future.",
        innerBattle: "How do we respond to suffering for doing good?",
        response: "They prayed and sang hymns to God loudly enough for the other prisoners to hear.",
        outcome: "An earthquake opened the prison, the jailer and his household were saved, and the magistrates were humbled.",
        lesson: "Worship in suffering becomes a witness that shakes foundations.",
        traitRevealed: "Unshakeable joy in persecution",
        spiritualPrinciple: "When believers worship in chains, God shakes the prison.",
        reflectionQuestions: [
          "Can you worship God when everything has been taken from you?",
          "How might your response to suffering become a witness to others?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // ============================================
  // 13. SOSTHENES
  // ============================================
  {
    id: "sosthenes",
    name: "Sosthenes",
    meaning: "Safe in strength",
    emoji: "🤕",
    role: "Synagogue ruler beaten before Gallio; later Paul's co-worker",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 18:17", "1 Corinthians 1:1"],
    archetypes: ["Survivor", "Servant"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Survivor",
      strength: "Endured public beating and emerged as a believer",
      weakness: "Caught between Jewish community and the gospel",
      mindset: "Suffering for truth is worth it",
      keyLesson: "God can transform even public humiliation into a testimony of faith.",
      keyVerse: "Paul, called to be an apostle of Jesus Christ through the will of God, and Sosthenes our brother.",
      keyVerseRef: "1 Corinthians 1:1"
    },
    storyArc: "The synagogue ruler in Corinth who was beaten before the Roman proconsul Gallio when the Jewish case against Paul collapsed. Likely converted afterward, he appears as Paul's co-author of 1 Corinthians—transformed from a persecuted bystander into a gospel partner.",
    therapyView: {
      drivingFears: ["Public shame", "Rejection by his community"],
      coreMotivations: ["Truth", "Faithfulness to conviction"],
      relationalStyle: "Resilient, willing to cross social boundaries for truth",
      blindSpots: ["Initially may have opposed Paul before conversion"],
      healingMoments: ["Becoming Paul's brother and co-worker"]
    },
    strengths: ["Resilience", "Willingness to change", "Partnership in ministry"],
    weaknesses: ["Caught between worlds", "Suffered unjust violence"],
    journey: [
      { phase: "Testing", description: "Beaten publicly before Gallio in Corinth" },
      { phase: "Refinement", description: "Converted to faith in Christ" },
      { phase: "Legacy", description: "Named as co-author of 1 Corinthians" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle and co-worker" },
      { name: "Gallio", role: "Roman proconsul before whom he was beaten" }
    ],
    lessonsAndReflection: [
      "Has suffering ever led you closer to the truth?",
      "Can God redeem your worst public moment?"
    ],
    relatedCharacters: ["paul", "crispus"],
    situations: [
      {
        id: "sosthenes-beaten",
        title: "Beaten Before Gallio",
        category: "Persecution",
        reference: "Acts 18:17",
        situation: "When Gallio dismissed the Jewish case against Paul, the crowd turned on Sosthenes and beat him before the judgment seat.",
        pressure: "Unjust mob violence in a public setting with no legal protection.",
        innerBattle: "Why am I suffering when I have done nothing wrong?",
        response: "He endured the beating and ultimately came to faith, joining Paul's ministry.",
        outcome: "He became Paul's brother in Christ and co-sender of 1 Corinthians.",
        lesson: "God can use unjust suffering as the catalyst for conversion and ministry.",
        traitRevealed: "Resilience through suffering",
        spiritualPrinciple: "What the enemy means to destroy, God transforms into a testimony.",
        reflectionQuestions: [
          "Has an unjust experience ever become a turning point in your faith?",
          "Can you see God working even in your worst moments?"
        ],
        dnaSnapshot: { courage: 3, faith: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 14. CRISPUS
  // ============================================
  {
    id: "crispus",
    name: "Crispus",
    meaning: "Curly-haired",
    emoji: "🕍",
    role: "Synagogue ruler in Corinth who believed in Christ",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 18:8", "1 Corinthians 1:14"],
    archetypes: ["Seeker", "Servant"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 4, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "Willing to risk everything for the truth",
      weakness: "Had to abandon his position and community",
      mindset: "The truth is worth more than my status",
      keyLesson: "True faith sometimes requires leaving behind everything familiar.",
      keyVerse: "And Crispus, the chief ruler of the synagogue, believed on the Lord with all his house.",
      keyVerseRef: "Acts 18:8"
    },
    storyArc: "The chief ruler of the synagogue in Corinth who, after hearing Paul's message, believed in the Lord with his entire household—a stunning conversion that would have cost him his position, community, and reputation among the Jews.",
    therapyView: {
      drivingFears: ["Losing his community and status", "Leading his family astray"],
      coreMotivations: ["Truth above tradition", "Leading his household rightly"],
      relationalStyle: "Decisive leader who brought his whole family along",
      blindSpots: ["The cost of his decision on relationships with former colleagues"],
      healingMoments: ["Paul personally baptized him—a rare honor"]
    },
    strengths: ["Decisive faith", "Family leadership", "Intellectual honesty", "Courage to change"],
    weaknesses: ["Loss of status and community", "Potential isolation"],
    journey: [
      { phase: "Calling", description: "Heard Paul's preaching in the Corinthian synagogue" },
      { phase: "Testing", description: "Had to choose between his position and the gospel" },
      { phase: "Legacy", description: "Believed with his whole household, personally baptized by Paul" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who baptized him" }
    ],
    lessonsAndReflection: [
      "What would you give up to follow the truth?",
      "Are you leading your household toward faith or away from it?"
    ],
    relatedCharacters: ["paul", "sosthenes"],
    situations: [
      {
        id: "crispus-believes",
        title: "The Synagogue Ruler Believes",
        category: "Faith Testing",
        reference: "Acts 18:8",
        situation: "As chief ruler of the Corinthian synagogue, Crispus heard Paul preach that Jesus was the Messiah.",
        pressure: "Believing meant losing his position, his community, and possibly his livelihood.",
        innerBattle: "Is Jesus truly the Messiah, and is the truth worth everything I will lose?",
        response: "He believed on the Lord with all his house, making a complete and public commitment.",
        outcome: "His conversion was so significant that Paul personally baptized him, and many Corinthians followed.",
        lesson: "When conviction meets courage, entire households can be transformed.",
        traitRevealed: "Decisive, costly faith",
        spiritualPrinciple: "The truth is worth more than any position or reputation.",
        reflectionQuestions: [
          "What position or status might be keeping you from fully following Christ?",
          "Are you willing to be the first in your community to take a stand for truth?"
        ],
        dnaSnapshot: { faith: 5, courage: 4, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 15. GAIUS
  // ============================================
  {
    id: "gaius",
    name: "Gaius",
    meaning: "Rejoice",
    emoji: "🏠",
    role: "Generous host of the church and traveling missionaries",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Romans 16:23", "3 John 1:1-8", "1 Corinthians 1:14"],
    archetypes: ["Servant", "Builder"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 5, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Radical hospitality that sustained the church",
      weakness: "Potentially vulnerable to being exploited by freeloaders",
      mindset: "My home belongs to God and His people",
      keyLesson: "Hospitality is a frontline ministry that enables the gospel to advance.",
      keyVerse: "Beloved, thou doest faithfully whatsoever thou doest to the brethren, and to strangers.",
      keyVerseRef: "3 John 1:5"
    },
    storyArc: "A wealthy believer who hosted the entire church in Corinth and extended hospitality to traveling missionaries, earning commendation from both Paul and John as a model of generous, faithful service that kept the gospel moving forward.",
    therapyView: {
      drivingFears: ["Failing to care for God's servants", "The church having no meeting place"],
      coreMotivations: ["Supporting the gospel through practical generosity", "Creating community"],
      relationalStyle: "Open-hearted, generous, welcoming to all",
      blindSpots: ["Could be taken advantage of by false teachers"],
      healingMoments: ["John's personal letter of commendation"]
    },
    strengths: ["Generosity", "Hospitality", "Faithfulness", "Community building"],
    weaknesses: ["Vulnerability to exploitation", "The burden of hosting"],
    journey: [
      { phase: "Calling", description: "Opened his home to the church and missionaries" },
      { phase: "Testing", description: "Hosted the whole church despite the cost and risk" },
      { phase: "Legacy", description: "Commended by Paul and John as a model of hospitality" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who baptized him and stayed in his home" },
      { name: "John", role: "Apostle who wrote 3 John to him" }
    ],
    lessonsAndReflection: [
      "Is your home open to God's people and purposes?",
      "How does practical hospitality advance the gospel?"
    ],
    relatedCharacters: ["paul", "philemon"],
    situations: [
      {
        id: "gaius-hosts-church",
        title: "Hosting the Whole Church",
        category: "Sacrifice",
        reference: "Romans 16:23",
        situation: "Gaius opened his home to host the entire Corinthian church and every traveling missionary who passed through.",
        pressure: "The financial, social, and personal cost of providing for an entire congregation and itinerant workers.",
        innerBattle: "Can I sustain this level of generosity? Is it worth the sacrifice?",
        response: "He gave faithfully and consistently, becoming known across the churches for his hospitality.",
        outcome: "Paul commended him publicly, and John wrote him a personal letter of encouragement.",
        lesson: "Hospitality is not a spiritual gift for some—it is a command that sustains the church.",
        traitRevealed: "Radical generosity",
        spiritualPrinciple: "When you welcome God's servants, you become a partner in the truth.",
        reflectionQuestions: [
          "How generous are you with your home and resources for God's purposes?",
          "Do you see hospitality as a ministry or a burden?"
        ],
        dnaSnapshot: { compassion: 5, faith: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 16. ARCHIPPUS
  // ============================================
  {
    id: "archippus",
    name: "Archippus",
    meaning: "Horse ruler",
    emoji: "📢",
    role: "Minister in the Colossian church told to complete his ministry",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Colossians 4:17", "Philemon 1:2"],
    archetypes: ["Servant"],
    dna: { faith: 3, humility: 3, courage: 3, wisdom: 3, compassion: 3, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Had a specific ministry calling from the Lord",
      weakness: "Apparently needed exhortation to complete it",
      mindset: "I must finish what God has given me to do",
      keyLesson: "Starting a ministry is not enough—you must complete it.",
      keyVerse: "Take heed to the ministry which thou hast received in the Lord, that thou fulfil it.",
      keyVerseRef: "Colossians 4:17"
    },
    storyArc: "A minister in the church at Colossae (possibly Philemon's son) whom Paul publicly exhorted to complete the ministry he had received from the Lord—suggesting he was either faltering, distracted, or losing heart in his calling.",
    therapyView: {
      drivingFears: ["Failure", "Inadequacy for the task"],
      coreMotivations: ["Serving God", "Completing his assignment"],
      relationalStyle: "Part of a ministry household but possibly losing momentum",
      blindSpots: ["Complacency or discouragement in ministry"],
      healingMoments: ["Paul's direct exhortation as a wake-up call"]
    },
    strengths: ["Had a clear calling", "Part of a godly community"],
    weaknesses: ["Needed external motivation", "Risk of not finishing"],
    journey: [
      { phase: "Calling", description: "Received a specific ministry from the Lord" },
      { phase: "Resistance", description: "Apparently struggling to fulfill it" },
      { phase: "Refinement", description: "Publicly exhorted by Paul to take heed and complete it" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who exhorted him" },
      { name: "Philemon", role: "Possibly his father or close associate" }
    ],
    lessonsAndReflection: [
      "Is there a ministry calling you have left incomplete?",
      "Do you need someone to exhort you to finish what God started in you?"
    ],
    relatedCharacters: ["paul", "philemon", "epaphras"],
    situations: [
      {
        id: "archippus-fulfill-ministry",
        title: "The Call to Complete His Ministry",
        category: "Calling",
        reference: "Colossians 4:17",
        situation: "Archippus had received a specific ministry from the Lord but apparently was not fulfilling it.",
        pressure: "The temptation to coast, give up, or be distracted from his calling.",
        innerBattle: "Do I have what it takes to finish this? Is it still worth pursuing?",
        response: "Paul publicly called on the church to tell Archippus: Take heed to your ministry and fulfill it.",
        outcome: "The exhortation is preserved in Scripture as a challenge to every believer who has grown complacent.",
        lesson: "God does not just call you—He expects you to finish.",
        traitRevealed: "The danger of an unfulfilled calling",
        spiritualPrinciple: "A ministry received from the Lord must be completed, not merely begun.",
        reflectionQuestions: [
          "What ministry has God given you that remains unfinished?",
          "Who in your life has the authority to exhort you back to your calling?"
        ],
        dnaSnapshot: { faith: 3, courage: 3 }
      }
    ]
  },
  // ============================================
  // 17. NYMPHA
  // ============================================
  {
    id: "nympha",
    name: "Nympha",
    meaning: "Bride",
    emoji: "🏡",
    role: "House church leader in Laodicea",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Colossians 4:15"],
    archetypes: ["Servant", "Builder"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Builder",
      strength: "Providing a gathering place for the church",
      weakness: "Very little is known about her beyond this act",
      mindset: "My home is the church's home",
      keyLesson: "The early church was built in living rooms, not cathedrals.",
      keyVerse: "Salute the brethren which are in Laodicea, and Nymphas, and the church which is in his house.",
      keyVerseRef: "Colossians 4:15"
    },
    storyArc: "A believer in Laodicea who hosted a church in her home, providing the physical space where the body of Christ could gather for worship, teaching, and fellowship in an era when there were no church buildings.",
    therapyView: {
      drivingFears: ["The church having no place to meet", "Persecution for hosting believers"],
      coreMotivations: ["Providing for God's people", "Building Christian community"],
      relationalStyle: "Hospitable, community-centered",
      blindSpots: ["Unknown"],
      healingMoments: ["Paul's greeting and recognition"]
    },
    strengths: ["Hospitality", "Courage to host a church", "Community building"],
    weaknesses: ["Obscurity—almost nothing is known"],
    journey: [
      { phase: "Calling", description: "Opened her home for the church to gather" },
      { phase: "Legacy", description: "Named by Paul as a house church host in Laodicea" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who greeted her" },
      { name: "Colossian church", role: "Sister church that received Paul's letter" }
    ],
    lessonsAndReflection: [
      "Is your home available for God's purposes?",
      "How can you create space for Christian community?"
    ],
    relatedCharacters: ["paul", "gaius", "epaphras"],
    situations: [
      {
        id: "nympha-house-church",
        title: "Hosting the House Church",
        category: "Obedience",
        reference: "Colossians 4:15",
        situation: "Nympha opened her home in Laodicea as a meeting place for the local church.",
        pressure: "Hosting a Christian gathering in the Roman Empire carried social and legal risks.",
        innerBattle: "Is the risk of hosting believers in my home worth the cost?",
        response: "She made her home available as the church's gathering place.",
        outcome: "A church was sustained and Paul recognized her contribution in his letter.",
        lesson: "The church does not need buildings—it needs open homes and willing hearts.",
        traitRevealed: "Sacrificial hospitality",
        spiritualPrinciple: "When you open your home to God's people, you become foundational to the church.",
        reflectionQuestions: [
          "What resources has God given you that could serve the church?",
          "Are you willing to sacrifice your comfort for Christian community?"
        ],
        dnaSnapshot: { faith: 4, compassion: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 18. JUNIA
  // ============================================
  {
    id: "junia",
    name: "Junia",
    meaning: "Youthful",
    emoji: "⭐",
    role: "Notable among the apostles, fellow prisoner with Paul",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Romans 16:7"],
    archetypes: ["Missionary", "Martyr"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Missionary",
      strength: "Notable reputation among the apostles",
      weakness: "Her identity and role have been debated for centuries",
      mindset: "Serve Christ wherever He leads, whatever the cost",
      keyLesson: "God uses unexpected people in the highest callings.",
      keyVerse: "Salute Andronicus and Junia, my kinsmen, and my fellowprisoners, who are of note among the apostles.",
      keyVerseRef: "Romans 16:7"
    },
    storyArc: "A Jewish believer who was in Christ before Paul, endured imprisonment for the gospel alongside Andronicus, and was recognized as notable among the apostles—a remarkable commendation that shows the breadth of early church leadership.",
    therapyView: {
      drivingFears: ["The gospel being stopped", "Imprisonment"],
      coreMotivations: ["Spreading the gospel", "Faithfulness to Christ"],
      relationalStyle: "Bold, partnered ministry with Andronicus",
      blindSpots: ["Unknown"],
      healingMoments: ["Paul's public recognition of her apostolic standing"]
    },
    strengths: ["Apostolic reputation", "Endurance in prison", "Early faith", "Partnership in ministry"],
    weaknesses: ["Historical obscurity and debate over her identity"],
    journey: [
      { phase: "Calling", description: "Came to faith in Christ before Paul's conversion" },
      { phase: "Testing", description: "Imprisoned for the gospel" },
      { phase: "Legacy", description: "Recognized by Paul as notable among the apostles" }
    ],
    relationships: [
      { name: "Andronicus", role: "Ministry partner and fellow prisoner" },
      { name: "Paul", role: "Apostle who commended her" }
    ],
    lessonsAndReflection: [
      "Are you willing to suffer for the gospel alongside others?",
      "How does God use partnerships in advancing His kingdom?"
    ],
    relatedCharacters: ["paul", "priscilla-aquila"],
    situations: [
      {
        id: "junia-fellow-prisoner",
        title: "Notable Among the Apostles",
        category: "Persecution",
        reference: "Romans 16:7",
        situation: "Junia and Andronicus were imprisoned for their faith and recognized by Paul as outstanding among the apostles.",
        pressure: "Imprisonment for the gospel with no guarantee of release.",
        innerBattle: "Is the cost of gospel ministry worth the suffering?",
        response: "They endured imprisonment and continued faithful service, earning the highest commendation.",
        outcome: "Paul publicly recognized them, preserving their legacy in Scripture.",
        lesson: "Faithfulness through suffering earns a reputation that outlasts any prison.",
        traitRevealed: "Courageous endurance",
        spiritualPrinciple: "Those who suffer for Christ are honored by Christ.",
        reflectionQuestions: [
          "Would Paul commend your ministry and endurance?",
          "How do you partner with others in gospel work?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // ============================================
  // 19. RUFUS
  // ============================================
  {
    id: "rufus",
    name: "Rufus",
    meaning: "Red",
    emoji: "❤️",
    role: "Chosen in the Lord, possibly son of Simon of Cyrene",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Romans 16:13", "Mark 15:21"],
    archetypes: ["Servant"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Chosen in the Lord with a family devoted to the faith",
      weakness: "Little is known beyond Paul's commendation",
      mindset: "The faith my father carried to the cross, I carry in my life",
      keyLesson: "The cross carried by one generation becomes the faith of the next.",
      keyVerse: "Salute Rufus chosen in the Lord, and his mother and mine.",
      keyVerseRef: "Romans 16:13"
    },
    storyArc: "Likely the son of Simon of Cyrene who carried Jesus's cross, Rufus became a believer so exemplary that Paul called him chosen in the Lord. His mother was so dear to Paul that the apostle called her his own mother—a family transformed by their proximity to the cross.",
    therapyView: {
      drivingFears: ["Failing the legacy of faith"],
      coreMotivations: ["Living worthy of his calling", "Honoring the family's faith heritage"],
      relationalStyle: "Part of a warm, nurturing family of faith",
      blindSpots: ["Unknown"],
      healingMoments: ["Paul calling his mother 'my mother too'"]
    },
    strengths: ["Chosen by God", "Faithful family", "Warm community relationships"],
    weaknesses: ["Obscurity—details are sparse"],
    journey: [
      { phase: "Calling", description: "Grew up in a family transformed by the cross—possibly Simon of Cyrene's son" },
      { phase: "Legacy", description: "Paul called him chosen in the Lord and treated his mother as his own" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who commended him" },
      { name: "Simon of Cyrene", role: "Likely father, who carried Jesus's cross" },
      { name: "Mother of Rufus", role: "Mother whom Paul called his own mother" }
    ],
    lessonsAndReflection: [
      "What legacy of faith has been passed to you?",
      "Are you living as one chosen in the Lord?"
    ],
    relatedCharacters: ["paul"],
    situations: [
      {
        id: "rufus-chosen-in-lord",
        title: "Chosen in the Lord",
        category: "Calling",
        reference: "Romans 16:13",
        situation: "Paul singled out Rufus from the Roman church with the extraordinary designation: chosen in the Lord.",
        pressure: "Living up to a family legacy connected to the cross of Christ.",
        innerBattle: "How do I honor the faith my father demonstrated at Calvary?",
        response: "He lived so faithfully that Paul gave him one of Scripture's most personal commendations.",
        outcome: "His family became a spiritual home for Paul himself, and their legacy is preserved in Scripture.",
        lesson: "A father's encounter with the cross can transform generations.",
        traitRevealed: "Generational faithfulness",
        spiritualPrinciple: "Those chosen in the Lord live lives that bless everyone around them.",
        reflectionQuestions: [
          "Is there a spiritual legacy in your family you need to steward?",
          "Whose spiritual mother or father are you?"
        ],
        dnaSnapshot: { faith: 4, humility: 4, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 20. ARISTARCHUS
  // ============================================
  {
    id: "aristarchus",
    name: "Aristarchus",
    meaning: "Best ruler",
    emoji: "⚓",
    role: "Paul's travel companion and fellow prisoner",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 19:29", "Acts 27:2", "Colossians 4:10", "Philemon 1:24"],
    archetypes: ["Missionary", "Servant"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 3, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Missionary",
      strength: "Unwavering loyalty through danger and imprisonment",
      weakness: "Always in Paul's shadow",
      mindset: "Where Paul goes, I go—even to prison",
      keyLesson: "True loyalty means staying when everyone else leaves.",
      keyVerse: "Aristarchus my fellowprisoner saluteth you.",
      keyVerseRef: "Colossians 4:10"
    },
    storyArc: "A Macedonian from Thessalonica who was seized during the Ephesus riot, sailed with Paul to Rome, shared his imprisonment, and remained faithful to the end—one of the most consistently loyal companions in all of Scripture.",
    therapyView: {
      drivingFears: ["Paul being abandoned", "The mission failing"],
      coreMotivations: ["Loyalty to Paul and the gospel", "Completing the mission"],
      relationalStyle: "Fiercely loyal, willing to share any suffering",
      blindSpots: ["Over-identification with Paul rather than independent ministry"],
      healingMoments: ["Paul's repeated public recognition of his loyalty"]
    },
    strengths: ["Unwavering loyalty", "Courage in danger", "Perseverance", "Humility"],
    weaknesses: ["Always secondary", "Limited independent ministry record"],
    journey: [
      { phase: "Calling", description: "Joined Paul's missionary team from Thessalonica" },
      { phase: "Testing", description: "Seized by the mob during the Ephesus riot" },
      { phase: "Refinement", description: "Sailed with Paul through the shipwreck to Rome" },
      { phase: "Legacy", description: "Shared Paul's Roman imprisonment as a fellow prisoner" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle he accompanied" }
    ],
    lessonsAndReflection: [
      "Are you willing to follow a leader into danger?",
      "What does loyalty look like when the cost is imprisonment?"
    ],
    relatedCharacters: ["paul"],
    situations: [
      {
        id: "aristarchus-ephesus-riot",
        title: "Seized in the Ephesus Riot",
        category: "Persecution",
        reference: "Acts 19:29",
        situation: "During the silversmith riot in Ephesus, the mob seized Aristarchus and dragged him into the theater.",
        pressure: "A violent mob threatening his life because of his association with Paul.",
        innerBattle: "Will I survive this? Is the mission worth dying for?",
        response: "He endured the mob and continued with Paul's mission afterward.",
        outcome: "He stayed with Paul through every subsequent trial, all the way to Rome.",
        lesson: "True companions are forged in fire, not comfort.",
        traitRevealed: "Courage under mob violence",
        spiritualPrinciple: "Loyalty tested by danger is loyalty proven genuine.",
        reflectionQuestions: [
          "Would you stay with a leader who keeps getting into dangerous situations?",
          "What has tested your loyalty the most?"
        ],
        dnaSnapshot: { courage: 5, faith: 5, humility: 5 }
      }
    ]
  },
  // ============================================
  // 21. TYCHICUS
  // ============================================
  {
    id: "tychicus",
    name: "Tychicus",
    meaning: "Fortunate",
    emoji: "📨",
    role: "Paul's faithful messenger and letter carrier",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Ephesians 6:21-22", "Colossians 4:7-8", "2 Timothy 4:12", "Titus 3:12"],
    archetypes: ["Servant", "Missionary"],
    dna: { faith: 4, humility: 5, courage: 3, wisdom: 4, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Faithful and dependable message delivery",
      weakness: "Always the messenger, never the author",
      mindset: "I will carry Paul's words faithfully wherever they need to go",
      keyLesson: "Being a trustworthy messenger is one of the highest callings in God's kingdom.",
      keyVerse: "But that ye also may know my affairs, and how I do, Tychicus, a beloved brother and faithful minister in the Lord, shall make known to you all things.",
      keyVerseRef: "Ephesians 6:21"
    },
    storyArc: "Paul's most trusted courier who carried the letters to the Ephesians, Colossians, and possibly Philemon—entrusted not just with documents but with the authority to explain Paul's circumstances and encourage the churches personally.",
    therapyView: {
      drivingFears: ["Failing to deliver accurately", "Churches being left without encouragement"],
      coreMotivations: ["Faithful service", "Encouraging the churches", "Supporting Paul"],
      relationalStyle: "Reliable, encouraging, trusted by all",
      blindSpots: ["Content to remain behind the scenes"],
      healingMoments: ["Paul's repeated description of him as beloved brother and faithful minister"]
    },
    strengths: ["Reliability", "Faithfulness", "Encouraging presence", "Trustworthiness"],
    weaknesses: ["No independent ministry record", "Always in a supporting role"],
    journey: [
      { phase: "Calling", description: "Became Paul's most trusted letter carrier" },
      { phase: "Testing", description: "Traveled repeatedly across the Roman Empire with critical documents" },
      { phase: "Legacy", description: "Delivered some of the most important letters in Christian history" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who entrusted him with letters" }
    ],
    lessonsAndReflection: [
      "Are you faithful with the messages God gives you to deliver?",
      "Can you serve joyfully in a role that brings others credit?"
    ],
    relatedCharacters: ["paul", "phoebe"],
    situations: [
      {
        id: "tychicus-carries-letters",
        title: "Carrying the Prison Letters",
        category: "Obedience",
        reference: "Ephesians 6:21-22",
        situation: "Paul entrusted Tychicus with carrying his letters to Ephesus and Colossae while also delivering personal encouragement.",
        pressure: "The responsibility of carrying documents that would shape Christianity, across dangerous roads.",
        innerBattle: "The weight of being trusted with words that will be read for centuries.",
        response: "He faithfully delivered every letter and personally encouraged each church.",
        outcome: "The churches received Paul's inspired letters and were strengthened by Tychicus's personal ministry.",
        lesson: "Faithful delivery of God's message is a ministry that outlasts the messenger.",
        traitRevealed: "Unwavering reliability",
        spiritualPrinciple: "The church advances on the backs of faithful, unglamorous servants.",
        reflectionQuestions: [
          "Would Paul trust you with his most important letter?",
          "How do you encourage others beyond just delivering information?"
        ],
        dnaSnapshot: { faith: 4, humility: 5, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 22. TROPHIMUS
  // ============================================
  {
    id: "trophimus",
    name: "Trophimus",
    meaning: "Nourishing",
    emoji: "⚠️",
    role: "Gentile companion whose presence triggered Paul's arrest in Jerusalem",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 20:4", "Acts 21:27-29", "2 Timothy 4:20"],
    archetypes: ["Missionary", "Servant"],
    dna: { faith: 4, humility: 4, courage: 4, wisdom: 3, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Missionary",
      strength: "Faithful companion willing to follow Paul anywhere",
      weakness: "His presence unknowingly became the catalyst for Paul's arrest",
      mindset: "I will follow Paul even into hostile territory",
      keyLesson: "Faithfulness can have unintended consequences, but God works through them all.",
      keyVerse: "For they had seen before with him in the city Trophimus an Ephesian, whom they supposed that Paul had brought into the temple.",
      keyVerseRef: "Acts 21:29"
    },
    storyArc: "An Ephesian Gentile who traveled with Paul to Jerusalem, where false assumptions about his presence in the temple sparked a riot that led to Paul's arrest—an arrest that ultimately brought the gospel to Rome through Paul's appeal to Caesar.",
    therapyView: {
      drivingFears: ["Being responsible for Paul's suffering", "Guilt over unintended consequences"],
      coreMotivations: ["Supporting Paul's mission", "Representing Gentile believers"],
      relationalStyle: "Loyal companion, possibly burdened by guilt",
      blindSpots: ["Could not have foreseen the consequences of his presence"],
      healingMoments: ["Knowing that Paul's arrest led to the gospel reaching Rome"]
    },
    strengths: ["Loyalty", "Courage to enter hostile territory", "Faithfulness"],
    weaknesses: ["Unknowingly triggered a crisis", "Left sick in Miletus later"],
    journey: [
      { phase: "Calling", description: "Joined Paul's team as a representative of the Ephesian church" },
      { phase: "Testing", description: "His presence in Jerusalem was falsely used to accuse Paul" },
      { phase: "Legacy", description: "Paul's arrest led to the gospel reaching Rome and his prison epistles" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle he accompanied" }
    ],
    lessonsAndReflection: [
      "Have your faithful actions ever had unintended consequences?",
      "How does God use even misunderstandings for His purposes?"
    ],
    relatedCharacters: ["paul", "aristarchus"],
    situations: [
      {
        id: "trophimus-triggers-arrest",
        title: "The Unintended Catalyst",
        category: "Conflict",
        reference: "Acts 21:27-29",
        situation: "Jews from Asia saw Trophimus with Paul in Jerusalem and falsely assumed Paul had brought this Gentile into the temple.",
        pressure: "A false accusation sparked a riot that nearly killed Paul and led to his arrest.",
        innerBattle: "My presence has caused the very thing we feared. Is this my fault?",
        response: "The situation was beyond his control—false witnesses used his presence as ammunition.",
        outcome: "Paul was arrested, but this led to his testimony before governors, kings, and eventually Caesar in Rome.",
        lesson: "God works through even false accusations and unintended crises to advance His purposes.",
        traitRevealed: "The sovereignty of God over human misunderstandings",
        spiritualPrinciple: "What appears to be a catastrophe may be God's detour to a greater destination.",
        reflectionQuestions: [
          "Have you ever been blamed for something you did not intend?",
          "Can you trust God when your faithful actions lead to unexpected trouble?"
        ],
        dnaSnapshot: { faith: 4, courage: 4 }
      }
    ]
  },
  // ============================================
  // 23. EUTYCHUS
  // ============================================
  {
    id: "eutychus",
    name: "Eutychus",
    meaning: "Fortunate",
    emoji: "🪟",
    role: "Young man who fell from a window during Paul's sermon",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 20:7-12"],
    archetypes: ["Survivor"],
    dna: { faith: 3, humility: 3, courage: 2, wisdom: 2, compassion: 2, fear: 3, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Survivor",
      strength: "His story reveals the power of God over death",
      weakness: "Could not stay awake during Paul's long sermon",
      mindset: "I did not expect to become a miracle story",
      keyLesson: "God's power over death is present even in ordinary church gatherings.",
      keyVerse: "And there sat in a window a certain young man named Eutychus, being fallen into a deep sleep.",
      keyVerseRef: "Acts 20:9"
    },
    storyArc: "A young man sitting in a third-story window during Paul's extended sermon in Troas who fell asleep, plunged to his death, and was raised to life by Paul—a dramatic demonstration of resurrection power in the midst of an ordinary church meeting.",
    therapyView: {
      drivingFears: ["Unknown—he was simply a young man at church"],
      coreMotivations: ["Being part of the community", "Hearing Paul preach"],
      relationalStyle: "A regular church member caught in extraordinary circumstances",
      blindSpots: ["Sitting in a dangerous window seat when drowsy"],
      healingMoments: ["Being raised from the dead by Paul"]
    },
    strengths: ["His story glorifies God's power", "He was present at the gathering"],
    weaknesses: ["Fell asleep during preaching", "Poor seating choice"],
    journey: [
      { phase: "Testing", description: "Fell from the third-story window and died" },
      { phase: "Refinement", description: "Raised to life by Paul through God's power" },
      { phase: "Legacy", description: "His story reminds us that God's power is present even in ordinary church life" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who raised him" }
    ],
    lessonsAndReflection: [
      "Are you fully present when you gather with God's people?",
      "How does God show His power in unexpected moments?"
    ],
    relatedCharacters: ["paul", "lazarus"],
    situations: [
      {
        id: "eutychus-falls",
        title: "Falling from the Window",
        category: "Restoration",
        reference: "Acts 20:7-12",
        situation: "During Paul's sermon that stretched past midnight, Eutychus fell asleep on a third-story windowsill and fell to his death.",
        pressure: "An ordinary church gathering turned into a crisis when a young man died.",
        innerBattle: "For the church—is our gathering cursed? Has our meeting killed someone?",
        response: "Paul went down, embraced him, and declared his life was still in him. The young man was restored.",
        outcome: "Eutychus was raised, the church was comforted, and Paul continued teaching until dawn.",
        lesson: "God's power is not limited to dramatic settings—it shows up in the middle of church life.",
        traitRevealed: "God's sovereignty over life and death",
        spiritualPrinciple: "The same God who raises the dead is present in every gathering of His people.",
        reflectionQuestions: [
          "Do you expect God to act powerfully in ordinary church settings?",
          "What might you be missing by not being fully engaged in worship?"
        ],
        dnaSnapshot: { faith: 3 }
      }
    ]
  },
  // ============================================
  // 24. JASON
  // ============================================
  {
    id: "jason",
    name: "Jason",
    meaning: "Healer",
    emoji: "🛡️",
    role: "Believer in Thessalonica who sheltered Paul",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 17:5-9", "Romans 16:21"],
    archetypes: ["Servant", "Survivor"],
    dna: { faith: 4, humility: 4, courage: 5, wisdom: 3, compassion: 4, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Willingness to risk his safety for the gospel",
      weakness: "Bore the consequences of others' ministry",
      mindset: "I will protect God's messengers whatever the cost",
      keyLesson: "Sheltering the persecuted is a ministry that costs everything.",
      keyVerse: "And when they found them not, they drew Jason and certain brethren unto the rulers of the city.",
      keyVerseRef: "Acts 17:6"
    },
    storyArc: "A Thessalonian believer who hosted Paul and Silas, and when a mob came for the apostles, Jason was dragged before the city rulers, posted bond, and bore the legal consequences of his hospitality—becoming an example of costly protection of God's servants.",
    therapyView: {
      drivingFears: ["Legal consequences", "Mob violence", "Failing to protect Paul"],
      coreMotivations: ["Protecting God's messengers", "Standing for the gospel"],
      relationalStyle: "Protective, willing to take the hit for others",
      blindSpots: ["Could not anticipate the full cost of hosting Paul"],
      healingMoments: ["Later recognized by Paul in Romans as a kinsman"]
    },
    strengths: ["Courage", "Hospitality under pressure", "Willingness to suffer for others"],
    weaknesses: ["Bore disproportionate consequences", "Legal vulnerability"],
    journey: [
      { phase: "Calling", description: "Welcomed Paul and Silas into his home in Thessalonica" },
      { phase: "Testing", description: "Dragged before rulers when the mob could not find Paul" },
      { phase: "Legacy", description: "Paid the cost of hospitality and was later named by Paul as a kinsman" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle he sheltered" },
      { name: "Silas", role: "Paul's companion he hosted" }
    ],
    lessonsAndReflection: [
      "Are you willing to shelter the persecuted at personal cost?",
      "What does it mean to bear the consequences of someone else's ministry?"
    ],
    relatedCharacters: ["paul", "silvanus"],
    situations: [
      {
        id: "jason-shelters-paul",
        title: "Dragged Before the Rulers",
        category: "Persecution",
        reference: "Acts 17:5-9",
        situation: "A mob searching for Paul and Silas attacked Jason's house. Unable to find the apostles, they dragged Jason before the city officials.",
        pressure: "Accused of harboring men who turned the world upside down and acted against Caesar's decrees.",
        innerBattle: "I only offered hospitality—now I face charges meant for Paul.",
        response: "Jason posted security and bore the legal consequences, allowing Paul and Silas to escape to Berea.",
        outcome: "The gospel continued to spread, and Jason became a model of costly hospitality.",
        lesson: "Sometimes faithfulness means bearing consequences meant for others.",
        traitRevealed: "Sacrificial protection",
        spiritualPrinciple: "Those who shelter God's persecuted people share in their reward.",
        reflectionQuestions: [
          "Would you open your home knowing it could cost you everything?",
          "How do you respond when faithfulness leads to unfair consequences?"
        ],
        dnaSnapshot: { courage: 5, faith: 4, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 25. AQUILA
  // ============================================
  {
    id: "aquila",
    name: "Aquila",
    meaning: "Eagle",
    emoji: "🦅",
    role: "Tentmaker, co-worker with Paul, husband of Priscilla",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 18:1-4", "Acts 18:24-26", "Romans 16:3-5", "1 Corinthians 16:19"],
    archetypes: ["Missionary", "Builder", "Servant"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 4, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Builder",
      strength: "Combining tentmaking with theological ministry",
      weakness: "Displaced by political upheaval",
      mindset: "Work with our hands, teach with our lives",
      keyLesson: "Ministry and marketplace are not separate—they are one calling.",
      keyVerse: "Greet Priscilla and Aquila my helpers in Christ Jesus: who have for my life laid down their own necks.",
      keyVerseRef: "Romans 16:3-4"
    },
    storyArc: "A Jewish tentmaker expelled from Rome who partnered with Paul in Corinth, co-discipled Apollos with Priscilla, risked his neck for Paul, and hosted churches in multiple cities—modeling how ordinary work and extraordinary ministry can be one seamless life.",
    therapyView: {
      drivingFears: ["Displacement", "Persecution of the church"],
      coreMotivations: ["Advancing the gospel through work and hospitality", "Partnership with Priscilla"],
      relationalStyle: "Team-oriented, integrated work and ministry",
      blindSpots: ["Could overextend between tentmaking and ministry"],
      healingMoments: ["Paul's commendation for risking their lives for him"]
    },
    strengths: ["Bi-vocational ministry", "Theological depth", "Hospitality", "Partnership with Priscilla", "Courage"],
    weaknesses: ["Displaced by political forces", "Constantly relocating"],
    journey: [
      { phase: "Calling", description: "Expelled from Rome, met Paul in Corinth as a fellow tentmaker" },
      { phase: "Testing", description: "Risked his life for Paul; helped correct Apollos's theology" },
      { phase: "Legacy", description: "Hosted churches in Corinth, Ephesus, and Rome" }
    ],
    relationships: [
      { name: "Priscilla", role: "Wife and co-minister" },
      { name: "Paul", role: "Apostle and fellow tentmaker" },
      { name: "Apollos", role: "Gifted teacher they discipled" }
    ],
    lessonsAndReflection: [
      "How can your workplace become a platform for ministry?",
      "Are you willing to risk your life for a fellow believer?"
    ],
    relatedCharacters: ["paul", "priscilla-aquila", "apollos"],
    situations: [
      {
        id: "aquila-risks-neck",
        title: "Laying Down Their Necks for Paul",
        category: "Sacrifice",
        reference: "Romans 16:3-4",
        situation: "At some point Aquila and Priscilla risked their lives—literally their necks—to save Paul.",
        pressure: "Facing death to protect the apostle in an unknown crisis.",
        innerBattle: "Is Paul's life and mission worth risking our own?",
        response: "They laid down their own necks, and Paul publicly thanked them along with all the Gentile churches.",
        outcome: "Paul was saved, and their sacrifice was honored across every Gentile church.",
        lesson: "The greatest love is demonstrated when you risk everything for another.",
        traitRevealed: "Sacrificial courage",
        spiritualPrinciple: "Greater love has no one than this—to lay down one's life for a friend.",
        reflectionQuestions: [
          "Would you risk your life for a fellow believer?",
          "How does sacrificial love practically show up in your life?"
        ],
        dnaSnapshot: { courage: 4, faith: 5, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 26. THE WIDOW WITH TWO MITES
  // ============================================
  {
    id: "widow-two-mites",
    name: "The Widow with Two Mites",
    meaning: "Unnamed—defined by her sacrificial giving",
    emoji: "🪙",
    role: "Poor widow who gave everything she had to the temple treasury",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Mark 12:41-44", "Luke 21:1-4"],
    archetypes: ["Servant", "Martyr"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 4, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Gave everything she had without seeking recognition",
      weakness: "Had nothing left for herself",
      mindset: "God is worth everything I have, even my last coin",
      keyLesson: "God measures giving not by amount but by sacrifice.",
      keyVerse: "For all they did cast in of their abundance; but she of her want did cast in all that she had, even all her living.",
      keyVerseRef: "Mark 12:44"
    },
    storyArc: "An anonymous poor widow who placed two small copper coins into the temple treasury while wealthy donors gave large amounts. Jesus singled her out as having given more than all the others because she gave everything she had to live on.",
    therapyView: {
      drivingFears: ["Destitution", "Being invisible to God and people"],
      coreMotivations: ["Worship through sacrifice", "Trust in God's provision"],
      relationalStyle: "Quiet, unassuming, deeply devoted",
      blindSpots: ["None revealed—she is presented as wholly faithful"],
      healingMoments: ["Jesus publicly honoring her gift above all others"]
    },
    strengths: ["Total sacrifice", "Humility", "Faith in God's provision", "Worship through giving"],
    weaknesses: ["Poverty", "Vulnerability"],
    journey: [
      { phase: "Calling", description: "Felt compelled to give to God despite having almost nothing" },
      { phase: "Legacy", description: "Jesus held her up as the greatest giver in the temple" }
    ],
    relationships: [
      { name: "Jesus", role: "The one who noticed and honored her gift" }
    ],
    lessonsAndReflection: [
      "Do you give from abundance or from sacrifice?",
      "What would it look like to trust God with everything you have?"
    ],
    relatedCharacters: ["jesus"],
    situations: [
      {
        id: "widow-gives-everything",
        title: "Giving Everything She Had",
        category: "Sacrifice",
        reference: "Mark 12:41-44",
        situation: "A poor widow dropped two small copper coins into the temple treasury while wealthy people gave large sums.",
        pressure: "She had nothing else to live on—this was her entire livelihood.",
        innerBattle: "Can I trust God with my last two coins?",
        response: "She gave everything she had, holding nothing back.",
        outcome: "Jesus declared she had given more than all the wealthy donors combined.",
        lesson: "God values the heart behind the gift, not the size of it.",
        traitRevealed: "Total sacrificial devotion",
        spiritualPrinciple: "Sacrifice is measured by what you keep, not by what you give.",
        reflectionQuestions: [
          "What are you holding back from God?",
          "Is your giving sacrificial or merely convenient?"
        ],
        dnaSnapshot: { faith: 5, humility: 5, courage: 4 }
      }
    ]
  },
  // ============================================
  // 27. THE TEN VIRGINS (FOOLISH)
  // ============================================
  {
    id: "ten-virgins-foolish",
    name: "The Foolish Virgins",
    meaning: "Parabolic figures representing spiritual unpreparedness",
    emoji: "🕯️",
    role: "Five bridesmaids who failed to prepare for the bridegroom's arrival",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 25:1-13"],
    archetypes: ["Tragic Hero"],
    dna: { faith: 2, humility: 2, courage: 2, wisdom: 1, compassion: 2, fear: 3, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "They were part of the wedding party—they had proximity to the truth",
      weakness: "Assumed proximity equaled readiness",
      mindset: "There is always more time to prepare",
      keyLesson: "Spiritual readiness cannot be borrowed at the last minute.",
      keyVerse: "Watch therefore, for ye know neither the day nor the hour wherein the Son of man cometh.",
      keyVerseRef: "Matthew 25:13"
    },
    storyArc: "Five of ten bridesmaids who went to meet the bridegroom but failed to bring extra oil for their lamps. When the bridegroom was delayed and finally arrived at midnight, their lamps went out and they were shut out of the wedding feast forever.",
    therapyView: {
      drivingFears: ["Missing the celebration", "Being shut out"],
      coreMotivations: ["Being part of the wedding—but without the cost of preparation"],
      relationalStyle: "Present but unprepared, relying on others' readiness",
      blindSpots: ["Assuming they had enough time", "Thinking they could borrow someone else's spiritual readiness"],
      healingMoments: ["None—the door was shut"]
    },
    strengths: ["They showed up", "They were waiting for the bridegroom"],
    weaknesses: ["Failure to prepare", "Procrastination", "Relying on others' supply"],
    journey: [
      { phase: "Calling", description: "Invited to the wedding feast as bridesmaids" },
      { phase: "Failure", description: "Brought lamps but no extra oil—assuming the bridegroom would come quickly" },
      { phase: "Legacy", description: "Shut out of the feast with the devastating words: I know you not" }
    ],
    relationships: [
      { name: "The Wise Virgins", role: "Counterpart who came prepared" },
      { name: "The Bridegroom", role: "Christ-figure who arrived at an unexpected hour" }
    ],
    lessonsAndReflection: [
      "Are you spiritually prepared for Christ's return, or merely present?",
      "What does it mean to have oil in your lamp?"
    ],
    relatedCharacters: ["jesus"],
    situations: [
      {
        id: "foolish-virgins-shut-out",
        title: "Shut Out of the Wedding Feast",
        category: "Faith Testing",
        reference: "Matthew 25:1-13",
        situation: "The bridegroom was delayed. At midnight he arrived, but the foolish virgins' lamps had gone out.",
        pressure: "They desperately tried to buy oil at midnight, but it was too late.",
        innerBattle: "We thought there was more time. We thought we were ready enough.",
        response: "They scrambled to find oil but returned to find the door permanently shut.",
        outcome: "The bridegroom said: I know you not. They were excluded from the feast.",
        lesson: "Spiritual readiness is personal and cannot be last-minute or borrowed.",
        traitRevealed: "Fatal presumption",
        spiritualPrinciple: "You cannot borrow someone else's relationship with God when the moment of truth arrives.",
        reflectionQuestions: [
          "Are you assuming you have more time to get spiritually serious?",
          "What does spiritual oil represent in your life, and do you have enough?"
        ],
        dnaSnapshot: { faith: 2, wisdom: 1, pride: 3 }
      }
    ]
  },
  // ============================================
  // 28. THE UNMERCIFUL SERVANT
  // ============================================
  {
    id: "unmerciful-servant",
    name: "The Unmerciful Servant",
    meaning: "Parabolic figure representing refusal to forgive",
    emoji: "💰",
    role: "Servant forgiven a massive debt who refused to forgive a small one",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 18:21-35"],
    archetypes: ["Oppressor", "Tragic Hero"],
    dna: { faith: 1, humility: 1, courage: 2, wisdom: 1, compassion: 1, fear: 3, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "None—he is entirely a negative example",
      weakness: "Received mercy but refused to give it",
      mindset: "What I owe is forgiven; what you owe me is not",
      keyLesson: "Those who receive God's forgiveness must extend it to others.",
      keyVerse: "Shouldest not thou also have had compassion on thy fellowservant, even as I had pity on thee?",
      keyVerseRef: "Matthew 18:33"
    },
    storyArc: "A servant who owed his king an unpayable debt of ten thousand talents and was graciously forgiven. He then found a fellow servant who owed him a tiny amount, seized him by the throat, and threw him in prison—prompting the king to revoke his forgiveness and deliver him to the tormentors.",
    therapyView: {
      drivingFears: ["Financial loss", "Being taken advantage of"],
      coreMotivations: ["Getting what is owed to him", "Control over others"],
      relationalStyle: "Ruthlessly transactional",
      blindSpots: ["Complete inability to see the hypocrisy of his actions"],
      healingMoments: ["None—he refused to extend the mercy he received"]
    },
    strengths: ["None presented positively"],
    weaknesses: ["Greed", "Hypocrisy", "Cruelty", "Spiritual blindness"],
    journey: [
      { phase: "Calling", description: "Received unimaginable mercy from the king" },
      { phase: "Failure", description: "Immediately seized his fellow servant over a tiny debt" },
      { phase: "Legacy", description: "His forgiveness was revoked and he was delivered to the tormentors" }
    ],
    relationships: [
      { name: "The King", role: "God-figure who forgave and then judged" },
      { name: "The Fellow Servant", role: "The one he refused to forgive" }
    ],
    lessonsAndReflection: [
      "Is there anyone you refuse to forgive despite God forgiving you far more?",
      "How does receiving mercy obligate you to give it?"
    ],
    relatedCharacters: ["jesus"],
    situations: [
      {
        id: "unmerciful-servant-refuses",
        title: "Refusing to Forgive a Small Debt",
        category: "Conflict",
        reference: "Matthew 18:28-35",
        situation: "After being forgiven a debt of ten thousand talents, the servant found a fellow servant who owed him a hundred pence and demanded payment.",
        pressure: "The pride and greed of wanting what was owed despite having been forgiven everything.",
        innerBattle: "He never actually internalized the mercy he received.",
        response: "He seized his fellow servant by the throat and threw him into prison.",
        outcome: "The king revoked his forgiveness and delivered him to the tormentors until he paid everything.",
        lesson: "Unforgiveness after receiving forgiveness is the ultimate spiritual contradiction.",
        traitRevealed: "Merciless hypocrisy",
        spiritualPrinciple: "God's forgiveness of you is the measure by which you must forgive others.",
        reflectionQuestions: [
          "Have you received God's forgiveness but refused to extend it to someone else?",
          "What debt are you holding over someone that pales compared to what God forgave you?"
        ],
        dnaSnapshot: { pride: 5, greed: 5, compassion: 1, faith: 1 }
      }
    ]
  },
  // ============================================
  // 29. THE PERSISTENT WIDOW
  // ============================================
  {
    id: "persistent-widow",
    name: "The Persistent Widow",
    meaning: "Parabolic figure representing relentless prayer",
    emoji: "⚖️",
    role: "Widow who kept demanding justice from an unjust judge",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 18:1-8"],
    archetypes: ["Survivor", "Seeker"],
    dna: { faith: 5, humility: 3, courage: 5, wisdom: 4, compassion: 2, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Survivor",
      strength: "Refused to give up until justice was served",
      weakness: "Had no power except persistence",
      mindset: "I will not stop asking until I receive justice",
      keyLesson: "If even an unjust judge yields to persistence, how much more will a loving God answer persistent prayer?",
      keyVerse: "And shall not God avenge his own elect, which cry day and night unto him?",
      keyVerseRef: "Luke 18:7"
    },
    storyArc: "A powerless widow who repeatedly demanded justice from a judge who feared neither God nor man. Her relentless persistence finally wore him down, and Jesus used her story to teach that God's people should always pray and never give up.",
    therapyView: {
      drivingFears: ["Injustice going uncorrected", "Being ignored and powerless"],
      coreMotivations: ["Justice", "Vindication", "Refusing to accept defeat"],
      relationalStyle: "Relentlessly persistent, unwilling to take no for an answer",
      blindSpots: ["Could be perceived as nagging rather than faithful"],
      healingMoments: ["The judge finally granting her request"]
    },
    strengths: ["Persistence", "Courage", "Refusal to accept injustice"],
    weaknesses: ["Powerless except through persistence", "Dependent on an unjust system"],
    journey: [
      { phase: "Calling", description: "Faced injustice with no advocate" },
      { phase: "Testing", description: "Kept coming to the judge despite repeated refusal" },
      { phase: "Legacy", description: "Her persistence became Jesus's model for unceasing prayer" }
    ],
    relationships: [
      { name: "The Unjust Judge", role: "The one she wore down with persistence" }
    ],
    lessonsAndReflection: [
      "Have you given up praying for something because it has taken too long?",
      "What does relentless faith look like in your prayer life?"
    ],
    relatedCharacters: ["jesus"],
    situations: [
      {
        id: "persistent-widow-asks",
        title: "Wearing Down the Unjust Judge",
        category: "Waiting",
        reference: "Luke 18:1-8",
        situation: "A widow with no power or influence kept coming to an unjust judge demanding: Avenge me of my adversary.",
        pressure: "Repeated rejection with no one to advocate for her.",
        innerBattle: "He keeps refusing. Should I give up, or keep asking?",
        response: "She refused to stop. She came again and again until the judge relented.",
        outcome: "The judge granted her request to avoid being worn out, and Jesus applied the lesson to prayer.",
        lesson: "Persistence in prayer is not nagging God—it is demonstrating faith.",
        traitRevealed: "Relentless faith",
        spiritualPrinciple: "If an unjust judge yields to persistence, how much more will a loving Father respond to His children who cry out day and night?",
        reflectionQuestions: [
          "What prayer have you given up on that you should resume?",
          "Do you believe God is more willing to answer than an unjust judge?"
        ],
        dnaSnapshot: { faith: 5, courage: 5, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 30. SAPPHIRA
  // ============================================
  {
    id: "sapphira",
    name: "Sapphira",
    meaning: "Beautiful, sapphire",
    emoji: "💀",
    role: "Wife of Ananias who lied about the price of their land",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 5:1-11"],
    archetypes: ["Manipulator", "Tragic Hero"],
    dna: { faith: 2, humility: 1, courage: 1, wisdom: 1, compassion: 2, fear: 3, pride: 4, greed: 4 },
    quickCard: {
      archetype: "Manipulator",
      strength: "None presented positively—she is a cautionary example",
      weakness: "Colluded with her husband to deceive the Holy Spirit",
      mindset: "We can appear generous while secretly holding back",
      keyLesson: "You cannot lie to the Holy Spirit and survive.",
      keyVerse: "How is it that ye have agreed together to tempt the Spirit of the Lord?",
      keyVerseRef: "Acts 5:9"
    },
    storyArc: "Sapphira conspired with her husband Ananias to sell property and secretly keep part of the proceeds while claiming they gave the full amount. When confronted by Peter, she maintained the lie and immediately fell dead—a sobering warning to the early church about the holiness of God.",
    therapyView: {
      drivingFears: ["Losing financial security", "Not being seen as generous"],
      coreMotivations: ["Appearing spiritual while maintaining control of money"],
      relationalStyle: "Colluding with spouse in deception",
      blindSpots: ["Thinking God could be fooled", "Valuing reputation over integrity"],
      healingMoments: ["None—she died in her deception"]
    },
    strengths: ["None presented"],
    weaknesses: ["Deception", "Greed", "Collusion", "Testing the Holy Spirit"],
    journey: [
      { phase: "Calling", description: "Part of the early church community where believers shared freely" },
      { phase: "Failure", description: "Conspired with Ananias to lie about their gift" },
      { phase: "Legacy", description: "Struck dead for lying to the Holy Spirit—a permanent warning" }
    ],
    relationships: [
      { name: "Ananias", role: "Husband and co-conspirator" },
      { name: "Peter", role: "Apostle who confronted her" }
    ],
    lessonsAndReflection: [
      "Are you pretending to give God more than you actually are?",
      "What deceptions are you maintaining to protect your image?"
    ],
    relatedCharacters: ["ananias-sapphira", "peter"],
    situations: [
      {
        id: "sapphira-lies",
        title: "Lying About the Price",
        category: "Temptation",
        reference: "Acts 5:7-10",
        situation: "Three hours after Ananias died, Sapphira came in. Peter gave her a chance to tell the truth about the land price.",
        pressure: "She did not know her husband was dead. She had a chance to come clean.",
        innerBattle: "Do I tell the truth or maintain our agreed-upon story?",
        response: "She repeated the lie, confirming the amount her husband had stated.",
        outcome: "Peter declared she had tested the Spirit of the Lord, and she fell dead at his feet.",
        lesson: "God gives opportunities for repentance, but persistence in deception has fatal consequences.",
        traitRevealed: "Deliberate deception of God",
        spiritualPrinciple: "The Holy Spirit cannot be deceived, and testing Him is an act of supreme arrogance.",
        reflectionQuestions: [
          "If confronted with your deception, would you come clean or double down?",
          "Do you treat God as someone who can be managed or fooled?"
        ],
        dnaSnapshot: { greed: 4, pride: 4, faith: 2, courage: 1 }
      }
    ]
  },
  // ============================================
  // 31. SIMON THE SORCERER
  // ============================================
  {
    id: "simon-the-sorcerer",
    name: "Simon the Sorcerer",
    meaning: "Simon: He has heard; known as Simon Magus",
    emoji: "🧙",
    role: "Samaritan sorcerer who tried to buy the Holy Spirit's power",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 8:9-24"],
    archetypes: ["Manipulator", "Seeker"],
    dna: { faith: 2, humility: 1, courage: 3, wisdom: 2, compassion: 1, fear: 3, pride: 5, greed: 4 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Recognized genuine power when he saw it",
      weakness: "Tried to purchase spiritual power with money",
      mindset: "If I can buy this power, I can control it",
      keyLesson: "The gifts of God cannot be purchased—they are given by grace.",
      keyVerse: "Thy money perish with thee, because thou hast thought that the gift of God may be purchased with money.",
      keyVerseRef: "Acts 8:20"
    },
    storyArc: "A sorcerer who had amazed Samaria and been called the great power of God. When Philip came preaching and performing real miracles, Simon believed and was baptized. But when he saw the Holy Spirit given through the apostles' hands, he offered money for the same ability—revealing that his heart was still in the grip of power and self-promotion.",
    therapyView: {
      drivingFears: ["Losing his influence", "Being surpassed by others"],
      coreMotivations: ["Power", "Status", "Control over the supernatural"],
      relationalStyle: "Transactional—sees everything as purchasable",
      blindSpots: ["Thinking God's gifts operate like market commodities"],
      healingMoments: ["Peter's warning may have led to repentance: he asked Peter to pray for him"]
    },
    strengths: ["Recognized genuine power", "Initially responded to the gospel"],
    weaknesses: ["Pride", "Desire for power", "Transactional mindset", "Superficial faith"],
    journey: [
      { phase: "Calling", description: "Heard Philip's preaching and believed" },
      { phase: "Failure", description: "Tried to buy the Holy Spirit's power with money" },
      { phase: "Refinement", description: "Rebuked by Peter—asked for prayer, but his ultimate fate is unknown" }
    ],
    relationships: [
      { name: "Philip", role: "Evangelist who preached in Samaria" },
      { name: "Peter", role: "Apostle who rebuked him sharply" }
    ],
    lessonsAndReflection: [
      "Do you treat spiritual gifts as commodities to be acquired?",
      "Is your interest in God's power about serving others or elevating yourself?"
    ],
    relatedCharacters: ["peter", "paul"],
    situations: [
      {
        id: "simon-offers-money",
        title: "Trying to Buy the Holy Spirit",
        category: "Temptation",
        reference: "Acts 8:18-24",
        situation: "Simon saw the apostles imparting the Holy Spirit through the laying on of hands and offered them money for the same ability.",
        pressure: "His old desire for power and status was triggered by witnessing genuine supernatural authority.",
        innerBattle: "If I can get this power, I can regain my influence over Samaria.",
        response: "He offered money, treating the Holy Spirit as a commodity to be purchased.",
        outcome: "Peter rebuked him devastatingly: Your heart is not right before God. Repent of this wickedness.",
        lesson: "God's gifts are sovereign and free—they cannot be earned, bought, or controlled.",
        traitRevealed: "Spiritual consumerism",
        spiritualPrinciple: "The moment you try to purchase or control the Holy Spirit, you reveal you do not understand Him at all.",
        reflectionQuestions: [
          "Do you approach God with a consumer mindset—what can I get?",
          "Is your heart right before God, or is it poisoned by the desire for power?"
        ],
        dnaSnapshot: { pride: 5, greed: 4, faith: 2 }
      }
    ]
  },
  // ============================================
  // 32. BAR-JESUS / ELYMAS
  // ============================================
  {
    id: "bar-jesus-elymas",
    name: "Bar-Jesus (Elymas)",
    meaning: "Bar-Jesus: Son of Jesus; Elymas: Sorcerer/Wise man",
    emoji: "🌑",
    role: "Jewish sorcerer who opposed Paul on Cyprus",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 13:6-12"],
    archetypes: ["Oppressor", "Manipulator"],
    dna: { faith: 1, humility: 1, courage: 3, wisdom: 2, compassion: 1, fear: 3, pride: 5, greed: 4 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Had the ear of a Roman proconsul",
      weakness: "Directly opposed the gospel and was struck blind",
      mindset: "I will prevent this message from reaching the powerful",
      keyLesson: "Those who actively oppose the gospel face direct divine judgment.",
      keyVerse: "O full of all subtilty and all mischief, thou child of the devil, thou enemy of all righteousness, wilt thou not cease to pervert the right ways of the Lord?",
      keyVerseRef: "Acts 13:10"
    },
    storyArc: "A Jewish false prophet and sorcerer attached to the Roman proconsul Sergius Paulus on Cyprus. When Paul and Barnabas came to share the gospel with the proconsul, Elymas actively tried to prevent his conversion. Paul, filled with the Holy Spirit, pronounced blindness on him—and the proconsul believed.",
    therapyView: {
      drivingFears: ["Losing his influence with the proconsul", "Being exposed as a fraud"],
      coreMotivations: ["Maintaining power and position", "Preventing the gospel from displacing him"],
      relationalStyle: "Parasitic—attached to powerful people for status",
      blindSpots: ["Fighting against God Himself while claiming spiritual authority"],
      healingMoments: ["None recorded—struck blind as judgment"]
    },
    strengths: ["Political influence", "Boldness in opposing Paul"],
    weaknesses: ["False prophet", "Fought against God", "Pride and deception"],
    journey: [
      { phase: "Calling", description: "Positioned himself as spiritual advisor to the proconsul" },
      { phase: "Failure", description: "Actively opposed Paul and was struck blind" }
    ],
    relationships: [
      { name: "Sergius Paulus", role: "Roman proconsul he advised" },
      { name: "Paul", role: "Apostle who judged him" }
    ],
    lessonsAndReflection: [
      "Are you ever an obstacle to someone else encountering the gospel?",
      "What spiritual influence are you using, and is it from God?"
    ],
    relatedCharacters: ["paul", "simon-the-sorcerer"],
    situations: [
      {
        id: "elymas-opposes-paul",
        title: "Struck Blind for Opposing the Gospel",
        category: "Conflict",
        reference: "Acts 13:6-12",
        situation: "Elymas tried to turn the proconsul Sergius Paulus away from the faith when Paul came to preach.",
        pressure: "His entire position depended on keeping the proconsul under his influence.",
        innerBattle: "If the proconsul believes Paul, I lose everything.",
        response: "He actively sought to pervert the right ways of the Lord.",
        outcome: "Paul pronounced temporary blindness on him, and the proconsul believed when he saw what happened.",
        lesson: "Opposing the gospel to protect your position invites divine judgment.",
        traitRevealed: "Active opposition to God's purposes",
        spiritualPrinciple: "Those who try to prevent others from coming to faith stand directly against God.",
        reflectionQuestions: [
          "Have you ever discouraged someone from pursuing God to protect your own interests?",
          "What happens when human ambition collides with divine purpose?"
        ],
        dnaSnapshot: { pride: 5, greed: 4, faith: 1 }
      }
    ]
  },
  // ============================================
  // 33. DAMARIS
  // ============================================
  {
    id: "damaris",
    name: "Damaris",
    meaning: "Calf, gentle",
    emoji: "🏛️",
    role: "Athenian woman who believed after Paul's Mars Hill sermon",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 17:34"],
    archetypes: ["Seeker"],
    dna: { faith: 4, humility: 4, courage: 4, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "Open-minded enough to believe in a culture hostile to the gospel",
      weakness: "Almost nothing is known about her beyond this moment",
      mindset: "The unknown God Paul speaks of is the true God",
      keyLesson: "God has seekers in the most unlikely intellectual circles.",
      keyVerse: "Howbeit certain men clave unto him, and believed: among the which was Dionysius the Areopagite, and a woman named Damaris.",
      keyVerseRef: "Acts 17:34"
    },
    storyArc: "A woman in Athens who heard Paul's sermon on Mars Hill about the unknown God and believed—one of only a handful who responded positively in the intellectual capital of the ancient world, where most mocked the resurrection.",
    therapyView: {
      drivingFears: ["Intellectual rejection", "Social ostracism"],
      coreMotivations: ["Truth", "Finding the unknown God"],
      relationalStyle: "Intellectually curious, open to new truth",
      blindSpots: ["Unknown"],
      healingMoments: ["Believing the gospel in the most skeptical city in the world"]
    },
    strengths: ["Intellectual honesty", "Courage to believe against the cultural tide", "Openness"],
    weaknesses: ["Obscurity—we know almost nothing else"],
    journey: [
      { phase: "Calling", description: "Heard Paul preach on Mars Hill in Athens" },
      { phase: "Legacy", description: "Named as one of the few Athenians who believed" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle whose sermon she believed" },
      { name: "Dionysius", role: "Fellow Athenian convert" }
    ],
    lessonsAndReflection: [
      "Are you willing to believe truth even when your culture mocks it?",
      "How does God reach seekers in intellectual environments?"
    ],
    relatedCharacters: ["paul", "dionysius"],
    situations: [
      {
        id: "damaris-believes-athens",
        title: "Believing in Skeptical Athens",
        category: "Faith Testing",
        reference: "Acts 17:34",
        situation: "After Paul's Mars Hill sermon, most Athenians mocked the idea of resurrection. Damaris was one of the few who believed.",
        pressure: "Athens was the intellectual capital of the world, where new ideas were entertainment, not commitment.",
        innerBattle: "Will I follow the crowd that mocks, or the truth that convicts?",
        response: "She clung to Paul and believed, becoming one of the founding members of the Athenian church.",
        outcome: "Her name is preserved in Scripture as proof that the gospel can penetrate even the most skeptical cultures.",
        lesson: "It only takes a few sincere seekers to plant a church in hostile soil.",
        traitRevealed: "Intellectual courage",
        spiritualPrinciple: "The gospel does not need majority approval—it needs genuine seekers.",
        reflectionQuestions: [
          "Have you ever believed something true despite everyone around you dismissing it?",
          "Are you a seeker of truth or a consumer of trends?"
        ],
        dnaSnapshot: { faith: 4, courage: 4, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 34. DIONYSIUS
  // ============================================
  {
    id: "dionysius",
    name: "Dionysius the Areopagite",
    meaning: "Devoted to Dionysus (pagan origin, redeemed by faith)",
    emoji: "🎓",
    role: "Member of the Athenian court who believed Paul's Mars Hill sermon",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 17:34"],
    archetypes: ["Seeker", "Judge"],
    dna: { faith: 4, humility: 4, courage: 4, wisdom: 5, compassion: 3, fear: 1, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "A man of high intellectual and political standing who humbled himself before the gospel",
      weakness: "Almost nothing is known beyond his conversion",
      mindset: "Truth is truth, even if it comes from a foreign tentmaker",
      keyLesson: "The gospel can convince even the most educated and powerful when hearts are open.",
      keyVerse: "Howbeit certain men clave unto him, and believed: among the which was Dionysius the Areopagite.",
      keyVerseRef: "Acts 17:34"
    },
    storyArc: "A member of the Areopagus—the supreme court of Athens—who heard Paul's sermon about the unknown God and the resurrection, and believed. His conversion was remarkable because he was among the intellectual and judicial elite of the ancient world's most prestigious city.",
    therapyView: {
      drivingFears: ["Loss of reputation among peers", "Being wrong"],
      coreMotivations: ["Truth above tradition", "Following evidence wherever it leads"],
      relationalStyle: "Deliberate, judicial, weighing evidence carefully",
      blindSpots: ["Potential intellectual pride that God overcame"],
      healingMoments: ["The moment truth overcame cultural prestige"]
    },
    strengths: ["Intellectual integrity", "Willingness to believe against peer pressure", "Judicial discernment"],
    weaknesses: ["We know nothing of his ongoing ministry"],
    journey: [
      { phase: "Calling", description: "Heard Paul's argument on Mars Hill as a judge of the Areopagus" },
      { phase: "Legacy", description: "Believed and became one of the first Athenian Christians" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle whose argument convinced him" },
      { name: "Damaris", role: "Fellow Athenian convert" }
    ],
    lessonsAndReflection: [
      "Is your intellect a barrier to faith or a bridge to it?",
      "Can you humble yourself to accept truth from an unlikely source?"
    ],
    relatedCharacters: ["paul", "damaris"],
    situations: [
      {
        id: "dionysius-believes",
        title: "A Judge Convinced by the Gospel",
        category: "Calling",
        reference: "Acts 17:34",
        situation: "As a member of the Areopagus, Dionysius evaluated Paul's claims about Jesus and the resurrection.",
        pressure: "His colleagues mocked Paul. Believing meant breaking ranks with Athens's intellectual elite.",
        innerBattle: "Does the evidence support this Jewish teacher's claims about a risen man?",
        response: "He clung to Paul and believed, joining the tiny Athenian church.",
        outcome: "Tradition holds he became the first bishop of Athens—the gospel took root in philosophy's capital.",
        lesson: "When intellectual honesty meets divine truth, conversion follows.",
        traitRevealed: "Judicial integrity applied to spiritual truth",
        spiritualPrinciple: "God does not bypass the mind—He convinces it.",
        reflectionQuestions: [
          "Have you thoroughly examined the evidence for the gospel?",
          "Would you follow the evidence if it cost your reputation?"
        ],
        dnaSnapshot: { wisdom: 5, faith: 4, courage: 4 }
      }
    ]
  },
  // ============================================
  // 35. THEOPHILUS
  // ============================================
  {
    id: "theophilus",
    name: "Theophilus",
    meaning: "Friend of God, lover of God",
    emoji: "📖",
    role: "Luke's patron and recipient of Luke-Acts",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Luke 1:1-4", "Acts 1:1"],
    archetypes: ["Seeker", "Builder"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "Desired a certain and orderly account of the faith",
      weakness: "Needed convincing through evidence",
      mindset: "I want to know the certainty of what I have been taught",
      keyLesson: "God provides evidence for those who genuinely seek certainty.",
      keyVerse: "That thou mightest know the certainty of those things, wherein thou hast been instructed.",
      keyVerseRef: "Luke 1:4"
    },
    storyArc: "A high-ranking official (most excellent Theophilus) to whom Luke dedicated both his Gospel and the Acts of the Apostles, providing an orderly, historically researched account so that Theophilus could have certainty about the Christian faith he had been taught.",
    therapyView: {
      drivingFears: ["Being deceived", "Following a false religion"],
      coreMotivations: ["Certainty", "Historical reliability of the faith"],
      relationalStyle: "Patron and student, seeking reliable truth",
      blindSpots: ["Possibly over-reliant on intellectual certainty"],
      healingMoments: ["Receiving Luke's Gospel and Acts—two of the most thoroughly researched books in the Bible"]
    },
    strengths: ["Desire for certainty", "Willingness to investigate", "Patronage of scholarship"],
    weaknesses: ["Needed external evidence to strengthen faith"],
    journey: [
      { phase: "Calling", description: "Instructed in the Christian faith" },
      { phase: "Testing", description: "Needed certainty about what he had been taught" },
      { phase: "Legacy", description: "His need prompted Luke to write two of the Bible's most important books" }
    ],
    relationships: [
      { name: "Luke", role: "Author who wrote to him" }
    ],
    lessonsAndReflection: [
      "Do you seek certainty about your faith through careful investigation?",
      "How does historical evidence strengthen rather than replace faith?"
    ],
    relatedCharacters: ["paul"],
    situations: [
      {
        id: "theophilus-seeks-certainty",
        title: "Seeking Certainty About the Faith",
        category: "Faith Testing",
        reference: "Luke 1:1-4",
        situation: "Theophilus had been instructed in the faith but needed an orderly, well-researched account to establish certainty.",
        pressure: "In a world of competing religious claims, how could he know Christianity was true?",
        innerBattle: "Can I trust what I have been taught, or do I need evidence?",
        response: "He sought (or received) Luke's meticulously researched account of Jesus's life and the early church.",
        outcome: "Luke-Acts became two of the most important historical documents in Christianity.",
        lesson: "Seeking certainty about faith is not a sign of weakness—it is a sign of wisdom.",
        traitRevealed: "Intellectual honesty",
        spiritualPrinciple: "God honors the desire for certainty by providing evidence—the entire Bible is His answer.",
        reflectionQuestions: [
          "Have you investigated the historical foundations of your faith?",
          "Do you value certainty enough to invest in learning?"
        ],
        dnaSnapshot: { wisdom: 4, faith: 4 }
      }
    ]
  },
  // ============================================
  // 36. CLAUDIUS LYSIAS
  // ============================================
  {
    id: "claudius-lysias",
    name: "Claudius Lysias",
    meaning: "Claudius: Lame (Roman name); Lysias: Releaser",
    emoji: "🗡️",
    role: "Roman tribune who rescued Paul from a Jerusalem mob",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 21:31-40", "Acts 22:24-29", "Acts 23:10-35"],
    archetypes: ["Judge", "Warrior"],
    dna: { faith: 1, humility: 3, courage: 4, wisdom: 4, compassion: 2, fear: 2, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Judge",
      strength: "Decisive action to maintain order and protect a Roman citizen",
      weakness: "Motivated by duty and self-preservation rather than truth",
      mindset: "Maintain order and protect Roman citizens—that is my duty",
      keyLesson: "God uses secular authorities to protect His servants, even when they do not know Him.",
      keyVerse: "Then the chief captain came near, and took him, and commanded him to be bound with two chains.",
      keyVerseRef: "Acts 21:33"
    },
    storyArc: "The Roman military tribune in Jerusalem who rescued Paul from a mob trying to kill him, discovered he was a Roman citizen, transferred him safely to Caesarea under heavy guard, and wrote to Governor Felix explaining the situation—unknowingly fulfilling God's plan to bring Paul before governors and kings.",
    therapyView: {
      drivingFears: ["A riot spiraling out of control", "Being held accountable for a citizen's death"],
      coreMotivations: ["Maintaining order", "Protecting Roman law", "Career advancement"],
      relationalStyle: "Professional, duty-bound, pragmatic",
      blindSpots: ["Cared about the law more than the truth Paul proclaimed"],
      healingMoments: ["Unknowingly became God's instrument for Paul's protection"]
    },
    strengths: ["Decisive action", "Respect for law", "Protective instinct"],
    weaknesses: ["Self-serving letter to Felix", "No recorded interest in the gospel"],
    journey: [
      { phase: "Calling", description: "Stationed in Jerusalem as military commander" },
      { phase: "Testing", description: "Had to manage a mob, a Roman citizen, and a complex religious dispute" },
      { phase: "Legacy", description: "His actions preserved Paul's life and sent him toward Rome" }
    ],
    relationships: [
      { name: "Paul", role: "Roman citizen he rescued and transferred" },
      { name: "Felix", role: "Governor to whom he sent Paul" }
    ],
    lessonsAndReflection: [
      "How does God use non-believers to protect His people?",
      "Can you see God's hand in secular institutions and authorities?"
    ],
    relatedCharacters: ["paul"],
    situations: [
      {
        id: "claudius-lysias-rescues-paul",
        title: "Rescuing Paul from the Mob",
        category: "Leadership Pressure",
        reference: "Acts 21:31-40",
        situation: "A mob in Jerusalem was beating Paul to death. Claudius Lysias led soldiers to intervene and took Paul into custody.",
        pressure: "A full-scale riot threatened the peace of Jerusalem and his career.",
        innerBattle: "Who is this man, and why does he provoke such violence?",
        response: "He acted decisively—rescued Paul, chained him for safety, and eventually transferred him to Caesarea under heavy guard.",
        outcome: "Paul survived, testified before governors, and eventually reached Rome.",
        lesson: "God often protects His servants through the very institutions that do not know Him.",
        traitRevealed: "Pragmatic justice",
        spiritualPrinciple: "The Lord uses the powers of this world to accomplish His sovereign purposes.",
        reflectionQuestions: [
          "Can you see God working through secular authorities in your life?",
          "How does God protect you through unexpected means?"
        ],
        dnaSnapshot: { courage: 4, wisdom: 4 }
      }
    ]
  },
  // ============================================
  // 37. JULIUS
  // ============================================
  {
    id: "julius-centurion",
    name: "Julius",
    meaning: "Soft-haired (Roman name)",
    emoji: "⚓",
    role: "Roman centurion who saved Paul during the shipwreck voyage to Rome",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 27:1-44"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 2, humility: 3, courage: 4, wisdom: 4, compassion: 3, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Protected Paul when soldiers wanted to kill the prisoners",
      weakness: "Initially ignored Paul's warning about the voyage",
      mindset: "Duty demands I deliver this prisoner alive",
      keyLesson: "God places protectors around His servants, even among unbelievers.",
      keyVerse: "But the centurion, willing to save Paul, kept them from their purpose.",
      keyVerseRef: "Acts 27:43"
    },
    storyArc: "A centurion of the Augustan band who treated Paul kindly during the sea voyage to Rome. Despite initially overruling Paul's warning not to sail, Julius ultimately saved Paul's life by preventing soldiers from killing the prisoners during the shipwreck—fulfilling God's promise that Paul would testify in Rome.",
    therapyView: {
      drivingFears: ["Losing his prisoners and his career", "The ship being lost"],
      coreMotivations: ["Duty to Rome", "Respect for Paul", "Completing his mission"],
      relationalStyle: "Professional but increasingly respectful of Paul",
      blindSpots: ["Initially trusted the ship's pilot over Paul's spiritual insight"],
      healingMoments: ["Choosing to save Paul when military protocol demanded otherwise"]
    },
    strengths: ["Kindness", "Decisive leadership", "Willingness to protect Paul"],
    weaknesses: ["Initially dismissed Paul's prophetic warning"],
    journey: [
      { phase: "Calling", description: "Assigned to escort Paul and other prisoners to Rome" },
      { phase: "Testing", description: "Faced the storm and shipwreck on Malta" },
      { phase: "Legacy", description: "His decision to spare Paul ensured the apostle's arrival in Rome" }
    ],
    relationships: [
      { name: "Paul", role: "Prisoner he protected" },
      { name: "Aristarchus", role: "Paul's companion on the voyage" }
    ],
    lessonsAndReflection: [
      "How does God use unlikely protectors in your life?",
      "When have you ignored wise counsel only to learn its value later?"
    ],
    relatedCharacters: ["paul", "aristarchus"],
    situations: [
      {
        id: "julius-saves-paul-shipwreck",
        title: "Saving Paul at Sea",
        category: "Leadership Pressure",
        reference: "Acts 27:42-44",
        situation: "After the shipwreck, soldiers planned to kill all prisoners to prevent escape. Julius intervened to save Paul.",
        pressure: "Military law held him responsible if prisoners escaped—killing them was standard protocol.",
        innerBattle: "Do I follow protocol or protect this extraordinary prisoner?",
        response: "He overruled the soldiers, ordered everyone to swim or float to shore, and preserved every life.",
        outcome: "All 276 people survived, Paul reached Malta and eventually Rome, and the gospel continued its advance.",
        lesson: "One person's courageous decision can preserve an entire mission from destruction.",
        traitRevealed: "Decisive compassion under pressure",
        spiritualPrinciple: "God often uses the authority of unbelievers to preserve the lives of His servants.",
        reflectionQuestions: [
          "When has someone you did not expect become your protector?",
          "Are you willing to break protocol to do what is right?"
        ],
        dnaSnapshot: { courage: 4, wisdom: 4, compassion: 3 }
      }
    ]
  },
  // ============================================
  // 38. PUBLIUS
  // ============================================
  {
    id: "publius",
    name: "Publius",
    meaning: "Public, of the people",
    emoji: "🏝️",
    role: "Chief official of Malta who hosted Paul after the shipwreck",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 28:1-10"],
    archetypes: ["Servant", "Builder"],
    dna: { faith: 3, humility: 4, courage: 3, wisdom: 3, compassion: 4, fear: 1, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Generous hospitality to shipwreck survivors",
      weakness: "We know little beyond his hospitality and his father's healing",
      mindset: "These strangers deserve care and shelter",
      keyLesson: "Hospitality to God's servants opens the door to miracles.",
      keyVerse: "In the same quarters were possessions of the chief man of the island, whose name was Publius; who received us, and lodged us three days courteously.",
      keyVerseRef: "Acts 28:7"
    },
    storyArc: "The chief official of Malta who graciously hosted Paul and the shipwreck survivors for three days. When Paul healed his father of fever and dysentery, the rest of the island brought their sick to be healed—hospitality opened the door to a gospel witness across the entire island.",
    therapyView: {
      drivingFears: ["His father's illness", "Obligations as chief official"],
      coreMotivations: ["Civic duty", "Compassion for the shipwrecked"],
      relationalStyle: "Generous, welcoming, dignified",
      blindSpots: ["May not have expected the spiritual dimension of his guests"],
      healingMoments: ["His father's miraculous healing by Paul"]
    },
    strengths: ["Hospitality", "Generosity", "Civic responsibility"],
    weaknesses: ["Limited information about his personal faith response"],
    journey: [
      { phase: "Calling", description: "Hosted Paul and 276 shipwreck survivors as chief of Malta" },
      { phase: "Testing", description: "His father fell ill with fever and dysentery" },
      { phase: "Legacy", description: "Paul healed his father, and the entire island was blessed" }
    ],
    relationships: [
      { name: "Paul", role: "Apostle he hosted" },
      { name: "His father", role: "Healed by Paul's prayer" }
    ],
    lessonsAndReflection: [
      "How does hospitality open doors to the miraculous?",
      "When has serving others brought unexpected blessings to your family?"
    ],
    relatedCharacters: ["paul", "julius-centurion"],
    situations: [
      {
        id: "publius-hosts-paul",
        title: "Hospitality That Opened the Door to Healing",
        category: "Obedience",
        reference: "Acts 28:7-10",
        situation: "Publius hosted Paul and the survivors generously, and his father lay sick with fever and dysentery.",
        pressure: "The burden of hosting 276 people plus his father's serious illness.",
        innerBattle: "Simple civic duty became the occasion for divine encounter.",
        response: "He opened his estate, and Paul prayed for and healed his father.",
        outcome: "The rest of the island brought their sick, all were healed, and the survivors were honored when they departed.",
        lesson: "When you open your home to God's servants, you open it to God's power.",
        traitRevealed: "Generous hospitality rewarded by divine healing",
        spiritualPrinciple: "Hospitality is often the channel through which God's power flows into a community.",
        reflectionQuestions: [
          "How might your hospitality become the occasion for God to work?",
          "Are you willing to host others even when it is inconvenient?"
        ],
        dnaSnapshot: { compassion: 4, humility: 4, faith: 3 }
      }
    ]
  },
  // ============================================
  // 39. ZIPPORAH
  // ============================================
  {
    id: "zipporah",
    name: "Zipporah",
    meaning: "Bird, sparrow",
    emoji: "🐦",
    role: "Moses' wife, daughter of Jethro",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus 2:16-22", "Exodus 4:24-26", "Exodus 18:1-6"],
    archetypes: ["Matriarch", "Survivor"],
    dna: { faith: 3, humility: 3, courage: 5, wisdom: 3, compassion: 3, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Decisive action that saved Moses' life",
      weakness: "Caught between two cultures—Midianite and Israelite",
      mindset: "I will do what must be done, even if it is bloody",
      keyLesson: "Sometimes obedience to God requires someone else to act when the leader cannot.",
      keyVerse: "Then Zipporah took a sharp stone, and cut off the foreskin of her son.",
      keyVerseRef: "Exodus 4:25"
    },
    storyArc: "A Midianite woman who married Moses during his exile, bore his sons, and in a mysterious and dramatic moment, saved his life by circumcising their son when God sought to kill Moses for his neglect of the covenant sign. She later reunited with Moses at Sinai through her father Jethro.",
    therapyView: {
      drivingFears: ["Losing Moses", "The strangeness of Israel's God"],
      coreMotivations: ["Protecting her family", "Supporting Moses' mission"],
      relationalStyle: "Fierce protector, willing to act in crisis",
      blindSpots: ["Cultural tension between Midianite and Israelite practices"],
      healingMoments: ["Reuniting with Moses at Sinai through Jethro"]
    },
    strengths: ["Decisive action", "Courage in crisis", "Protecting her family"],
    weaknesses: ["Cultural displacement", "Possible tension with Moses over religious practices"],
    journey: [
      { phase: "Calling", description: "Married Moses during his exile in Midian" },
      { phase: "Testing", description: "Saved Moses' life through emergency circumcision" },
      { phase: "Legacy", description: "Reunited with Moses at Sinai; mother of Gershom and Eliezer" }
    ],
    relationships: [
      { name: "Moses", role: "Husband" },
      { name: "Jethro", role: "Father" },
      { name: "Gershom", role: "Son" },
      { name: "Eliezer", role: "Son" }
    ],
    lessonsAndReflection: [
      "Have you ever had to act decisively when a leader failed to?",
      "How do you navigate being caught between two worlds?"
    ],
    relatedCharacters: ["moses", "miriam", "aaron"],
    situations: [
      {
        id: "zipporah-saves-moses",
        title: "The Bloody Bridegroom",
        category: "Obedience",
        reference: "Exodus 4:24-26",
        situation: "On the way to Egypt, God sought to kill Moses—apparently because he had not circumcised his son.",
        pressure: "Moses was incapacitated and about to die. Someone had to act immediately.",
        innerBattle: "This is a foreign, bloody ritual—but my husband's life depends on it.",
        response: "Zipporah took a sharp stone, circumcised her son, and touched Moses' feet with the foreskin.",
        outcome: "God relented, Moses' life was spared, and the mission to Egypt continued.",
        lesson: "God's covenant commands are not optional—even for His chosen leader.",
        traitRevealed: "Fierce, decisive obedience in crisis",
        spiritualPrinciple: "Neglected obedience can become a life-threatening crisis, but decisive action can avert disaster.",
        reflectionQuestions: [
          "Is there an act of obedience you have been neglecting?",
          "Who in your life acts decisively when you cannot?"
        ],
        dnaSnapshot: { courage: 5, faith: 3 }
      }
    ]
  },
  // ============================================
  // 40. JETHRO / REUEL
  // ============================================
  {
    id: "jethro",
    name: "Jethro (Reuel)",
    meaning: "Jethro: His excellence; Reuel: Friend of God",
    emoji: "🧓",
    role: "Moses' father-in-law, priest of Midian, wise counselor",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus 2:16-22", "Exodus 18:1-27"],
    archetypes: ["Priest", "Strategist", "Patriarch"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 5, compassion: 4, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Strategist",
      strength: "Practical wisdom that reshaped Israel's leadership structure",
      weakness: "Outsider to the covenant—his advice was pragmatic, not prophetic",
      mindset: "The work is too heavy for you alone—delegate",
      keyLesson: "Wise counsel from outside your circle can prevent leadership burnout.",
      keyVerse: "The thing that thou doest is not good. Thou wilt surely wear away, both thou, and this people that is with thee.",
      keyVerseRef: "Exodus 18:17-18"
    },
    storyArc: "A Midianite priest who sheltered Moses during his exile, gave him his daughter Zipporah in marriage, and later visited the Israelite camp where he offered brilliant organizational advice that created the system of delegated judges—saving Moses from burnout and giving Israel sustainable governance.",
    therapyView: {
      drivingFears: ["Moses collapsing under the weight of leadership"],
      coreMotivations: ["Helping his son-in-law succeed", "Practical wisdom"],
      relationalStyle: "Warm, direct, and practically wise",
      blindSpots: ["His advice was organizational, not spiritual—but it was exactly what was needed"],
      healingMoments: ["Rejoicing in God's deliverance of Israel from Egypt"]
    },
    strengths: ["Practical wisdom", "Organizational insight", "Humility to advise without demanding"],
    weaknesses: ["Outside the covenant community", "Temporary involvement"],
    journey: [
      { phase: "Calling", description: "Took in Moses as a fugitive and became his father-in-law" },
      { phase: "Testing", description: "Observed Moses judging the people alone from morning to evening" },
      { phase: "Legacy", description: "His delegation advice became Israel's governance model" }
    ],
    relationships: [
      { name: "Moses", role: "Son-in-law" },
      { name: "Zipporah", role: "Daughter" }
    ],
    lessonsAndReflection: [
      "Are you trying to do everything alone?",
      "Do you accept wise counsel from unexpected sources?"
    ],
    relatedCharacters: ["moses", "aaron"],
    situations: [
      {
        id: "jethro-delegation-advice",
        title: "Teaching Moses to Delegate",
        category: "Leadership Pressure",
        reference: "Exodus 18:13-27",
        situation: "Jethro watched Moses sit judging the people from morning to evening, with everyone waiting in long lines.",
        pressure: "Moses was burning out, and the people were not being served well.",
        innerBattle: "Should I, an outsider, tell God's prophet how to lead?",
        response: "He spoke directly: This is not good. You will wear yourself out. Appoint capable leaders for smaller matters.",
        outcome: "Moses implemented the system. Israel gained a sustainable judicial structure that lasted for generations.",
        lesson: "Even God's most anointed leaders need practical wisdom from others.",
        traitRevealed: "Courageous, practical wisdom",
        spiritualPrinciple: "Delegation is not a lack of faith—it is wise stewardship of the call God has given you.",
        reflectionQuestions: [
          "Are you wearing yourself out because you refuse to delegate?",
          "Who is the Jethro in your life whose counsel you need to hear?"
        ],
        dnaSnapshot: { wisdom: 5, humility: 4, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 41. HOBAB
  // ============================================
  {
    id: "hobab",
    name: "Hobab",
    meaning: "Beloved",
    emoji: "🏜️",
    role: "Moses' brother-in-law who served as wilderness guide",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Numbers 10:29-32", "Judges 1:16", "Judges 4:11"],
    archetypes: ["Strategist", "Servant"],
    dna: { faith: 3, humility: 4, courage: 3, wisdom: 4, compassion: 3, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Strategist",
      strength: "Desert expertise invaluable to Israel's journey",
      weakness: "Initially reluctant to join Israel's mission",
      mindset: "I know this wilderness—let me help you navigate it",
      keyLesson: "God uses people with practical skills to guide His people through unfamiliar territory.",
      keyVerse: "Leave us not, I pray thee; forasmuch as thou knowest how we are to encamp in the wilderness, and thou mayest be to us instead of eyes.",
      keyVerseRef: "Numbers 10:31"
    },
    storyArc: "Moses' Midianite brother-in-law whom Moses begged to accompany Israel through the wilderness as their guide, saying 'you shall be our eyes.' Initially reluctant, he apparently agreed, and his descendants (the Kenites) settled in the Promised Land alongside Israel.",
    therapyView: {
      drivingFears: ["Leaving his homeland for an uncertain future with Israel"],
      coreMotivations: ["Family loyalty", "Practical service"],
      relationalStyle: "Reluctant but ultimately loyal",
      blindSpots: ["Initial hesitation to join God's mission"],
      healingMoments: ["His descendants' integration into Israel"]
    },
    strengths: ["Desert navigation", "Practical knowledge", "Family loyalty"],
    weaknesses: ["Initial reluctance", "Outsider status"],
    journey: [
      { phase: "Calling", description: "Moses asked him to guide Israel as their eyes in the wilderness" },
      { phase: "Resistance", description: "Initially declined, wanting to return to Midian" },
      { phase: "Legacy", description: "His descendants, the Kenites, settled in the Promised Land" }
    ],
    relationships: [
      { name: "Moses", role: "Brother-in-law who recruited him" },
      { name: "Jethro", role: "Father" }
    ],
    lessonsAndReflection: [
      "What practical skills do you have that God could use for His mission?",
      "Are you reluctant to join what God is doing?"
    ],
    relatedCharacters: ["moses", "jethro"],
    situations: [
      {
        id: "hobab-wilderness-guide",
        title: "Recruited as Israel's Eyes",
        category: "Calling",
        reference: "Numbers 10:29-32",
        situation: "Moses pleaded with Hobab to stay with Israel and guide them through the wilderness he knew intimately.",
        pressure: "Hobab wanted to return to his own land and people.",
        innerBattle: "Do I go home to what is familiar, or join this massive, uncertain journey with Israel?",
        response: "After Moses' persuasion, he apparently stayed—his descendants are found in the Promised Land.",
        outcome: "The Kenites became allies of Israel, and Hobab's practical knowledge served the journey.",
        lesson: "Sometimes God calls you not through a vision but through a friend who says: I need you.",
        traitRevealed: "Practical faithfulness after initial reluctance",
        spiritualPrinciple: "Your natural skills and knowledge may be exactly what God's people need for their journey.",
        reflectionQuestions: [
          "Has someone asked for your help on a mission bigger than yourself?",
          "Are you willing to leave comfort for a calling you did not expect?"
        ],
        dnaSnapshot: { wisdom: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 42. THE WITCH OF ENDOR'S SPIRIT (SAMUEL'S GHOST)
  // ============================================
  {
    id: "samuel-ghost",
    name: "Samuel's Spirit at Endor",
    meaning: "Samuel: Heard by God—appearing posthumously",
    emoji: "👻",
    role: "Samuel's spirit summoned by the Witch of Endor at Saul's request",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 28:3-25"],
    archetypes: ["Prophet"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 2, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Spoke God's truth even from beyond the grave",
      weakness: "His appearance terrified everyone, including the medium",
      mindset: "God's word does not change, not even in death",
      keyLesson: "God's judgment does not change because you found a supernatural way to ask again.",
      keyVerse: "Why hast thou disquieted me, to bring me up?",
      keyVerseRef: "1 Samuel 28:15"
    },
    storyArc: "When Saul was desperate and God had stopped answering him, he sought out the Witch of Endor to summon Samuel's spirit. Samuel appeared—apparently genuinely—and delivered the same message he had spoken in life: God has rejected you, and tomorrow you and your sons will die. The visit brought no comfort, only confirmed doom.",
    therapyView: {
      drivingFears: ["None—Samuel spoke from a place beyond fear"],
      coreMotivations: ["Truth, even posthumously"],
      relationalStyle: "Blunt and uncompromising, even in death",
      blindSpots: ["None in this appearance"],
      healingMoments: ["None for Saul—only the finality of judgment"]
    },
    strengths: ["Unwavering truth", "Consistent message in life and death"],
    weaknesses: ["The encounter was illegal and terrifying for all involved"],
    journey: [
      { phase: "Legacy", description: "Summoned from death, Samuel repeated God's judgment on Saul" }
    ],
    relationships: [
      { name: "Saul", role: "Rejected king who summoned him" },
      { name: "The Witch of Endor", role: "Medium who facilitated the encounter" }
    ],
    lessonsAndReflection: [
      "Are you trying to get a different answer from God by going to illegitimate sources?",
      "What happens when we refuse to accept God's verdict?"
    ],
    relatedCharacters: ["saul-king", "samuel", "witch-of-endor"],
    situations: [
      {
        id: "samuel-ghost-endor",
        title: "Speaking Judgment from Beyond the Grave",
        category: "Conflict",
        reference: "1 Samuel 28:15-19",
        situation: "Saul, desperate and abandoned by God, sought Samuel's spirit through a medium. Samuel appeared and spoke.",
        pressure: "Saul wanted a different answer than what God had already given.",
        innerBattle: "For Saul: maybe Samuel will say something different this time.",
        response: "Samuel repeated the same judgment: God has departed from you. Tomorrow you and your sons will die.",
        outcome: "Saul collapsed in terror. The next day, he and his sons died in battle exactly as Samuel said.",
        lesson: "Going to illegitimate spiritual sources does not change God's verdict—it only confirms it.",
        traitRevealed: "The unchanging nature of God's word",
        spiritualPrinciple: "When God has spoken, seeking alternative spiritual sources only deepens your judgment.",
        reflectionQuestions: [
          "Are you trying to get a different answer from God through illegitimate means?",
          "Can you accept God's verdict, even when it is not what you want to hear?"
        ],
        dnaSnapshot: { faith: 5, wisdom: 5, courage: 5 }
      }
    ]
  },
  // ============================================
  // 43. JABESH-GILEAD MEN
  // ============================================
  {
    id: "jabesh-gilead-men",
    name: "The Men of Jabesh-Gilead",
    meaning: "Jabesh: Dry; Gilead: Heap of testimony",
    emoji: "🪦",
    role: "Warriors who rescued Saul's body from the Philistines",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 31:8-13", "2 Samuel 2:4-7", "1 Samuel 11:1-11"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 4, humility: 4, courage: 5, wisdom: 3, compassion: 5, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Extraordinary loyalty and courage to honor the dead",
      weakness: "Risked their lives for a dead king rather than a living cause",
      mindset: "We will not let our deliverer be dishonored",
      keyLesson: "Gratitude and loyalty are measured by what you do when there is nothing to gain.",
      keyVerse: "All the valiant men arose, and went all night, and took the body of Saul and the bodies of his sons from the wall of Beth-shan.",
      keyVerseRef: "1 Samuel 31:12"
    },
    storyArc: "When Saul first became king, he rescued the men of Jabesh-Gilead from a humiliating threat by Nahash the Ammonite. Years later, when Saul's body was hung on the walls of Beth-shan by the Philistines, these same men marched all night to retrieve his body and give him a proper burial—repaying loyalty with loyalty.",
    therapyView: {
      drivingFears: ["Saul's body being permanently desecrated"],
      coreMotivations: ["Gratitude", "Honor", "Loyalty to their deliverer"],
      relationalStyle: "Fiercely loyal, bound by gratitude",
      blindSpots: ["None apparent—their act was purely honorable"],
      healingMoments: ["David's commendation of their loyalty"]
    },
    strengths: ["Extraordinary courage", "Deep gratitude", "Honor for the dead", "Night march endurance"],
    weaknesses: ["They risked death for a symbolic act"],
    journey: [
      { phase: "Calling", description: "Rescued by Saul from Nahash the Ammonite early in his reign" },
      { phase: "Testing", description: "Saul died in defeat and his body was desecrated by Philistines" },
      { phase: "Legacy", description: "Marched all night to rescue and bury Saul's body with honor" }
    ],
    relationships: [
      { name: "Saul", role: "King who once saved them" },
      { name: "David", role: "New king who commended their loyalty" }
    ],
    lessonsAndReflection: [
      "Do you remember and repay those who have helped you?",
      "What does loyalty look like when there is nothing to gain?"
    ],
    relatedCharacters: ["saul-king", "david", "jonathan"],
    situations: [
      {
        id: "jabesh-gilead-rescue-saul",
        title: "The Night March to Rescue Saul's Body",
        category: "Sacrifice",
        reference: "1 Samuel 31:8-13",
        situation: "After Saul's death on Mount Gilboa, the Philistines hung his body on the walls of Beth-shan.",
        pressure: "Recovering the body meant a dangerous all-night march into Philistine-controlled territory.",
        innerBattle: "Is it worth risking our lives for a dead king?",
        response: "All the valiant men marched all night, took down the bodies of Saul and his sons, and gave them a proper burial.",
        outcome: "David praised them for their loyalty, and their act of honor became legendary in Israel.",
        lesson: "True loyalty is demonstrated not when you can gain something, but when you can only give.",
        traitRevealed: "Unwavering gratitude",
        spiritualPrinciple: "How you honor the fallen reveals the depth of your character.",
        reflectionQuestions: [
          "Who has helped you in the past that you have forgotten?",
          "Would you risk everything for someone who can no longer repay you?"
        ],
        dnaSnapshot: { courage: 5, compassion: 5, faith: 4 }
      }
    ]
  },
  // ============================================
  // 44. ITTAI THE GITTITE
  // ============================================
  {
    id: "ittai-gittite",
    name: "Ittai the Gittite",
    meaning: "With me (from Gath, a Philistine city)",
    emoji: "⚔️",
    role: "Philistine mercenary who remained loyal to David during Absalom's revolt",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 15:19-22", "2 Samuel 18:2"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 4, humility: 4, courage: 5, wisdom: 3, compassion: 3, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Absolute loyalty to David when even Israelites were defecting",
      weakness: "A foreigner with no obligation to stay",
      mindset: "Whether in life or death, I am with the king",
      keyLesson: "True loyalty is not based on obligation but on devotion.",
      keyVerse: "As the LORD liveth, and as my lord the king liveth, surely in what place my lord the king shall be, whether in death or life, even there also will thy servant be.",
      keyVerseRef: "2 Samuel 15:21"
    },
    storyArc: "A Philistine warrior from Gath who had recently joined David's service. When Absalom's revolt forced David to flee Jerusalem, David urged Ittai to go back—he was a foreigner with no obligation. Ittai refused, swearing loyalty in life and death. David later made him commander of a third of his army.",
    therapyView: {
      drivingFears: ["His king being defeated and abandoned"],
      coreMotivations: ["Personal devotion to David", "Honor and loyalty"],
      relationalStyle: "Fiercely devoted, unwavering once committed",
      blindSpots: ["None revealed—his loyalty was exemplary"],
      healingMoments: ["David's trust in making him a commander"]
    },
    strengths: ["Unwavering loyalty", "Military skill", "Devotion that transcended nationality"],
    weaknesses: ["A foreigner fighting another nation's civil war"],
    journey: [
      { phase: "Calling", description: "Joined David's service as a Gittite warrior" },
      { phase: "Testing", description: "Refused to leave David during Absalom's revolt" },
      { phase: "Legacy", description: "Made commander of a third of David's army" }
    ],
    relationships: [
      { name: "David", role: "King he served with absolute loyalty" }
    ],
    lessonsAndReflection: [
      "Would you follow your leader into exile when you had every reason to leave?",
      "Is your commitment to God based on obligation or devotion?"
    ],
    relatedCharacters: ["david", "absalom"],
    situations: [
      {
        id: "ittai-stays-with-david",
        title: "Refusing to Leave David in Exile",
        category: "Faith Testing",
        reference: "2 Samuel 15:19-22",
        situation: "David was fleeing Jerusalem during Absalom's revolt and urged Ittai, a recent foreign recruit, to go back.",
        pressure: "Ittai had no obligation to join David's losing side. He could safely return to Jerusalem.",
        innerBattle: "Logic says leave. Honor says stay.",
        response: "He swore: Wherever my lord the king is, whether in life or death, there I will be.",
        outcome: "David was so moved he made Ittai commander of a third of his army for the decisive battle.",
        lesson: "The most powerful loyalty comes from those with every reason to leave but choose to stay.",
        traitRevealed: "Covenant loyalty beyond obligation",
        spiritualPrinciple: "God values devotion that goes beyond duty—the loyalty that stays when leaving is easy.",
        reflectionQuestions: [
          "When everyone else was leaving, would you stay?",
          "Is your loyalty to God conditional on favorable circumstances?"
        ],
        dnaSnapshot: { courage: 5, faith: 4, humility: 4 }
      }
    ]
  },
  // ============================================
  // 45. BARZILLAI
  // ============================================
  {
    id: "barzillai",
    name: "Barzillai",
    meaning: "Man of iron",
    emoji: "🍞",
    role: "Elderly Gileadite who provided for David during Absalom's revolt",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 17:27-29", "2 Samuel 19:31-39", "1 Kings 2:7"],
    archetypes: ["Servant", "Patriarch"],
    dna: { faith: 4, humility: 5, courage: 4, wisdom: 4, compassion: 5, fear: 1, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Generous provision at personal risk during crisis",
      weakness: "Too old to enjoy the rewards of his faithfulness",
      mindset: "The king needs food, not flattery—I will provide",
      keyLesson: "Practical generosity in someone's darkest hour is the truest form of loyalty.",
      keyVerse: "Let thy servant, I pray thee, turn back again, that I may die in mine own city.",
      keyVerseRef: "2 Samuel 19:37"
    },
    storyArc: "An eighty-year-old wealthy Gileadite who brought food, beds, and supplies to David's exhausted army during Absalom's revolt. When David returned victorious and offered him a place at the royal table, Barzillai humbly declined due to his age and asked that his servant Chimham go in his place.",
    therapyView: {
      drivingFears: ["David starving in the wilderness"],
      coreMotivations: ["Practical love", "Loyalty to the anointed king"],
      relationalStyle: "Generous, humble, expecting nothing in return",
      blindSpots: ["None apparent—his humility was genuine"],
      healingMoments: ["David's lifelong gratitude, even instructing Solomon to care for Barzillai's family"]
    },
    strengths: ["Generosity", "Practical provision", "Humility", "Loyalty"],
    weaknesses: ["Aged and limited in what he could do personally"],
    journey: [
      { phase: "Calling", description: "Recognized David's need and acted on it" },
      { phase: "Testing", description: "Provided for David's army at personal risk during the revolt" },
      { phase: "Legacy", description: "His family was cared for by David and Solomon as a lasting reward" }
    ],
    relationships: [
      { name: "David", role: "King he provided for" },
      { name: "Chimham", role: "Servant/son who went to Jerusalem in his place" }
    ],
    lessonsAndReflection: [
      "Do you provide for others in their time of need without expecting reward?",
      "How does practical generosity demonstrate loyalty?"
    ],
    relatedCharacters: ["david", "absalom"],
    situations: [
      {
        id: "barzillai-feeds-david",
        title: "Feeding David's Army in Exile",
        category: "Sacrifice",
        reference: "2 Samuel 17:27-29",
        situation: "David's army arrived in Mahanaim exhausted, hungry, and demoralized after fleeing Absalom. Barzillai brought everything they needed.",
        pressure: "Supporting a fleeing king was a political risk—if Absalom won, Barzillai's life was forfeit.",
        innerBattle: "Do I play it safe, or provide for the LORD's anointed?",
        response: "He brought beds, basins, wheat, barley, flour, grain, beans, lentils, honey, butter, sheep, and cheese.",
        outcome: "David's army was sustained, won the battle, and David never forgot Barzillai's loyalty.",
        lesson: "Practical generosity at the right moment can sustain an entire mission.",
        traitRevealed: "Extravagant practical generosity",
        spiritualPrinciple: "God remembers those who provide for His servants in their hour of greatest need.",
        reflectionQuestions: [
          "Who in your life needs practical provision right now?",
          "Are you willing to give generously when the outcome is uncertain?"
        ],
        dnaSnapshot: { compassion: 5, faith: 4, courage: 4, humility: 5 }
      }
    ]
  },
  // ============================================
  // 46. THE WISE WOMAN OF ABEL
  // ============================================
  {
    id: "wise-woman-abel",
    name: "The Wise Woman of Abel Beth-Maacah",
    meaning: "Unnamed—defined by her wisdom that saved a city",
    emoji: "🏰",
    role: "Woman who negotiated to save her city from Joab's siege",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 20:14-22"],
    archetypes: ["Strategist", "Matriarch"],
    dna: { faith: 4, humility: 3, courage: 5, wisdom: 5, compassion: 4, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Strategist",
      strength: "Used wisdom and negotiation to prevent bloodshed",
      weakness: "Had to make a brutal choice—one life for many",
      mindset: "I am peaceable and faithful—let me solve this without destroying a city",
      keyLesson: "Wisdom in crisis can save an entire community from destruction.",
      keyVerse: "I am one of them that are peaceable and faithful in Israel: thou seekest to destroy a city and a mother in Israel.",
      keyVerseRef: "2 Samuel 20:19"
    },
    storyArc: "When Sheba son of Bikri fled into Abel Beth-Maacah and Joab began battering the city walls, an unnamed wise woman called out to negotiate. She convinced Joab that only Sheba needed to die, rallied the city to deliver his head, and saved the entire population from siege and slaughter.",
    therapyView: {
      drivingFears: ["Her city being destroyed", "Innocent bloodshed"],
      coreMotivations: ["Saving her community", "Justice", "Peace"],
      relationalStyle: "Bold negotiator, community advocate",
      blindSpots: ["The moral weight of delivering a man's head"],
      healingMoments: ["The city was saved because of her wisdom"]
    },
    strengths: ["Wisdom", "Courage", "Negotiation", "Community leadership", "Decisiveness"],
    weaknesses: ["Had to make a devastating moral choice"],
    journey: [
      { phase: "Calling", description: "Recognized the crisis and took initiative" },
      { phase: "Testing", description: "Negotiated with Joab while the city walls were being battered" },
      { phase: "Legacy", description: "Saved her city through wisdom instead of warfare" }
    ],
    relationships: [
      { name: "Joab", role: "General she negotiated with" },
      { name: "Sheba son of Bikri", role: "Rebel whose head she delivered" }
    ],
    lessonsAndReflection: [
      "When has your wisdom prevented a larger conflict?",
      "Are you willing to make hard decisions to protect your community?"
    ],
    relatedCharacters: ["david", "sheba-son-of-bikri"],
    situations: [
      {
        id: "wise-woman-saves-abel",
        title: "Saving the City Through Negotiation",
        category: "Leadership Pressure",
        reference: "2 Samuel 20:14-22",
        situation: "Joab's army was battering the walls of Abel Beth-Maacah to get to the rebel Sheba son of Bikri hiding inside.",
        pressure: "The entire city was about to be destroyed for harboring one rebel.",
        innerBattle: "How do I save my city without betraying justice?",
        response: "She called to Joab, negotiated a deal—deliver Sheba's head and the siege ends—then rallied her people to act.",
        outcome: "Sheba was killed, the siege ended, and the city was saved.",
        lesson: "One wise person can save an entire community from destruction.",
        traitRevealed: "Crisis negotiation and community leadership",
        spiritualPrinciple: "Wisdom is better than weapons of war, and one sinner can destroy much good.",
        reflectionQuestions: [
          "Do you use wisdom or force to resolve conflicts?",
          "When has one person's initiative saved a group from disaster?"
        ],
        dnaSnapshot: { wisdom: 5, courage: 5, compassion: 4 }
      }
    ]
  },
  // ============================================
  // 47. SHEBA SON OF BIKRI
  // ============================================
  {
    id: "sheba-son-of-bikri",
    name: "Sheba son of Bikri",
    meaning: "Sheba: Seven/Oath; Bikri: Youthful",
    emoji: "📯",
    role: "Benjamite who led a revolt against David after Absalom's defeat",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 20:1-22"],
    archetypes: ["Manipulator", "Tragic Hero"],
    dna: { faith: 1, humility: 1, courage: 4, wisdom: 2, compassion: 1, fear: 2, pride: 5, greed: 3 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Charismatic enough to rally the northern tribes",
      weakness: "Rebellion without substance—he had no real plan",
      mindset: "We have no share in David—every man to his tents!",
      keyLesson: "Opportunistic rebellion without God's mandate ends in destruction.",
      keyVerse: "We have no part in David, neither have we inheritance in the son of Jesse: every man to his tents, O Israel.",
      keyVerseRef: "2 Samuel 20:1"
    },
    storyArc: "A Benjamite opportunist who exploited the chaos after Absalom's defeat to rally the northern tribes against David. His revolt was short-lived—he fled to Abel Beth-Maacah where a wise woman convinced the city to deliver his head to Joab rather than face total destruction.",
    therapyView: {
      drivingFears: ["Being ruled by Judah", "Losing tribal independence"],
      coreMotivations: ["Power", "Tribal pride", "Opportunism"],
      relationalStyle: "Divisive agitator who exploited grievances",
      blindSpots: ["No plan beyond the rallying cry", "Assumed people would fight for him"],
      healingMoments: ["None—he died a fugitive"]
    },
    strengths: ["Charisma", "Bold initiative"],
    weaknesses: ["No substance behind the rhetoric", "Opportunistic", "No divine mandate"],
    journey: [
      { phase: "Calling", description: "Seized the opportunity of national chaos to rebel" },
      { phase: "Failure", description: "Support melted away and he fled to Abel Beth-Maacah" },
      { phase: "Legacy", description: "Beheaded by the city's inhabitants to save themselves" }
    ],
    relationships: [
      { name: "David", role: "King he rebelled against" },
      { name: "Joab", role: "General who pursued him" }
    ],
    lessonsAndReflection: [
      "Are you building or just tearing down?",
      "What happens when charisma has no substance behind it?"
    ],
    relatedCharacters: ["david", "absalom", "wise-woman-abel"],
    situations: [
      {
        id: "sheba-rebellion",
        title: "Sounding the Trumpet of Revolt",
        category: "Conflict",
        reference: "2 Samuel 20:1-22",
        situation: "In the chaos after Absalom's defeat, Sheba blew a trumpet and rallied the northern tribes to abandon David.",
        pressure: "He exploited tribal grievances to fracture the newly reunited kingdom.",
        innerBattle: "This is my moment—David is weak and the tribes are divided.",
        response: "He led a revolt that initially drew the northern tribes but quickly lost momentum.",
        outcome: "He fled to Abel, where the wise woman had him beheaded to save the city.",
        lesson: "Rebellion that exploits division rather than seeking God's will ends in destruction.",
        traitRevealed: "Opportunistic rebellion",
        spiritualPrinciple: "Those who sow division reap destruction—unity under God's anointed is the only path to life.",
        reflectionQuestions: [
          "Are you a unifier or a divider in your community?",
          "What happens when charisma is used to tear down rather than build up?"
        ],
        dnaSnapshot: { pride: 5, courage: 4, faith: 1 }
      }
    ]
  },
  // ============================================
  // 48. ABISHAI
  // ============================================
  {
    id: "abishai",
    name: "Abishai",
    meaning: "Father of a gift",
    emoji: "🗡️",
    role: "David's fierce nephew, brother of Joab, one of the mighty warriors",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 26:6-12", "2 Samuel 10:10-14", "2 Samuel 16:9-12", "2 Samuel 21:15-17", "2 Samuel 23:18-19"],
    archetypes: ["Warrior"],
    dna: { faith: 4, humility: 2, courage: 5, wisdom: 2, compassion: 1, fear: 1, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Fearless in battle, killed 300 men with a spear",
      weakness: "Impulsive and violent—wanted to kill when David showed mercy",
      mindset: "Let me take his head off—one strike and it is done",
      keyLesson: "Zeal without restraint can become a liability even in God's service.",
      keyVerse: "And Abishai the son of Zeruiah was chief among three. And he lifted up his spear against three hundred, and slew them.",
      keyVerseRef: "2 Samuel 23:18"
    },
    storyArc: "David's nephew and one of Israel's greatest warriors who served faithfully in battle after battle but whose impulsive, violent nature repeatedly put him at odds with David's merciful instincts—wanting to kill Saul when David spared him, wanting to kill Shimei when David accepted his curses, and saving David's life from a Philistine giant.",
    therapyView: {
      drivingFears: ["David being harmed", "Enemies going unpunished"],
      coreMotivations: ["Protecting David", "Destroying enemies", "Proving his valor"],
      relationalStyle: "Fiercely loyal but dangerously impulsive",
      blindSpots: ["Confusing violence with loyalty", "Inability to show mercy"],
      healingMoments: ["Saving David from the Philistine giant Ishbi-benob"]
    },
    strengths: ["Extraordinary military prowess", "Fierce loyalty", "Courage beyond measure"],
    weaknesses: ["Violent impulses", "Lack of mercy", "Could not distinguish between loyalty and bloodlust"],
    journey: [
      { phase: "Calling", description: "Rose as one of David's mighty warriors and chief of the three" },
      { phase: "Testing", description: "Repeatedly restrained by David from killing unnecessarily" },
      { phase: "Legacy", description: "Saved David's life and held a legendary reputation as a warrior" }
    ],
    relationships: [
      { name: "David", role: "Uncle and king" },
      { name: "Joab", role: "Brother and fellow commander" },
      { name: "Zeruiah", role: "Mother" }
    ],
    lessonsAndReflection: [
      "Is your zeal governed by wisdom, or does it run ahead of God's will?",
      "When has someone restrained you from doing something you would have regretted?"
    ],
    relatedCharacters: ["david", "saul-king", "absalom"],
    situations: [
      {
        id: "abishai-wants-to-kill-saul",
        title: "Restrained from Killing Saul",
        category: "Conflict",
        reference: "1 Samuel 26:6-12",
        situation: "Abishai accompanied David into Saul's camp at night and found the king sleeping. He begged David to let him kill Saul with one strike.",
        pressure: "Their enemy was defenseless before them. One thrust of the spear would end years of persecution.",
        innerBattle: "God has delivered your enemy into your hands—let me finish this!",
        response: "David refused: Do not destroy him, for who can stretch out his hand against the LORD's anointed and be guiltless?",
        outcome: "They took Saul's spear and water jug instead, and David spared the king's life a second time.",
        lesson: "Zeal must be governed by God's will, not our impulses.",
        traitRevealed: "Impulsive violence restrained by godly leadership",
        spiritualPrinciple: "Having the power to destroy does not mean having the right to—vengeance belongs to the Lord.",
        reflectionQuestions: [
          "When has your zeal needed to be restrained by godly counsel?",
          "Can you trust God's timing for justice rather than taking matters into your own hands?"
        ],
        dnaSnapshot: { courage: 5, pride: 3, faith: 4, compassion: 1 }
      },
      {
        id: "abishai-saves-david",
        title: "Saving David from the Giant",
        category: "Sacrifice",
        reference: "2 Samuel 21:15-17",
        situation: "During a battle with the Philistines, David grew weary and the giant Ishbi-benob was about to kill him.",
        pressure: "The king of Israel was about to die on the battlefield.",
        innerBattle: "None—Abishai acted on pure instinct and loyalty.",
        response: "Abishai came to David's aid and struck down the Philistine, saving the king's life.",
        outcome: "David's men swore he would never go to battle again, lest the lamp of Israel be extinguished.",
        lesson: "The same fierce impulse that can be a liability in peace becomes a lifesaver in battle.",
        traitRevealed: "Protective ferocity",
        spiritualPrinciple: "God places fierce defenders around His anointed—even their roughest edges serve a purpose.",
        reflectionQuestions: [
          "How has God placed fierce protectors in your life?",
          "Can a weakness in one context become a strength in another?"
        ],
        dnaSnapshot: { courage: 5, faith: 4 }
      }
    ]
  },
];
