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

// Generate room cards from palaceData (authentic rooms only)
function generateRoomCards(): ScrabbleCard[] {
  const cards: ScrabbleCard[] = [];

  palaceFloors.forEach(floor => {
    floor.rooms.forEach(room => {
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
        description: room.purpose,
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
    { id: 'dim-literal', code: 'Literal', name: 'Literal Dimension', description: 'Plain historical/grammatical meaning', tags: ['dimension', 'literal', 'history'], icon: 'FileText' },
    { id: 'dim-christ', code: 'Christ', name: 'Christ Dimension', description: 'Points to Christ relationship', tags: ['dimension', 'christology', 'typology'], icon: 'Cross' },
    { id: 'dim-me', code: 'Me', name: 'Personal Dimension', description: 'Individual application', tags: ['dimension', 'application', 'personal'], icon: 'User' },
    { id: 'dim-church', code: 'Church', name: 'Church Dimension', description: 'Corporate body application', tags: ['dimension', 'ecclesiology', 'church'], icon: 'Users' },
    { id: 'dim-heaven', code: 'Heaven', name: 'Heaven Dimension', description: 'Celestial realm, throne room', tags: ['dimension', 'heaven', 'eschatology'], icon: 'Cloud' },
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
    { id: 'heaven-1h', code: '1H', name: 'First Heaven', description: 'DoL¹/NE¹ - Babylon destruction → Cyrusic restoration', tags: ['heaven', 'judgment', 'restoration', 'babylon'], icon: 'CloudSun' },
    { id: 'heaven-2h', code: '2H', name: 'Second Heaven', description: 'DoL²/NE² - 70 AD → New-Covenant/heavenly order', tags: ['heaven', 'new-covenant', 'church', 'apostolic'], icon: 'Cloud' },
    { id: 'heaven-3h', code: '3H', name: 'Third Heaven', description: 'DoL³/NE³ - Final judgment → Literal new creation', tags: ['heaven', 'throne', 'paradise', 'new-earth'], icon: 'Sparkles' },
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
    { id: 'cycle-ad', code: '@Ad', name: 'Adamic Cycle', description: 'Creation, Fall, Seed promise (Gen 3:15)', tags: ['cycle', 'creation', 'adam', 'fall', 'seed'], icon: 'Apple' },
    { id: 'cycle-no', code: '@No', name: 'Noahic Cycle', description: 'Judgment, ark, rainbow covenant', tags: ['cycle', 'judgment', 'noah', 'flood', 'covenant'], icon: 'Ship' },
    { id: 'cycle-ab', code: '@Ab', name: 'Abrahamic Cycle', description: 'Covenant, faith, promised seed', tags: ['cycle', 'covenant', 'abraham', 'faith', 'promise'], icon: 'Star' },
    { id: 'cycle-mo', code: '@Mo', name: 'Mosaic Cycle', description: 'Exodus, law, tabernacle nation', tags: ['cycle', 'exodus', 'moses', 'law', 'sanctuary'], icon: 'Mountain' },
    { id: 'cycle-cy', code: '@Cy', name: 'Cyrusic Cycle', description: 'Exile, return, temple rebuilt', tags: ['cycle', 'exile', 'cyrus', 'restoration', 'return'], icon: 'Building' },
    { id: 'cycle-cyc', code: '@CyC', name: 'Cyrus-Christ Cycle', description: 'Type meets antitype, shadow meets substance', tags: ['cycle', 'fulfillment', 'christ', 'antitype'], icon: 'Target' },
    { id: 'cycle-sp', code: '@Sp', name: 'Spirit Cycle', description: 'Pentecost, church age, global mission', tags: ['cycle', 'pentecost', 'spirit', 'church', 'mission'], icon: 'Flame' },
    { id: 'cycle-re', code: '@Re', name: 'Remnant Cycle', description: 'End-time witness, judgment, Second Coming', tags: ['cycle', 'remnant', 'second-coming', 'revelation', 'eschatology'], icon: 'Crown' },
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

  // Time Zones (from Time Zone Room - Floor 4)
  // The 6 Time Zones: Heaven/Earth × Past/Present/Future
  // Used to locate where a text fits in the cosmic-historical timeline
  const timeZones = [
    { id: 'tz-hp', code: 'H-Past', name: 'Heaven Past', description: 'How do events in heaven before the fall of man connect with this verse/story?', tags: ['timezone', 'heaven', 'past', 'pre-fall'], icon: 'History' },
    { id: 'tz-hn', code: 'H-Now', name: 'Heaven Now', description: 'How does Christ\'s current heavenly ministry relate to this text?', tags: ['timezone', 'heaven', 'present', 'sanctuary'], icon: 'Clock' },
    { id: 'tz-hf', code: 'H-Future', name: 'Heaven Future', description: 'What future heavenly events does this text point toward?', tags: ['timezone', 'heaven', 'future', 'eschatology'], icon: 'Hourglass' },
    { id: 'tz-ep', code: 'E-Past', name: 'Earth Past', description: 'What historical earthly events connect to this passage?', tags: ['timezone', 'earth', 'past', 'history'], icon: 'MapPin' },
    { id: 'tz-en', code: 'E-Now', name: 'Earth Now', description: 'How does this text apply to the believer\'s present life on earth?', tags: ['timezone', 'earth', 'present', 'application'], icon: 'Globe' },
    { id: 'tz-ef', code: 'E-Future', name: 'Earth Future', description: 'What prophesied future events on earth does this foreshadow?', tags: ['timezone', 'earth', 'future', 'prophecy'], icon: 'Sunrise' },
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
