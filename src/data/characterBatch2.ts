import type { CharacterProfile } from "./biblicalCharacterProfiles";

export const characterBatch2: CharacterProfile[] = [
  {
    id: "jephthah",
    name: "Jephthah",
    meaning: "He opens",
    emoji: "⚔️",
    role: "Judge of Israel who made a rash vow",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 11:1-12:7", "Hebrews 11:32"],
    archetypes: ["Warrior", "Tragic Hero"],
    dna: { faith: 7, humility: 4, courage: 9, wisdom: 4, compassion: 5, fear: 3, pride: 7, greed: 2 },
    quickCard: {
      archetype: "Warrior",
      strength: "Fearless in battle and devoted to God's cause",
      weakness: "Rash speech and impulsive vows",
      mindset: "I must prove my worth through bold action",
      keyLesson: "Words spoken to God carry weight; do not make vows lightly",
      keyVerse: "And Jephthah made a vow to the LORD",
      keyVerseRef: "Judges 11:30"
    },
    storyArc: "Rejected by his family as the son of a prostitute, Jephthah became an outcast and leader of a band of worthless fellows. When Gilead faced the Ammonites, the elders begged him to lead. He won a great victory but his rash vow cost him dearly.",
    therapyView: {
      drivingFears: ["Rejection", "Being seen as worthless", "Losing what he fought for"],
      coreMotivations: ["Proving his worth", "Gaining acceptance", "Honoring God through victory"],
      relationalStyle: "Transactional; negotiates terms before committing",
      blindSpots: ["Impulsive promises", "Confusing bargaining with faith", "Inability to back down from a vow"],
      healingMoments: ["Acknowledged by the elders of Gilead", "Listed in Hebrews 11 as a hero of faith"]
    },
    strengths: ["Military courage", "Diplomatic skill", "Faith under pressure"],
    weaknesses: ["Rash vows", "Need for validation", "Impulsive speech"],
    journey: [
      { phase: "Calling", description: "Rejected by his brothers, he became a leader among outcasts" },
      { phase: "Testing", description: "Called back by the elders to fight the Ammonites" },
      { phase: "Failure", description: "Made a rash vow that cost him his daughter" },
      { phase: "Legacy", description: "Remembered as a judge and a man of faith despite his tragic vow" }
    ],
    relationships: [
      { name: "Gilead", role: "Father" },
      { name: "Jephthah's daughter", role: "Only child" },
      { name: "Elders of Gilead", role: "Those who recalled him" }
    ],
    lessonsAndReflection: [
      "God can use the rejected and outcast for His purposes",
      "Rash vows can have devastating consequences",
      "Faith and foolishness can coexist in the same heart"
    ],
    relatedCharacters: ["gideon", "samson", "david"],
    situations: [
      {
        id: "jephthah-rash-vow",
        title: "The Rash Vow",
        category: "Sacrifice",
        reference: "Judges 11:30-40",
        keyVerse: "And Jephthah made a vow to the LORD and said, 'If you will give the Ammonites into my hand, whatever comes out from the doors of my house to meet me when I return in peace... I will offer it up for a burnt offering.' (Judges 11:30-31)",
        situation: "Before battle with the Ammonites, Jephthah vowed to sacrifice whatever first came from his house upon his victorious return.",
        pressure: "Desperate for victory and eager to prove himself, Jephthah tried to bargain with God.",
        innerBattle: "The tension between wanting to guarantee success and trusting God without conditions.",
        response: "He made the vow impulsively, and upon returning home, his only daughter came out to greet him.",
        outcome: "He kept his vow at an unimaginable personal cost, losing his only child.",
        lesson: "God does not require us to bargain for His favor; rash words can bring irreversible grief.",
        traitRevealed: "Impulsiveness masked as devotion",
        spiritualPrinciple: "Let your yes be yes—do not make vows lightly before God",
        reflectionQuestions: [
          "Have I ever tried to bargain with God instead of trusting Him?",
          "What promises have I made in desperation that I later regretted?",
          "How can I learn to pause before making commitments?"
        ],
        dnaSnapshot: { faith: 6, courage: 8, wisdom: 2, pride: 7 }
      }
    ]
  },
  {
    id: "othniel",
    name: "Othniel",
    meaning: "Lion of God",
    emoji: "🛡️",
    role: "First judge of Israel",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 3:7-11", "Joshua 15:16-17"],
    archetypes: ["Warrior", "Judge"],
    dna: { faith: 8, humility: 7, courage: 8, wisdom: 7, compassion: 6, fear: 2, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Judge",
      strength: "Faithful obedience and courageous leadership",
      weakness: "Little is recorded of personal struggle",
      mindset: "When God calls, I answer without hesitation",
      keyLesson: "The Spirit of the Lord is sufficient for any task",
      keyVerse: "The Spirit of the LORD was upon him, and he judged Israel",
      keyVerseRef: "Judges 3:10"
    },
    storyArc: "Othniel, nephew of Caleb, proved himself by capturing Kiriath-sepher and winning Caleb's daughter Achsah. When Israel fell to Cushan-rishathaim, God raised Othniel as the first judge. The Spirit came upon him, he delivered Israel, and the land had rest forty years.",
    therapyView: {
      drivingFears: ["Failing to live up to his family legacy"],
      coreMotivations: ["Honoring God", "Protecting Israel", "Proving faithful like Caleb"],
      relationalStyle: "Steady and dependable; leads by example",
      blindSpots: ["We know little of his inner struggles"],
      healingMoments: ["Empowered by the Spirit of God", "Brought peace to Israel for forty years"]
    },
    strengths: ["Spirit-empowered leadership", "Military skill", "Faithfulness"],
    weaknesses: ["Limited record makes it hard to identify personal flaws"],
    journey: [
      { phase: "Calling", description: "Proved himself by conquering Kiriath-sepher" },
      { phase: "Testing", description: "Raised up to deliver Israel from eight years of oppression" },
      { phase: "Legacy", description: "Brought forty years of peace as Israel's first judge" }
    ],
    relationships: [
      { name: "Caleb", role: "Uncle and father-in-law" },
      { name: "Achsah", role: "Wife" }
    ],
    lessonsAndReflection: [
      "God raises up deliverers when His people cry out",
      "The Spirit of God empowers ordinary people for extraordinary tasks",
      "Faithfulness in small things leads to greater calling"
    ],
    relatedCharacters: ["caleb", "ehud", "deborah"],
    situations: [
      {
        id: "othniel-delivers-israel",
        title: "Delivering Israel from Cushan-rishathaim",
        category: "Calling",
        reference: "Judges 3:7-11",
        keyVerse: "The Spirit of the LORD was upon him, and he judged Israel. He went out to war, and the LORD gave Cushan-rishathaim king of Mesopotamia into his hand. (Judges 3:10)",
        situation: "Israel had served a foreign king for eight years due to their sin. God raised Othniel to deliver them.",
        pressure: "An entire nation looked to one man for deliverance from a powerful oppressor.",
        innerBattle: "Stepping into a role no Israelite had filled before—being the first judge.",
        response: "He answered God's call, went to war empowered by the Spirit, and defeated the enemy.",
        outcome: "The land had rest for forty years under his leadership.",
        lesson: "When God calls and empowers, the task—no matter how great—can be accomplished.",
        traitRevealed: "Faithful obedience",
        spiritualPrinciple: "God's Spirit is the true source of victory, not human ability",
        reflectionQuestions: [
          "Am I willing to step into a role no one has filled before?",
          "Do I rely on God's Spirit or my own strength?"
        ],
        dnaSnapshot: { faith: 8, courage: 8, humility: 7 }
      }
    ]
  },
  {
    id: "ehud",
    name: "Ehud",
    meaning: "Strong",
    emoji: "🗡️",
    role: "Left-handed judge who assassinated King Eglon",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 3:12-30"],
    archetypes: ["Warrior", "Strategist"],
    dna: { faith: 7, humility: 6, courage: 9, wisdom: 8, compassion: 4, fear: 2, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Strategist",
      strength: "Cunning resourcefulness and bold decisive action",
      weakness: "Relied on deception and violence",
      mindset: "God uses the unexpected to overthrow the powerful",
      keyLesson: "God can use what the world sees as a disadvantage for His purposes",
      keyVerse: "But Ehud made for himself a sword with two edges",
      keyVerseRef: "Judges 3:16"
    },
    storyArc: "A left-handed Benjaminite, Ehud was sent to deliver tribute to the obese Moabite king Eglon. He concealed a short sword on his right thigh, gained a private audience, and assassinated the king. He then rallied Israel and defeated Moab, bringing eighty years of peace.",
    therapyView: {
      drivingFears: ["Continued oppression of his people"],
      coreMotivations: ["Liberation of Israel", "Using his unique traits for God's purpose"],
      relationalStyle: "Calculated and strategic; reveals only what is needed",
      blindSpots: ["Comfort with deception", "Moral ambiguity of assassination"],
      healingMoments: ["Successful liberation of Israel", "Eighty years of peace"]
    },
    strengths: ["Strategic thinking", "Courage under pressure", "Resourcefulness"],
    weaknesses: ["Reliance on deception", "Violent methods"],
    journey: [
      { phase: "Calling", description: "Raised up by God as a deliverer for oppressed Israel" },
      { phase: "Testing", description: "Carried out a daring assassination of King Eglon" },
      { phase: "Legacy", description: "Led Israel to victory and eighty years of peace" }
    ],
    relationships: [
      { name: "Eglon", role: "Moabite oppressor he assassinated" },
      { name: "Israel", role: "People he delivered" }
    ],
    lessonsAndReflection: [
      "God uses unconventional people and methods",
      "What the world sees as weakness, God can use as strength",
      "Courage sometimes requires bold and risky action"
    ],
    relatedCharacters: ["othniel", "jael", "gideon"],
    situations: [
      {
        id: "ehud-kills-eglon",
        title: "Assassinating King Eglon",
        category: "Obedience",
        reference: "Judges 3:15-30",
        keyVerse: "And Ehud said, 'I have a message from God for you.' (Judges 3:20)",
        situation: "Israel was oppressed by Moab for eighteen years. Ehud was chosen to deliver tribute to King Eglon.",
        pressure: "One man against a king, surrounded by guards, with the fate of a nation hanging on his success.",
        innerBattle: "Fear of discovery versus faith that God had raised him for this moment.",
        response: "He concealed a weapon, gained a private audience, and struck decisively.",
        outcome: "Eglon was killed, Israel rallied, Moab was defeated, and the land had rest eighty years.",
        lesson: "God sometimes calls us to act with bold courage in the face of impossible odds.",
        traitRevealed: "Strategic courage",
        spiritualPrinciple: "God uses the unexpected and the overlooked to accomplish His will",
        reflectionQuestions: [
          "What apparent disadvantages has God turned into advantages in my life?",
          "Am I willing to act boldly when God calls, even when the odds seem impossible?"
        ],
        dnaSnapshot: { courage: 9, wisdom: 8, faith: 7 }
      }
    ]
  },
  {
    id: "barak",
    name: "Barak",
    meaning: "Lightning",
    emoji: "⚡",
    role: "Military leader who served under Deborah",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 4-5", "Hebrews 11:32"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 6, humility: 6, courage: 6, wisdom: 5, compassion: 5, fear: 5, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Willing to fight when given godly leadership",
      weakness: "Reluctant to lead without human assurance",
      mindset: "I will go, but only if you go with me",
      keyLesson: "Conditional obedience forfeits the fullness of God's reward",
      keyVerse: "If you will go with me, I will go, but if you will not go with me, I will not go",
      keyVerseRef: "Judges 4:8"
    },
    storyArc: "Called by the prophetess Deborah to lead ten thousand men against Sisera's army, Barak refused to go unless Deborah accompanied him. She agreed but told him the glory would go to a woman. Barak led the army to victory, but Jael received the honor of killing Sisera.",
    therapyView: {
      drivingFears: ["Failure without support", "Leading alone", "Facing overwhelming odds"],
      coreMotivations: ["Desire to obey God but needing reassurance", "Protecting Israel"],
      relationalStyle: "Dependent; needs partnership and confirmation before acting",
      blindSpots: ["Conditional faith", "Needing human presence more than trusting God's word"],
      healingMoments: ["Victory over Sisera", "Listed in Hebrews 11 as a hero of faith"]
    },
    strengths: ["Military capability", "Willingness to fight", "Humility to follow a woman's leadership"],
    weaknesses: ["Conditional obedience", "Fear-driven need for assurance", "Reluctance to lead independently"],
    journey: [
      { phase: "Calling", description: "Summoned by Deborah to lead Israel against Sisera" },
      { phase: "Resistance", description: "Refused to go without Deborah" },
      { phase: "Testing", description: "Led the army into battle against iron chariots" },
      { phase: "Legacy", description: "Won the battle but lost the glory to Jael" }
    ],
    relationships: [
      { name: "Deborah", role: "Prophetess and judge who called him" },
      { name: "Jael", role: "Woman who killed Sisera" },
      { name: "Sisera", role: "Enemy commander" }
    ],
    lessonsAndReflection: [
      "Conditional obedience still counts as faith, but it limits the reward",
      "God sometimes gives the glory to the unexpected",
      "It is better to obey with hesitation than not to obey at all"
    ],
    relatedCharacters: ["deborah", "jael", "gideon"],
    situations: [
      {
        id: "barak-conditional-obedience",
        title: "Conditional Obedience",
        category: "Faith Testing",
        reference: "Judges 4:6-10",
        keyVerse: "Barak said to her, 'If you will go with me, I will go, but if you will not go with me, I will not go.' (Judges 4:8)",
        situation: "Deborah relayed God's command to Barak to lead ten thousand men against Sisera's army with its nine hundred iron chariots.",
        pressure: "Facing a vastly superior military force with iron chariots on open ground.",
        innerBattle: "Believing God's promise of victory while facing overwhelming enemy strength.",
        response: "He agreed to go only if Deborah accompanied him.",
        outcome: "He won the battle but the honor of killing Sisera went to Jael.",
        lesson: "Partial faith still receives God's help, but full obedience receives full honor.",
        traitRevealed: "Conditional faith",
        spiritualPrinciple: "God honors faith even when it is imperfect, but wholehearted trust unlocks greater blessing",
        reflectionQuestions: [
          "Do I put conditions on my obedience to God?",
          "Am I more dependent on human support than on God's word?",
          "What glory might I be forfeiting through hesitation?"
        ],
        dnaSnapshot: { faith: 6, courage: 6, fear: 5 }
      }
    ]
  },
  {
    id: "jael",
    name: "Jael",
    meaning: "Mountain goat",
    emoji: "🔨",
    role: "Woman who killed the enemy commander Sisera",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 4:17-22", "Judges 5:24-27"],
    archetypes: ["Warrior", "Survivor"],
    dna: { faith: 7, humility: 5, courage: 9, wisdom: 7, compassion: 3, fear: 2, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Decisive action in a critical moment",
      weakness: "Used hospitality as a weapon of deception",
      mindset: "When God opens a door, act without hesitation",
      keyLesson: "God can use anyone—even an outsider—to accomplish His purposes",
      keyVerse: "Most blessed of women be Jael, the wife of Heber the Kenite",
      keyVerseRef: "Judges 5:24"
    },
    storyArc: "When Sisera fled from his defeated army, he sought refuge in the tent of Jael, whose husband had peace with the Canaanites. She welcomed him, gave him milk, and covered him. When he fell asleep, she drove a tent peg through his temple, fulfilling Deborah's prophecy that a woman would receive the glory.",
    therapyView: {
      drivingFears: ["Being powerless in a violent world"],
      coreMotivations: ["Aligning with God's people", "Decisive action over passive waiting"],
      relationalStyle: "Appears hospitable but acts with hidden resolve",
      blindSpots: ["Deception in the name of a greater cause"],
      healingMoments: ["Celebrated in the Song of Deborah as most blessed among women"]
    },
    strengths: ["Boldness", "Decisiveness", "Resourcefulness"],
    weaknesses: ["Use of deception", "Moral complexity of her methods"],
    journey: [
      { phase: "Calling", description: "Placed in a position to fulfill God's prophetic word" },
      { phase: "Testing", description: "Faced the fleeing enemy commander alone in her tent" },
      { phase: "Legacy", description: "Celebrated as most blessed of women in the Song of Deborah" }
    ],
    relationships: [
      { name: "Heber the Kenite", role: "Husband" },
      { name: "Sisera", role: "Enemy commander she killed" },
      { name: "Deborah", role: "Prophetess who foretold the honor" },
      { name: "Barak", role: "Military leader who arrived too late" }
    ],
    lessonsAndReflection: [
      "God can use anyone, regardless of gender or nationality",
      "Decisive moments require decisive action",
      "God's purposes are fulfilled through unexpected instruments"
    ],
    relatedCharacters: ["deborah", "barak", "ehud"],
    situations: [
      {
        id: "jael-kills-sisera",
        title: "Killing Sisera",
        category: "Obedience",
        reference: "Judges 4:17-22",
        keyVerse: "But Jael the wife of Heber took a tent peg, and took a hammer in her hand. Then she went softly to him and drove the peg into his temple. (Judges 4:21)",
        situation: "Sisera, the defeated Canaanite commander, fled to Jael's tent seeking refuge.",
        pressure: "A powerful enemy warrior was in her home; her husband had a treaty with his king.",
        innerBattle: "Hospitality customs versus the opportunity to end Israel's oppressor.",
        response: "She welcomed him, lulled him to sleep, then drove a tent peg through his temple.",
        outcome: "Sisera was killed, Israel was delivered, and Jael was celebrated as a hero.",
        lesson: "God positions ordinary people in extraordinary moments of destiny.",
        traitRevealed: "Courageous decisiveness",
        spiritualPrinciple: "God uses willing hearts in unexpected ways to accomplish His deliverance",
        reflectionQuestions: [
          "Am I ready to act when God places an opportunity before me?",
          "How do I discern between cultural expectations and God's higher calling?"
        ],
        dnaSnapshot: { courage: 9, wisdom: 7, faith: 7 }
      }
    ]
  },
  {
    id: "abimelech",
    name: "Abimelech",
    meaning: "My father is king",
    emoji: "🔥",
    role: "Gideon's son who seized power through violence",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 9:1-57"],
    archetypes: ["Oppressor", "Tragic Hero"],
    dna: { faith: 1, humility: 1, courage: 7, wisdom: 3, compassion: 1, fear: 4, pride: 10, greed: 9 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Ambitious drive and ruthless determination",
      weakness: "Murderous pride and total disregard for others",
      mindset: "Power belongs to those bold enough to seize it",
      keyLesson: "Power gained through violence ends in destruction",
      keyVerse: "Thus God returned the evil of Abimelech",
      keyVerseRef: "Judges 9:56"
    },
    storyArc: "Son of Gideon by a concubine, Abimelech murdered seventy brothers to seize kingship over Shechem. Only Jotham survived and pronounced a prophetic parable. Abimelech ruled three years before Shechem turned against him. He destroyed the city but was killed by a millstone dropped by a woman.",
    therapyView: {
      drivingFears: ["Being overlooked", "Losing power", "Being seen as illegitimate"],
      coreMotivations: ["Proving legitimacy", "Dominating others", "Seizing what he feels owed"],
      relationalStyle: "Domineering and transactional; uses people as tools",
      blindSpots: ["Cannot see that violence begets violence", "Confuses fear with loyalty"],
      healingMoments: ["None recorded; a cautionary tale"]
    },
    strengths: ["Ambition", "Boldness", "Political maneuvering"],
    weaknesses: ["Murderous cruelty", "Consuming pride", "Self-destruction"],
    journey: [
      { phase: "Calling", description: "Convinced Shechem to make him king over his brothers" },
      { phase: "Failure", description: "Murdered seventy brothers on a single stone" },
      { phase: "Legacy", description: "Destroyed by a woman dropping a millstone; God repaid his evil" }
    ],
    relationships: [
      { name: "Gideon", role: "Father" },
      { name: "Jotham", role: "Surviving brother" },
      { name: "Shechem", role: "City that supported then opposed him" }
    ],
    lessonsAndReflection: [
      "Power seized through violence will end in violence",
      "God repays evil in His time",
      "Jotham's parable shows the worthless seek to rule"
    ],
    relatedCharacters: ["gideon", "jephthah", "saul"],
    situations: [
      {
        id: "abimelech-seizes-power",
        title: "Seizing Power Through Fratricide",
        category: "Power and Success",
        reference: "Judges 9:1-6",
        situation: "Abimelech persuaded Shechem to fund his bid for kingship and murdered his seventy brothers.",
        pressure: "Desire to rule despite having no divine mandate.",
        innerBattle: "Entitlement versus the knowledge that God had not called him.",
        response: "He killed all rivals and crowned himself king.",
        outcome: "Three years of rule ending in betrayal, destruction, and an ignoble death.",
        lesson: "Self-appointed authority built on bloodshed collapses from within.",
        traitRevealed: "Murderous ambition",
        spiritualPrinciple: "God opposes the proud and repays violence upon the violent",
        reflectionQuestions: [
          "Am I trying to seize a position God has not given me?",
          "Do I confuse ambition with calling?"
        ],
        dnaSnapshot: { pride: 10, greed: 9, faith: 1, compassion: 1 }
      }
    ]
  },
  {
    id: "manoah",
    name: "Manoah",
    meaning: "Rest",
    emoji: "🌟",
    role: "Samson's father, visited by the angel of the LORD",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 13:1-25"],
    archetypes: ["Patriarch", "Seeker"],
    dna: { faith: 7, humility: 7, courage: 5, wisdom: 5, compassion: 6, fear: 6, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Reverent awe before God and desire to do right",
      weakness: "Fear and spiritual slowness to understand",
      mindset: "If God has spoken, I must know exactly what to do",
      keyLesson: "God's plans unfold even when we do not fully understand them",
      keyVerse: "We shall surely die, for we have seen God",
      keyVerseRef: "Judges 13:22"
    },
    storyArc: "Manoah and his barren wife received a visit from the angel of the LORD announcing the birth of a special son. Manoah prayed for the angel to return so he could learn how to raise the child. After witnessing the angel ascend in the flame of the altar, Manoah feared they would die, but his wife reassured him.",
    therapyView: {
      drivingFears: ["Fear of divine encounter", "Fear of failing as a parent"],
      coreMotivations: ["Doing right by God", "Raising his son properly"],
      relationalStyle: "Cautious and reverent; looks to others for reassurance",
      blindSpots: ["Slower to grasp spiritual truth than his wife", "Fear-based response to God"],
      healingMoments: ["The angel's visit confirming God's plan", "His wife's steady faith calming him"]
    },
    strengths: ["Reverence for God", "Desire to obey", "Prayerfulness"],
    weaknesses: ["Fearfulness", "Spiritual slowness", "Over-anxiety"],
    journey: [
      { phase: "Calling", description: "Received the angelic announcement of Samson's birth" },
      { phase: "Testing", description: "Wrestled with fear after seeing the angel of the LORD" },
      { phase: "Legacy", description: "Raised Samson, though the boy's path was turbulent" }
    ],
    relationships: [
      { name: "Manoah's wife", role: "Wife, unnamed woman of faith" },
      { name: "Samson", role: "Son" },
      { name: "Angel of the LORD", role: "Divine messenger" }
    ],
    lessonsAndReflection: [
      "God sometimes reveals more to the humble than to the anxious",
      "A godly spouse can steady our faith when fear overwhelms",
      "Parenting a called child does not guarantee an easy road"
    ],
    relatedCharacters: ["samson", "hannah", "zechariah"],
    situations: [
      {
        id: "manoah-angel-encounter",
        title: "Encounter with the Angel of the LORD",
        category: "Fear",
        reference: "Judges 13:2-23",
        keyVerse: "And Manoah said to his wife, 'We shall surely die, for we have seen God.' But his wife said, 'If the LORD had meant to kill us, he would not have accepted a burnt offering.' (Judges 13:22-23)",
        situation: "The angel of the LORD appeared to announce Samson's birth. Manoah prayed for the angel to return.",
        pressure: "A direct encounter with the divine, far beyond normal experience.",
        innerBattle: "Awe and terror at having seen God versus trusting God's good intentions.",
        response: "Manoah panicked, believing they would die. His wife spoke wisdom and calmed him.",
        outcome: "They survived, and Samson was born as promised.",
        lesson: "Fear of God should produce reverence, not panic; God's intentions toward His people are good.",
        traitRevealed: "Reverent fear mixed with anxiety",
        spiritualPrinciple: "God does not reveal Himself to destroy us but to include us in His plans",
        reflectionQuestions: [
          "Do I respond to God's presence with panic or trust?",
          "Who in my life helps me see God's goodness when I am afraid?"
        ],
        dnaSnapshot: { faith: 7, fear: 6, humility: 7 }
      }
    ]
  },
  {
    id: "micah-judges",
    name: "Micah (Judges)",
    meaning: "Who is like the LORD?",
    emoji: "🏠",
    role: "Man who set up his own idolatrous shrine",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 17-18"],
    archetypes: ["Seeker", "Manipulator"],
    dna: { faith: 3, humility: 3, courage: 3, wisdom: 2, compassion: 4, fear: 5, pride: 6, greed: 5 },
    quickCard: {
      archetype: "Seeker",
      strength: "Desire for divine blessing and spiritual connection",
      weakness: "Created religion on his own terms",
      mindset: "If I set up worship my way, God will bless me",
      keyLesson: "Sincerity without truth leads to idolatry",
      keyVerse: "In those days there was no king in Israel. Everyone did what was right in his own eyes",
      keyVerseRef: "Judges 17:6"
    },
    storyArc: "Micah stole silver from his mother, confessed, and she had it made into an idol. He set up a shrine with an ephod and household gods, installed his son as priest, then hired a wandering Levite. The Danites later stole his idol and priest, leaving him with nothing.",
    therapyView: {
      drivingFears: ["Being without God's favor", "Spiritual emptiness"],
      coreMotivations: ["Seeking blessing on his own terms", "Controlling his spiritual destiny"],
      relationalStyle: "Transactional; hires spiritual services",
      blindSpots: ["Cannot distinguish true worship from idolatry", "Thinks God can be managed"],
      healingMoments: ["None recorded; a cautionary tale of self-made religion"]
    },
    strengths: ["Desire for spiritual connection", "Willingness to invest in worship"],
    weaknesses: ["Idolatry", "Self-designed religion", "Theft"],
    journey: [
      { phase: "Failure", description: "Stole silver and created an idolatrous shrine" },
      { phase: "Legacy", description: "Lost everything to the Danites; his religion was hollow" }
    ],
    relationships: [
      { name: "Micah's mother", role: "Mother who funded the idol" },
      { name: "Jonathan the Levite", role: "Hired priest" },
      { name: "Danites", role: "Tribe that stole his idol and priest" }
    ],
    lessonsAndReflection: [
      "Religion on our own terms is idolatry no matter how sincere",
      "When everyone does what is right in their own eyes, chaos follows",
      "You cannot own or control God's blessing"
    ],
    relatedCharacters: ["jeroboam", "aaron", "korah"],
    situations: [
      {
        id: "micah-idol-shrine",
        title: "Building a Personal Idol Shrine",
        category: "Temptation",
        reference: "Judges 17:1-13",
        situation: "Micah used stolen silver to create an idol and set up his own shrine with a hired Levite priest.",
        pressure: "Living in a time with no spiritual authority; desire for God's blessing without God's terms.",
        innerBattle: "Wanting God's favor while refusing to seek God on God's terms.",
        response: "He created a do-it-yourself religion, complete with idol, ephod, and hired priest.",
        outcome: "The Danites stole everything, proving his religion had no power to protect him.",
        lesson: "Self-made religion offers false security that crumbles under pressure.",
        traitRevealed: "Spiritual self-deception",
        spiritualPrinciple: "God cannot be worshipped through idols or on human terms",
        reflectionQuestions: [
          "Am I worshipping God on His terms or my own?",
          "Have I created a version of faith that is comfortable but not biblical?"
        ],
        dnaSnapshot: { faith: 3, pride: 6, wisdom: 2 }
      }
    ]
  },
  {
    id: "lot",
    name: "Lot",
    meaning: "Covering, veil",
    emoji: "🏙️",
    role: "Abraham's nephew who chose Sodom",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 13:5-13", "Genesis 19:1-38", "2 Peter 2:7-8"],
    archetypes: ["Survivor", "Tragic Hero"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 2, compassion: 5, fear: 7, pride: 5, greed: 6 },
    quickCard: {
      archetype: "Survivor",
      strength: "Retained some righteousness despite his environment",
      weakness: "Chose comfort over godliness and lingered in danger",
      mindset: "I can live near sin without being consumed by it",
      keyLesson: "Proximity to sin erodes the soul even when you do not fully participate",
      keyVerse: "For as that righteous man lived among them day after day, he was tormenting his righteous soul",
      keyVerseRef: "2 Peter 2:8"
    },
    storyArc: "Lot traveled with Abraham but chose the fertile Jordan valley near Sodom. He gradually moved into the city and became a leader at its gate. When God destroyed Sodom, angels had to drag Lot and his family out. His wife looked back and became a pillar of salt. He ended his days in a cave.",
    therapyView: {
      drivingFears: ["Poverty", "Missing out on prosperity", "Confrontation"],
      coreMotivations: ["Comfort and security", "Material success", "Avoiding conflict"],
      relationalStyle: "Passive and avoidant; follows the path of least resistance",
      blindSpots: ["Cannot see how environment shapes character", "Lingering when he should flee"],
      healingMoments: ["Called righteous by Peter", "Rescued by angels through Abraham's intercession"]
    },
    strengths: ["Hospitality", "Some moral conviction", "Willingness to shelter strangers"],
    weaknesses: ["Poor choices driven by greed", "Passivity", "Lingering in danger", "Compromised parenting"],
    journey: [
      { phase: "Calling", description: "Traveled with Abraham and shared in God's blessing" },
      { phase: "Failure", description: "Chose Sodom for its prosperity and was corrupted by proximity" },
      { phase: "Refinement", description: "Rescued from Sodom by divine intervention" },
      { phase: "Legacy", description: "Lost nearly everything; ended in disgrace in a cave" }
    ],
    relationships: [
      { name: "Abraham", role: "Uncle and intercessor" },
      { name: "Lot's wife", role: "Wife who looked back" },
      { name: "Lot's daughters", role: "Daughters who acted in desperation" }
    ],
    lessonsAndReflection: [
      "What looks prosperous may be spiritually deadly",
      "Lingering near sin has consequences for the whole family",
      "God rescues the righteous, but not without loss"
    ],
    relatedCharacters: ["abraham", "lot-wife", "sodom"],
    situations: [
      {
        id: "lot-chooses-sodom",
        title: "Choosing Sodom",
        category: "Temptation",
        reference: "Genesis 13:5-13",
        keyVerse: "And Lot lifted up his eyes and saw that the Jordan Valley was well watered everywhere... So Lot chose for himself all the Jordan Valley. (Genesis 13:10-11)",
        situation: "Abraham gave Lot first choice of land. Lot saw the lush Jordan valley near Sodom and chose it.",
        pressure: "The appeal of prosperity versus the risk of moral corruption.",
        innerBattle: "Material comfort versus spiritual safety.",
        response: "He chose what looked best to his eyes, pitching his tent toward Sodom.",
        outcome: "He gradually moved into Sodom and nearly lost everything when God destroyed it.",
        lesson: "Decisions based solely on outward appearance can lead to spiritual ruin.",
        traitRevealed: "Greed-driven decision making",
        spiritualPrinciple: "Do not set your eyes on what glitters; consider the spiritual cost",
        reflectionQuestions: [
          "What choices am I making based on appearance rather than spiritual wisdom?",
          "Am I pitching my tent toward Sodom in any area of my life?"
        ],
        dnaSnapshot: { greed: 6, wisdom: 2, faith: 4 }
      },
      {
        id: "lot-rescued-from-sodom",
        title: "Dragged Out of Sodom",
        category: "Fear",
        reference: "Genesis 19:15-26",
        situation: "Angels urged Lot to flee Sodom before its destruction, but he lingered.",
        pressure: "Leaving behind everything he had built in Sodom.",
        innerBattle: "Attachment to his life in Sodom versus trusting God's urgent warning.",
        response: "He hesitated until the angels physically grabbed his hand and dragged him out.",
        outcome: "He escaped but lost his wife, his home, and his dignity.",
        lesson: "Sometimes God must forcibly remove us from what is destroying us.",
        traitRevealed: "Dangerous hesitation",
        spiritualPrinciple: "When God says go, do not linger",
        reflectionQuestions: [
          "What am I clinging to that God is telling me to leave behind?",
          "Why do I hesitate when God's direction is clear?"
        ],
        dnaSnapshot: { fear: 7, faith: 4, courage: 3 }
      }
    ]
  },
  {
    id: "melchizedek",
    name: "Melchizedek",
    meaning: "King of righteousness",
    emoji: "🍞",
    role: "King of Salem and priest of God Most High",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 14:18-20", "Psalm 110:4", "Hebrews 7:1-17"],
    archetypes: ["Priest", "King"],
    dna: { faith: 10, humility: 9, courage: 7, wisdom: 10, compassion: 8, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Priest",
      strength: "Perfect union of kingship and priesthood",
      weakness: "None recorded",
      mindset: "I serve the God Most High, possessor of heaven and earth",
      keyLesson: "True authority combines righteousness with peace and service",
      keyVerse: "You are a priest forever after the order of Melchizedek",
      keyVerseRef: "Psalm 110:4"
    },
    storyArc: "Melchizedek appears briefly in Genesis as king of Salem and priest of God Most High. He brought bread and wine to Abraham after battle and blessed him. Abraham gave him a tenth of everything. Hebrews reveals him as a type of Christ—without recorded genealogy, his priesthood is eternal.",
    therapyView: {
      drivingFears: ["None recorded"],
      coreMotivations: ["Serving God Most High", "Blessing others", "Embodying righteousness and peace"],
      relationalStyle: "Generous, priestly, and authoritative yet serving",
      blindSpots: ["None recorded"],
      healingMoments: ["His very existence points to the hope of an eternal priest-king"]
    },
    strengths: ["Righteousness", "Peace", "Priestly authority", "Generosity"],
    weaknesses: ["None recorded in Scripture"],
    journey: [
      { phase: "Legacy", description: "Appears as a mysterious priest-king who foreshadows Christ's eternal priesthood" }
    ],
    relationships: [
      { name: "Abraham", role: "Blessed Abraham and received tithes" }
    ],
    lessonsAndReflection: [
      "True greatness is found in serving God and blessing others",
      "Christ's priesthood surpasses all earthly systems",
      "Righteousness and peace are meant to dwell together"
    ],
    relatedCharacters: ["abraham", "jesus", "aaron"],
    situations: [
      {
        id: "melchizedek-blesses-abraham",
        title: "Blessing Abraham After Battle",
        category: "Power and Success",
        reference: "Genesis 14:18-20",
        keyVerse: "And Melchizedek king of Salem brought out bread and wine. He was priest of God Most High. And he blessed him. (Genesis 14:18-19)",
        situation: "After Abraham rescued Lot and defeated four kings, Melchizedek met him with bread and wine.",
        pressure: "None for Melchizedek; he acted from a place of settled authority.",
        innerBattle: "None recorded; he moved in perfect alignment with God.",
        response: "He served, blessed, and pointed Abraham to God Most High.",
        outcome: "Abraham tithed to him, acknowledging a greater priesthood.",
        lesson: "The greatest authority is expressed through service and blessing, not domination.",
        traitRevealed: "Priestly generosity",
        spiritualPrinciple: "True spiritual authority blesses rather than demands",
        reflectionQuestions: [
          "Do I use my authority to bless others or to demand from them?",
          "How does Christ's eternal priesthood change my understanding of worship?"
        ],
        dnaSnapshot: { faith: 10, wisdom: 10, humility: 9 }
      }
    ]
  },
  {
    id: "enoch",
    name: "Enoch",
    meaning: "Dedicated",
    emoji: "🚶",
    role: "Man who walked with God and was taken without dying",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 5:21-24", "Hebrews 11:5", "Jude 1:14-15"],
    archetypes: ["Prophet", "Servant"],
    dna: { faith: 10, humility: 9, courage: 7, wisdom: 8, compassion: 7, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Unbroken intimacy with God",
      weakness: "None recorded",
      mindset: "Walking with God is life's highest purpose",
      keyLesson: "A life of faithful communion with God transcends even death",
      keyVerse: "Enoch walked with God, and he was not, for God took him",
      keyVerseRef: "Genesis 5:24"
    },
    storyArc: "Enoch lived 365 years and walked faithfully with God. In a world spiraling toward the wickedness that would bring the flood, Enoch maintained intimate fellowship with God. He prophesied judgment against the ungodly. Then God took him—he did not experience death.",
    therapyView: {
      drivingFears: ["None recorded"],
      coreMotivations: ["Intimacy with God", "Faithful witness in a corrupt generation"],
      relationalStyle: "Deeply connected to God; a quiet counter-cultural witness",
      blindSpots: ["None recorded"],
      healingMoments: ["Translated to heaven without tasting death"]
    },
    strengths: ["Faith", "Consistency", "Prophetic voice", "Intimacy with God"],
    weaknesses: ["None recorded in Scripture"],
    journey: [
      { phase: "Calling", description: "Began walking with God after the birth of Methuselah" },
      { phase: "Legacy", description: "Taken by God without experiencing death" }
    ],
    relationships: [
      { name: "Methuselah", role: "Son" },
      { name: "God", role: "The One he walked with" }
    ],
    lessonsAndReflection: [
      "Walking with God is a daily, lifelong journey",
      "Faithfulness in a corrupt world is possible",
      "Intimacy with God is the ultimate reward"
    ],
    relatedCharacters: ["noah", "elijah", "methuselah"],
    situations: [
      {
        id: "enoch-walks-with-god",
        title: "Walking with God in a Wicked World",
        category: "Obedience",
        reference: "Genesis 5:21-24",
        keyVerse: "Enoch walked with God, and he was not, for God took him. (Genesis 5:24)",
        situation: "In a pre-flood world growing increasingly corrupt, Enoch chose to walk with God.",
        pressure: "Living faithfully in a culture that was moving away from God.",
        innerBattle: "Maintaining faith when the surrounding culture offers no support.",
        response: "He walked with God consistently for three hundred years.",
        outcome: "God took him; he never experienced death.",
        lesson: "Faithful daily communion with God is the most powerful life one can live.",
        traitRevealed: "Unwavering faithfulness",
        spiritualPrinciple: "Walking with God transforms life and even transcends death",
        reflectionQuestions: [
          "What does it mean for me to walk with God daily?",
          "Am I living faithfully even when the culture around me does not?"
        ],
        dnaSnapshot: { faith: 10, humility: 9 }
      }
    ]
  },
  {
    id: "methuselah",
    name: "Methuselah",
    meaning: "When he dies, it shall be sent (referring to the flood)",
    emoji: "⏳",
    role: "Oldest man who ever lived, 969 years",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 5:25-27"],
    archetypes: ["Patriarch", "Survivor"],
    dna: { faith: 6, humility: 6, courage: 5, wisdom: 6, compassion: 6, fear: 3, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Patriarch",
      strength: "His long life was a sign of God's patience",
      weakness: "Little is recorded of his personal faith journey",
      mindset: "Each day is another chance God gives the world to repent",
      keyLesson: "God's patience has a limit, but it is far longer than we expect",
      keyVerse: "Thus all the days of Methuselah were 969 years, and he died",
      keyVerseRef: "Genesis 5:27"
    },
    storyArc: "Son of Enoch and grandfather of Noah, Methuselah lived longer than any other human—969 years. His very name may have been prophetic: when he dies, judgment comes. He died the year of the flood, a living monument to God's patience with a wicked world.",
    therapyView: {
      drivingFears: ["Unknown—little recorded"],
      coreMotivations: ["Carrying the prophetic lineage from Enoch to Noah"],
      relationalStyle: "A generational bridge between the godly Enoch and righteous Noah",
      blindSpots: ["Unknown"],
      healingMoments: ["His very existence demonstrated God's long patience"]
    },
    strengths: ["Longevity as testimony of God's patience", "Link in the godly lineage"],
    weaknesses: ["No personal spiritual achievements recorded"],
    journey: [
      { phase: "Calling", description: "Born to Enoch, carrying a prophetic name" },
      { phase: "Legacy", description: "Lived 969 years; his death coincided with the flood" }
    ],
    relationships: [
      { name: "Enoch", role: "Father who walked with God" },
      { name: "Lamech", role: "Son" },
      { name: "Noah", role: "Grandson" }
    ],
    lessonsAndReflection: [
      "God's patience is vast but not infinite",
      "Our lives can be a testimony of God's grace even without dramatic action",
      "Every generation carries responsibility for the next"
    ],
    relatedCharacters: ["enoch", "noah", "lamech-seth"],
    situations: [
      {
        id: "methuselah-longest-life",
        title: "A Life That Measured God's Patience",
        category: "Waiting",
        reference: "Genesis 5:25-27",
        situation: "Methuselah lived 969 years in a world growing more wicked, his life a countdown to judgment.",
        pressure: "Living as a bridge between Enoch's holiness and a world deserving judgment.",
        innerBattle: "Watching the world deteriorate across centuries.",
        response: "He lived, fathered children, and carried the godly line forward.",
        outcome: "He died the year the flood came—God's patience had reached its end.",
        lesson: "God gives extraordinary time for repentance, but judgment eventually comes.",
        traitRevealed: "Patient endurance",
        spiritualPrinciple: "The length of God's patience is not permission to continue in sin",
        reflectionQuestions: [
          "Am I taking God's patience for granted?",
          "What am I doing with the time God has given me?"
        ],
        dnaSnapshot: { faith: 6, humility: 6 }
      }
    ]
  },
  {
    id: "seth",
    name: "Seth",
    meaning: "Appointed",
    emoji: "🌱",
    role: "Adam's third son, beginning of the godly line",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 4:25-26", "Genesis 5:3-8"],
    archetypes: ["Patriarch", "Servant"],
    dna: { faith: 7, humility: 7, courage: 5, wisdom: 6, compassion: 7, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Continued the godly line after Abel's murder",
      weakness: "Little personal detail recorded",
      mindset: "God has appointed me to carry on what was lost",
      keyLesson: "God replaces what the enemy destroys and continues His plan through faithful people",
      keyVerse: "God has appointed for me another offspring instead of Abel",
      keyVerseRef: "Genesis 4:25"
    },
    storyArc: "After Cain killed Abel, Adam and Eve had Seth, saying God had appointed another seed. Through Seth's line, people began to call on the name of the LORD. His lineage led to Noah, Abraham, and ultimately Christ.",
    therapyView: {
      drivingFears: ["The shadow of family tragedy"],
      coreMotivations: ["Honoring God", "Continuing the faithful lineage"],
      relationalStyle: "Steady and faithful; a restorer of what was broken",
      blindSpots: ["Unknown"],
      healingMoments: ["His birth brought hope after Abel's murder", "His line began calling on the LORD"]
    },
    strengths: ["Faithfulness", "Continuation of the godly line", "Stability"],
    weaknesses: ["Little personal information recorded"],
    journey: [
      { phase: "Calling", description: "Appointed by God to replace Abel and continue the godly line" },
      { phase: "Legacy", description: "Through his line, humanity began calling on the name of the LORD" }
    ],
    relationships: [
      { name: "Adam", role: "Father" },
      { name: "Eve", role: "Mother" },
      { name: "Enosh", role: "Son" }
    ],
    lessonsAndReflection: [
      "God always provides a way forward after loss",
      "Faithfulness in one generation blesses many generations",
      "Being appointed by God is the highest calling"
    ],
    relatedCharacters: ["adam", "eve", "enoch", "noah"],
    situations: [
      {
        id: "seth-appointed-seed",
        title: "Appointed as the Replacement for Abel",
        category: "Restoration",
        reference: "Genesis 4:25-26",
        keyVerse: "And Adam knew his wife again, and she bore a son and called his name Seth, for she said, 'God has appointed for me another offspring instead of Abel.' (Genesis 4:25)",
        situation: "After Abel was murdered by Cain, God gave Adam and Eve another son to carry the godly line.",
        pressure: "Born into a family scarred by the first murder.",
        innerBattle: "Living in the shadow of Abel's death and Cain's exile.",
        response: "He lived faithfully and fathered Enosh, in whose time people began to call on the LORD.",
        outcome: "His line became the channel of God's redemptive plan.",
        lesson: "God restores what the enemy has stolen and continues His plan through appointed people.",
        traitRevealed: "Faithful continuation",
        spiritualPrinciple: "God's purposes cannot be thwarted by human sin or satanic attack",
        reflectionQuestions: [
          "How has God restored something in my life that seemed permanently lost?",
          "Am I faithfully carrying forward what God has entrusted to me?"
        ],
        dnaSnapshot: { faith: 7, humility: 7 }
      }
    ]
  },
  {
    id: "adam",
    name: "Adam",
    meaning: "Man, from the ground",
    emoji: "🌿",
    role: "The first man, created in God's image",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 1:26-31", "Genesis 2:7-25", "Genesis 3:1-24", "Romans 5:12-21"],
    archetypes: ["Patriarch", "Tragic Hero"],
    dna: { faith: 5, humility: 4, courage: 3, wisdom: 4, compassion: 5, fear: 6, pride: 6, greed: 5 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Made in God's image with authority over creation",
      weakness: "Passive in the face of temptation; chose Eve over God",
      mindset: "I was made for paradise but chose my own way",
      keyLesson: "One act of disobedience can have eternal consequences",
      keyVerse: "For as in Adam all die, so also in Christ shall all be made alive",
      keyVerseRef: "1 Corinthians 15:22"
    },
    storyArc: "Created from dust and given the breath of God, Adam was placed in Eden to tend it and enjoy unbroken fellowship with God. He named the animals, received Eve, and lived in paradise. When the serpent tempted Eve, Adam stood by silently, ate the fruit, and plunged humanity into sin.",
    therapyView: {
      drivingFears: ["Loneliness before Eve", "Shame and exposure after the fall"],
      coreMotivations: ["Fellowship with God", "Companionship", "Dominion over creation"],
      relationalStyle: "Passive when he should be protective; blames others when confronted",
      blindSpots: ["Passivity in crisis", "Blame-shifting", "Underestimating consequences"],
      healingMoments: ["God clothed him and Eve", "The promise of a seed to crush the serpent"]
    },
    strengths: ["Image-bearer of God", "Given dominion", "Relational capacity"],
    weaknesses: ["Passivity", "Blame-shifting", "Yielding to temptation"],
    journey: [
      { phase: "Calling", description: "Created by God and given dominion over Eden" },
      { phase: "Failure", description: "Ate the forbidden fruit and fell from grace" },
      { phase: "Legacy", description: "Father of all humanity; through him sin entered the world, but also the promise of redemption" }
    ],
    relationships: [
      { name: "Eve", role: "Wife" },
      { name: "Cain", role: "Firstborn son" },
      { name: "Abel", role: "Second son, murdered" },
      { name: "Seth", role: "Third son, godly line" },
      { name: "God", role: "Creator" }
    ],
    lessonsAndReflection: [
      "Passivity in the face of evil is itself a choice",
      "Blame-shifting delays repentance and healing",
      "God provides covering even after our greatest failures"
    ],
    relatedCharacters: ["eve", "cain", "seth", "jesus"],
    situations: [
      {
        id: "adam-the-fall",
        title: "The Fall of Man",
        category: "Temptation",
        reference: "Genesis 3:1-13",
        keyVerse: "She took of its fruit and ate, and she also gave some to her husband who was with her, and he ate. (Genesis 3:6)",
        situation: "The serpent tempted Eve to eat the forbidden fruit. Adam was with her and did nothing to intervene.",
        pressure: "Choosing between God's command and his wife's offer.",
        innerBattle: "Loyalty to God versus desire to follow Eve.",
        response: "He silently took the fruit and ate, then hid from God and blamed Eve.",
        outcome: "Sin, death, and curse entered creation. Humanity was exiled from paradise.",
        lesson: "Passivity in the face of temptation is catastrophic; silence is a choice.",
        traitRevealed: "Fatal passivity",
        spiritualPrinciple: "Leadership requires the courage to stand for truth even when it costs relationship",
        reflectionQuestions: [
          "Where am I being passive when God is calling me to act?",
          "Do I blame others instead of owning my failures?"
        ],
        dnaSnapshot: { courage: 3, fear: 6, pride: 6 }
      }
    ]
  },
  {
    id: "eve",
    name: "Eve",
    meaning: "Life, living",
    emoji: "🍎",
    role: "The first woman, mother of all living",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 2:18-25", "Genesis 3:1-24", "Genesis 4:1-2", "2 Corinthians 11:3"],
    archetypes: ["Matriarch", "Tragic Hero"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 3, compassion: 6, fear: 5, pride: 6, greed: 6 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Curiosity, relational depth, mother of all humanity",
      weakness: "Deceived by the serpent; desired what was forbidden",
      mindset: "There must be more than what God has given",
      keyLesson: "Deception begins when we question God's goodness and add to His word",
      keyVerse: "The serpent deceived me, and I ate",
      keyVerseRef: "Genesis 3:13"
    },
    storyArc: "Created from Adam's side as his companion and helper, Eve lived in perfect fellowship with God in Eden. The serpent targeted her with doubt about God's word and goodness. She saw, desired, took, and ate—then gave to Adam. She bore Cain, Abel, Seth, and became mother of all living.",
    therapyView: {
      drivingFears: ["Missing out on something God withheld", "Shame after exposure"],
      coreMotivations: ["Desire for wisdom and beauty", "Companionship", "Curiosity"],
      relationalStyle: "Deeply relational but vulnerable to manipulation through desire",
      blindSpots: ["Adding to God's word", "Believing the lie that God is withholding good"],
      healingMoments: ["God clothed her", "Promise of her seed crushing the serpent", "Named mother of all living"]
    },
    strengths: ["Courage to engage", "Relational depth", "Mother of all humanity"],
    weaknesses: ["Susceptibility to deception", "Desire for the forbidden", "Adding to God's word"],
    journey: [
      { phase: "Calling", description: "Created as Adam's companion and co-regent of Eden" },
      { phase: "Failure", description: "Deceived by the serpent and ate the forbidden fruit" },
      { phase: "Legacy", description: "Mother of all living; her seed would crush the serpent" }
    ],
    relationships: [
      { name: "Adam", role: "Husband" },
      { name: "Cain", role: "Firstborn son" },
      { name: "Abel", role: "Second son" },
      { name: "Seth", role: "Appointed son" },
      { name: "The Serpent", role: "Deceiver" }
    ],
    lessonsAndReflection: [
      "Deception starts with questioning God's goodness",
      "Adding to God's word makes us vulnerable to the enemy",
      "Even after the greatest fall, God provides a way forward"
    ],
    relatedCharacters: ["adam", "cain", "seth", "mary-mother-of-jesus"],
    situations: [
      {
        id: "eve-deceived",
        title: "Deceived by the Serpent",
        category: "Temptation",
        reference: "Genesis 3:1-6",
        keyVerse: "So when the woman saw that the tree was good for food, and that it was a delight to the eyes, and that the tree was to be desired to make one wise, she took of its fruit and ate. (Genesis 3:6)",
        situation: "The serpent engaged Eve in conversation, questioning God's command about the tree of knowledge.",
        pressure: "The fruit appealed to three desires: appetite, beauty, and wisdom.",
        innerBattle: "Trust in God's provision versus the allure of the forbidden.",
        response: "She added to God's word, believed the serpent's lie, and ate.",
        outcome: "Sin entered the world through her and Adam's disobedience.",
        lesson: "The enemy's strategy is always the same: question God's word, then God's character.",
        traitRevealed: "Vulnerability to deception through desire",
        spiritualPrinciple: "Knowing God's word accurately is the first defense against deception",
        reflectionQuestions: [
          "Am I accurately representing God's word, or adding and subtracting from it?",
          "What forbidden things am I looking at with desire?"
        ],
        dnaSnapshot: { wisdom: 3, pride: 6, greed: 6, fear: 5 }
      }
    ]
  },
  {
    id: "lamech-cain",
    name: "Lamech (Cain's line)",
    meaning: "Powerful",
    emoji: "⚒️",
    role: "Boastful descendant of Cain, first polygamist",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 4:19-24"],
    archetypes: ["Oppressor", "Manipulator"],
    dna: { faith: 1, humility: 1, courage: 6, wisdom: 3, compassion: 1, fear: 3, pride: 10, greed: 7 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Boldness and self-confidence",
      weakness: "Arrogant violence and mockery of God's mercy",
      mindset: "If God protected Cain, how much more will I avenge myself",
      keyLesson: "Twisting God's grace into a license for violence leads to destruction",
      keyVerse: "If Cain's revenge is sevenfold, then Lamech's is seventy-sevenfold",
      keyVerseRef: "Genesis 4:24"
    },
    storyArc: "Lamech was the fifth generation from Cain. He took two wives, introduced polygamy, and boasted of killing a young man for wounding him. He twisted God's protection of Cain into a boast of self-protection, representing the escalation of sin in Cain's line.",
    therapyView: {
      drivingFears: ["Being seen as weak", "Loss of dominance"],
      coreMotivations: ["Power", "Self-glorification", "Vengeance"],
      relationalStyle: "Domineering; uses relationships for status",
      blindSpots: ["Confuses violence with strength", "Twists mercy into license"],
      healingMoments: ["None recorded"]
    },
    strengths: ["Boldness", "Cultural innovation through his sons"],
    weaknesses: ["Violence", "Arrogance", "Mockery of God's grace", "Polygamy"],
    journey: [
      { phase: "Failure", description: "Boasted of murder and twisted God's mercy into self-justification" },
      { phase: "Legacy", description: "Represents the apex of sin in Cain's line before the flood" }
    ],
    relationships: [
      { name: "Adah", role: "First wife" },
      { name: "Zillah", role: "Second wife" },
      { name: "Jabal", role: "Son, father of tent-dwellers" },
      { name: "Jubal", role: "Son, father of musicians" },
      { name: "Tubal-cain", role: "Son, forger of bronze and iron" }
    ],
    lessonsAndReflection: [
      "Sin escalates through generations when unchecked",
      "Twisting God's grace into license for sin is deeply dangerous",
      "Cultural achievement without godliness leads to moral decay"
    ],
    relatedCharacters: ["cain", "nimrod", "adam"],
    situations: [
      {
        id: "lamech-boasts-of-murder",
        title: "Boasting of Murder",
        category: "Power and Success",
        reference: "Genesis 4:23-24",
        situation: "Lamech killed a young man for striking him and boasted about it to his wives.",
        pressure: "A perceived wound to his honor demanded violent retaliation.",
        innerBattle: "None apparent—he was fully given over to pride.",
        response: "He murdered the man and composed a song boasting of his violence.",
        outcome: "He represented the culmination of Cain's corrupt line.",
        lesson: "Unchecked pride turns every slight into a justification for violence.",
        traitRevealed: "Arrogant violence",
        spiritualPrinciple: "Sin, left unchecked, escalates from generation to generation",
        reflectionQuestions: [
          "Am I twisting God's grace into permission to continue in sin?",
          "Do I react with disproportionate anger when I feel slighted?"
        ],
        dnaSnapshot: { pride: 10, compassion: 1, faith: 1 }
      }
    ]
  },
  {
    id: "nimrod",
    name: "Nimrod",
    meaning: "Rebel, mighty one",
    emoji: "🏰",
    role: "Mighty hunter before the LORD, founder of Babel",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 10:8-12", "Genesis 11:1-9"],
    archetypes: ["Oppressor", "King"],
    dna: { faith: 1, humility: 1, courage: 9, wisdom: 5, compassion: 2, fear: 2, pride: 10, greed: 8 },
    quickCard: {
      archetype: "King",
      strength: "Mighty hunter and kingdom builder",
      weakness: "Rebellion against God, empire-building pride",
      mindset: "I will make a name for myself that reaches heaven",
      keyLesson: "Human empires built in defiance of God will always be scattered",
      keyVerse: "He was a mighty hunter before the LORD",
      keyVerseRef: "Genesis 10:9"
    },
    storyArc: "Nimrod was the first mighty man on earth after the flood, a powerful hunter and kingdom builder. He founded Babel, Erech, Akkad, and Nineveh. Tradition associates him with the Tower of Babel—humanity's attempt to reach heaven and make a name apart from God. God scattered them and confused their language.",
    therapyView: {
      drivingFears: ["Insignificance", "Being scattered and forgotten"],
      coreMotivations: ["Fame", "Power", "Building an empire to rival God"],
      relationalStyle: "Authoritarian; leads through might and charisma",
      blindSpots: ["Cannot see that God opposes human self-exaltation", "Confuses empire with legacy"],
      healingMoments: ["None recorded"]
    },
    strengths: ["Strength", "Leadership", "Vision", "Kingdom-building ability"],
    weaknesses: ["Rebellion against God", "Pride", "Self-exaltation"],
    journey: [
      { phase: "Calling", description: "Rose as the first mighty man after the flood" },
      { phase: "Failure", description: "Built Babel in defiance of God's command to fill the earth" },
      { phase: "Legacy", description: "God scattered the people and confused their language" }
    ],
    relationships: [
      { name: "Cush", role: "Father" },
      { name: "Ham", role: "Grandfather" }
    ],
    lessonsAndReflection: [
      "Human greatness apart from God leads to confusion and scattering",
      "God will not share His glory with towers of human pride",
      "True legacy is built on obedience, not ambition"
    ],
    relatedCharacters: ["lamech-cain", "nebuchadnezzar", "pharaoh-exodus"],
    situations: [
      {
        id: "nimrod-tower-of-babel",
        title: "The Tower of Babel",
        category: "Power and Success",
        reference: "Genesis 11:1-9",
        keyVerse: "Come, let us build ourselves a city and a tower with its top in the heavens, and let us make a name for ourselves. (Genesis 11:4)",
        situation: "Humanity gathered on the plain of Shinar to build a tower reaching heaven and make a name for themselves.",
        pressure: "The desire to avoid being scattered and to achieve divine status.",
        innerBattle: "Corporate pride—the belief that unified human effort can rival God.",
        response: "They built the tower in direct defiance of God's command to fill the earth.",
        outcome: "God confused their language and scattered them across the earth.",
        lesson: "Unity in rebellion against God accomplishes nothing lasting.",
        traitRevealed: "Defiant ambition",
        spiritualPrinciple: "God will humble every attempt to build a kingdom apart from Him",
        reflectionQuestions: [
          "Am I building something to make a name for myself or for God?",
          "Where is my ambition actually rebellion against God's plan?"
        ],
        dnaSnapshot: { pride: 10, courage: 9, faith: 1 }
      }
    ]
  },
  {
    id: "shem",
    name: "Shem",
    meaning: "Name, renown",
    emoji: "🚢",
    role: "Noah's son, ancestor of the Semitic peoples and the Messiah",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 5:32", "Genesis 9:20-27", "Genesis 10:21-31", "Genesis 11:10-26"],
    archetypes: ["Patriarch", "Servant"],
    dna: { faith: 8, humility: 8, courage: 6, wisdom: 7, compassion: 7, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Reverence for his father and faithfulness to God",
      weakness: "Little personal detail recorded",
      mindset: "Honor and faithfulness define the path to blessing",
      keyLesson: "Honoring parents and walking in righteousness secures blessing for generations",
      keyVerse: "Blessed be the LORD, the God of Shem",
      keyVerseRef: "Genesis 9:26"
    },
    storyArc: "Shem survived the flood with his father Noah. When Noah lay drunk and exposed, Shem and Japheth walked backward to cover him, showing honor. Noah blessed Shem's God, and through Shem's line came Abraham, David, and Jesus Christ.",
    therapyView: {
      drivingFears: ["Dishonoring God or family"],
      coreMotivations: ["Honoring God", "Respecting family", "Preserving the godly line"],
      relationalStyle: "Respectful and discreet; protects others' dignity",
      blindSpots: ["Unknown"],
      healingMoments: ["Blessed by Noah", "His line carried the promise of redemption"]
    },
    strengths: ["Honor", "Faithfulness", "Discretion"],
    weaknesses: ["Little personal struggle recorded"],
    journey: [
      { phase: "Calling", description: "Survived the flood as one of Noah's faithful sons" },
      { phase: "Testing", description: "Chose to honor his father when Ham did not" },
      { phase: "Legacy", description: "Ancestor of Abraham and the Messianic line" }
    ],
    relationships: [
      { name: "Noah", role: "Father" },
      { name: "Ham", role: "Brother" },
      { name: "Japheth", role: "Brother" }
    ],
    lessonsAndReflection: [
      "How we respond to others' failures reveals our character",
      "Honoring parents, even flawed ones, brings blessing",
      "Faithfulness in one moment can shape generations"
    ],
    relatedCharacters: ["noah", "abraham", "japheth"],
    situations: [
      {
        id: "shem-covers-noah",
        title: "Covering Noah's Shame",
        category: "Obedience",
        reference: "Genesis 9:20-27",
        keyVerse: "Then Shem and Japheth took a garment, laid it on both their shoulders, and walked backward and covered the nakedness of their father. (Genesis 9:23)",
        situation: "Noah became drunk and lay exposed in his tent. Ham saw and told his brothers, but Shem and Japheth covered their father.",
        pressure: "Seeing a parent at their worst—vulnerable and shamed.",
        innerBattle: "The choice between mocking a fallen leader and honoring him despite his failure.",
        response: "Shem and Japheth walked backward to cover their father without looking at his shame.",
        outcome: "Noah blessed the God of Shem, and his line was chosen for the Messianic promise.",
        lesson: "Covering others' shame with honor is a godly response that brings blessing.",
        traitRevealed: "Honoring discretion",
        spiritualPrinciple: "Love covers a multitude of sins",
        reflectionQuestions: [
          "How do I respond when I see someone at their lowest?",
          "Do I expose or cover the shame of others?"
        ],
        dnaSnapshot: { humility: 8, compassion: 7, faith: 8 }
      }
    ]
  },
  {
    id: "tamar-genesis",
    name: "Tamar (Genesis)",
    meaning: "Palm tree",
    emoji: "🧣",
    role: "Judah's daughter-in-law who fought for her rights",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 38:1-30", "Matthew 1:3"],
    archetypes: ["Survivor", "Redeemed"],
    dna: { faith: 6, humility: 4, courage: 8, wisdom: 7, compassion: 4, fear: 4, pride: 5, greed: 2 },
    quickCard: {
      archetype: "Survivor",
      strength: "Resourceful determination to secure her rightful place",
      weakness: "Used deception to achieve justice",
      mindset: "If the system fails me, I will find another way",
      keyLesson: "God works through imperfect people and morally complex situations",
      keyVerse: "She is more righteous than I",
      keyVerseRef: "Genesis 38:26"
    },
    storyArc: "Married to Judah's wicked sons Er and Onan, who both died, Tamar was sent home with a false promise of the third son Shelah. When Judah failed to honor his word, Tamar disguised herself as a prostitute, conceived twins by Judah, and secured her place in the Messianic line.",
    therapyView: {
      drivingFears: ["Being forgotten and discarded", "Childlessness", "Injustice"],
      coreMotivations: ["Justice", "Survival", "Securing her place and offspring"],
      relationalStyle: "Strategic and patient; acts decisively when pushed to the limit",
      blindSpots: ["Willingness to use deception", "Desperation-driven choices"],
      healingMoments: ["Judah declared her more righteous than himself", "She bore Perez, ancestor of David and Christ"]
    },
    strengths: ["Courage", "Resourcefulness", "Patience", "Determination"],
    weaknesses: ["Deception", "Morally complex methods"],
    journey: [
      { phase: "Testing", description: "Widowed twice and denied her rightful husband" },
      { phase: "Failure", description: "Used deception to conceive by Judah" },
      { phase: "Legacy", description: "Bore Perez, securing her place in the line of Christ" }
    ],
    relationships: [
      { name: "Judah", role: "Father-in-law who wronged then vindicated her" },
      { name: "Er", role: "First husband, killed by God" },
      { name: "Onan", role: "Second husband, killed by God" },
      { name: "Perez", role: "Son, ancestor of David" }
    ],
    lessonsAndReflection: [
      "God includes morally complex people in His redemptive plan",
      "Injustice does not have the final word",
      "God's grace covers even the most tangled situations"
    ],
    relatedCharacters: ["judah", "ruth", "rahab"],
    situations: [
      {
        id: "tamar-disguise",
        title: "Disguising Herself to Secure Justice",
        category: "Betrayal",
        reference: "Genesis 38:12-26",
        keyVerse: "Then Judah identified them and said, 'She is more righteous than I, since I did not give her to my son Shelah.' (Genesis 38:26)",
        situation: "Judah failed to give Tamar his third son as promised. She disguised herself and conceived by Judah.",
        pressure: "Facing a life of childless widowhood due to Judah's broken promise.",
        innerBattle: "Desperation for justice versus the risk and shame of her plan.",
        response: "She disguised herself, secured Judah's pledge, and later proved his paternity.",
        outcome: "Judah acknowledged her righteousness. She bore twins and entered Christ's genealogy.",
        lesson: "God can bring redemption even through morally messy situations.",
        traitRevealed: "Desperate resourcefulness",
        spiritualPrinciple: "God's redemptive plan cannot be thwarted, even by human failure and moral complexity",
        reflectionQuestions: [
          "How do I respond when those in authority fail to keep their promises?",
          "Can I trust God to bring justice even when the situation looks hopeless?"
        ],
        dnaSnapshot: { courage: 8, wisdom: 7, faith: 6 }
      }
    ]
  },
  {
    id: "judah",
    name: "Judah",
    meaning: "Praise",
    emoji: "🦁",
    role: "Fourth son of Jacob, ancestor of the tribe of the Messiah",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 37:26-27", "Genesis 38", "Genesis 43:8-9", "Genesis 44:18-34", "Genesis 49:8-12"],
    archetypes: ["Patriarch", "Redeemed"],
    dna: { faith: 6, humility: 5, courage: 7, wisdom: 6, compassion: 6, fear: 4, pride: 6, greed: 5 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Grew from selfishness to self-sacrifice",
      weakness: "Early life marked by callousness and hypocrisy",
      mindset: "I will offer myself in place of my brother",
      keyLesson: "True transformation is proven when we sacrifice ourselves for others",
      keyVerse: "The scepter shall not depart from Judah",
      keyVerseRef: "Genesis 49:10"
    },
    storyArc: "Judah suggested selling Joseph into slavery. He married a Canaanite, failed Tamar, and lived selfishly. But when Benjamin's life was at stake in Egypt, Judah offered himself as a slave in his brother's place—the same brother type he once sold. Jacob blessed him with the scepter and the Messianic promise.",
    therapyView: {
      drivingFears: ["Losing another brother", "Facing his past guilt"],
      coreMotivations: ["Redemption of past failures", "Protecting family", "Proving he has changed"],
      relationalStyle: "Evolved from manipulative to self-sacrificial",
      blindSpots: ["Early hypocrisy with Tamar", "Initial callousness toward Joseph"],
      healingMoments: ["Offering himself for Benjamin", "Receiving the Messianic blessing from Jacob"]
    },
    strengths: ["Leadership", "Eloquence", "Capacity for transformation", "Self-sacrifice"],
    weaknesses: ["Early callousness", "Hypocrisy", "Lust"],
    journey: [
      { phase: "Failure", description: "Suggested selling Joseph and failed Tamar" },
      { phase: "Refinement", description: "Humbled by Tamar's righteousness and years of guilt" },
      { phase: "Legacy", description: "Offered himself for Benjamin and received the Messianic blessing" }
    ],
    relationships: [
      { name: "Jacob", role: "Father" },
      { name: "Joseph", role: "Brother he sold" },
      { name: "Benjamin", role: "Brother he later protected" },
      { name: "Tamar", role: "Daughter-in-law" },
      { name: "Perez", role: "Son through Tamar" }
    ],
    lessonsAndReflection: [
      "God can transform the selfish into the self-sacrificial",
      "Past failures do not disqualify us from God's plan",
      "True repentance is proven through changed action"
    ],
    relatedCharacters: ["joseph", "tamar-genesis", "benjamin", "david"],
    situations: [
      {
        id: "judah-sells-joseph",
        title: "Selling Joseph into Slavery",
        category: "Betrayal",
        reference: "Genesis 37:26-28",
        situation: "When the brothers wanted to kill Joseph, Judah proposed selling him to traders instead.",
        pressure: "Jealousy toward the favored brother and group pressure from his brothers.",
        innerBattle: "Conscience versus greed and jealousy.",
        response: "He proposed selling Joseph, framing it as mercy while profiting from it.",
        outcome: "Joseph was sold into slavery; the family was shattered for decades.",
        lesson: "Rationalizing evil as a lesser evil is still evil.",
        traitRevealed: "Self-serving pragmatism",
        spiritualPrinciple: "Compromise with evil always costs more than we expect",
        reflectionQuestions: [
          "Have I ever rationalized harmful actions by comparing them to worse options?",
          "What jealousies am I harboring that could lead to destructive choices?"
        ],
        dnaSnapshot: { greed: 5, pride: 6, compassion: 3 }
      },
      {
        id: "judah-offers-himself",
        title: "Offering Himself for Benjamin",
        category: "Sacrifice",
        reference: "Genesis 44:18-34",
        keyVerse: "Now therefore, please let your servant remain instead of the boy as a servant to my lord, and let the boy go back with his brothers. (Genesis 44:33)",
        situation: "Joseph tested his brothers by framing Benjamin. Judah stepped forward to offer himself as a slave in Benjamin's place.",
        pressure: "His father would die of grief if Benjamin did not return.",
        innerBattle: "Self-preservation versus the chance to do what he failed to do for Joseph.",
        response: "He gave an eloquent speech and offered his own freedom for his brother's.",
        outcome: "Joseph revealed himself and the family was reunited. Judah proved his transformation.",
        lesson: "True repentance is demonstrated through self-sacrificial action.",
        traitRevealed: "Self-sacrificial love",
        spiritualPrinciple: "The greatest proof of change is willingness to pay the cost you once imposed on others",
        reflectionQuestions: [
          "Am I willing to sacrifice for those I have previously wronged?",
          "Has my repentance been proven through changed behavior?"
        ],
        dnaSnapshot: { courage: 8, compassion: 8, humility: 7 }
      }
    ]
  },
  {
    id: "reuben",
    name: "Reuben",
    meaning: "Behold, a son",
    emoji: "🌊",
    role: "Jacob's firstborn, unstable as water",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 35:22", "Genesis 37:21-22", "Genesis 42:22", "Genesis 49:3-4"],
    archetypes: ["Tragic Hero", "Patriarch"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 6, fear: 5, pride: 6, greed: 4 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Had good impulses—tried to save Joseph",
      weakness: "Unstable, lacked follow-through, defiled his father's bed",
      mindset: "I mean well but cannot hold my ground",
      keyLesson: "Good intentions without resolve lead to forfeited blessings",
      keyVerse: "Unstable as water, you shall not have preeminence",
      keyVerseRef: "Genesis 49:4"
    },
    storyArc: "As Jacob's firstborn, Reuben had every advantage. He showed compassion in trying to rescue Joseph from the pit, but he lacked the resolve to follow through. His sin with Bilhah, his father's concubine, cost him his birthright. Jacob called him unstable as water.",
    therapyView: {
      drivingFears: ["Losing his position", "Being blamed for Joseph's fate"],
      coreMotivations: ["Restoring his standing", "Doing the right thing but lacking resolve"],
      relationalStyle: "Well-meaning but ineffective; starts strong, finishes weak",
      blindSpots: ["Confuses intention with action", "Sexual impulsivity", "Inability to lead decisively"],
      healingMoments: ["Attempted to save Joseph", "Offered his own sons as surety for Benjamin"]
    },
    strengths: ["Compassion", "Good intentions", "Willingness to take responsibility"],
    weaknesses: ["Instability", "Lack of follow-through", "Sexual sin", "Indecisiveness"],
    journey: [
      { phase: "Calling", description: "Born as the firstborn with the rights of preeminence" },
      { phase: "Failure", description: "Defiled his father's bed and failed to rescue Joseph" },
      { phase: "Legacy", description: "Lost his birthright; his tribe never produced a leader of note" }
    ],
    relationships: [
      { name: "Jacob", role: "Father" },
      { name: "Bilhah", role: "Father's concubine" },
      { name: "Joseph", role: "Brother he tried to save" }
    ],
    lessonsAndReflection: [
      "Good intentions without decisive action are worthless",
      "Sin has consequences that outlast the moment",
      "Instability forfeits the blessings of the firstborn"
    ],
    relatedCharacters: ["judah", "joseph", "jacob"],
    situations: [
      {
        id: "reuben-fails-joseph",
        title: "Failing to Rescue Joseph",
        category: "Fear",
        reference: "Genesis 37:21-30",
        situation: "The brothers plotted to kill Joseph. Reuben convinced them to throw him in a pit, planning to rescue him later.",
        pressure: "Standing against his brothers' murderous intent as the firstborn.",
        innerBattle: "Wanting to do right but lacking the courage to act openly.",
        response: "He delayed, and by the time he returned, Joseph had been sold.",
        outcome: "Joseph was enslaved in Egypt. Reuben tore his clothes in grief but it was too late.",
        lesson: "Delayed obedience is disobedience; half-measures in crisis lead to failure.",
        traitRevealed: "Indecisive compassion",
        spiritualPrinciple: "The right action at the wrong time accomplishes nothing",
        reflectionQuestions: [
          "Where am I delaying action that needs to be taken now?",
          "Do I take half-measures when the situation demands full commitment?"
        ],
        dnaSnapshot: { compassion: 6, courage: 5, fear: 5 }
      }
    ]
  },
  {
    id: "simeon-levi",
    name: "Simeon & Levi",
    meaning: "Heard / Attached",
    emoji: "🗡️",
    role: "Brothers who massacred Shechem in revenge for Dinah",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 34:1-31", "Genesis 49:5-7"],
    archetypes: ["Warrior", "Tragic Hero"],
    dna: { faith: 4, humility: 2, courage: 8, wisdom: 2, compassion: 3, fear: 2, pride: 8, greed: 4 },
    quickCard: {
      archetype: "Warrior",
      strength: "Fierce loyalty to family",
      weakness: "Uncontrolled rage and deceptive violence",
      mindset: "No one harms our family without paying the ultimate price",
      keyLesson: "Righteous anger that turns to cruelty becomes sin",
      keyVerse: "Cursed be their anger, for it is fierce, and their wrath, for it is cruel",
      keyVerseRef: "Genesis 49:7"
    },
    storyArc: "When Shechem violated their sister Dinah, Simeon and Levi devised a plan of deceptive vengeance. They told the men of Shechem to circumcise themselves, then attacked while they were recovering, killing every male. Jacob rebuked them, and his deathbed prophecy cursed their anger.",
    therapyView: {
      drivingFears: ["Family dishonor", "Appearing weak before enemies"],
      coreMotivations: ["Avenging family honor", "Protecting their sister", "Demonstrating strength"],
      relationalStyle: "Fiercely loyal but dangerously reactive",
      blindSpots: ["Cannot distinguish justice from vengeance", "Deception seems justified by the cause"],
      healingMoments: ["Levi's tribe was later consecrated to God's service after the golden calf incident"]
    },
    strengths: ["Loyalty", "Courage", "Decisive action"],
    weaknesses: ["Uncontrolled anger", "Cruelty", "Deception", "Disproportionate revenge"],
    journey: [
      { phase: "Testing", description: "Their sister was violated by Shechem" },
      { phase: "Failure", description: "Responded with deceptive massacre rather than justice" },
      { phase: "Legacy", description: "Cursed by Jacob; Simeon absorbed into Judah, Levi scattered but later redeemed for priestly service" }
    ],
    relationships: [
      { name: "Jacob", role: "Father who rebuked them" },
      { name: "Dinah", role: "Sister they avenged" },
      { name: "Shechem", role: "The man who violated Dinah" }
    ],
    lessonsAndReflection: [
      "Righteous anger must not lead to unrighteous methods",
      "Vengeance belongs to God, not to us",
      "Even a just cause can be corrupted by cruel methods"
    ],
    relatedCharacters: ["dinah", "jacob", "judah"],
    situations: [
      {
        id: "simeon-levi-massacre",
        title: "The Massacre at Shechem",
        category: "Conflict",
        reference: "Genesis 34:13-31",
        situation: "After Shechem violated Dinah, the brothers demanded circumcision as a condition for marriage, then attacked.",
        pressure: "Family honor demanded a response to a terrible crime.",
        innerBattle: "Justice versus vengeance; proportional response versus total destruction.",
        response: "They used religious rites deceptively and slaughtered an entire city.",
        outcome: "Jacob was horrified and feared retaliation. He later cursed their anger.",
        lesson: "Using sacred things for violent ends corrupts both the means and the cause.",
        traitRevealed: "Wrathful deception",
        spiritualPrinciple: "Anger that leads to cruelty is cursed, even when the initial cause was just",
        reflectionQuestions: [
          "When I am rightfully angry, do I respond with justice or vengeance?",
          "Have I ever used something sacred to accomplish something violent?"
        ],
        dnaSnapshot: { courage: 8, pride: 8, wisdom: 2, compassion: 3 }
      }
    ]
  },
  {
    id: "dinah",
    name: "Dinah",
    meaning: "Judged, vindicated",
    emoji: "😢",
    role: "Jacob's daughter, violated by Shechem",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 34:1-31"],
    archetypes: ["Survivor"],
    dna: { faith: 5, humility: 6, courage: 5, wisdom: 4, compassion: 6, fear: 6, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Survivor",
      strength: "Her story exposes the cost of violence and the need for justice",
      weakness: "She had no voice in the narrative—spoken for and acted upon",
      mindset: "My pain became everyone else's cause but not my healing",
      keyLesson: "Victims deserve justice, not vengeance that creates more victims",
      keyVerse: "Now Dinah the daughter of Leah, whom she had borne to Jacob, went out to see the women of the land",
      keyVerseRef: "Genesis 34:1"
    },
    storyArc: "Dinah went out to visit the women of the land and was violated by Shechem, the prince of the region. Though Shechem claimed to love her, the harm was done. Her brothers' response—a deceptive massacre—brought further chaos. Dinah's own voice is never recorded.",
    therapyView: {
      drivingFears: ["Powerlessness", "Being defined by what happened to her"],
      coreMotivations: ["Connection and community", "Being seen as more than a victim"],
      relationalStyle: "Silenced; others acted on her behalf without consulting her",
      blindSpots: ["Not applicable—she was the victim, not the agent"],
      healingMoments: ["Her story is preserved in Scripture as a witness to the cost of violence"]
    },
    strengths: ["Her story brings awareness to injustice", "Desire for community"],
    weaknesses: ["Vulnerability in a dangerous world", "Voicelessness"],
    journey: [
      { phase: "Testing", description: "Violated by Shechem while visiting the women of the land" },
      { phase: "Legacy", description: "Her story exposes the cycle of violence and the silencing of victims" }
    ],
    relationships: [
      { name: "Jacob", role: "Father" },
      { name: "Leah", role: "Mother" },
      { name: "Simeon", role: "Brother who avenged her" },
      { name: "Levi", role: "Brother who avenged her" },
      { name: "Shechem", role: "The man who violated her" }
    ],
    lessonsAndReflection: [
      "Victims must not be forgotten or silenced in the pursuit of justice",
      "Violence begets more violence",
      "God sees the voiceless and the powerless"
    ],
    relatedCharacters: ["simeon-levi", "jacob", "tamar-genesis"],
    situations: [
      {
        id: "dinah-violated",
        title: "Violated by Shechem",
        category: "Persecution",
        reference: "Genesis 34:1-4",
        situation: "Dinah went to visit the women of the land and was seized and violated by Shechem, the local prince.",
        pressure: "She was a vulnerable young woman in a foreign land.",
        innerBattle: "Powerlessness in the face of violence.",
        response: "She had no recorded response—others acted on her behalf.",
        outcome: "Her brothers' vengeance brought more chaos, but her pain sparked a reckoning.",
        lesson: "God does not overlook the suffering of the vulnerable, even when Scripture does not record their words.",
        traitRevealed: "Innocent vulnerability",
        spiritualPrinciple: "God sees and cares for those who have no voice",
        reflectionQuestions: [
          "Do I advocate for the voiceless in my community?",
          "How can I respond to injustice without creating more victims?"
        ],
        dnaSnapshot: { fear: 6, compassion: 6 }
      }
    ]
  },
  {
    id: "potiphar",
    name: "Potiphar",
    meaning: "He whom Ra gave",
    emoji: "🏛️",
    role: "Egyptian officer who bought Joseph as a slave",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 39:1-20"],
    archetypes: ["Judge", "Tragic Hero"],
    dna: { faith: 3, humility: 4, courage: 5, wisdom: 5, compassion: 4, fear: 5, pride: 6, greed: 5 },
    quickCard: {
      archetype: "Judge",
      strength: "Recognized Joseph's competence and trusted him fully",
      weakness: "Believed his wife's lie without investigation",
      mindset: "My household runs well because of this servant, but my wife's honor comes first",
      keyLesson: "Trusting appearances over truth can lead to punishing the innocent",
      keyVerse: "So Joseph's master took him and put him into the prison",
      keyVerseRef: "Genesis 39:20"
    },
    storyArc: "Potiphar, captain of Pharaoh's guard, bought Joseph and quickly recognized God's blessing on him. He entrusted his entire household to Joseph. When his wife falsely accused Joseph, Potiphar imprisoned him—though notably did not execute him, suggesting possible doubt.",
    therapyView: {
      drivingFears: ["Public shame", "Losing face before Pharaoh"],
      coreMotivations: ["Maintaining household order", "Protecting reputation"],
      relationalStyle: "Authoritative but conflict-avoidant in domestic matters",
      blindSpots: ["Trusted his wife's account without questioning", "Valued reputation over justice"],
      healingMoments: ["His trust in Joseph was genuine while it lasted"]
    },
    strengths: ["Discernment of Joseph's ability", "Delegation", "Organizational leadership"],
    weaknesses: ["Failure to investigate", "Prioritizing reputation over truth"],
    journey: [
      { phase: "Calling", description: "Prospered because of Joseph's management of his household" },
      { phase: "Failure", description: "Imprisoned an innocent man based on a false accusation" }
    ],
    relationships: [
      { name: "Joseph", role: "Trusted servant he imprisoned" },
      { name: "Potiphar's wife", role: "Wife who lied about Joseph" }
    ],
    lessonsAndReflection: [
      "Leaders must investigate before passing judgment",
      "Reputation-driven decisions can punish the innocent",
      "God's hand on someone is visible even to unbelievers"
    ],
    relatedCharacters: ["joseph", "pharaoh-joseph"],
    situations: [
      {
        id: "potiphar-imprisons-joseph",
        title: "Imprisoning an Innocent Man",
        category: "Conflict",
        reference: "Genesis 39:13-20",
        situation: "Potiphar's wife falsely accused Joseph of assault. Potiphar had to choose between his wife and his trusted servant.",
        pressure: "Honor culture demanded he act on his wife's accusation regardless of doubt.",
        innerBattle: "Suspicion that his wife lied versus the social demand to defend her honor.",
        response: "He imprisoned Joseph but did not execute him, possibly reflecting doubt.",
        outcome: "Joseph was jailed but God was with him even there.",
        lesson: "When leaders fail to pursue truth, the innocent suffer.",
        traitRevealed: "Conflict avoidance masking injustice",
        spiritualPrinciple: "Justice requires the courage to investigate, not just react",
        reflectionQuestions: [
          "Have I ever punished someone without hearing their side?",
          "Do I value reputation more than truth?"
        ],
        dnaSnapshot: { wisdom: 5, fear: 5, pride: 6 }
      }
    ]
  },
  {
    id: "asenath",
    name: "Asenath",
    meaning: "Belonging to the goddess Neith",
    emoji: "🌸",
    role: "Joseph's Egyptian wife, mother of Ephraim and Manasseh",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 41:45", "Genesis 41:50-52", "Genesis 46:20"],
    archetypes: ["Matriarch", "Servant"],
    dna: { faith: 5, humility: 6, courage: 5, wisdom: 5, compassion: 6, fear: 3, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Mother of two tribes of Israel despite being a foreigner",
      weakness: "Little is known of her personal faith journey",
      mindset: "My life became part of a story far greater than my origin",
      keyLesson: "God grafts outsiders into His family and purposes",
      keyVerse: "Pharaoh... gave him in marriage Asenath, the daughter of Potiphera priest of On",
      keyVerseRef: "Genesis 41:45"
    },
    storyArc: "Asenath was the daughter of an Egyptian priest, given to Joseph as wife by Pharaoh. She bore Manasseh and Ephraim, who became two of the twelve tribes of Israel. Though from a pagan background, she was grafted into the covenant family.",
    therapyView: {
      drivingFears: ["Unknown—little recorded"],
      coreMotivations: ["Supporting her husband", "Mothering the next generation"],
      relationalStyle: "Supportive and faithful",
      blindSpots: ["Unknown"],
      healingMoments: ["Her sons were blessed by Jacob and became tribes of Israel"]
    },
    strengths: ["Motherhood", "Integration into a foreign faith", "Faithfulness"],
    weaknesses: ["Little personal detail recorded"],
    journey: [
      { phase: "Calling", description: "Given as wife to Joseph and became mother of two tribes" },
      { phase: "Legacy", description: "Her sons Ephraim and Manasseh became tribes of Israel" }
    ],
    relationships: [
      { name: "Joseph", role: "Husband" },
      { name: "Potiphera", role: "Father, priest of On" },
      { name: "Manasseh", role: "Firstborn son" },
      { name: "Ephraim", role: "Second son" },
      { name: "Jacob", role: "Father-in-law who blessed her sons" }
    ],
    lessonsAndReflection: [
      "God includes outsiders in His redemptive plan",
      "Faithfulness in family life shapes nations",
      "Our background does not determine our destiny in God's story"
    ],
    relatedCharacters: ["joseph", "ruth", "rahab"],
    situations: [
      {
        id: "asenath-grafted-in",
        title: "Grafted into the Covenant Family",
        category: "Calling",
        reference: "Genesis 41:45-52",
        situation: "A pagan priest's daughter married Joseph and became mother of two Israelite tribes.",
        pressure: "Integrating into a completely different faith and culture.",
        innerBattle: "Leaving behind her father's religion and embracing Joseph's God.",
        response: "She bore and raised Manasseh and Ephraim within Joseph's household of faith.",
        outcome: "Her sons were adopted by Jacob and became full tribes of Israel.",
        lesson: "God's family is not limited by ethnicity or background.",
        traitRevealed: "Faithful integration",
        spiritualPrinciple: "God grafts the outsider into the family tree of promise",
        reflectionQuestions: [
          "Do I welcome outsiders into the faith community?",
          "How has God used my unexpected background for His purposes?"
        ],
        dnaSnapshot: { faith: 5, humility: 6 }
      }
    ]
  },
  {
    id: "pharaoh-joseph",
    name: "Pharaoh (Joseph's)",
    meaning: "Great house",
    emoji: "💤",
    role: "The dreaming Pharaoh who elevated Joseph",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 41:1-57"],
    archetypes: ["King", "Seeker"],
    dna: { faith: 4, humility: 5, courage: 5, wisdom: 6, compassion: 5, fear: 5, pride: 5, greed: 4 },
    quickCard: {
      archetype: "King",
      strength: "Wisdom to recognize God's hand in Joseph and act on his counsel",
      weakness: "Dependent on others for spiritual understanding",
      mindset: "The gods have shown me what will happen; who can help me act?",
      keyLesson: "Wise leaders recognize wisdom in others and act on it",
      keyVerse: "Can we find a man like this, in whom is the Spirit of God?",
      keyVerseRef: "Genesis 41:38"
    },
    storyArc: "Pharaoh was troubled by two dreams no one could interpret. His cupbearer remembered Joseph in prison. Joseph interpreted the dreams—seven years of plenty followed by seven of famine—and Pharaoh immediately elevated him to second in command. His willingness to listen saved Egypt and the surrounding nations.",
    therapyView: {
      drivingFears: ["The meaning of his dreams", "Famine destroying his kingdom"],
      coreMotivations: ["Preserving his kingdom", "Understanding divine revelation"],
      relationalStyle: "Authoritative but open to counsel from unexpected sources",
      blindSpots: ["Relied on magicians before discovering Joseph", "Political motives mixed with spiritual openness"],
      healingMoments: ["Recognized the Spirit of God in Joseph", "His kingdom was saved through wise action"]
    },
    strengths: ["Openness to counsel", "Decisive action", "Recognizing divine wisdom"],
    weaknesses: ["Spiritual dependence on interpreters", "Initially overlooked Joseph"],
    journey: [
      { phase: "Testing", description: "Troubled by prophetic dreams no one could interpret" },
      { phase: "Legacy", description: "Elevated Joseph and saved Egypt from famine" }
    ],
    relationships: [
      { name: "Joseph", role: "Vizier who interpreted his dreams" },
      { name: "Cupbearer", role: "Servant who recommended Joseph" }
    ],
    lessonsAndReflection: [
      "God speaks even to those outside the covenant to accomplish His purposes",
      "Wise leaders act on good counsel regardless of its source",
      "Humility to seek help is a mark of strong leadership"
    ],
    relatedCharacters: ["joseph", "nebuchadnezzar", "potiphar"],
    situations: [
      {
        id: "pharaoh-dreams",
        title: "The Prophetic Dreams",
        category: "Leadership Pressure",
        reference: "Genesis 41:1-40",
        keyVerse: "Then Pharaoh said to Joseph, 'Since God has shown you all this, there is none so discerning and wise as you are.' (Genesis 41:39)",
        situation: "Pharaoh had two troubling dreams about seven fat cows consumed by seven thin ones, and seven full ears of grain consumed by seven thin ones.",
        pressure: "No one in his court could interpret the dreams, and their meaning felt urgent.",
        innerBattle: "The anxiety of knowing something important was being revealed but not understanding it.",
        response: "He listened to Joseph, recognized the Spirit of God in him, and elevated him to power.",
        outcome: "Egypt was prepared for famine and became the breadbasket of the ancient world.",
        lesson: "The best leaders recognize giftedness in others and empower them to act.",
        traitRevealed: "Humble authority",
        spiritualPrinciple: "God gives wisdom to those who seek it and honor those who carry it",
        reflectionQuestions: [
          "Am I willing to receive wisdom from unexpected sources?",
          "Do I act decisively when God reveals His plan through others?"
        ],
        dnaSnapshot: { wisdom: 6, humility: 5 }
      }
    ]
  },
  {
    id: "korah",
    name: "Korah",
    meaning: "Baldness",
    emoji: "🕳️",
    role: "Levite who led a rebellion against Moses and Aaron",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Numbers 16:1-50", "Jude 1:11"],
    archetypes: ["Manipulator", "Oppressor"],
    dna: { faith: 2, humility: 1, courage: 7, wisdom: 3, compassion: 2, fear: 3, pride: 10, greed: 7 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Ability to rally others and articulate grievances",
      weakness: "Pride disguised as egalitarianism; coveted Moses' and Aaron's authority",
      mindset: "All the congregation is holy—who made you the leaders?",
      keyLesson: "Challenging God-appointed authority under the guise of equality is rebellion against God",
      keyVerse: "You have gone too far! For all in the congregation are holy",
      keyVerseRef: "Numbers 16:3"
    },
    storyArc: "Korah, a Levite, along with Dathan, Abiram, and 250 leaders, challenged Moses and Aaron's authority, claiming all Israel was equally holy. Moses proposed a test with incense. God opened the earth and swallowed the rebels alive, and fire consumed the 250 who offered incense.",
    therapyView: {
      drivingFears: ["Being overlooked", "Others receiving honor he deserved"],
      coreMotivations: ["Power", "Recognition", "Dismantling authority he envied"],
      relationalStyle: "Coalition builder; uses populist rhetoric to gain followers",
      blindSpots: ["Confused equality before God with equal authority", "Could not see his jealousy as sin"],
      healingMoments: ["None; his rebellion ended in catastrophic judgment"]
    },
    strengths: ["Charisma", "Coalition building", "Articulate speech"],
    weaknesses: ["Jealousy", "Pride masked as concern for equality", "Rebellion against God"],
    journey: [
      { phase: "Resistance", description: "Challenged Moses and Aaron's God-given authority" },
      { phase: "Failure", description: "The earth opened and swallowed him alive" }
    ],
    relationships: [
      { name: "Moses", role: "Leader he challenged" },
      { name: "Aaron", role: "Priest whose role he coveted" },
      { name: "Dathan and Abiram", role: "Co-conspirators" }
    ],
    lessonsAndReflection: [
      "Not all who cry for equality seek justice; some seek power",
      "God defends His appointed leaders in His own way",
      "Rebellion against God's order has severe consequences"
    ],
    relatedCharacters: ["moses", "aaron", "miriam"],
    situations: [
      {
        id: "korah-rebellion",
        title: "The Rebellion Against Moses",
        category: "Conflict",
        reference: "Numbers 16:1-35",
        keyVerse: "And the earth opened its mouth and swallowed them up, with their households. (Numbers 16:32)",
        situation: "Korah gathered 250 leaders to challenge Moses and Aaron, claiming all Israel was holy enough to lead.",
        pressure: "Dissatisfaction with the leadership structure and desire for priestly authority.",
        innerBattle: "Jealousy masked as righteous concern for the congregation.",
        response: "He publicly challenged Moses and offered unauthorized incense.",
        outcome: "The earth swallowed Korah and his household; fire consumed the 250.",
        lesson: "Challenging God-appointed authority is ultimately challenging God Himself.",
        traitRevealed: "Jealousy disguised as justice",
        spiritualPrinciple: "God establishes authority and defends it against presumptuous challengers",
        reflectionQuestions: [
          "Is my frustration with leadership driven by genuine concern or hidden jealousy?",
          "Am I content with the role God has given me?"
        ],
        dnaSnapshot: { pride: 10, faith: 2, humility: 1 }
      }
    ]
  },
  {
    id: "achan",
    name: "Achan",
    meaning: "Trouble",
    emoji: "💰",
    role: "Israelite who stole from Jericho and brought defeat on Israel",
    era: "Conquest",
    testament: "OT",
    keyScriptures: ["Joshua 7:1-26"],
    archetypes: ["Tragic Hero", "Manipulator"],
    dna: { faith: 3, humility: 2, courage: 3, wisdom: 2, compassion: 2, fear: 5, pride: 5, greed: 9 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "None notable",
      weakness: "Greed that cost thirty-six lives and brought national defeat",
      mindset: "No one will know; one man's secret sin cannot matter that much",
      keyLesson: "Hidden sin affects the entire community, not just the individual",
      keyVerse: "I saw... I coveted... I took",
      keyVerseRef: "Joshua 7:21"
    },
    storyArc: "After Jericho's miraculous fall, God commanded that all spoils be devoted to Him. Achan saw a beautiful cloak, silver, and gold, coveted them, and hid them under his tent. Israel's next battle at Ai ended in defeat. God revealed Achan's sin, and he and his family were stoned and burned.",
    therapyView: {
      drivingFears: ["Poverty", "Missing out on wealth"],
      coreMotivations: ["Material gain", "Secret indulgence"],
      relationalStyle: "Deceptive; hides his true actions from the community",
      blindSpots: ["Believed his sin could remain hidden", "Did not grasp the communal impact of personal sin"],
      healingMoments: ["His confession, though too late, serves as a warning"]
    },
    strengths: ["Honesty in confession when caught"],
    weaknesses: ["Greed", "Deception", "Disregard for God's command", "Self-centeredness"],
    journey: [
      { phase: "Failure", description: "Stole devoted things from Jericho and hid them" },
      { phase: "Legacy", description: "His sin caused Israel's defeat at Ai; he was executed in the Valley of Achor" }
    ],
    relationships: [
      { name: "Joshua", role: "Leader who carried out judgment" },
      { name: "Israel", role: "Community harmed by his sin" }
    ],
    lessonsAndReflection: [
      "Hidden sin always has public consequences",
      "The pattern of sin: I saw, I coveted, I took",
      "One person's disobedience can bring defeat to the whole community"
    ],
    relatedCharacters: ["joshua", "gehazi", "ananias"],
    situations: [
      {
        id: "achan-steals-from-jericho",
        title: "Stealing the Devoted Things",
        category: "Temptation",
        reference: "Joshua 7:1-26",
        keyVerse: "When I saw among the spoil a beautiful cloak from Shinar, and 200 shekels of silver, and a bar of gold... I coveted them and took them. (Joshua 7:21)",
        situation: "Achan took items God commanded be devoted to destruction after the fall of Jericho.",
        pressure: "Beautiful and valuable items were within easy reach and no one was watching.",
        innerBattle: "Desire for wealth versus obedience to God's clear command.",
        response: "He saw, coveted, and took—then buried the items under his tent.",
        outcome: "Israel lost the battle at Ai; thirty-six men died. Achan and his family were executed.",
        lesson: "The progression of sin—seeing, coveting, taking—always leads to death.",
        traitRevealed: "Secret greed",
        spiritualPrinciple: "There is no such thing as private sin; all sin has communal consequences",
        reflectionQuestions: [
          "What am I hiding that I know God has forbidden?",
          "Do I realize how my secret sins affect those around me?"
        ],
        dnaSnapshot: { greed: 9, faith: 3, wisdom: 2 }
      }
    ]
  },
  {
    id: "phinehas-aaron",
    name: "Phinehas (Aaron's grandson)",
    meaning: "Mouth of brass",
    emoji: "⚡",
    role: "Zealous priest who stopped a plague through decisive action",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Numbers 25:1-13", "Psalm 106:30-31"],
    archetypes: ["Priest", "Warrior"],
    dna: { faith: 9, humility: 6, courage: 10, wisdom: 7, compassion: 4, fear: 1, pride: 3, greed: 0 },
    quickCard: {
      archetype: "Priest",
      strength: "Holy zeal that took immediate, decisive action for God's honor",
      weakness: "Violent means of atonement",
      mindset: "God's holiness demands immediate, courageous action",
      keyLesson: "Holy zeal, rightly directed, can turn away God's wrath",
      keyVerse: "Phinehas... has turned back my wrath from the people of Israel, in that he was jealous with my jealousy",
      keyVerseRef: "Numbers 25:11"
    },
    storyArc: "While Israel sinned with Moabite women at Baal-Peor and a plague killed 24,000, an Israelite man brazenly brought a Midianite woman into the camp. Phinehas took a spear and killed them both, stopping the plague. God rewarded him with a covenant of perpetual priesthood.",
    therapyView: {
      drivingFears: ["God's wrath consuming His people"],
      coreMotivations: ["God's holiness", "Protecting the community", "Priestly duty"],
      relationalStyle: "Decisive and action-oriented in crisis",
      blindSpots: ["Zeal without mercy could become dangerous in other contexts"],
      healingMoments: ["God granted him a covenant of peace and perpetual priesthood"]
    },
    strengths: ["Holy zeal", "Courage", "Decisiveness", "Priestly devotion"],
    weaknesses: ["Violent action", "Zeal that could become extreme"],
    journey: [
      { phase: "Calling", description: "Grandson of Aaron, born into the priestly line" },
      { phase: "Testing", description: "Acted decisively when Israel was sinning at Baal-Peor" },
      { phase: "Legacy", description: "Received God's covenant of peace and perpetual priesthood" }
    ],
    relationships: [
      { name: "Aaron", role: "Grandfather" },
      { name: "Eleazar", role: "Father" },
      { name: "Moses", role: "Leader during the crisis" }
    ],
    lessonsAndReflection: [
      "Sometimes one act of courage can save a community",
      "Zeal for God's holiness is counted as righteousness",
      "Leadership sometimes requires unpopular decisive action"
    ],
    relatedCharacters: ["aaron", "moses", "elijah"],
    situations: [
      {
        id: "phinehas-stops-plague",
        title: "Stopping the Plague at Baal-Peor",
        category: "Obedience",
        reference: "Numbers 25:1-13",
        keyVerse: "Then Phinehas... took a spear in his hand... and pierced both of them... So the plague on the people of Israel was stopped. (Numbers 25:7-8)",
        situation: "Israel was sinning with Moabite women and worshipping Baal. A plague was killing thousands.",
        pressure: "The entire nation was under God's wrath and people were dying.",
        innerBattle: "The risk of acting violently versus the cost of doing nothing.",
        response: "He took a spear and killed the offending couple, stopping the plague.",
        outcome: "The plague stopped at 24,000 dead. God gave Phinehas a covenant of perpetual priesthood.",
        lesson: "When sin threatens the community, decisive action for God's honor is righteous.",
        traitRevealed: "Holy zeal",
        spiritualPrinciple: "Zeal for God's holiness, rightly expressed, brings peace and blessing",
        reflectionQuestions: [
          "Am I passive when sin threatens my community?",
          "Do I have zeal for God's holiness or only for comfort?"
        ],
        dnaSnapshot: { courage: 10, faith: 9, fear: 1 }
      }
    ]
  },
  {
    id: "shamgar",
    name: "Shamgar",
    meaning: "Sword",
    emoji: "🐂",
    role: "Judge who killed 600 Philistines with an oxgoad",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 3:31", "Judges 5:6"],
    archetypes: ["Warrior", "Judge"],
    dna: { faith: 7, humility: 6, courage: 10, wisdom: 5, compassion: 5, fear: 1, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Extraordinary courage with ordinary tools",
      weakness: "Little is known beyond a single verse",
      mindset: "Use what you have where you are",
      keyLesson: "God does not need sophisticated weapons; He needs willing hands",
      keyVerse: "After him was Shamgar... who killed 600 of the Philistines with an oxgoad",
      keyVerseRef: "Judges 3:31"
    },
    storyArc: "Shamgar receives only a single verse in Judges. He killed 600 Philistines with an oxgoad—a farming tool. He saved Israel with what was available, proving that God's deliverance does not require conventional weapons.",
    therapyView: {
      drivingFears: ["Unknown"],
      coreMotivations: ["Delivering Israel with whatever was at hand"],
      relationalStyle: "Unknown; a man of action rather than words",
      blindSpots: ["Unknown"],
      healingMoments: ["He saved Israel"]
    },
    strengths: ["Extraordinary courage", "Resourcefulness", "Decisive action"],
    weaknesses: ["Little recorded for assessment"],
    journey: [
      { phase: "Calling", description: "Raised up to deliver Israel from the Philistines" },
      { phase: "Legacy", description: "Killed 600 Philistines with a farming tool and saved Israel" }
    ],
    relationships: [
      { name: "Israel", role: "People he delivered" }
    ],
    lessonsAndReflection: [
      "God uses ordinary tools in the hands of willing people",
      "You do not need perfect equipment to obey God's call",
      "One person's courage can save a nation"
    ],
    relatedCharacters: ["ehud", "samson", "gideon"],
    situations: [
      {
        id: "shamgar-oxgoad",
        title: "600 Philistines with an Oxgoad",
        category: "Faith Testing",
        reference: "Judges 3:31",
        situation: "The Philistines oppressed Israel. Shamgar had no sword—only an oxgoad.",
        pressure: "Six hundred enemy soldiers against one man with a farming tool.",
        innerBattle: "The absurdity of the odds versus the urgency of Israel's need.",
        response: "He fought with what he had and killed 600 Philistines.",
        outcome: "Israel was delivered from the Philistine threat.",
        lesson: "God multiplies what we offer Him, no matter how inadequate it seems.",
        traitRevealed: "Fearless resourcefulness",
        spiritualPrinciple: "God's power is made perfect in weakness and ordinary means",
        reflectionQuestions: [
          "Am I waiting for better tools when God is asking me to use what I have?",
          "Do I trust God's power to work through ordinary means?"
        ],
        dnaSnapshot: { courage: 10, faith: 7, fear: 1 }
      }
    ]
  },
  {
    id: "rehoboam",
    name: "Rehoboam",
    meaning: "He enlarges the people",
    emoji: "👑",
    role: "Solomon's son who divided the kingdom through foolishness",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 12:1-24", "2 Chronicles 10-12"],
    archetypes: ["King", "Tragic Hero"],
    dna: { faith: 3, humility: 2, courage: 4, wisdom: 2, compassion: 2, fear: 5, pride: 9, greed: 6 },
    quickCard: {
      archetype: "King",
      strength: "Inherited the greatest kingdom in Israel's history",
      weakness: "Rejected wise counsel and chose arrogant advisors",
      mindset: "My little finger is thicker than my father's waist",
      keyLesson: "Arrogant leadership destroys what wisdom built",
      keyVerse: "My father disciplined you with whips, but I will discipline you with scorpions",
      keyVerseRef: "1 Kings 12:14"
    },
    storyArc: "When Israel asked Rehoboam to lighten their burden, he rejected the elders' wise counsel and listened to his young friends who urged harshness. His arrogant response split the kingdom—ten tribes followed Jeroboam, leaving Rehoboam only Judah and Benjamin.",
    therapyView: {
      drivingFears: ["Appearing weak", "Being compared unfavorably to Solomon"],
      coreMotivations: ["Proving he was tougher than his father", "Maintaining total control"],
      relationalStyle: "Domineering; surrounds himself with yes-men",
      blindSpots: ["Confused harshness with strength", "Rejected experienced voices for flattering ones"],
      healingMoments: ["Humbled himself when Shishak attacked and God relented"]
    },
    strengths: ["Royal authority", "Eventually some humility before God"],
    weaknesses: ["Arrogance", "Poor counsel selection", "Harshness"],
    journey: [
      { phase: "Calling", description: "Inherited Solomon's throne" },
      { phase: "Failure", description: "Rejected wise counsel and split the kingdom" },
      { phase: "Refinement", description: "Humbled when Egypt attacked; received partial mercy" }
    ],
    relationships: [
      { name: "Solomon", role: "Father" },
      { name: "Jeroboam", role: "Rival who took ten tribes" },
      { name: "Shemaiah", role: "Prophet who warned him" }
    ],
    lessonsAndReflection: [
      "The counsel you choose determines the legacy you leave",
      "Harshness is not strength; it is weakness disguised",
      "One foolish decision can undo generations of building"
    ],
    relatedCharacters: ["solomon", "jeroboam", "asa"],
    situations: [
      {
        id: "rehoboam-rejects-counsel",
        title: "Rejecting the Elders' Counsel",
        category: "Leadership Pressure",
        reference: "1 Kings 12:1-17",
        keyVerse: "But he abandoned the counsel that the old men gave him and took counsel with the young men. (1 Kings 12:8)",
        situation: "Israel asked Rehoboam to lighten Solomon's heavy yoke. The elders advised gentleness; his young friends urged severity.",
        pressure: "His first major decision as king, with the entire nation watching.",
        innerBattle: "Humility and service versus pride and domination.",
        response: "He chose the arrogant counsel and threatened even harsher rule.",
        outcome: "Ten tribes rebelled, and the united kingdom was permanently divided.",
        lesson: "Leaders who reject wisdom and choose flattery lose everything.",
        traitRevealed: "Arrogant foolishness",
        spiritualPrinciple: "The quality of your counsel determines the quality of your leadership",
        reflectionQuestions: [
          "Whose counsel am I following—wise elders or flattering peers?",
          "Am I confusing harshness with strong leadership?"
        ],
        dnaSnapshot: { pride: 9, wisdom: 2, humility: 2 }
      }
    ]
  },
  {
    id: "jeroboam",
    name: "Jeroboam",
    meaning: "The people will contend",
    emoji: "🐂",
    role: "First king of northern Israel who led the nation into idolatry",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 11:26-40", "1 Kings 12:25-33", "1 Kings 14:1-20"],
    archetypes: ["King", "Manipulator"],
    dna: { faith: 3, humility: 2, courage: 7, wisdom: 5, compassion: 3, fear: 6, pride: 8, greed: 7 },
    quickCard: {
      archetype: "King",
      strength: "Political savvy and ambition that won ten tribes",
      weakness: "Fear-driven idolatry that corrupted Israel for centuries",
      mindset: "If the people go to Jerusalem to worship, they will return to Rehoboam",
      keyLesson: "Fear-driven leadership produces sin that outlasts the leader",
      keyVerse: "Jeroboam... made Israel to sin",
      keyVerseRef: "1 Kings 14:16"
    },
    storyArc: "Promised ten tribes by the prophet Ahijah, Jeroboam received the northern kingdom when Rehoboam's folly split Israel. But instead of trusting God, he feared losing the people if they worshipped in Jerusalem. He set up golden calves at Dan and Bethel, creating a rival religion. His sin defined northern Israel for generations.",
    therapyView: {
      drivingFears: ["Losing his kingdom", "The people returning to Rehoboam"],
      coreMotivations: ["Political survival", "Maintaining power at any cost"],
      relationalStyle: "Strategic and calculating; uses religion as a tool of control",
      blindSpots: ["Could not trust the God who gave him the kingdom", "Created the sin that destroyed his dynasty"],
      healingMoments: ["None; his legacy was entirely negative"]
    },
    strengths: ["Political skill", "Ambition", "Organization"],
    weaknesses: ["Fear-driven leadership", "Idolatry", "Using religion for political control"],
    journey: [
      { phase: "Calling", description: "Promised the kingdom by the prophet Ahijah" },
      { phase: "Failure", description: "Set up golden calves out of fear, leading Israel into idolatry" },
      { phase: "Legacy", description: "Became the standard of evil: 'the sins of Jeroboam who made Israel to sin'" }
    ],
    relationships: [
      { name: "Ahijah", role: "Prophet who promised him the kingdom" },
      { name: "Rehoboam", role: "Rival king" },
      { name: "Solomon", role: "Former master who sought to kill him" }
    ],
    lessonsAndReflection: [
      "Fear-driven decisions lead to idolatry and ruin",
      "God gives the kingdom, but we must trust Him to keep it",
      "Sin created for political convenience becomes generational bondage"
    ],
    relatedCharacters: ["rehoboam", "ahab", "asa"],
    situations: [
      {
        id: "jeroboam-golden-calves",
        title: "Setting Up the Golden Calves",
        category: "Fear",
        reference: "1 Kings 12:25-33",
        keyVerse: "So the king took counsel and made two calves of gold. And he said to the people, 'You have gone up to Jerusalem long enough. Behold your gods, O Israel.' (1 Kings 12:28)",
        situation: "Jeroboam feared that if Israel went to Jerusalem to worship, they would defect back to Rehoboam.",
        pressure: "Political survival of his new kingdom seemed to depend on keeping people away from Jerusalem.",
        innerBattle: "Trusting the God who gave him the kingdom versus controlling outcomes through false religion.",
        response: "He set up golden calves at Dan and Bethel and created a counterfeit priesthood and feast days.",
        outcome: "Israel was led into idolatry that persisted until their exile centuries later.",
        lesson: "When we try to protect God's gift through sinful means, we destroy it.",
        traitRevealed: "Fear-driven idolatry",
        spiritualPrinciple: "The one who gave you the blessing can be trusted to maintain it",
        reflectionQuestions: [
          "Am I trying to protect God's gifts through means God has forbidden?",
          "Where is fear driving me to compromise my faith?"
        ],
        dnaSnapshot: { fear: 6, pride: 8, faith: 3 }
      }
    ]
  },
  {
    id: "asa",
    name: "Asa",
    meaning: "Healer",
    emoji: "🏃",
    role: "Good king of Judah who started well but ended poorly",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 15:9-24", "2 Chronicles 14-16"],
    archetypes: ["King", "Tragic Hero"],
    dna: { faith: 7, humility: 5, courage: 7, wisdom: 6, compassion: 5, fear: 5, pride: 5, greed: 3 },
    quickCard: {
      archetype: "King",
      strength: "Bold reformer who removed idolatry and trusted God in battle",
      weakness: "In later years, relied on alliances over God and rejected prophetic correction",
      mindset: "I started by trusting God, but success made me self-reliant",
      keyLesson: "Starting well does not guarantee finishing well",
      keyVerse: "The eyes of the LORD run to and fro throughout the whole earth, to give strong support to those whose heart is blameless toward him",
      keyVerseRef: "2 Chronicles 16:9"
    },
    storyArc: "Asa began his reign with sweeping reforms, removing idols and even deposing his grandmother for her Asherah pole. He trusted God against a massive Ethiopian army and won. But later, he allied with Syria instead of trusting God, rejected the prophet Hanani, and died with diseased feet, seeking only physicians.",
    therapyView: {
      drivingFears: ["Military threats", "Being overwhelmed"],
      coreMotivations: ["Reforming Judah", "Defeating enemies", "Maintaining control"],
      relationalStyle: "Initially God-dependent; later self-reliant and hostile to correction",
      blindSpots: ["Could not see his drift from faith", "Rejected prophetic correction out of pride"],
      healingMoments: ["Trusting God against the Ethiopians", "Removing his grandmother's idol"]
    },
    strengths: ["Reforming zeal", "Courage in battle", "Early trust in God"],
    weaknesses: ["Late-life faithlessness", "Rejection of correction", "Self-reliance"],
    journey: [
      { phase: "Calling", description: "Became king and led bold reforms against idolatry" },
      { phase: "Testing", description: "Trusted God against the massive Ethiopian army and won" },
      { phase: "Failure", description: "Allied with Syria instead of God; imprisoned the prophet who corrected him" },
      { phase: "Legacy", description: "Died diseased, having started well but finished poorly" }
    ],
    relationships: [
      { name: "Hanani", role: "Prophet he imprisoned" },
      { name: "Maacah", role: "Grandmother he deposed" },
      { name: "Jehoshaphat", role: "Son who succeeded him" }
    ],
    lessonsAndReflection: [
      "Past victories do not guarantee future faithfulness",
      "Rejecting correction accelerates spiritual decline",
      "How you finish matters more than how you start"
    ],
    relatedCharacters: ["jehoshaphat", "rehoboam", "hezekiah"],
    situations: [
      {
        id: "asa-trusts-god-ethiopia",
        title: "Trusting God Against the Ethiopian Army",
        category: "Faith Testing",
        reference: "2 Chronicles 14:9-15",
        keyVerse: "LORD, there is none like you to help, between the mighty and the weak. Help us, O LORD our God, for we rely on you. (2 Chronicles 14:11)",
        situation: "An Ethiopian army of a million men marched against Judah. Asa was vastly outnumbered.",
        pressure: "An impossible military situation that required complete dependence on God.",
        innerBattle: "Human helplessness versus faith in God's power.",
        response: "He cried out to God in prayer and marched out in faith.",
        outcome: "God struck the Ethiopians, and Judah won a complete victory.",
        lesson: "When we are weakest and most dependent on God, He shows His greatest strength.",
        traitRevealed: "Dependent faith",
        spiritualPrinciple: "God delights to help those who rely entirely on Him",
        reflectionQuestions: [
          "Do I cry out to God when facing impossible odds?",
          "Am I more dependent on God in crisis than in comfort?"
        ],
        dnaSnapshot: { faith: 8, courage: 8, humility: 7 }
      },
      {
        id: "asa-rejects-correction",
        title: "Rejecting the Prophet's Correction",
        category: "Correction",
        reference: "2 Chronicles 16:7-12",
        situation: "After allying with Syria instead of trusting God, the prophet Hanani confronted Asa.",
        pressure: "Being told that his pragmatic decision was faithless.",
        innerBattle: "Pride and self-justification versus humility to receive correction.",
        response: "He raged at the prophet and put him in prison.",
        outcome: "He faced wars for the rest of his reign and died diseased.",
        lesson: "Rejecting God's correction leads to accelerated decline.",
        traitRevealed: "Hardened pride",
        spiritualPrinciple: "The same heart that once trusted God can harden against His word",
        reflectionQuestions: [
          "How do I respond when someone corrects me spiritually?",
          "Am I becoming harder or softer toward God's voice as I age?"
        ],
        dnaSnapshot: { pride: 7, faith: 4, humility: 3 }
      }
    ]
  },
  {
    id: "jehoshaphat",
    name: "Jehoshaphat",
    meaning: "The LORD has judged",
    emoji: "⚔️",
    role: "Godly king of Judah who sought the LORD",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Chronicles 17-20", "1 Kings 22"],
    archetypes: ["King", "Seeker"],
    dna: { faith: 8, humility: 7, courage: 7, wisdom: 6, compassion: 6, fear: 4, pride: 4, greed: 2 },
    quickCard: {
      archetype: "King",
      strength: "Sought God earnestly and led national spiritual renewal",
      weakness: "Made unwise alliances with wicked kings",
      mindset: "We do not know what to do, but our eyes are on you",
      keyLesson: "Seeking God brings victory, but ungodly alliances bring danger",
      keyVerse: "We do not know what to do, but our eyes are on you",
      keyVerseRef: "2 Chronicles 20:12"
    },
    storyArc: "Jehoshaphat strengthened Judah, sent teachers throughout the land, and sought God's guidance. When three armies surrounded him, he called a national fast and God fought the battle. Yet he repeatedly allied with wicked Ahab and Ahab's family, nearly getting killed and drawing prophetic rebuke.",
    therapyView: {
      drivingFears: ["Being overwhelmed by enemies", "Diplomatic isolation"],
      coreMotivations: ["Seeking God", "National reform", "Peace through alliance"],
      relationalStyle: "Deeply spiritual but too agreeable with the wrong people",
      blindSpots: ["Could not say no to ungodly alliances", "Diplomacy overrode discernment"],
      healingMoments: ["God fought the battle of three armies", "Sent teachers throughout Judah"]
    },
    strengths: ["Prayer", "Spiritual leadership", "National reform", "Trust in God"],
    weaknesses: ["Unwise alliances", "People-pleasing with wicked kings"],
    journey: [
      { phase: "Calling", description: "Became king and strengthened Judah's relationship with God" },
      { phase: "Testing", description: "Surrounded by three armies; trusted God and won without fighting" },
      { phase: "Failure", description: "Repeatedly allied with Ahab's wicked family" },
      { phase: "Legacy", description: "Remembered as a good king who sought God but was weakened by bad alliances" }
    ],
    relationships: [
      { name: "Ahab", role: "Wicked king he allied with" },
      { name: "Asa", role: "Father" },
      { name: "Micaiah", role: "Prophet who told the truth" },
      { name: "Jahaziel", role: "Prophet who declared God's battle plan" }
    ],
    lessonsAndReflection: [
      "Seeking God brings supernatural victories",
      "Ungodly alliances compromise even the most faithful",
      "When you do not know what to do, fix your eyes on God"
    ],
    relatedCharacters: ["asa", "ahab", "hezekiah"],
    situations: [
      {
        id: "jehoshaphat-three-armies",
        title: "Facing Three Armies with Worship",
        category: "Faith Testing",
        reference: "2 Chronicles 20:1-30",
        keyVerse: "O our God, will you not execute judgment on them? For we are powerless against this great horde that is coming against us. We do not know what to do, but our eyes are on you. (2 Chronicles 20:12)",
        situation: "Three nations united against Judah. Jehoshaphat was vastly outnumbered.",
        pressure: "Total military annihilation threatened Judah from multiple directions.",
        innerBattle: "Fear and helplessness versus trust in God's faithfulness.",
        response: "He called a national fast, prayed publicly, and sent worshippers ahead of the army.",
        outcome: "God set ambushes; the enemies destroyed each other. Judah only had to collect the spoil.",
        lesson: "When we are helpless and honest before God, He fights our battles.",
        traitRevealed: "Dependent worship",
        spiritualPrinciple: "The battle belongs to the LORD; our role is to worship and trust",
        reflectionQuestions: [
          "When I face overwhelming odds, do I fast and pray or panic and scheme?",
          "Am I willing to admit I do not know what to do?"
        ],
        dnaSnapshot: { faith: 9, humility: 8, courage: 7 }
      }
    ]
  },
  {
    id: "hezekiah",
    name: "Hezekiah",
    meaning: "The LORD is my strength",
    emoji: "🌅",
    role: "Godly king who received 15 extra years of life",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 18-20", "2 Chronicles 29-32", "Isaiah 36-39"],
    archetypes: ["King", "Seeker"],
    dna: { faith: 8, humility: 7, courage: 7, wisdom: 6, compassion: 6, fear: 5, pride: 5, greed: 3 },
    quickCard: {
      archetype: "King",
      strength: "Bold reformer who trusted God against Assyria",
      weakness: "Pride after healing; showed treasures to Babylon",
      mindset: "I will trust the LORD and tear down what offends Him",
      keyLesson: "God honors radical trust but tests us with success and extension",
      keyVerse: "He trusted in the LORD, the God of Israel, so that there was none like him among all the kings of Judah",
      keyVerseRef: "2 Kings 18:5"
    },
    storyArc: "Hezekiah reopened the temple, destroyed the high places, and even smashed the bronze serpent Moses had made. When Assyria threatened, he spread Sennacherib's letter before God and an angel destroyed 185,000 soldiers. When sick unto death, he prayed and received 15 more years. But he then showed Babylon's envoys all his treasures, and Isaiah prophesied exile.",
    therapyView: {
      drivingFears: ["Death", "Assyrian invasion", "Being the king who lost Jerusalem"],
      coreMotivations: ["Restoring worship", "Trusting God in crisis", "Leaving a legacy"],
      relationalStyle: "Prayerful and dependent on God in crisis; vulnerable to pride in success",
      blindSpots: ["Pride after miraculous deliverance", "Short-sightedness about Babylon"],
      healingMoments: ["God's deliverance from Assyria", "15 years added to his life"]
    },
    strengths: ["Radical reform", "Trust in God", "Prayerfulness", "Courage"],
    weaknesses: ["Pride after success", "Showing treasures to Babylon", "Short-term thinking"],
    journey: [
      { phase: "Calling", description: "Became king and launched the greatest reform since David" },
      { phase: "Testing", description: "Trusted God against Sennacherib's army" },
      { phase: "Refinement", description: "Faced death, prayed, and received 15 more years" },
      { phase: "Failure", description: "Showed his treasures to Babylonian envoys out of pride" }
    ],
    relationships: [
      { name: "Isaiah", role: "Prophet and advisor" },
      { name: "Sennacherib", role: "Assyrian king who threatened Jerusalem" },
      { name: "Manasseh", role: "Son, the wickedest king of Judah" }
    ],
    lessonsAndReflection: [
      "Radical trust in God can turn impossible situations",
      "Success and extended blessing can become tests of pride",
      "What we show off today may be taken tomorrow"
    ],
    relatedCharacters: ["isaiah", "manasseh", "josiah", "jehoshaphat"],
    situations: [
      {
        id: "hezekiah-sennacherib",
        title: "Trusting God Against Sennacherib",
        category: "Faith Testing",
        reference: "2 Kings 19:14-37",
        keyVerse: "Hezekiah spread the letter before the LORD. And Hezekiah prayed. (2 Kings 19:14-15)",
        situation: "Sennacherib's army surrounded Jerusalem and mocked God. Hezekiah received a threatening letter.",
        pressure: "Every other nation had fallen to Assyria. Jerusalem seemed next.",
        innerBattle: "The propaganda of the enemy versus the promises of God.",
        response: "He spread the letter before the LORD in the temple and prayed.",
        outcome: "An angel of the LORD struck 185,000 Assyrian soldiers in one night.",
        lesson: "Bring your impossible situations directly to God; He is able to defend His name.",
        traitRevealed: "Radical trust under siege",
        spiritualPrinciple: "When the enemy mocks God, God Himself rises to defend His glory",
        reflectionQuestions: [
          "Do I bring my threatening situations directly to God?",
          "Am I more influenced by the enemy's propaganda or God's promises?"
        ],
        dnaSnapshot: { faith: 9, courage: 8, humility: 7 }
      }
    ]
  },
  {
    id: "josiah",
    name: "Josiah",
    meaning: "The LORD heals",
    emoji: "📜",
    role: "Boy king who found the Book of the Law and led revival",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 22-23", "2 Chronicles 34-35"],
    archetypes: ["King", "Seeker"],
    dna: { faith: 9, humility: 9, courage: 8, wisdom: 7, compassion: 7, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "King",
      strength: "Tender heart toward God's word and radical obedience",
      weakness: "Died in an unnecessary battle against Pharaoh Neco",
      mindset: "When God's word convicts me, I must respond immediately and completely",
      keyLesson: "A tender heart toward God's word produces radical transformation",
      keyVerse: "Because your heart was tender and you humbled yourself before the LORD... I also have heard you",
      keyVerseRef: "2 Kings 22:19"
    },
    storyArc: "Josiah became king at age eight during Judah's darkest spiritual era. At sixteen, he began seeking God. At twenty-six, during temple repairs, the Book of the Law was found. When he heard it, he tore his robes and launched the most thorough reform in Judah's history. He was killed at Megiddo fighting Pharaoh Neco.",
    therapyView: {
      drivingFears: ["God's judgment on the nation"],
      coreMotivations: ["Honoring God's word", "Reforming the nation", "Undoing his grandfather's evil"],
      relationalStyle: "Humble, responsive, and action-oriented",
      blindSpots: ["Fought Pharaoh Neco against God's will"],
      healingMoments: ["God promised he would not see the coming judgment", "The people returned to God under his leadership"]
    },
    strengths: ["Tender heart", "Radical obedience", "Reforming courage", "Humility before God's word"],
    weaknesses: ["Fought an unnecessary battle that killed him"],
    journey: [
      { phase: "Calling", description: "Became king at eight and began seeking God at sixteen" },
      { phase: "Testing", description: "Heard the Book of the Law and tore his robes in repentance" },
      { phase: "Legacy", description: "Led the greatest reform in Judah's history but died prematurely at Megiddo" }
    ],
    relationships: [
      { name: "Hilkiah", role: "High priest who found the Book of the Law" },
      { name: "Huldah", role: "Prophetess who confirmed God's word" },
      { name: "Manasseh", role: "Grandfather whose evil he reversed" }
    ],
    lessonsAndReflection: [
      "A tender heart toward God's word is the foundation of revival",
      "Youth is no barrier to radical faithfulness",
      "Even the most faithful must discern which battles are God's"
    ],
    relatedCharacters: ["hezekiah", "manasseh", "ezra"],
    situations: [
      {
        id: "josiah-finds-law",
        title: "Finding the Book of the Law",
        category: "Calling",
        reference: "2 Kings 22:8-20",
        keyVerse: "When the king heard the words of the Book of the Law, he tore his clothes. (2 Kings 22:11)",
        situation: "During temple repairs, Hilkiah found the lost Book of the Law and it was read to Josiah.",
        pressure: "Discovering how far the nation had strayed from God's commands.",
        innerBattle: "The weight of national guilt versus the hope of reform.",
        response: "He tore his robes, consulted the prophetess Huldah, and launched radical reforms.",
        outcome: "The most comprehensive spiritual reform in Judah's history.",
        lesson: "When we encounter God's word with a tender heart, transformation follows.",
        traitRevealed: "Responsive humility",
        spiritualPrinciple: "Revival begins when God's word is rediscovered and taken seriously",
        reflectionQuestions: [
          "When was the last time God's word broke my heart?",
          "Am I willing to act radically on what Scripture reveals?"
        ],
        dnaSnapshot: { faith: 9, humility: 9, courage: 8 }
      }
    ]
  },
  {
    id: "manasseh",
    name: "Manasseh",
    meaning: "Causing to forget",
    emoji: "😈",
    role: "Wickedest king of Judah who later repented in captivity",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 21:1-18", "2 Chronicles 33:1-20"],
    archetypes: ["Oppressor", "Redeemed"],
    dna: { faith: 3, humility: 3, courage: 5, wisdom: 3, compassion: 2, fear: 4, pride: 9, greed: 7 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Even the worst sinner can repent and find mercy",
      weakness: "His wickedness was unparalleled—child sacrifice, sorcery, filling Jerusalem with blood",
      mindset: "From the depths of my evil, God still heard my cry",
      keyLesson: "No one is beyond the reach of God's mercy if they truly repent",
      keyVerse: "He humbled himself greatly before the God of his fathers. He prayed to him, and God was moved by his entreaty",
      keyVerseRef: "2 Chronicles 33:12-13"
    },
    storyArc: "Manasseh reversed his father Hezekiah's reforms, rebuilt high places, practiced sorcery, sacrificed his son, and filled Jerusalem with innocent blood. God sent him into Assyrian captivity. In chains, he humbled himself, and God restored him. He then removed idols and restored worship.",
    therapyView: {
      drivingFears: ["Loss of power", "Being controlled by his father's God"],
      coreMotivations: ["Rebellion against his father's legacy", "Power at any cost", "Later: genuine repentance"],
      relationalStyle: "Tyrannical; later humbled and penitent",
      blindSpots: ["Believed he was beyond consequences", "His reforms came too late to prevent national judgment"],
      healingMoments: ["Repentance in Assyrian captivity", "Restoration to his throne", "Removing idols he had built"]
    },
    strengths: ["Proof that repentance is possible from any depth of sin"],
    weaknesses: ["Child sacrifice", "Sorcery", "Extreme idolatry", "Innocent bloodshed"],
    journey: [
      { phase: "Failure", description: "Became the most wicked king in Judah's history" },
      { phase: "Refinement", description: "Humbled in Assyrian captivity and repented" },
      { phase: "Legacy", description: "Restored worship but the damage was done; Judah's exile was sealed" }
    ],
    relationships: [
      { name: "Hezekiah", role: "Father whose reforms he reversed" },
      { name: "Josiah", role: "Grandson who completed the reform" },
      { name: "Isaiah", role: "Prophet tradition says Manasseh martyred" }
    ],
    lessonsAndReflection: [
      "No one is beyond the reach of God's mercy",
      "Repentance is possible even from the deepest evil",
      "Late repentance still brings personal restoration, even if national consequences remain"
    ],
    relatedCharacters: ["hezekiah", "josiah", "ahab"],
    situations: [
      {
        id: "manasseh-repents",
        title: "Repentance in Chains",
        category: "Restoration",
        reference: "2 Chronicles 33:10-16",
        keyVerse: "And when he was in distress, he entreated the favor of the LORD his God and humbled himself greatly... God was moved by his entreaty and heard his plea. (2 Chronicles 33:12-13)",
        situation: "After years of extreme wickedness, Manasseh was taken captive by Assyria in hooks and chains.",
        pressure: "Total humiliation and loss of everything—throne, freedom, dignity.",
        innerBattle: "Pride and defiance versus the reality that only God could save him.",
        response: "He humbled himself greatly and prayed. God heard him and restored him.",
        outcome: "He returned to Jerusalem, removed his idols, and restored the altar of the LORD.",
        lesson: "God's mercy extends even to the worst of sinners when they genuinely repent.",
        traitRevealed: "Broken repentance",
        spiritualPrinciple: "The door of repentance is never closed to a truly broken heart",
        reflectionQuestions: [
          "Do I believe anyone is beyond God's mercy?",
          "What would it take for me to truly humble myself before God?"
        ],
        dnaSnapshot: { humility: 8, faith: 6, pride: 3 }
      }
    ]
  },
  {
    id: "uzziah",
    name: "Uzziah",
    meaning: "The LORD is my strength",
    emoji: "🦠",
    role: "Powerful king struck with leprosy for pride",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Chronicles 26:1-23", "Isaiah 6:1"],
    archetypes: ["King", "Tragic Hero"],
    dna: { faith: 6, humility: 4, courage: 8, wisdom: 6, compassion: 5, fear: 3, pride: 8, greed: 5 },
    quickCard: {
      archetype: "King",
      strength: "Military genius and kingdom builder as long as he sought God",
      weakness: "Pride led him to usurp priestly authority",
      mindset: "I am powerful enough to do whatever I want, even in God's temple",
      keyLesson: "Success without humility leads to presumption and judgment",
      keyVerse: "But when he was strong, he grew proud, to his destruction",
      keyVerseRef: "2 Chronicles 26:16"
    },
    storyArc: "Uzziah became king at sixteen and prospered as long as he sought God. He built towers, strengthened the army, and became famous. But when he was strong, pride consumed him. He entered the temple to burn incense—a priestly duty—and was struck with leprosy. He lived as a leper until death.",
    therapyView: {
      drivingFears: ["Limitations on his authority"],
      coreMotivations: ["Expanding his power", "Being above all constraints"],
      relationalStyle: "Capable leader who became unable to accept boundaries",
      blindSpots: ["Success blinded him to his limitations", "Could not distinguish between royal and priestly authority"],
      healingMoments: ["His prosperous years when he sought God"]
    },
    strengths: ["Military skill", "Administrative ability", "Innovation", "Early faithfulness"],
    weaknesses: ["Pride", "Presumption", "Inability to accept boundaries"],
    journey: [
      { phase: "Calling", description: "Became king at sixteen and sought God" },
      { phase: "Testing", description: "Prospered greatly and became famous" },
      { phase: "Failure", description: "Entered the temple to burn incense and was struck with leprosy" },
      { phase: "Legacy", description: "Died a leper, isolated from the temple he tried to control" }
    ],
    relationships: [
      { name: "Azariah", role: "Chief priest who confronted him" },
      { name: "Isaiah", role: "Prophet who began his ministry the year Uzziah died" },
      { name: "Jotham", role: "Son who governed during his leprosy" }
    ],
    lessonsAndReflection: [
      "Success is the most dangerous test of character",
      "God's boundaries exist to protect us, not limit us",
      "When we are strongest is when we are most vulnerable to pride"
    ],
    relatedCharacters: ["hezekiah", "saul", "nebuchadnezzar"],
    situations: [
      {
        id: "uzziah-leprosy",
        title: "Struck with Leprosy for Presumption",
        category: "Power and Success",
        reference: "2 Chronicles 26:16-21",
        keyVerse: "But when he was strong, he grew proud, to his destruction. For he was unfaithful to the LORD his God and entered the temple of the LORD to burn incense. (2 Chronicles 26:16)",
        situation: "At the height of his power, Uzziah entered the temple to burn incense, a duty reserved for priests.",
        pressure: "He felt his royal authority should extend even into sacred spaces.",
        innerBattle: "The desire to be above all rules versus the reality of God's boundaries.",
        response: "He raged at the priests who tried to stop him and pushed forward.",
        outcome: "Leprosy broke out on his forehead. He was rushed out and lived as a leper until death.",
        lesson: "No amount of success gives us permission to violate God's boundaries.",
        traitRevealed: "Presumptuous pride",
        spiritualPrinciple: "Strength without humility leads to presumption, and presumption leads to judgment",
        reflectionQuestions: [
          "Has my success led me to believe I am above God's rules?",
          "Do I respect the boundaries God has set, even when I have the power to cross them?"
        ],
        dnaSnapshot: { pride: 9, courage: 7, faith: 4, humility: 2 }
      }
    ]
  },
  {
    id: "athaliah",
    name: "Athaliah",
    meaning: "The LORD is exalted (ironic given her character)",
    emoji: "🗡️",
    role: "Wicked queen who massacred the royal family to seize the throne",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 11:1-16", "2 Chronicles 22:10-23:15"],
    archetypes: ["Oppressor", "Manipulator"],
    dna: { faith: 1, humility: 0, courage: 7, wisdom: 4, compassion: 0, fear: 4, pride: 10, greed: 9 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Ruthless determination and political cunning",
      weakness: "Murdered her own grandchildren for power",
      mindset: "The throne is mine, regardless of the cost",
      keyLesson: "Power obtained through bloodshed is always overthrown by God",
      keyVerse: "When Athaliah the mother of Ahaziah saw that her son was dead, she arose and destroyed all the royal family",
      keyVerseRef: "2 Kings 11:1"
    },
    storyArc: "When her son Ahaziah was killed, Athaliah massacred the royal family of Judah to seize the throne—the only woman to rule Judah. But the infant Joash was hidden in the temple by Jehosheba. After six years, the priest Jehoiada led a coup. Athaliah was executed, and Joash was crowned.",
    therapyView: {
      drivingFears: ["Losing power", "Being displaced"],
      coreMotivations: ["Power at any cost", "Continuing Baal worship in Judah"],
      relationalStyle: "Predatory; eliminates anyone who threatens her position",
      blindSpots: ["Could not see that God would preserve the Davidic line", "Believed murder could secure a permanent throne"],
      healingMoments: ["None recorded"]
    },
    strengths: ["Political cunning", "Decisiveness"],
    weaknesses: ["Murderous cruelty", "Complete lack of compassion", "Idolatry"],
    journey: [
      { phase: "Failure", description: "Murdered her own grandchildren to seize the throne" },
      { phase: "Legacy", description: "Overthrown after six years; God's covenant with David survived" }
    ],
    relationships: [
      { name: "Ahab", role: "Father (or relative)" },
      { name: "Jezebel", role: "Mother (or relative)" },
      { name: "Ahaziah", role: "Son, king of Judah" },
      { name: "Joash", role: "Grandson who survived and replaced her" },
      { name: "Jehoiada", role: "Priest who overthrew her" }
    ],
    lessonsAndReflection: [
      "No human scheme can overthrow God's covenant promises",
      "God preserves His purposes even through the smallest remnant",
      "Power gained through blood is always temporary"
    ],
    relatedCharacters: ["jezebel", "joash", "jehoiada"],
    situations: [
      {
        id: "athaliah-seizes-throne",
        title: "Massacring the Royal Family",
        category: "Power and Success",
        reference: "2 Kings 11:1-3",
        situation: "After her son's death, Athaliah killed the entire royal family to claim the throne for herself.",
        pressure: "Her son was dead, and she was about to lose all influence.",
        innerBattle: "None apparent—she acted swiftly and ruthlessly.",
        response: "She murdered her own grandchildren and took the throne.",
        outcome: "She ruled six years, but baby Joash was hidden. She was overthrown and executed.",
        lesson: "Even the most ruthless power grab cannot destroy what God has promised to preserve.",
        traitRevealed: "Murderous ambition",
        spiritualPrinciple: "God's covenant promises survive even the most violent attempts to destroy them",
        reflectionQuestions: [
          "Do I trust that God can preserve His promises despite opposition?",
          "Am I clinging to power in ways that harm others?"
        ],
        dnaSnapshot: { pride: 10, compassion: 0, greed: 9 }
      }
    ]
  },
  {
    id: "joash",
    name: "Joash",
    meaning: "Given by the LORD",
    emoji: "🏛️",
    role: "Boy king hidden in the temple, later turned away from God",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 11-12", "2 Chronicles 24"],
    archetypes: ["King", "Tragic Hero"],
    dna: { faith: 6, humility: 5, courage: 5, wisdom: 4, compassion: 4, fear: 5, pride: 6, greed: 5 },
    quickCard: {
      archetype: "King",
      strength: "Repaired the temple and served God under Jehoiada's guidance",
      weakness: "After Jehoiada died, he turned to idols and murdered Jehoiada's son",
      mindset: "I follow God as long as someone leads me, but left alone I drift",
      keyLesson: "Borrowed faith that depends on a mentor will not survive without them",
      keyVerse: "Joash did what was right in the eyes of the LORD all the days of Jehoiada the priest",
      keyVerseRef: "2 Chronicles 24:2"
    },
    storyArc: "Hidden as a baby to escape Athaliah's massacre, Joash was raised in the temple by the priest Jehoiada. He became king at seven and repaired the temple. But after Jehoiada died, Joash listened to ungodly advisors, turned to idolatry, and even had Jehoiada's son Zechariah stoned for prophesying against him.",
    therapyView: {
      drivingFears: ["Being without a guide", "Abandonment"],
      coreMotivations: ["Pleasing whoever has influence over him", "Maintaining power"],
      relationalStyle: "Dependent on the strongest voice in the room",
      blindSpots: ["Never developed personal faith", "Easily influenced by whoever was nearest"],
      healingMoments: ["His early years of faithful service under Jehoiada"]
    },
    strengths: ["Obedience under godly guidance", "Temple restoration"],
    weaknesses: ["Dependent faith", "Ingratitude", "Easily swayed", "Murdered his benefactor's son"],
    journey: [
      { phase: "Calling", description: "Hidden in the temple and crowned at age seven" },
      { phase: "Testing", description: "Repaired the temple under Jehoiada's guidance" },
      { phase: "Failure", description: "Turned to idolatry and murdered Zechariah after Jehoiada died" },
      { phase: "Legacy", description: "Assassinated by his own servants; a life defined by whose voice he followed" }
    ],
    relationships: [
      { name: "Jehoiada", role: "Priest who saved and mentored him" },
      { name: "Zechariah", role: "Jehoiada's son whom Joash had killed" },
      { name: "Athaliah", role: "Grandmother who tried to kill him" },
      { name: "Jehosheba", role: "Aunt who hid him" }
    ],
    lessonsAndReflection: [
      "Faith that depends entirely on a mentor will not survive their absence",
      "Ingratitude toward those who saved us is among the worst sins",
      "We must develop our own relationship with God, not borrow someone else's"
    ],
    relatedCharacters: ["athaliah", "jehoshaphat", "rehoboam"],
    situations: [
      {
        id: "joash-after-jehoiada",
        title: "Turning Away After Jehoiada's Death",
        category: "Betrayal",
        reference: "2 Chronicles 24:17-22",
        keyVerse: "Now after the death of Jehoiada the princes of Judah came and paid homage to the king. Then the king listened to them. (2 Chronicles 24:17)",
        situation: "After Jehoiada the priest died, Judah's leaders persuaded Joash to abandon God and worship idols.",
        pressure: "Without his spiritual anchor, Joash was vulnerable to flattery and bad counsel.",
        innerBattle: "A faith that had always depended on another person now had to stand alone—and could not.",
        response: "He listened to ungodly advisors and turned to idolatry. When Zechariah confronted him, he had him stoned.",
        outcome: "God sent judgment; Joash was assassinated by his own servants.",
        lesson: "A faith that depends entirely on someone else will collapse when that person is gone.",
        traitRevealed: "Dependent unfaithfulness",
        spiritualPrinciple: "We must own our faith personally; borrowed conviction cannot endure testing",
        reflectionQuestions: [
          "Is my faith my own, or am I just following someone else's?",
          "How do I respond when my spiritual mentors are no longer present?"
        ],
        dnaSnapshot: { faith: 3, pride: 7, humility: 3 }
      }
    ]
  },
  {
    id: "micaiah",
    name: "Micaiah",
    meaning: "Who is like the LORD?",
    emoji: "📢",
    role: "Prophet who told the truth when 400 prophets lied",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 22:1-28", "2 Chronicles 18"],
    archetypes: ["Prophet", "Martyr"],
    dna: { faith: 10, humility: 8, courage: 10, wisdom: 8, compassion: 5, fear: 1, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Unwavering commitment to truth regardless of consequences",
      weakness: "None recorded; his faithfulness cost him freedom",
      mindset: "As the LORD lives, I will speak what the LORD says to me",
      keyLesson: "Truth spoken alone is still truth; majority consensus does not determine God's will",
      keyVerse: "As the LORD lives, what the LORD says to me, that I will speak",
      keyVerseRef: "1 Kings 22:14"
    },
    storyArc: "When Ahab and Jehoshaphat planned to attack Ramoth-gilead, 400 prophets assured victory. Jehoshaphat asked for a true prophet. Micaiah was brought, and despite pressure, he prophesied defeat. He described a vision of God sending a lying spirit through the false prophets. He was slapped, imprisoned, and proven right when Ahab died in battle.",
    therapyView: {
      drivingFears: ["None that compromised his integrity"],
      coreMotivations: ["Speaking God's truth", "Integrity regardless of cost"],
      relationalStyle: "Uncompromising truth-teller; willing to stand alone",
      blindSpots: ["None recorded"],
      healingMoments: ["His prophecy was vindicated when Ahab died exactly as predicted"]
    },
    strengths: ["Unshakable courage", "Prophetic integrity", "Refusal to compromise"],
    weaknesses: ["His faithfulness led to imprisonment"],
    journey: [
      { phase: "Calling", description: "Known as the prophet who never told Ahab what he wanted to hear" },
      { phase: "Testing", description: "Stood alone against 400 false prophets before two kings" },
      { phase: "Legacy", description: "Imprisoned but vindicated; his word proved true" }
    ],
    relationships: [
      { name: "Ahab", role: "King who hated his prophecies" },
      { name: "Jehoshaphat", role: "King who requested a true prophet" },
      { name: "Zedekiah", role: "False prophet who struck him" }
    ],
    lessonsAndReflection: [
      "Truth is not determined by popular vote",
      "Standing alone with God is better than standing with the crowd against Him",
      "Faithful prophets may suffer, but their words are vindicated"
    ],
    relatedCharacters: ["elijah", "jeremiah", "nathan"],
    situations: [
      {
        id: "micaiah-stands-alone",
        title: "Standing Alone Against 400 Prophets",
        category: "Persecution",
        reference: "1 Kings 22:5-28",
        keyVerse: "As the LORD lives, what the LORD says to me, that I will speak. (1 Kings 22:14)",
        situation: "Four hundred prophets told Ahab to go to war. Micaiah alone delivered God's true word of defeat.",
        pressure: "Two kings, 400 prophets, and the entire court opposed him.",
        innerBattle: "The cost of truth—imprisonment and mockery—versus the compromise of silence.",
        response: "He spoke exactly what God revealed, regardless of the consequences.",
        outcome: "He was struck and imprisoned, but Ahab died in battle exactly as he prophesied.",
        lesson: "One voice speaking God's truth outweighs a thousand speaking lies.",
        traitRevealed: "Prophetic integrity",
        spiritualPrinciple: "God's truth does not require majority support to be vindicated",
        reflectionQuestions: [
          "Am I willing to speak truth when everyone around me disagrees?",
          "Do I adjust my message based on my audience or on God's word?"
        ],
        dnaSnapshot: { faith: 10, courage: 10, fear: 1 }
      }
    ]
  },
  {
    id: "obadiah-steward",
    name: "Obadiah (steward)",
    meaning: "Servant of the LORD",
    emoji: "🫙",
    role: "Ahab's steward who hid 100 prophets from Jezebel",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 18:1-16"],
    archetypes: ["Servant", "Survivor"],
    dna: { faith: 8, humility: 8, courage: 7, wisdom: 8, compassion: 9, fear: 5, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Servant",
      strength: "Faithful to God while serving in an ungodly administration",
      weakness: "Fear when asked to put himself at risk",
      mindset: "I can serve God faithfully even in a wicked system",
      keyLesson: "Faithfulness does not always require leaving; sometimes it means working from within",
      keyVerse: "Your servant has feared the LORD from my youth",
      keyVerseRef: "1 Kings 18:12"
    },
    storyArc: "Obadiah served as Ahab's household manager while secretly fearing God. When Jezebel slaughtered the prophets, he hid a hundred of them in caves and fed them. When Elijah appeared during the famine and asked Obadiah to announce his return to Ahab, Obadiah feared for his life but obeyed.",
    therapyView: {
      drivingFears: ["Being discovered and killed by Jezebel", "Elijah disappearing and leaving him exposed"],
      coreMotivations: ["Protecting God's people", "Serving God within the system", "Preserving prophetic witness"],
      relationalStyle: "Discreet and strategic; operates behind the scenes",
      blindSpots: ["Fear sometimes held him back from bolder action"],
      healingMoments: ["Successfully saving 100 prophets", "Meeting Elijah and participating in God's plan"]
    },
    strengths: ["Discretion", "Compassion", "Faithfulness under hostile conditions", "Strategic thinking"],
    weaknesses: ["Fear of exposure", "Working within a corrupt system"],
    journey: [
      { phase: "Calling", description: "Feared God from his youth while serving in Ahab's court" },
      { phase: "Testing", description: "Hid 100 prophets at great personal risk during Jezebel's purge" },
      { phase: "Legacy", description: "Preserved the prophetic witness in Israel's darkest hour" }
    ],
    relationships: [
      { name: "Ahab", role: "King he served" },
      { name: "Jezebel", role: "Queen whose persecution he resisted" },
      { name: "Elijah", role: "Prophet he encountered and helped" }
    ],
    lessonsAndReflection: [
      "You can serve God faithfully even in corrupt environments",
      "Quiet faithfulness behind the scenes can save many lives",
      "Fear is natural but must not prevent obedience"
    ],
    relatedCharacters: ["elijah", "jehoshaphat", "joseph"],
    situations: [
      {
        id: "obadiah-hides-prophets",
        title: "Hiding 100 Prophets from Jezebel",
        category: "Persecution",
        reference: "1 Kings 18:3-4",
        keyVerse: "When Jezebel cut off the prophets of the LORD, Obadiah took a hundred prophets and hid them by fifties in a cave and fed them with bread and water. (1 Kings 18:4)",
        situation: "Jezebel was systematically killing the prophets of God. Obadiah risked everything to save them.",
        pressure: "Discovery meant certain death from Jezebel.",
        innerBattle: "Self-preservation versus his deep reverence for God and compassion for His servants.",
        response: "He hid 100 prophets in two caves and sustained them secretly.",
        outcome: "The prophetic witness in Israel was preserved through his courage.",
        lesson: "Quiet, behind-the-scenes faithfulness can preserve what God values most.",
        traitRevealed: "Courageous compassion",
        spiritualPrinciple: "Not all heroes stand on the front lines; some serve God in secret",
        reflectionQuestions: [
          "Am I faithful to God even when no one sees?",
          "How can I protect and support God's people in my sphere of influence?"
        ],
        dnaSnapshot: { compassion: 9, faith: 8, courage: 7 }
      }
    ]
  },
  {
    id: "gehazi",
    name: "Gehazi",
    meaning: "Valley of vision",
    emoji: "💰",
    role: "Elisha's servant who was struck with leprosy for greed",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 4:12-37", "2 Kings 5:20-27", "2 Kings 8:4-5"],
    archetypes: ["Servant", "Tragic Hero"],
    dna: { faith: 4, humility: 3, courage: 4, wisdom: 3, compassion: 3, fear: 5, pride: 6, greed: 9 },
    quickCard: {
      archetype: "Servant",
      strength: "Close proximity to one of the greatest prophets",
      weakness: "Greed that corrupted his privileged position",
      mindset: "My master let Naaman off too easily; I deserve something for myself",
      keyLesson: "Proximity to greatness does not guarantee personal integrity",
      keyVerse: "The leprosy of Naaman shall cling to you and to your descendants forever",
      keyVerseRef: "2 Kings 5:27"
    },
    storyArc: "Gehazi served the prophet Elisha faithfully for years. But when Elisha refused Naaman's gifts after healing his leprosy, Gehazi secretly chased Naaman down, lied to obtain silver and clothing, and hid them. Elisha saw through the deception. Naaman's leprosy transferred to Gehazi forever.",
    therapyView: {
      drivingFears: ["Missing out on material rewards", "Being poor while serving others"],
      coreMotivations: ["Financial gain", "Feeling he deserved compensation for his service"],
      relationalStyle: "Outwardly loyal but inwardly resentful and self-serving",
      blindSpots: ["Believed he could deceive a prophet", "Saw ministry as a means to profit"],
      healingMoments: ["None; his story is a permanent warning"]
    },
    strengths: ["Years of faithful service", "Proximity to Elisha's ministry"],
    weaknesses: ["Greed", "Lying", "Entitlement", "Spiritual blindness"],
    journey: [
      { phase: "Calling", description: "Served Elisha and witnessed great miracles" },
      { phase: "Failure", description: "Chased Naaman for gifts and lied about it" },
      { phase: "Legacy", description: "Struck with Naaman's leprosy forever; a cautionary tale of greed" }
    ],
    relationships: [
      { name: "Elisha", role: "Master and prophet" },
      { name: "Naaman", role: "The healed leper he exploited" }
    ],
    lessonsAndReflection: [
      "Ministry must never become a means of personal enrichment",
      "You cannot deceive the God who sees all",
      "Proximity to spiritual power does not make you immune to sin"
    ],
    relatedCharacters: ["elisha", "achan", "judas-iscariot"],
    situations: [
      {
        id: "gehazi-naaman-greed",
        title: "Chasing Naaman's Gifts",
        category: "Temptation",
        reference: "2 Kings 5:20-27",
        keyVerse: "Is it a time to accept money and garments?... The leprosy of Naaman shall cling to you and to your descendants forever. (2 Kings 5:26-27)",
        situation: "After Elisha healed Naaman and refused payment, Gehazi secretly pursued Naaman to take gifts for himself.",
        pressure: "Valuable gifts were given freely and his master had refused them.",
        innerBattle: "Entitlement and greed versus his master's clear example of integrity.",
        response: "He ran after Naaman, lied to obtain gifts, and hid them.",
        outcome: "Elisha confronted him. Naaman's leprosy transferred to Gehazi and his descendants.",
        lesson: "What grace gives freely, greed corrupts—and the consequences are severe.",
        traitRevealed: "Greedy deception",
        spiritualPrinciple: "Profiting from grace is one of the most dangerous forms of corruption",
        reflectionQuestions: [
          "Am I trying to profit from what God has given freely?",
          "Do I believe I can hide my motives from God?"
        ],
        dnaSnapshot: { greed: 9, pride: 6, faith: 3 }
      }
    ]
  },
  {
    id: "nabal",
    name: "Nabal",
    meaning: "Fool",
    emoji: "🍷",
    role: "Wealthy fool whose contempt for David nearly destroyed his household",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 25:1-38"],
    archetypes: ["Oppressor", "Tragic Hero"],
    dna: { faith: 1, humility: 0, courage: 3, wisdom: 1, compassion: 0, fear: 3, pride: 10, greed: 10 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Great wealth and large household",
      weakness: "Foolish contempt and mean-spirited arrogance",
      mindset: "Who is David? Why should I share my bread with runaway servants?",
      keyLesson: "Contempt for others and hoarding of God's blessings leads to ruin",
      keyVerse: "He is such a worthless man that one cannot speak to him",
      keyVerseRef: "1 Samuel 25:17"
    },
    storyArc: "Nabal was a wealthy man in Carmel married to the wise and beautiful Abigail. David's men had protected Nabal's shepherds, and David sent a polite request for provisions. Nabal insulted David's messengers. David armed 400 men for vengeance. Abigail intervened and saved the household. When Nabal heard, his heart died, and God struck him ten days later.",
    therapyView: {
      drivingFears: ["Losing his wealth"],
      coreMotivations: ["Hoarding", "Self-importance", "Contempt for others"],
      relationalStyle: "Belligerent, mean, and impossible to reason with",
      blindSpots: ["Could not see the danger his arrogance created", "Treated everyone beneath him with contempt"],
      healingMoments: ["None; a fully cautionary tale"]
    },
    strengths: ["Material success"],
    weaknesses: ["Foolishness", "Arrogance", "Contempt", "Greed", "Drunkenness"],
    journey: [
      { phase: "Failure", description: "Insulted David and brought destruction on his household" },
      { phase: "Legacy", description: "Died by God's hand; his name became synonymous with foolishness" }
    ],
    relationships: [
      { name: "Abigail", role: "Wise wife who saved the household" },
      { name: "David", role: "Future king he foolishly insulted" }
    ],
    lessonsAndReflection: [
      "Wealth without wisdom and generosity is folly",
      "Contempt for others invites destruction",
      "A fool's mouth is his ruin"
    ],
    relatedCharacters: ["abigail", "david"],
    situations: [
      {
        id: "nabal-insults-david",
        title: "Insulting David's Men",
        category: "Conflict",
        reference: "1 Samuel 25:4-13",
        keyVerse: "Who is David? Who is the son of Jesse? There are many servants these days who are breaking away from their masters. (1 Samuel 25:10)",
        situation: "David sent men asking for provisions after protecting Nabal's flocks. Nabal responded with contempt.",
        pressure: "A simple request for hospitality from a powerful warrior leader.",
        innerBattle: "None—Nabal was so blinded by arrogance he did not perceive the danger.",
        response: "He insulted David and his men, calling them runaway slaves.",
        outcome: "David armed 400 men for vengeance. Only Abigail's wisdom saved the household.",
        lesson: "Arrogance blinds us to danger, and contempt for others is a deadly sin.",
        traitRevealed: "Contemptuous arrogance",
        spiritualPrinciple: "A fool's arrogance is his undoing; wisdom knows when to be generous",
        reflectionQuestions: [
          "Am I generous with what God has given me, or do I hoard and insult?",
          "Do I despise people God has placed in my path?"
        ],
        dnaSnapshot: { pride: 10, greed: 10, wisdom: 1, compassion: 0 }
      }
    ]
  },
  {
    id: "abigail",
    name: "Abigail",
    meaning: "My father's joy",
    emoji: "🕊️",
    role: "Wise woman who saved her household from David's wrath",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 25:1-42"],
    archetypes: ["Matriarch", "Strategist"],
    dna: { faith: 8, humility: 8, courage: 9, wisdom: 10, compassion: 8, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Strategist",
      strength: "Extraordinary wisdom, diplomacy, and courage under pressure",
      weakness: "Married to a fool; her gifts were wasted in that marriage",
      mindset: "I must act wisely and quickly to prevent disaster",
      keyLesson: "Wisdom and humility can defuse even the most volatile situations",
      keyVerse: "Blessed be your discretion, and blessed be you, who have kept me this day from bloodguilt",
      keyVerseRef: "1 Samuel 25:33"
    },
    storyArc: "When her foolish husband Nabal insulted David, Abigail acted swiftly. Without telling Nabal, she gathered generous provisions, rode out to meet David, and delivered one of the most eloquent speeches in Scripture. She persuaded David to spare her household. After Nabal died, David married her.",
    therapyView: {
      drivingFears: ["Her household being destroyed", "Nabal's foolishness causing irreversible harm"],
      coreMotivations: ["Protecting her people", "Preventing bloodshed", "Acting wisely in crisis"],
      relationalStyle: "Diplomatic, eloquent, and decisive; acts independently when necessary",
      blindSpots: ["Endured a difficult marriage without apparent recourse until God intervened"],
      healingMoments: ["David's recognition of her wisdom", "Becoming David's wife", "Saving her household"]
    },
    strengths: ["Wisdom", "Diplomacy", "Courage", "Eloquence", "Quick thinking"],
    weaknesses: ["Trapped in a marriage to a fool"],
    journey: [
      { phase: "Testing", description: "Learned of Nabal's insult and David's armed approach" },
      { phase: "Legacy", description: "Saved her household through wisdom and became David's wife" }
    ],
    relationships: [
      { name: "Nabal", role: "Foolish first husband" },
      { name: "David", role: "Future king she saved from sin, later married" }
    ],
    lessonsAndReflection: [
      "Wisdom and humility are more powerful than swords",
      "One wise person can save an entire household",
      "God honors those who act with discretion and courage"
    ],
    relatedCharacters: ["david", "nabal", "esther"],
    situations: [
      {
        id: "abigail-saves-household",
        title: "Saving Her Household from David's Wrath",
        category: "Leadership Pressure",
        reference: "1 Samuel 25:14-35",
        keyVerse: "Then Abigail hurried and took two hundred loaves and two skins of wine... and went after David. (1 Samuel 25:18-19)",
        situation: "David was coming with 400 men to destroy Nabal's household. Abigail had to act fast.",
        pressure: "Armed men approaching, a foolish husband, and the lives of her entire household at stake.",
        innerBattle: "Acting without her husband's knowledge versus saving everyone's lives.",
        response: "She gathered provisions, rode to meet David, and delivered an eloquent plea for mercy.",
        outcome: "David relented, praised her wisdom, and later married her after Nabal's death.",
        lesson: "Wisdom and humility can turn away wrath that swords cannot.",
        traitRevealed: "Courageous wisdom",
        spiritualPrinciple: "A soft answer turns away wrath; wise intervention saves lives",
        reflectionQuestions: [
          "Am I willing to act quickly and wisely to prevent disaster?",
          "Do I use wisdom and diplomacy before resorting to confrontation?"
        ],
        dnaSnapshot: { wisdom: 10, courage: 9, humility: 8 }
      }
    ]
  },
  {
    id: "mephibosheth",
    name: "Mephibosheth",
    meaning: "Exterminator of shame",
    emoji: "🦶",
    role: "Jonathan's crippled son, shown grace by David",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 4:4", "2 Samuel 9:1-13", "2 Samuel 16:1-4", "2 Samuel 19:24-30"],
    archetypes: ["Survivor", "Redeemed"],
    dna: { faith: 6, humility: 9, courage: 4, wisdom: 5, compassion: 5, fear: 7, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Humble gratitude that received grace without entitlement",
      weakness: "Fearful and helpless; dependent on others' mercy",
      mindset: "What is your servant, that you should show regard for a dead dog such as I?",
      keyLesson: "Grace seeks out the undeserving and seats them at the king's table",
      keyVerse: "What is your servant, that you should show regard for a dead dog such as I?",
      keyVerseRef: "2 Samuel 9:8"
    },
    storyArc: "Dropped by his nurse during the chaos after Saul and Jonathan's death, Mephibosheth was crippled in both feet. He lived in hiding, forgotten. David sought him out—not to destroy him as kings typically did with rival dynasties—but to show him kindness for Jonathan's sake. He was given Saul's land and ate at the king's table.",
    therapyView: {
      drivingFears: ["Being killed as Saul's heir", "Rejection", "Being seen as worthless"],
      coreMotivations: ["Survival", "Gratitude for undeserved kindness"],
      relationalStyle: "Deeply humble, grateful, self-deprecating",
      blindSpots: ["Self-image as a 'dead dog'", "Vulnerability to manipulation by Ziba"],
      healingMoments: ["David's invitation to the king's table", "Restored land and dignity"]
    },
    strengths: ["Humility", "Gratitude", "Loyalty to David"],
    weaknesses: ["Fear", "Helplessness", "Low self-worth", "Vulnerability to deceit"],
    journey: [
      { phase: "Calling", description: "Born into royalty as Jonathan's son" },
      { phase: "Testing", description: "Crippled in the fall and lived in hiding and poverty" },
      { phase: "Legacy", description: "Sought out by David and seated at the king's table as a living picture of grace" }
    ],
    relationships: [
      { name: "Jonathan", role: "Father" },
      { name: "David", role: "King who showed him grace" },
      { name: "Ziba", role: "Servant who later betrayed him" },
      { name: "Saul", role: "Grandfather" }
    ],
    lessonsAndReflection: [
      "Grace seeks out the broken and invites them to the table",
      "Our identity is not determined by our disability or past",
      "Mephibosheth is a picture of what God does for every believer"
    ],
    relatedCharacters: ["david", "jonathan", "saul"],
    situations: [
      {
        id: "mephibosheth-at-table",
        title: "Invited to the King's Table",
        category: "Restoration",
        reference: "2 Samuel 9:1-13",
        keyVerse: "So Mephibosheth ate at David's table, like one of the king's sons. (2 Samuel 9:11)",
        situation: "David sought out anyone from Saul's house to show kindness for Jonathan's sake. Mephibosheth was found.",
        pressure: "A crippled man from a fallen dynasty summoned by the reigning king—he expected death.",
        innerBattle: "Terror at being summoned versus the impossible hope that David meant good.",
        response: "He fell on his face and called himself a dead dog, expecting nothing.",
        outcome: "David restored Saul's land to him and gave him a permanent place at the king's table.",
        lesson: "Grace does not come because we deserve it; it comes because of a covenant we did not make.",
        traitRevealed: "Humble reception of grace",
        spiritualPrinciple: "We are all Mephibosheth—broken, hiding, and invited to the King's table by covenant grace",
        reflectionQuestions: [
          "Do I see myself as too broken or unworthy for God's grace?",
          "Am I willing to accept undeserved kindness without trying to earn it?"
        ],
        dnaSnapshot: { humility: 9, faith: 6, fear: 7 }
      }
    ]
  },
  {
    id: "uriah-hittite",
    name: "Uriah the Hittite",
    meaning: "The LORD is my light",
    emoji: "⚔️",
    role: "Bathsheba's faithful husband, murdered by David's plot",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 11:1-27", "2 Samuel 23:39", "Matthew 1:6"],
    archetypes: ["Warrior", "Martyr"],
    dna: { faith: 8, humility: 8, courage: 9, wisdom: 6, compassion: 6, fear: 2, pride: 3, greed: 0 },
    quickCard: {
      archetype: "Warrior",
      strength: "Unwavering loyalty and integrity even when tempted to compromise",
      weakness: "His very faithfulness made him a target",
      mindset: "The ark and Israel and Judah dwell in booths; how can I go home to comfort?",
      keyLesson: "Integrity shines brightest against the backdrop of someone else's compromise",
      keyVerse: "The ark and Israel and Judah dwell in booths... shall I then go to my house to eat and drink and lie with my wife?",
      keyVerseRef: "2 Samuel 11:11"
    },
    storyArc: "Uriah was one of David's mighty men and Bathsheba's husband. While he fought on the front lines, David committed adultery with his wife. David tried to cover the sin by bringing Uriah home, but Uriah refused to enjoy comforts while his comrades fought. David then arranged his death in battle.",
    therapyView: {
      drivingFears: ["Dishonoring his fellow soldiers and his God"],
      coreMotivations: ["Duty", "Loyalty", "Integrity above personal comfort"],
      relationalStyle: "Loyal and principled; puts duty above personal desire",
      blindSpots: ["Unaware of the plot against him"],
      healingMoments: ["His integrity is forever recorded in Scripture as a rebuke to David's sin"]
    },
    strengths: ["Integrity", "Military loyalty", "Self-discipline", "Honor"],
    weaknesses: ["Unaware of political machinations around him"],
    journey: [
      { phase: "Calling", description: "One of David's mighty warriors" },
      { phase: "Testing", description: "Refused to go home to his wife while the army was in the field" },
      { phase: "Legacy", description: "Murdered by David's order; his integrity stands as a permanent rebuke" }
    ],
    relationships: [
      { name: "Bathsheba", role: "Wife" },
      { name: "David", role: "King who betrayed and murdered him" },
      { name: "Joab", role: "Commander who carried out the order" }
    ],
    lessonsAndReflection: [
      "Integrity sometimes costs everything, but it is never wasted",
      "A foreigner showed more loyalty to God and Israel than the king",
      "God records the faithfulness of the obscure as loudly as the sin of the famous"
    ],
    relatedCharacters: ["david", "bathsheba", "joab"],
    situations: [
      {
        id: "uriah-refuses-comfort",
        title: "Refusing to Go Home",
        category: "Obedience",
        reference: "2 Samuel 11:6-13",
        keyVerse: "Uriah said to David, 'The ark and Israel and Judah dwell in booths, and my lord Joab and the servants of my lord are camping in the open field. Shall I then go to my house?' (2 Samuel 11:11)",
        situation: "David called Uriah home from battle, hoping he would sleep with Bathsheba to cover the pregnancy.",
        pressure: "The king himself urged him to go home and relax.",
        innerBattle: "The appeal of comfort versus his code of military honor.",
        response: "He refused, sleeping at the palace door with the servants instead.",
        outcome: "David could not cover his sin and arranged Uriah's death.",
        lesson: "True integrity cannot be manipulated, even by the highest authority.",
        traitRevealed: "Unshakable honor",
        spiritualPrinciple: "The faithful person's integrity exposes the unfaithful person's sin",
        reflectionQuestions: [
          "Am I willing to sacrifice personal comfort for the sake of principle?",
          "Does my integrity hold when powerful people pressure me to compromise?"
        ],
        dnaSnapshot: { courage: 9, humility: 8, faith: 8 }
      }
    ]
  },
  {
    id: "joab",
    name: "Joab",
    meaning: "The LORD is father",
    emoji: "⚔️",
    role: "David's ruthless and capable military commander",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 2:12-32", "2 Samuel 3:26-30", "2 Samuel 11:14-25", "2 Samuel 18:9-15", "1 Kings 2:28-34"],
    archetypes: ["Warrior", "Strategist"],
    dna: { faith: 4, humility: 2, courage: 9, wisdom: 7, compassion: 2, fear: 3, pride: 8, greed: 5 },
    quickCard: {
      archetype: "Strategist",
      strength: "Brilliant military mind and fierce loyalty to David's throne",
      weakness: "Ruthless, disobedient, and willing to murder for political advantage",
      mindset: "I will protect the throne by any means necessary",
      keyLesson: "Competence without character produces a servant who becomes a threat",
      keyVerse: "Do not let his gray head go down to Sheol in peace",
      keyVerseRef: "1 Kings 2:6"
    },
    storyArc: "Joab served David as military commander for decades. He was brilliant in battle but ruthless in politics—murdering Abner, Amasa, and disobeying David regarding Absalom. He carried out David's order to kill Uriah. Despite his loyalty, his bloodthirsty ways led David to instruct Solomon to bring him to justice.",
    therapyView: {
      drivingFears: ["Being replaced", "Losing control", "Others threatening his position"],
      coreMotivations: ["Power", "Military dominance", "Controlling outcomes"],
      relationalStyle: "Loyal but domineering; serves the throne but on his own terms",
      blindSpots: ["Confused ruthlessness with loyalty", "Could not see that his methods undermined what he built"],
      healingMoments: ["His military victories were genuine and served Israel"]
    },
    strengths: ["Military brilliance", "Loyalty to David's throne", "Strategic thinking", "Courage"],
    weaknesses: ["Ruthlessness", "Unauthorized killings", "Disobedience", "Political manipulation"],
    journey: [
      { phase: "Calling", description: "Rose as David's military commander" },
      { phase: "Testing", description: "Won battles but murdered rivals without authorization" },
      { phase: "Failure", description: "Killed Absalom against David's wishes; supported Adonijah's rebellion" },
      { phase: "Legacy", description: "Executed by Solomon's order as David's dying wish" }
    ],
    relationships: [
      { name: "David", role: "King he served and often disobeyed" },
      { name: "Abner", role: "Rival commander he murdered" },
      { name: "Absalom", role: "David's son he killed against orders" },
      { name: "Uriah", role: "Soldier he placed in the front line to die" }
    ],
    lessonsAndReflection: [
      "Competence without character is ultimately destructive",
      "Unauthorized violence, even in service to a good cause, will be judged",
      "True loyalty obeys, not just achieves results"
    ],
    relatedCharacters: ["david", "uriah-hittite", "absalom"],
    situations: [
      {
        id: "joab-kills-abner",
        title: "Murdering Abner",
        category: "Conflict",
        reference: "2 Samuel 3:26-30",
        situation: "Abner, Saul's general, had made peace with David. Joab murdered him under pretense of a private conversation.",
        pressure: "Abner was a rival who had killed Joab's brother and now threatened Joab's position.",
        innerBattle: "Vengeance and political survival versus David's peace treaty.",
        response: "He lured Abner aside and stabbed him in the stomach.",
        outcome: "David cursed Joab's house, but Joab remained commander—too powerful to remove.",
        lesson: "Unauthorized violence, even against enemies, undermines the very kingdom you serve.",
        traitRevealed: "Ruthless self-preservation",
        spiritualPrinciple: "Vengeance belongs to God; taking it ourselves corrupts our position",
        reflectionQuestions: [
          "Am I serving my leader or my own agenda?",
          "Do I take matters into my own hands when I should trust God's timing?"
        ],
        dnaSnapshot: { courage: 9, pride: 8, compassion: 2 }
      },
      {
        id: "joab-kills-uriah",
        title: "Carrying Out the Murder of Uriah",
        category: "Betrayal",
        reference: "2 Samuel 11:14-25",
        situation: "David sent Joab a letter ordering him to place Uriah at the front of the fiercest fighting.",
        pressure: "A direct order from the king to murder a loyal soldier.",
        innerBattle: "Duty to the king versus the morality of the order.",
        response: "He obeyed without question and Uriah was killed.",
        outcome: "Uriah died, David's sin was temporarily covered, but God saw everything.",
        lesson: "Obedience to immoral orders makes you complicit in the sin.",
        traitRevealed: "Amoral obedience",
        spiritualPrinciple: "Following orders does not absolve us of moral responsibility",
        reflectionQuestions: [
          "Have I ever complied with something I knew was wrong because someone in authority asked?",
          "Where do I draw the line between loyalty and conscience?"
        ],
        dnaSnapshot: { courage: 7, faith: 3, compassion: 1 }
      }
    ]
  },
  {
    id: "nathan-prophet",
    name: "Nathan (Prophet)",
    meaning: "He gave",
    emoji: "📣",
    role: "Prophet who confronted David's sin with Bathsheba",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 7:1-17", "2 Samuel 12:1-15", "1 Kings 1:8-45"],
    archetypes: ["Prophet", "Strategist"],
    dna: { faith: 9, humility: 8, courage: 10, wisdom: 10, compassion: 7, fear: 2, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Wisdom to confront power with truth using masterful strategy",
      weakness: "None recorded",
      mindset: "I must speak truth to power, but with wisdom that penetrates the heart",
      keyLesson: "The best confrontation leads the sinner to convict himself",
      keyVerse: "You are the man!",
      keyVerseRef: "2 Samuel 12:7"
    },
    storyArc: "Nathan served as David's trusted prophet. He delivered the Davidic covenant promise but also had to confront David after his sin with Bathsheba. Using a parable about a stolen lamb, he led David to condemn himself before revealing the truth. Later, he helped ensure Solomon's succession.",
    therapyView: {
      drivingFears: ["Failing to speak when God commands"],
      coreMotivations: ["Truth", "God's honor", "Protecting the king from himself"],
      relationalStyle: "Trusted advisor; combines boldness with strategic wisdom",
      blindSpots: ["None recorded"],
      healingMoments: ["Delivering the Davidic covenant", "David's repentance after confrontation"]
    },
    strengths: ["Prophetic courage", "Strategic wisdom", "Relational trust", "Integrity"],
    weaknesses: ["None recorded"],
    journey: [
      { phase: "Calling", description: "Became David's trusted prophet" },
      { phase: "Testing", description: "Confronted the most powerful man in Israel with his sin" },
      { phase: "Legacy", description: "Helped secure Solomon's throne and delivered the covenant promise" }
    ],
    relationships: [
      { name: "David", role: "King he served and confronted" },
      { name: "Bathsheba", role: "Ally in securing Solomon's succession" },
      { name: "Solomon", role: "King whose succession he ensured" }
    ],
    lessonsAndReflection: [
      "Truth-telling requires both courage and wisdom",
      "The best confrontation leads the sinner to self-conviction",
      "Trusted relationships make hard truth receivable"
    ],
    relatedCharacters: ["david", "micaiah", "elijah"],
    situations: [
      {
        id: "nathan-confronts-david",
        title: "Confronting David with the Parable",
        category: "Correction",
        reference: "2 Samuel 12:1-15",
        keyVerse: "Nathan said to David, 'You are the man!' (2 Samuel 12:7)",
        situation: "After David's sin with Bathsheba and murder of Uriah, God sent Nathan to confront him.",
        pressure: "Confronting a king who had already shown willingness to kill to hide sin.",
        innerBattle: "The danger of confronting a powerful sinner versus the mandate from God.",
        response: "He used a parable about a rich man stealing a poor man's lamb to lead David to condemn himself.",
        outcome: "David repented immediately. The child died, but David's relationship with God was restored.",
        lesson: "Wise confrontation bypasses defenses and reaches the heart.",
        traitRevealed: "Strategic prophetic courage",
        spiritualPrinciple: "The truth, spoken wisely, has the power to break through the hardest heart",
        reflectionQuestions: [
          "Do I have the courage to speak truth to those in power?",
          "Am I wise in how I confront others, or do I just attack?"
        ],
        dnaSnapshot: { wisdom: 10, courage: 10, faith: 9 }
      }
    ]
  },
  {
    id: "hushai",
    name: "Hushai",
    meaning: "Hasty",
    emoji: "🎭",
    role: "David's loyal friend and spy who defeated Absalom's counsel",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 15:32-37", "2 Samuel 16:16-19", "2 Samuel 17:1-16"],
    archetypes: ["Strategist", "Servant"],
    dna: { faith: 7, humility: 7, courage: 9, wisdom: 10, compassion: 5, fear: 3, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Strategist",
      strength: "Brilliant counter-intelligence that saved David's life",
      weakness: "Operated through deception, though in service of the rightful king",
      mindset: "I will risk everything to defeat the counsel of the enemy from within",
      keyLesson: "God answers prayer through the courage of loyal friends",
      keyVerse: "O LORD, please turn the counsel of Ahithophel into foolishness",
      keyVerseRef: "2 Samuel 15:31"
    },
    storyArc: "When Absalom rebelled and David fled Jerusalem, David prayed for God to defeat Ahithophel's counsel. Hushai, David's trusted friend, volunteered to stay behind and infiltrate Absalom's court. He successfully countered Ahithophel's brilliant but deadly advice, buying David time to escape. Ahithophel, seeing his counsel rejected, hanged himself.",
    therapyView: {
      drivingFears: ["David's destruction", "Being discovered as a spy"],
      coreMotivations: ["Loyalty to David", "Protecting the rightful king", "Defeating evil counsel"],
      relationalStyle: "Calculated and loyal; willing to deceive the enemy to protect friends",
      blindSpots: ["The moral complexity of espionage"],
      healingMoments: ["Successfully defeating Ahithophel's counsel and saving David"]
    },
    strengths: ["Strategic brilliance", "Loyalty", "Courage under cover", "Persuasive speech"],
    weaknesses: ["Use of deception, though in service of the rightful king"],
    journey: [
      { phase: "Calling", description: "Volunteered to infiltrate Absalom's court as David's spy" },
      { phase: "Testing", description: "Countered Ahithophel's deadly advice in front of Absalom" },
      { phase: "Legacy", description: "His counsel saved David's life and turned the tide of the rebellion" }
    ],
    relationships: [
      { name: "David", role: "King and friend he served" },
      { name: "Absalom", role: "Rebel he infiltrated" },
      { name: "Ahithophel", role: "Brilliant adversary whose counsel he defeated" },
      { name: "Zadok and Abiathar", role: "Priests who relayed messages" }
    ],
    lessonsAndReflection: [
      "God answers desperate prayers through the courage of faithful friends",
      "Wisdom can defeat even the most brilliant enemy strategy",
      "True friendship risks everything when it matters most"
    ],
    relatedCharacters: ["david", "absalom", "jonathan"],
    situations: [
      {
        id: "hushai-defeats-ahithophel",
        title: "Defeating Ahithophel's Counsel",
        category: "Conflict",
        reference: "2 Samuel 17:1-14",
        keyVerse: "For the LORD had ordained to defeat the good counsel of Ahithophel, so that the LORD might bring harm upon Absalom. (2 Samuel 17:14)",
        situation: "Ahithophel advised Absalom to pursue David immediately with 12,000 men—advice that would have been fatal.",
        pressure: "If Hushai failed to counter Ahithophel's counsel, David would be killed.",
        innerBattle: "The weight of David's life hanging on one persuasive speech.",
        response: "He argued convincingly for delay, playing on Absalom's vanity, and his counsel was accepted.",
        outcome: "David had time to escape. Ahithophel hanged himself. The rebellion eventually failed.",
        lesson: "God uses the wisdom of faithful friends to answer the prayers of His servants.",
        traitRevealed: "Strategic loyalty",
        spiritualPrinciple: "God ordains the defeat of the enemy's best plans through His people's courage",
        reflectionQuestions: [
          "Am I willing to risk everything for a friend in need?",
          "Do I trust that God can defeat the wisest plans of the enemy?"
        ],
        dnaSnapshot: { wisdom: 10, courage: 9, faith: 7 }
      }
    ]
  },
];
