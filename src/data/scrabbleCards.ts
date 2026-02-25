// PT Scrabble Card Database
// Generated from authentic Palace Principles ONLY
// NOTE: Sub-principles removed to prevent hallucinated content

import { palaceFloors } from './palaceData';
import type { ScrabbleCard } from '@/types/scrabble';

// Helper to extract tags from room purpose and method
function extractTags(purpose: string, method?: string): string[] {
  const tags: string[] = [];
  const text = `${purpose} ${method || ''}`.toLowerCase();

  // Thematic tags
  if (text.includes('christ') || text.includes('jesus')) tags.push('christology');
  if (text.includes('memory') || text.includes('remember')) tags.push('memory');
  if (text.includes('story') || text.includes('narrative')) tags.push('narrative');
  if (text.includes('symbol') || text.includes('type')) tags.push('typology');
  if (text.includes('prophecy') || text.includes('prophetic')) tags.push('prophecy');
  if (text.includes('sanctuary') || text.includes('temple')) tags.push('sanctuary');
  if (text.includes('judgment') || text.includes('judge')) tags.push('judgment');
  if (text.includes('salvation') || text.includes('save')) tags.push('salvation');
  if (text.includes('covenant')) tags.push('covenant');
  if (text.includes('creation') || text.includes('create')) tags.push('creation');
  if (text.includes('redemption') || text.includes('redeem')) tags.push('redemption');
  if (text.includes('prayer') || text.includes('pray')) tags.push('prayer');
  if (text.includes('worship')) tags.push('worship');
  if (text.includes('sacrifice')) tags.push('sacrifice');
  if (text.includes('heaven')) tags.push('heaven');
  if (text.includes('earth')) tags.push('earth');
  if (text.includes('nature') || text.includes('natural')) tags.push('nature');
  if (text.includes('personal') || text.includes('application')) tags.push('application');
  if (text.includes('question') || text.includes('inquiry')) tags.push('investigation');
  if (text.includes('visual') || text.includes('image')) tags.push('visualization');
  if (text.includes('connect') || text.includes('link')) tags.push('connection');
  if (text.includes('pattern')) tags.push('pattern');
  if (text.includes('parallel')) tags.push('parallel');
  if (text.includes('history') || text.includes('historical')) tags.push('history');
  if (text.includes('gospel')) tags.push('gospel');
  if (text.includes('law')) tags.push('law');
  if (text.includes('grace')) tags.push('grace');
  if (text.includes('faith')) tags.push('faith');
  if (text.includes('spirit') || text.includes('spiritual')) tags.push('spirit');
  if (text.includes('church') || text.includes('ecclesi')) tags.push('ecclesiology');
  if (text.includes('eschat') || text.includes('end time') || text.includes('last day')) tags.push('eschatology');

  return [...new Set(tags)]; // Remove duplicates
}

// Rooms that have individual principle cards in generateSpecialCards() —
// skip generating a single room-level card for these.
const MULTI_PRINCIPLE_ROOMS = new Set(['DR', 'TZ', 'C6', '1H/2H/3H', '@', 'MATH', 'CR', 'TRm', 'FE', '3A', 'FRt']);

// 2-3 sentence card descriptions for every room, with application instruction.
const ROOM_DESCRIPTIONS: Record<string, string> = {
  // Floor 1 — Furnishing
  'SR': 'The Story Room trains you to retell biblical events as memorable, sequential scenes. Break the passage into its key story beats and retell them in order. How does the text relate to this principle?',
  'IR': 'The Imagination Room trains you to experience Scripture with all five senses. Step inside the scene — what do you see, hear, smell, and feel? How does the text relate to this principle?',
  '24': 'The 24FPS Room creates a visual GPS for the Bible — one memorable image per chapter. Pick a single vivid image from this text that captures its essence. How does the text relate to this principle?',
  'BR': 'Bible Rendered compresses Scripture into symbolic glyphs — one symbol per 24-chapter block. Identify the central movement of this passage and assign it one simple glyph. How does the text relate to this principle?',
  'TR': 'The Translation Room converts abstract biblical concepts into concrete visual pictures. Turn the key idea of this text into a vivid image. How does the text relate to this principle?',
  'GR': 'The Gems Room mines Scripture for rare truths by combining unrelated texts until they illuminate each other. Find a hidden gem — a truth most people miss in this passage. How does the text relate to this principle?',

  // Floor 2 — Investigation
  'OR': 'The Observation Room trains you to gather raw data before interpreting. Count people, objects, actions, repeated words, and contrasts in the text. How does the text relate to this principle?',
  'DC': 'The Def-Com Room defines key terms in their original language and consults trusted commentaries. Identify the most important word in this text and explore its deeper meaning. How does the text relate to this principle?',
  'ST': 'The Symbols/Types Room tracks consistent biblical imagery — Lamb, Rock, Light — through Scripture to see how it points to Christ. Find a symbol or type in this text. How does the text relate to this principle?',
  'QR': 'The Questions Room generates precision questions using three types: INTRA (inside the passage), INTER (across Scripture), and PALACE (Phototheology framework). Ask penetrating questions of this text. How does the text relate to this principle?',

  // Floor 3 — Freestyle
  'QA': 'The Q&A Chains Room lets Scripture interpret Scripture. Take a question about this text and find 2-4 biblical cross-references that answer it. How does the text relate to this principle?',
  'NF': 'Nature Freestyle sees God\'s invisible attributes in visible creation. Find a natural element — a tree, storm, or animal — that illustrates a truth in this text. How does the text relate to this principle?',
  'PF': 'Personal Freestyle turns your biography into theology. Find a moment in your own life story that echoes or illustrates the truth in this text. How does the text relate to this principle?',
  'BF': 'Bible Freestyle trains you to see how every verse connects to other verses — some are siblings, others distant relatives. Find a verse that connects to this text and explain the relationship. How does the text relate to this principle?',
  'HF': 'History/Social Freestyle mines secular history, culture, and current events for gospel illustrations. Find something from history or culture that this text illuminates. How does the text relate to this principle?',
  'LR': 'The Listening Room transforms passive hearing into active Scripture-linking. Find a theological echo from a sermon, conversation, or life experience that connects to this text. How does the text relate to this principle?',

  // Floor 4 — Next Level (non-excluded rooms)
  'PRm': 'The Patterns Room identifies recurring theological motifs that God plays throughout Scripture in different keys. Find a pattern in this text that echoes elsewhere in the Bible. How does the text relate to this principle?',
  'P\u2016': 'The Parallels Room places two biblical events side by side and asks: what echoes, and what escalates? Find a parallel event in Scripture that mirrors this text. How does the text relate to this principle?',
  'FRt': 'The Fruit Room is your interpretive conscience — it asks what kind of life your interpretation produces. Does your reading of this text produce good fruit or bad fruit? How does the text relate to this principle?',

  // Floor 5 — Vision
  'BL': 'The Blue Room reveals the Sanctuary as God\'s architectural blueprint for understanding Scripture. Connect this text to a piece of tabernacle furniture, a ritual, or a priestly service. How does the text relate to this principle?',
  'PR': 'The Prophecy Room reads Daniel and Revelation as God\'s cohesive timeline of redemptive history. Find the prophetic significance of this text — what was or will be fulfilled? How does the text relate to this principle?',
  'CEC': 'Christ in Every Chapter enforces the principle that ALL Scripture is about Jesus. Find Christ in this text — even where He seems hidden. How does the text relate to this principle?',
  'R66': 'Room 66 traces a single theme through every book of the Bible, from Genesis to Revelation. Pick a theme from this text and trace it across Scripture. How does the text relate to this principle?',

  // Floor 6 (non-excluded rooms)
  'JR': 'The Juice Room extracts maximum theological, narrative, and practical meaning from Scripture at any scale. Squeeze every drop of meaning from this text without distortion. How does the text relate to this principle?',

  // Floor 7 — Spiritual & Emotional
  'FRm': 'The Fire Room is where Scripture moves from your head to your heart, igniting conviction, comfort, or worship. What in this text sets your soul on fire? How does the text relate to this principle?',
  'MR': 'The Meditation Room trains you to marinate in a single verse or phrase until it absorbs into your being. Choose one phrase from this text and dwell on it deeply. How does the text relate to this principle?',
  'SRm': 'The Speed Room trains you to retrieve biblical knowledge instantly under time pressure. Quickly connect this text to as many other Scriptures, principles, or applications as you can. How does the text relate to this principle?',

  // Floor 8 — Master
  '\u221E': 'Reflexive Mastery is when the Palace structure becomes invisible because it\'s wired into your instincts. Read this text naturally through layered lenses without consciously naming rooms. How does the text relate to this principle?',
  'PFS': 'Palace Freestyle is a relational study environment where you think out loud with Scripture, building patterns before concluding. Freely explore connections in this text. How does the text relate to this principle?',
};

// Generate room cards from palaceData (authentic rooms only)
function generateRoomCards(): ScrabbleCard[] {
  const cards: ScrabbleCard[] = [];

  palaceFloors.forEach(floor => {
    floor.rooms.forEach(room => {
      // Skip rooms whose principles are broken out as individual cards
      if (MULTI_PRINCIPLE_ROOMS.has(room.tag)) return;

      cards.push({
        id: `room-${room.id}`,
        code: room.tag,
        name: room.name,
        floor: floor.number,
        category: floor.name,
        icon: room.icon || 'BookOpen',
        tags: [
          floor.name.toLowerCase(),
          `floor-${floor.number}`,
          ...extractTags(room.purpose, room.method),
        ],
        description: ROOM_DESCRIPTIONS[room.tag] || room.purpose,
      });
    });
  });

  return cards;
}

// Additional special cards (dimensions, cycles, etc.) - from canonical PT structure
function generateSpecialCards(): ScrabbleCard[] {
  const cards: ScrabbleCard[] = [];

  // 5 Dimensions (from Dimensions Room - Floor 4)
  const dimensions = [
    { id: 'dim-literal', code: 'Literal', name: 'Literal Dimension', description: 'This dimension reads the text at face value in its original historical and grammatical context. What did it mean to the original audience? Apply this lens to the text.', tags: ['dimension', 'literal', 'history'], icon: 'FileText' },
    { id: 'dim-christ', code: 'Christ', name: 'Christ Dimension', description: 'This dimension looks for Jesus in the text. How does this passage point to Christ — His life, death, resurrection, or ministry? Apply this lens to the text.', tags: ['dimension', 'christology', 'typology'], icon: 'Cross' },
    { id: 'dim-me', code: 'Me', name: 'Personal Dimension', description: 'This dimension makes it personal. How does this text apply to your individual walk with God — your sins, promises, or daily life? Apply this lens to the text.', tags: ['dimension', 'application', 'personal'], icon: 'User' },
    { id: 'dim-church', code: 'Church', name: 'Church Dimension', description: 'This dimension thinks corporately. How does this passage apply to the church as a whole — its worship, mission, unity, or discipline? Apply this lens to the text.', tags: ['dimension', 'ecclesiology', 'church'], icon: 'Users' },
    { id: 'dim-heaven', code: 'Heaven', name: 'Heaven Dimension', description: 'This dimension looks heavenward. How does this text connect to the heavenly realm — the throne room, eternal realities, or final fulfillment? Apply this lens to the text.', tags: ['dimension', 'heaven', 'eschatology'], icon: 'Cloud' },
  ];

  dimensions.forEach(d => {
    cards.push({
      id: d.id,
      code: d.code,
      name: d.name,
      floor: 4,
      category: 'Dimensions Room',
      icon: d.icon,
      tags: d.tags,
      description: d.description,
    });
  });

  // 3 Heavens (from Three Heavens Floor - Floor 6)
  const heavens = [
    { id: 'heaven-1h', code: '1H', name: 'First Heaven', description: 'The First Heaven horizon covers the Babylonian destruction of Jerusalem and the Cyrusic restoration. Apply the text to this horizon of prophecy.', tags: ['heaven', 'judgment', 'restoration', 'babylon'], icon: 'CloudSun' },
    { id: 'heaven-2h', code: '2H', name: 'Second Heaven', description: 'The Second Heaven horizon covers 70 AD and the establishment of the New Covenant order. Apply the text to this horizon of prophecy.', tags: ['heaven', 'new-covenant', 'church', 'apostolic'], icon: 'Cloud' },
    { id: 'heaven-3h', code: '3H', name: 'Third Heaven', description: 'The Third Heaven horizon covers the final judgment and the literal new creation. Apply the text to this horizon of prophecy.', tags: ['heaven', 'throne', 'paradise', 'new-earth'], icon: 'Sparkles' },
  ];

  heavens.forEach(h => {
    cards.push({
      id: h.id,
      code: h.code,
      name: h.name,
      floor: 6,
      category: 'Three Heavens',
      icon: h.icon,
      tags: h.tags,
      description: h.description,
    });
  });

  // 8 Cycles (from Cycles - Floor 6)
  const cycles = [
    { id: 'cycle-ad', code: '@Ad', name: 'Adamic Cycle', description: 'This cycle describes creation through the Fall and the first promise of a Redeemer (Gen 3:15). Apply the text to something in this cycle.', tags: ['cycle', 'creation', 'adam', 'fall', 'seed'], icon: 'Apple' },
    { id: 'cycle-no', code: '@No', name: 'Noahic Cycle', description: 'This cycle describes the period from the spread of sin to the Flood judgment and God\'s rainbow covenant. Apply the text to something in this cycle.', tags: ['cycle', 'judgment', 'noah', 'flood', 'covenant'], icon: 'Ship' },
    { id: 'cycle-ab', code: '@Ab', name: 'Abrahamic Cycle', description: 'This cycle describes the period from Abraham\'s call to the sojourn in Egypt—covenant, faith, and the promised seed. Apply the text to something in this cycle.', tags: ['cycle', 'covenant', 'abraham', 'faith', 'promise'], icon: 'Star' },
    { id: 'cycle-mo', code: '@Mo', name: 'Mosaic Cycle', description: 'This cycle describes the period of history from the Exodus to the Babylonian captivity. Apply the text to something in this cycle.', tags: ['cycle', 'exodus', 'moses', 'law', 'sanctuary'], icon: 'Mountain' },
    { id: 'cycle-cy', code: '@Cy', name: 'Cyrusic Cycle', description: 'This cycle describes the period from the Babylonian exile through the return and rebuilding of the temple under Cyrus. Apply the text to something in this cycle.', tags: ['cycle', 'exile', 'cyrus', 'restoration', 'return'], icon: 'Building' },
    { id: 'cycle-cyc', code: '@CyC', name: 'Cyrus-Christ Cycle', description: 'This cycle describes the period where Old Testament types meet their New Testament antitype—shadow meets substance in Christ. Apply the text to something in this cycle.', tags: ['cycle', 'fulfillment', 'christ', 'antitype'], icon: 'Target' },
    { id: 'cycle-sp', code: '@Sp', name: 'Spirit Cycle', description: 'This cycle describes the period from Pentecost through the church age and global mission. Apply the text to something in this cycle.', tags: ['cycle', 'pentecost', 'spirit', 'church', 'mission'], icon: 'Flame' },
    { id: 'cycle-re', code: '@Re', name: 'Remnant Cycle', description: 'This cycle describes the end-time period of final witness, judgment, and the Second Coming. Apply the text to something in this cycle.', tags: ['cycle', 'remnant', 'second-coming', 'revelation', 'eschatology'], icon: 'Crown' },
  ];

  cycles.forEach(c => {
    cards.push({
      id: c.id,
      code: c.code,
      name: c.name,
      floor: 6,
      category: 'Cycles',
      icon: c.icon,
      tags: c.tags,
      description: c.description,
    });
  });

  // 6 Genres (from Connect-6 Room - Floor 4)
  const genres = [
    { id: 'genre-prophecy', code: 'C6-Pr', name: 'Prophecy Genre', description: 'Find a prophecy that predicts, foreshadows, or fulfills the truth in this text.', tags: ['genre', 'prophecy', 'connect-6'], icon: 'Scroll' },
    { id: 'genre-parable', code: 'C6-Pa', name: 'Parable Genre', description: 'Find a parable of Jesus that illustrates or echoes the principle in this text.', tags: ['genre', 'parable', 'connect-6'], icon: 'MessageCircle' },
    { id: 'genre-epistle', code: 'C6-Ep', name: 'Epistle Genre', description: 'Find an apostolic letter that explains or applies the doctrine in this text.', tags: ['genre', 'epistle', 'connect-6'], icon: 'Mail' },
    { id: 'genre-history', code: 'C6-Hi', name: 'History Genre', description: 'Find a biblical narrative or event that demonstrates this truth in action.', tags: ['genre', 'history', 'connect-6', 'narrative'], icon: 'BookOpen' },
    { id: 'genre-gospel', code: 'C6-Go', name: 'Gospel Genre', description: 'Find a moment in Jesus\' life or teaching that embodies this truth.', tags: ['genre', 'gospel', 'connect-6', 'christology'], icon: 'Cross' },
    { id: 'genre-poetry', code: 'C6-Po', name: 'Poetry Genre', description: 'Find a psalm, proverb, or song that expresses this truth artistically.', tags: ['genre', 'poetry', 'connect-6', 'wisdom'], icon: 'Music' },
  ];

  genres.forEach(g => {
    cards.push({
      id: g.id,
      code: g.code,
      name: g.name,
      floor: 4,
      category: 'Connect-6',
      icon: g.icon,
      tags: g.tags,
      description: g.description,
    });
  });

  // 4 Christ Offices (from Concentration Room - Floor 4)
  const offices = [
    { id: 'office-prophet', code: 'CR-Pr', name: 'Christ as Prophet', description: 'In this office Christ reveals God\'s will through teaching, proclaiming, and foretelling. Find where Christ is functioning as Prophet in this text. Apply this lens to the text.', tags: ['office', 'prophet', 'christology', 'teaching'], icon: 'MessageSquare' },
    { id: 'office-priest', code: 'CR-Pt', name: 'Christ as Priest', description: 'In this office Christ mediates between God and humanity through sacrifice, intercession, and blessing. Find where Christ is functioning as Priest in this text. Apply this lens to the text.', tags: ['office', 'priest', 'christology', 'sacrifice', 'intercession'], icon: 'Heart' },
    { id: 'office-king', code: 'CR-Ki', name: 'Christ as King', description: 'In this office Christ rules with authority over creation, church, and cosmos — conquering, commanding, and reigning. Find where Christ is functioning as King in this text. Apply this lens to the text.', tags: ['office', 'king', 'christology', 'authority', 'sovereignty'], icon: 'Crown' },
    { id: 'office-judge', code: 'CR-Ju', name: 'Christ as Judge', description: 'In this office Christ evaluates, vindicates, and renders final verdict — separating truth from error, righteous from wicked. Find where Christ is functioning as Judge in this text. Apply this lens to the text.', tags: ['office', 'judge', 'christology', 'judgment', 'justice'], icon: 'Scale' },
  ];

  offices.forEach(o => {
    cards.push({
      id: o.id,
      code: o.code,
      name: o.name,
      floor: 4,
      category: 'Concentration Room',
      icon: o.icon,
      tags: o.tags,
      description: o.description,
    });
  });

  // 6 Theme Spans (from Theme Room - Floor 4)
  const spans = [
    { id: 'span-sanctuary', code: 'TRm-Sa', name: 'Sanctuary Wall', description: 'This span covers passages about God\'s dwelling place, sacrifice, priesthood, and mediation. Identify how this text relates to the sanctuary system. Apply this span to the text.', tags: ['span', 'sanctuary', 'sacrifice', 'priesthood'], icon: 'Church' },
    { id: 'span-loc', code: 'TRm-LC', name: 'Life of Christ Wall', description: 'This span covers passages about Jesus\' incarnation, ministry, death, resurrection, and ascension. Identify how this text relates to Christ\'s earthly or heavenly life. Apply this span to the text.', tags: ['span', 'christology', 'gospel', 'incarnation'], icon: 'Cross' },
    { id: 'span-gc', code: 'TRm-GC', name: 'Great Controversy Wall', description: 'This span covers the cosmic conflict between Christ and Satan — good vs. evil, truth vs. error, persecution vs. vindication. Identify this theme in the text. Apply this span to the text.', tags: ['span', 'great-controversy', 'spiritual-warfare', 'deception'], icon: 'Swords' },
    { id: 'span-tp', code: 'TRm-TP', name: 'Time-Prophecy Wall', description: 'This span covers prophetic timelines, Daniel-Revelation sequences, and eschatological events. Identify how this text fits into God\'s prophetic calendar. Apply this span to the text.', tags: ['span', 'prophecy', 'timeline', 'eschatology'], icon: 'Calendar' },
    { id: 'span-gospel', code: 'TRm-Go', name: 'Gospel Floor', description: 'This span covers the foundation of salvation — justification, righteousness by faith, and grace alone. Identify how this text proclaims the gospel. Apply this span to the text.', tags: ['span', 'gospel', 'grace', 'faith', 'salvation'], icon: 'Gift' },
    { id: 'span-heaven', code: 'TRm-He', name: 'Heaven Ceiling', description: 'This span covers eternal realities — the new heavens and earth, resurrection, glorification, and the consummation. Identify how this text points to our ultimate hope. Apply this span to the text.', tags: ['span', 'heaven', 'new-creation', 'eschatology'], icon: 'Sparkles' },
  ];

  spans.forEach(s => {
    cards.push({
      id: s.id,
      code: s.code,
      name: s.name,
      floor: 4,
      category: 'Theme Room',
      icon: s.icon,
      tags: s.tags,
      description: s.description,
    });
  });

  // 3 Angels' Messages (from Three Angels Room - Floor 5)
  const angels = [
    { id: 'angel-1', code: '3A-1', name: 'First Angel', description: 'The First Angel proclaims the everlasting gospel, calls all people to worship the Creator, and announces that the hour of judgment has come (Rev 14:6-7). Apply this message to the text.', tags: ['angel', 'gospel', 'creation', 'judgment'], icon: 'Megaphone' },
    { id: 'angel-2', code: '3A-2', name: 'Second Angel', description: 'The Second Angel announces the fall of Babylon — the collapse of apostate religious systems that have confused and intoxicated the nations (Rev 14:8). Apply this message to the text.', tags: ['angel', 'babylon', 'apostasy', 'fall'], icon: 'AlertTriangle' },
    { id: 'angel-3', code: '3A-3', name: 'Third Angel', description: 'The Third Angel warns against the beast and his mark, calling God\'s people to patient endurance and faithfulness (Rev 14:9-12). Apply this message to the text.', tags: ['angel', 'beast', 'mark', 'endurance', 'faithfulness'], icon: 'Shield' },
  ];

  angels.forEach(a => {
    cards.push({
      id: a.id,
      code: a.code,
      name: a.name,
      floor: 5,
      category: 'Three Angels Room',
      icon: a.icon,
      tags: a.tags,
      description: a.description,
    });
  });

  // 7 Feasts (from Feasts Room - Floor 5)
  const feasts = [
    { id: 'feast-passover', code: 'FE-Pa', name: 'Passover', description: 'Passover commemorates the lamb slain, blood applied, and deliverance from death (Lev 23:5). Christ our Passover Lamb was sacrificed for us. Apply this feast to the text.', tags: ['feast', 'passover', 'lamb', 'deliverance', 'sacrifice'], icon: 'Droplet' },
    { id: 'feast-unleavened', code: 'FE-UB', name: 'Unleavened Bread', description: 'Unleavened Bread pictures the removal of sin and the call to holy living (Lev 23:6-8). Leaven represents sin that must be purged. Apply this feast to the text.', tags: ['feast', 'unleavened', 'holiness', 'sanctification'], icon: 'Wheat' },
    { id: 'feast-firstfruits', code: 'FE-FF', name: 'Firstfruits', description: 'Firstfruits celebrates the first sheaf of harvest waved before God (Lev 23:10-11). Christ rose as the firstfruits of those who have fallen asleep. Apply this feast to the text.', tags: ['feast', 'firstfruits', 'resurrection', 'harvest'], icon: 'Sprout' },
    { id: 'feast-pentecost', code: 'FE-Pe', name: 'Pentecost', description: 'Pentecost marks the wheat harvest and the outpouring of the Holy Spirit fifty days after Firstfruits (Lev 23:15-16). Apply this feast to the text.', tags: ['feast', 'pentecost', 'spirit', 'harvest', 'church'], icon: 'Flame' },
    { id: 'feast-trumpets', code: 'FE-Tr', name: 'Trumpets', description: 'The Feast of Trumpets sounds a call to awakening, gathering, and preparation for judgment (Lev 23:24). Apply this feast to the text.', tags: ['feast', 'trumpets', 'awakening', 'gathering', 'judgment'], icon: 'Bell' },
    { id: 'feast-atonement', code: 'FE-DA', name: 'Day of Atonement', description: 'The Day of Atonement pictures the High Priest entering the Most Holy Place for judgment, cleansing, and the removal of sin (Lev 23:27-28). Apply this feast to the text.', tags: ['feast', 'atonement', 'judgment', 'cleansing', 'sanctuary'], icon: 'Scale' },
    { id: 'feast-tabernacles', code: 'FE-Ta', name: 'Tabernacles', description: 'The Feast of Tabernacles celebrates the final harvest, God dwelling with His people, and ultimate rejoicing (Lev 23:34). Apply this feast to the text.', tags: ['feast', 'tabernacles', 'dwelling', 'harvest', 'joy'], icon: 'Tent' },
  ];

  feasts.forEach(f => {
    cards.push({
      id: f.id,
      code: f.code,
      name: f.name,
      floor: 5,
      category: 'Feasts Room',
      icon: f.icon,
      tags: f.tags,
      description: f.description,
    });
  });

  // 6 Time Prophecies (from Mathematics Room - Floor 6)
  const timeProphecies = [
    { id: 'math-120', code: '@120', name: '120 Years', description: 'This time prophecy represents probation before judgment (Gen 6:3). God gives a grace period with a clear deadline before judgment falls. Apply this prophetic pattern to the text.', tags: ['math', 'prophecy', 'probation', 'judgment', 'mercy'], icon: 'Timer' },
    { id: 'math-400', code: '@400', name: '400 Years', description: 'This time prophecy represents affliction before deliverance (Gen 15:13). God predicts a period of suffering with an exact duration and a promise of deliverance. Apply this prophetic pattern to the text.', tags: ['math', 'prophecy', 'affliction', 'deliverance', 'covenant'], icon: 'Timer' },
    { id: 'math-70', code: '@70y', name: '70 Years', description: 'This time prophecy represents captivity followed by restoration (Jer 25:11-12). Judgment has limits, and restoration comes on God\'s schedule. Apply this prophetic pattern to the text.', tags: ['math', 'prophecy', 'captivity', 'restoration', 'discipline'], icon: 'Timer' },
    { id: 'math-490', code: '@490', name: '490 Years', description: 'This time prophecy pinpoints the Messiah\'s arrival and covenant confirmation (Dan 9:24-27). Christ came exactly on prophetic schedule. Apply this prophetic pattern to the text.', tags: ['math', 'prophecy', 'messiah', 'covenant', 'redemption'], icon: 'Timer' },
    { id: 'math-1260', code: '@1260', name: '1260 Years', description: 'This time prophecy represents truth suppressed under counterfeit authority (Dan 7:25, Rev 11-13). Persecution has God-ordained limits. Apply this prophetic pattern to the text.', tags: ['math', 'prophecy', 'persecution', 'truth', 'authority'], icon: 'Timer' },
    { id: 'math-2300', code: '@2300', name: '2300 Years', description: 'This time prophecy points to cosmic judgment and sanctuary cleansing (Dan 8:14). We live in the judgment hour. Apply this prophetic pattern to the text.', tags: ['math', 'prophecy', 'judgment', 'sanctuary', 'cleansing'], icon: 'Timer' },
  ];

  timeProphecies.forEach(tp => {
    cards.push({
      id: tp.id,
      code: tp.code,
      name: tp.name,
      floor: 6,
      category: 'Mathematics Room',
      icon: tp.icon,
      tags: tp.tags,
      description: tp.description,
    });
  });

  // Time Zones (from Time Zone Room - Floor 4)
  // The 6 Time Zones: Heaven/Earth × Past/Present/Future
  // Used to locate where a text fits in the cosmic-historical timeline
  const timeZones = [
    { id: 'tz-hp', code: 'H-Past', name: 'Heaven Past', description: 'This time zone covers events in heaven before creation — Lucifer\'s rebellion, the divine counsel, and the war in heaven. Apply the text to something in this zone.', tags: ['timezone', 'heaven', 'past', 'pre-fall'], icon: 'History' },
    { id: 'tz-hn', code: 'H-Now', name: 'Heaven Now', description: 'This time zone covers what is happening in heaven right now — Christ\'s intercession, His sanctuary ministry, and angelic activity. Apply the text to something in this zone.', tags: ['timezone', 'heaven', 'present', 'sanctuary'], icon: 'Clock' },
    { id: 'tz-hf', code: 'H-Future', name: 'Heaven Future', description: 'This time zone covers future heavenly realities — the new heaven, the eternal throne, and the end of all tears. Apply the text to something in this zone.', tags: ['timezone', 'heaven', 'future', 'eschatology'], icon: 'Hourglass' },
    { id: 'tz-ep', code: 'E-Past', name: 'Earth Past', description: 'This time zone covers historical events on earth that have already been fulfilled in Scripture. Apply the text to something in this zone.', tags: ['timezone', 'earth', 'past', 'history'], icon: 'MapPin' },
    { id: 'tz-en', code: 'E-Now', name: 'Earth Now', description: 'This time zone covers the believer\'s present life on earth — how the text applies to your daily walk today. Apply the text to something in this zone.', tags: ['timezone', 'earth', 'present', 'application'], icon: 'Globe' },
    { id: 'tz-ef', code: 'E-Future', name: 'Earth Future', description: 'This time zone covers prophesied future events on earth — the Second Coming, the millennium, and the new earth. Apply the text to something in this zone.', tags: ['timezone', 'earth', 'future', 'prophecy'], icon: 'Sunrise' },
  ];

  timeZones.forEach(tz => {
    cards.push({
      id: tz.id,
      code: tz.code,
      name: tz.name,
      floor: 4,
      category: 'Time Zone Room',
      icon: tz.icon,
      tags: tz.tags,
      description: tz.description,
    });
  });

  // 9 Fruits of the Spirit (from Fruit Room - Floor 4)
  const fruits = [
    { id: 'fruit-love', code: 'FRt-Lo', name: 'Love', description: 'This fruit asks: does your interpretation produce selfless, sacrificial love for God and others (1 Cor 13:4-7)? How does the text relate to this principle?', tags: ['fruit', 'love', 'character', 'application'], icon: 'Heart' },
    { id: 'fruit-joy', code: 'FRt-Jo', name: 'Joy', description: 'This fruit asks: does your interpretation produce deep, abiding joy that transcends circumstances (Phil 4:4)? How does the text relate to this principle?', tags: ['fruit', 'joy', 'character', 'application'], icon: 'Smile' },
    { id: 'fruit-peace', code: 'FRt-Pe', name: 'Peace', description: 'This fruit asks: does your interpretation produce peace with God and peace of mind (Phil 4:7)? How does the text relate to this principle?', tags: ['fruit', 'peace', 'character', 'application'], icon: 'Leaf' },
    { id: 'fruit-patience', code: 'FRt-Pa', name: 'Patience', description: 'This fruit asks: does your interpretation cultivate patient endurance under trial and slow-to-anger restraint (James 1:3-4)? How does the text relate to this principle?', tags: ['fruit', 'patience', 'character', 'endurance'], icon: 'Clock' },
    { id: 'fruit-kindness', code: 'FRt-Ki', name: 'Kindness', description: 'This fruit asks: does your interpretation move you toward generous, tender action toward others (Eph 4:32)? How does the text relate to this principle?', tags: ['fruit', 'kindness', 'character', 'compassion'], icon: 'HandHeart' },
    { id: 'fruit-goodness', code: 'FRt-Go', name: 'Goodness', description: 'This fruit asks: does your interpretation produce moral integrity and active virtue that reflects God\'s character (Mic 6:8)? How does the text relate to this principle?', tags: ['fruit', 'goodness', 'character', 'righteousness'], icon: 'Sun' },
    { id: 'fruit-faithfulness', code: 'FRt-Fa', name: 'Faithfulness', description: 'This fruit asks: does your interpretation build trustworthy, covenant-keeping loyalty to God and others (Lam 3:22-23)? How does the text relate to this principle?', tags: ['fruit', 'faithfulness', 'character', 'covenant'], icon: 'Shield' },
    { id: 'fruit-gentleness', code: 'FRt-Ge', name: 'Gentleness', description: 'This fruit asks: does your interpretation cultivate meekness — power under control, strength without harshness (Matt 11:29)? How does the text relate to this principle?', tags: ['fruit', 'gentleness', 'character', 'meekness'], icon: 'Feather' },
    { id: 'fruit-selfcontrol', code: 'FRt-SC', name: 'Self-Control', description: 'This fruit asks: does your interpretation strengthen mastery over impulse, appetite, and passion (2 Pet 1:5-6)? How does the text relate to this principle?', tags: ['fruit', 'self-control', 'character', 'discipline'], icon: 'Lock' },
  ];

  fruits.forEach(f => {
    cards.push({
      id: f.id,
      code: f.code,
      name: f.name,
      floor: 4,
      category: 'Fruit Room',
      icon: f.icon,
      tags: f.tags,
      description: f.description,
    });
  });

  return cards;
}

// All Scrabble cards combined - ONLY authentic Palace principles
let _allCards: ScrabbleCard[] | null = null;

export function getAllScrabbleCards(): ScrabbleCard[] {
  if (!_allCards) {
    _allCards = [
      ...generateRoomCards(),      // Authentic rooms from palaceData.ts
      ...generateSpecialCards(),   // Dimensions, Heavens, Cycles, Time Zones
      // NOTE: Sub-principle cards removed to prevent hallucinated content
    ];
  }
  return _allCards;
}

// Get cards by floor
export function getCardsByFloor(floor: number): ScrabbleCard[] {
  return getAllScrabbleCards().filter(card => card.floor === floor);
}

// Get cards by category
export function getCardsByCategory(category: string): ScrabbleCard[] {
  return getAllScrabbleCards().filter(card =>
    card.category.toLowerCase() === category.toLowerCase()
  );
}

// Get cards by tag
export function getCardsByTag(tag: string): ScrabbleCard[] {
  return getAllScrabbleCards().filter(card =>
    card.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

// Find shared tags between two cards (for connection hints)
export function findSharedTags(card1: ScrabbleCard, card2: ScrabbleCard): string[] {
  return card1.tags.filter(tag => card2.tags.includes(tag));
}

// Check if two cards likely have a valid connection
export function hasLikelyConnection(card1: ScrabbleCard, card2: ScrabbleCard): boolean {
  const sharedTags = findSharedTags(card1, card2);
  return sharedTags.length >= 1;
}

// Get card by ID
export function getCardById(id: string): ScrabbleCard | undefined {
  return getAllScrabbleCards().find(card => card.id === id);
}

// Get card by code
export function getCardByCode(code: string): ScrabbleCard | undefined {
  return getAllScrabbleCards().find(card =>
    card.code.toLowerCase() === code.toLowerCase()
  );
}

// Shuffle cards for dealing
export function shuffleCards(cards: ScrabbleCard[]): ScrabbleCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Deal cards to players - each player gets their own independent hand from the full deck
export function dealCards(
  playerCount: number,
  cardsPerPlayer: number = 10
): { hands: ScrabbleCard[][] } {
  const allCards = getAllScrabbleCards();

  // Each player gets cardsPerPlayer random cards from the full pool independently
  const hands: ScrabbleCard[][] = [];
  for (let i = 0; i < playerCount; i++) {
    const shuffled = shuffleCards(allCards);
    hands.push(shuffled.slice(0, cardsPerPlayer));
  }

  return { hands };
}

// Get total card count
export function getTotalCardCount(): number {
  return getAllScrabbleCards().length;
}

// Export card counts by category for debugging
export function getCardStats(): Record<string, number> {
  const cards = getAllScrabbleCards();
  const stats: Record<string, number> = {};

  cards.forEach(card => {
    const key = `Floor ${card.floor} - ${card.category}`;
    stats[key] = (stats[key] || 0) + 1;
  });

  stats['TOTAL'] = cards.length;
  return stats;
}
