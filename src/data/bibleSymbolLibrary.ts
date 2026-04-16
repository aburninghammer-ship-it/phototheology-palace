// Bible Symbol Library - Extensive Collection of Biblical Symbols
// Organized by category: Colors, Numbers, Objects, Beasts, Nature, Names, Materials, Body Parts, Actions

export interface BibleSymbol {
  id: string;
  name: string;
  category: SymbolCategory;
  meaning: string;
  keyVerses: string[];
  christConnection?: string;
  relatedSymbols?: string[];
}

export type SymbolCategory =
  | "colors"
  | "numbers"
  | "objects"
  | "beasts"
  | "nature"
  | "names"
  | "materials"
  | "body"
  | "actions"
  | "places"
  | "garments"
  | "food"
  | "time";

export interface SymbolCategoryInfo {
  id: SymbolCategory;
  name: string;
  description: string;
  icon: string;
}

export const symbolCategories: SymbolCategoryInfo[] = [
  { id: "colors", name: "Colors", description: "Symbolic meanings of colors in Scripture", icon: "🎨" },
  { id: "numbers", name: "Numbers", description: "Biblical numerology and symbolic numbers", icon: "🔢" },
  { id: "objects", name: "Objects", description: "Sacred objects and everyday items with spiritual meaning", icon: "🏺" },
  { id: "beasts", name: "Beasts & Animals", description: "Animals and creatures representing spiritual truths", icon: "🦁" },
  { id: "nature", name: "Nature", description: "Natural elements pointing to divine realities", icon: "🌿" },
  { id: "names", name: "Names", description: "Significant names and their prophetic meanings", icon: "📛" },
  { id: "materials", name: "Materials", description: "Metals, stones, and substances with symbolic value", icon: "💎" },
  { id: "body", name: "Body Parts", description: "Human body as spiritual metaphor", icon: "👁️" },
  { id: "actions", name: "Actions & Rituals", description: "Symbolic gestures and ceremonial acts", icon: "🙏" },
  { id: "places", name: "Places", description: "Locations with spiritual significance", icon: "🏔️" },
  { id: "garments", name: "Garments", description: "Clothing and coverings with deeper meaning", icon: "👘" },
  { id: "food", name: "Food & Drink", description: "Sustenance representing spiritual nourishment", icon: "🍞" },
  { id: "time", name: "Time & Seasons", description: "Temporal markers with prophetic significance", icon: "⏰" }
];

export const bibleSymbolLibrary: BibleSymbol[] = [
  // ============================================
  // COLORS
  // ============================================
  {
    id: "color-white",
    name: "White",
    category: "colors",
    meaning: "Purity, righteousness, holiness, victory, and the glorified state. White represents the absence of sin and the presence of divine light. It is the color of angels, the redeemed, and Christ Himself in His glorified form.",
    keyVerses: ["Revelation 19:8", "Isaiah 1:18", "Daniel 7:9", "Matthew 17:2", "Revelation 7:14"],
    christConnection: "Christ appears in white at the Transfiguration, and promises white garments to overcomers. His righteousness clothes believers.",
    relatedSymbols: ["Light", "Linen", "Snow", "Wool"]
  },
  {
    id: "color-red",
    name: "Red / Scarlet",
    category: "colors",
    meaning: "Blood, sacrifice, atonement, sin, and warfare. Red represents both the stain of sin and the blood that cleanses from sin. It speaks of life given and life taken.",
    keyVerses: ["Isaiah 1:18", "Leviticus 17:11", "Hebrews 9:22", "Revelation 12:3", "Joshua 2:18"],
    christConnection: "Christ's blood, shed on the cross, is the ultimate fulfillment of all red symbols in Scripture—from the Passover lamb to the scarlet cord.",
    relatedSymbols: ["Blood", "Wine", "Scarlet Cord", "Dragon"]
  },
  {
    id: "color-blue",
    name: "Blue",
    category: "colors",
    meaning: "Heaven, divinity, revelation, and the law of God. Blue represents the heavenly origin and nature of divine things. It was prominently used in the tabernacle and priestly garments.",
    keyVerses: ["Exodus 24:10", "Numbers 15:38-39", "Exodus 28:31", "Ezekiel 1:26"],
    christConnection: "Blue speaks of Christ's heavenly origin—He came down from heaven. The blue in the tabernacle pointed to His divine nature.",
    relatedSymbols: ["Sky", "Sapphire", "Throne", "Tassel"]
  },
  {
    id: "color-purple",
    name: "Purple",
    category: "colors",
    meaning: "Royalty, kingship, wealth, and nobility. Purple dye was extremely expensive, made from sea snails, and worn only by royalty and the wealthy. It represents sovereign authority.",
    keyVerses: ["Judges 8:26", "Mark 15:17", "Luke 16:19", "Acts 16:14", "Revelation 17:4"],
    christConnection: "Jesus was mockingly robed in purple at His trial, yet He truly is the King of Kings. The mockery proclaimed the truth.",
    relatedSymbols: ["Crown", "Throne", "Robe", "Lydia"]
  },
  {
    id: "color-gold",
    name: "Gold (Color)",
    category: "colors",
    meaning: "Divine nature, glory, deity, and that which has been tested and proven pure. Gold represents the highest value and the nature of God Himself.",
    keyVerses: ["Revelation 21:18", "1 Peter 1:7", "Exodus 25:11", "Daniel 2:32", "Job 23:10"],
    christConnection: "Christ is the 'head of gold'—deity manifest. Faith tested by fire comes forth as gold, reflecting His image.",
    relatedSymbols: ["Fire", "Refining", "Glory", "Lampstand"]
  },
  {
    id: "color-green",
    name: "Green",
    category: "colors",
    meaning: "Life, growth, prosperity, and resurrection. Green represents flourishing life and the blessing of God. It is associated with fruitfulness and vitality.",
    keyVerses: ["Psalm 23:2", "Psalm 52:8", "Jeremiah 17:8", "Hosea 14:8", "Revelation 8:7"],
    christConnection: "Christ is the source of eternal life. Those abiding in Him are like green olive trees, ever flourishing.",
    relatedSymbols: ["Tree", "Grass", "Olive", "Pasture"]
  },
  {
    id: "color-black",
    name: "Black",
    category: "colors",
    meaning: "Death, famine, mourning, sin, and judgment. Black represents the absence of light and life, often associated with calamity and spiritual darkness.",
    keyVerses: ["Revelation 6:5-6", "Lamentations 4:8", "Jeremiah 14:2", "Jude 1:13", "Job 30:30"],
    christConnection: "Christ descended into the darkness of death and Sheol, conquering the blackness of the grave through resurrection.",
    relatedSymbols: ["Night", "Famine", "Death", "Darkness"]
  },
  {
    id: "color-silver",
    name: "Silver (Color)",
    category: "colors",
    meaning: "Redemption, truth, and the Word of God. Silver was the metal of redemption—the price paid. It represents purified truth and tested words.",
    keyVerses: ["Psalm 12:6", "Exodus 30:11-16", "Zechariah 11:12-13", "Proverbs 25:11"],
    christConnection: "Christ was betrayed for 30 pieces of silver—the price of a slave, yet He redeemed us with His precious blood.",
    relatedSymbols: ["Redemption", "Words", "Refining", "Thirty"]
  },

  // ============================================
  // NUMBERS
  // ============================================
  {
    id: "number-1",
    name: "One (1)",
    category: "numbers",
    meaning: "Unity, primacy, beginning, and the one true God. One represents absolute singleness and the unique sovereignty of God. It emphasizes 'the Lord our God is one.'",
    keyVerses: ["Deuteronomy 6:4", "Ephesians 4:4-6", "John 10:30", "1 Timothy 2:5", "Zechariah 14:9"],
    christConnection: "Jesus and the Father are one. There is one mediator between God and man—the man Christ Jesus.",
    relatedSymbols: ["God", "Unity", "First"]
  },
  {
    id: "number-2",
    name: "Two (2)",
    category: "numbers",
    meaning: "Witness, testimony, division, and confirmation. Two witnesses establish truth. Two can also represent division or contrast (light/dark, good/evil).",
    keyVerses: ["Deuteronomy 19:15", "Matthew 18:16", "Revelation 11:3", "Ecclesiastes 4:9-10", "Amos 3:3"],
    christConnection: "Christ sent disciples two by two. The two witnesses in Revelation testify of Him. He is both God and man—two natures, one person.",
    relatedSymbols: ["Witness", "Testimony", "Tablets", "Witnesses"]
  },
  {
    id: "number-3",
    name: "Three (3)",
    category: "numbers",
    meaning: "Divine perfection, completeness, the Godhead (Trinity). Three represents the fullness of divine testimony and the resurrection (third day).",
    keyVerses: ["Matthew 28:19", "1 John 5:7", "Jonah 1:17", "Matthew 12:40", "John 2:19"],
    christConnection: "Christ rose on the third day. The Trinity—Father, Son, Spirit—reveals the triune nature of God.",
    relatedSymbols: ["Trinity", "Resurrection", "Holy Holy Holy"]
  },
  {
    id: "number-4",
    name: "Four (4)",
    category: "numbers",
    meaning: "Creation, the earth, universality, and the four corners of the world. Four represents the material creation and worldwide scope.",
    keyVerses: ["Revelation 7:1", "Isaiah 11:12", "Ezekiel 37:9", "Matthew 24:31", "Revelation 4:6"],
    christConnection: "Four Gospels present Christ to the four corners of the earth. He is Lord of all creation.",
    relatedSymbols: ["Winds", "Corners", "Living Creatures", "Earth"]
  },
  {
    id: "number-5",
    name: "Five (5)",
    category: "numbers",
    meaning: "Grace, God's goodness, and human weakness met by divine strength. Five represents the favor of God toward humanity.",
    keyVerses: ["Genesis 43:34", "Leviticus 1-5", "Matthew 14:17", "Matthew 25:2", "John 5:2"],
    christConnection: "Five loaves fed the multitude—grace multiplied. Christ received five wounds—grace purchased through suffering.",
    relatedSymbols: ["Grace", "Offerings", "Loaves", "Wounds"]
  },
  {
    id: "number-6",
    name: "Six (6)",
    category: "numbers",
    meaning: "Man, human effort, imperfection, and falling short of divine perfection (7). Six is the number of man created on the sixth day.",
    keyVerses: ["Genesis 1:26-31", "Revelation 13:18", "1 Samuel 17:4-7", "Daniel 3:1", "Exodus 20:9"],
    christConnection: "Christ, the second Adam, perfects what the first Adam (man-6) failed. 666 represents the antithesis of Christ.",
    relatedSymbols: ["Man", "Labor", "Beast", "Goliath"]
  },
  {
    id: "number-7",
    name: "Seven (7)",
    category: "numbers",
    meaning: "Divine perfection, completion, spiritual fullness. Seven is the most significant number in Scripture—God rested on the seventh day, declaring creation complete and perfect.",
    keyVerses: ["Genesis 2:2-3", "Revelation 1:4", "Joshua 6:4", "Leviticus 23:15-16", "Matthew 18:21-22"],
    christConnection: "Christ's seven 'I AM' statements in John reveal His complete divine identity. Seven spirits, seven churches, seven seals—perfection.",
    relatedSymbols: ["Sabbath", "Spirits", "Churches", "Seals", "Trumpets", "Bowls"]
  },
  {
    id: "number-8",
    name: "Eight (8)",
    category: "numbers",
    meaning: "New beginning, resurrection, regeneration. Eight transcends the complete cycle of seven, representing a new order or creation.",
    keyVerses: ["Genesis 17:12", "1 Peter 3:20", "2 Peter 2:5", "Luke 9:28", "John 20:26"],
    christConnection: "Christ rose on the first day of the week (the eighth day). Eight people were saved in the ark—new beginning for humanity.",
    relatedSymbols: ["Circumcision", "Ark", "Resurrection", "New Creation"]
  },
  {
    id: "number-10",
    name: "Ten (10)",
    category: "numbers",
    meaning: "Divine order, governmental perfection, complete responsibility. Ten represents human responsibility toward God's law and complete cycles.",
    keyVerses: ["Exodus 20:1-17", "Matthew 25:1", "Luke 19:13", "Revelation 2:10", "Daniel 1:12"],
    christConnection: "Christ fulfilled the Ten Commandments perfectly. He is the righteous standard humanity failed to keep.",
    relatedSymbols: ["Commandments", "Virgins", "Plagues", "Tithes"]
  },
  {
    id: "number-12",
    name: "Twelve (12)",
    category: "numbers",
    meaning: "Governmental perfection, divine authority, the people of God. Twelve represents God's ordered government—12 tribes, 12 apostles.",
    keyVerses: ["Genesis 49:28", "Matthew 10:1", "Revelation 21:12-14", "Revelation 12:1", "Luke 2:42"],
    christConnection: "Christ chose 12 apostles to govern His church. The New Jerusalem has 12 gates (tribes) and 12 foundations (apostles).",
    relatedSymbols: ["Tribes", "Apostles", "Gates", "Foundations", "Stars"]
  },
  {
    id: "number-40",
    name: "Forty (40)",
    category: "numbers",
    meaning: "Testing, trial, probation, and preparation. Forty represents a complete period of testing before entering a new phase.",
    keyVerses: ["Genesis 7:12", "Exodus 24:18", "Numbers 14:33", "Matthew 4:2", "Acts 1:3"],
    christConnection: "Christ fasted 40 days, was tempted, and overcame—succeeding where Israel failed in their 40 years of testing.",
    relatedSymbols: ["Flood", "Wilderness", "Fasting", "Moses", "Elijah"]
  },
  {
    id: "number-50",
    name: "Fifty (50)",
    category: "numbers",
    meaning: "Jubilee, freedom, deliverance, and the Holy Spirit. The 50th year was Jubilee—liberty proclaimed. Pentecost came 50 days after Passover.",
    keyVerses: ["Leviticus 25:10", "Acts 2:1", "Leviticus 23:16", "Isaiah 61:1-2"],
    christConnection: "Christ proclaimed the acceptable year of the Lord—the Jubilee. The Spirit came at Pentecost (50th day).",
    relatedSymbols: ["Jubilee", "Pentecost", "Freedom", "Spirit"]
  },
  {
    id: "number-70",
    name: "Seventy (70)",
    category: "numbers",
    meaning: "Perfect spiritual order, judgment accomplished, universality of God's purposes. Seventy elders governed Israel. 70 nations in Genesis 10.",
    keyVerses: ["Exodus 24:1", "Daniel 9:24", "Luke 10:1", "Jeremiah 25:11", "Genesis 46:27"],
    christConnection: "Christ sent 70 disciples to the nations. Daniel's 70 weeks prophesied Messiah's coming and work.",
    relatedSymbols: ["Elders", "Weeks", "Nations", "Disciples"]
  },
  {
    id: "number-144",
    name: "One Hundred Forty-Four (144)",
    category: "numbers",
    meaning: "Squared divine government (12x12), the complete people of God, ultimate perfection of God's purposes for His people.",
    keyVerses: ["Revelation 7:4", "Revelation 14:1", "Revelation 21:17"],
    christConnection: "The 144,000 are sealed servants of God, following the Lamb wherever He goes—complete redemption.",
    relatedSymbols: ["Sealed", "Tribes", "Firstfruits", "Virgins"]
  },
  {
    id: "number-666",
    name: "Six Hundred Sixty-Six (666)",
    category: "numbers",
    meaning: "Ultimate human imperfection, the number of the beast, man's failed attempt to achieve deity. Triple six emphasizes complete human failure.",
    keyVerses: ["Revelation 13:18", "1 Kings 10:14", "Daniel 3:1"],
    christConnection: "The antichrist counterfeits Christ. Where 666 represents man's apex of rebellion, Christ is the true 777—divine perfection.",
    relatedSymbols: ["Beast", "Mark", "Antichrist", "Babylon"]
  },
  {
    id: "number-1000",
    name: "One Thousand (1000)",
    category: "numbers",
    meaning: "Divine completeness on a grand scale, fullness of time, the millennial reign. A thousand represents a complete, extended period of God's purposes.",
    keyVerses: ["Revelation 20:2-6", "Psalm 90:4", "2 Peter 3:8", "Psalm 50:10"],
    christConnection: "Christ will reign 1000 years—the full restoration of God's kingdom on earth before the eternal state.",
    relatedSymbols: ["Millennium", "Reign", "Binding", "Resurrection"]
  },

  // ============================================
  // OBJECTS
  // ============================================
  {
    id: "object-lamp",
    name: "Lamp / Lampstand",
    category: "objects",
    meaning: "Light, witness, the Word of God, the Holy Spirit, and the church. Lamps provide illumination in darkness and represent spiritual enlightenment.",
    keyVerses: ["Psalm 119:105", "Matthew 5:15", "Revelation 1:20", "Exodus 25:31-40", "Zechariah 4:2"],
    christConnection: "Christ is the Light of the World. The seven-branched lampstand in the tabernacle depicted His complete illumination.",
    relatedSymbols: ["Light", "Oil", "Fire", "Church", "Menorah"]
  },
  {
    id: "object-bread",
    name: "Bread",
    category: "objects",
    meaning: "Sustenance, the Word of God, fellowship, Christ's body, and provision. Bread represents both physical and spiritual nourishment.",
    keyVerses: ["John 6:35", "Matthew 4:4", "1 Corinthians 11:24", "Exodus 16:4", "Leviticus 24:5-9"],
    christConnection: "Christ is the Bread of Life. The showbread, manna, and communion bread all point to Him as our sustenance.",
    relatedSymbols: ["Manna", "Showbread", "Communion", "Leaven", "Unleavened"]
  },
  {
    id: "object-water",
    name: "Water",
    category: "objects",
    meaning: "Life, cleansing, the Holy Spirit, the Word, and salvation. Water sustains life and cleanses—essential for both physical and spiritual existence.",
    keyVerses: ["John 4:14", "John 7:38-39", "Ephesians 5:26", "Ezekiel 47:1-9", "Revelation 22:1"],
    christConnection: "Christ gives living water. From His side flowed water and blood. He is the source of eternal life.",
    relatedSymbols: ["River", "Well", "Rain", "Sea", "Washing"]
  },
  {
    id: "object-oil",
    name: "Oil",
    category: "objects",
    meaning: "The Holy Spirit, anointing, consecration, healing, and joy. Oil was used to anoint kings, priests, and prophets—setting them apart for service.",
    keyVerses: ["1 Samuel 16:13", "Psalm 23:5", "James 5:14", "Matthew 25:3-4", "Exodus 30:22-33"],
    christConnection: "Christ means 'Anointed One.' He was anointed with the Spirit without measure. Believers receive the same anointing.",
    relatedSymbols: ["Anointing", "Spirit", "Olive", "Lamp", "Gladness"]
  },
  {
    id: "object-sword",
    name: "Sword",
    category: "objects",
    meaning: "The Word of God, judgment, warfare, division, and authority. The sword cuts, divides, and conquers—both in battle and in discerning truth.",
    keyVerses: ["Hebrews 4:12", "Ephesians 6:17", "Revelation 19:15", "Genesis 3:24", "Matthew 10:34"],
    christConnection: "Christ wields the sword of His mouth—His Word judges and conquers. He divides truth from error.",
    relatedSymbols: ["Word", "Judgment", "Battle", "Tongue", "Dividing"]
  },
  {
    id: "object-crown",
    name: "Crown",
    category: "objects",
    meaning: "Kingship, authority, victory, reward, and glory. Crowns represent ruling power and the honor given to overcomers.",
    keyVerses: ["Revelation 19:12", "2 Timothy 4:8", "James 1:12", "1 Peter 5:4", "Revelation 4:10"],
    christConnection: "Christ wears many crowns as King of Kings. He first wore a crown of thorns, then received the crown of glory.",
    relatedSymbols: ["Throne", "Kingdom", "Victory", "Thorns", "Diadem"]
  },
  {
    id: "object-throne",
    name: "Throne",
    category: "objects",
    meaning: "Sovereignty, judgment, authority, and the presence of God as ruler. The throne represents the seat of ultimate power.",
    keyVerses: ["Revelation 4:2", "Isaiah 6:1", "Hebrews 4:16", "Psalm 45:6", "Matthew 19:28"],
    christConnection: "Christ sits at the right hand of the throne of God. He shares the Father's throne and will judge from His own throne.",
    relatedSymbols: ["Crown", "Scepter", "Judgment", "Kingdom", "Heaven"]
  },
  {
    id: "object-altar",
    name: "Altar",
    category: "objects",
    meaning: "Sacrifice, worship, atonement, and meeting with God. Altars were places of offering—where heaven and earth intersected.",
    keyVerses: ["Genesis 8:20", "Exodus 27:1-8", "Hebrews 13:10", "Revelation 6:9", "1 Kings 18:30-38"],
    christConnection: "Christ is both our altar and our sacrifice. The cross is the ultimate altar where atonement was made.",
    relatedSymbols: ["Sacrifice", "Fire", "Blood", "Cross", "Horns"]
  },
  {
    id: "object-ark",
    name: "Ark of the Covenant",
    category: "objects",
    meaning: "God's presence, covenant faithfulness, mercy, and throne. The Ark contained the law, manna, and Aaron's rod—representing God's dwelling among His people.",
    keyVerses: ["Exodus 25:10-22", "Hebrews 9:4-5", "Joshua 3:3", "1 Samuel 4:3", "Revelation 11:19"],
    christConnection: "Christ is the true Ark—God dwelling with man. The mercy seat represents His propitiation for sin.",
    relatedSymbols: ["Mercy Seat", "Cherubim", "Law", "Manna", "Rod"]
  },
  {
    id: "object-key",
    name: "Key",
    category: "objects",
    meaning: "Authority, access, knowledge, and power to open or shut. Keys represent control over entrance and revelation.",
    keyVerses: ["Revelation 1:18", "Matthew 16:19", "Isaiah 22:22", "Revelation 3:7", "Luke 11:52"],
    christConnection: "Christ holds the keys of death and Hades. He has the key of David—authority to open and shut the kingdom.",
    relatedSymbols: ["Door", "Gate", "Authority", "Knowledge", "Death"]
  },
  {
    id: "object-scroll",
    name: "Scroll / Book",
    category: "objects",
    meaning: "God's Word, divine decree, prophecy, and the record of deeds. Scrolls contain the written revelation and sealed purposes of God.",
    keyVerses: ["Revelation 5:1-5", "Ezekiel 2:9-10", "Daniel 12:4", "Revelation 10:2", "Psalm 40:7"],
    christConnection: "Christ alone is worthy to open the seven-sealed scroll. 'In the volume of the book it is written of Me.'",
    relatedSymbols: ["Seals", "Word", "Prophecy", "Lamb", "Writing"]
  },
  {
    id: "object-trumpet",
    name: "Trumpet / Shofar",
    category: "objects",
    meaning: "Announcement, warning, gathering, warfare, and divine intervention. Trumpets herald significant events and call God's people to attention.",
    keyVerses: ["1 Thessalonians 4:16", "Revelation 8:2", "Joshua 6:4", "Numbers 10:2", "Joel 2:1"],
    christConnection: "Christ will return at the sound of the trumpet. The last trump raises the dead and transforms the living.",
    relatedSymbols: ["Voice", "Judgment", "Gathering", "Jubilee", "Warning"]
  },
  {
    id: "object-veil",
    name: "Veil / Curtain",
    category: "objects",
    meaning: "Separation, concealment, Christ's flesh, and limited access. The veil separated the Holy Place from the Most Holy, limiting access to God's presence.",
    keyVerses: ["Hebrews 10:20", "Matthew 27:51", "Exodus 26:31-33", "2 Corinthians 3:14-16"],
    christConnection: "Christ's flesh is the veil—torn at His death, opening access to God. The veil's rending declares 'It is finished.'",
    relatedSymbols: ["Temple", "Flesh", "Access", "Separation", "Cherubim"]
  },
  {
    id: "object-door",
    name: "Door / Gate",
    category: "objects",
    meaning: "Access, opportunity, Christ Himself, and salvation. Doors represent points of entry—either open or closed.",
    keyVerses: ["John 10:9", "Revelation 3:20", "Matthew 7:13-14", "Acts 14:27", "Revelation 4:1"],
    christConnection: "Christ says 'I am the Door.' He is the only entrance to salvation and the Father's presence.",
    relatedSymbols: ["Key", "Gate", "Way", "Entrance", "Sheep"]
  },
  {
    id: "object-cup",
    name: "Cup",
    category: "objects",
    meaning: "Portion, destiny, suffering, blessing, or wrath. The cup represents what one must drink—whether joy or judgment.",
    keyVerses: ["Matthew 26:39", "Psalm 23:5", "Psalm 116:13", "Revelation 14:10", "1 Corinthians 11:25"],
    christConnection: "Christ drank the cup of God's wrath for us. Now we drink the cup of blessing—His blood, the new covenant.",
    relatedSymbols: ["Wine", "Blood", "Wrath", "Blessing", "Communion"]
  },
  {
    id: "object-rod",
    name: "Rod / Staff",
    category: "objects",
    meaning: "Authority, guidance, correction, protection, and rulership. The rod represents both the shepherd's care and the king's scepter.",
    keyVerses: ["Psalm 23:4", "Exodus 4:2-4", "Numbers 17:8", "Revelation 12:5", "Proverbs 13:24"],
    christConnection: "Christ is the Good Shepherd with rod and staff. He will rule the nations with a rod of iron—absolute authority.",
    relatedSymbols: ["Shepherd", "Scepter", "Authority", "Aaron", "Moses"]
  },

  // ============================================
  // BEASTS & ANIMALS
  // ============================================
  {
    id: "beast-lamb",
    name: "Lamb",
    category: "beasts",
    meaning: "Innocence, sacrifice, substitution, meekness, and redemption. The lamb is the primary sacrificial animal, representing the innocent dying for the guilty.",
    keyVerses: ["John 1:29", "Revelation 5:6", "Isaiah 53:7", "Genesis 22:8", "1 Peter 1:19"],
    christConnection: "Christ is THE Lamb of God—slain before the foundation of the world, the ultimate Passover sacrifice.",
    relatedSymbols: ["Sacrifice", "Blood", "Passover", "Shepherd", "Wool"]
  },
  {
    id: "beast-lion",
    name: "Lion",
    category: "beasts",
    meaning: "Royalty, power, courage, fierceness, and either Christ or Satan. Context determines whether the lion represents the King of Kings or the roaring adversary.",
    keyVerses: ["Revelation 5:5", "1 Peter 5:8", "Proverbs 28:1", "Genesis 49:9", "Hosea 5:14"],
    christConnection: "Christ is the Lion of the tribe of Judah—royal, powerful, victorious. Yet Satan also prowls as a roaring lion.",
    relatedSymbols: ["King", "Judah", "Courage", "Throne", "Roaring"]
  },
  {
    id: "beast-serpent",
    name: "Serpent / Snake",
    category: "beasts",
    meaning: "Satan, deception, sin, craftiness, but also (when lifted up) salvation. The serpent is the great deceiver, yet the bronze serpent brought healing.",
    keyVerses: ["Genesis 3:1", "Revelation 12:9", "John 3:14", "Numbers 21:9", "2 Corinthians 11:3"],
    christConnection: "As Moses lifted the serpent, Christ was lifted up—becoming sin for us that we might be healed and live.",
    relatedSymbols: ["Dragon", "Deception", "Bronze", "Cross", "Curse"]
  },
  {
    id: "beast-dove",
    name: "Dove",
    category: "beasts",
    meaning: "The Holy Spirit, peace, purity, gentleness, and innocence. The dove represents the Spirit's character and presence.",
    keyVerses: ["Matthew 3:16", "Genesis 8:8-12", "Song of Solomon 2:14", "Matthew 10:16", "Psalm 55:6"],
    christConnection: "The Spirit descended on Christ like a dove at His baptism—identifying Him as the Anointed One.",
    relatedSymbols: ["Spirit", "Peace", "Olive Branch", "Gentleness", "Baptism"]
  },
  {
    id: "beast-eagle",
    name: "Eagle",
    category: "beasts",
    meaning: "Swiftness, strength, renewal, vision, and divine protection. Eagles soar above storms and represent rising above circumstances by God's power.",
    keyVerses: ["Isaiah 40:31", "Exodus 19:4", "Deuteronomy 32:11", "Revelation 4:7", "Ezekiel 1:10"],
    christConnection: "Christ carries His people on eagle's wings. The fourth living creature—the eagle—represents His divine, heavenly nature.",
    relatedSymbols: ["Wings", "Strength", "Vision", "Soaring", "Renewal"]
  },
  {
    id: "beast-dragon",
    name: "Dragon",
    category: "beasts",
    meaning: "Satan, cosmic evil, destruction, and ultimate opposition to God. The dragon is the ancient serpent—the deceiver of the whole world.",
    keyVerses: ["Revelation 12:3-9", "Revelation 20:2", "Isaiah 27:1", "Revelation 13:2", "Psalm 74:13-14"],
    christConnection: "Christ crushed the dragon's head. He will cast the dragon into the lake of fire—ultimate victory.",
    relatedSymbols: ["Serpent", "Beast", "Satan", "Red", "Heads"]
  },
  {
    id: "beast-ox",
    name: "Ox / Bull",
    category: "beasts",
    meaning: "Service, sacrifice, strength, and patient labor. The ox represents faithful, tireless work and the strength of servant ministry.",
    keyVerses: ["Ezekiel 1:10", "Proverbs 14:4", "1 Corinthians 9:9", "Luke 14:5", "Revelation 4:7"],
    christConnection: "Christ is the suffering Servant—pictured by the ox in Ezekiel's vision and Mark's Gospel presentation.",
    relatedSymbols: ["Servant", "Strength", "Labor", "Sacrifice", "Yoke"]
  },
  {
    id: "beast-horse",
    name: "Horse",
    category: "beasts",
    meaning: "War, conquest, power, swiftness, and judgment. Horses represent military might and the execution of divine purposes.",
    keyVerses: ["Revelation 6:2-8", "Revelation 19:11", "Zechariah 1:8", "2 Kings 2:11", "Zechariah 6:1-8"],
    christConnection: "Christ returns on a white horse as conquering King. The four horsemen execute His judgments.",
    relatedSymbols: ["Rider", "War", "Conquest", "Chariot", "White"]
  },
  {
    id: "beast-goat",
    name: "Goat",
    category: "beasts",
    meaning: "Sin-bearer, judgment, rebellion, and the wicked. The scapegoat carried sins away; goats represent those separated from God.",
    keyVerses: ["Leviticus 16:8-10", "Matthew 25:32-33", "Daniel 8:5", "Leviticus 4:24"],
    christConnection: "Christ is both the sacrifice and the scapegoat—dying for sin and carrying it away into oblivion.",
    relatedSymbols: ["Scapegoat", "Atonement", "Separation", "Judgment", "Nations"]
  },
  {
    id: "beast-wolf",
    name: "Wolf",
    category: "beasts",
    meaning: "Predators, false teachers, persecution, and danger to the flock. Wolves represent those who destroy God's people.",
    keyVerses: ["Matthew 7:15", "John 10:12", "Acts 20:29", "Isaiah 11:6", "Ezekiel 22:27"],
    christConnection: "Christ protects His sheep from wolves. In the kingdom, the wolf will lie down with the lamb—complete transformation.",
    relatedSymbols: ["Sheep", "Shepherd", "False Prophets", "Danger", "Flock"]
  },
  {
    id: "beast-bear",
    name: "Bear",
    category: "beasts",
    meaning: "Fierce power, destructive force, and world empires. The bear represents overwhelming strength that devours.",
    keyVerses: ["Daniel 7:5", "Revelation 13:2", "2 Kings 2:24", "Proverbs 17:12", "Hosea 13:8"],
    christConnection: "Christ overcomes all world powers represented by beasts. His kingdom supersedes all.",
    relatedSymbols: ["Medo-Persia", "Empire", "Power", "Destruction", "Beast"]
  },
  {
    id: "beast-leopard",
    name: "Leopard",
    category: "beasts",
    meaning: "Swiftness, cunning, Greece, and sudden conquest. The leopard's speed represents rapid conquest and unchangeable nature.",
    keyVerses: ["Daniel 7:6", "Revelation 13:2", "Jeremiah 13:23", "Hosea 13:7", "Habakkuk 1:8"],
    christConnection: "Christ's kingdom overcomes all swift empires. He alone can change what is unchangeable—the leopard's spots.",
    relatedSymbols: ["Greece", "Alexander", "Speed", "Wings", "Empire"]
  },
  {
    id: "beast-locust",
    name: "Locust",
    category: "beasts",
    meaning: "Judgment, destruction, demonic forces, and overwhelming devastation. Locusts consume everything, representing divine plagues.",
    keyVerses: ["Revelation 9:3-7", "Joel 1:4", "Exodus 10:12-15", "Proverbs 30:27", "Nahum 3:15"],
    christConnection: "Christ restores the years the locusts have eaten. His judgment includes releasing demonic locust armies.",
    relatedSymbols: ["Plague", "Judgment", "Destruction", "Army", "Abyss"]
  },
  {
    id: "beast-fish",
    name: "Fish",
    category: "beasts",
    meaning: "Believers, evangelism, abundance, and resurrection. Fish represent those caught in the gospel net—brought from death to life.",
    keyVerses: ["Matthew 4:19", "John 21:6", "Matthew 13:47-48", "Jonah 1:17", "Matthew 14:17"],
    christConnection: "Christ made disciples fishers of men. He multiplied fish and appeared to disciples with fish after resurrection.",
    relatedSymbols: ["Net", "Sea", "Evangelism", "Multitude", "Ichthus"]
  },

  // ============================================
  // NATURE
  // ============================================
  {
    id: "nature-tree",
    name: "Tree",
    category: "nature",
    meaning: "Life, nations, individuals, the cross, and stability. Trees represent growth, fruitfulness, and rootedness. The tree of life offers immortality.",
    keyVerses: ["Genesis 2:9", "Psalm 1:3", "Revelation 22:2", "Daniel 4:10-12", "Galatians 3:13"],
    christConnection: "Christ hung on a tree, becoming a curse for us. He gives access to the Tree of Life—eternal life restored.",
    relatedSymbols: ["Cross", "Fruit", "Leaves", "Root", "Life"]
  },
  {
    id: "nature-vine",
    name: "Vine",
    category: "nature",
    meaning: "Israel, Christ, fruitfulness, and abiding relationship. The vine produces fruit only through connected branches—dependence on the source.",
    keyVerses: ["John 15:1-5", "Isaiah 5:1-7", "Psalm 80:8", "Jeremiah 2:21", "Hosea 10:1"],
    christConnection: "Christ is the True Vine—the reality Israel failed to be. Abiding in Him produces much fruit.",
    relatedSymbols: ["Branches", "Grapes", "Wine", "Pruning", "Fruit"]
  },
  {
    id: "nature-rock",
    name: "Rock / Stone",
    category: "nature",
    meaning: "Christ, stability, foundation, refuge, and judgment. The rock provides unmovable security and is the foundation upon which to build.",
    keyVerses: ["1 Corinthians 10:4", "Matthew 16:18", "Isaiah 28:16", "Daniel 2:34-35", "1 Peter 2:6-8"],
    christConnection: "Christ is the Rock that followed Israel, the Stone the builders rejected, and the Rock of our salvation.",
    relatedSymbols: ["Foundation", "Cornerstone", "Stumbling", "Refuge", "Fortress"]
  },
  {
    id: "nature-mountain",
    name: "Mountain",
    category: "nature",
    meaning: "Kingdoms, obstacles, God's dwelling, stability, and encounter with God. Mountains represent governments and places of revelation.",
    keyVerses: ["Daniel 2:35", "Isaiah 2:2", "Exodus 19:20", "Matthew 17:1", "Zechariah 4:7"],
    christConnection: "Christ taught on mountains, was transfigured on a mountain, and ascended from a mountain. God's kingdom is the great mountain.",
    relatedSymbols: ["Zion", "Sinai", "Kingdom", "Obstacle", "Worship"]
  },
  {
    id: "nature-sea",
    name: "Sea",
    category: "nature",
    meaning: "Nations, chaos, evil, restlessness, and separation from God. The sea represents turbulent peoples and the abyss of evil—in the new earth, no more sea.",
    keyVerses: ["Revelation 13:1", "Isaiah 57:20", "Revelation 21:1", "Daniel 7:3", "Psalm 93:3-4"],
    christConnection: "Christ walked on the sea, calmed its storms, and is mightier than its waves. He rules over chaos.",
    relatedSymbols: ["Waves", "Nations", "Beast", "Chaos", "Glass"]
  },
  {
    id: "nature-river",
    name: "River",
    category: "nature",
    meaning: "Life, the Spirit, blessing, and God's provision. Rivers bring fertility and represent the continuous flow of divine life.",
    keyVerses: ["Revelation 22:1", "Ezekiel 47:1-9", "John 7:38", "Psalm 46:4", "Genesis 2:10"],
    christConnection: "From Christ flows living water. The river of life proceeds from God's throne—Christ is the source of eternal life.",
    relatedSymbols: ["Water", "Spirit", "Life", "Eden", "Healing"]
  },
  {
    id: "nature-fire",
    name: "Fire",
    category: "nature",
    meaning: "God's presence, purification, judgment, the Holy Spirit, and testing. Fire consumes dross, reveals what is genuine, and represents divine glory.",
    keyVerses: ["Hebrews 12:29", "Acts 2:3", "1 Corinthians 3:13", "Exodus 3:2", "Revelation 20:14"],
    christConnection: "Christ baptizes with the Holy Spirit and fire. He appears with eyes of fire, judging and purifying His church.",
    relatedSymbols: ["Spirit", "Judgment", "Purification", "Glory", "Tongue"]
  },
  {
    id: "nature-sun",
    name: "Sun",
    category: "nature",
    meaning: "Christ, God's glory, righteousness, and light. The sun dominates the day, representing the source of all spiritual light and life.",
    keyVerses: ["Malachi 4:2", "Psalm 84:11", "Matthew 17:2", "Revelation 1:16", "Revelation 21:23"],
    christConnection: "Christ is the Sun of Righteousness with healing in His wings. His face shines like the sun in full strength.",
    relatedSymbols: ["Light", "Glory", "Day", "Righteousness", "Healing"]
  },
  {
    id: "nature-moon",
    name: "Moon",
    category: "nature",
    meaning: "Reflected light, the church, Israel, and appointed times. The moon has no light of its own but reflects the sun—like the church reflects Christ.",
    keyVerses: ["Revelation 12:1", "Genesis 1:16", "Psalm 104:19", "Joel 2:31", "Song of Solomon 6:10"],
    christConnection: "The woman clothed with the sun (Christ) has the moon under her feet—Israel's system fulfilled and superseded.",
    relatedSymbols: ["Church", "Israel", "Night", "Seasons", "Woman"]
  },
  {
    id: "nature-stars",
    name: "Stars",
    category: "nature",
    meaning: "Angels, leaders, believers, Abraham's descendants, and heavenly glory. Stars provide light in darkness and represent those who shine for God.",
    keyVerses: ["Revelation 1:20", "Daniel 12:3", "Genesis 15:5", "Revelation 12:4", "Philippians 2:15"],
    christConnection: "Christ holds seven stars (angels/messengers). He is the Bright Morning Star—the first light of the new day.",
    relatedSymbols: ["Angels", "Churches", "Abraham", "Descendants", "Morning Star"]
  },
  {
    id: "nature-rain",
    name: "Rain",
    category: "nature",
    meaning: "Blessing, the Word of God, the Spirit, and revival. Rain brings life to parched ground—both early and latter rain have spiritual significance.",
    keyVerses: ["Deuteronomy 32:2", "Joel 2:23", "James 5:7", "Hosea 6:3", "Isaiah 55:10-11"],
    christConnection: "Christ gives the Spirit like rain. His Word comes down like rain, accomplishing its purpose.",
    relatedSymbols: ["Word", "Spirit", "Blessing", "Harvest", "Clouds"]
  },
  {
    id: "nature-cloud",
    name: "Cloud",
    category: "nature",
    meaning: "God's presence, glory, mystery, witnesses, and divine covering. The cloud guided Israel and overshadowed Christ at the transfiguration.",
    keyVerses: ["Exodus 13:21", "Matthew 17:5", "Hebrews 12:1", "1 Thessalonians 4:17", "Revelation 1:7"],
    christConnection: "Christ ascended in a cloud and will return in the clouds. The cloud of glory represents His presence.",
    relatedSymbols: ["Glory", "Presence", "Witnesses", "Return", "Pillar"]
  },
  {
    id: "nature-wind",
    name: "Wind",
    category: "nature",
    meaning: "The Holy Spirit, God's power, change, and invisible force. Wind (ruach/pneuma) is the same word as Spirit—invisible but powerful.",
    keyVerses: ["John 3:8", "Acts 2:2", "Ezekiel 37:9", "1 Kings 19:11", "John 20:22"],
    christConnection: "Christ breathed on disciples, imparting the Spirit. The wind of Pentecost announced the Spirit's coming in power.",
    relatedSymbols: ["Spirit", "Breath", "Power", "Four Winds", "Rushing"]
  },
  {
    id: "nature-earthquake",
    name: "Earthquake",
    category: "nature",
    meaning: "Divine intervention, judgment, resurrection, and shaking of powers. Earthquakes mark pivotal moments of God breaking into history.",
    keyVerses: ["Matthew 27:54", "Matthew 28:2", "Revelation 6:12", "Acts 16:26", "Hebrews 12:26"],
    christConnection: "An earthquake marked Christ's death and resurrection. His return will shake heaven and earth.",
    relatedSymbols: ["Judgment", "Resurrection", "Shaking", "Powers", "Throne"]
  },
  {
    id: "nature-wilderness",
    name: "Wilderness / Desert",
    category: "nature",
    meaning: "Testing, preparation, encounter with God, and dependence. The wilderness strips away self-sufficiency and prepares for destiny.",
    keyVerses: ["Matthew 4:1", "Deuteronomy 8:2", "Hosea 2:14", "Isaiah 35:1", "Revelation 12:6"],
    christConnection: "Christ was tested 40 days in the wilderness, succeeding where Israel failed. He meets us in our wilderness.",
    relatedSymbols: ["Testing", "Manna", "Preparation", "Forty", "Provision"]
  },

  // ============================================
  // NAMES
  // ============================================
  {
    id: "name-adam",
    name: "Adam",
    category: "names",
    meaning: "Man, humanity, red earth, first creation. Adam represents all humanity in both origin and fall—the first man from whom all descend.",
    keyVerses: ["Genesis 2:7", "Romans 5:14", "1 Corinthians 15:45", "Genesis 3:20"],
    christConnection: "Christ is the last Adam—the head of a new humanity. Where Adam failed, Christ succeeded.",
    relatedSymbols: ["Dust", "Man", "Fall", "Image", "Earth"]
  },
  {
    id: "name-abraham",
    name: "Abraham",
    category: "names",
    meaning: "Father of many nations, faith, covenant, and blessing. Abraham's faith was credited as righteousness—the pattern for all believers.",
    keyVerses: ["Genesis 17:5", "Romans 4:16", "Galatians 3:7", "Hebrews 11:8", "Genesis 12:3"],
    christConnection: "Christ is Abraham's seed in whom all nations are blessed. Abraham saw Christ's day and was glad.",
    relatedSymbols: ["Faith", "Covenant", "Seed", "Nations", "Blessing"]
  },
  {
    id: "name-israel",
    name: "Israel",
    category: "names",
    meaning: "Prevails with God, God's chosen people, one who wrestles. Israel represents both the man Jacob and the nation descended from him.",
    keyVerses: ["Genesis 32:28", "Isaiah 49:3", "Romans 9:6", "Galatians 6:16", "Exodus 4:22"],
    christConnection: "Christ is the true Israel—the Servant in whom God is glorified. He fulfills Israel's destiny.",
    relatedSymbols: ["Jacob", "Twelve Tribes", "Chosen", "Firstborn", "Servant"]
  },
  {
    id: "name-david",
    name: "David",
    category: "names",
    meaning: "Beloved, kingship, covenant, and the messianic line. David's throne is established forever through his greater Son.",
    keyVerses: ["1 Samuel 13:14", "2 Samuel 7:12-16", "Matthew 1:1", "Acts 13:22", "Revelation 22:16"],
    christConnection: "Christ is the Son of David, the Root and Offspring of David—heir to David's eternal throne.",
    relatedSymbols: ["King", "Shepherd", "Throne", "Root", "Key"]
  },
  {
    id: "name-moses",
    name: "Moses",
    category: "names",
    meaning: "Drawn out, deliverer, lawgiver, mediator. Moses prefigured Christ as the one who leads God's people from bondage to promise.",
    keyVerses: ["Deuteronomy 18:15", "Acts 7:37", "Hebrews 3:2-6", "John 1:17", "Exodus 2:10"],
    christConnection: "Christ is the prophet like Moses—but greater. Moses gave law; Christ gives grace and truth.",
    relatedSymbols: ["Law", "Deliverer", "Prophet", "Mediator", "Rod"]
  },
  {
    id: "name-elijah",
    name: "Elijah",
    category: "names",
    meaning: "My God is Yahweh, prophetic power, restoration. Elijah represents the prophetic office and will return before the Day of the Lord.",
    keyVerses: ["1 Kings 18:36", "Malachi 4:5", "Matthew 17:3", "James 5:17", "Luke 1:17"],
    christConnection: "John the Baptist came in the spirit of Elijah. Christ spoke with Elijah on the mount of transfiguration.",
    relatedSymbols: ["Prophet", "Fire", "Mantle", "Chariot", "Rain"]
  },
  {
    id: "name-jezebel",
    name: "Jezebel",
    category: "names",
    meaning: "Idolatry, seduction, false teaching, and Baal worship. Jezebel represents the spirit of compromise and spiritual adultery.",
    keyVerses: ["1 Kings 16:31", "1 Kings 21:25", "Revelation 2:20", "2 Kings 9:30-37"],
    christConnection: "Christ warns the church against tolerating Jezebel—He will judge false teaching and immorality.",
    relatedSymbols: ["Baal", "Seduction", "Idolatry", "Thyatira", "Judgment"]
  },
  {
    id: "name-babylon",
    name: "Babylon",
    category: "names",
    meaning: "Confusion, world system opposed to God, spiritual adultery, pride. Babylon is the anti-kingdom—humanity united against God.",
    keyVerses: ["Genesis 11:9", "Revelation 17:5", "Revelation 18:2", "Jeremiah 51:7", "Isaiah 14:4"],
    christConnection: "Christ calls His people out of Babylon. He will utterly destroy the great harlot in one hour.",
    relatedSymbols: ["Tower", "Harlot", "Beast", "Cup", "Fall"]
  },
  {
    id: "name-jerusalem",
    name: "Jerusalem",
    category: "names",
    meaning: "City of peace, God's chosen dwelling, the church, and eternal destiny. Jerusalem represents God's presence among His people.",
    keyVerses: ["Psalm 122:6", "Galatians 4:26", "Hebrews 12:22", "Revelation 21:2", "Matthew 23:37"],
    christConnection: "Christ wept over Jerusalem and died outside its gates. The New Jerusalem descends as His bride.",
    relatedSymbols: ["Zion", "Temple", "Bride", "Peace", "Gates"]
  },
  {
    id: "name-egypt",
    name: "Egypt",
    category: "names",
    meaning: "Bondage, the world, sin, and affliction. Egypt represents the place of slavery from which God delivers His people.",
    keyVerses: ["Exodus 20:2", "Hosea 11:1", "Revelation 11:8", "Deuteronomy 5:6", "Isaiah 19:1"],
    christConnection: "Christ was called out of Egypt as a child. He delivers us from spiritual Egypt—bondage to sin.",
    relatedSymbols: ["Pharaoh", "Bondage", "Plagues", "Exodus", "Red Sea"]
  },

  // ============================================
  // MATERIALS
  // ============================================
  {
    id: "material-gold",
    name: "Gold",
    category: "materials",
    meaning: "Deity, divine nature, purity, kingship, and ultimate value. Gold does not tarnish—representing the unchanging nature of God.",
    keyVerses: ["Revelation 21:18", "Exodus 25:11", "1 Peter 1:7", "Daniel 2:32", "Revelation 3:18"],
    christConnection: "Christ is the gold tried in fire—pure deity. He offers us gold refined by fire—faith that endures.",
    relatedSymbols: ["Deity", "Glory", "Purity", "Refining", "Crown"]
  },
  {
    id: "material-silver",
    name: "Silver",
    category: "materials",
    meaning: "Redemption, price, truth, and the Word of God. Silver was the metal of redemption—used for the ransom of souls.",
    keyVerses: ["Exodus 30:12-16", "Psalm 12:6", "Zechariah 11:12-13", "Proverbs 10:20", "Matthew 26:15"],
    christConnection: "Christ was sold for 30 pieces of silver—the redemption price. His words are silver refined seven times.",
    relatedSymbols: ["Redemption", "Price", "Words", "Thirty", "Refining"]
  },
  {
    id: "material-bronze",
    name: "Bronze / Brass",
    category: "materials",
    meaning: "Judgment, endurance, human nature in judgment, and strength. Bronze can withstand fire—representing that which endures testing.",
    keyVerses: ["Numbers 21:9", "Revelation 1:15", "Exodus 27:2", "Daniel 2:39", "Ezekiel 1:7"],
    christConnection: "Christ's feet are like burnished bronze—He is the Judge who has passed through fire. The bronze serpent foreshadowed Him.",
    relatedSymbols: ["Judgment", "Altar", "Serpent", "Feet", "Fire"]
  },
  {
    id: "material-iron",
    name: "Iron",
    category: "materials",
    meaning: "Strength, power, hardness, crushing authority, and Rome. Iron represents unyielding power and governmental might.",
    keyVerses: ["Daniel 2:40", "Revelation 2:27", "Revelation 19:15", "Deuteronomy 28:23", "Psalm 2:9"],
    christConnection: "Christ will rule with a rod of iron—absolute, crushing authority over rebellious nations.",
    relatedSymbols: ["Rome", "Rod", "Strength", "Kingdom", "Rule"]
  },
  {
    id: "material-clay",
    name: "Clay",
    category: "materials",
    meaning: "Humanity, frailty, moldability, and vessels. Clay represents man's earthen nature and God's sovereign forming of lives.",
    keyVerses: ["Isaiah 64:8", "Jeremiah 18:6", "Romans 9:21", "2 Corinthians 4:7", "Daniel 2:33"],
    christConnection: "Christ took on human clay—entering our frailty. We are clay vessels carrying the treasure of His presence.",
    relatedSymbols: ["Potter", "Vessel", "Dust", "Forming", "Feet"]
  },
  {
    id: "material-linen",
    name: "Linen",
    category: "materials",
    meaning: "Righteousness, purity, priesthood, and the righteous acts of saints. Fine linen represents moral purity and holiness.",
    keyVerses: ["Revelation 19:8", "Exodus 28:42", "Ezekiel 44:17", "Luke 16:19", "Revelation 15:6"],
    christConnection: "Christ was wrapped in linen for burial. His bride wears fine linen—His righteousness imputed to us.",
    relatedSymbols: ["White", "Priesthood", "Righteousness", "Burial", "Bride"]
  },
  {
    id: "material-wood",
    name: "Wood",
    category: "materials",
    meaning: "Humanity, the cross, burning, and that which is temporary. Wood burns—representing the mortal, perishable nature.",
    keyVerses: ["1 Corinthians 3:12", "1 Peter 2:24", "Galatians 3:13", "Isaiah 44:19", "Deuteronomy 21:23"],
    christConnection: "Christ hung on a tree (wood), bearing the curse. Wood covered with gold (humanity clothed with deity).",
    relatedSymbols: ["Tree", "Cross", "Fire", "Humanity", "Building"]
  },
  {
    id: "material-pearl",
    name: "Pearl",
    category: "materials",
    meaning: "The church, great value, that which is formed through suffering. Pearls are formed when an oyster covers an irritant—beauty from pain.",
    keyVerses: ["Matthew 13:45-46", "Revelation 21:21", "Matthew 7:6", "1 Timothy 2:9"],
    christConnection: "Christ gave all He had for the pearl of great price—His church, formed through His suffering.",
    relatedSymbols: ["Church", "Kingdom", "Gates", "Value", "Suffering"]
  },
  {
    id: "material-precious-stones",
    name: "Precious Stones",
    category: "materials",
    meaning: "Glory, beauty, the character of God, and eternal value. Twelve stones on the high priest's breastplate represented the tribes.",
    keyVerses: ["Exodus 28:17-21", "Revelation 21:19-20", "Ezekiel 28:13", "Isaiah 54:11-12", "1 Chronicles 29:2"],
    christConnection: "Christ is the living stone. New Jerusalem's foundations are precious stones—displaying God's multifaceted glory.",
    relatedSymbols: ["Breastplate", "Foundations", "Glory", "Tribes", "Beauty"]
  },

  // ============================================
  // BODY PARTS
  // ============================================
  {
    id: "body-eye",
    name: "Eye",
    category: "body",
    meaning: "Perception, spiritual insight, understanding, desire, and judgment. Eyes represent how we see spiritually—single or evil.",
    keyVerses: ["Matthew 6:22-23", "Proverbs 15:3", "Revelation 1:14", "Psalm 32:8", "Ephesians 1:18"],
    christConnection: "Christ has eyes like flames of fire—penetrating, judging, seeing all. He opens blind eyes.",
    relatedSymbols: ["Vision", "Light", "Understanding", "Lamp", "Sight"]
  },
  {
    id: "body-hand",
    name: "Hand",
    category: "body",
    meaning: "Power, action, authority, blessing, and work. The hand represents God's activity and man's deeds.",
    keyVerses: ["Isaiah 59:1", "Psalm 139:10", "Acts 4:28", "Hebrews 10:31", "John 10:28-29"],
    christConnection: "Christ's pierced hands secured our salvation. He holds us in His hand—none can snatch us away.",
    relatedSymbols: ["Right Hand", "Power", "Work", "Blessing", "Nail Prints"]
  },
  {
    id: "body-heart",
    name: "Heart",
    category: "body",
    meaning: "The inner person, will, emotions, decisions, and the seat of spiritual life. The heart is where transformation occurs.",
    keyVerses: ["Proverbs 4:23", "Jeremiah 17:9", "Ezekiel 36:26", "Matthew 15:19", "Romans 10:10"],
    christConnection: "Christ searches hearts. He gives us new hearts of flesh, removing hearts of stone.",
    relatedSymbols: ["Mind", "Will", "Stone", "Flesh", "Circumcision"]
  },
  {
    id: "body-head",
    name: "Head",
    category: "body",
    meaning: "Authority, leadership, source, and governance. The head represents ruling power and the origin of direction.",
    keyVerses: ["Ephesians 1:22", "Colossians 1:18", "1 Corinthians 11:3", "Ephesians 4:15", "Daniel 2:38"],
    christConnection: "Christ is the head of the church, of every man, and of all principality. We are His body.",
    relatedSymbols: ["Crown", "Authority", "Church", "Body", "Gold"]
  },
  {
    id: "body-feet",
    name: "Feet",
    category: "body",
    meaning: "Walk, conduct, foundation, subjection, and readiness. Feet represent one's manner of life and place of standing.",
    keyVerses: ["Romans 10:15", "Ephesians 6:15", "Revelation 1:15", "Psalm 8:6", "1 Corinthians 15:25"],
    christConnection: "All things are put under Christ's feet. His feet are like burnished bronze—He has walked through judgment.",
    relatedSymbols: ["Walk", "Gospel", "Authority", "Bronze", "Subjection"]
  },
  {
    id: "body-tongue",
    name: "Tongue",
    category: "body",
    meaning: "Speech, confession, blessing or cursing, and testimony. The tongue has power of life and death.",
    keyVerses: ["James 3:5-8", "Proverbs 18:21", "Psalm 45:1", "Romans 10:9", "Revelation 5:9"],
    christConnection: "Christ spoke and worlds were created. Every tongue will confess He is Lord.",
    relatedSymbols: ["Words", "Fire", "Confession", "Sword", "Praise"]
  },
  {
    id: "body-ear",
    name: "Ear",
    category: "body",
    meaning: "Hearing, obedience, responsiveness to God's Word. Ears represent receptivity to divine communication.",
    keyVerses: ["Revelation 2:7", "Matthew 11:15", "Isaiah 50:5", "Psalm 40:6", "Romans 10:17"],
    christConnection: "Christ had His ear opened each morning. He calls us to hear what the Spirit says to the churches.",
    relatedSymbols: ["Hearing", "Obedience", "Word", "Servant", "Spirit"]
  },
  {
    id: "body-blood",
    name: "Blood",
    category: "body",
    meaning: "Life, atonement, cleansing, covenant, and sacrifice. Blood is the life of the flesh—poured out, it makes atonement.",
    keyVerses: ["Leviticus 17:11", "Hebrews 9:22", "1 John 1:7", "Revelation 12:11", "Ephesians 1:7"],
    christConnection: "Christ's blood is the new covenant, shed for many for remission of sins. We overcome by the blood of the Lamb.",
    relatedSymbols: ["Life", "Atonement", "Covenant", "Red", "Sacrifice"]
  },

  // ============================================
  // ACTIONS & RITUALS
  // ============================================
  {
    id: "action-washing",
    name: "Washing",
    category: "actions",
    meaning: "Cleansing, purification, regeneration, and preparation for service. Washing represents the removal of defilement.",
    keyVerses: ["John 13:5-10", "Titus 3:5", "Hebrews 10:22", "Ephesians 5:26", "Exodus 30:19-21"],
    christConnection: "Christ washes us by His Word. He washed disciples' feet—cleansing for service and fellowship.",
    relatedSymbols: ["Water", "Word", "Feet", "Laver", "Baptism"]
  },
  {
    id: "action-anointing",
    name: "Anointing",
    category: "actions",
    meaning: "Consecration, the Holy Spirit, appointment to office, and empowerment. Anointing sets apart for sacred service.",
    keyVerses: ["1 Samuel 16:13", "Luke 4:18", "1 John 2:27", "James 5:14", "Exodus 30:25"],
    christConnection: "Christ (Messiah) means 'Anointed One.' He was anointed with the Spirit without measure.",
    relatedSymbols: ["Oil", "Spirit", "King", "Priest", "Prophet"]
  },
  {
    id: "action-laying-hands",
    name: "Laying on of Hands",
    category: "actions",
    meaning: "Identification, transference, blessing, ordination, and impartation. Hands laid on represent connection and transfer.",
    keyVerses: ["Numbers 27:18-23", "Acts 6:6", "Acts 8:17", "Hebrews 6:2", "Leviticus 16:21"],
    christConnection: "Christ laid hands on children to bless. Sins were laid on Him as our substitute.",
    relatedSymbols: ["Blessing", "Ordination", "Healing", "Spirit", "Transference"]
  },
  {
    id: "action-circumcision",
    name: "Circumcision",
    category: "actions",
    meaning: "Covenant sign, cutting away flesh, heart transformation, and belonging to God. Physical circumcision pointed to spiritual circumcision.",
    keyVerses: ["Genesis 17:10-14", "Romans 2:29", "Colossians 2:11", "Philippians 3:3", "Deuteronomy 10:16"],
    christConnection: "Christ provides circumcision of the heart—cutting away the sinful nature, not done by human hands.",
    relatedSymbols: ["Covenant", "Heart", "Flesh", "Eighth Day", "Knife"]
  },
  {
    id: "action-sacrifice",
    name: "Sacrifice / Offering",
    category: "actions",
    meaning: "Atonement, worship, surrender, substitution, and approaching God. Sacrifices covered sin and restored fellowship.",
    keyVerses: ["Hebrews 10:10", "Romans 12:1", "Ephesians 5:2", "Leviticus 1-7", "Genesis 4:4"],
    christConnection: "Christ offered Himself once for all—the ultimate sacrifice that ended all animal sacrifices.",
    relatedSymbols: ["Altar", "Blood", "Lamb", "Fire", "Priest"]
  },
  {
    id: "action-baptism",
    name: "Baptism",
    category: "actions",
    meaning: "Death and resurrection, identification with Christ, cleansing, and public confession. Baptism symbolizes burial and new life.",
    keyVerses: ["Romans 6:3-4", "Matthew 28:19", "Acts 2:38", "1 Peter 3:21", "Colossians 2:12"],
    christConnection: "Christ was baptized to fulfill all righteousness. We are baptized into His death and resurrection.",
    relatedSymbols: ["Water", "Death", "Burial", "Resurrection", "Spirit"]
  },
  {
    id: "action-fasting",
    name: "Fasting",
    category: "actions",
    meaning: "Humility, seeking God, mourning, spiritual focus, and self-denial. Fasting expresses dependence on God alone.",
    keyVerses: ["Matthew 6:16-18", "Isaiah 58:6", "Joel 2:12", "Acts 13:2", "Matthew 4:2"],
    christConnection: "Christ fasted 40 days before beginning His ministry. He taught proper fasting motivation.",
    relatedSymbols: ["Prayer", "Humility", "Mourning", "Wilderness", "Forty"]
  },

  // ============================================
  // PLACES
  // ============================================
  {
    id: "place-eden",
    name: "Eden",
    category: "places",
    meaning: "Paradise, God's presence, innocence, and the original blessing. Eden represents what was lost and will be restored.",
    keyVerses: ["Genesis 2:8", "Ezekiel 28:13", "Isaiah 51:3", "Revelation 22:1-3", "Joel 2:3"],
    christConnection: "Christ restores access to the Tree of Life. The New Jerusalem fulfills what Eden began.",
    relatedSymbols: ["Garden", "River", "Tree of Life", "Paradise", "Cherubim"]
  },
  {
    id: "place-tabernacle",
    name: "Tabernacle / Temple",
    category: "places",
    meaning: "God's dwelling, His presence with humanity, worship, and the meeting place. The tabernacle mapped access to God.",
    keyVerses: ["Exodus 25:8", "John 1:14", "Hebrews 9:11", "1 Corinthians 3:16", "Revelation 21:3"],
    christConnection: "Christ 'tabernacled' among us. He is the true temple—destroyed and raised in three days.",
    relatedSymbols: ["Dwelling", "Presence", "Veil", "Holy of Holies", "Glory"]
  },
  {
    id: "place-altar",
    name: "Altar (Place)",
    category: "places",
    meaning: "Meeting place with God, sacrifice, commitment, and worship. The altar is where offerings are made and covenants sealed.",
    keyVerses: ["Genesis 8:20", "Exodus 20:24", "Matthew 5:23-24", "Hebrews 13:10", "Revelation 6:9"],
    christConnection: "Christ is both our altar and sacrifice. The cross is the altar where atonement was made.",
    relatedSymbols: ["Sacrifice", "Fire", "Horns", "Blood", "Worship"]
  },
  {
    id: "place-jordan",
    name: "Jordan River",
    category: "places",
    meaning: "Death, crossing over, entering promise, and transition. Jordan represents the barrier between wilderness and inheritance.",
    keyVerses: ["Joshua 3:17", "2 Kings 2:8", "Matthew 3:13", "2 Kings 5:10", "Mark 1:9"],
    christConnection: "Christ was baptized in the Jordan—identifying with sinners and beginning His ministry.",
    relatedSymbols: ["Crossing", "Death", "Promise", "Baptism", "Ark"]
  },
  {
    id: "place-sinai",
    name: "Mount Sinai",
    category: "places",
    meaning: "Law, covenant, fear, thunder, and the old covenant. Sinai represents the terrifying holiness of God and law given.",
    keyVerses: ["Exodus 19:18", "Galatians 4:24-25", "Hebrews 12:18-21", "Deuteronomy 5:2"],
    christConnection: "Christ fulfilled the law given at Sinai. We come not to Sinai but to Zion—grace not law.",
    relatedSymbols: ["Law", "Fire", "Thunder", "Moses", "Tablets"]
  },
  {
    id: "place-zion",
    name: "Mount Zion",
    category: "places",
    meaning: "The heavenly Jerusalem, God's dwelling, the church, and eternal kingdom. Zion represents grace as opposed to Sinai's law.",
    keyVerses: ["Hebrews 12:22", "Psalm 48:2", "Isaiah 2:3", "Revelation 14:1", "Psalm 132:13"],
    christConnection: "Christ the Lamb stands on Mount Zion. We have come to Zion—the city of the living God.",
    relatedSymbols: ["Jerusalem", "Church", "Kingdom", "Lamb", "144,000"]
  },

  // ============================================
  // GARMENTS
  // ============================================
  {
    id: "garment-robe",
    name: "Robe",
    category: "garments",
    meaning: "Righteousness, status, identity, and covering. Robes represent the position and character of the wearer.",
    keyVerses: ["Isaiah 61:10", "Revelation 7:9", "Luke 15:22", "Genesis 37:3", "Revelation 19:13"],
    christConnection: "Christ's robe was dipped in blood. He clothes us with robes of righteousness.",
    relatedSymbols: ["Righteousness", "White", "Blood", "Covering", "Honor"]
  },
  {
    id: "garment-armor",
    name: "Armor",
    category: "garments",
    meaning: "Spiritual warfare, protection, readiness, and Christ as our defense. The armor represents spiritual weapons and protection.",
    keyVerses: ["Ephesians 6:11-17", "Romans 13:12", "1 Thessalonians 5:8", "Isaiah 59:17"],
    christConnection: "Christ is our armor. Each piece represents an aspect of His person: truth, righteousness, peace, faith, salvation, the Word.",
    relatedSymbols: ["Warfare", "Shield", "Sword", "Helmet", "Breastplate"]
  },
  {
    id: "garment-sackcloth",
    name: "Sackcloth",
    category: "garments",
    meaning: "Mourning, repentance, humility, and grief. Sackcloth expresses sorrow for sin or loss.",
    keyVerses: ["Joel 1:13", "Matthew 11:21", "Revelation 11:3", "Jonah 3:5", "Esther 4:1"],
    christConnection: "Christ transforms our sackcloth into robes of joy. The two witnesses prophesy in sackcloth.",
    relatedSymbols: ["Ashes", "Mourning", "Repentance", "Fasting", "Humility"]
  },
  {
    id: "garment-ephod",
    name: "Ephod",
    category: "garments",
    meaning: "Priesthood, intercession, and bearing names before God. The high priest's ephod represented his mediatorial role.",
    keyVerses: ["Exodus 28:6-14", "1 Samuel 23:9-12", "Hosea 3:4", "Exodus 39:2-7"],
    christConnection: "Christ our High Priest bears our names on His heart. He ever lives to intercede.",
    relatedSymbols: ["High Priest", "Breastplate", "Onyx", "Stones", "Intercession"]
  },

  // ============================================
  // FOOD & DRINK
  // ============================================
  {
    id: "food-manna",
    name: "Manna",
    category: "food",
    meaning: "Daily provision, Christ the bread from heaven, God's supernatural supply. Manna sustained Israel in the wilderness.",
    keyVerses: ["Exodus 16:14-15", "John 6:31-35", "Revelation 2:17", "Deuteronomy 8:3", "Psalm 78:24"],
    christConnection: "Christ is the true manna—the living bread from heaven. He gives the hidden manna to overcomers.",
    relatedSymbols: ["Bread", "Wilderness", "Daily", "Honey", "Frost"]
  },
  {
    id: "food-wine",
    name: "Wine",
    category: "food",
    meaning: "Blood of Christ, joy, the Spirit, judgment, and covenant. Wine represents both blessing and the cup of wrath.",
    keyVerses: ["Matthew 26:28-29", "John 2:1-11", "Ephesians 5:18", "Revelation 14:10", "Psalm 104:15"],
    christConnection: "Christ's first miracle was water to wine. His blood is the wine of the new covenant.",
    relatedSymbols: ["Blood", "Cup", "Vine", "Joy", "Wrath"]
  },
  {
    id: "food-milk",
    name: "Milk",
    category: "food",
    meaning: "Basic nourishment, elementary truth, and spiritual infancy. Milk is for babies—the beginning of spiritual diet.",
    keyVerses: ["Hebrews 5:12-13", "1 Peter 2:2", "1 Corinthians 3:2", "Isaiah 55:1", "Exodus 3:8"],
    christConnection: "Christ leads us to maturity—from milk to solid food, from elementary truths to depths of wisdom.",
    relatedSymbols: ["Babies", "Growth", "Elementary", "Word", "Honey"]
  },
  {
    id: "food-honey",
    name: "Honey",
    category: "food",
    meaning: "Sweetness, God's Word, abundance, and pleasure. Honey represents the delightful nature of God's truth.",
    keyVerses: ["Psalm 119:103", "Psalm 19:10", "Ezekiel 3:3", "Proverbs 24:13", "Exodus 3:8"],
    christConnection: "God's words are sweeter than honey. The land He promised flows with milk and honey—abundance.",
    relatedSymbols: ["Word", "Sweetness", "Land", "Abundance", "Manna"]
  },
  {
    id: "food-salt",
    name: "Salt",
    category: "food",
    meaning: "Preservation, covenant, flavor, and influence. Salt prevents corruption and adds taste—representing godly influence.",
    keyVerses: ["Matthew 5:13", "Colossians 4:6", "Leviticus 2:13", "Mark 9:50", "2 Kings 2:20-21"],
    christConnection: "Christ calls us the salt of the earth—preserving and flavoring the world with His character.",
    relatedSymbols: ["Covenant", "Preservation", "Earth", "Flavor", "Speech"]
  },
  {
    id: "food-leaven",
    name: "Leaven / Yeast",
    category: "food",
    meaning: "Corruption, sin, hypocrisy, but also the kingdom's spreading influence. Leaven permeates and transforms.",
    keyVerses: ["Matthew 16:6", "1 Corinthians 5:6-8", "Matthew 13:33", "Galatians 5:9", "Exodus 12:15"],
    christConnection: "Christ warns of the leaven of the Pharisees. He is our Passover—we keep the feast without leaven.",
    relatedSymbols: ["Unleavened", "Passover", "Sin", "Kingdom", "Spreading"]
  },

  // ============================================
  // TIME & SEASONS
  // ============================================
  {
    id: "time-sabbath",
    name: "Sabbath",
    category: "time",
    meaning: "Rest, completion, sanctification, and ceasing from works. The Sabbath points to eternal rest in Christ.",
    keyVerses: ["Genesis 2:2-3", "Hebrews 4:9-10", "Exodus 20:8-11", "Mark 2:27-28", "Colossians 2:16-17"],
    christConnection: "Christ is Lord of the Sabbath. He IS our Sabbath rest—we cease from our works as God did from His.",
    relatedSymbols: ["Rest", "Seven", "Holy", "Creation", "Ceasing"]
  },
  {
    id: "time-passover",
    name: "Passover",
    category: "time",
    meaning: "Deliverance, salvation, the blood's protection, and freedom from bondage. Passover commemorates God's redemptive act.",
    keyVerses: ["Exodus 12:13", "1 Corinthians 5:7", "John 1:29", "Luke 22:15", "Hebrews 11:28"],
    christConnection: "Christ our Passover is sacrificed for us. He fulfilled Passover by dying as the Lamb at the exact hour.",
    relatedSymbols: ["Lamb", "Blood", "Doorpost", "Egypt", "Haste"]
  },
  {
    id: "time-pentecost",
    name: "Pentecost / Feast of Weeks",
    category: "time",
    meaning: "The Holy Spirit, harvest, the church's birth, and firstfruits. Pentecost celebrates 50 days after Passover.",
    keyVerses: ["Acts 2:1-4", "Leviticus 23:15-16", "Exodus 34:22", "Deuteronomy 16:10"],
    christConnection: "Christ sent the Spirit at Pentecost—the firstfruits of resurrection power, birthing the church.",
    relatedSymbols: ["Spirit", "Fire", "Fifty", "Harvest", "Firstfruits"]
  },
  {
    id: "time-tabernacles",
    name: "Feast of Tabernacles",
    category: "time",
    meaning: "God dwelling with man, harvest completion, millennial rest, and celebration. Tabernacles celebrates the final ingathering.",
    keyVerses: ["Leviticus 23:34-43", "John 7:37-38", "Zechariah 14:16", "Revelation 21:3", "Nehemiah 8:14-17"],
    christConnection: "Christ fulfills Tabernacles when He 'tabernacles' eternally with His people in the New Jerusalem.",
    relatedSymbols: ["Booths", "Water", "Joy", "Harvest", "Dwelling"]
  },
  {
    id: "time-jubilee",
    name: "Jubilee",
    category: "time",
    meaning: "Liberty, restoration, return to inheritance, and ultimate redemption. Every 50th year, slaves were freed and land returned.",
    keyVerses: ["Leviticus 25:10", "Isaiah 61:1-2", "Luke 4:18-19", "Leviticus 25:8-17"],
    christConnection: "Christ proclaimed the acceptable year of the Lord—the great Jubilee, freedom for captives.",
    relatedSymbols: ["Freedom", "Fifty", "Trumpet", "Land", "Restoration"]
  },
  {
    id: "time-day-of-atonement",
    name: "Day of Atonement",
    category: "time",
    meaning: "Cleansing, judgment, confession, and access to God's presence. Yom Kippur was the holiest day—when the high priest entered the Most Holy.",
    keyVerses: ["Leviticus 16", "Hebrews 9:7", "Hebrews 10:19-22", "Romans 3:25", "Leviticus 23:27-28"],
    christConnection: "Christ entered the true Holy of Holies with His own blood—making atonement once for all.",
    relatedSymbols: ["Blood", "Scapegoat", "High Priest", "Veil", "Mercy Seat"]
  },
  {
    id: "time-firstfruits",
    name: "Firstfruits",
    category: "time",
    meaning: "Resurrection, the beginning of harvest, Christ's resurrection, and pledge of more to come. Firstfruits were waved before the Lord.",
    keyVerses: ["Leviticus 23:10-11", "1 Corinthians 15:20-23", "James 1:18", "Romans 8:23", "Revelation 14:4"],
    christConnection: "Christ is the firstfruits of resurrection—the first to rise, guaranteeing our resurrection.",
    relatedSymbols: ["Resurrection", "Harvest", "Wave Offering", "Spring", "Pledge"]
  },
  {
    id: "time-night",
    name: "Night",
    category: "time",
    meaning: "Darkness, evil, spiritual blindness, tribulation, and the time before Christ's return. Night represents the absence of the Sun of Righteousness.",
    keyVerses: ["Romans 13:12", "1 Thessalonians 5:5", "John 9:4", "John 13:30", "Revelation 21:25"],
    christConnection: "Christ works while it is day. When He returns, there will be no more night—He is the eternal light.",
    relatedSymbols: ["Darkness", "Moon", "Stars", "Coming", "Thief"]
  },
  {
    id: "time-morning",
    name: "Morning",
    category: "time",
    meaning: "Resurrection, new beginnings, hope, and Christ's return. Morning ends the night—joy comes in the morning.",
    keyVerses: ["Psalm 30:5", "2 Peter 1:19", "Revelation 22:16", "Mark 16:2", "Lamentations 3:22-23"],
    christConnection: "Christ is the Bright Morning Star—the first light of the eternal day. He rose early on the first day.",
    relatedSymbols: ["Resurrection", "Star", "Dawn", "Joy", "New Mercies"]
  }
];

// Helper function to get symbols by category
export const getSymbolsByCategory = (category: SymbolCategory): BibleSymbol[] => {
  return bibleSymbolLibrary.filter(s => s.category === category);
};

// Helper function to get all categories with symbol counts
export const getCategoriesWithCounts = (): { category: SymbolCategoryInfo; count: number }[] => {
  return symbolCategories.map(cat => ({
    category: cat,
    count: bibleSymbolLibrary.filter(s => s.category === cat.id).length
  }));
};

// Helper function to search symbols
export const searchSymbols = (query: string): BibleSymbol[] => {
  const lowerQuery = query.toLowerCase();
  return bibleSymbolLibrary.filter(symbol =>
    symbol.name.toLowerCase().includes(lowerQuery) ||
    symbol.meaning.toLowerCase().includes(lowerQuery) ||
    symbol.keyVerses.some(v => v.toLowerCase().includes(lowerQuery)) ||
    (symbol.christConnection && symbol.christConnection.toLowerCase().includes(lowerQuery)) ||
    (symbol.relatedSymbols && symbol.relatedSymbols.some(r => r.toLowerCase().includes(lowerQuery)))
  );
};

// Get total symbol count
export const getTotalSymbolCount = (): number => {
  return bibleSymbolLibrary.length;
};

// Get symbol by ID
export const getSymbolById = (id: string): BibleSymbol | undefined => {
  return bibleSymbolLibrary.find(s => s.id === id);
};
