// Biblical Feasts Library - Comprehensive Guide to God's Prophetic Calendar
// The 7 Feasts of Leviticus 23 reveal Christ's complete redemptive work

export type FeastSeason = "spring" | "fall";
export type FeastFulfillment = "fulfilled" | "being-fulfilled" | "future";

export interface BiblicalFeast {
  id: string;
  name: string;
  hebrewName: string;
  hebrewMeaning: string;
  season: FeastSeason;
  month: number; // Hebrew month number
  day: string; // Day(s) of the month
  duration: string;
  agriculturalContext: string;
  historicalCommemoration: string;
  instructions: string[];
  prohibitions: string[];
  offerings: string[];
  rituals: FeastRitual[];
  christFulfillment: ChristConnection;
  propheticSignificance: string;
  churchApplication: string[];
  keyVerses: string[];
  relatedFeasts?: string[];
}

export interface FeastRitual {
  name: string;
  description: string;
  symbolism: string;
  christConnection: string;
}

export interface ChristConnection {
  event: string;
  date: string;
  description: string;
  proofTexts: string[];
  fulfillmentDetails: string[];
}

export interface FeastGroup {
  id: string;
  name: string;
  hebrewName: string;
  season: FeastSeason;
  theme: string;
  prophetic: string;
  feasts: string[];
}

// Feast Groups
export const feastGroups: FeastGroup[] = [
  {
    id: "spring-feasts",
    name: "Spring Feasts",
    hebrewName: "Mo'adim Aviv",
    season: "spring",
    theme: "First Coming of Christ - Redemption Accomplished",
    prophetic: "All spring feasts were fulfilled at Christ's first coming, on the exact days they were celebrated. Passover (Crucifixion), Unleavened Bread (Burial), Firstfruits (Resurrection), Pentecost (Spirit's Coming).",
    feasts: ["passover", "unleavened-bread", "firstfruits", "pentecost"]
  },
  {
    id: "fall-feasts",
    name: "Fall Feasts",
    hebrewName: "Mo'adim Stav",
    season: "fall",
    theme: "Second Coming of Christ - Redemption Applied",
    prophetic: "The fall feasts await fulfillment at Christ's second coming. Trumpets (Resurrection/Rapture), Day of Atonement (Final Judgment), Tabernacles (Eternal Dwelling). The gap between spring and fall represents the church age.",
    feasts: ["trumpets", "day-of-atonement", "tabernacles"]
  }
];

// The Seven Feasts
export const biblicalFeasts: BiblicalFeast[] = [
  // ===============================================
  // SPRING FEASTS - FIRST COMING
  // ===============================================
  {
    id: "passover",
    name: "Passover",
    hebrewName: "Pesach",
    hebrewMeaning: "To pass over, to spare, to protect",
    season: "spring",
    month: 1, // Nisan (Aviv)
    day: "14th",
    duration: "1 day (evening service)",
    agriculturalContext: "Beginning of the barley harvest in Israel. The first agricultural festival marking the start of the harvest season.",
    historicalCommemoration: "The night God struck Egypt's firstborn but 'passed over' houses with lamb's blood on the doorposts. Israel's deliverance from 400 years of slavery.",
    instructions: [
      "Select a lamb on the 10th day of the first month",
      "Lamb must be without blemish, male, one year old",
      "Keep the lamb until the 14th day",
      "Slaughter the lamb at twilight (between the evenings)",
      "Apply blood to doorposts and lintel with hyssop",
      "Roast the lamb whole—do not break any bones",
      "Eat with unleavened bread and bitter herbs",
      "Eat in haste, dressed for travel",
      "Burn any remains before morning",
      "None may go outside until morning"
    ],
    prohibitions: [
      "No leaven in houses during the feast",
      "No foreigner may eat unless circumcised",
      "No bone of the lamb may be broken",
      "No leftover meat may remain until morning"
    ],
    offerings: [
      "The Passover lamb—one per household",
      "Unleavened bread",
      "Bitter herbs (maror)",
      "Wine for the four cups"
    ],
    rituals: [
      {
        name: "Selection of the Lamb (10th Nisan)",
        description: "Each household selects a perfect lamb, bringing it into the home for inspection for four days",
        symbolism: "Public examination to ensure the lamb is truly without defect. The waiting period builds anticipation and attachment.",
        christConnection: "Jesus entered Jerusalem on the 10th of Nisan (Palm Sunday), was examined by Pilate, Herod, Pharisees, and Sadducees—and found 'without fault.'"
      },
      {
        name: "Application of Blood",
        description: "Using a hyssop branch, the blood is applied to the two doorposts and lintel, forming a blood-marked entrance",
        symbolism: "The blood creates a protected space. Three points of application suggest the Trinity. The shape suggests arms outstretched and a crowned head.",
        christConnection: "Christ's blood applied by faith protects from judgment. The cross shape is visible. 'When I see the blood, I will pass over you.'"
      },
      {
        name: "Roasting the Lamb",
        description: "The lamb is roasted whole over fire, attached to a spit through it and crossbar through its shoulders",
        symbolism: "Fire represents judgment. The lamb experiences the full intensity of judgment. The spit and crossbar form a cross shape. Nothing removed or hidden.",
        christConnection: "Christ endured the full fire of God's wrath against sin. He was exposed completely—nothing held back. The cross is prefigured in the cooking method."
      },
      {
        name: "Eating in Haste",
        description: "The meal is eaten quickly, standing, with sandals on, staff in hand, ready to depart immediately",
        symbolism: "Salvation requires action. Pilgrims don't settle in Egypt. Readiness for divine deliverance. No lingering in the place of bondage.",
        christConnection: "We are to flee from sin immediately. Christ's salvation is urgent—'now is the day of salvation.' Ready for the journey ahead."
      },
      {
        name: "The Four Cups",
        description: "Four cups of wine drunk throughout the Seder, each with specific meaning: Sanctification, Deliverance, Redemption, Praise",
        symbolism: "Based on God's four promises in Exodus 6:6-7: 'I will bring you out,' 'I will free you,' 'I will redeem you,' 'I will take you as my own people.'",
        christConnection: "Jesus instituted the Lord's Supper with the third cup—the Cup of Redemption. He said He would not drink the fourth cup until the Kingdom comes (future fulfillment)."
      },
      {
        name: "The Afikomen",
        description: "The middle of three matzahs is broken, wrapped in linen, hidden, and later 'resurrected' by the children to be shared",
        symbolism: "Three matzahs (Father, Son, Spirit?), the middle one broken, hidden, then revealed. The striped and pierced matzah speaks of Christ's wounds.",
        christConnection: "Christ, the second person of Trinity, was broken, wrapped in linen, buried (hidden), and rose (found). The last thing eaten—lingering on the palate—like the lasting presence of Christ."
      }
    ],
    christFulfillment: {
      event: "The Crucifixion of Jesus Christ",
      date: "14th of Nisan, AD 31 (Friday afternoon)",
      description: "Jesus died on the cross at 3 PM, the exact hour when the Passover lambs were being slaughtered in the temple. He is the Lamb of God who takes away the sin of the world.",
      proofTexts: ["John 1:29", "1 Corinthians 5:7", "1 Peter 1:18-19", "John 19:14", "John 19:36"],
      fulfillmentDetails: [
        "Selected on 10th Nisan (Triumphal Entry)",
        "Examined and found without fault (Pilate's verdict)",
        "Slain at twilight/3 PM on 14th Nisan",
        "No bones broken (John 19:36)",
        "Blood provides protection from judgment",
        "His flesh is our spiritual food"
      ]
    },
    propheticSignificance: "The foundation of all redemption. Without Passover, no other feast has meaning. The cross is central to God's entire plan. Judgment passes over all who are under the blood.",
    churchApplication: [
      "Christ is our Passover lamb—we live under His blood",
      "The Lord's Supper commemorates this reality",
      "Examine yourself (as the lamb was examined) before communion",
      "Live ready to move—don't get comfortable in 'Egypt'",
      "Share the Passover story with the next generation"
    ],
    keyVerses: ["Exodus 12:1-28", "Leviticus 23:5", "1 Corinthians 5:7", "John 1:29", "1 Peter 1:18-19"],
    relatedFeasts: ["unleavened-bread", "firstfruits"]
  },
  {
    id: "unleavened-bread",
    name: "Feast of Unleavened Bread",
    hebrewName: "Chag HaMatzot",
    hebrewMeaning: "Festival of the Matzahs (unleavened cakes)",
    season: "spring",
    month: 1,
    day: "15th-21st",
    duration: "7 days",
    agriculturalContext: "Occurs during barley harvest. The first grain is cut and processed without leaven—quick bread for the harvest workers.",
    historicalCommemoration: "Israel's hasty departure from Egypt. No time to let bread rise—they took dough before it was leavened. Seven days of eating unleavened bread.",
    instructions: [
      "Remove all leaven from your house before the feast begins",
      "Eat unleavened bread for seven full days",
      "First day is a holy convocation—no regular work",
      "Seventh day is a holy convocation—no regular work",
      "Offer food offerings to the LORD for seven days"
    ],
    prohibitions: [
      "No leaven may be found in your houses",
      "No leavened bread may be eaten",
      "Anyone eating leaven is cut off from Israel",
      "No regular work on first and seventh days"
    ],
    offerings: [
      "Burnt offering: 2 bulls, 1 ram, 7 male lambs (daily)",
      "Grain offering: fine flour mixed with oil",
      "Sin offering: 1 male goat (daily)",
      "Drink offerings with each"
    ],
    rituals: [
      {
        name: "Bedikat Chametz (Search for Leaven)",
        description: "The night before, the father searches the house by candlelight with a feather and wooden spoon, collecting any remaining leaven",
        symbolism: "Sin must be actively sought out and removed. Light exposes what darkness hides. The search is thorough—every corner examined.",
        christConnection: "Christ is the Light that exposes sin. We must actively search our hearts and remove sin. The Spirit illuminates hidden areas."
      },
      {
        name: "Biur Chametz (Burning the Leaven)",
        description: "The collected leaven is burned the morning before Passover begins, with a prayer nullifying any undiscovered leaven",
        symbolism: "Sin must be destroyed, not just hidden. Fire consumes completely. The prayer acknowledges we may have missed something—humility.",
        christConnection: "Christ destroyed sin on the cross. God's judgment (fire) consumed our sin in Him. We confess known sins specifically but trust His blood for unknown sins."
      },
      {
        name: "Eating Matzah for Seven Days",
        description: "Only unleavened bread is eaten for the entire week. Matzah becomes the staple food.",
        symbolism: "Complete purification takes time. Seven = completeness. The diet change represents life transformation. Matzah is striped (Isaiah 53:5) and pierced (Zechariah 12:10).",
        christConnection: "Christ is our unleavened bread—sinless. We feed on Him continuously. Seven days represents our complete Christian life—free from sin's power."
      }
    ],
    christFulfillment: {
      event: "The Burial of Jesus Christ",
      date: "15th of Nisan, AD 31 (Friday evening through Saturday)",
      description: "Jesus's body lay in the tomb on the first day of Unleavened Bread. As the Sinless One, He was the true 'unleavened bread'—without the leaven of sin. His burial 'removed the leaven' of our sin.",
      proofTexts: ["1 Corinthians 5:8", "2 Corinthians 5:21", "John 19:38-42", "Matthew 26:17"],
      fulfillmentDetails: [
        "Jesus buried before sunset on 14th Nisan",
        "Lay in tomb on Sabbath = 15th Nisan = first day of Unleavened Bread",
        "His sinless body was the true unleavened bread",
        "Our sin was buried with Him (Romans 6:4)",
        "His burial completed the removal of our sin"
      ]
    },
    propheticSignificance: "Represents the burial of the old life and living a new life free from sin's power. The complete sanctification of the believer. Putting off the old self.",
    churchApplication: [
      "Actively search for and remove sin from your life",
      "Feed on Christ (the unleavened bread) daily",
      "Live a life of sincerity and truth, not malice or wickedness",
      "The leaven of pride, hypocrisy, and false teaching must be purged",
      "Sanctification is a process (7 days) requiring consistent effort"
    ],
    keyVerses: ["Exodus 12:15-20", "Leviticus 23:6-8", "1 Corinthians 5:6-8", "Galatians 5:9"],
    relatedFeasts: ["passover", "firstfruits"]
  },
  {
    id: "firstfruits",
    name: "Feast of Firstfruits",
    hebrewName: "Yom HaBikkurim",
    hebrewMeaning: "Day of the First Fruits",
    season: "spring",
    month: 1,
    day: "Day after the Sabbath during Unleavened Bread (16th Nisan)",
    duration: "1 day",
    agriculturalContext: "The first sheaf of the barley harvest is cut and presented to God. Represents the first portion of the harvest that guarantees the full harvest to come.",
    historicalCommemoration: "Entry into the Promised Land—Israel could now eat the produce of Canaan. The manna stopped. A new chapter of God's provision began.",
    instructions: [
      "Bring a sheaf of the first grain to the priest",
      "The priest waves the sheaf before the LORD for acceptance",
      "Wave it on the day after the Sabbath (during Unleavened Bread)",
      "Do not eat bread, roasted grain, or fresh grain until this offering is made",
      "Offer a male lamb as burnt offering with grain and drink offerings"
    ],
    prohibitions: [
      "No eating of new harvest until firstfruits is offered",
      "The offering must be the very first—not second quality"
    ],
    offerings: [
      "Sheaf of firstfruits grain (wave offering)",
      "Male lamb, one year old, without blemish (burnt offering)",
      "Two-tenths ephah fine flour mixed with oil (grain offering)",
      "One-fourth hin of wine (drink offering)"
    ],
    rituals: [
      {
        name: "Cutting the First Sheaf",
        description: "A delegation went to a marked field the evening the Sabbath ended. As three stars appeared, they cut the first standing grain with a sickle.",
        symbolism: "The first of the harvest is dedicated. It represents the whole. The public cutting ensured no fraud. Stars appearing = new day = resurrection morning.",
        christConnection: "Christ rose 'when the Sabbath was past' (Mark 16:1). He is the firstfruits of the resurrection. His rising guarantees ours."
      },
      {
        name: "Waving the Sheaf",
        description: "The priest waved the sheaf before the LORD, moving it toward the altar and back, up and down—presenting it in every direction",
        symbolism: "Complete presentation to God. The waving makes the offering visible to all. The sheaf is 'alive'—standing grain, not processed flour.",
        christConnection: "Christ presented Himself to the Father after resurrection (John 20:17). He was the first to rise in a glorified body—the prototype of our resurrection."
      },
      {
        name: "Beginning the Omer Count",
        description: "From this day, Israel counted 50 days to Pentecost. Each day counted, building anticipation for the next feast.",
        symbolism: "Connects Firstfruits to Pentecost. The harvest begun is not complete until Pentecost. A journey of expectation.",
        christConnection: "The 50 days between Christ's resurrection and the Spirit's coming. Disciples waited and counted, anticipating the promise of the Father."
      }
    ],
    christFulfillment: {
      event: "The Resurrection of Jesus Christ",
      date: "16th of Nisan, AD 31 (Sunday morning)",
      description: "Jesus rose from the dead on the exact day the firstfruits sheaf was waved in the temple. He is 'the firstfruits of those who have fallen asleep' (1 Corinthians 15:20).",
      proofTexts: ["1 Corinthians 15:20-23", "Romans 8:29", "Colossians 1:18", "Matthew 28:1-6"],
      fulfillmentDetails: [
        "Rose on 'day after the Sabbath'—exactly when firstfruits was offered",
        "First to rise in glorified body (firstfruits of resurrection)",
        "His resurrection guarantees the full harvest of believers",
        "Appeared to disciples as proof of acceptance",
        "Presented Himself to the Father before appearing to Mary"
      ]
    },
    propheticSignificance: "Christ's resurrection is the guarantee of our resurrection. The firstfruits proves the harvest is real and coming. We who trust in Christ will be raised as He was raised.",
    churchApplication: [
      "Celebrate the resurrection—it's the foundation of our hope",
      "Give God the first of everything (time, money, energy)",
      "Know that Christ's resurrection guarantees yours",
      "Live in resurrection power now",
      "Count the days expectantly—the Spirit empowers our waiting"
    ],
    keyVerses: ["Leviticus 23:9-14", "1 Corinthians 15:20-23", "Romans 8:11", "Colossians 1:18"],
    relatedFeasts: ["unleavened-bread", "pentecost"]
  },
  {
    id: "pentecost",
    name: "Feast of Weeks / Pentecost",
    hebrewName: "Shavuot",
    hebrewMeaning: "Weeks (from the 7-week count)",
    season: "spring",
    month: 3, // Sivan
    day: "6th (50 days after Firstfruits)",
    duration: "1 day",
    agriculturalContext: "The wheat harvest is complete. Two loaves baked WITH leaven are presented—representing the full harvest gathered, not the firstfruits alone.",
    historicalCommemoration: "Traditionally associated with the giving of the Law at Sinai, 50 days after leaving Egypt. The birthday of Israel as a nation under God's covenant.",
    instructions: [
      "Count 50 days from Firstfruits (7 weeks + 1 day)",
      "Bring two loaves of bread baked WITH leaven as wave offering",
      "These are the firstfruits of wheat harvest to the LORD",
      "Holy convocation—no regular work",
      "Offer burnt offerings, grain offering, drink offerings, sin offering, peace offerings"
    ],
    prohibitions: [
      "No regular work on this day",
      "The wave loaves are for the priests—not burned on altar (contains leaven)"
    ],
    offerings: [
      "Two loaves of leavened bread (wave offering—firstfruits)",
      "7 male lambs, 1 bull, 2 rams (burnt offering)",
      "1 male goat (sin offering)",
      "2 male lambs (peace offering)",
      "Corresponding grain and drink offerings"
    ],
    rituals: [
      {
        name: "The Two Loaves",
        description: "Unlike all other offerings, these loaves are baked WITH leaven. Two loaves, not one, waved before the LORD.",
        symbolism: "The two loaves may represent Jew and Gentile, or Israel and the Church, or the two tablets of the Law. Leaven included = real people with sin nature, not yet glorified.",
        christConnection: "The Church is composed of Jews and Gentiles, still containing the 'leaven' of sin nature but accepted by God through Christ. We are offered to God, imperfect but accepted."
      },
      {
        name: "Reading of Ruth",
        description: "The book of Ruth is read at Shavuot, telling the story of a Gentile woman who becomes part of Israel and ancestor of David and Messiah.",
        symbolism: "Gentile inclusion. Harvest setting (Ruth gleaned barley and wheat). Redemption through a kinsman-redeemer. Love story of Boaz and Ruth.",
        christConnection: "Christ is our Kinsman-Redeemer. He brings Gentiles into Israel's blessings. The Church (Bride) is gathered during the harvest. Ruth's story foreshadows gospel grace."
      },
      {
        name: "All-Night Torah Study",
        description: "Jewish tradition includes staying up all night studying Torah, preparing to 'receive the Law' as Israel did at Sinai.",
        symbolism: "Dedication to God's Word. Preparation for divine encounter. The Law given at Sinai on Shavuot (traditional dating).",
        christConnection: "The Spirit writes the Law on hearts. All-night prayer meetings of early church (Acts 2:1—they were together). The Word and Spirit work together."
      }
    ],
    christFulfillment: {
      event: "The Coming of the Holy Spirit",
      date: "6th of Sivan, AD 31 (50 days after Christ's resurrection)",
      description: "The Holy Spirit came upon the 120 disciples gathered in Jerusalem, exactly on the Day of Pentecost. The Church was born, empowered to be witnesses to all nations.",
      proofTexts: ["Acts 2:1-4", "Joel 2:28-32", "John 14:16-17", "Acts 1:8"],
      fulfillmentDetails: [
        "Occurred on the exact day of Pentecost",
        "Law given at Sinai = 3,000 died; Spirit given at Pentecost = 3,000 saved",
        "Fire on the mountain (Sinai) / tongues of fire on heads (Jerusalem)",
        "One language confused at Babel / many languages understood at Pentecost",
        "Birth of the Church as the Spirit-empowered body of Christ",
        "The two loaves = Jew and Gentile united in one body"
      ]
    },
    propheticSignificance: "The Church Age begins. The Spirit empowers the harvest of souls. What Sinai could not do (write law on stone), Pentecost accomplishes (law on hearts). The harvest continues until the fall feasts.",
    churchApplication: [
      "The Holy Spirit empowers our witness",
      "Jew and Gentile are one in Christ",
      "The harvest is ongoing—we are still in 'Pentecost season'",
      "Spiritual gifts equip the church for ministry",
      "Study of God's Word and prayer prepare us for divine encounter"
    ],
    keyVerses: ["Leviticus 23:15-22", "Acts 2:1-41", "Joel 2:28-32", "Ezekiel 36:27"],
    relatedFeasts: ["firstfruits", "trumpets"]
  },

  // ===============================================
  // FALL FEASTS - SECOND COMING
  // ===============================================
  {
    id: "trumpets",
    name: "Feast of Trumpets",
    hebrewName: "Yom Teruah / Rosh Hashanah",
    hebrewMeaning: "Day of Blowing/Shouting; Head of the Year",
    season: "fall",
    month: 7, // Tishri
    day: "1st",
    duration: "1 day (some observe 2 days)",
    agriculturalContext: "The fall harvest is about to begin. Summer crops are gathered; preparation for the final ingathering. A turning point in the agricultural year.",
    historicalCommemoration: "Traditionally commemorates the creation of the world, specifically the creation of Adam. Also associated with the binding of Isaac and God's provision of a ram.",
    instructions: [
      "Holy convocation—no regular work",
      "A day of trumpet blasts (teruah)",
      "Offer burnt offerings as food offerings to the LORD",
      "Blow the shofar (ram's horn) with various blast patterns"
    ],
    prohibitions: [
      "No regular work on this day"
    ],
    offerings: [
      "Burnt offering: 1 bull, 1 ram, 7 male lambs",
      "Grain offering: fine flour mixed with oil",
      "Sin offering: 1 male goat",
      "In addition to monthly new moon offerings"
    ],
    rituals: [
      {
        name: "100 Shofar Blasts",
        description: "Traditionally 100 blasts of the shofar in various patterns: Tekiah (one long blast), Shevarim (three medium blasts), Teruah (nine staccato blasts), Tekiah Gedolah (great long blast).",
        symbolism: "The shofar awakens the spiritually sleeping, announces the King, calls to repentance, and heralds coming judgment. Each blast pattern has distinct meaning.",
        christConnection: "Christ returns at the sound of the trumpet (1 Thessalonians 4:16). The 'last trump' (Tekiah Gedolah?) raises the dead. Wake up, sleepers!"
      },
      {
        name: "The Two Days",
        description: "Feast of Trumpets is the only feast that falls on a new moon. Because the new moon could be sighted on either of two days, it became a two-day festival—'one long day.'",
        symbolism: "No one knows the exact day or hour. Watchfulness required. The 'hidden day' creates anticipation.",
        christConnection: "'No one knows the day or hour' (Matthew 24:36). The hidden timing keeps us watching. It could be 'today or tomorrow'—always ready."
      },
      {
        name: "Tashlich (Casting Away)",
        description: "On the afternoon of Rosh Hashanah, people go to flowing water and symbolically 'cast' their sins into the water, turning out their pockets.",
        symbolism: "God 'casts our sins into the depths of the sea' (Micah 7:19). Sins removed, not just forgiven. The water carries them away.",
        christConnection: "Christ removes our sins as far as east from west. He doesn't just cover them—He casts them away. Complete removal through His atoning work."
      },
      {
        name: "Ten Days of Awe Begin",
        description: "Feast of Trumpets begins the 'Yamim Noraim' (Days of Awe)—ten days of introspection and repentance leading to the Day of Atonement.",
        symbolism: "A warning period before judgment. Time to examine oneself, make amends, seek forgiveness. Serious spiritual inventory.",
        christConnection: "The time between Christ's return for His people and the final judgment. A period of preparation, separation, and ultimate accountability."
      }
    ],
    christFulfillment: {
      event: "The Return of Christ / Resurrection of the Dead (Future)",
      date: "Future—on a Feast of Trumpets?",
      description: "Many believe Christ will return on a future Feast of Trumpets, as the spring feasts were fulfilled on their exact days. The 'last trump' will raise the dead and gather the living saints.",
      proofTexts: ["1 Thessalonians 4:16-17", "1 Corinthians 15:52", "Matthew 24:31", "Revelation 11:15"],
      fulfillmentDetails: [
        "Christ returns at the sound of the trumpet",
        "The dead in Christ rise first",
        "Living believers are caught up to meet Him",
        "The 'last trump' signals the end of the mystery",
        "The seventh trumpet of Revelation may connect",
        "The shofar awakens the dead as it awakened the sleeping"
      ]
    },
    propheticSignificance: "The wake-up call to the world. Christ's return begins the final events. The 4-month gap between Pentecost and Trumpets represents the Church Age—we are now in that gap, awaiting the trumpet.",
    churchApplication: [
      "Live in constant readiness—you don't know the day",
      "The trumpet could sound at any moment",
      "Use the 'gap' time for evangelism and sanctification",
      "Examine yourself—the Days of Awe are for introspection",
      "Look up! Redemption draws near"
    ],
    keyVerses: ["Leviticus 23:23-25", "Numbers 29:1-6", "1 Thessalonians 4:16-17", "1 Corinthians 15:52", "Revelation 11:15"],
    relatedFeasts: ["pentecost", "day-of-atonement"]
  },
  {
    id: "day-of-atonement",
    name: "Day of Atonement",
    hebrewName: "Yom Kippur",
    hebrewMeaning: "Day of Covering/Propitiation",
    season: "fall",
    month: 7,
    day: "10th",
    duration: "1 day (25-hour fast)",
    agriculturalContext: "Between harvests—a pause in agricultural work. The land itself rests as the people fast and pray. Focus shifts from physical labor to spiritual labor.",
    historicalCommemoration: "The annual cleansing of the sanctuary and nation from accumulated sin. The high priest entered the Most Holy Place once a year to make atonement.",
    instructions: [
      "Holy convocation—no work of any kind",
      "Afflict your souls (fast) from evening to evening",
      "The high priest enters the Most Holy Place with blood",
      "Atonement made for the sanctuary, priests, and all people",
      "The scapegoat carries sins into the wilderness"
    ],
    prohibitions: [
      "No work whatsoever—complete Sabbath rest",
      "No eating or drinking (afflict your soul)",
      "Traditionally: no bathing, anointing, leather shoes, or marital relations",
      "Anyone not afflicting themselves is cut off"
    ],
    offerings: [
      "High priest's bull (sin offering for himself)",
      "Two goats from congregation—one for LORD (sacrifice), one for Azazel (scapegoat)",
      "Ram for burnt offering (high priest)",
      "Ram for burnt offering (congregation)",
      "Regular daily offerings continue"
    ],
    rituals: [
      {
        name: "The High Priest's Preparation",
        description: "The high priest bathed, put on simple white linen garments (not golden robes), and offered a bull for his own sins before approaching on behalf of the people.",
        symbolism: "Even the mediator needs cleansing. White linen = humility and purity. The glory garments are set aside. Approaching God requires personal holiness.",
        christConnection: "Christ needed no offering for Himself—He was sinless. He laid aside His glory (Philippians 2:6-8), clothed Himself in human 'linen,' and approached the Father for us."
      },
      {
        name: "Entering the Most Holy Place",
        description: "The high priest took incense and coals in, creating a cloud of smoke over the mercy seat before bringing blood. This protected him from God's direct presence.",
        symbolism: "God's holiness is unapproachable. The cloud represents Christ's mediation—we don't approach directly. Incense = prayer covering.",
        christConnection: "Christ entered the true Most Holy Place (heaven itself) with His own blood once for all (Hebrews 9:12). No incense cloud needed—He IS our covering."
      },
      {
        name: "Sprinkling Blood on the Mercy Seat",
        description: "The high priest sprinkled blood on the mercy seat and before it seven times, first with the bull's blood, then with the goat's blood.",
        symbolism: "Seven = complete atonement. Blood on the mercy seat covers the law beneath. God sees blood, not our sin. Justice and mercy meet.",
        christConnection: "Christ's blood is the complete (seven-fold) propitiation. It covers every dimension of sin. God looks at the mercy seat and sees the blood of His Son."
      },
      {
        name: "The Two Goats",
        description: "Two goats, essentially identical, had lots cast. One 'for the LORD' was sacrificed. The other 'for Azazel' had sins confessed over it and was led into the wilderness.",
        symbolism: "Two aspects of atonement: substitutionary death AND sin-bearing removal. The LORD's goat dies; the scapegoat removes sin completely. Both are needed.",
        christConnection: "Christ is both goats. He died as the LORD's goat (substitution). He carries our sins away as the scapegoat (removal). 'As far as east from west.'"
      },
      {
        name: "Cleansing the Sanctuary",
        description: "Blood was applied throughout the sanctuary—Most Holy Place, Holy Place, altar of incense, altar of burnt offering. The accumulated contamination of sin was cleansed.",
        symbolism: "Sin pollutes everything. Even the sacred spaces need cleansing. The year's accumulated defilement is removed. Starting fresh.",
        christConnection: "Christ cleanses the heavenly sanctuary (Hebrews 9:23). The record of sins is finally blotted out. This has eschatological significance in the pre-advent judgment."
      }
    ],
    christFulfillment: {
      event: "Final Judgment / Investigative Judgment (In Progress / Future)",
      date: "Began in 1844 (prophetically) and continues until close of probation; final execution at Second Coming",
      description: "Christ entered the Most Holy Place of the heavenly sanctuary to conduct the final phase of His atoning work—cleansing the sanctuary, judging cases, and preparing to return.",
      proofTexts: ["Hebrews 9:23-28", "Daniel 8:14", "Revelation 14:7", "Hebrews 9:12"],
      fulfillmentDetails: [
        "Christ entered the heavenly Most Holy Place with His own blood",
        "The investigative judgment examines the records",
        "Cases are decided before Christ returns",
        "Satan ultimately bears responsibility for sin he caused (scapegoat typology)",
        "The sanctuary is cleansed—sin's record expunged",
        "Christ returns to execute judgment already determined"
      ]
    },
    propheticSignificance: "The pre-advent judgment. Before Christ returns, every case is decided. The sanctuary is cleansed. Satan is identified as the origin of sin and will bear ultimate responsibility. God's character is vindicated.",
    churchApplication: [
      "Self-examination is essential—afflict your soul",
      "Confession must be thorough—covering all known sin",
      "Trust in Christ's blood alone for atonement",
      "The judgment is underway—live accordingly",
      "Soon Christ will emerge as He promised"
    ],
    keyVerses: ["Leviticus 16:1-34", "Leviticus 23:26-32", "Hebrews 9:7-14", "Hebrews 9:23-28", "Daniel 8:14"],
    relatedFeasts: ["trumpets", "tabernacles"]
  },
  {
    id: "tabernacles",
    name: "Feast of Tabernacles",
    hebrewName: "Sukkot",
    hebrewMeaning: "Booths/Shelters/Temporary Dwellings",
    season: "fall",
    month: 7,
    day: "15th-21st (plus 8th day)",
    duration: "7 days + 1 (Shemini Atzeret)",
    agriculturalContext: "The final harvest of the year—grapes, olives, and all remaining crops. The 'ingathering' at year's end. The barns are full; celebration is complete.",
    historicalCommemoration: "Israel's 40-year wilderness journey, living in temporary shelters under God's direct care. His presence (pillar of cloud/fire) was their covering.",
    instructions: [
      "Holy convocations on first and eighth days—no regular work",
      "Live in booths (sukkot) for seven days",
      "Take four species: citron, palm, myrtle, willow—wave before LORD",
      "Rejoice before the LORD for seven days",
      "The most joyous feast—mandatory celebration"
    ],
    prohibitions: [
      "No regular work on first and eighth days",
      "Native-born Israelites MUST live in booths",
      "The eighth day is separate—a solemn assembly"
    ],
    offerings: [
      "Decreasing bulls: 13 on day 1, 12 on day 2... to 7 on day 7 (70 total—for the nations)",
      "14 lambs each day",
      "Sin offering: 1 male goat each day",
      "Eighth day: 1 bull, 1 ram, 7 lambs (intimate gathering)",
      "Corresponding grain and drink offerings"
    ],
    rituals: [
      {
        name: "Building and Dwelling in Sukkot",
        description: "Temporary booths with roofs of natural materials—leaves, branches—through which you can see the stars. Families eat, sleep, and live in these for seven days.",
        symbolism: "Our earthly life is temporary. We are pilgrims. Yet under the open roof, we see heaven. God's covering is sufficient. Memory of wilderness dependence.",
        christConnection: "Christ 'tabernacled' among us (John 1:14). Our bodies are temporary tents (2 Corinthians 5:1). We await the eternal dwelling. He is our covering."
      },
      {
        name: "The Four Species (Lulav)",
        description: "Four plants held together and waved: etrog (citron), lulav (palm), hadassim (myrtle), aravot (willow). Waved in all directions—north, south, east, west, up, down.",
        symbolism: "Various interpretations: four types of Jews, four patriarchs, four body parts (heart, spine, eyes, mouth). Waving acknowledges God's sovereignty over all creation.",
        christConnection: "Christ unifies all types of people. He is Lord of all directions. The waving in all directions shows His universal reign. Different parts form one lulav—unity in diversity."
      },
      {
        name: "Water Libation (Nissuch HaMayim)",
        description: "Each morning, the high priest drew water from the Pool of Siloam in a golden pitcher, processed through the Water Gate, and poured it at the altar base with wine.",
        symbolism: "Prayer for rain for the next year's crops. Water = life, Spirit, blessing. Poured at the altar = offering to God. Joyous celebration accompanied this ceremony.",
        christConnection: "On the last day, Jesus stood and cried, 'If anyone thirsts, let him come to me and drink' (John 7:37-38). He is the source of living water—the Spirit poured out."
      },
      {
        name: "Illumination of the Temple",
        description: "Four massive golden candelabra in the Court of Women, each with four golden bowls—their light so bright it illuminated all Jerusalem. Dancing and celebration continued through the night.",
        symbolism: "God's light in the darkness. The pillar of fire in the wilderness. Joy in God's presence. Light dispels darkness.",
        christConnection: "Jesus said, 'I am the light of the world' (John 8:12)—declared during or right after this festival. He is the true light the candelabra pointed toward."
      },
      {
        name: "Shemini Atzeret (The Eighth Day)",
        description: "A separate, solemn assembly on the eighth day. The offerings dramatically decrease to 1 bull (instead of 70 over 7 days). An intimate gathering after the grand celebration.",
        symbolism: "Eight = new beginning. After the universal celebration (70 bulls for 70 nations), God draws Israel (and believers) close for intimate fellowship. Transition to eternity.",
        christConnection: "After judgment and millennial celebration, the eternal state begins. Intimate dwelling with God forever. The 'eighth day' is the new creation—eternal Sabbath rest."
      }
    ],
    christFulfillment: {
      event: "God Dwelling with His People Forever (Future)",
      date: "After the millennium—the eternal state",
      description: "The ultimate fulfillment when God makes His permanent dwelling with humanity. The tabernacle of God is with men. He will dwell with them forever. No more temporary shelters—the eternal city.",
      proofTexts: ["Revelation 21:3", "John 1:14", "Revelation 7:15-17", "Zechariah 14:16-19"],
      fulfillmentDetails: [
        "Christ 'tabernacled' among us at first coming (partial)",
        "The Spirit dwells in believers now (progressive)",
        "The nations will celebrate Tabernacles in the millennium (Zechariah 14)",
        "New Jerusalem descends—God's tabernacle with men forever",
        "No more temporary booths—eternal permanent dwelling",
        "Every tear wiped away—complete joy"
      ]
    },
    propheticSignificance: "The final feast—ultimate harvest, complete redemption, eternal dwelling. All nations gathered. Joy without end. God's presence unmediated. The plan complete.",
    churchApplication: [
      "Remember you are a pilgrim—this world is not your home",
      "Rejoice always—this is the most joyful feast",
      "Invite others into your 'booth'—hospitality and inclusion",
      "Look up through the roof—heaven is near",
      "Anticipate the eternal dwelling—your real home awaits"
    ],
    keyVerses: ["Leviticus 23:33-43", "John 7:37-38", "John 1:14", "Revelation 21:3", "Zechariah 14:16-19"],
    relatedFeasts: ["day-of-atonement", "passover"]
  }
];

// Helper Functions
export const getFeastsBySeason = (season: FeastSeason): BiblicalFeast[] => {
  return biblicalFeasts.filter(f => f.season === season);
};

export const getFeastByMonth = (month: number): BiblicalFeast[] => {
  return biblicalFeasts.filter(f => f.month === month);
};

export const getSpringFeasts = (): BiblicalFeast[] => {
  return biblicalFeasts.filter(f => f.season === "spring");
};

export const getFallFeasts = (): BiblicalFeast[] => {
  return biblicalFeasts.filter(f => f.season === "fall");
};

export const getFulfilledFeasts = (): BiblicalFeast[] => {
  return biblicalFeasts.filter(f => f.season === "spring"); // Spring feasts are fulfilled
};

export const getUnfulfilledFeasts = (): BiblicalFeast[] => {
  return biblicalFeasts.filter(f => f.season === "fall"); // Fall feasts await fulfillment
};

export const searchFeasts = (query: string): BiblicalFeast[] => {
  const lowerQuery = query.toLowerCase();
  return biblicalFeasts.filter(f =>
    f.name.toLowerCase().includes(lowerQuery) ||
    f.hebrewName.toLowerCase().includes(lowerQuery) ||
    f.propheticSignificance.toLowerCase().includes(lowerQuery) ||
    f.christFulfillment.description.toLowerCase().includes(lowerQuery) ||
    f.keyVerses.some(v => v.toLowerCase().includes(lowerQuery))
  );
};

export const getTotalFeastsCount = (): number => {
  return biblicalFeasts.length;
};

export const getFeastById = (id: string): BiblicalFeast | undefined => {
  return biblicalFeasts.find(f => f.id === id);
};

// Feast Timeline showing progression
export const feastTimeline = [
  { feast: "passover", event: "Crucifixion", fulfilled: true, year: "AD 31" },
  { feast: "unleavened-bread", event: "Burial", fulfilled: true, year: "AD 31" },
  { feast: "firstfruits", event: "Resurrection", fulfilled: true, year: "AD 31" },
  { feast: "pentecost", event: "Holy Spirit Given", fulfilled: true, year: "AD 31" },
  { feast: "trumpets", event: "Second Coming / Resurrection", fulfilled: false, year: "Future" },
  { feast: "day-of-atonement", event: "Final Judgment", fulfilled: false, year: "Future" },
  { feast: "tabernacles", event: "Eternal Dwelling", fulfilled: false, year: "Future" }
];
