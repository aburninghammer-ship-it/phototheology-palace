// Photo-Theology Knowledge Bank
// Backend data for AI/Gems generation - NOT for public display
// A systematic guide to finding Christ in all Scripture

// ============================================
// CORE FRAMEWORK
// ============================================

export interface SixWall {
  id: string;
  name: string;
  focus: string;
  keyQuestion: string;
  description: string;
}

export const sixWalls: SixWall[] = [
  {
    id: 'christ-pattern',
    name: 'Christ Pattern',
    focus: 'The life and work of Jesus',
    keyQuestion: 'How does this reveal Christ?',
    description: 'Every story, character, and event in Scripture points to some aspect of Christ\'s person or work.'
  },
  {
    id: 'sanctuary-pattern',
    name: 'Sanctuary Pattern',
    focus: 'The sanctuary service and its meaning',
    keyQuestion: 'How does this connect to salvation\'s plan?',
    description: 'The sanctuary service provides the framework for understanding salvation\'s plan and Scripture\'s structure.'
  },
  {
    id: 'prophetic-pattern',
    name: 'Prophetic Pattern',
    focus: 'Time prophecies (70 weeks, 1260, 2300)',
    keyQuestion: 'Where are we in prophetic time?',
    description: 'The time prophecies provide chronological markers that structure Scripture and history.'
  },
  {
    id: 'historic-pattern',
    name: 'Historic Pattern',
    focus: "Ancient Israel's experience",
    keyQuestion: "How does Israel's history repeat?",
    description: "The history of ancient Israel provides a template that repeats in church history and individual experience."
  },
  {
    id: 'gospel-floor',
    name: 'Gospel Floor',
    focus: 'The foundation of salvation',
    keyQuestion: 'What is the good news here?',
    description: 'The foundation of salvation by grace through faith underlies every passage.'
  },
  {
    id: 'heaven-ceiling',
    name: 'Heaven Ceiling',
    focus: 'The heavenly reality',
    keyQuestion: 'What does this reveal about heaven?',
    description: "Every passage illuminates heavenly realities — either the great controversy's origin, Christ's present ministry, or future fulfillment."
  }
];

export interface SixDimension {
  id: string;
  name: string;
  definition: string;
  questionsToAsk: string[];
}

export const sixDimensions: SixDimension[] = [
  {
    id: 'literal',
    name: 'Literal',
    definition: 'The historical, grammatical, surface meaning — what actually happened.',
    questionsToAsk: [
      'Who are the people involved?',
      'What is the historical context?',
      'What actually occurred?',
      'What was the immediate significance?'
    ]
  },
  {
    id: 'christ',
    name: 'Christ (Christological)',
    definition: 'How the passage typifies, prophesies, or reveals Jesus Christ.',
    questionsToAsk: [
      'Who represents Christ in this story?',
      "What aspect of Christ's work is revealed?",
      'What office of Christ is displayed (Prophet, Priest, King)?',
      'How does this point to the cross, resurrection, or ministry?'
    ]
  },
  {
    id: 'personal',
    name: 'Personal (Me)',
    definition: 'How the passage applies to my individual spiritual journey.',
    questionsToAsk: [
      'What is my Goliath?',
      'What does God ask of me in this situation?',
      'How must I exercise faith?',
      'What promise can I claim?'
    ]
  },
  {
    id: 'church',
    name: 'Church (Ecclesiological)',
    definition: "How the passage applies to God's corporate people throughout history.",
    questionsToAsk: [
      "How does this relate to the church's mission?",
      'What corporate experience does this illustrate?',
      'How does church history reflect this pattern?'
    ]
  },
  {
    id: 'heaven-future',
    name: 'Heaven Future (Eschatological)',
    definition: 'How the passage reveals future fulfillment or heavenly realities.',
    questionsToAsk: [
      'What end-time event does this foreshadow?',
      'What heavenly reality is illustrated?',
      'How will this be ultimately fulfilled?'
    ]
  },
  {
    id: 'heaven-past',
    name: 'Heaven Past (Great Controversy)',
    definition: "How the passage illuminates the conflict that began in heaven before earth's creation.",
    questionsToAsk: [
      'How does this reflect the original controversy?',
      "What does this reveal about Satan's character or methods?",
      "How does this show God's character vindicated?"
    ]
  }
];

// ============================================
// DIMENSIONAL EXAMPLES
// ============================================

export interface DimensionalExample {
  topic: string;
  dimensions: {
    literal: string;
    christ: string;
    personal: string;
    church: string;
    heavenFuture?: string;
    heavenPast?: string;
  };
}

export const dimensionalExamples: DimensionalExample[] = [
  {
    topic: 'The Sanctuary',
    dimensions: {
      literal: 'The Levitical priesthood served in the earthly tabernacle',
      christ: 'Christ is our High Priest in the heavenly sanctuary',
      personal: 'I am a priest in Christ (1 Peter 2:9)',
      church: 'The priesthood of all believers',
      heavenFuture: 'The actual priesthood ministering in heaven now'
    }
  },
  {
    topic: 'Jacob and Esau',
    dimensions: {
      literal: 'Jacob gains the blessing over his older twin brother',
      christ: 'Christ gains the blessing over Satan (the original "firstborn" angel)',
      personal: 'The new man gains ascendancy over the old man',
      church: 'Spiritual Israel receives the blessing over literal Israel',
      heavenFuture: 'Those born twice inherit over the wicked at the end'
    }
  },
  {
    topic: 'The Exodus',
    dimensions: {
      literal: "Israel's exodus from Egypt",
      christ: "Christ's exodus from the grave",
      personal: 'My exodus from sin',
      church: "The remnant's exodus from Babylon",
      heavenFuture: 'The final exodus from this world to heaven'
    }
  },
  {
    topic: 'Joseph',
    dimensions: {
      literal: 'Joseph hated by brothers; they come to him in famine',
      christ: 'Christ hated by His own; they must come to Him',
      personal: 'You will be hated by your own; be faithful, God will bring them to truth',
      church: 'The church hated by other churches; they will come in the end',
      heavenFuture: "Wicked humanity hates God's people; will bow before them at the end"
    }
  },
  {
    topic: "Jacob's Wrestling",
    dimensions: {
      literal: 'Jacob wrestles with the Angel; Esau marches against him',
      christ: 'Christ wrestles in the Garden; Pharisees march against Him',
      personal: 'Personal wrestle with God; personal enemies march against me',
      church: "Jacob's time of trouble; end-time Esaus march against end-time Jacobs",
      heavenFuture: 'Esaus march against Jacobs at the end of the millennium'
    }
  },
  {
    topic: 'Noah and the Ark',
    dimensions: {
      literal: 'Noah and Ark: Wicked removed by flood',
      christ: 'Christ is the Ark; takes us from old to new; removed from the wicked',
      personal: 'I must be in the Ark; journey from old to new; lead others to safety',
      church: 'Church invites people into the Ark of safety',
      heavenFuture: 'Christ takes people from old world to new at Second Coming'
    }
  },
  {
    topic: "Isaac's Birth",
    dimensions: {
      literal: "Isaac's miraculous birth",
      christ: "Christ's miraculous birth",
      personal: 'My miraculous new birth',
      church: "The miraculous birth of God's church",
      heavenFuture: 'The literal new birth at the Second Coming (glorified bodies)'
    }
  },
  {
    topic: 'Pearl of Great Price',
    dimensions: {
      literal: 'Man sells all for the pearl',
      christ: 'Christ sold all He had in heaven for earth',
      personal: 'I sell all I have for the kingdom',
      church: 'We want the field!',
      heavenFuture: 'The actual transaction: gaining heaven'
    }
  },
  {
    topic: 'Elijah to Elisha',
    dimensions: {
      literal: 'Transition of power at the Jordan: Elijah decreases, Elisha increases',
      christ: 'Transition at the Jordan: John the Baptist decreases, Jesus increases',
      personal: 'Transition at baptism: Self decreases, new man increases',
      church: 'Transition at Pentecost: Israel decreases, spiritual Israel increases',
      heavenFuture: 'Transition at Second Coming: Wicked decrease, righteous increase'
    }
  }
];

// ============================================
// OLD TESTAMENT OFFICES FULFILLED IN CHRIST
// ============================================

export interface ChristOffice {
  office: string;
  otRole: string;
  christFulfillment: string;
  timeframe: string;
}

export const christOffices: ChristOffice[] = [
  {
    office: 'Prophet',
    otRole: "Spoke God's word",
    christFulfillment: "Christ's earthly ministry",
    timeframe: 'His life on earth'
  },
  {
    office: 'Priest',
    otRole: 'Mediated between God and man',
    christFulfillment: "Christ's heavenly intercession",
    timeframe: 'Ascension to present'
  },
  {
    office: 'Judge',
    otRole: 'Rendered verdicts',
    christFulfillment: 'Christ in the investigative judgment',
    timeframe: '1844 to close of probation'
  },
  {
    office: 'King',
    otRole: 'Ruled the nation',
    christFulfillment: "Christ's eternal reign",
    timeframe: 'Second Coming onward'
  }
];

// ============================================
// CHRIST IN THE PENTATEUCH
// ============================================

export interface PentateuchChristPattern {
  book: string;
  christTitle: string;
  pattern: string[];
  christFulfillment: string[];
  personalApplication?: string[];
}

export const pentateuchChristPatterns: PentateuchChristPattern[] = [
  {
    book: 'Genesis',
    christTitle: 'The Second Adam',
    pattern: [
      'Genesis 1-2: Creation, introduction to sin (Adam)',
      'Genesis 3-11: Results of sin (Noah)',
      'Genesis 12-20: Birth of a nation (Abraham)',
      'Genesis 21-25: Isaac and the sacrifice',
      'Genesis 27-34: Transitions — older to younger, prosperity, time of trouble',
      'Genesis 36-50: Joseph sent ahead to prepare a place'
    ],
    christFulfillment: [
      'Creation of the world, sin enters',
      'Results of sin unfold',
      'Birth of spiritual Israel',
      'Christ and His sacrifice',
      'Transition from old to new covenant',
      'Christ sent ahead to prepare a place (John 14:2-3)'
    ]
  },
  {
    book: 'Exodus',
    christTitle: 'Drawn from Waters',
    pattern: [
      'Chapters 1-4: Birth, drawn from water, sent',
      'Chapters 6-12: Preaching, miracles, Passover, exodus',
      'Chapters 14-20: Red Sea, wilderness church, Ten Commandments',
      'Chapters 24-33: Moses ascends, sanctuary revealed, apostasy below, Moses returns',
      'Chapters 35-40: Temple completed, glory of God descends'
    ],
    christFulfillment: [
      "Christ's birth, baptism (drawn from water), sent by the Father",
      'Preaching, miracles, becomes our Passover, leads exodus from sin',
      'Death (Red Sea), Pentecost, Ten Commandments magnified',
      "Christ ascends, heavenly sanctuary, apostasy below, Christ returns",
      "Church completed, glory of God fills the temple (His people)"
    ],
    personalApplication: [
      'My new birth, baptism, being sent',
      'Preaching, leading others from sin',
      'Leading others to meet God',
      "Learning the sanctuary message, preparing for Jesus' return",
      'Completing my part in building the church'
    ]
  },
  {
    book: 'Leviticus',
    christTitle: 'The Priestly Work',
    pattern: [
      'Chapters 1-7: Sacrificial system',
      'Chapters 8-9: Priesthood established',
      'Chapter 10: False priesthood judged',
      'Chapter 11: Clean and unclean',
      'Chapters 12-15: Purification laws',
      'Chapters 16-17: Day of Atonement',
      'Chapters 18-22: Moral laws',
      'Chapter 23: Feast days',
      'Chapters 24-26: Sabbath, blasphemy, jubilee, land rest'
    ],
    christFulfillment: [
      "Christ's sacrifice",
      'New church and true priesthood',
      'False priesthood removed',
      'No distinction — Jew and Gentile',
      'Work of cleansing from sin',
      'Day of Atonement — judgment',
      "Babylon's abominations declared",
      'Full gospel preached',
      'Sabbath truth, millennium'
    ]
  },
  {
    book: 'Numbers',
    christTitle: 'Leading the Twelve, Ordaining the Seventy',
    pattern: [
      'Chapters 1-8: Setting up of Israel',
      'Chapter 9: Passover',
      'Chapter 10: Journey from Sinai',
      'Chapters 11-15: Fear, doubt, giants',
      'Chapter 16: Korah\'s rebellion — hijacking the priesthood',
      'Chapters 17-19: True priesthood determined',
      'Chapter 20: Water from the rock',
      'Chapter 21: Bronze serpent lifted — healing',
      'Chapters 22-25: Borders of Canaan, shaking',
      'Chapters 26-36: Preparation to enter'
    ],
    christFulfillment: [
      'Old Testament church established',
      'Sacrifice of Christ',
      'Journey of New Testament church',
      'Doubt and compromise arise',
      'Papal authority hijacks the priesthood',
      'True priesthood determined',
      'Living water provided',
      'Christ lifted up brings healing',
      'Borders of the Promised Land (heaven)',
      'Preparations to enter glory'
    ]
  },
  {
    book: 'Deuteronomy',
    christTitle: 'Final Words, Song, Dies Alone',
    pattern: [
      'Chapters 1-20: History reviewed, final words',
      'Chapters 27-28: Blessings and curses',
      'Chapters 29-30: Covenant repeated',
      'Chapters 31-34: Final song, Moses goes out alone to die'
    ],
    christFulfillment: [
      "Christ's final discourse (John 14-17)",
      'Blessings and curses proclaimed',
      'New covenant established (Last Supper)',
      'Christ sings a hymn, goes out alone to die (Matthew 26:30)'
    ]
  }
];

// ============================================
// CHRIST IN HISTORICAL BOOKS
// ============================================

export interface HistoricalChristPattern {
  book: string;
  christTitle: string;
  pattern: string[];
  christFulfillment: string[];
}

export const historicalChristPatterns: HistoricalChristPattern[] = [
  {
    book: 'Joshua',
    christTitle: 'The Final Battle with a Shout',
    pattern: [
      'Chapters 1-6: Joshua (Yeshua), baptism at Jordan, time of trouble begins',
      'Chapters 6-22: Jericho falls with a shout, victories, territories conquered',
      'Chapters 23-24: Joshua dies'
    ],
    christFulfillment: [
      'Jesus baptized, wilderness temptation',
      "Satan's kingdom falls at the cross with a loud cry, victory, earth conquered",
      'Jesus dies, then rises'
    ]
  },
  {
    book: 'Judges',
    christTitle: 'The Church Advances, Then Compromises',
    pattern: [
      "Chapters 1-2: After Joshua's death, Israel conquers but compromises",
      'Chapters 3-12: Cycles of compromise and victory',
      'Chapters 13-17: Samson and Delilah — the harlot seduces the strong',
      "Chapter 18: Micah's counterfeit religion, false priesthood",
      'Chapters 19-21: Civil war, chaotic times'
    ],
    christFulfillment: [
      "After Jesus' death, church conquers but compromises",
      'Cycles of revival and apostasy',
      'The harlot church seduces the true church',
      'Counterfeit priesthood established (papacy)',
      'Dark ages, chaotic times'
    ]
  },
  {
    book: 'Ruth',
    christTitle: 'The Gentile Woman in the Field',
    pattern: [
      'Chapter 1: Two Gentile daughters-in-law, one follows the Hebrew mother',
      'Chapter 2: Ruth works in the harvest field, attracts Boaz',
      'Chapters 3-4: Boaz redeems Ruth and the land'
    ],
    christFulfillment: [
      'True and false church at harvest time',
      'True church works in the harvest field, attracts Christ',
      'Christ redeems His bride and the earth'
    ]
  },
  {
    book: '1 Samuel',
    christTitle: 'The Priesthood Transition',
    pattern: [
      'Chapters 1-4: Samuel\'s miraculous birth, called to priesthood, false priests removed',
      'Chapters 5-7: Victories under Samuel',
      'Chapters 8-15: People reject Samuel for a king (state/church union)',
      'Chapters 16-19: David receives kingdom though not yet ruling',
      'Chapters 21-25: Many desert Saul to join David (hidden from sight)',
      'Chapters 28-31: Saul connects with spiritualism, cut off'
    ],
    christFulfillment: [
      "Christ's miraculous birth, called to priesthood, earthly priesthood ends",
      'Victories under Christ (early church)',
      'People reject Christ for earthly power (papacy)',
      'Christ receives kingdom in 1844, though not yet reigning visibly',
      'Many leave Babylon to join Christ',
      'Babylon connects with spiritualism, will be cut off'
    ]
  },
  {
    book: '2 Samuel',
    christTitle: 'The Kingdom United',
    pattern: [
      'Chapters 1-11: David unites the kingdom',
      'Chapters 13-24: Absalom seeks to usurp the throne, is defeated; David weeps'
    ],
    christFulfillment: [
      'Christ will unite the kingdom at the Second Coming',
      'Satan seeks to usurp the throne, is defeated; God weeps over the lost (His "strange act")'
    ]
  }
];

// ============================================
// CHRIST IN RESTORATION BOOKS
// ============================================

export interface RestorationChristPattern {
  book: string;
  christTitle: string;
  pattern: string[];
  christFulfillment: string[];
  churchFulfillment?: string[];
}

export const restorationChristPatterns: RestorationChristPattern[] = [
  {
    book: 'Ezra',
    christTitle: 'Restoration of Sanctuary and Worship',
    pattern: [
      'Three decrees to restore Jerusalem',
      'Focus on rebuilding the temple',
      'Focus on restoring the law'
    ],
    christFulfillment: [
      "First Angel's Message — attention to the sanctuary (1840s)",
      "Second Angel's Message — opposition but work continues",
      "Third Angel's Message — autonomy of God's people, law restored"
    ]
  },
  {
    book: 'Nehemiah',
    christTitle: 'Rebuilding the Walls',
    pattern: [
      "Chapter 1: Nehemiah moved by Jerusalem's deplorable condition",
      'Chapter 2: Journeys to survey and move people to action',
      'Chapters 3-6: Builds the wall, will not come down (52 days)',
      'Chapters 7-9: Those not in the genealogy removed, revival',
      'Chapter 10: Sealing and Sabbath reform',
      'Chapters 11-12: Filling the city',
      'Chapter 13: Sabbath-breakers cannot enter'
    ],
    christFulfillment: [
      "Christ moved by earth's sinful condition",
      'Christ leaves heaven to survey and call to action',
      'Christ on the cross — will not come down',
      'New Testament church — revival, transition',
      "Sealing of God's people, Sabbath",
      'New Jerusalem filled',
      'Sabbath-keepers excluded from the city'
    ],
    churchFulfillment: [
      'Church returns to rebuild after spiritual desolation',
      'They build the wall — Sabbath truth',
      'Opposition but work continues',
      'Sealing takes place',
      'Only Sabbath-keepers enter the city'
    ]
  },
  {
    book: 'Esther',
    christTitle: 'The Death Decree and Deliverance',
    pattern: [
      'Chapters 1-2: Transition from Vashti to Esther',
      "Chapter 3: Haman angry, death decree against God's people",
      'Chapters 4-5: Esther fasts and prays, goes before the king',
      'Chapter 6: Haman forced to honor Mordecai',
      'Chapters 7-10: Banquet, Haman hanged, Mordecai exalted'
    ],
    christFulfillment: [
      'Old covenant to new covenant church',
      "Satan angry, death decree (Sunday law) against God's people",
      'Church in prayer, going before the King (Day of Atonement)',
      'Satan forced to honor Christ (end of millennium)',
      'Satan defeated, Christ exalted'
    ]
  }
];

// ============================================
// CHRIST IN WISDOM BOOKS
// ============================================

export interface WisdomChristPattern {
  book: string;
  christConnection: string;
  dimensionalApplication: Record<string, string>;
}

export const wisdomChristPatterns: WisdomChristPattern[] = [
  {
    book: 'Job',
    christConnection: 'The Great Controversy on Trial',
    dimensionalApplication: {
      literal: 'Job tried, attempts to prove Job guilty, must go through Job for forgiveness',
      christ: 'Christ tried, attempts to prove Christ guilty, go through Christ for forgiveness',
      personal: 'I am tried, attempts to prove me unworthy, I intercede for enemies',
      church: 'Church tried, attempts to prove church guilty, church intercedes for enemies',
      heavenFuture: 'Jesus tried (Second Coming), attempts to prove Christianity tyrannical, every knee bows',
      heavenPast: 'Christ challenged in heaven, attempts to prove God tyrannical, Satan and angels cast out'
    }
  },
  {
    book: 'Psalms',
    christConnection: "Five Books Revealing Christ's Journey",
    dimensionalApplication: {
      book1: 'Psalms 1-41: God protects the just → God will protect His Christ',
      book2: 'Psalms 42-72: Sufferings and trials → Christ\'s sufferings and trials',
      book3: 'Psalms 73-89: Sanctuary holds answers → Christ\'s ministry in heavenly sanctuary',
      book4: 'Psalms 90-106: God\'s kingdom rules → Christ\'s Second Coming, millennium',
      book5: 'Psalms 107-150: Praise and deliverance → Final deliverance, eternal praise'
    }
  },
  {
    book: 'Proverbs',
    christConnection: 'Wisdom and the Two Women',
    dimensionalApplication: {
      wisdom: 'Wisdom personified as a woman',
      strangeWoman: 'Babylon, the harlot church',
      virtuousWoman: "The true church, Christ's bride (Proverbs 31)",
      wiseVsFoolish: 'The ten virgins (Matthew 25)'
    }
  },
  {
    book: 'Song of Solomon',
    christConnection: 'The Bridegroom Comes',
    dimensionalApplication: {
      chapter1: 'Bride looking for the Bridegroom → The church longs for Christ',
      chapter2: 'Expects His coming → Expectation of the Second Coming',
      chapter3: 'Cannot find Him — disappointment → 1844 Great Disappointment',
      chapter4: 'Time of trouble, winds blow → Time of trouble before final union'
    }
  }
];

// ============================================
// CHRIST IN MAJOR PROPHETS
// ============================================

export interface MajorProphetChristPattern {
  book: string;
  christTitle: string;
  pattern: string[];
  christFulfillment: string[];
}

export const majorProphetChristPatterns: MajorProphetChristPattern[] = [
  {
    book: 'Isaiah',
    christTitle: 'Suffering Servant and New Creation',
    pattern: [
      'The Suffering Servant (Isaiah 53)',
      'The earth broken, prisoners in the pit (Isaiah 24:19-22)',
      'New heavens and new earth (Isaiah 65:17)'
    ],
    christFulfillment: [
      'Christ\'s atoning sacrifice',
      'Millennium, Satan bound',
      'New creation after sin is destroyed'
    ]
  },
  {
    book: 'Jeremiah',
    christTitle: 'Persecution and the New Covenant',
    pattern: [
      'Chapters 1-10: Jeremiah prophesies against Israel',
      'Chapters 11-28: Jeremiah plotted against, persecuted',
      'Chapters 29-33: New covenant, buys a field',
      'Chapters 34-39: Destruction of Jerusalem',
      'Chapters 40-51: Warnings against Egypt alliance, fall of Babylon'
    ],
    christFulfillment: [
      'Jesus prophesies against Israel',
      'Jesus plotted against, persecuted',
      'Jesus and the new covenant, purchases the earth',
      'Destruction of Jerusalem (AD 70)',
      'Warnings against worldly alliances, fall of spiritual Babylon'
    ]
  },
  {
    book: 'Ezekiel',
    christTitle: 'Glory Departs, Glory Returns',
    pattern: [
      'Chapters 1-3: Ezekiel commissioned to speak to stubborn people',
      'Chapters 4-9: Prophesies against temple abominations',
      'Chapter 10: Glory of God leaves the temple',
      'Chapter 11: Glory leaves the city, stands on the eastern side',
      'Chapters 12-24: Destruction prophesied, remnant raised',
      'Chapters 25-32: Prophecies against nations',
      'Chapters 33-36: Ezekiel the watchman, revival promised',
      'Chapter 37: Resurrection (dry bones)',
      'Chapters 38-39: Gog and Magog',
      'Chapters 40-48: New Jerusalem described'
    ],
    christFulfillment: [
      'Jesus commissioned to speak to stubborn people',
      'Jesus speaks against temple abominations',
      'Jesus leaves the temple desolate (Matthew 23:38)',
      'Jesus leaves the city, stands on the Mount of Olives',
      'Jerusalem destroyed, a new people raised',
      'Gospel to the nations',
      'End-time watchmen, revival',
      "Resurrection at Christ's coming",
      'Final battle',
      'New Jerusalem'
    ]
  },
  {
    book: 'Daniel',
    christTitle: 'The Kingdom That Will Not Pass Away',
    pattern: [
      'Chapter 1: Daniel in a strange land because of sin; appetite test',
      'Chapter 2: Kingdoms fall from pride; stone to foot',
      'Chapter 3: Bow down to image',
      'Chapter 4: Tree representing kingdom cut down',
      'Chapter 5: Kingdom finished; Cyrus opens gates',
      "Chapter 6: Coming up from lions' den",
      'Chapter 7: 1260 years; little horn',
      'Chapter 8: 2300 days; sanctuary cleansed',
      'Chapter 9: Daniel\'s intercession; new people chosen',
      'Chapters 10-12: End-time vision; book sealed'
    ],
    christFulfillment: [
      'Matthew 1-3: Christ comes because of sin; first temptation',
      'Matthew 3: Kingdom established; stone destroys image',
      'Matthew 4: Satan demands worship',
      'Matthew 27: Tree (cross) establishes kingdom',
      'Matthew 27: "It is finished"; temple veil rent',
      'Matthew 28: Resurrection',
      "Hebrews 8: Attack on Christ's ministry",
      'Revelation 11:19: Christ moves to Most Holy (1844)',
      "Revelation 12:17: Christ's intercession; remnant",
      'Revelation 10: Little book opened; prophesy again'
    ]
  }
];

// ============================================
// CHRIST IN MINOR PROPHETS
// ============================================

export interface MinorProphetChristPattern {
  prophet: string;
  literalMessage: string;
  christEndTimeApplication: string;
}

export const minorProphetChristPatterns: MinorProphetChristPattern[] = [
  { prophet: 'Hosea', literalMessage: "Take a harlot as wife; God's love", christEndTimeApplication: "Christ's love for unfaithful church" },
  { prophet: 'Joel', literalMessage: 'Israel desolated; call to fast; early rain', christEndTimeApplication: 'Israel left desolate; early rain at Pentecost; latter rain coming' },
  { prophet: 'Amos', literalMessage: 'Judgment; shaking; famine of the word; remnant delivered', christEndTimeApplication: 'Investigative judgment; shaking; probation closes; remnant delivered' },
  { prophet: 'Obadiah', literalMessage: 'Judgment against Edom', christEndTimeApplication: 'God vindicates His persecuted people' },
  { prophet: 'Jonah', literalMessage: 'God saves even Nineveh', christEndTimeApplication: 'Gethsemane, death, burial, resurrection; God saves the repentant' },
  { prophet: 'Micah', literalMessage: 'Judgment, then peace', christEndTimeApplication: 'Judgment, then millennium' },
  { prophet: 'Nahum', literalMessage: "Fall of Nineveh (Israel's enemy)", christEndTimeApplication: 'Three Angels announce fall of Babylon' },
  { prophet: 'Habakkuk', literalMessage: 'Current reign of enemies; "just shall live by faith"; vision; glorious appearing', christEndTimeApplication: "Babylon's reign; Three Angels' Messages; glorious appearing" },
  { prophet: 'Zephaniah', literalMessage: 'Investigative judgment; last call of mercy; remnant saved', christEndTimeApplication: 'Same pattern for end times' },
  { prophet: 'Haggai', literalMessage: "Repent and build the Lord's house; the Desire of Ages will come", christEndTimeApplication: "Church's work in last days; Spirit will fill the completed temple" },
  { prophet: 'Zechariah', literalMessage: 'Restored temple; feet on Mount of Olives', christEndTimeApplication: "Christ's return to Mount of Olives (Acts 1:11)" },
  { prophet: 'Malachi', literalMessage: 'Fear of the Lord; married daughter of strange god; Elijah; destruction by fire', christEndTimeApplication: "First Angel's Message; Second Angel's Message; Third Angel's/Latter Rain; destruction of wicked" }
];

// ============================================
// SANCTUARY JOURNEY
// ============================================

export interface SanctuaryStation {
  station: string;
  object: string;
  meaning: string;
  personal: string;
  scripture: string;
  christ?: string;
  church?: string;
  heaven?: string;
}

export const sanctuaryJourney: SanctuaryStation[] = [
  {
    station: 'Courtyard',
    object: 'Altar of Sacrifice',
    meaning: "Christ's Death",
    personal: 'I must die to self',
    scripture: 'Gospels',
    christ: 'Lamb slain',
    church: "Built on Christ's sacrifice",
    heaven: 'Self-sacrificing love'
  },
  {
    station: 'Courtyard',
    object: 'Laver',
    meaning: 'Baptism',
    personal: 'I must be born again',
    scripture: 'Acts',
    christ: "Christ's baptism",
    church: 'Pentecost',
    heaven: 'Purity'
  },
  {
    station: 'Holy Place',
    object: 'Table of Shewbread',
    meaning: 'Word of God',
    personal: 'I must study',
    scripture: 'Romans-Jude',
    christ: 'Bread from Heaven',
    church: 'Conflict over Word',
    heaven: 'Word as basis of heaven'
  },
  {
    station: 'Holy Place',
    object: 'Altar of Incense',
    meaning: 'Prayer',
    personal: 'I must pray',
    scripture: 'Romans-Jude',
    christ: "Christ's righteousness",
    church: 'Prayer',
    heaven: 'Communion'
  },
  {
    station: 'Holy Place',
    object: 'Candlestick',
    meaning: 'Witnessing/Light',
    personal: 'I must let my light shine',
    scripture: 'Romans-Jude',
    christ: 'Light of the World',
    church: 'City on a hill',
    heaven: 'Light'
  },
  {
    station: 'Most Holy',
    object: 'Ark of Covenant',
    meaning: "God's Presence/Law",
    personal: 'I must keep commandments',
    scripture: 'Revelation',
    christ: 'Perfection',
    church: '1844; Ark of Covenant',
    heaven: 'Law as basis of heaven'
  }
];

// ============================================
// FEAST DAY PATTERNS
// ============================================

export interface FeastDayPattern {
  feast: string;
  timing: string;
  event: string;
  ntFulfillment: string;
  christ?: string;
  personal?: string;
  church?: string;
  heaven?: string;
}

export const feastDayPatterns: FeastDayPattern[] = [
  {
    feast: 'Passover',
    timing: 'Nisan 14',
    event: 'Lamb slain',
    ntFulfillment: "Christ's death",
    christ: "Christ's death",
    personal: 'My death to self',
    church: 'Church born at cross',
    heaven: 'Lamb slain from foundation'
  },
  {
    feast: 'Unleavened Bread',
    timing: 'Nisan 15-21',
    event: 'Purging leaven',
    ntFulfillment: "Christ's burial; sinless life",
    christ: "Christ's burial",
    personal: 'Purging sin',
    church: 'Sanctification',
    heaven: 'Purity'
  },
  {
    feast: 'Firstfruits',
    timing: 'Nisan 16',
    event: 'Wave offering',
    ntFulfillment: "Christ's resurrection",
    christ: "Christ's resurrection",
    personal: 'My resurrection to new life',
    church: 'Church rises',
    heaven: 'First resurrection'
  },
  {
    feast: 'Pentecost',
    timing: '50 days later',
    event: 'Harvest begins',
    ntFulfillment: 'Holy Spirit poured out',
    christ: 'Priestly inauguration',
    personal: 'Inaugurated as priest',
    church: 'Pentecost',
    heaven: 'Angels witness'
  },
  {
    feast: 'Trumpets',
    timing: 'Tishri 1',
    event: 'Alarm sounded',
    ntFulfillment: 'Gospel warnings',
    christ: 'Gospel alarm',
    personal: 'Sound an alarm',
    church: 'Gospel alarm',
    heaven: 'Battle alarm'
  },
  {
    feast: 'Day of Atonement',
    timing: 'Tishri 10',
    event: 'Judgment',
    ntFulfillment: '1844; Investigative Judgment',
    christ: 'Judgment',
    personal: 'I go through judgment',
    church: '1844',
    heaven: 'Satan cast out'
  },
  {
    feast: 'Tabernacles',
    timing: 'Tishri 15-22',
    event: 'Celebration',
    ntFulfillment: "Heaven; God dwelling with His people",
    christ: 'Tabernacles with man',
    personal: 'Tabernacle with God',
    church: 'Millennium',
    heaven: 'Heaven in peace'
  }
];

// ============================================
// TIME PROPHECIES
// ============================================

export interface TimeProphecy {
  prophecy: string;
  duration: string;
  startingPoint: string;
  endingPoint: string;
  focus: string;
  personalMeaning?: string;
}

export const timeProphecies: TimeProphecy[] = [
  {
    prophecy: '70 Weeks',
    duration: '490 years',
    startingPoint: '457 BC',
    endingPoint: 'AD 34',
    focus: "Messiah's ministry established",
    personalMeaning: 'When anyone genuinely accepts Christ'
  },
  {
    prophecy: '1260 Days',
    duration: '1260 years',
    startingPoint: 'AD 538',
    endingPoint: '1798',
    focus: 'Papal supremacy; temple cast down',
    personalMeaning: 'All who are under false religion, atheism, or have moved from 70 to 1260'
  },
  {
    prophecy: '2300 Days',
    duration: '2300 years',
    startingPoint: '457 BC',
    endingPoint: '1844',
    focus: 'Sanctuary cleansed; judgment begins',
    personalMeaning: "When anyone is being cleansed according to the Three Angels' Messages"
  }
];

// ============================================
// WATERS OF SCRIPTURE
// ============================================

export interface WaterInScripture {
  water: string;
  location: string;
  meaning: string;
}

export const watersOfScripture: WaterInScripture[] = [
  { water: 'Rivers of Eden', location: 'Genesis 1-2', meaning: 'Paradise; paradise lost' },
  { water: 'Nile', location: 'Exodus 1-2', meaning: 'Captivity to sin/bondage' },
  { water: 'Red Sea', location: 'Exodus 14-16', meaning: 'Deliverance from sin through sacrifice' },
  { water: 'Jordan', location: 'Joshua 1-3', meaning: 'Israel baptized; ready to conquer' },
  { water: 'Cherith', location: '1 Kings 17:1-3', meaning: 'Protection in wilderness (1260/3.5 years)' },
  { water: 'Chebar', location: 'Ezekiel 1, 10', meaning: 'Called to speak of temple abominations (reformation)' },
  { water: 'Mediterranean', location: 'Daniel 7', meaning: 'Little horn identified' },
  { water: 'Ulai', location: 'Daniel 8', meaning: 'Cleansing of sanctuary (1844)' },
  { water: 'Hiddekel', location: 'Daniel 10-12', meaning: "Perfecting of God's people; end-time vision" },
  { water: 'Sea of Galilee', location: 'Gospels', meaning: 'Multitudes healed and saved' },
  { water: 'Brook Cedron', location: 'John 18:1', meaning: 'Gethsemane' },
  { water: 'Euphrates', location: 'Revelation 16', meaning: 'Drying up of enemy forces' },
  { water: 'River of Life', location: 'Revelation 21-22', meaning: 'Paradise restored' }
];

// ============================================
// CHRIST-CHURCH PARALLEL
// ============================================

export interface ChristChurchParallel {
  christLife: string;
  churchExperience: string;
}

export const christChurchParallels: ChristChurchParallel[] = [
  { christLife: 'Birth of Christ', churchExperience: 'Birth of the church at Pentecost' },
  { christLife: 'Baptism of Christ', churchExperience: 'Baptism of the church at Pentecost' },
  { christLife: 'Wilderness, sorely tried', churchExperience: 'Church goes into wilderness for 1260 years' },
  { christLife: 'Cleanses temple (46 years old)', churchExperience: 'Church emerges with sanctuary message (1798-1844 = 46 years)' },
  { christLife: 'Preaching, teaching, healing', churchExperience: "Church preaches Three Angels' Messages, health message" },
  { christLife: 'Persecution because of Sabbath (Matthew 12:14)', churchExperience: 'Persecution will come because of Sabbath' },
  { christLife: 'Transfigured, strengthened for final trial', churchExperience: 'Final outpouring of Spirit in preparation for trouble' },
  { christLife: 'Temple purified, temple left desolate', churchExperience: 'Church purified, Babylon declared desolate' },
  { christLife: 'Death sentence, death, burial, resurrection', churchExperience: 'Death decree, death, burial, resurrection of saints' }
];

// ============================================
// KEY VERSES BY BOOK
// ============================================

export interface KeyVerseByBook {
  book: string;
  christConnection: string;
  keyVerse: string;
}

export const keyVersesByBook: KeyVerseByBook[] = [
  { book: 'Genesis', christConnection: 'Second Adam', keyVerse: '3:15 — Seed of the woman' },
  { book: 'Exodus', christConnection: 'Deliverer', keyVerse: '12:13 — Blood on doorpost' },
  { book: 'Leviticus', christConnection: 'High Priest', keyVerse: '17:11 — Life in the blood' },
  { book: 'Numbers', christConnection: 'Bronze serpent', keyVerse: '21:9 — Look and live' },
  { book: 'Deuteronomy', christConnection: 'Prophet', keyVerse: '18:15 — Prophet like Moses' },
  { book: 'Joshua', christConnection: 'Captain', keyVerse: "5:14 — Commander of Lord's army" },
  { book: 'Judges', christConnection: 'Deliverer', keyVerse: '2:16 — Raised up judges' },
  { book: 'Ruth', christConnection: 'Kinsman-Redeemer', keyVerse: '4:14 — Redeemer' },
  { book: 'Samuel', christConnection: 'Anointed King', keyVerse: '2 Sam 7:16 — Throne established' },
  { book: 'Kings/Chronicles', christConnection: 'Temple Builder', keyVerse: '1 Kings 8:27 — Heaven cannot contain' },
  { book: 'Ezra', christConnection: 'Restorer', keyVerse: '1:1 — Return to build' },
  { book: 'Nehemiah', christConnection: 'Wall Builder', keyVerse: '6:15 — Wall finished' },
  { book: 'Esther', christConnection: 'Advocate', keyVerse: '4:14 — For such a time' },
  { book: 'Job', christConnection: 'Redeemer', keyVerse: '19:25 — I know my Redeemer lives' },
  { book: 'Psalms', christConnection: 'Shepherd, King', keyVerse: '23:1; 24:10 — Lord of Hosts' },
  { book: 'Proverbs', christConnection: 'Wisdom', keyVerse: '8:22 — Wisdom from beginning' },
  { book: 'Ecclesiastes', christConnection: 'Preacher', keyVerse: '12:13 — Fear God, keep commands' },
  { book: 'Song of Solomon', christConnection: 'Bridegroom', keyVerse: '2:16 — My beloved is mine' },
  { book: 'Isaiah', christConnection: 'Suffering Servant', keyVerse: '53:5 — Wounded for transgressions' },
  { book: 'Jeremiah', christConnection: 'Branch', keyVerse: '23:5 — Righteous Branch' },
  { book: 'Lamentations', christConnection: 'Man of Sorrows', keyVerse: '1:12 — Is it nothing to you?' },
  { book: 'Ezekiel', christConnection: 'Glory of God', keyVerse: '43:4 — Glory returned' },
  { book: 'Daniel', christConnection: 'Son of Man', keyVerse: '7:13-14 — Everlasting dominion' },
  { book: 'Hosea', christConnection: 'Faithful Husband', keyVerse: '3:1 — Love again' },
  { book: 'Joel', christConnection: 'Outpoured Spirit', keyVerse: '2:28 — Pour out my Spirit' },
  { book: 'Amos', christConnection: 'Plumbline', keyVerse: '7:7 — Plumbline in hand' },
  { book: 'Obadiah', christConnection: 'Judge', keyVerse: '1:21 — Saviors on Zion' },
  { book: 'Jonah', christConnection: 'Resurrection', keyVerse: '2:10 — Vomited onto dry land' },
  { book: 'Micah', christConnection: 'Ruler from Bethlehem', keyVerse: '5:2 — Out of Bethlehem' },
  { book: 'Nahum', christConnection: 'Avenger', keyVerse: '1:2 — Lord avenges' },
  { book: 'Habakkuk', christConnection: 'Holy One', keyVerse: '2:4 — Just shall live by faith' },
  { book: 'Zephaniah', christConnection: 'King of Israel', keyVerse: '3:15 — King in your midst' },
  { book: 'Haggai', christConnection: 'Desire of All Nations', keyVerse: '2:7 — Desire shall come' },
  { book: 'Zechariah', christConnection: 'Pierced One', keyVerse: '12:10 — Look on Me whom pierced' },
  { book: 'Malachi', christConnection: 'Sun of Righteousness', keyVerse: '4:2 — Arise with healing' }
];

// ============================================
// REVELATION STRUCTURE
// ============================================

export interface RevelationSection {
  section: string;
  chapters: string;
  sanctuaryLocation: string;
  heavenPastDimension?: string;
}

export const revelationStructure: RevelationSection[] = [
  { section: 'Seven Churches', chapters: '1-3', sanctuaryLocation: 'Candlestick (Holy Place)', heavenPastDimension: 'Angels called to repent; light bearer loses his light' },
  { section: 'Seven Seals', chapters: '4-8:1', sanctuaryLocation: 'Throne (transition)', heavenPastDimension: 'The progression of good and evil' },
  { section: 'Seven Trumpets', chapters: '8:2-11', sanctuaryLocation: 'Altar of Incense (Holy Place)', heavenPastDimension: 'War in heaven' },
  { section: 'Great Controversy', chapters: '12-14', sanctuaryLocation: 'Ark revealed (Most Holy)', heavenPastDimension: 'Sides drawn' },
  { section: 'Seven Plagues', chapters: '15-16', sanctuaryLocation: 'Temple filled with smoke', heavenPastDimension: 'Defeat of the wicked' },
  { section: 'Babylon Falls', chapters: '17-18', sanctuaryLocation: 'Judgment executed', heavenPastDimension: 'Defeat of the wicked' },
  { section: 'Second Coming', chapters: '19-20', sanctuaryLocation: 'King of Kings', heavenPastDimension: 'Defeat of the wicked' },
  { section: 'New Jerusalem', chapters: '21-22', sanctuaryLocation: 'God dwells with man', heavenPastDimension: 'Peace restored' }
];

// ============================================
// SEVEN CHURCHES HEAVEN DIMENSION
// ============================================

export interface SevenChurchHeavenDimension {
  church: string;
  greekMeaning: string;
  heavenApplication: string;
}

export const sevenChurchesHeavenDimension: SevenChurchHeavenDimension[] = [
  { church: 'Ephesus', greekMeaning: 'Desirable', heavenApplication: 'Permitted (sin entered)' },
  { church: 'Smyrna', greekMeaning: 'Bitterness', heavenApplication: 'Bitterness results from sin' },
  { church: 'Pergamos', greekMeaning: 'Height/Elevation', heavenApplication: 'Satan\'s seat — "My throne above God\'s"' },
  { church: 'Thyatira', greekMeaning: 'Oil of Affliction', heavenApplication: 'War in heaven' },
  { church: 'Sardis', greekMeaning: 'Remaining/Escaping', heavenApplication: "Angels who escaped Satan's deception" },
  { church: 'Philadelphia', greekMeaning: 'Brotherly Love', heavenApplication: 'Angels who drew together' },
  { church: 'Laodicea', greekMeaning: 'Judgment', heavenApplication: 'Judgment on Lucifer' }
];

// ============================================
// JESUS IN ALL THE BIBLE — COMPOSITE SKETCH
// ============================================
// Pastor Ivor Myers' composite sketch tracing Christ through every OT character
// This is foundational Phototheology content for AI tools, commentary, and study

export interface CompositeSketchEntry {
  otCharacter: string;
  connection: string;
  otReference: string;
  ntParallel: string;
  phase: 'life' | 'ministry' | 'passion' | 'death' | 'resurrection' | 'ascension' | 'intercession' | 'return' | 'reign';
}

export const jesusCompositeSketch: CompositeSketchEntry[] = [
  // LIFE
  { otCharacter: 'Adam', connection: 'He was the Son of God', otReference: 'Genesis 1:26-27', ntParallel: 'Luke 3:38', phase: 'life' },
  { otCharacter: 'Samuel', connection: 'Only a boy when He discovered His mission in the temple', otReference: '1 Samuel 2:18; 3:1-10', ntParallel: 'Luke 2:41-49', phase: 'life' },
  { otCharacter: 'Joseph', connection: '30 years old when He came into prominence', otReference: 'Genesis 41:46', ntParallel: 'Luke 3:23', phase: 'life' },
  { otCharacter: 'Enoch', connection: 'He walked with God', otReference: 'Genesis 5:22-24', ntParallel: 'John 8:29', phase: 'life' },

  // MINISTRY
  { otCharacter: 'Joshua', connection: 'Crossed the Jordan to lead 12', otReference: 'Joshua 3:14-17', ntParallel: 'Matthew 3:13-17; 10:1-4', phase: 'ministry' },
  { otCharacter: 'Elijah', connection: 'Provided drink for the thirsty', otReference: '1 Kings 17:1-6', ntParallel: 'John 4:10-14; 7:37-38', phase: 'ministry' },
  { otCharacter: 'Moses', connection: 'Entered the wilderness to wander for forty days', otReference: 'Exodus 34:28', ntParallel: 'Matthew 4:1-2', phase: 'ministry' },
  { otCharacter: 'Daniel', connection: 'Overcame the temptation of appetite', otReference: 'Daniel 1:8', ntParallel: 'Matthew 4:3-4', phase: 'ministry' },
  { otCharacter: 'Job', connection: 'Refused the sin of presumption', otReference: 'Job 1:22; 2:10', ntParallel: 'Matthew 4:5-7', phase: 'ministry' },
  { otCharacter: 'Shadrach, Meshach, Abednego', connection: 'Refused to bow down before another lord', otReference: 'Daniel 3:16-18', ntParallel: 'Matthew 4:8-10', phase: 'ministry' },
  { otCharacter: 'Man of God', connection: 'Healed a withered hand', otReference: '1 Kings 13:4-6', ntParallel: 'Mark 3:1-5', phase: 'ministry' },
  { otCharacter: 'Elisha', connection: 'Raised the dead, multiplied bread, and helped lepers', otReference: '2 Kings 4:32-35; 4:42-44; 5:1-14', ntParallel: 'John 11:43-44; John 6:11-13; Luke 17:12-14', phase: 'ministry' },
  { otCharacter: 'Ezekiel', connection: 'Preached to a stubborn and rebellious people and spoke against temple abominations', otReference: 'Ezekiel 2:3-7; 8:1-18', ntParallel: 'Matthew 23:37; John 2:13-17', phase: 'ministry' },
  { otCharacter: 'Josiah', connection: 'Exposed false worship', otReference: '2 Kings 22:1-23:25', ntParallel: 'Matthew 15:1-9; 23:1-36', phase: 'ministry' },

  // PASSION
  { otCharacter: 'Moses', connection: 'Knew His hour had come; gathered the twelve to repeat the covenant and sang a song before going out to die alone', otReference: 'Deuteronomy 31-32', ntParallel: 'John 13:1; Matthew 26:17-30', phase: 'passion' },
  { otCharacter: 'David', connection: 'Crossed the brook Kidron as His enemies pursued Him', otReference: '2 Samuel 15:23', ntParallel: 'John 18:1', phase: 'passion' },
  { otCharacter: 'David', connection: 'Betrayed by His close friend who eventually hung himself', otReference: '2 Samuel 15:12; 17:23', ntParallel: 'Matthew 26:14-16; 27:3-5', phase: 'passion' },
  { otCharacter: 'Job', connection: 'Entered into a time of trouble in the garden and was tempted to think God had forsaken Him', otReference: 'Job 3:1-26; 13:24', ntParallel: 'Matthew 26:36-46; 27:46', phase: 'passion' },
  { otCharacter: 'Joseph', connection: 'Sold for silver and deserted by His brothers', otReference: 'Genesis 37:28', ntParallel: 'Matthew 26:15; 26:56', phase: 'passion' },
  { otCharacter: 'Joseph', connection: 'Placed between two men—one forgiven, the other rejected', otReference: 'Genesis 40:1-22', ntParallel: 'Luke 23:39-43', phase: 'passion' },

  // DEATH
  { otCharacter: 'Samson', connection: 'Beaten, bound, and mocked; placed between two pillars, bowed His head, and saved more in death than in life', otReference: 'Judges 16:21-30', ntParallel: 'Matthew 27:26-50; John 12:24', phase: 'death' },
  { otCharacter: 'Isaac', connection: 'Given up for sacrifice', otReference: 'Genesis 22:1-14', ntParallel: 'John 3:16; Romans 8:32', phase: 'death' },
  { otCharacter: 'Noah', connection: 'Lifted up above the earth on wood so all would be drawn to Him', otReference: 'Genesis 7:17-18', ntParallel: 'John 3:14-15; 12:32', phase: 'death' },
  { otCharacter: 'Nehemiah', connection: 'Would not come down for He had a great work to do', otReference: 'Nehemiah 6:3', ntParallel: 'Matthew 27:40-42; John 19:30', phase: 'death' },
  { otCharacter: 'Job', connection: 'Prayed for His enemies', otReference: 'Job 42:10', ntParallel: 'Luke 23:34', phase: 'death' },
  { otCharacter: 'Samson', connection: 'His death caused a great rumbling in the earth', otReference: 'Judges 16:30', ntParallel: 'Matthew 27:51', phase: 'death' },
  { otCharacter: 'Elisha', connection: 'His death brought to life many who slept in the grave', otReference: '2 Kings 13:21', ntParallel: 'Matthew 27:52-53', phase: 'death' },
  { otCharacter: 'Jonah', connection: 'In the belly of the earth three days and three nights', otReference: 'Jonah 1:17', ntParallel: 'Matthew 12:40', phase: 'death' },
  { otCharacter: 'David', connection: 'Delivered a deadly blow to the head of His enemy', otReference: '1 Samuel 17:49-51', ntParallel: 'Genesis 3:15; Colossians 2:15', phase: 'death' },
  { otCharacter: 'Moses', connection: 'Willing to be blotted out of the book but was resurrected from the dead', otReference: 'Exodus 32:32; Jude 1:9', ntParallel: 'Philippians 2:8; Romans 6:9', phase: 'death' },

  // RESURRECTION
  { otCharacter: 'Samuel', connection: 'Called out of His sleep to serve as Priest in the house of God', otReference: '1 Samuel 3:1-10', ntParallel: 'Hebrews 5:5-6; 7:24-25', phase: 'resurrection' },
  { otCharacter: 'Jonah', connection: 'Stayed for 40 days after emerging', otReference: 'Jonah 3:4', ntParallel: 'Acts 1:3', phase: 'resurrection' },
  { otCharacter: 'Nehemiah', connection: 'Finished the work', otReference: 'Nehemiah 6:15', ntParallel: 'John 19:30; John 17:4', phase: 'resurrection' },

  // ASCENSION
  { otCharacter: 'Elijah', connection: 'Raised into the heavens', otReference: '2 Kings 2:11', ntParallel: 'Acts 1:9-11', phase: 'ascension' },
  { otCharacter: 'Joseph', connection: 'Sent ahead to prepare a place for His brothers', otReference: 'Genesis 45:5-7', ntParallel: 'John 14:2-3', phase: 'ascension' },

  // INTERCESSION
  { otCharacter: 'Daniel', connection: 'Interceded on behalf of His people', otReference: 'Daniel 9:1-19', ntParallel: 'Hebrews 7:25; Romans 8:34', phase: 'intercession' },
  { otCharacter: 'Jacob', connection: 'While He is away, He is working for His bride', otReference: 'Genesis 29:18-20', ntParallel: 'Ephesians 5:25-27; John 14:2-3', phase: 'intercession' },
  { otCharacter: 'Joseph', connection: 'Will investigate His brethren before allowing them to enter the place He has prepared', otReference: 'Genesis 42-44', ntParallel: 'Revelation 20:12; Matthew 22:11-14', phase: 'intercession' },

  // RETURN
  { otCharacter: 'Moses', connection: 'Will descend from the mount upon an unexpected people', otReference: 'Exodus 32:15-19', ntParallel: '1 Thessalonians 5:2-3; Revelation 1:7', phase: 'return' },
  { otCharacter: 'Moses', connection: 'As Moses parted the sea, He will part the sky and lead His people out of the bondage of the grave', otReference: 'Exodus 14:21-22', ntParallel: '1 Thessalonians 4:16-17', phase: 'return' },
  { otCharacter: 'Joshua', connection: 'Will lead His people into the Promised Land', otReference: 'Joshua 1:1-9', ntParallel: 'Revelation 21:1-4; Hebrews 4:8-9', phase: 'return' },
  { otCharacter: 'David', connection: 'Will take His place as rightful King', otReference: '2 Samuel 5:1-4', ntParallel: 'Revelation 19:16; Matthew 25:31', phase: 'return' },

  // REIGN
  { otCharacter: 'Solomon', connection: 'Will reign in peace for a thousand years', otReference: '1 Kings 4:24-25', ntParallel: 'Revelation 20:4-6', phase: 'reign' },
  { otCharacter: 'Solomon', connection: 'Will answer all of our hard questions', otReference: '1 Kings 10:1-3', ntParallel: '1 Corinthians 13:12; Revelation 21:3-4', phase: 'reign' },
  { otCharacter: 'Gideon', connection: 'Will put down the enemies of God at the end of the millennium', otReference: 'Judges 7:19-22', ntParallel: 'Revelation 20:7-10', phase: 'reign' },
  { otCharacter: 'Jephthah', connection: 'Will destroy those who cannot speak the heavenly language', otReference: 'Judges 12:5-6', ntParallel: 'Matthew 7:21-23; Revelation 20:15', phase: 'reign' },
  { otCharacter: 'Abraham', connection: 'Will be the Father of a great multitude', otReference: 'Genesis 17:4-5', ntParallel: 'Isaiah 9:6; Revelation 7:9', phase: 'reign' },
  { otCharacter: 'Joseph', connection: 'Will be reunited with His loved ones', otReference: 'Genesis 45:14-15; 46:29', ntParallel: '1 Thessalonians 4:17; Revelation 21:3-4', phase: 'reign' },
];

export const compositeSketchSummary = "Jesus is the center of all Scripture. Every character, every story, every event points to Him. From Adam to Joseph, from His life to His eternal reign, the composite sketch of Christ emerges from the pages of the entire Bible. He is the Son of God (Adam), the boy in the temple (Samuel), the 30-year-old coming into prominence (Joseph), the Jordan-crosser leading 12 (Joshua), the provider of living water (Elijah), the wilderness wanderer (Moses), the appetite overcomer (Daniel), the one who refuses presumption (Job), the one who will not bow (Three Hebrews), the healer and miracle worker (Elisha), the preacher to the stubborn (Ezekiel), the exposer of false worship (Josiah), the God-walker (Enoch), the betrayed one at Kidron (David), the sold-for-silver one (Joseph), the one between two who forgives one and rejects the other (Joseph/Butler/Baker), the beaten and mocked one who saves more in death (Samson), the sacrifice (Isaac), the one lifted up on wood (Noah), the one who will not come down (Nehemiah), the one who prays for enemies (Job), the one whose death shakes the earth (Samson), the one whose death brings life (Elisha), the three-day burial (Jonah), the head-crusher (David), the resurrected priest (Samuel), the ascended one (Elijah), the place-preparer (Joseph), the intercessor (Daniel), the one working for His bride (Jacob), the returning King (Moses/David), the thousand-year reigner (Solomon), the enemy-destroyer (Gideon), the Father of multitudes (Abraham), and the one who is reunited with His loved ones (Joseph). Jesus is the center of our Scriptures.";

// ============================================
// STUDY PRINCIPLES
// ============================================

export const studyPrinciples = {
  howToStudyPassage: [
    '1. Read the literal meaning — What actually happened?',
    '2. Look for Christ — How does this point to Jesus?',
    '3. Apply to yourself — What does this mean for my spiritual journey?',
    '4. Apply to the church — How does this relate to God\'s people corporately?',
    '5. Look for heavenly realities — What does this reveal about heaven or future events?',
    '6. Consider the great controversy — How does this illuminate the battle between good and evil that began in heaven?'
  ],
  keyQuotes: [
    {
      quote: "When the life of Christ and the character of His mission are dwelt upon, rays of light will shine forth, and at every fresh attempt to discover truth, something that has never yet been unfolded will be revealed.",
      source: "Signs of the Times, April 18, 1900"
    },
    {
      quote: "In every page, whether history, or precept, or prophecy, the Old Testament Scriptures are irradiated with the glory of the Son of God.",
      source: "Desire of Ages, 211.5"
    },
    {
      quote: "To say that a passage means just this and nothing more, that you must not attach any broader meaning to the words of Christ than we have in the past, is saying that which is not actuated by the Spirit of God.",
      source: "Ellen G. White"
    },
    {
      quote: "When you search the Scriptures with an earnest desire to learn the truth, God will breathe His Spirit into your heart and impress your mind with the light of His word. The Bible is its own interpreter, one passage explaining another.",
      source: "Testimonies, vol. 4, 499.1"
    },
    {
      quote: "Take your Bible, and compare passage with passage, and verse with verse, and you will find the precious jewels of truth. You should put the precious gems of light in a beautiful setting, and hang them in memory's hall.",
      source: "Review and Herald, April 16, 1889"
    }
  ],
  keyScriptures: [
    'Luke 24:27 — "And beginning at Moses and all the prophets, He expounded unto them in all the scriptures the things concerning Himself."',
    'John 5:39 — "Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of Me."',
    '2 Timothy 3:16-17 — "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: that the man of God may be perfect, thoroughly furnished unto all good works."'
  ]
};

// ============================================
// HELPER FUNCTIONS FOR AI/GEMS
// ============================================

export const getRandomDimensionalExample = (): DimensionalExample => {
  return dimensionalExamples[Math.floor(Math.random() * dimensionalExamples.length)];
};

export const getChristPatternForBook = (book: string) => {
  const pentateuch = pentateuchChristPatterns.find(p => p.book.toLowerCase() === book.toLowerCase());
  if (pentateuch) return pentateuch;

  const historical = historicalChristPatterns.find(p => p.book.toLowerCase() === book.toLowerCase());
  if (historical) return historical;

  const restoration = restorationChristPatterns.find(p => p.book.toLowerCase() === book.toLowerCase());
  if (restoration) return restoration;

  const wisdom = wisdomChristPatterns.find(p => p.book.toLowerCase() === book.toLowerCase());
  if (wisdom) return wisdom;

  const majorProphet = majorProphetChristPatterns.find(p => p.book.toLowerCase() === book.toLowerCase());
  if (majorProphet) return majorProphet;

  const minorProphet = minorProphetChristPatterns.find(p => p.prophet.toLowerCase() === book.toLowerCase());
  if (minorProphet) return minorProphet;

  return null;
};

export const getKeyVerseForBook = (book: string): KeyVerseByBook | undefined => {
  return keyVersesByBook.find(k => k.book.toLowerCase() === book.toLowerCase());
};

export const getSanctuaryInsight = (station: string): SanctuaryStation | undefined => {
  return sanctuaryJourney.find(s => s.station.toLowerCase() === station.toLowerCase() || s.object.toLowerCase().includes(station.toLowerCase()));
};

export const getFeastInsight = (feast: string): FeastDayPattern | undefined => {
  return feastDayPatterns.find(f => f.feast.toLowerCase().includes(feast.toLowerCase()));
};

export const getRandomStudyPrinciple = (): string => {
  const allPrinciples = [
    ...studyPrinciples.howToStudyPassage,
    ...studyPrinciples.keyQuotes.map(q => `"${q.quote}" — ${q.source}`),
    ...studyPrinciples.keyScriptures
  ];
  return allPrinciples[Math.floor(Math.random() * allPrinciples.length)];
};

export const getWallInsight = (wallId: string): SixWall | undefined => {
  return sixWalls.find(w => w.id === wallId || w.name.toLowerCase().includes(wallId.toLowerCase()));
};

export const getDimensionInsight = (dimensionId: string): SixDimension | undefined => {
  return sixDimensions.find(d => d.id === dimensionId || d.name.toLowerCase().includes(dimensionId.toLowerCase()));
};

// Export all data for comprehensive access
export const ptKnowledgeBank = {
  framework: {
    sixWalls,
    sixDimensions
  },
  examples: {
    dimensionalExamples
  },
  christOffices,
  pentateuch: pentateuchChristPatterns,
  historical: historicalChristPatterns,
  restoration: restorationChristPatterns,
  wisdom: wisdomChristPatterns,
  majorProphets: majorProphetChristPatterns,
  minorProphets: minorProphetChristPatterns,
  sanctuary: {
    journey: sanctuaryJourney,
    feasts: feastDayPatterns
  },
  prophecy: {
    timeProphecies,
    watersOfScripture
  },
  parallels: {
    christChurch: christChurchParallels
  },
  revelation: {
    structure: revelationStructure,
    sevenChurchesHeaven: sevenChurchesHeavenDimension
  },
  reference: {
    keyVersesByBook,
    studyPrinciples
  },
  compositeSketch: {
    entries: jesusCompositeSketch,
    summary: compositeSketchSummary
  }
};
