// Death Chamber 30-Day Tomb-Centered Formation Program
// "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me" — Galatians 2:20

export interface DeathChamberDay {
  day: number;
  week: number;
  title: string;
  theme: string;
  scripture: string;
  scriptureText: string;
  instruction: string;
  surrenderExercise: string;
  reflectionPrompt: string;
  practicalActions: string[];
  tombAffirmation: string;
}

export interface DeathChamberWeek {
  week: number;
  title: string;
  focus: string;
  description: string;
}

export const DEATH_CHAMBER_WEEKS: DeathChamberWeek[] = [
  {
    week: 1,
    title: "Entering the Tomb",
    focus: "Recognition & Surrender",
    description: "You are dead. This week strips away the illusion that your old self still has rights. Every exercise is designed to confront, expose, and bury the false self."
  },
  {
    week: 2,
    title: "The Burial Process",
    focus: "Dying to Self-Will",
    description: "The burial deepens. This week targets the hidden corners where self-will hides — your desires, ambitions, need for control, and the idol of self-sufficiency."
  },
  {
    week: 3,
    title: "Wrapped in Burial Cloths",
    focus: "Dying to the World",
    description: "Like Lazarus bound in grave clothes, this week strips away worldly attachments — reputation, comfort, possessions, and the opinions of others."
  },
  {
    week: 4,
    title: "The Stone is Rolled Away",
    focus: "Resurrection Life Emerges",
    description: "Death has done its work. Now resurrection power begins to flow. This final week transitions from burial to new life — not your life, but Christ's life through you."
  }
];

export const DEATH_CHAMBER_WELCOME = {
  title: "The Death Chamber",
  subtitle: "A 30-Day Tomb-Centered Formation Program",
  epigraph: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me.",
  epigraphRef: "Galatians 2:20",
  description: `Welcome, soldier. You are about to enter the Death Chamber — the most sacred and feared room in the Palace of Theology. This is not a devotional. This is not a Bible study. This is a burial.

For the next 30 days, you will die. Not physically — but the old man, the flesh, the self-life that wars against God's purposes in you... that man will be buried here.

Every great warrior in the Kingdom learned this one truth: you cannot fight for God until you have died to yourself. The Death Chamber is where that death happens — systematically, intentionally, and completely.`,
  rules: [
    "You must complete each day before moving to the next. No skipping.",
    "Write your reflection honestly. This is between you and God.",
    "The surrender exercises are not optional — they are the point.",
    "If you are doing this with others, the Tomb Space is for mutual encouragement, not performance.",
    "Expect resistance. Your flesh will fight this program. That means it's working."
  ],
  warning: "This program will confront you. It will expose areas of your life you've been protecting. If you are not ready to be honest before God, do not enter. But if you are ready to die so that Christ may truly live in you — step inside."
};

export const DEATH_CHAMBER_COMPLETION = {
  title: "The Tomb is Empty",
  subtitle: "You Have Emerged",
  scripture: "Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life.",
  scriptureRef: "Romans 6:4",
  covenant: `I have spent 30 days in the Death Chamber. I have confronted my flesh, surrendered my will, released the world's grip, and allowed resurrection power to emerge.

I declare before God and witnesses:
- The old man is buried. I no longer live for self.
- My will is surrendered. I seek His will above my own.
- The world has lost its hold. I am crucified to the world, and the world to me.
- Christ lives in me. My life is now hidden with Christ in God.

I will carry the Death Chamber with me — not as a memory, but as a daily reality. I die daily. I rise daily. I fight from death, not toward it.`,
  closingWord: "Soldier, the tomb is empty — not because death failed, but because it finished its work. You now carry resurrection power. Go forth and fight as one who has already died. There is nothing the enemy can threaten you with. You have been to the grave and back."
};

export const DEATH_CHAMBER_DAYS: DeathChamberDay[] = [
  // WEEK 1: Entering the Tomb — Recognition & Surrender
  {
    day: 1,
    week: 1,
    title: "The Door Closes Behind You",
    theme: "Acknowledging the Need to Die",
    scripture: "Romans 6:6",
    scriptureText: "Knowing this, that our old man is crucified with him, that the body of sin might be destroyed, that henceforth we should not serve sin.",
    instruction: "Today you enter the tomb. Before you can be buried, you must acknowledge that the old man — your flesh, your self-will, your pride — still lives and still fights for control. This first day is about honest recognition.",
    surrenderExercise: "Write a letter to your 'old self.' Address it directly. Name the areas where your flesh still controls you — anger, pride, lust, fear, selfishness, unforgiveness. Be brutally honest. Then read it aloud to God as a confession.",
    reflectionPrompt: "What areas of your life does the 'old man' still control? Where have you been pretending he's already dead?",
    practicalActions: [
      "Write the letter to your old self (minimum 1 page)",
      "Read it aloud in prayer as a confession",
      "Identify your top 3 flesh patterns that resist God"
    ],
    tombAffirmation: "I acknowledge that my old man still lives in areas of my life. Today, I bring him to the tomb."
  },
  {
    day: 2,
    week: 1,
    title: "Laying Down Your Rights",
    theme: "Surrendering Personal Rights",
    scripture: "Philippians 2:5-8",
    scriptureText: "Let this mind be in you, which was also in Christ Jesus: Who... made himself of no reputation, and took upon him the form of a servant.",
    instruction: "A dead man has no rights. Today you practice releasing your grip on the things you feel entitled to — your time, your comfort, your preferences, your dignity. Christ emptied Himself of everything. You must do the same.",
    surrenderExercise: "Make a list of everything you feel you have a 'right' to (respect, free time, comfort, success, recognition). For each one, pray: 'I lay this down. I have no right to this. Only what You give me, Lord.' Then do one concrete act today that puts someone else's needs above your rights.",
    reflectionPrompt: "Which 'right' was hardest to surrender? What does that reveal about where your identity is rooted?",
    practicalActions: [
      "List every personal right you cling to",
      "Pray the surrender prayer over each one",
      "Do one act of service that costs you your comfort or time"
    ],
    tombAffirmation: "I am a dead man. Dead men have no rights. I release every claim."
  },
  {
    day: 3,
    week: 1,
    title: "The Silence of the Tomb",
    theme: "Embracing Silence and Solitude",
    scripture: "Psalm 46:10",
    scriptureText: "Be still, and know that I am God.",
    instruction: "The tomb is silent. There is no noise, no distraction, no entertainment. Today you practice the discipline of silence — shutting out every voice except God's. Your flesh will scream for stimulation. Let it scream.",
    surrenderExercise: "Spend a minimum of 30 minutes in complete silence. No phone, no music, no reading — just you and God. Sit in the discomfort. When your mind races, don't fight it — surrender each thought as it comes. Journal what surfaces.",
    reflectionPrompt: "What thoughts rushed in during the silence? What is your soul trying to tell you that noise usually drowns out?",
    practicalActions: [
      "30 minutes of total silence with God",
      "Journal every thought that surfaces without judgment",
      "Fast from all entertainment media for the remainder of the day"
    ],
    tombAffirmation: "In the silence of the tomb, I hear what my noise has been hiding."
  },
  {
    day: 4,
    week: 1,
    title: "Naming Your Idols",
    theme: "Identifying What You Worship Besides God",
    scripture: "Ezekiel 14:3",
    scriptureText: "Son of man, these men have set up their idols in their heart, and put the stumblingblock of their iniquity before their face.",
    instruction: "An idol is anything you cannot live without besides God. Today you identify the idols enthroned in your heart — the things you run to for comfort, identity, security, or validation that are not God Himself.",
    surrenderExercise: "Complete this sentence for each area: 'I cannot be okay without ___.' (Approval? Success? Relationship? Control? Comfort? Money?) For each idol identified, confess it as sin and ask God to dethrone it. Write each idol on paper and physically tear it up.",
    reflectionPrompt: "What idol surprised you the most? How long has it been enthroned in your heart?",
    practicalActions: [
      "Complete the 'I cannot be okay without' exercise honestly",
      "Write each idol on paper and tear it up as an act of dethroning",
      "Pray specifically for God to replace each idol with Himself"
    ],
    tombAffirmation: "No idol will share the throne with God in my heart. I tear them down today."
  },
  {
    day: 5,
    week: 1,
    title: "The Weight of the Stone",
    theme: "Accepting the Cost of Discipleship",
    scripture: "Luke 14:27-28",
    scriptureText: "And whosoever doth not bear his cross, and come after me, cannot be my disciple. For which of you, intending to build a tower, sitteth not down first, and counteth the cost.",
    instruction: "The stone that seals the tomb is heavy. It represents the cost of true discipleship — the relationships that won't understand, the pleasures you'll forsake, the paths you'll abandon. Today you count the cost honestly.",
    surrenderExercise: "Write down everything following Christ 'all the way' will cost you. Be specific. Lost friendships? Career paths? Habits? Comforts? Then beside each cost, write: 'He is worth it.' If you can't write it honestly for any item, that is where you need to focus your prayers.",
    reflectionPrompt: "Which cost feels the heaviest right now? Are you truly willing to pay it?",
    practicalActions: [
      "Make your honest 'cost of discipleship' list",
      "Pray over any item where you hesitate",
      "Read the stories of martyrs who paid the ultimate cost and journal your response"
    ],
    tombAffirmation: "I have counted the cost. The stone is heavy, but Christ is heavier."
  },
  {
    day: 6,
    week: 1,
    title: "Confessing Hidden Sin",
    theme: "Exposing What Darkness Conceals",
    scripture: "1 John 1:8-9",
    scriptureText: "If we say that we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
    instruction: "The tomb exposes everything. There is no hiding in death. Today you bring your hidden sins — the ones no one knows about, the ones you've justified, the ones you've minimized — into the light.",
    surrenderExercise: "Write a complete, honest confession to God. Include the sins you've never spoken aloud. Include the 'small' sins you've excused. Read it to God in prayer. If appropriate and safe, confess to a trusted believer as James 5:16 directs.",
    reflectionPrompt: "What sin have you been hiding the longest? How does bringing it to light change its power over you?",
    practicalActions: [
      "Write a thorough confession — hold nothing back",
      "Pray through the confession, receiving God's forgiveness for each item",
      "If led, confess to a trusted accountability partner (James 5:16)"
    ],
    tombAffirmation: "Nothing is hidden in the tomb. I bring everything into the light."
  },
  {
    day: 7,
    week: 1,
    title: "The First Death",
    theme: "Week 1 Culmination — Dying to Self-Awareness",
    scripture: "Galatians 2:20",
    scriptureText: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.",
    instruction: "You have spent a week entering the tomb. Today you make your first formal declaration of death. This is not emotional — it is covenantal. You are making a binding decision before God.",
    surrenderExercise: "Write your own 'death certificate.' Include: Name, Date, Cause of Death (the cross of Christ), and a list of what is being buried (your rights, your idols, your hidden sins, your self-will). Sign it. Date it. Keep it.",
    reflectionPrompt: "How does formally declaring 'I am dead' change the way you see tomorrow? What shifts when you truly believe you've died?",
    practicalActions: [
      "Write and sign your personal death certificate",
      "Read Galatians 2:20 aloud as your creed",
      "Spend 15 minutes in worship, thanking God for the death that brings life"
    ],
    tombAffirmation: "I am dead. The certificate is signed. Christ now lives in me."
  },

  // WEEK 2: The Burial Process — Dying to Self-Will
  {
    day: 8,
    week: 2,
    title: "Not My Will",
    theme: "Surrendering Your Plans",
    scripture: "Luke 22:42",
    scriptureText: "Father, if thou be willing, remove this cup from me: nevertheless not my will, but thine, be done.",
    instruction: "Even Jesus asked for the cup to pass — but He surrendered His will to the Father's. Today you confront your plans, your goals, your five-year vision, and you lay them all on the altar.",
    surrenderExercise: "Write down your top 5 personal goals/plans for your life. For each one, pray: 'Father, if this is not Your will, I release it completely. Not my will, but Yours be done.' Mean it. If you cannot release one, spend extra time on that one.",
    reflectionPrompt: "Which plan was hardest to surrender? What does that tell you about where you find your identity and security?",
    practicalActions: [
      "List your top 5 life plans and pray the surrender prayer over each",
      "Ask God to reveal HIS plan for each area, even if it differs from yours",
      "Do one thing today that isn't in your plan but serves God's purposes"
    ],
    tombAffirmation: "Not my will, but Yours. My plans are on the altar."
  },
  {
    day: 9,
    week: 2,
    title: "Crucifying Ambition",
    theme: "Dying to Self-Promotion",
    scripture: "John 3:30",
    scriptureText: "He must increase, but I must decrease.",
    instruction: "Ambition is not evil, but self-serving ambition is the flesh disguised as motivation. Today you examine your ambitions — are they about His glory or yours? Do you want to be great, or do you want Him to be great through you?",
    surrenderExercise: "For everything you're currently working toward, ask: 'Would I still do this if no one ever knew it was me?' If the answer is no, that ambition is rooted in self. Confess it. Surrender it. Today, do something excellent and tell no one.",
    reflectionPrompt: "Where is your ambition secretly about your name rather than His? What would change if you worked only for an audience of One?",
    practicalActions: [
      "Test each ambition with the 'Would I do it anonymously?' question",
      "Do one excellent thing today and tell absolutely no one",
      "Pray for God to purify your motives in every area of striving"
    ],
    tombAffirmation: "He must increase. I must decrease. My name is not the point."
  },
  {
    day: 10,
    week: 2,
    title: "The Need to Be Right",
    theme: "Dying to Intellectual Pride",
    scripture: "1 Corinthians 8:1-2",
    scriptureText: "Knowledge puffeth up, but charity edifieth. And if any man think that he knoweth any thing, he knoweth nothing yet as he ought to know.",
    instruction: "Being right can become an idol. The need to win arguments, correct others, and demonstrate your knowledge is the flesh masquerading as truth. Today you die to the need to be right.",
    surrenderExercise: "In every conversation today, let someone else have the last word. If someone says something wrong, don't correct them unless it involves sin or harm. Practice the discipline of holding your tongue when you desperately want to prove your point.",
    reflectionPrompt: "How many times did you want to correct someone today? What does your need to be right reveal about your heart?",
    practicalActions: [
      "Practice letting others have the last word in every conversation",
      "Don't correct anyone today unless it involves sin or genuine harm",
      "Journal how it felt to stay silent when you knew you were right"
    ],
    tombAffirmation: "I don't need to be right. I need to be righteous."
  },
  {
    day: 11,
    week: 2,
    title: "Surrendering Control",
    theme: "Releasing Your Grip on Outcomes",
    scripture: "Proverbs 3:5-6",
    scriptureText: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    instruction: "Control is the ultimate expression of self-will. When you insist on controlling outcomes, you declare that God's sovereignty is not enough. Today you release your grip — on people, situations, and outcomes.",
    surrenderExercise: "Identify 3 situations you are currently trying to control. For each one, physically open your clenched fists as you pray: 'I release this to You. I trust Your sovereignty even if the outcome is not what I want.'",
    reflectionPrompt: "What is the connection between your need for control and your lack of trust in God? What are you really afraid of?",
    practicalActions: [
      "Name 3 situations you're trying to control and physically release them in prayer",
      "When anxiety about outcomes rises today, pray 'I trust You' instead of strategizing",
      "Let someone else make a decision you normally insist on making yourself"
    ],
    tombAffirmation: "I unclench my fists. I release control. God is sovereign."
  },
  {
    day: 12,
    week: 2,
    title: "Dying to Comfort",
    theme: "Embracing Discomfort for the Kingdom",
    scripture: "Hebrews 11:25-26",
    scriptureText: "Choosing rather to suffer affliction with the people of God, than to enjoy the pleasures of sin for a season; Esteeming the reproach of Christ greater riches than the treasures in Egypt.",
    instruction: "The flesh craves comfort above all. Today you deliberately choose discomfort — not as punishment, but as training. A soldier who cannot endure hardship cannot be trusted in battle.",
    surrenderExercise: "Choose one act of intentional discomfort today: a cold shower, skipping a meal, sleeping on the floor, or giving up your most-used comfort (phone, TV, coffee). As you endure the discomfort, pray: 'My body does not rule me. Christ does.'",
    reflectionPrompt: "What did physical discomfort teach you about your spiritual softness? How often does your flesh veto what God is asking?",
    practicalActions: [
      "Choose and complete one act of intentional physical discomfort",
      "Fast from your primary comfort source for 24 hours",
      "Journal what the discomfort revealed about your spiritual condition"
    ],
    tombAffirmation: "Comfort is not my master. I choose the cross over the couch."
  },
  {
    day: 13,
    week: 2,
    title: "The Altar of Relationships",
    theme: "Surrendering People You Cling To",
    scripture: "Genesis 22:2",
    scriptureText: "Take now thy son, thine only son Isaac, whom thou lovest, and get thee into the land of Moriah; and offer him there for a burnt offering.",
    instruction: "Abraham had to place Isaac on the altar — the person he loved most. Today you place your relationships on the altar. Not to lose them, but to hold them with open hands. Anyone you cannot live without besides God has become an idol.",
    surrenderExercise: "Name the person you are most afraid of losing. Pray: 'Lord, I place [name] on the altar. They are Yours, not mine. If You require me to release them, I will trust You.' Spend time honestly processing this before God.",
    reflectionPrompt: "Who have you made into an idol? How would your faith survive if God removed them from your life?",
    practicalActions: [
      "Identify your 'Isaac' — the person you cling to most",
      "Pray the altar prayer honestly, even if it brings tears",
      "Ask God to make Him your primary attachment, not any human being"
    ],
    tombAffirmation: "I place everyone I love on the altar. God alone is my security."
  },
  {
    day: 14,
    week: 2,
    title: "The Second Death",
    theme: "Week 2 Culmination — Dying to Self-Will",
    scripture: "Matthew 16:24-25",
    scriptureText: "If any man will come after me, let him deny himself, and take up his cross, and follow me. For whosoever will save his life shall lose it: and whosoever will lose his life for my sake shall find it.",
    instruction: "Week 2 is complete. You have confronted your plans, ambition, need to be right, need for control, comfort, and relational idols. Today you make your second declaration of death — this time, specifically to self-will.",
    surrenderExercise: "Write a 'Last Will and Testament of the Old Man.' Bequeath your self-will to the cross. Bequeath your plans to God. Bequeath your need for control to the Holy Spirit. Bequeath your comfort to the Kingdom. Sign it. Date it.",
    reflectionPrompt: "What has two weeks of dying revealed about how alive your flesh really was? What area still fights the hardest?",
    practicalActions: [
      "Write and sign your 'Last Will and Testament of the Old Man'",
      "Review your death certificate from Day 7 — has your understanding deepened?",
      "Spend 20 minutes in silent surrender, asking for nothing — just yielding"
    ],
    tombAffirmation: "My self-will is dead. I have written its will and signed its certificate."
  },

  // WEEK 3: Wrapped in Burial Cloths — Dying to the World
  {
    day: 15,
    week: 3,
    title: "Crucified to the World",
    theme: "Severing Worldly Attachments",
    scripture: "Galatians 6:14",
    scriptureText: "But God forbid that I should glory, save in the cross of our Lord Jesus Christ, by whom the world is crucified unto me, and I unto the world.",
    instruction: "Paul said the world was crucified to him — meaning it held no more attraction, power, or allure. Today you examine what the 'world' still offers that tempts you. Where does the world's system still have its hooks in you?",
    surrenderExercise: "Fast from all social media, news, and entertainment for 24 hours. Notice what you reach for and what feelings arise. Each time you feel the pull, pray: 'The world is crucified to me. I am crucified to the world.'",
    reflectionPrompt: "How many times did you reach for something worldly today? What void is the world filling that only God should fill?",
    practicalActions: [
      "Complete a 24-hour media fast (no social media, news, entertainment)",
      "Journal every time you reach for a worldly comfort or distraction",
      "Replace each worldly pull with 5 minutes of prayer or Scripture"
    ],
    tombAffirmation: "The world is dead to me, and I am dead to the world."
  },
  {
    day: 16,
    week: 3,
    title: "Stripping Away Reputation",
    theme: "Dying to What People Think",
    scripture: "Philippians 2:7",
    scriptureText: "But made himself of no reputation, and took upon him the form of a servant.",
    instruction: "Jesus made Himself of NO reputation. Your reputation — your image, your brand, what people think of you — must be stripped away. Today you die to the opinions of others.",
    surrenderExercise: "Do something today that risks your reputation for the sake of obedience. Serve in a lowly position. Share your faith publicly. Admit a weakness to someone who respects you. Let people see you as you truly are, not as you curate yourself to be.",
    reflectionPrompt: "Whose opinion do you fear most? What would you do differently if you truly didn't care what people thought?",
    practicalActions: [
      "Do one thing today that risks your reputation for Christ's sake",
      "Admit a genuine weakness or failure to someone who respects you",
      "Delete or refrain from posting anything designed to impress others"
    ],
    tombAffirmation: "I have no reputation to protect. Christ's opinion is the only one that matters."
  },
  {
    day: 17,
    week: 3,
    title: "Releasing Possessions",
    theme: "Dying to Material Security",
    scripture: "Matthew 6:19-21",
    scriptureText: "Lay not up for yourselves treasures upon earth, where moth and rust doth corrupt... For where your treasure is, there will your heart be also.",
    instruction: "A dead man owns nothing. Today you examine your relationship to possessions and money. Not whether you have them, but whether they have you. Where is your treasure — truly?",
    surrenderExercise: "Give away something valuable today. Not something you don't need — something that costs you. Feel the resistance. That resistance is the grip possessions have on your heart. Give until it hurts, then pray through the pain.",
    reflectionPrompt: "What possession would you refuse to give away if God asked? That is your idol. What did giving sacrificially reveal about your heart?",
    practicalActions: [
      "Give away something genuinely valuable to someone in need",
      "Identify the possession you would struggle most to release",
      "Pray: 'Everything I own is Yours. I am a steward, not an owner.'"
    ],
    tombAffirmation: "I own nothing. Everything belongs to God. I am a steward of His resources."
  },
  {
    day: 18,
    week: 3,
    title: "The Grave of Unforgiveness",
    theme: "Burying Every Grudge",
    scripture: "Ephesians 4:31-32",
    scriptureText: "Let all bitterness, and wrath, and anger, and clamour, and evil speaking, be put away from you, with all malice: And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
    instruction: "Unforgiveness is a chain that keeps you in the grave of the old man. You cannot rise with Christ while holding onto bitterness. Today you bury every grudge — every hurt, every offense, every debt someone owes you.",
    surrenderExercise: "Write the name of every person who has hurt you and what they did. For each person, pray: 'I forgive [name] for [offense]. I release the debt. I cancel what they owe me. I bless them in Jesus' name.' Tear up the list when done.",
    reflectionPrompt: "Which name was hardest to forgive? What happens in your heart when you truly release someone who doesn't deserve it?",
    practicalActions: [
      "Write your complete forgiveness list — leave no one out",
      "Pray the forgiveness prayer over each name and offense",
      "Tear up or burn the list as a physical act of release"
    ],
    tombAffirmation: "Every grudge is buried. Every debt is canceled. I forgive as I have been forgiven."
  },
  {
    day: 19,
    week: 3,
    title: "Dying to Approval",
    theme: "Freedom from People-Pleasing",
    scripture: "Galatians 1:10",
    scriptureText: "For do I now persuade men, or God? or do I seek to please men? for if I yet pleased men, I should not be the servant of Christ.",
    instruction: "People-pleasing is a subtle form of idolatry — it puts human approval above God's. Today you die to the need for others' validation, affirmation, and applause.",
    surrenderExercise: "Identify 3 relationships where you perform for approval. For each one, commit to being authentic instead of impressive today. Say 'no' to something you would normally agree to just to please someone. Let someone be disappointed in you.",
    reflectionPrompt: "Who do you most need approval from? What would change if God's 'well done' was the only approval you sought?",
    practicalActions: [
      "Identify your top 3 people-pleasing relationships",
      "Say 'no' to at least one request you would normally say 'yes' to out of people-pleasing",
      "Practice being honest instead of agreeable in every conversation today"
    ],
    tombAffirmation: "I serve an audience of One. Human approval is no longer my currency."
  },
  {
    day: 20,
    week: 3,
    title: "Burying Fear",
    theme: "Dying to Fear of Man and Circumstances",
    scripture: "2 Timothy 1:7",
    scriptureText: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    instruction: "Fear is the opposite of faith. It's the flesh's way of keeping you from the fight. Today you confront your fears — not by pretending they don't exist, but by burying them in the authority of Christ.",
    surrenderExercise: "List your top 5 fears (failure, rejection, death, poverty, abandonment, etc.). For each fear, find a Scripture that directly counters it. Write the fear on one side of a card and the Scripture on the other. When fear rises, flip to God's truth.",
    reflectionPrompt: "Which fear has most controlled your decisions? How different would your life be if you feared God alone?",
    practicalActions: [
      "List your top 5 fears and find a counter-Scripture for each",
      "Do one thing today that your fear has been preventing",
      "Memorize one fear-destroying verse and repeat it whenever anxiety rises"
    ],
    tombAffirmation: "Fear is buried. I walk in power, love, and a sound mind."
  },
  {
    day: 21,
    week: 3,
    title: "The Third Death",
    theme: "Week 3 Culmination — Dying to the World",
    scripture: "Colossians 3:2-3",
    scriptureText: "Set your affection on things above, not on things on the earth. For ye are dead, and your life is hid with Christ in God.",
    instruction: "Three weeks in the tomb. The world's chains have been addressed — possessions, reputation, unforgiveness, approval, and fear. Today you make your third declaration of death — this time to the entire world system.",
    surrenderExercise: "Write a 'Divorce Decree from the World.' Declare your separation from the world's value system, its definition of success, its standards of beauty, its measures of worth. You are now hidden with Christ in God. The world's opinion is irrelevant.",
    reflectionPrompt: "What has three weeks of dying revealed about how entangled with the world you were? What feels different now?",
    practicalActions: [
      "Write and sign your 'Divorce Decree from the World'",
      "Review your death certificate and last will from previous weeks",
      "Spend 30 minutes in worship — not asking for anything, just glorifying God"
    ],
    tombAffirmation: "I am divorced from the world. My life is hidden with Christ in God."
  },

  // WEEK 4: The Stone is Rolled Away — Resurrection Life Emerges
  {
    day: 22,
    week: 4,
    title: "Resurrection Morning",
    theme: "New Life Begins to Stir",
    scripture: "Romans 6:4",
    scriptureText: "Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life.",
    instruction: "Three weeks of death. Now resurrection begins. This is not the old you revived — it's the new you born. Christ's life flowing through a vessel that has been emptied of self. Today you begin to discover what resurrection life feels like.",
    surrenderExercise: "Spend 30 minutes in silent meditation on Romans 6:4-11. Ask the Holy Spirit to show you what 'newness of life' looks like for you specifically. Journal what He reveals. This is no longer about what you're dying to — it's about what Christ is birthing in you.",
    reflectionPrompt: "What is Christ birthing in you that the old man would never have allowed? What does 'new' feel like?",
    practicalActions: [
      "Meditate on Romans 6:4-11 for 30 minutes",
      "Journal what 'newness of life' looks like specifically for you",
      "Do one thing today that only the 'new you' would do"
    ],
    tombAffirmation: "I am raised with Christ. Newness of life is flowing through me."
  },
  {
    day: 23,
    week: 4,
    title: "Walking in the Spirit",
    theme: "Living by the Spirit, Not the Flesh",
    scripture: "Galatians 5:16",
    scriptureText: "This I say then, Walk in the Spirit, and ye shall not fulfil the lust of the flesh.",
    instruction: "Resurrection life is Spirit-led life. The old man walked by flesh — instinct, desire, emotion, self-interest. The new man walks by the Spirit — led, prompted, empowered, and directed by God. Today you practice Spirit-sensitivity.",
    surrenderExercise: "Before every decision today — no matter how small — pause and ask: 'Holy Spirit, what do You want me to do?' Wait for the impression. Obey immediately, even if it makes no sense to your natural mind. Journal every Spirit-prompt you receive.",
    reflectionPrompt: "How many Spirit-prompts did you receive today? How many did you obey? What happens when you live moment-by-moment in the Spirit?",
    practicalActions: [
      "Ask the Holy Spirit for direction before EVERY decision today",
      "Obey every Spirit-impression immediately, without rationalizing",
      "Journal each Spirit-prompt and whether you obeyed or resisted"
    ],
    tombAffirmation: "I walk in the Spirit. The flesh no longer drives my decisions."
  },
  {
    day: 24,
    week: 4,
    title: "Resurrection Power in Weakness",
    theme: "Strength Made Perfect in Weakness",
    scripture: "2 Corinthians 12:9-10",
    scriptureText: "My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.",
    instruction: "The resurrection paradox: power flows through weakness, not strength. When you are weak, Christ is strong. Today you stop pretending to be strong and embrace your weakness as a channel for His power.",
    surrenderExercise: "Share a genuine weakness or struggle with someone today — not to get sympathy, but to testify that God's power works through your brokenness. Confess where you are weak and watch God show Himself strong.",
    reflectionPrompt: "How does embracing weakness feel different from hiding it? Where did you experience God's power through your weakness today?",
    practicalActions: [
      "Share a genuine weakness with a trusted person",
      "When you feel inadequate today, pray: 'Your strength is made perfect here'",
      "Thank God for 3 specific weaknesses and how He uses them"
    ],
    tombAffirmation: "I glory in my weakness, for Christ's power rests upon me there."
  },
  {
    day: 25,
    week: 4,
    title: "The Ministry of Death",
    theme: "Helping Others Die to Self",
    scripture: "2 Corinthians 4:11-12",
    scriptureText: "For we which live are always delivered unto death for Jesus' sake, that the life also of Jesus might be made manifest in our mortal flesh. So then death worketh in us, but life in you.",
    instruction: "Death in you produces life in others. Your dying to self is not just personal transformation — it equips you to minister to others. Today you begin to pour out what the tomb has taught you.",
    surrenderExercise: "Share something you've learned in the Death Chamber with someone who needs it. Encourage a fellow believer who is struggling. Use your experience of dying to self to speak life into someone else's battle.",
    reflectionPrompt: "How did sharing your tomb experience minister to someone else? What happens when your death becomes someone else's life?",
    practicalActions: [
      "Share a Death Chamber lesson with a fellow believer",
      "Encourage someone who is struggling with a specific area you've surrendered",
      "Pray for someone by name, asking God to do in them what He's doing in you"
    ],
    tombAffirmation: "Death works in me so that life may flow to others."
  },
  {
    day: 26,
    week: 4,
    title: "Fighting from the Grave",
    theme: "Spiritual Warfare as a Dead Man",
    scripture: "Colossians 3:1-4",
    scriptureText: "If ye then be risen with Christ, seek those things which are above, where Christ sitteth on the right hand of God.",
    instruction: "A dead man cannot be threatened. A dead man has nothing to lose. This is the secret of spiritual warfare — you fight from a position of death. The enemy cannot intimidate someone who has already died.",
    surrenderExercise: "Identify the area where the enemy has been attacking you most. Now confront it from your position of death: 'I am dead. You cannot threaten a dead man. I have nothing you can take. Christ in me is your opponent, not my flesh.' Pray warfare prayers from this position.",
    reflectionPrompt: "How does fighting from death change the battle? What can the enemy threaten you with when you've already died?",
    practicalActions: [
      "Identify your primary spiritual battleground",
      "Pray warfare prayers from your position of death in Christ",
      "Declare aloud: 'I am dead. You have no power over a dead man.'"
    ],
    tombAffirmation: "I fight from the grave. The enemy cannot threaten what is already dead."
  },
  {
    day: 27,
    week: 4,
    title: "Bearing Fruit",
    theme: "Resurrection Life Produces Kingdom Fruit",
    scripture: "John 12:24",
    scriptureText: "Verily, verily, I say unto you, Except a corn of wheat fall into the ground and die, it abideth alone: but if it die, it bringeth forth much fruit.",
    instruction: "The seed that dies brings forth fruit. Your death in the tomb was never the end — it was the beginning of fruitfulness. Today you examine what fruit is emerging from your burial.",
    surrenderExercise: "Journal the changes you've noticed in yourself over the past 27 days. Where is fruit growing? Where has your character shifted? Where are relationships changing? Thank God for every evidence of resurrection fruit.",
    reflectionPrompt: "What fruit is emerging from your death? How have others noticed the change? What area still needs more dying before fruit can grow?",
    practicalActions: [
      "Journal all the changes — internal and external — from the past 27 days",
      "Ask a trusted person if they've noticed any changes in you",
      "Thank God specifically for each piece of fruit that has emerged"
    ],
    tombAffirmation: "The seed has died. Fruit is emerging. His life is becoming visible through me."
  },
  {
    day: 28,
    week: 4,
    title: "Unwrapping the Grave Clothes",
    theme: "Letting Go of Old Patterns",
    scripture: "John 11:44",
    scriptureText: "And he that was dead came forth, bound hand and foot with graveclothes... Jesus saith unto them, Loose him, and let him go.",
    instruction: "Lazarus came out of the tomb alive — but still wrapped in burial cloths. Resurrection has happened, but old patterns, habits, and mindsets can still cling. Today you identify the grave clothes that need to be removed.",
    surrenderExercise: "Identify old patterns that still cling even after dying: old speech patterns, old reactions, old thought patterns, old habits. For each one, invite the community of faith (or a trusted friend) to help 'unwrap' you — accountability, prayer, honest feedback.",
    reflectionPrompt: "What grave clothes still cling to you? Who in your life can help unwrap them? Are you willing to be vulnerable enough to let them?",
    practicalActions: [
      "List the old patterns that still cling despite your transformation",
      "Ask a trusted friend or group to help you identify blind spots",
      "Create an accountability plan for the grave clothes that remain"
    ],
    tombAffirmation: "I am alive, but grave clothes remain. I invite others to help unwrap me."
  },
  {
    day: 29,
    week: 4,
    title: "Daily Death",
    theme: "Making Death a Lifestyle",
    scripture: "1 Corinthians 15:31",
    scriptureText: "I protest by your rejoicing which I have in Christ Jesus our Lord, I die daily.",
    instruction: "The Death Chamber is not a one-time event — it is a daily reality. Paul died daily. Every morning you wake up, the flesh tries to resurrect itself. Every day requires a fresh death, a fresh surrender, a fresh burial.",
    surrenderExercise: "Create your personal 'Daily Death Protocol' — a morning routine that re-enacts your burial. Include: a confession of death (Gal 2:20), a surrender prayer, a review of your death certificate, and a declaration of resurrection life. Practice it today and commit to it going forward.",
    reflectionPrompt: "What will your daily death look like going forward? How will you ensure the tomb remains a reality and not just a memory?",
    practicalActions: [
      "Write your personal 'Daily Death Protocol' for ongoing use",
      "Practice the protocol this morning",
      "Commit to 5 minutes of death-and-resurrection prayer every morning"
    ],
    tombAffirmation: "I die daily. Every morning I return to the tomb before I enter the world."
  },
  {
    day: 30,
    week: 4,
    title: "The Tomb is Empty",
    theme: "Emergence — Walking in Resurrection Power",
    scripture: "Romans 8:11",
    scriptureText: "But if the Spirit of him that raised up Jesus from the dead dwell in you, he that raised up Christ from the dead shall also quicken your mortal bodies by his Spirit that dwelleth in you.",
    instruction: "Day 30. The tomb is empty — not because death failed, but because it finished its work. You have spent 30 days dying, being buried, and rising. You now carry resurrection power. The same Spirit that raised Christ from the dead dwells in you.",
    surrenderExercise: "Write your Completion Covenant (provided for you). Read it aloud. Sign it. Share it with your Tomb Space group or a trusted friend. Then go — fight as one who has already died. There is nothing the enemy can threaten you with. You have been to the grave and back.",
    reflectionPrompt: "Who are you now compared to Day 1? What has died? What has risen? How will you carry the tomb with you?",
    practicalActions: [
      "Read and sign the Completion Covenant",
      "Share your journey with your Tomb Space group or accountability partner",
      "Declare Romans 8:11 over your life as you step out of the tomb"
    ],
    tombAffirmation: "The tomb is empty. Christ lives in me. I fight from death, not toward it."
  }
];
