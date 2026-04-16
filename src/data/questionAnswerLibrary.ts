// Question & Answer Room Library
// Ask one text a question, find the answer in another (or same) text

export interface QAEntry {
  id: string;
  question: string;
  questionSource: { book: string; chapter: number; verses: string; text: string };
  answer: string;
  answerSource: { book: string; chapter: number; verses: string; text: string };
  category: "theology" | "practical" | "prophecy" | "salvation" | "character" | "doctrine";
  explanation: string;
  relatedVerses?: string[];
}

export const questionAnswerLibrary: QAEntry[] = [
  // SALVATION QUESTIONS
  {
    id: "how-saved",
    question: "What must I do to be saved?",
    questionSource: { book: "Acts", chapter: 16, verses: "30", text: "Sirs, what must I do to be saved?" },
    answer: "Believe on the Lord Jesus Christ, and you will be saved.",
    answerSource: { book: "Acts", chapter: 16, verses: "31", text: "Believe on the Lord Jesus Christ, and you will be saved, you and your household" },
    category: "salvation",
    explanation: "The Philippian jailer asked the most important question. Paul's answer was simple: believe. Not works, not rituals—faith in Jesus. This faith includes trusting, relying on, and committing to Him.",
    relatedVerses: ["Romans 10:9", "John 3:16", "Ephesians 2:8-9"]
  },
  {
    id: "why-jesus-came",
    question: "Why did Jesus come into the world?",
    questionSource: { book: "Luke", chapter: 19, verses: "10", text: "For the Son of Man has come to seek and to save that which was lost" },
    answer: "To seek and save the lost; to destroy the works of the devil; to give eternal life.",
    answerSource: { book: "1 John", chapter: 3, verses: "8", text: "For this purpose the Son of God was manifested, that He might destroy the works of the devil" },
    category: "salvation",
    explanation: "Jesus had a rescue mission. He came for the lost, the broken, the hopeless. He also came to defeat Satan and his works. The cross accomplished both.",
    relatedVerses: ["John 10:10", "Matthew 1:21", "Hebrews 2:14"]
  },
  {
    id: "who-can-come",
    question: "Who can come to Jesus?",
    questionSource: { book: "John", chapter: 6, verses: "44", text: "No one can come to Me unless the Father who sent Me draws him" },
    answer: "Whoever believes in Him. The invitation is for all.",
    answerSource: { book: "John", chapter: 3, verses: "16", text: "Whoever believes in Him should not perish but have everlasting life" },
    category: "salvation",
    explanation: "The Father draws, but the invitation is universal. 'Whoever' means anyone who responds to the Spirit's drawing. No one is excluded except those who exclude themselves.",
    relatedVerses: ["Revelation 22:17", "Matthew 11:28", "Isaiah 55:1"]
  },
  {
    id: "good-enough",
    question: "Can my good works save me?",
    questionSource: { book: "Isaiah", chapter: 64, verses: "6", text: "All our righteousnesses are like filthy rags" },
    answer: "Not by works of righteousness which we have done, but according to His mercy.",
    answerSource: { book: "Titus", chapter: 3, verses: "5", text: "Not by works of righteousness which we have done, but according to His mercy He saved us" },
    category: "salvation",
    explanation: "Even our best efforts are 'filthy rags' compared to God's holiness. Salvation is by grace alone. Works are the fruit of salvation, not the root.",
    relatedVerses: ["Ephesians 2:8-9", "Romans 3:20", "Galatians 2:16"]
  },
  {
    id: "assurance",
    question: "Can I know for sure that I'm saved?",
    questionSource: { book: "1 John", chapter: 5, verses: "13", text: "These things I have written to you who believe... that you may know that you have eternal life" },
    answer: "Yes! These things were written so you may KNOW you have eternal life.",
    answerSource: { book: "John", chapter: 10, verses: "28-29", text: "I give them eternal life, and they shall never perish; neither shall anyone snatch them out of My hand" },
    category: "salvation",
    explanation: "Assurance is not arrogance—it's trust in God's promise. If you have believed in Jesus, you have eternal life. Not 'might have'—HAVE. Rest in His grip, not your own.",
    relatedVerses: ["Romans 8:38-39", "2 Timothy 1:12", "Hebrews 10:22"]
  },

  // THEOLOGY QUESTIONS
  {
    id: "who-is-god",
    question: "What is God like?",
    questionSource: { book: "Exodus", chapter: 33, verses: "18", text: "Please, show me Your glory" },
    answer: "Merciful, gracious, longsuffering, abounding in goodness and truth.",
    answerSource: { book: "Exodus", chapter: 34, verses: "6-7", text: "The LORD, the LORD God, merciful and gracious, longsuffering, and abounding in goodness and truth" },
    category: "theology",
    explanation: "When Moses asked to see God's glory, God revealed His character. Not power or majesty first—but mercy, grace, patience, love. This is God's heart.",
    relatedVerses: ["1 John 4:8", "Psalm 103:8", "Numbers 14:18"]
  },
  {
    id: "trinity",
    question: "Is Jesus God?",
    questionSource: { book: "John", chapter: 1, verses: "1", text: "In the beginning was the Word, and the Word was with God, and the Word was God" },
    answer: "In Him dwells all the fullness of the Godhead bodily.",
    answerSource: { book: "Colossians", chapter: 2, verses: "9", text: "For in Him dwells all the fullness of the Godhead bodily" },
    category: "theology",
    explanation: "Jesus is not a lesser god or a created being. He is fully God—the fullness of deity in human form. The Word became flesh. God walked among us.",
    relatedVerses: ["John 20:28", "Titus 2:13", "Hebrews 1:8", "Isaiah 9:6"]
  },
  {
    id: "why-suffering",
    question: "Why does God allow suffering?",
    questionSource: { book: "Job", chapter: 13, verses: "24", text: "Why do You hide Your face, and regard me as Your enemy?" },
    answer: "God works all things for good for those who love Him.",
    answerSource: { book: "Romans", chapter: 8, verses: "28", text: "All things work together for good to those who love God, to those who are the called according to His purpose" },
    category: "theology",
    explanation: "Suffering remains a mystery, but God promises to redeem it. He doesn't cause all suffering, but He uses it. Joseph said: 'You meant it for evil, but God meant it for good' (Gen 50:20).",
    relatedVerses: ["2 Corinthians 4:17", "James 1:2-4", "1 Peter 5:10"]
  },
  {
    id: "holy-spirit-who",
    question: "Who is the Holy Spirit?",
    questionSource: { book: "John", chapter: 14, verses: "16", text: "I will pray the Father, and He will give you another Helper" },
    answer: "The Spirit of truth who proceeds from the Father and testifies of Jesus.",
    answerSource: { book: "John", chapter: 15, verses: "26", text: "The Spirit of truth who proceeds from the Father, He will testify of Me" },
    category: "theology",
    explanation: "The Holy Spirit is not an impersonal force but a Person—He can be grieved (Eph 4:30), He speaks (Acts 13:2), He teaches and reminds (John 14:26). He is God dwelling within believers.",
    relatedVerses: ["Acts 5:3-4", "Romans 8:26-27", "1 Corinthians 2:10-11"]
  },

  // PRACTICAL QUESTIONS
  {
    id: "how-pray",
    question: "How should we pray?",
    questionSource: { book: "Luke", chapter: 11, verses: "1", text: "Lord, teach us to pray" },
    answer: "Our Father in heaven, hallowed be Your name... (The Lord's Prayer model)",
    answerSource: { book: "Matthew", chapter: 6, verses: "9-13", text: "In this manner, therefore, pray: Our Father in heaven, hallowed be Your name..." },
    category: "practical",
    explanation: "Jesus gave a model prayer covering: worship (hallowed be Your name), submission (Your will be done), dependence (daily bread), forgiveness (forgive us/we forgive), protection (deliver from evil).",
    relatedVerses: ["Philippians 4:6", "1 Thessalonians 5:17", "James 5:16"]
  },
  {
    id: "why-read-bible",
    question: "Why should I read the Bible?",
    questionSource: { book: "Psalm", chapter: 119, verses: "9", text: "How can a young man cleanse his way?" },
    answer: "By taking heed according to Your word.",
    answerSource: { book: "Psalm", chapter: 119, verses: "11", text: "Your word I have hidden in my heart, that I might not sin against You" },
    category: "practical",
    explanation: "Scripture cleanses (John 15:3), guides (Ps 119:105), protects from sin (Ps 119:11), gives wisdom (Ps 19:7), produces faith (Rom 10:17), and is our spiritual food (Matt 4:4).",
    relatedVerses: ["2 Timothy 3:16-17", "Joshua 1:8", "James 1:22-25"]
  },
  {
    id: "how-overcome-temptation",
    question: "How can I overcome temptation?",
    questionSource: { book: "1 Corinthians", chapter: 10, verses: "13", text: "No temptation has overtaken you except such as is common to man" },
    answer: "God will provide the way of escape.",
    answerSource: { book: "1 Corinthians", chapter: 10, verses: "13", text: "God is faithful, who will not allow you to be tempted beyond what you are able, but with the temptation will also make the way of escape" },
    category: "practical",
    explanation: "Every temptation has an exit door. God promises He won't let you be overwhelmed. Your job: look for the escape route and take it. Jesus escaped by quoting Scripture (Matt 4).",
    relatedVerses: ["James 4:7", "Hebrews 2:18", "1 John 4:4"]
  },
  {
    id: "how-forgive",
    question: "How many times should I forgive?",
    questionSource: { book: "Matthew", chapter: 18, verses: "21", text: "Lord, how often shall my brother sin against me, and I forgive him? Up to seven times?" },
    answer: "Not seven times, but seventy times seven.",
    answerSource: { book: "Matthew", chapter: 18, verses: "22", text: "Jesus said to him, 'I do not say to you, up to seven times, but up to seventy times seven'" },
    category: "practical",
    explanation: "Jesus wasn't saying 490 is the limit—He meant unlimited forgiveness. If you're counting, you're missing the point. Forgive as you've been forgiven (Eph 4:32).",
    relatedVerses: ["Colossians 3:13", "Mark 11:25", "Luke 17:3-4"]
  },
  {
    id: "why-church",
    question: "Why should I go to church?",
    questionSource: { book: "Hebrews", chapter: 10, verses: "25", text: "Not forsaking the assembling of ourselves together" },
    answer: "We are members of one body, needing each other.",
    answerSource: { book: "1 Corinthians", chapter: 12, verses: "27", text: "Now you are the body of Christ, and members individually" },
    category: "practical",
    explanation: "Christianity is not a solo sport. We need encouragement, accountability, teaching, and fellowship. The body needs all its parts working together.",
    relatedVerses: ["Acts 2:42-47", "Romans 12:4-5", "Ephesians 4:11-16"]
  },

  // DOCTRINE QUESTIONS
  {
    id: "which-day-sabbath",
    question: "Which day is the Sabbath?",
    questionSource: { book: "Exodus", chapter: 20, verses: "8", text: "Remember the Sabbath day, to keep it holy" },
    answer: "The seventh day is the Sabbath of the LORD your God.",
    answerSource: { book: "Exodus", chapter: 20, verses: "10-11", text: "The seventh day is the Sabbath of the LORD your God... For in six days the LORD made the heavens and the earth" },
    category: "doctrine",
    explanation: "The seventh day (Saturday) is identified as the Sabbath—rooted in Creation week. Jesus kept it (Luke 4:16), and it remains a sign of loyalty to the Creator (Ezek 20:12, 20).",
    relatedVerses: ["Genesis 2:2-3", "Mark 2:27-28", "Isaiah 58:13-14", "Luke 23:56"]
  },
  {
    id: "what-happens-death",
    question: "What happens when we die?",
    questionSource: { book: "Ecclesiastes", chapter: 9, verses: "5", text: "The living know that they will die; but the dead know nothing" },
    answer: "The dead sleep until the resurrection.",
    answerSource: { book: "John", chapter: 11, verses: "11-14", text: "Our friend Lazarus sleeps... Jesus had spoken of his death" },
    category: "doctrine",
    explanation: "Death is called 'sleep' over 50 times in Scripture. The dead are unconscious, awaiting resurrection—not already in heaven or hell. The reward comes at Christ's return (Rev 22:12).",
    relatedVerses: ["Psalm 146:4", "Job 14:12", "1 Thessalonians 4:13-17", "John 5:28-29"]
  },
  {
    id: "when-second-coming",
    question: "When will Jesus return?",
    questionSource: { book: "Matthew", chapter: 24, verses: "36", text: "Of that day and hour no one knows, not even the angels of heaven" },
    answer: "No one knows the day or hour, but watch for the signs.",
    answerSource: { book: "Matthew", chapter: 24, verses: "42", text: "Watch therefore, for you do not know what hour your Lord is coming" },
    category: "doctrine",
    explanation: "We cannot set dates, but Jesus gave signs to watch for: wars, earthquakes, Gospel to all nations, persecution, and moral decline. We should live ready, not complacent.",
    relatedVerses: ["Acts 1:7", "2 Peter 3:10", "1 Thessalonians 5:2", "Matthew 24:44"]
  },
  {
    id: "is-hell-eternal",
    question: "Is hell eternal torment?",
    questionSource: { book: "Malachi", chapter: 4, verses: "1", text: "The day is coming, burning like an oven... All the wicked will be stubble" },
    answer: "The wicked will be ashes under the feet of the righteous.",
    answerSource: { book: "Malachi", chapter: 4, verses: "3", text: "You shall trample the wicked, for they shall be ashes under the soles of your feet" },
    category: "doctrine",
    explanation: "Hellfire is real but not eternal conscious torment. The wicked perish, are consumed, become ashes. 'Eternal fire' (Jude 7) destroyed Sodom—the results are eternal, not the process.",
    relatedVerses: ["Psalm 37:20", "Obadiah 1:16", "2 Peter 2:6", "Romans 6:23"]
  },
  {
    id: "baptism-necessary",
    question: "Is baptism necessary for salvation?",
    questionSource: { book: "Mark", chapter: 16, verses: "16", text: "He who believes and is baptized will be saved" },
    answer: "Baptism is the outward expression of inward faith.",
    answerSource: { book: "1 Peter", chapter: 3, verses: "21", text: "Baptism now saves us—not the removal of dirt from the flesh, but the answer of a good conscience toward God" },
    category: "doctrine",
    explanation: "Baptism doesn't save us (the thief on the cross wasn't baptized), but it's commanded as our public confession of faith. It symbolizes death to sin and resurrection to new life (Rom 6:3-4).",
    relatedVerses: ["Acts 2:38", "Matthew 28:19", "Acts 22:16", "Galatians 3:27"]
  },

  // CHARACTER QUESTIONS
  {
    id: "greatest-commandment",
    question: "What is the greatest commandment?",
    questionSource: { book: "Matthew", chapter: 22, verses: "36", text: "Teacher, which is the great commandment in the law?" },
    answer: "Love the Lord your God... Love your neighbor as yourself.",
    answerSource: { book: "Matthew", chapter: 22, verses: "37-39", text: "You shall love the LORD your God with all your heart... You shall love your neighbor as yourself" },
    category: "character",
    explanation: "All of God's law hangs on love—vertical (God) and horizontal (neighbor). If you get love right, everything else follows. Love is the fulfillment of the law (Rom 13:10).",
    relatedVerses: ["Deuteronomy 6:5", "Leviticus 19:18", "1 John 4:19-21"]
  },
  {
    id: "fruit-spirit",
    question: "What does a Spirit-filled life look like?",
    questionSource: { book: "Galatians", chapter: 5, verses: "22", text: "The fruit of the Spirit is love, joy, peace..." },
    answer: "Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.",
    answerSource: { book: "Galatians", chapter: 5, verses: "22-23", text: "Love, joy, peace, longsuffering, kindness, goodness, faithfulness, gentleness, self-control" },
    category: "character",
    explanation: "The Spirit produces fruit—not gifts, programs, or activities—CHARACTER. These nine qualities are the evidence of a life surrendered to God. They grow over time.",
    relatedVerses: ["John 15:5", "Colossians 3:12-14", "2 Peter 1:5-8"]
  },
  {
    id: "anger-sin",
    question: "Is anger always sin?",
    questionSource: { book: "Ephesians", chapter: 4, verses: "26", text: "Be angry, and do not sin" },
    answer: "Be angry but do not sin. Do not let the sun go down on your wrath.",
    answerSource: { book: "Ephesians", chapter: 4, verses: "26-27", text: "Be angry, and do not sin: do not let the sun go down on your wrath, nor give place to the devil" },
    category: "character",
    explanation: "Righteous anger exists (Jesus cleansed the temple). But anger becomes sin when it's selfish, vengeful, or nursed. Deal with it quickly before it gives the devil a foothold.",
    relatedVerses: ["James 1:19-20", "Proverbs 14:29", "Mark 3:5"]
  },
  {
    id: "worry-anxiety",
    question: "How do I deal with worry and anxiety?",
    questionSource: { book: "Philippians", chapter: 4, verses: "6", text: "Be anxious for nothing" },
    answer: "Pray about everything, and God's peace will guard your heart.",
    answerSource: { book: "Philippians", chapter: 4, verses: "6-7", text: "In everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God... will guard your hearts" },
    category: "character",
    explanation: "The antidote to anxiety is prayer with thanksgiving. Not just praying for what you need, but thanking God while you wait. This guards your heart with supernatural peace.",
    relatedVerses: ["1 Peter 5:7", "Matthew 6:25-34", "Isaiah 26:3"]
  },

  // PROPHECY QUESTIONS
  {
    id: "who-antichrist",
    question: "Who is the Antichrist?",
    questionSource: { book: "Daniel", chapter: 7, verses: "8", text: "A little horn, having eyes like the eyes of a man, and a mouth speaking pompous words" },
    answer: "The power that opposes Christ's authority and persecutes His people.",
    answerSource: { book: "2 Thessalonians", chapter: 2, verses: "3-4", text: "The man of sin... the son of perdition, who opposes and exalts himself above all that is called God" },
    category: "prophecy",
    explanation: "The Antichrist is not just a future individual but a system that has existed throughout history, claiming divine authority, changing God's law, and persecuting believers.",
    relatedVerses: ["Daniel 7:25", "Revelation 13:1-8", "1 John 2:18"]
  },
  {
    id: "meaning-666",
    question: "What does 666 mean?",
    questionSource: { book: "Revelation", chapter: 13, verses: "18", text: "Let him who has understanding calculate the number of the beast... His number is 666" },
    answer: "It is the number of a man—representing human attempts to be like God.",
    answerSource: { book: "Revelation", chapter: 13, verses: "18", text: "It is the number of a man: His number is 666" },
    category: "prophecy",
    explanation: "6 falls short of 7 (perfection/divine). 666 = humanity's best attempt, tripled—still falling short. It represents man exalting himself to God's position. The beast system claims God's authority but is merely human.",
    relatedVerses: ["Isaiah 14:14", "Daniel 3:1", "Genesis 3:5"]
  },
];

// Helper functions
export const getQAByCategory = (category: QAEntry["category"]) =>
  questionAnswerLibrary.filter(qa => qa.category === category);

export const searchQA = (query: string) => {
  const q = query.toLowerCase();
  return questionAnswerLibrary.filter(qa =>
    qa.question.toLowerCase().includes(q) ||
    qa.answer.toLowerCase().includes(q) ||
    qa.explanation.toLowerCase().includes(q)
  );
};

export const getRelatedQA = (entry: QAEntry) => {
  if (!entry.relatedVerses) return [];
  return questionAnswerLibrary.filter(qa =>
    qa.id !== entry.id &&
    (qa.answerSource.book === entry.answerSource.book ||
     qa.category === entry.category)
  ).slice(0, 3);
};
