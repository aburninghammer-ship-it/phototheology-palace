// Christ Every Chapter Library - Finding Jesus in Every Book of the Bible
// This library reveals how Christ is prefigured, typified, and revealed throughout Scripture

export type ChristTypeCategory =
  | "type"
  | "prophecy"
  | "title"
  | "symbol"
  | "theme"
  | "appearance";

export interface ChristType {
  id: string;
  book: string;
  bookNumber: number; // 1-66 for ordering
  testament: "old" | "new";
  title: string;
  christRevealed: string;
  keyVerse: string;
  explanation: string;
  category: ChristTypeCategory;
  connections: string[];
  significance: string;
}

export const christTypesLibrary: ChristType[] = [
  // Genesis - The Seed of the Woman
  {
    id: "ct-gen-1",
    book: "Genesis",
    bookNumber: 1,
    testament: "old",
    title: "The Seed of the Woman",
    christRevealed: "The Promised Deliverer who will crush Satan",
    keyVerse: "Genesis 3:15",
    explanation: "The first Messianic prophecy declares that the 'seed of the woman' would crush the serpent's head. This points to Christ born of a virgin who would defeat Satan at the cross.",
    category: "prophecy",
    connections: ["Galatians 4:4", "Romans 16:20", "Revelation 12:9"],
    significance: "The protoevangelium - the first gospel promise establishing the theme of redemption through Christ."
  },
  {
    id: "ct-gen-2",
    book: "Genesis",
    bookNumber: 1,
    testament: "old",
    title: "The Ark of Salvation",
    christRevealed: "The only means of salvation from judgment",
    keyVerse: "Genesis 6:14",
    explanation: "Noah's ark with its one door pictures Christ as the only way of salvation. Those inside were saved from God's judgment on sin.",
    category: "type",
    connections: ["John 10:9", "1 Peter 3:20-21", "Hebrews 11:7"],
    significance: "Demonstrates that salvation comes only through God's provided way."
  },
  {
    id: "ct-gen-3",
    book: "Genesis",
    bookNumber: 1,
    testament: "old",
    title: "Isaac - The Beloved Son",
    christRevealed: "The only begotten Son offered as a sacrifice",
    keyVerse: "Genesis 22:2",
    explanation: "Abraham's willingness to offer Isaac on Mount Moriah prefigures God the Father offering His only Son. Isaac carrying the wood pictures Christ carrying His cross.",
    category: "type",
    connections: ["John 3:16", "Hebrews 11:17-19", "Romans 8:32"],
    significance: "One of the clearest types of the atonement in the Old Testament."
  },
  {
    id: "ct-gen-4",
    book: "Genesis",
    bookNumber: 1,
    testament: "old",
    title: "Melchizedek - Priest-King",
    christRevealed: "The eternal Priest-King who blesses God's people",
    keyVerse: "Genesis 14:18",
    explanation: "Melchizedek, king of Salem and priest of the Most High God, appears without genealogy - picturing Christ's eternal priesthood and dual role as King and Priest.",
    category: "type",
    connections: ["Psalm 110:4", "Hebrews 7:1-17", "Hebrews 5:6"],
    significance: "Establishes the superior priesthood of Christ, not after Aaron's order."
  },

  // Exodus
  {
    id: "ct-exo-1",
    book: "Exodus",
    bookNumber: 2,
    testament: "old",
    title: "The Passover Lamb",
    christRevealed: "The Lamb whose blood delivers from death",
    keyVerse: "Exodus 12:13",
    explanation: "The Passover lamb, without blemish, slain at twilight, its blood applied to the doorposts - pictures Christ our Passover, sacrificed for us.",
    category: "type",
    connections: ["1 Corinthians 5:7", "John 1:29", "1 Peter 1:19"],
    significance: "Central to understanding Christ's sacrificial death and our deliverance from judgment."
  },
  {
    id: "ct-exo-2",
    book: "Exodus",
    bookNumber: 2,
    testament: "old",
    title: "The Rock Smitten",
    christRevealed: "The Rock that gives living water when struck",
    keyVerse: "Exodus 17:6",
    explanation: "Moses struck the rock and water flowed for the thirsty Israelites. Paul explicitly states 'that Rock was Christ' who was smitten for us.",
    category: "type",
    connections: ["1 Corinthians 10:4", "John 7:37-38", "John 4:14"],
    significance: "Christ was struck once for our sins; now we need only speak to Him for living water."
  },
  {
    id: "ct-exo-3",
    book: "Exodus",
    bookNumber: 2,
    testament: "old",
    title: "The Tabernacle",
    christRevealed: "God dwelling among His people",
    keyVerse: "Exodus 25:8",
    explanation: "The entire tabernacle points to Christ - the door, the altar, the laver, the lampstand, the bread, the incense, the ark. God said 'I will dwell among them.'",
    category: "symbol",
    connections: ["John 1:14", "Hebrews 9:11", "Colossians 2:17"],
    significance: "Every element of the sanctuary reveals an aspect of Christ's person and work."
  },

  // Leviticus
  {
    id: "ct-lev-1",
    book: "Leviticus",
    bookNumber: 3,
    testament: "old",
    title: "The Day of Atonement",
    christRevealed: "The High Priest who makes final atonement",
    keyVerse: "Leviticus 16:30",
    explanation: "The annual Day of Atonement when the high priest entered the Most Holy Place pictures Christ's ministry of cleansing and final judgment.",
    category: "type",
    connections: ["Hebrews 9:7-12", "Hebrews 10:19-22", "Daniel 8:14"],
    significance: "Points to Christ's final work of atonement and the cleansing of the heavenly sanctuary."
  },
  {
    id: "ct-lev-2",
    book: "Leviticus",
    bookNumber: 3,
    testament: "old",
    title: "The Burnt Offering",
    christRevealed: "The One who gave Himself wholly to God",
    keyVerse: "Leviticus 1:3",
    explanation: "The burnt offering, completely consumed on the altar, pictures Christ's total dedication and complete sacrifice for our sins.",
    category: "type",
    connections: ["Ephesians 5:2", "Hebrews 10:5-10", "Romans 12:1"],
    significance: "Shows Christ's perfect obedience and complete self-giving."
  },

  // Numbers
  {
    id: "ct-num-1",
    book: "Numbers",
    bookNumber: 4,
    testament: "old",
    title: "The Bronze Serpent",
    christRevealed: "Lifted up to bring healing to all who look in faith",
    keyVerse: "Numbers 21:8-9",
    explanation: "Jesus explicitly applied this to Himself: 'As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up.'",
    category: "type",
    connections: ["John 3:14-15", "John 12:32", "2 Corinthians 5:21"],
    significance: "Made in the likeness of sinful flesh, lifted up, that all who look in faith might live."
  },
  {
    id: "ct-num-2",
    book: "Numbers",
    bookNumber: 4,
    testament: "old",
    title: "The Star out of Jacob",
    christRevealed: "The bright and morning star arising from Israel",
    keyVerse: "Numbers 24:17",
    explanation: "Balaam's prophecy: 'A Star shall come out of Jacob; a Scepter shall rise out of Israel.' Points to Christ the King.",
    category: "prophecy",
    connections: ["Revelation 22:16", "Matthew 2:2", "2 Peter 1:19"],
    significance: "Messianic prophecy from an unlikely source confirming Christ's coming."
  },

  // Deuteronomy
  {
    id: "ct-deu-1",
    book: "Deuteronomy",
    bookNumber: 5,
    testament: "old",
    title: "The Prophet Like Moses",
    christRevealed: "The greater Prophet whom all must hear",
    keyVerse: "Deuteronomy 18:15",
    explanation: "Moses prophesied of a Prophet like himself whom God would raise up. Peter identifies this as Christ in Acts 3:22.",
    category: "prophecy",
    connections: ["Acts 3:22-23", "Acts 7:37", "John 6:14"],
    significance: "Establishes Christ as the ultimate Prophet, greater than Moses."
  },

  // Joshua
  {
    id: "ct-jos-1",
    book: "Joshua",
    bookNumber: 6,
    testament: "old",
    title: "The Captain of the Lord's Host",
    christRevealed: "The divine Commander who leads God's people to victory",
    keyVerse: "Joshua 5:14",
    explanation: "Before Jericho, Joshua met One who identified Himself as 'Captain of the Lord's host.' This theophany pictures Christ as our conquering leader.",
    category: "appearance",
    connections: ["Hebrews 2:10", "Revelation 19:11-14", "Joshua 5:13-15"],
    significance: "Christ leads His people in spiritual conquest."
  },
  {
    id: "ct-jos-2",
    book: "Joshua",
    bookNumber: 6,
    testament: "old",
    title: "Joshua - Jesus",
    christRevealed: "The One who leads into rest",
    keyVerse: "Joshua 1:2",
    explanation: "Joshua (Yehoshua/Jesus) led Israel into the Promised Land rest. Christ leads us into spiritual rest. The very name means 'The LORD saves.'",
    category: "type",
    connections: ["Hebrews 4:8-9", "Matthew 11:28-29", "Acts 7:45"],
    significance: "Joshua's name and role directly prefigure Christ as Savior and Rest-giver."
  },

  // Judges
  {
    id: "ct-jdg-1",
    book: "Judges",
    bookNumber: 7,
    testament: "old",
    title: "The Deliverer-Judges — Samson, Gideon, Jephthah",
    christRevealed: "The ultimate Deliverer who saves His people — even through death, unconventional victory, and final judgment",
    keyVerse: "Judges 2:16",
    explanation: "Each judge pictures Christ. Samson: beaten, bound, mocked, placed between two pillars, bowed his head, saved more in death than life — like Christ between two crosses. Gideon: defeated enemies with unconventional weapons — Christ destroys evil with the word of His mouth. Jephthah: destroyed those who could not speak the language (Shibboleth) — Christ will separate those who do not know heaven's language.",
    category: "type",
    connections: ["Matthew 1:21", "Galatians 5:1", "Judges 16:25-30", "Judges 7:19-22", "Judges 12:5-6", "Matthew 27:26-50", "Revelation 20:7-10", "Matthew 7:21-23"],
    significance: "Shows human deliverers were temporary; Christ is the eternal Deliverer. Samson's death, Gideon's victory, and Jephthah's judgment all point to aspects of Christ's work."
  },

  // Ruth
  {
    id: "ct-rut-1",
    book: "Ruth",
    bookNumber: 8,
    testament: "old",
    title: "Boaz - The Kinsman Redeemer",
    christRevealed: "The near kinsman who redeems at great cost",
    keyVerse: "Ruth 3:9",
    explanation: "Boaz, as kinsman redeemer, had the right, ability, and willingness to redeem Ruth. Christ became our kinsman (human) to redeem us from sin.",
    category: "type",
    connections: ["Galatians 4:4-5", "Hebrews 2:14-17", "Ephesians 1:7"],
    significance: "Beautifully illustrates the love of Christ in redemption."
  },

  // 1 Samuel
  {
    id: "ct-1sa-1",
    book: "1 Samuel",
    bookNumber: 9,
    testament: "old",
    title: "Samuel and David — The Boy Prophet and the Shepherd King",
    christRevealed: "The boy who discovered His mission in the temple, and the anointed one who rises from obscurity to reign",
    keyVerse: "1 Samuel 3:1-10; 16:12-13",
    explanation: "Samuel was only a boy when he discovered his mission in the temple, called from sleep to serve as priest — Christ at twelve declared 'I must be about My Father's business' (Luke 2:49) and was called from the sleep of death to serve as eternal Priest. David, anointed while a shepherd boy, crossed Kidron fleeing his enemies, was betrayed by Ahithophel who hung himself, and delivered a deadly blow to the head of Goliath — all picturing Christ.",
    category: "type",
    connections: ["Luke 2:41-49", "John 10:11", "Revelation 17:14", "Hebrews 5:5-6", "John 18:1", "2 Samuel 15:23", "2 Samuel 17:23", "Matthew 27:5", "1 Samuel 17:49-51", "Genesis 3:15"],
    significance: "Samuel's calling in the temple and David's life comprehensively typify Christ's mission, suffering, and victory."
  },

  // 2 Samuel
  {
    id: "ct-2sa-1",
    book: "2 Samuel",
    bookNumber: 10,
    testament: "old",
    title: "The Davidic Covenant",
    christRevealed: "The Son of David whose throne is eternal",
    keyVerse: "2 Samuel 7:12-13",
    explanation: "God promised David that his descendant would reign forever. This eternal throne finds its fulfillment only in Christ.",
    category: "prophecy",
    connections: ["Luke 1:32-33", "Acts 2:30", "Revelation 22:16"],
    significance: "The unbreakable promise that Messiah would come through David's line."
  },

  // 1 Kings
  {
    id: "ct-1ki-1",
    book: "1 Kings",
    bookNumber: 11,
    testament: "old",
    title: "Solomon - The Wise King",
    christRevealed: "The One greater than Solomon in wisdom and glory",
    keyVerse: "1 Kings 4:29-30",
    explanation: "Solomon's unprecedented wisdom and the glory of his kingdom picture Christ, in whom are hidden all treasures of wisdom.",
    category: "type",
    connections: ["Matthew 12:42", "Colossians 2:3", "1 Corinthians 1:30"],
    significance: "Jesus declared Himself greater than Solomon."
  },

  // 2 Kings
  {
    id: "ct-2ki-1",
    book: "2 Kings",
    bookNumber: 12,
    testament: "old",
    title: "Elisha - Prophet of Grace and Resurrection Power",
    christRevealed: "The Prophet who raised the dead, multiplied bread, healed lepers, and whose very death brought life",
    keyVerse: "2 Kings 4:42-44",
    explanation: "Elisha raised the dead (2 Kings 4:32-35), multiplied bread for 100 (2 Kings 4:42-44), healed Naaman the leper (2 Kings 5), and even after death, his bones raised a dead man to life (2 Kings 13:21). Christ raised Lazarus, fed 5,000, cleansed lepers, and when He died, many saints rose from the grave (Matthew 27:52-53).",
    category: "type",
    connections: ["John 6:11-14", "John 11:43-44", "Luke 7:11-15", "Luke 17:12-14", "2 Kings 13:21", "Matthew 27:52-53"],
    significance: "Elisha's ministry and even his death foreshadow Christ's miraculous works and the resurrection power released at Calvary."
  },

  // 1 Chronicles
  {
    id: "ct-1ch-1",
    book: "1 Chronicles",
    bookNumber: 13,
    testament: "old",
    title: "The Throne Established Forever",
    christRevealed: "The King whose dynasty never ends",
    keyVerse: "1 Chronicles 17:14",
    explanation: "The genealogies and Davidic covenant emphasis point to the coming of Messiah through this royal line.",
    category: "theme",
    connections: ["Matthew 1:1", "Luke 3:23-38", "Romans 1:3"],
    significance: "Chronicles preserves the messianic lineage."
  },

  // 2 Chronicles
  {
    id: "ct-2ch-1",
    book: "2 Chronicles",
    bookNumber: 14,
    testament: "old",
    title: "The Temple and True Worship",
    christRevealed: "The One greater than the Temple",
    keyVerse: "2 Chronicles 7:16",
    explanation: "Solomon's temple, God's dwelling place among His people, pictures Christ in whom the fullness of the Godhead dwells bodily.",
    category: "type",
    connections: ["Matthew 12:6", "John 2:19-21", "Colossians 2:9"],
    significance: "The temple points to Christ as the true meeting place between God and man."
  },

  // Ezra
  {
    id: "ct-ezr-1",
    book: "Ezra",
    bookNumber: 15,
    testament: "old",
    title: "The Restoration",
    christRevealed: "The One who restores what sin destroyed",
    keyVerse: "Ezra 1:3",
    explanation: "The return from exile and temple restoration picture Christ's work of restoring fallen humanity to fellowship with God.",
    category: "theme",
    connections: ["Acts 3:21", "Colossians 1:20", "Revelation 21:5"],
    significance: "Restoration themes point to Christ's greater restoration work."
  },

  // Nehemiah
  {
    id: "ct-neh-1",
    book: "Nehemiah",
    bookNumber: 16,
    testament: "old",
    title: "The One Who Would Not Come Down",
    christRevealed: "The One who refused to come down because He had a great work to finish",
    keyVerse: "Nehemiah 6:3",
    explanation: "Nehemiah was taunted to come down from the wall but refused — 'I am doing a great work, so that I cannot come down.' Christ was mocked to come down from the cross but refused — He had the greatest work to finish. Nehemiah completed the wall; Christ cried 'It is finished!' (John 19:30).",
    category: "type",
    connections: ["Matthew 27:40-42", "John 19:30", "Nehemiah 6:15", "Ephesians 2:19-22"],
    significance: "Nehemiah's refusal to come down, and his finishing the work, powerfully typify Christ's perseverance on the cross and completion of redemption."
  },

  // Esther
  {
    id: "ct-est-1",
    book: "Esther",
    bookNumber: 17,
    testament: "old",
    title: "The Hidden Providence",
    christRevealed: "The unseen Hand working for His people's deliverance",
    keyVerse: "Esther 4:14",
    explanation: "Though God's name is not mentioned, His providence is everywhere. Christ works behind the scenes for our deliverance.",
    category: "theme",
    connections: ["Romans 8:28", "Hebrews 7:25", "Romans 8:34"],
    significance: "God's hidden work through providence pictures Christ's intercession."
  },

  // Job
  {
    id: "ct-job-1",
    book: "Job",
    bookNumber: 18,
    testament: "old",
    title: "The Living Redeemer",
    christRevealed: "The Redeemer who lives and will stand at last",
    keyVerse: "Job 19:25",
    explanation: "Job's confession: 'I know that my Redeemer lives, and He shall stand at last on the earth' is a powerful Messianic declaration.",
    category: "prophecy",
    connections: ["1 Corinthians 15:20", "Revelation 1:18", "Romans 8:34"],
    significance: "In deepest suffering, Job saw the living Redeemer."
  },
  {
    id: "ct-job-2",
    book: "Job",
    bookNumber: 18,
    testament: "old",
    title: "The Daysman/Mediator",
    christRevealed: "The One who can lay His hand on both God and man",
    keyVerse: "Job 9:33",
    explanation: "Job longed for a 'daysman' or mediator between himself and God. Christ is this Mediator who is both God and man.",
    category: "prophecy",
    connections: ["1 Timothy 2:5", "Hebrews 8:6", "Hebrews 9:15"],
    significance: "Job's longing finds fulfillment in Christ alone."
  },
  {
    id: "ct-job-3",
    book: "Job",
    bookNumber: 18,
    testament: "old",
    title: "The Suffering Intercessor",
    christRevealed: "The One who refused presumption, endured feeling forsaken by God, and prayed for His enemies",
    keyVerse: "Job 42:10",
    explanation: "Job refused the sin of presumption (refused to curse God). He entered a time of deep trouble and was tempted to think God had forsaken him. Yet he prayed for his enemies and was restored. Christ refused to presume upon God (Matt 4:5-7), cried 'Why hast Thou forsaken Me?' (Matt 27:46), and prayed 'Father, forgive them' (Luke 23:34).",
    category: "type",
    connections: ["Matthew 4:5-7", "Matthew 27:46", "Luke 23:34", "Job 1:22", "Job 13:24"],
    significance: "Job's experience of suffering, apparent abandonment, and intercession for enemies powerfully typifies Christ's passion."
  },

  // Psalms
  {
    id: "ct-psa-1",
    book: "Psalms",
    bookNumber: 19,
    testament: "old",
    title: "The Crucified One",
    christRevealed: "The Suffering Servant pierced for us",
    keyVerse: "Psalm 22:16",
    explanation: "Psalm 22 describes crucifixion details: pierced hands and feet, garments divided, bones out of joint, forsaken cry - all fulfilled in Christ.",
    category: "prophecy",
    connections: ["Matthew 27:35-46", "John 19:24", "Mark 15:34"],
    significance: "Written 1000 years before crucifixion existed as a punishment."
  },
  {
    id: "ct-psa-2",
    book: "Psalms",
    bookNumber: 19,
    testament: "old",
    title: "The Risen Lord",
    christRevealed: "The Holy One who would not see corruption",
    keyVerse: "Psalm 16:10",
    explanation: "David prophesied that God would not abandon His Holy One to the grave or let Him see decay. Peter applies this to Christ's resurrection.",
    category: "prophecy",
    connections: ["Acts 2:27-31", "Acts 13:35-37", "Romans 6:9"],
    significance: "Clear prophecy of bodily resurrection."
  },
  {
    id: "ct-psa-3",
    book: "Psalms",
    bookNumber: 19,
    testament: "old",
    title: "The Eternal Priest-King",
    christRevealed: "Priest forever after Melchizedek's order",
    keyVerse: "Psalm 110:4",
    explanation: "The LORD swears that Messiah is a priest forever after the order of Melchizedek - a royal priesthood superior to Aaron's.",
    category: "prophecy",
    connections: ["Hebrews 7:17", "Hebrews 5:6", "Hebrews 6:20"],
    significance: "Establishes Christ's unique and eternal priesthood."
  },

  // Proverbs
  {
    id: "ct-pro-1",
    book: "Proverbs",
    bookNumber: 20,
    testament: "old",
    title: "Wisdom Personified",
    christRevealed: "The eternal Wisdom present at creation",
    keyVerse: "Proverbs 8:22-31",
    explanation: "Wisdom, personified as present from eternity and rejoicing at creation, pictures Christ who is the wisdom of God.",
    category: "type",
    connections: ["1 Corinthians 1:24", "Colossians 2:3", "John 1:1-3"],
    significance: "Christ is the embodiment of divine wisdom."
  },

  // Ecclesiastes
  {
    id: "ct-ecc-1",
    book: "Ecclesiastes",
    bookNumber: 21,
    testament: "old",
    title: "The Answer to Vanity",
    christRevealed: "The One who gives life meaning and purpose",
    keyVerse: "Ecclesiastes 12:13",
    explanation: "Solomon's search for meaning 'under the sun' proves empty. Only in Christ do we find purpose and eternal significance.",
    category: "theme",
    connections: ["John 10:10", "Colossians 1:16-17", "Philippians 1:21"],
    significance: "Apart from Christ, all is vanity."
  },

  // Song of Solomon
  {
    id: "ct-son-1",
    book: "Song of Solomon",
    bookNumber: 22,
    testament: "old",
    title: "The Bridegroom",
    christRevealed: "The Lover of our souls who pursues His bride",
    keyVerse: "Song of Solomon 2:16",
    explanation: "The passionate love between bridegroom and bride pictures Christ's love for His church, His bride.",
    category: "type",
    connections: ["Ephesians 5:25-27", "Revelation 19:7-9", "2 Corinthians 11:2"],
    significance: "Reveals the intimate, personal love Christ has for His people."
  },

  // Isaiah
  {
    id: "ct-isa-1",
    book: "Isaiah",
    bookNumber: 23,
    testament: "old",
    title: "The Virgin-Born Immanuel",
    christRevealed: "God with us, born of a virgin",
    keyVerse: "Isaiah 7:14",
    explanation: "The sign: a virgin shall conceive and bear a son called Immanuel - God with us. Fulfilled in Christ's miraculous birth.",
    category: "prophecy",
    connections: ["Matthew 1:22-23", "Luke 1:34-35", "Galatians 4:4"],
    significance: "Establishes the supernatural nature of Messiah's birth."
  },
  {
    id: "ct-isa-2",
    book: "Isaiah",
    bookNumber: 23,
    testament: "old",
    title: "The Suffering Servant",
    christRevealed: "Wounded for our transgressions",
    keyVerse: "Isaiah 53:5",
    explanation: "Isaiah 53 describes Messiah's substitutionary suffering in remarkable detail: rejected, pierced, silent before accusers, buried with the rich.",
    category: "prophecy",
    connections: ["1 Peter 2:24", "Acts 8:32-35", "Mark 15:28"],
    significance: "The clearest Old Testament presentation of substitutionary atonement."
  },
  {
    id: "ct-isa-3",
    book: "Isaiah",
    bookNumber: 23,
    testament: "old",
    title: "Wonderful Counselor, Mighty God",
    christRevealed: "The Child who is also the Eternal God",
    keyVerse: "Isaiah 9:6",
    explanation: "A Child born, a Son given, yet called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace - clearly divine.",
    category: "prophecy",
    connections: ["John 1:1", "Titus 2:13", "Hebrews 1:8"],
    significance: "Affirms the deity of the coming Messiah."
  },

  // Jeremiah
  {
    id: "ct-jer-1",
    book: "Jeremiah",
    bookNumber: 24,
    testament: "old",
    title: "The Righteous Branch",
    christRevealed: "The LORD Our Righteousness",
    keyVerse: "Jeremiah 23:5-6",
    explanation: "A righteous Branch from David's line who will reign wisely, called 'The LORD Our Righteousness' - Jehovah Tsidkenu.",
    category: "prophecy",
    connections: ["1 Corinthians 1:30", "Romans 3:21-22", "2 Corinthians 5:21"],
    significance: "Christ becomes our righteousness."
  },
  {
    id: "ct-jer-2",
    book: "Jeremiah",
    bookNumber: 24,
    testament: "old",
    title: "The New Covenant Mediator",
    christRevealed: "The One who establishes the new covenant",
    keyVerse: "Jeremiah 31:31-34",
    explanation: "Jeremiah prophesies a new covenant where God writes His law on hearts. Christ mediates this better covenant.",
    category: "prophecy",
    connections: ["Hebrews 8:8-12", "Luke 22:20", "Hebrews 9:15"],
    significance: "Foundation for understanding Christ's covenant work."
  },

  // Lamentations
  {
    id: "ct-lam-1",
    book: "Lamentations",
    bookNumber: 25,
    testament: "old",
    title: "The Man of Sorrows",
    christRevealed: "The One who understands our grief",
    keyVerse: "Lamentations 3:22-23",
    explanation: "In the midst of lamentation, hope emerges in God's faithfulness. Christ, the Man of Sorrows, understands all grief and offers hope.",
    category: "theme",
    connections: ["Isaiah 53:3", "Hebrews 4:15", "Matthew 26:38"],
    significance: "Christ identifies with human sorrow."
  },

  // Ezekiel
  {
    id: "ct-eze-1",
    book: "Ezekiel",
    bookNumber: 26,
    testament: "old",
    title: "The Good Shepherd",
    christRevealed: "The One true Shepherd who gathers His flock",
    keyVerse: "Ezekiel 34:23",
    explanation: "God promises to set up one Shepherd, His servant David, over His sheep. This finds fulfillment in Christ the Good Shepherd.",
    category: "prophecy",
    connections: ["John 10:11-14", "Hebrews 13:20", "1 Peter 5:4"],
    significance: "Christ is the Shepherd God promised."
  },

  // Daniel
  {
    id: "ct-dan-1",
    book: "Daniel",
    bookNumber: 27,
    testament: "old",
    title: "The Son of Man",
    christRevealed: "The divine-human King who receives eternal dominion",
    keyVerse: "Daniel 7:13-14",
    explanation: "One like the Son of Man comes with clouds of heaven to receive an everlasting kingdom. Jesus' favorite self-designation.",
    category: "prophecy",
    connections: ["Matthew 26:64", "Acts 7:56", "Revelation 1:13"],
    significance: "Establishes Christ's title 'Son of Man' and eternal reign."
  },
  {
    id: "ct-dan-2",
    book: "Daniel",
    bookNumber: 27,
    testament: "old",
    title: "The Stone that Fills the Earth",
    christRevealed: "The kingdom that destroys all others",
    keyVerse: "Daniel 2:44-45",
    explanation: "The stone cut without hands destroys the statue and becomes a mountain filling the earth - Christ's eternal kingdom.",
    category: "prophecy",
    connections: ["Matthew 21:44", "1 Peter 2:4-8", "Acts 4:11"],
    significance: "Christ's kingdom will overcome all earthly powers."
  },
  {
    id: "ct-dan-3",
    book: "Daniel",
    bookNumber: 27,
    testament: "old",
    title: "Messiah the Prince",
    christRevealed: "The Anointed One cut off",
    keyVerse: "Daniel 9:25-26",
    explanation: "The 70 weeks prophecy gives the exact timing of Messiah's coming and His being 'cut off' for sin.",
    category: "prophecy",
    connections: ["Galatians 4:4", "Mark 1:15", "Luke 19:44"],
    significance: "The most precise time prophecy pointing to Christ's first advent."
  },
  {
    id: "ct-dan-4",
    book: "Daniel",
    bookNumber: 27,
    testament: "old",
    title: "The Appetite Overcomer and Intercessor",
    christRevealed: "The One who overcame the temptation of appetite and intercedes for His captive people",
    keyVerse: "Daniel 1:8; 9:17-19",
    explanation: "Daniel purposed not to defile himself with the king's food (Daniel 1:8) — Christ refused Satan's temptation to turn stones to bread (Matt 4:3-4). Daniel interceded for captive Israel in prayer and fasting (Daniel 9) — Christ intercedes for captive humanity at the right hand of God (Hebrews 7:25).",
    category: "type",
    connections: ["Matthew 4:1-4", "Hebrews 7:25", "Romans 8:34", "Daniel 1:8", "Daniel 9:1-19"],
    significance: "Daniel's victory over appetite and his intercessory prayer are personal types of Christ's wilderness victory and heavenly ministry."
  },

  // Hosea
  {
    id: "ct-hos-1",
    book: "Hosea",
    bookNumber: 28,
    testament: "old",
    title: "The Faithful Husband",
    christRevealed: "The One who redeems His unfaithful bride",
    keyVerse: "Hosea 3:1",
    explanation: "Hosea's redemption of Gomer pictures Christ's redemptive love for His unfaithful people.",
    category: "type",
    connections: ["Ephesians 5:25", "Romans 5:8", "1 John 4:19"],
    significance: "God's love pursues us despite our unfaithfulness."
  },

  // Joel
  {
    id: "ct-joe-1",
    book: "Joel",
    bookNumber: 29,
    testament: "old",
    title: "The Outpourer of the Spirit",
    christRevealed: "The One who baptizes with the Holy Spirit",
    keyVerse: "Joel 2:28-29",
    explanation: "God promises to pour out His Spirit on all flesh. Jesus, after ascending, poured out the Spirit at Pentecost.",
    category: "prophecy",
    connections: ["Acts 2:16-21", "John 7:39", "Acts 2:33"],
    significance: "Christ is the One who gives the Holy Spirit."
  },

  // Amos
  {
    id: "ct-amo-1",
    book: "Amos",
    bookNumber: 30,
    testament: "old",
    title: "The Restorer of David's Tent",
    christRevealed: "The One who rebuilds David's fallen tabernacle",
    keyVerse: "Amos 9:11",
    explanation: "God promises to raise up David's fallen booth. James applies this to the inclusion of Gentiles through Christ.",
    category: "prophecy",
    connections: ["Acts 15:16-17", "Luke 1:32-33", "Ephesians 2:12-14"],
    significance: "Christ's kingdom includes all nations."
  },

  // Obadiah
  {
    id: "ct-oba-1",
    book: "Obadiah",
    bookNumber: 31,
    testament: "old",
    title: "The Judge of Nations",
    christRevealed: "The One who judges those who oppose God's people",
    keyVerse: "Obadiah 1:15",
    explanation: "The Day of the LORD brings judgment on Edom and all nations. Christ is the appointed Judge of all.",
    category: "theme",
    connections: ["Acts 17:31", "John 5:22", "Revelation 19:11"],
    significance: "Christ will judge all who oppose His people."
  },

  // Jonah
  {
    id: "ct-jon-1",
    book: "Jonah",
    bookNumber: 32,
    testament: "old",
    title: "The Sign of Jonah",
    christRevealed: "Three days in death, rising to new life",
    keyVerse: "Jonah 1:17",
    explanation: "Jesus explicitly used Jonah's three days in the fish as a sign of His three days in the tomb and resurrection.",
    category: "type",
    connections: ["Matthew 12:39-40", "1 Corinthians 15:4", "Matthew 16:4"],
    significance: "Jesus declared this the only sign given to an unbelieving generation."
  },

  // Micah
  {
    id: "ct-mic-1",
    book: "Micah",
    bookNumber: 33,
    testament: "old",
    title: "The Ruler Born in Bethlehem",
    christRevealed: "The eternal One born in Bethlehem",
    keyVerse: "Micah 5:2",
    explanation: "Out of Bethlehem would come the Ruler whose origins are from everlasting. This prophecy guided the Magi to Christ.",
    category: "prophecy",
    connections: ["Matthew 2:1-6", "John 7:42", "Luke 2:4-7"],
    significance: "Precise prediction of Messiah's birthplace."
  },

  // Nahum
  {
    id: "ct-nah-1",
    book: "Nahum",
    bookNumber: 34,
    testament: "old",
    title: "The Avenger of His People",
    christRevealed: "The One who brings good tidings of peace",
    keyVerse: "Nahum 1:15",
    explanation: "The feet of him who brings good tidings pictures the gospel messengers and ultimately Christ the Prince of Peace.",
    category: "theme",
    connections: ["Romans 10:15", "Isaiah 52:7", "Ephesians 6:15"],
    significance: "Christ brings good news while judging oppressors."
  },

  // Habakkuk
  {
    id: "ct-hab-1",
    book: "Habakkuk",
    bookNumber: 35,
    testament: "old",
    title: "The Just Shall Live by Faith",
    christRevealed: "The object of saving faith",
    keyVerse: "Habakkuk 2:4",
    explanation: "This foundational text, quoted three times in the New Testament, points to justification by faith in Christ.",
    category: "theme",
    connections: ["Romans 1:17", "Galatians 3:11", "Hebrews 10:38"],
    significance: "Central to the gospel message of salvation by faith."
  },

  // Zephaniah
  {
    id: "ct-zep-1",
    book: "Zephaniah",
    bookNumber: 36,
    testament: "old",
    title: "The LORD in Your Midst",
    christRevealed: "The King who rejoices over His people",
    keyVerse: "Zephaniah 3:17",
    explanation: "The LORD is in your midst, the Mighty One who will save, who rejoices over you with singing - fulfilled in Christ.",
    category: "prophecy",
    connections: ["John 1:14", "Revelation 21:3", "Matthew 18:20"],
    significance: "God's presence with us finds ultimate expression in Christ."
  },

  // Haggai
  {
    id: "ct-hag-1",
    book: "Haggai",
    bookNumber: 37,
    testament: "old",
    title: "The Desire of All Nations",
    christRevealed: "The One whose glory fills the temple",
    keyVerse: "Haggai 2:7",
    explanation: "The 'Desire of All Nations' would come and the latter glory of the temple would exceed the former - Christ entered that temple.",
    category: "prophecy",
    connections: ["Luke 2:27-32", "John 2:19-21", "Malachi 3:1"],
    significance: "Christ's presence in the second temple fulfilled this prophecy."
  },

  // Zechariah
  {
    id: "ct-zec-1",
    book: "Zechariah",
    bookNumber: 38,
    testament: "old",
    title: "The King on a Donkey",
    christRevealed: "The humble King entering Jerusalem",
    keyVerse: "Zechariah 9:9",
    explanation: "Zechariah predicted the King would come riding on a donkey's colt - fulfilled on Palm Sunday.",
    category: "prophecy",
    connections: ["Matthew 21:4-5", "John 12:15", "Mark 11:1-10"],
    significance: "Proves Jesus knowingly fulfilled Messianic prophecy."
  },
  {
    id: "ct-zec-2",
    book: "Zechariah",
    bookNumber: 38,
    testament: "old",
    title: "The Pierced One",
    christRevealed: "The One whom they pierced and will mourn",
    keyVerse: "Zechariah 12:10",
    explanation: "They will look on Me whom they have pierced and mourn. John quotes this at the crucifixion.",
    category: "prophecy",
    connections: ["John 19:37", "Revelation 1:7", "John 20:27"],
    significance: "Prophecy of crucifixion and future recognition of Christ."
  },
  {
    id: "ct-zec-3",
    book: "Zechariah",
    bookNumber: 38,
    testament: "old",
    title: "Thirty Pieces of Silver",
    christRevealed: "The One valued at the price of a slave",
    keyVerse: "Zechariah 11:12-13",
    explanation: "The shepherd valued at thirty pieces of silver, cast to the potter - fulfilled in Judas's betrayal price.",
    category: "prophecy",
    connections: ["Matthew 26:15", "Matthew 27:3-10", "Exodus 21:32"],
    significance: "Precise prediction of the betrayal price."
  },

  // Malachi
  {
    id: "ct-mal-1",
    book: "Malachi",
    bookNumber: 39,
    testament: "old",
    title: "The Messenger of the Covenant",
    christRevealed: "The Lord who suddenly comes to His temple",
    keyVerse: "Malachi 3:1",
    explanation: "The Lord would suddenly come to His temple, preceded by a messenger. John the Baptist prepared the way for Christ.",
    category: "prophecy",
    connections: ["Matthew 11:10", "Mark 1:2", "Luke 7:27"],
    significance: "Links the forerunner ministry with Christ's coming."
  },
  {
    id: "ct-mal-2",
    book: "Malachi",
    bookNumber: 39,
    testament: "old",
    title: "The Sun of Righteousness",
    christRevealed: "Rising with healing in His wings",
    keyVerse: "Malachi 4:2",
    explanation: "To those who fear God's name, the Sun of Righteousness will rise with healing. Christ is this light and healer.",
    category: "prophecy",
    connections: ["Luke 1:78-79", "John 8:12", "Revelation 22:16"],
    significance: "The last Old Testament Messianic promise before 400 years of silence."
  },

  // NEW TESTAMENT

  // Matthew
  {
    id: "ct-mat-1",
    book: "Matthew",
    bookNumber: 40,
    testament: "new",
    title: "The King of the Jews",
    christRevealed: "The rightful King from David's line",
    keyVerse: "Matthew 1:1",
    explanation: "Matthew presents Jesus as the King, son of David, son of Abraham - the fulfillment of covenant promises to Israel.",
    category: "title",
    connections: ["Matthew 2:2", "Matthew 27:37", "Revelation 19:16"],
    significance: "Matthew's gospel emphasizes Christ's kingship."
  },

  // Mark
  {
    id: "ct-mar-1",
    book: "Mark",
    bookNumber: 41,
    testament: "new",
    title: "The Servant of the LORD",
    christRevealed: "The One who came to serve and give His life",
    keyVerse: "Mark 10:45",
    explanation: "Mark presents Jesus as the Servant who came not to be served but to serve and give His life as a ransom.",
    category: "title",
    connections: ["Isaiah 42:1", "Philippians 2:7", "John 13:14-15"],
    significance: "Mark's gospel emphasizes Christ's servant ministry."
  },

  // Luke
  {
    id: "ct-luk-1",
    book: "Luke",
    bookNumber: 42,
    testament: "new",
    title: "The Son of Man",
    christRevealed: "The perfect, compassionate human",
    keyVerse: "Luke 19:10",
    explanation: "Luke presents Jesus as the Son of Man who came to seek and save the lost - emphasizing His humanity and compassion.",
    category: "title",
    connections: ["Daniel 7:13", "Hebrews 2:14", "1 Timothy 2:5"],
    significance: "Luke's gospel emphasizes Christ's perfect humanity."
  },

  // John
  {
    id: "ct-joh-1",
    book: "John",
    bookNumber: 43,
    testament: "new",
    title: "The Son of God",
    christRevealed: "The eternal Word who became flesh",
    keyVerse: "John 1:1, 14",
    explanation: "John presents Jesus as the eternal Son of God, the Word who was with God and was God, who became flesh.",
    category: "title",
    connections: ["John 20:31", "1 John 5:20", "Hebrews 1:2-3"],
    significance: "John's gospel emphasizes Christ's deity."
  },

  // Acts
  {
    id: "ct-act-1",
    book: "Acts",
    bookNumber: 44,
    testament: "new",
    title: "The Ascended Lord",
    christRevealed: "The One who continues His work through His church",
    keyVerse: "Acts 1:9",
    explanation: "Acts shows Jesus continuing His ministry through His Spirit-empowered church, working from heaven.",
    category: "theme",
    connections: ["Acts 2:33", "Hebrews 1:3", "Ephesians 1:20-22"],
    significance: "Christ's work continues through His body, the church."
  },

  // Romans
  {
    id: "ct-rom-1",
    book: "Romans",
    bookNumber: 45,
    testament: "new",
    title: "Our Righteousness",
    christRevealed: "The One through whom we are justified",
    keyVerse: "Romans 3:24",
    explanation: "Romans reveals Christ as the source of our righteousness, through whom we are justified freely by grace.",
    category: "title",
    connections: ["1 Corinthians 1:30", "2 Corinthians 5:21", "Philippians 3:9"],
    significance: "Foundational doctrine of justification through Christ."
  },

  // 1 Corinthians
  {
    id: "ct-1co-1",
    book: "1 Corinthians",
    bookNumber: 46,
    testament: "new",
    title: "The Power and Wisdom of God",
    christRevealed: "The crucified Christ who is God's power",
    keyVerse: "1 Corinthians 1:24",
    explanation: "To those being saved, Christ crucified is the power of God and the wisdom of God - the answer to all human need.",
    category: "title",
    connections: ["Colossians 2:3", "1 Corinthians 2:2", "2 Corinthians 12:9"],
    significance: "The cross reveals divine wisdom and power."
  },

  // 2 Corinthians
  {
    id: "ct-2co-1",
    book: "2 Corinthians",
    bookNumber: 47,
    testament: "new",
    title: "The God of All Comfort",
    christRevealed: "The source of comfort in all affliction",
    keyVerse: "2 Corinthians 1:3-4",
    explanation: "Through Christ, we receive comfort in all our afflictions so we can comfort others with the same comfort.",
    category: "title",
    connections: ["John 14:16-18", "Romans 15:5", "2 Thessalonians 2:16-17"],
    significance: "Christ meets us in suffering with His comfort."
  },

  // Galatians
  {
    id: "ct-gal-1",
    book: "Galatians",
    bookNumber: 48,
    testament: "new",
    title: "Our Liberty",
    christRevealed: "The One who sets us free from law's bondage",
    keyVerse: "Galatians 5:1",
    explanation: "Christ has set us free from the bondage of trying to earn salvation by works. In Him we have true liberty.",
    category: "title",
    connections: ["John 8:36", "Romans 6:14", "2 Corinthians 3:17"],
    significance: "Freedom in Christ from legalism."
  },

  // Ephesians
  {
    id: "ct-eph-1",
    book: "Ephesians",
    bookNumber: 49,
    testament: "new",
    title: "The Head of the Church",
    christRevealed: "The supreme Head of His body",
    keyVerse: "Ephesians 1:22-23",
    explanation: "God placed all things under Christ's feet and gave Him as head over all things to the church, which is His body.",
    category: "title",
    connections: ["Colossians 1:18", "Colossians 2:19", "Ephesians 4:15"],
    significance: "Christ's relationship to His church."
  },

  // Philippians
  {
    id: "ct-php-1",
    book: "Philippians",
    bookNumber: 50,
    testament: "new",
    title: "The Exalted Name",
    christRevealed: "The name above every name",
    keyVerse: "Philippians 2:9-11",
    explanation: "God highly exalted Christ and gave Him the name above every name, that every knee should bow to Jesus as Lord.",
    category: "title",
    connections: ["Acts 4:12", "Hebrews 1:4", "Revelation 19:16"],
    significance: "The supreme exaltation of Christ."
  },

  // Colossians
  {
    id: "ct-col-1",
    book: "Colossians",
    bookNumber: 51,
    testament: "new",
    title: "The Fullness of the Godhead",
    christRevealed: "In Him dwells all the fullness of deity",
    keyVerse: "Colossians 2:9",
    explanation: "In Christ all the fullness of the Godhead dwells bodily. He is the complete revelation of God.",
    category: "title",
    connections: ["John 1:14", "Hebrews 1:3", "John 14:9"],
    significance: "Clear declaration of Christ's full deity."
  },

  // 1 Thessalonians
  {
    id: "ct-1th-1",
    book: "1 Thessalonians",
    bookNumber: 52,
    testament: "new",
    title: "The Coming Lord",
    christRevealed: "The One who will return with a shout",
    keyVerse: "1 Thessalonians 4:16-17",
    explanation: "The Lord Himself will descend from heaven with a shout, with the voice of the archangel, to gather His people.",
    category: "theme",
    connections: ["John 14:3", "Acts 1:11", "Revelation 22:20"],
    significance: "The blessed hope of Christ's return."
  },

  // 2 Thessalonians
  {
    id: "ct-2th-1",
    book: "2 Thessalonians",
    bookNumber: 53,
    testament: "new",
    title: "The Righteous Judge",
    christRevealed: "Coming in flaming fire to judge",
    keyVerse: "2 Thessalonians 1:7-8",
    explanation: "The Lord Jesus will be revealed from heaven in flaming fire, bringing righteous judgment on those who reject Him.",
    category: "theme",
    connections: ["2 Timothy 4:1", "Acts 17:31", "Revelation 19:11-15"],
    significance: "Christ's role as final Judge."
  },

  // 1 Timothy
  {
    id: "ct-1ti-1",
    book: "1 Timothy",
    bookNumber: 54,
    testament: "new",
    title: "The One Mediator",
    christRevealed: "The only Mediator between God and man",
    keyVerse: "1 Timothy 2:5",
    explanation: "There is one God and one Mediator between God and men, the Man Christ Jesus - the only way to the Father.",
    category: "title",
    connections: ["Hebrews 8:6", "Hebrews 9:15", "John 14:6"],
    significance: "Christ alone mediates between God and humanity."
  },

  // 2 Timothy
  {
    id: "ct-2ti-1",
    book: "2 Timothy",
    bookNumber: 55,
    testament: "new",
    title: "The Righteous Judge and Crown-Giver",
    christRevealed: "The One who rewards faithful service",
    keyVerse: "2 Timothy 4:8",
    explanation: "The crown of righteousness is laid up, which the Lord, the righteous Judge, will give on that Day.",
    category: "title",
    connections: ["James 1:12", "1 Peter 5:4", "Revelation 2:10"],
    significance: "Christ rewards those who love His appearing."
  },

  // Titus
  {
    id: "ct-tit-1",
    book: "Titus",
    bookNumber: 56,
    testament: "new",
    title: "Our Great God and Savior",
    christRevealed: "The blessed hope - our God appearing",
    keyVerse: "Titus 2:13",
    explanation: "We await the blessed hope - the appearing of the glory of our great God and Savior, Jesus Christ.",
    category: "title",
    connections: ["2 Peter 1:1", "John 20:28", "Romans 9:5"],
    significance: "Clear affirmation of Christ's deity."
  },

  // Philemon
  {
    id: "ct-phm-1",
    book: "Philemon",
    bookNumber: 57,
    testament: "new",
    title: "The One Who Reconciles",
    christRevealed: "Making us useful through redemption",
    keyVerse: "Philemon 1:10-11",
    explanation: "As Paul interceded for Onesimus, Christ intercedes for us, making the useless useful through redemption.",
    category: "theme",
    connections: ["2 Corinthians 5:18", "Romans 5:10", "Colossians 1:20"],
    significance: "Christ transforms and reconciles."
  },

  // Hebrews
  {
    id: "ct-heb-1",
    book: "Hebrews",
    bookNumber: 58,
    testament: "new",
    title: "The Great High Priest",
    christRevealed: "The perfect Priest who offered Himself",
    keyVerse: "Hebrews 4:14-15",
    explanation: "We have a great High Priest who has passed through the heavens - Jesus the Son of God - who sympathizes with our weaknesses.",
    category: "title",
    connections: ["Hebrews 7:26-27", "Hebrews 9:11-12", "Hebrews 10:21"],
    significance: "Christ's superior priesthood is Hebrews' central theme."
  },

  // James
  {
    id: "ct-jam-1",
    book: "James",
    bookNumber: 59,
    testament: "new",
    title: "The Lord of Glory",
    christRevealed: "The One whose faith produces works",
    keyVerse: "James 2:1",
    explanation: "Faith in our Lord Jesus Christ, the Lord of glory, should produce genuine works that demonstrate living faith.",
    category: "title",
    connections: ["1 Corinthians 2:8", "Psalm 24:7-10", "John 17:5"],
    significance: "Christ's glory demands authentic faith."
  },

  // 1 Peter
  {
    id: "ct-1pe-1",
    book: "1 Peter",
    bookNumber: 60,
    testament: "new",
    title: "The Chief Shepherd",
    christRevealed: "The Shepherd who gives unfading crowns",
    keyVerse: "1 Peter 5:4",
    explanation: "When the Chief Shepherd appears, you will receive the unfading crown of glory.",
    category: "title",
    connections: ["John 10:11", "Hebrews 13:20", "Revelation 7:17"],
    significance: "Christ as the ultimate Shepherd of His people."
  },

  // 2 Peter
  {
    id: "ct-2pe-1",
    book: "2 Peter",
    bookNumber: 61,
    testament: "new",
    title: "The Morning Star",
    christRevealed: "The One who brings dawn to our hearts",
    keyVerse: "2 Peter 1:19",
    explanation: "The prophetic word is like a lamp until the day dawns and the morning star rises in your hearts.",
    category: "symbol",
    connections: ["Revelation 22:16", "Revelation 2:28", "Numbers 24:17"],
    significance: "Christ brings spiritual dawn."
  },

  // 1 John
  {
    id: "ct-1jo-1",
    book: "1 John",
    bookNumber: 62,
    testament: "new",
    title: "The Word of Life",
    christRevealed: "The eternal life made manifest",
    keyVerse: "1 John 1:1-2",
    explanation: "That which was from the beginning, which we have seen and touched - the Word of life. The eternal life was manifested.",
    category: "title",
    connections: ["John 1:1-4", "John 14:6", "Colossians 3:4"],
    significance: "Christ is both the source and substance of eternal life."
  },

  // 2 John
  {
    id: "ct-2jo-1",
    book: "2 John",
    bookNumber: 63,
    testament: "new",
    title: "The Son of the Father",
    christRevealed: "The One who came in the flesh",
    keyVerse: "2 John 1:3, 7",
    explanation: "Grace from Jesus Christ, the Son of the Father. Confessing Jesus Christ has come in the flesh is essential truth.",
    category: "title",
    connections: ["John 1:14", "1 John 4:2-3", "1 Timothy 3:16"],
    significance: "The incarnation is non-negotiable truth."
  },

  // 3 John
  {
    id: "ct-3jo-1",
    book: "3 John",
    bookNumber: 64,
    testament: "new",
    title: "The Truth",
    christRevealed: "The One for whose name's sake we go forth",
    keyVerse: "3 John 1:7",
    explanation: "They went out for the sake of the Name, accepting nothing from the Gentiles. Christ's name is worth everything.",
    category: "theme",
    connections: ["John 14:6", "Acts 5:41", "Philippians 2:9-10"],
    significance: "Ministry is done for Christ's name's sake."
  },

  // Jude
  {
    id: "ct-jud-1",
    book: "Jude",
    bookNumber: 65,
    testament: "new",
    title: "The Only Wise God Our Savior",
    christRevealed: "The One who keeps us from stumbling",
    keyVerse: "Jude 1:24-25",
    explanation: "To Him who is able to keep you from stumbling and present you faultless - to our Savior be glory.",
    category: "title",
    connections: ["Romans 16:27", "1 Timothy 1:17", "Ephesians 3:20-21"],
    significance: "Christ preserves and presents us to God."
  },

  // Revelation
  {
    id: "ct-rev-1",
    book: "Revelation",
    bookNumber: 66,
    testament: "new",
    title: "The Alpha and Omega",
    christRevealed: "The Beginning and End, the First and Last",
    keyVerse: "Revelation 1:8",
    explanation: "I am the Alpha and the Omega, the Beginning and the End, who is and was and is to come, the Almighty.",
    category: "title",
    connections: ["Revelation 22:13", "Isaiah 44:6", "Revelation 1:17"],
    significance: "Christ encompasses all of history and eternity."
  },
  {
    id: "ct-rev-2",
    book: "Revelation",
    bookNumber: 66,
    testament: "new",
    title: "The Lamb Slain",
    christRevealed: "The victorious Lamb worthy to open the scroll",
    keyVerse: "Revelation 5:6, 12",
    explanation: "The Lamb as though slain is worthy to take the scroll - combining sacrifice and sovereignty in Christ.",
    category: "symbol",
    connections: ["John 1:29", "1 Peter 1:19", "Revelation 7:14"],
    significance: "Christ's sacrifice is central to His victory and reign."
  },
  {
    id: "ct-rev-3",
    book: "Revelation",
    bookNumber: 66,
    testament: "new",
    title: "King of Kings and Lord of Lords",
    christRevealed: "The returning Conqueror on a white horse",
    keyVerse: "Revelation 19:16",
    explanation: "He has a name written: KING OF KINGS AND LORD OF LORDS. Christ returns as the ultimate Victor.",
    category: "title",
    connections: ["1 Timothy 6:15", "Daniel 2:47", "Deuteronomy 10:17"],
    significance: "The final revelation of Christ's supreme authority."
  }
];

// Helper functions
export const getChristTypesByBook = (book: string): ChristType[] => {
  return christTypesLibrary.filter(ct => ct.book.toLowerCase() === book.toLowerCase());
};

export const getChristTypesByTestament = (testament: "old" | "new"): ChristType[] => {
  return christTypesLibrary.filter(ct => ct.testament === testament);
};

export const getChristTypesByCategory = (category: ChristTypeCategory): ChristType[] => {
  return christTypesLibrary.filter(ct => ct.category === category);
};

export const searchChristTypes = (query: string): ChristType[] => {
  const lowerQuery = query.toLowerCase();
  return christTypesLibrary.filter(ct =>
    ct.title.toLowerCase().includes(lowerQuery) ||
    ct.christRevealed.toLowerCase().includes(lowerQuery) ||
    ct.explanation.toLowerCase().includes(lowerQuery) ||
    ct.keyVerse.toLowerCase().includes(lowerQuery) ||
    ct.book.toLowerCase().includes(lowerQuery)
  );
};

export const getOrderedChristTypes = (): ChristType[] => {
  return [...christTypesLibrary].sort((a, b) => a.bookNumber - b.bookNumber);
};

export const getBooksWithChristTypes = (): string[] => {
  const books = new Set(christTypesLibrary.map(ct => ct.book));
  return Array.from(books);
};

export const christTypeCategoryInfo: Record<ChristTypeCategory, { name: string; description: string; icon: string }> = {
  type: {
    name: "Type",
    description: "Old Testament persons, events, or institutions that foreshadow Christ",
    icon: "🔮"
  },
  prophecy: {
    name: "Prophecy",
    description: "Direct prophetic predictions about the Messiah",
    icon: "📜"
  },
  title: {
    name: "Title",
    description: "Names and titles that reveal Christ's nature and work",
    icon: "👑"
  },
  symbol: {
    name: "Symbol",
    description: "Objects or images that represent Christ",
    icon: "✨"
  },
  theme: {
    name: "Theme",
    description: "Overarching themes that point to Christ",
    icon: "📖"
  },
  appearance: {
    name: "Theophany",
    description: "Pre-incarnate appearances of Christ",
    icon: "🌟"
  }
};
