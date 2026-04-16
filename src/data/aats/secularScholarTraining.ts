// ─── AATS Training Data: The Secular Scholar ────────────────────────────────
// Apologetics Avatar Training System — secular academic biblical criticism

import type { AATSAvatarTraining } from "../aatsTrainingData";

/* ── Subjects ────────────────────────────────────────────────────────────── */

const subjects = [
  {
    id: "late-daniel-dating",
    title: "Late Daniel Dating",
    description:
      "Daniel was written ~165 BC, after the events it 'predicts'",
  },
  {
    id: "biblical-manuscript-criticism",
    title: "Biblical Manuscript Criticism",
    description:
      "Textual criticism shows the Bible is a human document with errors",
  },
  {
    id: "historical-jesus-vs-christ",
    title: "Historical Jesus vs Christ of Faith",
    description:
      "The historical Jesus is different from the Christ theology created",
  },
  {
    id: "naturalistic-worldview",
    title: "Naturalistic Worldview",
    description:
      "Miracles don't happen; all biblical miracles have natural explanations",
  },
  {
    id: "religious-evolution-theory",
    title: "Religious Evolution Theory",
    description:
      "Religion evolved from polytheism to monotheism; Christianity is just one stage",
  },
];

/* ── Steelman Arguments ──────────────────────────────────────────────────── */

const steelmanArguments = [
  {
    id: "ss-steel-1",
    title: "Daniel's 'Prophecy' Matches Maccabean History Too Precisely",
    argument:
      "Daniel 11 describes the Seleucid-Ptolemaic wars and Antiochus IV Epiphanes with a level of detail that is unparalleled in genuine predictive prophecy. The text shifts from accurate history to failed predictions at exactly 165 BC, strongly suggesting the author was writing during the Maccabean crisis and retrojecting 'prophecy' onto known events — a common ancient literary device called vaticinium ex eventu.",
    hiddenAssumptions: [
      "Genuine predictive prophecy is impossible a priori",
      "Precision of fulfillment counts against authenticity rather than for it",
      "The alleged 'failed predictions' after 165 BC are not simply unfulfilled dual-fulfillment prophecies",
    ],
    sdaResponse:
      "Daniel's Imperial Aramaic vocabulary and Persian loan-words fit a 6th-century BC composition far better than a 2nd-century one. The Dead Sea Scrolls contain multiple Daniel manuscripts (4QDan-a dated paleographically to ~125 BC), leaving almost no time for a 165 BC composition to gain canonical acceptance. Furthermore, Daniel's four-kingdom schema was already established tradition by the time the LXX was translated, and the book's theology of resurrection (Dan 12:2) influenced 1 Enoch, which also predates the Maccabean period. The precision of Daniel 11 is evidence for, not against, divine foreknowledge.",
  },
  {
    id: "ss-steel-2",
    title: "Textual Variants Undermine Biblical Inerrancy",
    argument:
      "There are over 400,000 textual variants across New Testament manuscripts — more variants than words in the entire New Testament. The endings of Mark (16:9-20), the Comma Johanneum (1 John 5:7-8), and the Pericope Adulterae (John 7:53–8:11) are later additions. If God intended to preserve His word perfectly, the manuscript evidence shows He did not succeed.",
    hiddenAssumptions: [
      "Quantity of variants implies quality of variants (most are trivial spelling differences)",
      "Later scribal additions negate the reliability of the broader textual tradition",
      "Inerrancy requires perfect manuscript transmission rather than recoverable original readings",
    ],
    sdaResponse:
      "The sheer volume of New Testament manuscripts (5,800+ Greek, 10,000+ Latin, 9,300+ other languages) is precisely why we can identify variants — and correct them. Over 99% of variants are inconsequential (spelling, word order), and no core Christian doctrine depends on a disputed passage. By comparison, we have only 7 manuscripts of Plato's Tetralogia and 49 of Aristotle's works, yet scholars trust those texts. The Bible's textual tradition is the most robust of any ancient document. SDA scholar F.F. Bruce noted that the textual evidence for the New Testament is vastly superior to that of any other ancient writing.",
  },
  {
    id: "ss-steel-3",
    title: "The Historical Jesus Was an Apocalyptic Prophet, Not God",
    argument:
      "Using the criteria of embarrassment, multiple attestation, and dissimilarity, historians reconstruct a Jesus who was a Jewish apocalyptic prophet expecting an imminent end of the age — not the divine Son of God. High Christology developed gradually through decades of theological reflection by Greek-influenced communities. The Gospel of Mark (earliest) has the lowest Christology; John (latest) has the highest. This trajectory shows theology evolving, not being revealed.",
    hiddenAssumptions: [
      "The historical method's methodological naturalism is also ontological naturalism",
      "Early high Christology evidence (Phil 2:6-11, 1 Cor 8:6) is ignored or late-dated",
      "Dissimilarity criterion artificially strips Jesus of both Jewish and Christian context",
    ],
    sdaResponse:
      "Larry Hurtado and Richard Bauckham have demonstrated that the highest Christology appears in the earliest sources. Philippians 2:5-11 is a pre-Pauline hymn placing Jesus in the identity of YHWH — dating to within years of the crucifixion. 1 Corinthians 8:6 inserts Jesus into the Shema itself. The 'evolutionary model' of Christology from Bousset has been decisively refuted: Jewish monotheism was the context, not a barrier, for recognizing Jesus's divine identity. Jesus's own claims (Mark 14:62, combining Daniel 7 and Psalm 110) were understood as blasphemous precisely because they were divine claims.",
  },
  {
    id: "ss-steel-4",
    title: "Miracles Violate Natural Laws and Are Never Verified",
    argument:
      "David Hume argued that the evidence for the regularity of natural law will always outweigh testimony for a miracle. No miracle has ever been confirmed under controlled scientific conditions. Ancient peoples attributed natural events (epilepsy, storms, eclipses) to divine action because they lacked scientific understanding. Every 'miracle' that has been investigated has a natural explanation or insufficient evidence.",
    hiddenAssumptions: [
      "Natural laws are prescriptive (dictating what can happen) rather than descriptive (describing what normally happens)",
      "Hume's argument doesn't beg the question by defining miracles out of existence",
      "The absence of lab-controlled miracles means God cannot act in history",
    ],
    sdaResponse:
      "Hume's argument is circular: it presupposes that miracles don't happen to conclude they can't happen. Natural laws describe regular patterns; they don't prescribe the limits of reality. If a God exists who created natural laws, He can act within His creation. The resurrection of Jesus is the test case: the empty tomb is conceded by most scholars (including skeptics like Gerd Lüdemann), the post-mortem appearances are multiply attested, and the transformation of the disciples from hiding to martyrdom demands explanation. N.T. Wright demonstrates that no naturalistic hypothesis accounts for all the data as well as the resurrection.",
  },
  {
    id: "ss-steel-5",
    title: "Israelite Religion Evolved from Polytheism",
    argument:
      "Archaeological evidence from Kuntillet Ajrud and Khirbet el-Qom inscriptions mention 'YHWH and his Asherah.' Israelites worshipped multiple gods, and monotheism only emerged during the exile under Deuteronomistic editors. The biblical narrative of pristine monotheism corrupted by apostasy is a later theological revision — the reality was the opposite: polytheism was the norm, and monotheism was the innovation.",
    hiddenAssumptions: [
      "Popular practice defines official theology (the biblical text itself acknowledges Israelite polytheistic practices as apostasy)",
      "Archaeological evidence of syncretism disproves the existence of an original monotheistic tradition",
      "The Deuteronomistic 'editing' theory is established fact rather than a contested scholarly model",
    ],
    sdaResponse:
      "The Bible itself records Israelite polytheism extensively — it doesn't hide it. Judges, Kings, and the prophets repeatedly condemn worship of Baal, Asherah, and other deities. Finding archaeological evidence of what the Bible already tells us is not a refutation; it is confirmation. The question is whether the monotheistic tradition was original (with apostasy being the departure) or late (with monotheism being the innovation). The antiquity of the Shema (Deut 6:4), the Mosaic covenant structure paralleling Hittite suzerainty treaties (2nd millennium BC, not 1st), and the consistent prophetic framework of 'return to YHWH alone' all support the biblical narrative of original monotheism corrupted by syncretism.",
  },
  {
    id: "ss-steel-6",
    title: "The Canon Was a Political Decision, Not Divine Guidance",
    argument:
      "The biblical canon was decided by church councils centuries after the texts were written. Books like the Gospel of Thomas, the Shepherd of Hermas, and the Didache were used by early Christians but excluded. The 'winning' faction determined orthodoxy, and the losers were branded heretics. Walter Bauer's thesis shows that 'heresy' often preceded 'orthodoxy' in many regions.",
    hiddenAssumptions: [
      "Councils created the canon rather than recognized existing consensus",
      "Bauer's thesis has survived scholarly critique (it largely hasn't)",
      "Diversity of early Christian texts means there was no core apostolic tradition",
    ],
    sdaResponse:
      "The core New Testament canon was functionally established long before any council. By AD 130, the four Gospels and Paul's letters were widely recognized. The Muratorian Fragment (~170 AD) lists most NT books. Councils like Carthage (397) ratified what churches already practiced. Bauer's thesis has been systematically dismantled by scholars like Thomas Robinson, who showed that orthodoxy preceded 'heresy' in most regions Bauer examined. The rejected texts (Gospel of Thomas, Gospel of Peter) are demonstrably later, gnostic in theology, and lack apostolic connection. The canon emerged organically from apostolicity, orthodoxy, catholicity, and traditional usage — not political power.",
  },
];

/* ── Mind Games ──────────────────────────────────────────────────────────── */

const mindGames = [
  {
    id: "ss-mind-1",
    name: "The Credential Shield",
    description:
      "Leveraging academic degrees and institutional prestige to imply that non-credentialed believers cannot meaningfully engage with the evidence. The argument shifts from data to authority, making the Christian feel unqualified to respond.",
    example:
      "\"I have a PhD in Ancient Near Eastern Studies from Yale. With all due respect, you're reading the Bible devotionally, not critically. You haven't engaged with the primary sources in their original languages.\"",
    detectionTip:
      "Credentials inform expertise but don't determine truth. Ask: 'Are you arguing from evidence or from authority? Can we look at the evidence itself?' Many credentialed scholars (Hurtado, Bauckham, Kitchen) reach conservative conclusions from the same data.",
  },
  {
    id: "ss-mind-2",
    name: "The Consensus Cudgel",
    description:
      "Citing 'scholarly consensus' as if it were a monolithic, unchallengeable verdict rather than a spectrum of opinions with significant dissenting voices. This pressures the believer to feel they are opposing 'all of scholarship.'",
    example:
      "\"The scholarly consensus is clear: Daniel was written in the 2nd century BC. You're fighting against the entire academic world on this.\"",
    detectionTip:
      "Ask what 'consensus' means — which scholars, what percentage, and whether the consensus has shifted over time. Many 'consensuses' are held within particular methodological frameworks (e.g., methodological naturalism) that predetermine conclusions. Note respected scholars who dissent.",
  },
  {
    id: "ss-mind-3",
    name: "The Sophistication Trap",
    description:
      "Reframing simple faith as intellectual naivety, implying that truly intelligent people outgrow literalistic readings. This creates social pressure to adopt critical views to avoid appearing unsophisticated.",
    example:
      "\"Educated Christians don't actually believe in a literal six-day creation or a historical Adam. Those are pre-scientific myths that sophisticated believers interpret metaphorically.\"",
    detectionTip:
      "This is a form of social proof manipulation. Ask: 'Is the argument that this position is wrong because some people find it unsophisticated? That's an appeal to snobbery, not evidence.' Many brilliant scientists and scholars hold to traditional readings.",
  },
  {
    id: "ss-mind-4",
    name: "The Methodological Bait-and-Switch",
    description:
      "Starting with legitimate methodological naturalism (a tool for historical investigation) and silently replacing it with ontological naturalism (the philosophical claim that nothing supernatural exists). The scholar pretends the method proves the metaphysics.",
    example:
      "\"As historians, we can only deal with natural causes. Therefore, the resurrection didn't happen — we need to find what really occurred.\"",
    detectionTip:
      "Distinguish between 'our method doesn't address supernatural causes' and 'supernatural causes don't exist.' The first is a methodological limitation; the second is a philosophical claim that requires its own justification. Ask: 'Is your method designed to detect divine action, or is it designed to exclude it?'",
  },
  {
    id: "ss-mind-5",
    name: "The Deconstruction Cascade",
    description:
      "Rapidly piling up multiple challenges (textual variants, source criticism, contradictions, historical problems) without allowing time to address any single one. The goal is to create an overwhelming sense that the Bible is unreliable without actually proving any individual claim.",
    example:
      "\"The two creation accounts contradict, the flood narrative has two interwoven sources, the Exodus is archaeologically unattested, the conquest narrative is contradicted by settlement models, and the Gospels can't agree on the resurrection details. How can you trust any of it?\"",
    detectionTip:
      "Slow the conversation down. Say: 'Let's take these one at a time. Which single issue do you think is strongest?' A rapid barrage is a debate tactic, not scholarship. Each claim, when examined individually, is far more contestable than the cascade implies.",
  },
];

/* ── Fallacies ───────────────────────────────────────────────────────────── */

const fallacies = [
  {
    id: "ss-fall-1",
    name: "Chronological Snobbery",
    definition:
      "Dismissing ancient texts, beliefs, or arguments simply because they are old, assuming that modern understanding is inherently superior on all questions. This treats the date of an idea as evidence of its falsehood.",
    example:
      "\"The Bible reflects a pre-scientific worldview. Ancient people believed in a three-tiered universe — they simply didn't know what we know now.\"",
    counterMove:
      "Age does not determine truth. Mathematics, logic, and many philosophical insights from antiquity remain valid. The question is not when something was written but whether it is true. Furthermore, ancient peoples were not as naive as modern scholars sometimes assume — they knew that dead people stay dead, which is precisely why the resurrection was shocking.",
  },
  {
    id: "ss-fall-2",
    name: "Genetic Fallacy",
    definition:
      "Attempting to discredit a belief by explaining its psychological, sociological, or evolutionary origin rather than engaging with its truth claims. The origin of a belief says nothing about whether it is true.",
    example:
      "\"Religion evolved because it provided social cohesion for early human communities. Christianity emerged from Judaism's interaction with Hellenistic mystery religions.\"",
    counterMove:
      "Explaining how a belief arose does not address whether it is true. The origin of the theory of gravity in Newton's observations doesn't make gravity false. Even if one could explain why someone believes something, you've only explained the psychology of belief, not refuted the belief itself. Address the evidence directly.",
  },
  {
    id: "ss-fall-3",
    name: "Appeal to Methodological Naturalism as Metaphysical Naturalism",
    definition:
      "Conflating the methodological assumption that historical investigation focuses on natural causes (a useful tool) with the metaphysical claim that only natural causes exist (a philosophical position). The method becomes an unargued worldview commitment.",
    example:
      "\"Historians can only work with natural causes. Therefore we know the resurrection didn't happen.\"",
    counterMove:
      "Methodological naturalism is a limitation of the method, not a conclusion it produces. A metal detector won't find plastic objects, but that doesn't prove plastic doesn't exist. If the evidence best fits a supernatural explanation, insisting on only natural explanations is not following the evidence — it is imposing a prior commitment onto the evidence.",
  },
  {
    id: "ss-fall-4",
    name: "Argument from Silence / Absence of Evidence",
    definition:
      "Claiming that because archaeological or textual evidence for a biblical event has not been found, the event did not occur. This confuses absence of evidence with evidence of absence, especially in a field where new discoveries regularly overturn previous 'conclusions.'",
    example:
      "\"There is no archaeological evidence for the Exodus. Therefore, it didn't happen.\"",
    counterMove:
      "Absence of evidence is not evidence of absence, particularly in Near Eastern archaeology where a tiny fraction of sites have been excavated. The Hittite civilization was once dismissed as fictional until Hattusa was discovered. The Tel Dan inscription confirmed the House of David after decades of scholars denying David's existence. The argumentum ex silentio is especially weak in archaeology, where new discoveries regularly overturn established positions.",
  },
  {
    id: "ss-fall-5",
    name: "Question-Begging Redaction Criticism",
    definition:
      "Circular reasoning in source criticism where the existence of editorial layers is assumed, then used to 'reconstruct' earlier sources, then the reconstructed sources are cited as evidence for the editorial layers. The methodology creates its own evidence.",
    example:
      "\"The Pentateuch clearly has JEDP sources — notice how Elohim and YHWH are used by different authors. This proves multiple human authors over centuries, not Mosaic authorship.\"",
    counterMove:
      "The Documentary Hypothesis has undergone massive revision since Wellhausen. Many scholars (Whybray, Rendtorff, Kikawada) now reject classic JEDP. The use of different divine names follows theological and contextual patterns (Elohim for transcendence, YHWH for covenant relationship), a literary device known in other ancient Near Eastern texts. The 'evidence' for the sources is often the hypothesis itself applied circularly.",
  },
];

/* ── Counter Strategies ──────────────────────────────────────────────────── */

const counterStrategies = [
  {
    subjectId: "late-daniel-dating",
    title: "Defending the Early Date of Daniel",
    sdaPosition:
      "Daniel was written in the 6th century BC during the Babylonian exile by the prophet Daniel himself, as internal evidence and early attestation indicate. Its prophetic accuracy reflects genuine divine foreknowledge, not post-event fabrication.",
    keyScriptures: [
      "Daniel 2:44 — God's kingdom shall never be destroyed",
      "Daniel 7:13-14 — One like the Son of Man receives everlasting dominion",
      "Daniel 12:4 — Seal the book until the time of the end",
      "Matthew 24:15 — Jesus references 'Daniel the prophet' by name",
      "Ezekiel 14:14,20 — Ezekiel names Daniel as a real, righteous figure alongside Noah and Job",
    ],
    counterArguments: [
      "Daniel's Imperial Aramaic (2:4–7:28) fits the 6th–5th century BC linguistic profile far better than the 2nd century BC. Persian loan-words and the absence of Greek loan-words (except possibly three musical instrument names, which reflect international trade, not late composition) support early dating.",
      "Dead Sea Scroll manuscripts of Daniel (4QDan-a, 4QDan-b, 4QDan-c) date paleographically to ~125–50 BC. A 165 BC composition leaves virtually no time for the book to be copied, circulated, accepted as canonical, and included in a sectarian library at Qumran. The Qumran community treated Daniel as Scripture, not recent literature.",
      "Jesus himself referred to 'Daniel the prophet' (Matt 24:15), authenticating both the person and the prophetic nature of the book. If Jesus was wrong about Daniel, the Secular Scholar must account for why Jesus's judgment is unreliable on this point while potentially trusting Him on moral teachings.",
      "Ezekiel 14:14,20 mentions Daniel as a real person renowned for righteousness, writing during the exile itself — this is a contemporary reference that makes no sense if Daniel was a fictional 2nd-century character.",
      "The four-kingdom schema in Daniel 2 and 7 (Babylon, Medo-Persia, Greece, Rome) extends well beyond 165 BC, including the prediction of Rome's division — events no Maccabean author could have foreseen. The 'late date' theory must either reidentify the fourth kingdom (usually as Greece) or admit the prophecy extends beyond its alleged composition date.",
    ],
    closingStatement:
      "The linguistic, manuscript, and historical evidence for an early Daniel is substantial and growing. The late-date theory rests on the prior assumption that predictive prophecy is impossible — a philosophical commitment, not a scholarly conclusion. When examined on the evidence, Daniel stands as a powerful testimony to God's foreknowledge and sovereignty over history.",
  },
  {
    subjectId: "biblical-manuscript-criticism",
    title: "Defending Biblical Textual Reliability",
    sdaPosition:
      "The Bible is the most well-attested document of antiquity. While textual variants exist, the manuscript tradition preserves the original readings with extraordinary fidelity, and no Christian doctrine is affected by any viable variant.",
    keyScriptures: [
      "Isaiah 40:8 — The word of our God stands forever",
      "Psalm 119:89 — Forever, O Lord, Your word is settled in heaven",
      "Matthew 5:18 — Not one jot or tittle shall pass from the law",
      "2 Timothy 3:16 — All Scripture is God-breathed",
      "2 Peter 1:21 — Holy men of God spoke as they were moved by the Holy Spirit",
    ],
    counterArguments: [
      "The '400,000 variants' figure is misleading because it counts every single spelling difference in every single manuscript. When you have 5,800+ Greek manuscripts, minor copying variations multiply. The vast majority (over 99%) are trivial: movable nu, itacism (vowel interchange), or word-order differences that don't affect meaning in Greek.",
      "The Isaiah scroll from Qumran (1QIsa-a) dates to ~125 BC and is 95% identical to the Masoretic text from 1,000 years later. The 5% difference is almost entirely spelling variations. This demonstrates extraordinary preservation over a millennium — far exceeding any other ancient text.",
      "No core Christian doctrine — the deity of Christ, the resurrection, salvation by grace, the Second Coming, the Sabbath — depends on any disputed textual variant. Scholars across the theological spectrum (Ehrman, Metzger, Wallace) agree on this point.",
      "The New Testament's manuscript evidence is unparalleled in antiquity. Homer's Iliad has ~1,900 manuscripts; the NT has 5,800+ Greek manuscripts plus 10,000+ Latin and 9,300+ other early versions. The gap between the original and earliest copies is decades for the NT versus centuries for other ancient texts.",
      "Identifying later additions (Mark 16:9-20, the Comma Johanneum) is a feature of textual criticism, not a bug. It demonstrates that the discipline can detect and correct scribal additions, increasing our confidence in the remaining text, not decreasing it.",
    ],
    closingStatement:
      "The manuscript evidence for the Bible is the strongest of any ancient document by every measurable standard — number of manuscripts, time gap to originals, and internal consistency. The very tools of textual criticism that identify variants also confirm the remarkable preservation of the biblical text. God has providentially preserved His word through the manuscript tradition.",
  },
  {
    subjectId: "historical-jesus-vs-christ",
    title: "Defending the Unity of the Historical Jesus and the Christ of Faith",
    sdaPosition:
      "The historical Jesus and the Christ of faith are the same person. The earliest Christian sources affirm the highest Christology, and the resurrection is the best historical explanation for the origin of Christianity.",
    keyScriptures: [
      "Philippians 2:5-11 — Pre-Pauline hymn: Jesus in the form of God",
      "1 Corinthians 8:6 — One Lord, Jesus Christ, through whom all things exist",
      "Mark 14:62 — Jesus combines Daniel 7:13 and Psalm 110:1 — a divine claim",
      "John 1:1-3 — In the beginning was the Word",
      "Colossians 1:15-17 — He is before all things, and in Him all things hold together",
    ],
    counterArguments: [
      "The earliest Christian sources already contain the highest Christology. Philippians 2:5-11 is widely recognized as a pre-Pauline hymn (pre-AD 50) that places Jesus within the divine identity of YHWH. This isn't 'evolution' — it's explosion. High Christology appeared immediately.",
      "1 Corinthians 8:6 restructures the Jewish Shema (Deut 6:4) to include Jesus alongside the Father. Paul wrote this ~AD 55, but the formula itself is earlier. Jewish monotheists were including Jesus in the divine identity within years of the crucifixion — not decades or centuries.",
      "The criteria of authenticity (embarrassment, multiple attestation, coherence) actually support a Jesus who made divine claims. His execution for blasphemy (Mark 14:62-64) is multiply attested and satisfies the criterion of embarrassment — early Christians would not invent a scene where Jesus was condemned.",
      "The resurrection best explains all the historical data: (1) the empty tomb conceded by most scholars, (2) post-mortem appearances to individuals and groups, (3) the transformation of the disciples, (4) the conversion of the persecutor Paul, and (5) the conversion of the skeptic James. No naturalistic hypothesis (hallucination, swoon, theft) accounts for all five facts.",
      "The 'evolutionary Christology' model (low to high over decades) was championed by Wilhelm Bousset in 1913. It has been decisively critiqued by Larry Hurtado (Lord Jesus Christ, 2003) and Richard Bauckham (Jesus and the God of Israel, 2008), who demonstrate that devotion to Jesus as divine emerged in Palestinian Jewish Christianity, not Hellenistic paganism.",
    ],
    closingStatement:
      "The dichotomy between the 'historical Jesus' and the 'Christ of faith' is a false one created by methodological assumptions, not historical evidence. The earliest sources — written within years of the events — present a Jesus who was worshipped as divine. The resurrection remains the best explanation for the explosive origin of Christianity.",
  },
  {
    subjectId: "naturalistic-worldview",
    title: "Challenging Naturalistic Presuppositions",
    sdaPosition:
      "Naturalism is a philosophical commitment, not a scientific conclusion. The existence of a Creator God who acts in history is not only philosophically coherent but is the best explanation for key historical events, particularly the resurrection of Jesus Christ.",
    keyScriptures: [
      "Psalm 19:1 — The heavens declare the glory of God",
      "Romans 1:20 — God's invisible attributes are clearly seen from creation",
      "Acts 17:28 — In Him we live and move and have our being",
      "Hebrews 11:3 — By faith we understand the worlds were framed by the word of God",
      "1 Corinthians 15:14,17 — If Christ is not risen, our faith is in vain",
    ],
    counterArguments: [
      "Hume's argument against miracles is circular. He argues that uniform experience is against miracles, but he can only claim 'uniform experience' by excluding every alleged miracle in advance. The argument assumes its own conclusion. As C.S. Lewis noted, you cannot know that all experience is against miracles unless you already know that miracles never occur.",
      "Natural laws are descriptive, not prescriptive. They describe the regular patterns of nature; they do not dictate what an agent (divine or otherwise) can do. If God exists and created the natural order, He is not bound by it. A 'law' that says 'dead people stay dead' describes what happens in the absence of divine intervention — it does not rule out divine intervention.",
      "The fine-tuning of the universe (cosmological constants, initial conditions) represents powerful evidence for intelligent design that naturalism struggles to explain. The multiverse hypothesis is an untestable, unfalsifiable conjecture invoked specifically to avoid the theistic implications of fine-tuning.",
      "The resurrection of Jesus is the critical test case. The evidence — empty tomb, post-mortem appearances, origin of the disciples' belief — is best explained by actual resurrection. Naturalistic alternatives (hallucination theory, swoon theory, conspiracy theory) each fail to account for all the data. As N.T. Wright argues, the resurrection is the necessary condition for explaining the rise of early Christianity.",
      "Methodological naturalism is a useful tool for investigating repeatable phenomena. But history deals with unique, unrepeatable events. If a singular divine act occurred, a method that excludes singular divine acts a priori will never detect it — not because it didn't happen, but because the method isn't designed to find it.",
    ],
    closingStatement:
      "Naturalism is a worldview choice, not a conclusion demanded by evidence. The fine-tuning of the cosmos, the information content of DNA, the origin of consciousness, and the historical evidence for the resurrection all point beyond nature to its Creator. Christians need not be intimidated by the assumption that 'science has disproved God' — science has done no such thing.",
  },
  {
    subjectId: "religious-evolution-theory",
    title: "Challenging the Religious Evolution Model",
    sdaPosition:
      "The evolutionary model of religion (animism to polytheism to monotheism) is a 19th-century construct that has been undermined by anthropological and archaeological evidence. The biblical model of original monotheism followed by apostasy better fits the data.",
    keyScriptures: [
      "Genesis 1:1 — In the beginning God created — monotheism is the starting point",
      "Deuteronomy 6:4 — Hear, O Israel: The LORD our God, the LORD is one",
      "Romans 1:21-23 — They knew God but became futile in their thinking and exchanged His glory",
      "Acts 17:26-27 — God made all nations to seek Him",
      "Psalm 96:5 — All the gods of the nations are idols, but the LORD made the heavens",
    ],
    counterArguments: [
      "The evolutionary model of religion (Tylor, Frazer, Comte) is a 19th-century construct based on now-discredited unilinear social evolution. Modern anthropology has abandoned the idea that all cultures progress through the same stages. Ethnographic evidence shows that some of the most 'primitive' cultures (e.g., certain Aboriginal Australian groups) have sophisticated high-god concepts.",
      "Wilhelm Schmidt's massive study 'Der Ursprung der Gottesidee' (12 volumes) documented widespread evidence of 'primitive monotheism' — belief in a single high god — among the world's most ancient and isolated cultures. While Schmidt's work has limitations, his core observation stands: the simplest cultures often have the purest monotheistic concepts.",
      "The Bible itself records Israelite polytheism extensively (Judges 2:11-13, 1 Kings 11:4-8, 2 Kings 23:4-14). Finding archaeological evidence of what the Bible already describes is not a refutation of the biblical narrative — it is confirmation. The Bible's model is monotheism → apostasy → prophetic recall, and the archaeology confirms every part of this cycle.",
      "The Kuntillet Ajrud and Khirbet el-Qom inscriptions mentioning 'YHWH and his Asherah' prove that some Israelites practiced syncretism — exactly what the prophets condemned. They do not prove that official Yahwistic theology was polytheistic. Popular practice and prophetic theology were in constant tension, precisely as the Bible describes.",
      "The Mosaic covenant structure parallels Hittite suzerainty treaties from the 2nd millennium BC, not 1st millennium Assyrian treaties. This provides strong evidence for the antiquity of Israel's covenant monotheism, dating the core tradition to the Late Bronze Age — centuries before the alleged 'emergence' of monotheism in the Deuteronomistic program.",
    ],
    closingStatement:
      "The religious evolution model is a relic of 19th-century progressivism that modern evidence has severely undermined. The biblical narrative — that humanity began with knowledge of one God and repeatedly fell into idolatry — better accounts for the anthropological data, the archaeological evidence, and the consistent prophetic witness of Scripture.",
  },
];

/* ── Modules ─────────────────────────────────────────────────────────────── */

const modules = [
  {
    id: "ss-mod-1",
    subjectId: "late-daniel-dating",
    title: "Module 1: The Battle for Daniel",
    doctrineBrief:
      "The dating of Daniel is a linchpin of the secular-vs-supernatural debate. If Daniel was written in the 6th century BC, it contains genuine predictive prophecy that validates the supernatural worldview. If it was written in 165 BC, it is vaticinium ex eventu — a post-event 'prophecy' that undermines biblical credibility. SDA eschatology depends heavily on Daniel's authenticity, making this subject critical for Adventist apologetics.",
    steelmanArguments: [steelmanArguments[0]],
    hiddenAssumptions: [
      "Predictive prophecy is impossible — the conclusion is assumed before the evidence is examined",
      "Precision of fulfillment counts against authenticity rather than for it",
      "The Maccabean crisis provides the only plausible context for Daniel's composition",
      "Imperial Aramaic linguistic evidence can be dismissed or redated to fit the late-date hypothesis",
    ],
    mindGames: [mindGames[1], mindGames[3]],
    fallacies: [fallacies[2], fallacies[4]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "secular-scholar",
    debriefPrompt:
      "After sparring on Daniel's dating, reflect: Did you distinguish between the philosophical assumption (prophecy is impossible) and the historical evidence (linguistics, DSS manuscripts, Ezekiel's reference)? Were you able to shift the burden of proof back to the late-date hypothesis? How can you improve your handling of the Aramaic linguistic arguments?",
  },
  {
    id: "ss-mod-2",
    subjectId: "biblical-manuscript-criticism",
    title: "Module 2: The Text Under Siege",
    doctrineBrief:
      "Textual criticism is a legitimate scholarly discipline that has powerfully confirmed the reliability of the biblical text. However, secular scholars often weaponize the existence of textual variants to undermine confidence in Scripture. Understanding how manuscript evidence actually works — and how the Bible's textual tradition surpasses every other ancient document — is essential for defending the faith.",
    steelmanArguments: [steelmanArguments[1], steelmanArguments[5]],
    hiddenAssumptions: [
      "Quantity of textual variants implies the text is unreliable (it actually means we have more data to work with)",
      "Identifying scribal additions (Mark 16:9-20) undermines the rest of the text (it actually validates the critical method)",
      "Perfect transmission was required for divine inspiration to be meaningful",
      "The canon was imposed by political power rather than recognized by organic consensus",
    ],
    mindGames: [mindGames[0], mindGames[4]],
    fallacies: [fallacies[0], fallacies[3]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "secular-scholar",
    debriefPrompt:
      "After this module, evaluate: Can you now explain why 400,000 variants is evidence for textual reliability, not against it? Are you comfortable discussing the Isaiah Dead Sea Scroll comparison? Could you explain the difference between a viable variant and a trivial one?",
  },
  {
    id: "ss-mod-3",
    subjectId: "historical-jesus-vs-christ",
    title: "Module 3: Which Jesus?",
    doctrineBrief:
      "The 'Quest for the Historical Jesus' has been a project of liberal scholarship since Reimarus (1778). It seeks to strip away 'theological layers' to recover the 'real' Jesus underneath. However, the earliest Christian sources already contain the highest Christology, and the resurrection is the best explanation for the origin of the Church. The historical Jesus IS the Christ of faith.",
    steelmanArguments: [steelmanArguments[2]],
    hiddenAssumptions: [
      "The Gospels are primarily theological documents with minimal historical value",
      "High Christology developed gradually over decades through Hellenistic influence",
      "The criteria of authenticity can reliably separate 'authentic' Jesus material from church creation",
      "Paul's theology represents a departure from Jesus's own teaching rather than faithful transmission",
    ],
    mindGames: [mindGames[2], mindGames[3]],
    fallacies: [fallacies[1], fallacies[2]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "secular-scholar",
    debriefPrompt:
      "Reflect on this module: Can you now explain why Philippians 2:5-11 and 1 Corinthians 8:6 demolish the 'evolutionary Christology' model? Are you prepared to discuss the five facts about the resurrection that require explanation? How would you respond to someone who says the Gospels are 'biased sources'?",
  },
  {
    id: "ss-mod-4",
    subjectId: "naturalistic-worldview",
    title: "Module 4: Breaking the Naturalistic Box",
    doctrineBrief:
      "Naturalism — the assumption that only natural causes exist — is the philosophical foundation underlying most secular biblical criticism. It is not a conclusion of science but a starting assumption that predetermines conclusions. SDA apologetics must challenge this assumption directly, showing that it is a worldview choice, not an evidence-based conclusion, and that the evidence (especially the resurrection) points beyond nature to its Creator.",
    steelmanArguments: [steelmanArguments[3]],
    hiddenAssumptions: [
      "Science has established that miracles cannot occur (science describes natural regularities; it doesn't rule out non-regular events)",
      "Hume's argument against miracles is a valid philosophical proof (it is actually circular)",
      "Methodological naturalism in science implies ontological naturalism in philosophy",
      "Ancient people were credulous and accepted miracles uncritically (they knew dead people stay dead)",
    ],
    mindGames: [mindGames[3], mindGames[0]],
    fallacies: [fallacies[2], fallacies[0]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "secular-scholar",
    debriefPrompt:
      "After sparring on naturalism, consider: Can you clearly articulate the difference between methodological and ontological naturalism? Can you expose the circularity in Hume's argument? Were you able to present the resurrection evidence without being sidetracked by 'miracles are impossible' assertions?",
  },
  {
    id: "ss-mod-5",
    subjectId: "religious-evolution-theory",
    title: "Module 5: The Myth of Religious Evolution",
    doctrineBrief:
      "The 19th-century model of religious evolution (animism → polytheism → monotheism) remains influential in popular scholarship but has been significantly undermined by anthropological evidence. The biblical model — original monotheism corrupted by apostasy — actually fits the data better. This module equips the SDA believer to challenge the evolutionary assumption and defend the antiquity and originality of biblical monotheism.",
    steelmanArguments: [steelmanArguments[4]],
    hiddenAssumptions: [
      "All cultures evolve through the same religious stages (unilinear evolution — now largely abandoned in anthropology)",
      "Archaeological evidence of syncretism disproves the existence of a prior monotheistic tradition",
      "The Deuteronomistic History is a late invention rather than an ancient prophetic tradition",
      "Popular Israelite religion defines 'Israelite religion' rather than the prophetic-covenantal tradition",
    ],
    mindGames: [mindGames[1], mindGames[2]],
    fallacies: [fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "secular-scholar",
    debriefPrompt:
      "Reflect on your training: Can you explain why the Kuntillet Ajrud inscriptions confirm the biblical narrative rather than refute it? Are you able to present Schmidt's evidence for primitive monotheism? Can you identify when the scholar is importing 19th-century evolutionary assumptions into the discussion?",
  },
];

/* ── Export ───────────────────────────────────────────────────────────────── */

export const secularScholarTraining: AATSAvatarTraining = {
  avatarId: "secular-scholar",
  avatarName: "The Secular Scholar",
  emoji: "\uD83C\uDF93",
  color: "border-slate-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
