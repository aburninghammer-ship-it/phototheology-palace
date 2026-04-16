/**
 * Room 66 Library - Tracking Themes Through All 66 Books
 *
 * Each entry traces a single theme through every book of the Bible,
 * showing how it develops, escalates, and finds fulfillment.
 */

export interface Book66Entry {
  book: string;
  claim: string; // ≤14 words
  proofText: string;
  ptTags: string[]; // PT room codes that apply
}

export interface Room66Theme {
  id: string;
  theme: string;
  description: string;
  constellation: string; // 100-120 word OT→NT synthesis
  books: Book66Entry[];
  contributor?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// All 66 books in order
export const BIBLE_BOOKS = [
  // OT - 39 books
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  // NT - 27 books
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

export const room66Library: Room66Theme[] = [
  {
    id: 'blood-covenant',
    theme: 'The Blood Covenant',
    description: 'Tracing the significance of blood sacrifice from Eden to the Lamb',
    difficulty: 'intermediate',
    constellation: 'Blood first appears after sin, covering Adam and Eve\'s nakedness through animal death (Genesis 3:21). This sacrifice motif escalates through Abel\'s lamb, Noah\'s altar, Abraham\'s ram, and the Passover blood on doorposts. Leviticus codifies blood as the means of atonement: "the life is in the blood" (17:11). Prophets point to a servant whose blood would justify many. Christ fulfills this as the Lamb of God, His blood establishing the new covenant. Hebrews declares "without the shedding of blood there is no remission." Revelation climaxes with the Lamb\'s blood washing robes white, and saints overcoming "by the blood of the Lamb."',
    books: [
      { book: 'Genesis', claim: 'Animal dies to cover Adam\'s nakedness; Abel\'s blood sacrifice accepted', proofText: 'Genesis 3:21; 4:4', ptTags: ['CR', 'ST'] },
      { book: 'Exodus', claim: 'Passover lamb\'s blood on doorposts delivers Israel from death', proofText: 'Exodus 12:13', ptTags: ['CR', 'BL', 'ST'] },
      { book: 'Leviticus', claim: '"The life is in the blood" — blood makes atonement for souls', proofText: 'Leviticus 17:11', ptTags: ['BL', 'DR'] },
      { book: 'Numbers', claim: 'Red heifer\'s blood purifies from defilement of death', proofText: 'Numbers 19:2-9', ptTags: ['ST', 'BL'] },
      { book: 'Deuteronomy', claim: 'Blood not to be eaten; life belongs to God alone', proofText: 'Deuteronomy 12:23', ptTags: ['DR'] },
      { book: 'Joshua', claim: 'Rahab\'s scarlet cord (blood-symbol) saves her household', proofText: 'Joshua 2:18-21', ptTags: ['ST', 'CR'] },
      { book: 'Judges', claim: 'Gideon\'s sacrifice consumed by fire from the rock', proofText: 'Judges 6:21', ptTags: ['ST'] },
      { book: 'Ruth', claim: 'Kinsman-redeemer prefigures Christ\'s blood redemption', proofText: 'Ruth 4:4-6', ptTags: ['CR', 'ST'] },
      { book: '1 Samuel', claim: 'Samuel\'s sacrifice precedes God\'s deliverance at Mizpah', proofText: '1 Samuel 7:9-10', ptTags: ['BL'] },
      { book: '2 Samuel', claim: 'David\'s altar sacrifice stops the plague', proofText: '2 Samuel 24:25', ptTags: ['BL', 'ST'] },
      { book: '1 Kings', claim: 'Elijah\'s sacrifice on Carmel drenched, then consumed by fire', proofText: '1 Kings 18:38', ptTags: ['ST', 'CR'] },
      { book: '2 Kings', claim: 'Passover renewed under Hezekiah with blood sprinkled', proofText: '2 Kings 23:21', ptTags: ['BL'] },
      { book: '1 Chronicles', claim: 'David prepares materials for temple sacrifices', proofText: '1 Chronicles 22:5', ptTags: ['BL'] },
      { book: '2 Chronicles', claim: 'Solomon\'s temple dedication: massive blood offerings', proofText: '2 Chronicles 7:5', ptTags: ['BL'] },
      { book: 'Ezra', claim: 'Returned exiles restore sacrificial system at altar', proofText: 'Ezra 3:2-3', ptTags: ['BL'] },
      { book: 'Nehemiah', claim: 'People covenant to provide for temple sacrifices', proofText: 'Nehemiah 10:33', ptTags: ['BL'] },
      { book: 'Esther', claim: 'Deliverance through one who risks life (blood) for many', proofText: 'Esther 4:16', ptTags: ['CR', 'ST'] },
      { book: 'Job', claim: '"I know my Redeemer lives" — living Kinsman-Redeemer', proofText: 'Job 19:25', ptTags: ['CR'] },
      { book: 'Psalms', claim: 'Sacrifice and offering God does not desire; a body prepared', proofText: 'Psalm 40:6', ptTags: ['CR', 'BL'] },
      { book: 'Proverbs', claim: 'Blood of the innocent cries for justice', proofText: 'Proverbs 6:17', ptTags: ['DR'] },
      { book: 'Ecclesiastes', claim: 'One event (death) comes to all; sacrifice points beyond', proofText: 'Ecclesiastes 3:19', ptTags: ['DR'] },
      { book: 'Song of Solomon', claim: 'Beloved\'s self-giving love prefigures Christ\'s sacrifice', proofText: 'Song of Solomon 8:6', ptTags: ['CR'] },
      { book: 'Isaiah', claim: 'Suffering Servant crushed, His blood justifying many', proofText: 'Isaiah 53:5, 11', ptTags: ['CR', 'PR'] },
      { book: 'Jeremiah', claim: 'New covenant written in hearts, sealed by blood', proofText: 'Jeremiah 31:31-34', ptTags: ['CR', 'PR'] },
      { book: 'Lamentations', claim: 'Blood of prophets shed; yet hope in God\'s faithfulness', proofText: 'Lamentations 4:13', ptTags: ['DR'] },
      { book: 'Ezekiel', claim: 'Blood on doorposts marks those to be spared judgment', proofText: 'Ezekiel 9:4-6', ptTags: ['ST', 'PR'] },
      { book: 'Daniel', claim: 'Messiah "cut off" but not for Himself', proofText: 'Daniel 9:26', ptTags: ['CR', 'PR', 'TZ'] },
      { book: 'Hosea', claim: 'God desires mercy, not sacrifice — heart behind blood', proofText: 'Hosea 6:6', ptTags: ['DR'] },
      { book: 'Joel', claim: 'Blood, fire, smoke precede the great Day of the Lord', proofText: 'Joel 2:30-31', ptTags: ['PR', '1H/2H/3H'] },
      { book: 'Amos', claim: 'God rejects ritual without righteousness; blood without heart', proofText: 'Amos 5:21-22', ptTags: ['DR'] },
      { book: 'Obadiah', claim: 'Violence against brother\'s blood brings judgment', proofText: 'Obadiah 1:10', ptTags: ['DR'] },
      { book: 'Jonah', claim: 'Sacrifice and thanksgiving offered after deliverance', proofText: 'Jonah 2:9', ptTags: ['ST'] },
      { book: 'Micah', claim: 'What does God require? Not rivers of blood but mercy', proofText: 'Micah 6:6-8', ptTags: ['DR'] },
      { book: 'Nahum', claim: 'Bloody city of Nineveh finally judged', proofText: 'Nahum 3:1', ptTags: ['PR'] },
      { book: 'Habakkuk', claim: 'Righteous shall live by faith, not mere ritual blood', proofText: 'Habakkuk 2:4', ptTags: ['DR'] },
      { book: 'Zephaniah', claim: 'Day of the Lord as great sacrifice — blood poured out', proofText: 'Zephaniah 1:7-8', ptTags: ['PR'] },
      { book: 'Haggai', claim: 'Temple rebuilt for restored sacrificial worship', proofText: 'Haggai 1:8', ptTags: ['BL'] },
      { book: 'Zechariah', claim: 'Fountain opened for sin and uncleanness', proofText: 'Zechariah 13:1', ptTags: ['CR', 'PR'] },
      { book: 'Malachi', claim: 'Polluted offerings rejected; pure offering coming', proofText: 'Malachi 1:7-11', ptTags: ['CR', 'BL'] },
      { book: 'Matthew', claim: '"This is my blood of the new covenant, shed for many"', proofText: 'Matthew 26:28', ptTags: ['CR', 'BL'] },
      { book: 'Mark', claim: 'Jesus\' blood poured out at Calvary for ransom', proofText: 'Mark 10:45; 15:37', ptTags: ['CR'] },
      { book: 'Luke', claim: 'Cup of the new covenant in Jesus\' blood', proofText: 'Luke 22:20', ptTags: ['CR', 'BL'] },
      { book: 'John', claim: '"Behold the Lamb of God who takes away sin"', proofText: 'John 1:29', ptTags: ['CR', 'ST'] },
      { book: 'Acts', claim: 'Church purchased with Christ\'s own blood', proofText: 'Acts 20:28', ptTags: ['CR'] },
      { book: 'Romans', claim: 'Justified by His blood, saved from wrath through Him', proofText: 'Romans 5:9', ptTags: ['CR', 'DR'] },
      { book: '1 Corinthians', claim: 'Cup is participation in Christ\'s blood', proofText: '1 Corinthians 10:16', ptTags: ['CR', 'BL'] },
      { book: '2 Corinthians', claim: 'God made Him sin, that we become righteousness', proofText: '2 Corinthians 5:21', ptTags: ['CR'] },
      { book: 'Galatians', claim: 'Christ redeemed us, becoming a curse for us', proofText: 'Galatians 3:13', ptTags: ['CR'] },
      { book: 'Ephesians', claim: 'Redemption through His blood, forgiveness of sins', proofText: 'Ephesians 1:7', ptTags: ['CR'] },
      { book: 'Philippians', claim: 'Christ obedient to death, even death on a cross', proofText: 'Philippians 2:8', ptTags: ['CR'] },
      { book: 'Colossians', claim: 'Peace made through the blood of His cross', proofText: 'Colossians 1:20', ptTags: ['CR'] },
      { book: '1 Thessalonians', claim: 'Jesus delivers us from coming wrath', proofText: '1 Thessalonians 1:10', ptTags: ['CR'] },
      { book: '2 Thessalonians', claim: 'Christ\'s sacrifice the foundation of future hope', proofText: '2 Thessalonians 2:16', ptTags: ['CR'] },
      { book: '1 Timothy', claim: 'Christ gave Himself a ransom for all', proofText: '1 Timothy 2:6', ptTags: ['CR'] },
      { book: '2 Timothy', claim: 'Grace given in Christ before time began', proofText: '2 Timothy 1:9', ptTags: ['CR', 'TZ'] },
      { book: 'Titus', claim: 'Christ gave Himself to redeem and purify a people', proofText: 'Titus 2:14', ptTags: ['CR'] },
      { book: 'Philemon', claim: 'Paul offers to pay any debt — substitution illustrated', proofText: 'Philemon 1:18-19', ptTags: ['CR', 'ST'] },
      { book: 'Hebrews', claim: '"Without shedding of blood there is no remission"', proofText: 'Hebrews 9:22', ptTags: ['CR', 'BL'] },
      { book: 'James', claim: 'Faith without works is dead; blood produces living faith', proofText: 'James 2:26', ptTags: ['DR'] },
      { book: '1 Peter', claim: 'Redeemed by precious blood of Christ, lamb without blemish', proofText: '1 Peter 1:18-19', ptTags: ['CR', 'ST'] },
      { book: '2 Peter', claim: 'False teachers deny the Master who bought them', proofText: '2 Peter 2:1', ptTags: ['CR'] },
      { book: '1 John', claim: 'Blood of Jesus cleanses from all sin', proofText: '1 John 1:7', ptTags: ['CR'] },
      { book: '2 John', claim: 'Abide in doctrine of Christ who came in flesh/blood', proofText: '2 John 1:9', ptTags: ['CR'] },
      { book: '3 John', claim: 'Walking in truth reflects the life Christ\'s blood purchased', proofText: '3 John 1:4', ptTags: ['DR'] },
      { book: 'Jude', claim: 'Kept for Jesus Christ; preserved by His sacrifice', proofText: 'Jude 1:1', ptTags: ['CR'] },
      { book: 'Revelation', claim: 'Overcame by the blood of the Lamb; washed robes white', proofText: 'Revelation 12:11; 7:14', ptTags: ['CR', 'PR'] }
    ]
  },
  {
    id: 'kingdom-of-god',
    theme: 'The Kingdom of God',
    description: 'Tracing God\'s rule from creation to the eternal kingdom',
    difficulty: 'intermediate',
    constellation: 'God\'s kingdom begins at creation when He establishes dominion over all. After the fall, the kingdom operates through patriarchs and a chosen nation. Israel\'s earthly kingdom rises and falls, pointing to something greater. Prophets announce a coming eternal kingdom that will crush all others. Jesus arrives proclaiming "the kingdom of heaven is at hand," demonstrating its presence through miracles. His parables reveal kingdom mysteries. The church becomes kingdom citizens, ambassadors between the "already" and "not yet." Revelation culminates with "the kingdoms of this world become the kingdoms of our Lord" and the New Jerusalem descending—God\'s throne among His people forever.',
    books: [
      { book: 'Genesis', claim: 'God creates and rules; gives mankind dominion over earth', proofText: 'Genesis 1:1, 26-28', ptTags: ['TZ', 'DR'] },
      { book: 'Exodus', claim: 'God establishes Israel as His kingdom of priests', proofText: 'Exodus 19:5-6', ptTags: ['DR', 'BL'] },
      { book: 'Leviticus', claim: 'Holiness code defines kingdom citizens\' conduct', proofText: 'Leviticus 19:2', ptTags: ['DR'] },
      { book: 'Numbers', claim: 'Kingdom organized with tribes, camps, and order', proofText: 'Numbers 2:1-2', ptTags: ['DR'] },
      { book: 'Deuteronomy', claim: 'Kingdom laws given before entering promised land', proofText: 'Deuteronomy 17:14-20', ptTags: ['DR'] },
      { book: 'Joshua', claim: 'Kingdom territory conquered and distributed', proofText: 'Joshua 11:23', ptTags: ['TZ'] },
      { book: 'Judges', claim: 'No king in Israel; everyone does what is right in own eyes', proofText: 'Judges 21:25', ptTags: ['DR'] },
      { book: 'Ruth', claim: 'Gentile enters the kingdom line leading to David', proofText: 'Ruth 4:17', ptTags: ['CR'] },
      { book: '1 Samuel', claim: 'Israel rejects God as King, demands human king', proofText: '1 Samuel 8:7', ptTags: ['DR'] },
      { book: '2 Samuel', claim: 'Davidic covenant: throne established forever', proofText: '2 Samuel 7:12-16', ptTags: ['CR', 'PR'] },
      { book: '1 Kings', claim: 'Solomon\'s kingdom glory; then division', proofText: '1 Kings 4:21; 11:11', ptTags: ['TZ'] },
      { book: '2 Kings', claim: 'Both kingdoms fall; throne empty, awaiting Messiah', proofText: '2 Kings 25:21', ptTags: ['PR'] },
      { book: '1 Chronicles', claim: 'David prepares for eternal kingdom through temple', proofText: '1 Chronicles 29:11', ptTags: ['BL'] },
      { book: '2 Chronicles', claim: 'Temple as kingdom center; exile ends the earthly pattern', proofText: '2 Chronicles 36:23', ptTags: ['BL', 'TZ'] },
      { book: 'Ezra', claim: 'Remnant returns; kingdom being rebuilt', proofText: 'Ezra 1:1-3', ptTags: ['TZ'] },
      { book: 'Nehemiah', claim: 'Walls rebuilt; kingdom infrastructure restored', proofText: 'Nehemiah 6:15', ptTags: ['TZ'] },
      { book: 'Esther', claim: 'God\'s hidden sovereignty protects kingdom people', proofText: 'Esther 4:14', ptTags: ['DR'] },
      { book: 'Job', claim: '"The LORD gave, the LORD takes away" — sovereignty affirmed', proofText: 'Job 1:21', ptTags: ['DR'] },
      { book: 'Psalms', claim: '"The LORD has established His throne in heaven"', proofText: 'Psalm 103:19', ptTags: ['TZ', 'DR'] },
      { book: 'Proverbs', claim: 'Wisdom builds the kingdom; righteousness exalts a nation', proofText: 'Proverbs 14:34', ptTags: ['DR'] },
      { book: 'Ecclesiastes', claim: 'Earthly kingdoms are vanity; eternal kingdom endures', proofText: 'Ecclesiastes 1:2; 12:13', ptTags: ['DR'] },
      { book: 'Song of Solomon', claim: 'King Solomon as type of the greater King', proofText: 'Song of Solomon 1:4', ptTags: ['CR', 'ST'] },
      { book: 'Isaiah', claim: 'Child born who will reign on David\'s throne forever', proofText: 'Isaiah 9:6-7', ptTags: ['CR', 'PR'] },
      { book: 'Jeremiah', claim: 'Righteous Branch to reign as King wisely', proofText: 'Jeremiah 23:5', ptTags: ['CR', 'PR'] },
      { book: 'Lamentations', claim: 'Kingdom destroyed; yet "the LORD is my portion"', proofText: 'Lamentations 3:24', ptTags: ['DR'] },
      { book: 'Ezekiel', claim: 'God Himself will shepherd and be King', proofText: 'Ezekiel 34:11-16', ptTags: ['CR', 'PR'] },
      { book: 'Daniel', claim: 'Stone kingdom crushes all others, fills the earth', proofText: 'Daniel 2:44', ptTags: ['PR', 'TZ'] },
      { book: 'Hosea', claim: 'Israel will return and seek the LORD their King', proofText: 'Hosea 3:5', ptTags: ['PR'] },
      { book: 'Joel', claim: 'The LORD will reign in Zion forever', proofText: 'Joel 3:21', ptTags: ['PR', 'TZ'] },
      { book: 'Amos', claim: 'Booth of David to be raised up', proofText: 'Amos 9:11', ptTags: ['PR'] },
      { book: 'Obadiah', claim: 'The kingdom shall be the LORD\'s', proofText: 'Obadiah 1:21', ptTags: ['PR'] },
      { book: 'Jonah', claim: 'God\'s kingdom concern extends to all nations', proofText: 'Jonah 4:11', ptTags: ['DR'] },
      { book: 'Micah', claim: 'Ruler from Bethlehem whose origin is from everlasting', proofText: 'Micah 5:2', ptTags: ['CR', 'PR'] },
      { book: 'Nahum', claim: 'Enemy kingdoms will fall; God reigns', proofText: 'Nahum 1:7', ptTags: ['PR'] },
      { book: 'Habakkuk', claim: 'Earth will be filled with knowledge of God\'s glory', proofText: 'Habakkuk 2:14', ptTags: ['PR', 'TZ'] },
      { book: 'Zephaniah', claim: '"The King of Israel, the LORD, is in your midst"', proofText: 'Zephaniah 3:15', ptTags: ['CR', 'PR'] },
      { book: 'Haggai', claim: 'Latter glory of this house greater than former', proofText: 'Haggai 2:9', ptTags: ['PR', 'BL'] },
      { book: 'Zechariah', claim: 'King comes humble, riding on a donkey', proofText: 'Zechariah 9:9', ptTags: ['CR', 'PR'] },
      { book: 'Malachi', claim: '"The Lord whom you seek will suddenly come"', proofText: 'Malachi 3:1', ptTags: ['CR', 'PR'] },
      { book: 'Matthew', claim: '"Repent, for the kingdom of heaven is at hand"', proofText: 'Matthew 4:17', ptTags: ['CR'] },
      { book: 'Mark', claim: 'Jesus proclaims the kingdom and demonstrates its power', proofText: 'Mark 1:15', ptTags: ['CR'] },
      { book: 'Luke', claim: '"The kingdom of God is in your midst"', proofText: 'Luke 17:21', ptTags: ['CR'] },
      { book: 'John', claim: '"My kingdom is not of this world"', proofText: 'John 18:36', ptTags: ['CR', 'TZ'] },
      { book: 'Acts', claim: 'Apostles preach the kingdom; church as citizens', proofText: 'Acts 28:31', ptTags: ['DR'] },
      { book: 'Romans', claim: 'Kingdom is righteousness, peace, joy in the Holy Spirit', proofText: 'Romans 14:17', ptTags: ['DR'] },
      { book: '1 Corinthians', claim: 'Flesh and blood cannot inherit the kingdom', proofText: '1 Corinthians 15:50', ptTags: ['TZ'] },
      { book: '2 Corinthians', claim: 'Ambassadors for Christ — kingdom representatives', proofText: '2 Corinthians 5:20', ptTags: ['DR'] },
      { book: 'Galatians', claim: 'Those who practice sin will not inherit the kingdom', proofText: 'Galatians 5:21', ptTags: ['DR'] },
      { book: 'Ephesians', claim: 'Believers seated with Christ in heavenly places', proofText: 'Ephesians 2:6', ptTags: ['TZ'] },
      { book: 'Philippians', claim: 'Our citizenship is in heaven', proofText: 'Philippians 3:20', ptTags: ['TZ'] },
      { book: 'Colossians', claim: 'Transferred to the kingdom of His beloved Son', proofText: 'Colossians 1:13', ptTags: ['CR'] },
      { book: '1 Thessalonians', claim: 'Called into His kingdom and glory', proofText: '1 Thessalonians 2:12', ptTags: ['DR'] },
      { book: '2 Thessalonians', claim: 'Worthy of the kingdom for which you suffer', proofText: '2 Thessalonians 1:5', ptTags: ['DR'] },
      { book: '1 Timothy', claim: '"To the King eternal, immortal, invisible"', proofText: '1 Timothy 1:17', ptTags: ['DR'] },
      { book: '2 Timothy', claim: 'The Lord will bring me safely to His heavenly kingdom', proofText: '2 Timothy 4:18', ptTags: ['TZ'] },
      { book: 'Titus', claim: 'Heirs according to the hope of eternal life', proofText: 'Titus 3:7', ptTags: ['TZ'] },
      { book: 'Philemon', claim: 'Kingdom relationships transform social structures', proofText: 'Philemon 1:16', ptTags: ['DR'] },
      { book: 'Hebrews', claim: 'Receiving a kingdom that cannot be shaken', proofText: 'Hebrews 12:28', ptTags: ['TZ', 'DR'] },
      { book: 'James', claim: 'God chose the poor to be rich in faith, heirs of kingdom', proofText: 'James 2:5', ptTags: ['DR'] },
      { book: '1 Peter', claim: 'Royal priesthood, holy nation — kingdom identity', proofText: '1 Peter 2:9', ptTags: ['DR', 'BL'] },
      { book: '2 Peter', claim: 'Entrance into the eternal kingdom richly provided', proofText: '2 Peter 1:11', ptTags: ['TZ'] },
      { book: '1 John', claim: 'The world is passing away; God\'s kingdom endures', proofText: '1 John 2:17', ptTags: ['TZ'] },
      { book: '2 John', claim: 'Walking in truth as kingdom citizens', proofText: '2 John 1:4', ptTags: ['DR'] },
      { book: '3 John', claim: 'Fellow workers for the truth — kingdom laborers', proofText: '3 John 1:8', ptTags: ['DR'] },
      { book: 'Jude', claim: 'Preserved for Jesus Christ — kept for the kingdom', proofText: 'Jude 1:1', ptTags: ['DR'] },
      { book: 'Revelation', claim: '"The kingdoms of this world become the kingdoms of our Lord"', proofText: 'Revelation 11:15', ptTags: ['PR', 'TZ'] }
    ]
  },
  {
    id: 'rest-sabbath',
    theme: 'Rest and Sabbath',
    description: 'Tracing God\'s rest from creation to eternal Sabbath',
    difficulty: 'beginner',
    constellation: 'God rested on the seventh day, blessing and sanctifying it (Genesis 2:2-3). This creation rest becomes codified in the fourth commandment: "Remember the Sabbath day." Israel\'s wilderness journey and land possession are framed as entering God\'s rest. The Sabbath becomes a sign of the covenant between God and His people. Prophets call Israel back to true Sabbath-keeping. Jesus declares Himself "Lord of the Sabbath" and offers rest to the weary. Hebrews warns of missing God\'s rest through unbelief while promising a "Sabbath rest remains." Revelation\'s new creation brings eternal rest in God\'s presence.',
    books: [
      { book: 'Genesis', claim: 'God rested the seventh day; blessed and sanctified it', proofText: 'Genesis 2:2-3', ptTags: ['TZ', 'ST'] },
      { book: 'Exodus', claim: '"Remember the Sabbath day to keep it holy"', proofText: 'Exodus 20:8-11', ptTags: ['DR', 'BL'] },
      { book: 'Leviticus', claim: 'Sabbath and land Sabbaths for rest and restoration', proofText: 'Leviticus 25:4', ptTags: ['DR'] },
      { book: 'Numbers', claim: 'Man gathering sticks on Sabbath judged', proofText: 'Numbers 15:32-36', ptTags: ['DR'] },
      { book: 'Deuteronomy', claim: 'Sabbath rooted in redemption from Egypt', proofText: 'Deuteronomy 5:15', ptTags: ['DR'] },
      { book: 'Joshua', claim: 'Israel enters land rest after wandering', proofText: 'Joshua 21:44', ptTags: ['TZ', 'ST'] },
      { book: 'Judges', claim: 'Cycles of unrest due to disobedience', proofText: 'Judges 2:18-19', ptTags: ['DR'] },
      { book: 'Ruth', claim: 'Ruth finds rest in Boaz — kinsman-redeemer', proofText: 'Ruth 3:1', ptTags: ['CR', 'ST'] },
      { book: '1 Samuel', claim: 'God gives David rest from enemies', proofText: '1 Samuel 25:29', ptTags: ['TZ'] },
      { book: '2 Samuel', claim: '"The LORD had given him rest from enemies"', proofText: '2 Samuel 7:1', ptTags: ['TZ'] },
      { book: '1 Kings', claim: 'Solomon\'s rest enables temple building', proofText: '1 Kings 5:4', ptTags: ['BL', 'TZ'] },
      { book: '2 Kings', claim: 'Sabbath rest violated; judgment comes', proofText: '2 Kings 16:18', ptTags: ['DR'] },
      { book: '1 Chronicles', claim: 'David\'s rest from war allows temple preparation', proofText: '1 Chronicles 22:9', ptTags: ['BL'] },
      { book: '2 Chronicles', claim: 'Land kept its Sabbaths during exile', proofText: '2 Chronicles 36:21', ptTags: ['TZ', 'DR'] },
      { book: 'Ezra', claim: 'Rest restored as people return to worship', proofText: 'Ezra 6:16', ptTags: ['TZ'] },
      { book: 'Nehemiah', claim: 'Sabbath commerce stopped; rest enforced', proofText: 'Nehemiah 13:15-19', ptTags: ['DR'] },
      { book: 'Esther', claim: 'Purim feast as rest from enemies', proofText: 'Esther 9:22', ptTags: ['TZ'] },
      { book: 'Job', claim: '"The wicked cease from troubling; weary are at rest"', proofText: 'Job 3:17', ptTags: ['TZ'] },
      { book: 'Psalms', claim: '"Return to your rest, O my soul"', proofText: 'Psalm 116:7', ptTags: ['DR'] },
      { book: 'Proverbs', claim: '"When a man\'s ways please the LORD, enemies at peace"', proofText: 'Proverbs 16:7', ptTags: ['DR'] },
      { book: 'Ecclesiastes', claim: 'No rest for the wicked; labor under the sun', proofText: 'Ecclesiastes 2:23', ptTags: ['DR'] },
      { book: 'Song of Solomon', claim: 'Rest in the beloved\'s embrace', proofText: 'Song of Solomon 2:6', ptTags: ['CR'] },
      { book: 'Isaiah', claim: '"If you call the Sabbath a delight... then you shall delight in the LORD"', proofText: 'Isaiah 58:13-14', ptTags: ['DR'] },
      { book: 'Jeremiah', claim: 'Sabbath obedience linked to city\'s continuance', proofText: 'Jeremiah 17:24-27', ptTags: ['DR', 'PR'] },
      { book: 'Lamentations', claim: 'Sabbaths forgotten; enemies rejoice', proofText: 'Lamentations 2:6', ptTags: ['DR'] },
      { book: 'Ezekiel', claim: 'Sabbath as sign between God and His people', proofText: 'Ezekiel 20:12', ptTags: ['ST', 'DR'] },
      { book: 'Daniel', claim: 'Little horn thinks to change times and law (Sabbath)', proofText: 'Daniel 7:25', ptTags: ['PR', 'TZ'] },
      { book: 'Hosea', claim: 'God will end false Sabbath celebrations', proofText: 'Hosea 2:11', ptTags: ['DR'] },
      { book: 'Joel', claim: 'Call solemn assembly; sanctify a fast', proofText: 'Joel 1:14', ptTags: ['DR'] },
      { book: 'Amos', claim: 'Merchants impatient for Sabbath to end for trading', proofText: 'Amos 8:5', ptTags: ['DR'] },
      { book: 'Obadiah', claim: 'Rest from enemies promised in Mount Zion', proofText: 'Obadiah 1:17', ptTags: ['TZ'] },
      { book: 'Jonah', claim: 'Sailors rest only when Jonah removed', proofText: 'Jonah 1:15', ptTags: ['ST'] },
      { book: 'Micah', claim: 'Each under vine and fig tree — Messianic rest', proofText: 'Micah 4:4', ptTags: ['PR', 'TZ'] },
      { book: 'Nahum', claim: 'Judah can keep feasts; enemy destroyed', proofText: 'Nahum 1:15', ptTags: ['TZ'] },
      { book: 'Habakkuk', claim: '"I will quietly wait for the day of trouble"', proofText: 'Habakkuk 3:16', ptTags: ['DR'] },
      { book: 'Zephaniah', claim: '"The LORD your God is in your midst... He will quiet you"', proofText: 'Zephaniah 3:17', ptTags: ['CR'] },
      { book: 'Haggai', claim: 'Work now so future rest can come in glory', proofText: 'Haggai 2:4-5', ptTags: ['TZ'] },
      { book: 'Zechariah', claim: 'Jerusalem will dwell securely in rest', proofText: 'Zechariah 14:11', ptTags: ['TZ', 'PR'] },
      { book: 'Malachi', claim: 'Sun of righteousness brings healing — ultimate rest', proofText: 'Malachi 4:2', ptTags: ['CR', 'TZ'] },
      { book: 'Matthew', claim: '"Come to Me... I will give you rest"', proofText: 'Matthew 11:28-29', ptTags: ['CR'] },
      { book: 'Mark', claim: '"The Sabbath was made for man, not man for Sabbath"', proofText: 'Mark 2:27', ptTags: ['CR', 'DR'] },
      { book: 'Luke', claim: 'Jesus\' custom was to worship on Sabbath', proofText: 'Luke 4:16', ptTags: ['CR'] },
      { book: 'John', claim: '"My Father works, and I work" — Lord of Sabbath', proofText: 'John 5:17', ptTags: ['CR'] },
      { book: 'Acts', claim: 'Paul reasons in synagogue every Sabbath', proofText: 'Acts 18:4', ptTags: ['DR'] },
      { book: 'Romans', claim: 'One person esteems one day; let each be convinced', proofText: 'Romans 14:5', ptTags: ['DR'] },
      { book: '1 Corinthians', claim: 'Christ our Passover; feasts point to rest in Him', proofText: '1 Corinthians 5:7-8', ptTags: ['CR', 'ST'] },
      { book: '2 Corinthians', claim: 'Troubles now; eternal rest coming', proofText: '2 Corinthians 4:17', ptTags: ['TZ'] },
      { book: 'Galatians', claim: 'Freedom in Christ includes rest from law\'s burden', proofText: 'Galatians 5:1', ptTags: ['CR'] },
      { book: 'Ephesians', claim: 'Seated with Christ in heavenly rest', proofText: 'Ephesians 2:6', ptTags: ['TZ'] },
      { book: 'Philippians', claim: '"The peace of God will guard your hearts"', proofText: 'Philippians 4:7', ptTags: ['DR'] },
      { book: 'Colossians', claim: 'Sabbaths are shadow; substance is Christ', proofText: 'Colossians 2:16-17', ptTags: ['CR', 'ST'] },
      { book: '1 Thessalonians', claim: 'Dead in Christ rise first — ultimate rest', proofText: '1 Thessalonians 4:16', ptTags: ['TZ'] },
      { book: '2 Thessalonians', claim: 'Rest with us when Lord revealed from heaven', proofText: '2 Thessalonians 1:7', ptTags: ['TZ'] },
      { book: '1 Timothy', claim: 'Godliness with contentment is great gain — inner rest', proofText: '1 Timothy 6:6', ptTags: ['DR'] },
      { book: '2 Timothy', claim: 'Crown of righteousness awaits — reward rest', proofText: '2 Timothy 4:8', ptTags: ['TZ'] },
      { book: 'Titus', claim: 'Blessed hope of Christ\'s appearing — rest coming', proofText: 'Titus 2:13', ptTags: ['TZ'] },
      { book: 'Philemon', claim: 'Refreshed hearts — relational rest', proofText: 'Philemon 1:20', ptTags: ['DR'] },
      { book: 'Hebrews', claim: '"There remains a Sabbath rest for the people of God"', proofText: 'Hebrews 4:9', ptTags: ['CR', 'TZ'] },
      { book: 'James', claim: 'Be patient; establish hearts; Lord\'s coming near', proofText: 'James 5:8', ptTags: ['TZ'] },
      { book: '1 Peter', claim: 'Cast all anxiety on Him — rest in His care', proofText: '1 Peter 5:7', ptTags: ['DR'] },
      { book: '2 Peter', claim: 'Day of the Lord coming; new heavens and earth', proofText: '2 Peter 3:13', ptTags: ['TZ'] },
      { book: '1 John', claim: 'No fear in love; perfect love brings rest', proofText: '1 John 4:18', ptTags: ['DR'] },
      { book: '2 John', claim: 'Walking in truth brings peace', proofText: '2 John 1:3', ptTags: ['DR'] },
      { book: '3 John', claim: 'Soul prospers as walks in truth', proofText: '3 John 1:2', ptTags: ['DR'] },
      { book: 'Jude', claim: 'Kept from stumbling; presented faultless with joy', proofText: 'Jude 1:24', ptTags: ['TZ'] },
      { book: 'Revelation', claim: '"Blessed are the dead who die in the Lord; they rest from labors"', proofText: 'Revelation 14:13', ptTags: ['TZ', 'PR'] }
    ]
  },
  {
    id: 'light-darkness',
    theme: 'Light and Darkness',
    description: 'Tracing the cosmic conflict between light and darkness',
    difficulty: 'beginner',
    constellation: 'God\'s first creative act separates light from darkness (Genesis 1:3-4). Light becomes a symbol of God\'s presence, truth, and salvation while darkness represents evil, ignorance, and judgment. Israel follows a pillar of fire by night. The sanctuary\'s lampstand burns continually. Prophets announce a coming Light to the nations. Jesus declares "I am the light of the world." His followers are called to be light. The final battle is between the dragon and the Lamb. Revelation\'s New Jerusalem needs no sun, "for the Lord God gives them light"—eternal victory of light over darkness.',
    books: [
      { book: 'Genesis', claim: '"Let there be light" — light separated from darkness', proofText: 'Genesis 1:3-4', ptTags: ['TZ', 'ST'] },
      { book: 'Exodus', claim: 'Pillar of fire gives light to Israel by night', proofText: 'Exodus 13:21', ptTags: ['ST', 'CR'] },
      { book: 'Leviticus', claim: 'Lampstand must burn continually before the Lord', proofText: 'Leviticus 24:2', ptTags: ['BL', 'ST'] },
      { book: 'Numbers', claim: 'Aaron lights the lamps facing forward', proofText: 'Numbers 8:2', ptTags: ['BL'] },
      { book: 'Deuteronomy', claim: 'The LORD is a consuming fire — light and judgment', proofText: 'Deuteronomy 4:24', ptTags: ['ST'] },
      { book: 'Joshua', claim: 'Sun stands still — light extended for victory', proofText: 'Joshua 10:12-13', ptTags: ['ST'] },
      { book: 'Judges', claim: 'Gideon\'s torches break darkness; victory by light', proofText: 'Judges 7:20', ptTags: ['ST'] },
      { book: 'Ruth', claim: 'Ruth comes from darkness of Moab to light of Israel', proofText: 'Ruth 1:16', ptTags: ['ST'] },
      { book: '1 Samuel', claim: '"The LORD is my light and salvation"', proofText: 'Psalm 27:1 (cf. 1 Samuel 2:9)', ptTags: ['CR'] },
      { book: '2 Samuel', claim: 'David: "You are my lamp, O LORD; the LORD lightens my darkness"', proofText: '2 Samuel 22:29', ptTags: ['CR'] },
      { book: '1 Kings', claim: 'God keeps a lamp for David in Jerusalem', proofText: '1 Kings 11:36', ptTags: ['CR', 'ST'] },
      { book: '2 Kings', claim: 'Lamp of David preserved through righteous kings', proofText: '2 Kings 8:19', ptTags: ['CR'] },
      { book: '1 Chronicles', claim: 'Glory of the Lord fills temple — light presence', proofText: '1 Chronicles 5:13-14', ptTags: ['BL'] },
      { book: '2 Chronicles', claim: 'Temple filled with God\'s glory-light', proofText: '2 Chronicles 7:1', ptTags: ['BL', 'ST'] },
      { book: 'Ezra', claim: 'Light returning to Jerusalem after darkness of exile', proofText: 'Ezra 9:8', ptTags: ['TZ'] },
      { book: 'Nehemiah', claim: 'Pillar of fire led them; God\'s light through history', proofText: 'Nehemiah 9:12', ptTags: ['ST'] },
      { book: 'Esther', claim: '"Light and gladness and joy" for Jews after darkness', proofText: 'Esther 8:16', ptTags: ['TZ'] },
      { book: 'Job', claim: '"Where is the way to the dwelling of light?"', proofText: 'Job 38:19', ptTags: ['DR'] },
      { book: 'Psalms', claim: '"Your word is a lamp to my feet and a light to my path"', proofText: 'Psalm 119:105', ptTags: ['ST', 'DR'] },
      { book: 'Proverbs', claim: '"The path of the righteous is like the light of dawn"', proofText: 'Proverbs 4:18', ptTags: ['DR'] },
      { book: 'Ecclesiastes', claim: '"Light is sweet, and it is pleasant for the eyes to see the sun"', proofText: 'Ecclesiastes 11:7', ptTags: ['DR'] },
      { book: 'Song of Solomon', claim: 'Beloved compared to the dawn, fair as the moon', proofText: 'Song of Solomon 6:10', ptTags: ['CR'] },
      { book: 'Isaiah', claim: '"The people walking in darkness have seen a great light"', proofText: 'Isaiah 9:2', ptTags: ['CR', 'PR'] },
      { book: 'Jeremiah', claim: 'Sun, moon, stars for light by day and night', proofText: 'Jeremiah 31:35', ptTags: ['TZ'] },
      { book: 'Lamentations', claim: 'Darkness of judgment: "He has driven me into darkness"', proofText: 'Lamentations 3:2', ptTags: ['DR'] },
      { book: 'Ezekiel', claim: 'Darkness covers Egypt — judgment light withdrawn', proofText: 'Ezekiel 32:7-8', ptTags: ['PR'] },
      { book: 'Daniel', claim: '"Light dwells with Him" — God reveals deep things', proofText: 'Daniel 2:22', ptTags: ['DR'] },
      { book: 'Hosea', claim: '"His going out is sure as the dawn"', proofText: 'Hosea 6:3', ptTags: ['CR'] },
      { book: 'Joel', claim: 'Sun darkened before great Day of the Lord', proofText: 'Joel 2:31', ptTags: ['PR', '1H/2H/3H'] },
      { book: 'Amos', claim: '"Day of the LORD is darkness, not light"', proofText: 'Amos 5:18', ptTags: ['PR'] },
      { book: 'Obadiah', claim: 'Darkness of judgment on Edom', proofText: 'Obadiah 1:8', ptTags: ['PR'] },
      { book: 'Jonah', claim: 'Darkness of the fish\'s belly; then deliverance', proofText: 'Jonah 2:4', ptTags: ['ST'] },
      { book: 'Micah', claim: '"When I sit in darkness, the LORD will be my light"', proofText: 'Micah 7:8', ptTags: ['CR'] },
      { book: 'Nahum', claim: 'Darkness pursues God\'s enemies', proofText: 'Nahum 1:8', ptTags: ['PR'] },
      { book: 'Habakkuk', claim: 'His brightness is like light; rays flash from His hand', proofText: 'Habakkuk 3:4', ptTags: ['CR'] },
      { book: 'Zephaniah', claim: 'Day of wrath: day of darkness and gloom', proofText: 'Zephaniah 1:15', ptTags: ['PR'] },
      { book: 'Haggai', claim: 'Shake heaven and earth; glory to fill temple', proofText: 'Haggai 2:7', ptTags: ['PR', 'BL'] },
      { book: 'Zechariah', claim: '"At evening time there shall be light"', proofText: 'Zechariah 14:7', ptTags: ['PR', 'TZ'] },
      { book: 'Malachi', claim: '"The Sun of righteousness shall rise with healing in His wings"', proofText: 'Malachi 4:2', ptTags: ['CR', 'PR'] },
      { book: 'Matthew', claim: '"The people sitting in darkness have seen a great light"', proofText: 'Matthew 4:16', ptTags: ['CR'] },
      { book: 'Mark', claim: 'Darkness over the land from sixth to ninth hour', proofText: 'Mark 15:33', ptTags: ['CR'] },
      { book: 'Luke', claim: '"A light for revelation to the Gentiles"', proofText: 'Luke 2:32', ptTags: ['CR'] },
      { book: 'John', claim: '"I am the light of the world"', proofText: 'John 8:12', ptTags: ['CR', 'ST'] },
      { book: 'Acts', claim: 'Saul blinded by light; becomes vessel of light', proofText: 'Acts 9:3; 26:18', ptTags: ['CR'] },
      { book: 'Romans', claim: '"Put on the armor of light"', proofText: 'Romans 13:12', ptTags: ['DR'] },
      { book: '1 Corinthians', claim: 'God will bring to light hidden things of darkness', proofText: '1 Corinthians 4:5', ptTags: ['PR'] },
      { book: '2 Corinthians', claim: '"God who said light shine out of darkness has shone in our hearts"', proofText: '2 Corinthians 4:6', ptTags: ['CR'] },
      { book: 'Galatians', claim: 'Freedom from darkness of law\'s curse', proofText: 'Galatians 3:13', ptTags: ['CR'] },
      { book: 'Ephesians', claim: '"You were darkness, but now you are light in the Lord"', proofText: 'Ephesians 5:8', ptTags: ['DR'] },
      { book: 'Philippians', claim: 'Shine as lights in the world holding forth word of life', proofText: 'Philippians 2:15', ptTags: ['DR'] },
      { book: 'Colossians', claim: 'Delivered from domain of darkness to kingdom of Son', proofText: 'Colossians 1:13', ptTags: ['CR'] },
      { book: '1 Thessalonians', claim: '"You are all children of light, children of the day"', proofText: '1 Thessalonians 5:5', ptTags: ['DR'] },
      { book: '2 Thessalonians', claim: 'Lawless one destroyed by brightness of Christ\'s coming', proofText: '2 Thessalonians 2:8', ptTags: ['PR'] },
      { book: '1 Timothy', claim: 'God dwells in unapproachable light', proofText: '1 Timothy 6:16', ptTags: ['DR'] },
      { book: '2 Timothy', claim: 'Christ brought life and immortality to light', proofText: '2 Timothy 1:10', ptTags: ['CR'] },
      { book: 'Titus', claim: 'Grace appeared (epiphanied) — light breaking in', proofText: 'Titus 2:11', ptTags: ['CR'] },
      { book: 'Philemon', claim: 'Onesimus now useful — transformation by light', proofText: 'Philemon 1:11', ptTags: ['DR'] },
      { book: 'Hebrews', claim: 'Enlightened ones who have tasted heavenly gift', proofText: 'Hebrews 6:4', ptTags: ['DR'] },
      { book: 'James', claim: '"Father of lights with whom is no variation"', proofText: 'James 1:17', ptTags: ['DR'] },
      { book: '1 Peter', claim: 'Called out of darkness into His marvelous light', proofText: '1 Peter 2:9', ptTags: ['CR'] },
      { book: '2 Peter', claim: 'Morning star rises in your hearts', proofText: '2 Peter 1:19', ptTags: ['CR'] },
      { book: '1 John', claim: '"God is light, and in Him is no darkness at all"', proofText: '1 John 1:5', ptTags: ['DR'] },
      { book: '2 John', claim: 'Walking in truth = walking in light', proofText: '2 John 1:4', ptTags: ['DR'] },
      { book: '3 John', claim: 'Imitate good (light), not evil (darkness)', proofText: '3 John 1:11', ptTags: ['DR'] },
      { book: 'Jude', claim: 'Wandering stars for whom blackness of darkness reserved', proofText: 'Jude 1:13', ptTags: ['PR'] },
      { book: 'Revelation', claim: '"The city has no need of sun; the Lord God is its light"', proofText: 'Revelation 21:23; 22:5', ptTags: ['TZ', 'PR'] }
    ]
  },
  {
    id: 'shepherd',
    theme: 'The Shepherd',
    description: 'Tracing the divine Shepherd from patriarchs to the Good Shepherd',
    difficulty: 'beginner',
    constellation: 'Shepherding begins with Abel and becomes the occupation of patriarchs. Jacob calls God "the Shepherd, the Stone of Israel." Moses tends flocks before tending Israel. David, the shepherd-king, pens "The LORD is my shepherd." Prophets condemn false shepherds and promise God Himself will shepherd Israel. Ezekiel 34 announces a coming David who will feed the flock. Jesus declares "I am the good shepherd" who lays down His life for the sheep. Church leaders are called under-shepherds. Revelation shows the Lamb as Shepherd leading to living waters—the eternal Shepherd guiding His flock forever.',
    books: [
      { book: 'Genesis', claim: 'Abel keeps sheep; Jacob calls God "Shepherd, Stone of Israel"', proofText: 'Genesis 4:2; 49:24', ptTags: ['CR', 'ST'] },
      { book: 'Exodus', claim: 'Moses tends flock; called to shepherd Israel', proofText: 'Exodus 3:1', ptTags: ['ST', 'CR'] },
      { book: 'Leviticus', claim: 'Lambs from the flock for sacrifice', proofText: 'Leviticus 1:10', ptTags: ['BL', 'ST'] },
      { book: 'Numbers', claim: 'Israel like sheep without a shepherd needs leader', proofText: 'Numbers 27:17', ptTags: ['CR'] },
      { book: 'Deuteronomy', claim: 'Leaders appointed to shepherd the people', proofText: 'Deuteronomy 1:13', ptTags: ['DR'] },
      { book: 'Joshua', claim: 'Joshua leads like shepherd into promised land', proofText: 'Joshua 1:2', ptTags: ['ST'] },
      { book: 'Judges', claim: 'Gideon threshes wheat (shepherd imagery); delivers Israel', proofText: 'Judges 6:11', ptTags: ['ST'] },
      { book: 'Ruth', claim: 'Boaz watches over Ruth like shepherd over sheep', proofText: 'Ruth 2:8-9', ptTags: ['CR', 'ST'] },
      { book: '1 Samuel', claim: 'David taken from following sheep to shepherd Israel', proofText: '1 Samuel 16:11; 2 Sam 5:2', ptTags: ['CR', 'ST'] },
      { book: '2 Samuel', claim: '"You shall shepherd My people Israel"', proofText: '2 Samuel 5:2', ptTags: ['CR'] },
      { book: '1 Kings', claim: 'Israel scattered like sheep without a shepherd', proofText: '1 Kings 22:17', ptTags: ['ST'] },
      { book: '2 Kings', claim: 'False shepherds lead Israel astray to exile', proofText: '2 Kings 17:7-18', ptTags: ['DR'] },
      { book: '1 Chronicles', claim: 'David: "The LORD is my shepherd"', proofText: 'Psalm 23:1 (cf. 1 Chronicles)', ptTags: ['CR'] },
      { book: '2 Chronicles', claim: 'Kings judged as shepherds of God\'s people', proofText: '2 Chronicles 18:16', ptTags: ['DR'] },
      { book: 'Ezra', claim: 'Remnant gathered like scattered flock returning', proofText: 'Ezra 1:3', ptTags: ['TZ'] },
      { book: 'Nehemiah', claim: 'Levites gather people for instruction (shepherd care)', proofText: 'Nehemiah 8:7', ptTags: ['DR'] },
      { book: 'Esther', claim: 'Mordecai watches over Esther like shepherd', proofText: 'Esther 2:11', ptTags: ['ST'] },
      { book: 'Job', claim: '"He moves mountains... touches the hills"—sovereign Shepherd', proofText: 'Job 9:5', ptTags: ['DR'] },
      { book: 'Psalms', claim: '"The LORD is my shepherd; I shall not want"', proofText: 'Psalm 23:1', ptTags: ['CR'] },
      { book: 'Proverbs', claim: '"Know well the condition of your flocks"', proofText: 'Proverbs 27:23', ptTags: ['DR'] },
      { book: 'Ecclesiastes', claim: '"The words of the wise are like goads... given by one Shepherd"', proofText: 'Ecclesiastes 12:11', ptTags: ['CR'] },
      { book: 'Song of Solomon', claim: 'Beloved is a shepherd feeding among the lilies', proofText: 'Song of Solomon 2:16', ptTags: ['CR'] },
      { book: 'Isaiah', claim: '"He will tend His flock like a shepherd"', proofText: 'Isaiah 40:11', ptTags: ['CR', 'PR'] },
      { book: 'Jeremiah', claim: 'God will gather remnant and set shepherds over them', proofText: 'Jeremiah 23:3-4', ptTags: ['CR', 'PR'] },
      { book: 'Lamentations', claim: 'Shepherds failed; people scattered', proofText: 'Lamentations 1:6', ptTags: ['DR'] },
      { book: 'Ezekiel', claim: 'God Himself will be their Shepherd; David as prince', proofText: 'Ezekiel 34:11-12, 23', ptTags: ['CR', 'PR'] },
      { book: 'Daniel', claim: 'Prince of princes (Shepherd of shepherds) stands', proofText: 'Daniel 8:25', ptTags: ['CR', 'PR'] },
      { book: 'Hosea', claim: 'Israel like a stubborn heifer; God still pursues', proofText: 'Hosea 4:16', ptTags: ['DR'] },
      { book: 'Joel', claim: 'Flocks of sheep cut off; call for restoration', proofText: 'Joel 1:18', ptTags: ['TZ'] },
      { book: 'Amos', claim: 'Shepherd rescues two legs or piece of ear from lion', proofText: 'Amos 3:12', ptTags: ['ST'] },
      { book: 'Obadiah', claim: 'Deliverers shall go up... the kingdom shall be the LORD\'s', proofText: 'Obadiah 1:21', ptTags: ['PR'] },
      { book: 'Jonah', claim: 'God has compassion on sheep who don\'t know right from left', proofText: 'Jonah 4:11', ptTags: ['DR'] },
      { book: 'Micah', claim: '"Shepherd Your people with Your staff"', proofText: 'Micah 7:14', ptTags: ['CR', 'PR'] },
      { book: 'Nahum', claim: 'Shepherds slumber; people scattered', proofText: 'Nahum 3:18', ptTags: ['DR'] },
      { book: 'Habakkuk', claim: 'Though flock cut off from pen, yet I will rejoice', proofText: 'Habakkuk 3:17', ptTags: ['DR'] },
      { book: 'Zephaniah', claim: 'Remnant of Israel will graze and lie down', proofText: 'Zephaniah 3:13', ptTags: ['TZ'] },
      { book: 'Haggai', claim: 'Zerubbabel chosen like signet ring (shepherd-leader)', proofText: 'Haggai 2:23', ptTags: ['CR'] },
      { book: 'Zechariah', claim: '"Strike the shepherd, and the sheep will be scattered"', proofText: 'Zechariah 13:7', ptTags: ['CR', 'PR'] },
      { book: 'Malachi', claim: 'Messenger prepares way; shepherd-like forerunner', proofText: 'Malachi 3:1', ptTags: ['CR'] },
      { book: 'Matthew', claim: 'Jesus has compassion; they were like sheep without shepherd', proofText: 'Matthew 9:36', ptTags: ['CR'] },
      { book: 'Mark', claim: 'Shepherd smitten; sheep scattered, but gathered again', proofText: 'Mark 14:27', ptTags: ['CR'] },
      { book: 'Luke', claim: 'Good shepherd leaves 99 to find one lost', proofText: 'Luke 15:4-7', ptTags: ['CR'] },
      { book: 'John', claim: '"I am the good shepherd... I lay down My life for the sheep"', proofText: 'John 10:11, 14', ptTags: ['CR'] },
      { book: 'Acts', claim: 'Elders to shepherd the church of God', proofText: 'Acts 20:28', ptTags: ['DR'] },
      { book: 'Romans', claim: '"We are accounted as sheep for the slaughter"', proofText: 'Romans 8:36', ptTags: ['CR'] },
      { book: '1 Corinthians', claim: 'Paul plants, Apollos waters, God gives growth', proofText: '1 Corinthians 3:6', ptTags: ['DR'] },
      { book: '2 Corinthians', claim: 'Paul\'s anxious care for all the churches', proofText: '2 Corinthians 11:28', ptTags: ['DR'] },
      { book: 'Galatians', claim: 'Bear one another\'s burdens (shepherd care)', proofText: 'Galatians 6:2', ptTags: ['DR'] },
      { book: 'Ephesians', claim: 'Christ gave pastors (shepherds) to equip the saints', proofText: 'Ephesians 4:11', ptTags: ['DR'] },
      { book: 'Philippians', claim: 'Timothy genuinely cares for their welfare', proofText: 'Philippians 2:20', ptTags: ['DR'] },
      { book: 'Colossians', claim: 'Epaphras laboring in prayer for them', proofText: 'Colossians 4:12', ptTags: ['DR'] },
      { book: '1 Thessalonians', claim: 'Paul gentle among them like nursing mother', proofText: '1 Thessalonians 2:7', ptTags: ['DR'] },
      { book: '2 Thessalonians', claim: 'Paul prays for their hearts to be directed to God\'s love', proofText: '2 Thessalonians 3:5', ptTags: ['DR'] },
      { book: '1 Timothy', claim: 'Overseers must be able to teach (shepherd function)', proofText: '1 Timothy 3:2', ptTags: ['DR'] },
      { book: '2 Timothy', claim: 'Preach the word; be ready in season and out', proofText: '2 Timothy 4:2', ptTags: ['DR'] },
      { book: 'Titus', claim: 'Appoint elders who hold firm to trustworthy word', proofText: 'Titus 1:9', ptTags: ['DR'] },
      { book: 'Philemon', claim: 'Paul appeals for Onesimus like shepherd for lost sheep', proofText: 'Philemon 1:10', ptTags: ['ST'] },
      { book: 'Hebrews', claim: '"That great shepherd of the sheep" brought back from dead', proofText: 'Hebrews 13:20', ptTags: ['CR'] },
      { book: 'James', claim: 'Bring back wandering brother; save soul from death', proofText: 'James 5:19-20', ptTags: ['DR'] },
      { book: '1 Peter', claim: '"When Chief Shepherd appears, you will receive crown"', proofText: '1 Peter 5:4', ptTags: ['CR'] },
      { book: '2 Peter', claim: 'False teachers as wolves among sheep', proofText: '2 Peter 2:1', ptTags: ['DR'] },
      { book: '1 John', claim: 'Love one another (shepherd community)', proofText: '1 John 3:11', ptTags: ['DR'] },
      { book: '2 John', claim: 'Watch yourselves; protect the flock', proofText: '2 John 1:8', ptTags: ['DR'] },
      { book: '3 John', claim: 'Diotrephes harms the flock; bad shepherd example', proofText: '3 John 1:9-10', ptTags: ['DR'] },
      { book: 'Jude', claim: 'Shepherds feeding themselves; waterless clouds', proofText: 'Jude 1:12', ptTags: ['DR'] },
      { book: 'Revelation', claim: '"The Lamb... will be their shepherd... guide them to springs of living water"', proofText: 'Revelation 7:17', ptTags: ['CR', 'TZ'] }
    ]
  },
  {
    id: 'temple-dwelling',
    theme: 'The Temple / God\'s Dwelling',
    description: 'Tracing where God dwells from Eden to the New Jerusalem',
    difficulty: 'intermediate',
    constellation: 'Eden was God\'s first dwelling with humanity. After sin, He meets man at altars, then tabernacles. Moses sees the pattern; Solomon builds the temple. God\'s glory fills and later departs. Prophets promise future glory surpassing the former. Jesus becomes the temple: "Destroy this temple, and in three days I will raise it up." The church becomes God\'s temple through the Spirit. Each believer\'s body is a temple. Revelation climaxes: "The dwelling place of God is with man"—the entire New Jerusalem as holy of holies, no temple needed, for the Lord God Almighty and the Lamb are its temple.',
    books: [
      { book: 'Genesis', claim: 'Eden as God\'s original dwelling with man', proofText: 'Genesis 3:8', ptTags: ['TZ', 'BL'] },
      { book: 'Exodus', claim: '"Let them make Me a sanctuary, that I may dwell among them"', proofText: 'Exodus 25:8', ptTags: ['BL', 'CR'] },
      { book: 'Leviticus', claim: 'God dwells among them; they must be holy', proofText: 'Leviticus 26:11-12', ptTags: ['BL', 'DR'] },
      { book: 'Numbers', claim: 'Tabernacle at center of camp; God\'s presence', proofText: 'Numbers 2:2', ptTags: ['BL'] },
      { book: 'Deuteronomy', claim: '"The place where the LORD your God chooses to put His name"', proofText: 'Deuteronomy 12:5', ptTags: ['BL'] },
      { book: 'Joshua', claim: 'Tabernacle set up at Shiloh — dwelling established', proofText: 'Joshua 18:1', ptTags: ['BL', 'TZ'] },
      { book: 'Judges', claim: 'Tabernacle at Shiloh; ark present for inquiring of God', proofText: 'Judges 20:27', ptTags: ['BL'] },
      { book: 'Ruth', claim: 'Ruth comes under God\'s wings (dwelling/shelter)', proofText: 'Ruth 2:12', ptTags: ['ST'] },
      { book: '1 Samuel', claim: 'Ark captured; Ichabod — "glory has departed"', proofText: '1 Samuel 4:21-22', ptTags: ['BL'] },
      { book: '2 Samuel', claim: 'David desires to build house for God', proofText: '2 Samuel 7:2', ptTags: ['BL'] },
      { book: '1 Kings', claim: 'Solomon builds temple; glory fills it', proofText: '1 Kings 8:10-11', ptTags: ['BL'] },
      { book: '2 Kings', claim: 'Temple desecrated; then destroyed — dwelling removed', proofText: '2 Kings 25:9', ptTags: ['BL', 'TZ'] },
      { book: '1 Chronicles', claim: 'David prepares materials for temple', proofText: '1 Chronicles 22:5', ptTags: ['BL'] },
      { book: '2 Chronicles', claim: '"My eyes and heart will be there perpetually"', proofText: '2 Chronicles 7:16', ptTags: ['BL'] },
      { book: 'Ezra', claim: 'Second temple built; foundation laid', proofText: 'Ezra 3:10-11', ptTags: ['BL', 'TZ'] },
      { book: 'Nehemiah', claim: 'Temple worship restored after exile', proofText: 'Nehemiah 10:39', ptTags: ['BL'] },
      { book: 'Esther', claim: 'God\'s hidden presence protects His people', proofText: 'Esther 4:14', ptTags: ['DR'] },
      { book: 'Job', claim: '"Though He slay me, I will hope in Him" — presence in suffering', proofText: 'Job 13:15', ptTags: ['DR'] },
      { book: 'Psalms', claim: '"One thing I ask: to dwell in the house of the LORD"', proofText: 'Psalm 27:4', ptTags: ['BL', 'DR'] },
      { book: 'Proverbs', claim: 'Wisdom builds her house, seven pillars', proofText: 'Proverbs 9:1', ptTags: ['ST', 'BL'] },
      { book: 'Ecclesiastes', claim: '"Guard your steps when you go to the house of God"', proofText: 'Ecclesiastes 5:1', ptTags: ['BL', 'DR'] },
      { book: 'Song of Solomon', claim: '"Bring me into His chambers" — intimate dwelling', proofText: 'Song of Solomon 1:4', ptTags: ['CR'] },
      { book: 'Isaiah', claim: '"I saw the Lord sitting upon a throne, high and lifted up"', proofText: 'Isaiah 6:1', ptTags: ['BL', 'PR'] },
      { book: 'Jeremiah', claim: 'Temple has become a den of robbers; judgment coming', proofText: 'Jeremiah 7:11', ptTags: ['BL'] },
      { book: 'Lamentations', claim: 'The LORD has scorned His altar, disowned His sanctuary', proofText: 'Lamentations 2:7', ptTags: ['BL'] },
      { book: 'Ezekiel', claim: 'Glory departs temple; future temple vision', proofText: 'Ezekiel 10:18; 40-48', ptTags: ['BL', 'PR'] },
      { book: 'Daniel', claim: 'Little horn casts down sanctuary; sanctuary to be cleansed', proofText: 'Daniel 8:11-14', ptTags: ['BL', 'PR', 'TZ'] },
      { book: 'Hosea', claim: '"I will be like dew to Israel; he shall blossom like the lily"', proofText: 'Hosea 14:5', ptTags: ['DR'] },
      { book: 'Joel', claim: '"The LORD dwells in Zion, my holy mountain"', proofText: 'Joel 3:17', ptTags: ['TZ'] },
      { book: 'Amos', claim: 'Booth of David to be raised up', proofText: 'Amos 9:11', ptTags: ['BL', 'PR'] },
      { book: 'Obadiah', claim: 'Mount Zion will be holy — God\'s dwelling purified', proofText: 'Obadiah 1:17', ptTags: ['TZ'] },
      { book: 'Jonah', claim: 'Jonah prays toward the holy temple', proofText: 'Jonah 2:4', ptTags: ['BL'] },
      { book: 'Micah', claim: 'Mountain of the LORD\'s house established', proofText: 'Micah 4:1', ptTags: ['BL', 'PR'] },
      { book: 'Nahum', claim: '"The LORD is in His holy temple; let all the earth be silent"', proofText: 'Nahum 1:7 (cf. Hab 2:20)', ptTags: ['BL'] },
      { book: 'Habakkuk', claim: '"The LORD is in His holy temple; let all the earth keep silence"', proofText: 'Habakkuk 2:20', ptTags: ['BL'] },
      { book: 'Zephaniah', claim: '"I will leave in your midst a humble and lowly people"', proofText: 'Zephaniah 3:12', ptTags: ['DR'] },
      { book: 'Haggai', claim: '"The latter glory of this house shall be greater"', proofText: 'Haggai 2:9', ptTags: ['BL', 'PR'] },
      { book: 'Zechariah', claim: 'Many nations will join the LORD and dwell in your midst', proofText: 'Zechariah 2:11', ptTags: ['PR'] },
      { book: 'Malachi', claim: '"The Lord whom you seek will suddenly come to His temple"', proofText: 'Malachi 3:1', ptTags: ['BL', 'CR'] },
      { book: 'Matthew', claim: 'Jesus cleanses temple: "My house shall be called a house of prayer"', proofText: 'Matthew 21:13', ptTags: ['BL', 'CR'] },
      { book: 'Mark', claim: 'Temple veil torn in two at Jesus\' death', proofText: 'Mark 15:38', ptTags: ['BL', 'CR'] },
      { book: 'Luke', claim: 'Young Jesus in temple: "I must be in My Father\'s house"', proofText: 'Luke 2:49', ptTags: ['BL', 'CR'] },
      { book: 'John', claim: '"Destroy this temple, and in three days I will raise it up"', proofText: 'John 2:19', ptTags: ['CR', 'BL'] },
      { book: 'Acts', claim: 'God does not dwell in temples made with hands', proofText: 'Acts 7:48', ptTags: ['BL'] },
      { book: 'Romans', claim: '"The Spirit of God dwells in you"', proofText: 'Romans 8:9', ptTags: ['BL', 'DR'] },
      { book: '1 Corinthians', claim: '"You are God\'s temple and God\'s Spirit dwells in you"', proofText: '1 Corinthians 3:16', ptTags: ['BL'] },
      { book: '2 Corinthians', claim: '"We are the temple of the living God"', proofText: '2 Corinthians 6:16', ptTags: ['BL'] },
      { book: 'Galatians', claim: 'Christ lives in me — indwelling presence', proofText: 'Galatians 2:20', ptTags: ['CR'] },
      { book: 'Ephesians', claim: 'Household of God, built on apostles and prophets, Christ cornerstone', proofText: 'Ephesians 2:19-22', ptTags: ['BL'] },
      { book: 'Philippians', claim: 'Glory be to our God and Father forever', proofText: 'Philippians 4:20', ptTags: ['DR'] },
      { book: 'Colossians', claim: '"Christ in you, the hope of glory"', proofText: 'Colossians 1:27', ptTags: ['CR'] },
      { book: '1 Thessalonians', claim: 'God gives His Holy Spirit to you', proofText: '1 Thessalonians 4:8', ptTags: ['DR'] },
      { book: '2 Thessalonians', claim: 'Man of lawlessness sits in temple of God', proofText: '2 Thessalonians 2:4', ptTags: ['PR', 'BL'] },
      { book: '1 Timothy', claim: '"Pillar and buttress of the truth" — church as temple', proofText: '1 Timothy 3:15', ptTags: ['BL'] },
      { book: '2 Timothy', claim: 'God\'s firm foundation stands', proofText: '2 Timothy 2:19', ptTags: ['BL'] },
      { book: 'Titus', claim: 'Heirs of eternal life — dwelling with God forever', proofText: 'Titus 3:7', ptTags: ['TZ'] },
      { book: 'Philemon', claim: 'Refresh my heart in Christ — spiritual dwelling', proofText: 'Philemon 1:20', ptTags: ['DR'] },
      { book: 'Hebrews', claim: 'Christ entered true tabernacle not made with hands', proofText: 'Hebrews 9:11, 24', ptTags: ['BL', 'CR'] },
      { book: 'James', claim: 'Draw near to God, and He will draw near to you', proofText: 'James 4:8', ptTags: ['DR'] },
      { book: '1 Peter', claim: 'Living stones built into spiritual house', proofText: '1 Peter 2:5', ptTags: ['BL'] },
      { book: '2 Peter', claim: 'Entry into eternal kingdom richly provided', proofText: '2 Peter 1:11', ptTags: ['TZ'] },
      { book: '1 John', claim: '"If we love one another, God abides in us"', proofText: '1 John 4:12', ptTags: ['DR'] },
      { book: '2 John', claim: 'Anyone who abides has both Father and Son', proofText: '2 John 1:9', ptTags: ['DR'] },
      { book: '3 John', claim: 'Walking in truth as God\'s dwelling community', proofText: '3 John 1:4', ptTags: ['DR'] },
      { book: 'Jude', claim: 'Keep yourselves in the love of God', proofText: 'Jude 1:21', ptTags: ['DR'] },
      { book: 'Revelation', claim: '"The dwelling place of God is with man"; no temple, for Lord is temple', proofText: 'Revelation 21:3, 22', ptTags: ['BL', 'TZ', 'PR'] }
    ]
  },
  {
    id: 'promise-seed',
    theme: 'The Promised Seed',
    description: 'Tracing the seed promise from Genesis 3:15 to Christ',
    difficulty: 'advanced',
    constellation: 'God promises a "seed of the woman" who will crush the serpent\'s head (Genesis 3:15)—the proto-evangelium. This seed narrows through Seth\'s line, then to Abraham ("in your seed all nations blessed"), then to Judah (the scepter), then to David (eternal throne). Each narrowing preserves and clarifies the promise. Prophets add details: born of a virgin, in Bethlehem, yet from eternity. Jesus fulfills it all: "born of a woman, born under the law." Paul declares believers are "Abraham\'s seed, heirs according to promise." Revelation shows the dragon warring against the woman\'s seed who keep God\'s commandments.',
    books: [
      { book: 'Genesis', claim: 'Seed of woman will crush serpent\'s head (3:15); seed to Abraham', proofText: 'Genesis 3:15; 22:18', ptTags: ['CR', 'PR'] },
      { book: 'Exodus', claim: 'Israel as seed of Abraham multiplies despite Egypt\'s oppression', proofText: 'Exodus 1:7', ptTags: ['TZ'] },
      { book: 'Leviticus', claim: 'Seed preserved through holiness laws and separateness', proofText: 'Leviticus 20:26', ptTags: ['DR'] },
      { book: 'Numbers', claim: 'A star from Jacob, a scepter from Israel (seed prophecy)', proofText: 'Numbers 24:17', ptTags: ['CR', 'PR'] },
      { book: 'Deuteronomy', claim: 'Prophet like Moses to arise from your brothers', proofText: 'Deuteronomy 18:15', ptTags: ['CR', 'PR'] },
      { book: 'Joshua', claim: 'Seed enters promised land through Joshua (Yeshua)', proofText: 'Joshua 11:23', ptTags: ['ST', 'TZ'] },
      { book: 'Judges', claim: 'Judges preserve the seed line in dark times', proofText: 'Judges 2:16', ptTags: ['TZ'] },
      { book: 'Ruth', claim: 'Ruth enters seed line; Obed grandfather of David', proofText: 'Ruth 4:17', ptTags: ['CR'] },
      { book: '1 Samuel', claim: 'David anointed; seed line passes to him', proofText: '1 Samuel 16:13', ptTags: ['CR'] },
      { book: '2 Samuel', claim: '"I will raise up your offspring... establish his kingdom forever"', proofText: '2 Samuel 7:12-13', ptTags: ['CR', 'PR'] },
      { book: '1 Kings', claim: 'Solomon: "if your sons keep My way, throne forever"', proofText: '1 Kings 2:4', ptTags: ['PR'] },
      { book: '2 Kings', claim: 'Seed line nearly extinguished; Joash preserved', proofText: '2 Kings 11:2-3', ptTags: ['TZ'] },
      { book: '1 Chronicles', claim: 'Genealogies trace the seed from Adam through David', proofText: '1 Chronicles 1-3', ptTags: ['CR'] },
      { book: '2 Chronicles', claim: 'Davidic seed preserved despite exile', proofText: '2 Chronicles 36:23', ptTags: ['TZ'] },
      { book: 'Ezra', claim: 'Seed remnant returns to Jerusalem', proofText: 'Ezra 2:1', ptTags: ['TZ'] },
      { book: 'Nehemiah', claim: 'Seed community rebuilds and renews covenant', proofText: 'Nehemiah 9:8', ptTags: ['TZ'] },
      { book: 'Esther', claim: 'Seed of Abraham nearly destroyed; Haman\'s plot fails', proofText: 'Esther 3:6', ptTags: ['TZ'] },
      { book: 'Job', claim: '"I know my Redeemer lives" — the living seed', proofText: 'Job 19:25', ptTags: ['CR'] },
      { book: 'Psalms', claim: '"His seed shall endure forever, and his throne as the sun"', proofText: 'Psalm 89:36', ptTags: ['CR', 'PR'] },
      { book: 'Proverbs', claim: 'Wisdom personified — the eternal Word (John 1)', proofText: 'Proverbs 8:22-31', ptTags: ['CR'] },
      { book: 'Ecclesiastes', claim: '"God has put eternity in man\'s heart" — longing for the Seed', proofText: 'Ecclesiastes 3:11', ptTags: ['DR'] },
      { book: 'Song of Solomon', claim: 'Beloved as the seed/bridegroom coming', proofText: 'Song of Solomon 5:10-16', ptTags: ['CR'] },
      { book: 'Isaiah', claim: '"A virgin shall conceive and bear a son"', proofText: 'Isaiah 7:14; 9:6', ptTags: ['CR', 'PR'] },
      { book: 'Jeremiah', claim: '"Righteous Branch for David" — seed language', proofText: 'Jeremiah 23:5', ptTags: ['CR', 'PR'] },
      { book: 'Lamentations', claim: 'Seed suffers in exile, yet hope remains', proofText: 'Lamentations 3:24', ptTags: ['DR'] },
      { book: 'Ezekiel', claim: '"I will set up one shepherd over them — my servant David"', proofText: 'Ezekiel 34:23', ptTags: ['CR', 'PR'] },
      { book: 'Daniel', claim: 'Messiah cut off; seed promises through suffering', proofText: 'Daniel 9:26', ptTags: ['CR', 'PR'] },
      { book: 'Hosea', claim: '"Out of Egypt I called my son"', proofText: 'Hosea 11:1', ptTags: ['CR'] },
      { book: 'Joel', claim: 'Spirit poured out on seed of Israel', proofText: 'Joel 2:28-29', ptTags: ['PR'] },
      { book: 'Amos', claim: '"I will raise up the booth of David"', proofText: 'Amos 9:11', ptTags: ['CR', 'PR'] },
      { book: 'Obadiah', claim: 'Saviors come to Mount Zion — seed deliverers', proofText: 'Obadiah 1:21', ptTags: ['PR'] },
      { book: 'Jonah', claim: 'Jonah as reluctant seed-bearer to nations', proofText: 'Jonah 1:2', ptTags: ['ST'] },
      { book: 'Micah', claim: '"From you, Bethlehem, shall come forth a ruler... from of old"', proofText: 'Micah 5:2', ptTags: ['CR', 'PR'] },
      { book: 'Nahum', claim: 'Feet of the messenger bringing good news — seed\'s herald', proofText: 'Nahum 1:15', ptTags: ['PR'] },
      { book: 'Habakkuk', claim: 'Vision awaits its time; it will surely come', proofText: 'Habakkuk 2:3', ptTags: ['PR'] },
      { book: 'Zephaniah', claim: 'Remnant of Israel preserved for the seed\'s coming', proofText: 'Zephaniah 3:13', ptTags: ['TZ'] },
      { book: 'Haggai', claim: 'Zerubbabel as signet — seed line continuing', proofText: 'Haggai 2:23', ptTags: ['CR'] },
      { book: 'Zechariah', claim: 'Branch will build the temple — the seed', proofText: 'Zechariah 6:12', ptTags: ['CR', 'PR'] },
      { book: 'Malachi', claim: '"Sun of righteousness shall rise" — the promised seed', proofText: 'Malachi 4:2', ptTags: ['CR', 'PR'] },
      { book: 'Matthew', claim: 'Genealogy: "Jesus Christ, son of David, son of Abraham"', proofText: 'Matthew 1:1', ptTags: ['CR'] },
      { book: 'Mark', claim: '"The beginning of the gospel of Jesus Christ, the Son of God"', proofText: 'Mark 1:1', ptTags: ['CR'] },
      { book: 'Luke', claim: 'Genealogy traces Jesus to "Adam, son of God"', proofText: 'Luke 3:38', ptTags: ['CR'] },
      { book: 'John', claim: '"In the beginning was the Word"—eternal Seed', proofText: 'John 1:1, 14', ptTags: ['CR'] },
      { book: 'Acts', claim: '"God raised up Jesus... from the fruit of David\'s loins"', proofText: 'Acts 2:30; 13:23', ptTags: ['CR'] },
      { book: 'Romans', claim: 'Jesus "descended from David according to the flesh"', proofText: 'Romans 1:3', ptTags: ['CR'] },
      { book: '1 Corinthians', claim: 'Christ the last Adam, life-giving spirit', proofText: '1 Corinthians 15:45', ptTags: ['CR'] },
      { book: '2 Corinthians', claim: 'All promises find their Yes in Christ', proofText: '2 Corinthians 1:20', ptTags: ['CR'] },
      { book: 'Galatians', claim: '"If you are Christ\'s, you are Abraham\'s seed, heirs"', proofText: 'Galatians 3:16, 29', ptTags: ['CR'] },
      { book: 'Ephesians', claim: 'Gentiles now fellow heirs with the seed', proofText: 'Ephesians 3:6', ptTags: ['DR'] },
      { book: 'Philippians', claim: 'Christ in form of God took form of servant (seed incarnate)', proofText: 'Philippians 2:6-7', ptTags: ['CR'] },
      { book: 'Colossians', claim: 'In Him all fullness of deity dwells bodily', proofText: 'Colossians 2:9', ptTags: ['CR'] },
      { book: '1 Thessalonians', claim: 'Wait for His Son from heaven — the seed', proofText: '1 Thessalonians 1:10', ptTags: ['TZ'] },
      { book: '2 Thessalonians', claim: 'Lord Jesus will be glorified in His saints', proofText: '2 Thessalonians 1:10', ptTags: ['TZ'] },
      { book: '1 Timothy', claim: '"One mediator between God and men, the man Christ Jesus"', proofText: '1 Timothy 2:5', ptTags: ['CR'] },
      { book: '2 Timothy', claim: '"Remember Jesus Christ, risen from the dead, offspring of David"', proofText: '2 Timothy 2:8', ptTags: ['CR'] },
      { book: 'Titus', claim: 'Our Savior Jesus Christ — the promised seed', proofText: 'Titus 2:13', ptTags: ['CR'] },
      { book: 'Philemon', claim: 'All things through Christ who transforms — seed\'s power', proofText: 'Philemon 1:6', ptTags: ['CR'] },
      { book: 'Hebrews', claim: '"He who sanctifies and those sanctified are all of one"—shared seed', proofText: 'Hebrews 2:11', ptTags: ['CR'] },
      { book: 'James', claim: 'Brought forth by word of truth — seed language', proofText: 'James 1:18', ptTags: ['DR'] },
      { book: '1 Peter', claim: 'Born again through imperishable seed, living word', proofText: '1 Peter 1:23', ptTags: ['DR'] },
      { book: '2 Peter', claim: 'Promises given through which we partake of divine nature', proofText: '2 Peter 1:4', ptTags: ['DR'] },
      { book: '1 John', claim: '"God\'s seed abides in him"—born of God', proofText: '1 John 3:9', ptTags: ['DR'] },
      { book: '2 John', claim: 'Truth abides in us and will be with us forever', proofText: '2 John 1:2', ptTags: ['DR'] },
      { book: '3 John', claim: 'Children walking in truth — seed community', proofText: '3 John 1:4', ptTags: ['DR'] },
      { book: 'Jude', claim: 'Kept for Jesus Christ — seed preserved', proofText: 'Jude 1:1', ptTags: ['DR'] },
      { book: 'Revelation', claim: 'Dragon wars against "rest of her offspring who keep commandments"', proofText: 'Revelation 12:17', ptTags: ['PR', 'CR'] }
    ]
  },
  {
    id: 'water-living',
    theme: 'Water and Living Water',
    description: 'Tracing water imagery from creation to rivers of life',
    difficulty: 'beginner',
    constellation: 'Water divides at creation, parts at the Red Sea, flows from rocks in the wilderness, and cleanses in the laver. Rivers represent life while floods represent judgment. Prophets promise living water flowing from Jerusalem. Jesus offers water that becomes a spring of eternal life. He declares rivers of living water will flow from believers. Revelation culminates with the river of the water of life, bright as crystal, flowing from the throne of God and of the Lamb.',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getWaterClaim(i),
      proofText: getWaterProof(i),
      ptTags: ['ST', 'CR']
    }))
  },
  {
    id: 'bride-marriage',
    theme: 'The Bride / Marriage',
    description: 'Tracing God\'s covenant love from Israel to the Lamb\'s bride',
    difficulty: 'intermediate',
    constellation: 'God establishes covenant with Israel as a marriage. Prophets use marital imagery for God\'s relationship with His people—faithful despite unfaithfulness. Song of Solomon celebrates divine love. Hosea marries a harlot picturing God\'s redeeming love. Jesus comes as the Bridegroom. Paul reveals the mystery: Christ and the church as husband and wife. Revelation climaxes with the marriage supper of the Lamb and the New Jerusalem descending as a bride adorned for her husband.',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getBrideClaim(i),
      proofText: getBrideProof(i),
      ptTags: ['CR', 'ST']
    }))
  },
  {
    id: 'mountain',
    theme: 'Mountains and High Places',
    description: 'Tracing mountain encounters from Ararat to the New Jerusalem',
    difficulty: 'intermediate',
    constellation: 'The ark rests on Ararat\'s mountains after judgment. Abraham offers Isaac on Moriah. Moses receives the law on Sinai. Elijah confronts prophets on Carmel. David establishes Jerusalem on Zion. Jesus is transfigured on a mountain, delivers His sermon from a mount, and ascends from Olivet. Revelation shows the Lamb standing on Mount Zion. The mountain of the Lord\'s house will be established as highest of all.',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getMountainClaim(i),
      proofText: getMountainProof(i),
      ptTags: ['TZ', 'BL']
    }))
  },
  {
    id: 'word-law',
    theme: 'The Word / Law of God',
    description: 'Tracing God\'s Word from "Let there be" to the Word made flesh',
    difficulty: 'beginner',
    constellation: 'God speaks creation into existence. His words to patriarchs become promises. The law codifies His words at Sinai. Prophets speak "Thus says the LORD." Psalms celebrate the law as lamp and treasure. The prophetic word comes through dreams and visions. Jesus is the Word made flesh—the fullest revelation. The apostolic word proclaims Christ. Scripture is God-breathed, profitable for all righteousness. Revelation shows the Word of God riding forth victorious.',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getWordClaim(i),
      proofText: getWordProof(i),
      ptTags: ['DR', 'CR']
    }))
  },
  {
    id: 'faith-believing',
    theme: 'Faith and Believing',
    description: 'Tracing faith from Abel to the great cloud of witnesses',
    difficulty: 'beginner',
    constellation: 'Abel\'s faith offers a better sacrifice. Abraham believes God and it is counted as righteousness. Israel\'s unbelief prevents entry into rest. Habakkuk declares "the righteous shall live by faith." Jesus honors great faith and rebukes little faith. Paul expounds justification by faith apart from works. Hebrews 11 catalogs faith\'s heroes. The victory that overcomes the world is our faith. Revelation shows those who keep the faith of Jesus.',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getFaithClaim(i),
      proofText: getFaithProof(i),
      ptTags: ['DR', 'CR']
    }))
  },
  {
    id: 'judgment-justice',
    theme: 'Judgment and Justice',
    description: 'Tracing divine justice from Eden to the Great White Throne',
    difficulty: 'advanced',
    constellation: 'God judges Adam and Eve, brings flood judgment, destroys Sodom. Israel experiences covenant curses for disobedience. Prophets announce judgment on nations. Yet "mercy triumphs over judgment." Christ bears judgment on the cross. The church proclaims coming judgment. Daniel\'s court sits in judgment. Revelation depicts the great white throne where books are opened. "Shall not the Judge of all the earth do right?"',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getJudgmentClaim(i),
      proofText: getJudgmentProof(i),
      ptTags: ['PR', 'TZ', '1H/2H/3H']
    }))
  },
  {
    id: 'redemption-ransom',
    theme: 'Redemption and Ransom',
    description: 'Tracing God\'s redemptive work from Egypt to eternal freedom',
    difficulty: 'intermediate',
    constellation: 'God redeems Israel from Egypt with an outstretched arm. The kinsman-redeemer concept develops through Ruth. Psalms celebrate God as Redeemer. Isaiah announces the Redeemer from Zion. Jesus comes to give His life as a ransom for many. Paul declares redemption through Christ\'s blood. Believers are bought with a price. Revelation shows the redeemed from every nation singing the song of the Lamb.',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getRedemptionClaim(i),
      proofText: getRedemptionProof(i),
      ptTags: ['CR', 'BL']
    }))
  },
  {
    id: 'remnant',
    theme: 'The Remnant',
    description: 'Tracing the faithful few from Noah to the end-time church',
    difficulty: 'advanced',
    constellation: 'Noah\'s family is preserved through the flood. A remnant escapes Sodom. Seven thousand who haven\'t bowed to Baal are preserved. Isaiah names his son "a remnant shall return." After exile, a remnant returns. Jesus gathers a little flock. Paul explains the remnant chosen by grace. The 144,000 are sealed. Revelation shows those who keep the commandments and have the testimony of Jesus—the end-time remnant.',
    books: BIBLE_BOOKS.map((book, i) => ({
      book,
      claim: getRemnantClaim(i),
      proofText: getRemnantProof(i),
      ptTags: ['PR', 'TZ', '3A']
    }))
  }
];

// Helper functions for generating theme book entries
function getWaterClaim(i: number): string {
  const claims = [
    'Waters divided at creation; rivers water Eden', 'Waters part for Israel\'s deliverance', 'Water for cleansing at the laver',
    'Water from the rock in wilderness', 'Blessing like rain on mown grass', 'Israel crosses Jordan on dry ground',
    'Gideon\'s test by water', 'Ruth gleans in fields watered by God', 'Springs of living water promised', 'David thirsts for living waters',
    'Solomon builds near water sources', 'Naaman washes in Jordan for healing', 'Water represents cleansing and life',
    'Temple vision: water flowing eastward', 'Water for the returned exiles', 'Wells of salvation mentioned',
    'Esther\'s banquet with wine/water symbolism', 'Job speaks of water wearing away stone', 'As deer pants for water, soul pants for God',
    'Deep calls to deep at the waterfall', 'Vanity of rivers flowing to the sea', 'Love strong as waters', 'Come to the waters without money',
    'Broken cisterns that hold no water', 'Tears like rivers of water', 'Water of life flows from the temple',
    'Waters reach the ankles, then knees, then loins', 'God draws them with waters of love', 'Rains come bringing restoration',
    'Let justice roll down like waters', 'Destruction like a flood', 'Prophet swallowed, delivered through water',
    'Bethlehem\'s well represents eternal water', 'Floodwaters of judgment', 'Waters of affliction lead to restoration',
    'Waters restored to Jerusalem', 'Latter rain promised', 'Fountains opened for cleansing', 'Refiner comes like purifying water',
    'John baptizes with water; Jesus with Spirit', 'Jesus baptized in Jordan waters', 'Jesus walks on water', 'Living water offered to woman',
    'Baptism in water for new believers', 'Buried with Christ through baptism', 'Washed with pure water', 'Baptism now saves',
    'Water and blood from Christ\'s side', 'Washing of water by the word', 'Pure river of water of life',
    'Springs of living water promised', 'Water flows from the throne', 'Baptized into one Spirit', 'Rivers of living water flow',
    'Water represents the Spirit', 'Washed in the blood', 'Sprinkled clean with water', 'Water and Spirit birth',
    'Troubled waters bring healing', 'Rain on the just and unjust', 'Water turned to wine', 'Well of water springing up',
    'Spiritual drink from the Rock', 'Living water flows forever', 'River of life, bright as crystal'
  ];
  return claims[i] || 'Water imagery present throughout Scripture';
}

function getWaterProof(i: number): string {
  const proofs = [
    'Genesis 1:6-7', 'Exodus 14:21', 'Leviticus 8:6', 'Numbers 20:11', 'Deuteronomy 11:11', 'Joshua 3:17',
    'Judges 7:5', 'Ruth 2:9', '1 Samuel 7:6', '2 Samuel 23:15', '1 Kings 18:33', '2 Kings 5:14',
    '1 Chronicles 11:17', '2 Chronicles 32:30', 'Ezra 10:9', 'Nehemiah 9:15', 'Esther 1:7', 'Job 14:19',
    'Psalm 42:1', 'Psalm 42:7', 'Ecclesiastes 1:7', 'Song of Solomon 8:7', 'Isaiah 55:1', 'Jeremiah 2:13',
    'Lamentations 3:48', 'Ezekiel 47:1', 'Ezekiel 47:4-5', 'Hosea 11:4', 'Joel 2:23', 'Amos 5:24',
    'Obadiah 1:16', 'Jonah 2:3', 'Micah 5:7', 'Nahum 1:8', 'Habakkuk 2:14', 'Zephaniah 3:8',
    'Haggai 2:6', 'Zechariah 13:1', 'Malachi 3:10', 'Matthew 3:11', 'Mark 1:9', 'Luke 8:24',
    'John 4:14', 'Acts 8:36', 'Romans 6:4', 'Ephesians 5:26', '1 Peter 3:21', '1 John 5:6-8',
    'Revelation 22:1', 'John 7:38', 'Revelation 21:6', '1 Corinthians 12:13', 'John 7:39',
    '2 Corinthians 3:6', 'Hebrews 10:22', 'Titus 3:5', 'John 5:4', 'Matthew 5:45', 'John 2:9',
    'John 4:14', '1 Corinthians 10:4', 'Revelation 7:17', 'Revelation 22:1'
  ];
  return proofs[i] || 'See throughout the book';
}

function getBrideClaim(i: number): string {
  const claims = [
    'Eve created as bride for Adam', 'Israel betrothed at Sinai', 'Purity laws protect covenant relationship',
    'Unfaithfulness brings judgment', 'God\'s love despite Israel\'s unfaithfulness', 'Joshua leads bride into inheritance',
    'Cycles of unfaithfulness and restoration', 'Ruth as bride foreshadows the church', 'Saul\'s jealousy of David the bridegroom-type',
    'David\'s many marriages foreshadow Christ and the church', 'Solomon\'s many wives show need for true Bridegroom',
    'Division comes from unfaithfulness', 'Royal marriages picture divine covenant', 'Judah\'s unfaithfulness leads to exile',
    'Remnant returns to renew covenant', 'Walls rebuilt for the bride city', 'Esther chosen as queen bride',
    'Job\'s suffering tested his covenant faithfulness', 'Psalms celebrate the King\'s bride', 'Wisdom as the ideal bride',
    'Vanity of earthly marriages', 'Beloved and lover celebrate divine love', 'Virgin daughter Zion',
    'Faithless wife imagery', 'Weeping for lost covenant', 'Valley of dry bones to be revived as bride',
    'Waiting for the wedding', 'God takes a faithless wife', 'Bride adorned on day of restoration',
    'Israel\'s prostitution imagery', 'Nations become bride', 'Jonah\'s rejection then acceptance',
    'Birth pangs before wedding', 'Wrath on unfaithful', 'Joy over the bride', 'Jerusalem restored as bride',
    'Temple rebuilt for bridal dwelling', 'Rejoice, daughter Zion', 'Messenger prepares for bridegroom',
    'Bridegroom comes; wise virgins ready', 'Jesus as bridegroom', 'Wedding feast parables', 'Marriage of Cana',
    'Bride/church awaits bridegroom', 'Church presented as pure bride', 'Christ-church marriage mystery',
    'Bride price paid', 'Waiting for the wedding', 'Bride made ready', 'Marriage of the Lamb',
    'New Jerusalem descends as bride', 'Joy of bridegroom over bride', 'Faithful bride in end times',
    'Church as spotless bride', 'Bride relationship restored', 'Coming wedding supper', 'Union with Christ',
    'Bride keeps herself pure', 'Marriage supper prepared', 'Glorified bride revealed',
    'Bride adorned for her husband', 'Reigning with the Bridegroom', 'Eternal marriage consummated'
  ];
  return claims[i] || 'Marriage imagery present';
}

function getBrideProof(i: number): string {
  const proofs = [
    'Genesis 2:22-24', 'Exodus 19:5-6', 'Leviticus 20:26', 'Numbers 5:12', 'Deuteronomy 7:6', 'Joshua 24:15',
    'Judges 2:17', 'Ruth 4:13', '1 Samuel 18:27', '2 Samuel 3:2-5', '1 Kings 11:3', '1 Kings 12:16',
    '1 Chronicles 3:1-9', '2 Chronicles 21:11', 'Ezra 9:2', 'Nehemiah 4:14', 'Esther 2:17', 'Job 31:1',
    'Psalm 45:9-14', 'Proverbs 31:10', 'Ecclesiastes 9:9', 'Song of Solomon 4:9-12', 'Isaiah 62:5',
    'Jeremiah 3:20', 'Lamentations 1:1', 'Ezekiel 16:8-14', 'Daniel 9:24', 'Hosea 2:19-20', 'Joel 2:16',
    'Amos 5:2', 'Obadiah 1:17', 'Jonah 2:9', 'Micah 4:8', 'Nahum 3:4', 'Zephaniah 3:17', 'Haggai 2:9',
    'Zechariah 9:9', 'Malachi 2:14', 'Matthew 25:1', 'Mark 2:19', 'Luke 14:16', 'John 2:1-11',
    'Acts 21:9', '2 Corinthians 11:2', 'Ephesians 5:25-32', 'Philippians 3:20', '1 Thessalonians 4:16',
    '2 Thessalonians 2:1', '1 Timothy 5:14', '2 Timothy 2:19', 'Titus 2:13', 'Philemon 1:2', 'Hebrews 12:22-24',
    'James 4:4', '1 Peter 3:7', '2 Peter 3:14', '1 John 3:2', '2 John 1:1', '3 John 1:4', 'Jude 1:24',
    'Revelation 19:7-9', 'Revelation 21:2', 'Revelation 21:9', 'Revelation 22:17'
  ];
  return proofs[i] || 'See throughout the book';
}

function getMountainClaim(i: number): string {
  const claims = [
    'Ark rests on mountains of Ararat', 'Moses encounters God at Horeb/Sinai', 'Offerings on mountain altars',
    'Balaam prophesies from mountain peaks', 'Moses views promised land from Pisgah', 'Conquest includes hill country',
    'High places used for worship', 'God\'s mountain is His inheritance', 'High places contested', 'David conquers Jerusalem/Zion',
    'Temple built on mountain', 'High places judged', 'Mount Zion as God\'s dwelling', 'Temple on the mount',
    'Mountain of the house returned to', 'Jerusalem\'s walls on mountains', 'Persian mountain decree',
    'Mountains tremble before God', 'Holy mountain of God', 'Mountains exalted or brought low',
    'Vanity under the sun on mountains', 'Mountains as meeting places', 'Mountain of the LORD\'s house exalted',
    'Mountains melt before God', 'Mountains weep', 'Temple mountain vision', 'Mountain kingdoms rise and fall',
    'Mountain imagery for nations', 'Mountains drip sweet wine', 'High places judged', 'Mountain destroyed',
    'Jonah on mountain-like waves', 'Mountain of Samaria', 'Mountain imagery', 'Watch from the tower',
    'Day of the LORD on mountains', 'Latter temple mountain', 'Mount of Olives split', 'Elijah returns to mountains',
    'Sermon on the Mount', 'Mountain of transfiguration', 'Jesus teaches on mountains', 'Mountain moved by faith',
    'Pentecost in upper room (mountain city)', 'Mountain of God\'s righteousness', 'Mount Zion spiritualized',
    'Mountain of faith', 'City on a hill', 'Heavenly mountain', 'Kingdom mountain', 'Spiritual Mount Zion',
    'Unshakable mountain kingdom', 'Faith moves mountains', 'Mountain of holiness', 'Mountain of Megiddo',
    'Mountain represents power', 'Hills flee', 'Mountain imagery', 'Mountain removed', 'Holy mountain of God',
    'Mount Zion with the Lamb', 'Mountains flee from God\'s presence', 'Holy city on a great mountain'
  ];
  return claims[i] || 'Mountain imagery present';
}

function getMountainProof(i: number): string {
  const proofs = [
    'Genesis 8:4', 'Exodus 3:1', 'Leviticus 17:5', 'Numbers 23:14', 'Deuteronomy 34:1', 'Joshua 11:21',
    'Judges 6:26', 'Ruth 1:1', '1 Samuel 9:12', '2 Samuel 5:7', '1 Kings 6:1', '2 Kings 23:8',
    '1 Chronicles 21:18', '2 Chronicles 3:1', 'Ezra 3:1', 'Nehemiah 4:2', 'Esther 1:2', 'Job 9:5',
    'Psalm 48:1-2', 'Proverbs 8:25', 'Ecclesiastes 1:4', 'Song of Solomon 4:8', 'Isaiah 2:2-3',
    'Jeremiah 51:25', 'Lamentations 5:18', 'Ezekiel 40:2', 'Daniel 2:35', 'Hosea 10:8', 'Joel 3:18',
    'Amos 4:1', 'Obadiah 1:17', 'Jonah 2:6', 'Micah 4:1', 'Nahum 1:5', 'Habakkuk 3:10', 'Zephaniah 1:10',
    'Haggai 2:6', 'Zechariah 14:4', 'Malachi 4:1', 'Matthew 5:1', 'Mark 9:2', 'Luke 6:12', 'John 4:20',
    'Acts 2:1', 'Romans 9:33', 'Hebrews 12:22', 'Galatians 4:24-25', 'Philippians 3:14', 'Colossians 1:12',
    '1 Thessalonians 4:17', '2 Thessalonians 2:4', '1 Timothy 3:15', '2 Timothy 2:19', 'Titus 2:13',
    'Philemon 1:2', 'Hebrews 12:22', 'James 4:7', '1 Peter 2:6', '2 Peter 1:18', '1 John 5:4',
    '2 John 1:4', '3 John 1:11', 'Jude 1:14', 'Revelation 14:1', 'Revelation 16:20', 'Revelation 21:10'
  ];
  return proofs[i] || 'See throughout the book';
}

function getWordClaim(i: number): string {
  const claims = [
    'God speaks creation into existence', 'God speaks to Moses; gives the law', 'Detailed law commands given',
    'God speaks guidance through wilderness', 'Moses recounts God\'s words', 'Joshua meditates on the law',
    'Word disobeyed brings cycles', 'Story of faithfulness to God\'s word', 'Samuel hears God\'s voice',
    'David loves God\'s law', 'Solomon receives wisdom through word', 'Word of prophets ignored',
    'Record of God\'s words to Israel', 'Prophetic word fulfillment', 'Reading of the law restores',
    'Law read publicly; people weep', 'Word preserves God\'s people', 'Job defends God\'s word',
    'Word is lamp to feet, light to path', 'Wisdom\'s words bring life', 'Words of the Teacher gathered',
    'Words of the beloved', 'Word of the LORD to Isaiah', 'Word rejected brings judgment',
    'How lonely sits the city', 'Word comes to Ezekiel', 'Word interpreted', 'Word of LORD comes',
    'Word of restoration', 'Word against the nations', 'Word against Edom', 'Word to reluctant prophet',
    'Word of promise', 'Word of judgment', 'Woe oracle words', 'Word against the day', 'Word to rebuild',
    'Word of hope', 'Final prophetic word', 'Word fulfilled in Jesus', 'Word proclaimed urgently',
    'Word of kingdom taught', 'Word became flesh', 'Word preached boldly', 'Word of righteousness',
    'Word of the cross', 'Word of reconciliation', 'Word of truth', 'Word of Christ dwelling richly',
    'Word held forth', 'Word of life', 'Word of hope', 'Word of patience', 'Entrusted with the word',
    'Continue in the word', 'Word not bound', 'Word of grace', 'Receive the word', 'Live by the word',
    'Born through the word', 'Word abides', 'Word from the beginning', 'Word testified', 'Word contended for',
    'Word of God rides forth', 'Word of God judges', 'Word accomplished'
  ];
  return claims[i] || 'Word/Law theme present';
}

function getWordProof(i: number): string {
  const proofs = [
    'Genesis 1:3', 'Exodus 20:1', 'Leviticus 1:1', 'Numbers 3:16', 'Deuteronomy 5:1', 'Joshua 1:8',
    'Judges 2:4', 'Ruth 1:16', '1 Samuel 3:10', '2 Samuel 22:31', '1 Kings 3:12', '2 Kings 17:13',
    '1 Chronicles 16:15', '2 Chronicles 34:21', 'Ezra 7:10', 'Nehemiah 8:8', 'Esther 9:32', 'Job 23:12',
    'Psalm 119:105', 'Proverbs 4:20-22', 'Ecclesiastes 12:10-11', 'Song of Solomon 2:10', 'Isaiah 1:10',
    'Jeremiah 1:4', 'Lamentations 1:1', 'Ezekiel 1:3', 'Daniel 9:2', 'Hosea 1:1', 'Joel 1:1', 'Amos 1:1',
    'Obadiah 1:1', 'Jonah 1:1', 'Micah 1:1', 'Nahum 1:1', 'Habakkuk 2:2', 'Zephaniah 1:1', 'Haggai 1:1',
    'Zechariah 1:1', 'Malachi 1:1', 'Matthew 1:22', 'Mark 1:1', 'Luke 4:32', 'John 1:1, 14', 'Acts 4:31',
    'Romans 10:17', '1 Corinthians 1:18', '2 Corinthians 5:19', 'Galatians 1:11', 'Colossians 3:16',
    'Philippians 2:16', '1 Thessalonians 2:13', '2 Thessalonians 3:1', '1 Timothy 4:5', '2 Timothy 2:15',
    '2 Timothy 2:9', 'Titus 1:3', 'Hebrews 4:12', 'James 1:21', '1 Peter 1:23', '2 Peter 1:19',
    '1 John 2:14', '2 John 1:5', '3 John 1:3', 'Jude 1:3', 'Revelation 19:13'
  ];
  return proofs[i] || 'See throughout the book';
}

function getFaithClaim(i: number): string {
  const claims = [
    'Abel\'s faith offers better sacrifice', 'Israel believes at Red Sea', 'Faith shown through obedience',
    'Unbelief prevents entry to Canaan', 'Believe and obey covenant', 'Faith to conquer', 'Faithless cycles',
    'Ruth\'s faith: "Your God my God"', 'David\'s faith in battle', 'David\'s faith psalms',
    'Solomon asks in faith', 'Elijah\'s faith on Carmel', 'Faith through history',
    'Jehoshaphat\'s faith', 'Faith of returned exiles', 'Nehemiah\'s faith to rebuild', 'Esther\'s courageous faith',
    'Job\'s faith through suffering', 'Faith language throughout', 'Trust in LORD with all heart',
    'Faith in the meaningless', 'Faith in the beloved', 'Believe God\'s word', 'Faith despite judgment',
    'Faithful God in lament', 'Faith to prophesy', 'Faith in visions', 'Faith despite unfaithfulness',
    'Faith for restoration', 'Faith to proclaim', 'Faith against enemies', 'Faith despite the call',
    'Faith for the future', 'Faith under oppression', 'Righteous live by faith', 'Faith amid judgment',
    'Faith in restoration', 'Faith in coming King', 'Faith for forerunner', 'Faith of centurion',
    'Jesus marvels at faith', 'Faith saves the sick', 'Believe and have life', 'Faith of early church',
    'Justification by faith', 'Faith vs works', 'Justified by faith', 'Saved through faith',
    'Righteousness by faith', 'Shield of faith', 'Faith as substance', 'Prayer of faith',
    'Walk by faith', 'Faith tested', 'Faith and works', 'Precious faith', 'Faith in God\'s promises',
    'Faith overcomes world', 'Keep the faith', 'Contend for the faith', 'Faithful unto death'
  ];
  return claims[i] || 'Faith theme present';
}

function getFaithProof(i: number): string {
  const proofs = [
    'Genesis 4:4 (Heb 11:4)', 'Exodus 14:31', 'Leviticus 26:3', 'Numbers 14:11', 'Deuteronomy 9:23',
    'Joshua 2:11', 'Judges 6:36-40', 'Ruth 1:16', '1 Samuel 17:37', '2 Samuel 22:3', '1 Kings 3:9',
    '1 Kings 18:36-37', '1 Chronicles 5:20', '2 Chronicles 20:20', 'Ezra 8:22', 'Nehemiah 2:20',
    'Esther 4:16', 'Job 13:15', 'Psalm 27:13', 'Proverbs 3:5', 'Ecclesiastes 3:14', 'Song of Solomon 8:6',
    'Isaiah 7:9', 'Jeremiah 17:7', 'Lamentations 3:22-23', 'Ezekiel 18:9', 'Daniel 6:23', 'Hosea 2:20',
    'Joel 2:32', 'Amos 5:4', 'Obadiah 1:17', 'Jonah 3:5', 'Micah 7:7', 'Nahum 1:7', 'Habakkuk 2:4',
    'Zephaniah 3:12', 'Haggai 2:5', 'Zechariah 4:6', 'Malachi 3:16', 'Matthew 8:10', 'Mark 5:34',
    'Luke 7:50', 'John 3:16', 'Acts 16:31', 'Romans 5:1', 'Galatians 2:16', 'Galatians 3:11',
    'Ephesians 2:8', 'Philippians 3:9', 'Colossians 1:4', '1 Thessalonians 1:3', '2 Thessalonians 1:4',
    '1 Timothy 1:5', '2 Timothy 1:5', 'Titus 1:1', 'Philemon 1:5', 'Hebrews 11:1', 'James 2:17',
    '1 Peter 1:7', '2 Peter 1:1', '1 John 5:4', '2 John 1:1', '3 John 1:3', 'Jude 1:3', 'Revelation 2:10'
  ];
  return proofs[i] || 'See throughout the book';
}

function getJudgmentClaim(i: number): string {
  const claims = [
    'God judges Adam and Eve', 'Plagues judge Egypt', 'Laws establish just standards', 'Judgment in wilderness',
    'Blessings and curses', 'Judgment on Canaanite nations', 'Cycle of judgment and deliverance', 'Kinsman-judge redeems',
    'Samuel as judge', 'David spared in judgment', 'Solomon\'s wise judgment', 'Judgment on divided kingdom',
    'David establishes justice', 'Temple for judgment', 'Law establishes judgment', 'Judgment begins at house of God',
    'Haman judged', 'Suffering and vindication', 'God judges righteously', 'Judgments of the Lord are true',
    'Day of judgment coming', 'Judgment on all flesh', 'Day of the LORD judgment', 'Judgment on nations',
    'Zion\'s judgment', 'Judgment visions', 'Judgment court sits', 'Judgment on Israel', 'Day of the LORD',
    'Judgment on nations', 'Judgment on Edom', 'Nineveh judged then spared', 'Judgment and hope',
    'Judgment on oppressor', 'Justice vindicated', 'Day of the LORD judgment', 'Judgment and restoration',
    'Sun of righteousness judges', 'Refiner\'s judgment', 'Judgment at Christ\'s coming', 'Coming judgment',
    'Separation judgment', 'Judgment at the cross', 'Judgment begins', 'Justification judgment',
    'Judgment seat of Christ', 'Self-judgment', 'Works judged', 'Judgment of false teachers', 'Future judgment',
    'Kept for judgment', 'Present and future judgment', 'Sound doctrine judged', 'Faithful judge rewards',
    'Future judgment', 'God\'s judgment', 'Faith judged', 'Judgment without mercy', 'Coming judgment',
    'Day of judgment', 'Judgment revealed', 'Judge of all', 'Love in judgment', 'Ungodly judged',
    'Great white throne judgment', 'Final judgment executed'
  ];
  return claims[i] || 'Judgment theme present';
}

function getJudgmentProof(i: number): string {
  const proofs = [
    'Genesis 3:14-19', 'Exodus 7-12', 'Leviticus 26:14-39', 'Numbers 14:29-35', 'Deuteronomy 28',
    'Joshua 7:24-26', 'Judges 2:14-15', 'Ruth 1:1', '1 Samuel 7:15', '2 Samuel 12:13', '1 Kings 3:28',
    '2 Kings 17:7-23', '1 Chronicles 16:33', '2 Chronicles 6:23', 'Ezra 9:13', 'Nehemiah 13:18',
    'Esther 7:10', 'Job 34:12', 'Psalm 7:11', 'Psalm 19:9', 'Ecclesiastes 3:17', 'Ecclesiastes 12:14',
    'Isaiah 2:12', 'Jeremiah 25:31', 'Lamentations 4:11', 'Ezekiel 7:3', 'Daniel 7:10', 'Hosea 5:1',
    'Joel 3:2', 'Amos 4:12', 'Obadiah 1:15', 'Jonah 3:4', 'Micah 3:8', 'Nahum 1:2', 'Habakkuk 1:12',
    'Zephaniah 1:14', 'Haggai 2:17', 'Zechariah 7:12', 'Malachi 3:5', 'Matthew 25:31-46', 'Mark 13:26-27',
    'Luke 21:36', 'John 5:22', 'Acts 17:31', 'Romans 2:16', '2 Corinthians 5:10', '1 Corinthians 11:31-32',
    '1 Corinthians 3:13', '2 Peter 2:9', 'Galatians 5:10', 'Ephesians 6:8', 'Philippians 1:28',
    'Colossians 3:25', '1 Thessalonians 1:10', '2 Thessalonians 1:5', '1 Timothy 5:24', '2 Timothy 4:8',
    'Titus 2:13', 'Philemon 1:18', 'Hebrews 9:27', 'James 2:13', '1 Peter 4:17', '2 Peter 2:9',
    '1 John 4:17', '2 John 1:8', '3 John 1:11', 'Jude 1:15', 'Revelation 20:11-15'
  ];
  return proofs[i] || 'See throughout the book';
}

function getRedemptionClaim(i: number): string {
  const claims = [
    'Sacrifice covers sin', 'God redeems Israel from Egypt', 'Redemption through blood',
    'Firstborn redemption', 'God as Redeemer', 'Kinsman-redeemer concept', 'Judges as deliverers',
    'Boaz as kinsman-redeemer', 'David anointed as deliverer', 'Redemption in psalms', 'Temple for redemption',
    'Prophets call for repentance', 'Redemption through history', 'Temple redemption', 'Returned exiles redeemed',
    'Redemption renewed', 'Esther redeems her people', 'Redeemer lives', 'God redeems from pit',
    'Redemption through wisdom', 'No redemption under sun', 'Beloved redeems', 'Redeemer from Zion',
    'New covenant redemption', 'Lament for lost redemption', 'Future redemption promised', 'Messiah brings redemption',
    'Redemption through love', 'Restoration redemption', 'Redemption remnant', 'Redemption from Edom',
    'Reluctant redeemer', 'Remnant redeemed', 'Day of redemption', 'Redemption through faith',
    'Redemption day', 'Temple redemption', 'Fountain of redemption', 'Messenger of redemption',
    'Ransom for many', 'Jesus redeems', 'Christ our redemption', 'Redemption in Jesus\' name',
    'Redemption proclaimed', 'Redemption in Christ', 'Christ our redemption', 'Ministry of redemption',
    'No redemption by works', 'Redemption through blood', 'Redemption realized', 'Redemption hope',
    'Ransomed church', 'Redemption sealed', 'Redemption prize', 'Wait for redemption', 'Redemption for all',
    'Redeemed from curse', 'Redemption obtained', 'Redemption power', 'Redemption secured',
    'Redemption through suffering', 'Redeemed to God', 'Redemption complete'
  ];
  return claims[i] || 'Redemption theme present';
}

function getRedemptionProof(i: number): string {
  const proofs = [
    'Genesis 3:21', 'Exodus 6:6', 'Leviticus 17:11', 'Numbers 3:46-48', 'Deuteronomy 7:8', 'Joshua 24:17',
    'Judges 2:16', 'Ruth 4:4-6', '1 Samuel 14:45', '2 Samuel 4:9', '1 Kings 1:29', '2 Kings 14:27',
    '1 Chronicles 17:21', '2 Chronicles 6:23', 'Ezra 2:68', 'Nehemiah 1:10', 'Esther 8:6', 'Job 19:25',
    'Psalm 130:7-8', 'Proverbs 23:11', 'Ecclesiastes 7:7', 'Song of Solomon 8:7', 'Isaiah 44:22-23',
    'Jeremiah 31:11', 'Lamentations 3:58', 'Ezekiel 11:17', 'Daniel 9:24', 'Hosea 13:14', 'Joel 3:21',
    'Amos 9:14', 'Obadiah 1:17', 'Jonah 2:6', 'Micah 4:10', 'Nahum 1:15', 'Habakkuk 3:13', 'Zephaniah 3:15',
    'Haggai 2:23', 'Zechariah 10:8', 'Malachi 3:17', 'Matthew 20:28', 'Mark 10:45', 'Luke 1:68',
    'John 10:11', 'Acts 20:28', 'Romans 3:24', '1 Corinthians 1:30', '2 Corinthians 5:21', 'Galatians 3:13',
    'Ephesians 1:7', 'Colossians 1:14', 'Philippians 3:20', '1 Thessalonians 5:9', '2 Thessalonians 2:13',
    '1 Timothy 2:6', '2 Timothy 2:26', 'Titus 2:14', 'Philemon 1:18', 'Hebrews 9:12', 'James 1:27',
    '1 Peter 1:18-19', '2 Peter 2:1', '1 John 2:2', '2 John 1:3', '3 John 1:5', 'Jude 1:3',
    'Revelation 5:9', 'Revelation 14:3-4'
  ];
  return proofs[i] || 'See throughout the book';
}

function getRemnantClaim(i: number): string {
  const claims = [
    'Noah\'s family preserved', 'Israel as chosen remnant', 'Holy nation preserved', 'Faithful spies survive',
    'Covenant community preserved', 'Caleb\'s faithful remnant', 'Faithful amid apostasy', 'Remnant through Ruth',
    '7,000 who haven\'t bowed to Baal', 'David\'s faithful followers', 'Remnant through Elijah', 'Remnant escapes',
    'Genealogies preserve remnant', 'Remnant survives exile', 'Remnant returns from Babylon', 'Remnant rebuilds walls',
    'Jewish remnant preserved', 'Job\'s faithful remnant', 'Faithful remnant sing', 'Remnant walk in wisdom',
    'Remnant endures', 'Beloved remnant', 'Shear-jashub: remnant returns', 'Remnant promise', 'Mourning remnant',
    'Holy remnant vision', 'Remnant delivered', 'Remnant returns', 'Remnant restored', 'Remnant of Israel',
    'Remnant survives', 'Remnant prophet', 'Remnant of Jacob', 'Remnant preserved', 'Remnant waits',
    'Remnant purified', 'Remnant temple builders', 'Remnant hope', 'Messenger to prepare remnant',
    'Little flock remnant', 'Disciples as remnant', 'Few find the way', 'Believing remnant', 'Remnant church formed',
    'Remnant chosen by grace', 'Remnant message', 'Remnant reconciled', 'Remnant justified', 'Remnant kept',
    'Remnant united', 'Remnant sanctified', 'Remnant awaits', 'Remnant sealed', 'Remnant instructed',
    'Remnant faithful', 'Remnant promised', 'Remnant holy', 'Remnant preserved', 'Remnant tested',
    'Remnant endures', 'Remnant overcomes', 'Remnant reigns', 'Remnant judged faithful', 'Remnant contends',
    'Remnant keeps commandments', 'Remnant victorious'
  ];
  return claims[i] || 'Remnant theme present';
}

function getRemnantProof(i: number): string {
  const proofs = [
    'Genesis 7:23', 'Exodus 19:5-6', 'Leviticus 26:44', 'Numbers 14:30', 'Deuteronomy 4:27', 'Joshua 14:10-12',
    'Judges 7:7', 'Ruth 4:17', '1 Kings 19:18', '1 Samuel 22:2', '1 Kings 19:18', '2 Kings 19:30-31',
    '1 Chronicles 9:1', '2 Chronicles 30:6', 'Ezra 9:8', 'Nehemiah 1:2-3', 'Esther 4:14', 'Job 42:16',
    'Psalm 76:10', 'Proverbs 2:21', 'Ecclesiastes 7:28', 'Song of Solomon 8:8', 'Isaiah 10:20-22',
    'Jeremiah 23:3', 'Lamentations 5:22', 'Ezekiel 6:8', 'Daniel 12:1', 'Hosea 1:10', 'Joel 2:32',
    'Amos 5:15', 'Obadiah 1:17', 'Jonah 3:10', 'Micah 2:12', 'Nahum 1:15', 'Habakkuk 2:4',
    'Zephaniah 2:7', 'Haggai 1:14', 'Zechariah 8:12', 'Malachi 3:16-17', 'Matthew 7:14', 'Mark 4:11',
    'Luke 12:32', 'John 6:37', 'Acts 2:47', 'Romans 11:5', '1 Corinthians 1:27-28', '2 Corinthians 4:3',
    'Galatians 3:29', 'Ephesians 1:4', 'Philippians 2:15', 'Colossians 1:12', '1 Thessalonians 1:4',
    '2 Thessalonians 2:13', '1 Timothy 4:10', '2 Timothy 2:19', 'Titus 2:14', 'Philemon 1:6',
    'Hebrews 4:9', 'James 1:18', '1 Peter 2:9', '2 Peter 3:9', '1 John 2:19', '2 John 1:1', '3 John 1:4',
    'Jude 1:3', 'Revelation 12:17', 'Revelation 14:12'
  ];
  return proofs[i] || 'See throughout the book';
}

// Helper functions
export const getRoom66Theme = (id: string): Room66Theme | undefined => {
  return room66Library.find(t => t.id === id);
};

export const getRoom66ThemesByDifficulty = (difficulty: string): Room66Theme[] => {
  return room66Library.filter(t => t.difficulty === difficulty);
};

export const searchRoom66Themes = (query: string): Room66Theme[] => {
  const lower = query.toLowerCase();
  return room66Library.filter(t =>
    t.theme.toLowerCase().includes(lower) ||
    t.description.toLowerCase().includes(lower)
  );
};
