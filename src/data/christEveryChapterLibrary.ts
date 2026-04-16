// Christ in Every Chapter Library
// Finding Jesus in every book of the Bible using the 5 "Finding Waldo" Methods

export type FindingMethod = 'promise' | 'type' | 'trail' | 'heart' | 'unfinished';

export interface ChristInBook {
  id: string;
  book: string;
  testament: 'OT' | 'NT';
  category: string;
  methodsUsed: FindingMethod[];
  christTitle: string;
  christAction: string;
  keyChapter: string;
  explanation: string;
  crosslinks: string[];
}

export const christEveryChapterLibrary: ChristInBook[] = [
  // PENTATEUCH
  {
    id: 'genesis',
    book: 'Genesis',
    testament: 'OT',
    category: 'Pentateuch',
    methodsUsed: ['promise', 'type'],
    christTitle: 'Seed of the Woman / Creator Word',
    christAction: 'Promises to crush Satan, provides substitute sacrifice',
    keyChapter: 'Genesis 3:15; 22:8',
    explanation: 'The proto-gospel (3:15) promises the Seed who will crush the serpent. Abraham receives the lamb (22:8). Christ is the promised Seed and the provided Lamb.',
    crosslinks: ['Galatians 4:4', 'John 1:29', 'Romans 16:20']
  },
  {
    id: 'exodus',
    book: 'Exodus',
    testament: 'OT',
    category: 'Pentateuch',
    methodsUsed: ['type', 'trail'],
    christTitle: 'Passover Lamb / Deliverer',
    christAction: 'Delivers through blood, leads through wilderness',
    keyChapter: 'Exodus 12:3-13',
    explanation: 'The Passover lamb prefigures Christ (1 Cor 5:7). Moses typifies Christ as deliverer. The tabernacle pictures Christ dwelling among us.',
    crosslinks: ['1 Corinthians 5:7', 'John 1:14', 'Hebrews 3:1-6']
  },
  {
    id: 'leviticus',
    book: 'Leviticus',
    testament: 'OT',
    category: 'Pentateuch',
    methodsUsed: ['type', 'unfinished'],
    christTitle: 'Sacrifice / High Priest',
    christAction: 'Atones once for all, mediates eternally',
    keyChapter: 'Leviticus 16 (Day of Atonement)',
    explanation: 'Every sacrifice points to Christ\'s finished work. The high priest entering Most Holy foreshadows Christ entering heavenly sanctuary.',
    crosslinks: ['Hebrews 9:11-14', 'Hebrews 10:1-14']
  },
  {
    id: 'numbers',
    book: 'Numbers',
    testament: 'OT',
    category: 'Pentateuch',
    methodsUsed: ['type', 'trail'],
    christTitle: 'Lifted Serpent / Pillar of Fire',
    christAction: 'Heals those who look in faith, guides through wilderness',
    keyChapter: 'Numbers 21:8-9',
    explanation: 'The bronze serpent lifted up prefigures Christ lifted on the cross (John 3:14). The pillar of cloud/fire is Christ\'s presence guiding.',
    crosslinks: ['John 3:14-15', '1 Corinthians 10:4']
  },
  {
    id: 'deuteronomy',
    book: 'Deuteronomy',
    testament: 'OT',
    category: 'Pentateuch',
    methodsUsed: ['promise', 'unfinished'],
    christTitle: 'Prophet Like Moses',
    christAction: 'Speaks God\'s final word with authority',
    keyChapter: 'Deuteronomy 18:15-19',
    explanation: 'Moses promises a Prophet like himself whom God will raise up. Jesus is that Prophet—the final Word from God.',
    crosslinks: ['Acts 3:22-26', 'Hebrews 1:1-2']
  },

  // HISTORICAL BOOKS
  {
    id: 'joshua',
    book: 'Joshua',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['type', 'unfinished'],
    christTitle: 'Captain of Salvation / True Joshua',
    christAction: 'Leads into promised rest, conquers enemies',
    keyChapter: 'Joshua 5:13-15',
    explanation: 'Joshua (Yeshua = Jesus) leads into Canaan but fails to give true rest (Heb 4:8). Jesus leads into eternal rest.',
    crosslinks: ['Hebrews 4:8-10', 'Hebrews 2:10']
  },
  {
    id: 'judges',
    book: 'Judges',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['trail', 'unfinished'],
    christTitle: 'True Judge-Deliverer',
    christAction: 'Delivers permanently from cycle of sin',
    keyChapter: 'Judges 2:16-19',
    explanation: 'The cycle of sin-judgment-cry-deliverance repeats endlessly. Each judge is temporary; Christ breaks the cycle permanently.',
    crosslinks: ['Acts 13:20-23', 'Romans 7:24-25']
  },
  {
    id: 'ruth',
    book: 'Ruth',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['type'],
    christTitle: 'Kinsman-Redeemer',
    christAction: 'Becomes human to redeem, marries the bride',
    keyChapter: 'Ruth 4:13-17',
    explanation: 'Boaz redeems Ruth and her inheritance. Christ became our kinsman (human) to redeem us and take us as His bride.',
    crosslinks: ['Hebrews 2:14-17', 'Ephesians 5:25-27']
  },
  {
    id: '1samuel',
    book: '1 Samuel',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['type', 'trail'],
    christTitle: 'Anointed King / Giant-Slayer',
    christAction: 'Defeats the champion enemy, receives the kingdom',
    keyChapter: '1 Samuel 17',
    explanation: 'David defeats Goliath as underdog champion for Israel. Christ defeats Satan/Death as our champion.',
    crosslinks: ['Hebrews 2:14-15', 'Colossians 2:15']
  },
  {
    id: '2samuel',
    book: '2 Samuel',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['promise', 'unfinished'],
    christTitle: "Son of David / Eternal King",
    christAction: 'Establishes eternal throne, reigns forever',
    keyChapter: '2 Samuel 7:12-16',
    explanation: 'The Davidic covenant promises an eternal throne. Solomon\'s throne fell; Christ\'s throne endures forever.',
    crosslinks: ['Luke 1:32-33', 'Revelation 22:16']
  },
  {
    id: '1kings',
    book: '1 Kings',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['type', 'unfinished'],
    christTitle: 'Greater Solomon / True Temple',
    christAction: 'Possesses all wisdom, IS the temple',
    keyChapter: '1 Kings 8:27-30',
    explanation: 'Solomon builds the temple but admits heaven cannot contain God. Christ IS the temple (John 2:19-21).',
    crosslinks: ['Matthew 12:42', 'John 2:19-21', 'Colossians 2:3']
  },
  {
    id: '2kings',
    book: '2 Kings',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['trail', 'unfinished'],
    christTitle: 'Resurrection and Life',
    christAction: 'Raises the dead, restores life',
    keyChapter: '2 Kings 4:32-37',
    explanation: 'Elisha raises the Shunammite\'s son. Christ is the Resurrection and Life who raises all who believe.',
    crosslinks: ['John 11:25-26', 'John 5:21']
  },
  {
    id: '1chronicles',
    book: '1 Chronicles',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['promise', 'unfinished'],
    christTitle: 'Eternal King from David\'s Line',
    christAction: 'Receives the throne forever',
    keyChapter: '1 Chronicles 17:11-14',
    explanation: 'Chronicles traces the royal line and reaffirms the Davidic promise. Christ fulfills this lineage.',
    crosslinks: ['Matthew 1:1', 'Romans 1:3']
  },
  {
    id: '2chronicles',
    book: '2 Chronicles',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['heart', 'unfinished'],
    christTitle: 'True Temple / Glory of God',
    christAction: 'Fills the temple with glory, IS the temple',
    keyChapter: '2 Chronicles 7:1-3',
    explanation: 'Glory fills Solomon\'s temple. That glory departed (Ezekiel) but returns in Christ, the true temple.',
    crosslinks: ['John 1:14', 'John 2:19-21']
  },
  {
    id: 'ezra',
    book: 'Ezra',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['trail', 'unfinished'],
    christTitle: 'Restorer / Rebuilder',
    christAction: 'Brings exiles home, rebuilds the true temple',
    keyChapter: 'Ezra 1:1-4',
    explanation: 'Ezra leads the return from exile. Christ leads the ultimate exodus from sin and builds the living temple (church).',
    crosslinks: ['Ephesians 2:19-22', '1 Peter 2:5']
  },
  {
    id: 'nehemiah',
    book: 'Nehemiah',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['unfinished', 'trail'],
    christTitle: 'Wall-Builder / Protector',
    christAction: 'Builds walls of salvation, secures His people',
    keyChapter: 'Nehemiah 6:15-16',
    explanation: 'Nehemiah rebuilds Jerusalem\'s walls. Christ builds "walls of salvation" (Isa 26:1) around His people.',
    crosslinks: ['Isaiah 26:1', 'Zechariah 2:5']
  },
  {
    id: 'esther',
    book: 'Esther',
    testament: 'OT',
    category: 'Historical',
    methodsUsed: ['trail', 'heart'],
    christTitle: 'Hidden Deliverer / Advocate',
    christAction: 'Works behind scenes, preserves His people',
    keyChapter: 'Esther 4:14',
    explanation: 'God\'s name is absent but His providence is everywhere. Christ is our hidden advocate who preserves His chosen people.',
    crosslinks: ['1 John 2:1', 'Romans 8:34']
  },

  // POETRY/WISDOM
  {
    id: 'job',
    book: 'Job',
    testament: 'OT',
    category: 'Wisdom',
    methodsUsed: ['trail', 'promise'],
    christTitle: 'Living Redeemer',
    christAction: 'Vindicates the suffering righteous, stands at the last day',
    keyChapter: 'Job 19:25-27',
    explanation: '"I know that my Redeemer lives!" Job\'s suffering points to Christ, the innocent sufferer who is vindicated.',
    crosslinks: ['1 Peter 2:21-24', 'Hebrews 12:2']
  },
  {
    id: 'psalms',
    book: 'Psalms',
    testament: 'OT',
    category: 'Wisdom',
    methodsUsed: ['promise', 'type', 'heart'],
    christTitle: 'Anointed King / Suffering Servant / Good Shepherd',
    christAction: 'Reigns, suffers, shepherds',
    keyChapter: 'Psalm 2; 22; 23; 110',
    explanation: 'Messianic psalms reveal Christ as King (2, 110), Sufferer (22), and Shepherd (23). He prays the Psalms from the cross.',
    crosslinks: ['Acts 4:25-27', 'Matthew 27:46', 'Hebrews 5:5-6']
  },
  {
    id: 'proverbs',
    book: 'Proverbs',
    testament: 'OT',
    category: 'Wisdom',
    methodsUsed: ['type', 'heart'],
    christTitle: 'Wisdom Incarnate',
    christAction: 'Is the wisdom of God, teaches the way of life',
    keyChapter: 'Proverbs 8:22-31',
    explanation: 'Wisdom personified, present at creation, delighting in humanity. Christ IS the wisdom of God (1 Cor 1:24).',
    crosslinks: ['1 Corinthians 1:24, 30', 'Colossians 2:3']
  },
  {
    id: 'ecclesiastes',
    book: 'Ecclesiastes',
    testament: 'OT',
    category: 'Wisdom',
    methodsUsed: ['unfinished', 'trail'],
    christTitle: 'Meaning and Purpose',
    christAction: 'Gives life meaning, satisfies the restless soul',
    keyChapter: 'Ecclesiastes 12:13-14',
    explanation: '"Vanity of vanities"—life under the sun is meaningless. Christ gives meaning—life beyond the sun.',
    crosslinks: ['John 10:10', 'Colossians 1:16-17']
  },
  {
    id: 'songofsolomon',
    book: 'Song of Solomon',
    testament: 'OT',
    category: 'Wisdom',
    methodsUsed: ['type', 'heart'],
    christTitle: 'Bridegroom',
    christAction: 'Loves His bride with passionate, pursuing love',
    keyChapter: 'Song of Solomon 2:10-13',
    explanation: 'The lover pursuing the beloved pictures Christ pursuing His church with jealous, covenant love.',
    crosslinks: ['Ephesians 5:25-27', 'Revelation 19:7-9']
  },

  // MAJOR PROPHETS
  {
    id: 'isaiah',
    book: 'Isaiah',
    testament: 'OT',
    category: 'Major Prophet',
    methodsUsed: ['promise', 'type'],
    christTitle: 'Suffering Servant / Prince of Peace / Immanuel',
    christAction: 'Bears our sins, brings peace, IS God with us',
    keyChapter: 'Isaiah 53; 9:6-7; 7:14',
    explanation: 'Isaiah is the "fifth gospel"—predicting virgin birth (7:14), divine child (9:6), and substitutionary death (53).',
    crosslinks: ['Matthew 1:23', 'Luke 2:14', 'Acts 8:32-35']
  },
  {
    id: 'jeremiah',
    book: 'Jeremiah',
    testament: 'OT',
    category: 'Major Prophet',
    methodsUsed: ['promise', 'trail'],
    christTitle: 'Righteous Branch / New Covenant Mediator',
    christAction: 'Establishes new covenant, writes law on hearts',
    keyChapter: 'Jeremiah 31:31-34; 23:5-6',
    explanation: 'Jeremiah promises a new covenant and a Righteous Branch. Christ inaugurates the new covenant with His blood.',
    crosslinks: ['Hebrews 8:8-12', 'Luke 22:20']
  },
  {
    id: 'lamentations',
    book: 'Lamentations',
    testament: 'OT',
    category: 'Major Prophet',
    methodsUsed: ['trail', 'heart'],
    christTitle: 'Man of Sorrows / Merciful Comforter',
    christAction: 'Weeps over Jerusalem, offers hope in despair',
    keyChapter: 'Lamentations 3:22-23',
    explanation: 'Jeremiah weeps over Jerusalem\'s destruction. Christ weeps over the city (Luke 19:41) and offers mercies that are new every morning.',
    crosslinks: ['Luke 19:41-44', 'Hebrews 4:15']
  },
  {
    id: 'ezekiel',
    book: 'Ezekiel',
    testament: 'OT',
    category: 'Major Prophet',
    methodsUsed: ['promise', 'heart'],
    christTitle: 'Good Shepherd / Life-Giver',
    christAction: 'Gathers scattered sheep, breathes life into dry bones',
    keyChapter: 'Ezekiel 34:11-16; 37:1-14',
    explanation: 'God promises to shepherd His flock Himself (34) and raise dry bones to life (37). Christ IS the Good Shepherd and Resurrection.',
    crosslinks: ['John 10:11', 'John 11:25']
  },
  {
    id: 'daniel',
    book: 'Daniel',
    testament: 'OT',
    category: 'Major Prophet',
    methodsUsed: ['promise', 'trail'],
    christTitle: 'Son of Man / Stone from Heaven / Ancient of Days',
    christAction: 'Receives eternal dominion, crushes world kingdoms',
    keyChapter: 'Daniel 7:13-14; 2:44-45',
    explanation: 'Daniel sees the Son of Man receiving eternal kingdom from the Ancient of Days. Jesus claims this title repeatedly.',
    crosslinks: ['Matthew 26:64', 'Revelation 1:13-14']
  },

  // MINOR PROPHETS
  {
    id: 'hosea',
    book: 'Hosea',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['type', 'heart'],
    christTitle: 'Faithful Husband',
    christAction: 'Pursues unfaithful bride with relentless love',
    keyChapter: 'Hosea 3:1-5',
    explanation: 'Hosea buys back his unfaithful wife. Christ redeems His unfaithful people with His blood.',
    crosslinks: ['Ephesians 5:25-27', '1 Peter 1:18-19']
  },
  {
    id: 'joel',
    book: 'Joel',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise'],
    christTitle: 'Spirit-Giver / LORD in Zion',
    christAction: 'Pours out the Spirit on all flesh',
    keyChapter: 'Joel 2:28-32',
    explanation: 'Joel promises the Spirit poured out on all flesh. Peter identifies Pentecost as fulfillment (Acts 2).',
    crosslinks: ['Acts 2:16-21', 'John 7:37-39']
  },
  {
    id: 'amos',
    book: 'Amos',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise', 'heart'],
    christTitle: 'Righteous Judge / Restorer of David\'s Tent',
    christAction: 'Judges injustice, rebuilds David\'s fallen tent',
    keyChapter: 'Amos 9:11-12',
    explanation: 'Amos promises restoration of David\'s tent. James applies this to Gentile inclusion through Christ (Acts 15).',
    crosslinks: ['Acts 15:15-17']
  },
  {
    id: 'obadiah',
    book: 'Obadiah',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise', 'trail'],
    christTitle: 'Deliverer on Zion / King of the Kingdom',
    christAction: 'Delivers His people, establishes His kingdom',
    keyChapter: 'Obadiah 1:17, 21',
    explanation: '"Deliverers will go up on Mount Zion... and the kingdom will be the LORD\'s." Christ IS that Deliverer-King.',
    crosslinks: ['Luke 1:33', 'Hebrews 12:22']
  },
  {
    id: 'jonah',
    book: 'Jonah',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['type'],
    christTitle: 'Greater than Jonah / Sign of Resurrection',
    christAction: 'Dies, rises, brings salvation to nations',
    keyChapter: 'Jonah 1:17; Matthew 12:40',
    explanation: 'Jonah\'s three days in fish is THE sign Jesus gives for His resurrection. Greater than Jonah is here.',
    crosslinks: ['Matthew 12:39-41', 'Luke 11:29-32']
  },
  {
    id: 'micah',
    book: 'Micah',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise'],
    christTitle: 'Ruler from Bethlehem / Shepherd-King',
    christAction: 'Born in Bethlehem, shepherds in the strength of the LORD',
    keyChapter: 'Micah 5:2-4',
    explanation: 'Micah predicts Bethlehem as birthplace of the eternal Ruler. The magi and Herod both know this prophecy.',
    crosslinks: ['Matthew 2:4-6', 'John 7:42']
  },
  {
    id: 'nahum',
    book: 'Nahum',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['heart', 'trail'],
    christTitle: 'Avenger / Stronghold',
    christAction: 'Judges oppressors, protects His people',
    keyChapter: 'Nahum 1:7',
    explanation: '"The LORD is good, a stronghold in the day of trouble." Christ is our refuge who will judge all oppressors.',
    crosslinks: ['Romans 12:19', '2 Thessalonians 1:6-8']
  },
  {
    id: 'habakkuk',
    book: 'Habakkuk',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise', 'trail'],
    christTitle: 'Joy of Salvation / Object of Faith',
    christAction: 'Answers faith with righteousness',
    keyChapter: 'Habakkuk 2:4; 3:17-19',
    explanation: '"The righteous shall live by faith" becomes foundational for Paul\'s gospel. Christ is the object of that faith.',
    crosslinks: ['Romans 1:17', 'Galatians 3:11', 'Hebrews 10:38']
  },
  {
    id: 'zephaniah',
    book: 'Zephaniah',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise', 'heart'],
    christTitle: 'Mighty Warrior / Rejoicing King',
    christAction: 'Saves, quiets with love, rejoices over His people',
    keyChapter: 'Zephaniah 3:17',
    explanation: '"The LORD your God is in your midst, a mighty one who will save; he will rejoice over you with gladness."',
    crosslinks: ['Luke 15:7', 'John 15:11']
  },
  {
    id: 'haggai',
    book: 'Haggai',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise', 'unfinished'],
    christTitle: 'Desire of All Nations / Glory of the Temple',
    christAction: 'Fills the temple with greater glory',
    keyChapter: 'Haggai 2:6-9',
    explanation: 'Haggai promises greater glory for the second temple. Christ enters that temple—His presence IS the greater glory.',
    crosslinks: ['Luke 2:27-32', 'John 2:13-22']
  },
  {
    id: 'zechariah',
    book: 'Zechariah',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise', 'type'],
    christTitle: 'Pierced One / King on Donkey / Smitten Shepherd',
    christAction: 'Rides humbly, is pierced, scatters then gathers sheep',
    keyChapter: 'Zechariah 9:9; 12:10; 13:7',
    explanation: 'Zechariah predicts the triumphal entry (9:9), the piercing (12:10), and the struck shepherd (13:7)—all fulfilled in Passion Week.',
    crosslinks: ['Matthew 21:5', 'John 19:37', 'Matthew 26:31']
  },
  {
    id: 'malachi',
    book: 'Malachi',
    testament: 'OT',
    category: 'Minor Prophet',
    methodsUsed: ['promise'],
    christTitle: 'Sun of Righteousness / Messenger of the Covenant',
    christAction: 'Rises with healing, refines and purifies',
    keyChapter: 'Malachi 3:1; 4:2',
    explanation: 'Malachi promises a messenger to prepare the way (John the Baptist) and the Sun of Righteousness (Christ).',
    crosslinks: ['Mark 1:2', 'Luke 1:76-79']
  },

  // NEW TESTAMENT
  {
    id: 'matthew',
    book: 'Matthew',
    testament: 'NT',
    category: 'Gospel',
    methodsUsed: ['promise'],
    christTitle: 'King of the Jews / Son of David',
    christAction: 'Fulfills OT prophecy, teaches kingdom ethics, dies as King',
    keyChapter: 'Matthew 1:1; 27:37',
    explanation: 'Matthew presents Jesus as King—from genealogy through David to "King of the Jews" on the cross.',
    crosslinks: ['Romans 1:3', 'Revelation 19:16']
  },
  {
    id: 'mark',
    book: 'Mark',
    testament: 'NT',
    category: 'Gospel',
    methodsUsed: ['trail'],
    christTitle: 'Suffering Servant',
    christAction: 'Serves, suffers, gives His life as ransom',
    keyChapter: 'Mark 10:45',
    explanation: '"The Son of Man came not to be served but to serve, and to give his life as a ransom for many."',
    crosslinks: ['Isaiah 53:10-12', 'Philippians 2:7']
  },
  {
    id: 'luke',
    book: 'Luke',
    testament: 'NT',
    category: 'Gospel',
    methodsUsed: ['heart'],
    christTitle: 'Son of Man / Friend of Sinners',
    christAction: 'Seeks and saves the lost, welcomes outcasts',
    keyChapter: 'Luke 19:10',
    explanation: '"The Son of Man came to seek and to save the lost." Luke emphasizes Jesus\' compassion for outsiders.',
    crosslinks: ['Luke 15:1-2', 'Matthew 9:10-13']
  },
  {
    id: 'john',
    book: 'John',
    testament: 'NT',
    category: 'Gospel',
    methodsUsed: ['heart', 'promise'],
    christTitle: 'Word Made Flesh / I AM / Son of God',
    christAction: 'Reveals the Father, gives eternal life',
    keyChapter: 'John 1:1-14; 20:31',
    explanation: 'John writes that we might believe Jesus is the Christ, the Son of God. Seven "I AM" statements reveal His deity.',
    crosslinks: ['John 14:9', 'Colossians 1:15']
  },
  {
    id: 'acts',
    book: 'Acts',
    testament: 'NT',
    category: 'History',
    methodsUsed: ['trail'],
    christTitle: 'Risen Lord / Ascended King',
    christAction: 'Sends the Spirit, builds His church, reigns from heaven',
    keyChapter: 'Acts 1:8-9; 2:32-36',
    explanation: 'The risen Christ ascends, sends the Spirit, and empowers witnesses to the ends of the earth.',
    crosslinks: ['Ephesians 1:20-23', 'Hebrews 1:3']
  },
  {
    id: 'romans',
    book: 'Romans',
    testament: 'NT',
    category: 'Epistle',
    methodsUsed: ['heart'],
    christTitle: 'Propitiation / Righteousness of God',
    christAction: 'Justifies the ungodly, fulfills the law',
    keyChapter: 'Romans 3:21-26; 8:1-4',
    explanation: 'Christ is our righteousness—He satisfied God\'s wrath and gives us His righteousness by faith.',
    crosslinks: ['2 Corinthians 5:21', 'Galatians 2:16']
  },
  {
    id: 'revelation',
    book: 'Revelation',
    testament: 'NT',
    category: 'Prophecy',
    methodsUsed: ['promise', 'heart'],
    christTitle: 'Alpha and Omega / Lion-Lamb / King of Kings',
    christAction: 'Conquers, judges, makes all things new',
    keyChapter: 'Revelation 5:5-6; 19:16; 21:5',
    explanation: 'The Lamb who was slain IS the Lion who conquers. He returns as King of Kings and makes all things new.',
    crosslinks: ['Revelation 1:17-18', 'Revelation 22:13']
  }
];

// Helper functions
export const getByTestament = (testament: 'OT' | 'NT') => {
  return christEveryChapterLibrary.filter(b => b.testament === testament);
};

export const getByCategory = (category: string) => {
  return christEveryChapterLibrary.filter(b => b.category === category);
};

export const searchBooks = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return christEveryChapterLibrary.filter(b =>
    b.book.toLowerCase().includes(lowerQuery) ||
    b.christTitle.toLowerCase().includes(lowerQuery) ||
    b.explanation.toLowerCase().includes(lowerQuery)
  );
};

export const getRandomBook = () => {
  return christEveryChapterLibrary[Math.floor(Math.random() * christEveryChapterLibrary.length)];
};

export const getByMethod = (method: FindingMethod) => {
  return christEveryChapterLibrary.filter(b => b.methodsUsed.includes(method));
};

// Method descriptions
export const methodDescriptions: Record<FindingMethod, { name: string; question: string; icon: string }> = {
  promise: {
    name: 'Red-Striped Promise',
    question: 'Where\'s the hint of a coming Hero?',
    icon: 'Target'
  },
  type: {
    name: 'Types & Shadows',
    question: 'Who or what LOOKS LIKE Jesus?',
    icon: 'Users'
  },
  trail: {
    name: 'Gospel Trail',
    question: 'Where\'s the mess only a Savior can fix?',
    icon: 'Route'
  },
  heart: {
    name: "God's Heart",
    question: "What does this reveal about God's character?",
    icon: 'Heart'
  },
  unfinished: {
    name: 'Unfinished Story',
    question: 'What good thing here is incomplete?',
    icon: 'BookOpen'
  }
};

// Get all categories
export const getAllCategories = () => {
  return [...new Set(christEveryChapterLibrary.map(b => b.category))];
};
