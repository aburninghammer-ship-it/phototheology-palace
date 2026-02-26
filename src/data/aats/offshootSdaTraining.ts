// ─── AATS Training Data: The Offshoot SDA ──────────────────────────────────
// Training curriculum for engaging with Offshoot SDA positions that claim the
// mainstream SDA church has apostatized from original Adventism.

import type { AATSAvatarTraining } from "../aatsTrainingData";

// ── Subjects ────────────────────────────────────────────────────────────────

const subjects = [
  {
    id: "anti-trinitarian-theology",
    title: "Anti-Trinitarian Theology",
    description:
      "The pioneers were anti-Trinitarian; the church apostatized by accepting the Trinity",
  },
  {
    id: "feast-day-keeping",
    title: "Feast Day Keeping",
    description:
      "Biblical feasts are still binding; the church abandoned them",
  },
  {
    id: "organizational-apostasy",
    title: "Organizational Apostasy",
    description:
      "The GC/church structure has become Babylon",
  },
  {
    id: "selective-egw-usage",
    title: "Selective EGW Usage",
    description:
      "Only early EGW writings are reliable; later ones were corrupted by editors",
  },
  {
    id: "conspiracy-theology",
    title: "Conspiracy Theology",
    description:
      "Jesuits/Masons infiltrated the SDA church to change its doctrines",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments = [
  {
    id: "os-steelman-1",
    title: "Pioneer Anti-Trinitarianism",
    argument:
      "Early SDA pioneers like Uriah Smith rejected the Trinity — we should follow the pioneers",
    hiddenAssumptions: [
      "The pioneers had complete theological understanding from the beginning",
      "Doctrinal development under the Holy Spirit's leading is impossible or illegitimate",
      "Faithfulness means frozen theology rather than progressive understanding",
    ],
    sdaResponse:
      "The pioneers themselves acknowledged that truth is progressive. Ellen White warned against making the pioneers' early views a creed. She explicitly affirmed the full deity and personhood of the Holy Spirit in later writings such as The Desire of Ages and Evangelism. The church's Trinitarian understanding developed under her guidance, not against it.",
  },
  {
    id: "os-steelman-2",
    title: "EGW and Feast Keeping",
    argument:
      "EGW said to keep the feasts in early writings",
    hiddenAssumptions: [
      "Isolated early statements override the body of EGW counsel on ceremonial law",
      "The distinction between moral and ceremonial law is artificial",
      "Colossians 2:16-17 does not apply to Old Testament feast days",
    ],
    sdaResponse:
      "Ellen White consistently taught the distinction between the moral law (Ten Commandments) and the ceremonial law that pointed to Christ. In her mature writings she affirmed that the ceremonial system met its fulfillment at the cross. The early references to 'feasts' in context refer to camp meetings and convocations, not Levitical festivals. Paul in Colossians 2:16-17 explicitly identifies feast days, new moons, and sabbaths of the ceremonial system as shadows fulfilled in Christ.",
  },
  {
    id: "os-steelman-3",
    title: "The 1888 Rejection",
    argument:
      "The 1888 message was rejected and the church fell",
    hiddenAssumptions: [
      "An institutional rejection at one point in time constitutes permanent, irreversible apostasy",
      "Ellen White declared the church had fallen after 1888",
      "God cannot continue to work through an imperfect organization",
    ],
    sdaResponse:
      "While Ellen White rebuked the leadership who resisted the 1888 message on righteousness by faith, she never declared the church had fallen or become Babylon. She explicitly rejected the 'loud cry' of those who proclaimed the SDA church to be Babylon (Testimonies to Ministers, pp. 36-62). She continued to work within and support the church for decades after 1888, writing some of her greatest works including The Desire of Ages (1898) and Christ's Object Lessons (1900).",
  },
  {
    id: "os-steelman-4",
    title: "Edited EGW Writings",
    argument:
      "Post-1888 EGW writings were edited by W.C. White and others",
    hiddenAssumptions: [
      "Editorial assistance equals doctrinal corruption",
      "Ellen White was unaware of or opposed the editorial process",
      "The literary assistants inserted foreign theological ideas into her works",
    ],
    sdaResponse:
      "Ellen White openly employed literary assistants and approved of their work. She reviewed and signed off on the final versions of her publications. W.C. White served as her agent at her direction. Her literary assistants — particularly Marian Davis — worked under her supervision to compile and polish material, not to alter its theology. The manuscript evidence, including her personal letters and handwritten drafts, confirms doctrinal consistency between her manuscripts and published works.",
  },
  {
    id: "os-steelman-5",
    title: "Ecumenical Apostasy",
    argument:
      "The church joined ecumenical organizations, proving apostasy",
    hiddenAssumptions: [
      "Any interaction with other churches constitutes spiritual compromise",
      "Observer status in interfaith organizations equals endorsing false doctrine",
      "Witnessing to other Christians is the same as compromising with them",
    ],
    sdaResponse:
      "The SDA church maintains observer (not member) status at certain interfaith bodies for the purpose of religious liberty advocacy and witness, not theological compromise. Ellen White herself counseled engagement with other Christians while maintaining distinctive truth. Jesus prayed with and taught Pharisees, Sadducees, and Samaritans without endorsing their errors. Paul reasoned in synagogues and the Areopagus. Strategic presence is not the same as theological surrender.",
  },
  {
    id: "os-steelman-6",
    title: "Doctrinal Drift from Original Adventism",
    argument:
      "The 28 Fundamental Beliefs contain teachings foreign to original Adventism, proving doctrinal corruption",
    hiddenAssumptions: [
      "Original Adventism was doctrinally complete and perfect",
      "Any doctrinal refinement represents apostasy rather than growth",
      "The Holy Spirit stopped leading the church after the pioneers died",
    ],
    sdaResponse:
      "The SDA church has always held that 'present truth' is progressive — truth that unfolds as the Holy Spirit leads. The pioneers themselves changed positions on many topics over time. James White's theology in 1844 was different from his theology in 1880. Ellen White stated: 'Whenever the people of God are growing in grace, they will be constantly obtaining a clearer understanding of His word' (Testimonies, vol. 5, p. 706). A living church grows; only a dead one stays frozen.",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames = [
  {
    id: "os-mg-1",
    name: "Cherry-Picking EGW Quotes",
    description:
      "Selectively quoting early Ellen White statements in isolation while ignoring her later, more mature, and comprehensive counsel on the same topics.",
    example:
      "Quoting an 1850s statement where Ellen White used non-Trinitarian language while ignoring The Desire of Ages (1898) where she wrote: 'In Christ is life, original, unborrowed, underived.'",
    detectionTip:
      "Ask for the full context of the quote, including the date, setting, and audience. Then present later EGW statements on the same topic. Look for whether they are presenting her complete counsel or just fragments that support their position.",
  },
  {
    id: "os-mg-2",
    name: "Conspiracy Thinking",
    description:
      "Attributing doctrinal development to secret infiltrators (Jesuits, Masons, etc.) rather than engaging with the biblical and theological evidence. Unfalsifiable claims are presented as established fact.",
    example:
      "'The reason the church adopted the Trinity doctrine is because Jesuit agents infiltrated the Seminary in the 1950s. They planted professors who gradually changed the theology.'",
    detectionTip:
      "Ask for verifiable evidence, not just assertions. Conspiracy claims are typically unfalsifiable — any evidence against them is reframed as part of the conspiracy. Point out that doctrinal development occurred under Ellen White's direct guidance decades before the alleged infiltration.",
  },
  {
    id: "os-mg-3",
    name: "No-True-Scotsman",
    description:
      "Redefining 'true Adventist' to exclude anyone who disagrees with offshoot positions, making their definition of faithfulness circular and self-serving.",
    example:
      "'No real Adventist believes in the Trinity. If you believe in the Trinity, you're not a true Adventist — you're following Rome.'",
    detectionTip:
      "Point out the circular reasoning: they define 'true Adventist' by their own criteria, then use that definition to exclude anyone who disagrees. Ask who has the authority to define what 'true Adventism' is — a small independent group or the body of believers under the Holy Spirit's guidance?",
  },
  {
    id: "os-mg-4",
    name: "Elitism / Remnant-Within-a-Remnant",
    description:
      "Creating a sense of spiritual superiority by claiming to be the faithful few within the already-small remnant, fostering an us-vs-them mentality that discourages critical thinking.",
    example:
      "'We are the true remnant within the remnant. The church has fallen, but God has preserved a small group who keep the original faith. If you leave our group, you're leaving God's true people.'",
    detectionTip:
      "Note the pattern of ever-narrowing circles of 'true believers.' This mentality inevitably leads to further fragmentation, as sub-groups within offshoots split over minor disagreements. Ask: if the SDA church fell, what prevents their group from falling by the same logic?",
  },
  {
    id: "os-mg-5",
    name: "Fear-Based Isolation",
    description:
      "Using apocalyptic urgency and fear of spiritual contamination to discourage members from engaging with mainstream SDA scholarship, pastors, or materials.",
    example:
      "'Don't read anything from the Review and Herald anymore — it's full of Babylonian theology. Only read the original pioneer writings and our group's publications.'",
    detectionTip:
      "Healthy faith encourages investigation: 'Prove all things; hold fast that which is good' (1 Thess. 5:21). Groups that forbid examining opposing evidence are protecting a fragile position, not a strong one. Ellen White counseled: 'We have nothing to fear for the future, except as we shall forget...'",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies = [
  {
    id: "os-fallacy-1",
    name: "Cherry-Picking (Selective Evidence)",
    definition:
      "Presenting only evidence that supports one's conclusion while systematically ignoring evidence that contradicts it, giving a distorted picture of the full body of evidence.",
    example:
      "Citing early pioneer statements against the Trinity while ignoring that Ellen White's later, more authoritative published works affirm the full deity and personhood of the Holy Spirit.",
    counterMove:
      "Present the complete body of evidence. Show EGW's progressive statements on the Godhead from the 1840s through 1910. Demonstrate that her mature theology, expressed in major published works, is Trinitarian in substance even if not always in terminology.",
  },
  {
    id: "os-fallacy-2",
    name: "Conspiracy Fallacy",
    definition:
      "Attributing events to secret, malevolent agents rather than more straightforward explanations, and treating any counter-evidence as further proof of the conspiracy.",
    example:
      "'Jesuits infiltrated the SDA Seminary and changed the church's theology. The evidence that this didn't happen is just proof of how deep the infiltration goes.'",
    counterMove:
      "Demand verifiable, falsifiable evidence. Point out that doctrinal development on the Trinity occurred gradually over decades with Ellen White's active participation and approval. Show the documented theological trajectory from the 1890s onward, well before any alleged infiltration.",
  },
  {
    id: "os-fallacy-3",
    name: "No-True-Scotsman Fallacy",
    definition:
      "Redefining a category to exclude counter-examples, making the claim unfalsifiable by moving the goalposts whenever evidence is presented.",
    example:
      "'True Adventists have always been anti-Trinitarian.' When shown Adventists who are Trinitarian: 'Well, they aren't true Adventists.'",
    counterMove:
      "Expose the circular reasoning. The definition of 'true Adventist' cannot be decided by one faction. Point to the church's process of Bible study and corporate decision-making under the Holy Spirit. Ask what objective criteria, beyond their own opinion, defines 'true Adventism.'",
  },
  {
    id: "os-fallacy-4",
    name: "Appeal to Antiquity",
    definition:
      "Arguing that an older belief is automatically more correct simply because it came first, confusing chronological priority with theological accuracy.",
    example:
      "'The pioneers believed X, and they were closer to the founding of the church, so X must be correct. The church changed to Y, so Y must be wrong.'",
    counterMove:
      "Point out that the pioneers themselves changed their views over time. Early Adventists held incorrect positions they later corrected (e.g., the shut door theology). Truth is determined by Scripture, not by chronological priority. 'Present truth' means truth that unfolds progressively under divine guidance.",
  },
  {
    id: "os-fallacy-5",
    name: "Genetic Fallacy",
    definition:
      "Dismissing a belief based on its alleged origin rather than evaluating it on its own merits and biblical evidence.",
    example:
      "'The Trinity doctrine came from Catholicism, therefore it's false and any church that teaches it is following Rome.'",
    counterMove:
      "The origin of a doctrine does not determine its truth or falsehood. Evaluate it from Scripture. Catholics also believe in the resurrection and the second coming — we don't reject those truths because Catholics hold them. The question is: what does the Bible teach about the nature of God?",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies = [
  {
    subjectId: "anti-trinitarian-theology",
    title: "Responding to Anti-Trinitarian Claims",
    sdaPosition:
      "The SDA church affirms the biblical teaching of one God in three co-eternal Persons: Father, Son, and Holy Spirit. This understanding developed progressively under the guidance of Ellen White and the Holy Spirit, consistent with the principle of 'present truth.'",
    keyScriptures: [
      "Matthew 28:19 — Baptize in the name (singular) of the Father, Son, and Holy Spirit",
      "John 1:1-3, 14 — The Word was God and became flesh",
      "Acts 5:3-4 — Lying to the Holy Spirit is lying to God",
      "2 Corinthians 13:14 — The grace, love, and fellowship of all three Persons",
    ],
    counterArguments: [
      "Ellen White's mature writings affirm the full deity of Christ ('In Christ is life, original, unborrowed, underived' — The Desire of Ages, p. 530) and the personhood of the Holy Spirit ('The Holy Spirit is a person, for He beareth witness with our spirits' — Evangelism, p. 616).",
      "The pioneers themselves acknowledged that understanding grows over time. James White's later theology was more developed than his earlier positions. Freezing theology at an early point contradicts the Adventist principle of progressive revelation.",
      "Anti-Trinitarianism was not a settled, unified position among the pioneers — they disagreed with each other on the nature of God. Claiming a monolithic 'pioneer position' misrepresents the historical reality.",
      "The biblical evidence for the deity of Christ and the personhood of the Holy Spirit is extensive and cannot be dismissed simply because some pioneers did not fully grasp it initially.",
    ],
    closingStatement:
      "The SDA church's Trinitarian theology did not come from Babylon — it came from a deeper study of Scripture guided by the Holy Spirit and affirmed by Ellen White's most mature and authoritative writings. To reject this development is to reject the very principle of progressive truth that makes Adventism distinctive.",
  },
  {
    subjectId: "feast-day-keeping",
    title: "Responding to Feast Day Obligations",
    sdaPosition:
      "The SDA church teaches that the ceremonial law, including the Levitical feast days, met its fulfillment in Christ's sacrifice and ministry. The moral law (Ten Commandments, including the seventh-day Sabbath) remains binding, but the typological feasts pointed to realities now realized in Christ.",
    keyScriptures: [
      "Colossians 2:16-17 — Let no one judge you regarding feasts, new moons, or sabbaths which are a shadow of things to come",
      "Hebrews 10:1 — The law is a shadow of the good things to come, not the very image",
      "Galatians 4:9-10 — Paul warns against returning to observance of days, months, seasons, and years",
      "Ephesians 2:15 — Christ abolished the law of commandments contained in ordinances",
    ],
    counterArguments: [
      "The distinction between moral law and ceremonial law is biblical, not artificial. Jesus affirmed the permanence of the moral law (Matt. 5:17-19) while the book of Hebrews systematically shows how the ceremonial system was fulfilled in His priestly ministry.",
      "Ellen White consistently maintained the distinction between the two laws. She wrote: 'The ceremonial law was given by Christ. Even after it was no longer to be observed, Paul presented it before the Jews in its true position and value' (Patriarchs and Prophets, p. 365).",
      "Early EGW references to gatherings and 'feasts' in context refer to camp meetings and spiritual convocations, not to binding observance of Levitical festivals.",
      "If the feasts are still binding, consistency requires reinstituting all ceremonial observances, including animal sacrifices — which no offshoot group actually does, revealing a selective application of the ceremonial law.",
    ],
    closingStatement:
      "The feasts were beautiful types pointing to Christ. Studying them enriches our understanding of the plan of salvation. But requiring their observance confuses shadow with substance and risks returning to the bondage Paul warned against in Galatians and Colossians.",
  },
  {
    subjectId: "organizational-apostasy",
    title: "Responding to Claims the Church Has Become Babylon",
    sdaPosition:
      "While the SDA church is not perfect and has always needed reform, it remains the object of God's supreme regard on earth. Ellen White explicitly and repeatedly rejected the claim that the SDA church is Babylon, even when she strongly rebuked its leadership.",
    keyScriptures: [
      "Matthew 13:24-30 — The wheat and tares grow together until the harvest; premature separation is not God's plan",
      "Revelation 12:17 — The remnant church is identified by keeping the commandments and having the testimony of Jesus",
      "Matthew 16:18 — The gates of hell shall not prevail against God's church",
      "1 Corinthians 12:12-27 — The body of Christ has many members with different gifts; division is not God's plan",
    ],
    counterArguments: [
      "Ellen White stated explicitly: 'God has a church. It is not the great cathedral, neither is it the national establishment, neither is it the various denominations; it is the people who love God and keep His commandments... Where Christ is even among the humble few, this is Christ's church' (Upward Look, p. 315). She consistently applied this to the SDA church.",
      "In Testimonies to Ministers, pp. 36-62, Ellen White directly addressed and rejected the message that the SDA church is Babylon. She wrote: 'If the church is to be called Babylon, it would be the synagogue of Satan indeed... God has not thus indicated.'",
      "Every generation of Adventists has had groups claiming the church has finally fallen. The 1893 movement, the Shepherd's Rod (1930s), and subsequent offshoots all made the same claim. By their logic, the church fell multiple times, and each offshoot group is the 'true remnant' — yet they disagree with each other.",
      "Reform movements within the church are biblical and healthy. But separating from the body and declaring it Babylon is exactly what Ellen White warned against.",
    ],
    closingStatement:
      "The SDA church needs constant reformation — that is the nature of a living body of believers on a journey toward the kingdom. But calling the church Babylon contradicts Ellen White's explicit counsel, fragments God's people, and replaces corporate mission with sectarian isolation.",
  },
  {
    subjectId: "selective-egw-usage",
    title: "Responding to Claims of Corrupted EGW Writings",
    sdaPosition:
      "Ellen White employed literary assistants throughout her ministry with full knowledge and approval. Her published works represent her authorized, final expression of the messages God gave her. Manuscript evidence consistently confirms theological continuity between her handwritten drafts and published works.",
    keyScriptures: [
      "2 Peter 1:20-21 — Prophecy did not come by the will of man, but holy men spoke as moved by the Holy Spirit",
      "Jeremiah 36:4, 32 — Jeremiah dictated to Baruch the scribe; prophets have always used assistants",
      "Romans 16:22 — Tertius wrote down Paul's letter to the Romans; literary assistance is a biblical pattern",
      "1 Peter 5:12 — Peter wrote through Silvanus; apostolic use of secretaries is well attested",
    ],
    counterArguments: [
      "Ellen White personally supervised her publications and expressed satisfaction with the final products. She wrote regarding The Desire of Ages: 'I have read it through and I am well pleased with it' (Letter 123, 1904). This was one of her most explicitly Trinitarian works.",
      "The manuscript evidence — thousands of pages of handwritten drafts, letters, and diaries — has been open to researchers at the Ellen G. White Estate for decades. Scholars who have examined these documents confirm theological consistency, not corruption.",
      "Biblical prophets universally used scribes and literary assistants. Jeremiah used Baruch, Paul used Tertius, Peter used Silvanus. If using assistants invalidates a prophet's work, then large portions of the Bible itself are invalidated.",
      "The claim that post-1888 writings were 'corrupted' is driven by the need to explain away Ellen White's mature affirmations of the Trinity and her rejection of the 'church is Babylon' message. It is a conclusion-driven theory, not an evidence-driven one.",
    ],
    closingStatement:
      "The selective dismissal of Ellen White's later writings is not a defense of her prophetic authority — it is an undermining of it. If her published works cannot be trusted, then the entire prophetic gift is called into question, which ironically destroys the very foundation the offshoot claims to defend.",
  },
  {
    subjectId: "conspiracy-theology",
    title: "Responding to Infiltration and Conspiracy Claims",
    sdaPosition:
      "While spiritual warfare is real and the church faces genuine challenges, attributing doctrinal development to secret infiltrators contradicts the historical evidence, undermines the Holy Spirit's role in guiding the church, and promotes unfalsifiable conspiracy thinking that replaces careful Bible study.",
    keyScriptures: [
      "John 16:13 — The Spirit of truth will guide you into all truth",
      "Matthew 16:18 — The gates of hell shall not prevail against Christ's church",
      "1 John 4:1 — Test the spirits; discernment is based on evidence, not suspicion",
      "Proverbs 18:17 — The first to present their case seems right until cross-examined",
    ],
    counterArguments: [
      "The doctrinal development on the Godhead occurred over decades under Ellen White's active guidance, starting in the 1890s — long before any alleged Jesuit infiltration. The Desire of Ages (1898), Ministry of Healing (1905), and Evangelism (compiled from her writings) all affirm Trinitarian theology in substance.",
      "Conspiracy theories are by nature unfalsifiable: any evidence against the conspiracy is reinterpreted as part of the conspiracy. This is not biblical discernment — it is circular reasoning that makes truth-seeking impossible.",
      "The SDA church's theological positions are publicly available, openly debated, and subject to corporate Bible study processes. This transparency is the opposite of what one would expect from a secretly infiltrated organization.",
      "Ellen White warned against 'suspicion and evil surmising' (Testimonies, vol. 5, p. 94). She counseled: 'The Lord has not placed on any one the burden of encouraging an appetite for speculative doctrines and theories.'",
    ],
    closingStatement:
      "Conspiracy thinking replaces the hard work of biblical exegesis with the easy certainty of suspicion. Rather than examining what Scripture actually teaches about God's nature, it dismisses the evidence by attacking the motives of those who present it. This is not faithfulness — it is fearfulness masquerading as discernment.",
  },
];

// ── Modules ─────────────────────────────────────────────────────────────────

const modules = [
  {
    id: "os-mod-1",
    subjectId: "anti-trinitarian-theology",
    title: "Module 1: Anti-Trinitarian Theology",
    doctrineBrief:
      "Offshoot SDA groups teach that the original Adventist pioneers were anti-Trinitarian and that the church apostatized by accepting the doctrine of the Trinity. They argue that Trinitarian theology was imported from Catholicism and represents a departure from 'original Adventism.' They claim faithfulness requires returning to the pioneer positions on the Godhead.",
    steelmanArguments: [
      steelmanArguments[0], // Pioneer Anti-Trinitarianism
      steelmanArguments[5], // Doctrinal Drift
    ],
    hiddenAssumptions: [
      "Pioneer theology was complete and infallible from the beginning",
      "Doctrinal development is always apostasy, never growth",
      "Ellen White did not affirm the Trinity in her later writings",
      "The Trinity is exclusively a Catholic doctrine with no biblical basis",
    ],
    mindGames: [
      mindGames[0], // Cherry-Picking EGW
      mindGames[2], // No-True-Scotsman
    ],
    fallacies: [
      fallacies[0], // Cherry-Picking
      fallacies[3], // Appeal to Antiquity
      fallacies[4], // Genetic Fallacy
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "offshoot-sda",
    debriefPrompt:
      "How effectively did you present the progressive development of SDA theology on the Godhead? Were you able to show that Ellen White's mature writings affirm Trinitarian theology in substance? Could you demonstrate that the pioneers themselves changed their views over time?",
  },
  {
    id: "os-mod-2",
    subjectId: "feast-day-keeping",
    title: "Module 2: Feast Day Keeping",
    doctrineBrief:
      "Some offshoot SDA groups teach that the Old Testament feast days (Passover, Unleavened Bread, Pentecost, Trumpets, Day of Atonement, Tabernacles) are still binding on Christians. They accuse the mainstream SDA church of abandoning these observances and claim that early Ellen White statements support their position. They often conflate the weekly Sabbath with the annual feast days.",
    steelmanArguments: [
      steelmanArguments[1], // EGW and Feast Keeping
    ],
    hiddenAssumptions: [
      "The distinction between moral and ceremonial law is artificial",
      "The feasts were not typological shadows fulfilled in Christ",
      "Colossians 2:16-17 does not refer to Old Testament feast days",
      "The weekly Sabbath and annual feast days have the same theological status",
    ],
    mindGames: [
      mindGames[0], // Cherry-Picking EGW
      mindGames[4], // Fear-Based Isolation
    ],
    fallacies: [
      fallacies[0], // Cherry-Picking
      fallacies[3], // Appeal to Antiquity
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "offshoot-sda",
    debriefPrompt:
      "Were you able to clearly distinguish between the moral law (Ten Commandments) and the ceremonial law (feast days, sacrifices, rituals)? Did you show how the book of Hebrews and Paul's epistles teach fulfillment of the ceremonial system? Could you contextualize the early EGW quotes they use?",
  },
  {
    id: "os-mod-3",
    subjectId: "organizational-apostasy",
    title: "Module 3: Organizational Apostasy",
    doctrineBrief:
      "A central claim of many offshoot SDA groups is that the mainstream SDA church — particularly the General Conference — has become Babylon and is no longer God's remnant church. They point to the 1888 rejection, ecumenical contacts, perceived doctrinal drift, and organizational policies as evidence of apostasy. They claim that leaving the organized church is a necessary act of faithfulness.",
    steelmanArguments: [
      steelmanArguments[2], // 1888 Rejection
      steelmanArguments[4], // Ecumenical Apostasy
    ],
    hiddenAssumptions: [
      "Ellen White declared the SDA church to be Babylon after 1888",
      "An organization's imperfections prove its rejection by God",
      "Separation from the organized church is the path of faithfulness",
      "God works only through small independent groups, not through imperfect organizations",
    ],
    mindGames: [
      mindGames[2], // No-True-Scotsman
      mindGames[3], // Elitism / Remnant-Within-Remnant
      mindGames[4], // Fear-Based Isolation
    ],
    fallacies: [
      fallacies[2], // No-True-Scotsman
      fallacies[3], // Appeal to Antiquity
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "offshoot-sda",
    debriefPrompt:
      "Did you effectively present Ellen White's explicit rejection of the claim that the SDA church is Babylon? Were you able to show her continued support of the organized church after 1888? Could you demonstrate the pattern of every generation producing groups that make the same 'church has fallen' claim?",
  },
  {
    id: "os-mod-4",
    subjectId: "selective-egw-usage",
    title: "Module 4: Selective EGW Usage",
    doctrineBrief:
      "Offshoot groups often claim that only Ellen White's early writings are reliable and that her later published works were corrupted by editors — particularly W.C. White and literary assistant Marian Davis. This allows them to dismiss any EGW statement that contradicts their theology (especially her Trinitarian affirmations) while claiming to be her most faithful followers. The irony is that they undermine the very prophetic authority they claim to defend.",
    steelmanArguments: [
      steelmanArguments[3], // Edited EGW Writings
    ],
    hiddenAssumptions: [
      "Literary assistants altered Ellen White's theology without her knowledge",
      "Ellen White was too old or infirm to oversee her publications in later years",
      "The manuscript evidence supports theological corruption",
      "Using scribes and editors is unprecedented in prophetic ministry",
    ],
    mindGames: [
      mindGames[0], // Cherry-Picking EGW
      mindGames[1], // Conspiracy Thinking
    ],
    fallacies: [
      fallacies[0], // Cherry-Picking
      fallacies[1], // Conspiracy Fallacy
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "offshoot-sda",
    debriefPrompt:
      "Could you demonstrate the biblical pattern of prophets using scribes and literary assistants? Were you able to present evidence of Ellen White's active supervision of her publications? Did you show the irony that dismissing her later writings undermines the very prophetic authority they claim to defend?",
  },
  {
    id: "os-mod-5",
    subjectId: "conspiracy-theology",
    title: "Module 5: Conspiracy Theology",
    doctrineBrief:
      "Some offshoot SDA groups teach that Jesuits, Freemasons, or other conspiratorial agents infiltrated the SDA church to corrupt its doctrines from within. They claim that changes in SDA theology — particularly the acceptance of the Trinity, the publication of Questions on Doctrine (1957), and ecumenical contacts — are evidence of this infiltration. This conspiracy framework makes their position unfalsifiable, as any counter-evidence is dismissed as part of the cover-up.",
    steelmanArguments: [
      steelmanArguments[4], // Ecumenical Apostasy
      steelmanArguments[5], // Doctrinal Drift
    ],
    hiddenAssumptions: [
      "Doctrinal development cannot be explained by honest Bible study and the Holy Spirit's guidance",
      "Secret agents successfully redirected the theology of an entire denomination",
      "The conspiracy is so thorough that the absence of evidence is itself evidence",
      "Ellen White failed to warn about this infiltration despite her prophetic gift",
    ],
    mindGames: [
      mindGames[1], // Conspiracy Thinking
      mindGames[3], // Elitism / Remnant-Within-Remnant
      mindGames[4], // Fear-Based Isolation
    ],
    fallacies: [
      fallacies[1], // Conspiracy Fallacy
      fallacies[4], // Genetic Fallacy
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "offshoot-sda",
    debriefPrompt:
      "Were you able to expose the unfalsifiable nature of conspiracy claims? Did you show that doctrinal development occurred under Ellen White's guidance, long before alleged infiltration? Could you redirect the conversation from suspicion to Scripture, asking what the Bible actually teaches about God's nature and His church?",
  },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const offshootSdaTraining: AATSAvatarTraining = {
  avatarId: "offshoot-sda",
  avatarName: "The Offshoot SDA",
  emoji: "\u{1F33F}",
  color: "border-lime-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
