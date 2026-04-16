export interface InterpretationView {
  summary: string;
  identification: string;
  timeframe: string;
  keyArguments: string[];
  weaknesses: string[];
}

export interface ProphecyComparison {
  id: string;
  title: string;
  scriptureRef: string;
  kjvKeyVerses: string[];
  category: "daniel" | "revelation";
  historicist: InterpretationView;
  futurist: InterpretationView;
  preterist: InterpretationView;
  whyHistoricistWins: string;
}

export const PROPHECY_COMPARISONS: ProphecyComparison[] = [
  {
    id: "daniel-2",
    title: "Daniel 2 — The Great Image",
    scriptureRef: "Daniel 2:31-45",
    kjvKeyVerses: [
      "Thou, O king, art a king of kings: for the God of heaven hath given thee a kingdom... Thou art this head of gold. — Daniel 2:37-38",
      "And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed — Daniel 2:44",
    ],
    category: "daniel",
    historicist: {
      summary: "The image represents successive world empires from Babylon to the end of time — a continuous prophetic timeline.",
      identification: "Head of gold = Babylon (605-539 BC). Chest of silver = Medo-Persia (539-331 BC). Belly of brass = Greece (331-168 BC). Legs of iron = Rome (168 BC – 476 AD). Feet of iron/clay = Divided Europe (476 AD – Second Coming). Stone = Christ's eternal kingdom.",
      timeframe: "605 BC to the Second Coming of Christ — an unbroken prophetic chain.",
      keyArguments: [
        "Daniel himself identifies Babylon as the head of gold (Dan 2:38).",
        "History confirms the exact sequence: Babylon → Medo-Persia → Greece → Rome → Divided Europe.",
        "The stone strikes the feet — Christ returns when Europe is still divided, not during a single empire.",
        "No single world empire has succeeded Rome, exactly as predicted — Europe remains divided to this day.",
        "The Reformers unanimously held this interpretation, recognizing the prophetic timeline.",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "The image mostly represents ancient kingdoms, but the feet/toes refer to a future revived Roman Empire during a 7-year tribulation.",
      identification: "Same ancient kingdoms but the feet = a future 10-nation confederacy under Antichrist.",
      timeframe: "Largely ancient with a gap of 2000+ years before the feet are fulfilled in the future.",
      keyArguments: [
        "The toes represent a future 10-nation confederacy.",
        "The stone kingdom has not yet been established.",
        "A revived Roman Empire will emerge in the last days.",
      ],
      weaknesses: [
        "Requires a 2000+ year 'gap' nowhere mentioned in the text.",
        "The image is clearly continuous — no break between legs and feet.",
        "Invented by Francisco Ribera (1585), a Jesuit priest, to deflect Reformation identification of papal Rome.",
        "Europe has been divided for 1500+ years — there is no need for a 'future' fulfillment.",
      ],
    },
    preterist: {
      summary: "The entire prophecy was fulfilled in ancient times, with the stone representing Christ's first advent.",
      identification: "Same ancient kingdoms, but the stone = the church established at Christ's first coming.",
      timeframe: "Entirely fulfilled by 70 AD.",
      keyArguments: [
        "Christ's kingdom (the church) was established 'in the days of these kings' — the Roman Caesars.",
        "The stone grew to fill the earth as Christianity spread.",
      ],
      weaknesses: [
        "The stone strikes the image and destroys ALL kingdoms simultaneously — this did not happen at Christ's first coming.",
        "The kingdom described fills the WHOLE earth — the church at Pentecost did not do this.",
        "Rome was not yet divided into iron/clay when Christ came — the feet phase had not yet begun.",
        "Invented by Luis de Alcazar (1614), a Jesuit, specifically to counter Reformation prophetic teaching.",
      ],
    },
    whyHistoricistWins: "Daniel 2 is the foundational prophecy of historicism. The text itself names Babylon, history confirms the exact succession, and the image is explicitly continuous — no gaps. The feet of iron and clay perfectly describe post-Roman Europe: attempts at unity (marriages, alliances, EU) always fail because 'they shall not cleave one to another' (Dan 2:43). The stone 'cut out without hands' (Dan 2:45) is the Second Coming, not the first — it destroys all earthly kingdoms simultaneously. Both futurism and preterism were invented by Jesuit scholars specifically to break this prophetic chain that identified Rome as the fourth kingdom and the papacy as the power that followed.",
  },
  {
    id: "daniel-7-little-horn",
    title: "Daniel 7 — The Little Horn",
    scriptureRef: "Daniel 7:7-8, 19-27",
    kjvKeyVerses: [
      "I considered the horns, and, behold, there came up among them another little horn, before whom there were three of the first horns plucked up by the roots — Daniel 7:8",
      "And he shall speak great words against the most High, and shall wear out the saints of the most High, and think to change times and laws — Daniel 7:25",
      "And they shall be given into his hand until a time and times and the dividing of time — Daniel 7:25",
    ],
    category: "daniel",
    historicist: {
      summary: "The little horn is the papal system that arose from the divisions of Rome, exactly matching every prophetic identifier.",
      identification: "Papal Rome — the Bishop of Rome who rose to political/religious supremacy among the 10 barbarian kingdoms of divided Western Rome.",
      timeframe: "538 AD (Justinian's decree giving the pope civil authority) to 1798 AD (Berthier's arrest of Pope Pius VI) = 1260 years (time, times, half a time).",
      keyArguments: [
        "Arose 'among' the 10 horns (barbarian kingdoms) of divided Rome — the papacy arose among these kingdoms.",
        "Uprooted 3 horns: the Heruli (493 AD), Vandals (534 AD), and Ostrogoths (538 AD) — all Arian tribes opposing papal supremacy.",
        "'Eyes like the eyes of man' — a single human leader (the pope) directing the system.",
        "'Speak great words against the most High' — papal claims of being 'Vicar of Christ,' forgiving sins, infallibility.",
        "'Wear out the saints' — the Inquisition, persecution of Waldenses, Albigenses, Huguenots — an estimated 50-100 million martyrs.",
        "'Think to change times and laws' — changed the Sabbath from Saturday to Sunday, removed the second commandment, split the tenth.",
        "1260 years: 538 AD + 1260 = 1798 AD — the exact year the pope received a 'deadly wound.'",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "The little horn is a future individual Antichrist who will arise during a 7-year tribulation.",
      identification: "A future individual political leader — the 'Antichrist' — who makes a covenant with Israel.",
      timeframe: "A future 7-year tribulation period, with the 1260 days being literal 3.5 years.",
      keyArguments: [
        "The Antichrist is a single future individual, not a system.",
        "The 1260 days are literal, not prophetic year-for-a-day.",
        "This aligns with a pre-tribulation rapture theology.",
      ],
      weaknesses: [
        "Ignores 1500+ years of church history where the papacy perfectly fulfilled every identifier.",
        "The year-day principle is established in Scripture: Ezekiel 4:6, Numbers 14:34.",
        "A future individual cannot 'wear out the saints' for 1260 literal days (3.5 years) in the way centuries of persecution did.",
        "This interpretation was designed by Ribera specifically to remove the papal identification the Reformers taught.",
        "Every major Reformer — Luther, Calvin, Knox, Wesley, Huss — identified the papacy as the little horn.",
      ],
    },
    preterist: {
      summary: "The little horn was Antiochus IV Epiphanes, a Seleucid king who desecrated the temple in 167 BC.",
      identification: "Antiochus IV Epiphanes (175-164 BC).",
      timeframe: "167-164 BC — Antiochus's persecution of the Jews.",
      keyArguments: [
        "Antiochus arose from one of the divisions of Greece.",
        "He persecuted the Jews and desecrated the temple.",
        "The Maccabean revolt ended his oppression.",
      ],
      weaknesses: [
        "Antiochus arose from the THIRD beast (Greece), but Daniel 7 says the little horn comes from the FOURTH beast (Rome).",
        "Antiochus did not uproot 3 of the 10 horns — he predates the division of Rome entirely.",
        "Antiochus's persecution lasted about 3 years, not 1260 prophetic years.",
        "This view makes Daniel's longest and most detailed prophecy about a relatively minor historical figure.",
        "Alcazar's preterist framework was created to shield the papacy from prophetic identification.",
      ],
    },
    whyHistoricistWins: "The little horn of Daniel 7 has 11 distinct identifying marks, and the papal system matches every single one. No other power in history arose among the 10 divisions of Rome, uprooted exactly 3 Arian kingdoms, had a single human leader ('eyes like a man'), spoke blasphemous claims against God, persecuted the saints for centuries, attempted to change God's law (Sabbath to Sunday), and ruled for exactly 1260 years (538-1798). The Reformers recognized this unanimously. Both Ribera's futurism and Alcazar's preterism were Jesuit counter-Reformation inventions designed to deflect this identification. The prophecy is not about a future individual or an ancient Greek king — it is about a system that ruled for over a millennium and still claims the same authority today.",
  },
  {
    id: "daniel-8-9-2300-days",
    title: "Daniel 8-9 — The 2300 Days & 70 Weeks",
    scriptureRef: "Daniel 8:14; 9:24-27",
    kjvKeyVerses: [
      "Unto two thousand and three hundred days; then shall the sanctuary be cleansed — Daniel 8:14",
      "Seventy weeks are determined upon thy people — Daniel 9:24",
      "Know therefore and understand, that from the going forth of the commandment to restore and to build Jerusalem unto the Messiah the Prince shall be seven weeks, and threescore and two weeks — Daniel 9:25",
    ],
    category: "daniel",
    historicist: {
      summary: "The 2300 days (years) began in 457 BC with Artaxerxes' decree. The 70 weeks (490 years) are 'cut off' from the 2300 for Israel. The remaining 1810 years extend to 1844 AD — the beginning of the heavenly sanctuary's cleansing (the investigative judgment).",
      identification: "457 BC + 2300 years = 1844 AD. The 70 weeks (490 years) end in 34 AD with the stoning of Stephen. The 69 weeks (483 years) reach 27 AD — Christ's baptism. The middle of the 70th week (31 AD) = the crucifixion.",
      timeframe: "457 BC to 1844 AD for the 2300 days. 457 BC to 34 AD for the 70 weeks.",
      keyArguments: [
        "The Hebrew word 'determined' (chathak) in Dan 9:24 literally means 'cut off' — the 70 weeks are cut from the larger 2300-day period.",
        "The decree of Artaxerxes in 457 BC (Ezra 7) is the only decree that commands the RESTORATION of Jerusalem (not just the temple).",
        "457 BC + 483 years = 27 AD — the exact year of Christ's baptism, confirmed by Luke 3:1 (15th year of Tiberius).",
        "457 BC + 490 years = 34 AD — the stoning of Stephen, the gospel going to the Gentiles.",
        "The 'sanctuary' in Daniel 8:14 is the HEAVENLY sanctuary (Hebrews 8:1-2), cleansed by Christ's high priestly ministry.",
        "1844 marks the transition from the Holy Place to the Most Holy Place ministry — the antitypical Day of Atonement.",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "The 70th week is separated from the first 69 and placed in the future as a 7-year tribulation. The 2300 days are sometimes literal or applied to Antiochus.",
      identification: "The 70th week = a future 7-year tribulation. The 'prince' who confirms a covenant is the Antichrist, not Christ.",
      timeframe: "69 weeks fulfilled at Christ's triumphal entry, then a 2000+ year gap before the 70th week.",
      keyArguments: [
        "The 70th week is the future tribulation period.",
        "The Antichrist confirms a covenant with Israel for 7 years.",
        "The 2300 days may refer to Antiochus's desecration.",
      ],
      weaknesses: [
        "Inserting a 2000-year gap between the 69th and 70th week has zero textual basis — the Hebrew is consecutive.",
        "Daniel 9:27 says 'HE shall confirm the covenant' — the nearest antecedent is 'Messiah the Prince,' not an antichrist.",
        "Christ confirmed the covenant with Israel for 7 years (27-34 AD) and was 'cut off' in the midst of the week (31 AD).",
        "The futurist 70th week was invented by Ribera to create a future Antichrist, removing the papal identification.",
        "Separating the 70 weeks from the 2300 days destroys the mathematical unity of the prophecy.",
      ],
    },
    preterist: {
      summary: "Both prophecies were fulfilled by Antiochus Epiphanes and/or the destruction of Jerusalem in 70 AD.",
      identification: "The 2300 days = Antiochus's temple desecration. The 70 weeks end with Jerusalem's destruction.",
      timeframe: "All fulfilled by 70 AD.",
      keyArguments: [
        "Antiochus desecrated the temple for approximately 2300 literal days.",
        "The destruction of Jerusalem in 70 AD fulfilled the 70 weeks.",
      ],
      weaknesses: [
        "Antiochus's desecration lasted about 1100 days (not 2300) — the math doesn't work even for literal days.",
        "The 70 weeks prophecy pinpoints Messiah's coming — preterism undermines its messianic significance.",
        "Daniel 9:24 lists 6 purposes, including 'to anoint the most Holy' — this points to Christ, not 70 AD destruction.",
        "The year-day principle makes 2300 literal days theologically insignificant compared to 2300 years of prophetic history.",
      ],
    },
    whyHistoricistWins: "This is perhaps the most mathematically precise prophecy in Scripture. Starting from Artaxerxes' decree in 457 BC, the 70 weeks (490 years) pinpoint Christ's baptism (27 AD), crucifixion (31 AD), and the gospel going to Gentiles (34 AD) with stunning accuracy. The remaining 1810 years of the 2300-day prophecy reach 1844 AD, pointing to the beginning of Christ's final high priestly ministry in the heavenly sanctuary — the antitypical Day of Atonement. Futurism's insertion of a 2000-year gap and preterism's application to Antiochus both destroy this mathematical precision. The prophecy is a unified timeline confirmed by history and by Christ Himself.",
  },
  {
    id: "daniel-11-12",
    title: "Daniel 11-12 — The Kings of North & South",
    scriptureRef: "Daniel 11:1-12:4",
    kjvKeyVerses: [
      "And at the time of the end shall the king of the south push at him: and the king of the north shall come against him like a whirlwind — Daniel 11:40",
      "And at that time shall Michael stand up, the great prince which standeth for the children of thy people — Daniel 12:1",
    ],
    category: "daniel",
    historicist: {
      summary: "A continuous prophetic narrative from Medo-Persia through Greece, Rome (pagan and papal), to the time of the end — culminating in Michael standing up (Christ's return).",
      identification: "Kings of North and South = powers contending for control of God's people. Transitions from Persia → Greece → Ptolemies/Seleucids → Pagan Rome → Papal Rome → End-time events.",
      timeframe: "539 BC through the Second Coming — unbroken prophetic history.",
      keyArguments: [
        "Daniel 11:2-4 precisely describes Persia's 4 kings and Alexander's conquest and division.",
        "The Ptolemaic-Seleucid wars (vv. 5-15) match history with extraordinary precision.",
        "The transition to Rome (vv. 16+) follows the same geographical and theological trajectory.",
        "The 'abomination of desolation' (v. 31) points to papal Rome's establishment.",
        "Daniel 12:1-4 describes the final events: Michael stands up, time of trouble, resurrection.",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "Most of Daniel 11 is historical, but the 'king of the north' in the end becomes a future Antichrist during the tribulation.",
      identification: "A future Antichrist figure who attacks Israel in the last days.",
      timeframe: "Largely historical until a jump to the future tribulation.",
      keyArguments: [
        "The king of the north becomes a future political-military Antichrist.",
        "The 'time of trouble' is the great tribulation.",
      ],
      weaknesses: [
        "Arbitrarily decides where 'history' stops and 'future' begins with no textual marker.",
        "Ignores the papal dimension that the Reformers consistently identified.",
        "Creates an unnecessary gap in a prophecy that reads as continuous narrative.",
      ],
    },
    preterist: {
      summary: "The entire prophecy was fulfilled by the Maccabean period, with Antiochus Epiphanes as the primary figure.",
      identification: "Antiochus Epiphanes is the primary villain; the prophecy ends with the Maccabean revolt.",
      timeframe: "Fulfilled by 164 BC.",
      keyArguments: [
        "The Ptolemaic-Seleucid conflicts match verses 5-20 well.",
        "Antiochus's persecution matches several descriptions.",
      ],
      weaknesses: [
        "Cannot account for Daniel 11:36-45 — Antiochus died in Persia, not 'between the seas and the glorious holy mountain.'",
        "Daniel 12:1-4 clearly describes the final resurrection — this did not happen in 164 BC.",
        "Makes Daniel a failed prophet if the resurrection prediction in 12:2 is about Maccabean events.",
      ],
    },
    whyHistoricistWins: "Daniel 11 is one of the most detailed predictive prophecies ever written. Its precision in describing the Persian-Greek-Ptolemaic-Seleucid conflicts is acknowledged by all scholars. The historicist view follows the natural continuation of this narrative through Rome (pagan and papal) to the end of time. The prophecy's climax in Daniel 12:1-4 — Michael standing up, the time of trouble, the resurrection — clearly points to eschatological events, not Maccabean history. The continuous flow of the prophecy from known history into future events is the most natural reading of the text.",
  },
  {
    id: "rev-12-woman",
    title: "Revelation 12 — The Woman, Dragon & Child",
    scriptureRef: "Revelation 12:1-17",
    kjvKeyVerses: [
      "And there appeared a great wonder in heaven; a woman clothed with the sun, and the moon under her feet, and upon her head a crown of twelve stars — Revelation 12:1",
      "And the woman fled into the wilderness, where she hath a place prepared of God, that they should feed her there a thousand two hundred and threescore days — Revelation 12:6",
      "And the dragon was wroth with the woman, and went to make war with the remnant of her seed, which keep the commandments of God, and have the testimony of Jesus Christ — Revelation 12:17",
    ],
    category: "revelation",
    historicist: {
      summary: "The woman represents God's true church throughout history. The dragon (Satan working through pagan Rome) tried to destroy Christ. The church fled into the wilderness during the 1260 years of papal persecution. The remnant at the end keeps God's commandments and has the testimony of Jesus.",
      identification: "Woman = God's true church. Dragon = Satan/pagan Rome. Man child = Christ. Wilderness = hiding during papal persecution. Remnant = end-time commandment-keeping church.",
      timeframe: "Christ's birth through the 1260 years (538-1798 AD) to the end-time remnant church.",
      keyArguments: [
        "The woman is NOT Mary — she flees into the wilderness for 1260 years after the child is caught up to God.",
        "The 1260 days = 1260 years (year-day principle) = 538-1798 AD, the period of papal supremacy.",
        "During this time, faithful Christians (Waldenses, Albigenses, etc.) hid 'in the wilderness' — remote mountain valleys.",
        "The 'remnant of her seed' (v. 17) keeps the commandments of God (including the Sabbath) and has the testimony of Jesus (the spirit of prophecy, Rev 19:10).",
        "This perfectly identifies the end-time Seventh-day Adventist movement that arose after 1798.",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "The woman is Israel (not the church). The 1260 days are literal 3.5 years during a future tribulation when Israel flees from the Antichrist.",
      identification: "Woman = national Israel. Dragon = Satan through the future Antichrist. The 1260 days = literal future tribulation.",
      timeframe: "Historically at Christ's birth, then a jump to the future tribulation.",
      keyArguments: [
        "The 12 stars represent the 12 tribes of Israel (from Joseph's dream, Genesis 37:9).",
        "Israel will flee into the wilderness during the tribulation.",
      ],
      weaknesses: [
        "Makes the 'remnant of her seed' Jewish converts, but they keep ALL the commandments of God — including the Sabbath — which futurists usually say is abolished.",
        "Requires another arbitrary gap between verse 5 and verse 6.",
        "The church is repeatedly symbolized as a woman in Scripture (Eph 5:25-27, 2 Cor 11:2).",
        "Literal 3.5 years cannot account for centuries of actual Christian persecution.",
      ],
    },
    preterist: {
      summary: "The entire chapter describes events surrounding Christ's birth, the early church's persecution under Rome, and the destruction of Jerusalem in 70 AD.",
      identification: "Woman = Israel/early church. Dragon = pagan Roman Empire. Everything fulfilled by 70 AD.",
      timeframe: "First century — fulfilled by the fall of Jerusalem.",
      keyArguments: [
        "Pagan Rome (the dragon) tried to kill the Christ child (Herod).",
        "The early church fled persecution in the first century.",
      ],
      weaknesses: [
        "The 1260 days/years of wilderness preservation cannot be squeezed into a few decades of first-century history.",
        "Verse 17 describes a REMNANT with specific end-time characteristics — this did not exist in the first century.",
        "The 'war with the remnant' implies an ongoing, end-time conflict, not a completed historical event.",
        "Ignores 1800 years of church history between the first century and the present.",
      ],
    },
    whyHistoricistWins: "Revelation 12 provides a panoramic view of the great controversy from Christ's birth to the end of time. The 1260 years of wilderness preservation (538-1798) are confirmed by the parallel prophecies in Daniel 7:25 and Revelation 13:5. The remnant of verse 17 has two specific identifying marks: they keep ALL the commandments of God (including the fourth — the Sabbath) and they have the testimony of Jesus Christ (identified in Revelation 19:10 as the spirit of prophecy). This is not about national Israel or first-century Christians — it is about God's faithful, commandment-keeping people throughout the Christian era and especially at the end of time.",
  },
  {
    id: "rev-13-beast",
    title: "Revelation 13 — The Beast from the Sea",
    scriptureRef: "Revelation 13:1-10",
    kjvKeyVerses: [
      "And I stood upon the sand of the sea, and saw a beast rise up out of the sea, having seven heads and ten horns — Revelation 13:1",
      "And there was given unto him a mouth speaking great things and blasphemies; and power was given unto him to continue forty and two months — Revelation 13:5",
      "He that leadeth into captivity shall go into captivity: he that killeth with the sword must be killed with the sword — Revelation 13:10",
    ],
    category: "revelation",
    historicist: {
      summary: "The sea beast is papal Rome — a composite of Daniel 7's four beasts, combining political and religious authority. It ruled for 42 months (1260 years) and received a deadly wound in 1798.",
      identification: "The papacy — the Roman Catholic religio-political system. The beast combines features of Daniel's lion (Babylon), bear (Medo-Persia), leopard (Greece), and dreadful beast (Rome).",
      timeframe: "538 AD to 1798 AD (42 months = 1260 years), with the deadly wound healing in modern times.",
      keyArguments: [
        "Rises from the 'sea' (peoples, nations — Rev 17:15) = arose from populated Europe.",
        "Has 7 heads and 10 horns = inherits all previous world empire authority.",
        "Composite of Daniel 7's four beasts = absorbs characteristics of all preceding empires.",
        "'Who is like unto the beast?' (v. 4) = the papal claim to universal spiritual authority.",
        "Blasphemy = claims divine prerogatives (forgiving sins, vicar of Christ, infallibility).",
        "42 months = 1260 years (538-1798 AD), matching Daniel 7:25.",
        "The 'deadly wound' (v. 3) = Napoleon's general Berthier arresting Pope Pius VI in 1798.",
        "The wound 'was healed' = restoration of papal political influence (1929 Lateran Treaty onward).",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "A future Antichrist figure who will rule the world for literal 3.5 years during the great tribulation.",
      identification: "A future individual world dictator — the Antichrist.",
      timeframe: "A future 7-year tribulation period.",
      keyArguments: [
        "The beast is a future individual, not a historical system.",
        "The 42 months are literal (3.5 years).",
        "This occurs after a pre-tribulation rapture of the church.",
      ],
      weaknesses: [
        "Ignores the fact that the beast is a COMPOSITE of Daniel's four beasts — it represents a SYSTEM, not a single person.",
        "Literal 42 months (3.5 years) cannot account for centuries of real-world persecution.",
        "Every Reformer identified this beast as the papacy — futurism was designed by Ribera to deflect this.",
        "A future individual ruling 3.5 years does not match the scope and scale of the prophecy's description.",
        "The deadly wound and its healing describe institutional events spanning centuries, not a single person's career.",
      ],
    },
    preterist: {
      summary: "The beast was the pagan Roman Empire, particularly Nero Caesar. The prophecy was fulfilled by 70 AD.",
      identification: "Nero Caesar (54-68 AD) or the Roman Empire generally.",
      timeframe: "First century — fulfilled by the fall of Jerusalem.",
      keyArguments: [
        "Nero's name in Hebrew gematria = 666.",
        "Nero persecuted Christians severely.",
        "The Roman Empire rose from the 'sea' of Mediterranean peoples.",
      ],
      weaknesses: [
        "Nero ruled for only 14 years, not 42 prophetic months (1260 years).",
        "The 'deadly wound' that was 'healed' doesn't fit Nero — he committed suicide and Rome continued without interruption.",
        "The beast receives worship from 'all that dwell upon the earth' — this did not happen with Nero.",
        "The composite beast imagery (lion, bear, leopard) points to a power that ABSORBS all previous empires — the papacy inherited Babylon's paganism, Persia's priestly system, Greece's philosophy, and Rome's structure.",
      ],
    },
    whyHistoricistWins: "Revelation 13's sea beast is the prophetic capstone of Daniel 7. The composite imagery — combining features of ALL four of Daniel's beasts — shows that this is a power that absorbs and continues the essence of every preceding world empire. The papacy inherited Babylon's sun worship, Persia's priestly hierarchy, Greece's philosophy, and Rome's political structure. The 42 months (1260 years from 538-1798) match Daniel 7:25 precisely. The deadly wound of 1798 and its ongoing healing fit no other power in history. The Reformers — Luther, Calvin, Knox, Cranmer, Wesley — unanimously identified this beast as the papal system. Ribera's futurist reinterpretation was specifically designed to break this identification.",
  },
  {
    id: "rev-14-three-angels",
    title: "Revelation 14 — The Three Angels' Messages",
    scriptureRef: "Revelation 14:6-12",
    kjvKeyVerses: [
      "Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters — Revelation 14:7",
      "Babylon is fallen, is fallen, that great city, because she made all nations drink of the wine of the wrath of her fornication — Revelation 14:8",
      "Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus — Revelation 14:12",
    ],
    category: "revelation",
    historicist: {
      summary: "Three sequential, end-time proclamations to the world: (1) the judgment has begun — worship the Creator, (2) Babylon (apostate Christianity) has fallen, (3) warning against the beast's mark. These messages define the mission of God's end-time remnant church.",
      identification: "First angel = the judgment-hour message (1844 onward, pointing to the heavenly sanctuary cleansing). Second angel = the fall of Babylon (apostate Protestantism joining with Rome). Third angel = warning against the mark of the beast (Sunday legislation vs. Sabbath truth).",
      timeframe: "1844 onward — the final proclamation before Christ's return.",
      keyArguments: [
        "The first angel's language ('worship him that made heaven and earth') echoes the fourth commandment (Exodus 20:11) — a call to Sabbath worship.",
        "'The hour of his judgment is come' = the investigative judgment beginning in 1844.",
        "Babylon = the confused mixture of biblical truth and pagan tradition in apostate Christianity.",
        "The 'mark of the beast' vs. 'the seal of God' = Sunday observance (Rome's mark of authority) vs. Sabbath-keeping (God's seal).",
        "Verse 12 defines the remnant: commandment-keepers with the faith of Jesus.",
        "These messages are sequential and progressive — matching the Millerite movement (1st angel), 1844 disappointment (2nd angel), and Sabbath truth (3rd angel).",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "Three literal angels who will appear during the future tribulation to warn the world.",
      identification: "Literal angelic proclamations during the 7-year tribulation after the rapture.",
      timeframe: "During the future great tribulation.",
      keyArguments: [
        "These are literal angels who will visibly appear.",
        "Babylon is a future world religious system.",
        "The mark of the beast is a future technology (chip, tattoo, etc.).",
      ],
      weaknesses: [
        "Angels in Revelation consistently represent movements and messages, not literal hovering beings.",
        "If these are future (post-rapture), they are irrelevant to Christians today — removing urgency from a message that demands response NOW.",
        "Reducing the 'mark of the beast' to a technology (chip/tattoo) ignores the theological content: it's about WORSHIP, not technology.",
        "The first angel's message echoes the Sabbath commandment — futurists who reject the Sabbath cannot consistently interpret this message.",
      ],
    },
    preterist: {
      summary: "These messages applied to the first-century church's conflict with the Roman Empire.",
      identification: "Warnings to first-century Christians about emperor worship and Roman persecution.",
      timeframe: "First century — fulfilled by the fall of the Roman Empire.",
      keyArguments: [
        "Babylon = Rome, the persecutor of early Christians.",
        "The mark was related to emperor worship.",
      ],
      weaknesses: [
        "The messages go to 'every nation, and kindred, and tongue, and people' — the first-century church did not reach the entire world.",
        "The 'hour of his judgment' implies a specific prophetic timeframe, not a general first-century event.",
        "The mark/seal distinction is about the end-time Sabbath/Sunday conflict — a non-issue in the first century.",
        "Preterism robs these messages of their present-day urgency and application.",
      ],
    },
    whyHistoricistWins: "The three angels' messages are the most urgent proclamation in all of Scripture — God's final appeal to humanity before Christ's return. The first angel's call to 'worship him that made heaven and earth' directly quotes the fourth commandment, pointing to the Sabbath as the test of true worship. The judgment-hour message connects to Daniel 8:14 and 1844. Babylon's fall describes the progressive apostasy of Christianity that mixed biblical truth with pagan traditions. The third angel's warning about the mark of the beast identifies the final conflict: the beast's counterfeit day of worship (Sunday) versus God's seal (the Sabbath). These are not future post-rapture messages or ancient first-century warnings — they are present truth for TODAY.",
  },
  {
    id: "rev-17-harlot",
    title: "Revelation 17 — The Harlot of Babylon",
    scriptureRef: "Revelation 17:1-18",
    kjvKeyVerses: [
      "MYSTERY, BABYLON THE GREAT, THE MOTHER OF HARLOTS AND ABOMINATIONS OF THE EARTH — Revelation 17:5",
      "And the woman was arrayed in purple and scarlet colour, and decked with gold and precious stones and pearls — Revelation 17:4",
      "And the woman which thou sawest is that great city, which reigneth over the kings of the earth — Revelation 17:18",
    ],
    category: "revelation",
    historicist: {
      summary: "The harlot is the papal system — a corrupt religious power that has fornicated with the kings of the earth. She sits on the beast (uses secular powers to enforce her will) and is 'the mother of harlots' (Protestant churches that retain her false doctrines are her daughters).",
      identification: "The Roman Catholic papacy — 'that great city which reigneth over the kings of the earth' (Rome). Purple and scarlet = the official colors of cardinals and bishops. Gold, precious stones, pearls = the Vatican's immense wealth.",
      timeframe: "From the establishment of papal supremacy through the end of time.",
      keyArguments: [
        "'Sitteth upon many waters' (v. 1) = rules over peoples and nations (v. 15).",
        "'Kings of the earth have committed fornication with her' = the union of church and state throughout medieval Europe.",
        "Purple and scarlet = cardinal and bishop vestments. Gold and jewels = Vatican wealth.",
        "'Mother of harlots' = Protestant churches that retain Sunday worship, immortality of the soul, and other papal doctrines are her 'daughters.'",
        "'Drunken with the blood of the saints' (v. 6) = the Inquisition and centuries of persecution.",
        "'That great city which reigneth over the kings of the earth' (v. 18) = Rome — the only city that has reigned over kings.",
        "The 7 mountains (v. 9) = Rome is famously built on 7 hills.",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "A future one-world religion or the literal rebuilt city of Babylon during the tribulation.",
      identification: "Either a future ecumenical world religion or literal rebuilt Babylon in Iraq.",
      timeframe: "During the future 7-year tribulation.",
      keyArguments: [
        "A future global religious system will control the world.",
        "Some believe literal Babylon will be rebuilt.",
      ],
      weaknesses: [
        "No other city on earth has 'reigned over the kings of the earth' like Rome has.",
        "The description matches the papal system in exact detail — colors, wealth, persecution, city on 7 hills.",
        "Literal Babylon in Iraq has never been rebuilt and shows no signs of becoming a world-ruling city.",
        "Futurism's deflection from Rome was Ribera's explicit goal.",
      ],
    },
    preterist: {
      summary: "The harlot was pagan Rome or Jerusalem, destroyed in 70 AD.",
      identification: "Either pagan Rome or apostate Jerusalem.",
      timeframe: "First century — destroyed by 70 AD or the fall of Rome.",
      keyArguments: [
        "Pagan Rome persecuted Christians.",
        "Jerusalem 'killed the prophets' and could be called a harlot.",
      ],
      weaknesses: [
        "If Babylon = Jerusalem, then who is the beast she rides? Jerusalem had no beast to ride — she was subject to Rome.",
        "The description of purple, scarlet, gold, and jewels matches the Vatican, not first-century Jerusalem.",
        "'Mother of harlots' implies daughter churches — Judaism did not spawn 'daughter' religions in the way the papacy spawned Protestant denominations that retained her doctrines.",
        "The harlot's influence over 'all nations' far exceeds anything first-century Jerusalem achieved.",
      ],
    },
    whyHistoricistWins: "Revelation 17 is one of the most specific prophetic identifications in Scripture. The woman (a church, per Jeremiah 6:2 and 2 Cor 11:2) sits on a scarlet beast (uses state power), is dressed in purple and scarlet (cardinal and bishop colors), is adorned with gold, precious stones, and pearls (Vatican wealth), is drunk with the blood of saints (Inquisition), is called 'Mother of Harlots' (Protestant churches retaining her doctrines are her daughters), sits on 7 mountains (Rome's 7 hills), and is 'that great city which reigneth over the kings of the earth' (Rome). No other institution in human history matches every single identifier. The Reformers knew this. The Jesuits created futurism and preterism specifically to obscure it.",
  },
  {
    id: "rev-20-millennium",
    title: "Revelation 20 — The Millennium",
    scriptureRef: "Revelation 20:1-10",
    kjvKeyVerses: [
      "And I saw an angel come down from heaven, having the key of the bottomless pit and a great chain in his hand. And he laid hold on the dragon... and bound him a thousand years — Revelation 20:1-2",
      "Blessed and holy is he that hath part in the first resurrection: on such the second death hath no power — Revelation 20:6",
      "And when the thousand years are expired, Satan shall be loosed out of his prison — Revelation 20:7",
    ],
    category: "revelation",
    historicist: {
      summary: "The millennium is a literal 1000-year period AFTER the Second Coming. The righteous are in heaven, the earth is desolate, Satan is bound by circumstances (no one to tempt). After the 1000 years: the wicked are resurrected, the New Jerusalem descends, Satan leads a final assault, and fire from God destroys sin and sinners forever.",
      identification: "The 'bottomless pit' (abyssos) = the desolate earth (same word used in Genesis 1:2 LXX for the formless, void earth). Satan is 'bound' by the circumstance of having no living humans to deceive. The 'first resurrection' = the righteous raised at Christ's coming. The 'second death' = final, permanent destruction in the lake of fire.",
      timeframe: "From the Second Coming to the final destruction of sin — a literal 1000 years.",
      keyArguments: [
        "Two literal resurrections separated by 1000 years: the righteous at the beginning, the wicked at the end.",
        "During the millennium, the saints are in heaven judging (1 Cor 6:2-3, Rev 20:4) — reviewing God's justice.",
        "The earth is desolate — Jeremiah 4:23-26 describes it: 'without form and void' (same language as Genesis 1:2).",
        "Satan is bound 'by circumstances' — a desolate earth with no one to tempt.",
        "After the 1000 years: the Holy City descends (Rev 21:2), the wicked are raised, Satan deceives them one last time, and fire from God destroys them (Rev 20:9).",
        "This is the antitypical scapegoat ceremony — Satan, like Azazel (Lev 16:21-22), bears the final responsibility for sin.",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "A literal 1000-year reign of Christ ON EARTH before the final judgment. The righteous reign with Christ from Jerusalem.",
      identification: "Christ reigns physically from Jerusalem for 1000 years. Israel is restored, the temple is rebuilt, and the earth experiences peace.",
      timeframe: "After the Second Coming but before the eternal state — Christ reigns on the present earth.",
      keyArguments: [
        "Premillennial dispensationalists see Christ ruling from a literal earthly throne.",
        "Old Testament promises to Israel are literally fulfilled during this period.",
        "The temple in Ezekiel 40-48 is literally rebuilt.",
      ],
      weaknesses: [
        "Revelation 20 never mentions Christ on earth during the millennium — the saints are in heaven (Rev 20:4, 'thrones' are in heaven).",
        "Rebuilding a temple with animal sacrifices AFTER Christ's perfect sacrifice contradicts Hebrews 7-10 entirely.",
        "The earth is described as desolate (the 'bottomless pit'), not a paradise under Christ's rule.",
        "This view requires a return to the Old Covenant system that the New Testament declares obsolete (Heb 8:13).",
      ],
    },
    preterist: {
      summary: "The millennium is symbolic — it represents the church age, the current era of Christ's spiritual reign through the church (amillennialism).",
      identification: "The millennium = the entire church age from Christ's first coming to His second. The 'first resurrection' is spiritual (conversion). Satan is 'bound' in the sense that the gospel restrains his power.",
      timeframe: "From Christ's first coming to the end of the world — we are IN the millennium now.",
      keyArguments: [
        "The 1000 years is symbolic of a long period of church history.",
        "The 'first resurrection' is spiritual rebirth (John 5:25).",
        "Satan is bound in the sense that Christ has limited his power through the cross.",
      ],
      weaknesses: [
        "If we are in the millennium now, Satan is doing a remarkably poor job of being 'bound' — the world is full of deception.",
        "The text describes TWO physical resurrections: the righteous first, then the wicked. Spiritualizing the 'first resurrection' while literalizing the second is inconsistent.",
        "'Blessed and holy is he that hath part in the first resurrection' (v. 6) — this language describes a literal, bodily event.",
        "The events described — fire from heaven, lake of fire, second death — are clearly literal end-time events, not ongoing spiritual realities.",
      ],
    },
    whyHistoricistWins: "Revelation 20 describes a clear sequence of events: (1) Christ returns, (2) righteous raised in the 'first resurrection,' (3) wicked slain, (4) earth desolate for 1000 years while Satan is 'bound' with no one to deceive, (5) saints in heaven reviewing God's judgments, (6) after 1000 years the wicked are raised, (7) New Jerusalem descends, (8) Satan's final deception and destruction. This reading respects the text's plain sequence, the year-day principle's application to prophetic time, and the sanctuary typology (the millennium corresponds to the scapegoat ceremony of Leviticus 16). Futurism's earthly millennium contradicts the heavenly nature of Christ's kingdom. Amillennialism's spiritualization of the resurrections is textually unjustified.",
  },
  {
    id: "olivet-discourse",
    title: "The Olivet Discourse — Matthew 24",
    scriptureRef: "Matthew 24:1-51",
    kjvKeyVerses: [
      "For then shall be great tribulation, such as was not since the beginning of the world to this time, no, nor ever shall be — Matthew 24:21",
      "Immediately after the tribulation of those days shall the sun be darkened, and the moon shall not give her light, and the stars shall fall from heaven — Matthew 24:29",
      "But of that day and hour knoweth no man, no, not the angels of heaven, but my Father only — Matthew 24:36",
    ],
    category: "revelation",
    historicist: {
      summary: "Jesus answers two questions: (1) when will the temple be destroyed? and (2) what are the signs of His coming? The discourse covers the destruction of Jerusalem (70 AD), the great tribulation (papal persecution 538-1798), cosmic signs (Dark Day 1780, falling stars 1833), and the Second Coming — a continuous prophetic timeline.",
      identification: "Great tribulation = the 1260 years of papal persecution (matching Daniel 7:25 and Rev 12:6). Cosmic signs = Dark Day of May 19, 1780 (sun and moon darkened) and the great meteor shower of November 13, 1833 (stars falling). 'This generation' = the generation that sees these signs will not pass before Christ returns.",
      timeframe: "70 AD destruction of Jerusalem → 538-1798 papal persecution → 1780/1833 cosmic signs → Second Coming.",
      keyArguments: [
        "Jesus explicitly says the tribulation would be 'shortened' for the elect's sake (v. 22) — the Reformation shortened the papal persecution before 1798.",
        "'Immediately after the tribulation of those days' the signs appear — the Dark Day (1780) came immediately after the worst persecution ended.",
        "The Dark Day of May 19, 1780, was observed across New England — the sun was darkened and the moon appeared blood-red. Documented in historical records.",
        "The Leonid meteor shower of November 13, 1833, was the most spectacular meteor storm in recorded history — 'stars fell from heaven.'",
        "These signs are sequential and historical — they happened in the exact order Jesus predicted.",
      ],
      weaknesses: [],
    },
    futurist: {
      summary: "Verses 1-35 describe the future 7-year tribulation. The 'great tribulation' is a future 3.5-year period under the Antichrist. All signs are future.",
      identification: "The great tribulation = the future second half of the 7-year tribulation. All cosmic signs = future supernatural events during the tribulation.",
      timeframe: "Entirely future (except possibly the destruction of Jerusalem in 70 AD for verses 1-2).",
      keyArguments: [
        "The signs are so dramatic they must be supernatural future events.",
        "The 'abomination of desolation' is a future Antichrist in a rebuilt temple.",
        "'This generation' means the generation alive when these signs begin.",
      ],
      weaknesses: [
        "Pushing everything into the future makes Jesus's discourse irrelevant to 2000 years of church history.",
        "Historical cosmic signs (1780, 1833) match the prophecy precisely — there is no need to wait for future fulfillment.",
        "Jesus was answering His disciples' questions about THEIR temple — the discourse begins with a first-century event.",
        "The futurist interpretation requires a 'rebuilt temple,' which contradicts the New Testament's clear teaching that Christ's sacrifice ended the temple system.",
      ],
    },
    preterist: {
      summary: "The entire Olivet Discourse was fulfilled in 70 AD with the destruction of Jerusalem. All signs — tribulation, cosmic events, and even 'the coming of the Son of Man' — refer to 70 AD.",
      identification: "Everything = the destruction of Jerusalem by Rome in 70 AD. 'The coming of the Son of Man' = a spiritual coming in judgment, not a literal return.",
      timeframe: "Entirely fulfilled by 70 AD.",
      keyArguments: [
        "Jesus says 'this generation shall not pass' — the generation alive in 33 AD saw 70 AD.",
        "The destruction of Jerusalem was indeed a 'great tribulation' for the Jews.",
        "The cosmic language is apocalyptic symbolism, not literal events.",
      ],
      weaknesses: [
        "If 'the coming of the Son of Man' was 70 AD, then Christ has already returned — making the blessed hope meaningless.",
        "The cosmic signs in verses 29-30 are described as events 'all the tribes of the earth' would witness — this did not happen at 70 AD.",
        "'He shall send his angels with a great sound of a trumpet, and they shall gather together his elect' (v. 31) — this clearly describes the Second Coming, not 70 AD.",
        "Jesus repeatedly distinguishes between the destruction of Jerusalem and His return — they are two events, not one.",
        "Preterism destroys the doctrine of the literal Second Coming — a pillar of Christian hope.",
      ],
    },
    whyHistoricistWins: "The Olivet Discourse is Jesus's own prophetic roadmap from His time to the end of the world. He describes a sequence: temple destruction (70 AD), great tribulation (papal persecution), cosmic signs (1780 Dark Day, 1833 meteor shower), and then His return. History confirms each sign in the exact order Jesus predicted. The Dark Day of 1780 and the meteor storm of 1833 are documented historical events that match 'the sun shall be darkened, the moon shall not give her light, and the stars shall fall' with precision. Futurism makes the discourse irrelevant to history; preterism eliminates the Second Coming entirely. Only historicism respects both the text and the historical evidence.",
  },
];
