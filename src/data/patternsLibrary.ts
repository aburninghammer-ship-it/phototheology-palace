// Patterns Room Library - Comprehensive Biblical Patterns
// Patterns appear 3+ times across Scripture revealing God's consistent ways

export interface BiblicalPattern {
  id: string;
  name: string;
  structure: string;
  category: PatternCategory;
  instances: PatternInstance[];
  theologicalInsight: string;
  christConnection: string;
}

export interface PatternInstance {
  reference: string;
  description: string;
  details: string;
}

export type PatternCategory =
  | 'testing'
  | 'election'
  | 'deliverance'
  | 'covenant'
  | 'judgment'
  | 'provision'
  | 'encounter'
  | 'course'
  | 'structure'
  | 'typology';

// ============================================
// COURSE PATTERNS - Multi-Book Progressive Patterns
// ============================================

export interface CoursePattern {
  id: string;
  name: string;
  definition: string;
  category: 'course';
  elements: CourseElement[];
  theCourse: string[];
  personalApplication?: string[];
  christConnection: string;
}

export interface CourseElement {
  name: string;
  scripture: string;
  event: string;
  significance: string;
}

// PATTERN A: THE WATERS COURSE
export const watersCourse: CoursePattern = {
  id: 'waters-course',
  name: 'The Waters Course',
  definition: 'Rivers and bodies of water trace the course of salvation history from Eden to New Jerusalem.',
  category: 'course',
  elements: [
    { name: 'Rivers of Eden', scripture: 'Genesis 2:10-14', event: 'Paradise', significance: 'Life-giving flow, creation, fellowship with God' },
    { name: 'River Nile', scripture: 'Exodus 1-2', event: 'Bondage', significance: "God's people in slavery, Moses in basket, plagues" },
    { name: 'Red Sea', scripture: 'Exodus 14', event: 'Deliverance', significance: 'Baptism, death to old life, Egypt drowned' },
    { name: 'Jordan River', scripture: 'Joshua 3; 2 Kings 5', event: 'Victory', significance: 'Entry into Promised Land, Naaman cleansed, baptism' },
    { name: 'Brook Cherith', scripture: '1 Kings 17:3-7', event: 'Hiding', significance: 'Wilderness sustenance, ravens feed Elijah' },
    { name: 'River Chebar', scripture: 'Ezekiel 1:1', event: 'Commission', significance: 'Vision of God, calling in exile, throne of God' },
    { name: 'Mediterranean/Great Sea', scripture: 'Daniel 7:2-3', event: 'Prophecy', significance: 'Beasts arise, Little Horn identified' },
    { name: 'River Ulai', scripture: 'Daniel 8:2', event: 'Cleansing', significance: '2300 days, sanctuary cleansed (1844)' },
    { name: 'River Hiddekel (Tigris)', scripture: 'Daniel 10:4', event: 'Purification', significance: 'End-time vision, "made white and tried," character perfection' },
    { name: 'Sea of Galilee', scripture: 'Gospels', event: 'Harvest', significance: 'Multitudes healed, fishers of men, great catch' },
    { name: 'Brook Kidron/Cedron', scripture: 'John 18:1', event: 'Testing', significance: 'Gethsemane, time of trouble, self-surrender' },
    { name: 'River Euphrates', scripture: 'Revelation 16:12', event: 'Enemy Falls', significance: "Drying up of Babylon's support, way prepared" },
    { name: 'River of Life', scripture: 'Revelation 22:1-2', event: 'Paradise Restored', significance: 'Proceeding from throne, Tree of Life, healing' }
  ],
  theCourse: [
    'Paradise', 'Bondage', 'Deliverance', 'Victory', 'Hiding', 'Commission',
    'Prophecy', 'Cleansing', 'Purification', 'Harvest', 'Testing', 'Enemy Falls', 'Paradise Restored'
  ],
  personalApplication: [
    'Eden — Innocence lost',
    'Nile — Bondage to sin',
    'Red Sea — Deliverance through the Cross',
    'Jordan — Baptism, victory',
    'Cherith — Wilderness testing',
    'Chebar — Called to speak truth',
    'Ulai — Sanctuary cleansing (personal judgment)',
    'Hiddekel — Character perfection',
    'Galilee — Soul-winning',
    'Kidron — Final testing (Gethsemane)',
    'Euphrates — Enemy power broken',
    'River of Life — Eternal life'
  ],
  christConnection: 'Christ is the Living Water (John 4:14, 7:37-38). He walked through every water: baptized in Jordan, walked on Galilee, crossed Kidron to Gethsemane. He IS the River of Life proceeding from the throne.'
};

// PATTERN B: THE MOUNTAINS COURSE
export const mountainsCourse: CoursePattern = {
  id: 'mountains-course',
  name: 'The Mountains Course',
  definition: 'Mountains in Scripture mark significant encounters with God, forming a progressive revelation of His character and plan.',
  category: 'course',
  elements: [
    { name: 'Ararat', scripture: 'Genesis 8:4', event: 'Ark rests after Flood', significance: 'New beginning after judgment, salvation through the ark' },
    { name: 'Moriah', scripture: 'Genesis 22:2; 2 Chronicles 3:1', event: 'Abraham offers Isaac; Temple built', significance: 'Sacrifice, substitution, "The Lord will provide"' },
    { name: 'Sinai/Horeb', scripture: 'Exodus 19-20; 1 Kings 19', event: 'Law given; Elijah hears still small voice', significance: "Law, covenant, God's presence, recommissioning" },
    { name: 'Nebo/Pisgah', scripture: 'Deuteronomy 34:1', event: 'Moses views Promised Land, dies', significance: 'Death before entry, yet sees the promise' },
    { name: 'Ebal and Gerizim', scripture: 'Deuteronomy 27-28', event: 'Blessings and curses', significance: 'Covenant choice, consequences' },
    { name: 'Carmel', scripture: '1 Kings 18', event: 'Elijah vs. prophets of Baal', significance: 'Confrontation, true worship vindicated, fire falls' },
    { name: 'Zion/Jerusalem', scripture: 'Psalms; Hebrews 12:22', event: 'City of David, Temple mount', significance: "God's dwelling, eternal kingdom, heavenly Jerusalem" },
    { name: 'Mountain of Transfiguration', scripture: 'Matthew 17', event: 'Jesus glorified, Moses and Elijah appear', significance: 'Glory revealed before suffering, voice of the Father' },
    { name: 'Calvary/Golgotha', scripture: 'Matthew 27', event: 'Crucifixion', significance: 'Sacrifice complete, salvation accomplished' },
    { name: 'Mount of Olives', scripture: 'Zechariah 14:4; Acts 1:11', event: 'Jesus ascends; Jesus will return', significance: 'Ascension and Second Coming' },
    { name: 'Mount Zion (Heavenly)', scripture: 'Revelation 14:1', event: '144,000 stand with Lamb', significance: 'Victory, sealing, final harvest' },
    { name: 'Great Mountain (New Earth)', scripture: 'Revelation 21:10', event: 'New Jerusalem descends', significance: 'Eternal home, God dwells with man' }
  ],
  theCourse: [
    'New beginning (Ararat)', 'Sacrifice provided (Moriah)', 'Law given (Sinai)',
    'Covenant choice (Ebal/Gerizim)', 'Death before entry (Nebo)', 'True worship vindicated (Carmel)',
    "God's dwelling (Zion)", 'Glory revealed (Transfiguration)', 'Sacrifice complete (Calvary)',
    'Ascension/Return (Olivet)', 'Victory (Heavenly Zion)', 'Eternal home (New Jerusalem)'
  ],
  christConnection: 'Moriah: The Lamb provided. Sinai: The Lawgiver. Carmel: The true God vindicated. Transfiguration: Glory revealed. Calvary: The Sacrifice. Olivet: The Returning King. Zion: The Reigning Lamb.'
};

// PATTERN C: THE TREES COURSE
export const treesCourse: CoursePattern = {
  id: 'trees-course',
  name: 'The Trees Course',
  definition: 'Trees in Scripture mark key spiritual realities, from the Fall to Restoration.',
  category: 'course',
  elements: [
    { name: 'Tree of Life', scripture: 'Genesis 2:9', event: 'Eden, access to eternal life', significance: "Immortality, God's presence" },
    { name: 'Tree of Knowledge', scripture: 'Genesis 2:17; 3:6', event: 'Forbidden, eaten', significance: 'Sin, death, Fall' },
    { name: 'Oaks of Mamre', scripture: 'Genesis 18:1', event: 'Abraham meets three visitors', significance: 'Covenant, promise confirmed' },
    { name: 'Burning Bush', scripture: 'Exodus 3:2', event: 'Moses commissioned', significance: "God's presence, holy ground" },
    { name: 'Almond Rod of Aaron', scripture: 'Numbers 17:8', event: 'Budded to confirm priesthood', significance: 'True priesthood vindicated' },
    { name: 'Olive Tree', scripture: 'Romans 11:17-24; Zechariah 4', event: 'Israel, Gentiles grafted in', significance: "Covenant people, Spirit's witness" },
    { name: 'Fig Tree', scripture: 'Matthew 21:19; 24:32', event: 'Cursed (Israel); Sign of His coming', significance: 'Judgment on fruitlessness; readiness' },
    { name: 'Vine', scripture: 'John 15:1-8', event: '"I am the true vine"', significance: 'Abiding in Christ, fruitfulness' },
    { name: 'Tree/Cross', scripture: 'Galatians 3:13; 1 Peter 2:24', event: '"Cursed is everyone who hangs on a tree"', significance: 'Curse borne, redemption' },
    { name: 'Tree of Life (Restored)', scripture: 'Revelation 2:7; 22:2', event: 'Access restored, healing of nations', significance: 'Immortality regained, eternal life' }
  ],
  theCourse: [
    'Life available (Tree of Life)', 'Life lost (Tree of Knowledge)', 'Covenant (Oaks)',
    'Commission (Burning Bush)', 'True priesthood (Almond)', 'Covenant people (Olive)',
    'Judgment on fruitlessness (Fig)', 'Abiding (Vine)', 'Curse borne (Cross)', 'Life restored (Tree of Life)'
  ],
  christConnection: 'The Tree of Life bookends human history. Lost in Genesis 3, restored in Revelation 22. The Cross (tree) is the bridge between. Christ IS the Tree of Life—eat of Him and live forever.'
};

// ============================================
// STRUCTURAL PATTERNS - Numerical and Symbolic
// ============================================

export interface NumberPattern {
  number: number | string;
  meaning: string;
  examples: string[];
}

export const numbersPattern: NumberPattern[] = [
  { number: 1, meaning: 'Unity, primacy', examples: ['"The Lord our God is one" (Deut 6:4)'] },
  { number: 2, meaning: 'Witness, testimony', examples: ['Two witnesses (Rev 11)', 'Two tablets'] },
  { number: 3, meaning: 'Divine completeness', examples: ["Trinity", "Jonah's 3 days", "Christ's 3 days in tomb"] },
  { number: 4, meaning: 'Universal, earthly completeness', examples: ['4 winds', '4 corners of earth', '4 living creatures'] },
  { number: 6, meaning: 'Man, incompleteness (falls short of 7)', examples: ['Man created day 6', '666'] },
  { number: 7, meaning: 'Divine perfection, completion', examples: ['7 days', '7 churches', '7 seals', '7 trumpets', '7 plagues'] },
  { number: 10, meaning: 'Law, completeness of order', examples: ['10 Commandments', '10 plagues', '10 virgins'] },
  { number: 12, meaning: 'Governmental perfection', examples: ['12 tribes', '12 apostles', '12 gates', '12 foundations'] },
  { number: 40, meaning: 'Testing, probation', examples: ['40 days (flood, Moses, Elijah, Jesus)', '40 years (wilderness)'] },
  { number: 70, meaning: 'Perfect spiritual order', examples: ['70 weeks (Daniel 9)', '70 elders', 'Jesus sent 70'] },
  { number: 144000, meaning: '12 x 12 x 1000', examples: ["Fullness of God's sealed people"] },
  { number: 1000, meaning: 'Ultimate completeness', examples: ['Millennium'] },
  { number: 1260, meaning: 'Persecution period', examples: ['1260 days/years (Daniel, Revelation)'] },
  { number: 2300, meaning: 'Sanctuary cleansing', examples: ['Daniel 8:14 (2300 evenings and mornings)'] }
];

// ============================================
// FEAST PATTERNS
// ============================================

export interface FeastPattern {
  name: string;
  scripture: string;
  otMeaning: string;
  fulfillment: string;
  timing: 'spring' | 'fall';
  fulfilled: boolean;
}

export const feastsPattern: FeastPattern[] = [
  { name: 'Passover', scripture: 'Lev 23:5', otMeaning: 'Lamb slain, deliverance from Egypt', fulfillment: "Christ's death (1 Cor 5:7)", timing: 'spring', fulfilled: true },
  { name: 'Unleavened Bread', scripture: 'Lev 23:6-8', otMeaning: 'Putting away leaven (sin), haste', fulfillment: "Christ's burial, putting away sin", timing: 'spring', fulfilled: true },
  { name: 'Firstfruits', scripture: 'Lev 23:9-14', otMeaning: 'First sheaf waved', fulfillment: "Christ's resurrection (1 Cor 15:20-23)", timing: 'spring', fulfilled: true },
  { name: 'Pentecost', scripture: 'Lev 23:15-22', otMeaning: 'Wheat harvest, two loaves waved', fulfillment: 'Holy Spirit poured out (Acts 2), Jew and Gentile', timing: 'spring', fulfilled: true },
  { name: 'Trumpets', scripture: 'Lev 23:23-25', otMeaning: 'Blowing of trumpets, awakening', fulfillment: 'Gospel warnings, 1844 awakening', timing: 'fall', fulfilled: false },
  { name: 'Day of Atonement', scripture: 'Lev 23:26-32', otMeaning: 'Cleansing of sanctuary, judgment', fulfillment: 'Investigative Judgment (1844-), sanctuary cleansing', timing: 'fall', fulfilled: false },
  { name: 'Tabernacles', scripture: 'Lev 23:33-44', otMeaning: 'Ingathering, booths, rejoicing', fulfillment: 'Millennium, dwelling with God, New Earth', timing: 'fall', fulfilled: false }
];

// ============================================
// SANCTUARY PATTERNS
// ============================================

export interface SanctuaryElement {
  furniture: string;
  location: 'courtyard' | 'holy-place' | 'most-holy';
  meaning: string;
  christ: string;
  personal: string;
  church: string;
}

export const sanctuaryPattern: SanctuaryElement[] = [
  { furniture: 'Altar of Sacrifice', location: 'courtyard', meaning: 'Sacrifice for sin', christ: "Christ's death", personal: 'I must die to self', church: 'Church founded on sacrifice' },
  { furniture: 'Laver', location: 'courtyard', meaning: 'Cleansing with water', christ: "Christ's baptism", personal: 'Baptism, born again', church: 'Pentecost' },
  { furniture: 'Table of Shewbread', location: 'holy-place', meaning: 'Bread of Presence, Word', christ: 'Christ the Bread of Life', personal: 'Study the Word', church: 'Preach the Word' },
  { furniture: 'Altar of Incense', location: 'holy-place', meaning: 'Prayers ascending', christ: "Christ's intercession", personal: 'Prayer', church: 'Corporate prayer' },
  { furniture: 'Candlestick', location: 'holy-place', meaning: 'Light, witness', christ: 'Christ the Light', personal: 'Let your light shine', church: 'Church as light' },
  { furniture: 'Ark of Covenant', location: 'most-holy', meaning: 'Presence of God, Law', christ: 'Christ our Righteousness', personal: 'Keep commandments', church: '1844, judgment' },
  { furniture: 'Mercy Seat', location: 'most-holy', meaning: 'Atonement, grace', christ: 'Christ our Mercy', personal: 'Grace and truth', church: 'Day of Atonement' }
];

// SANCTUARY PATTERN IN REVELATION (Corrected - Ark NOT in Rev 4-5)
export interface RevelationSanctuaryMapping {
  revelation: string;
  furniture: string;
  feast: string;
  phase: string;
}

export const revelationSanctuaryPattern: RevelationSanctuaryMapping[] = [
  { revelation: '1-3', furniture: 'Candlestick', feast: 'Passover-Pentecost', phase: 'Holy Place' },
  { revelation: '4-5', furniture: 'Incense/Throne', feast: 'Pentecost', phase: 'Inauguration' },
  { revelation: '6', furniture: 'Shewbread', feast: 'Unleavened', phase: 'Holy Place' },
  { revelation: '8-9', furniture: 'Incense Altar', feast: 'Trumpets', phase: 'Holy Place' },
  { revelation: '11:19', furniture: 'Ark seen', feast: 'Atonement', phase: 'Most Holy opens' },
  { revelation: '15', furniture: 'Temple closed', feast: 'Atonement ends', phase: 'Intercession ends' },
  { revelation: '16', furniture: 'Bowls', feast: 'Wrath', phase: 'Plagues' },
  { revelation: '19-22', furniture: '—', feast: 'Tabernacles', phase: 'Celebration' }
];

// ============================================
// FOUR DECREES PATTERN
// ============================================

export interface DecreePattern {
  decree: string;
  date: string;
  scripture: string;
  work: string;
  endTimeParallel: string;
}

export const fourDecreesPattern: DecreePattern[] = [
  { decree: '1st: Cyrus', date: '536 BC', scripture: 'Ezra 1:1-3', work: 'Attention to desolate sanctuary, 50,000 return', endTimeParallel: 'First Angel\'s Message (1840-1843), ~50,000 Millerites' },
  { decree: '2nd: Darius', date: '520 BC', scripture: 'Ezra 6:6-7', work: 'Reaffirmation amid opposition, temple completed', endTimeParallel: 'Reaffirmation despite opposition' },
  { decree: '3rd: Artaxerxes to Ezra', date: '457 BC', scripture: 'Ezra 7:12-26', work: 'Autonomy, Law restored', endTimeParallel: 'Third Angel\'s Message, Law of God, Adventism solidified' },
  { decree: '4th: Artaxerxes to Nehemiah', date: '445 BC', scripture: 'Nehemiah 2', work: 'Wall and street in troublous times', endTimeParallel: 'Fourth Angel (Rev 18:1), wall (Spirit) and street (evangelism)' }
];

// ============================================
// CREATION WEEK PATTERN
// ============================================

export interface CreationDayPattern {
  day: number;
  creationAct: string;
  historicalFulfillment: string;
}

export const creationWeekPattern: CreationDayPattern[] = [
  { day: 1, creationAct: 'Light from darkness', historicalFulfillment: 'Plan of Salvation announced (light in darkness)' },
  { day: 2, creationAct: 'Waters separated vertically (above/below)', historicalFulfillment: 'The Flood (waters of judgment)' },
  { day: 3, creationAct: 'Waters separated horizontally (seas/dry land), vegetation', historicalFulfillment: 'Red Sea (Church born), fruit' },
  { day: 4, creationAct: 'Sun, moon, stars (lights to rule)', historicalFulfillment: 'Coming of Jesus (Light of the world)' },
  { day: 5, creationAct: 'Fish and birds (teeming life)', historicalFulfillment: 'Pentecost, fishers of men, NT Church' },
  { day: 6, creationAct: "Man made in God's image, dominion over beasts", historicalFulfillment: 'Mystery of God finished (Christ in you), victory over the beast' },
  { day: 7, creationAct: 'Sabbath rest', historicalFulfillment: 'Millennium, rest from enemies, eternal Sabbath' }
];

// ============================================
// OLD TESTAMENT OFFICES PATTERN
// ============================================

export interface OTOfficePattern {
  office: string;
  otFunction: string;
  christFulfillment: string;
  time: string;
}

export const otOfficesPattern: OTOfficePattern[] = [
  { office: 'Prophet', otFunction: "Speaks God's Word to the people", christFulfillment: "Christ's earthly ministry", time: 'First Coming' },
  { office: 'Priest', otFunction: 'Mediates between God and man', christFulfillment: "Christ's heavenly intercession", time: 'Ascension to present' },
  { office: 'Judge', otFunction: 'Evaluates and renders verdict', christFulfillment: 'Investigative Judgment', time: '1844 - close of probation' },
  { office: 'King', otFunction: 'Rules and reigns', christFulfillment: 'Christ takes His throne', time: 'Second Coming' }
];

// ============================================
// REPEAT AND ENLARGE PATTERN (DANIEL)
// ============================================

export interface DanielVisionPattern {
  vision: string;
  scope: string;
  focus: string;
  newDetail: string;
}

export const repeatAndEnlargePattern: DanielVisionPattern[] = [
  { vision: 'Daniel 2', scope: "Babylon to God's Kingdom", focus: 'Political empires', newDetail: 'Stone kingdom' },
  { vision: 'Daniel 7', scope: 'Babylon to Judgment', focus: 'Political + Religious', newDetail: 'Little Horn (1260), Judgment' },
  { vision: 'Daniel 8', scope: 'Medo-Persia to Cleansing', focus: 'Religious persecution', newDetail: '2300 days, Sanctuary cleansed' },
  { vision: 'Daniel 9', scope: '70 Weeks', focus: "Messiah's work", newDetail: 'Messiah cut off, Jerusalem destroyed' },
  { vision: 'Daniel 10-12', scope: 'Persia to Resurrection', focus: 'Detailed conflict', newDetail: 'Kings of North/South, Michael stands, Resurrection' }
];

// ============================================
// SEVEN CHURCHES PATTERN
// ============================================

export interface ChurchPattern {
  church: string;
  meaning: string;
  churchEra: string;
  otPeriod: string;
}

export const sevenChurchesPattern: ChurchPattern[] = [
  { church: 'Ephesus', meaning: 'Desirable', churchEra: 'Apostolic (31-100 AD)', otPeriod: 'Adam to Joseph: Beginning' },
  { church: 'Smyrna', meaning: 'Bitterness (Myrrh)', churchEra: 'Persecution (100-313 AD)', otPeriod: 'Moses to Ruth: Persecution, Faithfulness' },
  { church: 'Pergamos', meaning: 'Elevation (Married to power)', churchEra: 'Compromise (313-538 AD)', otPeriod: 'Samuel/Saul: Compromise' },
  { church: 'Thyatira', meaning: 'Continual sacrifice', churchEra: 'Papal dominance (538-1517 AD)', otPeriod: 'Kings: Jezebel, Apostasy' },
  { church: 'Sardis', meaning: 'Escaping ones', churchEra: 'Reformation (1517-1798 AD)', otPeriod: 'Ezra: Escaping Babylon' },
  { church: 'Philadelphia', meaning: 'Brotherly love', churchEra: 'Revival (1798-1844 AD)', otPeriod: 'Nehemiah: Brotherly love, Reform' },
  { church: 'Laodicea', meaning: 'People judged', churchEra: 'Judgment era (1844-end)', otPeriod: 'Prophets to Christ: Final message' }
];

// ============================================
// TIME PROPHECY STRUCTURE PATTERN
// ============================================

export interface TimeProphecyStructure {
  section: string;
  timePeriod: string;
  theme: string;
}

export const otTimeProphecyStructure: TimeProphecyStructure[] = [
  { section: 'Genesis to Joshua', timePeriod: '70 Weeks', theme: 'Setting up of sanctuary service' },
  { section: 'Judges to Chronicles', timePeriod: '1260', theme: 'Apostasy, temple cast down' },
  { section: 'Ezra to Malachi', timePeriod: '2300', theme: 'Restoration to coming of Christ' }
];

export const ntTimeProphecyStructure: TimeProphecyStructure[] = [
  { section: 'Gospels to Acts', timePeriod: '70 Weeks', theme: 'Setting up of sanctuary service' },
  { section: 'Romans to Jude', timePeriod: '1260', theme: 'True Gospel / Apostasy' },
  { section: 'Revelation', timePeriod: '2300', theme: 'Judgment to Second Coming' }
];

export const daniel11Structure: TimeProphecyStructure[] = [
  { section: 'Verses 1-22', timePeriod: '70 Weeks', theme: 'Medo-Persia through Greece to Rome' },
  { section: 'Verses 23-39', timePeriod: '1260', theme: 'Papal Rome' },
  { section: 'Verses 40-45', timePeriod: '2300 to end', theme: 'Time of the end' }
];

export const revelation12Structure: TimeProphecyStructure[] = [
  { section: 'Woman, Man Child (birth, ascension)', timePeriod: '70 Weeks', theme: "Israel, Christ's first coming" },
  { section: 'Woman in wilderness', timePeriod: '1260', theme: 'Church persecuted' },
  { section: 'Remnant who keep commandments', timePeriod: '2300 / End-time', theme: 'Final conflict' }
];

// ============================================
// CYRUS/CHRIST PATTERN
// ============================================

export interface CyrusChristParallel {
  cyrus: string;
  christ: string;
}

export const cyrusChristPattern: CyrusChristParallel[] = [
  { cyrus: 'Outside the walls of Babylon', christ: 'Outside the city on Calvary' },
  { cyrus: 'Dries up the Euphrates (deep/abyss)', christ: 'Descends into the grave (abyss), dries it up' },
  { cyrus: 'Opens the gates of the city', christ: 'Opens the gates of death' },
  { cyrus: 'Handwriting on wall: "Your kingdom is finished"', christ: '"It is finished" — kingdom of Satan doomed' },
  { cyrus: 'Sets the Jewish captives free', christ: 'Sets the captives free (Luke 4:18)' },
  { cyrus: 'Decrees the temple be rebuilt', christ: 'Decrees the Church be built' }
];

// ============================================
// MATTHEW 18:15-17 PATTERN
// ============================================

export interface Matthew18Pattern {
  step: string;
  matthew18: string;
  application: string;
}

export const matthew18Pattern: Matthew18Pattern[] = [
  { step: '1st: Go alone', matthew18: '"Go and tell him his fault between you and him alone"', application: 'Christ came alone' },
  { step: '2nd: Take two witnesses', matthew18: '"Take with you one or two more, that by the mouth of two or three witnesses every word may be established"', application: 'Two Witnesses (Rev 11)' },
  { step: '3rd: Tell the Church', matthew18: '"Tell it to the church"', application: 'Church proclaims final message (1844)' },
  { step: 'Final: Treat as heathen', matthew18: '"Let him be to you like a heathen and a tax collector"', application: 'Those who reject all three = heathen' }
];

// ============================================
// SIX DIMENSIONS (Application Guide)
// ============================================

export type DimensionType = 'literal' | 'christ' | 'personal' | 'church' | 'heaven-future' | 'heaven-past';

export interface SixDimensions {
  dimension: DimensionType;
  definition: string;
  example: string; // Using Manna as example
}

export const sixDimensions: SixDimensions[] = [
  { dimension: 'literal', definition: 'The historical event', example: 'Bread from heaven in wilderness' },
  { dimension: 'christ', definition: 'How it points to Jesus', example: 'Christ, the Bread of Life (John 6:35)' },
  { dimension: 'personal', definition: 'My application', example: 'The Word of God feeds my soul' },
  { dimension: 'church', definition: 'Corporate application', example: "Three Angels' Message (present truth)" },
  { dimension: 'heaven-future', definition: 'End-time/eschatological', example: 'Hidden manna (Revelation 2:17)' },
  { dimension: 'heaven-past', definition: "War in heaven / angelic", example: "Angels' food (Psalm 78:25), conflict over God's provision" }
];

// ============================================
// ORIGINAL PATTERNS (kept from existing file)
// ============================================

export const patternsLibrary: BiblicalPattern[] = [
  // TESTING PATTERNS
  {
    id: 'wilderness-testing',
    name: 'Wilderness Testing',
    structure: "God's people enter barren place → face deprivation/temptation → faith tested → outcome reveals heart",
    category: 'testing',
    instances: [
      { reference: 'Numbers 14; Deuteronomy 8:2', description: 'Israel 40 years in wilderness', details: 'Tested with hunger, thirst, enemies—failed repeatedly through murmuring and unbelief' },
      { reference: '1 Kings 19:4-8', description: 'Elijah 40 days to Horeb', details: 'Fled from Jezebel, sustained by angel, heard "still small voice" in the cave' },
      { reference: 'Matthew 4:1-11', description: 'Jesus 40 days tempted', details: 'Fasted, tempted by Satan in three ways, remained faithful, quoted Scripture' },
      { reference: 'Exodus 15:22-27', description: 'Israel at Marah (bitter water)', details: 'Three days without water, grumbled, God made bitter water sweet' }
    ],
    theologicalInsight: "Wilderness is God's classroom for testing and refining faith. God strips away false dependencies to reveal what we truly trust.",
    christConnection: 'Jesus succeeded where Israel failed, becoming our faithful representative who conquered every temptation we face.'
  },
  {
    id: 'younger-over-older',
    name: 'Younger Over Older',
    structure: 'Older son expected to inherit → God chooses younger → reversal of human expectations',
    category: 'election',
    instances: [
      { reference: 'Genesis 4:4-5', description: 'Abel over Cain', details: "Younger Abel's sacrifice accepted; older Cain's rejected" },
      { reference: 'Genesis 21:9-12', description: 'Isaac over Ishmael', details: 'Isaac (born when Abraham was older) is the child of promise, not firstborn Ishmael' },
      { reference: 'Genesis 25:23; 27:27-29', description: 'Jacob over Esau', details: '"The older shall serve the younger"—Jacob receives blessing meant for firstborn' },
      { reference: 'Genesis 37-50', description: 'Joseph over his brothers', details: 'Youngest of the twelve becomes savior of the family' },
      { reference: '1 Samuel 16:10-13', description: 'David over his brothers', details: 'Youngest and least impressive chosen as king over seven older brothers' },
      { reference: '1 Kings 1-2', description: 'Solomon over Adonijah', details: 'Younger Solomon receives throne over older Adonijah who tried to claim it' }
    ],
    theologicalInsight: "God's sovereign election overturns human primogeniture and merit. Grace chooses, not nature or tradition.",
    christConnection: 'Christ Himself is the ultimate "younger" who receives everything—the Second Adam inherits what the first Adam lost.'
  },
  {
    id: 'third-day-resurrection',
    name: 'Third Day Resurrection',
    structure: 'Death or crisis → three-day period → deliverance/resurrection on third day',
    category: 'deliverance',
    instances: [
      { reference: 'Genesis 22:4', description: 'Abraham sees Moriah on third day', details: "After three-day journey, Isaac 'raised' figuratively from the altar" },
      { reference: 'Jonah 1:17; Matthew 12:40', description: 'Jonah three days in fish', details: 'Swallowed, "resurrected" onto land on third day to complete mission' },
      { reference: 'Hosea 6:2', description: 'Israel restored on third day', details: '"After two days he will revive us; on the third day he will raise us up"' },
      { reference: 'Matthew 16:21; 1 Corinthians 15:4', description: 'Jesus raised on third day', details: 'Crucified, buried, rose on the third day according to the Scriptures' },
      { reference: 'John 2:1', description: 'Wedding at Cana on third day', details: 'First miracle (turning water to wine) signals new creation on "third day"' }
    ],
    theologicalInsight: "Third day is God's resurrection signature—death is never permanent when God intervenes. The pattern builds expectation for THE resurrection.",
    christConnection: "Every third-day deliverance in Scripture points forward to Christ's literal resurrection—the foundation of our faith."
  },
  {
    id: 'barren-woman-bears',
    name: 'Barren Woman Bears',
    structure: 'Woman unable to conceive → cries to God → miraculous birth → child of destiny',
    category: 'provision',
    instances: [
      { reference: 'Genesis 18:10-14; 21:1-7', description: 'Sarah bears Isaac', details: 'Barren for 90 years, laughed at promise, gave birth to child of covenant' },
      { reference: 'Genesis 25:21', description: 'Rebekah bears Jacob and Esau', details: 'Isaac prayed for barren wife; she conceived twins' },
      { reference: 'Genesis 29:31; 30:22-24', description: 'Rachel bears Joseph', details: 'Long barren while Leah had many sons; finally gave birth to Joseph and Benjamin' },
      { reference: '1 Samuel 1:1-20', description: 'Hannah bears Samuel', details: 'Wept bitterly, vowed to God, gave birth to prophet-judge Samuel' },
      { reference: 'Luke 1:7-25', description: 'Elizabeth bears John the Baptist', details: 'Barren in old age, received angelic announcement, gave birth to forerunner' }
    ],
    theologicalInsight: "Impossibility meets divine power. God specializes in opening closed wombs—and closed hearts. The natural order bows to supernatural intervention.",
    christConnection: "The ultimate 'impossible' birth: a virgin conceives. Mary's pregnancy is the climax of all barren-woman-births—God doing what only He can do."
  },
  {
    id: 'betrayal-to-enthronement',
    name: 'Betrayal to Enthronement',
    structure: 'Favored one betrayed by close associates → suffers unjustly → exalted to save those who rejected',
    category: 'deliverance',
    instances: [
      { reference: 'Genesis 37-41', description: 'Joseph betrayed then exalted', details: 'Sold by brothers for silver, falsely accused, imprisoned, then made second in Egypt' },
      { reference: '1 Samuel 18-2 Samuel 5', description: 'David betrayed then crowned', details: 'Saul turned against him, forced to flee, finally crowned king over all Israel' },
      { reference: 'Matthew 26-28; Philippians 2:8-11', description: 'Jesus betrayed then glorified', details: 'Betrayed by Judas, denied by Peter, abandoned by all, now every knee bows' },
      { reference: 'Daniel 6', description: 'Daniel betrayed then promoted', details: 'Colleagues conspired against him, thrown to lions, emerged unharmed and exalted' }
    ],
    theologicalInsight: "Suffering at the hands of intimates is part of the path to glory. God uses betrayal as the doorway to higher purpose.",
    christConnection: "Christ's betrayal-to-glory pattern is THE template—what men meant for evil, God meant for salvation."
  },
  {
    id: 'remnant-preserved',
    name: 'Remnant Preserved',
    structure: "Judgment falls on majority → faithful few preserved → through remnant, God continues His plan",
    category: 'judgment',
    instances: [
      { reference: 'Genesis 6-8', description: "Noah's family preserved", details: 'Only 8 people saved from the flood; through them humanity continues' },
      { reference: 'Genesis 19:15-29', description: "Lot's family preserved", details: 'Sodom destroyed; Lot and daughters rescued' },
      { reference: '1 Kings 19:18', description: "Elijah's 7,000 preserved", details: 'Elijah thought he was alone; 7,000 had not bowed to Baal' },
      { reference: 'Isaiah 1:9; 10:20-22', description: 'Remnant of Israel preserved', details: 'After Assyrian/Babylonian judgment, a remnant returns' },
      { reference: 'Romans 11:5', description: 'Remnant according to grace', details: 'Even now, a remnant chosen by grace while others are hardened' }
    ],
    theologicalInsight: "God always preserves a faithful few through judgment. The remnant carries the seed of promise forward.",
    christConnection: 'Christ is the ultimate Remnant—the faithful "Israel" who perfectly obeyed. Through Him, the true remnant (the church) is preserved.'
  },
  {
    id: 'water-crisis-provision',
    name: 'Water Crisis & Provision',
    structure: 'Desperate need for water → cry to God → miraculous provision through unlikely means',
    category: 'provision',
    instances: [
      { reference: 'Exodus 14:21-22', description: 'Red Sea divided', details: 'Waters parted, Israel walks through on dry ground' },
      { reference: 'Exodus 15:22-25', description: 'Bitter water made sweet', details: 'Marah waters bitter; tree makes them drinkable' },
      { reference: 'Exodus 17:1-7', description: 'Water from the rock', details: 'Moses strikes rock at Horeb; water flows for the people' },
      { reference: 'Joshua 3:14-17', description: 'Jordan River divided', details: 'At flood stage, waters heap up; Israel crosses into Canaan' },
      { reference: '2 Kings 2:19-22', description: 'Elisha heals Jericho waters', details: 'Throws salt in spring; waters purified permanently' },
      { reference: 'Matthew 14:25', description: 'Jesus walks on water', details: 'Water that threatened the disciples becomes the path for Christ' }
    ],
    theologicalInsight: "Water represents both danger and life. Faith is demonstrated at the water's edge—God turns threats into pathways.",
    christConnection: 'Christ walks on water, commands storms, and provides living water. He is master of what we fear most.'
  },
  {
    id: 'mountain-encounter',
    name: 'Mountain Encounters',
    structure: 'Person ascends mountain → meets God → receives revelation or commission → descends transformed',
    category: 'encounter',
    instances: [
      { reference: 'Genesis 22', description: 'Mount Moriah (Abraham)', details: 'Abraham offers Isaac; receives revelation of the providing God' },
      { reference: 'Exodus 19-24', description: 'Mount Sinai (Moses)', details: 'Moses ascends, receives the Law, face shines with glory' },
      { reference: '1 Kings 18:20-40', description: 'Mount Carmel (Elijah)', details: 'Elijah confronts prophets of Baal; fire falls; God vindicated' },
      { reference: '1 Kings 19:8-18', description: 'Mount Horeb (Elijah)', details: 'Elijah hears still small voice; receives new commission' },
      { reference: 'Matthew 17:1-8', description: 'Mount of Transfiguration', details: 'Jesus transfigured before Peter, James, John; voice from cloud' },
      { reference: 'Matthew 28:16-20', description: 'Mountain in Galilee (Disciples)', details: 'Risen Christ commissions disciples; Great Commission given' }
    ],
    theologicalInsight: "Mountains are God's meeting places—where heaven touches earth and mortals receive divine revelation.",
    christConnection: "Christ IS the meeting place between God and humanity. The Transfiguration mountain reveals His glory; the mount of commission launches His kingdom."
  },
  {
    id: 'seven-day-completion',
    name: 'Seven-Day Completion',
    structure: 'Task or journey spans seven days → completion/rest/victory on seventh day',
    category: 'covenant',
    instances: [
      { reference: 'Genesis 1-2:3', description: 'Creation week', details: 'Six days of work, seventh day of rest and blessing' },
      { reference: 'Joshua 6:1-20', description: 'Jericho falls on seventh day', details: 'March around city once daily for six days; seven times on seventh day—walls fall' },
      { reference: 'Leviticus 23:34-36', description: 'Feast of Tabernacles', details: 'Seven days dwelling in booths; eighth day is sacred assembly' },
      { reference: '2 Kings 5:10-14', description: 'Naaman dips seven times', details: 'Dips in Jordan seven times; cleansed on seventh' }
    ],
    theologicalInsight: "Seven signifies divine completion and covenant rest. God works in \"sevens\" to mark His perfect timing.",
    christConnection: 'Christ brings the ultimate Sabbath rest—the seventh day points to eternal rest in Him (Hebrews 4:9-10).'
  },
  {
    id: 'exile-return',
    name: 'Exile and Return',
    structure: "Sin leads to exile/displacement → suffering in foreign land → repentance → God brings home",
    category: 'judgment',
    instances: [
      { reference: 'Genesis 3:23-24', description: 'Adam and Eve exiled from Eden', details: 'Sin leads to expulsion from paradise; cherubim guard return' },
      { reference: 'Genesis 28-31', description: 'Jacob exiled then returns', details: 'Flees from Esau, labors in Haran, returns to promised land' },
      { reference: 'Exodus 1-15', description: 'Israel in Egypt, then Exodus', details: 'Slavery in Egypt; God delivers and brings them toward Canaan' },
      { reference: '2 Kings 25; Ezra 1', description: 'Judah exiled to Babylon then returns', details: '70-year captivity; Cyrus decrees return' },
      { reference: 'Luke 15:11-24', description: 'Prodigal Son returns', details: 'Leaves home, squanders inheritance, returns and is welcomed' }
    ],
    theologicalInsight: "Sin always leads to exile—separation from God's presence. But God always makes a way home for the repentant.",
    christConnection: "Christ is the way home. He brings us back from exile (sin) into the Father's house. The ultimate return is the New Jerusalem."
  },
  {
    id: 'firstborn-redemption',
    name: 'Firstborn Redemption',
    structure: 'Firstborn is set apart/endangered → substitution required → redemption through blood/price',
    category: 'covenant',
    instances: [
      { reference: 'Exodus 11-12', description: 'Firstborn in Egypt', details: "Egyptian firstborn die; Israelite firstborn covered by lamb's blood" },
      { reference: 'Exodus 13:13-15', description: 'Firstborn redemption law', details: 'Every firstborn belongs to God; must be redeemed with blood or broken neck' },
      { reference: 'Genesis 22', description: 'Isaac (firstborn of promise)', details: 'Isaac bound on altar; ram substitutes' },
      { reference: 'Luke 2:22-24', description: 'Jesus presented as firstborn', details: 'Mary and Joseph redeem Jesus with sacrifice as Law required' }
    ],
    theologicalInsight: 'The firstborn represents the whole. Firstborn redemption teaches that we all need a substitute.',
    christConnection: 'Christ is "firstborn of all creation" (Col 1:15) and "firstborn among many brethren" (Rom 8:29). He was NOT redeemed—He IS the Redeemer.'
  },
  {
    id: 'divine-wrestling',
    name: 'Divine Wrestling',
    structure: 'Person strives with God → refuses to let go → emerges changed/renamed → blessing through brokenness',
    category: 'encounter',
    instances: [
      { reference: 'Genesis 32:22-32', description: 'Jacob wrestles at Peniel', details: 'All-night wrestling; hip dislocated; renamed Israel ("wrestles with God")' },
      { reference: 'Exodus 4:24-26', description: 'Moses encounters God at lodging place', details: 'God seeks to kill Moses; Zipporah circumcises son' },
      { reference: 'Job 38-42', description: 'Job contends with God', details: 'Job questions God through suffering; God answers; Job repents in dust' },
      { reference: 'Luke 22:41-44', description: 'Jesus in Gethsemane', details: 'Struggles with the cup; sweats blood; submits: "Not my will, but yours"' }
    ],
    theologicalInsight: "Wrestling with God is not sin—it's intimacy. God allows the struggle so we emerge transformed.",
    christConnection: 'Christ wrestled with the cup in Gethsemane and emerged victorious through submission—our model for surrendered wrestling.'
  }
];

// ============================================
// PROPHETS' THEME PATTERN
// ============================================

export interface ProphetTheme {
  prophet: string;
  keyTheme: string;
  category: 'major' | 'minor';
}

export const prophetsTheme: ProphetTheme[] = [
  // Major Prophets
  { prophet: 'Isaiah', keyTheme: 'Earth broken, prisoners gathered, new heavens and earth', category: 'major' },
  { prophet: 'Jeremiah', keyTheme: 'Earth without form and void, cities broken down', category: 'major' },
  { prophet: 'Lamentations', keyTheme: 'Weeping for the desolation', category: 'major' },
  { prophet: 'Ezekiel', keyTheme: 'New Jerusalem described (ch. 40-48)', category: 'major' },
  { prophet: 'Daniel', keyTheme: 'Kingdom that shall not be destroyed', category: 'major' },
  // Minor Prophets
  { prophet: 'Hosea', keyTheme: 'Adulterous wife redeemed', category: 'minor' },
  { prophet: 'Joel', keyTheme: 'Reason for judgments, restoration after', category: 'minor' },
  { prophet: 'Amos', keyTheme: 'Day of Judgment, restoration afterward', category: 'minor' },
  { prophet: 'Obadiah', keyTheme: "Justice of God's judgment on persecutors", category: 'minor' },
  { prophet: 'Jonah', keyTheme: 'God saves even those we question', category: 'minor' },
  { prophet: 'Micah', keyTheme: 'Age of great peace', category: 'minor' },
  { prophet: 'Nahum', keyTheme: 'Fall of enemy', category: 'minor' },
  { prophet: 'Habakkuk', keyTheme: "God's justice in judgment", category: 'minor' },
  { prophet: 'Zephaniah', keyTheme: 'Day of the Lord near, all destroyed', category: 'minor' },
  { prophet: 'Haggai', keyTheme: 'Restored temple', category: 'minor' },
  { prophet: 'Zechariah', keyTheme: 'Restored temple, feet on Olivet', category: 'minor' },
  { prophet: 'Malachi', keyTheme: 'Destruction of wicked by fire', category: 'minor' }
];

// ============================================
// POETIC BOOKS' THEME PATTERN
// ============================================

export interface PoeticBookTheme {
  book: string;
  theme: string;
}

export const poeticBooksTheme: PoeticBookTheme[] = [
  { book: 'Job', theme: 'Time of Trouble: "Consider my servant"' },
  { book: 'Psalms', theme: 'Deliverance from enemies (David in wilderness, fleeing)' },
  { book: 'Proverbs', theme: 'Wisdom for end-time: foolish vs. wise, strange woman vs. virtuous woman' },
  { book: 'Ecclesiastes', theme: 'Wisdom for end-time: Fear God, keep commandments' },
  { book: 'Song of Solomon', theme: 'Husband coming for His Bride' }
];

// ============================================
// 46 STRUCTURAL PATTERN BOOKS
// ============================================

export interface BookPattern {
  number: number;
  book: string;
  patternName: string;
  testament: 'OT' | 'NT';
}

export const otBookPatterns: BookPattern[] = [
  { number: 1, book: 'Genesis', patternName: 'Blueprint of Redemption History', testament: 'OT' },
  { number: 2, book: 'Exodus', patternName: 'Blueprint of Deliverance', testament: 'OT' },
  { number: 3, book: 'Leviticus', patternName: 'Blueprint of Sanctification', testament: 'OT' },
  { number: 4, book: 'Numbers', patternName: 'Blueprint of the Journey', testament: 'OT' },
  { number: 5, book: 'Deuteronomy', patternName: 'Blueprint of Final Words', testament: 'OT' },
  { number: 6, book: 'Joshua', patternName: 'Blueprint of Conquest', testament: 'OT' },
  { number: 7, book: 'Judges', patternName: 'Blueprint of Apostasy', testament: 'OT' },
  { number: 8, book: 'Ruth', patternName: 'Blueprint of Kinsman Redemption', testament: 'OT' },
  { number: 9, book: '1 Samuel', patternName: 'Blueprint of Kingdom Transition', testament: 'OT' },
  { number: 10, book: '2 Samuel', patternName: 'Blueprint of United Kingdom', testament: 'OT' },
  { number: 11, book: '1 Kings', patternName: 'Blueprint of Glory and Apostasy', testament: 'OT' },
  { number: 12, book: '2 Kings', patternName: 'Blueprint of Destruction and Resurrection', testament: 'OT' },
  { number: 13, book: '1 Chronicles', patternName: 'Blueprint of Sacred Genealogy', testament: 'OT' },
  { number: 14, book: '2 Chronicles', patternName: 'Blueprint of Temple and Apostasy', testament: 'OT' },
  { number: 15, book: 'Ezra', patternName: 'Blueprint of Restoration (Three Decrees)', testament: 'OT' },
  { number: 16, book: 'Nehemiah', patternName: 'Blueprint of Reformation (Fourth Decree)', testament: 'OT' },
  { number: 17, book: 'Esther', patternName: 'Blueprint of End-Time Deliverance', testament: 'OT' },
  { number: 18, book: 'Job', patternName: 'Blueprint of Vindication', testament: 'OT' },
  { number: 19, book: 'Psalms', patternName: 'Blueprint of Worship Through Redemption', testament: 'OT' },
  { number: 20, book: 'Proverbs', patternName: "Blueprint of Wisdom's Call", testament: 'OT' },
  { number: 21, book: 'Ecclesiastes', patternName: "Blueprint of Life's Meaning", testament: 'OT' },
  { number: 22, book: 'Song of Solomon', patternName: 'Blueprint of Divine Romance', testament: 'OT' },
  { number: 23, book: 'Isaiah', patternName: 'Blueprint of Messianic Prophecy (Master Pattern)', testament: 'OT' },
  { number: 24, book: 'Jeremiah', patternName: 'Blueprint of Prophetic Persecution', testament: 'OT' },
  { number: 25, book: 'Lamentations', patternName: 'Blueprint of Holy Grief', testament: 'OT' },
  { number: 26, book: 'Ezekiel', patternName: 'Blueprint of Glory Departing/Returning', testament: 'OT' },
  { number: 27, book: 'Daniel', patternName: 'Blueprint of Prophetic History', testament: 'OT' },
  { number: 28, book: 'Hosea', patternName: 'Blueprint of Divine Love', testament: 'OT' },
  { number: 29, book: 'Joel', patternName: "Blueprint of the Spirit's Outpouring", testament: 'OT' },
  { number: 30, book: 'Amos', patternName: 'Blueprint of Judgment and Remnant', testament: 'OT' },
  { number: 31, book: 'Obadiah', patternName: 'Blueprint of Justice Against Persecutors', testament: 'OT' },
  { number: 32, book: 'Jonah', patternName: 'Blueprint of Reluctant Mission', testament: 'OT' },
  { number: 33, book: 'Micah', patternName: 'Blueprint of Judgment Unto Hope', testament: 'OT' },
  { number: 34, book: 'Nahum', patternName: "Blueprint of Babylon's Fall", testament: 'OT' },
  { number: 35, book: 'Habakkuk', patternName: 'Blueprint of Waiting for Glory', testament: 'OT' },
  { number: 36, book: 'Zephaniah', patternName: 'Blueprint of the Day of the Lord', testament: 'OT' },
  { number: 37, book: 'Haggai', patternName: 'Blueprint of Temple Building', testament: 'OT' },
  { number: 38, book: 'Zechariah', patternName: 'Blueprint of Messianic Victory', testament: 'OT' },
  { number: 39, book: 'Malachi', patternName: 'Blueprint of the Three Angels', testament: 'OT' }
];

export const ntBookPatterns: BookPattern[] = [
  { number: 1, book: 'Matthew', patternName: 'Blueprint of the King', testament: 'NT' },
  { number: 2, book: 'Mark', patternName: 'Blueprint of the Servant', testament: 'NT' },
  { number: 3, book: 'Luke', patternName: 'Blueprint of the Son of Man', testament: 'NT' },
  { number: 4, book: 'John', patternName: 'Blueprint of the Son of God', testament: 'NT' },
  { number: 5, book: 'Acts', patternName: 'Blueprint of Spirit-Empowered Church', testament: 'NT' },
  { number: 6, book: 'Hebrews', patternName: "Blueprint of Christ's Superior Priesthood", testament: 'NT' },
  { number: 7, book: 'Revelation', patternName: 'Blueprint of End-Time Victory', testament: 'NT' }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getPatternsByCategory = (category: PatternCategory) => {
  return patternsLibrary.filter(pattern => pattern.category === category);
};

export const searchPatterns = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return patternsLibrary.filter(pattern =>
    pattern.name.toLowerCase().includes(lowerQuery) ||
    pattern.structure.toLowerCase().includes(lowerQuery) ||
    pattern.theologicalInsight.toLowerCase().includes(lowerQuery) ||
    pattern.instances.some(inst =>
      inst.description.toLowerCase().includes(lowerQuery) ||
      inst.reference.toLowerCase().includes(lowerQuery)
    )
  );
};

export const getRandomPattern = () => {
  return patternsLibrary[Math.floor(Math.random() * patternsLibrary.length)];
};

export const getAllCategories = (): PatternCategory[] => {
  return [...new Set(patternsLibrary.map(p => p.category))];
};

// Get all course patterns
export const getAllCoursePatterns = (): CoursePattern[] => {
  return [watersCourse, mountainsCourse, treesCourse];
};

// Get course pattern by ID
export const getCoursePatternById = (id: string): CoursePattern | undefined => {
  return getAllCoursePatterns().find(c => c.id === id);
};

// Get all multi-book patterns summary
export const getMultiBookPatternsSummary = () => {
  return [
    { pattern: 'Waters Course', books: 'Genesis through Revelation', elements: '12+ bodies of water tracing salvation history' },
    { pattern: 'Mountains Course', books: 'Genesis through Revelation', elements: '12+ mountains marking God-encounters' },
    { pattern: 'Trees Course', books: 'Genesis through Revelation', elements: 'Trees from Eden to New Jerusalem' },
    { pattern: 'Feasts Course', books: 'Leviticus 23 + NT', elements: '7 feasts fulfilled in Christ' },
    { pattern: 'Sanctuary Course', books: 'Exodus, Leviticus, Hebrews, Revelation', elements: "Furniture tracing believer's journey" },
    { pattern: 'Four Decrees', books: 'Ezra, Nehemiah', elements: 'Four decrees to restore, paralleling end-time' },
    { pattern: 'Creation Week', books: 'Genesis 1-2 + all history', elements: "7 days as history's blueprint" },
    { pattern: 'OT Offices', books: 'Historical/Prophetic books', elements: 'Prophet, Priest, Judge, King' },
    { pattern: 'Repeat and Enlarge', books: 'Daniel', elements: 'Visions that repeat with more detail' },
    { pattern: 'Seven Churches', books: 'Revelation 2-3 + Church history', elements: 'Churches parallel history' },
    { pattern: 'Time Prophecies', books: 'Daniel, Revelation', elements: '70 Weeks, 1260, 2300 structure' },
    { pattern: 'Cyrus/Christ', books: 'Isaiah 44-45, Daniel 5, Ezra', elements: 'Cyrus as type of Christ' },
    { pattern: 'Christ in Every Book', books: 'All 66 books', elements: 'Christ revealed from Genesis to Revelation' }
  ];
};

// ============================================
// CHRIST IN EVERY BOOK - The Story Arc Through the Bible
// "Beginning at Moses and all the prophets, He expounded unto them in all the scriptures the things concerning Himself." — Luke 24:27
// ============================================

export interface ChristInBook {
  book: string;
  section: 'pentateuch' | 'historical' | 'restoration' | 'wisdom' | 'major-prophets' | 'minor-prophets' | 'gospels' | 'acts' | 'epistles' | 'revelation';
  christTitle: string;
  pattern: string;
  fulfillment: string;
  keyTexts: string[];
  propheticApplication?: string;
}

// THE PENTATEUCH: The Life of Christ Foreshadowed
export const pentateuchChrist: ChristInBook[] = [
  {
    book: 'Genesis',
    section: 'pentateuch',
    christTitle: 'The Second Adam',
    pattern: 'Adam was created from dust, given dominion, placed in a garden. Adam faced temptation, fell, and brought death. God promised a "Seed" who would crush the serpent\'s head (Genesis 3:15).',
    fulfillment: 'Christ is the "last Adam" (1 Cor 15:45). Where Adam failed in a perfect garden, Christ overcame in a wilderness. Where Adam\'s disobedience brought death, Christ\'s obedience brings life. Christ is the promised Seed who crushes Satan.',
    keyTexts: ['Genesis 1:26-28', 'Genesis 3:15', 'Romans 5:12-21', '1 Corinthians 15:22, 45-49']
  },
  {
    book: 'Exodus',
    section: 'pentateuch',
    christTitle: 'Drawn from Waters, Wilderness, Deliverer',
    pattern: 'Moses: name means "drawn out of water," fled to wilderness 40 years, returned to deliver God\'s people from bondage, led through Red Sea (baptism into freedom), gave law on mountain.',
    fulfillment: 'Christ: baptized in Jordan ("drawn from waters"), led into wilderness 40 days of testing, came to deliver from bondage of sin, leads through baptism into new life, gave law\'s true meaning (Sermon on the Mount).',
    keyTexts: ['Exodus 2:10', 'Exodus 3:1-10', 'Matthew 3:13-17', 'Matthew 4:1-11', 'Acts 7:35-37']
  },
  {
    book: 'Leviticus',
    section: 'pentateuch',
    christTitle: 'The Priestly Work Begins',
    pattern: 'The sacrificial system established. Day of Atonement—cleansing the sanctuary. High Priest entering Most Holy Place. Blood required for remission of sins.',
    fulfillment: 'Christ is both Lamb and High Priest. He offered Himself once for all (Heb 9:12). He entered heavenly sanctuary with His own blood. He now ministers in Most Holy Place. Day of Atonement points to final judgment and cleansing.',
    keyTexts: ['Leviticus 16', 'Leviticus 17:11', 'Hebrews 4:14-16', 'Hebrews 7:26-27', 'Hebrews 9:11-14, 24-28']
  },
  {
    book: 'Numbers',
    section: 'pentateuch',
    christTitle: 'Leading the Twelve, Ordaining the Seventy',
    pattern: 'Twelve tribes organized for journey. Seventy elders appointed (Numbers 11:16-17). Wilderness wanderings—testing and provision. Bronze serpent lifted up for healing (Numbers 21:8-9).',
    fulfillment: 'Christ chose twelve apostles to lead new Israel. Appointed seventy others (Luke 10:1). Leads His people through wilderness of this world. Was "lifted up" on cross that all who look may live (John 3:14-15).',
    keyTexts: ['Numbers 11:16-17', 'Numbers 21:8-9', 'Matthew 10:1-4', 'Luke 10:1-2', 'John 3:14-15']
  },
  {
    book: 'Deuteronomy',
    section: 'pentateuch',
    christTitle: 'Final Words, the Song, Dies Alone',
    pattern: 'Moses gave final words before Promised Land. Recounted God\'s faithfulness. Sang prophetic song (Deut 32). Went up mountain alone to die. Buried by God—no one knows where.',
    fulfillment: 'Christ gave final words (John 14-17, Upper Room). Recounted God\'s love. Sang hymn before Gethsemane (Matt 26:30). Went to Calvary—ultimately alone, forsaken. Buried in tomb, but rose again.',
    keyTexts: ['Deuteronomy 31-34', 'Matthew 26:30', 'John 13-17', 'Mark 15:34']
  }
];

// THE HISTORICAL BOOKS: The Church's Journey
export const historicalChrist: ChristInBook[] = [
  {
    book: 'Joshua',
    section: 'historical',
    christTitle: 'The Final Battle, Opening the Promised Land',
    pattern: 'Joshua (Yeshua/Jesus) leads Israel into Promised Land. Crosses Jordan—second "Red Sea" experience. Jericho falls with shout and trumpets. Land divided as inheritance.',
    fulfillment: 'Jesus (same name as Joshua) leads people to heavenly Canaan. We pass through baptism into new life. Satan\'s kingdom falls with shout at Christ\'s return (1 Thess 4:16). We receive inheritance—eternal life.',
    keyTexts: ['Joshua 1:1-9', 'Joshua 6:1-20', '1 Thessalonians 4:16-17', '1 Corinthians 15:54-57', 'Hebrews 4:8-9']
  },
  {
    book: 'Judges',
    section: 'historical',
    christTitle: 'The Church Advances, Conquering',
    pattern: 'Cycles of apostasy, oppression, crying out, deliverance. God raises up judges (deliverers) in crises. Each judge partial, flawed, temporary. Refrain: "Everyone did what was right in his own eyes."',
    fulfillment: 'Christ is perfect, final Judge/Deliverer. He breaks cycle of sin permanently. Where human deliverers failed, Christ succeeds. He establishes kingdom of righteousness.',
    keyTexts: ['Judges 2:16-19', 'Judges 21:25', 'Acts 13:20-23', '2 Timothy 3:1-5'],
    propheticApplication: 'Church experiences cycles of revival and apostasy. God raises reformers in every age. All point to final deliverance.'
  },
  {
    book: 'Ruth',
    section: 'historical',
    christTitle: 'The Gentile Woman Working in the Field',
    pattern: 'Ruth the Moabitess—Gentile outsider. Leaves homeland to follow God. Works in harvest field of Boaz. Boaz becomes kinsman-redeemer. Grafted into lineage of David and Christ.',
    fulfillment: 'Christ is ultimate Kinsman-Redeemer. Redeems both Jew and Gentile. Gentiles grafted into Israel (Romans 11). Church is Bride, working in harvest field. Christ owns field, invites all.',
    keyTexts: ['Ruth 2-4', 'Romans 11:17-24', 'Matthew 9:37-38', 'Matthew 13:38', 'Revelation 19:7-9'],
    propheticApplication: 'Harvest field is the world. Church labors until Bridegroom comes. Gentile believers become covenant family.'
  },
  {
    book: '1 Samuel - 2 Chronicles',
    section: 'historical',
    christTitle: 'Division, Civil War, Captivity',
    pattern: 'United kingdom under Saul, David, Solomon. Division into Northern (Israel) and Southern (Judah). Progressive apostasy despite prophetic warnings. Captivity: Israel to Assyria (722 BC), Judah to Babylon (586 BC). 70 years captivity, then restoration.',
    fulfillment: 'David is great type of Christ—shepherd, king, warrior. Solomon\'s temple foreshadows Christ\'s body (John 2:19-21). Division reflects division in church. Captivity foreshadows 1,260-year papal supremacy. Christ comes to reunite and restore.',
    keyTexts: ['1 Kings 11-12', '2 Chronicles 36:15-21', 'Daniel 9:2', 'Revelation 17-18'],
    propheticApplication: 'Early church united under apostolic leadership. Division and apostasy enter. Spiritual "Babylon" holds captive. Remnant preserved through dark ages. Reformation and restoration begin.'
  }
];

// THE RESTORATION: Rebuilding What Was Lost
export const restorationChrist: ChristInBook[] = [
  {
    book: 'Ezra',
    section: 'restoration',
    christTitle: 'Restoration of the Sanctuary and Worship',
    pattern: 'First return under Zerubbabel—rebuild temple (536 BC). Second return under Ezra—restore worship and law (457 BC). Opposition from enemies, work continues. Focus: sanctuary and law of God.',
    fulfillment: 'Christ is true Temple (John 2:19-21). Restores true worship "in spirit and truth" (John 4:23-24). Magnifies law and makes it honorable (Isaiah 42:21).',
    keyTexts: ['Ezra 1:1-3', 'Ezra 6:14-15', 'Ezra 7:10', 'Daniel 8:14', 'Hebrews 8:1-2'],
    propheticApplication: 'First Angel\'s Message (1840s)—attention to sanctuary. 2,300 days prophecy. Restoration of sanctuary truth—heavenly ministry of Christ. Restoration of law including fourth commandment.'
  },
  {
    book: 'Nehemiah',
    section: 'restoration',
    christTitle: 'Rebuilding the Walls and the Street',
    pattern: 'Fourth decree (445 BC)—rebuild walls and streets. Nehemiah leads focused, urgent work. Fierce opposition unsuccessful. Work completed in 52 days through unity. Sabbath reform central (Nehemiah 13:15-22). "No more a reproach."',
    fulfillment: 'Christ came to "repair the breach" and "restore the paths" (Isaiah 58:12). He is true wall of protection (Zechariah 2:5). He is the Way—the street, the path (John 14:6).',
    keyTexts: ['Nehemiah 2:17', 'Nehemiah 6:1-3', 'Nehemiah 13:15-22', 'Isaiah 58:12-14', 'Daniel 9:25', 'Revelation 18:1-4'],
    propheticApplication: 'The Fourth Angel\'s Message (Rev 18:1). Repairing the breach—Sabbath reform, seal of God. Restoring the street—clear gospel proclamation. United, orchestrated effort. Preparing the way for Messiah\'s return.'
  },
  {
    book: 'Esther',
    section: 'restoration',
    christTitle: 'The Death Decree and Deliverance',
    pattern: 'Haman exalted—seat above all others. Mordecai refuses to bow—faithfulness to God alone. Haman\'s rage against God\'s people. Death decree issued. Esther: "If I perish, I perish." God reverses decree—deliverance.',
    fulfillment: 'Haman is type of Satan—exalted, demanding worship. Mordecai represents faithful believers who will not bow. Christ faced ultimate death decree and overcame. Esther is type of church—interceding for her people.',
    keyTexts: ['Esther 3-8', 'Revelation 12:17', 'Revelation 13:15-17', 'Revelation 14:12'],
    propheticApplication: 'This cannot happen until Nehemiah is complete. Satan rises against prepared people. Death decree/Sunday law. God\'s people refuse to bow to beast. Esther\'s courage—church\'s final testimony. Divine deliverance at darkest hour.'
  }
];

// WISDOM BOOKS: Songs of the Wilderness
export const wisdomChrist: ChristInBook[] = [
  {
    book: 'Job',
    section: 'wisdom',
    christTitle: 'The Time of Trouble: "Consider My Servant"',
    pattern: 'Satan accuses Job before God. God permits testing: "Have you considered my servant Job?" Job loses everything. Friends accuse and misunderstand. Job maintains integrity: "Though He slay me, yet will I trust Him." God vindicates and restores double.',
    fulfillment: 'Christ tested in every way, yet without sin. Accused, forsaken, misunderstood. Maintained perfect trust: "Not my will, but Yours." God vindicated through resurrection.',
    keyTexts: ['Job 1:8', 'Job 13:15', 'Job 19:25-27', 'Job 42:10-17', 'Jeremiah 30:7', 'Revelation 3:4-5', 'Revelation 14:1-5'],
    propheticApplication: 'Time of Jacob\'s trouble. Satan accuses remnant before God. God permits final testing—144,000 proven faithful. "These are they who have not defiled their garments." Divine vindication at Christ\'s coming.'
  },
  {
    book: 'Psalms',
    section: 'wisdom',
    christTitle: 'Deliverance from Enemies',
    pattern: 'David composed many psalms while fleeing in wilderness. Full range of human experience—guilt, fear, praise, hope. Messianic psalms foretell Christ\'s suffering and glory. Songs of deliverance for those surrounded by enemies.',
    fulfillment: 'Jesus quoted Psalms on cross (Psalm 22:1, 31:5). Psalms prophesy His betrayal, suffering, resurrection, ascension. Christ is true Shepherd (Psalm 23), King (Psalm 2), Priest (Psalm 110).',
    keyTexts: ['Psalm 2', 'Psalm 22', 'Psalm 23', 'Psalm 31', 'Psalm 46', 'Psalm 91', 'Psalm 110', 'Revelation 14:3', 'Revelation 15:3'],
    propheticApplication: 'Songs for wilderness experience of God\'s people. Remnant will sing during time of trouble. Songs of deliverance when surrounded. The "new song" of 144,000.'
  },
  {
    book: 'Proverbs & Ecclesiastes',
    section: 'wisdom',
    christTitle: 'Wisdom for the End Time',
    pattern: 'Wisdom vs. Folly personified as two women. "Strange woman" who leads astray. Virtuous woman of Proverbs 31—faithful, industrious, prepared. Ecclesiastes: "Fear God and keep His commandments."',
    fulfillment: 'Christ is Wisdom of God (1 Cor 1:24, 30). He is Bridegroom seeking faithful bride. He separates wise from foolish.',
    keyTexts: ['Proverbs 7-9', 'Proverbs 31:10-31', 'Ecclesiastes 12:13-14', 'Matthew 25:1-13', 'Revelation 14:7', 'Revelation 17-18'],
    propheticApplication: 'Two women: Babylon (harlot) vs. true church (bride). Wise and foolish virgins. End-time wisdom: discerning truth from deception. Final choice: "Fear God and give glory to Him."'
  },
  {
    book: 'Song of Solomon',
    section: 'wisdom',
    christTitle: 'The Bridegroom Coming for His Bride',
    pattern: 'Love story between King and Shulamite. Bride searches for beloved. Beloved comes, leaping over mountains. Wedding feast and consummation of love.',
    fulfillment: 'Christ is Bridegroom, church is Bride. Intimate love of Christ for His people. He is coming—"leaping over mountains" to claim bride.',
    keyTexts: ['Song of Solomon 2:8-13', 'Song of Solomon 8:6-7', 'Matthew 25:6', 'Revelation 19:7-9', 'Revelation 22:17, 20'],
    propheticApplication: 'Church longs for Christ\'s return: "Come, Lord Jesus." Midnight cry: "Behold, the Bridegroom comes!" Marriage supper of the Lamb. Union with Christ for eternity.'
  }
];

// MAJOR PROPHETS: Judgment and the Coming Kingdom
export const majorProphetsChrist: ChristInBook[] = [
  {
    book: 'Isaiah',
    section: 'major-prophets',
    christTitle: 'The Suffering Servant',
    pattern: 'The suffering Servant (Isaiah 53). Earth utterly broken, prisoners in pit (Isaiah 24:19-22). New heavens and new earth (Isaiah 65:17).',
    fulfillment: 'Christ is the Suffering Servant who bore our griefs and carried our sorrows. He was wounded for our transgressions. By His stripes we are healed.',
    keyTexts: ['Isaiah 24:19-22', 'Isaiah 53', 'Isaiah 65:17']
  },
  {
    book: 'Jeremiah',
    section: 'major-prophets',
    christTitle: 'The New Covenant',
    pattern: 'Warnings ignored, judgment falls. Earth "without form and void"—returned to chaos (Jeremiah 4:23-26). New covenant written on hearts (Jeremiah 31:31-34).',
    fulfillment: 'Christ establishes the new covenant in His blood. He writes the law on our hearts through the Holy Spirit.',
    keyTexts: ['Jeremiah 4:23-26', 'Jeremiah 31:31-34']
  },
  {
    book: 'Lamentations',
    section: 'major-prophets',
    christTitle: 'Weeping Over the Lost',
    pattern: 'Weeping over destruction of Jerusalem. A type of Christ weeping over the lost (Luke 19:41). Remnant\'s sorrow during millennium—understanding the cost.',
    fulfillment: 'Christ wept over Jerusalem: "How often I would have gathered your children together, as a hen gathers her brood under her wings, and you were not willing!"',
    keyTexts: ['Lamentations 1-5', 'Luke 19:41']
  },
  {
    book: 'Ezekiel',
    section: 'major-prophets',
    christTitle: 'The Glory Returns',
    pattern: 'Glory departs, then returns (Ezekiel 10-11, 43). Valley of dry bones—resurrection (Ezekiel 37). New Jerusalem described (Ezekiel 40-48).',
    fulfillment: 'Christ is the glory of God dwelling among us (John 1:14). He is the resurrection and the life. He prepares the New Jerusalem for His people.',
    keyTexts: ['Ezekiel 10-11', 'Ezekiel 37', 'Ezekiel 40-48', 'Ezekiel 43']
  },
  {
    book: 'Daniel',
    section: 'major-prophets',
    christTitle: 'The Stone Kingdom',
    pattern: 'Rise and fall of empires. Stone that becomes mountain—God\'s eternal kingdom (Daniel 2:44-45). Judgment scene—books opened (Daniel 7:9-14). 2,300 days and cleansing of sanctuary (Daniel 8:14).',
    fulfillment: 'Christ is the Stone cut without hands that becomes a great mountain filling the earth. He is the Son of Man who approaches the Ancient of Days to receive dominion.',
    keyTexts: ['Daniel 2:44', 'Daniel 7:9-14', 'Daniel 8:14']
  }
];

// MINOR PROPHETS: Justice, Judgment, and Restoration
export const minorProphetsChrist: ChristInBook[] = [
  { book: 'Hosea', section: 'minor-prophets', christTitle: 'The Faithful Husband', pattern: "God's love for adulterous people", fulfillment: "Christ's love for wayward church; final call to return", keyTexts: ['Hosea 1-3', 'Hosea 11:1'] },
  { book: 'Joel', section: 'minor-prophets', christTitle: 'The Spirit Giver', pattern: 'Day of the Lord; outpouring of Spirit', fulfillment: 'The latter rain; the great and terrible day', keyTexts: ['Joel 2:28-32'] },
  { book: 'Amos', section: 'minor-prophets', christTitle: 'The Righteous Judge', pattern: 'Justice and judgment coming', fulfillment: 'Social justice; the Day of Judgment', keyTexts: ['Amos 5:24', 'Amos 9:11-15'] },
  { book: 'Obadiah', section: 'minor-prophets', christTitle: 'The Vindicator', pattern: 'Justice against Edom (enemies of God\'s people)', fulfillment: 'God will vindicate His persecuted people', keyTexts: ['Obadiah 1:15-21'] },
  { book: 'Jonah', section: 'minor-prophets', christTitle: 'The Sign of Death and Resurrection', pattern: 'God saves even those we question', fulfillment: 'Gospel to all nations; no one beyond grace. Three days in fish = three days in tomb', keyTexts: ['Jonah 1:17', 'Matthew 12:40'] },
  { book: 'Micah', section: 'minor-prophets', christTitle: 'The Ruler from Bethlehem', pattern: 'Judgment, then age of peace', fulfillment: 'From Bethlehem comes the Ruler; the millennium', keyTexts: ['Micah 5:2', 'Micah 4:1-5'] },
  { book: 'Nahum', section: 'minor-prophets', christTitle: 'The Destroyer of Oppressors', pattern: 'Fall of Nineveh (oppressor)', fulfillment: 'Fall of spiritual Babylon', keyTexts: ['Nahum 1:7-8'] },
  { book: 'Habakkuk', section: 'minor-prophets', christTitle: 'The Object of Faith', pattern: '"The just shall live by faith"', fulfillment: 'Faith during time of trouble', keyTexts: ['Habakkuk 2:4', 'Habakkuk 3:17-19'] },
  { book: 'Zephaniah', section: 'minor-prophets', christTitle: 'The Mighty Warrior', pattern: 'Day of the Lord near; total destruction', fulfillment: 'Second coming; destruction of the wicked', keyTexts: ['Zephaniah 1:14-18', 'Zephaniah 3:17'] },
  { book: 'Haggai', section: 'minor-prophets', christTitle: 'The Desire of All Nations', pattern: 'Rebuild temple; latter glory greater', fulfillment: "Final temple—Christ's people filled with glory", keyTexts: ['Haggai 2:6-9'] },
  { book: 'Zechariah', section: 'minor-prophets', christTitle: 'The Returning King', pattern: 'The Branch; feet on Mount of Olives', fulfillment: "Christ's return to Mount of Olives (Acts 1:11)", keyTexts: ['Zechariah 14:4', 'Zechariah 9:9'] },
  { book: 'Malachi', section: 'minor-prophets', christTitle: 'The Sun of Righteousness', pattern: 'Sun of Righteousness; Elijah to come', fulfillment: 'Final Elijah message; destruction of wicked by fire', keyTexts: ['Malachi 4:1-6'] }
];

// NEW TESTAMENT: Christ Revealed and Present
export const gospelsChrist: ChristInBook[] = [
  { book: 'Matthew', section: 'gospels', christTitle: 'Christ the King', pattern: 'Fulfillment of prophecy, Davidic lineage', fulfillment: 'The rightful King of Israel and all creation', keyTexts: ['Matthew 1:1', 'Matthew 1:23', 'Matthew 5:17'] },
  { book: 'Mark', section: 'gospels', christTitle: 'Christ the Servant', pattern: 'Action and ministry, immediately serving', fulfillment: 'The Suffering Servant who came not to be served but to serve', keyTexts: ['Mark 10:45'] },
  { book: 'Luke', section: 'gospels', christTitle: 'Christ the Son of Man', pattern: 'Humanity and compassion', fulfillment: 'The perfect Man who identifies with all humanity', keyTexts: ['Luke 19:10'] },
  { book: 'John', section: 'gospels', christTitle: 'Christ the Son of God', pattern: 'Deity and eternal life', fulfillment: 'The Word made flesh, full of grace and truth', keyTexts: ['John 1:1-14', 'John 14:6', 'John 20:31'] }
];

export const actsChrist: ChristInBook = {
  book: 'Acts',
  section: 'acts',
  christTitle: 'The Spirit Baptizer',
  pattern: 'Pentecost: Spirit poured out (early rain). Tongues of fire—story finally understood. 3,000 baptized—church born. Gospel spreads: Jerusalem, Judea, Samaria, uttermost parts.',
  fulfillment: 'Christ baptizes with the Holy Spirit and fire. He empowers the church to be His witnesses.',
  keyTexts: ['Acts 1:8', 'Acts 2:1-4, 17-21', 'Revelation 18:1', 'Joel 2:28-32'],
  propheticApplication: 'What happened at Pentecost will happen again—latter rain. Revelation 18:1—earth illuminated with glory. Final proclamation to all nations. Spirit empowers Fourth Decree work. Church finishes the story.'
};

export const epistlesChrist: ChristInBook[] = [
  { book: 'Romans', section: 'epistles', christTitle: 'Our Righteousness', pattern: 'What new person in Christ looks like', fulfillment: 'Justified, sanctified, glorified in Christ', keyTexts: ['Romans 1:16-17', 'Romans 8:29'] },
  { book: '1-2 Corinthians', section: 'epistles', christTitle: 'Head of the Body', pattern: "Church functioning as Christ's body", fulfillment: 'We are members of His body, He is the Head', keyTexts: ['1 Corinthians 12:12-27'] },
  { book: 'Galatians', section: 'epistles', christTitle: 'Our Freedom', pattern: 'Freedom from legalism', fulfillment: 'Christ has set us free; fruit of the Spirit', keyTexts: ['Galatians 5:1', 'Galatians 5:22-23'] },
  { book: 'Ephesians', section: 'epistles', christTitle: 'Our Bridegroom', pattern: "Church as Christ's bride; spiritual warfare", fulfillment: 'Christ loved the church and gave Himself for her', keyTexts: ['Ephesians 5:25-27'] },
  { book: 'Philippians', section: 'epistles', christTitle: 'Our Joy', pattern: 'Joy and pressing toward prize', fulfillment: 'To live is Christ, to die is gain', keyTexts: ['Philippians 1:21', 'Philippians 3:14'] },
  { book: 'Colossians', section: 'epistles', christTitle: 'Our All in All', pattern: 'Christ preeminent in all things', fulfillment: 'In Him all fullness dwells; He is all and in all', keyTexts: ['Colossians 1:15-20'] },
  { book: '1-2 Thessalonians', section: 'epistles', christTitle: 'Our Coming King', pattern: 'Second coming and readiness', fulfillment: 'The Lord Himself will descend from heaven', keyTexts: ['1 Thessalonians 4:16-17'] },
  { book: '1-2 Timothy, Titus', section: 'epistles', christTitle: 'Our Sound Doctrine', pattern: 'Church order for last days', fulfillment: 'The pillar and ground of truth', keyTexts: ['1 Timothy 3:15', '2 Timothy 3:16-17'] },
  { book: 'Philemon', section: 'epistles', christTitle: 'Our Reconciler', pattern: 'Reconciliation and brotherhood', fulfillment: 'Christ reconciles us to God and one another', keyTexts: ['Philemon 1:15-16'] },
  { book: 'Hebrews', section: 'epistles', christTitle: 'Our High Priest', pattern: 'Superior High Priest in heavenly sanctuary', fulfillment: 'He ever lives to make intercession for us', keyTexts: ['Hebrews 4:14-16', 'Hebrews 8:1-2', 'Hebrews 9:24'] },
  { book: 'James', section: 'epistles', christTitle: 'Our Wisdom', pattern: 'Faith that works; practical Christianity', fulfillment: 'Faith without works is dead', keyTexts: ['James 1:5', 'James 2:17'] },
  { book: '1-2 Peter', section: 'epistles', christTitle: 'Our Shepherd', pattern: 'Suffering, hope, Day of the Lord', fulfillment: 'Chief Shepherd who will appear in glory', keyTexts: ['1 Peter 5:4', '2 Peter 3:10'] },
  { book: '1-3 John', section: 'epistles', christTitle: 'Our Love', pattern: 'Love, truth, overcoming antichrist', fulfillment: 'God is love; perfect love casts out fear', keyTexts: ['1 John 3:2-3', '1 John 4:8'] },
  { book: 'Jude', section: 'epistles', christTitle: 'Our Keeper', pattern: 'Contending for faith in apostasy', fulfillment: 'Able to keep us from falling', keyTexts: ['Jude 1:24-25'] }
];

export const revelationChrist: ChristInBook = {
  book: 'Revelation',
  section: 'revelation',
  christTitle: 'The Alpha and Omega',
  pattern: 'Ch 1-3: Christ among churches. Ch 4-5: Throne room, Lamb worthy. Ch 6-7: Seals, 144,000 sealed. Ch 8-11: Trumpets, mystery of God finished. Ch 12-14: Great controversy, three angels. Ch 15-16: Seven last plagues. Ch 17-18: Fall of Babylon. Ch 19: Marriage supper, King of Kings returns. Ch 20: Millennium, final judgment. Ch 21-22: New heaven and earth, God dwelling with people forever.',
  fulfillment: 'The story completed: Genesis began with creation—Revelation ends with re-creation. Genesis: tree of life lost—Revelation: tree of life restored. Genesis: sin enters—Revelation: sin ends forever. Genesis: "Where are you?"—Revelation: "Behold, the tabernacle of God is with men."',
  keyTexts: ['Revelation 1:1', 'Revelation 14:6-12', 'Revelation 18:1-4', 'Revelation 19:6-9', 'Revelation 21:1-5', 'Revelation 22:20']
};

// The Bible Story Summary Table
export interface BibleActSummary {
  act: string;
  books: string;
  theme: string;
}

export const bibleStoryArc: BibleActSummary[] = [
  { act: 'Creation & Fall', books: 'Genesis', theme: 'The problem introduced; the promise given' },
  { act: 'Preparation', books: 'Exodus – Deuteronomy', theme: 'The Deliverer foreshadowed' },
  { act: 'Conquest & Kingdom', books: 'Joshua – Chronicles', theme: 'The King foreshadowed; the nation tested' },
  { act: 'Captivity & Restoration', books: 'Ezra – Esther', theme: 'The Restorer foreshadowed' },
  { act: 'Testing & Wisdom', books: 'Job – Song of Solomon', theme: 'The Suffering Servant foreshadowed' },
  { act: 'Warning & Hope', books: 'Isaiah – Malachi', theme: 'The Coming One proclaimed' },
  { act: 'Arrival', books: 'Gospels', theme: 'The Messiah revealed' },
  { act: 'Expansion', books: 'Acts', theme: 'The Spirit poured out' },
  { act: 'Transformation', books: 'Epistles', theme: 'The new life explained' },
  { act: 'Consummation', books: 'Revelation', theme: 'The King returns; the story ends' }
];

// Get all Christ in Every Book entries
export const getAllChristInBooks = (): ChristInBook[] => {
  return [
    ...pentateuchChrist,
    ...historicalChrist,
    ...restorationChrist,
    ...wisdomChrist,
    ...majorProphetsChrist,
    ...minorProphetsChrist,
    ...gospelsChrist,
    actsChrist,
    ...epistlesChrist,
    revelationChrist
  ];
};

// Get Christ in Book by book name
export const getChristInBook = (book: string): ChristInBook | undefined => {
  return getAllChristInBooks().find(
    b => b.book.toLowerCase().includes(book.toLowerCase())
  );
};

// Get Christ in Books by section
export const getChristInBooksBySection = (section: ChristInBook['section']): ChristInBook[] => {
  return getAllChristInBooks().filter(b => b.section === section);
};
