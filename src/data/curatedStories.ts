export interface BiblicalStory {
  id: string;
  title: string;
  book: string;
  reference: string;
  description: string;
  icon: string;
  category?: string;
}

export const CURATED_STORIES: BiblicalStory[] = [
  // ===== GENESIS & PATRIARCHS =====
  { id: "creation", title: "The Creation", book: "Genesis", reference: "Genesis 1–2", description: "God speaks the universe into existence in six days and rests on the seventh", icon: "🌍", category: "Genesis" },
  { id: "fall-of-man", title: "The Fall of Man", book: "Genesis", reference: "Genesis 3", description: "The serpent deceives Eve — humanity's innocence lost at the forbidden tree", icon: "🍎", category: "Genesis" },
  { id: "cain-abel", title: "Cain & Abel", book: "Genesis", reference: "Genesis 4", description: "The first murder — two brothers, two offerings, one deadly jealousy", icon: "🩸", category: "Genesis" },
  { id: "noahs-ark", title: "Noah's Ark & the Flood", book: "Genesis", reference: "Genesis 6–9", description: "One righteous man, one ark, one global flood — and a rainbow promise", icon: "🌈", category: "Genesis" },
  { id: "tower-of-babel", title: "The Tower of Babel", book: "Genesis", reference: "Genesis 11:1-9", description: "Humanity unites in rebellion — God scatters them with confused tongues", icon: "🗼", category: "Genesis" },
  { id: "abrahams-call", title: "The Call of Abraham", book: "Genesis", reference: "Genesis 12", description: "Leave everything — God calls one man to father a nation of faith", icon: "🏕️", category: "Genesis" },
  { id: "sodom-gomorrah", title: "Sodom & Gomorrah", book: "Genesis", reference: "Genesis 18–19", description: "Abraham bargains with God — fire rains on two cities of wickedness", icon: "🔥", category: "Genesis" },
  { id: "abraham-isaac-moriah", title: "Abraham & Isaac on Moriah", book: "Genesis", reference: "Genesis 22", description: "The ultimate test of faith — God will provide Himself a lamb", icon: "🐑", category: "Genesis" },
  { id: "jacob-esau", title: "Jacob & Esau", book: "Genesis", reference: "Genesis 25–27", description: "Twin brothers, a stolen birthright, and a bowl of red stew", icon: "🍲", category: "Genesis" },
  { id: "jacobs-ladder", title: "Jacob's Ladder", book: "Genesis", reference: "Genesis 28:10-22", description: "A fugitive sleeps on stone and dreams of angels ascending to heaven", icon: "🪜", category: "Genesis" },
  { id: "jacob-wrestles-god", title: "Jacob Wrestles with God", book: "Genesis", reference: "Genesis 32:22-32", description: "All night he fought — and refused to let go until blessed", icon: "💪", category: "Genesis" },
  { id: "joseph-sold", title: "Joseph Sold into Slavery", book: "Genesis", reference: "Genesis 37", description: "A coat of many colors, jealous brothers, and a pit that leads to Egypt", icon: "👔", category: "Genesis" },
  { id: "joseph-in-egypt", title: "Joseph's Rise in Egypt", book: "Genesis", reference: "Genesis 39–41", description: "From prison to palace — dreams interpreted, a nation saved from famine", icon: "👑", category: "Genesis" },
  { id: "joseph-forgives", title: "Joseph Forgives His Brothers", book: "Genesis", reference: "Genesis 45", description: "What you meant for evil, God meant for good — a tearful reunion", icon: "😭", category: "Genesis" },

  // ===== EXODUS & WILDERNESS =====
  { id: "baby-moses", title: "Baby Moses in the Basket", book: "Exodus", reference: "Exodus 2:1-10", description: "A mother's desperate faith — a baby in a basket on the Nile", icon: "🧒", category: "Exodus" },
  { id: "burning-bush", title: "The Burning Bush", book: "Exodus", reference: "Exodus 3", description: "A bush burns but is not consumed — God reveals His name: I AM", icon: "🔥", category: "Exodus" },
  { id: "ten-plagues", title: "The Ten Plagues of Egypt", book: "Exodus", reference: "Exodus 7–12", description: "Blood, frogs, darkness, death — God breaks Pharaoh's grip on His people", icon: "🐸", category: "Exodus" },
  { id: "passover", title: "The First Passover", book: "Exodus", reference: "Exodus 12", description: "The lamb's blood on the doorpost — death passes over the faithful", icon: "🩸", category: "Exodus" },
  { id: "red-sea-crossing", title: "Crossing the Red Sea", book: "Exodus", reference: "Exodus 14", description: "Walls of water, dry ground, and Pharaoh's army swallowed by the sea", icon: "🌊", category: "Exodus" },
  { id: "manna-from-heaven", title: "Manna from Heaven", book: "Exodus", reference: "Exodus 16", description: "Daily bread falls from the sky — enough for today, trust for tomorrow", icon: "🍞", category: "Exodus" },
  { id: "ten-commandments", title: "The Ten Commandments", book: "Exodus", reference: "Exodus 19–20", description: "Thunder, fire, and the voice of God — the law written in stone", icon: "📜", category: "Exodus" },
  { id: "golden-calf", title: "The Golden Calf", book: "Exodus", reference: "Exodus 32", description: "While Moses meets God on the mountain, Israel builds an idol below", icon: "🐂", category: "Exodus" },
  { id: "water-from-rock", title: "Water from the Rock", book: "Numbers", reference: "Numbers 20:1-13", description: "Moses strikes the rock — water gushes, but disobedience costs the Promised Land", icon: "💧", category: "Exodus" },
  { id: "bronze-serpent", title: "The Bronze Serpent", book: "Numbers", reference: "Numbers 21:4-9", description: "Look and live — a serpent lifted up foreshadows the cross", icon: "🐍", category: "Exodus" },
  { id: "balaams-donkey", title: "Balaam's Talking Donkey", book: "Numbers", reference: "Numbers 22", description: "A prophet blinded by greed — his donkey sees the angel he cannot", icon: "🫏", category: "Exodus" },

  // ===== CONQUEST & JUDGES =====
  { id: "rahab-spies", title: "Rahab & the Spies", book: "Joshua", reference: "Joshua 2", description: "A Canaanite woman hides Israel's spies — a scarlet cord saves her family", icon: "🧵", category: "Judges" },
  { id: "jericho-walls", title: "The Fall of Jericho", book: "Joshua", reference: "Joshua 6", description: "Seven days of marching, seven trumpets blasting — the walls come tumbling down", icon: "🎺", category: "Judges" },
  { id: "gideon-fleece", title: "Gideon & the Fleece", book: "Judges", reference: "Judges 6–7", description: "300 men with torches and trumpets defeat an army like the sand of the sea", icon: "🏺", category: "Judges" },
  { id: "samson-delilah", title: "Samson & Delilah", book: "Judges", reference: "Judges 16", description: "The strongest man undone by a secret and a woman's persistence", icon: "💈", category: "Judges" },
  { id: "ruth-boaz", title: "Ruth & Boaz", book: "Ruth", reference: "Ruth 1–4", description: "A Moabite widow's loyalty leads her to the threshing floor — and into Christ's lineage", icon: "🌾", category: "Judges" },

  // ===== UNITED KINGDOM =====
  { id: "hannah-prayer", title: "Hannah's Prayer", book: "1 Samuel", reference: "1 Samuel 1", description: "A barren woman weeps in the temple — God hears and gives her Samuel", icon: "🙏", category: "Kingdom" },
  { id: "samuel-called", title: "God Calls Young Samuel", book: "1 Samuel", reference: "1 Samuel 3", description: "A boy hears his name in the night — 'Speak, Lord, your servant hears'", icon: "👂", category: "Kingdom" },
  { id: "saul-anointed", title: "Saul Anointed King", book: "1 Samuel", reference: "1 Samuel 9–10", description: "A tall Benjamite searching for donkeys finds a crown instead", icon: "🫅", category: "Kingdom" },
  { id: "jonathan-armor-bearer", title: "Jonathan & His Armor Bearer", book: "1 Samuel", reference: "1 Samuel 14", description: "Two men against a garrison — faith that moves mountains", icon: "⚔️", category: "Kingdom" },
  { id: "david-goliath", title: "David & Goliath", book: "1 Samuel", reference: "1 Samuel 17", description: "A shepherd boy faces the giant with five stones and faith", icon: "🪨", category: "Kingdom" },
  { id: "david-jonathan", title: "David & Jonathan's Friendship", book: "1 Samuel", reference: "1 Samuel 18–20", description: "A covenant of loyalty stronger than blood — surpassing the love of women", icon: "🤝", category: "Kingdom" },
  { id: "david-spares-saul", title: "David Spares Saul", book: "1 Samuel", reference: "1 Samuel 24", description: "In a dark cave, David cuts Saul's robe but refuses to touch God's anointed", icon: "🗡️", category: "Kingdom" },
  { id: "david-bathsheba", title: "David & Bathsheba", book: "2 Samuel", reference: "2 Samuel 11–12", description: "A king's lust, a soldier's murder, and a prophet's devastating parable", icon: "⚖️", category: "Kingdom" },
  { id: "absaloms-rebellion", title: "Absalom's Rebellion", book: "2 Samuel", reference: "2 Samuel 15–18", description: "A son steals his father's throne — David flees weeping up the Mount of Olives", icon: "😢", category: "Kingdom" },
  { id: "solomon-wisdom", title: "Solomon Asks for Wisdom", book: "1 Kings", reference: "1 Kings 3", description: "God offers anything — the young king chooses wisdom over wealth", icon: "🧠", category: "Kingdom" },
  { id: "solomons-temple", title: "Solomon Builds the Temple", book: "1 Kings", reference: "1 Kings 6–8", description: "Seven years of cedar, gold, and glory — the cloud of God fills the house", icon: "🏛️", category: "Kingdom" },

  // ===== PROPHETS & DIVIDED KINGDOM =====
  { id: "elijah-prophets-baal", title: "Elijah vs. the Prophets of Baal", book: "1 Kings", reference: "1 Kings 18", description: "One prophet against 450 — fire falls from heaven on a drenched altar", icon: "🔥", category: "Prophets" },
  { id: "elijah-still-small-voice", title: "Elijah & the Still Small Voice", book: "1 Kings", reference: "1 Kings 19", description: "After fire and earthquake, God whispers — and the broken prophet listens", icon: "🌬️", category: "Prophets" },
  { id: "elijah-chariot-fire", title: "Elijah's Chariot of Fire", book: "2 Kings", reference: "2 Kings 2:1-14", description: "A whirlwind, a chariot of fire — Elijah ascends and Elisha receives the mantle", icon: "🔥", category: "Prophets" },
  { id: "naaman-healed", title: "Naaman the Leper Healed", book: "2 Kings", reference: "2 Kings 5", description: "A proud general, a servant girl's faith, and seven dips in the Jordan", icon: "🏊", category: "Prophets" },
  { id: "elisha-chariots-fire", title: "Elisha & the Invisible Army", book: "2 Kings", reference: "2 Kings 6:8-23", description: "Open his eyes, Lord — the hills are full of horses and chariots of fire", icon: "👁️", category: "Prophets" },
  { id: "hezekiah-prayer", title: "Hezekiah's Prayer & Deliverance", book: "2 Kings", reference: "2 Kings 19", description: "Assyria surrounds Jerusalem — one night, one angel, 185,000 slain", icon: "😇", category: "Prophets" },
  { id: "josiah-finds-law", title: "Josiah Finds the Lost Book of the Law", book: "2 Kings", reference: "2 Kings 22–23", description: "A boy king discovers the forgotten Scripture — revival sweeps the nation", icon: "📖", category: "Prophets" },
  { id: "isaiah-vision", title: "Isaiah's Throne Room Vision", book: "Isaiah", reference: "Isaiah 6", description: "Holy, holy, holy — the prophet sees God's glory and his own unclean lips", icon: "👼", category: "Prophets" },
  { id: "jeremiahs-call", title: "Jeremiah's Call", book: "Jeremiah", reference: "Jeremiah 1", description: "Before I formed you in the womb I knew you — a young prophet's reluctant commission", icon: "📢", category: "Prophets" },

  // ===== EXILE & RETURN =====
  { id: "daniel-food-test", title: "Daniel's Food Test", book: "Daniel", reference: "Daniel 1", description: "Four Hebrew youths refuse the king's dainties — and outshine all Babylon", icon: "🥦", category: "Exile" },
  { id: "fiery-furnace", title: "The Fiery Furnace", book: "Daniel", reference: "Daniel 3", description: "Three men refuse to bow — a fourth figure walks in the flames", icon: "🔥", category: "Exile" },
  { id: "handwriting-wall", title: "The Handwriting on the Wall", book: "Daniel", reference: "Daniel 5", description: "A ghostly hand writes doom on Belshazzar's palace wall — MENE, MENE, TEKEL, UPHARSIN", icon: "✋", category: "Exile" },
  { id: "daniel-lions-den", title: "Daniel in the Lions' Den", book: "Daniel", reference: "Daniel 6", description: "Faithfulness under decree — the lions' mouths are shut by an angel", icon: "🦁", category: "Exile" },
  { id: "esther-saves-people", title: "Esther Saves Her People", book: "Esther", reference: "Esther 4–7", description: "For such a time as this — a queen risks death to stop a genocide", icon: "👸", category: "Exile" },
  { id: "nehemiah-rebuilds", title: "Nehemiah Rebuilds the Walls", book: "Nehemiah", reference: "Nehemiah 2–6", description: "A cupbearer turned builder — sword in one hand, trowel in the other", icon: "🧱", category: "Exile" },
  { id: "ezra-reads-law", title: "Ezra Reads the Law", book: "Nehemiah", reference: "Nehemiah 8", description: "The people weep as they hear God's Word again after exile — then they celebrate", icon: "📜", category: "Exile" },
  { id: "job-tested", title: "Job Tested by Fire", book: "Job", reference: "Job 1–2, 38–42", description: "A righteous man loses everything — and God answers from the whirlwind", icon: "🌪️", category: "Exile" },
  { id: "jonah-whale", title: "Jonah & the Great Fish", book: "Jonah", reference: "Jonah 1–4", description: "A runaway prophet, a raging sea, three days in darkness — then Nineveh repents", icon: "🐋", category: "Exile" },

  // ===== LIFE OF CHRIST — BIRTH & EARLY MINISTRY =====
  { id: "annunciation", title: "The Annunciation to Mary", book: "Luke", reference: "Luke 1:26-38", description: "An angel visits a teenage girl — nothing is impossible with God", icon: "🕊️", category: "Christ" },
  { id: "birth-of-jesus", title: "The Birth of Jesus", book: "Luke", reference: "Luke 2:1-20", description: "No room in the inn — the King of kings born in a manger", icon: "⭐", category: "Christ" },
  { id: "wise-men", title: "The Wise Men Visit", book: "Matthew", reference: "Matthew 2:1-12", description: "Following a star from the East — gold, frankincense, and myrrh for the newborn King", icon: "🎁", category: "Christ" },
  { id: "boy-jesus-temple", title: "Boy Jesus in the Temple", book: "Luke", reference: "Luke 2:41-52", description: "Three days lost — found teaching the teachers: 'I must be about My Father's business'", icon: "🏛️", category: "Christ" },
  { id: "jesus-baptism", title: "The Baptism of Jesus", book: "Matthew", reference: "Matthew 3:13-17", description: "The heavens open, the Spirit descends, the Father speaks — This is My beloved Son", icon: "💧", category: "Christ" },
  { id: "temptation-wilderness", title: "Temptation in the Wilderness", book: "Matthew", reference: "Matthew 4:1-11", description: "Forty days, three temptations — Jesus answers every attack with 'It is written'", icon: "🏜️", category: "Christ" },
  { id: "water-to-wine", title: "Water Turned to Wine", book: "John", reference: "John 2:1-12", description: "A wedding runs dry — Jesus' first miracle transforms water into the finest wine", icon: "🍷", category: "Christ" },
  { id: "nicodemus", title: "Nicodemus by Night", book: "John", reference: "John 3:1-21", description: "A Pharisee comes in darkness — Jesus reveals that he must be born again", icon: "🌙", category: "Christ" },
  { id: "woman-at-well", title: "The Woman at the Well", book: "John", reference: "John 4:1-42", description: "A Samaritan outcast meets the Living Water — and her whole village believes", icon: "🏺", category: "Christ" },

  // ===== LIFE OF CHRIST — MINISTRY & MIRACLES =====
  { id: "feeding-5000", title: "Feeding the Five Thousand", book: "John", reference: "John 6:1-15", description: "Five loaves, two fish, and twelve baskets left over — more than enough", icon: "🐟", category: "Christ" },
  { id: "walking-on-water", title: "Walking on the Water", book: "Matthew", reference: "Matthew 14:22-33", description: "In the fourth watch, Jesus walks on the storm — Peter steps out and sinks", icon: "🌊", category: "Christ" },
  { id: "transfiguration", title: "The Transfiguration", book: "Matthew", reference: "Matthew 17:1-9", description: "His face shines like the sun — Moses and Elijah appear on the mountain", icon: "✨", category: "Christ" },
  { id: "raising-lazarus", title: "The Raising of Lazarus", book: "John", reference: "John 11:1-44", description: "Four days dead — Jesus weeps, then commands: Lazarus, come forth!", icon: "🪦", category: "Christ" },
  { id: "good-samaritan", title: "The Good Samaritan", book: "Luke", reference: "Luke 10:25-37", description: "A priest passes by, a Levite looks away — the outsider shows true mercy", icon: "🩹", category: "Christ" },
  { id: "prodigal-son", title: "The Prodigal Son", book: "Luke", reference: "Luke 15:11-32", description: "A reckless son, a pig pen, and a father who runs to embrace the returning rebel", icon: "🐖", category: "Christ" },
  { id: "lost-sheep", title: "The Lost Sheep", book: "Luke", reference: "Luke 15:1-7", description: "Ninety-nine safe — but the shepherd searches until the one lost lamb is found", icon: "🐏", category: "Christ" },
  { id: "ten-virgins", title: "The Parable of the Ten Virgins", book: "Matthew", reference: "Matthew 25:1-13", description: "Five were wise, five were foolish — the door shuts and the unprepared are left outside", icon: "🪔", category: "Christ" },
  { id: "talents-parable", title: "The Parable of the Talents", book: "Matthew", reference: "Matthew 25:14-30", description: "Invest or bury? Faithful stewardship rewarded — fear punished", icon: "💰", category: "Christ" },
  { id: "rich-man-lazarus", title: "The Rich Man & Lazarus", book: "Luke", reference: "Luke 16:19-31", description: "Purple robes on earth, torment after — a beggar feasts at Abraham's side", icon: "🔥", category: "Christ" },
  { id: "healing-blind-man", title: "Jesus Heals the Man Born Blind", book: "John", reference: "John 9", description: "Mud on his eyes, wash in Siloam — 'One thing I know: I was blind, now I see'", icon: "👁️", category: "Christ" },

  // ===== PASSION & RESURRECTION =====
  { id: "triumphal-entry", title: "The Triumphal Entry", book: "Matthew", reference: "Matthew 21:1-11", description: "Hosanna! Palm branches and cloaks spread — the King rides in on a donkey", icon: "🌴", category: "Passion" },
  { id: "cleansing-temple", title: "Cleansing the Temple", book: "John", reference: "John 2:13-22", description: "Whip of cords, overturned tables — My house shall be called a house of prayer!", icon: "🏛️", category: "Passion" },
  { id: "last-supper", title: "The Last Supper", book: "Luke", reference: "Luke 22:7-23", description: "Bread broken, wine poured — this is My body, given for you", icon: "🍷", category: "Passion" },
  { id: "foot-washing", title: "Jesus Washes the Disciples' Feet", book: "John", reference: "John 13:1-17", description: "The Master kneels with a towel — true greatness is found in serving", icon: "🦶", category: "Passion" },
  { id: "garden-gethsemane", title: "The Garden of Gethsemane", book: "Matthew", reference: "Matthew 26:36-56", description: "Christ's agony and surrender before the cross — Not my will, but Yours", icon: "🌿", category: "Passion" },
  { id: "peter-denial", title: "Peter's Denial", book: "Luke", reference: "Luke 22:54-62", description: "Three times before the rooster crows — and Jesus turns and looks at Peter", icon: "🐓", category: "Passion" },
  { id: "crucifixion", title: "The Crucifixion", book: "John", reference: "John 19:17-37", description: "It is finished — the Lamb of God dies on the cross for the sins of the world", icon: "✝️", category: "Passion" },
  { id: "resurrection", title: "The Resurrection", book: "Matthew", reference: "Matthew 28:1-10", description: "The stone is rolled away, the tomb is empty — He is risen!", icon: "🌅", category: "Passion" },
  { id: "road-to-emmaus", title: "The Road to Emmaus", book: "Luke", reference: "Luke 24:13-35", description: "Two discouraged disciples walk with a stranger — their hearts burn as He opens Scripture", icon: "🔥", category: "Passion" },
  { id: "doubting-thomas", title: "Doubting Thomas", book: "John", reference: "John 20:24-29", description: "Put your finger here — blessed are those who have not seen and yet believe", icon: "🖐️", category: "Passion" },

  // ===== EARLY CHURCH & REVELATION =====
  { id: "ascension", title: "The Ascension", book: "Acts", reference: "Acts 1:6-11", description: "He is taken up before their eyes — a cloud receives Him, and angels promise His return", icon: "☁️", category: "Church" },
  { id: "pentecost", title: "The Day of Pentecost", book: "Acts", reference: "Acts 2:1-41", description: "Wind, fire, and tongues — the Spirit falls and 3,000 are baptized in a day", icon: "🔥", category: "Church" },
  { id: "stephen-martyred", title: "Stephen the First Martyr", book: "Acts", reference: "Acts 6–7", description: "His face shines like an angel — he sees Jesus standing at God's right hand as stones fall", icon: "🪨", category: "Church" },
  { id: "saul-conversion", title: "Saul's Conversion on Damascus Road", book: "Acts", reference: "Acts 9:1-19", description: "A blinding light, a voice from heaven — the persecutor becomes the apostle", icon: "⚡", category: "Church" },
  { id: "peter-cornelius", title: "Peter & Cornelius", book: "Acts", reference: "Acts 10", description: "A sheet from heaven, unclean animals — God shows Peter the gospel is for all nations", icon: "🕸️", category: "Church" },
  { id: "peter-prison-escape", title: "Peter's Miraculous Prison Escape", book: "Acts", reference: "Acts 12:1-19", description: "Chains fall off, iron gates open by themselves — the church was praying", icon: "⛓️", category: "Church" },
  { id: "paul-shipwreck", title: "Paul's Shipwreck on Malta", book: "Acts", reference: "Acts 27–28", description: "Fourteen days in a storm, a shipwreck, a viper — but not a single life lost", icon: "🚢", category: "Church" },
  { id: "paul-athens", title: "Paul Preaches at Athens", book: "Acts", reference: "Acts 17:16-34", description: "On Mars Hill, Paul declares the Unknown God — some mock, some believe", icon: "🏛️", category: "Church" },
  { id: "vision-patmos", title: "John's Vision on Patmos", book: "Revelation", reference: "Revelation 1", description: "An exiled apostle sees the risen Christ — eyes like fire, voice like many waters", icon: "🏝️", category: "Church" },
  { id: "new-jerusalem", title: "The New Jerusalem", book: "Revelation", reference: "Revelation 21–22", description: "No more tears, no more death — God dwells with His people forever", icon: "🏙️", category: "Church" },
];

export const STORY_CATEGORIES = [
  { id: "all", label: "All Stories" },
  { id: "Genesis", label: "Genesis & Patriarchs" },
  { id: "Exodus", label: "Exodus & Wilderness" },
  { id: "Judges", label: "Conquest & Judges" },
  { id: "Kingdom", label: "United Kingdom" },
  { id: "Prophets", label: "Prophets" },
  { id: "Exile", label: "Exile & Return" },
  { id: "Christ", label: "Life of Christ" },
  { id: "Passion", label: "Passion & Resurrection" },
  { id: "Church", label: "Early Church" },
];
