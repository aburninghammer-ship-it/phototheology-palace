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
const MULTI_PRINCIPLE_ROOMS = new Set(['DR', 'TZ', 'C6', '1H/2H/3H', '@']);

// Shorten a long purpose string to its first 2 sentences.
function shortenDescription(text: string): string {
  // Split on sentence-ending punctuation followed by a space
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= 2) return text;
  return sentences.slice(0, 2).join('').trim();
}

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
        description: shortenDescription(room.purpose),
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

// Deal cards to players
export function dealCards(
  playerCount: number,
  cardsPerPlayer: number = 10
): { hands: ScrabbleCard[][]; deck: ScrabbleCard[]; seedCard: ScrabbleCard } {
  const allCards = shuffleCards(getAllScrabbleCards());

  // Pick a random seed card from the middle floors (more connections possible)
  const midFloorCards = allCards.filter(c => c.floor >= 2 && c.floor <= 5);
  const seedCard = midFloorCards[Math.floor(Math.random() * midFloorCards.length)];

  // Remove seed card from deck
  const deck = allCards.filter(c => c.id !== seedCard.id);

  // Deal hands
  const hands: ScrabbleCard[][] = [];
  let deckIndex = 0;

  for (let i = 0; i < playerCount; i++) {
    const hand: ScrabbleCard[] = [];
    for (let j = 0; j < cardsPerPlayer && deckIndex < deck.length; j++) {
      hand.push(deck[deckIndex]);
      deckIndex++;
    }
    hands.push(hand);
  }

  // Remaining cards become the draw deck
  const remainingDeck = deck.slice(deckIndex);

  return { hands, deck: remainingDeck, seedCard };
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
