// Q4 2025 - Christ's Object Lessons (Seventh Day Press)
// Content extracted from the official quarterly PDF

export interface LessonDayContent {
  id: string;
  title: string;
  content: string;
  keyTexts: string[];
}

export interface LessonContentData {
  lessonTitle: string;
  lessonScripture: string;
  aid: string;
  description: string;
  pdfStartPage?: number;
  pdfEndPage?: number;
  days: LessonDayContent[];
}

export const q4_2025_lessons: Record<string, LessonContentData> = {
  "01": {
    lessonTitle: "The Barren Fig-Tree",
    lessonScripture: "Luke 13:6-9",
    aid: "Christ's Object Lessons p. 212-218",
    description: "A fruit tree existed simply for the purpose of bearing fruit, and when it failed repeatedly, it was not to be permitted to draw life out of the earth merely to keep itself alive. This parable is present truth.",
    pdfStartPage: 6,
    pdfEndPage: 7,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 1 — THE BARREN FIG-TREE
Lesson Scripture: Luke 13:6-9
AID: Christ's Object Lessons p. 212-218

Read carefully the portions of Scripture which form the basis of this Sabbath's lesson. Study the memory verse.

"A certain man had a fig tree planted in his vineyard; and he came and sought fruit thereon, and found none. Then said he unto the dresser of his vineyard, Behold, these three years I come seeking fruit on this fig tree, and find none: cut it down; why cumbereth it the ground? And he answering said unto him, Lord, let it alone this year also, till I shall dig about it, and dung it: And if it bear fruit, well: and if not, then after that thou shalt cut it down." — Luke 13:6-9

As you begin this week's study, consider the circumstances in which this parable was spoken. Read Luke 13:1-5 for context — Jesus had just been told about Galileans whose blood Pilate had mingled with their sacrifices, and about the tower of Siloam that fell. He used these events to call for repentance, then immediately spoke this parable of the barren fig tree.`,
        keyTexts: ["Luke 13:6-9", "Luke 13:1-5"],
      },
      {
        id: "01",
        title: "Sunday — The Barren Tree and Its Owner",
        content: `Repeat the story of the lesson from memory, and then read Luke 13:6-9. Study the circumstances under which the parable was spoken.

QUESTIONS:
1. With what form of teaching did Jesus continue His instruction?
2. What fact was stated as the basis of the lesson?
3. What did the owner naturally expect from his tree?
4. What was the result of his search for fruit?

To those acquainted with the Old Testament Scriptures the basis of the instruction in this parable was perfectly familiar. A fruit tree existed simply for the purpose of bearing fruit, and when it failed repeatedly to do this, it was not to be permitted to draw life out of the earth merely to keep itself alive. This was the gospel of the fruit tree, and it had been frequently interpreted to the people.`,
        keyTexts: ["Luke 13:6-9"],
      },
      {
        id: "02",
        title: "Monday — Three Years Without Fruit",
        content: `Read the comments on this lesson in "Christ's Object Lessons" p. 212-218. Review the Scripture lesson.

QUESTIONS:
5. How many times was this experience repeated?
6. What command did he give concerning the tree?
7. What question indicated its worthless condition?
8. How much longer did the dresser of the vineyard ask it to be spared?

FROM THE NOTES:
The cause of barrenness was to be found in sin (Ps. 107:33, 34), while righteousness was the basis of fruitfulness (Ps. 92:12-15), which would continue even "in old age." The truth had been set forth that delight in the law of the Lord would result in bringing forth fruit (Ps. 1:1-3), and the Messiah's work in imparting to His people "the law of the Spirit of life" would make them "trees of righteousness" (Isa. 61:1-3).`,
        keyTexts: ["Psalm 107:33-34", "Psalm 92:12-15", "Psalm 1:1-3", "Isaiah 61:1-3"],
      },
      {
        id: "03",
        title: "Tuesday — Condition of Fruitfulness",
        content: `Ask the questions on the primary lesson and review the memory verse. Study the practical lessons taught by the parable.

QUESTIONS:
9. What effort would he make to render it fruitful?
10. On what condition only would it be spared further?
11. If it failed to fulfill this condition, what was to be done?

PRACTICAL APPLICATION:
The rejection of the Messiah and His work of grace resulted in the loss of the kingdom of God, which was given "to a nation bringing forth the fruits thereof." They thus lost the opportunity of giving to the world the gospel of the kingdom. The tree which did not "cease from yielding fruit" was constantly proclaiming the experience of "the man that trusteth in the Lord, and whose hope the Lord is." (Jer. 17:7, 8)

In the light of these interpretations, those who heard the parable of the unfruitful tree had no difficulty in making a right application of its meaning.`,
        keyTexts: ["Jeremiah 17:7-8", "Luke 13:6-9"],
      },
      {
        id: "04",
        title: "Wednesday — Scripture Chains & Further Study",
        content: `Study the senior lesson questions and read the notes in the Lesson Quarterly.

SCRIPTURE CHAINS FOR DEEPER STUDY:
• Barrenness and sin: Psalm 107:33, 34
• Righteousness and fruitfulness: Psalm 92:12-15
• Delight in God's law brings fruit: Psalm 1:1-3
• Messiah makes "trees of righteousness": Isaiah 61:1-3
• The fruitful man who trusts in the Lord: Jeremiah 17:7, 8
• Every tree that does not bring forth good fruit: Matthew 7:19
• The vine and branches — abiding produces fruit: John 15:2-5
• Add to your faith: 2 Peter 1:5-8
• Fruit worthy of repentance: Luke 13:1-5

With the further light from the teaching of Jesus (Matt. 7:19; John 15:2-5), we ought to be able to make a close personal application of this lesson (2 Peter 1:5-8), and bring forth "fruit worthy of repentance."`,
        keyTexts: ["Matthew 7:19", "John 15:2-5", "2 Peter 1:5-8"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 212-218.

LESSON OUTLINE:
I. The Setting (Luke 13:1-5) — Jesus calls for repentance after discussing calamities
II. The Parable (Luke 13:6-9)
   A. The fig tree planted in the vineyard — God's people given every advantage
   B. Three years seeking fruit — God's patience and longsuffering
   C. "Cut it down" — The just consequence of fruitlessness
   D. The dresser's plea — Christ's intercession for sinners
   E. "Dig about it and dung it" — Special efforts of grace
   F. "If it bear fruit, well" — The condition of continued mercy
   G. "If not, cut it down" — The limit of probation

KEY COL INSIGHT:
This parable is present truth. Read Revelation 3:14-19 and note the earnest call to repentance — the Laodicean message echoes the same warning of the barren fig tree.`,
        keyTexts: ["Luke 13:1-9", "Revelation 3:14-19"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the barren fig tree teaches that God expects fruit from those He has planted in His vineyard. His patience is great — three years of fruitlessness — but there is a limit. Christ, the dresser of the vineyard, intercedes and provides every advantage for fruitfulness. But the condition remains: bear fruit or face the consequences.

PERSONAL APPLICATION QUESTIONS:
1. What "fruit" is God looking for in my life? (See Galatians 5:22, 23)
2. Have I been merely occupying space — drawing life from God's blessings without producing anything for others?
3. What special efforts of grace has God made in my life recently? How have I responded?
4. How does the call of Revelation 3:14-19 apply to me personally?
5. What changes would "digging about and dunging" look like in my daily experience?

MEMORY TEXT: "Every tree that bringeth not forth good fruit is hewn down, and cast into the fire." — Matthew 7:19`,
        keyTexts: ["Galatians 5:22-23", "Matthew 7:19", "Revelation 3:14-19"],
      },
    ],
  },

  "02": {
    lessonTitle: "The Parable of the Great Supper",
    lessonScripture: "Luke 14:12-20",
    aid: "Christ's Object Lessons p. 219-237",
    description: "The gospel invitation to the feast of salvation. Those who were bidden were so occupied with temporal matters that they treated as of trifling importance the final call of the host.",
    pdfStartPage: 8,
    pdfEndPage: 9,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 2 — THE PARABLE OF THE GREAT SUPPER
Lesson Scripture: Luke 14:12-20
AID: Christ's Object Lessons p. 219-237

Read carefully Luke 14:12-20. This parable deals with the final call to the gospel feast of those who had previously been invited, and of the way in which they treated this call.

The suggested future happiness of those who should "eat bread in the kingdom of God" led to this instruction and furnishes a simple basis for understanding its meaning.`,
        keyTexts: ["Luke 14:12-20"],
      },
      {
        id: "01",
        title: "Sunday — The Feast Prepared",
        content: `Repeat the story of the lesson from memory, then read Luke 14:12-20.

QUESTIONS:
1. What classes of persons did Jesus say need not constitute the invited guests for "a dinner or a supper"?
2. What reason did He give for this instruction?
3. Who should be invited?
4. What would be the result to the giver of the feast?
5. What would make this result possible?

The Lord rained "bread from heaven" for His people (Ex. 16:4), that they might learn that feeding upon His Word was the real means of sustaining life (Deut. 8:3). On this basis the gospel invitation had been sounded through the prophet Isaiah (Isa. 55:1-3), with the promise of "the sure mercies of David."`,
        keyTexts: ["Luke 14:12-20", "Exodus 16:4", "Deuteronomy 8:3", "Isaiah 55:1-3"],
      },
      {
        id: "02",
        title: "Monday — The Invitation Rejected",
        content: `Read the comments on this lesson in "Christ's Object Lessons" p. 219-237. Review the Scripture lesson.

QUESTIONS:
6. When would the reward be received?
7. What response did one of the guests make to this instruction?
8. With what statement did Jesus then continue His instruction?
9. How general were the invitations to this supper?
10. How were the invited guests reminded of their engagement?

FROM THE NOTES:
This was the promise of eternal life through faith in Christ (Ps. 89:28, 29), who was "born of the seed of David, according to the flesh." When the Word "became flesh, and dwelt among us," He said: "The bread of God is He which cometh down from heaven, and giveth life to the world. . . . I am the living bread which came down from heaven; if any man eat of this bread, he shall live forever." (John 6:33, 51)

Thus the provision for the gospel feast is Christ Himself, who has been given for us and to us.`,
        keyTexts: ["Psalm 89:28-29", "John 6:33", "John 6:51", "1 Corinthians 10:4"],
      },
      {
        id: "03",
        title: "Tuesday — Excuses and Their Cost",
        content: `Ask the questions on the primary lesson, review the memory verse, and study the practical lessons.

QUESTIONS:
11. What was the message sent to them?
12. How did they treat this urgent call?
13. What did the first one regard as of more importance than the privilege of being present at the feast?
14. How did the second one show that he held his oxen in higher esteem than his host?
15. Whose influence held the third one back from responding to the final call?

PRACTICAL APPLICATION:
The eating of this "bread of life" is not to be deferred until the setting up of the kingdom of God, but the call to the feast must be heeded here or that future happiness will never be realized. This is the emphatic teaching of this parable. Those who were bidden to the feast were so much occupied with various temporal matters that they treated as of trifling importance the final call of the host. What a true picture of the present danger! (Luke 21:34)`,
        keyTexts: ["Luke 14:18-20", "Luke 21:34", "Luke 14:33", "Matthew 19:29"],
      },
      {
        id: "04",
        title: "Wednesday — Scripture Chains & Further Study",
        content: `Study the senior lesson questions and read the notes.

SCRIPTURE CHAINS:
• Bread from heaven: Exodus 16:4
• Man shall not live by bread alone: Deuteronomy 8:3
• Come, buy wine and milk: Isaiah 55:1-3
• Sure mercies of David: Psalm 89:28, 29
• The bread of God from heaven: John 6:33, 51
• They did all eat the same spiritual food: 1 Corinthians 10:4
• No earthly possession or tie should keep us from Christ: Luke 14:33; Matthew 19:29
• Take heed lest your hearts be overcharged: Luke 21:34
• Mary chose the good part: Luke 10:38-42

No earthly possession or earthly tie should be allowed to keep us away from Christ (Luke 14:33; Matt. 19:29), and the most diligent attention to worldly interests will not be a valid excuse for neglecting the gospel call.`,
        keyTexts: ["Luke 14:33", "Matthew 19:29", "Luke 10:38-42"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 219-237.

LESSON OUTLINE:
I. The Setting — A feast at a Pharisee's house (Luke 14:1-11)
II. Jesus' Instruction on True Hospitality (Luke 14:12-14)
   A. Not friends, brethren, or rich neighbors
   B. Rather the poor, maimed, lame, blind
   C. Reward at the resurrection of the just
III. The Parable Introduced (Luke 14:15-17)
   A. "Blessed is he that shall eat bread in the kingdom of God"
   B. A great supper prepared — all things ready
   C. Servants sent: "Come; for all things are now ready"
IV. The Excuses (Luke 14:18-20)
   A. Bought a piece of ground — worldly possessions
   B. Bought five yoke of oxen — business interests
   C. Married a wife — domestic ties
V. The Gospel Feast is Christ Himself
   — The bread of life, given for us and to us`,
        keyTexts: ["Luke 14:1-20", "John 6:33-51"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The Parable of the Great Supper reveals the danger of treating God's invitation as secondary to earthly concerns. The feast is prepared, the invitation is given, but those invited allow land, business, and relationships to keep them away. The provision for the feast is Christ Himself — the living bread from heaven.

PERSONAL APPLICATION QUESTIONS:
1. What "excuses" am I making for not fully responding to God's call?
2. Which of the three categories tempts me most — possessions, business, or relationships?
3. Am I treating the gospel invitation as urgent or as something that can wait?
4. How can I make Christ the "bread of life" in my daily experience?
5. Read Luke 10:38-42 — Am I more like Martha (distracted by temporal things) or Mary (choosing the good part)?`,
        keyTexts: ["Luke 14:12-20", "Luke 10:38-42", "John 6:51"],
      },
    ],
  },

  "03": {
    lessonTitle: "The Parable of the Great Supper (continued)",
    lessonScripture: "Luke 14:21-24",
    aid: "Christ's Object Lessons p. 219-237",
    description: "The rejection of the gospel by those first invited and the turning to others. The call 'Come; for all things are now ready' is a call to prepare for the second coming of Christ.",
    pdfStartPage: 10,
    pdfEndPage: 11,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 3 — THE PARABLE OF THE GREAT SUPPER (Continued)
Lesson Scripture: Luke 14:21-24
AID: Christ's Object Lessons p. 219-237

Read carefully Luke 14:21-24. This continues the parable from last week, now focusing on what happens after the invited guests refuse the call. The master sends his servants to the highways and hedges to compel others to come in.`,
        keyTexts: ["Luke 14:21-24"],
      },
      {
        id: "01",
        title: "Sunday — The Servant Reports",
        content: `Repeat the story from memory and read Luke 14:21-24.

QUESTIONS:
1. How did the servant deal with these excuses?
2. What effect did they have upon the master of the house?
3. Where did he tell the servant to go next?

Those who refused the last call, "Come; for all things are now ready," were left to their own choice, but the feast was not thus deprived of its guests.`,
        keyTexts: ["Luke 14:21-24"],
      },
      {
        id: "02",
        title: "Monday — Go to the Streets and Lanes",
        content: `Read the comments in "Christ's Object Lessons" p. 219-237. Review the Scripture lesson.

QUESTIONS:
4. What classes of persons were to be brought in?
5. What report did the servant then make?
6. Where did his lord then send him?

FROM THE NOTES:
Those whose outward circumstances caused them to be despised by the world, and those hidden from the observation of men, were most urgently invited, and they responded to the call. Thus it often happens that the very blessings bestowed upon men as a means of drawing them to the Lord are turned by them into a hindrance to spiritual life, while the absence of temporal comforts leads to a greater readiness to receive the "unspeakable gift."`,
        keyTexts: ["Luke 14:21-23"],
      },
      {
        id: "03",
        title: "Tuesday — Compel Them to Come In",
        content: `Ask the questions and study the practical lessons taught by the parable.

QUESTIONS:
7. How urgent was to be the invitation?
8. What result was expected?
9. What declaration was made concerning the guests first invited?

PRACTICAL APPLICATION:
The rejection of the gospel call by those first invited, and the turning to others with the same invitation, foreshadowed the giving of the gospel to the Gentiles, and is the distinct call to us to send the last message "to every nation, and kindred, and tongue, and people."

By the winning power of love this message is to go forth to the world in this generation, to compel men to receive the gift of God's grace, to "eat the flesh of the Son of man, and drink His blood," that they may live forever.`,
        keyTexts: ["Luke 14:23-24", "Revelation 14:6"],
      },
      {
        id: "04",
        title: "Wednesday — Scripture Chains & Further Study",
        content: `Study the senior lesson questions and read the notes.

SCRIPTURE CHAINS — THE BIBLE AS INVITATION:
• God's call to Noah: Genesis 7:1
• His invitation through Isaiah: Isaiah 55:1
• Jesus' own invitation: Matthew 11:28
• The closing call of the Bible (thrice repeated): Revelation 22:17

THE BIBLE AS THE COMING OF CHRIST:
• The symbolic service foreshadowed it
• The prophets foretold it
• John the Baptist gave the message of His first coming: Luke 1:76
• His work finds its full completion in the last message before the second coming

The call today, "Come; for all things are now ready," is a call to prepare for the second coming of Christ and the marriage supper of the Lamb. Through the neighborly ministry of the medical missionary work this message is to go to the suffering and the needy.`,
        keyTexts: ["Genesis 7:1", "Isaiah 55:1", "Matthew 11:28", "Revelation 22:17", "Luke 1:76"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 219-237.

LESSON OUTLINE:
I. The Master's Anger at the Excuses (Luke 14:21)
   — Righteous indignation at the rejection of grace
II. The Second Call — Streets and Lanes (Luke 14:21-22)
   A. The poor, maimed, halt, blind — the humble and afflicted
   B. "Yet there is room" — God's grace is abundant
III. The Third Call — Highways and Hedges (Luke 14:23)
   A. "Compel them to come in" — urgency, not force
   B. The gospel to all nations — the Great Commission
IV. The Solemn Declaration (Luke 14:24)
   — "None of those men which were bidden shall taste of my supper"
V. Present Application
   A. The call combines: "Come" (Isa. 26:20, 21) and our response
   B. "Even so, come, Lord Jesus" (Rev. 22:20)
   C. The right use of all God's appointed agencies to reach all classes`,
        keyTexts: ["Luke 14:21-24", "Isaiah 26:20-21", "Revelation 22:20"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
When the first-invited guests refused, the master didn't cancel the feast — he expanded the invitation. The poor, the afflicted, those in the highways and hedges were urgently called. This foreshadows the gospel going to all nations and the final call before Christ's return.

PERSONAL APPLICATION QUESTIONS:
1. Am I actively inviting others to the gospel feast, or am I keeping the blessing to myself?
2. Who are the "poor, maimed, halt, and blind" in my community that need to hear the invitation?
3. How can I "compel" others by the winning power of love — not force?
4. The whole Bible is an invitation to come AND a message about Christ's coming. How does this dual theme shape my Bible study?
5. Read Isaiah 26:20, 21 and Revelation 22:20 — How do I combine the Lord's call with my response?`,
        keyTexts: ["Luke 14:21-24", "Isaiah 26:20-21", "Revelation 22:20"],
      },
    ],
  },

  "04": {
    lessonTitle: "The Parable of the Two Debtors",
    lessonScripture: "Matthew 18:21-35",
    aid: "Christ's Object Lessons p. 243",
    description: "The parable teaches that God's forgiveness flows to us freely, but we must extend that same forgiveness to others. An unforgiving spirit cancels the debt once freely forgiven.",
    pdfStartPage: 12,
    pdfEndPage: 12,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 4 — THE PARABLE OF THE TWO DEBTORS
Lesson Scripture: Matthew 18:21-35
AID: Christ's Object Lessons p. 243

Read carefully Matthew 18:21-35. Peter's question about forgiveness — "Lord, how oft shall my brother sin against me, and I forgive him? till seven times?" — prompted this powerful parable about a king settling accounts with his servants.`,
        keyTexts: ["Matthew 18:21-35"],
      },
      {
        id: "01",
        title: "Sunday — The Question of Forgiveness",
        content: `Repeat the story from memory and read Matthew 18:21-35.

QUESTIONS:
1. By what question was this parable suggested? What was Christ's answer? See also Luke 17:3, 4.
2. What experience should cause every child of the kingdom to cultivate a forgiving spirit? Eph. 4:32; 1 John 4:11.
3. Unto what did Jesus liken the kingdom of heaven? What irregularity did the king discover in his household? How much did the servant owe? What was the king's sentence?`,
        keyTexts: ["Matthew 18:21-22", "Luke 17:3-4", "Ephesians 4:32", "1 John 4:11"],
      },
      {
        id: "02",
        title: "Monday — Mercy Given, Mercy Withheld",
        content: `Read the comments in "Christ's Object Lessons" p. 243. Review the Scripture lesson.

QUESTIONS:
4. What did the servant do? How was his plea for mercy received?
5. What shows that the servant did not truly appreciate the favor received? What plea did his fellow-servant make? How was the plea received?
6. How did the evil servant's course affect his relations with the king? What of the debt once freely forgiven?
7. Whom does the king in the parable represent? Who are represented by the servants? How do all men stand before God? Rom. 3:23. How only may the debt be canceled? Rom. 3:24, 25. With what declaration does Jesus close this parable?`,
        keyTexts: ["Matthew 18:23-35", "Romans 3:23-25"],
      },
      {
        id: "03",
        title: "Tuesday — The Forgiving Spirit",
        content: `Ask the questions and study the practical lessons taught by the parable.

QUESTIONS:
8. What thought is to be associated with our daily prayer for forgiveness? Matt. 6:12; 5:23, 24.
9. Is this spirit to be cherished only when the one who has done the injury asks forgiveness? Luke 23:34; Rom. 5:8; Matt. 5:43-48.
10. What is the spring of the forgiving mercy of God toward men? — His love. Eph. 2:4. How may we receive the same spirit of forgiveness? Rom. 5:5; 2 Cor. 5:14; John 3:16.

PRACTICAL APPLICATION:
Jesus prayed for those who crucified Him before they asked for forgiveness (Luke 23:34). God commended His love toward us while we were yet sinners (Rom. 5:8). We are called to the same unconditional forgiveness — loving even our enemies (Matt. 5:43-48).`,
        keyTexts: ["Matthew 6:12", "Matthew 5:23-24", "Luke 23:34", "Romans 5:5-8"],
      },
      {
        id: "04",
        title: "Wednesday — Scripture Chains & Further Study",
        content: `Study the senior lesson questions and read the notes.

SCRIPTURE CHAINS — FORGIVENESS:
• Forgive as God forgave you: Ephesians 4:32
• We love because He first loved us: 1 John 4:11
• All have sinned: Romans 3:23
• Justified freely by His grace: Romans 3:24, 25
• Forgive us as we forgive: Matthew 6:12
• Be reconciled before offering your gift: Matthew 5:23, 24
• Father, forgive them: Luke 23:34
• While we were yet sinners: Romans 5:8
• Love your enemies: Matthew 5:43-48
• God's love poured in our hearts: Romans 5:5
• The love of Christ constrains us: 2 Corinthians 5:14
• God so loved the world: John 3:16
• God, who is rich in mercy: Ephesians 2:4`,
        keyTexts: ["Ephesians 4:32", "Romans 3:23-25", "Matthew 5:43-48", "2 Corinthians 5:14"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 243.

LESSON OUTLINE:
I. Peter's Question: "How oft shall I forgive?" (Matt. 18:21)
   — Seven times? Jesus says: "Seventy times seven"
II. The Parable (Matt. 18:23-35)
   A. The king settles accounts — God examines our lives
   B. The servant owes ten thousand talents — an unpayable debt (our sin)
   C. The king's sentence: sell all — the just consequence of sin
   D. The servant's plea for patience — our cry for mercy
   E. The king forgives all — God's boundless grace
III. The Forgiven Servant Refuses to Forgive
   A. His fellow servant owes a hundred pence — a trivial amount compared
   B. He refuses mercy — the spirit of unforgiveness
IV. The Consequences
   A. "Delivered to the tormentors" — the self-torment of bitterness
   B. "So likewise shall my heavenly Father do" — unforgiveness cancels grace
V. The Source of Forgiveness: God's Love (Eph. 2:4; Rom. 5:5)`,
        keyTexts: ["Matthew 18:21-35", "Ephesians 2:4"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the two debtors reveals that God's forgiveness flows freely to us but must flow through us to others. An unforgiving spirit toward others effectively cancels the grace we have received. The source of true forgiveness is not our own strength but God's love poured into our hearts by the Holy Spirit.

PERSONAL APPLICATION QUESTIONS:
1. Is there anyone I am refusing to forgive? What does this parable say about that?
2. How does the comparison between 10,000 talents and 100 pence change my perspective on grievances?
3. Am I waiting for the offender to ask forgiveness, or extending it freely as Christ did? (Luke 23:34)
4. How does my daily prayer "forgive us our debts as we forgive our debtors" (Matt. 6:12) challenge me?
5. What practical steps can I take this week to cultivate a forgiving spirit through God's love? (Rom. 5:5)`,
        keyTexts: ["Matthew 18:21-35", "Matthew 6:12", "Romans 5:5"],
      },
    ],
  },

  "05": {
    lessonTitle: "The Parable of the Foolish Rich Man",
    lessonScripture: "Luke 12:13-36",
    aid: "Christ's Object Lessons p. 252",
    description: "Jesus warns against covetousness through the story of a rich man who stored up earthly treasure but was not rich toward God. This warning is especially timely in the last days.",
    pdfStartPage: 13,
    pdfEndPage: 13,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 5 — THE PARABLE OF THE FOOLISH RICH MAN
Lesson Scripture: Luke 12:13-36
AID: Christ's Object Lessons p. 252

Read carefully Luke 12:13-36. A dispute about inheritance prompted Jesus to warn against covetousness and illustrate the folly of living for temporal things only.`,
        keyTexts: ["Luke 12:13-36"],
      },
      {
        id: "01",
        title: "Sunday — The Root of Covetousness",
        content: `Repeat the story from memory and read Luke 12:13-36.

QUESTIONS:
1. What dispute was Christ once asked to arbitrate? What evil principle did He see at the root of the dispute? What warning did He give?
2. By what illustration did Jesus show the folly of living for the things of this life only? What problem perplexed the rich man in the parable?
3. From whom came the fruits of his grounds? Ps. 65:9, 10. Where might he have stored the surplus? Luke 12:33.`,
        keyTexts: ["Luke 12:13-15", "Psalm 65:9-10", "Luke 12:33"],
      },
      {
        id: "02",
        title: "Monday — The Foolish Plan",
        content: `Read the comments in "Christ's Object Lessons" p. 252. Review the Scripture lesson.

QUESTIONS:
4. To what decision did he come? What truth had he forgotten? James 4:14, 15.
5. How was his ambitious plan cut short? What question did the Lord suggest concerning the disposition of the man's wealth? See also Ps. 39:6; Matt. 16:26.
6. What class may take warning from the rich man's fate? Toward whom should men be rich?`,
        keyTexts: ["Luke 12:16-21", "James 4:14-15", "Psalm 39:6", "Matthew 16:26"],
      },
      {
        id: "03",
        title: "Tuesday — Lessons of Trust",
        content: `Ask the questions and study the practical lessons taught by the parable.

QUESTIONS:
7. What lessons of trust would the Lord have us learn from the ravens? from the lilies? What is the important thing to seek for? Where will be the treasure of those who seek first God's kingdom?
8. Quote some scriptures showing that this warning against covetousness is especially timely in the last days. What is to be the attitude of believers in this time? Luke 12:35, 36.

PRACTICAL APPLICATION:
The rich man's question was "What shall I do?" — but he asked it about his surplus, not about his soul. He could have stored his surplus in heaven (Luke 12:33). Instead, he built bigger barns. The contrast is stark: earthly treasure vs. being "rich toward God."`,
        keyTexts: ["Luke 12:22-36", "Luke 12:33-34"],
      },
      {
        id: "04",
        title: "Wednesday — Scripture Chains & Further Study",
        content: `Study the senior lesson questions and read the notes.

SCRIPTURE CHAINS — COVETOUSNESS AND TRUST:
• The fruits come from God: Psalm 65:9, 10
• Provide bags that wax not old: Luke 12:33
• We know not what shall be on the morrow: James 4:14, 15
• He heapeth up riches and knoweth not who shall gather: Psalm 39:6
• What profit to gain the whole world and lose his soul: Matthew 16:26
• Consider the ravens — God feeds them: Luke 12:24
• Consider the lilies — God clothes them: Luke 12:27
• Seek first the kingdom of God: Luke 12:31
• Let your loins be girded — ready for the Master's return: Luke 12:35, 36
• Warning against hearts overcharged with surfeiting: Luke 21:34

This warning against covetousness is especially timely in the last days, when the love of money and material security threatens to eclipse readiness for Christ's return.`,
        keyTexts: ["Luke 12:24-34", "Luke 21:34"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 252.

LESSON OUTLINE:
I. The Occasion — Inheritance dispute (Luke 12:13-15)
   A. "Take heed and beware of covetousness"
   B. "A man's life consisteth not in the abundance of things"
II. The Parable — The Rich Fool (Luke 12:16-21)
   A. The ground brought forth plentifully — God's blessing
   B. "What shall I do?" — Self-centered reasoning
   C. "Pull down my barns and build greater" — Earthly security
   D. "Soul, take thine ease" — False assurance
   E. "Thou fool, this night" — Sudden reckoning
   F. "So is he that layeth up treasure and is not rich toward God"
III. The Antidote — Trust in God's Providence (Luke 12:22-34)
   A. The ravens — God provides food
   B. The lilies — God provides clothing
   C. "Seek ye the kingdom of God" — The right priority
IV. The Call to Readiness (Luke 12:35-36)
   — "Let your loins be girded and your lights burning"`,
        keyTexts: ["Luke 12:13-36"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the foolish rich man exposes the danger of covetousness — living for earthly treasure while neglecting eternal riches. God provides abundantly, but His gifts are meant to make us "rich toward God" through generosity, not to build bigger barns of self-security.

PERSONAL APPLICATION QUESTIONS:
1. Where am I "building bigger barns" instead of investing in eternal treasure?
2. What does it mean practically to be "rich toward God"?
3. How do the ravens and lilies challenge my anxiety about material provision?
4. Am I seeking first the kingdom of God, or is my primary energy directed toward earthly security?
5. Luke 12:35-36 says to be ready — how does covetousness threaten my readiness for Christ's return?`,
        keyTexts: ["Luke 12:13-36", "Matthew 6:33"],
      },
    ],
  },

  "06": {
    lessonTitle: "Allegory of the Rich Man and Lazarus",
    lessonScripture: "Luke 16:13-31",
    aid: "Christ's Object Lessons p. 260",
    description: "An allegory warning against selfish living. Natural objects or people are represented as acting in ways that point the warning — do not miss the purpose by turning the lesson into a discussion of the state of the dead.",
    pdfStartPage: 14,
    pdfEndPage: 14,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 6 — ALLEGORY OF THE RICH MAN AND LAZARUS
Lesson Scripture: Luke 16:13-31
AID: Christ's Object Lessons p. 260

Read carefully Luke 16:13-31. The allegory, in which natural objects or people are represented as acting or talking, often in a manner that would be impossible in actual life, was a familiar means of illustration in olden times, and is here used to point the warning against selfish living.

NOTE: Let not the purpose of the allegory be missed by turning the lesson into a discussion of the state of the dead.`,
        keyTexts: ["Luke 16:13-31"],
      },
      {
        id: "01",
        title: "Sunday — No Man Can Serve Two Masters",
        content: `Repeat the story from memory and read Luke 16:13-31.

QUESTIONS:
1. What rule of service did Christ here lay down? How was the message received? What vice was rebuked? To what lengths had this covetousness led? Matt. 23:14; 21:13.
2. Before whom did these people seek justification? How differently does God look upon a self-seeking life? What is the successful financial career? 2 Cor. 9:8, 9.`,
        keyTexts: ["Luke 16:13-15", "Matthew 23:14", "Matthew 21:13", "2 Corinthians 9:8-9"],
      },
      {
        id: "02",
        title: "Monday — The Rich Man and the Beggar",
        content: `Read the comments in "Christ's Object Lessons" p. 260. Review the Scripture lesson.

QUESTIONS:
3. What are the chief characters in this parable? What was the rich man's manner of life? In neglecting Lazarus, what precept did he violate? Matt. 22:39; Lev. 19:18.
4. In process of time what came alike to the rich man and the beggar? See also Ps. 89:48; 49:6-12.`,
        keyTexts: ["Luke 16:19-22", "Matthew 22:39", "Leviticus 19:18", "Psalm 89:48", "Psalm 49:6-12"],
      },
      {
        id: "03",
        title: "Tuesday — The Great Gulf Fixed",
        content: `Ask the questions and study the practical lessons taught by the parable.

QUESTIONS:
5. What vice was this parable designed to rebuke? How does it picture the reward of selfishness? What request is put in the rich man's mouth? Of what is he reminded? What had his manner of life forever fixed between himself and the righteous?
6. What final request is ascribed to the rich man? How was it answered? What is the highest evidence for truth? What will judge every selfish life in the last day? John 12:48.

PRACTICAL APPLICATION:
The purpose of this allegory is to warn against selfish living. The rich man's neglect of Lazarus violated the second great commandment: "Thou shalt love thy neighbour as thyself" (Lev. 19:18). His manner of life fixed an impassable gulf — not by God's arbitrary decree, but by the character formed through habitual selfishness.`,
        keyTexts: ["Luke 16:23-31", "John 12:48", "Leviticus 19:18"],
      },
      {
        id: "04",
        title: "Wednesday — Scripture Chains & Further Study",
        content: `Study the senior lesson questions and read the notes.

NOTE ON THE ALLEGORY:
At most a few references only will be needed in case any are not familiar with the Bible teaching on this subject:
• Man's condition in death: Ecclesiastes 9:5, 6; John 11:11, 14
• When the dead will be awakened: Job 14:12; John 5:28, 29
• When the righteous and wicked will view one another's reward: Revelation 20:5, 7, 10

SCRIPTURE CHAINS — SELFISHNESS AND ITS CURE:
• No man can serve God and mammon: Luke 16:13
• The Pharisees were covetous: Luke 16:14
• God knows your hearts: Luke 16:15
• Love your neighbor as yourself: Matthew 22:39; Leviticus 19:18
• The successful financial career: 2 Corinthians 9:8, 9
• The rich and poor alike face death: Psalm 89:48; 49:6-12
• The Word will judge in the last day: John 12:48`,
        keyTexts: ["Ecclesiastes 9:5-6", "John 5:28-29", "Revelation 20:5"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 260.

LESSON OUTLINE:
I. The Principle: No Man Can Serve Two Masters (Luke 16:13)
II. The Pharisees' Response (Luke 16:14-15)
   A. They derided Jesus — lovers of money
   B. God sees the heart, not outward justification
III. The Allegory (Luke 16:19-31)
   A. The rich man — "fared sumptuously every day"
   B. Lazarus — "laid at his gate, full of sores"
   C. Both die — death comes to all (Ps. 89:48)
   D. The reversal — selfish living has eternal consequences
   E. "A great gulf fixed" — character determines destiny
   F. "They have Moses and the prophets" — Scripture is sufficient
   G. "Neither will they be persuaded, though one rose from the dead"
IV. The Key Lesson: The allegory warns against selfish living
   — Do not miss its purpose by debating the state of the dead`,
        keyTexts: ["Luke 16:13-31"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
This allegory powerfully illustrates the consequences of selfish living. The rich man did not actively harm Lazarus — he simply ignored him. Neglect of our neighbor is violation of God's law. The allegory teaches that Scripture is sufficient evidence for truth, and character formed in this life determines eternal destiny.

PERSONAL APPLICATION QUESTIONS:
1. Who is the "Lazarus at my gate" — the person in need I'm walking past daily?
2. Am I serving God or mammon? Can I honestly say my financial decisions reflect God's priorities?
3. What does 2 Corinthians 9:8, 9 describe as the "successful financial career"? How does my life compare?
4. Am I listening to "Moses and the prophets" (Scripture), or am I waiting for something more dramatic?
5. What habits of selfishness might be fixing a "great gulf" in my character right now?`,
        keyTexts: ["Luke 16:13-31", "2 Corinthians 9:8-9"],
      },
    ],
  },

  "07": {
    lessonTitle: "The Two Sons",
    lessonScripture: "Matthew 21:28-32",
    aid: "Christ's Object Lessons p. 272-283",
    description: "The parable contrasts profession with performance. The son who said 'I will not' but afterward repented represents sinners who respond to God's call, while the son who said 'I go, sir' but went not represents those who profess but do not obey.",
    pdfStartPage: 15,
    pdfEndPage: 16,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 7 — THE TWO SONS
Lesson Scripture: Matthew 21:28-32
AID: Christ's Object Lessons p. 272-283

Read carefully Matthew 21:28-32. This parable was addressed directly to the chief priests and elders in the temple. Jesus was pressing home the difference between profession and practice.`,
        keyTexts: ["Matthew 21:28-32"],
      },
      {
        id: "01",
        title: "Sunday — The Father's Request",
        content: `Repeat the story from memory and read Matthew 21:28-32.

QUESTIONS:
1. To whom was the parable of the two sons addressed?
2. Where was it spoken?
3. State the circumstances which led up to it.
4. What three persons are mentioned in the parable?
5. Whom do they represent?
6. What intimate relation is thus expressed?`,
        keyTexts: ["Matthew 21:28-32", "Matthew 21:23-27"],
      },
      {
        id: "02",
        title: "Monday — Two Responses, Two Outcomes",
        content: `Read the comments in "Christ's Object Lessons" p. 272-283. Review the Scripture lesson.

QUESTIONS:
7. What is the vineyard?
8. What request did the father make of his elder son?
9. Give his reply.
10. What did the son afterward do?
11. What was said to the second son?
12. How did he appear to receive the command?
13. What course did he then take?`,
        keyTexts: ["Matthew 21:28-31"],
      },
      {
        id: "03",
        title: "Tuesday — The Application",
        content: `Ask the questions and study the practical lessons taught by the parable.

QUESTIONS:
14. What pointed question did Jesus immediately ask His hearers?
15. How does their reply show that they missed the real meaning of the parable?
16. With what words did Jesus force the lesson home?
17. What application has this parable for the church today?

PRACTICAL APPLICATION:
The parable challenges every believer: Are we like the second son — saying "I go, sir" to God's call but never actually going? A profession of willingness without obedience is worse than an initial refusal followed by genuine repentance. God values what we do, not merely what we say.`,
        keyTexts: ["Matthew 21:31-32"],
      },
      {
        id: "04",
        title: "Wednesday — Questions for Further Study",
        content: `QUESTIONS FOR FURTHER STUDY (from the lesson quarterly):

1. What great examples of activity are set before the Christian? John 5:17. Why is a mere profession of willingness to enter God's work not sufficient? James 1:22-25; Matt. 7:21; Eph. 2:10. How only can acceptable service be rendered? John 15:5.

2. What is the great test of loyalty to God? John 14:15. Who is the Christian's example in obedience? John 15:10; 4:34; Ps. 40:8.

3. Why did Jesus especially warn His disciples against following the example of the Pharisees? Matt. 23:3. What alone gives value to one's profession? James 2:14-18.

4. When should the call to service be answered? Heb. 3:15. How long is the field to be occupied? Luke 19:13. What grave danger lies in delay? John 9:4.`,
        keyTexts: ["John 5:17", "James 1:22-25", "Matthew 7:21", "John 15:5", "John 14:15", "Hebrews 3:15", "John 9:4"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 272-283.

LESSON OUTLINE:
I. The Setting — Jesus in the temple, challenged by priests and elders (Matt. 21:23-27)
II. The Parable (Matt. 21:28-30)
   A. The Father (God) and His vineyard (the work of the kingdom)
   B. First son: "I will not" — but afterward repented and went
      — Represents publicans and sinners who initially refuse but turn to God
   C. Second son: "I go, sir" — but went not
      — Represents religious leaders who profess but don't obey
III. The Question and Self-Condemnation (Matt. 21:31)
   A. "Whether of them twain did the will of his father?"
   B. They answer correctly but miss the application to themselves
IV. Jesus Forces the Lesson Home (Matt. 21:31-32)
   A. "Publicans and harlots go into the kingdom of God before you"
   B. John came and they believed him not; sinners did
V. Application for Today
   — Only obedience gives value to profession (James 2:14-18)`,
        keyTexts: ["Matthew 21:28-32", "James 2:14-18"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the two sons cuts to the heart of religious hypocrisy. God values obedience over profession. The son who first refused but then obeyed was commended over the one who promised but never acted. Jesus applied this directly to the religious leaders who professed loyalty to God but rejected His messengers.

PERSONAL APPLICATION QUESTIONS:
1. Am I more like the first son (honest about my resistance but eventually obedient) or the second (quick to promise but slow to follow through)?
2. What areas of God's work am I saying "I go, sir" to but never actually going?
3. "Be ye doers of the word, and not hearers only" (James 1:22) — where does this challenge me?
4. "The night cometh, when no man can work" (John 9:4) — what service am I delaying?
5. How can I ensure my profession of faith is matched by my practice this week?`,
        keyTexts: ["Matthew 21:28-32", "James 1:22", "John 9:4"],
      },
    ],
  },

  "08": {
    lessonTitle: "Parable of the Lord's Vineyard",
    lessonScripture: "Matthew 21:33-44",
    aid: "Christ's Object Lessons p. 284-306",
    description: "The householder planted a vineyard and let it out to husbandmen who mistreated his servants and killed his son. The kingdom of God would be taken from them and given to a nation bringing forth fruit.",
    pdfStartPage: 17,
    pdfEndPage: 18,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 8 — PARABLE OF THE LORD'S VINEYARD
Lesson Scripture: Matthew 21:33-44
AID: Christ's Object Lessons p. 284-306

Read carefully Matthew 21:33-44. Jesus continued His teaching in the temple with this parable about a householder who planted a vineyard. The lesson is based on Isaiah 5:1-7 — the song of the vineyard.`,
        keyTexts: ["Matthew 21:33-44", "Isaiah 5:1-7"],
      },
      {
        id: "01",
        title: "Sunday — The Vineyard Planted",
        content: `Repeat the story from memory and read Matthew 21:33-44.

QUESTIONS:
1. With what parable did Jesus continue His teaching in the temple?
2. Upon what was this lesson based?
3. Who is the householder mentioned in the parable?
4. By what were His people of Israel represented?
5. What returns from his vineyard had the householder a right to expect?
6. When the time of fruit drew near, what did he do?`,
        keyTexts: ["Matthew 21:33-34", "Isaiah 5:1-7"],
      },
      {
        id: "02",
        title: "Monday — The Servants Rejected",
        content: `Read the comments in "Christ's Object Lessons" p. 284-306. Review the Scripture lesson.

QUESTIONS:
7. How were these servants received?
8. When other servants were sent to the husbandmen, how were they also treated?
9. Last of all, whom did the householder send?
10. What did he say?
11. What treatment did the son receive?
12. When the narrative was finished, what question did Jesus ask His hearers?
13. With what words did they condemn themselves?`,
        keyTexts: ["Matthew 21:35-41"],
      },
      {
        id: "03",
        title: "Tuesday — The Stone the Builders Rejected",
        content: `Ask the questions and study the practical lessons.

QUESTIONS:
14. What solemn sentence did Jesus then pronounce upon them?
15. Who is the Stone brought to view in verse 42?
16. What were the priests and rulers even then doing?
17. Repeat the Saviour's description of this Stone.
18. Show how this description contained an invitation of mercy to all who would yet escape the doom of the unfaithful husbandmen.
19. What lessons does the parable of the vineyard contain for the church today?`,
        keyTexts: ["Matthew 21:42-44", "Isaiah 28:16", "1 Peter 2:3-8"],
      },
      {
        id: "04",
        title: "Wednesday — For Further Study",
        content: `FOR FURTHER STUDY (from the lesson quarterly):

1. The planting of the vineyard; God's purpose concerning it; its failure to fulfill that purpose; and the judgment pronounced upon it: Isa. 5:1-7; 27:3; Jer. 2:21; Hosea 10:1.

2. Israel's treatment of the servants of God: Matt. 5:12; Acts 7:51, 52; Heb. 11:32-35.

3. Their rejection of the Son: John 18:38-40; 19:4-12, 15-18.

4. The Stone rejected by the builders: Isa. 28:16; 1 Cor. 3:11; 1 Peter 2:3-8.

5. Lessons for the church today:
   (a) The price paid for it: Acts 20:28
   (b) Its commission and high calling: Matt. 5:14-16; 28:19, 20; 1 Peter 2:9, 10
   (c) To bring forth fruit: John 15:16
   (d) Its danger when the coming of the Householder is near: Luke 21:34; 2 Tim. 4:3, 4`,
        keyTexts: ["Isaiah 5:1-7", "Acts 7:51-52", "Isaiah 28:16", "1 Corinthians 3:11", "Acts 20:28", "1 Peter 2:9-10"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 284-306.

LESSON OUTLINE:
I. The Vineyard Planted (Matt. 21:33) — God's care for Israel
   — Based on Isaiah 5:1-7; 27:3; Jeremiah 2:21
II. The Servants Sent and Rejected (Matt. 21:34-36)
   — Israel's treatment of the prophets (Acts 7:51, 52; Heb. 11:32-35)
III. The Son Sent and Killed (Matt. 21:37-39)
   — The rejection of Christ (John 18:38-40; 19:15-18)
IV. The Self-Condemnation (Matt. 21:40-41)
   — "He will miserably destroy those wicked men"
V. The Stone Rejected (Matt. 21:42-44)
   — Christ the chief cornerstone (Isa. 28:16; 1 Cor. 3:11; 1 Peter 2:3-8)
   — Fall on the Stone and be broken (repentance) vs. the Stone falling on you (judgment)
VI. The Kingdom Given to Another Nation (Matt. 21:43)
   — A nation bringing forth fruits — the church today
   — Its commission (Matt. 28:19, 20), its danger (Luke 21:34; 2 Tim. 4:3, 4)`,
        keyTexts: ["Matthew 21:33-44", "1 Peter 2:3-8"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the Lord's vineyard traces God's patient dealings with His people — planting, nurturing, sending servants, and finally His own Son. When all were rejected, the kingdom was given to a nation that would bring forth fruit. The rejected Stone became the chief cornerstone.

PERSONAL APPLICATION QUESTIONS:
1. The church today has been given the same vineyard — am I producing fruit for the Master?
2. How am I treating God's messengers and His Word? Am I more receptive than Israel was?
3. The Stone offers mercy (fall on it and be broken) or judgment (it falls on you). Which am I choosing?
4. Acts 20:28 says the church was purchased with God's own blood — does this change how I value my calling?
5. Luke 21:34 and 2 Tim. 4:3, 4 warn of danger as the Householder's coming draws near. Am I alert?`,
        keyTexts: ["Matthew 21:33-44", "Acts 20:28", "Luke 21:34", "2 Timothy 4:3-4"],
      },
    ],
  },

  "09": {
    lessonTitle: "The Marriage Supper",
    lessonScripture: "Matthew 22:1-14",
    aid: "Christ's Object Lessons p. 307-319",
    description: "The kingdom of heaven likened to a king's marriage feast. The wedding garment represents the righteousness of Christ, and the examination of guests represents the investigative judgment.",
    pdfStartPage: 19,
    pdfEndPage: 20,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 9 — THE MARRIAGE SUPPER
Lesson Scripture: Matthew 22:1-14
AID: Christ's Object Lessons p. 307-319

Read carefully Matthew 22:1-14. This parable, like those of the two sons and the Lord's vineyard, carried special and solemn meaning for those who heard it spoken.`,
        keyTexts: ["Matthew 22:1-14"],
      },
      {
        id: "01",
        title: "Sunday — The King's Invitation",
        content: `Repeat the story from memory and read Matthew 22:1-14.

QUESTIONS:
1. With what simple statement did Jesus introduce this parable?
2. Whom were the servants to call to the marriage?
3. What shows that they had professed to accept the invitation?
4. What did they do when they were called?
5. How did they treat the second message, "All things are now ready; come"?
6. What did they do to the messengers?
7. Describe the fate of those who thus slighted the king's invitation and killed his servants.`,
        keyTexts: ["Matthew 22:1-7"],
      },
      {
        id: "02",
        title: "Monday — The Third Call",
        content: `Read the comments in "Christ's Object Lessons" p. 307-319. Review the Scripture lesson.

QUESTIONS:
8. What is illustrated by the two calls to the marriage and their rejection?
9. Afterward, what did the king say to his servants?
10. Who were to be bidden?
11. What does this third call represent?
12. How was the wedding finally furnished with guests?
13. What was provided for each one?
14. What is the wedding-garment?`,
        keyTexts: ["Matthew 22:8-12", "Revelation 19:8"],
      },
      {
        id: "03",
        title: "Tuesday — The Wedding Garment",
        content: `Ask the questions and study the practical lessons.

QUESTIONS:
15. What insult was offered the king by one who accepted his invitation to the marriage?
16. What question was asked him by the king?
17. How did he reply? What does this show?
18. What was done with him?
19. Like the parables of the two sons, the Lord's vineyard, etc., what special and solemn meaning had this parable for those who heard it spoken?
20. How does its lesson apply to the church today?
21. Why are few chosen? Show how this is taught in the parable.`,
        keyTexts: ["Matthew 22:11-14", "Revelation 19:7-8", "Revelation 3:18"],
      },
      {
        id: "04",
        title: "Wednesday — For Further Study",
        content: `FOR FURTHER STUDY (from the lesson quarterly):

1. The gospel invitation given to the Jews: Mark 1:14; Luke 4:43, 44; 8:1; 9:1, 2; Matt. 10:1, 7.

2. Rejected by them: Acts 7:51-54.

3. Given to the Gentiles: Matt. 28:19, 20; Acts 10:34-43.

4. The wedding garment:
   (a) What it is: Rev. 19:8
   (b) Worn by whom: Rev. 19:7, 8; Eph. 5:27
   (c) How obtained: Rev. 3:18

5. The examination of the guests: Rev. 20:11, 12.

6. The solemn responsibility of those who are bidden to the wedding: Matt. 24:42, 44; Rev. 16:15.`,
        keyTexts: ["Acts 7:51-54", "Revelation 19:7-8", "Ephesians 5:27", "Revelation 3:18", "Revelation 20:11-12", "Revelation 16:15"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 307-319.

LESSON OUTLINE:
I. The Marriage Feast Prepared (Matt. 22:1-2) — The kingdom of heaven
II. The First and Second Calls Rejected (Matt. 22:3-6)
   A. Gospel invitation to the Jews (Mark 1:14; Luke 4:43, 44)
   B. "They made light of it" — indifference to grace
   C. Some killed the messengers — persecution of God's servants
III. Judgment on Those Who Refused (Matt. 22:7) — Destruction of Jerusalem
IV. The Third Call — To the Highways (Matt. 22:8-10)
   — Gospel to the Gentiles (Acts 10:34-43)
   — "Both bad and good" — grace extended to all
V. The Wedding Garment (Matt. 22:11-13)
   A. What it is: The righteousness of Christ (Rev. 19:8)
   B. Freely provided by the King — not our own righteousness
   C. How obtained: "Buy of me white raiment" (Rev. 3:18) — by faith
   D. Without it: "Cast into outer darkness" — self-righteousness rejected
VI. The Examination of Guests (Matt. 22:11-12) — The investigative judgment (Rev. 20:11, 12)
VII. "Many are called, but few are chosen" (Matt. 22:14)`,
        keyTexts: ["Matthew 22:1-14", "Revelation 19:8", "Revelation 20:11-12"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the marriage supper reveals the full scope of salvation history — the gospel invitation to Israel, its rejection, the extension to all nations, and the final examination. The wedding garment (Christ's righteousness) is freely provided but must be accepted and worn. Those who refuse it are cast out.

PERSONAL APPLICATION QUESTIONS:
1. Have I accepted the King's invitation — and am I wearing the wedding garment He provides?
2. Am I trying to attend the feast in my own righteousness, or Christ's?
3. Revelation 3:18 says to "buy of me white raiment" — what does this transaction of faith look like daily?
4. The examination of the guests (Rev. 20:11, 12) is real — am I prepared for it?
5. "Many are called, but few are chosen" — what makes the difference? How does this parable answer that question?
6. Matthew 24:42, 44 and Revelation 16:15 — am I watching and keeping my garments?`,
        keyTexts: ["Matthew 22:1-14", "Revelation 3:18", "Revelation 16:15"],
      },
    ],
  },

  "10": {
    lessonTitle: "The Parable of the Talents",
    lessonScripture: "Matthew 25:14-30",
    aid: "Christ's Object Lessons p. 325-365",
    description: "Every gift and ability comes from God and is to be used in His service. The parable warns that the smallness of one's gift does not excuse from service, and shows the condition of the church before the Lord's return.",
    pdfStartPage: 21,
    pdfEndPage: 21,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 10 — THE PARABLE OF THE TALENTS
Lesson Scripture: Matthew 25:14-30
AID: Christ's Object Lessons p. 325-365

Read carefully Matthew 25:14-30. The kingdom of heaven is likened to a man traveling to a far country who entrusted his goods to his servants. This lesson was given to show the condition that will exist in the church just before the coming of the Lord.`,
        keyTexts: ["Matthew 25:14-30"],
      },
      {
        id: "01",
        title: "Sunday — Talents Distributed",
        content: `Repeat the story from memory and read Matthew 25:14-30.

QUESTIONS:
1. By what did Christ again represent the kingdom of heaven?
2. Where did the man go? Unto whom did he deliver his goods? For what purpose?
3. How were these gifts distributed? Did any receive more or less than he was capable of using? How did each servant treat his gift?`,
        keyTexts: ["Matthew 25:14-18"],
      },
      {
        id: "02",
        title: "Monday — The Reckoning",
        content: `Read the comments in "Christ's Object Lessons" p. 325-365. Review the Scripture lesson.

QUESTIONS:
4. On his return, what did the lord do? What report did each bring?
5. What reward did he bestow upon the one who had received five talents? The one who had received two talents? How did their rewards compare with their faithfulness?
6. What did he who had received one talent say? How did he thus bring judgment upon himself? What reply did the lord make? What was done with his talent? How did his sentence compare with his unfaithfulness?`,
        keyTexts: ["Matthew 25:19-30"],
      },
      {
        id: "03",
        title: "Tuesday — The Lesson Applied",
        content: `Ask the questions and study the practical lessons.

QUESTIONS:
7. What is naturally expected of one to whom goods have been intrusted? How much do we possess that does not belong to the Lord?
8. What lesson is taught in this parable? What warning does it contain for those who think that the smallness of their gift excuses them from service? What encouragement to faithfulness?
9. Why was this lesson given? What condition does it show will exist in the church just before the coming of the Lord?
10. Mention the many gifts that may be included in the talents. What practical lesson does this parable teach?

PRACTICAL APPLICATION:
The one-talent servant's problem was not lack of ability but lack of faith and effort. He judged his master as "hard" and was paralyzed by fear. The parable warns that hiding our gifts — however small — brings the same condemnation as active wickedness.`,
        keyTexts: ["Matthew 25:24-30"],
      },
      {
        id: "04",
        title: "Wednesday — Other References & Further Study",
        content: `Study the senior lesson and read the additional references.

OTHER REFERENCES FROM THE QUARTERLY:
• Mark 13:33, 34 — Watch and pray, for ye know not when the time is
• Luke 19:11-28 — The parable of the pounds (parallel parable)
• 1 Cor. 12:4-11, 28-31 — Diversities of gifts but the same Spirit
• Eph. 4:7-9, 11, 12 — Gifts given for the perfecting of the saints
• Rom. 12:6-8 — Gifts differing according to grace
• James 1:17 — Every good gift is from above
• 2 Cor. 8:12 — Accepted according to what a man hath
• Eccl. 9:10 — Whatsoever thy hand findeth to do, do it with thy might
• Col. 3:23 — Whatever ye do, do it heartily as to the Lord`,
        keyTexts: ["Mark 13:33-34", "1 Corinthians 12:4-11", "Ephesians 4:7-12", "Romans 12:6-8", "Ecclesiastes 9:10"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 325-365.

LESSON OUTLINE:
I. The Setting — Before Christ's Second Coming (Matt. 25:14)
   A. A man traveling to a far country — Christ ascending to heaven
   B. Delivering his goods to his servants — gifts entrusted to the church
II. Distribution According to Ability (Matt. 25:15)
   A. Five talents, two talents, one talent
   B. "To every man according to his several ability"
III. Faithfulness and Unfaithfulness (Matt. 25:16-18)
   A. Five-talent and two-talent servants: traded and doubled
   B. One-talent servant: dug in the earth and hid
IV. The Reckoning (Matt. 25:19-30)
   A. Equal commendation for equal faithfulness — "Well done"
   B. The one-talent servant's excuse: "I was afraid"
   C. "Thou wicked and slothful servant" — judgment
   D. "Cast ye the unprofitable servant into outer darkness"
V. Key COL Insight (p. 325-365):
   — The many gifts include time, health, money, affections, intellect, speech
   — This parable reveals the condition of the church before Christ's return`,
        keyTexts: ["Matthew 25:14-30"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the talents teaches that every gift belongs to God and must be used in His service. Faithfulness is measured not by the size of the gift but by how diligently it is used. The one-talent servant's failure was not in having little but in doing nothing. This parable reveals the condition of the church just before Christ's return.

PERSONAL APPLICATION QUESTIONS:
1. What talents has God given me? Am I using them or burying them?
2. Am I excusing inaction because my gifts seem small compared to others'?
3. Do I view God as a "hard master" (fear-based) or as a generous Lord (love-based)?
4. "Whatsoever thy hand findeth to do, do it with thy might" (Eccl. 9:10) — what is in my hand right now?
5. This parable shows the condition before Christ's return — am I trading with my talents or hiding them?
6. "Well done, good and faithful servant" — is this the greeting I'm working toward?`,
        keyTexts: ["Matthew 25:14-30", "Ecclesiastes 9:10", "Colossians 3:23"],
      },
    ],
  },

  "11": {
    lessonTitle: "The Parable of the Good Samaritan",
    lessonScripture: "Luke 10:25-37",
    aid: "Christ's Object Lessons p. 376-389",
    description: "True neighborliness knows no boundaries. The question 'Who is my neighbor?' is answered by the compassion of the Samaritan, who is a perfect example of Christ's own ministry to fallen humanity.",
    pdfStartPage: 22,
    pdfEndPage: 22,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 11 — THE PARABLE OF THE GOOD SAMARITAN
Lesson Scripture: Luke 10:25-37
AID: Christ's Object Lessons p. 376-389

Read carefully Luke 10:25-37. A lawyer's question — "Who is my neighbor?" — prompted one of the most beloved parables Jesus ever told.`,
        keyTexts: ["Luke 10:25-37"],
      },
      {
        id: "01",
        title: "Sunday — The Lawyer's Question",
        content: `Repeat the story from memory and read Luke 10:25-37.

QUESTIONS:
1. What incident led Jesus to speak the parable of the good Samaritan?
2. Why did this certain lawyer question Jesus?
3. After receiving a satisfactory reply, what did he ask further? What motive prompted him?
4. How did Jesus answer this question?`,
        keyTexts: ["Luke 10:25-30"],
      },
      {
        id: "02",
        title: "Monday — Priest, Levite, and Samaritan",
        content: `Read the comments in "Christ's Object Lessons" p. 376-389. Review the Scripture lesson.

QUESTIONS:
5. What happened to the man who traveled from Jericho to Jerusalem?
6. How was he treated by the priest? By the Levite?
7. Why did not the Samaritan treat him in the same manner? What did he do for the unfortunate man?
8. After relating this incident, what question did Jesus propound to the lawyer? What evidence have we that he saw the lesson that the Saviour designed to teach?`,
        keyTexts: ["Luke 10:30-37", "John 4:9"],
      },
      {
        id: "03",
        title: "Tuesday — Go and Do Likewise",
        content: `Ask the questions and study the practical lessons.

QUESTIONS:
9. Then, what answer did he receive to the question, "Who is my neighbor?"
10. What practical lesson may we draw from this incident?
11. What motive must prompt all true service? From what source alone does this spirit emanate?
12. Where may we find a perfect example of compassion for one's neighbor?

PRACTICAL APPLICATION:
The priest and Levite — religious professionals — passed by. The Samaritan — despised by the Jews — stopped and helped. True religion is not profession but compassion in action. The love of Christ constrains us (2 Cor. 5:14) to see every person as our neighbor.`,
        keyTexts: ["Luke 10:36-37", "2 Corinthians 5:14"],
      },
      {
        id: "04",
        title: "Wednesday — Other References & Further Study",
        content: `Study the senior lesson and read the additional references.

OTHER REFERENCES FROM THE QUARTERLY:
• Isaiah 53 — The Suffering Servant who bore our griefs
• John 4:9 — The Jews had no dealings with the Samaritans
• 2 Corinthians 5:14 — The love of Christ constraineth us

DEEPER STUDY:
The Good Samaritan is ultimately a picture of Christ Himself. Like the man who fell among thieves, humanity has been wounded by sin. The priest (ceremonial law) and the Levite (moral law alone) cannot save. It is Christ — despised and rejected — who comes to us, binds our wounds, pays the price, and promises to return.

Consider Isaiah 53 alongside Luke 10 — the Suffering Servant who was "despised and rejected" is the true Good Samaritan who gave Himself for fallen humanity.`,
        keyTexts: ["Isaiah 53:3-5", "John 4:9", "2 Corinthians 5:14"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 376-389.

LESSON OUTLINE:
I. The Lawyer's Test (Luke 10:25-28)
   A. "What shall I do to inherit eternal life?"
   B. Jesus directs him to the law — love God, love neighbor
   C. "This do, and thou shalt live"
II. "Who Is My Neighbor?" (Luke 10:29)
   — Asked to justify himself — seeking limits to love
III. The Parable (Luke 10:30-35)
   A. A man fell among thieves — humanity's fallen condition
   B. The priest passed by — ceremonial religion cannot save
   C. The Levite passed by — mere knowledge of the law insufficient
   D. The Samaritan had compassion — Christ's love in action
      — Came where he was, bound his wounds, set him on his own beast
      — Brought him to an inn, paid the price, promised to return
IV. Jesus' Question and Command (Luke 10:36-37)
   — "Which was neighbor?" — "He that showed mercy"
   — "Go, and do thou likewise"
V. The Perfect Example: Christ Himself (Isa. 53; 2 Cor. 5:14)`,
        keyTexts: ["Luke 10:25-37", "Isaiah 53:3-5"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the Good Samaritan answers the question "Who is my neighbor?" with a radical demonstration: your neighbor is anyone in need, regardless of race, religion, or social standing. The Samaritan — despised by Jews — became the hero because he acted with compassion while the religious leaders passed by.

PERSONAL APPLICATION QUESTIONS:
1. Who has God placed in my path that needs my help — someone I might naturally pass by?
2. Am I more like the priest/Levite (religious but indifferent) or the Samaritan (compassionate in action)?
3. What prejudices or biases might keep me from seeing someone as my neighbor?
4. The Samaritan gave his time, his resources, and his promise — what am I willing to give?
5. How is Christ the ultimate Good Samaritan in my life? How does His example transform my treatment of others?`,
        keyTexts: ["Luke 10:25-37", "2 Corinthians 5:14"],
      },
    ],
  },

  "12": {
    lessonTitle: "The Laborers in the Vineyard",
    lessonScripture: "Matthew 19:27-30; 20:1-16",
    aid: "Christ's Object Lessons p. 390-404",
    description: "The reward is not of works but of grace. The parable illustrates the true motive that should prompt all sacrifice — not merit-based bargaining but grateful response to God's mercy.",
    pdfStartPage: 23,
    pdfEndPage: 24,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 12 — THE LABORERS IN THE VINEYARD
Lesson Scripture: Matthew 19:27-30; 20:1-16
AID: Christ's Object Lessons p. 390-404

Read carefully Matthew 19:27 through 20:16. A rich young man had been told to sell all and follow Jesus. Peter's question — "What shall we then receive?" — prompted this parable about laborers hired at different hours but all receiving the same wage.`,
        keyTexts: ["Matthew 19:27-30", "Matthew 20:1-16"],
      },
      {
        id: "01",
        title: "Sunday — The Householder Hires Laborers",
        content: `Repeat the story from memory and read Matthew 20:1-16.

QUESTIONS:
1. What circumstance opened the way for the parable of the laborers?
2. Unto what did Jesus liken the kingdom of heaven in this parable?
3. What is the householder represented as doing?
4. When did he hire the first laborers? What agreement did he make with them?
5. At what other hours of the day did he hire laborers? What reward did he offer these?`,
        keyTexts: ["Matthew 19:27-30", "Matthew 20:1-7"],
      },
      {
        id: "02",
        title: "Monday — Equal Pay for Unequal Hours",
        content: `Read the comments in "Christ's Object Lessons" p. 390-404. Review the Scripture lesson.

QUESTIONS:
6. What did he say to those whom he found idle at the eleventh hour? What was their reply?
7. How did his offer to these compare with the promise made to those who began earlier in the day?
8. When even was come, what instruction did the lord of the vineyard give his steward?
9. How were the laborers rewarded? What complaint was made by those who had labored all day? What reason did they give for this?

FROM THE NOTES:
By reading carefully the last fifteen verses of Matthew 19, the event which led up to this parable is made very plain. A rich young man, coming to Jesus, had been told, "If thou wilt be perfect, go and sell that thou hast, and give to the poor, and thou shalt have treasure in heaven; and come and follow Me."`,
        keyTexts: ["Matthew 20:6-12"],
      },
      {
        id: "03",
        title: "Tuesday — Grace, Not Works",
        content: `Ask the questions and study the practical lessons.

QUESTIONS:
10. What reply did they receive? What application did Jesus make?
11. What lesson do you derive from this parable?

FROM THE NOTES:
Peter immediately connected the action of the young man and Christ's words with their experience as disciples, and asked what they, who had forsaken all and followed Him, were to receive. After a promise which breathes hope to every true disciple, Jesus illustrates by the parable of the laborers in the vineyard the true motive that should prompt all sacrifice.

The reward is not of works, but of grace. "To him that worketh not, but believeth on Him that justifieth the ungodly, his faith is counted for righteousness." (Rom. 4:5) "Not by works of righteousness which we have done, but according to His mercy He saved us." (Titus 3:5)`,
        keyTexts: ["Matthew 20:13-16", "Romans 4:5", "Titus 3:5"],
      },
      {
        id: "04",
        title: "Wednesday — Lesson Helps & Further Study",
        content: `Study the senior lesson and read the lesson helps.

LESSON HELPS FROM THE QUARTERLY:
• Mark 10:17-31 — The rich young ruler (Mark's account)
• Luke 18:18-30 — The rich young ruler (Luke's account)
• Eph. 3:20 — God is able to do exceeding abundantly above all we ask
• Titus 3:4-7 — Not by works but by His mercy
• Rom. 4:1-5 — Faith counted for righteousness
• Jer. 9:23, 24 — Let him that glorieth glory in knowing the Lord
• 2 Cor. 8:9 — Though He was rich, yet for your sakes He became poor
• Matt. 6:20 — Lay up treasures in heaven
• Matt. 13:22 — The deceitfulness of riches chokes the word
• Prov. 11:28 — He that trusteth in riches shall fall
• Ps. 52:7; 62:10 — Trust not in riches
• Luke 5:11 — They forsook all and followed Him
• Testimonies, vol. 1, pp. 170-178`,
        keyTexts: ["Mark 10:17-31", "Titus 3:4-7", "Romans 4:1-5", "2 Corinthians 8:9"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 390-404.

LESSON OUTLINE:
I. The Occasion — Peter's Question (Matt. 19:27)
   A. The rich young man refused the call (Matt. 19:16-22)
   B. Peter: "We have forsaken all — what shall we have?"
   C. Jesus' promise to the disciples (Matt. 19:28-30)
II. The Parable (Matt. 20:1-16)
   A. Early morning — hired for a penny (the agreed wage)
   B. Third hour, sixth hour, ninth hour — "whatsoever is right"
   C. Eleventh hour — "no man hath hired us"
   D. Evening — all receive the same penny
III. The Complaint and the Answer (Matt. 20:11-15)
   A. "Thou hast made them equal unto us"
   B. "Friend, I do thee no wrong — didst not thou agree?"
   C. "Is thine eye evil because I am good?"
IV. The Principle (Matt. 20:16)
   A. "The last shall be first, and the first last"
   B. The reward is of grace, not works (Rom. 4:5; Titus 3:5)
   C. True motive: gratitude for mercy, not merit-based bargaining`,
        keyTexts: ["Matthew 19:27-30", "Matthew 20:1-16", "Romans 4:5", "Titus 3:5"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the laborers in the vineyard teaches that salvation is by grace, not merit. All laborers received the same reward regardless of when they started. This challenges the spirit of comparison and entitlement that creeps into the church. The true motive for service is gratitude for God's mercy, not expectation of superior reward.

PERSONAL APPLICATION QUESTIONS:
1. Am I serving God with a "contract mentality" (expecting specific rewards) or a "grace mentality" (grateful for any part in His work)?
2. Do I resent it when newcomers to the faith seem to receive the same blessings as longtime believers?
3. "Is thine eye evil because I am good?" — Am I jealous of God's generosity to others?
4. How does Romans 4:5 ("to him that worketh not, but believeth") reshape my understanding of reward?
5. Whether I came to Christ early or late, am I working faithfully right now in His vineyard?`,
        keyTexts: ["Matthew 20:1-16", "Romans 4:5", "Titus 3:5"],
      },
    ],
  },

  "13": {
    lessonTitle: "The Parable of Ten Virgins",
    lessonScripture: "Matthew 25:1-13",
    aid: "Christ's Object Lessons p. 405-421",
    description: "This parable applies to the time just before Christ's second coming. The oil represents the Holy Spirit, and the closed door represents the close of probation. The solemn admonition: Watch!",
    pdfStartPage: 25,
    pdfEndPage: 28,
    days: [
      {
        id: "00",
        title: "Sabbath Afternoon — Introduction",
        content: `LESSON 13 — THE PARABLE OF TEN VIRGINS
Lesson Scripture: Matthew 25:1-13
AID: Christ's Object Lessons p. 405-421

Read carefully Matthew 25:1-13. Jesus introduced this parable with the word "Then" — connecting it directly to the prophecy of His second coming in Matthew 24. This parable applies to the time just before Christ's return.`,
        keyTexts: ["Matthew 25:1-13", "Matthew 24:42-51"],
      },
      {
        id: "01",
        title: "Sunday — Ten Virgins Go Forth",
        content: `Repeat the story from memory and read Matthew 25:1-13.

QUESTIONS:
1. By what word did Jesus introduce the parable of the ten virgins? What experience had He just described? Matt. 24. Then when does this parable apply?
2. What two classes are brought to view? What did all alike carry? For what purpose did they go forth?
3. What evidence is given showing that five were foolish?
4. Why did they need an extra supply of oil? Then what experience developed the condition of the two classes?`,
        keyTexts: ["Matthew 25:1-5"],
      },
      {
        id: "02",
        title: "Monday — The Midnight Cry",
        content: `Read the comments in "Christ's Object Lessons" p. 405-421. Review the Scripture lesson.

QUESTIONS:
5. What announcement awakes the sleeping virgins? Why were all not ready to meet the bridegroom, when all started with this one object in view?
6. To what source were the foolish virgins directed to go for oil? Why could they not borrow from their friends? See Ezek. 14:20.
7. What was the result of their not being prepared when the bridegroom came?`,
        keyTexts: ["Matthew 25:6-10", "Ezekiel 14:20"],
      },
      {
        id: "03",
        title: "Tuesday — The Shut Door",
        content: `Ask the questions and study the practical lessons.

QUESTIONS:
8. How did their experience compare with that of those who had oil in their lamps? How long had their lights been burning?
9. What reply did the foolish virgins receive to their appeal that the door be opened to them? Why was it then too late to replenish their lamps?
10. With what solemn admonition did Christ close this parable? What experience of God's people does it portray?
11. What is the significance of the virgins, the lamps, the oil, the tarrying of the bridegroom, his coming at midnight, the closed door, the disappointment of those who were unprepared to go in? What practical lesson does this parable teach?

PRACTICAL APPLICATION:
Both classes started with the same purpose — to meet the bridegroom. Both had lamps. Both fell asleep during the tarrying time. The difference was the oil — the indwelling presence of the Holy Spirit. Character cannot be borrowed in the crisis hour (Ezek. 14:20).`,
        keyTexts: ["Matthew 25:10-13", "Ezekiel 14:20"],
      },
      {
        id: "04",
        title: "Wednesday — Lesson Helps & Further Study",
        content: `Study the senior lesson and read the lesson helps.

LESSON HELPS FROM THE QUARTERLY:
• 1 Thess. 5:2-6 — The day of the Lord cometh as a thief; watch and be sober
• 2 Peter 3:3-11 — Scoffers in the last days; the Lord is not slack
• Rev. 19:6-9 — The marriage supper of the Lamb
• Rev. 21:2, 9, 10 — The bride, the Lamb's wife
• Luke 12:35-48 — Let your loins be girded and lights burning
• Matt. 24:42-51 — Watch, for ye know not what hour your Lord doth come
• Luke 13:24-30 — Strive to enter the strait gate; the door shut
• Matt. 7:21-23 — "Lord, Lord" — "I never knew you"
• Ps. 119:105 — Thy word is a lamp unto my feet
• Zech. 4:1-14 — The golden candlestick and the olive trees
• Ezek. 14:20 — Noah, Daniel, and Job could not deliver others
• Matt. 5:14, 16 — Ye are the light of the world; let your light shine
• Isa. 60:1 — Arise, shine, for thy light is come
• 2 Cor. 4:6, 7 — Treasure in earthen vessels
• Isa. 25:9 — "Lo, this is our God; we have waited for Him"`,
        keyTexts: ["1 Thessalonians 5:2-6", "2 Peter 3:3-11", "Revelation 19:6-9", "Zechariah 4:1-14"],
      },
      {
        id: "05",
        title: "Thursday — Lesson Outline with COL Thoughts",
        content: `Give an outline of the lesson, connecting with it the helpful thoughts in "Christ's Object Lessons" p. 405-421.

LESSON OUTLINE:
I. The Time Setting — "Then" (Matt. 25:1; cf. Matt. 24)
   — This parable applies to the time of Christ's second coming
II. The Two Classes (Matt. 25:1-4)
   A. All ten virgins — professed believers, all go forth to meet the bridegroom
   B. Five wise — took oil in their vessels (the Holy Spirit, deep experience)
   C. Five foolish — lamps only, no extra oil (profession without depth)
III. The Tarrying and the Sleep (Matt. 25:5)
   — "While the bridegroom tarried, they all slumbered and slept"
IV. The Midnight Cry (Matt. 25:6-7)
   — "Behold, the bridegroom cometh; go ye out to meet him"
   — All arose and trimmed their lamps
V. The Crisis (Matt. 25:8-9)
   A. "Our lamps are gone out" — the foolish discover their lack
   B. "Go to them that sell" — character cannot be borrowed
   C. Ezekiel 14:20 — personal righteousness is non-transferable
VI. The Closed Door (Matt. 25:10-12)
   — "The door was shut" — the close of probation
   — "I know you not" — too late for preparation
VII. The Admonition (Matt. 25:13)
   — "Watch therefore, for ye know neither the day nor the hour"`,
        keyTexts: ["Matthew 25:1-13"],
      },
      {
        id: "06",
        title: "Friday — Review & Personal Application",
        content: `Review all the lessons. Relate personal experiences in which the truths contained in the lesson have been helpful.

REVIEW SUMMARY:
The parable of the ten virgins is a solemn warning for the last days. All ten represent professed believers who go out to meet the bridegroom. The difference is internal — the oil of the Holy Spirit, a deep personal experience with God that cannot be borrowed or faked in the crisis hour. When the bridegroom comes, the door closes, and it is too late to prepare.

PERSONAL APPLICATION QUESTIONS:
1. Am I a wise or foolish virgin? Do I have oil in my vessel — a genuine, personal experience with God?
2. Am I "sleeping" during the tarrying time, relying on past experiences instead of daily renewal?
3. Can my spiritual life sustain a midnight crisis? Or is it only enough for fair weather?
4. "Go to them that sell" — the Holy Spirit is freely given but must be personally received. Am I seeking this gift daily?
5. "Lo, this is our God; we have waited for Him" (Isa. 25:9) — Will this be my exclamation when Christ returns?
6. "Watch therefore" — What does it mean practically to watch and be ready today?

MEMORY TEXT: "Watch therefore, for ye know neither the day nor the hour wherein the Son of man cometh." — Matthew 25:13`,
        keyTexts: ["Matthew 25:1-13", "Isaiah 25:9", "1 Thessalonians 5:2-6"],
      },
    ],
  },
};
