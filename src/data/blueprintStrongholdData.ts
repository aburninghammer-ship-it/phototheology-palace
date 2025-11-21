export const STRONGHOLD_BLUEPRINT_INTRO = {
  title: "The Sanctuary Blueprint for Breaking Strongholds & Habits",
  subtitle: "How God's Six-Furniture Pattern Demolishes Sin Patterns, Addictions, Cycles, and Mental Strongholds",
  sanctuaryExplanation: `## Understanding the Hebrew Sanctuary

In the Old Testament, God gave Moses a detailed pattern for the sanctuary (Exodus 25:8-9)—a sacred tent where God's presence would dwell among His people. This wasn't just a building; it was a divine blueprint showing humanity how to approach a holy God and walk through life transformation.

### The Six Articles of Furniture

The sanctuary contained six primary articles of furniture, arranged in a specific progressive order from the outer court to the Most Holy Place:

🔥 **1. Altar of Sacrifice** (Outer Court)  
Where animals were sacrificed as substitutes for sin; represents death to the old self and complete surrender.  
📖 *Scriptural Foundation:* Leviticus 1-7; Hebrews 10:1-10  
🔗 [Learn more about the Altar of Sacrifice](https://www.biblegateway.com/passage/?search=Exodus+27%3A1-8&version=KJV)

💧 **2. The Laver** (Outer Court)  
A bronze basin filled with water for ceremonial washing; symbolizes cleansing, self-reflection, and preparation for service.  
📖 *Scriptural Foundation:* Exodus 30:17-21; Ephesians 5:26  
🔗 [Explore the Laver's significance](https://www.biblegateway.com/passage/?search=Exodus+30%3A17-21&version=KJV)

🍞 **3. Table of Shewbread** (Holy Place)  
Twelve loaves of bread representing the twelve tribes; signifies God's daily provision, consistency, and fellowship.  
📖 *Scriptural Foundation:* Leviticus 24:5-9; John 6:35  
🔗 [Discover the Bread of Presence](https://www.biblegateway.com/passage/?search=Leviticus+24%3A5-9&version=KJV)

🕯️ **4. Golden Candlestick/Menorah** (Holy Place)  
Seven-branched lampstand that burned continually; represents the Holy Spirit's light, revelation, and guidance.  
📖 *Scriptural Foundation:* Exodus 25:31-40; John 8:12; Revelation 1:20  
🔗 [Study the Golden Lampstand](https://www.biblegateway.com/passage/?search=Exodus+25%3A31-40&version=KJV)

🌸 **5. Altar of Incense** (Holy Place)  
Golden altar where fragrant incense burned continually; symbolizes prayer, worship, and intimate communion with God.  
📖 *Scriptural Foundation:* Exodus 30:1-10; Psalm 141:2; Revelation 5:8  
🔗 [Understand the Altar of Incense](https://www.biblegateway.com/passage/?search=Exodus+30%3A1-10&version=KJV)

⚡ **6. Ark of the Covenant** (Most Holy Place)  
God's throne on earth containing the Law, Manna, and Aaron's Rod; represents God's presence, covenant, mercy, and ultimate restoration.  
📖 *Scriptural Foundation:* Exodus 25:10-22; Hebrews 9:1-5  
🔗 [Discover the Ark of the Covenant](https://www.biblegateway.com/passage/?search=Exodus+25%3A10-22&version=KJV)

---

### God's Way is for EVERY Area of Life

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
  description: `Strongholds do not break by willpower.
They break by process, by order, by architectural demolition.

The sanctuary is Heaven's blueprint for freedom.`,
  quote: "You cannot defeat what you are unwilling to kill."
};

export interface StrongholdArticle {
  id: number;
  name: string;
  principle: string;
  sanctuaryMeaning: string;
  strongholdPrinciple: string;
  detailedTeaching: string;
  reflectionQuestions: string[];
  actionSteps: string[];
  scriptureReferences: string[];
  prayerPrompt: string;
}

export const SANCTUARY_STRONGHOLD_ARTICLES: StrongholdArticle[] = [
  {
    id: 1,
    name: "The Altar of Sacrifice",
    principle: "The Principle of Renunciation & Death to the Old Self",
    sanctuaryMeaning: "Death to the flesh; surrender; destruction of what opposes God.",
    strongholdPrinciple: "You cannot defeat what you are unwilling to kill.",
    detailedTeaching: `At the altar, God demands renunciation, not negotiation.

This is where you:
• Name the stronghold
• Renounce it verbally
• Break agreement with it
• Lay the desire on the fire
• Place triggers on the altar
• Sacrifice access points
• Kill excuses
• Kill the version of you that feeds the habit

A stronghold cannot die until your allegiance to it dies.

This is where you say:
"I reject this."
"I release this."
"I surrender this."
"This is going on the altar."

The altar is violent.
Freedom always starts with death.`,
    reflectionQuestions: [
      "What stronghold am I ready to name and renounce before God?",
      "What version of myself needs to die for this habit to lose power?",
      "Am I trying to negotiate with this sin, or am I ready to sacrifice it completely?",
      "What excuses have I been making to keep this stronghold alive?"
    ],
    actionSteps: [
      "Write down the name of your stronghold and speak it aloud: 'I renounce [specific habit/sin].'",
      "Identify and confess any agreements you've made with this stronghold.",
      "List all access points and triggers—apps, places, people, times—and commit to eliminating them.",
      "Pray a prayer of surrender, placing this habit on God's altar and asking Him to consume it with His holy fire."
    ],
    scriptureReferences: [
      "Romans 6:6 - 'Our old self was crucified with him'",
      "Galatians 2:20 - 'I have been crucified with Christ'",
      "2 Corinthians 7:1 - 'Let us purify ourselves from everything that contaminates'",
      "James 4:7 - 'Submit yourselves to God. Resist the devil'"
    ],
    prayerPrompt: "Father, I lay [specific stronghold] on Your altar. I renounce every agreement I've made with this sin. Kill the version of me that feeds this habit. I surrender my will and ask You to consume this stronghold with Your holy fire. In Jesus' name, Amen."
  },
  {
    id: 2,
    name: "The Laver",
    principle: "The Principle of Closing Doors, Cleaning Triggers & Personal Accountability",
    sanctuaryMeaning: "Washing, cleansing, reflection, readiness.",
    strongholdPrinciple: "Clean the environment, clean the schedule, clean the mind, clean the access points.",
    detailedTeaching: `The laver forces truth and self-awareness:
• Where does the stronghold enter?
• What triggers it?
• What apps, environments, or people feed it?
• What emotional states activate it?
• What lies keep it alive?
• What trauma is connected to it?

This stage demands:

**Accountability**
You CANNOT break a stronghold alone.
• Accountability partners
• Counseling
• Filters
• Boundaries
• Supervision if needed

**Environmental Cleansing**
Strongholds need environments to survive.
Break the environment, break the habit.

**Self-Reflection**
The laver reveals:
• Patterns
• Roots
• Lies
• Cycles
• Wounds

The altar kills the sin.
The laver kills the access.`,
    reflectionQuestions: [
      "What specific environments, apps, or people are feeding this stronghold?",
      "What emotional states (loneliness, stress, anger) trigger this habit?",
      "What lies have I believed that keep this stronghold alive?",
      "Who can I trust to hold me accountable in this journey?"
    ],
    actionSteps: [
      "Make a list of every trigger—apps, places, times, emotional states—and eliminate or avoid them.",
      "Install accountability software, filters, or safeguards where needed.",
      "Identify 1-2 trustworthy people and ask them to be your accountability partners.",
      "Clean your physical and digital environment: delete apps, clear history, remove access points.",
      "Journal about the root wounds or trauma connected to this stronghold and consider seeking counseling."
    ],
    scriptureReferences: [
      "Psalm 139:23-24 - 'Search me, God, and know my heart'",
      "Proverbs 27:17 - 'As iron sharpens iron, so one person sharpens another'",
      "Ephesians 5:11 - 'Have nothing to do with the fruitless deeds of darkness'",
      "James 5:16 - 'Confess your sins to each other and pray for each other'"
    ],
    prayerPrompt: "Lord, expose every trigger, every access point, every lie that keeps this stronghold alive. Give me the courage to clean my environment and the humility to seek accountability. Search my heart and reveal the roots I need to address. Amen."
  },
  {
    id: 3,
    name: "The Table of Shewbread",
    principle: "The Principle of Replacement & New Daily Habits",
    sanctuaryMeaning: "Nourishment, daily bread, consistency.",
    strongholdPrinciple: "You cannot defeat a habit you do not replace.",
    detailedTeaching: `Deliverance without replacement = relapse.

This stage teaches:

**Replacement Power**
Don't just remove the stronghold—replace it with:
• New routines
• New inputs
• New patterns
• New spiritual disciplines
• New friendships
• New thought-habits

**Daily Bread Discipline**
Small, consistent habits break strongholds:
• Daily prayer
• Daily Scripture
• Daily gratitude
• Daily planning
• Daily worship
• Daily movement

Strongholds die from starvation.
You starve them by feeding new habits daily.

No table = guaranteed relapse.`,
    reflectionQuestions: [
      "What new habit can I put in place of the old destructive pattern?",
      "What daily spiritual disciplines am I willing to commit to?",
      "Am I feeding my spirit daily, or am I spiritually starving?",
      "What new routines will help me build a life free from this stronghold?"
    ],
    actionSteps: [
      "Create a daily routine that includes prayer, Scripture reading, and worship.",
      "Replace the time you spent on the stronghold with a positive activity (exercise, hobby, service).",
      "Start a daily gratitude journal to shift your focus from temptation to blessing.",
      "Build new friendships or strengthen existing ones that support your freedom.",
      "Set alarms or reminders to establish consistency in your new habits."
    ],
    scriptureReferences: [
      "Matthew 6:11 - 'Give us today our daily bread'",
      "Psalm 1:2-3 - 'His delight is in the law of the Lord'",
      "Matthew 12:43-45 - 'When an impure spirit comes out of a person...'",
      "Colossians 3:2 - 'Set your minds on things above'"
    ],
    prayerPrompt: "Father, help me replace old destructive habits with life-giving routines. Give me the discipline to feed my spirit daily. Let new patterns of worship, prayer, and Scripture take root in my life. Starve the stronghold by nourishing my soul. Amen."
  },
  {
    id: 4,
    name: "The Golden Candlestick",
    principle: "The Principle of Renewed Mind & Mental Reprogramming",
    sanctuaryMeaning: "Light, the Spirit's illumination, revelation.",
    strongholdPrinciple: "Expose lies, replace them with truth, and rewire the mind.",
    detailedTeaching: `Every stronghold is built on a lie.

The candlestick illuminates:
• Lies you believed
• Trauma buried
• False identities
• Cognitive distortions
• Enemy whispers
• Shame narratives

Then the Spirit gives light:
• Truth
• Identity
• Purpose
• Scripture promises
• Clarity
• Discernment
• Renewed thinking

This is Romans 12:2:
"Be transformed by the renewing of your mind."

New thoughts break old chains.

This is the stage where you:
• Memorize Scripture
• Declare truth out loud
• Visualize freedom
• Write affirmations
• Capture negative thoughts
• Replace them with Spirit-lit truth

Strongholds cannot survive light.`,
    reflectionQuestions: [
      "What lies have I believed that keep this stronghold in place?",
      "What false identity have I attached to this habit?",
      "What does God say about my true identity in Christ?",
      "How can I replace negative thought patterns with Scripture truth?"
    ],
    actionSteps: [
      "Identify the top 3 lies you've believed about yourself or this stronghold and write them down.",
      "Find Scripture verses that counter each lie and memorize them.",
      "Create affirmations based on your identity in Christ and declare them daily.",
      "Practice 'thought capture': when a negative thought comes, immediately replace it with truth.",
      "Spend time visualizing yourself walking in freedom, by the power of the Holy Spirit."
    ],
    scriptureReferences: [
      "Romans 12:2 - 'Be transformed by the renewing of your mind'",
      "2 Corinthians 10:5 - 'Take captive every thought to make it obedient to Christ'",
      "Philippians 4:8 - 'Whatever is true... think about such things'",
      "John 8:32 - 'The truth will set you free'"
    ],
    prayerPrompt: "Holy Spirit, shine Your light on every lie I've believed. Expose the false identities and shame narratives. Renew my mind with Your truth. Help me capture every thought and replace it with Scripture. Let Your light demolish every mental stronghold. Amen."
  },
  {
    id: 5,
    name: "The Altar of Incense",
    principle: "The Principle of Spirit-Powered Resistance & Emotional Healing",
    sanctuaryMeaning: "Prayer, intercession, atmosphere, closeness.",
    strongholdPrinciple: "Prayer becomes the warfare, the atmosphere shifts, and emotional wounds begin to heal.",
    detailedTeaching: `Strongholds thrive in unhealed emotion.

The incense altar addresses:
• Root wounds
• Emotional trauma
• Abandonment
• Rejection
• Fear
• Shame
• Grief
• Loneliness

Here, prayer is not routine—it is war.

This is where you:
• Cry out
• Groan
• Intercede for yourself
• Receive supernatural strength
• Experience emotional release
• Let God reframe the pain
• Allow His presence to comfort

Incense changes the atmosphere.
Prayer changes the habit.
Healing changes the cycle.`,
    reflectionQuestions: [
      "What emotional wounds am I carrying that feed this stronghold?",
      "Have I invited the Holy Spirit into my pain, or am I still trying to manage it alone?",
      "What unresolved trauma needs God's healing touch?",
      "Am I willing to groan, cry, and intercede until breakthrough comes?"
    ],
    actionSteps: [
      "Set aside time for deep, honest prayer—cry out to God about your pain and wounds.",
      "Ask the Holy Spirit to reveal root wounds connected to this stronghold.",
      "Pray for emotional healing and invite God to reframe past trauma.",
      "Consider Christian counseling or inner healing prayer ministry.",
      "Create a prayer atmosphere: worship music, journaling, solitude—let God shift the environment."
    ],
    scriptureReferences: [
      "Romans 8:26 - 'The Spirit intercedes for us through wordless groans'",
      "Psalm 34:18 - 'The Lord is close to the brokenhearted'",
      "Isaiah 61:1-3 - 'To bind up the brokenhearted... comfort all who mourn'",
      "Hebrews 4:16 - 'Approach God's throne of grace with confidence'"
    ],
    prayerPrompt: "Father, I bring my wounded heart before You. Heal the rejection, shame, fear, and trauma that feed this stronghold. Holy Spirit, intercede for me when I have no words. Change the atmosphere of my life. Let Your presence become my refuge. Amen."
  },
  {
    id: 6,
    name: "The Ark of the Covenant",
    principle: "The Principle of Covenant Identity, Permanent Freedom & New Life",
    sanctuaryMeaning: "God's throne, identity, presence, mercy.",
    strongholdPrinciple: "You do not just break the habit—you become someone who no longer identifies with it.",
    detailedTeaching: `Inside the ark are the ingredients for lasting freedom:

**1. The Law — New Boundaries**
Freedom requires:
• Clear boundaries
• Non-negotiables
• Structure
• Honor codes
• Accountability systems
• Personal standards

**2. The Manna — Daily Dependence**
Freedom is not an event—it is a daily walk.
You need:
• Daily surrender
• Daily truth intake
• Daily strength
• Daily communion

The manna mindset says:
"I can't live off yesterday's victory. I need God today."

**3. Aaron's Rod — Evidence of Transformation**
The rod budded from a dead stick.
Your new life will show:
• New desires
• New behaviors
• New confidence
• New peace
• New identity
• New habits
• New relationships

This is visible fruit.

**4. The Mercy Seat — Grace Over Your Healing Journey**
Even after freedom begins, you may stumble.
Mercy sits over:
• Setbacks
• Weak days
• Triggers
• Failures
• Regression

Mercy does not excuse sin.
It refuses to let shame rebuild the stronghold.

Mercy protects the healing.`,
    reflectionQuestions: [
      "What new boundaries do I need to establish to protect my freedom?",
      "Am I depending on God daily, or am I relying on past victories?",
      "What evidence of transformation is visible in my life?",
      "How can I extend mercy to myself without excusing sin?"
    ],
    actionSteps: [
      "Write out clear boundaries and non-negotiables for your new life of freedom.",
      "Commit to daily dependence: prayer, Scripture, surrender, and communion with God.",
      "Document the evidence of transformation—new desires, behaviors, and peace.",
      "Practice mercy toward yourself when you stumble, but don't let mercy become an excuse.",
      "Celebrate every victory, no matter how small, as proof that God is working in you."
    ],
    scriptureReferences: [
      "2 Corinthians 5:17 - 'Therefore, if anyone is in Christ, the new creation has come'",
      "Galatians 5:1 - 'It is for freedom that Christ has set us free'",
      "Philippians 1:6 - 'He who began a good work in you will carry it on to completion'",
      "Lamentations 3:22-23 - 'His mercies never fail. They are new every morning'"
    ],
    prayerPrompt: "Lord, I am a new creation in Christ. Help me build boundaries that protect my freedom. I depend on You daily—not on yesterday's victory. Let visible transformation be evidence of Your work in me. When I stumble, let Your mercy protect the healing without excusing sin. I am free. Amen."
  }
];
