// PT Scrabble Card Database
// Generated from Palace Principles (rooms + sub-principles)

import { palaceFloors } from './palaceData';
import { ROOM_SUB_PRINCIPLES } from '@/components/mind-map/data/roomSubPrinciples';
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

// Generate room cards from palaceData
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

// Generate sub-principle cards from roomSubPrinciples
function generateSubPrincipleCards(): ScrabbleCard[] {
  const cards: ScrabbleCard[] = [];

  // Find floor number for each room
  const roomFloorMap: Record<string, { floor: number; category: string }> = {};
  palaceFloors.forEach(floor => {
    floor.rooms.forEach(room => {
      roomFloorMap[room.id] = { floor: floor.number, category: floor.name };
    });
  });

  Object.entries(ROOM_SUB_PRINCIPLES).forEach(([roomId, roomData]) => {
    const floorInfo = roomFloorMap[roomId] || { floor: 0, category: 'Unknown' };

    roomData.subPrinciples.forEach(sp => {
      cards.push({
        id: sp.id,
        code: sp.shortName,
        name: sp.name,
        floor: floorInfo.floor,
        category: roomData.roomName,
        icon: sp.icon || 'Circle',
        tags: [
          floorInfo.category.toLowerCase(),
          `floor-${floorInfo.floor}`,
          roomId,
          ...extractTags(sp.description),
        ],
        description: sp.description,
      });
    });
  });

  return cards;
}

// Additional special cards (dimensions, cycles, etc.)
function generateSpecialCards(): ScrabbleCard[] {
  const cards: ScrabbleCard[] = [];

  // 5 Dimensions
  const dimensions = [
    { id: 'dim-1d', code: '1D', name: 'Literal Dimension', description: 'Plain historical/grammatical meaning', tags: ['dimension', 'literal', 'history'] },
    { id: 'dim-2d', code: '2D', name: 'Christ Dimension', description: 'Points to Christ relationship', tags: ['dimension', 'christology', 'typology'] },
    { id: 'dim-3d', code: '3D', name: 'Personal Dimension', description: 'Individual application', tags: ['dimension', 'application', 'personal'] },
    { id: 'dim-4d', code: '4D', name: 'Church Dimension', description: 'Corporate body application', tags: ['dimension', 'ecclesiology', 'church'] },
    { id: 'dim-5d', code: '5D', name: 'Heaven Dimension', description: 'Celestial realm, throne room', tags: ['dimension', 'heaven', 'eschatology'] },
  ];

  dimensions.forEach(d => {
    cards.push({
      id: d.id,
      code: d.code,
      name: d.name,
      floor: 4,
      category: 'Dimensions',
      icon: 'Layers',
      tags: d.tags,
      description: d.description,
    });
  });

  // 3 Heavens
  const heavens = [
    { id: 'heaven-1h', code: '1H', name: 'First Heaven', description: 'Atmospheric realm', tags: ['heaven', 'atmosphere', 'creation'] },
    { id: 'heaven-2h', code: '2H', name: 'Second Heaven', description: 'Cosmic realm, stars', tags: ['heaven', 'cosmic', 'stars'] },
    { id: 'heaven-3h', code: '3H', name: 'Third Heaven', description: 'Divine throne room', tags: ['heaven', 'throne', 'paradise'] },
  ];

  heavens.forEach(h => {
    cards.push({
      id: h.id,
      code: h.code,
      name: h.name,
      floor: 6,
      category: 'Three Heavens',
      icon: 'Cloud',
      tags: h.tags,
      description: h.description,
    });
  });

  // 8 Cycles
  const cycles = [
    { id: 'cycle-ad', code: '@Ad', name: 'Adamic Cycle', description: 'Creation, Fall, Seed promise', tags: ['cycle', 'creation', 'adam', 'fall', 'seed'] },
    { id: 'cycle-no', code: '@No', name: 'Noahic Cycle', description: 'Judgment, ark, new beginning', tags: ['cycle', 'judgment', 'noah', 'flood', 'covenant'] },
    { id: 'cycle-ab', code: '@Ab', name: 'Abrahamic Cycle', description: 'Covenant, faith, promised seed', tags: ['cycle', 'covenant', 'abraham', 'faith', 'promise'] },
    { id: 'cycle-mo', code: '@Mo', name: 'Mosaic Cycle', description: 'Exodus, law, tabernacle', tags: ['cycle', 'exodus', 'moses', 'law', 'sanctuary'] },
    { id: 'cycle-da', code: '@Da', name: 'Davidic Cycle', description: 'Kingdom, throne, Messiah', tags: ['cycle', 'kingdom', 'david', 'throne', 'messiah'] },
    { id: 'cycle-cy', code: '@Cy', name: 'Cyrusic Cycle', description: 'Captivity, return, restoration', tags: ['cycle', 'exile', 'cyrus', 'restoration', 'return'] },
    { id: 'cycle-sp', code: '@Sp', name: 'Spirit Cycle', description: 'Pentecost, church, mission', tags: ['cycle', 'pentecost', 'spirit', 'church', 'mission'] },
    { id: 'cycle-re', code: '@Re', name: 'Restoration Cycle', description: 'Second Coming, new earth', tags: ['cycle', 'restoration', 'second-coming', 'new-earth', 'eschatology'] },
  ];

  cycles.forEach(c => {
    cards.push({
      id: c.id,
      code: c.code,
      name: c.name,
      floor: 6,
      category: 'Cycles',
      icon: 'RefreshCw',
      tags: c.tags,
      description: c.description,
    });
  });

  // Time Zones
  const timeZones = [
    { id: 'tz-hp', code: 'H-Past', name: 'Heaven Past', description: 'What heaven did before', tags: ['timezone', 'heaven', 'past'] },
    { id: 'tz-hn', code: 'H-Now', name: 'Heaven Now', description: 'What heaven is doing now', tags: ['timezone', 'heaven', 'present'] },
    { id: 'tz-hf', code: 'H-Future', name: 'Heaven Future', description: 'What heaven will do', tags: ['timezone', 'heaven', 'future', 'eschatology'] },
    { id: 'tz-ep', code: 'E-Past', name: 'Earth Past', description: 'Earthly events that led to this', tags: ['timezone', 'earth', 'past', 'history'] },
    { id: 'tz-en', code: 'E-Now', name: 'Earth Now', description: 'Current earthly situation', tags: ['timezone', 'earth', 'present', 'application'] },
    { id: 'tz-ef', code: 'E-Future', name: 'Earth Future', description: 'Future result on earth', tags: ['timezone', 'earth', 'future', 'eschatology'] },
  ];

  timeZones.forEach(tz => {
    cards.push({
      id: tz.id,
      code: tz.code,
      name: tz.name,
      floor: 4,
      category: 'Time Zones',
      icon: 'Clock',
      tags: tz.tags,
      description: tz.description,
    });
  });

  return cards;
}

// All Scrabble cards combined
let _allCards: ScrabbleCard[] | null = null;

export function getAllScrabbleCards(): ScrabbleCard[] {
  if (!_allCards) {
    _allCards = [
      ...generateRoomCards(),
      ...generateSubPrincipleCards(),
      ...generateSpecialCards(),
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
