// Sub-principles data for multi-principle rooms
// These are the methodology components that expand when a room is clicked

export interface SubPrinciple {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon?: string;
}

export interface RoomSubPrinciples {
  roomId: string;
  roomName: string;
  subPrinciples: SubPrinciple[];
}

// Define sub-principles for all multi-principle rooms
export const ROOM_SUB_PRINCIPLES: Record<string, RoomSubPrinciples> = {
  // Floor 1 - Imagination Room (5 Senses)
  ir: {
    roomId: 'ir',
    roomName: 'Imagination Room',
    subPrinciples: [
      { id: 'ir-sight', name: 'Sight', shortName: 'Sight', description: 'What do you see?', icon: 'Eye' },
      { id: 'ir-sound', name: 'Sound', shortName: 'Sound', description: 'What do you hear?', icon: 'Ear' },
      { id: 'ir-touch', name: 'Touch', shortName: 'Touch', description: 'What do you feel?', icon: 'Hand' },
      { id: 'ir-smell', name: 'Smell', shortName: 'Smell', description: 'What do you smell?', icon: 'Wind' },
      { id: 'ir-taste', name: 'Taste', shortName: 'Taste', description: 'What do you taste?', icon: 'Utensils' },
    ],
  },

  // Floor 2 - Observation Room (5 W's)
  or: {
    roomId: 'or',
    roomName: 'Observation Room',
    subPrinciples: [
      { id: 'or-who', name: 'Who', shortName: 'Who', description: 'Every person mentioned', icon: 'Users' },
      { id: 'or-what', name: 'What', shortName: 'What', description: 'Every action and event', icon: 'FileText' },
      { id: 'or-when', name: 'When', shortName: 'When', description: 'Time markers and sequence', icon: 'Clock' },
      { id: 'or-where', name: 'Where', shortName: 'Where', description: 'Every location', icon: 'MapPin' },
      { id: 'or-how', name: 'How', shortName: 'How', description: 'Methods and means', icon: 'Wrench' },
    ],
  },

  // Floor 4 - Concentration Room (3 Offices)
  cr: {
    roomId: 'cr',
    roomName: 'Concentration Room',
    subPrinciples: [
      { id: 'cr-prophet', name: 'Prophet', shortName: 'Prophet', description: 'Christ speaking/revealing', icon: 'MessageSquare' },
      { id: 'cr-priest', name: 'Priest', shortName: 'Priest', description: 'Christ interceding/mediating', icon: 'Heart' },
      { id: 'cr-king', name: 'King', shortName: 'King', description: 'Christ ruling/judging', icon: 'Crown' },
    ],
  },

  // Floor 4 - Dimensions Room (5 Dimensions)
  dr: {
    roomId: 'dr',
    roomName: 'Dimensions Room',
    subPrinciples: [
      { id: 'dr-literal', name: 'Literal', shortName: 'Literal', description: 'Plain historical meaning', icon: 'BookOpen' },
      { id: 'dr-christ', name: 'Christological', shortName: 'Christ', description: 'Points to Christ', icon: 'Cross' },
      { id: 'dr-personal', name: 'Personal', shortName: 'Personal', description: 'Individual application', icon: 'User' },
      { id: 'dr-church', name: 'Ecclesiological', shortName: 'Church', description: 'Church body application', icon: 'Church' },
      { id: 'dr-eschaton', name: 'Eschatological', shortName: 'End Times', description: 'Last-day events', icon: 'Hourglass' },
    ],
  },

  // Floor 4 - Connect-6 Room (6 Genres)
  c6: {
    roomId: 'c6',
    roomName: 'Connect-6 Room',
    subPrinciples: [
      { id: 'c6-prophecy', name: 'Prophecy', shortName: 'Prophecy', description: 'Prophetic books connection', icon: 'Scroll' },
      { id: 'c6-parable', name: 'Parable', shortName: 'Parable', description: 'Jesus\' parables', icon: 'Wheat' },
      { id: 'c6-epistle', name: 'Epistle', shortName: 'Epistle', description: 'Letter teachings', icon: 'Mail' },
      { id: 'c6-history', name: 'History', shortName: 'History', description: 'Historical narratives', icon: 'History' },
      { id: 'c6-gospel', name: 'Gospel', shortName: 'Gospel', description: 'Life of Jesus', icon: 'BookHeart' },
      { id: 'c6-poetry', name: 'Poetry', shortName: 'Poetry', description: 'Psalms & wisdom literature', icon: 'PenTool' },
    ],
  },

  // Floor 4 - Theme Room (6 Theological Spans)
  trm: {
    roomId: 'trm',
    roomName: 'Theme Room',
    subPrinciples: [
      { id: 'trm-sanctuary', name: 'Sanctuary', shortName: 'Sanctuary', description: 'Sanctuary themes', icon: 'Church' },
      { id: 'trm-life', name: 'Life of Christ', shortName: 'Life', description: 'Christ\'s earthly ministry', icon: 'Baby' },
      { id: 'trm-controversy', name: 'Great Controversy', shortName: 'Conflict', description: 'Cosmic conflict', icon: 'Swords' },
      { id: 'trm-prophecy', name: 'Time-Prophecy', shortName: 'Prophecy', description: 'Prophetic timelines', icon: 'Clock' },
      { id: 'trm-gospel', name: 'Gospel', shortName: 'Gospel', description: 'Salvation truth', icon: 'Heart' },
      { id: 'trm-heaven', name: 'Heaven', shortName: 'Heaven', description: 'Heavenly realities', icon: 'Cloud' },
    ],
  },

  // Floor 4 - Time Zone Room (6 Coordinates)
  tz: {
    roomId: 'tz',
    roomName: 'Time Zone Room',
    subPrinciples: [
      { id: 'tz-heaven-past', name: 'Heaven Past', shortName: 'H-Past', description: 'Heaven before', icon: 'CloudSun' },
      { id: 'tz-heaven-present', name: 'Heaven Present', shortName: 'H-Now', description: 'Heaven now', icon: 'Cloud' },
      { id: 'tz-heaven-future', name: 'Heaven Future', shortName: 'H-Future', description: 'Heaven will do', icon: 'CloudMoon' },
      { id: 'tz-earth-past', name: 'Earth Past', shortName: 'E-Past', description: 'Earthly events led to', icon: 'Mountain' },
      { id: 'tz-earth-present', name: 'Earth Present', shortName: 'E-Now', description: 'Current earthly situation', icon: 'Globe' },
      { id: 'tz-earth-future', name: 'Earth Future', shortName: 'E-Future', description: 'Future result on earth', icon: 'Sunrise' },
    ],
  },

  // Floor 4 - Fruit Room (4 Types)
  frt: {
    roomId: 'frt',
    roomName: 'Fruit Room',
    subPrinciples: [
      { id: 'frt-spiritual', name: 'Spiritual Fruit', shortName: 'Spirit', description: 'Love, joy, peace...', icon: 'Heart' },
      { id: 'frt-doctrinal', name: 'Doctrinal Fruit', shortName: 'Doctrine', description: 'Sound doctrine', icon: 'Book' },
      { id: 'frt-practical', name: 'Practical Fruit', shortName: 'Actions', description: 'Godly actions', icon: 'Hammer' },
      { id: 'frt-relational', name: 'Relational Fruit', shortName: 'Relations', description: 'Building up the body', icon: 'Users' },
    ],
  },

  // Floor 5 - Blue Room (7 Sanctuary Elements)
  bl: {
    roomId: 'bl',
    roomName: 'Blue Room',
    subPrinciples: [
      { id: 'bl-altar', name: 'Altar of Burnt Offering', shortName: 'Altar', description: 'Sacrifice/surrender', icon: 'Flame' },
      { id: 'bl-laver', name: 'Bronze Laver', shortName: 'Laver', description: 'Cleansing/washing', icon: 'Droplets' },
      { id: 'bl-lampstand', name: 'Golden Lampstand', shortName: 'Light', description: 'Light/illumination', icon: 'Lightbulb' },
      { id: 'bl-showbread', name: 'Table of Showbread', shortName: 'Bread', description: 'Nourishment/provision', icon: 'Wheat' },
      { id: 'bl-incense', name: 'Altar of Incense', shortName: 'Incense', description: 'Prayer/intercession', icon: 'Wind' },
      { id: 'bl-ark', name: 'Ark of the Covenant', shortName: 'Ark', description: 'Law/covenant', icon: 'Package' },
      { id: 'bl-mercy', name: 'Mercy Seat', shortName: 'Mercy', description: 'Grace/propitiation', icon: 'Heart' },
    ],
  },

  // Floor 5 - Three Angels Room (3 Messages)
  '3a': {
    roomId: '3a',
    roomName: 'Three Angels Room',
    subPrinciples: [
      { id: '3a-first', name: 'First Angel', shortName: '1st Angel', description: 'Everlasting gospel & judgment', icon: 'MessageCircle' },
      { id: '3a-second', name: 'Second Angel', shortName: '2nd Angel', description: 'Babylon fallen', icon: 'Building2' },
      { id: '3a-third', name: 'Third Angel', shortName: '3rd Angel', description: 'Beast warning & seal', icon: 'Shield' },
    ],
  },

  // Floor 5 - Feasts Room (7 Feasts)
  fe: {
    roomId: 'fe',
    roomName: 'Feasts Room',
    subPrinciples: [
      { id: 'fe-passover', name: 'Passover', shortName: 'Passover', description: 'Redemption/deliverance', icon: 'Rabbit' },
      { id: 'fe-unleavened', name: 'Unleavened Bread', shortName: 'Unleavened', description: 'Purification/sanctification', icon: 'Cookie' },
      { id: 'fe-firstfruits', name: 'Firstfruits', shortName: 'Firstfruits', description: 'Resurrection/new beginnings', icon: 'Sprout' },
      { id: 'fe-pentecost', name: 'Pentecost', shortName: 'Pentecost', description: 'Spirit outpouring/harvest', icon: 'Flame' },
      { id: 'fe-trumpets', name: 'Trumpets', shortName: 'Trumpets', description: 'Awakening/warning', icon: 'Megaphone' },
      { id: 'fe-atonement', name: 'Day of Atonement', shortName: 'Atonement', description: 'Judgment/cleansing', icon: 'Scale' },
      { id: 'fe-tabernacles', name: 'Tabernacles', shortName: 'Tabernacles', description: 'Dwelling with God', icon: 'Tent' },
    ],
  },

  // Floor 5 - Christ Every Chapter (4 Lenses)
  cec: {
    roomId: 'cec',
    roomName: 'Christ Every Chapter',
    subPrinciples: [
      { id: 'cec-explicit', name: 'Explicit', shortName: 'Explicit', description: 'Christ directly mentioned', icon: 'Target' },
      { id: 'cec-typological', name: 'Typological', shortName: 'Type', description: 'Types and shadows', icon: 'Layers' },
      { id: 'cec-thematic', name: 'Thematic', shortName: 'Theme', description: 'Theme fulfilled in Christ', icon: 'Palette' },
      { id: 'cec-prophetic', name: 'Prophetic', shortName: 'Prophecy', description: 'Prophecy Christ fulfills', icon: 'Scroll' },
    ],
  },

  // Floor 6 - Three Heavens (3 Heavens)
  '123h': {
    roomId: '123h',
    roomName: 'Three Heavens Room',
    subPrinciples: [
      { id: '123h-first', name: 'First Heaven (DoL¹/NE¹)', shortName: '1H', description: 'Babylon destroys Jerusalem → Cyrusic restoration', icon: 'Cloud' },
      { id: '123h-second', name: 'Second Heaven (DoL²/NE²)', shortName: '2H', description: '70 AD → New-Covenant heavenly sanctuary order', icon: 'Star' },
      { id: '123h-third', name: 'Third Heaven (DoL³/NE³)', shortName: '3H', description: 'Final judgment → literal New Heavens & Earth', icon: 'Crown' },
    ],
  },

  // Floor 6 - Cycles Room (8 Cycles)
  cycles: {
    roomId: 'cycles',
    roomName: 'Cycles Room',
    subPrinciples: [
      { id: 'cycles-adam', name: '@Ad (Adam)', shortName: 'Adam', description: 'Creation, Fall, Seed', icon: 'Apple' },
      { id: 'cycles-noah', name: '@No (Noah)', shortName: 'Noah', description: 'Judgment, ark, new beginning', icon: 'Ship' },
      { id: 'cycles-abraham', name: '@Ab (Abraham)', shortName: 'Abraham', description: 'Covenant, faith, promised seed', icon: 'Star' },
      { id: 'cycles-moses', name: '@Mo (Moses)', shortName: 'Moses', description: 'Exodus, law, tabernacle', icon: 'Mountain' },
      { id: 'cycles-cyrus', name: '@Cy (Cyrus)', shortName: 'Cyrus', description: 'Captivity, return, restoration', icon: 'Building' },
      { id: 'cycles-cyruschrist', name: '@CyC (Cyrus-Christ)', shortName: 'CyC', description: 'Type meets antitype Deliverer', icon: 'Crown' },
      { id: 'cycles-spirit', name: '@Sp (Spirit)', shortName: 'Spirit', description: 'Pentecost, church, mission', icon: 'Flame' },
      { id: 'cycles-restoration', name: '@Re (Restoration)', shortName: 'Restore', description: 'Second Coming, new earth', icon: 'Sparkles' },
    ],
  },

  // Floor 7 - Fire Room (4 Themes)
  frm: {
    roomId: 'frm',
    roomName: 'Fire Room',
    subPrinciples: [
      { id: 'frm-testing', name: 'Testing Fire', shortName: 'Testing', description: 'Trial present in text', icon: 'Flame' },
      { id: 'frm-purifying', name: 'Purifying Work', shortName: 'Purifying', description: 'Being refined', icon: 'Filter' },
      { id: 'frm-spirit', name: 'Holy Spirit Fire', shortName: 'Spirit', description: 'Spirit\'s fire', icon: 'Sparkles' },
      { id: 'frm-transform', name: 'Transformation', shortName: 'Transform', description: 'What emerges', icon: 'RefreshCw' },
    ],
  },

  // Floor 7 - Meditation Room (4 Aspects)
  mr: {
    roomId: 'mr',
    roomName: 'Meditation Room',
    subPrinciples: [
      { id: 'mr-slow', name: 'Slow Reading', shortName: 'Slow', description: 'Reading slowly, repeatedly', icon: 'BookOpen' },
      { id: 'mr-phrase', name: 'Key Phrase', shortName: 'Phrase', description: 'Phrase demanding meditation', icon: 'Quote' },
      { id: 'mr-personal', name: 'Personal Word', shortName: 'Personal', description: 'God saying to YOU', icon: 'User' },
      { id: 'mr-silent', name: 'Silent Response', shortName: 'Silent', description: 'What rises in your heart', icon: 'Heart' },
    ],
  },

  // Floor 7 - Sanctuary Room (6 Personal Elements)
  srm: {
    roomId: 'srm',
    roomName: 'Speed Room',
    subPrinciples: [
      { id: 'srm-rapid', name: 'Rapid Scan', shortName: 'Scan', description: 'Quick connections across chapters', icon: 'Zap' },
      { id: 'srm-flash', name: 'Flash Recall', shortName: 'Flash', description: 'Instant Christ-connections', icon: 'Lightbulb' },
      { id: 'srm-sprint', name: 'Sprint Map', shortName: 'Sprint', description: 'Map a book in 60 seconds', icon: 'Timer' },
    ],
  },
};

// Get sub-principles for a room
export function getSubPrinciples(roomId: string): SubPrinciple[] | null {
  const roomData = ROOM_SUB_PRINCIPLES[roomId];
  return roomData ? roomData.subPrinciples : null;
}

// Check if a room has sub-principles
export function hasSubPrinciples(roomId: string): boolean {
  return roomId in ROOM_SUB_PRINCIPLES;
}

// Get all multi-principle room IDs
export function getMultiPrincipleRoomIds(): string[] {
  return Object.keys(ROOM_SUB_PRINCIPLES);
}
