// Daily Studies Library for Phototheology Palace
// Studies organized by Palace Principles with Easy, Intermediate, and Deep levels

export type StudyLevel = 'easy' | 'intermediate' | 'deep';

export interface StudyQuestion {
  question: string;
  hint?: string;
  scripture?: string;
}

export interface DailyStudy {
  id: string;
  title: string;
  level: StudyLevel;
  palacePrinciple: string;
  principleDescription: string;
  room?: string; // Which room this relates to
  introduction: string;
  focusScripture: string;
  focusPassage?: string;
  questions: StudyQuestion[];
  keyInsight: string;
  practiceActivity?: string;
  relatedPrinciples?: string[];
}

// ============================================
// EASY LEVEL STUDIES
// Foundation concepts for beginners
// ============================================

const easyStudies: DailyStudy[] = [
  // SIX WALLS - Christ Pattern
  {
    id: 'easy-christ-pattern-1',
    title: 'Finding Christ in Stories',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'Every story in Scripture reveals something about Jesus — His life, death, or ministry.',
    room: 'studies',
    introduction: 'The palace has six walls, and the first wall is the Christ Pattern. This means every Bible story shows us something about Jesus. Today we\'ll learn to see Jesus in a familiar story.',
    focusScripture: 'Genesis 22:1-14',
    focusPassage: 'Abraham and Isaac on Mount Moriah',
    questions: [
      { question: 'Who provided the lamb for Abraham\'s sacrifice?', hint: 'Look at verse 8 and 14' },
      { question: 'How is Isaac\'s journey up the mountain like Jesus\' journey to the cross?', scripture: 'John 19:17' },
      { question: 'What does Abraham\'s willingness to offer Isaac tell us about God offering Jesus?', scripture: 'John 3:16' }
    ],
    keyInsight: 'Isaac carrying the wood up the mountain is a picture of Jesus carrying His cross. Abraham\'s words "God will provide the lamb" were fulfilled when God provided Jesus as the Lamb of God.',
    practiceActivity: 'This week, when you read a Bible story, ask: "Who represents Jesus in this story?"',
    relatedPrinciples: ['Sacrifice Pattern', 'Covenant Pattern']
  },
  {
    id: 'easy-christ-pattern-2',
    title: 'Christ in Joseph\'s Story',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'Joseph\'s life is one of the clearest pictures of Jesus in the Old Testament.',
    room: 'studies',
    introduction: 'Joseph was sold by his brothers, went through suffering, and then saved the very ones who rejected him. This is exactly what Jesus did for us!',
    focusScripture: 'Genesis 37, 45:1-8',
    questions: [
      { question: 'How did Joseph\'s brothers feel about him?', hint: 'Genesis 37:4-8' },
      { question: 'What did Joseph do when his brothers came to him in Egypt?', hint: 'Genesis 45:5-8' },
      { question: 'How is this like what Jesus does for those who rejected Him?', scripture: 'Romans 5:8' }
    ],
    keyInsight: 'Joseph told his brothers: "You meant it for evil, but God meant it for good" (Genesis 50:20). Jesus was rejected and crucified, but God used it to save the world.',
    practiceActivity: 'Write down three ways Joseph\'s story mirrors Jesus\' story.'
  },

  // SIX WALLS - Sanctuary Pattern
  {
    id: 'easy-sanctuary-1',
    title: 'The Sanctuary Journey',
    level: 'easy',
    palacePrinciple: 'Sanctuary Pattern (Second Wall)',
    principleDescription: 'The sanctuary shows the step-by-step journey of salvation.',
    room: 'sanctuary',
    introduction: 'The sanctuary was like a map showing how we come to God. Each piece of furniture represents a step in our journey with Jesus.',
    focusScripture: 'Exodus 25:8-9; 40:1-8',
    questions: [
      { question: 'What was the first thing you would see entering the courtyard?', hint: 'The altar of burnt offering' },
      { question: 'Why do you think you had to pass the altar before anything else?', scripture: 'Hebrews 9:22' },
      { question: 'What did the laver (water basin) represent?', scripture: 'Titus 3:5' }
    ],
    keyInsight: 'You can\'t skip steps in the sanctuary! First the altar (accepting Jesus\' sacrifice), then the laver (baptism), then entering the holy place. Salvation is a journey, not just a moment.',
    practiceActivity: 'Draw a simple sanctuary layout and label each piece of furniture with what it represents in your spiritual journey.'
  },
  {
    id: 'easy-sanctuary-2',
    title: 'Furniture in the Holy Place',
    level: 'easy',
    palacePrinciple: 'Sanctuary Pattern (Second Wall)',
    principleDescription: 'The three items in the Holy Place represent daily Christian living.',
    room: 'sanctuary',
    introduction: 'Once past the altar and laver, the priest entered the Holy Place. Here were three items that represent how we grow in Christ daily.',
    focusScripture: 'Exodus 25:23-40',
    questions: [
      { question: 'The bread on the table was called the "bread of the presence." What is our daily bread?', scripture: 'Matthew 4:4; John 6:35' },
      { question: 'The candlestick gave light in the dark room. What does Jesus call us?', scripture: 'Matthew 5:14-16' },
      { question: 'The incense rose up like smoke. What does incense represent?', scripture: 'Revelation 8:3-4' }
    ],
    keyInsight: 'Daily Christian life = feeding on God\'s Word (bread), shining for Jesus (candlestick), and talking to God (incense/prayer).',
    practiceActivity: 'Which of the three — Word, Witnessing, or Prayer — needs more attention in your life this week?'
  },

  // SIX DIMENSIONS
  {
    id: 'easy-dimensions-1',
    title: 'The Same Story, Many Meanings',
    level: 'easy',
    palacePrinciple: 'Six Dimensions of Application',
    principleDescription: 'Every Bible passage can be understood at multiple levels — from literal history to heavenly realities.',
    room: 'studies',
    introduction: 'Phototheology teaches that Scripture is like a diamond with many facets. The same passage has meaning for you personally, for Jesus, for the church, and even for heaven!',
    focusScripture: 'Joshua 3-4 (Crossing the Jordan)',
    questions: [
      { question: 'Literally, what happened when Israel crossed the Jordan?', hint: 'The waters parted and they walked through on dry ground' },
      { question: 'How is crossing the Jordan like baptism?', scripture: 'Romans 6:4' },
      { question: 'If Jordan represents death and Canaan represents heaven, what does crossing Jordan picture for us personally?' }
    ],
    keyInsight: 'Israel\'s crossing of Jordan was a literal event, but it also pictures: (1) Jesus\' baptism at the Jordan, (2) Our baptism, (3) The church entering its mission, (4) Our final crossing into heaven!',
    practiceActivity: 'When you read a Bible story, ask these questions: What happened literally? How does this show me Jesus? What does this mean for me? What does this mean for the church?'
  },
  {
    id: 'easy-dimensions-2',
    title: 'David and Goliath — It\'s Your Story Too',
    level: 'easy',
    palacePrinciple: 'Personal Dimension (Me)',
    principleDescription: 'Bible stories aren\'t just history — they are maps for your own spiritual battles.',
    room: 'studies',
    introduction: 'You probably know the story of David and Goliath. But did you know this story is about YOUR battles too?',
    focusScripture: '1 Samuel 17',
    questions: [
      { question: 'What "Goliath" do you face in your life — what giant problem seems impossible?', hint: 'Fear, addiction, doubt, temptation?' },
      { question: 'David didn\'t use Saul\'s armor. What weapons has God given YOU that the world doesn\'t understand?', scripture: 'Ephesians 6:10-17' },
      { question: 'David said, "The battle is the Lord\'s." What does this mean for your Goliath?' }
    ],
    keyInsight: 'David represents Christ who defeated our greatest giant — death and sin. But you also have a Goliath, and the same God who gave David victory will give you victory!',
    practiceActivity: 'Write down your Goliath. Then write: "The battle is the Lord\'s" and pray over it daily.'
  },

  // PARALLELS
  {
    id: 'easy-parallels-1',
    title: 'Shadows and Fulfillment',
    level: 'easy',
    palacePrinciple: 'Biblical Parallels',
    principleDescription: 'Old Testament stories are "shadows" that find their full meaning in Jesus.',
    room: 'p||',
    introduction: 'Parallels show how an Old Testament event and a New Testament event mirror each other. The OT is the shadow; Jesus is the reality.',
    focusScripture: 'Exodus 12:1-13 and John 1:29',
    questions: [
      { question: 'What protected Israel\'s firstborn in Egypt?', hint: 'The blood of the lamb on the doorpost' },
      { question: 'What does John the Baptist call Jesus?', scripture: 'John 1:29' },
      { question: 'How does the Passover lamb parallel Jesus?' }
    ],
    keyInsight: 'The Passover lamb was a shadow. The blood on the doorpost protected from death. Jesus is the fulfillment — His blood protects us from eternal death!',
    practiceActivity: 'Look for more Passover connections: When did Jesus die (time of year)? What day of the week?'
  },

  // COVENANT CYCLES
  {
    id: 'easy-cycles-1',
    title: 'God\'s Covenant Pattern',
    level: 'easy',
    palacePrinciple: 'Covenant Cycles',
    principleDescription: 'God makes covenants (promises) with people in a repeating pattern throughout Scripture.',
    room: 'cycles',
    introduction: 'From Adam to Noah to Abraham to Moses, God keeps making special promises. Each covenant builds on the one before and points to Jesus!',
    focusScripture: 'Genesis 9:8-17 and Genesis 15:1-6',
    questions: [
      { question: 'What sign did God give Noah after the flood?', hint: 'Genesis 9:13' },
      { question: 'What did God promise Abraham?', scripture: 'Genesis 15:5-6' },
      { question: 'What is the "new covenant" God makes with us?', scripture: 'Jeremiah 31:31-33' }
    ],
    keyInsight: 'Every covenant in the Bible is really about Jesus. The rainbow points to God\'s faithfulness in Christ. Abraham\'s seed is Christ (Galatians 3:16). The new covenant is written on our hearts through Jesus!',
    practiceActivity: 'List the major covenants: Adam, Noah, Abraham, Moses, David, New Covenant. What does each one promise?'
  },

  // MORE EASY STUDIES - Noah's Ark
  {
    id: 'easy-noah-1',
    title: 'Christ in Noah\'s Ark',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'Noah\'s ark is a powerful picture of salvation in Christ.',
    room: 'studies',
    introduction: 'The story of Noah is more than history — it\'s a picture of how Christ saves us from judgment!',
    focusScripture: 'Genesis 6-8',
    questions: [
      { question: 'What was the only way to be saved from the flood?', hint: 'Being inside the ark' },
      { question: 'Who closed the door of the ark?', scripture: 'Genesis 7:16' },
      { question: 'How is the ark like Christ?', scripture: '1 Peter 3:20-21' }
    ],
    keyInsight: 'Just as the ark was the ONLY way of salvation in Noah\'s day, Jesus is the ONLY way of salvation today (John 14:6). God Himself closed the door — showing that salvation is entirely God\'s work!',
    practiceActivity: 'Read 1 Peter 3:20-21. How does Peter connect Noah\'s flood to baptism?'
  },

  // Ruth and the Kinsman Redeemer
  {
    id: 'easy-ruth-1',
    title: 'Boaz: A Picture of Jesus',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'The kinsman-redeemer is one of the clearest Christ-types in Scripture.',
    room: 'studies',
    introduction: 'Ruth was a poor, foreign widow. Boaz was a wealthy landowner. Their story is a beautiful picture of Christ and His church!',
    focusScripture: 'Ruth 2-4',
    questions: [
      { question: 'What does "kinsman-redeemer" mean?', hint: 'A family member who could buy back what was lost' },
      { question: 'What did Boaz redeem for Ruth?', scripture: 'Ruth 4:9-10' },
      { question: 'How is this like what Jesus did for us?', scripture: 'Galatians 3:13' }
    ],
    keyInsight: 'Boaz redeemed Ruth (a Gentile) and bought back the family inheritance. Jesus redeems us (sinners) and restores our lost inheritance — eternal life!',
    practiceActivity: 'Ruth was a Moabite (outsider) who became part of Jesus\' family line (Matthew 1:5). What does this teach about who Jesus saves?'
  },

  // Elijah and Elisha
  {
    id: 'easy-elijah-1',
    title: 'Elijah to Elisha — The Transition',
    level: 'easy',
    palacePrinciple: 'Biblical Parallels',
    principleDescription: 'The transition from Elijah to Elisha pictures John the Baptist and Jesus.',
    room: 'p||',
    introduction: 'At the Jordan River, something amazing happened: Elijah\'s ministry ended and Elisha\'s began. This same pattern repeated with John the Baptist and Jesus!',
    focusScripture: '2 Kings 2:1-15',
    questions: [
      { question: 'Where did the transition happen between Elijah and Elisha?', hint: 'At the Jordan River' },
      { question: 'What happened to Elijah\'s ministry after this?', hint: 'He was taken up' },
      { question: 'How does this parallel John the Baptist and Jesus?', scripture: 'John 3:30' }
    ],
    keyInsight: '"He must increase, I must decrease" — John said this at the Jordan! Just as Elijah decreased and Elisha increased at the Jordan, John decreased and Jesus increased after the baptism at the same river!',
    practiceActivity: 'Read John 3:22-30. What does John say about himself compared to Jesus?'
  },

  // The Bronze Serpent
  {
    id: 'easy-serpent-1',
    title: 'Look and Live!',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'The bronze serpent Jesus used to explain salvation.',
    room: 'studies',
    introduction: 'When poisonous snakes attacked Israel, God gave a strange solution — look at a bronze serpent on a pole. Jesus said this was about HIM!',
    focusScripture: 'Numbers 21:4-9; John 3:14-15',
    questions: [
      { question: 'What did the people have to do to be healed?', hint: 'Numbers 21:8-9' },
      { question: 'Who did Jesus say the bronze serpent represented?', scripture: 'John 3:14-15' },
      { question: 'Why do you think a serpent — symbol of sin — was used?' }
    ],
    keyInsight: 'Jesus became sin for us (2 Corinthians 5:21). Just as the bronze serpent was lifted up, Jesus was lifted up on the cross. And just as looking brought healing, believing in Jesus brings eternal life!',
    practiceActivity: 'Jesus used this story with Nicodemus. Why was "looking" enough to save?'
  },

  // The Good Shepherd
  {
    id: 'easy-shepherd-1',
    title: 'Jesus the Good Shepherd',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'The shepherd imagery runs throughout Scripture.',
    room: 'studies',
    introduction: 'David was a shepherd. Jesus called Himself the Good Shepherd. This connection runs deep throughout the Bible!',
    focusScripture: 'Psalm 23; John 10:1-18',
    questions: [
      { question: 'In Psalm 23, who is "my shepherd"?', hint: 'The LORD' },
      { question: 'What does the Good Shepherd do for His sheep?', scripture: 'John 10:11' },
      { question: 'What does "I shall not want" mean in your life?' }
    ],
    keyInsight: 'The same LORD who is David\'s shepherd is Jesus! He leads us through dark valleys, prepares a table in enemy territory, and gives us eternal security. We follow Him because we know His voice.',
    practiceActivity: 'Read Psalm 23 slowly. Personalize each verse: "He makes ME lie down... He leads ME..."'
  },

  // The Word Made Flesh
  {
    id: 'easy-word-1',
    title: 'The Living Word',
    level: 'easy',
    palacePrinciple: 'Christ Pattern (First Wall)',
    principleDescription: 'Jesus is the Word of God made flesh.',
    room: 'studies',
    introduction: 'John begins his Gospel with incredible words: "In the beginning was the Word..." What does it mean that Jesus IS the Word?',
    focusScripture: 'John 1:1-14',
    questions: [
      { question: 'When did the Word exist?', hint: 'John 1:1 — "In the beginning"' },
      { question: 'What did the Word become?', scripture: 'John 1:14' },
      { question: 'If Jesus is the Word, what does reading the Bible really mean?' }
    ],
    keyInsight: 'Jesus is the Word because He is God\'s complete message to us. When you read Scripture, you are meeting Jesus! The Bible isn\'t just information — it\'s encounter with the Living Word.',
    practiceActivity: 'Before your next Bible reading, pray: "Jesus, reveal Yourself to me in these words."'
  },

  // Gospel Floor - Grace
  {
    id: 'easy-gospel-1',
    title: 'The Foundation of Grace',
    level: 'easy',
    palacePrinciple: 'Gospel Floor (Fifth Wall)',
    principleDescription: 'Every Bible passage rests on the foundation of salvation by grace.',
    room: 'studies',
    introduction: 'The palace has a floor — and that floor is the Gospel! No matter what passage you study, underneath it all is the good news of grace.',
    focusScripture: 'Ephesians 2:8-9',
    questions: [
      { question: 'By what are we saved?', hint: 'Verse 8 — grace through faith' },
      { question: 'Can we earn salvation by works?', scripture: 'Ephesians 2:9' },
      { question: 'If salvation is a gift, what is our response?', scripture: 'Ephesians 2:10' }
    ],
    keyInsight: 'The Gospel Floor means that EVERY Bible story rests on grace. Even the law, the sanctuary, and prophecy — all of it points to God\'s free gift in Christ. We don\'t earn it; we receive it!',
    practiceActivity: 'When studying any Bible passage, ask: "Where is the grace here? What is the good news?"'
  },

  // Fruit of the Spirit
  {
    id: 'easy-fruit-1',
    title: 'The Character of Christ',
    level: 'easy',
    palacePrinciple: 'Fruit Room Pattern',
    principleDescription: 'The fruit of the Spirit is the character of Jesus reproduced in us.',
    room: 'frt',
    introduction: 'Paul lists nine "fruits" of the Spirit. But really, they\'re all describing Jesus! The Spirit\'s work is to make us like Christ.',
    focusScripture: 'Galatians 5:22-23',
    questions: [
      { question: 'How many fruits are listed? Is this one fruit or nine?', hint: 'Notice "fruit" is singular' },
      { question: 'Which fruit do you most need right now?' },
      { question: 'How is this fruit different from trying harder?', scripture: 'John 15:4-5' }
    ],
    keyInsight: 'It\'s "fruit" (singular) because it\'s describing ONE thing — the character of Christ! All nine qualities are different aspects of Jesus. The Spirit doesn\'t just give us patience; He gives us JESUS who is patient.',
    practiceActivity: 'Pick one fruit. Find a story where Jesus displayed that quality. Ask the Spirit to grow that in you.'
  },

  // Heaven Ceiling
  {
    id: 'easy-heaven-1',
    title: 'The Heavenly Perspective',
    level: 'easy',
    palacePrinciple: 'Heaven Ceiling (Sixth Wall)',
    principleDescription: 'Every passage connects to heavenly realities.',
    room: 'studies',
    introduction: 'The palace has a ceiling — and that ceiling is Heaven! Every Bible story has a heavenly dimension if we look for it.',
    focusScripture: 'Hebrews 8:1-5',
    questions: [
      { question: 'Where is Jesus now?', scripture: 'Hebrews 8:1' },
      { question: 'What was the earthly sanctuary a copy of?', scripture: 'Hebrews 8:5' },
      { question: 'If the earthly was a "copy," what is the real thing?' }
    ],
    keyInsight: 'The Heaven Ceiling reminds us that earthly things point to heavenly realities. The sanctuary was a copy of heaven! When we study Scripture, we\'re learning about what\'s happening in heaven right now.',
    practiceActivity: 'Ask about any Bible passage: "What heavenly reality does this point to?"'
  },

  // Symbols and Types
  {
    id: 'easy-symbols-1',
    title: 'Reading God\'s Picture Language',
    level: 'easy',
    palacePrinciple: 'Symbols and Types',
    principleDescription: 'God uses consistent symbols throughout Scripture.',
    room: 'st',
    introduction: 'God speaks in pictures! Water, fire, bread, light — these symbols mean the same thing throughout the Bible.',
    focusScripture: 'John 4:10-14; 7:37-39',
    questions: [
      { question: 'What does Jesus offer the woman at the well?', hint: 'Living water' },
      { question: 'What does water represent in John 7:38-39?', scripture: 'John 7:39' },
      { question: 'Where else in the Bible do you see water as a symbol of the Spirit?' }
    ],
    keyInsight: 'Water = Spirit/Life throughout Scripture. From Genesis 1 (Spirit hovering over waters) to Revelation 22 (river of life), water consistently represents the Holy Spirit\'s life-giving presence!',
    practiceActivity: 'Make a list of Bible symbols you know: lamb, fire, oil, bread, wine. What does each represent?'
  }
];

// ============================================
// INTERMEDIATE LEVEL STUDIES
// Building on foundations with deeper connections
// ============================================

const intermediateStudies: DailyStudy[] = [
  // SIX WALLS - PROPHETIC PATTERN
  {
    id: 'int-prophetic-1',
    title: 'Understanding Time Prophecy',
    level: 'intermediate',
    palacePrinciple: 'Prophetic Pattern (Third Wall)',
    principleDescription: 'Biblical time prophecies provide a chronological framework for understanding history and our place in it.',
    room: 'studies',
    introduction: 'The third wall of the palace is the Prophetic Pattern. This includes the great time prophecies like the 70 weeks, 1260 days, and 2300 days. These aren\'t just numbers — they\'re God\'s roadmap of history.',
    focusScripture: 'Daniel 9:24-27',
    questions: [
      { question: 'The 70 weeks were "determined" for Daniel\'s people. What were the six purposes listed in verse 24?' },
      { question: 'When does the prophecy begin? What event marks the starting point?', hint: 'Verse 25 — the decree to restore and build Jerusalem' },
      { question: 'The 70 weeks (490 years) are cut off from a larger prophecy. What is that prophecy?', scripture: 'Daniel 8:14' },
      { question: 'How does knowing where we are in prophetic time affect how we live?' }
    ],
    keyInsight: 'The 70 weeks ended in AD 34, establishing Christ\'s ministry and the gospel going to the Gentiles. We are living in the final period of the 2300 days — the time of judgment (since 1844). Knowing the time gives urgency to our mission!',
    practiceActivity: 'Create a timeline showing the 2300 days and where the 70 weeks fit within it.',
    relatedPrinciples: ['Day of Atonement', 'Sanctuary Cleansing', 'Investigative Judgment']
  },
  {
    id: 'int-prophetic-2',
    title: 'The 1260 Years',
    level: 'intermediate',
    palacePrinciple: 'Prophetic Pattern (Third Wall)',
    principleDescription: 'The 1260-day prophecy appears seven times in Scripture and reveals a crucial period in church history.',
    room: 'studies',
    introduction: 'The number 1260 (also written as 42 months, 3.5 years, or "time, times, and half a time") appears in Daniel and Revelation. Understanding this prophecy unlocks church history.',
    focusScripture: 'Daniel 7:25; Revelation 12:6, 14; 13:5',
    questions: [
      { question: 'What power is described as wearing out the saints and thinking to change times and laws?', hint: 'Daniel 7:25' },
      { question: 'Using the day-for-year principle, how long is 1260 prophetic days?' },
      { question: 'What period of history does 538-1798 represent for the church?', hint: 'The medieval period' },
      { question: 'How did Revelation 12:6 say the woman (church) would be protected during this time?' }
    ],
    keyInsight: 'The 1260 years (538-1798) was the period of papal supremacy when the true church was "in the wilderness." But God preserved His truth through faithful witnesses. The church came out of the wilderness ready for the final work!',
    practiceActivity: 'Research the Waldensians and how they preserved Scripture during the 1260 years.',
    relatedPrinciples: ['Historic Pattern', 'Remnant Church']
  },

  // SIX WALLS - HISTORIC PATTERN
  {
    id: 'int-historic-1',
    title: 'Israel\'s History as Prophecy',
    level: 'intermediate',
    palacePrinciple: 'Historic Pattern (Fourth Wall)',
    principleDescription: 'The history of ancient Israel provides a template that repeats in church history and individual experience.',
    room: 'studies',
    introduction: 'The fourth wall shows us that Israel\'s history is prophetic history. What happened to Israel happens to the church, and even to us individually.',
    focusScripture: '1 Corinthians 10:1-11',
    questions: [
      { question: 'According to verse 6 and 11, why were the stories of Israel written down?', hint: '"for our examples"' },
      { question: 'How does Israel\'s deliverance from Egypt parallel the church\'s deliverance?', scripture: 'Acts 2:41; 7:36' },
      { question: 'Israel wandered 40 years before entering Canaan. What period might this represent for the church?' },
      { question: 'How does YOUR spiritual journey mirror Israel\'s exodus and wilderness experience?' }
    ],
    keyInsight: 'Egypt = bondage to sin. Red Sea = baptism. Wilderness = Christian growth and testing. Canaan = the promised inheritance. Israel\'s journey is YOUR journey and the CHURCH\'s journey!',
    practiceActivity: 'Map your spiritual journey using the Exodus pattern: Where were you "in Egypt"? When did you cross the "Red Sea"? Where are you now?',
    relatedPrinciples: ['Exodus Pattern', 'Wilderness Experience', 'Covenant Cycles']
  },

  // SIX DIMENSIONS - DEEPER
  {
    id: 'int-dimensions-1',
    title: 'The Six-Dimensional Lens',
    level: 'intermediate',
    palacePrinciple: 'Six Dimensions Applied',
    principleDescription: 'Systematically applying all six dimensions to a single passage reveals its full depth.',
    room: 'studies',
    introduction: 'Let\'s take one passage and systematically apply all six dimensions: Literal, Christ, Personal, Church, Heaven Future, and Heaven Past.',
    focusScripture: 'Genesis 28:10-22 (Jacob\'s Ladder)',
    questions: [
      { question: 'LITERAL: What did Jacob literally see and experience at Bethel?' },
      { question: 'CHRIST: How does Jesus apply this vision to Himself?', scripture: 'John 1:51' },
      { question: 'PERSONAL (ME): What "Bethel" moments has God given you — times when heaven touched earth?' },
      { question: 'CHURCH: How is the church like a ladder connecting heaven and earth?' },
      { question: 'HEAVEN FUTURE: What future reality does the ladder represent?', scripture: 'Revelation 21:2-3' },
      { question: 'HEAVEN PAST: How does this connect to Lucifer\'s original claim to ascend to God\'s throne?', scripture: 'Isaiah 14:13-14' }
    ],
    keyInsight: 'Jacob\'s ladder represents Jesus (John 1:51) — the only way to heaven. But it also represents our prayer connection, the church\'s mission, the New Jerusalem coming down, and even contrasts with Satan\'s failed attempt to "ascend" on his own terms.',
    practiceActivity: 'Take any Bible story and write one sentence for each of the six dimensions.',
    relatedPrinciples: ['Christ Pattern', 'Great Controversy', 'Sanctuary Pattern']
  },

  // CHRIST-CHURCH PARALLEL
  {
    id: 'int-parallel-1',
    title: 'The Church Relives Christ\'s Life',
    level: 'intermediate',
    palacePrinciple: 'Christ-Church Parallel',
    principleDescription: 'Just as individuals follow Christ\'s pattern, so the corporate church relives the experiences of Christ.',
    room: 'p||',
    introduction: 'One of the most powerful parallels in Phototheology is seeing how church HISTORY mirrors CHRIST\'S LIFE. The church is the body of Christ, and it experiences what He experienced!',
    focusScripture: 'Acts 2:1-4; Matthew 3:13-17',
    questions: [
      { question: 'When was the church "born"?', hint: 'Pentecost' },
      { question: 'Compare Christ\'s baptism (Matthew 3:16) with the church\'s "baptism" at Pentecost (Acts 2:3-4). What parallels do you see?' },
      { question: 'Christ was tempted for 40 days. The church went into the wilderness for 1260 years. How is this parallel?' },
      { question: 'Christ cleansed the temple when it was 46 years old (John 2:20). What happened 46 years after 1798 (when the church emerged from the wilderness)?', hint: '1798 + 46 = 1844' }
    ],
    keyInsight: 'Birth → Baptism → Wilderness → Temple Cleansing → Ministry → Persecution → Death Decree → Resurrection. This is Christ\'s pattern, and the church will complete this pattern before Jesus returns!',
    practiceActivity: 'Create a chart: one column for Christ\'s life events, one column for church history events. Look for the parallels.',
    relatedPrinciples: ['1844', 'Sanctuary Cleansing', 'Death Decree', 'Remnant']
  },

  // SANCTUARY - FEASTS
  {
    id: 'int-sanctuary-1',
    title: 'The Prophetic Feasts',
    level: 'intermediate',
    palacePrinciple: 'Feast Day Patterns',
    principleDescription: 'The seven annual feasts of Israel are a prophetic calendar revealing the plan of salvation.',
    room: 'sanctuary',
    introduction: 'The feasts weren\'t just holidays — they were prophecies! Each feast was fulfilled (or will be fulfilled) at a specific time in salvation history.',
    focusScripture: 'Leviticus 23',
    questions: [
      { question: 'Passover was fulfilled when? On what exact day did Jesus die?', scripture: '1 Corinthians 5:7' },
      { question: 'Firstfruits (the wave offering) was fulfilled how?', scripture: '1 Corinthians 15:20' },
      { question: 'Pentecost was exactly 50 days after Firstfruits. What happened on Pentecost?', scripture: 'Acts 2:1' },
      { question: 'The Day of Atonement is being fulfilled when?', hint: 'The judgment that began in 1844' },
      { question: 'When will Tabernacles be fully fulfilled?', hint: 'When God "tabernacles" with His people forever' }
    ],
    keyInsight: 'Spring feasts = fulfilled at Christ\'s first coming (Passover, Unleavened Bread, Firstfruits, Pentecost). Fall feasts = fulfilled at Christ\'s second coming (Trumpets, Atonement, Tabernacles). We are living during the Day of Atonement — the judgment!',
    practiceActivity: 'Make a feast chart showing: Feast Name | OT Meaning | NT Fulfillment | Status (fulfilled/in progress/future)',
    relatedPrinciples: ['Day of Atonement', 'Sanctuary Pattern', 'Prophetic Pattern']
  },

  // PARALLELS - MOSES
  {
    id: 'int-parallel-moses',
    title: 'The Moses Pattern',
    level: 'intermediate',
    palacePrinciple: 'Christ Pattern in Exodus',
    principleDescription: 'Moses\' life is one of the most detailed prophecies of Christ in the Old Testament.',
    room: 'p||',
    introduction: 'Deuteronomy 18:15 says God would raise up "a Prophet like Moses." Jesus IS that Prophet. Let\'s trace the parallels.',
    focusScripture: 'Exodus 1-4; Matthew 1-4',
    questions: [
      { question: 'Both Moses and Jesus escaped a ruler\'s massacre of children. Compare Exodus 1:22 with Matthew 2:16.' },
      { question: 'Both came out of Egypt. Compare Hosea 11:1 with Matthew 2:15.' },
      { question: 'Both passed through water (Red Sea / Baptism). How does this parallel?' },
      { question: 'Both were in the wilderness (40 years / 40 days). What happened in each case?' },
      { question: 'Moses went up a mountain to receive the Law. Jesus gave the Sermon on the Mount. What\'s the connection?', scripture: 'Matthew 5:1' }
    ],
    keyInsight: 'Moses\' life was a prophetic preview of Christ: Birth threat, Egypt, water passage, wilderness, mountain revelation, rejection by his people, but ultimately bringing them to the Promised Land!',
    practiceActivity: 'Continue the parallel: How did Moses\' final song and death (Deuteronomy 31-34) parallel Jesus\' last week?',
    relatedPrinciples: ['Pentateuch Patterns', 'Deliverance Pattern', 'Prophet Office']
  },

  // MORE INTERMEDIATE STUDIES - David Pattern
  {
    id: 'int-david-pattern',
    title: 'The David-Christ Pattern',
    level: 'intermediate',
    palacePrinciple: 'Christ Pattern in Historical Books',
    principleDescription: 'David\'s life and kingdom prophesy Christ\'s life and eternal kingdom.',
    room: 'p||',
    introduction: 'David is called "a man after God\'s own heart." His reign foreshadowed Christ\'s kingdom. But the parallels go much deeper.',
    focusScripture: '1 Samuel 16-17; 2 Samuel 5-7',
    questions: [
      { question: 'David was anointed king but didn\'t reign immediately. How does this parallel Christ?', scripture: 'Daniel 7:13-14' },
      { question: 'David defeated Goliath by unexpected means. How did Christ defeat Satan?', scripture: 'Colossians 2:15' },
      { question: 'David\'s kingdom was promised to last forever (2 Samuel 7:16). Who fulfills this?', scripture: 'Luke 1:32-33' },
      { question: 'David was rejected by Saul but eventually reigned. How does this parallel Christ?' }
    ],
    keyInsight: 'David was anointed (1 Samuel 16) but spent years in hiding before reigning. Jesus was anointed at baptism, spent years in ministry, was "hidden" in death, and will reign eternally. The rejected becomes the ruler!',
    practiceActivity: 'Compare David\'s escape from Saul in the wilderness with Jesus\' rejection by the religious leaders.',
    relatedPrinciples: ['Kingdom Pattern', 'Rejected-then-Exalted', 'King Office']
  },

  // Jonah Pattern
  {
    id: 'int-jonah-pattern',
    title: 'The Sign of Jonah',
    level: 'intermediate',
    palacePrinciple: 'Death and Resurrection Pattern',
    principleDescription: 'Jesus Himself used Jonah as a sign of His death and resurrection.',
    room: 'p||',
    introduction: 'When asked for a sign, Jesus pointed to Jonah. This Old Testament prophet is one of the clearest resurrection types.',
    focusScripture: 'Jonah 1-2; Matthew 12:38-41',
    questions: [
      { question: 'How long was Jonah in the fish?', scripture: 'Jonah 1:17' },
      { question: 'How long was Jesus in the tomb?', scripture: 'Matthew 12:40' },
      { question: 'Jonah\'s "death" led to salvation for pagan sailors and Ninevites. How does this parallel the cross?', scripture: 'John 12:32' },
      { question: 'Why did Jesus call Jonah the ONLY sign for that generation?' }
    ],
    keyInsight: 'Jonah = Christ in death. Three days in the belly of the earth (fish/tomb), then emergence to bring salvation to Gentiles! The resurrection is the ultimate sign that validates everything Jesus claimed.',
    practiceActivity: 'Read Jonah 2 — Jonah\'s prayer from the fish. How does it sound like Christ\'s experience in the tomb?',
    relatedPrinciples: ['Resurrection Pattern', 'Three Days Pattern', 'Gentile Mission']
  },

  // Temple 46 Years
  {
    id: 'int-temple-46',
    title: 'The 46-Year Temple Pattern',
    level: 'intermediate',
    palacePrinciple: 'Christ-Church Parallel',
    principleDescription: 'A fascinating numeric parallel between Christ, His temple, and the church.',
    room: 'studies',
    introduction: 'When Jesus cleansed the temple, the Jews mentioned it had been 46 years in building. This number appears again in church history!',
    focusScripture: 'John 2:13-21',
    questions: [
      { question: 'How old was the temple when Jesus cleansed it?', scripture: 'John 2:20' },
      { question: 'What did Jesus mean by "Destroy this temple"?', scripture: 'John 2:21' },
      { question: 'The church came out of the "wilderness" in 1798. What happened 46 years later?', hint: '1798 + 46 = 1844' },
      { question: 'How does the "cleansing" pattern repeat?' }
    ],
    keyInsight: 'Jesus cleansed the 46-year-old temple. The church emerged from the wilderness in 1798, and 46 years later (1844) the heavenly sanctuary cleansing began! The church relives Christ\'s experience.',
    practiceActivity: 'Research what began in 1844. How is this a "temple cleansing" for the church?',
    relatedPrinciples: ['1844', 'Sanctuary Cleansing', 'Christ-Church Parallel']
  },

  // Elijah Message
  {
    id: 'int-elijah-message',
    title: 'The Elijah Message',
    level: 'intermediate',
    palacePrinciple: 'Three Angels\' Messages Pattern',
    principleDescription: 'Elijah\'s message to Israel parallels the end-time message to the world.',
    room: '3a',
    introduction: 'Malachi prophesied that Elijah would come before "the great and dreadful day of the Lord." John the Baptist was one fulfillment. Is there another?',
    focusScripture: 'Malachi 4:5-6; 1 Kings 18; Revelation 14:6-12',
    questions: [
      { question: 'What was Elijah\'s message on Mount Carmel?', hint: '1 Kings 18:21 — "How long will you waver?"' },
      { question: 'How does "Choose you this day" parallel the First Angel\'s Message?', scripture: 'Revelation 14:7' },
      { question: 'Elijah confronted Baal worship (false worship). What does the Third Angel warn against?', scripture: 'Revelation 14:9-10' },
      { question: 'What "Elijah message" is needed today?' }
    ],
    keyInsight: 'Elijah called Israel to choose between the true God and Baal. The Three Angels call the world to choose between worshiping the Creator and worshiping the beast. Same message, final application!',
    practiceActivity: 'Compare the Elijah story with the Three Angels\' Messages. List the parallels.',
    relatedPrinciples: ['Three Angels\' Messages', 'True vs. False Worship', 'Final Crisis']
  },

  // Abraham\'s Two Sons
  {
    id: 'int-abraham-sons',
    title: 'Ishmael and Isaac: Two Covenants',
    level: 'intermediate',
    palacePrinciple: 'Covenant Pattern',
    principleDescription: 'Paul uses Abraham\'s two sons to teach about law and grace.',
    room: 'studies',
    introduction: 'Abraham had two sons — one by a slave woman, one by a free woman. Paul says this is an allegory about two covenants!',
    focusScripture: 'Galatians 4:21-31',
    questions: [
      { question: 'Who was born according to the flesh?', hint: 'Ishmael — born through human effort' },
      { question: 'Who was born according to the promise?', hint: 'Isaac — born by God\'s power' },
      { question: 'What do the two women represent?', scripture: 'Galatians 4:24-25' },
      { question: 'Which son are we if we are born of the Spirit?', scripture: 'Galatians 4:28' }
    ],
    keyInsight: 'Ishmael = trying to produce God\'s promises by human effort (law). Isaac = receiving God\'s promises by faith (grace). We are children of promise, not children of human effort!',
    practiceActivity: 'Are you trying to earn God\'s favor (Ishmael) or receiving it by faith (Isaac)?',
    relatedPrinciples: ['Law and Grace', 'Promise vs. Works', 'Covenant Theology']
  },

  // Daniel and Revelation Connection
  {
    id: 'int-dan-rev-connection',
    title: 'Daniel and Revelation: Twin Books',
    level: 'intermediate',
    palacePrinciple: 'Prophetic Pattern',
    principleDescription: 'Daniel and Revelation are meant to be studied together.',
    room: 'pr',
    introduction: 'Revelation cannot be understood without Daniel, and Daniel is "unsealed" by Revelation. These are twin books!',
    focusScripture: 'Daniel 7; Revelation 13',
    questions: [
      { question: 'Daniel 7 has four beasts. Revelation 13 has a composite beast. What animals do you see in both?', hint: 'Lion, bear, leopard' },
      { question: 'Daniel 7:25 mentions "time, times, half a time." Where does Revelation mention 42 months?', scripture: 'Revelation 13:5' },
      { question: 'Daniel\'s book was sealed (Daniel 12:4). When was it unsealed?', hint: '"Time of the end"' },
      { question: 'What does studying these together reveal about our time?' }
    ],
    keyInsight: 'Revelation combines Daniel\'s four beasts into one (Rev 13:2), showing that all those empires culminate in one final power. The 1260 days/42 months/3.5 times are the same period in both books!',
    practiceActivity: 'Create a chart comparing Daniel 7 and Revelation 13. What symbols appear in both?',
    relatedPrinciples: ['1260 Days', 'Four Kingdoms', 'Time of the End']
  },

  // The Shaking
  {
    id: 'int-shaking',
    title: 'The Great Shaking',
    level: 'intermediate',
    palacePrinciple: 'Historic Pattern (Fourth Wall)',
    principleDescription: 'Israel\'s shaking in the wilderness is a pattern for the church\'s final shaking.',
    room: 'studies',
    introduction: 'Hebrews speaks of a coming "shaking" when everything that can be shaken will be removed. This pattern appears throughout Scripture.',
    focusScripture: 'Hebrews 12:25-29; Numbers 14',
    questions: [
      { question: 'What caused the shaking in Israel at Kadesh-Barnea?', hint: 'Numbers 14 — Fear and unbelief' },
      { question: 'What "cannot be shaken" according to Hebrews 12:28?', hint: 'The kingdom we receive' },
      { question: 'If trial "shakes" us, what does it reveal?' },
      { question: 'How should we prepare for the shaking?', scripture: 'Hebrews 12:28' }
    ],
    keyInsight: 'Israel was "shaken" at Kadesh — the faithless fell, but the faithful remained. The church will be shaken — chaff will blow away, but wheat will remain. The shaking purifies, it doesn\'t destroy true faith!',
    practiceActivity: 'Read Numbers 13-14. What caused some to fall and others to stand? Apply this to your life.',
    relatedPrinciples: ['Faith vs. Fear', 'Remnant', 'Final Crisis']
  },

  // Nebuchadnezzar\'s Dream
  {
    id: 'int-nebuchadnezzar',
    title: 'The Statue of World Empires',
    level: 'intermediate',
    palacePrinciple: 'Prophetic Pattern (Third Wall)',
    principleDescription: 'Daniel 2 gives us the prophetic framework of world history.',
    room: 'pr',
    introduction: 'Nebuchadnezzar\'s dream of a great statue outlines history from Babylon to the Second Coming. Understanding this framework unlocks all prophecy!',
    focusScripture: 'Daniel 2:31-45',
    questions: [
      { question: 'What were the four metals of the statue?', hint: 'Gold, silver, bronze, iron' },
      { question: 'What kingdom was the "head of gold"?', scripture: 'Daniel 2:38' },
      { question: 'What does the stone that crushes the statue represent?', scripture: 'Daniel 2:44-45' },
      { question: 'We live in the "feet" era. What does iron mixed with clay mean?', scripture: 'Daniel 2:43' }
    ],
    keyInsight: 'Gold = Babylon, Silver = Medo-Persia, Bronze = Greece, Iron = Rome, Iron/Clay = Divided Europe. The stone = God\'s eternal kingdom. We are living in the toes — the next event is the stone!',
    practiceActivity: 'History confirms: Babylon fell 539 BC, Persia fell 331 BC, Greece divided after Alexander, Rome fell 476 AD. What does this accuracy tell us about the stone?',
    relatedPrinciples: ['Four Kingdoms', 'Second Coming', 'God\'s Kingdom']
  },

  // Wilderness Pattern
  {
    id: 'int-wilderness-pattern',
    title: 'The Wilderness Experience',
    level: 'intermediate',
    palacePrinciple: 'Historic Pattern (Fourth Wall)',
    principleDescription: 'The wilderness is a consistent pattern for testing and preparation.',
    room: 'studies',
    introduction: 'Israel in the wilderness. Jesus in the wilderness. The church in the wilderness. This pattern repeats because God uses wilderness to prepare His people.',
    focusScripture: 'Deuteronomy 8:2-5; Matthew 4:1-11; Revelation 12:6',
    questions: [
      { question: 'Why did God lead Israel through the wilderness for 40 years?', scripture: 'Deuteronomy 8:2' },
      { question: 'Jesus was in the wilderness for 40 days. What was He being prepared for?', hint: 'His ministry' },
      { question: 'The woman (church) fled to the wilderness for 1260 days. What protected her?', scripture: 'Revelation 12:6' },
      { question: 'What "wilderness" might God use in your life?' }
    ],
    keyInsight: 'Wilderness = testing ground, not punishment. God tests to reveal what\'s in our hearts, to humble us, and to teach us to depend on Him alone. Every wilderness prepares us for a "promised land"!',
    practiceActivity: 'Identify a "wilderness season" in your past. How did God use it to prepare you?',
    relatedPrinciples: ['Testing Pattern', '40-Day/Year Pattern', 'Preparation Pattern']
  },

  // Esther Pattern
  {
    id: 'int-esther-pattern',
    title: 'The Esther Crisis',
    level: 'intermediate',
    palacePrinciple: 'End-Time Pattern',
    principleDescription: 'Esther\'s story is a preview of the final crisis for God\'s people.',
    room: 'studies',
    introduction: 'A death decree against God\'s people. Fasting and prayer. Last-minute deliverance. Esther\'s story will repeat at the end of time.',
    focusScripture: 'Esther 3-8',
    questions: [
      { question: 'What triggered Haman\'s fury against all Jews?', hint: 'One man (Mordecai) refused to bow' },
      { question: 'What did Esther and the Jews do when facing the death decree?', scripture: 'Esther 4:16' },
      { question: 'How did God reverse the situation?', hint: 'The very day meant for destruction became a day of victory' },
      { question: 'How might this pattern repeat in the end times?', scripture: 'Revelation 13:15' }
    ],
    keyInsight: 'Death decree (Esther 3:13) → God\'s people fast and pray (Esther 4) → Deliverance at the last moment (Esther 8). This will repeat: Sunday law → Time of Jacob\'s trouble → Deliverance at the Second Coming!',
    practiceActivity: 'Read Esther looking for end-time parallels. Who is Haman today? Who is Mordecai? Who is Esther?',
    relatedPrinciples: ['Death Decree', 'Jacob\'s Time of Trouble', 'Final Deliverance']
  }
];

// ============================================
// DEEP LEVEL STUDIES
// Advanced concepts and multi-layered analysis
// ============================================

const deepStudies: DailyStudy[] = [
  // HEAVEN PAST DIMENSION
  {
    id: 'deep-heaven-past-1',
    title: 'The Great Controversy Lens',
    level: 'deep',
    palacePrinciple: 'Heaven Past (Sixth Dimension)',
    principleDescription: 'Every passage can illuminate the original conflict that began in heaven before earth\'s creation.',
    room: 'studies',
    introduction: 'The sixth dimension is often overlooked: How does this passage illuminate the war that began in heaven? Satan\'s original accusations? God\'s vindication? Let\'s explore.',
    focusScripture: 'Job 1-2; Revelation 12:7-12',
    questions: [
      { question: 'Job\'s story begins with a scene in heaven. What accusation does Satan bring against God\'s government?', hint: 'That Job only serves God because of what he gets' },
      { question: 'How does this accusation reflect Satan\'s original claim in heaven?', scripture: 'Isaiah 14:12-14' },
      { question: 'Job goes through the trial, intercedes for his enemies (Job 42:10). How does this vindicate God\'s character?' },
      { question: 'How does Job\'s experience parallel Christ\'s experience, and ultimately the church\'s final experience?' },
      { question: 'Revelation 12:10 says Satan is "the accuser of the brethren." How do we see this in Job, in Christ\'s trial, and in the final crisis?' }
    ],
    keyInsight: 'Job is not primarily about suffering — it\'s about the COURTROOM OF HEAVEN. Satan accused God of buying loyalty. Job proved otherwise. Christ proved it ultimately. And we, through our faithfulness in trial, participate in vindicating God\'s character!',
    practiceActivity: 'Read any Bible story asking: What question is being answered about God\'s character here? What accusation is being refuted?',
    relatedPrinciples: ['Investigative Judgment', 'Vindication of God', 'Final Crisis']
  },

  // SEVEN CHURCHES - HEAVEN DIMENSION
  {
    id: 'deep-churches-heaven',
    title: 'Seven Churches: A Heavenly Perspective',
    level: 'deep',
    palacePrinciple: 'Seven Churches in Heaven Dimension',
    principleDescription: 'The seven churches don\'t just represent church history — they reflect the original controversy in heaven.',
    room: 'studies',
    introduction: 'The seven churches have the literal, Christ, church history, and personal dimensions. But what about the heaven-past dimension? Let\'s explore.',
    focusScripture: 'Revelation 2-3',
    questions: [
      { question: 'Ephesus means "desirable." When Lucifer was first "desirable" in heaven, what went wrong?', scripture: 'Ezekiel 28:12-15' },
      { question: 'Pergamos means "height/elevation." Satan said he would exalt his throne above God\'s (Isaiah 14:13). How does Pergamos reflect this?' },
      { question: 'Thyatira means "oil of affliction." What affliction came to heaven when war broke out?', scripture: 'Revelation 12:7-9' },
      { question: 'Sardis means "remaining/escaping." Who "escaped" Satan\'s deception?', hint: 'The loyal angels' },
      { question: 'Philadelphia means "brotherly love." How did the loyal angels draw together?', scripture: 'Revelation 12:7' },
      { question: 'Laodicea means "judgment." How does judgment apply to Satan\'s original rebellion?' }
    ],
    keyInsight: 'The seven churches trace NOT ONLY church history but also the STAGES OF LUCIFER\'S FALL and the resulting conflict. Understanding this deepens our grasp of the Great Controversy that runs through all Scripture.',
    practiceActivity: 'Create a three-column chart for each church: Church Name | Church History Meaning | Heaven-Past Meaning',
    relatedPrinciples: ['Great Controversy', 'Revelation Structure', 'Fall of Satan']
  },

  // COVENANT CYCLES DEEP
  {
    id: 'deep-cycles-1',
    title: 'The Eight Covenant Cycles',
    level: 'deep',
    palacePrinciple: 'Covenant Cycles Framework',
    principleDescription: 'Scripture can be organized into eight repeating covenant cycles, each following a similar pattern.',
    room: 'cycles',
    introduction: 'Phototheology identifies eight major covenant cycles: @Ad (Adam), @No (Noah), @Ab (Abraham), @Mo (Moses), @Cy (Cyrus), @CyC (Cyrus-Christ), @Sp (Spiritual Israel), @Re (Remnant). Each cycle has parallel events.',
    focusScripture: 'Overview: Genesis-Revelation',
    questions: [
      { question: 'In the Adam cycle, creation is followed by a fall. How does the Cyrus-Christ cycle (Christ\'s first coming) mirror this?', hint: 'New creation in Christ, followed by church apostasy' },
      { question: 'The Noah cycle has a judgment by water and a remnant saved. What parallels exist in the Moses cycle at the Red Sea?' },
      { question: 'The Abraham cycle includes a promised heir. How is this fulfilled in Christ, and how does the church inherit this promise?', scripture: 'Galatians 3:29' },
      { question: 'Cyrus delivered Israel from Babylon. How does Christ deliver from spiritual Babylon?', scripture: 'Revelation 18:4' },
      { question: 'How does understanding covenant cycles help you see your place in salvation history?' }
    ],
    keyInsight: 'The same story repeats at every level: Creation → Fall → Judgment → Remnant saved → New beginning. This pattern runs from Adam to the New Earth. You are living in the @Re (Remnant) cycle, and your experience mirrors all previous cycles!',
    practiceActivity: 'Chart the eight cycles with major events: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re. Note the parallels.',
    relatedPrinciples: ['Historic Pattern', 'Prophetic Pattern', 'Remnant']
  },

  // WATERS OF SCRIPTURE
  {
    id: 'deep-waters-1',
    title: 'Rivers and Waters of Scripture',
    level: 'deep',
    palacePrinciple: 'Waters of Scripture',
    principleDescription: 'The rivers and bodies of water in Scripture mark significant transitions and revelations.',
    room: 'studies',
    introduction: 'Notice how significant events happen at specific bodies of water. This isn\'t coincidence — the waters tell a story of their own!',
    focusScripture: 'Multiple: Genesis-Revelation',
    questions: [
      { question: 'The Nile represents bondage. Moses was drawn from it (Exodus 2:10). What does this picture for us?', hint: 'Drawn from bondage' },
      { question: 'Elijah was fed at Cherith (1 Kings 17). This was during the 3.5 years of famine. How does this parallel the 1260 years?' },
      { question: 'Ezekiel received his temple vision at Chebar. What was the vision about?', scripture: 'Ezekiel 1' },
      { question: 'Daniel received the 2300-day vision at Ulai (Daniel 8:2). What was being revealed there?' },
      { question: 'The final vision of Daniel (chapters 10-12) was at Hiddekel (Tigris). What is the subject of this vision?', hint: 'End-time events, perfecting of the saints' },
      { question: 'The Euphrates dries up in Revelation 16:12. What does this represent?', hint: 'Preparation for the kings of the East' }
    ],
    keyInsight: 'Nile = bondage, Red Sea = deliverance, Jordan = entering mission, Cherith = wilderness protection, Ulai = sanctuary truth, Hiddekel = end-time perfecting, Euphrates = fall of Babylon, River of Life = paradise restored. The waters trace the entire plan of salvation!',
    practiceActivity: 'Create a "Waters Map" — list each significant body of water in Scripture and what truth was revealed there.',
    relatedPrinciples: ['Sanctuary Pattern', 'Prophetic Pattern', 'Time Prophecies']
  },

  // REVELATION STRUCTURE
  {
    id: 'deep-revelation-1',
    title: 'Revelation\'s Sanctuary Structure',
    level: 'deep',
    palacePrinciple: 'Revelation Sanctuary Structure',
    principleDescription: 'The book of Revelation is organized around the sanctuary, with each section pointing to different articles of furniture.',
    room: 'sanctuary',
    introduction: 'Revelation isn\'t random visions — it follows the sanctuary pattern! Each major section contains sanctuary imagery that tells us where we are in the plan of salvation.',
    focusScripture: 'Revelation 1, 4, 8, 11:19, 15',
    questions: [
      { question: 'In Revelation 1:12-13, what sanctuary item does John see? What section of Revelation does this introduce?', hint: 'Candlestick → Seven Churches' },
      { question: 'In Revelation 8:3-5, what sanctuary item is prominent? What section does this introduce?', hint: 'Altar of Incense → Seven Trumpets' },
      { question: 'In Revelation 11:19, what is seen in heaven? What does this signal?', hint: 'Ark of Covenant → Most Holy Place' },
      { question: 'Why does Revelation 15:8 say no one can enter the temple? What does this mean prophetically?' },
      { question: 'How does understanding Revelation\'s sanctuary structure help you know where we are in salvation history?' }
    ],
    keyInsight: 'Seven Churches = Candlestick (Holy Place ministry). Seven Seals/Trumpets = Incense Altar (transition). Seven Plagues = Temple filled with smoke (Most Holy, probation closing). The Ark appears in 11:19, signaling the Day of Atonement began. We are in the Most Holy Place time!',
    practiceActivity: 'Read Revelation looking for sanctuary imagery. Create a chart: Chapter | Sanctuary Item Seen | What This Reveals',
    relatedPrinciples: ['Day of Atonement', '1844', 'Three Angels\' Messages']
  },

  // THREE HEAVENS
  {
    id: 'deep-heavens-1',
    title: 'The Three Heavens Framework',
    level: 'deep',
    palacePrinciple: 'Three Heavens (1H, 2H, 3H)',
    principleDescription: 'Scripture speaks of three heavens, and understanding them unlocks prophetic symbolism.',
    room: 'studies',
    introduction: 'Paul was caught up to the "third heaven" (2 Corinthians 12:2). What are the three heavens, and how do they relate to prophecy?',
    focusScripture: '2 Corinthians 12:2; Genesis 1:8, 14-17; Psalm 11:4',
    questions: [
      { question: 'First Heaven: Where do the birds fly? (Genesis 1:20)', hint: 'The atmosphere' },
      { question: 'Second Heaven: Where are the sun, moon, and stars? (Genesis 1:14-17)', hint: 'Outer space' },
      { question: 'Third Heaven: Where is God\'s throne? (Psalm 11:4; 2 Corinthians 12:2-4)' },
      { question: 'In prophetic language, what might "stars falling from heaven" represent?', scripture: 'Revelation 12:4' },
      { question: 'How does the Day of the Lord involve all three heavens?', scripture: '2 Peter 3:10-13' }
    ],
    keyInsight: '1H = atmosphere (physical, can symbolize religious/political air). 2H = space (can symbolize cosmic powers). 3H = God\'s throne (ultimate reality). Understanding these helps interpret prophecies about heavenly signs and the Day of the Lord.',
    practiceActivity: 'Find passages mentioning heaven and determine which of the three heavens is being referenced.',
    relatedPrinciples: ['Prophetic Symbolism', 'Second Coming', 'New Earth']
  },

  // DIMENSIONAL MASTERY
  {
    id: 'deep-dimensions-master',
    title: 'Mastering the Six Dimensions',
    level: 'deep',
    palacePrinciple: 'Complete Dimensional Analysis',
    principleDescription: 'Practice applying all six dimensions to a complex passage for maximum insight.',
    room: 'studies',
    introduction: 'Let\'s take a challenging passage and apply the full six-dimensional analysis that Phototheology offers.',
    focusScripture: 'Genesis 32:22-32 (Jacob Wrestling)',
    questions: [
      { question: 'LITERAL: Jacob wrestled all night with a "man" who dislocated his hip. What literally happened, and who was this man?', scripture: 'Hosea 12:3-4' },
      { question: 'CHRIST: Jesus wrestled in Gethsemane all night before facing His "Esau" (the mob). Compare Matthew 26:36-46. What parallels do you see?' },
      { question: 'PERSONAL: What night of wrestling have you experienced? What "hip" (self-reliance) did God have to touch?' },
      { question: 'CHURCH: The church faces a "Jacob\'s time of trouble" (Jeremiah 30:7). How does Jacob\'s experience preview the final crisis?' },
      { question: 'HEAVEN FUTURE: At the end of the millennium, the wicked ("Esaus") march against the New Jerusalem ("Jacobs"). Compare Revelation 20:7-9. How is this parallel?' },
      { question: 'HEAVEN PAST: Jacob struggled to hold onto God; Lucifer struggled to exalt himself against God. How are these two struggles contrasted?' }
    ],
    keyInsight: 'Jacob\'s wrestling is one of the richest six-dimensional passages. It\'s about surrender (personal), Gethsemane (Christ), end-time crisis (church), final deliverance (future), and shows the opposite of Lucifer\'s grasp for power (past). When we cling to God in helplessness, we prevail!',
    practiceActivity: 'Choose a challenging Old Testament narrative. Write a full six-dimensional analysis (one paragraph for each dimension).',
    relatedPrinciples: ['Jacob\'s Time of Trouble', 'Gethsemane', 'Final Crisis', 'Great Controversy']
  },

  // MORE DEEP STUDIES - The 144,000
  {
    id: 'deep-144000',
    title: 'The 144,000 Sealed Ones',
    level: 'deep',
    palacePrinciple: 'End-Time Pattern',
    principleDescription: 'Understanding the 144,000 through Phototheology\'s multi-dimensional lens.',
    room: 'studies',
    introduction: 'Who are the 144,000? This has puzzled many, but using our dimensional approach, we can find profound truths about this special group.',
    focusScripture: 'Revelation 7:1-8; 14:1-5',
    questions: [
      { question: 'LITERAL: 12,000 from each tribe — what is the literal significance of 12 × 12,000?', hint: 'Complete organization' },
      { question: 'CHRIST: The 144,000 "follow the Lamb wherever He goes." How did Jesus model this lifestyle?' },
      { question: 'PERSONAL: They have "no guile" (Rev 14:5). Where else in Scripture is "no guile" used?', scripture: 'John 1:47' },
      { question: 'CHURCH: These are "firstfruits" (Rev 14:4). What does firstfruits mean in feast typology?' },
      { question: 'HEAVEN FUTURE: They stand on Mount Zion (Rev 14:1). What/where is this Mount Zion?', scripture: 'Hebrews 12:22' },
      { question: 'HEAVEN PAST: How does this perfect number contrast with the third of angels who fell (Rev 12:4)?' }
    ],
    keyInsight: 'The 144,000 are the end-time "firstfruits" — living saints who demonstrate that God\'s law CAN be kept through His power. They contrast with the angels who fell; they represent the restored 12 tribes; they reflect Christ\'s character fully.',
    practiceActivity: 'Study the characteristics of the 144,000 (Rev 14:1-5). Which characteristics are you developing now?',
    relatedPrinciples: ['Sealed Saints', 'Character Perfection', 'Firstfruits', 'Final Generation']
  },

  // Sealing Pattern
  {
    id: 'deep-sealing',
    title: 'The Sealing of God\'s People',
    level: 'deep',
    palacePrinciple: 'End-Time Pattern',
    principleDescription: 'The sealing process is found throughout Scripture, culminating in the final sealing.',
    room: 'studies',
    introduction: 'From Ezekiel\'s mark to Revelation\'s seal, God marks His people for protection. This pattern reveals crucial end-time truth.',
    focusScripture: 'Ezekiel 9:1-6; Revelation 7:1-3',
    questions: [
      { question: 'In Ezekiel 9, who received the mark on the forehead?', hint: 'Those who "sighed and cried" over abominations' },
      { question: 'What happened to those without the mark?', scripture: 'Ezekiel 9:5-6' },
      { question: 'What is the seal of God in Revelation 7?', hint: 'What is placed on foreheads in Rev 14:1?' },
      { question: 'How does this contrast with the mark of the beast (Rev 13:16)?', hint: 'Same location — forehead' },
      { question: 'What does receiving a seal "in the forehead" versus "in the hand" represent?' }
    ],
    keyInsight: 'Ezekiel\'s mark was on those who grieved over sin. God\'s end-time seal is on those who choose His character (forehead = mind). The beast\'s mark is on those who worship the beast (forehead) or go along (hand). The sealing is character development!',
    practiceActivity: 'Read Ezekiel 9. What caused people to receive or not receive the mark? How does this apply today?',
    relatedPrinciples: ['Character Development', 'Mark of the Beast', 'Close of Probation']
  },

  // Melchizedek Pattern
  {
    id: 'deep-melchizedek',
    title: 'The Melchizedek Mystery',
    level: 'deep',
    palacePrinciple: 'Christ Pattern in Priesthood',
    principleDescription: 'Melchizedek is one of the most profound Christ-types in Scripture.',
    room: 'studies',
    introduction: 'This mysterious figure appears suddenly, blessed Abraham, and is called a type of Christ. Who was he? What does he teach us?',
    focusScripture: 'Genesis 14:18-20; Hebrews 5-7',
    questions: [
      { question: 'What two offices did Melchizedek hold?', hint: 'King of Salem and priest of God Most High' },
      { question: 'Why is it significant that he was BOTH king and priest?', scripture: 'Zechariah 6:12-13' },
      { question: 'Hebrews says Melchizedek had no genealogy recorded. Why does this matter?', scripture: 'Hebrews 7:3' },
      { question: 'How is Jesus a priest "after the order of Melchizedek" different from "after the order of Aaron"?', scripture: 'Hebrews 7:11-17' },
      { question: 'What does Melchizedek\'s bread and wine offering preview?', hint: 'Think Lord\'s Supper' }
    ],
    keyInsight: 'Melchizedek = King-Priest, eternal priesthood, superior to Aaron. Jesus is the true Melchizedek — King of Righteousness, King of Peace, offering bread and wine, with an eternal priesthood not based on human genealogy!',
    practiceActivity: 'Read Hebrews 7 slowly. List every way Jesus is superior to the Levitical priesthood.',
    relatedPrinciples: ['Eternal Priesthood', 'King-Priest', 'Heavenly Sanctuary']
  },

  // The Sabbath in All Dimensions
  {
    id: 'deep-sabbath-dimensions',
    title: 'The Sabbath Through Six Lenses',
    level: 'deep',
    palacePrinciple: 'Six Dimensions Applied to Sabbath',
    principleDescription: 'Applying all six dimensions to the Sabbath reveals its full significance.',
    room: 'studies',
    introduction: 'The Sabbath is much more than a weekly rest. Let\'s explore it through all six dimensions of Phototheology.',
    focusScripture: 'Genesis 2:1-3; Exodus 20:8-11; Hebrews 4:1-11',
    questions: [
      { question: 'LITERAL: What did God literally do on the seventh day? Why?', scripture: 'Genesis 2:2-3' },
      { question: 'CHRIST: Jesus said He is "Lord of the Sabbath." What does this mean?', scripture: 'Mark 2:28' },
      { question: 'PERSONAL: How is Sabbath rest a picture of salvation rest?', scripture: 'Hebrews 4:9-10' },
      { question: 'CHURCH: What role has Sabbath played in church history, especially during the 1260 years?' },
      { question: 'HEAVEN FUTURE: Will Sabbath be kept in eternity?', scripture: 'Isaiah 66:22-23' },
      { question: 'HEAVEN PAST: God rested on Sabbath in Eden. What does this tell us about heaven BEFORE sin?' }
    ],
    keyInsight: 'Sabbath spans all dimensions: Eden creation (literal), Christ\'s lordship (Christ), rest from works-righteousness (personal), seal vs. mark (church), eternal worship (future), God\'s original order (past). It\'s a multi-dimensional truth!',
    practiceActivity: 'How do you experience each dimension of Sabbath? Write a paragraph on each.',
    relatedPrinciples: ['Creation', 'Rest', 'Seal of God', 'Eternal Worship']
  },

  // Day of Atonement Deep
  {
    id: 'deep-atonement',
    title: 'The Day of Atonement: Then and Now',
    level: 'deep',
    palacePrinciple: 'Sanctuary Pattern Applied',
    principleDescription: 'The Day of Atonement is being fulfilled NOW — understanding its significance is vital.',
    room: 'sanctuary',
    introduction: 'Since 1844, the heavenly Day of Atonement has been in progress. What does this mean for us living in this time?',
    focusScripture: 'Leviticus 16; Daniel 8:14; Hebrews 9:23-28',
    questions: [
      { question: 'What happened in the earthly sanctuary on the Day of Atonement?', hint: 'Cleansing of the sanctuary' },
      { question: 'What were the people to do while the high priest was in the Most Holy?', scripture: 'Leviticus 16:29-31' },
      { question: 'When did Daniel 8:14\'s 2300 days end?', hint: '1844' },
      { question: 'If the judgment began in 1844, what should be our response?', scripture: 'Revelation 14:7' },
      { question: 'How does the scapegoat (Azazel) fit into the end-time picture?', hint: 'Leviticus 16:20-22' }
    ],
    keyInsight: 'We are living in the antitypical Day of Atonement! The judgment began in 1844, Christ is in the Most Holy Place, our sins are being reviewed, and we should be "afflicting our souls" (deep heart-searching). The scapegoat (Satan) will bear the blame after the Millennium.',
    practiceActivity: 'Read Leviticus 16 as if it\'s describing what\'s happening in heaven RIGHT NOW. What is Christ doing? What should YOU be doing?',
    relatedPrinciples: ['1844', 'Investigative Judgment', 'Sanctuary Cleansing', 'Close of Probation']
  },

  // The Two Witnesses
  {
    id: 'deep-two-witnesses',
    title: 'The Two Witnesses of Revelation',
    level: 'deep',
    palacePrinciple: 'Prophetic Pattern',
    principleDescription: 'Revelation\'s two witnesses have prophetic and historical significance.',
    room: 'pr',
    introduction: 'Revelation 11 describes two witnesses who prophesy, are killed, and rise again. Who are they? What does their story mean?',
    focusScripture: 'Revelation 11:1-13; Zechariah 4',
    questions: [
      { question: 'The two witnesses are called "two olive trees" and "two candlesticks." What does Zechariah 4 say about olive trees?', scripture: 'Zechariah 4:2-6' },
      { question: 'They prophesy 1260 days in sackcloth. What period is this?', hint: '538-1798 AD' },
      { question: 'They have power to bring plagues. What two OT prophets did similar things?', hint: 'Moses and Elijah' },
      { question: 'They are killed in "the great city... where also our Lord was crucified" (Rev 11:8). Where is this spiritually?', hint: 'Not literal Jerusalem' },
      { question: 'After 3.5 days, they rise. What historical event might this refer to?', hint: 'French Revolution era' }
    ],
    keyInsight: 'The two witnesses = Old and New Testaments (Word of God). They prophesied "in sackcloth" during papal supremacy (1260 years). The French Revolution attempted to kill the Bible (1793-1797 = ~3.5 years), but Scripture rose again stronger than ever!',
    practiceActivity: 'Research the French Revolution\'s attack on the Bible. How did Scripture "rise again"?',
    relatedPrinciples: ['Word of God', '1260 Days', 'French Revolution', 'Scripture Vindicated']
  },

  // Chiastic Structure
  {
    id: 'deep-chiasm',
    title: 'Chiastic Patterns in Scripture',
    level: 'deep',
    palacePrinciple: 'Literary Structures',
    principleDescription: 'Chiasm is a Hebrew literary pattern where ideas mirror each other (A-B-C-B\'-A\').',
    room: 'studies',
    introduction: 'Ancient Hebrew writers used chiasm (X-pattern) to structure their work. The center of the chiasm is the main point. This unlocks Scripture!',
    focusScripture: 'Genesis 6-9; Psalm 67',
    questions: [
      { question: 'In a chiasm, where is the most important point?', hint: 'The center' },
      { question: 'The flood narrative (Genesis 6-9) is a chiasm. What\'s at the center?', hint: 'Genesis 8:1 — "God remembered Noah"' },
      { question: 'Psalm 67 has 7 verses. Verse 4 is the center. Read it — what\'s the main point?', scripture: 'Psalm 67:4' },
      { question: 'If Revelation is structured chiastically, where would the most important message be?' },
      { question: 'How does knowing about chiasm change how you find the "main point" of a passage?' }
    ],
    keyInsight: 'Hebrews thought differently than Greeks. In chiasm, the MIDDLE is the key, not the end. The flood story\'s center is "God remembered" — covenant faithfulness! Understanding structure reveals meaning.',
    practiceActivity: 'Look up the chiastic structure of Genesis 6-9 online. Can you find other chiasms in Scripture?',
    relatedPrinciples: ['Hebrew Thought', 'Literary Structure', 'Biblical Interpretation']
  },

  // The Remnant Through History
  {
    id: 'deep-remnant-history',
    title: 'The Remnant Through Ages',
    level: 'deep',
    palacePrinciple: 'Historic Pattern',
    principleDescription: 'God has always had a remnant — tracing this pattern reveals our identity.',
    room: 'studies',
    introduction: 'In every generation, a faithful remnant preserved truth. Understanding this pattern helps us understand who we are today.',
    focusScripture: 'Romans 11:1-5; Revelation 12:17',
    questions: [
      { question: 'In Elijah\'s day, how many had not bowed to Baal?', scripture: '1 Kings 19:18' },
      { question: 'Paul applies this to his day. Who was the remnant then?', scripture: 'Romans 11:5' },
      { question: 'What two characteristics identify the end-time remnant?', scripture: 'Revelation 12:17' },
      { question: 'During the 1260 years, who was the remnant?', hint: 'Waldensians, etc.' },
      { question: 'How does being a "remnant" change how we view our mission?' }
    ],
    keyInsight: '7,000 in Elijah\'s day → Jewish believers in Paul\'s day → Waldensians during papal supremacy → End-time remnant keeping commandments and having Jesus\' testimony. The remnant is always small but preserves truth for the next generation!',
    practiceActivity: 'Research the Waldensians. How did they preserve Scripture during the Dark Ages?',
    relatedPrinciples: ['Remnant Church', 'Preserving Truth', 'Cloud of Witnesses']
  },

  // The Image of the Beast
  {
    id: 'deep-image-beast',
    title: 'The Image to the Beast',
    level: 'deep',
    palacePrinciple: 'End-Time Pattern',
    principleDescription: 'Understanding the "image of the beast" requires understanding church-state relations.',
    room: 'studies',
    introduction: 'Revelation 13 describes an "image to the beast." This is one of the most important end-time prophecies to understand.',
    focusScripture: 'Revelation 13:11-18',
    questions: [
      { question: 'The first beast (Rev 13:1-10) represents what power?', hint: 'Papal Rome' },
      { question: 'The second beast rises from the "earth" and has "two horns like a lamb." What nation fits?', hint: 'A Protestant nation, rises after 1798, from sparsely populated area' },
      { question: 'What made the first beast a "beast" (oppressive)?', hint: 'Union of church and state' },
      { question: 'If the second beast makes an "image" (copy) of the first, what would that involve?' },
      { question: 'How could this be forming today?' }
    ],
    keyInsight: 'The first beast = Papacy (church-state union). The second beast = USA (Protestant, two-horned). The "image" = when America creates a similar church-state union, enforcing religious observance by law. This is forming now!',
    practiceActivity: 'Watch for signs of religious legislation in America. How might church-state union develop?',
    relatedPrinciples: ['Sunday Law', 'Religious Liberty', 'Mark of the Beast', 'Final Crisis']
  },

  // Pearl of Great Price Six Dimensions
  {
    id: 'deep-pearl',
    title: 'The Pearl of Great Price — Six Dimensions',
    level: 'deep',
    palacePrinciple: 'Six Dimensions Applied',
    principleDescription: 'Jesus\' parables have profound multi-dimensional meaning.',
    room: 'studies',
    introduction: 'The parable of the Pearl of Great Price is usually applied one way. But Phototheology opens it up in all six dimensions!',
    focusScripture: 'Matthew 13:45-46',
    questions: [
      { question: 'LITERAL: In the surface story, who is the merchant and what is the pearl?' },
      { question: 'CHRIST: What if Jesus is the merchant? What does He give up to obtain the pearl?', scripture: 'Philippians 2:5-8' },
      { question: 'PERSONAL: We usually think WE are the merchant and Jesus is the pearl. How does this work?' },
      { question: 'CHURCH: Could the pearl represent the church Jesus purchased?', scripture: 'Acts 20:28' },
      { question: 'HEAVEN: What is the "pearl" in the New Jerusalem?', scripture: 'Revelation 21:21' },
      { question: 'Which interpretation captures the gospel better — us seeking Christ, or Christ seeking us?' }
    ],
    keyInsight: 'Usually we\'re told WE seek the pearl (Christ). But the gospel is that CHRIST gave up everything to purchase US (the pearl)! Both are true, but the Christ-dimension captures grace. We are the pearl He died to obtain!',
    practiceActivity: 'Meditate on Christ as the merchant. What did He "sell" to purchase you?',
    relatedPrinciples: ['Gospel Grace', 'Parables', 'Multi-dimensional Study', 'Christ\'s Sacrifice']
  }
];

// ============================================
// STUDY LIBRARY EXPORT
// ============================================

// Lazy initialization to avoid bundler issues with large arrays
let _allStudies: DailyStudy[] | null = null;

const getAllStudies = (): DailyStudy[] => {
  if (_allStudies === null) {
    _allStudies = [...easyStudies, ...intermediateStudies, ...deepStudies];
  }
  return _allStudies;
};

// Export for direct access (uses lazy initialization)
export const allStudies = {
  get length() { return getAllStudies().length; },
  filter: (fn: (study: DailyStudy) => boolean) => getAllStudies().filter(fn),
  find: (fn: (study: DailyStudy) => boolean) => getAllStudies().find(fn),
  map: <T>(fn: (study: DailyStudy) => T) => getAllStudies().map(fn),
  forEach: (fn: (study: DailyStudy) => void) => getAllStudies().forEach(fn),
  [Symbol.iterator]: () => getAllStudies()[Symbol.iterator](),
};

export const getStudiesByLevel = (level: StudyLevel): DailyStudy[] => {
  return getAllStudies().filter(study => study.level === level);
};

export const getStudyById = (id: string): DailyStudy | undefined => {
  return getAllStudies().find(study => study.id === id);
};

export const getStudyByPrinciple = (principle: string): DailyStudy[] => {
  return getAllStudies().filter(study =>
    study.palacePrinciple.toLowerCase().includes(principle.toLowerCase())
  );
};

export const getRandomStudy = (level?: StudyLevel): DailyStudy => {
  const pool = level ? getStudiesByLevel(level) : getAllStudies();
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getTodaysStudy = (level: StudyLevel): DailyStudy => {
  // Use the current date to deterministically pick a study
  // This ensures the same study appears all day but changes the next day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const levelStudies = getStudiesByLevel(level);
  const index = dayOfYear % levelStudies.length;
  return levelStudies[index];
};

// Study counts - computed lazily to avoid initialization issues
export const getStudyCounts = () => ({
  easy: easyStudies.length,
  intermediate: intermediateStudies.length,
  deep: deepStudies.length,
  total: getAllStudies().length
});

// For backwards compatibility
export const studyCounts = {
  get easy() { return easyStudies.length; },
  get intermediate() { return intermediateStudies.length; },
  get deep() { return deepStudies.length; },
  get total() { return getAllStudies().length; }
};
