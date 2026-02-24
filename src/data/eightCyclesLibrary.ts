// Eight Cycles Library - Comprehensive Guide to Biblical Covenant Cycles
// History moves in repeating patterns: Creation → Fall → Judgment → Grace → Restoration

export type CycleTag = "@Ad" | "@No" | "@Se" | "@Ab" | "@Mo" | "@Cy" | "@Sp" | "@Re";
export type CycleBeat = "creation" | "fall" | "judgment" | "grace" | "restoration";

export interface CovenantCycle {
  id: string;
  tag: CycleTag;
  name: string;
  fullName: string;
  patriarch: string;
  timeframe: string;
  approximateDate: string;
  duration: string;
  keyEvent: string;
  covenantSign: string;
  primaryVerse: string;
  description: string;
  fiveBeats: CycleBeatDetail[];
  keyFigures: CycleFigure[];
  keyVerses: string[];
  spiritualLessons: string[];
  christConnection: string;
  parallelsWithOtherCycles: CycleParallel[];
  distinctiveElements: string[];
}

export interface CycleBeatDetail {
  beat: CycleBeat;
  title: string;
  description: string;
  keyEvent: string;
  verse: string;
  symbolism: string;
}

export interface CycleFigure {
  name: string;
  role: string;
  significance: string;
}

export interface CycleParallel {
  cycle: CycleTag;
  parallel: string;
}

export interface CyclePattern {
  id: string;
  name: string;
  description: string;
  elements: PatternElement[];
}

export interface PatternElement {
  beat: CycleBeat;
  universalPattern: string;
  examples: string[];
}

// The Five-Beat Pattern Explained
export const fiveBeatPattern: CyclePattern = {
  id: "five-beat",
  name: "The Five-Beat Covenant Cycle",
  description: "Every major covenant period follows the same five-beat pattern, demonstrating God's consistent redemptive approach throughout history.",
  elements: [
    {
      beat: "creation",
      universalPattern: "God creates something new—a world, a people, a nation, a covenant, a church. This is the fresh start, the 'Genesis' moment of each cycle.",
      examples: [
        "@Ad: Creation of heaven, earth, humanity in God's image",
        "@No: New world emerging from flood waters",
        "@Ab: New nation called from Ur of the Chaldees",
        "@Mo: New nation born at Sinai with law and tabernacle",
        "@Sp: New covenant community born at Pentecost"
      ]
    },
    {
      beat: "fall",
      universalPattern: "The created order is corrupted by sin. What was good becomes twisted. Rebellion against God's design leads to deterioration.",
      examples: [
        "@Ad: Adam and Eve eat the forbidden fruit",
        "@No: Ham's sin; Babel's rebellion",
        "@Ab: Israel enslaved in Egypt; breaks covenant at Sinai",
        "@Mo: Repeated idolatry; rejection of prophets",
        "@Sp: Apostasy; departure from truth; Laodicean lukewarmness"
      ]
    },
    {
      beat: "judgment",
      universalPattern: "God responds to persistent sin with judgment. This is not arbitrary punishment but the natural consequence of violating God's order, plus divine intervention.",
      examples: [
        "@Ad: Curse on serpent, ground, humanity; expulsion from Eden",
        "@No: Global flood destroys all flesh except eight souls",
        "@Ab: Ten plagues on Egypt; 40 years wandering",
        "@Mo: Assyrian captivity (north); Babylonian captivity (south)",
        "@Sp: AD 70 destruction; 1260 years of persecution; final tribulation"
      ]
    },
    {
      beat: "grace",
      universalPattern: "In the midst of judgment, God provides a way of escape. A remnant is preserved. A deliverer is raised up. Hope is offered in the darkness.",
      examples: [
        "@Ad: Protoevangelium—promise of the Seed (Genesis 3:15)",
        "@No: The ark—salvation through judgment waters",
        "@Ab: Moses raised up; blood of Passover lamb",
        "@Mo: Prophets sent; promise of new covenant; return from exile",
        "@Sp: Remnant preserved; Reformers raised up; final Elijah message"
      ]
    },
    {
      beat: "restoration",
      universalPattern: "The cycle concludes with restoration—never back to the original state but forward to something better. Each restoration prepares for the next cycle.",
      examples: [
        "@Ad: Covering of skins; Seth's line preserved; Enoch walks with God",
        "@No: Covenant with nature; Shem's blessing leads to Abraham",
        "@Ab: Conquest of Canaan; Kingdom established under David",
        "@Mo: Return from exile; Second Temple; preparation for Messiah",
        "@Sp: End-time revival; Christ's return; New Jerusalem"
      ]
    }
  ]
};

// The Eight Covenant Cycles
export const covenantCycles: CovenantCycle[] = [
  {
    id: "adamic",
    tag: "@Ad",
    name: "Adamic Cycle",
    fullName: "The Cycle of Original Creation",
    patriarch: "Adam",
    timeframe: "Creation to Flood",
    approximateDate: "Creation - c. 2348 BC",
    duration: "~1,656 years (Adam's creation to flood)",
    keyEvent: "Creation of humanity and the Fall",
    covenantSign: "Tree of Life / Sabbath",
    primaryVerse: "Genesis 3:15",
    description: "The primordial cycle establishes all subsequent patterns. God creates a perfect world, humanity falls, judgment comes, but grace provides a way of redemption pointing to a coming Seed.",
    fiveBeats: [
      {
        beat: "creation",
        title: "The Perfect World",
        description: "God creates heaven and earth in six days. Adam and Eve are formed in God's image, placed in Eden, given dominion over creation, and enjoy unbroken fellowship with God.",
        keyEvent: "Creation of Adam and Eve; Marriage instituted; Sabbath established",
        verse: "Genesis 1:27-28; 2:1-3",
        symbolism: "Eden represents God's ideal—perfect environment, perfect relationship, purposeful work, and rest. The Sabbath memorializes the Creator-creature relationship."
      },
      {
        beat: "fall",
        title: "The Serpent's Deception",
        description: "The serpent questions God's word, Eve is deceived, Adam willfully joins the rebellion. Sin enters the human race. Shame, fear, and blame replace innocence, trust, and unity.",
        keyEvent: "Eating the forbidden fruit; Hiding from God; Blame-shifting",
        verse: "Genesis 3:1-13",
        symbolism: "The tree of knowledge represents autonomy from God. Nakedness symbolizes exposure and vulnerability. Hiding represents the broken relationship sin causes."
      },
      {
        beat: "judgment",
        title: "The Curse and Expulsion",
        description: "God pronounces curses: serpent cursed above all animals, woman's pain in childbirth and relational struggle, man's toilsome labor against cursed ground. Death enters. Expulsion from Eden prevents access to the tree of life.",
        keyEvent: "Curses pronounced; Cherubim guard Eden; Death begins",
        verse: "Genesis 3:14-24",
        symbolism: "The flaming sword represents God's holiness barring access. The curse touches every realm: animal, human, and nature. Physical death manifests spiritual death."
      },
      {
        beat: "grace",
        title: "The First Gospel Promise",
        description: "In the midst of judgment, God promises that the woman's Seed will crush the serpent's head. God Himself makes garments of skin—the first blood sacrifice—covering Adam and Eve's nakedness.",
        keyEvent: "Protoevangelium (Genesis 3:15); Animal slain for covering",
        verse: "Genesis 3:15, 21",
        symbolism: "The Seed of the woman is Christ. The heel-bruising represents Christ's temporary suffering; head-crushing is Satan's eternal defeat. Skins require death—blood atonement introduced."
      },
      {
        beat: "restoration",
        title: "The Line of Promise",
        description: "Though expelled, humanity continues. Seth replaces Abel as the line of promise. Enoch 'walks with God' and is translated. Noah finds grace. The hope of the Seed is preserved through the faithful remnant.",
        keyEvent: "Seth born; Enoch translated; Noah finds grace",
        verse: "Genesis 4:25-26; 5:24; 6:8",
        symbolism: "Seth ('appointed') continues the messianic line. Enoch's translation foreshadows resurrection/rapture. The remnant concept is established—not all are saved, but some are preserved."
      }
    ],
    keyFigures: [
      { name: "Adam", role: "First man, federal head of humanity", significance: "Type of Christ as 'last Adam' (1 Cor 15:45)" },
      { name: "Eve", role: "Mother of all living", significance: "Type of the Church, bride of Christ" },
      { name: "Cain", role: "First murderer, false worshipper", significance: "Pattern of works-based religion rejecting blood atonement" },
      { name: "Abel", role: "First martyr, true worshipper", significance: "Faith-based worship offering blood; type of Christ" },
      { name: "Seth", role: "Replacement son, line of promise", significance: "Continuation of the messianic hope after Abel's death" },
      { name: "Enoch", role: "Prophet who walked with God", significance: "Translated without death—picture of rapture/transformation" }
    ],
    keyVerses: [
      "Genesis 1:26-27 - Image of God",
      "Genesis 2:16-17 - The prohibition",
      "Genesis 3:15 - The Protoevangelium",
      "Genesis 4:4 - Abel's accepted offering",
      "Genesis 5:24 - Enoch translated"
    ],
    spiritualLessons: [
      "Sin begins with doubting God's word",
      "Human solutions (fig leaves) cannot cover sin",
      "Blood atonement is God's plan from the beginning",
      "Judgment and grace go together—never one without the other",
      "God preserves a faithful remnant in every generation"
    ],
    christConnection: "Adam is the 'type' of Christ (Romans 5:14)—one man's act affects all. Where Adam brought death, Christ brings life. The Seed of the woman IS Christ. The skin coverings required a substitutionary death—the first picture of Calvary.",
    parallelsWithOtherCycles: [
      { cycle: "@No", parallel: "New beginning after judgment; eight souls saved (8 = new beginning)" },
      { cycle: "@Ab", parallel: "Promise of Seed; faith credited as righteousness" },
      { cycle: "@Sp", parallel: "New creation in Christ; old passed away, new come" }
    ],
    distinctiveElements: [
      "The only cycle with direct creation (not re-creation)",
      "Establishes all major patterns: sin, judgment, grace, promise",
      "The Protoevangelium is the seed from which all other prophecies grow",
      "Marriage, Sabbath, and work originate here"
    ]
  },
  {
    id: "noahic",
    tag: "@No",
    name: "Noahic Cycle",
    fullName: "The Cycle of Preservation through Judgment",
    patriarch: "Noah",
    timeframe: "Flood to Babel/Abraham",
    approximateDate: "c. 2348 BC - c. 2000 BC",
    duration: "~350 years",
    keyEvent: "The Flood and new beginning",
    covenantSign: "Rainbow",
    primaryVerse: "Genesis 9:11",
    description: "God judges the corrupt antediluvian world with a global flood but preserves a righteous remnant. The post-flood world receives a covenant with nature, but humanity soon rebels again at Babel.",
    fiveBeats: [
      {
        beat: "creation",
        title: "The New World",
        description: "The floodwaters recede, the ark rests on Ararat, and Noah's family emerges into a cleansed world. God blesses them: 'Be fruitful and multiply.' A new beginning for humanity and creation.",
        keyEvent: "Ark lands; Animals released; Altar built; God's blessing renewed",
        verse: "Genesis 8:15-22; 9:1-7",
        symbolism: "The ark represents salvation (Christ). Eight souls = new beginning. The dove with olive branch = peace after judgment. The altar = worship as the first act in the new world."
      },
      {
        beat: "fall",
        title: "Ham's Sin and Babel's Rebellion",
        description: "Noah plants a vineyard, becomes drunk, and Ham sins against him. Later, humanity gathers at Babel to build a city and tower 'to make a name' and avoid scattering—directly defying God's command to fill the earth.",
        keyEvent: "Noah's drunkenness and Ham's sin; Tower of Babel built",
        verse: "Genesis 9:20-25; 11:1-4",
        symbolism: "Ham's sin (mocking/exposing his father) pictures dishonoring God. Babel represents human pride, false unity, and religion of self-exaltation. Brick (man-made) vs. stone (God-given)."
      },
      {
        beat: "judgment",
        title: "Confusion of Languages",
        description: "God sees humanity's united rebellion and confuses their language. Unable to understand each other, they scatter across the earth. The 'one language' of unity is broken into many.",
        keyEvent: "Languages confused; People scattered; Babel abandoned",
        verse: "Genesis 11:5-9",
        symbolism: "Confusion of tongues demonstrates God's power over human plans. Scattering fulfills God's original command by His means. Division as judgment—but also as protection against consolidated evil."
      },
      {
        beat: "grace",
        title: "The Line of Shem",
        description: "In the midst of scattering, God's purposes continue. Shem is blessed; from his line comes Abram. The genealogy of Genesis 11 traces the hope from Noah through Shem to Abraham—the next covenant head.",
        keyEvent: "Shem blessed; Genealogy to Abram; Abram called",
        verse: "Genesis 9:26; 11:10-26; 12:1-3",
        symbolism: "Shem ('name') becomes the line through which THE Name comes. The genealogy is a 'bridge' between cycles—grace continuing where judgment threatened extinction."
      },
      {
        beat: "restoration",
        title: "Nations and the Call of Abraham",
        description: "The Table of Nations (Genesis 10) shows humanity spreading. Though scattered in judgment, the nations now exist to be blessed through Abraham's Seed. The stage is set for the next cycle.",
        keyEvent: "70 nations formed; Abraham called from Ur; Promises given",
        verse: "Genesis 10:1-32; 12:1-3",
        symbolism: "70 nations = complete human society. 'In you all families of the earth shall be blessed'—restoration aims at all nations, not just one. Scattering becomes opportunity for global blessing."
      }
    ],
    keyFigures: [
      { name: "Noah", role: "Preacher of righteousness, ark builder, new Adam", significance: "Type of Christ who carries the righteous through judgment" },
      { name: "Shem", role: "Blessed son, ancestor of Messiah", significance: "The 'Semitic' line—through him comes Abraham, Israel, Christ" },
      { name: "Ham", role: "Cursed through Canaan, father of opposing nations", significance: "Pattern of dishonoring God; Canaanites become Israel's adversaries" },
      { name: "Japheth", role: "Enlarged son, dwells in Shem's tents", significance: "Gentile nations brought into the blessing of Shem/Israel" },
      { name: "Nimrod", role: "Mighty hunter, founder of Babel", significance: "Pattern of human kingdom-building in opposition to God" }
    ],
    keyVerses: [
      "Genesis 6:8 - Noah found grace",
      "Genesis 9:11 - Covenant promise: no more flood",
      "Genesis 9:13 - Rainbow as sign",
      "Genesis 11:9 - Babel = confusion",
      "Genesis 12:3 - All nations blessed"
    ],
    spiritualLessons: [
      "God provides a way of escape before judgment comes",
      "Salvation requires entering the 'ark' God provides",
      "New beginnings can still go wrong—Noah's drunkenness",
      "Human unity apart from God leads to confusion",
      "God scatters to eventually gather—His purposes aren't thwarted"
    ],
    christConnection: "Noah is a type of Christ: the righteous one who carries his 'household' through judgment waters. The ark is Christ—one door, safety inside, death outside. The rainbow (God's 'bow' of war laid down) points to peace made through Christ. Eight saved = resurrection number.",
    parallelsWithOtherCycles: [
      { cycle: "@Ad", parallel: "New beginning after judgment; fruitful multiplication commanded" },
      { cycle: "@Mo", parallel: "Water passage (Red Sea); covenant sign given" },
      { cycle: "@Sp", parallel: "Babel reversed at Pentecost—languages unite in understanding" }
    ],
    distinctiveElements: [
      "The only cycle involving a global cataclysm",
      "Covenant with nature itself (seasons, no more flood)",
      "Rainbow—the first visible covenant sign in the sky",
      "Only 8 saved—the smallest remnant"
    ]
  },
  {
    id: "semitic",
    tag: "@Se",
    name: "Semitic Cycle",
    fullName: "The Cycle of Patriarchal Promise",
    patriarch: "Shem → Abraham → Isaac → Jacob",
    timeframe: "Shem to Egyptian Sojourn",
    approximateDate: "c. 2000 BC - c. 1876 BC",
    duration: "~400 years (call of Abraham to entry into Egypt)",
    keyEvent: "God's covenant with Abraham and patriarchal wanderings",
    covenantSign: "Circumcision",
    primaryVerse: "Genesis 17:7",
    description: "God calls Abraham from Ur, establishes an everlasting covenant with him and his seed, and guides three generations of patriarchs through faith, failure, and divine faithfulness.",
    fiveBeats: [
      {
        beat: "creation",
        title: "The Call of Abram",
        description: "God calls Abram from idolatrous Ur: 'Get out of your country... to a land I will show you.' Promises of land, seed, and blessing to all nations. A new people is being created from one man's faith.",
        keyEvent: "Abram called; leaves Ur; journeys to Canaan; builds altars",
        verse: "Genesis 12:1-9",
        symbolism: "Leaving Ur = separation from the world. Journey by faith, not sight. Altars mark encounter with God. Abram = 'exalted father'; later Abraham = 'father of many.'"
      },
      {
        beat: "fall",
        title: "Patriarchal Failures",
        description: "Despite promises, the patriarchs repeatedly fail: Abram lies about Sarai (twice!), takes Hagar, nearly loses the promise. Jacob deceives Isaac. The brothers sell Joseph. The family nearly self-destructs.",
        keyEvent: "Sarai in Pharaoh's house; Hagar and Ishmael; Jacob's deception; Joseph sold",
        verse: "Genesis 12:10-20; 16:1-16; 27:1-40; 37:28",
        symbolism: "Human effort to 'help' God produces Ishmael. Deception breeds deception across generations. Jealousy leads to near-murder. The promised line is always in jeopardy."
      },
      {
        beat: "judgment",
        title: "Sodom's Destruction and Famine",
        description: "Sodom and Gomorrah are destroyed by fire and brimstone—judgment on wickedness. Famines repeatedly drive the patriarchs from the land. Joseph's brothers face famine-judgment that forces them to Egypt and confession.",
        keyEvent: "Sodom destroyed; Multiple famines; Confession before Joseph",
        verse: "Genesis 19:24-25; 42:21-22; 45:5-8",
        symbolism: "Sodom = pattern of end-time judgment on wickedness. Famine = withdrawal of blessing. Egypt = both danger and provision—a complex judgment-grace mixture."
      },
      {
        beat: "grace",
        title: "Covenant Confirmations",
        description: "God repeatedly confirms His covenant with Abraham (Genesis 15, 17, 22), Isaac (Genesis 26), and Jacob (Genesis 28, 35). Despite human failure, God remains faithful. He even uses evil for good (Joseph).",
        keyEvent: "Covenant of pieces; Circumcision instituted; Ram substituted for Isaac; Bethel visions",
        verse: "Genesis 15:1-21; 17:1-14; 22:13-14; 28:12-15",
        symbolism: "The 'smoking furnace and lamp' = God alone making the covenant. Circumcision = cutting away the flesh. The ram = substitutionary atonement. Ladder = Christ connecting heaven and earth."
      },
      {
        beat: "restoration",
        title: "Jacob Becomes Israel; The Twelve Tribes",
        description: "Jacob wrestles with God and is transformed into Israel ('prince with God'). The twelve sons become the twelve tribes. The family goes to Egypt—preserved from famine, positioned for the next cycle.",
        keyEvent: "Jacob named Israel; Twelve sons; Family in Egypt under Joseph's protection",
        verse: "Genesis 32:28; 35:22-26; 46:26-27",
        symbolism: "Wrestling produces transformation. Twelve = governmental completeness. Egypt preserves the seed until the next redemptive act. Joseph = Christ exalted, receiving his brothers."
      }
    ],
    keyFigures: [
      { name: "Abraham", role: "Father of faith, covenant head", significance: "The model of justification by faith (Romans 4)" },
      { name: "Sarah", role: "Mother of promise through faith", significance: "Free woman vs. bondwoman (Galatians 4)" },
      { name: "Isaac", role: "Child of promise, sacrificial type", significance: "Type of Christ offered and 'received back' (Hebrews 11:19)" },
      { name: "Rebekah", role: "Sought bride, mother of twins", significance: "Type of the Church sought out by the Spirit (Genesis 24)" },
      { name: "Jacob/Israel", role: "Supplanter transformed to prince", significance: "Conversion through wrestling—transformation not destruction" },
      { name: "Joseph", role: "Rejected, exalted, savior of his brothers", significance: "Most complete type of Christ in Genesis" }
    ],
    keyVerses: [
      "Genesis 12:1-3 - Abrahamic call and blessing",
      "Genesis 15:6 - Faith credited as righteousness",
      "Genesis 17:7 - Everlasting covenant",
      "Genesis 22:8 - 'God will provide Himself a lamb'",
      "Genesis 50:20 - 'You meant evil; God meant good'"
    ],
    spiritualLessons: [
      "Faith means acting on God's word before seeing the outcome",
      "Human schemes to fulfill God's promises create lasting problems (Ishmael)",
      "God uses flawed people without endorsing their flaws",
      "Blessing comes through suffering—Joseph's path of exaltation",
      "'What you meant for evil, God meant for good'"
    ],
    christConnection: "Abraham offers Isaac = the Father offering the Son. Isaac on Moriah, 3-day journey, 'as good as dead' then received back = death and resurrection. Joseph: rejected by brothers, sold for silver, exalted to right hand of throne, saves those who rejected him = complete Christ typology.",
    parallelsWithOtherCycles: [
      { cycle: "@Ad", parallel: "Promise of Seed; faith vs. works (Cain/Abel, Ishmael/Isaac)" },
      { cycle: "@Mo", parallel: "Twelve tribes formed; covenant sign (circumcision/Passover)" },
      { cycle: "@Sp", parallel: "Faith reckoned as righteousness (Romans 4); Gentiles grafted in" }
    ],
    distinctiveElements: [
      "Covenant through an individual, extended to his seed",
      "Circumcision—covenant in the flesh, marking the seed line",
      "Three major patriarchs, each with covenant renewal",
      "Joseph as the most complete Christ-type before Moses"
    ]
  },
  {
    id: "abrahamic",
    tag: "@Ab",
    name: "Abrahamic/Egyptian Cycle",
    fullName: "The Cycle of National Formation",
    patriarch: "Moses",
    timeframe: "Egypt to Conquest",
    approximateDate: "c. 1876 BC - c. 1406 BC",
    duration: "~430 years in Egypt + 40 years wilderness",
    keyEvent: "The Exodus and formation of Israel as a nation",
    covenantSign: "Passover Lamb's Blood",
    primaryVerse: "Exodus 19:5-6",
    description: "The family of Jacob (70 souls) becomes a nation (2+ million) enslaved in Egypt. God raises up Moses, delivers through blood and water, and constitutes Israel as His covenant nation at Sinai.",
    fiveBeats: [
      {
        beat: "creation",
        title: "A Nation Is Born",
        description: "Israel multiplies in Egypt 'exceedingly.' At Sinai, God constitutes them as His 'kingdom of priests and holy nation.' The tabernacle is built—God dwelling among His people. A nation is created from slaves.",
        keyEvent: "Multiplication in Egypt; Sinai covenant; Tabernacle erected",
        verse: "Exodus 1:7; 19:5-6; 40:34",
        symbolism: "Multiplication despite oppression = God's blessing cannot be stopped. Sinai = wedding/covenant. Tabernacle = God's home among His people—Emmanuel pattern established."
      },
      {
        beat: "fall",
        title: "The Golden Calf and Wilderness Rebellion",
        description: "Before Moses even descends with the law, Israel is worshipping a golden calf. The pattern continues: murmuring, rebellion, idolatry, complaining. The spies' faithless report leads to 40 years' wandering.",
        keyEvent: "Golden calf; Multiple rebellions; Ten spies' unbelief; Korah's rebellion",
        verse: "Exodus 32:1-6; Numbers 14:1-4; 16:1-3",
        symbolism: "The calf represents Egypt's gods—turning back. Murmuring rejects God's provision. Spies' fear = unbelief in God's promises. Korah = rejecting God's appointed leadership."
      },
      {
        beat: "judgment",
        title: "Plagues on Egypt; Death of a Generation",
        description: "Ten plagues judge Egypt and its gods. But Israel also faces judgment: 3,000 die at the golden calf, earth swallows Korah, fiery serpents kill the complainers, and an entire generation dies in the wilderness.",
        keyEvent: "Ten plagues; 3,000 slain at Sinai; 40 years' wandering; Serpents",
        verse: "Exodus 7-12; Exodus 32:28; Numbers 21:6; Numbers 14:29",
        symbolism: "Each plague targets an Egyptian god. The wilderness as 'graveyard' for the faithless generation. Yet even judgment includes the bronze serpent—foreshadowing Christ lifted up."
      },
      {
        beat: "grace",
        title: "Passover, Manna, Water, Tabernacle",
        description: "Grace abounds: the Passover lamb's blood protects; manna feeds daily; water from the rock sustains; the tabernacle provides access to God. Even a mixed multitude is included. Mercy covers repeated failure.",
        keyEvent: "Passover instituted; Manna given; Rock struck; Tabernacle completed",
        verse: "Exodus 12:13; Exodus 16:4; Exodus 17:6; Exodus 40:34",
        symbolism: "Every provision is Christ: Lamb, Bread from heaven, Rock that was struck, God dwelling among us. Grace is tangible, visible, daily experienced—not abstract."
      },
      {
        beat: "restoration",
        title: "Conquest of Canaan",
        description: "The new generation crosses Jordan, conquers Jericho, and takes possession of the Promised Land. Joshua leads them into the inheritance Abraham was promised. The wandering ends; the promise is fulfilled.",
        keyEvent: "Jordan crossed; Jericho falls; Land divided; Joshua's covenant renewal",
        verse: "Joshua 3:17; 6:20; Joshua 21:43-45; Joshua 24:14-15",
        symbolism: "Jordan = death and resurrection (ark goes first = Christ leads). Jericho falls by faith, not force. Rest in the land = spiritual rest in Christ. 'Choose this day' = ongoing covenant commitment."
      }
    ],
    keyFigures: [
      { name: "Moses", role: "Deliverer, lawgiver, mediator, prophet", significance: "Greatest OT type of Christ—'prophet like unto me' (Deut 18:15)" },
      { name: "Aaron", role: "First high priest, spokesman", significance: "Type of Christ the High Priest (Hebrews 5)" },
      { name: "Miriam", role: "Prophetess, worship leader", significance: "Song after deliverance (Exodus 15)" },
      { name: "Joshua", role: "Military leader, Moses' successor", significance: "'Jesus' in Greek—leads into rest/inheritance" },
      { name: "Caleb", role: "Faithful spy, inheritance claimer", significance: "'Wholly followed the LORD'—faith perseveres" },
      { name: "Rahab", role: "Gentile believer, scarlet cord", significance: "Faith brings Gentiles into Israel (Matthew 1:5)" }
    ],
    keyVerses: [
      "Exodus 12:13 - 'When I see the blood'",
      "Exodus 19:5-6 - 'Kingdom of priests, holy nation'",
      "Exodus 20:1-17 - Ten Commandments",
      "Numbers 21:9 - Bronze serpent",
      "Deuteronomy 18:15 - 'Prophet like me'"
    ],
    spiritualLessons: [
      "Redemption is by blood, not works",
      "God delivers from slavery to service, not slavery to self",
      "The wilderness tests what's in the heart",
      "Even believers can fail to enter rest through unbelief (Hebrews 3-4)",
      "Every provision in the wilderness is Christ"
    ],
    christConnection: "The Exodus IS the gospel in Old Testament form: Passover lamb = crucifixion; Red Sea = baptism; manna = Christ the bread; rock = Christ struck for us; tabernacle = Christ dwelling among us; bronze serpent = Christ lifted up; Joshua = Jesus leading to rest.",
    parallelsWithOtherCycles: [
      { cycle: "@No", parallel: "Salvation through water; covenant at mountain; sign given" },
      { cycle: "@Cy", parallel: "Second exodus from Babylon; temple rebuilt; remnant returns" },
      { cycle: "@Sp", parallel: "Christ is our Passover (1 Cor 5:7); we passed through waters (baptism)" }
    ],
    distinctiveElements: [
      "The only cycle with written Law given directly by God",
      "The tabernacle/sanctuary system originates here",
      "The largest visible display of miracles (plagues, Red Sea, manna)",
      "Israel constituted as a theocratic nation-state"
    ]
  },
  {
    id: "mosaic",
    tag: "@Mo",
    name: "Mosaic/Monarchic Cycle",
    fullName: "The Cycle of Kingdom Rise and Fall",
    patriarch: "David",
    timeframe: "Judges through Exile",
    approximateDate: "c. 1400 BC - 586 BC",
    duration: "~800 years",
    keyEvent: "Establishment and destruction of the kingdom",
    covenantSign: "Davidic Throne",
    primaryVerse: "2 Samuel 7:12-16",
    description: "From the judges through the united monarchy under David and Solomon, then the divided kingdom, prophetic warnings, and finally exile. The Davidic covenant promises an eternal throne that survives even destruction.",
    fiveBeats: [
      {
        beat: "creation",
        title: "The Kingdom Established",
        description: "After cycles of judges, God gives Israel a king. Saul fails, but David is chosen—a man after God's own heart. David unites the tribes, establishes Jerusalem, and receives the covenant promise of an eternal throne. Solomon builds the temple.",
        keyEvent: "David anointed; Jerusalem conquered; Davidic covenant; Temple built",
        verse: "2 Samuel 5:3; 7:12-16; 1 Kings 8:10-11",
        symbolism: "Jerusalem = city of peace, God's chosen dwelling. Temple = permanent house after tabernacle wandering. David's throne = eternal Messianic lineage. Glory fills the house = God's approval."
      },
      {
        beat: "fall",
        title: "Division and Decline",
        description: "Solomon's many wives turn his heart. Rehoboam's folly splits the kingdom. The north (Israel) never has a good king—immediate Baal worship. The south (Judah) has occasional revivals but overall decline. Prophets warn, but the people don't listen.",
        keyEvent: "Kingdom divides; Baal worship in north; Temple defiled in south; Prophets rejected",
        verse: "1 Kings 11:4; 12:16; 2 Kings 17:7-18; Jeremiah 25:3-7",
        symbolism: "Division = consequence of sin; the kingdom never reunites. Baal = fertility gods replacing YHWH. Temple defilement = the heart of worship corrupted. Rejected prophets = rejected God."
      },
      {
        beat: "judgment",
        title: "Exile of Both Kingdoms",
        description: "The north falls to Assyria (722 BC)—ten tribes scattered. The south falls to Babylon (586 BC)—temple destroyed, city burned, people exiled. The Davidic line appears cut off. Total devastation of all God gave.",
        keyEvent: "Assyrian captivity (north); Babylonian captivity (south); Temple destroyed",
        verse: "2 Kings 17:6; 25:8-11; Lamentations 1:1",
        symbolism: "Exile = covenant curses fulfilled (Deuteronomy 28). Temple destruction = God's presence departed. Babylon = anti-Eden, anti-Jerusalem. The line of David seems finished."
      },
      {
        beat: "grace",
        title: "Prophetic Promises of Restoration",
        description: "Even in judgment, prophets promise restoration: Jeremiah's 70 years, Ezekiel's dry bones, Isaiah's Suffering Servant, Daniel's timeline to Messiah. A remnant will return. The new covenant is promised. Hope survives destruction.",
        keyEvent: "Prophetic books written; New covenant promised; Remnant preserved; Messiah foretold",
        verse: "Jeremiah 31:31-34; Ezekiel 37; Isaiah 53; Daniel 9:24-27",
        symbolism: "Prophets = God's voice when the institution failed. New covenant = internalized law, Spirit given. Remnant = God always preserves a seed. Messiah = all hope centers here."
      },
      {
        beat: "restoration",
        title: "Return from Exile",
        description: "Cyrus decrees return (539 BC). Zerubbabel leads the first return; the temple is rebuilt (516 BC). Ezra brings the Law; Nehemiah rebuilds walls. Though smaller and without former glory, the restoration prepares for Messiah's coming.",
        keyEvent: "Cyrus's decree; Temple rebuilt; Ezra's reforms; Walls rebuilt; 400 silent years",
        verse: "Ezra 1:1-4; 6:14-15; Nehemiah 6:15; Malachi 4:5-6",
        symbolism: "Cyrus = anointed Gentile deliverer (type of Christ). Second temple = lesser glory but awaits greater. 400 years of silence = waiting for the 'fullness of time.'"
      }
    ],
    keyFigures: [
      { name: "David", role: "Shepherd-king, psalm writer, covenant recipient", significance: "Christ is 'Son of David'—throne is eternal" },
      { name: "Solomon", role: "Wise king, temple builder, then apostate", significance: "Greater than Solomon is here (Matthew 12:42)" },
      { name: "Elijah", role: "Prophet of fire, confronts Baal", significance: "Returns before the Day of the LORD (Malachi 4:5)" },
      { name: "Isaiah", role: "Prophet of Messiah, Suffering Servant", significance: "More Messianic prophecies than any other" },
      { name: "Jeremiah", role: "Weeping prophet, new covenant", significance: "Promises the internalized covenant" },
      { name: "Daniel", role: "Exile prophet, interpreter of times", significance: "Timeline to Messiah (70 weeks)" }
    ],
    keyVerses: [
      "2 Samuel 7:12-16 - Davidic covenant",
      "1 Kings 8:27 - 'Heaven of heavens cannot contain You'",
      "Jeremiah 31:31-34 - New covenant promise",
      "Isaiah 53 - Suffering Servant",
      "Daniel 9:24-27 - 70 weeks prophecy"
    ],
    spiritualLessons: [
      "Even good beginnings can end badly without vigilance",
      "God warns before He judges—prophets precede punishment",
      "Institutions can corrupt but God's purposes continue",
      "Exile is not the end—restoration follows judgment",
      "The old covenant's failure reveals the need for the new"
    ],
    christConnection: "David's throne is eternally Christ's (Luke 1:32-33). Solomon's temple points to Christ as the true temple (John 2:19). The prophets speak of Christ on every page. The exile and return pattern Christ's death and resurrection. The Suffering Servant IS Christ.",
    parallelsWithOtherCycles: [
      { cycle: "@Ab", parallel: "Promise of 'seed'; kingdom/land inheritance" },
      { cycle: "@Cy", parallel: "Return from exile; temple rebuilt" },
      { cycle: "@Re", parallel: "Remnant preserved through judgment; final restoration promised" }
    ],
    distinctiveElements: [
      "The Davidic covenant—eternal throne promise",
      "The prophetic literature emerges",
      "The temple as permanent sanctuary",
      "The most detailed timeline prophecies (Daniel)"
    ]
  },
  {
    id: "cyrusic",
    tag: "@Cy",
    name: "Cyrusic/Second Temple Cycle",
    fullName: "The Cycle of Preparation for Messiah",
    patriarch: "Ezra/Nehemiah/Zerubbabel",
    timeframe: "Return from Exile to Christ",
    approximateDate: "539 BC - 4 BC",
    duration: "~535 years",
    keyEvent: "Return from exile and Messiah's first coming",
    covenantSign: "Rebuilt Temple / Star of Bethlehem",
    primaryVerse: "Isaiah 44:28 - 45:1",
    description: "The second temple period prepares for Messiah. Israel returns from Babylon, rebuilds temple and walls, but remains under Gentile rule. Greek culture spreads, Rome rises, and 'the fullness of time' arrives for Christ's birth.",
    fiveBeats: [
      {
        beat: "creation",
        title: "The Second Temple Era",
        description: "Cyrus's decree enables return. Zerubbabel rebuilds the temple (completed 516 BC). Ezra restores the Law. Nehemiah rebuilds the walls. Though without the Ark and Shekinah glory, worship resumes. A new beginning from the ashes.",
        keyEvent: "Cyrus's decree; Temple rebuilt; Ezra's reforms; Walls rebuilt; Synagogue system develops",
        verse: "Ezra 1:1-4; 6:15; Nehemiah 8:1-8",
        symbolism: "Second temple = preparation for the One greater than temple. Synagogues = Word-centered worship spreads. Greek language prepares for NT. Roman roads prepare for gospel spread."
      },
      {
        beat: "fall",
        title: "Greek Influence and Hasmonean Corruption",
        description: "Alexander conquers (331 BC); Greek culture infiltrates Judaism. Antiochus Epiphanes desecrates the temple (167 BC). The Maccabean revolt succeeds but the Hasmonean kingdom becomes corrupt. Pharisees, Sadducees, Essenes fragment Judaism.",
        keyEvent: "Greek conquest; Temple desecration; Maccabean revolt; Sectarian divisions",
        verse: "Daniel 8:9-12; 11:31-35",
        symbolism: "Hellenization = cultural compromise. Abomination of desolation = type of end-time desecration. Divisions = religion without unity. Rome takes over—Israel under Gentile dominion awaiting Messiah."
      },
      {
        beat: "judgment",
        title: "400 Years of Silence",
        description: "After Malachi, no prophetic word for 400 years. Israel is under Persian, Greek, then Roman rule. No Shekinah glory, no prophets, no miracles. A long silence broken only by echoes of Messianic hope. Judgment as absence.",
        keyEvent: "Prophetic silence; Gentile dominion; Herodian rule; Spiritual darkness",
        verse: "Malachi 4:5-6; Amos 8:11-12",
        symbolism: "Silence = judgment through absence. 400 years echoes 400 years in Egypt—bondage before deliverance. The night is darkest before dawn. Anticipation builds."
      },
      {
        beat: "grace",
        title: "Fullness of Time—Messiah Born",
        description: "Gabriel appears to Zechariah, then Mary. John the Baptist breaks the silence as Elijah returned. Jesus is born in Bethlehem as prophesied. The Word becomes flesh. Grace incarnate enters the world.",
        keyEvent: "Gabriel's announcements; John the Baptist's birth; Jesus's birth; Shepherds and Magi",
        verse: "Galatians 4:4; Luke 1-2; Matthew 1-2; John 1:14",
        symbolism: "Virgin birth fulfills Isaiah 7:14. Bethlehem fulfills Micah 5:2. Egypt sojourn fulfills Hosea 11:1. Every prophetic thread converges on the manger."
      },
      {
        beat: "restoration",
        title: "Christ's Ministry and Cross",
        description: "Jesus ministers for 3.5 years, proclaiming the kingdom, healing, teaching. He is rejected, crucified, and rises. He commissions disciples and ascends. The foundation is laid for the next cycle—the Spirit's outpouring.",
        keyEvent: "Jesus's ministry; Crucifixion; Resurrection; Ascension; Great Commission",
        verse: "Mark 1:14-15; 1 Corinthians 15:3-4; Matthew 28:18-20; Acts 1:8",
        symbolism: "Crucifixion = ultimate Passover. Resurrection = ultimate Firstfruits. Ascension = high priest entering the Holy Place (first apartment) to begin His intercessory ministry. In 1844 He entered the Most Holy Place (second apartment) for the investigative judgment. The temple of His body destroyed and rebuilt in three days."
      }
    ],
    keyFigures: [
      { name: "Cyrus", role: "Persian king, God's anointed deliverer", significance: "Called 'My shepherd' and 'His anointed' (Isaiah 44:28; 45:1)" },
      { name: "Zerubbabel", role: "Davidic heir, temple builder", significance: "Signed 'ring' of God (Haggai 2:23)—type of Christ" },
      { name: "Ezra", role: "Priest-scribe, law teacher", significance: "Restores the Word to central place" },
      { name: "Nehemiah", role: "Governor, wall builder", significance: "Leadership in face of opposition" },
      { name: "John the Baptist", role: "Forerunner, voice in wilderness", significance: "Elijah who prepares the way (Malachi 4:5)" },
      { name: "Jesus Christ", role: "Messiah, Savior, Lord", significance: "Fulfillment of all prophecy—the goal of history" }
    ],
    keyVerses: [
      "Isaiah 44:28 - 'Cyrus, He is My shepherd'",
      "Haggai 2:9 - 'Glory of this latter house'",
      "Malachi 3:1 - 'Messenger of the covenant'",
      "Galatians 4:4 - 'Fullness of time'",
      "John 1:14 - 'The Word became flesh'"
    ],
    spiritualLessons: [
      "God uses pagan rulers to accomplish His purposes",
      "Silence is not absence—God is still working",
      "Cultural influence can corrupt from within",
      "Prophetic fulfillment happens on God's timetable",
      "'The fullness of time' means everything aligns for God's purpose"
    ],
    christConnection: "This entire cycle exists to prepare for Christ. Cyrus is called 'anointed' (Messiah) but points to the true Anointed One. The second temple awaits the One greater than the temple. The silence builds anticipation. Every detail of Christ's birth fulfills prophecy.",
    parallelsWithOtherCycles: [
      { cycle: "@Ab", parallel: "Deliverance from bondage (Egypt/Babylon); new exodus" },
      { cycle: "@Mo", parallel: "Temple rebuilt (first/second); Law restored" },
      { cycle: "@Sp", parallel: "Spirit given; new covenant inaugurated" }
    ],
    distinctiveElements: [
      "God uses a pagan king (Cyrus) as 'His anointed'",
      "400 years of prophetic silence—unprecedented",
      "Greek language and Roman infrastructure prepare for the gospel",
      "Messiah's arrival in precise prophetic timing (Daniel 9)"
    ]
  },
  {
    id: "spirit",
    tag: "@Sp",
    name: "Spirit Cycle",
    fullName: "The Cycle of the Church Age",
    patriarch: "The Apostles / The Church",
    timeframe: "Pentecost to Second Coming",
    approximateDate: "AD 31 - Future",
    duration: "~2000+ years (ongoing)",
    keyEvent: "Outpouring of the Spirit and the Church's mission",
    covenantSign: "Indwelling Spirit / Baptism",
    primaryVerse: "Acts 2:17-18",
    description: "The Church is born at Pentecost, empowered by the Spirit to carry the gospel to all nations. The cycle includes the early church, apostasy, reformation, and end-time preparation for Christ's return.",
    fiveBeats: [
      {
        beat: "creation",
        title: "The Church Is Born",
        description: "At Pentecost, the Spirit falls on 120 disciples. They speak in tongues, Peter preaches, 3,000 are baptized. The Church is born—a new creation, the body of Christ, composed of Jews and Gentiles. The gospel begins its march to the ends of the earth.",
        keyEvent: "Pentecost outpouring; 3,000 converted; Apostolic community; Gospel spreads",
        verse: "Acts 2:1-41; Acts 1:8",
        symbolism: "Tongues of fire = God's presence distributed. Languages = Babel reversed. 3,000 saved (vs. 3,000 killed at Sinai) = law kills, Spirit gives life. 'To the ends of the earth' = universal mission."
      },
      {
        beat: "fall",
        title: "Apostasy and Persecution",
        description: "Even in apostolic times, false teachers emerge. Within centuries, the church compromises with paganism. The 1260-year prophecy (AD 538-1798) sees papal dominion and persecution of dissenters. Babylon the Great corrupts Christianity.",
        keyEvent: "Early heresies; Constantine's compromise; Medieval papacy; Persecution of saints",
        verse: "2 Thessalonians 2:3-4; Revelation 2-3 (church decline); Revelation 17:1-6",
        symbolism: "The falling away = predicted apostasy. Mystery Babylon = religious corruption. 1260 days/years = prophesied period of suppression. Faithful remnant always exists, often underground."
      },
      {
        beat: "judgment",
        title: "Judgment on Apostasy; Final Tribulation",
        description: "The Reformation judges medieval corruption. The 'deadly wound' to papal power (1798). Future tribulation intensifies as the end approaches. The seven last plagues fall on Babylon. Christ comes to judge the living and dead.",
        keyEvent: "Reformation; French Revolution; 1798 wound; Future plagues; Second Coming",
        verse: "Revelation 13:3; Revelation 16; Revelation 19:11-21",
        symbolism: "The deadly wound = judgment on false religion. Plagues = Exodus plagues repeated globally. Christ on white horse = King coming to judge and reign."
      },
      {
        beat: "grace",
        title: "Reformation and Remnant Calling",
        description: "God raises up reformers: Wycliffe, Hus, Luther, Calvin, Wesley, and more. The Three Angels' Messages call the world to worship the Creator, leave Babylon, and prepare for Christ. Grace calls a final remnant from all nations.",
        keyEvent: "Protestant Reformation; Great Awakening; Advent movement; Final gospel proclamation",
        verse: "Revelation 14:6-12; Revelation 18:4",
        symbolism: "Three angels = the final message before the end. 'Come out of her' = separation from apostasy. The Sabbath = seal of God. The remnant keeps commandments and faith of Jesus."
      },
      {
        beat: "restoration",
        title: "Christ Returns; Eternity Begins",
        description: "Christ returns visibly, gloriously. The dead are raised; the living transformed. Satan is bound 1000 years. After the millennium, the wicked are destroyed, the earth made new. God dwells with His people forever. The cycle ends in eternal restoration.",
        keyEvent: "Second Coming; Resurrection; Millennium; New Earth; Eternal dwelling",
        verse: "1 Thessalonians 4:16-17; Revelation 20-22",
        symbolism: "Resurrection = Firstfruits complete. Millennium = Sabbath rest for creation. Lake of fire = final destruction of evil. New Jerusalem = God with humanity forever. The cycle ends in permanent restoration."
      }
    ],
    keyFigures: [
      { name: "Peter", role: "Apostle to Jews, foundation layer", significance: "Keys of the kingdom; Pentecost preacher" },
      { name: "Paul", role: "Apostle to Gentiles, theologian", significance: "Explains justification by faith; plants churches" },
      { name: "John", role: "Beloved disciple, Revelation receiver", significance: "Final canon; end-time prophecy" },
      { name: "Luther", role: "Reformer, sola fide champion", significance: "Justification by faith recovered" },
      { name: "Wesley", role: "Revivalist, sanctification preacher", significance: "Holiness and evangelistic zeal" },
      { name: "The Remnant", role: "End-time people of God", significance: "Keep commandments and faith of Jesus" }
    ],
    keyVerses: [
      "Acts 2:17-18 - Spirit poured out",
      "Romans 1:16 - Gospel is God's power to save",
      "Revelation 14:6-12 - Three Angels' Messages",
      "Revelation 18:4 - Come out of Babylon",
      "Revelation 22:20 - 'Surely I am coming soon'"
    ],
    spiritualLessons: [
      "The Spirit empowers what the Law demanded",
      "Apostasy is predicted but not inevitable for individuals",
      "Reformation is always possible—God raises up reformers",
      "The gospel must reach every nation before the end",
      "Christ's return is certain—live in readiness"
    ],
    christConnection: "Christ sends the Spirit as His representative. The Church is Christ's body. He intercedes as our High Priest. He is coming again as King. The entire cycle is about Christ building His church and preparing His bride.",
    parallelsWithOtherCycles: [
      { cycle: "@Ad", parallel: "New creation (2 Cor 5:17); old passes, new comes" },
      { cycle: "@No", parallel: "Judgment coming; ark of safety (Christ); 8 = new beginning" },
      { cycle: "@Ab", parallel: "Called out of Babylon (world); sojourners and pilgrims; faith reckoned as righteousness" },
      { cycle: "@Mo", parallel: "Passover Lamb (1 Cor 5:7); baptism (Red Sea); manna (Bread of Life); wilderness testing" }
    ],
    distinctiveElements: [
      "The indwelling Spirit in all believers—not just leaders",
      "Jew and Gentile united in one body",
      "The Great Commission—global scope",
      "The longest cycle—still in progress",
      "Culminates in the eternal state—the 'cycle' ends"
    ]
  },
  {
    id: "remnant",
    tag: "@Re",
    name: "Remnant Cycle",
    fullName: "The Cycle of End-Time Restoration",
    patriarch: "End-Time People of God",
    timeframe: "1844 to Second Coming",
    approximateDate: "1844 - Future",
    duration: "~180+ years (final phase)",
    keyEvent: "Investigative judgment and final proclamation",
    covenantSign: "Sabbath Seal / Character of Christ",
    primaryVerse: "Revelation 14:12",
    description: "The final phase of the Spirit Cycle, beginning with the end of the 2300-day prophecy (1844), the cleansing of the heavenly sanctuary, and the emergence of a remnant people preparing the world for Christ's return.",
    fiveBeats: [
      {
        beat: "creation",
        title: "The Advent Movement Begins",
        description: "The study of Daniel 8:14 leads to the 'Great Awakening' of the 1830s-40s. After the 1844 disappointment, the heavenly sanctuary truth is discovered. A movement is born focused on the investigative judgment, Sabbath, and Second Coming.",
        keyEvent: "Millerite movement; 1844 disappointment; Sanctuary truth discovered; Sabbath restored",
        verse: "Daniel 8:14; Revelation 10 (sweet/bitter); Revelation 14:6-7",
        symbolism: "Bitter disappointment = eating the scroll (Rev 10). The mistake was the event, not the time. Christ entered the Most Holy Place. A new prophetic movement is born."
      },
      {
        beat: "fall",
        title: "Lukewarmness and Worldliness",
        description: "The Laodicean message applies: 'You are neither cold nor hot.' Worldliness infiltrates. Debates over truth. Institutional pride replacing Spirit-dependence. The delay leads some to doubt. The need for revival and reformation.",
        keyEvent: "Laodicean condition; Worldly influences; Internal debates; Delay challenges faith",
        verse: "Revelation 3:15-17",
        symbolism: "Laodicea = 'judging of the people'—appropriate for judgment-hour message. Neither hot nor cold = complacency. Rich = self-satisfied. Wretched = true condition unrecognized."
      },
      {
        beat: "judgment",
        title: "Investigative Judgment and Shaking",
        description: "The judgment of the dead began in 1844; judgment of the living approaches. A 'shaking' separates true from false. Sunday laws will test loyalty. Those without the seal of God will receive the mark of the beast. Lines are drawn.",
        keyEvent: "Judgment proceeding; Shaking time; Sunday laws; Mark vs. Seal",
        verse: "Daniel 7:9-10; Revelation 13:15-17; Revelation 14:9-11",
        symbolism: "Shaking = chaff separated from wheat. Sunday laws = the test of loyalty. Seal of God = Sabbath-keeping; mark of beast = forced false worship. Probation closes."
      },
      {
        beat: "grace",
        title: "Latter Rain and Loud Cry",
        description: "God pours out the latter rain—the final, powerful manifestation of the Spirit. The 'loud cry' of the third angel swells to a global proclamation. Multitudes leave Babylon. The work is finished in a short time.",
        keyEvent: "Latter rain outpouring; Loud cry; Final harvest; Babylon's fall announced",
        verse: "Revelation 18:1-4; Joel 2:23; James 5:7",
        symbolism: "Latter rain = full empowerment for harvest. Loud cry = Revelation 18:1-4 at its peak. Midnight cry = final invitation before the door closes. The earth is lightened with glory."
      },
      {
        beat: "restoration",
        title: "Christ Returns; Remnant Vindicated",
        description: "Christ appears in glory. The righteous dead rise first; the living are caught up. The remnant's faith is vindicated. Satan is bound. The millennium of rest. New earth established. The cycle ends in eternal restoration.",
        keyEvent: "Second Coming; Resurrection; Translation; Millennium; New Earth; Eternity",
        verse: "1 Thessalonians 4:16-17; Revelation 20:4-6; Revelation 21:1-7",
        symbolism: "The 'Blessed Hope' realized. The marriage supper of the Lamb. 1000 years of Sabbath rest. New Jerusalem descends. 'God Himself will be with them.' All things made new."
      }
    ],
    keyFigures: [
      { name: "William Miller", role: "Baptist preacher, prophecy student", significance: "Initiated the study of 2300 days" },
      { name: "Ellen G. White", role: "Prophetic voice, author", significance: "Guided the movement's development" },
      { name: "The 144,000", role: "Sealed servants, final generation", significance: "Living saints translated without seeing death" },
      { name: "Two Witnesses", role: "Prophetic testimony", significance: "Old and New Testament witness in end-time" }
    ],
    keyVerses: [
      "Daniel 8:14 - 2300 days, sanctuary cleansed",
      "Revelation 14:6-12 - Three Angels' Messages",
      "Revelation 14:12 - Patience of saints, commandments, faith of Jesus",
      "Revelation 18:4 - Come out of Babylon",
      "Revelation 22:11-12 - Probation closes, Christ comes"
    ],
    spiritualLessons: [
      "Understanding prophecy is progressive—light increases",
      "Disappointment can lead to deeper truth",
      "The final test is over worship—the Sabbath question",
      "Character development is the work of preparation",
      "The victory is already won—we enter into it"
    ],
    christConnection: "Christ in the Most Holy Place is the central truth of this cycle. He is completing His atoning work, blotting out sins, preparing a people to meet Him. The character of Christ is to be reproduced in His people. He is coming soon.",
    parallelsWithOtherCycles: [
      { cycle: "@Ab", parallel: "Exodus from Babylon; preparation for the Promised Land" },
      { cycle: "@Mo", parallel: "Day of Atonement reality; High Priest in Most Holy Place" },
      { cycle: "@Cy", parallel: "Preparation for Christ's coming (1st/2nd advent)" }
    ],
    distinctiveElements: [
      "The investigative judgment—unique to this phase",
      "The cleansing of the heavenly sanctuary",
      "The Three Angels' Messages as the final call",
      "The Sabbath as the seal of God",
      "The final generation—living through the end without a Mediator"
    ]
  }
];

// Helper Functions
export const getCycleByTag = (tag: CycleTag): CovenantCycle | undefined => {
  return covenantCycles.find(c => c.tag === tag);
};

export const getCycleById = (id: string): CovenantCycle | undefined => {
  return covenantCycles.find(c => c.id === id);
};

export const getAllCycles = (): CovenantCycle[] => {
  return covenantCycles;
};

export const getBeatsByType = (beat: CycleBeat): CycleBeatDetail[] => {
  const beats: CycleBeatDetail[] = [];
  covenantCycles.forEach(cycle => {
    const found = cycle.fiveBeats.find(b => b.beat === beat);
    if (found) beats.push(found);
  });
  return beats;
};

export const searchCycles = (query: string): CovenantCycle[] => {
  const lowerQuery = query.toLowerCase();
  return covenantCycles.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.patriarch.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.christConnection.toLowerCase().includes(lowerQuery) ||
    c.keyVerses.some(v => v.toLowerCase().includes(lowerQuery))
  );
};

export const getParallelsForCycle = (tag: CycleTag): CycleParallel[] => {
  const cycle = getCycleByTag(tag);
  return cycle?.parallelsWithOtherCycles || [];
};

export const getFiveBeatPattern = (): CyclePattern => {
  return fiveBeatPattern;
};

export const getTotalCyclesCount = (): number => {
  return covenantCycles.length;
};
