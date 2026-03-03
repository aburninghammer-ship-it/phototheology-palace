// ─── AATS: Ellen White's Critic Avatar Training Data ─────────────────────────
// Comprehensive training curriculum for defending Ellen G. White's prophetic
// ministry against critics who specifically target her credibility, writings,
// and role within the Seventh-day Adventist Church.

import type { AATSAvatarTraining } from "../aatsTrainingData";

// ── Subjects ────────────────────────────────────────────────────────────────

const subjects = [
  {
    id: "egw-plagiarism-charges",
    title: "EGW Plagiarism Charges",
    description:
      "Critics allege that Ellen White systematically copied from other authors without attribution, constituting plagiarism that disqualifies her claim to divine inspiration. The Veltman study and Walter Rea's 'The White Lie' are frequently cited as evidence.",
  },
  {
    id: "failed-prophecy-claims",
    title: "Failed Prophecy Claims",
    description:
      "Critics compile statements by Ellen White that appear to predict events which did not occur as described — particularly predictions about the nearness of Christ's return and specific historical outcomes — arguing these failures disqualify her under the Deuteronomy 18:22 test.",
  },
  {
    id: "shut-door-controversy",
    title: "Shut Door Controversy",
    description:
      "After October 22, 1844, early Adventists (including Ellen White) taught that probation had closed for those who rejected the Millerite message. Critics argue this 'shut door' teaching proves Ellen White held a false doctrine that she later quietly abandoned, undermining her prophetic reliability.",
  },
  {
    id: "health-visions-vs-science",
    title: "Health Visions vs Science",
    description:
      "Critics argue that Ellen White's health counsel was borrowed from 19th-century health reformers (Sylvester Graham, James Caleb Jackson, etc.) rather than received in vision, and that some of her health statements conflict with modern scientific findings.",
  },
  {
    id: "literary-dependency",
    title: "Literary Dependency",
    description:
      "Beyond specific plagiarism charges, critics argue that the overall structure, themes, and theological framework of Ellen White's major works demonstrate pervasive literary dependency on contemporary sources, reducing her writings to compilations rather than inspired compositions.",
  },
];

// ── Steelman Arguments ──────────────────────────────────────────────────────

const steelmanArguments = [
  {
    id: "ap-steelman-veltman-plagiarism",
    title: "The Veltman Study Proves Systematic Borrowing",
    argument:
      "The Fred Veltman study, commissioned by the SDA Church itself, examined 'The Desire of Ages' and found that up to 31% of the content in some chapters had literary parallels with previously published authors. This was not incidental overlap but structural and verbal dependence — sentences, paragraphs, and even the sequencing of ideas were drawn from authors like William Hanna, John Harris, Daniel March, and Alfred Edersheim. Ellen White claimed her writings came from divine vision: 'I do not write one article in the paper expressing merely my own ideas. They are what God has opened before me in vision' (Review and Herald, January 20, 1903). If she was copying from human sources while claiming divine origin, this is deception, not inspiration. The church's own commissioned study confirms what Walter Rea documented in 'The White Lie' — Ellen White was a literary borrower on a massive scale.",
    hiddenAssumptions: [
      "Prophetic inspiration requires that every word originate ex nihilo from God without any human literary engagement or research.",
      "Literary parallels automatically equal plagiarism, applying modern academic citation standards retroactively to a 19th-century author who operated under entirely different literary conventions.",
      "Ellen White claimed verbal, dictation-style inspiration rather than the thought-inspiration model the SDA Church has always taught.",
      "The percentage of literary parallels determines the degree of prophetic authenticity — as if inspiration could be measured by an originality algorithm.",
      "Using existing language and imagery to express divinely received ideas is incompatible with genuine prophetic experience.",
    ],
    sdaResponse:
      "The Veltman study is frequently misrepresented by critics. Veltman himself distinguished between 'literary parallels' (similar wording) and 'literary dependence' (demonstrable copying), and noted that parallels do not equal plagiarism in the 19th-century literary context. More importantly, the SDA understanding of inspiration has always been thought inspiration, not verbal dictation. Ellen White stated: 'It is not the words of the Bible that are inspired, but the men were inspired. Inspiration acts not on the man's words or his expressions but on the man himself' (Selected Messages, vol. 1, p. 21). Biblical authors used sources extensively: Luke researched eyewitness accounts (Luke 1:1-4), the Chronicler used royal annals, Jude quoted 1 Enoch (Jude 14-15), and Paul quoted pagan poets (Acts 17:28; Titus 1:12). The question is not whether Ellen White used language from existing sources but whether the theological ideas, the selection and arrangement of material, and the overall message reflect divine guidance. Veltman himself concluded that White consistently transformed borrowed material to serve her unique theological purposes, particularly her Christocentric focus.",
  },
  {
    id: "ap-steelman-failed-predictions",
    title: "Ellen White Made Specific Predictions That Failed",
    argument:
      "Ellen White told a group of believers in 1856 that some in the audience would be 'food for worms,' some would be subjects of the seven last plagues, and some would 'remain upon the earth to be translated at the coming of Jesus' (Testimonies for the Church, vol. 1, pp. 131-132). Everyone in that audience is now dead. She wrote in 1850 that time was 'almost finished' and that they had only 'a few more months' (Early Writings, p. 58; Present Truth, August 1849). She stated in 1856 that she was 'shown the company present at the Conference' and given specific prophetic information about their fates. These are not vague generalities — they are falsifiable predictions tied to specific people and timeframes, and they all failed. Deuteronomy 18:22 states plainly: 'If what a prophet proclaims in the name of the Lord does not take place or come true, that is a message the Lord has not spoken.' By the Bible's own test, Ellen White is a false prophet.",
    hiddenAssumptions: [
      "All prophetic statements are unconditional — God never adjusts timelines based on human faithfulness or unfaithfulness.",
      "The Deuteronomy 18:22 test operates as a single-failure disqualifier, without considering the full body of a prophet's work or the conditional nature of prophecy.",
      "Ellen White's statements were all formal 'Thus saith the Lord' predictions rather than pastoral expressions of eschatological urgency common in the early Adventist movement.",
      "No recognized biblical prophet ever made statements that appeared to go unfulfilled within the expected timeframe.",
    ],
    sdaResponse:
      "Scripture establishes that many prophecies are conditional on human response. Jonah declared, 'Forty more days and Nineveh will be overthrown' (Jonah 3:4) — it did not happen because Nineveh repented. God explicitly states this principle in Jeremiah 18:7-10: prophetic declarations of judgment or blessing are conditioned on the response of the people. Jesus Himself said, 'Truly I tell you, this generation will not pass away until all these things have taken place' (Matthew 24:34), generating two millennia of interpretive discussion. Paul wrote, 'The Lord is near' (Philippians 4:5) and 'the time is short' (1 Corinthians 7:29). Were Paul and Jesus also false prophets? The 1856 vision is best understood within the conditional prophecy framework: had the church pursued its mission with the urgency God intended, Christ could have returned within that generation. The delay is not a prophetic failure but a consequence of the church's failure to fulfill its commission — a theme Ellen White herself addressed repeatedly. The Deuteronomy test examines a prophet's overall trajectory: does the prophet consistently lead people to God and align with Scripture (Deuteronomy 13:1-3)? Ellen White's six-decade ministry overwhelmingly passes this test.",
  },
  {
    id: "ap-steelman-shut-door",
    title: "The Shut Door Teaching Proves Early Adventist Error",
    argument:
      "After the Great Disappointment, Ellen White and other early Adventists taught that probation had closed on October 22, 1844 — that anyone who had rejected the Millerite message had permanently lost their opportunity for salvation. This 'shut door' position meant early Adventists did no evangelism to non-Millerites. Ellen White had visions that appeared to confirm this closed-door theology (see Early Writings, pp. 32-35, where she describes those who rejected the 1844 message as unable to see the light of salvation). She later changed her position and the church eventually began evangelizing broadly, but the early shut-door period reveals that Ellen White's visions confirmed a theology that was demonstrably wrong. If her visions validated a false teaching for years before she abandoned it, how can we trust that her later visions are any more reliable?",
    hiddenAssumptions: [
      "A prophet who develops in understanding over time is disqualified — prophetic insight must arrive fully formed or it is invalid.",
      "The early shut-door position was a formally defined, uniform doctrine rather than a spectrum of views held with varying intensity across early Adventist groups.",
      "Ellen White's eventual correction of the shut-door view is evidence of unreliability rather than evidence of progressive understanding guided by ongoing study and revelation.",
      "Biblical prophets never held incorrect views that were later corrected through further divine guidance.",
    ],
    sdaResponse:
      "The shut-door question requires historical nuance that critics rarely provide. First, the 'shut door' language comes directly from Jesus' parable of the ten virgins (Matthew 25:10), which the Millerites naturally applied to October 22, 1844. The early Adventists were processing a profound theological disappointment, and their understanding developed over time — exactly as the disciples' understanding of Christ's mission developed after the crucifixion (Acts 1:6 shows the disciples still misunderstanding even after the resurrection). Second, there were multiple 'shut door' positions among early Adventists — ranging from a complete close of probation to a more nuanced view that the 'door' of the Most Holy Place opened while the 'door' of the first-apartment ministry closed (a sanctuary-based interpretation). Ellen White's position evolved as her understanding deepened, which is precisely what we see with biblical prophets. Peter initially believed the gospel was only for Jews (Acts 10:28) and required divine correction through a vision. Does Peter's initial error disqualify him as an apostle? The willingness to be corrected by further light is a mark of genuine prophetic integrity, not a disqualification.",
  },
  {
    id: "ap-steelman-health-borrowed",
    title: "Health Visions Were Borrowed From Contemporary Reformers",
    argument:
      "Ellen White's major health vision occurred on June 6, 1863, in Otsego, Michigan. However, virtually everything she taught about health reform — vegetarianism, hydrotherapy, fresh air, exercise, the dangers of tobacco and alcohol, dress reform — was already being advocated by health reformers like Sylvester Graham, James Caleb Jackson, Russell Trall, and Larkin B. Coles, all of whom published widely before 1863. The Whites subscribed to health reform publications and James White reviewed health reform books. Ronald Numbers documented in 'Prophetess of Health' that Ellen White's health counsel closely mirrored these existing sources rather than introducing genuinely novel insights. If her health teachings came from reading contemporary reformers rather than from divine vision, the 'vision' claim is a fraud. Furthermore, some of her specific health statements have been shown to be scientifically inaccurate — for example, her statements about amalgamation, the relationship between masturbation and disease, and wig-wearing causing brain disease.",
    hiddenAssumptions: [
      "If an idea exists in the culture before a prophet articulates it, the prophet cannot have received it independently through divine revelation — God can only reveal things that are completely unknown to anyone.",
      "Prophetic health counsel must be scientifically flawless by 21st-century standards to be considered divinely guided.",
      "Literary similarity between Ellen White's writings and contemporary health reform literature proves direct literary dependence rather than a shared cultural vocabulary addressing common health concerns.",
      "A few questionable health statements invalidate the entire body of health counsel, including the large proportion that has been scientifically validated.",
    ],
    sdaResponse:
      "The argument that pre-existing cultural knowledge disqualifies prophetic revelation commits a basic logical error. When God called Cyrus to free Israel, Cyrus already had political motivations — divine guidance and human context coexisted. The health reformers of the 19th century had a mixture of valid insights and serious errors (Graham opposed all medication; Jackson promoted extreme water cures that sometimes killed patients; many reformers rejected germ theory). Ellen White's health vision did not simply rubber-stamp contemporary reform — it selected from the best available knowledge, corrected errors, and placed health reform within a theological framework of stewardship and the body as God's temple (1 Corinthians 6:19-20) that no secular reformer provided. The Adventist Health Studies conducted by Loma Linda University have validated Ellen White's core health principles with remarkable specificity: SDA vegetarians live 7-10 years longer than the general population, confirming the value of the overall health message regardless of how it was received. As for specific problematic statements, they must be read in their 19th-century context. The 'amalgamation' statements are genuinely debated, but a handful of difficult passages do not overturn decades of counsel that has been spectacularly confirmed by modern epidemiology. The fruits test (Matthew 7:15-20) applies: has this health message produced good fruit? The Blue Zone evidence says yes.",
  },
  {
    id: "ap-steelman-literary-dependency-great-controversy",
    title: "The Great Controversy Is a Patchwork of Borrowed Sources",
    argument:
      "The Great Controversy, arguably Ellen White's most important work, shows extensive literary dependency on historians like J.A. Wylie ('History of Protestantism'), Merle d'Aubigne ('History of the Reformation'), and Uriah Smith ('Daniel and the Revelation'). Entire passages describing the Waldenses, the Reformers, and prophetic history closely parallel these sources in both language and structure. The 1911 revision of the book even acknowledged that some historical quotations needed correction — the church's own editors found errors in her historical claims. If the book that most defines SDA identity and eschatology is a compilation of other authors' work with theological commentary added, it is a human literary production, not a divinely inspired composition. The same woman who wrote 'I do not write one article in the paper expressing merely my own ideas' was demonstrably writing from human sources for the majority of her historical content.",
    hiddenAssumptions: [
      "An inspired author describing historical events must produce original historical research rather than drawing on the best available secondary sources.",
      "The 1911 revision proves the original was unreliable rather than demonstrating responsible editorial stewardship common in publishing.",
      "Literary dependency in historical narrative sections invalidates the theological and prophetic interpretive framework that organizes the narrative.",
      "19th-century literary conventions required the same citation standards that modern academic publishing demands.",
    ],
    sdaResponse:
      "The Great Controversy is a prophetic-interpretive work, not an original history textbook. Ellen White never claimed to be a historian conducting primary research — she stated explicitly that in some cases 'the language of historians has been quoted' because 'their words afforded a ready and forcible presentation' (The Great Controversy, Introduction). This is analogous to a preacher today quoting from commentaries and historians in a sermon — the value is in the theological framework, the prophetic interpretation, and the spiritual application, not in the originality of the historical data. The 1911 revision demonstrates responsible stewardship: when better historical information became available, the text was updated. This is exactly what one would expect from a church that takes accuracy seriously. Crucially, the literary dependency is primarily in the historical narrative portions. The prophetic interpretation — the identification of papal Rome as the little horn, the Reformation as a divinely guided movement, the end-time sequence of events — is the distinctive contribution, and these interpretive frameworks are rooted in Daniel and Revelation, not in d'Aubigne or Wylie. In the 19th century, the literary conventions around quotation and attribution were dramatically different from modern academic standards. Applying 21st-century citation rules retroactively to an 1888 publication is anachronistic. Mark Twain, Abraham Lincoln, and countless 19th-century authors freely borrowed language without modern-style attribution. The question is whether the theological vision of The Great Controversy — the cosmic conflict between Christ and Satan played out through history — is true and scripturally grounded. That question cannot be settled by counting literary parallels.",
  },
  {
    id: "ap-steelman-contradictions-in-egw",
    title: "Ellen White Contradicts Herself and Scripture",
    argument:
      "Ellen White made statements that appear to contradict each other across her 70-year ministry. She wrote that the law in Galatians was the ceremonial law, then later said it was the moral law. She initially endorsed the shut door, then abandoned it. She stated that reformed dress was God's will, then changed the standard. She counseled against eating cheese and eggs in some places but permitted them in others. These internal contradictions suggest a human mind working through issues over time, not a divinely guided prophet speaking for God. Furthermore, her unique doctrinal contributions — the Investigative Judgment, the Sabbath as a seal in the end times, Satan as the scapegoat — lack clear biblical support and appear to be theological innovations rather than discoveries from Scripture.",
    hiddenAssumptions: [
      "A genuine prophet must maintain absolute consistency across decades of writing with no development, contextual adaptation, or progressive understanding.",
      "Contextual counsel that changes based on circumstances represents contradiction rather than pastoral wisdom applied to different situations.",
      "Any doctrine that was unknown before Adventism must be an innovation rather than a recovery of neglected biblical teaching.",
      "The complexity of applying principles to varying contexts is evidence of confusion rather than of a nuanced prophetic ministry operating over 70 years.",
    ],
    sdaResponse:
      "Progressive understanding and contextual application are hallmarks of genuine prophetic ministry, not disqualifications. The apostle Peter changed his position on Gentile inclusion after receiving further divine guidance (Acts 10-11). Paul gave different counsel on marriage to different churches based on their circumstances (compare 1 Corinthians 7 with Ephesians 5). Jesus Himself adjusted His public teaching strategy over the course of His ministry (Mark 1:44 vs. John 18:20). Ellen White's counsel on diet, dress, and other practical matters was often contextual — what was appropriate counsel for health-reforming Americans in the 1860s differed from what was appropriate for missionaries in tropical climates decades later. This is not contradiction; it is wisdom. Regarding the 'law in Galatians' question, Ellen White acknowledged development in her understanding, which is exactly what honest biblical study produces. As for the IJ, the Sabbath seal, and the scapegoat typology, these are grounded in careful exegesis of Daniel 7-8, Revelation 7:1-4 and 14:1-12, and Leviticus 16 respectively. These doctrines were arrived at through corporate Bible study by multiple Adventist pioneers, not invented by Ellen White alone. She confirmed and enriched what the community of believers discovered through Scripture study — precisely the role of the prophetic gift described in Ephesians 4:11-13.",
  },
];

// ── Mind Games ──────────────────────────────────────────────────────────────

const mindGames = [
  {
    id: "ap-mg-smoking-gun-fixation",
    name: "Smoking Gun Fixation",
    description:
      "The critic presents a single problematic statement or episode from Ellen White's ministry as the definitive 'gotcha' that settles the entire question of her prophetic legitimacy. The tactic works by isolating one data point from 70 years and 100,000+ pages of writing and treating it as representative of the whole, forcing the defender into a narrow corner rather than allowing a comprehensive evaluation.",
    example:
      "\"Explain the 1856 vision where she said some in the audience would be translated. They're all dead. Game over. She's a false prophet. Everything else is irrelevant once you have one clear failure.\"",
    detectionTip:
      "Recognize the disproportionate weight being placed on a single data point. No biblical prophet's ministry is evaluated by a single statement in isolation. Ask: 'Are you willing to evaluate her entire body of work by the same criteria you'd apply to any biblical prophet — including the conditional nature of prophecy (Jeremiah 18:7-10) and the fruits test (Matthew 7:15-20)? Or have you already decided the verdict based on one passage?'",
  },
  {
    id: "ap-mg-modern-standards-trap",
    name: "Modern Standards Trap",
    description:
      "The critic applies 21st-century academic citation standards, scientific knowledge, and literary conventions retroactively to a 19th-century author, creating an impossible standard that no historical figure could meet. This anachronistic framing makes Ellen White appear dishonest by standards that did not exist in her time and culture.",
    example:
      "\"She copied entire paragraphs from other authors without quotation marks or footnotes. In any university today, that's plagiarism and grounds for expulsion. How can you defend a prophet who plagiarized?\"",
    detectionTip:
      "Identify the anachronism. Ask whether the critic would apply the same standard to Abraham Lincoln (whose speeches included unattributed borrowed phrases), Mark Twain (who freely adapted others' stories), or even the biblical author of Chronicles (who drew heavily on Samuel and Kings without citation). The concept of 'plagiarism' as understood in modern academia did not exist in the 19th century. Literary borrowing was standard practice, and the conventions around attribution were entirely different.",
  },
  {
    id: "ap-mg-volume-overwhelm",
    name: "Volume Overwhelm",
    description:
      "The critic produces a rapid-fire list of alleged problems — failed prophecies, borrowed passages, scientific errors, contradictions, and controversial statements — in such rapid succession that no single issue can be adequately addressed. The goal is not to have any one objection answered but to create the impression of an overwhelming, unanswerable case through sheer volume.",
    example:
      "\"She failed the Deut. 18 test, she plagiarized Desire of Ages, she borrowed health reform from Graham, she endorsed the shut door, she said wigs cause brain disease, she said amalgamation happened, she contradicted herself on the law in Galatians — and you want me to believe she's a prophet?\"",
    detectionTip:
      "Recognize the Gish Gallop technique. Calmly slow the conversation down: 'You've raised about seven different issues, each of which deserves careful examination. Would you be willing to take them one at a time? Which one is your strongest objection? Let's start there.' Refusing to be rushed is not evasion — it is intellectual responsibility. A serious critic will accept the invitation to go deep on one issue; a polemicist will resist because the tactic depends on staying shallow.",
  },
  {
    id: "ap-mg-insider-authority-play",
    name: "Insider Authority Play",
    description:
      "Former SDA members or former SDA pastors who have become anti-EGW critics leverage their insider status to claim unchallengeable authority on Ellen White. The implicit argument is: 'I studied this from the inside for decades, so I know the truth that current members are hiding from themselves.' This creates a power dynamic where the critic's personal history substitutes for actual argument.",
    example:
      "\"I was an SDA pastor for 25 years. I taught Sabbath School, I preached from her writings every week, I read all 100,000 pages. I know Ellen White's writings better than you ever will — and I'm telling you, she was a fraud. You can't out-research me on this.\"",
    detectionTip:
      "Respectfully acknowledge their experience while redirecting to evidence: 'I appreciate your background and I don't doubt your familiarity with her writings. But expertise doesn't automatically lead to correct conclusions — scholars who study the same data routinely reach opposite conclusions. Can we evaluate the evidence on its merits rather than comparing credentials? What is your single strongest argument, and let's examine it together.' Length of study does not guarantee accuracy of conclusions.",
  },
];

// ── Fallacies ───────────────────────────────────────────────────────────────

const fallacies = [
  {
    id: "ap-fallacy-genetic",
    name: "Genetic Fallacy",
    definition:
      "Dismissing Ellen White's teachings by focusing on their alleged human sources rather than evaluating their truth content. The argument that her health counsel must be invalid because similar ideas existed in the culture confuses the origin of an idea with its truth value.",
    example:
      "\"Her health vision was just a rehash of Sylvester Graham's ideas. She got it from reading health reform literature, not from God. Therefore the health message is not inspired.\"",
    counterMove:
      "Name the fallacy: 'Even if Ellen White was aware of health reform literature — which is debated — the origin of an idea does not determine its truth. The question is whether the health counsel is true and beneficial, not whether it was completely unprecedented.' Point out that God regularly works through existing knowledge: Joseph understood Egyptian agriculture before God used him to save nations (Genesis 41). The Adventist Health Studies have validated the core health principles regardless of their proximate source. Apply the fruits test (Matthew 7:15-20): the SDA health message has produced the Loma Linda Blue Zone, one of the world's longest-lived populations.",
  },
  {
    id: "ap-fallacy-hasty-generalization",
    name: "Hasty Generalization",
    definition:
      "Drawing sweeping conclusions about the entirety of Ellen White's prophetic ministry from a small number of difficult or debatable passages, while ignoring the vast body of material that is theologically sound, scripturally grounded, and spiritually edifying.",
    example:
      "\"She said wigs cause brain disease and amalgamation created certain races. That's all I need to know — she was just a 19th-century quack, not a prophet.\"",
    counterMove:
      "Challenge the sampling: 'You've selected perhaps 3-4 difficult statements from over 100,000 pages written across 70 years. Would you evaluate any author — biblical or otherwise — by their most obscure and debatable passages? Paul's statement that women should be silent in church (1 Corinthians 14:34) is debated endlessly, but no serious scholar concludes that this single passage invalidates Paul's apostleship. Evaluate the whole body of work: her Christology, her emphasis on Scripture's authority, her sanctuary theology, her health principles that have been scientifically validated, and the spiritual fruit of lives transformed by her writings.'",
  },
  {
    id: "ap-fallacy-anachronism",
    name: "Anachronism Fallacy",
    definition:
      "Judging a 19th-century author by 21st-century standards of scientific knowledge, literary citation, and cultural sensitivity. This fallacy imports modern frameworks back in time and condemns historical figures for not meeting standards that did not yet exist.",
    example:
      "\"She didn't use footnotes or quotation marks when borrowing from other authors. That's plagiarism, plain and simple. Any honest person cites their sources.\"",
    counterMove:
      "Expose the anachronism: 'Modern academic citation conventions — footnotes, quotation marks, bibliographies — were not standardized until the 20th century. In the 19th century, literary borrowing without attribution was common and accepted practice. Charles Spurgeon, the most famous preacher of Ellen White's era, freely incorporated others' material into his sermons without citation. Shakespeare drew on Holinshed's Chronicles, Plutarch, and Boccaccio without a single footnote. Applying modern plagiarism standards retroactively to a 19th-century author is historically illiterate. The question is whether she was deceptive in her context, and the evidence shows she operated within the literary norms of her time.'",
  },
  {
    id: "ap-fallacy-cherry-picking",
    name: "Cherry Picking (Suppressed Evidence)",
    definition:
      "Selectively presenting only the problematic statements, controversial episodes, and apparent failures while systematically ignoring the overwhelming body of material that is biblically faithful, spiritually profound, and historically validated. The critic constructs a portrait of Ellen White using only the worst fragments while suppressing the best evidence.",
    example:
      "\"Let me show you a list of 50 things Ellen White got wrong — failed prophecies, scientific errors, plagiarized passages, contradictions. The evidence is overwhelming.\"",
    counterMove:
      "Demand the full picture: 'You've compiled a list of objections. Now let me ask: have you equally compiled her accurate prophetic insights, her theologically sound expositions of Scripture, her health principles validated by modern science, her counsel on education that built one of the world's largest Protestant school systems, and the millions of lives transformed by her writings? Cherry-picking the difficulties while ignoring the strengths is not honest scholarship — it is advocacy. The biblical test for a prophet (Matthew 7:15-20) examines the overall fruit, not a curated collection of the hardest cases. Would you evaluate the apostle Paul by compiling only his most controversial statements?'",
  },
];

// ── Counter Strategies ──────────────────────────────────────────────────────

const counterStrategies = [
  {
    subjectId: "egw-plagiarism-charges",
    title: "Responding to Plagiarism Charges with the Veltman Study and Literary Context",
    sdaPosition:
      "The SDA Church has always taught thought inspiration, not verbal dictation. Ellen White herself stated: 'It is not the words of the Bible that are inspired, but the men were inspired. Inspiration acts not on the man's words or his expressions but on the man himself, who, under the influence of the Holy Ghost, is imbued with thoughts' (Selected Messages, vol. 1, p. 21). Under this model, a prophet may use existing human language, literary sources, and culturally available expressions to convey divinely impressed ideas — exactly as Luke researched eyewitness accounts (Luke 1:1-4), the Chronicler adapted Samuel-Kings, and Jude quoted 1 Enoch. The Veltman study found literary parallels but also found that Ellen White consistently transformed borrowed material to serve her distinctive theological purposes, especially her Christocentric emphasis. The charge of plagiarism anachronistically applies modern academic standards to a 19th-century author who operated within entirely different literary conventions.",
    keyScriptures: [
      "Luke 1:1-4 — Luke explicitly describes researching human eyewitness sources to produce his inspired Gospel, demonstrating that divine inspiration and human research coexist.",
      "Jude 14-15 — Jude quotes the non-canonical Book of Enoch under divine inspiration, showing that prophets can use existing human writings in inspired compositions.",
      "Acts 17:28 — Paul quotes the pagan poet Aratus ('in him we live and move and have our being') in an inspired apostolic sermon, embedding human literary material within divine proclamation.",
      "2 Timothy 3:16 — 'All Scripture is God-breathed' — yet the human authors used their own vocabularies, literary styles, and available sources. Inspiration works through, not apart from, human instruments.",
    ],
    counterArguments: [
      "The Veltman study found literary parallels, not theft of ideas. Veltman himself noted that Ellen White consistently reframed borrowed language to support her unique theological emphases, particularly her focus on Christ's character. Literary parallel is not the same as intellectual plagiarism.",
      "In the 19th century, literary borrowing without modern-style attribution was standard practice. Authors, preachers, and editors freely incorporated others' language. Applying 21st-century academic citation rules to an 1890s author is anachronistic — like criticizing George Washington for not using email.",
      "Biblical prophets used sources extensively. The Chronicler drew on Samuel-Kings, often word-for-word. The synoptic Gospels share substantial material. If source usage disqualifies a prophet, it disqualifies most of the Bible's human authors.",
      "Walter Rea's 'The White Lie' has been extensively critiqued for methodological errors, including inflating parallel percentages, counting common biblical phrases as 'borrowed,' and failing to distinguish between incidental verbal overlap and genuine literary dependence.",
    ],
    closingStatement:
      "The plagiarism charge against Ellen White rests on two errors: a misunderstanding of how prophetic inspiration works (thought inspiration, not verbal dictation) and an anachronistic application of modern citation standards to a 19th-century author. When evaluated by the same criteria applied to biblical authors — who freely used existing sources under divine guidance — Ellen White's literary practices are well within the bounds of inspired writing. The question is not whether she used human language and sources but whether the resulting message is true, Christocentric, and scripturally faithful. Millions of readers across 200 countries and 150 years testify that it is.",
  },
  {
    subjectId: "failed-prophecy-claims",
    title: "Responding to Failed Prophecy Claims with the Conditional Prophecy Pattern",
    sdaPosition:
      "Scripture establishes that many prophecies are conditional on human response. God Himself declared this principle in Jeremiah 18:7-10: 'If at any time I announce that a nation or kingdom is to be uprooted, torn down, and destroyed, and if that nation I warned repents of its evil, then I will relent and not inflict on it the disaster I had planned.' Jonah prophesied Nineveh's destruction in 40 days — unconditionally stated, yet it did not occur because the people repented (Jonah 3:4-10). Ellen White's statements about the nearness of Christ's return belong to this conditional prophetic tradition. The delay of the Advent is not a prophetic failure but a consequence of the church's failure to fulfill its commission — a theme thoroughly documented in Ellen White's own writings and consistent with 2 Peter 3:9-12, which links the timing of Christ's return to human faithfulness.",
    keyScriptures: [
      "Jeremiah 18:7-10 — God's explicit statement that prophetic predictions of blessing or judgment are conditioned on human response — the foundational text for conditional prophecy.",
      "Jonah 3:4-10 — Jonah delivered an unconditional prediction ('Forty more days and Nineveh will be overthrown') that did not occur as stated because of human repentance. Jonah was not a false prophet.",
      "2 Peter 3:9-12 — 'The Lord is not slow in keeping his promise... He is patient with you, not wanting anyone to perish.' The timing of the Second Coming is connected to God's redemptive patience and human response.",
      "Matthew 24:14 — 'This gospel of the kingdom will be preached in the whole world as a testimony to all nations, and then the end will come.' The Second Coming is linked to the church's mission completion.",
    ],
    counterArguments: [
      "The conditional prophecy pattern (Jeremiah 18:7-10) is a well-established biblical principle. If it applied to Jonah, Jeremiah, and the prophets of Israel, it applies equally to Ellen White. Denying this requires a double standard.",
      "Jesus Himself said, 'Truly I tell you, this generation will not pass away until all these things have taken place' (Matthew 24:34). Paul wrote, 'The Lord is near' (Philippians 4:5) and 'We who are alive and remain' (1 Thessalonians 4:17), implying expectation of Christ's return in his lifetime. If eschatological urgency disqualifies a prophet, it disqualifies Jesus' own words and the apostle Paul.",
      "Ellen White explicitly explained the delay: 'Had Adventists, after the great disappointment of 1844, held fast their faith and followed on unitedly in the opening providence of God... the world would have been warned, the work would have been completed, and Christ would have come for the redemption of His people' (Selected Messages, vol. 1, p. 68). The delay is a prophetic theme, not a prophetic failure.",
      "The Deuteronomy 18:22 test must be read alongside Deuteronomy 13:1-3, which tests a prophet by whether they lead people toward or away from the true God. A comprehensive evaluation of Ellen White's ministry shows consistent faithfulness to Scripture, Christ-centeredness, and alignment with biblical truth.",
    ],
    closingStatement:
      "The failed-prophecy charge against Ellen White applies a rigid, unconditional standard that would disqualify Jonah, compromise Jesus' own words, and eliminate Paul from the apostolic canon. The biblical pattern is clear: prophetic predictions are frequently conditional on human response. Ellen White's eschatological urgency reflected the same 'already/not yet' tension that characterizes the entire New Testament. The question is not whether Christ came when Ellen White hoped He would, but whether her ministry consistently pointed people to Christ, upheld Scripture, and produced lasting spiritual fruit. By those biblical criteria, she stands vindicated.",
  },
  {
    subjectId: "shut-door-controversy",
    title: "Responding to the Shut Door Controversy with Historical Context",
    sdaPosition:
      "The shut-door controversy must be understood in its historical and theological context. After the Great Disappointment of October 22, 1844, early Adventists naturally applied Jesus' parable of the ten virgins (Matthew 25:10 — 'the door was shut') to their experience. Their initial understanding was that the 'door' that closed was the door of salvation for those who had rejected the Millerite message. This understanding was not unique to Ellen White — it was held broadly among Sabbatarian Adventists. Over the following years, through continued Bible study and broader evangelistic experience, the group came to understand the 'shut door' in sanctuary terms: the door of the first-apartment ministry closed as Christ moved into the Most Holy Place to begin the work of investigative judgment. This progressive understanding mirrors the apostles' gradual comprehension of the gospel's universal scope (Acts 10-11, 15). The willingness to correct and refine theology through ongoing study is a mark of integrity, not error.",
    keyScriptures: [
      "Matthew 25:10 — 'And the door was shut.' The parable of the ten virgins, which directly gave rise to the shut-door terminology among early Adventists.",
      "Acts 10:28, 34-35 — Peter's gradual realization that the gospel was for Gentiles, not just Jews — a fundamental theological correction that came through progressive revelation and experience.",
      "Acts 15:1-29 — The Jerusalem Council, where the early church formally corrected its initial theology about Gentile inclusion after years of experience and further study.",
      "Hebrews 9:6-8 — The two-apartment sanctuary structure, with the 'way into the Most Holy Place' being disclosed in the anti-typical Day of Atonement, providing the mature sanctuary-based understanding of what 'door' opened and closed in 1844.",
    ],
    counterArguments: [
      "The apostle Peter held an incorrect theology for years — believing the gospel was only for Jews — and required divine intervention (Acts 10) and communal correction (Galatians 2:11-14) to change. If progressive theological understanding disqualifies a prophet, Peter is disqualified before Ellen White.",
      "The early shut-door period was far more nuanced than critics portray. There was no single, uniform 'shut door doctrine.' Early Adventists held a spectrum of views, and the position evolved through corporate Bible study rather than through one individual's decree.",
      "Ellen White's mature sanctuary understanding of the shut door — that the first-apartment door closed while the Most Holy Place door opened — is theologically coherent with Hebrews 8-9 and Revelation 11:19. The final position is biblically grounded regardless of the developmental process that led to it.",
      "Theological development through progressive study is a mark of honest Bible study, not prophetic failure. The alternative — rigidly maintaining an initial understanding despite growing evidence — is precisely what critics accuse fundamentalists of doing. You cannot condemn Ellen White both for changing her mind and for not changing it.",
    ],
    closingStatement:
      "The shut-door controversy, properly understood, is actually evidence for rather than against Ellen White's prophetic integrity. She and the early Adventist community began with an understandable but incomplete interpretation of their 1844 experience. Through continued Bible study, prayerful reflection, and evangelistic experience, they arrived at a biblically grounded sanctuary theology that is coherent with Hebrews and Revelation. This is exactly the pattern we see in the book of Acts, where the apostolic church progressively understood the implications of the gospel. A prophet who grows in understanding is not a false prophet — she is a biblical one.",
  },
  {
    subjectId: "health-visions-vs-science",
    title: "Responding to Health Vision Challenges with Science and the Fruits Test",
    sdaPosition:
      "The SDA health message, first formally articulated after Ellen White's June 6, 1863 health vision, has been remarkably validated by modern science. The Adventist Health Studies (AHS-1, 1960-1985; AHS-2, 2002-present), conducted by Loma Linda University and funded by the National Institutes of Health, have consistently shown that SDAs who follow the health principles Ellen White advocated live significantly longer and healthier lives than the general population — 7.3 years longer for men and 4.4 years longer for women (AHS-1), with even greater benefits for vegetarian Adventists. Loma Linda, California was designated a 'Blue Zone' — one of only five places on earth where people routinely live past 100. This constitutes powerful empirical evidence that the health message, regardless of how it was received, produces measurably good fruit (Matthew 7:15-20).",
    keyScriptures: [
      "1 Corinthians 6:19-20 — 'Do you not know that your bodies are temples of the Holy Spirit... Therefore honor God with your bodies.' The theological foundation for health reform as stewardship.",
      "3 John 1:2 — 'Dear friend, I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well.' God's concern for physical health alongside spiritual health.",
      "Daniel 1:8-16 — Daniel's health-reform experiment in Babylon, demonstrating that God's dietary principles produce measurably superior outcomes — the original 'Adventist Health Study.'",
      "Matthew 7:15-20 — 'By their fruit you will recognize them.' Jesus' own criterion for evaluating prophetic claims applies powerfully to the health message's documented results.",
    ],
    counterArguments: [
      "The existence of pre-1863 health reformers does not disprove the divine origin of Ellen White's health vision. God has always worked through existing cultural knowledge — Joseph used Egyptian agricultural expertise, Paul quoted Greek philosophers, and Luke employed Greco-Roman historiographical methods. The question is whether the overall message is true and beneficial, not whether every component was previously unknown.",
      "Ellen White's health counsel was not a simple copy of any single contemporary reformer. She rejected some of their positions (Graham's rejection of all medication, Jackson's extreme hydrotherapy), incorporated others, and uniquely placed health reform within a theological framework of body-temple stewardship that no secular reformer provided.",
      "The Adventist Health Studies provide the most rigorous scientific validation of any religiously motivated health program in history. SDA vegetarians in the Blue Zone of Loma Linda outlive the surrounding population by nearly a decade. This is the fruit test in empirical form.",
      "Difficult statements (amalgamation, masturbation and disease, wigs and brain disease) must be evaluated in their 19th-century medical context, where many of these views were held by mainstream physicians. A handful of dated statements do not invalidate a health program whose core principles — plant-based diet, exercise, fresh air, water, temperance, rest, trust in God — have been overwhelmingly confirmed by 21st-century science.",
    ],
    closingStatement:
      "The critics' challenge to Ellen White's health visions faces an inconvenient empirical reality: the health message works. SDA populations following her core health principles are among the longest-lived people on earth, documented by rigorous scientific studies funded by the U.S. government. Whether the health vision's content was entirely novel or drew upon existing cultural knowledge is ultimately secondary to the question Jesus Himself posed: 'By their fruit you will recognize them' (Matthew 7:20). The fruit of the SDA health message is measurable, reproducible, and scientifically validated. That is a powerful testimony to the source behind it.",
  },
  {
    subjectId: "literary-dependency",
    title: "Responding to Literary Dependency with 19th-Century Conventions and Biblical Precedent",
    sdaPosition:
      "Ellen White's use of existing literary sources in her published writings is consistent with both 19th-century literary conventions and the biblical model of prophetic composition. The thought-inspiration model teaches that God impresses ideas, themes, and theological insights on the prophet's mind, and the prophet then expresses these using available human language, literary skill, and existing sources. This is how Luke wrote his Gospel (Luke 1:1-4), how the Chronicler wrote Chronicles (drawing on Samuel-Kings), and how Jude composed his epistle (incorporating 1 Enoch). The value of Ellen White's writings lies not in the originality of every phrase but in the prophetic-interpretive framework, the Christocentric emphasis, the theological coherence, and the spiritual fruit produced in readers across cultures and centuries.",
    keyScriptures: [
      "Luke 1:1-4 — Luke's explicit methodology: research, eyewitness interviews, careful composition — all under divine inspiration. This is the biblical model for inspired writing that uses human sources.",
      "1 Chronicles 29:29 — The Chronicler references 'the records of Samuel the seer, the records of Nathan the prophet, and the records of Gad the seer' as sources — inspired writing built on existing documentation.",
      "Jude 14-15 — Jude quotes 1 Enoch, a non-canonical Jewish text, within an inspired New Testament epistle. The Holy Spirit guided the prophet to use an existing human source.",
      "Revelation 12:17; 19:10 — The 'testimony of Jesus' is the 'spirit of prophecy,' gifted to the remnant church. The gift operates through human instruments using human capacities, including literary skill and available sources.",
    ],
    counterArguments: [
      "Literary dependency is a feature, not a bug, of prophetic writing. The most prolific biblical writer, the Chronicler, drew extensively on Samuel-Kings with substantial verbal parallels. The synoptic Gospels share massive literary dependency (the Synoptic Problem). If literary dependency disqualifies Ellen White, it disqualifies large portions of the Bible.",
      "In the 19th century, the concept of 'plagiarism' as currently understood did not exist. Authors, preachers, and editors routinely incorporated others' language without the citation conventions that post-20th-century academia requires. Judging Ellen White by standards that were not established in her era is anachronistic and unfair.",
      "The distinctive value of Ellen White's writings is the prophetic-theological framework — the great controversy theme, the sanctuary Christology, the integration of health-soul-mission, and the eschatological urgency — not the originality of historical descriptions or illustrative language. Critics focus on the borrowed scaffolding while ignoring the unique structure built with it.",
      "The 1911 revision of The Great Controversy demonstrates responsible editorial stewardship. When historical inaccuracies were identified, they were corrected. This is what responsible publishing looks like, and it undermines the charge of deception. A fraudulent author would resist correction; Ellen White and her editors welcomed it.",
    ],
    closingStatement:
      "Literary dependency in Ellen White's writings is neither surprising nor disqualifying when understood within the thought-inspiration model and 19th-century literary conventions. Biblical prophets used sources. 19th-century authors borrowed freely. The value of any inspired writing lies not in the originality of its vocabulary but in the truth, coherence, and spiritual power of its message. For over 150 years, readers across every continent have found in Ellen White's writings a Christ-centered, Scripture-upholding, life-transforming message that bears the unmistakable marks of divine guidance working through a faithful human instrument.",
  },
];

// ── Modules ─────────────────────────────────────────────────────────────────

const modules = [
  // ────── Module 1: EGW Plagiarism Charges ──────
  {
    id: "ap-mod-plagiarism",
    subjectId: "egw-plagiarism-charges",
    title: "Module 1: Confronting the Plagiarism Accusation",
    doctrineBrief:
      "The charge that Ellen White plagiarized other authors is one of the most frequently repeated and emotionally charged accusations leveled against her prophetic ministry. It was popularized by Walter Rea in his 1982 book 'The White Lie' and given academic weight by the Fred Veltman study of 'The Desire of Ages,' commissioned by the SDA Church itself. The Veltman study found literary parallels between Ellen White's text and earlier published sources, with some chapters showing up to 31% parallel content.\n\nHowever, the accusation rests on several critical misunderstandings. First, the SDA Church has always taught thought inspiration, not verbal dictation — meaning the prophet receives divine impressions and ideas, then expresses them using available human language, style, and sources. This is the model demonstrated by Luke (Luke 1:1-4), the Chronicler, and Jude. Second, 19th-century literary conventions did not require the citation standards of modern academia. Literary borrowing was common and accepted practice among authors, preachers, and editors of Ellen White's era. Third, Veltman himself distinguished between 'literary parallels' and 'plagiarism,' noting that Ellen White consistently transformed borrowed material to serve her distinctive theological purposes.\n\nThe real question is not whether Ellen White used human sources but whether the theological message conveyed through her writings is true, Christ-centered, and scripturally faithful. By this measure — which is the biblical measure (Matthew 7:15-20; 1 Thessalonians 5:20-21) — her writings have stood the test of time across 200 countries, 900+ languages, and 150 years.",
    steelmanArguments: [
      steelmanArguments[0], // Veltman study proves systematic borrowing
      steelmanArguments[4], // Great Controversy is a patchwork
    ],
    hiddenAssumptions: [
      "Prophetic inspiration requires verbal dictation — every word must originate directly from God with no human literary input.",
      "Modern academic citation standards are universal and timeless rather than culturally specific conventions that developed in the 20th century.",
      "Literary parallels automatically equal intellectual dishonesty rather than reflecting standard 19th-century literary practice.",
      "The percentage of parallel content in a text determines its degree of inspiration, as if the Holy Spirit could be measured by an originality algorithm.",
    ],
    mindGames: [
      mindGames[1], // Modern Standards Trap
      mindGames[2], // Volume Overwhelm
    ],
    fallacies: [
      fallacies[2], // Anachronism
      fallacies[0], // Genetic Fallacy
    ],
    counterStrategy: counterStrategies[0],
    debateSimLink: "anti-prophet",
    debriefPrompt:
      "Reflect on your engagement with the plagiarism charge. Were you able to clearly articulate the thought-inspiration model and show how it differs from verbal dictation? Did you effectively use biblical precedents (Luke, Chronicles, Jude) to normalize source usage in prophetic writing? Could you explain 19th-century literary conventions without sounding like you were making excuses? What areas of the Veltman study do you need to understand more deeply?",
  },
  // ────── Module 2: Failed Prophecy Claims ──────
  {
    id: "ap-mod-failed-prophecy",
    subjectId: "failed-prophecy-claims",
    title: "Module 2: Confronting the Failed Prophecy Accusation",
    doctrineBrief:
      "Critics compile a list of Ellen White's statements that appear to predict events which did not occur as described — particularly her expressions of expectation that Christ would return in the near future. The most frequently cited examples include the 1856 vision where she stated some in the audience would be alive for Christ's return (Testimonies, vol. 1, pp. 131-132), her 1850 statement about 'a few more months' (Early Writings, p. 58), and various expressions of imminent eschatological expectation throughout her ministry.\n\nThe biblical framework for evaluating these statements is the conditional prophecy pattern, established by God Himself in Jeremiah 18:7-10 and demonstrated vividly in the book of Jonah. Jonah delivered an unconditional prediction — 'Forty more days and Nineveh will be overthrown' (Jonah 3:4) — yet it did not happen because of human response. This was not a prophetic failure; it was a conditional prophecy whose condition was met.\n\nJesus Himself expressed eschatological urgency: 'This generation will not pass away until all these things take place' (Matthew 24:34). Paul expected to be alive at the Second Coming: 'We who are alive, who are left until the coming of the Lord' (1 Thessalonians 4:15). If expressions of nearness disqualify a prophet, the New Testament itself is disqualified. Ellen White's eschatological urgency belongs to the same prophetic tradition of 'already/not yet' that characterizes the entire New Testament witness.",
    steelmanArguments: [
      steelmanArguments[1], // EGW made specific predictions that failed
      steelmanArguments[5], // EGW contradicts herself
    ],
    hiddenAssumptions: [
      "All prophetic statements are unconditionally binding — God never adjusts outcomes based on human faithfulness or repentance.",
      "A single apparently unfulfilled prediction disqualifies a prophet regardless of the overall trajectory of their ministry.",
      "Eschatological urgency in a prophet's language constitutes a formal, date-setting prediction rather than an expression of imminent expectation common throughout the New Testament.",
    ],
    mindGames: [
      mindGames[0], // Smoking Gun Fixation
      mindGames[2], // Volume Overwhelm
    ],
    fallacies: [
      fallacies[1], // Hasty Generalization
      fallacies[3], // Cherry Picking
    ],
    counterStrategy: counterStrategies[1],
    debateSimLink: "anti-prophet",
    debriefPrompt:
      "Evaluate your handling of the failed-prophecy charge. Were you able to establish the conditional prophecy principle from Scripture (Jeremiah 18:7-10, Jonah) before addressing specific Ellen White statements? Could you show that the same standard, if applied to Jesus' words and Paul's writings, would create identical difficulties? Did you effectively explain that prophetic delay is a biblical theme (2 Peter 3:9-12), not evidence of false prophecy? How would you strengthen your response?",
  },
  // ────── Module 3: Shut Door Controversy ──────
  {
    id: "ap-mod-shut-door",
    subjectId: "shut-door-controversy",
    title: "Module 3: Confronting the Shut Door Challenge",
    doctrineBrief:
      "The 'shut door' controversy refers to the period after the Great Disappointment of October 22, 1844, when early Sabbatarian Adventists — including Ellen White — believed that probation had closed for those who had rejected the Millerite message. This belief was rooted in Jesus' parable of the ten virgins (Matthew 25:10: 'the door was shut') and was a natural, if premature, theological conclusion from the intense eschatological experience of 1844.\n\nOver the following years, through continued Bible study, evangelistic encounters with sincere seekers who had not heard the Millerite message, and further visions, the early Adventist understanding evolved. The 'shut door' was reinterpreted in sanctuary terms: the door of Christ's first-apartment ministry in the heavenly sanctuary closed as He transitioned to the Most Holy Place ministry (the anti-typical Day of Atonement), while a new door of opportunity opened for all who would accept the advancing light of truth.\n\nThis theological development precisely mirrors the early apostolic church's experience. Peter initially believed the gospel was exclusively for Jews (Acts 10:28) and required a direct divine vision to change his understanding. The Jerusalem Council (Acts 15) formally corrected the early church's theology on Gentile inclusion. If progressive theological development under divine guidance disqualifies Ellen White, it equally disqualifies Peter and the apostolic church.\n\nThe mature SDA sanctuary theology that emerged from this process — Christ's transition from the Holy Place to the Most Holy Place in 1844, beginning the pre-advent judgment — is grounded in Hebrews 8-9 and Revelation 11:19. The final doctrinal position is biblically robust regardless of the developmental path that led to it.",
    steelmanArguments: [
      steelmanArguments[2], // Shut door teaching proves early error
      steelmanArguments[5], // Contradictions in EGW
    ],
    hiddenAssumptions: [
      "A genuine prophet must arrive at correct theology immediately — progressive understanding under divine guidance is disqualifying.",
      "The early shut-door position was a monolithic, formally defined doctrine rather than a spectrum of provisional views during a period of intense theological processing.",
      "Changing one's theological position in light of further study and experience is evidence of unreliability rather than intellectual integrity.",
    ],
    mindGames: [
      mindGames[0], // Smoking Gun Fixation
      mindGames[3], // Insider Authority Play
    ],
    fallacies: [
      fallacies[0], // Genetic Fallacy
      fallacies[3], // Cherry Picking
    ],
    counterStrategy: counterStrategies[2],
    debateSimLink: "anti-prophet",
    debriefPrompt:
      "Assess your handling of the shut-door controversy. Were you able to provide adequate historical context for why early Adventists held this position? Did you effectively use the Peter/Gentile parallel (Acts 10-11) to normalize progressive theological development? Could you explain the mature sanctuary-based understanding of the shut door without losing your audience in complex typology? What additional historical details would strengthen your response?",
  },
  // ────── Module 4: Health Visions vs Science ──────
  {
    id: "ap-mod-health-visions",
    subjectId: "health-visions-vs-science",
    title: "Module 4: Defending the Health Vision Against Scientific Critique",
    doctrineBrief:
      "Ellen White's health reform counsel, first formally articulated after her June 6, 1863 health vision in Otsego, Michigan, has become one of the most empirically testable aspects of her prophetic ministry. Critics argue that her health teachings were borrowed from contemporary reformers (Sylvester Graham, James Caleb Jackson, Russell Trall) rather than received in vision, and that some specific statements conflict with modern science.\n\nThe SDA response operates on multiple levels. First, the genetic fallacy: even if similar ideas existed in the culture, this does not disprove divine confirmation and guidance. God regularly works through existing knowledge — Joseph used Egyptian agricultural expertise under divine direction (Genesis 41). Second, Ellen White did not simply echo contemporary reformers — she selected from among their ideas, rejected their errors (Graham's rejection of medication, Jackson's dangerous hydrotherapy extremes), and uniquely embedded health reform within a theological framework of body-temple stewardship (1 Corinthians 6:19-20) that no secular reformer provided.\n\nThird, and most powerfully, the Adventist Health Studies provide extraordinary empirical validation. AHS-1 (1960-1985, 34,000 participants) and AHS-2 (2002-present, 96,000 participants), conducted by Loma Linda University and funded by the National Institutes of Health, demonstrate that SDAs following Ellen White's core health principles live significantly longer, have lower rates of cancer, heart disease, and diabetes, and enjoy measurably better quality of life. Loma Linda, California — the heart of Adventist health practice — was designated one of the world's five 'Blue Zones' by National Geographic researchers.\n\nJesus said, 'By their fruit you will recognize them' (Matthew 7:20). The health message has been tested by the most rigorous scientific methodology available, and the fruit is extraordinary.",
    steelmanArguments: [
      steelmanArguments[3], // Health visions borrowed from reformers
      steelmanArguments[5], // EGW contradicts herself and science
    ],
    hiddenAssumptions: [
      "Divine revelation must contain only information that is completely unprecedented and unknown to any human being.",
      "A few scientifically dated statements invalidate the entire body of health counsel, including the majority that has been validated.",
      "19th-century health reformers were the source rather than the cultural context for Ellen White's health teachings.",
    ],
    mindGames: [
      mindGames[1], // Modern Standards Trap
      mindGames[0], // Smoking Gun Fixation
    ],
    fallacies: [
      fallacies[0], // Genetic Fallacy
      fallacies[1], // Hasty Generalization
    ],
    counterStrategy: counterStrategies[3],
    debateSimLink: "anti-prophet",
    debriefPrompt:
      "Review your defense of the health message. Were you able to present the Adventist Health Studies as powerful empirical evidence without overstating the claims? Could you effectively handle the 'she just copied Graham and Jackson' argument by showing both the differences and the theological framework she uniquely provided? How did you address the genuinely difficult health statements (amalgamation, wigs, masturbation)? The key is honesty about the difficult passages while demonstrating the overwhelming positive fruit of the health message as a whole.",
  },
  // ────── Module 5: Literary Dependency ──────
  {
    id: "ap-mod-literary-dependency",
    subjectId: "literary-dependency",
    title: "Module 5: Confronting the Literary Dependency Challenge",
    doctrineBrief:
      "The literary dependency charge goes beyond specific plagiarism allegations to argue that the overall structure, theological framework, and literary content of Ellen White's major works demonstrate pervasive reliance on previously published authors. Critics point to The Great Controversy's use of J.A. Wylie, Merle d'Aubigne, and Uriah Smith; The Desire of Ages' parallels with William Hanna, John Harris, and Daniel March; and Patriarchs and Prophets' echoes of various Bible commentators.\n\nThe SDA response begins with the thought-inspiration model: God impresses ideas and themes on the prophet's mind, and the prophet uses available human language, literary resources, and compositional skill to express those ideas. This is not a deficiency in the model — it is how biblical inspiration actually works. Luke explicitly researched human sources (Luke 1:1-4). The Chronicler drew extensively on Samuel-Kings, often verbatim. The synoptic Gospels share substantial literary material (the Synoptic Problem). Jude incorporated 1 Enoch. If literary dependency disqualifies a prophet, large portions of the Bible are disqualified.\n\nThe distinctive contribution of Ellen White's writings is not the originality of every historical detail or illustrative phrase but the prophetic-interpretive framework — the great controversy theme, the sanctuary Christology, the integration of health-education-mission, and the eschatological urgency — that organizes, interprets, and transforms the borrowed material. Critics focus on the scaffolding while missing the cathedral. The 1911 revision of The Great Controversy, far from proving dishonesty, demonstrates responsible editorial stewardship: when better information became available, the text was updated. This is what integrity looks like.\n\nThe ultimate test remains the fruit test (Matthew 7:15-20). For 150 years, across every continent, in over 900 languages, Ellen White's writings have led millions to deeper Bible study, healthier living, global education and medical mission, and a living relationship with Jesus Christ. Literary dependency analysis cannot account for this fruit.",
    steelmanArguments: [
      steelmanArguments[4], // Great Controversy is a patchwork
      steelmanArguments[0], // Veltman study proves systematic borrowing
    ],
    hiddenAssumptions: [
      "Inspired writing must be entirely original — any use of existing sources invalidates the claim to divine guidance.",
      "Historical narrative sections and theological-interpretive sections should be evaluated by the same originality criteria.",
      "The 1911 revision proves the original was unreliable rather than demonstrating normal editorial improvement.",
      "21st-century citation standards are the timeless, universal measure of literary honesty across all cultures and centuries.",
    ],
    mindGames: [
      mindGames[2], // Volume Overwhelm
      mindGames[3], // Insider Authority Play
    ],
    fallacies: [
      fallacies[2], // Anachronism
      fallacies[3], // Cherry Picking
    ],
    counterStrategy: counterStrategies[4],
    debateSimLink: "anti-prophet",
    debriefPrompt:
      "Evaluate your defense against the literary dependency charge. Were you able to distinguish between the borrowed scaffolding (historical narrative, illustrative language) and the unique prophetic structure (great controversy theme, sanctuary Christology, eschatological framework)? Could you effectively demonstrate that literary dependency is a feature of biblical inspiration, not a disqualification? Did you use the Synoptic Problem and the Chronicler's use of Samuel-Kings as powerful biblical precedents? How might you more effectively communicate the thought-inspiration model to someone who assumes all inspiration must be verbal dictation?",
  },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const antiProphetTraining: AATSAvatarTraining = {
  avatarId: "anti-prophet",
  avatarName: "Ellen White's Critic",
  emoji: "\u{1F4E2}",
  color: "border-orange-600",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
