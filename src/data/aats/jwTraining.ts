// ─── AATS: Jehovah's Witness Avatar Training ────────────────────────────────
// SDA counter-apologetics training data for engaging Jehovah's Witness theology.

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
    id: "jw-christ-created",
    title: "Christ as Created Being",
    description:
      "Jesus is Michael the Archangel, the first creation of God",
  },
  {
    id: "jw-trinity-denial",
    title: "Trinity Denial",
    description:
      "The Trinity is a pagan doctrine; God is one person (Jehovah)",
  },
  {
    id: "jw-144000",
    title: "144,000 Theology",
    description:
      "Only 144,000 go to heaven; the rest live on a paradise earth",
  },
  {
    id: "jw-nwt-bias",
    title: "NWT Translation Bias",
    description:
      "The New World Translation is the most accurate Bible translation",
  },
  {
    id: "jw-watchtower-authority",
    title: "Watchtower Authority",
    description:
      "The Faithful and Discreet Slave (Governing Body) is God's channel",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "jw-steel-created-firstborn",
    title: "Jesus Is the Firstborn of Creation",
    argument:
      "Jesus is a created being — Colossians 1:15 calls Him 'firstborn of all creation.' The Greek word prototokos literally means 'first-brought-forth,' placing Jesus within creation rather than outside it. If He were co-eternal with the Father, Paul would never have used language that ranks Him among created things.",
    hiddenAssumptions: [
      "Firstborn = first created, when prototokos in biblical usage often denotes rank and preeminence (cf. Psalm 89:27 where David is called 'firstborn' though he was the youngest son)",
      "Prototokos is semantically identical to protoktistos ('first-created'), a word Paul deliberately did not use",
      "The immediate context of Colossians 1:16-17 — 'by Him all things were created' — does not decisively clarify Jesus as Creator rather than creature",
    ],
    sdaResponse:
      "Paul's point in Colossians 1:15-17 is Christ's supremacy, not His origin. 'Firstborn' (prototokos) is a title of rank and inheritance rights, as in Psalm 89:27 where God makes David 'firstborn' — yet David was Jesse's youngest. Crucially, verse 16 states 'by Him all things were created' and verse 17 adds 'He is before all things.' If Christ were Himself created, He could not be the agent through whom ALL things came into being. The NWT inserts the word 'other' four times in these verses — a word absent from every Greek manuscript — precisely because the text as written destroys the created-Jesus position.",
  },
  {
    id: "jw-steel-trinity-pagan",
    title: "The Trinity Is a Pagan Import",
    argument:
      "The Trinity is pagan — borrowed from Babylonian triads and Egyptian trinities. The word 'Trinity' does not appear anywhere in the Bible. Early Christians were strict monotheists who never conceived of a three-in-one God. The doctrine was imposed at the Council of Nicaea in 325 AD under political pressure from Emperor Constantine.",
    hiddenAssumptions: [
      "Similarity in number (three) = derivation — the mere existence of triads in paganism proves the Christian Trinity was borrowed from them",
      "The pre-Nicene church had no Trinitarian belief, ignoring the Didache, Ignatius, Justin Martyr, Irenaeus, and Tertullian — all of whom affirm the deity of Christ and a plurality within the Godhead before 325 AD",
      "'Person' in Trinitarian theology means a separate being, when orthodox Trinitarianism explicitly affirms one Being in three co-eternal, co-equal Persons",
    ],
    sdaResponse:
      "The absence of the word 'Trinity' is irrelevant — the word 'theocracy' isn't in Scripture either, yet Jehovah's Witnesses embrace the concept. Pagan triads bear no structural resemblance to the Christian Trinity: Babylonian triads were three separate gods in a hierarchy, while Trinitarianism affirms one God in three co-equal, co-eternal Persons. The ante-Nicene fathers — Ignatius (c. 110 AD), Justin Martyr (c. 150 AD), Irenaeus (c. 180 AD) — all affirm Christ's full deity long before Nicaea. The Council of Nicaea did not invent the Trinity; it formally articulated what Scripture teaches: the Father is God (1 Cor 8:6), the Son is God (John 1:1, Heb 1:8), the Holy Spirit is God (Acts 5:3-4), yet there is one God (Deut 6:4).",
  },
  {
    id: "jw-steel-john1-1-a-god",
    title: "John 1:1 — 'The Word Was A God'",
    argument:
      "John 1:1 says 'the Word was a god' — proving Jesus is a lesser, created deity. In the Greek, theos in the final clause lacks the definite article (ho theos), making it indefinite. Grammatically, an anarthrous predicate nominative should be translated with an indefinite article. This is how the New World Translation renders it, and several scholars have acknowledged this possibility.",
    hiddenAssumptions: [
      "An anarthrous (article-less) theos always means 'a god,' when Colwell's Rule and context determine that a pre-verbal predicate nominative is typically qualitative or definite, not indefinite",
      "Greek grammar unambiguously supports the NWT rendering, when the vast majority of Greek scholars — including non-Trinitarians — reject 'a god' as a translation of John 1:1c",
      "This reading is accepted by mainstream biblical scholarship, when in reality the NWT rendering is rejected by virtually every major translation committee and peer-reviewed Greek grammar",
    ],
    sdaResponse:
      "The NWT's 'a god' in John 1:1 is rejected by the overwhelming consensus of Greek scholars. Colwell's Rule demonstrates that a predicate nominative before the verb (as theos is in John 1:1c) is typically qualitative — describing the nature of the Word — not indefinite. The qualitative sense means 'the Word was fully divine in nature.' Furthermore, if theos without the article means 'a god,' then JWs must also call the Father 'a god' in passages like John 1:18a, where theos is also anarthrous. The NWT is inconsistent: it translates anarthrous theos as 'God' in many places (e.g., John 1:6, 12, 13, 18) but as 'a god' only when it refers to Jesus. This is theology driving translation, not the reverse.",
  },
  {
    id: "jw-steel-144000-literal",
    title: "Only 144,000 Go to Heaven",
    argument:
      "Only 144,000 go to heaven — Revelation 7:4 gives a specific, literal number. These are the 'anointed' who will rule with Christ in heaven, while the 'great multitude' (Revelation 7:9) will live forever on a paradise earth. This two-class system of believers is the Bible's consistent teaching about the destiny of the righteous.",
    hiddenAssumptions: [
      "144,000 is literal while the 'great multitude' from every nation is also literal — yet the same passage (Revelation 7) is treated as literal for the number and literal (but differently) for the crowd, ignoring that Revelation is highly symbolic throughout",
      "The two-class system (heavenly class vs. earthly class) is a biblical distinction, when in fact this teaching originated with Watchtower president J.F. Rutherford in 1935 and has no basis in any pre-19th-century Christian teaching",
      "Revelation 14:1-3, which describes the 144,000 as male Jewish virgins from the twelve tribes, is not to be taken literally in those details — exposing selective literalism",
    ],
    sdaResponse:
      "The 144,000 in Revelation 7 and 14 must be read in the context of Revelation's pervasive symbolism. If 144,000 is literal, then consistency demands that they must also be literal male Jewish virgins from exactly twelve tribes (Rev 14:1-4) — yet JWs do not apply this literally. The 'great multitude' in Revelation 7:9 stands 'before the throne and before the Lamb' — the same location described as heaven throughout Revelation (cf. Rev 4:2-6, 5:11, 14:3). The two-class system was invented by J.F. Rutherford in 1935 and has zero support in Scripture. Jesus said there is 'one flock' and 'one shepherd' (John 10:16) — not two classes with different destinies. SDAs understand the 144,000 as a symbolic number representing the completeness of God's end-time people.",
  },
  {
    id: "jw-steel-name-jehovah",
    title: "God's Name Must Be 'Jehovah'",
    argument:
      "God's name is Jehovah — churches that don't use it dishonor Him. The divine name YHWH appears nearly 7,000 times in the Old Testament, proving God wants His name known and used. The Watchtower has faithfully restored this name, whereas Christendom has conspired to remove it and replace it with generic titles like 'Lord.'",
    hiddenAssumptions: [
      "YHWH is correctly pronounced 'Jehovah,' when this form is actually a medieval hybrid combining the consonants of YHWH with the vowels of Adonai — most scholars recognize 'Yahweh' as closer to the original pronunciation",
      "The New Testament authors used YHWH in their original writings, when in fact no surviving NT manuscript contains the Tetragrammaton — the NWT inserts 'Jehovah' 237 times into the NT without manuscript support",
      "Name usage = faithfulness, when Jesus Himself rarely used the Tetragrammaton and instead called God 'Father' (Abba) — focusing on relationship rather than a pronunciation formula",
    ],
    sdaResponse:
      "While SDAs agree that God's name is sacred and that YHWH appears thousands of times in the Old Testament, the Watchtower's claims require scrutiny. First, 'Jehovah' is not the original pronunciation — it is a medieval Latin hybrid. Most Hebrew scholars favor 'Yahweh.' Second, the NWT inserts 'Jehovah' 237 times into the New Testament where no Greek manuscript contains the Tetragrammaton. This is not 'restoration' — it is insertion without textual evidence. Third, Jesus Himself taught His disciples to pray 'Our Father' (Matt 6:9), emphasizing relational intimacy over a pronunciation formula. Knowing God is not a matter of uttering a specific name-form but of entering into covenant relationship through Christ (John 17:3).",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "jw-mg-rapid-chaining",
    name: "Rapid Verse Chaining",
    description:
      "Jumping from verse to verse so fast you can't examine any one text in context",
    example:
      "A JW quotes Proverbs 8:22 ('The Lord possessed me at the beginning'), then immediately jumps to Revelation 3:14 ('the beginning of the creation of God'), then to Colossians 1:15 ('firstborn of all creation') — never pausing long enough for you to examine any passage in its original context. The speed creates an illusion of overwhelming evidence.",
    detectionTip:
      "Stop the chain. Say: 'Let's stay in Colossians 1:15 and read through verse 20 together.' Insist on examining one passage fully before moving to the next. Rapid chaining works only when you allow it.",
  },
  {
    id: "jw-mg-translation-manipulation",
    name: "Translation Manipulation",
    description:
      "Insisting on NWT readings while dismissing all other translations as biased",
    example:
      "When you read John 1:1 from the ESV ('the Word was God'), the JW dismisses it: 'That translation is produced by Trinitarian churches that have a theological agenda.' They then open the NWT and read 'the Word was a god' as though the NWT has no theological agenda of its own.",
    detectionTip:
      "Point out the double standard: 'If Trinitarian bias disqualifies every other translation, doesn't Watchtower theology disqualify the NWT?' Then go directly to the Greek text and discuss the grammar rather than battling translations.",
  },
  {
    id: "jw-mg-definition-control",
    name: "Definition Control",
    description:
      "Redefining terms (worship, deity, soul, death) to fit Watchtower theology before the discussion starts",
    example:
      "Before discussing whether Jesus should be worshipped, a JW redefines 'worship' (proskuneo) as merely 'obeisance' when applied to Jesus but 'worship' when applied to Jehovah — using the same Greek word with two different English meanings depending on who receives it.",
    detectionTip:
      "Insist on consistent definitions. If proskuneo means 'worship' for Jehovah (Matt 4:10), it must mean 'worship' for Jesus (Matt 14:33, Heb 1:6). Ask: 'Are you using the same Greek word with two different dictionaries?'",
  },
  {
    id: "jw-mg-information-control",
    name: "Information Control",
    description:
      "Dismissing any non-Watchtower source as 'apostate material' that should not be read or considered",
    example:
      "When you cite a respected Greek lexicon (BDAG) or a peer-reviewed journal article that contradicts the Watchtower position, the JW responds: 'We don't read apostate literature. Those sources are influenced by Satan to confuse people.' This shuts down all external evidence.",
    detectionTip:
      "Gently point out the circularity: 'If the only sources you accept are Watchtower publications, how can you ever discover if the Watchtower is wrong? Even the Bereans in Acts 17:11 tested Paul's teaching against Scripture.' Redirect to the biblical text itself.",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "jw-fall-circular-nwt",
    name: "Circular Reasoning (NWT-Governing Body Loop)",
    definition:
      "Using the conclusion as a premise: the NWT is declared accurate because the Governing Body endorses it, and the Governing Body's authority is validated by the NWT's readings that support their doctrines.",
    example:
      "'The New World Translation correctly renders John 1:1 as \"a god\" because the Governing Body, God's faithful and discreet slave, produced it. And we know the Governing Body is God's channel because the NWT supports their teachings.' Each claim depends on the other with no independent foundation.",
    counterMove:
      "Break the circle by introducing an independent standard: the Greek text. Say: 'Let's set aside both the NWT and the Governing Body's claims and look at what the Greek grammar of John 1:1 actually requires. If the grammar doesn't support \"a god,\" then neither the NWT nor the Governing Body can override it.'",
  },
  {
    id: "jw-fall-special-pleading-other",
    name: "Special Pleading (Inserting 'Other')",
    definition:
      "Applying a rule inconsistently — adding the word 'other' in Colossians 1:16-17 to make Jesus part of creation, while refusing to apply the same insertion technique elsewhere where it would undermine JW doctrine.",
    example:
      "The NWT renders Colossians 1:16 as 'by means of him all OTHER things were created' — inserting 'other' (in brackets) to imply Jesus is one of the created things. But they do not insert 'other' in passages like John 13:35 ('you have love among yourselves [other?]') where the same logic could apply, because it doesn't serve their theology.",
    counterMove:
      "Ask: 'On what textual principle do you insert \"other\" in Colossians 1:16 when it appears in no Greek manuscript? If the principle is legitimate, show me the rule and apply it consistently throughout the NWT. If it's only applied here, it's not a grammatical rule — it's a theological edit.'",
  },
  {
    id: "jw-fall-false-dichotomy-deity",
    name: "False Dichotomy (Jehovah or Creature)",
    definition:
      "Presenting only two options — Jesus is Jehovah (as a single person) or He is a created being — while ignoring the biblically grounded Trinitarian position that Jesus is fully God (sharing the divine nature) while being a distinct Person from the Father.",
    example:
      "'Either Jesus IS Jehovah, or He's a creature. Since Jesus prayed to the Father and said the Father is greater, He obviously isn't Jehovah — so He must be a created being.' This ignores the Trinitarian distinction between Persons and Being.",
    counterMove:
      "Introduce the missing option: 'There's a third position the Bible actually teaches — Jesus shares the divine nature fully with the Father (John 1:1, Heb 1:3, Col 2:9) while being a distinct Person within the Godhead. The Father, Son, and Holy Spirit are one God in Being, not one Person. Your dichotomy only works if you define God as one Person — but that's precisely what's being debated.'",
  },
  {
    id: "jw-fall-appeal-to-authority-gb",
    name: "Appeal to Authority (Governing Body Infallibility)",
    definition:
      "Treating the Governing Body's interpretation as the final word regardless of textual, linguistic, or historical evidence to the contrary.",
    example:
      "'The Governing Body has studied this in depth and concluded that Jesus is Michael the Archangel. They are the faithful and discreet slave appointed by Jehovah. We trust their conclusion.' When pressed for biblical evidence, the response loops back to the Governing Body's authority.",
    counterMove:
      "Redirect to Scripture: 'Even if the Governing Body were God's channel, they would want their teachings tested against the Bible (Acts 17:11). Can you show me a single verse where Jesus is explicitly identified as Michael? Jude 9 distinguishes Michael from the Lord — Michael says \"the Lord rebuke you\" rather than rebuking Satan in His own authority, as Jesus does throughout the Gospels (Mark 1:25, Matt 4:10).'",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "jw-christ-created",
    title: "Defending the Full Deity of Christ",
    sdaPosition:
      "Seventh-day Adventists affirm the full, eternal deity of Jesus Christ. He is not a created being but the eternal Son of God, one with the Father in nature, character, and purpose. Fundamental Belief #4 states: 'God the eternal Son became incarnate in Jesus Christ. Through Him all things were created.' Christ's deity is essential to the efficacy of the atonement — only an infinite sacrifice could atone for infinite guilt.",
    keyScriptures: [
      "John 1:1-3 — 'The Word was God... All things were made through Him, and without Him nothing was made that was made.'",
      "Colossians 2:9 — 'In Him dwells all the fullness of the Godhead bodily.'",
      "Hebrews 1:8-10 — The Father addresses the Son as 'God' and credits Him with creating the heavens and earth.",
      "Isaiah 9:6 — The Messiah is called 'Mighty God, Everlasting Father' — titles belonging only to YHWH.",
    ],
    counterArguments: [
      "Colossians 1:15 uses 'firstborn' (prototokos) as a title of supremacy, not origin. Psalm 89:27 uses the same word for David, the youngest son, meaning 'preeminent one.' Paul immediately explains: 'By Him ALL things were created' (v.16) — the Creator cannot be among the created.",
      "The NWT's insertion of 'other' in Colossians 1:16-17 has zero manuscript support. No Greek text — not one of the 5,800+ NT manuscripts — contains the word 'allos' (other) in these verses. This is a Watchtower editorial addition designed to subordinate Christ.",
      "Revelation 3:14 calls Jesus 'the beginning (arche) of the creation of God.' Arche means 'ruler, source, origin' — as in Revelation 21:6 where God calls Himself 'the beginning and the end.' It designates Jesus as the Source of creation, not the first thing created.",
      "If Jesus is Michael the Archangel, why does Hebrews 1:5 say 'to which of the angels did God ever say, \"You are My Son\"?' The entire argument of Hebrews 1 is that Christ is categorically superior to ALL angels — not one of them.",
    ],
    closingStatement:
      "The deity of Christ is not a philosophical abstraction — it is the foundation of the gospel. If Jesus were a created being, His sacrifice could not atone for the sins of all humanity. Only God can save (Isaiah 43:11), and Jesus is 'our great God and Savior' (Titus 2:13). The Watchtower diminishes Christ to elevate an organization; Scripture elevates Christ to save a world.",
  },
  {
    subjectId: "jw-trinity-denial",
    title: "Defending the Biblical Trinity",
    sdaPosition:
      "SDAs affirm the Trinity as revealed in Scripture: one God eternally existing in three co-eternal, co-equal Persons — Father, Son, and Holy Spirit. This is not a pagan import but the cumulative teaching of the entire Bible. Fundamental Belief #2 states: 'There is one God: Father, Son, and Holy Spirit, a unity of three coeternal Persons.'",
    keyScriptures: [
      "Matthew 28:19 — Baptism in the singular 'name' (not 'names') of the Father, Son, and Holy Spirit — three Persons sharing one divine name.",
      "2 Corinthians 13:14 — The apostolic benediction coordinates Father, Son, and Spirit as co-equal sources of grace, love, and fellowship.",
      "Isaiah 48:16 — 'The Lord GOD and His Spirit have sent Me' — three distinct agents within the Godhead.",
      "John 1:1 — 'The Word was with God, and the Word was God' — distinction and unity in one verse.",
    ],
    counterArguments: [
      "Pagan triads (Babylonian, Egyptian, Hindu) are three separate gods in a hierarchy — fundamentally different from the Trinity, which affirms one God in three co-equal Persons. Finding the number three in paganism no more disproves the Trinity than finding flood stories disproves Noah's flood.",
      "The word 'Trinity' not appearing in the Bible is irrelevant. 'Theocracy,' 'millennium,' and 'Governing Body' also don't appear in the Bible, yet JWs use these concepts. Doctrines are established by the weight of Scripture, not by whether a theological term appears verbatim.",
      "Pre-Nicene church fathers clearly affirmed Christ's deity: Ignatius (c. 110 AD) called Jesus 'our God'; Polycarp (c. 155 AD) ascribed eternal glory to Christ; Irenaeus (c. 180 AD) called the Son and Spirit 'the hands of God.' Nicaea didn't invent the Trinity — it defended it against Arius.",
      "The Holy Spirit is not an impersonal force: He speaks (Acts 13:2), can be lied to (Acts 5:3-4 — and lying to Him is lying to God), grieves (Ephesians 4:30), intercedes with groanings (Romans 8:26-27), and possesses a mind (Romans 8:27). These are attributes of a Person, not a force.",
    ],
    closingStatement:
      "The Trinity is not a contradiction — it is a mystery revealed progressively throughout Scripture. That finite minds cannot fully comprehend the infinite God does not make the doctrine false; it makes God bigger than our categories. The Watchtower has shrunk God to fit a human system; Scripture calls us to worship the God who overflows every system we construct.",
  },
  {
    subjectId: "jw-144000",
    title: "Defending One Hope for All Believers",
    sdaPosition:
      "SDAs understand the 144,000 as a symbolic number representing the completeness of God's sealed, end-time people who live through the time of trouble without seeing death. All the redeemed — whether part of the 144,000 or the great multitude — share the same ultimate hope: eternal life in God's presence on the new earth (Revelation 21:1-4). There is no two-class salvation system in Scripture.",
    keyScriptures: [
      "Revelation 7:9-15 — The great multitude stands 'before the throne and before the Lamb' — in heaven, not merely on earth.",
      "John 10:16 — 'Other sheep I have... they will hear My voice; and there will be ONE flock and ONE shepherd' — not two classes with different destinies.",
      "Ephesians 4:4 — 'There is ONE body and ONE Spirit... ONE hope of your calling' — the body of Christ is not divided into heavenly and earthly classes.",
      "Revelation 21:1-4 — God's ultimate plan is a new earth where He dwells with His people — all of them, not just 144,000.",
    ],
    counterArguments: [
      "If the number 144,000 is literal, then the details in Revelation 14:1-4 must also be literal: they are all male, all Jewish, all literal virgins from exactly twelve named tribes. JWs do not apply these details literally — exposing selective literalism that serves organizational needs.",
      "The 'great multitude' of Revelation 7:9 stands 'before the throne' — the same Greek phrase (enopion tou thronou) used throughout Revelation to describe beings in heaven (Rev 4:5-6, 5:11, 7:11, 14:3). If the 24 elders and angels are 'before the throne' in heaven, so is the great multitude.",
      "The two-class system (anointed vs. other sheep) was invented by J.F. Rutherford in 1935. For the first 50+ years of Watchtower history, all Bible Students expected to go to heaven. This doctrine was created to manage the growing number of converts, not revealed by Scripture.",
      "Jesus promised ALL believers: 'In My Father's house are many mansions... I go to prepare a place for you' (John 14:2-3). He did not say 'for 144,000 of you.' The promise is universal for His followers.",
    ],
    closingStatement:
      "God's plan is not a caste system. The gospel offers one hope, one salvation, one destiny for all who trust in Christ. The new earth — God dwelling with humanity forever (Rev 21:3) — is the inheritance of every believer. The Watchtower's two-class system divides what God has united and creates a spiritual hierarchy that Scripture never teaches.",
  },
  {
    subjectId: "jw-nwt-bias",
    title: "Exposing Translation Bias in the NWT",
    sdaPosition:
      "SDAs rely on the weight of manuscript evidence and the consensus of credible biblical scholarship for translation accuracy. While no translation is perfect, the NWT contains demonstrable theological insertions and alterations — such as adding 'other' in Colossians 1:16-17, rendering John 1:1 as 'a god,' and inserting 'Jehovah' 237 times into the New Testament without manuscript support — that serve Watchtower theology rather than textual fidelity.",
    keyScriptures: [
      "Revelation 22:18-19 — A solemn warning against adding to or taking away from the words of Scripture.",
      "2 Timothy 3:16 — 'All Scripture is given by inspiration of God' — translation must serve the text, not an organization's theology.",
      "Proverbs 30:5-6 — 'Every word of God is pure... Do not add to His words, lest He rebuke you, and you be found a liar.'",
    ],
    counterArguments: [
      "The NWT inserts 'other' in Colossians 1:16-17 to make Jesus part of creation. No Greek manuscript contains this word. Even the NWT's own brackets acknowledge it is an addition — yet it fundamentally changes the passage's meaning from Christ as Creator of ALL things to Christ as creator of all OTHER things.",
      "The NWT renders John 1:1c as 'the Word was a god' — a translation rejected by virtually every Greek scholar. The NWT translation committee had no publicly credentialed Greek scholars. Former Governing Body member Raymond Franz acknowledged that Frederick Franz, the primary translator, was self-taught in Greek and Hebrew.",
      "The NWT inserts 'Jehovah' 237 times into the New Testament, replacing kurios (Lord). Not a single Greek NT manuscript — of over 5,800 extant — contains the Tetragrammaton. The Watchtower justifies this by appealing to Hebrew translations of the NT (the 'J-references'), which are medieval and modern translations, not original sources.",
      "The NWT's rendering of Philippians 2:6 changes 'equality with God' to 'being equal to God' as something Jesus 'gave no consideration to' — softening Paul's affirmation that Jesus possessed equality with God as an inherent reality, not something to be seized.",
    ],
    closingStatement:
      "A faithful translation follows the text wherever it leads — even when it challenges cherished doctrines. The NWT follows Watchtower theology and adjusts the text to match. This is not translation; it is theological editing. Christians should compare multiple reliable translations and consult the original languages rather than depending on any single organization's version.",
  },
  {
    subjectId: "jw-watchtower-authority",
    title: "Challenging Watchtower Authority Claims",
    sdaPosition:
      "SDAs affirm 'Sola Scriptura' — the Bible alone as the supreme authority for faith and practice. While God uses human instruments, no organization holds an infallible interpretive monopoly on Scripture. The Watchtower's claim that the Governing Body is 'God's channel' of truth creates an extra-biblical authority that supplants the believer's direct access to God through Scripture and the Holy Spirit.",
    keyScriptures: [
      "Acts 17:11 — The Bereans were 'more noble' because they tested even apostolic teaching against Scripture — a standard JWs are discouraged from applying to the Governing Body.",
      "1 John 4:1 — 'Test the spirits to see whether they are from God' — every claim to divine authority must be tested, not blindly accepted.",
      "Matthew 24:45-47 — The 'faithful and wise servant' parable was about individual faithfulness, not an organizational appointment — Jesus applied it to each disciple.",
      "Galatians 1:8 — Even an angel from heaven is to be rejected if he preaches a different gospel — how much more a governing body that has repeatedly changed 'truth.'",
    ],
    counterArguments: [
      "The Governing Body has made numerous false prophecies: 1914 (the end of the world), 1925 (the resurrection of patriarchs), 1975 (the start of the millennium). Deuteronomy 18:20-22 is clear: a prophet whose word does not come to pass has spoken presumptuously. The Watchtower's track record disqualifies its claim to be God's sole channel.",
      "The 'faithful and discreet slave' of Matthew 24:45 is a parable about individual stewardship, not an organizational appointment. Jesus told many parables about servants — in none of them did He establish a governing body. The Watchtower's self-appointment to this role is circular: they claim the title and then use the title to validate their authority.",
      "The Watchtower forbids members from reading 'apostate' material — including former JW publications that contain now-abandoned teachings. If truth can withstand scrutiny, why must members be shielded from examining the organization's own history? Acts 17:11 commends those who tested teaching against Scripture.",
      "Watchtower doctrine has changed repeatedly on blood transfusions, organ transplants, the meaning of 'generation,' the identity of the faithful slave, and military service. If the Governing Body is God's channel, why does God's truth keep changing? God is not a God of confusion (1 Cor 14:33).",
    ],
    closingStatement:
      "Any organization that forbids its members from testing its claims against Scripture has already admitted that its claims cannot withstand the test. The Berean standard — searching the Scriptures daily to verify teaching — is not apostasy; it is faithfulness. Christ alone is the Head of the church (Eph 5:23), and the Holy Spirit guides each believer into all truth (John 16:13). No human governing body may insert itself between the believer and the Word of God.",
  },
];

// ── Modules (one per subject, 8 steps each) ─────────────────────────────────

const modules: AATSModule[] = [
  // ── Module 1: Christ as Created Being ──
  {
    id: "jw-mod-christ-created",
    subjectId: "jw-christ-created",
    title: "Is Jesus a Created Being?",
    doctrineBrief:
      "Jehovah's Witnesses teach that Jesus Christ is Michael the Archangel — the first being created by Jehovah God. They base this primarily on Colossians 1:15 ('firstborn of all creation'), Revelation 3:14 ('the beginning of the creation of God'), and Proverbs 8:22 (Wisdom personified as 'brought forth'). The NWT inserts the word 'other' four times in Colossians 1:16-17 to make Jesus part of creation rather than its Creator. This teaching reduces Christ from eternal God to an exalted creature and undermines the sufficiency of His atoning sacrifice.",
    steelmanArguments: [steelmanArguments[0]],
    hiddenAssumptions: [
      "Prototokos ('firstborn') is equivalent to protoktistos ('first-created') — these are two different Greek words with different meanings",
      "If Jesus is called 'the beginning of creation,' He must be a creature — ignoring that arche means 'source, ruler, origin'",
      "The Michael-Jesus identification is explicitly stated in Scripture — when in fact no passage directly equates them",
      "A created being can be 'the exact representation of God's very being' (Heb 1:3) — a logical impossibility",
    ],
    mindGames: [mindGames[0], mindGames[2]],
    fallacies: [fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "jw",
    debriefPrompt:
      "How effectively did you demonstrate that 'firstborn' (prototokos) is a title of preeminence rather than a statement of origin? Were you able to show that the NWT's insertion of 'other' in Colossians 1:16-17 has no manuscript support? Did you address the Hebrews 1 argument that Christ is categorically above all angels?",
  },

  // ── Module 2: Trinity Denial ──
  {
    id: "jw-mod-trinity-denial",
    subjectId: "jw-trinity-denial",
    title: "Is the Trinity Pagan?",
    doctrineBrief:
      "Jehovah's Witnesses deny the Trinity, teaching that Jehovah alone is God, Jesus is a created angel, and the Holy Spirit is an impersonal active force. They claim the Trinity was borrowed from pagan religions and imposed on Christianity at the Council of Nicaea in 325 AD. The Watchtower publication 'Should You Believe in the Trinity?' is their primary resource, which selectively quotes scholars out of context to build a case against Trinitarianism. This denial affects their understanding of salvation, worship, and the nature of God.",
    steelmanArguments: [steelmanArguments[1], steelmanArguments[2]],
    hiddenAssumptions: [
      "Any doctrine formalized at a church council must be a pagan invention — ignoring that councils articulated existing beliefs under pressure from heresy",
      "The Holy Spirit cannot be a Person because the Bible uses impersonal imagery (wind, fire, water) — ignoring that the Bible also uses impersonal imagery for the Father (rock, fortress, consuming fire)",
      "If Jesus is God, He cannot pray to God — confusing the distinction between Persons and Being within the Godhead",
      "Monotheism requires unitarianism (one Person) — when the Shema (Deut 6:4) uses 'echad' (compound unity), not 'yachid' (absolute singularity)",
    ],
    mindGames: [mindGames[0], mindGames[1], mindGames[2]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "jw",
    debriefPrompt:
      "Did you successfully demonstrate that the Trinity is not a pagan import by showing the fundamental differences between pagan triads and biblical Trinitarianism? Were you able to cite pre-Nicene church fathers who affirmed Christ's deity? Could you show from John 1:1 in the Greek that 'a god' is an indefensible translation?",
  },

  // ── Module 3: 144,000 Theology ──
  {
    id: "jw-mod-144000",
    subjectId: "jw-144000",
    title: "Who Are the 144,000?",
    doctrineBrief:
      "The Watchtower teaches a two-class system of salvation: 144,000 'anointed' believers go to heaven to rule with Christ, while the 'great multitude' (other sheep) will live forever on a paradise earth. Only the anointed partake of the Memorial (communion) emblems. This doctrine was formalized by J.F. Rutherford in 1935 and has no precedent in Christian history. It creates a spiritual caste system within the JW organization and limits the new covenant to a shrinking class of elderly members.",
    steelmanArguments: [steelmanArguments[3]],
    hiddenAssumptions: [
      "Revelation uses symbolic numbers throughout (7, 12, 24, 1000) — but 144,000 is the one number that must be literal",
      "'Before the throne' (enopion tou thronou) means 'on earth' for the great multitude but 'in heaven' for the 24 elders and angels — inconsistent application of the same phrase",
      "The 'other sheep' of John 10:16 are an earthly class — when Jesus was referring to Gentile believers who would join Jewish believers in ONE flock",
      "Only 144,000 receive the new covenant — contradicting Hebrews 8:10-11 which extends the new covenant to all God's people",
    ],
    mindGames: [mindGames[0], mindGames[3]],
    fallacies: [fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "jw",
    debriefPrompt:
      "Were you able to expose the selective literalism in the JW interpretation of 144,000? Did you show that the 'great multitude' is described as being 'before the throne' in heaven? Could you demonstrate that the two-class system originated with Rutherford in 1935 and has no biblical foundation?",
  },

  // ── Module 4: NWT Translation Bias ──
  {
    id: "jw-mod-nwt-bias",
    subjectId: "jw-nwt-bias",
    title: "Is the NWT Trustworthy?",
    doctrineBrief:
      "The New World Translation (NWT) is the Watchtower Society's proprietary Bible translation, first published in 1961. While presented as the 'most accurate' translation, it contains numerous renderings that depart from the Greek and Hebrew text to support JW theology. Key issues include: adding 'other' in Colossians 1:16-17, rendering John 1:1 as 'a god,' inserting 'Jehovah' 237 times into the NT without manuscript support, changing 'cross' to 'torture stake,' and altering Philippians 2:6 to deny Christ's equality with God. The NWT translation committee was anonymous, and no member had publicly verifiable credentials in biblical languages.",
    steelmanArguments: [steelmanArguments[2], steelmanArguments[4]],
    hiddenAssumptions: [
      "An anonymous translation committee produces more objective results — when in fact anonymity removes accountability and peer review",
      "The NWT is endorsed by non-JW scholars — the few scholars cited by the Watchtower have either been quoted out of context or have explicitly denied endorsing the NWT as a whole",
      "Inserting 'Jehovah' into the NT 'restores' the original text — when no NT manuscript contains the Tetragrammaton and the apostles consistently used kurios (Lord) and theos (God)",
      "Translating stauros as 'torture stake' rather than 'cross' is more historically accurate — when archaeological evidence and early church testimony support crucifixion on a cross-shaped structure",
    ],
    mindGames: [mindGames[1], mindGames[3]],
    fallacies: [fallacies[0], fallacies[1]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "jw",
    debriefPrompt:
      "Did you effectively show specific examples of theological bias in the NWT? Were you able to explain why 'a god' in John 1:1 is grammatically indefensible? Could you demonstrate that the insertion of 'Jehovah' into the NT has no manuscript support? Did you redirect from translation debates to the original language evidence?",
  },

  // ── Module 5: Watchtower Authority ──
  {
    id: "jw-mod-watchtower-authority",
    subjectId: "jw-watchtower-authority",
    title: "Is the Governing Body God's Channel?",
    doctrineBrief:
      "The Watchtower Society claims that the Governing Body — a small group of men at JW headquarters in Warwick, New York — constitutes the 'faithful and discreet slave' of Matthew 24:45 and serves as Jehovah's sole channel of communication on earth. All doctrinal interpretation, organizational decisions, and spiritual guidance flow exclusively through this body. Members are expected to accept Governing Body teachings without independent verification and to shun any who question their authority. This claim creates an extra-biblical authority structure that effectively places the Governing Body between the believer and God.",
    steelmanArguments: [steelmanArguments[4]],
    hiddenAssumptions: [
      "Matthew 24:45 is a prophecy about a specific organization rather than a parable about individual faithfulness",
      "God has always worked through a single visible organization — ignoring that the biblical pattern shows God working through individuals, families, prophets, and a diverse church",
      "The Governing Body's authority is validated by their spiritual fruit — ignoring failed predictions, doctrinal reversals, and the shunning of dissenters",
      "Questioning the Governing Body equals questioning Jehovah — a claim that equates a human institution with God Himself",
    ],
    mindGames: [mindGames[2], mindGames[3]],
    fallacies: [fallacies[0], fallacies[3]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "jw",
    debriefPrompt:
      "Were you able to demonstrate that Matthew 24:45 is a parable about faithfulness, not an organizational appointment? Did you cite the Governing Body's failed prophecies as evidence against their claim to be God's channel? Could you show that the Berean model (Acts 17:11) encourages testing all teaching against Scripture — including the Governing Body's?",
  },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const jwTraining: AATSAvatarTraining = {
  avatarId: "jw",
  avatarName: "The Jehovah's Witness",
  emoji: "\u{1F4D6}",
  color: "border-teal-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
