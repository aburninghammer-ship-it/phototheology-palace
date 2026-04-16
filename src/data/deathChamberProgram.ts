// Death Chamber 30-Day Tomb-Centered Formation Program
// "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me" — Galatians 2:20

export interface DeathChamberDay {
  day: number;
  week: number;
  title: string;
  theme: string;
  scripture: string;
  scriptureText: string;
  tombMeditation: string; // PRIMARY — the guided 15+ min meditation/prayer focus
  confessionFocus: string; // What to confess during meditation
  meditationPrompts: string[]; // Guided questions to sit with before God
  listeningFocus: string; // What to listen for from the Holy Spirit — Scripture, impressions, words
  restOfDay: string; // Brief instruction for how to carry it through the day
  practicalActions: string[];
  reflectionPrompt: string;
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

Each day begins with a guided meditation — at least 15 minutes in the presence of God, inside the tomb. This is the heart of the program. You will be told what to meditate on, what to confess, what to ask God to search, and what to surrender. The meditation is not optional — it IS the Death Chamber. Everything else flows from what happens in those minutes with God.

But here is the key: you are not here to talk. You are here to LISTEN. Think of yourself as a student sitting in the classroom of the Holy Spirit — the Divine Teacher. He will speak. He will bring Scriptures to mind. He will impress truths on your heart. He will convict, comfort, correct, and reveal. Your job is not to fill the silence with your words. Your job is to be still, listen, and receive what He gives you.

At the end of each session, you will be asked to write down what the Spirit said to you — specific verses He brought to mind, impressions He laid on your heart, words He spoke into your situation. Test everything against Scripture. If it aligns with God's Word, write it down. This is how you learn to hear His voice. The Death Chamber trains not only your will to die, but your ears to hear.

Every great warrior in the Kingdom learned this one truth: you cannot fight for God until you have died to yourself. The Death Chamber is where that death happens — systematically, intentionally, and completely.`,
  rules: [
    "You must complete each day before moving to the next. No skipping.",
    "The meditation is the main event. Give it at least 15 minutes. More is better.",
    "Listen more than you talk. You are a student. The Holy Spirit is the Teacher.",
    "Write down what the Spirit says — verses, impressions, convictions. Test everything by Scripture.",
    "Write your reflection honestly. This is between you and God.",
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
  // ============================================================
  // WEEK 1: Entering the Tomb — Recognition & Surrender
  // ============================================================
  {
    day: 1,
    week: 1,
    title: "The Door Closes Behind You",
    theme: "Acknowledging the Need to Die",
    scripture: "Romans 6:6",
    scriptureText: "Knowing this, that our old man is crucified with him, that the body of sin might be destroyed, that henceforth we should not serve sin.",
    tombMeditation: `Close your eyes. You are standing at the entrance of Christ's tomb — the place where the God of the universe lay dead. The stone is cold. The air is still. This is where death happened to defeat death.

Now picture yourself stepping inside. The doorway is narrow. You cannot bring anything with you — not your reputation, not your accomplishments, not your excuses. Just you, stripped bare before God.

As you stand in the darkness of the tomb, ask the Holy Spirit to show you the old man — the version of you that still fights for control. See him. He is the one who gets angry when he doesn't get his way. He is the one who lusts, who envies, who fears, who manipulates. He is the one who says "I deserve" and "I need" and "what about me?"

Don't look away. Don't minimize him. He is alive, and he has been running your life in ways you haven't admitted. Christ died to destroy him — but you have kept him breathing.

Sit with this. Let the Holy Spirit illuminate every corner where the old man hides. Your impatience. Your need to be liked. Your secret sins. Your pride disguised as confidence. Your fear disguised as wisdom. Let God show you what you've been protecting.`,
    confessionFocus: "Confess every area where the old man still controls you. Name them specifically — not vague generalities, but real patterns: 'I still choose anger when I'm disrespected. I still run to comfort instead of God when I'm anxious. I still protect my image rather than living honestly.'",
    meditationPrompts: [
      "Where does the old man show up most often in my daily life?",
      "What patterns have I been excusing or minimizing?",
      "If God showed me the full truth about my flesh right now, what would I see?",
      "What am I most afraid of admitting about myself?"
    ],
    listeningFocus: "Now be still. You have confessed and you have asked — now stop talking and listen. The Holy Spirit, your Divine Teacher, wants to reveal something specific about the old man that you have not yet seen. Sit as a student in His classroom. Listen for a Scripture, an impression, or a word He brings to your mind about what the old man has been hiding. Write down exactly what He shows you — test it against Scripture, and record it.",
    restOfDay: "Carry the awareness of the old man with you today. Every time you notice him acting — in a reaction, a thought, a desire — whisper: 'I see you. You are coming to the tomb.' Write a letter to your old self tonight, naming everything God showed you.",
    practicalActions: [
      "Write a letter to your old self naming every flesh pattern God revealed",
      "Read it aloud to God as a confession",
      "Identify your top 3 flesh patterns that resist God most strongly"
    ],
    reflectionPrompt: "What areas of your life does the 'old man' still control? Where have you been pretending he's already dead?",
    tombAffirmation: "I acknowledge that my old man still lives in areas of my life. Today, I bring him to the tomb."
  },
  {
    day: 2,
    week: 1,
    title: "Laying Down Your Rights",
    theme: "Surrendering Personal Rights",
    scripture: "Philippians 2:5-8",
    scriptureText: "Let this mind be in you, which was also in Christ Jesus: Who... made himself of no reputation, and took upon him the form of a servant.",
    tombMeditation: `Return to the tomb. The stone is behind you. There is no going back.

Today, meditate on what Christ gave up. He was GOD — with every right to glory, worship, comfort, and power. Yet He "made himself of no reputation." He chose the form of a servant. He chose the cross. No one took His life — He laid it down.

Now look at your own hands. They are clenched around things you believe you deserve. Your right to be respected. Your right to free time. Your right to comfort. Your right to be understood. Your right to fairness.

In the tomb, dead men have no rights. Picture Christ on the cross — beaten, mocked, stripped naked before the world. He had every right to call down legions of angels. He had every right to defend Himself. He had every right to walk away. But He released every right for you.

Now He asks you to do the same. Not to earn salvation — but because a dead man has no claims. Unclench your fists one finger at a time. Feel each right leaving your grip. The right to be comfortable. The right to be appreciated. The right to your own time. The right to be treated fairly. Let them fall to the tomb floor.

What is left in your hands? Nothing. And that is exactly where God can begin to work.`,
    confessionFocus: "Confess every right you cling to: 'Lord, I confess that I believe I deserve respect, comfort, recognition, success. I confess that when these are threatened, I react from flesh — with anger, withdrawal, resentment, or self-pity. I have been living as though I have rights. A dead man has none.'",
    meditationPrompts: [
      "What right do I react most strongly when it's violated?",
      "When I feel 'wronged,' what does that reveal about what I think I'm owed?",
      "Can I genuinely say 'I deserve nothing but the cross, and everything beyond that is grace'?",
      "What would my relationships look like if I stopped demanding my rights?"
    ],
    listeningFocus: "After you have unclenched your fists in prayer, become still before the Holy Spirit. He is the Divine Teacher, and you are the student. Listen — do not speak. Ask Him to show you which specific right He is asking you to release today. Wait for the Scripture, the impression, or the quiet knowing that He brings. When He speaks, write it down immediately and confirm it by His Word.",
    restOfDay: "Every time you feel your rights being violated today — someone cuts you off, someone disrespects you, something doesn't go your way — practice releasing it. Whisper: 'I am dead. Dead men have no rights.' Do one act of service today that costs you your comfort.",
    practicalActions: [
      "List every personal right you cling to and pray the surrender prayer over each",
      "When your rights are violated today, practice immediate release",
      "Do one act of service that costs you your comfort or time"
    ],
    reflectionPrompt: "Which 'right' was hardest to surrender? What does that reveal about where your identity is rooted?",
    tombAffirmation: "I am a dead man. Dead men have no rights. I release every claim."
  },
  {
    day: 3,
    week: 1,
    title: "The Silence of the Tomb",
    theme: "Embracing Silence and Solitude",
    scripture: "Psalm 46:10",
    scriptureText: "Be still, and know that I am God.",
    tombMeditation: `The tomb is utterly silent. No notifications. No music. No voices. No distractions. Just cold stone and the presence of God.

Today your meditation IS silence. But not empty silence — inhabited silence. God is here in the dark. He does not need your words. He does not need your plans. He does not need your performance. He needs your stillness.

Sit in complete silence for the full duration. No phone. No background noise. No reading. Just you and God in the tomb.

When thoughts rush in — and they will — do not fight them. Instead, notice them. Each racing thought is a revelation: it shows you what your soul runs to when the noise stops. Anxiety about tomorrow? That is your lack of trust. Replaying an argument? That is unforgiveness. Planning your next move? That is your need for control. Boredom? That is your addiction to stimulation.

Catch each thought. Name it. Then hand it to God: 'I give You this anxiety. I give You this anger. I give You this restlessness.' Let each thought float up like incense.

The tomb is teaching you something: you are terrified of silence because silence exposes. In the noise, you can hide. In the silence, you are naked before God. Stay naked. Stay still. Let Him search you.

After you have sat in silence, ask God one question and then listen — not for an audible voice, but for an impression, a knowing, a Scripture that surfaces: 'Lord, what are You trying to show me that my noise has been drowning out?'`,
    confessionFocus: "Confess your addiction to noise and distraction: 'Lord, I confess that I fill my life with noise because I am afraid of what the silence will reveal. I use entertainment, social media, busyness, and even ministry to avoid being alone with You and with the truth about myself.'",
    meditationPrompts: [
      "What thoughts rush in the moment I become still?",
      "What is my soul running from that only silence can expose?",
      "What has noise been protecting me from hearing — from God or from my own heart?",
      "Can I be at peace with God without producing, performing, or planning?"
    ],
    listeningFocus: "This entire day is about listening. You have entered the silence — now stay in it. Do not fill it with your words. You are a student seated before the Holy Spirit, the Divine Teacher, and He speaks in the stillness. Listen for the one thing your noise has been drowning out — a Scripture, a conviction, an impression, a single word. When it comes, write it down. This is how you learn to hear His voice.",
    restOfDay: "Fast from all entertainment media for the remainder of the day. No social media, no TV, no music, no podcasts. Let the silence of the tomb follow you. When you reach for distraction, stop and ask: 'What am I running from right now?'",
    practicalActions: [
      "Complete the full silent meditation — no shortcuts",
      "Fast from all entertainment media for the rest of the day",
      "Journal what surfaced in the silence — every thought, fear, and revelation"
    ],
    reflectionPrompt: "What thoughts rushed in during the silence? What is your soul trying to tell you that noise usually drowns out?",
    tombAffirmation: "In the silence of the tomb, I hear what my noise has been hiding."
  },
  {
    day: 4,
    week: 1,
    title: "Naming Your Idols",
    theme: "Identifying What You Worship Besides God",
    scripture: "Ezekiel 14:3",
    scriptureText: "Son of man, these men have set up their idols in their heart, and put the stumblingblock of their iniquity before their face.",
    tombMeditation: `In the tomb, there is only God. Nothing else. No comforts, no crutches, no substitutes. Just the living God in the place of death.

Now ask the Holy Spirit to show you what you have been worshiping besides Him. An idol is not just a golden calf — it is anything you run to for comfort, identity, security, or validation that is not God Himself.

Picture your heart as a throne room. God should be on the throne. But as you look around, you see other thrones — smaller ones, hidden in corners, draped in excuses.

There is the throne of Approval — where other people's opinions sit, dictating how you feel about yourself. There is the throne of Control — where your need to manage outcomes sits, stealing your peace. There is the throne of Comfort — where your body's demands sit, vetoing God's commands. There is the throne of Success — where your achievements sit, providing the identity that should come only from Christ. There is the throne of Relationship — where a person sits who has become your functional god, the one you cannot live without.

Go to each throne. Look at who sits there. Be honest — brutally honest. Complete this sentence before God for each area of your life: 'I cannot be okay without ___.' Whatever fills that blank that is not God — that is your idol.

Now imagine pulling each idol off its throne. It will resist. You will feel panic, grief, even anger. That emotional reaction is the proof of the idol's power. Pull it down anyway. In the tomb, there is only room for one God.`,
    confessionFocus: "Confess each idol by name: 'Lord, I confess that I have made ___ an idol. I have turned to it for what only You should provide. I have worshiped it with my time, attention, and emotional energy. Forgive me. Dethrone it. Take Your rightful place.'",
    meditationPrompts: [
      "What do I run to when I'm hurting that is not God?",
      "Whose approval am I most devastated to lose?",
      "What would I be terrified to have God take away from me?",
      "If everything was stripped from me except God, would He be enough?"
    ],
    listeningFocus: "Now be still before the Holy Spirit. You have named what you think your idols are — but He sees deeper. Sit as a student before the Divine Teacher and let Him name the idols you have missed or mislabeled. Listen for what He brings to the surface — a name, a habit, a desire you thought was innocent. When He speaks, write it down. His diagnosis is always confirmed by Scripture.",
    restOfDay: "Write each idol on a piece of paper. Tear it up or burn it as a physical act of dethroning. For the rest of the day, every time you feel the pull toward an idol, redirect: 'You are not my god. Only God is my god.'",
    practicalActions: [
      "Complete the 'I cannot be okay without' exercise for every area of life",
      "Write each idol on paper and physically destroy it as an act of dethroning",
      "Pray specifically for God to replace each idol with Himself"
    ],
    reflectionPrompt: "What idol surprised you the most? How long has it been enthroned in your heart?",
    tombAffirmation: "No idol will share the throne with God in my heart. I tear them down today."
  },
  {
    day: 5,
    week: 1,
    title: "The Weight of the Stone",
    theme: "Accepting the Cost of Discipleship",
    scripture: "Luke 14:27-28",
    scriptureText: "And whosoever doth not bear his cross, and come after me, cannot be my disciple. For which of you, intending to build a tower, sitteth not down first, and counteth the cost.",
    tombMeditation: `The tomb has a stone — massive, heavy, immovable by human strength. It sealed Christ's body inside. And now it seals you.

That stone represents the cost of following Christ all the way. Not the comfortable Christianity that asks nothing. Not the Sunday-morning faith that leaves the rest of the week untouched. The all-the-way faith. The take-up-your-cross faith. The lose-your-life-to-find-it faith.

Meditate on what that stone costs you. Be specific. Don't spiritualize it — make it real.

It may cost you friendships. People you love may not understand this path. They may mock you, distance themselves, or call you extreme. Can you bear that stone?

It may cost you career advancement. Integrity in a corrupt system has consequences. Refusing to compromise has a price tag. Can you bear that stone?

It may cost you pleasures. Habits you enjoy. Entertainment that feeds the flesh. Relationships that feel good but draw you away from God. Can you bear that stone?

It may cost you your reputation. People may think you're foolish, fanatical, or strange. Can you bear that stone?

Jesus said to count the cost BEFORE you build. So count it. Honestly. No false bravado. If there is a cost you are not willing to pay, don't pretend — bring that reluctance to God and ask Him to make you willing.

Sit with the weight of the stone. Feel it. It is supposed to be heavy. The cross was heavy too.`,
    confessionFocus: "Confess where you have been a half-hearted disciple: 'Lord, I confess that I have wanted the resurrection without the burial. I have wanted the crown without the cross. I have been counting the benefits but ignoring the cost. Show me where I have been unwilling to pay.'",
    meditationPrompts: [
      "What am I most afraid of losing if I follow Christ completely?",
      "Where have I been choosing comfort over obedience?",
      "Is there a cost I am secretly unwilling to pay? What is it?",
      "What would full surrender actually look like in my specific life?"
    ],
    listeningFocus: "After you have counted the cost in your own mind, be still. The Holy Spirit knows what the cost is for you specifically — not generically, but personally. Sit as a student before your Divine Teacher. Listen for what He says the cross will cost you that you have not yet considered. He may bring a Scripture, an impression, or a clear word. Write it down and test it against His Word.",
    restOfDay: "Write down everything following Christ 'all the way' will cost you. Be painfully specific. Beside each cost, write 'He is worth it' — but only if you mean it. If you can't write it honestly for any item, spend extra time tonight praying over that one.",
    practicalActions: [
      "Make your honest 'cost of discipleship' list with specific items",
      "Pray over any item where you hesitate — ask God to make you willing",
      "Read about believers who paid the ultimate cost and journal your response"
    ],
    reflectionPrompt: "Which cost feels the heaviest right now? Are you truly willing to pay it?",
    tombAffirmation: "I have counted the cost. The stone is heavy, but Christ is heavier."
  },
  {
    day: 6,
    week: 1,
    title: "Confessing Hidden Sin",
    theme: "Exposing What Darkness Conceals",
    scripture: "1 John 1:8-9",
    scriptureText: "If we say that we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
    tombMeditation: `The tomb is dark. But God sees in the dark. Nothing is hidden from the One who searches hearts and minds.

Today you bring your hidden sins into this tomb — the ones no one knows about. The ones you've justified. The ones you've minimized. The ones you've renamed so they sound less sinful. The 'small' sins you've given a pass. The habitual sins you've made peace with. The secret sins that would embarrass you if anyone knew.

Sit before God and ask Him to search you. Not the version of you that you present to others — the real you. The you at 2am. The you in your thought life. The you when no one is watching. The you in your browser history, your private conversations, your unspoken jealousies, your hidden bitterness.

David prayed, "Search me, O God, and know my heart: try me, and know my thoughts: and see if there be any wicked way in me" (Psalm 139:23-24). Pray this now. Then wait. Let God turn over every stone.

He is not searching you to condemn you — He is searching you to free you. Sin hidden is sin empowered. Sin confessed is sin broken. The blood of Christ does not cover what you will not uncover.

As each sin surfaces, do not flinch. Do not rationalize. Do not compare yourself to someone worse. Simply say: 'Lord, I have sinned. This is what I did. I confess it. I bring it into the light. Forgive me and cleanse me.'

Receive His forgiveness. He is faithful and just. Not "faithful and understanding." Faithful and JUST — meaning the blood of Christ has already paid for what you are confessing. The debt is covered. Receive it.`,
    confessionFocus: "Make your confession thorough and specific. Not 'forgive me for my sins' — that is too vague. Name them: 'I have harbored bitterness toward ___. I have looked at ___. I have lied about ___. I have coveted ___. I have neglected ___. I have misused ___.' Specificity breaks the power of hidden sin.",
    meditationPrompts: [
      "What sin have I been hiding the longest?",
      "What have I renamed to make it sound less sinful? (A 'struggle' that is actually rebellion? A 'weakness' that is actually willful sin?)",
      "If God played a highlight reel of my secret life, what would I be most ashamed of?",
      "What sin have I made peace with — stopped fighting and started accommodating?"
    ],
    listeningFocus: "After you have confessed, be completely still. The Holy Spirit is not finished — He wants to bring hidden sins into the light that you have not yet seen or named. Sit as a student before the Divine Teacher. Do not defend yourself. Do not explain. Just listen. He may bring a memory, a pattern, a Scripture that exposes what darkness has concealed. Write down everything He reveals and confirm it by His Word.",
    restOfDay: "Write a thorough confession — everything. Hold nothing back. Read it aloud to God. If the Spirit leads and it is safe, confess to a trusted believer (James 5:16). For the rest of the day, walk in the freedom of confession. When shame whispers, respond: 'It is in the light. The blood covers it.'",
    practicalActions: [
      "Write a thorough, specific confession — hold nothing back",
      "Pray through the confession, receiving God's forgiveness for each item",
      "If led, confess to a trusted accountability partner (James 5:16)"
    ],
    reflectionPrompt: "What sin have you been hiding the longest? How does bringing it to light change its power over you?",
    tombAffirmation: "Nothing is hidden in the tomb. I bring everything into the light."
  },
  {
    day: 7,
    week: 1,
    title: "The First Death",
    theme: "Week 1 Culmination — Formal Declaration of Death",
    scripture: "Galatians 2:20",
    scriptureText: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.",
    tombMeditation: `You have spent six days entering the tomb. You have confronted the old man. You have surrendered your rights. You have sat in silence. You have named your idols. You have counted the cost. You have confessed your hidden sins.

Today, you die.

This is not metaphorical. This is not emotional. This is covenantal. You are making a binding, witnessed declaration before the God of the universe that the old man — everything you have confronted this week — is now dead.

Picture yourself lying on the stone slab where Christ lay. Your arms are at your sides. Your eyes are closed. You are not struggling. You are not negotiating. You are dying.

As you lie there, let each thing you've surrendered this week pass before you one final time — your rights, your idols, your hidden sins, your need for control, your comfort. Watch them file past like mourners at a funeral. They are mourning because they are losing their host. Let them mourn.

Now hear Christ speak Galatians 2:20 over you. Not as a verse — as a reality. "You are crucified with Me. The old man is dead. But you are alive — not the old you, but Me in you. The life you now live, you live by My faith. I loved you. I gave Myself for you. And now I live in you."

Receive that. Let it sink past your intellect into your spirit. You are dead. And Christ lives in you.

Sign your death certificate today. Make it formal. Make it real.`,
    confessionFocus: "Confess anything remaining from the week that you held back: 'Lord, if there is anything I protected, anything I hid, anything I refused to surrender — I release it now. I hold nothing back. The old man dies today — completely.'",
    meditationPrompts: [
      "Am I truly ready to declare the old man dead, or am I still negotiating?",
      "What am I still quietly protecting from God?",
      "How does formally declaring 'I am dead' change how I see tomorrow?",
      "What shifts when I truly believe I have died with Christ?"
    ],
    listeningFocus: "Before you sign your death declaration, be still and listen. The Holy Spirit has a word to speak over this moment — a Scripture, a confirmation, a seal on what you are about to declare. Sit as a student before the Divine Teacher. This is not your declaration alone; He wants to co-sign it. Wait for what He brings to mind and write it down. His word over your death will anchor you in the days ahead.",
    restOfDay: "Write and sign your personal death certificate. Include: your name, today's date, cause of death (the cross of Christ), and a list of what is being buried. Read Galatians 2:20 aloud as your creed. Keep the certificate — you will reference it again.",
    practicalActions: [
      "Write and sign your personal death certificate",
      "Read Galatians 2:20 aloud as your declaration",
      "Spend time in worship — thanking God for the death that brings life"
    ],
    reflectionPrompt: "How does formally declaring 'I am dead' change the way you see tomorrow? What shifts when you truly believe you've died?",
    tombAffirmation: "I am dead. The certificate is signed. Christ now lives in me."
  },

  // ============================================================
  // WEEK 2: The Burial Process — Dying to Self-Will
  // ============================================================
  {
    day: 8,
    week: 2,
    title: "Not My Will",
    theme: "Surrendering Your Plans to God's Plans",
    scripture: "Luke 22:42",
    scriptureText: "Father, if thou be willing, remove this cup from me: nevertheless not my will, but thine, be done.",
    tombMeditation: `Return to the tomb. You are deeper now. The entrance is far behind you.

Today, meditate on Gethsemane. Jesus — the Son of God — fell on His face and said, "Not My will, but Yours." He sweated drops of blood. He asked for the cup to pass. He was not performing — He was agonizing. The most surrendered Man who ever lived still had to wrestle His human will into submission.

If Jesus had to wrestle, so will you.

You have plans. A five-year vision. Career goals. Relationship expectations. Financial targets. A picture of what your life "should" look like. These plans feel like wisdom. They feel like responsibility. But are they YOUR plans or GOD'S plans?

Lay each plan before God in the tomb. Hold them up to the light of His sovereignty and ask: "Father, is this Your will or mine?" Some of your plans may align with His. But some — perhaps the ones you hold tightest — may be the ones He wants you to release.

The hardest prayer in the Christian life is not "Give me." It is "Not my will." It is the death of self-sovereignty. It is admitting that you are not the author of your story — He is.

Pray Luke 22:42 over each area of your life. Mean it. If you cannot mean it for a particular plan, stay there. Wrestle. Sweat. But do not leave Gethsemane until you can say, "Not my will, but Yours."`,
    confessionFocus: "Confess where you have been running your own life: 'Lord, I confess that I have treated my plans as non-negotiable. I have asked for Your blessing on MY agenda rather than surrendering to Yours. I have been the god of my own story. Forgive me.'",
    meditationPrompts: [
      "Which of my plans am I most afraid God will contradict?",
      "Where have I been asking God to bless my agenda instead of seeking His?",
      "If God said 'change everything,' what would I refuse to release?",
      "Can I honestly pray 'not my will' over my career, relationships, finances, and future?"
    ],
    listeningFocus: "After you have laid your plans before God, stop talking and listen. The Holy Spirit wants to show you the difference between your plans and His. Sit as a student before the Divine Teacher. He may bring a Scripture that redirects you, an impression of a door He is opening that you have not considered, or a quiet knowing about a plan He wants you to release. Write down what He reveals — His plans are always confirmed by His Word.",
    restOfDay: "Write down your top 5 life plans. For each one, pray: 'Father, if this is not Your will, I release it completely.' Do one thing today that isn't in your plan but serves God's purposes.",
    practicalActions: [
      "List your top 5 life plans and pray the Gethsemane prayer over each",
      "Ask God to reveal HIS plan for each area, even if it differs from yours",
      "Do one thing today that isn't in your plan but serves His purposes"
    ],
    reflectionPrompt: "Which plan was hardest to surrender? What does that tell you about where you find your identity and security?",
    tombAffirmation: "Not my will, but Yours. My plans are on the altar."
  },
  {
    day: 9,
    week: 2,
    title: "Crucifying Ambition",
    theme: "Dying to Self-Promotion",
    scripture: "John 3:30",
    scriptureText: "He must increase, but I must decrease.",
    tombMeditation: `In the tomb, there is no audience. No one to impress. No platform. No applause. Just you and God in the dark.

Meditate on this: ambition itself is not evil. God gives vision, purpose, and drive. But self-serving ambition — the kind that is secretly about YOUR name, YOUR recognition, YOUR legacy — is the flesh dressed in spiritual clothing.

Ask God to show you the difference in your life. Where is your drive about His glory, and where is it about yours? Here is the test John the Baptist gives us: "He must increase, but I must decrease." Can you genuinely rejoice when someone else gets the credit? Can you work excellently and remain anonymous? Can you build something beautiful and let someone else's name go on it?

Picture yourself building a great cathedral for God — and then watching Him put someone else's name on the cornerstone. How does that feel? The anger, the resentment, the sense of injustice you feel in that moment — that is the measure of how much your ambition is about you.

John the Baptist was the greatest prophet ever born. And he said, "I must decrease." He was not threatened by Jesus' rising. He was fulfilled by it. He understood that his purpose was not to be great, but to make Someone else great.

Die to the need to be seen. Die to the need to be credited. Die to the need to build YOUR kingdom. In the tomb, your name means nothing. His name is everything.`,
    confessionFocus: "Confess self-serving ambition: 'Lord, I confess that much of my striving has been about my name, not Yours. I have wanted to be great, not to make You great. I have served with one eye on the reward, one eye on who's watching. Purify my motives.'",
    meditationPrompts: [
      "Would I still do what I'm doing if no one ever knew it was me?",
      "Where am I secretly building my kingdom while calling it God's?",
      "Can I genuinely rejoice when someone else gets the recognition I wanted?",
      "What would change if I worked exclusively for an audience of One?"
    ],
    listeningFocus: "Now be still. You have examined your ambitions — but the Holy Spirit sees motives you cannot. Sit as a student before the Divine Teacher and listen for where He says your ambition has been self-serving, even in ministry, even in good works. He may bring a specific memory, a conviction, or a Scripture that pierces through the spiritual disguise. Write down what He reveals. Do not perform in this moment — just receive.",
    restOfDay: "Do one excellent thing today and tell absolutely no one. Serve anonymously. Give without recognition. Watch how your flesh reacts to the absence of applause.",
    practicalActions: [
      "Test each ambition with the 'Would I do it anonymously?' question",
      "Do one excellent thing today and tell absolutely no one",
      "Pray for God to purify your motives in every area of striving"
    ],
    reflectionPrompt: "Where is your ambition secretly about your name rather than His? What would change if you worked only for an audience of One?",
    tombAffirmation: "He must increase. I must decrease. My name is not the point."
  },
  {
    day: 10,
    week: 2,
    title: "The Need to Be Right",
    theme: "Dying to Intellectual Pride",
    scripture: "1 Corinthians 8:1-2",
    scriptureText: "Knowledge puffeth up, but charity edifieth. And if any man think that he knoweth any thing, he knoweth nothing yet as he ought to know.",
    tombMeditation: `The tomb levels everyone. Degrees mean nothing here. Theological expertise is worthless. Your ability to win arguments is empty. In the tomb, you are not a teacher, a leader, or an expert. You are a dead man.

Meditate on this: being right can become an idol. The need to correct, to demonstrate knowledge, to win debates, to have the final word — this is the flesh masquerading as love for truth. Paul says knowledge "puffs up." It inflates the ego. It makes you feel superior. And that superiority is poison.

Think about your conversations. How often do you listen to understand versus listen to respond? How often do you let someone finish their thought before you're already formulating your rebuttal? How often do you correct people — not because souls are at stake, but because YOUR knowledge is at stake?

Jesus — who was omniscient — often asked questions instead of giving answers. He who knew all things chose to listen. He who was always right chose not to prove it. He let people misunderstand Him. He let them walk away. He did not chase them down with arguments.

In the tomb, you are not the smartest person in the room. You are not the most theologically precise. You are nothing. And from nothing, God can build something truly useful — a vessel that speaks truth in love, not truth as a weapon.

Confess your intellectual pride. Confess the times you used knowledge to feel superior. Confess the arguments you won that cost you a relationship.`,
    confessionFocus: "Confess intellectual pride: 'Lord, I confess that I have used my knowledge as a weapon and my correctness as a shield for my ego. I have wounded people to prove points. I have valued being right more than being loving. Forgive my arrogance.'",
    meditationPrompts: [
      "How often do I listen to prove I'm right versus listen to understand?",
      "Who have I wounded with my need to correct?",
      "Can I let someone be wrong without intervening — unless their soul is at stake?",
      "Would I rather be right or be righteous?"
    ],
    listeningFocus: "Now close your mouth and open your ears. You are the student — the Holy Spirit is the Teacher. Today of all days, listen rather than teach. Ask Him to show you where your knowledge has puffed you up rather than built others up. Wait for His impression, His Scripture, His still small voice. He may convict you of a specific conversation, a pattern of correction, or an attitude you disguised as zeal for truth. Write down what He teaches you.",
    restOfDay: "In every conversation today, let someone else have the last word. If someone says something wrong, don't correct them unless it involves sin or genuine harm. Hold your tongue when you desperately want to prove your point.",
    practicalActions: [
      "Let others have the last word in every conversation today",
      "Don't correct anyone unless it involves sin or genuine harm",
      "Journal how it felt to stay silent when you knew you were right"
    ],
    reflectionPrompt: "How many times did you want to correct someone today? What does your need to be right reveal about your heart?",
    tombAffirmation: "I don't need to be right. I need to be righteous."
  },
  {
    day: 11,
    week: 2,
    title: "Surrendering Control",
    theme: "Releasing Your Grip on Outcomes",
    scripture: "Proverbs 3:5-6",
    scriptureText: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    tombMeditation: `Look at your hands in the tomb. They are clenched — gripping tightly to outcomes, people, situations, plans. Your knuckles are white. You may not even realize how tightly you're holding on.

Control is the deepest expression of self-will. When you control, you declare: "God's sovereignty is not enough. I need to manage this myself." It masquerades as wisdom, as responsibility, as "being proactive." But underneath, it is fear. Fear that God won't come through. Fear that the outcome will be wrong. Fear that if you let go, everything will fall apart.

Meditate on what you are currently trying to control. Your children's choices. Your spouse's behavior. Your financial future. Your health. Your ministry. A relationship's outcome. A project at work. A conflict resolution.

Now ask: "If I released this completely to God, what am I afraid would happen?" Sit with that fear. Name it. That fear is the root of your control.

Christ in the tomb had no control. He could not manage the outcome. He could not ensure the disciples would stay faithful. He could not orchestrate His own resurrection. He was DEAD. And from that complete lack of control, God raised Him in the most powerful act in history.

God works best when you stop working. His power flows through surrender, not management. Open your fists. One finger at a time. Feel the panic. Feel the vulnerability. Then pray: "I trust You. Even if the outcome is not what I want. I trust You."`,
    confessionFocus: "Confess your need for control: 'Lord, I confess that I have been trying to play God in my life and the lives of others. I have been managing, manipulating, and micromanaging outcomes because I don't trust Your sovereignty. I repent. You are God, and I am not.'",
    meditationPrompts: [
      "What am I most afraid would happen if I stopped controlling this situation?",
      "Where has my 'wisdom' actually been a mask for distrust in God?",
      "What would happen if I truly let go of every outcome today?",
      "Do I believe God is sovereign, or do I believe He needs my help?"
    ],
    listeningFocus: "With your fists unclenched, be still and listen. The Holy Spirit wants to speak to you about trust — not in theory, but in the specific situation you are gripping tightest. Sit as a student before the Divine Teacher. Listen for what He says about the outcome you are trying to manage. He may bring a Scripture of assurance, an impression of peace, or a word that redefines the situation entirely. Write down what He speaks and anchor it in His Word.",
    restOfDay: "Identify 3 situations you are currently trying to control. Physically open your clenched fists as you release each one. When anxiety about outcomes rises today, pray 'I trust You' instead of strategizing.",
    practicalActions: [
      "Name 3 situations you're trying to control and physically release them",
      "When anxiety rises today, pray 'I trust You' instead of strategizing",
      "Let someone else make a decision you normally insist on making yourself"
    ],
    reflectionPrompt: "What is the connection between your need for control and your lack of trust in God? What are you really afraid of?",
    tombAffirmation: "I unclench my fists. I release control. God is sovereign."
  },
  {
    day: 12,
    week: 2,
    title: "Dying to Comfort",
    theme: "Embracing Discomfort for the Kingdom",
    scripture: "Hebrews 11:25-26",
    scriptureText: "Choosing rather to suffer affliction with the people of God, than to enjoy the pleasures of sin for a season; Esteeming the reproach of Christ greater riches than the treasures in Egypt.",
    tombMeditation: `The tomb is cold. Hard stone. No pillow. No blanket. No temperature control. No comfort.

And that is precisely the point.

Your flesh craves comfort above almost everything. It vetoes God's commands with a single objection: "But that's uncomfortable." It prevents you from witnessing — too awkward. It prevents you from giving — too costly. It prevents you from serving — too inconvenient. It prevents you from obeying — too hard.

Meditate on how often comfort has been the deciding factor in your obedience. How many times has God prompted you, and your flesh said, "Not right now — I'm tired. I'm busy. I'm not in the mood. I'll do it later."

Now meditate on Christ. He left the comfort of heaven — infinite glory, perfect worship, streets of gold — and was born in a stable. He slept on the ground. He was hungry, thirsty, tired, homeless. He sweat blood. He endured the cross.

He chose affliction over comfort because comfort was never the point. The Kingdom was the point.

A soldier who cannot endure discomfort cannot be trusted in battle. If you can only obey when it's convenient, you are not a soldier — you are a volunteer who shows up when the weather is nice.

Today in the tomb, surrender your comfort. Tell your flesh: "You are not in charge. You do not get a vote. Christ is Lord — not my stomach, not my fatigue, not my desire for ease."`,
    confessionFocus: "Confess your worship of comfort: 'Lord, I confess that I have let comfort be the deciding vote in my obedience. I have chosen ease over faithfulness, convenience over calling, pleasure over purpose. My flesh has had veto power over Your Spirit. I repent.'",
    meditationPrompts: [
      "How many times has 'I don't feel like it' overruled God's prompting?",
      "What areas of obedience have I been avoiding because they're uncomfortable?",
      "If comfort were removed from my life completely, would my faith survive?",
      "What has my addiction to ease cost me spiritually?"
    ],
    listeningFocus: "Now be still in the discomfort. Do not rush to relief. The Holy Spirit speaks most clearly when the flesh is uncomfortable and cannot distract you. Sit as a student before the Divine Teacher and listen for where He is calling you to embrace discomfort for the Kingdom — a specific act of obedience, a conversation you have avoided, a sacrifice He is requesting. Write down what He impresses upon you and confirm it by Scripture.",
    restOfDay: "Choose one act of intentional discomfort today — a cold shower, skipping a meal, sleeping on the floor, or giving up your most-used comfort. As you endure it, pray: 'My body does not rule me. Christ does.'",
    practicalActions: [
      "Choose and complete one act of intentional physical discomfort",
      "Fast from your primary comfort source for 24 hours",
      "Journal what the discomfort revealed about your spiritual condition"
    ],
    reflectionPrompt: "What did physical discomfort teach you about your spiritual softness? How often does your flesh veto what God is asking?",
    tombAffirmation: "Comfort is not my master. I choose the cross over the couch."
  },
  {
    day: 13,
    week: 2,
    title: "The Altar of Relationships",
    theme: "Surrendering People You Cling To",
    scripture: "Genesis 22:2",
    scriptureText: "Take now thy son, thine only son Isaac, whom thou lovest, and get thee into the land of Moriah; and offer him there for a burnt offering.",
    tombMeditation: `Abraham waited 25 years for Isaac. The promised son. The miracle child. The one his entire future rested on. And God said: "Offer him as a burnt offering."

Sit with the horror of that. God asked Abraham to destroy the very thing God Himself had given him. Why? Because Isaac had become more than a son — he had become Abraham's functional god. The gift had replaced the Giver.

Now sit before God and ask: "Who is my Isaac?"

Who is the person you are most afraid of losing? Whose love do you need to function? Whose approval determines your mood? Whose presence you have made essential to your well-being?

This is not about loving people less. It is about loving God more. It is about holding every relationship with open hands — knowing that people are gifts, not gods. When a person becomes the reason you can face the day, that person is sitting on God's throne.

Picture yourself walking up Mount Moriah with your Isaac. Feel the weight of what God is asking. He is not asking you to stop loving them. He is asking you to stop needing them more than you need Him.

Lay them on the altar. Say their name aloud: "Lord, I place ___ on the altar. They are Yours, not mine. If You require me to release them, I will trust You." This may bring tears. Let them come. Abraham wept too. But he obeyed.

God may give your Isaac back — as He did for Abraham. Or He may not. Either way, He must be enough.`,
    confessionFocus: "Confess relational idolatry: 'Lord, I confess that I have made ___ an idol. I have drawn from them what only You should provide — security, identity, worth, peace. I have loved the gift more than the Giver. I place them on the altar today.'",
    meditationPrompts: [
      "Whose loss would devastate my faith — not just my emotions, but my ability to trust God?",
      "Have I made any person essential to my well-being in a way only God should be?",
      "How would my walk with God change if this person were removed from my life?",
      "Can I honestly say 'God alone is enough' — or do I need God plus someone?"
    ],
    listeningFocus: "After you have placed your Isaac on the altar, be still. The Holy Spirit wants to speak to you about His peace replacing your emotional reactions and relational dependencies. Sit as a student before the Divine Teacher. Listen for how He defines love differently than you have been defining it — not as clinging, but as open-handed blessing. He may bring a Scripture, a new perspective on a relationship, or a word of comfort. Write down what He speaks.",
    restOfDay: "After your meditation, spend time praying for the person you placed on the altar. Not clinging — blessing. Ask God to make Himself your primary attachment.",
    practicalActions: [
      "Identify your 'Isaac' — the person you cling to most — and pray the altar prayer",
      "Pray a blessing over them — not from clinging, but from open hands",
      "Ask God to become your primary source of security, not any person"
    ],
    reflectionPrompt: "Who have you made into an idol? How would your faith survive if God removed them from your life?",
    tombAffirmation: "I place everyone I love on the altar. God alone is my security."
  },
  {
    day: 14,
    week: 2,
    title: "The Second Death",
    theme: "Week 2 Culmination — Dying to Self-Will",
    scripture: "Matthew 16:24-25",
    scriptureText: "If any man will come after me, let him deny himself, and take up his cross, and follow me. For whosoever will save his life shall lose it: and whosoever will lose his life for my sake shall find it.",
    tombMeditation: `Two weeks in the tomb. The burial is deepening.

This week you have confronted your self-will in its many disguises — your plans, your ambition, your need to be right, your need for control, your addiction to comfort, and your relational idols. Each one was a tentacle of the same creature: the self-life that insists on ruling.

Today, meditate on the totality of self-will. Not just individual areas, but the root system itself. The part of you that says: "I know best. I will decide. My way. My timing. My terms."

Jesus said, "Deny yourself." Not "deny yourself some things." Deny YOUR SELF. The entire self-governing system. The autonomous, independent, I-am-my-own-god operating system that runs your life.

Picture that operating system. It has been running since childhood. It has adapted, evolved, learned to survive. It is sophisticated — it can even use spiritual language to justify itself. "God wants me to be happy." "I need to take care of myself." "I know what's best for my family."

Today you shut it down. Not parts of it — all of it. You declare before God: "I am no longer self-governing. My will is dead. I have no agenda except Yours. I have no plan except Yours. I have no ambition except Yours."

Write your Last Will and Testament of the Old Man. Bequeath your self-will to the cross. Bequeath your plans to God. Bequeath your need for control to the Holy Spirit. Bequeath your comfort to the Kingdom.`,
    confessionFocus: "Confess self-sovereignty: 'Lord, I confess that I have been the god of my own life. Even in my obedience, there has been negotiation. Even in my surrender, there have been conditions. Today I confess the root: I have wanted to be in charge. I abdicate the throne.'",
    meditationPrompts: [
      "Where is the root of self-will still alive despite two weeks of dying?",
      "Am I truly ready to stop self-governing, or am I still negotiating terms?",
      "What has two weeks of dying revealed about how alive my flesh really was?",
      "Can I say 'I have no will of my own' and mean it?"
    ],
    listeningFocus: "Before you write your last will, be still and listen. The Holy Spirit wants to confirm this burial — to speak His word over the death of your self-will. Sit as a student before the Divine Teacher. Listen for His confirmation that the burial is real, not performative. He may bring a Scripture of assurance, an impression of finality, or a word that seals what two weeks of dying have accomplished. Write it down. His confirmation will sustain you.",
    restOfDay: "Write and sign your 'Last Will and Testament of the Old Man.' Review your death certificate from Day 7. Spend 20 minutes in silent surrender, asking for nothing — just yielding.",
    practicalActions: [
      "Write and sign your 'Last Will and Testament of the Old Man'",
      "Review your death certificate from Day 7 — has your understanding deepened?",
      "Spend 20 minutes in silent surrender, asking for nothing — just yielding"
    ],
    reflectionPrompt: "What has two weeks of dying revealed about how alive your flesh really was? What area still fights the hardest?",
    tombAffirmation: "My self-will is dead. I have written its will and signed its certificate."
  },

  // ============================================================
  // WEEK 3: Wrapped in Burial Cloths — Dying to the World
  // ============================================================
  {
    day: 15,
    week: 3,
    title: "Crucified to the World",
    theme: "Severing Worldly Attachments",
    scripture: "Galatians 6:14",
    scriptureText: "But God forbid that I should glory, save in the cross of our Lord Jesus Christ, by whom the world is crucified unto me, and I unto the world.",
    tombMeditation: `Paul says something extraordinary: "The world is crucified to me, and I to the world." The world is DEAD to him. It has no attraction, no pull, no power. And he is dead to it — he offers it nothing.

In the tomb today, examine your relationship with the world's system. Not just "worldly" things in the obvious sense — but the entire value system that operates apart from God. The world's definition of success. The world's definition of beauty. The world's definition of happiness. The world's definition of security.

How deeply have these definitions infiltrated your thinking? Do you measure success by income, influence, or followers? Do you measure beauty by the world's standard? Do you believe happiness comes from circumstances? Do you feel secure only when the bank account is full?

The world is a system designed to replace God. It offers counterfeits for everything God provides. Identity? The world says build a brand. Security? The world says build wealth. Significance? The world says build a platform. Love? The world says it's about feelings.

Each counterfeit looks real. Each one satisfies temporarily. But none of them last — and each one pulls you further from the tomb where real life begins.

Sit before God and ask: "Where has the world's system shaped me more than Your Word?" Let Him show you. It runs deeper than you think.`,
    confessionFocus: "Confess worldly assimilation: 'Lord, I confess that I have absorbed the world's values without even noticing. I measure my worth by worldly metrics. I pursue worldly comforts as though they are necessities. I have been conformed to this world while calling myself transformed. Renew my mind.'",
    meditationPrompts: [
      "What worldly value have I absorbed so deeply that I think it's biblical?",
      "Where do I measure my worth by the world's metrics?",
      "What would I reach for first if the world offered it — fame, money, beauty, power?",
      "If every worldly comfort were stripped away, what would be left of my faith?"
    ],
    listeningFocus: "Now be still and listen. The Holy Spirit wants to show you the opinion that matters — His, not the crowd's. Sit as a student before the Divine Teacher. The world has been whispering its definitions of success, beauty, and worth into your ears for years. Now listen for His voice cutting through. He may bring a Scripture that redefines your value, an impression of who you truly are in Him, or a word that exposes a worldly belief you mistook for truth. Write it down.",
    restOfDay: "Fast from all social media, news, and entertainment for 24 hours. Each time you feel the pull, pray: 'The world is crucified to me. I am crucified to the world.'",
    practicalActions: [
      "Complete a 24-hour media fast — no social media, news, entertainment",
      "Journal every time you reach for a worldly comfort or distraction",
      "Replace each worldly pull with 5 minutes of prayer or Scripture"
    ],
    reflectionPrompt: "How many times did you reach for something worldly today? What void is the world filling that only God should fill?",
    tombAffirmation: "The world is dead to me, and I am dead to the world."
  },
  {
    day: 16,
    week: 3,
    title: "Stripping Away Reputation",
    theme: "Dying to What People Think",
    scripture: "Philippians 2:7",
    scriptureText: "But made himself of no reputation, and took upon him the form of a servant.",
    tombMeditation: `"Made Himself of NO reputation." The Greek is kenosis — He emptied Himself. He poured out every last drop of status, dignity, and public perception. The King of kings was born in a barn, raised by a carpenter, executed between criminals, and buried in a borrowed tomb.

In the tomb, your reputation is irrelevant. No one can see you. No one is impressed. No one is watching your performance. And that terrifies you — because for most of your life, you have been curating an image.

Sit before God and face this question: "Who am I without my reputation?"

Strip away what people think of you. Strip away your titles. Strip away your accomplishments. Strip away your social media persona. Strip away the version of you that you present at church, at work, at family gatherings. What is left?

Many people discover that without their reputation, they feel like nothing. That feeling is the revelation — it means your identity has been built on shifting sand. Other people's opinions. Public perception. Social approval. These are your foundation, not Christ.

Jesus let people call Him a drunkard, a friend of sinners, demon-possessed, a blasphemer. He did not correct them. He did not launch a PR campaign. He did not post a response. He made Himself of NO reputation — because His identity was entirely rooted in the Father.

Where is your identity rooted? In the tomb, find out.`,
    confessionFocus: "Confess image management: 'Lord, I confess that I have spent enormous energy managing how people see me. I have curated, performed, edited, and filtered my life to appear better than I am. I have feared man more than I have feared You. Strip away my false image.'",
    meditationPrompts: [
      "Whose opinion do I fear most? Why do they have that power over me?",
      "Who would I be if no one was watching and no one cared?",
      "What image have I been protecting that is not the real me?",
      "What would I do differently if I truly didn't care what people thought?"
    ],
    listeningFocus: "Now be still. You have been listening to the crowd your whole life — now listen to the One whose opinion actually matters. Sit as a student before the Holy Spirit, the Divine Teacher. Ask Him: 'What do You think of me?' and then wait. He may bring a Scripture of identity, an impression of how He sees you apart from your reputation, or a word that frees you from the audience. Write down what He says — His assessment is the only one that counts.",
    restOfDay: "Do something today that risks your reputation for the sake of obedience. Serve in a lowly position. Admit a weakness to someone who respects you. Let people see the real you.",
    practicalActions: [
      "Do one thing today that risks your reputation for Christ's sake",
      "Admit a genuine weakness or failure to someone who respects you",
      "Refrain from posting anything designed to impress others"
    ],
    reflectionPrompt: "Whose opinion do you fear most? What would you do differently if you truly didn't care what people thought?",
    tombAffirmation: "I have no reputation to protect. Christ's opinion is the only one that matters."
  },
  {
    day: 17,
    week: 3,
    title: "Releasing Possessions",
    theme: "Dying to Material Security",
    scripture: "Matthew 6:19-21",
    scriptureText: "Lay not up for yourselves treasures upon earth, where moth and rust doth corrupt... For where your treasure is, there will your heart be also.",
    tombMeditation: `A dead man owns nothing. When they buried Christ, He had no possessions. Not even the clothes on His back — the soldiers had divided those. He came into the world with nothing and left with nothing. And between those two moments, He changed eternity.

What do you own that owns you?

Sit in the tomb and let God search your relationship with possessions. Not whether you have things — but whether things have you. There is a difference between stewardship and attachment. A steward manages what belongs to another. An owner clings to what they believe is theirs.

Ask: "What possession would I refuse to give away if God asked?" That answer reveals your idol.

Money is the most common replacement for God because it promises what only God can provide: security, freedom, options, power. When your bank account is full, you feel safe. When it drops, you panic. That means your security is in Mammon, not in the Lord.

Christ said you cannot serve both God and Mammon. Not "should not" — CANNOT. They are rival gods. Every dollar you cling to is a statement of trust: "I trust this more than I trust You."

Meditate on what it would feel like to lose everything — your home, your savings, your possessions. Not as a punishment, but as a test: would your faith survive? If the answer is "I don't know" — that is where the work is.

In the tomb, you own nothing. Practice that reality today.`,
    confessionFocus: "Confess material attachment: 'Lord, I confess that I have found security in my possessions and my bank account rather than in You. I have stored up treasures on earth while neglecting treasures in heaven. I have served Mammon while calling it responsibility. I repent.'",
    meditationPrompts: [
      "What possession would I struggle most to give away?",
      "Does my peace increase or decrease based on my financial situation?",
      "Am I a steward (holding for God) or an owner (clinging for myself)?",
      "If I lost everything material tonight, would I still say 'God is good'?"
    ],
    listeningFocus: "Now be still and listen. The Holy Spirit wants to speak to you about treasure — where your real treasure is and what He wants to fill you with instead of material security. Sit as a student before the Divine Teacher. Listen for what He says about your relationship with money and possessions — not what you think, but what He reveals. He may bring a Scripture about provision, an impression of radical generosity, or a specific instruction about something He wants you to release. Write it down.",
    restOfDay: "Give away something valuable today — not something you don't need, but something that costs you. Feel the resistance. That resistance is the grip. Give until it hurts, then pray through the pain.",
    practicalActions: [
      "Give away something genuinely valuable to someone in need",
      "Identify the possession you would struggle most to release",
      "Pray: 'Everything I own is Yours. I am a steward, not an owner.'"
    ],
    reflectionPrompt: "What possession would you refuse to give away if God asked? That is your idol. What did giving sacrificially reveal?",
    tombAffirmation: "I own nothing. Everything belongs to God. I am a steward of His resources."
  },
  {
    day: 18,
    week: 3,
    title: "The Grave of Unforgiveness",
    theme: "Burying Every Grudge",
    scripture: "Ephesians 4:31-32",
    scriptureText: "Let all bitterness, and wrath, and anger, and clamour, and evil speaking, be put away from you, with all malice: And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
    tombMeditation: `Unforgiveness is the chain that keeps dead men in the grave of the old man. You cannot rise with Christ while clutching grudges. Bitterness is a corpse you carry — and it poisons everything it touches.

In the tomb today, God wants to show you who you have not forgiven. Not just the people who hurt you recently — the old wounds. The ones you buried alive. The ones you thought you dealt with but didn't.

Begin by asking: "Holy Spirit, who have I not truly forgiven?" Then wait. Names will surface. Faces will appear. Memories will stir. Let them come.

For each person, meditate on what they did. Don't minimize it. Don't spiritualize it. They wronged you. It was real. It was painful. You have every human right to hold that debt.

But you are in the tomb. Dead men have no rights. And Christ, who was wronged far worse than you will ever be, said from the cross: "Father, forgive them."

Forgiveness is not pretending it didn't happen. It is not saying it was okay. It is not trusting the person again. Forgiveness is releasing the debt. It is saying: "You owe me, but I cancel what you owe. Not because you deserve it, but because Christ canceled what I owed, and I have no right to hold debts while mine are forgiven."

For each name, pray: "I forgive ___ for ___. I release the debt. I cancel what they owe me. I bless them in Jesus' name."

This may be the hardest meditation of the 30 days. Do not rush it. Some names will take many minutes. Some will bring tears, anger, even physical pain. Stay in it. Do not leave the tomb until every grudge is buried.`,
    confessionFocus: "Confess unforgiveness: 'Lord, I confess that I have held debts against people while claiming to serve a God who forgave all my debts. I have nursed bitterness, replayed offenses, and wished harm on those who wronged me. Forgive me for refusing to forgive.'",
    meditationPrompts: [
      "Who do I think about with resentment, even briefly, on a regular basis?",
      "What offense have I claimed to forgive but still replay in my mind?",
      "Is there someone I want to see punished rather than restored?",
      "How does holding this grudge affect my own relationship with God?"
    ],
    listeningFocus: "After you have spoken the names and released the debts, be still. The Holy Spirit may have more names to surface — ones buried so deep you forgot them. Sit as a student before the Divine Teacher. Listen for His assessment of your digital life, your inner life, the places where bitterness has been hiding behind justified anger. He may bring a face to mind, a Scripture about freedom, or an impression of the weight He is lifting. Write down everything He reveals.",
    restOfDay: "Write every name and offense on paper. Tear it up or burn it as a physical act of release. For the rest of the day, when a grudge resurfaces, declare: 'That debt is canceled. I released it in the tomb.'",
    practicalActions: [
      "Write your complete forgiveness list — leave no one out",
      "Pray the forgiveness prayer over each name and offense specifically",
      "Tear up or burn the list as a physical act of release"
    ],
    reflectionPrompt: "Which name was hardest to forgive? What happens in your heart when you truly release someone who doesn't deserve it?",
    tombAffirmation: "Every grudge is buried. Every debt is canceled. I forgive as I have been forgiven."
  },
  {
    day: 19,
    week: 3,
    title: "Dying to Approval",
    theme: "Freedom from People-Pleasing",
    scripture: "Galatians 1:10",
    scriptureText: "For do I now persuade men, or God? or do I seek to please men? for if I yet pleased men, I should not be the servant of Christ.",
    tombMeditation: `Paul draws a line: you can please men, or you can be a servant of Christ. You cannot do both. People-pleasing and Christ-serving are mutually exclusive operating systems.

In the tomb, there is no audience to please. No one to perform for. No one whose disappointment you need to manage. Just God.

Meditate on how much of your life is shaped by the question "What will they think?" How many decisions — what you wear, what you say, what you post, how you serve, where you go — are filtered through the approval of others?

People-pleasing is subtle idolatry. It puts human approval on God's throne. It makes you a slave to the opinions of people who are themselves broken, fickle, and inconsistent. Their approval is earned today and withdrawn tomorrow. You are building your emotional house on sand.

Think of the relationships where you perform most. The friend you never disagree with. The parent whose approval you still chase. The mentor whose disapproval devastates you. The social group where you curate your personality to fit in.

In each of those relationships, you have become a lie — a version of yourself designed for applause, not for truth. And the real you is locked away, never seen, because the real you might not be approved of.

In the tomb, the real you is all that's left. The performance is over. The audience is gone. And God says: "This is who I want. The real one. Not the act."

Die to the need for human applause. Live for an audience of One.`,
    confessionFocus: "Confess people-pleasing: 'Lord, I confess that I have been addicted to human approval. I have shaped my personality, my words, and my decisions around what others would think of me. I have feared their rejection more than Yours. I repent of making people my god.'",
    meditationPrompts: [
      "In which relationships am I performing a version of myself rather than being real?",
      "Whose disapproval do I fear most, and why do they have that power?",
      "What decisions have I made solely because of what people would think?",
      "What would change if God's 'well done' was the only approval I sought?"
    ],
    listeningFocus: "Now be still. You have been performing for people — now sit before the only audience that matters. The Holy Spirit, your Divine Teacher, wants to give you a Kingdom identity that replaces the one the crowd has built for you. Listen for who He says you are when no one is watching. He may bring a Scripture of identity, an impression of freedom from approval, or a specific word about a relationship where you have been performing. Write it down — His identity for you is the only real one.",
    restOfDay: "Say 'no' to at least one request you would normally say 'yes' to out of people-pleasing. Let someone be disappointed in you today. Practice being honest instead of agreeable.",
    practicalActions: [
      "Identify your top 3 people-pleasing relationships",
      "Say 'no' to at least one people-pleasing 'yes'",
      "Practice being honest instead of agreeable in every conversation"
    ],
    reflectionPrompt: "Who do you most need approval from? What would change if God's 'well done' was the only approval you sought?",
    tombAffirmation: "I serve an audience of One. Human approval is no longer my currency."
  },
  {
    day: 20,
    week: 3,
    title: "Burying Fear",
    theme: "Dying to Fear of Man and Circumstances",
    scripture: "2 Timothy 1:7",
    scriptureText: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    tombMeditation: `Fear is the flesh's final argument. When everything else fails — when you've surrendered your rights, your idols, your comfort, your reputation — fear steps in and says: "But what if?"

What if I fail? What if I'm rejected? What if I lose everything? What if I'm alone? What if God doesn't come through? What if I die?

In the tomb, face every "what if." You are already dead. What can fear threaten a dead man with?

Sit before God and let your deepest fears surface. Not the small ones — the ones that wake you at 3am. The ones that control your decisions. The ones you've never spoken aloud.

Fear of failure. Fear of rejection. Fear of poverty. Fear of abandonment. Fear of death. Fear of irrelevance. Fear of being exposed. Fear of losing someone you love.

For each fear, ask God to show you the lie underneath it. Fear of failure says: "Your worth depends on your success." That is a lie. Fear of rejection says: "You need their acceptance to be okay." That is a lie. Fear of poverty says: "God cannot provide." That is a lie. Fear of death says: "This life is all there is." That is a lie.

For each lie, find the truth. God's Word is a weapon against every fear. "I will never leave you nor forsake you." "My God shall supply all your need." "O death, where is thy sting?" "If God be for us, who can be against us?"

In the tomb, fear has no power. You are dead. And the dead have nothing left to lose.`,
    confessionFocus: "Confess fear: 'Lord, I confess that fear has been my functional lord. I have obeyed fear more than I have obeyed You. I have let fear dictate my decisions, my relationships, and my obedience. I confess that at the root, my fear is unbelief — I have not trusted Your character.'",
    meditationPrompts: [
      "What fear has most controlled my decisions in the past year?",
      "What lie is underneath my biggest fear?",
      "What has fear prevented me from doing that God has asked?",
      "If I truly feared only God, how different would my life look?"
    ],
    listeningFocus: "Now be still in the place where your fears live. The Holy Spirit wants to speak directly to each fear — not with your logic, but with His Word. Sit as a student before the Divine Teacher. Listen for the Scripture He brings to mind for your specific fear, the impression of safety He places over your anxiety, the word of love that casts out the fear. Do not rush past this. Write down every Scripture and impression He gives — these are your weapons.",
    restOfDay: "Write your top 5 fears and find a Scripture that directly counters each one. Do one thing today that your fear has been preventing. Memorize one fear-destroying verse.",
    practicalActions: [
      "List your top 5 fears and find a counter-Scripture for each",
      "Do one thing today that your fear has been preventing",
      "Memorize one fear-destroying verse and repeat it whenever anxiety rises"
    ],
    reflectionPrompt: "Which fear has most controlled your decisions? How different would your life be if you feared God alone?",
    tombAffirmation: "Fear is buried. I walk in power, love, and a sound mind."
  },
  {
    day: 21,
    week: 3,
    title: "The Third Death",
    theme: "Week 3 Culmination — Dying to the World System",
    scripture: "Colossians 3:2-3",
    scriptureText: "Set your affection on things above, not on things on the earth. For ye are dead, and your life is hid with Christ in God.",
    tombMeditation: `Three weeks in the tomb. You have died to self. You have died to self-will. And this week, you have confronted the world's system — its values, its definitions, its grip on your possessions, your reputation, your relationships, your approval, and your fears.

Today, meditate on the totality of what it means to be "dead to the world." Paul says your life is "hid with Christ in God." That means you are invisible to the world's system. It cannot find you. It cannot reach you. It cannot tempt you. You are hidden in the most secure place in the universe — in Christ, in God.

Picture yourself buried deep in the heart of God. The world rages above — its noise, its demands, its false promises, its threats. But you cannot hear them. You are too deep. You are too hidden. You are too dead.

The world's opinion of you? Irrelevant — you are hidden. The world's measure of your success? Meaningless — you are hidden. The world's threats? Powerless — you are hidden. The world's pleasures? Unsatisfying — you have tasted something better.

Today you write your Divorce Decree from the World. Not anger at the world — you're simply done with it. Like a marriage that is over, you make a clean, final break from the world's value system, its definition of success, its standards of beauty, its measures of worth.

You are no longer a citizen of the world's kingdom. You are hidden with Christ in God. And nothing in the world can touch you there.`,
    confessionFocus: "Confess worldly entanglement: 'Lord, I confess that I have been more entangled with the world than I admitted. Its values have shaped my thinking, its pleasures have captured my heart, its approval has influenced my decisions. I declare divorce from the world's system today.'",
    meditationPrompts: [
      "What has three weeks of dying revealed about how entangled with the world I was?",
      "What does it mean for my life to be 'hid with Christ in God' — practically?",
      "What worldly attachment is still clinging even after three weeks?",
      "Can I genuinely say the world is dead to me?"
    ],
    listeningFocus: "Before you write your divorce decree, be still and listen for the Holy Spirit's freedom declaration over you. Sit as a student before the Divine Teacher. Three weeks of dying have brought you here — and He has a word of release to speak. Listen for the Scripture He seals this moment with, the impression of freedom He places in your spirit, the declaration He makes over your separation from the world's system. Write it down. His freedom is permanent.",
    restOfDay: "Write and sign your 'Divorce Decree from the World.' Review your death certificate and last will from previous weeks. Spend 30 minutes in worship — not asking for anything, just glorifying God.",
    practicalActions: [
      "Write and sign your 'Divorce Decree from the World'",
      "Review your death certificate and last will from previous weeks",
      "Spend 30 minutes in worship — not asking, just glorifying"
    ],
    reflectionPrompt: "What has three weeks of dying revealed about how entangled with the world you were? What feels different now?",
    tombAffirmation: "I am divorced from the world. My life is hidden with Christ in God."
  },

  // ============================================================
  // WEEK 4: The Stone is Rolled Away — Resurrection Life Emerges
  // ============================================================
  {
    day: 22,
    week: 4,
    title: "Resurrection Morning",
    theme: "New Life Begins to Stir",
    scripture: "Romans 6:4",
    scriptureText: "Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life.",
    tombMeditation: `Something has shifted in the tomb. Three weeks of death — and now, a stirring. Not the old man reviving. Something entirely new.

Meditate on what happened to Christ in the tomb. For three days, His body lay dead. But the tomb was not a place of defeat — it was a place of transformation. The seed fell into the ground and died. And from that death, the most powerful life the universe has ever known burst forth.

The same thing is happening in you.

You are not the same person who entered this tomb 22 days ago. The old man has been confronted, confessed, and buried. What is left is a space — an emptied vessel. And into that space, Christ's resurrection life is beginning to flow.

Today, stop thinking about what you're dying to. Start meditating on what Christ is birthing in you. What does "newness of life" look like for you specifically? Not generically — specifically.

Where the old man was angry, what does Christ's patience look like in your actual relationships? Where the old man was fearful, what does Christ's courage look like in your actual decisions? Where the old man was selfish, what does Christ's generosity look like with your actual resources?

Ask the Holy Spirit: "What are You building in the space where the old man used to live?" Then listen. He has been waiting for this space. He has been waiting for you to die so He could live.

This is the mystery of the gospel: death produces life. The tomb is not an ending — it is a womb.`,
    confessionFocus: "Confess any resistance to new life: 'Lord, I confess that part of me is afraid of who You want me to become. The old man was familiar — even his sin was comfortable. Give me courage to embrace the new creation You are making me.'",
    meditationPrompts: [
      "What is Christ building in the spaces where the old man has died?",
      "What does 'newness of life' look like specifically in my relationships, work, and habits?",
      "Am I afraid of the new person God is creating? Why?",
      "What is one thing the 'new me' would do that the old me never could?"
    ],
    listeningFocus: "Now be still and listen for the new life the Holy Spirit is breathing into you. Something has shifted in the tomb — and He wants to name it. Sit as a student before the Divine Teacher. Listen for what He is building in the spaces where the old man died. He may bring a Scripture of new creation, an impression of who you are becoming, or a specific word about the first fruit of resurrection in your life. Write it down. This is the beginning of something new.",
    restOfDay: "Do one thing today that only the 'new you' would do — something the old man would never have attempted. Act from resurrection, not obligation.",
    practicalActions: [
      "Journal what 'newness of life' looks like specifically for you",
      "Do one thing today that only the 'new you' would do",
      "Thank God for every evidence of new life emerging"
    ],
    reflectionPrompt: "What is Christ birthing in you that the old man would never have allowed? What does 'new' feel like?",
    tombAffirmation: "I am raised with Christ. Newness of life is flowing through me."
  },
  {
    day: 23,
    week: 4,
    title: "Walking in the Spirit",
    theme: "Living by the Spirit, Not the Flesh",
    scripture: "Galatians 5:16",
    scriptureText: "This I say then, Walk in the Spirit, and ye shall not fulfil the lust of the flesh.",
    tombMeditation: `The old man walked by flesh — instinct, desire, emotion, self-interest. Every decision filtered through "What do I want? What feels good? What benefits me?"

Resurrection life is different. It is Spirit-led. Every decision, every word, every response filtered through "What does the Spirit say? What does God want? What serves His Kingdom?"

Today, meditate on the difference between these two operating systems. The flesh is reactive — the Spirit is responsive. The flesh is impulsive — the Spirit is intentional. The flesh is loud — the Spirit is still, small, and easy to miss if you're not listening.

In the tomb, you learned to be still. You learned to listen. You learned to die. Now take that tomb-sensitivity into every moment of this day.

Before every decision — no matter how small — pause. Create a 3-second gap between stimulus and response. In that gap, ask: "Holy Spirit, what do You want me to do?" Then wait for the impression. It may come as a thought, a Scripture, a knowing, a pull toward an action you wouldn't naturally choose.

Obey immediately. Do not rationalize. Do not evaluate. Do not wait for confirmation. The Spirit speaks, and the dead obey. That is the rhythm of resurrection life.

Meditate on how different your day would be if every single action was Spirit-directed. Not just the big decisions — the tone of your voice, the text you send, the way you respond to interruption, what you eat, where you look, how you spend the next hour.

This is what Paul means by "walk" — step by step, moment by moment, in the Spirit.`,
    confessionFocus: "Confess flesh-led living: 'Lord, I confess that most of my day runs on autopilot — my habits, my instincts, my desires. I have not cultivated sensitivity to Your Spirit. I have lived by flesh while calling it normal. Teach me to hear You in every moment.'",
    meditationPrompts: [
      "How much of my daily life is Spirit-led versus flesh-driven?",
      "When was the last time I clearly heard the Spirit's prompting and obeyed immediately?",
      "What would change if I paused before every action and asked the Spirit first?",
      "Can I live in moment-by-moment sensitivity, or do I always revert to autopilot?"
    ],
    listeningFocus: "Now practice what this entire day is about: listening for the Holy Spirit's guidance moment by moment. Be still. Ask Him one question: 'What is on Your agenda for me right now?' Then wait. Do not fill the silence. He is the Divine Teacher and you are the student learning to hear His voice in real time. He may impress a name, a task, a Scripture, or a direction. Write it down and obey it. This is the rhythm of Spirit-led living.",
    restOfDay: "Before every decision today — no matter how small — pause and ask: 'Holy Spirit, what do You want me to do?' Obey immediately. Journal every Spirit-prompt and whether you obeyed or resisted.",
    practicalActions: [
      "Ask the Holy Spirit for direction before EVERY decision today",
      "Obey every Spirit-impression immediately, without rationalizing",
      "Journal each Spirit-prompt and whether you obeyed or resisted"
    ],
    reflectionPrompt: "How many Spirit-prompts did you receive today? How many did you obey? What happens when you live moment-by-moment in the Spirit?",
    tombAffirmation: "I walk in the Spirit. The flesh no longer drives my decisions."
  },
  {
    day: 24,
    week: 4,
    title: "Resurrection Power in Weakness",
    theme: "Strength Made Perfect in Weakness",
    scripture: "2 Corinthians 12:9-10",
    scriptureText: "My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.",
    tombMeditation: `The resurrection paradox: power flows through weakness, not strength. The tomb taught you weakness — you were dead, helpless, completely dependent. And from that position of absolute weakness, God raised Christ with the greatest display of power in history.

Paul learned this secret. He had a thorn in his flesh — a weakness he begged God to remove. Three times he asked. Three times God said no. Not "I'll fix it later." Not "Try harder." But: "My grace is sufficient. My strength is made perfect in your weakness."

Meditate on your weaknesses. Not your sins — your genuine limitations, struggles, and inadequacies. The areas where you consistently fall short. The things you wish you could change but can't. The gaps between who you are and who you wish you were.

The old man hid those weaknesses. He covered them, compensated for them, pretended they didn't exist. He projected strength because weakness felt like failure.

But the new man — the resurrection man — does the opposite. He boasts in weakness. Because weakness is where Christ's power lands. Where you are weak, He is strong. Where you are insufficient, His grace is sufficient. Where you are broken, His glory shines through the cracks.

Stop fighting your weakness. Stop being ashamed of it. Instead, offer it to God: "Here is where I am weak. Here is where I cannot do it myself. This is the place where Your power rests on me."

The strongest warrior in the Kingdom is not the one with no weaknesses. It is the one who has surrendered every weakness to God and watches Him fight through the gaps.`,
    confessionFocus: "Confess the pride of self-sufficiency: 'Lord, I confess that I have hidden my weaknesses because I was ashamed. I have pretended to be stronger than I am. I have relied on my own ability instead of Your power. I welcome weakness now as the landing pad for Your strength.'",
    meditationPrompts: [
      "What weakness have I been most ashamed of?",
      "Where have I been pretending to be strong when I am actually struggling?",
      "What would change if I stopped hiding my weakness and started offering it to God?",
      "Can I genuinely 'glory' in my weakness — thank God for it — or do I still resent it?"
    ],
    listeningFocus: "Now be still and listen. The Holy Spirit wants to tell you who He says you are — not the weak version you are ashamed of, but the vessel through which His power flows. Sit as a student before the Divine Teacher. Listen for where He wants to manifest His strength through your specific weakness. He may bring a Scripture of sufficiency, an impression of power resting on your limitation, or a word about how He plans to use what you tried to hide. Write it down.",
    restOfDay: "Share a genuine weakness with a trusted person today. Not for sympathy — as testimony that God's power works through brokenness. When you feel inadequate, pray: 'Your strength is made perfect here.'",
    practicalActions: [
      "Share a genuine weakness with a trusted person",
      "When you feel inadequate today, pray: 'Your strength is made perfect here'",
      "Thank God for 3 specific weaknesses and how He uses them"
    ],
    reflectionPrompt: "How does embracing weakness feel different from hiding it? Where did you experience God's power through your weakness today?",
    tombAffirmation: "I glory in my weakness, for Christ's power rests upon me there."
  },
  {
    day: 25,
    week: 4,
    title: "The Ministry of Death",
    theme: "Your Death Produces Life in Others",
    scripture: "2 Corinthians 4:11-12",
    scriptureText: "For we which live are always delivered unto death for Jesus' sake, that the life also of Jesus might be made manifest in our mortal flesh. So then death worketh in us, but life in you.",
    tombMeditation: `"Death worketh in us, but life in you." This is the ministry equation: your dying produces others' living. Your burial produces others' harvest. Your surrender produces others' freedom.

Meditate on how your death to self changes the atmosphere around you. When you die to anger, people near you experience peace. When you die to selfishness, people near you experience generosity. When you die to pride, people near you experience humility. When you die to fear, people near you experience courage.

Your death is not just personal transformation. It is a ministry. Every area where the old man dies is an area where Christ's life can flow through you to others.

Think of someone in your life who is struggling with something you've surrendered in the tomb. They are fighting the same battles you faced in weeks 1, 2, and 3 — but they haven't entered the tomb yet. They are still controlled by rights, idols, comfort, reputation, fear, unforgiveness.

You now carry something they need — not your advice, not your theology, but your testimony. "I was controlled by this too. I entered the tomb. I died to it. And Christ's life replaced it."

The ministry of death is the most powerful ministry in the Kingdom. It does not require a platform, a degree, or a title. It requires only this: a person who has genuinely died and genuinely risen.

You are becoming that person.`,
    confessionFocus: "Confess self-focused faith: 'Lord, I confess that I have often treated my spiritual growth as a private project rather than a ministry to others. I have kept my tomb experience to myself when others needed to hear it. Give me the courage to share what You've done in me.'",
    meditationPrompts: [
      "Who in my life needs to hear what the tomb has taught me?",
      "How does my death to self change the atmosphere around me?",
      "What area of my surrender could minister to someone struggling right now?",
      "Am I willing to be vulnerable about my tomb experience for someone else's freedom?"
    ],
    listeningFocus: "Now be still and listen. The Holy Spirit wants to show you how He wants you to walk differently — and who He wants you to carry this death-life message to. Sit as a student before the Divine Teacher. Listen for a specific name, a face, a situation where your death can produce life in someone else. He may bring a Scripture of ministry, an impression of someone who needs your testimony, or a word about the power flowing through your surrender. Write down who He names.",
    restOfDay: "Share something the Death Chamber has taught you with someone who needs it. Encourage a fellow believer struggling with a specific area you've surrendered. Pray for someone by name.",
    practicalActions: [
      "Share a Death Chamber lesson with a fellow believer",
      "Encourage someone struggling with an area you've surrendered",
      "Pray for someone by name, asking God to do in them what He's doing in you"
    ],
    reflectionPrompt: "How did sharing your tomb experience minister to someone else? What happens when your death becomes someone else's life?",
    tombAffirmation: "Death works in me so that life may flow to others."
  },
  {
    day: 26,
    week: 4,
    title: "Fighting from the Grave",
    theme: "Spiritual Warfare as a Dead Man",
    scripture: "Colossians 3:1-4",
    scriptureText: "If ye then be risen with Christ, seek those things which are above, where Christ sitteth on the right hand of God.",
    tombMeditation: `Here is the secret of spiritual warfare that most believers never discover: the greatest weapon in the Kingdom is a dead man.

A dead man cannot be threatened. A dead man has nothing to lose. A dead man cannot be bribed, intimidated, seduced, or manipulated. Every weapon the enemy uses depends on you having something he can threaten, take, or dangle in front of you.

But you've spent 26 days dying. Your rights? Surrendered. Your reputation? Buried. Your comfort? Released. Your relationships? On the altar. Your possessions? God's. Your approval? From an audience of One. Your fears? In the grave.

What is left for the enemy to attack?

Meditate on this: you are seated with Christ in heavenly places (Ephesians 2:6). Your position is not on the battlefield — it is on the throne. You fight from victory, not toward it. You fight from death, not avoiding it. You fight from a position where the enemy's weapons are useless because his targets have already been destroyed.

Picture the enemy approaching you with his usual arsenal. Temptation — but you've surrendered your desires. Accusation — but your sins are confessed and forgiven. Fear — but you've buried your fears. Shame — but you have no reputation to protect. Doubt — but you've released control.

He has nothing. He fires at a dead man and every shot passes through. You are not dodging his attacks — you are immune to them. Because the dead cannot be killed twice.

This is how you fight from now on. Not from fear. Not from desperation. From death.`,
    confessionFocus: "Confess fear-based warfare: 'Lord, I confess that I have fought spiritual battles from a position of fear rather than death. I have been defensive rather than settled. I have been intimidated by an enemy who has no power over a dead man. I take my seat today.'",
    meditationPrompts: [
      "What weapon does the enemy still use effectively against me?",
      "What is he still able to threaten me with — and what does that reveal about what I haven't fully surrendered?",
      "How does fighting from a position of death change the entire battle?",
      "Can I genuinely say 'there is nothing you can threaten me with'?"
    ],
    listeningFocus: "Now be still and listen. The Holy Spirit, the Divine Teacher, wants to show you which piece of armor you need most for the battles ahead. Sit as a student. Listen for the specific area of warfare He highlights — is it the belt of truth, the breastplate of righteousness, the shield of faith, the helmet of salvation, or the sword of the Spirit? He may bring an Ephesians 6 Scripture directly to mind or impress upon you the exact vulnerability the enemy has been exploiting. Write it down.",
    restOfDay: "Identify the area where the enemy attacks you most. Confront it from your position of death: 'I am dead. You cannot threaten a dead man. Christ in me is your opponent, not my flesh.' Pray warfare prayers from this position.",
    practicalActions: [
      "Identify your primary spiritual battleground",
      "Pray warfare prayers from your position of death in Christ",
      "Declare aloud: 'I am dead. You have no power over a dead man.'"
    ],
    reflectionPrompt: "How does fighting from death change the battle? What can the enemy threaten you with when you've already died?",
    tombAffirmation: "I fight from the grave. The enemy cannot threaten what is already dead."
  },
  {
    day: 27,
    week: 4,
    title: "Bearing Fruit",
    theme: "Resurrection Life Produces Kingdom Fruit",
    scripture: "John 12:24",
    scriptureText: "Verily, verily, I say unto you, Except a corn of wheat fall into the ground and die, it abideth alone: but if it die, it bringeth forth much fruit.",
    tombMeditation: `"Unless a grain of wheat falls into the ground and dies, it remains alone. But if it dies, it produces much fruit."

You have been that grain of wheat. You fell into the ground 27 days ago. You died. And now — fruit.

Today, do not work. Do not strive. Simply observe. Meditate on what has changed. What fruit is growing in the soil of your death?

Where was there anger — is there now patience? Where was there fear — is there now courage? Where was there selfishness — is there now generosity? Where was there pride — is there now humility? Where was there addiction to approval — is there now freedom?

The fruit is not your accomplishment. You did not grow it. God grew it — in the soil of your surrender. The only thing you did was die. He did everything else.

This is the paradox of the Kingdom: you produce the most by surrendering the most. The farmer who holds his grain in his hand keeps it safe — but it remains one grain forever. The farmer who buries it loses it — but gains a hundred fold.

What have you lost in 27 days? Your self-will. Your rights. Your idols. Your comfort. Your reputation. Your fear. Your grudges. What have you gained? Christ. And in Christ — everything.

Sit in gratitude today. Not striving. Not performing. Just grateful. Thank God for every piece of fruit you can see — and for the fruit underground that hasn't broken the surface yet.`,
    confessionFocus: "Confess striving: 'Lord, I confess that even my fruitfulness has sometimes been about my effort rather than Your life. I have tried to manufacture fruit rather than letting it grow naturally from death. I rest in You today. The fruit is Yours.'",
    meditationPrompts: [
      "What fruit has emerged from my death that was not possible before?",
      "Where have others noticed change in me?",
      "What area still needs more dying before fruit can grow?",
      "Can I rest in God's fruitfulness rather than manufacturing my own?"
    ],
    listeningFocus: "Now be still and listen. The Holy Spirit wants to show you who He wants you to pray for — not out of obligation, but out of the overflow of resurrection life. Sit as a student before the Divine Teacher. Listen for names, faces, or situations He lays on your heart. He may bring a Scripture of intercession, an impression of someone carrying a burden, or a specific prayer request He wants you to take up. Write down every name and every impression. Intercession from the tomb carries power.",
    restOfDay: "Journal all the changes — internal and external — from the past 27 days. Ask a trusted person if they've noticed changes. Thank God specifically for each piece of fruit.",
    practicalActions: [
      "Journal all changes — internal and external — from 27 days in the tomb",
      "Ask a trusted person if they've noticed changes in you",
      "Thank God specifically for each piece of fruit that has emerged"
    ],
    reflectionPrompt: "What fruit is emerging from your death? How have others noticed the change? What area still needs more dying?",
    tombAffirmation: "The seed has died. Fruit is emerging. His life is becoming visible through me."
  },
  {
    day: 28,
    week: 4,
    title: "Unwrapping the Grave Clothes",
    theme: "Letting Go of Old Patterns",
    scripture: "John 11:44",
    scriptureText: "And he that was dead came forth, bound hand and foot with graveclothes... Jesus saith unto them, Loose him, and let him go.",
    tombMeditation: `Lazarus came out of the tomb alive — but still wrapped in burial cloths. He was resurrected, but not yet free. The grave clothes still clung. And Jesus looked at the community around him and said: "Loose him, and let him go."

You are Lazarus. Resurrection has happened. New life is stirring. But old patterns still cling — habits, thought patterns, speech patterns, reactions that belong to the old man but haven't fallen away yet.

Meditate on what still clings. Not the big things — you've addressed those. The subtle things. The way you still default to sarcasm when you're uncomfortable. The way you still check your phone compulsively. The way you still gossip casually. The way you still react before you respond. The way you still avoid vulnerability. The way you still perform for approval in small, unconscious ways.

These are grave clothes. They are not sin in the same way as what you buried in weeks 1-3. They are remnants — old patterns from the dead life that haven't been unwrapped yet.

And here is the key: Jesus told the COMMUNITY to unwrap Lazarus. He did not say "unwrap yourself." Some grave clothes cannot be removed alone. They require others — friends, mentors, accountability partners — to help you see what you cannot see, to pull away what clings to your blind spots.

This is why the Tomb Space exists. This is why group formation matters. You need people who will love you enough to say: "I still see a grave cloth there. Let me help you remove it."

Are you willing to be that vulnerable? Are you willing to let others see what still clings?`,
    confessionFocus: "Confess remaining patterns: 'Lord, I confess the old habits and reactions that still cling even after dying. I confess that I cannot remove them all alone. Give me the humility to let others help unwrap me.'",
    meditationPrompts: [
      "What old patterns still cling to me despite 28 days of transformation?",
      "What habits or reactions do I still default to that belong to the old man?",
      "Who in my life do I trust enough to help me see my blind spots?",
      "Am I willing to be vulnerable enough to let others unwrap me?"
    ],
    listeningFocus: "Now be still and listen. The Holy Spirit wants to give you His assessment of your 30-day journey — what has truly died, what still clings, and what He is pleased with. Sit as a student before the Divine Teacher. This is not your self-evaluation; it is His. Listen for the honest, loving truth He speaks — a Scripture of encouragement, an impression of what remains to be unwrapped, a word of affirmation for the death you have endured. Write down His full assessment.",
    restOfDay: "Ask a trusted friend or accountability partner to identify grave clothes they still see in you. Create an accountability plan for the patterns that remain. Be willing to hear hard truth.",
    practicalActions: [
      "List the old patterns that still cling despite transformation",
      "Ask a trusted friend to help identify your blind spots",
      "Create an accountability plan for the grave clothes that remain"
    ],
    reflectionPrompt: "What grave clothes still cling to you? Who can help unwrap them? Are you willing to let them?",
    tombAffirmation: "I am alive, but grave clothes remain. I invite others to help unwrap me."
  },
  {
    day: 29,
    week: 4,
    title: "Daily Death",
    theme: "Making Death a Lifestyle",
    scripture: "1 Corinthians 15:31",
    scriptureText: "I protest by your rejoicing which I have in Christ Jesus our Lord, I die daily.",
    tombMeditation: `Paul did not say "I died once." He said "I die DAILY." Every single day — a fresh death, a fresh burial, a fresh resurrection.

This is the most important meditation of the entire program. Because the Death Chamber is not a one-time event. It is a daily reality.

Tomorrow morning, the flesh will try to resurrect itself. It will whisper: "You don't need to do that anymore. You've already been through the tomb. Go back to normal." That whisper is the old man trying to claw his way out of the grave.

Every morning for the rest of your life, you must return to the tomb. Not for 30 days of meditation — but for 5 minutes of death. A daily protocol that re-enacts your burial and resurrection before you face the world.

Design this protocol now. Sit before God and create a morning practice that will keep the tomb a reality:

Step 1: Confess death. "I am crucified with Christ. I am dead. The old man has no authority over me today."
Step 2: Surrender the day. "Lord, this day is Yours. Not my will, but Yours. I release every outcome, every plan, every right."
Step 3: Review the truth. Read your death certificate. Or Galatians 2:20. Or Romans 6:6. Remind yourself of what is true.
Step 4: Declare resurrection. "Christ lives in me. I walk in the Spirit today. I fight from death. I bear fruit through surrender."
Step 5: Listen. 2 minutes of silence, asking: "Holy Spirit, what is on Your agenda for me today?"

This is your Daily Death Protocol. Practice it right now. And commit to it for the rest of your life.`,
    confessionFocus: "Confess the temptation to return to normal: 'Lord, I confess that part of me wants to graduate from the tomb and go back to comfortable Christianity. Protect me from treating these 30 days as an event instead of a lifestyle. I commit to dying daily.'",
    meditationPrompts: [
      "What will my daily death look like going forward — specifically?",
      "What time of day will I return to the tomb?",
      "How will I prevent the old man from slowly resurrecting over weeks and months?",
      "Am I committed to dying daily, or was this a temporary experiment?"
    ],
    listeningFocus: "Now be still and listen one more time as a student in the classroom. The Holy Spirit, your Divine Teacher, has walked with you for 29 days. He has a final inspection word — not condemnation, but commissioning. Listen for His assessment of your readiness: are you truly dead? Are you truly alive? He may bring a Scripture that defines your next season, an impression of the daily rhythm He wants with you, or a word about what daily death will look like going forward. Write it all down.",
    restOfDay: "Write your personal 'Daily Death Protocol' in detail. Practice it today. Show it to an accountability partner. Commit to it going forward.",
    practicalActions: [
      "Write your personal 'Daily Death Protocol' for ongoing daily use",
      "Practice the full protocol today",
      "Commit to 5 minutes of death-and-resurrection prayer every morning"
    ],
    reflectionPrompt: "What will your daily death look like going forward? How will you ensure the tomb remains a reality and not just a memory?",
    tombAffirmation: "I die daily. Every morning I return to the tomb before I enter the world."
  },
  {
    day: 30,
    week: 4,
    title: "The Tomb is Empty",
    theme: "Emergence — Walking in Resurrection Power",
    scripture: "Romans 8:11",
    scriptureText: "But if the Spirit of him that raised up Jesus from the dead dwell in you, he that raised up Christ from the dead shall also quicken your mortal bodies by his Spirit that dwelleth in you.",
    tombMeditation: `Day 30. The final meditation. The tomb is empty.

Not because death failed. Because death finished its work.

Sit in the tomb one last time. Look around. The burial cloths are folded neatly — just as they were when the disciples found Jesus' tomb. Folded. Not discarded in a rush. Not scattered by struggle. Folded. Because the resurrection was not an escape — it was a completion. Death did exactly what it was supposed to do. And when it was finished, life walked out calmly, victoriously, and permanently.

You are that person now. The one who walks out of the tomb. Not the same person who walked in 30 days ago. That person is dead. Buried. Gone.

The person walking out carries resurrection power — the same Spirit that raised Christ from the dead. Read that again. The SAME SPIRIT. The power that reversed the most permanent condition in the universe — death itself — lives in you. And if He can raise Christ from the dead, He can quicken your mortal body, your mortal relationships, your mortal ministry, your mortal purpose.

You are not going back to the life you had before the tomb. That life is dead. You are stepping into a life hidden with Christ in God — empowered by the resurrection, defined by the cross, fueled by the Spirit, and destined for the Kingdom.

Meditate on who you are now:
- You are dead to sin but alive to God (Romans 6:11)
- You are hidden with Christ in God (Colossians 3:3)
- You walk in newness of life (Romans 6:4)
- The power that raised Christ dwells in you (Romans 8:11)
- You are more than a conqueror (Romans 8:37)
- Nothing can separate you from His love (Romans 8:38-39)

The tomb is empty. Christ lives in you. Go fight as one who has already died. There is nothing the enemy can threaten you with. You have been to the grave and back.`,
    confessionFocus: "Confess and declare: 'Lord, the old man is dead. I confess that he was real, he was strong, and he ran my life. But he is buried now. And I declare: Christ lives in me. I walk in resurrection power. I fight from death. I am free. The tomb is empty.'",
    meditationPrompts: [
      "Who am I now compared to Day 1?",
      "What has died that will never be resurrected?",
      "What has risen that did not exist before?",
      "How will I carry the tomb with me — not as a memory, but as a daily reality?"
    ],
    listeningFocus: "For the final time in this program, be still and listen. The Holy Spirit has a commissioning word over your life — a word for the person walking out of the tomb. Sit as a student before the Divine Teacher one last time. Listen for His sending word: the Scripture He seals your journey with, the impression of purpose He places on your new life, the specific calling or direction He speaks over you as you emerge. Write it down carefully. This is His word over your resurrection. Carry it with you always.",
    restOfDay: "Read and sign the Completion Covenant. Share your journey with your Tomb Space group or a trusted friend. Declare Romans 8:11 over your life. Then step out of the tomb — and fight.",
    practicalActions: [
      "Read and sign the Completion Covenant",
      "Share your journey with your Tomb Space group or accountability partner",
      "Declare Romans 8:11 over your life as you step out of the tomb"
    ],
    reflectionPrompt: "Who are you now compared to Day 1? What has died? What has risen? How will you carry the tomb with you?",
    tombAffirmation: "The tomb is empty. Christ lives in me. I fight from death, not toward it."
  }
];
