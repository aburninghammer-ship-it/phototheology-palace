export interface SanctuaryArticle {
  id: number;
  name: string;
  principle: string;
  sanctuaryMeaning: string;
  griefPrinciple: string;
  detailedTeaching: string;
  reflectionQuestions: string[];
  healingExercises: string[];
  scriptureReferences: string[];
  prayerPrompt: string;
}

export const SANCTUARY_GRIEF_ARTICLES: SanctuaryArticle[] = [
  {
    id: 1,
    name: "Altar of Sacrifice",
    principle: "Surrendering the Loss",
    sanctuaryMeaning: "Death. Surrender. Letting go of what cannot be saved.",
    griefPrinciple: "Grieving begins when you acknowledge the reality of the loss.",
    detailedTeaching: `The altar is where something dies.
Grief begins with the painful acceptance:

"This happened."
"They're gone."
"My life just changed."
"The old normal is dead."

This is not spiritual weakness—
it is spiritual honesty.

At the altar you bring:
• Shock
• Confusion
• Fear
• Anger
• Deep sorrow
• "Why, God?"
• "I can't do this."

And you place them on God's fire.

Grief that is not placed on the altar becomes bitterness.
Grief placed on the altar becomes healing.

The altar is the place where you stop pretending
and start grieving.`,
    reflectionQuestions: [
      "What loss am I still refusing to acknowledge?",
      "What emotions (anger, confusion, fear) do I need to place on God's altar?",
      "Where have I been pretending to be 'fine' instead of grieving honestly?",
      "What 'old normal' am I clinging to that has already died?",
      "Am I willing to stop running from the pain and face the reality of this loss?"
    ],
    healingExercises: [
      "Write a letter to God placing your shock, anger, and confusion on His altar. Be completely honest.",
      "Say out loud: 'This happened. This is real. My life has changed.' Let yourself feel the weight of those words.",
      "Create a 'grief altar': Light a candle and symbolically place your loss before God through prayer.",
      "Journal: What am I most afraid of in acknowledging this loss?"
    ],
    scriptureReferences: [
      "Psalm 34:18 - The LORD is near to the brokenhearted",
      "Psalm 147:3 - He heals the brokenhearted and binds up their wounds",
      "Matthew 5:4 - Blessed are those who mourn, for they shall be comforted",
      "2 Corinthians 1:3-4 - God of all comfort who comforts us in our affliction"
    ],
    prayerPrompt: "Lord, I bring my loss to Your altar. I acknowledge the pain, the confusion, the anger. I'm not pretending anymore. This hurts. Help me surrender what I cannot change and find healing in Your presence. Amen."
  },
  {
    id: 2,
    name: "The Laver",
    principle: "Tears, Honest Feelings & Emotional Cleansing",
    sanctuaryMeaning: "Washing, reflection, cleansing, preparation.",
    griefPrinciple: "God cleanses the soul through tears, honesty, lament, and emotional release.",
    detailedTeaching: `The laver was made of mirrors—
symbolizing self-reflection.

In grief, this is where you:
• Cry
• Lament
• Journal
• Speak honestly
• Express anger
• Admit confusion
• Let the tears wash your heart

Tears are not weakness;
they are God's cleansing mechanism.

Psalm 56:8 says God collects tears in a bottle—
He sees every drop.

The laver stage is NOT "be strong."
It is:
• "Let it out."
• "Feel it fully."
• "Tell God everything."
• "Wash the soul."

This is where the heart begins to breathe again.`,
    reflectionQuestions: [
      "Have I allowed myself to cry, or am I holding back my tears?",
      "What honest emotions (anger, confusion, despair) have I been suppressing?",
      "Am I trying to 'be strong' instead of allowing myself to grieve?",
      "What would I say to God if I held nothing back?",
      "Do I believe that tears are part of healing, not a sign of weakness?"
    ],
    healingExercises: [
      "Set aside 15 minutes to cry without shame. Let God collect every tear in His bottle.",
      "Write an honest lament to God—express anger, confusion, questions, pain. Hold nothing back.",
      "Look in a mirror and say: 'I am grieving, and that's okay. My tears are sacred.'",
      "Journal prompt: 'If I were completely honest with God right now, I would say...'"
    ],
    scriptureReferences: [
      "Psalm 56:8 - You have kept count of my wanderings; put my tears in your bottle",
      "Psalm 42:3 - My tears have been my food day and night",
      "John 11:35 - Jesus wept",
      "Lamentations 3:8 - Though I call and cry for help, he shuts out my prayer"
    ],
    prayerPrompt: "Father, I need to wash my soul. I give You permission to see my tears, hear my cries, and hold my broken heart. Cleanse me through honest grief. Let my tears become healing water. Amen."
  },
  {
    id: 3,
    name: "Table of Shewbread",
    principle: "Daily Nourishment During Loss",
    sanctuaryMeaning: "Provision, daily sustenance, steady nourishment.",
    griefPrinciple: "In seasons of mourning, survival comes from small, daily acts of nourishment.",
    detailedTeaching: `Grief weakens the body, mind, and soul.
The table teaches this vital truth:

You don't heal all at once.
You heal one day at a time.
One "loaf" at a time.

Daily nourishment includes:

Physical Nourishment:
• Eat something
• Hydrate
• Sleep
• Go for a walk

Emotional Nourishment:
• Talk to someone
• Spend time with a safe person
• Receive support
• Slow down

Spiritual Nourishment:
• One verse
• One prayer
• One worship song
• One moment in God's presence

You don't feast during grief.
You nibble.
You survive.
You take the next breath.

Daily bread is the path through the valley (Psalm 23).`,
    reflectionQuestions: [
      "Am I neglecting my physical needs (food, water, sleep, movement)?",
      "What small act of nourishment can I do today?",
      "Who are the safe people I can allow to support me?",
      "Am I pressuring myself to 'get over it' instead of taking one day at a time?",
      "What is one small piece of spiritual bread I can receive today?"
    ],
    healingExercises: [
      "Physical care: Today, commit to one act of physical nourishment (eat a healthy meal, take a walk, rest).",
      "Emotional care: Reach out to one safe person and share honestly how you're doing.",
      "Spiritual care: Read one Psalm slowly. Let it be today's 'bread.'",
      "Create a daily survival list: 3 small things you'll do each day to nourish yourself."
    ],
    scriptureReferences: [
      "Psalm 23:1-3 - The LORD is my shepherd... He restores my soul",
      "Matthew 6:11 - Give us this day our daily bread",
      "1 Kings 19:5-8 - Elijah strengthened by food in depression",
      "Isaiah 40:29 - He gives power to the faint and strengthens the powerless"
    ],
    prayerPrompt: "Lord, I'm weak. I need daily bread—physical, emotional, and spiritual. Help me take one small step today. Give me just enough strength for this moment. Feed my soul. Amen."
  },
  {
    id: 4,
    name: "Golden Candlestick",
    principle: "Hope, Light & Meaning in the Darkness",
    sanctuaryMeaning: "Light, illumination, Spirit's comfort.",
    griefPrinciple: "Allow God to bring small rays of light into your darkness—little sparks of hope, meaning, and guidance.",
    detailedTeaching: `Loss brings darkness, confusion, and disorientation.
The candlestick does NOT blast you with light—
it gives a gentle flame.

This stage includes:
• Little glimpses of hope
• Small comforts
• Unexpected encouragement
• Gentle reminders of God's presence
• A memory that warms the heart
• Scripture that comforts the mind
• People who show up
• Realization: "I will not always feel like this."

God does not eliminate grief here.
He illuminates it.

He lights the next step, not the next year.

This is when the Spirit whispers:
"You're not alone."
"There is still purpose."
"You will not sink."
"I am with you."

Light in the darkness is the candlestick stage.`,
    reflectionQuestions: [
      "What small ray of light has God given me recently?",
      "Am I able to see any glimpses of hope, even if faint?",
      "What memory brings warmth instead of only pain?",
      "Who has shown up for me as a reminder of God's presence?",
      "Can I trust that I won't always feel this dark?"
    ],
    healingExercises: [
      "Write down 3 small 'lights' you've noticed this week (a kind word, a warm memory, a moment of peace).",
      "Light a candle and pray: 'Lord, be my light in this darkness. Show me one step at a time.'",
      "Practice gratitude: Name one thing you're grateful for today, even if it's just breath.",
      "Read Psalm 27:1 daily this week: 'The LORD is my light and my salvation; whom shall I fear?'"
    ],
    scriptureReferences: [
      "Psalm 27:1 - The LORD is my light and my salvation",
      "Psalm 119:105 - Your word is a lamp to my feet and a light to my path",
      "John 8:12 - I am the light of the world",
      "2 Corinthians 4:17-18 - Our light and momentary troubles are achieving eternal glory"
    ],
    prayerPrompt: "Father, the darkness feels heavy. I need Your light. Not a flood of answers, just a gentle flame. Show me one small ray of hope today. Illuminate the next step. I trust You are with me. Amen."
  },
  {
    id: 5,
    name: "Altar of Incense",
    principle: "Prayer, Lament, and Sacred Connection with God",
    sanctuaryMeaning: "Fragrance, intercession, intimacy, groaning of the heart.",
    griefPrinciple: "Prayer becomes the lifeline; the heart begins to reach for God from a wounded place.",
    detailedTeaching: `Incense is powerful because it rises.
So do prayers in grief.

This stage is where your prayers become:
• Raw
• Honest
• Desperate
• Wordless
• Groans instead of sentences
• Tears instead of theology

Romans 8:26 says:
"The Spirit Himself maketh intercession for us with groanings…"

This is where God breathes with you.

Prayer becomes:
• The atmosphere of survival
• The cry of the broken heart
• A softening of the soul
• A releasing of burdens
• A drawing near of God's presence

The incense stage reconnects you with God,
but in a new way—
a deeper, more vulnerable, more intimate way.

Pain turns into prayer.
Prayer turns into presence.
Presence turns into peace.`,
    reflectionQuestions: [
      "Have I been praying, or have I been too hurt to speak?",
      "Do I believe God hears my groans and wordless cries?",
      "What burden do I need to release to God in prayer?",
      "Am I allowing myself to be vulnerable with God, or am I still performing?",
      "Can I trust that God is breathing with me even when I can't form words?"
    ],
    healingExercises: [
      "Pray without words: Sit in silence and let your heart groan to God. Trust the Spirit is interceding.",
      "Write a prayer of lament: Pour out your pain, questions, and confusion to God like the Psalmists did.",
      "Light incense or a candle and pray: 'Lord, let my pain rise to You like incense. You understand what I can't say.'",
      "Practice breath prayers: Inhale ('Lord, I need You'), Exhale ('Hold me close')."
    ],
    scriptureReferences: [
      "Romans 8:26 - The Spirit intercedes for us with groanings too deep for words",
      "Psalm 141:2 - Let my prayer be counted as incense before you",
      "Psalm 88 - The darkest psalm, a complete lament to God",
      "Hebrews 4:15-16 - Jesus sympathizes with our weaknesses; draw near with confidence"
    ],
    prayerPrompt: "Holy Spirit, I can't even form the words. My groans are my prayers. Intercede for me. Turn my pain into incense rising before God's throne. Hold me close. Amen."
  },
  {
    id: 6,
    name: "Ark of the Covenant",
    principle: "Acceptance, Meaning, Identity & New Life",
    sanctuaryMeaning: "Covenant, identity, God's presence, mercy, new beginning.",
    griefPrinciple: "This is where you begin living again—not forgetting, but carrying the loss with peace, identity, and purpose.",
    detailedTeaching: `Inside the ark are the keys to restored identity.

1. The Law — Stability Returns
You begin to find:
• Order
• Normalcy
• Rhythm
• Grounding
• Emotional balance
The shattered pieces begin to settle.

2. The Manna — God's Daily Provision in Your New Life
God gives new manna:
• New routines
• New strength
• New friendships
• New insights
• New purpose
• New peace

3. Aaron's Rod — Miracles of Growth After Death
The rod budded after being dead.
This symbolizes:
• Emotional resurrection
• New joy
• New strength
• New resilience
• New identity emerging from pain

4. The Mercy Seat — Peace & Acceptance Cover the Story
Mercy sits above everything:
Above the trauma, regrets, guilt, anger, unanswered questions, and loss.

Mercy does not erase grief.
It redeems it.

Mercy turns grief from a wound into a testimony.
Mercy makes space for joy to coexist with sorrow.

This is the Most Holy Place of grief:
Peace—not because the loss is gone,
but because God sits above it.`,
    reflectionQuestions: [
      "Am I beginning to find stability and emotional balance again?",
      "What new routines or rhythms is God giving me?",
      "Can I see any signs of 'resurrection'—new growth from this dead place?",
      "Am I ready to let mercy cover my story, even the painful parts?",
      "Can I carry this loss with peace, knowing God is with me?"
    ],
    healingExercises: [
      "Write your 'new normal': What does life look like now? What new rhythms are emerging?",
      "Identify one 'budded rod' moment: Where have you seen unexpected growth or strength since the loss?",
      "Create a mercy statement: 'Mercy covers [name the loss]. God sits above my pain and redeems my story.'",
      "Journal: 'I am not who I was before, but I am not destroyed. I am...'"
    ],
    scriptureReferences: [
      "Numbers 17:8 - Aaron's rod budded, producing blossoms and almonds",
      "Lamentations 3:22-23 - His mercies are new every morning",
      "Isaiah 61:3 - Beauty for ashes, oil of joy for mourning",
      "2 Corinthians 1:4 - God comforts us so we can comfort others"
    ],
    prayerPrompt: "Father, I'm beginning to live again. Not because the loss is gone, but because Your mercy covers it. Give me new manna, new strength, and a new identity rooted in You. Let joy and sorrow coexist. Amen."
  }
];

export const GRIEF_BLUEPRINT_INTRO = {
  title: "The Sanctuary Blueprint for Grieving",
  subtitle: "How God's Six-Step Pattern Leads You Through Shock, Pain, Lament, Hope, and Restoration",
  description: `Grief is sacred terrain.
The sanctuary is God's map through that terrain.

Grief cannot be rushed.
The sanctuary does not rush.

It leads you step by step—
from the ashes of loss
to the mercy seat of God.`,
  quote: "Grief that is not placed on the altar becomes bitterness. Grief placed on the altar becomes healing."
};
