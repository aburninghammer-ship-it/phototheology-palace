// Mathematics Room Library - Comprehensive Guide to Biblical Time Prophecies
// The 6 Fixed Time Prophecies: @120, @400, @70y, @490, @1260, @2300

export type ProphecyCode = "@120" | "@400" | "@70y" | "@490" | "@1260" | "@2300";
export type ProphecyType = "probation" | "affliction" | "captivity" | "messianic" | "persecution" | "judgment";

export interface TimeProphecy {
  id: string;
  code: ProphecyCode;
  name: string;
  fullName: string;
  duration: string;
  unit: "years" | "days" | "prophetic-days";
  type: ProphecyType;
  primaryVerse: string;
  description: string;
  coreTheme: string;
  startingPoint: StartingPoint;
  endingPoint: EndingPoint;
  calculation: ProphecyCalculation;
  historicalFulfillment: HistoricalFulfillment;
  spiritualSignificance: string[];
  christConnection: string;
  parallelsAndPatterns: ParallelPattern[];
  relatedProphecies?: ProphecyCode[];
  keyVerses: string[];
  commonMisunderstandings: string[];
  practicalApplications: string[];
}

export interface StartingPoint {
  event: string;
  date: string;
  verse: string;
  historicalEvidence: string;
}

export interface EndingPoint {
  event: string;
  date: string;
  verse: string;
  historicalEvidence: string;
}

export interface ProphecyCalculation {
  formula: string;
  steps: CalculationStep[];
  dayYearPrinciple?: string;
  verification: string;
}

export interface CalculationStep {
  step: number;
  description: string;
  calculation: string;
}

export interface HistoricalFulfillment {
  event: string;
  date: string;
  description: string;
  keyFigures: string[];
  sources: string[];
  significance: string;
}

export interface ParallelPattern {
  prophecy: ProphecyCode;
  connection: string;
}

export interface PropheticPrinciple {
  id: string;
  name: string;
  description: string;
  scriptureSupport: string[];
  examples: string[];
}

// Prophetic Principles
export const propheticPrinciples: PropheticPrinciple[] = [
  {
    id: "day-year",
    name: "The Day-Year Principle",
    description: "In apocalyptic prophecy, a prophetic 'day' represents a literal year. This principle is established in Scripture and confirmed by historical fulfillment.",
    scriptureSupport: [
      "Numbers 14:34 - 'Each day for a year'",
      "Ezekiel 4:6 - 'I have appointed thee each day for a year'",
      "Daniel 9:24-27 - 70 weeks (490 days) = 490 years (proven by fulfillment)",
      "Historical confirmation of all major time prophecies using this principle"
    ],
    examples: [
      "1260 days = 1260 years (AD 538-1798)",
      "2300 days = 2300 years (457 BC - AD 1844)",
      "70 weeks = 490 years (457 BC - AD 34)"
    ]
  },
  {
    id: "recapitulation",
    name: "The Principle of Recapitulation",
    description: "Prophetic visions often cover the same time period from different perspectives. Daniel 2, 7, and 8 all cover the same history with increasing detail.",
    scriptureSupport: [
      "Daniel 2 - Four metals + stone",
      "Daniel 7 - Four beasts + judgment + kingdom",
      "Daniel 8 - Ram, goat, little horn + sanctuary cleansing",
      "Revelation 12-13 - Same powers from different angles"
    ],
    examples: [
      "Babylon in Daniel 2 (gold head) and Daniel 7 (lion)",
      "Rome in Daniel 2 (iron legs) and Daniel 7 (dreadful beast)",
      "The 1260 years in Daniel 7:25, 12:7, Revelation 11:2-3, 12:6, 12:14, 13:5"
    ]
  },
  {
    id: "starting-points",
    name: "Identifying Starting Points",
    description: "Time prophecies begin with identifiable historical events—usually decrees, enthronements, or specific actions that can be dated historically.",
    scriptureSupport: [
      "Daniel 9:25 - 'From the going forth of the commandment to restore and build Jerusalem'",
      "Daniel 8:14 - Connected to the 'vision' of chapters 8-9",
      "Historical decrees and events serve as anchors"
    ],
    examples: [
      "457 BC - Artaxerxes' decree (Ezra 7)",
      "538 BC - Fall of Babylon",
      "AD 538 - Justinian's decree effectuated"
    ]
  },
  {
    id: "prophetic-months",
    name: "Prophetic Time Units",
    description: "Biblical prophecy uses a 30-day month and 360-day year. 'Time' = 360 days; 'times' = 720 days; 'half a time' = 180 days. Total: 1260 days.",
    scriptureSupport: [
      "Daniel 7:25 - 'Time, times, and half a time'",
      "Revelation 12:6 - '1260 days'",
      "Revelation 12:14 - 'Time, times, and half a time'",
      "Revelation 11:2 - '42 months' × 30 = 1260 days"
    ],
    examples: [
      "42 months × 30 days = 1260 days = 3.5 years",
      "1260 days = 1260 prophetic years using day-year principle",
      "Time (1) + times (2) + half a time (0.5) = 3.5 × 360 = 1260"
    ]
  }
];

// The Six Fixed Time Prophecies
export const timeProphecies: TimeProphecy[] = [
  {
    id: "120-years",
    code: "@120",
    name: "120 Years of Probation",
    fullName: "The Antediluvian Probation Period",
    duration: "120 years",
    unit: "years",
    type: "probation",
    primaryVerse: "Genesis 6:3",
    description: "God's declaration that humanity's days would be 120 years refers to the probationary period before the Flood—not human lifespan. It was the time granted for repentance while Noah built the ark.",
    coreTheme: "Limited Probation: God's mercy has boundaries. Grace offers time to repent, but that time is finite.",
    startingPoint: {
      event: "God's declaration and Noah's commission to build the ark",
      date: "c. 2468 BC (approximately 120 years before the Flood)",
      verse: "Genesis 6:3, 13-14",
      historicalEvidence: "The Flood date calculated from Genesis genealogies; 120 years before gives the starting point of the probation period."
    },
    endingPoint: {
      event: "The Flood—God shuts the door of the ark",
      date: "c. 2348 BC",
      verse: "Genesis 7:16",
      historicalEvidence: "Noah entered the ark; 7 days later the rain began; probation had ended when God shut the door."
    },
    calculation: {
      formula: "God's declaration + 120 years = The Flood",
      steps: [
        { step: 1, description: "God announces judgment and sets probation", calculation: "Genesis 6:3" },
        { step: 2, description: "Noah preaches righteousness while building ark", calculation: "2 Peter 2:5; Hebrews 11:7" },
        { step: 3, description: "120 years elapse; God shuts the door", calculation: "Genesis 7:16" }
      ],
      verification: "The 120 years as lifespan doesn't fit—people lived longer afterward. As probation, it matches the narrative perfectly."
    },
    historicalFulfillment: {
      event: "The Global Flood",
      date: "c. 2348 BC",
      description: "The Flood came as promised. Only 8 souls were saved—Noah's family. The world was destroyed by water. God's word proved true.",
      keyFigures: ["Noah", "Shem", "Ham", "Japheth"],
      sources: ["Genesis 7-8", "2 Peter 3:5-6", "Matthew 24:37-39"],
      significance: "Establishes the pattern: warning, probation, judgment. Future judgments follow the same pattern."
    },
    spiritualSignificance: [
      "Probation is real—there is a point of no return",
      "God's patience is not infinite; it has a purpose and an end",
      "Noah's preaching for 120 years shows the seriousness of warning",
      "Only those inside the 'ark' were saved—type of being 'in Christ'"
    ],
    christConnection: "Christ referenced the days of Noah as a type of His return (Matthew 24:37-39). As the world was caught off-guard then, so it will be at the end. The ark is Christ—one door, safety inside. The 120 years of Noah's preaching parallels the gospel call today.",
    parallelsAndPatterns: [
      { prophecy: "@70y", connection: "Both are probationary periods—70 years for Babylon's captivity, 120 years for antediluvian world" },
      { prophecy: "@490", connection: "Israel had 490 years of probation culminating in Messiah's rejection" }
    ],
    keyVerses: [
      "Genesis 6:3 - 'His days shall be 120 years'",
      "2 Peter 2:5 - Noah, 'preacher of righteousness'",
      "Hebrews 11:7 - 'Warned of things not yet seen'",
      "Matthew 24:37-39 - 'As the days of Noah'"
    ],
    commonMisunderstandings: [
      "The 120 years is NOT a reduction of human lifespan—people lived longer after the flood",
      "It is NOT a gradual reduction from 900+ years—it was specifically a probationary period",
      "The 120 years refers to time until judgment, not individual longevity"
    ],
    practicalApplications: [
      "Don't presume on God's patience—respond now",
      "Faithfully proclaim the message even if few respond",
      "Build your 'ark' (relationship with Christ) before the rain comes",
      "The door will be shut—preparation time is limited"
    ]
  },
  {
    id: "400-years",
    code: "@400",
    name: "400 Years of Affliction",
    fullName: "The Egyptian Sojourn and Affliction",
    duration: "400 years",
    unit: "years",
    type: "affliction",
    primaryVerse: "Genesis 15:13",
    description: "God revealed to Abraham that his descendants would be strangers in a land not theirs and would be afflicted for 400 years before being delivered with great substance.",
    coreTheme: "Affliction and Deliverance: God knows the end from the beginning. Even extended suffering is within His plan, and deliverance is certain.",
    startingPoint: {
      event: "Ishmael mocks Isaac at the weaning feast—beginning of 'affliction' of Abraham's seed",
      date: "c. 1892 BC (Isaac weaned, approximately age 5)",
      verse: "Genesis 21:8-10; Galatians 4:29",
      historicalEvidence: "Paul in Galatians identifies Ishmael's mockery as 'persecution'—the beginning of the affliction of the 'seed.'"
    },
    endingPoint: {
      event: "The Exodus from Egypt",
      date: "c. 1446 BC",
      verse: "Exodus 12:40-41",
      historicalEvidence: "The Exodus is the definitive end of affliction. Israel leaves with great wealth as promised."
    },
    calculation: {
      formula: "Ishmael's mockery (1892 BC) + 400 years of affliction = Exodus (c. 1492 BC with rounding) or Isaac's birth to Exodus (430 years from Canaan-to-Exodus perspective)",
      steps: [
        { step: 1, description: "God tells Abraham his seed will be afflicted 400 years", calculation: "Genesis 15:13" },
        { step: 2, description: "Affliction begins when Ishmael persecutes Isaac", calculation: "Galatians 4:29" },
        { step: 3, description: "Sojourn in Canaan and Egypt totals 430 years (Exodus 12:40 LXX)", calculation: "430 years from Abraham to Exodus" },
        { step: 4, description: "The 400 years represents the 'affliction' portion—a round number", calculation: "Genesis 15:13; Acts 7:6" }
      ],
      verification: "The 430 years (Exodus 12:40) includes time in Canaan; the 400 years (Genesis 15:13) is the affliction portion. Stephen uses the 400-year figure (Acts 7:6)."
    },
    historicalFulfillment: {
      event: "The Exodus and Conquest",
      date: "c. 1446 BC",
      description: "God raised up Moses, sent the ten plagues, parted the Red Sea, and brought Israel out 'with a mighty hand.' They came out with silver, gold, and clothing—not empty-handed as slaves but wealthy.",
      keyFigures: ["Moses", "Aaron", "Pharaoh", "The 12 Tribes"],
      sources: ["Exodus 12:35-36", "Acts 7:6-7", "Galatians 3:17"],
      significance: "The Exodus is the defining redemptive event of the Old Testament—the pattern of all future deliverances."
    },
    spiritualSignificance: [
      "God knows the timing of your deliverance before the affliction begins",
      "Affliction can be the context for multiplication—Israel grew in Egypt",
      "Deliverance comes at the appointed time, not a moment sooner or later",
      "Coming out 'with great substance' shows God compensates for affliction"
    ],
    christConnection: "Jesus spent His early years in Egypt (Matthew 2:15), fulfilling Hosea 11:1—'Out of Egypt I called my Son.' The true Seed of Abraham experienced the Egypt journey. The Exodus is the pattern for Christ's greater deliverance—freedom from sin's bondage.",
    parallelsAndPatterns: [
      { prophecy: "@70y", connection: "Both involve captivity followed by deliverance at the appointed time" },
      { prophecy: "@1260", connection: "Both involve persecution of God's people for a set period" }
    ],
    keyVerses: [
      "Genesis 15:13-14 - 'Afflicted 400 years... come out with great substance'",
      "Exodus 12:40-41 - 'The sojourning was 430 years'",
      "Acts 7:6 - Stephen's summary",
      "Galatians 3:17 - 'The law, which came 430 years later'"
    ],
    commonMisunderstandings: [
      "The 400 years is NOT a contradiction with 430 years—they count from different starting points",
      "Israel was NOT in Egypt for 400 years—the sojourn in Canaan AND Egypt totaled 430",
      "The 'affliction' began before Egypt with Ishmael's persecution of Isaac"
    ],
    practicalApplications: [
      "Trust God's timeline even when affliction seems endless",
      "Grow during hardship—Israel multiplied in bondage",
      "Know that deliverance is coming at the set time",
      "Expect to come out enriched, not impoverished"
    ]
  },
  {
    id: "70-years",
    code: "@70y",
    name: "70 Years of Captivity",
    fullName: "The Babylonian Captivity Period",
    duration: "70 years",
    unit: "years",
    type: "captivity",
    primaryVerse: "Jeremiah 25:11-12",
    description: "God declared through Jeremiah that Judah would serve Babylon for 70 years. At the end of that period, Babylon would be punished and Israel would return to their land.",
    coreTheme: "Restoration after Judgment: Even in exile, God sets limits. Judgment is not eternal—restoration is promised and dated.",
    startingPoint: {
      event: "First Babylonian captivity—Nebuchadnezzar takes captives including Daniel",
      date: "605 BC",
      verse: "Daniel 1:1-2; 2 Chronicles 36:5-7",
      historicalEvidence: "The Battle of Carchemish (605 BC) established Babylonian dominance. Daniel and others were taken captive that year."
    },
    endingPoint: {
      event: "Cyrus's decree to return and rebuild the temple",
      date: "539/538 BC (decree issued after Babylon's fall)",
      verse: "Ezra 1:1-4; 2 Chronicles 36:22-23",
      historicalEvidence: "Cyrus conquered Babylon in 539 BC. His decree in 538/537 BC ended the captivity after ~70 years."
    },
    calculation: {
      formula: "605 BC (first captivity) + 70 years = 535 BC (temple foundation laid)",
      steps: [
        { step: 1, description: "First captivity under Nebuchadnezzar (Daniel taken)", calculation: "605 BC" },
        { step: 2, description: "Jerusalem destroyed, temple burned", calculation: "586 BC (19 years later)" },
        { step: 3, description: "Babylon falls to Medo-Persia", calculation: "539 BC" },
        { step: 4, description: "Cyrus's decree; first return", calculation: "538/537 BC" },
        { step: 5, description: "Temple foundation laid (~70 years from first captivity)", calculation: "536/535 BC" }
      ],
      verification: "Multiple 70-year spans work: 605-535 BC (captivity to temple foundation), 586-516 BC (temple destruction to temple completion)."
    },
    historicalFulfillment: {
      event: "Fall of Babylon and Jewish Return",
      date: "539-516 BC",
      description: "Babylon fell to Cyrus exactly as predicted (Isaiah 45). Jews returned in waves. The second temple was completed in 516 BC—70 years after its destruction in 586 BC.",
      keyFigures: ["Daniel", "Cyrus", "Zerubbabel", "Joshua (high priest)", "Haggai", "Zechariah"],
      sources: ["Ezra 1-6", "Daniel 5", "Isaiah 44:28-45:1", "Jeremiah 29:10"],
      significance: "Demonstrates precise prophetic fulfillment. Cyrus named by Isaiah 150 years before his birth."
    },
    spiritualSignificance: [
      "Judgment has limits—God sets an end date",
      "Prayer matters—Daniel prayed based on understanding the 70 years",
      "God uses pagan rulers (Cyrus) to accomplish His purposes",
      "Restoration is possible after the most devastating judgment"
    ],
    christConnection: "The 70-year captivity ends when a 'shepherd' named Cyrus releases God's people. Cyrus is explicitly called 'the Lord's anointed' (Messiah) in Isaiah 45:1—a type of Christ who releases us from sin's captivity. The return sets the stage for Messiah's eventual coming.",
    parallelsAndPatterns: [
      { prophecy: "@490", connection: "Both are 'seventy' based—70 years vs. 70 sevens (490). Both involve temple destruction and restoration." },
      { prophecy: "@2300", connection: "Both involve sanctuary themes—second temple period leads into the 2300-day prophecy." }
    ],
    keyVerses: [
      "Jeremiah 25:11-12 - 'These nations shall serve the king of Babylon 70 years'",
      "Jeremiah 29:10 - 'After 70 years are accomplished'",
      "Daniel 9:2 - Daniel understood from Jeremiah the 70 years",
      "2 Chronicles 36:21 - Land enjoyed its Sabbaths"
    ],
    commonMisunderstandings: [
      "The 70 years is NOT approximate—it was precisely fulfilled",
      "There are multiple valid 70-year spans depending on starting/ending events",
      "Daniel's prayer (Daniel 9) was BECAUSE he understood the 70 years were ending"
    ],
    practicalApplications: [
      "Study prophecy to understand God's timing—it prompts prayer",
      "Even judgment has a set duration—don't lose hope",
      "God controls history—even pagan kings serve His purposes",
      "Restoration after judgment is part of God's character"
    ]
  },
  {
    id: "490-years",
    code: "@490",
    name: "70 Weeks / 490 Years",
    fullName: "The Seventy Weeks Prophecy to Messiah",
    duration: "490 years (70 × 7)",
    unit: "prophetic-days",
    type: "messianic",
    primaryVerse: "Daniel 9:24-27",
    description: "Gabriel told Daniel that 70 weeks (490 prophetic days = 490 years) were determined upon Israel to finish transgression, make an end of sins, bring everlasting righteousness, seal up prophecy, and anoint the Most Holy.",
    coreTheme: "Messiah's Coming Dated: The only prophecy that gives a specific timeline for Messiah's appearance, death, and work. Christ came exactly on schedule.",
    startingPoint: {
      event: "The decree of Artaxerxes to restore and rebuild Jerusalem (not just the temple, but the city)",
      date: "457 BC (7th year of Artaxerxes)",
      verse: "Daniel 9:25; Ezra 7:11-26",
      historicalEvidence: "Ezra 7 records the decree in the 7th year of Artaxerxes I, which according to Persian chronology was 457 BC. This decree authorized restoration of the city's civil and religious governance."
    },
    endingPoint: {
      event: "Stoning of Stephen; gospel turns to Gentiles—end of exclusive Jewish probation",
      date: "AD 34 (3.5 years after Christ's crucifixion)",
      verse: "Acts 7:54-60; Acts 8:1-4",
      historicalEvidence: "Stephen's martyrdom marked the end of concentrated gospel work in Jerusalem. Saul's conversion and the Gentile mission began shortly after."
    },
    calculation: {
      formula: "457 BC + 490 years = AD 34 (remember: no year zero)",
      steps: [
        { step: 1, description: "Artaxerxes' decree issued", calculation: "457 BC (Ezra 7)" },
        { step: 2, description: "First 7 weeks (49 years)—Jerusalem rebuilt in troublous times", calculation: "457 BC - 408 BC = 49 years" },
        { step: 3, description: "Next 62 weeks (434 years)—unto Messiah the Prince", calculation: "408 BC + 434 years = AD 27" },
        { step: 4, description: "Messiah appears (baptism)—69 weeks fulfilled", calculation: "AD 27 (Jesus baptized, begins ministry)" },
        { step: 5, description: "Middle of the 70th week—Messiah 'cut off'", calculation: "AD 27 + 3.5 years = AD 31 (crucifixion)" },
        { step: 6, description: "End of 70th week—gospel to Gentiles", calculation: "AD 31 + 3.5 years = AD 34" }
      ],
      dayYearPrinciple: "70 weeks = 70 × 7 = 490 prophetic days. Using Numbers 14:34 and Ezekiel 4:6, a day represents a year. 490 days = 490 years.",
      verification: "Jesus was baptized in 'the fifteenth year of Tiberius Caesar' (Luke 3:1)—dating to AD 27. Crucifixion at Passover AD 31. The math is precise."
    },
    historicalFulfillment: {
      event: "Christ's baptism, ministry, crucifixion, and the gospel's expansion",
      date: "AD 27-34",
      description: "Jesus appeared at His baptism exactly 483 years (69 weeks) from 457 BC. He was 'cut off' (crucified) in the middle of the 70th week (AD 31). The remaining 3.5 years saw the gospel concentrated on Israel until Stephen's stoning opened the way to the Gentiles.",
      keyFigures: ["Jesus Christ", "John the Baptist", "Stephen", "Saul/Paul"],
      sources: ["Luke 3:1-3", "Galatians 4:4", "Acts 7", "Acts 13:46"],
      significance: "This is the most mathematically precise prophecy in Scripture. It proves Jesus is the Messiah by dating His appearance and death centuries in advance."
    },
    spiritualSignificance: [
      "The 6 goals of Daniel 9:24 are accomplished in Christ: transgression finished, sins ended, iniquity atoned, everlasting righteousness brought, vision sealed, Most Holy anointed",
      "Israel had 490 years of final probation—exactly what they had violated (70 Sabbatical years × 7)",
      "Christ confirms the covenant by His death—not a future antichrist",
      "The middle-of-the-week crucifixion ends the need for animal sacrifices"
    ],
    christConnection: "This is THE Messianic time prophecy. 'Messiah the Prince' appears at His baptism. 'Messiah cut off, but not for Himself'—He dies for others. He 'confirms the covenant' through His blood. 'In the midst of the week He shall cause sacrifice to cease'—His death fulfills and ends the sacrificial system.",
    parallelsAndPatterns: [
      { prophecy: "@70y", connection: "Daniel praying about the 70 years receives revelation about 70 sevens—a tenfold extension of the concept" },
      { prophecy: "@2300", connection: "The 70 weeks are 'cut off' (chathak) from the 2300 days—they share the same starting point (457 BC)" }
    ],
    keyVerses: [
      "Daniel 9:24 - 'Seventy weeks are determined upon thy people'",
      "Daniel 9:25 - 'Unto Messiah the Prince shall be 7 weeks and 62 weeks'",
      "Daniel 9:26 - 'After 62 weeks Messiah shall be cut off'",
      "Daniel 9:27 - 'He shall confirm the covenant... in the midst of the week'"
    ],
    commonMisunderstandings: [
      "The 70th week is NOT a future tribulation period—it was fulfilled in AD 27-34",
      "The 'he' who confirms the covenant is Messiah, not an antichrist",
      "There is no 2000-year 'gap' in the prophecy—it is continuous",
      "The starting point is 457 BC (Artaxerxes' decree), not 444 BC (Nehemiah)"
    ],
    practicalApplications: [
      "Jesus is demonstrably the Messiah—the timing proves it",
      "The sacrificial system ended at the cross—don't look backward",
      "God's timeline is precise—trust His prophetic word",
      "The gospel went to all nations because Israel's exclusive time ended"
    ]
  },
  {
    id: "1260-years",
    code: "@1260",
    name: "1260 Days/Years of Papal Supremacy",
    fullName: "The Time of Persecution and Papal Dominion",
    duration: "1260 years (also expressed as 42 months, 3.5 times)",
    unit: "prophetic-days",
    type: "persecution",
    primaryVerse: "Daniel 7:25; Revelation 12:6, 14; 13:5",
    description: "Multiple prophecies point to a 1260-day (year) period of religious persecution during which a blasphemous power ('little horn,' 'beast') would dominate and persecute God's faithful people.",
    coreTheme: "Persecution and Preservation: God's people would be oppressed for a defined period, but the time would be limited, and a remnant would survive.",
    startingPoint: {
      event: "Justinian's decree (533) effectuated when Ostrogothic resistance in Rome was eliminated",
      date: "AD 538",
      verse: "Daniel 7:25; Revelation 12:6",
      historicalEvidence: "Justinian I declared the Bishop of Rome 'head of all churches' in 533. The Ostrogoths, last Arian obstacle, were routed from Rome by Belisarius in 538, allowing papal authority to be exercised."
    },
    endingPoint: {
      event: "French General Berthier captures Pope Pius VI; papal temporal power ended",
      date: "AD 1798",
      verse: "Revelation 13:3 ('deadly wound')",
      historicalEvidence: "On February 10, 1798, General Berthier entered Rome, took the Pope prisoner, and established the Roman Republic. Pius VI died in captivity. The 'deadly wound' was inflicted."
    },
    calculation: {
      formula: "AD 538 + 1260 years = AD 1798",
      steps: [
        { step: 1, description: "1260 'days' in prophetic literature", calculation: "Day = year (Numbers 14:34; Ezekiel 4:6)" },
        { step: 2, description: "Also expressed as '42 months' (42 × 30 = 1260)", calculation: "Revelation 11:2; 13:5" },
        { step: 3, description: "Also expressed as 'time, times, and half a time' (3.5 × 360 = 1260)", calculation: "Daniel 7:25; 12:7; Revelation 12:14" },
        { step: 4, description: "Papal supremacy begins", calculation: "AD 538" },
        { step: 5, description: "Papal supremacy ends with deadly wound", calculation: "AD 538 + 1260 = AD 1798" }
      ],
      dayYearPrinciple: "Prophetic days = literal years. The 1260 days appear in 7 different verses, each confirmed by this period of historical papal dominion.",
      verification: "Historians of all persuasions recognize 538-1798 as a distinct period of papal temporal power. The starting and ending events are historically documented."
    },
    historicalFulfillment: {
      event: "The 1260-Year Reign of the Papacy",
      date: "AD 538-1798",
      description: "For 1260 years, the papacy wielded both spiritual and temporal power over Europe. Dissenters were persecuted—Waldenses, Albigenses, Huguenots, and others. Millions died for refusing to submit to papal authority. The period ended when French revolutionary forces captured the Pope.",
      keyFigures: ["Pope Gregory I", "Charlemagne", "Pope Innocent III", "Pius VI", "Napoleon/Berthier"],
      sources: ["Daniel 7:25", "Revelation 13:5", "Historical records of the Inquisition, Crusades against 'heretics', and 1798 events"],
      significance: "The longest explicitly dated persecution prophecy. Its precise fulfillment validates historicist interpretation."
    },
    spiritualSignificance: [
      "Persecution has limits—God numbers the days of tribulation",
      "The 'woman' (true church) fled to the 'wilderness' but was preserved",
      "Truth was suppressed but never extinguished—the Reformation proves it",
      "The 'deadly wound' was inflicted but will be healed before the end"
    ],
    christConnection: "Christ's faithful followers endured the 1260 years. He promised the gates of hell would not prevail (Matthew 16:18). The 'woman' of Revelation 12 who bears Christ is protected during this persecution. Christ, not the Pope, is the true head of the church.",
    parallelsAndPatterns: [
      { prophecy: "@400", connection: "Both involve extended affliction of God's people with promised deliverance" },
      { prophecy: "@2300", connection: "The 1260 years fall within the 2300-year period; both deal with sanctuary/church themes" }
    ],
    keyVerses: [
      "Daniel 7:25 - 'Time, times, and half a time'",
      "Revelation 12:6 - 'The woman fled... 1260 days'",
      "Revelation 12:14 - 'Time, times, and half a time'",
      "Revelation 13:5 - 'Power was given unto him 42 months'",
      "Revelation 11:2-3 - '42 months... 1260 days'"
    ],
    commonMisunderstandings: [
      "This is NOT a future 3.5-year tribulation—it was fulfilled historically over 1260 years",
      "The 'beast' power is a system, not a single future individual",
      "The 'deadly wound' of 1798 will be 'healed'—end-time revival of this power",
      "Protestant reformers unanimously identified the papacy as this power"
    ],
    practicalApplications: [
      "Religious persecution from religious power is prophesied—be discerning",
      "The true church survives opposition—don't fear",
      "The 'wound' is healing—watch for resurgence of religious-political power",
      "Stand for truth even when it's costly—others did for 1260 years"
    ]
  },
  {
    id: "2300-years",
    code: "@2300",
    name: "2300 Days/Years to Sanctuary Cleansing",
    fullName: "The Cleansing of the Sanctuary Prophecy",
    duration: "2300 years",
    unit: "prophetic-days",
    type: "judgment",
    primaryVerse: "Daniel 8:14",
    description: "The longest time prophecy in Scripture, spanning from the decree to rebuild Jerusalem to the cleansing of the heavenly sanctuary—marking the beginning of the investigative judgment before Christ's return.",
    coreTheme: "Judgment Hour: The heavenly sanctuary would be cleansed, and the investigative judgment would begin, preparing the way for Christ's second coming.",
    startingPoint: {
      event: "The decree of Artaxerxes to restore and rebuild Jerusalem (same as the 70 weeks)",
      date: "457 BC",
      verse: "Daniel 9:25; Ezra 7:11-26",
      historicalEvidence: "The 70 weeks prophecy (Daniel 9) is given to explain (chatak = 'cut off') the 2300-day vision of Daniel 8. Both share the same starting point—the decree to restore Jerusalem in 457 BC."
    },
    endingPoint: {
      event: "The cleansing of the heavenly sanctuary begins—the investigative judgment commences",
      date: "AD 1844 (October 22)",
      verse: "Daniel 8:14; Leviticus 16; Hebrews 9:23",
      historicalEvidence: "1844 marks the end of 2300 years from 457 BC (457 BC + 2300 - 1 [no year zero] = AD 1844). The Millerite movement correctly calculated the date but misunderstood the event."
    },
    calculation: {
      formula: "457 BC + 2300 years - 1 (no year zero) = AD 1844",
      steps: [
        { step: 1, description: "Vision of 2300 evenings-mornings given to Daniel", calculation: "Daniel 8:14" },
        { step: 2, description: "Gabriel returns to explain 'the vision' (Daniel 8) in chapter 9", calculation: "Daniel 9:23 - 'understand the vision'" },
        { step: 3, description: "70 weeks (490 years) 'cut off' (chatak) from the 2300", calculation: "Same starting point: 457 BC" },
        { step: 4, description: "457 BC verified by 70 weeks fulfillment (Messiah in AD 27)", calculation: "457 BC + 483 = AD 27 ✓" },
        { step: 5, description: "2300 years from same starting point", calculation: "457 BC + 2300 = AD 1844" },
        { step: 6, description: "The sanctuary to be 'cleansed' (tsadaq = justified/vindicated)", calculation: "Heavenly Day of Atonement begins" }
      ],
      dayYearPrinciple: "The 2300 'evenings-mornings' are prophetic days = 2300 literal years. This is proven by the 70 weeks (490 prophetic days = 490 years) being 'cut off' from the same period and fulfilled precisely.",
      verification: "The 70 weeks prophecy confirms the starting point (457 BC) and the day-year principle. AD 27 (69 weeks) is exactly 483 years from 457 BC."
    },
    historicalFulfillment: {
      event: "Christ enters the Most Holy Place of the Heavenly Sanctuary",
      date: "October 22, 1844",
      description: "The earthly Day of Atonement of 1844 marked the beginning of Christ's final work in the heavenly sanctuary. The 'cleansing' is not of a physical structure but of the heavenly record—the investigative judgment reviewing the cases of all who have professed faith.",
      keyFigures: ["William Miller", "Christ (Heavenly High Priest)", "Early Adventist pioneers"],
      sources: ["Daniel 8:14", "Hebrews 8-9", "Leviticus 16", "Revelation 14:7"],
      significance: "The hour of God's judgment has come (Revelation 14:7). The final phase of Christ's heavenly ministry has begun. We live in the anti-typical Day of Atonement."
    },
    spiritualSignificance: [
      "We are living in the judgment hour—the investigative judgment is real",
      "Christ ministers in the Most Holy Place—His work is not yet finished",
      "The Day of Atonement was a time of soul-searching—so is our time",
      "Probation is still open but will close—preparedness is essential"
    ],
    christConnection: "Christ is our High Priest in the heavenly sanctuary (Hebrews 8:1-2). He entered the Most Holy Place with His own blood (Hebrews 9:12). Since 1844, He has been conducting the cleansing work—examining records, affirming grace-chosen names, and preparing to return. Soon He will emerge as King.",
    parallelsAndPatterns: [
      { prophecy: "@490", connection: "The 70 weeks (490 years) are 'cut off' from the 2300—they share the 457 BC starting point" },
      { prophecy: "@1260", connection: "Both involve sanctuary themes; the 1260 years of papal persecution ended before 1844" }
    ],
    keyVerses: [
      "Daniel 8:14 - 'Unto 2300 days; then shall the sanctuary be cleansed'",
      "Daniel 9:24 - '70 weeks are determined (cut off) upon thy people'",
      "Hebrews 9:23 - 'Heavenly things... purified with better sacrifices'",
      "Revelation 14:7 - 'The hour of His judgment is come'"
    ],
    commonMisunderstandings: [
      "The 'sanctuary' is NOT the earth—it is the heavenly sanctuary where Christ ministers",
      "The 2300 'evenings and mornings' are NOT 1150 days (half)—the Hebrew clearly means 2300 full days",
      "The starting point is NOT Antiochus Epiphanes era—it must connect to the 70 weeks",
      "The 'cleansing' was NOT a mistake—the pioneers correctly understood the timing, not the event"
    ],
    practicalApplications: [
      "Live with the awareness that judgment is ongoing—it should affect daily life",
      "Confess sins specifically so they can be 'blotted out' in the judgment",
      "Participate in the Day of Atonement experience—soul-searching, affliction of soul",
      "Proclaim the judgment-hour message—'The hour of His judgment is come'"
    ]
  }
];

// Helper Functions
export const getProphecyByCode = (code: ProphecyCode): TimeProphecy | undefined => {
  return timeProphecies.find(p => p.code === code);
};

export const getProphecyById = (id: string): TimeProphecy | undefined => {
  return timeProphecies.find(p => p.id === id);
};

export const getPropheciesByType = (type: ProphecyType): TimeProphecy[] => {
  return timeProphecies.filter(p => p.type === type);
};

export const getAllProphecies = (): TimeProphecy[] => {
  return timeProphecies;
};

export const searchProphecies = (query: string): TimeProphecy[] => {
  const lowerQuery = query.toLowerCase();
  return timeProphecies.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.coreTheme.toLowerCase().includes(lowerQuery) ||
    p.christConnection.toLowerCase().includes(lowerQuery) ||
    p.keyVerses.some(v => v.toLowerCase().includes(lowerQuery))
  );
};

export const getPropheticPrinciples = (): PropheticPrinciple[] => {
  return propheticPrinciples;
};

export const getRelatedProphecies = (code: ProphecyCode): TimeProphecy[] => {
  const prophecy = getProphecyByCode(code);
  if (!prophecy || !prophecy.relatedProphecies) return [];
  return prophecy.relatedProphecies
    .map(c => getProphecyByCode(c))
    .filter((p): p is TimeProphecy => p !== undefined);
};

export const getTotalPropheciesCount = (): number => {
  return timeProphecies.length;
};

// Timeline Overview
export const prophecyTimeline = [
  { code: "@120", event: "Probation ends - Flood", date: "c. 2348 BC" },
  { code: "@400", event: "Exodus from Egypt", date: "c. 1446 BC" },
  { code: "@70y", event: "Return from Babylon", date: "539/516 BC" },
  { code: "@490", event: "Messiah cut off", date: "AD 31" },
  { code: "@1260", event: "Papal wound", date: "AD 1798" },
  { code: "@2300", event: "Sanctuary cleansing begins", date: "AD 1844" }
];

// ============================================
// 6×6 SCRIPTURE CONNECTION GRID
// Time prophecies belong to FUNCTIONS, not books
// ============================================

export type ScriptureGenre = "torah" | "history" | "wisdom" | "prophets" | "gospels" | "epistles";

export interface ScriptureConnection {
  reference: string;
  description?: string;
}

export interface ProphecyScriptureGrid {
  code: ProphecyCode;
  name: string;
  function: string;
  keyInsight: string;
  corridors: Record<ScriptureGenre, ScriptureConnection[]>;
  whyItFits: string;
  whyOthersDontFit: string;
}

export const scriptureConnectionGrid: ProphecyScriptureGrid[] = [
  {
    code: "@120",
    name: "120 Years — Probation Before Judgment",
    function: "Mercy window before irreversible judgment",
    keyInsight: "@120 shows up wherever God warns before closing access.",
    corridors: {
      torah: [
        { reference: "Genesis 6–7", description: "Noah's 120 years of warning before the Flood" },
        { reference: "Numbers 14", description: "Wilderness generation given time to repent" }
      ],
      history: [
        { reference: "Judges cycles", description: "Grace → warning → collapse pattern repeated" },
        { reference: "1 Samuel 13–15", description: "Saul's probation before rejection" }
      ],
      wisdom: [
        { reference: "Proverbs 29:1", description: "He that being often reproved hardeneth his neck shall suddenly be destroyed" },
        { reference: "Ecclesiastes 8:11", description: "Because sentence is not executed speedily, hearts are set to do evil" }
      ],
      prophets: [
        { reference: "Jonah 3–4", description: "Nineveh given 40 days of probation" },
        { reference: "Ezekiel 33", description: "Watchman logic — warn before judgment falls" }
      ],
      gospels: [
        { reference: "Matthew 23–24", description: "Jesus' warnings to Jerusalem before destruction" },
        { reference: "Luke 13:6-9", description: "Parable of the fig tree — one more year of grace" }
      ],
      epistles: [
        { reference: "Hebrews 3–4", description: "Today, if ye will hear His voice, harden not your hearts" },
        { reference: "Revelation 2–3", description: "Church probation — repent or face consequences" }
      ]
    },
    whyItFits: "All these texts feature a limited window of mercy before judgment closes. God always warns before acting.",
    whyOthersDontFit: "Unlike @400 (affliction) or @1260 (suppression), this is about open opportunity, not persecution."
  },
  {
    code: "@400",
    name: "400 Years — Affliction Before Deliverance",
    function: "Promise delayed under oppression",
    keyInsight: "@400 always precedes inheritance.",
    corridors: {
      torah: [
        { reference: "Genesis 15:13", description: "God tells Abraham his seed will be strangers and afflicted 400 years" },
        { reference: "Exodus 1–12", description: "Israel's bondage in Egypt culminating in deliverance" }
      ],
      history: [
        { reference: "Judges", description: "Cycles of foreign oppression before judges arise" },
        { reference: "1 Samuel 16 – 2 Samuel 5", description: "David hunted and afflicted before receiving the throne" }
      ],
      wisdom: [
        { reference: "Psalm 105:17-22", description: "Joseph's affliction before exaltation" },
        { reference: "Psalm 66:10-12", description: "Tried through fire and water, then brought to wealthy place" }
      ],
      prophets: [
        { reference: "Isaiah 40–52", description: "Comfort after bondage — affliction then restoration" },
        { reference: "Hosea 6:1-2", description: "After two days (affliction period) He will revive us" }
      ],
      gospels: [
        { reference: "Luke 2:25-32", description: "Israel under Rome, waiting for consolation" },
        { reference: "Matthew 4:1-11", description: "Jesus tempted 40 days before ministry begins" }
      ],
      epistles: [
        { reference: "Acts 7:6-7", description: "Stephen reviews the 400-year affliction pattern" },
        { reference: "Revelation 12:6,14", description: "Woman (church) persecuted before vindication" }
      ]
    },
    whyItFits: "Every text shows suffering that precedes promised deliverance and inheritance.",
    whyOthersDontFit: "Unlike @120 (warning period), this is about enduring hardship while awaiting God's promise."
  },
  {
    code: "@70y",
    name: "70 Years — Captivity → Restoration",
    function: "Reset of land, people, worship",
    keyInsight: "@70y governs covenant discipline, not annihilation.",
    corridors: {
      torah: [
        { reference: "Leviticus 26:33-35", description: "Land shall enjoy sabbaths during captivity" },
        { reference: "Deuteronomy 28–30", description: "Curses of exile, then promise of return when hearts turn" }
      ],
      history: [
        { reference: "2 Kings 24–25", description: "Jerusalem falls, temple destroyed, captivity begins" },
        { reference: "Ezra–Nehemiah", description: "Return from Babylon, temple and walls rebuilt" }
      ],
      wisdom: [
        { reference: "Lamentations", description: "Grief over destruction, hope in God's faithfulness" },
        { reference: "Psalm 137", description: "By the rivers of Babylon — exile's sorrow" }
      ],
      prophets: [
        { reference: "Jeremiah 25:11-12", description: "These nations shall serve Babylon 70 years" },
        { reference: "Daniel 9:2", description: "Daniel understood from Jeremiah the 70 years" }
      ],
      gospels: [
        { reference: "Luke 19:41-44", description: "Jesus weeping over Jerusalem's coming desolation" },
        { reference: "Matthew 23:37-38", description: "Your house is left unto you desolate" }
      ],
      epistles: [
        { reference: "Hebrews 8–10", description: "Old covenant system becoming obsolete" },
        { reference: "Revelation 18", description: "Babylon fallen — end of spiritual captivity" }
      ]
    },
    whyItFits: "Each passage involves exile/captivity followed by restoration at God's appointed time.",
    whyOthersDontFit: "Unlike @1260 (truth suppressed), @70y is restorative discipline — God brings His people back."
  },
  {
    code: "@490",
    name: "490 Years — Covenant Confirmation (Messiah)",
    function: "Final probation for covenant people",
    keyInsight: "@490 is Christ-centered time, not ethnic privilege.",
    corridors: {
      torah: [
        { reference: "Exodus 19–24", description: "Covenant framework established at Sinai" },
        { reference: "Leviticus 25", description: "Jubilee logic — 7×7 years leading to release" }
      ],
      history: [
        { reference: "Ezra 7", description: "Artaxerxes' decree — starting point of 70 weeks" },
        { reference: "Nehemiah 2", description: "Jerusalem's walls to be restored — decree confirmed" }
      ],
      wisdom: [
        { reference: "Psalm 40:6-8", description: "I come to do thy will — Messiah's mission" },
        { reference: "Psalm 110", description: "Priest forever after order of Melchizedek" }
      ],
      prophets: [
        { reference: "Daniel 9:24-27", description: "70 weeks determined upon thy people — the prophecy itself" },
        { reference: "Isaiah 53", description: "He was cut off out of the land of the living" }
      ],
      gospels: [
        { reference: "Luke 3:1-23", description: "Jesus baptized — ministry begins at 'about 30'" },
        { reference: "Matthew 15:24", description: "I am not sent but unto the lost sheep of Israel — probation focus" }
      ],
      epistles: [
        { reference: "Hebrews 8–10", description: "New covenant confirmed, old passing away" },
        { reference: "Acts 7", description: "Stephen's martyrdom — probation closing on nation" }
      ]
    },
    whyItFits: "All texts connect to Messiah's coming, covenant confirmation, and Israel's probationary period.",
    whyOthersDontFit: "This is specifically about Christ's atoning work and covenant transition, not general judgment patterns."
  },
  {
    code: "@1260",
    name: "1260 Years — Suppressed Truth Under Counterfeit Authority",
    function: "Long-term distortion of worship and law",
    keyInsight: "@1260 always involves authority replacing truth.",
    corridors: {
      torah: [
        { reference: "Numbers 16", description: "Korah rebellion — false priesthood attempting to usurp" },
        { reference: "Deuteronomy 13", description: "Warnings against prophets who lead away from God's law" }
      ],
      history: [
        { reference: "1 Kings 18–19", description: "Elijah vs Ahab/Jezebel — truth suppressed by state religion" },
        { reference: "2 Chronicles 24:17-22", description: "Apostasy after Jehoiada dies — truth replaced" }
      ],
      wisdom: [
        { reference: "Psalm 94", description: "How long shall the wicked triumph? — cry against oppression" },
        { reference: "Psalm 82", description: "God stands in congregation — judges judged" }
      ],
      prophets: [
        { reference: "Daniel 7:25", description: "Speak words against Most High, wear out saints, change times and laws" },
        { reference: "Daniel 11:31-35", description: "Abomination set up, truth cast down, wise understand" }
      ],
      gospels: [
        { reference: "Matthew 24:15,24", description: "Abomination of desolation, false Christs deceive" },
        { reference: "Luke 21:24", description: "Jerusalem trodden down until times of Gentiles fulfilled" }
      ],
      epistles: [
        { reference: "2 Thessalonians 2:3-4", description: "Man of sin exalts himself above God in temple" },
        { reference: "Revelation 12–13", description: "Dragon, beast, 42 months — war on remnant" }
      ]
    },
    whyItFits: "Every passage shows counterfeit authority suppressing truth and persecuting faithful witnesses.",
    whyOthersDontFit: "Unlike @120 (warning before judgment), @1260 is about enduring through distortion until God vindicates."
  },
  {
    code: "@2300",
    name: "2300 Years — Cosmic Judgment & Cleansing",
    function: "Final moral accounting before restoration",
    keyInsight: "@2300 governs vindication, not fear.",
    corridors: {
      torah: [
        { reference: "Leviticus 16", description: "Day of Atonement — sanctuary cleansed, sins removed" },
        { reference: "Leviticus 23:27-32", description: "Afflict your souls — judgment day solemnity" }
      ],
      history: [
        { reference: "2 Kings 22–23", description: "Josiah's reforms — discovery of law, cleansing of worship" },
        { reference: "Ezra 9–10", description: "Covenant renewal — separation from defilement" }
      ],
      wisdom: [
        { reference: "Ecclesiastes 12:14", description: "God shall bring every work into judgment" },
        { reference: "Psalm 73:16-17", description: "Until I went into the sanctuary — judgment understood" }
      ],
      prophets: [
        { reference: "Daniel 8:14", description: "Unto 2300 days, then shall the sanctuary be cleansed" },
        { reference: "Daniel 12:1-2", description: "Time of trouble, then deliverance for those in the book" }
      ],
      gospels: [
        { reference: "Matthew 22:11-14", description: "King examines guests — investigative judgment language" },
        { reference: "Matthew 25:31-46", description: "Separation of sheep and goats — judgment before kingdom" }
      ],
      epistles: [
        { reference: "Hebrews 9:23-28", description: "Heavenly things purified — Christ appears in presence of God" },
        { reference: "Revelation 14:6-7", description: "Fear God, the hour of His judgment is come" }
      ]
    },
    whyItFits: "All texts deal with final judgment, sanctuary cleansing, and the resolution of the sin problem.",
    whyOthersDontFit: "This is the culminating judgment phase, not probation (@120) or persecution (@1260)."
  }
];

// Helper functions for Scripture Grid
export const getScriptureGridByCode = (code: ProphecyCode): ProphecyScriptureGrid | undefined => {
  return scriptureConnectionGrid.find(g => g.code === code);
};

export const getAllScriptureConnections = (code: ProphecyCode): ScriptureConnection[] => {
  const grid = getScriptureGridByCode(code);
  if (!grid) return [];
  return Object.values(grid.corridors).flat();
};

export const getConnectionsByGenre = (code: ProphecyCode, genre: ScriptureGenre): ScriptureConnection[] => {
  const grid = getScriptureGridByCode(code);
  return grid?.corridors[genre] || [];
};

export const genreLabels: Record<ScriptureGenre, { name: string; icon: string }> = {
  torah: { name: "Torah", icon: "📜" },
  history: { name: "Historical Books", icon: "📚" },
  wisdom: { name: "Wisdom / Poetry", icon: "💎" },
  prophets: { name: "Major Prophets", icon: "🔮" },
  gospels: { name: "Gospels", icon: "✝️" },
  epistles: { name: "Epistles & Revelation", icon: "📖" }
};

// Prophecy Function Questions
export interface ProphecyQuestion {
  question: string;
  explanation: string;
}

export const functionQuestions: ProphecyQuestion[] = [
  { 
    question: "Is probation open or closing?", 
    explanation: "If open → @120 pattern. If closing → @490 or @2300 territory." 
  },
  { 
    question: "Is truth being restored or suppressed?", 
    explanation: "Suppressed → @1260. Restored → @70y or @2300 cleansing." 
  },
  { 
    question: "Is this before, during, or after judgment?", 
    explanation: "Before → @120 warning. During → @2300 investigation. After → New creation." 
  },
  { 
    question: "Which time-function explains this best?", 
    explanation: "Match the pattern: probation, affliction, captivity, covenant, suppression, or judgment." 
  }
];
