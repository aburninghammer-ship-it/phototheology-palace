// ─── AATS: Former SDA Avatar Training ───────────────────────────────────────
// Training data for "The Former SDA" — someone who grew up in or joined the
// Seventh-day Adventist Church but has since left, often carrying genuine hurt,
// theological objections, and cultural grievances.  The goal is NOT to dismiss
// their pain but to equip SDA believers to respond with theological clarity,
// historical honesty, and Christ-like compassion.

import type { AATSAvatarTraining } from "../aatsTrainingData";

// ── Subjects ────────────────────────────────────────────────────────────────

const subjects = [
  {
    id: "great-disappointment-failure",
    title: "Great Disappointment Failure",
    description:
      "1844 was a failed prophecy, proving the movement is false",
  },
  {
    id: "ellen-white-credibility",
    title: "Ellen White Credibility",
    description:
      "EGW was a false prophet — plagiarism, failed predictions, contradictions",
  },
  {
    id: "investigative-judgment-anxiety",
    title: "Investigative Judgment Anxiety",
    description:
      "The IJ produces fear, not assurance of salvation",
  },
  {
    id: "sda-cultural-legalism",
    title: "SDA Cultural Legalism",
    description:
      "SDA church culture is legalistic, controlling, and cult-like",
  },
  {
    id: "doctrinal-isolation",
    title: "Doctrinal Isolation",
    description:
      "SDA distinctive doctrines isolate members from mainstream Christianity",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments = [
  {
    id: "sa-great-disappointment",
    title: "The Great Disappointment proves the whole movement is built on error",
    argument:
      "William Miller predicted Christ would return on October 22, 1844. He was wrong. Rather than admitting the failure, the remaining Millerites invented the Investigative Judgment doctrine to save face. This is textbook cognitive-dissonance reduction — the same pattern seen in failed apocalyptic movements throughout history (cf. Leon Festinger's 'When Prophecy Fails'). A movement that begins with a demonstrably false prediction cannot be God's remnant church.",
    hiddenAssumptions: [
      "A single prophetic miscalculation invalidates every subsequent theological development.",
      "The post-1844 Sabbatarian Adventists made no independent Bible study but merely rationalized failure.",
      "God never allows His people to pass through misunderstanding before arriving at fuller truth.",
      "The Millerite movement and the Seventh-day Adventist Church are theologically identical.",
    ],
    sdaResponse:
      "The Millerites were correct about the prophetic time period (Daniel 8:14's 2,300 days ending in 1844) but wrong about the event. Scripture records similar patterns: the disciples expected a political kingdom at Christ's first advent and were devastated by the cross, yet they were following genuine prophecy (Luke 24:21-27). After the disappointment, careful Bible study — not rationalization — led to the sanctuary doctrine (Hebrews 8:1-2; 9:23; Revelation 11:19). The movement's willingness to re-examine Scripture and correct its eschatology actually demonstrates theological integrity, not dishonesty.",
  },
  {
    id: "sa-egw-plagiarism",
    title: "EGW plagiarized extensively — the Veltman study confirms it",
    argument:
      "The Fred Veltman study commissioned by the church itself found that Ellen White borrowed heavily from contemporary authors in 'The Desire of Ages' — up to 31% of the content in some chapters had literary parallels. She denied doing this ('I do not write one article in the paper expressing merely my own ideas. They are what God has opened before me in vision'). If she borrowed human sources while claiming divine revelation, she is by definition a false prophet. The church suppressed the Veltman report for years, which compounds the dishonesty.",
    hiddenAssumptions: [
      "Prophetic inspiration requires that every word originate ex nihilo from God with no human research involved.",
      "Literary parallels automatically equal plagiarism by modern academic standards retroactively applied to the 19th century.",
      "Ellen White claimed verbal, dictation-style inspiration rather than thought inspiration.",
      "The church deliberately suppressed the Veltman study rather than processing complex findings over time.",
    ],
    sdaResponse:
      "The SDA understanding of inspiration has always been 'thought inspiration,' not verbal dictation (see 1 Selected Messages, p. 21: 'It is not the words of the Bible that are inspired, but the men were inspired'). Biblical prophets themselves used existing sources — Luke explicitly researched eyewitness accounts (Luke 1:1-4), Chronicles draws on royal annals, and Jude quotes the non-canonical Book of Enoch. The Veltman study showed literary dependence, not idea theft; White consistently transformed borrowed material to serve her theological purposes. The study was published in Ministry magazine (1990) and has been publicly available — characterizing this as suppression misrepresents the timeline. The real question is whether her writings lead people to Christ and align with Scripture, which millions of readers across cultures have affirmed.",
  },
  {
    id: "sa-ij-no-forgiveness",
    title: "IJ means God doesn't really forgive — He keeps reviewing",
    argument:
      "If God is currently reviewing the life records of every person who ever professed faith in Christ, then forgiveness is not settled at the cross. The gospel says 'There is therefore now no condemnation for those who are in Christ Jesus' (Romans 8:1). But the IJ says God might still find you wanting. This produces a salvation-by-performance anxiety that contradicts the assurance offered in 1 John 5:13: 'I write these things to you who believe in the name of the Son of God, that you may know that you have eternal life.' Many former SDAs report debilitating spiritual anxiety rooted in this teaching.",
    hiddenAssumptions: [
      "Judgment and assurance are mutually exclusive — if judgment exists, assurance cannot.",
      "The IJ teaches that salvation can be lost based on unknown, unconfessed sins.",
      "Paul's statements about no condemnation eliminate all future accountability before God.",
      "The emotional experience of anxiety in some members defines the doctrine itself.",
    ],
    sdaResponse:
      "Scripture consistently teaches both assurance AND judgment for believers. Paul himself, who wrote Romans 8:1, also wrote 'we must all appear before the judgment seat of Christ' (2 Corinthians 5:10) and 'each one's work will become manifest, for the Day will disclose it' (1 Corinthians 3:13). These are not contradictions. The IJ does not re-try the settled question of whether Christ's blood is sufficient — it vindicates God's justice in saving sinners and demonstrates before the universe that those who claimed Christ's name genuinely accepted His lordship. The believer's advocate in this judgment is Christ Himself (1 John 2:1). Anxiety comes not from the doctrine rightly understood but from legalistic distortions of it. Daniel 7:22 says 'judgment was given in favor of the saints' — the verdict is pro-defendant.",
  },
  {
    id: "sa-cult-behavior",
    title: "SDA health message and dress standards are controlling cult behavior",
    argument:
      "The SDA church tells members what to eat, what to wear, what entertainment to consume, what day to rest, and controls social life through a tight-knit subculture of SDA schools, hospitals, and social circles. Former members describe shunning, gossip, and intense social pressure. This matches Robert Lifton's criteria for thought reform: milieu control, sacred science, demand for purity, and dispensing of existence (you're either remnant or Babylon). The BITE model (Behavior, Information, Thought, Emotional control) applies in many SDA communities.",
    hiddenAssumptions: [
      "Any community with distinctive lifestyle standards is a cult.",
      "Healthy lifestyle recommendations enforced by social pressure are equivalent to coercive mind control.",
      "The worst examples of SDA congregational behavior represent the denomination's official theology.",
      "The BITE model, designed for high-control groups, applies uniformly to a 22-million-member global denomination with enormous local variation.",
    ],
    sdaResponse:
      "There is a crucial distinction between a denomination's theology and the behavior of individual congregations or members. SDA health teachings are presented as counsel, not salvation requirements — the 28 Fundamental Beliefs explicitly state that salvation is by grace through faith alone (Fundamental Belief #10). Paul addresses diet and holy days as matters of conscience in Romans 14, but he also says 'your body is a temple of the Holy Spirit' (1 Corinthians 6:19). Jesus said His followers would be identifiable by their lifestyle (Matthew 7:16). The painful experiences of former members in legalistic congregations are real and should be acknowledged — but they reflect a distortion of Adventist theology, not its essence. Many SDAs have experienced the health message as liberating, and the church's Blue Zone longevity research in Loma Linda demonstrates measurable well-being outcomes.",
  },
  {
    id: "sa-arrogant-exclusivism",
    title: "If SDAs are right, every other Christian is wrong — that's arrogant",
    argument:
      "SDAs claim to be the 'remnant church' of Revelation 12:17, which implicitly categorizes all other churches as Babylon or at least as deficient. This is breathtakingly arrogant for a 19th-century American sect of 22 million people to claim against 2 billion Christians with 2,000 years of continuous tradition. The Sabbath-Sunday issue makes SDAs judge the sincerity of every Sunday-keeping Christian. This exclusivism damages ecumenical relationships and isolates SDA members from the broader body of Christ.",
    hiddenAssumptions: [
      "Claiming distinctive prophetic identity automatically means condemning all other Christians.",
      "Numerical size and historical longevity determine theological validity.",
      "The SDA remnant teaching says non-SDAs cannot be saved.",
      "Ecumenical unity requires doctrinal uniformity or at least the erasure of distinctive claims.",
    ],
    sdaResponse:
      "The SDA Church has explicitly stated that 'remnant' is a prophetic calling, not an exclusive claim to salvation. Fundamental Belief #14 speaks of a 'remnant' that 'keeps the commandments of God and has the faith of Jesus,' while the church acknowledges that God has sincere followers in every communion (see The Great Controversy, ch. 35: 'many of Christ's true followers are still to be found in the communions of Babylon'). Even the Three Angels' Messages call people to worship the Creator (Revelation 14:7), not to join a denomination. Furthermore, the apostolic church was a small minority within Judaism and the Roman Empire — smallness and distinctiveness have never disqualified a movement in biblical history. The Sabbath truth is presented as an invitation rooted in creation (Genesis 2:2-3) and eschatology (Isaiah 66:23), not as a weapon of judgment against sincere believers.",
  },
  {
    id: "sa-egw-failed-predictions",
    title: "Ellen White made specific predictions that failed",
    argument:
      "Ellen White stated that some people alive in her day would be translated at Jesus' coming (Early Writings, p. 15). She told people in 1856 that some in the audience would be alive for the Second Coming (Testimonies, vol. 1, p. 131-132). She also predicted England would join the Confederacy during the Civil War (Testimonies, vol. 1, p. 259). These are falsifiable predictions that failed. Deuteronomy 18:22 says 'when a prophet speaks in the name of the LORD, if the word does not come to pass or come true, that is a word that the LORD has not spoken.' By the Bible's own test, she fails.",
    hiddenAssumptions: [
      "Conditional prophecy does not exist — every prophetic statement must be unconditionally fulfilled regardless of human response.",
      "The Deuteronomy 18:22 test operates in isolation without considering the full body of a prophet's work.",
      "Ellen White's statements were all presented as 'Thus saith the Lord' prophecies rather than pastoral expectations or conditional warnings.",
      "No recognized biblical prophet ever made statements that appeared unfulfilled in their generation.",
    ],
    sdaResponse:
      "Scripture contains many conditional prophecies. Jonah predicted Nineveh's destruction in 40 days — it didn't happen because the people repented (Jonah 3:10). God explained the principle in Jeremiah 18:7-10: prophecies of blessing or judgment are conditional on human response. Jesus Himself said 'this generation will not pass away until all these things take place' (Matthew 24:34), which has generated extensive interpretive discussion for 2,000 years. Ellen White's 1856 vision is best understood as conditional — had the church fulfilled its mission with the urgency God intended, Christ could have returned. The 'England and the Confederacy' statement is debated in context, but even granting difficulties, the Deuteronomy test examines a prophet's overall trajectory: does the prophet lead people to God and align with Scripture? (Deuteronomy 13:1-3). Ellen White's six-decade ministry consistently exalted Christ, upheld Scripture, and called people to holiness.",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames = [
  {
    id: "mg-insider-betrayal",
    name: "Insider Betrayal Framing",
    description:
      "The former SDA leverages their insider status to frame their departure as a heroic escape, implying that anyone who remains is either brainwashed or intellectually dishonest. 'I was one of you — I know what it's really like' carries implicit authority that outsider critics lack.",
    example:
      "'I was a fourth-generation Adventist. I went to SDA schools K-through-college. I was a deacon, a Sabbath School teacher, and I read the Spirit of Prophecy cover to cover. I know this church from the inside — and that's exactly why I left. You can't tell me I don't understand Adventism.'",
    detectionTip:
      "Acknowledge their experience genuinely, but note that personal history does not settle doctrinal questions. Many lifelong members study deeply and stay. The argument from insider status is an appeal to authority — the question is what Scripture teaches, not who has the most church experience.",
  },
  {
    id: "mg-trauma-weaponization",
    name: "Trauma Weaponization",
    description:
      "Genuine emotional pain from legalistic or dysfunctional SDA environments is deployed as an argument against the denomination's theology. The implicit logic: 'This teaching hurt me, therefore this teaching is false.' Challenging the theological claims feels like dismissing the person's pain.",
    example:
      "'I spent years terrified that I had unconfessed sins and wouldn't pass the Investigative Judgment. I couldn't sleep. I developed anxiety disorders. How can you defend a teaching that does that to people?'",
    detectionTip:
      "Never minimize the pain. Validate the emotional experience first ('That sounds genuinely terrible, and no one should experience their faith that way'). Then gently distinguish between a doctrine as taught in Scripture and a doctrine as distorted in a particular community. Ask: 'Was your anxiety coming from what the Bible actually teaches about judgment, or from how it was presented to you?'",
  },
  {
    id: "mg-experience-as-theology",
    name: "Personal Experience as Theology",
    description:
      "The former SDA treats their subjective journey as normative — 'I found peace after leaving, therefore the church is wrong.' Personal spiritual relief is used as evidence of theological truth, making the conversation nearly impossible to redirect to Scripture.",
    example:
      "'The moment I stopped keeping the Sabbath and just trusted in Jesus' finished work on the cross, I felt a weight lift off my shoulders. For the first time in my life I experienced real grace. How can you say I should go back to that burden?'",
    detectionTip:
      "Affirm that genuine encounters with grace are always good. But point out that emotional relief can follow leaving any high-demand commitment — it doesn't prove the commitment was wrong. A soldier feels relief leaving boot camp; that doesn't mean the training was unnecessary. Ask whether their Sabbath-keeping was experienced as legalistic rule-keeping or as the 'delight' Isaiah 58:13-14 describes. The problem may have been the framing, not the practice.",
  },
  {
    id: "mg-guilt-by-association",
    name: "Guilt by Association",
    description:
      "The former SDA links Adventism to other groups considered cults (Jehovah's Witnesses, Mormons, Branch Davidians) to transfer negative associations. The reasoning is: 'These groups are similar in structure/origin, those groups are false, therefore Adventism is false.'",
    example:
      "'Did you know that both SDAs and JWs came out of the Millerite movement? The Watchtower and the SDA church both have a founding prophet, both claim unique end-time truth, and both use fear of the end to control members. Walter Martin almost put you guys in Kingdom of the Cults.'",
    detectionTip:
      "This is a classic guilt-by-association fallacy. Shared historical roots do not mean shared theology. Christianity and Islam both trace to Abraham — that doesn't make them equivalent. Walter Martin, after extensive study, explicitly removed SDAs from the cult category in 'Kingdom of the Cults' and affirmed SDA orthodoxy on core Christian doctrines. Evaluate each group's actual teachings on their own merits.",
  },
  {
    id: "mg-deconstruction-momentum",
    name: "Deconstruction Momentum",
    description:
      "The former SDA presents faith deconstruction as inherently virtuous and intellectually honest, while remaining in faith is framed as intellectual cowardice. There is a cultural momentum in ex-SDA communities that rewards each step of departure and penalizes any reconsideration.",
    example:
      "'Once I started really questioning, I couldn't stop. First it was Ellen White, then the Sabbath, then the IJ, then the state of the dead... eventually I realized the whole house of cards collapses. If you're honest with yourself, you'll end up where I am.'",
    detectionTip:
      "Questioning is healthy, but deconstruction is not automatically the same as honest inquiry. Ask whether they applied the same skeptical rigor to the positions they moved toward as they did to the ones they left behind. Did they steelman Adventism with the same energy they steelmanned the objections? True intellectual honesty questions in every direction, not just the direction that social pressure rewards.",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies = [
  {
    id: "fl-genetic-fallacy",
    name: "Genetic Fallacy",
    definition:
      "Rejecting a belief solely because of its origin rather than evaluating its current evidence. The Great Disappointment is used to discredit all subsequent SDA theology, regardless of its independent biblical support.",
    example:
      "'Adventism was born from a failed prophecy in 1844. Anything built on a false foundation is false — it doesn't matter how much Bible you pile on top of it afterward.'",
    counterMove:
      "Point out that Christianity itself was born from a context that critics dismiss — a crucified Galilean peasant in an occupied backwater province. The disciples' initial misunderstanding of the Messiah's mission didn't invalidate the resurrection. Evaluate the Sabbath, sanctuary, and state-of-the-dead doctrines on their own scriptural merits, not on the emotional baggage of 1844. Ask: 'If the Sabbath is biblical, does 1844 make it un-biblical?'",
  },
  {
    id: "fl-anecdotal-evidence",
    name: "Anecdotal Evidence",
    definition:
      "Using personal stories or isolated negative experiences as proof of a universal claim about the entire denomination. Individual bad experiences, while valid, cannot logically indict 22 million members across 200+ countries.",
    example:
      "'Everyone I know who left the SDA church is happier. My cousin was disfellowshipped for wearing jewelry, and my friend's pastor told her she was going to hell for eating shrimp. The church is toxic.'",
    counterMove:
      "Acknowledge the experiences as real and regrettable. Then note that anecdotal evidence cuts both ways — millions of SDAs worldwide describe their faith as joyful and liberating. The logical structure is the same as saying 'everyone I know who dropped out of school is happier, therefore school is harmful.' The question is whether the theology itself, rightly understood and practiced, produces the toxicity — or whether broken humans distort good teachings, as happens in every tradition.",
  },
  {
    id: "fl-composition-fallacy",
    name: "Composition Fallacy",
    definition:
      "Assuming that what is true of a part (one congregation, one pastor, one era) is true of the whole denomination. The worst SDA church experience is treated as representative of global Adventism.",
    example:
      "'My SDA church in [location] was run like a dictatorship. The head elder controlled everything, women couldn't speak, and anyone who questioned was silenced. That's what Adventism really is when you strip away the PR.'",
    counterMove:
      "Distinguish between local church culture and denominational theology. The SDA Church Manual provides for democratic governance, women's participation (including ordination in many divisions' practice), and appeals processes. A dysfunctional local congregation is a real problem that deserves reform — but it doesn't define a global movement any more than a corrupt police precinct defines the concept of law enforcement. Ask: 'Would you apply this same logic to judge all of Christianity by the Westboro Baptist Church?'",
  },
  {
    id: "fl-poisoning-the-well",
    name: "Poisoning the Well",
    definition:
      "Pre-emptively discrediting SDA responses before they are even given, so that any defense of Adventism is framed as brainwashing, denial, or cognitive dissonance rather than legitimate reasoning.",
    example:
      "'I know exactly what you're going to say — you'll quote Ellen White, cite some obscure Hebrew word study, and tell me I just didn't understand the doctrine properly. That's what they always say. It's the SDA programming talking, not you.'",
    counterMove:
      "Name the tactic directly: 'You've just set up a framework where no response I give can count as legitimate. If I agree with you, I'm enlightened. If I disagree, I'm programmed. That's not a conversation — it's a Kafka trap. I'm willing to engage your arguments on their merits. Are you willing to extend me the same courtesy?' Then proceed to engage the substance calmly and scripturally.",
  },
  {
    id: "fl-false-dilemma",
    name: "False Dilemma",
    definition:
      "Presenting only two options — either Adventism is a perfect, God-ordained institution or it is a dangerous cult — when the reality includes a wide spectrum of possibilities including 'a flawed but biblically grounded movement.'",
    example:
      "'Either Ellen White was a true prophet who never made a mistake, or she was a fraud. There's no middle ground. And since she clearly made mistakes, she's a fraud, and the whole church falls apart.'",
    counterMove:
      "Biblical prophets made mistakes while remaining genuine prophets. Moses struck the rock in anger and was barred from Canaan (Numbers 20:12). Nathan initially told David to build the temple before God corrected him (2 Samuel 7:3-5). Peter was rebuked by Paul for hypocrisy (Galatians 2:11). The biblical model of prophecy allows for genuine prophetic gifting with human fallibility. The question is not perfection but whether the overall trajectory of the ministry aligns with Scripture and points people to Christ.",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies = [
  {
    subjectId: "great-disappointment-failure",
    title: "Responding to the Great Disappointment Challenge",
    sdaPosition:
      "The 1844 date was prophetically valid (Daniel 8:14); the error was in the expected event, not the timeline. This mirrors the apostles' misunderstanding of Christ's first-advent mission. Honest post-disappointment Bible study led to the sanctuary message, which is grounded in Hebrews 8-9 and Revelation 11:19, not in face-saving rationalization.",
    keyScriptures: [
      "Daniel 8:14 — 'Unto two thousand and three hundred days; then shall the sanctuary be cleansed.'",
      "Hebrews 8:1-2 — 'We have such a high priest, one who is seated at the right hand of the throne of the Majesty in heaven, a minister in the holy places, in the true tent.'",
      "Revelation 11:19 — 'Then God's temple in heaven was opened, and the ark of his covenant was seen within his temple.'",
      "Luke 24:25-27 — Jesus explaining to discouraged disciples that their misunderstanding did not invalidate the prophecy.",
    ],
    counterArguments: [
      "The time prophecy itself (2,300 year-days from 457 BC) is mathematically and historically verifiable regardless of what event was expected at its terminus.",
      "The apostles' disappointment at the cross (Luke 24:21: 'We had hoped he was the one to redeem Israel') followed an identical pattern — right time, wrong event — yet no one argues this invalidated Christianity.",
      "The post-1844 development of the sanctuary doctrine was driven by detailed Bible study (particularly Hebrews 8-9), not by group psychology. The 'cognitive dissonance' explanation fails to account for the deep scriptural engagement documented in early Adventist writings.",
      "Multiple independent lines of Bible study converged on the sanctuary conclusion — this was not the invention of a single charismatic leader but a community hermeneutical process.",
    ],
    closingStatement:
      "The Great Disappointment was genuinely painful and the Millerites genuinely erred about the event. But God has consistently led His people through misunderstanding into deeper truth — from the disciples at Calvary to the Adventist pioneers. The question is not 'Was October 22, 1844 perfect?' but 'Does the sanctuary message that emerged from that crucible stand on its own scriptural legs?' We believe it does.",
  },
  {
    subjectId: "ellen-white-credibility",
    title: "Responding to Ellen White Credibility Challenges",
    sdaPosition:
      "Ellen White exercised the biblical gift of prophecy (1 Corinthians 12:10; Ephesians 4:11) under the model of thought inspiration, not verbal dictation. Her use of sources is consistent with how biblical prophets operated. Her writings must be tested by Scripture (1 Thessalonians 5:20-21), and they consistently pass that test by uplifting Christ, affirming the Bible's authority, and producing spiritual fruit.",
    keyScriptures: [
      "1 Thessalonians 5:20-21 — 'Do not despise prophecies, but test everything; hold fast what is good.'",
      "Revelation 12:17 — The remnant has 'the testimony of Jesus,' identified in Revelation 19:10 as 'the spirit of prophecy.'",
      "Luke 1:1-4 — Luke's explicit use of human research and sources in producing inspired Scripture.",
      "Matthew 7:15-20 — 'You will recognize them by their fruits.'",
    ],
    counterArguments: [
      "The SDA doctrine of inspiration has always been 'thought inspiration' — God impresses ideas on the prophet's mind, and the prophet expresses them in human language and literary style. This is the same model mainstream evangelical scholars apply to biblical inspiration.",
      "Literary dependence is not the same as plagiarism. Luke researched eyewitness accounts (Luke 1:1-4). Chronicles used royal court records. Jude quoted 1 Enoch. Using existing sources under divine guidance is a biblical pattern, not a disqualification.",
      "The fruit test (Matthew 7:16-20) is Jesus' own criterion for evaluating prophets. Ellen White's writings have led millions to deeper Bible study, healthier living, global education and medical mission, and a Christ-centered faith. This is remarkably good fruit for a supposed fraud.",
      "Critics must explain how a woman with a third-grade education produced over 100,000 pages of material covering theology, health, education, relationships, and prophecy that has remained remarkably consistent and relevant for over 150 years.",
    ],
    closingStatement:
      "We do not place Ellen White above Scripture — she herself insisted 'the Bible, and the Bible alone' is the rule of faith. But we recognize in her ministry the fulfillment of God's promise to guide His end-time people through the gift of prophecy. Test her writings by Scripture. Read them for yourself. And examine the fruit.",
  },
  {
    subjectId: "investigative-judgment-anxiety",
    title: "Responding to Investigative Judgment Anxiety",
    sdaPosition:
      "The Investigative Judgment is a pre-advent judgment in which Christ serves as the believer's Advocate (1 John 2:1), vindicating God's justice in saving sinners and demonstrating before the watching universe that those who claimed faith in Christ genuinely received His grace. The verdict is 'in favor of the saints' (Daniel 7:22). Rightly understood, this doctrine enhances assurance rather than destroying it.",
    keyScriptures: [
      "Daniel 7:9-10, 22 — The Ancient of Days sits in judgment, and 'judgment was given in favor of the saints of the Most High.'",
      "1 John 2:1 — 'If anyone does sin, we have an advocate with the Father, Jesus Christ the righteous.'",
      "2 Corinthians 5:10 — 'We must all appear before the judgment seat of Christ.'",
      "Romans 8:1, 33-34 — 'There is therefore now no condemnation... Who shall bring any charge against God's elect? It is God who justifies.'",
    ],
    counterArguments: [
      "The IJ is not a re-trial of forgiven sins — it is a vindication of God's decision to save those who trusted in Christ. The Advocate is Jesus Himself, and He has never lost a case.",
      "Judgment and assurance coexist throughout Scripture. Paul writes both 'no condemnation' (Romans 8:1) and 'we must all appear before the judgment seat' (2 Corinthians 5:10) without contradiction. The judgment confirms the verdict already rendered at the cross.",
      "Anxiety from the IJ teaching is almost always traceable to legalistic presentations that emphasize human performance rather than Christ's mediation. The doctrine itself, as articulated in the 28 Fundamental Beliefs, centers on Christ's priestly work, not human perfection.",
      "Daniel 7:22 explicitly says the judgment goes 'in favor of' the saints. This is a courtroom scene where the defendant wins. If your understanding of the IJ doesn't include that verdict, you haven't heard the full doctrine.",
    ],
    closingStatement:
      "If the Investigative Judgment makes you afraid, you may have received a distorted version of it. The biblical teaching is that Jesus Christ — your Creator, Redeemer, and Friend — stands as your Advocate in heaven's courtroom, and the verdict is already declared in your favor. That is not a message of fear. It is the ultimate assurance.",
  },
  {
    subjectId: "sda-cultural-legalism",
    title: "Responding to Cultural Legalism Charges",
    sdaPosition:
      "SDA theology teaches salvation by grace alone through faith alone in Christ alone (Fundamental Belief #10). Health reform, Sabbath-keeping, and lifestyle standards are responses to grace, not conditions for earning it. Where legalistic culture exists in SDA communities, it represents a distortion of Adventist theology that the church itself has repeatedly addressed and corrected.",
    keyScriptures: [
      "Ephesians 2:8-10 — 'For by grace you have been saved through faith... not a result of works... created in Christ Jesus for good works.'",
      "1 Corinthians 6:19-20 — 'Your body is a temple of the Holy Spirit... glorify God in your body.'",
      "Romans 14:17 — 'The kingdom of God is not a matter of eating and drinking but of righteousness and peace and joy in the Holy Spirit.'",
      "Titus 2:11-12 — 'The grace of God has appeared... training us to renounce ungodliness and worldly passions.'",
    ],
    counterArguments: [
      "The Ephesians 2:8-10 sequence is central to SDA soteriology: saved by grace (v.8), not by works (v.9), unto good works (v.10). Lifestyle is a fruit of salvation, never its root. Any SDA community teaching otherwise contradicts its own denominational theology.",
      "Every Christian tradition has lifestyle expectations. Catholics fast during Lent, Baptists prohibit alcohol, Quakers practice simplicity. The question is not whether a community has standards but whether those standards are presented as grace-empowered responses or as salvation requirements.",
      "The SDA health message has been spectacularly validated by science — the Loma Linda Blue Zone study, Adventist Health Studies 1 and 2, and broad epidemiological data show SDA vegetarians live 7-10 years longer. This is not cult behavior; it is evidence-based health counsel that happens to have been articulated 150 years before the research caught up.",
      "Former SDAs' painful experiences in legalistic congregations are real and deserve empathy. But the remedy for bad theology is good theology, not no theology. The SDA Church has invested heavily in grace-centered preaching and publishing precisely because it recognizes that legalism distorts the gospel.",
    ],
    closingStatement:
      "We grieve when SDA communities distort grace into legalism — that is a betrayal of the gospel we claim to uphold. But the answer to distortion is restoration, not abandonment. The health message, Sabbath rest, and lifestyle counsel are beautiful when rooted in the love of a God who cares about every dimension of human flourishing.",
  },
  {
    subjectId: "doctrinal-isolation",
    title: "Responding to Doctrinal Isolation Claims",
    sdaPosition:
      "SDA distinctive doctrines — the Sabbath, sanctuary, state of the dead, Spirit of Prophecy, and health message — are derived from Scripture, not from sectarian innovation. These teachings do not isolate SDAs from Christianity; they represent a recovery of biblical truths that were largely lost during centuries of tradition-based departure from Scripture. SDAs share all core Christian doctrines (Trinity, deity of Christ, substitutionary atonement, bodily resurrection, Second Coming) with the broader church.",
    keyScriptures: [
      "Revelation 14:6-12 — The Three Angels' Messages call the world back to 'the everlasting gospel' and worship of the Creator — not to sectarian isolation.",
      "Acts 17:11 — The Bereans 'received the word with all eagerness, examining the Scriptures daily to see if these things were so.'",
      "Isaiah 58:12 — 'You shall be called the repairer of the breach, the restorer of streets to dwell in.'",
    ],
    counterArguments: [
      "Distinctive does not mean isolated. Every Reformation tradition began by recovering truths the majority had abandoned — Luther on justification by faith, the Anabaptists on believers' baptism, the Baptists on religious liberty. Adventism continues this restoration trajectory by recovering the Sabbath, holistic anthropology, and sanctuary Christology.",
      "SDA theology affirms every article of the Apostles' Creed and the Nicene Creed. On the core doctrines that define Christianity — the Trinity, the deity and humanity of Christ, the substitutionary atonement, the bodily resurrection, salvation by grace through faith — Adventists are fully orthodox. The distinctive doctrines are additions to this foundation, not departures from it.",
      "The 'isolation' charge often functions as social pressure to conform to majority opinion. But truth has never been determined by majority vote in Scripture. Elijah was isolated; Jeremiah was isolated; Jesus was isolated. The question is not 'How many people agree with us?' but 'What does the Bible teach?'",
      "SDAs actively engage in ecumenical dialogue, interfaith cooperation on religious liberty, and collaborative humanitarian work through ADRA. The church participates in the World Council of Churches as an observer and maintains formal relationships with numerous Christian communions. This is not the behavior of an isolationist sect.",
    ],
    closingStatement:
      "We do not seek isolation — we seek faithfulness. If the Sabbath is in the Bible, we must keep it even if we're a minority. If the dead sleep until the resurrection, we must teach it even if it's unpopular. Distinctive is not the same as divisive. We extend our hand in fellowship to every sincere Christian while holding firmly to what we believe Scripture teaches.",
  },
];

// ── Modules ─────────────────────────────────────────────────────────────────

const modules = [
  {
    id: "mod-former-sda-1",
    subjectId: "great-disappointment-failure",
    title: "Module 1: The 1844 Challenge",
    doctrineBrief:
      "The 2,300-day prophecy of Daniel 8:14, beginning with the decree to restore Jerusalem in 457 BC, terminates in 1844 AD. The Millerite movement correctly identified the time but misidentified the event — expecting Christ's return to earth rather than the commencement of His high-priestly ministry in the Most Holy Place of the heavenly sanctuary (Hebrews 8:1-2; 9:23-24). The Great Disappointment, while genuinely painful, mirrors the apostles' experience when Christ was crucified instead of crowned (Luke 24:21). Honest post-disappointment Bible study — not rationalization — led to the sanctuary doctrine, which is firmly rooted in the typology of the Israelite Day of Atonement (Leviticus 16) and the heavenly sanctuary passages in Hebrews and Revelation.",
    steelmanArguments: [
      steelmanArguments[0], // Great Disappointment proves movement built on error
      steelmanArguments[5], // EGW failed predictions (related via prophetic reliability)
    ],
    hiddenAssumptions: [
      "A prophetic miscalculation about the nature of the event invalidates the prophetic time calculation itself.",
      "Correcting a misunderstanding after further Bible study is identical to inventing a cover story.",
      "God never leads His people through periods of confusion or disappointment — genuine divine guidance produces immediate, perfect understanding.",
    ],
    mindGames: [mindGames[0], mindGames[3], mindGames[4]],
    fallacies: [fallacies[0], fallacies[4]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "former-sda",
    debriefPrompt:
      "Reflect on how you handled the emotional weight of the 1844 objection. Did you acknowledge the legitimacy of the disappointment before presenting the biblical evidence? Were you able to distinguish between the time calculation (which was correct) and the event expectation (which was wrong)? How would you help someone who sees the Great Disappointment as proof that the entire Adventist movement is fraudulent?",
  },
  {
    id: "mod-former-sda-2",
    subjectId: "ellen-white-credibility",
    title: "Module 2: Defending the Prophetic Gift",
    doctrineBrief:
      "Seventh-day Adventists believe that Ellen G. White (1827-1915) exercised the biblical gift of prophecy as described in 1 Corinthians 12:10, Ephesians 4:11-13, and Revelation 12:17 / 19:10. Her ministry operated under 'thought inspiration' — God impressed ideas on her mind, and she expressed them using her own language, literary style, and available sources, just as Luke researched eyewitness accounts (Luke 1:1-4) and biblical chroniclers used royal annals. She consistently pointed to Scripture as the ultimate authority ('The Bible, and the Bible alone, is to be our creed' — Review and Herald, Dec. 15, 1885) and testified of Christ as the center of all truth. Her writings are tested by the biblical criteria of Isaiah 8:20, Deuteronomy 18:22, Matthew 7:15-20, and 1 John 4:1-3.",
    steelmanArguments: [
      steelmanArguments[1], // EGW plagiarized — Veltman study
      steelmanArguments[5], // EGW failed predictions
    ],
    hiddenAssumptions: [
      "Prophetic inspiration requires verbal dictation with zero human literary engagement.",
      "Using existing sources is automatically dishonest, even though biblical authors did the same thing.",
      "One imperfect prediction disqualifies a prophet entirely, regardless of the conditional nature of prophecy.",
    ],
    mindGames: [mindGames[0], mindGames[1], mindGames[4]],
    fallacies: [fallacies[0], fallacies[3]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "former-sda",
    debriefPrompt:
      "How did you navigate the emotional intensity of attacks on Ellen White? Were you able to present the thought-inspiration model without sounding defensive? Did you address the plagiarism charge by pointing to biblical precedent (Luke's research, Jude quoting Enoch) rather than just denying the literary parallels? Consider how you might help someone who feels personally betrayed by discovering that Ellen White used sources.",
  },
  {
    id: "mod-former-sda-3",
    subjectId: "investigative-judgment-anxiety",
    title: "Module 3: Judgment and Assurance",
    doctrineBrief:
      "The Investigative Judgment (IJ) is a pre-advent, pre-Second-Coming phase of judgment described in Daniel 7:9-14 and prefigured by the Day of Atonement in Leviticus 16. Beginning in 1844 at the conclusion of the 2,300-day prophecy, Christ entered the Most Holy Place of the heavenly sanctuary to undertake a work of review and vindication. This judgment serves multiple purposes: (1) it vindicates God's character before the watching universe by demonstrating the justice of His decisions regarding salvation; (2) it confirms the genuineness of every profession of faith; and (3) it reveals Christ as the believer's Advocate who 'ever lives to make intercession' (Hebrews 7:25). Crucially, the verdict of this judgment is declared 'in favor of the saints' (Daniel 7:22, ESV). The IJ does not undermine assurance — it provides its cosmic foundation.",
    steelmanArguments: [
      steelmanArguments[2], // IJ means God doesn't really forgive
    ],
    hiddenAssumptions: [
      "A loving God would never subject His children to any form of judgment.",
      "Assurance and accountability are mutually exclusive categories.",
      "The IJ doctrine teaches that salvation depends on sinless perfection or complete knowledge of every sin committed.",
    ],
    mindGames: [mindGames[1], mindGames[2]],
    fallacies: [fallacies[1], fallacies[4]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "former-sda",
    debriefPrompt:
      "This is one of the most emotionally charged subjects because real people have experienced real anxiety. Evaluate your performance: Did you lead with empathy before theology? Were you able to present the IJ as 'judgment in favor of the saints' (Daniel 7:22) rather than as a threatening review? How would you respond to someone who says, 'I know the theology, but I still can't shake the fear'?",
  },
  {
    id: "mod-former-sda-4",
    subjectId: "sda-cultural-legalism",
    title: "Module 4: Grace, Law, and Culture",
    doctrineBrief:
      "Seventh-day Adventists confess that 'salvation is all of grace and not of works, but its fruitage is obedience to the Commandments' (Fundamental Belief #19). The church teaches that the moral law (Ten Commandments) is an eternal expression of God's character (Psalm 119:89; Matthew 5:17-19), that Sabbath-keeping is a creation ordinance rooted in Genesis 2:2-3 and reiterated in the Decalogue, and that health reform is a response to the principle that the body is the temple of the Holy Spirit (1 Corinthians 6:19-20). These lifestyle practices are fruits of a saving relationship with Christ, empowered by the Holy Spirit, not conditions for earning salvation. Where SDA communities have distorted this grace-law balance into legalism, the denomination itself has worked to correct the error through publications, seminary education, and pastoral training.",
    steelmanArguments: [
      steelmanArguments[3], // Health message and dress standards are cult behavior
    ],
    hiddenAssumptions: [
      "Lifestyle standards in a religious community are inherently coercive regardless of how they are presented.",
      "The worst congregational experiences represent the denomination's official theology.",
      "Health counsel and modest dress expectations are unique to cults rather than being common across religious traditions.",
    ],
    mindGames: [mindGames[1], mindGames[2], mindGames[3]],
    fallacies: [fallacies[1], fallacies[2]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "former-sda",
    debriefPrompt:
      "Legalism charges are deeply personal because they arise from real hurt. Assess your approach: Did you validate the person's experience before defending the theology? Were you able to distinguish between what the SDA Church officially teaches and what a particular congregation or family practiced? How did you handle the 'cult' accusation without becoming defensive? Remember: empathy is not a concession — it is Christlikeness.",
  },
  {
    id: "mod-former-sda-5",
    subjectId: "doctrinal-isolation",
    title: "Module 5: Distinctive Without Being Divisive",
    doctrineBrief:
      "The Seventh-day Adventist Church understands itself as a prophetic movement called into existence to proclaim the Three Angels' Messages of Revelation 14:6-12 — a final restoration of gospel truth before Christ's return. SDA distinctive doctrines (the seventh-day Sabbath, the heavenly sanctuary and Investigative Judgment, conditional immortality, the prophetic gift in Ellen White's ministry, and holistic health) are presented not as innovations but as recoveries of biblical teachings obscured during centuries of tradition-based theology. At the same time, the church affirms the full range of orthodox Christian doctrine (Trinity, deity of Christ, substitutionary atonement, bodily resurrection) and recognizes sincere believers in every Christian communion. The 'remnant' identity is understood as a prophetic calling to faithfulness, not as an exclusive claim to salvation.",
    steelmanArguments: [
      steelmanArguments[4], // If SDAs are right, everyone else is wrong
      steelmanArguments[3], // Cult behavior (related via isolation)
    ],
    hiddenAssumptions: [
      "Distinctive doctrinal identity is inherently divisive and arrogant.",
      "The remnant concept means non-SDAs are excluded from salvation.",
      "Ecumenical unity requires erasing doctrinal distinctives.",
    ],
    mindGames: [mindGames[3], mindGames[4]],
    fallacies: [fallacies[2], fallacies[3]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "former-sda",
    debriefPrompt:
      "Reflect on the tension between conviction and humility. Were you able to affirm SDA prophetic identity without sounding arrogant or exclusivist? Did you clearly communicate that the SDA Church recognizes sincere believers in other communions? How would you respond to someone who says, 'I left because I couldn't stomach the idea that my non-SDA Christian friends were in Babylon'? The goal is to present the remnant message as an invitation, not an indictment.",
  },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const formerSdaTraining: AATSAvatarTraining = {
  avatarId: "former-sda",
  avatarName: "The Former SDA",
  emoji: "\u{1F6AA}",
  color: "border-rose-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
