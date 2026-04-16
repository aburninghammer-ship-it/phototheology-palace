// ─── AATS: Anti-Trinitarian Avatar Training ─────────────────────────────────
// SDA counter-apologetics training data for engaging anti-Trinitarian theology.

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
    id: "at-pioneer-history",
    title: "Pioneer Anti-Trinitarianism",
    description:
      "Early Adventist pioneers were semi-Arian and explicitly rejected the Trinity — proving the modern SDA position is an apostate departure",
  },
  {
    id: "at-rome-connection",
    title: "Trinity as Roman Import",
    description:
      "The Trinity doctrine originated at the Council of Nicaea under Constantine's political pressure and was formalized by the Catholic Church",
  },
  {
    id: "at-begotten-son",
    title: "Christ as Literally Begotten",
    description:
      "Jesus is the literal 'only begotten Son' — He had a beginning, derived from the Father before creation",
  },
  {
    id: "at-spirit-force",
    title: "Holy Spirit as Impersonal Force",
    description:
      "The Holy Spirit is God's power or breath, not a separate divine Person — making the Trinity a three-headed fiction",
  },
  {
    id: "at-egw-misquoted",
    title: "Ellen White Misquoted on Trinity",
    description:
      "Ellen White's earliest writings show she rejected the Trinity — later compilations distort her actual position",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "at-steel-pioneers",
    title: "The Pioneers Were Right",
    argument:
      "James White, Joseph Bates, J.N. Andrews, and Uriah Smith all rejected the Trinity. James White called it 'the old unscriptural Trinitarian creed.' These men were chosen by God to found the remnant church. If the Trinity were biblical, the Holy Spirit would have led the pioneers to embrace it. Instead, the church only adopted Trinitarianism in the mid-20th century under pressure to appear mainstream — a textbook case of Babylonian influence.",
    hiddenAssumptions: [
      "The pioneers were infallible on every doctrinal point, ignoring that the SDA church has always held to 'present truth' — progressive understanding",
      "Doctrinal development equals apostasy, which would also condemn the pioneers' own evolving positions on the Sabbath, sanctuary, and health reform",
      "The Holy Spirit must reveal all truth simultaneously, rather than progressively (John 16:13 — 'He will guide you INTO all truth')",
    ],
    sdaResponse:
      "The pioneers themselves held an evolving theology. James White initially rejected the Sabbath before embracing it. The church's understanding of the sanctuary, health reform, and religious liberty all deepened over time. Ellen White wrote in 1888: 'There is no excuse for anyone in taking the position that there is no more truth to be revealed.' Furthermore, Ellen White herself wrote clearly of Christ's full deity: 'In Christ is life, original, unborrowed, underived' (Desire of Ages, 530) — a statement impossible if Christ were derived from the Father. The shift to Trinitarianism came through Bible study, not Babylonian pressure.",
  },
  {
    id: "at-steel-nicaea",
    title: "Nicaea Invented the Trinity",
    argument:
      "The word 'Trinity' doesn't appear in Scripture — not once. The doctrine was formalized at the Council of Nicaea in 325 AD, convened by the pagan emperor Constantine who worshipped Sol Invictus. The term 'consubstantial' (homoousios) was borrowed from Greek philosophy, not Scripture. If this were biblical truth, why did it need a political council and philosophical terminology to articulate it?",
    hiddenAssumptions: [
      "A doctrine must use exact biblical vocabulary to be biblical — which would also eliminate 'millennium,' 'incarnation,' 'investigative judgment,' and 'remnant church' as phrases",
      "Nicaea invented the Trinity rather than articulated what was already believed against Arian innovation",
      "Constantine's involvement proves pagan corruption, yet Constantine also affirmed Sunday rest — should we reject the resurrection because Constantine affirmed it?",
    ],
    sdaResponse:
      "Nicaea did not invent the Trinity — it defended it against Arius, who innovated by teaching Christ was created. Pre-Nicene fathers (Ignatius c. 110 AD, Irenaeus c. 180 AD, Tertullian c. 200 AD) all affirm Christ's full deity. The absence of the word 'Trinity' is irrelevant — 'investigative judgment' as a phrase isn't in Scripture either, yet Adventists rightly teach it because the concept is thoroughly biblical. Doctrine is built from concepts, not vocabulary. Matthew 28:19 baptizes in one Name shared by three Persons. John 1:1 declares the Word was God. Acts 5:3-4 identifies the Spirit as God. The biblical data forces a Trinitarian conclusion whether or not you use the word.",
  },
  {
    id: "at-steel-begotten",
    title: "Jesus Had a Beginning — He Was Begotten",
    argument:
      "John 3:16 calls Jesus the 'only begotten Son.' Proverbs 8:22-25 describes Wisdom — universally applied to Christ — as 'brought forth' and 'set up from everlasting.' Colossians 1:15 calls Him 'firstborn of all creation.' These texts plainly teach that Jesus had an origin — He was brought into existence by the Father before creation. A begotten son, by definition, has a beginning. If Christ were co-eternal, 'begotten' becomes meaningless.",
    hiddenAssumptions: [
      "'Begotten' in John 3:16 (monogenes) means 'generated/produced' when modern scholarship confirms it means 'unique, one-of-a-kind' (cf. Hebrews 11:17 — Isaac is called monogenes though Abraham had other sons)",
      "Proverbs 8 is a straightforward Christological text when it is personified Wisdom poetry — and even if applied to Christ, 'from everlasting' (v. 23) places Him before time itself",
      "'Firstborn' (prototokos) means 'first created' when biblically it denotes rank and supremacy (Psalm 89:27 — David called firstborn though youngest)",
    ],
    sdaResponse:
      "Monogenes in John 3:16 means 'unique, one-of-a-kind' — not 'produced.' In Hebrews 11:17, Isaac is called monogenes even though Abraham had Ishmael. The word describes uniqueness of relationship, not origin. Proverbs 8's Wisdom figure says 'from everlasting' (v. 23) — if taken as Christ, it proves His eternality, not His creation. And Colossians 1:15's 'firstborn' is immediately followed by 'by Him ALL things were created' (v. 16) — if He created all things, He cannot be among created things. Ellen White settles it: 'In Christ is life, original, unborrowed, underived.' You cannot have a derived being with underived life. That's a contradiction.",
  },
  {
    id: "at-steel-spirit-force",
    title: "The Holy Spirit Is a Force, Not a Person",
    argument:
      "The Holy Spirit is described as being 'poured out' (Acts 2:17), 'quenched' (1 Thess 5:19), and 'filling' people (Eph 5:18). These are descriptions of a force or energy, not a person. You don't 'pour out' a person. Furthermore, the Spirit has no name, no throne scene, and no distinct worship in Scripture. If the Spirit were a co-equal divine Person, why is He absent from the throne room of Revelation 4-5?",
    hiddenAssumptions: [
      "Metaphorical language about the Spirit proves impersonality — yet Jesus is also called 'living water' (John 4:10), 'bread' (John 6:35), and a 'door' (John 10:9) without anyone concluding He's impersonal",
      "The Spirit's absence from a throne vision proves non-personhood — yet the Father's physical form is also absent in Revelation (He is described as light and color, not a body)",
      "Personhood requires a name and a visible seat of authority",
    ],
    sdaResponse:
      "The Holy Spirit speaks (Acts 13:2), can be lied to (Acts 5:3-4 — and lying to the Spirit is called lying to God), has a mind (Romans 8:27), intercedes (Romans 8:26), can be grieved (Ephesians 4:30), teaches and reminds (John 14:26), and testifies (John 15:26). Forces don't grieve. Forces don't speak. Forces don't intercede with groanings. Every personal attribute is ascribed to the Spirit. Jesus Himself uses personal pronouns — 'He will guide you into all truth' (John 16:13). The metaphorical language of 'pouring' no more disproves personhood than calling Jesus 'bread' disproves His.",
  },
  {
    id: "at-steel-egw-antitrinitarian",
    title: "Ellen White Was Anti-Trinitarian",
    argument:
      "Ellen White's earliest writings never use the word 'Trinity.' Her husband James White openly rejected it. She never corrected him. In her early visions, she described the Father and Son but did not describe the Holy Spirit as a separate divine Being. Her later statements about the Spirit were compiled and edited by others after her death. The real Ellen White was non-Trinitarian.",
    hiddenAssumptions: [
      "Silence on a term equals rejection of the concept — Ellen White never used 'inerrancy' either but clearly upheld Scripture's authority",
      "A wife's failure to publicly correct her husband on every point equals agreement with his position",
      "Post-death compilations are inherently unreliable, ignoring that compilations are drawn from her published and unpublished writings with full source documentation",
    ],
    sdaResponse:
      "Ellen White wrote in Desire of Ages (1898): 'In Christ is life, original, unborrowed, underived' (p. 530). In Evangelism (1946 compilation, sourced from 1905 manuscript): 'There are three living persons of the heavenly trio… the Father, the Son, and the Holy Spirit' (p. 615). She also wrote: 'The Holy Spirit is a person, for He beareth witness with our spirits that we are the children of God' (Evangelism, 616). These are her own words, published or written during her lifetime, not later inventions. Her theology developed — just as the pioneers' theology developed on the Sabbath, the sanctuary, and health reform. Development is not apostasy; it is the work of the Spirit guiding into all truth (John 16:13).",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "at-mg-guilt-association",
    name: "Guilt by Association (Rome Strategy)",
    description:
      "Linking the Trinity to Rome/Babylon to trigger emotional rejection before rational evaluation",
    example:
      "\"The Trinity came from Rome → Rome is Babylon → Therefore the Trinity is Babylonian paganism.\"",
    detectionTip:
      "Ask: Does Rome also teach the divinity of Christ and the resurrection? By this logic, those doctrines are also Babylonian. The argument proves too much.",
  },
  {
    id: "at-mg-word-absence",
    name: "Word Absence = Doctrine False",
    description:
      "Insisting that if a theological term doesn't appear in the Bible, the doctrine is false",
    example:
      "\"The word 'Trinity' isn't in the Bible, so the doctrine isn't biblical.\"",
    detectionTip:
      "Neither are 'incarnation,' 'millennium,' 'investigative judgment,' or 'remnant church' as exact phrases. Doctrine is built from concepts, not vocabulary.",
  },
  {
    id: "at-mg-false-simplicity",
    name: "False Simplicity",
    description:
      "Presenting their model as 'simple and biblical' to make the Trinity look unnecessarily complex",
    example:
      "\"God is simply one Person — the Father. That's what the Bible plainly teaches. The Trinity overcomplicates it.\"",
    detectionTip:
      "Simplicity can be deceptive. Scripture presents tension: one God (Deut 6:4) + three divine Persons (Matt 28:19). If your theology removes all tension, it may be removing truth.",
  },
  {
    id: "at-mg-over-literalize",
    name: "Over-Literalizing 'Begotten'",
    description:
      "Forcing 'begotten' into a biological generation meaning to prove Christ had a beginning",
    example:
      "\"A begotten son must have been brought into existence. If Jesus was begotten, He had a beginning.\"",
    detectionTip:
      "Check the Greek. Monogenes means 'unique/one-of-a-kind,' not 'produced.' Isaac is called monogenes (Heb 11:17) though Abraham had other sons.",
  },
  {
    id: "at-mg-pioneer-authority",
    name: "Pioneer Infallibility",
    description:
      "Treating early Adventist pioneers as doctrinally infallible to lock the church into 1850s theology",
    example:
      "\"James White rejected the Trinity. Are you saying the founders of your church were wrong?\"",
    detectionTip:
      "The pioneers themselves embraced 'present truth' — progressive understanding. James White initially rejected the Sabbath before accepting it. Growth is not apostasy.",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "at-fall-genetic",
    name: "Genetic Fallacy",
    definition: "Rejecting a doctrine based on its alleged origin rather than its truth content",
    example: "\"The Trinity came from Nicaea/Rome, therefore it's false\"",
    counterMove: "Truth is not determined by origin but by evidence. Evaluate the biblical data directly: Father is God, Son is God, Spirit is God, yet one God.",
  },
  {
    id: "at-fall-equivocation",
    name: "Equivocation on 'Begotten'",
    definition: "Using 'begotten' in a biological sense when the biblical Greek means 'unique'",
    example: "\"Begotten means born — therefore Jesus was born into existence\"",
    counterMove: "Monogenes = unique, not generated. Hebrews 11:17 calls Isaac monogenes though Abraham had Ishmael. The word describes relationship, not origin.",
  },
  {
    id: "at-fall-argument-from-silence",
    name: "Argument from Silence",
    definition: "Concluding that because the word 'Trinity' isn't in the Bible, the concept isn't there",
    example: "\"Show me the word Trinity in the Bible\"",
    counterMove: "Show me the phrase 'investigative judgment' or 'remnant church' in the Bible. Concepts precede terminology. Matthew 28:19 is Trinitarian structure.",
  },
  {
    id: "at-fall-false-dilemma",
    name: "False Dilemma",
    definition: "Presenting only two options — strict unitarianism or polytheism — excluding Trinitarianism",
    example: "\"Either God is one Person, or you believe in three gods\"",
    counterMove: "The Trinity affirms ONE God in three Persons — not three gods. This is neither unitarianism nor tritheism. It's a third category that fits ALL the biblical data.",
  },
  {
    id: "at-fall-composition",
    name: "Fallacy of Composition",
    definition: "Assuming that because pagan religions had triads, all three-in-one concepts are pagan",
    example: "\"Pagans had three gods, Christians have three Persons — same thing\"",
    counterMove: "Pagan triads = three separate gods in hierarchy. Trinity = one God, three co-equal Persons. That's not a small difference — it's a different category entirely.",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "at-pioneer-history",
    title: "Pioneer Development ≠ Pioneer Infallibility",
    sdaPosition:
      "SDA pioneers held evolving theology. The church embraced 'present truth' — progressive revelation. The shift to Trinitarianism came through Bible study, Ellen White's writings, and the Spirit's guidance, not Babylonian compromise.",
    keyScriptures: [
      "John 16:13 — 'He will guide you into all truth' — truth unfolds progressively",
      "Proverbs 4:18 — 'The path of the just… shineth more and more unto the perfect day'",
      "Acts 18:26 — Apollos 'knew only the baptism of John' until Aquila and Priscilla 'expounded unto him the way of God more perfectly'",
    ],
    counterArguments: [
      "James White initially rejected the Sabbath — does that mean the Sabbath is false?",
      "The pioneers' views on health reform also evolved — should we return to 1850s medical practice?",
      "Ellen White herself wrote: 'There is no excuse for anyone in taking the position that there is no more truth to be revealed' (1888)",
    ],
    closingStatement:
      "Doctrinal growth is the hallmark of a living church, not evidence of apostasy. The pioneers would be the first to insist: follow the Bible, not the pioneers.",
  },
  {
    subjectId: "at-begotten-son",
    title: "Christ's Eternal, Unborrowed, Underived Life",
    sdaPosition:
      "Christ is fully God — co-eternal, co-equal with the Father. 'Begotten' (monogenes) means unique, not originated. Ellen White: 'In Christ is life, original, unborrowed, underived.'",
    keyScriptures: [
      "John 1:1 — 'The Word was God'",
      "John 8:58 — 'Before Abraham was, I AM'",
      "Micah 5:2 — 'Whose goings forth have been from of old, from everlasting'",
      "Colossians 2:9 — 'In Him dwelleth all the fulness of the Godhead bodily'",
      "Hebrews 1:8 — 'Unto the Son He saith, Thy throne, O God, is for ever and ever'",
      "Isaiah 9:6 — 'The mighty God, The everlasting Father'",
    ],
    counterArguments: [
      "If Christ is created, His sacrifice loses infinite value — a finite being cannot atone for infinite sin",
      "If Christ had a beginning, Micah 5:2's 'from everlasting' is a lie",
      "Colossians 1:16 says 'by Him ALL things were created' — if He's created, He created Himself (logical impossibility)",
    ],
    closingStatement:
      "You cannot have a derived being with underived life. That's not theology — that's a contradiction. Christ is either fully God or salvation is compromised.",
  },
  {
    subjectId: "at-spirit-force",
    title: "The Spirit Is a Person, Not a Force",
    sdaPosition:
      "The Holy Spirit possesses every attribute of personhood: speech, will, emotion, intellect. He is identified as God in Acts 5:3-4.",
    keyScriptures: [
      "Acts 5:3-4 — Lying to the Spirit = lying to God",
      "Acts 13:2 — 'The Holy Ghost said, Separate me Barnabas and Saul'",
      "Romans 8:26-27 — The Spirit intercedes with groanings, has a mind",
      "Ephesians 4:30 — 'Grieve not the Holy Spirit of God'",
      "John 16:13 — 'He will guide you into all truth… He shall not speak of Himself'",
      "John 14:26 — 'The Comforter… He shall teach you all things'",
    ],
    counterArguments: [
      "Forces don't grieve (Eph 4:30). Forces don't speak (Acts 13:2). Forces don't intercede (Rom 8:26).",
      "Jesus uses personal pronouns for the Spirit — 'He' not 'it' (John 16:13)",
      "If the Spirit is merely a force, then being 'filled with the Spirit' equals being filled with electricity — robbing Pentecost of its relational meaning",
    ],
    closingStatement:
      "The anti-Trinitarian reduces the Spirit to a battery. But Scripture presents a Person who speaks, teaches, grieves, intercedes, and can be lied to. That is not a force — that is God.",
  },
  {
    subjectId: "at-rome-connection",
    title: "The Genetic Fallacy of the Rome Argument",
    sdaPosition:
      "The Trinity was not invented at Nicaea — it was defended against Arius. Pre-Nicene fathers affirm Christ's full deity. Rome also teaches the resurrection — does that make it pagan?",
    keyScriptures: [
      "Matthew 28:19 — Baptismal formula in one Name of Father, Son, and Spirit",
      "2 Corinthians 13:14 — Trinitarian benediction: grace of Christ, love of God, fellowship of Spirit",
      "John 1:1 — 'The Word was God' — pre-Nicene, pre-Constantine, pre-Rome",
    ],
    counterArguments: [
      "Rome also teaches the divinity of Christ, the resurrection, and the Bible itself — by guilt-by-association logic, reject those too",
      "Ignatius (c. 110 AD), Justin Martyr (c. 150 AD), Irenaeus (c. 180 AD) all affirm Christ's deity before Constantine was born",
      "Nicaea responded to Arius who innovated — the Trinitarians were the conservatives defending existing belief",
    ],
    closingStatement:
      "You're not rejecting the Trinity because it's unbiblical — you're rejecting it because it doesn't fit a model you prefer. The question isn't what fits your model. The question is: what explains ALL the data of Scripture without contradiction?",
  },
  {
    subjectId: "at-egw-misquoted",
    title: "Ellen White's Clear Trinitarian Statements",
    sdaPosition:
      "Ellen White's own published and manuscript writings affirm three divine Persons and Christ's full, underived deity.",
    keyScriptures: [
      "Desire of Ages, 530 — 'In Christ is life, original, unborrowed, underived'",
      "Evangelism, 615 — 'There are three living persons of the heavenly trio'",
      "Evangelism, 616 — 'The Holy Spirit is a person, for He beareth witness with our spirits'",
      "Special Testimonies, Series B, No. 7 — 'The Eternal Father… and Jesus Christ' as co-workers",
    ],
    counterArguments: [
      "These are her published words with full manuscript sourcing — not later editorial inventions",
      "'Life, original, unborrowed, underived' is impossible for a being who was brought into existence",
      "She explicitly called the Spirit a 'person' — not a force, not an influence — a person",
    ],
    closingStatement:
      "Ellen White's theology developed just as the pioneers' theology developed. That development led her to affirm Christ's full deity and the Spirit's personhood in her own published writings. Development is the Spirit's work.",
  },
];

// ── Modules ─────────────────────────────────────────────────────────────────

const modules: AATSModule[] = subjects.map((subject, i) => ({
  id: `at-mod-${i + 1}`,
  subjectId: subject.id,
  title: `Module ${i + 1}: ${subject.title}`,
  doctrineBrief: subject.description,
  steelmanArguments: [steelmanArguments[i]],
  hiddenAssumptions: steelmanArguments[i].hiddenAssumptions,
  mindGames: [mindGames[i % mindGames.length]],
  fallacies: [fallacies[i % fallacies.length]],
  counterStrategy: counterStrategies[i],
  debateSimLink: "anti-trinitarian",
  debriefPrompt: `Review how you defended the biblical position against anti-Trinitarian argument: "${subject.title}". Did you address the hidden assumptions? Did you use Scripture effectively?`,
}));

// ── Export ───────────────────────────────────────────────────────────────────

export const antiTrinitarianTraining: AATSAvatarTraining = {
  avatarId: "anti-trinitarian",
  avatarName: "Elder Arius — The Anti-Trinitarian",
  emoji: "⚖️",
  color: "text-amber-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
