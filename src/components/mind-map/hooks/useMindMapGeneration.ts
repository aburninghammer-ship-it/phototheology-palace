import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AnalysisMode, AIMapAnalysis, GenerationState, PrincipleData } from '../types';
import { palaceFloors, sanctuaryElements } from '../constants';

interface UseMindMapGenerationReturn {
  generate: (text: string, mode: AnalysisMode, fullStudy?: boolean) => Promise<AIMapAnalysis | null>;
  state: GenerationState;
  reset: () => void;
}

const CANONICAL_ROOM_IDS = new Set(palaceFloors.flatMap((floor) => floor.rooms.map((room) => room.id)));
const ROOM_FLOOR_MAP = new Map(palaceFloors.flatMap((floor) => floor.rooms.map((room) => [room.id, floor.number] as const)));
const CANONICAL_SANCTUARY_IDS = new Set(sanctuaryElements.map((element) => element.id));

const ROOM_ID_ALIASES: Record<string, string> = {
  '24': '24fps',
  '24fps-room': '24fps',
  'story-room': 'sr',
  'story': 'sr',
  'imagination-room': 'ir',
  'imagination': 'ir',
  'translation-room': 'tr',
  'translation': 'tr',
  'gems-room': 'gr',
  'gems': 'gr',
  'observation-room': 'or',
  'observation': 'or',
  'def-com-room': 'dc',
  'def-com': 'dc',
  'defcom': 'dc',
  'questions-room': 'qr',
  'questions': 'qr',
  'q-and-a-room': 'qa',
  'qa-room': 'qa',
  'q-and-a': 'qa',
  'nature-freestyle': 'nf',
  'nature': 'nf',
  'personal-freestyle': 'pf',
  'personal': 'pf',
  'bible-freestyle': 'bf',
  'history-social-freestyle': 'hf',
  'history-freestyle': 'hf',
  'history': 'hf',
  'listening-room': 'lr',
  'listening': 'lr',
  'concentration-room': 'cr',
  'concentration': 'cr',
  'dimensions-room': 'dr',
  'dimensions': 'dr',
  'connect-6-room': 'c6',
  'connect-6': 'c6',
  'connect6': 'c6',
  'theme-room': 'trm',
  'theme': 'trm',
  'time-zone-room': 'tz',
  'time-zone': 'tz',
  'timezone': 'tz',
  'patterns': 'prm',
  'patterns-room': 'prm',
  'parallels': 'p||',
  'parallels-room': 'p||',
  'fruit-room': 'frt',
  'fruit': 'frt',
  'blue': 'bl',
  'blue-room': 'bl',
  'blue-room-sanctuary': 'bl',
  'sanctuary': 'bl',
  'prophecy-room': 'pr',
  'prophecy': 'pr',
  'three-angels': '3a',
  'three-angels-room': '3a',
  'three-angels\'': '3a',
  'feasts-room': 'fe',
  'feasts': 'fe',
  'christ-every-chapter': 'cec',
  'christ-in-every-chapter': 'cec',
  'room66': 'r66',
  'room-66': 'r66',
  'three-heavens': '123h',
  'three-heavens-room': '123h',
  'heavens-room': '123h',
  'heavens': '123h',
  '1h-2h-3h': '123h',
  '1h/2h/3h': '123h',
  '1h2h3h': '123h',
  'three_heavens': '123h',
  'threeheavens': '123h',
  'cycles-room': 'cycles',
  'eight-cycles': 'cycles',
  'eight_cycles': 'cycles',
  'juice-room': 'jr',
  'juice': 'jr',
  'mathematics-room': 'math',
  'mathematics': 'math',
  'fire-room': 'frm',
  'fire': 'frm',
  'meditation-room': 'mr',
  'meditation': 'mr',
  'speed-room': 'srm',
  'speed': 'srm',
  'infinity-room': 'infinity',
  'reflexive-mastery': 'infinity',
  'reflexive': 'infinity',
  'freestyle-master': 'freestyle',
  'palace-freestyle': 'freestyle',
};

const SANCTUARY_ID_ALIASES: Record<string, string> = {
  'altar-of-burnt-offering': 'altar-burnt-offering',
  'bronze-laver': 'laver',
  'golden-lampstand': 'lampstand',
  'table-of-showbread': 'table-showbread',
  'altar-of-incense': 'altar-incense',
  'ark-of-the-covenant': 'ark-covenant',
};

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/[_\s]+/g, '-');

const getCanonicalRoomId = (roomId: string) => ROOM_ID_ALIASES[normalizeKey(roomId)] ?? roomId;
const getCanonicalSanctuaryId = (elementId: string) => SANCTUARY_ID_ALIASES[normalizeKey(elementId)] ?? elementId;

function mergeUniquePrinciples(existing: PrincipleData[] = [], incoming: PrincipleData[] = []): PrincipleData[] {
  const seen = new Set<string>();

  return [...existing, ...incoming]
    .filter(Boolean)
    .filter((principle) => {
      const key = [principle.id, principle.content, principle.insight].filter(Boolean).join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeMindMapAnalysis(analysis: AIMapAnalysis): AIMapAnalysis {
  const roomAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  Object.entries(analysis.roomAnalysis || {}).forEach(([rawRoomId, rawRoomData]) => {
    const canonicalRoomId = getCanonicalRoomId(rawRoomId);
    if (!CANONICAL_ROOM_IDS.has(canonicalRoomId)) return;

    const incomingRoomData = {
      applicable: Boolean(rawRoomData?.applicable),
      principles: Array.isArray(rawRoomData?.principles) ? rawRoomData.principles.filter(Boolean) : [],
    };

    const existingRoomData = roomAnalysis[canonicalRoomId];
    roomAnalysis[canonicalRoomId] = existingRoomData
      ? {
          applicable: existingRoomData.applicable || incomingRoomData.applicable,
          principles: mergeUniquePrinciples(existingRoomData.principles, incomingRoomData.principles),
        }
      : incomingRoomData;
  });

  const sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = analysis.sanctuaryAnalysis ? {} : undefined;

  if (analysis.sanctuaryAnalysis && sanctuaryAnalysis) {
    Object.entries(analysis.sanctuaryAnalysis).forEach(([rawElementId, rawElementData]) => {
      const canonicalElementId = getCanonicalSanctuaryId(rawElementId);
      if (!CANONICAL_SANCTUARY_IDS.has(canonicalElementId)) return;

      const incomingElementData = {
        applicable: Boolean(rawElementData?.applicable),
        insights: Array.isArray(rawElementData?.insights) ? rawElementData.insights.filter(Boolean) : [],
      };

      const existingElementData = sanctuaryAnalysis[canonicalElementId];
      sanctuaryAnalysis[canonicalElementId] = existingElementData
        ? {
            applicable: existingElementData.applicable || incomingElementData.applicable,
            insights: mergeUniquePrinciples(existingElementData.insights, incomingElementData.insights),
          }
        : incomingElementData;
    });
  }

  const blueRoomBackfill = Object.entries(sanctuaryAnalysis || {}).flatMap(([elementId, elementData]) =>
    elementData.applicable
      ? (elementData.insights || []).map((insight, index) => ({
          ...insight,
          id: insight.id || `bl-${elementId}-${index}`,
        }))
      : []
  );

  if (blueRoomBackfill.length > 0) {
    const existingBlueRoom = roomAnalysis.bl;
    roomAnalysis.bl = {
      applicable: true,
      principles: mergeUniquePrinciples(existingBlueRoom?.principles || [], blueRoomBackfill),
    };
  }

  const relevantFloors = new Set(analysis.relevantFloors || []);
  Object.entries(roomAnalysis).forEach(([roomId, roomData]) => {
    if (!roomData.applicable && roomData.principles.length === 0) return;
    const floorNumber = ROOM_FLOOR_MAP.get(roomId);
    if (floorNumber) relevantFloors.add(floorNumber);
  });

  return {
    ...analysis,
    relevantFloors: Array.from(relevantFloors).sort((a, b) => a - b),
    roomAnalysis,
    sanctuaryAnalysis,
  };
}

export function useMindMapGeneration(): UseMindMapGenerationReturn {
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
  });

  const reset = useCallback(() => {
    setState({ status: 'idle', progress: 0 });
  }, []);

  const generate = useCallback(async (text: string, mode: AnalysisMode, fullStudy: boolean = false): Promise<AIMapAnalysis | null> => {
    setState({ status: 'generating', progress: 10, message: fullStudy ? 'Generating full study mind map...' : 'Preparing analysis...' });

    try {
      const { data, error } = await supabase.functions.invoke('mind-map-analyze', {
        body: { text, mode, fullStudy },
      });

      if (error) {
        console.error('Mind map analysis error:', error);
        setState({
          status: 'error',
          progress: 0,
          error: error.message || 'Failed to analyze text',
        });
        return null;
      }

      setState({ status: 'generating', progress: 50, message: 'Processing results...' });

      const analysis = normalizeMindMapAnalysis(data as AIMapAnalysis);

      if (!analysis.relevantFloors || !analysis.roomAnalysis) {
        throw new Error('Invalid analysis response structure');
      }

      setState({ status: 'complete', progress: 100, message: 'Analysis complete!' });

      return analysis;
    } catch (err) {
      console.error('Mind map generation error:', err);
      setState({
        status: 'error',
        progress: 0,
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
      return null;
    }
  }, []);

  return { generate, state, reset };
}

// Comprehensive Bible study analysis for mind map
export function generateMockAnalysis(text: string, mode: AnalysisMode): AIMapAnalysis {
  const textLower = text.toLowerCase();
  const textPreview = text.substring(0, 100);

  // Detect if this is Genesis 3:15 (Protoevangelium)
  const isGenesis315 = textLower.includes('genesis 3:15') || textLower.includes('gen 3:15') ||
    (textLower.includes('seed') && textLower.includes('bruise') && textLower.includes('head'));

  const makePrinciple = (
    content: string,
    evidence: string[],
    insight: string,
    visualHook: string,
    scriptures: string[],
    confidence: number = 85,
    application?: string
  ): PrincipleData => ({
    id: `principle-${Math.random().toString(36).substr(2, 9)}`,
    content,
    evidence,
    insight,
    application,
    visualHook,
    confidence,
    scriptures,
  });

  // If Genesis 3:15, generate specific deep study
  if (isGenesis315) {
    return generateGenesis315Study(makePrinciple);
  }

  // Generic comprehensive study for other texts
  return generateGenericStudy(text, textPreview, makePrinciple);
}

function generateGenesis315Study(
  makePrinciple: (content: string, evidence: string[], insight: string, visualHook: string, scriptures: string[], confidence?: number, application?: string) => PrincipleData
): AIMapAnalysis {
  const roomAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  // FLOOR 1: FURNISHING - Story & Imagination
  roomAnalysis['sr'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'The Protoevangelium: First Gospel Promise',
        [
          '"And I will put enmity between thee and the woman" - Divine initiative begins the conflict',
          '"Between thy seed and her seed" - Two lineages established in cosmic warfare',
          '"It shall bruise thy head, and thou shalt bruise his heel" - Victory through suffering'
        ],
        'Genesis 3:15 is the first Messianic prophecy in Scripture. Immediately after the Fall, God announces His redemptive plan. This is not an afterthought—it reveals that salvation was prepared "before the foundation of the world" (1 Peter 1:20). The narrative structure shows: 1) Problem (sin enters), 2) Promise (Deliverer announced), 3) Prophecy (method of victory revealed).',
        'A serpent coiled around a tree, while above it a heel descends from heaven, poised to crush its head—yet bearing a wound',
        ['Genesis 3:15', '1 Peter 1:20', 'Revelation 13:8'],
        95,
        'When you face the consequences of sin—yours or others\'—remember that God had the solution before the problem existed. Rest in His sovereign plan and share this hope with others who feel their situation is hopeless.'
      ),
      makePrinciple(
        'The 5-Beat Narrative Arc of Redemption',
        [
          'Beat 1: Creation perfection (Genesis 1-2)',
          'Beat 2: Fall and curse (Genesis 3:1-14)',
          'Beat 3: Promise of deliverance (Genesis 3:15)',
          'Beat 4: Immediate consequences and covering (Genesis 3:16-21)',
          'Beat 5: Exile with hope (Genesis 3:22-24)'
        ],
        'The entire Bible narrative is compressed into Genesis 3. Every subsequent story echoes this pattern: paradise, fall, promise, sacrifice, and restoration. This 5-beat structure becomes the template for understanding all of Scripture.',
        'A spiral staircase descending into darkness, then ascending through a doorway of light',
        ['Genesis 3', 'Romans 5:12-21', 'Revelation 21:1-5'],
        90,
        'Use this 5-beat pattern to analyze your own life story: Where did you start? Where did you fall? What promise has God given? What sacrifice has been made? What restoration awaits? Share your testimony using this structure.'
      ),
    ],
  };

  roomAnalysis['ir'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'The Seed Imagery: Biological and Spiritual',
        [
          '"Her seed" - Unique phrase suggesting virgin birth (seed normally comes from man)',
          'Seed = offspring, lineage, and the Messiah Himself',
          'Dual meaning: immediate descendants AND the ultimate Seed (Christ)'
        ],
        'The Hebrew word "zera" (seed) carries profound imagery. Plants produce after their kind—but this Seed would be different. Coming from the woman alone, this Seed would be fully human yet not of Adam\'s corrupted line. Paul confirms: "Now to Abraham and his seed were the promises made... which is Christ" (Galatians 3:16).',
        'A single golden seed falling into dark soil, from which grows a tree whose branches reach to heaven',
        ['Galatians 3:16', 'Isaiah 7:14', 'Matthew 1:23'],
        92,
        'Like a seed, God\'s Word planted in your heart will grow. What spiritual seeds are you planting today through your words and actions? Are you nurturing the good seeds or allowing weeds to grow?'
      ),
      makePrinciple(
        'The Bruising Imagery: Wound and Victory',
        [
          '"Bruise thy head" - Fatal, crushing blow to the serpent',
          '"Bruise his heel" - Painful but not fatal wound to the Seed',
          'Same Hebrew word (shuph) used for both—yet vastly different outcomes'
        ],
        'The imagery is visceral and precise. A heel wound is painful and slows the warrior, but a head wound is fatal. At Calvary, Satan struck Christ\'s heel (death on the cross), but Christ crushed Satan\'s head (destroying death itself). The Resurrection proves whose wound was fatal.',
        'A warrior\'s sandaled foot pressing down on a serpent\'s skull, with blood flowing from the heel but the serpent lifeless',
        ['Hebrews 2:14', 'Colossians 2:15', 'Romans 16:20'],
        94,
        'Your struggles may wound you, but they cannot destroy you if you are in Christ. The enemy\'s attacks are "heel wounds"—painful but temporary. Stand firm knowing the battle is already won.'
      ),
    ],
  };

  // FLOOR 2: INVESTIGATION - Observation & Symbols
  roomAnalysis['or'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Grammatical Observations: "Her Seed" Anomaly',
        [
          'In Hebrew culture, lineage traced through the father',
          '"Seed of the woman" is grammatically unusual—seed belongs to men',
          'This anomaly points to virgin birth centuries before Isaiah 7:14'
        ],
        'Careful observation reveals that God chose His words precisely. By saying "her seed" rather than "his seed" or "their seed," God encoded the virgin birth into the very first Messianic prophecy. Mary would conceive without a human father—the Seed would be hers alone, yet divine.',
        'A Hebrew scroll with the words "her seed" glowing golden while surrounding text remains ordinary',
        ['Isaiah 7:14', 'Luke 1:35', 'Matthew 1:20'],
        93
      ),
      makePrinciple(
        'The Divine "I Will" - God\'s Initiative',
        [
          '"I will put enmity" - God actively creates the conflict',
          'Enmity is placed, not natural—without God, humanity would follow Satan',
          'Grace precedes human response throughout Scripture'
        ],
        'Notice who acts: "I WILL put enmity." Left to ourselves after the Fall, we would have no desire to oppose Satan. God Himself creates the hostility between humanity and evil. This is prevenient grace—God moving first, enabling us to choose Him. Salvation is His work from the very first word.',
        'A divine hand reaching down to place a burning coal of holy hatred for evil in a human heart',
        ['Ephesians 2:1-5', 'John 6:44', 'Romans 5:8'],
        91
      ),
    ],
  };

  roomAnalysis['st'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'The Serpent as Type of Satan',
        [
          'Serpent = "nachash" (shining one, whisperer)',
          'Most subtle/crafty of all creatures',
          'Later identified explicitly as Satan (Revelation 12:9, 20:2)'
        ],
        'The serpent is both literal and symbolic. A real creature was used, but behind it stood "that old serpent, called the Devil, and Satan" (Rev 12:9). Throughout Scripture, serpent imagery represents Satan\'s work: deception (2 Cor 11:3), curse (Numbers 21), and ultimate defeat (Rev 20:10).',
        'A bronze serpent lifted on a pole in the wilderness, foreshadowing Christ lifted on the cross',
        ['Numbers 21:8-9', 'John 3:14-15', 'Revelation 12:9'],
        90
      ),
      makePrinciple(
        'The Covering of Skins: First Sacrifice',
        [
          'God made "coats of skins" (Genesis 3:21)',
          'Skins require death—first blood sacrifice',
          'God provides the covering man cannot provide for himself'
        ],
        'Immediately after the promise of Genesis 3:15, God demonstrates its meaning through type. Animals died to cover Adam and Eve\'s shame. This is the first sacrifice—innocent blood covering guilty sinners. The pattern is established: without shedding of blood, there is no remission (Hebrews 9:22).',
        'Innocent lambs being slain while their skins are fashioned into garments of covering',
        ['Genesis 3:21', 'Hebrews 9:22', 'Isaiah 61:10'],
        92
      ),
    ],
  };

  // FLOOR 3: FREESTYLE - Cross-References
  roomAnalysis['bf'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'The Scarlet Thread: Genesis to Revelation',
        [
          'Genesis 3:15 → Revelation 20:10 (serpent\'s final doom)',
          'The "Seed" promise traced through Seth, Noah, Shem, Abraham, Judah, David, to Christ',
          'Every major covenant advances the Genesis 3:15 promise'
        ],
        'The promise of Genesis 3:15 is the scarlet thread running through all of Scripture. It\'s advanced through the Abrahamic covenant (Genesis 12), narrowed through Judah (Genesis 49:10), specified through David (2 Samuel 7), and fulfilled in Christ (Matthew 1:1). The Bible is one story with one Hero.',
        'A crimson thread weaving through 66 books, connecting Garden to New Jerusalem',
        ['Genesis 49:10', '2 Samuel 7:12-13', 'Matthew 1:1', 'Revelation 22:16'],
        95
      ),
      makePrinciple(
        'New Testament Fulfillment Citations',
        [
          'Romans 16:20 - "The God of peace shall bruise Satan under your feet shortly"',
          'Galatians 4:4 - "Made of a woman" (seed of the woman)',
          'Hebrews 2:14 - "Through death he might destroy him that had the power of death"'
        ],
        'The New Testament explicitly connects Christ\'s work to Genesis 3:15. Paul tells the Romans that Satan will be "bruised" under their feet—the same word from Genesis. The incarnation ("made of a woman"), crucifixion, and resurrection together fulfill the ancient promise of the woman\'s Seed crushing the serpent.',
        'An open Bible with golden light connecting Old Testament promises to New Testament fulfillments',
        ['Romans 16:20', 'Galatians 4:4', 'Hebrews 2:14', '1 John 3:8'],
        94
      ),
    ],
  };

  // FLOOR 4: NEXT LEVEL - Christ Connections
  roomAnalysis['cec'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Christ as THE Seed of the Woman',
        [
          'Born of a virgin—literally "seed of woman" with no human father',
          'Fully human (of woman) yet fully divine (conceived by Holy Spirit)',
          'The long-awaited Deliverer promised since Eden'
        ],
        'Jesus Christ is the Seed of Genesis 3:15. His virgin birth fulfills the unusual grammar—He is literally "her seed," not "his seed." Born of Mary, conceived by the Holy Spirit, He entered humanity\'s line without inheriting Adam\'s corrupted nature. He is the Second Adam, succeeding where the first failed.',
        'Mary holding the infant Christ while a defeated serpent writhes beneath the manger',
        ['Matthew 1:18-23', 'Luke 1:35', 'Romans 5:14-19', 'Galatians 4:4'],
        96,
        'Worship Jesus today for who He truly is: fully God and fully man, the promised Deliverer. Let the reality of the incarnation shape how you pray, knowing He understands human weakness yet reigns with divine power.'
      ),
      makePrinciple(
        'Calvary: The Bruising Fulfilled',
        [
          'Christ\'s heel bruised: "It pleased the LORD to bruise him" (Isaiah 53:10)',
          'Serpent\'s head crushed: "having spoiled principalities and powers" (Colossians 2:15)',
          'The cross looked like defeat but was actually victory'
        ],
        'At Calvary, both bruisings occurred. Satan struck Christ\'s heel—causing real suffering and death. But in that very act, Christ crushed Satan\'s head—disarming him, triumphing over him, and destroying his power of death. The Resurrection proved which wound was fatal. Jesus rose; Satan remains defeated.',
        'The cross silhouetted against a dark sky, with a serpent crushed beneath its base and light breaking through from an empty tomb beyond',
        ['Isaiah 53:10', 'Colossians 2:15', 'Hebrews 2:14-15', '1 Corinthians 15:55-57'],
        97,
        'Live as a victor, not a victim. When Satan accuses you, remind him of Calvary. When fear grips you, remember the empty tomb. Declare out loud: "The battle is already won!"'
      ),
      makePrinciple(
        'The Second Adam Theology',
        [
          'First Adam: brought sin, death, condemnation',
          'Second Adam (Christ): brings righteousness, life, justification',
          'Romans 5:12-21 explicitly develops this parallel'
        ],
        'Paul calls Christ "the last Adam" (1 Cor 15:45). Where Adam failed the test in a perfect garden, Christ succeeded in a hostile wilderness. Where Adam\'s one act brought death to all, Christ\'s one act brings life to all who believe. Genesis 3:15 promised this reversal—One would come to undo what Adam did.',
        'Two figures: one falling in a garden of plenty, one rising in a garden tomb',
        ['Romans 5:12-21', '1 Corinthians 15:21-22', '1 Corinthians 15:45'],
        94,
        'You are "in Christ"—not "in Adam." Let this identity define you. When tempted, remember that you have a better representative who already passed every test. Draw on His victory.'
      ),
    ],
  };

  roomAnalysis['trm'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Theme: Cosmic Warfare Between Two Seeds',
        [
          'Seed of the woman vs. seed of the serpent',
          'This conflict runs through all of Scripture',
          'Cain vs. Abel, Israel vs. nations, Christ vs. Satan'
        ],
        'Genesis 3:15 establishes the central conflict of the Bible: two seeds locked in warfare. Throughout Scripture, we see the serpent\'s seed opposing the woman\'s seed—Cain killing Abel, Pharaoh killing Hebrew children, Herod slaughtering infants, Satan tempting Christ. The conflict culminates at Calvary and concludes in Revelation 20.',
        'Two armies facing each other across history, with the cross as the decisive battleground',
        ['Genesis 4:8', 'Matthew 2:16', 'Revelation 12:1-17'],
        93
      ),
    ],
  };

  // FLOOR 5: VISION - Prophecy
  roomAnalysis['pr'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'The First Messianic Prophecy',
        [
          'Spoken by God Himself (not through a prophet)',
          'Given before any human institution existed',
          'Universal in scope—affecting all humanity'
        ],
        'Genesis 3:15 is called the "Protoevangelium"—the first gospel. Before there were priests, prophets, or kings, God Himself announced the coming Redeemer. This prophecy spans 4,000 years to its fulfillment and will continue to its complete realization when Satan is finally cast into the lake of fire (Revelation 20:10).',
        'A single bright star appearing in Eden\'s sky, the same star that will guide wise men millennia later',
        ['Genesis 3:15', 'Micah 5:2', 'Matthew 2:1-2', 'Revelation 20:10'],
        95
      ),
      makePrinciple(
        'Progressive Revelation of the Seed',
        [
          'Genesis 3:15 - Seed of the woman (humanity)',
          'Genesis 12:3 - Seed of Abraham (one nation)',
          'Genesis 49:10 - From Judah (one tribe)',
          '2 Samuel 7:12 - David\'s line (one family)',
          'Micah 5:2 - From Bethlehem (one town)'
        ],
        'God progressively narrows the identity of the promised Seed. From all humanity, to one nation (Israel), to one tribe (Judah), to one family (David\'s), to one town (Bethlehem). By the time Christ arrives, His identity markers are unmistakable—fulfilling hundreds of specific prophecies.',
        'A funnel of light narrowing from a broad beam to a single point shining on Bethlehem\'s manger',
        ['Genesis 12:3', 'Genesis 49:10', '2 Samuel 7:12-13', 'Micah 5:2', 'Matthew 2:5-6'],
        94
      ),
    ],
  };

  // FLOOR 7: SPIRITUAL - Sanctuary
  roomAnalysis['srm'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Eden as the First Sanctuary',
        [
          'God walked in the garden (His presence dwelt there)',
          'Cherubim guard the entrance (as they later guard the Most Holy Place)',
          'Tree of Life at center (later represented by Ark of the Covenant)'
        ],
        'Eden was the first sanctuary—the place where God dwelt with humanity. After sin, cherubim guard the way to the Tree of Life, just as cherubim later guard the Mercy Seat. The tabernacle and temple were designed to recreate Eden, pointing forward to the day when God would again dwell with man (Revelation 21:3).',
        'The Garden of Eden transforming into the tabernacle, then the temple, then the New Jerusalem',
        ['Genesis 3:24', 'Exodus 25:18-22', 'Revelation 21:3', 'Revelation 22:2'],
        91
      ),
    ],
  };

  // SANCTUARY ANALYSIS
  const sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = {};

  sanctuaryAnalysis['altar-of-burnt-offering'] = {
    applicable: true,
    insights: [
      makePrinciple(
        'The First Sacrifice Anticipates Calvary',
        [
          'Genesis 3:21 - God killed animals to clothe Adam and Eve',
          'This is the first death in Scripture—death for covering',
          'Pattern established: innocent dies for guilty'
        ],
        'The very chapter containing the promise of Genesis 3:15 also contains the first sacrifice. God Himself killed the animals and clothed the sinners. This is the gospel in miniature: we cannot cover ourselves; God must provide the covering through the death of the innocent.',
        'A brazen altar with flames ascending, transforming into the cross of Calvary',
        ['Genesis 3:21', 'Hebrews 9:22', 'John 1:29'],
        93
      ),
    ],
  };

  sanctuaryAnalysis['mercy-seat'] = {
    applicable: true,
    insights: [
      makePrinciple(
        'Mercy Promised at the Place of Judgment',
        [
          'Genesis 3:15 pronounced in context of curse and judgment',
          'Yet mercy breaks through—a Deliverer is promised',
          'The Mercy Seat is where God\'s justice and mercy meet'
        ],
        'In the moment of pronouncing curse, God proclaims mercy. Genesis 3:15 is a mercy seat moment—judgment deserved, mercy given. The blood-sprinkled Mercy Seat in the Most Holy Place visualizes what Genesis 3:15 promises: God\'s wrath satisfied through sacrifice, and sinners welcomed into His presence.',
        'Blood being sprinkled on the golden Mercy Seat while cherubim look on, their faces turned toward the blood',
        ['Exodus 25:17-22', 'Romans 3:25', 'Hebrews 9:5', '1 John 2:2'],
        92
      ),
    ],
  };

  return {
    overallTheme: 'Genesis 3:15—the Protoevangelium—reveals God\'s redemptive plan through the promised Seed of the woman who would crush the serpent\'s head while suffering a wound Himself. This prophecy finds its fulfillment in Jesus Christ\'s virgin birth, atoning death, and victorious resurrection.',
    relevantFloors: [1, 2, 3, 4, 5, 6, 7, 8], // All 8 floors
    roomAnalysis: ensureAllRoomsIncluded(roomAnalysis),
    sanctuaryAnalysis: ensureAllSanctuaryElementsIncluded(sanctuaryAnalysis),
    crossConnections: [
      { from: 'sr', to: 'cec', type: 'typological', description: 'The narrative of the Fall points directly to Christ as the promised Seed' },
      { from: 'st', to: 'altar-of-burnt-offering', type: 'typological', description: 'The first sacrifice types forward to the altar and ultimately to Calvary' },
      { from: 'pr', to: 'cec', type: 'thematic', description: 'All Messianic prophecy converges on Christ' },
      { from: 'or', to: 'ir', type: 'thematic', description: 'Grammatical observations illuminate the seed imagery' },
    ],
  };
}

function generateGenericStudy(
  text: string,
  textPreview: string,
  makePrinciple: (content: string, evidence: string[], insight: string, visualHook: string, scriptures: string[], confidence?: number, application?: string) => PrincipleData
): AIMapAnalysis {
  const roomAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  // Floor 1: Furnishing
  roomAnalysis['sr'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Narrative Structure Analysis',
        [textPreview + '...', 'The text follows a discernible structural pattern'],
        'Every passage of Scripture contributes to the grand narrative of redemption. Understanding the story structure helps us see how this text fits into God\'s larger purpose.',
        'A staircase ascending through clouds toward a throne of light',
        ['Luke 24:27', 'Romans 15:4'],
        85
      ),
      makePrinciple(
        'Divine Purpose in the Narrative',
        ['The text reveals God\'s intentional design', 'Providence guides the events described'],
        'God is the author of both Scripture and history. Nothing in this passage is accidental—every detail serves His redemptive purpose.',
        'A master weaver working golden threads into an intricate tapestry',
        ['Ephesians 1:11', 'Romans 8:28'],
        82
      ),
    ],
  };

  roomAnalysis['ir'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Visual Imagery in the Text',
        ['Scripture uses concrete images to convey spiritual truths', textPreview.substring(0, 50) + '...'],
        'The Holy Spirit inspired specific imagery for a reason. Meditating on these word pictures helps us internalize truth in a memorable way.',
        'A garden scene with hidden treasures beneath the surface',
        ['Proverbs 25:2', 'Psalm 119:18'],
        80
      ),
    ],
  };

  // Floor 2: Investigation
  roomAnalysis['or'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Key Observations from the Text',
        ['Careful reading reveals significant patterns', 'Word choices carry theological weight', textPreview.substring(0, 40) + '...'],
        'The discipline of observation is foundational to Bible study. Before interpreting, we must observe what the text actually says. The Holy Spirit rewards careful attention to detail.',
        'A magnifying glass hovering over an ancient scroll, revealing hidden words',
        ['2 Timothy 2:15', 'Acts 17:11'],
        88
      ),
      makePrinciple(
        'Contextual Considerations',
        ['Historical setting illuminates meaning', 'Original audience expectations matter'],
        'Understanding who wrote this, to whom, when, and why helps us grasp the intended meaning before applying it to ourselves.',
        'An ancient city scene with scribes and readers gathered around a scroll',
        ['Nehemiah 8:8', '2 Peter 1:20-21'],
        83
      ),
    ],
  };

  roomAnalysis['st'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Types and Shadows Present',
        ['Old Testament realities foreshadow New Testament fulfillments', 'Patterns repeat with escalating significance'],
        'Scripture is filled with typology—persons, events, and institutions that prefigure Christ and His work. Recognizing these types enriches our understanding of both Testaments.',
        'Shadows giving way to brilliant light, revealing the substance',
        ['Colossians 2:17', 'Hebrews 10:1', 'Hebrews 8:5'],
        85
      ),
    ],
  };

  // Floor 3: Freestyle
  roomAnalysis['bf'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Cross-Reference Connections',
        ['Scripture interprets Scripture', 'Related passages illuminate this text'],
        'The Bible is its own best commentary. When we compare scripture with scripture, obscure passages become clear and familiar passages gain depth.',
        'Multiple streams converging into one powerful river',
        ['Isaiah 28:10', '1 Corinthians 2:13'],
        86
      ),
      makePrinciple(
        'Theological Threads',
        ['Major biblical themes appear in this passage', 'Covenant connections emerge'],
        'Every text connects to the major themes of Scripture: creation, fall, redemption, and restoration. Finding these connections places the passage in its proper theological context.',
        'Golden threads woven through the entire fabric of Scripture',
        ['2 Timothy 3:16-17', 'Romans 11:36'],
        84
      ),
    ],
  };

  // Floor 4: Next Level
  roomAnalysis['cec'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Christ Revealed in This Passage',
        ['Jesus said all Scripture testifies of Him', 'The Old Testament anticipates, the New Testament reveals'],
        'Every chapter of the Bible points to Jesus Christ. He is the hero of the story, the fulfillment of every promise, and the answer to every human need. Finding Christ in every text is not eisegesis—it is what Jesus Himself taught (Luke 24:27).',
        'A radiant figure standing at the center of a grand tapestry, where all threads converge',
        ['John 5:39', 'Luke 24:27', 'Luke 24:44'],
        90
      ),
      makePrinciple(
        'Redemptive Purpose',
        ['God\'s plan of salvation is woven throughout', 'Grace precedes and follows every text'],
        'The Bible is fundamentally a book about redemption. This passage contributes to that grand story, either by showing the need for a Savior or pointing to the provision of one.',
        'A crimson thread running from Genesis to Revelation',
        ['Ephesians 1:7-10', 'Titus 2:11-14'],
        88
      ),
    ],
  };

  roomAnalysis['trm'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Central Theme Identification',
        ['A unifying theme emerges from careful study', 'The main idea connects to Scripture\'s grand theme'],
        'Every passage has a central truth God wants to communicate. Identifying this theme helps us organize the details and remember the message.',
        'A single golden thread running through many colored fabrics',
        ['Romans 15:4', 'Hebrews 4:12'],
        85
      ),
    ],
  };

  // Floor 5: Vision
  roomAnalysis['pr'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Prophetic Dimensions',
        ['Future implications emerge from the text', 'Eschatological connections present'],
        'Much of Scripture looks forward to future fulfillments. Even historical narratives carry prophetic significance, pointing to Christ\'s first and second comings.',
        'A lantern illuminating a path through the night toward a glorious dawn',
        ['2 Peter 1:19', 'Revelation 19:10'],
        80
      ),
    ],
  };

  // Floor 7: Spiritual
  roomAnalysis['srm'] = {
    applicable: true,
    principles: [
      makePrinciple(
        'Sanctuary Connections',
        ['The earthly sanctuary illustrated heavenly realities', 'Tabernacle/temple imagery appears throughout Scripture'],
        'The sanctuary is God\'s visual aid for the plan of salvation. Its furniture, services, and structure all teach about Christ\'s person and work. Finding sanctuary connections in any passage deepens our understanding of redemption.',
        'The temple structure pointing to heaven itself, with Christ as High Priest',
        ['Hebrews 8:1-5', 'Hebrews 9:23-24'],
        83
      ),
    ],
  };

  // Sanctuary analysis
  const sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = {};

  sanctuaryAnalysis['altar-of-burnt-offering'] = {
    applicable: true,
    insights: [
      makePrinciple(
        'Sacrifice and Atonement Theme',
        ['The cross is prefigured in every sacrifice', 'Substitutionary death is God\'s provision'],
        'The altar of burnt offering represents complete surrender and substitutionary atonement. Christ\'s death on the cross fulfilled what every animal sacrifice could only symbolize—the just dying for the unjust.',
        'Flames consuming the offering while smoke ascends heavenward to God\'s throne',
        ['Hebrews 10:10-12', 'Romans 12:1', 'John 1:29'],
        87
      ),
    ],
  };

  sanctuaryAnalysis['mercy-seat'] = {
    applicable: true,
    insights: [
      makePrinciple(
        'Mercy and Grace Throne',
        ['God\'s justice and mercy meet at the mercy seat', 'Blood applied makes approach possible'],
        'The mercy seat (hilasterion—"propitiation") is where God\'s wrath is satisfied and sinners find acceptance. Through Christ\'s blood, we have boldness to approach the throne of grace.',
        'A golden throne with cherubim overshadowing, blood sprinkled between them',
        ['Hebrews 4:16', 'Romans 3:25', '1 John 2:2'],
        88
      ),
    ],
  };

  return {
    overallTheme: 'This text reveals patterns of divine redemption and points to Christ through narrative, typology, and prophetic insight. The Phototheology Palace framework helps us explore its riches systematically.',
    relevantFloors: [1, 2, 3, 4, 5, 6, 7, 8], // All 8 floors
    roomAnalysis: ensureAllRoomsIncluded(roomAnalysis),
    sanctuaryAnalysis: ensureAllSanctuaryElementsIncluded(sanctuaryAnalysis),
    crossConnections: [
      { from: 'sr', to: 'cec', type: 'typological', description: 'The narrative structure foreshadows Christ\'s redemptive work' },
      { from: 'st', to: 'srm', type: 'thematic', description: 'Types and symbols connect to sanctuary imagery' },
      { from: 'or', to: 'bf', type: 'thematic', description: 'Observations lead to cross-reference discoveries' },
    ],
  };
}

// Helper: Ensure ALL rooms are included in the analysis (including "Not Applicable" ones)
function ensureAllRoomsIncluded(roomAnalysis: AIMapAnalysis['roomAnalysis']): AIMapAnalysis['roomAnalysis'] {
  const completeAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  // Iterate through all floors and all rooms
  palaceFloors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      if (roomAnalysis[room.id]) {
        // Room has analysis - keep it
        completeAnalysis[room.id] = roomAnalysis[room.id];
      } else {
        // Room not analyzed - mark as not applicable
        completeAnalysis[room.id] = {
          applicable: false,
          principles: [],
        };
      }
    });
  });

  return completeAnalysis;
}

// Helper: Ensure ALL sanctuary elements are included
function ensureAllSanctuaryElementsIncluded(
  sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] | undefined
): AIMapAnalysis['sanctuaryAnalysis'] {
  const completeAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = {};

  sanctuaryElements.forEach((element) => {
    if (sanctuaryAnalysis && sanctuaryAnalysis[element.id]) {
      completeAnalysis[element.id] = sanctuaryAnalysis[element.id];
    } else {
      completeAnalysis[element.id] = {
        applicable: false,
        insights: [],
      };
    }
  });

  return completeAnalysis;
}

// Generate empty scaffold showing ALL rooms for manual study
export function generateEmptyScaffold(): AIMapAnalysis {
  // Include all 8 floors
  const relevantFloors = [1, 2, 3, 4, 5, 6, 7, 8];

  // Create empty room analysis for ALL rooms across all floors
  const roomAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  palaceFloors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      roomAnalysis[room.id] = {
        applicable: true, // Show all rooms as available for exploration
        principles: [], // Empty - user will add their own insights
      };
    });
  });

  // Create empty sanctuary analysis for ALL elements
  const sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = {};

  sanctuaryElements.forEach((element) => {
    sanctuaryAnalysis[element.id] = {
      applicable: true, // Show all sanctuary elements
      insights: [], // Empty - user will add their own insights
    };
  });

  return {
    overallTheme: 'Manual study mode - explore all 38+ rooms and add your own insights',
    relevantFloors,
    roomAnalysis,
    sanctuaryAnalysis,
    crossConnections: [],
  };
}
