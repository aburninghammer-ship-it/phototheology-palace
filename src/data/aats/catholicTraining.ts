// ─── AATS Training Data: The Catholic ─────────────────────────────────────
// Apologetics Avatar Training System — Catholic worldview module
// Perspective: SDA (Seventh-day Adventist) counter-apologetics

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ──────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "papal-authority",
    title: "Papal Authority",
    description:
      "The Pope is Christ's vicar on earth; Peter was the first pope",
  },
  {
    id: "tradition-equal-scripture",
    title: "Tradition Equal to Scripture",
    description:
      "Sacred Tradition has equal authority with Scripture (Sola Scriptura is wrong)",
  },
  {
    id: "sunday-sacredness",
    title: "Sunday Sacredness",
    description:
      "The Church changed the Sabbath to Sunday by apostolic authority",
  },
  {
    id: "church-authority",
    title: "Church Authority",
    description:
      "The Catholic Church is the one true church with unbroken apostolic succession",
  },
  {
    id: "sacramental-system",
    title: "Sacramental System",
    description:
      "Grace is primarily dispensed through the seven sacraments",
  },
];

// ── Steelman Arguments ────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "catholic-sa-peter-rock",
    title: "Peter is the Rock",
    argument:
      "Matthew 16:18 establishes papal authority. Jesus said, 'You are Peter (Petros), and on this rock (petra) I will build My church.' The Aramaic original uses 'Kepha' for both, making no distinction. Peter is the rock-foundation, and his successors inherit that foundational authority. This is affirmed by early Fathers like Cyprian, Tertullian, and Leo the Great.",
    hiddenAssumptions: [
      "Petra = Peter exclusively, ignoring the Greek wordplay where 'petra' (large rock/bedrock) differs from 'Petros' (small stone/pebble)",
      "Peter's role = perpetual office that transfers to successors, rather than a unique apostolic commission that died with him",
      "Rome's claim to Peter's see is historically verified, despite significant gaps and disputes in the early record of Roman bishops",
    ],
    sdaResponse:
      "In the Greek text, 'Petros' (masculine, a stone) differs from 'petra' (feminine, bedrock). Christ is the petra — the bedrock (1 Corinthians 10:4; Ephesians 2:20). Peter himself identifies Christ as the cornerstone, not himself (1 Peter 2:4-8). Even if Peter had a leadership role, nothing in Scripture establishes a succession mechanism. The early church operated collegially through councils, not through papal monarchy. Historical evidence for an unbroken line of Roman bishops in the first two centuries is fragmentary at best.",
  },
  {
    id: "catholic-sa-tradition-before-bible",
    title: "The Church Existed Before the Bible",
    argument:
      "The Church existed before the Bible — Tradition must guide interpretation. For the first several centuries, Christians relied on oral apostolic teaching, not a completed canon. The Church determined which books were canonical at the Councils of Hippo (393) and Carthage (397). Without the Church's authority, there is no Bible. Therefore Sacred Tradition and the Magisterium are necessary to correctly interpret Scripture.",
    hiddenAssumptions: [
      "Oral tradition was never written down, ignoring that the apostles themselves committed their teaching to writing and urged believers to hold to what was written (2 Timothy 3:16-17; 2 Peter 1:19-21)",
      "Church authority = infallibility, conflating the historical role of recognizing canonical books with an ongoing power to create new doctrines",
      "Sola Scriptura means 'no tradition at all,' when it actually means Scripture is the final, supreme authority — not the only source of information",
    ],
    sdaResponse:
      "The Church did not 'create' the Bible; it recognized what the Holy Spirit had already inspired. The Old Testament canon was established before the Church existed. Paul told Timothy that Scripture was sufficient to make one 'complete, thoroughly equipped for every good work' (2 Timothy 3:16-17). Jesus repeatedly rebuked the Pharisees for elevating their tradition above God's Word (Mark 7:8-13). The question is not whether tradition exists, but whether any tradition can override the written Word of God. SDAs affirm that Scripture alone is the infallible rule of faith.",
  },
  {
    id: "catholic-sa-sabbath-change",
    title: "The Church Changed the Sabbath",
    argument:
      "The Church changed the Sabbath — proof of its authority. Catholic catechisms openly state that the change from Saturday to Sunday was made by Church authority, not by any explicit New Testament command. Cardinal Gibbons wrote, 'You may read the Bible from Genesis to Revelation, and you will not find a single line authorizing the sanctification of Sunday.' This proves the Church has authority above Scripture.",
    hiddenAssumptions: [
      "A church can change God's law, despite Christ saying 'not one jot or tittle' would pass from the law (Matthew 5:17-18)",
      "The change = legitimate authority rather than the predicted apostasy — Daniel 7:25 foretells a power that would 'think to change times and laws'",
      "Constantine's edict (321 AD) and later Church councils were apostolic in nature, when in reality the shift was gradual and politically motivated",
    ],
    sdaResponse:
      "This is actually one of the most honest admissions in Catholic apologetics — and SDAs agree with the diagnosis while drawing the opposite conclusion. The Bible nowhere authorizes Sunday worship. The seventh-day Sabbath was instituted at Creation (Genesis 2:2-3), codified at Sinai (Exodus 20:8-11), kept by Christ (Luke 4:16), and observed by the apostles (Acts 13:42-44; 17:2; 18:4). The gradual shift to Sunday was a post-apostolic development driven by anti-Jewish sentiment and imperial politics, not divine mandate. Daniel 7:25 predicted exactly this: a power that would 'think to change times and laws.' Far from proving Church authority, the Sabbath-to-Sunday change is evidence of the great apostasy.",
  },
  {
    id: "catholic-sa-apostolic-succession",
    title: "Apostolic Succession Guarantees Doctrinal Purity",
    argument:
      "Apostolic succession guarantees doctrinal purity. The Catholic Church can trace an unbroken chain of bishops from the apostles to the present day. This chain ensures that doctrine has been faithfully preserved. Without such a visible, institutional guarantee, Christianity splinters into thousands of contradictory denominations — as Protestantism proves.",
    hiddenAssumptions: [
      "Succession = doctrinal correctness, when the Bible warns that even apostolic-era leaders would fall into error (Acts 20:29-30; Galatians 2:11-14)",
      "The early church was monolithic in its beliefs and governance, ignoring the diversity of practice and the collegial nature of early church leadership",
      "No breaks in the chain exist, despite the Western Schism (1378-1417) when two or three rival popes each claimed legitimate succession simultaneously",
    ],
    sdaResponse:
      "Scripture never establishes a mechanism of doctrinal infallibility through institutional succession. Paul warned the Ephesian elders that 'from among yourselves men will rise up, speaking perverse things, to draw away the disciples after themselves' (Acts 20:30). The test of faithfulness is not institutional lineage but fidelity to apostolic teaching as recorded in Scripture (Galatians 1:8-9). The Bereans were commended for testing even Paul's teaching against Scripture (Acts 17:11). The medieval papacy's corruption — including the selling of indulgences, the Inquisition, and the Western Schism — demonstrates that succession does not guarantee purity.",
  },
  {
    id: "catholic-sa-church-fathers",
    title: "Church Fathers Support Catholic Doctrine",
    argument:
      "Church Fathers support Catholic doctrine. Ignatius of Antioch (c. 110 AD) wrote of the bishop's authority and the Eucharist as the 'medicine of immortality.' Irenaeus (c. 180 AD) appealed to apostolic succession against Gnostics. Augustine, Jerome, Ambrose, and others affirmed doctrines that align with Catholic teaching. The unanimous consent of the Fathers is a pillar of Catholic theology.",
    hiddenAssumptions: [
      "All Fathers agreed, when in reality they frequently contradicted one another and even themselves on key doctrines",
      "Patristic consensus = infallible, when the Fathers themselves pointed to Scripture as the supreme authority (e.g., Augustine's famous dictum that he would not believe the gospel except the authority of the Church moved him — yet he also wrote that Scripture alone was free from error)",
      "Later Catholic dogma matches early Fathers, ignoring that doctrines like papal infallibility (1870), the Immaculate Conception (1854), and the Assumption of Mary (1950) have no patristic foundation",
    ],
    sdaResponse:
      "Selective quotation of Church Fathers creates a misleading picture. Many Fathers held positions that contradict later Catholic dogma: Origen denied eternal hell, Tertullian became a Montanist, and even Augustine's views on predestination were far more Protestant than Catholic. The Fathers themselves consistently appealed to Scripture as the final authority. Cyril of Jerusalem wrote, 'In regard to the divine and holy mysteries of the faith, not the least part may be handed on without the Holy Scriptures.' The proper use of the Fathers is as historical witnesses, not as infallible authorities alongside Scripture.",
  },
];

// ── Mind Games ────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "catholic-mg-appeal-to-antiquity",
    name: "Appeal to Antiquity",
    description:
      "Citing 2000 years of tradition as if age proves truth",
    example:
      "'The Catholic Church has been around for 2,000 years. Your denomination started in the 1800s. How can you claim to be right when we've been teaching this since the apostles?' This frames the discussion as old = true and new = false, ignoring that truth is determined by Scripture, not by institutional age.",
    detectionTip:
      "When you hear 'We've always taught this' or 'The Church has 2,000 years of history,' ask: Does the age of a belief make it true? The Pharisees had centuries of tradition too, and Jesus rebuked them for making the Word of God void through it (Mark 7:13). Age proves persistence, not correctness. The question is always: What does Scripture say?",
  },
  {
    id: "catholic-mg-institutional-authority-pressure",
    name: "Institutional Authority Pressure",
    description:
      "Implying that questioning the Church means questioning Christ Himself",
    example:
      "'Jesus said, \"He who hears you hears Me\" (Luke 10:16). If you reject the Church's teaching, you are rejecting Christ Himself. Do you really want to put your private interpretation above the Body of Christ?' This creates enormous psychological pressure by making any disagreement feel like a personal attack on Jesus.",
    detectionTip:
      "Recognize the equation being made: Church leadership = Christ's voice. But Luke 10:16 was spoken to the seventy disciples about their specific mission, not to a perpetual institution. Jesus also said His sheep hear His voice (John 10:27) — and that voice is known through His Word. When challenged with 'Are you rejecting Christ?', redirect: 'I'm testing what I hear against what Christ actually said in Scripture, just as the Bereans did.'",
  },
  {
    id: "catholic-mg-historical-overwhelm",
    name: "Historical Overwhelm",
    description:
      "Burying opponents under mountains of patristic quotes without context",
    example:
      "'Let me share what Ignatius, Irenaeus, Clement, Polycarp, Justin Martyr, Cyprian, Athanasius, Chrysostom, Augustine, Jerome, Leo, and Gregory all said about this...' The goal is not genuine historical discussion but information overload — making you feel unqualified to respond because you haven't read all the Fathers.",
    detectionTip:
      "When someone dumps a list of 10+ Church Father quotations, pause and ask: (1) Are these quotes in context? (2) Did these Fathers agree with each other on this point? (3) Does any number of uninspired human opinions override an inspired biblical text? You don't need to out-quote them on patristics; you need to anchor in Scripture. Say: 'I respect the Fathers as historical witnesses, but can we look at what the Bible itself says?'",
  },
  {
    id: "catholic-mg-unity-argument",
    name: "Unity Argument",
    description:
      "Claiming Protestant division proves Sola Scriptura fails while ignoring internal Catholic disagreement",
    example:
      "'There are 40,000 Protestant denominations, all claiming to follow the Bible alone. This proves Sola Scriptura doesn't work — you need the Church's authoritative interpretation. Only Catholicism provides visible unity.' This weaponizes Protestant diversity while concealing the massive internal disagreements within Catholicism.",
    detectionTip:
      "The '40,000 denominations' number is wildly inflated (it counts every independent congregation as a separate denomination). But more importantly, Catholicism has its own deep divisions: traditionalists vs. progressives, sedevacantists, Eastern Catholic vs. Latin rite disagreements, dissent on contraception, priestly celibacy, and more. Unity under an institutional hierarchy is not the same as unity in truth. Jesus prayed for unity in truth (John 17:17-21), not uniformity under a single human authority.",
  },
];

// ── Fallacies ─────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "catholic-f-appeal-to-authority",
    name: "Appeal to Authority (Magisterial)",
    definition:
      "Church councils said it, therefore it's true — even when contradicting Scripture",
    example:
      "'The Council of Trent declared that anyone who denies the seven sacraments is anathema. Therefore the seven sacraments are divinely instituted.' The authority of the claim rests entirely on the Council's declaration, not on a demonstration from Scripture that all seven sacraments were instituted by Christ.",
    counterMove:
      "Ask: 'Where does Jesus or any apostle institute all seven sacraments in Scripture?' Press for biblical evidence, not conciliar decree. Point out that councils have contradicted each other (e.g., the Council of Constance endorsed conciliarism; Vatican I rejected it). A council's decree is only as valid as its conformity to Scripture.",
  },
  {
    id: "catholic-f-circular-reasoning",
    name: "Circular Reasoning (Ecclesial Infallibility)",
    definition:
      "The Church is infallible because the Church says it's infallible",
    example:
      "'How do we know the Church is infallible? Because Christ promised the gates of hell would not prevail against it (Matthew 16:18), and the Church — through its infallible Magisterium — has confirmed this interpretation.' The claim of infallibility is used to validate the very interpretation that establishes infallibility.",
    counterMove:
      "Expose the circle: 'You're using the Church's interpretation to prove the Church's authority, which is needed to validate the Church's interpretation. That's circular.' Matthew 16:18 promises the church will endure, not that any single institution will be doctrinally inerrant. The church endures because Christ sustains His people through His Word, not because one institution cannot err.",
  },
  {
    id: "catholic-f-appeal-to-antiquity",
    name: "Appeal to Antiquity (Argumentum ad Antiquitatem)",
    definition:
      "We've done it this way for centuries, so it must be right",
    example:
      "'The veneration of saints and Mary has been practiced since the earliest centuries of Christianity. You can't dismiss something with such deep roots in Christian history.' The implicit logic is: old practice = correct practice. But age alone does not validate a practice — pagan religions are even older.",
    counterMove:
      "Respond: 'How old is a practice that matters less than whether it's biblical. Israel practiced idolatry for centuries — that didn't make it right (Jeremiah 44:17-18). The question is not when a practice started but whether God authorized it. Where does Scripture command the veneration of saints or prayers to Mary?'",
  },
  {
    id: "catholic-f-red-herring",
    name: "Red Herring (Canon Deflection)",
    definition:
      "When challenged on doctrine, shifting to 'but who gave you the Bible?' to avoid the argument",
    example:
      "'You say we should follow the Bible alone, but who determined which books are in the Bible? The Catholic Church did! Without us, you wouldn't even have a Bible.' This diverts from the actual doctrinal question being discussed (e.g., the Sabbath, purgatory, Mary) to the meta-question of canon formation.",
    counterMove:
      "Redirect firmly: 'We were discussing [the actual topic]. The question of the canon is a separate discussion. But briefly: the Church recognized the canon; it didn't create it. A jeweler who identifies a genuine diamond didn't create the diamond. The books are inspired because God breathed them, not because a council voted on them. Now, can we return to the question of what Scripture actually teaches about [topic]?'",
  },
];

// ── Counter Strategies ────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "papal-authority",
    title: "Countering Papal Authority",
    sdaPosition:
      "The Bible teaches that Christ alone is the Head of the Church (Ephesians 1:22; 5:23; Colossians 1:18). No human being holds the office of Christ's vicar on earth. Peter was a prominent apostle but not a pope. The doctrine of papal supremacy developed gradually over centuries and was not the teaching of the early church. SDAs identify the papacy as a key prophetic player in Daniel 7 and Revelation 13, a power that would arise among the nations of divided Rome and would 'think to change times and laws.'",
    keyScriptures: [
      "Matthew 23:8-10 — 'Do not call anyone on earth your father; for One is your Father, He who is in heaven.'",
      "1 Peter 5:1-4 — Peter calls himself a 'fellow elder,' not a supreme pontiff, and points to Christ as the 'Chief Shepherd.'",
      "Acts 15:13-19 — At the Jerusalem Council, James (not Peter) renders the final judgment, contradicting the claim that Peter held supreme authority.",
      "Ephesians 2:20 — The church is built on the foundation of apostles and prophets, with Christ Jesus as the chief cornerstone — not on Peter alone.",
    ],
    counterArguments: [
      "The Greek distinction between 'Petros' (a stone, masculine) and 'petra' (bedrock, feminine) in Matthew 16:18 suggests Jesus was pointing to Himself or to Peter's confession as the rock, not to Peter's person as a perpetual office.",
      "Peter himself was rebuked by Paul publicly for doctrinal inconsistency (Galatians 2:11-14), demonstrating that Peter held no infallible authority even among the apostles.",
      "The earliest lists of Roman bishops are inconsistent and historically disputed. Scholars like Eamon Duffy (a Catholic historian) acknowledge that the monarchical episcopate in Rome did not exist in the first century.",
      "Daniel 7:8, 20-25 describes a 'little horn' power arising from the fourth beast (Rome) that speaks 'great words against the Most High' and thinks to 'change times and laws' — a prophetic identification that SDAs apply to the papal system.",
    ],
    closingStatement:
      "Christ alone is the Head of the Church. He needs no human vicar. The doctrine of papal supremacy lacks biblical foundation and is, in prophetic terms, a fulfillment of the predicted apostasy. Our allegiance belongs to the Chief Shepherd who speaks through His Word, not through any earthly throne.",
  },
  {
    subjectId: "tradition-equal-scripture",
    title: "Countering Tradition as Co-Authority with Scripture",
    sdaPosition:
      "SDAs affirm Sola Scriptura — that the Bible is the sole infallible rule of faith and practice. This does not mean tradition is worthless or that we ignore history, but that all tradition must be tested by and submitted to the authority of God's written Word. When tradition and Scripture conflict, Scripture prevails. Jesus Himself established this principle when He repeatedly confronted the Pharisees for elevating their oral traditions above the commandments of God.",
    keyScriptures: [
      "Mark 7:8-13 — 'For laying aside the commandment of God, you hold the tradition of men... making the word of God of no effect through your tradition.'",
      "2 Timothy 3:16-17 — 'All Scripture is given by inspiration of God... that the man of God may be complete, thoroughly equipped for every good work.'",
      "Isaiah 8:20 — 'To the law and to the testimony! If they do not speak according to this word, it is because there is no light in them.'",
      "Revelation 22:18-19 — A warning against adding to or taking from the prophetic Word, underscoring the sufficiency and finality of God's revealed truth.",
    ],
    counterArguments: [
      "The apostles committed their essential teaching to writing precisely because they knew oral tradition would be corrupted over time (2 Peter 1:15; 3:1-2; John 20:31).",
      "The Catholic claim that 'the Church gave us the Bible' confuses recognition with creation. The Holy Spirit inspired the writings; the Church recognized what was already authoritative. A court that rules on the constitutionality of a law did not write the Constitution.",
      "Many Catholic doctrines defended as 'Sacred Tradition' — papal infallibility (1870), the Immaculate Conception (1854), the Assumption of Mary (1950) — were defined centuries after the apostolic era, proving they are not genuinely apostolic traditions.",
      "Sola Scriptura does not mean 'solo Scriptura' (me and my Bible alone). It means Scripture is the supreme authority to which all other authorities (councils, creeds, traditions) must submit. This is precisely what the Reformers taught and what the Bereans modeled (Acts 17:11).",
    ],
    closingStatement:
      "God's Word is a lamp to our feet and a light to our path (Psalm 119:105). Tradition that conforms to Scripture is valuable; tradition that contradicts Scripture is dangerous. We follow the principle of Jesus Himself: 'It is written' (Matthew 4:4).",
  },
  {
    subjectId: "sunday-sacredness",
    title: "Countering Sunday Sacredness",
    sdaPosition:
      "The seventh-day Sabbath (Saturday) was established at Creation, enshrined in the Ten Commandments, kept by Christ, and observed by the apostolic church. No biblical text transfers the sanctity of the seventh day to the first day of the week. The shift to Sunday worship was a gradual, post-apostolic development driven by anti-Jewish sentiment, Roman imperial policy (Constantine's Sunday law in 321 AD), and the growing authority of the Bishop of Rome. Catholic sources themselves admit there is no scriptural basis for Sunday worship — and SDAs agree, drawing prophetic significance from this admission.",
    keyScriptures: [
      "Genesis 2:2-3 — God rested on the seventh day, blessed it, and sanctified it — at Creation, before any Jewish nation existed.",
      "Exodus 20:8-11 — 'Remember the Sabbath day, to keep it holy. Six days you shall labor... but the seventh day is the Sabbath of the LORD your God.'",
      "Luke 4:16 — 'As His custom was, [Jesus] went into the synagogue on the Sabbath day.' Christ kept the Sabbath as Lord of the Sabbath (Mark 2:28).",
      "Daniel 7:25 — The little horn power would 'think to change times and laws' — a direct prophecy of the attempted change of the Sabbath commandment.",
    ],
    counterArguments: [
      "Acts 20:7 and 1 Corinthians 16:2 are the only texts Catholics cite for Sunday observance, but neither establishes a new worship day. Acts 20:7 was a Saturday-night farewell meeting (biblical days begin at sunset), and 1 Corinthians 16:2 describes private financial bookkeeping 'at home,' not a worship service.",
      "Catholic catechisms and authorities have repeatedly admitted that Sunday has no biblical foundation. The Convert's Catechism of Catholic Doctrine states: 'We observe Sunday instead of Saturday because the Catholic Church transferred the solemnity from Saturday to Sunday.'",
      "The Sabbath commandment is the only one that begins with 'Remember' — as if God foresaw it would be forgotten. It is the seal of God's creative authority, identifying Him as Creator of heaven and earth.",
      "The shift to Sunday was gradual: no first- or second-century Christian writer claims Sunday replaced the Sabbath by divine command. The earliest evidence of Sunday preference comes from anti-Sabbath polemics linked to distancing Christianity from Judaism after the Bar Kokhba revolt (135 AD).",
    ],
    closingStatement:
      "The seventh-day Sabbath is God's sign between Himself and His people (Ezekiel 20:12, 20). It was made for humanity at Creation, upheld by Christ, and will be kept in the new earth (Isaiah 66:22-23). The change to Sunday is a human tradition that fulfills the prophecy of Daniel 7:25 — and the honest admission of Catholic authorities only confirms what the Bible foretold.",
  },
  {
    subjectId: "church-authority",
    title: "Countering the 'One True Church' Claim",
    sdaPosition:
      "SDAs believe that God has always had a faithful remnant that follows His commandments and holds to the testimony of Jesus (Revelation 12:17). The true church is identified not by institutional lineage or human succession but by adherence to biblical truth. The church of the apostles was characterized by obedience to God's Word, not by allegiance to a single institutional hierarchy. The book of Revelation describes an end-time 'Babylon' system that calls itself God's church but has departed from His truth — and God calls His people out of it (Revelation 18:4).",
    keyScriptures: [
      "Revelation 12:17 — 'The dragon was enraged with the woman, and he went to make war with the rest of her offspring, who keep the commandments of God and have the testimony of Jesus Christ.'",
      "Revelation 18:4 — 'Come out of her, my people, lest you share in her sins, and lest you receive of her plagues.'",
      "Acts 5:29 — 'We ought to obey God rather than men.' The apostles established the principle that institutional authority is subordinate to divine truth.",
      "Matthew 7:21-23 — 'Not everyone who says to Me, \"Lord, Lord\" shall enter the kingdom of heaven, but he who does the will of My Father.'",
    ],
    counterArguments: [
      "Apostolic succession does not guarantee faithfulness. Israel had an unbroken lineage from Abraham, yet God rejected the nation when it departed from His covenant. Lineage without obedience is dead (Matthew 3:9).",
      "The Western Schism (1378-1417) saw two and then three rival popes excommunicating each other. If succession guarantees unity and truth, this period is an insurmountable problem for the Catholic claim.",
      "The New Testament church was a network of local congregations led by elders (plural), not a centralized monarchy under a single bishop. The monarchical episcopate developed gradually in the second and third centuries.",
      "God identifies His true people by their fruits and their faithfulness to His commandments (John 14:15; 1 John 2:3-4; Revelation 14:12), not by institutional membership cards.",
    ],
    closingStatement:
      "The true church is known by its fidelity to 'the faith which was once for all delivered to the saints' (Jude 3). Institutional age and size do not equal truth. God's remnant in every age has been identified by obedience to His commandments and faith in Jesus Christ — not by allegiance to an earthly throne.",
  },
  {
    subjectId: "sacramental-system",
    title: "Countering the Sacramental System",
    sdaPosition:
      "SDAs teach that salvation is by grace through faith in Jesus Christ alone (Ephesians 2:8-9). While SDAs practice baptism and the Lord's Supper as ordinances instituted by Christ, they reject the Catholic sacramental system that treats these rituals as the primary channels of saving grace. The biblical model is one of direct access to God through the sole mediator, Jesus Christ (1 Timothy 2:5), not a priestly caste that controls the dispensation of grace through a system of seven sacraments.",
    keyScriptures: [
      "Ephesians 2:8-9 — 'For by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, lest anyone should boast.'",
      "1 Timothy 2:5 — 'There is one God and one Mediator between God and men, the Man Christ Jesus.'",
      "Hebrews 4:16 — 'Let us therefore come boldly to the throne of grace, that we may obtain mercy and find grace to help in time of need.' Direct access, no human intermediary required.",
      "Hebrews 10:10-14 — Christ's one sacrifice was sufficient for all time. The repetitive sacrifice of the Mass denies the finality of Calvary.",
    ],
    counterArguments: [
      "The New Testament recognizes only two ordinances directly instituted by Christ: baptism (Matthew 28:19) and the Lord's Supper (1 Corinthians 11:23-26). The other five Catholic sacraments (confirmation, penance, anointing of the sick, holy orders, matrimony) lack explicit institution by Christ as grace-dispensing sacraments.",
      "The book of Hebrews dismantles the need for a continuing earthly priesthood. Christ is our High Priest who 'ever lives to make intercession' for us (Hebrews 7:25). The entire Levitical system of priestly mediation was fulfilled and superseded by Christ's once-for-all sacrifice.",
      "The doctrine of transubstantiation (that bread and wine become Christ's literal body and blood) was not formally defined until the Fourth Lateran Council (1215). The early church held diverse views on the Eucharist, and the New Testament language of the Lord's Supper is memorial: 'Do this in remembrance of Me' (Luke 22:19).",
      "Making grace dependent on priestly administration gives the institutional church a monopoly on salvation — the very kind of spiritual gatekeeping Jesus condemned in the Pharisees: 'You shut up the kingdom of heaven against men' (Matthew 23:13).",
    ],
    closingStatement:
      "Grace flows from the throne of God through the one Mediator, Jesus Christ. No human priest, no sacramental system, and no institutional hierarchy can stand between the believer and the Savior. Calvary was sufficient. The veil is torn. We come boldly to the throne of grace — not through seven rituals, but through the blood of the Lamb.",
  },
];

// ── Modules ───────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  {
    id: "catholic-mod-papal-authority",
    subjectId: "papal-authority",
    title: "Papal Authority — Full Training Module",
    doctrineBrief:
      "The Roman Catholic Church teaches that the Pope is the Vicar of Christ on earth — the visible head of the Church with supreme authority in matters of faith, morals, and church governance. This doctrine rests on the claim that Jesus appointed Peter as the first pope in Matthew 16:18 ('You are Peter, and on this rock I will build My church') and that this authority has been passed down through an unbroken line of successors — the bishops of Rome — from Peter to the present day. The First Vatican Council (1870) formally defined papal infallibility: when the Pope speaks ex cathedra on matters of faith and morals, he is preserved from error by the Holy Spirit. SDAs reject this doctrine entirely, teaching that Christ alone is the Head of the Church and identifying the papal system as a key prophetic power in Daniel 7 and Revelation 13.",
    steelmanArguments: [steelmanArguments[0]],
    hiddenAssumptions: [
      "The Greek words 'Petros' and 'petra' are interchangeable, erasing a deliberate distinction Jesus made",
      "A personal commission to Peter automatically transfers to all subsequent bishops of Rome, despite no biblical succession mechanism",
      "The historical record of Roman bishops in the first two centuries is clear and undisputed, when it is actually fragmentary and contested",
      "Papal infallibility is consistent with the character of Peter, who was publicly rebuked by Paul for doctrinal compromise (Galatians 2:11-14)",
    ],
    mindGames: [mindGames[1]], // Institutional Authority Pressure
    fallacies: [fallacies[1]], // Circular Reasoning
    counterStrategy: counterStrategies[0],
    debateSimLink: "catholic",
    debriefPrompt:
      "You have just debated the doctrine of papal authority. Reflect: (1) Were you able to demonstrate from Scripture that Christ alone is the Head of the Church? (2) Did you effectively handle the Matthew 16:18 argument by showing the Petros/petra distinction and the broader New Testament testimony? (3) Could you articulate the prophetic significance of the papal claim without being dismissive? Remember: our goal is to speak the truth in love, pointing sincere Catholics to the all-sufficient Christ.",
  },
  {
    id: "catholic-mod-tradition-equal-scripture",
    subjectId: "tradition-equal-scripture",
    title: "Tradition Equal to Scripture — Full Training Module",
    doctrineBrief:
      "Catholic theology teaches that Divine Revelation comes through two streams: Sacred Scripture and Sacred Tradition. The Council of Trent (1546) declared that both are to be received 'with an equal affection of piety and reverence.' The Catechism of the Catholic Church (CCC 80-82) states that 'both Scripture and Tradition must be accepted and honored with equal sentiments of devotion and reverence.' The Magisterium (the teaching authority of the Pope and bishops) serves as the authoritative interpreter of both. In practice, this means that Catholic doctrines not found in Scripture — such as the Immaculate Conception, the Assumption of Mary, and purgatory — are justified by appeal to Tradition as interpreted by the Magisterium. SDAs reject this framework, holding that Scripture alone (Sola Scriptura) is the infallible rule of faith to which all traditions, councils, and human authorities must submit.",
    steelmanArguments: [steelmanArguments[1]],
    hiddenAssumptions: [
      "The apostles' oral teaching contained content not recorded in Scripture, and this unwritten content has been faithfully preserved for 2,000 years",
      "The Church that 'gave us the Bible' has continuing authority over the Bible, confusing recognition of the canon with creation of the canon",
      "Sola Scriptura is an invention of Martin Luther with no basis before the Reformation, when in fact the early Fathers frequently appealed to Scripture as the supreme authority",
      "Without an infallible interpreter (the Magisterium), Scripture is hopelessly unclear — a claim that undermines God's intention to communicate clearly with His people",
    ],
    mindGames: [mindGames[2]], // Historical Overwhelm
    fallacies: [fallacies[3]], // Red Herring (Canon Deflection)
    counterStrategy: counterStrategies[1],
    debateSimLink: "catholic",
    debriefPrompt:
      "You have just debated whether Tradition holds equal authority with Scripture. Reflect: (1) Did you clearly distinguish between Sola Scriptura (Scripture as supreme authority) and Solo Scriptura (me and my Bible alone)? (2) Were you able to show from Jesus' own teaching that tradition must always submit to the written Word (Mark 7:8-13)? (3) Did you handle the 'who gave you the Bible?' challenge without getting derailed from the main topic? The strength of the SDA position is that we follow Christ's own hermeneutic: 'It is written.'",
  },
  {
    id: "catholic-mod-sunday-sacredness",
    subjectId: "sunday-sacredness",
    title: "Sunday Sacredness — Full Training Module",
    doctrineBrief:
      "The Catholic Church teaches that the Lord's Day (Sunday) replaced the Jewish Sabbath (Saturday) by apostolic authority. The Catechism of the Catholic Church (CCC 2175-2176) states that 'Sunday is expressly distinguished from the sabbath which it follows chronologically every week; for Christians its ceremonial observance replaces that of the sabbath.' Catholic apologists frequently cite Acts 20:7 and 1 Corinthians 16:2 as evidence of early Sunday worship, while also openly acknowledging that the change has no explicit biblical mandate. This is arguably the most critical subject in SDA-Catholic dialogue, because Catholic apologists use it as a proof of Church authority over Scripture — and SDAs identify this change as the fulfillment of the Daniel 7:25 prophecy about the little horn that would 'think to change times and laws.'",
    steelmanArguments: [steelmanArguments[2]],
    hiddenAssumptions: [
      "The apostolic church worshiped on Sunday from the very beginning, when the historical evidence shows a gradual shift over centuries",
      "Acts 20:7 describes a regular Sunday worship service, when it was actually a Saturday-night farewell meeting before Paul's departure",
      "The Sabbath was 'only for the Jews,' despite its institution at Creation before any nation existed (Genesis 2:2-3)",
      "The Church's admission that it changed the Sabbath proves its authority, rather than confirming the prophetic warning of Daniel 7:25",
    ],
    mindGames: [mindGames[0]], // Appeal to Antiquity
    fallacies: [fallacies[2]], // Appeal to Antiquity (Fallacy)
    counterStrategy: counterStrategies[2],
    debateSimLink: "catholic",
    debriefPrompt:
      "You have just debated the Sabbath-Sunday question with a Catholic interlocutor. Reflect: (1) Did you present the Sabbath as a Creation ordinance, not merely a Jewish institution? (2) Were you able to show that the Catholic admission of changing the Sabbath actually supports the SDA prophetic interpretation? (3) Did you handle Acts 20:7 and 1 Corinthians 16:2 effectively? (4) Were you able to connect Daniel 7:25 to the historical evidence of the change without being inflammatory? This is the crown jewel of SDA-Catholic apologetics. Master it.",
  },
  {
    id: "catholic-mod-church-authority",
    subjectId: "church-authority",
    title: "Church Authority — Full Training Module",
    doctrineBrief:
      "The Catholic Church claims to be the one true Church founded by Jesus Christ, with an unbroken line of apostolic succession guaranteeing doctrinal fidelity. The Catechism (CCC 816) teaches that 'the sole Church of Christ... subsists in the Catholic Church, governed by the successor of Peter and by the bishops in communion with him.' This claim excludes all other Christian bodies from being fully 'church' in the proper sense. Vatican II's Lumen Gentium softened the language slightly but maintained Catholic ecclesial supremacy. SDAs respond that the true church is identified by faithfulness to God's commandments and the testimony of Jesus (Revelation 12:17), not by institutional lineage. Furthermore, SDA prophetic interpretation identifies the papal system within the broader narrative of Revelation 17-18 as 'Babylon,' from which God calls His sincere people to come out.",
    steelmanArguments: [steelmanArguments[3]],
    hiddenAssumptions: [
      "Institutional continuity equals doctrinal faithfulness — a claim refuted by the history of Israel, which had unbroken institutional succession yet repeatedly fell into apostasy",
      "The early church was a centralized hierarchy under Rome from the beginning, ignoring the collegial and decentralized nature of the first- and second-century churches",
      "Protestant division disproves Sola Scriptura, when division is a human problem, not a textual one — Catholics have their own deep internal divisions",
      "Being outside the Catholic institution means being outside the grace of God, a claim that confines the work of the Holy Spirit to one human organization",
    ],
    mindGames: [mindGames[3]], // Unity Argument
    fallacies: [fallacies[0]], // Appeal to Authority (Magisterial)
    counterStrategy: counterStrategies[3],
    debateSimLink: "catholic",
    debriefPrompt:
      "You have just debated the claim that the Catholic Church is the one true church. Reflect: (1) Did you successfully shift the criteria of 'true church' from institutional succession to biblical faithfulness? (2) Were you able to cite the Western Schism and other historical fractures in the succession chain? (3) Did you present the Revelation 12:17 remnant concept clearly — not as SDA triumphalism, but as a call to follow God's Word wherever it leads? (4) Were you able to express love for sincere Catholics while being honest about the prophetic identification of the system?",
  },
  {
    id: "catholic-mod-sacramental-system",
    subjectId: "sacramental-system",
    title: "Sacramental System — Full Training Module",
    doctrineBrief:
      "Catholic theology teaches that the seven sacraments — Baptism, Confirmation, Eucharist, Penance (Confession), Anointing of the Sick, Holy Orders, and Matrimony — are the ordinary means by which God dispenses sanctifying grace. The Council of Trent defined that the sacraments were 'instituted by Jesus Christ our Lord' and that they 'contain the grace which they signify' and confer it 'ex opere operato' (by the very performance of the act). The Eucharist holds a central place: the doctrine of transubstantiation teaches that the bread and wine are transformed into the literal body and blood of Christ at consecration. SDAs recognize only baptism and the Lord's Supper as biblical ordinances, rejecting both the expansion to seven sacraments and the ex opere operato theology that makes grace dependent on ritual performance through priestly mediation.",
    steelmanArguments: [steelmanArguments[4]],
    hiddenAssumptions: [
      "All seven sacraments were directly instituted by Christ, despite only baptism and the Lord's Supper having clear dominical institution in Scripture",
      "Grace is a substance that can be 'contained' and 'dispensed' through rituals, rather than the relational favor and transforming power of God received through faith",
      "The priest acts 'in persona Christi' (in the person of Christ), effectively re-presenting Christ's sacrifice — contradicting Hebrews' insistence that Christ's sacrifice was 'once for all' (Hebrews 10:10)",
      "Without the sacramental system, there is no reliable access to God's grace — a claim that denies the believer's direct access to the throne of grace (Hebrews 4:16)",
    ],
    mindGames: [mindGames[1]], // Institutional Authority Pressure
    fallacies: [fallacies[0]], // Appeal to Authority
    counterStrategy: counterStrategies[4],
    debateSimLink: "catholic",
    debriefPrompt:
      "You have just debated the Catholic sacramental system. Reflect: (1) Did you clearly affirm that SDAs believe in baptism and the Lord's Supper while explaining why we reject the expansion to seven sacraments? (2) Were you able to use Hebrews effectively to show that Christ's priesthood supersedes all earthly priestly mediation? (3) Did you present the gospel of grace through faith without caricaturing the Catholic view? (4) Were you able to show that the sacramental system creates a dangerous dependency on institutional gatekeepers that contradicts the believer's direct access to Christ? Remember: many Catholics have a genuine love for Christ expressed through the sacraments — our goal is to point them to the all-sufficient Mediator, not to mock their devotion.",
  },
];

// ── Export ─────────────────────────────────────────────────────────────────

export const catholicTraining: AATSAvatarTraining = {
  avatarId: "catholic",
  avatarName: "The Catholic",
  emoji: "\u26EA", // ⛪
  color: "border-purple-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
