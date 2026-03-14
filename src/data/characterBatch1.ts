import type { CharacterProfile } from "./biblicalCharacterProfiles";

export const characterBatch1: CharacterProfile[] = [
  // 1. Solomon
  {
    id: "solomon",
    name: "Solomon",
    meaning: "Peace",
    emoji: "👁️",
    role: "King of Israel, Wisest Man",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 1-11", "Proverbs", "Ecclesiastes", "Song of Solomon"],
    archetypes: ["King", "Seeker"],
    dna: { faith: 3, humility: 2, courage: 3, wisdom: 5, compassion: 3, fear: 2, pride: 4, greed: 4 },
    quickCard: {
      archetype: "King",
      strength: "Unparalleled wisdom and discernment",
      weakness: "Sensual compromise and spiritual drift",
      mindset: "Knowledge without boundaries",
      keyLesson: "Wisdom without obedience leads to ruin.",
      keyVerse: "Fear of the LORD is the beginning of wisdom.",
      keyVerseRef: "Proverbs 9:10"
    },
    storyArc: "Born of David and Bathsheba, Solomon asked God for wisdom and received unmatched intellect, wealth, and fame. He built the Temple but married foreign wives who turned his heart to idolatry, splitting the kingdom after his death.",
    therapyView: {
      drivingFears: ["Inadequacy compared to David", "Losing control of the kingdom"],
      coreMotivations: ["Intellectual mastery", "Legacy building", "Pleasure and experience"],
      relationalStyle: "Charming but emotionally detached; collector of relationships rather than investor",
      blindSpots: ["Believed wisdom made him immune to temptation", "Confused accumulation with fulfillment"],
      healingMoments: ["Prayer for wisdom at Gibeon", "Building the Temple", "Writing Ecclesiastes as reflection"]
    },
    strengths: ["Extraordinary wisdom", "Administrative genius", "Diplomatic skill", "Prolific writer", "Wealth management"],
    weaknesses: ["Foreign wives and idolatry", "Excess and indulgence", "Heavy taxation of people", "Pride in achievements"],
    journey: [
      { phase: "Calling", description: "Chosen as David's successor despite not being eldest" },
      { phase: "Testing", description: "Asked for wisdom instead of wealth at Gibeon" },
      { phase: "Failure", description: "700 wives and 300 concubines turned his heart to foreign gods" },
      { phase: "Refinement", description: "Wrote Ecclesiastes reflecting on the vanity of life without God" },
      { phase: "Legacy", description: "Built the Temple but left a divided kingdom" }
    ],
    relationships: [
      { name: "David", role: "Father and predecessor" },
      { name: "Bathsheba", role: "Mother and political advocate" },
      { name: "Nathan", role: "Prophet who supported his kingship" },
      { name: "Queen of Sheba", role: "Foreign dignitary awed by his wisdom" },
      { name: "Rehoboam", role: "Son who lost the kingdom" }
    ],
    lessonsAndReflection: [
      "Can knowledge replace obedience in your walk with God?",
      "Where has success created blind spots in your spiritual life?",
      "What is the difference between wisdom and faithfulness?"
    ],
    relatedCharacters: ["david", "bathsheba", "rehoboam", "nathan"],
    situations: [
      {
        id: "solomon-wisdom-request",
        title: "Solomon's Request for Wisdom",
        category: "Power and Success",
        reference: "1 Kings 3:5-14",
        keyVerse: "Give your servant a discerning heart to govern your people and to distinguish between right and wrong.",
        situation: "God appeared to Solomon in a dream and offered him anything he wanted.",
        pressure: "The weight of ruling a vast kingdom with no experience, living in the shadow of his legendary father.",
        innerBattle: "Self-reliance vs. humble dependence on God; the temptation of power vs. the need for divine guidance.",
        response: "Solomon asked for wisdom and discernment to govern God's people justly.",
        outcome: "God gave him wisdom plus the wealth and honor he did not ask for.",
        lesson: "God honors humility and prioritizing others over self-interest.",
        traitRevealed: "Humility and teachability in his youth",
        spiritualPrinciple: "When we seek God's priorities first, He adds what we need.",
        reflectionQuestions: ["If God offered you one thing, what would you ask for?", "How does your current ambition align with God's purposes?"],
        dnaSnapshot: { wisdom: 5, humility: 4, faith: 4, pride: 1 }
      },
      {
        id: "solomon-idolatry",
        title: "Solomon's Heart Turns Away",
        category: "Temptation",
        reference: "1 Kings 11:1-13",
        keyVerse: "As Solomon grew old, his wives turned his heart after other gods.",
        situation: "Solomon's foreign wives led him to worship Ashtoreth, Chemosh, and Molek.",
        pressure: "Political alliances sealed by marriage and the belief that his wisdom made him invulnerable.",
        innerBattle: "Intellectual arrogance vs. simple obedience; gradual erosion of devotion through incremental compromise.",
        response: "Solomon built high places for foreign gods, directly violating God's commands.",
        outcome: "God declared He would tear the kingdom from Solomon's son, leaving only one tribe for David's sake.",
        lesson: "No amount of wisdom protects against the slow drift of disobedience.",
        traitRevealed: "Pride and spiritual complacency",
        spiritualPrinciple: "Gradual compromise is more dangerous than sudden temptation.",
        reflectionQuestions: ["Where are you making small compromises that could lead to big consequences?", "Has intellectual understanding replaced heartfelt obedience?"],
        dnaSnapshot: { wisdom: 5, humility: 1, faith: 2, pride: 5 }
      }
    ]
  },
  // 2. Jonathan
  {
    id: "jonathan",
    name: "Jonathan",
    meaning: "God has given",
    emoji: "🏹",
    role: "Prince of Israel, Covenant Friend",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 13-14", "1 Samuel 18-20", "1 Samuel 31"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 4, compassion: 5, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Warrior",
      strength: "Selfless loyalty and covenant faithfulness",
      weakness: "Torn between father and friend",
      mindset: "Others-centered honor",
      keyLesson: "True friendship sacrifices personal ambition for another's calling.",
      keyVerse: "Jonathan made a covenant with David because he loved him as himself.",
      keyVerseRef: "1 Samuel 18:3"
    },
    storyArc: "The crown prince who recognized God's anointing on David, willingly surrendered his right to the throne out of covenant love, and died in battle alongside his father Saul.",
    therapyView: {
      drivingFears: ["Dishonoring his father", "Failing David"],
      coreMotivations: ["Covenant loyalty", "God's will above personal ambition"],
      relationalStyle: "Deeply loyal, emotionally transparent, willing to sacrifice",
      blindSpots: ["Staying loyal to a toxic father may have limited his own destiny"],
      healingMoments: ["Covenant with David in the field", "Warning David of Saul's plot"]
    },
    strengths: ["Extraordinary courage", "Selfless loyalty", "Spiritual discernment", "Military prowess"],
    weaknesses: ["Divided loyalty between father and friend", "Passive acceptance of his father's decline"],
    journey: [
      { phase: "Calling", description: "Bold warrior who attacked the Philistine garrison with only his armor-bearer" },
      { phase: "Testing", description: "Recognized David as God's chosen and surrendered his claim to the throne" },
      { phase: "Refinement", description: "Navigated impossible tension between father and friend" },
      { phase: "Legacy", description: "Died heroically at Gilboa; his son Mephibosheth was cared for by David" }
    ],
    relationships: [
      { name: "David", role: "Covenant friend" },
      { name: "Saul", role: "Father and failing king" },
      { name: "Mephibosheth", role: "Son preserved by David's loyalty" }
    ],
    lessonsAndReflection: [
      "Can you celebrate someone else's promotion even when it costs you?",
      "How do you navigate loyalty when people you love are in conflict?"
    ],
    relatedCharacters: ["david", "saul-king", "mephibosheth"],
    situations: [
      {
        id: "jonathan-garrison-attack",
        title: "Jonathan Attacks the Philistine Garrison",
        category: "Faith Testing",
        reference: "1 Samuel 14:1-15",
        keyVerse: "Nothing can hinder the LORD from saving, whether by many or by few.",
        situation: "While Saul's army cowered, Jonathan and his armor-bearer secretly climbed a cliff to attack a Philistine outpost.",
        pressure: "Overwhelming military odds, no backup, no permission from the king.",
        innerBattle: "Calculating the risk vs. trusting God's sovereignty; waiting vs. stepping out in faith.",
        response: "Jonathan told his armor-bearer they would look for God's sign, then attacked with reckless courage.",
        outcome: "God sent confusion among the Philistines and an earthquake; Israel won a great victory.",
        lesson: "God uses those who step out in faith regardless of the odds.",
        traitRevealed: "Bold faith and initiative",
        spiritualPrinciple: "God's power is not limited by human numbers or resources.",
        reflectionQuestions: ["When has God asked you to act without guaranteed outcomes?", "What garrison is God calling you to confront?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 3. Joshua
  {
    id: "joshua",
    name: "Joshua",
    meaning: "The LORD is salvation",
    emoji: "⚔️",
    role: "Moses' Successor, Conqueror of Canaan",
    era: "Conquest",
    testament: "OT",
    keyScriptures: ["Exodus 17:9-13", "Numbers 13-14", "Joshua 1-24"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 3, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Warrior",
      strength: "Courageous obedience and military leadership",
      weakness: "Deception by the Gibeonites—failed to consult God",
      mindset: "Faithful execution of God's commands",
      keyLesson: "Strength and courage flow from meditating on God's Word.",
      keyVerse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
      keyVerseRef: "Joshua 1:9"
    },
    storyArc: "Trained under Moses for 40 years, Joshua led Israel across the Jordan, conquered Canaan through faith-driven battles, and distributed the land to the tribes before challenging Israel to choose whom they would serve.",
    therapyView: {
      drivingFears: ["Failing to fill Moses' shoes", "Israel's disobedience"],
      coreMotivations: ["Completing God's mission", "Honoring Moses' legacy", "Faithfulness to the covenant"],
      relationalStyle: "Steady, dependable leader who leads by example",
      blindSpots: ["Trusted human reasoning with the Gibeonites instead of consulting God"],
      healingMoments: ["God's personal commissioning after Moses' death", "Crossing the Jordan", "Jericho's walls falling"]
    },
    strengths: ["Military brilliance", "Unwavering faith", "Servant leadership", "Obedience to God's Word"],
    weaknesses: ["Failed to consult God regarding the Gibeonites", "Did not fully drive out all the Canaanites"],
    journey: [
      { phase: "Calling", description: "Chosen as Moses' aide from youth" },
      { phase: "Testing", description: "One of two faithful spies who trusted God's promise" },
      { phase: "Failure", description: "Deceived by the Gibeonites because he did not seek God" },
      { phase: "Legacy", description: "Led Israel into the Promised Land and challenged them to serve the LORD" }
    ],
    relationships: [
      { name: "Moses", role: "Mentor and predecessor" },
      { name: "Caleb", role: "Fellow faithful spy and ally" },
      { name: "Rahab", role: "Ally in Jericho" }
    ],
    lessonsAndReflection: [
      "Are you meditating on God's Word to find strength and courage?",
      "Where have you relied on your own judgment instead of seeking God?"
    ],
    relatedCharacters: ["moses", "caleb", "rahab"],
    situations: [
      {
        id: "joshua-jericho",
        title: "The Fall of Jericho",
        category: "Obedience",
        reference: "Joshua 6",
        keyVerse: "See, I have delivered Jericho into your hands, along with its king and its fighting men.",
        situation: "Joshua faced the fortified city of Jericho as the first obstacle in conquering Canaan.",
        pressure: "A massive walled city, an untested army, and the reputation of Israel at stake.",
        innerBattle: "Military logic vs. absurd divine instructions—march and blow trumpets instead of siege warfare.",
        response: "Joshua obeyed God's bizarre battle plan exactly, marching around the city for seven days.",
        outcome: "The walls collapsed and Israel took the city, establishing God's power in the land.",
        lesson: "God's methods often defy human logic but always deliver results.",
        traitRevealed: "Obedient faith",
        spiritualPrinciple: "Obedience to God's unusual instructions brings supernatural results.",
        reflectionQuestions: ["When has God asked you to do something that made no logical sense?", "Can you obey even when the strategy seems foolish?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 4. Gideon
  {
    id: "gideon",
    name: "Gideon",
    meaning: "Mighty warrior / Feller of trees",
    emoji: "🏺",
    role: "Judge of Israel",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 6-8"],
    archetypes: ["Warrior", "Judge"],
    dna: { faith: 3, humility: 3, courage: 3, wisdom: 3, compassion: 3, fear: 4, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Judge",
      strength: "Willingness to follow God once convinced",
      weakness: "Chronic self-doubt and need for confirmation",
      mindset: "Fearful but obedient when pressed",
      keyLesson: "God chooses the weak to shame the strong.",
      keyVerse: "The LORD is with you, mighty warrior.",
      keyVerseRef: "Judges 6:12"
    },
    storyArc: "A fearful farmer hiding from the Midianites was called a mighty warrior by an angel. After multiple confirmations via fleece tests, he led 300 men to rout a vast army but later made an ephod that became an idol.",
    therapyView: {
      drivingFears: ["Inadequacy", "Failure", "Being the least in his family"],
      coreMotivations: ["Security", "Certainty before action", "Deliverance of his people"],
      relationalStyle: "Hesitant but loyal once committed; needs external validation",
      blindSpots: ["Insecurity masked as caution", "Created an idol from victory's spoils"],
      healingMoments: ["Angel's affirmation", "Tearing down Baal's altar at night", "Victory with 300 men"]
    },
    strengths: ["Eventual obedience", "Willingness to tear down idols", "Strategic thinking in battle"],
    weaknesses: ["Chronic doubt", "Need for repeated signs", "Created an idolatrous ephod"],
    journey: [
      { phase: "Calling", description: "Angel called him 'mighty warrior' while he hid in a winepress" },
      { phase: "Resistance", description: "Tested God with the fleece—twice" },
      { phase: "Testing", description: "Led 300 men against thousands of Midianites" },
      { phase: "Failure", description: "Made a gold ephod that became a snare to Israel" },
      { phase: "Legacy", description: "Delivered Israel but left an idol that corrupted them" }
    ],
    relationships: [
      { name: "Angel of the LORD", role: "Commissioning messenger" },
      { name: "Midianites", role: "Oppressors" }
    ],
    lessonsAndReflection: [
      "Does your insecurity prevent you from answering God's call?",
      "How do you handle victory—do you give glory to God or build monuments to yourself?"
    ],
    relatedCharacters: ["deborah", "samson", "barak"],
    situations: [
      {
        id: "gideon-fleece",
        title: "Gideon's Fleece Test",
        category: "Fear",
        reference: "Judges 6:36-40",
        situation: "Already called by God and confirmed by fire from the rock, Gideon still asked for two more signs via a wool fleece.",
        pressure: "Leading an untrained militia against a vast Midianite army with his life on the line.",
        innerBattle: "Desire for certainty vs. walking by faith; fear of failure vs. trust in God's word.",
        response: "Gideon laid out the fleece twice, asking God to make it wet then dry as confirmation.",
        outcome: "God graciously answered both tests, meeting Gideon in his weakness.",
        lesson: "God is patient with honest doubt but calls us beyond the need for signs.",
        traitRevealed: "Fear-driven need for certainty",
        spiritualPrinciple: "God meets us in our weakness but invites us to grow in faith.",
        reflectionQuestions: ["Are you stalling obedience by asking for more signs?", "Can you distinguish between healthy caution and fear-driven delay?"],
        dnaSnapshot: { fear: 4, faith: 3, humility: 3, courage: 2 }
      }
    ]
  },
  // 5. Aaron
  {
    id: "aaron",
    name: "Aaron",
    meaning: "Exalted / Enlightened",
    emoji: "🔔",
    role: "First High Priest of Israel",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus 4-40", "Leviticus", "Numbers 17", "Numbers 20"],
    archetypes: ["Priest", "Servant"],
    dna: { faith: 3, humility: 3, courage: 2, wisdom: 3, compassion: 4, fear: 3, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Priest",
      strength: "Faithful intercession and priestly service",
      weakness: "People-pleasing and moral cowardice",
      mindset: "Accommodating mediator",
      keyLesson: "Leadership requires standing firm even when people pressure you to compromise.",
      keyVerse: "Aaron shall bear the names of the sons of Israel over his heart when he enters the Holy Place.",
      keyVerseRef: "Exodus 28:29"
    },
    storyArc: "Moses' older brother who served as his spokesman, was consecrated as Israel's first high priest, but buckled under popular pressure to build the golden calf and later joined Miriam in challenging Moses' authority.",
    therapyView: {
      drivingFears: ["Rejection by the people", "Confrontation", "Being overshadowed by Moses"],
      coreMotivations: ["Being needed", "Keeping peace", "Serving in God's presence"],
      relationalStyle: "Conflict-avoidant peacemaker who bends under pressure",
      blindSpots: ["People-pleasing disguised as compassion", "Deflecting blame"],
      healingMoments: ["Consecration as high priest", "Budding of Aaron's rod", "Interceding for the people"]
    },
    strengths: ["Faithful priestly service", "Eloquent speech", "Intercession for the people"],
    weaknesses: ["People-pleasing", "Moral cowardice", "Blame-shifting", "Jealousy of Moses"],
    journey: [
      { phase: "Calling", description: "Appointed as Moses' spokesman before Pharaoh" },
      { phase: "Failure", description: "Built the golden calf while Moses was on Sinai" },
      { phase: "Refinement", description: "Consecrated as high priest and learned to serve faithfully" },
      { phase: "Legacy", description: "Died on Mount Hor; priesthood continued through his sons" }
    ],
    relationships: [
      { name: "Moses", role: "Brother and leader" },
      { name: "Miriam", role: "Sister" },
      { name: "Nadab and Abihu", role: "Sons who offered strange fire and died" }
    ],
    lessonsAndReflection: [
      "When have you compromised convictions to keep the peace?",
      "Do you take responsibility for your failures or shift blame?"
    ],
    relatedCharacters: ["moses", "miriam", "nadab-abihu"],
    situations: [
      {
        id: "aaron-golden-calf",
        title: "Aaron and the Golden Calf",
        category: "Temptation",
        reference: "Exodus 32:1-6",
        keyVerse: "He took what they handed him and made it into an idol cast in the shape of a calf.",
        situation: "While Moses was on Sinai for 40 days, the people demanded gods they could see. Aaron caved to their demands.",
        pressure: "A restless, fearful mob without their leader, demanding visible gods.",
        innerBattle: "Standing alone for truth vs. giving the people what they wanted to avoid conflict.",
        response: "Aaron collected gold, fashioned a calf, and declared a festival to the LORD—syncretism disguised as worship.",
        outcome: "God's wrath nearly destroyed Israel; 3,000 died. Aaron deflected blame, saying the calf 'came out' of the fire.",
        lesson: "People-pleasing in leadership leads to catastrophic spiritual compromise.",
        traitRevealed: "Moral cowardice under pressure",
        spiritualPrinciple: "Leaders must fear God more than people.",
        reflectionQuestions: ["Where do you bend truth to avoid conflict?", "Have you ever created a 'golden calf' to keep people happy?"],
        dnaSnapshot: { fear: 4, pride: 3, courage: 1, faith: 2 }
      }
    ]
  },
  // 6. Bathsheba
  {
    id: "bathsheba",
    name: "Bathsheba",
    meaning: "Daughter of the oath",
    emoji: "🛁",
    role: "Wife of Uriah, then David; Queen Mother",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 11-12", "1 Kings 1-2"],
    archetypes: ["Survivor", "Matriarch"],
    dna: { faith: 3, humility: 3, courage: 3, wisdom: 4, compassion: 3, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Survivor",
      strength: "Resilience and strategic influence",
      weakness: "Victimized by power, limited agency in crisis",
      mindset: "Surviving and stewarding what remains",
      keyLesson: "God redeems even the darkest chapters of our story.",
      keyVerse: "Speak up for those who cannot speak for themselves.",
      keyVerseRef: "Proverbs 31:8"
    },
    storyArc: "Taken by King David in an abuse of power, widowed by his scheming, Bathsheba endured grief and scandal but rose to become queen mother, securing Solomon's throne and influencing Israel's future.",
    therapyView: {
      drivingFears: ["Powerlessness", "Losing another child", "Being defined by scandal"],
      coreMotivations: ["Protecting her children", "Securing her family's future", "Dignity"],
      relationalStyle: "Quietly strategic, resilient, uses influence wisely",
      blindSpots: ["May have internalized shame from David's sin against her"],
      healingMoments: ["Birth of Solomon", "Nathan's support for Solomon's kingship", "Becoming queen mother"]
    },
    strengths: ["Resilience", "Strategic wisdom", "Maternal devotion", "Political acumen"],
    weaknesses: ["Limited agency in a patriarchal system", "Possible complicity in palace intrigue"],
    journey: [
      { phase: "Testing", description: "Taken by David, lost her husband Uriah to David's plot" },
      { phase: "Failure", description: "Lost her first child as consequence of David's sin" },
      { phase: "Refinement", description: "Rebuilt her life within the royal household" },
      { phase: "Legacy", description: "Secured Solomon's throne, listed in the genealogy of Christ" }
    ],
    relationships: [
      { name: "David", role: "King who took her, then husband" },
      { name: "Uriah", role: "First husband, loyal soldier killed by David's order" },
      { name: "Solomon", role: "Son who became king" },
      { name: "Nathan", role: "Prophet and ally" }
    ],
    lessonsAndReflection: [
      "How does God redeem seasons of victimization and grief?",
      "Where do you see quiet strength shaping outcomes behind the scenes?"
    ],
    relatedCharacters: ["david", "solomon", "uriah", "nathan"],
    situations: [
      {
        id: "bathsheba-taken-by-david",
        title: "Bathsheba Taken by David",
        category: "Betrayal",
        reference: "2 Samuel 11:2-5",
        situation: "While bathing in accordance with purification law, Bathsheba was summoned by the king. As a subject, she had no power to refuse.",
        pressure: "A royal command from the most powerful man in the nation; no realistic option of refusal.",
        innerBattle: "Powerlessness vs. dignity; survival within an unjust system.",
        response: "Bathsheba went to the king as commanded and later informed David she was pregnant.",
        outcome: "David's cover-up led to Uriah's murder. Bathsheba lost her husband and then her first child.",
        lesson: "The abuse of power devastates the vulnerable, but God sees and redeems.",
        traitRevealed: "Vulnerability and resilience",
        spiritualPrinciple: "God does not forget the powerless; He weaves redemption from injustice.",
        reflectionQuestions: ["How do you respond when others' choices devastate your life?", "Where have you seen God redeem what was taken from you?"],
        dnaSnapshot: { fear: 4, courage: 2, faith: 3 }
      }
    ]
  },
  // 7. Absalom
  {
    id: "absalom",
    name: "Absalom",
    meaning: "Father of peace (ironic)",
    emoji: "🌳",
    role: "David's Rebellious Son",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["2 Samuel 13-19"],
    archetypes: ["Manipulator", "Tragic Hero"],
    dna: { faith: 1, humility: 0, courage: 4, wisdom: 3, compassion: 1, fear: 2, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Charisma and strategic ambition",
      weakness: "Bitterness turned to toxic rebellion",
      mindset: "Justice by my own hand",
      keyLesson: "Unresolved bitterness destroys from within.",
      keyVerse: "O my son Absalom! My son, my son Absalom! If only I had died instead of you!",
      keyVerseRef: "2 Samuel 18:33"
    },
    storyArc: "David's handsome, charismatic son who avenged his sister Tamar's rape, fled into exile, returned to steal the hearts of Israel, and led a full rebellion against his father before dying tangled in a tree.",
    therapyView: {
      drivingFears: ["Being ignored by his father", "Injustice going unpunished"],
      coreMotivations: ["Justice for Tamar", "Power", "Recognition from David"],
      relationalStyle: "Charismatic manipulator who wins loyalty through flattery",
      blindSpots: ["Confused revenge with justice", "Used legitimate grievance to justify illegitimate rebellion"],
      healingMoments: ["None recorded—his bitterness consumed him entirely"]
    },
    strengths: ["Charisma", "Strategic political maneuvering", "Loyalty of followers"],
    weaknesses: ["Bitterness", "Pride", "Manipulation", "Patricidal ambition"],
    journey: [
      { phase: "Calling", description: "Prince of Israel with gifts of leadership and beauty" },
      { phase: "Resistance", description: "Waited two years for David to punish Amnon, then took matters into his own hands" },
      { phase: "Failure", description: "Stole the hearts of Israel and led a full coup against David" },
      { phase: "Legacy", description: "Died caught in a tree, leaving David devastated" }
    ],
    relationships: [
      { name: "David", role: "Father who failed to act justly" },
      { name: "Tamar", role: "Sister who was violated" },
      { name: "Amnon", role: "Half-brother who raped Tamar—killed by Absalom" },
      { name: "Joab", role: "David's general who killed Absalom" }
    ],
    lessonsAndReflection: [
      "Where has unresolved pain turned into destructive bitterness?",
      "Have you taken justice into your own hands instead of trusting God?"
    ],
    relatedCharacters: ["david", "tamar", "amnon", "joab"],
    situations: [
      {
        id: "absalom-rebellion",
        title: "Absalom's Rebellion Against David",
        category: "Betrayal",
        reference: "2 Samuel 15:1-12",
        situation: "Absalom spent years positioning himself at the city gate, intercepting cases meant for the king, and telling people their cause was just but the king would not hear them.",
        pressure: "Unresolved injustice over Tamar, David's emotional absence, the intoxication of popular support.",
        innerBattle: "Legitimate grievance vs. illegitimate ambition; desire for justice vs. lust for power.",
        response: "Absalom declared himself king in Hebron and marched on Jerusalem, forcing David to flee.",
        outcome: "Civil war tore Israel apart. Absalom was killed by Joab, and David wept inconsolably.",
        lesson: "Unresolved bitterness, even from real wounds, can metastasize into destruction.",
        traitRevealed: "Charismatic manipulation rooted in bitterness",
        spiritualPrinciple: "Bitterness poisons the vessel that holds it more than the one it targets.",
        reflectionQuestions: ["What legitimate pain are you allowing to fuel illegitimate actions?", "Who do you need to forgive to stop the cycle of destruction?"],
        dnaSnapshot: { pride: 5, courage: 4, faith: 1, compassion: 1 }
      }
    ]
  },
  // 8. Naomi
  {
    id: "naomi",
    name: "Naomi",
    meaning: "Pleasant",
    emoji: "🥀",
    role: "Ruth's Mother-in-Law",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Ruth 1-4"],
    archetypes: ["Matriarch", "Survivor"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 4, compassion: 4, fear: 3, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Endurance through grief and strategic wisdom",
      weakness: "Bitterness in suffering",
      mindset: "God has dealt bitterly with me",
      keyLesson: "God restores what grief has taken through unexpected means.",
      keyVerse: "Don't call me Naomi. Call me Mara, because the Almighty has made my life very bitter.",
      keyVerseRef: "Ruth 1:20"
    },
    storyArc: "Left Bethlehem during famine, lost her husband and both sons in Moab, returned empty and bitter, but was restored through Ruth's loyalty and Boaz's redemption, becoming grandmother in the line of David.",
    therapyView: {
      drivingFears: ["Dying alone and destitute", "Being a burden", "God's abandonment"],
      coreMotivations: ["Family preservation", "Return to homeland", "Provision for Ruth"],
      relationalStyle: "Honest about pain, self-sacrificing, strategically caring",
      blindSpots: ["Bitterness blinded her to God's ongoing faithfulness through Ruth"],
      healingMoments: ["Ruth's refusal to leave her", "Boaz's kindness", "Holding baby Obed"]
    },
    strengths: ["Emotional honesty", "Strategic wisdom", "Selfless love for Ruth"],
    weaknesses: ["Bitterness toward God", "Despair and hopelessness"],
    journey: [
      { phase: "Calling", description: "Wife and mother in Bethlehem" },
      { phase: "Testing", description: "Lost husband and both sons in a foreign land" },
      { phase: "Failure", description: "Returned bitter, claiming God had turned against her" },
      { phase: "Refinement", description: "Guided Ruth toward Boaz with strategic wisdom" },
      { phase: "Legacy", description: "Became grandmother of Obed, in the lineage of Christ" }
    ],
    relationships: [
      { name: "Ruth", role: "Devoted daughter-in-law" },
      { name: "Boaz", role: "Kinsman-redeemer" },
      { name: "Orpah", role: "Daughter-in-law who returned to Moab" }
    ],
    lessonsAndReflection: [
      "Can you be honest with God about your pain without losing faith?",
      "Where has God placed unexpected people in your life for restoration?"
    ],
    relatedCharacters: ["ruth", "boaz"],
    situations: [
      {
        id: "naomi-bitter-return",
        title: "Naomi's Bitter Return to Bethlehem",
        category: "Loss",
        reference: "Ruth 1:19-21",
        situation: "After losing her husband and both sons, Naomi returned to Bethlehem and told the townspeople to call her Mara (bitter).",
        pressure: "Total loss of family, financial security, and social standing in an ancient culture where women depended on male relatives.",
        innerBattle: "Faith in God's goodness vs. overwhelming evidence of suffering; hope vs. despair.",
        response: "Naomi was brutally honest about her pain, blaming God publicly, yet still returned to His land and His people.",
        outcome: "Her honesty did not disqualify her from blessing. God was already orchestrating redemption through Ruth and Boaz.",
        lesson: "God can handle our honest grief; returning to Him in pain is still an act of faith.",
        traitRevealed: "Raw honesty before God",
        spiritualPrinciple: "Lament is a legitimate expression of faith, not a contradiction of it.",
        reflectionQuestions: ["Are you honest with God about your pain?", "Can you return to God even when you feel He has been harsh?"],
        dnaSnapshot: { faith: 3, fear: 4, humility: 4, compassion: 3 }
      }
    ]
  },
  // 9. Boaz
  {
    id: "boaz",
    name: "Boaz",
    meaning: "In him is strength",
    emoji: "🌾",
    role: "Kinsman-Redeemer, Landowner",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Ruth 2-4"],
    archetypes: ["Patriarch", "Servant"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 5, compassion: 5, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Generous integrity and covenantal faithfulness",
      weakness: "None prominently recorded",
      mindset: "Righteousness expressed through practical generosity",
      keyLesson: "True redemption costs the redeemer and blesses the redeemed.",
      keyVerse: "The LORD bless you, my daughter. This kindness is greater than that which you showed earlier.",
      keyVerseRef: "Ruth 3:10"
    },
    storyArc: "A wealthy Bethlehem landowner who noticed Ruth gleaning in his field, protected her, honored the law of redemption at the city gate, and married her—becoming a type of Christ the Redeemer.",
    therapyView: {
      drivingFears: ["Failing to uphold righteousness", "Injustice in his community"],
      coreMotivations: ["Honoring God's law", "Protecting the vulnerable", "Covenantal faithfulness"],
      relationalStyle: "Protective, generous, honorable in public and private",
      blindSpots: ["Almost too ideal—may have hesitated initially due to social risk"],
      healingMoments: ["Noticing Ruth in the field", "Covering her on the threshing floor", "Redeeming at the gate"]
    },
    strengths: ["Integrity", "Generosity", "Courage to redeem publicly", "Compassion for the vulnerable"],
    weaknesses: ["Cautious adherence to protocol could have delayed action"],
    journey: [
      { phase: "Calling", description: "Prosperous landowner who feared God" },
      { phase: "Testing", description: "Ruth arrived on his threshing floor, requesting redemption" },
      { phase: "Legacy", description: "Redeemed Ruth, became ancestor of David and Jesus" }
    ],
    relationships: [
      { name: "Ruth", role: "Wife, redeemed Moabitess" },
      { name: "Naomi", role: "Mother-in-law he restored" },
      { name: "Obed", role: "Son, grandfather of David" }
    ],
    lessonsAndReflection: [
      "Who are the vulnerable people God has placed in your field?",
      "What does it cost you to be a redeemer in someone's life?"
    ],
    relatedCharacters: ["ruth", "naomi", "david"],
    situations: [
      {
        id: "boaz-redemption-gate",
        title: "Boaz Redeems Ruth at the Gate",
        category: "Obedience",
        reference: "Ruth 4:1-12",
        situation: "Boaz went to the city gate to publicly redeem Ruth, but another kinsman had a closer legal claim.",
        pressure: "The closer kinsman could take Ruth; Boaz risked public rejection and financial cost.",
        innerBattle: "Playing it safe vs. stepping into costly redemption; following protocol vs. fighting for what is right.",
        response: "Boaz navigated the legal process honorably, and when the closer kinsman declined, he redeemed Ruth publicly.",
        outcome: "Boaz married Ruth, and their son Obed became grandfather of King David, placing them in the Messianic line.",
        lesson: "True redemption is public, costly, and transforms entire family lines.",
        traitRevealed: "Courageous integrity",
        spiritualPrinciple: "God's redemption works through people willing to pay the price.",
        reflectionQuestions: ["What does it cost you to redeem a broken situation?", "Are you willing to step into someone's story at personal risk?"],
        dnaSnapshot: { faith: 5, courage: 4, compassion: 5, wisdom: 5 }
      }
    ]
  },
  // 10. Hannah
  {
    id: "hannah",
    name: "Hannah",
    meaning: "Grace / Favor",
    emoji: "🙏",
    role: "Mother of Samuel",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["1 Samuel 1-2"],
    archetypes: ["Matriarch", "Servant"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 4, compassion: 4, fear: 2, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Persistent prayer and radical surrender",
      weakness: "Deep grief from barrenness and provocation",
      mindset: "Pouring out the soul before God",
      keyLesson: "God hears the desperate prayer and answers in His time.",
      keyVerse: "I prayed for this child, and the LORD has granted me what I asked of him.",
      keyVerseRef: "1 Samuel 1:27"
    },
    storyArc: "Barren and provoked by her rival Peninnah, Hannah wept and prayed so fervently that Eli mistook her for drunk. God granted her Samuel, whom she dedicated back to the LORD, and she became a mother of national transformation.",
    therapyView: {
      drivingFears: ["Permanent barrenness", "Being lesser than Peninnah", "God's silence"],
      coreMotivations: ["Motherhood", "Vindication before her rival", "Glorifying God"],
      relationalStyle: "Deeply emotional, raw in prayer, radically generous in surrender",
      blindSpots: ["Grief could have turned to bitterness like Naomi's"],
      healingMoments: ["Pouring out her heart at Shiloh", "Eli's blessing", "Dedicating Samuel to God"]
    },
    strengths: ["Persistent prayer", "Radical surrender", "Faith in God's timing", "Prophetic worship"],
    weaknesses: ["Deep emotional pain", "Vulnerable to provocation"],
    journey: [
      { phase: "Calling", description: "Faithful wife longing for a child" },
      { phase: "Testing", description: "Years of barrenness and Peninnah's provocation" },
      { phase: "Refinement", description: "Poured out her soul in desperate prayer at Shiloh" },
      { phase: "Legacy", description: "Gave Samuel to God; her prayer became a prophetic hymn" }
    ],
    relationships: [
      { name: "Elkanah", role: "Loving husband" },
      { name: "Peninnah", role: "Rival wife who provoked her" },
      { name: "Samuel", role: "Miraculous son dedicated to God" },
      { name: "Eli", role: "Priest who blessed her" }
    ],
    lessonsAndReflection: [
      "What are you pouring out before God that you are also willing to give back to Him?",
      "How do you handle seasons of waiting when others seem blessed?"
    ],
    relatedCharacters: ["samuel", "eli"],
    situations: [
      {
        id: "hannah-prayer-shiloh",
        title: "Hannah's Prayer at Shiloh",
        category: "Waiting",
        reference: "1 Samuel 1:9-18",
        keyVerse: "In her deep anguish Hannah prayed to the LORD, weeping bitterly.",
        situation: "After years of barrenness and Peninnah's taunting, Hannah went to the tabernacle and poured out her soul in silent, anguished prayer.",
        pressure: "Cultural shame of barrenness, a rival wife's provocation, and apparent divine silence.",
        innerBattle: "Despair vs. faith; bitterness toward God vs. desperate trust in His goodness.",
        response: "Hannah made a radical vow—if God gave her a son, she would give him back to the LORD for life.",
        outcome: "God remembered Hannah, gave her Samuel, and she faithfully dedicated him to the tabernacle.",
        lesson: "The most powerful prayers come from the deepest pain, and the greatest gifts are those we give back to God.",
        traitRevealed: "Desperate faith and radical surrender",
        spiritualPrinciple: "What we are willing to give back to God reveals the depth of our trust.",
        reflectionQuestions: ["What longing have you brought to God with total honesty?", "Can you surrender the very thing you most desire?"],
        dnaSnapshot: { faith: 5, humility: 5, courage: 4 }
      }
    ]
  },
  // 11. Samuel
  {
    id: "samuel",
    name: "Samuel",
    meaning: "Heard by God",
    emoji: "📯",
    role: "Last Judge, Prophet, Kingmaker",
    era: "United Kingdom",
    testament: "OT",
    keyScriptures: ["1 Samuel 1-16", "1 Samuel 25:1"],
    archetypes: ["Prophet", "Judge", "Priest"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 3, fear: 1, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Unwavering obedience to God's voice",
      weakness: "Struggled to release control when God moved on",
      mindset: "Speak, LORD, for your servant is listening",
      keyLesson: "Faithful obedience means anointing what God chooses, not what we prefer.",
      keyVerse: "To obey is better than sacrifice, and to heed is better than the fat of rams.",
      keyVerseRef: "1 Samuel 15:22"
    },
    storyArc: "Dedicated to God before birth, Samuel heard God's voice as a boy, judged Israel faithfully, reluctantly anointed Saul, then anointed David when Saul failed—bridging the era of judges and kings.",
    therapyView: {
      drivingFears: ["Repeating Eli's parenting failures", "Israel rejecting God"],
      coreMotivations: ["Obedience to God's voice", "Israel's spiritual health", "Faithful stewardship"],
      relationalStyle: "Authoritative, confrontational when needed, deeply devoted to God",
      blindSpots: ["His own sons were corrupt judges", "Took Israel's request for a king personally"],
      healingMoments: ["Hearing God's voice as a child", "Anointing David", "Israel's repentance at Mizpah"]
    },
    strengths: ["Hearing God clearly", "Courageous confrontation", "Lifelong integrity", "Intercessory prayer"],
    weaknesses: ["Failed to raise godly sons", "Took Israel's king-request as personal rejection", "Grieved over Saul too long"],
    journey: [
      { phase: "Calling", description: "Heard God's voice as a boy in the tabernacle" },
      { phase: "Testing", description: "Delivered God's judgment to Eli, his mentor" },
      { phase: "Failure", description: "His sons took bribes as judges, prompting Israel to demand a king" },
      { phase: "Refinement", description: "Obeyed God by anointing Saul, then David" },
      { phase: "Legacy", description: "Bridged the judges and monarchy; remembered as faithful prophet" }
    ],
    relationships: [
      { name: "Hannah", role: "Mother who dedicated him to God" },
      { name: "Eli", role: "Mentor and priest" },
      { name: "Saul", role: "First king he anointed" },
      { name: "David", role: "Second king he anointed" }
    ],
    lessonsAndReflection: [
      "Are you listening for God's voice in the quiet?",
      "Can you anoint God's choice even when it is not your preference?"
    ],
    relatedCharacters: ["hannah", "eli", "saul-king", "david"],
    situations: [
      {
        id: "samuel-hears-god",
        title: "Samuel Hears God's Voice",
        category: "Calling",
        reference: "1 Samuel 3:1-18",
        keyVerse: "Speak, for your servant is listening.",
        situation: "Young Samuel, serving under Eli in the tabernacle, heard God calling his name at night but did not yet know the LORD's voice.",
        pressure: "A child in a corrupt religious environment, receiving a devastating message about his mentor's family.",
        innerBattle: "Fear of delivering bad news to Eli vs. faithfulness to God's word.",
        response: "Samuel learned to say 'Speak, LORD' and then faithfully told Eli everything God had said.",
        outcome: "Samuel was established as a prophet; none of his words fell to the ground.",
        lesson: "God speaks to those positioned to listen, regardless of age or status.",
        traitRevealed: "Receptive obedience",
        spiritualPrinciple: "Availability to God matters more than ability.",
        reflectionQuestions: ["Are you positioned to hear God's voice?", "Will you speak truth even when the message is hard?"],
        dnaSnapshot: { faith: 5, humility: 5, courage: 4 }
      }
    ]
  },
  // 12. Eli
  {
    id: "eli",
    name: "Eli",
    meaning: "Ascended / My God",
    emoji: "🕯️",
    role: "High Priest and Judge",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["1 Samuel 1-4"],
    archetypes: ["Priest", "Tragic Hero"],
    dna: { faith: 3, humility: 3, courage: 1, wisdom: 3, compassion: 4, fear: 3, pride: 2, greed: 2 },
    quickCard: {
      archetype: "Priest",
      strength: "Faithful service in the tabernacle",
      weakness: "Failed to discipline his corrupt sons",
      mindset: "Passive acceptance of what should be confronted",
      keyLesson: "Tolerance of sin in those under your care is not love—it is neglect.",
      keyVerse: "For I told him that I would judge his family forever because of the sin he knew about; his sons blasphemed God, and he failed to restrain them.",
      keyVerseRef: "1 Samuel 3:13"
    },
    storyArc: "A faithful priest who served God for decades but failed to confront his sons Hophni and Phinehas, who corrupted the priesthood. God judged his house, and Eli died when he heard the Ark was captured.",
    therapyView: {
      drivingFears: ["Confrontation with his sons", "Losing family harmony"],
      coreMotivations: ["Peacekeeping", "Priestly duty", "Family loyalty"],
      relationalStyle: "Passive, avoidant of conflict, gentle but weak",
      blindSpots: ["Confused tolerance with love", "His passivity enabled corruption"],
      healingMoments: ["Recognizing God's voice calling Samuel", "Accepting God's judgment with 'He is the LORD'"]
    },
    strengths: ["Faithful priestly service", "Mentored Samuel", "Accepted God's judgment with humility"],
    weaknesses: ["Failed to discipline sons", "Passive leadership", "Enabled corruption"],
    journey: [
      { phase: "Calling", description: "Served as high priest and judge of Israel" },
      { phase: "Failure", description: "Knew his sons were corrupt but failed to restrain them" },
      { phase: "Refinement", description: "Accepted God's judgment: 'He is the LORD; let him do what is good in his eyes'" },
      { phase: "Legacy", description: "Died hearing the Ark was captured; his line was removed from the priesthood" }
    ],
    relationships: [
      { name: "Hophni", role: "Corrupt son" },
      { name: "Phinehas", role: "Corrupt son" },
      { name: "Samuel", role: "Protege who replaced his line" },
      { name: "Hannah", role: "Woman he initially misjudged, then blessed" }
    ],
    lessonsAndReflection: [
      "Where are you tolerating sin that you should be confronting?",
      "Is your desire for peace enabling destruction?"
    ],
    relatedCharacters: ["samuel", "hannah"],
    situations: [
      {
        id: "eli-failure-to-restrain",
        title: "Eli Fails to Restrain His Sons",
        category: "Leadership Pressure",
        reference: "1 Samuel 2:22-36",
        situation: "Eli's sons were stealing offerings and sleeping with women at the tabernacle entrance. Eli rebuked them mildly but took no disciplinary action.",
        pressure: "Confronting your own children in their sin risks family rupture and public scandal.",
        innerBattle: "Parental love vs. priestly duty; peace at home vs. holiness before God.",
        response: "Eli gave a weak verbal rebuke but never removed them from service or imposed consequences.",
        outcome: "God sent a prophet declaring Eli's line would be cut off. Both sons died on the same day.",
        lesson: "Passive leadership in the face of known sin brings judgment on the leader, not just the sinner.",
        traitRevealed: "Conflict avoidance masquerading as grace",
        spiritualPrinciple: "Those in authority will be judged for what they tolerate, not just what they do.",
        reflectionQuestions: ["Where are you giving mild rebukes when strong action is needed?", "Is your silence enabling someone's destruction?"],
        dnaSnapshot: { courage: 1, fear: 4, compassion: 4, faith: 3 }
      }
    ]
  },
  // 13. Rahab
  {
    id: "rahab",
    name: "Rahab",
    meaning: "Broad / Wide",
    emoji: "🔴",
    role: "Prostitute of Jericho, Redeemed Ancestor of Christ",
    era: "Conquest",
    testament: "OT",
    keyScriptures: ["Joshua 2", "Joshua 6:22-25", "Hebrews 11:31", "James 2:25"],
    archetypes: ["Redeemed", "Survivor"],
    dna: { faith: 4, humility: 3, courage: 5, wisdom: 4, compassion: 3, fear: 3, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Redeemed",
      strength: "Bold faith that risked everything on God's reputation",
      weakness: "Deception as a survival strategy",
      mindset: "Acting on incomplete faith with total commitment",
      keyLesson: "God honors imperfect faith acted on with courage.",
      keyVerse: "By faith the prostitute Rahab, because she welcomed the spies, was not killed with those who were disobedient.",
      keyVerseRef: "Hebrews 11:31"
    },
    storyArc: "A Canaanite prostitute who heard of Israel's God, hid the spies at the risk of her life, bargained for her family's salvation, and was grafted into Israel—becoming an ancestor of David and Jesus.",
    therapyView: {
      drivingFears: ["Destruction of her city and family", "Being discarded as worthless"],
      coreMotivations: ["Survival", "Family protection", "Aligning with the winning side—God's side"],
      relationalStyle: "Resourceful, bold, protective of family",
      blindSpots: ["Used deception readily—survival instincts over moral clarity"],
      healingMoments: ["Declaring faith in Israel's God", "Scarlet cord in the window", "Grafted into Israel's community"]
    },
    strengths: ["Courageous faith", "Resourcefulness", "Family loyalty", "Decisive action"],
    weaknesses: ["Deception", "Background in prostitution"],
    journey: [
      { phase: "Calling", description: "Heard of God's mighty acts and believed" },
      { phase: "Testing", description: "Hid the spies and risked death for treason" },
      { phase: "Legacy", description: "Saved her family, married into Israel, ancestor of Christ" }
    ],
    relationships: [
      { name: "Joshua's Spies", role: "Men she hid and bargained with" },
      { name: "Salmon", role: "Husband from the tribe of Judah" },
      { name: "Boaz", role: "Son" }
    ],
    lessonsAndReflection: [
      "Has your past disqualified you from God's future in your mind?",
      "When have you risked everything based on what you believed about God?"
    ],
    relatedCharacters: ["joshua", "boaz"],
    situations: [
      {
        id: "rahab-hides-spies",
        title: "Rahab Hides the Spies",
        category: "Faith Testing",
        reference: "Joshua 2:1-21",
        keyVerse: "I know that the LORD has given you this land... for the LORD your God is God in heaven above and on the earth below.",
        situation: "Two Israelite spies entered Jericho and lodged at Rahab's house. The king's men came searching for them.",
        pressure: "Harboring enemy spies was treason punishable by death. She had to choose between her nation and an unseen God.",
        innerBattle: "Loyalty to her city vs. faith in a God she had only heard about; self-preservation vs. courageous risk.",
        response: "Rahab hid the spies, lied to the king's men, and bargained for her family's safety with a scarlet cord.",
        outcome: "When Jericho fell, Rahab and her family were saved. She was grafted into Israel.",
        lesson: "God honors faith that acts decisively, even when it comes from unlikely people.",
        traitRevealed: "Bold, imperfect faith",
        spiritualPrinciple: "Your past does not determine your destiny when you align with God.",
        reflectionQuestions: ["What risk is your faith calling you to take?", "Do you believe God can use someone with your history?"],
        dnaSnapshot: { faith: 4, courage: 5, fear: 3 }
      }
    ]
  },
  // 14. Deborah
  {
    id: "deborah",
    name: "Deborah",
    meaning: "Bee",
    emoji: "⚖️",
    role: "Prophetess and Judge of Israel",
    era: "Judges",
    testament: "OT",
    keyScriptures: ["Judges 4-5"],
    archetypes: ["Judge", "Prophet"],
    dna: { faith: 5, humility: 3, courage: 5, wisdom: 5, compassion: 4, fear: 0, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Judge",
      strength: "Prophetic authority and bold leadership",
      weakness: "None prominently recorded",
      mindset: "God's authority exercised through willing vessels",
      keyLesson: "When men hesitate, God raises up whoever is willing.",
      keyVerse: "Village life in Israel ceased until I, Deborah, arose, a mother in Israel.",
      keyVerseRef: "Judges 5:7"
    },
    storyArc: "The only female judge of Israel who held court under a palm tree, summoned Barak to lead the army, accompanied him into battle against Sisera, and celebrated victory with a prophetic song.",
    therapyView: {
      drivingFears: ["Israel's spiritual apathy", "Oppression continuing unchallenged"],
      coreMotivations: ["Justice for the oppressed", "God's glory in Israel", "Empowering others to act"],
      relationalStyle: "Authoritative, empowering, direct and fearless",
      blindSpots: ["May have been frustrated by others' timidity"],
      healingMoments: ["Israel's deliverance from Sisera", "The song of victory with Barak"]
    },
    strengths: ["Prophetic clarity", "Fearless leadership", "Empowering others", "Poetic worship"],
    weaknesses: ["Could be direct to the point of shaming others (telling Barak a woman would get the glory)"],
    journey: [
      { phase: "Calling", description: "Rose as prophetess and judge during oppression under Jabin" },
      { phase: "Testing", description: "Summoned Barak and agreed to go to battle with him" },
      { phase: "Legacy", description: "Delivered Israel; the land had peace for 40 years" }
    ],
    relationships: [
      { name: "Barak", role: "Military commander she empowered" },
      { name: "Jael", role: "Woman who killed Sisera" },
      { name: "Lappidoth", role: "Husband" }
    ],
    lessonsAndReflection: [
      "Are you willing to lead when others hesitate?",
      "How do you empower others to step into their calling?"
    ],
    relatedCharacters: ["gideon", "barak", "jael"],
    situations: [
      {
        id: "deborah-summons-barak",
        title: "Deborah Summons Barak to Battle",
        category: "Leadership Pressure",
        reference: "Judges 4:4-10",
        keyVerse: "Certainly I will go with you. But because of the course you are taking, the honor will not be yours.",
        situation: "Deborah received God's command to send Barak against Sisera's army of 900 iron chariots. Barak refused to go unless Deborah went with him.",
        pressure: "Leading a nation into battle against a technologically superior army while navigating a reluctant commander.",
        innerBattle: "Frustration with timid leaders vs. willingness to step into the gap.",
        response: "Deborah agreed to accompany Barak but prophesied the glory would go to a woman, not him.",
        outcome: "Israel won decisively. Sisera was killed by Jael, fulfilling Deborah's prophecy.",
        lesson: "God uses willing vessels when the expected leaders falter.",
        traitRevealed: "Fearless prophetic authority",
        spiritualPrinciple: "God's mission moves forward through whoever says yes.",
        reflectionQuestions: ["Are you waiting for someone else to lead when God has called you?", "How do you handle leading alongside hesitant partners?"],
        dnaSnapshot: { courage: 5, faith: 5, wisdom: 5 }
      }
    ]
  },
  // 15. Jezebel
  {
    id: "jezebel",
    name: "Jezebel",
    meaning: "Not exalted / Where is the prince?",
    emoji: "💄",
    role: "Queen of Israel, Baal Worshipper",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 16:31", "1 Kings 18-19", "1 Kings 21", "2 Kings 9:30-37"],
    archetypes: ["Manipulator", "Oppressor"],
    dna: { faith: 0, humility: 0, courage: 4, wisdom: 3, compassion: 0, fear: 1, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Ruthless determination and political cunning",
      weakness: "Total rejection of God's authority",
      mindset: "Power at any cost",
      keyLesson: "Unchecked power married to false worship destroys everything it touches.",
      keyVerse: "Dogs will devour Jezebel by the wall of Jezreel.",
      keyVerseRef: "1 Kings 21:23"
    },
    storyArc: "A Phoenician princess who married King Ahab, imported Baal worship into Israel, murdered prophets, engineered Naboth's death for his vineyard, and terrorized Elijah before meeting a gruesome end as prophesied by Elijah.",
    therapyView: {
      drivingFears: ["Loss of power and control", "Being subject to anyone"],
      coreMotivations: ["Absolute control", "Baal worship dominance", "Destroying opposition"],
      relationalStyle: "Dominating, controlling, uses intimacy as a weapon",
      blindSpots: ["Believed she was untouchable", "Could not fathom a power greater than hers"],
      healingMoments: ["None recorded—she remained defiant to the end"]
    },
    strengths: ["Political intelligence", "Fearless determination", "Strategic manipulation"],
    weaknesses: ["Total moral corruption", "Idolatry", "Murder", "Hubris"],
    journey: [
      { phase: "Calling", description: "Phoenician princess married to Ahab to cement an alliance" },
      { phase: "Failure", description: "Imported Baal worship, killed God's prophets, framed Naboth" },
      { phase: "Legacy", description: "Thrown from a window, trampled, eaten by dogs—as prophesied" }
    ],
    relationships: [
      { name: "Ahab", role: "Husband she dominated" },
      { name: "Elijah", role: "Prophet who opposed her" },
      { name: "Naboth", role: "Innocent man she had murdered" }
    ],
    lessonsAndReflection: [
      "Where does the desire for control override your conscience?",
      "What happens when power operates without accountability?"
    ],
    relatedCharacters: ["ahab", "elijah", "naboth"],
    situations: [
      {
        id: "jezebel-naboth-vineyard",
        title: "Jezebel Engineers Naboth's Murder",
        category: "Temptation",
        reference: "1 Kings 21:1-16",
        keyVerse: "Is this how you act as king over Israel? Get up and eat! I'll get you the vineyard of Naboth.",
        situation: "Ahab sulked because Naboth refused to sell his ancestral vineyard. Jezebel took matters into her own hands.",
        pressure: "Royal entitlement vs. covenant law protecting ancestral land.",
        innerBattle: "None apparent—Jezebel felt no moral conflict, only the obstacle of someone saying no to the king.",
        response: "She forged letters in Ahab's name, hired false witnesses, had Naboth stoned for blasphemy, and seized his vineyard.",
        outcome: "Elijah pronounced doom on Ahab's house. Jezebel's end was fulfilled exactly as prophesied.",
        lesson: "When power is unchecked by conscience, the innocent suffer and judgment is certain.",
        traitRevealed: "Ruthless manipulation without conscience",
        spiritualPrinciple: "God avenges the innocent even when earthly justice fails.",
        reflectionQuestions: ["Where do you use your influence to get what you want at others' expense?", "Who are the 'Naboths' being crushed by unchecked power in your world?"],
        dnaSnapshot: { pride: 5, greed: 5, compassion: 0, fear: 0 }
      }
    ]
  },
  // 16. Ahab
  {
    id: "ahab",
    name: "Ahab",
    meaning: "Father's brother",
    emoji: "🪞",
    role: "King of Israel",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 16:29-22:40"],
    archetypes: ["King", "Tragic Hero"],
    dna: { faith: 1, humility: 1, courage: 2, wisdom: 2, compassion: 1, fear: 3, pride: 4, greed: 5 },
    quickCard: {
      archetype: "King",
      strength: "Military capability when motivated",
      weakness: "Moral weakness and domination by Jezebel",
      mindset: "I want what I want, and someone else will get it for me",
      keyLesson: "A leader who abdicates moral responsibility invites destruction.",
      keyVerse: "There was never anyone like Ahab, who sold himself to do evil in the eyes of the LORD, urged on by Jezebel his wife.",
      keyVerseRef: "1 Kings 21:25"
    },
    storyArc: "Israel's most wicked king who married Jezebel, promoted Baal worship, sulked over Naboth's vineyard, and wavered between defiance and momentary repentance before dying in battle as prophesied.",
    therapyView: {
      drivingFears: ["Confrontation", "Not getting what he wants", "Elijah's prophecies"],
      coreMotivations: ["Personal comfort", "Possessions", "Avoiding conflict with Jezebel"],
      relationalStyle: "Passive, sulking, controlled by a dominant spouse",
      blindSpots: ["Let Jezebel do his dirty work while maintaining plausible deniability", "Brief repentance without lasting change"],
      healingMoments: ["Brief repentance after Naboth's vineyard judgment (1 Kings 21:27-29)"]
    },
    strengths: ["Military competence", "Capable of momentary humility"],
    weaknesses: ["Moral cowardice", "Idolatry", "Greed", "Dominated by Jezebel", "Sulking self-pity"],
    journey: [
      { phase: "Calling", description: "Became king of Israel" },
      { phase: "Failure", description: "Married Jezebel, built Baal's temple, allowed murder of prophets" },
      { phase: "Refinement", description: "Briefly humbled himself after Elijah's judgment" },
      { phase: "Legacy", description: "Died in battle; remembered as Israel's worst king" }
    ],
    relationships: [
      { name: "Jezebel", role: "Wife who dominated him" },
      { name: "Elijah", role: "Prophet who opposed him" },
      { name: "Naboth", role: "Man murdered for his vineyard" },
      { name: "Micaiah", role: "Prophet who spoke truth despite pressure" }
    ],
    lessonsAndReflection: [
      "Where are you passively allowing evil because confrontation is uncomfortable?",
      "Is your repentance genuine or just momentary regret?"
    ],
    relatedCharacters: ["jezebel", "elijah", "naboth"],
    situations: [
      {
        id: "ahab-naboth-vineyard",
        title: "Ahab Covets Naboth's Vineyard",
        category: "Temptation",
        reference: "1 Kings 21:1-4",
        situation: "Ahab wanted Naboth's vineyard. When Naboth rightfully refused, Ahab went home, lay on his bed, turned his face to the wall, and refused to eat.",
        pressure: "Royal entitlement vs. covenantal law; desire vs. the word 'no.'",
        innerBattle: "A king who could command armies but could not handle being told no; entitlement vs. contentment.",
        response: "Ahab sulked like a child until Jezebel took over and solved his problem through murder.",
        outcome: "He got the vineyard but lost his soul—Elijah pronounced God's judgment on his entire dynasty.",
        lesson: "Entitlement and passivity are a deadly combination in leadership.",
        traitRevealed: "Childish entitlement and moral passivity",
        spiritualPrinciple: "What you obtain through others' sin still stains your hands.",
        reflectionQuestions: ["Where does entitlement drive your decisions?", "Do you let others do your dirty work?"],
        dnaSnapshot: { greed: 5, pride: 4, courage: 1, compassion: 0 }
      }
    ]
  },
  // 17. Elisha
  {
    id: "elisha",
    name: "Elisha",
    meaning: "My God is salvation",
    emoji: "🧥",
    role: "Prophet, Elijah's Successor",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["1 Kings 19:19-21", "2 Kings 2-13"],
    archetypes: ["Prophet", "Servant"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 5, fear: 0, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Double portion of Elijah's spirit; miracles of compassion",
      weakness: "Occasionally fierce in judgment (bears and the youths)",
      mindset: "God's power displayed through ordinary faithfulness",
      keyLesson: "Faithful succession multiplies the impact of those who came before.",
      keyVerse: "Let me inherit a double portion of your spirit.",
      keyVerseRef: "2 Kings 2:9"
    },
    storyArc: "A farmer called from his plow, Elisha burned his equipment, followed Elijah, received a double portion of his spirit, and performed twice as many miracles—mostly acts of compassion and provision for the poor.",
    therapyView: {
      drivingFears: ["Failing to carry Elijah's legacy", "Israel's continued apostasy"],
      coreMotivations: ["Compassion for the suffering", "Continuing Elijah's mission", "Demonstrating God's power"],
      relationalStyle: "Accessible, compassionate, willing to engage the ordinary and the powerful alike",
      blindSpots: ["The cursing of the youths suggests fierce protectiveness of prophetic dignity"],
      healingMoments: ["Receiving the mantle", "Healing Naaman", "Multiplying the widow's oil", "Raising the Shunammite's son"]
    },
    strengths: ["Miraculous power", "Compassion for the poor", "Faithful mentorship", "Boldness before kings"],
    weaknesses: ["Harsh judgment on mocking youths", "Less dramatic personality may be underappreciated"],
    journey: [
      { phase: "Calling", description: "Called from plowing to follow Elijah" },
      { phase: "Testing", description: "Refused to leave Elijah's side before the ascension" },
      { phase: "Legacy", description: "Performed double the miracles of Elijah; even his bones raised the dead" }
    ],
    relationships: [
      { name: "Elijah", role: "Mentor and predecessor" },
      { name: "Gehazi", role: "Servant who failed him" },
      { name: "Naaman", role: "Syrian general he healed" },
      { name: "Shunammite Woman", role: "Faithful supporter whose son he raised" }
    ],
    lessonsAndReflection: [
      "Are you asking God for a double portion of what He has already given?",
      "How do you carry forward the legacy of those who mentored you?"
    ],
    relatedCharacters: ["elijah", "naaman", "gehazi"],
    situations: [
      {
        id: "elisha-double-portion",
        title: "Elisha Asks for a Double Portion",
        category: "Calling",
        reference: "2 Kings 2:1-14",
        keyVerse: "Let me inherit a double portion of your spirit.",
        situation: "As Elijah was about to be taken to heaven, he asked Elisha what he wanted. Elisha asked for a double portion of Elijah's spirit.",
        pressure: "Following the greatest prophet in Israel's history; the magnitude of the request.",
        innerBattle: "Settling for a normal inheritance vs. asking for something extraordinary.",
        response: "Elisha asked boldly and was told it would be granted if he saw Elijah taken up—he kept his eyes fixed.",
        outcome: "He saw the chariot of fire, picked up Elijah's mantle, and performed twice as many miracles.",
        lesson: "God rewards those who ask boldly and keep their eyes on Him through the transition.",
        traitRevealed: "Holy ambition and faithful persistence",
        spiritualPrinciple: "What you fix your eyes on during transition determines what you receive.",
        reflectionQuestions: ["What bold request have you been afraid to make of God?", "Are you keeping your eyes fixed during transitions?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 18. Isaiah
  {
    id: "isaiah",
    name: "Isaiah",
    meaning: "The LORD is salvation",
    emoji: "📜",
    role: "Prophet of Judah, Messianic Prophet",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Isaiah 1-66", "2 Kings 19-20"],
    archetypes: ["Prophet", "Martyr"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 4, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Unmatched prophetic vision spanning centuries",
      weakness: "Initial sense of unworthiness",
      mindset: "Here am I—send me",
      keyLesson: "God purifies those He calls and sends them with His message.",
      keyVerse: "Then I heard the voice of the Lord saying, 'Whom shall I send?' And I said, 'Here am I. Send me!'",
      keyVerseRef: "Isaiah 6:8"
    },
    storyArc: "A nobleman who saw God's glory in the Temple, was purified by a coal from the altar, and spent decades proclaiming both judgment and messianic hope to a deaf nation. Tradition says he was sawn in two under Manasseh.",
    therapyView: {
      drivingFears: ["Israel's spiritual blindness", "Prophesying to ears that will not hear"],
      coreMotivations: ["God's holiness", "Messianic hope", "Faithfulness to the calling"],
      relationalStyle: "Bold truth-teller, poetic communicator, accessible to kings and commoners",
      blindSpots: ["Initial sense of unworthiness could have paralyzed him"],
      healingMoments: ["Vision of God's throne", "Coal touching his lips", "Messianic prophecies of hope"]
    },
    strengths: ["Prophetic vision", "Poetic brilliance", "Courage before kings", "Messianic revelation"],
    weaknesses: ["Initial unworthiness", "Prophesied to a people who would not listen"],
    journey: [
      { phase: "Calling", description: "Saw the LORD high and lifted up in the Temple" },
      { phase: "Testing", description: "Told his audience would not listen, yet he must still speak" },
      { phase: "Legacy", description: "Wrote the most comprehensive messianic prophecies in the OT" }
    ],
    relationships: [
      { name: "King Hezekiah", role: "Righteous king he counseled" },
      { name: "King Ahaz", role: "Wicked king he confronted" }
    ],
    lessonsAndReflection: [
      "Are you willing to say 'Send me' even when the audience is hostile?",
      "How has an encounter with God's holiness changed your self-perception?"
    ],
    relatedCharacters: ["hezekiah", "jeremiah", "ezekiel"],
    situations: [
      {
        id: "isaiah-temple-vision",
        title: "Isaiah's Temple Vision and Commission",
        category: "Calling",
        reference: "Isaiah 6:1-8",
        keyVerse: "Here am I. Send me!",
        situation: "In the year King Uzziah died, Isaiah saw the LORD seated on His throne, surrounded by seraphim crying 'Holy, holy, holy.'",
        pressure: "Confronted with absolute holiness, Isaiah was undone by his own sinfulness.",
        innerBattle: "Unworthiness vs. willingness; the terror of God's holiness vs. the invitation to serve.",
        response: "After a seraph touched his lips with a burning coal, Isaiah immediately volunteered: 'Here am I. Send me!'",
        outcome: "He was commissioned to preach to a people who would not listen—faithfulness measured by obedience, not results.",
        lesson: "God's purification precedes His commission; He does not send the self-sufficient.",
        traitRevealed: "Humble availability",
        spiritualPrinciple: "Encounter with God's holiness produces both brokenness and boldness.",
        reflectionQuestions: ["When did you last feel undone by God's holiness?", "Are you willing to serve without guaranteed results?"],
        dnaSnapshot: { faith: 5, humility: 5, courage: 5 }
      }
    ]
  },
  // 19. Ezekiel
  {
    id: "ezekiel",
    name: "Ezekiel",
    meaning: "God strengthens",
    emoji: "🦴",
    role: "Prophet in Exile, Visionary",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["Ezekiel 1-48"],
    archetypes: ["Prophet", "Exile"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 4, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Obedience to bizarre prophetic acts and apocalyptic vision",
      weakness: "Emotionally costly calling—lost his wife as a sign",
      mindset: "Total surrender to God's message regardless of cost",
      keyLesson: "God can bring life to the deadest situations.",
      keyVerse: "I will put my Spirit in you and you will live, and I will settle you in your own land.",
      keyVerseRef: "Ezekiel 37:14"
    },
    storyArc: "A priest-turned-prophet exiled to Babylon, Ezekiel performed dramatic symbolic acts, received extraordinary visions, lost his wife as a prophetic sign, and proclaimed both judgment and restoration—culminating in the vision of dry bones coming to life.",
    therapyView: {
      drivingFears: ["Israel's spiritual death", "Being dismissed as a madman"],
      coreMotivations: ["God's glory returning to Israel", "Faithful obedience at any cost"],
      relationalStyle: "Dramatic, emotionally intense, obedient even when the cost was devastating",
      blindSpots: ["His dramatic methods could alienate the very people he was trying to reach"],
      healingMoments: ["Vision of God's throne by the river Chebar", "Dry bones coming to life", "Vision of the restored Temple"]
    },
    strengths: ["Visionary insight", "Radical obedience", "Emotional resilience", "Dramatic communication"],
    weaknesses: ["Emotionally taxing calling", "Methods that seemed bizarre to observers"],
    journey: [
      { phase: "Calling", description: "Called as prophet among the exiles by the river Chebar" },
      { phase: "Testing", description: "Performed extreme prophetic acts—lying on his side for 390 days, cooking over dung" },
      { phase: "Refinement", description: "Lost his wife and was forbidden to mourn, as a sign to Israel" },
      { phase: "Legacy", description: "Dry bones vision and restored Temple vision gave hope to the exiles" }
    ],
    relationships: [
      { name: "The Exiles", role: "Audience and community" },
      { name: "His Wife", role: "Beloved partner whose death became a prophetic sign" }
    ],
    lessonsAndReflection: [
      "What has God asked you to surrender as a sign to others?",
      "Do you believe God can bring life to the deadest areas of your life?"
    ],
    relatedCharacters: ["jeremiah", "daniel", "isaiah"],
    situations: [
      {
        id: "ezekiel-dry-bones",
        title: "The Valley of Dry Bones",
        category: "Faith Testing",
        reference: "Ezekiel 37:1-14",
        keyVerse: "Can these bones live?",
        situation: "God brought Ezekiel to a valley full of dry bones and asked him if they could live. Ezekiel was commanded to prophesy to the bones.",
        pressure: "Speaking life into an utterly hopeless situation; proclaiming restoration to a dead nation in exile.",
        innerBattle: "Human logic says dead bones stay dead; faith says God can do anything.",
        response: "Ezekiel prophesied as commanded. The bones came together, received flesh, and the Spirit of God brought them to life.",
        outcome: "A vast army stood up—a vision of Israel's national and spiritual resurrection.",
        lesson: "No situation is too dead for God to resurrect. His word spoken in faith creates life.",
        traitRevealed: "Obedient faith in impossible circumstances",
        spiritualPrinciple: "God's Spirit brings life where human effort cannot; our role is to speak His word.",
        reflectionQuestions: ["What dead situation has God asked you to speak life into?", "Do you believe restoration is possible for what seems permanently lost?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 20. Hosea
  {
    id: "hosea",
    name: "Hosea",
    meaning: "Salvation",
    emoji: "💍",
    role: "Prophet to Israel, Husband of Gomer",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["Hosea 1-14"],
    archetypes: ["Prophet", "Redeemed"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 4, compassion: 5, fear: 2, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Embodied God's relentless, pursuing love",
      weakness: "Called to endure relational devastation as a prophetic sign",
      mindset: "Love that refuses to let go",
      keyLesson: "God's love pursues the unfaithful with redemptive passion.",
      keyVerse: "I will betroth you to me forever; I will betroth you in righteousness and justice, in love and compassion.",
      keyVerseRef: "Hosea 2:19"
    },
    storyArc: "God commanded Hosea to marry Gomer, a woman who would be unfaithful. She left him for other lovers, and God commanded Hosea to buy her back—a living parable of God's relentless love for unfaithful Israel.",
    therapyView: {
      drivingFears: ["Gomer's unfaithfulness", "Being a fool for love", "Israel's destruction"],
      coreMotivations: ["Obedience to God's painful command", "Redeeming love", "Prophetic witness"],
      relationalStyle: "Painfully loyal, vulnerable, pursuing even when rejected",
      blindSpots: ["His personal pain could have turned to bitterness"],
      healingMoments: ["Buying Gomer back from slavery", "God's promise of restoration through his suffering"]
    },
    strengths: ["Obedience to devastating commands", "Capacity to love the unlovable", "Prophetic endurance"],
    weaknesses: ["Vulnerability to heartbreak", "The personal cost of his calling"],
    journey: [
      { phase: "Calling", description: "Commanded to marry an unfaithful woman as a prophetic sign" },
      { phase: "Testing", description: "Endured Gomer's repeated unfaithfulness" },
      { phase: "Refinement", description: "Bought Gomer back from slavery, redeeming her" },
      { phase: "Legacy", description: "His marriage became the most powerful picture of God's love for Israel" }
    ],
    relationships: [
      { name: "Gomer", role: "Unfaithful wife he redeemed" },
      { name: "Jezreel, Lo-Ruhamah, Lo-Ammi", role: "Children with prophetic names" }
    ],
    lessonsAndReflection: [
      "How far would you go to love someone who keeps hurting you?",
      "Where do you see God's relentless love pursuing you despite your unfaithfulness?"
    ],
    relatedCharacters: ["gomer", "isaiah", "jeremiah"],
    situations: [
      {
        id: "hosea-buys-gomer-back",
        title: "Hosea Buys Gomer Back",
        category: "Restoration",
        reference: "Hosea 3:1-5",
        keyVerse: "Go, show your love to your wife again, though she is loved by another man and is an adulteress. Love her as the LORD loves the Israelites.",
        situation: "After Gomer left Hosea and ended up in slavery, God commanded Hosea to buy her back and love her again.",
        pressure: "Public humiliation—buying back an unfaithful wife from slavery. Every social norm said to divorce her.",
        innerBattle: "Righteous anger and wounded pride vs. God's command to embody redeeming love.",
        response: "Hosea paid fifteen shekels of silver and barley to redeem Gomer, bringing her home.",
        outcome: "Their reunion became the defining image of God's love for wayward Israel.",
        lesson: "Redemption costs the redeemer; love that pursues the unfaithful reflects God's heart.",
        traitRevealed: "Sacrificial, pursuing love",
        spiritualPrinciple: "God's love is not based on our faithfulness but on His character.",
        reflectionQuestions: ["Who has God asked you to love beyond what they deserve?", "Can you see your own unfaithfulness reflected in Gomer's story?"],
        dnaSnapshot: { compassion: 5, faith: 5, humility: 5, courage: 4 }
      }
    ]
  },
  // 21. Nehemiah
  {
    id: "nehemiah",
    name: "Nehemiah",
    meaning: "The LORD comforts",
    emoji: "🧱",
    role: "Cupbearer to the King, Rebuilder of Jerusalem's Walls",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Nehemiah 1-13"],
    archetypes: ["Builder", "Servant"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 4, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Builder",
      strength: "Visionary leadership combined with practical action",
      weakness: "Fierce temper when confronting injustice",
      mindset: "Pray first, plan second, build relentlessly",
      keyLesson: "Rebuilding requires prayer, planning, and perseverance against opposition.",
      keyVerse: "The God of heaven will give us success. We his servants will start rebuilding.",
      keyVerseRef: "Nehemiah 2:20"
    },
    storyArc: "A Jewish cupbearer in the Persian court who wept over Jerusalem's broken walls, obtained royal permission to rebuild, organized the work despite fierce opposition, and led spiritual reform alongside Ezra.",
    therapyView: {
      drivingFears: ["Jerusalem remaining in disgrace", "Failing the mission"],
      coreMotivations: ["Restoring God's city", "National identity", "Honoring ancestors"],
      relationalStyle: "Decisive leader who prays before acting and delegates effectively",
      blindSpots: ["Aggressive confrontation—pulled out men's hair", "Could be controlling"],
      healingMoments: ["Weeping and praying for Jerusalem", "Walls completed in 52 days", "The people's joy at the reading of the Law"]
    },
    strengths: ["Strategic planning", "Prayerfulness", "Delegating authority", "Perseverance under opposition"],
    weaknesses: ["Fierce temper", "Could be heavy-handed in reform"],
    journey: [
      { phase: "Calling", description: "Heard of Jerusalem's disgrace and wept, fasted, and prayed" },
      { phase: "Testing", description: "Faced mockery from Sanballat and Tobiah, threats of attack" },
      { phase: "Legacy", description: "Completed the walls in 52 days and led spiritual reform" }
    ],
    relationships: [
      { name: "Artaxerxes", role: "Persian king who granted permission" },
      { name: "Sanballat", role: "Chief opponent" },
      { name: "Ezra", role: "Partner in spiritual reform" }
    ],
    lessonsAndReflection: [
      "What broken walls in your life need rebuilding?",
      "Do you pray before you plan, or plan before you pray?"
    ],
    relatedCharacters: ["ezra", "sanballat", "zerubbabel"],
    situations: [
      {
        id: "nehemiah-wall-opposition",
        title: "Nehemiah Rebuilds Under Opposition",
        category: "Persecution",
        reference: "Nehemiah 4:1-23",
        keyVerse: "We prayed to our God and posted a guard day and night to meet this threat.",
        situation: "As the walls rose, Sanballat, Tobiah, and others mocked, threatened, and plotted to attack. The workers grew exhausted.",
        pressure: "Physical threats, psychological warfare, exhaustion, and internal discouragement.",
        innerBattle: "Fear vs. faith; the temptation to quit vs. the call to finish.",
        response: "Nehemiah armed the workers—half built while half stood guard. They worked with a sword in one hand and a tool in the other.",
        outcome: "The walls were completed in just 52 days, stunning their enemies.",
        lesson: "God's work requires both spiritual vigilance and practical action.",
        traitRevealed: "Strategic perseverance under fire",
        spiritualPrinciple: "Prayer and practical preparation are not opposites; they are partners.",
        reflectionQuestions: ["What opposition are you facing in the work God has given you?", "Are you both praying and preparing?"],
        dnaSnapshot: { courage: 5, faith: 5, wisdom: 5 }
      }
    ]
  },
  // 22. Ezra
  {
    id: "ezra",
    name: "Ezra",
    meaning: "Help",
    emoji: "📖",
    role: "Priest, Scribe, Reformer",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Ezra 7-10", "Nehemiah 8"],
    archetypes: ["Priest", "Builder"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 5, compassion: 3, fear: 1, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Priest",
      strength: "Devotion to God's Word and spiritual reform",
      weakness: "Extreme measures in reform—forced divorce of foreign wives",
      mindset: "The hand of the LORD my God was on me",
      keyLesson: "Revival begins when God's people return to His Word.",
      keyVerse: "For Ezra had devoted himself to the study and observance of the Law of the LORD, and to teaching its decrees and laws in Israel.",
      keyVerseRef: "Ezra 7:10"
    },
    storyArc: "A priest and scribe who led the second wave of exiles back to Jerusalem, discovered widespread intermarriage with pagan nations, led a dramatic public repentance, and restored the reading and teaching of God's Law.",
    therapyView: {
      drivingFears: ["Repeating the sins that caused the exile", "God's Word being forgotten"],
      coreMotivations: ["Preserving God's Law", "Purity of worship", "National repentance"],
      relationalStyle: "Scholarly, passionate about truth, leads through teaching",
      blindSpots: ["Harsh measures in reform could cause relational devastation"],
      healingMoments: ["Public reading of the Law where the people wept", "National confession and renewal"]
    },
    strengths: ["Devotion to Scripture", "Teaching ability", "Courageous reform", "Prayerful leadership"],
    weaknesses: ["Extreme approach to intermarriage", "Could prioritize law over people"],
    journey: [
      { phase: "Calling", description: "Devoted himself to studying, obeying, and teaching God's Law" },
      { phase: "Testing", description: "Discovered widespread intermarriage among the returned exiles" },
      { phase: "Legacy", description: "Led public confession and restored Scripture reading to Israel" }
    ],
    relationships: [
      { name: "Nehemiah", role: "Partner in reform" },
      { name: "Artaxerxes", role: "Persian king who authorized his mission" }
    ],
    lessonsAndReflection: [
      "How central is God's Word to your daily life?",
      "Where does purity of conviction need to be balanced with compassion?"
    ],
    relatedCharacters: ["nehemiah", "zerubbabel"],
    situations: [
      {
        id: "ezra-public-confession",
        title: "Ezra's Public Confession Over Intermarriage",
        category: "Correction",
        reference: "Ezra 9:1-10:17",
        keyVerse: "I fell on my knees with my hands spread out to the LORD my God and prayed.",
        situation: "Ezra discovered that the returned exiles—including priests and Levites—had married pagan wives, repeating the very sin that caused the exile.",
        pressure: "Confronting the entire community including leaders; the tension between mercy and covenant fidelity.",
        innerBattle: "Compassion for individuals vs. obedience to God's covenant requirements.",
        response: "Ezra tore his robes, pulled hair from his head, and led a massive public confession. The people agreed to separate from foreign wives.",
        outcome: "A painful but thorough reform preserved the covenant community's spiritual identity.",
        lesson: "True reform is costly and requires leaders willing to grieve over sin before correcting it.",
        traitRevealed: "Grief-driven reform",
        spiritualPrinciple: "Leaders who weep over sin before addressing it earn the right to call for change.",
        reflectionQuestions: ["Do you grieve over sin before you confront it?", "Where does your community need uncomfortable correction?"],
        dnaSnapshot: { faith: 5, humility: 4, courage: 4 }
      }
    ]
  },
  // 23. Job
  {
    id: "job",
    name: "Job",
    meaning: "Persecuted / Where is the Father?",
    emoji: "🌪️",
    role: "Righteous Sufferer",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Job 1-42"],
    archetypes: ["Seeker", "Survivor"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 4, compassion: 4, fear: 2, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Seeker",
      strength: "Unwavering integrity under catastrophic suffering",
      weakness: "Self-righteousness in arguing his case before God",
      mindset: "Though He slay me, yet will I trust Him",
      keyLesson: "Suffering is not always punishment; sometimes it is the crucible of deeper encounter with God.",
      keyVerse: "My ears had heard of you but now my eyes have seen you.",
      keyVerseRef: "Job 42:5"
    },
    storyArc: "The wealthiest and most righteous man in the East lost everything—children, wealth, health—as Satan tested his faith. His friends accused him, he argued with God, and finally God spoke from the whirlwind, restoring Job to greater blessing.",
    therapyView: {
      drivingFears: ["God being unjust", "Suffering without meaning", "Abandonment by God"],
      coreMotivations: ["Understanding why", "Vindicating his integrity", "Encountering God directly"],
      relationalStyle: "Honest to the point of confrontational with God; loyal but frustrated with friends",
      blindSpots: ["Self-righteousness—demanded God explain Himself", "Assumed he deserved answers"],
      healingMoments: ["God speaking from the whirlwind", "Seeing God with his own eyes", "Praying for his friends", "Double restoration"]
    },
    strengths: ["Unwavering integrity", "Emotional honesty before God", "Perseverance", "Intercessory prayer"],
    weaknesses: ["Self-righteousness", "Demanding answers from God", "Verging on bitterness"],
    journey: [
      { phase: "Calling", description: "Blameless and upright, fearing God and shunning evil" },
      { phase: "Testing", description: "Lost children, wealth, and health in rapid succession" },
      { phase: "Failure", description: "Demanded God justify Himself; bordered on self-righteous accusation" },
      { phase: "Refinement", description: "God spoke from the whirlwind; Job repented in dust and ashes" },
      { phase: "Legacy", description: "Restored double; prayed for his friends; ultimate example of perseverance" }
    ],
    relationships: [
      { name: "God", role: "The one he questioned and ultimately encountered" },
      { name: "Satan", role: "Accuser who instigated the test" },
      { name: "Eliphaz, Bildad, Zophar", role: "Friends with bad theology" },
      { name: "Elihu", role: "Young man who came closest to truth" },
      { name: "Job's Wife", role: "Told him to curse God and die" }
    ],
    lessonsAndReflection: [
      "Can you trust God when suffering makes no sense?",
      "Is your faith based on what God gives or who God is?"
    ],
    relatedCharacters: ["abraham", "joseph"],
    situations: [
      {
        id: "job-god-speaks",
        title: "God Speaks from the Whirlwind",
        category: "Correction",
        reference: "Job 38-42",
        keyVerse: "Where were you when I laid the earth's foundation?",
        situation: "After 37 chapters of debate, God finally spoke—not to answer Job's questions, but to reveal His incomprehensible sovereignty.",
        pressure: "Months of agony, bad counsel from friends, silence from God, and the brink of despair.",
        innerBattle: "The demand for explanations vs. the sufficiency of God's presence.",
        response: "Job repented: 'My ears had heard of you but now my eyes have seen you. Therefore I despise myself and repent in dust and ashes.'",
        outcome: "God vindicated Job over his friends, restored double his wealth, and gave him new children.",
        lesson: "Encountering God Himself is the answer, even when our questions go unanswered.",
        traitRevealed: "Humility born from divine encounter",
        spiritualPrinciple: "God's presence is more satisfying than God's explanations.",
        reflectionQuestions: ["Are you demanding answers when God is offering Himself?", "Can encounter with God be enough even without explanations?"],
        dnaSnapshot: { faith: 5, humility: 5, wisdom: 4 }
      }
    ]
  },
  // 24. Cain
  {
    id: "cain",
    name: "Cain",
    meaning: "Acquired / Possession",
    emoji: "⚒️",
    role: "First Son, First Murderer",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 4:1-16"],
    archetypes: ["Tragic Hero", "Manipulator"],
    dna: { faith: 1, humility: 0, courage: 2, wisdom: 1, compassion: 0, fear: 3, pride: 5, greed: 3 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Agricultural industry",
      weakness: "Jealous rage and refusal to master sin",
      mindset: "If I can't have God's approval, neither will you",
      keyLesson: "Sin is crouching at the door; you must master it or it will master you.",
      keyVerse: "Sin is crouching at your door; it desires to have you, but you must rule over it.",
      keyVerseRef: "Genesis 4:7"
    },
    storyArc: "The first human born, Cain offered an unacceptable sacrifice, burned with jealousy over Abel's acceptance, ignored God's warning, murdered his brother, and became a wanderer marked by God.",
    therapyView: {
      drivingFears: ["Rejection", "Being surpassed by his younger brother"],
      coreMotivations: ["God's approval on his terms", "Eliminating competition"],
      relationalStyle: "Competitive, resentful, unable to process rejection constructively",
      blindSpots: ["Blamed Abel for his own rejection", "Refused God's direct counsel"],
      healingMoments: ["God's personal warning was an invitation to repent—Cain refused it"]
    },
    strengths: ["Agricultural skill", "Initiative in worship (offered first)"],
    weaknesses: ["Jealousy", "Murder", "Refusal to repent", "Blame-shifting"],
    journey: [
      { phase: "Calling", description: "Worker of the ground, first to bring an offering" },
      { phase: "Resistance", description: "Rejected God's correction and let anger fester" },
      { phase: "Failure", description: "Murdered Abel in the field" },
      { phase: "Legacy", description: "Became a restless wanderer; his line built cities but ended in violence" }
    ],
    relationships: [
      { name: "Abel", role: "Brother he murdered" },
      { name: "Adam and Eve", role: "Parents" },
      { name: "God", role: "The one who warned him and marked him" }
    ],
    lessonsAndReflection: [
      "Where is jealousy crouching at the door of your heart?",
      "How do you respond when God corrects you?"
    ],
    relatedCharacters: ["abel", "adam", "eve"],
    situations: [
      {
        id: "cain-murders-abel",
        title: "Cain Murders Abel",
        category: "Temptation",
        reference: "Genesis 4:1-12",
        keyVerse: "Sin is crouching at your door; it desires to have you, but you must rule over it.",
        situation: "God accepted Abel's offering but not Cain's. God personally warned Cain about the sin crouching at his door.",
        pressure: "Sibling rivalry, perceived divine favoritism, burning jealousy.",
        innerBattle: "Humbling himself to offer correctly vs. destroying the one who made him look bad.",
        response: "Cain ignored God's warning, lured Abel to the field, and killed him.",
        outcome: "Cain was cursed from the ground and became a restless wanderer, though God mercifully marked him for protection.",
        lesson: "Unmastered sin escalates from jealousy to murder. God warns before He judges.",
        traitRevealed: "Jealous rage and spiritual stubbornness",
        spiritualPrinciple: "God's correction is a mercy; rejecting it opens the door to destruction.",
        reflectionQuestions: ["What sin is crouching at your door right now?", "Do you respond to correction with humility or hostility?"],
        dnaSnapshot: { pride: 5, fear: 3, faith: 1, compassion: 0 }
      }
    ]
  },
  // 25. Abel
  {
    id: "abel",
    name: "Abel",
    meaning: "Breath / Vapor",
    emoji: "🐑",
    role: "First Shepherd, First Martyr",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 4:1-8", "Hebrews 11:4", "Matthew 23:35"],
    archetypes: ["Shepherd", "Martyr"],
    dna: { faith: 5, humility: 5, courage: 3, wisdom: 3, compassion: 4, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Martyr",
      strength: "Worshipped God with his best",
      weakness: "Vulnerability—no recorded awareness of Cain's murderous intent",
      mindset: "Give God the firstborn and the best",
      keyLesson: "Faithful worship may cost you everything, but it speaks even after death.",
      keyVerse: "By faith Abel brought God a better offering than Cain did. By faith he still speaks, even though he is dead.",
      keyVerseRef: "Hebrews 11:4"
    },
    storyArc: "The second son of Adam and Eve, Abel was a shepherd who offered the firstborn of his flock to God. His worship was accepted, provoking Cain's jealousy and leading to the first murder. His blood cried out from the ground.",
    therapyView: {
      drivingFears: ["None prominently recorded"],
      coreMotivations: ["Pleasing God with the best offering", "Authentic worship"],
      relationalStyle: "Genuine, trusting, possibly naive about danger from his own brother",
      blindSpots: ["Unaware of the lethal jealousy he provoked"],
      healingMoments: ["His offering accepted by God", "His faith still speaks through Hebrews 11"]
    },
    strengths: ["Faithful worship", "Generous offering", "Righteousness"],
    weaknesses: ["Vulnerable to violence he could not foresee"],
    journey: [
      { phase: "Calling", description: "Shepherd who offered the firstborn of his flock" },
      { phase: "Legacy", description: "First martyr; his faith still speaks through Scripture" }
    ],
    relationships: [
      { name: "Cain", role: "Brother who murdered him" },
      { name: "Adam and Eve", role: "Parents" }
    ],
    lessonsAndReflection: [
      "Are you giving God your best, or your leftovers?",
      "How does faithful living speak even beyond your lifetime?"
    ],
    relatedCharacters: ["cain", "adam", "eve"],
    situations: [
      {
        id: "abel-offering",
        title: "Abel's Accepted Offering",
        category: "Obedience",
        reference: "Genesis 4:2-5",
        keyVerse: "By faith Abel brought God a better offering than Cain did.",
        situation: "Abel brought fat portions from the firstborn of his flock, while Cain brought some fruits of the soil. God looked with favor on Abel's offering.",
        pressure: "Being the younger brother, establishing independent worship of God.",
        innerBattle: "Offering the costly firstborn vs. keeping the best for himself.",
        response: "Abel gave the firstborn and the fat portions—the best of what he had.",
        outcome: "God accepted Abel's offering, establishing the principle that faith and cost matter in worship.",
        lesson: "God looks at the heart behind the offering, not just the offering itself.",
        traitRevealed: "Wholehearted generosity in worship",
        spiritualPrinciple: "The quality of our offering reveals the depth of our faith.",
        reflectionQuestions: ["Are you giving God your first and best?", "What does your offering reveal about your heart?"],
        dnaSnapshot: { faith: 5, humility: 5, greed: 0 }
      }
    ]
  },
  // 26. Noah
  {
    id: "noah",
    name: "Noah",
    meaning: "Rest / Comfort",
    emoji: "🌈",
    role: "Ark Builder, Covenant Receiver",
    era: "Creation",
    testament: "OT",
    keyScriptures: ["Genesis 6-9", "Hebrews 11:7"],
    archetypes: ["Builder", "Patriarch"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 3, fear: 2, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Builder",
      strength: "Obedient faith over decades of ridicule",
      weakness: "Post-flood drunkenness and vulnerability",
      mindset: "Build what God commands even when no one else understands",
      keyLesson: "Faithful obedience sustains you through seasons when no one agrees with your direction.",
      keyVerse: "Noah did everything just as God commanded him.",
      keyVerseRef: "Genesis 6:22"
    },
    storyArc: "Found righteous in a corrupt generation, Noah obeyed God's command to build an ark over many decades, survived the flood with his family, received the rainbow covenant, but later fell into drunkenness and shame.",
    therapyView: {
      drivingFears: ["Being the only one who sees the danger", "Isolation from the whole world"],
      coreMotivations: ["Obedience to God regardless of cost", "Preserving his family", "Righteousness"],
      relationalStyle: "Steady, persistent, possibly isolated by his calling",
      blindSpots: ["Post-deliverance vulnerability—drunkenness after the crisis passed"],
      healingMoments: ["God's covenant and the rainbow", "The dove returning with the olive branch"]
    },
    strengths: ["Decades of faithful obedience", "Perseverance under ridicule", "Righteousness"],
    weaknesses: ["Post-flood drunkenness", "Vulnerability after the crisis ended"],
    journey: [
      { phase: "Calling", description: "Found righteous; commanded to build an ark" },
      { phase: "Testing", description: "Built for decades while the world mocked" },
      { phase: "Failure", description: "Got drunk after the flood; exposed himself shamefully" },
      { phase: "Legacy", description: "Received the rainbow covenant; ancestor of all humanity" }
    ],
    relationships: [
      { name: "God", role: "The one who called and covenanted" },
      { name: "Shem, Ham, Japheth", role: "Sons who repopulated the earth" }
    ],
    lessonsAndReflection: [
      "Can you obey God for decades without visible results?",
      "What do you do after the crisis is over—do you let your guard down?"
    ],
    relatedCharacters: ["abraham", "adam"],
    situations: [
      {
        id: "noah-builds-ark",
        title: "Noah Builds the Ark",
        category: "Obedience",
        reference: "Genesis 6:9-22",
        keyVerse: "Noah did everything just as God commanded him.",
        situation: "God told Noah to build a massive ark because He was going to flood the earth. There was no precedent for rain or floods.",
        pressure: "Building for decades with no visible evidence of coming judgment; enduring ridicule from the entire world.",
        innerBattle: "Trusting an unprecedented warning vs. the opinion of every other person alive.",
        response: "Noah did everything just as God commanded—no shortcuts, no modifications, no quitting.",
        outcome: "The flood came exactly as God said. Noah's family and the animals were saved.",
        lesson: "Obedience measured in decades is the highest form of faith.",
        traitRevealed: "Steadfast, long-term obedience",
        spiritualPrinciple: "When God's command contradicts everyone's opinion, obedience requires extraordinary faith.",
        reflectionQuestions: ["What has God asked you to build that no one else understands?", "Can your faith sustain decades of obedience without visible results?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 27. Sarah
  {
    id: "sarah",
    name: "Sarah",
    meaning: "Princess",
    emoji: "👶",
    role: "Wife of Abraham, Mother of Isaac",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 11-23", "Hebrews 11:11"],
    archetypes: ["Matriarch", "Survivor"],
    dna: { faith: 3, humility: 3, courage: 3, wisdom: 3, compassion: 2, fear: 3, pride: 3, greed: 1 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Faith to bear a child at 90 years old",
      weakness: "Impatience with God's timing and cruelty to Hagar",
      mindset: "I'll help God's promise along my own way",
      keyLesson: "God's promises are fulfilled on His timeline, not ours.",
      keyVerse: "Is anything too hard for the LORD?",
      keyVerseRef: "Genesis 18:14"
    },
    storyArc: "Beautiful wife of Abraham who followed him from Ur, endured decades of barrenness, gave Hagar to Abraham in impatience, laughed at God's promise, but finally bore Isaac at 90—becoming the mother of nations.",
    therapyView: {
      drivingFears: ["Permanent barrenness", "Being replaced", "Irrelevance"],
      coreMotivations: ["Motherhood", "Abraham's legacy", "God's promise fulfilled"],
      relationalStyle: "Loyal but controlling; acts out of fear when waiting becomes unbearable",
      blindSpots: ["Cruelty to Hagar born from jealousy", "Tried to engineer God's promise"],
      healingMoments: ["Laughter at Isaac's birth", "God honoring her as mother of nations"]
    },
    strengths: ["Faith to follow Abraham into the unknown", "Perseverance through barrenness", "Eventually received the promise"],
    weaknesses: ["Impatience", "Cruelty to Hagar", "Trying to control God's plan", "Laughing in unbelief"],
    journey: [
      { phase: "Calling", description: "Left Ur with Abraham to follow God's promise" },
      { phase: "Testing", description: "Decades of barrenness and waiting" },
      { phase: "Failure", description: "Gave Hagar to Abraham, then treated her cruelly" },
      { phase: "Legacy", description: "Bore Isaac at 90; mother in the Messianic line" }
    ],
    relationships: [
      { name: "Abraham", role: "Husband and partner in faith" },
      { name: "Hagar", role: "Servant she mistreated" },
      { name: "Isaac", role: "Son of promise" },
      { name: "Ishmael", role: "Hagar's son she drove out" }
    ],
    lessonsAndReflection: [
      "Where are you trying to help God's promises along with your own plans?",
      "How does impatience lead to harm for others?"
    ],
    relatedCharacters: ["abraham", "hagar", "isaac"],
    situations: [
      {
        id: "sarah-gives-hagar",
        title: "Sarah Gives Hagar to Abraham",
        category: "Waiting",
        reference: "Genesis 16:1-6",
        situation: "After years of barrenness, Sarah convinced Abraham to take her servant Hagar as a surrogate mother. When Hagar conceived, Sarah became jealous and mistreated her.",
        pressure: "Cultural shame of barrenness, fading hope, and the weight of God's unfulfilled promise.",
        innerBattle: "Trust in God's timing vs. the urgency to make the promise happen through human engineering.",
        response: "Sarah gave Hagar to Abraham, then abused Hagar when the plan produced jealousy instead of peace.",
        outcome: "Ishmael was born, creating generational conflict. The true heir Isaac came later on God's schedule.",
        lesson: "Taking matters into our own hands often creates the very conflict we were trying to avoid.",
        traitRevealed: "Impatient control",
        spiritualPrinciple: "God's delays are not denials, and our shortcuts create complications.",
        reflectionQuestions: ["Where have your impatient solutions created new problems?", "Can you wait for God's timing even when it seems impossibly late?"],
        dnaSnapshot: { faith: 2, fear: 4, pride: 3, compassion: 1 }
      }
    ]
  },
  // 28. Hagar
  {
    id: "hagar",
    name: "Hagar",
    meaning: "Flight / Stranger",
    emoji: "🏜️",
    role: "Sarah's Servant, Mother of Ishmael",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 16", "Genesis 21:8-21"],
    archetypes: ["Survivor", "Exile"],
    dna: { faith: 3, humility: 3, courage: 4, wisdom: 2, compassion: 4, fear: 4, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Survivor",
      strength: "Encountered God personally in her desperation",
      weakness: "Despised Sarah after conceiving, provoking further conflict",
      mindset: "Survival in a system stacked against me",
      keyLesson: "God sees the outcast and hears the cry of the powerless.",
      keyVerse: "You are the God who sees me.",
      keyVerseRef: "Genesis 16:13"
    },
    storyArc: "An Egyptian slave given to Abraham as a surrogate, Hagar conceived Ishmael but was mistreated by Sarah. She fled twice into the wilderness, and both times God met her personally—making her the first person in Scripture to name God.",
    therapyView: {
      drivingFears: ["Abandonment", "Death of her child", "Being a permanent outsider"],
      coreMotivations: ["Survival", "Protection of Ishmael", "Dignity"],
      relationalStyle: "Defensive, fiercely protective of her son, yearning for belonging",
      blindSpots: ["Despising Sarah escalated her own suffering"],
      healingMoments: ["El Roi—the God who sees me", "God's promise for Ishmael", "Water in the wilderness"]
    },
    strengths: ["Encountered God directly", "Motherly devotion", "Survival instinct", "Named God"],
    weaknesses: ["Contempt toward Sarah", "Trapped in a powerless position"],
    journey: [
      { phase: "Calling", description: "Chosen as surrogate mother for Abraham's heir" },
      { phase: "Testing", description: "Mistreated by Sarah, fled into the wilderness" },
      { phase: "Refinement", description: "God met her personally—'You are the God who sees me'" },
      { phase: "Legacy", description: "Mother of Ishmael, ancestor of a great nation" }
    ],
    relationships: [
      { name: "Sarah", role: "Mistress who mistreated her" },
      { name: "Abraham", role: "Master and father of her child" },
      { name: "Ishmael", role: "Beloved son" },
      { name: "God (El Roi)", role: "The God who saw her" }
    ],
    lessonsAndReflection: [
      "Do you believe God sees you in your lowest moment?",
      "How does being powerless in others' plans feel?"
    ],
    relatedCharacters: ["sarah", "abraham", "ishmael"],
    situations: [
      {
        id: "hagar-wilderness",
        title: "Hagar Meets God in the Wilderness",
        category: "Rejection",
        reference: "Genesis 16:7-14",
        keyVerse: "You are the God who sees me.",
        situation: "Pregnant and fleeing Sarah's abuse, Hagar collapsed in the wilderness near a spring, alone and without hope.",
        pressure: "Pregnant, homeless, enslaved, abused—no human advocate anywhere.",
        innerBattle: "Despair vs. the faintest hope that someone might care about her.",
        response: "When the angel found her, Hagar listened, obeyed the command to return, and named God 'El Roi—the God who sees me.'",
        outcome: "She became the first person in Scripture to give God a name. God promised Ishmael would father a great nation.",
        lesson: "God meets the outcast in their wilderness. No one is invisible to Him.",
        traitRevealed: "Desperate faith and spiritual perception",
        spiritualPrinciple: "The God who sees you in your lowest place is the God worth naming.",
        reflectionQuestions: ["When have you felt invisible to everyone, including God?", "Can you believe you are seen even when no one is looking?"],
        dnaSnapshot: { faith: 4, fear: 4, humility: 4, courage: 3 }
      }
    ]
  },
  // 29. Isaac
  {
    id: "isaac",
    name: "Isaac",
    meaning: "He laughs",
    emoji: "⛰️",
    role: "Child of Promise, Patriarch",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 21-28", "Genesis 35:28-29"],
    archetypes: ["Patriarch", "Survivor"],
    dna: { faith: 4, humility: 4, courage: 2, wisdom: 3, compassion: 3, fear: 3, pride: 1, greed: 1 },
    quickCard: {
      archetype: "Patriarch",
      strength: "Quiet faith and submission to God's plan",
      weakness: "Passivity and favoritism among sons",
      mindset: "Receive the blessing and pass it on",
      keyLesson: "Being the bridge between promises requires quiet faithfulness.",
      keyVerse: "The LORD appeared to Isaac and said, 'I will be with you and will bless you.'",
      keyVerseRef: "Genesis 26:3"
    },
    storyArc: "The child of laughter, born to aged parents, bound on an altar by his father, Isaac lived a quieter life than Abraham or Jacob—digging wells, being deceived by his own son, but faithfully carrying the covenant to the next generation.",
    therapyView: {
      drivingFears: ["Repeating his near-sacrifice trauma", "Conflict and confrontation"],
      coreMotivations: ["Peace", "Carrying the covenant", "Providing for his family"],
      relationalStyle: "Passive, conflict-avoidant, deeply attached to comfort (loved Esau's cooking)",
      blindSpots: ["Favoritism for Esau over Jacob", "Deceived easily because he avoided confrontation"],
      healingMoments: ["God's direct covenant confirmation", "Blessing Jacob despite the deception", "Rebekah's arrival as God's provision"]
    },
    strengths: ["Quiet faith", "Submission", "Well-digging perseverance", "Covenant faithfulness"],
    weaknesses: ["Passivity", "Favoritism", "Easily deceived", "Conflict avoidance"],
    journey: [
      { phase: "Calling", description: "Child of promise born to Abraham and Sarah in old age" },
      { phase: "Testing", description: "Bound on the altar at Moriah—submitted to his father's faith" },
      { phase: "Failure", description: "Favored Esau for his cooking; deceived by Jacob and Rebekah" },
      { phase: "Legacy", description: "Passed the covenant blessing; patriarch in the line of Christ" }
    ],
    relationships: [
      { name: "Abraham", role: "Father who almost sacrificed him" },
      { name: "Sarah", role: "Mother who laughed at his birth" },
      { name: "Rebekah", role: "Wife God provided" },
      { name: "Esau", role: "Favorite son" },
      { name: "Jacob", role: "Son who deceived him for the blessing" }
    ],
    lessonsAndReflection: [
      "How do you carry forward someone else's legacy faithfully?",
      "Where does passivity create dysfunction in your relationships?"
    ],
    relatedCharacters: ["abraham", "jacob", "esau", "rebekah"],
    situations: [
      {
        id: "isaac-on-the-altar",
        title: "Isaac on the Altar at Moriah",
        category: "Sacrifice",
        reference: "Genesis 22:1-14",
        keyVerse: "God himself will provide the lamb for the burnt offering, my son.",
        situation: "Abraham bound Isaac on the altar at God's command. Isaac was old enough to resist but submitted to his father's faith.",
        pressure: "Facing death at his own father's hands in obedience to a God he could not see or hear directly.",
        innerBattle: "Self-preservation vs. trust in his father and his father's God.",
        response: "Isaac submitted—carrying the wood, lying on the altar, trusting Abraham's word that God would provide.",
        outcome: "God provided a ram. Isaac lived and became a type of Christ—the willing sacrifice.",
        lesson: "Submission to God's plan often means trusting through what we cannot understand.",
        traitRevealed: "Quiet, trusting submission",
        spiritualPrinciple: "The greatest faith sometimes looks like the quietest obedience.",
        reflectionQuestions: ["Can you trust God when His plan makes no sense to you?", "Where is God asking for your quiet submission?"],
        dnaSnapshot: { faith: 5, humility: 5, courage: 4, fear: 3 }
      }
    ]
  },
  // 30. Esau
  {
    id: "esau",
    name: "Esau",
    meaning: "Hairy",
    emoji: "🍲",
    role: "Firstborn of Isaac, Sold His Birthright",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 25-33", "Hebrews 12:16-17"],
    archetypes: ["Tragic Hero", "Warrior"],
    dna: { faith: 1, humility: 2, courage: 4, wisdom: 1, compassion: 3, fear: 2, pride: 4, greed: 3 },
    quickCard: {
      archetype: "Tragic Hero",
      strength: "Physical prowess and eventual forgiveness of Jacob",
      weakness: "Despised his birthright for immediate gratification",
      mindset: "I want it now; the future can wait",
      keyLesson: "Trading eternal blessings for temporary comfort is the costliest exchange.",
      keyVerse: "See that no one is godless like Esau, who for a single meal sold his inheritance rights as the oldest son.",
      keyVerseRef: "Hebrews 12:16"
    },
    storyArc: "The rugged firstborn who sold his birthright for stew, lost the blessing to Jacob's deception, planned murder in his rage, but eventually reconciled with his brother years later, showing unexpected grace.",
    therapyView: {
      drivingFears: ["Being cheated again", "Losing what remains"],
      coreMotivations: ["Immediate gratification", "Physical comfort", "Eventually—family peace"],
      relationalStyle: "Impulsive, passionate, eventually forgiving",
      blindSpots: ["Could not see the value of what he was giving up", "Lived for the present moment"],
      healingMoments: ["Reconciliation with Jacob in Genesis 33—running to embrace him"]
    },
    strengths: ["Physical strength", "Hunting skill", "Eventually forgave Jacob", "Generosity in reconciliation"],
    weaknesses: ["Impulsive", "Despised spiritual blessings", "Murderous rage (initially)"],
    journey: [
      { phase: "Calling", description: "Firstborn son with the birthright and blessing rights" },
      { phase: "Failure", description: "Sold his birthright for a bowl of stew; lost the blessing to deception" },
      { phase: "Refinement", description: "Planned to kill Jacob but years later embraced him in forgiveness" },
      { phase: "Legacy", description: "Father of Edom; lost the covenant line but found personal peace" }
    ],
    relationships: [
      { name: "Jacob", role: "Twin brother who deceived him" },
      { name: "Isaac", role: "Father who favored him" },
      { name: "Rebekah", role: "Mother who favored Jacob" }
    ],
    lessonsAndReflection: [
      "What eternal blessings are you trading for temporary comfort?",
      "Can you forgive someone who took what was rightfully yours?"
    ],
    relatedCharacters: ["jacob", "isaac", "rebekah"],
    situations: [
      {
        id: "esau-sells-birthright",
        title: "Esau Sells His Birthright",
        category: "Temptation",
        reference: "Genesis 25:29-34",
        keyVerse: "So Esau despised his birthright.",
        situation: "Exhausted from hunting, Esau came home starving. Jacob offered stew in exchange for Esau's birthright—the double portion and covenant headship.",
        pressure: "Extreme physical hunger and exhaustion vs. an abstract future inheritance.",
        innerBattle: "Immediate physical need vs. eternal spiritual value.",
        response: "Esau swore an oath, gave away his birthright, ate the stew, and left without a second thought.",
        outcome: "Esau lost the covenant blessing permanently. He later wept for it but could not get it back.",
        lesson: "What we trade in a moment of weakness defines our legacy.",
        traitRevealed: "Impulsive disregard for eternal value",
        spiritualPrinciple: "Those who live for the immediate forfeit the eternal.",
        reflectionQuestions: ["What are you tempted to trade for temporary relief?", "Do you value the unseen blessings of God over visible comfort?"],
        dnaSnapshot: { greed: 4, pride: 3, faith: 1, wisdom: 1 }
      }
    ]
  },
  // 31. Leah
  {
    id: "leah",
    name: "Leah",
    meaning: "Weary",
    emoji: "👀",
    role: "Jacob's First Wife, Mother of Six Tribes",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 29-35"],
    archetypes: ["Matriarch", "Survivor"],
    dna: { faith: 4, humility: 4, courage: 3, wisdom: 3, compassion: 4, fear: 3, pride: 2, greed: 1 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Perseverance in being unloved; found identity in God",
      weakness: "Desperate need for Jacob's love defined her early years",
      mindset: "Maybe this time he will love me",
      keyLesson: "God sees the unloved and honors them beyond what the world values.",
      keyVerse: "When the LORD saw that Leah was not loved, he enabled her to conceive.",
      keyVerseRef: "Genesis 29:31"
    },
    storyArc: "Substituted for Rachel on Jacob's wedding night, Leah spent years trying to earn her husband's love through bearing sons. God saw her pain and gave her six sons and a daughter—including Judah, through whom the Messiah would come.",
    therapyView: {
      drivingFears: ["Being unloved forever", "Being compared to Rachel and always losing"],
      coreMotivations: ["Jacob's love and attention", "Vindication through motherhood", "Eventually—praise of God"],
      relationalStyle: "Desperate for affirmation, competitive with Rachel, ultimately surrendered to God",
      blindSpots: ["Looked to Jacob for worth instead of God", "Named children based on her pain and longing"],
      healingMoments: ["Naming Judah—'This time I will praise the LORD'—finally finding worth in God, not Jacob"]
    },
    strengths: ["Perseverance", "Motherhood", "Eventually found identity in God", "Ancestor of Christ through Judah"],
    weaknesses: ["Desperation for human love", "Competition with Rachel", "Identity tied to being wanted"],
    journey: [
      { phase: "Calling", description: "Placed in Jacob's life through Laban's deception" },
      { phase: "Testing", description: "Unloved wife competing with the beautiful Rachel" },
      { phase: "Refinement", description: "Named her fourth son Judah—'I will praise the LORD'—shifting from desperation to worship" },
      { phase: "Legacy", description: "Mother of Judah (Messianic line) and Levi (priestly line); buried in the cave of Machpelah with Jacob" }
    ],
    relationships: [
      { name: "Jacob", role: "Husband who did not love her" },
      { name: "Rachel", role: "Sister and rival wife" },
      { name: "Laban", role: "Father who used her as a pawn" },
      { name: "Judah", role: "Son through whom Christ would come" }
    ],
    lessonsAndReflection: [
      "Where are you seeking human love to fill a void only God can fill?",
      "How has being 'unchosen' by people led to being chosen by God?"
    ],
    relatedCharacters: ["jacob", "rachel", "judah"],
    situations: [
      {
        id: "leah-naming-judah",
        title: "Leah Names Judah—From Desperation to Praise",
        category: "Rejection",
        reference: "Genesis 29:31-35",
        keyVerse: "She conceived again, and when she gave birth to a son she said, 'This time I will praise the LORD.' So she named him Judah.",
        situation: "Leah's first three sons were named from pain: 'The LORD has seen my misery,' 'the LORD heard I am not loved,' 'now my husband will become attached to me.' With her fourth son, something shifted.",
        pressure: "Years of being unloved, competing with Rachel, looking to children for validation.",
        innerBattle: "Seeking worth from Jacob vs. finding it in God alone.",
        response: "With Judah, Leah stopped naming from lack and named from praise: 'This time I will praise the LORD.'",
        outcome: "Judah became the tribe through which David and Jesus descended. Leah's shift to worship opened the Messianic line.",
        lesson: "When we stop striving for human approval and turn to praise, God places us in His greatest story.",
        traitRevealed: "Spiritual breakthrough from desperation to worship",
        spiritualPrinciple: "The unloved who find their worth in God inherit the greatest legacies.",
        reflectionQuestions: ["Are you naming your life from pain or from praise?", "What would change if you stopped striving for approval and simply worshipped?"],
        dnaSnapshot: { faith: 4, humility: 4, compassion: 4 }
      }
    ]
  },
  // 32. Rachel
  {
    id: "rachel",
    name: "Rachel",
    meaning: "Ewe / Little Lamb",
    emoji: "💕",
    role: "Jacob's Beloved Wife, Mother of Joseph and Benjamin",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 29-35"],
    archetypes: ["Matriarch", "Tragic Hero"],
    dna: { faith: 3, humility: 2, courage: 3, wisdom: 2, compassion: 3, fear: 3, pride: 3, greed: 2 },
    quickCard: {
      archetype: "Matriarch",
      strength: "Deeply loved by Jacob",
      weakness: "Jealousy, idolatry, and desperate measures for children",
      mindset: "Give me children, or I'll die",
      keyLesson: "Being loved by people does not guarantee contentment; only God satisfies the deepest longing.",
      keyVerse: "Give me children, or I'll die!",
      keyVerseRef: "Genesis 30:1"
    },
    storyArc: "Beautiful and beloved by Jacob, Rachel endured years of barrenness while her sister bore children. She stole her father's household gods, eventually bore Joseph and Benjamin, but died giving birth to Benjamin—the beloved wife who had everything except what she wanted most.",
    therapyView: {
      drivingFears: ["Permanent barrenness", "Leah surpassing her despite being less loved"],
      coreMotivations: ["Motherhood", "Maintaining Jacob's love", "Competing with Leah"],
      relationalStyle: "Emotionally demanding, jealous, desperate for what she lacked",
      blindSpots: ["Had Jacob's love but could not enjoy it because of jealousy over Leah's children", "Stole her father's idols"],
      healingMoments: ["Birth of Joseph—'God has taken away my disgrace'"]
    },
    strengths: ["Deeply loved", "Bore Joseph—one of the greatest figures in Scripture"],
    weaknesses: ["Jealousy", "Idolatry", "Desperation that bordered on manipulation"],
    journey: [
      { phase: "Calling", description: "Beloved wife of Jacob" },
      { phase: "Testing", description: "Years of barrenness while Leah bore sons" },
      { phase: "Refinement", description: "Finally bore Joseph and praised God" },
      { phase: "Legacy", description: "Died giving birth to Benjamin; mourned deeply by Jacob" }
    ],
    relationships: [
      { name: "Jacob", role: "Husband who loved her deeply" },
      { name: "Leah", role: "Sister and rival wife" },
      { name: "Joseph", role: "Firstborn son" },
      { name: "Benjamin", role: "Son whose birth cost her life" },
      { name: "Laban", role: "Father" }
    ],
    lessonsAndReflection: [
      "Can you be content with what God has given while waiting for what He has not?",
      "Does jealousy over others' blessings blind you to your own?"
    ],
    relatedCharacters: ["jacob", "leah", "joseph", "benjamin"],
    situations: [
      {
        id: "rachel-barrenness-jealousy",
        title: "Rachel's Barrenness and Jealousy",
        category: "Waiting",
        reference: "Genesis 30:1-8",
        keyVerse: "Give me children, or I'll die!",
        situation: "Rachel, though deeply loved by Jacob, was barren while Leah bore son after son. Her jealousy became so intense she demanded children from Jacob as if he controlled God's will.",
        pressure: "Cultural shame of barrenness, watching her rival sister succeed where she failed.",
        innerBattle: "Gratitude for Jacob's love vs. consuming jealousy over what she lacked.",
        response: "Rachel demanded children from Jacob, gave her servant as a surrogate, and later bargained for mandrakes.",
        outcome: "God eventually opened her womb and she bore Joseph, but her desperation revealed a heart that could not rest in what she had.",
        lesson: "Having what others want does not prevent jealousy over what they have.",
        traitRevealed: "Jealousy rooted in discontentment",
        spiritualPrinciple: "Contentment is not having everything; it is trusting God with what you lack.",
        reflectionQuestions: ["What blessing are you ignoring because you are fixated on what you lack?", "How does jealousy distort your view of God's goodness?"],
        dnaSnapshot: { faith: 2, pride: 3, fear: 4, compassion: 2 }
      }
    ]
  },
  // 33. Benjamin
  {
    id: "benjamin",
    name: "Benjamin",
    meaning: "Son of the right hand",
    emoji: "🐺",
    role: "Jacob's Youngest Son, Rachel's Last Child",
    era: "Patriarchs",
    testament: "OT",
    keyScriptures: ["Genesis 35:16-20", "Genesis 42-45"],
    archetypes: ["Survivor", "Patriarch"],
    dna: { faith: 3, humility: 4, courage: 3, wisdom: 3, compassion: 3, fear: 3, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Survivor",
      strength: "Beloved by father and brother Joseph alike",
      weakness: "Passive role—swept along by others' plans",
      mindset: "Carried by the love and protection of others",
      keyLesson: "Sometimes God's plan for you unfolds through the love and sacrifice of others.",
      keyVerse: "Benjamin is a ravenous wolf; in the morning he devours the prey, in the evening he divides the plunder.",
      keyVerseRef: "Genesis 49:27"
    },
    storyArc: "Born as Rachel died, Benjamin became Jacob's new favorite and the key to Joseph's test of his brothers in Egypt. His tribe later produced King Saul and the Apostle Paul.",
    therapyView: {
      drivingFears: ["Losing his father's protection", "The unknown dangers of Egypt"],
      coreMotivations: ["Family belonging", "His father's love"],
      relationalStyle: "Dependent, protected, beloved",
      blindSpots: ["Over-protected by Jacob, limiting his independence"],
      healingMoments: ["Joseph's tearful reunion over Benjamin", "Jacob's blessing calling him a 'ravenous wolf'"]
    },
    strengths: ["Catalyst for family reconciliation", "Beloved by both father and Joseph"],
    weaknesses: ["Passive role in his own story", "Over-dependence on family protection"],
    journey: [
      { phase: "Calling", description: "Born as Rachel died; named 'son of my right hand' by Jacob" },
      { phase: "Testing", description: "Taken to Egypt as the key to Joseph's test of the brothers" },
      { phase: "Legacy", description: "His tribe produced Saul and Paul; blessed as a 'ravenous wolf'" }
    ],
    relationships: [
      { name: "Jacob", role: "Father who clung to him after losing Joseph and Rachel" },
      { name: "Joseph", role: "Full brother who wept over him" },
      { name: "Rachel", role: "Mother who died at his birth" }
    ],
    lessonsAndReflection: [
      "How has the love of others shaped your destiny?",
      "Are you passively carried or actively stepping into your calling?"
    ],
    relatedCharacters: ["jacob", "joseph", "rachel", "saul-king", "paul"],
    situations: [
      {
        id: "benjamin-egypt-test",
        title: "Benjamin in Egypt—Joseph's Test",
        category: "Faith Testing",
        reference: "Genesis 43-44",
        situation: "Joseph demanded Benjamin be brought to Egypt, forcing Jacob to release his last connection to Rachel. Benjamin became the pawn in Joseph's test of the brothers' loyalty.",
        pressure: "An unwitting participant in a family drama he did not fully understand; his safety was the test of his brothers' character.",
        innerBattle: "Trust in his brothers vs. fear of the unknown Egyptian ruler.",
        response: "Benjamin went to Egypt as instructed and unknowingly became the catalyst for the family's reconciliation.",
        outcome: "Joseph revealed himself, the family was reunited, and Judah's willingness to die for Benjamin proved the brothers had changed.",
        lesson: "Sometimes we play a crucial role in God's plan simply by being present and trusting.",
        traitRevealed: "Trusting presence",
        spiritualPrinciple: "God uses our vulnerability to test and redeem the people around us.",
        reflectionQuestions: ["Where has your presence, not your action, been the catalyst for change?", "Can you trust God when you are the one being tested through others?"],
        dnaSnapshot: { faith: 3, humility: 4, courage: 3 }
      }
    ]
  },
  // 34. Miriam
  {
    id: "miriam",
    name: "Miriam",
    meaning: "Bitter sea / Wished-for child",
    emoji: "🎵",
    role: "Prophetess, Moses' Sister",
    era: "Exodus",
    testament: "OT",
    keyScriptures: ["Exodus 2:1-10", "Exodus 15:20-21", "Numbers 12"],
    archetypes: ["Prophet", "Servant"],
    dna: { faith: 4, humility: 3, courage: 5, wisdom: 3, compassion: 4, fear: 2, pride: 3, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Courageous leadership and prophetic worship",
      weakness: "Jealousy of Moses' unique position",
      mindset: "I have a voice too—has God only spoken through Moses?",
      keyLesson: "Comparing your calling to someone else's leads to correction, not promotion.",
      keyVerse: "Has the LORD spoken only through Moses? Hasn't he also spoken through us?",
      keyVerseRef: "Numbers 12:2"
    },
    storyArc: "As a girl, Miriam boldly watched over baby Moses in the Nile and arranged for his mother to nurse him. She led Israel's women in worship after the Red Sea crossing. But jealousy of Moses led to leprosy and God's public rebuke.",
    therapyView: {
      drivingFears: ["Being overshadowed by Moses", "Her voice not being valued"],
      coreMotivations: ["Recognition of her prophetic gifts", "Family leadership role", "Worship"],
      relationalStyle: "Bold, protective, but competitive with siblings",
      blindSpots: ["Believed her calling was equal to Moses' unique role", "Racial criticism of Moses' wife masked deeper jealousy"],
      healingMoments: ["Leading worship at the Red Sea", "Restoration after leprosy through Moses' intercession"]
    },
    strengths: ["Courageous from childhood", "Prophetic worship leader", "Protective of family"],
    weaknesses: ["Jealousy of Moses", "Pride in her own calling", "Possibly racially critical of Zipporah"],
    journey: [
      { phase: "Calling", description: "Watched over Moses in the Nile as a brave young girl" },
      { phase: "Testing", description: "Led women in worship after the Red Sea—established as prophetess" },
      { phase: "Failure", description: "Challenged Moses' unique authority; struck with leprosy" },
      { phase: "Legacy", description: "Restored by God after Moses' intercession; honored as one of Israel's three leaders" }
    ],
    relationships: [
      { name: "Moses", role: "Brother she protected and later envied" },
      { name: "Aaron", role: "Brother and co-conspirator in challenging Moses" }
    ],
    lessonsAndReflection: [
      "Where does jealousy of someone else's calling distort your own?",
      "Can you celebrate another's unique role without diminishing your own?"
    ],
    relatedCharacters: ["moses", "aaron"],
    situations: [
      {
        id: "miriam-challenges-moses",
        title: "Miriam Challenges Moses' Authority",
        category: "Conflict",
        reference: "Numbers 12:1-15",
        keyVerse: "Has the LORD spoken only through Moses?",
        situation: "Miriam and Aaron challenged Moses' unique relationship with God, using his Cushite wife as a pretext. The real issue was jealousy over his authority.",
        pressure: "Feeling undervalued despite being a prophetess; sibling rivalry in leadership.",
        innerBattle: "Legitimate desire for recognition vs. rebellion against God's chosen order of authority.",
        response: "Miriam led the challenge (she is named first and was the one punished), questioning Moses' unique status.",
        outcome: "God appeared, affirmed Moses' unique role, and struck Miriam with leprosy for seven days. Moses interceded for her healing.",
        lesson: "God assigns different roles and measures of authority; challenging His order invites correction.",
        traitRevealed: "Jealousy masked as legitimate concern",
        spiritualPrinciple: "Comparing your calling to another's distorts both.",
        reflectionQuestions: ["Where is jealousy disguising itself as a legitimate grievance in your life?", "Can you intercede for someone who has wronged your position?"],
        dnaSnapshot: { pride: 4, courage: 4, faith: 3, humility: 2 }
      }
    ]
  },
  // 35. Caleb
  {
    id: "caleb",
    name: "Caleb",
    meaning: "Dog / Wholehearted",
    emoji: "🗻",
    role: "Faithful Spy, Warrior of Judah",
    era: "Conquest",
    testament: "OT",
    keyScriptures: ["Numbers 13-14", "Joshua 14:6-15", "Joshua 15:13-19"],
    archetypes: ["Warrior", "Servant"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 3, fear: 0, pride: 1, greed: 0 },
    quickCard: {
      archetype: "Warrior",
      strength: "Wholehearted faith that outlasted an entire generation",
      weakness: "None prominently recorded",
      mindset: "Give me this mountain!",
      keyLesson: "Wholehearted faith does not diminish with age—it claims bigger mountains.",
      keyVerse: "But my servant Caleb, because he has a different spirit in him and has followed Me fully, I will bring into the land.",
      keyVerseRef: "Numbers 14:24"
    },
    storyArc: "One of only two faithful spies who trusted God's promise, Caleb waited 45 years through wilderness wandering, and at age 85 asked for the most fortified hill country as his inheritance—and took it.",
    therapyView: {
      drivingFears: ["None recorded—fear seems absent from his character"],
      coreMotivations: ["Following God fully", "Claiming every promise", "Leaving a legacy of faith"],
      relationalStyle: "Bold, encouraging, inspires others by example",
      blindSpots: ["His boldness could seem reckless to others"],
      healingMoments: ["God's personal commendation for having a 'different spirit'", "Receiving Hebron at 85"]
    },
    strengths: ["Wholehearted faith", "Physical endurance", "Patience through decades of waiting", "Bold in old age"],
    weaknesses: ["None prominently recorded in Scripture"],
    journey: [
      { phase: "Calling", description: "Sent as one of twelve spies into Canaan" },
      { phase: "Testing", description: "Stood against ten fearful spies with Joshua, nearly stoned by the people" },
      { phase: "Refinement", description: "Waited 45 years in the wilderness for the promise" },
      { phase: "Legacy", description: "At 85, took the fortified hill country and drove out the giants" }
    ],
    relationships: [
      { name: "Joshua", role: "Fellow faithful spy and leader" },
      { name: "Moses", role: "Leader who blessed his faithfulness" }
    ],
    lessonsAndReflection: [
      "What mountain is God calling you to claim, even in a later season of life?",
      "Has long waiting diminished your faith or deepened it?"
    ],
    relatedCharacters: ["joshua", "moses"],
    situations: [
      {
        id: "caleb-give-me-this-mountain",
        title: "Caleb Claims His Mountain at 85",
        category: "Faith Testing",
        reference: "Joshua 14:6-15",
        keyVerse: "Now give me this hill country that the LORD promised me that day.",
        situation: "After 45 years of waiting—40 in the wilderness and 5 in conquest—85-year-old Caleb asked Joshua for the most difficult territory: the fortified hill country where the giants lived.",
        pressure: "Age, the option to rest, fortified cities, and giants in the land.",
        innerBattle: "Settling for an easier inheritance vs. claiming the hardest territory because God promised it.",
        response: "Caleb declared he was as strong as the day Moses sent him and asked for the mountain with the giants.",
        outcome: "Caleb drove out the three sons of Anak and possessed Hebron, which became a city of refuge.",
        lesson: "Faith that has waited decades claims bigger mountains, not smaller ones.",
        traitRevealed: "Undying, aggressive faith",
        spiritualPrinciple: "God's promises do not expire; neither should our faith in claiming them.",
        reflectionQuestions: ["What promise have you stopped believing because of time?", "Are you settling for easy territory when God promised you the mountain?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 36. Balaam
  {
    id: "balaam",
    name: "Balaam",
    meaning: "Devourer of the people",
    emoji: "🐴",
    role: "Prophet for Hire",
    era: "Conquest",
    testament: "OT",
    keyScriptures: ["Numbers 22-24", "Numbers 31:16", "2 Peter 2:15", "Revelation 2:14"],
    archetypes: ["Prophet", "Manipulator"],
    dna: { faith: 2, humility: 1, courage: 2, wisdom: 3, compassion: 1, fear: 3, pride: 4, greed: 5 },
    quickCard: {
      archetype: "Manipulator",
      strength: "Genuine prophetic gifting",
      weakness: "Sold his gift for profit and led Israel into sin",
      mindset: "How can I serve God and still get paid by His enemies?",
      keyLesson: "A genuine gift operated by a corrupt heart does immeasurable damage.",
      keyVerse: "They have rushed for profit into Balaam's error.",
      keyVerseRef: "Jude 1:11"
    },
    storyArc: "A genuine prophet hired by Balak to curse Israel. God prevented him from cursing, but Balaam later taught Balak to seduce Israel through Moabite women and idolatry—destroying through seduction what he could not destroy through cursing.",
    therapyView: {
      drivingFears: ["Missing the payday", "Offending God enough to lose his power"],
      coreMotivations: ["Financial reward", "Prestige", "Playing both sides"],
      relationalStyle: "Transactional, willing to serve the highest bidder",
      blindSpots: ["Thought he could serve God and mammon simultaneously", "His donkey had more spiritual discernment"],
      healingMoments: ["None—he died in battle against Israel"]
    },
    strengths: ["Genuine prophetic ability", "Accurate oracles about Israel"],
    weaknesses: ["Greed", "Willingness to corrupt others for money", "Moral duplicity"],
    journey: [
      { phase: "Calling", description: "Genuine prophet with real access to God's voice" },
      { phase: "Failure", description: "Tried to curse Israel for money; his donkey rebuked him" },
      { phase: "Legacy", description: "Taught Balak to seduce Israel through immorality; killed in Israel's battle against Midian" }
    ],
    relationships: [
      { name: "Balak", role: "Moabite king who hired him" },
      { name: "His Donkey", role: "Animal with more discernment than the prophet" }
    ],
    lessonsAndReflection: [
      "Where are you using God's gifts for personal profit?",
      "Can you serve God while seeking rewards from His enemies?"
    ],
    relatedCharacters: ["moses", "joshua"],
    situations: [
      {
        id: "balaam-donkey",
        title: "Balaam and the Talking Donkey",
        category: "Correction",
        reference: "Numbers 22:21-35",
        keyVerse: "Am I not your donkey, which you have ridden all your life?",
        situation: "On his way to curse Israel, God sent an angel with a sword to block the road. Balaam's donkey saw the angel and refused to move; Balaam beat the donkey until God opened the donkey's mouth.",
        pressure: "Balak's money was waiting; Balaam had technically received God's permission but was going with wrong motives.",
        innerBattle: "Greed vs. God's clear opposition; the humiliation of being corrected by an animal.",
        response: "Balaam could not see what his donkey saw. After the donkey spoke and his eyes were opened, he offered to turn back—but God sent him forward to bless, not curse.",
        outcome: "Balaam blessed Israel four times instead of cursing them, but later found a way around God's protection by advising seduction.",
        lesson: "God will use anything—even a donkey—to stop a prophet headed in the wrong direction.",
        traitRevealed: "Spiritual blindness caused by greed",
        spiritualPrinciple: "When your donkey has more discernment than you, check your motives.",
        reflectionQuestions: ["What unlikely voice has God used to correct you?", "Where is greed blinding you to spiritual danger?"],
        dnaSnapshot: { greed: 5, pride: 4, faith: 2, wisdom: 2 }
      }
    ]
  },
  // 37. Naaman
  {
    id: "naaman",
    name: "Naaman",
    meaning: "Pleasantness",
    emoji: "🏊",
    role: "Syrian General Healed of Leprosy",
    era: "Divided Kingdom",
    testament: "OT",
    keyScriptures: ["2 Kings 5"],
    archetypes: ["Warrior", "Seeker"],
    dna: { faith: 3, humility: 2, courage: 4, wisdom: 3, compassion: 2, fear: 3, pride: 4, greed: 1 },
    quickCard: {
      archetype: "Warrior",
      strength: "Willingness to humble himself once convinced",
      weakness: "Pride that nearly cost him his healing",
      mindset: "I expected something more dramatic",
      keyLesson: "God's solution often offends our pride before it heals our brokenness.",
      keyVerse: "Are not Abana and Pharpar, the rivers of Damascus, better than all the waters of Israel?",
      keyVerseRef: "2 Kings 5:12"
    },
    storyArc: "A powerful Syrian general with leprosy who traveled to Israel for healing. He nearly walked away in rage when Elisha told him to dip seven times in the muddy Jordan, but his servants convinced him to obey, and he was healed completely.",
    therapyView: {
      drivingFears: ["Progressive disease and death", "Public humiliation before his troops"],
      coreMotivations: ["Healing", "Maintaining dignity", "Military reputation"],
      relationalStyle: "Commanding, expects deference, but listens to trusted servants",
      blindSpots: ["Expected God to work in a way that matched his status", "Almost rejected healing because the method was beneath him"],
      healingMoments: ["Servants' gentle rebuke changed his mind", "Emerging from the Jordan clean", "Declaring allegiance to Israel's God"]
    },
    strengths: ["Military excellence", "Willingness to listen to servants", "Genuine conversion"],
    weaknesses: ["Pride", "Rage when expectations were unmet", "Initial refusal to obey"],
    journey: [
      { phase: "Calling", description: "A servant girl told his wife about Elisha's healing power" },
      { phase: "Resistance", description: "Furious that Elisha told him to wash in the Jordan instead of performing a dramatic healing" },
      { phase: "Refinement", description: "Listened to his servants, obeyed, and was healed completely" },
      { phase: "Legacy", description: "Declared there is no God in all the earth except in Israel" }
    ],
    relationships: [
      { name: "Elisha", role: "Prophet who healed him" },
      { name: "Servant Girl", role: "Captured Israelite who pointed him to God" },
      { name: "His Servants", role: "Wise counselors who convinced him to obey" },
      { name: "Gehazi", role: "Elisha's servant who greedily pursued payment" }
    ],
    lessonsAndReflection: [
      "Where has your pride nearly caused you to miss God's provision?",
      "Are you willing to obey God's simple commands, or do you demand something more impressive?"
    ],
    relatedCharacters: ["elisha", "gehazi"],
    situations: [
      {
        id: "naaman-jordan",
        title: "Naaman Dips in the Jordan",
        category: "Obedience",
        reference: "2 Kings 5:9-14",
        keyVerse: "Go, wash yourself seven times in the Jordan, and your flesh will be restored.",
        situation: "Naaman arrived with a military entourage and gifts. Elisha did not even come out—he sent a messenger telling Naaman to wash seven times in the Jordan.",
        pressure: "A commanding general told to bathe in a muddy river by a prophet who would not even greet him personally.",
        innerBattle: "Pride and military dignity vs. desperation for healing; expectation of spectacle vs. simple obedience.",
        response: "After initial rage, Naaman's servants gently reasoned with him. He humbled himself, dipped seven times, and was healed.",
        outcome: "His skin became like a young boy's. He declared faith in Israel's God and took Israelite soil home to worship on.",
        lesson: "God's healing often requires us to do the thing that offends our pride the most.",
        traitRevealed: "Pride overcome by desperation and wise counsel",
        spiritualPrinciple: "Simple obedience to God's word is more powerful than impressive human effort.",
        reflectionQuestions: ["What simple instruction from God are you resisting because it feels beneath you?", "Who are the 'servants' in your life whose wise counsel you should heed?"],
        dnaSnapshot: { pride: 3, humility: 3, faith: 4, courage: 3 }
      }
    ]
  },
  // 38. Mordecai
  {
    id: "mordecai",
    name: "Mordecai",
    meaning: "Servant of Marduk (ironic—faithful to Yahweh)",
    emoji: "🚪",
    role: "Esther's Guardian, Jewish Leader",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Esther 2-10"],
    archetypes: ["Strategist", "Servant"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 4, fear: 1, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Strategist",
      strength: "Strategic thinking and uncompromising faith",
      weakness: "His refusal to bow may have endangered his entire people",
      mindset: "Who knows but that you have come to royal position for such a time as this?",
      keyLesson: "Strategic positioning combined with unwavering faith saves nations.",
      keyVerse: "Who knows but that you have come to your royal position for such a time as this?",
      keyVerseRef: "Esther 4:14"
    },
    storyArc: "A Jewish exile who raised Esther, refused to bow to Haman, foiled an assassination plot, coached Esther to approach the king, and was ultimately elevated to second in command of the Persian Empire.",
    therapyView: {
      drivingFears: ["Genocide of his people", "Esther failing to act"],
      coreMotivations: ["Jewish survival", "God's honor", "Strategic stewardship"],
      relationalStyle: "Mentoring, strategic, willing to push others toward their calling",
      blindSpots: ["His principled stand triggered a genocide plot—though God used it for deliverance"],
      healingMoments: ["Honored by the king on Haman's horse", "Esther's success", "Purim established"]
    },
    strengths: ["Strategic brilliance", "Uncompromising convictions", "Mentoring Esther", "Patience"],
    weaknesses: ["His stand endangered others before God delivered them"],
    journey: [
      { phase: "Calling", description: "Raised Esther and positioned her in the palace" },
      { phase: "Testing", description: "Refused to bow to Haman, triggering a genocidal decree" },
      { phase: "Legacy", description: "Elevated to second in command; established Purim" }
    ],
    relationships: [
      { name: "Esther", role: "Adopted daughter / cousin he raised" },
      { name: "Haman", role: "Enemy who plotted genocide" },
      { name: "King Ahasuerus", role: "Persian king he served" }
    ],
    lessonsAndReflection: [
      "Are you positioning others for their divine purpose?",
      "When does principled resistance require strategic wisdom?"
    ],
    relatedCharacters: ["esther", "haman"],
    situations: [
      {
        id: "mordecai-refuses-bow",
        title: "Mordecai Refuses to Bow to Haman",
        category: "Persecution",
        reference: "Esther 3:1-6",
        situation: "When the king elevated Haman, all officials bowed. Mordecai alone refused, identifying himself as a Jew whose worship belonged to God alone.",
        pressure: "Defying a royal command with death as the likely consequence; risking his community's safety.",
        innerBattle: "Self-preservation vs. covenant faithfulness; personal safety vs. uncompromising worship.",
        response: "Mordecai refused daily, openly identifying as a Jew, triggering Haman's rage against all Jews.",
        outcome: "Haman plotted genocide, but God turned it into the deliverance of the Jewish people.",
        lesson: "Principled stands may trigger opposition, but God uses resistance as the catalyst for deliverance.",
        traitRevealed: "Uncompromising conviction",
        spiritualPrinciple: "What looks like provocation to the enemy is faithfulness to God.",
        reflectionQuestions: ["Where is your refusal to compromise provoking opposition?", "Do you trust God with the consequences of your convictions?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 39. Haman
  {
    id: "haman",
    name: "Haman",
    meaning: "Magnificent (self-given)",
    emoji: "🪢",
    role: "Enemy of the Jews, Persian Official",
    era: "Post-Exile",
    testament: "OT",
    keyScriptures: ["Esther 3-7"],
    archetypes: ["Oppressor", "Manipulator"],
    dna: { faith: 0, humility: 0, courage: 2, wisdom: 2, compassion: 0, fear: 3, pride: 5, greed: 5 },
    quickCard: {
      archetype: "Oppressor",
      strength: "Political cunning and ambitious scheming",
      weakness: "Consumed by rage over one man's refusal to bow",
      mindset: "If one person defies me, everyone must pay",
      keyLesson: "Pride builds gallows for others that it ends up hanging on itself.",
      keyVerse: "So they impaled Haman on the pole he had set up for Mordecai.",
      keyVerseRef: "Esther 7:10"
    },
    storyArc: "Elevated to the highest position in Persia, Haman was consumed with rage because one Jew would not bow to him. He plotted genocide against all Jews but was exposed by Esther and hung on the very gallows he built for Mordecai.",
    therapyView: {
      drivingFears: ["Being disrespected", "Losing face before the court"],
      coreMotivations: ["Total adoration", "Destroying anyone who threatens his ego", "Power"],
      relationalStyle: "Narcissistic, requires constant validation, disproportionate in revenge",
      blindSpots: ["One man's refusal undid all his honor", "Could not enjoy what he had because of what he lacked"],
      healingMoments: ["None—his pride consumed him entirely"]
    },
    strengths: ["Political maneuvering", "Ability to influence the king"],
    weaknesses: ["Narcissistic rage", "Genocidal cruelty", "Pride that blinded him to his own downfall"],
    journey: [
      { phase: "Calling", description: "Elevated to second in command of Persia" },
      { phase: "Failure", description: "Plotted genocide over one man's refusal to bow" },
      { phase: "Legacy", description: "Hung on his own gallows; his plot became Israel's deliverance festival" }
    ],
    relationships: [
      { name: "Mordecai", role: "The Jew who would not bow" },
      { name: "Esther", role: "Queen who exposed him" },
      { name: "King Ahasuerus", role: "King he manipulated" },
      { name: "Zeresh", role: "Wife who advised building the gallows" }
    ],
    lessonsAndReflection: [
      "Where is wounded pride driving disproportionate responses in your life?",
      "Are you building gallows that will ultimately trap you?"
    ],
    relatedCharacters: ["mordecai", "esther"],
    situations: [
      {
        id: "haman-gallows",
        title: "Haman Builds Gallows for Mordecai",
        category: "Betrayal",
        reference: "Esther 5:9-14; 7:9-10",
        situation: "Despite honor, wealth, and the queen's personal invitation, Haman declared it all meant nothing as long as Mordecai sat at the gate refusing to bow. His wife suggested building a 75-foot gallows.",
        pressure: "Narcissistic injury from one person's defiance overshadowed every other blessing.",
        innerBattle: "None apparent—Haman felt entirely justified in his murderous rage.",
        response: "Haman built the gallows for Mordecai, only to discover the king wanted to honor Mordecai and Esther was Jewish.",
        outcome: "The king ordered Haman hung on his own gallows. His entire plot reversed.",
        lesson: "The traps we set for others in our pride become the instruments of our own destruction.",
        traitRevealed: "Self-destructive narcissistic rage",
        spiritualPrinciple: "God turns the schemes of the proud into the deliverance of the oppressed.",
        reflectionQuestions: ["What 'gallows' have you built in anger that could destroy you instead?", "Can you see how your wounded pride is blinding you to danger?"],
        dnaSnapshot: { pride: 5, greed: 5, compassion: 0, wisdom: 1 }
      }
    ]
  },
  // 40. Nebuchadnezzar
  {
    id: "nebuchadnezzar",
    name: "Nebuchadnezzar",
    meaning: "Nebo, protect the crown",
    emoji: "🏛️",
    role: "King of Babylon",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["2 Kings 24-25", "Daniel 1-4"],
    archetypes: ["King", "Oppressor"],
    dna: { faith: 2, humility: 1, courage: 4, wisdom: 3, compassion: 1, fear: 2, pride: 5, greed: 4 },
    quickCard: {
      archetype: "King",
      strength: "Empire-building genius, eventually humbled to acknowledge God",
      weakness: "Absolute pride—'Is not this the great Babylon I have built?'",
      mindset: "I am the greatest king on earth",
      keyLesson: "God humbles the proud until they acknowledge that heaven rules.",
      keyVerse: "Those who walk in pride he is able to humble.",
      keyVerseRef: "Daniel 4:37"
    },
    storyArc: "The most powerful king on earth conquered Jerusalem and exiled Judah. God gave him dreams interpreted by Daniel, he built a golden image and threw dissenters into a furnace, and was finally humbled to madness—living as an animal until he acknowledged God's sovereignty.",
    therapyView: {
      drivingFears: ["Loss of empire", "Supernatural powers beyond his control"],
      coreMotivations: ["Absolute power", "Monumental legacy", "Divine status"],
      relationalStyle: "Totalitarian, demanding absolute loyalty, but capable of admiration for the brave",
      blindSpots: ["Believed his accomplishments were entirely his own", "Ignored Daniel's warning for a year"],
      healingMoments: ["Seeing the fourth man in the furnace", "Sanity restored after madness", "Final declaration praising God"]
    },
    strengths: ["Military and administrative genius", "Capable of wonder before God", "Eventually humbled"],
    weaknesses: ["Absolute pride", "Cruelty", "Idolatry", "Totalitarian control"],
    journey: [
      { phase: "Calling", description: "God called him 'My servant' and used him to judge Judah" },
      { phase: "Testing", description: "Encountered God through Daniel's interpretations and the fiery furnace" },
      { phase: "Failure", description: "Boasted on the roof of his palace; struck with madness" },
      { phase: "Refinement", description: "Lived as an animal for seven years until he looked up and acknowledged God" },
      { phase: "Legacy", description: "Declared God's kingdom eternal and praised the Most High" }
    ],
    relationships: [
      { name: "Daniel", role: "Jewish exile and trusted advisor" },
      { name: "Shadrach, Meshach, Abednego", role: "Jews who defied him and survived the furnace" }
    ],
    lessonsAndReflection: [
      "What would it take for God to humble you?",
      "Where are you taking credit for what God has built?"
    ],
    relatedCharacters: ["daniel", "shadrach-meshach-abednego"],
    situations: [
      {
        id: "nebuchadnezzar-humbled",
        title: "Nebuchadnezzar Humbled to Madness",
        category: "Correction",
        reference: "Daniel 4:28-37",
        keyVerse: "Is not this the great Babylon I have built as the royal residence, by my mighty power and for the glory of my majesty?",
        situation: "One year after Daniel's warning, Nebuchadnezzar walked on his palace roof and boasted about his achievements. The words were still on his lips when God struck him.",
        pressure: "Ruling the greatest empire on earth with no human equal—surrounded by sycophants.",
        innerBattle: "Acknowledging God's sovereignty vs. taking credit for everything he had built.",
        response: "Nebuchadnezzar boasted, and immediately a voice from heaven decreed his kingdom was taken from him.",
        outcome: "He lived as an animal for seven years until he raised his eyes to heaven and praised God. His kingdom was restored.",
        lesson: "God can reduce the most powerful person on earth to an animal to teach one lesson: heaven rules.",
        traitRevealed: "Pride broken by divine humiliation",
        spiritualPrinciple: "God will go to extreme lengths to break pride because pride is the root of all separation from Him.",
        reflectionQuestions: ["What achievement are you dangerously proud of?", "Would you rather humble yourself now or let God do it?"],
        dnaSnapshot: { pride: 5, humility: 1, faith: 2 }
      }
    ]
  },
  // 41. Shadrach, Meshach, and Abednego
  {
    id: "shadrach-meshach-abednego",
    name: "Shadrach, Meshach & Abednego",
    meaning: "Command of Aku / Who is what Aku is? / Servant of Nebo (Babylonian names given to Hananiah, Mishael, Azariah)",
    emoji: "🔥",
    role: "Jewish Exiles, Faithful in the Furnace",
    era: "Exile",
    testament: "OT",
    keyScriptures: ["Daniel 1", "Daniel 3"],
    archetypes: ["Martyr", "Servant"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 4, compassion: 3, fear: 0, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Martyr",
      strength: "Absolute refusal to compromise worship, even facing death",
      weakness: "None prominently recorded",
      mindset: "Our God is able—but even if He does not, we will not bow",
      keyLesson: "Faith is not certainty that God will rescue; it is resolve to obey regardless.",
      keyVerse: "If we are thrown into the blazing furnace, the God we serve is able to deliver us... But even if he does not, we will not serve your gods.",
      keyVerseRef: "Daniel 3:17-18"
    },
    storyArc: "Three Jewish youths in Babylon who refused to eat the king's food, rose to positions of influence, and when commanded to bow to a golden image, chose the furnace. God sent a fourth figure to walk with them in the fire, and they emerged without even the smell of smoke.",
    therapyView: {
      drivingFears: ["Dishonoring God through compromise"],
      coreMotivations: ["Loyalty to God above survival", "Witness to pagan rulers", "Covenant identity"],
      relationalStyle: "United, encouraging each other, loyal to their community",
      blindSpots: ["None prominently recorded"],
      healingMoments: ["Walking with the fourth man in the fire", "Nebuchadnezzar's decree honoring their God", "Promotion after the furnace"]
    },
    strengths: ["Unshakeable faith", "Unity in conviction", "Courage before a tyrant", "Integrity in exile"],
    weaknesses: ["None prominently recorded"],
    journey: [
      { phase: "Calling", description: "Chose to honor God with their diet in Babylon" },
      { phase: "Testing", description: "Refused to bow to Nebuchadnezzar's golden image, facing a furnace heated seven times hotter" },
      { phase: "Legacy", description: "Walked unharmed in the fire with a divine companion; promoted by the king" }
    ],
    relationships: [
      { name: "Daniel", role: "Fellow exile and friend" },
      { name: "Nebuchadnezzar", role: "King who threatened and then honored them" }
    ],
    lessonsAndReflection: [
      "Can you say 'even if He does not' and still refuse to compromise?",
      "Where is God walking with you in the fire right now?"
    ],
    relatedCharacters: ["daniel", "nebuchadnezzar"],
    situations: [
      {
        id: "three-hebrews-furnace",
        title: "The Fiery Furnace",
        category: "Persecution",
        reference: "Daniel 3:1-30",
        keyVerse: "But even if he does not, we want you to know, Your Majesty, that we will not serve your gods.",
        situation: "Nebuchadnezzar built a 90-foot golden image and commanded all officials to bow at the sound of music, on penalty of being thrown into a blazing furnace.",
        pressure: "Certain death by fire for disobedience; their peers all bowed; they were foreigners with no political protection.",
        innerBattle: "The temptation to rationalize—just a symbolic gesture, survival, pragmatism—vs. absolute covenant loyalty.",
        response: "They refused to bow and told the king their God was able to deliver them, but even if He did not, they would not worship the image.",
        outcome: "Thrown into a furnace heated seven times hotter, they walked unbound with a fourth figure. They emerged without burns or even the smell of smoke.",
        lesson: "The 'even if He does not' faith is the highest expression of trust—obedience that does not depend on deliverance.",
        traitRevealed: "Unconditional faith regardless of outcome",
        spiritualPrinciple: "God's presence in the fire is more valuable than escape from it.",
        reflectionQuestions: ["Can you obey God without a guaranteed rescue?", "Where do you need 'even if He does not' faith?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 5, fear: 0 }
      }
    ]
  },
  // 42. Barnabas
  {
    id: "barnabas",
    name: "Barnabas",
    meaning: "Son of Encouragement",
    emoji: "🤝",
    role: "Apostle, Encourager, Missionary",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 4:36-37", "Acts 9:26-27", "Acts 11:22-26", "Acts 13-15"],
    archetypes: ["Missionary", "Servant"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 4, compassion: 5, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Servant",
      strength: "Seeing potential in people others rejected",
      weakness: "Conflict with Paul over John Mark created a rift",
      mindset: "Everyone deserves a second chance",
      keyLesson: "Encouragement is a spiritual gift that builds the church from the inside out.",
      keyVerse: "When he arrived and saw what the grace of God had done, he was glad and encouraged them all.",
      keyVerseRef: "Acts 11:23"
    },
    storyArc: "A Levite from Cyprus who sold his field for the church, vouched for the converted persecutor Saul when no one else would, mentored Paul, and later split with Paul over giving John Mark a second chance—and was vindicated when Mark became useful to Paul.",
    therapyView: {
      drivingFears: ["People being written off before they have a chance"],
      coreMotivations: ["Seeing potential in the rejected", "Building bridges", "Generosity"],
      relationalStyle: "Warm, advocating, bridge-builder between suspicious parties",
      blindSpots: ["His grace could be seen as enabling—the Paul/Mark dispute was real"],
      healingMoments: ["Vouching for Paul", "Nurturing the Antioch church", "Mark's eventual vindication"]
    },
    strengths: ["Encouragement", "Generosity", "Bridge-building", "Seeing potential", "Mentoring"],
    weaknesses: ["Sharp disagreement with Paul", "His grace could be perceived as naivete"],
    journey: [
      { phase: "Calling", description: "Sold his field and laid the money at the apostles' feet" },
      { phase: "Testing", description: "Vouched for Saul/Paul when the church was afraid of him" },
      { phase: "Refinement", description: "Split with Paul over John Mark—stood for second chances" },
      { phase: "Legacy", description: "Mark was later called 'useful' by Paul; Barnabas was vindicated" }
    ],
    relationships: [
      { name: "Paul", role: "Ministry partner who later disagreed with him" },
      { name: "John Mark", role: "Young man he gave a second chance" },
      { name: "The Apostles", role: "Community he served" }
    ],
    lessonsAndReflection: [
      "Who has everyone else given up on that God is calling you to invest in?",
      "Is your encouragement building people up or enabling avoidance?"
    ],
    relatedCharacters: ["paul", "john-mark", "peter"],
    situations: [
      {
        id: "barnabas-vouches-paul",
        title: "Barnabas Vouches for Paul",
        category: "Faith Testing",
        reference: "Acts 9:26-28",
        situation: "After his conversion, Saul/Paul tried to join the disciples in Jerusalem, but they were all afraid of him—believing it was a trick by the man who had been hunting them.",
        pressure: "Staking his own reputation on a former persecutor; if Paul was lying, Barnabas would be responsible.",
        innerBattle: "Caution vs. grace; the safety of the community vs. the transformation he discerned in Paul.",
        response: "Barnabas took Paul to the apostles, personally vouched for his conversion, and described his bold preaching in Damascus.",
        outcome: "Paul was accepted into the fellowship and eventually became the greatest apostle to the Gentiles.",
        lesson: "One person's willingness to vouch for the unlikely can change the course of history.",
        traitRevealed: "Bridge-building faith that sees potential",
        spiritualPrinciple: "The body of Christ grows when someone risks believing in a changed life.",
        reflectionQuestions: ["Who needs you to vouch for them right now?", "Are you willing to risk your reputation on someone's transformation?"],
        dnaSnapshot: { compassion: 5, faith: 5, courage: 4 }
      }
    ]
  },
  // 43. Timothy
  {
    id: "timothy",
    name: "Timothy",
    meaning: "Honoring God",
    emoji: "📝",
    role: "Paul's Spiritual Son, Pastor of Ephesus",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 16:1-3", "1 Timothy", "2 Timothy", "Philippians 2:19-22"],
    archetypes: ["Servant", "Missionary"],
    dna: { faith: 4, humility: 5, courage: 3, wisdom: 4, compassion: 4, fear: 3, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Servant",
      strength: "Teachable spirit and genuine pastoral care",
      weakness: "Timidity and recurring fear",
      mindset: "Faithful in the calling despite fear",
      keyLesson: "God does not give a spirit of timidity but of power, love, and self-discipline.",
      keyVerse: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
      keyVerseRef: "2 Timothy 1:7"
    },
    storyArc: "A young man of mixed Jewish-Greek heritage mentored by Paul from youth, Timothy became pastor of the challenging Ephesus church. Paul's letters to him reveal a gifted but timid leader urged to fan into flame the gift within him.",
    therapyView: {
      drivingFears: ["Inadequacy for the task", "Being despised for his youth", "Confrontation"],
      coreMotivations: ["Pleasing Paul and God", "Faithful ministry", "Caring for the churches"],
      relationalStyle: "Genuine, caring, but prone to shrinking back in confrontation",
      blindSpots: ["Timidity could be mistaken for humility", "Needed constant encouragement from Paul"],
      healingMoments: ["Paul's personal commissioning", "Letters of encouragement from Paul", "Growing into leadership at Ephesus"]
    },
    strengths: ["Teachability", "Genuine pastoral care", "Faithfulness", "Humility"],
    weaknesses: ["Timidity", "Stomach ailments from stress", "Youth and inexperience", "Fear of confrontation"],
    journey: [
      { phase: "Calling", description: "Chosen by Paul as a ministry partner; faith rooted in grandmother Lois and mother Eunice" },
      { phase: "Testing", description: "Sent to difficult churches to represent Paul" },
      { phase: "Refinement", description: "Urged by Paul to overcome timidity and guard sound doctrine" },
      { phase: "Legacy", description: "Pastor of Ephesus; recipient of Paul's final letter before martyrdom" }
    ],
    relationships: [
      { name: "Paul", role: "Spiritual father and mentor" },
      { name: "Lois", role: "Grandmother who planted faith" },
      { name: "Eunice", role: "Mother who nurtured faith" }
    ],
    lessonsAndReflection: [
      "Where is timidity holding you back from your calling?",
      "Who is your 'Paul'—the mentor speaking courage into your fear?"
    ],
    relatedCharacters: ["paul", "barnabas", "silas"],
    situations: [
      {
        id: "timothy-fan-into-flame",
        title: "Timothy Urged to Fan the Gift into Flame",
        category: "Calling",
        reference: "2 Timothy 1:6-7",
        keyVerse: "Fan into flame the gift of God, which is in you through the laying on of my hands.",
        situation: "Paul, writing from prison facing execution, urged Timothy not to let his gift lie dormant but to actively stir it up despite fear and opposition in Ephesus.",
        pressure: "Leading a contentious church, false teachers, Paul's absence and impending death, Timothy's natural timidity.",
        innerBattle: "Shrinking back from difficulty vs. stepping into the fullness of his calling.",
        response: "Timothy was called to remember his heritage of faith, reject the spirit of timidity, and embrace power, love, and self-discipline.",
        outcome: "Timothy continued as the pastor of Ephesus and became one of the early church's key leaders.",
        lesson: "Spiritual gifts require active cultivation; they can cool if not fanned into flame.",
        traitRevealed: "Potential held back by timidity, released by mentoring",
        spiritualPrinciple: "God gives the gift; we must fan the flame. Fear is not from God.",
        reflectionQuestions: ["What gift in you has cooled because of fear?", "Who is encouraging you to fan it into flame?"],
        dnaSnapshot: { faith: 4, humility: 5, fear: 3, courage: 3 }
      }
    ]
  },
  // 44. Luke
  {
    id: "luke",
    name: "Luke",
    meaning: "Light-giving",
    emoji: "🏥",
    role: "Physician, Historian, Gospel Writer",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Luke", "Acts", "Colossians 4:14", "2 Timothy 4:11"],
    archetypes: ["Servant", "Missionary"],
    dna: { faith: 4, humility: 5, courage: 4, wisdom: 5, compassion: 5, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Servant",
      strength: "Meticulous research and faithful companionship",
      weakness: "Worked entirely behind the scenes—no personal narrative prominence",
      mindset: "Investigate carefully and write an orderly account",
      keyLesson: "Faithfulness behind the scenes builds the foundation others stand on.",
      keyVerse: "Only Luke is with me.",
      keyVerseRef: "2 Timothy 4:11"
    },
    storyArc: "A Gentile physician who carefully researched and wrote the most detailed Gospel and the history of the early church in Acts. He was Paul's loyal companion through shipwreck, imprisonment, and abandonment—the last one standing when everyone else left.",
    therapyView: {
      drivingFears: ["The truth being lost or distorted", "Paul being alone"],
      coreMotivations: ["Historical accuracy", "Serving the truth", "Loyalty to Paul"],
      relationalStyle: "Quietly faithful, serving through competence rather than charisma",
      blindSpots: ["So self-effacing he barely appears in his own writings"],
      healingMoments: ["'Only Luke is with me'—Paul's recognition of his faithfulness", "Completing two volumes of Scripture"]
    },
    strengths: ["Meticulous research", "Beautiful writing", "Medical care", "Unwavering loyalty"],
    weaknesses: ["So behind-the-scenes he is easily overlooked"],
    journey: [
      { phase: "Calling", description: "Joined Paul's missionary team—'we' passages in Acts" },
      { phase: "Testing", description: "Endured shipwreck, imprisonment, and Paul's final days" },
      { phase: "Legacy", description: "Wrote Luke and Acts—more of the NT by volume than any other author" }
    ],
    relationships: [
      { name: "Paul", role: "Ministry partner and patient" },
      { name: "Theophilus", role: "Patron to whom he dedicated his writings" }
    ],
    lessonsAndReflection: [
      "Are you faithful in the unglamorous behind-the-scenes work?",
      "Who will you be the last one standing with?"
    ],
    relatedCharacters: ["paul", "timothy", "silas"],
    situations: [
      {
        id: "luke-only-one-with-me",
        title: "Only Luke Is with Me",
        category: "Persecution",
        reference: "2 Timothy 4:9-11",
        keyVerse: "Only Luke is with me.",
        situation: "In Paul's final imprisonment before execution, most companions had departed—some for good reasons, others from desertion. Luke alone remained.",
        pressure: "Associating with a condemned prisoner in Rome was dangerous. Everyone else had left.",
        innerBattle: "Self-preservation vs. loyalty; the temptation to distance himself from a condemned man.",
        response: "Luke stayed. No dramatic speech, no public act of courage—just quiet, faithful presence.",
        outcome: "Paul was not alone in his final days. Luke's loyalty became one of the most moving testimonies in the NT.",
        lesson: "The greatest ministry is sometimes simply being the last one who stays.",
        traitRevealed: "Quiet, costly faithfulness",
        spiritualPrinciple: "Presence in someone's darkest hour speaks louder than a thousand sermons.",
        reflectionQuestions: ["Who needs your presence more than your words right now?", "Will you be the one who stays when everyone else leaves?"],
        dnaSnapshot: { compassion: 5, faith: 4, courage: 4, humility: 5 }
      }
    ]
  },
  // 45. Silas
  {
    id: "silas",
    name: "Silas",
    meaning: "Wood / Forest (Silvanus in Latin)",
    emoji: "🎶",
    role: "Paul's Companion, Prophet",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 15:22-40", "Acts 16-18", "1 Thessalonians 1:1", "1 Peter 5:12"],
    archetypes: ["Missionary", "Prophet"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 4, compassion: 4, fear: 0, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Missionary",
      strength: "Worship in suffering; resilient joy under persecution",
      weakness: "Largely overshadowed by Paul in the record",
      mindset: "Sing in the midnight; God is working in the chains",
      keyLesson: "Worship in prison breaks chains—both physical and spiritual.",
      keyVerse: "About midnight Paul and Silas were praying and singing hymns to God, and the other prisoners were listening to them.",
      keyVerseRef: "Acts 16:25"
    },
    storyArc: "A leading man in the Jerusalem church sent to deliver the apostolic decree, Silas joined Paul after the Barnabas split. Together they were beaten and jailed in Philippi, where their midnight worship led to an earthquake, the jailer's conversion, and the church's founding.",
    therapyView: {
      drivingFears: ["None prominently recorded—his joy in suffering suggests deep security in God"],
      coreMotivations: ["Advancing the gospel", "Worship regardless of circumstances", "Partnership in mission"],
      relationalStyle: "Supportive, joyful under pressure, team-oriented",
      blindSpots: ["Content to remain in Paul's shadow—could have led more independently"],
      healingMoments: ["Singing in the Philippian jail", "The earthquake and the jailer's salvation"]
    },
    strengths: ["Joy in suffering", "Prophetic gifting", "Team player", "Worship under pressure"],
    weaknesses: ["Largely eclipsed by Paul in the historical record"],
    journey: [
      { phase: "Calling", description: "Chosen as a leader to deliver the Jerusalem decree" },
      { phase: "Testing", description: "Beaten and jailed in Philippi with Paul" },
      { phase: "Legacy", description: "Co-founded multiple churches; helped write Thessalonian epistles" }
    ],
    relationships: [
      { name: "Paul", role: "Ministry partner" },
      { name: "Peter", role: "Assisted with 1 Peter" },
      { name: "Timothy", role: "Fellow companion" }
    ],
    lessonsAndReflection: [
      "Can you worship when your circumstances say you should despair?",
      "What would happen if you sang at midnight in your prison?"
    ],
    relatedCharacters: ["paul", "timothy", "barnabas"],
    situations: [
      {
        id: "silas-philippian-jail",
        title: "Singing in the Philippian Jail",
        category: "Persecution",
        reference: "Acts 16:22-34",
        keyVerse: "About midnight Paul and Silas were praying and singing hymns to God.",
        situation: "After being stripped, beaten with rods, and thrown into the inner cell with their feet in stocks, Paul and Silas sang hymns at midnight while the other prisoners listened.",
        pressure: "Physical agony, unjust imprisonment, no certainty of release, bleeding backs in a dark cell.",
        innerBattle: "Despair vs. worship; focusing on circumstances vs. focusing on God's sovereignty.",
        response: "Instead of complaining or despairing, they prayed and sang hymns. Their worship was so unusual the other prisoners listened.",
        outcome: "An earthquake opened every door and loosened every chain. The jailer and his household were saved and baptized.",
        lesson: "Worship in the darkest circumstances unleashes God's power in ways complaint never can.",
        traitRevealed: "Defiant joy in suffering",
        spiritualPrinciple: "When worship replaces despair, God shakes foundations.",
        reflectionQuestions: ["What would it look like to worship in your current prison?", "Who is listening to how you respond to suffering?"],
        dnaSnapshot: { faith: 5, courage: 5, humility: 4 }
      }
    ]
  },
  // 46. Stephen
  {
    id: "stephen",
    name: "Stephen",
    meaning: "Crown",
    emoji: "💎",
    role: "Deacon, First Christian Martyr",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 6-7"],
    archetypes: ["Martyr", "Servant"],
    dna: { faith: 5, humility: 5, courage: 5, wisdom: 5, compassion: 5, fear: 0, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Martyr",
      strength: "Fearless proclamation and Christ-like forgiveness while dying",
      weakness: "None prominently recorded",
      mindset: "I see heaven open and the Son of Man standing",
      keyLesson: "The ultimate witness is dying like Jesus—forgiving your killers.",
      keyVerse: "Lord, do not hold this sin against them.",
      keyVerseRef: "Acts 7:60"
    },
    storyArc: "Chosen as one of the first seven deacons, Stephen was full of faith, wisdom, and the Spirit. He performed signs, debated masterfully, delivered a sweeping history of Israel's rejection of God's messengers, and became the first Christian martyr—forgiving his killers as he died.",
    therapyView: {
      drivingFears: ["None recorded—he saw heaven open as he faced death"],
      coreMotivations: ["Truth", "Faithful witness", "Following Jesus to the end"],
      relationalStyle: "Bold truth-teller, compassionate even toward enemies",
      blindSpots: ["None prominently recorded"],
      healingMoments: ["Vision of Jesus standing at God's right hand", "Forgiving his killers", "His death catalyzed the church's spread"]
    },
    strengths: ["Fearless preaching", "Theological mastery", "Christ-like forgiveness", "Faithfulness unto death"],
    weaknesses: ["None prominently recorded"],
    journey: [
      { phase: "Calling", description: "Chosen as a deacon, full of faith and the Holy Spirit" },
      { phase: "Testing", description: "Arrested, tried before the Sanhedrin, falsely accused" },
      { phase: "Legacy", description: "First Christian martyr; his death scattered the church and impacted Saul/Paul" }
    ],
    relationships: [
      { name: "The Apostles", role: "Leaders who appointed him" },
      { name: "Saul/Paul", role: "Young man who approved of his death—later converted" }
    ],
    lessonsAndReflection: [
      "Could you forgive someone in the act of destroying you?",
      "What does it mean to see Jesus standing for you in your darkest moment?"
    ],
    relatedCharacters: ["paul", "philip-evangelist"],
    situations: [
      {
        id: "stephen-martyrdom",
        title: "Stephen's Martyrdom",
        category: "Persecution",
        reference: "Acts 7:54-60",
        keyVerse: "Lord, do not hold this sin against them.",
        situation: "After delivering a powerful sermon tracing Israel's pattern of rejecting God's messengers, the Sanhedrin was furious. Stephen looked up and saw Jesus standing at God's right hand.",
        pressure: "Facing a murderous mob with stones in their hands; the first Christian to face execution for faith.",
        innerBattle: "Self-preservation vs. ultimate faithfulness; bitterness vs. forgiveness in the moment of death.",
        response: "Stephen declared his vision of Jesus, knelt as stones struck him, and prayed for his killers: 'Lord, do not hold this sin against them.'",
        outcome: "He became the first Christian martyr. His death scattered the church, spreading the gospel. Saul, who watched, was later converted.",
        lesson: "The blood of martyrs is the seed of the church; dying like Jesus transforms the watching world.",
        traitRevealed: "Perfect Christ-like response under ultimate pressure",
        spiritualPrinciple: "Forgiving your killers is the most powerful sermon you will ever preach.",
        reflectionQuestions: ["Could you pray for someone actively harming you?", "What would it look like to respond to persecution with forgiveness?"],
        dnaSnapshot: { faith: 5, courage: 5, compassion: 5, humility: 5 }
      }
    ]
  },
  // 47. Philip (Evangelist)
  {
    id: "philip-evangelist",
    name: "Philip the Evangelist",
    meaning: "Lover of horses",
    emoji: "🏃",
    role: "Deacon, Evangelist",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 6:5", "Acts 8:4-40", "Acts 21:8-9"],
    archetypes: ["Missionary", "Servant"],
    dna: { faith: 5, humility: 4, courage: 4, wisdom: 4, compassion: 5, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Missionary",
      strength: "Spirit-led evangelism and responsiveness to divine direction",
      weakness: "Fades from the narrative after initial prominence",
      mindset: "Go where the Spirit sends, even into the desert",
      keyLesson: "Obedience to the Spirit's promptings opens doors no human strategy could.",
      keyVerse: "The Spirit told Philip, 'Go to that chariot and stay near it.'",
      keyVerseRef: "Acts 8:29"
    },
    storyArc: "One of the first seven deacons, Philip fled persecution to Samaria where revival broke out. The Spirit then sent him to a desert road to meet an Ethiopian eunuch reading Isaiah, leading to his conversion and baptism—then Philip was supernaturally transported to Azotus.",
    therapyView: {
      drivingFears: ["Missing the Spirit's direction"],
      coreMotivations: ["Reaching the lost", "Obedience to the Holy Spirit", "Breaking barriers"],
      relationalStyle: "Adaptable, Spirit-responsive, willing to go anywhere",
      blindSpots: ["So responsive he may not have built lasting structures"],
      healingMoments: ["Samaria revival", "Ethiopian eunuch's joy", "Supernatural transport to Azotus"]
    },
    strengths: ["Spirit-sensitivity", "Cross-cultural evangelism", "Adaptability", "One-on-one ministry"],
    weaknesses: ["Fades from the narrative after Acts 8", "Less structured than other leaders"],
    journey: [
      { phase: "Calling", description: "Chosen as one of the first deacons" },
      { phase: "Testing", description: "Fled persecution and preached in Samaria—enemy territory" },
      { phase: "Legacy", description: "Led the Ethiopian eunuch to Christ; had four prophesying daughters" }
    ],
    relationships: [
      { name: "The Ethiopian Eunuch", role: "Convert on the desert road" },
      { name: "Stephen", role: "Fellow deacon" },
      { name: "His Four Daughters", role: "Prophetesses" }
    ],
    lessonsAndReflection: [
      "Are you willing to leave a successful ministry to follow the Spirit to one person?",
      "How sensitive are you to the Spirit's unexpected redirections?"
    ],
    relatedCharacters: ["stephen", "paul", "peter"],
    situations: [
      {
        id: "philip-ethiopian-eunuch",
        title: "Philip and the Ethiopian Eunuch",
        category: "Calling",
        reference: "Acts 8:26-40",
        keyVerse: "Go to that chariot and stay near it.",
        situation: "In the middle of a successful Samaritan revival, the Spirit told Philip to go south to a desert road. There he found an Ethiopian official reading Isaiah 53 in his chariot.",
        pressure: "Leaving a thriving ministry for an empty desert road; approaching a powerful foreign official uninvited.",
        innerBattle: "Strategic thinking (stay where it is working) vs. Spirit-obedience (go to the desert for one person).",
        response: "Philip ran to the chariot, asked if the man understood what he was reading, and explained that Isaiah was describing Jesus.",
        outcome: "The eunuch believed, was baptized, and went on his way rejoicing—tradition says he brought the gospel to Ethiopia.",
        lesson: "One Spirit-directed conversation can reach an entire nation.",
        traitRevealed: "Immediate obedience to the Spirit",
        spiritualPrinciple: "God values the one as much as the many; follow the Spirit, not the crowd.",
        reflectionQuestions: ["Would you leave a successful situation to minister to one person in the desert?", "Are you listening for the Spirit's unexpected redirections?"],
        dnaSnapshot: { faith: 5, courage: 4, compassion: 5 }
      }
    ]
  },
  // 48. James (Brother of Jesus)
  {
    id: "james-brother-jesus",
    name: "James (Brother of Jesus)",
    meaning: "Supplanter",
    emoji: "📐",
    role: "Leader of the Jerusalem Church",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Acts 15", "Acts 21:18", "James", "Galatians 1:19", "Galatians 2:9"],
    archetypes: ["Priest", "Judge"],
    dna: { faith: 5, humility: 5, courage: 4, wisdom: 5, compassion: 4, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Judge",
      strength: "Practical wisdom that bridged Jewish and Gentile Christianity",
      weakness: "May have been overly cautious about Jewish-Gentile inclusion initially",
      mindset: "Faith without works is dead",
      keyLesson: "True faith produces practical righteousness; wisdom from above is peaceable and impartial.",
      keyVerse: "Faith by itself, if it is not accompanied by action, is dead.",
      keyVerseRef: "James 2:17"
    },
    storyArc: "Jesus' own brother who did not believe during Jesus' ministry but was converted by the resurrection appearance. He became the leader of the Jerusalem church, presided over the crucial Jerusalem Council, and wrote the epistle calling for practical faith. Tradition says he was martyred by being thrown from the Temple.",
    therapyView: {
      drivingFears: ["Splitting the church between Jewish and Gentile factions", "Compromising the faith's Jewish roots"],
      coreMotivations: ["Church unity", "Practical righteousness", "Preserving the faith community"],
      relationalStyle: "Measured, wise, diplomatic, authoritative when needed",
      blindSpots: ["Initial unbelief during Jesus' ministry", "Possible over-emphasis on Jewish practice for Gentile converts"],
      healingMoments: ["Post-resurrection encounter with Jesus", "Leading the Jerusalem Council to a wise compromise"]
    },
    strengths: ["Practical wisdom", "Church leadership", "Bridge-building", "Devotion to prayer"],
    weaknesses: ["Initial unbelief in Jesus", "Caution that could slow progress"],
    journey: [
      { phase: "Calling", description: "Converted by Jesus' resurrection appearance" },
      { phase: "Testing", description: "Led the Jerusalem church during explosive growth and persecution" },
      { phase: "Legacy", description: "Presided over the Jerusalem Council; wrote the epistle of James; martyred for his faith" }
    ],
    relationships: [
      { name: "Jesus", role: "Brother (and Lord)" },
      { name: "Paul", role: "Apostle he initially received cautiously, then affirmed" },
      { name: "Peter", role: "Fellow pillar of the church" }
    ],
    lessonsAndReflection: [
      "Does your faith produce visible fruit, or is it theoretical?",
      "How do you bridge divisions in your community?"
    ],
    relatedCharacters: ["jesus", "paul", "peter"],
    situations: [
      {
        id: "james-jerusalem-council",
        title: "James Presides Over the Jerusalem Council",
        category: "Leadership Pressure",
        reference: "Acts 15:1-21",
        keyVerse: "It is my judgment, therefore, that we should not make it difficult for the Gentiles who are turning to God.",
        situation: "The early church was splitting over whether Gentile converts must follow Jewish law. Paul and Barnabas argued for freedom; traditional Jews demanded circumcision. James had to rule.",
        pressure: "The church's unity hung on this decision; getting it wrong meant either legalism or lawlessness.",
        innerBattle: "Honoring Jewish heritage vs. embracing the radical inclusion of the gospel.",
        response: "James listened to all sides, cited Scripture, and issued a wise compromise—Gentiles need not be circumcised but should abstain from certain practices for unity's sake.",
        outcome: "The church was preserved. The decision became the foundation of Gentile Christianity.",
        lesson: "Wise leadership listens to all sides, anchors in Scripture, and makes decisions that preserve unity without compromising truth.",
        traitRevealed: "Judicial wisdom under pressure",
        spiritualPrinciple: "The best decisions honor both truth and grace, tradition and transformation.",
        reflectionQuestions: ["How do you handle disputes where both sides have legitimate concerns?", "Can you lead with wisdom that preserves unity without compromising conviction?"],
        dnaSnapshot: { wisdom: 5, humility: 5, faith: 5, courage: 4 }
      }
    ]
  },
  // 49. John (Apostle)
  {
    id: "john-apostle",
    name: "John",
    meaning: "God is gracious",
    emoji: "❤️",
    role: "Apostle, Beloved Disciple, Author",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["Gospel of John", "1-3 John", "Revelation"],
    archetypes: ["Prophet", "Missionary"],
    dna: { faith: 5, humility: 4, courage: 5, wisdom: 5, compassion: 5, fear: 1, pride: 2, greed: 0 },
    quickCard: {
      archetype: "Prophet",
      strength: "Deepest theological insight and intimate knowledge of Jesus",
      weakness: "Early ambition and judgmental zeal ('Son of Thunder')",
      mindset: "God is love, and the one who abides in love abides in God",
      keyLesson: "The disciple closest to Jesus' heart is transformed from thunder to love.",
      keyVerse: "Dear friends, let us love one another, for love comes from God.",
      keyVerseRef: "1 John 4:7"
    },
    storyArc: "A fisherman called 'Son of Thunder' who wanted to call fire from heaven, John became the disciple Jesus loved. He leaned on Jesus' chest, stood at the cross, cared for Mary, wrote the deepest Gospel, and in extreme old age wrote of love from exile on Patmos.",
    therapyView: {
      drivingFears: ["The church losing its first love", "False teaching distorting Jesus"],
      coreMotivations: ["Intimacy with Jesus", "Love as the mark of Christianity", "Truth against deception"],
      relationalStyle: "Transformed from fierce to tender; intimate, protective of truth and love",
      blindSpots: ["Early pride—asked for the best seat in the kingdom", "Wanted to destroy Samaritan village"],
      healingMoments: ["Leaning on Jesus' chest", "Standing at the cross", "Caring for Mary", "Revelation on Patmos"]
    },
    strengths: ["Theological depth", "Intimate knowledge of Jesus", "Endurance into old age", "Balance of love and truth"],
    weaknesses: ["Early ambition", "Judgmental zeal ('Sons of Thunder')", "Exclusivism (tried to stop someone casting out demons in Jesus' name)"],
    journey: [
      { phase: "Calling", description: "Left fishing nets to follow Jesus" },
      { phase: "Resistance", description: "Wanted fire from heaven on Samaritans; sought top positions" },
      { phase: "Refinement", description: "Became the 'beloved disciple'; stood at the cross; cared for Mary" },
      { phase: "Legacy", description: "Wrote the Gospel of John, three epistles, and Revelation from exile on Patmos" }
    ],
    relationships: [
      { name: "Jesus", role: "Lord and intimate friend" },
      { name: "Peter", role: "Fellow pillar apostle" },
      { name: "James (brother)", role: "Brother and fellow apostle martyred early" },
      { name: "Mary (mother of Jesus)", role: "Entrusted to his care at the cross" }
    ],
    lessonsAndReflection: [
      "How has intimacy with Jesus transformed your character over time?",
      "Can you hold truth and love together without sacrificing either?"
    ],
    relatedCharacters: ["peter", "james-brother-john", "paul", "jesus"],
    situations: [
      {
        id: "john-at-the-cross",
        title: "John at the Cross",
        category: "Sacrifice",
        reference: "John 19:25-27",
        keyVerse: "When Jesus saw his mother there, and the disciple whom he loved standing nearby, he said to her, 'Woman, here is your son.'",
        situation: "While the other disciples fled, John stood at the foot of the cross with the women, watching Jesus die.",
        pressure: "Roman soldiers, hostile crowd, the trauma of watching his Lord tortured and killed, personal danger of being identified as a follower.",
        innerBattle: "Fear of the cross vs. love for Jesus; self-preservation vs. faithfulness.",
        response: "John stayed. He was the only male disciple recorded at the crucifixion. Jesus entrusted Mary to his care.",
        outcome: "John received the charge to care for Mary and witnessed the full extent of Jesus' love—which became the theme of his entire life and writings.",
        lesson: "Staying when everyone else flees is the purest expression of love.",
        traitRevealed: "Faithful, courageous love",
        spiritualPrinciple: "The one who stays closest to the cross sees the deepest revelation of love.",
        reflectionQuestions: ["Where is God asking you to stay when others have fled?", "What have you witnessed by staying close to suffering?"],
        dnaSnapshot: { faith: 5, courage: 5, compassion: 5, humility: 4 }
      }
    ]
  },
  // 50. Andrew
  {
    id: "andrew",
    name: "Andrew",
    meaning: "Manly / Brave",
    emoji: "🐟",
    role: "First-Called Apostle, Bridge-Builder",
    era: "Early Church",
    testament: "NT",
    keyScriptures: ["John 1:35-42", "John 6:8-9", "John 12:20-22", "Mark 1:16-18"],
    archetypes: ["Servant", "Missionary"],
    dna: { faith: 4, humility: 5, courage: 4, wisdom: 3, compassion: 5, fear: 1, pride: 0, greed: 0 },
    quickCard: {
      archetype: "Servant",
      strength: "Bringing others to Jesus without seeking the spotlight",
      weakness: "Overshadowed by his brother Peter in every way",
      mindset: "I may not be the main event, but I can bring people to the one who is",
      keyLesson: "The greatest ministry is connecting others to Jesus.",
      keyVerse: "The first thing Andrew did was to find his brother Simon and tell him, 'We have found the Messiah.'",
      keyVerseRef: "John 1:41"
    },
    storyArc: "Originally a disciple of John the Baptist, Andrew was the first to follow Jesus. His defining pattern was bringing others to Jesus—first his brother Peter, then the boy with loaves and fish, then Greeks seeking Jesus. He lived in Peter's shadow but faithfully connected people to Christ.",
    therapyView: {
      drivingFears: ["Being invisible in ministry", "Not being enough compared to Peter"],
      coreMotivations: ["Connecting people to Jesus", "Faithful service regardless of recognition"],
      relationalStyle: "Humble bridge-builder, introduces others to what matters most",
      blindSpots: ["May have struggled with Peter receiving all the attention"],
      healingMoments: ["Being the first called by Jesus", "Seeing the boy's lunch feed 5,000", "Greeks coming to Jesus through him"]
    },
    strengths: ["Bringing others to Jesus", "Humility", "Faithfulness without recognition", "Bridge-building"],
    weaknesses: ["Perpetually overshadowed by Peter", "Less prominent in the Gospels"],
    journey: [
      { phase: "Calling", description: "First disciple to follow Jesus, immediately brought Peter" },
      { phase: "Testing", description: "Served faithfully in Peter's shadow without jealousy" },
      { phase: "Legacy", description: "Every recorded act is bringing someone to Jesus; tradition says he was martyred on an X-shaped cross" }
    ],
    relationships: [
      { name: "Jesus", role: "Lord and rabbi" },
      { name: "Peter", role: "Brother he brought to Jesus" },
      { name: "John the Baptist", role: "First teacher before following Jesus" }
    ],
    lessonsAndReflection: [
      "Are you content to bring others to Jesus even if they surpass you?",
      "What small offering are you bringing to Jesus that He can multiply?"
    ],
    relatedCharacters: ["peter", "john-apostle", "philip-evangelist"],
    situations: [
      {
        id: "andrew-brings-peter",
        title: "Andrew Brings Peter to Jesus",
        category: "Calling",
        reference: "John 1:35-42",
        keyVerse: "We have found the Messiah.",
        situation: "After spending a day with Jesus, Andrew's first instinct was not to keep the experience for himself but to find his brother Simon Peter.",
        pressure: "He could have kept this discovery to himself; he could have been jealous when Peter eventually became the leader.",
        innerBattle: "Keeping the spotlight vs. sharing the discovery; personal glory vs. others' transformation.",
        response: "Andrew immediately found Peter and brought him to Jesus, declaring 'We have found the Messiah.'",
        outcome: "Peter became the leader of the apostles. Andrew had introduced the world to the rock on which the church was built.",
        lesson: "The person who introduces others to Jesus may never get the credit, but they start the movement.",
        traitRevealed: "Selfless bridge-building",
        spiritualPrinciple: "Your greatest legacy may be the people you bring to Jesus, even if they eclipse you.",
        reflectionQuestions: ["Who have you brought to Jesus recently?", "Can you celebrate when someone you introduced surpasses you?"],
        dnaSnapshot: { humility: 5, compassion: 5, faith: 4 }
      },
      {
        id: "andrew-boy-with-lunch",
        title: "Andrew Brings the Boy with Loaves and Fish",
        category: "Faith Testing",
        reference: "John 6:8-9",
        keyVerse: "Here is a boy with five small barley loaves and two small fish, but how far will they go among so many?",
        situation: "Facing a crowd of 5,000 with no food, Andrew found a boy with five loaves and two fish and brought him to Jesus—then admitted it seemed hopelessly inadequate.",
        pressure: "A massive need, a tiny resource, and the embarrassment of offering something so small.",
        innerBattle: "Logical analysis (this is nothing) vs. faith instinct (bring what you have to Jesus).",
        response: "Andrew brought the small offering to Jesus despite knowing it seemed ridiculous.",
        outcome: "Jesus multiplied the loaves and fish to feed 5,000 with twelve baskets left over.",
        lesson: "God does not need adequacy; He needs availability. Bring what you have, no matter how small.",
        traitRevealed: "Faith that brings the insufficient to Jesus",
        spiritualPrinciple: "In God's economy, what is offered in faith is always multiplied beyond reason.",
        reflectionQuestions: ["What small offering are you withholding because it seems insufficient?", "Can you trust Jesus to multiply what you bring?"],
        dnaSnapshot: { faith: 4, humility: 5, compassion: 5 }
      }
    ]
  },
];
