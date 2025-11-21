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
    name: "Altar of Sacrifice",
    principle: "Surrendered Dating",
    sanctuaryMeaning: "Death to self, consecration, surrender.",
    marriagePrinciple: "Kill the things that would sabotage your future marriage.",
    detailedTeaching: `Before dating begins, something must die:
• Unrealistic expectations
• Lust-driven motives
• Flesh-driven impulses
• Past baggage you haven't surrendered
• Narcissistic tendencies
• Fear of commitment
• Dating just to date
• Seeking validation instead of covenant

This is where you ask:
• Am I dating for fun or for purpose?
• Am I emotionally whole enough to date?
• Have I sacrificed past soul-ties, trauma, or unhealed wounds?
• Do I need inner healing before attaching myself to someone else?

Dating begins with surrender.
Surrender prepares the heart for covenant.

No altar = no survival.`,
    reflectionQuestions: [
      "What unrealistic expectations am I carrying into dating?",
      "Am I dating for purpose or just for validation?",
      "What past wounds or soul-ties do I need to surrender before dating?",
      "Am I emotionally whole enough to enter a relationship?",
      "What flesh-driven motives need to die on this altar?"
    ],
    coupleExercises: [
      "Write down 3 things you need to 'sacrifice' before entering or continuing this relationship.",
      "Have an honest conversation: What are we each bringing to this relationship that needs healing?",
      "Pray individually: Ask God to reveal what needs to die before you can build something healthy.",
      "Create a 'dating covenant': Define together what surrendered, purposeful dating looks like for you both."
    ],
    scriptureReferences: [
      "Genesis 22:2 - Abraham's willingness to sacrifice Isaac",
      "Romans 12:1 - Present your bodies a living sacrifice",
      "Matthew 16:24 - Take up your cross and follow Me",
      "Galatians 5:24 - Those who are Christ's have crucified the flesh"
    ],
    prayerPrompt: "Lord, I surrender everything that would sabotage covenant love. Kill my selfish motives, unrealistic expectations, and unhealed wounds. Prepare my heart for covenant by teaching me to die to myself. Amen."
  },
  {
    id: 2,
    name: "The Laver",
    principle: "Reflection, Character Check, & Clean Dating",
    sanctuaryMeaning: "Washing, purification, self-examination.",
    marriagePrinciple: "Get clean before you get close.",
    detailedTeaching: `Dating requires cleansing:

1. Self-Washing:
• Emotional hygiene
• Therapy if needed
• Learning communication skills
• Identifying your triggers
• Becoming self-aware

A person who refuses the laver brings dirt into the relationship.

2. Relationship-Washing:
This is where two people look honestly at:
• Character
• Patterns
• Emotional health
• Anger issues
• Boundaries
• Compatibility
• Spiritual maturity

Dating is not blind chemistry—
it is sober clarity.

The laver is where you wash away illusions and see the truth.

No laver = deception, fantasy, and hidden danger.`,
    reflectionQuestions: [
      "What emotional 'dirt' am I carrying that I need to wash before dating?",
      "Have I done the work of therapy, healing, and self-awareness?",
      "Am I seeing this person clearly, or am I blinded by chemistry?",
      "What red flags have I been ignoring?",
      "What character traits do I need to honestly assess in myself and this person?"
    ],
    coupleExercises: [
      "Each person: Spend 10 minutes in honest self-reflection. Write down 3 areas where you need personal growth.",
      "Have a 'clean conversation': What are the difficult truths we need to address about our compatibility?",
      "Create a character assessment: Rate yourself and each other on key traits (honesty, patience, emotional health, spiritual maturity).",
      "Practice washing away illusions: Name one fantasy or unrealistic expectation you've had about this relationship."
    ],
    scriptureReferences: [
      "Exodus 30:17-21 - The laver instructions for priests",
      "Ephesians 5:26 - Cleansed with the washing of water by the word",
      "Psalm 139:23-24 - Search me, O God, and know my heart",
      "James 1:23-25 - Looking into the mirror of God's Word"
    ],
    prayerPrompt: "Lord, wash me clean before I get close to someone else. Show me my blind spots, my triggers, my unhealed places. Give us both clarity to see each other honestly—not through fantasy, but through Your truth. Amen."
  },
  {
    id: 3,
    name: "Table of Shewbread",
    principle: "Friendship, Consistency & Nurturing Connection",
    sanctuaryMeaning: "Nourishment, fellowship, consistent provision.",
    marriagePrinciple: "Build friendship first. Feed the relationship slowly and consistently.",
    detailedTeaching: `The shewbread teaches:
• Stability
• Predictability
• Nurturing conversations
• Sharing life
• Developing emotional intimacy
• Learning each other's rhythms

This is the "friendship phase" of dating—
the most ignored and most necessary part.

Questions from the Table:
• Can we talk for hours?
• Do we enjoy each other's presence?
• Are we spiritually aligned?
• Do we nourish each other or drain each other?
• Are we consistent, or is this a roller coaster?

Bread before wine.
Friendship before romance.
Stability before passion.

If you feed a relationship steadily, trust grows.
If you feed it junk (rush, feelings only, chaos), it starves.`,
    reflectionQuestions: [
      "Can we have deep, meaningful conversations for hours?",
      "Do we genuinely enjoy each other's company without physical attraction?",
      "Are we spiritually aligned and growing together?",
      "Does this relationship nourish me or drain me?",
      "Are we building a stable foundation or riding an emotional roller coaster?"
    ],
    coupleExercises: [
      "Have a 'friendship date': Do something together that focuses on conversation and shared experience (no physical intimacy).",
      "Share your life stories: Each person takes 30 minutes to share their background, dreams, and values.",
      "Create a shared ritual: Establish one weekly consistent activity (coffee, walk, prayer time) that nourishes your connection.",
      "Assessment: Rate your relationship on stability (1-10). Discuss what would make it more consistent and nourishing."
    ],
    scriptureReferences: [
      "Leviticus 24:5-9 - The continual showbread instructions",
      "Proverbs 17:17 - A friend loves at all times",
      "Ecclesiastes 4:9-12 - Two are better than one",
      "John 15:13-15 - Jesus calls His disciples friends"
    ],
    prayerPrompt: "Lord, help us build a friendship that goes deeper than attraction. Teach us to nourish each other consistently with conversation, time, and shared life. Let stability form the foundation of what we're building. Amen."
  },
  {
    id: 4,
    name: "Golden Candlestick",
    principle: "Clarity, Discernment & Holy Attraction",
    sanctuaryMeaning: "Illumination, revelation, Holy Spirit light, clarity.",
    marriagePrinciple: "See clearly. Discern the person. Let God illuminate the relationship.",
    detailedTeaching: `At this stage God gives light:
• Discernment
• Red flags
• Character revelation
• Spiritual compatibility
• Purpose alignment
• Emotional maturity
• Long-term vision

The candlestick stage asks:
• Where is this relationship going?
• Are we progressing toward covenant or drifting?
• Is this person walking in the Spirit?
• Are we becoming better Christians because of each other?

This is where romantic attraction is tested by spiritual light.

Emotions can blind you,
but the candlestick exposes everything.

If God's Spirit dims your peace, don't ignore it.
If God's Spirit brightens your peace, move forward.`,
    reflectionQuestions: [
      "Is God's Spirit giving me peace or warning me about this relationship?",
      "What red flags have been illuminated that I've been ignoring?",
      "Are we spiritually compatible, or am I hoping they'll change?",
      "Is this relationship making me a better Christian or pulling me away from God?",
      "Where is this relationship actually going—toward covenant or just drifting?"
    ],
    coupleExercises: [
      "Separately, pray and ask God: 'Is this the person You have for me?' Write down what you sense.",
      "Have a 'vision conversation': Where do each of you see this relationship going in 6 months, 1 year, 5 years?",
      "Character assessment: List 5 character traits you see in each other. Are they aligned with what God desires?",
      "Create a spiritual alignment check: Discuss your beliefs, values, and spiritual practices. Are you walking in the same direction?"
    ],
    scriptureReferences: [
      "Exodus 27:20-21 - Oil for the light to burn continually",
      "Psalm 119:105 - Your word is a lamp to my feet and a light to my path",
      "Proverbs 3:5-6 - Trust in the LORD and He will direct your paths",
      "1 Corinthians 7:39 - Marry only in the Lord"
    ],
    prayerPrompt: "Lord, turn on the light. Show me clearly who this person really is. Illuminate any red flags, reveal their character, and give me discernment. If this is Your will, brighten my peace. If not, dim the flame. Amen."
  },
  {
    id: 5,
    name: "Altar of Incense",
    principle: "Prayer, Emotional Intimacy & Unity",
    sanctuaryMeaning: "Intercession, aroma, relational closeness, atmosphere.",
    marriagePrinciple: "Build spiritual intimacy and emotional closeness without violating boundaries.",
    detailedTeaching: `Before a couple enters the Most Holy Place (marriage),
they must learn the altar of incense:

1. Pray Together
Not flesh-driven prayer—
but covenant-forming prayer.
• Pray about your future
• Pray for each other's weaknesses
• Pray over fears
• Pray for clarity
• Pray for holiness

2. Build Emotional Intimacy
This is where you learn each other's:
• Dreams
• Wounds
• Fears
• Family patterns
• Love languages
• Emotional needs

3. Protect Physical Boundaries
Incense is aroma, not fire.

This is where couples learn:
Emotional closeness without violating holiness.
Spiritual intimacy without premature physical intimacy.

Too many couples get to the altar of incense
and light the wrong fire.

That fire belongs ONLY in the Most Holy Place—marriage.

The incense stage prepares the atmosphere for covenant.`,
    reflectionQuestions: [
      "Are we praying together regularly about our future?",
      "Have we built deep emotional intimacy without crossing physical boundaries?",
      "Do we know each other's wounds, dreams, and fears?",
      "Are we protecting the 'fire' that belongs only in marriage?",
      "Is the atmosphere of our relationship holy, or are we compromising purity?"
    ],
    coupleExercises: [
      "Commit to praying together 3 times this week about your relationship and future.",
      "Share vulnerably: Each person shares one wound from their past and one dream for the future.",
      "Set clear physical boundaries: Write them down and commit to accountability.",
      "Create an 'incense moment': Light a candle, pray together, and discuss how you're preparing for covenant (not just wedding)."
    ],
    scriptureReferences: [
      "Exodus 30:1-10 - The golden altar of incense",
      "Psalm 141:2 - Let my prayer be set before You as incense",
      "1 Thessalonians 4:3-5 - God's will is your sanctification; abstain from sexual immorality",
      "Hebrews 13:4 - Marriage is honorable and the bed undefiled"
    ],
    prayerPrompt: "Lord, teach us to build spiritual and emotional intimacy without violating Your boundaries. Help us pray together, know each other deeply, and protect the fire that belongs in marriage alone. Prepare us for covenant. Amen."
  },
  {
    id: 6,
    name: "Ark of the Covenant",
    principle: "Covenant Marriage (The Most Holy Place)",
    sanctuaryMeaning: "God's throne, covenant law, glory, permanence, unity.",
    marriagePrinciple: "Marriage is the Most Holy Place—entered with honor, reverence, covenant, and lifelong unity.",
    detailedTeaching: `Marriage is not the wedding ceremony.
It is the ark:

Inside the Ark (Your Marriage):

1. The Law — Covenant Boundaries
Healthy marriage requires:
• Faithfulness
• Honesty
• Shared values
• Mutual submission
• Holiness
• Accountability
• Clear roles & responsibilities

The law doesn't restrict love—
it protects it.

2. The Manna — Daily Provision
Marriage is not dramatic passion.
It is daily provision:
• Daily kindness
• Daily communication
• Daily emotional nourishment
• Daily forgiveness

3. Aaron's Rod — Growth & Resurrection
The rod budded inside the ark—
symbolizing that marriage brings:
• New life
• New intimacy
• Growth
• Miracles
• Restoration even after conflict

4. The Mercy Seat — Forgiveness & Unconditional Love
Every lasting marriage rests on:
• Mercy
• Grace
• Compassion
• Patience
• Covering each other
• Choosing forgiveness over revenge

Above the law is mercy.
Above your spouse's mistakes is mercy.
Above your covenant is mercy.

Mercy is the glory that fills the marriage.`,
    reflectionQuestions: [
      "Are we building our marriage on God's law (boundaries) or just feelings?",
      "Do we practice daily provision—kindness, communication, forgiveness?",
      "What 'dead thing' in our marriage needs resurrection through God's power?",
      "Are we covering each other with mercy, or keeping score?",
      "Is God's glory dwelling in our home, or have we made marriage about us instead of Him?"
    ],
    coupleExercises: [
      "Write your marriage 'law': 3-5 non-negotiable boundaries/values you both commit to.",
      "Practice daily provision: Each day this week, give one act of kindness, one word of affirmation, and one moment of forgiveness.",
      "Identify one 'dead' area of your marriage and pray Aaron's-rod prayers: 'Lord, resurrect this.'",
      "Mercy practice: Each spouse confesses one way they've been keeping score. Extend mercy to each other."
    ],
    scriptureReferences: [
      "Exodus 25:10-22 - The ark of the covenant instructions",
      "Hebrews 9:4 - What was inside the ark: law, manna, Aaron's rod",
      "Numbers 17:8 - Aaron's rod budded overnight",
      "Ephesians 5:25-33 - Husbands love your wives as Christ loved the church",
      "Colossians 3:12-14 - Put on love, which binds everything together"
    ],
    prayerPrompt: "Father, we enter the Most Holy Place of marriage with reverence. Help us keep Your law, extend mercy daily, trust Your provision, and believe You can resurrect what feels dead. Fill our marriage with Your glory. Amen."
  }
];

export const MARRIAGE_BLUEPRINT_INTRO = {
  title: "The Sanctuary Blueprint for Dating, Courtship & Marriage",
  subtitle: "Marriage = The Most Holy Place. Dating = The journey through the sanctuary that prepares you to enter sacred covenant.",
  sanctuaryExplanation: `**Understanding the Hebrew Sanctuary**

In the Old Testament, God gave Moses a detailed pattern for the sanctuary (Exodus 25:8-9)—a sacred tent where God's presence would dwell among His people. This wasn't just a building; it was a divine blueprint showing humanity how to approach a holy God.

The sanctuary contained six primary articles of furniture, arranged in a specific order:

1. **Altar of Sacrifice** (Outer Court) - Where animals were sacrificed; death to sin
2. **The Laver** (Outer Court) - A bronze basin for washing; cleansing and reflection
3. **Table of Shewbread** (Holy Place) - Twelve loaves of bread; daily provision and fellowship
4. **Golden Candlestick** (Holy Place) - Seven-branched lampstand; light and revelation
5. **Altar of Incense** (Holy Place) - Fragrant smoke rising; prayer and worship
6. **Ark of the Covenant** (Most Holy Place) - God's throne; His presence, law, and mercy

**God's Way is for EVERY Area of Life**

Here's the revelation: The sanctuary pattern wasn't just for worship services. It's God's master blueprint for how He works in every dimension of human life. The same God who designed the path to His presence also designed the path to freedom, healing, relationships, and restoration.

The sanctuary principles apply to:
• Breaking strongholds and addictions
• Navigating grief and loss
• Building healthy relationships and marriages
• Personal transformation and sanctification
• Emotional healing and mental renewal
• Spiritual warfare and victory

**Practical Application for Life**

When you understand the sanctuary pattern, you unlock God's methodology for life change. Just as the Israelite couldn't skip the altar and jump straight into God's presence, we cannot skip the necessary steps in our own journey toward freedom, healing, or covenant relationships.

The sanctuary teaches us that transformation is:
• **Progressive** - Each step prepares you for the next
• **Ordered** - Sequence matters; you can't skip stages
• **Architectural** - Built with intention, not left to chance
• **Christ-Centered** - Every piece points to Jesus, our ultimate High Priest

This blueprint reveals that God's way is not random or chaotic. He has a pattern, a process, and a path. Whether you're fighting sin, grieving loss, or building a marriage—the sanctuary shows you the way.`,
  description: `Just as Israel approached God progressively, couples must approach marriage in order, with reverence, discernment, and maturity.

Skipping parts of the sanctuary always leads to disaster.
Following the pattern always leads to covenant glory.`,
  quote: "Dating begins with surrender. Surrender prepares the heart for covenant. No altar = no survival."
};
