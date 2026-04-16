import type { CharacterProfile } from "./biblicalCharacterProfiles";

export const characterBatch3: CharacterProfile[] = [
  // 1. Zechariah (priest, father of John)
  {
    id: "zechariah-priest",
    name: "Zechariah",
    meaning: "The LORD remembers",
    emoji: "🕯️",
    role: "Priest and father of John the Baptist",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 1:5-25", "Luke 1:57-80"],
    archetypes: ["Priest", "Patriarch"],
    dna: { faith: 6, humility: 7, courage: 5, wisdom: 7, compassion: 7, fear: 5, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Priest",
      strength: "Faithful service over decades",
      weakness: "Doubt in the face of the miraculous",
      mindset: "I serve God faithfully, but can He really do the impossible?",
      keyLesson: "Long obedience does not immunize us from moments of doubt.",
      keyVerse: "Do not be afraid, Zechariah; your prayer has been heard.",
      keyVerseRef: "Luke 1:13"
    },
    storyArc: "An aged priest who served faithfully for decades receives an angelic announcement of a miraculous son, doubts the promise, is struck mute, and ultimately sings one of Scripture's greatest prophecies.",
    therapyView: {
      drivingFears: ["Fear of unfulfilled longing", "Fear that God has forgotten him"],
      coreMotivations: ["Faithfulness to God's law", "Desire for a child", "Priestly duty"],
      relationalStyle: "Steady and dutiful but internally discouraged after years of unanswered prayer",
      blindSpots: ["Allowed disappointment to erode expectation", "Measured God's power by his own limitations"],
      healingMoments: ["The birth of John", "His tongue loosed to prophesy the Benedictus"]
    },
    strengths: ["Lifelong faithfulness", "Obedience to the Law", "Prophetic gifting when restored"],
    weaknesses: ["Doubt despite angelic visitation", "Measuring God by natural possibility"],
    journey: [
      { phase: "Calling", description: "Chosen by lot to burn incense in the temple—a once-in-a-lifetime honor." },
      { phase: "Testing", description: "Angel Gabriel appears and announces a miraculous son; Zechariah asks for proof." },
      { phase: "Failure", description: "Struck mute for nine months as a sign of his unbelief." },
      { phase: "Refinement", description: "Lives in silence, watching God's promise unfold in Elizabeth's pregnancy." },
      { phase: "Legacy", description: "Speaks again at John's naming and prophesies the Benedictus (Luke 1:67-79)." }
    ],
    relationships: [
      { name: "Elizabeth", role: "Wife" },
      { name: "John the Baptist", role: "Son" },
      { name: "Gabriel", role: "Angelic messenger" },
      { name: "Mary", role: "Relative by marriage" }
    ],
    lessonsAndReflection: [
      "Faithful routine does not always prevent doubt.",
      "God's silence (muteness) can be a discipline that deepens faith.",
      "What we cannot speak, God can still fulfill."
    ],
    relatedCharacters: ["elizabeth", "john-the-baptist", "abraham", "sarah"],
    situations: [
      {
        id: "zechariah-priest-doubt",
        title: "Doubt at the Altar",
        category: "Faith Testing",
        reference: "Luke 1:11-20",
        keyVerse: "How can I be sure of this? I am an old man and my wife is well along in years. (Luke 1:18)",
        situation: "While burning incense in the Holy Place, the angel Gabriel appears and promises Zechariah a son.",
        pressure: "Decades of unanswered prayer for a child have worn down his expectation.",
        innerBattle: "Do I trust the word of an angel, or do I trust what biology and experience tell me?",
        response: "He asks for a sign, questioning the promise based on his and Elizabeth's old age.",
        outcome: "Gabriel strikes him mute until the promise is fulfilled—a discipline and a sign.",
        lesson: "God's delays are not God's denials; doubt in the moment does not cancel the promise.",
        traitRevealed: "Doubt born from prolonged disappointment",
        spiritualPrinciple: "God answers prayer on His timetable, not ours.",
        reflectionQuestions: [
          "Have I stopped expecting God to answer prayers I've prayed for years?",
          "How do I respond when God's promise seems too good to be true?"
        ],
        dnaSnapshot: { faith: 4, fear: 6 }
      }
    ]
  },

  // 2. Elizabeth
  {
    id: "elizabeth",
    name: "Elizabeth",
    meaning: "God is my oath",
    emoji: "👶",
    role: "Wife of Zechariah, mother of John the Baptist",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 1:5-7", "Luke 1:24-25", "Luke 1:39-45", "Luke 1:57-60"],
    archetypes: ["Matriarch", "Servant"],
    dna: { faith: 9, humility: 9, courage: 6, wisdom: 8, compassion: 9, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Grace under prolonged suffering",
      weakness: "Susceptibility to social shame",
      mindset: "God has remembered me and taken away my disgrace.",
      keyLesson: "Faithfulness in obscurity prepares us for divine purpose.",
      keyVerse: "The Lord has done this for me. He has shown his favor and taken away my disgrace.",
      keyVerseRef: "Luke 1:25"
    },
    storyArc: "A righteous woman who bore the stigma of barrenness for decades receives a miraculous pregnancy in old age and becomes the first person to recognize Mary's unborn child as the Messiah.",
    therapyView: {
      drivingFears: ["Social disgrace of barrenness", "Fear of being forgotten by God"],
      coreMotivations: ["Walking blamelessly before God", "Desire for motherhood", "Faithfulness to covenant"],
      relationalStyle: "Warm, affirming, and prophetically encouraging",
      blindSpots: ["Years of internalizing cultural shame around barrenness"],
      healingMoments: ["Conceiving John", "Mary's visit and the baby leaping in her womb", "Naming John against family tradition"]
    },
    strengths: ["Unwavering righteousness", "Prophetic sensitivity", "Humility before Mary"],
    weaknesses: ["Carried shame of barrenness for decades"],
    journey: [
      { phase: "Calling", description: "Called righteous and blameless alongside Zechariah." },
      { phase: "Testing", description: "Endured decades of barrenness and social stigma." },
      { phase: "Refinement", description: "Secluded herself for five months after conceiving, processing the miracle." },
      { phase: "Legacy", description: "Recognized Mary as the mother of the Lord and insisted on naming her son John." }
    ],
    relationships: [
      { name: "Zechariah", role: "Husband" },
      { name: "John the Baptist", role: "Son" },
      { name: "Mary", role: "Relative and fellow miracle-mother" }
    ],
    lessonsAndReflection: [
      "Barrenness is not a verdict—it can be a prelude to extraordinary purpose.",
      "True humility recognizes God's work in others even when He is blessing you.",
      "Faithfulness in suffering qualifies us for moments of great joy."
    ],
    relatedCharacters: ["zechariah-priest", "john-the-baptist", "mary-mother-of-jesus", "sarah", "hannah"],
    situations: [
      {
        id: "elizabeth-barrenness",
        title: "Decades of Barrenness",
        category: "Waiting",
        reference: "Luke 1:5-7, 24-25",
        keyVerse: "The Lord has done this for me. In these days he has shown his favor and taken away my disgrace among the people. (Luke 1:25)",
        situation: "Elizabeth and Zechariah are righteous before God, yet she remains barren into old age.",
        pressure: "In her culture, barrenness was seen as divine disfavor; social shame was constant.",
        innerBattle: "Does my barrenness mean God has rejected me despite my faithfulness?",
        response: "She continued walking blamelessly before God without bitterness.",
        outcome: "God grants her a son who becomes the forerunner of the Messiah.",
        lesson: "Faithfulness in suffering is never wasted; God's timing carries greater purpose.",
        traitRevealed: "Enduring faith through prolonged disappointment",
        spiritualPrinciple: "What looks like divine neglect may be divine preparation.",
        reflectionQuestions: [
          "Can I remain faithful when my circumstances suggest God has forgotten me?",
          "How do I handle cultural pressure when God's timing differs from expectations?"
        ],
        dnaSnapshot: { faith: 9, humility: 9, fear: 3 }
      }
    ]
  },

  // 3. John the Baptist
  {
    id: "john-the-baptist",
    name: "John the Baptist",
    meaning: "God is gracious",
    emoji: "🦗",
    role: "Prophet and forerunner of Jesus Christ",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 1:13-17", "Matthew 3:1-12", "John 1:19-34", "John 3:25-30", "Matthew 11:2-6", "Matthew 14:1-12"],
    archetypes: ["Prophet", "Martyr"],
    dna: { faith: 9, humility: 8, courage: 10, wisdom: 8, compassion: 6, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Prophet",
      strength: "Fearless truth-telling",
      weakness: "Occasional doubt in prison",
      mindset: "He must increase; I must decrease.",
      keyLesson: "True greatness is measured by faithfulness to your assignment, not its size.",
      keyVerse: "He must become greater; I must become less.",
      keyVerseRef: "John 3:30"
    },
    storyArc: "A wilderness prophet whose very birth was miraculous announces the Messiah, baptizes Jesus, willingly decreases in influence, and is imprisoned and beheaded for confronting a king's sin.",
    therapyView: {
      drivingFears: ["Fear of failing his divine mission", "Fear that he misidentified the Messiah"],
      coreMotivations: ["Preparing the way for Christ", "Calling people to repentance", "Prophetic obedience"],
      relationalStyle: "Confrontational yet deeply purposeful; not interested in social approval",
      blindSpots: ["Could be harsh in delivery", "Struggled with doubt when circumstances contradicted expectations"],
      healingMoments: ["Seeing the Spirit descend on Jesus at baptism", "Jesus' affirmation: 'None greater born of women'"]
    },
    strengths: ["Fearless proclamation", "Total commitment", "Willingness to decrease", "Ascetic discipline"],
    weaknesses: ["Doubted from prison", "Abrasive delivery"],
    journey: [
      { phase: "Calling", description: "Prophesied before birth; filled with the Spirit in the womb." },
      { phase: "Testing", description: "Lived in the wilderness, called Israel to repentance, baptized Jesus." },
      { phase: "Refinement", description: "Willingly pointed his own disciples to Jesus and accepted his decreasing role." },
      { phase: "Failure", description: "Sent messengers from prison asking, 'Are you the one?'" },
      { phase: "Legacy", description: "Beheaded by Herod Antipas; Jesus called him the greatest born of women." }
    ],
    relationships: [
      { name: "Zechariah", role: "Father" },
      { name: "Elizabeth", role: "Mother" },
      { name: "Jesus", role: "The Messiah he proclaimed" },
      { name: "Herod Antipas", role: "Imprisoned and executed him" },
      { name: "Andrew", role: "Former disciple who followed Jesus" }
    ],
    lessonsAndReflection: [
      "Greatness is not about platform size but faithfulness to purpose.",
      "Even the strongest faith can waver in dark seasons.",
      "Decreasing so Christ increases is the ultimate mark of maturity."
    ],
    relatedCharacters: ["zechariah-priest", "elizabeth", "jesus", "herod-antipas", "elijah"],
    situations: [
      {
        id: "john-baptist-decrease",
        title: "He Must Increase",
        category: "Sacrifice",
        reference: "John 3:25-30",
        keyVerse: "He must become greater; I must become less. (John 3:30)",
        situation: "John's disciples report that Jesus is now baptizing and drawing larger crowds.",
        pressure: "His own followers are jealous and expect John to compete with Jesus.",
        innerBattle: "Will I cling to my influence or fulfill my purpose as the forerunner?",
        response: "He declares that Jesus is the bridegroom and he is merely the friend of the bridegroom, full of joy.",
        outcome: "His ministry decreases while Jesus' increases, exactly as God intended.",
        lesson: "The security to decrease comes from knowing your identity is in your calling, not your crowd.",
        traitRevealed: "Radical humility and mission clarity",
        spiritualPrinciple: "Fulfilling your purpose may mean joyfully stepping aside.",
        reflectionQuestions: [
          "Am I willing to decrease so that God's purposes can increase?",
          "Do I find my identity in my platform or in my obedience?"
        ],
        dnaSnapshot: { humility: 10, faith: 9, pride: 1 }
      },
      {
        id: "john-baptist-doubt-prison",
        title: "Doubt from the Dungeon",
        category: "Faith Testing",
        reference: "Matthew 11:2-6",
        keyVerse: "Are you the one who is to come, or should we expect someone else? (Matthew 11:3)",
        situation: "John is in Herod's prison and sends his disciples to ask Jesus if He is truly the Messiah.",
        pressure: "Imprisonment, isolation, and the Messiah's ministry not matching John's expectations of judgment.",
        innerBattle: "Did I devote my entire life to the wrong person? Why hasn't He delivered me?",
        response: "He honestly sends his doubt to Jesus rather than abandoning faith silently.",
        outcome: "Jesus affirms His messiahship through works and honors John as the greatest prophet.",
        lesson: "Bringing doubt to Jesus is an act of faith, not a sign of failure.",
        traitRevealed: "Honest vulnerability even in spiritual leadership",
        spiritualPrinciple: "Faith does not mean absence of doubt; it means bringing doubt to the right Person.",
        reflectionQuestions: [
          "Do I take my doubts to Jesus or let them silently erode my faith?",
          "Can I trust God's plan when it does not match my expectations?"
        ],
        dnaSnapshot: { faith: 6, fear: 5, courage: 7 }
      }
    ]
  },

  // 4. Nicodemus
  {
    id: "nicodemus",
    name: "Nicodemus",
    meaning: "Victory of the people",
    emoji: "🌙",
    role: "Pharisee and member of the Sanhedrin",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["John 3:1-21", "John 7:50-52", "John 19:38-42"],
    archetypes: ["Seeker", "Strategist"],
    dna: { faith: 6, humility: 6, courage: 5, wisdom: 8, compassion: 6, fear: 5, pride: 4, greed: 2 },
    quickCard: {
      archetype: "Seeker",
      strength: "Intellectual honesty that pursued truth despite risk",
      weakness: "Fear of public association with Jesus",
      mindset: "I know something is true, but can I afford to be seen believing it?",
      keyLesson: "Following Jesus often begins in secret and must eventually become public.",
      keyVerse: "For God so loved the world that he gave his one and only Son.",
      keyVerseRef: "John 3:16"
    },
    storyArc: "A respected Pharisee comes to Jesus by night with sincere questions, later defends Jesus cautiously before the Sanhedrin, and finally goes public by helping bury Jesus' body.",
    therapyView: {
      drivingFears: ["Loss of reputation", "Rejection by peers", "Being wrong about deeply held beliefs"],
      coreMotivations: ["Genuine pursuit of truth", "Desire to reconcile tradition with revelation", "Intellectual integrity"],
      relationalStyle: "Cautious and deliberate; values private inquiry over public declaration",
      blindSpots: ["Let fear of man delay full commitment", "Assumed intellectual mastery could grasp spiritual realities"],
      healingMoments: ["The 'born again' conversation with Jesus", "Publicly burying Jesus after the crucifixion"]
    },
    strengths: ["Intellectual curiosity", "Courage that grew over time", "Ultimate willingness to go public"],
    weaknesses: ["Initial secrecy", "Over-reliance on intellect", "Slowness to commit"],
    journey: [
      { phase: "Calling", description: "Drawn to Jesus by signs but came by night to avoid scrutiny." },
      { phase: "Resistance", description: "Struggled to understand spiritual rebirth through his theological framework." },
      { phase: "Testing", description: "Spoke up for Jesus before the Sanhedrin, risking his standing." },
      { phase: "Legacy", description: "Publicly identified with Jesus by helping Joseph of Arimathea bury His body." }
    ],
    relationships: [
      { name: "Jesus", role: "Teacher who revealed the new birth" },
      { name: "Joseph of Arimathea", role: "Fellow secret disciple who buried Jesus" },
      { name: "The Sanhedrin", role: "Peers he risked losing" }
    ],
    lessonsAndReflection: [
      "It is better to come to Jesus in the dark than not to come at all.",
      "Faith can start cautiously and grow bold over time.",
      "Intellectual understanding must yield to spiritual rebirth."
    ],
    relatedCharacters: ["jesus", "joseph-of-arimathea", "paul"],
    situations: [
      {
        id: "nicodemus-night-visit",
        title: "Coming by Night",
        category: "Fear",
        reference: "John 3:1-21",
        keyVerse: "No one can see the kingdom of God unless they are born again. (John 3:3)",
        situation: "Nicodemus, a Pharisee and Sanhedrin member, visits Jesus secretly at night.",
        pressure: "His position and reputation would be destroyed if peers learned he was seeking Jesus.",
        innerBattle: "My mind tells me this man is from God, but my career tells me to keep my distance.",
        response: "He comes with genuine questions but under cover of darkness.",
        outcome: "Jesus reveals the necessity of spiritual rebirth; Nicodemus begins a slow journey toward faith.",
        lesson: "God honors sincere seeking even when it starts in fear.",
        traitRevealed: "Intellectual honesty at war with social fear",
        spiritualPrinciple: "Spiritual transformation begins when we bring our questions to Jesus, however timidly.",
        reflectionQuestions: [
          "What truths am I only willing to explore in private?",
          "Is fear of others' opinions keeping me from deeper commitment to Christ?"
        ],
        dnaSnapshot: { faith: 5, fear: 7, wisdom: 8 }
      },
      {
        id: "nicodemus-burial",
        title: "Going Public at the Cross",
        category: "Sacrifice",
        reference: "John 19:38-42",
        situation: "After the crucifixion, Nicodemus brings 75 pounds of myrrh and aloes to prepare Jesus' body.",
        pressure: "Publicly associating with a crucified criminal would end his career and standing.",
        innerBattle: "I hid my faith in the dark; can I declare it now in the daylight of His death?",
        response: "He publicly assists Joseph of Arimathea in burying Jesus, identifying himself with Christ.",
        outcome: "His secret faith becomes public at the moment of greatest risk.",
        lesson: "Sometimes the cross is what finally brings our hidden faith into the open.",
        traitRevealed: "Courage that grew through conviction",
        spiritualPrinciple: "The cross transforms secret disciples into public ones.",
        reflectionQuestions: [
          "What event or conviction could move me from private faith to public witness?",
          "Am I waiting too long to publicly identify with Jesus?"
        ],
        dnaSnapshot: { courage: 8, faith: 8, fear: 3 }
      }
    ]
  },

  // 5. Zacchaeus
  {
    id: "zacchaeus",
    name: "Zacchaeus",
    meaning: "Pure, innocent",
    emoji: "🌳",
    role: "Chief tax collector in Jericho",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 19:1-10"],
    archetypes: ["Redeemed", "Seeker"],
    dna: { faith: 7, humility: 7, courage: 6, wisdom: 5, compassion: 5, fear: 4, pride: 4, greed: 3 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Immediate radical repentance",
      weakness: "Years of exploiting others for profit",
      mindset: "I climbed a tree because something in me knew my wealth was not enough.",
      keyLesson: "Genuine encounter with Jesus produces immediate, tangible life change.",
      keyVerse: "For the Son of Man came to seek and to save the lost.",
      keyVerseRef: "Luke 19:10"
    },
    storyArc: "A despised, wealthy tax collector climbs a tree to see Jesus, is called down by name, hosts Jesus in his home, and immediately commits to radical restitution.",
    therapyView: {
      drivingFears: ["Insignificance masked by wealth", "Being permanently defined by his sins"],
      coreMotivations: ["Desire for acceptance", "Longing for meaning beyond money", "Need for validation"],
      relationalStyle: "Compensated for relational rejection with financial accumulation",
      blindSpots: ["Used wealth to fill relational voids", "Exploited his own people for personal gain"],
      healingMoments: ["Jesus calling him by name and choosing his house", "The act of giving half his possessions to the poor"]
    },
    strengths: ["Resourcefulness", "Immediate repentance", "Radical generosity after conversion"],
    weaknesses: ["Greed", "Exploitation of his community", "Status-seeking"],
    journey: [
      { phase: "Calling", description: "Curiosity about Jesus drove him to climb a sycamore tree." },
      { phase: "Testing", description: "Jesus singled him out publicly—would he respond or hide?" },
      { phase: "Refinement", description: "Immediately pledged half his goods to the poor and fourfold restitution." },
      { phase: "Legacy", description: "Jesus declared salvation had come to his house." }
    ],
    relationships: [
      { name: "Jesus", role: "Savior who sought him out" },
      { name: "The crowd", role: "Critics who judged Jesus for visiting a sinner" }
    ],
    lessonsAndReflection: [
      "Jesus seeks those whom society writes off.",
      "Real repentance is demonstrated by restitution, not just words.",
      "No amount of wealth can satisfy what only grace provides."
    ],
    relatedCharacters: ["matthew-levi", "jesus", "rich-young-ruler"],
    situations: [
      {
        id: "zacchaeus-tree",
        title: "Up a Tree and Called by Name",
        category: "Calling",
        reference: "Luke 19:1-10",
        keyVerse: "Zacchaeus, come down immediately. I must stay at your house today. (Luke 19:5)",
        situation: "Zacchaeus, short in stature and despised as a chief tax collector, climbs a tree to see Jesus pass through Jericho.",
        pressure: "Public humiliation of being seen in a tree; communal hatred for his profession.",
        innerBattle: "Am I too far gone for someone like Jesus to notice me, or is there still hope?",
        response: "He came down at once and welcomed Jesus gladly, then pledged radical restitution.",
        outcome: "Jesus declares, 'Today salvation has come to this house.'",
        lesson: "No social stigma or sinful past can prevent Jesus from pursuing a willing heart.",
        traitRevealed: "Desperate seeking that led to radical transformation",
        spiritualPrinciple: "Jesus does not wait for us to become worthy; He calls us where we are.",
        reflectionQuestions: [
          "What 'tree' have I climbed to try to see Jesus from a safe distance?",
          "Is my repentance producing tangible change in how I treat others?"
        ],
        dnaSnapshot: { faith: 7, humility: 8, greed: 2 }
      }
    ]
  },

  // 6. The Samaritan Woman
  {
    id: "samaritan-woman",
    name: "The Samaritan Woman",
    meaning: "Unnamed; represents the outcast who encounters grace",
    emoji: "🫗",
    role: "Samaritan woman at Jacob's well",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["John 4:1-42"],
    archetypes: ["Redeemed", "Missionary"],
    dna: { faith: 7, humility: 6, courage: 7, wisdom: 5, compassion: 6, fear: 4, pride: 4, greed: 2 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Became an evangelist to her entire town",
      weakness: "A history of broken relationships",
      mindset: "He told me everything I ever did—and still offered me living water.",
      keyLesson: "Our worst story can become our greatest testimony.",
      keyVerse: "Whoever drinks the water I give them will never thirst.",
      keyVerseRef: "John 4:14"
    },
    storyArc: "A Samaritan woman with five failed marriages encounters Jesus at a well, engages in the deepest theological conversation in the Gospels, and becomes the first evangelist to a non-Jewish community.",
    therapyView: {
      drivingFears: ["Rejection", "Exposure of her past", "Being permanently defined by failures"],
      coreMotivations: ["Desire for love and belonging", "Spiritual hunger beneath relational brokenness"],
      relationalStyle: "Guarded and deflective initially, but transparent once trust is established",
      blindSpots: ["Sought fulfillment in relationships rather than in God", "Used theological debate to deflect personal conviction"],
      healingMoments: ["Jesus knowing her past without condemning her", "Being entrusted as a messenger to her own city"]
    },
    strengths: ["Courage to engage Jesus in dialogue", "Immediate evangelism", "Transparency about her past"],
    weaknesses: ["Serial relational brokenness", "Deflection through theological argument"],
    journey: [
      { phase: "Calling", description: "Met Jesus at Jacob's well during the heat of the day, avoiding the other women." },
      { phase: "Resistance", description: "Deflected with cultural and theological questions." },
      { phase: "Testing", description: "Jesus exposed her past—five husbands and a current unmarried partner." },
      { phase: "Refinement", description: "Recognized Jesus as prophet, then Messiah." },
      { phase: "Legacy", description: "Ran to her city and became its first evangelist; many believed because of her testimony." }
    ],
    relationships: [
      { name: "Jesus", role: "The one who offered living water" },
      { name: "Her city", role: "Community she evangelized" }
    ],
    lessonsAndReflection: [
      "Jesus crosses every barrier—gender, ethnicity, morality—to reach the thirsty.",
      "The person most ashamed of their past can become the most powerful witness.",
      "True worship is not about location but spirit and truth."
    ],
    relatedCharacters: ["jesus", "woman-caught-in-adultery"],
    situations: [
      {
        id: "samaritan-woman-well",
        title: "Living Water at the Well",
        category: "Restoration",
        reference: "John 4:1-26",
        keyVerse: "Everyone who drinks this water will be thirsty again, but whoever drinks the water I give them will never thirst. (John 4:13-14)",
        situation: "A Samaritan woman comes to draw water at noon—avoiding the other women—and encounters Jesus.",
        pressure: "Social shame from her past, ethnic tension between Jews and Samaritans.",
        innerBattle: "Can I trust this Jewish stranger, and can I face what He might reveal about me?",
        response: "She engages Jesus in conversation, is confronted with truth about her past, and recognizes Him as the Messiah.",
        outcome: "She leaves her water jar and evangelizes her entire town.",
        lesson: "Encountering the truth about who Jesus is transforms our shame into testimony.",
        traitRevealed: "Hunger for truth beneath layers of brokenness",
        spiritualPrinciple: "Jesus meets us at our point of need and turns our past into purpose.",
        reflectionQuestions: [
          "What 'water jar' am I still carrying that Jesus wants me to leave behind?",
          "Am I willing to let Jesus expose my past in order to give me a future?"
        ],
        dnaSnapshot: { faith: 7, courage: 7, humility: 6 }
      }
    ]
  },

  // 7. Lazarus
  {
    id: "lazarus",
    name: "Lazarus",
    meaning: "God is my helper",
    emoji: "🪦",
    role: "Brother of Mary and Martha, raised from the dead",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["John 11:1-44", "John 12:1-2", "John 12:9-11"],
    archetypes: ["Survivor", "Servant"],
    dna: { faith: 8, humility: 8, courage: 6, wisdom: 6, compassion: 7, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Survivor",
      strength: "Living testimony of Christ's resurrection power",
      weakness: "Passive role—little recorded speech or initiative",
      mindset: "My life is a living sermon that Jesus is Lord over death.",
      keyLesson: "Sometimes God's greatest work requires waiting through what feels like abandonment.",
      keyVerse: "I am the resurrection and the life. The one who believes in me will live, even though they die.",
      keyVerseRef: "John 11:25"
    },
    storyArc: "A beloved friend of Jesus falls ill, dies, and is buried for four days. Jesus weeps, commands the stone rolled away, and calls Lazarus out of the grave—making him a living testimony that drew many to faith and made him a target of the religious leaders.",
    therapyView: {
      drivingFears: ["Fear of death (resolved through experience)", "Fear of being targeted"],
      coreMotivations: ["Devotion to Jesus", "Living as a witness"],
      relationalStyle: "Quietly present; his very existence spoke louder than words",
      blindSpots: ["Scripture records no words from Lazarus—his story is told through others"],
      healingMoments: ["Hearing Jesus' voice call him out of the tomb", "Being unbound by the community"]
    },
    strengths: ["Faithfulness to Jesus", "Living testimony", "Close friendship with Christ"],
    weaknesses: ["No recorded initiative or speech"],
    journey: [
      { phase: "Calling", description: "Known as one whom Jesus loved deeply." },
      { phase: "Testing", description: "Fell ill and died while Jesus deliberately delayed." },
      { phase: "Refinement", description: "Raised from the dead after four days in the tomb." },
      { phase: "Legacy", description: "His resurrection drew many to faith and made him a target of the chief priests." }
    ],
    relationships: [
      { name: "Jesus", role: "Dear friend who raised him" },
      { name: "Mary of Bethany", role: "Sister" },
      { name: "Martha", role: "Sister" },
      { name: "Chief Priests", role: "Plotted to kill him because of his testimony" }
    ],
    lessonsAndReflection: [
      "God's delays are purposeful, not indifferent.",
      "Our greatest testimony may come from our deepest suffering.",
      "Jesus weeps with us even when He plans to deliver us."
    ],
    relatedCharacters: ["jesus", "mary-of-bethany", "martha"],
    situations: [
      {
        id: "lazarus-raised",
        title: "Called Out of the Grave",
        category: "Restoration",
        reference: "John 11:1-44",
        keyVerse: "Lazarus, come out! (John 11:43)",
        situation: "Lazarus falls ill, and his sisters send word to Jesus, but Jesus delays two days before coming.",
        pressure: "Death itself; Jesus' apparent absence during the crisis.",
        innerBattle: "From his sisters' perspective: Why didn't Jesus come in time?",
        response: "Lazarus himself has no recorded response—he was dead. Jesus commanded him to come forth.",
        outcome: "He walks out of the tomb still wrapped in grave clothes, alive after four days.",
        lesson: "What looks like God's absence may be the setup for God's greatest demonstration of power.",
        traitRevealed: "God's sovereign timing over death",
        spiritualPrinciple: "Jesus is Lord over the final enemy; no situation is beyond His reach.",
        reflectionQuestions: [
          "What area of my life feels dead that Jesus might still be planning to resurrect?",
          "Can I trust God's timing even when He seems too late?"
        ],
        dnaSnapshot: { faith: 8, fear: 2 }
      }
    ]
  },

  // 8. Thomas
  {
    id: "thomas",
    name: "Thomas",
    meaning: "Twin",
    emoji: "🤚",
    role: "Apostle known as Didymus (the Twin)",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["John 11:16", "John 14:5", "John 20:24-29"],
    archetypes: ["Seeker", "Missionary"],
    dna: { faith: 7, humility: 6, courage: 7, wisdom: 7, compassion: 5, fear: 4, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "Honest doubt that led to profound confession",
      weakness: "Required physical proof to believe",
      mindset: "I will not believe unless I see and touch the evidence myself.",
      keyLesson: "Honest doubt brought to Jesus leads to deeper faith than comfortable assumption.",
      keyVerse: "My Lord and my God!",
      keyVerseRef: "John 20:28"
    },
    storyArc: "A loyal but questioning disciple who was willing to die with Jesus, demanded physical proof of the resurrection, and upon encountering the risen Christ made the highest Christological confession in the Gospels.",
    therapyView: {
      drivingFears: ["Being deceived", "False hope after devastating loss", "Making a fool of himself"],
      coreMotivations: ["Pursuit of certainty", "Loyalty to Jesus", "Intellectual integrity"],
      relationalStyle: "Blunt and direct; asks the questions others are afraid to voice",
      blindSpots: ["Isolated himself from the community in grief", "Assumed only his type of evidence was valid"],
      healingMoments: ["Jesus appearing specifically for him", "The invitation to touch His wounds"]
    },
    strengths: ["Courageous loyalty", "Intellectual honesty", "Made the highest confession of Christ's deity"],
    weaknesses: ["Demanded empirical proof", "Isolated in grief", "Slow to trust others' testimony"],
    journey: [
      { phase: "Calling", description: "Called as one of the twelve apostles." },
      { phase: "Testing", description: "Said 'Let us also go, that we may die with him' before Lazarus' raising." },
      { phase: "Failure", description: "Refused to believe the other disciples' resurrection testimony." },
      { phase: "Refinement", description: "Encountered the risen Jesus and declared 'My Lord and my God!'" },
      { phase: "Legacy", description: "Tradition holds he brought the gospel to India." }
    ],
    relationships: [
      { name: "Jesus", role: "Lord and Master" },
      { name: "The other apostles", role: "Fellow disciples whose testimony he initially rejected" }
    ],
    lessonsAndReflection: [
      "Doubt is not the opposite of faith—unbelief is.",
      "Jesus is patient enough to meet us in our specific form of struggle.",
      "The deepest confessions often come from the deepest doubts."
    ],
    relatedCharacters: ["jesus", "peter", "john-apostle"],
    situations: [
      {
        id: "thomas-doubt",
        title: "Unless I See the Nail Marks",
        category: "Faith Testing",
        reference: "John 20:24-29",
        keyVerse: "Stop doubting and believe. (John 20:27)",
        situation: "Thomas was absent when the risen Jesus appeared to the other disciples and refuses to believe their report.",
        pressure: "Grief, disillusionment, and fear of false hope after witnessing the crucifixion.",
        innerBattle: "I saw Him die. How can I trust secondhand testimony about something so impossible?",
        response: "He demands to see and touch the nail marks and spear wound before believing.",
        outcome: "Jesus appears a week later, offers His wounds, and Thomas makes the supreme confession: 'My Lord and my God!'",
        lesson: "Jesus does not reject honest doubt but meets it with patient revelation.",
        traitRevealed: "Honest doubt that yielded to personal encounter",
        spiritualPrinciple: "Blessed are those who have not seen and yet have believed, but Jesus still meets doubters.",
        reflectionQuestions: [
          "What kind of evidence am I demanding before I will trust God?",
          "Have I isolated myself from community in my doubt?"
        ],
        dnaSnapshot: { faith: 5, courage: 6, fear: 5 }
      }
    ]
  },

  // 9. Matthew/Levi
  {
    id: "matthew-levi",
    name: "Matthew (Levi)",
    meaning: "Gift of God",
    emoji: "💰",
    role: "Tax collector turned apostle and Gospel writer",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 9:9-13", "Luke 5:27-32", "Mark 2:13-17"],
    archetypes: ["Redeemed", "Servant"],
    dna: { faith: 8, humility: 7, courage: 7, wisdom: 7, compassion: 7, fear: 3, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Immediate, total response to Jesus' call",
      weakness: "Past life of exploitation and greed",
      mindset: "He called me from the tax booth, and I left everything.",
      keyLesson: "No past is too corrupt for Jesus to redeem and repurpose.",
      keyVerse: "It is not the healthy who need a doctor, but the sick.",
      keyVerseRef: "Matthew 9:12"
    },
    storyArc: "A wealthy tax collector sitting at his booth hears two words from Jesus—'Follow me'—leaves everything behind, hosts a banquet introducing Jesus to other sinners, and ultimately writes the Gospel that bridges Old Testament prophecy to New Testament fulfillment.",
    therapyView: {
      drivingFears: ["Being defined forever by his sinful profession", "Rejection from respectable society"],
      coreMotivations: ["Desire for acceptance", "Need for significance beyond wealth", "Recording truth"],
      relationalStyle: "Transactional before conversion; community-building after",
      blindSpots: ["Used wealth to compensate for social rejection", "May have minimized the harm of his tax collecting"],
      healingMoments: ["Jesus choosing him publicly", "The banquet where Jesus defended associating with sinners"]
    },
    strengths: ["Decisiveness", "Literacy and record-keeping", "Bridge-building between sinners and Jesus"],
    weaknesses: ["Prior exploitation of his people", "Social isolation due to profession"],
    journey: [
      { phase: "Calling", description: "Jesus called him directly from his tax booth with two words: 'Follow me.'" },
      { phase: "Testing", description: "Had to leave a lucrative career with no possibility of return." },
      { phase: "Refinement", description: "Became one of the Twelve and used his skills for the kingdom." },
      { phase: "Legacy", description: "Authored the Gospel of Matthew, connecting Jesus to Old Testament prophecy." }
    ],
    relationships: [
      { name: "Jesus", role: "The one who called him" },
      { name: "Fellow tax collectors", role: "Former colleagues he introduced to Jesus" },
      { name: "The Twelve", role: "Fellow apostles" }
    ],
    lessonsAndReflection: [
      "Jesus calls people in the middle of their mess, not after they clean up.",
      "The skills we developed in our old life can serve God's new purpose.",
      "Salvation is not for the righteous but for those who know they need a doctor."
    ],
    relatedCharacters: ["jesus", "zacchaeus", "peter"],
    situations: [
      {
        id: "matthew-levi-call",
        title: "Follow Me from the Tax Booth",
        category: "Calling",
        reference: "Matthew 9:9-13",
        keyVerse: "Follow me. (Matthew 9:9)",
        situation: "Jesus sees Matthew sitting at the tax collector's booth and calls him to follow.",
        pressure: "Leaving guaranteed wealth for an uncertain itinerant life with a controversial rabbi.",
        innerBattle: "This is the first person who has looked at me and seen something other than a traitor. Do I risk everything?",
        response: "Matthew got up, left everything, and followed Jesus immediately.",
        outcome: "He hosted a great banquet, introducing Jesus to other tax collectors and sinners.",
        lesson: "When Jesus calls, the cost of following is always less than the cost of staying.",
        traitRevealed: "Decisive faith under social pressure",
        spiritualPrinciple: "Jesus calls the unqualified and qualifies the called.",
        reflectionQuestions: [
          "What 'tax booth' is Jesus calling me away from?",
          "Am I willing to leave security for significance?"
        ],
        dnaSnapshot: { faith: 8, courage: 8, greed: 1 }
      }
    ]
  },

  // 10. James (son of Zebedee)
  {
    id: "james-zebedee",
    name: "James (son of Zebedee)",
    meaning: "Supplanter",
    emoji: "⚡",
    role: "Apostle, brother of John, first apostle martyred",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Mark 1:19-20", "Mark 3:17", "Mark 10:35-45", "Acts 12:1-2", "Luke 9:54"],
    archetypes: ["Warrior", "Martyr"],
    dna: { faith: 8, humility: 5, courage: 9, wisdom: 5, compassion: 5, fear: 3, pride: 6, greed: 3 },
    quickCard: {
      archetype: "Warrior",
      strength: "Passionate zeal and ultimate sacrifice",
      weakness: "Ambition and a volatile temper",
      mindset: "I will drink the cup Christ drinks—even if it means death.",
      keyLesson: "Zeal must be refined by servanthood before it becomes true greatness.",
      keyVerse: "Can you drink the cup I drink?",
      keyVerseRef: "Mark 10:38"
    },
    storyArc: "A fiery fisherman nicknamed 'Son of Thunder,' part of Jesus' inner three, who asked to sit at Jesus' right hand, wanted to call fire on a Samaritan village, and ultimately became the first apostle to be martyred by the sword under Herod Agrippa.",
    therapyView: {
      drivingFears: ["Being overlooked", "Irrelevance in the kingdom"],
      coreMotivations: ["Desire for prominence", "Genuine devotion to Jesus", "Competitive drive"],
      relationalStyle: "Bold and assertive; led with passion rather than reflection",
      blindSpots: ["Confused ambition with devotion", "Wanted position before he understood the cost"],
      healingMoments: ["Jesus' gentle correction about servant leadership", "Drinking the cup of martyrdom"]
    },
    strengths: ["Boldness", "Willingness to sacrifice", "Part of the inner circle"],
    weaknesses: ["Ambition", "Temper (Son of Thunder)", "Desire for status"],
    journey: [
      { phase: "Calling", description: "Left fishing nets and his father to follow Jesus." },
      { phase: "Testing", description: "Wanted to call fire from heaven on a Samaritan village." },
      { phase: "Failure", description: "Asked for the highest seat in the kingdom—a power grab." },
      { phase: "Refinement", description: "Jesus taught him that greatness means being a servant of all." },
      { phase: "Legacy", description: "First apostle martyred—killed by Herod Agrippa's sword (Acts 12:2)." }
    ],
    relationships: [
      { name: "John", role: "Brother and fellow apostle" },
      { name: "Zebedee", role: "Father" },
      { name: "Jesus", role: "Lord who called and refined him" },
      { name: "Peter", role: "Fellow member of the inner three" }
    ],
    lessonsAndReflection: [
      "Zeal without humility becomes destructive ambition.",
      "Jesus refines our passion, not by removing it, but by redirecting it.",
      "The cup of Christ includes both glory and suffering."
    ],
    relatedCharacters: ["john-apostle", "peter", "jesus"],
    situations: [
      {
        id: "james-zebedee-ambition",
        title: "Asking for the Top Seat",
        category: "Power and Success",
        reference: "Mark 10:35-45",
        keyVerse: "Whoever wants to become great among you must be your servant. (Mark 10:43)",
        situation: "James and John ask Jesus for the seats at His right and left hand in the coming kingdom.",
        pressure: "Competition among the Twelve for position and recognition.",
        innerBattle: "I want to be great in the kingdom—is that wrong, or is it just misdirected?",
        response: "Jesus asks if they can drink His cup; they say yes. He teaches that greatness means servanthood.",
        outcome: "James would indeed drink the cup—he became the first apostle martyred.",
        lesson: "True greatness in God's kingdom is measured by willingness to serve and suffer, not by position.",
        traitRevealed: "Ambition that needed redirection toward sacrifice",
        spiritualPrinciple: "The path to the throne passes through the towel and the cross.",
        reflectionQuestions: [
          "Is my desire for influence motivated by service or status?",
          "Am I willing to drink the cup that comes with the calling I want?"
        ],
        dnaSnapshot: { pride: 7, courage: 8, humility: 4 }
      }
    ]
  },

  // 11. Judas (not Iscariot / Thaddaeus)
  {
    id: "judas-thaddaeus",
    name: "Judas (Thaddaeus)",
    meaning: "Praise",
    emoji: "❓",
    role: "Apostle, also called Thaddaeus or Lebbaeus",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["John 14:22", "Matthew 10:3", "Luke 6:16", "Acts 1:13"],
    archetypes: ["Servant", "Seeker"],
    dna: { faith: 7, humility: 8, courage: 6, wisdom: 6, compassion: 7, fear: 4, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Faithfulness in obscurity",
      weakness: "Limited understanding of Jesus' mission scope",
      mindset: "Why reveal yourself only to us and not to the whole world?",
      keyLesson: "Faithful service does not require fame or full understanding.",
      keyVerse: "Lord, why do you intend to show yourself to us and not to the world?",
      keyVerseRef: "John 14:22"
    },
    storyArc: "One of the lesser-known apostles who asked Jesus a sincere question at the Last Supper about why He would not reveal Himself publicly, and faithfully served in the early church.",
    therapyView: {
      drivingFears: ["Being confused with Judas Iscariot", "Insignificance among the Twelve"],
      coreMotivations: ["Genuine desire to understand Jesus' plan", "Faithful service"],
      relationalStyle: "Quiet and supportive; comfortable in the background",
      blindSpots: ["May have expected a political Messiah", "Struggled with the hiddenness of God's kingdom"],
      healingMoments: ["Jesus' personal answer at the Last Supper about the Father's love"]
    },
    strengths: ["Loyalty", "Willingness to ask honest questions", "Faithful obscurity"],
    weaknesses: ["Incomplete understanding", "Overshadowed by other disciples"],
    journey: [
      { phase: "Calling", description: "Chosen as one of the Twelve." },
      { phase: "Testing", description: "Served faithfully despite being one of the least known apostles." },
      { phase: "Legacy", description: "Tradition holds he spread the gospel to Mesopotamia and Persia." }
    ],
    relationships: [
      { name: "Jesus", role: "Lord" },
      { name: "The Twelve", role: "Fellow apostles" },
      { name: "James son of Alphaeus", role: "Possibly related" }
    ],
    lessonsAndReflection: [
      "Not everyone is called to be Peter or John, but every role matters.",
      "Honest questions are welcome in God's presence.",
      "Faithfulness in obscurity is still faithfulness."
    ],
    relatedCharacters: ["jesus", "peter", "john-apostle"],
    situations: [
      {
        id: "judas-thaddaeus-question",
        title: "The Honest Question at the Last Supper",
        category: "Faith Testing",
        reference: "John 14:22",
        keyVerse: "Lord, why do you intend to show yourself to us and not to the world? (John 14:22)",
        situation: "During the Last Supper, Judas (not Iscariot) asks Jesus why He plans to reveal Himself only to the disciples.",
        pressure: "Expected a public, political Messiah who would overthrow Rome.",
        innerBattle: "If Jesus is the Messiah, why is He hiding? Shouldn't the world see His glory?",
        response: "He asked his question directly and received Jesus' teaching about intimate relational revelation.",
        outcome: "Jesus explained that those who love Him will be indwelt by the Father and Son.",
        lesson: "God reveals Himself to those who love and obey, not through spectacle but through relationship.",
        traitRevealed: "Sincere questioning born of genuine faith",
        spiritualPrinciple: "God's kingdom advances through relationship, not political power.",
        reflectionQuestions: [
          "Do I expect God to prove Himself publicly rather than trusting His intimate presence?",
          "Am I comfortable serving faithfully without public recognition?"
        ],
        dnaSnapshot: { faith: 7, humility: 8 }
      }
    ]
  },

  // 12. Simon the Zealot
  {
    id: "simon-the-zealot",
    name: "Simon the Zealot",
    meaning: "He has heard",
    emoji: "🗡️",
    role: "Apostle, former political revolutionary",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 10:4", "Mark 3:18", "Luke 6:15", "Acts 1:13"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 7, humility: 6, courage: 9, wisdom: 5, compassion: 5, fear: 2, pride: 5, greed: 2 },
    quickCard: {
      archetype: "Warrior",
      strength: "Passionate commitment to a cause",
      weakness: "Tendency toward violent solutions",
      mindset: "I traded a sword for a Savior—my zeal found its true target.",
      keyLesson: "Passion must be redirected, not destroyed, when we follow Jesus.",
      keyVerse: "My kingdom is not of this world.",
      keyVerseRef: "John 18:36"
    },
    storyArc: "A political radical committed to overthrowing Rome through violence was called by Jesus and transformed his revolutionary zeal into kingdom service alongside Matthew, a former collaborator with Rome.",
    therapyView: {
      drivingFears: ["Injustice going unchallenged", "Passivity in the face of oppression"],
      coreMotivations: ["Justice", "National liberation", "Passionate devotion to God"],
      relationalStyle: "Intense and cause-driven; learned to channel aggression into mission",
      blindSpots: ["Confused political liberation with spiritual salvation", "May have struggled with patience"],
      healingMoments: ["Learning to coexist with Matthew, a former enemy", "Understanding Jesus' kingdom was spiritual, not military"]
    },
    strengths: ["Radical commitment", "Courage", "Willingness to sacrifice"],
    weaknesses: ["Violence-oriented", "Potentially impatient with Jesus' nonviolent approach"],
    journey: [
      { phase: "Calling", description: "Left the Zealot movement to follow Jesus." },
      { phase: "Testing", description: "Had to serve alongside Matthew, a tax collector who had collaborated with Rome." },
      { phase: "Refinement", description: "Learned that Jesus' kingdom was spiritual, not political." },
      { phase: "Legacy", description: "Faithfully served in the early church and, by tradition, was martyred for his faith." }
    ],
    relationships: [
      { name: "Jesus", role: "Lord who redirected his zeal" },
      { name: "Matthew", role: "Fellow apostle and former ideological enemy" },
      { name: "The Twelve", role: "Fellow disciples" }
    ],
    lessonsAndReflection: [
      "Jesus transforms our passions rather than erasing them.",
      "The kingdom of God creates unity among former enemies.",
      "Political zeal is no substitute for spiritual transformation."
    ],
    relatedCharacters: ["matthew-levi", "jesus", "peter"],
    situations: [
      {
        id: "simon-zealot-enemy",
        title: "Serving Beside a Former Enemy",
        category: "Conflict",
        reference: "Matthew 10:3-4",
        situation: "Simon the Zealot, a man who devoted his life to overthrowing Roman oppression, must now serve alongside Matthew, a tax collector who profited from Roman occupation.",
        pressure: "Every instinct from his Zealot training told him Matthew was a traitor deserving punishment.",
        innerBattle: "How can I follow a Messiah who calls the enemy to the same table as me?",
        response: "He submitted to Jesus' vision of a kingdom that transcends political allegiance.",
        outcome: "The two former enemies served together as apostles, demonstrating the reconciling power of Christ.",
        lesson: "The gospel creates a community where former enemies become brothers.",
        traitRevealed: "Willingness to surrender ideology for relationship",
        spiritualPrinciple: "Christ's kingdom breaks every barrier that divides humanity.",
        reflectionQuestions: [
          "Who is the 'Matthew' in my life—someone I consider an enemy whom God has called?",
          "Am I willing to let Jesus redefine my categories of friend and foe?"
        ],
        dnaSnapshot: { humility: 7, compassion: 6, pride: 4 }
      }
    ]
  },

  // 13. Matthias
  {
    id: "matthias",
    name: "Matthias",
    meaning: "Gift of God",
    emoji: "🎲",
    role: "Apostle chosen by lot to replace Judas Iscariot",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 1:15-26"],
    archetypes: ["Servant"],
    dna: { faith: 8, humility: 9, courage: 7, wisdom: 6, compassion: 7, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Quiet faithfulness that qualified him for unexpected promotion",
      weakness: "Virtually unknown—no recorded words or deeds after selection",
      mindset: "I was faithful when no one was watching, and God saw.",
      keyLesson: "Faithfulness in the background qualifies us for assignments we never sought.",
      keyVerse: "Lord, you know everyone's heart. Show us which of these two you have chosen.",
      keyVerseRef: "Acts 1:24"
    },
    storyArc: "A faithful follower who had been with Jesus from the baptism of John to the ascension was chosen by lot to fill the vacancy left by Judas Iscariot, completing the Twelve.",
    therapyView: {
      drivingFears: ["Living in the shadow of Judas' betrayal", "Being seen as a replacement rather than a choice"],
      coreMotivations: ["Faithfulness to Jesus", "Service to the community"],
      relationalStyle: "Steady background presence; dependable rather than flashy",
      blindSpots: ["May have struggled with the circumstances of his calling"],
      healingMoments: ["Being recognized as qualified by the entire apostolic community"]
    },
    strengths: ["Long-term faithfulness", "Humility", "Steady presence"],
    weaknesses: ["No recorded individual contribution", "Overshadowed by Paul"],
    journey: [
      { phase: "Calling", description: "Had followed Jesus from John's baptism through the ascension." },
      { phase: "Testing", description: "Selected as a candidate alongside Barsabbas to replace Judas." },
      { phase: "Legacy", description: "Chosen by lot and numbered with the Eleven." }
    ],
    relationships: [
      { name: "Jesus", role: "Lord he followed from the beginning" },
      { name: "The Eleven", role: "Fellow apostles" },
      { name: "Joseph Barsabbas", role: "Fellow candidate" }
    ],
    lessonsAndReflection: [
      "Faithfulness in obscurity is the best preparation for greater responsibility.",
      "God sees what the crowd overlooks.",
      "Not every calling comes with applause."
    ],
    relatedCharacters: ["peter", "jesus", "judas-iscariot"],
    situations: [
      {
        id: "matthias-chosen",
        title: "Chosen by Lot",
        category: "Calling",
        reference: "Acts 1:15-26",
        keyVerse: "Then they cast lots, and the lot fell to Matthias; so he was added to the eleven apostles. (Acts 1:26)",
        situation: "After Judas' death, the apostles seek a replacement who witnessed Jesus' ministry from baptism to ascension.",
        pressure: "Stepping into a role vacated by the most infamous traitor in history.",
        innerBattle: "Am I ready for this role? Will I always be seen as a replacement?",
        response: "He submitted to the process and accepted the calling determined by lot.",
        outcome: "He was numbered with the Eleven and received the Holy Spirit at Pentecost.",
        lesson: "God fills vacancies created by failure with people shaped by faithfulness.",
        traitRevealed: "Humble readiness born from years of faithful following",
        spiritualPrinciple: "Faithfulness in obscurity is God's preferred preparation for leadership.",
        reflectionQuestions: [
          "Am I faithful in the unseen seasons of life?",
          "Can I accept a calling that comes with complicated circumstances?"
        ],
        dnaSnapshot: { faith: 8, humility: 9 }
      }
    ]
  },

  // 14. Ananias (Damascus)
  {
    id: "ananias-damascus",
    name: "Ananias of Damascus",
    meaning: "God is gracious",
    emoji: "🙏",
    role: "Disciple in Damascus who baptized Paul",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 9:10-19", "Acts 22:12-16"],
    archetypes: ["Servant", "Prophet"],
    dna: { faith: 9, humility: 8, courage: 9, wisdom: 7, compassion: 8, fear: 4, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Obedience despite extreme fear",
      weakness: "Initial resistance to God's command",
      mindset: "Lord, I've heard about this man—but if You say go, I'll go.",
      keyLesson: "God sometimes asks us to extend grace to the very people we fear most.",
      keyVerse: "Go! This man is my chosen instrument to proclaim my name to the Gentiles.",
      keyVerseRef: "Acts 9:15"
    },
    storyArc: "An ordinary disciple in Damascus receives a terrifying assignment from God: go to the house where Saul of Tarsus—the church's greatest persecutor—is staying, lay hands on him, and restore his sight. His obedience changed the course of Christianity.",
    therapyView: {
      drivingFears: ["Being killed by Saul", "Making a mistake about God's voice"],
      coreMotivations: ["Obedience to God's voice", "Compassion that overcame fear"],
      relationalStyle: "Obedient and warm; called Saul 'Brother' immediately",
      blindSpots: ["Initially argued with God about the assignment"],
      healingMoments: ["Seeing Saul receive his sight and the Holy Spirit", "Being part of the moment that launched Paul's ministry"]
    },
    strengths: ["Courage under terror", "Immediate obedience", "Compassion for an enemy"],
    weaknesses: ["Initial hesitation and fear"],
    journey: [
      { phase: "Calling", description: "God spoke to him in a vision, commanding him to go to Saul." },
      { phase: "Resistance", description: "Protested that Saul had come to arrest believers." },
      { phase: "Testing", description: "Went to Saul, laid hands on him, and called him 'Brother Saul.'" },
      { phase: "Legacy", description: "His single act of obedience was instrumental in launching Paul's apostolic ministry." }
    ],
    relationships: [
      { name: "Paul (Saul)", role: "The persecutor he healed and baptized" },
      { name: "God", role: "Spoke to him in a vision" },
      { name: "The Damascus church", role: "Fellow believers" }
    ],
    lessonsAndReflection: [
      "One act of obedience can change the course of history.",
      "God asks us to extend grace to those we fear.",
      "Calling someone 'brother' can be the most courageous thing we ever do."
    ],
    relatedCharacters: ["paul", "barnabas", "jesus"],
    situations: [
      {
        id: "ananias-damascus-saul",
        title: "Go to the Man Who Wants to Kill You",
        category: "Obedience",
        reference: "Acts 9:10-19",
        keyVerse: "Go! This man is my chosen instrument. (Acts 9:15)",
        situation: "God tells Ananias in a vision to go lay hands on Saul of Tarsus, who has been blinded on the road to Damascus.",
        pressure: "Saul has authorization to arrest every believer in Damascus.",
        innerBattle: "God is asking me to walk into the hands of the man hunting us. This could cost me my life.",
        response: "After expressing his fear, he obeyed, went to Saul, and said, 'Brother Saul, the Lord Jesus has sent me.'",
        outcome: "Saul received his sight, was filled with the Holy Spirit, and was baptized.",
        lesson: "The scariest act of obedience may have the greatest kingdom impact.",
        traitRevealed: "Obedience that conquered legitimate fear",
        spiritualPrinciple: "God's commands often require us to trust His plans over our safety calculations.",
        reflectionQuestions: [
          "Is there someone I fear whom God is asking me to approach with grace?",
          "Am I willing to obey when the risk feels unreasonable?"
        ],
        dnaSnapshot: { faith: 9, courage: 9, fear: 4 }
      }
    ]
  },

  // 15. Ananias & Sapphira
  {
    id: "ananias-sapphira",
    name: "Ananias & Sapphira",
    meaning: "God is gracious / Beautiful",
    emoji: "💀",
    role: "Married couple in the early church who lied about their giving",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 5:1-11"],
    archetypes: ["Manipulator", "Tragic Hero"],
    dna: { faith: 3, humility: 2, courage: 3, wisdom: 2, compassion: 3, fear: 5, pride: 8, greed: 8 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Willingness to give (partially)",
      weakness: "Deception driven by desire for reputation",
      mindset: "We want the praise of total sacrifice without the cost.",
      keyLesson: "God values honesty over impressive giving; hypocrisy in the church is deadly serious.",
      keyVerse: "You have not lied just to human beings but to God.",
      keyVerseRef: "Acts 5:4"
    },
    storyArc: "A couple in the early church sold property and conspired to keep part of the proceeds while claiming to have given everything, lying to the apostles and to the Holy Spirit, and both fell dead as a result.",
    therapyView: {
      drivingFears: ["Not being seen as generous as Barnabas", "Missing out on community praise"],
      coreMotivations: ["Desire for social status", "Approval of the apostles", "Greed masked as generosity"],
      relationalStyle: "Performative generosity; colluded together in deception",
      blindSpots: ["Assumed partial truth was acceptable", "Underestimated the holiness of the Holy Spirit", "Colluded in sin rather than correcting each other"],
      healingMoments: ["None recorded—their story is a warning, not a redemption arc"]
    },
    strengths: ["They did give a portion", "They were part of the community"],
    weaknesses: ["Deception", "Greed", "Pride", "Collusion in sin"],
    journey: [
      { phase: "Calling", description: "Part of the early church community where believers shared everything." },
      { phase: "Failure", description: "Conspired to lie about the sale price, keeping a portion while claiming total generosity." },
      { phase: "Legacy", description: "Both fell dead; great fear seized the whole church." }
    ],
    relationships: [
      { name: "Each other", role: "Spouse and co-conspirator" },
      { name: "Peter", role: "Apostle who confronted them" },
      { name: "Barnabas", role: "The generous example they tried to imitate" }
    ],
    lessonsAndReflection: [
      "Partial obedience presented as full obedience is deception.",
      "God takes integrity in the church seriously.",
      "It is better to give honestly and modestly than to lie for a reputation."
    ],
    relatedCharacters: ["peter", "barnabas"],
    situations: [
      {
        id: "ananias-sapphira-lie",
        title: "Lying to the Holy Spirit",
        category: "Betrayal",
        reference: "Acts 5:1-11",
        keyVerse: "How is it that Satan has so filled your heart that you have lied to the Holy Spirit? (Acts 5:3)",
        situation: "Ananias and Sapphira sell property and bring only a portion of the proceeds to the apostles while claiming it was the full amount.",
        pressure: "The community was praising those like Barnabas who gave everything.",
        innerBattle: "We want the reputation without the sacrifice—surely no one will know.",
        response: "They conspired together and lied to Peter about the amount.",
        outcome: "Both fell dead when confronted, and great fear came upon the whole church.",
        lesson: "God distinguishes between genuine generosity and performative religion; integrity cannot be faked before the Holy Spirit.",
        traitRevealed: "Deception driven by desire for reputation",
        spiritualPrinciple: "The Holy Spirit sees through every pretense; honesty before God is non-negotiable.",
        reflectionQuestions: [
          "Where am I presenting a partial truth as the whole truth to appear more spiritual?",
          "Am I giving to be seen by others rather than out of genuine devotion?"
        ],
        dnaSnapshot: { greed: 8, pride: 8, faith: 2 }
      }
    ]
  },

  // 16. Cornelius
  {
    id: "cornelius",
    name: "Cornelius",
    meaning: "Horn (symbol of strength)",
    emoji: "🏠",
    role: "Roman centurion, first Gentile convert",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 10:1-48", "Acts 11:1-18"],
    archetypes: ["Seeker", "Warrior"],
    dna: { faith: 8, humility: 8, courage: 7, wisdom: 7, compassion: 9, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Seeker",
      strength: "Devout seeker of God before knowing the gospel",
      weakness: "Lacked the full revelation of Christ until Peter came",
      mindset: "I feared God and gave generously, but I still needed the gospel.",
      keyLesson: "Religious devotion and moral goodness are not substitutes for the gospel.",
      keyVerse: "God does not show favoritism but accepts from every nation the one who fears him.",
      keyVerseRef: "Acts 10:34-35"
    },
    storyArc: "A devout, God-fearing Roman centurion whose prayers and generosity attracted God's attention, was visited by an angel, sent for Peter, and became the first recorded Gentile to receive the Holy Spirit—breaking the ethnic barrier of the gospel.",
    therapyView: {
      drivingFears: ["Being excluded from God's covenant due to his ethnicity", "Inadequacy before the God of Israel"],
      coreMotivations: ["Genuine devotion to God", "Generosity to the poor", "Spiritual hunger"],
      relationalStyle: "Commanding yet humble; gathered his whole household to hear Peter",
      blindSpots: ["Initially tried to worship Peter when he arrived"],
      healingMoments: ["The Holy Spirit falling on his entire household", "Peter declaring God shows no favoritism"]
    },
    strengths: ["Devout prayer life", "Radical generosity", "Humility despite military rank"],
    weaknesses: ["Incomplete knowledge of salvation", "Initially tried to worship Peter"],
    journey: [
      { phase: "Calling", description: "An angel appeared and told him his prayers had been remembered before God." },
      { phase: "Testing", description: "Had to send for a Jewish apostle and trust a cross-cultural encounter." },
      { phase: "Legacy", description: "The Holy Spirit fell on his household, proving the gospel was for all nations." }
    ],
    relationships: [
      { name: "Peter", role: "Apostle who brought him the gospel" },
      { name: "His household", role: "Family and servants who all believed" },
      { name: "The angel", role: "Messenger who directed him to Peter" }
    ],
    lessonsAndReflection: [
      "Moral goodness and religious devotion do not replace the need for the gospel.",
      "God sees the seeking heart regardless of ethnicity or background.",
      "The Holy Spirit breaks every barrier humans erect."
    ],
    relatedCharacters: ["peter", "ethiopian-eunuch", "lydia"],
    situations: [
      {
        id: "cornelius-spirit-falls",
        title: "The Spirit Falls on the Gentiles",
        category: "Faith Testing",
        reference: "Acts 10:1-48",
        keyVerse: "I now realize how true it is that God does not show favoritism. (Acts 10:34)",
        situation: "Cornelius gathers his household to hear Peter preach, and the Holy Spirit falls on all of them before Peter even finishes.",
        pressure: "Centuries of Jewish-Gentile separation made this encounter culturally explosive.",
        innerBattle: "Will the God of Israel truly accept someone outside the covenant people?",
        response: "Cornelius humbly gathered everyone he could to hear the message.",
        outcome: "The Holy Spirit fell, they spoke in tongues, and Peter baptized them—the Gentile Pentecost.",
        lesson: "God's grace cannot be contained by human categories of who is 'in' or 'out.'",
        traitRevealed: "Seeking heart that God honored with full inclusion",
        spiritualPrinciple: "The gospel is for every nation, tribe, and tongue—without exception.",
        reflectionQuestions: [
          "Am I placing barriers on who can receive God's grace?",
          "Do I believe moral goodness alone is enough, or do I recognize the need for the gospel?"
        ],
        dnaSnapshot: { faith: 9, humility: 8, compassion: 9 }
      }
    ]
  },

  // 17. Lydia
  {
    id: "lydia",
    name: "Lydia",
    meaning: "From Lydia (region in Asia Minor)",
    emoji: "💜",
    role: "Businesswoman and first European convert",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 16:13-15", "Acts 16:40"],
    archetypes: ["Servant", "Builder"],
    dna: { faith: 8, humility: 7, courage: 7, wisdom: 8, compassion: 8, fear: 2, pride: 2, greed: 2 },
    quickCard: {
      archetype: "Builder",
      strength: "Immediate hospitality and leadership",
      weakness: "Limited information—her challenges are unrecorded",
      mindset: "If you consider me a believer, come and stay at my house.",
      keyLesson: "Faith opens the door; hospitality builds the church.",
      keyVerse: "The Lord opened her heart to respond to Paul's message.",
      keyVerseRef: "Acts 16:14"
    },
    storyArc: "A successful businesswoman who dealt in purple cloth was already a worshiper of God when she heard Paul by the river in Philippi. The Lord opened her heart, she and her household were baptized, and her home became the first house church in Europe.",
    therapyView: {
      drivingFears: ["Being marginalized as a woman in ministry", "Risking business reputation for faith"],
      coreMotivations: ["Worship of God", "Generosity", "Building community"],
      relationalStyle: "Hospitable leader; gathered people and provided for them",
      blindSpots: ["Scripture records no struggles—her story is brief but exemplary"],
      healingMoments: ["God opening her heart to the gospel", "Her home becoming the base of European Christianity"]
    },
    strengths: ["Business acumen", "Hospitality", "Leadership", "Immediate faith response"],
    weaknesses: ["No recorded struggles"],
    journey: [
      { phase: "Calling", description: "Already a God-worshiper who gathered with women by the river to pray." },
      { phase: "Testing", description: "Heard Paul's message and the Lord opened her heart." },
      { phase: "Legacy", description: "Her home became the first church in Europe (Philippi)." }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who brought her the gospel" },
      { name: "Silas", role: "Paul's companion" },
      { name: "Her household", role: "All baptized with her" }
    ],
    lessonsAndReflection: [
      "God opens hearts; our job is to be in the right place to hear.",
      "Business success and deep faith are not mutually exclusive.",
      "Hospitality is a form of ministry that can launch movements."
    ],
    relatedCharacters: ["paul", "priscilla-aquila", "cornelius"],
    situations: [
      {
        id: "lydia-conversion",
        title: "The Lord Opened Her Heart",
        category: "Calling",
        reference: "Acts 16:13-15",
        keyVerse: "The Lord opened her heart to respond to Paul's message. (Acts 16:14)",
        situation: "Lydia, a dealer in purple cloth from Thyatira, is worshiping by the river when Paul arrives in Philippi.",
        pressure: "Becoming a Christian in a Roman colony could jeopardize her business and social standing.",
        innerBattle: "I worship God already—is this new message the fulfillment I've been seeking?",
        response: "She listened, believed, was baptized with her household, and immediately offered her home.",
        outcome: "Her home became the first church in Europe—the church at Philippi.",
        lesson: "Preparedness of heart plus God's timing equals transformation.",
        traitRevealed: "Responsive faith coupled with generous action",
        spiritualPrinciple: "When God opens a heart, the response is not just belief but immediate generosity.",
        reflectionQuestions: [
          "Am I positioned to hear God when He speaks?",
          "Is my home and business available for God's kingdom purposes?"
        ],
        dnaSnapshot: { faith: 9, compassion: 8, courage: 7 }
      }
    ]
  },

  // 18. Priscilla & Aquila
  {
    id: "priscilla-aquila",
    name: "Priscilla & Aquila",
    meaning: "Ancient / Eagle",
    emoji: "🏠",
    role: "Missionary couple, tentmakers, church planters",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 18:1-4", "Acts 18:24-26", "Romans 16:3-5", "1 Corinthians 16:19"],
    archetypes: ["Missionary", "Builder"],
    dna: { faith: 9, humility: 8, courage: 8, wisdom: 9, compassion: 8, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Missionary",
      strength: "Theological depth combined with practical hospitality",
      weakness: "No recorded weaknesses—their partnership was remarkably effective",
      mindset: "Our home, our trade, and our teaching all serve the gospel.",
      keyLesson: "Ministry is most powerful when it is a partnership of equals.",
      keyVerse: "Greet Priscilla and Aquila, my co-workers in Christ Jesus. They risked their lives for me.",
      keyVerseRef: "Romans 16:3-4"
    },
    storyArc: "A married couple expelled from Rome worked alongside Paul as tentmakers, hosted house churches across the Roman Empire, privately corrected the eloquent Apollos' theology, and were praised by Paul as co-workers who risked their lives for him.",
    therapyView: {
      drivingFears: ["Persecution and displacement", "The gospel being taught inaccurately"],
      coreMotivations: ["Partnership in the gospel", "Theological accuracy", "Hospitality-based mission"],
      relationalStyle: "Collaborative equals; always mentioned together, with Priscilla often named first",
      blindSpots: ["None recorded—they are presented as a model couple in ministry"],
      healingMoments: ["Building the church in Corinth after exile from Rome", "Seeing Apollos become a powerful apologist after their mentoring"]
    },
    strengths: ["Theological teaching", "Hospitality", "Courageous partnership", "Cross-cultural ministry"],
    weaknesses: ["Experienced displacement and persecution"],
    journey: [
      { phase: "Calling", description: "Expelled from Rome by Claudius; met Paul in Corinth." },
      { phase: "Testing", description: "Built a ministry from scratch in multiple cities while working as tentmakers." },
      { phase: "Refinement", description: "Corrected Apollos privately with wisdom and grace." },
      { phase: "Legacy", description: "Hosted house churches in multiple cities; Paul called them co-workers who risked their lives." }
    ],
    relationships: [
      { name: "Paul", role: "Ministry partner and fellow tentmaker" },
      { name: "Apollos", role: "Preacher they mentored in theology" },
      { name: "The house churches", role: "Communities they founded and hosted" }
    ],
    lessonsAndReflection: [
      "Ministry partnership in marriage can be profoundly effective.",
      "Correcting someone privately and graciously is an act of love.",
      "Hospitality is a strategic tool for church planting."
    ],
    relatedCharacters: ["paul", "apollos", "lydia"],
    situations: [
      {
        id: "priscilla-aquila-apollos",
        title: "Correcting Apollos with Grace",
        category: "Correction",
        reference: "Acts 18:24-26",
        situation: "Apollos, an eloquent and learned preacher, teaches boldly in the synagogue but knows only the baptism of John.",
        pressure: "Apollos was gifted and passionate—correcting him risked offense and conflict.",
        innerBattle: "He is doing so much good—do we risk the relationship by pointing out what is missing?",
        response: "They invited him to their home and explained the way of God more adequately—in private, not public.",
        outcome: "Apollos became one of the most effective preachers in the early church.",
        lesson: "Private correction delivered with love produces public fruitfulness.",
        traitRevealed: "Wisdom to correct graciously and privately",
        spiritualPrinciple: "The best mentors protect dignity while advancing truth.",
        reflectionQuestions: [
          "Do I correct others publicly or privately?",
          "Am I willing to invest in someone else's ministry even when I get no credit?"
        ],
        dnaSnapshot: { wisdom: 9, humility: 8, compassion: 8 }
      }
    ]
  },

  // 19. Apollos
  {
    id: "apollos",
    name: "Apollos",
    meaning: "Destroyer (Greek origin)",
    emoji: "🔥",
    role: "Eloquent Alexandrian preacher and apologist",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 18:24-28", "1 Corinthians 1:12", "1 Corinthians 3:4-6", "Titus 3:13"],
    archetypes: ["Missionary", "Prophet"],
    dna: { faith: 8, humility: 7, courage: 8, wisdom: 9, compassion: 6, fear: 2, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Missionary",
      strength: "Powerful biblical argumentation and eloquence",
      weakness: "Incomplete theology until corrected",
      mindset: "I must wield the Scriptures with both power and accuracy.",
      keyLesson: "Giftedness without complete truth can do harm; teachability completes us.",
      keyVerse: "I planted the seed, Apollos watered it, but God has been making it grow.",
      keyVerseRef: "1 Corinthians 3:6"
    },
    storyArc: "A brilliant, eloquent Alexandrian Jew who knew the Scriptures thoroughly but only knew the baptism of John. After Priscilla and Aquila completed his understanding, he became one of the most powerful apologists in the early church.",
    therapyView: {
      drivingFears: ["Being intellectually wrong", "Causing division in the church"],
      coreMotivations: ["Proclamation of truth", "Intellectual mastery of Scripture", "Persuading others"],
      relationalStyle: "Charismatic communicator; drew followers (sometimes creating factions)",
      blindSpots: ["His eloquence created factionalism in Corinth", "Incomplete understanding despite confidence"],
      healingMoments: ["Humbly receiving correction from Priscilla and Aquila", "Paul's affirmation of his role in watering"]
    },
    strengths: ["Eloquence", "Biblical knowledge", "Teachability", "Apologetic power"],
    weaknesses: ["Incomplete theology initially", "Inadvertently caused factionalism"],
    journey: [
      { phase: "Calling", description: "Began preaching with great fervor but incomplete knowledge." },
      { phase: "Refinement", description: "Accepted Priscilla and Aquila's private correction." },
      { phase: "Legacy", description: "Became a powerful apologist; Paul acknowledged him as a co-laborer." }
    ],
    relationships: [
      { name: "Priscilla & Aquila", role: "Mentors who completed his theology" },
      { name: "Paul", role: "Fellow laborer who planted while Apollos watered" },
      { name: "The Corinthian church", role: "Community that benefited from his preaching" }
    ],
    lessonsAndReflection: [
      "Giftedness is not a substitute for theological accuracy.",
      "Teachability is the mark of true wisdom.",
      "We plant or water, but God gives the growth."
    ],
    relatedCharacters: ["priscilla-aquila", "paul", "peter"],
    situations: [
      {
        id: "apollos-correction",
        title: "Teachable Despite Being Gifted",
        category: "Correction",
        reference: "Acts 18:24-28",
        situation: "Apollos preaches boldly in Ephesus but only knows John's baptism; Priscilla and Aquila notice the gaps.",
        pressure: "He was already a celebrated speaker—accepting correction from tentmakers required humility.",
        innerBattle: "I have been trained in Alexandria and know the Scriptures well. Can these people teach me something I missed?",
        response: "He humbly received their instruction and allowed his theology to be completed.",
        outcome: "He went to Achaia and greatly helped the believers by proving from Scripture that Jesus was the Messiah.",
        lesson: "The truly wise are those willing to learn from unexpected teachers.",
        traitRevealed: "Teachability that multiplied his already significant gifts",
        spiritualPrinciple: "Humility before correction is the gateway to greater effectiveness.",
        reflectionQuestions: [
          "Am I teachable even when I am already skilled?",
          "Can I receive correction from people I might consider less qualified?"
        ],
        dnaSnapshot: { humility: 8, wisdom: 9, pride: 3 }
      }
    ]
  },

  // 20. Dorcas/Tabitha
  {
    id: "dorcas-tabitha",
    name: "Dorcas (Tabitha)",
    meaning: "Gazelle",
    emoji: "🧵",
    role: "Disciple in Joppa known for charity and raised from the dead",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 9:36-42"],
    archetypes: ["Servant"],
    dna: { faith: 8, humility: 9, courage: 5, wisdom: 6, compassion: 10, fear: 2, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Relentless practical generosity",
      weakness: "No recorded weaknesses",
      mindset: "Every stitch is an act of worship; every garment, a sermon of love.",
      keyLesson: "A life of quiet service creates a legacy that moves heaven.",
      keyVerse: "She was always doing good and helping the poor.",
      keyVerseRef: "Acts 9:36"
    },
    storyArc: "A disciple whose life of making garments for widows was so valuable to the community that when she died, Peter was summoned, and God raised her from the dead—the only woman in the New Testament explicitly called a disciple.",
    therapyView: {
      drivingFears: ["The needs of the poor going unmet"],
      coreMotivations: ["Compassion for widows", "Practical love", "Service as worship"],
      relationalStyle: "Nurturing and hands-on; expressed love through tangible deeds",
      blindSpots: ["None recorded"],
      healingMoments: ["Being raised from the dead by Peter", "Seeing the widows weeping and showing the garments she had made"]
    },
    strengths: ["Consistent generosity", "Practical compassion", "Community impact"],
    weaknesses: ["No weaknesses recorded"],
    journey: [
      { phase: "Calling", description: "Devoted her life to making clothing for widows and the poor." },
      { phase: "Testing", description: "She became ill and died; the community was devastated." },
      { phase: "Legacy", description: "Peter raised her from the dead; many believed in the Lord as a result." }
    ],
    relationships: [
      { name: "Peter", role: "Apostle who raised her" },
      { name: "The widows of Joppa", role: "Those she served with her sewing" }
    ],
    lessonsAndReflection: [
      "Small acts of service can have eternal impact.",
      "The only woman called a disciple in the NT was known for making clothes for the poor.",
      "Our practical deeds are the evidence of our faith."
    ],
    relatedCharacters: ["peter", "lydia"],
    situations: [
      {
        id: "dorcas-raised",
        title: "A Life Worth Raising",
        category: "Restoration",
        reference: "Acts 9:36-42",
        keyVerse: "In Joppa there was a disciple named Tabitha, who was always doing good and helping the poor. (Acts 9:36)",
        situation: "Dorcas dies, and the widows she served show Peter the robes and clothing she made for them.",
        pressure: "The community's grief testified to how essential her ministry was.",
        innerBattle: "From the community's perspective: How can we survive without her?",
        response: "Peter sent everyone out, prayed, and said 'Tabitha, get up.' She opened her eyes and sat up.",
        outcome: "She was presented alive to the believers; many people believed in the Lord.",
        lesson: "A life poured out in service is a life God honors—sometimes even by defying death.",
        traitRevealed: "Quiet service that God valued beyond measure",
        spiritualPrinciple: "The measure of a life is not fame but faithfulness in love.",
        reflectionQuestions: [
          "If I died today, what tangible evidence of my love would people hold up?",
          "Am I investing in practical acts of service that will outlast me?"
        ],
        dnaSnapshot: { compassion: 10, humility: 9, faith: 8 }
      }
    ]
  },

  // 21. Onesimus
  {
    id: "onesimus",
    name: "Onesimus",
    meaning: "Useful, profitable",
    emoji: "🔗",
    role: "Runaway slave who became a believer through Paul",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Philemon 1:10-21", "Colossians 4:9"],
    archetypes: ["Redeemed", "Servant"],
    dna: { faith: 7, humility: 7, courage: 6, wisdom: 5, compassion: 6, fear: 6, pride: 3, greed: 3 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Transformation from runaway slave to beloved brother",
      weakness: "Ran away from responsibility rather than facing it",
      mindset: "I was useless, but Christ has made me useful.",
      keyLesson: "The gospel transforms our identity and redefines every relationship.",
      keyVerse: "Formerly he was useless to you, but now he has become useful both to you and to me.",
      keyVerseRef: "Philemon 1:11"
    },
    storyArc: "A runaway slave who possibly stole from his master Philemon encountered Paul in prison, became a believer, and was sent back with a letter asking Philemon to receive him not as a slave but as a brother in Christ.",
    therapyView: {
      drivingFears: ["Punishment upon return", "Being defined by his past", "Rejection"],
      coreMotivations: ["Freedom", "New identity in Christ", "Making amends"],
      relationalStyle: "Initially avoidant; grew into a courageous willingness to face his past",
      blindSpots: ["Running from problems rather than confronting them"],
      healingMoments: ["Paul calling him 'my son' and 'my very heart'", "Being sent back as a brother, not a slave"]
    },
    strengths: ["Transformed character", "Willingness to return and face consequences", "Service to Paul"],
    weaknesses: ["Ran away from his master", "Possibly stole from Philemon"],
    journey: [
      { phase: "Calling", description: "Met Paul in prison and became a believer." },
      { phase: "Testing", description: "Had to decide whether to return to Philemon and face potential punishment." },
      { phase: "Refinement", description: "Carried Paul's letter back, trusting the gospel to transform his situation." },
      { phase: "Legacy", description: "Tradition holds he became a church leader; the letter to Philemon transformed views on slavery." }
    ],
    relationships: [
      { name: "Paul", role: "Spiritual father who led him to Christ" },
      { name: "Philemon", role: "Master he ran from and was sent back to" },
      { name: "Tychicus", role: "Accompanied him on the return journey" }
    ],
    lessonsAndReflection: [
      "The gospel gives us the courage to face what we ran from.",
      "In Christ, every relationship is redefined.",
      "What was 'useless' becomes 'useful' when touched by grace."
    ],
    relatedCharacters: ["paul", "philemon"],
    situations: [
      {
        id: "onesimus-return",
        title: "Returning to the Master He Fled",
        category: "Obedience",
        reference: "Philemon 1:10-21",
        keyVerse: "Perhaps the reason he was separated from you for a little while was that you might have him back forever—no longer as a slave, but better than a slave, as a dear brother. (Philemon 1:15-16)",
        situation: "Onesimus must return to Philemon carrying Paul's letter, not knowing how he will be received.",
        pressure: "Roman law permitted harsh punishment—even death—for runaway slaves.",
        innerBattle: "Will Philemon see me as a brother now, or will he punish me as a runaway?",
        response: "He trusted Paul's intercession and the power of the gospel to transform the situation.",
        outcome: "Paul's letter asked Philemon to receive Onesimus as a brother; tradition suggests he was freed.",
        lesson: "The gospel gives us courage to return to broken situations with hope for transformation.",
        traitRevealed: "Courage born from new identity in Christ",
        spiritualPrinciple: "Grace transforms every human relationship when both parties submit to Christ.",
        reflectionQuestions: [
          "What broken relationship am I avoiding that God might want to restore?",
          "Do I trust the gospel to transform situations that seem hopeless?"
        ],
        dnaSnapshot: { courage: 7, faith: 7, fear: 5 }
      }
    ]
  },

  // 22. Philemon
  {
    id: "philemon",
    name: "Philemon",
    meaning: "Loving, affectionate",
    emoji: "📜",
    role: "Wealthy Christian and master of Onesimus",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Philemon 1:1-25"],
    archetypes: ["Builder", "Servant"],
    dna: { faith: 8, humility: 7, courage: 6, wisdom: 7, compassion: 7, fear: 3, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Builder",
      strength: "Generosity and love for the saints",
      weakness: "Tested by the call to forgive a runaway slave",
      mindset: "The gospel calls me to see my slave as my brother.",
      keyLesson: "The gospel demands that we treat every person according to their dignity in Christ, not their social status.",
      keyVerse: "So if you consider me a partner, welcome him as you would welcome me.",
      keyVerseRef: "Philemon 1:17"
    },
    storyArc: "A wealthy believer who hosted a house church in Colossae was challenged by Paul's letter to receive his runaway slave Onesimus back—not as property, but as a beloved brother in Christ.",
    therapyView: {
      drivingFears: ["Setting a precedent that could encourage other slaves to run", "Loss of social standing"],
      coreMotivations: ["Love for Paul", "Faith in the gospel's implications", "Desire to do what is right"],
      relationalStyle: "Generous host and leader; known for refreshing the hearts of the saints",
      blindSpots: ["Accepting the institution of slavery as normal", "Potential resentment toward Onesimus"],
      healingMoments: ["Paul's appeal to see Onesimus as a brother", "The choice to forgive and restore"]
    },
    strengths: ["Generosity", "Hospitality", "Love for the church"],
    weaknesses: ["Tested by the cost of radical forgiveness"],
    journey: [
      { phase: "Calling", description: "Hosted a house church and was known for refreshing the saints." },
      { phase: "Testing", description: "Received Paul's letter asking him to forgive and free his runaway slave." },
      { phase: "Legacy", description: "Tradition holds he freed Onesimus; the letter became Scripture addressing human dignity." }
    ],
    relationships: [
      { name: "Onesimus", role: "Runaway slave turned brother" },
      { name: "Paul", role: "Apostle and spiritual father" },
      { name: "Apphia", role: "Possibly his wife" },
      { name: "Archippus", role: "Fellow worker, possibly his son" }
    ],
    lessonsAndReflection: [
      "The gospel demands radical forgiveness that crosses social boundaries.",
      "Hospitality creates a context where the hardest truths can be received.",
      "Faith is proven by how we treat those who have wronged us."
    ],
    relatedCharacters: ["onesimus", "paul"],
    situations: [
      {
        id: "philemon-forgiveness",
        title: "Forgiving the Slave Who Ran",
        category: "Sacrifice",
        reference: "Philemon 1:8-21",
        keyVerse: "Welcome him as you would welcome me. (Philemon 1:17)",
        situation: "Philemon receives Paul's letter asking him to forgive Onesimus and welcome him as a brother, not a slave.",
        pressure: "Roman culture and law supported punishing runaway slaves; his peers would watch his response.",
        innerBattle: "My rights say punish him; the gospel says embrace him. Which will I choose?",
        response: "Paul appeals to love rather than authority, and tradition suggests Philemon complied.",
        outcome: "The letter to Philemon became a foundational text on human dignity and gospel-transformed relationships.",
        lesson: "The gospel asks us to surrender our rights for the sake of love.",
        traitRevealed: "Faith tested by the demand for radical grace",
        spiritualPrinciple: "In Christ, social hierarchies yield to brotherhood.",
        reflectionQuestions: [
          "Is there someone who wronged me whom God is asking me to restore rather than punish?",
          "Am I willing to surrender my rights for the sake of gospel witness?"
        ],
        dnaSnapshot: { compassion: 8, faith: 8, humility: 7 }
      }
    ]
  },

  // 23. Titus
  {
    id: "titus",
    name: "Titus",
    meaning: "Honorable",
    emoji: "🏝️",
    role: "Paul's trusted delegate and church organizer",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["2 Corinthians 7:6-7", "2 Corinthians 8:16-17", "Galatians 2:1-3", "Titus 1:4-5"],
    archetypes: ["Builder", "Servant"],
    dna: { faith: 8, humility: 7, courage: 8, wisdom: 8, compassion: 7, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Builder",
      strength: "Reliable execution of difficult assignments",
      weakness: "No recorded weaknesses",
      mindset: "I go where Paul sends me and finish what needs finishing.",
      keyLesson: "Reliability in hard assignments is one of the greatest gifts to the kingdom.",
      keyVerse: "The reason I left you in Crete was that you might put in order what was left unfinished.",
      keyVerseRef: "Titus 1:5"
    },
    storyArc: "A Greek convert who became Paul's most trusted troubleshooter, sent to handle the volatile Corinthian crisis, organize the collection for Jerusalem, and establish church order on the notoriously difficult island of Crete.",
    therapyView: {
      drivingFears: ["Failing Paul's trust", "Churches falling into disorder"],
      coreMotivations: ["Completing the mission", "Church health", "Loyalty to Paul"],
      relationalStyle: "Diplomatic and competent; able to navigate hostile environments",
      blindSpots: ["No recorded blind spots"],
      healingMoments: ["Successfully reconciling Paul and the Corinthians", "Paul's public trust and affection"]
    },
    strengths: ["Diplomacy", "Organizational skill", "Courage under pressure", "Reliability"],
    weaknesses: ["Limited independent legacy—always associated with Paul"],
    journey: [
      { phase: "Calling", description: "Converted as a Gentile; became Paul's proof that circumcision was not required." },
      { phase: "Testing", description: "Sent to Corinth during their most hostile period toward Paul." },
      { phase: "Refinement", description: "Left on Crete to organize churches in a notoriously difficult culture." },
      { phase: "Legacy", description: "Paul's letter to him became canonical Scripture on church leadership." }
    ],
    relationships: [
      { name: "Paul", role: "Spiritual father and apostle" },
      { name: "The Corinthian church", role: "Church he helped reconcile to Paul" },
      { name: "The Cretan churches", role: "Communities he organized" }
    ],
    lessonsAndReflection: [
      "Some of the most important kingdom work is organizational, not oratorical.",
      "Reliability is a spiritual gift.",
      "The hardest assignments are often given to the most trusted."
    ],
    relatedCharacters: ["paul", "timothy", "mark-john-mark"],
    situations: [
      {
        id: "titus-crete",
        title: "Organizing the Church on Crete",
        category: "Leadership Pressure",
        reference: "Titus 1:5-16",
        keyVerse: "The reason I left you in Crete was that you might put in order what was left unfinished and appoint elders in every town. (Titus 1:5)",
        situation: "Paul leaves Titus on Crete to organize house churches and appoint elders in a culture known for dishonesty and rebellion.",
        pressure: "The Cretan culture was notoriously difficult; false teachers were already disrupting the churches.",
        innerBattle: "Can I bring order to chaos in a culture that resists structure?",
        response: "Titus followed Paul's instructions, appointing qualified elders and confronting false teaching.",
        outcome: "The letter to Titus provides the blueprint for church organization still used today.",
        lesson: "Building healthy churches requires both courage and organizational wisdom.",
        traitRevealed: "Administrative faith that built lasting structures",
        spiritualPrinciple: "Order in the church is not bureaucracy; it is stewardship.",
        reflectionQuestions: [
          "Am I willing to do the unglamorous work of building healthy structures?",
          "Do I see organizational work as spiritual work?"
        ],
        dnaSnapshot: { wisdom: 9, courage: 8, faith: 8 }
      }
    ]
  },

  // 24. Mark (John Mark)
  {
    id: "mark-john-mark",
    name: "Mark (John Mark)",
    meaning: "Consecrated to Mars / Polite",
    emoji: "📖",
    role: "Gospel writer, companion of Paul and Barnabas",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 12:12", "Acts 12:25", "Acts 13:13", "Acts 15:37-39", "2 Timothy 4:11", "1 Peter 5:13"],
    archetypes: ["Redeemed", "Servant"],
    dna: { faith: 7, humility: 7, courage: 5, wisdom: 7, compassion: 6, fear: 5, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Restoration after failure; authored the earliest Gospel",
      weakness: "Deserted Paul and Barnabas during their first mission",
      mindset: "My failure was not my finale—God still had a purpose for me.",
      keyLesson: "Failure is not final when someone believes in your restoration.",
      keyVerse: "Get Mark and bring him with you, because he is helpful to me in my ministry.",
      keyVerseRef: "2 Timothy 4:11"
    },
    storyArc: "A young man who deserted Paul and Barnabas on their first missionary journey, causing a sharp disagreement between them, was mentored by Barnabas, eventually restored to Paul's trust, and authored the Gospel of Mark.",
    therapyView: {
      drivingFears: ["Fear of hardship", "Being permanently defined by his desertion", "Disappointing mentors"],
      coreMotivations: ["Desire to serve", "Need for redemption", "Writing ability put to kingdom use"],
      relationalStyle: "Needed mentoring and a second chance; flourished under patient investment",
      blindSpots: ["Underestimated the cost of missionary work", "Withdrew under pressure"],
      healingMoments: ["Barnabas choosing him despite Paul's rejection", "Paul requesting him in 2 Timothy", "Peter calling him 'my son'"]
    },
    strengths: ["Literary gifting", "Resilience after failure", "Eventual faithfulness"],
    weaknesses: ["Deserted the mission", "Required a second chance"],
    journey: [
      { phase: "Calling", description: "Joined Paul and Barnabas as a helper on their first missionary journey." },
      { phase: "Failure", description: "Deserted them at Pamphylia and returned to Jerusalem." },
      { phase: "Refinement", description: "Barnabas took him on a separate journey; he matured in ministry." },
      { phase: "Legacy", description: "Paul called him 'helpful'; Peter called him 'my son'; he wrote the earliest Gospel." }
    ],
    relationships: [
      { name: "Barnabas", role: "Cousin and second-chance mentor" },
      { name: "Paul", role: "Initially rejected him, later valued him" },
      { name: "Peter", role: "Spiritual father; Mark's Gospel may record Peter's testimony" },
      { name: "Mary (his mother)", role: "Hosted the early church in her home" }
    ],
    lessonsAndReflection: [
      "One failure does not disqualify you from God's purpose.",
      "Everyone needs a Barnabas who believes in them after failure.",
      "The person you give up on may write the next Gospel."
    ],
    relatedCharacters: ["barnabas", "paul", "peter"],
    situations: [
      {
        id: "mark-desertion",
        title: "The Deserter Who Wrote a Gospel",
        category: "Fear",
        reference: "Acts 13:13; Acts 15:37-39; 2 Timothy 4:11",
        situation: "John Mark deserts Paul and Barnabas at Pamphylia and returns home, causing a later split between Paul and Barnabas.",
        pressure: "The dangers of missionary travel, culture shock, and possibly fear of persecution.",
        innerBattle: "I am not cut out for this. The cost is too high and I want to go home.",
        response: "He left the mission and went back to Jerusalem.",
        outcome: "Paul refused to take him again; Barnabas took him instead; years later Paul requested him, calling him 'helpful.'",
        lesson: "God uses mentors to restore those who fail, and failure can become the prelude to a greater contribution.",
        traitRevealed: "Initial weakness that was transformed by patient mentoring",
        spiritualPrinciple: "Grace gives second chances; faithfulness in the second chance redefines the story.",
        reflectionQuestions: [
          "Have I written someone off who deserves a second chance?",
          "Am I willing to return to the calling I once abandoned?"
        ],
        dnaSnapshot: { fear: 7, courage: 4, faith: 5 }
      }
    ]
  },

  // 25. Pilate
  {
    id: "pilate",
    name: "Pontius Pilate",
    meaning: "Armed with a javelin",
    emoji: "⚖️",
    role: "Roman governor of Judea who condemned Jesus",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 27:11-26", "John 18:28-19:16", "Luke 23:1-25"],
    archetypes: ["Oppressor", "Tragic Hero"],
    dna: { faith: 2, humility: 2, courage: 3, wisdom: 5, compassion: 4, fear: 7, pride: 7, greed: 5 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Recognized Jesus' innocence",
      weakness: "Lacked the courage to act on what he knew was right",
      mindset: "I find no basis for a charge against this man, but I cannot afford the political fallout.",
      keyLesson: "Knowing the truth is worthless without the courage to act on it.",
      keyVerse: "What shall I do, then, with Jesus who is called the Messiah?",
      keyVerseRef: "Matthew 27:22"
    },
    storyArc: "A Roman governor who privately recognized Jesus' innocence, publicly attempted to release Him through various maneuvers, but ultimately handed Him over to be crucified to preserve his political position.",
    therapyView: {
      drivingFears: ["Losing his position", "A report to Caesar about unrest", "The crowd's volatility"],
      coreMotivations: ["Political survival", "Self-preservation", "Maintaining order"],
      relationalStyle: "Calculating and self-protective; swayed by whoever had the most leverage",
      blindSpots: ["Believed neutrality was possible in moral decisions", "Thought washing his hands absolved his guilt"],
      healingMoments: ["None recorded—his story is a warning about moral cowardice"]
    },
    strengths: ["Recognized innocence", "Attempted compromise solutions"],
    weaknesses: ["Moral cowardice", "Political self-preservation over justice", "Believed in neutral ground"],
    journey: [
      { phase: "Testing", description: "Interrogated Jesus and found no fault in Him." },
      { phase: "Failure", description: "Despite knowing Jesus was innocent, handed Him over to be crucified under political pressure." },
      { phase: "Legacy", description: "His name is in the Apostles' Creed: 'suffered under Pontius Pilate.'" }
    ],
    relationships: [
      { name: "Jesus", role: "Prisoner he condemned despite finding innocent" },
      { name: "Caiaphas", role: "High priest who pressured him" },
      { name: "The crowd", role: "Mob that demanded crucifixion" },
      { name: "His wife", role: "Warned him to have nothing to do with Jesus" }
    ],
    lessonsAndReflection: [
      "You cannot wash your hands of a moral decision.",
      "Knowing the truth without acting on it is its own form of guilt.",
      "Political expediency is no excuse for moral failure."
    ],
    relatedCharacters: ["jesus", "caiaphas", "herod-antipas"],
    situations: [
      {
        id: "pilate-hand-washing",
        title: "Washing Hands of Innocent Blood",
        category: "Fear",
        reference: "Matthew 27:11-26",
        keyVerse: "I am innocent of this man's blood. It is your responsibility! (Matthew 27:24)",
        situation: "Pilate is pressured by the chief priests and the crowd to crucify Jesus, whom he has declared innocent.",
        pressure: "The crowd threatens to report him to Caesar for releasing a man who claimed to be king.",
        innerBattle: "I know He is innocent, but if I release Him, I may lose everything.",
        response: "He washed his hands publicly, symbolically claiming innocence, and handed Jesus over to be crucified.",
        outcome: "Jesus was crucified; Pilate's name became synonymous with moral cowardice for all history.",
        lesson: "There is no neutral ground in moral decisions; inaction is itself a choice.",
        traitRevealed: "Moral cowardice disguised as political pragmatism",
        spiritualPrinciple: "We cannot remain neutral about Jesus; refusal to decide is a decision against Him.",
        reflectionQuestions: [
          "Where am I trying to wash my hands of a decision God is asking me to make?",
          "Am I choosing political or social safety over moral courage?"
        ],
        dnaSnapshot: { fear: 8, courage: 2, pride: 7 }
      }
    ]
  },

  // 26. Herod the Great
  {
    id: "herod-the-great",
    name: "Herod the Great",
    meaning: "Hero-like",
    emoji: "👑",
    role: "King of Judea who ordered the massacre of Bethlehem's infants",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 2:1-18"],
    archetypes: ["Oppressor", "King"],
    dna: { faith: 1, humility: 1, courage: 6, wisdom: 6, compassion: 1, fear: 8, pride: 10, greed: 9 },
    quickCard: { archetype: "Oppressor", strength: "Political cunning and architectural genius", weakness: "Paranoid cruelty that destroyed even his own family", mindset: "No one will take my throne—not even a baby.", keyLesson: "Power driven by fear becomes monstrous; no throne is worth the cost of innocence.", keyVerse: "He gave orders to kill all the boys in Bethlehem and its vicinity who were two years old and under.", keyVerseRef: "Matthew 2:16" },
    storyArc: "A politically brilliant but paranoid king who rebuilt the Temple yet murdered his own sons, wives, and ultimately ordered the slaughter of Bethlehem's infants in a futile attempt to destroy the newborn King of the Jews.",
    therapyView: { drivingFears: ["Losing his throne", "Being replaced", "Conspiracy everywhere"], coreMotivations: ["Absolute power", "Legacy through building projects", "Eliminating threats"], relationalStyle: "Paranoid and controlling; destroyed anyone perceived as a threat, including family", blindSpots: ["Could not distinguish loyalty from threat", "Believed violence could stop God's plan"], healingMoments: ["None—his story is entirely cautionary"] },
    strengths: ["Political intelligence", "Architectural vision", "Strategic alliances"],
    weaknesses: ["Paranoia", "Cruelty", "Murdered his own family members"],
    journey: [
      { phase: "Calling", description: "Appointed king of Judea by Rome." },
      { phase: "Failure", description: "His paranoia led him to murder his own sons and wife Mariamne." },
      { phase: "Legacy", description: "Ordered the massacre of Bethlehem's innocents; died shortly after in agony." }
    ],
    relationships: [
      { name: "The Magi", role: "Wise men he tried to manipulate" },
      { name: "Jesus", role: "The infant king he tried to destroy" },
      { name: "Mariamne", role: "Wife he executed out of jealousy" }
    ],
    lessonsAndReflection: ["No human power can thwart God's purposes.", "Paranoia destroys the paranoid.", "Building a temple does not make one godly."],
    relatedCharacters: ["jesus", "herod-antipas", "pilate"],
    situations: [{
      id: "herod-great-massacre", title: "The Massacre of the Innocents", category: "Fear", reference: "Matthew 2:13-18",
      keyVerse: "When Herod realized that he had been outwitted by the Magi, he was furious. (Matthew 2:16)",
      situation: "After the Magi do not return with the child's location, Herod orders the killing of all male children under two in Bethlehem.",
      pressure: "A prophecy of a new King of the Jews threatened his dynasty.",
      innerBattle: "I will destroy any threat—even if it means killing every infant in a village.",
      response: "He ordered the systematic murder of children in Bethlehem and its vicinity.",
      outcome: "Jesus escaped to Egypt; the innocents died; Herod died shortly after in torment.",
      lesson: "Fear-driven power is willing to destroy anything to preserve itself—but God's purposes cannot be stopped.",
      traitRevealed: "Paranoid cruelty without limits",
      spiritualPrinciple: "Human power rages in vain against God's anointed.",
      reflectionQuestions: ["What am I willing to destroy to protect my position?", "Do I trust God's sovereignty, or do I try to control outcomes through fear?"],
      dnaSnapshot: { fear: 9, pride: 10 }
    }]
  },

  // 27. Herod Antipas
  {
    id: "herod-antipas",
    name: "Herod Antipas",
    meaning: "Hero-like",
    emoji: "🦊",
    role: "Tetrarch of Galilee who killed John the Baptist",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 14:1-12", "Mark 6:14-29", "Luke 23:6-12"],
    archetypes: ["Oppressor", "Tragic Hero"],
    dna: { faith: 2, humility: 2, courage: 3, wisdom: 4, compassion: 3, fear: 7, pride: 8, greed: 7 },
    quickCard: { archetype: "Tragic Hero", strength: "Was fascinated by John the Baptist and initially protected him", weakness: "Slave to his passions and social pressure", mindset: "I was intrigued by the truth but too enslaved to pleasure to embrace it.", keyLesson: "Being fascinated by truth without submitting to it leads to tragic moral failure.", keyVerse: "Herod feared John and protected him, knowing him to be a righteous and holy man.", keyVerseRef: "Mark 6:20" },
    storyArc: "The tetrarch who stole his brother's wife, was fascinated by John the Baptist yet beheaded him to save face at a party, and later mocked Jesus at His trial.",
    therapyView: { drivingFears: ["Public humiliation", "Losing face before peers", "The supernatural"], coreMotivations: ["Pleasure", "Social approval", "Political survival"], relationalStyle: "Pleasure-driven; trapped by commitments made in moments of weakness", blindSpots: ["Confused fascination with faith", "Let a rash oath destroy a righteous man"], healingMoments: ["None recorded—he mocked Jesus and was eventually exiled"] },
    strengths: ["Initially protected John", "Recognized John's righteousness"],
    weaknesses: ["Lust", "Moral cowardice", "Slave to peer pressure", "Made rash oaths"],
    journey: [
      { phase: "Testing", description: "Heard John preach and was disturbed yet fascinated." },
      { phase: "Failure", description: "Beheaded John to fulfill a rash promise made at a banquet." },
      { phase: "Legacy", description: "Mocked Jesus at His trial; was eventually exiled by Rome." }
    ],
    relationships: [
      { name: "John the Baptist", role: "Prophet he imprisoned and beheaded" },
      { name: "Herodias", role: "Brother's wife whom he married unlawfully" },
      { name: "Jesus", role: "The one he mocked at trial" }
    ],
    lessonsAndReflection: ["Fascination with truth is not the same as faith.", "Rash promises can have devastating consequences.", "Peer pressure can lead even the powerful to commit atrocities."],
    relatedCharacters: ["john-the-baptist", "jesus", "pilate", "herod-the-great"],
    situations: [{
      id: "herod-antipas-john", title: "Beheading John to Save Face", category: "Fear", reference: "Mark 6:14-29",
      keyVerse: "The king was greatly distressed, but because of his oaths and his dinner guests, he did not want to refuse her. (Mark 6:26)",
      situation: "At his birthday banquet, Herod rashly promises Salome anything she wants; coached by Herodias, she asks for John's head.",
      pressure: "His oath was made before powerful guests; breaking it would mean public humiliation.",
      innerBattle: "I know this is wrong—I protected this man—but I cannot lose face before my guests.",
      response: "He ordered John beheaded in prison and the head brought on a platter.",
      outcome: "John was murdered; Herod was haunted by guilt and later thought Jesus was John risen.",
      lesson: "A moment of weakness in the wrong company can lead to irreversible evil.",
      traitRevealed: "Moral cowardice under social pressure",
      spiritualPrinciple: "Better to break a sinful promise than to fulfill it.",
      reflectionQuestions: ["Have I made commitments in moments of weakness that I know are wrong?", "Am I more afraid of human opinion than divine judgment?"],
      dnaSnapshot: { fear: 8, courage: 2, pride: 8 }
    }]
  },

  // 28. Caiaphas
  {
    id: "caiaphas",
    name: "Caiaphas",
    meaning: "Rock, depression",
    emoji: "🏛️",
    role: "High priest who orchestrated Jesus' trial and crucifixion",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["John 11:49-53", "Matthew 26:57-68", "John 18:12-14"],
    archetypes: ["Oppressor", "Priest", "Strategist"],
    dna: { faith: 2, humility: 1, courage: 5, wisdom: 6, compassion: 1, fear: 6, pride: 9, greed: 6 },
    quickCard: { archetype: "Strategist", strength: "Political shrewdness", weakness: "Used religious authority to murder an innocent man", mindset: "It is better that one man die than that the whole nation perish.", keyLesson: "Religious authority without genuine faith becomes the most dangerous form of oppression.", keyVerse: "It is better for you that one man die for the people than that the whole nation perish.", keyVerseRef: "John 11:50" },
    storyArc: "The high priest who unknowingly prophesied the substitutionary atonement while plotting to murder Jesus, orchestrated an illegal trial, and delivered Him to Pilate.",
    therapyView: { drivingFears: ["Roman intervention", "Loss of religious authority", "Popular uprising"], coreMotivations: ["Preserving the temple establishment", "Maintaining political power"], relationalStyle: "Calculating and politically strategic; used religious office for political ends", blindSpots: ["Spoke prophecy without recognizing it", "Sacrificed the Messiah to save a system"], healingMoments: ["None recorded—his prophecy was unwitting"] },
    strengths: ["Political acumen", "Held office for 18 years"],
    weaknesses: ["Used religion as a tool of power", "Orchestrated judicial murder", "Blind to his own prophecy"],
    journey: [
      { phase: "Calling", description: "Appointed high priest by Roman authorities." },
      { phase: "Failure", description: "Orchestrated Jesus' arrest, illegal trial, and delivery to Pilate." },
      { phase: "Legacy", description: "Unknowingly prophesied substitutionary atonement while condemning the Messiah." }
    ],
    relationships: [
      { name: "Jesus", role: "The one he condemned" },
      { name: "Annas", role: "Father-in-law and former high priest" },
      { name: "Pilate", role: "Roman governor he pressured" }
    ],
    lessonsAndReflection: ["Religious position does not guarantee spiritual sight.", "God can use even the enemies of Christ to fulfill His purposes.", "Pragmatism without righteousness leads to injustice."],
    relatedCharacters: ["jesus", "pilate", "peter"],
    situations: [{
      id: "caiaphas-prophecy", title: "Unwitting Prophecy of Atonement", category: "Power and Success", reference: "John 11:49-53",
      keyVerse: "He did not say this on his own, but as high priest that year he prophesied that Jesus would die for the Jewish nation. (John 11:51)",
      situation: "The Sanhedrin debates what to do about Jesus after the raising of Lazarus draws massive crowds.",
      pressure: "Fear that Rome will destroy the nation if Jesus' movement grows.",
      innerBattle: "This man must be eliminated before His popularity destroys our entire system.",
      response: "Caiaphas declares it expedient for one man to die for the people—unwittingly prophesying the atonement.",
      outcome: "From that day on, they plotted to kill Jesus; God used even their evil for redemptive purposes.",
      lesson: "God's plan cannot be thwarted—even the schemes of His enemies serve His purposes.",
      traitRevealed: "Political calculation that inadvertently expressed divine truth",
      spiritualPrinciple: "God is sovereign over the plans of those who oppose Him.",
      reflectionQuestions: ["Am I making decisions based on political calculation rather than spiritual discernment?", "Could I be working against God's purposes while thinking I am protecting them?"],
      dnaSnapshot: { pride: 9, wisdom: 6, faith: 1 }
    }]
  },

  // 29. Joseph of Arimathea
  {
    id: "joseph-of-arimathea",
    name: "Joseph of Arimathea",
    meaning: "He will add / From Arimathea",
    emoji: "🪨",
    role: "Wealthy Sanhedrin member who buried Jesus",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 27:57-60", "Mark 15:42-46", "John 19:38-42"],
    archetypes: ["Servant", "Seeker"],
    dna: { faith: 7, humility: 7, courage: 8, wisdom: 7, compassion: 8, fear: 4, pride: 3, greed: 1 },
    quickCard: { archetype: "Servant", strength: "Stepped forward at the most dangerous moment", weakness: "Was a secret disciple until the crucifixion", mindset: "I hid my faith in life, but I will honor Him in death.", keyLesson: "Sometimes the moment that demands the most courage finally reveals our faith.", keyVerse: "Joseph went boldly to Pilate and asked for Jesus' body.", keyVerseRef: "Mark 15:43" },
    storyArc: "A wealthy Sanhedrin member who was a secret disciple went boldly to Pilate after the crucifixion, claimed Jesus' body, and placed it in his own new tomb.",
    therapyView: { drivingFears: ["Exposure as a Jesus follower", "Loss of position"], coreMotivations: ["Waiting for God's kingdom", "Justice", "Compassion for Jesus"], relationalStyle: "Cautious until conviction compelled bold action", blindSpots: ["Secrecy allowed him to avoid the cost of public discipleship too long"], healingMoments: ["Boldly going to Pilate", "Giving Jesus a dignified burial"] },
    strengths: ["Courage at the critical moment", "Generosity with his own tomb", "Dissented from the Council"],
    weaknesses: ["Secret faith for an extended period"],
    journey: [
      { phase: "Calling", description: "A good and righteous man waiting for the kingdom of God." },
      { phase: "Testing", description: "The crucifixion forced a choice between secrecy and public identification." },
      { phase: "Legacy", description: "Went boldly to Pilate, buried Jesus in his own tomb, fulfilling Isaiah 53:9." }
    ],
    relationships: [
      { name: "Jesus", role: "Lord whose body he buried" },
      { name: "Nicodemus", role: "Fellow secret disciple who helped with the burial" },
      { name: "Pilate", role: "Governor he boldly approached" }
    ],
    lessonsAndReflection: ["The cross turns secret disciples into bold ones.", "It is never too late to publicly identify with Christ.", "God uses wealth and position for His purposes when we surrender them."],
    relatedCharacters: ["nicodemus", "jesus", "pilate"],
    situations: [{
      id: "joseph-arimathea-burial", title: "Boldly Claiming the Body", category: "Sacrifice", reference: "Mark 15:42-46",
      keyVerse: "Joseph...went boldly to Pilate and asked for Jesus' body. (Mark 15:43)",
      situation: "After the crucifixion, Jesus' body hangs on the cross with no one to claim it.",
      pressure: "Requesting a crucified criminal's body would permanently identify him as a follower.",
      innerBattle: "I was silent during His life. Can I at least honor Him in His death?",
      response: "He went boldly to Pilate, asked for the body, and laid it in his own new tomb.",
      outcome: "Jesus was buried with dignity, fulfilling prophecy; the tomb became the site of the resurrection.",
      lesson: "The boldest acts of faith sometimes come from the most unlikely people at the most unlikely times.",
      traitRevealed: "Courage that emerged when the cost of silence exceeded the cost of action",
      spiritualPrinciple: "God uses our resources—even our tombs—for His resurrection purposes.",
      reflectionQuestions: ["What am I holding back from God that He could use?", "Is the cost of silence greater than the cost of speaking up?"],
      dnaSnapshot: { courage: 9, faith: 8, fear: 3 }
    }]
  },

  // 30. Mary of Bethany
  {
    id: "mary-of-bethany",
    name: "Mary of Bethany",
    meaning: "Beloved / Bitter",
    emoji: "🫙",
    role: "Sister of Martha and Lazarus, anointed Jesus' feet",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 10:38-42", "John 11:1-44", "John 12:1-8"],
    archetypes: ["Servant", "Seeker"],
    dna: { faith: 9, humility: 9, courage: 7, wisdom: 8, compassion: 9, fear: 2, pride: 1, greed: 1 },
    quickCard: { archetype: "Servant", strength: "Extravagant worship and deep spiritual perception", weakness: "Could appear impractical to task-focused people", mindset: "Nothing is too costly for the one who is worthy of everything.", keyLesson: "Extravagant devotion is never wasted on Jesus.", keyVerse: "She has done a beautiful thing to me.", keyVerseRef: "Mark 14:6" },
    storyArc: "A woman who chose to sit at Jesus' feet, wept at His feet when Lazarus died, and poured a year's wages of perfume on Jesus—declared by Him to be remembered wherever the gospel is preached.",
    therapyView: { drivingFears: ["Being misunderstood for her devotion", "Losing Jesus"], coreMotivations: ["Intimacy with Jesus", "Worship above productivity"], relationalStyle: "Deeply contemplative and emotionally expressive in worship", blindSpots: ["Could be perceived as neglectful of practical duties"], healingMoments: ["Jesus defending her choice", "Jesus weeping at Lazarus' tomb", "Jesus declaring her anointing would be remembered forever"] },
    strengths: ["Deep spiritual perception", "Extravagant worship", "Courage to defy social norms"],
    weaknesses: ["Perceived impracticality"],
    journey: [
      { phase: "Calling", description: "Chose the 'better part' by sitting at Jesus' feet." },
      { phase: "Testing", description: "Grieved Lazarus' death and confronted Jesus." },
      { phase: "Legacy", description: "Anointed Jesus with costly perfume—remembered wherever the gospel is preached." }
    ],
    relationships: [
      { name: "Jesus", role: "Lord and teacher" },
      { name: "Martha", role: "Sister" },
      { name: "Lazarus", role: "Brother" }
    ],
    lessonsAndReflection: ["Worship is never wasteful.", "Sitting at Jesus' feet is the better part.", "Extravagant love understands what others miss."],
    relatedCharacters: ["jesus", "martha", "lazarus"],
    situations: [{
      id: "mary-bethany-anointing", title: "The Extravagant Anointing", category: "Sacrifice", reference: "John 12:1-8",
      keyVerse: "Leave her alone. It was intended that she should save this perfume for the day of my burial. (John 12:7)",
      situation: "Six days before Passover, Mary pours a pint of pure nard—worth a year's wages—on Jesus' feet.",
      pressure: "Judas and others criticize the waste; the cost was enormous.",
      innerBattle: "Will others understand, or will they see only waste?",
      response: "She poured out the perfume without hesitation, an act of prophetic worship.",
      outcome: "Jesus defended her, declaring it preparation for His burial and promising it would be remembered worldwide.",
      lesson: "Extravagant worship flows from deep understanding; those closest to Jesus give most freely.",
      traitRevealed: "Prophetic devotion that defied economic logic",
      spiritualPrinciple: "The deepest worship looks wasteful to those who do not understand the worth of the King.",
      reflectionQuestions: ["What is my most costly offering to Jesus?", "Am I holding back from extravagant worship because of what others might think?"],
      dnaSnapshot: { faith: 10, humility: 9, courage: 8 }
    }]
  },

  // 31. The Centurion (Matthew 8)
  {
    id: "centurion-matthew8",
    name: "The Centurion",
    meaning: "Commander of a hundred soldiers",
    emoji: "🎖️",
    role: "Roman centurion with extraordinary faith",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 8:5-13", "Luke 7:1-10"],
    archetypes: ["Warrior", "Seeker"],
    dna: { faith: 10, humility: 9, courage: 8, wisdom: 8, compassion: 9, fear: 2, pride: 1, greed: 1 },
    quickCard: { archetype: "Warrior", strength: "Faith that astonished Jesus Himself", weakness: "No recorded weakness", mindset: "I understand authority. Just say the word.", keyLesson: "Understanding authority is the foundation of extraordinary faith.", keyVerse: "Truly I tell you, I have not found anyone in Israel with such great faith.", keyVerseRef: "Matthew 8:10" },
    storyArc: "A Roman officer approached Jesus for his suffering servant, told Jesus He need not come in person—just speak the word. Jesus marveled at his faith, the greatest in all Israel.",
    therapyView: { drivingFears: ["Losing his servant"], coreMotivations: ["Compassion for his servant", "Understanding of authority"], relationalStyle: "Authoritative yet humble; cared deeply for those under his command", blindSpots: ["None recorded"], healingMoments: ["Jesus' public commendation of his faith", "His servant healed at that very hour"] },
    strengths: ["Extraordinary faith", "Compassion for a servant", "Humility before Jesus"],
    weaknesses: ["No weaknesses recorded"],
    journey: [
      { phase: "Calling", description: "A Gentile who recognized Jesus' authority." },
      { phase: "Testing", description: "His beloved servant was suffering; he sought Jesus." },
      { phase: "Legacy", description: "His faith was held up as the greatest in Israel—by Jesus Himself." }
    ],
    relationships: [
      { name: "Jesus", role: "The one whose authority he recognized" },
      { name: "His servant", role: "The one he sought healing for" }
    ],
    lessonsAndReflection: ["Faith is not about proximity but trust in authority.", "Compassion for those under our care marks true leadership.", "God's greatest commendation goes to unexpected people."],
    relatedCharacters: ["jesus", "cornelius"],
    situations: [{
      id: "centurion-faith", title: "Just Say the Word", category: "Faith Testing", reference: "Matthew 8:5-13",
      keyVerse: "Just say the word, and my servant will be healed. (Matthew 8:8)",
      situation: "A centurion comes to Jesus because his servant is paralyzed and in terrible suffering.",
      pressure: "As a Roman Gentile, approaching a Jewish rabbi was culturally risky.",
      innerBattle: "I am not worthy to have Him enter my home, but I know His word alone is sufficient.",
      response: "He told Jesus not to come physically—just speak the word, for he understood authority.",
      outcome: "Jesus marveled, commended his faith as the greatest in Israel, and healed the servant.",
      lesson: "Understanding authority leads to extraordinary faith.",
      traitRevealed: "Faith born from understanding authority",
      spiritualPrinciple: "True faith trusts the word of Jesus without requiring His physical presence.",
      reflectionQuestions: ["Do I truly believe Jesus' word is enough?", "Am I exercising compassion for those under my authority?"],
      dnaSnapshot: { faith: 10, humility: 9 }
    }]
  },

  // 32. Jairus
  {
    id: "jairus",
    name: "Jairus",
    meaning: "He will enlighten",
    emoji: "🏘️",
    role: "Synagogue ruler whose daughter was raised from the dead",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Mark 5:21-43", "Luke 8:40-56"],
    archetypes: ["Patriarch", "Seeker"],
    dna: { faith: 7, humility: 8, courage: 7, wisdom: 6, compassion: 9, fear: 5, pride: 3, greed: 1 },
    quickCard: { archetype: "Patriarch", strength: "Desperate faith that overcame social barriers", weakness: "Fear when the news of death arrived", mindset: "My position means nothing if my daughter dies.", keyLesson: "Desperation can drive us past pride into the arms of the only one who can help.", keyVerse: "Don't be afraid; just believe.", keyVerseRef: "Mark 5:36" },
    storyArc: "A synagogue leader fell at Jesus' feet for his dying daughter, was told she had died while Jesus delayed, heard 'Just believe,' and witnessed his daughter raised to life.",
    therapyView: { drivingFears: ["Losing his daughter", "Public association with Jesus"], coreMotivations: ["Father's love", "Desperation overcoming pride"], relationalStyle: "A father willing to humble himself publicly for his child", blindSpots: ["Fear nearly overwhelmed his faith when told his daughter had died"], healingMoments: ["Jesus' words: 'Don't be afraid; just believe'", "Seeing his daughter alive"] },
    strengths: ["Desperate faith", "Humility", "Father's love"],
    weaknesses: ["Fear when circumstances worsened"],
    journey: [
      { phase: "Calling", description: "His daughter's illness drove him to Jesus despite his position." },
      { phase: "Testing", description: "Told his daughter had died while Jesus delayed." },
      { phase: "Legacy", description: "Witnessed Jesus raise his daughter: 'Little girl, get up.'" }
    ],
    relationships: [
      { name: "Jesus", role: "Healer who raised his daughter" },
      { name: "His daughter", role: "The twelve-year-old who was raised" }
    ],
    lessonsAndReflection: ["Desperation is the doorway to faith.", "God's delays are not denials.", "Fear and faith can coexist; Jesus meets us in both."],
    relatedCharacters: ["jesus", "lazarus"],
    situations: [{
      id: "jairus-daughter", title: "Don't Be Afraid; Just Believe", category: "Loss", reference: "Mark 5:21-43",
      keyVerse: "Don't be afraid; just believe. (Mark 5:36)",
      situation: "Jairus begs Jesus to heal his dying daughter, but messengers arrive saying she has died.",
      pressure: "The worst possible news arrives when he thought help was on the way.",
      innerBattle: "It is too late. She is gone. Why bother the teacher anymore?",
      response: "Jesus told him not to fear but to believe; Jairus followed Jesus to his house.",
      outcome: "Jesus raised his daughter with 'Talitha koum—Little girl, I say to you, get up.'",
      lesson: "When things move from bad to impossible, that is when Jesus does His greatest work.",
      traitRevealed: "Faith that persisted past the point of hope",
      spiritualPrinciple: "Jesus specializes in situations beyond human remedy.",
      reflectionQuestions: ["Am I willing to keep believing when circumstances say it is too late?", "How do I respond when God's timing differs from my urgency?"],
      dnaSnapshot: { faith: 7, fear: 6, courage: 7 }
    }]
  },

  // 33. The Rich Young Ruler
  {
    id: "rich-young-ruler",
    name: "The Rich Young Ruler",
    meaning: "Unnamed; represents wealth's hold on the heart",
    emoji: "💍",
    role: "Wealthy young man who walked away from Jesus",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Matthew 19:16-26", "Mark 10:17-27", "Luke 18:18-27"],
    archetypes: ["Tragic Hero", "Seeker"],
    dna: { faith: 4, humility: 4, courage: 4, wisdom: 5, compassion: 4, fear: 6, pride: 6, greed: 8 },
    quickCard: { archetype: "Tragic Hero", strength: "Genuine spiritual hunger and moral achievement", weakness: "Attachment to wealth outweighed desire for eternal life", mindset: "I have done everything right—except surrender the one thing I love most.", keyLesson: "The thing we refuse to surrender reveals what we truly worship.", keyVerse: "He went away sad, because he had great wealth.", keyVerseRef: "Matthew 19:22" },
    storyArc: "A morally upright young man ran to Jesus asking about eternal life. Jesus loved him and told him to sell everything. He walked away sad—the only person in the Gospels who came to Jesus and left worse off.",
    therapyView: { drivingFears: ["Not having enough", "Loss of identity tied to wealth"], coreMotivations: ["Desire for eternal life", "Moral achievement", "Security through wealth"], relationalStyle: "Eager and sincere, but ultimately unwilling to pay the full cost", blindSpots: ["Did not recognize his wealth as an idol", "Thought moral effort could earn eternal life"], healingMoments: ["Jesus looked at him and loved him—but he walked away from that love"] },
    strengths: ["Moral integrity", "Genuine spiritual interest"],
    weaknesses: ["Idolatry of wealth", "Chose possessions over Jesus"],
    journey: [
      { phase: "Calling", description: "Ran to Jesus and knelt, asking about eternal life." },
      { phase: "Testing", description: "Jesus told him to sell everything and follow." },
      { phase: "Failure", description: "He went away sad, unable to part with his wealth." }
    ],
    relationships: [
      { name: "Jesus", role: "The one who loved him and tested him" }
    ],
    lessonsAndReflection: ["The thing we will not surrender is the thing that owns us.", "Moral goodness without heart surrender is not enough.", "Jesus loves us enough to ask for everything."],
    relatedCharacters: ["jesus", "zacchaeus", "matthew-levi"],
    situations: [{
      id: "rich-young-ruler-walk-away", title: "Walking Away from Jesus", category: "Temptation", reference: "Mark 10:17-27",
      keyVerse: "Jesus looked at him and loved him. 'One thing you lack,' he said. (Mark 10:21)",
      situation: "A wealthy young man who has kept the commandments asks what he still lacks for eternal life.",
      pressure: "Jesus' demand was total—sell everything and follow.",
      innerBattle: "I want eternal life, but I cannot imagine life without my wealth.",
      response: "His face fell, and he went away sorrowful, for he had great possessions.",
      outcome: "He is the only person in the Gospels who came to Jesus seeking and left without receiving.",
      lesson: "The idol we refuse to release becomes the barrier between us and the life Jesus offers.",
      traitRevealed: "Wealth as an idol that outweighed even desire for God",
      spiritualPrinciple: "Jesus does not negotiate on lordship; He asks for everything or nothing.",
      reflectionQuestions: ["What is the one thing Jesus might ask me to surrender?", "Am I willing to walk away sad, or will I choose to follow?"],
      dnaSnapshot: { greed: 9, faith: 3, fear: 7 }
    }]
  },

  // 34. Bartimaeus
  {
    id: "bartimaeus",
    name: "Bartimaeus",
    meaning: "Son of Timaeus",
    emoji: "👁️",
    role: "Blind beggar healed by Jesus near Jericho",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Mark 10:46-52", "Luke 18:35-43"],
    archetypes: ["Survivor", "Seeker"],
    dna: { faith: 9, humility: 7, courage: 8, wisdom: 6, compassion: 5, fear: 2, pride: 2, greed: 1 },
    quickCard: { archetype: "Seeker", strength: "Persistent faith that refused to be silenced", weakness: "Had nothing to offer—only need", mindset: "I have nothing but my need and my voice.", keyLesson: "Persistent, desperate faith gets Jesus' attention.", keyVerse: "Your faith has healed you.", keyVerseRef: "Mark 10:52" },
    storyArc: "A blind beggar heard Jesus passing, cried out despite the crowd's rebuke, was called by Jesus, threw off his cloak, received his sight, and immediately followed Jesus.",
    therapyView: { drivingFears: ["Permanent blindness and poverty", "Being silenced"], coreMotivations: ["Desperate desire to see", "Faith in Jesus as Son of David"], relationalStyle: "Urgent and persistent; would not be silenced", blindSpots: ["None recorded"], healingMoments: ["Jesus stopping and calling for him", "Receiving sight"] },
    strengths: ["Persistent faith", "Theological insight (Son of David)", "Immediate discipleship"],
    weaknesses: ["No recorded weaknesses"],
    journey: [
      { phase: "Calling", description: "Heard Jesus was passing and cried out for mercy." },
      { phase: "Testing", description: "The crowd rebuked him and told him to be quiet." },
      { phase: "Legacy", description: "Received his sight and followed Jesus along the road." }
    ],
    relationships: [
      { name: "Jesus", role: "Son of David who healed him" },
      { name: "The crowd", role: "Tried to silence him" }
    ],
    lessonsAndReflection: ["Do not let anyone silence your cry to Jesus.", "Desperate faith is exactly what Jesus honors.", "Once you receive from Jesus, the proper response is to follow."],
    relatedCharacters: ["jesus", "zacchaeus"],
    situations: [{
      id: "bartimaeus-cry", title: "Refusing to Be Silenced", category: "Faith Testing", reference: "Mark 10:46-52",
      keyVerse: "Jesus, Son of David, have mercy on me! (Mark 10:47)",
      situation: "Bartimaeus hears Jesus is passing through Jericho and begins shouting for mercy.",
      pressure: "The crowd sternly told him to be quiet.",
      innerBattle: "They say be quiet—but this may be my only chance.",
      response: "He shouted all the more loudly, 'Son of David, have mercy on me!'",
      outcome: "Jesus stopped, called for him, and healed him.",
      lesson: "The crowd will try to silence desperate faith, but Jesus stops for those who cry out.",
      traitRevealed: "Persistence born of desperation and faith",
      spiritualPrinciple: "Jesus never rebukes desperate faith—He rewards it.",
      reflectionQuestions: ["What is silencing my cry to Jesus?", "Am I willing to look undignified in pursuit of what I truly need from God?"],
      dnaSnapshot: { faith: 9, courage: 9 }
    }]
  },

  // 35. Legion/Gadarene Demoniac
  {
    id: "gadarene-demoniac",
    name: "The Gadarene Demoniac",
    meaning: "Unnamed; known by the demon's name Legion",
    emoji: "🐷",
    role: "Man delivered from thousands of demons by Jesus",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Mark 5:1-20", "Luke 8:26-39"],
    archetypes: ["Survivor", "Redeemed"],
    dna: { faith: 8, humility: 8, courage: 6, wisdom: 5, compassion: 7, fear: 3, pride: 1, greed: 1 },
    quickCard: { archetype: "Survivor", strength: "After deliverance, became the first missionary to the Decapolis", weakness: "Completely enslaved before deliverance", mindset: "The one who set me free is the one I must tell the world about.", keyLesson: "No bondage is too severe for Jesus to break.", keyVerse: "Go home to your own people and tell them how much the Lord has done for you.", keyVerseRef: "Mark 5:19" },
    storyArc: "A man so tormented by demons he lived naked among tombs was completely delivered by Jesus and commissioned to go home and testify—becoming a missionary to ten cities.",
    therapyView: { drivingFears: ["Before: complete enslavement", "After: being separated from Jesus"], coreMotivations: ["After deliverance: gratitude, testimony, mission"], relationalStyle: "Before: isolated and violent; After: composed, clothed, communicative", blindSpots: ["Wanted to stay with Jesus rather than go to the harder mission of going home"], healingMoments: ["Being clothed and in his right mind", "Jesus commissioning him as a witness"] },
    strengths: ["Living testimony of total transformation", "Obedience to go home"],
    weaknesses: ["Completely helpless before deliverance"],
    journey: [
      { phase: "Calling", description: "Jesus crossed the sea specifically to reach this one man." },
      { phase: "Testing", description: "Lived among tombs, enslaved by a legion of demons." },
      { phase: "Refinement", description: "Jesus cast out the demons; found clothed and in his right mind." },
      { phase: "Legacy", description: "Sent to the Decapolis as a missionary; all the people were amazed." }
    ],
    relationships: [
      { name: "Jesus", role: "Deliverer who crossed the sea for him" },
      { name: "The Decapolis", role: "Ten cities he evangelized" }
    ],
    lessonsAndReflection: ["Jesus will cross any sea to reach one person in bondage.", "The most dramatic transformations make the most powerful testimonies.", "Sometimes Jesus sends us home instead of letting us stay in comfort."],
    relatedCharacters: ["jesus", "samaritan-woman"],
    situations: [{
      id: "gadarene-delivered", title: "From Legion to Missionary", category: "Restoration", reference: "Mark 5:1-20",
      keyVerse: "Go home to your own people and tell them how much the Lord has done for you. (Mark 5:19)",
      situation: "A man possessed by a legion of demons lives naked among tombs, screaming and cutting himself.",
      pressure: "No chain could hold him; the community had given up on him.",
      innerBattle: "None—he had no autonomy. Jesus fought the battle for him.",
      response: "Jesus commanded the demons out; they entered a herd of pigs that rushed into the sea.",
      outcome: "Found sitting, clothed, and in his right mind. Sent home to testify.",
      lesson: "Our worst bondage becomes our most powerful testimony when Jesus delivers us.",
      traitRevealed: "Total transformation by divine power",
      spiritualPrinciple: "What man cannot bind, Jesus can free with a word.",
      reflectionQuestions: ["What chains has Jesus broken that I should be testifying about?", "Am I willing to go home and share my story?"],
      dnaSnapshot: { faith: 8, humility: 9 }
    }]
  },

  // 36. The Prodigal Son
  {
    id: "prodigal-son",
    name: "The Prodigal Son",
    meaning: "Parable character representing the repentant sinner",
    emoji: "🐷",
    role: "Younger son in Jesus' parable of the prodigal son",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 15:11-24"],
    archetypes: ["Redeemed", "Exile"],
    dna: { faith: 6, humility: 7, courage: 6, wisdom: 4, compassion: 4, fear: 5, pride: 6, greed: 7 },
    quickCard: { archetype: "Redeemed", strength: "Came to his senses and returned in humility", weakness: "Reckless selfishness and entitled demand for inheritance", mindset: "I have sinned against heaven and against you.", keyLesson: "No matter how far we run, the Father is watching for our return.", keyVerse: "But while he was still a long way off, his father saw him and was filled with compassion.", keyVerseRef: "Luke 15:20" },
    storyArc: "A young man demands his inheritance early, squanders it, ends up feeding pigs, comes to his senses, returns expecting punishment, and finds his father running to embrace him.",
    therapyView: { drivingFears: ["Missing out on life", "Being trapped", "Later: rejection upon return"], coreMotivations: ["Pleasure and autonomy", "Later: survival, then repentance"], relationalStyle: "Self-centered before; humble and grateful after", blindSpots: ["Confused freedom with autonomy from the father"], healingMoments: ["Coming to his senses among the pigs", "The father running to meet him", "The robe, ring, and feast"] },
    strengths: ["Capacity for genuine repentance", "Humility to return"],
    weaknesses: ["Entitlement", "Recklessness", "Selfishness"],
    journey: [
      { phase: "Calling", description: "A son in a loving father's house—had everything he needed." },
      { phase: "Resistance", description: "Demanded his inheritance and left for a distant country." },
      { phase: "Failure", description: "Wasted everything and ended up feeding pigs." },
      { phase: "Refinement", description: "Came to his senses and prepared a confession." },
      { phase: "Legacy", description: "The father restored him fully—robe, ring, sandals, and feast." }
    ],
    relationships: [
      { name: "The Father", role: "Represents God's gracious, watching love" },
      { name: "The Older Brother", role: "Resentful sibling who refused to celebrate" }
    ],
    lessonsAndReflection: ["God's grace runs to meet us.", "Rock bottom can be the foundation for return.", "The Father restores identity, not just access."],
    relatedCharacters: ["older-brother", "jesus", "zacchaeus"],
    situations: [{
      id: "prodigal-return", title: "Coming Home to a Running Father", category: "Restoration", reference: "Luke 15:17-24",
      keyVerse: "While he was still a long way off, his father saw him and was filled with compassion; he ran to his son. (Luke 15:20)",
      situation: "The younger son, starving in a pig pen, decides to return and beg to be a hired servant.",
      pressure: "Shame, fear of rejection, uncertainty about whether his father would acknowledge him.",
      innerBattle: "I am no longer worthy—but even my father's servants eat better than this.",
      response: "He rose and went to his father with a prepared confession.",
      outcome: "The father ran to him, embraced him, and restored him as a son—not a servant.",
      lesson: "Repentance is the doorway to restoration; God's response always exceeds our expectations.",
      traitRevealed: "Genuine repentance born from hitting rock bottom",
      spiritualPrinciple: "The Father does not demand perfection before restoring; He restores upon return.",
      reflectionQuestions: ["What pig pen has God used to bring me to my senses?", "Do I believe God will restore me, or do I expect only punishment?"],
      dnaSnapshot: { humility: 8, faith: 6, pride: 3 }
    }]
  },

  // 37. The Older Brother
  {
    id: "older-brother",
    name: "The Older Brother",
    meaning: "Parable character representing self-righteous resentment",
    emoji: "🚜",
    role: "Older son in Jesus' parable of the prodigal son",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 15:25-32"],
    archetypes: ["Tragic Hero"],
    dna: { faith: 4, humility: 2, courage: 5, wisdom: 4, compassion: 2, fear: 4, pride: 9, greed: 5 },
    quickCard: { archetype: "Tragic Hero", strength: "Dutiful service and obedience", weakness: "Self-righteous resentment that refused to celebrate grace", mindset: "I have slaved for you all these years and you never gave me even a goat.", keyLesson: "Obedience without love becomes a prison; duty without joy becomes resentment.", keyVerse: "My son, you are always with me, and everything I have is yours.", keyVerseRef: "Luke 15:31" },
    storyArc: "The dutiful older son who stayed home, worked faithfully, yet refused to celebrate when his wayward brother returned—revealing his obedience was transactional.",
    therapyView: { drivingFears: ["Being overlooked", "Sacrifice going unrecognized", "Grace being unfair"], coreMotivations: ["Recognition for labor", "Merit-based reward"], relationalStyle: "Transactional obedience; served for reward, not love", blindSpots: ["Did not realize he had access to everything", "Confused proximity with intimacy"], healingMoments: ["The father's gentle words: 'Everything I have is yours'—though the parable ends without his response"] },
    strengths: ["Consistency", "Duty", "Reliability"],
    weaknesses: ["Self-righteousness", "Resentment", "Inability to celebrate grace"],
    journey: [
      { phase: "Calling", description: "Stayed home and served his father faithfully." },
      { phase: "Testing", description: "Heard the celebration and refused to enter." },
      { phase: "Failure", description: "Revealed his heart: obedience was about reward, not relationship." }
    ],
    relationships: [
      { name: "The Father", role: "Father whose grace he resented" },
      { name: "The Prodigal Son", role: "Brother whose restoration he could not celebrate" }
    ],
    lessonsAndReflection: ["You can be in the father's house and still be far from his heart.", "Grace looks unfair to those who keep score.", "Resentful obedience is its own form of rebellion."],
    relatedCharacters: ["prodigal-son", "jesus", "jonah"],
    situations: [{
      id: "older-brother-refuses", title: "Refusing to Celebrate Grace", category: "Conflict", reference: "Luke 15:25-32",
      keyVerse: "The older brother became angry and refused to go in. (Luke 15:28)",
      situation: "The older brother returns from the field, hears music, learns his brother has returned, and refuses to join.",
      pressure: "His sense of fairness is violated; years of faithful service seem unrewarded.",
      innerBattle: "I did everything right, and he gets a party? This is unjust.",
      response: "He refused to enter and accused his father of favoritism.",
      outcome: "The father came out to plead with him, but the parable ends without resolution.",
      lesson: "Self-righteousness is as dangerous as rebellion because it blinds us to the father's love.",
      traitRevealed: "Resentment masked as faithfulness",
      spiritualPrinciple: "Grace offends the self-righteous because it cannot be earned.",
      reflectionQuestions: ["Am I resentful when God blesses someone I think deserves less?", "Is my obedience driven by love or by scorekeeping?"],
      dnaSnapshot: { pride: 9, compassion: 1, humility: 2 }
    }]
  },

  // 38. The Good Samaritan
  {
    id: "good-samaritan",
    name: "The Good Samaritan",
    meaning: "Parable character representing radical compassion",
    emoji: "🩹",
    role: "Parable character who showed mercy to a beaten traveler",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["Luke 10:25-37"],
    archetypes: ["Servant", "Redeemed"],
    dna: { faith: 8, humility: 8, courage: 8, wisdom: 7, compassion: 10, fear: 2, pride: 1, greed: 1 },
    quickCard: { archetype: "Servant", strength: "Compassion that crossed every social boundary", weakness: "None recorded—he is the moral exemplar of the parable", mindset: "Need knows no ethnicity; mercy knows no boundary.", keyLesson: "True neighborliness is defined by compassion in action, not by proximity or ethnicity.", keyVerse: "Go and do likewise.", keyVerseRef: "Luke 10:37" },
    storyArc: "An outsider Samaritan stops to help a beaten Jewish man on the Jericho road after a priest and Levite pass by, binding his wounds, paying for his care, and promising to return.",
    therapyView: { drivingFears: ["None stated—his compassion overrode all fear"], coreMotivations: ["Compassion that transcends tribal boundaries"], relationalStyle: "Hands-on, sacrificial, and follow-through oriented", blindSpots: ["None—he is presented as the ideal"], healingMoments: ["The act of binding wounds and paying for care"] },
    strengths: ["Radical compassion", "Practical generosity", "Follow-through"],
    weaknesses: ["None recorded"],
    journey: [
      { phase: "Calling", description: "Encountered a beaten man on the Jericho road." },
      { phase: "Testing", description: "As a Samaritan, helping a Jew would violate social norms." },
      { phase: "Legacy", description: "Jesus held him up as the definition of 'neighbor.'" }
    ],
    relationships: [
      { name: "The beaten traveler", role: "The one he rescued" },
      { name: "The innkeeper", role: "Partner in care he funded" }
    ],
    lessonsAndReflection: ["Mercy is defined by action, not intention.", "The most unlikely person may be the most faithful neighbor.", "Compassion costs something—time, money, risk."],
    relatedCharacters: ["jesus"],
    situations: [{
      id: "good-samaritan-rescue", title: "Mercy on the Jericho Road", category: "Sacrifice", reference: "Luke 10:30-37",
      keyVerse: "But a Samaritan, as he traveled, came where the man was; and when he saw him, he took pity on him. (Luke 10:33)",
      situation: "A man lies beaten and half-dead on the Jericho road. A priest and Levite pass by on the other side.",
      pressure: "Ethnic hostility between Jews and Samaritans; risk of robbers; ritual impurity concerns.",
      innerBattle: "This man's people despise mine—but he is dying. Can I walk past?",
      response: "He stopped, bandaged wounds, carried him to an inn, and paid for his care.",
      outcome: "Jesus declared him the true neighbor and told the expert in the law, 'Go and do likewise.'",
      lesson: "Love your neighbor is not a theory—it is a verb that costs something.",
      traitRevealed: "Compassion that transcended tribal hatred",
      spiritualPrinciple: "True religion is measured by mercy shown to those who cannot repay.",
      reflectionQuestions: ["Who is the beaten traveler in my path that I am walking past?", "Am I willing to let compassion cost me something?"],
      dnaSnapshot: { compassion: 10, courage: 8, humility: 8 }
    }]
  },

  // 39. The Woman Caught in Adultery
  {
    id: "woman-caught-in-adultery",
    name: "The Woman Caught in Adultery",
    meaning: "Unnamed; represents grace in the face of condemnation",
    emoji: "📿",
    role: "Woman brought to Jesus by Pharisees seeking to trap Him",
    era: "Gospels",
    testament: "NT",
    keyScriptures: ["John 8:1-11"],
    archetypes: ["Redeemed", "Survivor"],
    dna: { faith: 6, humility: 8, courage: 4, wisdom: 4, compassion: 5, fear: 8, pride: 3, greed: 2 },
    quickCard: { archetype: "Redeemed", strength: "Received grace that changed everything", weakness: "Caught in genuine sin", mindset: "I deserved stones, but He gave me a second chance.", keyLesson: "Jesus does not condone sin, but He refuses to let the self-righteous cast the first stone.", keyVerse: "Neither do I condemn you. Go now and leave your life of sin.", keyVerseRef: "John 8:11" },
    storyArc: "A woman caught in the act of adultery is dragged before Jesus by Pharisees hoping to trap Him. Jesus writes in the sand, challenges the sinless to cast the first stone, and when all leave, tells her He does not condemn her—go and sin no more.",
    therapyView: { drivingFears: ["Public execution", "Permanent shame", "Being defined by her worst moment"], coreMotivations: ["Survival", "Desire for mercy", "A fresh start"], relationalStyle: "Vulnerable and exposed; received grace in her most helpless state", blindSpots: ["We know nothing of her life before or after—only this moment"], healingMoments: ["Jesus standing between her and her accusers", "Hearing 'Neither do I condemn you'"] },
    strengths: ["Received grace", "Stayed when she could have fled"],
    weaknesses: ["Adultery", "We know no other details"],
    journey: [
      { phase: "Failure", description: "Caught in the act of adultery." },
      { phase: "Testing", description: "Dragged before Jesus as a pawn in a religious trap." },
      { phase: "Legacy", description: "Received Jesus' forgiveness and the command to leave her sin." }
    ],
    relationships: [
      { name: "Jesus", role: "The one who stood between her and death" },
      { name: "The Pharisees", role: "Accusers who used her as a trap" }
    ],
    lessonsAndReflection: ["Jesus stands between us and our accusers.", "Grace does not excuse sin—it empowers us to leave it.", "Those quickest to condemn often have their own sins."],
    relatedCharacters: ["jesus", "samaritan-woman"],
    situations: [{
      id: "woman-adultery-forgiven", title: "Stones Dropped, Grace Given", category: "Restoration", reference: "John 8:1-11",
      keyVerse: "Neither do I condemn you. Go now and leave your life of sin. (John 8:11)",
      situation: "Pharisees drag a woman caught in adultery before Jesus, quoting Moses' law of stoning.",
      pressure: "She faced immediate execution; Jesus faced a theological trap.",
      innerBattle: "I am about to die for my sin. Is there any hope?",
      response: "Jesus wrote on the ground, then said, 'Let any one of you who is without sin cast the first stone.'",
      outcome: "Every accuser left. Jesus told her He did not condemn her and to go and sin no more.",
      lesson: "Grace does not ignore sin—it addresses it with mercy and calls us to transformation.",
      traitRevealed: "Vulnerability that received undeserved grace",
      spiritualPrinciple: "Jesus is more interested in restoration than punishment.",
      reflectionQuestions: ["Am I more likely to cast stones or extend grace?", "Have I received Jesus' forgiveness and let it change how I live?"],
      dnaSnapshot: { humility: 9, faith: 6, fear: 4 }
    }]
  },

  // 40. Demas
  {
    id: "demas",
    name: "Demas",
    meaning: "Popular",
    emoji: "🌍",
    role: "Paul's co-worker who deserted him",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Colossians 4:14", "Philemon 1:24", "2 Timothy 4:10"],
    archetypes: ["Tragic Hero"],
    dna: { faith: 3, humility: 3, courage: 3, wisdom: 4, compassion: 4, fear: 6, pride: 5, greed: 7 },
    quickCard: { archetype: "Tragic Hero", strength: "Was once counted among Paul's co-workers", weakness: "Loved the present world more than the gospel", mindset: "The cost of following Christ is too high; the world offers comfort now.", keyLesson: "Proximity to greatness does not guarantee perseverance; the love of the world can pull anyone away.", keyVerse: "Demas, because he loved this world, has deserted me and has gone to Thessalonica.", keyVerseRef: "2 Timothy 4:10" },
    storyArc: "A man who served alongside Paul, was mentioned favorably in two letters, but ultimately deserted Paul during his final imprisonment because he loved the present world.",
    therapyView: { drivingFears: ["Suffering", "Missing out on worldly comforts", "The cost of persecution"], coreMotivations: ["Comfort", "Safety", "Worldly pleasure"], relationalStyle: "Fair-weather companion; present in easy seasons, absent in hard ones", blindSpots: ["Believed he could have both the world and the gospel", "Underestimated the pull of worldly desire"], healingMoments: ["None recorded—his story ends in desertion"] },
    strengths: ["Was once a faithful co-worker"],
    weaknesses: ["Loved the world", "Deserted Paul in his greatest need", "Failed to persevere"],
    journey: [
      { phase: "Calling", description: "Served as one of Paul's co-workers." },
      { phase: "Failure", description: "Deserted Paul because he loved the present world." },
      { phase: "Legacy", description: "His name became a warning about the danger of worldly love." }
    ],
    relationships: [
      { name: "Paul", role: "Apostle he served with and then deserted" },
      { name: "Luke", role: "Fellow co-worker who remained faithful" }
    ],
    lessonsAndReflection: ["Starting well does not guarantee finishing well.", "The love of the world is the most common cause of spiritual desertion.", "Perseverance requires loving Christ more than comfort."],
    relatedCharacters: ["paul", "mark-john-mark", "timothy"],
    situations: [{
      id: "demas-desertion", title: "Loving the World More Than the Mission", category: "Temptation", reference: "2 Timothy 4:10",
      keyVerse: "Demas, because he loved this world, has deserted me. (2 Timothy 4:10)",
      situation: "Paul is in his final imprisonment in Rome, facing execution, and Demas abandons him.",
      pressure: "Association with Paul meant danger; the world offered safety and pleasure.",
      innerBattle: "I cannot endure this anymore. The cost is too high. Thessalonica offers a normal life.",
      response: "He left Paul and went to Thessalonica, choosing the world over the mission.",
      outcome: "Paul noted his desertion in his final letter; Demas became a cautionary tale.",
      lesson: "The world's pull is strongest when the cost of faith is highest.",
      traitRevealed: "Love of the world that overcame love of Christ",
      spiritualPrinciple: "No one can serve two masters; eventually the world or Christ will win our loyalty.",
      reflectionQuestions: ["Is the pull of the world drawing me away from my calling?", "Will I be faithful when the cost increases?"],
      dnaSnapshot: { faith: 2, greed: 8, fear: 7 }
    }]
  },

  // 41. Alexander the Coppersmith
  {
    id: "alexander-coppersmith",
    name: "Alexander the Coppersmith",
    meaning: "Defender of men",
    emoji: "🔨",
    role: "Opponent of Paul who did him great harm",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["2 Timothy 4:14-15", "1 Timothy 1:20"],
    archetypes: ["Oppressor"],
    dna: { faith: 2, humility: 1, courage: 5, wisdom: 4, compassion: 1, fear: 4, pride: 8, greed: 6 },
    quickCard: { archetype: "Oppressor", strength: "Determined and persistent", weakness: "Used his determination to oppose the gospel", mindset: "I will use every means to oppose this message and this man.", keyLesson: "Opposition to God's servants is ultimately opposition to God Himself.", keyVerse: "Alexander the metalworker did me a great deal of harm. The Lord will repay him for what he has done.", keyVerseRef: "2 Timothy 4:14" },
    storyArc: "A coppersmith who actively opposed Paul's teaching, did him great personal harm, and was handed over to Satan by Paul to be taught not to blaspheme.",
    therapyView: { drivingFears: ["Loss of influence", "The gospel threatening his livelihood or status"], coreMotivations: ["Opposition to Paul's message", "Self-interest"], relationalStyle: "Aggressive and antagonistic toward gospel messengers", blindSpots: ["Believed he could oppose God's work without consequence"], healingMoments: ["None recorded"] },
    strengths: ["Determination", "Persistence"],
    weaknesses: ["Active opposition to the gospel", "Caused great harm to Paul"],
    journey: [
      { phase: "Failure", description: "Actively opposed Paul and his message." },
      { phase: "Legacy", description: "Paul warned Timothy about him; handed over to Satan to learn not to blaspheme." }
    ],
    relationships: [
      { name: "Paul", role: "Apostle he opposed" },
      { name: "Timothy", role: "Warned to beware of him" }
    ],
    lessonsAndReflection: ["Opposition to God's messengers has consequences.", "Some people will resist the truth no matter how clearly it is presented.", "We must be on guard against those who would harm the work of the gospel."],
    relatedCharacters: ["paul", "timothy", "demas"],
    situations: [{
      id: "alexander-opposition", title: "The Coppersmith's Harm", category: "Persecution", reference: "2 Timothy 4:14-15",
      keyVerse: "Alexander the metalworker did me a great deal of harm. (2 Timothy 4:14)",
      situation: "Alexander actively opposes Paul's teaching and does him great personal harm during his ministry.",
      pressure: "Paul faces opposition from within the community, not just from outsiders.",
      innerBattle: "From Paul's perspective: How do I handle someone who claims faith but actively undermines the gospel?",
      response: "Paul warned Timothy about Alexander and entrusted judgment to the Lord.",
      outcome: "Paul committed Alexander's case to God rather than seeking personal revenge.",
      lesson: "When opposition comes, we entrust judgment to God and warn others for their protection.",
      traitRevealed: "Persistent hostility toward the gospel",
      spiritualPrinciple: "Vengeance belongs to the Lord; our job is to warn and protect.",
      reflectionQuestions: ["How do I handle people who actively oppose my faith?", "Can I entrust my enemies to God rather than seeking revenge?"],
      dnaSnapshot: { pride: 8, faith: 1, compassion: 1 }
    }]
  },

  // 42. Agrippa
  {
    id: "agrippa",
    name: "King Agrippa",
    meaning: "Wild-horse tamer",
    emoji: "👑",
    role: "Jewish king who heard Paul's defense",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 25:13-27", "Acts 26:1-32"],
    archetypes: ["Tragic Hero", "King"],
    dna: { faith: 3, humility: 3, courage: 4, wisdom: 6, compassion: 4, fear: 5, pride: 7, greed: 5 },
    quickCard: { archetype: "Tragic Hero", strength: "Recognized the power of Paul's argument", weakness: "Stopped short of commitment", mindset: "You almost persuade me—but almost is not enough.", keyLesson: "Being almost persuaded is the same as being completely lost.", keyVerse: "Do you think that in such a short time you can persuade me to be a Christian?", keyVerseRef: "Acts 26:28" },
    storyArc: "A Jewish king with deep knowledge of Jewish customs heard Paul's passionate defense, acknowledged the power of his testimony, and declared Paul 'almost' persuaded him—but never crossed the line to faith.",
    therapyView: { drivingFears: ["Losing political status", "Roman displeasure", "The implications of belief"], coreMotivations: ["Political survival", "Intellectual curiosity", "Maintaining status quo"], relationalStyle: "Intellectually engaged but commitment-averse", blindSpots: ["Treated the gospel as an interesting argument rather than a life-or-death decision"], healingMoments: ["None—he remained 'almost' persuaded"] },
    strengths: ["Knowledge of Jewish customs", "Willingness to hear Paul", "Honesty about the power of Paul's argument"],
    weaknesses: ["Stopped short of commitment", "Prioritized politics over truth"],
    journey: [
      { phase: "Testing", description: "Heard Paul's defense and was deeply moved." },
      { phase: "Failure", description: "Acknowledged being almost persuaded but did not believe." },
      { phase: "Legacy", description: "His 'almost' became a warning about the danger of delay." }
    ],
    relationships: [
      { name: "Paul", role: "Apostle who testified before him" },
      { name: "Festus", role: "Roman governor who arranged the hearing" },
      { name: "Bernice", role: "Sister who accompanied him" }
    ],
    lessonsAndReflection: ["Almost persuaded is entirely lost.", "Intellectual appreciation of the gospel is not the same as faith.", "Delay in responding to truth can become permanent refusal."],
    relatedCharacters: ["paul", "felix", "festus"],
    situations: [{
      id: "agrippa-almost", title: "Almost Persuaded", category: "Faith Testing", reference: "Acts 26:24-29",
      keyVerse: "Do you think that in such a short time you can persuade me to be a Christian? (Acts 26:28)",
      situation: "Paul presents his defense before King Agrippa, passionately recounting his conversion and the resurrection.",
      pressure: "Agrippa's political position made public conversion impossible.",
      innerBattle: "Paul's words are powerful—but can I afford to believe?",
      response: "He acknowledged the power of Paul's argument but stopped short of belief.",
      outcome: "He told Festus that Paul could have been set free if he had not appealed to Caesar.",
      lesson: "The distance between 'almost' and 'altogether' is the distance between heaven and hell.",
      traitRevealed: "Intellectual conviction without the courage to commit",
      spiritualPrinciple: "The gospel demands a decision, not just admiration.",
      reflectionQuestions: ["Am I 'almost persuaded' about something God is calling me to?", "What is keeping me from full commitment?"],
      dnaSnapshot: { wisdom: 7, fear: 6, faith: 3 }
    }]
  },

  // 43. Felix
  {
    id: "felix",
    name: "Felix",
    meaning: "Happy, fortunate",
    emoji: "😬",
    role: "Roman governor who trembled at Paul's preaching but delayed",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 24:1-27"],
    archetypes: ["Tragic Hero", "Oppressor"],
    dna: { faith: 2, humility: 2, courage: 3, wisdom: 5, compassion: 3, fear: 6, pride: 7, greed: 8 },
    quickCard: { archetype: "Tragic Hero", strength: "Was genuinely moved by Paul's message", weakness: "Delayed his response while hoping for a bribe", mindset: "The truth terrifies me, but I will wait for a more convenient time.", keyLesson: "A convenient time to respond to God never comes for those who keep delaying.", keyVerse: "When I find it convenient, I will send for you.", keyVerseRef: "Acts 24:25" },
    storyArc: "A Roman governor who listened to Paul preach about righteousness, self-control, and judgment to come, trembled with conviction, but sent Paul away saying he would call for him at a convenient time—which never came.",
    therapyView: { drivingFears: ["Judgment", "Loss of control", "Political consequences of conversion"], coreMotivations: ["Bribes", "Political survival", "Curiosity without commitment"], relationalStyle: "Transactional; kept Paul imprisoned hoping for money", blindSpots: ["Believed he could control the timing of his response to God", "Let greed override conviction"], healingMoments: ["The moment he trembled—but he rejected it"] },
    strengths: ["Enough spiritual sensitivity to tremble"],
    weaknesses: ["Greed", "Procrastination", "Delayed response to conviction"],
    journey: [
      { phase: "Testing", description: "Heard Paul preach about righteousness and judgment and trembled." },
      { phase: "Failure", description: "Sent Paul away, saying he would call at a convenient time." },
      { phase: "Legacy", description: "Kept Paul imprisoned for two years, hoping for a bribe; left Paul bound as a favor to the Jews." }
    ],
    relationships: [
      { name: "Paul", role: "Prisoner who preached to him" },
      { name: "Drusilla", role: "Wife who listened with him" }
    ],
    lessonsAndReflection: ["Conviction ignored becomes conviction lost.", "There is no convenient time to respond to God—only the present moment.", "Greed can override even the strongest spiritual conviction."],
    relatedCharacters: ["paul", "agrippa", "festus"],
    situations: [{
      id: "felix-delay", title: "Trembling but Delaying", category: "Temptation", reference: "Acts 24:24-27",
      keyVerse: "As Paul talked about righteousness, self-control and the judgment to come, Felix was afraid and said, 'That is enough for now!' (Acts 24:25)",
      situation: "Felix and his wife Drusilla listen to Paul speak about faith in Christ, righteousness, self-control, and coming judgment.",
      pressure: "The message convicted him deeply—but responding would mean changing his corrupt lifestyle.",
      innerBattle: "This message terrifies me—but I am not ready to surrender.",
      response: "He trembled, dismissed Paul, and said he would send for him at a more convenient time.",
      outcome: "He kept Paul imprisoned for two years, frequently sending for him—but only hoping for a bribe.",
      lesson: "The most dangerous response to the gospel is 'later'—because later often never comes.",
      traitRevealed: "Conviction overridden by procrastination and greed",
      spiritualPrinciple: "Today is the day of salvation; tomorrow is promised to no one.",
      reflectionQuestions: ["Am I waiting for a convenient time to respond to God's conviction?", "What am I letting override the Holy Spirit's work in my heart?"],
      dnaSnapshot: { fear: 7, greed: 8, faith: 2 }
    }]
  },

  // 44. Festus
  {
    id: "festus",
    name: "Festus",
    meaning: "Festive, joyful",
    emoji: "⚖️",
    role: "Roman governor who succeeded Felix and heard Paul's defense",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 25:1-27", "Acts 26:24-32"],
    archetypes: ["Judge"],
    dna: { faith: 2, humility: 3, courage: 5, wisdom: 5, compassion: 4, fear: 4, pride: 6, greed: 4 },
    quickCard: { archetype: "Judge", strength: "Tried to handle Paul's case fairly by Roman standards", weakness: "Dismissed resurrection as madness", mindset: "This man speaks of things beyond my understanding—he must be mad.", keyLesson: "Worldly wisdom will always call the gospel foolishness.", keyVerse: "You are out of your mind, Paul! Your great learning is driving you insane!", keyVerseRef: "Acts 26:24" },
    storyArc: "A new Roman governor inherited Paul's case, was bewildered by Jewish religious disputes, arranged Paul's hearing before Agrippa, and declared Paul mad when he spoke of resurrection—yet acknowledged Paul could have been freed.",
    therapyView: { drivingFears: ["Making a political misstep", "Being seen as incompetent"], coreMotivations: ["Administrative competence", "Political favor", "Roman order"], relationalStyle: "Bureaucratic and pragmatic; more concerned with process than truth", blindSpots: ["Dismissed what he could not understand as insanity", "Could not see past the material world"], healingMoments: ["None recorded"] },
    strengths: ["Administrative fairness", "Acknowledged Paul had done nothing worthy of death"],
    weaknesses: ["Dismissed the gospel as madness", "Chose political expediency over justice"],
    journey: [
      { phase: "Testing", description: "Inherited Paul's case and tried to process it fairly." },
      { phase: "Failure", description: "Declared Paul mad when he spoke of resurrection." },
      { phase: "Legacy", description: "Acknowledged Paul could have been freed but sent him to Caesar instead." }
    ],
    relationships: [
      { name: "Paul", role: "Prisoner whose case he handled" },
      { name: "Agrippa", role: "King he invited to hear Paul" }
    ],
    lessonsAndReflection: ["The gospel will always sound like foolishness to those who rely only on human wisdom.", "Administrative fairness is not the same as spiritual discernment.", "Acknowledging innocence without acting on it is still injustice."],
    relatedCharacters: ["paul", "agrippa", "felix", "pilate"],
    situations: [{
      id: "festus-madness", title: "Paul, You Are Out of Your Mind!", category: "Rejection", reference: "Acts 26:24-32",
      keyVerse: "You are out of your mind, Paul! Your great learning is driving you insane! (Acts 26:24)",
      situation: "Paul testifies about his conversion and the resurrection before Festus and Agrippa.",
      pressure: "Festus cannot comprehend resurrection within his Roman worldview.",
      innerBattle: "This man is clearly learned, but what he says is impossible.",
      response: "He interrupted Paul, declaring him insane.",
      outcome: "Paul calmly responded that he was speaking truth and reason; Agrippa was almost persuaded.",
      lesson: "The gospel will always seem foolish to those who measure everything by human reason alone.",
      traitRevealed: "Intellectual dismissal of what cannot be empirically verified",
      spiritualPrinciple: "The message of the cross is foolishness to those who are perishing, but to those being saved it is the power of God.",
      reflectionQuestions: ["Have I dismissed something from God because it did not fit my worldview?", "Am I open to truths that transcend my understanding?"],
      dnaSnapshot: { pride: 7, wisdom: 5, faith: 1 }
    }]
  },

  // 45. The Ethiopian Eunuch
  {
    id: "ethiopian-eunuch",
    name: "The Ethiopian Eunuch",
    meaning: "Unnamed; a seeker from the ends of the earth",
    emoji: "📜",
    role: "Ethiopian court official converted by Philip",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 8:26-40"],
    archetypes: ["Seeker", "Servant"],
    dna: { faith: 8, humility: 8, courage: 7, wisdom: 7, compassion: 6, fear: 2, pride: 2, greed: 1 },
    quickCard: { archetype: "Seeker", strength: "Genuine hunger for understanding Scripture", weakness: "Needed a guide to understand what he was reading", mindset: "How can I understand unless someone explains it to me?", keyLesson: "God sends the right teacher at the right time to those who genuinely seek.", keyVerse: "How can I understand unless someone explains it to me?", keyVerseRef: "Acts 8:31" },
    storyArc: "A powerful Ethiopian official returning from worshiping in Jerusalem was reading Isaiah 53 in his chariot when Philip was divinely sent to explain the passage. He believed, was baptized roadside, and went on his way rejoicing—tradition says he brought the gospel to Ethiopia.",
    therapyView: { drivingFears: ["Being excluded from God's people due to his status as a eunuch"], coreMotivations: ["Genuine spiritual hunger", "Understanding Scripture", "Inclusion in God's family"], relationalStyle: "Humble learner despite high social status; invited Philip into his chariot", blindSpots: ["None recorded"], healingMoments: ["Philip explaining Isaiah 53", "Being baptized and accepted into the faith"] },
    strengths: ["Spiritual hunger", "Humility to ask for help", "Immediate response to truth"],
    weaknesses: ["Needed a teacher to understand Scripture"],
    journey: [
      { phase: "Calling", description: "Traveled from Ethiopia to Jerusalem to worship God." },
      { phase: "Testing", description: "Was reading Isaiah 53 but could not understand it without help." },
      { phase: "Legacy", description: "Believed, was baptized, and tradition holds he brought the gospel to Ethiopia." }
    ],
    relationships: [
      { name: "Philip", role: "Evangelist sent by God to teach him" },
      { name: "The Ethiopian court", role: "Powerful position he held under the queen" }
    ],
    lessonsAndReflection: ["God orchestrates divine appointments for sincere seekers.", "Humility to say 'I don't understand' opens the door to revelation.", "The gospel is for every nation, from Jerusalem to the ends of the earth."],
    relatedCharacters: ["philip", "cornelius", "lydia"],
    situations: [{
      id: "ethiopian-eunuch-baptism", title: "Understanding Isaiah on the Road", category: "Calling", reference: "Acts 8:26-40",
      keyVerse: "How can I understand unless someone explains it to me? (Acts 8:31)",
      situation: "The Ethiopian eunuch is reading Isaiah 53 in his chariot on the desert road from Jerusalem to Gaza.",
      pressure: "As a eunuch, he was excluded from full participation in Jewish worship; his hunger was deep.",
      innerBattle: "I have traveled so far to worship God, but I cannot understand His word without help.",
      response: "He humbly invited Philip into his chariot and asked him to explain the passage.",
      outcome: "Philip explained the gospel from Isaiah 53; the eunuch believed and was baptized immediately.",
      lesson: "God sees the seeking heart and sends exactly the right person at the right time.",
      traitRevealed: "Teachable spirit in a person of great power",
      spiritualPrinciple: "God will not let a sincere seeker go without revelation.",
      reflectionQuestions: ["Am I humble enough to ask for help understanding God's word?", "Am I ready to respond immediately when God reveals truth?"],
      dnaSnapshot: { faith: 9, humility: 9, wisdom: 7 }
    }]
  },

  // 46. Bezalel
  {
    id: "bezalel",
    name: "Bezalel",
    meaning: "In the shadow of God",
    emoji: "🎨",
    role: "Spirit-filled craftsman who built the Tabernacle",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus 31:1-11", "Exodus 35:30-36:1"],
    archetypes: ["Builder", "Servant"],
    dna: { faith: 8, humility: 7, courage: 6, wisdom: 9, compassion: 6, fear: 2, pride: 2, greed: 1 },
    quickCard: { archetype: "Builder", strength: "First person in Scripture described as filled with the Spirit—for craftsmanship", weakness: "No recorded weaknesses", mindset: "God has filled me with His Spirit to create beauty for His dwelling place.", keyLesson: "The Holy Spirit empowers artistic and practical gifts, not just preaching and prophecy.", keyVerse: "I have filled him with the Spirit of God, with wisdom, with understanding, with knowledge and with all kinds of skills.", keyVerseRef: "Exodus 31:3" },
    storyArc: "A craftsman from the tribe of Judah was specifically called and filled with the Spirit of God to design and build the Tabernacle—the first person in Scripture described as Spirit-filled.",
    therapyView: { drivingFears: ["Building something unworthy of God's presence"], coreMotivations: ["Creating beauty for God's dwelling", "Faithful craftsmanship", "Mentoring others"], relationalStyle: "Collaborative leader who taught and empowered other artisans", blindSpots: ["None recorded"], healingMoments: ["Being named and filled by God for a specific creative purpose"] },
    strengths: ["Spirit-filled creativity", "Mastery of multiple crafts", "Teaching ability"],
    weaknesses: ["No weaknesses recorded"],
    journey: [
      { phase: "Calling", description: "Named by God and filled with the Spirit for craftsmanship." },
      { phase: "Testing", description: "Tasked with creating the dwelling place of God according to exact specifications." },
      { phase: "Legacy", description: "Built the Tabernacle—God's dwelling place among His people." }
    ],
    relationships: [
      { name: "Moses", role: "Leader who received the Tabernacle's design from God" },
      { name: "Oholiab", role: "Fellow craftsman and partner" }
    ],
    lessonsAndReflection: ["The Holy Spirit empowers creativity, not just preaching.", "God calls specific people to specific tasks.", "Artistic skill is a spiritual gift when dedicated to God."],
    relatedCharacters: ["moses", "hur"],
    situations: [{
      id: "bezalel-spirit-filled", title: "Spirit-Filled for Craftsmanship", category: "Calling", reference: "Exodus 31:1-11",
      keyVerse: "I have filled him with the Spirit of God, with wisdom, with understanding, with knowledge and with all kinds of skills. (Exodus 31:3)",
      situation: "God calls Bezalel by name and fills him with His Spirit to build the Tabernacle.",
      pressure: "The task required creating a dwelling place worthy of God's presence—every detail mattered.",
      innerBattle: "Can my hands create something worthy of the God who spoke the universe into being?",
      response: "He used every skill God gave him to build the Tabernacle according to the divine pattern.",
      outcome: "The Tabernacle was completed, and God's glory filled it.",
      lesson: "When God calls you to create, He provides the Spirit, the skill, and the plan.",
      traitRevealed: "Creative excellence empowered by the Holy Spirit",
      spiritualPrinciple: "God sanctifies every vocation—especially creativity—when it is offered to Him.",
      reflectionQuestions: ["Am I using my creative gifts for God's purposes?", "Do I see practical and artistic skills as spiritual gifts?"],
      dnaSnapshot: { wisdom: 9, faith: 8 }
    }]
  },

  // 47. Hur
  {
    id: "hur",
    name: "Hur",
    meaning: "Noble, free",
    emoji: "🙌",
    role: "Man who held up Moses' arms during battle",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus 17:10-13", "Exodus 24:14"],
    archetypes: ["Servant", "Warrior"],
    dna: { faith: 8, humility: 9, courage: 7, wisdom: 7, compassion: 8, fear: 2, pride: 1, greed: 1 },
    quickCard: { archetype: "Servant", strength: "Faithful support in a critical moment", weakness: "Virtually unknown despite critical role", mindset: "If holding up his arms is what it takes, I will hold them all day.", keyLesson: "Some of the most important roles in God's kingdom are supporting roles.", keyVerse: "Aaron and Hur held his hands up—one on one side, one on the other—so that his hands remained steady till sunset.", keyVerseRef: "Exodus 17:12" },
    storyArc: "A man who stood beside Moses on the hilltop during the battle against the Amalekites, literally holding up Moses' tired arms alongside Aaron so that Israel could prevail—a picture of faithful, unseen support.",
    therapyView: { drivingFears: ["Israel losing the battle", "Moses' strength failing"], coreMotivations: ["Supporting Moses' leadership", "Israel's victory", "Faithful service"], relationalStyle: "Supportive and steady; comfortable in a secondary role", blindSpots: ["None recorded"], healingMoments: ["Seeing Israel prevail because of his faithful support"] },
    strengths: ["Faithfulness in a supporting role", "Endurance", "Teamwork"],
    weaknesses: ["No recorded weaknesses"],
    journey: [
      { phase: "Calling", description: "Chosen to accompany Moses to the hilltop during battle." },
      { phase: "Testing", description: "Held Moses' arms up from sunrise to sunset—a grueling physical task." },
      { phase: "Legacy", description: "Left in charge with Aaron when Moses ascended Sinai; grandfather of Bezalel." }
    ],
    relationships: [
      { name: "Moses", role: "Leader whose arms he supported" },
      { name: "Aaron", role: "Partner in holding up Moses' arms" },
      { name: "Bezalel", role: "Grandson—Spirit-filled craftsman" }
    ],
    lessonsAndReflection: ["Leaders need people who will hold up their arms.", "The unseen role may determine the outcome of the battle.", "Faithful support is its own form of heroism."],
    relatedCharacters: ["moses", "aaron", "bezalel"],
    situations: [{
      id: "hur-arms", title: "Holding Up the Leader's Arms", category: "Obedience", reference: "Exodus 17:10-13",
      keyVerse: "Aaron and Hur held his hands up—one on one side, one on the other—so that his hands remained steady till sunset. (Exodus 17:12)",
      situation: "Israel battles the Amalekites; when Moses raises his hands, Israel prevails; when he lowers them, Amalek prevails.",
      pressure: "Moses' arms grew tired; the battle's outcome depended on keeping them raised.",
      innerBattle: "No one will remember my name, but the victory depends on this.",
      response: "He and Aaron sat Moses on a stone and held his arms up until sunset.",
      outcome: "Israel won the battle; Joshua overcame the Amalekites with the sword.",
      lesson: "Faithful, unseen support can determine the outcome of the biggest battles.",
      traitRevealed: "Selfless service in a critical behind-the-scenes role",
      spiritualPrinciple: "The body of Christ needs arm-holders as much as it needs generals.",
      reflectionQuestions: ["Whose arms am I holding up?", "Am I content to serve in a role where no one sees my contribution?"],
      dnaSnapshot: { humility: 10, faith: 8 }
    }]
  },

  // 48. Zelophehad's Daughters
  {
    id: "zelophehads-daughters",
    name: "Zelophehad's Daughters",
    meaning: "Mahlah, Noah, Hoglah, Milkah, Tirzah",
    emoji: "📋",
    role: "Five sisters who claimed their inheritance rights before Moses",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Numbers 27:1-11", "Numbers 36:1-12", "Joshua 17:3-6"],
    archetypes: ["Survivor", "Judge"],
    dna: { faith: 8, humility: 6, courage: 9, wisdom: 8, compassion: 6, fear: 3, pride: 3, greed: 2 },
    quickCard: { archetype: "Survivor", strength: "Courage to challenge an unjust system through proper channels", weakness: "No recorded weaknesses", mindset: "Our father's name should not disappear because he had no sons.", keyLesson: "Speaking up for justice through proper channels can change the law for everyone.", keyVerse: "Why should our father's name disappear from his clan because he had no son?", keyVerseRef: "Numbers 27:4" },
    storyArc: "Five sisters whose father died without sons boldly approached Moses and the assembly to claim their father's inheritance—a request that was unprecedented. God affirmed their claim and changed the law of inheritance for all Israel.",
    therapyView: { drivingFears: ["Losing their father's legacy", "Being left destitute without inheritance"], coreMotivations: ["Justice", "Preservation of family name", "Rights for women in a patriarchal system"], relationalStyle: "United as sisters; approached authority with respect and boldness", blindSpots: ["None recorded—their cause was affirmed by God"], healingMoments: ["God telling Moses, 'What Zelophehad's daughters are saying is right'", "Receiving their inheritance in the Promised Land"] },
    strengths: ["Courage", "Unity", "Proper use of legal channels", "Changed the law for future generations"],
    weaknesses: ["No recorded weaknesses"],
    journey: [
      { phase: "Calling", description: "Their father died without sons, leaving them without inheritance." },
      { phase: "Testing", description: "They approached Moses and the assembly at the entrance to the Tent of Meeting." },
      { phase: "Legacy", description: "God changed the inheritance law; they received land in the Promised Land." }
    ],
    relationships: [
      { name: "Moses", role: "Leader who brought their case before God" },
      { name: "Zelophehad", role: "Father whose name they preserved" }
    ],
    lessonsAndReflection: ["God cares about justice for the vulnerable.", "Speaking up through proper channels can change systems.", "Unity among siblings can accomplish what individuals cannot."],
    relatedCharacters: ["moses", "joshua"],
    situations: [{
      id: "zelophehad-daughters-inheritance", title: "Claiming Their Inheritance", category: "Leadership Pressure", reference: "Numbers 27:1-11",
      keyVerse: "What Zelophehad's daughters are saying is right. You must certainly give them property as an inheritance. (Numbers 27:7)",
      situation: "Five sisters approach Moses publicly because their father died in the wilderness without sons, and the law had no provision for daughters to inherit.",
      pressure: "Challenging established law in a patriarchal society before the entire assembly.",
      innerBattle: "No one has ever done this before—but our father's name and our survival depend on it.",
      response: "They stated their case boldly and respectfully before Moses, Eleazar, and the leaders.",
      outcome: "God told Moses they were right; the inheritance law was changed for all Israel.",
      lesson: "God honors those who pursue justice through courage and proper process.",
      traitRevealed: "Bold advocacy that changed systemic injustice",
      spiritualPrinciple: "God is a God of justice who hears the cause of the vulnerable.",
      reflectionQuestions: ["Is there an injustice I should be advocating against through proper channels?", "Am I willing to be the first to speak up when no precedent exists?"],
      dnaSnapshot: { courage: 9, faith: 8, wisdom: 8 }
    }]
  },

  // 49. The Widow of Zarephath
  {
    id: "widow-of-zarephath",
    name: "The Widow of Zarephath",
    meaning: "Unnamed; a Gentile widow who sustained Elijah",
    emoji: "🫗",
    role: "Phoenician widow who fed Elijah during famine",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 17:7-24"],
    archetypes: ["Survivor", "Servant"],
    dna: { faith: 8, humility: 8, courage: 7, wisdom: 6, compassion: 7, fear: 5, pride: 2, greed: 1 },
    quickCard: { archetype: "Survivor", strength: "Sacrificial obedience when she had nothing left", weakness: "Initially prepared to die rather than hope", mindset: "I was gathering sticks for my last meal—and God asked me to feed someone else first.", keyLesson: "God sometimes asks us to give from our nothing, and that is where miracles begin.", keyVerse: "The jar of flour was not used up and the jug of oil did not run dry.", keyVerseRef: "1 Kings 17:16" },
    storyArc: "A Gentile widow preparing her last meal for herself and her son was asked by Elijah to feed him first. She obeyed, and her flour and oil miraculously never ran out. When her son later died, Elijah raised him back to life.",
    therapyView: { drivingFears: ["Starvation", "Losing her son", "Being forgotten by God"], coreMotivations: ["Survival of her son", "Obedience to the prophet's word"], relationalStyle: "Desperate but obedient; trusted when trust seemed irrational", blindSpots: ["Initially resigned to death rather than seeking God"], healingMoments: ["The flour and oil not running out", "Her son being raised from the dead"] },
    strengths: ["Sacrificial obedience", "Faith in impossible circumstances", "Hosting the prophet"],
    weaknesses: ["Initial despair", "Blamed Elijah when her son died"],
    journey: [
      { phase: "Calling", description: "God directed Elijah to her as his provider during the famine." },
      { phase: "Testing", description: "Asked to give her last handful of flour and drops of oil to a stranger." },
      { phase: "Refinement", description: "Experienced miraculous provision day after day." },
      { phase: "Legacy", description: "Her son was raised from the dead; she declared, 'Now I know you are a man of God.'" }
    ],
    relationships: [
      { name: "Elijah", role: "Prophet she sustained" },
      { name: "Her son", role: "Child who died and was raised" }
    ],
    lessonsAndReflection: ["God asks us to give from our scarcity, not our abundance.", "Obedience in the impossible moment unlocks miraculous provision.", "God uses Gentiles and outsiders in His redemptive plan."],
    relatedCharacters: ["elijah", "shunammite-woman"],
    situations: [{
      id: "widow-zarephath-flour", title: "The Last Handful of Flour", category: "Faith Testing", reference: "1 Kings 17:10-16",
      keyVerse: "The jar of flour was not used up and the jug of oil did not run dry, in keeping with the word of the LORD. (1 Kings 17:16)",
      situation: "A starving widow is preparing her last meal when Elijah asks her to make him bread first.",
      pressure: "She and her son are about to die of starvation; giving food away seems suicidal.",
      innerBattle: "This stranger asks me to feed him with my son's last meal—but he speaks in the name of God.",
      response: "She obeyed Elijah and made him bread first from her last flour and oil.",
      outcome: "The flour and oil miraculously lasted until the famine ended.",
      lesson: "When God asks us to give from our nothing, He multiplies what remains.",
      traitRevealed: "Sacrificial obedience in extremity",
      spiritualPrinciple: "God's provision often begins at the point of our total surrender.",
      reflectionQuestions: ["Am I willing to give when I feel like I have nothing left?", "Do I trust God's promise enough to act on it before I see the provision?"],
      dnaSnapshot: { faith: 8, courage: 7, fear: 4 }
    }]
  },

  // 50. The Shunammite Woman
  {
    id: "shunammite-woman",
    name: "The Shunammite Woman",
    meaning: "Unnamed; a woman from Shunem",
    emoji: "🏠",
    role: "Wealthy woman who hosted Elisha and whose son was raised",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 4:8-37", "2 Kings 8:1-6"],
    archetypes: ["Matriarch", "Builder"],
    dna: { faith: 8, humility: 7, courage: 9, wisdom: 8, compassion: 8, fear: 3, pride: 2, greed: 1 },
    quickCard: { archetype: "Matriarch", strength: "Persistent faith that refused to accept death as final", weakness: "Guarded her heart against false hope", mindset: "It is well—even when it is not. I will not stop until I reach the man of God.", keyLesson: "True faith does not accept the apparent verdict but goes directly to God's representative.", keyVerse: "It is well.", keyVerseRef: "2 Kings 4:26" },
    storyArc: "A wealthy, perceptive woman built a room for Elisha, received the promise of a son, lost that son to death, refused to grieve until she reached the prophet, and witnessed Elisha raise her son from the dead.",
    therapyView: { drivingFears: ["Losing her promised son", "False hope"], coreMotivations: ["Hospitality", "Faith in God's prophet", "Refusal to accept death as the final word"], relationalStyle: "Discerning and initiative-taking; generous host who took action in crisis", blindSpots: ["Initially guarded against Elisha's promise: 'Don't deceive me'"], healingMoments: ["Receiving the son of promise", "Her son being raised from the dead by Elisha"] },
    strengths: ["Hospitality", "Discernment", "Persistence in crisis", "Refusal to accept defeat"],
    weaknesses: ["Guarded against hope after disappointment"],
    journey: [
      { phase: "Calling", description: "Recognized Elisha as a holy man and built him a room." },
      { phase: "Testing", description: "Received a promised son, only to have him die suddenly." },
      { phase: "Refinement", description: "Refused to tell anyone except Elisha; rode to find the prophet." },
      { phase: "Legacy", description: "Her son was raised from the dead; later, Elisha's advice saved her from famine." }
    ],
    relationships: [
      { name: "Elisha", role: "Prophet she hosted and trusted" },
      { name: "Her son", role: "The promised child who died and was raised" },
      { name: "Gehazi", role: "Elisha's servant" }
    ],
    lessonsAndReflection: ["Hospitality creates a context for miracles.", "True faith refuses to accept death as the final word.", "Going directly to God's representative in crisis is an act of faith."],
    relatedCharacters: ["elisha", "widow-of-zarephath", "jairus"],
    situations: [
      {
        id: "shunammite-son-dies", title: "It Is Well", category: "Loss", reference: "2 Kings 4:18-37",
        keyVerse: "It is well. (2 Kings 4:26)",
        situation: "The Shunammite woman's promised son collapses in the field and dies in her lap.",
        pressure: "The child she was promised by God's prophet is dead; everything seems lost.",
        innerBattle: "God gave me this son through His prophet—I will not accept this death without going to that prophet.",
        response: "She laid the boy on Elisha's bed, told no one what had happened, and rode to find the prophet.",
        outcome: "Elisha came to her house and raised her son from the dead.",
        lesson: "Faith in crisis goes directly to the source of the promise rather than accepting the verdict.",
        traitRevealed: "Fierce, determined faith that refused to give up",
        spiritualPrinciple: "When God gives a promise, we have the right to hold Him to it—even through death.",
        reflectionQuestions: ["When God's promises seem to die, do I give up or go to Him?", "Can I say 'It is well' even when everything looks wrong?"],
        dnaSnapshot: { faith: 9, courage: 10, fear: 2 }
      },
      {
        id: "shunammite-hospitality", title: "Building a Room for the Prophet", category: "Obedience", reference: "2 Kings 4:8-17",
        keyVerse: "Let us make a small room on the roof and put in it a bed and a table, a chair and a lamp for him. (2 Kings 4:10)",
        situation: "A wealthy Shunammite woman recognizes Elisha as a holy man and convinces her husband to build him a permanent guest room.",
        pressure: "Investing in a prophet with no expectation of return; generosity without agenda.",
        innerBattle: "I see this man is holy. What can I do to serve God by serving him?",
        response: "She built and furnished a room for Elisha so he could stay whenever he passed through.",
        outcome: "Elisha, moved by her generosity, promised her a son—and she conceived within the year.",
        lesson: "Generosity without agenda creates space for God to move in unexpected ways.",
        traitRevealed: "Perceptive hospitality that created room for the miraculous",
        spiritualPrinciple: "When we make room for God's servants, we make room for God's blessings.",
        reflectionQuestions: ["Am I creating space in my life for God's work?", "Is my generosity given without strings attached?"],
        dnaSnapshot: { compassion: 9, wisdom: 8, faith: 8 }
      }
    ]
  },
];
