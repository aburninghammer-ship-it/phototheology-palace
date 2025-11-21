// 30-Day Character Development Challenges based on fruits of the Spirit

export interface DayChallenge {
  day: number;
  title: string;
  fruitFocus: string;
  challenge: string;
  scripture: string;
  reflectionPrompt: string;
  practicalActions: string[];
}

export const THIRTY_DAY_CHALLENGES: DayChallenge[] = [
  // Week 1: Love
  {
    day: 1,
    title: "Love the Unlovable",
    fruitFocus: "Love",
    challenge: "Show kindness to someone who has wronged you or someone you find difficult to love.",
    scripture: "Matthew 5:44 - Love your enemies, bless them that curse you",
    reflectionPrompt: "How did showing love to someone difficult change your perspective or their response?",
    practicalActions: [
      "Send an encouraging message to someone who hurt you",
      "Pray sincerely for someone you struggle with",
      "Perform a random act of kindness for someone you'd normally avoid"
    ]
  },
  {
    day: 2,
    title: "Sacrificial Giving",
    fruitFocus: "Love",
    challenge: "Give something valuable to someone in need without expecting anything in return.",
    scripture: "John 15:13 - Greater love has no man than this, that he lay down his life",
    reflectionPrompt: "What did sacrificing something you valued teach you about Christ's sacrifice?",
    practicalActions: [
      "Buy groceries for someone struggling financially",
      "Give away something you cherish to someone who needs it",
      "Spend time with someone lonely, sacrificing your own plans"
    ]
  },
  {
    day: 3,
    title: "Love in Action",
    fruitFocus: "Love",
    challenge: "Serve someone anonymously—love without recognition or praise.",
    scripture: "Matthew 6:3-4 - Don't let your left hand know what your right hand does",
    reflectionPrompt: "How did serving without recognition affect your motivation? Was it harder or freeing?",
    practicalActions: [
      "Leave money or a gift card anonymously for someone in need",
      "Do a chore or task for someone without telling them it was you",
      "Pay for a stranger's meal or coffee without them knowing"
    ]
  },
  {
    day: 4,
    title: "Forgive Quickly",
    fruitFocus: "Love",
    challenge: "Forgive someone who has hurt you recently—release the debt they owe you.",
    scripture: "Colossians 3:13 - Forgive as Christ forgave you",
    reflectionPrompt: "What burden was lifted when you chose to forgive? How did it affect your peace?",
    practicalActions: [
      "Write a forgiveness letter (send it or not, but write it)",
      "Verbally tell someone 'I forgive you' if possible",
      "Pray for the person who hurt you, asking God to bless them"
    ]
  },
  {
    day: 5,
    title: "Love Your Family",
    fruitFocus: "Love",
    challenge: "Show extra patience and affection to a family member you've been frustrated with.",
    scripture: "1 Corinthians 13:4-7 - Love is patient, love is kind",
    reflectionPrompt: "How did intentionally showing love to family change the atmosphere at home?",
    practicalActions: [
      "Serve a family member without being asked",
      "Speak affirming words to someone you've been critical of",
      "Listen fully to a family member without interrupting or correcting"
    ]
  },
  {
    day: 6,
    title: "Love Through Listening",
    fruitFocus: "Love",
    challenge: "Give someone your undivided attention—truly listen without thinking of your response.",
    scripture: "James 1:19 - Be swift to hear, slow to speak",
    reflectionPrompt: "What did you learn about the other person when you truly listened? How did they respond?",
    practicalActions: [
      "Put your phone away completely during a conversation",
      "Ask follow-up questions instead of sharing your own story",
      "Maintain eye contact and give affirming responses"
    ]
  },
  {
    day: 7,
    title: "Radical Kindness",
    fruitFocus: "Love",
    challenge: "Do something extraordinarily kind that goes beyond what's expected or comfortable.",
    scripture: "Luke 6:35 - Love your enemies, do good, and lend, expecting nothing",
    reflectionPrompt: "What fears or hesitations arose when you considered radical kindness? What happened when you pushed through?",
    practicalActions: [
      "Pay someone's overdue bill or debt",
      "Volunteer your entire Saturday to help someone move or complete a project",
      "Invite someone who is always alone to share a meal in your home"
    ]
  },

  // Week 2: Joy & Peace
  {
    day: 8,
    title: "Find Joy in Trial",
    fruitFocus: "Joy",
    challenge: "When faced with difficulty today, deliberately choose to find one reason to rejoice.",
    scripture: "James 1:2 - Count it all joy when you fall into various trials",
    reflectionPrompt: "What perspective shift happened when you looked for joy in hardship?",
    practicalActions: [
      "Write down 3 ways this trial could make you stronger",
      "Thank God aloud for the trial before asking for relief",
      "Share with someone how you're finding joy despite difficulty"
    ]
  },
  {
    day: 9,
    title: "Spread Joy",
    fruitFocus: "Joy",
    challenge: "Be a source of joy for others—make someone smile or laugh today.",
    scripture: "Proverbs 17:22 - A joyful heart is good medicine",
    reflectionPrompt: "How did bringing joy to others affect your own mood and perspective?",
    practicalActions: [
      "Send a funny or encouraging meme to someone having a hard day",
      "Compliment a stranger genuinely",
      "Do something playful or silly to lighten someone's burden"
    ]
  },
  {
    day: 10,
    title: "Peaceful Response",
    fruitFocus: "Peace",
    challenge: "When provoked today, respond with calm peace instead of defensiveness or anger.",
    scripture: "Proverbs 15:1 - A soft answer turns away wrath",
    reflectionPrompt: "How did responding peacefully change the outcome of the situation?",
    practicalActions: [
      "Take three deep breaths before responding to criticism",
      "Lower your voice when you feel anger rising",
      "Choose silence instead of defending yourself when accused"
    ]
  },
  {
    day: 11,
    title: "Create Peace",
    fruitFocus: "Peace",
    challenge: "Be a peacemaker—help resolve a conflict between two people.",
    scripture: "Matthew 5:9 - Blessed are the peacemakers",
    reflectionPrompt: "What did you learn about conflict resolution? How did both parties respond?",
    practicalActions: [
      "Facilitate a conversation between two people who are at odds",
      "Refuse to take sides in gossip; instead, encourage reconciliation",
      "Apologize on behalf of someone else to mend a relationship"
    ]
  },
  {
    day: 12,
    title: "Inner Peace Practice",
    fruitFocus: "Peace",
    challenge: "Spend 30 minutes in complete silence and stillness, giving anxiety to God.",
    scripture: "Psalm 46:10 - Be still and know that I am God",
    reflectionPrompt: "What anxieties surfaced in the silence? How did stillness help you surrender them?",
    practicalActions: [
      "Sit in a quiet place without phone, music, or distractions",
      "Write down each worry that comes to mind, then pray over it",
      "Practice deep breathing while meditating on God's presence"
    ]
  },
  {
    day: 13,
    title: "Bless Your Enemies",
    fruitFocus: "Peace",
    challenge: "Pray a genuine blessing over someone who has opposed or hurt you.",
    scripture: "Romans 12:14 - Bless those who persecute you",
    reflectionPrompt: "How did praying for your enemy change your heart toward them?",
    practicalActions: [
      "Pray specifically for their well-being and success",
      "Ask God to reveal why they may have hurt you",
      "Release any desire for revenge or retribution"
    ]
  },
  {
    day: 14,
    title: "Joyful Sacrifice",
    fruitFocus: "Joy",
    challenge: "Give up something enjoyable today and replace it with time spent with God or serving others.",
    scripture: "Hebrews 12:2 - For the joy set before Him, He endured the cross",
    reflectionPrompt: "Did you find joy in the sacrifice? What did you gain by giving something up?",
    practicalActions: [
      "Skip your favorite TV show to pray or study Scripture",
      "Fast from one meal and spend that time in worship",
      "Give away a portion of your 'fun money' to someone in need"
    ]
  },

  // Week 3: Patience, Kindness, Goodness
  {
    day: 15,
    title: "Patience Under Pressure",
    fruitFocus: "Patience",
    challenge: "Don't complain, sigh, or express frustration when things go wrong today.",
    scripture: "James 5:7-8 - Be patient, establish your hearts",
    reflectionPrompt: "How many times did you almost complain? What happened when you chose patience instead?",
    practicalActions: [
      "When stuck in traffic, pray instead of honking",
      "When someone is slow, smile and wait without rushing them",
      "When technology fails, take a breath and respond calmly"
    ]
  },
  {
    day: 16,
    title: "Patient Listening",
    fruitFocus: "Patience",
    challenge: "Listen to someone's entire story or struggle without interrupting, correcting, or offering advice unless asked.",
    scripture: "Proverbs 18:13 - Answering before listening is folly and shame",
    reflectionPrompt: "What did you learn by just listening? How did the person respond to being fully heard?",
    practicalActions: [
      "Make eye contact and nod without thinking of what to say next",
      "Count to 3 after they finish before responding",
      "Ask clarifying questions instead of giving solutions"
    ]
  },
  {
    day: 17,
    title: "Random Acts of Kindness",
    fruitFocus: "Kindness",
    challenge: "Perform 3 acts of kindness for strangers or acquaintances today.",
    scripture: "Ephesians 4:32 - Be kind to one another",
    reflectionPrompt: "How did unexpected kindness affect those you served? How did it affect you?",
    practicalActions: [
      "Hold the door open and smile genuinely",
      "Leave a generous tip with an encouraging note",
      "Help someone carry something heavy or struggle with a task"
    ]
  },
  {
    day: 18,
    title: "Speak Life",
    fruitFocus: "Kindness",
    challenge: "Speak only encouraging, uplifting words all day—no criticism, sarcasm, or negativity.",
    scripture: "Ephesians 4:29 - Let no corrupt word proceed from your mouth, but what is good for building up",
    reflectionPrompt: "How difficult was it to speak only life? What patterns of negative speech did you notice?",
    practicalActions: [
      "Give at least 5 genuine compliments",
      "When tempted to criticize, find something positive to say instead",
      "End every conversation with an encouraging word"
    ]
  },
  {
    day: 19,
    title: "Pursue Goodness",
    fruitFocus: "Goodness",
    challenge: "Go out of your way to do good for someone who can't repay you.",
    scripture: "Galatians 6:10 - Do good to all people",
    reflectionPrompt: "What motivated you to do good without potential reward? How did it reflect God's character?",
    practicalActions: [
      "Volunteer at a shelter or ministry",
      "Mow a neighbor's lawn or shovel their snow",
      "Cook a meal for someone sick or overwhelmed"
    ]
  },
  {
    day: 20,
    title: "Moral Courage",
    fruitFocus: "Goodness",
    challenge: "Stand up for what's right even when it's uncomfortable or unpopular.",
    scripture: "Micah 6:8 - Do justly, love mercy, walk humbly",
    reflectionPrompt: "What was the cost of standing for goodness? Was it worth it?",
    practicalActions: [
      "Speak truth when others are spreading falsehood",
      "Defend someone being gossiped about or bullied",
      "Report something unethical you've been ignoring"
    ]
  },
  {
    day: 21,
    title: "Gentle Strength",
    fruitFocus: "Gentleness",
    challenge: "Exercise strength under control—respond gently when you have power to retaliate.",
    scripture: "1 Peter 3:15 - Answer with gentleness and respect",
    reflectionPrompt: "Where did you hold back your power? How did gentleness prove to be stronger than force?",
    practicalActions: [
      "Lower your voice when you want to yell",
      "Choose a gentle correction instead of harsh rebuke",
      "Show tenderness toward someone weaker or vulnerable"
    ]
  },

  // Week 4: Faithfulness & Self-Control
  {
    day: 22,
    title: "Keep Your Word",
    fruitFocus: "Faithfulness",
    challenge: "Follow through on every promise or commitment you make today, no matter how small.",
    scripture: "Matthew 5:37 - Let your yes be yes and your no be no",
    reflectionPrompt: "How faithful were you to your word? What kept you from following through in the past?",
    practicalActions: [
      "Don't make promises you can't keep",
      "Complete a task you said you'd do but have been delaying",
      "Show up on time to everything you committed to"
    ]
  },
  {
    day: 23,
    title: "Spiritual Disciplines",
    fruitFocus: "Faithfulness",
    challenge: "Maintain prayer, Bible study, and devotions even when you don't feel like it.",
    scripture: "Luke 9:23 - Take up your cross daily",
    reflectionPrompt: "How did faithful discipline on a hard day strengthen your spiritual muscles?",
    practicalActions: [
      "Pray first thing in the morning before checking your phone",
      "Read Scripture for 15 minutes even if you're tired",
      "Journal one thing God taught you today"
    ]
  },
  {
    day: 24,
    title: "Tame the Tongue",
    fruitFocus: "Self-Control",
    challenge: "Exercise complete control over your words—no gossip, complaining, or harsh speech.",
    scripture: "James 3:2 - If anyone does not stumble in word, he is a perfect man",
    reflectionPrompt: "How many times did you have to stop yourself from speaking? What patterns did you notice?",
    practicalActions: [
      "Count to 5 before responding in any tense conversation",
      "When tempted to gossip, say something positive about the person instead",
      "Apologize immediately if you slip and speak harshly"
    ]
  },
  {
    day: 25,
    title: "Master Your Appetite",
    fruitFocus: "Self-Control",
    challenge: "Fast from something you crave (food, caffeine, social media) for 24 hours.",
    scripture: "1 Corinthians 9:27 - I discipline my body and bring it into subjection",
    reflectionPrompt: "What did you learn about your dependence on this comfort? How did denial strengthen you?",
    practicalActions: [
      "Skip dessert or a favorite treat",
      "Go without social media or entertainment",
      "Replace the craving time with prayer or Scripture"
    ]
  },
  {
    day: 26,
    title: "Control Your Reactions",
    fruitFocus: "Self-Control",
    challenge: "When provoked, choose to respond thoughtfully instead of reacting emotionally.",
    scripture: "Proverbs 16:32 - He who is slow to anger is better than the mighty",
    reflectionPrompt: "What triggered your emotions today? How did controlling your reaction change the outcome?",
    practicalActions: [
      "Pause 10 seconds before responding to any frustration",
      "Walk away from a heated situation until you calm down",
      "Replace emotional reactions with objective statements"
    ]
  },
  {
    day: 27,
    title: "Financial Self-Control",
    fruitFocus: "Self-Control",
    challenge: "Don't make any impulse purchases today—delay all non-essential buying decisions.",
    scripture: "Hebrews 13:5 - Keep your life free from love of money",
    reflectionPrompt: "What did you want to buy but didn't? How did saying no to impulse strengthen your discipline?",
    practicalActions: [
      "Unsubscribe from marketing emails that tempt you",
      "Leave your credit card at home and only carry cash",
      "Wait 24 hours before buying anything non-essential"
    ]
  },

  // Week 4 Continued + Final Week: Integration
  {
    day: 28,
    title: "Humble Service",
    fruitFocus: "Gentleness",
    challenge: "Do the lowest, most humble task you can find to serve someone else.",
    scripture: "Philippians 2:5-7 - Christ made Himself a servant",
    reflectionPrompt: "How did serving in humility challenge your pride? What did you gain from lowering yourself?",
    practicalActions: [
      "Clean someone's bathroom or do their dirty dishes",
      "Shine someone's shoes or do a task they find unpleasant",
      "Serve someone who would never serve you back"
    ]
  },
  {
    day: 29,
    title: "Practice All Nine",
    fruitFocus: "All Fruits",
    challenge: "Intentionally practice all nine fruits of the Spirit in one day—find an opportunity for each.",
    scripture: "Galatians 5:22-23 - The fruit of the Spirit is love, joy, peace...",
    reflectionPrompt: "Which fruit was easiest? Which was hardest? Where do you need more growth?",
    practicalActions: [
      "Create a checklist of all nine fruits",
      "Journal one example of each fruit you practiced",
      "Pray for the Spirit to develop the fruit you struggled with most"
    ]
  },
  {
    day: 30,
    title: "Become the Lesson",
    fruitFocus: "All Fruits",
    challenge: "Live so transparently today that your life becomes a witness of Christ's transforming power.",
    scripture: "Matthew 5:16 - Let your light shine before others",
    reflectionPrompt: "What would someone observing your life today conclude about Christ? What needs to change?",
    practicalActions: [
      "Ask God to make you a living epistle (2 Cor 3:2)",
      "Share your testimony of how God has been transforming your character",
      "Commit to continuing these practices beyond 30 days"
    ]
  }
];

export const CHALLENGE_TYPES = [
  {
    id: "kindness",
    name: "30 Days of Kindness",
    description: "Practice deliberate acts of kindness for 30 days",
    icon: "Heart",
    color: "bg-pink-500"
  },
  {
    id: "grace",
    name: "30 Days of Grace",
    description: "Extend grace and forgiveness in every situation",
    icon: "Sparkles",
    color: "bg-purple-500"
  },
  {
    id: "forgiveness",
    name: "30 Days of Forgiveness",
    description: "Release debts and forgive quickly for 30 days",
    icon: "Heart",
    color: "bg-blue-500"
  },
  {
    id: "self-control",
    name: "30 Days of Self-Control",
    description: "Master your impulses and desires through discipline",
    icon: "Shield",
    color: "bg-green-500"
  },
  {
    id: "humility",
    name: "30 Days of Humility",
    description: "Practice lowliness and servant-hearted living",
    icon: "ArrowDown",
    color: "bg-indigo-500"
  },
  {
    id: "all-fruits",
    name: "Complete 30-Day Challenge",
    description: "The full character development journey through all nine fruits",
    icon: "Trophy",
    color: "bg-amber-500"
  }
];