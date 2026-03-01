// ─── AATS: Pentecostal Avatar Training Data ──────────────────────────────────
// Comprehensive training curriculum for defending SDA faith against Pentecostal/Charismatic arguments.

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ─────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "tongues-as-evidence",
    title: "Tongues as Evidence of Spirit Baptism",
    description:
      "The claim that speaking in tongues (glossolalia) is the initial physical evidence of the baptism of the Holy Spirit, based on the pattern of Acts 2, 10, and 19.",
  },
  {
    id: "divine-healing-atonement",
    title: "Divine Healing in the Atonement",
    description:
      "The belief that physical healing is guaranteed in Christ's atoning sacrifice — Isaiah 53:5 ('by His stripes we are healed') applies to bodily healing, not just spiritual restoration.",
  },
  {
    id: "prosperity-covenant",
    title: "Prosperity as Covenant Blessing",
    description:
      "The Word of Faith teaching that financial prosperity and material blessing are the covenant right of every believer — rooted in Deuteronomy 28, 3 John 2, and Malachi 3:10.",
  },
  {
    id: "experience-vs-doctrine",
    title: "Experience vs. Doctrinal Intellectualism",
    description:
      "The charge that SDA-style Christianity is dry, intellectual, and Spirit-quenching — that true Christianity is defined by supernatural POWER (Acts 1:8), not systematic theology.",
  },
  {
    id: "oneness-theology",
    title: "Oneness Pentecostal Theology",
    description:
      "The Oneness Pentecostal position that God is one Person (Jesus), not three — that Father, Son, and Holy Spirit are modes or manifestations, and that baptism must be in 'Jesus' name only' (Acts 2:38).",
  },
  {
    id: "gifts-continuation",
    title: "Continuation of All Spiritual Gifts",
    description:
      "The argument that all gifts of the Spirit — tongues, prophecy, healing, miracles — are fully operative today and normative for every Spirit-filled congregation, against cessationism.",
  },
];

// ── Steelman Arguments ───────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "pentecostal-steelman-tongues-pattern",
    title: "Acts Establishes Tongues as the Normative Sign",
    argument:
      "In Acts 2, the disciples spoke in tongues when the Spirit fell. In Acts 10, Cornelius's household spoke in tongues — and this is what convinced Peter they had received the Spirit (Acts 10:46). In Acts 19, the Ephesian believers spoke in tongues when Paul laid hands on them. Three separate instances, three different contexts, one consistent pattern: the Spirit comes, tongues follow. This is not coincidence; it is divine precedent. Paul says, 'I wish you all spoke in tongues' (1 Cor 14:5). If tongues were not normative, why would Paul wish it for ALL believers? The SDA church has no tongues, no visible manifestation of Spirit baptism — and that silence speaks volumes about the absence of the Spirit's power.",
    hiddenAssumptions: [
      "Narrative examples in Acts are prescriptive for all Christians — assumes descriptive historical events establish binding theological norms.",
      "The absence of tongues equals the absence of the Spirit — ignores that the Spirit produces many fruits and gifts (Galatians 5:22-23, 1 Corinthians 12:4-11).",
      "Paul's wish in 1 Cor 14:5 is an imperative — but the same Paul says 'Do all speak in tongues?' (1 Cor 12:30, expected answer: NO).",
    ],
    sdaResponse:
      "Acts is narrative, not normative. In Acts 2, tongues were known languages (dialektos — Acts 2:6, 8) spoken to multilingual crowds, not ecstatic speech. In Acts 8, the Samaritans received the Spirit with NO mention of tongues. In Acts 9, Paul received the Spirit with NO tongues mentioned. The pattern is NOT consistent — it is selective. Paul himself asks, 'Do all speak in tongues?' and the grammatical construction (mē) demands the answer: NO (1 Cor 12:30). Paul's ranking in 1 Corinthians 12:28 places tongues LAST. His wish in 14:5 is immediately qualified: 'but even more that you prophesied.' The fruit of the Spirit (Galatians 5:22-23) — love, joy, peace, patience — is the TRUE evidence of the Spirit's indwelling, not a single spectacular gift. Jesus said, 'By their FRUITS you shall know them' (Matthew 7:20), not 'by their tongues.'",
  },
  {
    id: "pentecostal-steelman-healing",
    title: "Healing Is Guaranteed in the Atonement",
    argument:
      "Isaiah 53:5 says, 'By His stripes we ARE healed.' 1 Peter 2:24 repeats it: 'By whose stripes ye WERE healed.' Matthew 8:17 explicitly links Jesus' healings to Isaiah 53: 'He took our infirmities and bore our sicknesses.' If Christ bore our sicknesses on the cross just as He bore our sins, then healing is as certain as forgiveness. To deny healing is to deny the completeness of the Atonement. James 5:14-15 promises: 'The prayer of faith SHALL save the sick.' Not 'might' — SHALL. The problem is not God's willingness to heal but the church's lack of faith. SDAs talk about health reform and diet — but where are your healings? Where is the power?",
    hiddenAssumptions: [
      "Physical healing and spiritual healing are obtained on identical terms — ignores the 'already/not yet' eschatological tension in the New Testament.",
      "'By His stripes we are healed' must refer to physical healing — but 1 Peter 2:24's context is explicitly about sin: 'that we, having died to sins, might live for righteousness.'",
      "Lack of healing equals lack of faith — creates a cruel theology that blames the sick for their suffering.",
    ],
    sdaResponse:
      "Isaiah 53:5 in context speaks of spiritual healing: 'the chastisement for our PEACE was upon Him.' 1 Peter 2:24 explicitly frames it as moral restoration: 'that we, having died to SINS, might live for RIGHTEOUSNESS.' Matthew 8:17's quotation describes Jesus' earthly healing ministry, not a blanket atonement guarantee. If healing were guaranteed identically to forgiveness, then no Christian should ever die — yet Paul left Trophimus sick (2 Timothy 4:20), Paul himself had an unhealed thorn (2 Corinthians 12:7-9), and Timothy had chronic stomach illness (1 Timothy 5:23). God DOES heal — but sovereignly, not on demand. James 5:15 is a promise of God's faithful response to prayer, not a vending machine formula. The 'already/not yet' framework is key: full physical restoration awaits the resurrection (1 Corinthians 15:53-54). SDAs do not deny healing; we deny that blaming the sick for 'lack of faith' is the gospel.",
  },
  {
    id: "pentecostal-steelman-prosperity",
    title: "Financial Blessing Is God's Covenant Will",
    argument:
      "3 John 2: 'I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth.' Malachi 3:10: 'Bring ye all the tithes... and prove me now herewith... if I will not open you the windows of heaven and pour you out a blessing.' Deuteronomy 28 lists material blessings for obedience — blessed in the city, blessed in the field, blessed in your basket. Abraham was wealthy. Solomon was wealthy. Job was restored twofold. The Bible consistently associates faithfulness with material blessing. Poverty is a curse (Deuteronomy 28:15-68), not a virtue. SDAs tithe faithfully — so where is your Malachi 3 overflow? Perhaps your theology has boxed God into scarcity.",
    hiddenAssumptions: [
      "3 John 2 is a doctrinal statement — but it is a personal greeting, not a theological principle. 'I wish' (euchomai) is a letter-opening pleasantry.",
      "Old Testament covenant blessings transfer directly to New Testament believers — ignores the shift from national/material covenant to spiritual/global covenant.",
      "Wealth equals God's favor — Jesus said, 'How hard it is for the rich to enter the kingdom' (Mark 10:23). Paul said, 'Having food and raiment, let us be therewith content' (1 Timothy 6:8).",
    ],
    sdaResponse:
      "3 John 2 is a personal greeting — using it as a prosperity doctrine is like building theology from 'Dear Sir.' Deuteronomy 28 was a national covenant with theocratic Israel, not a personal wealth formula for individual Christians. Jesus explicitly warned against wealth theology: 'Woe unto you that are rich' (Luke 6:24). The apostles were largely poor (2 Corinthians 6:10 — 'as poor, yet making many rich'). Paul learned 'to be content in whatever state I am' (Philippians 4:11). Hebrews 11 lists heroes of faith who were destitute, afflicted, tormented — and says 'the world was not worthy of them.' The prosperity gospel inverts the cross: Jesus became POOR that we might become RICH in grace (2 Corinthians 8:9), not in portfolios. SDAs teach faithful stewardship and the health message — genuine prosperity is wholeness of body, mind, and spirit, not the accumulation of material goods.",
  },
  {
    id: "pentecostal-steelman-power-vs-doctrine",
    title: "The Early Church Was Defined by Power, Not Doctrine",
    argument:
      "Acts 1:8: 'Ye shall receive POWER when the Holy Spirit comes upon you.' Not 'ye shall receive correct theology.' The early church didn't have systematic theology textbooks — they had the FIRE. They healed the sick, cast out demons, raised the dead, spoke in tongues, prophesied. Paul said, 'My preaching was not with enticing words of man's wisdom, but in demonstration of the Spirit and of POWER' (1 Corinthians 2:4). The SDA church has excellent doctrine — I'll grant you that. But where is the POWER? You have 28 Fundamental Beliefs but no fire in the sanctuary. You have Ellen White but no Pentecost. You have the right day but the wrong atmosphere. 2 Timothy 3:5 warns about those 'having a form of godliness but denying the POWER thereof.' That's you.",
    hiddenAssumptions: [
      "Power and doctrine are opposites — ignores that the early church was deeply doctrinal (Acts 2:42: 'they continued steadfastly in the apostles' DOCTRINE').",
      "Spectacular manifestations are the measure of the Spirit's presence — ignores that the greatest evidence is transformed character (Galatians 5:22-23).",
      "The SDA church has no spiritual power — a sweeping generalization that dismisses the global impact, missions, and transformed lives within Adventism.",
    ],
    sdaResponse:
      "Acts 2:42 says the early church 'continued steadfastly in the apostles' DOCTRINE.' Power without doctrine is chaos — exactly what Paul corrected in Corinth, where tongues were causing confusion (1 Corinthians 14:33, 40). Paul insists: 'Let all things be done decently and in ORDER.' The SDA church does not oppose the Spirit's power — we oppose counterfeiting it. Jesus warned that in the last days, false prophets would show 'great signs and wonders' to deceive even the elect (Matthew 24:24). Revelation 13:13-14 predicts a power that 'does great wonders' to deceive the world. The test is not whether signs exist but whether they align with 'the law and the testimony' (Isaiah 8:20). Power divorced from truth is the devil's specialty — he appeared as a serpent performing wonders in Eden, and he will appear as an angel of light at the end (2 Corinthians 11:14). SDAs do not deny the Spirit; we test the spirits (1 John 4:1).",
  },
  {
    id: "pentecostal-steelman-oneness",
    title: "God Is One Person, Not Three",
    argument:
      "Deuteronomy 6:4: 'Hear, O Israel, the LORD our God is ONE LORD.' Isaiah 44:6: 'I am the first and I am the last; besides me there is no God.' Jesus said, 'I and my Father are one' (John 10:30) — not 'one of three.' Colossians 2:9: 'In Him dwelleth all the fulness of the Godhead bodily.' The Father, Son, and Holy Spirit are not three separate Persons — they are three manifestations of the ONE God, Jesus Christ. Acts 2:38 commands baptism 'in the NAME of Jesus Christ' — singular name, not 'Father, Son, and Holy Spirit.' The disciples NEVER baptized using the Trinitarian formula. The word 'Trinity' is not in the Bible. It was invented at the Council of Nicaea under Constantine's political pressure. You worship a pagan three-headed God.",
    hiddenAssumptions: [
      "'One' must mean 'one person' — but echad in Hebrew allows for compound unity (Genesis 2:24: man and woman become 'one' flesh).",
      "Acts 2:38 overrides Matthew 28:19 — but Matthew 28:19 is Jesus' own direct command.",
      "The Council of Nicaea invented the Trinity — historically false; Nicaea addressed Arianism, and Trinitarian language predates it by centuries (Tertullian, c. 200 AD; Ignatius, c. 110 AD).",
    ],
    sdaResponse:
      "The word 'Trinity' may not appear in Scripture, but neither does 'Bible' — that doesn't invalidate the concept. 'Echad' (one) in Deuteronomy 6:4 is the same word used in Genesis 2:24 where two become 'one' — compound unity, not absolute singularity (yachid). At Jesus' baptism (Matthew 3:16-17), THREE distinct Persons act simultaneously: the Son rises from the water, the Spirit descends as a dove, the Father speaks from heaven. In John 17:1, Jesus PRAYS to the Father — you cannot pray to yourself. Jesus says, 'I will ask the FATHER, and He will give you ANOTHER Helper' (John 14:16) — 'another' (allos) means another of the SAME kind, a distinct Person. Matthew 28:19 commands baptism 'in the NAME (singular) of the Father AND the Son AND the Holy Spirit' — one Name, three Persons. The earliest church fathers (Ignatius, Polycarp, Justin Martyr) were Trinitarian before Nicaea. The Oneness position collapses into modalism — a heresy condemned because it denies the relational reality within the Godhead that makes love itself eternal.",
  },
  {
    id: "pentecostal-steelman-gifts-continue",
    title: "All Gifts Continue — Cessationism Is Unbiblical",
    argument:
      "1 Corinthians 13:10 says the gifts cease 'when that which is perfect is come.' Cessationists claim 'the perfect' is the completed Bible canon — but that interpretation is NOWHERE in the text. 'The perfect' is Christ's return (1 Corinthians 1:7-8, Ephesians 4:13). Until Jesus comes back, the gifts continue. Joel 2:28-29 says in the LAST DAYS God will pour out His Spirit with prophecy, dreams, visions — the LAST days, not the FIRST days only. If SDAs believe in Ellen White as a prophet, you already accept continuing gifts — but then you reject tongues and healing? That's selective cessationism. Either all the gifts continue or none do. You can't have prophecy and reject tongues.",
    hiddenAssumptions: [
      "SDAs are cessationists — but SDAs officially affirm the continuation of spiritual gifts, including the gift of prophecy.",
      "Accepting all gifts means accepting all modern manifestations — ignores that biblical tongues were known languages (Acts 2:6-8), not ecstatic speech.",
      "Rejecting modern charismatic practices equals rejecting the Spirit — conflates discernment with denial.",
    ],
    sdaResponse:
      "SDAs are NOT cessationists. We believe all gifts continue — including prophecy, which we affirm in Ellen White's ministry. But we also believe in TESTING the gifts (1 John 4:1, 1 Thessalonians 5:21). Biblical tongues in Acts 2 were known languages (dialektos — Acts 2:6, 8), spoken to communicate the gospel to real people in real languages. Modern glossolalia — repetitive syllables with no linguistic structure — does not match the biblical pattern. Paul regulates tongues in 1 Corinthians 14: 'If there is no interpreter, let him keep silent' (v. 28). He limits tongues speakers to 'two or at most three' (v. 27). He insists 'God is not the author of confusion' (v. 33). The charismatic movement routinely violates every one of Paul's regulations. SDAs accept the gifts; we reject the counterfeits. Isaiah 8:20: 'To the law and to the testimony: if they speak not according to this word, it is because there is no light in them.'",
  },
];

// ── Mind Games ───────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "pentecostal-mg-experience-trump",
    name: "Experience Trumps Exegesis",
    description:
      "Using personal testimony of miracles, healings, and tongues to override scriptural analysis. 'I don't care what your Greek says — I FELT the fire.' This makes the debate about feelings vs. facts and puts the SDA on the defensive as cold and intellectual.",
    example:
      "\"You can argue theology all day, but I've seen cancer disappear, I've spoken in tongues, I've felt God's fire — have you? Your doctrine is correct but your experience is empty.\"",
    detectionTip:
      "Notice when testimony replaces argument. Ask: 'I don't doubt your experience, but how do we TEST it? Even Pharaoh's magicians performed miracles (Exodus 7:11).' Redirect to Scripture as the standard.",
  },
  {
    id: "pentecostal-mg-spiritual-dead",
    name: "The 'Spiritually Dead' Frame",
    description:
      "Framing any church without charismatic manifestations as 'spiritually dead' or 'having a form of godliness.' This weaponizes 2 Timothy 3:5 to shame non-charismatic churches into feeling inadequate or Spirit-abandoned.",
    example:
      "\"Your church has the truth on paper but no fire in the sanctuary. That's exactly what Paul warned about — a form of godliness denying the power.\"",
    detectionTip:
      "Note that 2 Timothy 3:5's context is about moral corruption (lovers of self, lovers of money, boasters) — not about the absence of tongues or miracles. The 'power' denied is the power of transformed CHARACTER, not spectacular gifts.",
  },
  {
    id: "pentecostal-mg-faith-blame",
    name: "Faith-Blame for Unanswered Prayer",
    description:
      "When healing doesn't occur, the blame is shifted to the sick person's lack of faith. This creates an unfalsifiable system: healing proves God's power, and non-healing proves YOUR failure — never the theology's failure.",
    example:
      "\"If you had enough faith, you would be healed. God's promises are yes and amen — the problem is on your end, not God's.\"",
    detectionTip:
      "Ask: 'Did Paul lack faith when God denied his thorn three times (2 Cor 12:7-9)? Did Trophimus lack faith when Paul left him sick (2 Tim 4:20)? Was Timothy's stomach problem a faith issue (1 Tim 5:23)?' The faith-blame game cannot survive apostolic counterexamples.",
  },
  {
    id: "pentecostal-mg-emotion-atmosphere",
    name: "Emotional Atmosphere as Validation",
    description:
      "Equating emotional worship intensity — shouting, falling, shaking, running — with the Holy Spirit's presence. The louder and more emotional the service, the more 'anointed' it supposedly is.",
    example:
      "\"When the Spirit moves, you can FEEL it. Your Sabbath services are so quiet — where is the Holy Ghost? God is not in the silence.\"",
    detectionTip:
      "Recall Elijah: God was not in the wind, earthquake, or fire — but in the 'still small voice' (1 Kings 19:11-12). Emotional intensity is not a barometer of the Spirit. Paul commands worship to be done 'decently and in order' (1 Corinthians 14:40).",
  },
];

// ── Fallacies ────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "pentecostal-fallacy-appeal-to-experience",
    name: "Appeal to Experience (Argumentum ad Experientia)",
    definition:
      "Using personal experience as decisive evidence for a theological claim, bypassing Scripture and logic.",
    example:
      "\"I spoke in tongues, therefore tongues is the evidence of Spirit baptism\" — the experience is used as proof of the doctrine, rather than Scripture establishing the doctrine which the experience must match.",
    counterMove:
      "Acknowledge the experience, then test it: 'Even if the experience is real, the question is whether it matches the BIBLICAL pattern. Pharaoh's magicians had real experiences too (Exodus 7:22). The standard is Isaiah 8:20 — to the law and to the testimony.'",
  },
  {
    id: "pentecostal-fallacy-false-dilemma",
    name: "False Dilemma: Power vs. Doctrine",
    definition:
      "Presenting power and doctrine as mutually exclusive — you either have fire or you have theology, but not both.",
    example:
      "\"You can have your 28 beliefs or you can have the Holy Ghost. Which do you want?\" — but Acts 2:42 shows the early church had BOTH: 'they continued in the apostles' doctrine' AND experienced power.",
    counterMove:
      "Reject the dichotomy: 'The early church had fire AND doctrine (Acts 2:42). Paul had miracles AND systematic theology (Romans). Power without truth is deception; truth without power is incomplete. We need BOTH.'",
  },
  {
    id: "pentecostal-fallacy-narrative-normativity",
    name: "Narrative Normativity Fallacy",
    definition:
      "Treating every event recorded in Acts as a prescriptive pattern for all Christians — confusing description with prescription.",
    example:
      "\"They spoke in tongues in Acts 2, Acts 10, and Acts 19 — therefore ALL believers must speak in tongues.\" But Acts 8 (Samaritans) and Acts 9 (Paul) record Spirit-reception without tongues.",
    counterMove:
      "Point out the inconsistency: 'If Acts is normative, you must also sell all possessions (Acts 2:44-45), require apostolic laying on of hands (Acts 8:17), and preach only to Jews first (Acts 11:19). Selective normativity is not sound hermeneutics.'",
  },
  {
    id: "pentecostal-fallacy-unfalsifiability",
    name: "Unfalsifiable Healing Doctrine",
    definition:
      "Constructing a healing theology where success confirms the doctrine and failure is blamed on the individual — making the doctrine immune to disproof.",
    example:
      "\"Healing is guaranteed. If you weren't healed, you lacked faith.\" — But when Paul wasn't healed, God said 'My grace is sufficient' (2 Cor 12:9), not 'your faith is insufficient.'",
    counterMove:
      "Present apostolic counter-evidence: Paul's thorn, Trophimus left sick, Timothy's chronic illness, Epaphroditus 'sick nigh unto death' (Philippians 2:27). These demolish the claim that healing is automatic for the faithful.",
  },
];

// ── Counter-Strategies ───────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "tongues-as-evidence",
    title: "Biblical Tongues vs. Modern Glossolalia",
    sdaPosition:
      "Biblical tongues were known, translatable languages (glossa/dialektos) given for cross-cultural gospel proclamation — not ecstatic babbling. The gift continues but must match the biblical pattern and be tested by Scripture.",
    keyScriptures: [
      "Acts 2:6-8 — each heard in his OWN language (dialektos)",
      "1 Corinthians 12:30 — 'Do all speak in tongues?' (expected answer: NO)",
      "1 Corinthians 14:27-28 — two or three at most, with interpreter, or SILENCE",
      "1 Corinthians 14:33 — God is not the author of confusion",
      "Isaiah 8:20 — to the law and the testimony",
    ],
    counterArguments: [
      "Acts 2 tongues were KNOWN languages, not ecstatic speech — linguistic analysis confirms modern glossolalia has no linguistic structure.",
      "Paul asks 'Do all speak in tongues?' (1 Cor 12:30) — the Greek mē expects the answer NO.",
      "In Acts 8 and Acts 9, the Spirit falls WITHOUT tongues — breaking the supposed normative pattern.",
      "Paul RANKS tongues LAST (1 Cor 12:28) and says prophesying is GREATER (1 Cor 14:5).",
    ],
    closingStatement:
      "We do not reject the gift of tongues — we reject the counterfeit. Biblical tongues were real languages given for mission, regulated by Paul, and tested by Scripture. The Spirit's primary evidence is fruit (Galatians 5:22-23), not phenomena.",
  },
  {
    subjectId: "divine-healing-atonement",
    title: "Healing: Already and Not Yet",
    sdaPosition:
      "God does heal, sovereignly and graciously — but physical healing is not guaranteed in this life the way forgiveness is. Full physical restoration awaits the resurrection. Blaming the sick for 'lack of faith' is not the gospel.",
    keyScriptures: [
      "2 Corinthians 12:7-9 — Paul's thorn NOT removed; God's grace sufficient",
      "2 Timothy 4:20 — Trophimus left sick at Miletus",
      "1 Timothy 5:23 — Timothy told to use wine for his stomach (not 'claim your healing')",
      "1 Corinthians 15:53-54 — mortality swallowed up at the RESURRECTION",
      "Philippians 2:27 — Epaphroditus 'sick nigh unto death'",
    ],
    counterArguments: [
      "Isaiah 53:5 in context is about spiritual healing — 1 Peter 2:24 explicitly frames it as dying to SINS.",
      "If healing were guaranteed like forgiveness, no Christian would ever die.",
      "Paul, the greatest apostle, had an unhealed condition — was HIS faith lacking?",
      "The faith-blame system creates cruelty toward the suffering and contradicts Christ's compassion.",
    ],
    closingStatement:
      "We believe in divine healing — but we serve a sovereign God, not a formula. 'My grace is sufficient for you, for My power is made perfect in weakness' (2 Corinthians 12:9).",
  },
  {
    subjectId: "prosperity-covenant",
    title: "The Cross vs. the Crown (Now)",
    sdaPosition:
      "The gospel promises spiritual riches, eternal inheritance, and contentment — not material wealth as a covenant right. The prosperity gospel inverts the cross and contradicts Christ's own poverty.",
    keyScriptures: [
      "Luke 6:24 — 'Woe unto you that are rich'",
      "1 Timothy 6:8-10 — content with food and raiment; love of money is root of evil",
      "2 Corinthians 8:9 — Christ became POOR that you through His poverty might be RICH (in grace)",
      "Hebrews 11:36-38 — heroes of faith destitute, afflicted, tormented",
      "Philippians 4:11-12 — Paul learned contentment in ALL states",
    ],
    counterArguments: [
      "3 John 2 is a personal letter greeting, not a doctrinal formula.",
      "Deuteronomy 28 was a national covenant with theocratic Israel, not a personal wealth guarantee for New Testament Christians.",
      "Jesus, the apostles, and the early church were largely poor — were they outside God's blessing?",
      "The prosperity gospel cannot explain persecution, martyrdom, or the suffering of faithful believers throughout history.",
    ],
    closingStatement:
      "The greatest treasure is Christ Himself — 'in whom are hidden all the treasures of wisdom and knowledge' (Colossians 2:3). The prosperity gospel sells a lesser god for a lesser prize.",
  },
  {
    subjectId: "experience-vs-doctrine",
    title: "Doctrine AND Power — Not Either/Or",
    sdaPosition:
      "The early church was defined by BOTH apostolic doctrine AND spiritual power (Acts 2:42). Doctrine without power is incomplete; power without doctrine is dangerous. SDAs hold both.",
    keyScriptures: [
      "Acts 2:42 — continued in the apostles' DOCTRINE",
      "1 Corinthians 14:33, 40 — God is not the author of confusion; do all things decently and in order",
      "Matthew 24:24 — false christs shall show great signs and wonders",
      "2 Thessalonians 2:9 — the lawless one comes with lying signs and wonders",
      "Isaiah 8:20 — to the law and testimony, or no light in them",
    ],
    counterArguments: [
      "The early church in Acts 2:42 continued in DOCTRINE first — it was foundational, not optional.",
      "Corinth had ALL the spectacular gifts — and Paul called them immature, carnal, and disordered (1 Cor 3:1-3).",
      "End-time deception will come through MIRACLES — signs alone prove nothing (Revelation 13:13-14).",
      "The SDA church has impacted 215+ countries with hospitals, schools, and missions — that is Spirit-empowered work.",
    ],
    closingStatement:
      "We do not choose between fire and truth. We test the fire by the truth. 'Beloved, do not believe every spirit, but test the spirits' (1 John 4:1).",
  },
  {
    subjectId: "oneness-theology",
    title: "The Biblical Godhead: Three Persons, One God",
    sdaPosition:
      "The Bible reveals one God in three co-eternal, co-equal Persons — Father, Son, and Holy Spirit — who relate to each other in love. Modalism/Oneness theology collapses these distinctions and cannot explain Jesus praying to the Father.",
    keyScriptures: [
      "Matthew 3:16-17 — all three Persons present simultaneously at baptism",
      "John 14:16 — 'I will ask the Father, and He will give you ANOTHER Helper'",
      "John 17:1-5 — Jesus prays TO the Father (you cannot pray to yourself)",
      "Matthew 28:19 — baptize in the NAME of Father AND Son AND Holy Spirit",
      "Genesis 1:26 — 'Let US make man in OUR image'",
    ],
    counterArguments: [
      "If Father, Son, and Spirit are one Person, Jesus was praying to Himself in Gethsemane — nonsensical.",
      "Acts 2:38 does not contradict Matthew 28:19 — 'in the name of Jesus Christ' means by His authority, not as a replacement formula.",
      "The earliest church fathers (pre-Nicaea) were Trinitarian: Ignatius (110 AD), Justin Martyr (150 AD), Tertullian (200 AD).",
      "Echad in Deuteronomy 6:4 allows compound unity — 'one flesh' (Genesis 2:24) uses the same word.",
    ],
    closingStatement:
      "The Godhead is a mystery of relationship — Father, Son, and Spirit united in ONE purpose, ONE nature, ONE name. This is not three gods; it is one God in relational perfection.",
  },
  {
    subjectId: "gifts-continuation",
    title: "All Gifts Continue — But All Must Be Tested",
    sdaPosition:
      "SDAs affirm the continuation of ALL spiritual gifts, including prophecy and tongues. But every gift must be tested by Scripture (1 John 4:1, Isaiah 8:20). We are not cessationists; we are discerners.",
    keyScriptures: [
      "1 Thessalonians 5:19-21 — 'Quench not the Spirit... prove all things'",
      "1 John 4:1 — 'Test the spirits'",
      "1 Corinthians 14:29 — 'Let the prophets speak two or three, and let the other judge'",
      "Joel 2:28-29 — the Spirit poured out in the last days (SDAs affirm this!)",
      "Revelation 12:17 — the remnant has 'the testimony of Jesus' which is 'the spirit of prophecy' (Rev 19:10)",
    ],
    counterArguments: [
      "SDAs officially affirm continuing gifts — Fundamental Belief #17 specifically addresses spiritual gifts.",
      "We accept Ellen White as exercising the prophetic gift — we are the opposite of cessationist.",
      "But accepting gifts ≠ accepting every manifestation uncritically. Even Paul told Corinth to judge, test, and order the gifts.",
      "The Spirit who inspired Scripture will not contradict Scripture. Any gift that violates the Word is not from God.",
    ],
    closingStatement:
      "We embrace the gifts. We also test them. The same Paul who said 'Do not quench the Spirit' also said 'Test everything; hold fast what is good' (1 Thessalonians 5:19-21). Both commands are in the SAME breath.",
  },
];

// ── Modules ──────────────────────────────────────────────────────────────────

const modules: AATSModule[] = subjects.map((subject, idx) => ({
  id: `pentecostal-module-${idx + 1}`,
  subjectId: subject.id,
  title: subject.title,
  doctrineBrief: subject.description,
  steelmanArguments: [steelmanArguments[idx]],
  hiddenAssumptions: steelmanArguments[idx]?.hiddenAssumptions || [],
  mindGames: [mindGames[idx % mindGames.length]],
  fallacies: [fallacies[idx % fallacies.length]],
  counterStrategy: counterStrategies[idx],
  debateSimLink: "pentecostal",
  debriefPrompt: `Reflect on the Pentecostal challenge regarding "${subject.title}." Where were you strongest? Where did their experiential argument feel most compelling? How can you combine doctrinal truth WITH genuine spiritual experience?`,
}));

// ── Export ────────────────────────────────────────────────────────────────────

export const pentecostalTraining: AATSAvatarTraining = {
  avatarId: "pentecostal",
  avatarName: "Bishop Darius Flame — The Pentecostal",
  emoji: "🔥",
  color: "border-red-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
