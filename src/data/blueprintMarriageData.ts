export interface SanctuaryArticle {
  id: number;
  name: string;
  principle: string;
  sanctuaryMeaning: string;
  marriagePrinciple: string;
  detailedTeaching: string;
  reflectionQuestions: string[];
  coupleExercises: string[];
  scriptureReferences: string[];
  prayerPrompt: string;
}

export const SANCTUARY_MARRIAGE_ARTICLES: SanctuaryArticle[] = [
  {
    id: 1,
    name: "Altar of Burnt Offering",
    principle: "Sacrificial Surrender",
    sanctuaryMeaning: "Death to self. Surrender of rebellion. The place where sin is condemned and the sinner is freed.",
    marriagePrinciple: "Burn the things that destroy oneness.",
    detailedTeaching: `This altar teaches the unflinching truth:
No marriage dies because love disappeared—it dies because sacrifice disappeared.

Atonement begins only where something is placed on the altar and consumed.

In marriage, this altar calls both spouses to ask:
• What attitudes need to die?
• What habits have become idols?
• What grudges must be burned?
• What pride needs to be placed on the coals?

Romans 12:1 is marital truth: "Present your bodies a living sacrifice."

Marriage requires two people who are willing to kill anything that kills the marriage.
Atonement requires sacrifice—always.`,
    reflectionQuestions: [
      "What attitude in my heart needs to die on this altar today?",
      "What habit or pattern am I holding onto that hurts our marriage?",
      "What grudge am I refusing to burn? Why?",
      "Where is my pride preventing unity with my spouse?",
      "What idol (work, phone, hobby, comfort) competes with my marriage?"
    ],
    coupleExercises: [
      "Together, write down one thing each of you will 'sacrifice' this week—an attitude, habit, or grudge. Share why it needs to go.",
      "Light a candle together and symbolically 'burn' the thing you're releasing by writing it down and tearing it up.",
      "Each spouse: Identify one way you've been selfish this week and confess it to your partner.",
      "Pray together, asking God to consume anything in your hearts that destroys oneness."
    ],
    scriptureReferences: [
      "Romans 12:1 - Present your bodies a living sacrifice",
      "Leviticus 1:3-9 - The burnt offering procedures",
      "Galatians 2:20 - I am crucified with Christ",
      "Philippians 2:3-4 - Let nothing be done through selfish ambition"
    ],
    prayerPrompt: "Lord, we place on Your altar everything that destroys our oneness. Consume our pride, our selfishness, our grudges. Make us living sacrifices, willing to die to ourselves for the sake of our covenant. Amen."
  },
  {
    id: 2,
    name: "The Laver",
    principle: "Cleansing & Accountability",
    sanctuaryMeaning: "Washing; self-examination; purity for ministry.",
    marriagePrinciple: "Wash before you serve your spouse.",
    detailedTeaching: `Priests didn't guess whether they were clean—they examined themselves in the laver's mirrored bronze.

At-one-ment in marriage requires:
• Honest confession
• Emotional hygiene
• Apologies without excuses
• Trauma cleansing
• Accountability systems

Ephesians 5:26 says Christ "washes" His church with the Word.
A spouse who never washes their spirit will carry dirt into the marriage.

Unclean hearts contaminate the relationship.
Cleansing restores safety.

The laver says: Before you minister to your spouse, wash.
Before you speak, wash.
Before you judge, wash.`,
    reflectionQuestions: [
      "What emotional 'dirt' am I carrying into my marriage today?",
      "Have I examined myself honestly, or am I only seeing my spouse's faults?",
      "What apology do I owe that I've been avoiding?",
      "What past hurt or trauma needs cleansing through confession and prayer?",
      "Am I accountable to anyone for how I treat my spouse?"
    ],
    coupleExercises: [
      "Each spouse: Look in a mirror and ask God to show you what needs washing before you speak to your partner.",
      "Practice a 'clean slate' conversation: Confess one thing you've done wrong without making excuses or blaming.",
      "Create an accountability plan: Who can you both go to when you're struggling in your marriage?",
      "Wash each other's feet together as a symbol of humility and service (John 13)."
    ],
    scriptureReferences: [
      "Ephesians 5:26 - Cleansed with the washing of water by the word",
      "Exodus 30:17-21 - The laver instructions for priests",
      "James 5:16 - Confess your faults one to another",
      "1 John 1:9 - If we confess, He is faithful to forgive"
    ],
    prayerPrompt: "Father, wash us clean. Show us the dirt in our own hearts before we judge our spouse. Help us confess honestly, apologize without excuses, and create a marriage where both feel safe to be vulnerable. Amen."
  },
  {
    id: 3,
    name: "Table of Shewbread",
    principle: "Nourishment & Provision",
    sanctuaryMeaning: "Fellowship, covenant meals, divine provision.",
    marriagePrinciple: "Feed what you want to grow.",
    detailedTeaching: `Twelve loaves—always before God—symbolize continual nourishment.

Marriage starves when spouses:
• Stop feeding each other emotionally
• Stop feeding the relationship time
• Stop feeding the connection with shared experiences
• Stop feeding the covenant with prayer and Scripture

The table teaches this:
You cannot reap intimacy where you do not sow nourishment.

Jesus broke bread and fellowship formed.
So must spouses.

Questions from the Table:
• What have I placed on the table for my spouse today?
• What emotional bread am I giving?
• What shared rituals keep our covenant alive?
• What words nourish instead of deplete?

Nourish the marriage, or something else will feed on it.`,
    reflectionQuestions: [
      "What have I 'fed' my spouse this week—encouragement, time, affection, or neglect?",
      "When was the last time we shared a meaningful meal without distractions?",
      "What words have I spoken—do they nourish or deplete my spouse?",
      "What shared ritual (prayer, date night, morning coffee) have we let die?",
      "Am I expecting to harvest intimacy without planting seeds of nourishment?"
    ],
    coupleExercises: [
      "Plan and share a meal together this week—no phones, no TV, just conversation.",
      "Each spouse: Write down 3 ways you've nourished your partner recently and 3 ways you've starved them.",
      "Create a weekly 'bread ritual'—something you do together every week without fail (prayer, walk, coffee date).",
      "Feed your spouse 'emotional bread': Give 5 genuine compliments or affirmations this week."
    ],
    scriptureReferences: [
      "Leviticus 24:5-9 - The continual showbread instructions",
      "Matthew 4:4 - Man shall not live by bread alone",
      "Luke 24:30-31 - Jesus broke bread and they recognized Him",
      "Proverbs 31:15 - She rises and gives food to her household"
    ],
    prayerPrompt: "Lord, we've let our marriage starve. Teach us to nourish each other daily—with time, words, affection, and shared experiences. Help us break bread together and see You in each other. Amen."
  },
  {
    id: 4,
    name: "Golden Candlestick",
    principle: "Passion & Spiritual Illumination",
    sanctuaryMeaning: "The Spirit's fire; light for ministry; continual burning oil.",
    marriagePrinciple: "Keep the fire burning.",
    detailedTeaching: `Marriage burns out when oil runs low.

Oil = the Holy Spirit.

No amount of date nights can fix a marriage with no oil.
No marriage with oil burns out.

To keep the lamp burning:
• Protect the atmosphere of the home
• Refuel with time together
• Refuel with prayer
• Refuel with affirmations
• Refuel with emotional availability
• Cut off anything that drains the flame

The priests trimmed the lamps every single morning and evening.

Marriage requires the same rhythm:
Daily trimming of distractions,
Daily pouring of oil,
Daily tending to the flame.

Passion is not spontaneous—it is maintained.`,
    reflectionQuestions: [
      "Is the 'oil' (Holy Spirit) flowing in my personal life and our marriage?",
      "What is draining the flame—stress, busyness, neglect, sin?",
      "When did we last 'refuel' with time together, prayer, or intimacy?",
      "What distractions need to be 'trimmed' from our daily rhythm?",
      "Am I tending to the flame daily, or waiting for it to reignite on its own?"
    ],
    coupleExercises: [
      "Together, identify 3 things that drain your marriage 'flame' and commit to trimming them this week.",
      "Create a daily rhythm: Pray together every morning or evening—no excuses, no skipping.",
      "Refuel the passion: Schedule a date night, a weekend away, or an intentional time of physical and emotional intimacy.",
      "Light a candle each night this week as a reminder to tend to your marriage flame daily."
    ],
    scriptureReferences: [
      "Exodus 27:20-21 - Oil for the light to burn continually",
      "Matthew 25:1-13 - Parable of the ten virgins and their oil",
      "Song of Solomon 8:6-7 - Love is a flame that many waters cannot quench",
      "Proverbs 5:18-19 - Rejoice with the wife of your youth"
    ],
    prayerPrompt: "Father, pour Your Spirit into our marriage. Rekindle the flame that has grown dim. Give us discipline to tend to our love daily—trimming distractions and pouring in the oil of Your presence. Amen."
  },
  {
    id: 5,
    name: "Altar of Incense",
    principle: "Prayer & Intimacy",
    sanctuaryMeaning: "Intercession; fragrance; closeness to God; the place just before the veil.",
    marriagePrinciple: "Turn your marriage into a place of intercession.",
    detailedTeaching: `Incense represents:
• Prayer
• Affection
• Tenderness
• Words that rise like fragrance
• Emotional intimacy
• Intercessory love

This altar teaches the deepest truth of marital reconciliation:
If you pray for your spouse more than you complain about them,
the fragrance will fill the home.

Incense changes the atmosphere long before it changes the circumstance.

Here is where spouses learn:
• Pray with each other
• Pray for each other
• Pray for wounds you cannot heal
• Pray for attitudes you cannot change
• Pray for unity you cannot manufacture

The incense altar says:
Intimacy rises where prayer rises.
Distance forms where incense dies.`,
    reflectionQuestions: [
      "Do I pray for my spouse more than I complain about them?",
      "When was the last time we prayed together—not at meals, but truly interceded together?",
      "What wound in my spouse do I need to stop trying to fix and start praying about?",
      "What attitude in my spouse frustrates me—am I bringing it to God or just resenting them?",
      "Is the 'fragrance' of my words and affection filling our home or polluting it?"
    ],
    coupleExercises: [
      "Pray together for 10 minutes each day this week—not about groceries or schedules, but for each other's hearts.",
      "Each spouse: Write a prayer for your partner's struggles, dreams, and fears. Share it with them.",
      "Create an 'incense moment': Light incense or a candle, sit together in silence, and intercede for your marriage.",
      "Practice tender words: For one week, speak to your spouse the way you would in prayer—gently, humbly, lovingly."
    ],
    scriptureReferences: [
      "Exodus 30:1-10 - The golden altar of incense",
      "Psalm 141:2 - Let my prayer be set before You as incense",
      "Revelation 8:3-4 - Incense with the prayers of the saints",
      "1 Peter 3:7 - Pray together so prayers aren't hindered"
    ],
    prayerPrompt: "Lord, we've neglected the altar of incense. Teach us to pray together, to intercede for each other, to speak tender words that rise like fragrance. Change the atmosphere of our home through prayer. Amen."
  },
  {
    id: 6,
    name: "Ark of the Covenant",
    principle: "Covenant & Mercy",
    sanctuaryMeaning: "God's throne; law beneath; mercy seat above; Shekinah glory between.",
    marriagePrinciple: "Build the marriage on law AND mercy.",
    detailedTeaching: `The ark is the blueprint for covenant unity.

Inside:
• The law (boundaries, values, moral structure)
• The manna (God's provision in hard seasons)
• Aaron's rod that budded (resurrection of dead things)

Above:
• The mercy seat

In marriage:
Law without mercy = legalism.
Mercy without law = chaos.
Law beneath mercy = covenant love.

This is the pattern for marital at-one-ment:
• Keep God's boundaries (law)
• Remember how God carried you (manna)
• Believe dead things can live (budded rod)
• Cover each other with mercy (mercy seat)

When couples build a marriage with law and mercy in the wrong order, unity collapses.

God's order is deliberate:
First law,
Then blood,
Then mercy.

That order saves sinners—
and that order saves marriages.`,
    reflectionQuestions: [
      "Are we building our marriage on God's boundaries (law) or just our feelings?",
      "Have I been offering law without mercy (criticism, control) or mercy without law (enabling, avoiding conflict)?",
      "What 'dead thing' in our marriage needs resurrection—trust, passion, friendship, hope?",
      "How have we seen God provide for us in hard seasons (manna)?",
      "Do I believe God can resurrect what feels dead in our relationship?"
    ],
    coupleExercises: [
      "Together, write out 3 'laws' (boundaries, values) you both agree are non-negotiable in your marriage.",
      "Each spouse: Identify one area where you've been legalistic (harsh judgment) and one area where you need to show more mercy.",
      "Create a 'manna memorial': List 5 ways God has provided for you in your hardest seasons. Thank Him together.",
      "Name one 'dead' area of your marriage and pray Aaron's-rod prayers: 'God, resurrect what feels dead.'"
    ],
    scriptureReferences: [
      "Exodus 25:10-22 - The ark of the covenant instructions",
      "Hebrews 9:4 - What was inside the ark: law, manna, Aaron's rod",
      "Numbers 17:8 - Aaron's rod budded, showing God's power to resurrect",
      "Romans 3:23-25 - God's mercy seat (propitiation) covers our sin"
    ],
    prayerPrompt: "Father, we build our marriage on Your law and Your mercy. Help us set boundaries rooted in Your Word and cover each other with grace. Resurrect what feels dead. Remind us of Your provision. Make our marriage a place where Your glory dwells. Amen."
  }
];

export const MARRIAGE_BLUEPRINT_INTRO = {
  title: "At-One-Ment in Marriage Through the Six Articles of Sanctuary Furniture",
  subtitle: "A Blueprint Study for Healing, Unity, and Covenant Restoration",
  description: `The sanctuary is not only the plan of salvation—
it is the pattern for rebuilding anything broken,
the architecture for unity,
and the heavenly formula for at-one-ment (Lev 16:30).

When applied to marriage, the same pattern that restores sinners to God can restore spouses to each other.

We walk article by article—from the gate to the ark—
rebuilding covenant love the same way God rebuilds covenant humanity.`,
  quote: "Atonement begins only where something is placed on the altar and consumed."
};
