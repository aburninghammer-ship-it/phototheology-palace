// ─── AATS Training Data: The Futurist (Dispensationalist) ──────────────────
// Futurist/Dispensationalist apologetics training for SDA believers.

import type { AATSAvatarTraining } from "../aatsTrainingData";

export const futuristTraining: AATSAvatarTraining = {
  avatarId: "futurist",
  avatarName: "The Futurist",
  emoji: "🔮",
  color: "border-indigo-500",

  // ── Phase 1: Know Their Doctrine ─────────────────────────────────────────
  subjects: [
    {
      id: "secret-rapture",
      title: "Secret Rapture",
      description: "Believers will be secretly raptured before the tribulation",
    },
    {
      id: "seven-year-tribulation",
      title: "Seven-Year Tribulation",
      description: "Daniel's 70th week is a future 7-year tribulation period",
    },
    {
      id: "antichrist-future-individual",
      title: "Antichrist as Future Individual",
      description: "The Antichrist is a future person, not the papal system",
    },
    {
      id: "dispensational-israel",
      title: "Dispensational Israel",
      description: "God has separate plans for Israel and the Church",
    },
    {
      id: "literal-futurist-revelation",
      title: "Literal/Futurist Revelation",
      description: "Revelation describes future events, not historical fulfillment",
    },
  ],

  // ── Phase 2: Steelman Their Arguments ────────────────────────────────────
  steelmanArguments: [
    {
      id: "sa-rapture-imminence",
      title: "Imminence of Christ's Return",
      argument:
        "The New Testament teaches that Christ could return at any moment (1 Thess 4:16-17, 1 Cor 15:51-52). Early Christians lived in constant expectation. A pre-tribulation rapture preserves this imminence doctrine because if believers had to endure the tribulation first, the return would not be imminent — it would be preceded by identifiable prophetic events. The rapture must therefore be a secret, signless event that can happen at any time.",
      hiddenAssumptions: [
        "Imminence requires a separate, secret coming before the visible second advent",
        "1 Thessalonians 4:16-17 describes a separate event from the Second Coming of Revelation 19",
        "No prophetic events need to occur before Christ can return for His church",
      ],
      sdaResponse:
        "The passage in 1 Thessalonians 4:16 describes the Lord descending 'with a shout, with the voice of the archangel, and with the trump of God' — this is the opposite of secret. The Bible consistently presents ONE glorious, visible return (Matt 24:27, Rev 1:7, Acts 1:11). Jesus Himself gave signs to watch for (Matt 24:4-31) and said 'this gospel of the kingdom shall be preached in all the world... and then shall the end come' (Matt 24:14). Imminence means readiness, not that no events precede His return. Paul warned the Thessalonians that 'the day of the Lord' would not come until 'the falling away' and the man of sin were revealed (2 Thess 2:1-4), directly contradicting a signless, any-moment rapture.",
    },
    {
      id: "sa-daniels-70th-week",
      title: "The Gap in Daniel's 70 Weeks",
      argument:
        "Daniel 9:24-27 prophesies 70 weeks (490 years) for Israel. The first 69 weeks concluded when Messiah was 'cut off.' Since Israel rejected Christ, God paused the prophetic clock, inserted the 'Church Age' as a parenthesis, and the final 70th week (7 years) remains unfulfilled. This future 70th week is the Great Tribulation, during which God resumes His program with national Israel. The 'prince that shall come' (Dan 9:26) is the future Antichrist who will make and break a covenant with Israel.",
      hiddenAssumptions: [
        "God can pause a continuous time prophecy and insert an indefinite gap of 2,000+ years",
        "The 'he' in Daniel 9:27 refers to the Antichrist rather than the Messiah",
        "The Church Age is a parenthetical interruption not foreseen by Old Testament prophets",
        "God has two separate peoples with two separate programs",
      ],
      sdaResponse:
        "There is no exegetical basis for inserting a 2,000+ year gap into a consecutive time prophecy. The 70 weeks are 'determined' (literally 'cut off') as one continuous block (Dan 9:24). The 'he' of verse 27 grammatically refers back to 'Messiah the Prince' of verse 25, not the destructive prince of verse 26. Christ confirmed the covenant with many for one week — His 3.5-year ministry fulfilled the first half, and through His apostles the gospel went 'to the Jew first' for the remaining 3.5 years until the stoning of Stephen (circa AD 34). Christ 'caused the sacrifice and oblation to cease' by His death on the cross (Heb 10:12), not some future Antichrist. The gap theory was unknown in Christian theology until J.N. Darby popularized it in the 1830s.",
    },
    {
      id: "sa-pretrib-church-absent",
      title: "The Church is Absent from Revelation 4-18",
      argument:
        "The word 'church' (ekklesia) appears 19 times in Revelation 1-3 but is completely absent from chapters 4-18, which describe the tribulation period. This silence is deafening and intentional. In Revelation 4:1, John hears a voice saying 'Come up hither,' symbolizing the rapture of the church. The 24 elders in heaven represent the raptured church. God's wrath during the tribulation is not meant for the church (1 Thess 5:9), so believers must be removed before it begins.",
      hiddenAssumptions: [
        "Absence of the word 'church' proves the church is physically absent from earth",
        "The 'come up hither' to John personally is a symbol of a rapture of all believers",
        "'Saints' mentioned throughout Revelation 4-18 are different from church-age believers",
        "The tribulation is entirely God's wrath with no distinction between wrath and persecution",
      ],
      sdaResponse:
        "The word 'church' (ekklesia) also does not appear in Mark, Luke, John, 2 Timothy, Titus, 1-2 Peter, 1-2 John, or Jude — yet no one claims the church is absent from those books. Revelation repeatedly mentions 'saints' during the tribulation period (Rev 13:7, 10; 14:12; 17:6) — these are clearly God's people on earth. Revelation 12:17 describes the dragon making war with the 'remnant of her seed, which keep the commandments of God and have the testimony of Jesus Christ' — this is unmistakably the church. 'Come up hither' was spoken to John alone for a vision (Rev 4:1), not to the global church. God's promise is not removal from tribulation but protection through it (John 17:15; Ps 91:7-10), just as He protected Israel during the plagues of Egypt.",
    },
    {
      id: "sa-literal-rebuilt-temple",
      title: "A Literal Rebuilt Temple and Restored Sacrifices",
      argument:
        "Ezekiel 40-48 describes a future temple in extraordinary detail — measurements, gates, rooms, and sacrificial rituals. This has never been literally fulfilled. Combined with Daniel 9:27 and 2 Thessalonians 2:4 (where the man of sin sits 'in the temple of God'), a third Jewish temple must be rebuilt in Jerusalem. The Antichrist will defile this temple at the midpoint of the tribulation, committing the 'abomination of desolation.' Current events in Israel make this increasingly plausible.",
      hiddenAssumptions: [
        "Ezekiel's temple vision must be fulfilled as a literal physical structure",
        "The 'temple of God' in 2 Thessalonians 2:4 is a physical Jewish temple, not the church",
        "Animal sacrifices will be reinstituted despite Hebrews declaring them obsolete",
        "Modern geopolitical events in Israel are direct prophetic fulfillment",
      ],
      sdaResponse:
        "Paul explicitly identifies the 'temple of God' as the church: 'Know ye not that ye are the temple of God?' (1 Cor 3:16; 2 Cor 6:16; Eph 2:19-22). The man of sin sitting in God's temple describes a power that usurps Christ's authority within Christianity, not a literal temple. Hebrews 7-10 exhaustively argues that Christ's sacrifice permanently replaced the Levitical system — reinstating animal sacrifices would be a denial of the cross. Ezekiel's temple vision, given during the Babylonian captivity, was a conditional promise to Israel (Eze 43:10-11, 'if they be ashamed of their iniquities') that was not fulfilled due to disobedience and finds its ultimate fulfillment in the heavenly sanctuary (Heb 8:1-5) and the New Jerusalem (Rev 21:22, which notably has 'no temple therein').",
    },
    {
      id: "sa-israel-distinct-plan",
      title: "Israel's Irrevocable Election and Distinct Destiny",
      argument:
        "Romans 9-11 teaches that God's gifts and calling to Israel are 'without repentance' (irrevocable, Rom 11:29). 'All Israel shall be saved' (Rom 11:26) promises a future national conversion. God made unconditional covenants with Abraham (Gen 12, 15, 17) and David (2 Sam 7) that require literal fulfillment with ethnic Israel. The Church has not replaced Israel — replacement theology is antisemitic. God operates through different dispensations with different peoples for different purposes.",
      hiddenAssumptions: [
        "The Abrahamic covenant is unconditional with no faith requirements for individual Israelites",
        "'All Israel' in Romans 11:26 means every ethnic Jew, not the full number of God's elect",
        "The Church is a separate entity from Israel rather than the continuation of God's people",
        "Pointing out that Old Covenant Israel was a type of God's universal people is 'replacement theology'",
      ],
      sdaResponse:
        "Paul himself defines 'Israel' spiritually: 'They are not all Israel, which are of Israel' (Rom 9:6). 'The children of the flesh, these are NOT the children of God: but the children of the promise are counted for the seed' (Rom 9:8). Galatians 3:28-29 is decisive: 'There is neither Jew nor Greek... for ye are all one in Christ Jesus. And if ye be Christ's, then are ye Abraham's seed, and heirs according to the promise.' God has ONE olive tree, not two (Rom 11:17-24). Gentile believers are grafted IN to Israel's tree, and unbelieving Jews were broken OFF. 'All Israel shall be saved' (Rom 11:26) refers to the full number of the elect from all nations — spiritual Israel. The SDA position is not replacement but fulfillment — Christ and His church fulfill what Israel typified. The Abrahamic promises were conditional on faith (Gen 18:19; Deut 28; Jer 18:9-10).",
    },
    {
      id: "sa-two-phase-return",
      title: "Two Distinct Phases of Christ's Return",
      argument:
        "Scripture describes Christ's return in two seemingly contradictory ways: He comes 'as a thief' secretly (1 Thess 5:2; Rev 16:15) AND visibly where 'every eye shall see Him' (Rev 1:7; Matt 24:30). The only way to harmonize these passages is to recognize two separate events: the rapture (secret, for believers) and the revelation (public, in judgment). At the rapture, Christ comes FOR His saints (1 Thess 4:17); at the revelation, He comes WITH His saints (Jude 14; Rev 19:14). These are separated by 7 years.",
      hiddenAssumptions: [
        "Descriptive differences in Second Coming passages require two separate events",
        "'As a thief' means invisibly/secretly rather than unexpectedly",
        "Coming FOR saints and coming WITH saints cannot describe the same event",
        "Different details in parallel passages indicate different events rather than complementary descriptions",
      ],
      sdaResponse:
        "Peter explains what 'as a thief' means: 'The day of the Lord will come as a thief in the night; in the which the heavens shall pass away with a great noise' (2 Pet 3:10). A thief comes unexpectedly, not invisibly — the result is anything but silent. Jesus said His coming would be 'as the lightning cometh out of the east and shineth even unto the west' (Matt 24:27). The same passage (1 Thess 4:16-17) that describes believers being 'caught up' also says the Lord descends 'with a shout, with the voice of the archangel, and with the trump of God.' This is one event: Christ descends visibly, the dead are raised, and the living are caught up together WITH them to meet the Lord. Meeting the Lord 'in the air' (1 Thess 4:17) uses the Greek word apantesis, which described citizens going OUT to meet a dignitary and then escorting him BACK — not being whisked away in the opposite direction.",
    },
  ],

  // ── Phase 3: Detect Mind Games ───────────────────────────────────────────
  mindGames: [
    {
      id: "mg-newspaper-exegesis",
      name: "Newspaper Exegesis",
      description:
        "Reading current events back into prophetic texts to create urgency and emotional investment. Every geopolitical development in the Middle East becomes 'proof' that the rapture is near, making the listener feel they must accept the futurist framework or miss the signs of the times.",
      example:
        "'Look at what's happening in Israel right now — the temple mount tensions, the Abraham Accords, the red heifer preparations. These are all setting the stage for the rapture! If you don't understand dispensational prophecy, you'll be blindsided when it happens.'",
      detectionTip:
        "Ask: 'Which specific verse predicts this specific modern event?' Futurists often connect current events to prophecy through inference chains, not direct textual links. Previous generations made identical claims about their current events (Soviet Union as Gog, EU as revived Roman Empire, Kissinger as Antichrist) — all failed.",
    },
    {
      id: "mg-fear-of-being-left-behind",
      name: "Left Behind Fear Appeal",
      description:
        "Leveraging the emotional terror of being 'left behind' while loved ones disappear. This fear-based manipulation bypasses rational examination of the doctrine and pressures immediate acceptance. The entire Left Behind franchise exploits this fear as an evangelistic tool.",
      example:
        "'Imagine waking up and your family is gone. Planes crashing because pilots vanished. Children disappearing from cribs. You don't want to be left behind, do you? Accept the pre-trib rapture and know you'll be taken.'",
      detectionTip:
        "Recognize the emotional manipulation. Ask: 'Is this fear based on a specific Bible passage or a fictional scenario?' The 'Left Behind' narrative comes from novels and movies, not Scripture. In Matthew 24:40-41, those 'taken' are taken in judgment (like those 'taken' by the flood in v.39), while those 'left' are the survivors — the exact opposite of the Left Behind premise.",
    },
    {
      id: "mg-complexity-equals-credibility",
      name: "Complexity as Credibility",
      description:
        "Presenting elaborate dispensational charts, timelines, and multi-phase prophetic schemes as evidence of careful scholarship. The sheer complexity of the system makes it appear well-researched, and questioning it seems unsophisticated. This creates an illusion of depth that intimidates challengers.",
      example:
        "'Let me show you this chart of the dispensations, the rapture, the tribulation judgments (seals, trumpets, bowls), the millennium, the Gog-Magog war, the Great White Throne — it all fits together perfectly. You can't just dismiss a system this detailed.'",
      detectionTip:
        "Complexity does not equal correctness. Ask: 'Can you show me where the Bible itself presents this timeline as a system?' The dispensational framework is an external grid imposed on Scripture, not a framework that emerges from the text. The historicist approach is actually simpler: prophecy is fulfilled progressively through history, matching verifiable events, not speculative future scenarios.",
    },
    {
      id: "mg-antisemitism-accusation",
      name: "The Antisemitism Card",
      description:
        "Accusing anyone who rejects dispensationalism of holding 'replacement theology,' which is then equated with antisemitism. This morally charged accusation shuts down theological debate by making the challenger defend their character rather than their exegesis.",
      example:
        "'So you believe the Church replaced Israel? That's replacement theology — the same theology that fueled centuries of Christian antisemitism. The Holocaust happened because Christians believed God was done with the Jews.'",
      detectionTip:
        "This is a false equivalence and an ad hominem attack. Affirming that Gentile believers are grafted into God's covenant people (which Paul teaches in Romans 11) is not antisemitism. Ask: 'Is Paul being antisemitic when he says \"they are not all Israel which are of Israel\" (Rom 9:6)?' The SDA position honors Jewish heritage by showing Christ as the fulfillment of everything Israel hoped for — this is the opposite of dismissing Israel.",
    },
  ],

  // ── Phase 4: Expose Fallacies ────────────────────────────────────────────
  fallacies: [
    {
      id: "fl-argument-from-silence",
      name: "Argument from Silence",
      definition:
        "Claiming that the absence of evidence constitutes evidence of absence — specifically, that the absence of the word 'church' in Revelation 4-18 proves the church has been raptured from earth.",
      example:
        "'The word \"church\" disappears after Revelation 3 and doesn't reappear until Revelation 22. This proves the church is in heaven during the tribulation.'",
      counterMove:
        "The word 'church' (ekklesia) also does not appear in Mark, Luke, John, 2 Timothy, Titus, 1 Peter, 2 Peter, 1 John, 2 John, or Jude. By this logic, the church doesn't exist in those books either. Meanwhile, 'saints' — God's people — are mentioned throughout the tribulation chapters (Rev 13:7, 10; 14:12; 17:6; 18:24). Absence of a single word proves nothing about the presence or absence of God's people.",
    },
    {
      id: "fl-false-dichotomy-rapture",
      name: "False Dichotomy (Wrath vs. Tribulation)",
      definition:
        "Presenting only two options — either the church is raptured before the tribulation or the church suffers God's wrath — when other options exist. This ignores the biblical pattern of God protecting His people THROUGH trials while pouring judgment on the wicked.",
      example:
        "'You either believe in the pre-trib rapture or you believe God pours His wrath on His own children. Which is it?'",
      counterMove:
        "This is a false dichotomy. God protected Israel THROUGH the Egyptian plagues without removing them from Egypt (Exod 8:22; 9:26; 10:23). God preserved Noah THROUGH the flood, not by removing him from earth. Daniel was protected IN the lions' den, not taken out of Babylon. 1 Thessalonians 5:9 ('God hath not appointed us to wrath') means believers are shielded from God's judgments, not that they are physically removed from earth. Revelation 7:1-3 shows God sealing His people for protection during the plagues — precisely the Exodus pattern.",
    },
    {
      id: "fl-equivocation-israel",
      name: "Equivocation on 'Israel'",
      definition:
        "Using the term 'Israel' in multiple senses without acknowledgment — sometimes meaning ethnic Jews, sometimes the ancient nation, sometimes the modern state — then applying promises made to one referent as if they apply to another.",
      example:
        "'God promised Abraham the land forever. Israel is back in the land today. This proves God's covenant with Israel is still active and the dispensational timeline is on track.'",
      counterMove:
        "Which 'Israel'? The modern secular state of Israel (est. 1948) is not the theocratic covenant nation of the Old Testament. The promise of the land was conditional (Deut 28:63-64; Jer 18:9-10) and was fulfilled under Joshua (Josh 21:43-45). Hebrews 11:9-10, 16 reveals that Abraham himself understood the land promise as pointing to a heavenly country. Paul says the promise to Abraham was that he would be 'heir of the world' (Rom 4:13), not just a strip of land in the Middle East. Conflating the modern state with biblical Israel is an equivocation fallacy.",
    },
    {
      id: "fl-appeal-to-novelty",
      name: "Appeal to Novelty (Dressed as Tradition)",
      definition:
        "Presenting dispensationalism as if it were historic Christian orthodoxy when it was actually invented in the 1830s by John Nelson Darby. The system then dismisses older interpretive traditions (historicism, amillennialism) as if they were the novel positions.",
      example:
        "'The pre-trib rapture has always been the blessed hope of the church. Historicism is an outdated medieval approach that nobody takes seriously anymore.'",
      counterMove:
        "The pre-tribulation rapture was unknown in Christian theology before John Nelson Darby developed it in the 1830s. No church father, no Reformer, no major theologian in 1,800 years of church history taught a secret rapture separate from the visible Second Coming. Historicism, by contrast, was the dominant prophetic method of the Protestant Reformation — Luther, Calvin, Knox, Wesley, Newton, and the Millerites all used it. Dispensationalism was popularized through the Scofield Reference Bible (1909) and Dallas Theological Seminary (1924). The novel position is dispensationalism itself.",
    },
  ],

  // ── Phase 5: Master Counter-Strategies ───────────────────────────────────
  counterStrategies: [
    {
      subjectId: "secret-rapture",
      title: "Dismantling the Secret Rapture",
      sdaPosition:
        "There is one Second Coming of Christ — visible, audible, and glorious. There is no secret rapture. Jesus comes with a shout, the voice of the archangel, and the trumpet of God (1 Thess 4:16). Every eye will see Him (Rev 1:7). The righteous dead are raised and the living saints are caught up together to meet the Lord, then taken to heaven for the millennium.",
      keyScriptures: [
        "1 Thess 4:16-17 — The Lord descends with a shout, trumpet, and archangel voice — not secretly",
        "Matt 24:27 — As lightning from east to west, so shall the coming of the Son of man be",
        "Rev 1:7 — Every eye shall see Him, and all kindreds of the earth shall wail",
        "Acts 1:11 — This same Jesus shall come in like manner as ye have seen Him go (visibly, in clouds)",
        "2 Pet 3:10 — The day of the Lord comes as a thief, but with a great noise and elements melting",
        "Matt 24:31 — He sends His angels with a great sound of a trumpet to gather His elect",
      ],
      counterArguments: [
        "1 Thessalonians 4:16-17 is the dispensationalist's primary rapture text, yet it describes the loudest event imaginable — a shout, an archangel's voice, and God's trumpet. This is not secret by any definition.",
        "The Greek word 'apantesis' (meeting, 1 Thess 4:17) was used for citizens going out to meet a visiting dignitary and escorting him back to their city. The saints meet Jesus in the air and escort Him to earth for judgment, or are taken to heaven — but they do not reverse direction for a secret return trip.",
        "Jesus warned against exactly this kind of 'secret coming' teaching: 'If any man shall say unto you, Lo, here is Christ... believe it not' (Matt 24:23). 'If they shall say... behold, he is in the secret chambers; believe it not' (Matt 24:26).",
        "'As a thief' refers to the unexpectedness of timing, not the mode of arrival. Peter clarifies that when the Lord comes 'as a thief,' the heavens pass away with a great noise (2 Pet 3:10). Thieves are unexpected — but their break-ins are not silent.",
        "The concept of a secret rapture was entirely unknown before J.N. Darby in the 1830s. No church father, no Reformer, no creed, no confession of faith ever taught it. It entered mainstream evangelicalism through C.I. Scofield's study Bible and was popularized by Hal Lindsey and the Left Behind franchise.",
      ],
      closingStatement:
        "Scripture presents one return of Christ — visible, audible, and unmistakable. The secret rapture doctrine requires splitting the Second Coming into two events that no biblical writer describes as separate. It was unknown for 1,800 years of church history and emerged from Darby's novel hermeneutic, not from the plain reading of Scripture.",
    },
    {
      subjectId: "seven-year-tribulation",
      title: "The Seventy Weeks: No Gap, No Future Tribulation",
      sdaPosition:
        "Daniel 9:24-27 is a Messianic prophecy fulfilled by Jesus Christ. The 70 weeks (490 years) run continuously from the decree to restore Jerusalem (457 BC) to the end of the gospel commission to Israel (AD 34). There is no gap, no parenthesis, and no future seven-year tribulation. The 'he' who confirms the covenant is Christ, not a future Antichrist.",
      keyScriptures: [
        "Dan 9:24-27 — The 70 weeks prophecy, Messiah-centered from start to finish",
        "Dan 9:25 — From the decree to restore Jerusalem unto Messiah the Prince: 69 weeks (483 years)",
        "Dan 9:26 — Messiah shall be cut off, but not for Himself (the crucifixion)",
        "Dan 9:27 — He shall confirm the covenant with many for one week (Christ's ministry + apostolic witness)",
        "Heb 10:12 — Christ offered ONE sacrifice for sins forever (ending the need for oblation)",
        "Ezra 7:7-8 — The decree of Artaxerxes in 457 BC, starting the 70-week countdown",
      ],
      counterArguments: [
        "The 70 weeks are 'determined' (Hebrew: chatak, cut off) as one continuous unit upon Daniel's people. There is no linguistic, contextual, or grammatical basis for inserting a 2,000+ year gap between the 69th and 70th week. No one reads the first 69 weeks with a gap — why invent one before the 70th?",
        "The 'he' of Daniel 9:27 grammatically refers to 'Messiah the Prince' (v.25), not the 'prince' of the people who destroy the city (v.26). Christ confirmed (strengthened) the covenant through His ministry to Israel. He caused sacrifice to cease by becoming the ultimate sacrifice (Heb 10:12).",
        "The historical fulfillment is precise: 457 BC + 483 years = AD 27 (Jesus' baptism). AD 27 + 3.5 years = AD 31 (crucifixion, 'midst of the week'). AD 31 + 3.5 years = AD 34 (stoning of Stephen, gospel to Gentiles). This mathematical precision confirms the Messianic interpretation.",
        "The gap theory was invented by the Jesuit Francisco Ribera in 1590 as a counter-Reformation strategy to deflect the Protestant identification of the papacy as the Antichrist. Darby adopted and refined it in the 1830s. It is a Jesuit construct embraced by Protestant evangelicals.",
        "If the 70th week is still future, then Daniel 9:24's six purposes ('to finish the transgression, make an end of sins, make reconciliation for iniquity, bring in everlasting righteousness, seal up the vision and prophecy, anoint the most Holy') have not been accomplished — yet Christ accomplished all of these at the cross.",
      ],
      closingStatement:
        "Daniel's 70-week prophecy is the crown jewel of Messianic prediction, pointing with mathematical precision to Christ's baptism, crucifixion, and the close of Israel's special probation. Severing the 70th week and casting it 2,000 years into the future robs Christ of His prophetic fulfillment and was invented by Jesuit counter-Reformation theology, not by the Bible.",
    },
    {
      subjectId: "antichrist-future-individual",
      title: "The Antichrist: A System, Not Just a Person",
      sdaPosition:
        "The Antichrist (man of sin, little horn, beast) is identified by historicist Protestants as the papal system — a centuries-long religious-political power that fulfilled every prophetic specification. It is not merely a future individual. The Reformers unanimously identified Rome as the Antichrist, and the futurist reinterpretation was designed to deflect this identification.",
      keyScriptures: [
        "Dan 7:8, 24-25 — The little horn rises among the 10 horns, speaks against the Most High, persecutes saints, thinks to change times and laws",
        "2 Thess 2:3-4 — The man of sin sits in the temple of God, showing himself that he is God",
        "Rev 13:1-8 — The beast receives power from the dragon, rules 42 months (1,260 years), blasphemes God",
        "Rev 17:1-6 — The woman (apostate church) sits on the beast, drunk with the blood of saints",
        "1 John 2:18 — Even now there are many antichrists (a system/spirit, not just one person)",
        "Dan 7:21-22 — The horn made war with the saints until the Ancient of Days came",
      ],
      counterArguments: [
        "Daniel 7:8, 24-25 describes a power that arises from the fourth beast (Rome), uproots three kingdoms, speaks great words against God, persecutes saints for 'a time, times, and half a time' (1,260 years), and thinks to change times and laws. The papacy fulfills every specification: it arose from Rome, uprooted the Heruli, Vandals, and Ostrogoths, claims divine prerogatives, persecuted millions during the Inquisition, and changed the Sabbath from Saturday to Sunday.",
        "The Reformers — Luther, Calvin, Knox, Zwingli, Wycliffe, Huss, Tyndale, Cranmer, Wesley, and others — unanimously identified the papacy as the Antichrist. This was not fringe theology; it was the settled Protestant consensus for centuries.",
        "The futurist interpretation was created by Jesuit priest Francisco Ribera in 1590 specifically to counter the Reformers' identification. Another Jesuit, Robert Bellarmine, elaborated on it. This is admitted by Catholic historians. Protestants who adopt futurism are unwittingly embracing a Jesuit counter-Reformation hermeneutic.",
        "John says 'even now there are many antichrists' (1 John 2:18) — the antichrist spirit was already at work in the first century and would culminate in a system, not appear suddenly as a single individual in the distant future.",
        "A future individual Antichrist who rules only 3.5 literal years does not fit the prophetic timelines (1,260 days = years, Dan 7:25; Rev 12:6, 14; 13:5), the historical scope of persecution, or the comprehensive descriptions of a religious-political system spanning centuries.",
      ],
      closingStatement:
        "The historicist identification of the Antichrist as the papal system is not anti-Catholic bigotry — it is the consistent testimony of the Protestant Reformers, grounded in careful exegesis of Daniel and Revelation. The futurist reinterpretation was a Jesuit invention designed to rescue Rome from prophetic exposure. Adventists maintain the Reformers' position because the biblical evidence demands it.",
    },
    {
      subjectId: "dispensational-israel",
      title: "One People of God: Jew and Gentile United in Christ",
      sdaPosition:
        "God has one people, one plan of salvation, and one olive tree. The Church does not replace Israel — it is the continuation and expansion of true Israel. Gentile believers are grafted into Israel's olive tree (Rom 11). All who are in Christ are Abraham's seed (Gal 3:28-29). There are not two separate programs for two separate peoples.",
      keyScriptures: [
        "Gal 3:28-29 — Neither Jew nor Greek; if ye be Christ's, ye are Abraham's seed",
        "Rom 9:6-8 — Not all Israel is Israel; the children of promise are the seed",
        "Rom 11:17-24 — One olive tree; Gentiles grafted in, unbelieving Jews broken off",
        "Eph 2:14-16 — Christ broke down the wall of partition, making Jew and Gentile one new man",
        "1 Pet 2:9-10 — Believers are a chosen generation, a royal priesthood, a holy nation (titles once for Israel)",
        "Rom 2:28-29 — A Jew is one inwardly; circumcision is of the heart",
      ],
      counterArguments: [
        "Paul explicitly redefines 'Israel': 'They are not all Israel, which are of Israel' (Rom 9:6). 'The children of the flesh, these are NOT the children of God: but the children of the promise are counted for the seed' (Rom 9:8). This is not replacement — it is Paul's own definition.",
        "Galatians 3:28-29 is decisive and cannot be explained away by dispensational categories: 'There is neither Jew nor Greek... ye are all one in Christ Jesus. And if ye be Christ's, then are ye Abraham's seed, and heirs according to the promise.' Believers ARE Israel's heirs — not a separate, parenthetical people.",
        "Ephesians 2:14-16 says Christ has 'broken down the middle wall of partition' between Jew and Gentile, making 'one new man.' Dispensationalism rebuilds this wall by insisting on permanent ethnic distinctions in God's plan.",
        "Peter applies Israel's covenant titles directly to the church: 'a chosen generation, a royal priesthood, a holy nation, a peculiar people' (1 Pet 2:9, cf. Exod 19:5-6). If the church is separate from Israel, Peter is committing identity theft.",
        "Romans 11 uses ONE olive tree, not two. Jewish and Gentile believers share the SAME root, the SAME tree, the SAME nourishment. Branches are broken off for unbelief and grafted in by faith — the criterion is faith in Christ, not ethnicity.",
      ],
      closingStatement:
        "The New Testament consistently teaches one people of God united by faith in Christ, regardless of ethnicity. Dispensationalism's two-peoples theology contradicts Paul's central argument in Romans and Galatians, rebuilds the wall Christ tore down, and invents a parenthetical 'Church Age' that no New Testament writer ever describes. God has always had one plan: salvation by grace through faith, for all who believe.",
    },
    {
      subjectId: "literal-futurist-revelation",
      title: "Revelation Through the Historicist Lens",
      sdaPosition:
        "Revelation is best understood through the historicist method — as a prophetic panorama spanning from John's day to the Second Coming and beyond. The seven churches represent successive eras of church history, the seals and trumpets trace the decline of Rome and rise of papal power, and the beasts of Revelation 13 and 17 depict identifiable historical powers. This method was held by the Reformers and produces verifiable, testable interpretations.",
      keyScriptures: [
        "Rev 1:1, 19 — Things which are, and things which shall be hereafter (a prophetic sweep of history)",
        "Rev 12:6, 14 — The woman in the wilderness 1,260 days (years): the true church during papal supremacy",
        "Rev 13:5 — The beast given authority for 42 months (1,260 years of papal dominance, 538-1798 AD)",
        "Rev 14:6-12 — The three angels' messages: a present-truth call to the world before Christ returns",
        "Dan 2:28 — God reveals 'what shall be in the latter days' through a continuous historical panorama",
        "Rev 19:11-16 — The climax: Christ's visible, glorious return to end the age",
      ],
      counterArguments: [
        "The futurist method renders Revelation meaningless for the 1,900+ years between John and the supposed future tribulation. If Revelation 4-19 describes only events in a final 7-year period, then Christians throughout history had no prophetic guidance. The historicist method gives Revelation relevance to every generation.",
        "Historicism produces testable, falsifiable interpretations tied to verifiable historical events: the fall of Rome, the rise of the papacy, the 1,260-year period (538-1798), the Protestant Reformation, the Great Awakening, and the Advent movement. Futurism, by definition, cannot be tested because its events have not happened.",
        "The seven churches of Revelation 2-3 map precisely to seven eras of church history: Ephesus (apostolic), Smyrna (persecution), Pergamos (compromise), Thyatira (papal dominance), Sardis (Reformation), Philadelphia (Great Awakening/Advent), Laodicea (modern lukewarmness). Even futurists acknowledge these as historical eras while contradicting their own method.",
        "Revelation 14:6-12 (the three angels' messages) is a present-truth proclamation to the world BEFORE Christ returns. Futurism has no coherent placement for this passage because it calls people to 'fear God and give glory to Him, for the hour of His judgment is come' — the investigative judgment that began in 1844.",
        "The historicist method was the dominant Protestant approach from the Reformation through the 19th century. Luther, Calvin, Knox, Wesley, Jonathan Edwards, Isaac Newton, and the early Adventists all employed it. Futurism only supplanted it in popular evangelicalism through the Scofield Bible and Dallas Seminary in the 20th century — ironically adopting a Jesuit hermeneutic.",
      ],
      closingStatement:
        "The historicist interpretation of Revelation is not an antiquated curiosity — it is the time-tested Protestant method that unlocks Daniel and Revelation as a continuous prophetic narrative, fulfilled in verifiable history and culminating in Christ's return. Futurism pushes nearly all of Revelation into an unknowable future, robbing believers of prophetic light and adopting the very hermeneutic Rome invented to silence the Reformers.",
    },
  ],

  // ── Phase 6: Enter Combat — Full Modules ─────────────────────────────────
  modules: [
    // ── Module 1: Secret Rapture ─────────────────────────────────────────
    {
      id: "mod-futurist-secret-rapture",
      subjectId: "secret-rapture",
      title: "The Secret Rapture — Debunked",
      doctrineBrief:
        "Dispensationalists teach that Christ will secretly return to 'rapture' (snatch away) believers before a 7-year tribulation. The unsaved world will suddenly find millions of people missing. This doctrine, popularized by the Left Behind series, is central to the futurist prophetic framework and fundamentally reshapes eschatology away from the historicist understanding.",
      steelmanArguments: [
        {
          id: "mod1-sa1",
          title: "Imminence Demands a Pre-Tribulation Event",
          argument:
            "If believers must endure the tribulation first, then Christ's return is not imminent — it is preceded by identifiable events. The New Testament consistently presents the return as something to watch for NOW (Matt 24:42; 1 Thess 5:6), requiring that no prophetic events remain before the rapture.",
          hiddenAssumptions: [
            "Imminence means a signless, any-moment return rather than watchful readiness",
            "A pre-tribulation rapture is the only way to preserve imminence",
          ],
          sdaResponse:
            "Jesus Himself gave signs before His return (Matt 24:4-31) and said the gospel must first be preached to all nations (Matt 24:14). Paul said the day of the Lord would not come until the falling away and man of sin were revealed (2 Thess 2:1-4). Biblical 'imminence' means living in readiness, not that zero events precede the return.",
        },
        {
          id: "mod1-sa2",
          title: "Two Descriptions Require Two Events",
          argument:
            "Christ comes 'as a thief' (secretly) AND 'every eye shall see Him' (publicly). These contradictory descriptions can only be reconciled by positing two separate events: the rapture (secret, for the church) and the revelation (public, in judgment).",
          hiddenAssumptions: [
            "'As a thief' means invisible rather than unexpected",
            "Complementary descriptions of one event must be separated into two events",
          ],
          sdaResponse:
            "Peter explains: the Lord comes 'as a thief,' and when He does, 'the heavens shall pass away with a great noise' (2 Pet 3:10). A thief is unexpected in timing, not invisible in effect. All Second Coming descriptions fit one climactic event: visible (Rev 1:7), audible (1 Thess 4:16), unexpected to the wicked (Matt 24:44), eagerly awaited by the righteous (Titus 2:13).",
        },
      ],
      hiddenAssumptions: [
        "1 Thessalonians 4:16-17 describes a different event from Matthew 24:30-31",
        "The Church and Israel have separate eschatological programs",
        "'Caught up' (harpazo) implies removal from earth rather than meeting a descending King",
        "God always removes His people before judgment rather than protecting them through it",
      ],
      mindGames: [
        {
          id: "mod1-mg1",
          name: "Left Behind Terror Tactic",
          description:
            "Using vivid, emotional scenarios of vanishing family members, crashing planes, and abandoned children to create fear-based acceptance of the rapture doctrine.",
          example:
            "'What if your child disappears from their bed tonight? Will you know where they went? Or will you be the one left behind, facing the Antichrist alone?'",
          detectionTip:
            "This is pure emotional manipulation. Ask: 'Which verse describes planes crashing or children vanishing from cribs?' These are fiction-based images from LaHaye's novels, not biblical descriptions. In Matt 24:40-41, those 'taken' are taken in judgment (cf. v.39, the flood 'took them all away').",
        },
        {
          id: "mod1-mg2",
          name: "Majority Consensus Pressure",
          description:
            "Claiming that 'most Bible-believing Christians' accept the pre-trib rapture, implying that disagreement places you outside orthodoxy.",
          example:
            "'Every major evangelical seminary teaches the pre-trib rapture. Are you really going to say they're all wrong?'",
          detectionTip:
            "This is an appeal to popularity. The pre-trib rapture was unknown for 1,800 years. The majority of Christians worldwide (Catholic, Orthodox, mainline Protestant, SDA) do NOT hold to a pre-trib rapture. Even among evangelicals, post-trib and amillennial views are well represented.",
        },
      ],
      fallacies: [
        {
          id: "mod1-fl1",
          name: "Word Absence Fallacy",
          definition:
            "Claiming the absence of the word 'church' in Revelation 4-18 proves the church has been raptured, confusing word absence with entity absence.",
          example:
            "'The church is mentioned 19 times in Revelation 1-3, then disappears. Proof of the rapture!'",
          counterMove:
            "'Church' (ekklesia) is absent from 16 New Testament books, yet no one claims the church is absent from them. 'Saints' appear throughout Revelation's tribulation chapters (13:7; 14:12; 17:6). The argument confuses vocabulary with ontology.",
        },
        {
          id: "mod1-fl2",
          name: "Begging the Question",
          definition:
            "Interpreting 1 Thessalonians 4:16-17 as the rapture, then using the rapture to explain why the church is absent from Revelation, then using that absence as proof of the rapture — a circular argument.",
          example:
            "'We know the rapture is in 1 Thess 4 because the church is gone in Revelation, and we know the church is gone because of the rapture in 1 Thess 4.'",
          counterMove:
            "The conclusion (rapture) is assumed in the premise. 1 Thessalonians 4:16-17 describes the Second Coming (audible, visible, with trumpet), not a separate secret event. The circularity collapses when the initial assumption is challenged.",
        },
      ],
      counterStrategy: {
        subjectId: "secret-rapture",
        title: "Dismantling the Secret Rapture",
        sdaPosition:
          "There is one Second Coming — visible, audible, and glorious. Every eye shall see Him. The dead in Christ rise first, then the living saints are caught up to meet the Lord. There is no secret rapture.",
        keyScriptures: [
          "1 Thess 4:16 — The Lord Himself shall descend with a shout, the voice of the archangel, and the trump of God",
          "Matt 24:27 — As lightning from east to west, so shall the coming of the Son of man be",
          "Rev 1:7 — Behold, He cometh with clouds; and every eye shall see Him",
          "2 Pet 3:10 — The day of the Lord will come as a thief, the heavens passing away with a great noise",
          "Matt 24:23-26 — Jesus warned against believing in a secret coming",
        ],
        counterArguments: [
          "The primary rapture proof text (1 Thess 4:16-17) describes the most public event imaginable: a shout, an archangel, a trumpet. There is nothing secret about it.",
          "Jesus explicitly warned against secret coming doctrines: 'If they say... behold, he is in the secret chambers; believe it not' (Matt 24:26).",
          "The concept was invented by J.N. Darby in the 1830s — no church father, Reformer, or creedal statement in 1,800 years taught it.",
          "'As a thief' means unexpected timing, not invisible arrival (2 Pet 3:10 — great noise, elements melting).",
          "In Matt 24:40-41, those 'taken' are taken in judgment (like the flood took people in v.39); those 'left' survive — the opposite of Left Behind theology.",
        ],
        closingStatement:
          "The secret rapture is a 19th-century invention that contradicts the plain testimony of Scripture. The blessed hope of the church is the ONE visible, glorious return of Jesus Christ.",
      },
      debateSimLink: "futurist",
      debriefPrompt:
        "Reflect on the secret rapture debate. Did the Futurist rely on emotional appeals (Left Behind scenarios) or textual arguments? How effectively did you demonstrate that 1 Thessalonians 4:16-17 describes a public, audible event? Did you address the Darby origin effectively?",
    },

    // ── Module 2: Seven-Year Tribulation ─────────────────────────────────
    {
      id: "mod-futurist-seven-year-trib",
      subjectId: "seven-year-tribulation",
      title: "Daniel's 70th Week — Christ, Not Antichrist",
      doctrineBrief:
        "Dispensationalists teach that Daniel's 70th week (Dan 9:27) has been detached from the preceding 69 weeks by a 2,000+ year gap ('the Church Age parenthesis'). They claim this final 'week' is a future 7-year tribulation during which a future Antichrist makes and breaks a covenant with Israel. This interpretation removes Christ from His own prophecy and replaces Him with the Antichrist.",
      steelmanArguments: [
        {
          id: "mod2-sa1",
          title: "Israel's Rejection Paused the Clock",
          argument:
            "When Israel rejected Christ, God suspended the prophetic timeline and turned to the Gentiles. The Church Age is a mystery not revealed to Old Testament prophets (Eph 3:3-6). Once the 'fullness of the Gentiles' comes in (Rom 11:25), God resumes the 70th week with Israel.",
          hiddenAssumptions: [
            "A continuous time prophecy can be paused indefinitely",
            "The Church Age was unforeseen by any Old Testament prophet",
            "God has two separate programs that run sequentially, not concurrently",
          ],
          sdaResponse:
            "If the prophetic clock can be paused for 2,000+ years, the prophecy loses all precision and predictive value — any gap of any length could be inserted anywhere. The 70 weeks are explicitly 'determined' (cut off) as a unit (Dan 9:24). The Church was not a mystery hidden from the OT — Isaiah prophesied Gentile inclusion (Isa 49:6; 56:6-8), as did the Abrahamic covenant itself ('in thee shall all families of the earth be blessed,' Gen 12:3).",
        },
        {
          id: "mod2-sa2",
          title: "The Prince Who Confirms the Covenant Is the Antichrist",
          argument:
            "Daniel 9:26 mentions 'the prince that shall come' who destroys the city. Verse 27 says 'he shall confirm the covenant with many for one week.' This 'he' is the coming prince — the Antichrist — who makes a peace treaty with Israel and then breaks it after 3.5 years.",
          hiddenAssumptions: [
            "The 'he' of verse 27 refers to 'the prince' of verse 26 rather than 'Messiah the Prince' of verse 25",
            "The word 'confirm' (Hebrew: gabar, to make strong) means 'make a new treaty' rather than 'strengthen an existing covenant'",
          ],
          sdaResponse:
            "The subject of the passage is 'Messiah the Prince' (v.25). The 'prince of the people' (v.26) is a subordinate clause describing the Roman destruction of Jerusalem — it introduces Titus, not the Antichrist. The 'he' of verse 27 returns to the main subject: Messiah. The Hebrew gabar means 'to make strong/confirm,' not 'to make a new treaty.' Christ confirmed (strengthened) the covenant with Israel through His earthly ministry. He caused sacrifice to cease by His once-for-all sacrifice on the cross (Heb 10:12).",
        },
      ],
      hiddenAssumptions: [
        "A continuous 490-year prophecy can have a 2,000+ year gap inserted between week 69 and week 70",
        "The word 'confirm' means 'make a new covenant' rather than 'strengthen the existing covenant'",
        "The 'he' of Daniel 9:27 changes subjects from Messiah to Antichrist mid-sentence",
        "Daniel's prophecy focuses on a future Antichrist rather than the Messiah it explicitly names",
      ],
      mindGames: [
        {
          id: "mod2-mg1",
          name: "Chart Overwhelm",
          description:
            "Presenting elaborate dispensational prophecy charts with dozens of color-coded events to make the system appear comprehensive and unchallengeable.",
          example:
            "'Just look at this chart — it shows how Daniel's 70 weeks, the rapture, the tribulation, the millennium, and the eternal state all fit together. You can't argue with a system this complete.'",
          detectionTip:
            "A chart is not an argument. Ask: 'Where does the Bible itself present this timeline?' The dispensational chart is an interpretive framework imposed on Scripture, not something derived from a single passage. The key question is whether the 70 weeks run continuously — everything on the chart depends on the gap being real.",
        },
        {
          id: "mod2-mg2",
          name: "Current Events Urgency",
          description:
            "Using Middle East geopolitics to create a sense that the tribulation is about to begin, making doctrinal analysis seem like a luxury when time is running out.",
          example:
            "'With what's happening in Israel right now, we don't have time to debate hermeneutics. The tribulation could start any day. You need to understand the 70th week or you'll be caught off guard.'",
          detectionTip:
            "Every generation of dispensationalists has claimed their current events signaled the imminent tribulation. The six-day war (1967), Gulf War (1990), Y2K, 9/11, and every subsequent crisis have been proclaimed as precursors. Ask: 'How is this different from the dozens of failed predictions based on the same framework?'",
        },
      ],
      fallacies: [
        {
          id: "mod2-fl1",
          name: "Special Pleading (The Parenthesis)",
          definition:
            "Inserting a 2,000+ year gap into a continuous time prophecy without any textual indicator, while insisting the first 69 weeks must be read consecutively. This applies different rules to the same prophecy without justification.",
          example:
            "'The first 69 weeks run consecutively, but between the 69th and 70th week God inserted the Church Age. It's a prophetic parenthesis.'",
          counterMove:
            "If the first 69 weeks are consecutive (and they must be to reach AD 27), on what basis do you insert a gap before the 70th? The text says the 70 weeks are 'determined' (cut off as one block). Inserting an unlimited gap makes the prophecy infinitely elastic and unfalsifiable — any future generation could claim to be in the 70th week.",
        },
        {
          id: "mod2-fl2",
          name: "Referent Switching",
          definition:
            "Silently changing the subject of Daniel 9:27 from 'Messiah the Prince' (the explicit subject of the passage) to an unnamed future Antichrist, without grammatical or contextual justification.",
          example:
            "'He shall confirm the covenant — that's the Antichrist making a deal with Israel and then breaking it halfway through the tribulation.'",
          counterMove:
            "Read the passage aloud. The subject throughout Daniel 9:24-27 is Messiah. Verse 25: 'unto Messiah the Prince.' Verse 26: 'Messiah shall be cut off.' Verse 27: 'He shall confirm the covenant.' The natural antecedent of 'he' is Messiah, the subject of the prophecy. Switching to an Antichrist requires ignoring basic grammar.",
        },
      ],
      counterStrategy: {
        subjectId: "seven-year-tribulation",
        title: "No Gap, No Future Tribulation Week",
        sdaPosition:
          "Daniel 9:24-27 is a Messianic prophecy fulfilled by Jesus Christ — His baptism, ministry, death, and the close of Israel's special probation. The 70 weeks run continuously with no gap. The 'he' who confirms the covenant is Christ.",
        keyScriptures: [
          "Dan 9:24 — Seventy weeks are determined (cut off as one continuous block)",
          "Dan 9:25 — Unto Messiah the Prince: 69 weeks from 457 BC = AD 27",
          "Dan 9:26 — Messiah cut off (crucifixion, AD 31)",
          "Dan 9:27 — He (Messiah) confirms the covenant, causes sacrifice to cease",
          "Heb 10:12 — Christ's one sacrifice ended the need for all others",
        ],
        counterArguments: [
          "The 70 weeks are 'determined' (cut off) as one unit — no gap is indicated or implied.",
          "The 'he' of verse 27 is Messiah the Prince, the grammatical subject of the passage.",
          "Christ fulfilled all six objectives of Daniel 9:24 at the cross — a future 70th week means these remain unfulfilled.",
          "The gap theory was invented by Jesuit Francisco Ribera (1590) and adopted by Darby (1830s).",
          "The historical math is precise: 457 BC + 483 = AD 27 (baptism); + 3.5 = AD 31 (cross); + 3.5 = AD 34 (Stephen, gospel to Gentiles).",
        ],
        closingStatement:
          "Daniel's 70 weeks point to Christ with mathematical precision. Inserting a 2,000-year gap robs the Messiah of His prophecy and replaces Him with a fictional future Antichrist — a theological tragedy born of Jesuit counter-Reformation strategy.",
      },
      debateSimLink: "futurist",
      debriefPrompt:
        "Evaluate the debate on Daniel's 70th week. Were you able to demonstrate the continuous nature of the 490-year prophecy? Did the Futurist struggle to justify the gap, or did they shift to emotional arguments? How well did you present the Messianic fulfillment of Daniel 9:27?",
    },

    // ── Module 3: Antichrist as Future Individual ────────────────────────
    {
      id: "mod-futurist-antichrist",
      subjectId: "antichrist-future-individual",
      title: "The Antichrist — System vs. Individual",
      doctrineBrief:
        "Dispensationalism teaches that the Antichrist is a single future individual who will arise during the 7-year tribulation, make a covenant with Israel, desecrate a rebuilt temple, and rule the world for 3.5 years. This directly contradicts the historicist Protestant identification of the Antichrist as the papal system — a centuries-long religio-political power fulfilling every prophetic specification.",
      steelmanArguments: [
        {
          id: "mod3-sa1",
          title: "Personal Language Requires a Personal Antichrist",
          argument:
            "2 Thessalonians 2 describes the 'man of sin' with personal pronouns — 'he' opposes God, 'he' sits in the temple, 'he' shows himself as God. Daniel 7 describes the little horn speaking and acting as an individual agent. These descriptions require a specific person, not an impersonal system or institution.",
          hiddenAssumptions: [
            "Prophetic symbolism always maps to individuals rather than institutions or dynasties",
            "Personal pronouns in prophecy cannot represent a succession of leaders within a system",
            "A system spanning centuries cannot be described in personal terms",
          ],
          sdaResponse:
            "Daniel 7 uses the same personal language for all the beasts: the lion, bear, and leopard are described with personal pronouns, yet they represent empires (Babylon, Medo-Persia, Greece), not individuals. The 'king' in Daniel often represents a kingdom (Dan 7:17, 'These great beasts, which are four, are four kings' = kingdoms, as v.23 clarifies). The 'man of sin' (2 Thess 2) describes a system in which successive leaders embody the same anti-Christian character — just as 'Pharaoh' was a title held by many individuals but could be spoken of as a single entity throughout Exodus.",
        },
        {
          id: "mod3-sa2",
          title: "The Antichrist Cannot Be the Papacy Because Many Popes Were Good Men",
          argument:
            "The Antichrist is described as supremely evil — the embodiment of Satan's power. Many popes have been devout, charitable, and sincere Christians. Francis of Assisi submitted to the pope. Mother Teresa served under papal authority. It is unfair and historically inaccurate to call the entire papacy the Antichrist.",
          hiddenAssumptions: [
            "The Antichrist must be personally wicked in every instance to fulfill the prophecy",
            "Sincerity of individual leaders disproves the systemic identification",
            "Prophetic identification is a personal moral judgment on every individual pope",
          ],
          sdaResponse:
            "The prophetic identification is about the SYSTEM, not the personal character of every individual pope. The issue is not personal morality but systemic claims: claiming to be Christ's vicar on earth, claiming authority to forgive sins, claiming power to change God's law (specifically the Sabbath), and historically persecuting dissenters. A kind person can lead a corrupt system. Nebuchadnezzar was called God's 'servant' (Jer 25:9), yet Babylon was still the prophetic head of gold that opposed God's people. The Reformers understood this distinction clearly.",
        },
      ],
      hiddenAssumptions: [
        "The Antichrist is a single future individual, not a prophetic system spanning centuries",
        "The futurist framework preserves the papacy from prophetic identification",
        "3.5 years in Daniel and Revelation are literal years, not the 1,260-year prophetic period",
        "The Reformers' unanimous identification of the papacy as Antichrist was just prejudice, not exegesis",
      ],
      mindGames: [
        {
          id: "mod3-mg1",
          name: "Bigotry Accusation",
          description:
            "Framing the historicist identification of the papacy as anti-Catholic bigotry to shut down exegetical discussion with moral outrage.",
          example:
            "'Calling the pope the Antichrist is hate speech. It's no different from antisemitism or Islamophobia. You're just spreading religious intolerance.'",
          detectionTip:
            "Distinguish between attacking people and identifying prophetic symbols. Ask: 'Were Luther, Calvin, Knox, Wesley, Newton, and Spurgeon all bigots?' The Reformers made this identification based on careful exegesis of Daniel 7 and 2 Thessalonians 2, not prejudice. SDAs love Catholic people while identifying a prophetic system — just as Jesus loved the Pharisees while opposing their system.",
        },
        {
          id: "mod3-mg2",
          name: "Hollywood Antichrist Imagery",
          description:
            "Reinforcing the future-individual view through cultural imagery from movies like The Omen, Left Behind, and other apocalyptic fiction that portrays the Antichrist as a single charismatic villain.",
          example:
            "'The Antichrist will be a single world leader who rises to power through charm and deception — like in the movies, but real. He'll be a political genius who deceives the whole world.'",
          detectionTip:
            "Ask: 'Are you describing a Bible prophecy or a movie plot?' The Hollywood Antichrist is based on dispensational fiction, not Scripture. Daniel 7's little horn arises from a specific historical context (the fourth beast = Rome), speaks 'great words against the Most High,' persecutes saints for 1,260 years, and 'thinks to change times and laws' — this is a system, not a Bond villain.",
        },
      ],
      fallacies: [
        {
          id: "mod3-fl1",
          name: "Straw Man (Misrepresenting Historicism)",
          definition:
            "Caricaturing the historicist position as 'the pope is personally the devil' rather than the nuanced identification of a religio-political system fulfilling specific prophetic criteria over centuries.",
          example:
            "'So you think the current pope is Satan incarnate? That's ridiculous — he's a kind old man who cares about the poor.'",
          counterMove:
            "The historicist position identifies the PAPAL SYSTEM — not any individual pope — as the prophetic Antichrist power. The criteria are systemic: claims of divine prerogatives, authority over God's law, centuries of persecution, and union of church and state. Personal kindness of individual leaders does not negate systemic prophetic fulfillment, just as a kind Roman emperor did not disprove that Rome was the fourth beast.",
        },
        {
          id: "mod3-fl2",
          name: "Genetic Fallacy (Dismissing Reformers)",
          definition:
            "Dismissing the Reformers' identification of the papacy as Antichrist by attributing it to their historical context (political conflict with Rome) rather than engaging their exegetical arguments.",
          example:
            "'Luther called the pope the Antichrist because he was angry at the Catholic Church. It was political, not theological.'",
          counterMove:
            "Luther, Calvin, Knox, Zwingli, Wycliffe, Huss, Tyndale, Cranmer, Wesley, Newton, Spurgeon, and others arrived at the same conclusion independently, across different countries, centuries, and political contexts. Their identification was based on Daniel 7:8, 24-25; 2 Thessalonians 2:3-4; and Revelation 13. Dismiss their argument on exegetical grounds if you can — but attributing it all to politics is a genetic fallacy.",
        },
      ],
      counterStrategy: {
        subjectId: "antichrist-future-individual",
        title: "The Antichrist: Papal System Fulfills Every Specification",
        sdaPosition:
          "The Antichrist is the papal system — a religio-political power that arose from Rome, persecuted saints for 1,260 years, claims divine prerogatives, and changed God's law. The Reformers unanimously identified it. Futurism was invented by Jesuits to deflect this identification.",
        keyScriptures: [
          "Dan 7:8, 24-25 — Little horn rises from Rome, persecutes saints 1,260 years, changes times and laws",
          "2 Thess 2:3-4 — Man of sin sits in God's temple (the church), claiming to be God",
          "Rev 13:5 — Beast given authority 42 months (1,260 years)",
          "1 John 2:18 — Many antichrists have come (a system, not one future person)",
          "Rev 17:4-6 — The woman drunk with the blood of the saints",
        ],
        counterArguments: [
          "Every specification of Daniel 7's little horn fits the papacy: arose from Rome, uprooted three kingdoms, speaks against God, persecuted saints, changed times and laws (Sabbath to Sunday), ruled 1,260 years (538-1798).",
          "The Reformers unanimously identified the papacy as the Antichrist — this was not prejudice but exegesis.",
          "The futurist Antichrist view was invented by Jesuit Francisco Ribera (1590) to counter the Reformers.",
          "A future 3.5-year individual cannot account for the centuries of persecution, the systemic claims, or the historical fulfillment of the 1,260-year period.",
          "1 John 2:18 says antichrist was already at work — it is a system that develops over time, not a future individual.",
        ],
        closingStatement:
          "The historicist identification of the papal system as the Antichrist power is grounded in meticulous exegesis, verified by centuries of historical fulfillment, and affirmed by the united testimony of the Reformers. The futurist alternative was invented by the very power the prophecy exposes.",
      },
      debateSimLink: "futurist",
      debriefPrompt:
        "Review the Antichrist debate. Did you clearly distinguish between identifying a prophetic system and attacking Catholic individuals? Were you able to address the Jesuit origin of futurism effectively? How did the Futurist respond to the Reformers' unanimous identification?",
    },

    // ── Module 4: Dispensational Israel ──────────────────────────────────
    {
      id: "mod-futurist-dispensational-israel",
      subjectId: "dispensational-israel",
      title: "One People of God — No Wall of Separation",
      doctrineBrief:
        "Dispensationalism teaches that God has two distinct peoples — Israel and the Church — with separate covenants, separate destinies, and separate prophetic programs. The Church is a 'parenthesis' in God's plan for Israel. This two-peoples theology fundamentally contradicts Paul's teaching that Christ has made Jew and Gentile ONE in Himself (Eph 2:14-16) and that all who believe are Abraham's seed (Gal 3:28-29).",
      steelmanArguments: [
        {
          id: "mod4-sa1",
          title: "Romans 11:26 Promises National Israel's Salvation",
          argument:
            "'All Israel shall be saved' (Rom 11:26) is a clear promise that ethnic, national Israel will experience a future mass conversion. Paul distinguishes between Israel and the Church throughout Romans 9-11, maintaining that God has not abandoned His covenant people. The gifts and calling of God are irrevocable (Rom 11:29).",
          hiddenAssumptions: [
            "'All Israel' means every ethnic Jew, not the full number of the elect",
            "Romans 9-11 maintains a permanent distinction between Israel and the Church",
            "'Irrevocable' calling means unconditional salvation regardless of faith",
          ],
          sdaResponse:
            "Paul defines 'Israel' in the very passage dispensationalists cite: 'They are not all Israel, which are of Israel' (Rom 9:6). 'All Israel shall be saved' refers to the full number of God's elect — all who are grafted into the ONE olive tree by faith (Rom 11:17-24), whether Jew or Gentile. The 'gifts and calling' are irrevocable in that God does not withdraw the offer — but individuals must respond in faith. Romans 11:20-23 makes clear that branches are broken off for unbelief and grafted in by faith, proving the criterion is faith, not ethnicity.",
        },
        {
          id: "mod4-sa2",
          title: "The Abrahamic Covenant Is Unconditional",
          argument:
            "God made the Abrahamic covenant with a unilateral ceremony — Abraham was asleep while God alone passed between the pieces (Gen 15:12-17). This means the covenant depends entirely on God, not on Israel's obedience. God cannot break His promise to give the land to Abraham's physical descendants forever.",
          hiddenAssumptions: [
            "The ceremony's form (unilateral) overrides all subsequent conditional statements",
            "Abraham's 'seed' is exclusively ethnic Israel rather than Christ and those in Christ",
            "The land promise is permanent and physical rather than typological and eschatological",
          ],
          sdaResponse:
            "Galatians 3:16 says 'to Abraham and his seed were the promises made. He saith not, And to seeds, as of many; but as of one, And to thy seed, which is Christ.' The seed is Christ, and those in Christ. The land promise was fulfilled under Joshua (Josh 21:43-45: 'The LORD gave unto Israel ALL the land which He sware to give unto their fathers... there failed not ought of any good thing'). Abraham himself 'looked for a city which hath foundations, whose builder and maker is God' (Heb 11:10) and desired 'a better country, that is, an heavenly' (Heb 11:16). Even Abraham understood the land as typological.",
        },
      ],
      hiddenAssumptions: [
        "God has two peoples with two programs: Israel (earthly) and the Church (heavenly)",
        "The Church Age is a 'parenthesis' unforeseen by Old Testament prophets",
        "Ethnic Israel retains covenant status apart from faith in Christ",
        "The New Testament maintains, rather than dissolves, the Jew/Gentile distinction",
      ],
      mindGames: [
        {
          id: "mod4-mg1",
          name: "Antisemitism Accusation",
          description:
            "Equating the rejection of dispensational Israel theology with antisemitism to create moral pressure against examining the biblical evidence.",
          example:
            "'Replacement theology led to the Holocaust. If you say the Church is Israel, you're denying the Jewish people their God-given identity and contributing to the same kind of thinking that produced the death camps.'",
          detectionTip:
            "This is an extreme emotional manipulation. Affirming that all believers (including Jewish believers) are part of one people of God in Christ is not antisemitism — it is the gospel. Paul, a Jew, taught this. Ask: 'Was Paul antisemitic when he wrote Galatians 3:28?' The SDA position honors Jewish heritage by presenting Christ as the fulfillment of Israel's hope.",
        },
        {
          id: "mod4-mg2",
          name: "Geopolitical Proof-Texting",
          description:
            "Pointing to the modern State of Israel (est. 1948) as irrefutable proof of dispensational theology, conflating a secular political entity with biblical covenant Israel.",
          example:
            "'Israel became a nation again in 1948 after 2,000 years — just as the Bible predicted. God is clearly still working with national Israel. How can you deny what's right in front of your eyes?'",
          detectionTip:
            "Ask: 'Which specific verse predicts a secular, non-theocratic Jewish state in 1948?' The modern state of Israel is a secular nation established through political Zionism, not a theocratic covenant community. Many Orthodox Jews themselves reject equating the modern state with biblical Israel. The return from Babylonian exile (which the OT explicitly predicts) should not be confused with 20th-century geopolitics.",
        },
      ],
      fallacies: [
        {
          id: "mod4-fl1",
          name: "Equivocation on 'Israel'",
          definition:
            "Using 'Israel' to mean different things in the same argument — sometimes ethnic Jews, sometimes the ancient theocratic nation, sometimes the modern secular state — without acknowledging the switches.",
          example:
            "'God promised Israel the land. Israel is back in the land. Therefore dispensationalism is true.'",
          counterMove:
            "Which 'Israel'? The modern secular state (1948) is not the theocratic covenant nation. The land promise was fulfilled under Joshua (Josh 21:43-45) and was conditional on obedience (Deut 28). Abraham understood it as typological (Heb 11:10, 16). Paul says the promise was to be 'heir of the world' (Rom 4:13), not just Canaan. Three different referents are being conflated.",
        },
        {
          id: "mod4-fl2",
          name: "Appeal to Emotion (Holocaust Guilt)",
          definition:
            "Using the Holocaust to emotionally coerce acceptance of dispensational theology, implying that any alternative theology contributed to genocide — a morally manipulative non sequitur.",
          example:
            "'After the Holocaust, how can any Christian say God is done with the Jewish people?'",
          counterMove:
            "The SDA position does NOT say God is 'done with the Jewish people.' It says God saves Jewish people the same way He saves everyone — through faith in Christ (Rom 1:16, 'to the Jew first'). The Holocaust was a monstrous evil caused by racial hatred, not by Pauline theology. Using the Holocaust as a theological argument exploits immeasurable suffering for doctrinal leverage.",
        },
      ],
      counterStrategy: {
        subjectId: "dispensational-israel",
        title: "One People, One Olive Tree, One Savior",
        sdaPosition:
          "God has one people united by faith in Christ. Gentile believers are grafted into Israel's olive tree. All who are in Christ are Abraham's seed. There are not two separate peoples with two separate programs.",
        keyScriptures: [
          "Gal 3:28-29 — Neither Jew nor Greek; if Christ's, then Abraham's seed and heirs",
          "Rom 9:6-8 — Not all Israel is Israel; the children of the promise are the seed",
          "Eph 2:14-16 — Christ broke the wall of partition, making one new man",
          "Rom 11:17-24 — One olive tree; faith is the criterion, not ethnicity",
          "1 Pet 2:9 — Believers are a chosen generation, royal priesthood, holy nation",
        ],
        counterArguments: [
          "Paul defines 'Israel' spiritually: 'They are not all Israel, which are of Israel' (Rom 9:6). This is Paul's own definition, not 'replacement theology.'",
          "Galatians 3:28-29 explicitly makes all believers Abraham's seed and heirs — dismantling the two-peoples framework.",
          "Ephesians 2:14 says Christ 'broke down the middle wall of partition.' Dispensationalism rebuilds it.",
          "Romans 11 uses ONE olive tree, not two. The criterion for being in or out is faith, not ethnicity.",
          "The Abrahamic land promise was fulfilled under Joshua (Josh 21:43-45) and understood as typological by Abraham himself (Heb 11:10, 16).",
        ],
        closingStatement:
          "The gospel does not divide humanity into two classes with two destinies. There is 'one Lord, one faith, one baptism' (Eph 4:5). Dispensationalism's two-peoples theology contradicts the heart of Paul's gospel and rebuilds the very wall Christ died to tear down.",
      },
      debateSimLink: "futurist",
      debriefPrompt:
        "Assess the dispensational Israel debate. Did you effectively use Galatians 3:28-29 and Romans 9:6? How did the Futurist respond to the one-olive-tree argument? Were you able to handle the antisemitism accusation with grace and theological precision?",
    },

    // ── Module 5: Literal/Futurist Revelation ───────────────────────────
    {
      id: "mod-futurist-literal-revelation",
      subjectId: "literal-futurist-revelation",
      title: "Revelation — History Unfolded, Not Future Speculation",
      doctrineBrief:
        "Futurists read most of Revelation (chapters 4-22) as describing events in a future 7-year tribulation period and beyond. This approach renders Revelation irrelevant for 1,900+ years of church history and replaces the historicist method — which ties prophecy to verifiable events — with unfalsifiable speculation about the future. The historicist approach, championed by the Reformers and Adventists, reads Revelation as a panoramic sweep of history from John's day to the Second Coming.",
      steelmanArguments: [
        {
          id: "mod5-sa1",
          title: "Revelation's Language Is Too Extreme for History",
          argument:
            "Revelation describes cosmic catastrophes — stars falling, the sun darkened, mountains moved, plagues of supernatural intensity. These descriptions are too extreme to have been fulfilled in ordinary historical events. They must describe a future period of unprecedented divine judgment that the world has never experienced.",
          hiddenAssumptions: [
            "Prophetic/apocalyptic language must be read with wooden literalism rather than as symbolic imagery",
            "Revelation's imagery has no Old Testament prophetic precedent using similar hyperbolic language",
            "History contains no events that correspond to these prophetic symbols",
          ],
          sdaResponse:
            "Apocalyptic literature regularly uses cosmic language for historical events. Isaiah described Babylon's fall: 'the stars of heaven and the constellations thereof shall not give their light: the sun shall be darkened... the moon shall not cause her light to shine' (Isa 13:10). This was fulfilled in 539 BC — no literal cosmic catastrophe occurred. Ezekiel used similar language for Egypt's judgment (Eze 32:7-8). Jesus used it for Jerusalem's destruction (Matt 24:29). The historicist reads Revelation's symbols the way the Bible itself uses them — as apocalyptic imagery for real but historical divine interventions.",
        },
        {
          id: "mod5-sa2",
          title: "Revelation Must Be Read Literally Unless Impossible",
          argument:
            "The golden rule of interpretation is: take the Bible literally unless it is clearly figurative. Revelation describes specific numbers (144,000, 1,000 years, 42 months), specific events (temple desecration, mark of the beast, battle of Armageddon), and specific sequences. These should be taken at face value as future events unless there is a compelling reason to spiritualize them.",
          hiddenAssumptions: [
            "Apocalyptic literature follows the same interpretive rules as historical narrative",
            "'Literal unless impossible' is the correct hermeneutic for symbolic prophecy",
            "Historicist interpretation is 'spiritualizing' rather than applying consistent symbolic decoding",
          ],
          sdaResponse:
            "Revelation itself declares it is symbolic: it was 'signified' (Greek: semaino, communicated through signs/symbols, Rev 1:1). The book opens with Jesus standing among lampstands holding stars — clearly symbolic (Rev 1:20 gives the interpretation). A beast with seven heads, a woman riding a scarlet creature, and a city called 'Babylon' that sits on seven mountains are self-evidently symbolic. The historicist does not 'spiritualize' — rather, they decode symbols using Scripture's own interpretive key (Dan 7:17, 23; Rev 1:20; 17:9-10, 18). The futurist selectively literalizes some symbols while acknowledging others are figurative, producing an inconsistent hermeneutic.",
        },
      ],
      hiddenAssumptions: [
        "Revelation 4-22 has no relevance to the historical church — only to a future tribulation period",
        "Apocalyptic language should be interpreted with wooden literalism rather than symbolic consistency",
        "The historicist method is speculative while the futurist method is straightforward",
        "Revelation's purpose is to describe a 7-year period, not to encourage believers across all ages",
      ],
      mindGames: [
        {
          id: "mod5-mg1",
          name: "Simplicity Deception",
          description:
            "Claiming futurism is the 'plain reading' while portraying historicism as overly complicated and requiring special knowledge. In reality, futurism's elaborate system of dispensations, rapture phases, and prophetic gaps is far more complex.",
          example:
            "'We just take the Bible at face value. Revelation describes future events — plain and simple. Historicists have to create all these complicated historical schemes to make it fit.'",
          detectionTip:
            "Ask: 'Is your prophetic chart — with its rapture, tribulation, 7 seal judgments, 7 trumpet judgments, 7 bowl judgments, 144,000 Jewish evangelists, two witnesses, rebuilt temple, battle of Armageddon, millennium, Gog-Magog, and Great White Throne — really simpler than identifying historical events that have already happened?'",
        },
        {
          id: "mod5-mg2",
          name: "Relevance Claim Monopoly",
          description:
            "Arguing that only the futurist view makes Revelation 'relevant' because it speaks to current events, while historicism supposedly reduces it to dusty history.",
          example:
            "'Historicism makes Revelation a history book. Futurism makes it a living prophecy that's being fulfilled right now. Which view makes the Bible more alive?'",
          detectionTip:
            "Historicism does not reduce Revelation to past history — it shows a continuous prophetic narrative from John to the Second Coming. The three angels' messages of Revelation 14 are being fulfilled RIGHT NOW in the SDA global proclamation. The final events of Revelation (mark of the beast, loud cry, latter rain) are still future in the historicist framework. Historicism makes Revelation relevant to EVERY generation, not just one speculative future generation.",
        },
      ],
      fallacies: [
        {
          id: "mod5-fl1",
          name: "Category Error (Genre Confusion)",
          definition:
            "Applying narrative-historical hermeneutics to apocalyptic literature, treating symbols as if they were journalistic reports of literal future events rather than coded prophetic imagery.",
          example:
            "'Revelation says locusts with human faces and scorpion tails will torment people for 5 months. This must be some kind of future military technology — maybe weaponized drones.'",
          counterMove:
            "Revelation is apocalyptic literature — the same genre as Daniel, Zechariah, and parts of Ezekiel. In this genre, symbols have referents that must be decoded, not literalized. Joel's locusts (Joel 1-2) symbolized invading armies. The beasts of Daniel 7 symbolized empires. Treating Revelation's imagery as literal future technology is a category error that misunderstands the genre.",
        },
        {
          id: "mod5-fl2",
          name: "Unfalsifiability",
          definition:
            "The futurist framework is unfalsifiable — since the events are always 'in the future,' no evidence can disprove them. When predictions fail (Hal Lindsey's 1980s deadline, Y2K, 2012, etc.), the framework simply shifts the timeline forward without consequence.",
          example:
            "'The tribulation hasn't started yet, but it could start at any time. The signs are all around us. We just have to wait.'",
          counterMove:
            "A prophetic system that cannot be tested is not a prophetic system — it is speculation. Historicism's interpretations are tied to verifiable historical events (fall of Rome, rise of papacy, 1,260 years of papal supremacy, the Reformation, the Lisbon earthquake of 1755, the Dark Day of 1780, the great meteor shower of 1833). These can be checked against the historical record. A system that is perpetually 'about to happen' but never does lacks the hallmark of genuine prophecy: verifiable fulfillment.",
        },
      ],
      counterStrategy: {
        subjectId: "literal-futurist-revelation",
        title: "Historicism: Revelation as History's Roadmap",
        sdaPosition:
          "Revelation is a prophetic panorama spanning from John's day to the New Earth, best understood through the historicist method. Its symbols have been progressively fulfilled through verifiable historical events, and its final scenes are being fulfilled now in the three angels' messages and will culminate in Christ's return.",
        keyScriptures: [
          "Rev 1:1 — The Revelation was 'signified' (communicated through symbols)",
          "Rev 1:19 — Things which are, and which shall be hereafter (a sweep of history, not one future period)",
          "Rev 13:5 — The beast's 42 months = 1,260 years of papal dominance (538-1798)",
          "Rev 14:6-12 — The three angels' messages: a present-truth commission being fulfilled NOW",
          "Rev 12:6, 14 — The true church in the wilderness 1,260 years during papal persecution",
        ],
        counterArguments: [
          "Futurism renders Revelation meaningless for 1,900 years of church history. If chapters 4-19 describe only a future 7-year period, Christians from Polycarp to Spurgeon had no prophetic guide.",
          "Historicism produces testable, verifiable interpretations: the fall of Rome, the rise of papal power, the 1,260-year period (538-1798), the Reformation, and the Advent movement all correspond to Revelation's sequence.",
          "Revelation itself says it was 'signified' — communicated in symbols (Rev 1:1). The futurist hermeneutic of selective literalism contradicts the book's own self-identification.",
          "The futurist framework is perpetually unfalsifiable — events are always 'about to happen.' Historicism's fulfillments can be checked against the historical record.",
          "The three angels' messages (Rev 14:6-12) are a present-truth call that only makes sense in the historicist framework — they call people to worship the Creator (Sabbath), come out of Babylon (fallen Protestantism), and reject the mark of the beast (Sunday legislation).",
        ],
        closingStatement:
          "Revelation is not a sealed book about a distant future — it is an open prophetic panorama that has guided God's people through every era of history. The historicist method, championed by the Reformers and refined by the Advent movement, unlocks Revelation as a verifiable roadmap from Patmos to Paradise. Futurism, born of Jesuit counter-Reformation strategy, pushes this light into the darkness of speculative futurism where it can never be tested or confirmed.",
      },
      debateSimLink: "futurist",
      debriefPrompt:
        "Evaluate the Revelation interpretation debate. Did you demonstrate the superiority of historicism's testable, verifiable approach over futurism's unfalsifiable speculation? Were you able to show that the three angels' messages only make sense in a historicist framework? How effectively did you address the Jesuit origin of the futurist hermeneutic?",
    },
  ],
};
