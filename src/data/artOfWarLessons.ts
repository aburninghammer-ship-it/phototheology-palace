// Lessons from "The Art of War: An Unconventional Book for an Unconventional War"

export interface DojoLesson {
  id: string;
  chapter: number;
  title: string;
  subtitle?: string;
  description: string;
  keyPoints: string[];
  scriptureReferences: string[];
  practicalApplication: string;
  reflectionQuestions: string[];
  warriorCharacteristics?: string[];
}

export const DOJO_LESSONS: DojoLesson[] = [
  {
    id: "holy-war",
    chapter: 1,
    title: "Holy War",
    subtitle: "Understanding the True Battle",
    description: "The greatest battle humanity faces is not against terrorists, nations, or external enemies. It is the war against self—our own carnal nature in alliance with Satan. This is true holy war.",
    keyPoints: [
      "Our enemy is not flesh and blood, but spiritual wickedness (Ephesians 6:12)",
      "Self is the personal terrorist—24/7 access to your mind, thoughts, and weaknesses",
      "All external warfare results from poorly fought internal warfare (James 4:1)",
      "There can be no peaceful coexistence with self; one must die that the other may live"
    ],
    scriptureReferences: [
      "Ephesians 6:12",
      "1 Peter 2:11",
      "Ephesians 4:22",
      "James 4:1",
      "Revelation 12:12"
    ],
    practicalApplication: "Today, identify one area where 'self' is demanding control. Instead of blaming external circumstances or people, recognize the internal enemy. Declare war on that specific manifestation of self.",
    reflectionQuestions: [
      "What recurring sin patterns reveal where 'self' is winning battles in my life?",
      "Am I treating sin as a minor inconvenience or as a deadly enemy?",
      "Where am I harboring and protecting 'self' instead of containing and destroying it?"
    ],
    warriorCharacteristics: ["self-awareness", "honesty", "courage"]
  },
  {
    id: "underestimating-enemy",
    chapter: 1,
    title: "Know Thy Enemy",
    subtitle: "Underestimating Self is Fatal",
    description: "The fatal mistake in warfare is underestimating your opponent. Christians often minimize self, thinking 'I would never do that.' This attitude harbors the terrorist within.",
    keyPoints: [
      "Self is capable of ANYTHING—there are no limits to its wickedness",
      "The carnal mind is enmity against God and cannot be subject to His law (Romans 8:6-7)",
      "Self is a relentless traitor working with Satan, plotting to lure you into danger",
      "Temptation is your early warning system that self is launching an offensive"
    ],
    scriptureReferences: [
      "Romans 8:6-7",
      "Jeremiah 17:9",
      "Genesis 6:5",
      "Mark 7:21-23"
    ],
    practicalApplication: "Write down the three thoughts you've had recently that you'd be ashamed for anyone to know. This reveals self's true nature. Stop saying 'I would never...' and start saying 'I am capable of anything without God's grace.'",
    reflectionQuestions: [
      "What thoughts have crossed my mind that reveal self's true wickedness?",
      "Am I underestimating how far self will go to satisfy its desires?",
      "Do I view temptation as a warning system or as something I can handle on my own?"
    ],
    warriorCharacteristics: ["vigilance", "honesty", "humility"]
  },
  {
    id: "declaration-of-war",
    chapter: 2,
    title: "Declaration of War",
    subtitle: "No Longer a Civilian",
    description: "There comes a time when a nation under attack must declare war to survive. Many Christians have never made a decided declaration of war against self. This refusal allows self to strengthen and wreak havoc.",
    keyPoints: [
      "Refusal to declare war on self results in wars with others (James 4:1)",
      "Christians cannot remain civilians—we are called to be soldiers (2 Timothy 2:3-4)",
      "A soldier expects hardship and trial; a civilian is surprised by it",
      "Warriors view themselves as hunters, not victims or hunted"
    ],
    scriptureReferences: [
      "2 Timothy 2:3-4",
      "1 Timothy 6:12",
      "James 1:12",
      "1 Peter 4:12-13"
    ],
    practicalApplication: "Make a formal declaration of war today. Write it out: 'I, [your name], do hereby declare total war against my carnal nature. I will no longer harbor self, protect self, or make excuses for self. By God's grace, I am a soldier, not a civilian.'",
    reflectionQuestions: [
      "Have I truly declared war on self, or am I still living as a spiritual civilian?",
      "When trials come, do I respond like a soldier (expecting battle) or a civilian (surprised and complaining)?",
      "Am I viewing myself as a victim or a warrior?"
    ],
    warriorCharacteristics: ["decisiveness", "commitment", "soldier-mindset"]
  },
  {
    id: "divine-objective",
    chapter: 2,
    title: "Divine Objective",
    subtitle: "Contain and Destroy",
    description: "Every war needs a clear objective. The divine objective in holy war is twofold: CONTAIN self (keep warfare internal) and DESTROY self (eliminate it within).",
    keyPoints: [
      "Contain: Keep the battle internal—don't let self 'get out' through sinful actions",
      "Destroy: Win the battle within—eliminate angry thoughts, not just angry words",
      "External sin reveals failed internal containment",
      "True victory requires both containment AND destruction"
    ],
    scriptureReferences: [
      "Matthew 5:28",
      "Proverbs 4:23",
      "2 Corinthians 10:5",
      "James 1:14-15"
    ],
    practicalApplication: "Today, practice containment. When tempted to lash out, gossip, or indulge, contain the battle internally. Then practice destruction: take the thought captive immediately (2 Cor 10:5). Don't just avoid the action—kill the desire.",
    reflectionQuestions: [
      "Where is self 'getting out' through my words or actions?",
      "Am I winning the internal battle, or just avoiding external manifestations?",
      "What thought patterns need to be destroyed, not just contained?"
    ],
    warriorCharacteristics: ["self-control", "internal-focus", "thoroughness"]
  },
  {
    id: "righteous-anger",
    chapter: 3,
    title: "Be Ye Angry",
    subtitle: "The Fuel of Holy War",
    description: "The devil is angry (Rev 12:12). His angels are angry (Rev 11:18). Christians are also called to be angry—but with righteous indignation. Holy anger is the fuel of holy war.",
    keyPoints: [
      "Anger moved Jesus from His throne to come to earth",
      "God's wrath against sin is the pattern for our wrath against self",
      "Righteous anger is directed at sin, not people",
      "This holy anger must be under God's control, not self's"
    ],
    scriptureReferences: [
      "Ephesians 4:26",
      "Psalm 18:2-9",
      "Isaiah 59:16-17",
      "Revelation 12:12"
    ],
    practicalApplication: "Ask God for holy anger at your own sin. When you're tempted, don't be passive—be angry that self is trying to betray Christ. Channel that anger into spiritual warfare, not carnal reactions.",
    reflectionQuestions: [
      "Am I more angry at others' sins than my own?",
      "Does sin grieve me, or have I become comfortable with it?",
      "Can I distinguish between righteous anger (at sin) and sinful anger (at people)?"
    ],
    warriorCharacteristics: ["holy-anger", "passion", "zeal"]
  },
  {
    id: "mighty-men",
    chapter: 3,
    title: "Mighty Men of War",
    subtitle: "Characteristics of God's Warriors",
    description: "1 Chronicles 12 describes David's mighty men—warriors ready for battle. These characteristics define what God seeks in His holy warriors today.",
    keyPoints: [
      "EXPERT IN WAR: Mastery requires time, study, and practice",
      "ALL INSTRUMENTS OF WAR: Skilled in using every spiritual weapon (Eph 6:10-17)",
      "KEEP RANK: Unity, staying in line, advancing together",
      "NOT OF DOUBLE HEART: Single-minded, not fickle, unwavering focus",
      "MEN OF MIGHT: Depending on God's power, not their own",
      "FACES LIKE LIONS: Courageous, bold as lions (Proverbs 28:1)",
      "SWIFT AS ROES: Agile, able to keep footing on difficult terrain"
    ],
    scriptureReferences: [
      "1 Chronicles 12:8-33",
      "1 Corinthians 9:25",
      "Ephesians 6:10-17",
      "Proverbs 28:1",
      "Jude 24"
    ],
    practicalApplication: "Choose one characteristic to develop this week. If choosing 'expert in war,' study one spiritual weapon daily. If choosing 'faces like lions,' practice bold obedience in one area where you've been timid.",
    reflectionQuestions: [
      "Which of the seven characteristics is my weakest?",
      "Am I studying the art of spiritual warfare, or just hoping to survive?",
      "Where do I need to 'keep rank' better with fellow believers?"
    ],
    warriorCharacteristics: ["expertise", "boldness", "unity", "agility", "focus"]
  },
  {
    id: "spirit-of-war",
    chapter: 4,
    title: "The Spirit of War",
    subtitle: "Nine Fruits, Infinite Combinations",
    description: "The Spirit of God produces nine fruits (Galatians 5:22-23). These are not just virtues—they are the 'combinations' or codes that unlock victory over every temptation.",
    keyPoints: [
      "The nine fruits are: Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control",
      "Each temptation has a 'code'—a specific combination of fruits that provides escape",
      "Failure in one or more fruits creates a 'weak spot' self can exploit",
      "Mastery of these nine spirits is mastery of righteousness"
    ],
    scriptureReferences: [
      "Galatians 5:22-23",
      "Galatians 5:16-17",
      "1 Corinthians 10:13",
      "John 15:13-14"
    ],
    practicalApplication: "When facing temptation today, pause and ask: 'Which fruits do I need right now?' Practice identifying the combination. Example: Tempted to gossip? Code = Love + Self-Control + Kindness.",
    reflectionQuestions: [
      "Which of the nine fruits is my greatest weakness?",
      "Can I identify the 'code' for my most common temptations?",
      "Am I relying on God's Spirit to produce these fruits, or trying in my own strength?"
    ],
    warriorCharacteristics: ["discernment", "spirit-reliance", "fruit-mastery"]
  },
  {
    id: "love",
    chapter: 4,
    title: "The Spirit of Love",
    subtitle: "The Foundation of All Warfare",
    description: "Love is the first and greatest fruit. Warriors must possess love for their Master (Jesus), love for their country (Kingdom of Heaven), and love for righteousness itself.",
    keyPoints: [
      "Love is willing to give all, even life itself (John 15:13)",
      "Love for Jesus motivates us to crucify self rather than betray Him",
      "Love for righteousness makes us emotionally connected to holiness",
      "Without love, there is no desire to stand or fight"
    ],
    scriptureReferences: [
      "Song of Solomon 8:7",
      "John 15:13-14",
      "Hebrews 1:9",
      "1 John 4:19"
    ],
    practicalApplication: "Meditate on Christ's love for you. Ask Him to transfer that love into your heart—love for Him, love for His kingdom, love for righteousness. When tempted, remember: 'Will I betray the One who died for me?'",
    reflectionQuestions: [
      "Do I love Jesus enough to die to self?",
      "Is righteousness my burden or my delight?",
      "What would I be willing to sacrifice for the Kingdom of Heaven?"
    ],
    warriorCharacteristics: ["love", "loyalty", "devotion"]
  },
  {
    id: "joy",
    chapter: 4,
    title: "The Joy of War",
    subtitle: "Fighting with Delight",
    description: "Joy transforms duty into delight. Without joy, spiritual warfare becomes a burden. With it, even the hardest sacrifices become easy. Warriors must not only fight—they must enjoy it.",
    keyPoints: [
      "Joy is what enabled Jesus to endure the cross (Hebrews 12:2)",
      "We struggle to do what is a burden; we love to do what brings joy",
      "Count trials as joy because they refine you (James 1:2-4)",
      "Righteousness must be our hobby, not just our mission"
    ],
    scriptureReferences: [
      "Hebrews 12:2",
      "James 1:2-4",
      "Matthew 13:44",
      "Isaiah 61:3",
      "Romans 8:28"
    ],
    practicalApplication: "Find joy in one act of self-crucifixion today. When denying self, don't do it grudgingly—do it with gladness, knowing you're becoming more like Christ. Practice the 'joy reframe': instead of 'I have to,' say 'I get to.'",
    reflectionQuestions: [
      "Do I find joy in obeying God, or is it just obligation?",
      "What would change if I saw spiritual warfare as my highest pleasure?",
      "Can I rejoice in trials, seeing them as opportunities to grow stronger?"
    ],
    warriorCharacteristics: ["joy", "delight", "gladness"]
  },
  {
    id: "peace",
    chapter: 4,
    title: "Know War, Know Peace",
    subtitle: "Peace Through Battle, Not Avoidance",
    description: "True peace is not the absence of conflict—it's the presence of God in the midst of battle. There can be no lasting peace without holy war against self.",
    keyPoints: [
      "No war means no peace; know war means know peace",
      "Peace is not comfort or ease—it's tranquility in the storm",
      "Internal peace comes from winning internal battles",
      "God's peace guards hearts and minds during warfare (Philippians 4:7)"
    ],
    scriptureReferences: [
      "Philippians 4:6-7",
      "Isaiah 26:3",
      "John 14:27",
      "Romans 5:1"
    ],
    practicalApplication: "Instead of avoiding conflict (with self), engage it with peace as your weapon. When anxious, don't seek escape—practice warring against anxiety with prayer and thanksgiving (Phil 4:6-7).",
    reflectionQuestions: [
      "Am I seeking peace through avoidance or through victory?",
      "Do I have internal peace, even when external circumstances are chaotic?",
      "Where am I choosing comfort over the hard peace that comes through warfare?"
    ],
    warriorCharacteristics: ["peace", "composure", "steadfastness"]
  },
  {
    id: "patience",
    chapter: 4,
    title: "The Spirit of Patience",
    subtitle: "Endurance in Long Warfare",
    description: "Patience (longsuffering) is the ability to endure trials without breaking, complaining, or giving up. It's not passive waiting—it's active endurance under fire.",
    keyPoints: [
      "Patience is the ability to suffer long without giving in",
      "Testing produces patience, which produces maturity (James 1:3-4)",
      "Warriors outlast temptation rather than surrender to it",
      "Patience is faith stretched over time"
    ],
    scriptureReferences: [
      "James 1:3-4",
      "Hebrews 10:36",
      "Romans 5:3-4",
      "Galatians 6:9"
    ],
    practicalApplication: "Identify one area where you tend to give up quickly. Today, when faced with that temptation or trial, commit to outlasting it. Set a timer for 15 minutes and pray through the desire without giving in.",
    reflectionQuestions: [
      "Where do I tend to quit too early in spiritual battles?",
      "Am I willing to endure discomfort for righteousness' sake?",
      "Do I believe God will provide escape if I just wait patiently?"
    ],
    warriorCharacteristics: ["patience", "endurance", "perseverance"]
  },
  {
    id: "kindness-goodness",
    chapter: 4,
    title: "Kindness, Goodness & Gentleness",
    subtitle: "The Gracious Warrior",
    description: "Strength without grace creates tyrants. Warriors must combine courage with kindness, power with gentleness, and victory with goodness.",
    keyPoints: [
      "Kindness disarms enemies (Romans 12:20—heaping coals)",
      "Goodness is moral excellence in action, not just intention",
      "Gentleness is not weakness—it's strength under control",
      "These fruits make the warrior like Christ: powerful yet tender"
    ],
    scriptureReferences: [
      "Romans 12:20-21",
      "Colossians 3:12",
      "2 Timothy 2:24-25",
      "Matthew 5:5"
    ],
    practicalApplication: "Practice 'strength under control' today. When someone wrongs you, respond with deliberate kindness. When you have power to retaliate, choose goodness instead. Let gentleness be your weapon.",
    reflectionQuestions: [
      "Do I mistake gentleness for weakness?",
      "Can I show kindness to those who have hurt me?",
      "Is my goodness just talk, or is it visible in my actions?"
    ],
    warriorCharacteristics: ["kindness", "goodness", "gentleness", "grace"]
  },
  {
    id: "faithfulness-self-control",
    chapter: 4,
    title: "Faithfulness & Self-Control",
    subtitle: "The Closing Combination",
    description: "Faithfulness is loyal devotion that persists. Self-control (temperance) is mastery over desires. Together they complete the nine-fruit arsenal.",
    keyPoints: [
      "Faithfulness keeps you in the fight when feelings fade",
      "Self-control is the ultimate defeat of self—mastery over your own impulses",
      "Without self-control, no other fruit can be maintained",
      "Temperance means moderation, discipline, and restraint in all things"
    ],
    scriptureReferences: [
      "1 Corinthians 9:25-27",
      "Proverbs 25:28",
      "2 Peter 1:5-6",
      "Galatians 5:23"
    ],
    practicalApplication: "Identify one area where you lack self-control (food, screen time, words, thoughts). Today, practice mastery in that one area for 24 hours. Use a journal to track every moment you said 'no' to self.",
    reflectionQuestions: [
      "Am I faithfully persisting in spiritual disciplines even when I don't feel like it?",
      "Where does self have the most control over me?",
      "What would my life look like if I had complete self-control in one area?"
    ],
    warriorCharacteristics: ["faithfulness", "self-control", "discipline", "mastery"]
  }
];

export const WARRIOR_CHARACTERISTICS = [
  { id: "self-awareness", name: "Self-Awareness", description: "Knowing the true nature of self" },
  { id: "honesty", name: "Honesty", description: "Facing reality without excuses" },
  { id: "courage", name: "Courage", description: "Boldness in the face of danger" },
  { id: "vigilance", name: "Vigilance", description: "Constant watchfulness" },
  { id: "humility", name: "Humility", description: "Recognizing dependence on God" },
  { id: "decisiveness", name: "Decisiveness", description: "Making clear commitments" },
  { id: "commitment", name: "Commitment", description: "Unwavering dedication" },
  { id: "soldier-mindset", name: "Soldier Mindset", description: "Expecting battle, not comfort" },
  { id: "self-control", name: "Self-Control", description: "Mastery over impulses" },
  { id: "internal-focus", name: "Internal Focus", description: "Fighting within, not externally" },
  { id: "thoroughness", name: "Thoroughness", description: "Complete victory, not halfway" },
  { id: "holy-anger", name: "Holy Anger", description: "Righteous wrath at sin" },
  { id: "passion", name: "Passion", description: "Intensity for righteousness" },
  { id: "zeal", name: "Zeal", description: "Fervent devotion" },
  { id: "peace", name: "Peace", description: "Calm in the storm" },
  { id: "composure", name: "Composure", description: "Steadiness under fire" },
  { id: "steadfastness", name: "Steadfastness", description: "Immovable foundation" },
  { id: "patience", name: "Patience", description: "Long-suffering endurance" },
  { id: "endurance", name: "Endurance", description: "Outlasting opposition" },
  { id: "perseverance", name: "Perseverance", description: "Continuing despite difficulty" },
  { id: "kindness", name: "Kindness", description: "Gracious treatment of others" },
  { id: "goodness", name: "Goodness", description: "Moral excellence in action" },
  { id: "gentleness", name: "Gentleness", description: "Strength under control" },
  { id: "grace", name: "Grace", description: "Unmerited favor shown to others" },
  { id: "faithfulness", name: "Faithfulness", description: "Loyal persistence" },
  { id: "discipline", name: "Discipline", description: "Structured obedience" },
  { id: "mastery", name: "Mastery", description: "Complete control" },
  { id: "love", name: "Love", description: "Selfless devotion" },
  { id: "loyalty", name: "Loyalty", description: "Unwavering allegiance" },
  { id: "devotion", name: "Devotion", description: "Wholehearted dedication" },
  { id: "joy", name: "Joy", description: "Delight in righteousness" },
  { id: "delight", name: "Delight", description: "Finding pleasure in obedience" },
  { id: "gladness", name: "Gladness", description: "Cheerful willingness" },
  { id: "unity", name: "Unity", description: "Oneness with fellow warriors" },
  { id: "expertise", name: "Expertise", description: "Skilled mastery" },
  { id: "boldness", name: "Boldness", description: "Fearless action" },
  { id: "agility", name: "Agility", description: "Quick adaptability" },
  { id: "focus", name: "Focus", description: "Single-minded concentration" },
  { id: "discernment", name: "Discernment", description: "Spiritual insight" },
  { id: "spirit-reliance", name: "Spirit Reliance", description: "Depending on God's power" },
  { id: "fruit-mastery", name: "Fruit Mastery", description: "Developing all nine fruits" }
];