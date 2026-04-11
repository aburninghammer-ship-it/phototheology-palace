// Phototheology Palace Card Images Registry
// Images served from /public/cards/ — no Vite processing

export interface CardImage {
  roomId: string;
  roomName: string;
  floor: number;
  imagePath: string;
  instruction: string;
}

// Helper to build card paths
const c = (path: string) => `/cards/${path}`;

// Branding assets (served from /public/branding/)
export const deckHeroDisplay = "/branding/deck-hero-display.png";
export const cardBackPuzzle = c("card-back-puzzle.jpg");

// Registry mapping room IDs to card images
export const cardImageRegistry: Record<string, string> = {
  // Floor 1 - Furnishing
  "sr": c("floor1/story-room.jpeg"),
  "tr": c("floor1/translation-room.jpeg"),
  "br": c("floor1/movie-room.jpeg"),
  "24": c("floor1/24fps-room.jpeg"),
  "ir": c("floor1/imagination-room.jpeg"),
  "gr": c("floor1/gems-room.jpeg"),
  // Floor 2 - Investigation
  "qr": c("floor2/questions-room.jpeg"),
  "qa": c("floor2/qa-room.jpeg"),
  "dc": c("floor2/def-com-room.jpeg"),
  "st": c("floor2/symbols-types-room.jpeg"),
  "or": c("floor2/observation-room.jpeg"),
  // Floor 3 - Freestyle
  "lr": c("floor3/listening-room.jpeg"),
  "hf": c("floor3/history-social-freestyle.jpeg"),
  "nf": c("floor3/nature-freestyle.jpeg"),
  "pf": c("floor3/life-experience-freestyle.jpeg"),
  "bf": c("floor3/bible-freestyle.jpeg"),
  // Floor 4 - Next Level
  "frt-gentleness": c("floor4/fruit-gentleness.jpeg"),
  "frt-peace": c("floor4/fruit-peace.jpeg"),
  "frt-meekness": c("floor4/fruit-meekness.jpeg"),
  "frt-temperance": c("floor4/fruit-temperance.jpeg"),
  "frt-longsuffering": c("floor4/fruit-longsuffering.jpeg"),
  "frt-joy": c("floor4/fruit-joy.jpeg"),
  "frt-faith": c("floor4/fruit-faith.jpeg"),
  "frt-love": c("floor4/fruit-love.jpeg"),
  "frt-goodness": c("floor4/fruit-goodness.jpeg"),
  "tz-heaven-present": c("floor4/timezone-heaven-present.jpeg"),
  "tz-heaven-past": c("floor4/timezone-heaven-past.jpeg"),
  "tz-heaven-future": c("floor4/timezone-heaven-future.jpeg"),
  "tz-earth-future": c("floor4/timezone-earth-future.jpeg"),
  "tz-earth-present": c("floor4/timezone-earth-present.jpeg"),
  "tz-earth-past": c("floor4/timezone-earth-past.jpeg"),
  "c6-parables": c("floor4/connect6-parables.jpeg"),
  "c6-gospels": c("floor4/connect6-gospels.jpeg"),
  "c6-prophecy": c("floor4/connect6-prophecy.jpeg"),
  "c6-poetry": c("floor4/connect6-poetry.jpeg"),
  "c6-history": c("floor4/connect6-history.jpeg"),
  "c6-epistles": c("floor4/connect6-epistles.jpeg"),
  "trm-heaven": c("floor4/theme-heaven.jpeg"),
  "trm-sanctuary": c("floor4/theme-sanctuary.jpeg"),
  "trm-time-prophecy": c("floor4/theme-time-prophecy.jpeg"),
  "trm-great-controversy": c("floor4/theme-great-controversy.jpeg"),
  "trm-life-of-christ": c("floor4/theme-life-of-christ.jpeg"),
  "prm": c("floor4/patterns-room.jpeg"),
  "p": c("floor4/parallel-room.jpeg"),
  "cr": c("floor4/concentration-room.jpeg"),
  "dr": c("floor4/dimensions-room.jpeg"),
  "dr-literal": c("floor4/dimension-literal.jpeg"),
  "dr-christ": c("floor4/dimension-christ.jpeg"),
  "dr-me": c("floor4/dimension-me.jpeg"),
  "dr-church": c("floor4/dimension-church.jpeg"),
  "dr-heaven": c("floor4/dimension-heaven.jpeg"),
  "trm-gospel": c("floor4/theme-gospel.jpeg"),
  // Floor 5 - Vision
  "bl": c("floor5/blue-room.jpeg"),
  "3a": c("floor5/three-angels-room.jpeg"),
  "3a-first": c("floor5/angel-first.jpeg"),
  "3a-second": c("floor5/angel-second.jpeg"),
  "3a-third": c("floor5/angel-third.jpeg"),
  "pr": c("floor5/prophecy-room.jpeg"),
  "bl-altar": c("floor5/sanctuary-altar.jpeg"),
  "bl-laver": c("floor5/sanctuary-laver.jpeg"),
  "bl-lampstand": c("floor5/sanctuary-lampstand.jpeg"),
  "bl-showbread": c("floor5/sanctuary-showbread.jpeg"),
  "bl-incense": c("floor5/sanctuary-incense.jpeg"),
  "bl-ark": c("floor5/sanctuary-ark.jpeg"),
  "feast-passover": c("floor5/feast-passover.jpeg"),
  "feast-unleavened": c("floor5/feast-unleavened.jpeg"),
  "feast-firstfruits": c("floor5/feast-firstfruits.jpeg"),
  "feast-pentecost": c("floor5/feast-pentecost.jpeg"),
  "feast-trumpets": c("floor5/feast-trumpets.jpeg"),
  "feast-atonement": c("floor5/feast-atonement.jpeg"),
  "feast-tabernacles": c("floor5/feast-tabernacles.jpeg"),
  // Floor 6 - Three Heavens
  "math-70week": c("floor6/math-daniel-70week.jpeg"),
  "math-70year": c("floor6/math-70year.jpeg"),
  "math-120year": c("floor6/math-noah-120year.jpeg"),
  "math-400year": c("floor6/math-exodus-400.jpeg"),
  "math-1260year": c("floor6/math-1260year.jpeg"),
  "math-2300year": c("floor6/math-2300year.jpeg"),
  "math-divine": c("floor6/math-divine.jpeg"),
  "@ad": c("floor6/cycle-1-adamic.jpeg"),
  "@no": c("floor6/cycle-2-noahic.jpeg"),
  "@se": c("floor6/cycle-3-semitic.jpeg"),
  "@ab": c("floor6/cycle-4-abrahamic.jpeg"),
  "@mo": c("floor6/cycle-5-mosaic.jpeg"),
  "@cy": c("floor6/cycle-6-cyrusic.jpeg"),
  "@cyc": c("floor6/cycle-cyc.jpeg"),
  "@sp": c("floor6/cycle-7-spirit.jpeg"),
  "@re": c("floor6/cycle-8-remnant.jpeg"),
  "1h": c("floor6/heaven-1h.jpeg"),
  "2h": c("floor6/heaven-2h.jpeg"),
  "3h": c("floor6/heaven-3h.jpeg"),
  "jr": c("floor6/juice-room.jpeg"),
  // Floor 7 - Spiritual/Emotional
  "mr": c("floor7/meditation-room.jpeg"),
  "frm": c("floor7/fire-room.jpeg"),
  "srm": c("floor7/speed-room.jpeg"),
};

// Floor-specific card backs
export const floorCardBacks: Record<number, string> = {
  1: c("floor1/card-back.jpeg"),
  2: c("floor2/card-back.jpeg"),
  7: c("floor7/card-back.jpeg"),
};

const cardBack = c("card-back.jpeg");

// Card metadata for the deck feature
export const cardData: CardImage[] = [
  // Floor 1 - Furnishing (Green)
  { roomId: "sr", roomName: "Story Room", floor: 1, imagePath: cardImageRegistry["sr"], instruction: "This card encourages the memorization of Bible stories. These will be the building blocks of your \"Freestyle.\"" },
  { roomId: "tr", roomName: "Translation (Encoding) Room", floor: 1, imagePath: cardImageRegistry["tr"], instruction: "This card teaches us to translate the text from word to image. Translating Philippians 2:5, \"Let this mind be in you, which was also in Christ Jesus,\" one might see a hospital room where a \"brain transplant\" is occurring." },
  { roomId: "br", roomName: "Movie Room (The Bible Rendered)", floor: 1, imagePath: cardImageRegistry["br"], instruction: "This room juices down each set of 24 chapters into one image for a total of 50 images that move you from Genesis to Revelation." },
  { roomId: "24", roomName: "24FPS Room", floor: 1, imagePath: cardImageRegistry["24"], instruction: "This room focuses on memorizing the themes of each chapter, 24 chapters at a time. Create your own image for the theme of each chapter." },
  { roomId: "ir", roomName: "Imagination Room", floor: 1, imagePath: cardImageRegistry["ir"], instruction: "Step inside the story. Immerse yourself as if you were there." },
  { roomId: "gr", roomName: "Gems Room", floor: 1, imagePath: cardImageRegistry["gr"], instruction: "Collect striking insights that shine with clarity." },
  // Floor 2 - Investigation (Yellow)
  { roomId: "qr", roomName: "Questions Room", floor: 2, imagePath: cardImageRegistry["qr"], instruction: "Use this card to ask the text as many questions as you can. This card is designed to help you investigate a text more closely. Aim for 50 to 100 questions, even from the shortest text of the Bible, \"Jesus wept.\"" },
  { roomId: "qa", roomName: "Question and Answer Room", floor: 2, imagePath: cardImageRegistry["qa"], instruction: "Ask the text a series of questions and each by finding the answer in another text." },
  { roomId: "dc", roomName: "Def-Com Room / E-Sword", floor: 2, imagePath: cardImageRegistry["dc"], instruction: "Using Bible software or Bible study materials (concordance, etc.) look up key words, meanings, and commentary to learn more about the text." },
  { roomId: "st", roomName: "Symbols/Types Room", floor: 2, imagePath: cardImageRegistry["st"], instruction: "What symbols or types are in the story or can be connected to the story?" },
  { roomId: "or", roomName: "Observation Room", floor: 2, imagePath: cardImageRegistry["or"], instruction: "Log details without interpretation. Notice every fingerprint." },
  // Floor 3 - Freestyle (Orange)
  { roomId: "nf", roomName: "Nature Freestyle Room", floor: 3, imagePath: cardImageRegistry["nf"], instruction: "Apply an object lesson from nature in connection with the text." },
  { roomId: "pf", roomName: "Life Experience Freestyle Room", floor: 3, imagePath: cardImageRegistry["pf"], instruction: "Use a life experience to illustrate the lesson from the text." },
  { roomId: "hf", roomName: "History/Social Freestyle Room", floor: 3, imagePath: cardImageRegistry["hf"], instruction: "Use an example from secular history to illustrate a lesson from the text." },
  { roomId: "lr", roomName: "Listening Room", floor: 3, imagePath: cardImageRegistry["lr"], instruction: "Pull a lesson from a sermon you've heard previously to help expound upon the text." },
  { roomId: "bf", roomName: "Bible Freestyle Room (Verse Genetics)", floor: 3, imagePath: cardImageRegistry["bf"], instruction: "Connect a \"random\" text with the text and find the connection between them." },
  // Floor 4 - Next Level (Red) - Fruit Room variants
  { roomId: "frt-love", roomName: "Fruit Room - Love", floor: 4, imagePath: cardImageRegistry["frt-love"], instruction: "Study the text in the context of the specific fruit of the spirit: LOVE." },
  { roomId: "frt-joy", roomName: "Fruit Room - Joy", floor: 4, imagePath: cardImageRegistry["frt-joy"], instruction: "Study the text in the context of the specific fruit of the spirit: JOY." },
  { roomId: "frt-peace", roomName: "Fruit Room - Peace", floor: 4, imagePath: cardImageRegistry["frt-peace"], instruction: "Study the text in the context of the specific fruit of the spirit: PEACE." },
  { roomId: "frt-longsuffering", roomName: "Fruit Room - Longsuffering", floor: 4, imagePath: cardImageRegistry["frt-longsuffering"], instruction: "Study the text in the context of the specific fruit of the spirit: LONGSUFFERING." },
  { roomId: "frt-gentleness", roomName: "Fruit Room - Gentleness", floor: 4, imagePath: cardImageRegistry["frt-gentleness"], instruction: "Study the text in the context of the specific fruit of the spirit: GENTLENESS." },
  { roomId: "frt-goodness", roomName: "Fruit Room - Goodness", floor: 4, imagePath: cardImageRegistry["frt-goodness"], instruction: "Study the text in the context of the specific fruit of the spirit: GOODNESS." },
  { roomId: "frt-faith", roomName: "Fruit Room - Faith", floor: 4, imagePath: cardImageRegistry["frt-faith"], instruction: "Study the text in the context of the specific fruit of the spirit: FAITH." },
  { roomId: "frt-meekness", roomName: "Fruit Room - Meekness", floor: 4, imagePath: cardImageRegistry["frt-meekness"], instruction: "Study the text in the context of the specific fruit of the spirit: MEEKNESS." },
  { roomId: "frt-temperance", roomName: "Fruit Room - Temperance", floor: 4, imagePath: cardImageRegistry["frt-temperance"], instruction: "Study the text in the context of the specific fruit of the spirit: TEMPERANCE." },
  // Floor 4 - Time Zone Room variants
  { roomId: "tz-heaven-present", roomName: "Time Zone Room - Heaven Present", floor: 4, imagePath: cardImageRegistry["tz-heaven-present"], instruction: "Study the text in the context of events in Heaven's present." },
  { roomId: "tz-heaven-past", roomName: "Time Zone Room - Heaven Past", floor: 4, imagePath: cardImageRegistry["tz-heaven-past"], instruction: "Study the text in the context of events in Heaven's past." },
  { roomId: "tz-heaven-future", roomName: "Time Zone Room - Heaven Future", floor: 4, imagePath: cardImageRegistry["tz-heaven-future"], instruction: "Study the text in the context of events in Heaven's future." },
  { roomId: "tz-earth-past", roomName: "Time Zone Room - Earth Past", floor: 4, imagePath: cardImageRegistry["tz-earth-past"], instruction: "Study the text in the context of events in Earth's past." },
  { roomId: "tz-earth-present", roomName: "Time Zone Room - Earth Present", floor: 4, imagePath: cardImageRegistry["tz-earth-present"], instruction: "Study the text in the context of events in Earth's present." },
  { roomId: "tz-earth-future", roomName: "Time Zone Room - Earth Future", floor: 4, imagePath: cardImageRegistry["tz-earth-future"], instruction: "Study the text in the context of events in Earth's future." },
  // Floor 4 - Connect 6 Room variants
  { roomId: "c6-parables", roomName: "Connect 6 Room - Parables", floor: 4, imagePath: cardImageRegistry["c6-parables"], instruction: "Connect the text with a parable." },
  { roomId: "c6-gospels", roomName: "Connect 6 Room - Gospels", floor: 4, imagePath: cardImageRegistry["c6-gospels"], instruction: "Connect the text with a gospel account." },
  // Floor 4 - Theme Room variants
  { roomId: "trm-heaven", roomName: "Theme Room - Heaven Ceiling", floor: 4, imagePath: cardImageRegistry["trm-heaven"], instruction: "Study the text against the backdrop of events in Heaven." },
  { roomId: "trm-sanctuary", roomName: "Theme Room - Sanctuary Wall", floor: 4, imagePath: cardImageRegistry["trm-sanctuary"], instruction: "Study the text against the backdrop of the Sanctuary." },
  { roomId: "trm-time-prophecy", roomName: "Theme Room - Time Prophecy Wall", floor: 4, imagePath: cardImageRegistry["trm-time-prophecy"], instruction: "Study the text against the backdrop of time prophecies in the Bible." },
  { roomId: "trm-great-controversy", roomName: "Theme Room - Great Controversy Wall", floor: 4, imagePath: cardImageRegistry["trm-great-controversy"], instruction: "Study the text against the backdrop of the Great Controversy." },
  { roomId: "trm-life-of-christ", roomName: "Theme Room - Life of Christ Wall", floor: 4, imagePath: cardImageRegistry["trm-life-of-christ"], instruction: "Study the text against the backdrop of the life of Christ." },
  // Floor 4 - Concentration, Patterns, Parallel Rooms
  { roomId: "cr", roomName: "Concentration Room", floor: 4, imagePath: cardImageRegistry["cr"], instruction: "Find Jesus in the text." },
  { roomId: "prm", roomName: "Patterns Room", floor: 4, imagePath: cardImageRegistry["prm"], instruction: "Find parallels to the story or text under consideration. Find patterns within the story under consideration." },
  { roomId: "p", roomName: "Parallel Room", floor: 4, imagePath: cardImageRegistry["p"], instruction: "Find one or more parallels to the text or story." },
  { roomId: "dr", roomName: "Dimensions Room", floor: 4, imagePath: cardImageRegistry["dr"], instruction: "Study the text across 5 dimensions: Literal, Christ, Me, Church, Heaven." },
  { roomId: "c6-prophecy", roomName: "Connect 6 - Prophecy", floor: 4, imagePath: cardImageRegistry["c6-prophecy"], instruction: "Connect the text with prophetic literature." },
  { roomId: "c6-poetry", roomName: "Connect 6 - Poetry", floor: 4, imagePath: cardImageRegistry["c6-poetry"], instruction: "Connect the text with poetic literature." },
  { roomId: "c6-history", roomName: "Connect 6 - History", floor: 4, imagePath: cardImageRegistry["c6-history"], instruction: "Connect the text with historical narrative." },
  { roomId: "c6-epistles", roomName: "Connect 6 - Epistles", floor: 4, imagePath: cardImageRegistry["c6-epistles"], instruction: "Connect the text with apostolic letters." },
  { roomId: "dr-literal", roomName: "Dimension - Literal", floor: 4, imagePath: cardImageRegistry["dr-literal"], instruction: "What does the text literally mean? The plain sense of the words." },
  { roomId: "dr-christ", roomName: "Dimension - Christ", floor: 4, imagePath: cardImageRegistry["dr-christ"], instruction: "How does the text point to Jesus Christ?" },
  { roomId: "dr-me", roomName: "Dimension - Me", floor: 4, imagePath: cardImageRegistry["dr-me"], instruction: "How does the text apply to me personally?" },
  { roomId: "dr-church", roomName: "Dimension - Church", floor: 4, imagePath: cardImageRegistry["dr-church"], instruction: "How does the text apply to the church body?" },
  { roomId: "dr-heaven", roomName: "Dimension - Heaven", floor: 4, imagePath: cardImageRegistry["dr-heaven"], instruction: "How does the text apply to heaven and eternal realities?" },
  { roomId: "trm-gospel", roomName: "Theme Room - Gospel Floor", floor: 4, imagePath: cardImageRegistry["trm-gospel"], instruction: "Study the text against the backdrop of the gospel: justification, sanctification, glorification." },
  // Floor 5 - Vision (Blue)
  { roomId: "bl", roomName: "Blue Room", floor: 5, imagePath: cardImageRegistry["bl"], instruction: "Study the text in greater detail of the Sanctuary." },
  { roomId: "3a", roomName: "Three Angels Room", floor: 5, imagePath: cardImageRegistry["3a"], instruction: "Study the text in the context of the Revelation 14:6-12 specifically." },
  { roomId: "pr", roomName: "Prophecy Room", floor: 5, imagePath: cardImageRegistry["pr"], instruction: "See God's master plan through prophetic timelines." },
  { roomId: "bl-altar", roomName: "Altar of Sacrifice", floor: 5, imagePath: cardImageRegistry["bl-altar"], instruction: "Study in context of the Altar - the cross." },
  { roomId: "bl-laver", roomName: "Laver", floor: 5, imagePath: cardImageRegistry["bl-laver"], instruction: "Study in context of the Laver - baptism and cleansing." },
  { roomId: "bl-lampstand", roomName: "Lampstand", floor: 5, imagePath: cardImageRegistry["bl-lampstand"], instruction: "Study in context of the Lampstand - light of the Spirit." },
  { roomId: "bl-showbread", roomName: "Table of Showbread", floor: 5, imagePath: cardImageRegistry["bl-showbread"], instruction: "Study in context of the Showbread - Word of God." },
  { roomId: "bl-incense", roomName: "Altar of Incense", floor: 5, imagePath: cardImageRegistry["bl-incense"], instruction: "Study in context of the Incense Altar - intercession." },
  { roomId: "bl-ark", roomName: "Ark of the Covenant", floor: 5, imagePath: cardImageRegistry["bl-ark"], instruction: "Study in context of the Ark - law, mercy, God's throne." },
  { roomId: "feast-passover", roomName: "Feast of Passover", floor: 5, imagePath: cardImageRegistry["feast-passover"], instruction: "Study in context of Passover - Christ our Lamb." },
  { roomId: "feast-unleavened", roomName: "Feast of Unleavened Bread", floor: 5, imagePath: cardImageRegistry["feast-unleavened"], instruction: "Study in context of Unleavened Bread - purity." },
  { roomId: "feast-firstfruits", roomName: "Feast of Firstfruits", floor: 5, imagePath: cardImageRegistry["feast-firstfruits"], instruction: "Study in context of Firstfruits - resurrection." },
  { roomId: "feast-pentecost", roomName: "Feast of Pentecost", floor: 5, imagePath: cardImageRegistry["feast-pentecost"], instruction: "Study in context of Pentecost - Holy Spirit outpouring." },
  { roomId: "feast-trumpets", roomName: "Feast of Trumpets", floor: 5, imagePath: cardImageRegistry["feast-trumpets"], instruction: "Study in context of Trumpets - awakening call." },
  { roomId: "feast-atonement", roomName: "Day of Atonement", floor: 5, imagePath: cardImageRegistry["feast-atonement"], instruction: "Study in context of Yom Kippur - judgment." },
  { roomId: "feast-tabernacles", roomName: "Feast of Tabernacles", floor: 5, imagePath: cardImageRegistry["feast-tabernacles"], instruction: "Study in context of Tabernacles - God dwelling with man." },
  { roomId: "3a-first", roomName: "First Angel's Message", floor: 5, imagePath: cardImageRegistry["3a-first"], instruction: "Fear God, give glory, the hour of judgment - Revelation 14:6-7." },
  { roomId: "3a-second", roomName: "Second Angel's Message", floor: 5, imagePath: cardImageRegistry["3a-second"], instruction: "Babylon is fallen - Revelation 14:8." },
  { roomId: "3a-third", roomName: "Third Angel's Message", floor: 5, imagePath: cardImageRegistry["3a-third"], instruction: "Warning against beast, image, mark; endurance of saints - Revelation 14:9-12." },
  // Floor 6 - Three Heavens (Purple) - Mathematics Room variants
  { roomId: "math-70week", roomName: "Mathematics Room (Daniel's 70 Weeks)", floor: 6, imagePath: cardImageRegistry["math-70week"], instruction: "Connect with the mathematics of Daniel's 70-week prophecy." },
  { roomId: "math-70year", roomName: "Mathematics Room (70 Years)", floor: 6, imagePath: cardImageRegistry["math-70year"], instruction: "Connect with the mathematics of the 70-year prophecy." },
  { roomId: "math-120year", roomName: "Mathematics Room (Noah's 120 Years)", floor: 6, imagePath: cardImageRegistry["math-120year"], instruction: "Connect with the mathematics of Noah's 120-year prophecy." },
  { roomId: "math-400year", roomName: "Mathematics Room (Exodus 400 Years)", floor: 6, imagePath: cardImageRegistry["math-400year"], instruction: "Connect with the mathematics of the Exodus 400-year prophecy." },
  { roomId: "math-1260year", roomName: "Mathematics Room (1260 Years)", floor: 6, imagePath: cardImageRegistry["math-1260year"], instruction: "Connect with the mathematics of the 1260-year prophecy." },
  { roomId: "math-2300year", roomName: "Mathematics Room (2300 Years)", floor: 6, imagePath: cardImageRegistry["math-2300year"], instruction: "Connect with the mathematics of the 2300-year prophecy." },
  { roomId: "math-divine", roomName: "Mathematics Room (Divine Math)", floor: 6, imagePath: cardImageRegistry["math-divine"], instruction: "In which cycle of divine math is the text located? Is there any significance?" },
  // Floor 6 - 8 Cycles Room
  { roomId: "@ad", roomName: "8 Cycles Room - #1 Adamic", floor: 6, imagePath: cardImageRegistry["@ad"], instruction: "Study the text within the context of one of the 8 cycles of scripture. #1 of 8: Compare, contrast, or study within the Adamic Cycle. (Eden to Eden Lost)" },
  { roomId: "@no", roomName: "8 Cycles Room - #2 Noahic", floor: 6, imagePath: cardImageRegistry["@no"], instruction: "Study the text within the context of one of the 8 cycles of scripture. #2 of 8: Compare, contrast, or study within the Noahic Cycle. (Post Eden to the Flood)" },
  { roomId: "@se", roomName: "8 Cycles Room - #3 Semitic", floor: 6, imagePath: cardImageRegistry["@se"], instruction: "Study the text within the context of one of the 8 cycles of scripture. #3 of 8: Compare, contrast, or study within the Semitic Cycle. (Flood to Tower of Babel)" },
  { roomId: "@ab", roomName: "8 Cycles Room - #4 Abrahamic", floor: 6, imagePath: cardImageRegistry["@ab"], instruction: "Study the text within the context of one of the 8 cycles of scripture. #4 of 8: Compare, contrast, or study within the Abrahamic Cycle. (Ur to Egyptian Bondage)" },
  { roomId: "@mo", roomName: "8 Cycles Room - #5 Mosaic", floor: 6, imagePath: cardImageRegistry["@mo"], instruction: "Study within the Mosaic Cycle. (Exodus to Babylonian Exile)" },
  { roomId: "@cy", roomName: "8 Cycles Room - #6 Cyrusic", floor: 6, imagePath: cardImageRegistry["@cy"], instruction: "Study within the Cyrusic Cycle. (Exile to Return & Rebuild)" },
  { roomId: "@cyc", roomName: "8 Cycles Room - Cyrus-Christ", floor: 6, imagePath: cardImageRegistry["@cyc"], instruction: "Study within the Cyrus-Christ Cycle. Type meets antitype - the true Anointed fulfillment." },
  { roomId: "@sp", roomName: "8 Cycles Room - #7 Spirit", floor: 6, imagePath: cardImageRegistry["@sp"], instruction: "Study within the Spirit Cycle. (Pentecost to Church Age)" },
  { roomId: "@re", roomName: "8 Cycles Room - #8 Remnant", floor: 6, imagePath: cardImageRegistry["@re"], instruction: "Study within the Remnant Cycle. (End-Time to Second Coming)" },
  { roomId: "1h", roomName: "First Heaven (1H)", floor: 6, imagePath: cardImageRegistry["1h"], instruction: "Study in context of DoL¹/NE¹ - Babylonian destruction to Cyrusic restoration." },
  { roomId: "2h", roomName: "Second Heaven (2H)", floor: 6, imagePath: cardImageRegistry["2h"], instruction: "Study in context of DoL²/NE² - 70 AD to New Covenant order." },
  { roomId: "3h", roomName: "Third Heaven (3H)", floor: 6, imagePath: cardImageRegistry["3h"], instruction: "Study in context of DoL³/NE³ - Final judgment to New Creation." },
  { roomId: "jr", roomName: "Juice Room", floor: 6, imagePath: cardImageRegistry["jr"], instruction: "Squeeze every insight from the text using all PT principles." },
  // Floor 7
  { roomId: "mr", roomName: "Meditation Room", floor: 7, imagePath: cardImageRegistry["mr"], instruction: "Meditate slowly on the study." },
  { roomId: "frm", roomName: "Fire Room", floor: 7, imagePath: cardImageRegistry["frm"], instruction: "Enter the emotional weight of the text." },
  { roomId: "srm", roomName: "Speed Room", floor: 7, imagePath: cardImageRegistry["srm"], instruction: "Practice rapid application of PT principles." },
];

// Get card back image for a specific floor, or default
export const getCardBack = (floor?: number) => {
  if (floor && floorCardBacks[floor]) {
    return floorCardBacks[floor];
  }
  return cardBack;
};

// Get card image for a room, returns undefined if no card exists
export const getCardImage = (roomId: string): string | undefined => {
  return cardImageRegistry[roomId.toLowerCase()];
};

// Get all cards for a specific floor
export const getCardsByFloor = (floor: number): CardImage[] => {
  return cardData.filter(card => card.floor === floor);
};

// Get all available cards
export const getAllCards = (): CardImage[] => {
  return cardData;
};

// Floor color themes
export const floorColors: Record<number, { bg: string; border: string; name: string }> = {
  1: { bg: "bg-emerald-900/30", border: "border-emerald-500", name: "green" },
  2: { bg: "bg-yellow-900/30", border: "border-yellow-500", name: "yellow" },
  3: { bg: "bg-orange-900/30", border: "border-orange-500", name: "orange" },
  4: { bg: "bg-red-900/30", border: "border-red-500", name: "red" },
  5: { bg: "bg-blue-900/30", border: "border-blue-500", name: "blue" },
  6: { bg: "bg-purple-900/30", border: "border-purple-500", name: "purple" },
  7: { bg: "bg-cyan-900/30", border: "border-cyan-500", name: "turquoise" },
  8: { bg: "bg-amber-900/30", border: "border-amber-500", name: "gold" },
};
