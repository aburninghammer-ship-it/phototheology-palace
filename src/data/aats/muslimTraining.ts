// ─── AATS: Muslim Avatar Training Data ──────────────────────────────────────
// Apologetics training for engaging Islamic theological claims from an SDA perspective.

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "tawhid",
    title: "Tawhid (Absolute Monotheism)",
    description:
      "God is absolutely one; the Trinity is shirk (idolatry). Islam teaches that God's oneness (tawhid) is indivisible and that any attribution of partners to Allah — including the Christian doctrine of the Trinity — is the gravest sin.",
  },
  {
    id: "final-prophethood",
    title: "Final Prophethood",
    description:
      "Muhammad is the final prophet (Khatam an-Nabiyyin); Jesus was only a prophet. Islam holds that Muhammad is the 'Seal of the Prophets' and that Jesus, while respected, was merely a human messenger whose mission was superseded.",
  },
  {
    id: "quran-supremacy",
    title: "Qur'an Supremacy",
    description:
      "The Qur'an is perfectly preserved, word-for-word as revealed to Muhammad; all previous scriptures — Torah, Psalms, and Gospels — have been corrupted (tahrif) and are therefore unreliable.",
  },
  {
    id: "injil-corruption",
    title: "Injil Corruption",
    description:
      "The original Gospel (Injil) given to Jesus has been lost or irrecoverably altered. What Christians call the 'Gospels' are human compositions that distort Jesus' original monotheistic message.",
  },
  {
    id: "jesus-in-islam",
    title: "Jesus in Islam",
    description:
      "Jesus (Isa) never claimed deity; He was a Muslim prophet who submitted to Allah, denied being God, and prophesied the coming of Muhammad. His crucifixion is denied or reinterpreted.",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "sm-muslim-trinity-illogical",
    title: "Trinity Is Illogical",
    argument:
      "The Trinity is a logical impossibility — God cannot be three and one simultaneously. This is a mathematical contradiction that violates the law of non-contradiction. Pure monotheism, as taught in the Shema (Deut 6:4) and throughout the Hebrew Bible, demands an undivided unity. The Trinity was an invention of later Greek philosophy imposed onto the simple monotheism of Jesus.",
    hiddenAssumptions: [
      "Unity must mean mathematical singularity — that 'one' can only mean a solitary monad, ignoring the Hebrew 'echad' (compound unity) vs. 'yachid' (absolute singularity).",
      "Human logic fully comprehends God — that finite minds can dictate limits on how an infinite Being can exist, despite both the Bible and Qur'an affirming God transcends human understanding.",
      "Echad means yachid — conflating a word that describes composite unity (e.g., Gen 2:24 'one flesh') with absolute numerical singularity.",
    ],
    sdaResponse:
      "SDAs affirm the Shema — God is ONE (echad). But echad in Hebrew describes a compound unity, as in 'the two shall become one (echad) flesh' (Gen 2:24) and 'the people are one (echad)' (Gen 11:6). The Trinity is not 1+1+1=3 gods but one Being in three co-eternal Persons. Deuteronomy 6:4 uses echad, not yachid (absolute singularity used in Gen 22:2). God's nature transcends mathematical categories, yet is internally consistent: one 'What' (divine nature), three 'Whos' (Father, Son, Spirit). The concept appears before Nicaea — in Genesis 1:26 ('Let Us make man'), Isaiah 48:16, and the baptismal formula of Matthew 28:19.",
  },
  {
    id: "sm-muslim-bible-corrupted",
    title: "Bible Is Corrupted — Textual Variants Prove It",
    argument:
      "The Bible has hundreds of thousands of textual variants across manuscripts. No two manuscripts are identical. Scholars like Bart Ehrman have shown that scribes changed the text — adding the Trinitarian formula in 1 John 5:7, the ending of Mark, and the story of the woman caught in adultery. How can you trust a book that has been demonstrably altered? The Qur'an, by contrast, has been perfectly preserved letter-by-letter since its revelation.",
    hiddenAssumptions: [
      "Any textual variant equals corruption — ignoring that the vast majority (99%+) are trivial spelling differences, word-order variations, or scribal slips that affect no doctrine.",
      "The Qur'an has zero variants — ignoring the well-documented history of variant Qur'anic codices (Ibn Mas'ud, Ubayy ibn Ka'b), Uthman's burning of competing codices, and the Sana'a manuscripts.",
      "Textual criticism invalidates scripture — misunderstanding that the scholarly discipline of textual criticism actually strengthens confidence in the original text rather than undermining it.",
    ],
    sdaResponse:
      "The sheer number of biblical manuscripts (5,800+ Greek NT manuscripts, 10,000+ Latin, plus Syriac, Coptic, etc.) is a strength, not a weakness — it allows scholars to reconstruct the original text with extraordinary accuracy. Textual critic Daniel Wallace notes that 99% of variants are insignificant, and no core Christian doctrine rests on a disputed passage. Meanwhile, the Qur'an's own history includes Uthman's burning of rival codices (Sahih al-Bukhari 6:61:510), variant readings in the Sana'a palimpsest, and the Qira'at traditions acknowledging seven (or ten) accepted variant readings. SDAs affirm that God providentially preserved His Word through the manuscript tradition — the same God who spoke through prophets ensured His message endured (Isa 40:8; Matt 24:35; 1 Pet 1:25).",
  },
  {
    id: "sm-muslim-jesus-never-claimed-deity",
    title: "Jesus Never Claimed to Be God",
    argument:
      "Jesus never once said the words 'I am God, worship me.' He called Himself 'Son of Man,' prayed to God, and said 'the Father is greater than I' (John 14:28). He was a humble prophet who submitted to God's will — a Muslim in the truest sense. The deification of Jesus was a later pagan corruption of his original monotheistic message.",
    hiddenAssumptions: [
      "Only an explicit statement 'I am God' counts as a deity claim — ignoring that in the Jewish context, implicit claims were understood perfectly (and led to charges of blasphemy).",
      "Implicit claims don't count — dismissing Jesus' acceptance of worship (Matt 14:33), forgiveness of sins (Mark 2:5-7), claims to pre-existence (John 8:58), and identification with YHWH's 'I AM.'",
      "The Jewish audience didn't understand His claims — despite the fact that they repeatedly tried to stone Him precisely because they understood He was 'making Himself equal with God' (John 5:18; 10:33).",
    ],
    sdaResponse:
      "Jesus made His deity claims in the idiom of first-century Judaism, where they were unmistakable. He claimed the divine name 'I AM' (ego eimi — John 8:58, cf. Exodus 3:14), and His audience understood perfectly, picking up stones for blasphemy (John 8:59; 10:31-33). He forgave sins — a prerogative only God possesses (Mark 2:5-7; Luke 7:48-49). He accepted worship that only God deserves (Matt 14:33; 28:9, 17; John 9:38; cf. Rev 22:8-9 where angels refuse worship). He claimed authority over the Sabbath, God's own institution (Mark 2:28). 'Son of Man' is not a humble title — it references Daniel 7:13-14, where the Son of Man receives universal, everlasting dominion and worship from all nations — divine prerogatives. The earliest Christians — Jews who knew the Shema by heart — worshipped Jesus as Lord (Phil 2:9-11; cf. Isa 45:23).",
  },
  {
    id: "sm-muslim-nicaea-invented-trinity",
    title: "Nicaea Invented the Trinity",
    argument:
      "The Council of Nicaea in 325 AD was where the Trinity was invented. Emperor Constantine, a pagan sun-worshipper, forced the bishops to deify Jesus for political unity. Before Nicaea, early Christians were Unitarian monotheists like Muslims. The Trinity is a political creation, not a biblical teaching.",
    hiddenAssumptions: [
      "The pre-Nicene church had no Trinitarian belief — ignoring abundant evidence from Ignatius (d. 108), Justin Martyr (d. 165), Irenaeus (d. 202), Tertullian (d. 220), and others who affirmed Christ's deity and the triune nature of God decades or centuries before Nicaea.",
      "Constantine controlled the doctrine — ignoring that Constantine initially favored Arius (the anti-Trinitarian) and that the bishops voted based on Scripture and apostolic tradition, not imperial pressure.",
      "Councils create doctrine versus defining doctrine — misunderstanding that Nicaea didn't invent new teaching but formally defined what the church already believed against the novel claims of Arius.",
    ],
    sdaResponse:
      "Pre-Nicene writings overwhelmingly affirm Christ's deity. Ignatius of Antioch (c. 108 AD) wrote 'our God, Jesus Christ' (Ephesians 1:1). Justin Martyr (c. 150) argued Christ was the divine Logos present at creation. Irenaeus (c. 180) taught that the Son is fully God. Tertullian (c. 210) coined the term 'Trinity' to describe what Christians already believed. The Didache (c. 90-100 AD) baptizes 'in the name of the Father, Son, and Holy Spirit' — long before Nicaea. Constantine actually initially favored the Arian position and was baptized by an Arian bishop on his deathbed. The 318 bishops at Nicaea voted overwhelmingly (all but 2) to affirm Christ's full deity — not because of political pressure, but because it reflected the apostolic faith handed down from the beginning. SDAs affirm the biblical Trinity not because of Nicaea, but because Scripture teaches it (Matt 28:19; 2 Cor 13:14; John 1:1-3, 14).",
  },
  {
    id: "sm-muslim-muhammad-prophesied-bible",
    title: "Muhammad Was Prophesied in the Bible",
    argument:
      "Moses prophesied Muhammad in Deuteronomy 18:18 — 'I will raise up a prophet like you from among their brethren.' Since Ishmael was the brother of Isaac, 'brethren' refers to Arabs, and Muhammad is the fulfillment. Jesus also prophesied Muhammad in John 14:16-17 where the 'Paraclete' (comforter/advocate) is actually 'Periclutos' (praised one), which is the meaning of 'Ahmad/Muhammad.'",
    hiddenAssumptions: [
      "A prophet 'like Moses' must be a non-Israelite — ignoring that Deuteronomy 18:15 specifies 'from among you, from your brothers' (i.e., fellow Israelites), and that the New Testament explicitly identifies Jesus as this prophet (Acts 3:22-23; 7:37).",
      "Paraclete equals Ahmad — a textual claim with zero manuscript evidence; no Greek manuscript of John reads 'Periclutos,' and the Paraclete is identified as the Holy Spirit in the very same passage (John 14:26).",
      "Context doesn't matter — isolating verses from their surrounding passages to force an interpretation that contradicts the plain reading.",
    ],
    sdaResponse:
      "Deuteronomy 18:15 reads 'from among you, from your brothers' — Moses is speaking to Israel, and the prophet will arise from Israel, not from the Ishmaelite/Arab line. Acts 3:22-23 and Acts 7:37 explicitly identify Jesus as the fulfillment of this prophecy. As for John 14:16, the text plainly identifies the Paraclete as 'the Spirit of truth' (14:17) and 'the Holy Spirit' (14:26) who would 'dwell in you' — language inapplicable to a human prophet born 600 years later. No Greek manuscript in existence reads 'Periclutos' instead of 'Parakletos.' The prophecy was fulfilled at Pentecost (Acts 2). SDAs hold that the Bible is its own interpreter — Scripture interprets Scripture — and these passages have clear, contextual fulfillments in Jesus and the Holy Spirit, not in Muhammad.",
  },
  {
    id: "sm-muslim-quran-superior-preservation",
    title: "Qur'anic Preservation Is Superior",
    argument:
      "The Qur'an has been preserved perfectly since it was revealed — every letter, every vowel mark — through an unbroken chain of oral transmission (isnad) backed by written copies. This miraculous preservation proves it is from God. The Bible, by contrast, was compiled centuries after its authors lived, with no chain of transmission, and has been edited by unknown scribes.",
    hiddenAssumptions: [
      "Oral transmission guarantees perfection — ignoring that the early Muslim community acknowledged variant readings, and that Uthman's standardization involved destroying competing codices precisely because differences existed.",
      "The Qur'an was compiled immediately — ignoring that the Qur'an was compiled into a single codex under Abu Bakr after Muhammad's death (Sahih al-Bukhari 6:61:509) and standardized under Uthman, with rival versions burned.",
      "Biblical manuscripts lack a chain of transmission — ignoring the continuous manuscript tradition, early church fathers who quoted extensively from the New Testament (allowing reconstruction of virtually the entire NT from patristic quotations alone), and the thousands of manuscripts spanning many centuries.",
    ],
    sdaResponse:
      "The history of the Qur'an's compilation is more complex than the claim suggests. After Muhammad's death, various companions held different collections with variant readings. Caliph Uthman standardized one version and ordered all others burned (Sahih al-Bukhari 6:61:510). The Sana'a manuscripts, discovered in 1972, contain a lower text that differs from the standard Uthmanic text. The Qira'at tradition acknowledges variant readings across the seven (or ten) canonical readings. By contrast, the Bible's thousands of manuscripts were never destroyed — they were preserved, compared, and studied openly. Church fathers quoted the New Testament so extensively that scholars can reconstruct the vast majority of the text from their writings alone. SDAs affirm that God preserved His Word not through the destruction of variants but through the abundance of witnesses: 'The grass withers, the flower fades, but the word of our God stands forever' (Isaiah 40:8).",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "mg-muslim-historical-skepticism",
    name: "Historical Skepticism",
    description:
      "Casting blanket doubt on all biblical manuscripts to avoid textual arguments. Rather than engaging with specific evidence, the interlocutor dismisses the entire biblical manuscript tradition as unreliable, creating a fog of skepticism that avoids any concrete discussion.",
    example:
      "'How can you trust a book that's been copied thousands of times over thousands of years? It's basically a game of telephone.' This sweeping dismissal sidesteps the fact that the biblical manuscript tradition is the most well-attested of any ancient text.",
    detectionTip:
      "Listen for blanket dismissals without specific evidence. Ask: 'Which specific passage do you believe is corrupted, and what is the manuscript evidence for that?' Force the conversation from vague suspicion to concrete claims that can be examined.",
  },
  {
    id: "mg-muslim-semantic-traps",
    name: "Semantic Traps",
    description:
      "Redefining terms like 'Son of God' to mean literal biological offspring to make the Christian position sound absurd or blasphemous. By importing a physical/sexual meaning into a title that Jews and Christians have always understood relationally and ontologically, the objector creates a straw man.",
    example:
      "'You Christians believe God had a wife and a child — astaghfirullah! How can the Creator have a son?' This redefines 'Son of God' as biological procreation, which no Christian has ever taught.",
    detectionTip:
      'When a term is being redefined in a way no Christian has ever used it, name the tactic directly: "You are redefining our term. Let me explain what Christians actually mean by \'Son of God\' — an eternal relationship within the Godhead, not biological reproduction."',
  },
  {
    id: "mg-muslim-question-traps",
    name: "Question Traps",
    description:
      "Rapid-fire questions designed to overwhelm rather than seek genuine answers. The goal is not understanding but creating the impression that Christianity has no answers. If you answer one question, three more are fired before you can finish.",
    example:
      "'Who wrote the Gospels? When were they written? Why are there contradictions? Why four Gospels and not one? Did Jesus speak Greek? Why isn't the original Aramaic preserved? How do you know Paul didn't invent Christianity?' — all in a single breath, with no pause for response.",
    detectionTip:
      "Stop the barrage immediately: 'I'll address each question, but one at a time. Let's start with your first question and deal with it thoroughly before moving on.' A truth-seeker will accept this; a debater using mind games will resist it.",
  },
  {
    id: "mg-muslim-appeal-to-arabic",
    name: "Appeal to Arabic",
    description:
      "Insisting that arguments are invalid unless you read classical Arabic, effectively shifting the conversation away from evidence and into a linguistic gatekeeping exercise. This tactic implies that only Arabic speakers can evaluate truth claims, shielding the Qur'an from scrutiny by non-Arabic speakers.",
    example:
      "'You can't understand the Qur'an unless you read it in Arabic. Your translation is wrong. The beauty and miracle of the Qur'an can only be experienced in the original Arabic.' This moves the goalpost from evidence to linguistic credentials.",
    detectionTip:
      "Point out the double standard: 'Do you read Koine Greek and Biblical Hebrew? If linguistic access is required for evaluating scripture, then you cannot critique the Bible either. Truth claims must be evaluable by all people, not locked behind a language barrier — otherwise God's message is inaccessible to most of humanity.'",
  },
  {
    id: "mg-muslim-emotional-blackmail",
    name: "Emotional Blackmail via Blasphemy Charges",
    description:
      "Responding to theological arguments with expressions of extreme shock, horror, or offense — invoking 'astaghfirullah' (God forgive), labeling statements as 'kufr' (disbelief) or 'shirk' (idolatry) — to make the Christian feel guilty for stating their beliefs and to shut down rational discussion through emotional pressure.",
    example:
      "'How dare you say God has a son — astaghfirullah! This is the worst blasphemy! You are committing shirk!' This replaces argument with emotional intensity, making the Christian feel they must apologize rather than reason.",
    detectionTip:
      "Recognize that expressing your sincere biblical beliefs is not an attack on anyone. Respond calmly: 'I understand this is offensive to you, and I respect your sincerity. But being offended by a claim doesn't make it false. Let's examine the evidence together respectfully.'",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "fl-muslim-genetic-fallacy",
    name: "Genetic Fallacy",
    definition:
      "Dismissing a claim based on its origin rather than its content. In this context: 'The Bible was written by humans, so it can't be God's Word' — judging the message by the messenger while ignoring the doctrine of divine inspiration through human instruments.",
    example:
      "'Paul was just a man with his own opinions — how can you treat his letters as God's Word? He was a former persecutor of Christians who invented his own theology.'",
    counterMove:
      "The Qur'an itself was written down by human scribes (Zayd ibn Thabit and others) and compiled by human caliphs. By this logic, the Qur'an also fails the test. SDAs affirm that God used human instruments to convey divine truth — 'holy men of God spoke as they were moved by the Holy Spirit' (2 Peter 1:21). The human medium does not negate the divine message, just as a letter delivered by a postman is still the sender's message.",
  },
  {
    id: "fl-muslim-selective-skepticism",
    name: "Selective Skepticism",
    definition:
      "Applying rigorous historical criticism to the Bible while exempting the Qur'an from the same scrutiny. Demanding manuscript evidence, chain of custody, and authorial verification for biblical texts while accepting the Qur'an's compilation history on faith alone.",
    example:
      "'Show me the original manuscript of Matthew in Jesus' handwriting!' — while never applying the same demand to the Qur'an (which has no manuscript in Muhammad's hand, since he was reportedly illiterate, and the earliest full manuscripts postdate him by decades).",
    counterMove:
      "Apply the same standard consistently: 'If you require autograph manuscripts, then produce the original Qur'an in Muhammad's hand. If you accept the Qur'an's preservation through human compilation and copying, extend the same courtesy to the Bible's well-documented manuscript tradition — which is far more extensive and transparent than the Qur'an's.'",
  },
  {
    id: "fl-muslim-equivocation",
    name: "Equivocation on 'Corruption'",
    definition:
      "Redefining 'corruption' (tahrif) to mean any textual variant whatsoever, then claiming the Qur'an is variant-free. This equivocates between 'minor copyist variations that affect no doctrine' and 'deliberate, systematic falsification of the message.'",
    example:
      "'There are 400,000 variants in the New Testament — it's been corrupted!' — while defining 'perfectly preserved' for the Qur'an in a way that ignores the Qira'at variant readings, the Sana'a manuscripts, and the destruction of Uthman's rival codices.",
    counterMove:
      "Define terms precisely: 'What do you mean by corruption? If any textual variant = corruption, then the Qira'at tradition means the Qur'an is also corrupted by your own definition. If corruption means the core message was changed, show me which core Christian doctrine is absent from the manuscript tradition.' Demand consistency in definitions.",
  },
  {
    id: "fl-muslim-tu-quoque",
    name: "Tu Quoque (Whataboutism)",
    definition:
      "When internal problems with the Qur'an or Islamic history are raised, deflecting by pointing to perceived problems with the Bible rather than addressing the issue. This is the 'but what about your book?' defense that avoids engaging with the actual objection.",
    example:
      "'The Qur'an says the earth is flat—' 'But your Bible says the earth has four corners!' Rather than addressing the Qur'anic claim, the response deflects to the Bible. Even if the Bible did have errors, that would not resolve the problem in the Qur'an.",
    counterMove:
      "Name the deflection: 'We can discuss biblical passages separately. Right now, we are examining this specific claim about the Qur'an. Even if the Bible had the same issue, that wouldn't resolve the problem for the Qur'an — two wrongs don't make a right. Let's address one issue at a time.'",
  },
  {
    id: "fl-muslim-appeal-to-popularity",
    name: "Appeal to Popularity / Growth",
    definition:
      "Arguing that Islam's rapid growth or large number of adherents proves it is the true religion. This conflates popularity with truth — a logical fallacy regardless of which religion employs it.",
    example:
      "'Islam is the fastest-growing religion in the world — over 1.8 billion people can't be wrong! This proves Allah is spreading His truth.'",
    counterMove:
      "Truth is not determined by vote count. Christianity is currently the world's largest religion. Historically, the majority has often been wrong (Jesus said 'narrow is the way,' Matt 7:14). Growth can be driven by birth rates, cultural factors, political expansion, or genuine conviction — none of which validate or invalidate truth claims. 'Wide is the gate and broad is the way that leads to destruction, and many enter by it' (Matt 7:13).",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "tawhid",
    title: "Answering Tawhid: The Biblical Case for Triune Monotheism",
    sdaPosition:
      "SDAs are uncompromising monotheists. We worship one God who exists eternally as three co-equal, co-eternal Persons: Father, Son, and Holy Spirit. This is not tritheism (three gods) nor modalism (one God wearing three masks) but triune monotheism — one divine Being in three Persons. The Hebrew Shema (Deut 6:4) uses 'echad' (compound unity), not 'yachid' (absolute singularity). The Trinity is not a Greek philosophical invention but a truth woven through the entire biblical narrative from Genesis ('Let Us make man') to Revelation ('Grace from Him who is, and the seven Spirits, and Jesus Christ').",
    keyScriptures: [
      "Deuteronomy 6:4 — 'Hear, O Israel: The LORD our God, the LORD is one [echad].' The word echad denotes compound unity (cf. Gen 2:24, 'one flesh'; Gen 11:6, 'one people').",
      "Isaiah 48:16 — 'And now the Lord GOD has sent Me, and His Spirit.' Three Persons in one verse: the Lord GOD (Father), Me (the Speaker/Son), and His Spirit — in the Old Testament.",
      "Matthew 28:19 — 'Baptizing them in the name [singular] of the Father and of the Son and of the Holy Spirit.' One name, three Persons — the baptismal formula given by Jesus Himself.",
      "John 1:1-3, 14 — 'In the beginning was the Word, and the Word was with God, and the Word was God ... and the Word became flesh.' The Word (Jesus) is both distinct from God and identified as God.",
    ],
    counterArguments: [
      "The Hebrew word 'echad' in the Shema does NOT mean absolute singularity. It means 'one' in the sense of a unified whole. If God intended to communicate absolute mathematical oneness, the word 'yachid' was available (used in Gen 22:2 for Abraham's 'only' son). God chose 'echad' — compound unity.",
      "The Old Testament contains plural divine self-references: 'Let Us make man in Our image' (Gen 1:26), 'the man has become like one of Us' (Gen 3:22), 'let Us go down' (Gen 11:7). These are not 'plural of majesty' — that convention does not exist in Biblical Hebrew verbs.",
      "The Angel of the LORD in the Old Testament is both identified as distinct from YHWH and called YHWH (Gen 16:7-13; 22:11-18; Exod 3:2-6). This 'two powers in heaven' theology was recognized in early Judaism before Christianity.",
      "Islam's strict unitarian monotheism actually creates theological problems: How did God love before creation if He is a solitary monad? Love requires an 'other.' The Trinity reveals that God is inherently relational — love existed eternally within the Godhead (John 17:24).",
    ],
    closingStatement:
      "The God of the Bible is not less than one — He is more than what human mathematics can contain. He is the God who is love (1 John 4:8), and love requires relationship. The Trinity is not a contradiction of monotheism but its deepest expression: one God, eternally existing in the perfect communion of Father, Son, and Holy Spirit.",
  },
  {
    subjectId: "final-prophethood",
    title: "Answering Final Prophethood: Jesus Is Greater Than All Prophets",
    sdaPosition:
      "SDAs affirm that Jesus Christ is not merely a prophet but the eternal Son of God — the Creator, Sustainer, and Redeemer of all things. He is the One to whom all prophets pointed (Luke 24:27, 44; John 5:39). Muhammad is not recognized as a biblical prophet because his teachings contradict the established biblical revelation — denying Christ's deity, crucifixion, and resurrection. The biblical test of a prophet (Deut 13:1-5; 18:20-22; Isa 8:20) disqualifies any claimant whose message contradicts prior revelation.",
    keyScriptures: [
      "Hebrews 1:1-3 — 'God, who at various times and in various ways spoke in time past to the fathers by the prophets, has in these last days spoken to us by His Son ... who is the brightness of His glory and the express image of His person.' Jesus is the final and supreme revelation — not a prophet among prophets but the Son above all prophets.",
      "John 5:39 — 'You search the Scriptures, for in them you think you have eternal life; and these are they which testify of Me.' All Scripture points to Jesus, not to a subsequent prophet.",
      `Deuteronomy 13:1-3 — 'If a prophet ... gives you a sign ... saying, "Let us go after other gods" ... you shall not listen.' Any prophet whose God contradicts the God revealed in Scripture is a false prophet by biblical definition.`,
      "Galatians 1:8 — 'Even if we, or an angel from heaven, preach any other gospel to you than what we have preached to you, let him be accursed.' Paul anticipated the possibility of a later angelic revelation (cf. Jibril/Gabriel in Islamic tradition) contradicting the gospel and preemptively warned against it.",
    ],
    counterArguments: [
      "The Bible's own test of a prophet (Deuteronomy 18:20-22 and 13:1-5) requires that a true prophet's message be consistent with previously established revelation. Muhammad's message contradicts the Bible on the deity of Christ, the crucifixion, the resurrection, the Trinity, and salvation by grace — all central biblical teachings.",
      "Jesus is not merely a prophet in the biblical witness — He is the One all prophets serve. He existed before Abraham (John 8:58), created all things (John 1:3; Col 1:16), and sustains the universe (Heb 1:3). No prophet in the Bible claims these attributes.",
      "The Bible warns specifically against accepting a different gospel delivered by an angel (Galatians 1:8). Islamic tradition holds that the Qur'an was delivered by the angel Jibril (Gabriel). If its content contradicts the established biblical gospel, it falls precisely under this warning.",
      "The prophecy of Deuteronomy 18:15-18 specifies a prophet 'from among your brothers' — fellow Israelites. The New Testament identifies Jesus as this prophet (Acts 3:22-23; 7:37). Muhammad was not an Israelite and cannot fulfill this prophecy contextually.",
    ],
    closingStatement:
      "Hebrews 1 settles the question: God's final Word is not another prophet but His own Son. Jesus did not come to announce God's message — He IS God's message. 'He who has seen Me has seen the Father' (John 14:9). No subsequent messenger can supersede the Creator Himself.",
  },
  {
    subjectId: "quran-supremacy",
    title: "Answering Qur'an Supremacy: The Bible's Unmatched Manuscript Heritage",
    sdaPosition:
      "SDAs affirm that the Bible — the 66 books of the Old and New Testaments — is the inspired, authoritative, and trustworthy Word of God, preserved through an unparalleled manuscript tradition. With over 5,800 Greek NT manuscripts, 10,000+ Latin manuscripts, and thousands more in other languages — plus extensive quotations from early Church Fathers — the New Testament is the most well-attested document of antiquity. The claim that the Qur'an supersedes or corrects the Bible contradicts the Qur'an's own injunctions to consult the earlier scriptures (Surah 10:94; 5:47, 68).",
    keyScriptures: [
      "Isaiah 40:8 — 'The grass withers, the flower fades, but the word of our God stands forever.' God Himself guarantees the preservation of His Word.",
      "Matthew 24:35 — 'Heaven and earth will pass away, but My words will not pass away.' Jesus staked His authority on the endurance of His own words.",
      "1 Peter 1:25 — 'But the word of the Lord endures forever. And this is the word which by the gospel was preached to you.' The apostolic message is identified with the eternal Word.",
      "Psalm 12:6-7 — 'The words of the LORD are pure words, like silver tried in a furnace of earth, purified seven times. You shall keep them, O LORD, You shall preserve them from this generation forever.'",
    ],
    counterArguments: [
      "The Qur'an itself testifies to the authority of the earlier scriptures. Surah 10:94 says: 'If you are in doubt about what We have revealed to you, ask those who have been reading the Book before you.' Surah 5:47 says: 'Let the People of the Gospel judge by what Allah has revealed in it.' If the Bible was already corrupted by Muhammad's time, why does the Qur'an direct people to consult it?",
      "The Bible's manuscript tradition is unmatched in the ancient world. Homer's Iliad, the second-most attested ancient text, has about 1,800 manuscripts. The New Testament has over 5,800 Greek manuscripts alone. The earliest NT fragments (P52, P66, P75) date to within decades of the originals — a gap far smaller than for any other ancient document.",
      "The Qur'an's own compilation history undermines the claim of perfect preservation. Muhammad died without a compiled Qur'an. It was collected under Abu Bakr, standardized under Uthman (who burned rival codices), and the dot/vowel system was added later. The Sana'a manuscripts show textual differences from the Uthmanic standard.",
      "If the omnipotent God of the Qur'an could not preserve His own earlier revelations (Torah, Psalms, Gospel), what guarantee is there that He preserved the Qur'an? A God who fails to preserve His word once is, by this logic, unreliable. SDAs affirm that the God who inspired Scripture also preserved it — 'Your word I have hidden in my heart' (Psalm 119:11).",
    ],
    closingStatement:
      "The Bible does not need the Qur'an to validate it — it stands on its own extraordinary manuscript foundation and the testimony of the Holy Spirit in the hearts of believers. The word of our God stands forever (Isa 40:8), not because humans protected it, but because the living God who spoke it also preserved it across millennia.",
  },
  {
    subjectId: "injil-corruption",
    title: "Answering Injil Corruption: The Gospels Are the Authentic Record of Jesus",
    sdaPosition:
      "SDAs affirm that the four canonical Gospels — Matthew, Mark, Luke, and John — are the inspired, historical record of Jesus' life, death, and resurrection. The Islamic claim that an 'original Injil' existed as a single book given to Jesus (like the Qur'an was supposedly given to Muhammad) misunderstands the nature of the Gospels. Jesus did not receive a 'book' — He IS the Word (John 1:1, 14). The Gospels are eyewitness or closely sourced accounts of what the living Word said and did, written within the lifetime of eyewitnesses.",
    keyScriptures: [
      "Luke 1:1-4 — 'Inasmuch as many have undertaken to compile a narrative ... just as those who from the beginning were eyewitnesses ... it seemed good to me also, having followed all things closely for some time past, to write an orderly account.' Luke describes his Gospel as careful historical investigation based on eyewitness testimony.",
      "John 21:24 — 'This is the disciple who is bearing witness about these things, and who has written these things, and we know that his testimony is true.' John's Gospel claims direct eyewitness authorship.",
      "2 Peter 1:16 — 'We did not follow cleverly devised myths when we made known to you the power and coming of our Lord Jesus Christ, but we were eyewitnesses of His majesty.'",
      "1 John 1:1-3 — 'That which was from the beginning, which we have heard, which we have seen with our eyes, which we looked upon and have touched with our hands ... we proclaim also to you.'",
    ],
    counterArguments: [
      "The concept of an 'original Injil' as a single book given to Jesus has no historical evidence whatsoever — no manuscript, no fragment, no quotation, no reference in any ancient source. It is a theological assumption from the Qur'an imposed onto history, not a conclusion drawn from evidence.",
      "The canonical Gospels were written within 30-65 years of Jesus' death, during the lifetime of eyewitnesses who could correct errors. Paul's letters, which affirm the crucifixion, resurrection, and deity of Christ, date to the 50s AD — only 20 years after the events. This is extraordinarily early by ancient historical standards.",
      "The early Church Fathers extensively quoted the four Gospels, demonstrating their text was stable and known from the earliest period. Irenaeus (c. 180 AD) specifically argues for exactly four Gospels. The Gospel text cited by Church Fathers matches what we have today.",
      "If the Injil was corrupted, when did this happen? Before Muhammad (7th century)? Then why does the Qur'an tell Christians to 'judge by what Allah has revealed' in the Gospel (Surah 5:47)? After Muhammad? Then the thousands of pre-7th century manuscripts — including complete Bibles like Codex Sinaiticus (c. 350 AD) and Codex Vaticanus (c. 325 AD) — preserve the 'uncorrupted' text, and it teaches everything Islam denies.",
    ],
    closingStatement:
      "There is no 'lost Injil.' The Gospels are the Injil — the good news of Jesus Christ, the Son of God (Mark 1:1). They are anchored in eyewitness testimony, confirmed by archaeology, attested by thousands of manuscripts, and sealed by the blood of martyrs who died for what they saw, not what they invented. The Word became flesh (John 1:14), and His story has been faithfully preserved.",
  },
  {
    subjectId: "jesus-in-islam",
    title: "Answering Jesus in Islam: The Biblical Jesus vs. the Qur'anic Isa",
    sdaPosition:
      "SDAs affirm the full biblical portrait of Jesus Christ: eternal Son of God (John 1:1-3), born of a virgin (Isa 7:14; Matt 1:23), sinless life (Heb 4:15; 2 Cor 5:21), substitutionary death on the cross (Isa 53; 1 Cor 15:3), bodily resurrection (1 Cor 15:4-8), ascension to heaven (Acts 1:9), high-priestly ministry in the heavenly sanctuary (Heb 8:1-2), and imminent second coming in glory (Rev 1:7; Matt 24:30). The Qur'anic Isa — who denies his deity, was not crucified, and did not rise — is a 7th-century theological construction that contradicts the earliest historical sources about Jesus by 600 years.",
    keyScriptures: [
      "John 1:1-3, 14 — 'In the beginning was the Word, and the Word was with God, and the Word was God. He was in the beginning with God. All things were made through Him ... And the Word became flesh and dwelt among us.' Jesus is the eternal Creator-God incarnate.",
      "1 Corinthians 15:3-8 — 'Christ died for our sins according to the Scriptures, and He was buried, and He rose again the third day according to the Scriptures, and He was seen by Cephas, then by the twelve ... then by over five hundred brethren at once.' The crucifixion and resurrection are the earliest and most widely attested facts about Jesus.",
      "Isaiah 53:5-6 — 'He was wounded for our transgressions, He was bruised for our iniquities; the chastisement for our peace was upon Him, and by His stripes we are healed.' Written 700 years before Christ, this messianic prophecy describes a suffering, dying Messiah — exactly what Islam denies.",
      "Hebrews 4:14-15 — 'We have a great high priest who has passed through the heavens, Jesus the Son of God ... one who in every respect has been tempted as we are, yet without sin.' Jesus is now our High Priest in the heavenly sanctuary — a truth central to SDA theology.",
    ],
    counterArguments: [
      "The Qur'an was written 600+ years after Jesus. The New Testament documents were written within 20-65 years of His life by eyewitnesses or their close associates. By any historical standard, the earlier sources closer to the events are more reliable than a text composed six centuries later in a different language, culture, and geographic region.",
      "The crucifixion of Jesus is one of the most historically certain facts of antiquity. It is attested not only by all four Gospels and Paul's letters but by non-Christian sources: Tacitus (Annals 15.44), Josephus (Antiquities 18.3.3), the Talmud (Sanhedrin 43a), and Lucian of Samosata. The Qur'an's denial (Surah 4:157) stands against the unanimous testimony of ancient history.",
      "The Islamic Jesus (Isa) denies his own deity in the Qur'an (5:116-117), but the biblical Jesus accepts worship (Matt 14:33; 28:9, 17), claims the divine name 'I AM' (John 8:58), and says 'I and the Father are one' (John 10:30). These are not compatible portraits — one must be historically false, and the earlier, multiply-attested sources favor the biblical account.",
      "Islam claims Jesus was not crucified but that it was 'made to appear so' (Surah 4:157). This means Allah deliberately deceived the eyewitnesses, the disciples, and the entire world for 600 years — then corrected the record through one man in Arabia. This makes God the author of history's greatest deception, contradicting both the Bible and the Qur'an's own claim that Allah does not deceive believers.",
    ],
    closingStatement:
      "The Jesus of history is the Jesus of the Bible — crucified under Pontius Pilate, risen on the third day, and now ministering as our High Priest in the heavenly sanctuary. He is not merely a prophet who submitted to God; He is the God to whom all prophets submitted. 'For in Him dwells all the fullness of the Godhead bodily' (Colossians 2:9). He invites everyone — including our Muslim friends — to know Him not as a distant historical figure, but as a living Savior: 'Come to Me, all you who labor and are heavy laden, and I will give you rest' (Matthew 11:28).",
  },
];

// ── Modules ─────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  // ── Module 1: Tawhid ──────────────────────────────────────────────────────
  {
    id: "mod-muslim-tawhid",
    subjectId: "tawhid",
    title: "Module 1: Tawhid — Answering Absolute Monotheism with Triune Monotheism",
    doctrineBrief:
      "Tawhid is the central doctrine of Islam — the absolute, indivisible oneness of God (Allah). It rejects any 'partners' alongside God, categorizing the Trinity as 'shirk' (associating partners with God), the one unforgivable sin in Islam (Surah 4:48). Islam teaches that God is a singular monad — utterly alone in His essence, with no internal plurality. Christians who worship Jesus as God are viewed as polytheists. Understanding tawhid is essential because it is the foundation from which all other Islamic objections to Christianity flow. If you can demonstrate that the Trinity is genuinely monotheistic — and even more deeply monotheistic than tawhid — you undercut the root of every other argument.",
    steelmanArguments: [
      steelmanArguments[0], // Trinity is illogical
      steelmanArguments[3], // Nicaea invented the Trinity
    ],
    hiddenAssumptions: [
      "Unity must mean mathematical singularity — conflating 'one' with 'solitary.'",
      "Human logic exhaustively comprehends the nature of an infinite God.",
      "The Hebrew 'echad' is equivalent to 'yachid' — ignoring the linguistic evidence for compound unity.",
      "Monotheism requires unitarianism — an assumption, not a proven axiom.",
      "The Trinity was borrowed from paganism — despite pagan trinities being fundamentally different (three separate gods, not one God in three Persons).",
    ],
    mindGames: [mindGames[1], mindGames[4]], // Semantic traps, Emotional blackmail
    fallacies: [fallacies[0], fallacies[4]], // Genetic fallacy, Appeal to popularity
    counterStrategy: counterStrategies[0],
    debateSimLink: "muslim",
    debriefPrompt:
      "Reflect on your defense of Triune Monotheism. Were you able to explain the difference between 'echad' and 'yachid'? Did you address the 'Nicaea invented the Trinity' claim with pre-Nicene evidence? How did you handle the emotional charge of being called a polytheist? What could you improve for next time?",
  },

  // ── Module 2: Final Prophethood ───────────────────────────────────────────
  {
    id: "mod-muslim-final-prophethood",
    subjectId: "final-prophethood",
    title: "Module 2: Final Prophethood — Why Jesus Is Greater Than Any Prophet",
    doctrineBrief:
      "Islam teaches that Muhammad is the 'Seal of the Prophets' (Khatam an-Nabiyyin, Surah 33:40) — the final messenger from God who brought the complete and uncorrupted revelation. In this framework, Jesus (Isa) was a great prophet but only one in a long line, and his message was incomplete and later corrupted. The coming of Muhammad was necessary to restore God's truth. Muslims claim that both Moses (Deut 18:18) and Jesus (John 14:16) prophesied Muhammad's coming. SDA apologetics must demonstrate that Jesus is not merely a prophet but the eternal Son of God — the One to whom all prophets pointed — and that the so-called biblical prophecies of Muhammad are contextually misapplied.",
    steelmanArguments: [
      steelmanArguments[4], // Muhammad prophesied in the Bible
    ],
    hiddenAssumptions: [
      "Deuteronomy 18:15-18 refers to a non-Israelite prophet — ignoring the explicit 'from among you, from your brothers.'",
      "The Paraclete in John 14-16 is Muhammad — despite the text identifying him as the Holy Spirit (John 14:26) who would 'dwell in you' (14:17).",
      "Prophets are merely message-carriers — failing to recognize that Jesus is not a carrier of God's word but IS the Word (John 1:1).",
      "A later prophet can supersede an earlier one — even when the later message contradicts the earlier one on fundamental points.",
    ],
    mindGames: [mindGames[2], mindGames[0]], // Question traps, Historical skepticism
    fallacies: [fallacies[0], fallacies[3]], // Genetic fallacy, Tu quoque
    counterStrategy: counterStrategies[1],
    debateSimLink: "muslim",
    debriefPrompt:
      "Review your engagement on the prophethood question. Did you successfully show that Deuteronomy 18:15-18 is fulfilled in Jesus, not Muhammad? Were you able to demonstrate that the Paraclete is the Holy Spirit using the immediate context of John 14-16? How did you handle the Galatians 1:8 argument about angelic revelations? Did you maintain the distinction between Jesus as the Word and prophets as word-carriers?",
  },

  // ── Module 3: Qur'an Supremacy ────────────────────────────────────────────
  {
    id: "mod-muslim-quran-supremacy",
    subjectId: "quran-supremacy",
    title: "Module 3: Qur'an Supremacy — Defending Biblical Preservation and Authority",
    doctrineBrief:
      "The Islamic doctrine of Qur'anic supremacy rests on two claims: (1) the Qur'an is perfectly preserved in every letter since its revelation, and (2) all previous scriptures (Torah, Psalms, Gospels) have been corrupted beyond reliability. This dual claim creates a closed system — the Qur'an is the only trustworthy scripture, making it the judge of all others. SDA apologetics must challenge both pillars: demonstrating the Bible's extraordinary manuscript attestation while exposing the Qur'an's own complex textual history. The internal testimony of the Qur'an itself, which directs people to consult the earlier scriptures, is a powerful internal contradiction in the corruption narrative.",
    steelmanArguments: [
      steelmanArguments[1], // Bible is corrupted
      steelmanArguments[5], // Qur'anic preservation is superior
    ],
    hiddenAssumptions: [
      "Any textual variant equals corruption — a standard that, if applied consistently, would also 'corrupt' the Qur'an.",
      "The Qur'an has zero textual variants — historically false (Qira'at readings, Sana'a manuscripts, Uthman's destruction of rival codices).",
      "Textual criticism is the enemy of Scripture — when in fact it is the tool that confirms the text's reliability.",
      "The Bible was compiled haphazardly by unknown editors — ignoring the careful, documented process of canonization and the role of prophetic authority.",
      "Perfect preservation requires a single, authoritative recension — ironically, this describes Uthman's method (destroy competitors) rather than the Bible's (preserve all witnesses).",
    ],
    mindGames: [mindGames[0], mindGames[3]], // Historical skepticism, Appeal to Arabic
    fallacies: [fallacies[1], fallacies[2]], // Selective skepticism, Equivocation
    counterStrategy: counterStrategies[2],
    debateSimLink: "muslim",
    debriefPrompt:
      "Assess your defense of biblical preservation. Were you able to articulate why the abundance of manuscripts is a strength rather than a weakness? Did you raise the Qur'an's own textual history (Uthman's codex, Sana'a manuscripts, Qira'at) effectively? How did you handle the 'appeal to Arabic' deflection? Did you use the Qur'an's own testimony about previous scriptures (Surah 10:94; 5:47) as an internal argument?",
  },

  // ── Module 4: Injil Corruption ────────────────────────────────────────────
  {
    id: "mod-muslim-injil-corruption",
    subjectId: "injil-corruption",
    title: "Module 4: Injil Corruption — Proving the Gospels Are the Authentic Record of Jesus",
    doctrineBrief:
      "Islam teaches that Jesus received a scripture called the 'Injil' (Gospel) — a single book, like the Qur'an, that contained God's revelation. Muslims claim this original Injil has been lost or corrupted, and what Christians possess today (the four Gospels) are human compositions that distort Jesus' message. This claim is historically unfounded — no evidence exists for a 'lost Injil' apart from the Qur'an's assumption. The canonical Gospels are rooted in eyewitness testimony, written within the apostolic era, and transmitted through thousands of manuscripts. SDA apologetics must demonstrate that the Gospels ARE the Injil — the authentic, preserved good news of Jesus Christ.",
    steelmanArguments: [
      steelmanArguments[1], // Bible is corrupted (applied to Gospels specifically)
    ],
    hiddenAssumptions: [
      "Jesus received a 'book' like Muhammad received the Qur'an — projecting Islamic prophetic models onto Jesus, who IS the Word rather than a receiver of words.",
      "A 'lost original' must have existed — an argument from silence with zero manuscript, archaeological, or historical evidence.",
      "The four Gospels are unreliable because they differ in details — confusing complementary perspectives with contradiction (four witnesses to a car accident will emphasize different details without contradicting each other).",
      "The canonical Gospels were chosen arbitrarily at Nicaea — a myth; the four Gospels were universally recognized long before Nicaea (Irenaeus, c. 180 AD, argued for exactly four).",
    ],
    mindGames: [mindGames[0], mindGames[2]], // Historical skepticism, Question traps
    fallacies: [fallacies[0], fallacies[1]], // Genetic fallacy, Selective skepticism
    counterStrategy: counterStrategies[3],
    debateSimLink: "muslim",
    debriefPrompt:
      "Evaluate your defense of the Gospels. Did you effectively challenge the 'lost Injil' claim by asking for evidence of its existence? Were you able to present the early dating of the Gospels and their eyewitness foundations? How did you handle rapid-fire 'question trap' challenges about Gospel authorship and dating? Did you explain why four complementary accounts are stronger than one, using the analogy of multiple witnesses?",
  },

  // ── Module 5: Jesus in Islam ──────────────────────────────────────────────
  {
    id: "mod-muslim-jesus-in-islam",
    subjectId: "jesus-in-islam",
    title: "Module 5: Jesus in Islam — Recovering the Biblical Christ from the Qur'anic Isa",
    doctrineBrief:
      "The Islamic portrait of Jesus (Isa ibn Maryam) diverges from the biblical portrait on virtually every major point. In the Qur'an, Jesus is a human prophet who denies his deity (5:116-117), was not crucified (4:157), did not rise from the dead as an atoning sacrifice, and prophesied Muhammad's coming (61:6). SDAs must demonstrate that the biblical Jesus — attested by earlier, multiply-sourced, eyewitness-based documents — is the historical Jesus. The Qur'an's Jesus is a 7th-century theological revision that contradicts the unanimous testimony of 1st-century sources, both Christian and non-Christian. At the heart of this module is the cross: Islam denies it; SDA Christianity is built upon it. The crucifixion and resurrection of Jesus Christ are the most well-attested events of antiquity, and they form the foundation of the gospel message and the SDA understanding of Christ's atoning ministry in the heavenly sanctuary.",
    steelmanArguments: [
      steelmanArguments[2], // Jesus never claimed deity
    ],
    hiddenAssumptions: [
      "Only an explicit 'I am God, worship me' counts as a deity claim — ignoring contextual, implicit claims that were unmistakable to Jesus' Jewish audience.",
      "The crucifixion is uncertain or legendary — despite it being attested by every ancient source, Christian and non-Christian alike.",
      "The Qur'an's account of Jesus (written 600 years later) is more reliable than the Gospels (written within decades of the events) — an extraordinary claim that reverses every principle of historical methodology.",
      "Jesus' submission to God's will proves he was a mere servant-prophet — ignoring that the Son's voluntary submission to the Father within the Trinity is a relational act, not an ontological demotion (Phil 2:5-11).",
    ],
    mindGames: [mindGames[1], mindGames[4]], // Semantic traps, Emotional blackmail
    fallacies: [fallacies[2], fallacies[3]], // Equivocation, Tu quoque
    counterStrategy: counterStrategies[4],
    debateSimLink: "muslim",
    debriefPrompt:
      "Reflect on your presentation of the biblical Jesus. Were you able to demonstrate Jesus' deity claims from the Gospels (I AM statements, accepting worship, forgiving sins)? Did you present the historical case for the crucifixion using both Christian and non-Christian sources? How did you handle the Qur'anic claim that Jesus was not crucified? Were you able to explain the SDA understanding of Christ's atoning sacrifice and heavenly sanctuary ministry as the ongoing significance of the cross? Did you maintain a compassionate, respectful tone while being unflinching on truth?",
  },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const muslimTraining: AATSAvatarTraining = {
  avatarId: "muslim",
  avatarName: "The Muslim",
  emoji: "\u262A\uFE0F",
  color: "border-green-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
