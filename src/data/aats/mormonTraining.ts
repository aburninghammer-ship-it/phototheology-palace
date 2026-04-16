// ─── AATS Training Data: Mormon (LDS) ────────────────────────────────────────
// Apologetics Avatar Training System — The Mormon avatar
// SDA counter-apologetics curriculum for engaging Latter-day Saint theology

import type {
  AATSAvatarTraining,
  AATSSubject,
  AATSSteelmanArgument,
  AATSMindGame,
  AATSFallacy,
  AATSCounterStrategy,
  AATSModule,
} from "../aatsTrainingData";

// ── Subjects ──────────────────────────────────────────────────────────────────

const subjects: AATSSubject[] = [
  {
    id: "extra-scriptures",
    title: "Extra Scriptures",
    description:
      "The Book of Mormon, D&C, and Pearl of Great Price are additional scripture from God",
  },
  {
    id: "exalted-humans",
    title: "Exalted Humans",
    description:
      "Humans can become gods; God was once a man (Lorenzo Snow couplet)",
  },
  {
    id: "polytheistic-undertones",
    title: "Polytheistic Undertones",
    description:
      "There are many gods; our God is the god of this world",
  },
  {
    id: "jesus-lucifer-brothers",
    title: "Jesus-Lucifer Spirit Brothers",
    description:
      "Jesus and Satan are spirit brothers, both sons of Heavenly Father",
  },
  {
    id: "restoration-theology",
    title: "Restoration Theology",
    description:
      "The Great Apostasy removed all truth; Joseph Smith restored the true church",
  },
];

// ── Steelman Arguments ────────────────────────────────────────────────────────

const steelmanArguments: AATSSteelmanArgument[] = [
  {
    id: "mormon-steel-1",
    title: "The Book of Mormon as Another Testament",
    argument:
      "The Book of Mormon is another testament of Jesus Christ. Just as God spoke through prophets in the Old World, He also spoke to people in the Americas. Ezekiel 37:16-17 prophesied the 'stick of Judah' (the Bible) and the 'stick of Joseph' (the Book of Mormon) being joined together. Additional scripture does not contradict the Bible — it supplements it, just as the New Testament supplemented the Old.",
    hiddenAssumptions: [
      "Additional revelation is always valid",
      "Lack of archaeological evidence doesn't matter",
      "Burning in the bosom confirms truth",
    ],
    sdaResponse:
      "Revelation 22:18-19 warns against adding to God's completed word. The 'stick of Judah' and 'stick of Joseph' in Ezekiel 37 refers to the reunification of the northern and southern kingdoms of Israel, not two separate books of scripture. The Book of Mormon lacks any archaeological, genetic (DNA), or linguistic evidence. The Bible is self-sufficient for doctrine (2 Timothy 3:16-17), and any new revelation must be tested against existing Scripture (Isaiah 8:20), not by subjective feelings (Jeremiah 17:9).",
  },
  {
    id: "mormon-steel-2",
    title: "God Was Once a Man (King Follett Discourse)",
    argument:
      "God was once a man who progressed to godhood (King Follett discourse). Lorenzo Snow summarized it: 'As man now is, God once was; as God now is, man may be.' This means that through faithfulness in this life, humans can eventually become exalted beings — gods in their own right. Eternal progression is the highest purpose of existence, and it reflects the love of a Heavenly Father who wants His children to become like Him.",
    hiddenAssumptions: [
      "God's nature evolves",
      "Eternal progression includes deity",
      "Lorenzo Snow couplet is doctrinal",
    ],
    sdaResponse:
      "Malachi 3:6 declares, 'I am the LORD, I change not.' God has always been God — He did not evolve from a mortal man. Isaiah 43:10 is decisive: 'Before me there was no God formed, neither shall there be after me.' This eliminates any possibility of humans becoming gods or of God having once been a man. The LDS doctrine of exaltation contradicts God's eternal, unchangeable, self-existent nature (Psalm 90:2). The desire to 'be like God' is the original temptation of Satan (Genesis 3:5; Isaiah 14:14).",
  },
  {
    id: "mormon-steel-3",
    title: "Jesus and Lucifer as Spirit Brothers",
    argument:
      "Jesus and Lucifer are spirit brothers — both created by Heavenly Father in the pre-mortal existence. Before the world was formed, Heavenly Father presented His plan of salvation. Jesus volunteered to be the Savior, while Lucifer proposed an alternative plan that would remove agency. Lucifer rebelled and became Satan. This makes Jesus the elder brother who triumphed, not an eternally co-equal member of a Trinity.",
    hiddenAssumptions: [
      "Jesus was created, not eternally God",
      "All spirit beings are siblings",
      "Heavenly Father has a physical body",
    ],
    sdaResponse:
      "John 1:1-3 declares that Jesus (the Word) was 'with God' and 'was God' from the beginning, and that 'all things were made by him.' This includes Lucifer — Jesus created Lucifer (Colossians 1:16-17). They cannot be brothers because one is the eternal Creator and the other is a created being. Hebrews 1:5 asks, 'To which of the angels did God ever say, You are my Son?' — distinguishing Christ from all created beings. Micah 5:2 confirms Christ's origins are 'from of old, from everlasting.' Reducing Jesus to a created spirit brother of Satan is a fundamental denial of His eternal deity.",
  },
  {
    id: "mormon-steel-4",
    title: "Joseph Smith Restored the True Church",
    argument:
      "Joseph Smith restored the true church after total apostasy. After the death of the original apostles, the true priesthood authority was lost, ordinances were corrupted, and plain and precious truths were removed from the Bible. The Great Apostasy left the world without God's true church for nearly 1,800 years — until the First Vision in 1820, when God the Father and Jesus Christ appeared to Joseph Smith and called him to restore all things.",
    hiddenAssumptions: [
      "Complete apostasy occurred",
      "Matt 16:18 failed",
      "The First Vision is historically reliable",
    ],
    sdaResponse:
      "Jesus promised in Matthew 16:18, 'The gates of hell shall not prevail against [my church].' A total apostasy would mean Jesus broke His own promise. While the Bible does predict apostasy (2 Thessalonians 2:3; Acts 20:29-30), it never predicts a complete disappearance of truth. God always preserved a faithful remnant (Romans 11:4-5). Furthermore, there are at least nine contradictory accounts of the First Vision, the earliest written 12 years after it allegedly occurred. The Adventist understanding recognizes that while apostasy crept into organized Christianity, God's truth was always available in Scripture and through faithful believers across the centuries.",
  },
  {
    id: "mormon-steel-5",
    title: "A Living Prophet Receives Ongoing Revelation",
    argument:
      "We have a living prophet who receives ongoing revelation. God has always led His people through prophets (Amos 3:7). Just as Moses, Isaiah, and Peter received revelation, the LDS prophet today receives continuing guidance from God. The church is led by revelation, not merely by human wisdom. This living prophetic office ensures that the church can adapt to modern challenges while remaining anchored in divine truth.",
    hiddenAssumptions: [
      "New revelation can override previous scripture",
      "The prophet can't lead the church astray",
      "Feelings confirm prophetic legitimacy",
    ],
    sdaResponse:
      "The Bible provides clear tests for prophets: their words must align with Scripture (Isaiah 8:20), their predictions must come true (Deuteronomy 18:22), and they must point people to the true God (Deuteronomy 13:1-3). LDS prophets have made numerous false prophecies (e.g., Joseph Smith's prophecy that the temple would be built in Independence, Missouri in 'this generation' — D&C 84:4-5). LDS prophetic 'revelation' has reversed fundamental doctrines — such as polygamy (D&C 132 vs. Official Declaration 1) and the priesthood ban on Black members (reversed in 1978). Biblical prophets never contradicted previous Scripture; LDS prophets routinely do.",
  },
];

// ── Mind Games ────────────────────────────────────────────────────────────────

const mindGames: AATSMindGame[] = [
  {
    id: "mormon-mg-1",
    name: "False Revelation Authority",
    description:
      "Claiming modern prophetic authority to bypass scriptural arguments",
    example:
      "When you quote Isaiah 43:10 against the doctrine of eternal progression, the LDS interlocutor says, 'The living prophet has clarified that passage — you're reading it without prophetic guidance.' This tactic sidesteps the plain text of Scripture by asserting that an external authority (the LDS prophet) can reinterpret any verse.",
    detectionTip:
      "When someone claims a modern leader's interpretation overrides what the Bible plainly says, they are substituting human authority for divine authority. Ask: 'If the prophet said something that directly contradicted Jesus' words in the Gospels, which would you follow?' This exposes the real hierarchy of authority.",
  },
  {
    id: "mormon-mg-2",
    name: "Circular Truth Claims",
    description:
      "Using the Book of Mormon to prove Joseph Smith, and Joseph Smith to prove the Book of Mormon",
    example:
      "'The Book of Mormon proves Joseph Smith was a prophet because only a true prophet could produce such a book. And we know the Book of Mormon is true because it was given through the prophet Joseph Smith.' Each claim depends on the other — neither is established independently.",
    detectionTip:
      "Map the logic: A proves B, and B proves A. Then ask for independent verification of either claim. Neither the Book of Mormon nor Joseph Smith's prophetic office has external corroboration. Archaeological, genetic, and historical evidence consistently fails to support the BoM's claims about ancient American civilizations.",
  },
  {
    id: "mormon-mg-3",
    name: "Testimony Pressure",
    description:
      "Sharing emotional 'I know the church is true' testimony as if personal feeling = evidence",
    example:
      "In response to a theological challenge, the LDS person tears up and says, 'I just want you to know that I know, with every fiber of my being, that the Church of Jesus Christ of Latter-day Saints is the true church. The Spirit has testified to me.' This emotional display is presented as though it settles the intellectual question.",
    detectionTip:
      "Acknowledge the sincerity of the person's feelings, but gently point out that Muslims, Hindus, and members of every religion have equally powerful spiritual experiences confirming their beliefs. Feelings are not a reliable test of truth — the Bible warns that the heart is deceitful (Jeremiah 17:9). Truth must be established by Scripture (Isaiah 8:20), not by subjective emotion.",
  },
  {
    id: "mormon-mg-4",
    name: "Moving Goalposts",
    description:
      "When evidence against BoM is presented, shifting to 'it's a matter of faith, not evidence'",
    example:
      "You present DNA evidence that Native Americans are of Asian (not Middle Eastern) origin, contradicting the Book of Mormon's claims. The LDS person responds: 'Well, the Book of Mormon was never meant to be a history textbook. It's a spiritual book. You're looking for the wrong kind of evidence.' Yet the BoM makes specific historical and geographical claims.",
    detectionTip:
      "Note what the original claim was: the Book of Mormon describes real ancient peoples in a real location. If evidence is only relevant when it supports their position but irrelevant when it contradicts it, the goalposts have moved. Ask: 'If we found evidence supporting the BoM, would you present it? Then the lack of evidence must also be relevant.'",
  },
];

// ── Fallacies ─────────────────────────────────────────────────────────────────

const fallacies: AATSFallacy[] = [
  {
    id: "mormon-fal-1",
    name: "Appeal to Emotion",
    definition:
      "'Pray about it and you'll feel it's true' — elevating subjective feeling over objective evidence",
    example:
      "Moroni 10:4 is presented as the ultimate test: 'Ask God with a sincere heart and real intent, and He will manifest the truth of it unto you by the power of the Holy Ghost.' This makes a subjective emotional experience the sole arbiter of truth, bypassing historical evidence, archaeological data, and scriptural consistency.",
    counterMove:
      "Point out that the Bible never tells us to pray about whether a book is Scripture — it tells us to test all things against existing revelation (1 Thessalonians 5:21; Isaiah 8:20; Acts 17:11). The Bereans were commended for comparing Paul's teaching to Scripture, not for praying about their feelings. Ask: 'If a Muslim prays about the Quran and feels it is true, does that make it true?'",
  },
  {
    id: "mormon-fal-2",
    name: "Unfalsifiable Claims",
    definition:
      "'The Great Apostasy destroyed all evidence' — conveniently explaining away the lack of proof",
    example:
      "When you point out that there is zero archaeological evidence for the civilizations described in the Book of Mormon (no Nephite cities, no Reformed Egyptian inscriptions, no steel swords, no horses in pre-Columbian America), the response is: 'The Great Apostasy and the destruction described in 3 Nephi erased the evidence.' This makes the claim unfalsifiable.",
    counterMove:
      "Contrast this with the Bible, which has overwhelming archaeological support — the Dead Sea Scrolls, the Pilate Stone, the Tel Dan inscription, ancient Israelite cities, and thousands of corroborating artifacts. If the biblical civilizations left abundant evidence despite also experiencing destruction and upheaval, why did the allegedly massive Nephite and Lamanite civilizations leave nothing?",
  },
  {
    id: "mormon-fal-3",
    name: "Circular Reasoning",
    definition:
      "The BoM is true because the BoM says to pray about it and you'll feel it's true",
    example:
      "The argument runs: (1) The Book of Mormon is true. (2) How do we know? Because Moroni 10:4 says to pray about it. (3) Where is Moroni 10:4? In the Book of Mormon. The book that needs to be validated is the one providing the validation method. No external standard is applied.",
    counterMove:
      "Introduce an external standard: the Bible. Isaiah 8:20 says, 'To the law and to the testimony: if they speak not according to this word, it is because there is no light in them.' The Book of Mormon must be tested against the Bible, not against itself. When tested, it fails — teaching doctrines about God, salvation, and the afterlife that contradict the biblical record.",
  },
  {
    id: "mormon-fal-4",
    name: "Ad Hoc Rescue",
    definition:
      "When archaeology contradicts the BoM, inventing new explanations (limited geography theory, etc.)",
    example:
      "The Book of Mormon originally implied that Nephites and Lamanites were the principal ancestors of all Native Americans. When DNA evidence disproved this, LDS apologists introduced the 'limited geography theory,' confining BoM events to a small area in Mesoamerica and claiming the peoples were a tiny group absorbed into larger populations. The church even quietly changed the BoM introduction from 'principal ancestors' to 'among the ancestors.'",
    counterMove:
      "Point out that this is a retreat, not a rebuttal. The original prophetic claims were sweeping and specific. Each time evidence contradicts a claim, a new ad hoc explanation is invented to preserve the theory. This is not how truth works — truth should be confirmed by evidence, not perpetually rescued from it. Compare with biblical archaeology, where new discoveries consistently corroborate Scripture.",
  },
];

// ── Counter Strategies ────────────────────────────────────────────────────────

const counterStrategies: AATSCounterStrategy[] = [
  {
    subjectId: "extra-scriptures",
    title: "The Sufficiency of Scripture Against Extra-Biblical Additions",
    sdaPosition:
      "The Bible is the complete, sufficient, and authoritative Word of God. While God has given the gift of prophecy to His church (as with Ellen White), no prophetic gift produces Scripture that contradicts, supersedes, or supplements the Bible's doctrinal authority. The Book of Mormon, Doctrine & Covenants, and Pearl of Great Price introduce doctrines that directly contradict the Bible and therefore fail the biblical test of authenticity.",
    keyScriptures: [
      "2 Timothy 3:16-17 — 'All Scripture is given by inspiration of God... that the man of God may be complete, thoroughly equipped for every good work.'",
      "Isaiah 8:20 — 'To the law and to the testimony! If they do not speak according to this word, it is because there is no light in them.'",
      "Revelation 22:18-19 — A warning against adding to or taking away from God's revealed word.",
      "Proverbs 30:5-6 — 'Every word of God is pure... Do not add to His words, lest He rebuke you, and you be found a liar.'",
    ],
    counterArguments: [
      "The Book of Mormon has undergone thousands of changes since its 1830 publication, including significant doctrinal alterations — this is inconsistent with divine revelation.",
      "There is zero archaeological evidence for Book of Mormon civilizations: no Nephite cities, no Reformed Egyptian writing, no steel, no horses, no barley, no wheat in pre-Columbian America.",
      "DNA evidence shows that Native Americans are of Asian descent, not Middle Eastern — directly contradicting the BoM narrative of Israelite migration.",
      "The Book of Mormon contains extensive passages plagiarized from the King James Bible (including KJV translation errors), suggesting a 19th-century origin, not an ancient one.",
    ],
    closingStatement:
      "The Bible is God's complete revelation. It does not need supplementation, and any claimed addition must pass the test of Isaiah 8:20. The Book of Mormon fails this test — it introduces doctrines foreign to Scripture, lacks any historical corroboration, and bears the marks of 19th-century composition rather than ancient prophetic authorship.",
  },
  {
    subjectId: "exalted-humans",
    title: "God's Eternal, Unchangeable Nature Against Human Exaltation",
    sdaPosition:
      "God has always been God. He is eternal, self-existent, and unchangeable in His nature. He was never a man, and humans will never become gods. The desire to become 'like God' is the original lie of Satan in Eden. While believers will be glorified and receive eternal life, they will always remain creatures worshiping their Creator — never becoming creators themselves.",
    keyScriptures: [
      "Isaiah 43:10 — 'Before me there was no God formed, neither shall there be after me.'",
      "Malachi 3:6 — 'For I am the LORD, I change not.'",
      "Psalm 90:2 — 'From everlasting to everlasting, You are God.'",
      "Numbers 23:19 — 'God is not a man, that He should lie, nor a son of man, that He should change His mind.'",
    ],
    counterArguments: [
      "Isaiah 43:10 explicitly closes the door on gods being 'formed' before or after Yahweh — this directly contradicts the Lorenzo Snow couplet and the entire LDS doctrine of eternal progression to godhood.",
      "The King Follett discourse was a funeral sermon, not canonized scripture, yet it introduced one of Mormonism's most radical theological departures from Christianity — that God was once a mortal man.",
      "Genesis 3:5 records Satan's original temptation: 'You will be like God.' The LDS doctrine of exaltation essentially baptizes Satan's lie as gospel truth.",
      "John 17:3 defines eternal life as knowing God, not becoming God. Glorification means Christlike character, not obtaining deity.",
    ],
    closingStatement:
      "The God of the Bible has existed eternally as God. He has no origin story, no mortal past, and no predecessor. The promise of the gospel is not that we become gods, but that we are adopted as children who will forever worship and enjoy the one true God. The doctrine of human exaltation to godhood is the oldest lie in human history, first spoken by the serpent in Eden.",
  },
  {
    subjectId: "polytheistic-undertones",
    title: "Biblical Monotheism Against LDS Plurality of Gods",
    sdaPosition:
      "The Bible teaches strict monotheism: there is one God, eternally existing as Father, Son, and Holy Spirit. LDS theology, with its teaching that there are innumerable gods and that faithful Mormons will become gods of their own worlds, is fundamentally polytheistic. This stands in irreconcilable contradiction to the shema of Deuteronomy 6:4 and the repeated declarations of God's absolute uniqueness throughout Scripture.",
    keyScriptures: [
      "Deuteronomy 6:4 — 'Hear, O Israel: The LORD our God, the LORD is one.'",
      "Isaiah 44:6 — 'I am the first and I am the last; apart from me there is no God.'",
      "Isaiah 45:5 — 'I am the LORD, and there is no other; apart from me there is no God.'",
      "1 Corinthians 8:4 — 'We know that an idol is nothing in the world, and that there is no other God but one.'",
    ],
    counterArguments: [
      "LDS theology teaches that the Father, Son, and Holy Spirit are three separate gods united only in purpose — this is tritheism, not the biblical Trinity. The Bible presents one God in three persons, not three gods in a committee.",
      "The LDS concept of Heavenly Father having a body of flesh and bone (D&C 130:22) contradicts Jesus' statement that 'God is spirit' (John 4:24) and the repeated biblical teaching that God is invisible and immaterial (1 Timothy 1:17; Colossians 1:15).",
      "Abraham 4-5 in the Pearl of Great Price uses 'the Gods' (plural) throughout the creation account, replacing the biblical 'God' (Elohim used with singular verbs in Genesis 1). This is a deliberate polytheistic revision of the creation narrative.",
      "If there are many gods ruling many worlds, then Yahweh's repeated claims to absolute uniqueness in Isaiah 43-46 are either false or drastically limited in scope — both options undermine biblical authority.",
    ],
    closingStatement:
      "The Bible is uncompromisingly monotheistic. From Genesis to Revelation, there is one God, and He alone is to be worshiped. LDS theology, despite its Christian vocabulary, teaches a fundamentally polytheistic worldview that is incompatible with the biblical revelation of God's absolute uniqueness and singularity.",
  },
  {
    subjectId: "jesus-lucifer-brothers",
    title: "The Eternal Deity of Christ Against the Spirit-Brother Doctrine",
    sdaPosition:
      "Jesus Christ is the eternal, uncreated, co-equal Second Person of the Godhead. He is the Creator of all things, including Lucifer. To call Jesus and Satan 'spirit brothers' is to reduce the eternal God to the level of a created being and to elevate the devil to a familial relationship with deity. This doctrine fundamentally distorts who Jesus is and represents a different gospel (Galatians 1:8-9).",
    keyScriptures: [
      "John 1:1-3 — 'In the beginning was the Word, and the Word was with God, and the Word was God... All things were made through Him, and without Him nothing was made that was made.'",
      "Colossians 1:16-17 — 'For by Him all things were created that are in heaven and that are on earth, visible and invisible... all things were created through Him and for Him.'",
      "Hebrews 1:5-8 — 'To which of the angels did He ever say, \"You are My Son\"?... But to the Son He says: \"Your throne, O God, is forever and ever.\"'",
      "Micah 5:2 — 'But you, Bethlehem Ephrathah... out of you shall come forth... the One whose goings forth are from of old, from everlasting.'",
    ],
    counterArguments: [
      "Jesus created Lucifer (Colossians 1:16 — 'thrones, dominions, principalities, powers' — all angelic ranks). A creator cannot be a 'brother' to his own creation.",
      "Hebrews 1 spends an entire chapter distinguishing Christ from all angels, asking rhetorically, 'To which of the angels did God ever say, You are my Son?' — the answer is none. Jesus is categorically different from any created spirit being.",
      "The LDS pre-existence doctrine (where all humans and spirits, including Jesus and Lucifer, were born as spirit children of Heavenly Father and a Heavenly Mother) has no biblical basis and was borrowed from Platonic philosophy mixed with Joseph Smith's speculative theology.",
      "If Jesus is merely the 'elder brother' among spirit children, then His sacrifice on the cross loses its infinite value. Only an eternal, uncreated God can offer an atonement sufficient for all humanity (Hebrews 7:25-27).",
    ],
    closingStatement:
      "Jesus Christ is not a created spirit brother of Satan. He is the eternal God who spoke Lucifer into existence. To reduce Christ to a fellow creature is to preach 'another Jesus' (2 Corinthians 11:4) — one who is too small to save. The biblical Christ is the Alpha and Omega, the Creator and Sustainer of all things, and He alone is worthy of worship.",
  },
  {
    subjectId: "restoration-theology",
    title: "Christ's Unfailing Church Against the Total Apostasy Theory",
    sdaPosition:
      "While the Bible predicts apostasy within the church, it never teaches a total apostasy that removes all truth from the earth. Jesus promised that the gates of hell would not prevail against His church (Matthew 16:18). God has always preserved a faithful remnant. The Seventh-day Adventist Church understands itself not as a 'restoration' from nothing, but as a prophetic movement calling people back to biblical truths that were obscured — but never lost — during centuries of gradual compromise.",
    keyScriptures: [
      "Matthew 16:18 — 'On this rock I will build My church, and the gates of Hades shall not prevail against it.'",
      "Matthew 28:20 — 'I am with you always, even to the end of the age.'",
      "Romans 11:4-5 — 'I have reserved for Myself seven thousand men who have not bowed the knee to Baal. Even so then, at this present time there is a remnant according to the election of grace.'",
      "Daniel 7:25 — Predicts that the 'little horn' power would 'think to change times and laws' — pointing to specific doctrinal corruptions, not total loss of truth.",
    ],
    counterArguments: [
      "Jesus promised He would be with His followers 'always, even to the end of the age' (Matthew 28:20). A total apostasy lasting 1,800 years means Jesus broke His promise and abandoned His people — an impossibility for a faithful God.",
      "The First Vision has at least nine contradictory accounts, with the earliest written version (1832) mentioning only one divine personage, not two. The canonized 1838 version was crafted years later and conflicts with earlier accounts on fundamental details.",
      "Joseph Smith's prophetic credentials fail the Deuteronomy 18:22 test. His prophecy that the temple would be built in Independence, Missouri 'in this generation' (D&C 84:4-5, given in 1832) remains unfulfilled nearly 200 years later.",
      "The SDA remnant theology (Revelation 12:17; 14:12) recognizes that truth was progressively obscured through history but was always preserved in Scripture and through faithful individuals — the Waldenses, Hussites, and pre-Reformation believers maintained biblical truths throughout the 'dark ages.'",
    ],
    closingStatement:
      "The idea that God allowed total apostasy for 1,800 years contradicts His character, His promises, and the historical record. Truth was never fully lost — it was obscured by human tradition and institutional corruption. The Adventist calling is not to restore a lost church but to lift up the truths of Scripture — the Sabbath, the state of the dead, the sanctuary, and the imminent return of Christ — that have always been present in God's Word, waiting to be rediscovered by a faithful remnant.",
  },
];

// ── Modules ───────────────────────────────────────────────────────────────────

const modules: AATSModule[] = [
  {
    id: "mormon-mod-1",
    subjectId: "extra-scriptures",
    title: "Extra Scriptures: The Book of Mormon and LDS Canon",
    doctrineBrief:
      "The Church of Jesus Christ of Latter-day Saints recognizes four 'standard works' as scripture: the Bible (KJV, 'as far as it is translated correctly'), the Book of Mormon, the Doctrine and Covenants, and the Pearl of Great Price. The Book of Mormon claims to be a record of ancient peoples who migrated from Jerusalem to the Americas around 600 BC, written on gold plates and translated by Joseph Smith through 'the gift and power of God.' LDS theology holds that the Bible alone is insufficient because 'plain and precious truths' were removed from it during the Great Apostasy. The Book of Mormon is presented as a necessary corrective — 'another testament of Jesus Christ' that restores lost truths.",
    steelmanArguments: [steelmanArguments[0]],
    hiddenAssumptions: [
      "Additional revelation is always valid and cannot be tested against existing Scripture",
      "The absence of archaeological evidence is explained by destruction or divine concealment",
      "A subjective 'burning in the bosom' (emotional confirmation) is a reliable epistemological test for truth",
      "The Bible is corrupt and incomplete, requiring supplemental LDS scriptures to be understood correctly",
    ],
    mindGames: [mindGames[1], mindGames[3]],
    fallacies: [fallacies[0], fallacies[2]],
    counterStrategy: counterStrategies[0],
    debateSimLink: "mormon",
    debriefPrompt:
      "Reflect on the encounter: Did the LDS interlocutor appeal to Moroni 10:4 as a trump card? How did you redirect the conversation from subjective feelings to objective scriptural and archaeological evidence? What was the most effective argument you used to demonstrate the sufficiency of the Bible? How can you graciously show that additional scripture is unnecessary without dismissing the sincerity of the person's belief?",
  },
  {
    id: "mormon-mod-2",
    subjectId: "exalted-humans",
    title: "Exalted Humans: The Lorenzo Snow Couplet and Eternal Progression",
    doctrineBrief:
      "LDS theology teaches that God the Father (Heavenly Father) was once a mortal man on another world who lived, died, and was exalted to godhood. Lorenzo Snow, the fifth LDS prophet, summarized this doctrine: 'As man now is, God once was; as God now is, man may be.' This teaching was articulated most fully in Joseph Smith's King Follett discourse (1844), where he declared that God 'was once a man like us' and that 'you have got to learn how to be gods yourselves.' Faithful Mormons who receive all temple ordinances, are sealed in celestial marriage, and live obediently can achieve 'exaltation' — becoming gods who create and rule their own worlds with their eternal companions.",
    steelmanArguments: [steelmanArguments[1]],
    hiddenAssumptions: [
      "God's nature evolves — He progressed from mortality to deity",
      "Eternal progression logically includes humans attaining deity",
      "The Lorenzo Snow couplet, though not canonized scripture, carries doctrinal weight as prophetic teaching",
      "The desire to become like God is a holy aspiration, not the original Edenic temptation",
    ],
    mindGames: [mindGames[0]],
    fallacies: [fallacies[1]],
    counterStrategy: counterStrategies[1],
    debateSimLink: "mormon",
    debriefPrompt:
      "Evaluate the discussion: Were you able to clearly present the biblical teaching on God's eternal, unchangeable nature? Did the LDS interlocutor invoke the King Follett discourse or the Lorenzo Snow couplet? How did you address the connection between the LDS exaltation doctrine and the original temptation in Genesis 3:5? Were you able to distinguish between biblical glorification (becoming Christlike in character) and LDS exaltation (becoming a god)?",
  },
  {
    id: "mormon-mod-3",
    subjectId: "polytheistic-undertones",
    title: "Polytheistic Undertones: Many Gods in LDS Cosmology",
    doctrineBrief:
      "While LDS theology uses Christian terminology, its cosmology is fundamentally polytheistic. LDS scripture teaches that the Father, Son, and Holy Spirit are three separate gods (not one God in three persons). The Pearl of Great Price (Abraham 4-5) describes the creation as the work of 'the Gods' (plural). Joseph Smith taught in the King Follett discourse that 'the heads of the Gods appointed one God for us.' LDS temple ceremonies historically included references to multiple gods. The logical extension of the exaltation doctrine is that there are innumerable gods, each ruling their own worlds — an infinite regress of deity stretching back forever, with no ultimate uncaused first cause.",
    steelmanArguments: [steelmanArguments[1], steelmanArguments[2]],
    hiddenAssumptions: [
      "Elohim (plural form) proves plurality of gods rather than the majesty of one God",
      "The Godhead is three separate beings united only in purpose, not one being in three persons",
      "God the Father has a tangible body of flesh and bone, limiting His nature to physical form",
      "The existence of multiple gods does not undermine the worship of 'our' God",
    ],
    mindGames: [mindGames[0], mindGames[3]],
    fallacies: [fallacies[1], fallacies[3]],
    counterStrategy: counterStrategies[2],
    debateSimLink: "mormon",
    debriefPrompt:
      "Assess your engagement: How effectively did you present biblical monotheism? Were you able to explain why Elohim with singular verbs in Genesis indicates one God, not many? Did you address the LDS claim that the Father has a body of flesh and bone? How did you handle the Abraham 4-5 'the Gods' language? Were you prepared for the argument that Psalm 82:6 ('you are gods') supports LDS polytheism?",
  },
  {
    id: "mormon-mod-4",
    subjectId: "jesus-lucifer-brothers",
    title: "Jesus and Lucifer: Spirit Brothers or Creator and Creature?",
    doctrineBrief:
      "LDS theology teaches that in the 'pre-mortal existence,' all humans, angels, Jesus, and Lucifer were spirit children born to Heavenly Father and a Heavenly Mother. In this framework, Jesus is the 'firstborn' spirit child — the elder brother — and Lucifer is another spirit child who rebelled. Before the world was created, Heavenly Father presented His plan of salvation. Jesus (then known as Jehovah) volunteered to be the Savior and give glory to the Father. Lucifer proposed an alternative plan to force all humanity to be saved, removing their agency, and demanded the Father's glory for himself. When his plan was rejected, Lucifer rebelled and became Satan, taking a third of the spirit children with him. This doctrine makes Jesus and Satan ontologically equivalent beings who merely made different choices.",
    steelmanArguments: [steelmanArguments[2]],
    hiddenAssumptions: [
      "Jesus was created (begotten as a spirit child), not eternally self-existent",
      "All spirit beings share the same fundamental nature and origin as offspring of Heavenly Father",
      "Heavenly Father has a physical body and a divine consort (Heavenly Mother) who together procreated spirit children",
      "The pre-mortal existence is a biblical concept, not a speculative theological invention",
    ],
    mindGames: [mindGames[0], mindGames[2]],
    fallacies: [fallacies[0], fallacies[3]],
    counterStrategy: counterStrategies[3],
    debateSimLink: "mormon",
    debriefPrompt:
      "Review your defense of Christ's deity: Did you clearly establish from Scripture that Jesus is the eternal Creator, not a created being? How did you use John 1:1-3 and Colossians 1:16-17 to demonstrate that Jesus created Lucifer and therefore cannot be his 'brother'? Did the LDS interlocutor appeal to the pre-existence or the 'council in heaven' narrative? How did you counter the claim that 'firstborn' in Colossians 1:15 means Jesus was the first created being?",
  },
  {
    id: "mormon-mod-5",
    subjectId: "restoration-theology",
    title: "Restoration Theology: Total Apostasy and the Claims of Joseph Smith",
    doctrineBrief:
      "LDS restoration theology rests on the premise that a 'Great Apostasy' occurred after the death of the original apostles, resulting in the complete loss of priesthood authority, correct ordinances, and true doctrine from the earth. For approximately 1,800 years, according to LDS teaching, no church on earth had divine authority or full truth. In 1820, Joseph Smith claimed that God the Father and Jesus Christ appeared to him in a grove of trees (the 'First Vision') and told him that all existing churches were wrong and that he should join none of them. Subsequently, Smith claimed to receive the Book of Mormon, the restoration of the Aaronic and Melchizedek priesthoods through angelic visitation, and the authority to establish the only true church of Jesus Christ on earth.",
    steelmanArguments: [steelmanArguments[3], steelmanArguments[4]],
    hiddenAssumptions: [
      "A complete apostasy occurred, leaving no true Christians or true church on earth for nearly two millennia",
      "Jesus' promise that the gates of hell would not prevail against His church (Matthew 16:18) either failed or applies only to the LDS Church",
      "The First Vision is a historically reliable event despite multiple contradictory accounts",
      "Joseph Smith's prophetic calling can be validated despite failed prophecies and moral controversies",
    ],
    mindGames: [mindGames[0], mindGames[1], mindGames[2], mindGames[3]],
    fallacies: [fallacies[0], fallacies[1], fallacies[2], fallacies[3]],
    counterStrategy: counterStrategies[4],
    debateSimLink: "mormon",
    debriefPrompt:
      "Evaluate your response to restoration claims: Did you effectively use Matthew 16:18 and Matthew 28:20 to show that total apostasy contradicts Christ's promises? How did you address the First Vision and its contradictory accounts? Were you able to apply the Deuteronomy 18:22 test to Joseph Smith's prophecies? Did you present the SDA remnant theology as a biblically grounded alternative to the LDS restoration narrative — emphasizing that truth was obscured but never lost? How did you handle the emotional weight of someone's deeply held testimony about the truth of the LDS Church?",
  },
];

// ── Export ─────────────────────────────────────────────────────────────────────

export const mormonTraining: AATSAvatarTraining = {
  avatarId: "mormon",
  avatarName: "The Mormon",
  emoji: "\u{1F3D4}\u{FE0F}",
  color: "border-amber-500",
  subjects,
  steelmanArguments,
  mindGames,
  fallacies,
  counterStrategies,
  modules,
};
