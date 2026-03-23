// Bible Rendered: 51 Canonical Render Sets
// Each set is a 24-chapter block (with noted exceptions)
// Following the Phototheology Bible Rendered methodology

export interface BibleRenderedSet {
  number: number;
  symbol: string;
  name: string;
  range: string;
  chapters: number; // Number of chapters in this set
  renders: number;  // Number of render prompts (usually same as chapters)
  description: string;
  category: string;
  symbols: string[]; // Visual symbol pack for this set
  testament: 'old' | 'new';
}

export const bibleRenderedSets: BibleRenderedSet[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SETS 1-10: PENTATEUCH & CONQUEST
  // ═══════════════════════════════════════════════════════════════════════════
  {
    number: 1,
    symbol: "÷",
    name: "Division",
    range: "Genesis 1–24",
    chapters: 24,
    renders: 24,
    description: "Division / Separation / Covenant Boundary — Creation, fall, flood, Babel, call of Abram. God divides light from darkness, waters, land, and separates a people.",
    category: "Pentateuch",
    symbols: ["light/dark", "waters/land", "garden gate", "altar", "scattered nations", "covenant cut"],
    testament: 'old'
  },
  {
    number: 2,
    symbol: "×",
    name: "Multiplication",
    range: "Genesis 25–50",
    chapters: 26,
    renders: 25, // Gen 48-49 paired as one render
    description: "Multiplication / Seedline Expansion / Tribal Formation — Isaac, Jacob, 12 tribes, Joseph in Egypt. The family expands despite famine and betrayal.",
    category: "Pentateuch",
    symbols: ["womb/sons", "ladder/dream", "wells", "birthright", "coat", "famine granaries", "scepter (Judah)", "blessing hands"],
    testament: 'old'
  },
  {
    number: 3,
    symbol: "🩸",
    name: "Deliverance",
    range: "Exodus 1–24",
    chapters: 24,
    renders: 24,
    description: "Deliverance / Redemption by Blood and Water — Slavery, plagues, Passover, Red Sea, Sinai covenant. Freedom through divine intervention.",
    category: "Pentateuch",
    symbols: ["chains → freedom", "lamb/blood on doors", "plagues", "sea split", "pillar cloud/fire", "mountain covenant"],
    testament: 'old'
  },
  {
    number: 4,
    symbol: "⛺",
    name: "Sanctuary",
    range: "Exodus 25 – Leviticus 8",
    chapters: 24,
    renders: 24,
    description: "Sanctuary / Access Architecture — God moves in. Blueprint of worship, priesthood, and holy presence.",
    category: "Pentateuch",
    symbols: ["altar", "laver", "lampstand", "bread", "incense", "veil", "ark", "priest garments", "anointing oil"],
    testament: 'old'
  },
  {
    number: 5,
    symbol: "⚖",
    name: "Holiness Governance",
    range: "Leviticus 9 – Numbers 5",
    chapters: 24,
    renders: 24,
    description: "Holiness Governance / Clean–Unclean Order — How to live near holiness without dying. Atonement, boundaries, and purity laws.",
    category: "Pentateuch",
    symbols: ["fire from the LORD", "boundaries", "blood rituals", "cleansing water", "camp purity"],
    testament: 'old'
  },
  {
    number: 6,
    symbol: "👣",
    name: "Journey",
    range: "Numbers 6–29",
    chapters: 24,
    renders: 24,
    description: "Journey / Testing / Murmuring Cycles — Wilderness walk, rebellion, mercy. Forty years of wandering and lessons.",
    category: "Pentateuch",
    symbols: ["wilderness road", "tents", "trumpet calls", "serpent", "rebellion", "judgment fire", "bronze serpent", "water from rock"],
    testament: 'old'
  },
  {
    number: 7,
    symbol: "🚪",
    name: "Threshold",
    range: "Numbers 30 – Deuteronomy 17",
    chapters: 24,
    renders: 24,
    description: "Threshold / Inheritance Readiness — End of wilderness, Moses prepares them for the land. Covenant renewal and blessing/curse.",
    category: "Pentateuch",
    symbols: ["Jordan edge", "covenant renewal", "blessing/curse fork", "stones of remembrance", "leadership transfer"],
    testament: 'old'
  },
  {
    number: 8,
    symbol: "🔄",
    name: "Transition",
    range: "Deuteronomy 18 – Joshua 7",
    chapters: 24,
    renders: 24,
    description: "Transition / Prophetic Leadership Shift — Handoff from Moses to Joshua, crossing Jordan, Jericho falls, Achan's sin.",
    category: "Conquest",
    symbols: ["prophet promise", "Joshua commissioning", "Jordan crossing", "memorial stones", "Jericho fall", "Achan's hidden wedge"],
    testament: 'old'
  },
  {
    number: 9,
    symbol: "⚔",
    name: "Conquest",
    range: "Joshua 8 – Judges 7",
    chapters: 24,
    renders: 24,
    description: "Conquest / Settlement through Conflict — Land taken through battle and divine intervention.",
    category: "Conquest",
    symbols: ["altar on Mount Ebal", "sun still", "divided land", "trumpet victory", "torn idols"],
    testament: 'old'
  },
  {
    number: 10,
    symbol: "🔁",
    name: "Chaos Cycles",
    range: "Judges 8 – 1 Samuel 6",
    chapters: 24,
    renders: 24,
    description: "Chaos / Cycles of Apostasy — 'Everyone did what was right in his own eyes.' Oppression, deliverers, decline.",
    category: "Judges Period",
    symbols: ["broken altars", "oppression", "deliverers", "civil war shadow", "ark captured/returned"],
    testament: 'old'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SETS 11-20: MONARCHY RISE & FALL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    number: 11,
    symbol: "👑",
    name: "Rise of Monarchy",
    range: "1 Samuel 7–30",
    chapters: 24,
    renders: 24,
    description: "Rise of Monarchy / Two Thrones Forming — Israel demands a king. Saul anointed, rejected. David anointed, hunted.",
    category: "United Monarchy",
    symbols: ["oil horn", "rejected king", "harp/giant", "spear and jealousy", "wilderness caves", "prophetic anointing"],
    testament: 'old'
  },
  {
    number: 12,
    symbol: "⚔👑",
    name: "Succession War",
    range: "1 Samuel 31 – 2 Samuel 23",
    chapters: 24,
    renders: 24,
    description: "Succession War / Kingdom Consolidation — Saul falls, David rises, civil war, throne established in Jerusalem.",
    category: "United Monarchy",
    symbols: ["fallen Saul", "divided loyalties", "bloodguilt", "covenant with elders", "mighty men", "throne established"],
    testament: 'old'
  },
  {
    number: 13,
    symbol: "🏛",
    name: "Apex and Cracks",
    range: "2 Samuel 24 – 2 Kings 1",
    chapters: 24,
    renders: 24,
    description: "Apex and Seeds of Ruin — Temple Glory + Cracks. Census plague, temple site, Solomon's glory, divided hearts begin.",
    category: "United Monarchy",
    symbols: ["census plague", "altar site", "temple build", "divided hearts", "prophetic confrontation", "fire from heaven"],
    testament: 'old'
  },
  {
    number: 14,
    symbol: "📉",
    name: "Division & Collapse",
    range: "2 Kings 2–25",
    chapters: 24,
    renders: 24,
    description: "Division / Collapse / Exile — Kingdom splits, prophets warn, both kingdoms fall. Temple destroyed, chains to Babylon.",
    category: "Divided Kingdom",
    symbols: ["mantle", "idol shrines", "siege ramps", "broken walls", "burned temple", "chains to Babylon"],
    testament: 'old'
  },
  {
    number: 15,
    symbol: "📜",
    name: "Davidic Blueprint",
    range: "1 Chronicles 1–24",
    chapters: 24,
    renders: 24,
    description: "Davidic Blueprint / Worship-Order Foundations — Genealogies as 'root system,' ark, priest divisions, Levite order.",
    category: "Chronicles",
    symbols: ["genealogies as root system", "ark", "priest divisions", "Levite order", "throne covenant"],
    testament: 'old'
  },
  {
    number: 16,
    symbol: "🎭",
    name: "Solomon's Height",
    range: "1 Chronicles 25 – 2 Chronicles 19",
    chapters: 24,
    renders: 24,
    description: "Solomon's Height / Wisdom + Compromise — Choir/worship, temple dedication, glory cloud, but foreign alliances corrupt.",
    category: "Chronicles",
    symbols: ["choir/worship", "temple dedication", "fire/glory cloud", "foreign alliances", "high places", "divided heart"],
    testament: 'old'
  },
  {
    number: 17,
    symbol: "🔓",
    name: "Captivity & Return",
    range: "2 Chronicles 20 – Ezra 7",
    chapters: 24,
    renders: 24,
    description: "Captivity and Redemption / Return Decree — Battle praise, reform waves, fall, then Cyrus decree and return caravan.",
    category: "Exile & Return",
    symbols: ["battle praise", "reform waves", "fall of Jerusalem", "scrolls", "decree", "return caravan", "altar rebuild"],
    testament: 'old'
  },
  {
    number: 18,
    symbol: "🧱",
    name: "Rebuilding & Crisis",
    range: "Ezra 8 – Esther 8",
    chapters: 24,
    renders: 24,
    description: "Rebuilding and Crisis / Identity Under Pressure — Walls rebuilt amid opposition, Esther's hidden providence.",
    category: "Exile & Return",
    symbols: ["walls", "opposition letters", "fasting", "sealed decree", "hidden providence"],
    testament: 'old'
  },
  {
    number: 19,
    symbol: "⚡",
    name: "Theodicy",
    range: "Esther 9 – Job 22",
    chapters: 24,
    renders: 24,
    description: "Protection and Theodicy / The Invisible War — Purim reversal, then Job's courtroom in heaven, affliction, questions.",
    category: "Wisdom Literature",
    symbols: ["Purim reversal", "courtroom in heaven", "affliction ashes", "whirlwind questions"],
    testament: 'old'
  },
  {
    number: 20,
    symbol: "🤲",
    name: "Trust Under Silence",
    range: "Job 23 – Psalms 4",
    chapters: 24,
    renders: 24,
    description: "Trust Under Silence / Seeking the Face — Complaint turns to hope, refuge language, night watches, early psalms.",
    category: "Wisdom Literature",
    symbols: ["complaint → hope", "refuge language", "night watches"],
    testament: 'old'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SETS 21-30: PSALMS & PROPHETS BEGIN
  // ═══════════════════════════════════════════════════════════════════════════
  {
    number: 21,
    symbol: "🗡",
    name: "Warfare Prayers",
    range: "Psalms 5–28",
    chapters: 24,
    renders: 24,
    description: "Pleading / Warfare Prayers — Enemy plots, fortress imagery, tears, confession, deliverance cries.",
    category: "Psalms",
    symbols: ["enemy plots", "fortress", "tears", "confession", "deliverance cries"],
    testament: 'old'
  },
  {
    number: 22,
    symbol: "🎺",
    name: "Kingship Praise",
    range: "Psalms 29–52",
    chapters: 24,
    renders: 24,
    description: "Praising / Kingship of the LORD — Thunder voice, shepherd psalm, betrayal psalms, enthronement.",
    category: "Psalms",
    symbols: ["thunder voice", "shepherd psalm", "betrayal psalms", "enthronement language"],
    testament: 'old'
  },
  {
    number: 23,
    symbol: "🛡",
    name: "Shield-Judge",
    range: "Psalms 53–76",
    chapters: 24,
    renders: 24,
    description: "Protecting / God as Shield-Judge — Trembling nations, righteous refuge, Zion defense.",
    category: "Psalms",
    symbols: ["trembling nations", "righteous refuge", "Zion defense"],
    testament: 'old'
  },
  {
    number: 24,
    symbol: "🏆",
    name: "Victory",
    range: "Psalms 77–100",
    chapters: 24,
    renders: 24,
    description: "Victory / Exodus Memory → Universal Reign — Sea remembered, wilderness recalled, 'God reigns,' joyful noise.",
    category: "Psalms",
    symbols: ["sea remembered", "wilderness recalled", "God reigns", "joyful noise"],
    testament: 'old'
  },
  {
    number: 25,
    symbol: "🚶",
    name: "Pilgrim Confidence",
    range: "Psalms 101–124",
    chapters: 24,
    renders: 24,
    description: "Certainty / Pilgrim Confidence — Integrity vows, deliverance songs, ascent momentum.",
    category: "Psalms",
    symbols: ["integrity vows", "deliverance songs", "ascent momentum"],
    testament: 'old'
  },
  {
    number: 26,
    symbol: "⛰",
    name: "Unshakeable Zion",
    range: "Psalms 125–148",
    chapters: 24,
    renders: 24,
    description: "Assurance / Unshakeable Zion — Mountains around Jerusalem, blessing, creation praise.",
    category: "Psalms",
    symbols: ["mountains around Jerusalem", "blessing", "creation praise"],
    testament: 'old'
  },
  {
    number: 27,
    symbol: "📚",
    name: "Wisdom",
    range: "Psalms 149 – Proverbs 22",
    chapters: 24,
    renders: 24,
    description: "Wisdom / Skillful Living — Two paths, the tongue, scales, household order.",
    category: "Wisdom Literature",
    symbols: ["two paths", "tongue", "scales", "household order"],
    testament: 'old'
  },
  {
    number: 28,
    symbol: "⚠",
    name: "Folly Exposed",
    range: "Proverbs 23 – Song of Solomon 3",
    chapters: 24,
    renders: 24,
    description: "Folly Exposed / Desire Disordered — Wine trap, strange woman, broken appetites, awakening desire.",
    category: "Wisdom Literature",
    symbols: ["wine trap", "strange woman", "broken appetites", "awakening desire"],
    testament: 'old'
  },
  {
    number: 29,
    symbol: "💔",
    name: "Faltering Bride",
    range: "Song of Solomon 4 – Isaiah 19",
    chapters: 24,
    renders: 24,
    description: "Faltering Bride / Love + Covenant Drift — Bride imagery, watchmen, vineyard, early prophetic warnings.",
    category: "Major Prophets",
    symbols: ["bride imagery", "watchmen", "vineyard", "early prophetic warnings", "shaken nations"],
    testament: 'old'
  },
  {
    number: 30,
    symbol: "⚖🔨",
    name: "Judgment",
    range: "Isaiah 20–43",
    chapters: 24,
    renders: 24,
    description: "Judgment / Holy One Confronts Idols — Shattered idols, remnant hope, courtroom language, Cyrus shadow.",
    category: "Major Prophets",
    symbols: ["shattered idols", "remnant", "courtroom language", "Cyrus shadow rising"],
    testament: 'old'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SETS 31-40: PROPHETS & GOSPELS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    number: 31,
    symbol: "🕊",
    name: "Gospel/Comfort",
    range: "Isaiah 44 – Jeremiah 1",
    chapters: 24,
    renders: 24,
    description: "Gospel / Comfort + Servant Trajectory — New exodus, servant light, shepherd language, prophetic commissioning.",
    category: "Major Prophets",
    symbols: ["new exodus", "servant light", "shepherd language", "prophetic commissioning"],
    testament: 'old'
  },
  {
    number: 32,
    symbol: "🏚",
    name: "Broken Cisterns",
    range: "Jeremiah 2–25",
    chapters: 24,
    renders: 24,
    description: "Faltering Pt. II / Broken Cisterns — Cracked cistern, refused yoke, looming invasion.",
    category: "Major Prophets",
    symbols: ["cracked cistern", "refused yoke", "looming invasion"],
    testament: 'old'
  },
  {
    number: 33,
    symbol: "📢",
    name: "Final Warnings",
    range: "Jeremiah 26–49",
    chapters: 24,
    renders: 24,
    description: "God's Pleading / Final Warnings to Nations — Yoke bars, potter/clay, scroll burned, judgment cup.",
    category: "Major Prophets",
    symbols: ["yoke bars", "potter/clay", "scroll burned", "judgment cup"],
    testament: 'old'
  },
  {
    number: 34,
    symbol: "👁",
    name: "Abominations Exposed",
    range: "Jeremiah 50–52 + Ezekiel 1–21",
    chapters: 24,
    renders: 24,
    description: "Abominations Exposed / Temple Defilement / False Worship Judged — Babylon falls, visions, glory departing.",
    category: "Major Prophets",
    symbols: ["fallen Babylon", "siege visions", "scroll-eaten prophet", "wheels", "glory departing", "abominations in chambers"],
    testament: 'old'
  },
  {
    number: 35,
    symbol: "💀➡🌱",
    name: "Restoration",
    range: "Ezekiel 22–45",
    chapters: 24,
    renders: 24,
    description: "Apostasy to Restoration / Blood-Guilt → Sanctuary Blueprint — Dross, corrupt shepherds, valley of bones, measured temple.",
    category: "Major Prophets",
    symbols: ["molten dross", "corrupt shepherds", "valley of bones momentum", "measured temple", "priestly boundaries"],
    testament: 'old'
  },
  {
    number: 36,
    symbol: "🔮",
    name: "Prophecy Unsealed",
    range: "Ezekiel 46–48 + Daniel 1–12 + Hosea 1–9",
    chapters: 24,
    renders: 24,
    description: "Prophecy Unsealed / Kingdoms Revealed / Covenant as Marriage Trial — River from temple, beasts, Ancient of Days, broken marriage.",
    category: "Major Prophets",
    symbols: ["river from temple", "beasts", "horns", "Ancient of Days court", "broken marriage", "naming-signs"],
    testament: 'old'
  },
  {
    number: 37,
    symbol: "🦗",
    name: "Day of LORD Near",
    range: "Hosea 10–14 + Joel 1–3 + Amos 1–9 + Obadiah + Jonah 1–4 + Micah 1–2",
    chapters: 24,
    renders: 24,
    description: "Probation Pressure / Day of the LORD Near — Locust collapse, roaring judgment, plumb line, Edom, reluctant prophet.",
    category: "Minor Prophets",
    symbols: ["locust collapse", "roaring judgment", "plumb line", "Edom fall", "reluctant prophet", "remnant warnings"],
    testament: 'old'
  },
  {
    number: 38,
    symbol: "⚖🕯",
    name: "Mercy with Teeth",
    range: "Micah 3–7 + Nahum 1–3 + Habakkuk 1–3 + Zephaniah 1–3 + Haggai 1–2 + Zechariah 1–8",
    chapters: 24,
    renders: 24,
    description: "Mercy with Teeth / Judgment that Saves a Remnant — 'What doth the LORD require,' Nineveh doom, watchtower, lampstand.",
    category: "Minor Prophets",
    symbols: ["what doth the LORD require", "Nineveh doom", "watchtower questions", "day of wrath", "shaking nations", "lampstand/olive trees"],
    testament: 'old'
  },
  {
    number: 39,
    symbol: "🌅",
    name: "Kingdom Dawn",
    range: "Zechariah 9–14 + Malachi 1–4 + Matthew 1–14",
    chapters: 24,
    renders: 24,
    description: "Forerunner + Kingdom Dawn — Pierced one, refining fire, messenger/Elijah, genealogy, wilderness voice, baptism, miracles.",
    category: "Gospels",
    symbols: ["pierced one", "refining fire", "messenger/Elijah motif", "genealogy seedline", "wilderness voice", "baptism waters", "miracles as signs"],
    testament: 'new'
  },
  {
    number: 40,
    symbol: "⚔👑",
    name: "Kingdom Conflict",
    range: "Matthew 15–28 + Mark 1–10",
    chapters: 24,
    renders: 24,
    description: "Kingdom Conflict / Authority Contested — Tradition clash, cross-shadow, resurrection shock, Mark's urgent pacing.",
    category: "Gospels",
    symbols: ["tradition clash", "cross-shadow intensifies", "resurrection shock", "immediate-action", "discipleship cost"],
    testament: 'new'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SETS 41-50: GOSPELS, ACTS, EPISTLES, REVELATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    number: 41,
    symbol: "🚪❤",
    name: "King Enters",
    range: "Mark 11–16 + Luke 1–18",
    chapters: 24,
    renders: 24,
    description: "The King Enters / The Savior Seeks — Fig tree, temple confrontation, passion, annunciation songs, parables of mercy.",
    category: "Gospels",
    symbols: ["fig tree judgment", "temple confrontation", "passion narrative", "annunciation songs", "parables of mercy", "lost/found arc"],
    testament: 'new'
  },
  {
    number: 42,
    symbol: "✝",
    name: "The Cross",
    range: "Luke 19–24 + John 1–18",
    chapters: 24,
    renders: 24,
    description: "The Cross / Light vs Darkness — Triumphal entry, trial, crucifixion, empty tomb, Word made flesh, 'I AM,' betrayal night.",
    category: "Gospels",
    symbols: ["triumphal entry", "trial", "crucifixion", "empty tomb", "Word made flesh", "signs", "I AM", "betrayal night"],
    testament: 'new'
  },
  {
    number: 43,
    symbol: "🔥🌍",
    name: "Spirit Expansion",
    range: "John 19–21 + Acts 1–21",
    chapters: 24,
    renders: 24,
    description: "Resurrection Witness → Spirit-Powered Expansion — Pierced side, breakfast shore, Pentecost fire, boldness, Gentile door.",
    category: "Acts & Epistles",
    symbols: ["pierced side", "breakfast shore", "tongues of fire", "boldness", "persecutions", "Gentile door opens"],
    testament: 'new'
  },
  {
    number: 44,
    symbol: "⛓📜",
    name: "Gospel Logic",
    range: "Acts 22–28 + Romans 1–16 + 1 Corinthians 1",
    chapters: 24,
    renders: 24,
    description: "Mission to the Nations / Gospel Logic — Chains as witness, justification frame, church body begins.",
    category: "Acts & Epistles",
    symbols: ["chains as witness", "justification frame", "church body begins"],
    testament: 'new'
  },
  {
    number: 45,
    symbol: "🍞🎁",
    name: "Church Order",
    range: "1 Corinthians 2–16 + 2 Corinthians 1–9",
    chapters: 24,
    renders: 24,
    description: "Church Order / Gifts / Weakness-as-Power — Communion, resurrection argument, generosity, reconciled ministry.",
    category: "Acts & Epistles",
    symbols: ["communion", "resurrection argument", "generosity", "reconciled ministry"],
    testament: 'new'
  },
  {
    number: 46,
    symbol: "⚔🛡",
    name: "Christ Only",
    range: "2 Corinthians 10–13 + Galatians 1–6 + Ephesians 1–6 + Philippians 1–4 + Colossians 1–4",
    chapters: 24,
    renders: 24,
    description: "Christ Only / Counterfeit Gospels Crushed — False apostles exposed, law vs grace, armor of God, joy in chains.",
    category: "Acts & Epistles",
    symbols: ["false apostles exposed", "law vs grace war", "armor of God", "joy in chains", "supremacy of Christ"],
    testament: 'new'
  },
  {
    number: 47,
    symbol: "⏳🔥",
    name: "Advent Hope",
    range: "1 Thessalonians 1–5 + 2 Thessalonians 1–3 + 1 Timothy 1–6 + 2 Timothy 1–4 + Titus 1–3 + Philemon + Hebrews 1–2",
    chapters: 24,
    renders: 24,
    description: "Advent Hope / Last Days Order / Faithfulness Under Pressure — Man of sin warning, pastoral charge, endurance.",
    category: "Acts & Epistles",
    symbols: ["man of sin warning", "pastoral charge", "endurance", "slavery reversal", "better Hebrews ascent"],
    testament: 'new'
  },
  {
    number: 48,
    symbol: "⛪🔥",
    name: "Sanctuary Reality",
    range: "Hebrews 3–13 + James 1–5 + 1 Peter 1–5 + 2 Peter 1–3",
    chapters: 24,
    renders: 24,
    description: "Sanctuary Reality / Living Faith / False Teachers — High priest, veil access, patience trials, scoffers, day of LORD.",
    category: "General Epistles",
    symbols: ["high priest", "veil access", "patience trials", "fiery furnace faith", "scoffers", "day of the LORD"],
    testament: 'new'
  },
  {
    number: 49,
    symbol: "📨✝",
    name: "Final Letters",
    range: "1 John 1–5 + 2 John + 3 John + Jude + Revelation 1–5",
    chapters: 14,
    renders: 14,
    description: "Final Letters / Love-Truth Tests / Christ Among the Candlesticks — Antichrist warnings, walking in truth, apostasy alerts, seven churches, Lamb enthroned.",
    category: "General Epistles",
    symbols: ["love-truth tests", "apostasy warnings", "candlesticks", "seven churches", "throne room", "Lamb worthy"],
    testament: 'new'
  },
  {
    number: 50,
    symbol: "🐉⚔",
    name: "Warfare of Truth",
    range: "Revelation 6–16",
    chapters: 11,
    renders: 11,
    description: "Seals / Trumpets / Dragon Rage — Seven seals break, trumpets sound, two witnesses, woman and dragon, beast rises, three angels' messages.",
    category: "Revelation",
    symbols: ["seals", "trumpets", "two witnesses", "woman clothed with sun", "dragon rage", "beast system", "three angels"],
    testament: 'new'
  },
  {
    number: 51,
    symbol: "🏙✨",
    name: "Heaven",
    range: "Revelation 17–22",
    chapters: 6,
    renders: 6,
    description: "Babylon Falls → New Earth — Harlot city collapse, marriage supper, white horse, millennium, final fire, New Jerusalem.",
    category: "Revelation",
    symbols: ["harlot city collapse", "marriage supper", "white horse", "millennium", "final fire", "New Jerusalem"],
    testament: 'new'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Get all categories
export const getBibleRenderedCategories = (): string[] => {
  return Array.from(new Set(bibleRenderedSets.map(s => s.category)));
};

// Get sets by category
export const getSetsByCategory = (category: string): BibleRenderedSet[] => {
  return bibleRenderedSets.filter(s => s.category === category);
};

// Get sets by testament
export const getSetsByTestament = (testament: 'old' | 'new'): BibleRenderedSet[] => {
  return bibleRenderedSets.filter(s => s.testament === testament);
};

// Get a specific set by number
export const getSetByNumber = (number: number): BibleRenderedSet | undefined => {
  return bibleRenderedSets.find(s => s.number === number);
};

// Total chapters covered
export const getTotalChapters = (): number => {
  return bibleRenderedSets.reduce((sum, set) => sum + set.chapters, 0);
};

// Total renders
export const getTotalRenders = (): number => {
  return bibleRenderedSets.reduce((sum, set) => sum + set.renders, 0);
};
